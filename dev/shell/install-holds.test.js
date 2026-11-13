/* install-holds.test.js — Lap I, I7 (exo_memory/loop/landed_live_2026-11-13/00_lap_i_spec.md:416-461, with its second reader's changes, :852-857):
 * a ruled hold is installer DATA that the installer honours, with a date it ends on.
 *
 * The recorded hold: "NOT installed, on purpose: dispatch-gate, carrier-drift-watch" at the 09-21 install on D (loop/install_D_2026-09-21.md:14),
 * renewed by K3 on 2026-11-13 until 2026-11-27 (loop/plan_room_stretch_2026-11-13.md:167). Before I7 a bare run on D copied both files and ADDED
 * their registrations, dispatch-gate.js among them; the hold lived only in a hand-back. Every run below uses a THROWAWAY repo (a copy of the
 * branch's dev/shell and consonance/hooks) and a THROWAWAY USERPROFILE, as install-only.test.js does; nothing touches ~/.claude.
 * The second reader's points, taken: the -Check report's DECLARED NOT REGISTERED list says HELD too; a clock seam (CONSONANCE_INSTALL_NOW); the
 * tests assert the HOLD EXPIRED LINE, never -Check's exit code (it is 1 on D for other reasons).
 * Run: node --test dev/shell/install-holds.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..', '..');
const tmp = require('../../consonance/tools/scratch.js').mkdtemp('installholds-');
let seq = 0;
function mkRepo() {
  const root = path.join(tmp, 'repo' + (++seq));
  for (const rel of ['dev/shell/lib', 'dev/shell/hooks', 'consonance/hooks', 'dev/shell']) {
    const from = path.join(REPO, ...rel.split('/')), to = path.join(root, ...rel.split('/'));
    fs.mkdirSync(to, { recursive: true });
    for (const e of fs.readdirSync(from, { withFileTypes: true })) if (e.isFile() && (rel !== 'dev/shell' || /\.(ps1|py|js)$/.test(e.name))) fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
  }
  return { root, script: path.join(root, 'dev', 'shell', 'install.ps1') };
}
function mkHome() {
  const home = path.join(tmp, 'home' + (++seq));
  fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(home, '.claude', 'settings.json'), JSON.stringify({ hooks: {} }, null, 2));
  return home;
}
function run(repo, home, args, machine, now) {
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', repo.script, ...(args || [])], {
    encoding: 'utf8', windowsHide: true, timeout: 180000,
    env: { ...process.env, USERPROFILE: home, CONSONANCE_MACHINE: machine, ...(now ? { CONSONANCE_INSTALL_NOW: now } : {}) },
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
const commands = (home) => { const h = JSON.parse(fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8')).hooks || {}; const out = []; for (const ev of Object.keys(h)) for (const g of [].concat(h[ev] || [])) for (const k of [].concat(g.hooks || [])) if (k.command) out.push(`${ev} ${k.command}`); return out; };
const registered = (home, leaf) => commands(home).some((c) => new RegExp(`[\\\\/]${leaf.replace(/\./g, '\\.')}"?$`, 'i').test(c));
const installed = (home, leaf) => fs.existsSync(path.join(home, '.claude', 'shell', leaf));
const HELD = ['dispatch-gate.js', 'carrier-drift-watch.js'];
const RULING = /plan_room_stretch_2026-11-13\.md:167/;
const skip = process.platform !== 'win32' && 'install.ps1 is Windows PowerShell';

test('I7 (RED FIRST) a BARE run on D neither copies nor registers the two held hooks, and says HELD with the ruling and the date', { skip }, () => {
  const repo = mkRepo(), home = mkHome();
  const r = run(repo, home, [], 'D', '2026-11-13T12:00:00');
  for (const leaf of HELD) {
    assert.ok(!installed(home, leaf), `${leaf} was copied on machine D\n${r.out.slice(-1500)}`);
    assert.ok(!registered(home, leaf), `${leaf} was registered on D: ${JSON.stringify(commands(home))}`);
    assert.match(r.out, new RegExp(`HELD\\s+${leaf.replace(/\./g, '\\.')}: .*until 2026-11-27`), leaf);
  }
  assert.match(r.out, RULING);
  assert.ok(installed(home, path.join('hooks', 'session-start.js')), 'everything else installs as before');
});

test('I7 the same bare run on L copies and registers them: the hold names D only', { skip }, () => {
  const repo = mkRepo(), home = mkHome();
  const r = run(repo, home, [], 'L', '2026-11-13T12:00:00');
  assert.ok(installed(home, 'dispatch-gate.js'), r.out.slice(-800));
  assert.ok(registered(home, 'dispatch-gate.js'));
  assert.ok(registered(home, 'carrier-drift-watch.js'));
});

test('I7 -Check on D prints HELD in place of ABSENT and of DECLARED NOT REGISTERED', { skip }, () => {
  const repo = mkRepo(), home = mkHome();
  const r = run(repo, home, ['-Check'], 'D', '2026-11-13T12:00:00');
  for (const leaf of HELD) {
    const e = leaf.replace(/\./g, '\\.');
    assert.match(r.out, new RegExp(`HELD\\s+${e}: .*until 2026-11-27`), leaf);
    assert.doesNotMatch(r.out, new RegExp(`ABSENT\\s+\\S*${e}`), `${leaf} is not reported ABSENT`);
    // the list runs from its own header to the next count header ("  N REGISTERED, NOT DECLARED", "  N HELD BY A DATED HOLD", ...)
    const dnr = (r.out.split(/\d+ DECLARED, NOT REGISTERED[^\n]*\n/)[1] || '').split(/\n\s+\d+ [A-Z]/)[0];
    assert.ok(!new RegExp(e).test(dnr), `${leaf} is not in the DECLARED, NOT REGISTERED list:\n${dnr}`);
  }
});

test('I7 an EXPIRED hold: -Check prints HOLD EXPIRED (the line, not the exit code), and a bare run still writes nothing for it', { skip }, () => {
  const repo = mkRepo(), home = mkHome();
  const c = run(repo, home, ['-Check'], 'D', '2026-11-28T09:00:00');
  for (const leaf of HELD) assert.match(c.out, new RegExp(`HOLD EXPIRED\\s+${leaf.replace(/\./g, '\\.')}`), leaf);
  const r = run(repo, home, [], 'D', '2026-11-28T09:00:00');
  for (const leaf of HELD) { assert.ok(!installed(home, leaf), `${leaf} copied after expiry`); assert.ok(!registered(home, leaf), `${leaf} registered after expiry`); }
  assert.match(r.out, /HOLD EXPIRED\s+dispatch-gate\.js/);
});

test('I7 every Lib row says which hooks need it (By), and each named hook is a $files row', () => {
  const L = require('../../consonance/tools/landed-live.js');
  const t = fs.readFileSync(path.join(REPO, 'dev', 'shell', 'install.ps1'), 'utf8');
  const files = L.tables(L.blockLines(t, 'files')).filter((x) => x.From && x.To);
  const leaves = new Set(files.map((f) => String(f.To).split(/[\\/]/).pop().toLowerCase()));
  const libs = files.filter((f) => f.Lib);
  assert.strictEqual(libs.length, 7, 'the seven Lib rows');
  for (const f of libs) {
    assert.ok(typeof f.By === 'string' && f.By.trim(), `${f.To} has By`);
    for (const b of f.By.split(',').map((x) => x.trim().toLowerCase())) assert.ok(leaves.has(b), `${f.To}: By names ${b}, which is a $files row`);
  }
});
