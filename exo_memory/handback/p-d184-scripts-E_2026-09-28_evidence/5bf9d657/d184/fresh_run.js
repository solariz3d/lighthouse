// D184, B: the FRESH-SESSION test. A new Claude Code session in b-d184-wt (8868531 + the skill's 24 files), given ONLY the
// prompt in fresh_prompt.txt. Isolation: --setting-sources project,local (no user settings, so no user hooks and no room
// digests), --strict-mcp-config (no MCP servers, so no board), a new worktree path (no project memory exists for it), no
// session persistence. The whole session runs inside ONE hold of the heavy-run lock; its node children inherit the token
// (re-entrant) and NODE_OPTIONS=--max-old-space-size=4096. The full stream-json transcript is kept.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HERE = __dirname, WT = 'C:/Users/nname/AppData/Local/Temp/b-d184-wt';
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane B: D184 fresh-session skill test (claude -p in b-d184-wt, its node runs nested)' });
const prompt = fs.readFileSync(path.join(HERE, 'fresh_prompt.txt'), 'utf8');
const args = ['-p', prompt, '--setting-sources', 'project,local', '--strict-mcp-config', '--no-session-persistence',
  '--permission-mode', 'bypassPermissions', '--disallowedTools', 'Bash(git commit*)', 'Bash(git push*)', 'WebFetch', 'WebSearch',
  '--output-format', 'stream-json', '--verbose'];
fs.writeFileSync(path.join(HERE, 'fresh_args.json'), JSON.stringify(args.map((a) => (a === prompt ? '<fresh_prompt.txt>' : a)), null, 1));
const t0 = Date.now();
const r = spawnSync('C:/Users/nname/.local/bin/claude.exe', args, { cwd: WT, env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }, encoding: 'utf8', maxBuffer: 1 << 29, timeout: 45 * 60 * 1000 });
fs.writeFileSync(path.join(HERE, 'fresh_transcript.jsonl'), r.stdout || '');
fs.writeFileSync(path.join(HERE, 'fresh_stderr.txt'), (r.stderr || '') + `\n--exit ${r.status} ${r.error ? r.error.code : ''} ${((Date.now() - t0) / 60000).toFixed(1)} min\n`);
