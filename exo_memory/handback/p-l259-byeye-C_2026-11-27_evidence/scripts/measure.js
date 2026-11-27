// measure.js (pane C, L259): the [T2] study's measure, written again on L from its registered tolerances (handback/p-unmakeable-T2-C_2026-11-26.md,
// "The tolerances, named before measuring", and amendments 1, 2, 5, 6), because the study's own lay.js and read stayed on machine D.
// Local only (track data).
//   node measure.js <read.json> <kn5 copy> <doc.t180track> <from> <to> <nudge x> <nudge z> <nudge up> <nudge turn>
// THE READ, as the study registered it: centres, heading, pitch, bank and width from the same ±12 m smoothing (amendment 2); curvature and roll
// rate over ±24 m (amendment 1); the bank against the smoothed normal (amendment 6), the raw station normal reported beside it.
// PLACED as the app places the shadow (app f3cd425, src/reference/ribbon.js placeAt; road.js roadReference: the kn5's AC_START_0, set down on its
// road): a read point Q goes to (Q − start)·R + anchor + nudge, anchor [0,0,0] facing +z (a new document).
// HIS ROAD: the saved document through the core's own path (src/core/adapter.js toPath, 0.5 m samples), its width from the piece's w channel.
// THE ROWS, over the section's read points only (amendment 5): position (nearest point of his line to each read point) 5 m; direction (between
// the tangents there) 3°; bank (the normals' angle about the tangent) 5°; width 1 m; peak curvature within 20% of the read's peak or 0.001 /m;
// roll rate peak within 25% of the read's or 0.5 °/m. Made = every row inside.
// PIECES COUNTED: the document's pieces whose span on his road overlaps the stretch nearest the section's read points.
'use strict';
const fs = require('fs'), path = require('path');
const WT = process.env.T180_WT || 'C:/Consonance/t180-wt-c-l259';
const AD = require(path.join(WT, 'src/core/adapter.js')), D = require(path.join(WT, 'src/core/document.js'));
const { readKn5 } = require(path.join(__dirname, 'tools', 'kn5.cjs'));
const DEG = 180 / Math.PI;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a) => Math.hypot(a[0], a[1], a[2]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = len(a); return l > 0 ? a.map((v) => v / l) : [0, 0, 0]; };
const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(unit(a), unit(b))))) * DEG;

/**
 * The read on an EVEN grid, smoothed as registered. The study's ref.js: "Grid of 9,181 points, 3.982 m apart, ±12 m smoothing" (its hand-back, "How it
 * was done"). Here: the raw centres resampled every G = 3.982 m along their own arc (9,232 points on this read), each of centre, normal and width the
 * mean over ±12 m (±3 points), the tangent the smoothed line's own (k−1 to k+1), and the METRES along the smoothed line (this read: 36,329 m; the
 * study's lap 36,330 m). Curvature and roll rate over ±24 m (±6 points). `raw` is the nearest raw station, for the raw-normal column.
 */
