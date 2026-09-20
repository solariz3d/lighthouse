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
/* The title group was `[^,]+` until 2026-09-20, so a title could not contain a comma — and ASK-009's
 * did: "(SIX, not eleven — corrected 2026-08-30)". Its heading therefore never started a block, its
 * three fields were absorbed into ASK-008 above it, ASK-008 printed OPEN while the store said
 * [ANSWERED 2026-08-30] and carried ASK-009's question, and ASK-009 printed zero times. Greedy `.+`
 * with the date anchored at the end takes the LAST ", asked <date>", so a title may now hold commas,
 * em-dashes and brackets. */
const HEAD_RE = /^###\s+(ASK-\d+)\s+—\s+(.+),\s+asked\s+(\d{4}-\d{2}-\d{2})\s*$/;
/* Anything that MEANT to be a heading. Widening the title alone leaves the next unparsable heading
 * silently absorbed, which is the defect rather than the regex. A line that starts an ASK heading and
 * does not parse is UNREADABLE — what :47 already claims this tool does. */
const ASK_HEAD_RE = /^###\s+(ASK-\S*)/;
/* ```fenced``` blocks are documentation, not store. ASK.md carries the block-format example inside
 * one, and it must stay harmless: an example is not an ask and is not an unreadable ask. */
const FENCE_RE = /^\s*```/;
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
  let inFence = false;
  for (const raw of String(text).split(/\r?\n/)) {
    if (FENCE_RE.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const h = raw.match(HEAD_RE);
    if (h) { push(); cur = { id: h[1], goal: h[2].trim(), asked: h[3], source: null, question: null, status: null }; continue; }
    const bad = raw.match(ASK_HEAD_RE);
    if (bad) {
      /* Close the block above FIRST, or its fields keep collecting from a heading that failed —
       * the absorption this repair exists to stop — then record the heading itself as unreadable. */
      push();
      unreadable.push({ id: /^ASK-\d+$/.test(bad[1]) ? bad[1] : null, reason: `unparsable heading: ${raw.trim()}` });
      continue;
    }
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

/* ── re-test provenance (D092) ─────────────────────────────────────────────────────────────────
 *
 * THE PROBLEM THIS SOLVES, and it is a routing problem rather than a discipline one.
 * `daily-news-digest` has been re-verifying the keeper's open asks on its own passes for weeks and
 * writing the results into its own standing items, because its protocol correctly forbids it from
 * editing the ASK store: clearing is the keeper's act, and a goal clearing its own ask is the audited
 * marking its own homework. The consequence is that a correction which is dated, unambiguous and
 * CORRECT cannot propagate — the only channel that would carry it is the one its author must not use.
 * ASK-002 carried a stale evidence line for nine days that way.
 *
 * SO THE READER, NOT THE WRITER. This tool still never writes to the store (see :26). It READS the
 * goals' own files at render time and shows what they found beside the ask, labelled with the file,
 * the line and the date. Nothing about the ask changes: the Question stays the asker's words, and the
 * Status stays the keeper's. A re-test is evidence offered to him, never a verdict on his behalf.
 *
 * TWO FORMS, and the narrowness is the whole design. A scanner that reads prose loosely turns every
 * passing mention of an id into a verdict, and the live goal tree mentions ask ids constantly in
 * routing notes and summaries.
 *   (A) BLOCK  — an `ASK-\d+` inside a paragraph matching /open asks re-tested/i. This is the shape
 *                the goal already writes, so its existing output is carried without asking it to change.
 *   (B) MARKER — one line, `RE-TESTED ASK-0NN <YYYY-MM-DD>: <result>`. This is the forward channel: a
 *                goal emits it on any pass and it reaches the queue that day. A marker with no date is
 *                REFUSED rather than dated here, because an undated re-test read as fresh is exactly
 *                the failure the channel exists to prevent.
 *
 * AND ONLY LIVE FILES. The same block exists in eight archived copies under evidence/ and in
 * `.pre-*` siblings; attaching those would show one result many times over and age it wrongly.
 */

const RETEST_BLOCK_RE = /open asks re-tested/i;
const RETEST_MARKER_RE = /^\s*RE-TESTED\s+(ASK-\d+)\s+(\d{4}-\d{2}-\d{2})\s*:\s*(.+?)\s*$/;
const ASK_ID_RE = /\*\*(ASK-\d+)\*\*\s*(?:\((\d+)d\))?\s*:?\s*/g;
const ARCHIVE_RE = /[\\/]evidence[\\/]|[-\\/]versions[\\/]|\.pre-|\.bak/i;
const RETEST_EXT_RE = /\.(md|log|txt)$/i;

/** Is this a file a goal is currently writing, rather than a copy of one it wrote before? */
function isLiveGoalFile(p) { return RETEST_EXT_RE.test(p) && !ARCHIVE_RE.test(p); }

/**
 * The date a block-form re-test carries: the pass ENTRY it sits under, never a date mentioned in the
 * prose beside it.
 *
 * The first version of this took the nearest ISO date at or above the line and dated the live block
 * 2026-09-01 — a `<lastmod>` value quoted two sentences away — when its pass entry reads
 * `- **2026-09-03T04:45:23Z — Pass 70.**`. Two days wrong in the direction of looking older. A
 * re-test dated from whatever number happens to be nearby is worse than an undated one, because an
 * undated one is refused and a mis-dated one is aged and believed. So the date must OPEN its line.
 */
const ENTRY_DATE_RE = /^\s*(?:[-*]\s*)?\**\s*(\d{4}-\d{2}-\d{2})T/;
function blockDate(lines, idx) {
  for (let i = idx; i >= 0 && i > idx - 200; i--) {
    const m = lines[i].match(ENTRY_DATE_RE);
    if (m) return m[1];
  }
  return null;
}

/**
 * Every re-test the goals have written, keyed by ask id. Read-only, and it never looks at the store.
 * Returns { 'ASK-004': [{ file, line, date, result, form }] }.
 */
function retests(dir = DURATION_DIR) {
  const out = {};
  const add = (id, rec) => { (out[id] = out[id] || []).push(rec); };
  const walk = (d) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!ARCHIVE_RE.test(p + path.sep)) walk(p); continue; }
      if (!isLiveGoalFile(p)) continue;
      let text;
      try { text = fs.readFileSync(p, 'utf8'); } catch (_) { continue; }
      if (!/ASK-\d/.test(text)) continue;
      const lines = text.split(/\r?\n/);
      lines.forEach((raw, i) => {
        const mk = raw.match(RETEST_MARKER_RE);
        if (mk) { add(mk[1], { file: p, line: i + 1, date: mk[2], result: mk[3], form: 'marker' }); return; }
        if (!RETEST_BLOCK_RE.test(raw)) return;
        // Block form: split the paragraph at each bolded id and keep what that id's segment says.
        const hits = [...raw.matchAll(ASK_ID_RE)];
        hits.forEach((h, k) => {
          const from = h.index + h[0].length;
          const to = k + 1 < hits.length ? hits[k + 1].index : raw.length;
          const result = raw.slice(from, to).replace(/\s+/g, ' ').replace(/^[—–-]\s*/, '').trim();
          if (result) add(h[1], { file: p, line: i + 1, date: blockDate(lines, i), result, form: 'block',
            ageAtWriting: h[2] ? Number(h[2]) : null });
        });
      });
    }
  };
  walk(dir);
  return out;
}

/**
 * The provenance lines for one ask, or [] when it has none. Rendered so it cannot be misread as the
 * asker's words or as a Status: it is indented under a RE-TESTED label, carries path:line and a date,
 * and says plainly that the store is unchanged.
 */
function renderRetests(found, id, now = Date.now()) {
  const recs = found[id];
  if (!recs || !recs.length) return [];
  const L = [];
  for (const r of recs) {
    const age = r.date ? ageDays(r.date, now) : null;
    const when = r.date ? `${r.date}${age === null ? '' : ` (${age}d ago)`}` : 'undated';
    L.push(`        ↳ RE-TESTED by the goal, ${when} — the store is unchanged; this is evidence, not a ruling`);
    L.push(`          ${trimFact(r.result, 300)}`);
    L.push(`          per ${path.relative(os.homedir(), r.file).replace(/\\/g, '/')}:${r.line}`);
  }
  return L;
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
    const rt = retests();
    const carried = open.filter(a => rt[a.id]).length;
    L.push(`OPEN — oldest first${carried ? ` · ${carried} carry a goal's re-test (evidence, never a ruling)` : ''}`);
    for (const a of open) {
      L.push(`  ${a.id}  ${a.age === null ? ' age?' : String(a.age).padStart(3) + 'd'}  ${a.goal}`);
      L.push(`        ${trimFact(a.question, 400)}`);
      if (a.source) L.push(`        source: ${a.source}`);
      for (const l of renderRetests(rt, a.id, now)) L.push(l);
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
  retests, renderRetests, isLiveGoalFile,
  wiring, candidates, report, main,
  STORE, DURATION_DIR, MIN_FACT_CHARS, LINE_FACT_BUDGET, CANDIDATE_RE,
};
