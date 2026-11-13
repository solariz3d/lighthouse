/* Tests for landed-live.js (Lap I, I1; exo_memory/loop/landed_live_2026-11-13/00_lap_i_spec.md:79-190, with the second reader's changes, :852-853).
 *
 * Fixtures: a temp repo and a temp USERPROFILE (scratch.js), CONSONANCE_MACHINE pinned, installed bytes from `git show <commit>:<path>` of the
 * real history. Each fixture writes its OWN install.ps1 tables, with `By` on the Lib rows it uses (the real install.ps1 has none until I7).
 *   A  L0613 / L1085, D635's push 21819167..fe69a9fc: installed second-reader.js and its worker are aadcc10a's (abcbff60, 63ec0296), the note
 *      absent; HEAD holds fe69a9fc's three (2d161fbd, b79bbafe, 3427cbbd).
 *   B  L1079 / L1087: board-digest.js 2c7b3872's (142a6541), blind.js 1c0acf7f^'s (a6a9ed54), HEAD b0be06f0's. B2: board-digest synced alone.
 *   C  the false green: the same files, settings WITHOUT board-digest.js: NOT RUN HERE, never LIVE.
 *   D  ruled states that must not fail, with the two-line rows a per-line parse loses.
 *   E  the endless hold: HoldUntil 2026-11-17.
 * Run: node --test consonance/tools/landed-live.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const TOOL = path.join(__dirname, 'landed-live.js');
// the repository whose real history the fixtures are cut from; the mutant harness runs this suite from a temp copy and points it back here
const REAL = process.env.LANDED_HISTORY_REPO || path.join(__dirname, '..', '..');
const L = require('./landed-live.js');
const tmp = (p) => require('./scratch.js').mkdtemp(p);
const git = (dir, ...args) => { const r = spawnSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'core.autocrlf=false', ...args], { encoding: 'utf8', windowsHide: true }); if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };
const real = (rev, p) => spawnSync('git', ['-C', REAL, 'show', `${rev}:${p}`], { encoding: 'buffer', windowsHide: true, maxBuffer: 1 << 26 }).stdout;

/** install.ps1 with just the two tables, in the real file's shape (a `#` comment line inside each block, two-line rows where given). */
const manifest = (files, register) => `# fixture\nparam([switch]$Check)\n$files = @(\n  # a comment line the parse drops\n${files.join('\n')}\n)\n\n$register = @(\n${register.join('\n')}\n)\n`;
/** A repo with `commits` in order: each { files: {path: Buffer|string} }; install.ps1 rides the first. Returns { repo, shas }. */
function repoWith(install, commits) {
  const repo = tmp('ll-repo-'); git(repo, 'init', '-q', '-b', 'main');
  fs.mkdirSync(path.join(repo, 'dev', 'shell'), { recursive: true }); fs.writeFileSync(path.join(repo, 'dev', 'shell', 'install.ps1'), install);
  fs.mkdirSync(path.join(repo, 'exo_memory'), { recursive: true }); fs.writeFileSync(path.join(repo, 'exo_memory', 'BOOT.md'), 'room\n');
  const shas = [];
  for (const c of commits) {
    for (const [p, b] of Object.entries(c.files)) { const f = path.join(repo, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, b); }
    git(repo, 'add', '-A'); git(repo, 'commit', '-q', '--allow-empty', '-m', `c${shas.length}`); shas.push(git(repo, 'rev-parse', 'HEAD'));
  }
  return { repo, shas };
}
/** A home: installed files under .claude/shell, settings.json running `registered` (installed To paths, or absolute paths), .consonance.json. */
function homeWith(repo, installed, registered, { settings = true } = {}) {
  const home = tmp('ll-home-'), shell = path.join(home, '.claude', 'shell');
  for (const [to, b] of Object.entries(installed)) { const f = path.join(shell, to); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, b); }
  const cmd = (p) => ({ type: 'command', command: `node "${path.isAbsolute(p) ? p : path.join(shell, p)}"` });
  if (settings) fs.writeFileSync(path.join(home, '.claude', 'settings.json'), JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'X', hooks: registered.map(cmd) }] } }));
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md'), machine_tag: 'D' }));
  return home;
}
function run(repo, home, args = [], env = {}) {
  const r = spawnSync(process.execPath, [TOOL, ...args], { encoding: 'utf8', windowsHide: true, env: { ...process.env, LANDED_REPO: repo, USERPROFILE: home, HOME: home, CONSONANCE_MACHINE: 'D', LANDED_NOW: '2026-11-13T12:00:00-06:00', ...env } });
  return { code: r.status, out: r.stdout, err: r.stderr };
}
const stateOf = (out, lf) => { const l = out.split('\n').find((x) => new RegExp(`^\\S.*\\s${lf.replace(/\./g, '\\.')}(\\s|$)`).test(x)); return l ? l.slice(0, 17).trim() : null; };

