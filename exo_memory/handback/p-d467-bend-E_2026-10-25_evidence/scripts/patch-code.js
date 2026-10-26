// patch-code.js (D467, pane E): keep the user's whole bend. coreshell: the start pieces tried first away from the seam, the kept bend named, its words; preview: the hatch
// of the start pieces after such a release (startMovedOf, sculptCues' third argument). CRLF kept; each anchor once.
'use strict';
const fs = require('fs');
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const edit = (rel, pairs) => { const f = W + rel, raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n'); for (const [from, to] of pairs) { const n = s.split(from).length - 1; if (n !== 1) throw new Error(`${rel}: anchor found ${n} times: ${from.slice(0, 90)}`); s = s.replace(from, () => to); } fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s); };

edit('app/core/coreshell.js', [
  // the state's new field
  ["message: startMessage, messageKind: startMessage ? 'error' : null, name: null, dirty: false, lastEdited: null, lastStep: null, brush: null,",
   "message: startMessage, messageKind: startMessage ? 'error' : null, name: null, dirty: false, lastEdited: null, lastStep: null, keptBend: null, brush: null,"],
  // the words for a close that kept the bend by moving the start
  ["/** D464: the release's message.", `/** D467: the release's message when the lap's start pieces closed it and the drag was kept whole. */
function startMovedWords(tool, report) {
  const word = tool === 'climb' ? 'climb' : tool === 'stretch' ? 'stretch' : 'bend';
  return \`the lap is closed again: to keep your \${word}, the start of the lap moved (\${report})\`;
}
/** D464: the release's message.`],
  // the tries
  ["    const tries = [win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length);\n",
   "    // D467 (the librarian's ruling on E's D463 §6(2), the keeper's \"what do you think\" of 19:00): AWAY FROM THE SEAM (a window holding neither the first nor the last road piece)\n" +
   "    // the lap's START PIECES are tried first, the window left as the drag made it, so the user's bend is kept whole (E's measure: 100% kept, against 51-55% by the window tries,\n" +
   "    // which re-solve the bent piece). This reverses D421c's window-first order there, as ruled. At the seam the tries are D421c's, unchanged.\n" +
   "    const startTry = firstR !== lastR && !win.includes(firstR) && !win.includes(lastR) ? [firstR, lastR] : null;\n" +
   "    const tries = [...(startTry ? [startTry] : []), ...[win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length)];\n"],
  // which try closed it
  ["    const attempt = (k, rs) => (k === tries.length ? whole(rs) : runCloseJob({ doc: open, window: tries[k] }).then((r) => (closes(r) || r.cancelled || !stillOurs() ? r : attempt(k + 1, [...rs, r]))));\n",
   "    const attempt = (k, rs) => (k === tries.length ? whole(rs) : runCloseJob({ doc: open, window: tries[k] }).then((r) => (closes(r) ? { ...r, tried: tries[k] } : r.cancelled || !stillOurs() ? r : attempt(k + 1, [...rs, r]))));\n"],
  // the words and the kept bend
  ["        const said = closedAgainWords(b.tool, keptShare(b.base, open, closed, win, b.tool), r.out.report);   // D464: a drag the close took back is said, not only \"closed again\"\n" +
   "        return set({ history: h, ...resolvedOf(closed), brush: null, dirty: true, lastEdited: win, lastStep: { op: `brush:${b.tool}:close`, ms: now() - entry.t0 }, ...ok(said) });",
   "        const byStart = !!startTry && r.tried === startTry;   // D467: the start pieces closed it, so the drag is as the user made it, and those pieces moved\n" +
   "        const said = byStart ? startMovedWords(b.tool, r.out.report) : closedAgainWords(b.tool, keptShare(b.base, open, closed, win, b.tool), r.out.report);   // D464: a drag the close took back is said, not only \"closed again\"\n" +
   "        const keptBend = byStart ? Object.freeze({ doc: closed, pieces: Object.freeze([...startTry]) }) : null;   // D467: the preview hatches these pieces while this is the document\n" +
   "        return set({ history: h, ...resolvedOf(closed), brush: null, dirty: true, lastEdited: win, keptBend, lastStep: { op: `brush:${b.tool}:close`, ms: now() - entry.t0 }, ...ok(said) });"],
]);

edit('app/preview/preview.js', [
  // the frame passes whether the start pieces moved
  ["overlay: overlayOf(plan, track, sculptCues(track, hoverNow())),", "overlay: overlayOf(plan, track, sculptCues(track, hoverNow(), startMovedOf(shell.getState()))),"],
  // sculptCues' third argument
  ["/** The sculpt cues for this frame: an overlay list, or null. `h` is the page's hover (or null); the drag's own come from track.drag. */\nfunction sculptCues(track, h) {",
   "/** D467: whether the last release kept the user's bend by moving the lap's start pieces, and that is still the document (an undo or any later edit ends it). */\n" +
   "function startMovedOf(st) { return !!(st && st.keptBend && st.history && st.keptBend.doc === st.history.present); }\n" +
   "/** The sculpt cues for this frame: an overlay list, or null. `h` is the page's hover (or null); the drag's own come from track.drag. `startMoved` (D467): the last release moved\n" +
   " *  the start pieces to keep the bend, so they are hatched with no hover too, both at full strength. */\nfunction sculptCues(track, h, startMoved = false) {"],
  ["  const colour = h ? washOf(h) : null; if (!colour) return null;\n  const path = track.path, segs = track.segments, sEnd = windowEnd(path, segs, h); if (sEnd === null) return null;\n  const closed = !!path.closed, key = `${sEnd}|${colour.join(',')}|${closed}`, was = cueMemo.get(path);",
   "  const colour = h ? washOf(h) : null, kept = !!startMoved && !!track.path.closed; if (!colour && !kept) return null;\n  const path = track.path, segs = track.segments, sEnd = colour ? windowEnd(path, segs, h) : null; if (colour && sEnd === null && !kept) return null;\n  const closed = !!path.closed, key = `${sEnd}|${colour ? colour.join(',') : ''}|${closed}|${kept}`, was = cueMemo.get(path);"],
  ["  const list = [], wash = sEnd < path.lengthM ? acrossLines(path, segs, 0, segs.length, sEnd) : null;\n  if (wash) list.push({ positions: wash, colour, alpha: WASH_ALPHA, blend: true });\n  if (closed) { const H = hatchOf(path, segs); if (H.last) list.push({ positions: H.last, colour: HATCH, alpha: HATCH_ALPHA, blend: true }); if (H.first) list.push({ positions: H.first, colour: HATCH, alpha: HATCH_FIRST_ALPHA, blend: true }); }",
   "  const list = [], wash = colour && sEnd !== null && sEnd < path.lengthM ? acrossLines(path, segs, 0, segs.length, sEnd) : null;\n  if (wash) list.push({ positions: wash, colour, alpha: WASH_ALPHA, blend: true });\n  if (closed) { const H = hatchOf(path, segs); if (H.last) list.push({ positions: H.last, colour: HATCH, alpha: HATCH_ALPHA, blend: true }); if (H.first) list.push({ positions: H.first, colour: HATCH, alpha: kept ? HATCH_ALPHA : HATCH_FIRST_ALPHA, blend: true }); }   // D467: both moved, both full"],
  ["module.exports = { createPreview, keyAction, boostAt, backingSize, MAX_SIDE, markerSize, widthAtHead, clearanceAtHead, pickAt, startHead, sculptCues };",
   "module.exports = { createPreview, keyAction, boostAt, backingSize, MAX_SIDE, markerSize, widthAtHead, clearanceAtHead, pickAt, startHead, sculptCues, startMovedOf };"],
]);
console.log('patched');
