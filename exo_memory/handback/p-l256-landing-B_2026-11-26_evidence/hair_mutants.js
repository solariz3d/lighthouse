// hair_mutants.js (L256 step 1): the cut's size from both sides; each value put in road.js, the ribbon rows run, the file put back byte for byte.
const fs = require('fs'), { execFileSync } = require('child_process');
const T = 'C:/Consonance/t180-wt-l243', F = `${T}/src/reference/road.js`, orig = fs.readFileSync(F);
const res = [];
try {
  for (const v of ['0', '0.03', '0.09', '-0.01']) {
    fs.writeFileSync(F, orig.toString('utf8').replace('const HAIR = 0.01;', `const HAIR = ${v};`));
    let caught = false; try { execFileSync(process.execPath, ['--test', 'test/reference_ribbon.test.js'], { cwd: T, stdio: 'pipe' }); } catch (e) { caught = true; }
    res.push(`HAIR = ${v}: ${caught ? 'caught' : 'SURVIVED'}`);
  }
} finally { fs.writeFileSync(F, orig); }
console.log(res.join('\n')); console.log('restored byte for byte:', fs.readFileSync(F).equals(orig));
