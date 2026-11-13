/* install-manifest.test.js — two static checks of dev/shell/install.ps1 that the critic added to Lap I (exo_memory/loop/landed_live_2026-11-13/
 * 00_critic.md, E1 :28-41 and E3 :56-64; ruled into the build, plan_room_stretch_2026-11-13.md:174-176). Both read the repo only: no install, no
 * settings.json, no machine.
 *
 * E1, THE CLOSURE: every literal relative `require` of a $files source resolves to a $files `To`. The recorded case is 2026-08-17, "Cannot find
 * module './blind.js'": board-digest.js required ./blind.js and blind.js was no manifest row until 8e85ff11 added it. I9 (a runtime rule on -Only)
 * cannot see that case, because it looks only at requires that are another row; a static check does, and runs in the suite.
 * E3, THE REASON: every non-Lib $files row has a $register row, or a `Wiring` field citing why it is installed and not registered. L0023 was two
 * hooks shipped in the file list with no registration, and nothing could tell "unregistered by design" from "registration forgotten".
 *
 * Run: node --test consonance/tools/install-manifest.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const L = require('./landed-live.js');

const REPO = process.env.LANDED_HISTORY_REPO || path.join(__dirname, '..', '..');
const show = (rev, p) => { const r = spawnSync('git', ['-C', REPO, 'show', `${rev}:${p}`], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 26 }); return r.status === 0 ? r.stdout : null; };
const normTo = (to) => String(to).replace(/\//g, '\\').toLowerCase();

/** E1: the requires of each $files source (read by `read(from)`) that resolve to no $files To. [{ from, to, wants }] */
function unmetRequires(installText, read) {
  const files = L.tables(L.blockLines(installText, 'files')).filter((x) => x.From && x.To);
  const tos = new Set(files.map((f) => normTo(f.To)));
  const out = [];
  for (const f of files) {
    const src = read(String(f.From).replace(/\\/g, '/'));
    if (src == null) continue;
    for (const want of L.requiresOf(src, f.To)) if (!tos.has(want)) out.push({ from: f.From, to: f.To, wants: want });
  }
  return out;
}
/** E3: non-Lib $files rows with no $register row (by leaf) and no `Wiring` reason. */
function unwired(installText) {
  const files = L.tables(L.blockLines(installText, 'files')).filter((x) => x.From && x.To);
  const reg = new Set(L.tables(L.blockLines(installText, 'register')).filter((x) => x.Rel).map((r) => String(r.Rel).split(/[\\/]/).pop().toLowerCase()));
  return files.filter((f) => !f.Lib && !reg.has(String(f.To).split(/[\\/]/).pop().toLowerCase()) && !(typeof f.Wiring === 'string' && /\S+:\d+/.test(f.Wiring)))
    .map((f) => String(f.To));
}

test('E1 (RED on the recorded case) at 8e85ff11^ board-digest.js requires ./blind.js and blind.js is no manifest row; at 8e85ff11 it is', { skip: spawnSync('git', ['-C', REPO, 'cat-file', '-e', '8e85ff11^{commit}']).status !== 0 && 'this checkout does not carry 8e85ff11' }, () => {
  const before = unmetRequires(show('8e85ff11^', 'dev/shell/install.ps1'), (p) => show('8e85ff11^', p));
  assert.deepStrictEqual(before.map((u) => `${u.to} -> ${u.wants}`), ['board-digest.js -> blind.js']);
  assert.deepStrictEqual(unmetRequires(show('8e85ff11', 'dev/shell/install.ps1'), (p) => show('8e85ff11', p)), []);
});

test('E1 every literal relative require of an installed source resolves to an installed file, today', () => {
  const text = fs.readFileSync(path.join(REPO, 'dev', 'shell', 'install.ps1'), 'utf8');
  const unmet = unmetRequires(text, (p) => { try { return fs.readFileSync(path.join(REPO, p), 'utf8'); } catch (_) { return null; } });
  assert.deepStrictEqual(unmet.map((u) => `${u.to} -> ${u.wants}`), []);
});

test('E1 the parse sees double-quoted requires and a require of a parent folder (the critic\'s probe took single quotes only)', () => {
  assert.deepStrictEqual(L.requiresOf("const a = require(\"./blind.js\"); const b = require('../lib/fresh-guard');", 'hooks\\x.js'), ['hooks\\blind.js', 'lib\\fresh-guard.js']);
});

test('E3 every installed file that no $register row runs carries a reason: a `Wiring` field citing path:line', () => {
  const text = fs.readFileSync(path.join(REPO, 'dev', 'shell', 'install.ps1'), 'utf8');
  assert.deepStrictEqual(unwired(text), [], 'installed with no registration and no reason on record (install.ps1 says a decision is owed for these, :1080-1086)');
});

test('E3 a row without its reason is caught; Lib rows and registered rows are not asked for one', () => {
  const fixture = "$files = @(\n  @{ From = 'a\\x.js'; To = 'x.js' }\n  @{ From = 'a\\y.js'; To = 'y.js'; Wiring = 'plan.md:12 - ruled off' }\n  @{ From = 'a\\z.js'; To = 'z.js'; Lib = $true }\n  @{ From = 'a\\w.js'; To = 'hooks\\w.js' }\n)\n$register = @(\n  @{ Event = 'Stop'; Rel = 'hooks\\w.js' }\n)\n";
  assert.deepStrictEqual(unwired(fixture), ['x.js']);
  assert.deepStrictEqual(unwired(fixture.replace("'a\\y.js'; To = 'y.js'; Wiring = 'plan.md:12 - ruled off'", "'a\\y.js'; To = 'y.js'; Wiring = 'because'")), ['x.js', 'y.js'], 'a reason must cite path:line');
});
