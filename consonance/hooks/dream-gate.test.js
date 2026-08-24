// THE DREAM GATE — a cross-hook invariant, tested as one rule rather than five times.
//
// THE RULE: dev/dream/dream_cycle.ps1 sets CONSONANCE_DREAM=1 in the `claude -p` environment it
// spawns, and every registered hook exits silently when it sees that. The gap-dream is an
// anti-instruction — no task, no question, no deliverable — and a hook that appends to a prompt
// defeats it by existing.
//
// WHY THIS IS DERIVED FROM THE MANIFEST AND NOT FROM A LIST IN THIS FILE. The bug the room spent
// tonight on (arch_test, 757bef1 -> 02b1e5e) was an assertion over a hand-kept list whose comment
// claimed it caught things not on the list. A list can only ever check what someone remembered to
// add; the hook registered next month is by definition not on it. So this reads
// dev/shell/install.ps1's own manifest — the file that decides what actually gets installed — and
// requires every entry to hold the invariant. Adding a hook without a gate fails here, without
// anyone having to remember this file exists.
//
// A BEHAVIOURAL ASSERTION THAT CANNOT DETECT ITS OWN VACUITY IS THE BUG, NOT THE TEST. The first
// version of this file spawned each hook with the variable set and asserted empty stdout. All
// five passed — and then the control run (same fixture, variable UNSET) showed that board-digest
// and transcript-watch are silent EITHER WAY here: they need a board.jsonl and a Main capture
// this suite has no hermetic seam for. Their green was measuring nothing. That is the third
// measures-nothing probe this room caught in one night, so it is designed out rather than noted:
//
//   Membership in the two groups below is DERIVED at run time, never declared. Each hook is run
//   WITHOUT the variable first. If it speaks, it is PROVEN and gets the real before/after
//   assertion. If it does not, the suite cannot exercise its emit path, says so by name, and
//   falls back to lexical + placement — which is weaker, and printed as weaker.
//
// So a hook that gains a test seam is promoted automatically, and a proven hook whose fixture
// rots is caught instead of quietly demoting itself to the weak check.
//
// ASSERTIONS:
//   LEXICAL    — the source contains the guard (every hook).
//   PLACEMENT  — the guard appears before the entry call, so it cannot sit after the work.
//   BEHAVIOURAL— speaks without the variable, silent with it (proven hooks only).
//
// Run:  node consonance/hooks/dream-gate.test.js
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const INSTALL = path.join(REPO, 'dev', 'shell', 'install.ps1');

let pass = 0;
const fails = [];
function t(name, fn) {
  try {
    fn();
    pass++;
    console.log('  ok  ' + name);
  } catch (e) {
    fails.push(`${name} — ${e.message}`);
    console.log('FAIL  ' + name);
  }
}

// ── the manifest, read from the installer that owns it ──────────────────────
// Entries under lib\ are libraries required BY a hook, not hooks the host runs. They receive no
// stdin and emit nothing, so the invariant does not apply to them; skipping is explicit here
// rather than implicit in a hand-kept list.
function manifestHooks() {
  const src = fs.readFileSync(INSTALL, 'utf8');
  const out = [];
  // Whole manifest LINES, so a line's own `Lib = $true` is visible here. Matching only the From
  // value threw that away, which is why libraries could previously be identified by nothing but a
  // `\lib\` path — a convention blind.js cannot follow, since board-digest requires it as
  // './blind.js' from the same directory (2026-08-17).
  const re = /^.*From\s*=\s*'([^']+)'.*$/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const line = m[0];
    const rel = m[1];
    if (/\\lib\\/i.test(rel)) continue;        // path-declared library (dev\shell\lib\ambient.js)
    if (/\bLib\s*=\s*\$true\b/i.test(line)) continue; // field-declared library (blind.js)
    out.push(rel);
  }
  return out;
}

function pythonExe() {
  // Same resolution as install.ps1: never the Microsoft Store stub, which is not an interpreter.
  const globbed = path.join(
    process.env.LOCALAPPDATA || '',
    'Programs', 'Python'
  );
  try {
    for (const d of fs.readdirSync(globbed)) {
      const p = path.join(globbed, d, 'python.exe');
      if (fs.existsSync(p)) return p;
    }
  } catch (_) {}
  return null;
}

const HOOKS = manifestHooks();

t('the manifest yields the hooks, and enough of them to be a real check', () => {
  // A green run over an empty set is worse than no test — the vacuity lesson from arch_test.
  if (HOOKS.length < 4) {
    throw new Error(`only ${HOOKS.length} hooks parsed from install.ps1 — the parser is broken and every assertion below is vacuous`);
  }
  for (const known of ['sessionstart-ambient.js', 'userprompt_pulse.py', 'board-digest.js']) {
    if (!HOOKS.some((h) => h.endsWith(known))) {
      throw new Error(`${known} not discovered — a silent miss reopens the hole this closes`);
    }
  }
});

