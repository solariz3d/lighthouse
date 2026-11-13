#!/usr/bin/env node
/* sessionstart-body.js — Lap W, W3: ONE line of facts at every start, resume included (exo_memory/loop/wake_level2_2026-11-13/00_lap_w_spec.md:315-384,
 * body_line.md sections 3-7).
 *
 * WHY. At the librarian's 14:42:47Z wake on 2026-11-13 the seat woke on a shelf built 5 s earlier from a copy of origin 33.2 h old, while L had pushed
 * 307 commits; local refs said "0 behind". Nothing in front of the seat said which model, which effort, how much context, or how old its picture of
 * origin was. This line says it, each field with its source when it is not first-hand, and fails each field on its own to "not readable".
 *
 *   [body] machine <tag> · model <id>[ (last reply)] · effort <level> (<env|last reply|saved>)|not readable · context <N>k <to resend|at last reply
 *   HH:MM|before compaction> · HEAD <sha> · origin/main last synced <age> ago, <b> behind by that copy · shelf built at <sha>[, <n> commits behind HEAD]
 *   · source <source>
 *
 * For the LIBRARIAN's cwd only, a second line: its newest dated note, the Third Place's newest file and the other machine's newest handoffs, each
 * picked by the DATE IN ITS NAME (a pull stamps every file with one mtime), read at HEAD <sha>. required() is the list W4's wake gate holds the seat to;
 * wake-gate.js carries the same function and a test feeds both one repo.
 *
 * SOURCES, in order. machine: CONSONANCE_MACHINE, ~/.consonance.json machine_tag, the hostname (state-sync.js's machineTag, pinned by a test). model:
 * the input's `model`, else the last non-synthetic assistant row of the transcript. effort: CLAUDE_CODE_EFFORT_LEVEL, CLAUDE_EFFORT, the last reply's
 * `effort`, ~/.claude/settings.json modelSettings[<model>].effortLevel "(saved)". context: the input's `context_tokens`, else the last reply's input +
 * cache read + cache write. origin: the origin/main REFLOG ENTRY's time (never the commit's: a fetch of an old commit is still a fresh sync) and
 * `git rev-list --count HEAD..origin/main` (true only of that copy, so it says so). shelf: W1's stamp `Built <date> <time> on <m> from HEAD <sha>`, else
 * the shelf's mtime through HEAD@{<mtime>}.
 *
 * NEVER: dollars (estimated_cache_write_usd is in the input and is not printed); a network call (ls-remote would be one per seat per start; W5's pull
 * before the shelf is the fix for origin's age). Fresh panes, overseer runs and the Third Place get no line and a `skipped` ledger row; a dreaming
 * instance gets nothing at all (the dream gate). Clock seam BODY_NOW. The start is never blocked: every field is caught, and a watchdog exits at 6 s.
 */
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js): the gap-dream gets no hooks

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// D273 dirs: begin. The Consonance data and instances folders by THE APP'S OWN RULE (consonance/src-tauri/src/main.rs set_dirs and default_data /
// default_instances): ~/.consonance.json's data_dir / instances_dir when set, else %USERPROFILE%\.consonance and %USERPROFILE%\claude-instances.
// Never a hard-coded C:\Consonance: on a stranger's machine that wrote where the app never reads. One text in the five hooks that need it
// (session-start, sessionstart-state, findings-return, sourced-stop, precompact-preserve); consonance/hooks/dirs.test.js holds them to it.
function consonanceDir(key, under) {
  const home = process.env.USERPROFILE || '.';
  try { const v = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''))[key]; if (typeof v === 'string' && v.trim()) return v.trim(); } catch (e) { /* no config, or not JSON: the default, as the app */ }
  return `${home}\\${under}`;
}
// D273 dirs: end
const DATA = process.env.CONSONANCE_DATA || consonanceDir('data_dir', '.consonance');
const LEDGER = path.join(DATA, 'sessionstart-body.jsonl');
const WATCHDOG_MS = 6000;

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

