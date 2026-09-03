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
//   node consonance/tools/carrier-drift.js --ch4-walk  re-extract the instruction-reachable set
//                                                      and diff it against the frozen list
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

// ── THE DATED VERBATIM EXTRACT, and why a prefix could not carry it ───────────────────────
//
// `ad4e615` (2026-09-01 07:47) landed `exo_memory/map/M-<date>.md`: one seat's own prose for one
// day, extracted MECHANICALLY from its transcript, whose header says "Nothing here is a summary."
// That is this file's own definition of a TRACE, word for word — a true record of what was
// believed on a date, which maintenance law 2 forbids rewriting. It landed under `exo_memory/map/`
// and this tool went from 1 finding to 6 the same night. All five new ones are the librarian
// REPORTING a withdrawal (two of them are it SPECIFYING THIS REGISTRY), and none asserts anything.
//
// A PATH PREFIX CANNOT EXPRESS THIS, and reaching for one would have been the disaster. The same
// directory holds `A.md`, `M.md` and `README.md` — the live pane maps, and a pane is respawned
// FRESH from its own map (BUILDING.md, WHAT A HAND-BACK OWES). Exempting `exo_memory/map/` would
// have silently taken the strongest carrier class in the room out of the corpus while reading as
// housekeeping. That is the Q3 false-green class named forty lines above.
//
// SO THE DISCRIMINATOR IS THE FILE'S OWN DECLARATION, NEVER ITS POSITION. The path pattern only
// bounds the blast radius; the file must SAY it is a mechanical extract. Measured, 2026-09-03:
// 8 of 8 dated extracts declare, 0 of 3 live maps do. A hand-written file at the same path stays
// a carrier, which is the bar this rule is tested against — because "it sits in the right folder"
// is exactly the positional inference this tool exists to refuse.
//
// FALSIFIER, registered before adoption: if a dated extract is ever found ASSERTING a withdrawn
// claim as live guidance rather than recording it, the declaration is not the discriminator and
// this rule is a silencer — strike it and register the sites by hand instead. Checkable by
// reading any finding this rule removes; the five it removes today are quoted in the hand-back.
const TRACE_EXTRACT_PATH = /^exo_memory\/map\/[A-Z]-\d{4}-\d{2}-\d{2}\.md$/;
const TRACE_EXTRACT_DECLARATION = /Extracted mechanically/i;
const TRACE_EXTRACT_RULE =
  'dated verbatim extract (exo_memory/map/<X>-<date>.md declaring "Extracted mechanically")';

/** A dated map file is a trace only if it DECLARES itself a mechanical extract. Position never. */
function isDatedExtract(root, rel) {
  if (!TRACE_EXTRACT_PATH.test(rel)) return false;
  try {
    return TRACE_EXTRACT_DECLARATION.test(fs.readFileSync(path.join(root, rel), 'utf8').slice(0, 4000));
  } catch (e) {
    return false;   // unreadable is not exempt
  }
}

/** The one trace predicate. Everything that splits carriers from traces goes through here. */
function isTraceFile(root, rel) {
  return TRACE_PREFIXES.some((p) => rel.startsWith(p)) || isDatedExtract(root, rel);
}

