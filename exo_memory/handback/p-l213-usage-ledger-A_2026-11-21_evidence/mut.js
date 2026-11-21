const fs = require('fs'), { spawnSync } = require('child_process');
const R = 'consonance/tools/usage-ledger.js', W = 'consonance/hooks/usage-ledger.js', T = 'consonance/tools/usage-ledger.test.js';
const M = [
  [R, 'prev.resets === r.seven_day_resets && ', ''],
  [R, 'r.seven_day_pct - prev.pct', 'prev.pct - r.seven_day_pct'],
  [R, 'Date.parse(r.t) >= since', 'true'],
  [R, "if (r.kind === 'wake') {", "if (r.kind === 'wake' && false) {"],
  [W, 'if (last === key) return { wrote: false, line };', ''],
  [W, "model: short(p && p.model && p.model.id, 40),", "model: short(p && p.model && p.model.id, 40), name: short(p && p.session_name, 99),"],
  [W, 'if (!cu) return { wrote: false, line };', ''],
  [W, "if (p.hook_event_name) return { wrote: false };", ''],
  [W, 'five_hour_pct: num(fh.used_percentage)', 'five_hour_pct: num(fh.used_percentage) || 0'],
  [W, "if (process.env.CONSONANCE_DREAM) process.exit(0);", ''],
  [W, "setTimeout(() => process.exit(0), WATCHDOG_MS).unref();", ''],
];
let caught = 0, applied = 0;
for (const [f, a, b] of M) {
  const orig = fs.readFileSync(f, 'utf8');
  if (orig.split(a).length !== 2) { console.log('NOT APPLIED', f, a.slice(0, 40)); continue; }
  applied++;
  try { fs.writeFileSync(f, orig.replace(a, () => b)); const r = spawnSync(process.execPath, [T], { encoding: 'utf8' }); const red = r.status !== 0; caught += red ? 1 : 0; console.log(red ? 'caught  ' : 'SURVIVED', f.split('/').pop(), a.slice(0, 50)); }
  finally { fs.writeFileSync(f, orig); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${M.length - applied}`);
