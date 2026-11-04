// tracectl.js <repo> <doc>: the validation controller as the check job runs it (path-only model, generators stubbed), its retained heap, and which geom/validate
// exports it calls with the first caller of each.
'use strict';
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const MB = (b) => (b / 1048576).toFixed(1);
const used = () => { global.gc(); global.gc(); return v8.getHeapStatistics().used_heap_size; };
const seen = new Map();
for (const f of ['src/geom/mesh.js', 'src/geom/bvh.js', 'src/validate/raygap.js', 'src/validate/index.js', 'src/geom/path.js']) {
  const M = rq(f);
  for (const k of Object.keys(M)) if (typeof M[k] === 'function') { const o = M[k]; M[k] = function (...a) { const id = `${f} ${k}`; if (!seen.has(id)) seen.set(id, [0, 0, new Error().stack.split('\n').slice(2, 6).map((l) => l.trim().replace(/\(.*[\/]/, '(')).join(' < ')]); const r = seen.get(id); r[0]++; const t = Date.now(); try { return o.apply(this, a); } finally { r[1] += Date.now() - t; } }; }
}
const D = rq('src/core/document.js'), AD = rq('src/core/adapter.js');
const { createTrackModel } = rq('app/preview/trackmodel.js');
let { PATH_ONLY } = rq('app/validate-ui/checkjob.js'); const em = PATH_ONLY.buildMesh;
PATH_ONLY = { ...PATH_ONLY, buildMeshSteps: function* () { return em(); }, extendMeshSteps: function* (m) { return m; }, reuseMeshSteps: function* () { return em(); } };
const { createValidationController } = rq('app/validate-ui/panel.js');
const doc = D.parse(fs.readFileSync(DOCF, 'utf8'));
const segments = AD.toSegments(doc, { cache: new WeakMap() });
const resolved = Object.freeze({ segments, closed: !!doc.closed, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift: (p) => AD.offsetPath(doc, segments, p) });
const model = createTrackModel({ geom: PATH_ONLY }); const track = model.update(resolved);
seen.clear();
let h0 = used(); const t = Date.now();
const state = { resolved, resolveError: null, history: { dragBase: null } };
const ctl = createValidationController({ getState: () => state, subscribe() { return () => {}; } }, { csp: true, sharedPath: () => track, colours: false, validate: { leanLines: true } });
const h = used(); console.log(`controller: ${Date.now() - t} ms, +${MB(h - h0)} MB`);
for (const [k, [n, ms, st]] of [...seen].sort((a, b) => b[1][1] - a[1][1])) console.log(`${String(n).padStart(6)} ${String(ms).padStart(7)} ms  ${k}\n               ${st.slice(0, 330)}`);
global.keep = { ctl, model, track };
{
  const st = ctl.state, r = st.result;
  const size = (x) => { try { return JSON.stringify(x).length; } catch (e) { return -1; } };
  const l0 = r.lines[100]; console.log('a line: keys ' + Object.keys(l0).join(',') + ' json chars ' + size(l0));
  for (const k of Object.keys(l0)) { const v = l0[k]; console.log(`  .${k}: ${Array.isArray(v) ? 'array ' + v.length + (v.length && typeof v[0] === 'object' ? ' of ' + Object.keys(v[0] || {}).join('/') : '') : typeof v} ${String(size(v)).slice(0, 12)}`); }
  const sp = r.speed[100]; console.log('a speed entry: ' + JSON.stringify(sp).slice(0, 200));
  for (const k of Object.keys(st)) if (st[k] && typeof st[k] === 'object' && k !== 'result') console.log(`state.${k}: json ${size(st[k])}`);
  for (const k of Object.keys(r)) console.log(`result.${k}: json ${size(r[k])}`);
}
{
  const raw = ctl.state.result._raw; const size = (x) => { try { return JSON.stringify(x, (k, v) => (v instanceof Map ? [...v] : v)).length; } catch (e) { return 'ERR ' + e.message; } };
  for (const k of Object.keys(raw)) { const v = raw[k]; console.log(`_raw.${k}: ${Array.isArray(v) ? 'array ' + v.length : v instanceof Map ? 'map ' + v.size : typeof v} json ${size(v)}`); }
  const p = raw.pts && raw.pts[100]; if (p) console.log('a pt: ' + Object.keys(p).join(',') + ' ' + JSON.stringify(p).slice(0, 300));
  const l = raw.lines && raw.lines[100]; if (l) console.log('a raw line: ' + (Array.isArray(l) ? 'array ' + l.length : Object.keys(l).join(',')) + ' ' + JSON.stringify(l).slice(0, 200));
  const keepH = used(); delete ctl.state.result._raw; let h2; try { Object.defineProperty(ctl.state.result, '_raw', { value: null }); } catch (e) {} raw.pts = null; raw.lines = null; h2 = used(); console.log(`dropping _raw.pts and _raw.lines frees ${MB(keepH - h2)} MB`);
}