function readRef(read, G = 3.982) {
  const S = read.stations.filter((s) => s.c), ns = S.length, ra = [0];
  for (let k = 1; k < ns; k++) ra.push(ra[k - 1] + len(sub(S[k].c, S[k - 1].c)));
  const gc = [], gn = [], gw = [], raw = [];
  for (let m = 0, j = 0; m <= ra[ns - 1]; m += G) {
    while (j < ns - 2 && ra[j + 1] < m) j++;
    const u = ra[j + 1] > ra[j] ? Math.max(0, Math.min(1, (m - ra[j]) / (ra[j + 1] - ra[j]))) : 0, A = S[j], B = S[j + 1];
    gc.push([0, 1, 2].map((i) => A.c[i] + u * (B.c[i] - A.c[i]))); gn.push(unit([0, 1, 2].map((i) => A.n[i] + u * (B.n[i] - A.n[i]))));
    gw.push(A.width + u * (B.width - A.width)); raw.push(u < 0.5 ? A : B);
  }
  const n = gc.length, cl = (k) => Math.max(0, Math.min(n - 1, k)), H = Math.round(12 / G), H2 = Math.round(24 / G);
  const P = [], N = [], W = [];
  for (let k = 0; k < n; k++) {
    let c = [0, 0, 0], nn = [0, 0, 0], w = 0, m = 0;
    for (let j = k - H; j <= k + H; j++) { const q = cl(j); c = add(c, gc[q]); nn = add(nn, gn[q]); w += gw[q]; m++; }
    P.push(c.map((v) => v / m)); N.push(unit(nn)); W.push(w / m);
  }
  const arc = [0]; for (let k = 1; k < n; k++) arc.push(arc[k - 1] + len(sub(P[k], P[k - 1])));
  const T = P.map((_, k) => unit(sub(P[cl(k + 1)], P[cl(k - 1)])));
  const kap = P.map((_, k) => { const a = cl(k - H2), b = cl(k + H2); return arc[b] > arc[a] ? angle(T[b], T[a]) / DEG / (arc[b] - arc[a]) : 0; });
  const bankOf = (t, nrm) => { const L = unit(cross([0, 1, 0], t)), U = unit(cross(t, L)); return Math.atan2(dot(nrm, L), dot(nrm, U)) * DEG; };
  const bank = P.map((_, k) => bankOf(T[k], N[k]));
  const rollRate = P.map((_, k) => { const a = cl(k - H2), b = cl(k + H2); let d = bank[b] - bank[a]; d = ((d + 540) % 360) - 180; return arc[b] > arc[a] ? Math.abs(d) / (arc[b] - arc[a]) : 0; });
  return { n, arc, P, T, N, W, kap, bank, rollRate, raw };
}

/** The read placed as the app places the shadow, with the nudge he typed. */
function placer(read, kn5File, nudge) {
  const st = /.json$/i.test(kn5File) ? JSON.parse(fs.readFileSync(kn5File, "utf8")) : readKn5(kn5File).dummies.find((d) => /^AC_START_0$/i.test(d.name));   // start.json: the AC_START_0 cached from the kn5 copy
  const sT = unit(st.fwd), s0 = [st.pos[0], read.stations[0].c[1], st.pos[2]];   // set-down height: the read's first station (inferred: within cm)
  const th = Math.atan2(sT[2], sT[0]) - Math.atan2(1, 0) + nudge.turn / DEG, c = Math.cos(th), sn = Math.sin(th);
  const rot = (v) => [v[0] * c + v[2] * sn, v[1], -v[0] * sn + v[2] * c];
  return { point: (Q) => add(rot(sub(Q, s0)), [nudge.x, nudge.up, nudge.z]), dir: rot };
}

/** His road: the core's path, with each sample's piece and width. */
function hisRoad(doc) {
  D.checkDoc(doc);
  const { segments, path: p } = AD.toPath(doc, { step: 0.5 });
  const byId = new Map(doc.pieces.map((P, i) => [P.id, { P, i }])), first = new Map();
  const S = p.samples.map((x) => {
    const id = segments[x.seg] && segments[x.seg].id, pc = byId.get(id);
    if (pc && !first.has(id)) first.set(id, x.s);
    const w = pc && pc.P.type === 'road' ? D.valuesAt(pc.P, Math.max(0, Math.min(pc.P.length, x.s - first.get(id)))).w : NaN;
    return { s: x.s, pos: x.pos, T: unit(x.T), U: unit(x.U), piece: pc ? pc.i : -1, w };
  });
  return S;
}

