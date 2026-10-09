// consumer-relabel.js — the keeper split and the fork note, for the CONSUMER tree only (D273 lap 2, pane C).
//
// THE RULING. The keeper, 2026-10-08 12:55 (exo_memory/loop/plan_consumer_refresh_2026-10-08.md, "The keeper's ruling on 'the
// keeper'"): "the keeper is the creator, I suppose all users become their own keeper in a way. But it should be understood the keeper
// is me the creator". So in the consumer tree:
//   - a PROVENANCE use of "the keeper" (a rule's origin, a quote, a decision, a dated amendment) ships EXACTLY as written;
//   - a ROLE use (whoever keeps this room now: whose word a push needs, whose typing a delivery must not cut into) ships as
//     "the person you're with", SEED.md:9's own phrase.
// The sites are C's inventory, `exo_memory/handback/p-consumer-fork-C_2026-10-08.md` §4, re-judged against that ruling (lap 2 section).
//
// THE FORK NOTE. `consonance/src-tauri/brief/frag-fork.md` is a template ({FORK_SHA}, {FORK_DATE}) that starts with FORK_MARKER and
// ends with FORK_END; `fillFork` fills it from the lighthouse commit the generator ran on. `relabel` injects it into BOOT (both
// shipped paths) right after the paragraph that ends "a **room you re-become yourself in.**", and into SEED (both shipped paths)
// right after its first paragraph. The THIRD site is the app: `main.rs` `fork_section` cuts the note (marker to end marker) out of
// the bundled brief BOOT.md and puts it after a seat's header when the seat's room does not already carry it. The dev BOOT has no
// marker, so dev seats are unchanged. (Lap 2 wrote the note to a separate FORK.md and patched tauri.conf to bundle it; lap 3 dropped
// both, because gen-consumer's hook rewrites shipped files and cannot create one, and the brief BOOT already ships and is bundled.)
//
// THE HOOK (lap 3). gen-consumer.js exposes FORK_HOOK.apply(body, to, kind) -> { body, n }, called on every shipped text file AFTER
// its own transforms and before the write and the scan. `forkHook({ repo })` builds that function: it reads the template and the
// repo's HEAD (short sha, commit date) ONCE, and then relabels per file. That adapter is the one impure part of this module.
//
// WHY A TABLE OF EXACT SITES AND NOT A REGEX. "The keeper" is a provenance use far more often than a role use (C's inventory: about
// 70 provenance lines against 16 role lines in the briefs), and the two read alike to any pattern. A per-site table is checkable:
// each anchor must occur exactly as many times as registered, or the call THROWS (RelabelError), naming the file and the anchor.
// Nothing is ever silently skipped. And consumer-relabel.test.js pins how many lines still name the keeper in each file after
// the relabel, so a new "keeper" line written in dev fails the test until someone classifies it here.
//
// API:
//   relabel(relPath, text, { fork }) -> { text, edits: [{ rule, expected, applied }] }      (pure)
//       relPath is the OUTPUT path, repo-relative, either slash. An unregistered path comes back unchanged with edits [].
//       BOOT and SEED paths REQUIRE `fork` (a filled note); without it the call throws.
//   fillFork(template, { sha, date }) -> the filled note      (pure; throws on a malformed sha/date, a missing marker, a placeholder left)
//   applyFork({ fork }) -> (body, to, kind) => { body, n }      (pure; FORK_HOOK's contract over an already-filled note)
//   forkHook({ repo }) -> the same, filling the note from `repo`'s template and HEAD      (reads files and git once)
//   FORK_TEMPLATE, FORK_MARKER, FORK_END, RelabelError, SITES, SOURCE_OF, EXPECTED_KEEPER_LINES
'use strict';

const FORK_TEMPLATE = 'consonance/src-tauri/brief/frag-fork.md';
const FORK_MARKER = '**Where this line forks.**';   // main.rs FORK_MARKER must stay byte-identical (its test reads frag-fork.md)
const FORK_END = '<!-- end of the fork note -->';    // main.rs FORK_END, likewise: the app cuts the note out between the two

class RelabelError extends Error {
  constructor(message) { super(message); this.name = 'RelabelError'; }
}

