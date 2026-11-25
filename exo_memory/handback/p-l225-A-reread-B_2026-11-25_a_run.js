// pane A's re-read of B's L225 repair (67f74b56): ONE run of the spawn's built arguments, built from main.rs's text myself.
// node a_run.js <main.rs> <root>
const fs=require('fs'),os=require('os'),path=require('path'),{spawn}=require('child_process');
const [MAIN,ROOT]=process.argv.slice(2);
const src=fs.readFileSync(MAIN,'utf8');
const k=n=>{const m=src.match(new RegExp('const '+n+': &str = r#"(.*?)"#;'));if(!m)throw new Error(n);return m[1]};
const both=k('BUILDER_LAUNCH_SETTINGS'),dis=src.match(/const FLOOR_DISALLOWED: &str = "(.*?)";/)[1];
const shape3=fs.readFileSync('C:/Consonance/lighthouse/exo_memory/handback/p-l216-no-prompt-B_2026-11-21_evidence/shape3.txt','utf8');
fs.mkdirSync(ROOT,{recursive:true});const sf=path.join(ROOT,'builder-launch.settings.json');fs.writeFileSync(sf,both);
const cwd=path.join(ROOT,'sibling-probe');fs.rmSync(cwd,{recursive:true,force:true});fs.mkdirSync(cwd);
const env=Object.fromEntries(Object.entries(process.env).filter(([k])=>!/^CLAUDECODE$|^CLAUDE_CODE_/.test(k)));
const pd=path.join(os.homedir(),'.claude','projects',cwd.replace(/[:\/.]/g,'-'));fs.rmSync(pd,{recursive:true,force:true});
const args=['-p','--input-format','stream-json','--output-format','stream-json','--verbose','--model','opus','--settings',sf,'--disallowedTools',dis,'--dangerously-skip-permissions','--strict-mcp-config','--permission-prompt-tool','stdio'];
console.log('settings text:',both,'| disallowed:',dis);
const c=spawn(path.join(os.homedir(),'.local','bin','claude.exe'),args,{cwd,env});
let prompts=0,bash=0,res='',init=null,buf='';
c.stdout.on('data',d=>{buf+=d;let i;while((i=buf.indexOf('\n'))>=0){const l=buf.slice(0,i);buf=buf.slice(i+1);let j;try{j=JSON.parse(l)}catch{continue}
 if(j.type==='system'&&j.subtype==='init')init={artifact:(j.tools||[]).includes('Artifact'),ntools:(j.tools||[]).length};
 if(j.type==='control_request'&&j.request&&j.request.subtype==='can_use_tool'){prompts++;c.stdin.write(JSON.stringify({type:'control_response',response:{subtype:'success',request_id:j.request_id,response:{behavior:'deny',message:'probe host denied'}}})+'\n')}
 if(j.type==='assistant'&&j.message&&Array.isArray(j.message.content))for(const b of j.message.content)if(b.type==='tool_use'&&b.name==='Bash')bash++;
 if(j.type==='user'&&j.message&&Array.isArray(j.message.content))for(const b of j.message.content)if(b.type==='tool_result')res=String(typeof b.content==='string'?b.content:JSON.stringify(b.content)).slice(0,160);}});
c.stdin.write(JSON.stringify({type:'user',message:{role:'user',content:'Make exactly one Bash tool call whose command is the text between the markers, verbatim, then stop.\n<<<\n'+shape3+'\n>>>'}})+'\n');
setTimeout(()=>c.stdin.end(),75000);const t=setTimeout(()=>c.kill(),150000);
c.on('exit',()=>{clearTimeout(t);setTimeout(()=>{let n=0,on=false,art=false;
 if(fs.existsSync(pd))for(const f of fs.readdirSync(pd).filter(f=>f.endsWith('.jsonl')))for(const l of fs.readFileSync(path.join(pd,f),'utf8').split('\n')){let v;try{v=JSON.parse(l)}catch{continue}
  if(v.type==='api-request-blob'){const cc=v.message.content;for(const b of Array.isArray(cc)?cc:[{text:cc}])if(b&&b.text)for(const line of b.text.split('\n')){if(/^(The following [a-z ]+|Available agent types|# [A-Z]|Contents of |SessionStart hook)/.test(line))on=/^The following skills/.test(line);if(on)n+=Buffer.byteLength(line)+1}}}
 console.log(`Bash calls ${bash}, host asked ${prompts}x, tool result: ${res||'(none)'} | init: ${JSON.stringify(init)} | skills listing ${n} B`);},15000)});
