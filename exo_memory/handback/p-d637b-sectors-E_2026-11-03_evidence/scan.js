// probe: the bank-exit row's gate search, at the road (h 0) and at the dummies (h 1.5); tilt of each candidate station near the third
const PK = +process.argv[3], ER = +process.argv[4];
const R = process.argv[2], path = require('path'), fs = require('fs'), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), AD = q('src/core/adapter.js'), Lay = q('src/markers/layout.js'), Pl = q('src/markers/place.js'), { startLayout } = q('app/core/coreshell.js');
const DEG = Math.PI / 180;
const raw = JSON.parse(fs.readFileSync(path.join(R, 'test/fixtures/F1-bowl-default-lap-closed.core2.json'), 'utf8')), ch = raw.pieces[2].channels, n = ch.phi.length;
const ease = (i) => (i < 2 ? 1 : i >= n - 2 ? 0 : 1 - (i - 1) / (n - 3)), mid = (i) => (i < 2 || i >= n - 2 ? 0 : 1);
raw.pieces[1].channels.phi = raw.pieces[1].channels.phi.map((_, i, a) => (i >= a.length - 2 ? PK * DEG : 0));
Object.assign(ch, { phi: ch.phi.map((_, i) => PK * DEG * ease(i)), e: ch.phi.map(() => 0), er: ch.phi.map((_, i) => ER * mid(i)) });
const doc = D.parse(JSON.stringify(raw)), segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (x) => AD.offsetPath(doc, segs, x);
const p = lift(q('src/geom/path.js').buildPath(segs, { step: 2, closed: true, start })), starts = Pl.segStarts(p, segs);
const L = startLayout(segs, lift, start), sLine = Lay.anchorS(L.line, segs, starts);
const tilt = (s, h) => { const c = Pl.surfaceAt(p, segs, s, 0, starts), uL = c.span[1] - 0.5, uR = c.span[0] + 0.5; const a = Pl.placeMarker(p, segs, { s, u: uL, h }, starts).pos, b = Pl.placeMarker(p, segs, { s, u: uR, h }, starts).pos; const v = [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; return Math.asin(Math.abs(v[1]) / Math.hypot(...v)) / DEG; };
for (const h of [0, 1.5]) { const sec = Lay.lapSectors(p, segs, sLine, { height: h }); console.log(`search h=${h}:`, sec.map((a) => a.omitted ? 'omitted' : `s ${Lay.anchorS(a, segs, starts).toFixed(1)} road ${tilt(Lay.anchorS(a, segs, starts), 0).toFixed(2)}° dummies ${tilt(Lay.anchorS(a, segs, starts), 1.5).toFixed(2)}°`).join(' | ')); }
// the scan: every station of p3 and the road/dummy tilt there
