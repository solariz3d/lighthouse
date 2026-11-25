// stops2.js: as stops.js, with the stops merged (one per 6 m) and both roads' peak roll rate over an 8 m chord (the read's stations are 4 m apart,
// so the real road's 8 m figure carries the read's own noise: an upper bound). usage: node stops2.js <tree> <docs.json> <eval.json>
const path=require('path'),[T,docsF,evalF]=process.argv.slice(2),A=require(path.join(T,'src/core/adapter.js'));
const E=require(path.resolve(evalF)),realRate=d=>{const r=E.attempts[0].rates.reduce((p,q)=>Math.abs(q.d-d)<Math.abs(p.d-d)?q:p);return Math.abs(r.real)};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2], RB=E.real.filter(r=>r.d>=350&&r.d<=700);
const realPk8=RB.slice(1,-1).map((r,i)=>({d:r.d,r:Math.abs((RB[i+2].bank-RB[i].bank)/8)})).reduce((p,q)=>q.r>p.r?q:p);
console.log(`the real road: peak roll rate over an 8 m chord ${realPk8.r.toFixed(2)} deg/m at ${realPk8.d}`);
for(const a of require(path.resolve(docsF))){
  const S=A.toPath(a.doc,{step:0.5}).path.samples.filter(x=>x.s>=300&&x.s<=672);
  const b=S.map(x=>{const f=x.T,ll=Math.hypot(f[2],f[0]),l=[f[2]/ll,0,-f[0]/ll],u2=[l[1]*f[2]-l[2]*f[1],l[2]*f[0]-l[0]*f[2],l[0]*f[1]-l[1]*f[0]];return {d:340+x.s-300,b:Math.atan2(dot(x.U,l),-dot(x.U,u2))*180/Math.PI}});
  const rate=(h)=>b.map((x,i)=>{const p=b[Math.max(0,i-h)],q=b[Math.min(b.length-1,i+h)];return {d:x.d,r:Math.abs((q.b-p.b)/(q.d-p.d))}});
  const r=rate(4), r8=rate(8).filter(x=>x.d>=350&&x.d<=700).reduce((p,q)=>q.r>p.r?q:p);
  const stops=[];for(let i=8;i<r.length-8;i++){const x=r[i];if(x.d<350||x.d>700)continue;if(x.r<=r[i-1].r&&x.r<r[i+1].r){const R=realRate(x.d);if(R>0.15&&x.r<0.5*R){const l=stops[stops.length-1];if(l&&x.d-l.e<6){l.e=x.d;continue}stops.push({d:x.d,e:x.d,r:x.r,R})}}}
  console.log(`${a.name}: peak roll rate over an 8 m chord ${r8.r.toFixed(2)} at ${r8.d.toFixed(0)}; ${stops.length} stop(s) inside the real road's roll: ${stops.map(s=>s.e-s.d>6?`${s.d.toFixed(0)}-${s.e.toFixed(0)} (held level, real ${s.R.toFixed(2)})`:`${s.d.toFixed(0)} (${s.r.toFixed(2)} vs real ${s.R.toFixed(2)})`).join(', ')||'none'}`);
}
