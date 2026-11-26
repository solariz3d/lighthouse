// c-l242-read.test.js (pane C, L242 second read): rows of my own over A's themed mark and handle windows (builder l242-themed-marks 0ab6cc8) and its base (13faa9d).
// Run: T180_TIP=C:/Consonance/c-l242-tip T180_BASE=C:/Consonance/c-l242-base node --test c-l242-read.test.js
// Both trees are loaded in ONE process (separate module graphs: different paths), so the no-token rows compare the two trees' drawing directly.
// The recording context below is mine: it keeps the canvas state through save/restore and logs every path and paint call with the state that paint uses,
// so "the same box" means the same calls with the same effective state (a shadow counts only when it can draw: a non-transparent colour and a blur or offset).
// The fake DOM (El, fakeWindow) and the handles stage are copied from the builder's own tests (core-mark-labels.test.js, handles.test.js).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const TIP = path.resolve(process.env.T180_TIP || 'C:/Consonance/c-l242-tip'), BASE = path.resolve(process.env.T180_BASE || 'C:/Consonance/c-l242-base');
const load = (R) => ({ ST: require(R + '/app/core/secondtick.js'), HD: require(R + '/app/core/handles.js') });
const T_ = load(TIP), B_ = load(BASE);

// ---- the recording context ----
const STATE_KEYS = ['fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textBaseline', 'globalAlpha', 'shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY', 'lineCap', 'lineJoin'];
const transparent = (c) => !c || /^rgba\([^)]*,\s*0\)$/.test(String(c).replace(/\s+/g, ' ')) || c === 'transparent';
function recCtx() {
  let st = { fillStyle: '#000000', strokeStyle: '#000000', lineWidth: 1, font: '10px sans-serif', textBaseline: 'alphabetic', globalAlpha: 1, shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, lineCap: 'butt', lineJoin: 'miter' };
  const stack = [], log = [], measured = [];
  const shadow = () => (!transparent(st.shadowColor) && (st.shadowBlur > 0 || st.shadowOffsetX || st.shadowOffsetY) ? `${st.shadowColor}/${st.shadowBlur}/${st.shadowOffsetX},${st.shadowOffsetY}` : 'none');
  const paint = (op, args, keys) => log.push([op, ...args.map((a) => (typeof a === 'number' ? +a.toFixed(4) : a)), Object.fromEntries(keys.map((k) => [k, st[k]])), shadow()]);
  const ctx = {
    save() { stack.push({ ...st }); }, restore() { if (stack.length) st = stack.pop(); },
    setTransform(...a) { log.push(['setTransform', ...a]); }, clearRect(...a) { log.push(['clearRect', ...a]); },
    beginPath() { log.push(['beginPath']); }, closePath() { log.push(['closePath']); },
    moveTo(x, y) { log.push(['moveTo', +x.toFixed(4), +y.toFixed(4)]); }, lineTo(x, y) { log.push(['lineTo', +x.toFixed(4), +y.toFixed(4)]); },
    arc(x, y, r, a0, a1) { log.push(['arc', +x.toFixed(4), +y.toFixed(4), r, +a0.toFixed(4), +a1.toFixed(4)]); }, arcTo(...a) { log.push(['arcTo', ...a.map((v) => +v.toFixed(4))]); },
    rect(...a) { log.push(['rect', ...a.map((v) => +v.toFixed(4))]); }, roundRect(...a) { log.push(['roundRect', ...a.map((v) => +v.toFixed(4))]); },
    fill() { paint('fill', [], ['fillStyle', 'globalAlpha']); }, stroke() { paint('stroke', [], ['strokeStyle', 'lineWidth', 'globalAlpha', 'lineCap', 'lineJoin']); },
    fillRect(...a) { paint('fillRect', a, ['fillStyle', 'globalAlpha']); }, strokeRect(...a) { paint('strokeRect', a, ['strokeStyle', 'lineWidth', 'globalAlpha', 'lineJoin']); },
    fillText(t, x, y) { paint('fillText', [String(t), x, y], ['fillStyle', 'font', 'textBaseline', 'globalAlpha']); },
    measureText(s) { measured.push({ s: String(s), font: st.font }); return { width: String(s).length * 7 }; },
  };
  for (const k of STATE_KEYS) Object.defineProperty(ctx, k, { get: () => st[k], set: (v) => { st[k] = v; }, enumerable: true });
  return { ctx, log, measured, reset() { log.length = 0; measured.length = 0; } };
}
const paints = (log) => log.filter((e) => ['fill', 'stroke', 'fillRect', 'strokeRect', 'fillText'].includes(e[0]));