// ── A ──
const SR = 'consonance/hooks/second-reader.js', SRW = 'consonance/hooks/second-reader-worker.js', SRN = 'consonance/hooks/second-reader-note.js';
const A_FILES = [String.raw`  @{ From = 'consonance\hooks\second-reader.js';          To = 'hooks\second-reader.js' }`,
  String.raw`  @{ From = 'consonance\hooks\second-reader-worker.js';   To = 'hooks\second-reader-worker.js'; Lib = $true; By = 'second-reader.js' }`,
  String.raw`  @{ From = 'consonance\hooks\second-reader-note.js';     To = 'hooks\second-reader-note.js' }`];
const A_REG = [String.raw`  @{ Event = 'PreToolUse';  Rel = 'hooks\second-reader.js'; Runner = 'node';`, "     Matcher = 'mcp__consonance__call_librarian' }",
  String.raw`  @{ Event = 'PostToolUse'; Rel = 'hooks\second-reader-note.js'; Runner = 'node';`, "     Matcher = 'mcp__consonance__call_chair'; Timeout = 10 }"];
function fixtureA() {
  const { repo, shas } = repoWith(manifest(A_FILES, A_REG), [{ files: { [SR]: real('aadcc10a', SR), [SRW]: real('aadcc10a', SRW) } },
    { files: { [SR]: real('fe69a9fc', SR), [SRW]: real('fe69a9fc', SRW), [SRN]: real('fe69a9fc', SRN) } }]);
  const home = homeWith(repo, { 'hooks\\second-reader.js': real('aadcc10a', SR), 'hooks\\second-reader-worker.js': real('aadcc10a', SRW) }, ['hooks\\second-reader.js']);
  return { repo, shas, home };
}
test('I1 (RED FIRST) A, D635\'s push: the two second-reader files run here and are older than HEAD (OWED), the note is declared and absent (NEW); exit 1', () => {
  const { repo, shas, home } = fixtureA();
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(r.code, 1, r.out + r.err);
  assert.strictEqual(stateOf(r.out, 'second-reader.js'), 'OWED', r.out);
  assert.strictEqual(stateOf(r.out, 'second-reader-worker.js'), 'OWED', 'the Lib, by its By');
  assert.strictEqual(stateOf(r.out, 'second-reader-note.js'), 'NEW');
  assert.match(r.out, /install\.ps1 -NoRegister -Only second-reader\.js,second-reader-worker\.js/, 'the exact install, with its Lib');
  assert.match(r.out, /^LIVE-HERE D HEAD [0-9a-f]{8}: 0\/2 live; owed second-reader\.js,second-reader-worker\.js; new second-reader-note\.js; held none$/m);
});

// ── B / B2 / C ──
const BD = 'consonance/hooks/board-digest.js', BL = 'consonance/hooks/blind.js';
const B_FILES = [String.raw`  @{ From = 'consonance\hooks\blind.js';        To = 'blind.js'; Lib = $true; By = 'board-digest.js' }`,
  String.raw`  @{ From = 'consonance\hooks\board-digest.js'; To = 'board-digest.js' }`];
