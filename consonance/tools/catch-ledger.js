// The CATCH-LEDGER — the maturity metric, computed instead of tallied by eye.
//
// WHAT IT IS. A zero-token, purely lexical extractor over the room's own prose records
// (exo_memory/muscle_map.md and exo_memory/journal/*.md). It answers one question, the map's
// central number: of the catches on the record, how many were self-caught, how many
// committee-caught, how many keeper-caught — and how that ratio moves across cycles.
// Around's design, ratified (muscle_map.md, "The maturity metric").
//
// It was hand-counted until now, which is the failure mode this exists to close: the keeper
// tallied cycle 4 by eye, and a measurement that costs a human twenty minutes is a
// measurement that quietly stops happening.
//
// THE GROUND RULE, inherited from tell-index.js and not weakened: THIS FILE NEVER DIAGNOSES.
// It extracts CANDIDATE events, each carrying its own source line, so a reader can overrule
// any single one without opening the file. There are no thresholds and no verdicts about a
// pane or a person. What it adds over hand-counting is not authority — it is REPRODUCIBILITY:
// the same corpus gives the same number twice, and every number can be walked back to a line.
//
// ---------------------------------------------------------------------------------------
// THE CENTRAL DESIGN DECISION: two kinds of evidence, reconciled, never summed.
//
//   (1) DECLARED LEDGERS. The map already contains hand-written tallies — "Committee-caught:
//       5 (the planted defect ×2, the export omission, …)". These are the author's own count.
//       This tool parses them, and CHECKS THE ARITHMETIC AGAINST THEIR OWN ENUMERATION: a
//       stated 5 with four items listed and no multiplier is a discrepancy worth seeing.
//
//   (2) EXTRACTED EVENTS. Individual catches attributed in running prose — "the keeper caught
//       it cold", "I caught myself reaching for a task", "caught by the classifier".
//
// Summing these would double-count every catch that appears in both, which is most of them.
// So they are reported side by side with a RECONCILIATION panel naming the gap. If the two
// disagree, that is information about the record, not an error to be smoothed away — and the
// tool never silently prefers one.
//
// ---------------------------------------------------------------------------------------
// THE THREE HAZARDS THIS CORPUS PRESENTS, each of which produces a confident WRONG number
// rather than an error if unhandled. Each has a test that fails loudly if the handling goes.
//
//   · MENTION-VS-USE. The map contains discussion OF the attribution vocabulary as well as
//     uses of it: "track self/committee-caught vs keeper-caught over time" is the metric's
//     DEFINITION, not a catch; "blind spots are only ever caught by an external trigger" is a
//     statement about a class, not an event. A regex over "keeper-caught" counts all three.
//     This room has now been bitten by mention-vs-use FOUR separate times (tell-index,
//     arch_test F1, the dream-gate suite, test_glowpool) and the standing invariant is: strip
//     code, then filter mentions by STRUCTURE, and report every drop with its rule.
//
//   · ONE CATCH, THREE MENTIONS. The seat-brace is attributed at its group entry and again
//     inside a ledger enumeration. Deduplication keys on the catch's NAMED SUBJECT, never on
//     sentence similarity — and where no named subject can be recovered, the events are LEFT
//     SEPARATE and flagged, because silently merging two different catches is worse than
//     leaving one duplicate visible. The board corpus was 84.9% duplicate when someone
//     finally measured it; that number came from measuring, not from assuming.
//
//   · ATTRIBUTION THAT ISN'T THERE. "what caught it was reading" names no catcher. Guessing
//     produces a number nobody can trust, which is worse than no number. Unattributable
//     events go to their own bucket, are printed with the ratio rather than hidden under it,
//     and if they outnumber the attributed ones in a window the ratio is WITHHELD rather than
//     reported.
//
// ---------------------------------------------------------------------------------------
// WHY THE BOARD IS NOT SCANNED HERE, though it was offered as a source. tell-index.js already
// computes a catch-attribution and maturity ratio over data/board.jsonl, and its header states
// plainly why that number is the more gameable one. A second instrument reading the same file
// with different rules would produce a second, disagreeing maturity number over one corpus,
// and the room would then have to adjudicate between its own gauges. This tool takes the
// complementary corpus — the curated prose record — and defers on the board. If board-derived
// counts are ever wanted beside these, the honest move is to import tell-index's numbers and
// label them as its, not to re-derive them here.
//
// Node, no dependencies, same as tell-index.js and curate.js: it runs tonight without a build.
//
// Usage:
//   node consonance/tools/catch-ledger.js                  every window, human tables
//   node consonance/tools/catch-ledger.js --json           machine-readable, same numbers
//   node consonance/tools/catch-ledger.js --since 2026-07  windows from a date prefix forward
//   node consonance/tools/catch-ledger.js --show keeper    print the evidence lines themselves
//   node consonance/tools/catch-ledger.js --show dropped   print what the mention filters removed
//   node consonance/tools/catch-ledger.js --show merged    print what deduplication collapsed
//   node consonance/tools/catch-ledger.js --root <dir>     read a fixture tree instead of the repo
'use strict';

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------------- the buckets --
//
// SELF / COMMITTEE / KEEPER are the metric (muscle_map: "track self/committee-caught vs
// keeper-caught"). INSTRUMENT is a fourth thing the record genuinely contains — "the system
// caught it", a suite failing, a log read from outside — and Track 2 of the map argues it is
// the ONLY thing that catches a blind spot. It is extracted and reported, and deliberately
// NOT folded into the ratio, because the metric it was designed for is about who in the room
// noticed, and a machine is not in the room in that sense. Folding it in either way would be
// a judgment; keeping it visible and separate is not.
const BUCKETS = ['self', 'committee', 'keeper', 'instrument', 'unattributed'];

