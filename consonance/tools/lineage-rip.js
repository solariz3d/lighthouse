#!/usr/bin/env node
'use strict';
// lineage-rip.js — the keeper's own words, kept verbatim across every seat that talks with him (D475 part 1, pane E). The Third Place's ripall.js
// (2026-10-26, its scratchpad), made an instrument. Plan: exo_memory/loop/plan_d475_carrying_both_ways_2026-10-26.md; the reason is the Third Place's
// note exo_memory/third_place/to_the_librarian_2026-10-26.md ("Run the rip regularly ... Only the code may enter a repo; the output never does").
//
//   node consonance/tools/lineage-rip.js             append what is new to the store, then say how much (counts only, never a message)
//   node consonance/tools/lineage-rip.js --dry-run   the same counts, and nothing is written
//   --out <dir>        the store (default: <the parent of instances_dir in ~/.consonance.json>\private\third_place\lineage)
//   --root <dir>       a folder of Claude project folders to read; repeat it (default: ~/.claude/projects, and ~/.claude/consonance-attic as --attic)
//   --attic <dir>      the same, its seats marked " (attic)"
//   --seat <name>      a seat to read; repeat it (default: every seat the store already names, and main, librarian, third-place)
//   --min <chars>      the shortest message kept (default 200, the store's own: its shortest row is 200)
//   --json             the counts as JSON
//
// WHAT IT READS, read-only: every *.jsonl under <root>/<project folder>/ whose seat is one of the seats. A seat is the project folder's name
// without "C--Consonance-instances-" or "C--Users-<user>-"; under ~/.claude/consonance-attic it is "<seat> (attic)", as ripall.js named it.
// Sibling panes are NOT seats by default: what reaches them is the chair's packets, not his words.
// WHAT IT KEEPS, as ripall.js did: a user turn that is not meta, not a sidechain and not a tool result, its text with system reminders cut,
// at least --min characters, and not machine-made. ripall.js's SKIP list stands; D475 adds the heads the room's own delivery puts on a turn
// ([pane:X], [librarian:LIB], [chair:MAIN], [committee], [duration wakeup: ...]). On 2026-10-26 those were 837 of the store's 2,502 rows;
// those rows stay where they are (the store is append-only; which of them to strike is not this tool's call).
// WHERE IT WRITES, and nothing else: <out>/keeper_<YYYY-MM>.md and <out>/INDEX.md, by APPENDING. A month file is a header line, a blank line,
// then blocks "### <ts> · <seat> · <n> chars\n\n<text>\n" joined by "\n" (ripall.js's format). It is parsed EXACTLY, by each header's char
// count, and a file that does not parse to its last byte is refused by name: dedup against a store it cannot read would be a guess. A message
// whose sha1 the store already holds is not added again, so a re-run on unchanged transcripts writes 0 bytes. New rows go at the END of their
// month file (sorted among themselves by time) and their index lines under one "## added <when> (n)" heading at the end of INDEX.md.
// REFUSED, before anything is read: an --out inside a git work tree (a .git folder or file in it or any parent). The output never enters a repo.
// One run at a time: <out>/.rip.lock (taken over after an hour). It runs at BelowNormal priority (os.setPriority).
// A line that is empty is skipped and counted; a user line that does not parse is skipped and counted; neither is fatal.
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const MIN_DEFAULT = 200;
const BASE_SEATS = ['main', 'librarian', 'third-place'];
const SKIP = /^(<|\[keep-warm|\[pulse|Caveat:|You are |# |\[from the chair|PACKET|BRIEF)/;   // ripall.js's, as it was
const MACHINE = /^\[(pane:[A-Za-z0-9]+\]|librarian:LIB\]|chair:MAIN\]|committee\]|duration wakeup:)/;   // D475: the room's own delivery heads
const HDR = /^### (\S*) · (.+) · (\d+) chars$/;
const LOCK_STALE_MS = 60 * 60 * 1000;

class RipError extends Error { constructor(code, msg) { super(msg); this.name = 'RipError'; this.code = code; } }

/** The git work tree that holds p (a .git folder or file in p or a parent), or null. p need not exist yet. */
function gitTreeOf(p) {
  let d = path.resolve(p);
  for (;;) {
    if (fs.existsSync(path.join(d, '.git'))) return d;
    const up = path.dirname(d); if (up === d) return null; d = up;
  }
}

/** The seat a project folder is, as ripall.js named it. */
function seatOfDir(name, attic) {
  return name.replace(/^C--Consonance-instances-/, '').replace(/^[A-Za-z]--Users-[^-]+-/, '') + (attic ? ' (attic)' : '');
}

