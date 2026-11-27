// score.js -- the scorer. Reads passes.csv only; prints every count used in scores.md.
// Run: node G:/consonance-scratch/fable-break/score.js > G:/consonance-scratch/fable-break/score_out.txt
'use strict';
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'passes.csv');
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l.length);
const head = lines[0].split(',');
const NUM = new Set(['cfm', 't_start', 't_end', 'speed_kmh', 'deepest_cm', 'crosses_11cm', 'sink_rate_at_11cm', 'max_sink_rate_5_to_16cm', 'peak_load_g', 'u_m', 'road_roll_deg', 'roll_rate_deg_per_m', 'roll_acc_deg_per_m2', 'roll_load_g', 'wheel_under', 'near_edge_m', 'sink_rate_1frame', 'half_width_m', 'min_wheel_cm', 'closed_section', 'up_dot_normal', 'dur_s', 'max_1frame_speed_loss_kmh', 'air_before_s', 'after_break', 'own_track', 'own_driving']);
const rows = lines.slice(1).map((l, i) => {
  const f = l.split(',');
  if (f.length !== head.length) throw new Error('row ' + (i + 2) + ' has ' + f.length + ' fields, header has ' + head.length);
  const r = {};
  head.forEach((h, j) => { r[h] = NUM.has(h) ? (f[j] === '' ? NaN : Number(f[j])) : f[j]; });
  if (r.outcome !== 'broke' && r.outcome !== 'held') throw new Error('row ' + (i + 2) + ' outcome ' + r.outcome);
  if (r.split !== 'train' && r.split !== 'test') throw new Error('row ' + (i + 2) + ' split ' + r.split);
  return r;
});
const P = s => console.log(s);
const id = r => `${r.replay_id} t ${r.t_start} ${r.car} ${r.track_tag} ${r.kind} ${r.outcome}`;
const test = rows.filter(r => r.split === 'test');
const broke = r => r.outcome === 'broke';
P(`rows ${rows.length}; broke ${rows.filter(broke).length}; test ${test.length} (broke ${test.filter(broke).length}, held ${test.filter(r => !broke(r)).length})`);
P('test breaks:');
test.filter(broke).forEach(r => P(`  ${id(r)} | speed ${r.speed_kmh} deepest ${r.deepest_cm} cross ${r.crosses_11cm} rate3 ${r.sink_rate_at_11cm} rate1 ${r.sink_rate_1frame} load ${r.peak_load_g} u ${r.u_m} roll ${r.road_roll_deg} rollacc ${r.roll_acc_deg_per_m2} rollload ${r.roll_load_g} edge ${r.near_edge_m} | ${r.how_broke}`));

function twoByTwo(name, set, pred) {
  const c = { bp: 0, bn: 0, hp: 0, hn: 0 }, flaggedHeld = [], missed = [], caught = [];
  for (const r of set) {
    const p = !!pred(r);
    if (broke(r)) { if (p) { c.bp++; caught.push(r); } else { c.bn++; missed.push(r); } }
    else { if (p) { c.hp++; flaggedHeld.push(r); } else c.hn++; }
  }
  P(`\n== ${name} (n ${set.length}) ==`);
  P(`  broke & predicted broke ${c.bp}; broke & predicted held ${c.bn}; held & predicted broke ${c.hp}; held & predicted held ${c.hn}`);
  caught.forEach(r => P('   caught:       ' + id(r)));
  missed.forEach(r => P('   missed:       ' + id(r)));
  flaggedHeld.forEach(r => P('   false alarm:  ' + id(r)));
  return c;
}