const now = () => { const e = process.env.BODY_NOW; const t = e ? new Date(e) : new Date(); return Number.isNaN(t.getTime()) ? new Date() : t; };
const tpNorm = (cwd) => { let c = String(cwd || ''); if (c && path.isAbsolute(c)) c = path.resolve(c); return c.replace(/(?:[\\/]+\.)+[\\/]*$/, '').replace(/[\\/]+$/, ''); };
const isThirdPlaceCwd = (cwd) => /[\\/]third-place[\\/]?$/i.test(tpNorm(cwd));
// the same seat test as precompact-preserve.js (W2): a folder that merely ends in "librarian" inside exo_memory is a session opened in the notes
const isLibrarianCwd = (cwd) => { const c = tpNorm(cwd); return /[\\/]librarian$/i.test(c) && !/[\\/]exo_memory[\\/]librarian$/i.test(c); };
// lib/fresh-guard.js's rule (the pane's OWN folder is fresh-*, directly under the instances folder), with the instances folder by the app's rule
const isFreshCwd = (cwd) => { if (!cwd) return false; try { const p = path.resolve(String(cwd)); return path.basename(p).startsWith('fresh-') && path.dirname(p).toLowerCase() === path.resolve(consonanceDir('instances_dir', 'claude-instances')).toLowerCase(); } catch (_) { return false; } };

const git = (dir, args) => { const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', timeout: 3000, windowsHide: true }); return r.status === 0 ? r.stdout.trim() : null; };
/** The room's repo: ~/.consonance.json room_path (…/exo_memory/BOOT.md), two levels up; null when there is none. */
function roomRepo() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    if (!cfg.room_path) return null;
    const r = path.resolve(String(cfg.room_path), '..', '..');
    return fs.existsSync(r) ? r : null;
  } catch (_) { return null; }
}

/** The last non-synthetic assistant row of the transcript: { model, effort, ctx, at } or null. Reads a tail, 4 MB doubling to 64 MB. */
function lastReply(file) {
  if (!file) return null;
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const size = fs.fstatSync(fd).size;
    for (let want = 4 << 20; ; want *= 2) {
      const n = Math.min(size, want), buf = Buffer.alloc(n);
      fs.readSync(fd, buf, 0, n, size - n);
      const lines = buf.toString('utf8').split('\n');
      if (n < size) lines.shift();   // a partial first line
      for (let i = lines.length - 1; i >= 0; i--) {
        if (!lines[i].includes('"assistant"')) continue;
        let row; try { row = JSON.parse(lines[i]); } catch (_) { continue; }
        const m = row && row.message;
        if (row.type !== 'assistant' || !m || !m.model || m.model === '<synthetic>') continue;
        const u = m.usage || {};
        const ctx = ['input_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens'].reduce((s, k) => s + (Number(u[k]) || 0), 0);
        return { model: m.model, effort: typeof row.effort === 'string' ? row.effort : null, ctx: ctx || null, at: row.timestamp ? new Date(row.timestamp) : null };
      }
      if (n >= size || want >= 64 << 20) return null;
    }
  } catch (_) { return null; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch (_) {} }
}

const hhmm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const age = (ms) => (ms < 3600e3 ? `${Math.max(0, Math.round(ms / 60e3))} min` : `${(ms / 3600e3).toFixed(1)} h`);

