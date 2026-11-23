// probe_parse.js (B, L216 R1/R3): under bypassPermissions (what --dangerously-skip-permissions sets), which command shapes still raise
// the "can't be sure it read this command the way the shell will" check, and does permissions.denyInsteadOfPrompting deny it?
// A stream-json host (--permission-prompt-tool stdio) counts each prompt and answers NO. Scoped --settings only. A's probe_deny.js, adapted.
//   node probe_parse.js <phase>   phase "find": three shapes, setting off; phase "deny": the shape given by --shape N, setting off then on
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const bin = path.join(os.homedir(), '.local', 'bin', 'claude.exe');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'l216p-')); const cwd = path.join(root, 'cwd'); fs.mkdirSync(cwd);
const shapes = [
  "cat > probe.js <<'EOF'\nconst k = setTimeout(() => { child.kill(); res('hung'); }, 8000);\nEOF\nnode --version",
  "cat > probe.txt <<'EOF'\nit's here\nEOF\nrm -f probe.txt",
  'd=$(pwd)/probe.txt; touch "$d"; rm -f "$d"',
  fs.readFileSync(path.join(__dirname, 'shape3.txt'), 'utf8'),
];
const out = [];
async function run(name, cmd, deny) {
  const f = path.join(root, 's.json'); fs.writeFileSync(f, JSON.stringify({ permissions: { denyInsteadOfPrompting: deny } }));
  const args = ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose', '--model', 'haiku', '--settings', f, '--setting-sources', 'project',
    '--strict-mcp-config', '--permission-mode', 'bypassPermissions', '--permission-prompt-tool', 'stdio'];
  const c = spawn(bin, args, { cwd });
  let prompts = 0, ran = 0, toolResult = '', promptText = '', buf = '';
  c.stdout.on('data', (d) => {
    buf += d; let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i); buf = buf.slice(i + 1);
      let j; try { j = JSON.parse(line); } catch (_) { continue; }
      if (j.type === 'control_request' && j.request && j.request.subtype === 'can_use_tool') {
        prompts++; promptText = JSON.stringify(j.request).slice(0, 400);
        c.stdin.write(JSON.stringify({ type: 'control_response', response: { subtype: 'success', request_id: j.request_id, response: { behavior: 'deny', message: 'probe host denied' } } }) + '\n');
      }
      if (j.type === 'assistant' && j.message && Array.isArray(j.message.content)) for (const b of j.message.content) if (b.type === 'tool_use' && b.name === 'Bash') ran++;
      if (j.type === 'user' && j.message && Array.isArray(j.message.content)) for (const b of j.message.content) if (b.type === 'tool_result') toolResult = String(typeof b.content === 'string' ? b.content : JSON.stringify(b.content)).replace(/\s+/g, ' ').slice(0, 300);
    }
  });
  c.stdin.write(JSON.stringify({ type: 'user', message: { role: 'user', content: 'Make exactly one Bash tool call whose command is the text between the markers, verbatim, then stop.\n<<<\n' + cmd + '\n>>>' } }) + '\n');
  const done = await new Promise((res) => { const k = setTimeout(() => { c.kill(); res('timeout'); }, 120000); c.on('exit', () => { clearTimeout(k); res('exit'); }); setTimeout(() => c.stdin.end(), 60000); });
  const line = `${name}: Bash calls ${ran}, host asked ${prompts}x, tool result: ${toolResult || '(none)'} [${done}]${promptText ? `\n    the prompt: ${promptText}` : ''}`;
  console.log(line); out.push(line);
}
(async () => {
  const phase = process.argv[2] || 'find';
  if (phase === 'find') for (let n = 0; n < shapes.length; n++) await run(`shape ${n}, setting off`, shapes[n], false);
  else { const n = Number(process.argv[process.argv.indexOf('--shape') + 1]); await run(`shape ${n}, setting off`, shapes[n], false); await run(`shape ${n}, setting ON `, shapes[n], true); }
  fs.rmSync(root, { recursive: true, force: true });
})();
