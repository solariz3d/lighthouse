// usage (from the checkout): node merges.js — counts how often bankPlan's per-piece merge fires on his lay, row 2's cases and ELYSIUM, on a patched copy
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const R = process.cwd(), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'merges-'));
for (const d of ['src', 'app', 'tools']) fs.cpSync(path.join(R, d), path.join(dir, d), { recursive: true, filter: (p) => !/[\\/]app[\\/]test([\\/]|$)/.test(p) });
const f = path.join(dir, 'src/core/adapter.js'), a = 'if (q.a < p.b - 1e-9 && p.a >= lo - 1e-9 && p.b <= hi + 1e-9) {';
let s = fs.readFileSync(f, 'utf8'); if (s.split(a).length !== 2) throw new Error('anchor'); fs.writeFileSync(f, s.replace(a, () => a + ' globalThis.__merges++;'));
globalThis.__merges = 0;
const D = require(path.join(dir, 'src/core/document.js')), { extend } = require(path.join(dir, 'src/core/extend.js')), A = require(path.join(dir, 'src/core/adapter.js'));
const { extendOptions } = require(path.join(dir, 'app/core/panel.js'));
const opts = (length, bank, early) => extendOptions({ length: String(length), turn: '', climb: '', bank: bank === null ? '' : String(bank), width: '', cup: '', edge: '', start: '', tube: '', atStart: early ? { bank: true } : {}, turnAs: 'rate' });
const HIS = [[750, -28.47, 1], [750, 12.01, 1], [750, 55, 0], [350, null, 0], [350, null, 0], [350, 0, 0], [750, -7, 1], [250, -90, 0], [250, -180, 0], [250, -270, 0], [250, -359.99, 0]];
let d = extend(D.createDoc('ribbon'), { length: 1000, family: 'bowl' }); for (const x of HIS) d = extend(d, opts(...x));
A.bankPlan(d); console.log('his lay merges', globalThis.__merges); globalThis.__merges = 0;
for (const name of ['elysium-2026-10-22.t180track']) { A.bankPlan(D.parse(fs.readFileSync(path.join(R, 'test/fixtures', name), 'utf8'))); console.log(name, 'merges', globalThis.__merges); globalThis.__merges = 0; }
for (const t of ['eq-ELYSIUM NEW.t180track', 'eq-TEST 10.t180track', 'eq-CRAZY TEST.t180track']) { A.bankPlan(D.parse(fs.readFileSync(path.join(__dirname, t), 'utf8'))); console.log(t, 'merges', globalThis.__merges); globalThis.__merges = 0; }
fs.rmSync(dir, { recursive: true, force: true });