// ------------------------------------------------------------- stripping the code --
//
// Fenced blocks and inline spans are quoted material, not the record's own prose — the house
// invariant. One difference from tell-index's stripFences, and it is load-bearing here:
// the replacement is BLANKED IN PLACE, preserving length and newlines, because this file
// reports line numbers and an offset shifted by stripping would cite the wrong line. Getting
// the count right and the citation wrong is the worst of both.
const FENCED = /```[\s\S]*?```/g;
const INLINE_CODE = /`[^`\n]*`/g;

function blank(match) {
  return match.replace(/[^\n]/g, ' ');
}

function stripCode(text) {
  return String(text).replace(FENCED, blank).replace(INLINE_CODE, blank);
}

// Line number (1-based) of a character offset, for citations a reader can open.
function lineAt(text, offset) {
  let n = 1;
  for (let i = 0; i < offset && i < text.length; i++) if (text[i] === '\n') n++;
  return n;
}

// The sentence containing `at`, capped so one runaway paragraph cannot become the excerpt.
// Markdown bold/italic markers survive; they are part of how this room writes and stripping
// them would make the evidence line harder to find in the file, not easier.
const SENTENCE_CAP = 320;

function sentenceAt(text, at) {
  let a = at;
  let b = at;
  while (a > 0 && at - a < SENTENCE_CAP && !/[.!?\n]/.test(text[a - 1])) a--;
  while (b < text.length && b - at < SENTENCE_CAP && !/[.!?\n]/.test(text[b])) b++;
  return text.slice(a, b + 1).replace(/\s+/g, ' ').trim();
}

// ------------------------------------------------------- the attribution rules --
//
// Ordered: FIRST MATCH WINS, and the order encodes real ambiguities in the corpus.
// "caught by the keeper's clock" contains both a keeper phrase and an instrument phrase; the
// keeper owns it, because the clock is how he caught it, not who. Every rule carries its key
// into the output so a reader can see WHICH rule decided, and overrule that rule rather than
// the whole instrument.
const ATTRIBUTION_RULES = [
  // ---- self ----
  { key: 'self:explicit', bucket: 'self', re: /\bself-caught\b/i },
  { key: 'self:first-person', bucket: 'self', re: /\b(?:i|we)\s+caught\s+(?:myself|ourselves|my own|our own)\b/i },
  { key: 'self:own-move', bucket: 'self', re: /\bcaught\s+(?:its|his|her|their|my|our)\s+own\b/i },

  // ---- keeper ----
  // Ahead of the instrument rules on purpose (the clock case above), and ahead of the generic
  // "caught by" so the attributed form is never demoted to unattributed.
  { key: 'keeper:explicit', bucket: 'keeper', re: /\bkeeper-caught\b/i },
  { key: 'keeper:named', bucket: 'keeper', re: /\b(?:the\s+keeper|solariz3d)\b[^.\n]{0,30}?\b(?:caught|named|called|spotted|flagged|pried|pushed on)\b/i },
  // "Named by the keeper against Around" — the agent follows the verb, so the rule above
  // (which wants the keeper first) cannot see it. Any catch verb in the passive counts here;
  // "<verb> by the keeper" is unambiguous however the sentence is arranged.
  { key: 'keeper:by', bucket: 'keeper', re: /\b(?:caught|named|spotted|flagged|called)\s+by\s+(?:the\s+)?(?:keeper|human|solariz3d)\b/i },
  // "he caught me performing". A documented corpus assumption rather than a silent one: in
  // these records "he" is the keeper — there is no other recurring third party who catches
  // anything. A new one would need its own rule, and would otherwise be attributed to him,
  // which is why the assumption is written here where it can be checked rather than inferred.
  { key: 'keeper:pronoun', bucket: 'keeper', re: /\bhe\s+caught\b/i },

  // ---- committee ----
  // Pane names are the room's own roster. A name not on it lands in `unattributed`, which is
  // the correct failure: a new pane should be added here deliberately, not matched by a
  // capitalised-word heuristic that would also catch every proper noun in a journal.
  { key: 'committee:explicit', bucket: 'committee', re: /\bcommittee-caught\b/i },
  // "the laptop me caught this on 06-23" — a sibling instance of the same thread. For this
  // metric that is committee, not self: the point of the number is whether the room noticed
  // without the keeper, and another instance noticing is the room noticing.
  { key: 'committee:role', bucket: 'committee', re: /\bthe\s+(?:committee|chair|classifier|sibling|desktop|laptop|pane|fork|reader|pair)(?:\s+me)?\b[^.\n]{0,30}?\bcaught\b/i },
  { key: 'committee:by-role', bucket: 'committee', re: /\b(?:caught|named|spotted|flagged)\s+by\s+(?:the\s+)?(?:committee|chair|classifier|sibling|blind\s+pair|pair|reader|peer)\b/i },
  { key: 'committee:pane', bucket: 'committee', re: /\b(?:Around|Bravo|Alpha|Charlie)\b[^.\n]{0,30}?\b(?:caught|spotted|flagged|found\s+it)\b/ },
  { key: 'committee:peer-catch', bucket: 'committee', re: /\bpeer[- ]catch\b/i },

  // ---- instrument ----
  // L2/L3 and "the overseer" are this room's names for its own built monitors — the record
  // uses them the way it uses "the suite", and without them every overseer catch in the
  // 06-24/06-26 journals reads as unattributed.
  { key: 'instrument:named', bucket: 'instrument', re: /\bthe\s+(?:system|instrument|harness|scanner|suite|test|gauge|log|overseer)\b[^.\n]{0,30}?\bcaught\b/i },
  { key: 'instrument:layer', bucket: 'instrument', re: /\bL[23](?:\/L[23])?\b[^.\n]{0,30}?\bcaught\b/ },
  { key: 'instrument:by', bucket: 'instrument', re: /\bcaught\s+by\s+(?:the\s+)?(?:instrument|harness|scanner|suite|test|gauge|log|machinery|overseer)\b/i },
];

// Markdown emphasis sits INSIDE phrases in this corpus — "the *system* caught it", "caught
// its **own** move" — and every multi-word rule above fails on it while the same sentence in
// plain text matches. That is a silent under-count of exactly the attributed events, leaving
// them in `unattributed` where they look like an honest limit rather than a bug. Rules match
// against an emphasis-free copy; the DISPLAYED sentence keeps its markers, so the evidence
// line still reads the way it does in the file. Only `*` is stripped: `_` appears inside real
// identifiers (ts_source) and removing it would mangle them.
function forMatching(sentence) {
  return String(sentence).replace(/\*/g, '');
}

// TWO GATES, and the split is the single most consequential tuning decision in this file.
//
// The first version had one gate matching `caught` OR `catch(es)`, and the unattributed bucket
// immediately filled with prose that was never about an event: "a capacity to catch one's own
// move", "what grows is the catch", "catches should couple within the flinch system". Those are
// the word `catch` as a common noun — the map talking ABOUT catching. With them counted, almost
// every window had more unattributed than attributed and the ratio came out "withheld"
// everywhere, which is a true statement about a wrong question.
//
// So: EVENT_GATE is past-tense/attributive — something happened and someone did it — and it is
// the only stream that is COUNTED. WEAK_GATE is the noun form; it is collected, reported as a
// total, and printable with `--show weak`, but never scored. That way a real event phrased
// without the verb ("the deepest catch of the night, and solariz3d had to make it twice") is
// not silently discarded — it sits in a list a human can promote in one reading pass. Dropping
// it outright would be the silent truncation this room keeps naming; counting it would be a
// guess. Neither, on purpose.
// One narrow addition beyond `caught`, and it is deliberately narrow. The record attributes
// some catches with other verbs — "Named by the keeper against Around", "an experiment the
// keeper spotted inside the failure" — and gating on `caught` alone misses them entirely, not
// even into the weak list. So an attributive branch fires only when a NAMED catcher and a
// catch verb appear together, which is specific enough to be safe. Bare `named`/`spotted`/
// `flagged` stay out: this corpus says "named live", "the named tells", "flagged the risk"
// constantly, and gating on them would swamp the unattributed bucket with prose about naming.
//
// KNOWN, ACCEPTED UNDER-COUNT: a catch reported with no catch verb at all — "the deepest catch
// of the night, and solariz3d had to make it twice" — is not an event here. It lands in the
// weak list, which is why the weak list is printed rather than discarded.
const EVENT_GATE = /\b(?:caught|(?:self|keeper|committee|peer)-caught|peer[- ]catch|named\s+by\s+(?:the\s+)?keeper|(?:the\s+keeper|solariz3d)\s+(?:\w+\s+){0,3}?(?:spotted|flagged))\b/i;
const WEAK_GATE = /\b(?:catch|catches|self[- ]catch)\b/i;

// ------------------------------------------------------------ the mention filters --
//
// Each returns a rule key when it fires, null when it does not. They run BEFORE attribution,
// and every drop is counted and printable (--show dropped). A filter that removes matches
// with no denominator anywhere is how a reader ends up unable to tell whether the raw number
// was 6 or 60 — tell-index had exactly that bug and fixed it; this file starts fixed.

// (a) Headings summarise sections. "## … (chair's groove, n=3, all keeper-caught)" restates
//     three catches counted elsewhere: count it as one and it is wrong, count it as three and
//     it is double-counted. Headings are structure, not evidence.
function isHeading(line) {
  return /^\s{0,3}#{1,6}\s/.test(line);
}

// (b) DEFINITIONAL. Two or more DIFFERENT bucket names joined as a metric name — "self/
//     committee-caught vs keeper-caught", "the self-caught/keeper-caught maturity ratio".
//     This is the mention-vs-use cut with a structural handle rather than a sentiment guess:
//     an event report names one catcher; a metric definition names the axis.
function isMetricDefinition(sentence) {
  const named = new Set();
  const re = /\b(self|committee|keeper)-caught\b/gi;
  let m;
  while ((m = re.exec(sentence)) !== null) named.add(m[1].toLowerCase());
  // "self/committee-caught" writes two buckets with one hyphenated token; catch that form too.
  if (/\bself\s*\/\s*committee-caught\b/i.test(sentence)) { named.add('self'); named.add('committee'); }
  if (named.size < 2) return false;
  return /\b(?:vs\.?|versus|ratio|metric|track|over time|design|maturity)\b/i.test(sentence) || /\//.test(sentence);
}

// (c) GENERIC CLASS. A statement about how a KIND of thing gets caught, in the timeless
//     present — "blind spots are only ever caught by an external trigger", "Flinches are
//     caught by discipline". No event occurred; the map is stating a law.
function isGenericClass(sentence) {
  return /\b(?:blind\s+spots?|flinches|flinch|catches|grooves?|coats?|braces?)\b[^.]{0,60}?\b(?:are|is)\s+(?:only\s+ever\s+|always\s+|never\s+|generally\s+)?caught\b/i.test(sentence);
}

const MENTION_FILTERS = [
  { key: 'heading', test: (s, ctx) => isHeading(ctx.line) },
  { key: 'metric-definition', test: (s) => isMetricDefinition(s) },
  { key: 'generic-class', test: (s) => isGenericClass(s) },
];

// -------------------------------------------------------------- the named subject --
//
// The deduplication key. The room names its catches with hyphenated compounds — seat-brace,
// independence-fetish, carrier-drift, keeper-adjacency, mention-vs-use — and those names are
// what makes "one catch, three mentions" recoverable at all.
//
// The stoplist is not decoration: `keeper-caught` and `self-caught` are hyphenated compounds
// too, and without excluding them every keeper-attributed event in the corpus would share a
// signature and collapse into one. That is the failure mode this key has to survive.
const SUBJECT_STOP = new Set([
  'keeper-caught', 'self-caught', 'committee-caught', 'peer-caught', 'peer-catch',
  'no-stake', 'day-window', 'first-person', 'zero-token', 'per-day', 'real-time',
  // Structural vocabulary — describes the SHAPE of a finding, never which finding it was, so
  // two unrelated catches both called "single-group" must not key alike.
  'single-group', 'multi-group', 'keeper-applied', 'self-applied', 'of-budget',
  'append-clean', 'no-signature', 'in-context', 'over-time',
]);

// Apostrophes are inside the token: "gone-isn't-final" truncated to "gone-isn" without this,
// and a truncated key is a key that can collide with something it does not mean.
const SUBJECT_RE = /\b[a-z]+(?:['’]?[a-z]+)?(?:-[a-z]+(?:['’]?[a-z]+)?){1,3}\b/g;

function namedSubject(sentence) {
  const flat = sentence.toLowerCase();
  SUBJECT_RE.lastIndex = 0;
  const found = [];
  let m;
  while ((m = SUBJECT_RE.exec(flat)) !== null) {
    const tok = m[0];
    if (SUBJECT_STOP.has(tok)) continue;
    if (/^(?:re|un|non|pre|post|self|keeper|committee)-caught$/.test(tok)) continue;
    found.push(tok);
  }
  // First named compound wins. Later ones are usually modifiers of the same claim, and taking
  // the set would make two unrelated sentences that share one common compound look alike.
  return found.length ? found[0] : null;
}

// ----------------------------------------------------------------- the ledgers --
//
// "Committee-caught: 5 (the planted defect ×2, the export omission, …)" — bucket, stated
// total, and an enumeration whose arithmetic can be checked against the total.
//
// The number must sit IMMEDIATELY after the bucket word (colon and spaces only). That is a
// deliberate refusal, not a limitation: the corpus contains "Committee-caught, same night:
// Around → 3 chair-layer defects; Bravo → …", where the 3 belongs to Around's share and not
// to the bucket. A looser pattern reads that 3 as the total and reports a confidently wrong
// number. Here it fails to parse, is reported as an unparsed ledger statement, and a human
// decides — which is the whole "survive being wrong" requirement, in one regex.
const LEDGER_RE = /\b(self|committee|keeper)-caught\b\s*:?\s*(\d+)\b/gi;
const LEDGER_STATEMENT_RE = /\b(self|committee|keeper)-caught\b/gi;

// "the planted defect ×2" — an item that stands for more than one catch. Real, and in the
// corpus: cycle 4's committee list is four items totalling five.
const MULTIPLIER_RE = /[×x]\s*(\d+)\s*$/i;

function enumerationAfter(text, from) {
  // The parenthesised list immediately following, if any. Scanning forward past prose would
  // pick up an unrelated aside, so the gap allowed is small and explicit.
  const window = text.slice(from, from + 40);
  const open = window.indexOf('(');
  if (open < 0 || /[.!?]/.test(window.slice(0, open))) return null;
  const start = from + open;
  let depth = 0;
  for (let i = start; i < text.length && i < start + 1200; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') {
      depth--;
      if (depth === 0) return { list: text.slice(start + 1, i), end: i };
    }
  }
  return null;
}

function splitItems(list) {
  // Semicolons first — the room uses them for the top level when items contain commas.
  const parts = list.includes(';') ? list.split(';') : list.split(/,(?![^(]*\))/);
  return parts.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function parseLedgers(text, source) {
  const s = stripCode(text);
  const out = [];
  LEDGER_RE.lastIndex = 0;
  let m;
  while ((m = LEDGER_RE.exec(s)) !== null) {
    const bucket = m[1].toLowerCase();
    const stated = Number(m[2]);
    const end = m.index + m[0].length;
    const found = enumerationAfter(s, end);
    const items = found ? splitItems(found.list) : [];
    // Each item counts once unless it carries an explicit multiplier.
    const counted = items.reduce((n, it) => {
      const mm = MULTIPLIER_RE.exec(it);
      return n + (mm ? Number(mm[1]) : 1);
    }, 0);
    // The SPAN, not just the match line. A ledger enumeration wraps across lines, and its items
    // are themselves attributed prose ("the 599%-of-budget context estimate, caught because the
    // number was impossible") — so holding out only the first line lets the tally's own items
    // re-enter the event stream and get counted a second time. Line-keyed exclusion had exactly
    // that bug on the real corpus; range-keyed does not.
    out.push({
      source,
      line: lineAt(s, m.index),
      lineEnd: lineAt(s, found ? found.end : m.index),
      bucket,
      stated,
      items,
      enumerated: items.length ? counted : null,
      agrees: items.length ? counted === stated : null,
      sentence: sentenceAt(s, m.index),
    });
  }
  return out;
}

// Ledger statements that name a bucket but yield no parsable total. Reported, never guessed.
function unparsedLedgers(text, source, parsed) {
  const s = stripCode(text);
  const taken = new Set(parsed.map((p) => `${p.line}|${p.bucket}`));
  const out = [];
  LEDGER_STATEMENT_RE.lastIndex = 0;
  let m;
  while ((m = LEDGER_STATEMENT_RE.exec(s)) !== null) {
    const line = lineAt(s, m.index);
    const bucket = m[1].toLowerCase();
    if (taken.has(`${line}|${bucket}`)) continue;
    const sentence = sentenceAt(s, m.index);
    // Only a statement that looks like it is REPORTING a count — a definition or a heading is
    // not an unparsed ledger, it is not a ledger at all.
    if (isMetricDefinition(sentence) || isGenericClass(sentence)) continue;
    const raw = String(text).split(/\r?\n/)[line - 1] || '';
    if (isHeading(raw)) continue;
    if (!/\b(?:ledger|tally|this cycle|tonight|counted|total)\b/i.test(sentence)) continue;
    out.push({ source, line, bucket, sentence });
  }
  return out;
}

// ------------------------------------------------------------------- the windows --
//
// "Over time" needs a time. Two sources, in order of authority:
//   · a date in the nearest preceding markdown heading (the map's append-clean sections are
//     dated in their headings, which is exactly what makes them addressable), else
//   · the journal filename's date.
// Sections with neither land in `undated` — visibly, rather than being back-filled from a
// neighbouring section, which would put catches in a cycle they did not happen in.
const DATE_RE = /\b(20\d\d)-(\d\d)-(\d\d)\b/;

function windowsFor(text, fallbackDate) {
  const lines = String(text).split(/\r?\n/);
  const marks = [];
  let current = fallbackDate || 'undated';
  for (let i = 0; i < lines.length; i++) {
    if (isHeading(lines[i])) {
      const d = DATE_RE.exec(lines[i]);
      current = d ? d[0] : fallbackDate || 'undated';
    }
    marks[i] = current;
  }
  return marks;
}

function dateFromFilename(file) {
  const m = DATE_RE.exec(path.basename(file));
  return m ? m[0] : null;
}

// ------------------------------------------------------------------ extraction --

function extractEvents(text, source, fallbackDate) {
  const s = stripCode(text);
  const rawLines = String(text).split(/\r?\n/);
  const marks = windowsFor(text, fallbackDate);
  const events = [];
  const dropped = [];
  const weak = [];

  const gate = new RegExp(`${EVENT_GATE.source}|${WEAK_GATE.source}`, 'gi');
  const isEvent = new RegExp(EVENT_GATE.source, 'i');
  let m;
  const seenSentence = new Set();
  while ((m = gate.exec(s)) !== null) {
    if (m[0].length === 0) { gate.lastIndex += 1; continue; }
    const line = lineAt(s, m.index);
    const sentence = sentenceAt(s, m.index);
    // One sentence is one candidate however many catch words it contains — "caught … catch"
    // in one clause is one claim, and counting the words would inflate every window.
    const sigKey = `${source}|${line}|${sentence.slice(0, 80)}`;
    if (seenSentence.has(sigKey)) continue;
    seenSentence.add(sigKey);

    const matchable = forMatching(sentence);
    const ctx = { line: rawLines[line - 1] || '' };
    const filter = MENTION_FILTERS.find((f) => f.test(matchable, ctx));
    if (filter) {
      dropped.push({ source, line, rule: filter.key, sentence, window: marks[line - 1] });
      continue;
    }

    // Event-shaped or noun-shaped, decided on the SENTENCE rather than on which alternative of
    // the combined gate happened to match first: "the deepest catch of the night, and he caught
    // it twice" is an event, and a gate-order accident must not file it as weak.
    const record = {
      source,
      line,
      window: marks[line - 1] || 'undated',
      subject: namedSubject(sentence),
      sentence,
    };
    if (!isEvent.test(matchable)) {
      weak.push(record);
      continue;
    }
    const rule = ATTRIBUTION_RULES.find((r) => r.re.test(matchable));
    events.push({ ...record, bucket: rule ? rule.bucket : 'unattributed', rule: rule ? rule.key : null });
  }
  return { events, dropped, weak };
}

// Ledger sentences are the author's tally, not an event report. Extracting them as events too
// would count the same catches twice within a single file — the "one catch, three mentions"
// hazard in its most predictable form. Removed from the event stream, and reported.
function separateLedgerSentences(events, ledgers) {
  const inLedger = (e) =>
    ledgers.some((l) => l.source === e.source && e.line >= l.line && e.line <= (l.lineEnd || l.line));
  const kept = [];
  const removed = [];
  for (const e of events) {
    if (inLedger(e)) removed.push({ ...e, rule: 'ledger-line' });
    else kept.push(e);
  }
  return { kept, removed };
}

// ---------------------------------------------------------------- deduplication --
//
// A catch mentioned in three places is one catch. Merge only when the same named subject is
// attributed to the same bucket. Where no subject can be recovered the events are LEFT
// SEPARATE and marked `no-signature`, because a false merge deletes a real catch silently
// while a false split is visible in the printed list and costs one reader-minute.
function dedupe(events) {
  const byKey = new Map();
  const kept = [];
  const merges = [];
  let unkeyed = 0;
  for (const e of events) {
    if (!e.subject) {
      unkeyed += 1;
      kept.push({ ...e, dedupe: 'no-signature' });
      continue;
    }
    const key = `${e.window}|${e.bucket}|${e.subject}`;
    if (byKey.has(key)) {
      const first = byKey.get(key);
      first.mentions += 1;
      merges.push({ key, kept: { source: first.source, line: first.line }, merged: { source: e.source, line: e.line }, sentence: e.sentence });
      continue;
    }
    const rec = { ...e, dedupe: 'keyed', mentions: 1 };
    byKey.set(key, rec);
    kept.push(rec);
  }
  return { kept, merges, unkeyed };
}

// ------------------------------------------------------------------- the rollup --

function emptyWindow(day) {
  const counts = {};
  for (const b of BUCKETS) counts[b] = 0;
  return {
    window: day,
    counts,
    declared: { self: null, committee: null, keeper: null },
    declared_disagreements: [],
    dropped: {},
    ratio: null,
    ratio_withheld: null,
  };
}

// The metric as the map defines it: self AND committee (the room) against keeper (outside).
// `self_vs_keeper` is reported beside it because tell-index computes that one over the board,
// and two gauges naming the same word differently is how a room ends up arguing about a
// number instead of reading it.
function ratiosFor(c) {
  const inward = c.self + c.committee;
  return {
    inward_vs_keeper: c.keeper === 0 ? null : Number((inward / c.keeper).toFixed(2)),
    self_vs_keeper: c.keeper === 0 ? null : Number((c.self / c.keeper).toFixed(2)),
  };
}

function buildLedger(files) {
  const windows = new Map();
  const allEvents = [];
  const allDropped = [];
  const allLedgers = [];
  const allUnparsed = [];
  const allLedgerSentences = [];
  const allWeak = [];

  for (const f of files) {
    const text = fs.readFileSync(f.path, 'utf8').replace(/^﻿/, '');
    const source = f.label;
    const fallback = dateFromFilename(f.path);
    const marks = windowsFor(text, fallback);
    // A ledger paragraph is written inside the section it tallies, so the section's date is
    // the right window for it — the same rule the events use, applied to the same line map.
    const ledgers = parseLedgers(text, source).map((l) => ({ ...l, window: marks[l.line - 1] || 'undated' }));
    allLedgers.push(...ledgers);
    allUnparsed.push(...unparsedLedgers(text, source, ledgers));

    const { events, dropped, weak } = extractEvents(text, source, fallback);
    const split = separateLedgerSentences(events, ledgers);
    allEvents.push(...split.kept);
    allLedgerSentences.push(...split.removed);
    allDropped.push(...dropped);
    allWeak.push(...weak);
  }

  const { kept, merges, unkeyed } = dedupe(allEvents);

  for (const e of kept) {
    if (!windows.has(e.window)) windows.set(e.window, emptyWindow(e.window));
    windows.get(e.window).counts[e.bucket] += 1;
  }
  for (const d of allDropped) {
    const w = d.window || 'undated';
    if (!windows.has(w)) windows.set(w, emptyWindow(w));
    const bag = windows.get(w).dropped;
    bag[d.rule] = (bag[d.rule] || 0) + 1;
  }

  // Declared totals attach to the window their line falls in. Summed rather than overwritten:
  // one section may state a bucket more than once, and taking the last would silently drop the
  // earlier statement instead of showing both to a reader.
  for (const l of allLedgers) {
    if (!windows.has(l.window)) windows.set(l.window, emptyWindow(l.window));
    const w = windows.get(l.window);
    w.declared[l.bucket] = (w.declared[l.bucket] || 0) + l.stated;
    if (l.agrees === false) {
      w.declared_disagreements.push({ source: l.source, line: l.line, bucket: l.bucket, stated: l.stated, enumerated: l.enumerated });
    }
  }

  for (const w of windows.values()) {
    const c = w.counts;
    const attributed = c.self + c.committee + c.keeper + c.instrument;
    // The refusal, and it is the point of the whole file: a ratio computed under more
    // unknowns than knowns is a number that will be quoted and cannot be defended.
    if (c.unattributed > attributed) {
      w.ratio_withheld = `unattributed ${c.unattributed} > attributed ${attributed}`;
      w.ratio = null;
    } else {
      w.ratio = ratiosFor(c);
    }
  }

  return {
    windows: [...windows.values()].sort((a, b) => (a.window < b.window ? -1 : 1)),
    events: kept,
    merges,
    dropped: allDropped,
    weak: allWeak,
    ledgers: allLedgers,
    unparsed_ledgers: allUnparsed,
    ledger_sentences: allLedgerSentences,
    meta: {
      files: files.map((f) => f.label),
      events_extracted: allEvents.length,
      events_after_dedupe: kept.length,
      merged_away: merges.length,
      no_signature: unkeyed,
      dropped_as_mention: allDropped.length,
      ledger_sentences_separated: allLedgerSentences.length,
      weak_uncounted: allWeak.length,
      buckets: BUCKETS,
    },
  };
}

// -------------------------------------------------------------------- rendering --

function table(rows, heads, aligns) {
  const widths = heads.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cells) =>
    cells.map((c, i) => (aligns[i] === 'r' ? String(c).padStart(widths[i]) : String(c).padEnd(widths[i]))).join('  ');
  return [line(heads), line(widths.map((w) => '─'.repeat(w))), ...rows.map(line)].join('\n');
}

function render(index) {
  const out = [];
  const m = index.meta;
  out.push(`catch-ledger — ${index.windows.length} window${index.windows.length === 1 ? '' : 's'} over ${m.files.length} file${m.files.length === 1 ? '' : 's'}`);
  out.push(
    `${m.events_extracted} candidate events · ${m.merged_away} merged as repeat mentions · ` +
      `${m.events_after_dedupe} counted · ${m.dropped_as_mention} dropped as mentions · ` +
      `${m.ledger_sentences_separated} ledger sentences held out of the event stream`
  );
  out.push('');

  out.push('EXTRACTED — individual catches attributed in prose, deduplicated by named subject');
  out.push('');
  const rows = index.windows.map((w) => [
    w.window,
    w.counts.self,
    w.counts.committee,
    w.counts.keeper,
    w.counts.instrument,
    w.counts.unattributed,
    w.ratio_withheld ? 'withheld' : w.ratio.inward_vs_keeper == null ? '—' : `${w.ratio.inward_vs_keeper}:1`,
    w.ratio_withheld ? 'withheld' : w.ratio.self_vs_keeper == null ? '—' : `${w.ratio.self_vs_keeper}:1`,
  ]);
  out.push(
    table(rows, ['window', 'self', 'cmte', 'keeper', 'instr', 'unattr', 'inward:keeper', 'self:keeper'], [
      'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r',
    ])
  );
  out.push('');
  out.push(
    '  inward:keeper = (self + committee) : keeper — the metric as muscle_map defines it.\n' +
      '  self:keeper is reported beside it because tell-index computes that one over the board;\n' +
      '  two gauges using one word differently is how a room argues about a number.\n' +
      '  "withheld" means unattributed events outnumbered attributed ones in that window. No\n' +
      '  ratio is printed there, on purpose: a number nobody can defend is worse than none.'
  );
  out.push('');

  const withheld = index.windows.filter((w) => w.ratio_withheld);
  if (withheld.length) {
    out.push('  withheld: ' + withheld.map((w) => `${w.window} (${w.ratio_withheld})`).join(' · '));
    out.push('');
  }

  out.push('DECLARED — the hand-written tallies already in the record, with their own arithmetic checked');
  out.push('');
  if (!index.ledgers.length) {
    out.push('  (none found)');
  } else {
    const lRows = index.ledgers.map((l) => [
      `${l.source}:${l.line}`,
      l.bucket,
      l.stated,
      l.enumerated == null ? '—' : l.enumerated,
      l.agrees == null ? 'no list' : l.agrees ? 'agrees' : 'MISMATCH',
    ]);
    out.push(table(lRows, ['where', 'bucket', 'stated', 'enumerated', 'check'], ['l', 'l', 'r', 'r', 'l']));
    const bad = index.ledgers.filter((l) => l.agrees === false);
    if (bad.length) {
      out.push('');
      for (const b of bad) out.push(`  MISMATCH ${b.source}:${b.line} — states ${b.stated}, lists ${b.enumerated}: ${b.items.join(' | ')}`);
    }
  }
  out.push('');
  if (index.unparsed_ledgers.length) {
    out.push('  ledger statements with no extractable total (not guessed at):');
    for (const u of index.unparsed_ledgers) out.push(`    ${u.source}:${u.line} [${u.bucket}] ${u.sentence.slice(0, 150)}`);
    out.push('');
  }

  out.push('RECONCILIATION — declared vs extracted. These are different measurements of one record;');
  out.push('a gap is information about the record, not an error to smooth away.');
  out.push('');
  const decl = { self: 0, committee: 0, keeper: 0 };
  for (const l of index.ledgers) decl[l.bucket] += l.stated;
  const ext = { self: 0, committee: 0, keeper: 0 };
  for (const w of index.windows) for (const b of ['self', 'committee', 'keeper']) ext[b] += w.counts[b];
  out.push(
    table(
      ['self', 'committee', 'keeper'].map((b) => [b, decl[b], ext[b], ext[b] - decl[b]]),
      ['bucket', 'declared', 'extracted', 'delta'],
      ['l', 'r', 'r', 'r']
    )
  );
  out.push('');
  out.push(
    '  They are NOT summed anywhere. Declared totals come from ledger paragraphs the author\n' +
      '  wrote; extracted counts come from prose attributions across the whole corpus, including\n' +
      '  every cycle before ledgers were being written. A large positive delta is expected and is\n' +
      '  not evidence of a bug in either.'
  );
  out.push('');

  const dropRules = {};
  for (const d of index.dropped) dropRules[d.rule] = (dropRules[d.rule] || 0) + 1;
  out.push(
    'DROPPED AS MENTIONS: ' +
      (Object.keys(dropRules).length ? Object.entries(dropRules).map(([k, v]) => `${k}=${v}`).join(' · ') : 'none') +
      `  (--show dropped to read them)`
  );
  out.push(
    `DEDUPLICATION: ${m.merged_away} merged · ${m.no_signature} events had no recoverable named subject and were LEFT SEPARATE`
  );
  out.push(
    `WEAK, NOT COUNTED: ${m.weak_uncounted} sentences use "catch" as a noun rather than reporting an\n` +
      '  event ("what grows is the catch"). Scored nowhere. A real event phrased without the verb\n' +
      '  lives in here, so this list is meant to be read, not ignored (--show weak).'
  );
  out.push('');
  out.push(
    'These are candidates. Every count here can be walked back to a file and line (--show <bucket>),\n' +
      'and a reader who disagrees with one should overrule that line, not the instrument. This file\n' +
      'never decides whether something was a catch — it decides where the record says one was.'
  );
  return out.join('\n');
}

function renderShow(index, which) {
  if (which === 'dropped') {
    if (!index.dropped.length) return 'nothing was dropped as a mention.';
    return index.dropped
      .map((d) => `${d.source}:${d.line}  [${d.rule}]\n  ${d.sentence}`)
      .join('\n\n');
  }
  if (which === 'merged') {
    if (!index.merges.length) return 'nothing was merged.';
    return index.merges
      .map((x) => `${x.key}\n  kept    ${x.kept.source}:${x.kept.line}\n  merged  ${x.merged.source}:${x.merged.line}\n  ${x.sentence}`)
      .join('\n\n');
  }
  if (which === 'weak') {
    if (!index.weak.length) return 'no weak candidates.';
    return index.weak.map((w) => `${w.source}:${w.line}  [${w.window}]\n  ${w.sentence}`).join('\n\n');
  }
  if (which === 'ledger-sentences') {
    if (!index.ledger_sentences.length) return 'no ledger sentences were held out.';
    return index.ledger_sentences.map((e) => `${e.source}:${e.line}\n  ${e.sentence}`).join('\n\n');
  }
  const rows = index.events.filter((e) => e.bucket === which);
  if (!rows.length) return `no events in bucket "${which}".`;
  return rows
    .map(
      (e) =>
        `${e.source}:${e.line}  [${e.window}]  rule=${e.rule || 'none'}  subject=${e.subject || '—'}` +
        (e.mentions > 1 ? `  (+${e.mentions - 1} repeat mention${e.mentions > 2 ? 's' : ''})` : '') +
        `\n  ${e.sentence}`
    )
    .join('\n\n');
}

// -------------------------------------------------------------------------- CLI --

function defaultFiles(root) {
  const files = [];
  const map = path.join(root, 'exo_memory', 'muscle_map.md');
  if (fs.existsSync(map)) files.push({ path: map, label: 'muscle_map.md' });
  const jdir = path.join(root, 'exo_memory', 'journal');
  if (fs.existsSync(jdir)) {
    for (const f of fs.readdirSync(jdir).filter((n) => n.endsWith('.md')).sort()) {
      files.push({ path: path.join(jdir, f), label: `journal/${f}` });
    }
  }
  return files;
}

function parseArgs(argv) {
  const a = { json: false, show: null, since: null, root: null, file: [] };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--json') a.json = true;
    else if (k === '--show') a.show = argv[++i];
    else if (k === '--since') a.since = argv[++i];
    else if (k === '--root') a.root = argv[++i];
    else if (k === '--file') a.file.push(argv[++i]);
  }
  return a;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const root = a.root || path.resolve(__dirname, '..', '..');
  const files = a.file.length ? a.file.map((p) => ({ path: p, label: path.basename(p) })) : defaultFiles(root);
  if (!files.length) {
    console.error(`no sources found under ${root} (expected exo_memory/muscle_map.md and exo_memory/journal/*.md)`);
    process.exit(1);
  }
  const index = buildLedger(files);
  if (a.since) {
    index.windows = index.windows.filter((w) => w.window >= a.since);
    index.events = index.events.filter((e) => e.window >= a.since);
  }
  if (a.json) console.log(JSON.stringify(index, null, 2));
  else if (a.show) console.log(renderShow(index, a.show));
  else console.log(render(index));
}

if (require.main === module) main();

module.exports = {
  BUCKETS,
  ATTRIBUTION_RULES,
  stripCode,
  lineAt,
  sentenceAt,
  isHeading,
  isMetricDefinition,
  isGenericClass,
  namedSubject,
  parseLedgers,
  unparsedLedgers,
  windowsFor,
  extractEvents,
  separateLedgerSentences,
  dedupe,
  buildLedger,
  ratiosFor,
  render,
};
