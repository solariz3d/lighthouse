// ---- mine (D642 review of a924f1b): which extra handles his piece gets with width and cup set, and the jump's ghost after his rolling piece (panel.js:808 sends shell.candidateJump)
(async () => {
  const out = {};
  for (const [w, c] of [[31, 15.5], [40, 15.5], [31, 30], [60, 40]]) {
    const p = await mount(); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 88.45); p.type('cup °', c); p.type('width m', w);
    out[`his piece, width ${w}, cup ${c}`] = { extras: p.panel.extraHandles().map((e) => e.field + (e.unused ? ' (unused)' : '')), offers: p.panel.offersAt().map((o) => o.field) };
    p.panel.unmount();
  }
  { const p = await mount(); p.type('length m', 1000); p.type('width m', 40); out['width 40 alone'] = { extras: p.panel.extraHandles().map((e) => e.field), offers: p.panel.offersAt().map((o) => o.field) }; p.panel.unmount(); }
  { const { createTrackModel } = require(WT + '/app/preview/trackmodel.js'); const p = await mount(); p.type('length m', 1000); p.type('bank °', 88.45);
    const s = p.shell; s.extend({ ...p.panel.options(), family: 'bowl' }); const st = s.getState(), tm = createTrackModel(); tm.update({ segments: st.resolved.segments, closed: false, start: st.resolved.start });
    let r; try { const g = tm.ghostFor(s.candidateJump({ length: 100 })); r = g.relaid === undefined ? 'copy-and-extend' : `re-laid from ${g.relaid}`; } catch (e) { r = `REFUSED or threw: ${String(e.message).slice(0, 90)}`; }
    out['the jump after his rolling 88.45'] = r; p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
