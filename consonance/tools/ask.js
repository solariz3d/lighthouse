#!/usr/bin/env node
/* ask.js — the questions the automations put to the keeper, carried with the FACT attached.
 *
 * WHY THIS EXISTS, measured rather than supposed (5fb4401, pane D001).
 *
 * Five duration goals fire on cron into an empty house. When one of them hits something only the
 * keeper can decide, it says so — in prose, addressed to him — and that sentence lands in
 * `system-cron.log`. A grep over 9,457 transcript jsonl found that three such questions had NEVER
 * been read by anything except the goal that wrote them and the investigation that went looking.
 * One sat SEVEN DAYS. That is muscle_map.md:1216 stage 7 — a right instrument nobody reads — and
 * not :1229 read-and-inert, which is the only reason a channel is the right fix at all.
 *
 * THE DESIGN CONSTRAINT IS THE THING THAT KILLED THE LAST ONE. A channel already exists:
 * session-start.js's knocker renders one line per goal that fired in the dark. Its payload is the
 * last bracketed token of progress.md — `[CRITIQUE]`, `[DRIFT-FOUND]`, `fired`. **A CHANNEL THAT
 * EXISTS CARRIES THE CATEGORY, NOT THE FACT.** So the bar here is not "surface that a question is
 * waiting". It is: say WHICH question, in the goal's own words, or this is the same failure with a
 * new filename. `--line` is tested against exactly that and refuses to emit a bare count.
 *
 * THE PROTOCOL IS BORROWED WHOLE, because one layer in it already works. Inside the subject,
 * `daily-news-digest/PENDING-CONDITIONS.md` solved this for a goal-to-goal channel and recorded the
 * result: *"An append-only log is an archive; it is not a channel."* Its law is separation of write
 * from clear — conditions are written by the auditor and **NOT cleared by the auditor**; the target
 * clears each one; an uncleared condition is visible as an uncleared file. Given a channel it
 * actually read, a target executed 7/7 in one pass including an item it had refused 22 times.
 * So: THIS TOOL NEVER WRITES TO THE STORE. It reads, ages, and renders. Clearing is a human edit,
 * by hand, marked with what was decided.
 *
 * WHERE THE STORE LIVES, and it is a correction to the precedent rather than a copy of it.
 * PENDING-CONDITIONS.md lives outside the repo, invisible to every sweep and unreachable by
 * carrier-drift — CH-5's shape one directory over. `exo_memory/ASK.md` is in the repo on purpose.
 *
 * WHAT IT CANNOT SEE, printed in the report rather than filed here, per P-UNIVERSE:
 *
 *   UNWIRED           — the honest state of this tool today. `chain-status.js` was written to be
 *                       "called from the pulse hook, which fires on every prompt in every seat" and
 *                       is called by NOTHING: no hook, no settings entry, no task references it.
 *                       It has sat silent and looked identical to working. A sensor cannot tell
 *                       whether its silence is a quiet room or a dead wire, so this one CHECKS ITS
 *                       OWN CALLERS and says UNWIRED in its own report. It is the one defect in
 *                       this family that is invisible from the instrument's own output, which is
 *                       why it is the one thing the instrument had to be given eyes for.
 *   candidates        — the cron-log scan INFERS from prose and is therefore reported as
 *                       CANDIDATES, never as asks, and never auto-filed. `cite-check` works because
 *                       it requires rather than infers (journal 2026-08-16); an ask enters the store
 *                       by a human or a seat writing it down with provenance.
 *   N unreadable      — an `### ASK-` block whose Status line will not parse is COUNTED, never
 *                       filtered away and never counted as cleared. A row that cannot be read is an
 *                       outcome that is UNKNOWN, not absent (residue.js, 2026-08-17).
 *   this machine only — the candidate scan reads ~/.claude/shell/duration on THIS box. The laptop
 *                       has its own goals and its own logs, and neither can see the other.
 *
 * Run:  node consonance/tools/ask.js            full report + candidate scan + wiring
 *       node consonance/tools/ask.js --line     one line for a compelled reader; silent if none
 *       node consonance/tools/ask.js --why      why --line was silent (stderr), for dead-vs-quiet
 *       node consonance/tools/ask.js --wiring   who, if anyone, calls this tool
 *       node consonance/tools/ask.js --json
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = path.resolve(__dirname, '..', '..');
const STORE = process.env.ASK_STORE || path.join(REPO, 'exo_memory', 'ASK.md');
const DURATION_DIR = process.env.ASK_DURATION_DIR || path.join(os.homedir(), '.claude', 'shell', 'duration');

/* Places a caller could live. Overridable so the wiring check is testable against a fixture
 * instead of against whatever happens to be installed on the machine running the suite. */
