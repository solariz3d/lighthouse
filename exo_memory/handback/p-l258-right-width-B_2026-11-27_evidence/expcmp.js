// expcmp.js (pane B, L258 step 4; written again on L, D's mnm.js did not travel): each saved track's EXPORT, as the app makes it, on one tree.
// For every core track (an `eq-` file) in a folder of COPIES of his saved tracks: the core shell opened on its text (app/core/coreshell.js open, through
// a storage that hands back the copy), then the shell's buildExport with the app's own exporter (app/export/export.js makeExporter): Export for a closed
// track, the Test export for an open one, as the two buttons run them. Every file it writes gets a sha256. A track the shell does not open, or an export
// it refuses, is recorded with its message or code. A file with no `eq-` (the old piece builder's word tracks, unlisted by the core shell) is counted
// and skipped. The CONTROL: the first core track is exported a second time in the same process, so an export that differs from itself is seen.
// No track name is written: each is its index in sorted order and a sha256 of its text.
// usage: node --max-old-space-size=4096 expcmp.js <tree> <tracks dir> <out.json>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [tree, dir, out] = process.argv.slice(2);
const sha = (b) => crypto.createHash('sha256').update(typeof b === 'string' ? Buffer.from(b, 'utf8') : Buffer.from(b)).digest('hex');
const { createCoreShell } = require(path.join(tree, 'app/core/coreshell.js'));
const { makeExporter } = require(path.join(tree, 'app/export/export.js'));
const get = async (rel) => fs.readFileSync(path.join(tree, rel), 'utf8');

async function exportOne(ex, text, name) {
  const sh = await createCoreShell({ brushFn: null, exporter: ex, storage: { openDoc: async () => text }, autosaveMs: 0 });
  await sh.open(name);
  const st = sh.getState();
  if (st.name !== name) return { opened: false, message: String(st.message || '') };
  const closed = !!sh.exportDoc().closed, kind = closed ? 'export' : 'test export';
  let r;
  try { r = sh.buildExport(closed ? {} : { test: true }); } catch (e) { return { opened: true, kind, refused: (e && e.code) || 'ERROR', message: String((e && e.message) || e).slice(0, 300) }; }
  const files = {};
  // the ownership marker (src/export/fromwords.js MARKER_FILE) records `written: new Date().toISOString()`, the export's own clock: it is hashed with that one
  // field taken out (and only that field: everything else in it, its geometry and its file list, is compared). A folder is keyed by its index, never its name
  for (const [fi, f] of r.folders.entries()) for (const x of f.files) {
    let b = x.bytes;
    if (/(^|\/)\.t180b-builder\.json$/.test(x.path)) { const o = JSON.parse(Buffer.from(b).toString('utf8')); if (!('written' in o)) throw new Error('the marker has no written field'); delete o.written; b = JSON.stringify(o); }
    files[`folder${fi}/${x.path}`] = sha(b);
  }
  return { opened: true, kind, files };
}

(async () => {
  const ex = await makeExporter(get);
  const all = fs.readdirSync(dir).filter((f) => f.endsWith('.t180track')).sort();
  const core = all.filter((f) => f.startsWith('eq-'));
  const rows = [];
  let first = null;
  for (const [i, f] of core.entries()) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8'), name = f.slice(3, -'.t180track'.length);
    const t0 = Date.now(), res = await exportOne(ex, text, name), row = { n: i, text: sha(text).slice(0, 16), ...res };
    if (i === 0) first = res;
    row.ms = Date.now() - t0; rows.push(row);
    process.stderr.write(`track ${i}: ${row.opened ? row.kind : 'not opened'} ${row.refused ? 'refused ' + row.refused : row.files ? Object.keys(row.files).length + ' files' : ''} ${row.ms} ms\n`);
  }
  let control = null;
  if (core.length) {
    const f = core[0], text = fs.readFileSync(path.join(dir, f), 'utf8'), again = await exportOne(ex, text, f.slice(3, -'.t180track'.length));
    control = { n: 0, same: JSON.stringify(again) === JSON.stringify(first) };
  }
  fs.writeFileSync(out, JSON.stringify({ tree, files: all.length, core: core.length, skippedNotCore: all.length - core.length, control, rows }, null, 1));
  process.stderr.write(`done: ${core.length} core tracks, ${all.length - core.length} skipped, control same: ${control && control.same}\n`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
