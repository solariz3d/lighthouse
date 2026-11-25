// mnm.js: WHAT MUST NOT MOVE (plan: lighthouse exo_memory/loop/plan_t180_smooth_banked_turns_2026-11-24.md, "What must not move"). For each of his saved tracks
// (copied to G: as tNN.t180track; never read in his folder, never named) and the fixtures F1..F9: the sha256 of D.serialize(D.parse(text)), of the built path
// (A.toPath step 0.5: every sample's s, pos, T, L, U and roll as Float64 bytes) and of every file the exporter writes (through the core shell, as the Export button;
// an open or refused track records its refusal code). One tree per run, so the two trees never share a module cache.
// usage: node mnm.js <t180 tree> <tracks dir> <out.json>
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const [T, TRACKS, OUT] = process.argv.slice(2);
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = require(path.join(T, 'src/core/document.js')), A = require(path.join(T, 'src/core/adapter.js'));
const C = require(path.join(T, 'app/core/coreshell.js')), { makeExporter } = require(path.join(T, 'app/export/export.js'));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const get = async (p) => fs.readFileSync(path.join(T, p), 'utf8');
const noStorage = { openDoc: async () => { throw new Error('none'); }, listDocs: async () => [] };
function pathBytes(doc) {
  const S = A.toPath(doc, { step: 0.5 }).path.samples, f = new Float64Array(S.length * 14);
  S.forEach((x, i) => { const o = i * 14; f[o] = x.s; f.set(x.pos, o + 1); f.set(x.T, o + 4); f.set(x.L, o + 7); f.set(x.U, o + 10); f[o + 13] = x.roll; });
  return Buffer.from(f.buffer);
}
async function exportOf(doc) {
  const sh = await C.createCoreShell({ storage: noStorage, exporter: await makeExporter(get), autosaveMs: 0 }); sh.adopt(doc);
  try {
    const out = sh.buildExport(), files = {};
    for (const F of out.folders) for (const file of F.files) files[`${F.folder.replace(/^t180b_[a-z0-9_]+?(_[a-z]+)?$/, 'FOLDER$1')}/${file.path.replace(/^t180b_[a-z0-9_]+\.kn5$/, 'TRACK.kn5')}`] = sha(file.path === '.t180b-builder.json' ? JSON.stringify({ ...JSON.parse(Buffer.from(file.bytes).toString('utf8')), written: 'CLOCK' }) : Buffer.from(file.bytes));   // the marker's 'written' is the wall clock
    return { files };
  } catch (e) { return { refused: e.code || e.name, msgSha: sha(String(e.message)) }; }
}
(async () => {
  const items = [];
  for (const f of fs.readdirSync(TRACKS).filter((x) => /^t\d\d\.t180track$/.test(x)).sort()) items.push({ id: f.replace('.t180track', ''), text: fs.readFileSync(path.join(TRACKS, f), 'utf8') });
  for (let k = 1; k <= 9; k++) { const fx = fs.readdirSync(path.join(T, 'test/fixtures')).find((n) => n.startsWith(`F${k}-`) && n.endsWith('.core2.json')); if (!fx) throw new Error(`no fixture F${k}`); items.push({ id: `F${k}`, text: fs.readFileSync(path.join(T, 'test/fixtures', fx), 'utf8') }); }
  const out = {};
  const ONLY = process.env.MNM_ONLY ? new Set(process.env.MNM_ONLY.split(',')) : null;
  for (const it of items) {
    if (ONLY && !ONLY.has(it.id)) continue;
    const row = {};
    let doc;
    try { doc = D.parse(it.text); row.serialize = sha(D.serialize(doc)); } catch (e) { row.parse = e.code || e.name; out[it.id] = row; continue; }
    try { row.path = sha(pathBytes(doc)); } catch (e) { row.path = 'THREW ' + (e.code || e.name); }
    const t0 = Date.now();
    row.export = await exportOf(doc);
    row.exportMs = Date.now() - t0;
    out[it.id] = row;
    process.stderr.write(`${it.id} ${row.export.refused ? 'refused ' + row.export.refused : Object.keys(row.export.files).length + ' files'} ${row.exportMs} ms\n`);
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
