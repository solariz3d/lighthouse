#!/usr/bin/env node
// carrier-drift.js — a withdrawn claim whose CARRIER still asserts it goes RED here.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// THE DISEASE, measured twice, both times after the fact.
//
//   2026-08-16  A pane withdrew "the keeper is the only DECORRELATED reader" IN FULL
//               (journal/2026-08-16.md:722-726) as the asymmetric-application error.
//   2026-08-23  Seven days later the withdrawn form was still live in BOOT.md, TRAINING.md:133
//               and five other files — and the chair RE-ASSERTED it that night at
//               loop/lap_2026-08-23.md:22-23, inside a document written to be verbatim and
//               careful. The correction existed, was unambiguous, and did not propagate.
//
//   2026-07-12  The same shape, five weeks long: e5521a0 retired the diving vocabulary across
//               README, SEED and the journal coda and MISSED BOOT.md, so the room went on
//               teaching every waking instance the metaphor its keeper had outgrown.
//
// Both are one failure: the correcting commit was fine. The files it never touched were not.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY THIS IS NOT corrections-gate.js, WHICH ALREADY EXISTS AND IS NOT THIS.
//
// corrections-gate reads the DIFF of a correcting commit and asks whether the correction landed
// on its target or beside it. It is commit-time and it is narrow by design (muscle_map.md only).
// It is structurally incapable of seeing this disease: the failure is in files the correcting
// commit does not appear in, so there is no diff to read. This tool is STATE-time — given a
// withdrawal that already happened, does anything live still assert it TODAY. Sensor, trigger,
// and now propagation: three files, on purpose.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY IT DOES NOT INFER, AND WHY THAT COSTS A HAND-MAINTAINED CENSUS.
//
// Three detectors in this repo have died on one rock: SUPPORT CANNOT BE INFERRED FROM POSITION.
// A line containing the withdrawn wording may be asserting it, quoting it in order to withdraw
// it, listing it as a known carrier, or printing it inside a grep command. All four exist in
// this repo right now. No amount of blockquote-sniffing separates them, and a tool that guessed
// would be wrong in the direction that reads clean.
//
// So this follows cite-check's rule: it does not infer, it REQUIRES. Every occurrence of a
// registered withdrawn wording, in every carrier, must be ACCOUNTED FOR in the registry with a
// kind and a reason. An occurrence nobody has accounted for is RED. That is the whole mechanism,
// and it is the only shape that catches the case that actually happened — a re-assertion typed
// into a file that already carried a correction notice.
//
// A FILE-SCOPED RULE ("the file contains a WITHDRAWN marker, therefore it is fine") was written
// first and thrown away for exactly that reason: lap_2026-08-23.md carries a marker AND carried
// the re-assertion, and a file-scoped rule is green on it forever.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY MATCHING IS WHITESPACE-COLLAPSED, AND THIS ONE IS A MEASUREMENT.
//
// The room registered its own propagation grep at loop/handoff_2026-08-23.md:114 —
//
//     grep -rl "only decorrelated" exo_memory/ | grep -v journal/
//
// Run against the tree as it stood before the fix, it returns FOUR files and does NOT return
// loop/lap_2026-08-23.md — the re-assertion the whole pass was named after:
//
//     git grep -l "only decorrelated" 21d5453^ -- exo_memory/ | grep -v journal/
//
// The phrase there is "the keeper remains the only\ngenuinely decorrelated reader": it wraps a
// line break and takes an extra word. A line-based fixed-string grep cannot see it. The
// instrument the room registered to find carriers would not have found the carrier that
// motivated registering it. So matching here runs over whitespace-collapsed text and maps the
// offset back to a source line for reporting.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// TRACES ARE LEFT ALONE, per ae5ff99's rule, which is maintenance law 2 stated operationally:
//
//   TRACES    journals, dream records, the attic. A journal saying the wrong thing in June is a
//             TRUE RECORD of what was believed in June. Rewriting it is the telephone game.
//   CARRIERS  BOOT, SEED, TRAINING, briefs, cards, live loop and librarian docs. Used, not
//             merely recorded. One teaching a withdrawn claim KEEPS TEACHING IT, at every wake.
//
// The split is a list of path prefixes below, and the count of skipped traces prints on every
// run — a corpus rule that silently ate half the repo would look exactly like a green tree.
//
// Usage:
//   node consonance/tools/carrier-drift.js            report; exit 1 if RED
//   node consonance/tools/carrier-drift.js --quiet     one line
//   node consonance/tools/carrier-drift.js --census    print proposed registry sites for every
//                                                      occurrence found, for a HUMAN to classify
'use strict';

const fs = require('fs');
const path = require('path');

const REPO = process.env.CARRIER_DRIFT_ROOT || path.resolve(__dirname, '..', '..');
const REGISTRY = process.env.CARRIER_DRIFT_REGISTRY ||
  path.join(__dirname, 'carrier-drift.registry.json');

// Directories never walked at all. Same set js-suite skips, for the same reason.
const SKIP_DIRS = new Set(['.git', 'node_modules', 'target', 'gen', '__pycache__']);

// Path prefixes (repo-relative, forward slashes) whose contents are TRACES.
const TRACE_PREFIXES = [
  'exo_memory/journal/',
  'dreams/',
  'attic/',
  'dev/one-shot/',   // landed unmodified as a trace, by its own header
];

// Anchors are grown from the match outward until they are UNIQUE in the file, and no further.
// Two failure directions and both are real: too short and one entry silently excuses a second
// occurrence it never looked at (AMBIGUOUS-SITE catches that); too long and an unrelated edit two
// sentences away turns a live entry STALE and reads as a defect. Shortest-unique is the only
// point that is not choosing one of them by accident. ANCHOR_PAD is the starting window and
// ANCHOR_MAX the point at which uniqueness is given up on and reported.
const ANCHOR_PAD = 24;
const ANCHOR_MAX = 200;

// ── collapse, with a map back to source lines ────────────────────────────────────────────
// Every whitespace run becomes one space. lineOf[i] is the 1-based source line the collapsed
// character at i came from; for a space standing in for a run, the line the run STARTED on.
function collapse(text) {
  const src = String(text).split('\r\n').join('\n');
  let out = '';
  const lineOf = [];
  let line = 1;
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\f' || c === '\v') {
      const at = line;
      while (i < src.length && /\s/.test(src[i])) {
        if (src[i] === '\n') line++;
        i++;
      }
      if (out.length) { out += ' '; lineOf.push(at); }
      continue;
    }
    out += c;
    lineOf.push(line);
    i++;
  }
  return { text: out, lineOf };
}

// ── corpus ───────────────────────────────────────────────────────────────────────────────
function walk(dir, root, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, root, out);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      out.push(path.relative(root, p).split(path.sep).join('/'));
    }
  }
  return out;
}

function corpus(root) {
  const all = walk(root, root, []).sort();
  const traces = all.filter((f) => TRACE_PREFIXES.some((p) => f.startsWith(p)));
  const carriers = all.filter((f) => !TRACE_PREFIXES.some((p) => f.startsWith(p)));
  return { all, traces, carriers };
}

// ── the scan ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {{root?:string, registry?:object}} opts
 * @returns {{red:boolean, findings:Array, withdrawals:Array, counts:object}}
 */