// ── CH-4: the instruction-reachable set ──────────────────────────────────────────────────
// WHAT THIS IS AND WHAT IT IS EMPHATICALLY NOT. `carrier_surface_2026-08-25.md` (9f4f888) found
// five channels by which retired wording reaches a waking instance. CH-4 is the one with no
// shipping step: files BOOT and SOURCE *instruct* an instance to open, which therefore teach
// whoever follows the instruction. It produced the only measured use in b7f3775.
//
// CH-4 IS A LABEL ON THE CORPUS, NEVER A REPLACEMENT FOR IT. The librarian's Q2 ruling is that a
// detector inherits the walker's boundary; the failure mode one reading away is narrowing the
// scanned corpus to the reachable set, and that reading is measurably catastrophic:
//
//   registered site FILES  9 · inside the CH-4 set  2 · OUTSIDE  7
//   registered SITES lost if the corpus were narrowed to CH-4:  14 of 17
//
// Among the fourteen is `loop/lap_2026-08-23.md` — THE re-assertion, the event this instrument
// was built for. They would not go red; they would go silently ABSENT, which is the false-green
// class (Q3) introduced by the packet that names it. So: the scanned corpus stays repo-wide minus
// traces, and CH-4 rides along as a flag on findings and a line in the universe print.
//
// FROZEN, AND ALSO RE-WALKED EVERY RUN. The registry carries the extracted list. The walk is two
// root files at depth 2, so it is cheap enough to redo on every invocation rather than on a
// commit trigger — which removes staleness as a failure mode entirely instead of trading against
// it. The frozen list is therefore not the live truth; it is the REGISTERED EXPECTATION, and a
// difference is a finding (CH4-DRIFT), because a file that has just become instruction-reachable
// from BOOT is a file nobody has classified yet.
//
// EXTRACTION IS MECHANICAL, BY PATTERN, NEVER BY HAND-READING. That is not a style preference:
// the librarian hand-read BOOT for this exact set and missed `dev/SPINE.md`, which enters at
// BOOT:150 ("read SPINE first; it supersedes") and carries 13 apparatus hits — the largest of any
// file in the set. A hand-read of a 160-line document is not a corpus rule.
const CH4_ROOTS = ['exo_memory/BOOT.md', 'exo_memory/SOURCE.md'];
const CH4_DEPTH = 2;
// A line carrying one of these is telling the reader to go somewhere. A path with a `:NNN` suffix
// is a CITATION — evidence of a past event — and is never walked: traces keep their wording.
const CH4_INSTRUCTION = /(\b(read|open|run|see|use|per|via|check|first|supersedes|recall)\b)|->|→/i;
const CH4_VERB_WINDOW = 60;   // 60 and 90 give the identical set; 30 loses real pointers, 200 admits citations.
const CH4_SEEDED_DIRS = [
  'exo_memory/cards', 'exo_memory/spread', 'exo_memory/research', 'exo_memory/record',
];
const CH4_BRIEF_DIR = 'consonance/src-tauri/brief';
const CH4_SEARCH = ['', 'exo_memory', 'exo_memory/cards', 'exo_memory/record', 'exo_memory/spread',
  'exo_memory/research', 'exo_memory/loop', 'consonance', CH4_BRIEF_DIR, 'dev'];
