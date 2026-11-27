// resetcheck678.js (pane B, D678): is dropping layHold's reset of the width's first two control points equivalent? extend.js patched IN MEMORY (no file written),
// then ripple268w.js run on the patched module: its 110 rows' width (knots + w) against the unpatched repair's (r268_b-hold.json), and the largest control-point
// difference in steps of DEC.w. usage: node resetcheck678.js <tree> <out.json>
'use strict';
const path = require('path'), fs = require('fs'), Module = require('module');
const T = path.resolve(process.argv[2]), EXT = path.join(T, 'src/core/extend.js');
const LINE = 'w[0] = Number(h.from.v.toFixed(dec)) + 0; w[1] = Number((h.from.v + (h.from.m * K0) / 3).toFixed(dec)) + 0;';
const src = fs.readFileSync(EXT, 'utf8'); if (src.split(LINE).length !== 2) throw new Error('the reset line is not in extend.js exactly once');
const m = new Module(EXT, null); m.filename = EXT; m.paths = Module._nodeModulePaths(path.dirname(EXT)); m._compile(src.replace(LINE, ''), EXT); m.loaded = true; require.cache[EXT] = m;
process.argv = [process.argv[0], path.join(__dirname, 'ripple268w.js'), T, process.argv[3]];
require('./ripple268w.js');
