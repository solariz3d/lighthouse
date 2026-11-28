// ctl_rowaa.js (pane E, D678 N3): the controls for the row 9 A/A registration's three programs, run before the registration is committed.
// 1. holdage678.js on scratch hold files: none, someone else's, mine with no start, mine at 10 min (fits), mine at 80 min (does not), the 88 min boundary.
// 2. split678.js on a four-label session BUILT from S2 (relabelled c522ea6-a / c522ea6-b) and S7 (c522ea6 / 15e7d62), interleaved by round in the registered
//    order: split back into two, analyse678.js must give S7's analysis byte for byte, and S2's with only the label text changed.
// usage: node ctl_rowaa.js <scratch dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const EV = __dirname, S = path.dirname(EV), W = path.resolve(process.argv[2]);
if (fs.existsSync(W)) throw new Error(`${W} exists; give a new scratch dir`);
fs.mkdirSync(W, { recursive: true });
const HA = require('./holdage678.js');
const say = (s) => console.log(s);
// 1. holdage678
const hd = (name, rec) => { const d = path.join(W, 'hold', name); fs.mkdirSync(d, { recursive: true }); if (rec) fs.writeFileSync(path.join(d, 'heavy-run.hold'), JSON.stringify(rec)); return d; };
const now = Date.now(), iso = (m) => new Date(now - m * 60000).toISOString();
const tryH = (d) => { try { return `started ${new Date(HA.holdStarted(d)).toISOString()}`; } catch (e) { return `THROWS: ${e.message}`; } };
say(`1a no hold file:            ${tryH(hd('none'))}`);
say(`1b someone else's hold:     ${tryH(hd('other', { seat: 'x', cmd: 'A D678 item 3', started: iso(5) }))}`);
say(`1c mine, no start time:     ${tryH(hd('nostart', { seat: 'e', cmd: 'E D678 N3: row 9 A/A' }))}`);
const d10 = hd('ten', { seat: 'e', cmd: 'E D678 N3: row 9 A/A', started: iso(10) }), d80 = hd('eighty', { seat: 'e', cmd: 'E D678 N3: row 9 A/A', started: iso(80) });
say(`1d mine at 10 min, 4 df runs: ${JSON.stringify(HA.roundFits('df', HA.holdStarted(d10), now, 4))}`);
say(`1e mine at 80 min, 4 df runs: ${JSON.stringify(HA.roundFits('df', HA.holdStarted(d80), now, 4))}`);
say(`1f the boundary, age 74 min + 4 x 210 s = 88 min: ${JSON.stringify(HA.roundFits('df', now - 74 * 60000, now, 4))}; one second more: ${JSON.stringify(HA.roundFits('df', now - 74 * 60000 - 1000, now, 4))}`);
try { HA.roundFits('xx', now, now, 4); say('1g unknown kind: NO THROW (wrong)'); } catch (e) { say(`1g unknown kind: THROWS: ${e.message}`); }
// 2. split678 on a built four-label session
const read = (d) => fs.readFileSync(path.join(S, d, 'df.jsonl'), 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
const s2 = read('s2').map((r) => ({ ...r, label: r.label === 'c522ea6' ? 'c522ea6-a' : r.label, from: 's2', orig: r.label })), s7 = read('s7').map((r) => ({ ...r, from: 's7', orig: r.label }));
const order = ['c522ea6-a', 'c522ea6-b', 'c522ea6', '15e7d62'], B = path.join(W, 'built'); fs.mkdirSync(B);
const all = [...s2, ...s7].sort((a, b) => a.k - b.k || order.indexOf(a.label) - order.indexOf(b.label));
fs.writeFileSync(path.join(B, 'df.jsonl'), all.map(({ from, orig, ...r }) => JSON.stringify(r)).join('\n') + '\n');
for (const r of all) fs.copyFileSync(path.join(S, r.from, `df-${String(r.k).padStart(2, '0')}-${r.orig}.tap`), path.join(B, `df-${String(r.k).padStart(2, '0')}-${r.label}.tap`));
say(`2 built: ${all.length} runs, the first round in the order ${all.slice(0, 4).map((r) => r.label).join(', ')}`);
const node = (args) => { const r = spawnSync(process.execPath, args, { encoding: 'utf8' }); return `${r.status} ${(r.stdout || '').trim()} ${(r.stderr || '').trim().split('\n')[0] || ''}`.trim(); };
say(`2a split A/A:  ${node([path.join(EV, 'split678.js'), B, 'df', path.join(W, 'aa'), 'c522ea6-a', 'c522ea6-b'])}`);
say(`2b split pair: ${node([path.join(EV, 'split678.js'), B, 'df', path.join(W, 'pair'), 'c522ea6', '15e7d62'])}`);
say(`2c the wrong order refused: ${node([path.join(EV, 'split678.js'), B, 'df', path.join(W, 'bad'), '15e7d62', 'c522ea6'])}`);
say(`2d a label absent refused: ${node([path.join(EV, 'split678.js'), B, 'df', path.join(W, 'bad2'), 'c522ea6', 'nosuch'])}`);
for (const d of ['aa', 'pair']) spawnSync(process.execPath, [path.join(EV, 'analyse678.js'), path.join(W, d), 'df'], { encoding: 'utf8' });
const A = (d) => fs.readFileSync(path.join(d, 'analysis.txt'), 'utf8');
say(`2e the pair's analysis equals S7's byte for byte: ${A(path.join(W, 'pair')) === A(path.join(S, 's7'))}`);
const aaText = A(path.join(W, 'aa')).split('c522ea6-a').join('c522ea6');
say(`2f the A/A's analysis equals S2's with the label c522ea6-a read as c522ea6: ${aaText === A(path.join(S, 's2'))}`);
const tell = (t) => (t.match(/^ {2}row 9 ratio .*$/m) || [''])[0].replace(/\s+/g, ' ').slice(0, 160);
say(`2g row 9 in the A/A as split: ${tell(A(path.join(W, 'aa')).split('VERDICTS')[1] || '')}`);
