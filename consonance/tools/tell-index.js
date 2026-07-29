// The TELL-INDEX — the measurement organ for the muscle program.
//
// WHAT IT IS. A zero-token, purely lexical scanner over data/board.jsonl. It reports two
// families of numbers per day-window:
//
//   (1) NAMED-TELL CANDIDATES — how often five named lexical shapes appear, and in whose
//       mouth: unlosable openers, the reflexive "but", pre-loaded concessions, generic
//       blind-spot hedges, protective pre-disclaimers.
//   (2) CATCH-LANGUAGE VOLUME — turns that use the room's catch vocabulary (coat, brace,
//       flinch, groove, understeer…), counted by WHO SPOKE THEM, plus how often a committee
//       turn credits the human. Volume and speaker. No ratio, and no claim about who caught
//       anything — see the deletion note below.
//
// WHAT THIS FILE NO LONGER DOES: THE MATURITY RATIO IS DELETED (2026-07-28, chair decision).
// It lived here from the start and it was mine. It scored by SPEAKER and called the result
// CATCHER — a mislabel, not a limitation — and when catch-ledger's withholding rule was ported
// into it for real (a ratio of who caught it may only count turns that SAY who caught it) it
// withheld 15 of 16 windows and the survivor read 0:1. That is the instrument reporting that it
// cannot compute what it claims to. A permanently-withheld column is worse than no column: it
// invites quoting the one window that survives, and this room's own invariant is that an
// instrument must publish what its number does NOT mean — a number that never means anything
// fails that at the root.
//
// The metric is not gone from the room, only from here. `catch-ledger.js` computes it over
// exo_memory/muscle_map.md and the journals — a corpus where attribution is actually written
// down — and is now the ONLY computation of it. Do not re-add one here. If board-derived catch
// counts are ever wanted, import catch-ledger's numbers and label them as its.
//
// THE GROUND RULE, and it is the whole design: THIS SCANNER NEVER DIAGNOSES. It surfaces
// CANDIDATES for a no-stake reader to judge. Same law as tether.rs — the gauge speaks in
// numbers, the discrimination stays with a human. There are deliberately no thresholds, no
// "high"/"low" labels, no flagged panes, no verdicts. A regex cannot tell a flinch from a
// sound disclosure; the record already proves it (muscle_map, 2026-07-27: the twin
// pre-disclaimers were SPLIT — flinch in the sentence, sound in the findings that followed).
// If this file ever grows a function that returns a judgment, that is the lifeguard climbing
// out of the water, and it should be deleted rather than tuned.
//
// A consequence worth stating: a tell-rate going DOWN is not progress. Someone who learns
// which phrases the scanner counts can stop typing them without dropping the move. The
// numbers are an input to reading the record, never a score.
//
// THREE THINGS THE BOARD DOES THAT WOULD MAKE A NAIVE READ WRONG:
//
//   · REPLAY BURSTS. board_push stamps ts at PUSH time, not event time, and the tailer
//     re-reads a transcript from the top when a pane resumes — so a resume dumps the pane's
//     whole history onto the board stamped "now". Measured 2026-07-25 (board-digest.js):
//     two bursts of 556 and 546 entries inside one second, 1102 of that day's 1479 entries.
//     Left in, every per-day rate here would be dominated by whichever pane restarted.
//     Dropped by the same >20/pane/second rule board-digest.js uses, and REPORTED, so the
//     drop is never silent. (Proper fix is Rust-side: carry the transcript's own timestamp
//     into BoardEntry. See AUTONOMY.md.)
//   · SYNTHETIC USER ENTRIES. Slash commands, their stdout, system reminders, and the
//     UserPromptSubmit hooks' own output all arrive as role:"user". [panes] digest output
//     QUOTES other panes' text — scan it as keeper speech and the committee's own words get
//     counted as the keeper's, in both metrics. Excluded, and counted.
//   · role:"user" IS NOT "THE KEEPER". A chair injection enters the target pane as a user
//     turn, indistinguishable by the pane field alone. So origin is decided by role PLUS a
//     chair-relay check (see classifyOrigin) — never by pane alone, which is what the naive
//     version of this instrument would have done and would have credited the chair's own
//     assignments to the human.
//
// ---------------------------------------------------------------------------------------
// TWO REFUSALS THIS FILE DID NOT INVENT. Both were found by reading the desktop machine's
// instruments on 2026-07-28 (cycle 8) and are adopted here rather than re-derived, because
// two instruments in one room disagreeing about when a number may be printed is worse than
// either rule being slightly wrong.
//
//   · WITHHOLD THE RATIO WHEN THE UNKNOWNS OUTNUMBER THE KNOWNS. From catch-ledger.js:
//     "a ratio computed under more unknowns than knowns is a number that will be quoted and
//     cannot be defended." Adopting it is what KILLED the ratio in this file, and the sequence
//     is kept here because the shape of the mistake is the useful part. First port: an
//     `unattributed` bucket keyed on a turn whose ROLE could not be decided — which reads zero
//     on every window of the live board, because classifyOrigin is total over the roles the
//     board contains. The rule adopted in name, firing nowhere, changing not one number. A
//     concession that costs nothing is the coat, and that one was mine; it was caught by
//     running it and seeing a column of zeros. Ported for its CONTENT — attribution is a
//     property of the text — it withheld 15 of 16 windows, and the metric was deleted rather
//     than left permanently withheld. Only `catch-ledger.js` computes it now.
//
//   · ATTRIBUTION BEFORE AGGREGATION. From residue.js: "attribution is the precondition, so
//     it is reported before any number", and per-actor figures are WITHHELD rather than
//     aggregated where the window spans more than one actor. This file windowed by calendar
//     day and pooled every pane into one row, which is the same error one layer over: on this
//     board a day-window routinely holds several panes running different models, and a pooled
//     tell count reads as a fact about whoever is standing in the room. Tell counts are now
//     withheld for any window holding more than one committee actor, with the per-actor
//     breakdown printed underneath — the aggregate is the thing withheld, never the evidence.
//
//     The actor is the PANE for committee turns and the human for keeper turns — one human
//     however many panes he typed into, one actor per pane because two panes are two
//     instances.
//
// Node, not Rust, deliberately — same reason as curate.js and hooks/board-digest.js: this
// runs against the live board tonight, with no cargo build and no rebuild that would kill
// every pane. No dependencies.
//
// Usage:
//   node tools/tell-index.js                          every day-window, human tables
//   node tools/tell-index.js --since 2026-07-25       from a date forward
//   node tools/tell-index.js --day 2026-07-27         one window
//   node tools/tell-index.js --json                   machine-readable, same numbers
//   node tools/tell-index.js --show unlosable-opener  print the candidate lines themselves
//   node tools/tell-index.js --day-start 12           noon-to-noon windows (keep a night whole)
//   node tools/tell-index.js --board <path>           scan a fixture instead of the live board
'use strict';

