'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/app/test/core-close-mutation.test.js'; let s = fs.readFileSync(p, 'utf8');
const q = "'", bq = "\'";
for (const [a, b] of [[`Q10 the bank plan${q}s curvature`, `Q10 the bank plan${bq}s curvature`], [`the later piece${q}s first two points are not folded`, `the later piece${bq}s first two points are not folded`], [`(the window${q}s end, the seam)`, `(the window${bq}s end, the seam)`]]) {
  if (s.split(a).length !== 2) { console.log('not bare:', a.slice(0, 30)); continue; } s = s.replace(a, b);
}
fs.writeFileSync(p, s); console.log('apostrophes escaped');
