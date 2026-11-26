// kn5mesh.js: reference track 1's road surfaces (every valid-track key) from its kn5 files, as meshes for the page (base64), with the AI line's start
const fs = require('fs'), path = require('path');
const T = 'C:/Consonance/t180-wt-l243', { readKn5 } = require(T + '/tools/kn5.cjs'), { readAiShape, ribbonOf } = require(T + '/src/reference/ribbon.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks', key = JSON.parse(fs.readFileSync(T + '/out/reference-key.json', 'utf8'));
const a = process.argv[2] || 'reference track 1', td = path.join(AC, key[a].track), L = key[a].layout;
const ini = [L ? `models_${L}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((f) => fs.existsSync(f));
const kn5s = ini ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => path.join(td, m[1])) : fs.readdirSync(td).filter((f) => /\.kn5$/i.test(f)).map((f) => path.join(td, f));
const sIni = [path.join(td, L, 'data', 'surfaces.ini'), path.join(td, 'data', 'surfaces.ini')].find((x) => fs.existsSync(x));
const valid = new Set(['ROAD', 'KERB']); if (sIni) for (const sec of fs.readFileSync(sIni, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), v = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && v && v[1] === '1') valid.add(k[1].toUpperCase()); }
const meshes = []; let tris = 0;
for (const f of kn5s) for (const m of readKn5(f).meshes) { const km = /^\d+([A-Z]+)/i.exec(m.name); if (!km || !valid.has(km[1].toUpperCase())) continue; meshes.push({ pos: Buffer.from(m.pos.buffer, m.pos.byteOffset, m.pos.byteLength).toString('base64'), idx: Buffer.from(m.idx.buffer, m.idx.byteOffset, m.idx.byteLength).toString('base64') }); tris += m.idx.length / 3; }
const r = ribbonOf(readAiShape(fs.readFileSync(path.join(td, L, 'ai', 'fast_lane.ai'))));
fs.writeFileSync(path.join(__dirname, 'kn5mesh.json'), JSON.stringify({ start: r.start, meshes }));
console.log(JSON.stringify({ meshes: meshes.length, tris, keys: [...valid] }));
