// dispatch-gate.test.js — the pure core in both directions, and the hook as the harness runs it:
// JSON on stdin, exit code and stdout observed — IN BOTH GATE MODES.
// Run: node --test consonance/hooks/dispatch-gate.test.js
//
// THE CONTRACT, one sentence per mode (L022 P-GATE-MODE-TESTS; the six clauses are the librarian's):
//   PRINT MODE: an uncited dispatch writes a ledger row stamped mode:'print', emits the question on
//               `systemMessage` byte-identical to ask mode, and NO permissionDecision leaves the hook
//               — the verb never stops and nobody clicks.
//   ASK MODE:   an uncited dispatch writes a ledger row stamped mode:'ask', emits the SAME
//               `systemMessage`, AND permissionDecision:'ask' carrying the question as its reason —
//               the verb stops for a click.
// In both modes: [interrupt] is exempt; the row's `mode` says what was EMITTED, never merely what
// the constant says; the cited-rate is reported per mode and never pooled.
//
// HOW THE SECOND MODE IS REACHED, stated because it is a finding about the gate and not a choice of
// this file: `7d40480` made GATE_MODE a bare const — no env override, no export; `d00050e` added the
// CONSONANCE_GATE_MODE read. The suite probes the env flip first; if the gate honours it (d00050e on),
// both arms run the SOURCE file with the env flipped. If it does not (7d40480), the ask arm runs a
// DERIVED COPY of the source with the declaration line replaced, the substitution asserted to apply
// exactly once, and the suite prints which path it took. The source file is never edited; its hash
// is checked at the end. If the arms cannot be built at all, the FIRST test is red and says why.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const {
  findCitation, findCitationDetail, buildQuestion, DISPATCH_VERBS, classifyLedger, TEST_SIGNATURE,
} = require('./dispatch-gate.js');

const HOOK = path.join(__dirname, 'dispatch-gate.js');
const REPORT = path.join(__dirname, '..', 'tools', 'dispatch-gate-report.js');
const SOURCE_SHA_AT_START = crypto.createHash('sha256').update(fs.readFileSync(HOOK)).digest('hex');

// fixtures for the injected lookups — no repo, no git, so both directions are pinnable
const exists = (p) => p === 'exo_memory/librarian/2026-08-24.md' || p === 'consonance/src-tauri/src/main.rs';
const shaOk = (s) => s === '3d33713' || s === '0a7ac2b';

// ── THE LEDGER LEAK, AND THE ONE LINE THAT CLOSES IT ────────────────────────────────────────────
//
// Until 2026-08-30 this function spawned the hook with the AMBIENT environment. `CONSONANCE_DATA`
// was unset, so the hook's `dataDir()` fell through to `~/.consonance.json` and every run of this
// suite appended FOUR rows to the LIVE ledger at C:/Consonance/data/dispatch-gate.jsonl.
//
// 468 of 604 rows — 77% of the ledger — were written by this file. The room then quoted the result
// as "the most direct evidence a focal cue does something" (the cited rate rising 10.8% -> 25.3%);
// the trend was the ratio of test runs to real dispatches per day. The suite was measuring itself.
//
// `LEDGER` below is the fix, and it is one line. Its proof is not this comment: a test in this file
// COPIES this source, DELETES the CONSONANCE_DATA line, runs the copy against a sandboxed home, and
// requires the rows to reappear. Without that mutation there is only an assertion that the leak is
// closed.
const LEDGER = fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-gate-ledger-'));

// A CLEAN sandbox repo for FERRY_REPO, so `isDirty()` is deterministically false and the question
// text is a pure function of the verb — which is what lets the two modes be compared byte for byte
// against `buildQuestion(verb, false)` rather than against whatever the working tree happens to be.
const SANDBOX_REPO = fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-gate-repo-'));
(function initCleanRepo() {
  const g = (args) => spawnSync('git', args, { cwd: SANDBOX_REPO, encoding: 'utf8' });
  g(['init', '-q']);
  g(['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'init']);
})();

function runHook(payload, envOverrides) {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: Object.assign({}, process.env, { CONSONANCE_DATA: LEDGER }, envOverrides || {}),
  });
  return { status: r.status, stdout: (r.stdout || '').trim() };
}

function decision(out) {
  if (!out) return null;
  const j = JSON.parse(out);
  return j.hookSpecificOutput ? j.hookSpecificOutput.permissionDecision : undefined;
}

// ── THE TWO ARMS ─────────────────────────────────────────────────────────────────────────────────

const UNCITED = { tool_name: 'mcp__consonance__chair_inject',
                  tool_input: { target: 'LIB', text: 'a confident paragraph citing nothing at all' } };
// The declaration LINE, in either shape the gate has had:
//   7d40480:  const GATE_MODE = 'print';
//   d00050e:  const GATE_MODE = (process.env.CONSONANCE_GATE_MODE === 'ask' ? 'ask' : 'print');
// The default is the LAST quoted mode on the line (the value in the bare form, the fallback in the
// env form). The first version of this regex pinned the bare form only, so when d00050e landed the
// env read this file THREW WHILE LOADING and reported `pass 0 / fail 1` — the silent-vs-green class
// this file warns about, produced by this file. `gateModeDefault` and the SETUP test below are the
// repair: a shape this suite cannot read is a RED with a message, never a file that failed to load.
const GATE_MODE_DECL = /^const GATE_MODE = [^\n]*;/m;
function gateModeDefault(src) {
  const lines = src.match(new RegExp(GATE_MODE_DECL.source, 'mg')) || [];
  if (lines.length !== 1) return { error: 'expected exactly one `const GATE_MODE = ...;` line, found ' + lines.length };
  const quoted = lines[0].match(/'(print|ask)'/g) || [];
  if (!quoted.length) return { error: 'the GATE_MODE line names neither \'print\' nor \'ask\': ' + lines[0] };
  return { line: lines[0], value: quoted[quoted.length - 1].slice(1, -1) };
}