const B_REG = [String.raw`  @{ Event = 'UserPromptSubmit'; Rel = 'board-digest.js'; Runner = 'node' }`];
function fixtureB(installedBd, installedBl, registered = ['board-digest.js']) {
  const { repo, shas } = repoWith(manifest(B_FILES, B_REG), [{ files: { [BD]: real('2c7b3872', BD), [BL]: real('1c0acf7f^', BL) } },
    { files: { [BD]: real('b0be06f0', BD), [BL]: real('b0be06f0', BL) } }]);
  return { repo, shas, home: homeWith(repo, { 'board-digest.js': installedBd, 'blind.js': installedBl }, registered) };
}
test('I1 (RED FIRST) B: board-digest.js runs here, older than HEAD, and so is the blind.js it requires: OWED, installed together; exit 1', () => {
  const { repo, shas, home } = fixtureB(real('2c7b3872', BD), real('1c0acf7f^', BL));
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(r.code, 1);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'OWED', r.out);
  assert.match(r.out, /install\.ps1 -NoRegister -Only board-digest\.js,blind\.js/);
});
test('I1 B2, the L0020 trap: board-digest.js synced ALONE, the blind.js it requires still old: still OWED, naming blind.js', () => {
  const { repo, shas, home } = fixtureB(real('b0be06f0', BD), real('1c0acf7f^', BL));
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(r.code, 1);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'OWED', r.out);
  assert.match(r.out, /requires blind\.js, not HEAD's/);
});
test('I1 B control: both at HEAD: LIVE, LIVE, exit 0', () => {
  const { repo, shas, home } = fixtureB(real('b0be06f0', BD), real('b0be06f0', BL));
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(r.code, 0, r.out);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'LIVE');
  assert.strictEqual(stateOf(r.out, 'blind.js'), 'LIVE');
});
test('I1 C, the false green: the same stale files with nothing registered to run them: NOT RUN HERE, exit 0, never LIVE', () => {
  const { repo, shas, home } = fixtureB(real('2c7b3872', BD), real('1c0acf7f^', BL), []);
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(r.code, 0, r.out);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'NOT RUN HERE');
  assert.strictEqual(stateOf(r.out, 'blind.js'), 'NOT RUN HERE');
});

// ── D: ruled states, and the two-line rows ──
test('I1 D: ruled states never fail, and a key on a row\'s SECOND line is read (Excluded, Conflicts)', () => {
  const files = [String.raw`  @{ From = 'dev\shell\userprompt_pulse.py';           To = 'userprompt_pulse.py' }`,
    String.raw`  @{ From = 'dev\shell\hooks\l2-overseer-worker.js';  To = 'hooks\l2-overseer-worker.js'; Lib = $true; By = 'l2-overseer.js' }`,
    String.raw`  @{ From = 'dev\shell\hooks\l2-overseer.js';         To = 'hooks\l2-overseer.js' }`,
    String.raw`  @{ From = 'dev\shell\hooks\stop.js';                To = 'hooks\stop.js' }`];
  const reg = [String.raw`  @{ Event = 'UserPromptSubmit'; Rel = 'userprompt_pulse.py';         Runner = 'py';`, "     Conflicts = @('userprompt-submit.js') }",
    '  # a comment inside the block, between rows',
    String.raw`  @{ Event = 'Stop';             Rel = 'hooks\l2-overseer.js';        Runner = 'node';`, "     Excluded = 'keeper 2026-09-06 06:55 - ready pair only' }",
    String.raw`  @{ Event = 'Stop';             Rel = 'hooks\stop.js';               Runner = 'node';`, "     Excluded = 'keeper 2026-09-06 06:55 - ready pair only (librarian/2026-09-06.md:603)' }"];
  const body = { 'dev/shell/userprompt_pulse.py': 'p\n', 'dev/shell/hooks/l2-overseer-worker.js': 'w\n', 'dev/shell/hooks/l2-overseer.js': 'o\n', 'dev/shell/hooks/stop.js': 's\n' };
  const { repo } = repoWith(manifest(files, reg), [{ files: body }]);
  const home = homeWith(repo, { 'userprompt_pulse.py': 'p\n', 'hooks\\l2-overseer-worker.js': 'w\n', 'hooks\\stop.js': 's\n' },
    ['hooks\\stop.js', path.join(repo, 'consonance', 'hooks', 'ask-surface.js')]);
  const r = run(repo, home, ['--all']);
  assert.strictEqual(r.code, 0, r.out + r.err);
  assert.strictEqual(stateOf(r.out, 'userprompt_pulse.py'), 'NOT RUN HERE', r.out);
  assert.strictEqual(stateOf(r.out, 'l2-overseer-worker.js'), 'NOT RUN HERE');
  assert.strictEqual(stateOf(r.out, 'l2-overseer.js'), 'EXCLUDED');
  assert.strictEqual(stateOf(r.out, 'stop.js'), 'EXCLUDED BUT LIVE', 'Excluded is on the row\'s second line');
  assert.match(r.out, /librarian\/2026-09-06\.md:603/);
  assert.strictEqual(stateOf(r.out, 'ask-surface.js'), 'RUNS FROM REPO');
  const rows = L.tables(L.blockLines(fs.readFileSync(path.join(repo, 'dev', 'shell', 'install.ps1'), 'utf8'), 'register'));
  assert.deepStrictEqual(rows[0].Conflicts, ['userprompt-submit.js'], 'an array on a second line');
});

