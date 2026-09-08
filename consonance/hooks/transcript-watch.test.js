// transcript-watch.test.js - run with: node transcript-watch.test.js
//
// END-TO-END, not by requiring the module. The hook's entry point is `withStdin(main)` at the
// bottom of the file — requiring it would execute it, and adding a require.main guard would break
// the ENTRY marker dream-gate.test.js checks. So each case builds a synthetic capture, runs the
// hook as a subprocess with CONSONANCE_DATA pointed at a temp tree, and reads the ledger it wrote.
//
// WHAT IS ACTUALLY AT RISK HERE. Until 2026-08-17 the ask ledger recorded a byte offset and
// nothing else, so every model of when the survey fires was built on one axis. A byte-volume
// prediction was refuted on 08-16; then an ask landed right after a 4m 10s turn, which is a
// different axis entirely and was untestable because no row said anything about the turn before
// it. These tests pin the new fields — and pin the repaint dedup, because "Baked for" appears
// 1507 times in the live capture and a naive count would report ~1500 turns per session.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const HOOK = path.join(__dirname, 'transcript-watch.js');
const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';
const ASK = 'Can Anthropic look at your session transcript';

// A capture built from parts, so each test states exactly what the terminal stream contained.
function capture(parts) {
  return parts.map((p) => {
    if (p.turn) return `\n* Baked for ${p.turn}\n` + 'x'.repeat(p.pad || 8192);
    if (p.ask) return `\n${ASK} to help us improve Claude Code?\n` + 'x'.repeat(p.pad || 8192);
    return 'x'.repeat(p.pad || 8192);
  }).join('');
}

// CONSONANCE_WATCH_STATE IS NOT OPTIONAL HERE, and the first version of this file omitted it.
// The state file does NOT live under CONSONANCE_DATA — it is seamed separately, and the hook's own
// header says so in as many words. Without it these runs wrote to the LIVE state, resetting the
// real offset from 150,160,915 to 16,479 and making the instrument re-scan or miss asks. A test
// with a side effect on the instrument under test, which is the exact failure dream-gate.test.js
// documents designing out. Repaired by re-scanning the real capture; kept here as the reason.
function run(captureText, { reuse } = {}) {
  const dd = reuse || fs.mkdtempSync(path.join(os.tmpdir(), 'twatch-'));
  fs.mkdirSync(path.join(dd, 'captures'), { recursive: true });
  fs.writeFileSync(path.join(dd, 'captures', `${MAIN_SID}.log`), captureText);
  execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ session_id: MAIN_SID }),
    env: {
      ...process.env,
      CONSONANCE_DATA: dd,
      CONSONANCE_WATCH_STATE: path.join(dd, 'watch.state.json'),
    },
    encoding: 'utf8', timeout: 30000,
  });
  const led = path.join(dd, 'transcript-asks.jsonl');
  const rows = fs.existsSync(led)
    ? fs.readFileSync(led, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];
  return { dd, rows };
}

t('an ask row carries the turn count and the preceding turn duration', () => {
  const { rows } = run(capture([
    { turn: '12s' }, { turn: '1m 30s' }, { turn: '4m 10s' }, { ask: true },
  ]));
  assert.strictEqual(rows.length, 1, `expected one ask row, got ${rows.length}`);
  const r = rows[0];
  assert.strictEqual(r.turns_total, 3, `three turns preceded the ask, got ${r.turns_total}`);
  assert.strictEqual(r.prev_turn_ms, 250000, `4m 10s is 250000ms, got ${r.prev_turn_ms}`);
});

t('terminal REPAINTS of the same turn are not counted as separate turns', () => {
  // The live capture holds 1507 "Baked for" hits; a naive count would report ~1500 turns/session.
  const repainted = '\n* Baked for 4m 10s\n' + '\n* Baked for 4m 10s   \n' + '\n* Baked for 4m 10s\n';
  const { rows } = run(repainted + 'x'.repeat(8192) + `\n${ASK}?\n`);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].turns_total, 1,
    `three repaints of one turn must count once, got ${rows[0].turns_total}`);
});