function spawnHook(file, payload, env) {
  const r = spawnSync(process.execPath, [file], {
    input: JSON.stringify(payload), encoding: 'utf8',
    env: Object.assign({}, process.env, env),
  });
  const stdout = (r.stdout || '').trim();
  let out = null;
  if (stdout) { try { out = JSON.parse(stdout); } catch (_) { out = { UNPARSEABLE: stdout }; } }
  return { status: r.status, stdout, out };
}

/// Given a gate SOURCE TEXT, produce a runnable hook file per mode. Prefers the env flip; falls back
/// to a derived copy. Returns { print, ask, flip } where print/ask are { file, env }.
function armsFor(src, dir, label) {
  const decl = gateModeDefault(src);
  assert.ok(!decl.error, 'the arms cannot be built: ' + decl.error);
  const base = path.join(dir, label + '.js');
  fs.writeFileSync(base, src);
  const ledgerP = fs.mkdtempSync(path.join(dir, 'ledger-print-'));
  const ledgerA = fs.mkdtempSync(path.join(dir, 'ledger-ask-'));
  const common = { FERRY_REPO: SANDBOX_REPO };

  // 1. does the source honour an env override? (not at 7d40480 — but if the chair adds it, use it)
  const pa = spawnHook(base, UNCITED, Object.assign({ CONSONANCE_DATA: ledgerA, CONSONANCE_GATE_MODE: 'ask' }, common));
  const pp = spawnHook(base, UNCITED, Object.assign({ CONSONANCE_DATA: ledgerP, CONSONANCE_GATE_MODE: 'print' }, common));
  const decA = pa.out && pa.out.hookSpecificOutput && pa.out.hookSpecificOutput.permissionDecision;
  const decP = pp.out && pp.out.hookSpecificOutput && pp.out.hookSpecificOutput.permissionDecision;
  if (decA === 'ask' && decP === undefined) {
    return {
      flip: 'env',
      print: { file: base, env: Object.assign({ CONSONANCE_DATA: ledgerP, CONSONANCE_GATE_MODE: 'print' }, common) },
      ask:   { file: base, env: Object.assign({ CONSONANCE_DATA: ledgerA, CONSONANCE_GATE_MODE: 'ask' }, common) },
    };
  }
  // 2. derived copy: the ONE word substituted, exactly once, in a temp file. The source is untouched.
  const cur = decl.value;
  const other = cur === 'print' ? 'ask' : 'print';
  const derived = src.replace(decl.line, "const GATE_MODE = '" + other + "';");
  assert.notStrictEqual(derived, src, 'the derived copy is byte-identical to the source — no arm was built');
  const otherFile = path.join(dir, label + '.' + other + '.js');
  fs.writeFileSync(otherFile, derived);
  const arms = {
    flip: 'derived-copy',
    [cur]:   { file: base,      env: Object.assign({ CONSONANCE_DATA: cur === 'print' ? ledgerP : ledgerA }, common) },
    [other]: { file: otherFile, env: Object.assign({ CONSONANCE_DATA: other === 'print' ? ledgerP : ledgerA }, common) },
  };
  return arms;
}

function lastRow(arm) {
  const f = path.join(arm.env.CONSONANCE_DATA, 'dispatch-gate.jsonl');
  if (!fs.existsSync(f)) return null;
  const rows = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean);
  return rows.length ? JSON.parse(rows[rows.length - 1]) : null;
}

function fire(arm, payload) {
  if (!arm) throw new Error('no arm: the gate-mode arms were not constructed — see the SETUP test\'s message');
  const r = spawnHook(arm.file, payload, arm.env);
  return Object.assign(r, { row: lastRow(arm) });
}

/// What the hook EMITTED, read off its stdout and nothing else. This is the say-so-vs-disk half:
/// the row's `mode` is compared against THIS, never against the constant.
function emittedMode(out) {
  if (out && out.hookSpecificOutput && out.hookSpecificOutput.permissionDecision === 'ask') return 'ask';
  return 'print';
}

// Built at load, but NEVER allowed to throw at load: a suite that dies in setup prints `pass 0 /
// fail 1` and a reader sees no red line — which is what this file did on 2026-08-31 when d00050e
// changed the declaration's shape. A construction failure is captured and asserted by the FIRST
// test below, in the words a red uses; every later test that needs an arm fails on the same message.
const ARM_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-arms-'));
let ARMS = null, ARMS_ERROR = null;
try { ARMS = armsFor(fs.readFileSync(HOOK, 'utf8'), ARM_DIR, 'gate'); }
catch (e) { ARMS_ERROR = e; ARMS = { print: null, ask: null, flip: 'NOT BUILT' }; }
console.log('    GATE MODE ARMS: flip via ' + ARMS.flip +
  (ARMS.flip === 'derived-copy'
    ? '  <- FINDING (contract item 4): the gate exposes no env override and no export, so the ask arm ' +
      'runs a derived copy; `const GATE_MODE = (process.env.CONSONANCE_GATE_MODE === \'ask\' ? \'ask\' : \'print\')` ' +
      'in dispatch-gate.js would let both arms run the source'
    : ARMS.flip === 'NOT BUILT' ? '  <- SETUP FAILED: ' + (ARMS_ERROR && ARMS_ERROR.message) : ''));

test('SETUP — both gate-mode arms were constructed (a suite that cannot build its arms says so HERE, in red)', () => {
  assert.ifError(ARMS_ERROR);
  assert.ok(ARMS.print && ARMS.ask, 'arms object is missing a mode');
  assert.ok(['env', 'derived-copy'].includes(ARMS.flip), 'unknown flip mechanism: ' + ARMS.flip);
});

// ── the pure core ────────────────────────────────────────────────────────────

