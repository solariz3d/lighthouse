'use strict';
// D160 (pane A): the check-precedes-claim instrument, run as registered at 1b95dc9
// (loop/check_precedes_claim_registration_2026-09-26.md). READ-ONLY on transcripts and on the census.
//
//   node d160.js extract <seat> <outDir> "<fromISO>|<toISO>|<name>" ...
//       The BLIND text-only extract of §3: every assistant `text` block plus the text a seat WRITES through a tool
//       (Write.content, Edit.new_string, MultiEdit.edits[].new_string, Bash heredoc bodies, echo/printf redirected with
//       > or >>). Every other tool call and every tool result is STRIPPED, so whether a check preceded is invisible.
//       Each block is labelled <transcript file>:<line> [timestamp] so a located claim can be cited.
//   node d160.js turns <transcript> <line>
//       Print the turn (by §2's boundary rule) containing <line>: its first and last line. No content.
//   node d160.js run <rows.json> <out.json>
//       Apply §1 (claims) and §2 (checks, same turn and LOOK-BACK 3) to each row's located claim row.
const fs = require('fs'), path = require('path'), os = require('os');
const PROJ = path.join(os.homedir(), '.claude', 'projects');
const SEATDIRS = {
  librarian: 'C--Consonance-instances-librarian', chair: 'C--Consonance-instances-main',
  A: 'C--Consonance-instances-sibling-3d57124e', B: 'C--Consonance-instances-sibling-5bf9d657',
};

function readRows(file) {
  const out = [];
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    let o; try { o = JSON.parse(lines[i]); } catch (_) { continue; }
    out.push({ line: i + 1, o });
  }
  return out;
}

// §1: the text a seat writes through a tool.
function writtenText(tu) {
  const inp = tu.input || {}, parts = [];
  if (tu.name === 'Write' && typeof inp.content === 'string') parts.push(inp.content);
  if (tu.name === 'Edit' && typeof inp.new_string === 'string') parts.push(inp.new_string);
  if (tu.name === 'MultiEdit' && Array.isArray(inp.edits)) for (const e of inp.edits) if (typeof e.new_string === 'string') parts.push(e.new_string);
  if (tu.name === 'Bash' && typeof inp.command === 'string') parts.push(...bashWritten(inp.command).map((x) => x.text));
  return parts;
}
// heredoc bodies (<<'X' … X or <<X … X or <<"X" … X), and echo/printf strings redirected with > or >>; with char offsets
function bashWritten(cmd) {
  const out = [];
  const re = /<<-?\s*(['"]?)([A-Za-z_][\w]*)\1[^\n]*\n([\s\S]*?)\n\2(?=\s|$)/g;
  let m;
  while ((m = re.exec(cmd))) out.push({ text: m[3], at: m.index + m[0].indexOf(m[3]) });
  const re2 = /\b(?:echo|printf)\s([^\n;&|>]{1,4000}?)>>?\s*[^\s;&|]+/g; // no nested quantifiers: the D160 hang was catastrophic backtracking in the old pattern
  while ((m = re2.exec(cmd))) out.push({ text: m[1], at: m.index });
  return out;
}

function isRealPrompt(o) {
  if (o.type !== 'user' || !o.message) return false;
  const c = o.message.content;
  if (typeof c === 'string') return true;
  if (Array.isArray(c)) return c.some((b) => b.type === 'text') && !c.some((b) => b.type === 'tool_result');
  return false;
}

// One streaming pass per file over every window at once: a cheap substring test on "assistant" and the timestamp comes
// before any JSON.parse. A row carried into two sessions (same uuid) is kept ONCE, at its earliest occurrence (§2).
async function extract(seat, outDir, windows) {
  const readline = require('readline');
  const dir = path.join(PROJ, SEATDIRS[seat]);
  const W = windows.map(([from, to, name]) => ({ lo: Date.parse(from), hi: Date.parse(to), name, chunks: [] }));
  const minLo = Math.min(...W.map((w) => w.lo));
  const seen = new Map();
  for (const f of fs.readdirSync(dir).filter((x) => /\.jsonl(\.orphaned)?$/.test(x))) {
    const full = path.join(dir, f);
    if (fs.statSync(full).mtimeMs < minLo) continue; // last written before every window: no row in any
    const rl = readline.createInterface({ input: fs.createReadStream(full, 'utf8'), crlfDelay: Infinity });
    let line = 0;
    for await (const raw of rl) {
      line++;
      if (!raw.includes('"type":"assistant"')) continue;
      const t = /"timestamp":"([^"]+)"/.exec(raw);
      if (!t) continue;
      const ts = Date.parse(t[1]);
      const hits = W.filter((w) => ts >= w.lo && ts < w.hi);
      if (!hits.length) continue;
      let o; try { o = JSON.parse(raw); } catch (_) { continue; }
      if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content)) continue;
      const blocks = [];
      for (const c of o.message.content) {
        if (c.type === 'text' && c.text.trim()) blocks.push({ kind: 'TEXT', body: c.text });
        else if (c.type === 'tool_use') for (const w of writtenText(c)) if (w.trim()) blocks.push({ kind: `WRITTEN via ${c.name}`, body: w });
      }
      if (!blocks.length) continue;
      const prev = seen.get(o.uuid);
      if (prev && prev.ts <= t[1]) continue;
      seen.set(o.uuid, { ts: t[1] });
      for (const w of hits) for (const b of blocks) w.chunks.push({ uuid: o.uuid, ts: t[1], head: `${f}:${line} [${t[1]}] ${b.kind}`, body: b.body });
    }
  }
  for (const w of W) {
    const keep = w.chunks.filter((c) => seen.get(c.uuid).ts === c.ts).sort((a, b) => a.ts.localeCompare(b.ts));
    const out = path.join(outDir, `${seat}-${w.name}.txt`);
    fs.writeFileSync(out, keep.map((c) => `=== ${c.head}\n${c.body}\n`).join('\n'));
    console.log(`${seat} ${w.name}: ${keep.length} blocks → ${out}`);
  }
}

