'use strict';
// D477 read: the far side per POINT (its share, or the bank it carries when that is larger the same way), the floor from the joint pins; a piece's direction only for the floor.
const fs = require('fs');
const T = 'C:/Users/nname/Downloads/t180-wt-p477';
function patch(file, pairs) {
  let x = fs.readFileSync(file, 'utf8');
  const crlf = x.includes('\r\n'), nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);
  if (crlf) x = nl(x);
  for (const [from0, to0] of pairs) {
    const from = nl(from0), to = nl(to0), n = x.split(from).length - 1;
    if (n !== 1) throw new Error(`${file}: expected once, found ${n}: ${from0.slice(0, 80)}`);
    x = x.replace(from, to);
  }
  fs.writeFileSync(file, x); console.log(`${file}: ${pairs.length} edits`);
}
patch(`${T}/src/core/finish.js`, [
  [`  // On a piece of his a free point starts at the larger of its share and the bank it carries the piece's way (the sign of its shares, else of its pins), its box
  // runs from the floor (the least his pins carry that way; 0 across a roll from upright) to that, and a ringing or tail point keeps its open far side but not
  // its open near one: the straight at 3° starts and stays there, the curve at 3° with a 7° share starts at 7° and is never taken under 3°, the roll keeps its
  // shape; a bank carried the other way is replaced. On a piece that is not his every box and start is as before`,
   `  // On a piece of his a free point's FAR SIDE is its share, or the bank it carries when that is larger and leans the same way; its box runs from the FLOOR (the
  // least his joint pins carry the piece's way, the sign of its shares; 0 across a roll from upright) to that far side; a ringing or tail point keeps its open
  // far side but, when the floor is above 0, not its open near one; and it starts at its far side, except where the share rings (there the start stays the
  // share: the bent TEST 10's p1, his by a 0.19° wobble at its end, went 12° off D473's from a start at the wobble where its share leans the other way). So
  // the straight at 3° starts and stays there, the curve at 3° with a 7° share starts at 7° and is never taken under 3°, the roll keeps its shape, and a bank
  // carried the other way is replaced. On a piece that is not his every box and start is as before`],
  [`    // in the piece's direction, [lo, hi] and the start; then back to the signed bank
    let lo, hi;
    if (ring || tail) { lo = his && f > 0 ? f : -Infinity; hi = Infinity; } else { lo = his && f > 0 ? f : Math.min(0, sd); hi = his ? Math.max(sd, ed, f) : Math.max(sd, 0); }   // only a floor above 0 binds
    if (his && !x.pinned && !ring) x.t = d * Math.max(sd, ed, f);   // not where the share rings: there the start stays the share (a bent piece of his with a 0.19° wobble at its end went 12° off from a start at the wobble)
    x.lo = d > 0 ? lo : -hi; x.hi = d > 0 ? hi : -lo;`,
   `    const far = his && x.share * x.e >= 0 && Math.abs(x.e) > Math.abs(x.share) ? x.e : x.share, fl = his && f > 0 ? d * f : 0;   // the point's far side and the floor, signed
    if (ring || tail) { x.lo = fl && d > 0 ? fl : -Infinity; x.hi = fl && d < 0 ? fl : Infinity; } else { x.lo = Math.min(fl, far); x.hi = Math.max(fl, far); }
    if (his && !x.pinned && !ring) x.t = far;`],
  [`    const x = seq[k], { d, his, f } = hisOf.get(x.p), sd = d * x.share, ed = d * x.e; let ring = false;`,
   `    const x = seq[k], { d, his, f } = hisOf.get(x.p); let ring = false;`],
]);
