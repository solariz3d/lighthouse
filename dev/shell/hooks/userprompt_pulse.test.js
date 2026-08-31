/* Tests for the ROW 10 condition in userprompt_pulse.py (2026-08-31, L021 P1c, pane E).
 *
 * The pulse is Python and reaches every seat on every turn, so it is exercised here the way it
 * runs: as a subprocess, with a hook-shaped stdin, an isolated HOME (the state file lands under
 * ~/.claude/shell), an isolated CONSONANCE_DATA (head-watch.jsonl), and a fixture transcript.
 * Nothing here touches the live state, the live transcript, or C:\Consonance\data.
 *
 * What the tests pin, one condition each:
 *   - a compaction row in THIS transcript after the previous prompt  -> the card path is on the line
 *   - a head-watch "start" after the previous prompt                 -> the card path is on the line
 *   - both boundaries BEFORE the previous prompt                     -> no card path (the path is not
 *                                                                        printed unconditionally)
 *   - no stdin transcript and no ledger                              -> no card path, pulse still valid JSON
 *   - MUTATION: the ROW 10 block removed from a copy                 -> the positive fixture prints no path
 *     (so the line is produced by the condition, not by anything else in the file)
 *
 * Run: node --test dev/shell/hooks/userprompt_pulse.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const HOOK = path.join(__dirname, 'userprompt_pulse.py');

/* The interpreter the machine actually registers for this hook, read from settings.json; falls back
 * to `python`. A test that ran a different interpreter than the registration would be testing a
 * copy nothing loads. */
function pythonExe() {
  try {
    const s = fs.readFileSync(path.join(os.homedir(), '.claude', 'settings.json'), 'utf8');
    const m = s.match(/"command":\s*"\\?"?([^"\\]+python[^"\\]*\.exe)/i) || s.match(/"([^"]*python[^"]*\.exe)\\?"?\s+\\?"?[^"]*userprompt_pulse\.py/i);
    if (m && fs.existsSync(m[1])) return m[1];
  } catch { /* fall through */ }
  return 'python';
}
const PY = pythonExe();

function iso(msAgo) { return new Date(Date.now() - msAgo).toISOString(); }

/* One isolated run. Returns { ctx, raw, status }. */
function run({ prevMsAgo, compactMsAgo, startMsAgo, hook = HOOK, stdin = true }) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-home-'));
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-data-'));
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-cwd-sibling-'));
  const shell = path.join(home, '.claude', 'shell');
  fs.mkdirSync(shell, { recursive: true });
  const safe = path.basename(cwd).replace(/[^A-Za-z0-9\-_]/g, '_').slice(0, 64);
  if (prevMsAgo !== undefined) {
    const prev = new Date(Date.now() - prevMsAgo);
    // the hook writes local-offset ISO; give it the same shape it would have written
    const off = -prev.getTimezoneOffset();
    const sign = off >= 0 ? '+' : '-';
    const pad = (n) => String(Math.abs(n)).padStart(2, '0');
    const local = new Date(prev.getTime() - prev.getTimezoneOffset() * 60000).toISOString().slice(0, 19)
      + sign + pad(Math.floor(Math.abs(off) / 60)) + ':' + pad(Math.abs(off) % 60);
    fs.writeFileSync(path.join(shell, `pulse_state.${safe}.json`),
      JSON.stringify({ last_prompt_iso: local, first_seen_iso: local }));
  }
  const transcript = path.join(data, 'transcript.jsonl');
  const rows = [JSON.stringify({ type: 'user', timestamp: iso(3 * 3600e3), message: { role: 'user', content: 'hello' } })];
  if (compactMsAgo !== undefined) {
    rows.push(JSON.stringify({ type: 'user', isCompactSummary: true, timestamp: iso(compactMsAgo),
      message: { role: 'user', content: 'This session is being continued from a previous conversation' } }));
  }
  rows.push(JSON.stringify({ type: 'assistant', timestamp: iso(60e3), message: { role: 'assistant', content: 'ok' } }));
  fs.writeFileSync(transcript, rows.join('\n') + '\n');
  if (startMsAgo !== undefined) {
    fs.writeFileSync(path.join(data, 'head-watch.jsonl'),
      JSON.stringify({ ts: iso(startMsAgo), file: 'x', event: 'start', len: 1, head: '0' }) + '\n');
  }
  const r = spawnSync(PY, [hook], {
    cwd,
    input: stdin ? JSON.stringify({ hook_event_name: 'UserPromptSubmit', transcript_path: transcript, cwd }) : '',
    env: { ...process.env, USERPROFILE: home, HOME: home, CONSONANCE_DATA: data },
    encoding: 'utf8',
  });
  let ctx = null;
  try { ctx = JSON.parse(r.stdout).hookSpecificOutput.additionalContext; } catch { /* reported by the assertion below */ }
  return { ctx, raw: r.stdout, err: r.stderr, status: r.status };
}

