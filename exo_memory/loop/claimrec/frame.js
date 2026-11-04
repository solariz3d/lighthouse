'use strict';
// claimrec/frame.js - the L119 sampling frame, read in chunks (D277, seat A).
//
// The membership rule is `frame.js` of exo_memory/loop/claim_base_rate_registration_2026-09-27.md section 11 (sealed, sha256 759ae42b...),
// COPIED UNCHANGED:
//   one assistant message (message.id) in a seat's MAIN session transcript; its claim-bearing text is the text blocks, plus the written text of
//   Write / Edit / MultiEdit, plus Bash heredoc bodies; it is IN the frame when that text is at least 200 characters; its machine is the nearest
//   preceding hook-attachment row's command path (\Users\zackn\ = L, \Users\nname\ = D).
// ONE change, and only one: the sealed script reads each transcript as ONE string (`fs.readFileSync(f, 'utf8')`), which throws past V8's
// 536,870,888-byte string limit, and its `catch` then files the whole seat as missing and prints zeros, with no error. The chair's transcript was
// 549,537,160 bytes on 2026-10-09, so the sealed script reported the chair (13% of the L119 frame) as empty. This file reads in 1 MiB chunks, one
// line at a time. frame.test.js reproduces all 60 cells of the registration's section 11 table (6 seats x 10 days) with 0 differences.
//
// What this adds besides: the line number of every row of a message and of every real user prompt, which draw.js needs for the turn exclusions
// and for the verifier files. Those are bookkeeping; they do not change which messages are in the frame.
//
//   node frame.js                                       the sealed script's day table, all days
//   node frame.js --from <ISO> --to <ISO>               plus the eligible count per seat in [from, to)  (counts only, no content)
const fs = require('fs'), path = require('path'), os = require('os');

const SEATS = {
  librarian: ['C--Consonance-instances-librarian', '0c0c0c0b-0000-4000-8000-00000000115b'],
  chair: ['C--Consonance-instances-main', '0c0c0c0a-0000-4000-8000-000000000a01'],
  A: ['C--Consonance-instances-sibling-3d57124e', '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f'],
  B: ['C--Consonance-instances-sibling-5bf9d657', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925'],
  C: ['C--Consonance-instances-sibling-0845a868', '0845a868-38f2-4cc2-b45a-431e0c088fb1'],
  E: ['C--Consonance-instances-sibling-07b8a48f', 'a2122153-a37e-41a6-a86f-534267ec0565'],
};
const MIN_CHARS = 200;
const projectsDir = () => path.join(os.homedir(), '.claude', 'projects');
const seatFile = (seat, root = projectsDir()) => path.join(root, SEATS[seat][0], SEATS[seat][1] + '.jsonl');

const heredocs = (cmd) => [...String(cmd).matchAll(/<<\s*'?(\w+)'?[^\n]*\n([\s\S]*?)\n\1\b/g)].map((m) => m[2]);

// The sealed length rule for one assistant row's content blocks.
function claimChars(content) {
  let n = 0;
  for (const b of content) {
    if (b.type === 'text') n += b.text.length;
    else if (b.type === 'tool_use' && b.input) {
      if (b.name === 'Write') n += String(b.input.content || '').length;
      else if (b.name === 'Edit') n += String(b.input.new_string || '').length;
      else if (b.name === 'MultiEdit') n += (b.input.edits || []).reduce((a, e) => a + String(e.new_string || '').length, 0);
      else if (b.name === 'Bash') n += heredocs(b.input.command).join('').length;
    }
  }
  return n;
}

// Every line of a file, cut on the newline BYTE before decoding (a chunk can end inside a multi-byte character).
// fn(line, lineNumber1Based). Returns the number of lines. Nothing here holds the file in memory.
function eachLine(file, fn, chunk = 1 << 20) {
  const fd = fs.openSync(file, 'r'); const buf = Buffer.alloc(chunk); let carry = Buffer.alloc(0), no = 0;
  try {
    for (;;) {
      const got = fs.readSync(fd, buf, 0, chunk, null); if (got === 0) break;
      const data = carry.length ? Buffer.concat([carry, buf.subarray(0, got)]) : buf.subarray(0, got); let start = 0, i;
      while ((i = data.indexOf(0x0a, start)) !== -1) { no++; fn(data.toString('utf8', start, i), no); start = i + 1; }
      carry = Buffer.from(data.subarray(start));
    }
    if (carry.length) { no++; fn(carry.toString('utf8'), no); }
  } finally { fs.closeSync(fd); }
  return no;
}

// A "real" user prompt, for turn boundaries (D160: "a turn runs from a real prompt to the next one"). D160's own definition was in a script that is
// not on this machine; this is a reconstruction and is named as one: a user row, not sidechain, not meta, whose content is a non-empty string or
// carries a text block (a row that only returns tool results is not a prompt).
function isRealPrompt(o) {
  if (!o || o.type !== 'user' || o.isSidechain || o.isMeta || !o.message) return false;
  const c = o.message.content;
  if (typeof c === 'string') return c.trim().length > 0;
  return Array.isArray(c) && c.some((b) => b && b.type === 'text' && String(b.text || '').trim().length > 0);
}

// One seat's frame candidates. Returns { file, messages: Map(id -> {id, ts, n, machine, lines[], first}), prompts: [lineNumber...], missing }.
function readSeat(seat, opts = {}) {
  const file = opts.file || seatFile(seat, opts.root);
  if (!fs.existsSync(file)) return { seat, file, missing: true, messages: new Map(), prompts: [] };
  const messages = new Map(), prompts = []; let here = '?';
  eachLine(file, (line, no) => {
    const mk = line.includes('"attachment"') && /Users\\\\(zackn|nname)\\\\\.claude/.exec(line);
    if (mk) { here = mk[1] === 'zackn' ? 'L' : 'D'; return; }
    if (line.startsWith('{"') && line.slice(0, 400).includes('"type":"user"')) { let u; try { u = JSON.parse(line); } catch (_) { u = null; } if (u && isRealPrompt(u)) prompts.push(no); }
    if (!line.startsWith('{"') || !line.includes('"assistant"')) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.type !== 'assistant' || !o.message || !o.message.id || !Array.isArray(o.message.content)) return;
    const m = messages.get(o.message.id) || { id: o.message.id, ts: o.timestamp, n: 0, machine: here, lines: [] };
    m.n += claimChars(o.message.content); m.lines.push(no); messages.set(o.message.id, m);
  }, opts.chunk);
  return { seat, file, missing: false, messages, prompts };
}

