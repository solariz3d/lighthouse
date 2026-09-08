// install-only.test.js — pins dev/shell/install.ps1's SELECTIVITY and its EXCLUSIONS.
//
// WHY THIS FILE EXISTS, and it is a caused defect rather than a discovered one. On 2026-09-07 the
// chair ran install.ps1 to sync ONE drifted file (userprompt_pulse.py). The installer registers
// all-or-nothing, so the same run re-registered hooks\stop.js, l2-overseer.js and l3-overseer.js
// AGAINST A KEEPER RULING THAT WAS ALREADY ON DISK (2026-09-06 06:55,
// exo_memory/librarian/2026-09-06.md:603 — "READY PAIR ONLY"). Removing them again by hand then
// deleted ready-stop.js by substring collision. Backup: ~/.claude/settings.json.bak-20260907-063417.
//
// THE RULING WAS PROSE AND THE INSTALLER WAS DATA, so the installer won. That is the 2026-09-02
// ruling one level up: a control whose only enforcement is that somebody remembers it has a hook's
// failure mode — silent absence. `-Only` is the ergonomic half and it is NOT the fix: it still
// requires the operator to remember to pass it. `Excluded` in $register is the structural half, and
// it is the one the objective needs, because a BARE run has to honour the ruling too.
//
// WHAT THIS ANSWERS IN universe-print.test.js, which says of install.ps1: "Automating it means
// planting files in the repo and in ~/.claude/shell on every suite run, which is a decision for the
// seat that owns the tree." That objection is correct about the REAL tree and does not apply here:
// every run below builds a THROWAWAY REPO (a copy of dev/shell/ and consonance/hooks/) and a
// THROWAWAY USERPROFILE under os.tmpdir(). The installer resolves $repo from $PSScriptRoot and
// $dest from $env:USERPROFILE, so both ends move. Nothing here touches the repo, ~/.claude, or the
// build. The planting the objection refuses is done to the copy.
//
// WHAT IT DOES NOT COVER, stated because a test whose scope is unprinted is the same failure one
// level up:
//   NOT COVERED  the DESKTOP. This machine cannot see it. `Excluded` is repo-wide and the keeper's
//                ruling was spoken about this install; if the desktop legitimately runs l3-overseer
//                (install.ps1's own header, 2026-08-17, says it writes the arc-perceptions he reads
//                every turn) its -Check will now go red with EXCLUDED BUT LIVE. That is deliberate —
//                the script still never unregisters anything — but whether the ruling was meant to
//                reach that machine is the keeper's to say, not this file's to assert.
//   NOT COVERED  the removal path, because install.ps1 HAS none and must not gain one. See the
//                ruling in exo_memory/handback/p-installer-only_2026-09-08.md §3.
//   NOT COVERED  Test-SameHook's separator guard in isolation. Test 5 exercises it through a real
//                re-point, which is the only way it is ever reached.

'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const REPO = path.resolve(__dirname, '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'installonly-'));
let seq = 0;

// A throwaway repo: only the two source directories the manifest draws from, plus the script.
// Copied rather than symlinked so a mutant can be applied to the copy without touching the tree.
function mkRepo(mutate) {
  const root = path.join(tmp, 'repo' + (++seq));
  for (const rel of ['dev/shell/lib', 'dev/shell/hooks', 'consonance/hooks']) {
    const from = path.join(REPO, rel.split('/').join(path.sep));
    const to = path.join(root, rel.split('/').join(path.sep));
    fs.mkdirSync(to, { recursive: true });
    for (const e of fs.readdirSync(from, { withFileTypes: true })) {
      if (e.isFile()) fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
    }
  }
  const script = path.join(root, 'dev', 'shell', 'install.ps1');
  let body = fs.readFileSync(path.join(REPO, 'dev', 'shell', 'install.ps1'), 'utf8');
  if (mutate) body = mutate(body);
  fs.writeFileSync(script, body);
  return { root, script };
}

// A throwaway USERPROFILE. `hooks` defaults to an empty object: the fresh-machine case.
function mkHome(hooks) {
  const home = path.join(tmp, 'home' + (++seq));
  fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(home, '.claude', 'settings.json'),
    JSON.stringify({ hooks: hooks || {} }, null, 2));
  return home;
}

