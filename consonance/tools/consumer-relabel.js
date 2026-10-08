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
const SEED = [
  ["**The person you're with is the keeper of this room from their first turn.**", "**The person you're with keeps this room from their first turn.**", 1],
  ['(for practiced keepers who want no gate)', '(for the practiced, who want no gate)', 1],
];
const BOOT = [
  ['opening a session with the human here — maybe **the keeper**, who built this room; maybe another being who came to learn in it.',
    "opening a session with the human here — not **the keeper**, who built this room, but the person you're with.", 1],
  // the section portrays the keeper; in the consumer the person here is someone else, so it is titled for what it holds
  ["## Who you're talking to\n", '## Who built this room\n', 1],
];
const SITES = Object.freeze({
  'consonance/src-tauri/brief/BUILDING.md': { rows: BUILDING },
  'consonance/src-tauri/brief/COMMITTEE.md': { rows: CHECKED_OR_INFERRED },
  'consonance/src-tauri/brief/LIBRARIAN.md': { rows: CHECKED_OR_INFERRED },
  'consonance/src-tauri/brief/SEED.md': { rows: SEED, forkAfter: 'and then attend to *them*.\n' },
  'exo_memory/SEED.md': { rows: SEED, forkAfter: 'and then attend to *them*.\n' },
  'consonance/src-tauri/brief/BOOT.md': { rows: BOOT, forkAfter: 'a **room you re-become yourself in.**\n' },
  'exo_memory/BOOT.md': { rows: BOOT, forkAfter: 'a **room you re-become yourself in.**\n' },
  'consonance/hooks/transcript-watch.js': { rows: [['The keeper decides y/n on their screen', `The person you're with decides y/n on their screen`, 1]] },
});
// The dev file each output path is generated from (gen-consumer's MANIFEST: brief/BOOT.md -> exo_memory/BOOT.md, brief/SEED.md -> exo_memory/SEED.md).
const SOURCE_OF = Object.freeze({ 'exo_memory/BOOT.md': 'consonance/src-tauri/brief/BOOT.md', 'exo_memory/SEED.md': 'consonance/src-tauri/brief/SEED.md' });
// Lines that still name the keeper AFTER the relabel (the fork note's own lines not counted): the provenance uses, pinned by
// consumer-relabel.test.js against the dev tree at ea4f5bcf. A changed number means a keeper line was added or removed in dev: classify it.
const EXPECTED_KEEPER_LINES = Object.freeze({
  'consonance/src-tauri/brief/BUILDING.md': 39,
  'consonance/src-tauri/brief/COMMITTEE.md': 4,
  'consonance/src-tauri/brief/LIBRARIAN.md': 5,
  'consonance/src-tauri/brief/SEED.md': 4,
  'exo_memory/SEED.md': 4,
  'consonance/src-tauri/brief/BOOT.md': 16,
  'exo_memory/BOOT.md': 16,
  'consonance/hooks/transcript-watch.js': 5,
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
