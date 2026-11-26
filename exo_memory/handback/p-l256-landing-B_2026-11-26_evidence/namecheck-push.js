// namecheck-push.js (pane B, L256 cut): every installed track folder and layout name (4+ characters, not the builder's own t180b_) against the added lines of each
// branch about to be pushed (git diff 40e931e...<ref>). Prints counts and term numbers (0-based) only, never a name. usage: node namecheck-push.js <ref>...
const { execSync } = require('child_process');
const rows = require('../l243/survey.json'), names = new Set(); for (const r of rows) { names.add(r.track); if (r.layout) names.add(r.layout); }
const terms = [...names].filter((n) => n.length >= 4 && !/^t180b/i.test(n)), esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const ref of process.argv.slice(2)) {
  const added = execSync(`git diff 40e931e...${ref}`, { cwd: 'C:/Consonance/t180-wt-landing-1126', maxBuffer: 1 << 28 }).toString().split('\n').filter((l) => l.startsWith('+')).join('\n');
  const by = {};
  for (const [i, t] of terms.entries()) if (new RegExp(`(^|[^a-z0-9])${esc(t)}([^a-z0-9]|$)`, 'im').test(added)) by[i] = 1;
  console.log(`${ref}: terms ${terms.length}, hit terms ${JSON.stringify(Object.keys(by).map(Number))}`);
}