t('the first ask has a null gap rather than a fabricated zero', () => {
  const { rows } = run(capture([{ turn: '5s' }, { ask: true }]));
  assert.strictEqual(rows[0].turns_since_prev_ask, null,
    'there is no previous ask to measure from — that is null, not 0');
});

t('a partial repaint with no digits yields null, not a wrong number', () => {
  // "Baked for " with the duration not yet drawn is really present in the capture.
  const { rows } = run('\n* Baked for \n' + 'x'.repeat(8192) + `\n${ASK}?\n`);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].prev_turn_ms, null, 'an unparsable duration must be null');
});

t('turns are counted across runs, and the gap between two asks is turns not bytes', () => {
  const first = capture([{ turn: '10s' }, { turn: '20s' }, { ask: true }]);
  const { dd, rows: r1 } = run(first);
  assert.strictEqual(r1[0].turns_total, 2);

  // The 1MB pad is load-bearing, not decoration: CLUSTER_GAP treats ask hits closer than 1MB as
  // repaints of one ask. Without it the second ask is correctly swallowed and this test failed —
  // the fixture was wrong, not the hook.
  const second = first + capture([
    { pad: 1200000 }, { turn: '30s' }, { turn: '40s' }, { turn: '50s' }, { ask: true },
  ]);
  const { rows: r2 } = run(second, { reuse: dd });
  assert.strictEqual(r2.length, 2, `expected a second ask row, got ${r2.length}`);
  assert.strictEqual(r2[1].turns_total, 5, `5 turns total by the second ask, got ${r2[1].turns_total}`);
  assert.strictEqual(r2[1].turns_since_prev_ask, 3,
    `3 turns between the asks, got ${r2[1].turns_since_prev_ask}`);
  assert.strictEqual(r2[1].prev_turn_ms, 50000, `50s before the ask, got ${r2[1].prev_turn_ms}`);
});

t('the row still carries what it always carried', () => {
  const { rows } = run(capture([{ turn: '5s' }, { ask: true }]));
  const r = rows[0];
  assert.ok(typeof r.log_offset === 'number' && r.log_offset > 0, 'log_offset must survive');
  assert.ok(typeof r.seen === 'string' && r.seen.includes('T'), 'seen must survive');
  assert.ok('backfill' in r, 'backfill must survive');
});

// ── THE RESOLVER (added 2026-09-08, BRAVO, L044) ─────────────────────────────────────────────
//
// Until this lap `dataDir()`'s third tier was `return "C:\\Consonance\\data"` — one machine's disk
// inside a shipped hook. Nothing here could see it: every case above passes CONSONANCE_DATA, so
// tier one answers and tiers two and three never run. The guard that should have caught it had the
// site BASELINED, so it was green by construction. A defect can be simultaneously covered by a test
// suite and exempted by a ratchet and still be live on every prompt.
//
// THE RESOLVER IS LOADED FROM THE SHIPPED BYTES, not re-implemented. The hook's entry point is
// `withStdin(main)` at the bottom and there is deliberately no `require.main` guard (dream-gate
// checks for the ENTRY marker), so it cannot be `require`d. It is evaluated in a `vm` with
// `os.homedir()` stubbed and a stdin that ends immediately — `main` then exits on the SID guard, so
// nothing is read and nothing is written. Testing a hand-copied resolver would assert only that I
// can copy; this asserts about the file that ships.
function resolver({ home, withEnv }) {
  const vm = require('vm');
  const src = fs.readFileSync(HOOK, 'utf8');
  const fakeOs = Object.create(require('os'));
  fakeOs.homedir = () => home;
  const env = { ...process.env };
  delete env.CONSONANCE_DATA;
  if (withEnv) env.CONSONANCE_DATA = withEnv;
  const ctx = {
    require: (n) => (n === 'os' ? fakeOs : require(n)),
    module: { exports: {} }, exports: {},
    process: { env, exit() {}, stdin: { setEncoding() {}, on(ev, cb) { if (ev === 'end') setImmediate(cb); } } },
    console: { log() {} }, Buffer, setTimeout, clearTimeout, setImmediate,
    __dirname: path.dirname(HOOK), __filename: HOOK,
  };
  vm.createContext(ctx);
  vm.runInContext(src + '\n;__r = dataDir;', ctx, { filename: HOOK });
  return ctx.__r();
}

