// session.js [group...]: D404's timing session. Holds BOTH heavy-run slots (this tree's and the other bucket's), so nothing else heavy runs, then the cases.
// groups: looks, ladder, noblur, old, trace.   out/<id>.json per run.
const path = require('path'), fs = require('fs'), { spawn, execSync } = require('child_process');
const REPO = 'C:/Users/nname/Downloads/t180-wt-a25'; process.chdir(REPO);
const hr = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const OUT = path.join(__dirname, 'out'); const groups = process.argv.slice(2).length ? process.argv.slice(2) : ['looks', 'ladder', 'noblur', 'old', 'trace'];
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
  if (groups.includes('looks')) for (const rep of [1, 2]) for (const look of LOOKS) for (const kind of ['turn', 'stretch', ...(rep === 1 ? ['bank'] : [])]) await run(`looks-${look}-${kind}-1000-r${rep}`, { repo: REPO, look, kind, length: 1000 });
  if (groups.includes('ladder')) for (const L of [100, 500, 1000, 2000, 5000, 10000, 20000]) for (const kind of ['turn', 'stretch']) await run(`ladder-aqua-${kind}-${L}`, { repo: REPO, look: 'aqua', kind, length: L, ms: L >= 10000 ? 8000 : 5000 });
  if (groups.includes('noblur')) {
    for (const look of LOOKS) for (const kind of ['turn', 'stretch']) await run(`noblur-${look}-${kind}-1000`, { repo: REPO, look, kind, length: 1000, noblur: true });
    for (const look of ['aqua', 'aurora']) for (const noblur of [false, true]) await run(`capped-${look}-turn-1000-${noblur ? 'noblur' : 'blur'}`, { repo: REPO, look, kind: 'turn', length: 1000, noblur, capped: true });
  }
  if (groups.includes('old')) for (const t of ['v0.4.6', 'v0.4.3', 'v0.4.2', 'v0.4.0', 'v0.3.6']) for (const kind of ['turn', 'stretch']) await run(`old-${t}-${kind}-1000`, { repo: `C:/Users/nname/Downloads/t180-wt-old-${t}`, look: 'aqua', kind, length: 1000 });
  if (groups.includes('trace')) {
    await run('trace-aqua-turn-1000', { repo: REPO, look: 'aqua', kind: 'turn', length: 1000, trace: true, profile: true });
    await run('trace-aurora-turn-1000-blur', { repo: REPO, look: 'aurora', kind: 'turn', length: 1000, trace: true, capped: true });
    await run('trace-aurora-turn-1000-noblur', { repo: REPO, look: 'aurora', kind: 'turn', length: 1000, trace: true, capped: true, noblur: true });
  }
  console.log('locks at the end:', JSON.stringify(locks()), new Date().toISOString());
  sec.kill(); process.exit(0);
})().catch((e) => { console.log('SESSION FAILED', e.stack || e); process.exit(1); });