function run(repo, home, args) {
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', repo.script, ...(args || [])], {
    encoding: 'utf8', env: { ...process.env, USERPROFILE: home }, timeout: 120000,
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

function settings(home) {
  return JSON.parse(fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8'));
}

/** Every command string registered on any event, flattened. */
function commands(home) {
  const out = [];
  const h = settings(home).hooks || {};
  for (const ev of Object.keys(h)) {
    for (const g of [].concat(h[ev] || [])) {
      for (const k of [].concat(g.hooks || [])) if (k.command) out.push(ev + ' ' + k.command);
    }
  }
  return out;
}

/** Leaf-name occurrences, counted with the separator guard the installer itself uses. */
function count(home, leaf) {
  const re = new RegExp('[\\\\/]' + leaf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return commands(home).filter((c) => re.test(c)).length;
}

const EXCLUDED = ['stop.js', 'l2-overseer.js', 'l3-overseer.js'];

// ── 1 and 2 are the two RED-FIRST cases the packet named. ────────────────────────────────────

test('RED FIRST: syncing ONE file does not register the hooks the keeper excluded', () => {
  const repo = mkRepo(), home = mkHome();
  const r = run(repo, home, ['-Only', 'userprompt_pulse.py']);
  assert.strictEqual(count(home, 'userprompt_pulse.py'), 1,
    'the file asked for must be the one registered: ' + JSON.stringify(commands(home)) + '\n' + r.out);
  for (const leaf of EXCLUDED) {
    assert.strictEqual(count(home, leaf), 0,
      `-Only registered ${leaf}, which the 2026-09-06 06:55 ruling excludes: ` + JSON.stringify(commands(home)));
  }
  assert.strictEqual(count(home, 'session-start.js'), 0,
    '-Only must not register entries nobody asked for: ' + JSON.stringify(commands(home)));
});

test('RED FIRST: a BARE run honours the exclusion too — the operator is not the control', () => {
  const repo = mkRepo(), home = mkHome();
  const r = run(repo, home, []);
  assert.strictEqual(count(home, 'session-start.js'), 1,
    'a bare run must still register everything not excluded: ' + r.out);
  for (const leaf of EXCLUDED) {
    assert.strictEqual(count(home, leaf), 0,
      `a bare run registered ${leaf} against a standing ruling — this is the 2026-09-07 defect: `
      + JSON.stringify(commands(home)));
  }
  assert.ok(/EXCLUDED/.test(r.out), 'the run must SAY it skipped them, not skip silently:\n' + r.out);
});

// TWO MUTANTS, NOT ONE, AND FINDING THAT OUT IS PART OF THE RESULT. The packet asked for one —
// "make -Only register everything anyway => red". Written that way it FAILED, and correctly: with
// the filter gone the excluded hooks were still not registered, because `Excluded` is enforced in
// the writer and not in the filter. That is the claim the whole change rests on — the ergonomic
// half and the structural half are independent controls — so it gets a mutant each rather than one
// mutant asserting both. The first version of this test asserted both and was wrong about the code
// it was testing.

test('MUTANT 1 — an -Only that filters nothing registers everything, and test 1 catches it', () => {
  // Applied to the copy, at the marker the filter declares for exactly this purpose.
  const repo = mkRepo((b) => b.replace(
    /# MUTANT-ANCHOR: THE FILTER[\s\S]*?# MUTANT-ANCHOR: END/,
    '$syncFiles = $files; $regEntries = $register'));
  const home = mkHome();
  run(repo, home, ['-Only', 'userprompt_pulse.py']);
  assert.ok(count(home, 'session-start.js') > 0,
    'the mutant did not apply — the anchor moved, so this test proves nothing');
  // AND THE FINDING: the exclusion survives the loss of the filter. -Only is convenience;
  // Excluded is the control. If this line ever goes red, they have been welded together.
  for (const leaf of EXCLUDED) {
    assert.strictEqual(count(home, leaf), 0,
      `the exclusion must not depend on -Only — it is the half that works when nobody types a flag: ${leaf}`);
  }
});

test('MUTANT 2 — drop the Excluded guard and the 2026-09-07 defect returns, and test 2 catches it', () => {
  // The minimal mutant: leave the announcement, drop the `continue`, so an excluded entry is
  // printed AND registered. Anchored on `$skipped++`, which occurs once — the first version
  // anchored on `if ($e.Excluded) {` and silently ate the -Check block that shares the condition,
  // producing an empty settings.json that would have read as "the guard held".
  const repo = mkRepo((b) => b.replace(/(\r?\n    \$skipped\+\+)\r?\n    continue\r?\n/, '$1\n'));
  const home = mkHome();
  const r = run(repo, home, []);
  assert.ok(EXCLUDED.every((l) => count(home, l) === 1),
    'the mutant did not apply — the guard moved, so this test proves nothing: '
    + JSON.stringify(commands(home)) + '\n' + r.out);
});

test('-Only with a name the manifest does not carry REFUSES and writes nothing', () => {
  const repo = mkRepo(), home = mkHome();
  const before = fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8');
  const r = run(repo, home, ['-Only', 'userprompt-pulse.py']);   // hyphen, not underscore
  assert.notStrictEqual(r.code, 0, 'a typo that silently syncs nothing IS the silent-absence failure');
  assert.ok(/userprompt-pulse\.py/.test(r.out), 'it must name what it did not recognise:\n' + r.out);
  assert.strictEqual(fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8'), before,
    'a refused run must change nothing');
});

test('-Only is REFUSED with -Check: a report over a subset reads as a report', () => {
  const repo = mkRepo(), home = mkHome();
  const r = run(repo, home, ['-Check', '-Only', 'userprompt_pulse.py']);
  assert.notStrictEqual(r.code, 0, 'a restricted check is a green over a set that excludes the thing');
  assert.ok(/-Only.*-Check|-Check.*-Only/s.test(r.out), 'it must say which two flags conflict:\n' + r.out);
});

// ── 5. The substring collision, exercised through the path that actually reaches the matcher. ──

test('re-pointing sourced-stop.js does not take ready-stop.js with it', () => {
  const repo = mkRepo();
  const home = mkHome({
    Stop: [{ hooks: [
      { type: 'command', command: '"node" "X:\\old\\sourced-stop.js"' },
      { type: 'command', command: '"node" "X:\\old\\ready-stop.js"' },
    ] }],
  });
  const r = run(repo, home, []);
  assert.strictEqual(count(home, 'sourced-stop.js'), 1, 'duplicated or destroyed: ' + JSON.stringify(commands(home)));
  assert.strictEqual(count(home, 'ready-stop.js'), 1, 'duplicated or destroyed: ' + JSON.stringify(commands(home)));
  const stray = commands(home).filter((c) => /X:\\old/.test(c));
  assert.strictEqual(stray.length, 0, 'both should have been re-pointed at $dest: ' + JSON.stringify(stray) + '\n' + r.out);
  assert.strictEqual(count(home, 'stop.js'), 0,
    'stop.js is excluded and must not have been added by matching a suffix of another name: '
    + JSON.stringify(commands(home)));
});

// ── 6-8. The check's own blind spot: a file it never looked at. ────────────────────────────────

test('POSITIVE CONTROL: a fresh install of this repo, checked immediately, is GREEN', () => {
  // Without this, every red below could be the temp fixture rather than the finding.
  const repo = mkRepo(), home = mkHome();
  run(repo, home, []);
  const r = run(repo, home, ['-Check']);
  assert.strictEqual(r.code, 0, 'a just-installed tree must check clean, or nothing below discriminates:\n' + r.out);
});

test('an installable hook on no manifest entry turns -Check RED and is NAMED', () => {
  const repo = mkRepo(), home = mkHome();
  run(repo, home, []);
  fs.writeFileSync(path.join(repo.root, 'consonance', 'hooks', 'zz-brand-new.js'), '// planted\n');
  const r = run(repo, home, ['-Check']);
  assert.notStrictEqual(r.code, 0, 'a state nothing names is the defect; UNDECLARED must move the exit code:\n' + r.out);
  assert.ok(/zz-brand-new\.js/.test(r.out), 'it must name the file:\n' + r.out);
  assert.ok(/UNDECLARED/.test(r.out), 'and say which state it is in:\n' + r.out);
});

test('a hook declared deliberately unmanaged prints its REASON and is not red', () => {
  const repo = mkRepo(), home = mkHome();
  run(repo, home, []);
  const r = run(repo, home, ['-Check']);
  assert.strictEqual(r.code, 0, 'the two declared-unmanaged hooks must not set red:\n' + r.out);
  for (const leaf of ['ask-surface.js', 'baton-wake-stop.js']) {
    assert.ok(new RegExp(leaf.replace('.', '\\.')).test(r.out), `-Check must still print ${leaf}:\n` + r.out);
  }
  assert.ok(/DECLARED UNMANAGED/.test(r.out), 'the named state must appear:\n' + r.out);
  assert.ok(!/UNDECLARED\s+2\b/.test(r.out), 'they must not also count as undeclared:\n' + r.out);
});

test('an EXCLUDED hook that is live anyway is RED — the ruling is checked, not assumed', () => {
  const repo = mkRepo(), home = mkHome();
  run(repo, home, []);
  const s = settings(home);
  s.hooks.Stop = [].concat(s.hooks.Stop || []);
  s.hooks.Stop[0].hooks = [].concat(s.hooks.Stop[0].hooks || [])
    .concat([{ type: 'command', command: '"node" "' + path.join(home, '.claude', 'shell', 'hooks', 'l3-overseer.js') + '"' }]);
  fs.writeFileSync(path.join(home, '.claude', 'settings.json'), JSON.stringify(s, null, 2));
  const r = run(repo, home, ['-Check']);
  assert.notStrictEqual(r.code, 0, 'an excluded hook running anyway must not read green:\n' + r.out);
  assert.ok(/EXCLUDED BUT LIVE/.test(r.out), 'and must be named as that, not as an ordinary extra:\n' + r.out);
  assert.ok(/l3-overseer\.js/.test(r.out), 'naming the hook:\n' + r.out);
});

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
