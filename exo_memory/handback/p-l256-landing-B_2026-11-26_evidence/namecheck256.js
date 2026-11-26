// namecheck256.js (pane B, L256): every installed track folder and layout name (4+ characters, not the builder's own t180b_) against the L256 hand-back,
// its evidence, the map line and landing-1126's diff from 40e931e. Prints counts and term numbers (0-based) only, never a name.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const rows = require('../l243/survey.json'), names = new Set(); for (const r of rows) { names.add(r.track); if (r.layout) names.add(r.layout); }
const terms = [...names].filter((n) => n.length >= 4 && !/^t180b/i.test(n)), esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const H = 'C:/Consonance/lighthouse/exo_memory/handback/', E = H + 'p-l256-landing-B_2026-11-26_evidence/';
const files = [H + 'p-l256-landing-B_2026-11-26.md', ...fs.readdirSync(E).filter((f) => fs.statSync(E + f).isFile()).map((f) => E + f)];
const texts = files.map((f) => [path.basename(f), fs.readFileSync(f, 'utf8')]);
texts.push(['landing diff', execSync('git diff 40e931e HEAD', { cwd: 'C:/Consonance/t180-wt-landing-1126', maxBuffer: 1 << 28 }).toString()]);
texts.push(['map line', fs.readFileSync('C:/Consonance/lighthouse/exo_memory/map/B.md', 'utf8').split('\n').filter(Boolean).pop()]);
let hits = 0; const by = {};
for (const [label, text] of texts) for (const [i, t] of terms.entries()) if (new RegExp(`(^|[^a-z0-9])${esc(t)}([^a-z0-9]|$)`, 'i').test(text)) { hits++; by[i] = (by[i] || 0) + 1; console.log('HIT', label, 'term #' + i); }
console.log(`terms ${terms.length}, texts ${texts.length}, hits ${hits}, by term ${JSON.stringify(by)}`);
