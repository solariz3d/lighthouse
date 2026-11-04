// S5 and S6 from test/markers_sectors_mutation.test.js applied to a copy of 3b73343's src/, then the old row (3b73343) and the amended row run against each
const fs = require('fs'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const WT = 'C:/Users/nname/Desktop/worktrees/t180-e637', OUT = path.join(__dirname, 'rf');
const hs = fs.readFileSync(path.join(WT, 'test/markers_sectors_mutation.test.js'), 'utf8'), i0 = hs.indexOf('const MUTANTS = ['), MUTANTS = new Function(hs.slice(i0, hs.indexOf('\n];', i0) + 3) + '\nreturn MUTANTS;')();   // its text, not require (requiring it runs the harness)
for (const id of ['S5', 'S6']) {
  const m = MUTANTS.find((x) => x.id.startsWith(id));
  for (const which of ['old', 'new']) {
    const dir = path.join(OUT, `${id}-${which}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    execFileSync('sh', ['-c', `git -C ${WT} archive 3b73343 src app tools test/fixtures test/markers_sectors.test.js | tar -x -C "${dir.split(path.sep).join('/')}"`], { windowsHide: true });
    if (which === 'new') fs.copyFileSync(path.join(WT, 'test/markers_sectors.test.js'), path.join(dir, 'test/markers_sectors.test.js'));
    for (const [file, from, to] of m.edits) { const f = path.join(dir, 'src', file), src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'), n = src.split(from).length - 1; if (n !== 1) throw new Error(`NOT APPLIED ${id}: ${n}`); fs.writeFileSync(f, src.replace(from, () => to)); }
    const r = spawnSync(process.execPath, ['--test', 'test/markers_sectors.test.js'], { cwd: dir, encoding: 'utf8', windowsHide: true });
    const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), g = (k) => (out.match(new RegExp(`ℹ ${k} ([0-9]+)`)) || [])[1];
    console.log(`${id} on the ${which} row: tests ${g('tests')} pass ${g('pass')} fail ${g('fail')}${+g('fail') ? ' — ' + (out.match(/✖ ([^\n]+)/) || [])[1].slice(0, 90) : ''}`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
