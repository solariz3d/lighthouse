// reasons.js (pane A, L271, after E's read): `rows` adds E's three roads as rows (registered, to be red on 9ab2268); `fix` makes the two reason strings true and
// amends the CHANGELOG (item (2) of the librarian's 11:28Z ruling). usage: node reasons.js rows|fix <worktree>
'use strict';
const fs = require('fs'), path = require('path');
const [MODE, WT] = process.argv.slice(2);
function editor(rel) {
  const f = path.join(WT, rel), raw = fs.readFileSync(f, 'utf8'), crlf = raw.includes('\r\n'); let s = raw.replace(/\r\n/g, '\n');
  return {
    rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor ${n}x: ${a.slice(0, 90)}`); s = s.replace(a, () => b); },
    append(t) { s = s.replace(/\n*$/, '\n') + t; },
    save() { fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s); },
  };
}
if (MODE === 'rows') {
  const C = editor('test/core_even.test.js');
  C.append(`
// L271, the second seat's read (lighthouse exo_memory/handback/p-l271-read-even-E_2026-11-28.md, section 3): where Even keeps the edge it says why, and the reason
// must be true of the road. Three roads where it was not: the width was said to be "still changing" where it is level (the two strings in readSupported for an end
// with no road beyond it). The edge itself was right on all three (kept, 0.00 m).
const levelRoad = (list) => { let d = D.createDoc('reason'); for (const [length, width] of list) d = require('../src/core/turnby.js').extendCorner(d, require('../app/core/panel.js').extendOptions({ length, turn: 0, climb: 0, bank: 0, width, turnAs: 'corner' })); return Object.freeze(d); };
for (const [id, list, level, want] of [
  ['R1: a run from the track\\'s start whose first piece is typed 31 m', [[120, 31], [100, 12], [300, 12]], [0, 10, 20, 30], /^the stretch reaches the track's start, where the road's width differs from the road at the stretch's other end$/],
  ['R2: a 150 m track evened whole (its open end level at 12 m)', [[90, 12], [60, 12]], [110, 120, 130, 140, 150], /^the stretch reaches both ends of the track, so there is no road beyond it to read$/],
  ['R3: a 150 m track level at 31 m everywhere, evened whole', [[90, 31], [60, 31]], [0, 30, 60, 90, 120, 150], /^the stretch reaches both ends of the track, so there is no road beyond it to read$/],
]) {
  test(\`\${id}: Even keeps the edge and its reason is true of the road (no "still changing" where the width is level)\`, () => {
    const d = levelRoad(list), w = level.map((s) => F.at(d, 'w', s));
    assert.ok(F.spread(w) <= 1e-6, \`control: the width is level at \${level.join(', ')} m (\${w.join(', ')})\`);
    const r = EV.even(d, { from: 0, to: 1, value: 14, hold: 'left' });
    assert.equal(r.reading, 'kept');
    assert.match(r.why, want);
    assert.ok(edgeMove(r.doc, d, 'left', 0, runEnd(d, 1)) <= 0.01, 'the edge is kept where it is');
  });
}
`);
  C.save();
  console.log('rows added');
} else if (MODE === 'fix') {
  const E = editor('src/core/even.js');
  E.rep("      else why = o.kind === 'edge' ? `the stretch reaches the track's ${dir < 0 ? 'start' : 'open end'}, where the road's ${WHAT[ch]} is still changing` : `the road's ${WHAT[ch]} is changing away from the road at the stretch's other end`;",
    "      // an edge has no road beyond it, so it is never read as changing: only its value is known, and it differs from the other end's (L271, the second seat's read)\n      else why = o.kind === 'edge' ? `the stretch reaches the track's ${dir < 0 ? 'start' : 'open end'}, where the road's ${WHAT[ch]} differs from the road at the stretch's other end` : `the road's ${WHAT[ch]} is changing away from the road at the stretch's other end`;");
  E.rep("    } else why = a.kind === 'edge' || b.kind === 'edge' ? `the stretch reaches the track's ${a.kind === 'edge' ? 'start' : 'open end'}, and the road's ${WHAT[ch]} is still changing at its other end` : `the road's ${WHAT[ch]} is still changing at both ends of the stretch`;",
    "    } else why = a.kind === 'edge' && b.kind === 'edge' ? 'the stretch reaches both ends of the track, so there is no road beyond it to read'\n      : a.kind === 'edge' || b.kind === 'edge' ? `the stretch reaches the track's ${a.kind === 'edge' ? 'start' : 'open end'}, and the road's ${WHAT[ch]} is still changing at its other end` : `the road's ${WHAT[ch]} is still changing at both ends of the stretch`;");
  E.save();
  const G = editor('CHANGELOG.md');
  G.rep("Every message with an edge kept says which it\n  did, how far the edge moved and where.", "Every message with an edge kept says which it\n  did and how far the edge moved, and, where the road is read, where.");
  G.rep(`(L271): on the largest lap measured on that machine, 13.2 km, a step went from 1.09 s to 0.19 s
  (the grab's step there is 0.10 s), and the release now pauses 0.74 s for that check.`, `(L271): on a 13,233 m closed lap, measured in two sessions on one machine, a step went from 1.09 s to between 0.19 and
  0.31 s (the grab's step there 0.10 to 0.13 s, so Even's is about twice it), and the release now pauses 0.74 to 1.25 s for that check.`);
  G.save();
  console.log('reasons and changelog fixed');
} else throw new Error('rows or fix');
