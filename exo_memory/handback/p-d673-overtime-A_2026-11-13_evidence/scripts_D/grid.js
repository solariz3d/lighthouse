'use strict';
// D673 brutal overtime sweep, as registered (lighthouse exo_memory/handback/p-d673-overtime-A_2026-11-13.md, "RE-REGISTERED AT BRUTAL" and
// the D Friday note): 12 cells on seeds 1-20, the defaults first; the pick by the registered rule; the pick once on seeds 21-40. One lock.
const os = require('os'); os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const { spawnSync, execSync } = require('child_process'), fs = require('fs'), path = require('path');
const W = 'G:/consonance-scratch/a-d673b-dz3';
if (/acs\.exe/i.test(execSync('tasklist /FI "IMAGENAME eq acs.exe"', { encoding: 'utf8' }))) { console.error('acs.exe running'); process.exit(5); }
for (const f of fs.readdirSync('C:/Consonance/data').filter(n => /^heavy-run(\.\d+)?\.lock$|^heavy-run\.hold$/.test(n))) {
  const t = fs.readFileSync(path.join('C:/Consonance/data', f), 'utf8');
  if (/timing/i.test(t) && !/not a timing session/i.test(t)) { console.error('timing session holds ' + f); process.exit(6); }
}
const H = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const h = H.hold({ cmd: 'A D673 brutal overtime sweep: 12 cells x 20 seeds + the pick on 21-40 (dz-chase sweep, hidden, BelowNormal)' });
const sweep = (first, s, r) => {
  const args = ['sweep', '--run-length', '30', '--levels', '3', '--max', '400', '--policies', 'flee,line,juke', '--seeds', '20', '--first', String(first),
    '--threads', '2', '--dial', `head_start_s=1000 lesser_max=0 dark_speed_start=${s} dark_speed_rise=${r}`];
  const res = spawnSync(path.join(W, 'build/bin/dz-chase.exe'), args, { cwd: path.join(W, 'chase'), encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
  const text = (res.stdout || '') + (res.stderr || '');
  const name = `cell_s${s}_r${r}_from${first}.log`;
  fs.writeFileSync(path.join(__dirname, name), text);
  const head = text.indexOf('\novertime (timer');
  const row = {};
  for (const l of text.slice(head).split('\n').slice(3, 6)) {
    const f = l.trim().split(/\s+/);
    if (f[0] !== 'brutal') continue;
    row[f[1]] = { runs: +f[2], reached: +f[3], min: +f[4], median: +f[5], p90: +f[6], max: +f[7], over90: +f[8], stopped: +f[9], saved: +f[10] };
  }
  const ok = row.flee && row.line && row.juke;
  const premise = ok && ['flee', 'line', 'juke'].every(p => row[p].reached >= 18);
  const F1 = ok && ['flee', 'line', 'juke'].every(p => row[p].over90 === 0);          // met: no bot outlives 90 s of overtime
  const F2 = ok && row.flee.median >= 1.25 * row.line.median;                           // met: flee at least 25 % longer than line
  const F3 = ok && row.flee.median >= 15 && row.flee.median <= 45;                      // met: flee median in the band
  return { s, r, first, log: name, status: res.status, row, premise, F1, F2, F3 };
};
const out = [];
try {
  const cells = [[1.35, 0.02]];
  for (const s of [0.9, 1.1, 1.35, 1.6]) for (const r of [0, 0.02, 0.05]) if (!(s === 1.35 && r === 0.02)) cells.push([s, r]);
  for (const [s, r] of cells) {
    const t0 = Date.now(); const c = sweep(1, s, r); c.secs = Math.round((Date.now() - t0) / 1000); out.push(c);
    console.log(JSON.stringify(c));
    fs.writeFileSync(path.join(__dirname, 'grid.json'), JSON.stringify(out, null, 1));
  }
  const meeting = out.filter(c => c.premise && c.F1 && c.F2 && c.F3).sort((a, b) => a.s - b.s || a.r - b.r);
  if (meeting.length) {
    const p = meeting[0];
    console.log('PICK ' + JSON.stringify({ s: p.s, r: p.r }));
    const held = sweep(21, p.s, p.r); held.heldout = true; out.push(held);
    console.log(JSON.stringify(held));
  } else console.log('NO CELL MEETS F1, F2 AND F3 ON SEEDS 1-20');
  fs.writeFileSync(path.join(__dirname, 'grid.json'), JSON.stringify(out, null, 1));
} finally { h.release(); }
