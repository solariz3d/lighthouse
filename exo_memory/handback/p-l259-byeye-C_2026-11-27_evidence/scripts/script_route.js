// script_route.js (pane C, L259): the study's HAND route (corners every N m: the turn and the climb as corners, the end bank and width at each cut,
// values read off the read and typed; the study's "corners50/20/10/5"), laid through the app's own shell and panel fields (app f3cd425:
// app/core/coreshell.js createCoreShell, app/core/panel.js extendOptions with turnAs 'corner'), from HIS start: a new document at the origin facing
// +z, the read placed by the same nudge the card gives him, the lead-in laid the same way and not measured. Then measure.js scores the section.
// It is the calibration of the measure (a 5 m route the study made should read MADE, its failed 10 m route NOT), and the script's count under
// his conditions. Local only (track data).
//   node script_route.js <read.json> <kn5 copy> <from> <to> <lead> <cut m> <x> <z> <up> <turn> [save.json]
'use strict';
const fs = require('fs'), path = require('path');
const WT = process.env.T180_WT || 'C:/Consonance/t180-wt-c-l259';
const { createCoreShell } = require(path.join(WT, 'app/core/coreshell.js'));
const { extendOptions } = require(path.join(WT, 'app/core/panel.js'));
const M = require('./measure.js');
const DEG = 180 / Math.PI;
const unit = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
const wrap = (a) => ((a + 540) % 360) - 180;

(async () => {
  const [readFile, kn5File, from, to, lead, cut, x, z, up, turn, saveFile] = process.argv.slice(2);
  const read = JSON.parse(fs.readFileSync(readFile, 'utf8')), ref = M.readRef(read);
  const place = M.placer(read, kn5File, { x: +x, z: +z, up: +up, turn: +turn });
  const at = (m) => { let k = 0; while (k < ref.n - 1 && ref.arc[k + 1] <= m) k++; return k; };
  // the read's pose at a metre, in his frame: heading and pitch of the placed smoothed tangent; bank (+ = left side up, the panel's sign) of the
  // placed smoothed normal about it; width
  const poseAt = (m) => {
    const k = at(m), t = unit(place.dir(ref.T[k])), n = unit(place.dir(ref.N[k]));
    const L = unit([t[2], 0, -t[0]]), U = unit([t[1] * L[2] - t[2] * L[1], t[2] * L[0] - t[0] * L[2], t[0] * L[1] - t[1] * L[0]]);
    const lean = Math.atan2(n[0] * L[0] + n[1] * L[1] + n[2] * L[2], n[0] * U[0] + n[1] * U[1] + n[2] * U[2]) * DEG;
    return { heading: Math.atan2(t[0], t[2]) * DEG, pitch: Math.asin(Math.max(-1, Math.min(1, t[1]))) * DEG, bank: -lean, width: ref.W[k] };
  };
  const s = await createCoreShell({ brushFn: null, storage: null, autosaveMs: 0 });
  const a0 = +from - +lead, a1 = +to + 24;   // 24 m of pad after the section (the study's amendment 5)
  let m = a0, prev = { heading: 0, pitch: 0 }, refused = 0, pieces = 0;
  const bankSign = process.env.BANK_SIGN ? +process.env.BANK_SIGN : 1;
  while (m < a1 - 0.5) {
    const L = Math.min(+cut, a1 - m), p = poseAt(m + L);
    const opts = extendOptions({ length: L, turn: +wrap(p.heading - prev.heading).toFixed(2), climb: +(p.pitch - prev.pitch).toFixed(2),
      bank: +(bankSign * p.bank).toFixed(1), width: +p.width.toFixed(1), turnAs: 'corner' });
    const before = s.getState().history.present.pieces.length;
    s.extend(opts);
    const after = s.getState().history.present.pieces.length;
    if (after === before) { refused++; console.log(`refused at ${m.toFixed(0)} m: ${s.getState().message}`); break; }
    pieces++; m += L; prev = { heading: p.heading, pitch: p.pitch };
  }
  const doc = s.getState().history.present;
  if (saveFile) fs.writeFileSync(saveFile, JSON.stringify(doc));
  const road = M.hisRoad(doc), r = M.measure({ ref, road, place, from: +from, to: +to });
  const worst = Object.entries(r.ratios).sort((p, q) => q[1] - p[1])[0];
  console.log(`script corners every ${cut} m, ${from}-${to} m from ${a0} m: ${pieces} pieces laid${refused ? ' (REFUSED, stopped)' : ''}; section ${r.made ? 'MADE' : 'NOT made (' + r.failed.join('+') + ')'}; pieces in the section ${r.pieces}; worst ${worst[0]} x${worst[1].toFixed(2)}`);
  console.log(`  rows: position ${r.rows.position.toFixed(2)} m, direction ${r.rows.direction.toFixed(2)} deg, bank ${r.rows.bank.toFixed(2)} deg (raw ${r.rows.bankRaw.toFixed(2)}), width ${r.rows.width.toFixed(2)} m; curvature ${r.peak.his.toFixed(5)} vs ${r.peak.ref.toFixed(5)}; roll rate ${r.roll.his.toFixed(3)} vs ${r.roll.ref.toFixed(3)}; at ${JSON.stringify(r.where)}`);
})().catch((e) => { console.error(e); process.exit(1); });