test('a dispatch citing a real commit routes an object', () => {
  assert.strictEqual(findCitation('landed as 3d33713, read the message', exists, shaOk), 'sha');
});

test('a dispatch citing a repo path routes an object', () => {
  assert.strictEqual(
    findCitation('the packets are at exo_memory/librarian/2026-08-24.md', exists, shaOk), 'path');
});

// the house citation format is path:line — if that did not count, every correctly-cited dispatch
// in this repo's history would be asked about, and the gate would be trained past within a night
test('the path:line citation format counts', () => {
  assert.strictEqual(findCitation('see consonance/src-tauri/src/main.rs:4818', exists, shaOk), 'path');
});

test('prose with no citation is caught, however long and however confident', () => {
  const essay = 'Your intake puts THE SHELF before THE ROOM it indexes, and the test asserts the '
    + 'opposite ordering. I did not fix it because burying a red inside my commit is how a red sits '
    + 'unwatched. It is on the table.';
  assert.strictEqual(findCitation(essay, exists, shaOk), null);
});

// the exact 2026-08-24 failure, as a fixture: fluent, specific, technically detailed, and citing
// nothing that can be opened
test('a sha-shaped string that does not resolve is not a citation', () => {
  assert.strictEqual(findCitation('fixed in d4e8f21', exists, shaOk), null,
    'an invented sha was handed over as a citation once already — it must not satisfy this gate');
});

test('a path-shaped string that does not exist is not a citation', () => {
  assert.strictEqual(findCitation('see exo_memory/loop/does_not_exist.md', exists, shaOk), null);
});

test('the interrupt carve-out is explicit and lands in the text the receiver reads', () => {
  assert.strictEqual(findCitation('[interrupt] stop, you are about to clobber the branch', exists, shaOk),
    'interrupt');
});

test('empty and non-string text never throw', () => {
  assert.strictEqual(findCitation('', exists, shaOk), null);
  assert.strictEqual(findCitation(undefined, exists, shaOk), null);
  assert.strictEqual(findCitation(null, exists, shaOk), null);
});

// ── the hook as the harness runs it — MODE-AWARE ────────────────────────────────────────────────
//
// These four were red at 7d40480, deliberately: they asserted permissionDecision === 'ask', the
// contract that commit changed. They now assert the contract PER MODE, and neither mode is weaker
// than the ask-only version was.

test('an uncited dispatch is QUESTIONED in both modes, and STOPPED only in ask', () => {
  const p = fire(ARMS.print, UNCITED);
  const a = fire(ARMS.ask, UNCITED);
  assert.strictEqual(p.status, 0, 'the hook must never fail the turn');
  assert.strictEqual(a.status, 0, 'the hook must never fail the turn');
  assert.ok(p.out && typeof p.out.systemMessage === 'string' && p.out.systemMessage.length > 0,
    'print: the question must still reach the seat on systemMessage');
  assert.strictEqual(p.out.hookSpecificOutput, undefined, 'print: no permissionDecision may leave the hook');
  assert.strictEqual(a.out.hookSpecificOutput.permissionDecision, 'ask', 'ask: the verb stops');
});

test('the question names the cost rather than reciting a rule — on the channel each mode emits', () => {
  const p = fire(ARMS.print, { tool_name: 'mcp__consonance__chair_inject',
    tool_input: { target: 'LIB', text: 'no citation here' } });
  const a = fire(ARMS.ask, { tool_name: 'mcp__consonance__chair_inject',
    tool_input: { target: 'LIB', text: 'no citation here' } });
  for (const why of [p.out.systemMessage, a.out.systemMessage, a.out.hookSpecificOutput.permissionDecisionReason]) {
    assert.ok(/un-revisable/.test(why), 'it must say why it cannot be taken back');
    assert.ok(/wrong ruling/.test(why), 'and name the measured consequence');
    assert.ok(/\[interrupt\]/.test(why), 'and tell the reader how to proceed deliberately');
  }
});

test("the librarian's verb is gated too, and the question addresses the right seat, in both modes", () => {
  const payload = { tool_name: 'mcp__consonance__call_chair', tool_input: { text: 'plan is ready, pull it' } };
  const p = fire(ARMS.print, payload);
  const a = fire(ARMS.ask, payload);
  assert.ok(/the orchestrator/.test(p.out.systemMessage));
  assert.ok(/the orchestrator/.test(a.out.hookSpecificOutput.permissionDecisionReason));
  assert.strictEqual(a.out.hookSpecificOutput.permissionDecision, 'ask');
  assert.strictEqual(p.out.hookSpecificOutput, undefined);
});

test('every other tool passes untouched — this gate has exactly two verbs', () => {
  for (const verb of ['Bash', 'Edit', 'mcp__consonance__post_board', 'mcp__consonance__raise_pull']) {
    const out = runHook({ tool_name: verb, tool_input: { text: 'no citation' } });
    assert.strictEqual(out.stdout, '', `${verb} must not be gated`);
    assert.strictEqual(out.status, 0);
  }
  assert.strictEqual(DISPATCH_VERBS.size, 2);
});

// raise_pull is the human-gated path; gating it too would put two questions in front of one act
test('raise_pull is deliberately not a dispatch verb', () => {
  assert.ok(!DISPATCH_VERBS.has('mcp__consonance__raise_pull'));
});

