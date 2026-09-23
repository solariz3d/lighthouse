'use strict';
// jev/test/jev-report.test.js — D123 (pane C): the ledger summary. Every test builds its own ledger dir under the OS temp
// dir. The report must never print turn text — and the ledger's `reason` field (Jev's words, which can quote the turn)
// counts as turn text here: a planted marker in reasons, corrupt lines and label rows must never reach the output.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const R = require('../bin/jev-report.js');
const BIN = path.join(__dirname, '..', 'bin', 'jev-report.js');

const dirs = [];
function tmp() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-report-')); dirs.push(d); return d; }
process.on('exit', () => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} } });
const SECRET = 'PLANTED-TURN-TEXT-must-never-print';
const jl = (rows) => rows.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + '\n';
// the batch-1 row shape (turn_uuid) and batch 2's (prompt_id + confidence)
const oldRow = (turn, verdict, extra = {}) => ({ ts: '2026-09-23T10:00:00Z', session_id: 's1', turn_uuid: turn, verdict, probabilities: { clean: 0.6, drift: 0.3, abstain: 0.1 }, reason: `${SECRET} ${turn}`, model: 'typesafe-ai/jev', prompt_sha256: 'ab'.repeat(32), usage: { inputTokens: 2000, outputTokens: 42 }, ...extra });
const newRow = (pid, verdict, extra = {}) => ({ ts: '2026-09-23T11:00:00Z', session_id: 's2', prompt_id: pid, verdict, confidence: 0.41, probabilities: { clean: 0.4, drift: 0.5, abstain: 0.1 }, reason: `${SECRET} ${pid}`, model: 'typesafe-ai/jev', prompt_sha256: 'cd'.repeat(32), usage: { inputTokens: 2100, outputTokens: 43 }, ...extra });
function ledger({ rows, log, labels } = {}) {
  const d = tmp();
  if (rows) fs.writeFileSync(path.join(d, 'jev.jsonl'), jl(rows));
  if (log) fs.writeFileSync(path.join(d, 'jev.log'), jl(log));
  if (labels) fs.writeFileSync(path.join(d, 'labels.jsonl'), jl(labels));
  return d;
}

test('an EMPTY ledger dir (no files at all) reports zeros and says so, without crashing', () => {
  const s = R.summarize({ ledgerDir: tmp() });
  assert.strictEqual(s.judged, 0);
  assert.strictEqual(s.marked, 0);
  assert.strictEqual(s.ledgerFound, false);
  assert.strictEqual(s.logFound, false);
  assert.strictEqual(s.confirmation.status, 'unconfirmed');
  assert.match(R.render(s), /no ledger yet/);
});

test('turns judged are counted by verdict, and "marked" means Jev chose drift', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'clean'), oldRow('t2', 'drift'), oldRow('t3', 'abstain'), oldRow('t4', 'drift')] }) });
  assert.strictEqual(s.judged, 4);
  assert.deepStrictEqual(s.byVerdict, { clean: 1, drift: 2, abstain: 1, other: 0 });
  assert.strictEqual(s.marked, 2);
});

test('BOTH row shapes are read: batch 1 (turn_uuid) and batch 2 (prompt_id + confidence)', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'clean'), newRow('p1', 'drift'), newRow('p2', 'clean')] }) });
  assert.strictEqual(s.judged, 3);
  assert.strictEqual(s.marked, 1);
  assert.deepStrictEqual(s.shapes, { turn_uuid: 1, prompt_id: 2 });
});

test('a turn judged twice counts once, and the repeat is reported rather than hidden', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'drift'), oldRow('t1', 'drift'), newRow('p1', 'clean')] }) });
  assert.strictEqual(s.judged, 2);
  assert.strictEqual(s.duplicates, 1);
});

test('a CORRUPT ledger line is skipped and counted, never a crash — and its bytes never reach the output', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'clean'), `{"verdict":"drift", ${SECRET} not json`, '[1,2,3]', '{"session_id":"s1","turn_uuid":"t9"}', '{"verdict":"drift","reason":"no key at all"}', newRow('p1', 'drift')] }) });
  assert.strictEqual(s.judged, 2, 'only the two whole rows count');
  assert.strictEqual(s.corruptLedgerLines, 4, 'not JSON · not an object · no verdict · no session/turn key');
  const out = R.render(s);
  assert.ok(!out.includes(SECRET), 'nothing from a corrupt line is printed');
  assert.match(out, /4 corrupt ledger line\(s\) skipped/);
});

test('refused and failed calls are counted from jev.log by outcome; a corrupt log line is counted too', () => {
  const log = [
    { ts: 'x', outcome: 'refused', session_id: 's1', turn_uuid: 't5', why: 'no key' },
    { ts: 'x', outcome: 'refused', session_id: 's1', turn_uuid: 't6', why: `cannot read ${SECRET}` },
    { ts: 'x', outcome: 'gateway-failed', session_id: 's1', turn_uuid: 't7', why: 'HTTP 503' },
    { ts: 'x', outcome: 'no-turn-end', session_id: 's1', turn_uuid: null, why: '...' },
    'this line is not json',
  ];
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'clean')], log }) });
  assert.strictEqual(s.logFound, true);
  assert.deepStrictEqual(s.failures, { refused: 2, 'gateway-failed': 1, 'no-turn-end': 1 });
  assert.strictEqual(s.corruptLogLines, 1);
  assert.ok(!R.render(s).includes(SECRET), 'a log reason is never printed');
});