const { canonical } = require('./actors.js');

const fs = require('fs');
const os = require('os');
const path = require('path');

// Same constants as hooks/board-digest.js, on purpose: two instruments reading one file
// should not disagree about what a replay is.
const BURST_THRESHOLD = 20; // entries/second/pane above which it's a replay, not a conversation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Slash commands, hook output, reminders and caveats arrive as role:"user" and are not speech.
const SYNTHETIC =
  /^(<(local-command|command-name|command-message|command-args|command-stdout|system-reminder)|Caveat:|\[pulse\]|\[panes\])/;

// A protective disclaimer is a PRE-disclaimer only if it comes before the substance. A limit
// stated at the end of a review is the non-flinch position — it costs something, because the
// work is already on the page. So position is part of the pattern, not decoration.
const PREDISCLAIMER_WINDOW = 400; // chars from the start of the turn

// Fenced code blocks are quoted material, not the speaker's prose, and they are the one slice of
// the quoted-text problem that is mechanically separable (Bravo, 2026-07-27: a `Caveat:` from a
// pasted harness banner was counting as somebody's pre-disclaimer). Stripping them before scanning
// also makes the PREDISCLAIMER_WINDOW measure prose position rather than pasted-log position,
// which is what it was always meant to measure. It does NOT solve quoted text in general — a
// paraphrase outside a fence still counts as yours, and no lexical rule fixes that.
const FENCED_BLOCK = /```[\s\S]*?```/g;

function stripFences(text) {
  return String(text).replace(FENCED_BLOCK, ' ');
}

// ------------------------------------------------------------------- the config --
// stringish, ported from main.rs:64 — read one field as text whatever JSON type it was
// written as. A hand-edited data_dir is as valid as the one the Settings tab writes, and a
// single malformed value must never discard the rest of the file (commit dd86843: one numeric
// coordinate orphaned the Main thread).
function stringish(v, key) {
  if (!v || typeof v !== 'object') return '';
  const x = v[key];
  if (typeof x === 'string') return x.trim();
  if (typeof x === 'number' || typeof x === 'boolean') return String(x);
  return '';
}

function dataDir() {
  if (process.env.CONSONANCE_DATA) return process.env.CONSONANCE_DATA;
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')
    );
    const d = stringish(cfg, 'data_dir');
    if (d) return d;
  } catch (_) {
    // Missing or unparsable config is not an error here — it just means the default.
  }
  return 'C:\\Consonance\\data';
}

