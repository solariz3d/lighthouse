const W='C:/Users/nname/Desktop/worktrees/a-handles-wt/'; const { createCoreShell } = require(W+'app/core/coreshell.js'); const CL=require(W+'app/core/centreline.js'); const XS=require(W+'app/core/xsec.js');
const R=180,Q=Math.PI*R/2;
async function mk(kind){ const s=await createCoreShell({autosaveMs:0}); 
  if(kind==='cup'){ s.extend({length:300,family:'bowl',first:{c:45}}); for(let i=0;i<3;i++) s.extend({length:Q,transition:40,targets:{kh:1/R,c:45}}); s.extend({length:100,transition:40,targets:{kh:0,c:45}}); }
  else if(kind==='tube'){ s.extend({length:300,first:{w:40,t:360}}); for(let i=0;i<3;i++) s.extend({length:Q,transition:40,targets:{kh:1/R}}); s.extend({length:100,transition:40,targets:{kh:0}}); }
  else if(kind==='edge'){ s.extend({length:300,family:'bowl',first:{[XS.CHANNEL.edge]:20}}); for(let i=0;i<3;i++) s.extend({length:Q,transition:40,targets:{kh:1/R,[XS.CHANNEL.edge]:20}}); s.extend({length:100,transition:40,targets:{kh:0}}); }
  else { s.extend({length:300,family:'bowl'}); for(let i=0;i<3;i++) s.extend({length:Q,transition:40,targets:{kh:(i%2?-1:1)/R}}); s.extend({length:100,transition:40,targets:{kh:0}}); }
  return s; }
(async()=>{
 for (const kind of ['legacy','cup','tube','edge']) for (const ch of ['phi','c','w','e','s','r','t','kh','kv']) {
  const s=await mk(kind); s.setSculpt(true); s.selectPiece(2); const before=s.getState().history.present, snap=CL.snapshot(s.getState().resolved);
  s.beginSculpt({channel:ch}); let st=s.getState(); let msg=st.message; if(!st.brush){ console.log(kind,ch,'REFUSED:',String(msg).slice(0,110)); continue; }
  s.sculptTo(ch==='phi'?0.2:ch==='kh'?1e-3:5); st=s.getState(); const m1=st.message; s.endSculpt(); st=s.getState();
  const moved=CL.pathMoved(snap,st.resolved); console.log(kind,ch,'doc changed',st.history.present!==before,'centreline moved',moved,'msg',m1&&String(m1).slice(0,90), st.message && String(st.message).slice(0,90));
 }})();
