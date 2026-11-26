// namecheck.js: every installed track folder and layout name (4+ characters, not the builder's own t180b_) against the builder branch's diff and
// new files, the hand-back and its evidence. Prints counts and term numbers only, never a name.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const rows = require('./survey.json');
const names = new Set(); for (const r of rows) { names.add(r.track); if (r.layout) names.add(r.layout); }
const terms = [...names].filter((n) => n.length >= 4 && !/^t180b/i.test(n));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const files = [], walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } };
const H = 'C:/Consonance/lighthouse/exo_memory/handback/';
walk(H + 'p-l243-reference-overlay-B_2026-11-26_evidence'); files.push(H + 'p-l243-reference-overlay-B_2026-11-26.md');
const wt = 'C:/Consonance/t180-wt-l243';
const branch = execSync('git diff cfa7ad9', { cwd: wt }).toString() + ['src/reference/ribbon.js', 'app/reference/panel.js', 'src-tauri/src/reference.rs', 'test/reference_ribbon.test.js'].map((f) => fs.readFileSync(path.join(wt, f), 'utf8')).join('\n');
let hits = 0;
const check = (label, text) => { for (const [i, t] of terms.entries()) if (new RegExp(`(^|[^a-z0-9])${esc(t)}([^a-z0-9]|$)`, 'i').test(text)) { hits++; console.log('HIT', label, 'term #' + i); } };
check('builder diff and new files', branch);
for (const f of files) check(path.basename(f), fs.readFileSync(f, 'utf8'));
console.log(`terms ${terms.length}, files ${files.length + 1} (the builder's diff counted as one), hits ${hits}`);
