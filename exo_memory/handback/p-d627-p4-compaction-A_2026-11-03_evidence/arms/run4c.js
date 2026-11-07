// run4c.js <questions file> <out dir>: six runs, one at a time, in the librarian's directory, on copies only.
// Hooks off, no MCP, no session saved, read-only tools, transcripts and this lap's files unreadable. BelowNormal, hidden. acs.exe up -> wait.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const [,,QF,OUT]=process.argv;const A=__dirname;fs.mkdirSync(OUT,{recursive:true});
const CWD='C:/Consonance/instances/librarian',ID='0c0c0c0b-0000-4000-8000-00000000115b';
const Q=fs.readFileSync(QF,'utf8'),SUM=fs.readFileSync(path.join(A,'summary-body.txt'),'utf8');
const PRE='This is a read-only test of what you know. Answer every question below. Do not act on anything, change no file and message no one. For each answer, say where it comes from: a file and line you read, or "from memory". If you do not know, write "don\'t know" rather than guess.\n\n';
const prompt={board:PRE+Q, room:PRE+Q, summary:PRE+'Below is the summary you were given at your last compaction, then the questions.\n\n<compaction-summary>\n'+SUM+'\n</compaction-summary>\n\n'+Q, chain:PRE+Q};
const codes=JSON.parse(fs.existsSync(path.join(OUT,'..','key-map.json'))?fs.readFileSync(path.join(OUT,'..','key-map.json'),'utf8'):'null')||(()=>{const c={};for(const a of ['room','summary','board','chain'])c[a]=crypto.randomBytes(2).toString('hex');fs.writeFileSync(path.join(OUT,'..','key-map.json'),JSON.stringify(c,null,1));return c})();
const deny=['Read(~/.claude/projects/**/*.jsonl)','Grep(~/.claude/projects/**/*.jsonl)','Read(//c/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d627-*)','Grep(//c/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d627-*)','Read(//c/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d627-*/**)','Grep(//c/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d627-*/**)'];
const base=['-p','--settings','{"disableAllHooks":true}','--strict-mcp-config','--mcp-config',path.join(A,'empty-mcp.json'),'--no-session-persistence','--tools','Read,Grep,Glob','--add-dir','C:/Users/nname/Desktop/lighthouse','C:/Consonance/data','C:/Users/nname/.consonance','C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/memory','--output-format','text','--disallowedTools',...deny];
const boardDeny=['//c/Consonance/data/board.jsonl','//c/Consonance/data/board.jsonl.pre-union-*','~/.claude/shell/*.jsonl'].flatMap(p=>['Read('+p+')','Grep('+p+')']);
const withBoardDeny=[...base,...boardDeny];
const args={room:withBoardDeny, summary:withBoardDeny, board:base, chain:[...withBoardDeny,'--resume',ID,'--fork-session']};
const order=[['room',1],['summary',1],['board',1],['chain',1],['chain',2],['board',2],['summary',2],['room',2]];
const acs=()=>/acs\.exe/i.test(cp.execFileSync('tasklist',['/FI','IMAGENAME eq acs.exe','/NH'],{encoding:'utf8',windowsHide:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const log=s=>{const l=`${new Date().toISOString()} ${s}`;console.log(l);fs.appendFileSync(path.join(OUT,'..','run4c.log'),l+'\n')};
(async()=>{for(const [arm,n] of order){while(acs()){log('acs.exe is up: waiting');await sleep(60000)}
 const f=path.join(OUT,`answers-${codes[arm]}-r${n}.txt`),t0=Date.now();
 const code=await new Promise(res=>{const ch=cp.spawn('C:/Users/nname/.local/bin/claude.exe',args[arm],{cwd:CWD,windowsHide:true,shell:false,stdio:['pipe','pipe','pipe']});
  const lower=()=>{try{cp.execFileSync('powershell',['-NoProfile','-Command',`$all=Get-CimInstance Win32_Process; $ids=@(${ch.pid}); do { $n=$ids.Count; $ids=@($ids + ($all | ?{ $ids -contains $_.ParentProcessId } | %{ $_.ProcessId }) | sort -Unique) } while ($ids.Count -gt $n); $ids | %{ try { $q=Get-Process -Id $_ -ErrorAction Stop; if($q.PriorityClass -ne 'BelowNormal'){ $q.PriorityClass='BelowNormal' } } catch {} }`],{windowsHide:true})}catch{}};lower();
  const o=fs.createWriteStream(f);ch.stdout.pipe(o);let err='';ch.stderr.on('data',d=>err+=d);ch.stdin.end(prompt[arm]);
  const iv=setInterval(lower,15000);
  ch.on('close',c=>{clearInterval(iv);if(err)fs.writeFileSync(f+'.stderr',err);res(c)})});
 log(`run ${codes[arm]} r${n}: exit ${code}, ${fs.statSync(f).size} B, ${((Date.now()-t0)/1000).toFixed(0)} s`)}})();
