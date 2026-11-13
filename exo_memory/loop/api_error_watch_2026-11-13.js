// Watches the board for a seat that has stopped on an API error (the 403 of 2026-11-13), and exits when it sees one.
// The librarian's instrument (L, 2026-11-13). Trace: exo_memory/loop/stall_trace_403_packets_eaten_2026-11-13.md.
//
// Why: a seat that gets "Please run /login · API Error: 403 …" ends its turn and waits. Nothing tells any other seat.
// A seat runs this in the background. When it exits, the seat is woken, reads the one line it printed, and nudges.
//
// Use (light: it reads the tail of one file every 10 seconds, and must NOT take the heavy-run lock):
//   node exo_memory/loop/api_error_watch_2026-11-13.js            watch until a stop is seen, or 45 minutes pass
//   node exo_memory/loop/api_error_watch_2026-11-13.js --once     look once and exit (the proving check)
//   options: --board <path>  --settle <seconds, default 25>  --max <minutes, default 45>  --skip <seat,seat>
// Exit code 0 with a line beginning "STOPPED:" when a seat is stopped; 0 with "clear:" on --once or at --max.
const fs = require('fs');
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : dflt; };
const BOARD = opt('--board', 'C:/Consonance/data/board.jsonl');
const SETTLE_S = Number(opt('--settle', '25'));
const MAX_MIN = Number(opt('--max', '45'));
const ONCE = args.includes('--once');
const SKIP = String(opt('--skip', '')).split(',').filter(Boolean);
// The seats on L today. An id not listed is shown by its first eight characters.
const SEATS = { '0c0c0c0a': 'MAIN', '0c0c0c0b': 'LIB', '6fe15f0a': 'A', '12fb81f6': 'B', '0845a868': 'C', 'a2122153': 'E' };
const TAIL_BYTES = 3 * 1024 * 1024;
const ERR = /^(Please run \/login|API Error)/;

function lastLines() {
  const st = fs.statSync(BOARD);
  const start = Math.max(0, st.size - TAIL_BYTES);
  const fd = fs.openSync(BOARD, 'r');
  const buf = Buffer.alloc(st.size - start);
  fs.readSync(fd, buf, 0, buf.length, start);
  fs.closeSync(fd);
  const last = {};
  for (const line of buf.toString('utf8').split('\n')) {
    if (!line) continue;
    let o; try { o = JSON.parse(line); } catch (e) { continue; }   // the first line of the tail may be cut
    if (o.role !== 'assistant' || !o.pane) continue;
    const id = String(o.pane).slice(0, 8);
    const ts = o.ts > 1e12 ? o.ts : o.ts * 1000;
    if (!last[id] || ts >= last[id].ts) last[id] = { ts, text: String(o.text || '') };
  }
  return last;
}

function stopped(now) {
  const last = lastLines();
  const out = [];
  for (const id of Object.keys(last)) {
    const seat = SEATS[id] || id;
    if (SKIP.includes(seat)) continue;
    const l = last[id];
    if (ERR.test(l.text.trim()) && now - l.ts >= SETTLE_S * 1000) out.push(seat + ' (' + new Date(l.ts).toISOString().slice(11, 19) + 'Z)');
  }
  return out;
}

function look() {
  const now = Date.now();
  const s = stopped(now);
  if (s.length) { console.log('STOPPED: ' + s.join(', ') + ' — last line is an API error; packets delivered since are not acted on. Nudge each, about 30 s apart.'); process.exit(0); }
  return now;
}

const t0 = Date.now();
look();
if (ONCE) { console.log('clear: no seat\'s last line is an API error (' + new Date().toISOString().slice(11, 19) + 'Z)'); process.exit(0); }
setInterval(() => {
  const now = look();
  if (now - t0 > MAX_MIN * 60 * 1000) { console.log('clear: no stop seen in ' + MAX_MIN + ' minutes; arm it again'); process.exit(0); }
}, 10000);