// §2 turn boundaries: a turn runs from a real user prompt up to the next one, in file order.
function turnOf(rows, line) {
  let start = 0;
  for (let i = 0; i < rows.length; i++) { if (rows[i].line > line) break; if (isRealPrompt(rows[i].o)) start = i; }
  let end = rows.length - 1;
  for (let i = start + 1; i < rows.length; i++) if (isRealPrompt(rows[i].o)) { end = i - 1; break; }
  return { start, end };
}

module.exports = { readRows, writtenText, bashWritten, isRealPrompt, turnOf, SEATDIRS, PROJ };

if (require.main === module) {
  const [cmd, ...a] = process.argv.slice(2);
  if (cmd === 'extract') extract(a[0], a[1], a.slice(2).map((x) => x.split('|')));
  else if (cmd === 'turns') { const rows = readRows(a[0]); const t = turnOf(rows, +a[1]); console.log(`turn: lines ${rows[t.start].line}..${rows[t.end].line}`); }
  else if (cmd === 'index') { /* handled at the end of the file */ }
  else if (cmd === 'run') require('./d160-run.js').run(a[0], a[1]);
  else { console.error('usage: extract | turns | run'); process.exit(2); }
}

// D160 re-run (the chair, 12:07): the all-windows extract died silently. `index` streams the given transcript files ONE
// at a time and APPENDS each kept block to a per-UTC-day file, so nothing accumulates in memory; it prints a progress
// line per file and can be run in batches. A uuid already written (a carried row) is skipped: first occurrence kept.
//   node d160.js index <seat> <outDir> <fromIndex> <toIndex>   (files sorted by name; the uuid ledger persists in outDir)
async function index(seat, outDir, from, to) {
  const readline = require('readline');
  const dir = path.join(PROJ, SEATDIRS[seat]);
  const files = fs.readdirSync(dir).filter((x) => /\.jsonl(\.orphaned)?$/.test(x)).sort().slice(+from, +to);
  const ledgerFile = path.join(outDir, `${seat}.uuids`);
  const seen = new Set(fs.existsSync(ledgerFile) ? fs.readFileSync(ledgerFile, 'utf8').split('\n').filter(Boolean) : []);
  const ledger = fs.openSync(ledgerFile, 'a');
  const days = new Map();
  const dayFd = (d) => { if (!days.has(d)) days.set(d, fs.openSync(path.join(outDir, `${seat}-${d}.txt`), 'a')); return days.get(d); };
  let fi = +from;
  for (const f of files) {
    const t0 = Date.now(); let kept = 0, n = 0;
    for await (const raw of readline.createInterface({ input: fs.createReadStream(path.join(dir, f), 'utf8'), crlfDelay: Infinity })) {
      n++;
      if (!raw.includes('"type":"assistant"')) continue;
      let o; try { o = JSON.parse(raw); } catch (_) { continue; }
      if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content) || !o.timestamp) continue;
      if (o.uuid && seen.has(o.uuid)) continue;
      const blocks = [];
      for (const c of o.message.content) {
        if (c.type === 'text' && c.text.trim()) blocks.push(['TEXT', c.text]);
        else if (c.type === 'tool_use') for (const w of writtenText(c)) if (w.trim()) blocks.push([`WRITTEN via ${c.name}`, w]);
      }
      if (!blocks.length) continue;
      if (o.uuid) { seen.add(o.uuid); fs.writeSync(ledger, o.uuid + '\n'); }
      const fd = dayFd(o.timestamp.slice(0, 10));
      for (const [kind, body] of blocks) fs.writeSync(fd, `=== ${f}:${n} [${o.timestamp}] ${kind}\n${body}\n\n`);
      kept++;
    }
    console.log(`[${fi++}] ${f} lines ${n} kept ${kept} ${Date.now() - t0}ms`);
  }
  for (const fd of days.values()) fs.closeSync(fd);
  fs.closeSync(ledger);
}
if (require.main === module && process.argv[2] === 'index') index(...process.argv.slice(3));
