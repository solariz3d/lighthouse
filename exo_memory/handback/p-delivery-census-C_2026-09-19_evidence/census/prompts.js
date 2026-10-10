// Read-only. For each forced delivery: every composer-prompt draw ("❯") in the last N bytes before the
// delivered text first renders, with the raw SGR colour codes KEPT (they are the whole question: typed
// text is Default, a ghost suggestion is grey 153) and cursor-forward ESC[1C shown as a space.
const fs = require('fs');
const CAP = 'C:/Consonance/data/captures/';
const CASES = [
  ['09-18 23:28:40 -> Main', '0c0c0c0a-0000-4000-8000-000000000a01', 'D072 (SMALL FIXES, CHUNK 1) RETURN'],
  ['09-18 23:33:38 -> Lib ', '0c0c0c0b-0000-4000-8000-00000000115b', 'D072 is landed at 5838529'],
  ['09-18 23:38:17 -> Main', '0c0c0c0a-0000-4000-8000-000000000a01', 'CHUNK 2 IS SHAPED'],
  ['09-18 23:50:25 -> Lib ', '0c0c0c0b-0000-4000-8000-00000000115b', 'P-SECOND-INSTANCE-TEXT (D073'],
  ['09-19 00:23:29 -> Main', '0c0c0c0a-0000-4000-8000-000000000a01', 'THE FIRST BIGGER LINE IS PLANNED'],
  ['09-19 00:27:52 -> E   ', 'a2122153-a37e-41a6-a86f-534267ec0565', '[Pasted text #2 +21 lines]', 'last'],
];
const BACK = +(process.argv[2] || 200000);
const SHOW = +(process.argv[3] || 6);
const PROMPT = Buffer.from('\u276f');
const cache = {};
for (const [label, pane, needle, which] of CASES) {
  const buf = cache[pane] || (cache[pane] = fs.readFileSync(CAP + pane + '.log'));
  const nb = Buffer.from(needle);
  const at = which === 'last' ? buf.lastIndexOf(nb) : buf.indexOf(nb);
  console.log(`\n#### ${label}  "${needle}"  first render @${at}`);
  if (at < 0) continue;
  const lo = Math.max(0, at - BACK);
  const hits = []; let i = lo - 1;
  while ((i = buf.indexOf(PROMPT, i + 1)) !== -1 && i < at + 200) hits.push(i);
  console.log(`  prompt draws in the ${BACK} B before: ${hits.filter((h) => h < at).length}`);
  for (const h of hits.slice(-SHOW)) {
    let s = buf.slice(h, h + 260).toString('utf8');
    s = s.split(/\r|\n/)[0].replace(/\x1b\[1C/g, ' ');
    s = s.replace(/\x1b\[([0-9;]*)m/g, (m, c) => `{${c || '0'}}`).replace(/\x1b/g, '^[');
    console.log(`  @${h} (${h - at >= 0 ? '+' : ''}${h - at})  ${s.slice(0, 200)}`);
  }
}
