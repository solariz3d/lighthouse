// hookmap.js: every hook (room consonance/hooks/*.js, not tests; shell ~/.claude/shell/*.js and hooks/*.js, not _tmp_ / .bak): where it is registered
// (settings.json event, or named by another file that launches it), whether a shell file is a copy of a room hook (same basename, byte-equal or not),
// and the ledger / state files its source names. JSON to stdout.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOM = 'C:/Users/nname/Desktop/lighthouse/consonance', SH = 'C:/Users/nname/.claude/shell';
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 12);
const js = (d) => fs.readdirSync(d).filter((f) => /\.(js|py)$/.test(f) && !/\.test\.js$/.test(f) && !f.startsWith('_')).map((f) => path.join(d, f).replace(/\\/g, '/'));
const roomHooks = js(ROOM + '/hooks'), shellHooks = [...js(SH), ...js(SH + '/hooks')];
const settings = JSON.parse(fs.readFileSync('C:/Users/nname/.claude/settings.json', 'utf8')).hooks || {};
const reg = new Map();
for (const [ev, arr] of Object.entries(settings)) for (const m of arr) for (const h of m.hooks || []) {
  const f = (h.command.match(/"([^"]+\.(?:js|py))"\s*$/) || h.command.match(/(\S+\.(?:js|py))\s*$/) || [])[1]; if (!f) continue;
  const k = f.replace(/\\/g, '/'); reg.set(k, [...(reg.get(k) || []), ev + (m.matcher ? `[${m.matcher}]` : '')]);
}
// files that might launch a hook: the app's Rust, the room tools, shell hooks, instance settings
const launchers = [];
const walk = (d, re) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (!/node_modules|target|\.git|attic/.test(f.name)) walk(p, re); } else if (re.test(f.name)) launchers.push(p.replace(/\\/g, '/')); } };
walk(ROOM + '/src-tauri/src', /\.rs$/); walk(ROOM + '/tools', /\.(js|cjs|ps1)$/); for (const f of shellHooks) launchers.push(f);
for (const d of fs.readdirSync('C:/Consonance/instances')) { const p = `C:/Consonance/instances/${d}/.claude/settings.local.json`; if (fs.existsSync(p)) launchers.push(p); }
const texts = new Map(launchers.map((f) => [f, fs.readFileSync(f, 'utf8')]));
const out = [];
for (const f of [...roomHooks, ...shellHooks]) {
  const base = path.basename(f), src = fs.readFileSync(f, 'utf8');
  const named = [...texts].filter(([g, t]) => g !== f && !g.endsWith('.test.js') && t.includes(base) && !(path.basename(g) === base)).map(([g]) => g.replace(/^.*\/(consonance|shell)\//, '$1/'));
  const ledgers = [...new Set([...src.matchAll(/['"`/\\]([A-Za-z0-9_.-]+\.(?:jsonl|json|log))['"`]/g)].map((m) => m[1]))];
  const twin = f.startsWith(ROOM) ? shellHooks.find((g) => path.basename(g) === base) : roomHooks.find((g) => path.basename(g) === base);
  out.push({ file: f.replace(/^.*\/(consonance|shell)\//, '$1/'), bytes: src.length, registered: reg.get(f) || [], namedBy: named.slice(0, 6), ledgers,
    twin: twin ? { file: twin.replace(/^.*\/(consonance|shell)\//, '$1/'), same: sha(twin) === sha(f) } : null });
}
console.log(JSON.stringify(out, null, 1));