// The entry call each hook's guard must precede — the point where work actually begins.
// The entry call each hook's guard must precede — the point where work actually begins. These
// must be unique to the CALL SITE: `resolveAmbient()` alone matched the function DEFINITION,
// which sits above the guard, and reported a correctly-placed guard as misplaced.
const ENTRY = {
  'sessionstart-ambient.js': 'const lib = resolveAmbient();',
  'userprompt_pulse.py': 'STATE = os.path.join',
  'board-digest.js': 'withStdin((input)',
  // Updated 2026-08-17 alongside transcript-watch.js moving to streaming stdin: its call site is
  // now `withStdin(main)` and the bare `\nmain();` no longer exists in the file. This one line is
  // the ONLY real content of the held branch's copy of this file — the copy itself was DROPPED,
  // because it predates ce02d5a and carries no sourced-stop entry, so landing it verbatim would
  // have deleted that entry and re-created the day-long red that ce02d5a fixed. Ported by hand
  // rather than checked out, on pane B's finding.
  'transcript-watch.js': 'withStdin(main)',
  'dream-watch.js': 'if (require.main === module)',
  // Unique to the CALL SITE, not the definition: ferry-watch defines `function main()` above the
  // guard and calls it at the bottom, so matching the bare name would compare the guard against
  // the definition and report a correctly-placed guard as misplaced - the exact trap the comment
  // above this table records.
  'ferry-watch.js': 'try { main(); }',
  // Added 2026-08-24 with dispatch-gate.js itself. Call site, not definition, for the reason the
  // header of this table records: `function main()` is declared above the guard.
  'dispatch-gate.js': 'try { main(); }',
  // Added 2026-08-24 with carrier-drift-watch.js itself, in the same change as its install.ps1
  // manifest entry. Landing the manifest line without this one is the guard-census failure in
  // miniature: the roster is discovered and this table is hand-kept, so the suite would have
  // gone red on a hook that was fine. Call site, not definition, per this table's header.
  'carrier-drift-watch.js': 'try { main(); }',
  // Added 2026-08-18 with precompact-preserve.js itself. Call site, not definition: `function
  // main()` is declared above the guard and invoked at the bottom under require.main, so the
  // bare name would compare the guard against the definition — the trap this table's header
  // records twice already.
  'precompact-preserve.js': 'if (require.main === module) main();',
  // Call site, not definition, same trap as the entries above.
  'sessionstart-state.js': 'if (require.main === module) main();',
  // Same call-site-not-definition shape as ferry-watch: `function main()` is defined at :208, well
  // above the guard, and the call sits at the bottom. Added 2026-08-16 — sourced-stop.js shipped
  // 2026-08-15 (d29d31e) and the HOOKS roster discovers files automatically while this table is
  // hand-maintained, so the suite went red the moment the hook landed and stayed red for a day.
  // That is the table working as designed: it refused to skip what it could not check.
  'sourced-stop.js': 'try { main(); }',

  // Added 2026-08-17, and the reason is the same one the sourced-stop comment above records, at a
  // larger scale. install.ps1's manifest grew from 8 files to 22 that morning: NINE hooks were
  // running on the machine, registered in settings.json, and present in no repository at all —
  // including l3-overseer.js, which writes the arc-perceptions, and precompact.js, which writes
  // the keeper's checkpoints. This table discovers from the manifest, so those files had never
  // been inside the gate. The moment they entered it, it failed, correctly, on three counts:
  // l3-overseer.js carried NO CONSONANCE_DREAM GUARD AT ALL and demonstrably "spoke to a dream".
  //
  // The invariant was not new and the violation was not new. Only the visibility was. A file
  // outside the manifest is outside every check the manifest drives, which is a second, quieter
  // reason an unmanaged file is worse than a wrong one.
  //
  // Call site, not definition, per the trap this table already documents twice: findings-return
  // defines `function main()` at :171 and calls it at :275; l3-overseer defines at :112, calls at
  // :161 with a bare `main();` that the guard now precedes.
  'findings-return.js': 'try { main(); }',
  'l3-overseer.js': 'main();',
  'l2-overseer.js': 'main();',
  'session-start.js': 'main();',
  'userprompt-submit.js': 'main();',
  'stop.js': 'main();',
  'session-end.js': 'main();',
  // precompact.js has no main() at all — it is a flat top-to-bottom script, so "where work begins"
  // is the first statement that touches the world: reading stdin. Marker chosen for the call site
  // for the same reason as ferry-watch above.
  'precompact.js': 'fs.readFileSync(0, "utf8")',
};

