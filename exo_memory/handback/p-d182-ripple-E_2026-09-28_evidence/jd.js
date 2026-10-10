// ripple: the new default jump at 700-764 km/h (pane E). Pure resolve + validate, no app.
const D = require('./src/doc/index.js'), G = require('./src/geom/index.js'), { validate } = require('./src/validate/index.js');
let d = D.createDoc('t'); for (const w of ['straight', 'straight', 'jump']) d = D.appendWord(d, w);
console.log('jump', JSON.stringify(d.words[2].handles), 'road before', d.words.slice(0, 2).map((w) => [w.font, w.handles.length, +(w.handles.roll1 * 57.3).toFixed(1)]));
for (const k of [460, 700, 745, 750, 755, 764]) {
  const segs = D.resolve(d, { designSpeedKmh: k }).segments, ramp = segs.find((g) => g.part === 'land');
  const v = validate(G.buildPath(segs, { step: 2 }), segs, { designSpeed: k / 3.6 });
  const j = v.jumps[0];
  console.log(k, 'ramp', ramp.length.toFixed(1), 'landings', JSON.stringify(j.landings.map((L) => [L.g, L.caught, L.x && +L.x.toFixed(1)])), 'gap', j.gap && +j.gap.toFixed(1), 'reds', v.red.map((r) => r.reason).join(','));
}
