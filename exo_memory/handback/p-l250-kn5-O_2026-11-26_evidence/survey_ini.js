// Name-free survey of models*.ini over AC's tracks folder (read only): POSITION / ROTATION values, kn5 files per ini,
// and, for folders with no models ini, the top-level kn5 names compared with "<folder>.kn5".
const fs = require('fs'), path = require('path');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const out = { folders: 0, inis: 0, models: 0, nonZeroPos: 0, nonZeroRot: 0, posValues: {}, rotValues: {}, noIni: 0, noIniTopKn5: [], iniFileMissing: 0, otherKeys: {} };
for (const t of fs.readdirSync(AC)) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue; out.folders++;
  const inis = fs.readdirSync(td).filter((f) => /^models(_.*)?\.ini$/i.test(f));
  if (!inis.length) { out.noIni++; const k = fs.readdirSync(td).filter((f) => /\.kn5$/i.test(f)); out.noIniTopKn5.push({ n: k.length, hasFolderNamed: k.some((f) => f.toLowerCase() === (t + '.kn5').toLowerCase()) }); }
  for (const f of inis) {
    out.inis++;
    for (const sec of fs.readFileSync(path.join(td, f), 'utf8').split(/^\s*\[/m).slice(1)) {
      const g = (k) => { const m = new RegExp('^\s*' + k + '\s*=\s*(.*?)\s*$', 'mi').exec(sec); return m && m[1]; };
      for (const m of sec.matchAll(/^\s*([A-Z_]+)\s*=/gmi)) out.otherKeys[m[1].toUpperCase()] = (out.otherKeys[m[1].toUpperCase()] || 0) + 1;
      const file = g('FILE'); if (!file) continue; out.models++;
      if (!fs.existsSync(path.join(td, file))) out.iniFileMissing++;
      const p = g('POSITION'), r = g('ROTATION');
      out.posValues[p] = (out.posValues[p] || 0) + 1; out.rotValues[r] = (out.rotValues[r] || 0) + 1;
      const nz = (v) => v && v.split(',').some((x) => Math.abs(parseFloat(x)) > 0);
      if (nz(p)) out.nonZeroPos++; if (nz(r)) out.nonZeroRot++;
    }
  }
}
console.log(JSON.stringify(out, null, 1));
