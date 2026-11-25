// N2's measures from Dorn, Schache & Pandy 2012's SimTK package (subject JA1; G:\consonance-scratch\simtk_ja1, MIT as recorded by the sprint
// reference). A minimal C3D reader (the format's own layout: a 512-byte header, the parameter section, point frames) and, per trial, over each
// right-foot stride (the file's own EVENT "Foot Strike", context "Right"): the trunk's forward lean (SACR to C7 against the vertical, + forward),
// the right wrist's distance from the trunk's midline (+ on its own side, <= 0 across), and how far the wrist reaches ahead of C7.
// Usage: node n2_measure.js [labels]
const fs = require('fs');
const path = require('path');
const ROOT = 'G:/consonance-scratch/simtk_ja1';

function readC3D(file) {
  const b = fs.readFileSync(file);
  const paramBlock = b.readUInt8(0);
  const ps = (paramBlock - 1) * 512;
  const proc = b.readUInt8(ps + 3);  // 84 Intel, 85 DEC, 86 MIPS
  if (proc === 86) throw new Error(file + ': big-endian (MIPS) C3D not handled');
  const f32 = (o) => {
    if (proc === 85) {  // DEC: the two 16-bit words swapped against IEEE, and the exponent 2 higher
      const t = Buffer.from([b[o + 2], b[o + 3], b[o], b[o + 1]]);
      return t.readFloatLE(0) / 4;
    }
    return b.readFloatLE(o);
  };
  // header
  const nPoints = b.readUInt16LE(2), analogPerFrame = b.readUInt16LE(4), first = b.readUInt16LE(6), last = b.readUInt16LE(8);
  const scale = f32(12), dataBlock = b.readUInt16LE(16), rate = f32(20);
  // parameters
  const groups = {}, params = {};
  let o = ps + 4;
  const end = ps + b.readUInt8(ps + 2) * 512;
  while (o < end) {
    const nlen = b.readInt8(o), id = b.readInt8(o + 1);
    if (nlen === 0) break;
    const name = b.toString('ascii', o + 2, o + 2 + Math.abs(nlen)).toUpperCase();
    const offPos = o + 2 + Math.abs(nlen);
    const next = b.readUInt16LE(offPos);
    if (id < 0) groups[-id] = name;
    else {
      let p = offPos + 2;
      const type = b.readInt8(p), nd = b.readUInt8(p + 1);
      p += 2;
      const dims = [];
      for (let i = 0; i < nd; ++i) dims.push(b.readUInt8(p + i));
      p += nd;
      const count = dims.reduce((x, y) => x * y, 1);
      let val;
      if (type === -1) {
        const w = dims[0] || 1, n = nd > 1 ? dims.slice(1).reduce((x, y) => x * y, 1) : 1;
        val = [];
        for (let i = 0; i < n; ++i) val.push(b.toString('ascii', p + i * w, p + (i + 1) * w).trim());
      } else {
        val = [];
        for (let i = 0; i < count; ++i) val.push(type === 1 ? b.readInt8(p + i) : type === 2 ? b.readInt16LE(p + 2 * i) : f32(p + 4 * i));
      }
      params[id + ':' + name] = { val, dims };
    }
    if (next === 0) break;
    o = offPos + next;
  }
  const get = (g, n) => {
    const gid = Object.keys(groups).find((k) => groups[k] === g);
    const e = params[gid + ':' + n];
    return e ? e.val : undefined;
  };
  const labels = get('POINT', 'LABELS') || [];
  const used = (get('POINT', 'USED') || [nPoints])[0];
  const ds = (get('POINT', 'DATA_START') || [dataBlock])[0];
  const nFrames = last - first + 1;
  const floatData = scale < 0;
  const per = used * 4 * (floatData ? 4 : 2) + analogPerFrame * (floatData ? 4 : 2);
  let q = (ds - 1) * 512;
  const frames = [];
  for (let f = 0; f < nFrames; ++f) {
    const pts = [];
    for (let i = 0; i < used; ++i) {
      const base = q + i * 4 * (floatData ? 4 : 2);
      const rd = (k) => (floatData ? f32(base + 4 * k) : b.readInt16LE(base + 2 * k) * scale);
      const res = rd(3);
      pts.push(res < 0 ? null : [rd(0), rd(1), rd(2)]);
    }
    frames.push(pts);
    q += per;
  }
  const evTimes = get('EVENT', 'TIMES') || [], evLabels = get('EVENT', 'LABELS') || [], evCtx = get('EVENT', 'CONTEXTS') || [];
  const events = [];
  for (let i = 0; i < evLabels.length; ++i) events.push({ label: evLabels[i], ctx: evCtx[i], t: evTimes[2 * i] * 60 + evTimes[2 * i + 1] });
  return { labels, frames, rate, first, events, proc };
}

