// cases-d490.js (C, D490): the prototype styles' own GLSL, for skypass.js (CASES_FILE=cases-d490.js): each style's patternSource from the tree's
// sky registry, drawn by the pass alone. aurora3's case is its half-resolution pass only (run skypass at 1280 x 720 for it); its full-resolution
// composite (the scale-up and the stars) is timed with it in harness.js's time mode, through the real renderer.
'use strict';
const path = require('path');
module.exports = () => {
  const SKY = require(path.join(process.env.T180_TREE, 'app', 'preview', 'sky', 'index.js'));
  return ['aurora', 'aurora1', 'aurora2', 'aurora3'].map((s) => [s === 'aurora3' ? 'aurora3 (its low-resolution pass only)' : s, 'aurora', SKY.patternSource(s)]);
};
