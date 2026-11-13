// extract.js <seatName> <transcript.jsonl> <out.json>
// Streams one transcript line by line. Keeps NUMBERS ONLY: per assistant message id its usage
// (max of each field over the lines that carry that id), its first timestamp and model;
// compact_boundary events (timestamp, trigger, preTokens, postTokens); and the timestamps of
// system/informational lines whose content contains "ompacted while idle". No text is kept.
const fs=require('fs'),rl=require('readline');
const [seat,file,out]=process.argv.slice(2);
const calls=new Map(),compacts=[],idle=[];let lines=0,bad=0,side=0,synth=0;
const r=rl.createInterface({input:fs.createReadStream(file),crlfDelay:Infinity});
r.on('line',l=>{lines++;
 const isA=l.includes('"type":"assistant"'),isC=l.includes('"compact_boundary"'),isI=l.includes('ompacted while idle');
 if(!isA&&!isC&&!isI)return;
 let o;try{o=JSON.parse(l)}catch(e){bad++;return}
 if(o.type==='assistant'&&o.message&&o.message.usage){
  if(o.isSidechain){side++;return}
  const m=o.message,u=m.usage,id=m.id||o.uuid;
  if(m.model==='<synthetic>'){synth++;return}
  const v={ts:o.timestamp,model:m.model,in:u.input_tokens||0,cr:u.cache_read_input_tokens||0,
   cw:u.cache_creation_input_tokens||0,out:u.output_tokens||0,
   cw1h:(u.cache_creation&&u.cache_creation.ephemeral_1h_input_tokens)||0};
  const p=calls.get(id);
  if(!p)calls.set(id,v);else{for(const k of['in','cr','cw','out','cw1h'])p[k]=Math.max(p[k],v[k]);if(v.ts<p.ts)p.ts=v.ts;}
 } else if(o.type==='system'&&o.subtype==='compact_boundary'){
  const c=o.compactMetadata||{};compacts.push({ts:o.timestamp,trigger:c.trigger,pre:c.preTokens,post:c.postTokens});
 } else if(o.type==='system'&&o.subtype==='informational'&&isI){idle.push(o.timestamp);}
});
r.on('close',()=>{const arr=[...calls.values()].sort((a,b)=>a.ts<b.ts?-1:1);
 fs.writeFileSync(out,JSON.stringify({seat,file,lines,bad,side,synth,calls:arr,compacts,idle}));
 console.log(seat,'lines',lines,'calls',arr.length,'compacts',compacts.length,'idle',idle.length,'bad',bad,'side',side,'synth',synth);});
