const RW = "const rw = restOf(doc, off, 'w', win, L), rl = restOf(doc, off, 'l', win, L), one = [rw, rl].every((f) => Math.abs(f(w0) - f(w1)) <= EVEN_AGREE_M);";
// B's one fit, copied verbatim from d678-even-b's even.js at run time (the function whole, up to its closing brace at column 0)
const FITB = (() => { const i = BSRC.indexOf('function fitChannel('), j = BSRC.indexOf('\n}\n', i); if (i < 0 || j < 0) throw new Error("B's fitChannel not found"); return BSRC.slice(i, j + 3); })();
const READ = `const REST_AT_M = [10, 20, 30];
function endState(doc, off, ch, x, dir, L) {
  const v = valueAt(doc, off, ch, x); let n = 0;
  for (const d of REST_AT_M) { const z = x + dir * d; if (z < 0 || z > L) continue; n++; if (Math.abs(valueAt(doc, off, ch, z) - v) > REST_M) return { kind: 'moving', v }; }
  return { kind: n ? 'rest' : 'edge', v };
}
function readSupported(doc, off, win, L) {
  const x0 = win.w0, x1 = win.w1, fns = {};
  for (const ch of ['w', 'l']) {
    const a = endState(doc, off, ch, x0, -1, L), b = endState(doc, off, ch, x1, 1, L);
    let f = null;
    if (a.kind === 'rest' && b.kind === 'rest') { if (Math.abs(a.v - b.v) <= EVEN_AGREE_M) f = easeOf(doc, off, ch, win); }
    else if (a.kind === 'rest' || b.kind === 'rest') {
      const [r, o, xo, dir] = a.kind === 'rest' ? [a, b, x1, 1] : [b, a, x0, -1];
      const inward = valueAt(doc, off, ch, Math.min(L, Math.max(0, xo - dir * REST_SPAN_M)));
      const ok = o.kind === 'edge' ? Math.abs(o.v - r.v) <= EVEN_AGREE_M : Math.abs(inward - r.v) <= Math.abs(o.v - r.v) + REST_M;
      if (ok) { const v = r.v; f = () => v; }
    }
    if (!f) return null;
    fns[ch] = f;
  }
  return fns;
}
function restOf(`;
const SETTLE_L = "const c1 = freeze(D.checkDoc({ ...d1, pieces: SC.settle(d1, 'l', resL).pieces }));";
const CANDS = {
  A0: [],
  A1B: [['function restOf(', READ], [RW, 'const rd = readSupported(doc, off, win, L), one = !!rd, rw = rd && rd.w, rl = rd && rd.l;'],
    ['function fitHeight(', FITB + '\nfunction fitHeight('],
    [SETTLE_L, "const resL2 = side && !one ? fitChannel(d1, 'l', (s) => { const x = Math.min(L, Math.max(0, s)); return valueAt(doc, off, 'l', x) + rim0(x) - rim1(x); }, win) : resL;\n  const c1 = freeze(D.checkDoc({ ...d1, pieces: SC.settle(d1, 'l', resL2).pieces }));"]],
  A1R: [['function restOf(', READ], [RW, "const rd = readSupported(doc, off, win, L), one = !!rd, rw = rd && rd.w, rl = rd && rd.l;\n    if (!rd) refuse('EVEN_UNREAD', 'the road under this stretch cannot be read from its ends');"]],
};