const CH4_TOKEN = /(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.md|\[\[([a-z0-9-]+)\]\]/g;

function ch4Resolve(root, token, fromDir) {
  const rel = token.replace(/\\/g, '/').replace(/^\.\//, '');
  const tries = [path.join(fromDir, rel)];
  for (const d of CH4_SEARCH) tries.push(path.join(root, d, rel));
  for (const t of tries) {
    try {
      if (fs.statSync(t).isFile()) return path.relative(root, t).split(path.sep).join('/');
    } catch { /* not here */ }
  }
  return null;
}

/** Instruction-pointer targets of one file. Citations (`path.md:12`) are skipped and counted. */
function ch4Targets(root, rel) {
  let raw;
  try { raw = fs.readFileSync(path.join(root, rel), 'utf8'); } catch { return { targets: [], skipped: 0 }; }
  const fromDir = path.dirname(path.join(root, rel));
  const out = new Set();
  let skipped = 0;
  for (const line of raw.split(/\r?\n/)) {
    CH4_TOKEN.lastIndex = 0;
    let m;
    while ((m = CH4_TOKEN.exec(line)) !== null) {
      const token = m[1] ? m[1] + '.md' : m[0];
      const after = line.slice(m.index + m[0].length, m.index + m[0].length + 5);
      if (/^:\d/.test(after)) { skipped++; continue; }          // citation, not instruction
      // PROXIMITY, not line-membership. A 900-word BOOT paragraph almost always contains some
      // instruction verb somewhere, so "the line has a verb" admits every file the paragraph
      // happens to cite. The verb has to be near the pointer to be pointing AT it. The window is
      // a declared parameter, not a taste: widen it and citations creep in, narrow it and real
      // pointers ("read SPINE first") drop out.
      const before = line.slice(Math.max(0, m.index - CH4_VERB_WINDOW), m.index);
      const near = line.slice(m.index + m[0].length, m.index + m[0].length + CH4_VERB_WINDOW);
      if (!CH4_INSTRUCTION.test(before) && !CH4_INSTRUCTION.test(near)) { skipped++; continue; }
      const r = ch4Resolve(root, token, fromDir);
      if (r) out.add(r);
    }
  }
  return { targets: [...out], skipped };
}

/**
 * The instruction-reachable set: both roots, depth CH4_DEPTH, unioned with the closed universe
 * the room actually seeds (four dirs) and bundles (the briefs). Mechanical and reproducible.
 */
function ch4Walk(root) {
  const depth = {};
  const missingRoots = [];
  for (const r of CH4_ROOTS) {
    try { fs.statSync(path.join(root, r)); depth[r] = 0; } catch { missingRoots.push(r); }
  }
  let frontier = Object.keys(depth);
  let skipped = 0;
  for (let d = 1; d <= CH4_DEPTH; d++) {
    const next = [];
    for (const f of frontier) {
      const t = ch4Targets(root, f);
      skipped += t.skipped;
      for (const x of t.targets) if (!(x in depth)) { depth[x] = d; next.push(x); }
    }
    frontier = next;
  }
  const files = new Set(Object.keys(depth));
  for (const d of CH4_SEEDED_DIRS.concat([CH4_BRIEF_DIR])) {
    let entries;
    try { entries = fs.readdirSync(path.join(root, d)); } catch { continue; }
    for (const f of entries) if (f.toLowerCase().endsWith('.md')) files.add(d + '/' + f);
  }
  // A TRACE can be instruction-reachable and still keeps its wording by design (BOOT names
  // `journal/` as a class). Including one here would label it CH-4 while the scan skips it —
  // two rules disagreeing about the same file, inside a tool whose subject is exactly that.
  const isTrace = (f) => isTraceFile(root, f);
  const kept = [...files].filter((f) => !isTrace(f)).sort();
  const tracesReached = [...files].filter(isTrace).sort();
  return { files: kept, tracesReached, depth, skipped, missingRoots };
}

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
// EXTENSIONS SCANNED. `.md` was the whole corpus until 2026-09-02, and `.html` was added because
// the blindness had a measured cost: `consonance/ui/index.html` is the app's About tab, one of the
// three surfaces a person actually reads to find out what this is, and it titled a section
// "The governing stance: light, not lifeguard" — the diving vocabulary retired on 2026-07-12 and
// again on 2026-08-17 — for six weeks, while this tool ran green over it every time.
//
// The tool's own LIMITS list said "IT READS .md ONLY" and named the class it was missing. A known
// limit that is cheap to close and stays open is not a limit, it is a decision nobody revisited.
//
// MEASURED BEFORE IT WAS WIDENED, because widening a detector's universe is how a green run
// quietly becomes a different green run: the repo contains exactly ONE `.html` file, and adding it
// produced no new finding for either withdrawal already registered. So this changes what the tool
// SEES and not what drift MEANS for the briefs it already guards — the packet's own refusal
// condition, checked rather than assumed.
//
// NOT WIDENED TO `.js`, and that is the bigger hole, still open and still named in LIMITS: the
// crude "can't lose" handle lives in `tools/tell-index.js:172` and — worse — inside a live model
// prompt at `dev/shell/hooks/l2-overseer-worker.js:34`, which instructs at runtime instead of
// teaching a reader. Source files carry wordings as strings, comments and prompts, and telling
// those apart is a different instrument, not a longer list here. Left undone on purpose.
const SCAN_EXTS = ['.md', '.html'];

function walk(dir, root, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, root, out);
    } else if (e.isFile() && SCAN_EXTS.some((x) => e.name.toLowerCase().endsWith(x))) {
      out.push(path.relative(root, p).split(path.sep).join('/'));
    }
  }
  return out;
}

// The three surfaces a person reads to learn what this is: the repo's front door, the app's own
// README, and the About tab. Reported as a NAMED LINE, never as a filter — `red` stays repo-wide,
// so this can say "the surfaces are clean" while the run is red elsewhere, and cannot silence
// anything. A scope flag here would be the silencer the registry's own README warns about.
const DESCRIPTION_SURFACES = ['README.md', 'consonance/README.md', 'consonance/ui/index.html'];

