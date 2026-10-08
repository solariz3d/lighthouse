/* Tests for board-audit.js's pure core. Fixtures only — the real board.jsonl is 50MB and
 * this suite must stay cheap enough that js-suite runs it every time. */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const { parseBoard, markRepeats, markBackward, shareSnapshots } = require('./board-audit.js');

const row = (i, pane, role, text, ts) => ({ pane, role, text, ts, _i: i });

test('a replayed turn — identical triple at 0ms gap — is flagged; the original is not', () => {
  const rows = [
    row(0, 'A', 'user', 'yes', 1000),
    row(1, 'A', 'user', 'yes', 1000), // the replay: original transcript ts, so 0ms gap
  ];
  const rep = markRepeats(rows, 30_000);
  assert.deepStrictEqual(rep, [false, true]);
});

test('a genuine later repeat — same words, its own ts outside the window — survives', () => {
  // The keeper saying "yes" twice is two turns with two transcript timestamps. This is the
  // case that made persisting the dedup table cost nothing; it must never be flagged.
  const rows = [
    row(0, 'A', 'user', 'yes', 1000),
    row(1, 'A', 'user', 'yes', 1000 + 31_000),
  ];
  assert.deepStrictEqual(markRepeats(rows, 30_000), [false, false]);
});

test('a replay of a replay chains on the LATEST copy, so every landing counts', () => {
  const rows = [
    row(0, 'A', 'user', 'yes', 1000),
    row(1, 'A', 'user', 'yes', 1000),
    row(2, 'A', 'user', 'yes', 1000),
  ];
  assert.deepStrictEqual(markRepeats(rows, 30_000), [false, true, true]);
});

test('backward means strictly behind the running maximum; equal is not backward', () => {
  const rows = [row(0, 'A', 'u', 'a', 100), row(1, 'A', 'u', 'b', 300),
                row(2, 'A', 'u', 'c', 200), row(3, 'A', 'u', 'd', 300)];
  assert.deepStrictEqual(markBackward(rows), [false, false, true, false]);
});

test('raw counts the replays and clean does not — the trend inversion in miniature', () => {
  // Main pushes 2 real turns then a 2-row replay of itself; pane B pushes 2 real turns.
  // Raw share rises with the replay; clean share is what the room actually did.
  const rows = [
    row(0, 'M', 'u', 'm1', 100), row(1, 'B', 'u', 'b1', 200),
    row(2, 'M', 'u', 'm2', 300), row(3, 'B', 'u', 'b2', 400),
    row(4, 'M', 'u', 'm1', 100), row(5, 'M', 'u', 'm2', 300), // the replay burst
  ];
  const rep = markRepeats(rows, 30_000);
  const snaps = shareSnapshots(rows, rep, 'M', [4, 6]);
  assert.strictEqual(snaps.length, 2);
  assert.strictEqual(snaps[0].raw, 0.5, 'before the replay: 2 of 4');
  assert.strictEqual(snaps[0].clean, 0.5);
  assert.strictEqual(snaps[1].raw, 4 / 6, 'the replay inflates raw');
  assert.strictEqual(snaps[1].clean, 0.5, 'clean is unmoved by the replay');
  assert.strictEqual(snaps[1].cleanCorpus, 4);
});

test('a torn tail line parses to nothing rather than killing the audit', () => {
  const rows = parseBoard(['{"pane":"A","role":"u","text":"x","ts":1}', '{"pane":"A","ro']);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0]._i, 0);
});

/* D273 lap 2 (pane B, 2026-10-08): the lap-1 cold sweep ran this tool inside the consumer tree with CONSONANCE_DATA pointed at an EMPTY directory, and it
 * parsed 146,512 rows of the keeper's own board from a hardcoded path (handback/p-consumer-parity-B_2026-10-08.md §4: FALSE-COLD). The board is now found
 * the way the app finds its data dir: CONSONANCE_BOARD, else <CONSONANCE_DATA>/board.jsonl, else <data_dir in ~/.consonance.json>/board.jsonl, else
 * <home>/.consonance/board.jsonl (main.rs default_data). A missing board is said in words, with a non-zero exit, never a stack. */
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawnSync } = require('node:child_process');
const AUDIT = path.join(__dirname, 'board-audit.js');
function audit(env) {
  const base = { ...process.env }; for (const k of ['CONSONANCE_DATA', 'CONSONANCE_BOARD']) delete base[k];
  const r = spawnSync(process.execPath, [AUDIT], { encoding: 'utf8', env: { ...base, ...env } });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
const boardRow = (i) => JSON.stringify({ pane: '0c0c0c0a-0000-4000-8000-000000000a01', role: 'assistant', text: 't' + i, ts: 1000 + i * 60000 });
test('D273: an EMPTY CONSONANCE_DATA is read as empty: no board there is said in words, exit 1, and no other board is read', () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-empty-'));
  try {
    const r = audit({ CONSONANCE_DATA: data });
    assert.strictEqual(r.code, 1, r.out + r.err);
    assert.ok(r.err.includes('no board at ' + path.join(data, 'board.jsonl')), r.err);
    assert.doesNotMatch(r.err, /^\s+at /m, 'a stack trace instead of a sentence');
    assert.strictEqual(r.out, '', 'it printed a figure from somewhere: ' + r.out);
  } finally { fs.rmSync(data, { recursive: true, force: true }); }
});
test('D273: the board is found under CONSONANCE_DATA, then ~/.consonance.json data_dir, then ~/.consonance, and the line names the file it read', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-find-'));
  try {
    const put = (dir) => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, 'board.jsonl'), [0, 1, 2].map(boardRow).join('\n') + '\n'); return path.join(dir, 'board.jsonl'); };
    const viaEnv = put(path.join(tmp, 'env'));
    assert.ok(audit({ CONSONANCE_DATA: path.join(tmp, 'env') }).out.includes('board: 3 rows parsed of 3 lines  (' + viaEnv + ')'));
    const home = path.join(tmp, 'home'); fs.mkdirSync(home);
    const viaCfg = put(path.join(tmp, 'cfg'));
    fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ data_dir: path.join(tmp, 'cfg') }));
    assert.ok(audit({ USERPROFILE: home, HOME: home }).out.includes('(' + viaCfg + ')'), 'data_dir in ~/.consonance.json was not used');
    fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ data_dir: '' }));
    const viaDefault = put(path.join(home, '.consonance'));
    assert.ok(audit({ USERPROFILE: home, HOME: home }).out.includes('(' + viaDefault + ')'), 'the app default ~/.consonance was not used');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
