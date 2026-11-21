// usage: node decompose.js transcript.jsonl callLine  -> JSON of byte pieces of that call's request
const fs=require('fs'),rl=require('readline');
const f=process.argv[2],ln=+process.argv[3];
const B=s=>Buffer.byteLength(typeof s==='string'?s:JSON.stringify(s));
const SEG=[[/^Note: .* was read before/m,'post_compact_file_restore'],[/^Background shell/m,'post_compact_file_restore'],[/^The following deferred tools are now available/m,'deferred_tools_listing'],[/^When the step in front/m,'deferred_tools_listing'],[/^Available agent types/m,'agent_types_listing'],[/^When you launch multiple agents/m,'agent_types_listing'],[/^The following skills are available/m,'skills_listing'],[/^# MCP Server Instructions/m,'mcp_instructions'],[/^# Environment/m,'environment_block'],[/^SessionStart hook additional context/m,'sessionstart_hooks'],[/^The following deferred tools are no longer/m,'deferred_tools_listing'],[/^This is ambient context/m,'sessionstart_hooks'],[/^UserPromptSubmit hook additional context/m,'userpromptsubmit_hooks'],[/^<system-reminder>/m,'other_message_text']];
function segment(t,add){const pts=[];for(const [re,k] of SEG){const g=new RegExp(re.source,'gm');let m;while((m=g.exec(t)))pts.push([m.index,k])}
 pts.sort((a,b)=>a[0]-b[0]);if(!pts.length||pts[0][0]>0)pts.unshift([0,'other_message_text']);pts.push([t.length,'END']);
 for(let i=0;i<pts.length-1;i++)add(pts[i][1],B(t.slice(pts[i][0],pts[i+1][0])))}
(async()=>{const rows=[];let n=0;
 for await(const line of rl.createInterface({input:fs.createReadStream(f),crlfDelay:Infinity})){n++;if(n<ln-45)continue;if(n>ln)break;
  if(line.includes('"api-request')){try{rows.push([n,JSON.parse(line)])}catch{}}}
 let si=-1;rows.forEach((r,i)=>{if(r[1].type==='api-request-shape')si=i});
 if(si<0){console.log(JSON.stringify({err:'no shape'}));return}
 const shape=rows[si][1].shape;const out={line:ln,shapeAt:rows[si][0],system:0,tools:0,toolRows:[],msgs:{}};
 (shape.system||[]).forEach(x=>out.system+=B(x.text||x));
 (shape.tools||[]).forEach(x=>{const b=B(x);out.tools+=b;out.toolRows.push([x.name||'?',b])});
 const add=(k,b)=>out.msgs[k]=(out.msgs[k]||0)+b;
 let instr=null;
 for(const [,r] of rows.slice(si+1)){if(r.type!=='api-request-blob')continue;const m=r.message;if(!m||m.role==null)continue;
  const c=m.content;const blocks=Array.isArray(c)?c:[c];
  for(const x of blocks){let t=typeof x==='string'?x:(x&&x.text)!=null?x.text:JSON.stringify(x);
   if(x&&typeof x==='object'&&x.type==='text'&&false){}
   // a block that is itself a JSON message object
   if(typeof t==='string'&&t.startsWith('{"role"')){try{const j=JSON.parse(t);t=typeof j.content==='string'?j.content:JSON.stringify(j.content)}catch{}}
   const b=B(t);const h=t.slice(0,90);
   if(/(The following deferred tools are now available|Available agent types|The following skills are available|# MCP Server Instructions)/.test(t)&&b>2000){segment(t,add);continue}
   if(/^This session is being continued/.test(t))add('summary',b);
   else if(/^<system-reminder>\s*Codebase and user instructions/.test(t)){add('instructions_block',b);instr=t}
   else if(/^<local-command-stdout>/.test(t)&&/PreCompact/.test(t))add('precompact_hooks_stdout',b);
   else if(/SessionStart hook additional context|Ambient context/.test(t))add('sessionstart_hooks',b);
   else if(/UserPromptSubmit hook additional context/.test(t))add('userpromptsubmit_hooks',b);
   else if(/^<system-reminder>\s*(Called the Read|Result of calling the Read)/.test(t)||/^Note: .* was read before/.test(t))add('post_compact_file_restore',b);
   else if(/following deferred tools|The following skills|MCP Server Instructions|# MCP Server/.test(t))add('tools_skills_mcp_listings',b);
   else add('other_message_text',b)}}
 out.instr=null;
 if(instr){const parts=[];const re=/Contents of ([^\n]*?)(?: \(([^)]*)\))?:\n/g;let m,last=null,idx=[];
  while((m=re.exec(instr)))idx.push([m.index,m[1]]);idx.push([instr.length,'END']);
  for(let i=0;i<idx.length-1;i++)parts.push([idx[i][1].slice(-60),B(instr.slice(idx[i][0],idx[i+1][0]))]);
  out.instr={preamble:B(instr.slice(0,idx[0]?idx[0][0]:0)),parts}}
 console.log(JSON.stringify(out))})();
