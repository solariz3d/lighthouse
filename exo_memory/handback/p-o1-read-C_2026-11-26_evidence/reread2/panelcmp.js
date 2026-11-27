const fs=require('fs');const L=f=>fs.readFileSync(f,'utf8').trim().split('\n').filter(x=>x.startsWith('{')).map(JSON.parse);
const [tip,eee,base]=process.argv.slice(2).map(L),key=x=>[x.kind,x.first,x.L,x.ts.join(','),x.typed].join('|');const E=new Map(eee.map(x=>[key(x),x])),B=new Map(base.map(x=>[key(x),x]));
const fields={};for(const x of tip){const e=E.get(key(x)),b=B.get(key(x));const f=x.kind;fields[f]=fields[f]||{n:0,tipLaid:0,eeeLaid:0,baseLaid:0,laidBaseNotTip:[],laidEeeNotTip:[],sameMarksAsEee:0};const F=fields[f];F.n++;
 if(x.res==='laid')F.tipLaid++;if(e.res==='laid')F.eeeLaid++;if(b.res==='laid')F.baseLaid++;if(b.res==='laid'&&x.res!=='laid')F.laidBaseNotTip.push(key(x));if(e.res==='laid'&&x.res!=='laid')F.laidEeeNotTip.push(key(x));
 if(JSON.stringify(e.marks)===JSON.stringify(x.marks))F.sameMarksAsEee++}
console.log(JSON.stringify(fields,null,1));
const slow=[...tip].sort((a,b)=>b.ms-a.ms).slice(0,6);for(const x of slow)console.log('slow',x.ms,'ms (eee',E.get(key(x)).ms,')',key(x),x.res);
const bank=tip.filter(x=>x.kind==='bank'&&x.res!=='laid');for(const x of bank){const e=E.get(key(x)),b=B.get(key(x));console.log('bank not laid at tip:',key(x),'tip',JSON.stringify(x.marks),'| eee',e.res,JSON.stringify(e.marks),'| base',b.res,JSON.stringify(b.marks))}
