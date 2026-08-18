// Compaction-summary survival measurement. See PREREG.md — definition fixed before running.
'use strict';
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';
const OUTDIR = __dirname;   // was a pane-scoped absolute path; results belong beside the instrument

const EXPECTED_TS = ['2026-07-13T11:02', '2026-07-25T12:56', '2026-07-27T07:17',
  '2026-07-28T12:55', '2026-08-11T09:49', '2026-08-16T11:56', '2026-08-17T13:32',
  // event 8 is the FIRST summary written with precompact-preserve's directive attached.
  // Extractors and survival checks are untouched from PREREG; only the event list grew.
  '2026-08-18T13:38'];

function norm(s) {
  return s.replace(/\r\n/g, '\n').toLowerCase().replace(/\s+/g, ' ').trim();
}

// --- extractors (per PREREG) ---
// KNOWN DEFECT, 2026-08-18, found by pane B while attacking its own result -- NOT PATCHED.
// \b[0-9a-f]{7,40}\b matches "000000000a01" inside the session UUID
// 0c0c0c0a-0000-4000-8000-000000000a01, so "0c0c0c0" and "0000000" are counted as commit shas.
// This affects BASELINE windows as well as the treated one. Correcting it moves the pooled
// baseline 10.2% -> 6.8% (16/235) and event 8 72% -> 70.4% (19/27) -- i.e. fixing it makes the
// measured effect LARGER, which is why B published it against its own attack.
// Left unpatched on purpose: this extractor is fixed by PREREG.md, and editing a pre-registered
// extractor after seeing the result is the tuning-until-it-agrees move even when it costs the
// editor. Both numbers are recorded in exo_memory/journal/2026-08-18.md, seventh append, s3.
// A future run decides; it must decide BEFORE seeing that run's numbers.
function extractShas(text) {
  const out = new Set();
  const re = /\b[0-9a-f]{7,40}\b/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const t = m[0];
    if (/[a-f]/.test(t) && /\d/.test(t)) out.add(t.slice(0, 7));
  }
  return out;
}
const EXT = 'md|js|rs|ps1|psm1|json|jsonl|py|html|css|toml|yml|yaml|sh|vbs|txt|exe';
function extractPaths(text) {
  const out = new Set();
  const re = new RegExp('[A-Za-z0-9_\\-./\\\\~:]*[A-Za-z0-9_\\-]+\\.(?:' + EXT + ')\\b', 'g');
  let m;
  while ((m = re.exec(text)) !== null) {
    const base = m[0].split(/[\/\\]/).pop().toLowerCase();
    out.add(base);
  }
  return out;
}
function extractNums(text) {
  const out = new Set();
  let m;
  const pct = /\b\d+(?:\.\d+)?%/g;
  while ((m = pct.exec(text)) !== null) out.add(m[0]);
  const ratio = /\b(\d+)\/(\d+)\b/g;
  while ((m = ratio.exec(text)) !== null) out.add(m[1] + '/' + m[2]);
  const nofm = /\b(\d+) of (\d+)\b/gi;
  while ((m = nofm.exec(text)) !== null) out.add(m[1] + '/' + m[2]); // canonical N/M
  return out;
}
const FLAG_RE = /falsifier|pre-?regist|predict|registered/i;
function extractFlagSentences(text) {
  const out = new Set();
  const sentences = text.split(/(?<=[.!?])\s+|\n+/);
  for (const s of sentences) {
    const t = s.trim();
    if (t.length >= 40 && FLAG_RE.test(t)) out.add(norm(t));
  }
  return out;
}

// --- survival checks ---
function shaSurvives(sha7, summaryShaSet) { return summaryShaSet.has(sha7); }
function pathSurvives(base, summaryNorm) { return summaryNorm.includes(base); }
function numSurvives(num, summaryNorm) {
  if (summaryNorm.includes(num.toLowerCase())) return true;
  const r = num.match(/^(\d+)\/(\d+)$/);
  if (r) return summaryNorm.includes(r[1] + ' of ' + r[2]);
  return false;
}
const STOP = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'been', 'will',
  'would', 'which', 'their', 'there', 'about', 'into', 'than', 'then', 'when', 'what',
  'because', 'before', 'after', 'while', 'where', 'should', 'could', 'does', 'only',
  'never', 'every', 'still', 'being', 'them', 'they', 'over', 'under', 'same', 'more']);
function flagSurvives(sentNorm, summaryNorm, summaryWordSet) {
  const words = sentNorm.split(' ').filter(w => w.length > 0);
  for (let i = 0; i + 5 <= words.length; i++) {
    if (summaryNorm.includes(words.slice(i, i + 5).join(' '))) return true;
  }
  const content = [...new Set(words.filter(w => w.length >= 4 && !STOP.has(w.replace(/[^a-z0-9]/g, ''))))];
  if (content.length === 0) return false;
  const hit = content.filter(w => summaryWordSet.has(w)).length;
  return hit / content.length >= 0.7;
}

// --- row text extraction ---
function rowTexts(obj) {
  // returns array of conversation text strings for user/assistant rows; excludes tool_result/tool_use
  const msg = obj.message;
  if (!msg) return [];
  const c = msg.content;
  if (typeof c === 'string') return [c];
  if (Array.isArray(c)) {
    return c.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text);
  }
  return [];
}

