// sub.js <dir> <startISO> <endISO>: usage once per message id (max per field) over subagent transcripts; numbers only.
const fs=require('fs'),rl=require('readline'),path=require('path');const [dir,s,e]=process.argv.slice(2);const S=Date.parse(s),E=Date.parse(e);
const files=fs.readdirSync(dir,{recursive:true}).filter(f=>f.endsWith('.jsonl'));const m=new Map();let pending=files.length;
for(const f of files){const r=rl.createInterface({input:fs.createReadStream(path.join(dir,f)),crlfDelay:Infinity});
 r.on('line',l=>{if(!l.includes('"type":"assistant"'))return;let o;try{o=JSON.parse(l)}catch(x){return}if(o.type!=='assistant'||!o.message?.usage||o.message.model==='<synthetic>')return;
  const u=o.message.usage,id=f+(o.message.id||o.uuid);const v={t:Date.parse(o.timestamp),model:o.message.model,cr:u.cache_read_input_tokens||0,cw:u.cache_creation_input_tokens||0,out:u.output_tokens||0,in:u.input_tokens||0};
  const p=m.get(id);if(!p)m.set(id,v);else for(const k of['cr','cw','out','in'])p[k]=Math.max(p[k],v[k]);});
 r.on('close',()=>{if(--pending)return;const a=[...m.values()].filter(x=>x.t>=S&&x.t<=E);const sum=k=>a.reduce((x,y)=>x+y[k],0);const ctx=a.map(x=>x.in+x.cr+x.cw).sort((x,y)=>x-y);const mod={};for(const x of a)mod[x.model]=(mod[x.model]||0)+1;
  const files2=new Set();console.log("map",m.size,"files",files.length,"minT",new Date(Math.min(...[...m.values()].map(x=>x.t))).toISOString());console.log(JSON.stringify({calls:a.length,cr:sum('cr'),cw:sum('cw'),out:sum('out'),in:sum('in'),ctxMed:ctx.length%2?ctx[(ctx.length-1)/2]:(ctx[ctx.length/2-1]+ctx[ctx.length/2])/2,ctxMax:ctx[ctx.length-1],models:mod}))});}
