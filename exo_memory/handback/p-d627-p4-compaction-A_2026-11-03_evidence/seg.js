// one streaming pass over lines [A,B]: user text, assistant text, tool calls (short), tool results (short), to seg.txt
const fs=require('fs'),rl=require('readline');const [,,F,A,B,OUT]=process.argv;let n=0;const w=fs.createWriteStream(OUT);
const r=rl.createInterface({input:fs.createReadStream(F),crlfDelay:Infinity});
r.on('line',l=>{n++;if(n<+A||n>+B)return;let o;try{o=JSON.parse(l)}catch{return}const m=o.message;if(!m)return;const ts=(o.timestamp||'').slice(0,19);
 const c=typeof m.content==='string'?[{type:'text',text:m.content}]:(m.content||[]);
 for(const x of c){let s;if(x.type==='text')s=`${m.role.toUpperCase()}: ${x.text}`;else if(x.type==='tool_use')s=`CALL ${x.name}: ${JSON.stringify(x.input).slice(0,400)}`;else if(x.type==='tool_result'){const t=typeof x.content==='string'?x.content:(x.content||[]).map(y=>y.text||'').join('');s=`RESULT: ${t.slice(0,300)}`}else continue;
 w.write(`#${n} ${ts} ${o.isCompactSummary?'[SUMMARY] ':''}${s.replace(/\r/g,'')}\n`)}});
r.on('close',()=>w.end());
