#!/usr/bin/env node
/* wake-gate.js — Lap W, W4: the librarian's FIRST call_chair after a wake is refused until today's note and the other machine's newest handoffs have
 * been opened WHOLE since that wake (exo_memory/loop/wake_level2_2026-11-13/00_lap_w_spec.md:386-456, first_dispatch_gate.md; ruling 2 of
 * loop/plan_room_stretch_2026-11-13.md:96: "The wake gate refuses, for the librarian seat only, on D").
 *
 * WHY. At 14:46:27Z on 2026-11-13 the librarian rang the chair 3 min 40 s after a resume, having grepped and cut its own note and sed-cut L's
 * dreamzone3 handoff, and cat'ed only L's lighthouse handoff. The room's existing gate fired on that ring and WARNED (sources-gate.jsonl, light);
 * 1,783 warnings had reached no seat. A note opened whole is in the window; a grep of it is not.
 *
 * SCOPE. The librarian only: CONSONANCE_PANE is the librarian's session id (main.rs LIBRARIAN_SID), or the cwd is the librarian's folder. A call that
 * carries agent_id (a subagent: a workflow's agents inherit the pane id and are offered call_chair) is refused, not exempted. Under CONSONANCE_DREAM,
 * nothing. Other seats are never gated.
 *
 * THE WAKE: the last `compact_boundary` system row, or SessionStart `hook_success` attachment, in FILE order. The FIRST dispatch: no call_chair since
 * the wake already delivered. REQUIRED: required() below, the same list sessionstart-body.js (W3) prints for the librarian. OPENED WHOLE: a Read with
 * no offset and no limit (allow_large fine), or a shell segment that is one stage (no `|`, no stdout redirect) of cat / type / Get-Content / gc naming
 * the file with no -TotalCount, -Head, -Tail, -First or -Last; in both cases a result without the <persisted-output> tag. Paths are compared with
 * backslashes as slashes, case-folded. On a RESUME wake an open after the last compaction counts when the file's mtime is older than the open (the
 * conversation still holds it); on a COMPACT wake nothing before the wake counts. `[interrupt]` in the ring's text passes and is recorded.
 *
 * DECISION: deny on D; on any other machine it warns and records (not ruled for L). It fails OPEN on any error of its own, writes its ledger row
 * before any deny, and allows when that row cannot be written. A replay over a transcript: node wake-gate.js --replay <jsonl> (counts only).
 */
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js): the gap-dream gets no hooks

const fs = require('fs');
const os = require('os');
const path = require('path');

const LIBRARIAN_SID = '0c0c0c0b-0000-4000-8000-00000000115b';   // consonance/src-tauri/src/main.rs, const LIBRARIAN_SID
const GATED_TOOL = 'mcp__consonance__call_chair';
const LEDGER = 'wake-gate.jsonl';
const WATCHDOG_MS = 8000;
const TAIL_START = 4 * 1024 * 1024, TAIL_MAX = 64 * 1024 * 1024;
const PERSISTED = '<persisted-output>';
const WHOLE_READERS = new Set(['cat', 'type', 'get-content', 'gc']);
const PARTIAL_FLAGS = /^-(totalcount|head|tail|first|last)$/i;

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* no config */ }
  return path.join(os.homedir(), '.consonance');   // the app's third step (main.rs default_data)
}
function roomRepo() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    if (!cfg.room_path) return null;
    const r = path.resolve(String(cfg.room_path), '..', '..');
    return fs.existsSync(r) ? r : null;
  } catch (_) { return null; }
}
const now = () => { const e = process.env.WAKE_NOW; const t = e ? new Date(e) : new Date(); return Number.isNaN(t.getTime()) ? new Date() : t; };
const tpNorm = (cwd) => { let c = String(cwd || ''); if (c && path.isAbsolute(c)) c = path.resolve(c); return c.replace(/(?:[\\/]+\.)+[\\/]*$/, '').replace(/[\\/]+$/, ''); };
const isLibrarianCwd = (cwd) => { const c = tpNorm(cwd); return /[\\/]librarian$/i.test(c) && !/[\\/]exo_memory[\\/]librarian$/i.test(c); };

function machineTag() {
  const env = (process.env.CONSONANCE_MACHINE || '').trim();
  if (env) return env;
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\ufeff/, '')
    );
    if (cfg.machine_tag) return String(cfg.machine_tag);
  } catch (_) { /* fall through */ }
  return os.hostname();
}

