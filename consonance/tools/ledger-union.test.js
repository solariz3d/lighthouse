// ledger-union.test.js — node --test consonance/tools/ledger-union.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { canon, parseJsonl, union } = require('./ledger-union.js');

const TOOL = path.join(__dirname, 'ledger-union.js');
const J = (...rows) => rows.map((r) => JSON.stringify(r)).join('\n') + '\n';

test('the key is the WHOLE row: field order does not decide identity', () => {
  assert.strictEqual(canon({ lap: 'L1', at: 5, stage: 'open' }), canon({ stage: 'open', at: 5, lap: 'L1' }));
});

test('NO RENAMING: two generations of one lap id with the same stage and time stay TWO rows', () => {
  // the narrow key (lap, stage, at) would collapse these; the whole row must not
  const a = { lap: 'L058', stage: 'open', at: 100, inquiry: 'the 09-14 lap' };
  const b = { lap: 'L058', stage: 'open', at: 100, inquiry: 'the 09-20 lap' };
  const u = union([{ tag: 'LIVE', live: true, text: J(a) }, { tag: 'attic', text: J(b) }], 'at');
  assert.strictEqual(u.rows.length, 2, 'two different laps sharing an id were collapsed into one');
  assert.strictEqual(u.narrowDistinct, 1, 'fixture: the narrow key must see them as one, or this proves nothing');
});

test('a row only an attic copy holds is a row TO ADD; a row both hold is kept once and is not added', () => {
  const shared = { lap: 'L1', stage: 'open', at: 1 };
  const lost = { lap: 'L2', stage: 'open', at: 2 };
  const u = union([{ tag: 'LIVE', live: true, text: J(shared) }, { tag: 'attic', text: J(shared, lost) }], 'at');
  assert.deepStrictEqual(u.added.map((r) => r.obj.lap), ['L2']);
  assert.strictEqual(u.rows.length, 2);
  assert.strictEqual(u.crossSourceDup, 1, 'the shared row must be counted as held by two sources');
});

test('the positive control: identical sources add nothing — the count can be zero', () => {
  const t = J({ lap: 'L1', stage: 'open', at: 1 }, { lap: 'L1', stage: 'map', at: 2 });
  const u = union([{ tag: 'LIVE', live: true, text: t }, { tag: 'attic', text: t }], 'at');
  assert.strictEqual(u.added.length, 0);
});

test('an unparseable line is reported by line number and is never counted as a row', () => {
  const p = parseJsonl('{"lap":"L1","at":1}\n{"lap":"L2",\n{"lap":"L3","at":3}\n');
  assert.strictEqual(p.rows.length, 2);
  assert.deepStrictEqual(p.invalid.map((x) => x.line), [2]);
});

test('an unparseable line the LIVE file also holds is not news; one ONLY an attic copy holds is counted', () => {
  // The only invalid lines that matter to a union are those whose rows the live file cannot already have.
  const fused = '{"a":1}{"b":2}';
  const u = union([
    { tag: 'LIVE', live: true, text: `${fused}\n{"at":1}\n` },
    { tag: 'attic', text: `${fused}\n{"at":1}\n{"c":3}{"d":4}\n` },
  ], 'at');
  const attic = u.perSource.find((s) => s.tag === 'attic');
  assert.strictEqual(attic.invalid.length, 2, 'fixture: the attic copy has two unparseable lines');
  assert.strictEqual(attic.invalidNotInLive, 1, 'only the line the live file lacks is a line whose rows are missing');
  assert.strictEqual(u.invalidNotInLive, 1);
});

test('the proposed union is ordered by time, and rows with no time go LAST', () => {
  const u = union([{ tag: 'LIVE', live: true, text: J({ n: 'late', at: 30 }, { n: 'none' }, { n: 'early', at: 10 }) }], 'at');
  assert.deepStrictEqual(u.rows.map((r) => r.obj.n), ['early', 'late', 'none']);
  assert.strictEqual(u.noTime, 1);
});

test('the CLI has no --write: the write is a separate step', () => {
  const r = spawnSync(process.execPath, [TOOL, '--data', os.tmpdir(), '--write'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /there is no --write/);
});

test('the CLI refuses an --out inside the data dir, and writes nothing there', () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-data-'));
  fs.writeFileSync(path.join(data, 'lap.jsonl'), J({ lap: 'L1', at: 1 }));
  const before = fs.readdirSync(data).sort();
  const r = spawnSync(process.execPath, [TOOL, '--data', data, '--out', path.join(data, 'x'), '--file', 'lap'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /refusing --out inside the data dir/);
  assert.deepStrictEqual(fs.readdirSync(data).sort(), before, 'something was written into the data dir');
});

test('a dry run end to end leaves the live file and every attic copy byte-identical', () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-e2e-'));
  const live = path.join(data, 'lap.jsonl');
  const atticDir = path.join(data, 'attic', 'pre-sync-2026-01-01T00-00-00-000Z');
  fs.mkdirSync(atticDir, { recursive: true });
  const atticFile = path.join(atticDir, 'lap.jsonl');
  fs.writeFileSync(live, J({ lap: 'L1', at: 1 }));
  fs.writeFileSync(atticFile, J({ lap: 'L1', at: 1 }, { lap: 'L2', at: 2 }));
  const b1 = fs.readFileSync(live), b2 = fs.readFileSync(atticFile);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-out-'));
  const r = spawnSync(process.execPath, [TOOL, '--data', data, '--out', out, '--file', 'lap'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /ROWS TO ADD to live\s+1/);
  assert.ok(fs.readFileSync(live).equals(b1), 'the live file changed during a dry run');
  assert.ok(fs.readFileSync(atticFile).equals(b2), 'an attic copy changed during a dry run');
});
