
// ── pane E, L260 read (scratch, appended to a COPY of core-pieces-ui.test.js; never committed): the Sculpt mark's drag through the panel's own handle host,
// on pieces wound past the bank handle's ±720 range (handles.js KINDS.bank min/max) and across it. Each prints one E260 line.
async function e260wound(a, b) {
  const P1 = await handlePanel(), { shell } = P1, R = Math.PI / 180;
  let w = extend(shell.getState().history.present, { length: 900, targets: { phi: a * R } }); w = extend(w, { length: 150, targets: { phi: b * R } }); shell.commitDoc(w);
  const last = w.pieces.length - 1, at = require('../../src/core/sculpt.js').pieceOffsets(w)[last] + w.pieces[last].length / 2;
  shell.setSculpt(true); P1.frame(); P1.click(at); P1.frame(); P1.frame();
  const si = shell.sculptInfo(); return { P1, si, last };
}
for (const [name, a, b, step] of [
  ['E260 H0 control: wound 340 -> 392 (middle 366), up 30 px', 340, 392, 1],
  ['E260 H1 wound 700 -> 760 (middle 730), up 30 px', 700, 760, 1],
  ['E260 H1b wound 700 -> 760 (middle 730), down 30 px', 700, 760, -1],
  ['E260 H2 held at 710 (middle 710), up 30 px, across 720', 710, 710, 1],
  ['E260 H3 wound -700 -> -760 (middle -730), down 30 px', -700, -760, -1],
  ['E260 H4 held at 350 (middle 350), up 60 px, across 360', 350, 350, 1],
]) {
  test(name, async () => {
    const { P1, si, last } = await e260wound(a, b);
    const out = { selected: si && si.index === last, middle0: si && Math.round(si.values.phi * 1000) / 1000 };
    const h = handleOf(P1, 'bank:1'); out.handle = !!(h && h.screen);
    if (out.selected && out.handle) {
      const v = followMark(P1, 'bank:1', Math.abs(step) === 1 && name.includes('60 px') ? 60 : 30, step, 1);
      out.steps = v.map((x) => Math.round(x * 100) / 100);
      out.firstStep = Math.round((v[0] - out.middle0) * 100) / 100;
      out.monotone = v.every((x, i) => i === 0 || step * (x - v[i - 1]) >= -1e-9);
      out.last = Math.round(v[v.length - 1] * 100) / 100;
      out.label = require('../core/handles.js').format('bank', v[v.length - 1]);
    }
    console.log(`E260 ${name} ${JSON.stringify(out)}`);
    P1.panel.unmount();
  });
}
