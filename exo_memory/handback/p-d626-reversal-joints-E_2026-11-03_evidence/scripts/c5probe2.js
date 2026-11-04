// usage (from the checkout): node c5probe2.js mutate|plain <save> — for every road piece: warm the cache, raise its middle phi knot 1°, compare cached with fresh
const fs=require('fs'),os=require('os'),path=require('path');const mut=process.argv[2]==='mutate';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'c5-'));for(const d of ['src','app','tools'])fs.cpSync(d,path.join(dir,d),{recursive:true,filter:(p)=>!/[\/]app[\/]test([\/]|$)/.test(p)});
const f=path.join(dir,'src/core/adapter.js');let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const a="key: `${out[i].key}#${mine.map((w) => [w.a, w.b, ...w.c].join(',')).join(';')}`";if(s.split(a).length!==2)throw 'anchor';if(mut)fs.writeFileSync(f,s.replace(a,()=> 'key: out[i].key'));
const D=require(path.join(dir,'src/core/document.js')),A=require(path.join(dir,'src/core/adapter.js'));
const doc=D.parse(fs.readFileSync(process.argv[3],'utf8'));let stale=[];
doc.pieces.forEach((P,k)=>{ if(P.type!=='road'||!P.channels.phi||P.channels.phi.length<3)return; const c=P.channels.phi.slice();c[Math.floor(c.length/2)]+=Math.PI/180;
 const ed={...doc,pieces:doc.pieces.map((Q,i)=>i===k?{...Q,channels:{...Q.channels,phi:c}}:Q)}; const cache=new Map();A.toSegments(doc,{cache});const cc=A.toSegments(ed,{cache}),fr=A.toSegments(ed);
 let d=0;cc.forEach((g,i)=>d=Math.max(d,Math.abs(g.roll0-fr[i].roll0),Math.abs(g.roll1-fr[i].roll1))); if(d>0)stale.push(`${P.id}:${d.toExponential(1)}`);});
console.log(mut?'MUTANT':'plain','edits whose cached build differs from fresh:',stale.length?stale.join(' '):'none');
fs.rmSync(dir,{recursive:true,force:true});
