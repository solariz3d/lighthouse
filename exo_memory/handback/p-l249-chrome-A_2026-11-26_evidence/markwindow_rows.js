
// L249 (the chrome refactor; the packet: "Put their radius on the scale (r1 x the look's factor) and leave fill, sheen and glow as they are"): a label window's corner is
// the chrome's smallest step, r1 (2 px at factor 1), times the look's own --radius-factor. It is a plain number, since the canvas reads it with parseFloat (markwindow.js)
test('W7: each look\'s window corner is the chrome scale\'s r1 (2 px) times that look\'s radius factor, written as a plain number', () => {
  const got = {}, want = {};
  for (const look of LOOKS) {
    const v = varsOf(look);
    got[look] = v['--mark-win-radius']; want[look] = String(2 * Number(v['--radius-factor']));
    assert.match(String(v['--radius-factor']), /^\d+(\.\d+)?$|^\.\d+$/, `${look} sets its --radius-factor`);
  }
  assert.deepEqual(Object.fromEntries(Object.entries(got).map(([k, x]) => [k, String(Number(x))])), want, 'the label window\'s radius per look');
});
