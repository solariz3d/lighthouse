#!/usr/bin/env node
'use strict';
// read-before-edit.js — how much a pane reads before it first changes a file, per lap (D561, pane C). READ-ONLY.
// Plan: exo_memory/loop/plan_consonance_learns_from_the_reader_2026-10-30.md, Part 4 ("the token claim gets an instrument"): the claim
// that code maps cut the exploring a pane does before it builds is checked by counting that exploring, before and after the maps.
//
//   node consonance/tools/read-before-edit.js D540 D541 ...     one row per (lap, pane), then one per lap
//   node consonance/tools/read-before-edit.js D540-D550         a range (every lap id in it that the ledger dispatched to a pane)
//   --json             the rows as JSON
//   --data <dir>       the room's data dir (default: state-manifest.js dataDir, i.e. CONSONANCE_DATA or ~/.consonance.json data_dir)
//   --projects <dir>   Claude Code's transcript root (default ~/.claude/projects)
//
// WHERE THE TRANSCRIPTS ARE, from the room's own registries, never guessed: <data>/letters.json maps a pane's session id to its letter
// (main.rs `pane_letter`), <data>/panes.json maps the session id to its cwd (main.rs `read_kept`), and the transcript is
// <projects>/<encoded cwd>/<session id>.jsonl, the cwd encoded as main.rs `encode_cwd` does (every non-alphanumeric character becomes
// '-'; bin/jsonl_tap.rs proved the scheme). The Third Place's seat is never read (its conversation is private to it).
//
// WHAT A LAP IS, for one pane: <data>/lap.jsonl's dispatch rows (stage chain, chain dispatched, `to` naming the letter) say WHEN a lap was
// handed to the pane. The pane's window for that lap OPENS at the first packet in its own transcript that names the lap (a user text
// message containing the lap id, at or up to 30 minutes after a dispatch of that lap to it), and CLOSES at the next packet that opens a
// window for a different lap. So the wake's reading (the shell, the intake, a re-read after a compaction before the packet) is never
// counted: counting starts at the packet. That is the plan's falsifier for this instrument, answered by construction.
//
// WHAT IS COUNTED, in the window, up to the pane's first EDIT (an Edit, Write, MultiEdit or NotebookEdit tool call on a file outside
// scratch space, exo_memory/ and ~/.claude/; scratch scripts, hand-backs and maps are not the change):
//   reads       Read, Grep and Glob calls, plus Bash/PowerShell calls whose every segment is a reading verb (cat, head, tail, sed -n,
//               grep, rg, ls, find, wc, awk, git show/log/grep/diff/blame/ls-files/cat-file/status, Get-Content, Select-String,
//               Get-ChildItem, type, stat, du) and that write nothing;
//   bytes       the UTF-8 bytes of those calls' results as the pane received them (an image counts its encoded length);
//   delegated   Agent/Task calls (their own reading is in another transcript and is NOT counted here);
//   shellWrites shell calls before the first edit that look like they write (sed -i, a redirect to a file, tee, cp, mv, Set-Content,
//               Out-File): a pane that changes files by shell has a later "first edit" than it really had, and this column says so.
//   otherShell  shell calls before the first edit that are neither (a node script, a build, a fetch): some of them read files (a probe
//               script), and this instrument cannot see what they read, so they are shown, not counted as reads.
// Tool calls and results are de-duplicated by tool id, and only main-thread lines (isSidechain false) are read. A compaction summary
// (isCompactSummary) names many laps and is never a packet.
//
// UNMEASURED, NEVER 0: a pane whose transcript is missing; a lap whose packet never appears in the pane's transcript; a lap window with
// no edit in it (a read-only lap, or one whose changes were all made by shell). A lap's total is the sum over its MEASURED panes, and
// says how many of its panes that is.
//
// LOW I/O: each transcript is opened once, the start of the earliest window is found by a binary search on line timestamps (a few
// reads of 64 KB), and the file is streamed from there only until every asked lap is settled for that pane.

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const THIRD_PLACE_SID = '3d000000-0000-4000-8000-000000003d00';   // main.rs THIRD_PLACE_SID: never read
const PACKET_SLACK_MS = 30 * 60e3;
const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);
const READ_TOOLS = new Set(['Read', 'Grep', 'Glob']);
const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);
const DELEGATE_TOOLS = new Set(['Agent', 'Task']);
const READ_VERB = /^(?:cat|head|tail|sed\s+-n|grep|egrep|rg|ls|find|wc|awk|sort|uniq|cut|tr|diff|stat|du|file|type|echo|printf|git\s+(?:-C\s+\S+\s+)?(?:show|log|grep|diff|blame|ls-files|cat-file|status|rev-parse|branch|worktree\s+list|reflog)|get-content|select-string|get-childitem|gc|gci|sls|test-path|measure-object|select-object|format-table|out-string|where-object)\b/i;
const WRITE_HINT = /\bsed\s+(?:-[a-zA-Z]*i|--in-place)|\bperl\s+-[a-zA-Z]*i|(?:^|[^0-9>&\-])>{1,2}\s*(?!\s*(?:\/dev\/null|&|\$null|nul\b))[^\s|;&]|\btee\b|\bcp\b|\bmv\b|\brm\b|set-content|add-content|out-file|new-item|remove-item|copy-item|move-item|\bgit\s+(?:commit|add|apply|checkout|reset|merge|cherry-pick|stash|worktree\s+add)/i;
const SCRATCH = /[\\/](?:appdata[\\/]local[\\/]temp|tmp)[\\/]|[\\/]\.claude[\\/]|(?:^|[\\/])exo_memory[\\/]/i;

