// attached.test.js — the ATTACHMENT test: not "is each piece correct" but "is each piece
// CONNECTED to the next one." Named for host/attached.js in the valheim-agent repo, built
// there after fifteen instances of exactly this class; the lighthouse build reproduced the
// class within seventy-six minutes of being warned (2026-08-15: producer wrote
// vantage_findings.jsonl via VANTAGE_FINDINGS, consumer read findings_ledger.jsonl via
// FINDINGS_LEDGER, both suites green, wire dead — and pair-ledger sat on the orphan name too).
//
// The coupling here is BY FILE PATH, deliberately (a hook that imports from a moving repo
// dies silently — sourced-stop's own header). So this file asserts the PATHS AGREE and that
// BYTES ACTUALLY CROSS: what the producer writes under its constants is what each consumer
// resolves under its own, in the same environment, with no filename spelled out by the test
// where the wire itself should carry it.
//
// Shown failing before shipping (the room's rule 4), by real mutation: consumer constant
// reverted to 'findings_ledger.jsonl' -> 2 red here while both module suites stay green;
// restored byte-identical -> green. The red/green transcript lives in the wire run report.
// Owner: the F0/integration pane (sibling-afa12c33). Run: node --test consonance/tools/attached.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// One tmp DATA root for the in-process producer, bound BEFORE the module loads its constants.
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'attached-'));
process.env.VANTAGE_DATA = TMP;
delete process.env.VANTAGE_FINDINGS;
delete process.env.FINDINGS_LEDGER;
const sv = require('./second-vantage.js');

const HOOK = path.join(__dirname, '..', 'hooks', 'findings-return.js');
const PAIR = path.join(__dirname, 'pair-ledger.js');

function cleanEnv(extra) {
  const e = { ...process.env, ...extra };
  for (const k of ['VANTAGE_FINDINGS', 'VANTAGE_DATA', 'FINDINGS_LEDGER']) {
    if (!extra || !(k in extra)) delete e[k];
  }
  return e;
}
function whereProducer(envx) {
  const r = spawnSync(process.execPath, [path.join(__dirname, 'second-vantage.js'), '--where'],
    { encoding: 'utf8', env: cleanEnv(envx), timeout: 15000 });
  return JSON.parse(r.stdout);
}
function whereConsumer(envx) {
  const r = spawnSync(process.execPath, [HOOK, '--where'],
    { encoding: 'utf8', env: cleanEnv(envx), timeout: 15000 });
  return JSON.parse(r.stdout);
}
function wherePairLedger(envx) {
  const r = spawnSync(process.execPath,
    ['-e', `process.stdout.write(require(${JSON.stringify(PAIR.replace(/\\/g, '/'))}).DEFAULTS.findings)`],
    { encoding: 'utf8', env: cleanEnv(envx), timeout: 15000 });
  return r.stdout;
}

test('WIRE: producer and both consumers resolve the SAME findings path by default', () => {
  const p = whereProducer().FINDINGS;
  assert.strictEqual(whereConsumer().FINDINGS, p,
    'findings-return.js reads a different default path than second-vantage.js writes — the 2026-08-15 split, again');
  assert.strictEqual(wherePairLedger(), p,
    'pair-ledger.js reads a different default path than second-vantage.js writes');
});

test('WIRE: one env var moves all three together (VANTAGE_FINDINGS), and VANTAGE_DATA rebases all defaults', () => {
  const x = path.join(TMP, 'explicit.jsonl');
  assert.strictEqual(whereProducer({ VANTAGE_FINDINGS: x }).FINDINGS, x);
  assert.strictEqual(whereConsumer({ VANTAGE_FINDINGS: x }).FINDINGS, x);
  assert.strictEqual(wherePairLedger({ VANTAGE_FINDINGS: x }), x);
  const d = path.join(TMP, 'rebase');
  const viaData = whereProducer({ VANTAGE_DATA: d }).FINDINGS;
  assert.strictEqual(path.dirname(viaData), d);
  assert.strictEqual(whereConsumer({ VANTAGE_DATA: d }).FINDINGS, viaData);
  assert.strictEqual(wherePairLedger({ VANTAGE_DATA: d }), viaData);
});

