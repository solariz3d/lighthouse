'use strict';
// patch3.js (D473): one banked piece reads "its turn"
const fs = require('fs'), W = 'C:/Users/nname/Downloads/t180-wt-e473/';
function patch(rel, from, to) { const f = W + rel, raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n'); if (s.split(from).length !== 2) throw new Error(rel + ': ' + from); s = s.replace(from, () => to); fs.writeFileSync(f, s.split('\n').join('\r\n')); console.log('patched', rel); }
patch('app/core/coreshell.js', "toFixed(1)}° into their turns; the route", "toFixed(1)}° into \${banked.length === 1 ? 'its turn' : 'their turns'}; the route".replace(/\\$/g, '$'));
patch('app/test/core-bank-lap.test.js', "° into their turns; the route did not move", "° into (its turn|their turns); the route did not move");