test('malformed stdin fails OPEN — a gate that breaks a dispatch is worse than none', () => {
  const r = spawnSync(process.execPath, [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual((r.stdout || '').trim(), '');
});

test('a payload with no tool_input fails OPEN in both modes', () => {
  const p = fire(ARMS.print, { tool_name: 'mcp__consonance__chair_inject' });
  const a = fire(ARMS.ask, { tool_name: 'mcp__consonance__chair_inject' });
  assert.strictEqual(p.status, 0);
  assert.strictEqual(a.status, 0);
  assert.ok(p.out && p.out.systemMessage, 'print: no text is no citation — it still questions, it must not crash');
  assert.strictEqual(p.out.hookSpecificOutput, undefined);
  assert.strictEqual(a.out.hookSpecificOutput.permissionDecision, 'ask',
    'ask: no text is no citation — it asks, but it must not crash');
});

// ── THE SIX CONTRACT CLAUSES ─────────────────────────────────────────────────────────────────────

test('CONTRACT 1 — the question text is byte-identical across modes, and equals the one source', () => {
  const p = fire(ARMS.print, UNCITED);
  const a = fire(ARMS.ask, UNCITED);
  const expected = buildQuestion(UNCITED.tool_name, false);
  assert.strictEqual(p.out.systemMessage, a.out.systemMessage,
    'the channel that no longer costs a click must not be the channel where the cue softens');
  assert.strictEqual(a.out.hookSpecificOutput.permissionDecisionReason, expected,
    "ask's question must be buildQuestion() and nothing else");
  assert.strictEqual(p.out.systemMessage, 'UNCITED DISPATCH — ' + expected);
  // FINDING, pinned rather than patched: the librarian's literal third equality — systemMessage ==
  // ask's question — does NOT hold and never did. The systemMessage carries the prefix
  // 'UNCITED DISPATCH — ' and permissionDecisionReason does not, in 7d40480 and in f8b64e8 before it
  // (dispatch-gate.js:254 vs :261; git show f8b64e8:consonance/hooks/dispatch-gate.js lines 212/216).
  // The relation that DOES hold is exactly a prefix, asserted here so any second divergence is red.
  assert.strictEqual(a.out.systemMessage, 'UNCITED DISPATCH — ' + a.out.hookSpecificOutput.permissionDecisionReason,
    'the two channels may differ by the UNCITED DISPATCH prefix and by nothing else');
});

test('CONTRACT 2 — print: systemMessage present and permissionDecision ABSENT; ask: both present', () => {
  const p = fire(ARMS.print, UNCITED);
  const a = fire(ARMS.ask, UNCITED);
  assert.ok(typeof p.out.systemMessage === 'string' && p.out.systemMessage.length > 0);
  assert.ok(!('hookSpecificOutput' in p.out), "print: hookSpecificOutput must be ABSENT, not 'allow'");
  assert.ok(!JSON.stringify(p.out).includes('permissionDecision'),
    'print: the string permissionDecision must not appear anywhere in the output');
  assert.ok(typeof a.out.systemMessage === 'string' && a.out.systemMessage.length > 0);
  assert.strictEqual(a.out.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.strictEqual(a.out.hookSpecificOutput.permissionDecision, 'ask');
});

test("CONTRACT 3 — the row's mode reports what was EMITTED, not what the constant says", () => {
  for (const mode of ['print', 'ask']) {
    const r = fire(ARMS[mode], UNCITED);
    assert.ok(r.row && r.row.outcome === 'asked', mode + ': the asked row must exist');
    assert.strictEqual(r.row.mode, emittedMode(r.out),
      mode + ": the ledger row claims mode '" + r.row.mode + "' while the hook emitted " +
      (emittedMode(r.out) === 'ask' ? 'a permissionDecision' : 'NO permissionDecision') +
      ' — the ledger is lying about its own mode');
    // cited rows are stamped too, so the split has a value for every gated row
    const c = fire(ARMS[mode], { tool_name: 'mcp__consonance__chair_inject',
      tool_input: { target: 'B', text: '[interrupt] stop' } });
    assert.ok(c.row && c.row.outcome === 'allowed');
    assert.ok(c.row.mode === 'print' || c.row.mode === 'ask', mode + ': allowed rows carry a mode too');
  }
});

test('CONTRACT 4 — the mode is read from ONE place, and both values are exercised', () => {
  const src = fs.readFileSync(HOOK, 'utf8');
  assert.strictEqual(src.match(new RegExp(GATE_MODE_DECL.source, 'mg')).length, 1,
    'exactly one GATE_MODE declaration');
  assert.ok(!/mode: '(print|ask)'/.test(src), 'no record site may stamp a literal mode');
  assert.ok(!/if \('(print|ask)' === '(print|ask)'\)/.test(src), 'no emit site may compare literals');
  const p = fire(ARMS.print, UNCITED);
  const a = fire(ARMS.ask, UNCITED);
  assert.notStrictEqual(emittedMode(p.out), emittedMode(a.out), 'the flip did not take: both arms emitted the same shape');
  assert.ok(['env', 'derived-copy'].includes(ARMS.flip));
});

test('CONTRACT 5 — the report splits the cited-rate BY MODE and refuses a pooled figure', () => {
  const { splitByMode, render, bucketOf, MODE_SWITCH_ISO } = require(REPORT);
  const S = Date.parse(MODE_SWITCH_ISO);
  const row = (ms, o) => Object.assign({ ts: new Date(S + ms).toISOString(), verb: 'mcp__consonance__chair_inject' }, o);
  const rows = [
    row(-3000, { outcome: 'allowed', cited: 'sha' }),               // pre-switch, no mode -> ask by construction
    row(-2000, { outcome: 'asked', cited: null }),
    row(-1000, { outcome: 'allowed', cited: 'interrupt' }),
    row(1000, { outcome: 'allowed', cited: 'path', mode: 'ask' }),  // stamped ask
    row(2000, { outcome: 'allowed', cited: 'sha', mode: 'print' }), // stamped print x4: 2 cited of 4
    row(3000, { outcome: 'asked', cited: null, mode: 'print' }),
    row(4000, { outcome: 'allowed', cited: 'path', mode: 'print' }),
    row(5000, { outcome: 'asked', cited: null, mode: 'print' }),
    row(6000, { outcome: 'allowed', cited: 'sha' }),                // AFTER the switch, no mode -> unstamped
    row(7000, { outcome: 'inert', why: 'no repo resolved' }),       // measures nothing
  ];
  assert.strictEqual(bucketOf(rows[0]), 'ask');
  assert.strictEqual(bucketOf(rows[8]), 'unstamped');
  const s = splitByMode(rows);
  assert.deepStrictEqual([s.ask.cited, s.ask.gated, s.ask.byConstruction], [2, 4, 3],
    'ask = 1 stamped + 3 by construction; the pre-switch rows are NOT backfilled, they are counted as ask');
  assert.deepStrictEqual([s.print.cited, s.print.gated], [2, 4]);
  assert.deepStrictEqual([s.unstamped.cited, s.unstamped.gated], [1, 1],
    'a row with no mode written after the switch is a stale hook, counted in neither mode');
  assert.ok(!('pooled' in s) && !('all' in s) && !('total' in s), 'no pooled key may exist');
  const text = render(s);
  assert.ok(/ask\s+2 cited of 4 gated = 50\.0%/.test(text), text);
  assert.ok(/print\s+2 cited of 4 gated = 50\.0%/.test(text), text);
  assert.ok(/UNSTAMPED after the switch: 1/.test(text), text);
  assert.ok(/pooled figure: REFUSED/.test(text), 'the refusal must be a printed line');
  assert.ok(!/pooled: \d/.test(text) && !/5 cited of 9/.test(text), 'no pooled rate anywhere in the output');
  // the CLI, against a temp ledger, and the --pooled refusal
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-report-'));
  fs.writeFileSync(path.join(dir, 'dispatch-gate.jsonl'), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  const env = Object.assign({}, process.env, { CONSONANCE_DATA: dir });
  const ok = spawnSync(process.execPath, [REPORT], { encoding: 'utf8', env });
  assert.strictEqual(ok.status, 0, ok.stderr);
  assert.ok(/pooled figure: REFUSED/.test(ok.stdout));
  const pooled = spawnSync(process.execPath, [REPORT, '--pooled'], { encoding: 'utf8', env });
  assert.strictEqual(pooled.status, 1, '--pooled must be refused with a non-zero exit');
  assert.ok(/two populations/.test(pooled.stderr));
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
});

test('CONTRACT 6 — [interrupt] is exempt in BOTH modes, unchanged', () => {
  for (const mode of ['print', 'ask']) {
    const r = fire(ARMS[mode], { tool_name: 'mcp__consonance__chair_inject',
      tool_input: { target: 'B', text: '[interrupt] stop, you are about to clobber the branch' } });
    assert.strictEqual(r.status, 0);
    assert.strictEqual(r.stdout, '', mode + ': an interrupt must pass with no output at all');
    assert.strictEqual(r.row.outcome, 'allowed');
    assert.strictEqual(r.row.cited, 'interrupt');
  }
});

// ── the join keys the outcome column needs ──────────────────────────────────────────────────────

test('findCitationDetail returns the token, and findCitation still returns only the kind', () => {
  const d = findCitationDetail('landed as 3d33713, read the message', exists, shaOk);
  assert.deepStrictEqual(d, { kind: 'sha', token: '3d33713' });
  assert.strictEqual(findCitation('landed as 3d33713, read the message', exists, shaOk), 'sha',
    'the old contract must not move — other seats split transcripts with this by name');
  assert.deepStrictEqual(
    findCitationDetail('see consonance/src-tauri/src/main.rs:4818', exists, shaOk),
    { kind: 'path', token: 'consonance/src-tauri/src/main.rs' },
    'the :line suffix is stripped so the token is openable');
  assert.deepStrictEqual(findCitationDetail('nothing here', exists, shaOk), { kind: null, token: null });
  assert.deepStrictEqual(findCitationDetail('[interrupt] stop', exists, shaOk),
                         { kind: 'interrupt', token: null });
});

test('a gated dispatch records the target and the citation, and NEVER the token or the text', () => {
  runHook({ tool_name: 'mcp__consonance__chair_inject',
            tool_input: { target: 'B', token: 'SECRET-CHAIR-TOKEN', text: 'uncited prose' } });
  const raw = fs.readFileSync(path.join(LEDGER, 'dispatch-gate.jsonl'), 'utf8');
  assert.ok(!raw.includes('SECRET-CHAIR-TOKEN'), 'the chair token reached the ledger');
  assert.ok(!raw.includes('uncited prose'), 'the dispatch text reached the ledger');
  const rows = raw.split('\n').filter(Boolean);
  const last = JSON.parse(rows[rows.length - 1]);
  assert.strictEqual(last.target, 'B');
  assert.strictEqual(last.citation, null);
});

// ── the classifier that decides what gets quarantined ───────────────────────────────────────────

const T0 = Date.parse('2026-08-30T10:00:00.000Z');
const at = (ms, o) => Object.assign({ ts: new Date(T0 + ms).toISOString() }, o);
const testRun = (base, stepMs) => TEST_SIGNATURE.map((s, k) =>
  at(base + k * (stepMs === undefined ? 100 : stepMs),
     { verb: s.verb, outcome: s.outcome, cited: null, chars: s.chars }));
const realRow = (ms, cited) =>
  at(ms, { verb: 'mcp__consonance__chair_inject', outcome: 'allowed', cited, chars: 2000 });

test('a test run is quarantined whole, and real rows around it are kept', () => {
  const rows = [realRow(0, 'sha'), ...testRun(1000), realRow(9000, 'path'),
                ...testRun(20000), realRow(40000, 'sha')];
  const c = classifyLedger(rows);
  assert.strictEqual(c.runs.length, 2);
  assert.strictEqual(c.quarantine.length, 8);
  assert.strictEqual(c.keep.length, 3);
  assert.strictEqual(c.keep.length + c.quarantine.length, rows.length,
    'the partition must be exhaustive or the report describes a set nobody measured');
  assert.ok(c.keep.every((r) => r.outcome === 'allowed'));
});

test('the values alone are not enough — a quadruple spread over minutes is KEPT, and reported', () => {
  const c = classifyLedger(testRun(0, 60000));
  assert.strictEqual(c.quarantine.length, 0, 'a slow quadruple must never be quarantined');
  assert.strictEqual(c.keep.length, 4);
  assert.strictEqual(c.nearMisses.length, 1, 'and it must be printed, not silently kept');
});

test('a partial test run is left in place and reported as an orphan', () => {
  const rows = [realRow(0, 'sha'), ...testRun(1000).slice(0, 3)];
  const c = classifyLedger(rows);
  assert.strictEqual(c.quarantine.length, 0, 'three of four rows is not a run');
  assert.strictEqual(c.orphans.length, 3, 'the leftovers must be visible, not swallowed');
});

test('a real uncited dispatch that happens to be 43 chars is NOT quarantined on its own', () => {
  const rows = [at(0, { verb: 'mcp__consonance__chair_inject', outcome: 'asked', cited: null, chars: 43 }),
                realRow(5000, 'sha')];
  const c = classifyLedger(rows);
  assert.strictEqual(c.quarantine.length, 0);
  assert.strictEqual(c.orphans.length, 1, 'it is flagged for a human, never moved by the machine');
});

// ── THE PROOF: remove the CONSONANCE_DATA line and the rows come back ───────────────────────────
//
// The bar the packet set, and the only thing that distinguishes a closed leak from a claim that the
// leak is closed. The suite is copied, the fix is deleted from the copy, and both are run against a
// sandboxed home whose .consonance.json points at a sentinel directory — exactly the fallback path
// that caused the pollution. Unmutated: the sentinel stays empty. Mutated: it fills.

test('MUTATION — deleting the CONSONANCE_DATA line makes the ledger rows reappear', () => {
  if (process.env.DG_MUTANT) return;                    // the copy must not re-enter this test

  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-sandbox-'));
  const home = path.join(sandbox, 'home');
  const sentinel = path.join(sandbox, 'data');
  fs.mkdirSync(home); fs.mkdirSync(sentinel);
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({
    data_dir: sentinel,
    room_path: path.join(__dirname, '..', '..', 'exo_memory', 'BOOT.md'),
  }));

  const hookAbs = JSON.stringify(path.join(__dirname, 'dispatch-gate.js'));
  const reportAbs = JSON.stringify(path.join(__dirname, '..', 'tools', 'dispatch-gate-report.js'));
  const src = fs.readFileSync(__filename, 'utf8');
  const abs = (s) => s
    .replace(/'\.\/dispatch-gate\.js'/g, hookAbs)
    .replace(/path\.join\(__dirname, 'dispatch-gate\.js'\)/g, hookAbs)
    .replace(/path\.join\(__dirname, '\.\.', 'tools', 'dispatch-gate-report\.js'\)/g, reportAbs);

  const FIX = /\n\s*env: Object\.assign\(\{\}, process\.env, \{ CONSONANCE_DATA: LEDGER \}, envOverrides \|\| \{\}\),/;
  assert.ok(FIX.test(src),
    'NOT APPLIED: the fix line was not found, so this mutation proves nothing about it');
  const mutated = abs(src.replace(FIX, ''));
  assert.notStrictEqual(mutated, abs(src), 'NOT APPLIED: the substitution was a no-op');

  const env = Object.assign({}, process.env, { DG_MUTANT: '1', HOME: home, USERPROFILE: home });
  delete env.CONSONANCE_DATA;
  delete env.FERRY_REPO;

  const clean = path.join(sandbox, 'clean.test.js');
  const dirty = path.join(sandbox, 'dirty.test.js');
  fs.writeFileSync(clean, abs(src));
  fs.writeFileSync(dirty, mutated);
  const ledger = path.join(sentinel, 'dispatch-gate.jsonl');
  const count = () => (fs.existsSync(ledger)
    ? fs.readFileSync(ledger, 'utf8').split('\n').filter(Boolean).length : 0);

  // Run the copies PLAINLY, not under `--test`. A mutation harness must be able to say why a
  // mutant produced nothing, and `node --test` reports a file that failed to LOAD identically to a
  // file whose assertions ran and passed — which is this repo's own SILENT-vs-green failure class,
  // rebuilt inside the instrument meant to prove the fix. Run plainly and keep the output.
  const run = (f) => spawnSync(process.execPath, [f], { encoding: 'utf8', env });
  const tail = (r) => ((r.stderr || '') + (r.stdout || '')).trim().split('\n').slice(0, 6).join(' | ');

  const rc = run(clean);
  const afterClean = count();
  const rd = run(dirty);
  const afterDirty = count();

  // A clean copy that CRASHED also writes zero rows, and would pass the next assertion for the
  // worst possible reason. This is the first version of this test's actual defect: it ran the
  // copies under `node --test`, where a file that never loaded is reported the same as a green one,
  // and it read the mutant's silence as "the leak is closed". Require the clean copy to have RUN.
  assert.strictEqual(rc.status, 0,
    'THE CONTROL ARM DID NOT RUN (exit ' + rc.status + '), so its zero rows mean nothing.\n  ' +
    tail(rc));
  assert.strictEqual(afterClean, 0,
    'THE FIX IS NOT LOAD-BEARING: the unmutated suite still wrote ' + afterClean + ' row(s) to the ' +
    'fallback ledger. Every other assertion about the leak being closed is void.\n  clean said: ' +
    tail(rc));
  assert.ok(afterDirty > 0,
    'THE MUTATION DID NOT REPRODUCE THE LEAK (' + afterDirty + ' rows), so this test proves NOTHING ' +
    'about the fix — treat it as NOT APPLIED and find out why before trusting the quarantine.\n' +
    '  mutant exit ' + rd.status + ' said: ' + tail(rd));

  try { fs.rmSync(sandbox, { recursive: true, force: true }); } catch (_) {}
});

// ── MUTATION on the classifier, because this is the code that MOVES DATA ────────────────────────
//
// The packet named one mutation (delete the CONSONANCE_DATA line) and that is the test above. This
// is the other half: `classifyLedger` decides which rows leave the live ledger, so every guard in it
// is broken here and required to turn something red. Reported as applied / caught / NOT APPLIED,
// and a NOT APPLIED mutant proves nothing about the guard it was aimed at.

test('MUTATION — every guard in the classifier is load-bearing', () => {
  const src = fs.readFileSync(path.join(__dirname, 'dispatch-gate.js'), 'utf8');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-mut-'));

  const slowRun = TEST_SIGNATURE.map((s, k) => ({
    ts: new Date(T0 + k * 60000).toISOString(),
    verb: s.verb, outcome: s.outcome, cited: null, chars: s.chars,
  }));
  const citedLikeTest = TEST_SIGNATURE.map((s, k) => ({
    ts: new Date(T0 + k * 100).toISOString(),
    verb: s.verb, outcome: s.outcome, cited: 'sha', chars: s.chars,
  }));
  const partial = [realRow(0, 'sha')].concat(testRun(1000).slice(0, 3));

  const MUTANTS = [
    { // without the clock, a quadruple spread over an hour is moved out of the live ledger
      id: 'classifier/burst-window-ignored',
      find: '    if (!(span >= 0 && span <= limit)) {',
      replace: '    if (false) {',
      probe: (m) => m.classifyLedger(slowRun).quarantine.length > 0,
    },
    { // without the cited check, four REAL cited dispatches of those lengths would be quarantined
      id: 'classifier/cited-field-not-checked',
      find: "         (row.cited === null || row.cited === undefined) && row.chars === s.chars;",
      replace: '         row.chars === s.chars;',
      probe: (m) => m.classifyLedger(citedLikeTest).quarantine.length > 0,
    },
    { // order is what makes the signature specific; matching any position makes it a value filter
      id: 'classifier/signature-order-ignored',
      find: '    if (![0, 1, 2, 3].every((k) => matchesSignature(rows[i + k], k))) continue;',
      replace: '    if (![0, 1, 2, 3].every((k) => TEST_SIGNATURE.some((_, j) => matchesSignature(rows[i + k], j)))) continue;',
      probe: (m) => {
        const shuffled = [slowRun[1], slowRun[0], slowRun[3], slowRun[2]]
          .map((r, k) => Object.assign({}, r, { ts: new Date(T0 + k * 100).toISOString() }));
        return m.classifyLedger(shuffled).quarantine.length > 0;
      },
    },
    { // leftovers must stay visible; a silent orphan is pollution nobody can find again
      id: 'classifier/orphans-not-reported',
      find: '  const orphans = keep.filter((r) => r.outcome === \'asked\' && !r.cited &&\n                                     TEST_SIGNATURE.some((s) => s.chars === r.chars));',
      replace: '  const orphans = [];',
      probe: (m) => m.classifyLedger(partial).orphans.length === 0,
    },
  ];

  let applied = 0, caught = 0, notApplied = 0;
  const survivors = [], skipped = [];
  for (const mut of MUTANTS) {
    // the probe must be clean on healthy code, or its catch would mean nothing
    assert.strictEqual(mut.probe(require('./dispatch-gate.js')), false,
      'BROKEN PROBE: ' + mut.id + ' fires on the unmutated classifier');
    const n = src.split(mut.find).length - 1;
    if (n !== 1) { notApplied++; skipped.push(mut.id + ' (' + (n === 0 ? 'not found' : n + ' occurrences') + ')'); continue; }
    const f = path.join(dir, mut.id.replace(/[^a-z0-9]/gi, '_') + '.js');
    fs.writeFileSync(f, src.replace(mut.find, mut.replace));
    applied++;
    let got;
    try { got = mut.probe(require(f)); } catch (_) { got = true; }
    if (got) caught++; else survivors.push(mut.id);
  }
  console.log('    MUTATION (classifier): applied ' + applied + ' / caught ' + caught +
              ' / NOT APPLIED ' + notApplied);
  for (const s of skipped) console.log('      NOT APPLIED — proves nothing: ' + s);
  for (const s of survivors) console.log('      SURVIVED: ' + s);
  assert.strictEqual(survivors.length, 0, 'survivors: ' + survivors.join(', '));
  assert.strictEqual(notApplied, 0, 'not applied: ' + skipped.join(', '));
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
});

// ── MUTATION on the six contract clauses — each broken in a COPY, each required to turn red ─────
//
// The librarian's bar: "the six mutations each shown red then restored byte-identical". Every mutant
// here is applied to a temp copy of the gate (or of the report), run as the harness would run it,
// and probed with the SAME predicate the contract test above asserts. The source is never touched;
// the last assertion in this file compares its hash to the one taken at load. A mutant whose `find`
// string is absent is NOT APPLIED and proves nothing — it is counted and printed, never skipped
// silently.

test('MUTATION — the six contract clauses are load-bearing', () => {
  if (process.env.DG_MUTANT) return;                    // the leak-proof copy runs the light suite only
  const gateSrc = fs.readFileSync(HOOK, 'utf8');
  const reportSrc = fs.readFileSync(REPORT, 'utf8');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-contract-mut-'));
  const INTERRUPT = { tool_name: 'mcp__consonance__chair_inject',
                      tool_input: { target: 'B', text: '[interrupt] stop' } };

  // a hook mutant is probed on both arms built FROM THE MUTANT SOURCE
  const hookProbe = (pred) => (mutSrc, label) => {
    const arms = armsFor(mutSrc, dir, label);
    return pred({ print: fire(arms.print, UNCITED), ask: fire(arms.ask, UNCITED),
                  iPrint: fire(arms.print, INTERRUPT), iAsk: fire(arms.ask, INTERRUPT) });
  };
  const has = (r) => r.out && r.out.hookSpecificOutput;

  const MUTANTS = [
    { // item 1: the print channel softens by ONE character while ask stays — arm-to-arm byte equality catches it
      id: 'contract-1/print-text-softened-one-char',
      on: 'gate',
      find: "  const out = { systemMessage: 'UNCITED DISPATCH — ' + question };",
      replace: "  const out = { systemMessage: (GATE_MODE === 'print' ? 'uNCITED DISPATCH — ' : 'UNCITED DISPATCH — ') + question };",
      probe: hookProbe((r) => r.print.out.systemMessage !== r.ask.out.systemMessage),
    },
    { // item 2a: a permissionDecision leaves the hook under print
      id: 'contract-2/decision-emitted-under-print',
      on: 'gate',
      find: "  const out = { systemMessage: 'UNCITED DISPATCH — ' + question };",
      replace: "  const out = { systemMessage: 'UNCITED DISPATCH — ' + question, hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow' } };",
      probe: hookProbe((r) => !!has(r.print)),
    },
    { // item 2b: the systemMessage is dropped — the question reaches nobody under bypass
      id: 'contract-2/systemMessage-dropped',
      on: 'gate',
      find: "  const out = { systemMessage: 'UNCITED DISPATCH — ' + question };",
      replace: '  const out = {};',
      probe: hookProbe((r) => !(r.print.out && typeof r.print.out.systemMessage === 'string' && r.print.out.systemMessage.length > 0)),
    },
    { // item 3: the asked row stamps a literal mode the hook did not emit — the ledger lies about itself
      id: 'contract-3/row-mode-lies',
      on: 'gate',
      find: "  record({ verb, outcome: 'asked', cited: null, citation: null, target,\n           chars: (text || '').length, mode: GATE_MODE });",
      replace: "  record({ verb, outcome: 'asked', cited: null, citation: null, target,\n           chars: (text || '').length, mode: 'ask' });",
      probe: hookProbe((r) => r.print.row.mode !== emittedMode(r.print.out)),
    },
    { // item 4: 'print' hardcoded at the emit site — the ask arm records ask and emits nothing
      id: 'contract-4/emit-site-hardcoded-print',
      on: 'gate',
      find: "  if (GATE_MODE === 'ask') {",
      replace: "  if ('print' === 'ask') {",
      probe: hookProbe((r) => r.ask.row.mode !== emittedMode(r.ask.out)),
    },
    { // item 5: the report pools the two periods into one figure
      id: 'contract-5/report-pools',
      on: 'report',
      find: "  lines.push('  pooled figure: REFUSED — two periods are not one population (L017).');",
      replace: "  lines.push('  pooled: ' + ((split.ask.cited + split.print.cited) / ((split.ask.gated + split.print.gated) || 1) * 100).toFixed(1) + '%');",
      probe: (mutSrc, label) => {
        const f = path.join(dir, label + '.report.js');
        fs.writeFileSync(f, mutSrc.replace("require('../hooks/dispatch-gate.js')", 'require(' + JSON.stringify(HOOK) + ')'));
        const m = require(f);
        const s = m.splitByMode([
          { ts: '2026-08-30T00:00:00Z', outcome: 'allowed', cited: 'sha' },
          { ts: '2026-09-01T00:00:00Z', outcome: 'asked', cited: null, mode: 'print' },
        ]);
        const text = m.render(s);
        return /pooled: \d/.test(text) || !/pooled figure: REFUSED/.test(text);
      },
    },
    { // item 6: the [interrupt] exemption is stripped under print — a bare interrupt gets questioned
      id: 'contract-6/interrupt-exemption-stripped-under-print',
      on: 'gate',
      find: "  if (INTERRUPT.test(text)) return { kind: 'interrupt', token: null };",
      replace: "  if (GATE_MODE !== 'print' && INTERRUPT.test(text)) return { kind: 'interrupt', token: null };",
      probe: hookProbe((r) => r.iPrint.stdout !== '' || r.iPrint.row.cited !== 'interrupt'),
    },
  ];

  let applied = 0, caught = 0, notApplied = 0;
  const survivors = [], skipped = [];
  MUTANTS.forEach((mut, i) => {
    const src = mut.on === 'gate' ? gateSrc : reportSrc;
    // the probe must be clean on healthy code, or its catch would mean nothing
    assert.strictEqual(mut.probe(src, 'clean' + i), false, 'BROKEN PROBE: ' + mut.id + ' fires on the unmutated ' + mut.on);
    const n = src.split(mut.find).length - 1;
    if (n !== 1) { notApplied++; skipped.push(mut.id + ' (' + (n === 0 ? 'not found' : n + ' occurrences') + ')'); return; }
    applied++;
    let got;
    try { got = mut.probe(src.replace(mut.find, mut.replace), 'mut' + i); } catch (e) { got = true; }
    if (got) caught++; else survivors.push(mut.id);
  });
  console.log('    MUTATION (contract): applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied +
              '   (items 1, 2a, 2b, 3, 4, 5, 6)');
  for (const s of skipped) console.log('      NOT APPLIED — proves nothing: ' + s);
  for (const s of survivors) console.log('      SURVIVED: ' + s);
  assert.strictEqual(survivors.length, 0, 'survivors: ' + survivors.join(', '));
  assert.strictEqual(notApplied, 0, 'not applied: ' + skipped.join(', '));
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
});

test('RESTORED — the gate source is byte-identical to what was loaded; no mutant touched it', () => {
  const now = crypto.createHash('sha256').update(fs.readFileSync(HOOK)).digest('hex');
  assert.strictEqual(now, SOURCE_SHA_AT_START, 'dispatch-gate.js changed on disk during the run');
});
