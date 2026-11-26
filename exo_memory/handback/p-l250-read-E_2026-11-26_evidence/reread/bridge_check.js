// bridge_check.js <tree>: B's shipped groundUnder (src/reference/road.js) with a road deck over a start, at L's real start heights (pane E, L250 re-read)
const { groundUnder } = require(require('path').join(require('path').resolve(process.argv[2]), 'src/reference/road.js'));
const sq = (y) => ({ positions: new Float32Array([-10, y, -10, 10, y, -10, 10, y, 10, -10, y, 10]), indices: new Uint16Array([0, 2, 1, 0, 3, 2]) });
for (const [above, deck] of [[1.554, 5.0], [3.562, 5.0], [3.562, 5.5], [3.562, 6.0], [1.112, 3.0], [2.0, 4.5]]) {
  const g = groundUnder([sq(deck), sq(0)], [0, above, 0]);
  console.log(`start ${above} m above its road, a road deck ${deck} m above that road: groundUnder takes ${g}${g === deck ? '  <- the deck' : ''}`);
}