async function main() {
  const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
  const events = []; // {ts, summaryText, windowRows: n, sha:Set, path:Set, num:Set, flag:Set}
  let cur = { rows: 0, textRows: 0, sha: new Set(), path: new Set(), num: new Set(), flag: new Set() };
  let lineNo = 0, parseErrors = 0, sidechainSkipped = 0;

  for await (const line of rl) {
    lineNo++;
    if (!line.trim()) continue;
    let obj;
    try { obj = JSON.parse(line); } catch (e) { parseErrors++; continue; }
    if (obj.isSidechain === true || obj.isMeta === true) { sidechainSkipped++; continue; }
    const type = obj.type;
    if (type !== 'user' && type !== 'assistant') { cur.rows++; continue; }
    const texts = rowTexts(obj);
    const joined = texts.join('\n');

    if (type === 'user' && joined.trimStart().startsWith('This session is being continued')) {
      events.push({
        ts: obj.timestamp || '(no ts)', line: lineNo, summaryText: joined,
        windowRows: cur.rows, windowTextRows: cur.textRows,
        sha: cur.sha, path: cur.path, num: cur.num, flag: cur.flag
      });
      cur = { rows: 0, textRows: 0, sha: new Set(), path: new Set(), num: new Set(), flag: new Set() };
      continue;
    }
    cur.rows++;
    if (joined.length > 0) {
      cur.textRows++;
      for (const s of extractShas(joined)) cur.sha.add(s);
      for (const p of extractPaths(joined)) cur.path.add(p);
      for (const n of extractNums(joined)) cur.num.add(n);
      if (type === 'assistant') for (const f of extractFlagSentences(joined)) cur.flag.add(f);
    }
  }

  // gate: exactly 7 events, timestamps match
  const gate = { count: events.length, timestamps: events.map(e => e.ts), expected: EXPECTED_TS, ok: true, notes: [] };
  if (events.length !== EXPECTED_TS.length) { gate.ok = false; gate.notes.push('event count != ' + EXPECTED_TS.length); }
  events.forEach((e, i) => {
    const exp = EXPECTED_TS[i];
    if (exp && !(e.ts || '').startsWith(exp)) gate.notes.push(`event ${i + 1} ts ${e.ts} !~ ${exp}`);
  });
  if (gate.notes.length) gate.ok = false;

  const results = [];
  for (const e of events) {
    const sNorm = norm(e.summaryText);
    const sShaSet = extractShas(sNorm);
    const sWordSet = new Set(sNorm.split(' '));
    const score = (set, fn) => {
      const items = [...set];
      const lost = items.filter(i => !fn(i));
      return { total: items.length, survived: items.length - lost.length, lost };
    };
    const sha = score(e.sha, i => shaSurvives(i, sShaSet));
    const pth = score(e.path, i => pathSurvives(i, sNorm));
    const num = score(e.num, i => numSurvives(i, sNorm));
    const flg = score(e.flag, i => flagSurvives(i, sNorm, sWordSet));
    results.push({
      ts: e.ts, line: e.line, windowRows: e.windowRows, summaryChars: e.summaryText.length,
      sha: { total: sha.total, survived: sha.survived, lostSample: sha.lost.slice(0, 15) },
      path: { total: pth.total, survived: pth.survived, lostSample: pth.lost.slice(0, 20) },
      num: { total: num.total, survived: num.survived, lostSample: num.lost.slice(0, 20) },
      flag: { total: flg.total, survived: flg.survived, lostSample: flg.lost.slice(0, 8) }
    });
  }

  const out = { file: FILE, lines: lineNo, parseErrors, sidechainSkipped, gate, results };
  fs.writeFileSync(path.join(OUTDIR, 'results.json'), JSON.stringify(out, null, 2));

  // console summary
  console.log('gate:', JSON.stringify(gate, null, 1));
  const pct = (s, t) => t === 0 ? 'n/a' : Math.round(100 * s / t) + '%';
  for (const r of results) {
    console.log(`${r.ts}  rows=${r.windowRows}  SHA ${r.sha.survived}/${r.sha.total} (${pct(r.sha.survived, r.sha.total)})  PATH ${r.path.survived}/${r.path.total} (${pct(r.path.survived, r.path.total)})  NUM ${r.num.survived}/${r.num.total} (${pct(r.num.survived, r.num.total)})  FLAG ${r.flag.survived}/${r.flag.total} (${pct(r.flag.survived, r.flag.total)})`);
  }
  // falsifier computation: median per-event survival of SHA+PATH+NUM combined, median FLAG
  const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
  const combined = results.map(r => {
    const t = r.sha.total + r.path.total + r.num.total;
    const s = r.sha.survived + r.path.survived + r.num.survived;
    return t ? s / t : NaN;
  }).filter(x => !isNaN(x));
  const flagRates = results.map(r => r.flag.total ? r.flag.survived / r.flag.total : NaN).filter(x => !isNaN(x));
  console.log('median SHA+PATH+NUM survival:', (med(combined) * 100).toFixed(1) + '%');
  console.log('median FLAG survival:', (med(flagRates) * 100).toFixed(1) + '%');
  console.log('FALSIFIER (premise wrong if >=80% and >=70%):',
    med(combined) >= 0.8 && med(flagRates) >= 0.7 ? 'FIRED — PREMISE WRONG' : 'not fired');
}
main().catch(e => { console.error(e); process.exit(1); });