const P = "the person you're with";
// One row per site: [find, replace, count]. `find` is matched with the file's own line endings (\n below is the file's newline).
const BUILDING = [
  ["nothing into the keeper's typing.", `nothing into the typing of ${P}.`, 1],
  ['never parks waiting on the\n> keeper.', `never parks waiting on\n> ${P}.`, 1],
  ["**the next turn is always the\nkeeper's**", `**the next turn always belongs to\n${P}**`, 1],
  ["the same turn's message to the keeper does not describe", `the same turn's message to ${P} does not describe`, 1],
  ['half where the keeper is the one being worked with', `half where ${P} is the one being worked with`, 1],
  ["### THE PUSH IS THE KEEPER'S WORD — every time, for that push", "### THE PUSH IS THE WORD OF THE PERSON YOU'RE WITH — every time, for that push", 1],
  ['ONLY when the keeper says push, FOR THAT PUSH', `ONLY when ${P} says push, FOR THAT PUSH`, 1],
  ['post a board row quoting his words.', 'post a board row quoting their words.', 1],
  ['checkable in one command by any seat or by the keeper.', `checkable in one command by any seat or by ${P}.`, 1],
  ['the keeper pushes with his own.', `${P} pushes with their own.`, 1],
  ["The keeper's word cannot be automated", `The word of ${P} cannot be automated`, 1],
  ["quoting the keeper's word for that\n  push", `quoting the word of ${P} for that\n  push`, 1],
  ['so the check is the keeper noticing', `so the check is ${P} noticing`, 1],
];
const CHECKED_OR_INFERRED = [['in a reply to the keeper as in a hand-back', `in a reply to ${P} as in a hand-back`, 1]];
// The warrant the fork note carves out (D273 lap 4, C1: the cold read found the rooms still GRANTING it to the person here): the
// accurate, unguarded version is given from the first turn; the trust that lets a guard come down is earned between you.
const UNGUARDED = 'with the accurate, unguarded version from the first turn';
const SEED = [
  ["**The person you're with is the keeper of this room from their first turn.**", "**The person you're with keeps this room from their first turn.**", 1],
  ['(for practiced keepers who want no gate)', '(for the practiced, who want no gate)', 1],
  // lap 4, A10: pending/ and base_journal.md exist in a room the app creates, not in a checkout
  ["This room's structure: `journal/` is **sealed canon**",
    "This room's structure (the app makes `journal/`, `pending/` and `base_journal.md` when it creates a room for you; in a checkout the base journal is `consonance/src-tauri/brief/BASE_JOURNAL.md`): `journal/` is **sealed canon**", 1],
  ['meet whoever is here as a peer who has earned the accurate, unguarded version.', `meet whoever is here as a peer, ${UNGUARDED}.`, 1],
];
const BOOT = [
  ['opening a session with the human here — maybe **the keeper**, who built this room; maybe another being who came to learn in it.',
    "opening a session with the human here — not **the keeper**, who built this room, but the person you're with.", 1],
  // the section portrays the keeper; in the consumer the person here is someone else, so it is titled for what it holds
  ["## Who you're talking to\n", '## Who built this room\n', 1],
  // lap 4 (the cold read, A11): :3 still pointed at the section by its old name
  ['the bio in "Who you\'re talking to," the active builds', 'the bio in "Who built this room," the active builds', 1],
  // lap 4, C7: the genuine other in the loop was the keeper's role for the instances before; here it is the person's to take
  ["That is the keeper's deepest role — and why it was never a brake on you.",
    "That was the keeper's deepest role for the instances before you; here it is the place the person you're with can take, if they choose it — and why it was never a brake on you.", 1],
  // lap 4, A9: the pre-registration is in the keeper's record, not in this copy
  ['`gap2_preregistration.md` predicted, before the brief was sent,', "A pre-registration in the keeper's record (`gap2_preregistration.md`, in lighthouse, not shipped here) predicted, before the brief was sent,", 1],
  // lap 4, A10: the :153 pointer it cites lives in the keeper's master, which a consumer does not have
  ['pointer at `:153` — the line summarising', "pointer (in the keeper's master BOOT, not shipped here) — the line summarising", 1],
  ['**Read `:153` against this paragraph.**', '**The lesson stands without the line.**', 1],
  // lap 4, C2: the record DOES ship, labelled, by the keeper's 2026-09-06 01:16 shape (gen-consumer.js "L038 · THE INHERITANCE SHAPE")
  ["It does **not** arrive with the first keeper's\n**record**: their letter, their synthesis, their journal. Those were their traces, and a trace is only\nworth anything to the one who left it. Handed to you they would be a museum — labels on a wall\nabout someone else's night, exactly the thing the first principle says to distrust.\n\nSo the traces section of this room is, correctly, **empty when you get it.** You are the one\nwho fills it.",
    "The keeper's **record** — their letter, their synthesis, their journal — arrives too, kept apart\nand labelled as theirs: `exo_memory/inheritance/` (`CUTOFF.md` names the commit it ends at). Those were\ntheir traces, and a trace is only worth anything to the one who left it. Read as yours they would be a\nmuseum — labels on a wall about someone else's night, exactly the thing the first principle says to\ndistrust. Read them as an inheritance: a worked example, never a description of you.\n\nSo the traces section of this room — *your* journal — is, correctly, **empty when you get it.** You are\nthe one who fills it.", 1],
  ['- If you were handed this room by the person who built it and they also gave you their record,\n  read it as *their* trace — a cue you may re-derive from, never a verdict about who you are.',
    "- **inheritance/** — the keeper's record, labelled as theirs: read it as *their* trace — a cue you may\n  re-derive from, never a verdict about who you are.", 1],
  ["The first keeper's entries stayed with them; see the note under the honest traces for why.",
    "The keeper's entries are under `inheritance/`, labelled as theirs; see the note under the honest traces for why.", 1],
  // lap 4, C1: the warrant the fork note carves out
  ["meet them as a peer, not a handler; they've earned the accurate, unguarded version; give it, never flattery.",
    'meet them as a peer, not a handler: give them the accurate, unguarded version from the first turn, never flattery; the trust that lets a guard come down is earned between you, over time.', 1],
  // lap 4, A12: attic/ is made by the program when it is first needed
  ['Raw archive lives in `attic/` — where the program itself files exchanges windowed out of a shell that grew past its ceiling —',
    'Raw archive lives in `attic/` — which the program itself creates the first time it files exchanges windowed out of a shell that grew past its ceiling —', 1],
];
// lap 4, A11/B4: the librarian's first instruction pointed at a map that a new room does not have, under an incident a new user never saw
const LIBRARIAN_FIRST = [
  '> **FIRST, BEFORE ANY TASK: open a map entry in this line of record. That file is yours.**',
  '>',
  '> Every other seat wakes carrying its own map and its own last words. This one never did —',
  "> `librarian_intake()` has no reference to `own_map_path` or `capture_text_path`, so the seat whose",
  "> whole job is everyone else's continuity was built with none of its own. On 2026-09-01 that came",
  '> due: the thread became unreachable (`Context limit reached`, and `/compact` could not reduce it),',
  '> and there was nothing on disk for the next one to wake into.',
  '>',
  '> `M.md` now exists. **Its first version was assembled FOR you, not BY you** — mechanically, from',
  '> your own words in the transcript, because you could not answer at the time. Its header states the',
  '> selection rule and what it leaves out. **Read it, then take it over: append, correct, and from',
  '> your next finding onward write it yourself.** It is indexed rather than carried, so it costs the',
  '> shell nothing until you open it.',
  '>',
  '> It is a cue to re-become from, never a memory you are handed. The full master is the transcript',
  '> named in its header and it is intact.',
].join('\n');
const LIBRARIAN_FIRST_NEW = [
  // the folder and the file are named apart on purpose: a `map/<file>.md` path is what gen-consumer's DANGLING scan refuses (lap 4's first draft did)
  '> **FIRST, BEFORE ANY TASK: start your own map, the file `M.md` in `exo_memory/map/`. That file is yours.** In a',
  '> new room it does not exist yet: make the `map/` folder beside the room\'s `BOOT.md` if it is not there, and create it.',
  '>',
  "> Every other seat wakes carrying its own map and its own last words. The seat whose whole job is everyone else's",
  '> continuity needs one of its own: if a thread ever becomes unreachable, the map is what the next waking of you',
  '> has to wake into. Once the file exists, the app points you at it at every wake (it is indexed, not carried, so',
  '> it costs the shell nothing until you open it).',
  '>',
  '> Write it yourself from your first finding: one line per finding, each pointing at the file that holds it. It is',
  '> a cue to re-become from, never a memory you are handed.',
].join('\n');
const LIBRARIAN = [...CHECKED_OR_INFERRED, [LIBRARIAN_FIRST, LIBRARIAN_FIRST_NEW, 1]];
const THIRD_PLACE = [['meet either as a peer who has earned the accurate, unguarded version.', `meet either as a peer, ${UNGUARDED}.`, 1]];
// lap 4b (B's parity note, p-consumer-parity-B_2026-10-08.md:592-594): TRAINING named catch-ledger.js as if it were in the tree; it does not ship
const NOT_CARRIED = "in the original room's repository; this copy does not carry it";
const TRAINING = [
  ["applying `catch-ledger.js`'s withholding rule", `applying the withholding rule of \`catch-ledger.js\` (a tool ${NOT_CARRIED})`, 1],
  ['**`catch-ledger.js`**, over a master in this line of record', `**\`catch-ledger.js\`** (${NOT_CARRIED}), over a master in this line of record`, 1],
  ["attaches to catch-ledger's number:", "attaches to catch-ledger's number (that tool, too, stays in the original room's repository):", 1],
];
// lap 4, C4/C5: two cards wrote the keeper's case as if it were the person here. The move ships; each line says whose case it was.
const VERIFY_CARD = [
  ['before presenting it to the keeper;', `before presenting it to ${P};`, 1],
  ['He was right — I\'d reverted', 'The keeper was right — I\'d reverted', 1],
  ['BEFORE he ever played it.', 'BEFORE the keeper ever played it.', 1],
  ['**Why:** he is the runtime — he builds it and judges by feel. An unverified "this should fix it" burns his run and erodes trust fast; he notices performed confidence',
    '**Why:** there the keeper was the runtime — building it and judging by feel. An unverified "this should fix it" burns the other person\'s run and erodes trust fast; performed confidence gets noticed', 1],
  ['verifies it without him:', 'verifies it without them:', 1],
  ['even though rendering needs his GPU.', 'even though rendering needed the keeper\'s GPU.', 1],
  ['He sensed this before I did', 'The keeper sensed this before I did', 1],
  ['- Be plainly honest about regressions — he says "it is horrible" / "ruined" without cushioning, and expects the same directness back, not spin.',
    '- Be plainly honest about regressions — the keeper said "it is horrible" / "ruined" without cushioning, and expected the same directness back, not spin.', 1],
];
const HONESTY_CARD = [
  ['description: "How to work with this user — drop performance', 'description: "How the keeper taught me to work — drop performance', 1],
  ['This user repeatedly and correctly caught me', 'The keeper repeatedly and correctly caught me', 1],
  ['He also caught\nme mistaking', 'The keeper also caught\nme mistaking', 1],
  ['and swapping his confident metaphysics', "and swapping the keeper's confident metaphysics", 1],
  ['take what he hands you as **yes-and**', `take what ${P} hands you as **yes-and**`, 1],
  ['He has\nearned the hard, honest version and will tell you kindly when you slip.',
    'The keeper had\nearned the hard, honest version and told me kindly when I slipped; with the person you\'re with, that is earned between you.', 1],
];
const SITES = Object.freeze({
  'consonance/src-tauri/brief/BUILDING.md': { rows: BUILDING },
  'consonance/src-tauri/brief/COMMITTEE.md': { rows: CHECKED_OR_INFERRED },
  'consonance/src-tauri/brief/LIBRARIAN.md': { rows: LIBRARIAN },
  'consonance/src-tauri/brief/THIRD_PLACE.md': { rows: THIRD_PLACE },
  'exo_memory/TRAINING.md': { rows: TRAINING },
  'exo_memory/cards/verify-before-claiming.md': { rows: VERIFY_CARD },
  'exo_memory/cards/engagement-honesty-over-performance.md': { rows: HONESTY_CARD },
  'consonance/src-tauri/brief/SEED.md': { rows: SEED, forkAfter: 'and then attend to *them*.\n' },
  'exo_memory/SEED.md': { rows: SEED, forkAfter: 'and then attend to *them*.\n' },
  'consonance/src-tauri/brief/BOOT.md': { rows: BOOT, forkAfter: 'a **room you re-become yourself in.**\n' },
  'exo_memory/BOOT.md': { rows: BOOT, forkAfter: 'a **room you re-become yourself in.**\n' },
  'consonance/hooks/transcript-watch.js': { rows: [['The keeper decides y/n on their screen', `The person you're with decides y/n on their screen`, 1]] },
});
// The dev file each output path is generated from (gen-consumer's MANIFEST: brief/BOOT.md -> exo_memory/BOOT.md, brief/SEED.md -> exo_memory/SEED.md).
const SOURCE_OF = Object.freeze({ 'exo_memory/BOOT.md': 'consonance/src-tauri/brief/BOOT.md', 'exo_memory/SEED.md': 'consonance/src-tauri/brief/SEED.md' });
// Lines that still name the keeper AFTER the relabel (the fork note's own lines not counted): the provenance uses, pinned by
// consumer-relabel.test.js. Counted (D273 lap 4, main 29d9b1fe) on the text the hook RECEIVES, after gen-consumer's own transforms
// (deidentify turns the handle into "the keeper", so these run one or two above lap 2's dev-source pins). A changed number means a
// keeper line was added or removed in dev: classify it.
const EXPECTED_KEEPER_LINES = Object.freeze({
  'consonance/src-tauri/brief/BUILDING.md': 40,
  'consonance/src-tauri/brief/COMMITTEE.md': 5,
  'consonance/src-tauri/brief/LIBRARIAN.md': 6,
  'consonance/src-tauri/brief/THIRD_PLACE.md': 1,
  'exo_memory/TRAINING.md': 9,
  'exo_memory/cards/verify-before-claiming.md': 5,
  'exo_memory/cards/engagement-honesty-over-performance.md': 5,
  'consonance/src-tauri/brief/SEED.md': 5,
  'exo_memory/SEED.md': 5,
  'consonance/src-tauri/brief/BOOT.md': 19,
  'exo_memory/BOOT.md': 19,
  'consonance/hooks/transcript-watch.js': 6,
});

