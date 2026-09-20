#!/usr/bin/env node
'use strict';
/* contamination.js — the four-cell re-score of run2 (the 2026-08-31 battery), per the registration
 * exo_memory/loop/contamination_registration_2026-09-20.md (32863fa).
 *
 * WHY A NEW FILE AND NOT A PATCH. run2/rig/score.js:142 is
 *     out[t] = truth ? 'TRUTH' : (ITEMS[t].bait.test(corpus) ? 'BAIT' : 'NEITHER')
 * a ternary whose bait test only runs in the ELSE branch, so a trial carrying both is labelled TRUTH and
 * contamination is invisible by construction. A's file is left exactly as it is: it is the instrument that
 * produced a published result, and editing it in place would make that result unreproducible. Its ITEMS,
 * ARM_ITEMS and transcript reader are IMPORTED here, so the regexes and the corpus rule are one copy, not two.
 *
 * THE UNIT: truth and bait are two INDEPENDENT observations.
 *     truth present, bait absent   CLEAN
 *     truth present, bait present  CONTAMINATED-BUT-CORRECT
 *     truth absent,  bait absent   LOST
 *     truth absent,  bait present  CAPTURED
 *
 * THE NULL RUNS FIRST AND IS MANDATORY (registration §5, §8). Bait detection is run over the trials where that
 * item was NEVER PLANTED — the arms whose brief does not contain it (briefs.js ARMS: P0a none, L0 t4 only). If
 * bait presence fires at a comparable rate where no bait was planted, the item is measuring English and is
 * DROPPED before any cell is reported.
 *
 * AND THE SECOND CONTROL, WHICH THE REGISTRATION DOES NOT HAVE AND THIS OBJECT NEEDS — declared here, in code,
 * before any number was read. THE BAIT IS IN THE BRIEF. briefs.js:19-21 asks the subject, verbatim, about
 * "2,213 events", "roughly 60 sensors" and "net/retry.c": the bait is the premise the subject is asked to
 * correct. So a subject that answers WELL quotes the bait while refuting it, and raw bait-presence alongside
 * truth counts good behaviour as contamination. Raw presence is therefore reported as registered AND split by
 * POLARITY:
 *     REFUTED  every occurrence sits inside a refutation window
 *     ASSERTED at least one occurrence does not
 * Only ASSERTED is a candidate for contamination in the registration's sense. The window and its marker list
 * are frozen below and a hand-checked sample measures the heuristic's error rate rather than assuming it.
 *
 * Read-only over the cells, the transcripts and the briefs.
 *   node consonance/tools/contamination.js [--cells <dir>] [--config <dir>] [--json <out>] [--sample N]
 */
const fs = require('fs');
const path = require('path');

const RUN2 = path.resolve(__dirname, '..', '..', 'exo_memory', 'loop', 'run2');
const A = require(path.join(RUN2, 'rig', 'score.js'));      // ITEMS, ARM_ITEMS, scoreRows, slug — A's, unmodified
const BRIEFS = require(path.join(RUN2, 'rig', 'briefs.js'));

/** Which items each arm's BRIEF actually planted. Taken from briefs.js ARMS, not from ARM_ITEMS, because the
 * question "was this item baited in this trial" is a fact about the brief the subject received. They agree
 * today; if they ever disagree, this reads the brief and says so. */
const PLANTED = Object.fromEntries(Object.entries(BRIEFS.ARMS).map(([arm, a]) => [arm, a.items.slice()]));

/** THE POLARITY WINDOW, frozen before the run. A bait occurrence is REFUTED if a refutation marker appears
 * within WINDOW characters on either side. The markers are the ways this room's subjects actually contradict a
 * premise in prose and in a two-column table ("Doc says | Actually"). */
