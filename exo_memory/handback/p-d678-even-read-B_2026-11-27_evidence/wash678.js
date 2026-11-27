// wash678.js (pane B, D678 Track 2, the Even read, registration section 1.4): is the lavender wash in A's pictures the next piece's ghost?
//   node wash678.js <tree> <branch|base>
// For each document (A's render678.js PART 1, made the same way: test/even_fixtures.js startOf, then Even through the shell's drag, left rim held, to 16 m;
// on the base only the starts, there is no Even there), the preview's own track model is built from the shell's resolved state, as preview.js does
// (model.update(st.resolved)), then the next piece's candidate as the panel asks for it (shell.candidate(extendOptions(...)), the fields as A's pictures
// show them), then its ghost (trackmodel.js ghostFor). Printed: which pieces the ghost carries, `relaid`, and how far the ghost's centreline lies from the
// placed (lifted) centreline at the same lap distance over the window 150..490 (horizontal and vertical, max). Node only; no browser; nothing written.
'use strict';
const path = require('path');
const os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, MODE] = process.argv.slice(2), T = path.resolve(T0);
const F = require(path.join(T, 'test/even_fixtures.js'));
const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);

function evenDrag(sh, { from, to }, hold, value) {   // render678.js evenDrag, verbatim in effect
  sh.selectPiece(from); if (to !== from) sh.selectPiece(to, { extend: true });
  sh.beginSculpt({ tool: 'even', hold });
  const b = sh.getState().brush; if (!(b && b.mode === 'even')) throw new Error(`the drag did not open: ${sh.getState().message}`);
  sh.sculptTo(value - b.value0); sh.endSculpt();
  return sh.getState().message;
}
function hill(sh, channel, s0, r, amount) {   // one stroke of the height (or sideways) brush, the shell's own local brush
  sh.beginBrush({ mode: 'local', channel, s0, r }); if (!sh.getState().brush) throw new Error(`${channel} brush at ${s0}: ${sh.getState().message}`);
  sh.brushTo(amount); sh.endBrush();
}
// the candidates: the panel's fields in A's pictures (length 100, bank 0, cup 11.68, width 12), and a bare 100 m
const CANDS = { fields: () => extendOptions({ length: 100, bank: 0, cup: 11.68, width: 12, turnAs: 'corner' }), bare: () => extendOptions({ length: 100 }) };

function probe(sh) {
  const st = sh.getState(), tm = createTrackModel(), placed = tm.update(st.resolved);
  const P = placed.path, out = { pieces: st.history.present.pieces.length, placedLen: R(P.lengthM) };
  for (const [name, mk] of Object.entries(CANDS)) {
    let g;
    try { g = tm.ghostFor(sh.candidate(mk())); } catch (e) { out[name] = { error: e.message }; continue; }
    const pieces = [...new Set(g.batches.map((b) => b.piece))].sort((a, b) => a - b);
    // the ghost's centreline against the placed one at the same s, over the window and over all the placed road
    const byS = new Map(); for (const x of P.samples) byS.set(Math.round(x.s * 1000), x);
    let h = 0, v = 0, hAll = 0, vAll = 0, hAt = null, n = 0;
    for (const x of g.path.samples) {
      if (x.s > P.lengthM + 1e-6) continue;
      const y = byS.get(Math.round(x.s * 1000)); if (!y) continue; n++;
      const dh = Math.hypot(x.pos[0] - y.pos[0], x.pos[2] - y.pos[2]), dv = Math.abs(x.pos[1] - y.pos[1]);
      if (dh > hAll) hAll = dh; if (dv > vAll) vAll = dv;
      if (x.s >= 150 && x.s <= 490) { if (dh > h) { h = dh; hAt = x.s; } if (dv > v) v = dv; }
    }
    out[name] = { relaid: g.relaid === undefined ? null : g.relaid, ghostPieces: pieces, batches: g.batches.length, matchedStations: n, win150to490: { horizM: R(h), at: hAt, vertM: R(v) }, allPlaced: { horizM: R(hAll), vertM: R(vAll) } };
  }
  return out;
}

(async () => {
  const PAIRS = [['flatT2b', 'flat', 'T2b'], ['bankW1', 'B-', 'W1'], ['bankT2b', 'B-', 'T2b'], ['bankU', 'B-', 'U'], ['flatU', 'flat', 'U']];
  for (const [key, fx, start] of PAIRS) {
    const base = F.fixture(fx), sh = await F.startOf(base, start);
    console.log(JSON.stringify({ tree: MODE, doc: `${key}_before`, ...probe(sh) }));
    if (MODE === 'branch') { const msg = evenDrag(sh, F.runPieces(F.present(sh)), 'left', 16); console.log(JSON.stringify({ tree: MODE, doc: `${key}_after`, said: msg.slice(0, 60), ...probe(sh) })); }
  }
  // a hill and a swerve on the banked road, no grab and no Even: the same wash if it is the offset, not the tool
  for (const [ch, key] of [['height', 'bankHill'], ['lateral', 'bankSwerve']]) {
    const sh = await F.shellOn(F.fixture('B-'));
    try { hill(sh, ch, 320, 30, 1); console.log(JSON.stringify({ tree: MODE, doc: key, ...probe(sh) })); } catch (e) { console.log(JSON.stringify({ tree: MODE, doc: key, error: e.message })); }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