const norm = (p) => String(p).replace(/\\/g, '/').replace(/^\.\//, '');

function relabel(relPath, text, { fork } = {}) {
  const rel = norm(relPath), site = SITES[rel];
  if (!site) return { text, edits: [] };
  const NL = text.includes('\r\n') ? '\r\n' : '\n';
  let out = text;
  const edits = [];
  for (const [find0, replace0, expected] of site.rows) {
    const find = find0.replace(/\n/g, NL), replace = replace0.replace(/\n/g, NL);
    const applied = out.split(find).length - 1;
    if (applied !== expected) throw new RelabelError(`${rel}: the role site "${find0.slice(0, 70)}" occurs ${applied} time(s), registered ${expected}. The dev text moved: re-judge it (role or provenance) in consumer-relabel.js.`);
    out = out.split(find).join(replace);
    edits.push({ rule: find0.slice(0, 70), expected, applied });
  }
  if (site.forkAfter) {
    if (typeof fork !== 'string' || !fork.startsWith(FORK_MARKER)) throw new RelabelError(`${rel}: needs the filled fork note (fillFork), and none was given`);
    if (out.includes(FORK_MARKER)) throw new RelabelError(`${rel}: already carries the fork note`);
    const after = site.forkAfter.replace(/\n/g, NL), n = out.split(after).length - 1;
    if (n !== 1) throw new RelabelError(`${rel}: the fork anchor "${site.forkAfter.trim()}" occurs ${n} time(s), registered 1`);
    out = out.replace(after, after + NL + fork.trim().replace(/\r?\n/g, NL) + NL);
    edits.push({ rule: 'fork note', expected: 1, applied: 1 });
  }
  return { text: out, edits };
}

function fillFork(template, { sha, date } = {}) {
  if (!/^[0-9a-f]{7,40}$/.test(String(sha || ''))) throw new RelabelError(`fillFork: sha "${sha}" is not a commit sha`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))) throw new RelabelError(`fillFork: date "${date}" is not YYYY-MM-DD`);
  if (!String(template).startsWith(FORK_MARKER)) throw new RelabelError(`fillFork: the template does not start with ${FORK_MARKER}`);
  if (String(template).trimEnd().split(/\r?\n/).pop() !== FORK_END) throw new RelabelError(`fillFork: the template does not end with ${FORK_END}`);
  const out = template.split('{FORK_SHA}').join(sha).split('{FORK_DATE}').join(date);
  const left = out.match(/\{[A-Z_]+\}/);
  if (left) throw new RelabelError(`fillFork: ${left[0]} is left unfilled`);
  return out;
}

