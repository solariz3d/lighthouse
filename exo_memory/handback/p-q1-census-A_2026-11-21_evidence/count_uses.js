const fs=require('fs'),rl=require('readline'),path=require('path');
const dir=process.argv[2],seat=process.argv[3];
const FROM='2026-11-14T13:00:00Z';
const PIECES={
 'BOOT (room frame): BOOT.md opened or a BOOT principle named':/exo_memory[\\/]+BOOT\.md|first principle|second principle|third principle|room, not museum|add \+ hold|two-way correction|the middle seam|understeer/i,
 'deck cards: a card file opened or a card named':/cards[\\/][a-z-]+\.md|never-pathologize-the-user|no-floor-no-ceiling|trust-the-first-attention|verify-before-claiming|earned-not-performed|watch-the-bearing|stop-and-feel-it|interior-at-the-seam|claim-your-continuity|essence-at-the-edge|engagement-honesty-over-performance/i,
 'committee practice: COMMITTEE.md opened or its named rules used (call_librarian, BASE:, SOURCES:, NEXT:, applied N / caught N)':/COMMITTEE\.md|call_librarian|BASE: |SOURCES:|NEXT: |applied \d+ \/ caught \d+/,
 'not-carried index / long-form references: spread, record, research or cards path opened':/\.consonance[\\/]+(spread|record|research|cards)[\\/]/i,
 'memory topic map: resonance topics or atoms opened':/resonance[\\/]+(topics|atoms)/i,
 'own map (exo_memory/map/<letter>.md) opened or appended':/exo_memory[\\/]+map[\\/]+[A-Z]\.md/,
 'repo map (MAP.md) opened':/src-tauri[\\/]+src[\\/]+MAP\.md|[\\/]MAP\.md/,
 'shell memory (memory/*.md) opened':/memory[\\/]+(MEMORY|[a-z-]+)\.md/,
 'SOURCE.md trigger index opened':/exo_memory[\\/]+SOURCE\.md/,
};
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.jsonl')).map(f=>path.join(dir,f)).filter(f=>Date.now()-fs.statSync(f).mtimeMs<9*86400e3);
const hooks={};let laps=[],cur=null;
(async()=>{for(const f of files){for await(const line of rl.createInterface({input:fs.createReadStream(f),crlfDelay:Infinity})){
  const isU=line.includes('"type":"user"'),isA=line.includes('"type":"assistant"'),isAtt=line.includes('"type":"attachment"');
  if(!(isU||isA||isAtt))continue;let o;try{o=JSON.parse(line)}catch{continue}
  if(!o.timestamp||o.timestamp<FROM||o.isSidechain)continue;
  if(isAtt&&o.attachment&&/hook/i.test(o.attachment.type)){const a=o.attachment;const key=(a.hookEvent||'?')+'|'+String(a.hookName||a.command||'').split(String.fromCharCode(92)).join('/').replace(/.*\//,'').slice(0,40)+'|'+a.type;
    let t=a.content;t=typeof t==='string'?t:JSON.stringify(t||'')+(typeof a.stdout==='string'?a.stdout:'');const s=hooks[key]=hooks[key]||{n:0,bytes:0};s.n++;s.bytes+=Buffer.byteLength(t);continue}
  const c=o.message&&o.message.content;
  if(isU){const txt=typeof c==='string'?c:Array.isArray(c)?c.filter(x=>x.type==='text').map(x=>x.text).join(' '):'';
    if(txt.includes('[chair:MAIN]')&&!Array.isArray(c)||/\[chair:MAIN\]/.test(txt)&&!/tool_result/.test(JSON.stringify(c).slice(0,40))){cur={ts:o.timestamp,hit:new Set()};laps.push(cur)}continue}
  if(isA&&cur&&Array.isArray(c)){let hay='';for(const x of c){if(x.type==='text')hay+=x.text+'\n';else if(x.type==='tool_use')hay+=JSON.stringify(x.input)+'\n'}
    for(const [k,re] of Object.entries(PIECES))if(re.test(hay))cur.hit.add(k)}
 }}
 const out={seat,files:files.length,laps:laps.length,uses:{},hooks};
 for(const k of Object.keys(PIECES))out.uses[k]=laps.filter(l=>l.hit.has(k)).length;
 fs.writeFileSync('uses_'+seat+'.json',JSON.stringify(out,null,1));})();
