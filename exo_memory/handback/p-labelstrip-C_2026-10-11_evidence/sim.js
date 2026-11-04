// Mirror of index_title (D296) plus candidate label strips, over the index-tier entries of a strict dump.
// usage: node sim.js <variant> [dump]   variants: V0 (no strip), V1, V2
const fs = require('fs');
const CAP = 40;
const full = new Map(fs.readFileSync(__dirname + '/titles.tsv', 'utf8').split('\n').filter(Boolean).map((l) => {
  const i = l.indexOf('\t'); return [l.slice(0, i), l.slice(i + 1)];
}));
const dump = process.argv[3] || 'G:/consonance-scratch/c-d296/new2/librarian.strict.md';
const tier = fs.readFileSync(dump, 'utf8').split('\n')
  .filter((l) => /^- (map|journal|loop|handback)\//.test(l)).map((l) => l.slice(2).split('  (')[0]);
function cut(h) {
  if (!h) return '(no title)';
  const c = [...h]; if (c.length <= CAP) return h;
  const s = c.slice(0, CAP).join(''); const i = s.lastIndexOf(' ');
  let k = i > 0 ? s.slice(0, i) : s; k = k.replace(/[\s,;:\-\u2014\u2013]+$/u, '');
  return k + ' ...';
}
const ID = String.raw`(?:[A-Z]{1,2}\d{1,4}[a-z]?|P-[A-Z0-9]+(?:-[A-Z0-9]+)*)`;
const QUAL = String.raw`(?:,? (?:packet|part|item|step|chunk|stage|arm|test) [A-Za-z0-9]{1,3})`;
const SEP = String.raw`(?::|\s[\u2014\u2013\u00b7])\s+`;
const V = {
  V0: /^\b\B/,
  V1: new RegExp(String.raw`^${ID}(?:(?: |, )${ID})*${QUAL}?${SEP}`, 'u'),
  V2: new RegExp(String.raw`^${ID}(?:(?: |, )${ID})*${QUAL}?(?: \([^()]{1,40}\))?${SEP}`, 'u'),
};
const which = process.argv[2] || 'V1';
let changed = 0, inPath = 0; const rows = [];
for (const p of tier) {
  const h = full.get(p); if (h === undefined) { console.log('MISSING', p); continue; }
  let s = h;
  if ([...h].length > CAP) { const m = h.match(V[which]); if (m && h.length > m[0].length) s = h.slice(m[0].length); }
  if (s !== h) {
    changed++;
    const lab = h.slice(0, h.length - s.length);
    const ids = lab.match(new RegExp(ID, 'g')) || [];
    const ok = ids.every((x) => p.toLowerCase().includes(x.toLowerCase())); if (ok) inPath++;
    rows.push(`${ok ? 'P' : '-'} ${p}\n    old: ${cut(h)}\n    new: ${cut(s)}   [stripped: ${JSON.stringify(lab)}]`);
  }
}
console.log(rows.join('\n'));
console.log(`${which}: tier ${tier.length}, stripped ${changed}, label ids all in path ${inPath}`);