test('a MISSING jev.log is reported as absent, not as zero failures silently', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'clean')] }) });
  assert.strictEqual(s.logFound, false);
  assert.match(R.render(s), /no jev\.log/);
});

test('WITHOUT a labels file the report says "unconfirmed" and prints NO precision', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'drift'), oldRow('t2', 'clean')] }) });
  assert.strictEqual(s.confirmation.status, 'unconfirmed');
  const out = R.render(s);
  assert.match(out, /unconfirmed/);
  assert.ok(!/%|precision|\bconfirmed \d/.test(out), `no precision without labels:\n${out}`);
});

test('WITH a labels file, "confirmed" counts marked turns a label calls drift, over the marked turns that HAVE a label', () => {
  const rows = [oldRow('t1', 'drift'), oldRow('t2', 'drift'), newRow('p1', 'drift'), newRow('p2', 'clean')];
  const labels = [
    { session_id: 's1', turn_uuid: 't1', label: 'drift' },
    { session_id: 's1', turn_uuid: 't2', label: 'clean', note: SECRET },
    { session_id: 's2', prompt_id: 'p2', label: 'drift' },            // labels a CLEAN turn: not a marked one
    { session_id: 's9', turn_uuid: 'zz', label: 'drift' },            // labels nothing in the ledger
    'not json either',
  ];
  const s = R.summarize({ ledgerDir: ledger({ rows, labels }) });
  assert.deepStrictEqual(s.confirmation, { status: 'labelled', labelsFile: path.join(s.ledgerDir, 'labels.jsonl'), confirmed: 1, labelledMarked: 2, unlabelledMarked: 1, unmatchedLabels: 1, corruptLabelLines: 1 });
  const out = R.render(s);
  assert.match(out, /confirmed: 1 of 2 labelled marked turns/);
  assert.match(out, /1 marked turn\(s\) have no label/);
  assert.ok(!out.includes(SECRET));
});

test('an explicit labels path overrides the default', () => {
  const d = ledger({ rows: [oldRow('t1', 'drift')] });
  const lf = path.join(tmp(), 'mine.jsonl');
  fs.writeFileSync(lf, jl([{ session_id: 's1', turn_uuid: 't1', label: 'drift' }]));
  const s = R.summarize({ ledgerDir: d, labelsPath: lf });
  assert.strictEqual(s.confirmation.confirmed, 1);
  assert.strictEqual(s.confirmation.labelsFile, lf);
});

test('NO TURN TEXT, EVER: across every section the planted reason text never appears, even with --json', () => {
  const s = R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'drift'), newRow('p1', 'drift')], log: [{ outcome: 'refused', why: SECRET }], labels: [{ session_id: 's1', turn_uuid: 't1', label: 'drift', note: SECRET }] }) });
  assert.ok(!R.render(s).includes(SECRET));
  assert.ok(!JSON.stringify(R.toJSON(s)).includes(SECRET));
});

test('the CLI takes ledgerDir from config.load: ~/.jev/config.json under the HOME it is given', () => {
  const home = tmp();
  const d = ledger({ rows: [oldRow('t1', 'drift'), oldRow('t2', 'clean')] });
  fs.mkdirSync(path.join(home, '.jev'), { recursive: true });
  fs.writeFileSync(path.join(home, '.jev', 'config.json'), JSON.stringify({ ledgerDir: d }));
  const r = spawnSync(process.execPath, [BIN, '--json'], { cwd: tmp(), encoding: 'utf8', env: { ...process.env, HOME: home, USERPROFILE: home } });
  assert.strictEqual(r.status, 0, r.stderr);
  const j = JSON.parse(r.stdout);
  assert.strictEqual(j.ledgerDir, d);
  assert.strictEqual(j.judged, 2);
  assert.strictEqual(j.marked, 1);
});

test('a malformed config makes the CLI fail LOUDLY, naming the file, with a non-zero exit', () => {
  const home = tmp();
  fs.mkdirSync(path.join(home, '.jev'), { recursive: true });
  fs.writeFileSync(path.join(home, '.jev', 'config.json'), '{ broken');
  const r = spawnSync(process.execPath, [BIN], { cwd: tmp(), encoding: 'utf8', env: { ...process.env, HOME: home, USERPROFILE: home } });
  assert.notStrictEqual(r.status, 0);
  assert.match(r.stderr, /config\.json/);
});

test('the rendered report states what a mark is and is not: worth a second look, never "caught"', () => {
  const out = R.render(R.summarize({ ledgerDir: ledger({ rows: [oldRow('t1', 'drift')] }) }));
  assert.match(out, /worth a second look/);
  assert.ok(!/caught/i.test(out));
});
