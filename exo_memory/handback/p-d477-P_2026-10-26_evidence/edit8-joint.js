'use strict';
// D477 read: the his-signature from the JOINT pins only (a flip's pins inside a long piece carry a bend's wobble and made TEST 10's p1 his, 12° off D473's).
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
  [`seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t: up && !pinned ? t : e, e, share: t, pinned, kh: P.channels.kh[i] }); }`,
   `seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t: up && !pinned ? t : e, e, share: t, pinned, joint: pinned, kh: P.channels.kh[i] }); }   // joint: pinned by the joint rule (D477 reads it), before the flips pin more`],
  [`  // D477 (the chair's row, "D477 read"): THE PLAN NEVER TAKES AWAY A BANK HE LAID. A piece is HIS when a PINNED point of it carries a bank (a straight he banked
  // 3° has 3° at both pinned ends, a gentle curve carried at 3° the same, his roll to 3° has 3° at its far end); a piece this press laid has its pins at upright,
  // or at a relaxed joint none. The pins decide because THE PRESS NEVER MOVES A PIN: a second press reads the same answer and solves the first press's system.`,
   `  // D477 (the chair's row, "D477 read"): THE PLAN NEVER TAKES AWAY A BANK HE LAID. A piece is HIS when a point its JOINTS pin carries a bank (a straight he banked
  // 3° has 3° at both pinned ends, a gentle curve carried at 3° the same, his roll to 3° has 3° at its far end); a piece this press laid has its joint pins at
  // upright, or at a relaxed joint none. The joint pins decide because THE PRESS NEVER MOVES A PIN: a second press reads the same answer and solves the first
  // press's system. (Not a flip's pins: on TEST 10 closed by a bend, a flip pinned inside the 1,000 m p1 carried the seam row's 0.19° wobble and made the whole
  // piece his, 12° off D473's.)`],
  [`    const pts = seq.filter((x) => x.p === p), pins = pts.filter((x) => x.pinned), d = Math.sign(pts.reduce((a, x) => a + x.share, 0)) || Math.sign(pins.reduce((a, x) => a + x.e, 0)) || 1;`,
   `    const pts = seq.filter((x) => x.p === p), pins = pts.filter((x) => x.joint), d = Math.sign(pts.reduce((a, x) => a + x.share, 0)) || Math.sign(pins.reduce((a, x) => a + x.e, 0)) || 1;`],
]);
