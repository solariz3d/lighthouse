// pane A, L261 probe (scratch, appended to a COPY of core-pieces-ui.test.js; never committed): an arrow key while the Sculpt bank mark of the 730 piece is held
test('A261 arrow probe', async () => {
  const { P1, mid } = await woundSculpt(700, 760), phi = () => P1.shell.sculptInfo().values.phi, s = handleOf(P1, 'bank:1').screen, out = { mid };
  fire(P1, 'pointerdown', s.x, s.y, { timeStamp: 0 });
  const key = (k) => { const ev = { type: 'keydown', key: k, preventDefault() {} }; for (const f of (P1.doc.listeners.keydown || []).slice()) f(ev); P1.frame(); return Math.round(phi() * 1000) / 1000; };
  out.up = key('ArrowUp'); out.up2 = key('ArrowUp'); out.down = key('ArrowDown');
  fire(P1, 'pointerup', s.x, s.y, { timeStamp: 5 }); P1.frame(); out.released = Math.round(phi() * 1000) / 1000;
  console.log('A261 ' + JSON.stringify(out)); P1.panel.unmount();
});
