// approximate the strict index tier at different title caps (choice aid only, not a measurement of record)
const fs=require('fs'),path=require('path');const exo=process.argv[2];
const md=(d,rel,out)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const r=rel+'/'+e.name;if(e.isDirectory()){if(e.name==='attic')continue;md(path.join(d,e.name),r,out)}else if(e.name.endsWith('.md'))out.push(r.slice(1))}return out};
const date=s=>{const m=s.match(/20\d\d-\d\d-\d\d/g);return m?m[m.length-1]:null};
const read=r=>fs.readFileSync(path.join(exo,r),'utf8');
const head=b=>{const l=b.split('\n').find(x=>x.startsWith('# '));return l?l.slice(2).replace(/\r$/,''):''};
const ent=[];
for(const d of ['map','journal','loop']){for(const r0 of md(path.join(exo,d),'',[])){const r=d+'/'+r0;if(r.startsWith('loop/run1/items/')||r.startsWith('loop/run2/cells/'))continue;const b=read(r);const dt=date(r);const rest=r.slice(5);const standing=d==='loop'&&!rest.includes('/')&&/[A-Z]/.test(rest)&&!/[a-z]/.test(rest.replace(/\.md$/,''));const g=d!=='loop'?0:dt?2:standing?0:3;ent.push({r,g,dt,n:b.split('\n').length-(b.endsWith('\n')?1:0),h:head(b)})}}
const mapText=fs.readdirSync(path.join(exo,'map')).filter(f=>f.endsWith('.md')).map(f=>fs.readFileSync(path.join(exo,'map',f),'utf8')).join('\n');
for(const e of fs.readdirSync(path.join(exo,'handback'),{withFileTypes:true})){if(!e.isFile()||!e.name.endsWith('.md'))continue;if(mapText.includes(e.name)||mapText.includes(e.name.replace(/\.md$/,'')))continue;const r='handback/'+e.name;const b=read(r);ent.push({r,g:1,dt:date(r),n:b.split('\n').length-(b.endsWith('\n')?1:0),h:head(b)})}
const cap=(t,T)=>{if(!t)return '(no title)';if(t.length<=T)return t;let c=t.slice(0,T);const i=c.lastIndexOf(' ');if(i>T/2)c=c.slice(0,i);return c.replace(/[\s,;:.\-—–]+$/,'')+' ...'};
ent.sort((a,b)=>a.g-b.g||((a.g===1||a.g===2)?((b.dt||'').localeCompare(a.dt||'')||a.r.localeCompare(b.r)):0));
for(const T of [1e9,80,60,48,40,32,24,0]){let s=0,full=false,ls={0:0,1:0,2:0,3:0},drop=0,bytes=0,tl=0,k=0;for(const e of ent){const line=`- ${e.r}  (${e.n} lines)  ${T===0?'':cap(e.h,T)}`;const c=Buffer.byteLength(line)+1;bytes+=c;if(!full&&s+c<=30000){s+=c;ls[e.g]++;k++}else{full=true;drop++}}
console.log(`T=${T>1e8?'none':T} listed g0 ${ls[0]} hb ${ls[1]} dated-loop ${ls[2]} undated ${ls[3]} | mjl listed ${ls[0]+ls[2]+ls[3]} | dropped ${drop} | all ${ent.length} | mean ${(bytes/ent.length).toFixed(1)}`)}
console.log('hand-backs unmapped',ent.filter(e=>e.g===1).length);