/** main.rs encode_cwd: every non-alphanumeric character becomes '-'. */
const encodeCwd = (cwd) => [...cwd].map((c) => (/[A-Za-z0-9]/.test(c) ? c : '-')).join('');

/** The command's own syntax, with what it only quotes taken out: a heredoc's body, and the inside of every quoted string (a grep pattern
 *  with `\|` in it, or `=>` in a `node -e` script, is not a pipe or a redirect). */
const bare = (cmd) => String(cmd)
  .replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\s*\2\s*(?=\n|$)/g, '<<HEREDOC')
  .replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, 'Q');
const segments = (cmd) => bare(cmd).split(/&&|\|\||;|\||\n/).map((s) => s.trim().replace(/^(?:do|then|else)\s+/, ''))
  .filter(Boolean).filter((s) => !/^(?:cd|set|export|done|fi|for|while|if|[A-Za-z_][A-Za-z0-9_]*=\S*)(?:\s|$)/.test(s));
const isShellWrite = (cmd) => typeof cmd === 'string' && WRITE_HINT.test(bare(cmd));
const isShellRead = (cmd) => {
  if (typeof cmd !== 'string' || !cmd.trim() || isShellWrite(cmd)) return false;
  const segs = segments(cmd);
  return segs.length > 0 && segs.every((s) => READ_VERB.test(s));
};
const isEdit = (name, input) => EDIT_TOOLS.has(name) && !SCRATCH.test(String((input && (input.file_path || input.notebook_path)) || ''));

