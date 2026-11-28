// y1kink.js <tree>: the right rim of the start run's road BEFORE Even (flat, a grab at 30), read on the cross-section every 0.25 m from s 41 to 46, against the
// straight line between whole metres: does the road as the builder makes it bend between whole metres? Synthetic fixture only.
'use strict';
const path = require('path');
const T = process.argv[2];
const AD = require(path.join(T, 'src/core/adapter.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const F = require(path.join(T, 'test/even_fixtures.js'));
(async () => {
  const sh = await F.shellOn(F.fixture('flat')); F.grab(sh, 30, 16);
  const st = F.present(sh), ra = EV._internal.rimReader(st, -1), rim = (s) => F.at(st, 'l', s) + ra(s);
  const segs = AD.toSegments(st), lens = segs.filter((g) => g.id === st.pieces[0].id).slice(0, 60).map((g) => +g.length.toFixed(3));
  console.log('piece 0 segment lengths (first 60):', JSON.stringify([...new Set(lens)]));
  for (let s = 41; s <= 46 + 1e-9; s += 0.25) {
    const a = Math.floor(s), b = a + 1, lin = rim(a) + (rim(b) - rim(a)) * (s - a);
    console.log('s', s.toFixed(2), 'w', F.at(st, 'w', s).toFixed(3), 'rim', rim(s).toFixed(4), 'off the chord', (rim(s) - lin).toFixed(4));
  }
})().catch((e) => { console.error(e); process.exit(1); });
