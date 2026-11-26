const fs = require('fs'), path = require('path');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const rows = [];
let ti = 0;
for (const t of fs.readdirSync(AC).sort()) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue; ti++;
  for (const f of fs.readdirSync(td).filter((f) => /^models(_.*)?\.ini$/i.test(f))) {
    for (const sec of fs.readFileSync(path.join(td, f), 'utf8').split(/^\s*\[/m).slice(1)) {
      const head = sec.split(']')[0].replace(/\d+$/, 'N');
      const g = (k) => { const m = new RegExp('^\s*' + k + '\s*=\s*(.*?)\s*$', 'mi').exec(sec); return m && m[1]; };
      const file = g('FILE'); if (!file) { rows.push({ t: ti, head, nofile: true }); continue; }
      const nz = (v) => v && v.split(',').some((x) => Math.abs(parseFloat(x)) > 0);
      const missing = !fs.existsSync(path.join(td, file));
      if (missing || nz(g('POSITION')) || nz(g('ROTATION')) || !g('POSITION')) rows.push({ t: ti, ini: f === 'models.ini' ? 'models.ini' : 'models_<layout>.ini', head, ext: path.extname(file), missing, pos: g('POSITION'), rot: g('ROTATION'), mb: missing ? null : +(fs.statSync(path.join(td, file)).size / 1e6).toFixed(1) });
    }
  }
}
const heads = {}; for (const r of rows) heads[r.head] = (heads[r.head] || 0) + 1;
console.log(JSON.stringify(rows.map((r) => JSON.stringify(r)), null, 0).replace(/","/g, '\n'));
