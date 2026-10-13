/* Shared, deterministic helpers for the range bridge and player. */
(function(root){
  'use strict';
  const CHUNK=64*1024;
  function parseRange(header,size){
    if(!Number.isSafeInteger(size)||size<=0) return null;
    if(!header) return {start:0,end:size-1,partial:false};
    const m=/^bytes=(\d*)-(\d*)$/.exec(header.trim());
    if(!m||(!m[1]&&!m[2])) return null;
    let start,end;
    if(!m[1]){const count=Number(m[2]);if(!Number.isSafeInteger(count)||count<=0)return null;start=Math.max(0,size-count);end=size-1;}
    else{start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1;}
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return null;
    return {start,end,partial:true};
  }
  function validRead(msg,size){return msg&&typeof msg.id==='string'&&msg.id.length<=100&&Number.isSafeInteger(msg.start)&&msg.start>=0&&Number.isSafeInteger(msg.length)&&msg.length>0&&msg.length<=CHUNK&&msg.start+msg.length<=size;}
  function formatTime(seconds){if(!Number.isFinite(seconds)||seconds<0)return '--:--';seconds=Math.floor(seconds);const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return (h?h+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  function targetPosition(state,now,latency=0){return Math.max(0,state.position+(state.paused?0:Math.max(0,now-state.receivedAt+latency)/1000));}
  const api={CHUNK,parseRange,validRead,formatTime,targetPosition};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KinoProtocol=api;
})(typeof self!=='undefined'?self:globalThis);
