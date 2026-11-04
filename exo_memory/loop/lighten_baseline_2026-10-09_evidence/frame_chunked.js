'use strict';
// frame_chunked.js - D277 part 4 (seat A), measure (b) staging. READ-ONLY, COUNTS ONLY, prints no content.
// The membership rule is frame.js's (claim_base_rate_registration_2026-09-27.md §11, sha256 759ae42b...), COPIED UNCHANGED:
//   one assistant message (message.id) per seat's MAIN session transcript; claim-bearing text = text blocks + Write content + Edit new_string
//   + MultiEdit new_strings + Bash heredoc bodies; counted if >= 200 characters; machine from the nearest preceding hook-attachment row.
// ONE CHANGE, and only one: the file is read in 1 MiB chunks, one line at a time, instead of `fs.readFileSync(f, 'utf8')`. The sealed script
// reads each transcript as ONE string, which throws past V8's 536,870,888-byte limit; its `catch` then files the whole seat under `missing`
// and prints zeros. The chair's transcript is 549,537,160 bytes today, so the sealed script reports the chair (13% of the L119 frame) as empty.
//   node frame_chunked.js                                  prints the same day table frame.js prints (all days)
//   node frame_chunked.js --from <ISO> --to <ISO>          adds a block counting messages whose FIRST-ROW timestamp is in [from, to)
const fs = require('fs'), path = require('path'), os = require('os');
const argv = process.argv.slice(2);
const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const FROM = opt('--from') ? Date.parse(opt('--from')) : null, TO = opt('--to') ? Date.parse(opt('--to')) : null;
const P = path.join(os.homedir(), '.claude', 'projects');
const SEATS = {
  librarian: ['C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b'],
  chair: ['C--Consonance-instances-main', '0c0c0c0a-0000-4000-8000-000000000a01'],
  A: ['C--Consonance-instances-sibling-3d57124e', '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f'],
  B: ['C--Consonance-instances-sibling-5bf9d657', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925'],
  C: ['C--Consonance-instances-sibling-0845a868', '0845a868-38f2-4cc2-b45a-431e0c088fb1'],
  E: ['C--Consonance-instances-sibling-07b8a48f', 'a2122153-a37e-41a6-a86f-534267ec0565'],
};
const heredocs = (cmd) => [...String(cmd).matchAll(/<<\s*'?(\w+)'?[^\n]*\n([\s\S]*?)\n\1\b/g)].map((m) => m[2]);

// every line of a file, cut on the newline BYTE before decoding (a chunk can end mid-character)
function eachLine(file, fn, chunk = 1 << 20) {
  const fd = fs.openSync(file, 'r'); const buf = Buffer.alloc(chunk); let carry = Buffer.alloc(0);
  try {
    for (;;) {
      const n = fs.readSync(fd, buf, 0, chunk, null); if (n === 0) break;
      let data = carry.length ? Buffer.concat([carry, buf.subarray(0, n)]) : buf.subarray(0, n); let start = 0, i;
      while ((i = data.indexOf(0x0a, start)) !== -1) { fn(data.toString('utf8', start, i)); start = i + 1; }
      carry = Buffer.from(data.subarray(start));
    }
    if (carry.length) fn(carry.toString('utf8'));
  } finally { fs.closeSync(fd); }
}

const out = {}, windowed = {};
for (const [seat, [dir, sid]] of Object.entries(SEATS)) {
  const f = path.join(P, dir, sid + '.jsonl');
  if (!fs.existsSync(f)) { out[seat] = { missing: f }; continue; }
  const msgs = new Map(); let here = '?';
  eachLine(f, (line) => {
    const mk = line.includes('"attachment"') && /Users\\\\(zackn|nname)\\\\\.claude/.exec(line);
    if (mk) { here = mk[1] === 'zackn' ? 'L' : 'D'; return; }
    if (!line.startsWith('{"') || !line.includes('"assistant"')) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.type !== 'assistant' || !o.message || !o.message.id || !Array.isArray(o.message.content)) return;
    let n = 0;
    for (const b of o.message.content) {
      if (b.type === 'text') n += b.text.length;
      else if (b.type === 'tool_use' && b.input) {
        if (b.name === 'Write') n += String(b.input.content || '').length;
        else if (b.name === 'Edit') n += String(b.input.new_string || '').length;
        else if (b.name === 'MultiEdit') n += (b.input.edits || []).reduce((a, e) => a + String(e.new_string || '').length, 0);
        else if (b.name === 'Bash') n += heredocs(b.input.command).join('').length;
      }
    }
    const m = msgs.get(o.message.id) || { ts: o.timestamp, n: 0, machine: here };
    m.n += n; msgs.set(o.message.id, m);
  });
  const days = {}; let inWin = { L: 0, D: 0, '?': 0 }, firstTs = null, lastTs = null;
  for (const m of msgs.values()) {
    if (m.n < 200) continue;
    const d = String(m.ts).slice(0, 10);
    const k = d + ' ' + m.machine;
    days[k] = (days[k] || 0) + 1;
    if (FROM !== null) { const t = Date.parse(m.ts); if (t >= FROM && t < TO) { inWin[m.machine]++; if (firstTs === null || t < firstTs) firstTs = t; if (lastTs === null || t > lastTs) lastTs = t; } }
  }
  out[seat] = days; windowed[seat] = inWin;
}
const allDays = [...new Set(Object.values(out).flatMap((d) => Object.keys(d).filter((k) => k !== 'missing').map((k) => k.slice(0, 10))))].sort();
console.log('day        ' + Object.keys(SEATS).map((s) => s.padStart(12)).join(''));
for (const day of allDays) console.log(day + ' ' + Object.keys(SEATS).map((s) => { const d = out[s] || {}; const L = d[day + ' L'] || 0, D = d[day + ' D'] || 0, Q = d[day + ' ?'] || 0; return `${L}L/${D}D${Q ? '/' + Q + '?' : ''}`.padStart(12); }).join(''));
const miss = Object.entries(out).filter(([, v]) => v.missing).map(([s, v]) => `${s}: ${v.missing}`);
console.log(miss.length ? 'MISSING seat transcripts: ' + miss.join('; ') : 'missing seat transcripts: none');
if (FROM !== null) {
  console.log(`\nWINDOW [${new Date(FROM).toISOString()}, ${new Date(TO).toISOString()}): eligible messages (>= 200 chars of claim text), by seat, machine marker L/D/?`);
  let tot = 0; for (const s of Object.keys(SEATS)) { const w = windowed[s] || { L: 0, D: 0, '?': 0 }; const sum = w.L + w.D + w['?']; tot += sum; console.log(`  ${s.padEnd(10)} ${sum}  (L ${w.L}, D ${w.D}, ? ${w['?']})`); }
  console.log(`  TOTAL ${tot}`);
}