const WIRING_ROOTS = (process.env.ASK_WIRING_ROOTS || [
  path.join(os.homedir(), '.claude', 'shell', 'hooks'),
  path.join(os.homedir(), '.claude', 'settings.json'),
  path.join(REPO, 'consonance', 'hooks'),
].join(path.delimiter)).split(path.delimiter).filter(Boolean);

/* The floor that stops --line degrading into the thing it replaces. Below this many characters of
 * the goal's own words, the line is a category with a decoration on it. Enforced, not advised. */
const MIN_FACT_CHARS = 40;
const LINE_FACT_BUDGET = 150;

const DAY_MS = 86400000;

/* ── the store ──────────────────────────────────────────────────────────────────────────────── */

/* One block per ask. The heading carries identity and provenance; Status carries state and is the
 * ONLY thing that closes an ask. Deliberately not YAML: the file is edited by hand, by a person
 * answering a question, and a format that punishes a stray colon would be cleared less often. */
const HEAD_RE = /^###\s+(ASK-\d+)\s+—\s+([^,]+),\s+asked\s+(\d{4}-\d{2}-\d{2})\s*$/;
const FIELD_RE = /^\*\*(Source|Question|Status):\*\*\s*([\s\S]*)$/;

function parseStore(text) {
  const asks = [];
  const unreadable = [];
  let cur = null;
  const push = () => {
    if (!cur) return;
    const state = classify(cur.status);
    if (!state) unreadable.push({ id: cur.id, reason: cur.status === null ? 'no Status line' : `unrecognised Status: ${cur.status}` });
    else asks.push({ ...cur, state });
    cur = null;
  };
  for (const raw of String(text).split(/\r?\n/)) {
    const h = raw.match(HEAD_RE);
    if (h) { push(); cur = { id: h[1], goal: h[2].trim(), asked: h[3], source: null, question: null, status: null }; continue; }
    if (!cur) continue;
    const f = raw.match(FIELD_RE);
    if (!f) continue;
    const key = f[1].toLowerCase();
    const val = f[2].trim();
    if (key === 'source') cur.source = val;
    else if (key === 'question') cur.question = val;
    else if (key === 'status') cur.status = val;
  }
  push();
  return { asks, unreadable };
}

/* OPEN, or cleared with a marked decision. Anything else is unreadable — never silently cleared.
 * PENDING-CONDITIONS learned this the expensive way: `[PARTIAL]` was invented mid-flight and both
 * parties then counted partials as ticks and published 7/7 over a 5/7. So the vocabulary is closed,
 * and an unknown marker fails loudly instead of rounding toward done. */
function classify(status) {
  if (status === null) return null;
  if (/^OPEN$/i.test(status.trim())) return 'OPEN';
  if (/^\[ANSWERED\s+\d{4}-\d{2}-\d{2}\s+—\s+\S[\s\S]*\]$/.test(status.trim())) return 'ANSWERED';
  if (/^\[DECLINED\s+\d{4}-\d{2}-\d{2}\s+—\s+\S[\s\S]*\]$/.test(status.trim())) return 'DECLINED';
  return null;
}

function load(storePath = STORE) {
  let text;
  try { text = fs.readFileSync(storePath, 'utf8'); }
  catch (_) { return { asks: [], unreadable: [], missing: true }; }
  return { ...parseStore(text), missing: false };
}

