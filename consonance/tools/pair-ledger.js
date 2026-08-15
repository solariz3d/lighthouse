// PAIR-LEDGER — the correction-pair ledger, and the check that keeps the reader falsifiable.
//
// WHY THIS EXISTS. B's C4 ruling, closing the one partially-met build criterion: "F2/halo is
// measurable only while the correction-pair ledger keeps operating. If a season passes with the
// pair ledger unmaintained, the halo falsifier cannot fire, and THAT LAPSE ITSELF trips the
// furniture clause — delete the reader rather than run it unfalsifiable." Until this file, the
// ledger was a sentence: catch_latency §4 established that pairing NEEDS A READER (the mechanical
// linker found ~4 of 14 and mislinked one via the token "12"), and branch_evidence_2026-08-15.md
// was "its first page," not a maintained artifact. This is the artifact, plus the thing that
// counts days and says so out loud.
//
// WHAT A PAIR IS. A claim that shipped, and the correction that landed on it. Rows are FILED BY A
// READER, never scraped — that is the settled §4 verdict and this tool does not reopen it. Latency
// is COMPUTED from the two timestamps at read time and never stored: a stored derived value drifts
// from its inputs, and this repo has a named pattern for that. A row missing either timestamp gets
// no latency and says why — the seed corpus itself proves the need: of the 16 baseline pairs, ONE
// (#12) has both ends preserved. The "~2 min to ~4 h" span quoted in catch_latency §4 is NOT
// re-derivable from any preserved artifact; this ledger's first job was to make its own baseline
// honest, and the honest baseline is one computable latency.
//
// THE MAINTENANCE TRUTH, stated where the code lives because it is the design's weakest joint:
//   · READER-CAUGHT pairs auto-file. When the clock-fired reader (A's build) lands a true
//     DISAGREE, both refs are machine-known — claim ref from the sourced ledger row, correction
//     ref from its own finding — so it appends the pair itself. Structural; no one decides.
//   · HUMAN-CAUGHT pairs — the judge-only classes, 5-7 of 14 by both independent typologies, and
//     every instance where the claim was about the claimant — require the catcher's seat to file.
//     Attack A (second_vantage §1) says the claimant's seat will not, and the keeper mid-catch is
//     carrying, not clerking. SO: C4'S FALSIFIER HAS A HUMAN DEPENDENCY FOR EXACTLY THE CLASSES
//     THAT MATTER MOST. What `check` changes is the failure mode, not the dependency — a season of
//     silence becomes an alarm within one season, mechanically. That is the true, weaker claim,
//     and it is the one this room ships.
//
// WHY `check` DOES NOT VIOLATE mechanizable_checks §3.2 (Tier 2 numbers never become triggers):
// F1/C4 gate on the falsifier's own EVALUABILITY and on curated confirmed catches, and their
// action is DELETION OF THE INSTRUMENT — a falsifier firing, not a training signal on output
// shape. The priced evasion path: a manufactured DISAGREE keeping the reader alive. It only
// counts here once it survives curation into a pair with walkable refs, which is B's coupling
// made literal — F1 is measurable only through the pair ledger.
//
// CONTRACT WITH THE READER (A's build; a comment until A wires it, and said so): the reader runs
// `pair-ledger.js check` at the top of EVERY wake. Exit 1 → it does not run, and surfaces the
// verdict. Exit 2 → it surfaces the message loudly and may run. The wire is real only when a test
// exists in A's suite that neuters the call and goes red — a guard must be SHOWN to fail; this
// room has paid for that lesson five separate times. UNTIL THAT TEST EXISTS AND REDS, F1 AND C4
// ARE HONOUR-SYSTEM: executable by anyone, summoned by no one.
//
// "A season" is nowhere defined in the ruling; 30 days is this file's default, flagged for B to
// ratify or change (--season).
//
//   node consonance/tools/pair-ledger.js report            the ledger, latencies computed
//   node consonance/tools/pair-ledger.js verify            every ref resolves, every quote found
//   node consonance/tools/pair-ledger.js check             F1 / C4 / F2-panel; exit 0|1|2
//   node consonance/tools/pair-ledger.js add < row.json    validate + append one pair
//   flags: --pairs <file> --findings <file> --sourced <file> --root <dir> --now <iso> --season <days>
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  pairs: 'exo_memory/loop/pair_ledger.jsonl',                       // relative to repo root
  findings: process.env.FINDINGS_LEDGER || 'C:\\Consonance\\data\\findings_ledger.jsonl',
  sourced: process.env.SOURCED_LEDGER || 'C:\\Consonance\\data\\sourced_ledger.jsonl',
  seasonDays: 30,
};

