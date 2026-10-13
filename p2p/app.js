/* Local file -> authenticated WebRTC data channel -> streaming browser video. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),video=$('video'),P=KinoProtocol;
  const params=new URLSearchParams(location.hash.slice(1));
  const viewer=Boolean(params.get('host'));
  const connections=new Set(),pending=new Map();
  let file=null,objectURL=null,peer=null,conn=null,roomKey='',media=null,session='',state=null;
  let transferred=0,lastBytes=0,lastStats=performance.now(),rtt=0,following=false,internalSeek=false;
  let joinTimer=null,reconnectTimer=null,selectedGeneration=0,requestSequence=0,roomGeneration=0;
  let pingTimer=null,signalReady=false,stopped=false,viewerGeneration=0;
  const random=bytes=>Array.from(crypto.getRandomValues(new Uint8Array(bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  const status=text=>$('status').textContent=text;
  const fail=text=>{status(text);if(viewer)$('retry').hidden=false;};
  function mimeFor(local){const ext=local.name.split('.').pop().toLowerCase();return ({mp4:'video/mp4',m4v:'video/mp4',mov:'video/quicktime',webm:'video/webm',ogv:'video/ogg'})[ext]||local.type||'application/octet-stream';}
  function settings(){
    const server=$('signal').value.trim();
    const opts={debug:0};
    if(server){
      const url=new URL(server);
      if(!['http:','https:'].includes(url.protocol))throw new Error('连接服务地址需要以 http:// 或 https:// 开头');
      if(location.protocol==='https:'&&url.protocol==='http:')throw new Error('在线页面需要使用 HTTPS 连接服务');
      opts.host=url.hostname;opts.port=Number(url.port)||(url.protocol==='https:'?443:80);opts.secure=url.protocol==='https:';opts.path=url.pathname;
    }
    const turn=$('turn').value.trim();
    if(turn){
      if(!/^turns?:[^\s]+$/.test(turn))throw new Error('TURN 地址格式不正确');
      opts.config={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:turn,username:$('turn-user').value,credential:$('turn-password').value}]};
    }
    return opts;
  }
  function send(connection,msg){if(connection?.open)connection.send(msg);}
  function hostState(){return {type:'state',position:video.currentTime,paused:video.paused||video.ended,ended:video.ended};}
  function broadcast(){if(viewer)return;const s=hostState();for(const c of connections)send(c,s);}
  function updateAudience(){$('audience').textContent=`${connections.size} 位观众`;}
  function updatePosition(){
    $('position').textContent=`${P.formatTime(video.currentTime)} / ${P.formatTime(video.duration)}`;
    let ahead=0;
    for(let i=0;i<video.buffered.length;i++)if(video.buffered.start(i)<=video.currentTime+.1&&video.buffered.end(i)>=video.currentTime)ahead=video.buffered.end(i)-video.currentTime;
    $('buffer').textContent=video.readyState>=1?`${viewer?'已缓冲 '+Math.round(ahead)+' 秒':'本地影片'}${video.paused?' · 已暂停':''}`:'等待影片载入';
    if(!viewer)$('host-play').textContent=video.paused?'开始放映':'暂停放映';
  }
  function rejectPending(message){for(const entry of pending.values()){clearTimeout(entry.timer);entry.port.postMessage({error:message});entry.port.close();}pending.clear();}
  function closeViewer(){
    clearTimeout(joinTimer);clearInterval(pingTimer);pingTimer=null;
    following=false;session='';media=null;state=null;rejectPending('连接已关闭');
    if(conn){const old=conn;conn=null;old.close();}
    if(peer){peer.destroy();peer=null;}
    video.pause();video.removeAttribute('src');video.load();
  }
  function stopHost(){
    roomGeneration++;clearTimeout(reconnectTimer);signalReady=false;
    for(const c of connections){send(c,{type:'end'});c.close();}connections.clear();updateAudience();
    if(peer){peer.destroy();peer=null;}roomKey='';$('share').hidden=true;
    $('connection').textContent='未创建房间';$('name').disabled=false;$('create').disabled=!file||video.readyState<1;
  }
  async function selectFile(){
    const selected=$('file').files[0];if(!selected)return;
    const generation=++selectedGeneration;
    stopHost();video.pause();file=selected;transferred=0;lastBytes=0;
    $('create').disabled=true;$('name').value=selected.name.replace(/\.[^.]+$/,'');
    $('movie-title').textContent=$('name').value;
    if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(selected);
    video.src=objectURL;video.load();status('正在读取本地影片信息…');
    try{
      await new Promise((resolve,reject)=>{
        const loaded=()=>{cleanup();resolve();},error=()=>{cleanup();reject(new Error('浏览器无法播放这部影片。请使用 H.264/AAC MP4 或可播放的 WebM。'));};
        const timer=setTimeout(()=>{cleanup();reject(new Error('读取影片信息超时，请重新选择文件。'));},20000);
        function cleanup(){clearTimeout(timer);video.removeEventListener('loadedmetadata',loaded);video.removeEventListener('error',error);}
        video.addEventListener('loadedmetadata',loaded);video.addEventListener('error',error);
      });
      if(generation!==selectedGeneration)return;
      if(!Number.isFinite(video.duration)||video.duration<=0)throw new Error('无法读取影片时长。');
      $('create').disabled=false;$('host-play').hidden=false;status('影片已就绪。创建房间后，点击开始放映。');updatePosition();
    }catch(error){if(generation===selectedGeneration)fail(error.message);}
  }
  function acceptViewer(c,generation){
    let authorized=false,busy=0;
    const timeout=setTimeout(()=>c.close(),10000);
    c.on('data',async msg=>{
      if(!msg||typeof msg.type!=='string')return;
      if(!authorized){
        if(msg.type!=='hello'||msg.key!==roomKey||generation!==roomGeneration||!file||connections.size>=8){c.close();return;}
        authorized=true;clearTimeout(timeout);connections.add(c);updateAudience();
        send(c,{type:'metadata',name:$('name').value.trim()||file.name,size:file.size,mime:mimeFor(file),duration:video.duration});send(c,hostState());
        status('房间已连接。观众将跟随你的播放进度。');return;
      }
      if(msg.type==='ping'){send(c,{type:'pong',time:msg.time});return;}
      if(msg.type!=='read')return;
      if(generation!==roomGeneration||!P.validRead(msg,file.size)||busy>=8){send(c,{type:'read-error',id:msg.id,error:'无效的影片分片请求'});return;}
      busy++;const current=file;
      try{
        const bytes=await current.slice(msg.start,msg.start+msg.length).arrayBuffer();
        if(!c.open||generation!==roomGeneration)return;
        send(c,{type:'chunk',id:msg.id,bytes});transferred+=bytes.byteLength;
      }catch{send(c,{type:'read-error',id:msg.id,error:'读取本地影片失败'});}
      finally{busy--;}
    });
    c.on('close',()=>{clearTimeout(timeout);connections.delete(c);updateAudience();});
    c.on('error',()=>{connections.delete(c);updateAudience();});
  }
  function signalEvents(p,isViewer){
    p.on('disconnected',()=>{
      if(p!==peer)return;
      signalReady=false;$('connection').textContent='连接服务暂时断开';
      status('连接服务暂时断开，已建立的连接可继续播放；正在恢复新观众入口。');
      clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{if(p===peer&&!p.destroyed&&p.disconnected)p.reconnect();},2000);
    });
    p.on('error',error=>{
      if(p!==peer)return;
      if(error.type==='peer-unavailable')fail('主机已离线或房间已结束，请让主机重新分享链接。');
      else if(!['disconnected'].includes(error.type))fail('连接未成功，请检查网络；可在连接设置中配置其他连接服务或 TURN 中继。');
      if(!isViewer)$('create').disabled=false;
    });
  }
  function createRoom(){
    if(!file||video.readyState<1)return;
    let options;try{options=settings();}catch(error){fail(error.message);return;}
    stopHost();stopped=false;roomKey=random(24);const generation=roomGeneration;
    $('create').disabled=true;$('name').disabled=true;status('正在创建房间…');$('connection').textContent='连接中';
    if(typeof Peer==='undefined'){fail('连接库未载入，请刷新页面。');$('create').disabled=false;return;}
    const p=peer=new Peer(options);signalEvents(p,false);
    const timeout=setTimeout(()=>{if(p===peer&&!signalReady){p.destroy();peer=null;$('create').disabled=false;fail('连接服务响应超时，请检查网络后重试。');}},20000);
    p.on('open',id=>{
      clearTimeout(timeout);if(p!==peer)return;signalReady=true;
      const link=new URL(location.href);link.search='';
      const room=new URLSearchParams({host:id,key:roomKey});if($('signal').value.trim())room.set('server',$('signal').value.trim());
      link.hash=room.toString();$('room-link').value=link.href;$('open-viewer').href=link.href;$('share').hidden=false;
      $('movie-title').textContent=$('name').value.trim()||file.name;
      $('connection').textContent='主机已就绪';status('房间已创建。分享链接后，在播放器里点击播放开始放映。');
    });
    p.on('connection',c=>acceptViewer(c,generation));
  }
  async function ensureBridge(){
    if(!navigator.serviceWorker||!window.isSecureContext)throw new Error('请在 HTTPS 页面或 localhost 中打开观众链接。');
    await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller)await new Promise((resolve,reject)=>{
      const done=()=>{if(navigator.serviceWorker.controller){clearTimeout(timer);navigator.serviceWorker.removeEventListener('controllerchange',done);resolve();}};
      const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',done);reject(new Error('播放器初始化失败，请刷新页面后重试。'));},8000);
      navigator.serviceWorker.addEventListener('controllerchange',done);done();
    });
  }
  navigator.serviceWorker?.addEventListener('message',event=>{
    const msg=event.data,port=event.ports[0];if(!port)return;
    if(!viewer||!media||msg.session!==session||!conn?.open){port.postMessage({error:'主机尚未连接'});port.close();return;}
    if(msg.type==='media-info'){port.postMessage({size:media.size,mime:media.mime});port.close();return;}
    if(msg.type!=='media-read'){port.postMessage({error:'未知请求'});port.close();return;}
    const id=String(++requestSequence),request={type:'read',id,start:msg.start,length:msg.length};
    if(!P.validRead(request,media.size)){port.postMessage({error:'影片范围无效'});port.close();return;}
    const timer=setTimeout(()=>{pending.delete(id);port.postMessage({error:'主机响应超时，请重新连接'});port.close();fail('影片接收超时，请检查主机网络后重新连接。');},20000);
    pending.set(id,{port,timer});send(conn,request);
  });
  async function joinRoom(){
    const generation=++viewerGeneration;
    closeViewer();stopped=false;$('retry').hidden=true;$('follow').hidden=true;
    if(!params.get('key')||!params.get('host')){fail('房间链接不完整，请重新向主机索取。');return;}
    status('正在连接主机…');$('connection').textContent='连接中';
    try{await ensureBridge();}catch(error){if(generation===viewerGeneration)fail(error.message);return;}
    if(generation!==viewerGeneration)return;
    let options;try{options=settings();}catch(error){fail(error.message);return;}
    if(typeof Peer==='undefined'){fail('连接库未载入，请刷新页面。');return;}
    const p=peer=new Peer(options);signalEvents(p,true);
    joinTimer=setTimeout(()=>{if(!media)fail('未能连接主机。请确认主机页面打开；直连失败时双方可配置 TURN 中继后重试。');},25000);
    p.on('open',()=>{
      if(p!==peer)return;signalReady=true;
      if(conn?.open)return;
      const c=conn=p.connect(params.get('host'),{reliable:true,serialization:'binary'});
      c.on('open',()=>send(c,{type:'hello',key:params.get('key')}));
      c.on('data',msg=>receive(c,msg));
      c.on('close',()=>{
        if(c!==conn)return;
        rejectPending('主机连接已关闭');following=false;video.pause();media=null;clearInterval(pingTimer);
        if(stopped)return;
        $('connection').textContent='主机已断开';$('follow').hidden=true;fail('主机已断开。请确认主机保持开机，再重新连接。');
      });
      c.on('error',()=>{if(c===conn)fail('与主机的连接失败，请重试或配置 TURN 中继。');});
    });
  }
  function receive(c,msg){
    if(c!==conn||!msg||typeof msg.type!=='string')return;
    if(msg.type==='metadata'){
      if(!Number.isSafeInteger(msg.size)||msg.size<=0||!Number.isFinite(msg.duration)||msg.duration<=0)return fail('主机影片信息无效。');
      clearTimeout(joinTimer);media={size:msg.size,mime:String(msg.mime),duration:msg.duration};session=random(16);
      $('movie-title').textContent=String(msg.name).slice(0,160);$('connection').textContent='已连接主机 · P2P';
      video.src=new URL('media/'+session,location.href).href;video.load();following=true;
      $('follow').hidden=false;status('影片正在缓冲，点击播放即可跟随主机。');
      const ping=()=>send(c,{type:'ping',time:performance.now()});ping();clearInterval(pingTimer);pingTimer=setInterval(ping,5000);
    }else if(msg.type==='chunk'||msg.type==='read-error'){
      const entry=pending.get(msg.id);if(!entry)return;pending.delete(msg.id);clearTimeout(entry.timer);
      if(msg.type==='read-error'){entry.port.postMessage({error:String(msg.error)});entry.port.close();return;}
      let bytes=msg.bytes;if(ArrayBuffer.isView(bytes))bytes=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
      if(!(bytes instanceof ArrayBuffer)){entry.port.postMessage({error:'分片格式错误'});entry.port.close();return;}
      transferred+=bytes.byteLength;entry.port.postMessage({bytes},[bytes]);entry.port.close();
    }else if(msg.type==='state'){
      if(!Number.isFinite(msg.position)||msg.position<0)return;
      state={position:msg.position,paused:Boolean(msg.paused),ended:Boolean(msg.ended),receivedAt:performance.now()};synchronize();
    }else if(msg.type==='pong'){
      if(Number.isFinite(msg.time)){rtt=Math.max(0,performance.now()-msg.time);$('latency').textContent=`往返延迟 ${Math.round(rtt)} ms`;}
    }else if(msg.type==='end'){
      stopped=true;following=false;rejectPending('房间已结束');video.pause();media=null;
      $('connection').textContent='房间已结束';status('主机已结束本场放映。');$('follow').hidden=true;$('retry').hidden=true;
    }
  }
  function synchronize(){
    if(!viewer||!following||!state||!media||video.readyState<1||video.error)return;
    const target=Math.min(media.duration,P.targetPosition(state,performance.now(),Math.min(rtt/2,2000)));
    if(Math.abs(video.currentTime-target)>1.5){internalSeek=true;video.currentTime=target;}
    if(state.paused){video.pause();status(state.ended?'本场放映已结束':'主机已暂停 · 等待继续');return;}
    if(video.paused){video.play().then(()=>{$('follow').hidden=true;status('正在放映 · 跟随主机');}).catch(()=>{$('follow').hidden=false;status('点击播放即可跟随主机。');});}
    else{status('正在放映 · 跟随主机');$('follow').hidden=true;}
  }
  $('file').addEventListener('change',selectFile);
  $('name').addEventListener('input',()=>{if(!peer)$('movie-title').textContent=$('name').value.trim()||file?.name||'等待选择影片';});
  $('create').addEventListener('click',createRoom);
  $('host-play').addEventListener('click',()=>{if(video.paused)video.play().catch(()=>fail('影片未能播放，请检查文件格式。'));else video.pause();});
  $('end').addEventListener('click',()=>{stopped=true;video.pause();stopHost();status('房间已结束，可以重新创建房间。');});
  $('retry').addEventListener('click',joinRoom);
  $('follow').addEventListener('click',()=>{following=true;if(state&&!state.paused)video.play().catch(()=>fail('播放被浏览器阻止，请再次点击播放。'));synchronize();});
  $('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('room-link').value);$('copy').textContent='已复制';setTimeout(()=>$('copy').textContent='复制链接',1500);}catch{$('room-link').select();status('请复制输入框中的房间链接。');}});
  $('fullscreen').addEventListener('click',async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen();else if($('screen').requestFullscreen)await $('screen').requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else fail('当前浏览器不支持此全屏方式，请使用播放器自带的全屏按钮。');}catch{fail('全屏未开启，请使用播放器自带的全屏按钮。');}
  });
  document.addEventListener('fullscreenchange',()=>$('fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏');
  for(const event of ['timeupdate','loadedmetadata','progress','pause','playing','durationchange'])video.addEventListener(event,updatePosition);
  for(const event of ['play','pause','seeked','ended'])video.addEventListener(event,()=>{if(!viewer)broadcast();});
  video.addEventListener('seeking',()=>{if(viewer&&!internalSeek&&state){status('观众进度将跟随主机；点击跟随播放可恢复。');}});
  video.addEventListener('seeked',()=>{internalSeek=false;if(viewer)synchronize();});
  video.addEventListener('loadedmetadata',()=>{if(viewer)synchronize();});
  video.addEventListener('waiting',()=>{if(viewer&&media)status('正在缓冲 · 等待主机的影片分片');});
  video.addEventListener('error',()=>{if(viewer&&media)fail('影片加载失败。请重新连接；若仍失败，检查影片格式或主机网络。');});
  setInterval(()=>{if(viewer)synchronize();else broadcast();},1000);
  setInterval(()=>{
    const now=performance.now(),speed=(transferred-lastBytes)/(now-lastStats)*1000;lastStats=now;lastBytes=transferred;
    $('transfer').textContent=`${viewer?'已接收':'已传输'} ${(transferred/1048576).toFixed(1)} MB · ${(speed/1048576).toFixed(2)} MB/s`;
  },1000);
  window.addEventListener('beforeunload',()=>{if(peer)peer.destroy();if(objectURL)URL.revokeObjectURL(objectURL);});
  window.addEventListener('hashchange',()=>location.reload());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&viewer)synchronize();});
  if(viewer){
    $('setup').hidden=true;$('role').textContent='观众';$('intro').textContent='连接主机，和朋友一起看电影。';$('movie-title').textContent='等待主机影片';
    if(params.get('server'))$('signal').value=params.get('server');
    joinRoom();
  }
})();