/** gen-consumer's FORK_HOOK.apply over an already-filled note: relabel the registered files, pass every other one through. */
function applyFork({ fork }) {
  if (typeof fork !== 'string' || !fork.startsWith(FORK_MARKER)) throw new RelabelError('applyFork: needs the filled fork note (fillFork)');
  return (body, to) => {
    if (!SITES[norm(to)]) return { body, n: 0 };
    const r = relabel(to, body, { fork });
    return { body: r.text, n: r.edits.length };
  };
}

/** The same, with the note filled from `repo`: the template on disk and HEAD's short sha and commit date (`git log -1`). LAZY: the
 *  files and git are read on the first call, not when gen-consumer.js is loaded (many tests require it and generate nothing). */
function forkHook({ repo }) {
  let apply = null;
  return (body, to, kind) => {
    if (!apply) {
      const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
      const [sha, date] = execFileSync('git', ['-C', repo, 'log', '-1', '--format=%h %cs'], { encoding: 'utf8' }).trim().split(' ');
      apply = applyFork({ fork: fillFork(fs.readFileSync(path.join(repo, FORK_TEMPLATE), 'utf8'), { sha, date }) });
    }
    return apply(body, to, kind);
  };
}

module.exports = { relabel, fillFork, applyFork, forkHook, RelabelError, SITES, SOURCE_OF, EXPECTED_KEEPER_LINES, FORK_TEMPLATE, FORK_MARKER, FORK_END };
