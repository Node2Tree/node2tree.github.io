(() => {
  'use strict';
  const $=id=>document.getElementById(id),video=$('video'),P=KinoProtocol,isHost=document.body.dataset.host==='true';
  const backend=new URL(location.hostname==='127.0.0.1'?'http://127.0.0.1:8787':KINO_CONFIG.backend);
  let socket=null,selfId='',room=null,activeHost=false,ice=[],file=null,objectURL=null,media=null,session='',state=null;
  let current=null,sequence=0,epoch='',rtt=0,playPending=false,gestureNeeded=false,internalSeek=false,lastCorrection=0;
  let reconnect=null,joinTimer=null,nameTimer=null,action=null,stale=0,loadedGeneration=0,kicked=false;
  const peers=new Map(),pending=new Map();
  const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
  function notice(text,fn=null,label='重试'){$('message').textContent=text;$('overlay').hidden=false;action=fn;$('action').hidden=!fn;$('action').textContent=label;}
  const hideNotice=()=>{$('overlay').hidden=true;action=null;};
  const send=msg=>{if(socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify(msg));};
  function title(value){$('title').textContent=value;$('fullscreen-title').textContent=value;}
  function rejectReads(){for(const p of pending.values()){clearTimeout(p.timer);p.port.postMessage({error:'放映连接已切换'});p.port.close();}pending.clear();}
  function closePeer(p){if(!p)return;clearTimeout(p.timer);p.closed=true;p.dc?.close();p.pc.close();}
  function resetPeers(){for(const p of peers.values())closePeer(p);peers.clear();closePeer(current);current=null;rejectReads();media=null;session='';state=null;internalSeek=false;lastCorrection=0;clearTimeout(joinTimer);}
  function loseHost(text){activeHost=false;resetPeers();video.pause();$('host-controls').hidden=true;$('login').hidden=false;$('password').value='';$('claim').disabled=socket?.readyState!==WebSocket.OPEN;notice(text);}
  function mime(local){return ({mp4:'video/mp4',m4v:'video/mp4',mov:'video/quicktime',webm:'video/webm',ogv:'video/ogg'})[local.name.split('.').pop().toLowerCase()]||local.type||'application/octet-stream';}
  function publish(){if(activeHost&&file&&video.readyState>=1)send({type:'publish',movie:{name:$('name').value.trim()||file.name,size:file.size,mime:mime(file),duration:video.duration}});}
  async function chooseFile(){
    const selected=$('file').files[0];if(!selected||!activeHost)return;
    const generation=++loadedGeneration;resetPeers();send({type:'stop'});video.pause();file=selected;$('host-play').disabled=true;
    $('name').value=file.name.replace(/\.[^.]+$/,'');title($('name').value);
    if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(file);video.src=objectURL;
    notice('正在读取影片');video.load();
    try{
      await new Promise((resolve,reject)=>{
        const ready=()=>{cleanup();resolve();},failed=()=>{cleanup();reject(new Error('无法播放此影片，请使用浏览器支持的 MP4 或 WebM。'));};
        const timer=setTimeout(()=>{cleanup();reject(new Error('读取影片超时，请重新选择。'));},20000);
        function cleanup(){clearTimeout(timer);video.removeEventListener('loadedmetadata',ready);video.removeEventListener('error',failed);}
        video.addEventListener('loadedmetadata',ready);video.addEventListener('error',failed);
      });
      if(generation!==loadedGeneration||!activeHost)return;
      if(!Number.isFinite(video.duration)||video.duration<=0)throw new Error('无法读取影片时长。');
      $('host-play').disabled=false;publish();hideNotice();
    }catch(error){if(generation===loadedGeneration)notice(error.message);}
  }
  function signal(to,data){send({type:'signal',to,epoch,data});}
  function setupPC(id,host){
    const pc=new RTCPeerConnection({iceServers:ice,iceTransportPolicy:new URLSearchParams(location.search).has('relay')?'relay':'all'});
    const p={id,pc,host,epoch,closed:false,candidates:[],header:null};
    pc.onicecandidate=e=>{if(e.candidate&&!p.closed&&p.epoch===epoch){video.dataset.iceTypes=[...new Set((video.dataset.iceTypes||'').split(',').filter(Boolean).concat(e.candidate.type))].join(',');signal(id,{candidate:e.candidate.toJSON()});}};
    pc.onicecandidateerror=e=>{video.dataset.iceError=String(e.errorCode);};
    pc.onconnectionstatechange=()=>{
      video.dataset.connectionState=pc.connectionState;
      if(p.closed||p.epoch!==epoch)return;
      if(['failed','closed'].includes(pc.connectionState)){
        if(host){peers.delete(id);closePeer(p);}else{notice('连接中断',join,'重新连接');closePeer(p);}
      }
    };
    if(host){p.dc=pc.createDataChannel('movie',{ordered:true});setupChannel(p);}else pc.ondatachannel=e=>{p.dc=e.channel;setupChannel(p);};
    return p;
  }
  async function negotiateViewer(id){
    if(!activeHost||!room?.movie)return;
    closePeer(peers.get(id));const p=setupPC(id,true);peers.set(id,p);
    try{await p.pc.setLocalDescription(await p.pc.createOffer());if(!p.closed&&p.epoch===epoch)signal(id,{sdp:p.pc.localDescription.toJSON()});}catch{closePeer(p);peers.delete(id);}
  }
  async function handleSignal(msg){
    if(msg.epoch!==epoch)return;
    let p;
    if(isHost){if(!activeHost)return;p=peers.get(msg.from);if(!p)return;}
    else{
      if(msg.from!==room?.host||!room.movie)return;
      p=current;
      if(!p||p.closed){p=current=setupPC(msg.from,false);}
    }
    try{
      if(msg.data.sdp){
        await p.pc.setRemoteDescription(msg.data.sdp);
        for(const c of p.candidates)await p.pc.addIceCandidate(c);p.candidates=[];
        if(msg.data.sdp.type==='offer'){
          await p.pc.setLocalDescription(await p.pc.createAnswer());if(!p.closed&&p.epoch===epoch)signal(p.id,{sdp:p.pc.localDescription.toJSON()});
        }
      }else if(msg.data.candidate){if(p.pc.remoteDescription)await p.pc.addIceCandidate(msg.data.candidate);else p.candidates.push(msg.data.candidate);}
    }catch{if(!p.host)notice('连接未成功',join,'重试');}
  }
  function channelSend(p,msg){if(!p.closed&&p.dc?.readyState==='open')p.dc.send(JSON.stringify(msg));}
  function playbackState(){return {type:'state',position:video.currentTime,paused:video.paused||video.ended,ended:video.ended};}
  function broadcast(){if(!activeHost)return;for(const p of peers.values())channelSend(p,playbackState());}
  function setupChannel(p){
    const dc=p.dc;dc.binaryType='arraybuffer';
    dc.onopen=()=>{
      if(p.closed||p.epoch!==epoch)return;
      if(p.host){channelSend(p,{type:'metadata',...room.movie});channelSend(p,playbackState());}
      else{clearTimeout(joinTimer);channelSend(p,{type:'ping',time:performance.now()});}
    };
    dc.onmessage=async event=>{
      if(p.closed||p.epoch!==epoch)return;
      if(event.data instanceof ArrayBuffer){
        const header=p.header;p.header=null;if(!header)return;
        const entry=pending.get(header.id);if(!entry)return;pending.delete(header.id);clearTimeout(entry.timer);video.dataset.receivedBytes=String(Number(video.dataset.receivedBytes||0)+event.data.byteLength);
        if(event.data.byteLength!==entry.length){entry.port.postMessage({error:'影片分片异常'});}else entry.port.postMessage({bytes:event.data},[event.data]);entry.port.close();return;
      }
      let msg;try{msg=JSON.parse(event.data);}catch{return;}
      if(p.host){
        if(!activeHost||!file)return;
        if(msg.type==='ping'){channelSend(p,{type:'pong',time:msg.time});return;}
        if(msg.type!=='read'||!P.validRead(msg,file.size))return;
        video.dataset.lastRead=String(msg.start);const f=file,bytes=await f.slice(msg.start,msg.start+msg.length).arrayBuffer();
        if(!activeHost||p.closed||p.epoch!==epoch||f!==file||dc.readyState!=='open')return;
        channelSend(p,{type:'chunk',id:msg.id,length:bytes.byteLength});dc.send(bytes);
      }else if(msg.type==='chunk'){p.header=msg;}
      else if(msg.type==='metadata'){
        if(!Number.isSafeInteger(msg.size)||msg.size<=0)return;
        media={size:msg.size,mime:msg.mime,duration:msg.duration};session=random();
        video.src=new URL('/cinema/media/'+session,location.origin).href;video.load();notice('正在缓冲');
      }else if(msg.type==='state'){
        if(!Number.isFinite(msg.position))return;
        state={position:msg.position,paused:!!msg.paused,ended:!!msg.ended,receivedAt:performance.now()};sync();
      }else if(msg.type==='pong'&&Number.isFinite(msg.time))rtt=Math.min(4000,performance.now()-msg.time);
    };
    dc.onclose=()=>{if(p.closed)return;if(p.host){peers.delete(p.id);closePeer(p);}else{rejectReads();if(room?.movie)notice('连接中断',join,'重新连接');}};
  }
  async function bridge(){
    if(!navigator.serviceWorker)throw new Error('当前浏览器不支持此播放器');
    await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller)await new Promise((resolve,reject)=>{
      const listener=()=>{if(navigator.serviceWorker.controller){clearTimeout(timer);navigator.serviceWorker.removeEventListener('controllerchange',listener);resolve();}};
      const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',listener);reject(new Error('播放器初始化失败，请刷新。'));},8000);navigator.serviceWorker.addEventListener('controllerchange',listener);listener();
    });
  }
  async function join(){
    if(isHost||!room?.movie)return;
    closePeer(current);current=null;rejectReads();clearTimeout(joinTimer);video.pause();media=null;session='';state=null;lastCorrection=0;
    notice('正在连接放映');const target=epoch;
    try{await bridge();if(target!==epoch)return;send({type:'join',epoch});joinTimer=setTimeout(()=>{if(!current?.dc||current.dc.readyState!=='open')notice('暂时无法连接',join,'重试');},25000);}catch(error){notice(error.message,join,'重试');}
  }
  navigator.serviceWorker?.addEventListener('message',e=>{
    const m=e.data,port=e.ports[0];if(!port)return;
    if(!media||m.session!==session||current?.dc?.readyState!=='open'){port.postMessage({error:'放映尚未连接'});port.close();return;}
    if(m.type==='media-info'){port.postMessage({size:media.size,mime:media.mime});port.close();return;}
    const id=String(++sequence),msg={type:'read',id,start:m.start,length:m.length};
    if(m.type!=='media-read'||!P.validRead(msg,media.size)){port.postMessage({error:'无效分片'});port.close();return;}
    const timer=setTimeout(()=>{pending.delete(id);port.postMessage({error:'接收超时'});port.close();notice('影片接收超时',join,'重新连接');},20000);
    pending.set(id,{port,timer,length:m.length});channelSend(current,msg);
  });
  function play(){
    if(playPending||gestureNeeded)return;
    playPending=true;video.play().then(()=>{hideNotice();}).catch(()=>{gestureNeeded=true;notice('点击开始观看',()=>{gestureNeeded=false;video.play().then(hideNotice).catch(()=>notice('请点击播放器的播放按钮'));},'播放');}).finally(()=>playPending=false);
  }
  function sync(){
    if(isHost||!state||!media||video.readyState<1)return;
    const target=Math.min(media.duration,P.targetPosition(state,performance.now(),rtt/2));
    // Let a pending seek finish buffering before correcting a moving timeline again.
    if(Math.abs(video.currentTime-target)>1.5&&!video.seeking&&!internalSeek&&(!lastCorrection||(video.readyState>=3&&performance.now()-lastCorrection>5000))){internalSeek=true;lastCorrection=performance.now();video.currentTime=target;}
    if(state.ended){video.pause();notice('本场放映已结束');return;}
    if(state.paused){video.pause();notice('等待主机继续');return;}
    if(video.paused)play();else if(video.readyState>=3)hideNotice();
  }
  async function connect(){
    clearTimeout(reconnect);
    try{const result=await fetch(new URL('/ice',backend),{cache:'no-store'});if(!result.ok)throw new Error();ice=(await result.json()).iceServers;if(location.hostname!=='127.0.0.1'&&!ice.some(s=>(Array.isArray(s.urls)?s.urls:[s.urls]).some(u=>/^turns?:/.test(u))))throw new Error();}
    catch{notice('连接服务暂不可用',connect,'重试');return;}
    const url=new URL('/socket',backend);url.protocol=backend.protocol==='https:'?'wss:':'ws:';
    const ws=socket=new WebSocket(url);
    ws.onopen=()=>{stale=0;if(isHost)$('claim').disabled=false;};
    ws.onmessage=e=>{
      let m;try{m=JSON.parse(e.data);}catch{return;}
      if(ws!==socket)return;
      if(m.type==='welcome'){selfId=m.id;}
      else if(m.type==='claimed'){activeHost=true;kicked=false;epoch=m.epoch;$('login').hidden=true;$('host-controls').hidden=false;$('password').value='';notice('选择本地影片');if(file&&video.readyState>=1)publish();}
      else if(m.type==='auth-error'){$('claim').disabled=false;notice(m.message);}
      else if(m.type==='revoked'){kicked=true;loseHost('放映已由另一位主机接管');}
      else if(m.type==='room'){
        room=m;
        if(m.epoch!==epoch){epoch=m.epoch;resetPeers();if(!isHost){video.pause();video.removeAttribute('src');video.load();}}
        if(!isHost){title(m.movie?.name||'等待放映');if(m.movie&&!current)join();else if(!m.movie)notice('等待主机开场');}
      }else if(m.type==='join'&&isHost&&activeHost)negotiateViewer(m.viewer);
      else if(m.type==='signal')handleSignal(m);
      else if(m.type==='left'){closePeer(peers.get(m.viewer));peers.delete(m.viewer);}
      else if(m.type==='pong')stale=0;
    };
    ws.onclose=()=>{if(ws!==socket)return;if(isHost){loseHost(kicked?'放映已由另一位主机接管':'连接已断开，请重新输入口令');}else{resetPeers();video.pause();notice('正在重新连接');}reconnect=setTimeout(connect,2500);};
    ws.onerror=()=>{if(isHost)notice('连接服务暂不可用',connect,'重试');};
  }
  $('action').addEventListener('click',()=>action?.());
  $('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('screen').requestFullscreen)await $('screen').requestFullscreen();else video.webkitEnterFullscreen?.();}catch{}});
  for(const e of ['play','pause','seeked','ended'])video.addEventListener(e,()=>{if(isHost){$('host-play').textContent=video.paused?'开始放映':'暂停';broadcast();}});
  video.addEventListener('seeked',()=>{internalSeek=false;});
  video.addEventListener('loadedmetadata',()=>{if(!isHost)sync();});
  video.addEventListener('playing',()=>{if(!isHost||activeHost)hideNotice();});
  video.addEventListener('waiting',()=>{if(!isHost&&media)notice('正在缓冲');});
  video.addEventListener('error',()=>{if(!isHost&&media)notice('影片加载失败',join,'重新连接');});
  if(isHost){
    $('claim').disabled=true;
    $('login').addEventListener('submit',e=>{e.preventDefault();if(socket?.readyState!==WebSocket.OPEN)return;send({type:'claim',password:$('password').value});$('claim').disabled=true;});
    $('file').addEventListener('change',chooseFile);
    $('name').addEventListener('input',()=>{title($('name').value.trim()||file?.name||'主机入口');clearTimeout(nameTimer);nameTimer=setTimeout(publish,600);});
    $('name').addEventListener('change',()=>{clearTimeout(nameTimer);title($('name').value.trim()||file?.name||'主机入口');publish();});
    $('host-play').addEventListener('click',()=>{if(activeHost){if(video.paused)video.play().catch(()=>notice('影片无法播放'));else video.pause();}});
    $('stop').addEventListener('click',()=>{resetPeers();video.pause();send({type:'stop'});notice('本场放映已结束');});
  }
  setInterval(()=>{if(isHost)broadcast();else sync();},1000);
  setInterval(()=>{if(socket?.readyState===WebSocket.OPEN){if(stale++>2){socket.close();return;}send({type:'ping'});}if(current?.dc?.readyState==='open')channelSend(current,{type:'ping',time:performance.now()});},15000);
  window.addEventListener('beforeunload',()=>{resetPeers();socket?.close();if(objectURL)URL.revokeObjectURL(objectURL);});
  connect();
})();
