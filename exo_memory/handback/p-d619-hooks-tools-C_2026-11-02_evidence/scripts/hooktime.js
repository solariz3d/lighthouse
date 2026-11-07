// hooktime.js: wall time of each registered per-turn / per-call hook, run as Claude Code runs it (node <file>, payload on stdin), 5 times, median,
// with its data and shell dirs pointed at an empty scratch folder (CONSONANCE_DATA, CONSONANCE_SHELL_DIR) so no live ledger is written.
// Payloads are minimal and harmless (a Bash "echo" for the tool hooks; a short prompt / stop with no transcript). A lower bound: the real
// hooks also read the live transcript and ledgers. Baseline: `node -e 0`.
'use strict';
require('./winhide.js');
const cp = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'd619-hooks-')); const dataDir = path.join(tmp, 'data'), shellDir = path.join(tmp, 'shell'); fs.mkdirSync(dataDir); fs.mkdirSync(shellDir);
const H = 'C:/Users/nname/.claude/shell/', cwd = 'C:\\Consonance\\instances\\sibling-0845a868';
const tool = JSON.stringify({ hook_event_name: 'PreToolUse', session_id: 'd619-timing', cwd, tool_name: 'Bash', tool_input: { command: 'echo hi' } });
const post = JSON.stringify({ hook_event_name: 'PostToolUse', session_id: 'd619-timing', cwd, tool_name: 'Bash', tool_input: { command: 'echo hi' }, tool_response: { stdout: 'hi' } });
const prompt = JSON.stringify({ hook_event_name: 'UserPromptSubmit', session_id: 'd619-timing', cwd, prompt: 'ok', transcript_path: path.join(tmp, 'none.jsonl') });
const stop = JSON.stringify({ hook_event_name: 'Stop', session_id: 'd619-timing', cwd, stop_hook_active: false, transcript_path: path.join(tmp, 'none.jsonl') });
const rows = [
  ['baseline node -e 0', null, ''],
  ['PreToolUse push-gate', H + 'hooks/push-gate.js', tool], ['PreToolUse delete-gate', H + 'hooks/delete-gate.js', tool], ['PostToolUse release-chime', H + 'hooks/release-chime.js', post],
  ['UserPromptSubmit userprompt-submit', H + 'hooks/userprompt-submit.js', prompt], ['UserPromptSubmit findings-return', H + 'findings-return.js', prompt],
  ['UserPromptSubmit ask-surface', 'C:/Users/nname/Desktop/lighthouse/consonance/hooks/ask-surface.js', prompt], ['UserPromptSubmit ready-prompt', H + 'hooks/ready-prompt.js', prompt],
  ['Stop stop', H + 'hooks/stop.js', stop], ['Stop sourced-stop', H + 'sourced-stop.js', stop], ['Stop ready-stop', H + 'hooks/ready-stop.js', stop], ['Stop reply-slot', H + 'hooks/reply-slot.js', stop], ['Stop ask-ending', H + 'hooks/ask-ending.js', stop],
];
const env = { ...process.env, CONSONANCE_DATA: dataDir, CONSONANCE_SHELL_DIR: shellDir, CONSONANCE_READY_DIR: path.join(tmp, 'ready') };
for (const [name, f, payload] of rows) {
  const ms = [];
  let outLen = 0;
  for (let i = 0; i < 5; i++) { const t0 = process.hrtime.bigint(); const r = cp.spawnSync(process.execPath, f ? [f] : ['-e', '0'], { input: payload, env, encoding: 'utf8', timeout: 20000, cwd: tmp }); ms.push(Number(process.hrtime.bigint() - t0) / 1e6); outLen = (r.stdout || '').length; }
  ms.sort((a, b) => a - b); console.log(`${name}: median ${ms[2].toFixed(0)} ms (min ${ms[0].toFixed(0)}, max ${ms[4].toFixed(0)}); stdout ${outLen} chars`);
}
const left = []; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : left.push(path.relative(tmp, p)); } }; walk(tmp);
console.log('written into the scratch dirs: ' + (left.join(', ') || 'nothing'));
