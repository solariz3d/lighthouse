// precompact-repo.test.js — D273 lap 5 (cold read 2, A6): precompact.js finds the room's checkpoint script through THE APP'S OWN RULE for where the
// checkout is (consonance/src-tauri/src/main.rs repo_root / repo_root_from_room_path): ~/.consonance.json's room_path is <repo>\exo_memory\BOOT.md, so
// the repo is two folders up, and only when <repo>\exo_memory\BOOT.md is a file. It used to be %USERPROFILE%\Desktop\lighthouse, this author's checkout,
// which on anyone else's machine named nothing and left a registered hook silently dead. Rows:
//   1  a checkout anywhere (not on the Desktop), named by room_path: its checkpoint runs, and a Desktop\lighthouse copy is NOT the one run
//   2  no ~/.consonance.json, a room_path that is not <repo>\exo_memory\BOOT.md's shape, or a repo with no exo_memory\BOOT.md: no checkpoint, exit 0, silent
// Run: node --test dev/shell/hooks/precompact-repo.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'precompact.js');
const mk = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

/** A temp home with a fake `py` (node), and the hook copied in with fresh-guard beside it as installed. */
function world() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-repo-')), home = path.join(root, 'home');
  mk(path.join(root, 'shell', 'hooks', 'precompact.js'), fs.readFileSync(HOOK));
  mk(path.join(root, 'shell', 'lib', 'fresh-guard.js'), fs.readFileSync(path.join(__dirname, '..', 'lib', 'fresh-guard.js')));
  fs.mkdirSync(path.join(root, 'bin'), { recursive: true });
  fs.copyFileSync(process.execPath, path.join(root, 'bin', 'py.exe'));
  fs.mkdirSync(home, { recursive: true });
  return { root, home };
}
function compact(w) {
  const r = spawnSync(process.execPath, [path.join(w.root, 'shell', 'hooks', 'precompact.js')], {
    input: JSON.stringify({ hook_event_name: 'PreCompact', trigger: 'manual', cwd: 'C:\\somewhere\\main' }), encoding: 'utf8', timeout: 20000, cwd: w.root,
    env: { PATH: path.join(w.root, 'bin') + path.delimiter + process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: w.home, HOME: w.home, TEMP: w.root, TMP: w.root },
  });
  assert.strictEqual(r.status, 0, r.stderr);
  return r.stdout;
}
const STUB = (tag) => `console.log('# Checkpoint ${tag}');\n`;

test('row 1: a checkout named by room_path, wherever it is, has its checkpoint run, and a Desktop\\lighthouse copy is not the one run', () => {
  const w = world(), repo = path.join(w.root, 'elsewhere', 'my-room');
  mk(path.join(repo, 'exo_memory', 'BOOT.md'), '# boot\n');
  mk(path.join(repo, 'exo_memory', 'loop', 'checkpoint.py'), STUB('FROM ROOM_PATH'));
  mk(path.join(w.home, 'Desktop', 'lighthouse', 'exo_memory', 'loop', 'checkpoint.py'), STUB('FROM THE OLD DESKTOP PATH'));
  mk(path.join(w.home, '.consonance.json'), '\uFEFF' + JSON.stringify({ room_path: '  ' + path.join(repo, 'exo_memory', 'BOOT.md') + '  ' }));
  assert.strictEqual(compact(w), '# Checkpoint FROM ROOM_PATH\n');
  fs.rmSync(w.root, { recursive: true, force: true });
});

test('row 2: no config, a room_path of the wrong shape, or a repo with no exo_memory\\BOOT.md: no checkpoint, exit 0, nothing said', () => {
  const w = world(), repo = path.join(w.root, 'r');
  mk(path.join(repo, 'exo_memory', 'loop', 'checkpoint.py'), STUB('MUST NOT RUN'));
  mk(path.join(w.home, 'Desktop', 'lighthouse', 'exo_memory', 'loop', 'checkpoint.py'), STUB('MUST NOT RUN EITHER'));
  assert.strictEqual(compact(w), '', 'no ~/.consonance.json');
  for (const cfg of ['{ not json', JSON.stringify({ room_path: '' }), JSON.stringify({ room_path: 7 }), JSON.stringify({ room_path: 'BOOT.md' }),
    JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md') })]) {   // the last: the shape is right, but the repo has no exo_memory\BOOT.md
    mk(path.join(w.home, '.consonance.json'), cfg);
    assert.strictEqual(compact(w), '', cfg);
  }
  fs.rmSync(w.root, { recursive: true, force: true });
});
