// Replay `node scripts/soak.js --seed 1 --ops 300 --quiet` on temp copies of the live tree, with the palette as B had it
// (src/doc/library.js from HEAD, i.e. without this lap's phrasebook registration, which changes the soak's random path),
// (a) with the shell fix, (b) with the fix's two lines put back as they were (the control). Also prints what op #71 did.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync, execSync } = require('child_process');
const ROOT = 'C:/Users/nname/Desktop/t180-track-builder';
function copy(label, patchShell) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180b-soak-'));
  for (const d of ['src', 'app', 'tools', 'scripts']) fs.cpSync(path.join(ROOT, d), path.join(dir, d), { recursive: true });
  fs.writeFileSync(path.join(dir, 'src/doc/library.js'), execSync('git show HEAD:src/doc/library.js', { cwd: ROOT }));
  if (patchShell) {
    const f = path.join(dir, 'app/shell.js'); let s = fs.readFileSync(f, 'utf8');
    const a = "    const r = resolved(doc);\n    if (r.resolveError) return set({ message: `not applied: ${r.resolveError}` });\n    return set({ history: D.commit(st.history, doc), ...r, dirty: true, message: null, ...extra });";
    if (!s.includes(a)) throw new Error('control: the fix is not where expected');
    s = s.replace(a, '    return set({ history: D.commit(st.history, doc), ...resolved(doc), dirty: true, message: null, ...extra });');
    fs.writeFileSync(f, s);
  }
  // op #71 alone: replay 71 ops, then the 72nd (index 71) is the one; the soak's own stats say what happened
  const run = (ops, quiet) => spawnSync(process.execPath, ['scripts/soak.js', '--seed', '1', '--ops', String(ops), ...(quiet ? ['--quiet'] : [])], { cwd: dir, encoding: 'utf8', timeout: 600000 });
  const full = run(300, true);
  console.log(`== ${label}: exit ${full.status}\n${(full.stdout + full.stderr).trim().split('\n').slice(-12).join('\n')}`);
  fs.rmSync(dir, { recursive: true, force: true });
}
copy('(a) the fix, palette as B had it', false);
copy('(b) CONTROL: the fix reverted, palette as B had it', true);
