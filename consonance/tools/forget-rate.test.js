// forget-rate.test.js — P-UNIVERSE clause 2 for forget-rate.js: demonstrate a POSITIVE.
//
// WHY A FIXTURE AND NOT THE REPO. forget-rate's whole finding is that this corpus has never
// forgotten anything: run against `exo_memory/` it prints zero, all-time, and a tool that prints
// zero over a corpus containing no positives is INDISTINGUISHABLE FROM A TOOL THAT CANNOT FIRE.
// That is turn-scan v1's defect exactly ("8,065 rows seen · 0 skipped", every word true, the
// instrument structurally incapable of firing — `universe-print.test.js`). So the positives are
// built here, in a throwaway git repo, and the tool must find every one of them.
//
// THE ABUSE CONDITION, and it is the reason the fixture looks the way it does. Clause 2 is
// satisfiable dishonestly by planting a positive drawn from the DETECTOR'S OWN UNIT — a specimen
// shaped like what the tool already looks for. So every positive below is constructed from the
// PHENOMENON'S definition — "a file a seat could read on the path, and now cannot" — and two of
// them are built specifically to be invisible to the mechanisms the tool leans on:
//
//   demoted.md    moved to attic/ by DELETE-PLUS-ADD, no `git mv`, so there is no rename link.
//                 This is not a hypothetical: `attic/the_night_skeleton.md`, the only real
//                 demotion in the repo's history, entered exactly this way.
//   born-died.md  created AND demoted inside the window, so it is in neither endpoint's tree and
//                 a START-vs-END set difference cannot see it. A working forgetting organ would
//                 produce this shape more often than any other.
//
// AND THE NEGATIVE THAT MATTERS MOST is `churned.md`: a file that loses more lines than any
// departure below, and must appear ONLY in churn. That is the chair's question in one assertion —
// deletion-as-editing must never score as forgetting — and it is the failure that satisfied
// registration 44's falsifier within four hours of it being written.
//
// NOT COVERED, stated because an unprinted scope is the same defect one level up: the real
// `exo_memory/` history is exercised only by the three all-time assertions at the bottom, which
// pin the current answer (zero departures, one similarity-only rename) so that a future demotion
// or a broken classifier changes a test rather than a paragraph. Nothing here runs `--json`.

'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const TOOL = path.join(__dirname, 'forget-rate.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'forget-rate-'));

function git(repo, args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
}
function write(repo, rel, body) {
  const full = path.join(repo, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body);
}
function run(repo, args, env) {
  const r = spawnSync(process.execPath, [TOOL].concat(args), {
    encoding: 'utf8',
    env: Object.assign({}, process.env, { FORGET_RATE_REPO: repo }, env || {}),
  });
  return { out: (r.stdout || '') + (r.stderr || ''), code: r.status };
}

/* A fixture whose reading-path rule is authorised by a stand-in main.rs, so the test never depends
 * on the real one and a change to the real one cannot silently turn these green. */
function fixture() {
  const repo = fs.mkdtempSync(path.join(tmp, 'repo-'));
  git(repo, ['init', '-q']);
  git(repo, ['config', 'user.email', 'fixture@test']);
  git(repo, ['config', 'user.name', 'fixture']);

  // START — five files on the reading path, plus one off it.
  write(repo, 'exo_memory/loop/stays.md', 'a\nb\nc\n');
  write(repo, 'exo_memory/loop/churned.md', ['1','2','3','4','5','6','7','8','9','10'].join('\n') + '\n');
  write(repo, 'exo_memory/loop/deleted.md', 'gone forever\n');
  write(repo, 'exo_memory/loop/demoted.md', 'ore, not a cue\n');
  write(repo, 'exo_memory/loop/renamed.md', 'same bytes, new path\n');
  write(repo, 'exo_memory/loop/notes.json', '{}\n');
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-qm', 'start']);
  const start = git(repo, ['rev-parse', 'HEAD']).trim();

  // A file born inside the window — invisible to a START-vs-END set difference.
  write(repo, 'exo_memory/loop/born-died.md', 'lived one commit\n');
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-qm', 'born']);

  // END — the four events, plus the two controls.
  fs.unlinkSync(path.join(repo, 'exo_memory/loop/deleted.md'));

  // DEMOTED, done as delete-plus-add so no rename link exists to follow. Byte-identical.
  const ore = fs.readFileSync(path.join(repo, 'exo_memory/loop/demoted.md'));
  fs.unlinkSync(path.join(repo, 'exo_memory/loop/demoted.md'));
  write(repo, 'exo_memory/attic/demoted.md', ore.toString());

  const born = fs.readFileSync(path.join(repo, 'exo_memory/loop/born-died.md'));
  fs.unlinkSync(path.join(repo, 'exo_memory/loop/born-died.md'));
  write(repo, 'exo_memory/attic/born-died.md', born.toString());

  // RENAMED on the path, byte-identical — must NOT count as forgetting.
  const same = fs.readFileSync(path.join(repo, 'exo_memory/loop/renamed.md'));
  fs.unlinkSync(path.join(repo, 'exo_memory/loop/renamed.md'));
  write(repo, 'exo_memory/loop/renamed-to.md', same.toString());

  // CHURN — loses six lines, more than any departure, and stays on the path.
  write(repo, 'exo_memory/loop/churned.md', '1\n2\n3\n4\n');

  write(repo, 'exo_memory/loop/arrived.md', 'new\n');
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-qm', 'end']);

  // The authority the tool greps for the rule.
  const rs = path.join(repo, 'main.rs');
  fs.writeFileSync(rs, 'if q.file_name().and_then(|x| x.to_str()) == Some("attic") { continue; }\n' +
                       'q.extension().and_then(|x| x.to_str()) == Some("md")\n');
  return { repo, start, rs };
}

