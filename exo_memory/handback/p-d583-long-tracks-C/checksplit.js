// checksplit.js <repo> <doc>: the check job's retained heap, split: the path-only track model, then the validation controller on it, then the
// biggest own properties of the controller's state (by retained size, measured by deleting each and collecting). node --expose-gc.
'use strict';
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const MB = (b) => (b / 1048576).toFixed(1);
const used = () => { global.gc(); global.gc(); return v8.getHeapStatistics().used_heap_size; };
const D = rq('src/core/document.js'), AD = rq('src/core/adapter.js');
const { createTrackModel } = rq('app/preview/trackmodel.js');
const { PATH_ONLY } = rq('app/validate-ui/checkjob.js');
const { createValidationController } = rq('app/validate-ui/panel.js');
const doc = D.parse(fs.readFileSync(DOCF, 'utf8'));
let h0 = used();
const segments = AD.toSegments(doc, { cache: new WeakMap() });
const resolved = Object.freeze({ segments, closed: !!doc.closed, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift: (p) => AD.offsetPath(doc, segments, p) });
let h = used(); console.log(`segments ${segments.length}: +${MB(h - h0)} MB`); h0 = h;
const model = createTrackModel({ geom: PATH_ONLY }); const track = model.update(resolved);
h = used(); console.log(`path-only model (samples ${track.path.samples.length}): +${MB(h - h0)} MB`); h0 = h;
const state = { resolved, resolveError: null, history: { dragBase: null } };
const shell = { getState: () => state, subscribe() { return () => {}; } };
const t = Date.now();
const ctl = createValidationController(shell, { csp: true, sharedPath: () => track, colours: false, validate: { leanLines: true } });
h = used(); console.log(`controller (${Date.now() - t} ms): +${MB(h - h0)} MB`); h0 = h;
const st = ctl.state;
console.log('state keys: ' + Object.keys(st).join(' '));
const r = st.result || {};
console.log('result keys: ' + Object.keys(r).join(' '));
// what each big field holds, by deleting it from a shallow copy is not possible (the controller holds the originals), so count sizes by shape
const count = (x, depth = 0, seen = new Set()) => { if (!x || typeof x !== 'object' || seen.has(x) || depth > 3) return 0; seen.add(x); let n = 1; if (ArrayBuffer.isView(x)) return 1; for (const k in x) n += count(x[k], depth + 1, seen); return n; };
for (const k of Object.keys(r)) { const v = r[k]; console.log(`  result.${k}: ${Array.isArray(v) ? 'array ' + v.length : typeof v} objects~${count(v)}`); }
for (const k of Object.keys(st)) { const v = st[k]; if (v && typeof v === 'object') console.log(`  state.${k}: ${Array.isArray(v) ? 'array ' + v.length : 'object'} objects~${count(v)}`); }
const s0 = track.path.samples[100]; console.log('a sample: ' + Object.keys(s0).map((k) => `${k}:${Array.isArray(s0[k]) ? 'arr' + s0[k].length : typeof s0[k]}`).join(' '));
global.keep = { model, track, ctl };
