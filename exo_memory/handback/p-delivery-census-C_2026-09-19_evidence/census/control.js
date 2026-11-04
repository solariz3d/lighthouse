// Read-only. Control for the ghost finding: for EVERY delivery in the census (immediate, held, forced), what
// did the receiving pane's composer hold at the moment the delivery began to render?
// Method: locate the delivery's first render in the raw capture (its preview text, words joined by a space OR
// ESC[1C, or a "[Pasted text" marker that precedes it), then walk back to the last composer draw ("❯") and
// report any SGR 2 (dim) text drawn in that composer draw. Dim text in the composer = a prompt SUGGESTION,
// which vt100 0.15.2 cannot see as dim (screen.rs:1400-1408 has no arm for SGR 2).
const fs = require('fs');
const CAP = 'C:/Consonance/data/captures/';
const ROWS = fs.readFileSync(__dirname + '/census-run1.txt', 'utf8').split('\n');
const PANES = { '0c0c0c0a': '0c0c0c0a-0000-4000-8000-000000000a01', '0c0c0c0b': '0c0c0c0b-0000-4000-8000-00000000115b',
  '6fe15f0a': '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f', '12fb81f6': '12fb81f6-f4c0-4ef8-aad8-f0cdce091925',
  'a2122153': 'a2122153-a37e-41a6-a86f-534267ec0565', '0845a868': '0845a868-38f2-4cc2-b45a-431e0c088fb1' };
const items = [];
for (let i = 0; i < ROWS.length; i++) {
  let m = /^\s+(\d\d-\d\d, \d\d:\d\d:\d\d) \S+\s+-> (\w{8}) .*"(.+)"\s*$/.exec(ROWS[i]);         // immediate row
  if (m) { items.push({ when: m[1], pane: m[2], kind: 'IMMEDIATE', text: m[3] }); continue; }
  m = /^\s+(\d\d-\d\d, \d\d:\d\d:\d\d) -> (\w{8})\s+(FORCED AT THE BOUND|HELD, THEN DELIVERED)/.exec(ROWS[i]);
  if (m) { const t = /"(.+)"/.exec(ROWS[i + 1]); items.push({ when: m[1], pane: m[2], kind: m[3].startsWith('F') ? 'FORCED' : 'HELD', text: t[1] }); }
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cache = {};
const tally = {};
for (const it of items) {
  const file = CAP + PANES[it.pane] + '.log';
  const ascii = it.text.split(/[^\x20-\x7e]/)[0].slice(0, 30).trim();
  const re = new RegExp(ascii.split(' ').filter(Boolean).map(esc).join('(?: |\\x1b\\[1C)+'), 'g');
  const buf = cache[file] || (cache[file] = fs.readFileSync(file));
  const s = cache[file + ':s'] || (cache[file + ':s'] = buf.toString('latin1'));   // byte offsets == string offsets
  // the delivery's first render: the first match on or after the delivery's own day is not recoverable from
  // bytes (no clock), so take the FIRST match of the preview anywhere, which is its arrival for every message
  // that nobody quoted before it arrived.
  re.lastIndex = 0; const hit = re.exec(s);
  let verdict, detail = '';
  if (!hit) { verdict = 'NOT FOUND'; }
  else {
    const lo = Math.max(0, hit.index - 20000);
    const win = s.slice(lo, hit.index);
    const pm = [...win.matchAll(/\[Pasted(?: |\x1b\[1C)text/g)].pop();
    const stop = pm ? pm.index : win.length;
    const promptAt = win.lastIndexOf('\xe2\x9d\xaf', stop);                          // ❯ in utf-8, read as latin1
    const draw = promptAt < 0 ? '' : Buffer.from(win.slice(promptAt, stop), 'latin1').toString('utf8');
    const dims = [...draw.replace(/\x1b\[1C/g, ' ').matchAll(/\x1b\[2m([^\x1b]*)/g)].map((x) => x[1]).filter((x) => x.trim());
    verdict = promptAt < 0 ? 'NO PROMPT DRAW' : dims.length ? 'GHOST' : 'no ghost';
    detail = dims.length ? JSON.stringify(dims[dims.length - 1].slice(0, 50)) : '';
  }
  tally[it.kind + ' / ' + verdict] = (tally[it.kind + ' / ' + verdict] || 0) + 1;
  console.log(`${it.when}  ${it.kind.padEnd(9)} -> ${it.pane}  ${verdict.padEnd(14)} ${detail}   | "${ascii}"`);
}
console.log('\nTALLY (kind / what the composer held at the render)');
for (const [k, v] of Object.entries(tally).sort()) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log(`  ${items.length} deliveries read`);
