// Both directions, on a real git repo built for the test.
//
// A gate that only ever goes red is not a gate, it is an alarm stuck on — and it gets muted,
// which is worse than never having built it. So the load-bearing assertion here is the GREEN
// one: a correction that lands must pass. The red case is easy and proves less.
//
// Synthetic fixtures agree with the rule by construction, so these run against actual commits
// in a throwaway repository rather than against a hand-made commit object.
//
//   node consonance/tools/corrections-gate.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { gate } = require('./corrections-gate.js');

function repoWith(commits) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cgate-'));
  const git = (...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8' });
  git('init', '-q');
  git('config', 'user.email', 't@t');
  git('config', 'user.name', 't');
  const map = path.join(dir, 'exo_memory');
  fs.mkdirSync(map, { recursive: true });
  const file = path.join(map, 'muscle_map.md');
  for (const c of commits) {
    c.write(file);
    git('add', '-A');
    git('commit', '-q', '-m', c.subject);
  }
  return dir;
}

test('RED: a correction whose diff removes nothing and marks nothing', () => {
  const repo = repoWith([
    { subject: 'the original claim', write: f => fs.writeFileSync(f, 'A: the discipline arm is caught by looking harder.\n') },
    { subject: 'Track 2 corrected: articulation is not installation',
      write: f => fs.appendFileSync(f, '\nB: actually it needs a trigger.\n') },
  ]);
  const r = gate({ repo, since: '1 hour ago' });
  assert.strictEqual(r.offenders.length, 1, 'the append-beside-it correction must be caught');
  assert.strictEqual(r.passed.length, 0);
});

test('GREEN: a correction that strikes IN PLACE passes, though its diff deletes nothing', () => {
  // This is the case the room actually settled on — original text kept verbatim, marked, dated.
  // If this went red the gate would be pushing authors toward deleting history, which is the
  // failure maintenance law 2 exists to prevent. The gate must not fight the law.
  const repo = repoWith([
    { subject: 'the original claim', write: f => fs.writeFileSync(f, 'A: the discipline arm is caught by looking harder.\n') },
    { subject: 'Track 2 corrected: articulation is not installation',
      write: f => fs.writeFileSync(f,
        'A: the discipline arm is caught by looking harder.\n' +
        '> STRUCK 2026-07-29: falsified three times the same day; depth needs a trigger.\n') },
  ]);
  const r = gate({ repo, since: '1 hour ago' });
  assert.strictEqual(r.offenders.length, 0, 'a struck-in-place correction must PASS');
  assert.strictEqual(r.passed.length, 1);
});

test('GREEN: a correction that genuinely deletes a line passes', () => {
  const repo = repoWith([
    { subject: 'the original claim', write: f => fs.writeFileSync(f, 'wrong line\nkeep this\n') },
    { subject: 'Correction: drop the wrong line', write: f => fs.writeFileSync(f, 'keep this\n') },
  ]);
  const r = gate({ repo, since: '1 hour ago' });
  assert.strictEqual(r.offenders.length, 0);
});

test('a marker inherited from an EARLIER commit does not excuse a later one', () => {
  // The failure that would quietly retire this gate: once the file contains STRUCK anywhere,
  // a naive check passes forever. The marker has to be in what THIS commit added.
  const repo = repoWith([
    { subject: 'first correction, struck properly',
      write: f => fs.writeFileSync(f, 'claim one\n> STRUCK 2026-07-29: superseded.\n') },
    { subject: 'Correction: a second one, filed below',
      write: f => fs.appendFileSync(f, '\nclaim two, and a note about it\n') },
  ]);
  const r = gate({ repo, since: '1 hour ago' });
  assert.strictEqual(r.offenders.length, 1,
    'the second correction added no marker of its own and must still go red');
});

test('files outside the guarded set are reported, never failed', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cgate-o-'));
  const git = (...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8' });
  git('init', '-q'); git('config', 'user.email', 't@t'); git('config', 'user.name', 't');
  fs.writeFileSync(path.join(dir, 'notes.md'), 'x\n');
  git('add', '-A'); git('commit', '-q', '-m', 'seed');
  fs.appendFileSync(path.join(dir, 'notes.md'), 'y\n');
  git('add', '-A'); git('commit', '-q', '-m', 'Correction: an append-only journal, which is fine');
  const r = gate({ repo: dir, since: '1 hour ago' });
  assert.strictEqual(r.offenders.length, 0, 'an append-only journal is CORRECT and must not fail');
  assert.ok(r.ignored.length >= 1, 'and it is still reported as seen');
});

test('a commit with no correction word in its subject is not judged at all', () => {
  const repo = repoWith([
    { subject: 'seed', write: f => fs.writeFileSync(f, 'a\n') },
    { subject: 'Cycle 9 on the map', write: f => fs.appendFileSync(f, 'b\n') },
  ]);
  const r = gate({ repo, since: '1 hour ago' });
  assert.strictEqual(r.total, 0, 'this gate judges declared corrections only');
});