/** The time of origin/main's newest reflog entry (a push or a fetch), from the reflog file itself: never the commit's time. */
function originSynced(repo) {
  const common = git(repo, ['rev-parse', '--git-common-dir']);
  if (!common) return null;
  const log = path.resolve(repo, common, 'logs', 'refs', 'remotes', 'origin', 'main');
  const last = fs.readFileSync(log, 'utf8').trim().split('\n').pop();
  const m = /> (\d+) [+-]\d{4}\t/.exec(last);
  return m ? new Date(Number(m[1]) * 1000) : null;
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
/** The Third Place's newest file, by the date in its name (ties: the later name). */
function thirdPlaceNewest(repo) {
  try {
    const xs = fs.readdirSync(path.join(repo, 'exo_memory', 'third_place')).map((n) => ({ n, d: (/(\d{4}-\d{2}-\d{2})/.exec(n) || [])[1] })).filter((x) => x.d);
    xs.sort((a, b) => (a.d === b.d ? (a.n < b.n ? 1 : -1) : a.d < b.d ? 1 : -1));
    return xs.length ? `exo_memory/third_place/${xs[0].n}` : null;
  } catch (_) { return null; }
}

/** The body line and the librarian's clause, each field caught on its own. Returns { text, srcs }. */
function build(payload, t) {
  const src = { model: 'none', effort: 'none', ctx: 'none' };
  const field = (f) => { try { return f(); } catch (_) { return null; } };
  const source = typeof payload.source === 'string' && payload.source ? payload.source : 'unknown';
  const reply = field(() => lastReply(payload.transcript_path));
  const machine = field(machineTag) || 'not readable';

  let model = field(() => (typeof payload.model === 'string' && payload.model ? payload.model : payload.model && payload.model.id) || null);
  if (model) src.model = 'input'; else if (reply && reply.model) { model = reply.model; src.model = 'transcript'; }
  const modelText = model ? `${model}${src.model === 'transcript' ? ' (last reply)' : ''}` : 'not readable';

  const effortText = field(() => {
    for (const k of ['CLAUDE_CODE_EFFORT_LEVEL', 'CLAUDE_EFFORT']) { const v = (process.env[k] || '').trim(); if (v) { src.effort = 'env'; return `${v} (env)`; } }
    if (reply && reply.effort) { src.effort = 'transcript'; return `${reply.effort} (last reply)`; }
    const s = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude', 'settings.json'), 'utf8').replace(/^﻿/, ''));
    const v = model && s.modelSettings && s.modelSettings[model] && s.modelSettings[model].effortLevel;
    if (v) { src.effort = 'saved'; return `${v} (saved)`; }
    return null;
  }) || 'not readable';

  const ctxText = field(() => {
    const k = (n) => `${Math.round(n / 1000)}k`;
    if (Number(payload.context_tokens) > 0) { src.ctx = 'input'; return `${k(Number(payload.context_tokens))} to resend`; }
    if (reply && reply.ctx) { src.ctx = 'transcript'; return source === 'compact' ? `${k(reply.ctx)} before compaction` : `${k(reply.ctx)} at last reply${reply.at ? ' ' + hhmm(reply.at) : ''}`; }
    return null;
  }) || 'not readable';

  const repo = field(roomRepo);
  const head = repo && field(() => git(repo, ['rev-parse', '--short=8', 'HEAD']));
  const originText = (repo && field(() => {
    const at = originSynced(repo); if (!at) return null;
    const behind = git(repo, ['rev-list', '--count', 'HEAD..refs/remotes/origin/main']);
    return behind === null ? null : `last synced ${age(t - at)} ago, ${behind} behind by that copy`;
  })) || 'not readable';
  const shelfText = (repo && head && field(() => {
    const md = path.join(String(payload.cwd || ''), 'CLAUDE.md');
    if (!payload.cwd || !fs.existsSync(md)) return null;
    const stamp = /^Built \S+ \S+ on \S+ from HEAD ([0-9a-f]{7,40})\b/m.exec(fs.readFileSync(md, 'utf8'));
    const at = stamp ? git(repo, ['rev-parse', '--short=8', `${stamp[1]}^{commit}`]) : git(repo, ['rev-parse', '--short=8', `HEAD@{${fs.statSync(md).mtime.toISOString()}}`]);
    if (!at) return null;
    const n = Number(git(repo, ['rev-list', '--count', `${at}..HEAD`]) || 0);
    return `built at ${at}${n > 0 ? `, ${n} commits behind HEAD` : ''}`;
  })) || 'not readable';

  const line = `[body] machine ${machine} · model ${modelText} · effort ${effortText} · context ${ctxText} · HEAD ${head || 'not readable'} · origin/main ${originText} · shelf ${shelfText} · source ${source}`;
  let text = line;
  if (isLibrarianCwd(payload.cwd)) {
    const room = repo ? field(() => {
      const r = required(repo, machine, t), tp = thirdPlaceNewest(repo);
      const parts = [`newest note ${r.note || 'none'}`, `the Third Place's newest ${tp || 'none'}`,
        r.other ? `${r.other}'s newest handoffs ${r.handoffs.length ? r.handoffs.join(', ') : 'none'}` : 'the other machine not readable'];
      return `[room] at HEAD ${head || 'not readable'}: ${parts.join(' · ')}`;
    }) : null;
    text += '\n' + (room || '[room] not readable');
  }
  return { text, src };
}

function ledger(row) {
  try { fs.mkdirSync(DATA, { recursive: true }); fs.appendFileSync(LEDGER, JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); } catch (_) { /* never block a start */ }
}

function main() {
  const t0 = Date.now();
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();
  let payload = {};
  try { payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}') || {}; } catch (_) { /* a bad payload must not break a start */ }
  const source = typeof payload.source === 'string' ? payload.source : null;
  const skip = process.env.CLAUDE_OVERSEER_RUN ? 'overseer run' : isFreshCwd(payload.cwd) ? 'fresh pane' : isThirdPlaceCwd(payload.cwd) ? 'third-place cwd' : null;
  if (skip) return ledger({ event: 'skipped', source, reason: skip });
  const { text, src } = build(payload, now());
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: text } }));
  ledger({ event: 'emitted', source, bytes: Buffer.byteLength(text), ms: Date.now() - t0, model_src: src.model, effort_src: src.effort, ctx_src: src.ctx });
}

module.exports = { build, required, thirdPlaceNewest, lastReply, originSynced, isLibrarianCwd, machineTag };

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }
