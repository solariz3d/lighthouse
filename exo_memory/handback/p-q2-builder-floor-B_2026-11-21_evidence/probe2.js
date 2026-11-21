// B, Q2 (L223) Half B probe: which launch settings leave a tool's definition or a listing out of the request. One scratch seat per
// arm (a fresh folder, no room intake), the app's launch flags for a builder (--dangerously-skip-permissions, --settings with
// denyInsteadOfPrompting), `claude -p` with one short prompt, then the request as the transcript itself records it
// (`api-request-shape`: system + tools; `api-request-blob`: the messages). Bytes are model-independent; tokens use pane A's
// census ratio, 0.339 tokens a byte.   node probe.js <scratch root> [model]
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const ROOT = process.argv[2], MODEL = process.argv[3] || 'haiku';
const NOPROMPT = 'C:/Consonance/data/builder-no-prompt.settings.json';
const ARMS = [
  ['base (the builder launch of today)', [], null],
  ['--disallowedTools Skill', ['--disallowedTools', 'Skill'], null],
  ['--disallowedTools Skill Artifact', ['--disallowedTools', 'Skill', 'Artifact'], null],
];
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^CLAUDECODE$|^CLAUDE_CODE_/.test(k)));
const projDir = (cwd) => path.join(os.homedir(), '.claude', 'projects', cwd.replace(/[:\\/.]/g, '-'));
const rows = [];
ARMS.forEach(([name, flags, extra], i) => {
  const cwd = path.join(ROOT, 'arm' + i); fs.rmSync(cwd, { recursive: true, force: true }); fs.mkdirSync(cwd, { recursive: true });
  const settings = [NOPROMPT];
  if (extra) { const f = path.join(ROOT, 'arm' + i + '.settings.json'); fs.writeFileSync(f, JSON.stringify(extra)); settings.push(f); }
  const args = ['-p', 'Reply with the single word ok.', '--output-format', 'json', '--model', MODEL, '--dangerously-skip-permissions', ...settings.flatMap((s) => ['--settings', s]), ...flags];
  const r = spawnSync('claude', args, { cwd, env, encoding: 'utf8', timeout: 180000, shell: false });
  let usage = null; try { const j = JSON.parse(r.stdout); usage = j.usage; } catch { }
  const pd = projDir(cwd); const files = fs.existsSync(pd) ? fs.readdirSync(pd).filter((f) => f.endsWith('.jsonl')) : [];
  let shape = null, blob = null;
  for (const f of files) for (const l of fs.readFileSync(path.join(pd, f), 'utf8').split('\n')) {
    let v; try { v = JSON.parse(l); } catch { continue; }
    if (v.type === 'api-request-shape' && !shape) shape = v.shape;
    if (v.type === 'api-request-blob' && !blob) blob = v;
  }
  const tools = shape && Array.isArray(shape.tools) ? shape.tools : [];
  const toolBytes = Buffer.byteLength(JSON.stringify(tools));
  const blobText = blob ? JSON.stringify(blob) : '';
  const find = (re) => { const m = blobText.match(re); return m ? m[0].length : 0; };
  rows.push({
    arm: name, exit: r.status, transcript: files.length,
    tools: tools.map((t) => t.name).join(' '), toolCount: tools.length, toolBytes,
    skillsListing: /The following skills are available/.test(blobText), skillsBytes: find(/The following skills are available[\s\S]*?(?=(\\n)*<\/system-reminder>)/),
    agentListing: /Available agent types/.test(blobText) || /Available agent types/.test(JSON.stringify(shape || {})),
    artifactDeferred: /\bArtifact\b/.test(blobText),
    blobBytes: Buffer.byteLength(blobText), shapeBytes: Buffer.byteLength(JSON.stringify(shape || {})),
    usage: usage && { input: usage.input_tokens, cacheCreate: usage.cache_creation_input_tokens, cacheRead: usage.cache_read_input_tokens },
    err: r.status ? (r.stderr || '').slice(0, 300) : undefined,
  });
  console.log(JSON.stringify(rows[rows.length - 1]));
});
fs.writeFileSync(path.join(ROOT, 'probe_rows.json'), JSON.stringify(rows, null, 1));
