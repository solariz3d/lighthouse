// Name-free survey of every kn5 named by a track's models*.ini (or <folder>.kn5) over AC's tracks folder, read only:
// does tools/kn5.cjs parse it; for each layout's surfaces.ini, does the "letter run after the digits" key rule (B's) pick the
// same meshes as "the name after the digits starts with a valid key" (prefix rule); do placed or dynamic models hold road meshes.
const fs = require('fs'), path = require('path');
const { readKn5 } = require('C:/Consonance/t180-wt-o-l250/tools/kn5.cjs');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const nz = (v) => !!v && v.split(',').some((x) => Math.abs(parseFloat(x)) > 0);
function validKeys(td, L) {
  const s = [L ? path.join(td, L, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find((x) => fs.existsSync(x));
  const v = new Set(['ROAD', 'KERB']);
  if (s) for (const sec of fs.readFileSync(s, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), f = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && f && f[1] === '1') v.add(k[1].toUpperCase()); }
  return { v, has: !!s };
}
const cache = new Map();
function read(f) { if (!cache.has(f)) { let r; try { r = { meshes: readKn5(f).meshes.map((m) => ({ name: m.name, nv: m.pos.length / 3, nt: m.idx.length / 3 })) }; } catch (e) { r = { err: String(e.message).replace(/^.*?: /, '').replace(/\(.*?\)/, '(..)').slice(0, 90) }; } cache.set(f, r); } return cache.get(f); }
const out = { layouts: 0, kn5Files: new Set(), parseErr: {}, ruleDiffLayouts: 0, ruleDiffMeshes: 0, ruleDiffExamples: [], placedWithRoad: 0, dynamicWithRoad: 0, noSurfacesIni: 0, nonDigitValidNames: 0, layoutsNoRoad: 0, tris: [] };
let ti = 0;
for (const t of fs.readdirSync(AC).sort()) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue; ti++;
  const lay = fs.readdirSync(td).filter((f) => /^models_(.*)\.ini$/i.test(f)).map((f) => f.replace(/^models_|\.ini$/gi, ''));
  const layouts = lay.length ? lay : [''];
  for (const L of layouts) {
    out.layouts++;
    const ini = path.join(td, L ? `models_${L}.ini` : 'models.ini');
    let entries;
    if (fs.existsSync(ini)) entries = fs.readFileSync(ini, 'utf8').split(/^\s*\[/m).slice(1).map((sec) => { const g = (k) => { const m = new RegExp('^\s*' + k + '\s*=\s*(.*?)\s*$', 'mi').exec(sec); return m && m[1]; }; return { head: sec.split(']')[0], file: g('FILE'), placed: nz(g('POSITION')) || nz(g('ROTATION')) }; }).filter((e) => e.file);
    else entries = [{ head: 'MODEL_0', file: t + '.kn5', placed: false }];
    const { v, has } = validKeys(td, L); if (!has) out.noSurfacesIni++;
    let tris = 0, diff = 0;
    for (const e of entries) {
      const f = path.join(td, e.file); if (!fs.existsSync(f)) continue; out.kn5Files.add(f);
      const r = read(f); if (r.err) { out.parseErr[r.err] = (out.parseErr[r.err] || 0) + 1; continue; }
      for (const m of r.meshes) {
        const km = /^\d+([A-Z]+)/i.exec(m.name), run = km && km[1].toUpperCase();
        const rest = (/^\d+(.*)$/.exec(m.name) || [])[1];
        const byRun = !!run && v.has(run), byPrefix = rest != null && [...v].some((k) => rest.toUpperCase().startsWith(k));
        if (byRun !== byPrefix) { diff++; }   // (the evidence copy keeps no mesh-name examples: a surface key can carry a track's name; survey_rule.js gives the shapes)
        if (byRun) { tris += m.nt; if (e.placed) out.placedWithRoad++; if (/^DYNAMIC/i.test(e.head)) out.dynamicWithRoad++; }
      }
    }
    if (diff) { out.ruleDiffLayouts++; out.ruleDiffMeshes += diff; }
    if (!tris) out.layoutsNoRoad++;
    out.tris.push(tris);
  }
}
out.kn5Files = out.kn5Files.size; out.tris.sort((a, b) => a - b);
out.trisMax = out.tris[out.tris.length - 1]; out.trisMedian = out.tris[out.tris.length >> 1]; delete out.tris;
console.log(JSON.stringify(out, null, 1));
