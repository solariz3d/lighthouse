// TIMING: the real-window check of the async previews (D240 follow-up). Two tracks are put in the run's own app data BEFORE the window starts (tracks/eq-big46.t180track, eq-biglap.t180track):
// a 46-piece 13.1 km open track (the middle delete's) and an 8-piece 14.3 km near-closed lap (Close's), as the probes measured them synchronously (8.5-10.3 s and 10.4 s).
fs.mkdirSync(path.join(dataDir, 'tracks'), { recursive: true });
let big = extend(D.createDoc('big46'), { length: 300, family: 'bowl' });
for (let i = 0; i < 45; i++) big = extend(big, { length: i % 3 === 2 ? 250 : 300, transition: 60, targets: { kh: (i % 2 ? -1 : 1) / 300 } });
fs.writeFileSync(path.join(dataDir, 'tracks', 'eq-big46.t180track'), D.serialize(big));
const CL = require(W + 'src/core/close.js');
let lap = extend(D.createDoc('biglap'), { length: 3000, family: 'bowl' });
for (let i = 0; i < 4; i++) { lap = extend(lap, { length: (Math.PI * 1000) / 2, transition: 60, targets: { kh: 1 / 1000 } }); lap = extend(lap, { length: i % 2 ? 3000 : 1000, transition: 60, targets: { kh: 0 } }); }
const farLap = D.checkDoc({ ...lap, pieces: lap.pieces.slice(0, -1), nextId: lap.nextId }), openLap = D.checkDoc({ ...CL.close(farLap, { edited: [0] }).doc, closed: false });
const nearLap = D.checkDoc({ ...openLap, pieces: openLap.pieces.map((p, k) => (k === 2 ? { ...p, channels: { ...p.channels, kh: p.channels.kh.map((v, i, a) => (i >= 3 && i <= a.length - 4 ? v + 1e-4 : v)) } } : p)) });
fs.writeFileSync(path.join(dataDir, 'tracks', 'eq-biglap.t180track'), D.serialize(nearLap));
