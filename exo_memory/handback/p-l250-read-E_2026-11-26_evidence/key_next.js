// key_next.js: for O's kept meshes, what follows the matched valid key: the end, a digit, a separator, or a LETTER (where "starts with" could take
// a word that only begins with the key, e.g. ROAD + SIGN). Names-free: counts, and with --show the letter-continued rests (local only).
'use strict';
const path = require('path'), fs = require('fs');
const src = fs.readFileSync(path.join(__dirname, 'key_census.js'), 'utf8');
// reuse the census's helpers by evaluating it up to its main loop
const head = src.slice(0, src.indexOf('const sys = allKeys'));
const m = { exports: {} }; new Function('require', 'process', 'module', head + '\nmodule.exports = { iniSections, val, allKeys, listLayouts, meshNames };')(require, { argv: ['', '', process.argv[2]] }, m);
const { iniSections, val, allKeys, listLayouts, meshNames } = m.exports;
const TRACKS = path.resolve(process.argv[2]), SHOW = process.argv.includes('--show');
const tally = { end: 0, digit: 0, sep: 0, letter: 0 }, letterLayouts = new Map(), seen = new Map();
listLayouts(TRACKS).forEach((L, n) => {
  const td = path.join(TRACKS, L.track);
  const iniP = [L.layout ? `models_${L.layout}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  const files = iniP ? iniSections(fs.readFileSync(iniP, 'latin1')).map((s) => val(s, 'FILE')).filter((f) => f) : [`${L.track}.kn5`];
  const sP = [L.layout ? path.join(td, L.layout, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  const keys = ['ROAD', 'KERB', ...(sP ? allKeys(fs.readFileSync(sP, 'latin1')).filter((k) => k.valid).map((k) => k.key) : [])];
  for (const f of files) {
    const p = path.join(td, f); if (!fs.existsSync(p)) continue;
    if (!seen.has(p)) seen.set(p, meshNames(p));
    for (const me of seen.get(p).meshes) {
      const dm = /^(\d+)(.*)$/s.exec(me.name); if (!dm) continue;
      const rest = dm[2].toUpperCase(), k = keys.filter((x) => rest.startsWith(x)).sort((a, b) => b.length - a.length)[0]; if (!k) continue;
      const nx = rest.charAt(k.length);
      const kind = nx === '' ? 'end' : /[0-9]/.test(nx) ? 'digit' : /[A-Z]/.test(nx) ? 'letter' : 'sep';
      tally[kind] += me.tris;
      if (kind === 'letter') { const e = letterLayouts.get(n + 1) || { tris: 0, rests: new Set() }; e.tris += me.tris; e.rests.add(`${k}|${rest.slice(k.length, k.length + 12)}`); letterLayouts.set(n + 1, e); }
    }
  }
});
console.log('kept triangles by what follows the key:', JSON.stringify(tally));
for (const [n, e] of letterLayouts) console.log(`layout ${n}: ${e.tris} triangles kept where a letter follows the key${SHOW ? ` (${[...e.rests].slice(0, 12).join(', ')})` : ` (${e.rests.size} distinct name shapes)`}`);
