/* ambient-default-claim.test.js — the Settings tab must not tell a stranger a default it does not have.
 *
 * WHAT THIS EXISTS FOR, measured rather than supposed. On 2026-07-15 `1c47f7d` moved the ambient
 * fallback off the author's coordinates and onto the prime meridian, and wrote the reason into
 * `dev/shell/lib/ambient.js` in as many words: "A framework that defaults to its author's
 * coordinates ships the author's coordinates to every reader, and quietly gives every user a sky
 * that isn't theirs."
 *
 * ELEVEN DAYS LATER, `da83a4a` wrote a Settings note in `ui/index.html` naming the keeper's own
 * city as the blank default. Not stale-from-before — WRONG ON THE DAY IT WAS WRITTEN, and it
 * stayed wrong for six weeks. The fix landed in the code and never reached the sentence that
 * describes the code. That is the carrier class: the correction reaches the mechanism and not
 * its label.
 *
 * The generated consumer tree carried the line verbatim. `gen-consumer.js` has an IDENTITY leak
 * rule for exactly that city, anchored on the long form of the subdivision; the note used the
 * two-letter form, so the guard was inert against every live occurrence of the thing it names.
 * The counts and the paths are in the hand-back, which does not ship.
 *
 * TWO ASSERTIONS, and they fail differently on purpose:
 *   1. the note names no city at all. Holds in the private tree and the consumer tree alike, so
 *      it ships and keeps holding where nobody here can see it.
 *   2. the note agrees with the fallback the code actually implements. Needs `dev/`, which does
 *      not ship; guarded, and it says so rather than skipping quietly.
 *
 * Run: node consonance/tools/ambient-default-claim.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const INDEX = path.join(REPO, 'consonance', 'ui', 'index.html');
const AMBIENT = path.join(REPO, 'dev', 'shell', 'lib', 'ambient.js');

// The note under the ambient-location field, and nothing else on the page. Scoped deliberately:
// the `placeholder` attributes beside it say "Tokyo, Japan" and "Asia/Tokyo", which are correct
// precisely because they are examples belonging to nobody in this room.
function ambientNote() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const i = html.indexOf('ambient location');
  assert.ok(i > -1, 'the ambient-location field is gone from index.html; this test has lost its subject');
  const open = html.indexOf('<span class="settingsnote">', i);
  const close = html.indexOf('</span>', open);
  assert.ok(open > -1 && close > open, 'the ambient field has no settingsnote; re-anchor rather than deleting this test');
  return html.slice(open + '<span class="settingsnote">'.length, close);
}

// Anything shaped like a populated place: `Springfield, IL`, `Springfield, Illinois`, `Tokyo, Japan`.
// The two-letter subdivision is the form the defect actually took, and the form the leak scan missed.
const PLACE = /\b[A-Z][a-z]{2,}, ?(?:[A-Z]{2}\b|[A-Z][a-z]{2,}\b)/g;

test('the Settings note claims no city as the blank default', () => {
  const note = ambientNote();
  const hits = note.match(PLACE) || [];
  assert.deepStrictEqual(hits, [],
    'the shipped Settings note names a city as what a blank field falls back to: ' + hits.join(', ') +
    '\nA default is what every stranger gets. Naming one operator\'s city here hands it to all of them.');
});

test('the note agrees with the fallback the code implements', () => {
  if (!fs.existsSync(AMBIENT)) {
    // dev/ is not in gen-consumer's MANIFEST, so this half genuinely cannot run in a consumer
    // tree. Saying so beats a green that measured nothing -- and the absence is itself worth
    // reading: the tree ships the control and not the mechanism behind it.
    console.log('note: dev/shell/lib/ambient.js absent — agreement half NOT CHECKED in this tree');
    assert.ok(true);
    return;
  }
  const m = fs.readFileSync(AMBIENT, 'utf8').match(/const DEFAULT_LABEL = '([^']+)'/);
  assert.ok(m, 'ambient.js no longer declares DEFAULT_LABEL as a single-quoted literal; re-anchor this test');
  const place = m[1].split(/[\s(,]/)[0];          // 'Greenwich (no location set ...)' -> 'Greenwich'
  assert.ok(ambientNote().includes(place),
    'the Settings note does not name ' + place + ', which is where a blank field actually lands.\n' +
    'The note and the code disagree about the same default; one of them is lying to a stranger.');
});
