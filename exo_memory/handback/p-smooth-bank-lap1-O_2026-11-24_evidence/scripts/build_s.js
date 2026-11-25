// The banked S, two ways, as closed tracks for AC: "today" (rounded banks and today's changes, laid as the builder accepts them now, the as-built check ON)
// and "flow" (the S in one piece with the flowing bank). Both share the lead straight, the turns and the return loop; only the S's bank differs.
// usage: node build_s.js <tree> [--export <outDir>]   (writes nothing without --export; never into AC)
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = process.env.T180_TREE || process.argv[2], OUT = process.argv.includes('--export') ? process.argv[process.argv.indexOf('--export') + 1] : null;
const path = require('path'), fs = require('fs');
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), TB = require(T + '/src/core/turnby.js'), { close } = require(T + '/src/core/close.js');
const DEG = Math.PI / 180;
const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
const lead = (name) => extend(D.createDoc(name), { length: 300, family: 'bowl', first: { w: 33 } });

function flowS(name) {
  const d = TB.extendCorner(lead(name), { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow',
    through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } });
  return extend(d, { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
}
/** Today's S: the same piece, corners and marks, the bank a ROUNDED first ramp and a rounded change at each mark (each from rest to rest), as today's builder lays a
 *  bank. Today's builder REFUSES these marks with its as-built check on (change 1, -20 to -27, needs 83.3 m before the next mark; -27 back to 0 needs 163.7 m, and the
 *  crossing has 55: measured 2026-11-24), so this local copy of turnby has that check stubbed out (UNCHECKED below). It is the bump he would feel, not a track he could lay. */
const UNCHECKED = (() => {
  const Module = require('module'), file = path.join(T, 'src/core/turnby.js'), src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const from = 'const checked = (doc, opts, out) => { checkBankAsBuilt(doc, plainOf(opts), out); return out; };';
  if (src.split(from).length !== 2) throw new Error('turnby: the check line is not there once');
  const m = new Module(file, module); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file));
  m._compile(src.replace(from, 'const checked = (doc, opts, out) => out;'), file);
  return m.exports;
})();
function todayS(name) {
  const chg = MARKS.map((m, k) => ({ from: k ? MARKS[k - 1].at : 80, target: m.deg * DEG }));
  const d = UNCHECKED.extendCorner(lead(name), { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }], phi: chg }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'rounded' });
  return { d: extend(d, { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'rounded' }), marks: [chg] };
}
/** The return loop, closed: a straight, a half turn to the right, the long straight back, a half turn, then close() moves these, keeping the S. */
function closeLoop(d) {
  const first = d.pieces.length;
  d = extend(d, { length: 200 });
  d = TB.extendCorner(d, { length: 600, turnDeg: -180 });
  d = extend(d, { length: 900 });
  d = TB.extendCorner(d, { length: 600, turnDeg: -180 });
  d = extend(d, { length: 150 });
  const edited = []; for (let i = 0; i < first; i++) edited.push(i);   // close() moves the pieces NOT named here freely and these at 1/wEdit: the lead, the S and its ease-out are kept
  const r = close(d, { edited });
  if (!r.converged) throw new Error('not closed: ' + r.report.slice(0, 400));
  return r.doc;
}

async function main() {
  const t = todayS('Smooth S today'), f = flowS('Smooth S flow');
  const docs = { today: closeLoop(t.d), flow: closeLoop(f) };
  console.log('today marks used:', JSON.stringify(t.marks.map((li) => li.map((c) => ({ from: c.from, deg: +(c.target / DEG).toFixed(2) })))));
  for (const [k, d] of Object.entries(docs)) console.log(k, 'pieces', d.pieces.length, 'length', d.pieces.reduce((a, P) => a + (P.length || 0), 0).toFixed(1), 'closed', d.closed);
  if (OUT) {
    const C = require(T + '/app/core/coreshell.js'), { makeExporter } = require(T + '/app/export/export.js');
    const get = async (p) => fs.readFileSync(path.join(T, p), 'utf8');
    const noStorage = { openDoc: async () => { throw new Error('none'); }, listDocs: async () => [] };
    for (const [k, d] of Object.entries(docs)) {
      const sh = await C.createCoreShell({ storage: noStorage, exporter: await makeExporter(get), autosaveMs: 0 }); sh.adopt(d);
      const out = sh.buildExport();
      for (const F of out.folders) for (const file of F.files) { const p = path.join(OUT, F.folder, file.path); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, file.bytes); }
      fs.writeFileSync(path.join(OUT, `${k}.t180track`), D.serialize(d));
      console.log(k, 'exported:', out.folders.map((F) => `${F.folder} (${F.files.length} files)`).join(', '));
    }
  }
  return docs;
}
module.exports = { flowS, todayS, closeLoop, MARKS };
if (require.main === module) main().catch((e) => { console.error(e.code || '', e.message); process.exit(1); });