function corpus(root) {
  const all = walk(root, root, []).sort();
  const traces = all.filter((f) => isTraceFile(root, f));
  const carriers = all.filter((f) => !isTraceFile(root, f));
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

  // ── CH-4, re-walked every run and diffed against the frozen list ───────────────────────
  // The set is cheap (two roots, depth 2), so it is recomputed rather than trusted. A frozen
  // list that is never re-derived is the stale-denominator failure with a timestamp on it.
  const walked = ch4Walk(root);
  const frozen = (reg.ch4_corpus && Array.isArray(reg.ch4_corpus.files)) ? reg.ch4_corpus.files : null;
  // CH-4 is only meaningful over a tree that HAS the roots. A tree with neither is not a room
  // with an unfrozen set, it is not a room — and reporting a missing-root defect against a
  // synthetic fixture would be the tool describing its own test harness. Applicability first,
  // then the two real defects: some roots present (single-root blindness) and none frozen.
  const applies = walked.missingRoots.length < CH4_ROOTS.length;
  const ch4 = { applies, walked: walked.files, frozen, set: new Set(applies ? walked.files : []),
    missingRoots: walked.missingRoots, tracesReached: walked.tracesReached };
  if (applies && walked.missingRoots.length) {
    findings.push({
      kind: 'CH4-ROOT-MISSING', file: walked.missingRoots.join(', '), line: 0,
      detail: 'a declared CH-4 root does not exist, so the reachable set was computed from fewer ' +
              'roots than registered — the single-root blindness this set exists to prevent',
    });
  }
  if (applies && !frozen) {
    findings.push({
      kind: 'CH4-UNFROZEN', file: path.relative(root, REGISTRY), line: 0,
      detail: 'registry carries no ch4_corpus.files, so there is nothing to diff the walk against ' +
              'and a newly-reachable file would arrive unnoticed. Run --ch4-walk and freeze it.',
    });
  } else if (applies && frozen) {
    const fset = new Set(frozen);
    const added = walked.files.filter((f) => !fset.has(f));
    const removed = frozen.filter((f) => !ch4.set.has(f));
    for (const f of added) {
      findings.push({
        kind: 'CH4-DRIFT-ADDED', file: f, line: 0,
        detail: 'this file is now reachable by instruction from BOOT/SOURCE and is not in the ' +
                'frozen set — nobody has classified what it teaches. Re-freeze deliberately, ' +
                'after reading it, never as a formality',
      });
    }
    for (const f of removed) {
      findings.push({
        kind: 'CH4-DRIFT-REMOVED', file: f, line: 0,
        detail: 'the frozen set names a file the walk no longer reaches — a pointer was removed ' +
                'or the file moved. Either is a real change to what the room teaches',
      });
    }
  }

  // A registry with no withdrawals in it is not a green tree, it is an unarmed instrument. Same
  // rule js-suite applies to a green run over zero tests.
  if (!Array.isArray(reg.withdrawals) || reg.withdrawals.length === 0) {
    findings.push({
      kind: 'EMPTY-REGISTRY', file: path.relative(root, REGISTRY), line: 0,
      detail: 'no withdrawals registered — this tool is armed by its registry and an empty one ' +
              'reports green over everything it cannot see',
    });
    return { red: true, findings, withdrawals: [], ch4,
      counts: { carriers: carriers.length, traces: traces.length,
        ch4: applies ? walked.files.length : undefined } };
  }

  // Read each carrier once, not once per withdrawal.
  const collapsed = new Map();
  for (const rel of carriers) {
    let raw;
    try { raw = fs.readFileSync(path.join(root, rel), 'utf8'); } catch { continue; }
    collapsed.set(rel, collapse(raw));
  }

  for (const w of reg.withdrawals) {
    // ── ARMED, and why a disarmed entry is not the same thing as no entry ─────────────────
    // A wording can be REGISTERED before it is SUPERSEDED. The case that forced this: the
    // cant_lose repair (loop/cant_lose_repair_registration_2026-08-29.md) is filed, its five
    // instruction-reachable carriers are enumerated, and the keeper has not adjudicated. Arming
    // it now would have this tool report the room's own LIVE doctrine as a propagation failure —
    // an instrument calling the current instrument an error. Leaving it out entirely would mean
    // the accounting is done from scratch, under time pressure, on the night of adoption; that
    // is when the July-12 diving pass missed BOOT.md.
    //
    // So: a disarmed entry is scanned in FULL and its findings are computed and PRINTED. They
    // carry `pending` and do not set red. Arming is one word. Two consequences that are the
    // whole point: the entry cannot rot unnoticed while it waits (a stale anchor shows up in
    // every run), and adoption cannot silently under-cover, because the unaccounted sites are
    // already on screen before anyone decides.
    //
    // AND A DISARMED ENTRY MUST NAME WHAT ARMS IT. Same rule as `acknowledged` needing `see`:
    // an exemption with no destination is a silencer, and "we'll arm it later" with no named
    // later is how a registry becomes a list.
    const armed = w.armed !== false;
    const wStart = findings.length;
    // Held back until after the pending-marking below: BAD-DISARM is a defect in the REGISTRY,
    // not a carrier finding, so it is red even for the entry that is disarmed.
    const hard = [];
    if (!armed && !w.arms_on) {
      hard.push({
        w: w.id, kind: 'BAD-DISARM', file: path.relative(root, REGISTRY), line: 0,
        detail: 'a disarmed entry must name what arms it ("arms_on"); a registration that waits ' +
                'on nothing in particular waits forever and reads as coverage',
      });
    }
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

    // THE DESCRIPTION SURFACES HAVE NO TRACE EXEMPTION, and no PENDING path either.
    //
    // Ruling, 2026-09-02, on A's §6: with this entry DISARMED the About mutant was SEEN and filed
    // PENDING — 0 red. That is right for the record tiers, where a dated document may carry a
    // retired wording with a marker beside it and the strike-in-place pass is a keeper decision.
    // It is wrong here: nobody reads the About tab as a dated trace. A user-facing page carries
    // the wording in the present tense, to a person deciding what this is, and there is no reading
    // of it that is historical. So a hit on one of the three surfaces is RED whatever the entry's
    // arming state — the disarm buys time for the 16 carriers it was written for and buys none
    // for the front door.
    if (!armed) {
      for (let i = wStart; i < findings.length; i++) {
        if (DESCRIPTION_SURFACES.includes(findings[i].file)) continue;
        findings[i].pending = true;
      }
    }
    let pending = 0;
    for (let i = wStart; i < findings.length; i++) if (findings[i].pending) pending++;
    for (const f of hard) findings.push(f);

    perWithdrawal.push({ id: w.id, claim: w.claim, withdrawn_at: w.withdrawn_at,
      correct_form: w.correct_form, occurrences, accounted,
      armed, arms_on: w.arms_on || null, pending: armed ? 0 : pending });
  }

  // CH-4 membership is a property of a finding, not a filter on it: an unaccounted occurrence in
  // an instruction-reachable file is taught to whoever follows the instruction, and one outside
  // the set is still a carrier. Both are red; only one is labelled.
  for (const f of findings) if (f.file && ch4.set.has(f.file)) f.ch4 = true;

  // A pending finding belongs to a disarmed entry: computed, printed, and not yet a failure.
  const red = findings.some((f) => !f.pending);
  return {
    red, findings, withdrawals: perWithdrawal, ch4,
    counts: {
      carriers: carriers.length,
      traces: traces.length,
      ch4: applies ? walked.files.length : undefined,
      ch4InCorpus: applies ? walked.files.filter((f) => carriers.includes(f)).length : undefined,
    },
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
  'IT SCANS FILES; A HANDLE FIRES IN A TURN. 2026-08-29 registered a wording because a seat ran',
  '  the crude form of a test WHILE CARRYING the document that corrects it — nothing on disk was',
  '  wrong at that moment. The measurement that produced the finding (journal/2026-08-17, pane C)',
  '  counted LIVE TURNS: a spoken short form fired 13 times while its written long form sat in the',
  '  never-invoked list. That universe is not this one. Green here means no file still teaches the',
  '  wording. It does not mean nobody still uses it, and it never will.',
  'IT READS .md AND .html ONLY, and wordings live outside both. Measured, same registration: the',
  '  crude test is',
  '  in consonance/tools/tell-index.js:172 as a detector\'s rationale, and in',
  '  dev/shell/hooks/l2-overseer-worker.js:34 INSIDE A LIVE MODEL PROMPT — the strongest carrier',
  '  class there is, since it instructs at runtime rather than teaching a reader. Both are',
  '  structurally invisible here.',
  'IT HAS NO CONCEPT OF TYPOGRAPHIC POSITION, and the finding it was grown for says position IS',
  '  retrieval weight — whatever is bold is the handle. A file that strikes the crude wording and',
  '  leaves it in the bold slot, with the repair added in plain text below, is GREEN here and is',
  '  the exact failure. Only a human reading the diff catches that.',
  'THE PATTERN ALTERNATION IS ENUMERATED, NOT CLOSED. It admits the four forms measured in this',
  '  corpus (can\'t / cannot / can you / can I). A fifth phrasing of the same handle, written',
  '  tomorrow, is green forever and nothing here will say so.',
  'It cannot tell you what has been withdrawn. The registry is hand-written; a withdrawal',
  '  nobody registers is a withdrawal this reports green on, forever.',
  'It reads .md and .html only, and only under the corpus rule printed above. `.html` was added',
  '  2026-09-02 for the About tab; `.js` is still outside, which is where the strongest carrier',
  '  class lives — a wording inside a live model prompt instructs at runtime instead of teaching',
  '  a reader, and nothing here sees it.',
  'It cannot tell you an "acknowledged" exemption is still a GOOD idea — only that someone',
  '  wrote down where the correction lives.',
];

function report(res, opts = {}) {
  const L = [];
  const say = (s) => L.push(s === undefined ? '' : s);
  say('CARRIER DRIFT — registered withdrawals vs the carriers that still assert them');
  say();
  say('  corpus: ' + res.counts.carriers + ' carriers · ' + res.counts.traces +
      ' traces skipped (' + TRACE_PREFIXES.join(', ') + ', ' + TRACE_EXTRACT_RULE + ')');
  if (res.counts.ch4 !== undefined) {
    say('  CH-4:   ' + res.counts.ch4 + ' instruction-reachable from ' + CH4_ROOTS.join(' + ') +
        ' at depth ' + CH4_DEPTH + ' · ' + res.counts.ch4InCorpus + ' of them inside the scanned corpus' +
        ' · re-walked this run' +
        (res.ch4 && res.ch4.frozen ? ' · frozen list ' + res.ch4.frozen.length : ' · NOT FROZEN'));
    say('          CH-4 is a LABEL on findings, never a filter — narrowing the corpus to it would ' +
        'drop 14 of 17 registered sites');
  }
  say();
  const armedN = res.withdrawals.filter((w) => w.armed).length;
  say('  registry: ' + res.withdrawals.length + ' registered · ' + armedN + ' ARMED · ' +
      (res.withdrawals.length - armedN) + ' DISARMED (scanned and printed, never red)');
  say();
  for (const w of res.withdrawals) {
    say('  ' + w.id + (w.armed ? '' : '   — DISARMED'));
    say('    claim        ' + w.claim);
    say('    withdrawn at ' + w.withdrawn_at);
    say('    correct form ' + w.correct_form);
    say('    ' + w.occurrences + ' occurrences in carriers · ' + w.accounted + ' accounted');
    if (!w.armed) {
      say('    ARMS ON      ' + w.arms_on);
      say('    UNTIL THEN THIS ENTRY PROTECTS NOTHING. ' + w.pending +
          ' finding(s) below are computed and shown, and do not set red.');
    }
  }
  const live = res.findings.filter((f) => !f.pending);
  const pend = res.findings.filter((f) => f.pending);
  const show = (f) => {
    say('    ' + f.kind + '  ' + f.file + (f.line ? ':' + f.line : '') + (f.ch4 ? '   [CH-4]' : ''));
    say('      ' + f.detail);
    if (f.excerpt) say('      … ' + f.excerpt + ' …');
  };
  if (live.length) {
    say();
    say('  RED — ' + live.length + (live.length === 1 ? ' finding' : ' findings'));
    for (const f of live) show(f);
  }
  if (pend.length) {
    say();
    say('  PENDING — ' + pend.length + (pend.length === 1 ? ' finding' : ' findings') +
        ' against DISARMED entries. Not red. These are what arming would fire.');
    for (const f of pend) show(f);
  }
  // THE THREE DESCRIPTION SURFACES, counted separately and NEVER filtered. Added 2026-09-02 with
  // the .html corpus: these are what a person reads to find out what this is, and on 2026-09-02 all
  // three were still the 2026-08-17 text while the About tab titled a section with a vocabulary
  // retired twice. `red` above is repo-wide and unaffected, so this line can say the surfaces are
  // clean during a red run and cannot silence anything — a scope FLAG here would be the silencer
  // the registry's own README warns about; a scope LINE is a report.
  say();
  const surf = res.findings.filter((f) => DESCRIPTION_SURFACES.includes(f.file));
  const surfLive = surf.filter((f) => !f.pending);
  say('  DESCRIPTION SURFACES — ' + DESCRIPTION_SURFACES.join(' · '));
  say('    ' + surf.length + ' finding(s), ' + surfLive.length + ' of them red' +
      (surf.length ? '' : ' — no registered wording still asserted on any of the three'));
  for (const f of surf) say('      ' + (f.pending ? 'PENDING ' : 'RED ') + f.kind + '  ' + f.file +
      (f.line ? ':' + f.line : ''));
  say('    THIS COUNTS WORDING ONLY. A surface that never mentions a subsystem is invisible here:');
  say('    on 2026-09-02 all three scored ZERO for Librarian / Third Place / Listen / chain /');
  say('    call_librarian and this instrument was green on every one of them. Omission is a');
  say('    different disease and needs a different oracle.');
  say();
  say('WHAT THIS CANNOT SEE');
  for (const l of LIMITS) say('  · ' + l);
  say();
  say(res.red ? 'RED' : 'GREEN');
  return L.join('\n');
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.includes('--ch4-walk')) {
    const w = ch4Walk(REPO);
    const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
    const frozen = (reg.ch4_corpus && reg.ch4_corpus.files) || [];
    const fset = new Set(frozen);
    const wset = new Set(w.files);
    console.log('CH-4 WALK — instruction pointers, roots ' + CH4_ROOTS.join(' + ') + ', depth ' + CH4_DEPTH);
    console.log('  reached: ' + w.files.length + ' · citation/non-instruction tokens skipped: ' + w.skipped);
    if (w.missingRoots.length) console.log('  MISSING ROOTS: ' + w.missingRoots.join(', '));
    console.log('  frozen:  ' + frozen.length);
    const added = w.files.filter((f) => !fset.has(f));
    const removed = frozen.filter((f) => !wset.has(f));
    if (added.length) { console.log('  ADDED since freeze:'); added.forEach((f) => console.log('    + ' + f)); }
    if (removed.length) { console.log('  REMOVED since freeze:'); removed.forEach((f) => console.log('    - ' + f)); }
    if (!added.length && !removed.length) console.log('  no drift');
    console.log();
    console.log('  the set (depth shown for walked members; blank = seeded dir or brief):');
    for (const f of w.files) console.log('    ' + (w.depth[f] !== undefined ? 'd' + w.depth[f] : '  ') + '  ' + f);
    console.log();
    console.log('  To freeze: paste the list above into carrier-drift.registry.json ch4_corpus.files');
    console.log('  AFTER READING what each newly-added file teaches. Freezing without reading is');
    console.log('  the rubber-stamp this registry warns about in its own _README.');
    process.exit(0);
  }
  if (argv.includes('--census')) {
    for (const r of census()) {
      console.log(JSON.stringify({ file: r.file, anchor: r.anchor, kind: '', why: '' }) +
        '   // :' + r.line);
    }
    process.exit(0);
  }
  const res = scan();
  if (argv.includes('--quiet')) {
    const pend = res.findings.filter((f) => f.pending).length;
    console.log((res.red ? 'RED' : 'GREEN') + ' — carrier-drift · ' + res.counts.carriers +
      ' carriers · ' + (res.findings.length - pend) + ' findings' +
      (pend ? ' · ' + pend + ' PENDING against disarmed entries' : ''));
  } else {
    console.log(report(res));
  }
  process.exit(res.red ? 1 : 0);
}

module.exports = {
  scan, census, collapse, corpus, report, ch4Walk, ch4Targets,
  TRACE_PREFIXES, CH4_ROOTS, CH4_DEPTH, CH4_SEEDED_DIRS, CH4_BRIEF_DIR, REPO, REGISTRY,
  TRACE_EXTRACT_PATH, TRACE_EXTRACT_DECLARATION, TRACE_EXTRACT_RULE, isDatedExtract, isTraceFile,
};
