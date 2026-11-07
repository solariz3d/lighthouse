// vdiff.js <his kn5> <our kn5> <mesh name>...: per named mesh, vertex counts, how many positions moved, the largest move, and where the moved vertices lie
// (their index range, against the mesh's vertex count); a mesh's indices are compared as a whole
'use strict';
const fs = require('fs');
function meshes(b, want) {
  let o = 0; const out = new Map();
  const i32 = () => { const v = b.readInt32LE(o); o += 4; return v; }, u32 = () => { const v = b.readUInt32LE(o); o += 4; return v; };
  const str = () => { const n = i32(); const s = b.toString('utf8', o, o + n); o += n; return s; };
  o = 6; const version = u32(); if (version > 5) u32();
  const nTex = i32(); for (let k = 0; k < nTex; k++) { i32(); str(); const size = i32(); o += size; }
  const nMat = i32(); for (let k = 0; k < nMat; k++) { str(); str(); o += 6; const nProp = i32(); for (let p = 0; p < nProp; p++) { str(); o += 40; } const nSamp = i32(); for (let p = 0; p < nSamp; p++) { str(); i32(); str(); } }
  const node = () => {
    const cls = i32(), name = str(), nChild = i32(); o += 1;
    if (cls === 1) o += 64;
    else { o += 3; const nv = u32(), vAt = o; o += nv * 44; const ni = u32(), iAt = o; o += ni * 2; o += 33;
      if (want.has(name)) { const P = []; for (let v = 0; v < nv; v++) P.push([0, 1, 2].map((k) => b.readFloatLE(vAt + v * 44 + k * 4))); out.set(name, { P, I: b.subarray(iAt, iAt + ni * 2).toString('hex') }); } }
    for (let c = 0; c < nChild; c++) node();
  };
  node(); return out;
}
const want = new Set(process.argv.slice(4)), A = meshes(fs.readFileSync(process.argv[2]), want), B = meshes(fs.readFileSync(process.argv[3]), want);
for (const n of want) {
  const a = A.get(n), b = B.get(n); if (!a || !b) { console.log(`${n}: missing in ${!a ? 'his' : 'ours'}`); continue; }
  if (a.P.length !== b.P.length) { console.log(`${n}: vertices ${a.P.length} vs ${b.P.length}`); continue; }
  let moved = 0, max = 0, lo = Infinity, hi = -1;
  a.P.forEach((p, i) => { const d = Math.hypot(p[0] - b.P[i][0], p[1] - b.P[i][1], p[2] - b.P[i][2]); if (d > 0) { moved++; max = Math.max(max, d); lo = Math.min(lo, i); hi = Math.max(hi, i); } });
  console.log(`${n}: vertices ${a.P.length}, indices ${a.I === b.I ? 'same' : 'differ'}; moved ${moved}, largest ${(max * 1000).toFixed(2)} mm, at vertex ${lo}..${hi}`);
}
