// wake.js (D454 part 3, pane E): the first wake as far as it goes without the app: the real `claude`, headless (-p), in a new instance folder
// under the stranger home, with the stranger's env (env.txt) and so its ~/.claude and the hooks install.ps1 put there. No window (-p is a
// console program, started hidden). Prints exit, stdout, stderr, and every file the run made under the stranger home.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const S = 'C:\\Users\\nname\\Downloads\\cons-d454-e', home = path.join(S, 'stranger');
const env = {}; for (const l of fs.readFileSync(path.join(S, 'launch', 'env.txt'), 'utf8').split('\n')) { const i = l.indexOf('='); if (i > 0) env[l.slice(0, i)] = l.slice(i + 1); }
// the cwd goes OUTSIDE this user's profile: claude reads every ancestor's .claude/CLAUDE.md as project memory, and a cwd under it read the keeper's own
const cwd = process.argv[2] || path.join(home, 'claude-instances', 'sibling-first'); fs.mkdirSync(cwd, { recursive: true });
const list = (d) => { const o = []; (function walk(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const p = path.join(x, e.name); if (e.isDirectory()) walk(p); else o.push(p); } })(d); return o; };
const before = new Set(list(home));
const t0 = Date.now();
const r = spawnSync('C:\\Users\\nname\\.local\\bin\\claude.exe', ['-p', 'Reply with exactly: ok'], { cwd, env, encoding: 'utf8', timeout: 90000, windowsHide: true });
console.log('exit', r.status, 'signal', r.signal, 'error', r.error && r.error.code, 'ms', Date.now() - t0);
console.log('stdout:', JSON.stringify((r.stdout || '').slice(0, 1200)));
console.log('stderr:', JSON.stringify((r.stderr || '').slice(0, 1200)));
console.log('new files under the stranger home:'); for (const f of list(home)) if (!before.has(f)) console.log('  ' + f.slice(home.length + 1) + '  ' + fs.statSync(f).size);
