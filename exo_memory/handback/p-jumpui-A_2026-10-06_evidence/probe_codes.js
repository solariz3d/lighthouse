const W='C:/Users/nname/Desktop/worktrees/a-jumpui-wt/'; const { createCoreShell } = require(W+'app/core/coreshell.js'); const JW=require(W+'app/core/jumpplan.js');
(async()=>{ const mk=async()=>{ const s=await createCoreShell({autosaveMs:0}); s.extend({length:300,family:'bowl'}); s.extend({length:100,targets:{kv:0.002}}); return s; };
 const s=await mk(); const t=async(label,fn,o)=>{ const m=await mk(); fn&&fn(m); const before=m.getState().history.present; m.addJump(o); const st=m.getState(); console.log(label,'| changed',st.history.present!==before,'|',String(st.message).slice(0,170)); };
 const e=await createCoreShell({autosaveMs:0}); e.addJump({gap:30,drop:1,landDeg:-2}); console.log('empty |',e.getState().message);
 await t('ok', null, {gap:30,drop:1,landDeg:-2});
 await t('gap 0', null, {gap:0,drop:0,landDeg:0}); await t('gap blank', null, {gap:'',drop:0,landDeg:0}); await t('drop abc', null, {gap:30,drop:'abc',landDeg:0}); await t('land 95', null, {gap:30,drop:1,landDeg:95});
 await t('twice', (m)=>m.addJump({gap:30,drop:1,landDeg:-2}), {gap:30,drop:1,landDeg:-2});
 for (const o of [{gap:5,drop:0,landDeg:80},{gap:1,drop:300,landDeg:-80},{gap:200,drop:-150,landDeg:85},{gap:20,drop:500,landDeg:80},{gap:3,drop:0,landDeg:-85},{gap:50,drop:20,landDeg:89}]) await t('try '+JSON.stringify(o), null, o);
 // a steep take-off (pitch near vertical)
 const v=await createCoreShell({autosaveMs:0}); v.extend({length:300,family:'bowl'}); v.extend({length:200,targets:{kv:0.05}}); v.extend({length:200,targets:{kv:0.05}}); v.addJump({gap:30,drop:1,landDeg:-2}); console.log('steep |',String(v.getState().message).slice(0,170), 'pieces', v.getState().history.present.pieces.length);
 // an offset left at the lip: a hill brush at the end
 const h=await mk(); h.beginBrush({mode:'local',channel:'height',s0:380,r:60}); h.brushTo(3); h.endBrush(); console.log('hill msg', h.getState().message); const b4=h.getState().history.present; h.addJump({gap:30,drop:1,landDeg:-2}); console.log('offset |',h.getState().history.present!==b4, String(h.getState().message).slice(0,200));
})();
