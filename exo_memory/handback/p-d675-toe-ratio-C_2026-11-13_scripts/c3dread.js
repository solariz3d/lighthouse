// c3dread.js: readC3d cut whole from pane C's stomp/scripts/sacr.js (the reader used for the L205 refit), as a module.
'use strict';
const fs = require('fs');
function readC3d(path) {
  const b = fs.readFileSync(path);
  const paramBlock = b[0];
  const ph = (paramBlock - 1) * 512;
  const proc = b[ph + 3];
  if (proc !== 84) throw new Error(`${path}: processor type ${proc}, only Intel (84) is read`);
  const nPoints = b.readUInt16LE(2), nAnalog = b.readUInt16LE(4), first = b.readUInt16LE(6), last = b.readUInt16LE(8);
  const scale = b.readFloatLE(12), dataBlock = b.readUInt16LE(16), rate = b.readFloatLE(20);
  // Parameters.
  const groups = {}, params = {};
  let at = ph + 4;
  for (;;) {
    const nchar = b.readInt8(at), id = b.readInt8(at + 1);
    if (nchar === 0) break;
    const n = Math.abs(nchar);
    const name = b.toString('latin1', at + 2, at + 2 + n).toUpperCase();
    const next = b.readInt16LE(at + 2 + n);
    const body = at + 4 + n;
    if (id < 0) groups[-id] = name;
    else {
      const type = b.readInt8(body), nd = b[body + 1];
      const dims = [];
      for (let i = 0; i < nd; i++) dims.push(b[body + 2 + i]);
      const d0 = body + 2 + nd;
      const count = dims.reduce((x, y) => x * y, 1);
      let value;
      if (type === -1) {   // characters: dims[0] is the string length
        const len = dims[0] || 1, strs = count / len;
        value = [];
        for (let i = 0; i < strs; i++) value.push(b.toString('latin1', d0 + i * len, d0 + (i + 1) * len).trim());
      } else {
        const size = Math.abs(type);
        value = [];
        for (let i = 0; i < count; i++) {
          const o = d0 + i * size;
          value.push(type === 4 ? b.readFloatLE(o) : type === 2 ? b.readInt16LE(o) : b.readInt8(o));
        }
      }
      params[`${groups[id] || id}:${name}`] = value;
    }
    if (next === 0) break;
    at = at + 2 + n + next;
  }
  if (!(scale < 0)) throw new Error(`${path}: integer point data is not read`);
  const frames = last - first + 1;
  const analogPerFrame = nAnalog;
  const stride = (nPoints * 4 + analogPerFrame) * 4;
  const d = (dataBlock - 1) * 512;
  const labels = params['POINT:LABELS'] || [];
  const point = (name) => {
    const i = labels.findIndex((l) => l.toUpperCase() === name);
    if (i < 0) throw new Error(`${path}: no marker ${name}`);
    const out = [];
    for (let f = 0; f < frames; f++) {
      const o = d + f * stride + i * 16;
      out.push([b.readFloatLE(o), b.readFloatLE(o + 4), b.readFloatLE(o + 8), b.readFloatLE(o + 12)]);
    }
    return out;
  };
  return { rate, first, frames, params, point };
}
module.exports = { readC3d };