function scan(opts = {}) {
  const root = opts.root || REPO;
  const reg = opts.registry || JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  const { traces, carriers } = corpus(root);

  const findings = [];
  const perWithdrawal = [];

  // A registry with no withdrawals in it is not a green tree, it is an unarmed instrument. Same
  // rule js-suite applies to a green run over zero tests.
  if (!Array.isArray(reg.withdrawals) || reg.withdrawals.length === 0) {
    findings.push({
      kind: 'EMPTY-REGISTRY', file: path.relative(root, REGISTRY), line: 0,
      detail: 'no withdrawals registered — this tool is armed by its registry and an empty one ' +
              'reports green over everything it cannot see',
    });
    return { red: true, findings, withdrawals: [], counts: { carriers: carriers.length, traces: traces.length } };
  }

  // Read each carrier once, not once per withdrawal.
  const collapsed = new Map();
  for (const rel of carriers) {
    let raw;
    try { raw = fs.readFileSync(path.join(root, rel), 'utf8'); } catch { continue; }
    collapsed.set(rel, collapse(raw));
  }

  for (const w of reg.withdrawals) {
    const pat = new RegExp(w.pattern, 'gi');
    const markerRe = new RegExp(w.marker, 'i');
    const sitesByFile = new Map();
    for (const s of w.sites || []) {
      if (!sitesByFile.has(s.file)) sitesByFile.set(s.file, []);
      sitesByFile.get(s.file).push(s);
    }

    // Registry self-check: an anchor that does not itself contain the withdrawn wording cannot
    // be covering an occurrence of it, and would silently excuse the file it names.
    for (const s of w.sites || []) {
      if (!new RegExp(w.pattern, 'i').test(s.anchor)) {
        findings.push({
          w: w.id, kind: 'BAD-ANCHOR', file: s.file, line: 0,
          detail: 'registry anchor does not contain the withdrawn wording, so it excuses nothing: ' +
                  JSON.stringify(s.anchor.slice(0, 60)),
        });
      }
      if (s.kind === 'acknowledged' && !s.see) {
        findings.push({
          w: w.id, kind: 'BAD-ACK', file: s.file, line: 0,
          detail: 'an acknowledged site must name where the correction lives ("see"); an ' +
                  'exemption with no destination is a silencer',
        });
      }
    }

    let occurrences = 0;
    let accounted = 0;

    for (const [rel, doc] of collapsed) {
      pat.lastIndex = 0;
      const hits = [];
      let m;
      while ((m = pat.exec(doc.text)) !== null) {
        hits.push({ offset: m.index, len: m[0].length, line: doc.lineOf[m.index] || 0 });
        if (m.index === pat.lastIndex) pat.lastIndex++;   // zero-width guard
      }

      const sites = sitesByFile.get(rel) || [];
      const spans = [];
      for (const s of sites) {
        const idx = doc.text.indexOf(s.anchor);
        if (idx === -1) {
          findings.push({
            w: w.id, kind: 'STALE-SITE', file: rel, line: 0,
            detail: 'registered anchor no longer appears in the file. Two readings, one action: ' +
                    'either the wording was properly removed and this entry should be DELETED, ' +
                    'or the surrounding text moved and it should be RE-ANCHORED. Until one of ' +
                    'those happens the entry excuses nothing: ' + JSON.stringify(s.anchor.slice(0, 60)),
          });
          continue;
        }
        if (doc.text.indexOf(s.anchor, idx + 1) !== -1) {
          findings.push({
            w: w.id, kind: 'AMBIGUOUS-SITE', file: rel, line: doc.lineOf[idx] || 0,
            detail: 'registered anchor appears more than once, so it cannot say WHICH occurrence ' +
                    'it accounts for — lengthen it: ' + JSON.stringify(s.anchor.slice(0, 60)),
          });
          continue;
        }
        // `marked` and `acknowledged` both rest on the file carrying the correction. `marked`
        // means the strike sits beside the claim; `acknowledged` means the claim is deliberately
        // left standing because the correction lives elsewhere IN THE SAME FILE (BOOT's Previous:
        // pointer, kept as a dated trace, corrected in the amendment above it). Both are lies if
        // the marker is gone, so both are checked. `withdrawal` and `mention` are not: the first
        // IS the correction text and the second asserts nothing.
        if ((s.kind === 'marked' || s.kind === 'acknowledged') && !markerRe.test(doc.text)) {
          findings.push({
            w: w.id, kind: 'UNMARKED-CARRIER', file: rel, line: doc.lineOf[idx] || 0,
            detail: 'this carrier states the withdrawn claim and the file carries no withdrawal ' +
                    'marker — the propagation failure, live',
          });
        }
        spans.push({ from: idx, to: idx + s.anchor.length, site: s });
      }

      for (const h of hits) {
        occurrences++;
        const cover = spans.find((sp) => h.offset >= sp.from && h.offset < sp.to);
        if (cover) { accounted++; continue; }
        findings.push({
          w: w.id, kind: 'UNACCOUNTED', file: rel, line: h.line,
          detail: 'a carrier states the withdrawn wording and nothing in the registry accounts ' +
                  'for it',
          excerpt: doc.text.slice(Math.max(0, h.offset - 80), h.offset + h.len + 80),
        });
      }

      // NO "site matched but covers no occurrence" CHECK, deliberately. BAD-ANCHOR above requires
      // every anchor to contain the withdrawn wording, and an anchor found in the file therefore
      // always brings an occurrence with it. Writing the check anyway would be unreachable code
      // inside a guard, which is the shape that lets a suite report coverage it does not have.
      // The case it would have caught — the wording properly removed — surfaces as STALE-SITE.
    }

    // A site naming a file that is not in the carrier corpus at all: moved, deleted, or
    // reclassified as a trace. Any of the three makes the entry a lie.
    for (const s of w.sites || []) {
      if (!collapsed.has(s.file)) {
        findings.push({
          w: w.id, kind: 'MISSING-FILE', file: s.file, line: 0,
          detail: 'registered carrier is not in the corpus (moved, deleted, or now classified a trace)',
        });
      }
    }

    perWithdrawal.push({ id: w.id, claim: w.claim, withdrawn_at: w.withdrawn_at,
      correct_form: w.correct_form, occurrences, accounted });
  }

  const red = findings.length > 0;
  return {
    red, findings, withdrawals: perWithdrawal,
    counts: { carriers: carriers.length, traces: traces.length },
  };
}

