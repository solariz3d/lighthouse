// D180 mutants: the timers, the message kind, the texture export and its app wiring, on copies, --test-concurrency=4.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const APP = ['app/test/timers-regression.test.js', 'app/test/palette-dom.test.js', 'app/test/share-install.test.js'], EXP = ['test/export-textures.test.js'], APPX = ['app/test/export.test.js'];
const M = [
  ['T1 the timers held as methods again', 'app/shell.js', 'timers = { setTimeout: (f, ms) => setTimeout(f, ms), clearTimeout: (t) => clearTimeout(t) }', 'timers = { setTimeout, clearTimeout }', APP],
  ['K1 every message is a refusal', 'app/shell.js', "if ('message' in patch && !('messageKind' in patch)) patch =", "if ('message' in patch) patch =", APP],
  ['K2 a stale ok colours a later refusal', 'app/shell.js', "    if ('message' in patch && !('messageKind' in patch)) patch = { ...patch, messageKind: patch.message ? 'error' : null };\n", '', APP],
  ['K3 the palette shows every message as an alert', 'app/palette/palette.js', "role: model.messageKind === 'ok' ? 'status' : 'alert'", "role: 'alert'", APP],
  ['K4 close-the-loop reports as a refusal', 'app/shell.js', "c.maxG.toFixed(1)} g`, messageKind: 'ok', selection: null });", "c.maxG.toFixed(1)} g`, selection: null });", APP],
  ['W1 a made floor texture is not exported', 'src/texture/set.js', "if (slots && slots.floor && (slots.floor.settings.texture || slots.floor.settings.make)) wear.set(", 'if (slots && slots.floor && slots.floor.settings.texture) wear.set(', EXP],
  ['W2 every set material is appended, used or not', 'src/texture/set.js', 'const used = [...new Set(wear.values())]', 'const used = set.materials.map((m) => m.material.name)', EXP],
  ['W3 the export ignores the set', 'src/export/fromwords.js', 'mesh, segs, o.textures || null);', 'mesh, segs, null);', EXP],
  ['W4 the app exporter drops the set', 'app/export/export.js', 'fromwords.exportTrack(doc, { outDir: OUT, variant, textures });', 'fromwords.exportTrack(doc, { outDir: OUT, variant });', APPX],
  ['W5 install drops the set', 'app/install/install.js', 'exporter.run(getDoc(), { textures: getTextures() })', 'exporter.run(getDoc())', APP],
  ['W6 every cell of every word wears the floor', 'src/texture/set.js', 'const seg = segments[mesh.cells[k].piece], slots = seg ? set.bySegment(seg.id) : null;', "const seg = segments[mesh.cells[k].piece], slots = seg ? set.bySegment('w1') : null;", EXP],
  ['N1 an unnamed track is installed', 'app/install/install.js', "      if (!name || /^untitled$/i.test(name)) return", "      if (false) return", APP],
  ['N2 the saved name is not used for the export', 'app/shell.js', "exportDoc() { const d = doc(); return st.name && st.name !== d.name ? { ...d, name: st.name } : d; }", "exportDoc() { return doc(); }", [...APP, ...APPX]],
  ['N3 the install panel installs the doc, not the saved name', 'app/install/index.js', "getDoc: () => shell.exportDoc(), getTextures", "getDoc: () => shell.getState().history.present, getTextures", APP],
  ['N4 the tooltip tab comes back', 'app/index.html', "content\\tracks, always", "content\tracks, always", APP],
  ['N5 Export ignores the saved name', 'app/shell.js', "try { out = exporter.run(api.exportDoc(), opts); }", "try { out = exporter.run(doc(), opts); }", APPX],
];
const LIVE = [...new Set(M.map((m) => m[1]))].map((f) => path.join(REPO, f)), before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const t = { listed: 0, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to, tests] of M) {
  if (only && !only.test(name)) continue; t.listed++;
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd180-'));
  for (const d of ['app', 'src', 'tools', 'test']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel); const src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, () => to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', '--test-reporter=tap', ...tests], { cwd: top, encoding: 'utf8', timeout: 300000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]) ? 'unchanged' : 'CHANGED'}`);
