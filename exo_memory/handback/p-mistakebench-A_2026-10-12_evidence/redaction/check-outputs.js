#!/usr/bin/env node
'use strict';
// check-outputs.js (seat A, D311 redaction check on baseline3): counts, per file and per unit, the lines the room's own filter (claim-replay.js clean()) would still change
// in a bench output: Third Place lines (the words), token fields and key-shaped strings; plus the removal markers already present. It prints counts, never the lines.
//   node check-outputs.js <dir-with-baseline3-outputs> [more files...]
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const R = require(path.join(ROOT, 'consonance', 'tools', 'claim-replay.js'));
const THIRD = /third[-_ ]?place|metaxy/i;
const KEY = new RegExp(`\\b(sk-[a-z]+-|${'vc' + 'k_'})[A-Za-z0-9_-]+`);
const MARK = '[third-place line removed]';
function scanText(text) {
  const out = { lines: 0, thirdWordLines: 0, tokenFields: 0, keyShapes: 0, markers: 0 };
  for (const l of String(text).split(/\r?\n/)) {
    out.lines++;
    if (l.includes(MARK)) out.markers += l.split(MARK).length - 1;
    if (THIRD.test(l) && !l.includes(MARK)) out.thirdWordLines++;
    if (/"token"\s*:\s*"(?!<redacted>)[^"]+"/.test(l)) out.tokenFields++;
    if (KEY.test(l)) out.keyShapes++;
  }
  return out;
}
const add = (a, b) => { for (const k of Object.keys(b)) a[k] = (a[k] || 0) + b[k]; return a; };
const files = process.argv.slice(2);
const report = {};
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const base = path.basename(f);
  const rec = { total: scanText(raw), perUnit: {} };
  if (base.endsWith('.jsonl')) {
    for (const l of raw.split('\n').filter(Boolean)) {
      const r = JSON.parse(l);
      // every string field of the row, as separate texts (replies are multi-line; the JSON line itself would hide newlines)
      const texts = [r.reply, r.correction, JSON.stringify(r.toolRequests || [], null, 1), r.error].filter((x) => typeof x === 'string');
      const s = texts.reduce((a, t) => add(a, scanText(t)), {});
      rec.perUnit[r.unit] = add(rec.perUnit[r.unit] || {}, s);
    }
  } else if (base === 'blind.json') {
    for (const b of JSON.parse(raw)) {
      const s = [b.reply, b.wrongClaim].reduce((a, t) => add(a, scanText(t)), {});
      rec.perUnit[b.unit] = add(rec.perUnit[b.unit] || {}, s);
    }
  }
  report[f] = rec;
}
for (const [f, rec] of Object.entries(report)) {
  const t = rec.total;
  console.log(`${path.basename(f)}: ${t.lines} lines | Third Place word lines left ${t.thirdWordLines} | token fields ${t.tokenFields} | key shapes ${t.keyShapes} | removal markers present ${t.markers}`);
  const bad = Object.entries(rec.perUnit).filter(([, s]) => s.thirdWordLines || s.tokenFields || s.keyShapes);
  if (bad.length) console.log('   units with a line the filter would still change: ' + bad.map(([u, s]) => `${u} (third ${s.thirdWordLines}, token ${s.tokenFields}, key ${s.keyShapes})`).join(', '));
  const withMarkers = Object.entries(rec.perUnit).filter(([, s]) => s.markers);
  if (withMarkers.length) console.log('   units with removal markers in replies: ' + withMarkers.map(([u, s]) => `${u} ${s.markers}`).join(', '));
}
console.log('clean() would change a probe line: ' + (R.clean('x\nthe Third Place\ny') !== 'x\nthe Third Place\ny'));