/** One month file parsed exactly: { rows: [{ ts, seat, t }] }, or a RipError naming where it stopped. */
function parseMonth(file, s) {
  const head = s.indexOf('\n\n'); if (head < 0) throw new RipError('LINEAGE_UNPARSED', `${file}: no header line`);
  const rows = []; let i = head + 2;
  while (i < s.length) {
    const e = s.indexOf('\n', i), m = e < 0 ? null : HDR.exec(s.slice(i, e));
    if (!m || s.slice(e, e + 2) !== '\n\n') throw new RipError('LINEAGE_UNPARSED', `${file}: no row header at char ${i}`);
    const len = +m[3], t = s.substr(e + 2, len), k = e + 2 + len;
    if (t.length !== len || s[k] !== '\n') throw new RipError('LINEAGE_UNPARSED', `${file}: the row at char ${i} is not ${len} chars`);
    rows.push({ ts: m[1], seat: m[2], t });
    if (k + 1 === s.length) break;
    if (s[k + 1] !== '\n') throw new RipError('LINEAGE_UNPARSED', `${file}: no blank line after the row at char ${i}`);
    i = k + 2;
  }
  return { rows };
}

/** The store as it is: the sha1 of every row, the seats it names, and which month files exist. */
function readStore(out) {
  const seen = new Set(), seats = new Set(), months = new Set();
  if (!fs.existsSync(out)) return { seen, seats, months };
  for (const f of fs.readdirSync(out)) {
    const mm = /^keeper_(.+)\.md$/.exec(f); if (!mm) continue;
    months.add(mm[1]);
    for (const r of parseMonth(f, fs.readFileSync(path.join(out, f), 'utf8')).rows) { seen.add(sha1(r.t)); seats.add(r.seat.replace(/ \(attic\)$/, '')); }
  }
  return { seen, seats, months };
}
const sha1 = (t) => crypto.createHash('sha1').update(t).digest('hex');

/** Every *.jsonl under dir, recursively. */
function jsonlUnder(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...jsonlUnder(p)); else if (e.isFile() && e.name.endsWith('.jsonl')) out.push(p);
  }
  return out.sort();
}

/** A user turn's kept text, or null (ripall.js's rule, plus MACHINE). */
function keptText(o, min) {
  if (!o || o.type !== 'user' || o.isMeta || o.isSidechain) return null;
  const c = o.message && o.message.content; let t = '';
  if (typeof c === 'string') t = c;
  else if (Array.isArray(c)) { if (c.some((x) => x && x.type === 'tool_result')) return null; t = c.filter((x) => x && x.type === 'text').map((x) => x.text).join('\n'); }
  else return null;
  t = t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim();
  if (t.length < min || SKIP.test(t) || MACHINE.test(t) || t.includes('This session is being continued')) return null;
  return t;
}

const block = (x) => `### ${x.ts} · ${x.seat} · ${x.t.length} chars\n\n${x.t}\n`;
const indexLine = (x) => `- ${x.ts.slice(0, 16)} · ${x.seat} · ${x.t.length} · ${x.t.slice(0, 110).replace(/\s+/g, ' ')}`;

/**
 * The rip. opts: { out, roots: [{ dir, attic }], seats (optional), min, dryRun, now (Date, for the INDEX heading) }.
 * Returns the counts: { out, files, lines, empty, malformed, kept, duplicate, added, months: { m: n }, bytes, dryRun }.
 */
