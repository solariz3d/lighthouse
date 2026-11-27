// o_vary.js (pane O, L258 track 2 read; scratch): B's right width (d677-right-width-b e4e7ecc) varied where B's rows do not go. Our own synthetic roads,
// and COPIES of his saves (read only; never his folder; a track is its index, never its name). usage: node o_vary.js <branch tree> <base tree> <copies dir>
//   H  other heads: what each way of adding road does after a head whose right side has its own width (Extend, Level, Turn by, Turn to grid, Sharp, a free
//      Jump and the road after it, an inserted saved piece, Delete of a piece inside the split run, Smooth ramps, a Sculpt width brush)
//   W  other widths: a right side narrower than the left (down to 1 m, and 0, refused), a cup piece, an edge piece with its right edge, a legacy piece
//   C  closed laps: split all the way round; split in the middle only; Bank the lap on a split lap
//   X  consumers: the export of a split track with a pit lane on its right, read back (the AI line's two sides, the lane), pass clearance's own section
//   O  old tracks: every save, backup and undo step, parse -> serialize on base and branch; one plain Extend and one width brush on each, on both trees
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [BR, BASE, COPIES] = process.argv.slice(2).map((p) => path.resolve(p));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const load = (T) => ({ T, D: require(path.join(T, 'src/core/document.js')), EXT: require(path.join(T, 'src/core/extend.js')), A: require(path.join(T, 'src/core/adapter.js')),
  PC: require(path.join(T, 'src/core/piece.js')), SR: require(path.join(T, 'src/core/smoothramps.js')), CL: require(path.join(T, 'src/core/close.js')),
  SH: require(path.join(T, 'app/core/coreshell.js')), EXP: (() => { try { return require(path.join(T, 'app/export/export.js')); } catch (e) { return null; } })() });