// The sealed day table: { 'YYYY-MM-DD L'|'... D'|'... ?': count } per seat, over messages with >= 200 characters.
function dayCounts(seatResult) {
  const days = {};
  for (const m of seatResult.messages.values()) {
    if (m.n < MIN_CHARS) continue;
    const k = String(m.ts).slice(0, 10) + ' ' + m.machine;
    days[k] = (days[k] || 0) + 1;
  }
  return days;
}

// The frame: every message of >= 200 characters whose FIRST-row timestamp is in [fromMs, toMs).
function frameMembers(seatResult, fromMs, toMs) {
  const out = [];
  for (const m of seatResult.messages.values()) {
    if (m.n < MIN_CHARS) continue;
    const t = Date.parse(m.ts);
    if (t >= fromMs && t < toMs) out.push(m);
  }
  return out;
}

function tableText(results) {
  const seats = Object.keys(results);
  const allDays = [...new Set(seats.flatMap((s) => Object.keys(results[s].days).map((k) => k.slice(0, 10))))].sort();
  const lines = ['day        ' + seats.map((s) => s.padStart(12)).join('')];
  for (const day of allDays) lines.push(day + ' ' + seats.map((s) => { const d = results[s].days; const L = d[day + ' L'] || 0, D = d[day + ' D'] || 0, Q = d[day + ' ?'] || 0; return `${L}L/${D}D${Q ? '/' + Q + '?' : ''}`.padStart(12); }).join(''));
  return lines.join('\n');
}

module.exports = { SEATS, MIN_CHARS, seatFile, projectsDir, heredocs, claimChars, eachLine, isRealPrompt, readSeat, dayCounts, frameMembers, tableText };

if (require.main === module) {
  const argv = process.argv.slice(2); const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
  const from = opt('--from') ? Date.parse(opt('--from')) : null, to = opt('--to') ? Date.parse(opt('--to')) : null;
  const results = {}; const missing = [];
  for (const seat of Object.keys(SEATS)) { const r = readSeat(seat); if (r.missing) missing.push(`${seat}: ${r.file}`); results[seat] = { days: dayCounts(r), win: from !== null ? frameMembers(r, from, to) : null }; }
  console.log(tableText(results));
  console.log(missing.length ? 'MISSING seat transcripts: ' + missing.join('; ') : 'missing seat transcripts: none');
  if (from !== null) {
    console.log(`\nWINDOW [${new Date(from).toISOString()}, ${new Date(to).toISOString()}): eligible messages (>= ${MIN_CHARS} characters of claim text), by seat, machine marker`);
    let tot = 0;
    for (const s of Object.keys(SEATS)) { const w = results[s].win; const c = { L: 0, D: 0, '?': 0 }; for (const m of w) c[m.machine]++; tot += w.length; console.log(`  ${s.padEnd(10)} ${w.length}  (L ${c.L}, D ${c.D}, ? ${c['?']})`); }
    console.log(`  TOTAL ${tot}`);
  }
  if (missing.length) process.exit(1);
}
