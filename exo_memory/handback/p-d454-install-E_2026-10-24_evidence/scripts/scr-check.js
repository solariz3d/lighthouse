// scr-check.js (D454 part 3, pane E): scratch.js's root on this machine: old code on his config, new code on his config, new code on a copy with scratch_dir
'use strict';
const path = require('path'), fs = require('fs');
const N = require('C:/Users/nname/Downloads/lh-wt-d454-e/consonance/tools/scratch.js'), O = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/scratch.js');
const e = { ...process.env }; delete e.CONSONANCE_SCRATCH;
const copy = path.join(__dirname, 'cfg-home');
console.log('copy has scratch_dir:', JSON.parse(fs.readFileSync(path.join(copy, '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')).scratch_dir);
console.log('old code, his config       :', O.scratchRoot(e));
console.log('new code, his config as is :', N.scratchRoot(e));
console.log('new code, + scratch_dir key:', N.scratchRoot({ ...e, USERPROFILE: copy, HOME: copy }));
