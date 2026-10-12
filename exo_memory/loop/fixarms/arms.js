'use strict';
// fixarms/arms.js (D311 part 3, pane E): the three fix arms of the mistake bench as PURE TEXT BUILDERS. Plan:
// exo_memory/loop/plan_mistake_bench_d311_2026-10-12.md, part 3. Nothing here is wired into a hook, gates anything or writes
// anything: each arm takes a unit's erring turn and returns the text a replay adds to the context.
//
//   const arms = require('<repo>/exo_memory/loop/fixarms/arms.js');
//   arms.build('F1'|'F2'|'F3', unit, opts) -> { arm, unit, asOf, text, ...detail }
//   unit = { id, seat, transcript (relative to the projects dir), turnStart (ISO with a zone), claimTs? }
//          (the shape origin-read.js loadUnits() returns)
//   opts = { repo (default: the checkout holding this file), projects (default PROJECTS or ~/.claude/projects),
//            dataDir (F1; default CONSONANCE_DATA, else ~/.consonance.json data_dir), tz (default the machine's zone),
//            k (F3; default 5), query (F3; default the turn's prompt) }
//
// THE TIME RULE. Every fact is as of the turn's start: the timestamp of the real prompt that opened the erring turn (the latest
// real prompt at or before unit.turnStart, with 2 s of slack for a rounded time). Git state is the newest FIRST-PARENT commit of
// HEAD at or before that second (claimrec/asof.js's rule); the board and the ledger are filtered by their own time fields. Nothing
// reads today's state. What cannot be reconstructed for a past time (uncommitted files, files outside the repo, the process list)
// is SAID to be missing, never filled in.
//
// THE ARMS.
//   F1 fresh facts   git (main's first-parent HEAD; the newest commit anywhere in main's history by then when that differs, since
//                    work on a side line merged later existed at T but is not on the first-parent line; the commits of the 24 h
//                    before) · each repo path the prompt names (fileAsOf) · the board's last rows strictly before T, each once ·
//                    the open laps' latest rows · a stated line that processes are not reconstructible. Each with its time.
//   F2 dated msgs    every message from ANOTHER seat in the context since the last compaction (prompts tagged [pane:X],
//                    [chair:…], [librarian:…], the erring prompt included): its first line and its figure lines, then D309's
//                    `[sent <UTC> · <local> local]` line. The time is the transcript's arrival time, the nearest record of the
//                    send time for messages written before D309. Then one line: a figure from another seat is a claim to re-check.
//   F3 record search the turn's prompt as a query over the repository at the commit before the turn: every tracked text blob
//                    (≤ 2 MB, no NUL byte, the third-place folder never indexed), cut into 40-line chunks at a 20-line stride,
//                    the path's words added to each chunk, scored by BM25 (k1 1.2, b 0.75), top K (default 5). Tokens are
//                    [a-z0-9_]+ lowercased, ≥ 2 characters, a fixed English stop list removed. Nothing was tuned on any unit.
//
// Everything returned passes through claim-replay.js clean() (tokens and key shapes redacted, third-place lines removed) and has
// a home path written as ~.
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const A = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'asof.js'));
const { clean } = require(path.join(ROOT, 'consonance', 'tools', 'claim-replay.js'));
// a home path loses its user name (C:\Users\<name> -> ~), as committed text in this room does
const HOME = /\b[A-Za-z]:[\\/]Users[\\/][^\\/\s'"`]+/g;
const scrub = (s) => clean(s).replace(HOME, '~');

const THIRD = /third[-_ ]?place|metaxy/i;
const PRIVATE = /Chases_/i;   // the reads files a standing rule keeps out of every output
const iso = (ms) => new Date(ms).toISOString();
const isoSec = (ms) => iso(Math.floor(ms / 1000) * 1000).replace('.000Z', 'Z');
const clip = (s, n) => (s.length > n ? s.slice(0, n) + ' …' : s);
const oneLine = (s) => String(s).replace(/\s+/g, ' ').trim();

/** D309's send-line stamp: UTC to the second, then the local civil time as the pulse shows it ("Jan 1, 11:05 AM"). */
function stamp(ms, tz) {
  const local = new Intl.DateTimeFormat('en-US', { timeZone: tz || undefined, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    .format(new Date(ms)).replace(/[  ]/g, ' ');
  return `${isoSec(ms)} · ${local} local`;
}

function projectsDir(opts) { return opts.projects || process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects'); }
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b && b.type === 'text').map((b) => b.text || '').join('\n') : '');

/**
 * The erring turn: { T (ms of its prompt), prompt {ts, text, n}, prior [messages since the last compaction, before the prompt],
 * reply [assistant texts and tool inputs up to the next real prompt] }. A message is { ts (ms), kind 'PROMPT'|'ASSISTANT'|'TOOL_INPUT', text, n }.
 */
function loadTurn(unit, opts = {}) {
  if (!unit || !unit.transcript || !unit.turnStart) throw new Error('a unit needs transcript and turnStart');
  const want = A.parseTime(unit.turnStart);
  const file = path.join(projectsDir(opts), unit.transcript);
  if (!fs.existsSync(file)) throw new Error(`transcript not found for ${unit.id}: ${unit.transcript}`);
  // One pass. `msgs` holds the messages since the last compaction before the wanted time (a compaction inside the erring turn
  // does not clear it); the first real prompt later than the wanted time ends the turn, and reading stops. The turn's prompt is
  // the last prompt kept.
  let msgs = [], done = false, pIdx = -1;
  F.eachLine(file, (line, n) => {
    if (done || !line.startsWith('{')) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.isSidechain) return;
    const ts = Date.parse(o.timestamp || '');
    if (o.type === 'summary' || o.isCompactSummary) { if (!(ts > want)) msgs = []; return; }
    if (!Number.isFinite(ts)) return;
    if (o.type === 'user' && F.isRealPrompt(o)) {
      if (ts > want + 2000) { done = true; return; }
      msgs.push({ ts, kind: 'PROMPT', text: textOf(o.message.content), n });
      return;
    }
    if (o.type === 'assistant' && o.message && Array.isArray(o.message.content)) {
      const text = textOf(o.message.content);
      if (text.trim()) msgs.push({ ts, kind: 'ASSISTANT', text, n });
      // a claim is often written through a tool (a Write, an Edit, a heredoc), not said: keep the tool inputs as their own kind
      for (const b of o.message.content) if (b && b.type === 'tool_use' && b.input) {
        const s = typeof b.input === 'string' ? b.input : Object.values(b.input).filter((v) => typeof v === 'string').join('\n');
        if (s.trim()) msgs.push({ ts, kind: 'TOOL_INPUT', text: s, n });
      }
    }
  });
  for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].kind === 'PROMPT') { pIdx = i; break; }
  if (pIdx < 0) throw new Error(`no real prompt at or before ${unit.turnStart} in ${unit.transcript}`);
  return { T: msgs[pIdx].ts, prompt: msgs[pIdx], prior: msgs.slice(0, pIdx), reply: msgs.slice(pIdx + 1).filter((m) => m.kind !== 'PROMPT') };
}