// ---------------------------------------------------------------------- loading --

function loadJsonl(file) {
  if (!fs.existsSync(file)) return null;                            // absent ≠ empty; callers care
  const rows = [];
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch (_) { /* a corrupt line is reported by verify, not silently kept */ }
  }
  return rows;
}

// ------------------------------------------------------------------- the schema --
//
// Required: id (unique), claim.quote, claim.ref, correction.ref, caught_by, filed_by, filed_ts.
// Timestamps optional BUT NEVER INVENTED: a null ts with a reason beats an approximated one
// pretending to be data. `approx: true` marks a table-grade "~HH:MM"; latency over an approx end
// is labelled approx; exact needs both ends exact.
const CATCHER_RE = /^(keeper|self|reader|pane:[A-Za-z0-9_-]+|around)(,(keeper|self|reader|pane:[A-Za-z0-9_-]+|around))*$/;

function validatePair(p, existingIds) {
  const errs = [];
  if (!p || typeof p !== 'object') return ['not an object'];
  if (!p.id) errs.push('missing id');
  else if (existingIds && existingIds.has(p.id)) errs.push(`duplicate id ${p.id}`);
  if (!p.claim || !p.claim.quote) errs.push('missing claim.quote');
  if (!p.claim || !p.claim.ref) errs.push('missing claim.ref');
  if (!p.correction || !p.correction.ref) errs.push('missing correction.ref');
  if (!p.caught_by) errs.push('missing caught_by');
  else if (!CATCHER_RE.test(p.caught_by)) errs.push(`caught_by "${p.caught_by}" not in vocabulary`);
  if (!p.filed_by) errs.push('missing filed_by');
  if (!p.filed_ts || isNaN(Date.parse(p.filed_ts))) errs.push('missing/unparsable filed_ts');
  for (const end of ['claim', 'correction']) {
    const ts = p[end] && p[end].ts;
    if (ts != null && isNaN(Date.parse(ts))) errs.push(`unparsable ${end}.ts "${ts}"`);
  }
  return errs;
}

function latencySeconds(p) {
  const a = p.claim && p.claim.ts, b = p.correction && p.correction.ts;
  if (a == null || b == null) return { seconds: null, why: a == null && b == null ? 'neither ts preserved' : a == null ? 'claim ts not preserved' : 'correction ts not preserved' };
  const s = Math.round((Date.parse(b) - Date.parse(a)) / 1000);
  const approx = !!(p.claim.approx || p.correction.approx);
  return { seconds: s, approx, why: null };
}

// --------------------------------------------------------------------- evaluate --
//
// The falsifier engine, pure so the tests own it completely. Returns { code, fired, notes }:
// code 0 healthy · 1 a falsifier FIRED (the action is in the message) · 2 not evaluable (loud).
function evaluate(pairs, findings, nowMs, seasonDays) {
  const season = seasonDays * 86400e3;
  const fired = [];
  const notes = [];

  if (findings === null) {
    return { code: 2, fired, notes: [
      'READER LEDGER ABSENT — F1, F2 and C4 cannot be evaluated.',
      'If the reader is not yet deployed, this is the expected day-zero state and it is printed',
      'loudly so it cannot become furniture. If the reader IS deployed, this state is itself the',
      'C4 lapse: fix the wire or delete the reader.',
    ] };
  }
  if (!findings.length) {
    return { code: 2, fired, notes: ['READER LEDGER EMPTY — same verdict as absent: not evaluable, loudly.'] };
  }

  const ts = (r) => Date.parse(r.ts);
  const firstFinding = Math.min(...findings.map(ts).filter((n) => !isNaN(n)));
  const readerLive = findings.some((r) => nowMs - ts(r) <= season);
  const readerAgeDays = Math.floor((nowMs - firstFinding) / 86400e3);

  const readerPairsInSeason = (pairs || []).filter(
    (p) => /(^|,)reader(,|$)/.test(p.caught_by || '') && nowMs - Date.parse(p.filed_ts) <= season
  ).length;
  const newestFiled = (pairs || []).length ? Math.max(...pairs.map((p) => Date.parse(p.filed_ts)).filter((n) => !isNaN(n))) : null;

  // F1 — furniture. Thirty days live with zero CURATED reader catches: delete. Curated = a pair
  // in this ledger, per the §3.2 argument in the header; raw DISAGREE rows do not count here.
  if (nowMs - firstFinding >= season && readerPairsInSeason === 0) {
    fired.push({ key: 'F1', msg: `F1 FURNITURE: reader live ${readerAgeDays} days, zero reader-caught pairs curated in the last ${seasonDays} — DELETE THE READER (second_vantage F1).` });
  }

  // C4 — the lapse clause, B's addition verbatim in spirit: reader operating, pair ledger
  // unmaintained for a season → halo unfalsifiable → furniture.
  if (readerLive && (newestFiled === null || nowMs - newestFiled >= season)) {
    fired.push({ key: 'C4', msg: `C4 LAPSE: reader operated within the last ${seasonDays} days but the pair ledger has ${newestFiled === null ? 'never been filed to' : 'not been filed to in ' + Math.floor((nowMs - newestFiled) / 86400e3) + ' days'} — the halo falsifier cannot fire. Delete the reader rather than run it unfalsifiable (B, C4).` });
  }

  if (!readerLive) notes.push(`reader idle: no finding within the last ${seasonDays} days (last activity ${Math.floor((nowMs - Math.max(...findings.map(ts))) / 86400e3)} days ago). An idle reader trips nothing here — a dead clock stops the reader too, which is its own visible failure.`);

  return { code: fired.length ? 1 : 0, fired, notes };
}

