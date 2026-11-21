// agent-first-call.js (L214, pane A): R2 as a command. A reader agent started the new way (dev/shell/agents/room-reader.md: omitClaudeMd, a named
// lower effort) against the same agent started the old way (the same definition WITHOUT omitClaudeMd), in a scratch folder whose CLAUDE.md is the
// size of an intake. Prints each agent's first call: input + cache tokens, from the agent's own transcript under the session's subagents folder.
//   node consonance/tools/agent-first-call.js [--kb 100] [--model haiku]
// It runs `claude -p` twice on a small model (a few cents), in an OS temp folder, with --setting-sources project and no MCP: nothing of the user's
// settings, and nothing of the room, is read or changed.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const AGENT = path.join(__dirname, '..', '..', 'dev', 'shell', 'agents', 'room-reader.md');

function parseAgent(text) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(String(text).replace(/\r\n/g, '\n'));
  if (!m) throw new Error('no frontmatter');
  const fm = {};
  for (const line of m[1].split('\n')) { const k = /^([A-Za-z]+):\s*(.*)$/.exec(line); if (k) fm[k[1]] = k[2].trim(); }
  return { fm, prompt: m[2].trim() };
}

/** The --agents JSON for the definition; `omit` overrides omitClaudeMd, `model` the model. Pure. */
function agentsJson(def, { omit, model } = {}) {
  const tools = def.fm.tools ? def.fm.tools.split(',').map((s) => s.trim()) : undefined;
  const o = { description: def.fm.description, prompt: def.prompt, tools, model: model || def.fm.model, omitClaudeMd: omit === undefined ? def.fm.omitClaudeMd === 'true' : omit };
  return JSON.stringify({ [def.fm.name]: o });
}

function firstCall(dir, sessionId) {
  const root = path.join(os.homedir(), '.claude', 'projects');
  for (const d of fs.readdirSync(root)) {
    const sd = path.join(root, d, sessionId, 'subagents');
    if (!fs.existsSync(sd)) continue;
    for (const f of fs.readdirSync(sd).filter((x) => x.endsWith('.jsonl'))) {
      for (const line of fs.readFileSync(path.join(sd, f), 'utf8').split('\n')) {
        let r; try { r = JSON.parse(line); } catch (_) { continue; }
        const u = r && r.type === 'assistant' && r.message && r.message.usage;
        if (u) return { input: u.input_tokens || 0, cache_write: u.cache_creation_input_tokens || 0, cache_read: u.cache_read_input_tokens || 0, effort: /"effort":"([a-z]+)"/.exec(fs.readFileSync(path.join(sd, f), 'utf8')) };
      }
    }
  }
  return null;
}

function run(def, dir, opts) {
  const bin = process.env.CLAUDE_BIN || (fs.existsSync(path.join(os.homedir(), '.local', 'bin', 'claude.exe')) ? path.join(os.homedir(), '.local', 'bin', 'claude.exe') : 'claude');   // no shell: the --agents JSON must reach claude unquoted-by-cmd
  const r = spawnSync(bin, ['-p', `Use the ${def.fm.name} agent once, then say done.`, '--model', opts.model, '--agents', agentsJson(def, opts), '--setting-sources', 'project', '--strict-mcp-config', '--output-format', 'json'],
    { cwd: dir, encoding: 'utf8', timeout: 240000 });
  if (r.status !== 0) throw new Error('claude exited ' + r.status + ': ' + String(r.stderr).slice(0, 200));
  const j = JSON.parse(r.stdout);
  return firstCall(dir, j.session_id);
}

if (require.main === module) {
  const a = process.argv.slice(2), opt = (n, d) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : d; };
  const kb = Number(opt('--kb', '100')), model = opt('--model', 'haiku');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-first-call-'));
  let s = '# Scratch intake\n'; for (let i = 0; s.length < kb * 1000; i++) s += `Line ${i}: the room keeps its notes and never loses a thread of the work in flight; lorem ipsum dolor sit amet.\n`;
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), s);
  const def = parseAgent(fs.readFileSync(AGENT, 'utf8'));
  const old = run(def, dir, { omit: false, model }), neu = run(def, dir, { omit: true, model });
  const tot = (x) => x.input + x.cache_write + x.cache_read;
  console.log(`scratch CLAUDE.md ${kb} KB, model ${model}`);
  console.log(`old way (the room-reader definition without omitClaudeMd): first call carries ${tot(old)} tokens (in ${old.input}, cache write ${old.cache_write}, cache read ${old.cache_read})`);
  console.log(`new way (omitClaudeMd): first call carries ${tot(neu)} tokens (in ${neu.input}, cache write ${neu.cache_write}, cache read ${neu.cache_read})`);
  console.log(`difference: ${tot(old) - tot(neu)} tokens fewer`);
  fs.rmSync(dir, { recursive: true, force: true });
  process.exit(tot(neu) < tot(old) ? 0 : 1);
}
module.exports = { parseAgent, agentsJson, AGENT };