// A FRESH DATA DIR PER RUN, for two reasons found the hard way. dream-watch is stateful — it has
// a reason-keyed cooldown — so the control run stamped the state and the very next run went
// silent, which the suite then read as "cannot be exercised". A stale-by-one-run classification
// would have flapped forever. And the state it stamped was the LIVE one: a test with a side
// effect on the instrument it is testing. Hooks that honour CONSONANCE_DATA (dream-watch.js:256)
// are isolated by this; the ones that don't are unaffected either way.
// PER INVOCATION, not per suite: the control runs each hook ungated TWICE (once to classify, once
// to prove the fixture still works), and one shared dir would put the second call inside the
// cooldown the first one stamped — reporting a rotted fixture that is fine.
const TMP_INSTANCES = path.join(os.tmpdir(), 'dreamgate-instances');
const tmpDirs = [];

const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';

// Enough of a bed for every hook to REACH its emit path. Without this, board-digest and
// transcript-watch were silent with or without the variable, so their spawn assertion proved
// nothing and the gate on the two hooks the gate most exists for rested on a text search.
// board-digest needs a board with other panes' turns from today; transcript-watch needs Main's
// capture to contain the survey marker.
function seedBed(dataDir) {
  const now = Date.now();
  fs.writeFileSync(
    path.join(dataDir, 'board.jsonl'),
    [
      { pane: 'aaaaaaaa-1111-4000-8000-000000000001', role: 'user', text: 'a prompt from another pane', ts: now - 60_000 },
      { pane: 'aaaaaaaa-1111-4000-8000-000000000001', role: 'assistant', text: 'a reply long enough to count as a report rather than tool narration, said by a pane that is not the reader', ts: now - 30_000 },
    ].map((o) => JSON.stringify(o)).join('\n') + '\n'
  );
  const caps = path.join(dataDir, 'captures');
  fs.mkdirSync(caps, { recursive: true });
  fs.writeFileSync(
    path.join(caps, `${MAIN_SID}.log`),
    'some pane output\r\nCan Anthropic look at your session transcript to improve Claude?\r\nmore output\r\n'
  );
}

function runHook(abs, withGate) {
  const exe = abs.endsWith('.py') ? pythonExe() : process.execPath;
  if (!exe) throw new Error('no python.exe found outside the Store stub; cannot verify the pulse gate');
  const cwd = path.join(TMP_INSTANCES, 'sibling-gate-test');
  fs.mkdirSync(cwd, { recursive: true });
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamgate-data-'));
  tmpDirs.push(dataDir);
  seedBed(dataDir);
  const env = {
    ...process.env,
    CONSONANCE_INSTANCES: TMP_INSTANCES,
    CONSONANCE_DATA: dataDir,
    CONSONANCE_WATCH_STATE: path.join(dataDir, 'watch-state.json'),
  };
  if (withGate) env.CONSONANCE_DREAM = '1';
  else delete env.CONSONANCE_DREAM;
  return execFileSync(exe, [abs], {
    input: JSON.stringify({ cwd, session_id: '0c0c0c0a-0000-4000-8000-000000000a01', source: 'startup' }),
    encoding: 'utf8',
    env,
  }).trim();
}

