// c3d.js (pane E, D, the spot-check of 2026-11-13): a C3D reader written from the format's own description (c3d.org,
// "The C3D File Format User Guide"), independent of the two sprint readers' scripts. Intel (processor 84) files only:
// anything else is refused. Returns { rate, first, last, labels, points[frame][marker] = [x,y,z] or null, params, analog }.
'use strict';
const fs = require('fs');

function read(path) {
  const b = fs.readFileSync(path);
  if (b[1] !== 0x50) throw new Error(path + ': not a C3D file (byte 2 is not 0x50)');
  const pstart = b[0];
  const nPoints = b.readUInt16LE(2), nAnalogPerFrame = b.readUInt16LE(4);
  const first = b.readUInt16LE(6), last = b.readUInt16LE(8);
  const scale = b.readFloatLE(12), dataStart = b.readUInt16LE(16), analogPerSample = b.readUInt16LE(18);
  const rate = b.readFloatLE(20);
  const pbase = (pstart - 1) * 512;
  const proc = b[pbase + 3];
  if (proc !== 84) throw new Error(path + ': processor type ' + proc + ', only Intel (84) is read here');
  // Parameters.
  const groups = {}, params = {};
  let p = pbase + 4;
  for (;;) {
    const nameLen = b.readInt8(p), id = b.readInt8(p + 1);
    if (nameLen === 0) break;
    const n = Math.abs(nameLen);
    const name = b.toString('latin1', p + 2, p + 2 + n).toUpperCase();
    const offPos = p + 2 + n;
    const next = b.readUInt16LE(offPos);
    if (id < 0) {
      groups[-id] = name;
    } else {
      let q = offPos + 2;
      const type = b.readInt8(q), nd = b.readUInt8(q + 1);
      q += 2;
      const dims = [];
      for (let i = 0; i < nd; ++i) dims.push(b.readUInt8(q + i));
      q += nd;
      const size = Math.abs(type);
      const count = dims.reduce((a, d) => a * d, 1);
      let value;
      if (type === -1) {
        // Character arrays: the first dimension is the string length.
        if (nd === 0) value = b.toString('latin1', q, q + 1);
        else {
          const len = dims[0], k = count / len, out = [];
          for (let i = 0; i < k; ++i) out.push(b.toString('latin1', q + i * len, q + (i + 1) * len).trim());
          value = nd === 1 ? out[0] : out;
        }
      } else {
        const out = [];
        for (let i = 0; i < count; ++i) {
          const at = q + i * size;
          out.push(type === 1 ? b.readUInt8(at) : type === 2 ? b.readInt16LE(at) : b.readFloatLE(at));
        }
        value = out;
      }
      params[id + ':' + name] = { value, dims, type };
    }
    if (next === 0) break;
    p = offPos + next;
  }
  const P = {};
  for (const k of Object.keys(params)) {
    const [gid, name] = k.split(':');
    P[(groups[gid] || gid) + ':' + name] = params[k].value;
  }
  let labels = P['POINT:LABELS'];
  if (!Array.isArray(labels)) labels = [labels];
  if (P['POINT:LABELS2']) labels = labels.concat(P['POINT:LABELS2']);
  labels = labels.slice(0, nPoints);
  if (!(scale < 0)) throw new Error(path + ': integer data, not read here');
  // Data: per frame, nPoints x (x, y, z, residual word) floats, then nAnalogPerFrame floats.
  const frames = last - first + 1;
  const stride = (nPoints * 4 + nAnalogPerFrame) * 4;
  let at = (dataStart - 1) * 512;
  if (at + frames * stride > b.length) throw new Error(path + ': data shorter than the header says');
  const points = [], analog = [];
  for (let f = 0; f < frames; ++f) {
    const row = [];
    for (let m = 0; m < nPoints; ++m) {
      const x = b.readFloatLE(at), y = b.readFloatLE(at + 4), z = b.readFloatLE(at + 8), r = b.readFloatLE(at + 12);
      at += 16;
      // The residual word: its low byte as a signed integer is negative for a point not seen in this frame.
      const resid = Math.round(r);
      row.push(resid < 0 || (x === 0 && y === 0 && z === 0) ? null : [x, y, z]);
    }
    points.push(row);
    const a = new Float32Array(nAnalogPerFrame);
    for (let i = 0; i < nAnalogPerFrame; ++i) a[i] = b.readFloatLE(at + 4 * i);
    at += 4 * nAnalogPerFrame;
    analog.push(a);
  }
  return { rate, first, last, labels, points, params: P, analog, analogPerSample, nAnalogPerFrame };
}

// Events: [{context, label, time}] with time in seconds as the file stores it (minutes * 60 + seconds).
function events(c) {
  const P = c.params;
  const n = (P['EVENT:USED'] || [0])[0];
  const t = P['EVENT:TIMES'] || [];
  const ctx = [].concat(P['EVENT:CONTEXTS'] || []), lab = [].concat(P['EVENT:LABELS'] || []);
  const out = [];
  for (let i = 0; i < n; ++i) out.push({ context: ctx[i], label: lab[i], time: t[2 * i] * 60 + t[2 * i + 1] });
  return out.sort((a, b) => a.time - b.time);
}

module.exports = { read, events };