async function rip(opts) {
  const out = path.resolve(opts.out), min = opts.min == null ? MIN_DEFAULT : opts.min;
  if (!Number.isFinite(min) || min < 0) throw new RipError('LINEAGE_ARGS', `--min must be a number of chars, got ${opts.min}`);
  const tree = gitTreeOf(out);
  if (tree) throw new RipError('LINEAGE_IN_REPO', `refused: the output ${out} is inside the git work tree ${tree}; the lineage never enters a repo`);
  for (const r of opts.roots) if (path.resolve(out).toLowerCase().startsWith(path.resolve(r.dir).toLowerCase() + path.sep)) throw new RipError('LINEAGE_ARGS', `refused: the output ${out} is inside the transcripts it reads (${r.dir})`);
  const store = readStore(out);
  const seats = new Set(opts.seats && opts.seats.length ? opts.seats : [...BASE_SEATS, ...store.seats]);
  const counts = { out, files: 0, lines: 0, empty: 0, malformed: 0, kept: 0, duplicate: 0, added: 0, months: {}, bytes: 0, dryRun: !!opts.dryRun };
  const fresh = new Map();
  for (const root of opts.roots) {
    if (!fs.existsSync(root.dir)) continue;
    for (const e of fs.readdirSync(root.dir, { withFileTypes: true })) {
      if (!e.isDirectory() || !seats.has(seatOfDir(e.name, false))) continue;
      const seat = seatOfDir(e.name, root.attic);
      for (const src of jsonlUnder(path.join(root.dir, e.name))) {
        counts.files++;
        const rl = readline.createInterface({ input: fs.createReadStream(src, { flags: 'r' }), crlfDelay: Infinity });
        for await (const l of rl) {
          counts.lines++;
          if (!l.trim()) { counts.empty++; continue; }
          if (!l.includes('"type":"user"')) continue;
          let o; try { o = JSON.parse(l); } catch { counts.malformed++; continue; }
          const t = keptText(o, min); if (t == null) continue;
          counts.kept++;
          const h = sha1(t);
          if (store.seen.has(h) || fresh.has(h)) { counts.duplicate++; continue; }
          fresh.set(h, { ts: typeof o.timestamp === 'string' ? o.timestamp : '', seat, t });
        }
      }
    }
  }
  const rows = [...fresh.values()].sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
  counts.added = rows.length;
  const byMonth = new Map();
  for (const x of rows) { const m = x.ts.slice(0, 7) || 'undated'; if (!byMonth.has(m)) byMonth.set(m, []); byMonth.get(m).push(x); }
  for (const [m, xs] of byMonth) counts.months[m] = xs.length;
  if (!rows.length || opts.dryRun) return counts;
  fs.mkdirSync(out, { recursive: true });
  const lock = path.join(out, '.rip.lock');
  try { fs.writeFileSync(lock, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' }); }
  catch (e) {
    if (e.code !== 'EEXIST') throw e;
    if (Date.now() - fs.statSync(lock).mtimeMs < LOCK_STALE_MS) throw new RipError('LINEAGE_LOCKED', `refused: another rip holds ${lock}`);
    fs.writeFileSync(lock, `${process.pid} ${new Date().toISOString()} (took over a stale lock)\n`);
  }
  try {
    for (const [m, xs] of byMonth) {
      const f = path.join(out, `keeper_${m}.md`), text = fs.existsSync(f) ? '\n' + xs.map(block).join('\n') : `# The keeper's words, ${m}, verbatim\n\n` + xs.map(block).join('\n');
      fs.appendFileSync(f, text); counts.bytes += Buffer.byteLength(text);
    }
    const idx = path.join(out, 'INDEX.md'), when = (opts.now || new Date()).toISOString();
    const head = fs.existsSync(idx) ? '' : "# Index: the keeper's own words across every seat on this machine\n\nVerbatim from the master transcripts, deduplicated. One file per month. Each line: timestamp, seat, length, first words.\n";
    const text = head + `\n## added ${when} (${rows.length})\n\n` + rows.map(indexLine).join('\n') + '\n';
    fs.appendFileSync(idx, text); counts.bytes += Buffer.byteLength(text);
  } finally { fs.rmSync(lock, { force: true }); }
  return counts;
}

/** The default store: <parent of instances_dir>\private\third_place\lineage, from ~/.consonance.json; none set is refused by name. */
function defaultOut() {
  let id = null;
  try { id = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8')).instances_dir; } catch (e) { if (e.code !== 'ENOENT' && !(e instanceof SyntaxError)) throw e; }
  if (typeof id !== 'string' || !id.trim()) throw new RipError('LINEAGE_ARGS', 'no --out given and no instances_dir in ~/.consonance.json to place the store beside');
  return path.join(path.dirname(path.resolve(id.trim())), 'private', 'third_place', 'lineage');
}

function parseArgs(argv) {
  const a = { roots: [], seats: [], dryRun: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = () => { if (i + 1 >= argv.length) throw new RipError('LINEAGE_ARGS', `${k} needs a value`); return argv[++i]; };
    if (k === '--out') a.out = v(); else if (k === '--root') a.roots.push({ dir: v(), attic: false }); else if (k === '--attic') a.roots.push({ dir: v(), attic: true });
    else if (k === '--seat') a.seats.push(v()); else if (k === '--min') a.min = Number(v()); else if (k === '--dry-run') a.dryRun = true; else if (k === '--json') a.json = true;
    else throw new RipError('LINEAGE_ARGS', `unknown argument ${k}`);
  }
  if (!a.roots.length) a.roots = [{ dir: path.join(os.homedir(), '.claude', 'projects'), attic: false }, { dir: path.join(os.homedir(), '.claude', 'consonance-attic'), attic: true }];
  return a;
}

async function main(argv) {
  try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { process.stderr.write(`lineage-rip: could not lower its priority (${e.message}); running anyway\n`); }
  const a = parseArgs(argv);
  const c = await rip({ ...a, out: a.out || defaultOut() });
  if (a.json) { process.stdout.write(JSON.stringify(c) + '\n'); return; }
  const ms = Object.entries(c.months).map(([m, n]) => `${m}:${n}`).join(' ') || 'none';
  process.stdout.write(`lineage-rip${c.dryRun ? ' (dry run, nothing written)' : ''}: ${c.files} transcripts, ${c.lines} lines (${c.empty} empty, ${c.malformed} malformed, skipped); `
    + `${c.kept} kept, ${c.duplicate} already in the store, ${c.added} new (${ms}); ${c.bytes} bytes appended to ${c.out}\n`);
}

if (require.main === module) main(process.argv.slice(2)).catch((e) => { process.stderr.write(`lineage-rip: ${e.code ? e.code + ': ' : ''}${e.message}\n`); process.exit(e.name === 'RipError' ? 2 : 1); });
module.exports = { rip, parseMonth, readStore, keptText, seatOfDir, gitTreeOf, defaultOut, parseArgs, RipError, SKIP, MACHINE };
