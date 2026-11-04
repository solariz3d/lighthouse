// D181 A: the installed-app re-check under ONE hold of the heavy-run lock, so no other seat's window run can write the
// app-data folder while the keeper's is set aside (in D180 one did). Order, with the restore in a finally:
//   hash the keeper's two app-data folders -> rename them to .aside-d181 -> install the 0.2.1 installer into a throwaway
//   folder -> fresh_eyes5.js -> uninstall -> delete the fresh folders (only when the .aside one exists) -> rename back ->
//   re-hash and compare -> remove the throwaway and the fake AC folder. Never launches AC.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const HERE = __dirname, P = path.join(HERE, 'session.progress');
const say = (s) => { fs.appendFileSync(P, `${new Date().toISOString()} ${s}\n`); console.log(s); };
const INSTALLER = 'C:/Users/nname/Desktop/t180-track-builder/src-tauri/target/release/bundle/nsis/T-180 Track Builder_0.2.1_x64-setup.exe';
const APPDIR = path.join(HERE, 'throwaway', 'app'), ID = 'com.solariz3d.t180-track-builder';
const ROOTS = [['roaming', process.env.APPDATA], ['local', process.env.LOCALAPPDATA]].map(([k, b]) => ({ k, live: path.join(b, ID), aside: path.join(b, ID + '.aside-d181') }));
function hashes(dir) {
  const out = {};
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else out[p.slice(dir.length)] = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); } })(dir);
  return out;
}
const t180Running = () => /t180-track-builder\.exe/i.test(spawnSync('tasklist', ['/FI', 'IMAGENAME eq t180-track-builder.exe'], { encoding: 'utf8' }).stdout);
const regEntries = () => (spawnSync('reg', ['query', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall', '/s', '/f', 'T-180'], { encoding: 'utf8' }).stdout || '').split('\n').filter((l) => /^HKEY/.test(l.trim()));
const sleepS = (s) => spawnSync(process.execPath, ['-e', `setTimeout(()=>{}, ${s * 1000})`]);

say('asking for the lock');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 D181 A: installed-app re-check (app data aside + restored inside this hold), no AC launch' });
say('lock held');
if (t180Running()) { say('STOP: a t180-track-builder.exe is already running; nothing touched'); process.exit(1); }
for (const r of ROOTS) if (fs.existsSync(r.aside)) { say(`STOP: ${r.aside} already exists; nothing touched`); process.exit(1); }
if (fs.existsSync(APPDIR)) { say(`STOP: ${APPDIR} already exists; nothing touched`); process.exit(1); }
say(`uninstall entries before: ${regEntries().length}`);
const before = {};
let moved = [];
try {
  for (const r of ROOTS) {
    before[r.k] = fs.existsSync(r.live) ? hashes(r.live) : null;
    fs.writeFileSync(path.join(HERE, `before-${r.k}.json`), JSON.stringify(before[r.k], null, 1));
    say(`${r.k}: ${before[r.k] ? Object.keys(before[r.k]).length + ' files hashed' : 'no folder'}`);
    if (before[r.k]) { fs.renameSync(r.live, r.aside); moved.push(r); say(`${r.k}: set aside`); }
  }
  // INSTALL (NSIS: /D= must be last and unquoted)
  const ins = spawnSync(INSTALLER, ['/S', `/D=${APPDIR.replace(/\//g, '\\')}`], { timeout: 180000 });
  say(`install: exit ${ins.status}; exe present ${fs.existsSync(path.join(APPDIR, 't180-track-builder.exe'))}; uninstall entries ${regEntries().length}`);
  // THE SESSION
  const s = spawnSync(process.execPath, [path.join(HERE, 'fresh_eyes5.js')], { cwd: HERE, encoding: 'utf8', timeout: 13 * 60 * 1000 });
  say(`session: exit ${s.status}${s.error ? ' ' + s.error.code : ''}`);
  if (t180Running()) { spawnSync('taskkill', ['/IM', 't180-track-builder.exe', '/T', '/F']); say('a t180 process was still running after the session: killed'); }
  // UNINSTALL
  const un = path.join(APPDIR, 'uninstall.exe');
  if (fs.existsSync(un)) {
    const u = spawnSync(un, ['/S'], { timeout: 120000 });
    for (let i = 0; i < 60 && fs.existsSync(path.join(APPDIR, 't180-track-builder.exe')); i++) sleepS(1);
    say(`uninstall: exit ${u.status}; exe gone ${!fs.existsSync(path.join(APPDIR, 't180-track-builder.exe'))}; uninstall entries ${regEntries().length}`);
  } else say('uninstall: NO uninstall.exe');
} catch (e) { say(`ERROR: ${e.message}`); }
finally {
  for (const r of moved) {
    try {
      if (!fs.existsSync(r.aside)) { say(`RESTORE ${r.k}: the aside folder is MISSING; nothing deleted`); continue; }
      // a WebView2 child can hold a file for a few seconds after the kill: retry, never give up silently
      for (let i = 0; ; i++) {
        try { if (fs.existsSync(r.live)) fs.rmSync(r.live, { recursive: true, force: true }); fs.renameSync(r.aside, r.live); break; } catch (e) {
          if (i >= 11) throw e;
          say(`RESTORE ${r.k}: attempt ${i + 1} failed (${e.code || e.message}); retrying in 5 s`); sleepS(5);
        }
      }
      const now = hashes(r.live), want = before[r.k];
      const miss = Object.keys(want).filter((k) => !(k in now)), extra = Object.keys(now).filter((k) => !(k in want)), changed = Object.keys(want).filter((k) => k in now && now[k] !== want[k]);
      say(`RESTORE ${r.k}: before ${Object.keys(want).length}, now ${Object.keys(now).length}, missing ${miss.length}, extra ${extra.length}, changed ${changed.length}`);
    } catch (e) { say(`RESTORE ${r.k} FAILED: ${e.message}`); }
  }
  for (const d of ['throwaway', 'fake-ac']) { try { fs.rmSync(path.join(HERE, d), { recursive: true, force: true }); } catch (e) { say(`could not remove ${d}: ${e.message}`); } }
  say(`clean-up: throwaway ${!fs.existsSync(path.join(HERE, 'throwaway'))}, fake-ac ${!fs.existsSync(path.join(HERE, 'fake-ac'))}, t180 running ${t180Running()}`);
  say('done');
}