// ── E: the hold ──
test('I1 E, the endless hold: HoldUntil 2026-11-17 is HELD on 11-13 (exit 0) and HOLD EXPIRED on 11-18 (exit 1)', () => {
  const files = [String.raw`  @{ From = 'consonance\hooks\second-reader.js'; To = 'hooks\second-reader.js'; Hold = 'librarian/2026-11-03.md:1'; HoldOn = @('D'); HoldUntil = '2026-11-17' }`];
  const reg = [String.raw`  @{ Event = 'PreToolUse'; Rel = 'hooks\second-reader.js'; Runner = 'node' }`];
  const { repo, shas } = repoWith(manifest(files, reg), [{ files: { [SR]: real('aadcc10a', SR) } }, { files: { [SR]: real('fe69a9fc', SR) } }]);
  const home = homeWith(repo, { 'hooks\\second-reader.js': real('aadcc10a', SR) }, ['hooks\\second-reader.js']);
  const range = ['--range', `${shas[0]}..${shas[1]}`];
  const held = run(repo, home, range);
  assert.strictEqual(held.code, 0, held.out);
  assert.strictEqual(stateOf(held.out, 'second-reader.js'), 'HELD');
  assert.match(held.out, /until 2026-11-17/);
  const expired = run(repo, home, range, { LANDED_NOW: '2026-11-18T09:00:00-06:00' });
  assert.strictEqual(expired.code, 1);
  assert.strictEqual(stateOf(expired.out, 'second-reader.js'), 'HOLD EXPIRED');
  const elsewhere = run(repo, home, range, { CONSONANCE_MACHINE: 'L' });
  assert.strictEqual(stateOf(elsewhere.out, 'second-reader.js'), 'OWED', 'a hold on D does not hold on L');
});

// ── edges ──
test('I1 edge: an empty range exits 0 with "nothing in range"', () => {
  const { repo, shas, home } = fixtureA();
  const r = run(repo, home, ['--range', `${shas[1]}..${shas[1]}`]);
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /^nothing in range/m);
});
test('I1 edge: settings.json missing or not JSON: UNKNOWN, exit 2, no guess', () => {
  const { repo, home } = fixtureA();
  fs.writeFileSync(path.join(home, '.claude', 'settings.json'), '{ not json');
  const r = run(repo, home);
  assert.strictEqual(r.code, 2);
  assert.match(r.out, /^UNKNOWN/);
  fs.rmSync(path.join(home, '.claude', 'settings.json'));
  assert.strictEqual(run(repo, home).code, 2);
});
test('I1 edge: a CRLF-only difference is LIVE (the repo pins eol=lf)', () => {
  const { repo, shas } = fixtureB(real('b0be06f0', BD), real('b0be06f0', BL));
  const crlf = (b) => Buffer.from(b.toString('binary').replace(/\r?\n/g, '\r\n'), 'binary');
  const home = homeWith(repo, { 'board-digest.js': crlf(real('b0be06f0', BD)), 'blind.js': crlf(real('b0be06f0', BL)) }, ['board-digest.js']);
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'LIVE', r.out);
});
test('I1 edge: installed bytes that match no object in the repo are a LOCAL EDIT', () => {
  const { repo, shas } = fixtureB(real('b0be06f0', BD), real('b0be06f0', BL));
  const home = homeWith(repo, { 'board-digest.js': '// edited by hand on this machine\n', 'blind.js': real('b0be06f0', BL) }, ['board-digest.js']);
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'LOCAL EDIT', r.out);
  assert.strictEqual(r.code, 1);
});
test('I1 edge: an install.ps1 with no $files block exits 2, "changed shape"', () => {
  const { repo, home } = fixtureA();
  fs.writeFileSync(path.join(repo, 'dev', 'shell', 'install.ps1'), '$register = @(\n  @{ Event = \'X\'; Rel = \'a.js\' }\n)\n');
  const r = run(repo, home);
  assert.strictEqual(r.code, 2);
  assert.match(r.out, /changed shape/);
});
test('I1 the exact path, never the leaf: a command running the same leaf from another folder is WIRED ELSEWHERE, not LIVE', () => {
  const { repo, shas } = fixtureB(real('b0be06f0', BD), real('b0be06f0', BL));
  const other = path.join(tmp('ll-other-'), 'board-digest.js');
  const home = homeWith(repo, { 'board-digest.js': real('b0be06f0', BD), 'blind.js': real('b0be06f0', BL) }, [other]);
  const r = run(repo, home, ['--range', `${shas[0]}..${shas[1]}`]);
  assert.strictEqual(stateOf(r.out, 'board-digest.js'), 'WIRED ELSEWHERE', r.out);
});

