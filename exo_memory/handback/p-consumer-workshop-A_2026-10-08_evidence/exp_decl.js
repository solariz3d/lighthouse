// EXPERIMENT (reverted afterwards): the lap-3 WORKSHOP rows for the five, added to gen-consumer.js in a scratch edit.
const fs = require('fs'), f = 'C:/Users/nname/Desktop/worktrees/a-l3-wt/consonance/tools/gen-consumer.js';
let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const once = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) >= 0) throw new Error('not exactly once: ' + a.slice(0, 70)); s = s.replace(a, () => b); };
once("    'consonance/tools/shelf-tier.test.js': [[", `    /* D273 lap 3 (A): the five record-shaped members. corpus-age and second-vantage are PRODUCT instruments whose real-corpus rows are declared here and are
     * proved in the consumer by their synthetic twins (corpus-age.synthetic.test.js, second-vantage.history.test.js); librarian-notes and shelf-recursion declare the
     * rows that assert this room's populated record. corrections-gate is NOT here: its rows were red because the rewrite corrupted its regex (see CODE_KEPT). */
    'consonance/tools/corpus-age.test.js': [
      ["test('attic/ is excluded from the carried corpus — law 3, in both places', ", 'needs this room\\'s attic/; corpus-age.synthetic.test.js row 1 proves it on a built corpus'],
      ["test('referenced files are never proposed, whatever their age', ", 'needs this room\\'s loop/ with referenced files; corpus-age.synthetic.test.js row 3'],
      ["test('the batched age map returns exactly what the per-file git log returned', ", 'needs this room\\'s git history under loop/; corpus-age.synthetic.test.js row 7'],
      ["test('the by-name exclusions match the ones the shelf actually drops', ", 'asserts files under this room\\'s loop/run2/cells/; corpus-age.synthetic.test.js rows 1 and 8 hold both halves']],
    'consonance/tools/librarian-notes.test.js': [
      ["test('the notes directory exists in the repo and is not empty', ", 'asserts this room\\'s dated librarian notes exist'],
      ["test('the notes are actually tracked by git — the whole point of the move', ", 'asserts this room\\'s librarian notes are tracked']],
    'consonance/tools/second-vantage.test.js': [
      ["test('heads differ: claim-time AGREE means WORLD-MOVED, no surface', ", 'pins HEAD~1 of this room\\'s history; a consumer is one fresh commit; second-vantage.history.test.js rows 1 and 3'],
      ["test('heads differ: DISAGREE in both trees surfaces', ", 'pins HEAD~1 of this room\\'s history; second-vantage.history.test.js row 2']],
    'consonance/tools/shelf-recursion.test.js': [
      ["test('the fixture is real — there ARE nested .md files, or this whole suite proves nothing', ", 'needs this room\\'s nested registrations; corpus-age.synthetic.test.js row 2 builds its own'],
      ["test('the corpus total is non-zero and counts more than the flat read did', ", 'needs this room\\'s loop/; corpus-age.synthetic.test.js row 1'],
      ["test(\\"review()'s OWN rel resolves — not just the walk's\\", ", 'needs this room\\'s nested loop/ files; corpus-age.synthetic.test.js row 2']],
    'consonance/tools/shelf-tier.test.js': [[`);
fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s);
console.log('patched');
