// plates.js: each plate contact (|Fz| over 15 N) against the nearest labelled strike and toe-off, to check that frame k
// sits at (k - 1) / rate s. node plates.js <c3d>
'use strict';
const c3d = require('./c3d.js');
const c = c3d.read(process.argv[2]);
const P = c.params, used = P['FORCE_PLATFORM:USED'][0], ch = P['FORCE_PLATFORM:CHANNEL'];
const scale = P['ANALOG:SCALE'], off = P['ANALOG:OFFSET'], gen = P['ANALOG:GEN_SCALE'][0];
const per = c.analogPerSample, nch = c.nAnalogPerFrame / per, arate = c.rate * per;
const start = (P['TRIAL:ACTUAL_START_FIELD'] || [c.first])[0];
const ev = c3d.events(c);
for (let p = 0; p < used; ++p) {
  const z = ch[p * 6 + 2] - 1;   // Fz is the third channel of a type-2 plate
  let on = -1;
  const contacts = [];
  for (let f = 0; f < c.analog.length; ++f)
    for (let s = 0; s < per; ++s) {
      const v = (c.analog[f][s * nch + z] - off[z]) * scale[z] * gen;
      const t = (start - 1) / c.rate + (f * per + s) / arate;
      if (Math.abs(v) > 15 && on < 0) on = t;
      if (Math.abs(v) <= 15 && on >= 0) { contacts.push([on, t]); on = -1; }
    }
  for (const [a, b] of contacts) {
    if (b - a < 0.05) continue;
    const near = (lab, t) => ev.filter((e) => e.label === lab).reduce((best, e) => (Math.abs(e.time - t) < Math.abs(best.time - t) ? e : best), { time: 1e9 });
    const fs = near('Foot Strike', a), fo = near('Foot Off', b);
    console.log(`plate ${p + 1}: ${a.toFixed(4)}-${b.toFixed(4)} s; ${fs.context} strike ${fs.time.toFixed(3)} (plate ${((a - fs.time) * 1000).toFixed(1)} ms after), ${fo.context} off ${fo.time.toFixed(3)} (plate ends ${((fo.time - b) * 1000).toFixed(1)} ms before)`);
  }
}
