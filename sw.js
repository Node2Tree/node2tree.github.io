/* No file cache or cloud storage. Each response is streamed from the live page. */
importScripts('/cinema/protocol.js');
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
function ask(client,message,timeout=25000){
  return new Promise((resolve,reject)=>{
    const channel=new MessageChannel();
    const timer=setTimeout(()=>{channel.port1.close();reject(new Error('主机响应超时'));},timeout);
    channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();event.data?.error?reject(new Error(event.data.error)):resolve(event.data);};
    client.postMessage(message,[channel.port2]);
  });
}
async function mediaResponse(event,session){
  const client=await self.clients.get(event.clientId);
  if(!client)return new Response('观众页面已关闭',{status:410});
  let meta;
  try{meta=await ask(client,{type:'media-info',session},5000);}catch{return new Response('房间未连接',{status:503});}
  if(!meta||!Number.isSafeInteger(meta.size)||meta.size<=0)return new Response('影片不可用',{status:404});
  const range=KinoProtocol.parseRange(event.request.headers.get('Range'),meta.size);
  if(!range)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${meta.size}`}});
  const headers={'Content-Type':meta.mime||'video/mp4','Content-Length':String(range.end-range.start+1),'Accept-Ranges':'bytes','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(range.partial)headers['Content-Range']=`bytes ${range.start}-${range.end}/${meta.size}`;
  if(event.request.method==='HEAD')return new Response(null,{status:range.partial?206:200,headers});
  let offset=range.start,requested=range.start,cancelled=false;
  const queue=[];
  function fill(){
    while(!cancelled&&queue.length<8&&requested<=range.end){
      const start=requested,length=Math.min(KinoProtocol.CHUNK,range.end-start+1);requested+=length;
      queue.push({length,result:ask(client,{type:'media-read',session,start,length}).catch(error=>({error}))});
    }
  }
  const body=new ReadableStream({
    async pull(controller){
      if(cancelled)return;
      if(offset>range.end){controller.close();return;}
      fill();const next=queue.shift(),length=next.length;
      try{
        const chunk=await next.result;
        if(cancelled)return;
        if(chunk.error)throw chunk.error;
        if(!(chunk.bytes instanceof ArrayBuffer)||chunk.bytes.byteLength!==length)throw new Error('影片分片长度异常');
        controller.enqueue(new Uint8Array(chunk.bytes));offset+=length;
        if(offset>range.end)controller.close();else fill();
      }catch(error){if(!cancelled){cancelled=true;queue.length=0;controller.error(error);}}
    },cancel(){cancelled=true;queue.length=0;}
  });
  return new Response(body,{status:range.partial?206:200,headers});
}
self.addEventListener('fetch',event=>{
  const base=new URL('/cinema/media/',self.registration.scope);
  const url=new URL(event.request.url);
  if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
  if(!['GET','HEAD'].includes(event.request.method)){event.respondWith(new Response(null,{status:405}));return;}
  const session=url.pathname.slice(base.pathname.length);
  if(!/^[a-f0-9]{32}$/.test(session)){event.respondWith(new Response(null,{status:404}));return;}
  event.respondWith(mediaResponse(event,session));
});
