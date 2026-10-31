// probe-run.js (D454 part 3, pane E): run every hook registered in <hookHome>\.claude\settings.json once per event, with a synthetic payload, under
// fsprobe (node) or sitecustomize (python), and write what each one touched to <out>.jsonl.
//   node probe-run.js <hookHome> <mode> <out>
// mode "machine": the env as it is (this machine's USERPROFILE and ~/.consonance.json); NO write anywhere is made, and reads under his ~/.claude
//   and C:\Consonance\data are refused, so the path a hook tries is the evidence and none of his files is opened.
// mode "scratch": USERPROFILE = HOME = <hookHome>; writes allowed under <hookHome> only; CONSONANCE_* unset.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [hookHome, mode, out] = process.argv.slice(2);
if (!hookHome || !/^(machine|scratch)$/.test(mode || '') || !out) { console.error('usage: probe-run.js <hookHome> machine|scratch <out>'); process.exit(2); }
const P = __dirname;
const settings = JSON.parse(fs.readFileSync(path.join(hookHome, '.claude', 'settings.json'), 'utf8').replace(/^\uFEFF/, ''));
const work = path.join(P, 'work-' + path.basename(out)); fs.mkdirSync(work, { recursive: true });
const transcript = path.join(work, 'transcript.jsonl');
fs.writeFileSync(transcript, [
  { type: 'user', message: { role: 'user', content: 'hello' }, timestamp: '2026-10-25T04:00:00.000Z', sessionId: 'probe-0001' },
  { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'ok' }] }, timestamp: '2026-10-25T04:00:05.000Z', sessionId: 'probe-0001' },
].map((r) => JSON.stringify(r)).join('\n') + '\n');
const cwd = path.join(work, 'cwd'); fs.mkdirSync(cwd, { recursive: true });
const base = { session_id: 'probe-0001', transcript_path: transcript, cwd };
const payloads = {
  SessionStart: [{ ...base, hook_event_name: 'SessionStart', source: 'startup' }],
  UserPromptSubmit: [{ ...base, hook_event_name: 'UserPromptSubmit', prompt: 'hello' }],
  PreToolUse: [
    { ...base, hook_event_name: 'PreToolUse', tool_name: 'mcp__consonance__call_librarian', tool_input: { text: 'a pointer with no sources line' } },
    { ...base, hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'git push origin main' } },
    { ...base, hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'rm -rf C:/probe-nothing-here' } },
  ],
  PostToolUse: [{ ...base, hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'git push origin main' }, tool_response: { stdout: 'To github.com:x/y.git\n   1111111..2222222  main -> main', stderr: '', interrupted: false } }],
  Stop: [{ ...base, hook_event_name: 'Stop', stop_hook_active: false }],
  SessionEnd: [{ ...base, hook_event_name: 'SessionEnd', reason: 'exit' }],
  PreCompact: [{ ...base, hook_event_name: 'PreCompact', trigger: 'manual', custom_instructions: '' }],
};
const realHome = process.env.USERPROFILE;
const env0 = { ...process.env, NODE_OPTIONS: '--require ' + path.join(P, 'fsprobe.js').split(path.sep).join('/'), PYTHONPATH: path.join(P, 'py') };
let env;
if (mode === 'machine') env = { ...env0, PROBE_ALLOW: '', PROBE_DENYREAD: [path.join(realHome, '.claude'), 'C:\\Consonance\\data'].join(';') };
else {
  env = { ...env0, USERPROFILE: hookHome, HOME: hookHome, PROBE_ALLOW: hookHome, PROBE_DENYREAD: '' };
  for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
}
const parse = (cmd) => { const m = cmd.match(/"([^"]+)"|(\S+)/g) || []; return m.map((x) => x.replace(/^"|"$/g, '')); };
fs.writeFileSync(out, '');
for (const [event, groups] of Object.entries(settings.hooks || {})) {
  for (const g of groups) for (const h of g.hooks || []) {
    const argv = parse(h.command); const script = argv[1] || argv[0];
    for (const pl of payloads[event] || [{ ...base, hook_event_name: event }]) {
      const log = path.join(work, 'log-' + Date.now() + '-' + Math.random().toString(16).slice(2) + '.jsonl');
      const r = spawnSync(argv[0], argv.slice(1), { input: JSON.stringify(pl), encoding: 'utf8', env: { ...env, PROBE_LOG: log }, cwd, timeout: 30000, windowsHide: true });
      const rows = fs.existsSync(log) ? fs.readFileSync(log, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (_) { return { bad: l }; } }) : [];
      fs.appendFileSync(out, JSON.stringify({ event, script, tool: pl.tool_name || null, status: r.status, signal: r.signal, timedOut: !!(r.error && r.error.code === 'ETIMEDOUT'),
        stdout: (r.stdout || '').slice(0, 1500), stderr: (r.stderr || '').slice(0, 1500), rows }) + '\n');
    }
  }
}
console.log('wrote', out);
