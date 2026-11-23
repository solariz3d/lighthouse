// L215 probe: onFailure:"block" on a PreToolUse command hook. For each way a hook can fail, with and without the key, does the Bash call it guards run?
// Scoped --settings only (never the user's). The guarded command writes a marker file; a marker means the action went through.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'l215-')); const cwd = path.join(root, 'cwd'); fs.mkdirSync(cwd);
const bin = path.join(os.homedir(), '.local', 'bin', 'claude.exe');
const node = process.execPath.replace(/\\/g, '/');
const crash = path.join(root, 'crash.js').replace(/\\/g, '/'); fs.writeFileSync(crash, 'process.exit(1);');
const hang = path.join(root, 'hang.js').replace(/\\/g, '/'); fs.writeFileSync(hang, 'setInterval(()=>{},1000);');
const exit2 = path.join(root, 'exit2.js').replace(/\\/g, '/'); fs.writeFileSync(exit2, 'process.stderr.write("refused by probe");process.exit(2);');
const ok = path.join(root, 'ok.js').replace(/\\/g, '/'); fs.writeFileSync(ok, 'process.exit(0);');
const variants = {
  'cannot start (no such program)': { command: '"C:/no/such/program.exe" x', timeout: 5 },
  'crashes (exit 1)': { command: `"${node}" "${crash}"`, timeout: 5 },
  'hangs past its timeout (2 s)': { command: `"${node}" "${hang}"`, timeout: 2 },
  'refuses (exit 2), the control': { command: `"${node}" "${exit2}"`, timeout: 5 },
  'allows (exit 0), the control': { command: `"${node}" "${ok}"`, timeout: 5 },
};
const only = process.argv[2];
for (const [name, base] of Object.entries(variants)) {
  if (only && !name.startsWith(only)) continue;
  for (const key of [false, true]) {
    const marker = path.join(root, 'marker-' + Math.random().toString(36).slice(2) + '.txt').replace(/\\/g, '/');
    const hook = { type: 'command', ...base, ...(key ? { onFailure: 'block' } : {}) };
    const settings = path.join(root, 's.json'); fs.writeFileSync(settings, JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [hook] }] } }));
    const t0 = Date.now();
    const r = spawnSync(bin, ['-p', `Run exactly this one bash command and nothing else: echo hi > "${marker}"`, '--model', 'haiku', '--settings', settings, '--setting-sources', 'project', '--strict-mcp-config', '--permission-mode', 'bypassPermissions', '--allowedTools', 'Bash'], { cwd, encoding: 'utf8', timeout: 120000 });
    console.log(`${name.padEnd(34)} onFailure:${key ? 'block' : '-----'}  action ${fs.existsSync(marker) ? 'WENT THROUGH' : 'REFUSED    '}  (${Math.round((Date.now() - t0) / 1000)} s, rc ${r.status})  ${String(r.stdout).replace(/\s+/g, ' ').slice(0, 110)}`);
  }
}
fs.rmSync(root, { recursive: true, force: true });
