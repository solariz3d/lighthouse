// Tests for portable-paths.js — the ratchet that stops machine-specific paths re-entering
// shipped files.
//
// What is worth testing here, and why these cases:
//
//   · THE THREE HISTORICAL INCIDENTS, by their verbatim text. A guard that cannot catch its own
//     motivating cases is decoration. guard-census's tool line, guard-census's TEST line (the
//     subtler one — it is inside a *.test.js, where the blanket exemption would have hidden it),
//     and main.rs's OneDrive fallback each get an assertion. If a future simplification of
//     classify() lets any of them through, these go red.
//   · THE CRY-WOLF DECISIONS, which are the only reason a guard survives its second week:
//     comment lines are not scanned, line numbers are not part of the key, reindentation does
//     not fire, and a SECOND copy of a baselined line does fire.
//   · THE RUST TEST REGIONS. main.rs's 27 drive-literal hits are all inside `#[cfg(test)]`.
//     Without brace-counted region detection the guard reports 27 false FATALs in the most
//     important shipped file in the repo and is rightly ignored.
//   · THE RATCHET END TO END, against a throwaway git repo rather than the real one: green,
//     then inject an absolute path, then red, then remove, then green again.
//
// Run:  node consonance/tools/portable-paths.test.js

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const GUARD = path.join(__dirname, 'portable-paths.js');
const G = require('./portable-paths.js');

const verdictOf = (file, line) => {
  const hits = G.scan(line);
  assert.strictEqual(hits.length, 1, `expected exactly one hit in: ${line}`);
  return { detector: hits[0].detector, verdict: G.classify(file, hits[0], false) };
};

// ── the detectors ────────────────────────────────────────────────────────────────────────────

test('a drive-letter literal is detected', () => {
  assert.strictEqual(G.scan(`const D = 'C:\\\\Consonance\\\\data';`)[0].detector, 'DRIVE');
  assert.strictEqual(G.scan(`const D = "C:/Consonance/data";`)[0].detector, 'DRIVE');
  assert.strictEqual(G.scan(`let p = r"D:\\stuff";`)[0].detector, 'DRIVE');
});

test('a url is not a drive path', () => {
  assert.deepStrictEqual(G.scan('fetch("https://example.com/x")'), []);
  assert.deepStrictEqual(G.scan('const t = "10:13:27Z";'), []);
});

test('a portable prefix glued to a machine segment is DISGUISED, and the grep cannot see it', () => {
  const line = 'format!("{}\\\\OneDrive\\\\Desktop\\\\projects\\\\lighthouse\\\\exo_memory\\\\BOOT.md", home())';
  assert.strictEqual(/C:[\\/]/.test(line), false, 'precondition: a C:\\ grep misses this line entirely');
  assert.strictEqual(G.scan(line)[0].detector, 'DISGUISED');
});

test('a portable prefix with a fixed-by-convention segment does NOT fire', () => {
  // These are the shapes the guard must leave alone or it fires on every hook in the repo.
  assert.deepStrictEqual(G.scan(`path.join(os.homedir(), '.consonance.json')`), []);
  assert.deepStrictEqual(G.scan(`path.join(os.homedir(), '.claude', 'projects')`), []);
  assert.deepStrictEqual(G.scan(`format!("{}\\\\.consonance", home())`), []);
  assert.deepStrictEqual(G.scan(`format!("{}\\\\claude-instances", home())`), []);
  assert.deepStrictEqual(G.scan(`Join-Path $env:USERPROFILE '.cargo\\bin\\cargo.exe'`), []);
});

test('.consonance is not Consonance — the case distinction is load-bearing', () => {
  assert.deepStrictEqual(G.scan(`path.join(os.homedir(), '.consonance')`), [], 'portable data dir');
  assert.strictEqual(
    G.scan(`path.join(os.homedir(), 'Consonance', 'lighthouse')`)[0].detector,
    'DISGUISED',
    'the C:\\Consonance checkout, reached through home()');
});

// ── cry-wolf control ─────────────────────────────────────────────────────────────────────────

test('comment-only lines are not scanned', () => {
  assert.deepStrictEqual(G.scan(`// trace: C:\\Consonance\\data\\ferry.jsonl`), []);
  assert.deepStrictEqual(G.scan(`  * C:\\Users\\zackn\\Desktop\\lighthouse`), []);
  assert.deepStrictEqual(G.scan(`# $repo = "C:\\Consonance\\lighthouse"`), []);
});

test('code on a line that merely ENDS a comment is still scanned', () => {
  assert.strictEqual(G.scan(`const D = 'C:\\\\Consonance\\\\data'; // the box`)[0].detector, 'DRIVE');
});

test('the site key ignores indentation and line position', () => {
  const a = G.norm(`const D = 'C:\\\\Consonance\\\\data';`);
  const b = G.norm(`      const   D  =  'C:\\\\Consonance\\\\data';`);
  assert.strictEqual(a, b, 'reindenting a known site must not fire the guard');
});

// ── rust test regions ────────────────────────────────────────────────────────────────────────

