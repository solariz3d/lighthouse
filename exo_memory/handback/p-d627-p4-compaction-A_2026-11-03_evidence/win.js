// lines [A,B] of sub.tsv: user and assistant text in full, call_chair text in full, stamped notes in full; tool results 200 chars
const fs=require('fs');const [,,F,A,B,OUT]=process.argv;const out=[];
for(const row of fs.readFileSync(F,'utf8').split('\n')){const i=row.indexOf('\t');if(i<0)continue;const n=+row.slice(0,i);if(n<+A||n>+B)continue;
 let o;try{o=JSON.parse(row.slice(i+1))}catch{continue}if(o.type!=='user'&&o.type!=='assistant')continue;const m=o.message;if(!m||o.isCompactSummary)continue;
 const ts=(o.timestamp||'').slice(0,16);const c=typeof m.content==='string'?[{type:'text',text:m.content}]:(m.content||[]);
 for(const x of c){let s=null;
  if(x.type==='text'){const t=x.text.trim();if(!t||/^<system-reminder>|^Tool loaded|^\[keep-warm/.test(t))continue;s=`${m.role==='user'?'USER':'LIB'}: ${t}`}
  else if(x.type==='tool_use'){if(x.name.includes('call_chair'))s=`RING→CHAIR: ${x.input.text}`;else if(x.name==='Bash'&&/stamp\.js/.test(x.input.command)){const mm=/printf '%s' "([\s\S]*?)" \|/.exec(x.input.command);s=`NOTE: ${mm?mm[1]:x.input.command.slice(0,600)}`}else if(x.name==='Artifact')s=`ARTIFACT: ${JSON.stringify(x.input).slice(0,200)}`;else if(x.name==='AskUserQuestion')s=`ASK: ${JSON.stringify(x.input)}`;}
  if(s)out.push(`#${n} ${ts} ${s}`)}}
fs.writeFileSync(OUT,out.join('\n\n'));