const resultBytes = (c) => {
  if (typeof c === 'string') return Buffer.byteLength(c, 'utf8');
  if (!Array.isArray(c)) return 0;
  let n = 0;
  for (const b of c) {
    if (b && b.type === 'text') n += Buffer.byteLength(String(b.text || ''), 'utf8');
    else if (b && b.type === 'image' && b.source) n += String(b.source.data || '').length;
  }
  return n;
};
const textOf = (content) => (typeof content === 'string' ? content : Array.isArray(content) ? content.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n') : '');
const lapRe = (lap) => new RegExp(`(?<![A-Za-z0-9])${lap}(?![0-9])`);

/** The ledger's dispatch rows, as { lap, at, letter }. */
function dispatches(ledgerRows) {
  const out = [];
  for (const e of ledgerRows) {
    if (!e || e.stage !== 'chain' || e.chain !== 'dispatched' || !Array.isArray(e.to) || typeof e.at !== 'number') continue;
    for (const letter of e.to) out.push({ lap: e.lap, at: e.at, letter, note: e.note || null });
  }
  return out.sort((a, b) => a.at - b.at);
}

/** Lap ids from args: "D540", "D540-D550" (kept only if the ledger dispatched it to a pane). */
function expandLaps(args, dispatched) {
  const have = new Set(dispatched.map((d) => d.lap)), laps = [];
  for (const a of args) {
    const m = /^([A-Z]+)(\d+)-\1?(\d+)$/.exec(a);
    if (m) { for (let i = +m[2]; i <= +m[3]; i++) { const id = `${m[1]}${i}`; if (have.has(id)) laps.push(id); } } else laps.push(a);
  }
  return [...new Set(laps)];
}

/** First byte offset whose line timestamp is >= t (ms), by binary search on 64 KB probes. Lines without a timestamp are skipped over. */
function seekTo(fd, size, t) {
  // the first line starting after `off` that carries a top-level timestamp: its time, and the byte offset of the line's start
  const probe = (off) => {
    const buf = Buffer.alloc(Math.min(1 << 16, size - off)); fs.readSync(fd, buf, 0, buf.length, off);
    const nl = off === 0 ? -1 : buf.indexOf(0x0a); if (off !== 0 && nl < 0) return null;
    const re = /"timestamp":"(\d{4}-\d\d-\d\dT[\d:.]+Z)"/g, s = buf.subarray(nl + 1).toString('latin1');   // latin1: byte offsets stay exact
    const m = re.exec(s); if (!m) return null;
    return { ts: Date.parse(m[1]), at: off + nl + 1 + (s.lastIndexOf('\n', m.index) + 1) };
  };
  let lo = 0, hi = size, best = 0;
  for (let k = 0; k < 40 && hi - lo > (1 << 16); k++) {
    const mid = Math.floor((lo + hi) / 2), p = probe(mid);
    if (!p) { hi = mid; continue; }
    if (p.ts < t) { lo = mid; best = p.at; } else hi = mid;
  }
  return best;
}

/**
 * The per-pane walk. `lines` is an async iterable of parsed transcript records from the seek point on. `asked` is the laps to settle,
 * `disp` this pane's dispatch rows. Returns { [lap]: row }.
 */
async function walkPane(lines, asked, disp) {
  const rows = {}, seenTool = new Set(), seenResult = new Set(), pending = new Map();   // tool id -> the lap row it was a read for
  for (const lap of asked) rows[lap] = { lap, status: 'UNMEASURED', why: 'its packet never appears in the transcript', reads: 0, bytes: 0, delegated: 0, shellWrites: 0, otherShell: 0, firstEdit: null, packetAt: null };
  const lastDispatch = (lap) => Math.max(...disp.filter((d) => d.lap === lap).map((d) => d.at));
  let current = null;   // the lap whose window is open
  const closedAfter = new Set();   // laps whose window has closed for good (a later lap's packet, after the lap's last dispatch here)
  for await (const j of lines) {
    if (!j || j.isSidechain || j.isCompactSummary) continue;
    const ts = Date.parse(j.timestamp || '') || null, content = j.message && j.message.content;
    if (j.type === 'user' && ts) {
      const text = textOf(content);
      if (text && !(Array.isArray(content) && content.some((b) => b && b.type === 'tool_result')) && !/^\s*\[keep-warm visit/.test(text)) {
        // a packet: does it open a window? Of the dispatches to this pane within the slack whose lap it names, a new hand (not a
        // "re-hand", which re-sends a lap in the same ring batch) before a re-hand, then the one nearest the packet in time. A packet
        // names old laps too ("D558 accepted … Next, ledger D561"), and its own dispatch row lands within seconds of it.
        const rehand = (d) => (/^re-hand/.test(d.note || '') ? 1 : 0);
        const cand = disp.filter((d) => d.at <= ts + 60e3 && ts - d.at <= PACKET_SLACK_MS && lapRe(d.lap).test(text))
          .sort((a, b) => rehand(a) - rehand(b) || Math.abs(ts - a.at) - Math.abs(ts - b.at))[0];
        if (cand && cand.lap !== current) {
          if (current && rows[current] && ts > lastDispatch(current)) closedAfter.add(current);
          current = cand.lap;
          if (rows[current] && !rows[current].packetAt) { rows[current].packetAt = new Date(ts).toISOString(); rows[current].why = 'no edit in its window'; }
        }
      }
    }
    // results arrive on user lines; count the bytes of those that answer a counted read
    if (j.type === 'user' && Array.isArray(content)) {
      for (const b of content) {
        if (!b || b.type !== 'tool_result' || seenResult.has(b.tool_use_id)) continue;
        seenResult.add(b.tool_use_id);
        const row = pending.get(b.tool_use_id); if (row) { row.bytes += resultBytes(b.content); pending.delete(b.tool_use_id); }
      }
    }
    if (j.type === 'assistant' && Array.isArray(content) && current && rows[current] && !rows[current].firstEdit) {
      const row = rows[current];
      for (const b of content) {
        if (!b || b.type !== 'tool_use' || seenTool.has(b.id)) continue;
        seenTool.add(b.id);
        const name = b.name, input = b.input || {};
        if (isEdit(name, input)) { row.firstEdit = { tool: name, at: j.timestamp }; row.status = 'MEASURED'; row.why = null; break; }
        if (READ_TOOLS.has(name) || (SHELL_TOOLS.has(name) && isShellRead(input.command))) { row.reads++; pending.set(b.id, row); }
        else if (DELEGATE_TOOLS.has(name)) row.delegated++;
        else if (SHELL_TOOLS.has(name) && isShellWrite(input.command)) row.shellWrites++;
        else if (SHELL_TOOLS.has(name)) row.otherShell++;
      }
    }
    if (asked.every((l) => rows[l].firstEdit || closedAfter.has(l))) break;
  }
  // a window with no edit says what the pane did by shell instead, so a lap whose change was all shell-made is told from a read-only one
  for (const r of Object.values(rows)) if (r.packetAt && !r.firstEdit) r.why = `no edit in its window (${r.shellWrites} shell writes, ${r.otherShell} other shell calls)`;
  return rows;
}

/** Parsed records of a JSONL file from byte `start` on (one pass, one open). */
async function* records(file, start) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, { start, highWaterMark: 1 << 20 }), crlfDelay: Infinity });
  try { for await (const line of rl) { if (!line) continue; try { yield JSON.parse(line); } catch (_) { /* a torn line at the seek point or the tail */ } } } finally { rl.close(); }
}

