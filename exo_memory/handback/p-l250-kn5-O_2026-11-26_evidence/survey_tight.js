// survey_tight.js (pane O, L250): valid-track triangles per layout, starts-with (kn5road.rs at cac348e) against E's tighter match, "the key, then an end, a
// digit or a separator" (the character after the key is not a letter). Name-free; layouts in models ini order. Read only.
const fs = require('fs'), path = require('path');
const { readKn5 } = require('C:/Consonance/t180-wt-o-l250/tools/kn5.cjs');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const cache = new Map(); let li = 0; const tot = { startsWith: 0, tight: 0 }, diff = [];
for (const t of fs.readdirSync(AC).sort()) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue;
  const lay = fs.readdirSync(td).filter((f) => /^models_(.*)\.ini$/i.test(f)).map((f) => f.replace(/^models_|\.ini$/gi, ''));
  for (const L of (lay.length ? lay : [''])) {
    li++;
    const s = [L ? path.join(td, L, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find((x) => fs.existsSync(x));
    const valid = new Set(['ROAD', 'KERB']);
    if (s) for (const sec of fs.readFileSync(s, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), f = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && f && f[1] === '1') valid.add(k[1].toUpperCase()); }
    const V = [...valid], ini = path.join(td, L ? `models_${L}.ini` : 'models.ini');
    const files = fs.existsSync(ini) ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => m[1]) : [t + '.kn5'];
    const r = { layout: li, startsWith: 0, tight: 0 };
    for (const f0 of files) {
      const f = path.join(td, f0); if (!fs.existsSync(f)) continue;
      if (!cache.has(f)) cache.set(f, readKn5(f).meshes.map((m) => ({ name: m.name.toUpperCase(), nt: m.idx.length / 3 })));
      for (const m of cache.get(f)) {
        if (!/^\d/.test(m.name)) continue;
        const rest = m.name.replace(/^\d+/, '');
        if (V.some((k) => rest.startsWith(k))) r.startsWith += m.nt;
        if (V.some((k) => rest.startsWith(k) && !/\p{L}/u.test(rest.charAt(k.length)))) r.tight += m.nt;
      }
    }
    tot.startsWith += r.startsWith; tot.tight += r.tight; if (r.startsWith !== r.tight) diff.push(r);
  }
}
console.log(JSON.stringify({ layouts: li, totals: tot, layoutsThatDiffer: diff }));
