// wire3.js (run in the worktree): the checker's reds DRAWN on the road in the 3D view (lines across the road at every station of a red range, in the checker's red),
// and a click on a red entry in the checker's list moves the camera to its place (each click the next place). Anchors exactly once; line endings kept.
'use strict';
const fs = require('fs');
function edit(f, pairs) {
  let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${f}: ${k} of ${JSON.stringify(a.slice(0, 70))}`); s = s.replace(a, () => b); }
  fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s); console.log('edited ' + f);
}
edit('app/preview/preview.js', [
  ["const { guidePlan, MODES: GRID_MODES, MIRRORS } = require('./guides.js');\n", "const { guidePlan, MODES: GRID_MODES, MIRRORS } = require('./guides.js');\nconst { PALETTE, LEVEL } = require('../validate-ui/colour.js');   // the checker's red, for its reds drawn on the road (redMarks)\n"],
  ['  let sigil = false;\n', '  let sigil = false;\n  let reds = null;   // the track checker\'s red ranges ([{ s0, s1 }]), drawn on the road (redMarks); set by the page from the checker\'s t180:validation\n'],
  ['sculptCues(track, hoverNow(), startMovedOf(shell.getState())', 'withReds(sculptCues(track, hoverNow(), startMovedOf(shell.getState())'],
  ['    focus(s) {\n', `    /** The track checker's red ranges ([{ s0, s1 }], its result's red list), drawn on the road as lines across it in red; null or [] draws none. */
    setReds(list) { reds = Array.isArray(list) && list.length ? list.map((x) => ({ s0: Number.isFinite(x.s0) ? x.s0 : x.s, s1: Number.isFinite(x.s1) ? x.s1 : Number.isFinite(x.s0) ? x.s0 : x.s })).filter((x) => Number.isFinite(x.s0) && Number.isFinite(x.s1)) : null; },
    focus(s) {\n`],
  [`/** The lines drawn over the track: the guides' (the mirror ghost)`, `// THE CHECKER'S REDS ON THE ROAD (the user, 2026-11-02, the pass clearance: each place must show on both passes' road). Every station of the shared path inside a red range
// gets a line across the road, a little over it, in the checker's red (app/validate-ui/colour.js PALETTE): on the 2 m stations a solid band. Built once per path and list.
const RED_LINE = Object.freeze(PALETTE[LEVEL.RED].slice(0, 3)), RED_ALPHA = 0.9, redMemo = new WeakMap();
function redMarks(track, list) {
  if (!track || !track.path || !Array.isArray(track.segments) || !list || !list.length) return null;
  const path = track.path, was = redMemo.get(path); if (was && was.list === list && was.segments === track.segments) return was.out;
  const out = [];
  for (let j = 0; j < track.segments.length; j++) {
    const hw = halfWidth(track.segments[j]); if (!(hw > 0)) continue;
    const i1 = j + 1 < path.segFirst.length ? path.segFirst[j + 1] : path.samples.length;
    for (let i = path.segFirst[j]; i < i1; i++) {
      const x = path.samples[i]; if (!list.some((r) => x.s >= r.s0 - 1e-9 && x.s <= r.s1 + 1e-9)) continue;
      for (const k of [1, -1]) for (let d = 0; d < 3; d++) out.push(x.pos[d] + k * hw * x.L[d] + LINE_LIFT * x.U[d]);
    }
  }
  const res = out.length ? [{ positions: Float32Array.from(out), colour: RED_LINE, alpha: RED_ALPHA, blend: true }] : null;
  redMemo.set(path, { list, segments: track.segments, out: res }); return res;
}
/** the sculpt cues with the checker's reds after them (one list object per pair, so the overlay's memo holds) */
const withRedsMemo = new WeakMap();
function withReds(cues, marks) {
  if (!marks) return cues; if (!cues) return marks;
  let m = withRedsMemo.get(marks); if (!m || m.cues !== cues) { m = { cues, list: [...cues, ...marks] }; withRedsMemo.set(marks, m); }
  return m.list;
}
/** The lines drawn over the track: the guides' (the mirror ghost)`],
]);
// withReds' second argument: the red marks for this frame
{
  const f = 'app/preview/preview.js'; let s = fs.readFileSync(f, 'utf8');
  const a = 'withReds(sculptCues(track, hoverNow(), startMovedOf(shell.getState())';
  const i = s.indexOf(a); if (i < 0) throw new Error('withReds call');
  // close the sculptCues(...) call, then add the marks: find the matching parenthesis after `sculptCues(`
  let k = i + 'withReds('.length + 'sculptCues('.length, depth = 1; while (depth > 0) { const c = s[k++]; if (c === '(') depth++; else if (c === ')') depth--; }
  s = s.slice(0, k) + ', redMarks(track, reds))' + s.slice(k);
  fs.writeFileSync(f, s); console.log('withReds marks wired');
}
edit('app/preview/index.js', [
  ["  const focusNow = (e) => { if (e.detail && Number.isFinite(e.detail.s)) p.focus(e.detail.s); };\n  doc.addEventListener('t180-camera-focus', focusNow);",
   "  const focusNow = (e) => { if (e.detail && Number.isFinite(e.detail.s)) p.focus(e.detail.s); };\n  doc.addEventListener('t180-camera-focus', focusNow);\n  // the track checker's reds, drawn on the road (preview.js redMarks); the checker says them on 't180:validation' (app/validate-ui/index.js)\n  const redsNow = (e) => { const r = e.detail && e.detail.result; p.setReds(r ? r.red : null); };\n  doc.addEventListener('t180:validation', redsNow);"],
  ["unmount() { doc.removeEventListener('t180-camera-focus', focusNow);", "unmount() { doc.removeEventListener('t180-camera-focus', focusNow); doc.removeEventListener('t180:validation', redsNow);"],
]);
edit('app/validate-ui/labels.js', [
  ["  return out.map(({ line, group: g }) => line || { text: `${kind}: ${reasonText(g.reason)}, at ${list(g.xs.map(place))} m`,",
   "  return out.map(({ line, group: g }) => line || { places: g.xs.map((x) => x.s0), text: `${kind}: ${reasonText(g.reason)}, at ${list(g.xs.map(place))} m`,"],
]);
edit('app/validate-ui/index.js', [
  ["        for (const f of findingGroups(kind, items)) list.append(el('li', { textContent: f.text, title: f.title, style: `color: ${textCss(lvl)}` }));",
   `        for (const f of findingGroups(kind, items)) {
          const li = el('li', { textContent: f.text, title: f.title, style: \`color: \${textCss(lvl)}\${kind === 'red' && f.places ? '; cursor: pointer' : ''}\` });
          // a RED entry takes the camera to its place (preview.js focus, 't180-camera-focus'); each click the next of its places (the pass clearance names both passes)
          if (kind === 'red' && f.places && f.places.length) { let k = 0; li.addEventListener('click', () => { const s = f.places[k % f.places.length]; k++; li.dispatchEvent(new CustomEvent('t180-camera-focus', { bubbles: true, detail: { s } })); }); }
          list.append(li);
        }`],
]);