/** The whole measurement. `seats` is [{ letter, file }] (file null = missing). */
async function measure({ laps, ledgerRows, seats }) {
  const disp = dispatches(ledgerRows), out = [];
  for (const seat of seats) {
    const mine = disp.filter((d) => d.letter === seat.letter);
    const asked = laps.filter((l) => mine.some((d) => d.lap === l));
    if (!asked.length) continue;
    if (!seat.file || !fs.existsSync(seat.file)) {
      for (const lap of asked) out.push({ lap, pane: seat.letter, status: 'UNMEASURED', why: 'its transcript is missing', reads: 0, bytes: 0, delegated: 0, shellWrites: 0, otherShell: 0, firstEdit: null, packetAt: null });
      continue;
    }
    const from = Math.min(...mine.filter((d) => asked.includes(d.lap)).map((d) => d.at)) - 60e3;
    const fd = fs.openSync(seat.file, 'r'); let start;
    // 8 MB earlier than the probe's answer: a "timestamp" quoted inside a tool result can mislead one probe, and an early start costs
    // only a little reading (the window still opens at the packet), where a late one would miss the packet
    try { start = Math.max(0, seekTo(fd, fs.fstatSync(fd).size, from) - (8 << 20)); } finally { fs.closeSync(fd); }
    const rows = await walkPane(records(seat.file, start), asked, mine);
    for (const lap of asked) out.push({ ...rows[lap], pane: seat.letter });
  }
  return out.sort((a, b) => a.lap.localeCompare(b.lap, 'en', { numeric: true }) || a.pane.localeCompare(b.pane));
}

