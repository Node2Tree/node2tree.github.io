/* The sole room coordinator. No movie bytes are accepted or stored here. */
const enc=new TextEncoder();
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...headers}});
const safeSend=(ws,data)=>{try{ws.send(JSON.stringify(data));}catch{}};
async function passwordMatches(input,expected){
  if(typeof input!=='string'||input.length>256||!expected)return false;
  const [a,b]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(input)),crypto.subtle.digest('SHA-256',enc.encode(expected))]);
  const x=new Uint8Array(a),y=new Uint8Array(b);let difference=0;for(let i=0;i<x.length;i++)difference|=x[i]^y[i];return difference===0;
}
export async function iceServers(env){
  if(env.TURN_KEY_ID&&env.TURN_API_TOKEN){
    const response=await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(env.TURN_KEY_ID)}/credentials/generate-ice-servers`,{method:'POST',headers:{Authorization:`Bearer ${env.TURN_API_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({ttl:21600})});
    if(!response.ok)throw new Error('TURN credential service unavailable');
    const result=await response.json();return result.iceServers;
  }
  if(env.DEV_ALLOW_DIRECT==='true')return env.DEV_ICE_SERVERS?JSON.parse(env.DEV_ICE_SERVERS):[{urls:'stun:stun.cloudflare.com:3478'}];
  throw new Error('TURN is not configured');
}
export default {
  async fetch(request,env){
    const url=new URL(request.url),origin=request.headers.get('Origin');
    const allowed=env.ALLOWED_ORIGIN||'https://node2tree.github.io';
    const local=allowed==='http://127.0.0.1:8765'&&origin==='http://127.0.0.1:8765';
    if(origin&&origin!==allowed&&!local)return json({error:'Origin denied'},403);
    const headers={'Access-Control-Allow-Origin':allowed,'Vary':'Origin'};
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
    if(url.pathname==='/health')return json({ok:true,passwordConfigured:Boolean(env.HOST_PASSWORD)},200,headers);
    if(url.pathname==='/ice'){
      try{return json({iceServers:await iceServers(env)},200,headers);}catch{return json({error:'中继服务暂不可用'},503,headers);}
    }
    if(url.pathname==='/socket'){
      if(request.headers.get('Upgrade')!=='websocket')return json({error:'WebSocket required'},426,headers);
      return env.ROOM.get(env.ROOM.idFromName('the-only-screening-room')).fetch(request);
    }
    return json({error:'Not found'},404,headers);
  }
};
export class KinoRoom {
  constructor(ctx,env){this.ctx=ctx;this.env=env;}
  attachment(ws){try{return ws.deserializeAttachment()||{};}catch{return {};}}
  host(){return this.ctx.getWebSockets().find(ws=>this.attachment(ws).role==='host');}
  snapshot(){const h=this.host(),a=h&&this.attachment(h);return {type:'room',host:a?.id||null,epoch:a?.epoch||null,movie:a?.movie||null};}
  broadcast(){const msg=this.snapshot();for(const ws of this.ctx.getWebSockets())safeSend(ws,msg);}
  async fetch(request){
    if(this.ctx.getWebSockets().length>=32)return new Response('Room full',{status:503});
    const pair=new WebSocketPair(),[client,server]=Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({id:crypto.randomUUID(),role:'viewer',attempts:0});
    safeSend(server,{type:'welcome',id:this.attachment(server).id});safeSend(server,this.snapshot());
    return new Response(null,{status:101,webSocket:client});
  }
  async webSocketMessage(ws,text){
    if(typeof text!=='string'||text.length>16000){ws.close(1009,'Invalid message');return;}
    let msg;try{msg=JSON.parse(text);}catch{return;}
    let a=this.attachment(ws);
    if(msg.type==='claim'){
      if(!this.env.HOST_PASSWORD){safeSend(ws,{type:'auth-error',message:'主机口令尚未设置'});return;}
      if(a.attempts>=5){safeSend(ws,{type:'auth-error',message:'尝试次数过多，请稍后重试'});return;}
      const bucket=Math.floor(Date.now()/600000),rate=await this.ctx.storage.get('login-rate')||{};
      const attempts=rate.bucket===bucket?rate.count:0;
      if(attempts>=20){safeSend(ws,{type:'auth-error',message:'尝试次数过多，请稍后重试'});return;}
      await this.ctx.storage.put('login-rate',{bucket,count:attempts+1});
      if(!await passwordMatches(msg.password,this.env.HOST_PASSWORD)){a.attempts++;ws.serializeAttachment(a);safeSend(ws,{type:'auth-error',message:'口令不正确'});return;}
      // Fencing happens synchronously after verification, before the new host is announced.
      for(const old of this.ctx.getWebSockets())if(old!==ws&&this.attachment(old).role==='host'){
        const revoked=this.attachment(old);revoked.role='revoked';old.serializeAttachment(revoked);safeSend(old,{type:'revoked'});old.close(4010,'Host replaced');
      }
      a={...a,role:'host',epoch:crypto.randomUUID(),movie:null,attempts:0};ws.serializeAttachment(a);safeSend(ws,{type:'claimed',epoch:a.epoch});this.broadcast();return;
    }
    const current=this.snapshot();
    if(msg.type==='publish'&&a.role==='host'&&a.id===current.host){
      const m=msg.movie;
      if(!m||typeof m.name!=='string'||m.name.length>160||!Number.isSafeInteger(m.size)||m.size<=0||!Number.isFinite(m.duration)||m.duration<=0)return;
      a.movie={name:m.name,size:m.size,duration:m.duration,mime:String(m.mime).slice(0,100)};a.epoch=crypto.randomUUID();ws.serializeAttachment(a);this.broadcast();return;
    }
    if(msg.type==='stop'&&a.role==='host'&&a.id===current.host){a.movie=null;a.epoch=crypto.randomUUID();ws.serializeAttachment(a);this.broadcast();return;}
    if(msg.type==='join'&&a.role==='viewer'&&current.movie&&msg.epoch===current.epoch){safeSend(this.host(),{type:'join',viewer:a.id,epoch:current.epoch});return;}
    if(msg.type==='signal'&&msg.epoch===current.epoch&&msg.data){
      const destination=this.ctx.getWebSockets().find(other=>this.attachment(other).id===msg.to);
      if(!destination)return;
      const dest=this.attachment(destination);
      if((a.role==='host'&&a.id===current.host&&dest.role==='viewer')||(a.role==='viewer'&&dest.role==='host'&&dest.id===current.host))safeSend(destination,{type:'signal',from:a.id,epoch:current.epoch,data:msg.data});
    }
    if(msg.type==='ping')safeSend(ws,{type:'pong'});
  }
  async webSocketClose(ws,code,reason){
    const a=this.attachment(ws);try{ws.close(code,reason);}catch{}
    if(a.role==='host'){a.role='closed';ws.serializeAttachment(a);this.broadcast();}
    else{const h=this.host();if(h)safeSend(h,{type:'left',viewer:a.id});}
  }
  async webSocketError(ws){return this.webSocketClose(ws,1011,'Connection error');}
}
