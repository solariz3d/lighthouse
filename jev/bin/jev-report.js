#!/usr/bin/env node
'use strict';
/* jev/bin/jev-report.js — a summary over Jev's ledger (D123, standalone Jev batch 2, pane C; the design is
 * exo_memory/loop/jev_standalone_design_2026-09-23.md, the plan loop/jev_batch2_plan_2026-09-23.md).
 *
 *   node jev/bin/jev-report.js [--json] [--labels <file>]
 *
 * WHAT IT COUNTS, from <ledgerDir> (ledgerDir from lib/config.js load(), exactly as the judge finds it):
 *   · turns JUDGED: the rows of jev.jsonl, one per turn. A turn is its session_id plus its turn key, which is
 *     `prompt_id` (batch 2's rows) or `turn_uuid` (batch 1's rows); both shapes are read, and a row carrying both matches
 *     either. A turn written twice counts once and the repeat is reported.
 *   · turns MARKED: rows whose verdict is "drift". A mark means WORTH A SECOND LOOK — the design's measured claim — never
 *     that Jev "caught" anything.
 *   · REFUSED and FAILED calls: jev.log's lines, counted by their `outcome`. A missing jev.log is said to be missing.
 *   · CONFIRMED, only when a labels file exists (default <ledgerDir>/labels.jsonl, or --labels). Without one the report
 *     says "unconfirmed" and prints no precision. A label row is { session_id, prompt_id | turn_uuid, label }; "confirmed"
 *     is a MARKED turn a label calls "drift", out of the marked turns that have a label. (No labels format existed
 *     before this file; this is the smallest one that the T-J1 labels can be written into — named in the hand-back.)
 *
 * NO TURN TEXT, EVER. The ledger carries no turn text by contract, but its `reason` field is Jev's own sentence and can
 * quote the turn, a jev.log `why` can name a path, and a corrupt line can hold anything. So this file reads only
 * verdicts, keys and outcomes and prints only COUNTS and the ledger directory: no reason, no why, no note, no row, and
 * never the bytes of a line it could not parse. A corrupt line is skipped and counted; nothing here crashes on one.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const LEDGER = 'jev.jsonl';
const LOG = 'jev.log';
const LABELS = 'labels.jsonl';
const VERDICTS = ['clean', 'drift', 'abstain'];

/** The lines of a file, or null when it does not exist. Any other read error is loud. */
function linesOf(file) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
  return raw.split(/\r?\n/).filter((l) => l.trim() !== '');
}
const parse = (line) => { try { const o = JSON.parse(line); return o && typeof o === 'object' && !Array.isArray(o) ? o : null; } catch { return null; } };
const str = (v) => (typeof v === 'string' && v !== '' ? v : null);
/** The keys a row or label can be found under: session + prompt_id, session + turn_uuid. */
const keysOf = (o) => {
  const sid = str(o.session_id);
  if (!sid) return [];
  return [str(o.prompt_id) && `${sid}:p:${o.prompt_id}`, str(o.turn_uuid) && `${sid}:t:${o.turn_uuid}`].filter(Boolean);
};

function summarize({ ledgerDir, labelsPath } = {}) {
  if (!str(ledgerDir)) throw new Error('jev report: no ledgerDir');
  const s = {
    ledgerDir, ledgerFound: false, judged: 0, marked: 0, byVerdict: { clean: 0, drift: 0, abstain: 0, other: 0 },
    shapes: { turn_uuid: 0, prompt_id: 0 }, duplicates: 0, corruptLedgerLines: 0,
    logFound: false, failures: {}, corruptLogLines: 0, confirmation: null,
  };

  // THE LEDGER — one canonical turn per key; every alias of a turn points at it.
  const alias = new Map();          // key -> turn index
  const turns = [];                 // { verdict }
  const rows = linesOf(path.join(ledgerDir, LEDGER));
  if (rows) {
    s.ledgerFound = true;
    for (const line of rows) {
      const o = parse(line);
      const keys = o ? keysOf(o) : [];
      if (!o || !str(o.verdict) || !keys.length) { s.corruptLedgerLines++; continue; }
      const seen = keys.map((k) => alias.get(k)).find((i) => i !== undefined);
      if (seen !== undefined) { s.duplicates++; for (const k of keys) alias.set(k, seen); continue; }
      const i = turns.push({ verdict: o.verdict }) - 1;
      for (const k of keys) alias.set(k, i);
      s.shapes[str(o.prompt_id) ? 'prompt_id' : 'turn_uuid']++;
      s.byVerdict[VERDICTS.includes(o.verdict) ? o.verdict : 'other']++;
    }
  }
  s.judged = turns.length;
  s.marked = turns.filter((t) => t.verdict === 'drift').length;

  // THE LOG — counted by outcome, never by its words.
  const log = linesOf(path.join(ledgerDir, LOG));
  if (log) {
    s.logFound = true;
    for (const line of log) {
      const o = parse(line);
      if (!o || !str(o.outcome)) { s.corruptLogLines++; continue; }
      s.failures[o.outcome] = (s.failures[o.outcome] || 0) + 1;
    }
  }

  // THE LABELS — only if a file exists; the last label for a turn wins.
  const labelsFile = str(labelsPath) || path.join(ledgerDir, LABELS);
  const labelLines = linesOf(labelsFile);
  if (!labelLines) {
    s.confirmation = { status: 'unconfirmed', labelsFile };
  } else {
    const byTurn = new Map();
    let corrupt = 0, unmatched = 0;
    for (const line of labelLines) {
      const o = parse(line);
      const keys = o ? keysOf(o) : [];
      if (!o || !str(o.label) || !keys.length) { corrupt++; continue; }
      const i = keys.map((k) => alias.get(k)).find((x) => x !== undefined);
      if (i === undefined) { unmatched++; continue; }
      byTurn.set(i, o.label);
    }
    const marked = turns.map((t, i) => i).filter((i) => turns[i].verdict === 'drift');
    const labelled = marked.filter((i) => byTurn.has(i));
    s.confirmation = {
      status: 'labelled', labelsFile,
      confirmed: labelled.filter((i) => byTurn.get(i) === 'drift').length,
      labelledMarked: labelled.length, unlabelledMarked: marked.length - labelled.length,
      unmatchedLabels: unmatched, corruptLabelLines: corrupt,
    };
  }
  return s;
}