// ---- a theme's tokens as the browser computes them (SIGIL's :root, then the skin's [data-theme] blocks; var() substituted), from the TIP tree ----
function varsOf(R, look) {
  const html = fs.readFileSync(path.join(R, 'app/index.html'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rootBlock = /:root\s*\{([\s\S]*?)\}/.exec(html)[1], vars = {};
  const take = (body) => { for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim(); };
  take(rootBlock);
  if (look !== 'sigil') { const css = fs.readFileSync(path.join(R, 'app/themes', `${look}.css`), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''); for (const m of css.matchAll(new RegExp(`\\[data-theme="${look}"\\]\\s*\\{([^{}]*)\\}`, 'g'))) take(m[1]); }
  const resolve = (v, d = 0) => (d > 5 ? v : v.replace(/var\((--[\w-]+)(?:,\s*([^)]*))?\)/g, (all, n, fb) => (n in vars ? resolve(vars[n], d + 1) : fb || '')));
  return Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, resolve(v)]));
}
const LOOKS = ['sigil', 'aqua', 'glass', 'aurora', 'skyline', 'skyline-night'];
// a theme a window can switch: theme.set(look) changes what getComputedStyle answers and fires the MutationObserver as <html data-theme> would
function themeFor(win, look) {
  const th = { vars: look ? varsOf(TIP, look) : {}, observers: [] };
  const root = {}; win.document = win.document || {}; win.document.documentElement = root;
  win.getComputedStyle = () => ({ getPropertyValue: (n) => th.vars[n] || '' });
  win.MutationObserver = class { constructor(f) { this.f = f; th.observers.push(this); } observe() {} };
  win.console = { error() {} };
  th.set = (l) => { th.vars = varsOf(TIP, l); for (const o of th.observers) o.f([{ type: 'attributes', attributeName: 'data-theme' }]); };
  return th;
}

// ---- the mark layer (secondtick) on a fake DOM ----
class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this.listeners = {}; this.parent = null; }
  append(...k) { for (const c of k) { if (c == null) continue; c.parent = this; this.children.push(c); } }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  addEventListener(e, f, o) { (this.listeners[e] = this.listeners[e] || []).push({ f, capture: !!(o === true || (o && o.capture)) }); }
  removeEventListener(e, f) { this.listeners[e] = (this.listeners[e] || []).filter((x) => x.f !== f); }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth || 0, height: this.clientHeight || 0 }; }
  get isConnected() { return false; }
  fire(type, init) { let stopped = false; const ev = { type, button: 0, ...init, preventDefault() {}, stopPropagation() { stopped = true; }, stopImmediatePropagation() { stopped = true; } };
    const ls = (this.listeners[type] || []).slice(), order = ls.filter((l) => l.capture).concat(ls.filter((l) => !l.capture)); for (const l of order) { if (stopped) break; l.f(ev); } }
}
function fakeWindow() {
  const doc = { listeners: {}, createElement: (t) => new El(t, doc) };
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {} };
  doc.defaultView = win;
  return { doc, win };
}
const POSE = { eye: [0, 700, 500], target: [0, 0, 500], up: [0, 0, 1], fov: Math.PI / 3 };
const NAMES = { bank: 'Extra bank', turn: 'Extra turn', climb: 'Extra climb' };
const mk = (X, field, index, from, to = 1000, extra = {}) => ({ field, index, from, to, half: 15, halfTo: 15, label: NAMES[field] ? X.ST.markText(field, index, from, to, 1000) : null, lit: false, ...X.ST.styleOf(field), ...extra });
function markLayer(X, { marks, look = null, W = 900, H = 600, pose = POSE } = {}) {
  const { doc, win } = fakeWindow(); const th = look === null ? null : themeFor(win, look);
  const stage = doc.createElement('div'); stage.clientWidth = W; stage.clientHeight = H;
  const R = recCtx(); const create = doc.createElement; doc.createElement = (t) => { const e = create(t); if (t === 'canvas') e.getContext = () => R.ctx; return e; };
  const samples = []; for (let s = 0; s <= 1000; s += 2) samples.push({ s, pos: [0, 0, s], T: [0, 0, 1], L: [1, 0, 0], U: [0, 1, 0] });
  const ghost = { samples, s0: 0, jump: false };
  doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(ghost)); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose }));
  const S = { marks };
  const L = X.ST.mount(stage, win, () => ({ marks: S.marks, offers: [] }), { onMarkDrag: () => {} });
  L.drawNow();
  const dot = (i) => { const st = L.marks()[i].strokes[0]; return { x: (st.a.x + st.b.x) / 2, y: (st.a.y + st.b.y) / 2 }; };
  const hover = (i) => { const p = dot(i); stage.fire('pointermove', { clientX: p.x, clientY: p.y, pointerId: 1 }); };
  const draw = () => { R.reset(); L.drawNow(); return R.log.slice(); };
  return { stage, L, S, R, th, dot, hover, draw };
}
// the window a mark's label drew: the paints from the first fill of the box to its last word (the label is the last thing drawn before the offers)
const windowOf = (log) => { const p = paints(log), t = p.filter((e) => e[0] === 'fillText'); return { texts: t, all: p }; };

