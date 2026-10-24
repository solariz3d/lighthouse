// inv345.js: items 3, 4 and 5 of D450, read-only (lstat / readdir / stat only).
'use strict';
const fs = require('fs'), path = require('path');
const { walk } = require('./walk.js');
const TEMP = 'C:/Users/nname/AppData/Local/Temp', out = { at: new Date().toISOString() };
// 3: one row per instance folder under Temp/claude (each holds that instance's session scratchpads)
out.scratch = fs.readdirSync(path.join(TEMP, 'claude'), { withFileTypes: true }).map((e) => {
  const p = path.join(TEMP, 'claude', e.name);
  if (!e.isDirectory()) { const s = fs.lstatSync(p); return { name: e.name, bytes: s.size, newest: s.mtime.toISOString().slice(0, 16) + 'Z', files: 1, links: [] }; }
  return { name: e.name, sessions: fs.readdirSync(p).length, ...walk(p) };
});
// 4: every top-level %TEMP% entry except claude/, with a kind from its name
const kind = (n, dir) =>
  /^puppeteer_dev_(chrome|firefox)_profile-/i.test(n) ? 'puppeteer profile'
  : /^scoped_dir\d+_\d+$/i.test(n) ? 'chrome scoped_dir'
  : /chrome|chromium|cdp|headless|zz-headless|user-data|profile/i.test(n) && dir ? 'chrome profile (named)'
  : /^(t180|d\d{3}|wt-|lighthouse|consonance|kn5|acreplay|node-|v8-compile|jest|tmp-\d+)/i.test(n) ? 'ours by name'
  : /\.(js|log|out|txt|tap|json|sh|md|csv|ps1)$/i.test(n) ? 'loose script/log'
  : 'other';
out.temp = [];
for (const e of fs.readdirSync(TEMP, { withFileTypes: true })) {
  if (e.name === 'claude') continue;
  const p = path.join(TEMP, e.name);
  let s; try { s = fs.lstatSync(p); } catch { out.temp.push({ name: e.name, kind: 'unreadable' }); continue; }
  const r = { name: e.name, kind: s.isSymbolicLink() ? 'LINK' : kind(e.name, s.isDirectory()) };
  if (s.isDirectory() && !s.isSymbolicLink()) Object.assign(r, walk(p)); else Object.assign(r, { bytes: s.size, files: 1, newest: s.mtime.toISOString().slice(0, 16) + 'Z', links: [] });
  r.ctime = s.birthtime.toISOString().slice(0, 16) + 'Z';
  out.temp.push(r);
}
// 5: fake AC roots at drive roots, and exported tracks (a .kn5, or a folder with models*.ini / ui/ui_track.json) outside a scratchpad
out.fakeRoots = [];
for (const drv of ['C:/', 'D:/', 'E:/', 'F:/', 'G:/']) { try { for (const n of fs.readdirSync(drv)) if (/^fake/i.test(n)) out.fakeRoots.push({ path: drv + n, ...walk(drv + n) }); } catch {} }
const SKIP = [/\/Temp\/claude\//i, /\/Desktop\/t180-track-builder$/i, /\/AppData\/Roaming/i, /\/\.git$/, /node_modules$/, /\/target$/, /assettocorsa/i];
const roots = ['C:/Users/nname/Downloads', 'C:/Users/nname/Desktop', 'C:/Users/nname/Documents', TEMP, 'C:/temp', 'C:/tmp', 'C:/build', 'C:/Consonance'];
const tracks = new Map();
const note = (dir, why, f) => { const k = dir.replace(/\\/g, '/'); const t = tracks.get(k) || { dir: k, why: new Set(), files: [] }; t.why.add(why); if (t.files.length < 4) t.files.push(f); tracks.set(k, t); };
for (const r of roots) {
  const stack = [r];
  while (stack.length) {
    const d = stack.pop();
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of ents) {
      const p = (d + '/' + e.name).replace(/\\/g, '/');
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) { if (!SKIP.some((x) => x.test(p))) stack.push(p); continue; }
      if (/\.kn5$/i.test(e.name)) note(d, 'kn5', e.name);
      else if (/^models.*\.ini$/i.test(e.name)) note(d, 'models.ini', e.name);
      else if (/^ui_track\.json$/i.test(e.name)) note(path.dirname(path.dirname(p)), 'ui_track.json', e.name);
    }
  }
}
out.tracks = [...tracks.values()].map((t) => ({ ...t, why: [...t.why], ...walk(t.dir) }));
fs.writeFileSync(path.join(__dirname, 'inv345.json'), JSON.stringify(out, null, 1));
console.log(`scratch ${out.scratch.length}; temp ${out.temp.length}; fake ${out.fakeRoots.length}; track dirs ${out.tracks.length}`);