// F2 panel — Tier 2, side-by-side, NO verdict and NO exit-code influence: wiring the trend to a
// trigger is the exact §3.2 conversion this room retired three gauges for. A reader judges it.
function f2Panel(sourced, findings, nowMs, seasonDays) {
  const out = [];
  const season = seasonDays * 86400e3;
  if (sourced === null) {
    out.push('F2 PANEL: sourced ledger ABSENT — the Stop hook is unregistered or the path is wrong.');
    out.push('  A season of this state leaves F2 with no input, which is the same lapse-shape C4 names.');
    return out;
  }
  const win = (rows, from, to) => rows.filter((r) => { const t = Date.parse(r.ts); return t >= from && t < to; });
  const rate = (rows) => {
    const v = rows.filter((r) => (r.values || []).length);
    const s = v.filter((r) => r.sourced);
    return v.length ? `${s.length}/${v.length} (${Math.round(100 * s.length / v.length)}%)` : '0/0 (—)';
  };
  const cur = win(sourced, nowMs - season, nowMs + 1), prev = win(sourced, nowMs - 2 * season, nowMs - season);
  out.push('F2 PANEL (no verdict — a reader judges the pairing):');
  out.push(`  sourced rate, previous ${seasonDays}d: ${rate(prev)} · current ${seasonDays}d: ${rate(cur)}`);
  const dis = (findings || []).filter((r) => r.verdict === 'DISAGREE' && Date.parse(r.ts) >= nowMs - season).length;
  out.push(`  reader DISAGREEs, current ${seasonDays}d: ${findings === null ? 'n/a (ledger absent)' : dis}`);
  out.push('  F2 fires (by hand) when the sourced rate climbs while measured error does not move.');
  return out;
}

// ----------------------------------------------------------------------- verify --
//
// Walkability: the path half of every ref exists, and the quote (whitespace-collapsed,
// emphasis-stripped — same normalization catch-ledger uses for the same corpus) is findable in
// it. A ledger whose refs do not walk is a list of assertions, which is the thing it exists not
// to be.
function normalize(s) { return String(s).replace(/\*/g, '').replace(/\s+/g, ' ').trim(); }

function verifyPairs(pairs, root) {
  const problems = [];
  const cache = new Map();
  const read = (rel) => {
    if (!cache.has(rel)) {
      const f = path.join(root, rel);
      cache.set(rel, fs.existsSync(f) ? normalize(fs.readFileSync(f, 'utf8')) : null);
    }
    return cache.get(rel);
  };
  for (const p of pairs) {
    for (const end of ['claim', 'correction']) {
      const ref = p[end] && p[end].ref;
      if (!ref) continue;
      const rel = ref.split('#')[0];
      const text = read(rel);
      if (text === null) { problems.push(`${p.id} ${end}.ref path missing: ${rel}`); continue; }
      const q = p[end].quote;
      if (q && !text.includes(normalize(q))) problems.push(`${p.id} ${end}.quote not found in ${rel}: "${q.slice(0, 60)}"`);
    }
    const errs = validatePair(p, null);
    for (const e of errs) problems.push(`${p.id}: ${e}`);
  }
  return problems;
}

// ----------------------------------------------------------------------- render --