// ---------- the three blind rules, TEST rows only ----------
const contact = r => r.crosses_11cm === 1 && r.sink_rate_at_11cm >= 1.7 && r.peak_load_g >= 50;
const geoA = r => r.near_edge_m <= 4.1 && Math.abs(r.road_roll_deg) >= 15 && Math.abs(r.road_roll_deg) <= 90 && r.up_dot_normal >= 0.5 && r.speed_kmh >= 600;
const geoB = r => Math.abs(r.roll_acc_deg_per_m2) >= 0.03;
const geo = r => geoA(r) || geoB(r);
const open = r => Math.abs(r.u_m) > 13.44 && Math.abs(r.road_roll_deg) > 21.5;

const cC = twoByTwo('CONTACT rule, test', test, contact);
{
  const flagged = cC.bp + cC.hp;
  const cls = test.filter(r => r.crosses_11cm === 1 && r.peak_load_g >= 50);
  const wrong = cls.filter(r => (broke(r) && r.sink_rate_at_11cm < 1.7) || (!broke(r) && r.sink_rate_at_11cm >= 1.7));
  P(`  (a) flagged ${flagged}, of them held ${cC.hp}`);
  P(`  (b) test class crosses_11cm=1 & peak_load_g>=50: ${cls.length} rows (broke ${cls.filter(broke).length}, held ${cls.filter(r => !broke(r)).length}); wrong side of 1.7: ${wrong.length}`);
  cls.forEach(r => P(`     ${id(r)} rate3 ${r.sink_rate_at_11cm} rate1 ${r.sink_rate_1frame} load ${r.peak_load_g}`));
  P(`  narrowness: catches ${cC.bp} of ${cC.bp + cC.bn} test breaks`);
  P(`  test crossers at any load: ${test.filter(r => r.crosses_11cm === 1).length}; test breaks with load>=50: ${test.filter(r => broke(r) && r.peak_load_g >= 50).length}`);
}
const cG = twoByTwo('GEOMETRY rule (a or b), test', test, geo);
const cGa = twoByTwo('GEOMETRY clause (a) alone, test', test, geoA);
const cGb = twoByTwo('GEOMETRY clause (b) alone, test', test, geoB);
const cO = twoByTwo('OPEN rule, test', test, open);
{
  const nonAft = test.filter(r => broke(r) && r.kind !== 'aftermath');
  P(`  test breaks not aftermath: ${nonAft.length}; caught of those: ${nonAft.filter(open).length}`);
  P(`  test rows with |u_m| > 13.44: ${test.filter(r => Math.abs(r.u_m) > 13.44).length}`);
  test.filter(r => Math.abs(r.u_m) > 13.44).forEach(r => P(`     ${id(r)} u ${r.u_m} roll ${r.road_roll_deg}`));
  const helix = test.filter(r => /^t180b_elysium/.test(r.track_tag) && Math.abs(r.road_roll_deg) >= 60 && Math.abs(r.road_roll_deg) <= 70);
  P(`  helix fact: test passes on t180b_elysium* with |roll| 60-70: ${helix.length}`);
  helix.forEach(r => P(`     ${id(r)} |u| ${Math.abs(r.u_m)} roll ${r.road_roll_deg}`));
  P(`     held at |u|>13.44: ${helix.filter(r => !broke(r) && Math.abs(r.u_m) > 13.44).length}; broke at |u|<13.22: ${helix.filter(r => broke(r) && Math.abs(r.u_m) < 13.22).length}`);
}

// ---------- baselines, TEST rows ----------
twoByTwo('BASELINE always held, test', test, () => false);
twoByTwo('BASELINE deepest_cm beyond 16 (deepest_cm < -16), test', test, r => r.deepest_cm < -16);
twoByTwo('BASELINE deepest_cm beyond 16, all rows', rows, r => r.deepest_cm < -16);

// ---------- P1 ----------
// H563's own passes, as census.md section 5 matched them (five found of seven).
const h563 = r =>
  (r.replay_id === 'c74e4fd35558' && r.deepest_cm === -14.9) ||
  (r.replay_id === 'e5c0fd082282' && r.deepest_cm === -15.9) ||
  (r.replay_id === 'f449f0bb1c96' && r.deepest_cm === -3.0) ||
  (r.replay_id === '0805d953319d' && broke(r) && r.kind === 'road') ||
  (r.replay_id === '065789823b52' && r.t_start === 59.94);