function emptyHome() { return fs.mkdtempSync(path.join(os.tmpdir(), 'twatch-home-')); }

t('THE BAR: with no env and no config, the resolver names NO directory and no machine path', () => {
  const got = resolver({ home: emptyHome() });
  assert.strictEqual(got.dir, null,
    `unresolvable must be null, got ${JSON.stringify(got.dir)} — if this is a drive path, one `
    + "machine's disk is back in a shipped hook");
  assert.ok(!/[A-Za-z]:[\\/]/.test(JSON.stringify(got)),
    `the resolver returned a drive path: ${JSON.stringify(got)}`);
});

t('the unresolvable case is a SHAPE the caller must meet, not an empty string', () => {
  // `map_carry` returned '' for "no carry possible" on 2026-09-06 and the caller pasted it beneath
  // a header announcing the carry it had just failed to make. A falsy string is usable by accident;
  // a record whose `dir` is null has to be destructured and looked at.
  const got = resolver({ home: emptyHome() });
  assert.strictEqual(typeof got, 'object', 'the resolver must return a record, not a bare value');
  assert.ok('tier' in got, 'the record must say WHICH tier answered — that is the missing diagnostic');
  assert.strictEqual(got.tier, null, 'no tier answered, so tier must be null');
});

t('the two real tiers still answer, so the fix removed the literal and not the resolution', () => {
  // The two fixture dirs are BUILT, never written as `D:/...` literals. A hand-written drive path
  // here would be a genuinely benign test constant AND a new line in portable-paths.baseline.json —
  // and this lap exists because a baselined site stayed invisible for weeks. A fix that shrinks the
  // exemption list by one and grows it by four has not shrunk it.
  const home = emptyHome();
  const two_dir = path.join(home, 'from-config');
  const one_dir = path.join(home, 'from-env');
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ data_dir: two_dir }));
  const two = resolver({ home });
  assert.strictEqual(two.dir, two_dir, 'tier two must still read ~/.consonance.json');
  assert.strictEqual(two.tier, '~/.consonance.json');

  const one = resolver({ home, withEnv: one_dir });
  assert.strictEqual(one.dir, one_dir, 'tier one must still win over tier two');
  assert.strictEqual(one.tier, 'CONSONANCE_DATA');
});

t('OFF IS ANNOUNCED: an unresolvable data dir says so instead of exiting like a quiet session', () => {
  // The defect this closes is not that the hook stopped — it is that "the instrument is off for the
  // whole session" and "nobody asked for your transcript" printed the same thing: nothing.
  const home = emptyHome();
  const env = { ...process.env, USERPROFILE: home, HOME: home,
    CONSONANCE_WATCH_STATE: path.join(home, 'watch.state.json') };
  delete env.CONSONANCE_DATA;
  const out = execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ session_id: MAIN_SID }), env, encoding: 'utf8', timeout: 30000,
  });
  assert.ok(/OFF for this session/.test(out), `expected a spoken degrade, got: ${JSON.stringify(out)}`);
  assert.ok(/data_dir|CONSONANCE_DATA/.test(out), 'the degrade must say what to set, not just that it failed');
});

t('a RESOLVED but empty data dir is still quiet — only the OFF state was made loud', () => {
  // Guard against over-correction: the hook's "quiet when nothing new" contract covers three real
  // nothing-to-say states and this change was allowed to convert exactly one of them.
  const dd = fs.mkdtempSync(path.join(os.tmpdir(), 'twatch-empty-'));
  const out = execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ session_id: MAIN_SID }),
    env: { ...process.env, CONSONANCE_DATA: dd, CONSONANCE_WATCH_STATE: path.join(dd, 's.json') },
    encoding: 'utf8', timeout: 30000,
  });
  assert.strictEqual(out.trim(), '', `no capture is a genuine nothing-to-say; got: ${JSON.stringify(out)}`);
});

console.log(`\ntranscript-watch: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