function ageDays(asked, now) {
  const t = Date.parse(`${asked}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now - t) / DAY_MS));
}

/* Oldest first — the same selection age-of-pull uses, and for the same reason: a queue ordered by
 * anything else lets the uncomfortable question sink. */
function openAsks(state, now) {
  return state.asks
    .filter(a => a.state === 'OPEN')
    .map(a => ({ ...a, age: ageDays(a.asked, now) }))
    .sort((a, b) => (b.age ?? -1) - (a.age ?? -1) || a.id.localeCompare(b.id));
}

/* ── the line ───────────────────────────────────────────────────────────────────────────────── */

function trimFact(question, budget = LINE_FACT_BUDGET) {
  const q = String(question || '').replace(/\s+/g, ' ').trim();
  if (q.length <= budget) return q;
  const cut = q.slice(0, budget);
  const sp = cut.lastIndexOf(' ');
  return (sp > budget * 0.6 ? cut.slice(0, sp) : cut) + '…';
}

/* Returns null when there is nothing to say. A sensor that invents a line for an empty queue trains
 * its reader to skip it, and a skipped line is an unwired line with extra steps. */
function line(state, now) {
  const open = openAsks(state, now);
  if (!open.length) return null;
  const top = open[0];
  const fact = trimFact(top.question);
  /* The whole point of the tool. If the goal's own words did not survive into the line, emitting
   * a count would rebuild the knocker, so refuse and say why — loudly, in the line itself, because
   * a silent refusal here is indistinguishable from an empty queue. */
  if (fact.length < MIN_FACT_CHARS) {
    return `ask: ${open.length} open · ASK ${top.id} HAS NO USABLE QUESTION TEXT — the store carries a category, not the fact; fix ${path.relative(REPO, STORE)}`;
  }
  const age = top.age === null ? 'age?' : `${top.age}d`;
  const more = open.length > 1 ? ` · +${open.length - 1} more` : '';
  return `ask: ${open.length} open · oldest ${age} · ${top.goal}: "${fact}"${more} · node consonance/tools/ask.js`;
}

function whySilent(state, now) {
  if (state.missing) return `no store at ${STORE} — that is a missing channel, not an empty one`;
  if (!state.asks.length && !state.unreadable.length) return `store parsed, zero ASK blocks found in ${STORE}`;
  if (state.unreadable.length && !openAsks(state, now).length) {
    return `zero OPEN asks, but ${state.unreadable.length} block(s) UNREADABLE — silence here is not evidence of an empty queue`;
  }
  return 'zero OPEN asks — every ask in the store is marked ANSWERED or DECLINED';
}

/* ── the wiring check ───────────────────────────────────────────────────────────────────────── */

/* The defect this exists for is invisible from the outside: chain-status.js documents itself as
 * called from the pulse hook and is called by nothing, and nothing in its output ever said so.
 * A sensor's silence has two causes and they look identical. This separates them. */
function wiring(roots = WIRING_ROOTS, needle = 'ask.js') {
  const callers = [];
  const scanned = [];
  const walk = (p) => {
    let st;
    try { st = fs.statSync(p); } catch (_) { return; }
    if (st.isDirectory()) {
      let entries = [];
      try { entries = fs.readdirSync(p); } catch (_) { return; }
      for (const e of entries) walk(path.join(p, e));
      return;
    }
    if (!/\.(js|json|ps1|cjs|mjs)$/i.test(p)) return;
    if (/\.bak(-[\w-]+)?$/i.test(p) || /\.test\.js$/i.test(p)) return;
    if (path.resolve(p) === path.resolve(__filename)) return;   // the tool is not its own caller
    scanned.push(p);
    let text;
    try { text = fs.readFileSync(p, 'utf8'); } catch (_) { return; }
    if (text.includes(needle)) callers.push(p);
  };
  for (const r of roots) walk(r);
  return { wired: callers.length > 0, callers, scannedCount: scanned.length };
}

/* ── the candidate scan ─────────────────────────────────────────────────────────────────────── */

/* Prose inference, and labelled as such everywhere it appears. These phrases are the ones the goals
 * actually used when addressing the keeper; they are a net for a human to look through, NOT a
 * detector, and nothing here can file an ask. The distinction is load-bearing: `cite-check` works
 * because it REQUIRES a citation rather than inferring support from position, and three detectors
 * died on the opposite assumption in one night. */
const CANDIDATE_RE = /(should reach you|your call|can'?t answer from in here|worth flagging plainly|waiting on you|rather than sit in a log)/i;

function candidates(durationDir = DURATION_DIR) {
  const out = [];
  let goals = [];
  try { goals = fs.readdirSync(durationDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); }
  catch (_) { return { rows: [], reachable: false }; }
  for (const g of goals) {
    const log = path.join(durationDir, g, 'system-cron.log');
    let text;
    try { text = fs.readFileSync(log, 'utf8'); } catch (_) { continue; }
    const lines = text.split(/\r?\n/);
    let stamp = null;
    lines.forEach((ln, i) => {
      const s = ln.match(/^(\d{4}-\d{2}-\d{2})T[\d:]+Z \[(START|OUTPUT|END)\]/);
      if (s) stamp = s[1];
      if (CANDIDATE_RE.test(ln)) out.push({ goal: g, date: stamp, line: i + 1, text: ln.replace(/\s+/g, ' ').trim().slice(0, 400) });
    });
  }
  return { rows: out, reachable: true };
}

/* ── reporting ──────────────────────────────────────────────────────────────────────────────── */

function report(now = Date.now()) {
  const state = load();
  const open = openAsks(state, now);
  const cleared = state.asks.filter(a => a.state !== 'OPEN');
  const w = wiring();
  const c = candidates();
  const L = [];

  L.push(`ASK — ${open.length} open · ${cleared.length} cleared · ${state.unreadable.length} unreadable · store ${path.relative(REPO, STORE)}${state.missing ? ' (MISSING)' : ''}`);
  L.push('');
  if (!w.wired) {
    L.push(`  UNWIRED — nothing calls this tool. Scanned ${w.scannedCount} file(s) across ${WIRING_ROOTS.length} root(s) and found no caller.`);
    L.push('  Until something calls it, an empty report and a dead tool are the same output.');
    L.push('  (chain-status.js has been in exactly this state since it was written.)');
  } else {
    L.push(`  wired — called from: ${w.callers.map(p => path.basename(p)).join(', ')}`);
  }
  L.push('');

  if (open.length) {
    L.push('OPEN — oldest first');
    for (const a of open) {
      L.push(`  ${a.id}  ${a.age === null ? ' age?' : String(a.age).padStart(3) + 'd'}  ${a.goal}`);
      L.push(`        ${trimFact(a.question, 400)}`);
      if (a.source) L.push(`        source: ${a.source}`);
    }
    L.push('');
  }
  if (state.unreadable.length) {
    L.push('UNREADABLE — counted, not cleared, not open');
    for (const u of state.unreadable) L.push(`  ${u.id || '(no id)'}: ${u.reason}`);
    L.push('');
  }
  if (!c.reachable) {
    L.push(`candidates: duration dir unreadable at ${DURATION_DIR} — scan did not run (this is not "zero candidates")`);
  } else {
    const unfiled = c.rows.length;
    L.push(`candidates in cron logs: ${unfiled} prose match(es) across the goals — INFERENCE, not asks.`);
    L.push('  Nothing here is filed automatically. A human or a seat writes it into the store with provenance.');
    for (const r of c.rows.slice(-6)) L.push(`  · ${r.goal} ${r.date || '????-??-??'} :${r.line}  ${r.text.slice(0, 150)}`);
    if (unfiled > 6) L.push(`  … ${unfiled - 6} earlier match(es) not shown`);
  }
  L.push('');
  L.push('this machine only — the candidate scan reads this box\'s duration dir; the laptop has its own.');
  return L.join('\n');
}

function main(argv = process.argv.slice(2)) {
  const now = Date.now();
  if (argv.includes('--wiring')) {
    const w = wiring();
    process.stdout.write((w.wired ? `wired — ${w.callers.join(', ')}` : `UNWIRED — no caller found in ${WIRING_ROOTS.length} root(s), ${w.scannedCount} file(s) scanned`) + '\n');
    return 0;
  }
  if (argv.includes('--line')) {
    const state = load();
    const ln = line(state, now);
    if (ln) process.stdout.write(ln + '\n');
    else if (argv.includes('--why')) process.stderr.write(whySilent(state, now) + '\n');
    return 0;   // absent store -> silent, exit 0. A reader that can fail takes its caller down.
  }
  if (argv.includes('--json')) {
    const state = load();
    process.stdout.write(JSON.stringify({
      open: openAsks(state, now), cleared: state.asks.filter(a => a.state !== 'OPEN'),
      unreadable: state.unreadable, wiring: wiring(), missing: state.missing,
    }, null, 2) + '\n');
    return 0;
  }
  process.stdout.write(report(now) + '\n');
  return 0;
}

if (require.main === module) process.exit(main());

module.exports = {
  parseStore, classify, load, openAsks, ageDays, line, whySilent, trimFact,
  wiring, candidates, report, main,
  STORE, DURATION_DIR, MIN_FACT_CHARS, LINE_FACT_BUDGET, CANDIDATE_RE,
};
