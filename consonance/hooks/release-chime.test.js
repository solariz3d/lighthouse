// release-chime.test.js: node --test consonance/hooks/release-chime.test.js   (D281, seat A)
// The hook chimes when a final product ships: a successful `gh release create`, or a successful `git push` that updated main on t180 / consonance / lighthouse. AUDIO IS STUBBED
// IN EVERY ROW (CONSONANCE_CHIME_STUB appends a line to a file instead of playing), so this suite never makes a sound; the one row that runs the real player command does so on a
// SILENT 50 ms wav. Each row runs the hook as a child, with a temp HOME, data dir and sound folder (CONSONANCE_CHIME_MEDIA: Node will not start on Windows with a fake SystemRoot).
//   1  a release, on Bash and on PowerShell, chimes once; a draft release does not
//   2  a push to main chimes, however it is written (origin main, -C <repo>, cd <repo> &&, HEAD:main, -u, no arguments, a pipe after it)
//   3  no chime: another branch or a tag, a rejected or failed push, Everything up-to-date, a deleted ref, a push to main of a repo that is not a product (unless chime_repos names it)
//   4  no chime for a command that only MENTIONS them: an echo, a quoted string with a ; or && in it, a heredoc body, a commit message, gh release list/view/delete, gh pr create
//   5  no chime on a failure: a non-zero exit code under any name, interrupted, an error flag, a release with no sign of success, a payload with no tool_response, another tool
//   6  one chime per 2 minutes, to the millisecond (a fixed clock); a debounced ship does not extend the window; a push plus a release in ONE command chimes once
//   7  "chime": false (also "false", "off", 0) silences it; absent, true, null, and a broken config leave it on
//   8  the sound: chime_sound if it exists, else %SystemRoot%\Media\chimes.wav, else the next, else silence
//   9  it never blocks or fails the call: nothing on stdout, exit 0, on garbage, an empty stdin, a data dir it cannot write, a missing sound; the dream gate
//  10  the ledger: one row per ship it recognised (chimed / debounced / silenced), never the command
//  11  the real player command plays a silent wav to the end and exits 0 (win32), with an apostrophe in the path
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const HOOK = process.env.RELEASE_CHIME_UNDER_TEST || path.join(__dirname, 'release-chime.js');
const C = require(HOOK);   // the module under test, so the unit rows see a mutated copy too
const WAV = (() => { const n = 2205, b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(44100, 24); b.writeUInt32LE(88200, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40); return b; })();   // 50 ms of silence
const roots = [];
test.after(() => { for (const r of roots) try { fs.rmSync(r, { recursive: true, force: true }); } catch (_) { /* temp */ } });
const FIXED = Date.parse('2026-10-09T20:00:00Z');