// MATCH THE STATEMENT, NEVER THE WORD — and match it in CODE, not in prose.
//
// Three rounds got this here, and the history is the argument for the current shape:
//   1. Grepping for "CONSONANCE_DREAM" passed on the gate's own COMMENT. Deleting the real guard
//      from board-digest left the suite fully green on an ungated hook.
//   2. Anchoring the statement at line start fixed the `//` form — and Bravo falsified it with a
//      `/* */` block, whose interior lines have no prefix to break the anchor. Same hole, one
//      syntax over. Chasing comment syntaxes is the wardrobe problem: there is always one more.
//   3. So comments are REMOVED before matching, which kills the whole family at once, and the
//      formatting anchor is then unnecessary — which also fixes the false negative Bravo found,
//      where the idiomatic `if (...) {\n  process.exit(0);\n}` gated perfectly and FAILED two
//      assertions. A test that fails on correct code teaches people to weaken it, and the natural
//      weakening is to drop the anchor, which reopens (1). Removing the anchor deliberately is
//      better than having it removed under time pressure.
//
// HONEST BOUND: stripComments is a lexer's job done with regexes. It does not understand strings,
// so a `/*` inside a string literal would confuse it. Nothing in these five files does that, and
// the failure direction is safe — a mangled source loses the guard and FAILS, rather than passing.
function stripComments(src, ext) {
  if (ext === '.py') return src.replace(/(^|\n)\s*#[^\n]*/g, '$1');
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1');
}

// The guard in either accepted shape: one-liner, or `if (...) { … process.exit(0); }`. No
// line-start anchor — comments are gone by the time this runs, so indentation proves nothing.
const GUARD = {
  '.js': /if \(process\.env\.CONSONANCE_DREAM\)\s*\{?\s*process\.exit\(0\)\s*;/,
  '.py': /if os\.environ\.get\(["']CONSONANCE_DREAM["']\)\s*:\s*(?:\r?\n)?\s*raise SystemExit\(0\)/,
};

function guardAt(abs, src) {
  const ext = path.extname(abs);
  const re = GUARD[ext];
  if (!re) throw new Error(`no guard pattern registered for ${ext} files`);
  const m = re.exec(stripComments(src, ext));
  return m ? m.index : -1;
}

const unproven = [];

for (const rel of HOOKS) {
  const abs = path.join(REPO, rel);
  const name = path.basename(rel);

  t(`${name}: the guard is in the source`, () => {
    const src = fs.readFileSync(abs, 'utf8');
    if (guardAt(abs, src) < 0) {
      throw new Error('no executable CONSONANCE_DREAM guard — a hook the dream runner cannot switch off');
    }
  });

  t(`${name}: the guard precedes the entry point`, () => {
    // Both indices must come from the SAME string. guardAt searches the comment-stripped source,
    // so the entry marker has to be located there too — mixing a stripped index with a raw one
    // compares two different coordinate systems and silently reports nonsense.
    const src = stripComments(fs.readFileSync(abs, 'utf8'), path.extname(abs));
    const entry = ENTRY[name];
    if (!entry) throw new Error(`no entry marker registered for ${name} — add one rather than skipping`);
    const at = guardAt(abs, fs.readFileSync(abs, 'utf8'));
    const work = src.indexOf(entry);
    if (work < 0) throw new Error(`entry marker ${JSON.stringify(entry)} not found — it moved; fix this map`);
    if (!(at >= 0 && at < work)) {
      throw new Error('the guard sits at or after the entry point, so the work runs before it');
    }
  });

  // The control decides which check this hook gets. It is run FIRST, on purpose.
  const speaksUngated = runHook(abs, false) !== '';
  if (!speaksUngated) {
    unproven.push(name);
    continue;
  }

  t(`${name}: speaks without the variable, silent with it`, () => {
    const gated = runHook(abs, true);
    if (gated !== '') throw new Error(`spoke to a dream: ${gated.slice(0, 160)}`);
    if (runHook(abs, false) === '') {
      throw new Error('no longer speaks ungated — the fixture rotted and this assertion went vacuous');
    }
  });
}

t('the runner sets the variable it asks the hooks to honour', () => {
  // The gate has two halves and neither is worth anything alone. Tested here rather than in the
  // PowerShell, because the PowerShell has no suite and this is the half that can silently rot.
  const runner = fs.readFileSync(path.join(REPO, 'dev', 'dream', 'dream_cycle.ps1'), 'utf8');
  if (!/\$env:CONSONANCE_DREAM\s*=\s*"1"/.test(runner)) {
    throw new Error('dream_cycle.ps1 does not set CONSONANCE_DREAM — every hook gate is dead code');
  }
  if (!/Remove-Item\s+Env:\\CONSONANCE_DREAM/.test(runner)) {
    throw new Error('the runner never clears CONSONANCE_DREAM — a -SyncOnly or attended run could leak it');
  }
  // It must wrap the claude invocation, not the whole script: set before, cleared after.
  const setAt = runner.indexOf('$env:CONSONANCE_DREAM = "1"');
  const callAt = runner.indexOf('& $claude -p');
  const clearAt = runner.indexOf('Remove-Item Env:\\CONSONANCE_DREAM');
  if (!(setAt < callAt && callAt < clearAt)) {
    throw new Error('the variable does not bracket the claude call (set -> invoke -> clear)');
  }
});

for (const d of tmpDirs) {
  try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {}
}
try { fs.rmSync(TMP_INSTANCES, { recursive: true, force: true }); } catch (_) {}

// Never let partial coverage read as full coverage. This prints every time, not only on failure.
if (unproven.length) {
  console.log(
    `\n  NOT BEHAVIOURALLY PROVEN (${unproven.length}/${HOOKS.length}): ${unproven.join(', ')}\n` +
      '  These are silent in this fixture with OR without the variable — they need a board.jsonl\n' +
      '  and a Main capture that this suite has no hermetic seam for, so their emit path is never\n' +
      '  reached and a green spawn would measure nothing. Covered by lexical + placement only,\n' +
      '  which is weaker. Give either hook a CONSONANCE_DATA seam (dream-watch.js:256 is the\n' +
      '  pattern) and it promotes itself here with no edit to this file.'
  );
}

console.log(`\ndream-gate: ${pass} passed, ${fails.length} failed`);
if (fails.length) {
  for (const f of fails) console.log('  FAIL  ' + f);
  process.exit(1);
}
