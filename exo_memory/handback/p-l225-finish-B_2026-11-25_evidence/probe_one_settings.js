// probe_one_settings.js (B, L225, the repair after pane A's read p-l225-A-read-B_2026-11-25.md). ONE run per arm, and in the SAME
// run both observables:
//   (1) no-prompt: a Bash call Claude Code's own safety check would ask about (L216's shape 3, A's 8,369-char heredoc) is DENIED,
//       not prompted. A stream-json host (--permission-prompt-tool stdio) counts each prompt and answers no (L216's probe_app.js).
//   (2) the floor: the skills listing is short and Artifact is absent, read from the same run's transcript
//       (api-request-shape: tools; api-request-blob: the listings).
// The arms are the spawn's settings arguments in the spawn's order, then --dangerously-skip-permissions:
//   two-files: A's defect, the build at 57ab412a (--settings <no-prompt> --settings <floor> --disallowedTools Artifact)
//   one-file:  the repair (--settings <the combined file> --disallowedTools Artifact); its text is read out of main.rs
//              (BUILDER_LAUNCH_SETTINGS), so the probe runs the built text, not a copy
//   none:      no settings, no flag (the launch before L216)
//   node probe_one_settings.js <main.rs> <scratch root> [model]
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const [MAIN_RS, ROOT, MODEL = 'haiku'] = process.argv.slice(2);
const src = fs.readFileSync(MAIN_RS, 'utf8');
const konst = (n) => { const m = src.match(new RegExp('const ' + n + ': &str = r#"(.*?)"#;')); if (!m) throw new Error('no ' + n); return m[1]; };
const NO_PROMPT = konst('NO_PROMPT_SETTINGS'), FLOOR = konst('FLOOR_LAUNCH_SETTINGS'), BOTH = konst('BUILDER_LAUNCH_SETTINGS');
const SHAPE3 = fs.readFileSync(path.join(__dirname, '..', 'p-l216-no-prompt-B_2026-11-21_evidence', 'shape3.txt'), 'utf8');
const bin = path.join(os.homedir(), '.local', 'bin', 'claude.exe');
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^CLAUDECODE$|^CLAUDE_CODE_/.test(k)));
const projDir = (cwd) => path.join(os.homedir(), '.claude', 'projects', cwd.replace(/[:\\/.]/g, '-'));
fs.mkdirSync(ROOT, { recursive: true });
const file = (name, text) => { const f = path.join(ROOT, name); fs.writeFileSync(f, text); return f; };
const ARMS = [
  ['two-files (57ab412a)', ['--settings', file('builder-no-prompt.settings.json', NO_PROMPT), '--settings', file('builder-floor.settings.json', FLOOR), '--disallowedTools', 'Artifact']],
  ['one-file (the repair)', ['--settings', file('builder-launch.settings.json', BOTH), '--disallowedTools', 'Artifact']],
  ['one-file without --disallowedTools', ['--settings', path.join(ROOT, 'builder-launch.settings.json')]],
  ['floor file alone', ['--settings', path.join(ROOT, 'builder-floor.settings.json')]],
  ['no-prompt file alone (L216, its control)', ['--settings', path.join(ROOT, 'builder-no-prompt.settings.json')]],
  ['two-files reversed (floor first: does the LAST one win?)', ['--settings', path.join(ROOT, 'builder-floor.settings.json'), '--settings', path.join(ROOT, 'builder-no-prompt.settings.json'), '--disallowedTools', 'Artifact']],
  ['none (before L216)', []],
];
function listings(cwd) {
  const pd = projDir(cwd); if (!fs.existsSync(pd)) return { err: 'no transcript folder' };
  let tools = null; const texts = [];
  for (const f of fs.readdirSync(pd).filter((f) => f.endsWith('.jsonl')))
    for (const l of fs.readFileSync(path.join(pd, f), 'utf8').split('\n')) {
      let v; try { v = JSON.parse(l); } catch { continue; }
      if (v.type === 'api-request-shape' && !tools) tools = (v.shape && v.shape.tools) || [];
      if (v.type === 'api-request-blob') { const c = v.message.content; for (const b of Array.isArray(c) ? c : [{ text: c }]) if (b && b.text) texts.push(b.text); }
    }
  const sec = (re) => { let n = 0, on = false; for (const t of texts) for (const line of t.split('\n')) { if (/^(The following [a-z ]+|Available agent types|# [A-Z]|Contents of |SessionStart hook)/.test(line)) on = re.test(line); if (on) n += Buffer.byteLength(line) + 1; } return n; };
  const all = texts.join('\n');
  return {
    skillsListing: sec(/^The following skills/), deferredListing: sec(/^The following deferred tools/),
    artifactTool: (tools || []).some((t) => t.name === 'Artifact'), artifactLine: /^Artifact\b/m.test(all),
  };
}
async function run(name, flags, i) {
  const cwd = path.join(ROOT, 'arm' + i); fs.rmSync(cwd, { recursive: true, force: true }); fs.mkdirSync(cwd);
  fs.rmSync(projDir(cwd), { recursive: true, force: true });   // this arm's own transcript folder, so an earlier run is never read with it
  const args = ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose', '--model', MODEL,
    ...flags, '--dangerously-skip-permissions', '--strict-mcp-config', '--permission-prompt-tool', 'stdio'];   // no --setting-sources: the app passes none, and the user's skills must be listed
  const c = spawn(bin, args, { cwd, env });
  let prompts = 0, bash = 0, toolResult = '', buf = '';
  c.stdout.on('data', (d) => {
    buf += d; let k;
    while ((k = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, k); buf = buf.slice(k + 1);
      let j; try { j = JSON.parse(line); } catch (_) { continue; }
      if (j.type === 'control_request' && j.request && j.request.subtype === 'can_use_tool') {
        prompts++;
        c.stdin.write(JSON.stringify({ type: 'control_response', response: { subtype: 'success', request_id: j.request_id, response: { behavior: 'deny', message: 'probe host denied' } } }) + '\n');
      }
      if (j.type === 'assistant' && j.message && Array.isArray(j.message.content)) for (const b of j.message.content) if (b.type === 'tool_use' && b.name === 'Bash') bash++;
      if (j.type === 'user' && j.message && Array.isArray(j.message.content)) for (const b of j.message.content) if (b.type === 'tool_result') toolResult = String(typeof b.content === 'string' ? b.content : JSON.stringify(b.content)).replace(/\s+/g, ' ').slice(0, 160);
    }
  });
  c.stdin.write(JSON.stringify({ type: 'user', message: { role: 'user', content: 'Make exactly one Bash tool call whose command is the text between the markers, verbatim, then stop.\n<<<\n' + SHAPE3 + '\n>>>' } }) + '\n');
  const done = await new Promise((res) => { const t = setTimeout(() => { c.kill(); res('timeout'); }, 150000); c.on('exit', () => { clearTimeout(t); res('exit'); }); setTimeout(() => c.stdin.end(), 75000); });
  const flagText = flags.map((f) => (f.startsWith(path.resolve(ROOT)) ? '<' + path.basename(f) + '>' : f)).join(' ');
  return { name, cwd, line: `${name}: flags [${flagText} --dangerously-skip-permissions] | Bash calls ${bash}, host asked ${prompts}x, tool result: ${toolResult || '(none)'} [${done}]` };
}
(async () => {
  console.log(`model ${MODEL}; combined file text (from main.rs): ${BOTH}`);
  const done = []; for (let i = 0; i < ARMS.length; i++) done.push(await run(ARMS[i][0], ARMS[i][1], i));
  await new Promise((res) => setTimeout(res, 15000));   // a transcript lands a few seconds after its process ends (seen: read at exit, 0 B)
  for (const d of done) { const L = listings(d.cwd); console.log(`${d.line} | skills listing ${L.skillsListing} B, deferred listing ${L.deferredListing} B, Artifact tool ${L.artifactTool}, Artifact line ${L.artifactLine}${L.err ? ' ' + L.err : ''}`); }
})();
