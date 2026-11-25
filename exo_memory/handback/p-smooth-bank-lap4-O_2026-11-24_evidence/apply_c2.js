// LAP 4 item c, second form: the whole metres up to FLOW_NEAR_M first, then 15b1306's search (FLOW_SEARCH_M steps up, back by the metre); the message drops "at least"
'use strict';
const fs = require('fs'), f = 'G:/consonance-scratch/o-smooth-t180/src/core/extend.js';
let t = fs.readFileSync(f, 'utf8'); const NL = t.includes('\r\n') ? '\r\n' : '\n';
const rep = (a, b) => { a = a.replace(/\n/g, NL); b = b.replace(/\n/g, NL); if (t.split(a).length !== 2) throw new Error('miss: ' + a.slice(0, 90)); t = t.replace(a, () => b); };
rep(`const FLOW_SEARCH_M = 5;   // m: the room search's first steps, as probePeak's PROBE_STEP_M (then every whole metre below the first that lays, from the smallest: flowRoom)
`, `const FLOW_SEARCH_M = 5;   // m: the room search's steps past FLOW_NEAR_M, as probePeak's PROBE_STEP_M (then back down by the metre while it lays: flowRoom)
// m: the room search first tries every whole metre up to this, from the smallest (flowRoom). The second reader's finding 2: laying is not monotone in the move, and the
// search stepping back from its first 5 m step told +58 m where +0.5 lays. Measured on the reader's drawn refusals (pane O, LAP 4): every over-ask past 5 m had a whole
// metre within 10 that lays; trying every whole metre below the first step that lays (the least exactly) took 1.2 s a whole ask where a list needs 170 m, against 0.24
const FLOW_NEAR_M = 10;
`);
rep(`  // not "at least": laying is not monotone in the move, and a half metre less can lay (the second reader's finding 2); the room is the least WHOLE metre's move (flowRoom)
  return new D.CoreError('BAD_SECOND', \`\${name(room.k)} needs \${room.need} m after \${room.k ? 'the mark before it' : 'the joint'} (it has \${gap} m, and every whole metre less is refused): \${FLOW_WHY[fail.kind]}\`);`,
`  // not "at least": laying is not monotone in the move, so a smaller move than the one found can lay (the second reader's finding 2; flowRoom)
  return new D.CoreError('BAD_SECOND', \`\${name(room.k)} needs \${room.need} m after \${room.k ? 'the mark before it' : 'the joint'} (it has \${gap} m): \${FLOW_WHY[fail.kind]}\`);`);
rep(`/** The room a refusal names: for the stretch ending at mark k (and, failing that, every other stretch, the steepest first), the shortest stretch that lays the
 *  list with that mark and every mark after it moved on by the same metres: up in FLOW_SEARCH_M steps to the first move that lays, then every whole metre below it
 *  from the smallest, so the move named is the least whole metre that lays. Laying is not monotone in the move (the second reader's finding 2: a list laid at +27,
 *  +65..+67 and +72 on, and the search stepping back from +70 named +65), so no metre is skipped on the way down. The first target moves only when \`trial\` can move
 *  it (trial.first). null when no stretch inside the piece lays it at a FLOW_SEARCH_M step. */`,
`/** The room a refusal names: for the stretch ending at mark k (and, failing that, every other stretch, the steepest first), a stretch that lays the list with that
 *  mark and every mark after it moved on by the same metres: the least whole metre up to FLOW_NEAR_M that lays, else up in FLOW_SEARCH_M steps to the first that lays
 *  and back down by the metre while it lays (as probePeak searches). Laying is not monotone in the move (the second reader's finding 2: a list laid at +27, +65..+67
 *  and +72 on), so past FLOW_NEAR_M a smaller move than the one named can lay, and the refusal does not say "at least". The first target moves only when \`trial\`
 *  can move it (trial.first). null when no stretch inside the piece lays it at a step tried. */`);
rep(`    let dm = 0; while (dm < top && !ok(dm)) dm = Math.min(top, dm + FLOW_SEARCH_M);
    if (!(dm <= top) || !ok(dm)) continue;
    for (let d = 1; d < dm; d++) if (ok(d)) { dm = d; break; }
`, `    const near = Math.min(FLOW_NEAR_M, Math.floor(top));
    let dm = null;
    for (let d = 1; d <= near && dm === null; d++) if (ok(d)) dm = d;
    if (dm === null) {
      let d = near, lays = false;
      while (d < top) { d = Math.min(top, d + FLOW_SEARCH_M); if (ok(d)) { lays = true; break; } }
      if (!lays) continue;
      while (d - 1 > near && ok(d - 1)) d -= 1;
      dm = d;
    }
`);
fs.writeFileSync(f, t); console.log('applied');
