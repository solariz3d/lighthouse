// bytes154.js <tree> <saves>: pane E, L154. His good save rebuilt through the REAL panel (fake DOM), his order: length 1000, turn -90, bank 50, the extra bank to 0
// (secondExtra), the panel's own options -> extendCorner on his p1 -> serialize, against his file byte for byte. Also the marks the panel hands the tick layer (marksAt),
// so the label and the stretch's ends are read from the shipped code, and the same after a slide to 420 and a length change to 1200.
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const W = path.resolve(process.argv[2]), SAVES = path.resolve(process.argv[3]), q = (m) => require(path.join(W, m));
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L154: byte check + marks read (BelowNormal; not a timing session)' });
const D = q('src/core/document.js'), TB = q('src/core/turnby.js');
const err = D.parse(fs.readFileSync(path.join(SAVES, 'error.t180track'), 'utf8')), good = fs.readFileSync(path.join(SAVES, 'good.t180track'), 'utf8');
const h = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
(async () => {
  process.argv[2] = W; const { mount } = require(path.join(__dirname, 'mount.js'));
  const out = {};
  { const p = await mount(1000, err); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 50); p.panel.secondExtra('extra:bank:0', 0); p.tick();
    const o = p.panel.options(), txt = D.serialize(TB.extendCorner(p.shell.getState().history.present, o));
    out.good = { options: o.changes, bytes: [Buffer.byteLength(txt), Buffer.byteLength(good)], equal: txt === good, rebuilt: h(txt), his: h(good) };
    const pick = (ms) => ms.map((m) => ({ field: m.field, index: m.index, from: m.from, to: m.to, label: m.label, lit: m.lit }));
    out.marksGood = pick(p.panel.marksAt());
    p.panel.secondSlide('extra:bank:0', 420); p.tick(); out.marksSlid420 = pick(p.panel.marksAt());
    p.type('length m', 1200); p.tick(); out.marksLen1200 = pick(p.panel.marksAt());
    p.panel.unmount(); }
  { const p = await mount(1000, err); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 17.39); p.panel.secondExtra('extra:turnDeg:0', 180); p.tick(); p.panel.secondExtra('extra:bank:0', -34.78); p.tick();
    out.marksS = p.panel.marksAt().map((m) => ({ field: m.field, index: m.index, from: m.from, to: m.to, label: m.label })); p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
