// Read-only. For each forced delivery: find the arrival in the pane's raw capture, back up to the start of
// the synchronized-update frame that carries it (ESC[?2026h), take the pane's geometry from the max cursor
// address in the preceding window, and replay the screen as it stood just before the arrival.
// Also: what the pane emitted between its last full frame and the arrival (quiet-term evidence).
const fs = require('fs');
const { spawnSync } = require('child_process');
const CAP = 'C:/Consonance/data/captures/';
const BIN = __dirname + '/screen/target/release/screen.exe';
const CASES = [
  ['09-18 23:28:40 -> Main', '0c0c0c0a-0000-4000-8000-000000000a01', 'D072 (SMALL FIXES, CHUNK 1) RETURN'],
  ['09-18 23:33:38 -> Lib ', '0c0c0c0b-0000-4000-8000-00000000115b', 'D072 is landed at 5838529'],
  ['09-18 23:38:17 -> Main', '0c0c0c0a-0000-4000-8000-000000000a01', 'CHUNK 2 IS SHAPED'],
  ['09-18 23:50:25 -> Lib ', '0c0c0c0b-0000-4000-8000-00000000115b', 'P-SECOND-INSTANCE-TEXT (D073'],
  ['09-19 00:23:29 -> Main', '0c0c0c0a-0000-4000-8000-000000000a01', 'THE FIRST BIGGER LINE IS PLANNED'],
  ['09-19 00:27:52 -> E   ', 'a2122153-a37e-41a6-a86f-534267ec0565', '[Pasted text #2 +21 lines]', 'last'],
];
const TAIL = 3_000_000;
const SYNC = Buffer.from('\x1b[?2026h');
const cache = {};
for (const [label, pane, needle, which] of CASES) {
  const buf = cache[pane] || (cache[pane] = fs.readFileSync(CAP + pane + '.log'));
  const nb = Buffer.from(needle);
  const at = which === 'last' ? buf.lastIndexOf(nb) : buf.indexOf(nb);
  if (at < 0) { console.log(`\n#### ${label} "${needle}" NOT FOUND`); continue; }
  const frame = buf.lastIndexOf(SYNC, at);
  // geometry: max CSI row;col H in the window
  const win = buf.slice(Math.max(0, frame - TAIL), frame).toString('latin1');
  let R = 0, C = 0; const re = /\x1b\[(\d+);(\d+)H/g; let m;
  while ((m = re.exec(win))) { R = Math.max(R, +m[1]); C = Math.max(C, +m[2]); }
  // bytes between the previous frame end and this frame: what the pane emitted while "idle"
  const prevFrame = buf.lastIndexOf(SYNC, frame - 1);
  const gap = buf.slice(prevFrame, frame).toString('utf8');
  const osc = (gap.match(/\x1b\][^\x07]*\x07/g) || []);
  console.log(`\n#### ${label}  "${needle}"  arrival @${at}  frame @${frame}  geometry ${R}x${C}  previous frame ${frame - prevFrame} B earlier, OSC in it ${osc.length}`);
  const r = spawnSync(BIN, [CAP + pane + '.log', String(frame), String(TAIL), String(R), String(C)], { encoding: 'utf8', maxBuffer: 1 << 26 });
  process.stdout.write(r.stdout + (r.stderr || ''));
}
