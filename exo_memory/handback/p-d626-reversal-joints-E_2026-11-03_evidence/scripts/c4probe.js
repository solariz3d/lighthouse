// usage (from the checkout): node c4probe.js <save> — merges off vs on: where the built bank differs, and the peak roll acceleration there
const fs=require('fs'),os=require('os'),path=require('path');
const mk=(mut)=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'c4-'));for(const d of ['src','app','tools'])fs.cpSync(d,path.join(dir,d),{recursive:true,filter:(p)=>!/[\/]app[\/]test([\/]|$)/.test(p)});
 const f=path.join(dir,'src/core/adapter.js');let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const a='if (q.a < p.b - 1e-9 && p.a >= lo - 1e-9 && p.b <= hi + 1e-9) {';if(s.split(a).length!==2)throw 'anchor';if(mut)fs.writeFileSync(f,s.replace(a,()=>'if (false) {'));
 return {dir,D:require(path.join(dir,'src/core/document.js')),A:require(path.join(dir,'src/core/adapter.js'))};};
const P=mk(false),M=mk(true),DEG=Math.PI/180;
const doc=P.D.parse(fs.readFileSync(process.argv[2],'utf8'));
const seg=(A)=>{let s=0;return A.toSegments(doc).map(g=>{const r={s,id:g.id,a:g.roll0,b:g.roll1,L:g.length};s+=g.length;return r;});};
const b0=seg(P.A),b1=seg(M.A);let n=0,dmax=0,ids=new Set(),acc=(B,k)=>Math.abs((B[k].b-B[k].a)/B[k].L-(B[k-1].b-B[k-1].a)/B[k-1].L)/((B[k].L+B[k-1].L)/2);let a0=0,a1=0;
b0.forEach((g,i)=>{const d=Math.max(Math.abs(g.a-b1[i].a),Math.abs(g.b-b1[i].b));if(d>1e-12){n++;ids.add(g.id);dmax=Math.max(dmax,d); if(i>0){a0=Math.max(a0,acc(b0,i));a1=Math.max(a1,acc(b1,i));}}});
let step=0;b1.forEach((g,i)=>{if(i)step=Math.max(step,Math.abs(g.a-b1[i-1].b));});
console.log('segments differing',n,'pieces',[...ids].join(','),'max',(dmax/DEG).toFixed(4)+'°','peak acc there: merged',(a0/DEG).toFixed(5),'unmerged',(a1/DEG).toFixed(5),'| largest value step between segments, unmerged',(step/DEG).toExponential(2));
for(const x of [P,M])fs.rmSync(x.dir,{recursive:true,force:true});