test('brace-counted cfg(test) regions cover the whole module and stop at its end', () => {
  const src = [
    'fn live() {}',                    // 1
    '#[cfg(test)]',                    // 2
    'mod tests {',                     // 3
    '    fn a() {',                    // 4
    '        let p = "C:\\\\x";',      // 5
    '    }',                           // 6
    '}',                               // 7
    'fn also_live() {}',               // 8
  ].join('\n');
  const inTest = G.rustTestLines(src);
  assert.strictEqual(inTest.has(5), true, 'a nested line inside the module is test code');
  assert.strictEqual(inTest.has(7), true, 'the closing brace belongs to the module');
  assert.strictEqual(inTest.has(1), false, 'code before the attribute is live');
  assert.strictEqual(inTest.has(8), false, 'code after the module is live — the brace count closed');
});

test('main.rs has no drive literal in LIVE code, and this is what proves it', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs'), 'utf8');
  const inTest = G.rustTestLines(src);
  const live = G.scan(src).filter((h) => h.detector === 'DRIVE' && !inTest.has(h.line));
  assert.deepStrictEqual(live.map((h) => `${h.line}: ${h.text.trim()}`), [],
    'a drive literal reached live code in the shipped binary');
});

// ── the three historical incidents, verbatim ─────────────────────────────────────────────────

test('guard-census: the TOOL line that was broken on every machine', () => {
  // 28f749f, consonance/tools/guard-census.js:61. Shipped and unnoticed; the tool was dead
  // everywhere while its test passed.
  const r = verdictOf('consonance/tools/guard-census.js',
    `const BLACKBOX = "C:/Users/nname/Desktop/blackbox";`);
  assert.strictEqual(r.detector, 'DRIVE');
  assert.strictEqual(r.verdict, 'FATAL-USER');
});

test('guard-census: the TEST line, which a blanket test exemption would have hidden', () => {
  // 28f749f, consonance/tools/guard-census.test.js:99. This one is the reason FATAL-TEST-READ
  // exists: it lives in a *.test.js, and it still crashed the file ENOENT for over a week.
  const line = `  const f = path.join("C:/Users/nname/Desktop/lighthouse/consonance/src-tauri", "tests", "arch_test.rs");`;
  const hits = G.scan(line);
  assert.strictEqual(hits.length, 1);
  assert.strictEqual(G.classify('consonance/tools/guard-census.test.js', hits[0], false),
    'FATAL-TEST-READ', 'a test that BUILDS a real absolute path is not benign');
});

test('an ordinary fixture string in a test file stays benign', () => {
  // The other side of the same rule — if this fires, the guard cries wolf across 57 sites.
  const hits = G.scan(`  const PANE_CWD = 'C:\\\\panes\\\\sibling-test';`);
  assert.strictEqual(G.classify('consonance/hooks/findings-return.test.js', hits[0], false),
    'BENIGN-TEST');
});

test('main.rs: the OneDrive fallback that a drive-letter grep cannot see', () => {
  // consonance/src-tauri/src/main.rs:318 and :376 — the last-resort candidates in default_room()
  // and cards_dir(). cards_dir()'s caller is `if let Ok(entries) = fs::read_dir(...)`, so a miss
  // there ships an EMPTY DECK in silence.
  const r = verdictOf('consonance/src-tauri/src/main.rs',
    `    PathBuf::from(format!("{}\\\\OneDrive\\\\Desktop\\\\projects\\\\lighthouse\\\\exo_memory\\\\cards", home()))`);
  assert.strictEqual(r.detector, 'DISGUISED');
  assert.strictEqual(r.verdict, 'DISGUISED');
});

test('sessionstart-state: the env-override-with-a-one-box-default shape', () => {
  // The dominant FATAL shape in the repo, 24 of them. It READS as resolved because there is an
  // override; on a machine that does not set it, it resolves to one particular laptop's disk.
  const r = verdictOf('consonance/hooks/sessionstart-state.js',
    `const DATA = process.env.CONSONANCE_DATA || 'C:\\\\Consonance\\\\data';`);
  assert.strictEqual(r.verdict, 'FATAL-DEFAULT');
});

// ── scope ────────────────────────────────────────────────────────────────────────────────────

test('scope includes what ships and what runs, and excludes what is a dated record', () => {
  assert.strictEqual(G.inScope('consonance/src-tauri/src/main.rs'), true);
  assert.strictEqual(G.inScope('consonance/hooks/blind.js'), true);
  assert.strictEqual(G.inScope('consonance/tools/ferry.js'), true);
  assert.strictEqual(G.inScope('desktop-install.ps1'), true);
  assert.strictEqual(G.inScope('consonance/ui/vendor/xterm.js'), false, 'not ours');
  assert.strictEqual(G.inScope('exo_memory/loop/run1/score.js'), false, 'append-only record');
  assert.strictEqual(G.inScope('dev/mutation/mutate-sss.js'), false, 'mutates one named file by design');
  assert.strictEqual(G.inScope('exo_memory/journal/2026-08-22.md'), false, 'not a code file');
});

// ── the ratchet, end to end ──────────────────────────────────────────────────────────────────

function fixtureRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portable-paths-'));
  const tools = path.join(dir, 'consonance', 'tools');
  fs.mkdirSync(tools, { recursive: true });
  fs.writeFileSync(path.join(tools, 'clean.js'), `'use strict';\nconst D = process.env.X;\n`);
  execFileSync('git', ['-C', dir, 'init', '-q']);
  execFileSync('git', ['-C', dir, 'add', '-A']);
  return dir;
}

function runGuard(root, baseline, args = []) {
  try {
    const out = execFileSync(process.execPath, [GUARD, ...args], {
      encoding: 'utf8',
      env: { ...process.env, PORTABLE_PATHS_ROOT: root, PORTABLE_PATHS_BASELINE: baseline },
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

test('THE MUTATION PROOF: a new absolute path turns it red, removing it turns it green', () => {
  const root = fixtureRepo();
  const baseline = path.join(root, 'baseline.json');
  const target = path.join(root, 'consonance', 'tools', 'clean.js');
  const original = fs.readFileSync(target, 'utf8');

  runGuard(root, baseline, ['--update']);
  const before = runGuard(root, baseline);
  assert.strictEqual(before.code, 0, 'baseline state must be green:\n' + before.out);

  // MUTATE — the exact shape that has entered this repo three times in four days.
  fs.writeFileSync(target, original + `const LEDGER = process.env.NOPE || 'C:\\\\Consonance\\\\data\\\\x.jsonl';\n`);
  const red = runGuard(root, baseline);
  assert.strictEqual(red.code, 1, 'an unbaselined absolute path must fail the guard');
  assert.match(red.out, /RED/);
  assert.match(red.out, /FATAL-DEFAULT/);
  assert.match(red.out, /clean\.js/);

  // RESTORE
  fs.writeFileSync(target, original);
  const green = runGuard(root, baseline);
  assert.strictEqual(green.code, 0, 'removing it must return to green:\n' + green.out);
  assert.strictEqual(fs.readFileSync(target, 'utf8'), original, 'restored byte-identical');

  fs.rmSync(root, { recursive: true, force: true });
});

test('the DISGUISED shape also turns it red — the half a grep would miss', () => {
  const root = fixtureRepo();
  const baseline = path.join(root, 'baseline.json');
  const target = path.join(root, 'consonance', 'tools', 'clean.js');
  const original = fs.readFileSync(target, 'utf8');

  runGuard(root, baseline, ['--update']);
  fs.writeFileSync(target, original
    + `const M = path.join(os.homedir(), 'Desktop', 'lighthouse', 'METHOD.md');\n`);
  const red = runGuard(root, baseline);
  assert.strictEqual(red.code, 1);
  assert.match(red.out, /DISGUISED/);

  fs.rmSync(root, { recursive: true, force: true });
});

test('moving a known site does NOT fire, but a second copy of it does', () => {
  const root = fixtureRepo();
  const baseline = path.join(root, 'baseline.json');
  const target = path.join(root, 'consonance', 'tools', 'clean.js');
  const site = `const D = process.env.X || 'C:\\\\Consonance\\\\data';\n`;

  fs.writeFileSync(target, `'use strict';\n` + site);
  runGuard(root, baseline, ['--update']);

  // same text, different line number and indentation
  fs.writeFileSync(target, `'use strict';\nconst pad = 1;\nconst pad2 = 2;\n  ` + site);
  assert.strictEqual(runGuard(root, baseline).code, 0, 'a moved, reindented site must stay green');

  // a SECOND copy of the same text is a new site
  fs.writeFileSync(target, `'use strict';\n` + site + site);
  const red = runGuard(root, baseline);
  assert.strictEqual(red.code, 1, 'a duplicated site must fire');

  fs.rmSync(root, { recursive: true, force: true });
});

test('a green run over ZERO files is refused, not reported clean', () => {
  // js-suite's rule 2, and the failure it was written for: three consecutive pipe tests on
  // 2026-08-17 returned "0 rows" and exit 0, indistinguishable from a dead hook.
  const root = fixtureRepo();
  const baseline = path.join(root, 'baseline.json');
  runGuard(root, baseline, ['--update']);
  fs.rmSync(path.join(root, 'consonance'), { recursive: true, force: true });
  execFileSync('git', ['-C', root, 'add', '-A']);
  const r = runGuard(root, baseline);
  assert.strictEqual(r.code, 2, 'zero files in scope must be a refusal, not a green');
  assert.match(r.out, /ZERO files/);
  fs.rmSync(root, { recursive: true, force: true });
});

test('a missing baseline is a refusal with instructions, not a silent pass', () => {
  const root = fixtureRepo();
  const r = runGuard(root, path.join(root, 'does-not-exist.json'));
  assert.strictEqual(r.code, 2);
  assert.match(r.out, /--update/);
  fs.rmSync(root, { recursive: true, force: true });
});

test('the real repo is green against its committed baseline', () => {
  // Not a tautology: --update was run once and its output reviewed. From here on this asserts
  // that nothing has landed since.
  const r = runGuard(path.resolve(__dirname, '..', '..'),
    path.join(__dirname, 'portable-paths.baseline.json'));
  assert.strictEqual(r.code, 0, r.out);
  assert.match(r.out, /green/);
});
