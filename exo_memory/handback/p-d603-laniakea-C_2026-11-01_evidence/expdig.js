// expdig.js <repo> <doc>: the app's export of a closed core document into a temp dir; prints the sha256 of every file but the builder note (it holds a time)
const os = require('os'), fs = require('fs'), path = require('path'), crypto = require('crypto'); os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [R, F] = process.argv.slice(2).map((p) => path.resolve(p));
const D = require(R + '/src/core/document.js'), AD = require(R + '/src/core/adapter.js'), FW = require(R + '/src/export/fromwords.js');
const { startLayout, spawnsLayout } = require(R + '/app/core/coreshell.js');
const doc = D.parse(fs.readFileSync(F, 'utf8')), segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
const markers = doc.spawns ? spawnsLayout(doc, segs, lift, start, {}).layout : startLayout(segs, lift, start);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180-d603-'));
try {
  const r = FW.exportSegments(segs, { name: 'ELYSIUM', liftPath: lift, start }, { outDir: dir, markers });
  for (const f of r.folders) for (const x of f.files.slice().sort()) if (x !== '.t180b-builder.json') console.log(crypto.createHash('sha256').update(fs.readFileSync(path.join(f.dir, x))).digest('hex').slice(0, 16), x);
} catch (e) { console.log('REFUSED', e.code, String(e.message).slice(0, 200)); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
