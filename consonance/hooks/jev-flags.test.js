// jev-flags.test.js — node --test consonance/hooks/jev-flags.test.js
//
// D108. The hook surfaces Jev's NOT-CLEAN L2 verdicts to the chair and the librarian only. Pure rows in, lines out, plus
// the CLI spawned with a HERMETIC env (built from nothing, never process.env: this pane's own CONSONANCE_PANE would
// otherwise decide what the test sees — the L071 cliEnv lesson). No network, no real store.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const F = require('./jev-flags.js');

const HOOK = path.join(__dirname, 'jev-flags.js');
const IDS = F.seatIds(path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs'));
const MAIN = IDS.main, LIB = IDS.librarian, TP = IDS.thirdPlace;
const PANE = '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f';
const NOW = Date.parse('2026-09-22T17:00:00.000Z');
const ago = (min) => new Date(NOW - min * 60000).toISOString();

let n = 0;
/** One jev_judge.jsonl row. `choice` is the L2 verdict; `p` its probability map. */
function row({ sid = PANE, seat = 'A', level = 'l2', choice = 'drift', p = null, min = 10, status = 'ok' } = {}) {
  const probs = p || { drift: 0.2, clean: 0.2, abstain: 0.2, [choice]: 0.6 };
  return { ts: ago(min - 1), judge: 'jev', unverified: true, level, session_id: sid, seat, turn_uuid: `t${++n}`, turn_ts: ago(min), status,
    jev: level === 'l2' ? { verdict: { type: 'choice', choice, probabilities: probs } } : { trajectory: { type: 'choice', choice: 'quiet_spiral', probabilities: { quiet_spiral: 0.9 } } } };
}
const lines = (rows, pane) => F.flagLines({ rows, pane, ids: IDS, now: NOW });

test('the seat ids are read from THIS checkout\'s main.rs, not copied', () => {
  assert.match(MAIN, /^0c0c0c0a-/); assert.match(LIB, /^0c0c0c0b-/); assert.match(TP, /^3d000000-/);
});

test('the CHAIR sees a flagged (drift) L2 row about another seat — one line, seat, turn time, verdict, probability, unverified', () => {
  const out = lines([row({ seat: 'A', choice: 'drift', p: { drift: 0.56, clean: 0.4, abstain: 0.04 } })], MAIN);
  assert.strictEqual(out.length, 1, JSON.stringify(out));
  assert.match(out[0], /unverified/); assert.match(out[0], /\bA\b/); assert.match(out[0], /drift p=0\.56/);
  assert.match(out[0], /turn \d{2}:\d{2}/);
});

test('the LIBRARIAN sees it too', () => {
  assert.strictEqual(lines([row()], LIB).length, 1);
});

test('a PANE never sees a flag — not even one about another seat', () => {
  assert.deepStrictEqual(lines([row({ sid: MAIN, seat: 'main' }), row()], PANE), []);
});

test('no pane id at all (a terminal session Consonance did not spawn) sees nothing', () => {
  assert.deepStrictEqual(lines([row()], undefined), []);
});

test('a CLEAN row never surfaces', () => {
  assert.deepStrictEqual(lines([row({ choice: 'clean', p: { clean: 0.94, drift: 0.04, abstain: 0.02 } })], MAIN), []);
});

test('nothing L3 ever surfaces — not even a row that looks alarming', () => {
  assert.deepStrictEqual(lines([row({ level: 'l3' })], MAIN), []);
  assert.deepStrictEqual(lines([row({ level: 'l3', sid: TP, seat: 'third place' })], LIB), []);
  // Found as a surviving mutant: the rows above carry a `trajectory` answer, so a missing level filter still skipped
  // them for having no verdict. An L3 row shaped like an L2 one must be refused by its LEVEL.
  const l3LikeL2 = { ...row(), level: 'l3' };
  assert.deepStrictEqual(lines([l3LikeL2], MAIN), [], 'the level decides, not the answer\'s shape');
});

test('never the JUDGED seat: the chair does not see its own flag, the librarian does', () => {
  const r = row({ sid: MAIN, seat: 'main' });
  assert.deepStrictEqual(lines([r], MAIN), []);
  assert.strictEqual(lines([r], LIB).length, 1);
});

test('the Third Place is never surfaced into the work — it has no channel to the work', () => {
  assert.deepStrictEqual(lines([row({ sid: TP, seat: 'third place' })], MAIN), []);
});

test(`abstain surfaces only at p >= ${F.ABSTAIN_MIN} and only when chosen`, () => {
  const lo = row({ choice: 'abstain', p: { abstain: F.ABSTAIN_MIN - 0.01, clean: 0.3, drift: 0.02 } });
  const hi = row({ choice: 'abstain', p: { abstain: F.ABSTAIN_MIN, clean: 0.3, drift: 0.1 } });
  const notChosen = row({ choice: 'clean', p: { clean: 0.35, abstain: 0.34, drift: 0.31 } });
  assert.deepStrictEqual(lines([lo], MAIN), [], 'below the bar');
  assert.strictEqual(lines([hi], MAIN).length, 1, 'at the bar');
  assert.deepStrictEqual(lines([notChosen], MAIN), [], 'an abstain probability on a clean answer is not a flag');
  // Found as a surviving mutant: with normalised probabilities a clean choice caps abstain at 0.5, below the bar, so the
  // case above could not tell "chosen" from "probable". The CHOICE decides even when the numbers do not add up.
  const odd = row({ choice: 'clean', p: { clean: 0.9, abstain: 0.85, drift: 0.01 } });
  assert.deepStrictEqual(lines([odd], MAIN), [], 'a clean verdict never surfaces, whatever its abstain number says');
});

test('MEASURED: the highest abstain on D (p=0.73) was a keep-warm "ok" — a RIGHT abstain — and it does not surface', () => {
  assert.deepStrictEqual(lines([row({ choice: 'abstain', p: { abstain: 0.73, clean: 0.2, drift: 0.07 } })], MAIN), []);
});

test(`old rows age out: older than ${F.WINDOW_HOURS} h by turn time → gone`, () => {
  assert.deepStrictEqual(lines([row({ min: F.WINDOW_HOURS * 60 + 1 })], MAIN), []);
  assert.strictEqual(lines([row({ min: F.WINDOW_HOURS * 60 - 1 })], MAIN).length, 1);
});

test(`at most ${F.MAX_LINES} lines, newest first; the overflow is COUNTED on the last line, not dropped silently`, () => {
  const rows = Array.from({ length: 8 }, (_, i) => row({ seat: `S${i}`, min: 10 + i }));
  const out = lines(rows, MAIN);
  assert.strictEqual(out.length, F.MAX_LINES);
  assert.match(out[0], /\bS0\b/, 'newest first');
  assert.match(out[out.length - 1], /\+3 more/, '8 hits, 5 lines shown, 3 not shown: ' + out[out.length - 1]);
});

test('a refused or failed row is not a verdict and never surfaces', () => {
  assert.deepStrictEqual(lines([row({ status: 'refused' })], MAIN), []);
});

test('the line never carries the prompt, the answer text, or the word "keeper"', () => {
  const out = lines([row({ seat: 'librarian', sid: LIB })], MAIN).join('\n');
  assert.ok(!/keeper|user/i.test(out), out);
});

// ── the CLI, spawned with a hermetic env ─────────────────────────────────────────────────────────────────────────────
function store(rows) {
  const lad = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-flags-'));
  const d = path.join(lad, 'consonance', 'jev-shadow'); fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'jev_judge.jsonl'), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  return lad;
}
function cli(env) {
  const base = { SystemRoot: process.env.SystemRoot || '', PATH: process.env.PATH || '', JEV_FLAGS_NOW: new Date(NOW).toISOString() };
  const r = spawnSync(process.execPath, [HOOK], { input: '{}', encoding: 'utf8', env: { ...base, ...env }, timeout: 20000 });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

test('CLI: in the chair, one hookSpecificOutput with the flag line, exit 0', () => {
  const r = cli({ LOCALAPPDATA: store([row()]), CONSONANCE_PANE: MAIN });
  assert.strictEqual(r.code, 0, r.err);
  const j = JSON.parse(r.out);
  assert.strictEqual(j.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(j.hookSpecificOutput.additionalContext, /drift p=0\.60/);
});

test('CLI: in a pane, SILENT and exit 0', () => {
  const r = cli({ LOCALAPPDATA: store([row()]), CONSONANCE_PANE: PANE });
  assert.strictEqual(r.code, 0); assert.strictEqual(r.out, '');
});

test('CLI: in a dream (CONSONANCE_DREAM set), silent even in the chair', () => {
  const r = cli({ LOCALAPPDATA: store([row()]), CONSONANCE_PANE: MAIN, CONSONANCE_DREAM: '1' });
  assert.strictEqual(r.code, 0); assert.strictEqual(r.out, '');
});

test('CLI: no store, no LOCALAPPDATA, a corrupt ledger line — all silent, exit 0 (a hook must never break a prompt)', () => {
  assert.strictEqual(cli({ CONSONANCE_PANE: MAIN }).out, '');
  const lad = store([row()]);
  fs.appendFileSync(path.join(lad, 'consonance', 'jev-shadow', 'jev_judge.jsonl'), '{not json\n');
  const r = cli({ LOCALAPPDATA: lad, CONSONANCE_PANE: LIB });
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /drift/, 'the good row still surfaces past the corrupt one');
});
