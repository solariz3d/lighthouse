const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 90)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/core/adapter.js', [
["  const segs = []; let pitch = doc.start.pitch, roll = 0, lastProfile = null, lastLegacy = false;\n",
 `  const segs = []; let pitch = doc.start.pitch, roll = 0, lastProfile = null, lastLegacy = false;
  // A CLOSED lap whose two ends are not the same kind (D190 R3): the cup end fades into the legacy end's rendered profile (tailZone; or, when the
  // cup is the START, the first metres fade out of the legacy END's last profile: morphZone), so the zip at s = 0 has no step
  const roadIdx = doc.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), firstRoad = roadIdx[0], lastRoad = roadIdx[roadIdx.length - 1];
  const seam = doc.closed && roadIdx.length > 1 && !!doc.pieces[firstRoad].cup !== !!doc.pieces[lastRoad].cup && cupRuns;
  const chan = (P, s) => Object.fromEntries(D.CHANNELS.map((ch) => [ch, D.channelAt(P, ch, s).v]));
  const nOf = (P) => Math.max(1, Math.ceil(P.length / segM - 1e-9));
  const legacyFirst = (P) => { const m = chan(P, P.length / nOf(P) / 2); return profileAt(P.family, m.w, m.r); };   // the profile of the piece's first segment
  const legacyLast = (P) => { const n = nOf(P), m = chan(P, (P.length * (2 * n - 1)) / (2 * n)); return profileAt(P.family, m.w, m.r); };   // and of its last
`],
["    const join = P.cup && lastLegacy && lastProfile ? { profile: lastProfile } : null;   // a cup handed over from a legacy cross-section\n    const cup = P.cup ? (cupRuns ? cupSegmentsRuns(P, n, at, join) : cupSegmentsLocal(P, n, at)) : null;",
 "    let join = P.cup && lastLegacy && lastProfile ? { profile: lastProfile } : null;   // a cup handed over from a legacy cross-section\n    if (seam && pi === firstRoad && P.cup) join = { profile: legacyLast(doc.pieces[lastRoad]) };   // the lap's start is a cup that follows the legacy END round the seam\n    const tail = seam && pi === lastRoad && P.cup ? legacyFirst(doc.pieces[firstRoad]) : null;   // the lap's end is a cup that meets the legacy START\n    const cup = P.cup ? (cupRuns ? cupSegmentsRuns(P, n, at, join, tail) : cupSegmentsLocal(P, n, at)) : null;"],
]);
