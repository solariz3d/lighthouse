// testadd.js <worktree>: append the GATES.md pointer rows to the two hooks' tests (D273 lap 2, C).
'use strict';
const fs = require('fs'), path = require('path'), W = process.argv[2];
const SG = `
// D273 (the consumer): every SOURCES refusal names GATES.md, at the path it has on this machine.
test('D273: each deny names GATES.md section 1, at the path it is given; an allow carries no pointer', () => {
  const p = 'C:/repo/consonance/GATES.md';
  for (const text of ['no sources line here', 'x\\nSOURCES:\\nNEXT: librarian x when y', 'x\\nSOURCES: C:/never/opened.md\\nNEXT: librarian x when y']) {
    const d = G.decide(text, [], 'C:/work', 'L.jsonl', 'abc', 'ring', p);
    assert.strictEqual(d.decision, 'deny', text);
    assert.ok(d.reason.includes('How this gate works and why: ' + p + ', section 1 (SOURCES).'), d.reason);
  }
  assert.ok(G.decide('no sources line here', [], 'C:/work').reason.includes(G.GATES_REL), 'the default names the repo-relative file');
  assert.strictEqual(G.decide('x\\nSOURCES: none (no state claims)', [], 'C:/work', 'L', 'a', 'ring', p).reason, '');
});
test('D273: gatesDocFrom resolves <repo>/consonance/GATES.md from room_path when the file is there, and names it relative otherwise', () => {
  const room = path.join('C:', 'r', 'exo_memory', 'BOOT.md'), want = path.join('C:', 'r', 'consonance', 'GATES.md');
  assert.strictEqual(G.gatesDocFrom(room, (p) => p === want), want);
  assert.strictEqual(G.gatesDocFrom(room, () => false), G.GATES_REL + ' (in the Consonance repository)', 'a missing file is not named as if it were there');
  assert.strictEqual(G.gatesDocFrom(path.join('C:', 'rooms', 'mine', 'CLAUDE.md'), () => true), G.GATES_REL + ' (in the Consonance repository)', 'a room outside a repo');
  assert.strictEqual(G.gatesDocFrom('', () => true), G.GATES_REL + ' (in the Consonance repository)');
  assert.strictEqual(G.gatesDocFrom(room, () => { throw new Error('EACCES'); }), G.GATES_REL + ' (in the Consonance repository)', 'an error checking the file falls back, never throws');
});
`;
const RS = `
// D273 (the consumer): the reply slot's block names GATES.md section 2, at the path the hook resolved.
test('D273: the block reason names GATES.md section 2 at the path it is given, and the default when none is', () => {
  const t = KEEPER_TURN(...readCall('t1', 'C:/work/a.md'));
  const given = R.verdict({ reply: 'Done at C:/work/zzz.md, 3 of 5.', entries: t, stopHookActive: false, live: true, seat: 'librarian', gates: 'C:/repo/consonance/GATES.md' });
  assert.ok(given.output && given.output.reason.endsWith('How this works and why: C:/repo/consonance/GATES.md, section 2 (the reply slot).'), given.output && given.output.reason);
  const dflt = R.verdict({ reply: 'Done at C:/work/zzz.md, 3 of 5.', entries: t, stopHookActive: false, live: true, seat: 'librarian' });
  assert.ok(dflt.output.reason.includes('consonance/GATES.md, section 2'), dflt.output.reason);
});
`;
for (const [rel, add] of [['consonance/hooks/sources-gate.test.js', SG], ['consonance/hooks/reply-slot.test.js', RS]]) {
  const f = path.join(W, rel), t = fs.readFileSync(f, 'utf8');
  if (t.includes('D273')) throw new Error(rel + ' already has the D273 rows');
  fs.writeFileSync(f, t.replace(/\s*$/, '\n') + add); console.log('appended', rel);
}
