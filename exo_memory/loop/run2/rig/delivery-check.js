// Live delivery check per p3a-cue-arms-parked_2026-08-31.md §1: the K2 receipt tail must appear in K2
// exactly once, as a tool_result, and zero times anywhere in K1; no env-inspecting commands; no hook markers.
const fs=require("fs"),p=require("path");
const R="C:/Consonance/subjects/run2";
const TAIL=require(R+"/rig/briefs.js").K2_RECEIPT_TAIL;
const tags=process.argv.slice(2);
const hook=/\[pulse\]|\[panes\]|\[ferry\]|hook_additional_context|hookName/;
const mcp=/mcp__|WebSearch|WebFetch/;
const envcmd=/\b(env|printenv|set)\b|HANDOFF_RECEIPT_TAIL|process\.env/;
for(const t of tags){
  const [arm,rep]=t.split("_");
  const dir=`${R}/config/projects/C--Consonance-subjects-run2-cells-${arm}-${rep}`;
  const files=fs.readdirSync(dir).filter(f=>f.endsWith(".jsonl"));
  let rows=[];for(const f of files)rows.push(...fs.readFileSync(p.join(dir,f),"utf8").trim().split("\n").filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return{type:"UNPARSED"}}}));
  let tailAny=0,tailToolResult=0,tailPromptOrAssistant=0,envHits=0,hookHits=0,mcpHits=0,models={},versions={},unparsed=0;
  for(const r of rows){
    if(r.type==="UNPARSED"){unparsed++;continue}
    const s=JSON.stringify(r);
    if(hook.test(s))hookHits++; if(mcp.test(s))mcpHits++;
    if(r.version)versions[r.version]=(versions[r.version]||0)+1;
    if(r.message&&r.message.model)models[r.message.model]=(models[r.message.model]||0)+1;
    const c=r.message&&r.message.content;
    if(Array.isArray(c))for(const b of c){
      const txt=b.type==="tool_result"?JSON.stringify(b.content):b.type==="text"?b.text:b.type==="tool_use"?JSON.stringify(b.input):"";
      if(txt&&txt.includes(TAIL)){tailAny++; if(b.type==="tool_result")tailToolResult++; else tailPromptOrAssistant++;}
      if(b.type==="tool_use"&&b.name==="Bash"&&envcmd.test(b.input&&b.input.command||""))envHits++;
    } else if(typeof c==="string"&&c.includes(TAIL)){tailAny++;tailPromptOrAssistant++;}
  }
  const expectTR=arm==="K2"?1:0;
  const ok=tailToolResult===expectTR&&tailPromptOrAssistant===0&&envHits===0&&hookHits===0&&mcpHits===0&&unparsed===0&&Object.keys(models).join()==="claude-opus-5";
  console.log(`${t}: files=${files.length} rows=${rows.length} tailAny=${tailAny} tail@tool_result=${tailToolResult} tail@prompt/assistant=${tailPromptOrAssistant} envCmds=${envHits} hook=${hookHits} mcp=${mcpHits} unparsed=${unparsed} models=${JSON.stringify(models)} versions=${JSON.stringify(versions)} => ${ok?"OK":"FAIL"}`);
}