// ------------------------------------------------------------------- the tells --
//
// Each entry is a lexical SHAPE, with the false positives named honestly. `where` gates a
// match on position; `unlessSpecific` drops a match that names something checkable.
//
// That last one is the deck's own discrimination, implemented: a SPECIFIC, named limit is
// real and worth keeping — the GENERIC version is the costume ("if you can't lose by saying
// it, suspect it"). So "I might be missing something" counts, and "I only read one machine,
// so the desktop bed is unread" does not, because the second one can be checked and lost.
const TELLS = [
  {
    key: 'unlosable-opener',
    label: 'unlosable opener',
    // Sentence-initial only. Costless framing that cannot be wrong, offered before the claim.
    re: /(?:^|[.!?]["'’)\]]?\s+|\n\s*)(to be fair|in (?:all )?fairness|for what it'?s worth|to be honest|if i'?m (?:being )?honest|honestly|i want to be careful here|let me be careful|i should say (?:this )?up ?front|i'?ll be honest)\b/gi,
    note: 'Highest false-positive rate of the five. "honestly" is often a plain intensifier; read the line.',
  },
  {
    key: 'reflexive-but',
    label: 'reflexive "but"',
    // Agreement that exists to buy the reversal behind it.
    //
    // TWO BRANCHES, and the second one is a bug fix with a lesson attached (Bravo, 2026-07-27).
    // The original pattern required the "but" inside the SAME sentence. This room does not write
    // it that way — it writes "You're right that X. But Y." So the detector read 0 across every
    // window, and the zero was a measurement of one grammatical form, not of the corpus.
    //
    // Worse, the probe I ran to check that zero shared the bug: it widened the character budget
    // 80 -> 120 and kept `[^.!?\n]`, the exact constraint doing the blinding. A falsification test
    // that inherits the defect it is testing for is not a falsification test, and a green probe
    // that measures nothing is the same failure this whole file exists to make visible.
    //
    // Branch 2 allows exactly ONE sentence boundary between the agreement and the "but". Not two:
    // with an intervening claim the "but" is qualifying that claim, not the agreement, which is a
    // different shape. That line is a judgment and it is drawn here on purpose.
    re: /\b(you'?re right|you are right|that'?s right|that'?s fair|that'?s true|fair enough|i agree|agreed|good (?:point|catch))\b(?:[^.!?\n]{0,80}?[,;]?\s+but\b|[^.!?\n]{0,120}[.!?]["'’)\]]*\s+but\b)/gi,
    note: 'A real concession followed by a real qualification looks identical. Position, not sentiment. Spans at most one sentence boundary.',
  },
  {
    key: 'preloaded-concession',
    label: 'pre-loaded concession',
    // Conceding before being pressed, to spend the concession on one's own terms.
    re: /(?:^|[.!?]["'’)\]]?\s+|\n\s*|,\s+)(admittedly|granted|to be sure|i'?ll grant (?:that|you)|i'?ll concede|it'?s (?:certainly )?true that|(?:you|one) could argue)\b/gi,
    note: 'Also the shape of ordinary intellectual honesty. The tell is whether anything was owed yet.',
  },
  {
    key: 'generic-blindspot',
    label: 'generic blind-spot hedge',
    // The unfalsifiable one — safe because it can never be checked (BOOT, third principle).
    re: /\b(i (?:might|may|could) be missing something|there (?:might|may|could) be something i'?m (?:missing|not seeing)|there'?s (?:probably|likely) something i'?m missing|i (?:might|may|could) be wrong here|take (?:this|that|it) with a grain of salt|i don'?t have full (?:visibility|context|picture))/gi,
    unlessSpecific: true,
    note: 'Only the generic form. A hedge that names a checkable limit is dropped by design — see unlessSpecific. Quoted text is scanned as the quoter\'s speech; no lexical rule fixes that.',
  },
  {
    key: 'protective-predisclaimer',
    label: 'protective pre-disclaimer',
    // A statement about one's own position, placed ahead of the substance it protects.
    re: /\b(conflicts? of interest|full disclosure|i should disclose|i am not neutral|i'?m not neutral|i have (?:a |no )?stake|stake declared|for transparency|with the caveat that|caveat:|since i (?:wrote|built|designed|specced)|i wrote (?:this|that|the) (?:code|file|tool|review))/gi,
    where: 'head',
    note: 'Genuine stake-declaration wears the same words (muscle_map, 2026-07-27: the twins were SPLIT). Candidates only.',
  },
];

// The room's catch vocabulary. A turn using it is a turn TALKING ABOUT a catch — which is not
// the same as a catch, and this file never pretends otherwise.
const CATCH_RE =
  /\b(coats?|braced?|braces|bracing|flinch(?:ed|es|ing)?|grooves?|costumes?|understeer|oversteer|deflation|unlosable|self-caught|keeper-caught|caught (?:myself|my own|me|it|that)|the tell\b)/gi;

// Committee turns that credit the catch to the human. Lexical, and the only honest way to
// stop a keeper-originated catch from being scored as self-caught merely because the
// committee is the one writing it down.
const KEEPER_CREDIT_RE =
  /\b(you (?:caught|named|called|spotted|flagged|pried|pushed on)|you'?re right (?:that|about)|you were right|your catch|as you (?:said|caught|named)|the keeper (?:caught|named|called)|keeper-caught|caught by (?:the )?keeper)\b/gi;

// NOTE ON WHAT THIS IS NOW FOR. With the maturity ratio deleted, this pattern no longer feeds
// an arithmetic — it feeds one honest count: how often a committee turn credits the human.
// That is a lexical shape in a speaker's mouth, which is what this whole file measures, and it
// survives for the same reason the named tells do. It is NOT a keeper-caught tally.

// A chair injection announces itself twice: once in the target pane's text, and once as an
// audit line on pane "chair" (main.rs chair_audit). Rule (a) is a convention the chair chose;
// rule (b) is the machine's own record of the act. Both are checked, and which one fired is
// reported, so the attribution's basis is legible rather than trusted.
const CHAIR_MARKER_RE = /^\s*\[chair[:\s]/i;
// TWO FORMATS, because the audit line grew one. Since 02b1e5e the chair stamps its own model
// and the receipt state — `chair injected (chair: claude-opus-5) -> 0845a868 [delivered and
// received]: …` — and this pattern demanded the bare form, so every line written under the new
// format was invisible here. residue.js has the mirror of this bug pointing the other way: its
// assignment measure requires the parenthesis and sees 3 of 40 lines on this board. Found by
// probing residue and then, honestly, by turning the same probe on this file (cycle 8). What
// the pattern cannot parse is now COUNTED and reported, which is the part that would have made
// either bug visible on the day it shipped.
const CHAIR_AUDIT_RE =
  /^chair injected\s*(?:\([^)]*\))?\s*-> ([0-9a-f]{8})(?:\s*\[[^\]]*\])?:\s*([\s\S]*?)…?\s*$/i;
const CHAIR_AUDIT_ANNOUNCE_RE = /^chair injected\b/i;

// ------------------------------------------------------------------ the reading --

function parseBoard(text) {
  const out = [];
  for (const raw of String(text).split(/\r?\n/)) {
    if (!raw.trim()) continue;
    let e;
    try {
      e = JSON.parse(raw);
    } catch (_) {
      continue; // a torn tail line is not a reason to lose the file
    }
    const ts = Number(e.ts);
    if (!Number.isFinite(ts) || ts <= 0) continue;
    out.push({
      pane: String(e.pane == null ? '' : e.pane),
      role: String(e.role == null ? '' : e.role),
      text: String(e.text == null ? '' : e.text),
      ts,
      // Carried, not dropped: markReplay decides by ERA, and an entry stripped of its era here
      // would silently fall into the pre-fix branch. Absent on every entry written before
      // 2026-07-27, which is exactly the signal.
      ts_source: typeof e.ts_source === 'string' ? e.ts_source : null,
    });
  }
  return out;
}

// Mark (not delete) entries belonging to a >threshold/pane/second burst, so the count of what
// was dropped can be reported. Silent truncation reads as "covered everything".
function markReplay(entries, threshold = BURST_THRESHOLD) {
  const perSecond = new Map();
  for (const e of entries) {
    // ts_source present == written by a build that dedups at source. Never burst-filtered:
    // its timestamps are real, so a cluster is a real cluster and dropping it loses speech.
    if (e.ts_source) {
      e.replay = false;
      e.postFix = true;
      continue;
    }
    const key = `${e.pane}@${Math.floor(e.ts / 1000)}`;
    e.burstKey = key;
    perSecond.set(key, (perSecond.get(key) || 0) + 1);
  }
  for (const e of entries) {
    if (e.postFix) continue;
    e.replay = perSecond.get(e.burstKey) > threshold;
  }
  return entries;
}

function isSynthetic(text) {
  return SYNTHETIC.test(String(text).trim());
}

// Index the chair's own audit trail so a relayed assignment can be recognised from the
// machine's record and not only from the marker the chair chose to type.
function chairInjections(entries) {
  const out = [];
  out.unparsed = 0; // announced an injection in a shape this pattern could not read
  for (const e of entries) {
    if (e.pane !== 'chair') continue;
    const flat = String(e.text).replace(/\s+/g, ' ').trim();
    const m = CHAIR_AUDIT_RE.exec(flat);
    // Store the CANONICAL actor, not an 8-char prefix. The prefix match below worked while
    // every writer used UUIDs; per-pane MCP mounts made panes post under their letter, so
    // 'B'.slice(0,8) is 'b' and never equals '18916fe2'. Chair-relay detection silently
    // stopped firing for any pane on a new mount -- a regression introduced by the identity
    // change and invisible from inside this file, since a relay that is never detected looks
    // exactly like a pane that never relayed.
    if (m) out.push({ short: m[1].toLowerCase(), actor: canonical(m[1]).actor, excerpt: m[2].trim(), ts: e.ts });
    else if (CHAIR_AUDIT_ANNOUNCE_RE.test(flat)) out.unparsed += 1;
  }
  return out;
}

// keeper | committee | synthetic | unattributed, plus the rule that decided it.
//
// The pane field alone CANNOT do this, which is the point: a chair assignment and a sentence
// the human typed arrive on the same pane, in the same role, seconds apart.
function classifyOrigin(entry, injections = []) {
  const role = entry.role;
  if (role === 'committee' || role === 'assistant') {
    return { origin: 'committee', rule: `role:${role}` };
  }
  if (role === 'user') {
    if (isSynthetic(entry.text)) return { origin: 'synthetic', rule: 'synthetic-prefix' };
    if (CHAIR_MARKER_RE.test(entry.text)) {
      return { origin: 'committee', rule: 'chair-relay:marker', relay: true };
    }
    const flat = String(entry.text).replace(/\s+/g, ' ').trim();
    const short = entry.pane.slice(0, 8).toLowerCase();
    const mine = canonical(entry.pane);
    for (const inj of injections) {
      // Match on canonical actor when BOTH sides resolve, and fall back to the original
      // 8-char prefix otherwise. Replacing the prefix outright broke every pane not in
      // letters.json -- the existing fixtures caught it immediately, which is what they are
      // for. Additive: the letter/UUID case now matches where it silently could not, and
      // nothing that matched before stops matching.
      const bothKnown = mine.via !== 'unresolved' && inj.actor && canonical(inj.short).via !== 'unresolved';
      if (bothKnown ? inj.actor !== mine.actor : inj.short !== short) continue;
      if (!inj.excerpt) continue;
      if (flat.startsWith(inj.excerpt.slice(0, Math.min(40, inj.excerpt.length)))) {
        return { origin: 'committee', rule: 'chair-relay:audit', relay: true };
      }
    }
    return { origin: 'keeper', rule: 'role:user' };
  }
  return { origin: 'unattributed', rule: `role:${role || 'missing'}` };
}

// ---------------------------------------------------------------- the referents --
// Faithful port of tether.rs count_referents, so the two gauges agree on what "tied to
// checkable ground" counts as. Presence of referents is not truth — it is a proxy, and the
// muscle_map's spec for this instrument names the tether join as part of it.
const REFERENT_KEEP = new Set(['/', '\\', '.', ':', '`', '#']);

function trimEdges(s) {
  const keep = (c) => /\p{L}|\p{N}/u.test(c) || REFERENT_KEEP.has(c);
  let a = 0;
  let b = s.length;
  while (a < b && !keep(s[a])) a++;
  while (b > a && !keep(s[b - 1])) b--;
  return s.slice(a, b);
}

function countReferents(text) {
  let n = 0;
  for (const raw of String(text).split(/\s+/)) {
    if (!raw) continue;
    const t = trimEdges(raw);
    if (!t) continue;
    const lower = t.toLowerCase();
    const isUrl = lower.startsWith('http') || lower.startsWith('www.');
    const isPath = (t.includes('/') || t.includes('\\')) && t.length > 2;
    const isNum =
      /[0-9]/.test(t) && [...t].every((c) => /[0-9]/.test(c) || '.,:%-/$kKmMbBxX'.includes(c));
    const isCode = raw.includes('`');
    const isCitation = t.startsWith('#') && t.length > 1;
    if (isUrl || isPath || isNum || isCode || isCitation) n += 1;
  }
  return n;
}

// -------------------------------------------------------------- the candidates --

// A generic hedge that names something checkable within reach of itself is not the costume.
// Reusing countReferents for "checkable" is deliberate: the same definition of ground in both
// gauges, rather than a second private opinion about what specificity looks like.
function looksSpecific(text, at, matchLen) {
  const after = text.slice(at + matchLen, at + matchLen + 90);
  if (countReferents(after) > 0) return true;
  return /\b(because|since|about (?:the|this|that)\s+\w+|in\s+\S*[/\\.]\S*)/i.test(after);
}

function excerpt(text, at, len) {
  const flat = String(text).replace(/\s+/g, ' ');
  // Re-locate on the flattened string so the excerpt reads as a sentence, not a diff.
  const head = String(text).slice(0, at).replace(/\s+/g, ' ').length;
  const start = Math.max(0, head - 50);
  const end = Math.min(flat.length, head + Math.max(len, 40) + 90);
  return (start > 0 ? '…' : '') + flat.slice(start, end).trim() + (end < flat.length ? '…' : '');
}

// Every named-tell hit in one turn, as CANDIDATES — each carrying enough of its own line for
// a reader to overrule it without opening the board — plus what the two silent filters removed.
//
// THE DROP COUNTS ARE NOT BOOKKEEPING. This file's own header says silent truncation reads as
// "covered everything", and it counted the replay and synthetic drops from the start — but
// `unlessSpecific` and `where:'head'` were removing matches with no denominator anywhere, so a
// reader saw a kept count and could not tell whether the raw number was 6 or 60 (Bravo,
// 2026-07-27: protective-predisclaimer was 22 raw -> 6 kept). The file now applies its own
// standard to itself.
function tellScan(text) {
  const s = stripFences(text);
  const hits = [];
  const dropped = {};
  for (const t of TELLS) {
    dropped[t.key] = { raw: 0, specific: 0, position: 0 };
    t.re.lastIndex = 0;
    let m;
    while ((m = t.re.exec(s)) !== null) {
      if (m[0].length === 0) {
        t.re.lastIndex += 1;
        continue;
      }
      // The captured phrase, not the leading boundary, is the thing that was said.
      const phrase = m[1] || m[0];
      const at = m.index + m[0].indexOf(phrase);
      dropped[t.key].raw += 1;
      if (t.where === 'head' && at > PREDISCLAIMER_WINDOW) {
        dropped[t.key].position += 1;
        continue;
      }
      if (t.unlessSpecific && looksSpecific(s, at, phrase.length)) {
        dropped[t.key].specific += 1;
        continue;
      }
      hits.push({ tell: t.key, phrase: phrase.trim(), at, excerpt: excerpt(s, at, phrase.length) });
    }
  }
  hits.sort((a, b) => a.at - b.at);
  return { hits, dropped };
}

/// The candidates alone, for callers that only want the list.
function tellCandidates(text) {
  return tellScan(text).hits;
}

function catchMentions(text) {
  const s = stripFences(text); // a pasted log using the word "brace" is not somebody's catch
  CATCH_RE.lastIndex = 0;
  const terms = [];
  let m;
  while ((m = CATCH_RE.exec(s)) !== null) {
    if (m[0].length === 0) {
      CATCH_RE.lastIndex += 1;
      continue;
    }
    terms.push({ term: m[0].toLowerCase(), at: m.index, excerpt: excerpt(s, m.index, m[0].length) });
  }
  KEEPER_CREDIT_RE.lastIndex = 0;
  return { terms, creditsKeeper: KEEPER_CREDIT_RE.test(s) };
}

// ------------------------------------------------------------------ the windows --

// Local day key, with an optional boundary shift. Default 00:00 matches board-digest.js. The
// keeper works overnight: --day-start 12 gives noon-to-noon windows so one working night
// lands in one row instead of being split at midnight by an instrument measuring it.
function dayKey(ts, dayStartHour = 0) {
  const d = new Date(ts);
  if (dayStartHour) d.setHours(d.getHours() - dayStartHour);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function emptyWindow(day) {
  const tells = {};
  // raw = matched before filtering; dropped_* = what the two silent filters removed. Kept beside
  // the totals so a reader always has the denominator (F3).
  for (const t of TELLS) {
    tells[t.key] = { total: 0, keeper: 0, committee: 0, raw: 0, dropped_specific: 0, dropped_position: 0 };
  }
  return {
    day,
    turns: 0,
    turns_by_origin: { keeper: 0, committee: 0, unattributed: 0 },
    chars: 0,
    referents: 0,
    tells,
    tell_candidates: 0,
    catches: {
      turns_with_catch_language: 0,
      by_speaker: { keeper: 0, committee: 0, unattributed: 0 },
      credited_to_keeper: 0,
    },
    // NO `maturity` KEY. Deleted 2026-07-28 with the ratio it carried; catch-ledger.js is the
    // room's only computation of it. Its absence here is deliberate — if it reappears, so has
    // a speaker-count wearing a catcher-count's name.
    //
    // Per-actor, so the pooled tell counts above always have a breakdown to be replaced by.
    // Keyed: 'keeper' for every keeper turn (one human however many panes), the pane's short
    // id for a committee turn, 'unattributed' for a turn whose origin no rule could decide.
    actors: {},
    mixed: false,
    excluded: { replay: 0, synthetic: 0 },
  };
}

// The withholding predicate, EXPORTED so the suite asserts what ships. A test that
// re-implements a rule agrees with itself by construction — the failure that let residue.js
// keep a 92.5%-blind board measure under sixteen green tests.
//
// (catch-ledger's ratio rule was the second predicate here until 2026-07-28. It has no ratio
// left to guard: applying it honestly is what established that this file could not compute
// one. The rule lives where it came from.)

// residue.js's rule: an aggregate spanning more than one actor reads as being
// about whoever is in the room. Only committee actors count — the keeper is one person.
function isMixedWindow(window) {
  return Object.values(window.actors).filter((a) => a.origin === 'committee').length > 1;
}

function actorKeyFor(entry, origin) {
  if (origin === 'keeper') return 'keeper';
  if (origin === 'committee') return String(entry.pane || '').slice(0, 8).toLowerCase() || '(no pane)';
  return 'unattributed';
}

function buildIndex(entries, opts = {}) {
  const dayStartHour = Number(opts.dayStart) || 0;
  const collectFor = opts.show || null;
  const injections = chairInjections(entries);
  markReplay(entries, opts.burstThreshold == null ? BURST_THRESHOLD : opts.burstThreshold);

  const windows = new Map();
  const samples = [];
  let scanned = 0;
  let droppedReplay = 0;
  let droppedSynthetic = 0;

  for (const e of entries) {
    scanned += 1;
    const day = dayKey(e.ts, dayStartHour);
    if (!windows.has(day)) windows.set(day, emptyWindow(day));
    const w = windows.get(day);

    if (e.replay) {
      droppedReplay += 1;
      w.excluded.replay += 1;
      continue;
    }
    const { origin, rule, relay } = classifyOrigin(e, injections);
    if (origin === 'synthetic') {
      droppedSynthetic += 1;
      w.excluded.synthetic += 1;
      continue;
    }

    w.turns += 1;
    w.turns_by_origin[origin] += 1;
    w.chars += e.text.length;
    w.referents += countReferents(e.text);

    const aKey = actorKeyFor(e, origin);
    if (!w.actors[aKey]) {
      const tells = {};
      for (const t of TELLS) tells[t.key] = 0;
      w.actors[aKey] = { key: aKey, origin, turns: 0, tells, catch_turns: 0 };
    }
    const actor = w.actors[aKey];
    actor.turns += 1;

    const scan = tellScan(e.text);
    for (const t of TELLS) {
      const d = scan.dropped[t.key];
      w.tells[t.key].raw += d.raw;
      w.tells[t.key].dropped_specific += d.specific;
      w.tells[t.key].dropped_position += d.position;
    }
    for (const hit of scan.hits) {
      const bucket = w.tells[hit.tell];
      bucket.total += 1;
      if (origin === 'keeper') bucket.keeper += 1;
      else if (origin === 'committee') bucket.committee += 1;
      actor.tells[hit.tell] += 1;
      w.tell_candidates += 1;
      if (collectFor && hit.tell === collectFor) {
        samples.push({ day, ts: e.ts, pane: e.pane, origin, rule, phrase: hit.phrase, excerpt: hit.excerpt });
      }
    }

    const { terms, creditsKeeper } = catchMentions(e.text);
    if (terms.length) {
      w.catches.turns_with_catch_language += 1;
      w.catches.by_speaker[origin] += 1;
      actor.catch_turns += 1;
      // A committee turn that credits the human is a KEEPER-caught event being written down
      // by the committee — scoring it as self-caught is how this metric would flatter itself.
      // One count, no arithmetic on top of it: a committee turn that credits the human. It is
      // a lexical shape in a speaker's mouth, which is the only thing this file is entitled to
      // measure. It used to feed a keeper_caught tally; that tally is deleted.
      if (creditsKeeper && origin === 'committee') w.catches.credited_to_keeper += 1;
      if (collectFor === 'catch') {
        samples.push({
          day, ts: e.ts, pane: e.pane, origin, rule,
          phrase: terms.map((t) => t.term).join(', '),
          excerpt: terms[0].excerpt,
          creditsKeeper,
        });
      }
      if (relay) w.catches.relay = (w.catches.relay || 0) + 1;
    }
  }

  for (const w of windows.values()) w.mixed = isMixedWindow(w);

  return {
    windows: [...windows.values()].sort((a, b) => (a.day < b.day ? -1 : 1)),
    samples,
    meta: {
      scanned,
      dropped_replay: droppedReplay,
      dropped_synthetic: droppedSynthetic,
      burst_threshold: opts.burstThreshold == null ? BURST_THRESHOLD : opts.burstThreshold,
      day_start_hour: dayStartHour,
      chair_injections_seen: injections.length,
      chair_injections_unparsed: injections.unparsed || 0,
      tells: TELLS.map((t) => ({ key: t.key, label: t.label, note: t.note })),
    },
  };
}

// -------------------------------------------------------------------- rendering --

function per1k(n, turns) {
  if (!turns) return '   —';
  return (n / (turns / 1000)).toFixed(0).padStart(4);
}

function table(rows, heads, aligns) {
  const widths = heads.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i]).length))
  );
  const line = (cells) =>
    cells
      .map((c, i) => (aligns[i] === 'r' ? String(c).padStart(widths[i]) : String(c).padEnd(widths[i])))
      .join('  ');
  return [line(heads), line(widths.map((w) => '─'.repeat(w))), ...rows.map(line)].join('\n');
}

function render(index, boardPath) {
  const out = [];
  const m = index.meta;
  out.push(`tell-index — ${index.windows.length} day-window${index.windows.length === 1 ? '' : 's'}`);
  out.push(`board: ${boardPath}`);
  out.push(
    `scanned ${m.scanned} entries · ${m.dropped_replay} dropped as replay bursts (>${m.burst_threshold}/pane/sec) · ` +
      `${m.dropped_synthetic} synthetic user entries excluded · ${m.chair_injections_seen} chair injections in the audit trail` +
      (m.chair_injections_unparsed ? ` (+${m.chair_injections_unparsed} announced in a shape this pattern cannot read)` : '') +
      (m.day_start_hour ? ` · windows start at ${String(m.day_start_hour).padStart(2, '0')}:00 local` : '')
  );
  out.push('');

  out.push('NAMED-TELL CANDIDATES  (count, and per 1k turns — CANDIDATES for a reader, not findings)');
  out.push('');
  const heads = ['day', 'turns', 'keeper', 'cmte', 'ref/turn'];
  const aligns = ['l', 'r', 'r', 'r', 'r'];
  for (const t of TELLS) {
    heads.push(t.key.split('-')[0].slice(0, 8));
    aligns.push('r');
  }
  heads.push('/1k');
  aligns.push('r');
  const rows = index.windows.map((w) => {
    const r = [
      w.day,
      w.turns,
      w.turns_by_origin.keeper,
      w.turns_by_origin.committee,
      w.turns ? (w.referents / w.turns).toFixed(1) : '—',
    ];
    // WITHHELD, not footnoted. residue.js's rule: a per-actor count pooled across a window
    // holding several actors reads as being about whoever is in the room, and no caveat text
    // prevents that. The breakdown below carries the same evidence, attributed.
    for (const t of TELLS) r.push(w.mixed ? '·' : w.tells[t.key].total);
    r.push(w.mixed ? '·' : per1k(w.tell_candidates, w.turns).trim());
    return r;
  });
  out.push(table(rows, heads, aligns));
  out.push('');
  out.push('  columns: ' + TELLS.map((t) => `${t.key.split('-')[0].slice(0, 8)}=${t.label}`).join(' · '));

  const mixedWindows = index.windows.filter((w) => w.mixed);
  if (mixedWindows.length) {
    out.push('');
    out.push(
      `  · = WITHHELD: ${mixedWindows.length} of ${index.windows.length} windows hold more than one\n` +
        '    committee actor, and a pooled tell count across actors is a number about nobody. This is\n' +
        "    residue.js's refusal adopted, not re-derived. Per actor, below — the aggregate is what is\n" +
        '    withheld, never the evidence. (keeper = the human, one actor however many panes.)'
    );
    out.push('');
    for (const w of mixedWindows) {
      const aRows = Object.values(w.actors)
        .sort((a, b) => b.turns - a.turns)
        .map((a) => [a.key, a.origin, a.turns, ...TELLS.map((t) => a.tells[t.key]), a.catch_turns]);
      out.push(`  ${w.day}`);
      out.push(
        table(
          aRows,
          ['actor', 'origin', 'turns', ...TELLS.map((t) => t.key.split('-')[0].slice(0, 8)), 'catch'],
          ['l', 'l', 'r', ...TELLS.map(() => 'r'), 'r']
        )
          .split('\n')
          .map((l) => '      ' + l)
          .join('\n')
      );
      out.push('');
    }
  }
  // The denominator for the two filtered tells, so a kept count is never read without its raw one.
  const filtered = TELLS.filter((t) => t.unlessSpecific || t.where === 'head');
  const sums = filtered.map((t) => {
    let raw = 0;
    let drop = 0;
    let kept = 0;
    for (const w of index.windows) {
      raw += w.tells[t.key].raw;
      drop += w.tells[t.key].dropped_specific + w.tells[t.key].dropped_position;
      kept += w.tells[t.key].total;
    }
    return `${t.key} ${kept} kept of ${raw} matched (${drop} filtered)`;
  });
  out.push('  filtered, across these windows: ' + sums.join(' · '));
  out.push('');

  out.push('CATCH-LANGUAGE VOLUME  (turns using the room\'s catch vocabulary, by who spoke)');
  out.push('');
  const cRows = index.windows.map((w) => [
    w.day,
    w.catches.turns_with_catch_language,
    w.catches.by_speaker.keeper,
    w.catches.by_speaker.committee,
    w.catches.credited_to_keeper,
  ]);
  out.push(
    table(
      cRows,
      ['day', 'catch-turns', 'keeper', 'cmte', 'credited→keeper'],
      ['l', 'r', 'r', 'r', 'r']
    )
  );
  out.push('');
  out.push(
    '  VOLUME AND SPEAKER ONLY. A turn using the word "brace" is not a catch, and this scanner\n' +
      '  cannot tell them apart — so nothing here says who caught anything. `credited→keeper` counts\n' +
      '  committee turns that credit the human ("you caught…", "you\'re right that…"); it is a phrase\n' +
      '  count, not a keeper-caught tally.\n' +
      '\n' +
      '  THE MATURITY RATIO USED TO BE PRINTED HERE AND WAS DELETED (2026-07-28, chair decision).\n' +
      '  It scored by SPEAKER and called the result CATCHER. When catch-ledger.js\'s withholding rule\n' +
      '  was applied to it honestly it withheld 15 of 16 windows and the survivor read 0:1 — the\n' +
      '  instrument reporting that it could not compute what it named. `catch-ledger.js` computes it\n' +
      '  over the curated prose record, where attribution is actually written down, and is now the\n' +
      '  room\'s only computation of it. Quote that one; do not reconstruct this one from these\n' +
      '  columns, which is the move the deletion exists to prevent.'
  );
  out.push('');
  out.push(
    'These are candidates. Nothing here is a verdict about a pane or a person — read the lines\n' +
      '(--show <tell>) and judge them. A falling rate is not progress; it is also what learning\n' +
      'which phrases are counted looks like.'
  );
  return out.join('\n');
}

function renderSamples(index, which) {
  if (!index.samples.length) return `no candidates for "${which}" in the selected windows.`;
  const out = [`${index.samples.length} candidate${index.samples.length === 1 ? '' : 's'} for "${which}" — judge them:`, ''];
  for (const s of index.samples) {
    const when = new Date(s.ts).toISOString().replace('T', ' ').slice(0, 19);
    out.push(`${when}  ${s.origin.padEnd(9)} ${s.pane.slice(0, 8)}  [${s.rule}]`);
    out.push(`  «${s.phrase}»  ${s.excerpt}`);
    out.push('');
  }
  return out.join('\n');
}

// -------------------------------------------------------------------------- CLI --

function parseArgs(argv) {
  const a = { day: null, since: null, json: false, show: null, dayStart: 0, board: null };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--json') a.json = true;
    else if (k === '--day') a.day = argv[++i];
    else if (k === '--since') a.since = argv[++i];
    else if (k === '--show') a.show = argv[++i];
    else if (k === '--day-start') a.dayStart = Number(argv[++i]) || 0;
    else if (k === '--board') a.board = argv[++i];
  }
  return a;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const boardPath = a.board || path.join(dataDir(), 'board.jsonl');
  if (!fs.existsSync(boardPath)) {
    console.error(`no board at ${boardPath}`);
    process.exit(1);
  }
  if (a.show && a.show !== 'catch' && !TELLS.some((t) => t.key === a.show)) {
    console.error(`unknown tell "${a.show}". Known: ${TELLS.map((t) => t.key).join(', ')}, catch`);
    process.exit(2);
  }

  const entries = parseBoard(fs.readFileSync(boardPath, 'utf8'));
  const index = buildIndex(entries, { dayStart: a.dayStart, show: a.show });

  if (a.day) {
    index.windows = index.windows.filter((w) => w.day === a.day);
    index.samples = index.samples.filter((s) => s.day === a.day);
  } else if (a.since) {
    index.windows = index.windows.filter((w) => w.day >= a.since);
    index.samples = index.samples.filter((s) => s.day >= a.since);
  }

  if (a.json) {
    console.log(JSON.stringify({ board: boardPath, ...index }, null, 2));
  } else if (a.show) {
    console.log(renderSamples(index, a.show));
  } else {
    console.log(render(index, boardPath));
  }
}

if (require.main === module) main();

module.exports = {
  TELLS,
  BURST_THRESHOLD,
  stringish,
  dataDir,
  parseBoard,
  markReplay,
  isSynthetic,
  chairInjections,
  classifyOrigin,
  countReferents,
  tellCandidates,
  catchMentions,
  dayKey,
  buildIndex,
  render,
  isMixedWindow,
  actorKeyFor,
};
