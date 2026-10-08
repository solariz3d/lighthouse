// consumer-fork-wiring.test.js — the fork hook is WIRED: a generated consumer tree carries the fork note at all three sites and the
// relabel table applied (D273 lap 3, item 6, pane C).
//
//   node --test consonance/tools/consumer-fork-wiring.test.js
//
// consumer-relabel.test.js proves the rule on the dev text. This proves the rule reaches the OUTPUT: gen-consumer.js sets
// FORK_HOOK.apply with one line, and a hook that is defined but never called looks exactly like a working one from the rule's side.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const G = require('./gen-consumer.js');
const R = require('./consumer-relabel.js');

const REPO = path.resolve(__dirname, '..', '..');
const count = (t, s) => t.split(s).length - 1;

test('gen-consumer has the fork hook wired (FORK_HOOK.apply is set at load)', () => {
  assert.equal(typeof G.FORK_HOOK.apply, 'function', 'FORK_HOOK.apply is not set: the require/call line in gen-consumer.js is missing');
});

test('a generated tree carries the fork note at all three sites, naming HEAD, and the relabel table applied', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-consumer-fork-'));
  try {
    const r = G.build(out, { allowDirty: true });
    assert.ok(!r.refused, 'refused: ' + r.refused);
    assert.deepEqual(r.leaks, [], 'a leak in the forked output');
    const read = (rel) => fs.readFileSync(path.join(out, rel), 'utf8');
    const [sha, date] = execFileSync('git', ['-C', REPO, 'log', '-1', '--format=%h %cs'], { encoding: 'utf8' }).trim().split(' ');

    // sites 1 and 2: the room a clone wakes into (exo_memory/BOOT.md) and the installer's (SEED), each at both shipped paths
    for (const rel of ['exo_memory/BOOT.md', 'consonance/src-tauri/brief/BOOT.md', 'exo_memory/SEED.md', 'consonance/src-tauri/brief/SEED.md']) {
      const t = read(rel);
      assert.equal(count(t, R.FORK_MARKER), 1, `${rel}: the fork note should appear once`);
      assert.equal(count(t, R.FORK_END), 1, `${rel}: the note's end marker should appear once`);
      assert.ok(t.indexOf(R.FORK_MARKER) < t.indexOf(R.FORK_END));
      assert.ok(t.includes(`up to ${date} (lighthouse \`${sha}\``), `${rel}: the note does not name the commit it was generated from`);
    }
    // site 3: the app's header cuts the note out of the BUNDLED brief BOOT (main.rs fork_section), so that file must be bundled
    const conf = JSON.parse(read('consonance/src-tauri/tauri.conf.json'));
    assert.equal(conf.bundle.resources['brief/BOOT.md'], 'BOOT.md', 'the brief BOOT is not bundled: the header site would find no note');

    // the relabel table: every registered role site reads the new wording in the output, and its old wording is gone
    let edits = 0;
    for (const [rel, site] of Object.entries(R.SITES)) {
      const t = read(rel);
      for (const [find, replace] of site.rows) {
        assert.ok(t.includes(replace), `${rel}: the relabel did not reach the output: ${replace.slice(0, 70)}`);
        if (!replace.includes(find)) assert.ok(!t.includes(find), `${rel}: the role wording survived into the output: ${find.slice(0, 70)}`);
        edits += 1;
      }
      if (site.forkAfter) edits += 1;
    }
    assert.equal(r.forked, edits, 'report.forked is not the number of edits the table registers');
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
