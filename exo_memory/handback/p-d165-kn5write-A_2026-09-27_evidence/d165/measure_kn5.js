// D165 measurement ONLY: walks a real kn5 read-only and prints field-layout statistics (value distributions, never content).
// Usage: node measure_kn5.js <file.kn5>
const fs = require('fs');
const b = fs.readFileSync(process.argv[2]); let o = 0;
const i32 = () => { const v = b.readInt32LE(o); o += 4; return v; };
const u32 = () => { const v = b.readUInt32LE(o); o += 4; return v; };
const f32 = () => { const v = b.readFloatLE(o); o += 4; return v; };
const u8 = () => b[o++];
const str = () => { const n = i32(); const s = b.toString('utf8', o, o + n); o += n; return s; };
const hist = {}; const h = (k, v) => { hist[k] = hist[k] || {}; const key = String(v); hist[k][key] = (hist[k][key] || 0) + 1; };
if (b.toString('latin1', 0, 6) !== 'sc6969') throw new Error('no magic');
o = 6; const version = u32(); h('version', version); if (version > 5) h('v6extra', u32());
const nTex = i32(); h('textures.count', nTex);
for (let k = 0; k < nTex; k++) { h('texture.active', i32()); const n = str(); h('texture.ext', (n.match(/\.[a-z0-9]+$/i) || ['none'])[0].toLowerCase()); const size = i32(); h('texture.magic', b.toString('latin1', o, o + 4).replace(/[^ -~]/g, '?')); o += size; }
const nMat = i32(); h('materials.count', nMat);
for (let k = 0; k < nMat; k++) {
  str(); h('material.shader', str()); h('material.blend', u8()); h('material.alphaTested', u8()); h('material.depthMode', i32());
  const nProp = i32(); h('material.nProps', nProp);
  for (let p = 0; p < nProp; p++) {
    const pn = str(); const v = []; for (let q = 0; q < 10; q++) v.push(f32());
    const used = [v[0] !== 0 ? 'A' : '', v.slice(1, 3).some(x => x !== 0) ? 'B' : '', v.slice(3, 6).some(x => x !== 0) ? 'C' : '', v.slice(6, 10).some(x => x !== 0) ? 'D' : ''].join('') || '-';
    h('prop.slotsUsed', used); h('prop.name:slots', pn + ':' + used);
  }
  const nS = i32(); h('material.nSamplers', nS);
  for (let p = 0; p < nS; p++) { const sn = str(); const slot = i32(); str(); h('sampler.name:slot', sn + ':' + slot); }
}
let wind = { pos: 0, neg: 0, zero: 0 }, uvMin = Infinity, uvMax = -Infinity, vMin = Infinity, vMax = -Infinity, maxNv = 0, bsph = { within: 0, outside: 0 }, tanDotN = [];
let firstNode = null;
function node(depth) {
  const cls = i32(), name = str(), nChild = i32(), active = u8();
  if (!firstNode) firstNode = { cls, depth, nChild, nameIsEmpty: name === '' };
  h('node.class', cls); h('node.active', active);
  if (cls === 1) {
    const m = []; for (let q = 0; q < 16; q++) m.push(f32());
    h('dummy.m[3,7,11]zero', m[3] === 0 && m[7] === 0 && m[11] === 0); h('dummy.m15', m[15]);
    if (/^AC_/i.test(name)) { h('marker.name', name.replace(/\d+/g, 'n')); h('marker.children', nChild); h('marker.row3len', Math.hypot(m[8], m[9], m[10]).toFixed(3)); }
    if (depth === 0) h('root.identity', m.every((x, q) => x === ([0, 5, 10, 15].includes(q) ? 1 : 0)));
  } else if (cls === 2) {
    h('mesh.children', nChild);
    h('mesh.castShadows', u8()); h('mesh.visible', u8()); h('mesh.transparent', u8());
    const nv = u32(); maxNv = Math.max(maxNv, nv); const P = [], N = [];
    for (let v = 0; v < nv; v++) {
      const p = [f32(), f32(), f32()], n = [f32(), f32(), f32()], u = f32(), vv = f32(), t = [f32(), f32(), f32()];
      P.push(p); N.push(n); uvMin = Math.min(uvMin, u); uvMax = Math.max(uvMax, u); vMin = Math.min(vMin, vv); vMax = Math.max(vMax, vv);
      if (tanDotN.length < 20000) tanDotN.push(Math.abs(n[0] * t[0] + n[1] * t[1] + n[2] * t[2]));
    }
    const ni = u32(); const I = []; for (let k = 0; k < ni; k++) I.push(b.readUInt16LE(o + 2 * k)); o += 2 * ni;
    for (let k = 0; k + 2 < ni; k += 3) {
      const [a, c, d] = [P[I[k]], P[I[k + 1]], P[I[k + 2]]]; const e1 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const n = [0, 1, 2].map(j => N[I[k]][j] + N[I[k + 1]][j] + N[I[k + 2]][j]);
      const dd = g[0] * n[0] + g[1] * n[1] + g[2] * n[2]; if (dd > 0) wind.pos++; else if (dd < 0) wind.neg++; else wind.zero++;
    }
    h('mesh.material<n', 'ok'); u32(); h('mesh.layer', u32()); h('mesh.lodIn', f32()); h('mesh.lodOut', f32());
    const c = [f32(), f32(), f32()], r = f32();
    const far = P.reduce((m, p) => Math.max(m, Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2])), 0);
    if (far <= r * 1.001 + 1e-4) bsph.within++; else bsph.outside++;
    h('mesh.isRenderable', u8());
  } else throw new Error('class ' + cls);
  for (let q = 0; q < nChild; q++) node(depth + 1);
}
node(0);
tanDotN.sort((a, c) => a - c);
console.log(JSON.stringify({ bytesLeft: b.length - o, firstNode, hist, winding_vs_normals: wind, u: [uvMin, uvMax], v: [vMin, vMax], maxVerticesInOneMesh: maxNv,
  bsphereContainsVertices: bsph, tangentDotNormal_median: tanDotN[tanDotN.length >> 1], tangentDotNormal_p99: tanDotN[Math.floor(tanDotN.length * 0.99)] }, (k, v) => {
  if (k === 'prop.name:slots' || k === 'sampler.name:slot') return Object.keys(v).length > 40 ? { distinct: Object.keys(v).length } : v; return v; }, 1));