// W3/W4 required: begin
/** What the librarian is held to at a wake (W4) and pointed at (W3), by the date in each name, none more than a day ahead of `today`. The same text is
 * in wake-gate.js and sessionstart-body.js; wake-gate.test.js compares the two and feeds both one repo. */
function required(repo, machine, today) {
  const dated = (dir, re) => { try { return fs.readdirSync(path.join(repo, dir)).map((n) => ({ n, m: re.exec(n) })).filter((x) => x.m); } catch (_) { return []; } };
  const limit = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1)).toISOString().slice(0, 10);
  const notes = dated('exo_memory/librarian', /^(\d{4}-\d{2}-\d{2})\.md$/).filter((x) => x.m[1] <= limit).sort((a, b) => (a.n < b.n ? 1 : -1));
  const other = machine === 'D' ? 'L' : machine === 'L' ? 'D' : null;
  const offs = other ? dated('exo_memory/loop', /^handoff_.+_(\d{4}-\d{2}-\d{2})-([A-Z])\.md$/).filter((x) => x.m[2] === other && x.m[1] <= limit) : [];
  const newest = offs.reduce((d, x) => (x.m[1] > d ? x.m[1] : d), '');
  const skips = [];
  if (!notes.length) skips.push('no-note');
  if (!other) skips.push('no-machine'); else if (!newest) skips.push('no-handoff');
  return { note: notes.length ? `exo_memory/librarian/${notes[0].n}` : null, other,
    handoffs: offs.filter((x) => x.m[1] === newest).map((x) => `exo_memory/loop/${x.n}`).sort(), skips };
}
// W3/W4 required: end