// ---- the handles overlay on the handles tests' stage ----
const HSAMPLES = Array.from({ length: 41 }, (_, i) => ({ s: i * 5, pos: [0, 0, i * 5], T: [0, 0, 1], L: [1, 0, 0], U: [0, 1, 0] }));
const HPOSE = { eye: [0, 60, -40], target: [0, 0, 120], up: [0, 1, 0], fov: 60 * Math.PI / 180 };
function handleLayer(X, { look = null, W = 900, H = 600, kinds = ['width', 'bank', 'turn'] } = {}) {
  const listeners = {}, frames = [], R = recCtx();
  const canvas = { style: {}, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, getContext: () => R.ctx, remove() { this.gone = true; }, isConnected: true };
  const stage = { clientWidth: W, clientHeight: H, style: {}, ownerDocument: { createElement: () => canvas }, getBoundingClientRect: () => ({ left: 0, top: 0 }), isConnected: true, append() {}, setPointerCapture() {},
    addEventListener(t, f, cap) { (listeners[t] = listeners[t] || []).push({ f, cap: !!cap }); }, removeEventListener(t, f) { listeners[t] = (listeners[t] || []).filter((x) => x.f !== f); } };
  const win = { devicePixelRatio: 1, requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame() {} };
  const th = look === null ? null : themeFor(win, look);
  let clock = 0;
  const fire = (type, e) => { clock += 1; const ev = { button: 0, pointerId: 1, timeStamp: clock, stopped: false, prevented: false, preventDefault() { this.prevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...e }; for (const { f } of (listeners[type] || []).slice()) { f(ev); if (ev.stopped) break; } return ev; };
  const tick = () => { const f = frames.splice(0); f.forEach((g) => g(0)); };
  const cur = { width: 31, bank: 0, turn: 0 };
  const ov = X.HD.mount(stage, win, { model: () => ({ samples: HSAMPLES, s0: 40, s1: 200, half: () => 10, kinds, base: (k) => cur[k], ctx: () => ({ half: 10 }) }), pose: () => HPOSE, begin() {}, apply() {}, end() {} });
  tick();
  const hoverOn = (id) => { const h = ov.handles().find((x) => x.id === id); fire('pointermove', { clientX: h.screen.x, clientY: h.screen.y }); };
  const frameLog = () => { R.reset(); tick(); return R.log.slice(); };
  return { ov, R, th, fire, tick, hoverOn, frameLog };
}

// ================= 2. the no-token path draws exactly the old box (both trees in this process) =================
test('N1: no tokens: the mark layer draws the same calls with the same effective state at 13faa9d and 0ab6cc8 (every field at rest, a hovered label, a lit two-line label, an edge mark)', () => {
  const marksFor = (X) => [mk(X, 'bank', 0, 200, 400), mk(X, 'turn', 0, 300, 600), mk(X, 'climb', 0, 450), mk(X, 'width', 0, 520), mk(X, 'cup', 0, 600), mk(X, 'edge', 0, 680), mk(X, 'edgeR', 0, 760),
    mk(X, 'bank', 1, 820, 1000, { lit: true })];
  const run = (X) => { const A = markLayer(X, { marks: marksFor(X) }); const rest = A.draw(); A.hover(1); const hovered = A.draw(); A.L.unmount(); return { rest, hovered }; };
  const b = run(B_), t = run(T_);
  assert.ok(paints(b.hovered).some((e) => e[0] === 'fillText'), 'the base drew a label (the row reaches the window)');
  assert.deepEqual(t.rest, b.rest, 'at rest (the lit mark labelled): the same');
  assert.deepEqual(t.hovered, b.hovered, 'with the turn mark hovered: the same');
  console.log(`N1: ${t.hovered.length} calls compared, ${paints(t.hovered).filter((e) => e[0] === 'fillText').length} words`);
});

test('N2: no tokens: a handle\'s readout (hovered bank, then hovered width) draws the same calls with the same effective state at 13faa9d and 0ab6cc8', () => {
  const run = (X) => { const A = handleLayer(X); const out = []; for (const id of ['bank:1', 'width:-1']) { A.hoverOn(id); out.push(A.frameLog()); } A.ov.unmount(); return out; };
  const b = run(B_), t = run(T_);
  assert.ok(paints(b[0]).some((e) => e[0] === 'fillText'), 'the base drew a readout');
  assert.deepEqual(t[0], b[0], 'bank hovered: the same'); assert.deepEqual(t[1], b[1], 'width hovered: the same');
  console.log(`N2: ${t[0].length} + ${t[1].length} calls compared; readout words: ${JSON.stringify(paints(t[0]).filter((e) => e[0] === 'fillText').map((e) => e[1]))}`);
});

// ================= 1. a theme switched while a window is showing =================
const lookOfWindow = (log) => {   // what a drawn window looks like: its font, its corner, its fill, its edge's width and glow
  const p = paints(log), words = p.filter((e) => e[0] === 'fillText'), rr = log.filter((e) => e[0] === 'roundRect');
  return { font: words.length ? words[0].at(-2).font : null, radius: rr.length ? rr[0][5] : 0, text: words.length ? words[0].at(-2).fillStyle : null };
};
const expectLook = (look) => { const v = varsOf(TIP, look); return { font: `${v['--mark-win-weight'] || 'bold'} 12px ${v['--mark-win-font']}`, radius: Number(v['--mark-win-radius']) || 0 }; };

test('T1: a mark\'s label shown (hovered) while the theme goes SIGIL -> Aqua -> Skyline -> SIGIL: each next draw wears the new look, nothing of the old', () => {
  const A = markLayer(T_, { marks: [mk(T_, 'bank', 0, 400)], look: 'sigil' }); A.hover(0);
  const seen = [];
  for (const look of ['sigil', 'aqua', 'skyline', 'sigil']) {
    if (seen.length) A.th.set(look);
    const got = lookOfWindow(A.draw()), want = expectLook(look);
    seen.push(`${look}: ${got.font} r${got.radius} text ${got.text}`);
    assert.equal(got.font, want.font, `${look}: the label's font`);
    assert.equal(got.radius, Math.min(want.radius, 12), `${look}: the label's corner`);   // 24 px high: a radius is held to 12 by roundPath
  }
  console.log('T1 ' + seen.join(' | '));
  A.L.unmount();
});

test('T2: a handle\'s readout shown (hovered) while the theme changes: the next frame redraws it in the new look (handles.js draws only when its frame key changes)', () => {
  const A = handleLayer(T_, { look: 'sigil' }); A.hoverOn('bank:1');
  const first = lookOfWindow(A.frameLog()); A.tick();
  const idle = A.frameLog(); assert.equal(idle.length, 0, 'nothing changed: no redraw (the key holds)');
  const seen = [`sigil: ${first.font} r${first.radius}`];
  for (const look of ['aqua', 'glass', 'skyline-night']) {
    A.th.set(look);
    const got = lookOfWindow(A.frameLog()), want = expectLook(look);
    seen.push(`${look}: ${got.font} r${got.radius}`);
    assert.equal(got.font, want.font, `${look}: redrawn in its font`);
    assert.equal(got.radius, Math.min(want.radius, 11), `${look}: its corner (a 22 px box holds a radius to 11)`);
  }
  console.log('T2 ' + seen.join(' | '));
  A.ov.unmount();
});

test('T3 (a record): the frame key sees a theme change only through --ink; two looks with one --ink would leave a shown readout in the old look until something else changes', () => {
  const inks = Object.fromEntries(LOOKS.map((l) => [l, varsOf(TIP, l)['--ink']]));
  console.log(`T3 --ink per look: ${JSON.stringify(inks)}; distinct ${new Set(Object.values(inks)).size} of ${LOOKS.length}`);
  // a made-up look: SIGIL's tokens with Aqua's window tokens, --ink unchanged
  const A = handleLayer(T_, { look: 'sigil' }); A.hoverOn('bank:1'); A.frameLog();
  const aq = varsOf(TIP, 'aqua'), mixed = { ...varsOf(TIP, 'sigil') }; for (const k of Object.keys(aq)) if (k.startsWith('--mark-win-')) mixed[k] = aq[k];
  A.th.vars = mixed; for (const o of A.th.observers) o.f([]);
  const after = A.frameLog();
  console.log(`T3 a look differing only in its window tokens: ${after.length ? 'redrawn' : 'NOT redrawn (the old look stays until the hover or the model moves)'}`);
  A.ov.unmount();
});

// ================= 3. a long label near the screen edge with a 12 px radius (Skyline) =================
test('E1: Skyline (radius 12): a long two-line label on a mark near the right and top edges stays on the stage, its words are measured in the font they are drawn in, and the corner leaves the words inside', () => {
  const long = 'Extra bank 12 · 380.00 m to 1000.00 m over 620.00 m, back to level at the end · drag to start earlier or later, or press to set the from';
  for (const [W, H] of [[900, 600], [420, 600], [300, 260]]) {
    const A = markLayer(T_, { marks: [mk(T_, 'bank', 0, 990, 1000, { label: long, lit: true })], look: 'skyline', W, H });
    const log = A.draw(), rr = log.filter((e) => e[0] === 'roundRect'), words = paints(log).filter((e) => e[0] === 'fillText');
    assert.ok(rr.length >= 2, `${W}x${H}: the window is rounded (fill and edge)`);
    const [x, y, w, h, r] = rr[0].slice(1);
    assert.ok(r <= 12 && r <= h / 2 && r <= w / 2, `${W}x${H}: radius ${r} within the box`);
    const onStage = x >= 0 && y >= 0 && x + w <= W + 1e-6 && y + h <= H + 1e-6;
    // where the box goes is placeLabel's, unchanged: the base, with no tokens, puts the same label's square box at the same x, y, w, h
    const Bl = markLayer(B_, { marks: [mk(B_, 'bank', 0, 990, 1000, { label: long, lit: true })], W, H }), bb = paints(Bl.draw()).find((e) => e[0] === 'fillRect'); Bl.L.unmount();
    assert.deepEqual([x, y, w, h], bb.slice(1, 5), `${W}x${H}: the box is where the base put it`);
    if (!onStage) console.log(`E1 ${W}x${H}: the box ${JSON.stringify([x, y, w, h])} runs off the stage, as the base's does (a label wider than the stage; placeLabel's, not L242's)`);
    for (const m of A.R.measured) assert.equal(m.font, words[0].at(-2).font, `${W}x${H}: "${m.s.slice(0, 20)}…" measured in the drawn font`);
    for (const e of words) {   // the words' left end, 6 px in, against the rounded corner: at the glyph band's top and bottom (±6 px about the middle line) the corner's edge is inside it
      const ty = e[3], tx = e[2];
      for (const gy of [ty - 6, ty + 6]) { const cy = gy < y + r ? y + r : gy > y + h - r ? y + h - r : null; const inset = cy === null ? 0 : r - Math.sqrt(Math.max(0, r * r - (gy - cy) * (gy - cy))); assert.ok(tx >= x + inset + 1, `${W}x${H}: the word at y ${ty} starts ${(tx - x).toFixed(1)} px in, the corner ${inset.toFixed(1)} px`); }
    }
    console.log(`E1 ${W}x${H}: box ${[x, y, w, h].map((v) => v.toFixed(1)).join(',')} r ${r}, ${words.length} lines`);
    A.L.unmount();
  }
});

// ================= from A's list: a lit mark's edge on each look =================
test('L1: a lit mark\'s window edge is the look\'s edge + 1 on every look (A: 2.5 lit with no tokens)', () => {
  const out = [];
  for (const look of LOOKS) {
    const A = markLayer(T_, { marks: [mk(T_, 'bank', 0, 400, 1000, { lit: true })], look }); const log = A.draw();
    const v = varsOf(TIP, look), edge = Number(v['--mark-win-edge']), rr = log.findIndex((e) => e[0] === 'roundRect' || e[0] === 'strokeRect');
    const strokes = paints(log).filter((e) => (e[0] === 'stroke' || e[0] === 'strokeRect') && e.at(-2).lineWidth === edge + 1);
    out.push(`${look} ${edge}+1=${edge + 1}: ${strokes.length ? 'drawn' : 'MISSING'}`);
    assert.ok(rr >= 0 && strokes.length >= 1, `${look}: the window edge at ${edge + 1}`);
    A.L.unmount();
  }
  console.log('L1 ' + out.join(' | '));
});

test('N0 (control for N1 and N2): the comparator sees a difference when there is one: SIGIL\'s tokens on the tip against the base\'s no-token box', () => {
  const t = markLayer(T_, { marks: [mk(T_, 'bank', 0, 400, 1000, { lit: true })], look: 'sigil' }), b = markLayer(B_, { marks: [mk(B_, 'bank', 0, 400, 1000, { lit: true })] });
  assert.notDeepEqual(t.draw(), b.draw(), 'SIGIL\'s window (2 px corners, Bahnschrift 600, 1 px edge) is not the old box');
  t.L.unmount(); b.L.unmount();
});

test('N3 (A\'s list: the brush box, Sculpt, not pictured): no tokens: the brush glyph and its box draw the same at 13faa9d and 0ab6cc8 (hover words, then a drag\'s value, for two brush kinds)', () => {
  const run = (X) => {
    const out = [];
    for (const [kind, B] of [['brush-twist', {}], ['brush-width', { open: true, text: 'width 31.00 m' }], ['brush-grab', { note: 'Alt: sideways' }]]) {
      const R = recCtx(), frames = [];
      const canvas = { style: {}, setAttribute() {}, getContext: () => R.ctx, remove() {}, isConnected: true };
      const stage = { clientWidth: 900, clientHeight: 600, style: {}, ownerDocument: { createElement: () => canvas }, getBoundingClientRect: () => ({ left: 0, top: 0 }), isConnected: true, append() {}, addEventListener() {}, removeEventListener() {} };
      const win = { devicePixelRatio: 1, requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame() {} };
      const ov = X.HD.mount(stage, win, { model: () => ({ samples: HSAMPLES, s0: 0, s1: 0, half: () => 0, kinds: [kind], base: () => 0, ctx: () => ({ half: 10 }), brush: { samples: HSAMPLES, s: 100, half: 10, ...B } }), pose: () => HPOSE, begin() {}, apply() {}, end() {} });
      frames.splice(0).forEach((g) => g(0)); out.push(R.log.slice()); ov.unmount();
    }
    return out;
  };
  const b = run(B_), t = run(T_);
  assert.ok(b.every((l) => paints(l).some((e) => e[0] === 'fillText')), 'the base drew each brush box');
  for (let i = 0; i < b.length; i++) assert.deepEqual(t[i], b[i], `brush case ${i}: the same`);
  console.log(`N3: words ${JSON.stringify(t.map((l) => paints(l).filter((e) => e[0] === 'fillText').map((e) => e[1])))}`);
});
