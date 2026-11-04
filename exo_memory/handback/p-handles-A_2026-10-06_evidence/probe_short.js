const W='C:/Users/nname/Desktop/worktrees/a-handles-wt/'; const { createCoreShell } = require(W+'app/core/coreshell.js'); const D=require(W+'src/core/document.js'); const CL=require(W+'app/core/centreline.js');
(async()=>{ for (const L of [60, 100, 120, 140, 200]) {
  const s=await createCoreShell({autosaveMs:0}); for(let i=0;i<5;i++) s.extend({length:L, transition: 20, targets:{kh:(i%2?-1:1)*0.002}});
  s.setSculpt(true); s.selectPiece(2); const d0=s.getState().history.present, snap=CL.snapshot(s.getState().resolved);
  s.beginSculpt({channel:'phi'}); s.sculptTo(0.2); const msg=s.getState().message; s.endSculpt(); const d1=s.getState().history.present;
  const same=d1.pieces.map((p,i)=>p===d0.pieces[i]); let maxOut=0; d1.pieces.forEach((p,i)=>{ if(i===2) return; for(let u=0;u<=p.length;u+=2){ maxOut=Math.max(maxOut, Math.abs(D.channelAt(p,'phi',u).v-D.channelAt(d0.pieces[i],'phi',u).v)); } });
  let mid=D.channelAt(d1.pieces[2],'phi',L/2).v-D.channelAt(d0.pieces[2],'phi',L/2).v;
  console.log('len',L,'same objects',JSON.stringify(same),'max phi change outside p3 (rad)',maxOut.toExponential(2),'peak at p3 mid',mid.toFixed(4),'centreline moved',CL.pathMoved(snap,s.getState().resolved),'|',String(msg).slice(0,70));
}})();