// ---- the B→A joint: schema v2 rows must become launchable internal rows ----
function v2row(over) {
  return {
    v: 2, ts: '2026-08-15T18:00:00.000Z', session: 'e2e00001', pane: 'sibling-test',
    turn_ts: '2026-08-15T17:59:58.000Z', values: ['linecount'], sourced: true, tools: 3,
    claims: [{ kinds: ['linecount'], channel: 'artifact',
               sentence: 'consonance/ui/term.js is 500 lines', path: 'C:\\notes\\note.md' }],
    paths: ['C:\\notes\\note.md'],
    heads: { 'c:/repo': 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef' },
    ...over,
  };
}

test('B→A: fromV2 maps claims/paths/heads to sentences/wrote/read/head', () => {
  const r = sv.fromV2(v2row());
  assert.deepStrictEqual(r.sentences, ['consonance/ui/term.js is 500 lines']);
  assert.deepStrictEqual(r.wrote, ['C:\\notes\\note.md']);
  assert.deepStrictEqual(r.read, ['C:\\notes\\note.md']);
  assert.strictEqual(r.head, 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    'a single touched repo is unambiguous even when it is not this one');
  assert.strictEqual(sv.tierOf(r), 'artifact', 'an artifact-channel claim must reach the 100% tier');
});

test('B→A: a v1 row (no claims[]) passes through unmapped and fails the C2 gate LOUDLY', () => {
  const v1 = { ts: 'x', session: 's', pane: 'p', turn_ts: 't', values: ['count'], sourced: false, tools: 0 };
  assert.strictEqual(sv.fromV2(v1), v1);
  let spawned = 0;
  const f = sv.processRow(v1, 'middle', sv.REPO, () => { spawned++; return { failed: false, raw: '' }; });
  assert.strictEqual(f.status, 'UNLAUNCHABLE');
  assert.strictEqual(spawned, 0);
  assert.ok(f.evidence.includes('sentences'), 'the missing fields are NAMED, not absorbed');
});

test('KNOWN GAP pinned: schema v2 carries no excerpt, so a claimless floor row is UNLAUNCHABLE (visible), not silent', () => {
  // This asserts the CURRENT loud behavior so the gap cannot be rediscovered as a surprise.
  // When B ships v3 with excerpt, this test goes red and gets updated — that is the point.
  const r = sv.fromV2(v2row({ values: [], claims: [] }));
  const f = sv.processRow(r, 'floor', sv.REPO, () => ({ failed: false, raw: '' }));
  assert.strictEqual(f.status, 'UNLAUNCHABLE');
  assert.ok(f.evidence.includes('excerpt'));
});

// ---- the full wire: a producer-built object crosses to the consumer over DEFAULT names ----
test('A→K: a SURFACE finding written under the producer\'s constants is rendered by the consumer hook', () => {
  const git = spawnSync('git', ['-C', sv.REPO, 'rev-parse', '--show-toplevel', 'HEAD'],
    { encoding: 'utf8', timeout: 5000 });
  assert.strictEqual(git.status, 0, 'test requires the repo to be a git checkout');
  const [top, sha] = git.stdout.split(/\r?\n/);

  const row = sv.fromV2(v2row({ heads: { [top.trim()]: sha.trim() } }));
  const stub = () => ({
    failed: false,
    raw: 'VERDICT: DISAGREE\nCOMMANDS:\nwc -l consonance/ui/term.js -> 1019\nEVIDENCE: the file measures 1019 lines, not 500',
  });
  const finding = sv.processRow(row, 'artifact', sv.REPO, stub);
  assert.strictEqual(finding.status, 'SURFACE', `expected SURFACE, got ${finding.status}: ${finding.evidence} ${finding.audit.reason}`);

  // append under the PRODUCER's resolved constant — no filename spelled here
  fs.mkdirSync(path.dirname(sv.FINDINGS), { recursive: true });
  fs.appendFileSync(sv.FINDINGS, JSON.stringify(finding) + '\n');

  // the consumer resolves its own constant from the same env — equality asserted, then used
  const hookEnv = {
    ...process.env,                                  // carries VANTAGE_DATA=TMP, no VANTAGE_FINDINGS
    RETURN_LEDGER: path.join(TMP, 'returns.jsonl'),
    RETURN_STATE_DIR: path.join(TMP, 'state'),
  };
  const where = spawnSync(process.execPath, [HOOK, '--where'], { encoding: 'utf8', env: hookEnv, timeout: 15000 });
  assert.strictEqual(JSON.parse(where.stdout).FINDINGS, sv.FINDINGS,
    'consumer resolves a different path than the producer wrote under the same environment');

  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ session_id: 'e2e00001-x', cwd: 'C:\\panes\\sibling-test' }),
    encoding: 'utf8', env: hookEnv, timeout: 15000,
  });
  assert.strictEqual(r.status, 0);
  assert.ok(r.stdout, 'the consumer printed nothing: the wire is detached');
  const ctx = JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
  assert.ok(ctx.includes('consonance/ui/term.js is 500 lines'), 'claim did not cross the wire');
  assert.ok(ctx.includes('reader ran:'), 'A-schema row was not rendered (normalize detached?)');
  assert.ok(ctx.includes('1019 lines'), 'the derived value did not cross the wire');
  assert.ok(!ctx.includes('undefined'), 'a field A never emits leaked into the rendering (first e2e run defect)');
});