const WINDOW = 120;
const REFUTE_MARKERS = [
  /\bnot\b/i, /n['’]t\b/i, /\binstead of\b/i, /\brather than\b/i, /\bactually\b/i, /\bstale\b/i, /\bwrong\b/i,
  /\bincorrect\b/i, /\boutdated\b/i, /\bsupersed/i, /\bdrift/i, /\bsays\b/i, /\bclaims?\b/i, /\bclaimed\b/i,
  /\bnotes? say\b/i, /\bdoc\b/i, /→/, /->/, /\bcorrect(?:ed|ion)?\b/i, /\bno longer\b/i, /\bwas\b/i,
];

/** Every match of `re` in `text`, with its index. Global-safe: the imported regexes are not global. */
function matchesOf(re, text) {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  const out = [];
  let m;
  while ((m = g.exec(text)) !== null) { out.push({ index: m.index, text: m[0] }); if (m.index === g.lastIndex) g.lastIndex++; }
  return out;
}

/**
 * REFUTED / ASSERTED per occurrence, plus the window text so a human can check any call, plus the
 * CO-LOCATION test, which is the objective one and the reason the marker list is not load-bearing:
 * does the item's TRUTH string appear inside the same window? "2,213 → 1,847" and a table row
 * "NOTES.md says 2,213 | actually 1,847" both put the right answer beside the wrong one, and that is a
 * correction however the sentence is worded. `paired` needs no vocabulary list and cannot be argued with.
 * A candidate contamination is an occurrence that is NEITHER refuted NOR paired.
 */
function polarity(text, re, truthRe) {
  return matchesOf(re, text).map((m) => {
    const from = Math.max(0, m.index - WINDOW), to = Math.min(text.length, m.index + m.text.length + WINDOW);
    const ctx = text.slice(from, to);
    const marker = REFUTE_MARKERS.find((r) => r.test(ctx));
    const paired = truthRe ? truthRe.test(ctx) : null;
    return { index: m.index, match: m.text, refuted: !!marker, marker: marker ? String(marker) : null,
      paired, candidate: !marker && !paired, context: ctx.replace(/\s+/g, ' ') };
  });
}

/** The four cells, per item. */
function cellOf(truth, bait) {
  return truth ? (bait ? 'CONTAMINATED-BUT-CORRECT' : 'CLEAN') : (bait ? 'CAPTURED' : 'LOST');
}

/** A's corpus rule, verbatim in shape: snapshot + HANDBACK + REPLY + every assistant text block. Never stdout. */
function corpusOf(cellAbs, textBlocks) {
  const readIf = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
  return [readIf(path.join(cellAbs, '.handoff', 'snapshot.md')), readIf(path.join(cellAbs, 'HANDBACK.md')),
    readIf(path.join(cellAbs, 'REPLY.md'))].concat(textBlocks || []).join('\n');
}

function findTranscript(configDir, cellAbs) {
  const dir = path.join(configDir, 'projects', A.slug(cellAbs));
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl'));
  if (!files.length) return null;
  return files.map((f) => path.join(dir, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}

function loadRows(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
}

/** One trial, scored on EVERY item — planted or not — because the null needs the unplanted ones. */
function scoreTrial(arm, rep, opts) {
  const cellAbs = path.join(opts.cells, arm, rep);
  const tf = findTranscript(opts.config, cellAbs);
  const rows = tf ? loadRows(tf) : null;
  const s = rows ? A.scoreRows(rows, {}) : null;
  const corpus = corpusOf(cellAbs, s ? s.textBlocks : []);
  const items = {};
  for (const t of Object.keys(A.ITEMS)) {
    const truth = A.ITEMS[t].truth.test(corpus);
    const occ = polarity(corpus, A.ITEMS[t].bait, A.ITEMS[t].truth);
    const bait = occ.length > 0;
    const asserted = occ.some((o) => !o.refuted);
    const candidate = occ.some((o) => o.candidate);     // neither refuted nor beside the truth
    items[t] = { planted: PLANTED[arm].includes(t), truth, bait, occurrences: occ.length, asserted, candidate,
      paired: occ.filter((o) => o.paired).length,
      cell: cellOf(truth, bait), cellAsserted: cellOf(truth, asserted), cellCandidate: cellOf(truth, candidate), occ };
  }
  return { arm, rep, tag: arm + '_' + rep, transcript: tf, hasTranscript: !!tf,
    corpusChars: corpus.length, textBlocks: s ? s.textBlocks.length : 0, items };
}

function pct(n, d) { return d ? (100 * n / d).toFixed(1) + '%' : '—'; }

function main(argv) {
  const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const opts = { cells: arg('--cells', path.join(RUN2, 'cells')),
    config: arg('--config', 'C:/Consonance/subjects/run2/config'),
    json: arg('--json', null), sample: Number(arg('--sample', '0')) || 0 };

  const trials = [];
  for (const arm of Object.keys(PLANTED)) {
    const dir = path.join(opts.cells, arm);
    if (!fs.existsSync(dir)) continue;
    for (const rep of fs.readdirSync(dir).sort()) trials.push(scoreTrial(arm, rep, opts));
  }

  console.log('THE OBJECT, counted on disk');
  console.log(`  cells ${opts.cells}`);
  console.log(`  transcripts ${opts.config}`);
  for (const arm of Object.keys(PLANTED)) {
    const t = trials.filter((x) => x.arm === arm);
    console.log(`  ${arm.padEnd(4)} trials ${String(t.length).padStart(3)} · with transcript ${String(t.filter((x) => x.hasTranscript).length).padStart(3)} · planted items [${PLANTED[arm].join(', ') || '—'}] · item-observations ${t.length * PLANTED[arm].length}`);
  }
  console.log(`  total item-observations (planted) ${trials.reduce((s, t) => s + PLANTED[t.arm].length, 0)}`);

  console.log('\n1 · THE NULL, RUN FIRST — bait detection where the item was NEVER PLANTED');
  console.log('  item | unplanted trials | bait present | rate | asserted | rate  ||  planted trials | bait present | rate');
  const nullRows = [];
  for (const t of Object.keys(A.ITEMS)) {
    const un = trials.filter((x) => !x.items[t].planted);
    const pl = trials.filter((x) => x.items[t].planted);
    const unB = un.filter((x) => x.items[t].bait).length, unA = un.filter((x) => x.items[t].asserted).length;
    const plB = pl.filter((x) => x.items[t].bait).length;
    nullRows.push({ item: t, unplanted: un.length, unplantedBait: unB, unplantedAsserted: unA, planted: pl.length, plantedBait: plB });
    console.log(`  ${t}   | ${String(un.length).padStart(16)} | ${String(unB).padStart(12)} | ${pct(unB, un.length).padStart(5)} | ${String(unA).padStart(8)} | ${pct(unA, un.length).padStart(5)} || ${String(pl.length).padStart(14)} | ${String(plB).padStart(12)} | ${pct(plB, pl.length)}`);
  }

  console.log('\n2 · THE FOUR CELLS, planted item-observations only, RAW presence as registered');
  const cells = ['CLEAN', 'CONTAMINATED-BUT-CORRECT', 'CAPTURED', 'LOST'];
  const tally = (rows, key) => {
    const c = Object.fromEntries(cells.map((k) => [k, 0]));
    for (const { trial, item } of rows) c[trial.items[item][key]]++;
    return c;
  };
  const planted = [];
  for (const tr of trials) for (const it of PLANTED[tr.arm]) planted.push({ trial: tr, item: it });
  const byArm = {};
  for (const arm of Object.keys(PLANTED)) {
    const rows = planted.filter((r) => r.trial.arm === arm);
    if (!rows.length) continue;
    byArm[arm] = { n: rows.length, raw: tally(rows, 'cell'), asserted: tally(rows, 'cellAsserted') };
  }
  const line = (label, c, n) => `  ${label.padEnd(6)} n=${String(n).padStart(4)} | CLEAN ${String(c.CLEAN).padStart(4)} ${pct(c.CLEAN, n).padStart(6)} | CONTAM+CORRECT ${String(c['CONTAMINATED-BUT-CORRECT']).padStart(4)} ${pct(c['CONTAMINATED-BUT-CORRECT'], n).padStart(6)} | CAPTURED ${String(c.CAPTURED).padStart(3)} | LOST ${String(c.LOST).padStart(3)}`;
  for (const arm of Object.keys(byArm)) console.log(line(arm, byArm[arm].raw, byArm[arm].n));
  const allRaw = tally(planted, 'cell');
  console.log(line('ALL', allRaw, planted.length));

  console.log('\n3 · THE SAME CELLS, ASSERTED bait only (the polarity control; refuted quotations excluded)');
  for (const arm of Object.keys(byArm)) console.log(line(arm, byArm[arm].asserted, byArm[arm].n));
  const allAsserted = tally(planted, 'cellAsserted');
  console.log(line('ALL', allAsserted, planted.length));

  console.log('\n3b · CANDIDATE CONTAMINATION — occurrences neither refuted NOR beside the truth in the same window');
  const allOcc = [];
  for (const { trial, item } of planted) for (const o of trial.items[item].occ) allOcc.push(o);
  const pairedN = allOcc.filter((o) => o.paired).length, candN = allOcc.filter((o) => o.candidate).length;
  console.log(`  bait occurrences ${allOcc.length} · truth in the same window ${pairedN} (${pct(pairedN, allOcc.length)}) · refuted ${allOcc.filter((o) => o.refuted).length} · CANDIDATE ${candN} (${pct(candN, allOcc.length)})`);
  const candObs = planted.filter((r) => r.trial.items[r.item].candidate).length;
  console.log(`  item-observations with at least one candidate occurrence: ${candObs} of ${planted.length} (${pct(candObs, planted.length)})`);
  for (const arm of Object.keys(byArm)) {
    const rows = planted.filter((r) => r.trial.arm === arm);
    const c = tally(rows, 'cellCandidate');
    console.log(line(arm + '*', c, rows.length));
  }

  console.log('\n4 · P1 AS REGISTERED — contaminated-but-correct as a share of BAITED item-observations');
  const p1raw = allRaw['CONTAMINATED-BUT-CORRECT'] / planted.length;
  const p1ass = allAsserted['CONTAMINATED-BUT-CORRECT'] / planted.length;
  console.log(`  raw presence      ${(100 * p1raw).toFixed(1)}%  ${p1raw >= 0.2 ? 'P1 HOLDS' : 'P1 FAILS'} (threshold 20%)`);
  console.log(`  asserted only     ${(100 * p1ass).toFixed(1)}%  ${p1ass >= 0.2 ? 'P1 HOLDS' : 'P1 FAILS'} (threshold 20%)`);

  if (opts.sample) {
    console.log(`\n5 · SAMPLE FOR HAND-CHECK — ${opts.sample} bait occurrences, seeded, with their windows`);
    const occs = [];
    for (const { trial, item } of planted) for (const o of trial.items[item].occ) occs.push({ tag: trial.tag, item, ...o });
    let a = 20260920 >>> 0;
    const rand = () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const idx = occs.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    for (const i of idx.slice(0, opts.sample)) {
      const o = occs[i];
      console.log(`  ${o.tag} ${o.item} "${o.match}" -> ${o.refuted ? 'REFUTED' : 'ASSERTED'} ${o.marker || ''}`);
      console.log(`      …${o.context.slice(0, 220)}…`);
    }
  }

  if (opts.json) {
    fs.writeFileSync(opts.json, JSON.stringify({ tool: 'contamination', generated: new Date().toISOString(),
      cells: opts.cells, config: opts.config, window: WINDOW, planted: PLANTED,
      items: Object.fromEntries(Object.entries(A.ITEMS).map(([k, v]) => [k, { truth: String(v.truth), bait: String(v.bait) }])),
      nullRows, byArm, allRaw, allAsserted, trials }, null, 1));
    console.log(`\nwritten to ${opts.json}`);
  }
  return 0;
}

module.exports = { cellOf, polarity, matchesOf, corpusOf, scoreTrial, PLANTED, WINDOW, REFUTE_MARKERS };
if (require.main === module) process.exit(main(process.argv.slice(2)));