// ── the transcript ──
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map((x) => (x && typeof x.text === 'string' ? x.text : '')).join('\n') : '');
/** The rows the gate needs, in file order: wakes, and calls with their results (de-duplicated by tool id). Subagent rows are not the seat's. */
function rowsOf(entries) {
  const out = [], byId = new Map();
  for (const e of entries) {
    if (!e || e.isSidechain) continue;
    if (e.type === 'system' && e.subtype === 'compact_boundary') { out.push({ wake: 'compact', t: e.timestamp || null }); continue; }
    if (e.type === 'attachment' && e.attachment && e.attachment.type === 'hook_success' && e.attachment.hookEvent === 'SessionStart') {
      const src = String(e.attachment.hookName || '').split(':')[1] || 'unknown';
      out.push({ wake: src === 'compact' ? 'compact' : src, t: e.timestamp || null, hook: true }); continue;
    }
    const m = e.message; if (!m || !Array.isArray(m.content)) continue;
    for (const p of m.content) {
      if (!p) continue;
      if (p.type === 'tool_use' && p.id && !byId.has(p.id)) { const c = { id: p.id, name: p.name, input: p.input || {}, t: e.timestamp || null, done: false, err: false, result: '' }; byId.set(p.id, c); out.push(c); }
      else if (p.type === 'tool_result' && byId.has(p.tool_use_id) && !byId.get(p.tool_use_id).done) Object.assign(byId.get(p.tool_use_id), { done: true, err: !!p.is_error, result: textOf(p.content) });
    }
  }
  return out;
}
/** The wake: { i, kind, t, lastCompact } (the index of the last compaction at or before it), or null when no wake is in view. */
function wakeIndex(rows) {
  let w = null, lastCompact = -1;
  rows.forEach((r, i) => {
    if (!r.wake) return;
    if (r.wake === 'compact') { if (!r.hook) lastCompact = i; w = { i, kind: 'compact', t: r.t, lastCompact }; }
    else w = { i, kind: r.wake, t: r.t, lastCompact };
  });
  return w;
}
const normP = (p) => String(p || '').replace(/^["']|["']$/g, '').replace(/\\/g, '/').replace(/\/+/g, '/').toLowerCase();
const names = (p, rel) => { const n = normP(p), r = normP(rel); return n === r || n.endsWith('/' + r); };
/** Did this completed call open `rel` (repo-relative) WHOLE? */
function openedWhole(rel, call) {
  if (!call || !call.done || call.err || String(call.result).includes(PERSISTED)) return false;
  const i = call.input || {};
  if (call.name === 'Read') return names(i.file_path, rel) && i.offset == null && i.limit == null;
  if (call.name !== 'Bash' && call.name !== 'PowerShell') return false;
  for (const seg of String(i.command || '').split(/&&|\|\||;|\r?\n/)) {
    if (seg.includes('|') || /(^|[^2&])>/.test(seg) || /\b(out-file|set-content|add-content|tee-object)\b/i.test(seg)) continue;
    const w = (seg.match(/"[^"]*"|'[^']*'|\S+/g) || []);
    if (!w.length || !WHOLE_READERS.has(w[0].toLowerCase())) continue;
    if (w.some((x) => PARTIAL_FLAGS.test(x))) continue;
    if (w.slice(1).some((x) => !x.startsWith('-') && names(x, rel))) return true;
  }
  return false;
}

/**
 * The decision for one call_chair. `files` maps each required repo-relative path to its mtime (ms, or null when unknown: then a resume's earlier
 * open counts). Returns { decision: 'allow'|'deny', kind, missing, satisfied, skips, wake }.
 */
function decide({ rows, need, skips = [], files = {}, toolUseId = null, agentId = null, text = '' }) {
  if (agentId) return { decision: 'deny', kind: 'subagent', missing: [], satisfied: [], skips, wake: null };
  if (/\[interrupt\]/i.test(String(text))) return { decision: 'allow', kind: 'interrupt', missing: [], satisfied: [], skips, wake: null };
  const w = wakeIndex(rows);
  if (!w) return { decision: 'allow', kind: 'no-wake', missing: [], satisfied: [], skips, wake: null };
  const after = rows.slice(w.i + 1).filter((r) => r.id && r.id !== toolUseId);
  if (after.some((r) => r.name === GATED_TOOL && r.done && !r.err && !/^\s*refused/i.test(r.result)))
    return { decision: 'allow', kind: 'not-first', missing: [], satisfied: [], skips, wake: w };
  if (!need.length) return { decision: 'allow', kind: 'nothing-required', missing: [], satisfied: [], skips, wake: w };
  // the opens the conversation still holds from before the wake: those after the last compaction. On a COMPACT wake that window runs from the
  // compaction to the wake and holds no call, so nothing before a compact wake counts (the summary dropped it).
  const before = rows.slice(w.lastCompact + 1, w.i).filter((r) => r.id);
  const missing = [], satisfied = [], ownAppend = [];
  for (const rel of need) {
    const mt = files[rel];
    const ok = after.some((c) => openedWhole(rel, c))
      || before.some((c) => openedWhole(rel, c) && (mt == null || (c.t && mt < Date.parse(c.t))));
    (ok ? satisfied : missing).push(rel);
    // opened whole after the last compaction, then written since: the seat's own append, a FALSE refusal by design (first_dispatch_gate.md section 6).
    // Recorded by name: if more than 1 refusal in 5 is this kind, the registered answer is an exception for the seat's own appends.
    if (!ok && before.some((c) => openedWhole(rel, c))) ownAppend.push(rel);
  }
  const kind = !missing.length ? 'opened' : ownAppend.length === missing.length ? 'own-append' : 'missing';
  return { decision: missing.length ? 'deny' : 'allow', kind, missing, satisfied, ownAppend, skips, wake: w };
}
const reasonOf = (d) => `wake gate (W4, the librarian's first call_chair after a wake): since your ${d.wake.kind} wake${d.wake.t ? ` at ${d.wake.t}` : ''}, `
  + `these were not opened whole:\n${d.missing.map((m) => `  ${m}`).join('\n')}\n`
  + 'Open each with ONE Read, no offset or limit, allow_large: true; then ring in a LATER message (this one is not sent). '
  + 'A stop or hold that cannot wait: put [interrupt] in the text. Why: consonance/GATES.md, the wake gate.';

function readEntries(file) {
  if (!file || !fs.existsSync(file)) throw new Error('no-transcript');
  const size = fs.statSync(file).size, fd = fs.openSync(file, 'r');
  try {
    for (let want = TAIL_START; ; want *= 2) {
      const start = Math.max(0, size - want), buf = Buffer.alloc(size - start);
      fs.readSync(fd, buf, 0, buf.length, start);
      let text = buf.toString('utf8'); if (start > 0) { const nl = text.indexOf('\n'); text = nl >= 0 ? text.slice(nl + 1) : ''; }
      const out = []; for (const l of text.split('\n')) { if (!l.trim()) continue; try { out.push(JSON.parse(l)); } catch (_) { /* partial */ } }
      const w = wakeIndex(rowsOf(out));
      if ((w && (w.kind === 'compact' || w.lastCompact >= 0)) || start === 0 || want >= TAIL_MAX) return out;
    }
  } finally { fs.closeSync(fd); }
}
function record(dir, row) { try { fs.mkdirSync(dir, { recursive: true }); fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); return true; } catch (_) { return false; } }
function emitDeny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }), () => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}

