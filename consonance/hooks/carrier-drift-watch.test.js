// carrier-drift-watch.test.js — the hook's three behaviours, spawned for real.
// Run: node --test consonance/hooks/carrier-drift-watch.test.js
//
// WHAT THESE ARE FOR. The detector's own suite proves it can tell a drifted carrier from a clean
// one. None of that reaches anybody if the hook is silent when it should speak, loud when it
// should not, or writes no evidence that it ran at all. Those are three different failures and
// only the middle one is visible without a test.
//
// The fixture is a whole small repo with a real copy of the tool in it, driven through
// CARRIER_DRIFT_REPO. Asserting against the live repo would make these tests pass or fail on
// whatever anyone else changed this hour, and a hook test that moves with the tree is the
// measures-nothing shape.
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'carrier-drift-watch.js');
const TOOL = path.join(__dirname, '..', 'tools', 'carrier-drift.js');

const beds = [];
test.after(() => { for (const b of beds) fs.rmSync(b, { recursive: true, force: true }); });

/** A fixture repo with the real tool in it, one carrier, and a registry. */
function bed({ marker }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cdw-'));
  beds.push(root);
  const repo = path.join(root, 'repo');
  const data = path.join(root, 'data');
  fs.mkdirSync(path.join(repo, 'consonance', 'tools'), { recursive: true });
  fs.mkdirSync(path.join(repo, 'exo_memory'), { recursive: true });
  fs.mkdirSync(data, { recursive: true });
  fs.copyFileSync(TOOL, path.join(repo, 'consonance', 'tools', 'carrier-drift.js'));
  fs.writeFileSync(path.join(repo, 'exo_memory', 'CARD.md'),
    'the human remains the only decorrelated instrument.\n' +
    (marker ? '\n> **WITHDRAWN 2026-08-16** correct form: least-correlated.\n' : ''));
  fs.writeFileSync(path.join(repo, 'consonance', 'tools', 'carrier-drift.registry.json'),
    JSON.stringify({ withdrawals: [{
      id: 'w1', claim: 'c', withdrawn_at: 'journal/x.md:1', correct_form: 'least-correlated',
      pattern: 'only\\s+(?:\\w+\\s+){0,2}decorrelated', marker: 'WITHDRAWN 2026-08-16',
      sites: [{ file: 'exo_memory/CARD.md', anchor: 'remains the only decorrelated instrument',
        kind: 'marked', why: 'fixture' }],
    }] }));
  return { root, repo, data };
}

function fire(b, extraEnv = {}) {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ session_id: 'test', cwd: b.repo }),
    encoding: 'utf8',
    env: Object.assign({}, process.env, {
      CARRIER_DRIFT_REPO: b.repo, CONSONANCE_DATA: b.data,
      CONSONANCE_DREAM: '',
    }, extraEnv),
  });
  const ledgerPath = path.join(b.data, 'carrier-drift.jsonl');
  const rows = fs.existsSync(ledgerPath)
    ? fs.readFileSync(ledgerPath, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];
  return { status: r.status, out: r.stdout || '', rows };
}

test('a clean tree is silent, and still leaves a row saying it ran', () => {
  const b = bed({ marker: true });
  const r = fire(b);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.out.trim(), '', 'green must not speak');
  assert.strictEqual(r.rows.length, 1, 'silence still has to be evidenced');
  assert.strictEqual(r.rows[0].verdict, 'GREEN');
  assert.strictEqual(r.rows[0].spoke, false);
});

test('a drifted carrier speaks, names the file, and hands over the command', () => {
  const b = bed({ marker: false });
  const r = fire(b);
  assert.strictEqual(r.status, 0, 'a sensor never fails the turn');
  assert.match(r.out, /CARRIER DRIFT/);
  assert.match(r.out, /exo_memory\/CARD\.md/);
  assert.match(r.out, /node consonance\/tools\/carrier-drift\.js/);
  assert.strictEqual(r.rows[0].verdict, 'RED');
  assert.strictEqual(r.rows[0].spoke, true);
});

test('the SAME red does not speak twice — the 27-day nag, designed out', () => {
  const b = bed({ marker: false });
  assert.match(fire(b).out, /CARRIER DRIFT/);
  const second = fire(b);
  assert.strictEqual(second.out.trim(), '', 'an outstanding red is not news on the next turn');
  assert.strictEqual(second.rows.length, 2, 'but it still records that it fired');
  assert.strictEqual(second.rows[1].spoke, false);
  assert.strictEqual(second.rows[1].verdict, 'RED');
});

test('a DIFFERENT red speaks immediately, cooldown or not', () => {
  const b = bed({ marker: false });
  fire(b);
  fs.appendFileSync(path.join(b.repo, 'exo_memory', 'CARD.md'),
    '\nand the keeper is the only decorrelated reader anyway.\n');
  const r = fire(b);
  assert.match(r.out, /CARRIER DRIFT/, 'a new finding must not be swallowed by the cooldown');
});

test('returning to green re-arms, so the next red speaks at once', () => {
  const b = bed({ marker: false });
  fire(b);
  const card = path.join(b.repo, 'exo_memory', 'CARD.md');
  const drifted = fs.readFileSync(card, 'utf8');
  fs.writeFileSync(card, drifted + '\n> **WITHDRAWN 2026-08-16** correct form: least-correlated.\n');
  assert.strictEqual(fire(b).out.trim(), '', 'green is silent');
  fs.writeFileSync(card, drifted);
  assert.match(fire(b).out, /CARRIER DRIFT/, 'the same red after a green is news again');
});

test('the dream gate holds: CONSONANCE_DREAM silences it and leaves no row', () => {
  const b = bed({ marker: false });
  const r = fire(b, { CONSONANCE_DREAM: '1' });
  assert.strictEqual(r.out.trim(), '');
  assert.strictEqual(r.rows.length, 0, 'not even a ledger row — a dream gets no instrumentation');
});

test('with no env and no config, it records UNRESOLVED rather than going quietly missing', () => {
  // there is no hardcoded repo path to fall back on, by design — so the failure has to be
  // written down, or it reads exactly like a clean run
  const b = bed({ marker: false });
  const home = path.join(b.root, 'nohome');
  fs.mkdirSync(home, { recursive: true });
  const r = fire(b, { CARRIER_DRIFT_REPO: '', USERPROFILE: home, HOME: home });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.out.trim(), '');
  assert.strictEqual(r.rows.length, 1, 'the give-up must leave a trace');
  assert.strictEqual(r.rows[0].verdict, 'UNRESOLVED');
});

test('the repo is derived from room_path when no env override is set', () => {
  const b = bed({ marker: false });
  const home = path.join(b.root, 'home');
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({
    room_path: path.join(b.repo, 'exo_memory', 'BOOT.md'),
  }));
  const r = fire(b, { CARRIER_DRIFT_REPO: '', USERPROFILE: home, HOME: home });
  assert.match(r.out, /CARRIER DRIFT/, 'room_path must resolve to the repo two levels up');
  assert.strictEqual(r.rows[0].verdict, 'RED');
});

test('no repo at the configured path is silent and harmless', () => {
  const b = bed({ marker: false });
  const r = fire(b, { CARRIER_DRIFT_REPO: path.join(b.root, 'nowhere') });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.out.trim(), '');
  assert.strictEqual(r.rows.length, 0);
});
