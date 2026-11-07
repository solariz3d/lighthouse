// toolscan.js: for every tool in consonance/tools (*.js, *.cjs, *.py, *.ps1; not tests, not mutant harnesses' own tests) and every room hook, where the
// room's record mentions it: exo_memory/**/*.md (hand-backs, journal, librarian, loop, map, ...) and lighthouse's git log (subjects + bodies).
// Per name: files mentioning it, the newest dated mention, and CATCH mentions: a line naming it with a catch word (caught, found, flagged, refused,
// denied, blocked, red, wrong, stale, missed, broke, mismatch, would have), citing the newest one as path:line. Also: what requires / spawns it.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const LH = 'C:/Users/nname/Desktop/lighthouse';
const tools = fs.readdirSync(LH + '/consonance/tools').filter((f) => /\.(js|cjs|py|ps1)$/.test(f) && !/\.test\.js$/.test(f));
const hooks = fs.readdirSync(LH + '/consonance/hooks').filter((f) => /\.js$/.test(f) && !/\.test\.js$/.test(f));
const names = [...tools.map((f) => ({ f, kind: 'tool' })), ...hooks.map((f) => ({ f, kind: 'hook' }))];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// a mention: the file name with its extension, or tools/<stem> / hooks/<stem>
const pat = names.map((n) => ({ ...n, re: new RegExp(`(^|[^A-Za-z0-9_-])(${esc(n.f)}|${n.kind === 'tool' ? 'tools' : 'hooks'}/${esc(n.f.replace(/\.[^.]+$/, ''))})(?![A-Za-z0-9_-])`) }));
const CATCH = /\b(caught|catch(es)?|found|flagged|refus\w*|denied|blocked|red\b|wrong|stale|missed|broke|mismatch|would have|fired|stopped)\b/i;
const st = new Map(names.map((n) => [n.f, { kind: n.kind, files: new Set(), newest: '', catches: 0, cite: '', citeDate: '', git: 0, gitCatch: 0, gitCite: '' }]));
const dateOf = (p) => (p.match(/(20\d\d-\d\d-\d\d)/) || [])[1] || '';
const md = []; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(\.git|node_modules)$/.test(e.name)) walk(p); } else if (/\.md$/.test(e.name)) md.push(p); } };
walk(LH + '/exo_memory');
for (const p of md) {
  const rel = path.relative(LH, p).replace(/\\/g, '/'), d = dateOf(rel) || fs.statSync(p).mtime.toISOString().slice(0, 10), lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  lines.forEach((l, i) => { for (const n of pat) { if (!n.re.test(l)) continue; const s = st.get(n.f); s.files.add(rel); if (d > s.newest) s.newest = d;
    if (CATCH.test(l)) { s.catches++; if (d >= s.citeDate) { s.citeDate = d; s.cite = `${rel}:${i + 1}`; } } } });
}
const log = cp.execFileSync('git', ['-C', LH, 'log', '--all', '--format=%x01%h %as %B'], { encoding: 'utf8', maxBuffer: 1 << 30, windowsHide: true }).split('\x01').filter(Boolean);
for (const c of log) { const [h, d] = c.split(' '); for (const n of pat) { if (!n.re.test(c)) continue; const s = st.get(n.f); s.git++; if (CATCH.test(c.split('\n').find((l) => n.re.test(l)) || '')) { s.gitCatch++; if (!s.gitCite || d > s.gitCite.split(' ')[1]) s.gitCite = `${h} ${d}`; } } }
// who uses it: other tools / hooks / Rust / shell hooks naming it
const users = new Map(names.map((n) => [n.f, []]));
const code = [...tools.map((f) => LH + '/consonance/tools/' + f), ...hooks.map((f) => LH + '/consonance/hooks/' + f), LH + '/consonance/src-tauri/src/main.rs', LH + '/consonance/src-tauri/src/mcp.rs',
  ...fs.readdirSync('C:/Users/nname/.claude/shell/hooks').filter((f) => /\.js$/.test(f)).map((f) => 'C:/Users/nname/.claude/shell/hooks/' + f)];
for (const g of code) { const t = fs.readFileSync(g, 'utf8'); for (const n of pat) if (path.basename(g) !== n.f && !path.basename(g).startsWith(n.f.replace(/\.[^.]+$/, '') + '.') && n.re.test(t)) users.get(n.f).push(path.basename(g)); }
const out = [];
for (const n of names) { const s = st.get(n.f); out.push({ name: n.f, kind: n.kind, files: s.files.size, newest: s.newest, catches: s.catches, cite: s.cite, git: s.git, gitCatch: s.gitCatch, gitCite: s.gitCite, usedBy: users.get(n.f) }); }
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(`${names.length} names (${tools.length} tools, ${hooks.length} hooks); ${md.length} md files; ${log.length} commits`);
