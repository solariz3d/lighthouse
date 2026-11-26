// Classify every mesh where the letter-run rule and the prefix rule disagree, by the SHAPE of the case (name-free):
//  A: the valid key that prefixes the name contains a non-letter (the letter run can never equal it)
//  B: the run is longer than a valid key and is no key of the track at all (e.g. ROADX with only ROAD defined)
//  C: the run is itself a key the track marks NOT valid, and a shorter valid key prefixes it (longest-key would say not valid)
//  D: anything else
const fs = require('fs'), path = require('path');
const { readKn5 } = require('C:/Consonance/t180-wt-o-l250/tools/kn5.cjs');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
function keys(td, L) {
  const s = [L ? path.join(td, L, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find((x) => fs.existsSync(x));
  const all = new Map([['ROAD', true], ['GRASS', false], ['KERB', true], ['SAND', false]]);
  for (const sec of fs.readFileSync(s, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), f = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k) all.set(k[1].toUpperCase(), !!(f && f[1] === '1') || (all.get(k[1].toUpperCase()) && ['ROAD','KERB'].includes(k[1].toUpperCase()))); }
  return all;
}
const cls = { A: 0, B: 0, C: 0, D: 0 }, trisByCls = { A: 0, B: 0, C: 0, D: 0 }, shapes = {}, keyShapes = new Set(), lenDiffs = {};
const cache = new Map(); let li = 0;
for (const t of fs.readdirSync(AC).sort()) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue;
  const lay = fs.readdirSync(td).filter((f) => /^models_(.*)\.ini$/i.test(f)).map((f) => f.replace(/^models_|\.ini$/gi, ''));
  for (const L of (lay.length ? lay : [''])) {
    li++;
    const ini = path.join(td, L ? `models_${L}.ini` : 'models.ini');
    const files = fs.existsSync(ini) ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => m[1]) : [t + '.kn5'];
    const all = keys(td, L), valid = [...all].filter(([, v]) => v).map(([k]) => k);
    for (const k of valid) if (/[^A-Z]/.test(k)) keyShapes.add(k.replace(/[A-Z]/g, 'A').replace(/A+/g, 'A'));
    for (const f0 of files) {
      const f = path.join(td, f0); if (!fs.existsSync(f)) continue;
      if (!cache.has(f)) cache.set(f, readKn5(f).meshes.map((m) => ({ name: m.name, nt: m.idx.length / 3 })));
      for (const m of cache.get(f)) {
        const km = /^\d+([A-Z]+)/i.exec(m.name), run = km && km[1].toUpperCase();
        const rest = ((/^\d+(.*)$/.exec(m.name) || [])[1] || '').toUpperCase();
        const byRun = !!run && valid.includes(run), pre = valid.filter((k) => /^\d/.test(m.name) && rest.startsWith(k)), byPrefix = pre.length > 0;
        if (byRun === byPrefix) continue;
        let c;
        if (byPrefix && pre.some((k) => /[^A-Z]/.test(k))) c = 'A';
        else if (byPrefix && !all.has(run)) c = 'B';
        else if (byPrefix && all.has(run) && !all.get(run)) c = 'C';
        else c = 'D';
        cls[c]++; trisByCls[c] += m.nt;
        const sh = `${c} run=${run && run.length}ch prefixKey=${pre.map((k) => k.replace(/[A-Z]/g, 'A').replace(/A+/g, 'A')).join('|')} byRun=${byRun}`;
        shapes[sh] = (shapes[sh] || 0) + 1;
      }
    }
  }
}
console.log(JSON.stringify({ cls, trisByCls, shapes, validKeyShapesWithNonLetters: [...keyShapes] }, null, 1));