const H = rows.filter(h563);
P(`\n== P1 ==\nH563 rows matched in the table: ${H.length}`);
H.forEach(r => P(`   ${id(r)} cross ${r.crosses_11cm} rate3 ${r.sink_rate_at_11cm}`));
function p1(name, set, col) {
  const hold = set.filter(r => !broke(r)), br = set.filter(broke);
  const side = r => r[col] <= 0.63 ? 'slow' : r[col] >= 1.66 ? 'fast' : 'between';
  const cnt = (a, s) => a.filter(r => side(r) === s).length;
  const wrong = cnt(hold, 'fast') + cnt(br, 'slow');
  const between = cnt(hold, 'between') + cnt(br, 'between');
  P(`\n-- P1 on ${name}, column ${col}: n ${set.length} (held ${hold.length}, broke ${br.length})`);
  P(`   held: <=0.63 ${cnt(hold, 'slow')}, between ${cnt(hold, 'between')}, >=1.66 ${cnt(hold, 'fast')}`);
  P(`   broke: <=0.63 ${cnt(br, 'slow')}, between ${cnt(br, 'between')}, >=1.66 ${cnt(br, 'fast')}`);
  P(`   wrong side ${wrong} of ${set.length} (limit: more than ${set.length / 5}); between ${between} of ${set.length} (limit: more than ${set.length / 2})`);
  P(`   -> ${set.length === 0 ? 'cannot be read (no rows)' : (wrong > set.length / 5 || between > set.length / 2) ? 'FAILED' + (wrong > set.length / 5 ? ' [wrong side]' : '') + (between > set.length / 2 ? ' [most between]' : '') : 'held'}`);
  set.filter(r => (broke(r) && side(r) !== 'fast') || (!broke(r) && side(r) !== 'slow')).forEach(r => P(`     off the claim: ${id(r)} ${col} ${r[col]} load ${r.peak_load_g} (${side(r)})`));
}
const crossers = rows.filter(r => r.crosses_11cm === 1 && !h563(r));
P(`new crossers of 11 cm (not H563): ${crossers.length}; with no rate: ${crossers.filter(r => isNaN(r.sink_rate_at_11cm)).length}`);
const sets = {
  'all new crossers': crossers,
  'new crossers, kind road': crossers.filter(r => r.kind === 'road'),
  'new crossers, kind road, peak_load_g>=50': crossers.filter(r => r.kind === 'road' && r.peak_load_g >= 50),
  'new crossers, kind road, own track (t180b_)': crossers.filter(r => r.kind === 'road' && r.own_track === 1),
  'new crossers, kind landing': crossers.filter(r => r.kind === 'landing'),
  'new crossers, test split only': crossers.filter(r => r.split === 'test'),
};
for (const k in sets) { p1(k, sets[k], 'sink_rate_at_11cm'); }
p1('all new crossers', crossers, 'sink_rate_1frame');
p1('new crossers, kind road', sets['new crossers, kind road'], 'sink_rate_1frame');

