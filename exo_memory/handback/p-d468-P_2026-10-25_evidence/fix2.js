'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
const A = String.fromCharCode(39), B = String.fromCharCode(92) + String.fromCharCode(39);
// 1. the xsec harness: KE2-8's id has a bare apostrophe
{ const p = W + 'test/core_xsec_mutation.test.js'; let s = fs.readFileSync(p, 'utf8'); const o = `KE2-8 the clamp moves the joint${A}s own two points too`; if (s.split(o).length !== 2) throw new Error('KE2-8 anchor'); s = s.replace(o, `KE2-8 the clamp moves the joint${B}s own two points too`); fs.writeFileSync(p, s); console.log('KE2-8 escaped'); }
// 2. core_joint_c2 row 10: close the lap with src code only (the ramp harness copies src/ and tools/, not app/)
{ const p = W + 'test/core_joint_c2.test.js'; let s = fs.readFileSync(p, 'utf8');
  const o = `  const c = require(path.join(T, 'app/core/closejob.js')).runCloseBest({ doc: l }); assert.equal(c.converged, true, \`control: the lap closes (\${c.report})\`);
  const b = F.bankLapWith(c.doc), steps = Cn.jointSteps(b.doc, { channels: ['phi'] });`;
  const n = `  // closed as the press's "last" route does (a local close of the last piece; app/core/closejob.js is not here: the ramp harness copies src/ and tools/ only), then banked as Close banks it
  const c = close(l, { window: [l.pieces.length - 1] }); assert.equal(c.converged, true, \`control: the lap closes (\${c.report})\`);
  const b = F.bankLapWith(c.doc), steps = Cn.jointSteps(b.doc, { channels: ['phi'] });`;
  const EOL = s.includes('\r\n') ? '\r\n' : '\n'; const oo = o.split('\n').join(EOL), nn = n.split('\n').join(EOL); if (s.split(oo).length !== 2) throw new Error('row 10 anchor'); s = s.replace(oo, nn); fs.writeFileSync(p, s); console.log('row 10 closes with close()'); }