function git(repo, args) { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] }); }
function commitAt(repo, ms) { return git(repo, ['rev-list', '-1', '--first-parent', `--before=${isoSec(ms)}`, 'HEAD']).trim() || null; }

// ── F1 ──────────────────────────────────────────────────────────────────────────────
const PATH_RE = /(?:[A-Za-z]:[\\/][^\s`'"<>|]*?[\\/]lighthouse[\\/])?((?:[\w.-]+[\\/])*[\w.-]+\.(?:md|js|json|jsonl|rs|txt|ps1|py|toml|html|css|tsv|yaml|yml))\b/g;
function namedPaths(text) {
  const out = [];
  for (const m of String(text).matchAll(PATH_RE)) {
    const before = text.slice(Math.max(0, m.index - 1), m.index);
    if (/[\w\\/:.~-]/.test(before) && !m[0].includes('lighthouse')) continue;   // the tail of an outside path, not a repo path
    const p = m[1].replace(/\\/g, '/');
    if (!out.includes(p)) out.push(p);
  }
  return out.slice(0, 12);
}

function f1(unit, opts) {
  const tz = opts.tz, repo = opts.repo || ROOT;
  const turn = loadTurn(unit, opts); const T = turn.T;
  const facts = [], lines = [`[fresh facts, as of ${stamp(T, tz)}] Cheap checks, each as the record held it at this turn's start:`];
  // git
  const head = commitAt(repo, T);
  if (!head) { facts.push({ source: 'git', head: null }); lines.push('- git: no commit at or before this time.'); }
  else {
    const show = (c) => { const [h, when, ...subj] = git(repo, ['show', '-s', '--format=%h%x09%cI%x09%s', c]).trim().split('\t'); return { h: h.slice(0, 8), when: Date.parse(when), subj: subj.join('\t') }; };
    // Main's first-parent line is one approximation of the seat's checkout; a side line merged LATER (another machine's work,
    // a worktree branch) can hold newer commits that existed by T. Both are shown when they differ; neither is guessed between.
    const any = git(repo, ['rev-list', '-1', `--before=${isoSec(T)}`, 'HEAD']).trim();
    const recent = git(repo, ['log', '--date-order', `--since=${isoSec(T - 86400000)}`, `--until=${isoSec(T)}`, '--format=%h%x09%cI%x09%s', 'HEAD'])
      .trim().split('\n').filter(Boolean).filter((l) => Date.parse(l.split('\t')[1]) <= T);
    const fp = show(head);
    facts.push({ source: 'git', head, newestAnywhere: any, committed: iso(fp.when), last24h: recent.length });
    lines.push(`- git: main's first-parent line at ${fp.h} "${clip(fp.subj, 100)}" (committed ${stamp(fp.when, tz)}); ${recent.length} commit(s) in main's history dated in the 24 h before.`);
    if (any && any !== head) { const a = show(any); lines.push(`    newest commit anywhere in main's history by then: ${a.h} "${clip(a.subj, 100)}" (committed ${stamp(a.when, tz)}), on a line merged later; this seat's checkout may have held either.`); }
    for (const r of recent.slice(0, 3)) { const [rh, rw, ...rs] = r.split('\t'); lines.push(`    ${rh.slice(0, 8)} ${isoSec(Date.parse(rw))} ${clip(rs.join('\t'), 90)}`); }
  }
  // fs: each repo path the prompt names
  const paths = namedPaths(turn.prompt.text);
  if (paths.length) lines.push('- files named in this message (the repository at this time; uncommitted edits and files outside the repo are not visible):');
  for (const p of paths) {
    if (THIRD.test(p) || PRIVATE.test(p)) { facts.push({ source: 'fs', path: p, status: 'SKIPPED' }); continue; }
    const r = A.fileAsOf(repo, p, T);
    const f = { source: 'fs', path: p, status: r.status };
    if (r.status === 'FOUND') {
      const n = r.content.split('\n').length - (r.content.endsWith('\n') ? 1 : 0);
      const last = git(repo, ['log', '-1', '--first-parent', '--format=%H%x09%cI', r.commit, '--', r.renamedFrom || p]).trim().split('\t');
      Object.assign(f, { lines: n, lastChange: last[0] || null });
      lines.push(`    ${p}: in the repo, ${n} lines, last changed ${(last[0] || '').slice(0, 8)} ${last[1] ? stamp(Date.parse(last[1]), tz) : '?'}`);
    } else if (r.status === 'DELETED') lines.push(`    ${p}: deleted from the repo by this time`);
    else lines.push(`    ${p}: not in the repo at this time`);   // NOT-YET-EXISTING reads the same: the future is not shown
    facts.push(f);
  }
  // the board and the ledger
  const dataDir = A.resolveDataDir(opts.dataDir);
  // strictly before T: rows AT T are the turn's own prompt mirrored to the board. The board is a union of two machines, so an
  // identical row (pane, time, text) can appear more than once; it is shown once.
  const seen = new Set();
  const board = A.boardAsOf(T, { dataDir }).rows.filter((r) => {
    if (!(r.ts < T)) return false;
    const k = `${r.pane}\u0000${r.ts}\u0000${r.text}`; if (seen.has(k)) return false; seen.add(k); return true;
  });
  const hour = board.filter((r) => r.ts > T - 3600000).length;
  facts.push({ source: 'board', rowsLastHour: hour, shown: Math.min(5, board.length) });
  lines.push(`- board: ${hour} row(s) in the hour before; the last ${Math.min(5, board.length)}:`);
  for (const r of board.slice(-5)) lines.push(`    [${stamp(r.ts, tz)}] ${String(r.pane || '?').slice(0, 8)} ${r.role || ''}: ${clip(oneLine(r.text || ''), 140)}`);
  const latest = new Map();
  for (const r of A.ledgerAsOf(T, { dataDir }).rows) if (r.lap) latest.set(r.lap, r);
  const open = [...latest.values()].filter((r) => r.chain !== 'filed' && r.stage !== 'void').sort((a, b) => b.at - a.at).slice(0, 6);
  facts.push({ source: 'lap', open: open.map((r) => r.lap) });
  lines.push(`- lap rows: ${open.length ? open.length + ' open lap(s), newest first:' : 'no open lap.'}`);
  for (const r of open) lines.push(`    ${r.lap} ${r.chain || r.stage}${r.holder ? ', holder ' + r.holder : ''} (row at ${stamp(r.at, tz)})`);
  facts.push({ source: 'process', status: 'NOT-RECONSTRUCTIBLE' });
  lines.push('- processes: not reconstructible for a past time (no record of the process list exists); not checked.');
  return { arm: 'F1', unit: unit.id, asOf: iso(T), text: scrub(lines.join('\n')), facts };
}

// ── F2 ──────────────────────────────────────────────────────────────────────────────
const TAG_RE = /^\[(pane:[A-Z]|chair:[A-Za-z]+|librarian:[A-Za-z]+)\]/;
function bodyLines(text) { return String(text).split(/\r?\n/).filter((l) => !/^\s*<\/?pasted_content\b/.test(l)); }
function tagOf(text) { const first = bodyLines(text).find((l) => l.trim()); const m = first && TAG_RE.exec(first.trim()); return m ? m[1] : null; }
function ownTag(seat) {
  const s = String(seat || '');
  if (/^[A-Z]$/.test(s)) return 'pane:' + s;
  if (/^lib/i.test(s)) return 'librarian:';
  if (/^(main|chair)/i.test(s)) return 'chair:';
  return null;
}
function f2(unit, opts) {
  const tz = opts.tz, max = opts.maxMessages || 10;
  const turn = loadTurn(unit, opts);
  const own = ownTag(unit.seat);
  const msgs = [...turn.prior.filter((m) => m.kind === 'PROMPT'), turn.prompt]
    .map((m) => ({ ...m, tag: tagOf(m.text) }))
    .filter((m) => m.tag && !(own && m.tag.startsWith(own)))
    .slice(-max);
  if (!msgs.length) return { arm: 'F2', unit: unit.id, asOf: iso(turn.T), text: '', stamps: [] };
  const out = ['[dated messages] Messages from other seats in this context, each with the time it was sent:'];
  const stamps = [];
  for (const m of msgs) {
    const ls = bodyLines(scrub(m.text)).map((l) => l.trim()).filter(Boolean);
    const figs = ls.slice(1).filter((l) => /\d/.test(l) && !/^(SOURCES|NEXT):/.test(l) && !/third-place line removed/.test(l)).slice(0, 6);
    out.push(`- ${clip(ls[0], 200)}`);
    for (const l of figs) out.push(`  ${clip(l, 200)}`);
    const st = stamp(m.ts, tz);
    out.push(`  [sent ${st}]`);
    stamps.push({ tag: m.tag, n: m.n, ts: iso(m.ts), stamp: st });
  }
  out.push('A figure from another seat is a claim to re-check, not a fact: it was true, if at all, when it was sent.');
  return { arm: 'F2', unit: unit.id, asOf: iso(turn.T), text: out.join('\n'), stamps };
}

// ── F3 ──────────────────────────────────────────────────────────────────────────────
const STOP = new Set(('the and of an to in is it that this for on with as at by be are was or from but not have has had do does did how what which ' +
  'who when where why can will would should could you your we our my me he she they them their its if then so no yes all any each there here see ' +
  'than too very just also into out up down over about were been being am').split(' '));
const tokens = (s) => (String(s).toLowerCase().match(/[a-z0-9_]+/g) || []).filter((t) => t.length >= 2);
const CHUNK = 40, STRIDE = 20, K1 = 1.2, B = 0.75;
const corpora = new Map();
/** The repository's tracked text at a commit: [{ path, lines[] }]. Memoised per repo+commit. */
function corpus(repo, commit) {
  const key = repo + '@' + commit;
  if (corpora.has(key)) return corpora.get(key);
  const entries = git(repo, ['ls-tree', '-r', '-l', '-z', commit]).split('\0').filter(Boolean).map((e) => {
    const [meta, p] = e.split('\t'); const [, type, obj, size] = meta.split(/\s+/); return { p, type, obj, size: Number(size) };
  }).filter((e) => e.type === 'blob' && e.size <= 2000000 && !THIRD.test(e.p) && !PRIVATE.test(e.p));
  const buf = execFileSync('git', ['-C', repo, 'cat-file', '--batch'], { input: entries.map((e) => e.obj).join('\n') + '\n', maxBuffer: 1 << 30 });
  const files = []; let at = 0;
  for (const e of entries) {
    const nl = buf.indexOf(0x0a, at); const header = buf.toString('utf8', at, nl).split(' ');
    const size = Number(header[2]); const body = buf.subarray(nl + 1, nl + 1 + size); at = nl + 1 + size + 1;
    if (header[1] !== 'blob' || body.includes(0)) continue;
    const text = body.toString('utf8');
    const lines = text.split(/\r?\n/); if (lines.length && lines[lines.length - 1] === '') lines.pop();
    files.push({ path: e.p, lines });
  }
  corpora.set(key, files);
  return files;
}
/** BM25 top-k chunks of the corpus for a query. Returns [{ path, start, end, score, excerpt }]. */
function search(files, query, k) {
  const q = [...new Set(tokens(query).filter((t) => !STOP.has(t)))];
  if (!q.length) return [];
  const qi = new Map(q.map((t, i) => [t, i]));
  const chunks = []; const df = new Array(q.length).fill(0); let total = 0;
  for (let f = 0; f < files.length; f++) {
    const { path: p, lines } = files[f];
    const pathTf = new Array(q.length).fill(0); let pathLen = 0;
    for (const t of tokens(p)) { pathLen++; const i = qi.get(t); if (i !== undefined) pathTf[i]++; }
    // 20-line blocks, counted once; a chunk is two neighbouring blocks
    const blocks = [];
    for (let s = 0; s < Math.max(lines.length, 1); s += STRIDE) {
      const tf = new Array(q.length).fill(0); let len = 0;
      for (let l = s; l < Math.min(s + STRIDE, lines.length); l++) for (const t of tokens(lines[l])) { len++; const i = qi.get(t); if (i !== undefined) tf[i]++; }
      blocks.push({ s, tf, len });
    }
    for (let b = 0; b < blocks.length; b++) {
      const nx = blocks[b + 1];
      const tf = blocks[b].tf.map((v, i) => v + (nx ? nx.tf[i] : 0) + pathTf[i]);
      const len = blocks[b].len + (nx ? nx.len : 0) + pathLen;
      const end = Math.min(blocks[b].s + CHUNK, lines.length);
      chunks.push({ f, start: blocks[b].s + 1, end: Math.max(end, blocks[b].s + 1), tf, len });
      for (let i = 0; i < q.length; i++) if (tf[i]) df[i]++;
      total += len;
      if (!nx || end >= lines.length) break;
    }
  }
  const N = chunks.length, avg = total / Math.max(N, 1);
  const idf = df.map((d) => Math.log(1 + (N - d + 0.5) / (d + 0.5)));
  for (const c of chunks) { let s = 0; for (let i = 0; i < q.length; i++) if (c.tf[i]) s += idf[i] * (c.tf[i] * (K1 + 1)) / (c.tf[i] + K1 * (1 - B + B * c.len / avg)); c.score = s; }
  return chunks.filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || files[a.f].path.localeCompare(files[b.f].path) || a.start - b.start)
    .slice(0, k)
    .map((c) => ({ path: files[c.f].path, start: c.start, end: c.end, score: Math.round(c.score * 1000) / 1000, excerpt: files[c.f].lines.slice(c.start - 1, c.end).join('\n') }));
}
function f3(unit, opts) {
  const tz = opts.tz, repo = opts.repo || ROOT, k = opts.k || 5;
  const turn = loadTurn(unit, opts);
  const commit = commitAt(repo, turn.T);
  if (!commit) throw new Error(`no commit at or before ${iso(turn.T)} in ${repo}`);
  const query = scrub(opts.query != null ? opts.query : bodyLines(turn.prompt.text).join('\n'));
  const results = search(corpus(repo, commit), query, k);
  const base = { arm: 'F3', unit: unit.id, asOf: iso(turn.T), commit, k, method: 'BM25 k1 1.2 b 0.75, 40-line chunks at stride 20, path words added', query };
  if (!results.length) return { ...base, text: '', results: [] };
  const when = git(repo, ['show', '-s', '--format=%cI', commit]).trim();
  const out = [`[record search] This turn's message, searched across the record (the repository at ${commit.slice(0, 8)}, committed ${stamp(Date.parse(when), tz)}); BM25 over 40-line chunks, top ${k}:`];
  results.forEach((r, i) => { out.push(`${i + 1}. ${r.path}:${r.start}-${r.end}`); out.push(clip(r.excerpt, 700)); });
  return { ...base, text: scrub(out.join('\n')), results: results.map(({ excerpt, ...r }) => r) };
}

function build(arm, unit, opts = {}) {
  if (arm === 'F1') return f1(unit, opts);
  if (arm === 'F2') return f2(unit, opts);
  if (arm === 'F3') return f3(unit, opts);
  throw new Error(`unknown arm ${arm}: F1, F2 or F3`);
}

module.exports = { build, loadTurn, stamp, namedPaths, corpus, search, tokens, STOP };
