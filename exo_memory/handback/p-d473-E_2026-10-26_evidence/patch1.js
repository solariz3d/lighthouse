// patch1.js (D473 part 2, pane E): finish.js says which pieces the level rule held back; coreshell.js bankLap; trackmenu.js Bank the lap. CRLF kept.
'use strict';
const fs = require('fs');
const W = 'C:/Users/nname/Downloads/t180-wt-e473/';
function patch(rel, edits) {
  const f = W + rel, raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n');
  for (const [from, to] of edits) { if (s.split(from).length !== 2) throw new Error(`${rel}: not exactly one of: ${from.slice(0, 80)}`); s = s.replace(from, () => to); }
  fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s);
  console.log('patched', rel);
}
const out = [];
// --- finish.js
out.push(['src/core/finish.js', [
  ["/** bankLap with what it held back: { doc, eased (piece ids where the bank eased to none for a flip), withheld (piece ids left unbanked: they would lean out),\n *  none (when there were curves to bank and none was banked: why, in words; P's re-read (d)) }. */\nfunction bankLapWith(doc) { const r = bankLapRun(doc); return { doc: r.doc, eased: r.eased || [], withheld: r.withheld || [], none: r.none || null, budget: r.budget || null }; }",
   "/** bankLap with what it held back: { doc, eased (piece ids where the bank eased to none for a flip), withheld (piece ids left unbanked: they would lean out),\n *  none (when there were curves to bank and none was banked: why, in words; P's re-read (d)), level (D473: piece ids of upright curves the level rule kept\n *  out: a loop or a steep ramp) }. */\nfunction bankLapWith(doc) { const info = {}, r = bankLapRun(doc, info); return { doc: r.doc, eased: r.eased || [], withheld: r.withheld || [], none: r.none || null, budget: r.budget || null, level: info.level || [] }; }"],
  ["function bankLapRun(doc) {\n", "function bankLapRun(doc, info = {}) {\n"],
  ["  const lap = flat.filter((p) => level(doc.pieces[p]));\n",
   "  const lap = flat.filter((p) => level(doc.pieces[p]));\n  info.level = flat.filter((p) => curved(p) && !level(doc.pieces[p])).map((p) => doc.pieces[p].id);   // D473: said by Track ▸ Bank the lap\n"],
]]);
// --- coreshell.js
out.push(['app/core/coreshell.js', [
  ["const SR = require('../../src/core/smoothramps.js');   // D465: Track ▸ Smooth ramps\n",
   "const SR = require('../../src/core/smoothramps.js');   // D465: Track ▸ Smooth ramps\nconst { bankLapWith, budgetNote } = require('../../src/core/finish.js');   // D473: Track ▸ Bank the lap\n"],
  ["//   await shell.smoothRamps()   (D465: Track ▸ Smooth ramps: the bank, cup and edge ramps re-laid C2, the route kept; a backup first, one undo step)\n",
   "//   await shell.smoothRamps()   (D465: Track ▸ Smooth ramps: the bank, cup and edge ramps re-laid C2, the route kept; a backup first, one undo step)\n//   await shell.bankLap()       (D473: Track ▸ Bank the lap: a closed lap banked as Close banks the lap it closes, the route kept; one undo step)\n"],
  ["    // undo and redo SAY what they changed (2026-10-13",
   `    /**
     * D473, TRACK ▸ BANK THE LAP: a lap that is already closed banked as Close banks the lap it closes (src/core/finish.js bankLapWith, D447), so a lap closed
     * before Close banked (a flat closer) gets its bank without being opened. The bank rolls the road about its centre line, so the route does not move: a result
     * whose kh, kv or lengths differ is refused by name. ONE undo step. An open lap, or one with nothing to bank, is left as it is, and the message says so; what
     * the bank held back (the level rule's loops and steep ramps, a piece that would lean out, a flip) is said in plain words.
     */
    async bankLap() {
      if (st.brush) return set({ message: 'finish the brush drag first' });
      const d = doc();
      if (!d.closed) return set({ message: 'not banked: the lap is not closed (Close the loop banks the lap it closes); nothing changed' });
      const t0 = now(); let B;
      try { B = bankLapWith(d); } catch (e) { if (e.name === 'CoreError') return set({ message: \`not banked: \${e.message}; nothing changed\` }); throw e; }
      const ms = now() - t0, names = (ids) => ids.join(', '), they = (ids, one, many) => (ids.length === 1 ? one : many);
      const notes = [B.level.length ? \`no bank on \${names(B.level)}: \${they(B.level, 'it climbs or dives', 'they climb or dive')} too steeply to bank (a loop or a steep ramp)\` : null,
        B.withheld.length ? \`no bank on \${names(B.withheld)}: banked, \${they(B.withheld, 'it', 'they')} would lean out of \${they(B.withheld, 'its', 'their')} turn\` : null,
        B.eased.length ? \`the bank eases to none where the turn changes direction faster than the road can roll (\${names(B.eased)})\` : null,
        B.none ? \`no curve was banked: \${B.none}\` : null,
        B.budget ? budgetNote(B.budget, 'lap') : null].filter(Boolean);
      if (B.doc === d) return set({ message: notes.length ? \`nothing banked, nothing changed: \${notes.join('; ')}\` : 'nothing to bank: every curve on this lap already has its bank; nothing changed' });
      const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      if (B.doc.pieces.length !== d.pieces.length || B.doc.pieces.some((P, i) => P.length !== d.pieces[i].length || !same(P.channels.kh, d.pieces[i].channels.kh) || !same(P.channels.kv, d.pieces[i].channels.kv))) {
        return set({ message: 'not banked: the bank would have moved the route; nothing changed' });
      }
      const banked = B.doc.pieces.filter((P, i) => !same(P.channels.phi, d.pieces[i].channels.phi)), up = D.valuesAt(d.pieces[0], 0).phi;
      let most = 0; for (const P of banked) { const n = Math.max(1, Math.ceil(P.length / 2)); for (let j = 0; j <= n; j++) most = Math.max(most, Math.abs(D.valuesAt(P, (P.length * j) / n).phi - up)); }
      return set({ history: D.commit(st.history, B.doc), ...resolvedOf(B.doc), dirty: true, lastEdited: null, lastStep: { op: 'bankLap', ms },
        ...ok(\`banked the lap: \${banked.length} piece\${banked.length === 1 ? '' : 's'} (\${names(banked.map((P) => P.id))}), up to \${(most * 180 / Math.PI).toFixed(1)}° into their turns; the route did not move (Ctrl+Z takes the bank back)\${notes.length ? \`; \${notes.join('; ')}\` : ''}\`) });
    },

    // undo and redo SAY what they changed (2026-10-13`],
]]);
// --- trackmenu.js
out.push(['app/core/trackmenu.js', [
  ["//                        Smooth ramps (D465: a command, the shell's smoothRamps, which says what it did in the status line)\n",
   "//                        Smooth ramps (D465: a command, the shell's smoothRamps, which says what it did in the status line), and Bank the lap (D473: a\n//                        command, the shell's bankLap, enabled on a closed lap only)\n"],
  ["    { label: 'Smooth ramps', title: 'make every bank, cup and edge change on this track start and end without a jolt, as new pieces do; the route stays where it is (the track is copied to its backups first; one undo step)', run: () => { void c.shell.smoothRamps(); } },\n",
   "    { label: 'Smooth ramps', title: 'make every bank, cup and edge change on this track start and end without a jolt, as new pieces do; the route stays where it is (the track is copied to its backups first; one undo step)', run: () => { void c.shell.smoothRamps(); } },\n    { label: 'Bank the lap', title: closed ? 'bank every upright curve of this closed lap into its turn, as closing a loop does; the route stays where it is (one undo step)' : 'close the loop first: only a closed lap can be banked', disabled: !closed, run: () => { void c.shell.bankLap(); } },\n"],
  ["  surfaceOf(c);   // alive from the first call, panel opened or not\n",
   "  surfaceOf(c);   // alive from the first call, panel opened or not\n  const closed = !!c.shell.getState().history.present.closed;   // read each time the menu opens (the bar calls items(ctx) then)\n"],
]]);
for (const [rel, e] of out) patch(rel, e);
