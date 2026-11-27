// f1probe.js (pane B, L258 F1): what PC.insert says at a head whose right side has its own width, for a road-first saved piece, its mirror, a jump-first piece,
// a closed lap, and the same head after the right width is brought back to the width. Synthetic roads only (the right-width rows' road). usage: node f1probe.js <tree>
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), PC = require(path.join(T, 'src/core/piece.js'));
const W = 19.1, WR = 22.6, STEP = WR - W;
const tryv = (f) => { try { return f(); } catch (e) { return `THROWS ${e.code || e.name}: ${e.message}`; } };
const road = () => extend(extend(D.createDoc('r'), { length: 120, first: { w: W }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
const plain = PC.saveRun(road(), 1, 1, { name: 'plain' });
const splitHead = extend(road(), { length: 100, transition: { wd: 5 }, targets: { wd: STEP } });
const back = extend(splitHead, { length: 100, transition: { wd: 5 }, targets: { wd: 0 } });
const show = (label, f) => console.log(`${label}\n  ${(() => { const r = tryv(f); return typeof r === 'string' ? r : `laid: ${r.pieces.length} pieces, head wd ${JSON.stringify(D.endState(r).wd)}`; })()}`);
console.log(`split head wd ${JSON.stringify(D.endState(splitHead).wd)}; back head wd ${JSON.stringify(D.endState(back).wd)}`);
show('road-first piece at the split head', () => PC.insert(splitHead, plain));
show('its mirror at the split head', () => PC.insert(splitHead, plain, { mirror: true }));
show('keepStart at the split head', () => PC.insert(splitHead, plain, { keepStart: true }));
show('road-first piece after the right width is back at the width', () => PC.insert(back, plain));
// a jump-first saved piece: a flight then a landing road
let j = extend(D.createDoc('j'), { length: 120, first: { w: W }, targets: { kh: 0 } });
j = D.appendPiece(j, D.flightPiece({ forward: 40, left: 0, up: 0, heading: 0, pitch: 0, bank: 0 }));
j = extend(j, { length: 80, targets: { kh: 0 } });
const jumpFirst = tryv(() => PC.saveRun(j, 1, 2, { name: 'jump' }));
if (typeof jumpFirst === 'string') console.log(`jump-first save: ${jumpFirst}`);
else { show('jump-first piece at the split head', () => PC.insert(splitHead, jumpFirst)); show('jump-first piece after the width is back', () => PC.insert(back, jumpFirst)); }
// a split head with an edge, and a plain (edgeless) run: which channel does the joint name first
const edged = tryv(() => extend(extend(D.createDoc('e'), { length: 120, first: { w: W, e: 10 }, targets: { kh: 0 } }), { length: 100, transition: { wd: 5 }, targets: { wd: STEP } }));
if (typeof edged === 'string') console.log(`edged head: ${edged}`); else show('edgeless piece at an edged split head', () => PC.insert(edged, plain));
