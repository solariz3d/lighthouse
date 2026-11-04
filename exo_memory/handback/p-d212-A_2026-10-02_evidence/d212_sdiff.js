const fs = require('fs');
const P = (f) => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''));
const D = 'C:/Users/nname/.claude/';
const a = P(D + 'settings.json.bak-d212-20261002-135609'), b = P(D + 'settings.json');
console.log('PreToolUse now:', JSON.stringify(b.hooks.PreToolUse.map((g) => ({ matcher: g.matcher, timeouts: g.hooks.map((h) => h.timeout), hooks: g.hooks.map((h) => h.command.split('\\').pop()) }))));
for (const k of new Set([...Object.keys(a.hooks), ...Object.keys(b.hooks)])) if (k !== 'PreToolUse') console.log(k, JSON.stringify(a.hooks[k]) === JSON.stringify(b.hooks[k]) ? 'IDENTICAL' : 'DIFFERS');
const ra = JSON.parse(JSON.stringify(a)); delete ra.hooks; const rb = JSON.parse(JSON.stringify(b)); delete rb.hooks;
console.log('non-hook settings', JSON.stringify(ra) === JSON.stringify(rb) ? 'IDENTICAL' : 'DIFFERS');
console.log('second-reader entry unchanged:', JSON.stringify(a.hooks.PreToolUse[0].hooks[0]) === JSON.stringify(b.hooks.PreToolUse[0].hooks[0]), '; groups before/after:', a.hooks.PreToolUse.length, b.hooks.PreToolUse.length);
