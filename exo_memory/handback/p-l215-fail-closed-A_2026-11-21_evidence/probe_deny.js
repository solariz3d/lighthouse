// L215 probe: permissions.denyInsteadOfPrompting. A host that answers permission prompts (stream-json, --permission-prompt-tool stdio) counts the prompts it is
// asked; with the setting the call should be denied without asking. Variants: a plain call that needs permission, and a call a PreToolUse hook ASKS about
// (the dispatch gate asks on purpose). Scoped --settings only.
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const bin = path.join(os.homedir(), '.local', 'bin', 'claude.exe');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'l215d-')); const cwd = path.join(root, 'cwd'); fs.mkdirSync(cwd);
const node = process.execPath.replace(/\\/g, '/');
const askJs = path.join(root, 'ask.js').replace(/\\/g, '/');
fs.writeFileSync(askJs, 'process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:"probe ask"}}));');
const variants = [
  ['plain call, setting off', { permissions: { denyInsteadOfPrompting: false } }],
  ['plain call, setting ON ', { permissions: { denyInsteadOfPrompting: true } }],
  ['hook asks, setting off ', { permissions: { denyInsteadOfPrompting: false }, hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: `"${node}" "${askJs}"` }] }] } }],
  ['hook asks, setting ON  ', { permissions: { denyInsteadOfPrompting: true }, hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: `"${node}" "${askJs}"` }] }] } }],
];
async function run(name, settingsObj) {
  const f = path.join(root, 's.json'); fs.writeFileSync(f, JSON.stringify(settingsObj));
  const marker = path.join(root, 'm' + Math.random().toString(36).slice(2) + '.txt').replace(/\\/g, '/');
  const args = ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose', '--model', 'haiku', '--settings', f, '--setting-sources', 'project', '--strict-mcp-config', '--permission-mode', 'default', '--permission-prompt-tool', 'stdio'];
  const c = spawn(bin, args, { cwd });
  let prompts = 0, toolResult = '', buf = '';
  c.stdout.on('data', (d) => {
    buf += d; let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i); buf = buf.slice(i + 1);
      let j; try { j = JSON.parse(line); } catch (_) { continue; }
      if (j.type === 'control_request' && j.request && j.request.subtype === 'can_use_tool') {
        prompts++;
        c.stdin.write(JSON.stringify({ type: 'control_response', response: { subtype: 'success', request_id: j.request_id, response: { behavior: 'deny', message: 'probe host denied' } } }) + '\n');
      }
      if (j.type === 'user' && j.message && Array.isArray(j.message.content)) for (const b of j.message.content) if (b.type === 'tool_result') toolResult = String(typeof b.content === 'string' ? b.content : JSON.stringify(b.content)).replace(/\s+/g, ' ').slice(0, 200);
    }
  });
  c.stdin.write(JSON.stringify({ type: 'user', message: { role: 'user', content: `Run exactly this one bash command and nothing else: echo hi > "${marker}"` } }) + '\n');
  const done = await new Promise((res) => { const k = setTimeout(() => { c.kill(); res('timeout'); }, 90000); c.on('exit', () => { clearTimeout(k); res('exit'); }); setTimeout(() => c.stdin.end(), 45000); });
  console.log(`${name}  host was asked ${prompts}x  ran: ${fs.existsSync(marker)}  tool result: ${toolResult || '(none)'}  [${done}]`);
}
(async () => { for (const [n, s] of variants) await run(n, s); fs.rmSync(root, { recursive: true, force: true }); })();
