// The two directions, and the one that would quietly retire this tool.
//
// A counter that stops counting reports a clean session and looks identical to good behaviour.
// That failure has shipped three times this week wearing a green result — a build that embedded
// nothing, a wiring whose before and after were byte-identical, a watcher that exited on its
// first recoverable error. So the assertions below care most about the tool NOT going quiet.
//
//   node consonance/tools/sourced.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { scan, VALUE_PATTERNS, READING_TOOLS } = require('./sourced.js');

function transcript(turns) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sourced-'));
  const f = path.join(dir, 't.jsonl');
  const lines = [];
  for (const t of turns) {
    const content = [{ type: 'text', text: t.text }];
    for (const name of (t.tools || [])) content.push({ type: 'tool_use', name, id: 'x', input: {} });
    lines.push(JSON.stringify({ type: 'assistant', timestamp: '2026-07-29T00:00:00Z',
                                message: { content } }));
    lines.push(JSON.stringify({ type: 'user', timestamp: '2026-07-29T00:00:01Z',
                                message: { content: 'ok' } }));
  }
  fs.writeFileSync(f, lines.join('\n'));
  return f;
}

test('a value claim with no read is counted unsourced', () => {
  const f = transcript([{ text: 'The MCP server is on port 49948.', tools: [] }]);
  const r = scan(f);
  assert.strictEqual(r.total, 1);
  assert.strictEqual(r.unsourced, 1);
});

test('the same claim WITH a read in the same turn is sourced', () => {
  const f = transcript([{ text: 'The MCP server is on port 49948.', tools: ['Bash'] }]);
  assert.strictEqual(scan(f).sourced, 1);
});

test('Write and Edit do NOT count as consulting a source', () => {
  // The distinction the whole file rests on: producing is not verifying. A turn that only
  // writes has confirmed nothing, and scoring it sourced would make the number flattering.
  const f = transcript([{ text: 'The binary was built 2026-07-29 05:57.', tools: ['Write', 'Edit'] }]);
  const r = scan(f);
  assert.strictEqual(r.unsourced, 1, 'writing is not reading');
  assert.ok(!READING_TOOLS.has('Write') && !READING_TOOLS.has('Edit'));
});

test('prose without an asserted value is not counted at all', () => {
  // Guards against inflation: if ordinary sentences scored, the denominator would swamp the
  // signal and the rate would drift toward meaningless.
  const f = transcript([{ text: 'That framing seems right, and the mechanism is legible.', tools: [] }]);
  assert.strictEqual(scan(f).total, 0);
});

test('every declared pattern actually matches something — no dead detector', () => {
  // The quiet failure: a regex that never fires makes the tool report a clean session while
  // measuring nothing. Each pattern is pinned against a line drawn from a real miss this week.
  const samples = {
    port: 'the MCP server was on port 49948',
    count: 'the ico holds 10 images',
    timestamp: 'the binary was built 2026-07-29 05:57',
    state: 'the watcher is still armed',
    version: 'PIL available: 12.2.0',
    linecount: 'muscle_map.md is 1465 lines',
  };
  for (const p of VALUE_PATTERNS) {
    assert.ok(samples[p.name], `pattern ${p.name} has no sample — add one or delete the pattern`);
    assert.ok(p.re.test(samples[p.name]), `pattern ${p.name} matched nothing: dead detector`);
  }
});

test('a missing ~/.claude/projects exits 2 with a message, not an uncaught ENOENT', () => {
  // newestMain() used to readdirSync(PROJECTS) unguarded, so on any box without ~/.claude/projects
  // the tool crashed before reaching the "no transcript found" handler written for exactly that
  // case. Point HOME/USERPROFILE at an empty dir (os.homedir() reads these) and run with no --file.
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'sourced-nohome-'));
  const env = { ...process.env, USERPROFILE: home, HOME: home };
  let code = 0, stderr = '';
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'sourced.js')],
      { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    code = e.status;
    stderr = String(e.stderr || '');
  }
  assert.strictEqual(code, 2, 'the designed "no transcript" exit code, not a crash (1) or success (0)');
  assert.match(stderr, /no transcript found/, 'and the designed message');
  fs.rmSync(home, { recursive: true, force: true });
});

test('a real transcript produces a non-zero denominator', () => {
  // The end-to-end version of the same worry. If this ever reports 0 claims over a live
  // session, the tool has gone silent and the silence reads as a perfect score.
  const { scan: s, } = require('./sourced.js');
  const projects = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(projects)) return;
  let found = null;
  for (const d of fs.readdirSync(projects)) {
    const f = path.join(projects, d, '0c0c0c0a-0000-4000-8000-000000000a01.jsonl');
    if (fs.existsSync(f)) { found = f; break; }
  }
  if (!found) return;                       // other machine
  const r = s(found);
  assert.ok(r.total > 0, 'zero value-claims over a live session means the scanner died silently');
});