// ---------- P2 ----------
P('\n== P2 ==');
function p2(name, set) {
  const s = set.filter(r => !isNaN(r.roll_load_g));
  const v = s.map(r => r.roll_load_g).sort((a, b) => a - b);
  const k = Math.ceil(s.length / 4);
  const cut = v[v.length - k];
  const top = s.filter(r => r.roll_load_g >= cut), rest = s.filter(r => r.roll_load_g < cut);
  const tb = top.filter(broke).length, rb = rest.filter(broke).length;
  const pt = tb / top.length, pr = rb / rest.length;
  P(`-- ${name}: n ${s.length} (no roll_load ${set.length - s.length}); top-quarter cut roll_load_g >= ${cut}`);
  P(`   top quarter: ${tb} broke of ${top.length} (${(100 * pt).toFixed(1)}%); rest: ${rb} broke of ${rest.length} (${(100 * pr).toFixed(1)}%) -> ${pt > pr ? 'commoner in the top quarter' : 'NOT commoner'}`);
  // exact one-sided hypergeometric tail: P(top holds >= tb breaks | margins)
  const lc = (n, m) => { let x = 0; for (let i = 0; i < m; i++) x += Math.log(n - i) - Math.log(i + 1); return x; };
  const B = tb + rb, N = s.length, K = top.length; let p = 0;
  for (let x = tb; x <= Math.min(B, K); x++) p += Math.exp(lc(K, x) + lc(N - K, B - x) - lc(N, B));
  P(`   chance of ${tb} or more of the ${B} breaks landing in the top ${K} by luck: ${p.toFixed(3)}`);
  top.filter(broke).forEach(r => P(`     top-quarter break: ${id(r)} roll_load ${r.roll_load_g} u ${r.u_m} rollacc ${r.roll_acc_deg_per_m2}`));
}
p2('all rows', rows);
p2('all rows but aftermath', rows.filter(r => r.kind !== 'aftermath'));
p2('kind road', rows.filter(r => r.kind === 'road'));
p2('kind road, own tracks', rows.filter(r => r.kind === 'road' && r.own_track === 1));
p2('kind road, other tracks', rows.filter(r => r.kind === 'road' && r.own_track === 0));
p2('t180b_elysium only, all kinds', rows.filter(r => r.track_tag === 't180b_elysium'));
p2('test split, all rows', test);

// ---------- P3 ----------
P('\n== P3 ==');
const byCar = {};
rows.forEach(r => { (byCar[r.car] = byCar[r.car] || { rows: 0, broke: 0, cross: 0 }); byCar[r.car].rows++; if (broke(r)) byCar[r.car].broke++; if (r.crosses_11cm === 1) byCar[r.car].cross++; });
P('rows by car: ' + JSON.stringify(byCar));
P('typea rows: ' + rows.filter(r => r.car === 'typea').length);
const tracks = [...new Set(rows.map(r => r.track_tag))];
for (const t of tracks) {
  const s = rows.filter(r => r.track_tag === t);
  const cars = [...new Set(s.map(r => r.car))];
  if (cars.length < 2) continue;
  P(`-- ${t}: cars ${cars.join(', ')}`);
  for (const c of cars) {
    const cs = s.filter(r => r.car === c);
    P(`   ${c}: ${cs.length} passes, ${cs.filter(broke).length} broke; crossers ${cs.filter(r => r.crosses_11cm === 1).length}`);
    cs.filter(r => r.crosses_11cm === 1 || broke(r)).sort((a, b) => a.sink_rate_at_11cm - b.sink_rate_at_11cm).forEach(r => P(`      ${r.outcome} ${r.kind} rate3 ${r.sink_rate_at_11cm} rate1 ${r.sink_rate_1frame} load ${r.peak_load_g} |u| ${Math.abs(r.u_m)} edge ${r.near_edge_m} roll ${r.road_roll_deg} (${r.replay_id} t ${r.t_start})`));
  }
  // the registered failing result: a car that breaks at a sink speed where another car holds (held rate >= the break's rate), on >= 3 passes
  for (const c of cars) {
    const br = s.filter(r => r.car === c && broke(r) && r.crosses_11cm === 1 && r.kind === 'road');
    const othersHeld = s.filter(r => r.car !== c && !broke(r) && r.crosses_11cm === 1);
    const n = br.filter(b => othersHeld.some(h => h.sink_rate_at_11cm >= b.sink_rate_at_11cm)).length;
    P(`   ${c}: road breaks at a rate another car held at or above: ${n} (road crossing breaks ${br.length}; other cars' held crossers ${othersHeld.length})`);
  }
}