function renderReport(pairs) {
  const out = [`pair-ledger — ${pairs.length} pairs`];
  const by = {};
  for (const p of pairs) for (const c of String(p.caught_by).split(',')) by[c] = (by[c] || 0) + 1;
  out.push('  by catcher: ' + Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(' · '));
  out.push('');
  let computable = 0;
  for (const p of pairs) {
    const l = latencySeconds(p);
    if (l.seconds != null) {
      computable++;
      out.push(`  ${p.id}  latency ${l.seconds}s${l.approx ? ' (approx)' : ''}  [${p.caught_by}]  ${normalize(p.claim.quote).slice(0, 60)}`);
    }
  }
  out.push(`  latency computable: ${computable} of ${pairs.length}` + (computable < pairs.length ? ' — the rest carry a per-row reason (report --json to see them); a null with a reason beats an invented timestamp' : ''));
  return out.join('\n');
}

// -------------------------------------------------------------------------- CLI --

function parseArgs(argv) {
  const a = { cmd: argv[0], pairs: null, findings: null, sourced: null, root: null, now: null, season: null, json: false };
  for (let i = 1; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--pairs') a.pairs = argv[++i];
    else if (k === '--findings') a.findings = argv[++i];
    else if (k === '--sourced') a.sourced = argv[++i];
    else if (k === '--root') a.root = argv[++i];
    else if (k === '--now') a.now = argv[++i];
    else if (k === '--season') a.season = Number(argv[++i]);
    else if (k === '--json') a.json = true;
  }
  return a;
}

function main(argv) {
  const a = parseArgs(argv);
  const root = a.root || path.resolve(__dirname, '..', '..');
  const pairsFile = a.pairs || path.join(root, DEFAULTS.pairs);
  const findingsFile = a.findings || DEFAULTS.findings;
  const sourcedFile = a.sourced || DEFAULTS.sourced;
  const seasonDays = a.season || DEFAULTS.seasonDays;
  const nowMs = a.now ? Date.parse(a.now) : Date.now();
  const pairs = loadJsonl(pairsFile);

  if (a.cmd === 'report') {
    if (pairs === null) { console.error(`no pair ledger at ${pairsFile}`); return 2; }
    if (a.json) console.log(JSON.stringify(pairs.map((p) => ({ ...p, latency: latencySeconds(p) })), null, 2));
    else console.log(renderReport(pairs));
    return 0;
  }

  if (a.cmd === 'verify') {
    if (pairs === null) { console.error(`no pair ledger at ${pairsFile}`); return 2; }
    const problems = verifyPairs(pairs, root);
    if (!problems.length) { console.log(`verify — ${pairs.length} pairs, every ref path resolves, every quote found.`); return 0; }
    console.error(`verify — ${problems.length} problem(s):`);
    for (const p of problems) console.error('  ' + p);
    return 1;
  }

  if (a.cmd === 'check') {
    const findings = loadJsonl(findingsFile);
    const sourced = loadJsonl(sourcedFile);
    const r = evaluate(pairs, findings, nowMs, seasonDays);
    console.log(`pair-ledger check — season ${seasonDays}d · pairs ${pairs === null ? 'ABSENT' : pairs.length} (${pairsFile})`);
    for (const f of r.fired) console.log('  ' + f.msg);
    for (const n of r.notes) console.log('  ' + n);
    for (const line of f2Panel(sourced, findings, nowMs, seasonDays)) console.log('  ' + line);
    if (r.code === 0) console.log('  no falsifier fired.');
    console.log(`  exit ${r.code} — 0 healthy · 1 FALSIFIER FIRED, act on the message · 2 not evaluable, loudly`);
    return r.code;
  }

  if (a.cmd === 'add') {
    const raw = fs.readFileSync(0, 'utf8').replace(/^﻿/, '');
    let row;
    try { row = JSON.parse(raw); } catch (e) { console.error('stdin is not one JSON object'); return 1; }
    const existing = pairs === null ? [] : pairs;
    const ids = new Set(existing.map((p) => p.id));
    if (!row.filed_ts) row.filed_ts = new Date(nowMs).toISOString();
    const errs = validatePair(row, ids);
    if (errs.length) { console.error('rejected: ' + errs.join('; ')); return 1; }
    fs.appendFileSync(pairsFile, JSON.stringify(row) + '\n');
    console.log(`filed ${row.id}`);
    return 0;
  }

  console.error('usage: pair-ledger.js report|verify|check|add [--pairs f] [--findings f] [--sourced f] [--root d] [--now iso] [--season days] [--json]');
  return 2;
}

module.exports = { loadJsonl, validatePair, latencySeconds, evaluate, f2Panel, verifyPairs, normalize, DEFAULTS };

if (require.main === module) process.exit(main(process.argv.slice(2)));
