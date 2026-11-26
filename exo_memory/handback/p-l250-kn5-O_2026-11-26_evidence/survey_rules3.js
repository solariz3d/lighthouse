// Valid-track triangles per layout under four mesh-name rules (name-free; layouts by index):
//  run:  B's, the letter run after the leading digits equals a valid key
//  all:  strip every leading digit, the rest starts with a valid key
//  one:  strip exactly one leading digit, the rest starts with a valid key (a key may itself begin with a digit)
//  any:  all OR one
const fs = require('fs'), path = require('path');
const { readKn5 } = require('C:/Consonance/t180-wt-o-l250/tools/kn5.cjs');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const cache = new Map(); let li = 0; const rows = [], tot = { run: 0, all: 0, one: 0, any: 0 }; const digitKeyMeshes = { all: 0, one: 0 };
for (const t of fs.readdirSync(AC).sort()) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue;
  const lay = fs.readdirSync(td).filter((f) => /^models_(.*)\.ini$/i.test(f)).map((f) => f.replace(/^models_|\.ini$/gi, ''));
  for (const L of (lay.length ? lay : [''])) {
    li++;
    const s = [L ? path.join(td, L, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find((x) => fs.existsSync(x));
    const valid = new Set(['ROAD', 'KERB']);
    for (const sec of fs.readFileSync(s, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), f = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && f && f[1] === '1') valid.add(k[1].toUpperCase()); }
    const V = [...valid];
    const ini = path.join(td, L ? `models_${L}.ini` : 'models.ini');
    const files = fs.existsSync(ini) ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => m[1]) : [t + '.kn5'];
    const r = { layout: li, run: 0, all: 0, one: 0, any: 0, digitKeys: V.filter((k) => /^\d/.test(k)).length };
    for (const f0 of files) {
      const f = path.join(td, f0); if (!fs.existsSync(f)) continue;
      if (!cache.has(f)) cache.set(f, readKn5(f).meshes.map((m) => ({ name: m.name.toUpperCase(), nt: m.idx.length / 3 })));
      for (const m of cache.get(f)) {
        const run = (/^\d+([A-Z]+)/.exec(m.name) || [])[1];
        const all = /^\d/.test(m.name) && V.some((k) => m.name.replace(/^\d+/, '').startsWith(k));
        const one = /^\d/.test(m.name) && V.some((k) => m.name.slice(1).startsWith(k));
        if (run && valid.has(run)) r.run += m.nt; if (all) r.all += m.nt; if (one) r.one += m.nt; if (all || one) r.any += m.nt;
      }
    }
    for (const k of ['run', 'all', 'one', 'any']) tot[k] += r[k];
    if (r.run !== r.any || r.all !== r.one) rows.push(r);
  }
}
console.log(JSON.stringify({ layouts: li, totals: tot, differing: rows }, null, 0).replace(/\},\{/g, '},\n{'));
