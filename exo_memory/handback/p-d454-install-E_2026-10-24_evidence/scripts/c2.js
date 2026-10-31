// c2.js (D454 part 3, pane E): the two items from C's part 2 (lighthouse 37919e87, "C's part 2 in"). Step "test" adds the red rows and amends
// the rows whose rule changed by name; step "fix" makes them green.
//   release-chime: with no chime_repos, a push to main chimes for the room's own repository (the folder room_path's exo_memory sits in), not
//                  for a fixed list of one creator's three products.
//   scratch.js:    the root is CONSONANCE_SCRATCH, then scratch_dir in ~/.consonance.json, then the OS temp dir; a G: drive alone no longer decides.
// Usage: node c2.js <lighthouse worktree> test|fix. Every anchor must occur exactly once; a file's line endings are kept.
'use strict';
const fs = require('fs'), path = require('path');
const [root, step] = process.argv.slice(2);
function edit(rel, fn) {
  const f = path.join(root, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
  const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(rel + ': anchor found ' + n + ' times: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
  fn(rep, (b) => { s = s.replace(/\n*$/, '\n') + b; });
  fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}

if (step === 'test') {
  edit('consonance/hooks/release-chime.test.js', (rep, append) => {
    // the fixture names its room: with no chime_repos the default is now the room's own repository, so a room() with no room_path is one that
    // never chimes for a push. Every row below that pushes `lighthouse` keeps its meaning by running in a room whose repository is lighthouse.
    rep("function room(cfg = {}, { sound = true } = {}) {\n  const root = require('../tools/scratch.js').mkdtemp('chime-'); roots.push(root);\n",
      "// AMENDED (D454): the rule changed by name: with no chime_repos a push chimes for the ROOM's own repository (room_path's repo), not for a fixed\n" +
      "// list. So the fixture's config names a room in a folder called lighthouse unless the row gives its own room_path (an empty one is no room).\n" +
      "function room(cfg = {}, { sound = true } = {}) {\n  const root = require('../tools/scratch.js').mkdtemp('chime-'); roots.push(root);\n" +
      "  if (cfg && typeof cfg === 'object' && !('room_path' in cfg)) cfg = { ...cfg, room_path: path.join(root, 'lighthouse', 'exo_memory', 'BOOT.md') };\n");
    rep("  for (const repo of ['t180-track-builder', 'consonance', 'lighthouse']) { const e = room(); run(e, call('git push origin main', OK(PUSH('main', repo)))); assert.equal(chimes(e).length, 1, repo); }",
      "  // AMENDED (D454): the three products chime where chime_repos names them, as this machine's config does; the default is the room's own repository (row 12)\n" +
      "  for (const repo of ['t180-track-builder', 'consonance', 'lighthouse']) { const e = room({ chime_repos: ['t180', 'consonance', 'lighthouse'] }); run(e, call('git push origin main', OK(PUSH('main', repo)))); assert.equal(chimes(e).length, 1, repo); }");
    append('\n' +
      '// D454 part 3 (pane E, C\'s part 2): a new user\'s room is THEIR repository. The fixed default (t180, consonance, lighthouse) was one creator\'s three products.\n' +
      'test(\'row 12 (D454): with no chime_repos a push chimes for the room\\\'s own repository and no other; with no room no push chimes; a release still does\', () => {\n' +
      '  const mine = (e) => path.join(e.root, \'mine\', \'exo_memory\', \'BOOT.md\');\n' +
      '  const a = room({ room_path: \'\' }); fs.writeFileSync(path.join(a.home, \'.consonance.json\'), JSON.stringify({ room_path: mine(a) }));\n' +
      '  run(a, call(\'git push origin main\', OK(PUSH(\'main\', \'mine\')))); assert.equal(chimes(a).length, 1, \'a push to the room\\\'s own repository chimes\');\n' +
      '  for (const other of [\'lighthouse\', \'consonance\', \'t180-track-builder\']) { const b = room({ room_path: \'\' }); fs.writeFileSync(path.join(b.home, \'.consonance.json\'), JSON.stringify({ room_path: mine(b) }));\n' +
      '    run(b, call(\'git push origin main\', OK(PUSH(\'main\', other)))); assert.equal(chimes(b).length, 0, other + \' is not this room\'); }\n' +
      '  const c = room({ room_path: \'\' }); run(c, call(\'git push origin main\', OK(PUSH(\'main\', \'lighthouse\')))); assert.equal(chimes(c).length, 0, \'no room, no push chime\');\n' +
      '  const d = room({ room_path: \'\' }); run(d, call(\'gh release create v1\', OK(\'\', REL))); assert.equal(chimes(d).length, 1, \'a release chimes whatever the room\');\n' +
      '  assert.deepEqual(C.defaultRepos({ room_path: path.join(\'x\', \'Some Repo\', \'exo_memory\', \'BOOT.md\') }), [\'some repo\']);\n' +
      '  for (const cfg of [{}, { room_path: \'\' }, { room_path: 7 }, null]) assert.deepEqual(C.defaultRepos(cfg), [], JSON.stringify(cfg));\n' +
      '});\n');
  });
  edit('consonance/tools/scratch.test.js', (rep) => {
    rep("test('the root: CONSONANCE_SCRATCH wins, then G: when it exists, else the OS temp dir', () => {\n" +
      "  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH: path.resolve('x-root') }, 'win32', () => true), path.resolve('x-root'));\n" +
      "  assert.strictEqual(scratch.scratchRoot({}, 'win32', (p) => p === drv('G')), path.join(drv('G'), 'consonance-scratch'));\n" +
      "  assert.strictEqual(scratch.scratchRoot({}, 'win32', () => false), os.tmpdir());\n" +
      "  assert.strictEqual(scratch.scratchRoot({}, 'linux', () => true), os.tmpdir(), 'a drive letter means nothing off Windows');\n" +
      "  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH: '   ' }, 'win32', () => false), os.tmpdir(), 'a blank override is no override');\n" +
      "  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH_DRIVE: 'Q' }, 'win32', (p) => p === drv('Q')), path.join(drv('Q'), 'consonance-scratch'));\n" +
      "  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH_DRIVE: '..\\\\x' }, 'win32', () => true), os.tmpdir(), 'a malformed drive is ignored, not joined');\n" +
      "  assert.strictEqual(scratch.scratchRoot({}, 'win32', () => { throw new Error('boom'); }), os.tmpdir(), 'a probe that throws falls back');\n",
      "// AMENDED (D454): the rule changed by name (C's part 2): the root is CONSONANCE_SCRATCH, then scratch_dir in ~/.consonance.json, then the OS\n" +
      "// temp dir. A G: drive alone no longer decides (that was one machine's drive); the machine that wants G: says so in its config.\n" +
      "test('the root: CONSONANCE_SCRATCH wins, then scratch_dir in ~/.consonance.json, else the OS temp dir; a G: drive alone decides nothing', () => {\n" +
      "  const home = require('./scratch.js').mkdtemp('scr-home-'), cfgOf = (o) => fs.writeFileSync(path.join(home, '.consonance.json'), typeof o === 'string' ? o : JSON.stringify(o));\n" +
      "  const env = (extra = {}) => ({ USERPROFILE: home, HOME: home, ...extra });\n" +
      "  cfgOf({ scratch_dir: path.resolve('cfg-root') });\n" +
      "  assert.strictEqual(scratch.scratchRoot(env({ CONSONANCE_SCRATCH: path.resolve('x-root') }), 'win32', () => true), path.resolve('x-root'), 'the env wins over the config');\n" +
      "  assert.strictEqual(scratch.scratchRoot(env(), 'win32', () => true), path.resolve('cfg-root'), 'then the config');\n" +
      "  assert.strictEqual(scratch.scratchRoot(env(), 'linux', () => true), path.resolve('cfg-root'), 'on any platform');\n" +
      "  assert.strictEqual(scratch.scratchRoot(env({ CONSONANCE_SCRATCH: '   ' }), 'win32', () => true), path.resolve('cfg-root'), 'a blank override is no override');\n" +
      "  for (const c of [{}, { scratch_dir: '' }, { scratch_dir: '   ' }, { scratch_dir: 7 }, 'not json', '\\uFEFF{}']) {\n" +
      "    cfgOf(c); assert.strictEqual(scratch.scratchRoot(env(), 'win32', (p) => p === drv('G')), os.tmpdir(), 'no scratch_dir, so a present G: decides nothing: ' + JSON.stringify(c));\n" +
      "  }\n" +
      "  cfgOf('\\uFEFF' + JSON.stringify({ scratch_dir: path.resolve('bom-root') })); assert.strictEqual(scratch.scratchRoot(env(), 'win32', () => false), path.resolve('bom-root'), 'a BOM is tolerated');\n" +
      "  fs.rmSync(path.join(home, '.consonance.json')); assert.strictEqual(scratch.scratchRoot(env(), 'win32', () => true), os.tmpdir(), 'no config file at all');\n");
  });
} else if (step === 'fix') {
  edit('consonance/hooks/release-chime.js', (rep) => {
    rep("// `\"chime_repos\"` is the list of repo names a push to main must match (default t180, consonance, lighthouse; matched as a part of the remote URL's or the directory's name).",
      "// `\"chime_repos\"` is the list of repo names a push to main must match (matched as a part of the remote URL's or the directory's name). With none, the default is the\n" +
      "// room's own repository: the folder that room_path's exo_memory sits in (D454: it was one creator's three products, t180, consonance and lighthouse).");
    rep("const DEFAULT_REPOS = ['t180', 'consonance', 'lighthouse'];\n",
      "/** D454: the default repos: the room's own repository, the folder room_path (<repo>/exo_memory/BOOT.md) sits two levels under; none without a room. */\n" +
      "function defaultRepos(cfg) {\n" +
      "  const rp = cfg && typeof cfg.room_path === 'string' ? cfg.room_path.trim() : '';\n" +
      "  if (!rp) return [];\n" +
      "  const name = path.basename(path.dirname(path.dirname(rp))).toLowerCase();\n" +
      "  return name ? [name] : [];\n" +
      "}\n");
    rep("    const repos = Array.isArray(cfg.chime_repos) && cfg.chime_repos.length ? cfg.chime_repos : DEFAULT_REPOS;",
      "    const repos = Array.isArray(cfg.chime_repos) && cfg.chime_repos.length ? cfg.chime_repos : defaultRepos(cfg);");
    rep("module.exports = { DEBOUNCE_MS, DEFAULT_REPOS, ", "module.exports = { DEBOUNCE_MS, defaultRepos, ");
  });
  edit('consonance/tools/scratch.js', (rep) => {
    rep(" * THE ROOT. CONSONANCE_SCRATCH if set; else G:\\consonance-scratch when a G: drive exists (a 2 TB NVMe with room; D287 amendment); else the\n * OS temp directory.",
      " * THE ROOT. CONSONANCE_SCRATCH if set; else `scratch_dir` in ~/.consonance.json (D454: a machine with a roomy drive names it there; it was\n" +
      " * \"G:\\consonance-scratch when a G: drive exists\", one machine's 2 TB NVMe, D287 amendment); else the OS temp directory.");
    rep("const DEFAULT_DRIVE_DIR = 'consonance-scratch';\n\n/** The scratch root. `env`, `platform` and `exists` are injectable so the choice can be tested without a G: drive. */\n" +
      "function scratchRoot(env = process.env, platform = process.platform, exists = fs.existsSync) {\n" +
      "  if (env.CONSONANCE_SCRATCH && String(env.CONSONANCE_SCRATCH).trim()) return path.resolve(String(env.CONSONANCE_SCRATCH).trim());\n" +
      "  if (platform === 'win32') {\n" +
      "    const drive = String(env.CONSONANCE_SCRATCH_DRIVE || 'G').trim().replace(/[:\\\\/]+$/, '').toUpperCase();\n" +
      "    if (/^[A-Z]$/.test(drive)) {\n" +
      "      let there = false;\n" +
      "      try { there = exists(drive + ':\\\\'); } catch { there = false; }\n" +
      "      if (there) return path.join(drive + ':\\\\', DEFAULT_DRIVE_DIR);\n" +
      "    }\n" +
      "  }\n" +
      "  return os.tmpdir();\n}",
      "/** The scratch root. `env` is injectable (its USERPROFILE/HOME locate ~/.consonance.json) so the choice can be tested; `platform` and `exists`\n" +
      " *  are kept for the callers that pass them and no longer decide anything (D454). */\n" +
      "function scratchRoot(env = process.env, platform = process.platform, exists = fs.existsSync) {   // eslint-disable-line no-unused-vars\n" +
      "  if (env.CONSONANCE_SCRATCH && String(env.CONSONANCE_SCRATCH).trim()) return path.resolve(String(env.CONSONANCE_SCRATCH).trim());\n" +
      "  const home = env.USERPROFILE || env.HOME || os.homedir();\n" +
      "  try {\n" +
      "    const d = (JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\\uFEFF/, '')) || {}).scratch_dir;\n" +
      "    if (typeof d === 'string' && d.trim()) return path.resolve(d.trim());\n" +
      "  } catch { /* no config, or no scratch_dir in it: the OS temp dir */ }\n" +
      "  return os.tmpdir();\n}");
  });
} else throw new Error('step is test or fix');
