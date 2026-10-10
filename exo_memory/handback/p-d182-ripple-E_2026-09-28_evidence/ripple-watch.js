// Ripple (pane E): wait until A's staged vocabulary change applies AND loads (every road word appends), then print the
// stage's sha and exit. A fresh copy each try, into ripple/. Read-only on A's files and on the shared checkout.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder', A = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d182';
const T = path.join(__dirname, 'ripple');
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 16);
const copy = (s, d) => { fs.mkdirSync(d, { recursive: true }); for (const e of fs.readdirSync(s, { withFileTypes: true })) { if (['node_modules', 'reads', 'out', 'target', '.git'].includes(e.name)) continue; const a = path.join(s, e.name), b = path.join(d, e.name); if (e.isDirectory()) copy(a, b); else fs.copyFileSync(a, b); } };
let last = '';
for (let i = 0; i < 240; i++) {
  const key = sha(path.join(A, 'apply_d182.js')) + '/' + sha(path.join(A, 'stage', 'vocab.js'));
  if (key !== last) {
    last = key;
    fs.rmSync(T, { recursive: true, force: true }); copy(REPO, T);
    const ap = spawnSync(process.execPath, [path.join(A, 'apply_d182.js'), T], { encoding: 'utf8' });
    const smoke = ap.status === 0 && spawnSync(process.execPath, ['-e', "const D=require('./src/doc/index.js');let d=D.createDoc('x');for(const w of ['straight','sweep','turn','tight','wall-ride','inversion','jump'])d=D.appendWord(d,w);console.log('ok',d.words.length)"], { cwd: T, encoding: 'utf8' });
    const ok = smoke && smoke.status === 0;
    console.log(`${new Date().toISOString().slice(11, 19)} apply ${ap.status} smoke ${ok ? 'OK' : 'FAIL ' + ((smoke && smoke.stderr) || ap.stderr || '').split('\n').find((l) => /Error/.test(l))} key ${key}`);
    if (ok) process.exit(0);
  }
  spawnSync(process.execPath, ['-e', 'setTimeout(()=>{},60000)']);
}
console.log('gave up after 4 h');