function room(cfg = {}, { sound = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'chime-')); roots.push(root);
  const home = path.join(root, 'home'), data = path.join(root, 'data'), media = path.join(root, 'Media'), stub = path.join(root, 'stub.jsonl');
  fs.mkdirSync(home, { recursive: true }); fs.mkdirSync(media, { recursive: true });
  if (sound) fs.writeFileSync(path.join(media, 'chimes.wav'), WAV);
  fs.writeFileSync(path.join(home, '.consonance.json'), typeof cfg === 'string' ? cfg : JSON.stringify(cfg));
  fs.writeFileSync(path.join(root, 'clock.js'), `const R = Date; let F = Number(process.env.FIXED_NOW); class FD extends R { constructor(...a) { if (a.length) super(...a); else super(F); } static now() { return F; } } global.Date = FD;\n`);
  return { root, home, data, media, stub };
}
const chimes = (e) => (fs.existsSync(e.stub) ? fs.readFileSync(e.stub, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
const ledger = (e) => { try { return fs.readFileSync(path.join(e.data, 'release-chime.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch (_) { return []; } };
function run(e, payload, { now = null, env = {}, input = null } = {}) {
  const args = [...(now ? ['-r', path.join(e.root, 'clock.js')] : []), HOOK];
  const r = spawnSync(process.execPath, args, { input: input !== null ? input : JSON.stringify(payload), encoding: 'utf8', timeout: 15000, cwd: e.root,
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, CONSONANCE_CHIME_MEDIA: e.media, USERPROFILE: e.home, HOME: e.home, CONSONANCE_DATA: e.data, CONSONANCE_CHIME_STUB: e.stub, ...(now ? { FIXED_NOW: String(now) } : {}), ...env } });
  assert.equal(r.status, 0, `exit ${r.status}: ${r.stderr}`); assert.equal(r.stdout, '', 'it prints nothing');
  return r;
}
const call = (command, resp, tool = 'Bash') => ({ hook_event_name: 'PostToolUse', tool_name: tool, tool_input: { command }, tool_response: resp, cwd: 'C:\\somewhere', session_id: 's1' });
const PUSH = (branch = 'main', repo = 'lighthouse', range = 'a1b2c3d..e4f5a6b') => `remote: Resolving deltas: 100% (3/3), completed with 3 local objects.\nTo https://github.com/acme/${repo}.git\n   ${range}  ${branch} -> ${branch}\n`;
const OK = (stderr = '', stdout = '') => ({ stdout, stderr, exit_code: 0, interrupted: false });
const REL = 'https://github.com/acme/t180-track-builder/releases/tag/v0.3.4\n';

test('row 1: a release chimes once, on Bash and on PowerShell; a draft release does not', () => {
  for (const tool of ['Bash', 'PowerShell']) { const e = room(); run(e, call('gh release create v0.3.4 --title x --notes "n"', OK('', REL), tool)); assert.equal(chimes(e).length, 1, tool); assert.match(chimes(e)[0].file, /chimes\.wav$/); }
  const e = room(); run(e, call('gh release create v0.3.4 --draft', OK('', REL))); assert.equal(chimes(e).length, 0, '--draft is not shipped'); run(e, call('gh release create v0.3.4 -d', OK('', REL))); assert.equal(chimes(e).length, 0);
  const f = room(); run(f, call('gh -R acme/consonance release create v1', OK('', 'https://github.com/acme/consonance/releases/tag/v1'))); assert.equal(chimes(f).length, 1, 'a global flag before release');
  const g = room(); run(g, call('cd /c/repo && gh release create v1 --generate-notes', { stdout: '', stderr: '', exit_code: 0 })); assert.equal(chimes(g).length, 1, 'exit 0 is enough when gh printed nothing');
});

test('row 2: a push that updated main chimes, however it is written', () => {
  const cmds = ['git push origin main', 'git -C C:/Users/x/lighthouse push origin main', 'cd /c/repo && git push origin main', 'git push origin HEAD:main', 'git push -u origin main', 'git push', 'git push origin main 2>&1 | tail -3',
    'git push --force-with-lease origin main', 'echo shipping; git push origin main; echo done', 'git -c core.x=1 push origin main', 'GIT_TRACE=0 git push origin main'];
  for (const c of cmds) { const e = room(); run(e, call(c, OK(PUSH()))); assert.equal(chimes(e).length, 1, c); }
  for (const repo of ['t180-track-builder', 'consonance', 'lighthouse']) { const e = room(); run(e, call('git push origin main', OK(PUSH('main', repo)))); assert.equal(chimes(e).length, 1, repo); }
  const e1 = room(); run(e1, call('git push origin main', OK('To git@github.com:acme/lighthouse.git\n * [new branch]      main -> main\n'))); assert.equal(chimes(e1).length, 1, 'a new branch main over ssh');
  const e2 = room(); run(e2, call('git push -f origin main', OK('To https://github.com/acme/lighthouse.git\n + a1b2c3d...e4f5a6b main -> main (forced update)\n'))); assert.equal(chimes(e2).length, 1, 'forced');
  const e3 = room(); run(e3, call('git push origin main', { stdout: PUSH(), stderr: '', exit_code: 0 })); assert.equal(chimes(e3).length, 1, 'the report on stdout (2>&1) is read too');
  const e4 = room(); run(e4, call('git push origin feature main', OK('To https://github.com/acme/lighthouse.git\n   a1b2c3d..e4f5a6b  feature -> feature\n   1111111..2222222  main -> main\n'))); assert.equal(chimes(e4).length, 1, 'main among two refs');
});

test('row 3: no chime for a push that did not update main on a product repo', () => {
  const NO = [
    ['another branch', 'git push origin feature', OK(PUSH('feature'))],
    ['a tag', 'git push origin v1', OK('To https://github.com/acme/lighthouse.git\n * [new tag]         v1 -> v1\n')],
    ['a rejected push', 'git push origin main', { stdout: '', stderr: 'To https://github.com/acme/lighthouse.git\n ! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to \'https://github.com/acme/lighthouse.git\'\n', exit_code: 1 }],
    ['rejected but exit 0 reported', 'git push origin main', OK('To https://github.com/acme/lighthouse.git\n ! [rejected]        main -> main (non-fast-forward)\n')],
    ['nothing to push', 'git push origin main', OK('Everything up-to-date\n')],
    ['up to date, verbose', 'git push -v origin main', OK('To https://github.com/acme/lighthouse.git\n = [up to date]      main -> main\n')],
    ['a deleted ref', 'git push origin :main', OK('To https://github.com/acme/lighthouse.git\n - [deleted]         main\n')],
    ['main of a repo that is not a product', 'git push origin main', OK(PUSH('main', 'dotfiles'))],
    ['a branch named like main', 'git push origin domain', OK(PUSH('domain'))],
    ['a remote rejection', 'git push origin main', OK('To https://github.com/acme/lighthouse.git\n ! [remote rejected] main -> main (pre-receive hook declined)\n')],
    ['the push is not in the command', 'git status', OK(PUSH())],
  ];
  for (const [name, cmd, resp] of NO) { const e = room(); run(e, call(cmd, resp)); assert.equal(chimes(e).length, 0, name); assert.equal(ledger(e).length, 0, `${name}: not even a ledger row`); }
  const e = room({ chime_repos: ['dotfiles'] }); run(e, call('git push origin main', OK(PUSH('main', 'dotfiles')))); assert.equal(chimes(e).length, 1, 'chime_repos names it');
  const f = room({ chime_repos: ['dotfiles'] }); run(f, call('git push origin main', OK(PUSH('main', 'lighthouse')))); assert.equal(chimes(f).length, 0, 'and replaces the defaults');
});

test('row 4: a command that only MENTIONS a release or a push does not chime, even with output that looks like success', () => {
  const bait = OK(PUSH() + REL);
  const MENTIONS = ['echo "gh release create v1"', "echo 'git push origin main'", 'echo "done; gh release create v1 && git push origin main"', 'git commit -m "git push origin main and gh release create v1"',
    'grep -n "gh release create" notes.md', 'cat <<EOF > plan.md\nthen run: gh release create v1\nand git push origin main\nEOF', 'cat > f.ps1 <<\'EOF\'\ngit push origin main\nEOF\nnode f.test.js',
    'gh release list', 'gh release view v1', 'gh release delete v1 --yes', 'gh release download v1', 'gh pr create --title "release" --body "git push origin main"', 'gh issue comment 1 -b "gh release create"',
    'git push --dry-run origin main', 'git push -n origin main', 'git push origin main --dry-run', 'git push -h', 'git push --help', 'git push --delete origin main', 'gh release create --help', 'gh release create -h',
    'git pull origin main', 'git fetch origin main', 'git log origin/main', 'git remote add origin https://example.com/x.git', 'git stash push -m "main"', 'printf "git push origin main\\n"',
    'bash -c "echo not run"', 'node -e "console.log(1)"', 'ls release/ push/'];
  for (const c of MENTIONS) { const e = room(); run(e, call(c, bait)); assert.equal(chimes(e).length, 0, JSON.stringify(c)); }
  const ps = room(); run(ps, call('Write-Host "gh release create v1"', bait, 'PowerShell')); assert.equal(chimes(ps).length, 0, 'PowerShell echo');
  const e = room(); run(e, call('echo "gh release create"; git push origin main', OK(PUSH()))); assert.equal(chimes(e).length, 1, 'a real push after an echo still counts');
});

test('row 5: no chime when the call did not succeed, or there is nothing to read', () => {
  const FAIL = [['exit_code 1', { ...OK('', REL), exit_code: 1 }], ['exitCode 2', { stdout: REL, exitCode: 2 }], ['returncode 128', { stdout: REL, returncode: 128 }], ['interrupted', { ...OK('', REL), interrupted: true }],
    ['is_error', { stdout: REL, is_error: true }], ['an error field', { stdout: REL, error: 'boom' }], ['no sign of success', { stdout: 'created a draft locally\n', stderr: '' }], ['empty', { stdout: '', stderr: '' }]];
  for (const [name, resp] of FAIL) { const e = room(); run(e, call('gh release create v1', resp)); assert.equal(chimes(e).length, 0, name); }
  const p = room(); run(p, call('git push origin main', { stdout: '', stderr: PUSH(), exit_code: 1 })); assert.equal(chimes(p).length, 0, 'a push with a non-zero exit');
  const n = room(); const noResp = call('git push origin main', undefined); delete noResp.tool_response; run(n, noResp); assert.equal(chimes(n).length, 0, 'a PreToolUse-shaped payload (no tool_response)');
  for (const tool of ['Read', 'Edit', 'Write', 'mcp__consonance__call_librarian']) { const e = room(); run(e, call('git push origin main', OK(PUSH()), tool)); assert.equal(chimes(e).length, 0, tool); }
  const s = room(); run(s, call('git push origin main', PUSH())); assert.equal(chimes(s).length, 1, 'a plain-string response with git\'s report counts');
});

test('row 6: one chime per 2 minutes, to the millisecond; a debounced ship does not extend the window; a push and a release in one command chime once', () => {
  const e = room(), at = (ms) => FIXED + ms, push = call('git push origin main', OK(PUSH())), rel = call('gh release create v1', OK('', REL));
  run(e, push, { now: at(0) }); assert.equal(chimes(e).length, 1);
  run(e, rel, { now: at(30000) }); assert.equal(chimes(e).length, 1, 'a release 30 s after a push: one chime');
  run(e, push, { now: at(119999) }); assert.equal(chimes(e).length, 1, '1 ms inside the window: debounced');
  run(e, push, { now: at(120000) }); assert.equal(chimes(e).length, 2, 'at exactly 2 minutes: it chimes (the debounced ones did not extend the window)');
  run(e, rel, { now: at(120000 + 119999) }); assert.equal(chimes(e).length, 2); run(e, rel, { now: at(240000) }); assert.equal(chimes(e).length, 3);
  assert.equal(C.DEBOUNCE_MS, 120000);
  const both = room(); run(both, call('git push origin main && gh release create v1', OK(PUSH(), REL))); assert.equal(chimes(both).length, 1, 'one command, one chime');
  const st = JSON.parse(fs.readFileSync(path.join(e.data, 'release-chime.json'), 'utf8')); assert.equal(st.last, at(240000), 'the state is in the data dir');
  const old = room(); fs.mkdirSync(old.data, { recursive: true }); fs.writeFileSync(path.join(old.data, 'release-chime.json'), 'not json'); run(old, push, { now: at(0) }); assert.equal(chimes(old).length, 1, 'a damaged state file does not silence it');
});

test('row 7: "chime": false silences it (also "false", "off", 0); absent, true, null and a broken config leave it on', () => {
  for (const v of [false, 'false', ' OFF ', 0]) { const e = room({ chime: v }); run(e, call('git push origin main', OK(PUSH()))); assert.equal(chimes(e).length, 0, JSON.stringify(v)); assert.equal(ledger(e)[0].decision, 'silenced'); }
  for (const cfg of [{}, { chime: true }, { chime: null }, { chime: 'yes' }, { chime: 1 }, '{ not json', '']) { const e = room(cfg); run(e, call('gh release create v1', OK('', REL))); assert.equal(chimes(e).length, 1, JSON.stringify(cfg)); }
  const e = room('\uFEFF' + JSON.stringify({ chime: false })); run(e, call('gh release create v1', OK('', REL))); assert.equal(chimes(e).length, 0, 'a BOM before the JSON');
});

test('row 8: the sound: chime_sound if it exists, else chimes.wav under SystemRoot, else the next of the list, else silence', () => {
  const cfgSound = (e, name) => { const f = path.join(e.root, name); fs.writeFileSync(f, WAV); return f; };
  const a = room(); const mine = cfgSound(a, 'mine.wav'); fs.writeFileSync(path.join(a.home, '.consonance.json'), JSON.stringify({ chime_sound: mine })); run(a, call('gh release create v1', OK('', REL))); assert.equal(chimes(a)[0].file, mine);
  const b = room({ chime_sound: path.join(os.tmpdir(), 'no-such-sound.wav') }); run(b, call('gh release create v1', OK('', REL))); assert.equal(path.basename(chimes(b)[0].file), 'chimes.wav', 'a missing chime_sound falls back');
  const c = room({}, { sound: false }); fs.writeFileSync(path.join(c.media, 'notify.wav'), WAV); run(c, call('gh release create v1', OK('', REL))); assert.equal(path.basename(chimes(c)[0].file), 'notify.wav', 'chimes.wav missing: the next that exists');
  const d = room({}, { sound: false }); run(d, call('gh release create v1', OK('', REL))); assert.equal(chimes(d).length, 0, 'no sound file at all: silence'); assert.equal(ledger(d)[0].why, 'no sound file');
  assert.deepEqual(C.DEFAULT_SOUNDS.slice(0, 2), ['chimes.wav', 'Windows Notify System Generic.wav']); assert.deepEqual(C.soundCandidates({}, { SystemRoot: 'X:\\Win' }).map((f) => f.replace(/\\/g, '/')), C.DEFAULT_SOUNDS.map((f) => 'X:/Win/Media/' + f));
  assert.deepEqual(C.soundCandidates({ chime_sound: ' C:\\s\\a.wav ' }, {})[0], 'C:\\s\\a.wav');
});

test('row 9: it never blocks or fails the call: nothing on stdout and exit 0 on garbage, an empty stdin, a data dir it cannot write; the dream gate', () => {
  const e = room();
  for (const input of ['', 'not json', '{', 'null', '[]', '"x"', '{"tool_name":"Bash"}', JSON.stringify({ tool_name: 'Bash', tool_input: {}, tool_response: {} }), JSON.stringify({ tool_name: 'Bash', tool_input: { command: 42 }, tool_response: {} })]) run(e, null, { input });
  assert.equal(chimes(e).length, 0);
  const blocked = room(); fs.writeFileSync(blocked.data, 'a file where the data dir should be'); run(blocked, call('gh release create v1', OK('', REL))); assert.equal(chimes(blocked).length, 1, 'no writable state: it still chimes (once per call) and does not fail');
  const dream = room(); run(dream, call('gh release create v1', OK('', REL)), { env: { CONSONANCE_DREAM: '1' } }); assert.equal(chimes(dream).length, 0, 'the gap-dream gets no hooks');
  const t0 = Date.now(); run(room(), call('gh release create v1', OK('', REL))); assert.ok(Date.now() - t0 < 5000, 'quick');
});

test('row 10: the ledger has one row per ship it recognised, with the decision and never the command', () => {
  const e = room(), cmd = 'git push origin main  # SECRETWORD-1234';
  run(e, call(cmd, OK(PUSH())), { now: FIXED }); run(e, call('gh release create v1', OK('', REL)), { now: FIXED + 1000 });
  const rows = ledger(e); assert.equal(rows.length, 2);
  assert.deepEqual(rows.map((r) => [r.kind, r.decision, r.repo]), [['push', 'chimed', 'lighthouse'], ['release', 'debounced', 't180-track-builder']]);
  assert.ok(rows[0].sound === 'chimes.wav' && rows[1].sinceLastMs === 1000);
  assert.ok(!fs.readFileSync(path.join(e.data, 'release-chime.jsonl'), 'utf8').includes('SECRETWORD'), 'the command is not in the ledger');
});

test('row 11: the real player command plays a silent wav to the end and exits 0, with an apostrophe in the path (win32)', (t) => {
  if (process.platform !== 'win32') return t.skip('Windows PowerShell only');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "it's here ")); roots.push(dir); const f = path.join(dir, 's.wav'); fs.writeFileSync(f, WAV);
  assert.match(C.playerArgs(f).join(' '), /''s here/, 'the apostrophe is doubled');
  const r = spawnSync(C.powershell(), C.playerArgs(f), { encoding: 'utf8', timeout: 30000, windowsHide: true }); assert.equal(r.status, 0, `${r.stderr}`);
  const bad = spawnSync(C.powershell(), C.playerArgs(path.join(dir, 'missing.wav')), { encoding: 'utf8', timeout: 30000, windowsHide: true }); assert.notEqual(bad.status, 0, 'control: a missing file fails in the player (the hook ignores it)');
});

test('the parsing, directly', () => {
  assert.deepEqual(C.splitSegments('echo "a; b && c" && git push | tail; ls'), ['echo "a; b && c"', 'git push', 'tail', 'ls']); assert.deepEqual(C.splitSegments("echo 'x;y' || true"), ["echo 'x;y'", 'true']);
  assert.equal(C.commandsOf('cd /c/r && git push origin main').push.dir, '/c/r'); assert.equal(C.commandsOf('git -C /c/r push').push.dir, '/c/r'); assert.equal(C.commandsOf('gh release create v1 --draft').release.draft, true);
  assert.equal(C.commandsOf('if git push origin main; then echo ok; fi').push !== null, true, 'a shell keyword before the command'); assert.equal(C.commandsOf('echo gh release create').release, null);
  assert.deepEqual(C.refUpdates('To u\n   abc1234..def5678  main -> main\n').map((x) => x.ok), [true]); assert.deepEqual(C.refUpdates('Everything up-to-date'), []);
  // the defensive branches of the report reader: a flag or a parenthesis that says it did not move, whatever else the line looks like
  for (const l of [' ! abc1234..def5678  main -> main', ' = abc1234..def5678  main -> main', ' - abc1234..def5678  main -> main', '   abc1234..def5678  main -> main (fetch first)', '   abc1234..def5678  main -> main (stale info)', ' * [new tag]         main -> main', ' ! [rejected]        main -> main (non-fast-forward)', ' = [up to date]      main -> main']) assert.equal(C.refUpdates('To u\n' + l + '\n')[0].ok, false, l);
  for (const l of ['   abc1234..def5678  main -> main', ' + abc1234...def5678 main -> main (forced update)', ' * [new branch]      main -> main', ' * [new reference]   main -> main']) assert.equal(C.refUpdates('To u\n' + l + '\n')[0].ok, true, l);
  assert.equal(C.refUpdates('To u\n   abc1234..def5678  HEAD -> refs/heads/main\n')[0].dst, 'main', 'refs/heads/ is dropped from the destination');
  // the data dir, by the app's rule: CONSONANCE_DATA, then the config's data_dir, then ~/.consonance
  const keep = { d: process.env.CONSONANCE_DATA, u: process.env.USERPROFILE };
  try {
    process.env.CONSONANCE_DATA = ' C:\\envdata '; assert.equal(C.dataDir({ data_dir: 'C:\\cfg' }), 'C:\\envdata');
    delete process.env.CONSONANCE_DATA; assert.equal(C.dataDir({ data_dir: ' C:\\cfg ' }), 'C:\\cfg');
    process.env.USERPROFILE = 'C:\\Users\\someone'; assert.equal(C.dataDir({}).replace(/\\/g, '/'), 'C:/Users/someone/.consonance');
  } finally { if (keep.d === undefined) delete process.env.CONSONANCE_DATA; else process.env.CONSONANCE_DATA = keep.d; process.env.USERPROFILE = keep.u; }
  assert.equal(C.failureOf({ exit_code: 0 }), null); assert.equal(C.failureOf({ code: 1 }), 'code 1'); assert.equal(C.failureOf('plain text'), null);
  for (const v of [false, 0, 'false', 'OFF', ' no ']) assert.equal(C.isOff(v), true, String(v)); for (const v of [undefined, null, true, 1, 'on', '', 'yes']) assert.equal(C.isOff(v), false, String(v));
});