const F = fixture();
const base = (extra) => run(F.repo, ['--from', F.start].concat(extra || []),
                            { FORGET_RATE_MAIN_RS: F.rs });

console.log('forget-rate.test.js');

// ---- clause 2: the positives ------------------------------------------------------------------

test('a deleted file is reported as DELETED', () => {
  const { out } = base();
  assert.ok(/DELETED\s+1/.test(out), 'expected DELETED 1\n' + out);
  assert.ok(out.includes('exo_memory/loop/deleted.md'), 'deleted.md not named\n' + out);
});

test('a file moved to attic/ WITHOUT a rename link is reported as DEMOTED', () => {
  const { out } = base();
  assert.ok(out.includes('exo_memory/loop/demoted.md  ->  exo_memory/attic/demoted.md'),
            'demotion not detected via blob identity\n' + out);
});

test('a file BORN and demoted inside the window is still caught', () => {
  const { out } = base();
  assert.ok(out.includes('exo_memory/loop/born-died.md'),
            'a file absent from both endpoint trees was missed\n' + out);
});

test('the departures total counts deletions and demotions and nothing else', () => {
  const { out } = base();
  const m = out.match(/FORGOTTEN\s+(\d+) files/);
  assert.ok(m, 'no FORGOTTEN line\n' + out);
  assert.strictEqual(m[1], '3', 'expected 3 forgotten (deleted + 2 demoted)\n' + out);
});

// ---- the negative the chair asked for ---------------------------------------------------------

test('CHURN never counts as forgetting, however many lines it removes', () => {
  const { out } = base();
  const dep = out.slice(out.indexOf('DEPARTURES'), out.indexOf('CHURN'));
  assert.ok(!dep.includes('churned.md'),
            'a file that only lost lines was reported as a departure\n' + dep);
  assert.ok(/cumulative, survivors\s+\+\d+ \/ -6\b/.test(out),
            'the six churned lines are not in the survivor churn row\n' + out);
});

test('a rename that stays on the path is reported as still readable, not as forgetting', () => {
  const { out } = base();
  assert.ok(out.includes('exo_memory/loop/renamed.md  ->  exo_memory/loop/renamed-to.md'),
            'rename not resolved\n' + out);
  const rn = out.match(/RENAMED\s+(\d+)/);
  assert.strictEqual(rn[1], '1', 'expected RENAMED 1\n' + out);
});

// ---- clause 1: the universe -------------------------------------------------------------------

test('a deliberately hidden item appears in the SKIPPED count with the rule that skipped it', () => {
  const { out } = base();
  assert.ok(/not \.md \(the shelf loads \.md only\)/.test(out),
            'notes.json is not accounted for in the skipped breakdown\n' + out);
  assert.ok(/under attic\//.test(out), 'attic files are not accounted for\n' + out);
});

test('the universe changes when pointed at a DIFFERENT authority', () => {
  // The smallest available proof that the rule is read rather than recited: break the authority
  // and the tool must refuse rather than fall back to the rule written in its own source.
  const broken = path.join(tmp, 'broken.rs');
  fs.writeFileSync(broken, '// an authority that no longer says what it said\n');
  const { out, code } = run(F.repo, ['--from', F.start], { FORGET_RATE_MAIN_RS: broken });
  assert.ok(out.includes('UNIVERSE: UNKNOWN'), 'expected UNKNOWN, got\n' + out);
  assert.ok(!/FORGOTTEN/.test(out), 'reported a rate from an unauthorised rule\n' + out);
  assert.strictEqual(code, 3, 'expected exit 3');
});

test('an unreadable authority does NOT fall back to a built-in rule', () => {
  const { out } = run(F.repo, ['--from', F.start],
                      { FORGET_RATE_MAIN_RS: path.join(tmp, 'does-not-exist.rs') });
  assert.ok(out.includes('UNIVERSE: UNKNOWN'), 'a missing authority produced a number\n' + out);
});

// ---- the negative control ---------------------------------------------------------------------

test('an empty window reports nothing at all', () => {
  const { out } = run(F.repo, ['--from', 'HEAD', '--to', 'HEAD'], { FORGET_RATE_MAIN_RS: F.rs });
  assert.ok(/FORGOTTEN\s+0 files/.test(out), 'a zero-length window found departures\n' + out);
});

// ---- the real corpus, pinned so a change breaks a test rather than a paragraph ------------------

test('exo_memory/ has never lost a file from the reading path (all-time)', () => {
  const r = spawnSync(process.execPath, [TOOL], { encoding: 'utf8' });
  const out = r.stdout || '';
  assert.ok(/FORGOTTEN\s+0 files/.test(out),
            'a departure appeared in the real corpus — update loop/forgetting_pilot_2026-08-25.md\n' + out);
  assert.ok(/RENAMED_SIMILAR\s+1/.test(out),
            'the de65698 card rename is no longer the single similarity-only departure\n' + out);
});

console.log(`\n${pass} passed, ${fail} failed`);
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) {}
process.exit(fail ? 1 : 0);
