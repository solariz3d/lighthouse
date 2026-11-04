'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/test/core_close_banks_lap.test.js'; let s = fs.readFileSync(p, 'utf8'); const b = String.fromCharCode(92);
const o = 'about d+% past its smoothness limit at one point (pd+)/', n = `about ${b}d+% past its smoothness limit at one point ${b}(p${b}d+${b})/`;
if (s.split(o).length !== 2) throw new Error('anchor ' + (s.split(o).length - 1)); s = s.replace(o, n); fs.writeFileSync(p, s); console.log('regex fixed:', n);
