// Read-only. Screen-level control for all 31 deliveries: replay each receiving pane's raw capture through
// vt100 0.15.2 up to the last cursor-show before the delivery's first output, and classify the composer row
// EMPTY / GHOST (dim, SGR 2 — a prompt suggestion) / TYPED (Default fg, non-dim).
// Geometry: rows = max CSI row, cols = max CSI col + 40, over the 400 KB before (no geometry is logged).
const fs = require('fs');
const { spawnSync } = require('child_process');
const CAP = 'C:/Consonance/data/captures/';
const BIN = __dirname + '/screen/target/release/screen.exe';
const ROWS = fs.readFileSync(__dirname + '/census-run1.txt', 'utf8').split('\n');
const PANES = { '0c0c0c0a': '0c0c0c0a-0000-4000-8000-000000000a01', '0c0c0c0b': '0c0c0c0b-0000-4000-8000-00000000115b',
  '6fe15f0a': '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f', '12fb81f6': '12fb81f6-f4c0-4ef8-aad8-f0cdce091925',
  'a2122153': 'a2122153-a37e-41a6-a86f-534267ec0565', '0845a868': '0845a868-38f2-4cc2-b45a-431e0c088fb1' };
// Deliveries whose preview never renders as text (a collapsed paste): anchor on the paste marker, named here
// with the evidence for each, rather than guessed by a rule.
const PASTE_ANCHOR = {
  '09-19, 00:27:52|a2122153': '[Pasted text #2 +21 lines]',   // prompts-run1: the last marker in E's log, drawn after the ghost
};
const items = [];
for (let i = 0; i < ROWS.length; i++) {
  let m = /^\s+(\d\d-\d\d, \d\d:\d\d:\d\d) \S+\s+-> (\w{8}) .*"(.+)"\s*$/.exec(ROWS[i]);
  if (m) { items.push({ when: m[1], pane: m[2], kind: 'IMMEDIATE', text: m[3] }); continue; }
  m = /^\s+(\d\d-\d\d, \d\d:\d\d:\d\d) -> (\w{8})\s+(FORCED AT THE BOUND|HELD, THEN DELIVERED)/.exec(ROWS[i]);
  if (m) { const t = /"(.+)"/.exec(ROWS[i + 1]); items.push({ when: m[1], pane: m[2], kind: m[3].startsWith('F') ? 'FORCED' : 'HELD', text: t[1] }); }
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cache = {}; const tally = {};
for (const it of items) {
  const base = PANES[it.pane] + '.log';
  const s = cache[base] || (cache[base] = fs.readFileSync(CAP + base).toString('latin1'));
  let hit = -1;
  const pa = PASTE_ANCHOR[it.when + '|' + it.pane];
  if (pa) hit = s.lastIndexOf(pa);
  else {
    // skip a leading "NAME — " salutation: its dash is non-ASCII and the words before it are too common
    const words = it.text.replace(/^[A-Z]+ \u2014 /, '').split(/[^\x20-\x7e]/)[0].slice(0, 30).trim().split(' ').filter(Boolean);
    const re = new RegExp(words.map(esc).join('(?: |\\x1b\\[1C)+'));
    const m = re.exec(s); if (m) hit = m.index;
  }
  let out = 'NOT FOUND';
  if (hit >= 0) {
    const lo = Math.max(0, hit - 20000);
    const win = s.slice(lo, hit);
    const pm = [...win.matchAll(/\[Pasted(?: |\x1b\[1C)text/g)].pop();
    const first = pm && !pa ? lo + pm.index : hit;                  // the delivery's first visible output
    const pasted = !!pm || !!pa;                                     // a paste marker is itself the first output
    const frame = pasted ? first : s.lastIndexOf('\xe2\x9d\xaf', first);  // else: the draw carrying the text
    const end = s.lastIndexOf('\x1b[?25h', frame);                    // the last completed write before it
    const g = s.slice(Math.max(0, end - 400000), end); let R = 0, C = 0; const re2 = /\x1b\[(\d+);(\d+)H/g; let mm;
    while ((mm = re2.exec(g))) { R = Math.max(R, +mm[1]); C = Math.max(C, +mm[2]); }
    // FLOOR for the two wide seats: the max absolute cursor column UNDER-reads the width (ink moves with ESC[1C
    // and \r\n padding, not only ESC[r;cH). Run 2 read the librarian at 177 cols and missed two ghosts that a
    // 311/324-col replay shows; 324 is the widest inferred for these panes in run 2. Set COLS_FLOOR=0 to undo.
    const floor = /^0c0c0c0[ab]/.test(base) ? +(process.env.COLS_FLOOR ?? 324) : 0;
    const W = Math.max(C + 40, floor);
    const r = spawnSync(BIN, [CAP + base, String(end), '4000000', String(R), String(W)], { encoding: 'utf8', maxBuffer: 1 << 26 });
    out = (r.stdout || r.stderr || '').trim() + `\t(end @${end}, ${R}x${W})`;
  }
  const cls = out.split('\t')[0];
  tally[it.kind + ' / ' + cls] = (tally[it.kind + ' / ' + cls] || 0) + 1;
  console.log(`${it.when}  ${it.kind.padEnd(9)} -> ${it.pane}  ${out.slice(0, 260)}`);
}
console.log('\nTALLY (kind / composer at the moment before delivery)');
for (const [k, v] of Object.entries(tally).sort()) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log(`  ${items.length} deliveries read`);
