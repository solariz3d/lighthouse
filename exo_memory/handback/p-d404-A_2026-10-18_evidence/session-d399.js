// session.js [group...]: D404's timing session. Holds BOTH heavy-run slots (this tree's and the other bucket's), so nothing else heavy runs, then the cases.
// groups: looks, ladder, noblur, old, trace.   out/<id>.json per run.
const path = require('path'), fs = require('fs'), { spawn, execSync } = require('child_process');
const REPO = 'C:/Users/nname/Downloads/t180-wt-a25'; process.chdir(REPO);
const hr = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const OUT = path.join(__dirname, 'out-d399'); const groups = process.argv.slice(2).length ? process.argv.slice(2) : ['looks', 'ladder', 'noblur', 'old', 'trace'];
(async () => {
  const sec = spawn(process.execPath, [path.join(__dirname, 'second.js')], { stdio: ['ignore', 'pipe', 'inherit'], cwd: require('os').tmpdir() });
  await new Promise((r) => { sec.stdout.on('data', (d) => { if (/HELD/.test(String(d))) r(); }); });
  hr.hold({ cmd: 't180 A D404 timing session' });
  console.log('both slots held', new Date().toISOString());
  const locks = () => ['heavy-run.lock', 'heavy-run.2.lock'].map((f) => { try { return JSON.parse(fs.readFileSync('C:/Consonance/data/' + f, 'utf8')).cmd; } catch (e) { return null; } });
  console.log('locks:', JSON.stringify(locks()));
  const sys = { when: new Date().toISOString(), locks: locks() };
  try { sys.display = execSync('powershell -NoProfile -Command "Get-CimInstance Win32_VideoController | ForEach-Object { $_.Name + \' @ \' + $_.CurrentRefreshRate + \' Hz \' + $_.CurrentHorizontalResolution + \'x\' + $_.CurrentVerticalResolution }"').toString().trim(); } catch (e) { sys.display = 'unknown'; }
  try { sys.cpu = execSync('powershell -NoProfile -Command "(Get-CimInstance Win32_Processor).Name"').toString().trim(); } catch (e) {}
  fs.writeFileSync(path.join(OUT, '_system.json'), JSON.stringify(sys)); console.log(JSON.stringify(sys));
  const M = require('./measure.js');
  const run = async (id, o) => {
    if (fs.existsSync(path.join(OUT, id + '.json')) && !process.env.REDO) return;
    const t0 = Date.now(); let r;
    try { r = await M.run({ ms: 5000, ...o }); } catch (e) { r = { error: String(e.message || e).slice(0, 300), ...o, repo: undefined }; }
    const pr = r.profile; delete r.profile; r.id = id; r.at = new Date().toISOString();
    fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(r));
    if (pr) fs.writeFileSync(path.join(OUT, id + '.cpuprofile'), JSON.stringify(pr));
    
    console.log(id, r.error ? 'ERROR ' + r.error : `work ${r.work ? r.work.cost.median + '/' + r.work.cost.p95 : 'none'} ms, moves ${r.moves}`, `(${((Date.now() - t0) / 1000).toFixed(0)}s)`, JSON.stringify(locks()));
  };
  const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
  const TREES = { v047: 'C:/Users/nname/Downloads/t180-wt-a24', d399: 'C:/Users/nname/Downloads/t180-wt-a26' };
  // the 0.4.7 drag is slow (20 ms a move): its 1,000 m / 2,000 m cases are the same code as the measurement; the fix is not in either tree. To see a CSS layer's cost the fix is needed
  // under both, so the same two trees are also run with the fix's code copied over (a25's src, tools and app/core, app/preview): trees v047fix and d399fix
  for (const rep of [1, 2, 3]) for (const look of LOOKS) for (const [tag, repo] of Object.entries(TREES)) for (const kind of ['turn', 'stretch']) for (const L of (kind === 'turn' ? [1000, 2000] : [1000])) await run(`${tag}-${look}-${kind}-${L}-r${rep}`, { repo, look, kind, length: L, ms: 4000 });
  for (const rep of [1, 2, 3]) for (const look of LOOKS) for (const [tag, repo] of [['v047fix', 'C:/Users/nname/Downloads/t180-wt-a25'], ['d399fix', 'C:/Users/nname/Downloads/t180-wt-a28']]) for (const L of [1000, 2000]) await run(`${tag}-${look}-turn-${L}-r${rep}`, { repo, look, kind: 'turn', length: L, ms: 4000 });
  await run('trace-d399fix-aurora-turn-2000', { repo: 'C:/Users/nname/Downloads/t180-wt-a28', look: 'aurora', kind: 'turn', length: 2000, trace: true, capped: true });
  await run('trace-v047fix-aurora-turn-2000', { repo: 'C:/Users/nname/Downloads/t180-wt-a25', look: 'aurora', kind: 'turn', length: 2000, trace: true, capped: true });
  console.log('locks at the end:', JSON.stringify(locks()), new Date().toISOString());
  sec.kill(); process.exit(0);
})().catch((e) => { console.log('SESSION FAILED', e.stack || e); process.exit(1); });
