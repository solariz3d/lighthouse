// Spot-check pass: (1) verify sample survived/lost verdicts against raw text,
// (2) self-healing: % of lost SHA/PATH items that reappear in conversation text AFTER their compaction,
// (3) context for odd NUM extractions like "267/0".
'use strict';
const fs = require('fs');
const readline = require('readline');

const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';
const RES = JSON.parse(fs.readFileSync('C:/Consonance/instances/sibling-5bf9d657/archaeology/results.json', 'utf8'));

function norm(s) { return s.replace(/\r\n/g, '\n').toLowerCase().replace(/\s+/g, ' ').trim(); }
function rowTexts(obj) {
  const msg = obj.message; if (!msg) return [];
  const c = msg.content;
  if (typeof c === 'string') return [c];
  if (Array.isArray(c)) return c.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text);
  return [];
}

async function main() {
  const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
  // per-event boundaries by line number from results
  const bounds = RES.results.map(r => r.line); // compaction line numbers
  // collect: normalized conversation text per segment AFTER each compaction (i.e., segment k = lines (bounds[k], bounds[k+1]) etc.)
  // simplest: for each event k, afterText[k] = all conversation text with lineNo > bounds[k] EXCLUDING summary rows themselves.
  // We accumulate one big array of {lineNo, normText} for conversation rows, then test.
  const rows = [];
  const summaries = {}; // line -> normalized summary text
  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    if (!line.trim()) continue;
    let obj; try { obj = JSON.parse(line); } catch (e) { continue; }
    if (obj.isSidechain === true || obj.isMeta === true) continue;
    if (obj.type !== 'user' && obj.type !== 'assistant') continue;
    const joined = rowTexts(obj).join('\n');
    if (!joined) continue;
    if (obj.type === 'user' && joined.trimStart().startsWith('This session is being continued')) {
      summaries[lineNo] = norm(joined);
      continue;
    }
    rows.push({ lineNo, text: norm(joined) });
  }

  // (1) sample verdict verification, event 7 (line bounds[6])
  const e7 = RES.results[6];
  const s7 = summaries[e7.line];
  const checks = [];
  checks.push(['lost sha 2aa0b84 absent from summary7', !/\b2aa0b84/.test(s7)]);
  checks.push(['lost sha 2aa0b84 present in window7 rows', rows.some(r => r.lineNo > RES.results[5].line && r.lineNo < e7.line && r.text.includes('2aa0b84'))]);
  checks.push(['lost path guard-census.js absent from summary7', !s7.includes('guard-census.js')]);
  checks.push(['lost path guard-census.js present in window7', rows.some(r => r.lineNo > RES.results[5].line && r.lineNo < e7.line && r.text.includes('guard-census.js'))]);
  checks.push(['lost num 15/15 absent from summary7 (both forms)', !s7.includes('15/15') && !s7.includes('15 of 15')]);
  // a survived item: find one sha that survived in event 7
  const e2 = RES.results[1];
  const s2 = summaries[e2.line];
  checks.push(['summary2 contains at least 2 shas (survived=2 claim)', (s2.match(/\b[0-9a-f]{7,40}\b/g) || []).filter(t => /[a-f]/.test(t) && /\d/.test(t)).length >= 2]);

  // (2) self-healing: lost SHA + PATH items per event -> reappear in conversation rows AFTER compaction line?
  const healing = [];
  for (let k = 0; k < RES.results.length; k++) {
    const r = RES.results[k];
    const after = rows.filter(x => x.lineNo > r.line);
    const test = (item) => after.some(x => x.text.includes(item.toLowerCase()));
    const shaLost = r.sha.lostSample; // sample (up to 15) — honest label: sampled
    const pathLost = r.path.lostSample;
    healing.push({
      ts: r.ts,
      shaSampled: shaLost.length, shaReappear: shaLost.filter(test).length,
      pathSampled: pathLost.length, pathReappear: pathLost.filter(test).length
    });
  }

  // (3) context of "267/0" in window 6
  const w6 = rows.filter(r => r.lineNo > RES.results[4].line && r.lineNo < RES.results[5].line);
  let ctx = null;
  for (const r of w6) {
    const i = r.text.indexOf('267/0');
    if (i >= 0) { ctx = r.text.slice(Math.max(0, i - 120), i + 120); break; }
  }

  console.log('VERDICT CHECKS:');
  for (const [name, ok] of checks) console.log(' ', ok ? 'PASS' : 'FAIL', '-', name);
  console.log('\nSELF-HEALING (lost items reappearing in live rows AFTER their compaction; SAMPLED lost items only):');
  for (const h of healing) console.log(` ${h.ts}  SHA ${h.shaReappear}/${h.shaSampled}  PATH ${h.pathReappear}/${h.pathSampled}`);
  console.log('\n"267/0" context in window 6:', ctx ? JSON.stringify(ctx) : 'not found in window 6');
}
main().catch(e => { console.error(e); process.exit(1); });
