// mutant-harness.test.js — the gates of pane A's mutant harness. Every case runs on strings, or on files this test
// writes into a temp dir; nothing reads or writes the live checkout, and no worktree or build is made.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const T = process.env.MUTANT_HARNESS_UNDER_TEST || path.join(__dirname, 'mutant-harness.js');
const { carriesMutation, audit, auditReport, refused } = require(T);

let pass = 0;
let fail = 0;
function it(name, fn) {
  try {
    fn();
    pass++;
    console.log('  ok   ' + name);
  } catch (e) {
    fail++;
    console.log('  FAIL ' + name + '\n         ' + (e && e.message));
  }
}

// THE EXACT MISFIRE. Copied verbatim from consonance/src-tauri/src/mcp.rs at 136bdc9 (:797-799 and :816-818): the
// address branch and the out-of-turn branch of call_librarian. D078's mutant #4 swapped the first line for the second,
// and the second is already in the file, legitimately, twenty lines down. The whole-file check refused the run.
const MCP_EXCERPT = [
  '                role: "committee".to_string(),',
  '                text: refused_address_row(&who, &text),',
  '                ts: now_ms(),',
  '            });',
  '            return Ok(CallToolResult::success(vec![Content::text(',
  '                "refused: no address row from this mount\'s seat to the librarian (the attempt was posted to the board)",',
  '            )]));',
  '        }',
  '        if !self.auth_station("call_librarian") {',
  '            board_push(&self.board, BoardEntry {',
  '                role: "committee".to_string(),',
  '                text: refused_attempt_row(&who, &text),',
  '                ts: now_ms(),',
].join('\n');
const D078_4 = [
  'the address branch posts the out-of-turn row instead',
  '                text: refused_address_row(&who, &text),',
  '                text: refused_attempt_row(&who, &text),',
];

// ── the misfire ─────────────────────────────────────────────────────────────────────────────────

it('THE MISFIRE: a replacement that already stands ELSEWHERE in the file is not a leftover mutation', () => {
  assert.strictEqual(carriesMutation(MCP_EXCERPT, D078_4[1], D078_4[2]), false);
});

it('THE MISFIRE, through the gates: D078 #4 as written passes all three', () => {
  const a = audit(MCP_EXCERPT, [D078_4]);
  assert.strictEqual(refused(a), false, auditReport(a));
});

// ── what the check exists to catch ─────────────────────────────────────────────────────────────

it('a leftover mutation — the replacement standing where the anchor was — is caught', () => {
  const left = MCP_EXCERPT.replace(D078_4[1], () => D078_4[2]);
  const a = audit(left, [D078_4]);
  assert.deepStrictEqual(a.dirty.map(([id]) => id), [1]);
});

it('a leftover INSERTION (the replacement wraps the anchor, so the anchor still occurs once) is caught', () => {
  // The D076 shape: "the environment cleared after the switch" appends a line after the anchor.
  const src = 'fn spawn() {\n    suppress(&mut cmd);\n    spawn_command(cmd);\n}\n';
  const row = ['env cleared after', '    suppress(&mut cmd);\n', '    suppress(&mut cmd);\n    cmd.env_clear();\n'];
  assert.strictEqual(audit(src, [row]).dirty.length, 0, 'clean source must pass');
  const left = src.replace(row[1], () => row[2]);
  assert.strictEqual(left.split(row[1]).length - 1, 1, 'fixture: the anchor must still occur once');
  assert.deepStrictEqual(audit(left, [row]).dirty.map(([id]) => id), [1]);
});

it('a leftover PREFIX insertion (text added before the anchor) is caught', () => {
  const src = 'a();\nb();\nc();\n';
  const row = ['guard added before b', 'b();\n', 'if false { return; }\nb();\n'];
  const left = src.replace(row[1], () => row[2]);
  assert.deepStrictEqual(audit(left, [row]).dirty.map(([id]) => id), [1]);
});

it('a leftover mutation names ONLY its own row, not every row whose replacement appears somewhere (the L061 limit)', () => {
  const src = 'let a = 1;\nlet b = 1;\nlet c = 0;\n';
  const rows = [
    ['a changed', 'let a = 1;', 'let a = 2;'],
    ['b becomes c', 'let b = 1;', 'let c = 0;'], // its replacement is legitimate text elsewhere
  ];
  assert.strictEqual(refused(audit(src, rows)), false, 'clean source must pass');
  const left = src.replace(rows[0][1], () => rows[0][2]);
  assert.deepStrictEqual(audit(left, rows).dirty.map(([id]) => id), [1]);
});

// ── the anchor gate is unchanged ───────────────────────────────────────────────────────────────

it('an anchor an edit rewrote (no anchor, no replacement) is MISSING, not a leftover', () => {
  const a = audit('let x = 3;\n', [['x', 'let x = 1;', 'let x = 2;']]);
  assert.strictEqual(a.dirty.length, 0);
  assert.deepStrictEqual(a.orphan.map(([id, , n]) => [id, n]), [[1, 0]]);
  assert.ok(auditReport(a).includes('MISSING'), auditReport(a));
});

it('an anchor that occurs twice is refused by the anchor gate', () => {
  const a = audit('f();\nf();\n', [['f twice', 'f();', 'g();']]);
  assert.strictEqual(refused(a), true);
  assert.ok(auditReport(a).includes('2 MATCHES'), auditReport(a));
});

it('no anchor and the replacement present is reported as a possible leftover, never as a rewrite to re-point at', () => {
  // With the anchor gone there is no position to compare at. The run is refused either way; this pins that the
  // diagnosis is the one that says restore, because "re-point the anchor" here would re-point it onto the mutation.
  const a = audit('let x = 2;\n', [['x', 'let x = 1;', 'let x = 2;']]);
  assert.deepStrictEqual(a.dirty.map(([id]) => id), [1]);
  assert.ok(auditReport(a).includes('ALREADY CARRIES A MUTATION'), auditReport(a));
});

it('a malformed row is refused before the source is judged', () => {
  const a = audit('x', [['same', 'x', 'x'], ['short', 'x']]);
  assert.deepStrictEqual(a.malformed.map(([id]) => id), [1, 2]);
  assert.strictEqual(refused(a), true);
});

// ── the CLI, gates only ────────────────────────────────────────────────────────────────────────

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'mutant-harness-'));
const cli = (src, rows) => {
  fs.writeFileSync(path.join(ROOT, 'src.rs'), src);
  const cfg = path.join(ROOT, 'rows.js');
  fs.writeFileSync(cfg, `module.exports = ${JSON.stringify({ label: 't', repo: ROOT, rel: 'src.rs', rows, score: { cmd: 'false', args: [] } })};\n`);
  return spawnSync(process.execPath, [T, cfg, '--audit'], { encoding: 'utf8' });
};

it('CLI --audit: the misfire case exits 0 and says the rows pass', () => {
  const r = cli(MCP_EXCERPT.replace(/\n/g, '\r\n'), [D078_4]);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(r.stdout.includes('1 rows pass'), r.stdout);
});

it('CLI --audit: a leftover mutation exits 2 and names the row', () => {
  const r = cli(MCP_EXCERPT.replace(D078_4[1], () => D078_4[2]), [D078_4]);
  assert.strictEqual(r.status, 2);
  assert.ok(r.stderr.includes('#1 the address branch posts the out-of-turn row instead'), r.stderr);
});

console.log('\n  ' + pass + ' passed, ' + fail + ' failed');
try {
  fs.rmSync(ROOT, { recursive: true, force: true });
} catch (_) {}
process.exit(fail ? 1 : 0);