// ── pins to the instruments ──
test('I1 the node blob is git\'s: equal to `git hash-object --path=<From> <installed>` for every installed manifest file on this machine', () => {
  const man = L.readManifest(REAL), shell = path.join(require('os').homedir(), '.claude', 'shell');
  let n = 0;
  for (const f of man.files) {
    const dst = path.join(shell, f.To); if (!fs.existsSync(dst)) continue;
    const g = spawnSync('git', ['-C', REAL, 'hash-object', `--path=${f.From.replace(/\\/g, '/')}`, dst], { encoding: 'utf8', windowsHide: true }).stdout.trim();
    assert.strictEqual(L.blobOf(fs.readFileSync(dst)), g, f.To); n++;
  }
  assert.ok(n > 0 || !fs.existsSync(shell), 'at least one installed file was compared');
});
test('I1 agrees with install.ps1 -Check on every file\'s bytes (ok / DRIFT / ABSENT), run on the fixture with the REAL script body', { skip: process.platform !== 'win32' && 'install.ps1 is Windows PowerShell' }, () => {
  // the real install.ps1 with only its two tables swapped for fixture B's (so -Check's own logic decides), into the temp repo
  const realText = fs.readFileSync(path.join(REAL, 'dev', 'shell', 'install.ps1'), 'utf8');
  const swapBlock = (text, name, rows) => { const lines = text.split(/\r?\n/), s = lines.findIndex((l) => new RegExp(`^\\$${name}\\s*=\\s*@\\(`).test(l)), e = lines.findIndex((l, i) => i > s && /^\)\s*$/.test(l)); return [...lines.slice(0, s + 1), ...rows, ...lines.slice(e)].join('\n'); };
  const install = swapBlock(swapBlock(realText, 'files', B_FILES), 'register', B_REG);
  const { repo } = repoWith(install, [{ files: { [BD]: real('b0be06f0', BD), [BL]: real('b0be06f0', BL) } }]);
  const home = homeWith(repo, { 'board-digest.js': real('2c7b3872', BD) }, ['board-digest.js']);   // one DRIFT, one ABSENT
  const ps = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(repo, 'dev', 'shell', 'install.ps1'), '-Check'],
    { encoding: 'utf8', windowsHide: true, env: { ...process.env, USERPROFILE: home, CONSONANCE_MACHINE: 'D' }, timeout: 120000 });
  const verdict = {}; for (const m of ps.stdout.matchAll(/^(ok|DRIFT|ABSENT)\s+(\S+)/gm)) verdict[m[2].toLowerCase()] = m[1];
  const mine = L.classify({ repo, home }).rows.filter((r) => r.to);
  assert.ok(Object.keys(verdict).length >= 2, ps.stdout.slice(0, 400));
  for (const r of mine) assert.strictEqual(r.bytes, verdict[r.to.toLowerCase()], `${r.to}: landed-live ${r.bytes}, -Check ${verdict[r.to.toLowerCase()]}`);
});
