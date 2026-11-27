
// ── pane E, L260 ±720 completion read (scratch, appended to a COPY of core-pieces-ui.test.js at e7b9128 after e260_rows.part.js; never committed) ──
const e261steps = (v, mid, dir) => { const moved = v.map((x, i) => dir * (x - (i ? v[i - 1] : mid))); return { first: Math.round(moved[0] * 1000) / 1000, allShare: moved.every((d) => Math.abs(d - 0.45) <= 0.01), minStep: Math.round(Math.min(...moved) * 1000) / 1000, maxStep: Math.round(Math.max(...moved) * 1000) / 1000 }; };
for (const [name, a, b, n, dir] of [['E261 G1 middle 730, up 400 px (two turns past)', 700, 760, 400, 1], ['E261 G2 held at 1070, up 30 px across 1080', 1070, 1070, 30, 1], ['E261 G2b held at -1070, down 30 px across -1080', -1070, -1070, 30, -1]]) {
  test(name, async () => {
    const { P1, mid } = await woundSculpt(a, b), v = followMark(P1, 'bank:1', n, dir, 1);
    console.log(`E261 ${name} ${JSON.stringify({ mid, last: Math.round(v[v.length - 1] * 100) / 100, ...e261steps(v, mid, dir), label: require('../core/handles.js').format('bank', v[v.length - 1]) })}`);
    P1.panel.unmount();
  });
}
const e261key = (P1, k) => { const ev = { type: 'keydown', key: k, preventDefault() {} }; for (const f of (P1.doc.listeners.keydown || []).slice()) f(ev); P1.frame(); };
test('E261 G3 arrows on the held Sculpt mark at 730: up, up, down, down, down, then release; and a wheel notch down', async () => {
  const { P1, mid } = await woundSculpt(700, 760), phi = () => Math.round(P1.shell.sculptInfo().values.phi * 1000) / 1000, s = handleOf(P1, 'bank:1').screen, seq = [];
  fire(P1, 'pointerdown', s.x, s.y, { timeStamp: 0 });
  for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowDown']) { e261key(P1, k); seq.push(phi()); }
  fire(P1, 'pointerup', s.x, s.y, { timeStamp: 5 }); P1.frame(); const released = phi();
  const s2 = handleOf(P1, 'bank:1').screen; fire(P1, 'wheel', s2.x, s2.y, { deltaY: 100 }); P1.frame();
  console.log(`E261 G3 ${JSON.stringify({ mid, seq, released, wheelDown: phi() })}`);
  P1.panel.unmount();
});
// the GHOST's bank handle must keep its ±720 (the order's item 2): by drag (720g), by arrow and by wheel, at and just under 720
for (const typed of ['720', '719.99', '-720']) {
  test(`E261 G4 the ghost's bank handle with the field typed ${typed}: an arrow away from 0 while held, a wheel notch away from 0`, async () => {
    const P1 = await handlePanel(), bank = fieldOf(P1, 'bank °'); bank.value = typed; bank.oninput(); P1.frame(); P1.frame();
    const h = handleOf(P1, 'bank:1'); const out = { typed, onStage: !!(h && h.screen), sculpt: !!P1.shell.getState().sculpt };
    if (out.onStage) {
      const steps = []; P1.doc.addEventListener('t180:handle-step', (e) => steps.push(e.detail.value));
      const away = Number(typed) < 0 ? 'ArrowDown' : 'ArrowUp';
      fire(P1, 'pointerdown', h.screen.x, h.screen.y, { timeStamp: 0 }); e261key(P1, away); e261key(P1, away);
      out.afterArrows = bank.value; fire(P1, 'pointerup', h.screen.x, h.screen.y, { timeStamp: 5 }); P1.frame(); out.released = bank.value;
      bank.value = typed; bank.oninput(); P1.frame(); P1.frame();
      const h2 = handleOf(P1, 'bank:1').screen; fire(P1, 'wheel', h2.x, h2.y, { deltaY: Number(typed) < 0 ? 100 : -100 }); P1.frame(); out.afterWheel = bank.value; out.stepValues = steps;
    }
    console.log(`E261 G4 ${JSON.stringify(out)}`);
    P1.panel.unmount();
  });
}