/** The seats from the room's registries: letter, transcript path (or null), the Third Place left out. */
function seatsFrom(dataDir, projects) {
  const letters = JSON.parse(fs.readFileSync(path.join(dataDir, 'letters.json'), 'utf8'));
  let kept = [];
  try { kept = JSON.parse(fs.readFileSync(path.join(dataDir, 'panes.json'), 'utf8')); } catch (_) { /* no kept panes: every seat reads as missing */ }
  const cwdOf = new Map(kept.map((k) => [k.pane, k.cwd]));
  return Object.entries(letters).filter(([sid]) => sid !== THIRD_PLACE_SID).map(([sid, letter]) => {
    const cwd = cwdOf.get(sid);
    return { letter, sid, file: cwd ? path.join(projects, encodeCwd(cwd), `${sid}.jsonl`) : null };
  });
}

function table(rows) {
  const L = ['lap   pane  status      reads   bytes read   delegated  shell-writes  other-shell  first edit (or why not)'];
  for (const r of rows) {
    const st = r.status === 'MEASURED';
    L.push(`${r.lap.padEnd(6)}${r.pane.padEnd(6)}${r.status.padEnd(12)}${(st ? String(r.reads) : '-').padStart(5)}${(st ? r.bytes.toLocaleString('en') : '-').padStart(13)}${(st ? String(r.delegated) : '-').padStart(12)}${(st ? String(r.shellWrites) : '-').padStart(14)}${(st ? String(r.otherShell) : '-').padStart(13)}  ${st ? `${r.firstEdit.tool} ${r.firstEdit.at}` : r.why}`);
  }
  L.push('', 'per lap (sum over MEASURED panes only):');
  for (const lap of [...new Set(rows.map((r) => r.lap))]) {
    const rs = rows.filter((r) => r.lap === lap), m = rs.filter((r) => r.status === 'MEASURED');
    L.push(`${lap.padEnd(6)}${m.length ? `reads ${m.reduce((a, r) => a + r.reads, 0)}, bytes ${m.reduce((a, r) => a + r.bytes, 0).toLocaleString('en')}` : 'UNMEASURED'}  (${m.length} of ${rs.length} panes measured)`);
  }
  return L.join('\n');
}

async function main(argv) {
  const flag = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv.splice(i, 2)[1] : null; };
  const json = argv.includes('--json'); if (json) argv.splice(argv.indexOf('--json'), 1);
  const dataDir = flag('--data') || require('./state-manifest.js').dataDir();
  const projects = flag('--projects') || path.join(os.homedir(), '.claude', 'projects');
  if (!dataDir) throw new Error('no data dir: give --data, or set CONSONANCE_DATA');
  if (!argv.length) throw new Error('give lap ids, e.g. D540 D541 or D540-D550');
  const ledgerRows = fs.readFileSync(path.join(dataDir, 'lap.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (_) { return null; } });
  const laps = expandLaps(argv, dispatches(ledgerRows));
  const rows = await measure({ laps, ledgerRows, seats: seatsFrom(dataDir, projects) });
  console.log(json ? JSON.stringify(rows, null, 1) : table(rows));
}

module.exports = { encodeCwd, isShellRead, isShellWrite, isEdit, resultBytes, dispatches, expandLaps, seekTo, walkPane, records, measure, seatsFrom, table, THIRD_PLACE_SID };

if (require.main === module) main(process.argv.slice(2)).catch((e) => { console.error(`read-before-edit: ${e.message}`); process.exit(1); });
