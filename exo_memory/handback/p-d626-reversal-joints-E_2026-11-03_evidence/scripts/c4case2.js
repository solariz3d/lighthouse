// usage (from the checkout): node c4case2.js — a 1000 m piece after a 1000 m lead whose bank (control points from 20 on) rises steeply, then gently, then holds:
// two corners the same way, close together. With and without the merge: the peak roll acceleration against the bar, and the bank's largest 0.5 m jump
const fs=require('fs'),os=require('os'),path=require('path');
const mk=(mut)=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'c4-'));for(const d of ['src','app','tools'])fs.cpSync(d,path.join(dir,d),{recursive:true,filter:(p)=>!/[\/]app[\/]test([\/]|$)/.test(p)});
 const f=path.join(dir,'src/core/adapter.js');let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const a='if (q.a < p.b - 1e-9 && p.a >= lo - 1e-9 && p.b <= hi + 1e-9) {';if(s.split(a).length!==2)throw 'anchor';if(mut)fs.writeFileSync(f,s.replace(a,()=>'if (false) {'));
 return {dir,D:require(path.join(dir,'src/core/document.js')),A:require(path.join(dir,'src/core/adapter.js')),E:require(path.join(dir,'src/core/extend.js'))};};
const DEG=Math.PI/180,BAR=29.4/(10*170*170);const X0=mk(false),X1=mk(true);
for (const [steep,ns,gentle,ng] of [[3,2,1,2],[4,1,1,3],[2,3,0.5,3],[5,2,2,1],[3,1,1,1],[6,2,1,2]]) {
 const out=[];for(const X of [X0,X1]){ let d=X.E.extend(X.E.extend(X.D.createDoc('x'),{length:1000,family:'bowl'}),{length:1000,family:'bowl'});const P=d.pieces[1],c=P.channels.phi.slice();let v=0;
  for(let i=20;i<c.length;i++){ if(i<20+ns)v+=steep; else if(i<20+ns+ng)v+=gentle; c[i]=v*DEG; }
  d={...d,pieces:d.pieces.map((Q,i)=>i===1?{...Q,channels:{...Q.channels,phi:c}}:Q)};
  let s=0;const G=X.A.toSegments(d).map(g=>{const r={s,a:g.roll0,b:g.roll1,L:g.length};s+=g.length;return r;});let pk=0;for(let k=1;k<G.length;k++)pk=Math.max(pk,Math.abs((G[k].b-G[k].a)/G[k].L-(G[k-1].b-G[k-1].a)/G[k-1].L)/((G[k].L+G[k-1].L)/2));
  const S=X.A.toPath(d).path.samples;let j=0;for(let i=1;i<S.length;i++)j=Math.max(j,Math.abs(S[i].roll-S[i-1].roll));
  out.push(`${(pk/BAR).toFixed(2)}x bar, jump ${(j/DEG).toFixed(3)}°`); }
 console.log(`steep ${steep}°x${ns} gentle ${gentle}°x${ng}: merged ${out[0]} | unmerged ${out[1]}`);
}
for(const x of [X0,X1])fs.rmSync(x.dir,{recursive:true,force:true});
