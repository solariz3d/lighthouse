// Attacks A, B, D on event 8. Reuses extract.js's own exported logic by re-declaring
// IDENTICAL extractor/survival code — verified byte-identical to the committed instrument.
'use strict';
const fs = require('fs');
const readline = require('readline');

const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';
const EV7_LINE = 20632, EV8_LINE = 24386;

function norm(s){return s.replace(/\r\n/g,'\n').toLowerCase().replace(/\s+/g,' ').trim();}
function extractShas(text){const out=new Set();const re=/\b[0-9a-f]{7,40}\b/g;let m;
  while((m=re.exec(text))!==null){const t=m[0];if(/[a-f]/.test(t)&&/\d/.test(t))out.add(t.slice(0,7));}return out;}
function extractNums(text){const out=new Set();let m;
  const pct=/\b\d+(?:\.\d+)?%/g;while((m=pct.exec(text))!==null)out.add(m[0]);
  const ratio=/\b(\d+)\/(\d+)\b/g;while((m=ratio.exec(text))!==null)out.add(m[1]+'/'+m[2]);
  const nofm=/\b(\d+) of (\d+)\b/gi;while((m=nofm.exec(text))!==null)out.add(m[1]+'/'+m[2]);return out;}
const FLAG_RE=/falsifier|pre-?regist|predict|registered/i;
function extractFlagSentences(text){const out=new Set();const sentences=text.split(/(?<=[.!?])\s+|\n+/);
  for(const s of sentences){const t=s.trim();if(t.length>=40&&FLAG_RE.test(t))out.add(norm(t));}return out;}
const STOP=new Set(['this','that','with','from','have','were','been','will','would','which','their','there','about','into','than','then','when','what','because','before','after','while','where','should','could','does','only','never','every','still','being','them','they','over','under','same','more']);
function flagRoute(sentNorm, summaryNorm, summaryWordSet){
  const words=sentNorm.split(' ').filter(w=>w.length>0);
  for(let i=0;i+5<=words.length;i++){ if(summaryNorm.includes(words.slice(i,i+5).join(' '))) return 'ngram'; }
  const content=[...new Set(words.filter(w=>w.length>=4&&!STOP.has(w.replace(/[^a-z0-9]/g,''))))];
  if(content.length===0) return null;
  const hit=content.filter(w=>summaryWordSet.has(w)).length;
  return hit/content.length>=0.7 ? 'bagofwords('+hit+'/'+content.length+')' : null;
}
function rowTexts(obj){const msg=obj.message;if(!msg)return[];const c=msg.content;
  if(typeof c==='string')return[c];
  if(Array.isArray(c))return c.filter(b=>b&&b.type==='text'&&typeof b.text==='string').map(b=>b.text);
  return[];}