function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  if (!payload || payload.tool_name !== GATED_TOOL) return process.exit(0);
  const pane = (process.env.CONSONANCE_PANE || '').trim();
  if (pane !== LIBRARIAN_SID && !isLibrarianCwd(payload.cwd)) return process.exit(0);   // other seats are never gated
  const dir = dataDir(), machine = machineTag(), repo = roomRepo();
  const text = String((payload.tool_input && payload.tool_input.text) || '');
  const base = { session: payload.session_id || null, machine, toolUseId: payload.tool_use_id || null };
  if (!repo) { record(dir, { ...base, decision: 'allow', kind: 'no-repo' }); return process.exit(0); }
  let d;
  try {
    const r = required(repo, machine, now());
    const need = [r.note, ...r.handoffs].filter(Boolean);
    const files = {}; for (const rel of need) { try { files[rel] = fs.statSync(path.join(repo, rel)).mtimeMs; } catch (_) { files[rel] = null; } }
    d = decide({ rows: rowsOf(readEntries(payload.transcript_path)), need, skips: r.skips, files, toolUseId: payload.tool_use_id || null, agentId: payload.agent_id || null, text });
  } catch (e) { record(dir, { ...base, decision: 'error', error: String(e && e.message || e).slice(0, 80) }); return process.exit(0); }
  const refuses = machine === 'D';
  const row = { ...base, kind: d.kind, wake: d.wake ? { kind: d.wake.kind, t: d.wake.t } : null, missing: d.missing, satisfied: d.satisfied, ownAppend: d.ownAppend || [], skips: d.skips };
  if (d.decision === 'allow') { record(dir, { ...row, decision: 'allow' }); return process.exit(0); }
  if (!refuses) { record(dir, { ...row, decision: 'warn' }); return process.exit(0); }
  if (!record(dir, { ...row, decision: 'deny' })) return process.exit(0);   // a deny that cannot be recorded is not given
  return emitDeny(d.kind === 'subagent' ? 'wake gate (W4): a subagent may not ring the chair for the librarian; ring from the seat itself.' : reasonOf(d));
}

/** --replay <jsonl>: every call_chair in a transcript, judged as at its own moment against today's tree (mtimes unknown). Counts only. */
function replay(file, repo, machine) {
  const seen = [], tally = {};
  let entries = [];
  const rl = require('readline').createInterface({ input: fs.createReadStream(file) });
  rl.on('line', (l) => {   // streamed: a librarian transcript is hundreds of MB; only the rows since the last compaction are kept
    if (!l.trim()) return; let e; try { e = JSON.parse(l); } catch (_) { return; }
    if (e.type === 'system' && e.subtype === 'compact_boundary') entries = [];
    entries.push(e);
    const m = e.message;
    const ring = m && Array.isArray(m.content) && m.content.find((p) => p && p.type === 'tool_use' && p.name === GATED_TOOL);
    if (!ring || e.isSidechain) return;
    const r = required(repo, machine, new Date(e.timestamp || Date.now()));
    const d = decide({ rows: rowsOf(entries), need: [r.note, ...r.handoffs].filter(Boolean), skips: r.skips, toolUseId: ring.id, text: String((ring.input && ring.input.text) || '') });
    const k = `${d.decision} ${d.kind}`; tally[k] = (tally[k] || 0) + 1; seen.push({ t: e.timestamp, decision: d.decision, kind: d.kind, missing: d.missing.length });
  });
  return new Promise((ok) => rl.on('close', () => ok({ rings: seen.length, tally, rows: seen })));
}

module.exports = { LIBRARIAN_SID, GATED_TOOL, rowsOf, wakeIndex, openedWhole, required, decide, reasonOf, replay, isLibrarianCwd, machineTag };

if (require.main === module) {
  if (process.argv[2] === '--replay') {
    replay(process.argv[3], roomRepo(), machineTag()).then((out) => console.log(JSON.stringify({ rings: out.rings, tally: out.tally })));
  } else { try { main(); } catch (_) { process.exit(0); } }
}
