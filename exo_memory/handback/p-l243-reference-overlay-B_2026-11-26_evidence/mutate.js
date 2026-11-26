// mutate.js (L243): each mutant of src/reference/ribbon.js applied in place, the rows run, the file put back byte for byte. A mutant is caught when a row fails.
const fs = require('fs'), { execFileSync } = require('child_process');
const T = 'C:/Consonance/t180-wt-l243', F = T + '/src/reference/ribbon.js', orig = fs.readFileSync(F);
const M = [
  ['sideLeft to the right', 'left[k * 3 + i] = p[i] + a[i] * sl; right[k * 3 + i] = p[i] - a[i] * sr;', 'left[k * 3 + i] = p[i] - a[i] * sl; right[k * 3 + i] = p[i] + a[i] * sr;'],
  ['no closing span', 'if (closed) lengthM += len(sub(P[0], P[n - 1]));', ''],
  ['camber sign', 'n = [Math.sin(e.camber) * L[0], Math.cos(e.camber), Math.sin(e.camber) * L[2]];', 'n = [-Math.sin(e.camber) * L[0], Math.cos(e.camber), -Math.sin(e.camber) * L[2]];'],
  ['yaw sign', '+ yawDeg * Math.PI / 180;', '- yawDeg * Math.PI / 180;'],
  ['no anchor translation', 'const t = [a.pos[0] + dx - rp[0], a.pos[1] + dy - rp[1], a.pos[2] + dz - rp[2]];', 'const t = [dx, dy, dz];'],
  ['always closed', 'return close > 0 && close <= 3 * med;', 'return true;'],
  ['a batch drops its last span', 'for (let j = 0; j < m - 1; j++) { const a = j * 2', 'for (let j = 0; j < m - 2; j++) { const a = j * 2'],
  ['trailing bytes allowed', "if (hasGrid === 0 && o !== b.length) throw", "if (false) throw"],
  ['grid refused', "if (hasGrid !== 0 && hasGrid !== 1) throw", "if (hasGrid !== 0) throw"],
  ['stored normal ignored', 'if (nl > 0.5 && nl < 1.5) n = unit(nStored);', 'if (false) n = unit(nStored);'],
];
const res = [];
try {
  for (const [name, a, b] of M) {
    const s = orig.toString('utf8'); if (s.split(a).length !== 2) { res.push([name, 'NOT APPLIED']); continue; }
    fs.writeFileSync(F, s.replace(a, b));
    let caught = false; try { execFileSync(process.execPath, ['--test', 'test/reference_ribbon.test.js'], { cwd: T, stdio: 'pipe' }); } catch (e) { caught = true; }
    res.push([name, caught ? 'caught' : 'SURVIVED']);
  }
} finally { fs.writeFileSync(F, orig); }
for (const r of res) console.log(r.join(': '));
console.log(`${res.filter((r) => r[1] === 'caught').length} of ${res.length} caught; restored ${Buffer.compare(fs.readFileSync(F), orig) === 0 ? 'byte for byte' : 'NOT EXACTLY'}`);