const deg = (r) => (r * 180) / Math.PI;
const trials = [['3.56', 'Run35ms/JA1Gait21.c3d'], ['5.20', 'Run5ms/JA1Gait27.c3d'], ['7.00', 'Run7ms/JA1Gait33.c3d'], ['9.49', 'Run9ms/JA1Gait35.c3d']];
if (process.argv[2] === 'labels') {
  const c = readC3D(path.join(ROOT, trials[3][1]));
  console.log('processor ' + c.proc + ', rate ' + c.rate + ', first frame ' + c.first + ', frames ' + c.frames.length);
  console.log('labels: ' + c.labels.join(' '));
  console.log('events: ' + c.events.map((e) => e.ctx + ' ' + e.label + ' ' + e.t.toFixed(3)).join('; '));
  process.exit(0);
}
// the static trial: the trunk line's standing lean
const staticFile = fs.readdirSync(path.join(ROOT, 'Static')).find((n) => n.toLowerCase().endsWith('.c3d'));
const st = readC3D(path.join(ROOT, 'Static', staticFile));
const L = (c, n) => c.labels.indexOf(n);
function leanOf(sacr, c7) {  // running direction +Y, vertical +Z (the sprint reference's reading of this package)
  return deg(Math.atan2(c7[1] - sacr[1], c7[2] - sacr[2]));
}
{
  let s = 0, n = 0;
  for (const fr of st.frames) {
    const a = fr[L(st, 'SACR')], b2 = fr[L(st, 'C7')];
    if (a && b2) s += leanOf(a, b2), ++n;
  }
  console.log('STATIC ' + staticFile + ': the trunk line SACR to C7 leans ' + (s / n).toFixed(2) + ' deg forward standing (' + n + ' frames)');
  var standLean = s / n;
}
for (const [speed, rel] of trials) {
  const c = readC3D(path.join(ROOT, rel));
  const idx = { SACR: L(c, 'SACR'), C7: L(c, 'C7'), RSH: L(c, 'RSH'), LSH: L(c, 'LSH'), RWR: L(c, 'RWR'), LWR: L(c, 'LWR') };
  const strikes = c.events.filter((e) => /foot strike/i.test(e.label) && /right/i.test(e.ctx)).map((e) => e.t).sort((a, b) => a - b);
  const at = (t) => {  // the frame nearest time t (frame k is at (first - 1 + k) / rate)
    const k = Math.round(t * c.rate - (c.first - 1));
    return c.frames[Math.max(0, Math.min(c.frames.length - 1, k))];
  };
  console.log('\nTRIAL ' + speed + ' m/s (' + rel + '): right strikes at ' + strikes.map((t) => t.toFixed(3)).join(', ') + ' s; markers ' +
    Object.entries(idx).map(([k, v]) => k + (v < 0 ? ' MISSING' : '')).join(' '));
  for (let s = 0; s + 1 < strikes.length; ++s) {
    const t0 = strikes[s], t1 = strikes[s + 1];
    const rows = [];
    let leanSum = 0, leanN = 0;
    for (let pct = 0; pct <= 100; pct += 1) {
      const fr = at(t0 + ((t1 - t0) * pct) / 100);
      const sacr = fr[idx.SACR], c7 = fr[idx.C7], rsh = fr[idx.RSH], lsh = idx.LSH >= 0 ? fr[idx.LSH] : null, rwr = fr[idx.RWR];
      if (!sacr || !c7 || !rwr || !rsh) { rows.push(null); continue; }
      const lean = leanOf(sacr, c7);
      leanSum += lean, ++leanN;
      const midX = (sacr[0] + c7[0]) / 2;
      const side = Math.sign(rsh[0] - midX) || 1;  // the right shoulder's side of the midline
      const fromMid = ((rwr[0] - midX) * side) / 10;  // cm, + on the right arm's own side
      const ahead = (rwr[1] - c7[1]) / 10;  // cm ahead of C7 along the run
      let lfromMid = null;
      if (lsh && idx.LWR >= 0 && fr[idx.LWR]) lfromMid = ((fr[idx.LWR][0] - midX) * -side) / 10;
      rows.push({ pct, lean, fromMid, ahead, lfromMid });
    }
    const ok = rows.filter(Boolean);
    const mn = (k) => ok.reduce((m, r) => (r[k] !== null && r[k] < m.v ? { v: r[k], p: r.pct } : m), { v: 1e9, p: -1 });
    const mx = (k) => ok.reduce((m, r) => (r[k] !== null && r[k] > m.v ? { v: r[k], p: r.pct } : m), { v: -1e9, p: -1 });
    console.log('  stride ' + (s + 1) + ' (' + t0.toFixed(3) + ' to ' + t1.toFixed(3) + ' s, ' + ok.length + '/101 points with all markers):');
    console.log('    trunk lean, deg forward (raw; less the standing ' + standLean.toFixed(2) + '): mean ' + (leanSum / leanN).toFixed(2) + ' (' + (leanSum / leanN - standLean).toFixed(2) +
      '); least ' + mn('lean').v.toFixed(2) + ' at ' + mn('lean').p + '%, most ' + mx('lean').v.toFixed(2) + ' at ' + mx('lean').p + '%');
    console.log('    at 0..100% by 10: ' + [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => { const r = rows[p]; return r ? r.lean.toFixed(1) : '-'; }).join(' '));
    console.log('    right wrist from the midline, cm (+ its own side): least ' + mn('fromMid').v.toFixed(1) + ' at ' + mn('fromMid').p + '%, most ' + mx('fromMid').v.toFixed(1) + ' at ' + mx('fromMid').p + '%');
    console.log('    at 0..100% by 10: ' + [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => { const r = rows[p]; return r ? r.fromMid.toFixed(1) : '-'; }).join(' '));
    if (ok.some((r) => r.lfromMid !== null))
      console.log('    left wrist from the midline, cm (+ its own side): least ' + mn('lfromMid').v.toFixed(1) + ' at ' + mn('lfromMid').p + '%, most ' + mx('lfromMid').v.toFixed(1) + ' at ' + mx('lfromMid').p + '%');
    console.log('    right wrist ahead of C7, cm: least ' + mn('ahead').v.toFixed(1) + ' at ' + mn('ahead').p + '%, most ' + mx('ahead').v.toFixed(1) + ' at ' + mx('ahead').p + '%');
    console.log('    at 0..100% by 10: ' + [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => { const r = rows[p]; return r ? r.ahead.toFixed(1) : '-'; }).join(' '));
    // the pelvis's and the thorax's turn about the vertical: the RASI-LASI line and the RSH-LSH line in the ground plane (X lateral, Y forward),
    // each less its stride mean; + turns the right side forward. Then the lag of the thorax's turn against the pelvis's by the least-squares shift.
    const yaw = (r, l) => deg(Math.atan2(r[1] - l[1], r[0] - l[0]));
    const pel = [], tho = [];
    for (let pct = 0; pct <= 100; pct += 1) {
      const fr = at(t0 + ((t1 - t0) * pct) / 100);
      const ra = fr[L(c, 'RASI')], la = fr[L(c, 'LASI')], rs = fr[idx.RSH], ls = fr[idx.LSH];
      pel.push(ra && la ? yaw(ra, la) : null), tho.push(rs && ls ? yaw(rs, ls) : null);
    }
    if (pel.every((v) => v !== null) && tho.every((v) => v !== null)) {
      const unwrap = (a) => a.map((v, i) => v);
      const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
      const pm = mean(pel), tm = mean(tho);
      const P = unwrap(pel).map((v) => v - pm), T = unwrap(tho).map((v) => v - tm);
      const range = (a) => Math.max(...a) - Math.min(...a);
      let best = 0, bestErr = 1e18, bestSign = 1;
      for (const sgn of [1, -1])
        for (let lag = 0; lag < 100; ++lag) {
          let e = 0;
          for (let i = 0; i < 100; ++i) {
            const d = T[(i + lag) % 100] - sgn * P[i] * (range(T) / Math.max(range(P), 1e-6));
            e += d * d;
          }
          if (e < bestErr) bestErr = e, best = lag, bestSign = sgn;
        }
      console.log('    the pelvis turns ' + range(P).toFixed(1) + ' deg in all (' + (range(P) / 2).toFixed(1) + ' each way), the thorax ' + range(T).toFixed(1) + ' (' +
        (range(T) / 2).toFixed(1) + ' each way), thorax/pelvis ' + (range(T) / range(P)).toFixed(2) + '; the thorax best matches the pelvis ' +
        (bestSign < 0 ? 'OPPOSED' : 'in step') + ' when shifted ' + best + '% of the stride later (' + (best * 3.6).toFixed(0) + ' deg of the cycle)');
      console.log('    pelvis at 0..100% by 10: ' + [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => P[p].toFixed(1)).join(' '));
      console.log('    thorax at 0..100% by 10: ' + [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => T[p].toFixed(1)).join(' '));
    } else console.log('    the pelvis or thorax markers drop out in this stride');
  }
}