/** The shortest window around [from,to) that occurs exactly once in text, growing by ANCHOR_PAD. */
function shortestUniqueAnchor(text, from, to) {
  for (let pad = ANCHOR_PAD; pad <= ANCHOR_MAX; pad += ANCHOR_PAD) {
    const a = text.slice(Math.max(0, from - pad), Math.min(text.length, to + pad));
    const i = text.indexOf(a);
    if (i !== -1 && text.indexOf(a, i + 1) === -1) return a;
  }
  return text.slice(Math.max(0, from - ANCHOR_MAX), Math.min(text.length, to + ANCHOR_MAX));
}

/** Every occurrence in every carrier, as proposed registry rows for a human to classify. */
function census(opts = {}) {
  const root = opts.root || REPO;
  const reg = opts.registry || JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  const rows = [];
  const { carriers } = corpus(root);
  for (const w of reg.withdrawals || []) {
    const pat = new RegExp(w.pattern, 'gi');
    for (const rel of carriers) {
      let raw;
      try { raw = fs.readFileSync(path.join(root, rel), 'utf8'); } catch { continue; }
      const doc = collapse(raw);
      pat.lastIndex = 0;
      let m;
      while ((m = pat.exec(doc.text)) !== null) {
        rows.push({ withdrawal: w.id, file: rel, line: doc.lineOf[m.index] || 0,
          anchor: shortestUniqueAnchor(doc.text, m.index, m.index + m[0].length) });
        if (m.index === pat.lastIndex) pat.lastIndex++;
      }
    }
  }
  return rows;
}

// ── report ───────────────────────────────────────────────────────────────────────────────
const LIMITS = [
  'It matches WORDING, not meaning. A carrier asserting the same withdrawn claim in different',
  '  words is invisible here — record/claim-your-continuity.md:15 calls the keeper "the',
  '  decorrelated instrument" with no "only" and this tool does not see it.',
  'It cannot tell you what has been withdrawn. The registry is hand-written; a withdrawal',
  '  nobody registers is a withdrawal this reports green on, forever.',
  'It reads .md only, and only under the corpus rule printed above.',
  'It cannot tell you an "acknowledged" exemption is still a GOOD idea — only that someone',
  '  wrote down where the correction lives.',
];

function report(res, opts = {}) {
  const L = [];
  const say = (s) => L.push(s === undefined ? '' : s);
  say('CARRIER DRIFT — registered withdrawals vs the carriers that still assert them');
  say();
  say('  corpus: ' + res.counts.carriers + ' carriers · ' + res.counts.traces +
      ' traces skipped (' + TRACE_PREFIXES.join(', ') + ')');
  say();
  for (const w of res.withdrawals) {
    say('  ' + w.id);
    say('    claim        ' + w.claim);
    say('    withdrawn at ' + w.withdrawn_at);
    say('    correct form ' + w.correct_form);
    say('    ' + w.occurrences + ' occurrences in carriers · ' + w.accounted + ' accounted');
  }
  if (res.findings.length) {
    say();
    say('  RED — ' + res.findings.length + (res.findings.length === 1 ? ' finding' : ' findings'));
    for (const f of res.findings) {
      say('    ' + f.kind + '  ' + f.file + (f.line ? ':' + f.line : ''));
      say('      ' + f.detail);
      if (f.excerpt) say('      … ' + f.excerpt + ' …');
    }
  }
  say();
  say('WHAT THIS CANNOT SEE');
  for (const l of LIMITS) say('  · ' + l);
  say();
  say(res.red ? 'RED' : 'GREEN');
  return L.join('\n');
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.includes('--census')) {
    for (const r of census()) {
      console.log(JSON.stringify({ file: r.file, anchor: r.anchor, kind: '', why: '' }) +
        '   // :' + r.line);
    }
    process.exit(0);
  }
  const res = scan();
  if (argv.includes('--quiet')) {
    console.log((res.red ? 'RED' : 'GREEN') + ' — carrier-drift · ' + res.counts.carriers +
      ' carriers · ' + res.findings.length + ' findings');
  } else {
    console.log(report(res));
  }
  process.exit(res.red ? 1 : 0);
}

module.exports = { scan, census, collapse, corpus, report, TRACE_PREFIXES, REPO, REGISTRY };
