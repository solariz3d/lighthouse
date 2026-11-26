// term5.js: is name-check term #5 the word "coast", and does every hit sit inside "Coast Esses" (his own piece)? Prints booleans and counts only.
const fs = require('fs');
const rows = require('../l243/survey.json');
const names = new Set(); for (const r of rows) { names.add(r.track); if (r.layout) names.add(r.layout); }
const terms = [...names].filter((n) => n.length >= 4 && !/^t180b/i.test(n)), t = terms[5];
console.log('term #5 is "coast":', t.toLowerCase() === 'coast');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const f of ['C:/Consonance/lighthouse/exo_memory/handback/p-l250-shadow-B_2026-11-26.md', 'C:/Consonance/lighthouse/exo_memory/handback/p-l250-shadow-B_2026-11-26_evidence/ref_screens250.js']) {
  const s = fs.readFileSync(f, 'utf8'), re = new RegExp(`(^|[^a-z0-9])${esc(t)}([^a-z0-9]|$)`, 'gi');
  let m, all = 0, inPiece = 0;
  while ((m = re.exec(s))) { all++; const after = s.slice(m.index + m[1].length + t.length); if (/^ Esses/.test(after)) inPiece++; re.lastIndex = m.index + 1; }
  console.log(f.split('/').pop(), 'occurrences', all, 'inside "… Esses"', inPiece);
}