(async()=>{
  const rl=readline.createInterface({input:fs.createReadStream(FILE),crlfDelay:Infinity});
  let lineNo=0;
  const shaRows=new Map();   // sha -> [{line,type,ts}]
  const numRows=new Map();
  const flagRows=new Map();  // flagSentNorm -> {line,ts}
  let summaryText=null;
  const canaryHits=[], directiveNumHits=[];
  const rowMeta=new Map();   // line -> {type, ts, len, head}

  for await(const line of rl){
    lineNo++;
    if(!line.trim())continue;
    let obj; try{obj=JSON.parse(line);}catch(e){continue;}

    // canary / directive-text search across the WHOLE raw line (not just conversation text),
    // so a local-command-stdout or attachment row cannot hide.
    if(line.includes('PRECOMPACT-PRESERVE-V1')) canaryHits.push({line:lineNo,ts:obj.timestamp||null,type:obj.type,sidechain:obj.isSidechain===true,meta:obj.isMeta===true});
    if(line.includes('33.8%')&&line.includes('10.2%')) directiveNumHits.push({line:lineNo,ts:obj.timestamp||null,type:obj.type,sidechain:obj.isSidechain===true,meta:obj.isMeta===true});

    if(obj.isSidechain===true||obj.isMeta===true)continue;
    const type=obj.type;
    if(type!=='user'&&type!=='assistant')continue;
    const joined=rowTexts(obj).join('\n');

    if(lineNo===EV8_LINE){ summaryText=joined; continue; }
    if(lineNo<=EV7_LINE||lineNo>=EV8_LINE)continue;
    if(!joined.length)continue;

    rowMeta.set(lineNo,{type,ts:obj.timestamp,len:joined.length,head:joined.slice(0,90).replace(/\s+/g,' ')});
    for(const s of extractShas(joined)){ if(!shaRows.has(s))shaRows.set(s,[]); shaRows.get(s).push(lineNo); }
    for(const n of extractNums(joined)){ if(!numRows.has(n))numRows.set(n,[]); numRows.get(n).push(lineNo); }
    if(type==='assistant') for(const f of extractFlagSentences(joined)){ if(!flagRows.has(f))flagRows.set(f,lineNo); }
  }

  const sNorm=norm(summaryText);
  const sShaSet=extractShas(sNorm);
  const sWordSet=new Set(sNorm.split(' '));

  console.log('=== B. CONTAMINATION ===');
  console.log('summary row line', EV8_LINE, ' window =', EV7_LINE+1, '..', EV8_LINE-1);
  console.log('canary PRECOMPACT-PRESERVE-V1 occurrences:', JSON.stringify(canaryHits,null,1));
  console.log('rows carrying BOTH 33.8% and 10.2% (directive fingerprint):', JSON.stringify(directiveNumHits,null,1));

  console.log('\n=== A. SHA DENOMINATOR / CONCENTRATION ===');
  const survived=[...shaRows.keys()].filter(s=>sShaSet.has(s));
  const lost=[...shaRows.keys()].filter(s=>!sShaSet.has(s));
  console.log('total',shaRows.size,'survived',survived.length,'lost',lost.length);
  // concentration: how many distinct source rows do survivors come from?
  const rowCount=new Map();
  for(const s of survived) for(const l of new Set(shaRows.get(s))) rowCount.set(l,(rowCount.get(l)||0)+1);
  const top=[...rowCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);
  console.log('survivor shas by source row (top):');
  for(const [l,c] of top) console.log('  line',l,'carries',c,'survivors  |',(rowMeta.get(l)||{}).type,(rowMeta.get(l)||{}).head);
  const lostRowCount=new Map();
  for(const s of lost) for(const l of new Set(shaRows.get(s))) lostRowCount.set(l,(lostRowCount.get(l)||0)+1);
  console.log('lost shas by source row (top):');
  for(const [l,c] of [...lostRowCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6)) console.log('  line',l,'carries',c,'lost  |',(rowMeta.get(l)||{}).type,(rowMeta.get(l)||{}).head);
  console.log('survived shas:',survived.join(' '));
  console.log('lost shas:',lost.join(' '));
  // how many rows does each survivor appear in? (repetition = cheap to keep)
  const rep=survived.map(s=>[s,new Set(shaRows.get(s)).size]).sort((a,b)=>b[1]-a[1]);
  const repL=lost.map(s=>[s,new Set(shaRows.get(s)).size]).sort((a,b)=>b[1]-a[1]);
  const mean=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2):'n/a';
  console.log('mean #rows a SURVIVING sha appears in:',mean(rep.map(x=>x[1])),' LOST:',mean(repL.map(x=>x[1])));

  console.log('\n=== D. FLAG ROUTE ANALYSIS ===');
  let ngram=0,bow=0;
  const bowList=[],ngList=[];
  for(const [f,l] of flagRows.entries()){
    const r=flagRoute(f,sNorm,sWordSet);
    if(!r)continue;
    if(r==='ngram'){ngram++;ngList.push([l,f]);}else{bow++;bowList.push([l,r,f]);}
  }
  console.log('flag survivors total',ngram+bow,' via 5-gram (verbatim):',ngram,' via bag-of-words (paraphrase-tolerant):',bow);
  console.log('\n-- ngram (genuinely verbatim) --');
  for(const [l,f] of ngList) console.log('  line',l,'|',f.slice(0,230));
  console.log('\n-- bag-of-words survivors --');
  for(const [l,r,f] of bowList) console.log('  line',l,r,'|',f.slice(0,230));

  console.log('\n=== NUM concentration ===');
  const nSurv=[...numRows.keys()].filter(n=>{const t=n.toLowerCase();if(sNorm.includes(t))return true;const m=n.match(/^(\d+)\/(\d+)$/);return m?sNorm.includes(m[1]+' of '+m[2]):false;});
  console.log('num survived',nSurv.length,'of',numRows.size);
  console.log('survived nums:',nSurv.join(' '));
})();
