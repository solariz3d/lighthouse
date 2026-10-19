// quietrun.js <worktree> <test files...>: node --test of the files, in a window proved quiet (quiet.js): this process holds the tree's slot and its child the other, for as long as it lives
const path = require('path'), fs = require('fs'), { spawn, spawnSync } = require('child_process');
const wt = process.argv[2], files = process.argv.slice(3); process.chdir(wt);
const hr = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js'), Q = require('./quiet.js');
(async () => {
  const sec = spawn(process.execPath, [path.join(__dirname, 'second.js')], { stdio: ['ignore', 'pipe', 'inherit'], cwd: require('os').tmpdir() });
  await new Promise((r) => { sec.stdout.on('data', (d) => { if (/HELD/.test(String(d))) r(); }); });
  hr.hold({ cmd: 't180 A D404 timing session' });
  console.log('both slots held', new Date().toISOString());
  const standingStart = Q.standing(), a = Q.snap();
  const r = spawnSync(process.execPath, ['--test', '--test-timeout=600000', ...files], { stdio: 'inherit' });
  const b = Q.snap(), j = Q.judge(a, b);
  console.log('QUIET WINDOW:', JSON.stringify({ quiet: j.quiet, windowSeconds: +(j.windowMs / 1000).toFixed(0), reasons: j.reasons, foreignCpu: j.foreignCpu, hostCpu: j.hostCpu, locksStart: j.locksStart, locksEnd: j.locksEnd, standingAtStart: standingStart.length, standingAtEnd: Q.standing().length }));
  fs.writeFileSync(path.join(__dirname, 'quietrun-' + path.basename(files[0], '.test.js') + '.json'), JSON.stringify({ exit: r.status, judge: j, standingStart, standingEnd: Q.standing() }, null, 1));
  sec.kill(); process.exit(r.status);
})();