/** The summary as JSON-safe data. It holds counts and paths only, so it is the summary itself. */
const toJSON = (s) => s;

function render(s) {
  const out = [`jev report — ${s.ledgerDir}`];
  if (!s.ledgerFound) {
    out.push('  no ledger yet: jev.jsonl does not exist, so no turn has been judged here');
  } else {
    const v = s.byVerdict;
    out.push(`  turns judged: ${s.judged} (clean ${v.clean} · drift ${v.drift} · abstain ${v.abstain}${v.other ? ` · other ${v.other}` : ''})`);
    out.push(`  turns marked: ${s.marked} — worth a second look, not a verdict on the turn`);
    out.push(`  row shapes: ${s.shapes.turn_uuid} keyed by turn_uuid · ${s.shapes.prompt_id} keyed by prompt_id`);
    if (s.duplicates) out.push(`  ${s.duplicates} repeated row(s) for an already-judged turn, counted once`);
  }
  if (!s.logFound) {
    out.push('  refused / failed: no jev.log (nothing has been logged here, or the log is elsewhere)');
  } else {
    const f = Object.entries(s.failures).sort(([a], [b]) => a.localeCompare(b));
    out.push(`  refused / failed (jev.log): ${f.length ? f.map(([k, n]) => `${k} ${n}`).join(' · ') : 'none'}`);
  }
  const c = s.confirmation;
  if (c.status === 'unconfirmed') {
    out.push(`  confirmation: unconfirmed — no labels file at ${c.labelsFile}; a mark is a hint until a person labels it`);
  } else {
    out.push(c.labelledMarked
      ? `  confirmed: ${c.confirmed} of ${c.labelledMarked} labelled marked turns (labels: ${c.labelsFile})`
      : `  confirmation: no marked turn has a label yet (labels: ${c.labelsFile})`);
    if (c.unlabelledMarked) out.push(`  ${c.unlabelledMarked} marked turn(s) have no label`);
    if (c.unmatchedLabels) out.push(`  ${c.unmatchedLabels} label(s) name a turn not in this ledger`);
    if (c.corruptLabelLines) out.push(`  ${c.corruptLabelLines} corrupt label line(s) skipped`);
  }
  if (s.corruptLedgerLines) out.push(`  ${s.corruptLedgerLines} corrupt ledger line(s) skipped`);
  if (s.corruptLogLines) out.push(`  ${s.corruptLogLines} corrupt jev.log line(s) skipped`);
  return out.join('\n');
}

function main(argv = process.argv.slice(2)) {
  let json = false, labelsPath = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--json') json = true;
    else if (argv[i] === '--labels' && argv[i + 1]) labelsPath = path.resolve(argv[++i]);
    else { process.stderr.write(`jev report: unknown argument ${JSON.stringify(argv[i])}\nusage: jev-report [--json] [--labels <file>]\n`); return 2; }
  }
  let cfg;
  try { cfg = require('../lib/config.js').load({ env: process.env, home: os.homedir(), cwd: process.cwd() }); } catch (e) {
    process.stderr.write(`${e.message}\n`);
    return 2;
  }
  const s = summarize({ ledgerDir: cfg.ledgerDir, labelsPath });
  process.stdout.write((json ? JSON.stringify(toJSON(s), null, 2) : render(s)) + '\n');
  return 0;
}

if (require.main === module) process.exitCode = main();

module.exports = { summarize, render, toJSON, main, LEDGER, LOG, LABELS };