const B = load(BR), O = load(BASE);
const out = { H: [], W: [], C: [], X: [], O: {} };
const W0 = 19.1, STEP = 3.5;
const msg = (e) => (e && (e.code ? `${e.code}: ` : '') + String(e.message || e)).slice(0, 220);
/** right and left half-width at the start and end of every road piece, read from the adapter's own segments (what the mesh is built from) */
function sidesOf(M, doc) {
  const segs = M.A.toSegments(doc), out = []; let pi = -1, acc = 0;
  const per = new Map(); for (const g of segs) { const k = g.piece !== undefined ? g.piece : g.pi; if (!per.has(k)) per.set(k, []); per.get(k).push(g); }
  return segs.map((g) => ({ id: g.id, right: +(-g.profile.u[0]).toFixed(3), left: +(g.profile.u[g.profile.u.length - 1]).toFixed(3) }));
}
const endWd = (M, P) => (P.split ? +M.D.pieceEnd(P).wd.v.toFixed(4) : 0);
const startWd = (P) => (P.split ? +P.channels.wd[0].toFixed(4) : 0);
/** our own road: a straight at W0, a left turn at R 400 banked 8, then a piece that steps the right side +STEP over 5 m and holds it (the head is split) */
function splitHead(M) {
  let d = M.EXT.extend(M.D.createDoc('vary'), { length: 120, first: { w: W0 }, targets: { kh: 0 } });
  d = M.EXT.extend(d, { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
  return M.EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: STEP } });
}
async function shellOn(M, doc, extra = {}) {
  const text = M.D.serialize(doc), s = await M.SH.createCoreShell({ storage: { openDoc: async () => text, listPieces: async () => [], ...extra.storage }, autosaveMs: 0, ...extra.opts });
  await s.open('vary'); return s;
}
const rec = (bucket, name, f) => f().then((r) => bucket.push({ case: name, ...r })).catch((e) => bucket.push({ case: name, threw: msg(e) }));
(async () => {
  // ── H: other heads ──
  const head = splitHead(B), hw = endWd(B, head.pieces[head.pieces.length - 1]);
  const afterOp = async (name, op) => rec(out.H, name, async () => {
    const s = await shellOn(B, head); const n0 = s.getState().history.present.pieces.length;
    await op(s);
    const st = s.getState(), d = st.history.present, added = d.pieces.slice(n0);
    const firstRoad = added.find((P) => P.type === 'road');
    const sd = firstRoad ? sidesOf(B, d).filter((x) => x.id === firstRoad.id) : [];
    return { message: st.message || null, added: added.map((P) => (P.type === 'road' ? `${P.length}m${P.split ? ' split' : ''}` : P.type)), headWd: hw,
      firstRoadStartWd: firstRoad ? startWd(firstRoad) : null, firstRoadEndWd: firstRoad ? endWd(B, firstRoad) : null,
      rightHalfAtJoint: sd.length ? sd[0].right : null, rightHalfAtHeadEnd: sidesOf(B, d).filter((x) => x.id === d.pieces[n0 - 1].id).slice(-1)[0].right, schema: JSON.parse(B.D.serialize(d)).schema };
  });
  await afterOp('Extend 80 m, nothing typed', (s) => s.extend({ length: 80 }));
  await afterOp('Level 80 m', (s) => s.extendLevel({ length: 80 }));
  await afterOp('Turn by 30 deg, 120 m', (s) => s.extendTurnBy({ length: 120 }, 30));
  await afterOp('Turn to grid, 120 m', (s) => s.extendTurnToGrid({ length: 120 }, 90));
  await afterOp('Sharp 60 deg R 40', (s) => s.extendSharp({ length: 60 }, { deg: 60, R: 40, ramp: 15 }));
  await afterOp('Jump (free flight and its default landing)', (s) => s.jump({ length: 40 }));
  await afterOp('Jump, then Extend 80 m after the landing deleted? no: Extend after the landing', async (s) => { s.jump({ length: 40 }); s.extend({ length: 80 }); });
  await afterOp('Extend 60 m with the width alone typed (w 25)', (s) => s.extend({ length: 60, targets: { w: 25 } }));
  // an inserted saved piece (a plain run saved from a road with no split), at the split head
  await rec(out.H, 'Insert a saved plain piece at the split head', async () => {
    const plain = B.EXT.extend(B.D.createDoc('p'), { length: 60, first: { w: W0 }, targets: { kh: 1 / 300 } }), piece = B.PC.saveRun(plain, 0, 0, { name: 'p' });
    try { const d = B.PC.insert(head, piece); const P = d.pieces[d.pieces.length - 1]; return { laid: true, startWd: startWd(P), split: !!P.split, headWd: hw, rightHalfAfter: sidesOf(B, d).filter((x) => x.id === P.id)[0].right }; }
    catch (e) { return { laid: false, refused: msg(e) }; }
  });
  // Delete inside a split run: [straight, turn, step up 0->3.5, hold 3.5, step down 3.5->0, plain]; delete the step up, then the hold
  await rec(out.H, 'Delete inside the split run (the step up; then the hold)', async () => {
    let d = B.EXT.extend(head, { length: 80 }); d = B.EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: 0 } }); d = B.EXT.extend(d, { length: 80 });
    const res = {};
    for (const [label, i] of [['step up (2)', 2], ['hold (3)', 3]]) {
      try { const r = B.PC.deleteRun(d, i, i); const dd = r.doc || r; res[label] = { laid: true, pieces: dd.pieces.length, wdAtJoints: dd.pieces.map((P) => (P.type === 'road' ? [startWd(P), endWd(B, P)] : null)), schema: JSON.parse(B.D.serialize(dd)).schema }; }
      catch (e) { res[label] = { laid: false, refused: msg(e) }; }
    }
    return res;
  });
  await rec(out.H, 'Smooth ramps on a road with a split run', async () => {
    let d = B.EXT.extend(head, { length: 80 }); d = B.EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: 0 } });
    try { const r = B.SR.smoothRamps(d); const dd = r.doc || r; const same = d.pieces.every((P, i) => P.type !== 'road' || JSON.stringify(P.channels.wd) === JSON.stringify(dd.pieces[i].channels.wd)); return { laid: true, wdKept: same, splitFlagsKept: d.pieces.every((P, i) => !!P.split === !!dd.pieces[i].split) }; }
    catch (e) { return { laid: false, refused: msg(e) }; }
  });
  await rec(out.H, 'Sculpt: a width brush (+2 m) on the held split piece', async () => {
    const s = await shellOn(B, head), d0 = s.getState().history.present, i = d0.pieces.length - 1, s0 = d0.pieces.slice(0, i).reduce((a, P) => a + (P.length || 0), 0) + 50;
    s.beginBrush({ mode: 'rate', channel: 'w', s0, r: 30 }); s.brushTo(2); s.endBrush();
    const d1 = s.getState().history.present, before = sidesOf(B, d0).filter((x) => x.id === d0.pieces[i].id), after = sidesOf(B, d1).filter((x) => x.id === d1.pieces[i].id), mid = Math.floor(before.length / 2);
    return { message: s.getState().message || null, wdUnchanged: JSON.stringify(d0.pieces[i].channels.wd) === JSON.stringify(d1.pieces[i].channels.wd), rightMid: [before[mid].right, after[mid].right], leftMid: [before[mid].left, after[mid].left] };
  });
  // ── W: other widths ──
  const widthCase = (name, first, targets) => rec(out.W, name, async () => {
    try { const d = B.EXT.extend(B.EXT.extend(B.D.createDoc('w'), { length: 100, first }), { length: 100, transition: { wd: 10 }, targets }); const sd = sidesOf(B, d).filter((x) => x.id === d.pieces[1].id); const last = sd[sd.length - 1];
      return { laid: true, schema: JSON.parse(B.D.serialize(d)).schema, endLeft: last.left, endRight: last.right, minRight: Math.min(...sd.map((x) => x.right)) }; }
    catch (e) { return { laid: false, refused: msg(e) }; }
  });
  await widthCase('narrow right: w 20, wd -18 (right side 2 m, half 1 m)', { w: 20 }, { wd: -18 });
  await widthCase('right side 0: w 20, wd -20', { w: 20 }, { wd: -20 });
  await widthCase('wide right: w 10, wd +40 (right half 25 m)', { w: 10 }, { wd: 40 });
  await widthCase('a cup piece (c 30) with wd +6', { w: 16 }, { c: 30, wd: 6 });
  await widthCase('an edge piece (e 25, er 10, s 0.6) with wd +6', { w: 16 }, { e: 25, er: 10, s: 0.6, wd: 6 });
  await widthCase('the flat family with wd +6', { w: 16 }, { wd: 6 });
  // ── C: closed laps ──
  const lapOf = (M, wdAll, middleOnly) => {   // four 90-degree corners of R 150 m with 100 m straights: a square-ish lap, then Close
    let d = M.D.createDoc('lap'), first = true;
    for (let k = 0; k < 4; k++) {
      d = M.EXT.extend(d, { length: 100, ...(first ? { first: { w: 14, ...(wdAll ? { wd: wdAll } : {}) } } : {}), targets: { kh: 0, ...(middleOnly && k === 1 ? { wd: 4 } : middleOnly && k === 2 ? { wd: 0 } : {}) }, ...(middleOnly && (k === 1 || k === 2) ? { transition: { wd: 20 } } : {}) }); first = false;
      d = M.EXT.extend(d, { length: Math.PI / 2 * 150, targets: { kh: 1 / 150 } });
    }
    return d;
  };
  for (const [name, wdAll, mid] of [['split all the way round (wd 3 from the start)', 3, false], ['split in the middle only (wd 0 -> 4 -> 0)', 0, true]]) await rec(out.C, name, async () => {
    const d = lapOf(B, wdAll, mid);
    try { const r = B.CL.close(d, { edited: [d.pieces.length - 1] }); const dd = r.doc; const F = dd.pieces[0], L = dd.pieces[dd.pieces.length - 1];
      return { converged: r.converged, closed: dd.closed, schema: JSON.parse(B.D.serialize(dd)).schema, seamWd: [startWd(F), endWd(B, L)], splitFlags: dd.pieces.filter((P) => P.split).length };
    } catch (e) { return { converged: false, refused: msg(e) }; }
  });
  await rec(out.C, 'Bank the lap on a lap split all the way round', async () => {
    const d0 = lapOf(B, 3, false), r = B.CL.close(d0, { edited: [d0.pieces.length - 1] }); if (!r.converged) return { skipped: 'did not close' };
    const s = await shellOn(B, r.doc); await s.bankLap(); const d1 = s.getState().history.present;
    return { message: s.getState().message || null, changed: d1 !== s.getState().history.past.slice(-1)[0], wdKept: r.doc.pieces.every((P, i) => P.type !== 'road' || JSON.stringify(P.channels.wd) === JSON.stringify(d1.pieces[i].channels.wd)) };
  });
  // ── X: consumers ──
  await rec(out.X, 'pass clearance reads the widened side (its own section of a split segment)', async () => {
    const PCL = require(path.join(BR, 'src/validate/passclear.js')), G = require(path.join(BR, 'src/geom/profile.js')), segs = B.A.toSegments(head), g = segs[segs.length - 1];
    const keys = Object.keys(PCL); const prof = G.normalize ? G.normalize(g.profile) : g.profile;
    return { exports: keys.slice(0, 12), segRight: +(-prof.u[0]).toFixed(3), segLeft: +prof.u[prof.u.length - 1].toFixed(3), expectRight: +((W0 + STEP) / 2).toFixed(3), expectLeft: +(W0 / 2).toFixed(3) };
  });
  await rec(out.X, 'the test export of a split road with a pit lane on its right: written, its AI line sides, the lane', async () => {
    if (!B.EXP) return { skipped: 'no exporter' };
    let d = B.EXT.extend(head, { length: 300 }); d = B.EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: 0 } }); d = B.EXT.extend(d, { length: 200 });
    const ex = await B.EXP.makeExporter(async (rel) => fs.readFileSync(path.join(BR, rel), 'utf8')), s = await shellOn(B, d, { opts: { exporter: ex } });
    const L = s.getState().history.present.pieces.reduce((a, P) => a + (P.length || 0), 0);
    s.setPitLane({ side: 'R', leave: 480, rejoin: 760, offsetM: 6, width: 8 }); const pm = s.getState().message;
    let r; try { r = s.buildExport({ test: true }); } catch (e) { return { pitMessage: pm, refused: msg(e) }; }
    const files = r.folders.flatMap((f) => f.files), ai = files.find((x) => /fast_lane\.ai$/.test(x.path));
    const AI = require(path.join(BR, 'src/export/ailine.js')), line = AI.readAiLine(Buffer.from(ai.bytes));
    const at = (m) => { let k = 0; for (let i = 0; i < line.points.length; i++) if (line.points[i].length <= m) k = i; return { left: +line.extra[k].sideLeft.toFixed(2), right: +line.extra[k].sideRight.toFixed(2) }; };
    return { pitMessage: pm, files: files.length, pitFiles: files.filter((x) => /pit/i.test(x.path)).map((x) => x.path).slice(0, 6), lengthM: Math.round(L), aiAt: { straight60m: at(60), heldStep570m: at(570), afterBack860m: at(860) }, expect: { left: W0 / 2, right: (W0 + STEP) / 2 } };
  });
  // ── O: old tracks, base against branch ──
  const tracks = fs.readdirSync(path.join(COPIES, 'tracks')).filter((f) => /^eq-.*\.t180track$/.test(f)).sort();
  const backups = fs.existsSync(path.join(COPIES, 'backups')) ? fs.readdirSync(path.join(COPIES, 'backups')).filter((f) => /\.t180track$/.test(f)).sort() : [];
  const undos = fs.readdirSync(path.join(COPIES, 'tracks')).filter((f) => /\.t180undo$/.test(f)).sort();
  const both = (text) => { const r = {}; for (const [k, M] of [['base', O], ['branch', B]]) { try { r[k] = sha(M.D.serialize(M.D.parse(text))); } catch (e) { r[k] = 'refused ' + (e.code || e.name); } } return r; };
  const tally = (texts) => { let same = 0, sameAsText = 0, refusedBoth = 0; const diff = []; texts.forEach(([label, t], i) => { const r = both(t); if (r.base === r.branch) { same++; if (r.base.startsWith('refused')) refusedBoth++; else if (r.base === sha(t)) sameAsText++; } else diff.push({ label, ...r }); }); return { n: texts.length, sameOnBoth: same, savedAsOwnText: sameAsText, refusedOnBoth: refusedBoth, differ: diff }; };
  out.O.tracks = tally(tracks.map((f, i) => [`track ${i + 1}`, fs.readFileSync(path.join(COPIES, 'tracks', f), 'utf8')]));
  out.O.backups = tally(backups.map((f, i) => [`backup ${i + 1}`, fs.readFileSync(path.join(COPIES, 'backups', f), 'utf8')]));
  const steps = []; undos.forEach((f, i) => { try { const o = JSON.parse(fs.readFileSync(path.join(COPIES, 'tracks', f), 'utf8')); const all = [o.present, ...(o.past || []), ...(o.future || [])].filter((x) => typeof x === 'string'); all.forEach((t, j) => steps.push([`undo ${i + 1} step ${j}`, t])); } catch (e) { steps.push([`undo ${i + 1} unreadable`, '{}']); } });
  out.O.undoSteps = tally(steps);
  // one plain Extend and one width brush on each old track, on both trees: the same text
  const editBoth = async (text) => { const r = {}; for (const [k, M] of [['base', O], ['branch', B]]) { try { const s = await M.SH.createCoreShell({ storage: { openDoc: async () => text }, autosaveMs: 0 }); await s.open('t'); if (s.getState().name !== 't') { r[k] = 'not opened'; continue; }
      const d0 = s.getState().history.present; if (d0.closed) { r[k] = 'closed: extend skipped'; continue; } s.extend({ length: 80 }); const a = sha(M.D.serialize(s.getState().history.present));
      const L = s.getState().history.present.pieces.reduce((x, P) => x + (P.length || 0), 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L / 2, r: 30 }); s.brushTo(1.5); s.endBrush(); r[k] = a + '/' + sha(M.D.serialize(s.getState().history.present)); } catch (e) { r[k] = 'threw ' + (e.code || e.name); } } return r; };
  const ed = []; for (const [i, f] of tracks.entries()) ed.push({ track: i + 1, ...(await editBoth(fs.readFileSync(path.join(COPIES, 'tracks', f), 'utf8'))) });
  out.O.editedOnBoth = { n: ed.length, same: ed.filter((x) => x.base === x.branch).length, differ: ed.filter((x) => x.base !== x.branch), skipped: ed.filter((x) => /skipped|not opened|threw/.test(x.base)).length };
  console.log(JSON.stringify(out, null, 1));
})();
