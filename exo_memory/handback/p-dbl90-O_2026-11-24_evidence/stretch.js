// stretch.js: each profile stretch by stretch (measured d): heading turned, bank at start / peak / end, where the bank crosses level.
// usage: node stretch.js <profiles.json> [names filter regex]   (stretches from the centre-position read: ramp, turn A, across, turn B, ease-out)
const P = require(require('path').resolve(process.argv[2])), re = new RegExp(process.argv[3] || '.');
const ST = [['ramp, straight', 340, 462], ['turn A', 462, 520], ['across, straight', 520, 550], ['turn B', 550, 606], ['ease-out, straight', 606, 716]];
const rows = [['measured (centre positions)', P.meas], ...P.attempts.filter((a) => a.prof && re.test(a.name)).map((a) => [a.name, a.prof])];
for (const [name, pr] of rows) {
  const at = (d) => pr.reduce((p, q) => (Math.abs(q.d - d) < Math.abs(p.d - d) ? q : p));
  let zero = null; for (let i = 1; i < pr.length; i++) if (pr[i].d > 500 && pr[i].d < 600 && pr[i - 1].bank > 0 && pr[i].bank <= 0) { zero = pr[i].d; break; }
  const cells = ST.map(([n, a, b]) => { const seg = pr.filter((x) => x.d >= a && x.d <= b), pk = seg.reduce((p, q) => (Math.abs(q.bank) > Math.abs(p.bank) ? q : p));
    return `${(at(b).h - at(a).h).toFixed(0)}° | ${at(a).bank.toFixed(0)} / ${pk.bank.toFixed(0)}@${pk.d} / ${at(b).bank.toFixed(0)}`; });
  console.log(`| ${name} | ${cells.join(' | ')} | ${zero ?? 'none'} |`);
}
