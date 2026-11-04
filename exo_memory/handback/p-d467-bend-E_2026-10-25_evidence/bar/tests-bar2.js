// tests-bar2.js (D467 re-ruled, pane E): row 30 gains the hand-placed start; row 32, the close runner posts the bar. CRLF kept; each anchor once.
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/Downloads/t180-wt-e467/app/test/sculpt-tools.test.js';
const raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n');
const once = (from, to) => { const n = s.split(from).length - 1; if (n !== 1) throw new Error(`anchor found ${n} times: ${from.slice(0, 80)}`); s = s.replace(from, () => to); };
once("  assert.equal(CJ.barMiss({ ...curved, closed: false }, curved, { base: curved, edited: all }), null, 'a lap that had no start straight cannot lose one');\n",
  "  assert.equal(CJ.barMiss({ ...curved, closed: false }, curved, { base: curved, edited: all }), null, 'a lap that had no start straight cannot lose one');\n" +
  "  const placed = require('../../src/core/document.js').setSpawns(curved, { line: { along: 100 }, grid: { count: 6, rowGapM: 16, colGapM: 6 } });\n" +
  "  assert.equal(CJ.barMiss({ ...base, closed: false }, placed, { base, edited: all }), null, 'a start placed by hand needs no straight');\n");
s = s.replace(/\n*$/, '\n') + `
test('row 32 (D467 bar): the close runner hands the worker the bar a start-pieces try asks for, and no bar when none is asked', () => {
  const { createCloseRunner } = require('../core/closerunner.js');
  const posted = [];
  function FakeWorker() { this.postMessage = (m) => posted.push(m); this.terminate = () => {}; }
  const runner = createCloseRunner({ WorkerCtor: FakeWorker });
  const bar = { base: { pieces: [] }, edited: [2] };
  runner.start({ doc: { pieces: [] }, window: [0, 5], bar }).promise.catch(() => {});
  assert.deepEqual(posted[0].bar, bar, 'the bar rides in the message');
  runner.start({ doc: { pieces: [] }, window: [2] }).promise.catch(() => {});
  assert.ok(!('bar' in posted[1]), 'no bar asked: none sent, so every other job\\'s message is what it was');
});
`;
fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s);
console.log('written');