function measure({ ref, road, place, from, to }) {
  const ks = []; for (let k = 0; k < ref.n; k++) if (ref.arc[k] >= from && ref.arc[k] <= to) ks.push(k);
  const rows = { position: 0, direction: 0, bank: 0, bankRaw: 0, width: 0 }, where = {}, nearest = [];
  let j0 = 0;
  for (const k of ks) {
    const Q = place.point(ref.P[k]);
    let best = Infinity, bj = 0;
    for (let j = 0; j < road.length; j++) { const d = len(sub(road[j].pos, Q)); if (d < best) { best = d; bj = j; } }
    const r = road[bj], t = place.dir(ref.T[k]), nr = place.dir(ref.N[k]), nRaw = place.dir(unit(ref.raw[k].n));
    // the normals' angle about the tangent: both normals laid into the plane across his tangent
    const across = (v) => unit(sub(v, r.T.map((x) => x * dot(v, r.T))));
    const vals = { position: best, direction: angle(t, r.T), bank: angle(across(nr), across(r.U)), bankRaw: angle(across(nRaw), across(r.U)), width: Math.abs(r.w - ref.W[k]) };
    for (const q of Object.keys(vals)) if (vals[q] > rows[q]) { rows[q] = vals[q]; where[q] = Math.round(ref.arc[k]); }
    nearest.push(bj); j0 = bj;
  }
  // peak curvature and roll rate over the stretch of his road nearest the section
  const jA = Math.min(...nearest), jB = Math.max(...nearest);
  const peakRef = Math.max(...ks.map((k) => ref.kap[k])), rollRef = Math.max(...ks.map((k) => ref.rollRate[k]));
  const hk = [], hr = [];
  for (let j = jA; j <= jB; j++) {
    let a = j, b = j; while (a > 0 && road[j].s - road[a - 1].s <= 24) a--; while (b < road.length - 1 && road[b + 1].s - road[j].s <= 24) b++;
    const ds = road[b].s - road[a].s; if (!(ds > 0)) continue;
    hk.push(angle(road[b].T, road[a].T) / DEG / ds);
    const bk = (x) => { const L = unit(cross([0, 1, 0], x.T)), U = unit(cross(x.T, L)); return Math.atan2(dot(x.U, L), dot(x.U, U)) * DEG; };
    let d = bk(road[b]) - bk(road[a]); d = ((d + 540) % 360) - 180; hr.push(Math.abs(d) / ds);
  }
  const peakHis = Math.max(...hk), rollHis = Math.max(...hr);
  const kTol = Math.max(0.2 * peakRef, 0.001), rTol = Math.max(0.25 * rollRef, 0.5);
  const ratios = { position: rows.position / 5, direction: rows.direction / 3, bank: rows.bank / 5, width: rows.width / 1,
    'peak curvature': Math.abs(peakHis - peakRef) / kTol, 'roll rate': Math.abs(rollHis - rollRef) / rTol };
  const failed = Object.entries(ratios).filter(([, v]) => v > 1).map(([q]) => q);
  const pieces = new Set(); for (let j = jA; j <= jB; j++) if (road[j].piece >= 0) pieces.add(road[j].piece);
  return { made: failed.length === 0, failed, ratios, rows, where, peak: { ref: peakRef, his: peakHis }, roll: { ref: rollRef, his: rollHis },
    pieces: pieces.size, pieceIds: [...pieces].sort((a, b) => a - b), span: [road[jA].s, road[jB].s], points: ks.length };
}

module.exports = { readRef, placer, hisRoad, measure };

if (require.main === module) {
  const [readFile, kn5File, docFile, from, to, x, z, up, turn] = process.argv.slice(2);
  const read = JSON.parse(fs.readFileSync(readFile, 'utf8')), ref = readRef(read);
  const place = placer(read, kn5File, { x: +x, z: +z, up: +up, turn: +turn });
  const doc = JSON.parse(fs.readFileSync(docFile, 'utf8')), road = hisRoad(doc);
  const r = measure({ ref, road, place, from: +from, to: +to });
  const worst = Object.entries(r.ratios).sort((a, b) => b[1] - a[1])[0];
  console.log(`${path.basename(docFile)} ${from}-${to} m: ${r.made ? 'MADE' : 'NOT made (' + r.failed.join('+') + ')'}; pieces in the section ${r.pieces} of ${doc.pieces.length}; worst ${worst[0]} x${worst[1].toFixed(2)}`);
  console.log(`  rows: position ${r.rows.position.toFixed(2)} m, direction ${r.rows.direction.toFixed(2)} deg, bank ${r.rows.bank.toFixed(2)} deg (raw normal ${r.rows.bankRaw.toFixed(2)}), width ${r.rows.width.toFixed(2)} m; peak curvature ${r.peak.his.toFixed(5)} vs ${r.peak.ref.toFixed(5)} /m; roll rate ${r.roll.his.toFixed(3)} vs ${r.roll.ref.toFixed(3)} deg/m; at ${JSON.stringify(r.where)}; ${r.points} read points; his span ${r.span.map((v) => v.toFixed(0)).join('-')} m`);
}