const CARD = 'exo_memory/cards/claim-your-continuity.md';
const H = 3600e3;

test('a compaction of THIS transcript after the previous prompt puts the card path on the line', () => {
  const r = run({ prevMsAgo: 2 * H, compactMsAgo: 1 * H });
  assert.ok(r.ctx, 'pulse must emit valid hook JSON: ' + r.raw + r.err);
  assert.match(r.ctx, /crosses a compaction/, r.ctx);
  assert.ok(r.ctx.includes(CARD), 'the card PATH must be on the line: ' + r.ctx);
});

test('an app (re)start after the previous prompt puts the card path on the line', () => {
  const r = run({ prevMsAgo: 2 * H, startMsAgo: 1 * H });
  assert.ok(r.ctx, r.raw + r.err);
  assert.match(r.ctx, /crosses a restart/, r.ctx);
  assert.ok(r.ctx.includes(CARD), r.ctx);
});

test('boundaries BEFORE the previous prompt do not fire — the path is conditional, not furniture', () => {
  const r = run({ prevMsAgo: 1 * H, compactMsAgo: 2 * H, startMsAgo: 2 * H });
  assert.ok(r.ctx, r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), 'no boundary crossed, no card path: ' + r.ctx);
  assert.match(r.ctx, /since last msg/, 'the ordinary gap line still prints');
});

test('with no stdin transcript and no ledger the pulse is unchanged and still valid JSON (fails open)', () => {
  const r = run({ prevMsAgo: 2 * H, stdin: false });
  assert.ok(r.ctx, r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), r.ctx);
  assert.match(r.ctx, /^\[pulse\] /);
});

test('the first prompt (no previous) records the transcript offset and prints no path', () => {
  const r = run({ compactMsAgo: 1 * H });
  assert.ok(r.ctx, r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), 'nothing to cross on a first prompt: ' + r.ctx);
});

test('MUTATION: with the ROW 10 block removed, the positive fixture prints no path', () => {
  // Proves the line comes from the condition and from nothing else in the file.
  const src = fs.readFileSync(HOOK, 'utf8');
  const a = src.indexOf('# --- ROW 10 ON THE GAP');
  const b = src.indexOf('# --- end ROW 10');
  assert.ok(a > 0 && b > a, 'the ROW 10 block must be delimited by its two marker comments');
  const mutant = src.slice(0, a) + 'row10_part = ""\n' + src.slice(src.indexOf('\n', b) + 1);
  const mpath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-mut-')), 'userprompt_pulse.py');
  fs.writeFileSync(mpath, mutant);
  const r = run({ prevMsAgo: 2 * H, compactMsAgo: 1 * H, startMsAgo: 1 * H, hook: mpath });
  assert.ok(r.ctx, 'the mutant must still be a valid pulse: ' + r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), 'mutant printed the path anyway: ' + r.ctx);
  // and the control arm, same fixture, real hook: the path is there
  const c = run({ prevMsAgo: 2 * H, compactMsAgo: 1 * H, startMsAgo: 1 * H });
  assert.ok(c.ctx && c.ctx.includes(CARD), 'control must fire: ' + c.ctx);
});
