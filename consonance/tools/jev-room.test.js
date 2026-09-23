// jev-room.test.js — node --test consonance/tools/jev-room.test.js
//
// L105 (pane A). The ONE resolver every Jev tool finds the room, the data dir and the discipline dir through. Every test
// runs a COPY of jev-room.js from a temp dir — the installed case, where `__dirname/../..` is not a checkout — with a test
// HOME, so this machine's real ~/.consonance.json is never read.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

function installed() {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'jev-room-inst-')), 'somewhere', 'tools');
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'jev-room.js'), path.join(dir, 'jev-room.js'));
  return require(path.join(dir, 'jev-room.js'));
}
function room() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-room-repo-'));
  fs.mkdirSync(path.join(root, 'consonance', 'src-tauri', 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'consonance', 'src-tauri', 'src', 'main.rs'), 'const MAIN_SID: &str = "x";\n');
  fs.mkdirSync(path.join(root, 'exo_memory'));
  fs.writeFileSync(path.join(root, 'METHOD.md'), 'the method');
  return root;
}
function homeWith(cfg) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-room-home-'));
  if (cfg !== undefined) fs.writeFileSync(path.join(home, '.consonance.json'), typeof cfg === 'string' ? cfg : JSON.stringify(cfg));
  return home;
}
const boot = (root) => path.join(root, 'exo_memory', 'BOOT.md');

// ── roomOf (moved here from jev-judge.js unchanged; jev-judge.test.js still pins its behaviour there) ──────────────
test('roomOf: an installed copy finds the room through room_path', () => {
  const R = installed(), r = room();
  assert.strictEqual(R.roomOf({ home: homeWith({ room_path: boot(r) }) }).root, r);
});

test('roomOf: an installed copy with no config names every place tried', () => {
  const got = installed().roomOf({ home: homeWith() });
  assert.strictEqual(got.root, null);
  assert.match(got.why, /~\/\.consonance\.json does not exist/);
  assert.match(got.why, /no checkout beside this file/);
});

// ── dataDirOf (moved here from jev-shadow-runner.js; now takes `home`) ──────────────────────────────────────────
test('dataDirOf: CONSONANCE_DATA wins over ~/.consonance.json', () => {
  assert.strictEqual(installed().dataDirOf({ CONSONANCE_DATA: '/fixture/env-data' }, homeWith({ data_dir: '/fixture/config-data' })), '/fixture/env-data');
});

test('dataDirOf: an installed copy reads data_dir from ~/.consonance.json', () => {
  assert.strictEqual(installed().dataDirOf({}, homeWith({ data_dir: '/fixture/config-data' })), '/fixture/config-data');
});

test('dataDirOf: no env and no config → null (judge mode then says so once and stays off)', () => {
  assert.strictEqual(installed().dataDirOf({}, homeWith()), null);
});

// ── disciplineDirOf (NEW: replaces `path.resolve(__dirname, '..', '..')` in jev-shadow.js and jev-shadow-runner.js) ─
test('disciplineDirOf: JEV_SHADOW_DISCIPLINE wins', () => {
  const got = installed().disciplineDirOf({ env: { JEV_SHADOW_DISCIPLINE: '/fixture/discipline' }, home: homeWith({ room_path: boot(room()) }) });
  assert.deepStrictEqual([got.dir, got.tier], ['/fixture/discipline', 'JEV_SHADOW_DISCIPLINE']);
});

test('disciplineDirOf: an installed copy uses the ROOM room_path names — where METHOD.md is', () => {
  const r = room();
  const got = installed().disciplineDirOf({ env: {}, home: homeWith({ room_path: boot(r) }) });
  assert.strictEqual(got.dir, r);
  assert.ok(fs.existsSync(path.join(got.dir, 'METHOD.md')));
});

test('disciplineDirOf: nothing resolves → dir null and a why that names the variable, the places tried and the fix', () => {
  const got = installed().disciplineDirOf({ env: {}, home: homeWith() });
  assert.strictEqual(got.dir, null);
  assert.match(got.why, /JEV_SHADOW_DISCIPLINE is unset/);
  assert.match(got.why, /~\/\.consonance\.json does not exist/);
  assert.match(got.why, /Fix: set room_path in ~\/\.consonance\.json/);
});

test('disciplineDirOf: a blank JEV_SHADOW_DISCIPLINE does not count as set', () => {
  const r = room();
  assert.strictEqual(installed().disciplineDirOf({ env: { JEV_SHADOW_DISCIPLINE: '  ' }, home: homeWith({ room_path: boot(r) }) }).dir, r);
});
