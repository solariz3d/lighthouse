const fs=require('fs');const L=f=>fs.readFileSync(f,'utf8').trim().split('\n').filter(x=>x.startsWith('{')).map(JSON.parse);
for(const f of process.argv.slice(2)){const r=L(f),by={};for(const x of r)by[x.res]=(by[x.res]||0)+1;const ms=r.map(x=>x.ms).sort((a,b)=>a-b);
 const over=r.filter(x=>x.p!=null&&x.p>1.05);console.log(f,'cases',r.length,JSON.stringify(by),'over 1.05:',over.length,'options ms median',ms[ms.length>>1],'max',ms.at(-1));
 for(const x of r.filter(x=>x.res!=='laid').slice(0,6))console.log('  ',x.res,x.kind,x.first,JSON.stringify(x.ts),'typed',x.typed,'L',x.L,JSON.stringify(x.marks),(x.err||'').slice(0,110));
 for(const x of over.slice(0,4))console.log('   over',x.kind,x.first,JSON.stringify(x.ts),x.L,JSON.stringify(x.marks),x.p)}
