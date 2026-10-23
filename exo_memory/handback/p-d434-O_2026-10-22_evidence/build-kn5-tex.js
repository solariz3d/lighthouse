'use strict';
// D434 §11 (O): the drive kn5 WITH ROAD TEXTURES. Copied from the librarian's d431\exp.js (read 2026-10-23, not edited in place) and changed in two ways only:
//   1. its 'force' mode, which patched the validator to skip two reds, is NOT carried over: the validator runs exactly as the tree has it;
//   2. the document is not a saved file but TEST TRACK 10's open lap (the private fixture copy) finished by the tree's own finishToStart, then opened in the shell
//      the way exp.js opens one (storage.openDoc + s.open).
// The textures are built as the app builds them, as exp.js does: app/core/textures.js createCoreTextures({ segments, closed, kind: 'asphalt', edge: false }).current(),
// passed to the shell's buildExport({ textures }). The files go ONLY under <out dir>; it refuses any path under content\tracks or his tracks folder. Then the kn5's
// own texture table is read back (sc6969, version, count, then active, name, size, bytes) and listed.
//   node build-kn5-tex.js <tree> <out dir> <export name>
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [T, OUT, NAME] = process.argv.slice(2);
if (/content[\\/]+tracks/i.test(OUT) || /com\.solariz3d\.t180-track-builder/i.test(OUT)) throw new Error(`refusing to write into ${OUT}`);
function kn5Textures(buf) {
  let o = 0; const i32 = () => { const v = buf.readInt32LE(o); o += 4; return v; };
  const magic = buf.toString('latin1', 0, 6); o = 6; if (magic !== 'sc6969') throw new Error(`not a kn5: ${magic}`);
  const version = i32(); if (version > 5) i32();
  const n = i32(), out = [];
  for (let k = 0; k < n; k++) { const active = i32(), len = i32(), name = buf.toString('utf8', o, o + len); o += len; const size = i32(); o += size; out.push({ name, active, bytes: size }); }
  return { version, textures: out };
}
(async () => {
  const D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish.js'));
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const { makeExporter } = require(path.join(T, 'app/export/export.js'));
  const open = D.parse(fs.readFileSync(path.join(T, 'fixtures-d431', 'testtrack10-open.t180track'), 'utf8'));
  const fin = F.finishToStart(open), text = D.serialize({ ...fin.doc, name: NAME });
  console.log('plan:', fin.plan.report.slice(0, 110));
  const ex = await makeExporter(async (rel) => fs.readFileSync(path.join(T, rel), 'utf8'));
  const s = await createCoreShell({ brushFn: null, exporter: ex, autosaveMs: 0, storage: { openDoc: async () => text } });
  await s.open(NAME);
  if (!s.getState().history.present.closed) throw new Error('the opened document is not closed');
  const TX = require(path.join(T, 'app/core/textures.js'));
  const ctl = TX.createCoreTextures({ segments: () => s.getState().resolved.segments, closed: () => !!s.getState().resolved.closed, kind: 'asphalt', edge: false });
  const textures = ctl.current(); if (!textures) throw new Error('no texture set built');
  console.log('textures:', ctl.state.kind, 'budget', ctl.state.budget && (ctl.state.budget.bytes / 1048576).toFixed(1) + ' MiB');
  let out;
  try { out = s.buildExport({ textures }); } catch (e) { console.log(JSON.stringify({ refused: e.code, message: String(e.message).slice(0, 400), reds: (e.red || []).slice(0, 8).map((r) => `${r.reason} ${r.s0}-${r.s1}`) })); process.exitCode = 3; return; }
  const report = { folders: [], warnings: (out.result.warnings || []).map((w) => String(w).slice(0, 240)) };
  for (const f of out.folders) {
    for (const x of f.files) { const p = path.join(OUT, f.folder, x.path); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, Buffer.from(x.bytes)); }
    const kn5 = f.files.find((x) => /\.kn5$/.test(x.path));
    const b = Buffer.from(kn5.bytes), kt = kn5Textures(b);
    report.folders.push({ folder: f.folder, files: f.files.length, kn5: path.join(OUT, f.folder, kn5.path), kn5Bytes: b.length, kn5Sha256: crypto.createHash('sha256').update(b).digest('hex'), kn5Version: kt.version, kn5Textures: kt.textures });
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });
