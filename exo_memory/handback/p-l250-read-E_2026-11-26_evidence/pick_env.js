// pick_env.js N: prints a shell export line for layout N's track and layout (to be eval'd, never echoed into a file or a log)
const path = require('path'), fs = require('fs');
const src = fs.readFileSync(path.join(__dirname, 'key_census.js'), 'utf8'); const head = src.slice(0, src.indexOf('const sys = allKeys')); const m = { exports: {} };
const T = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
new Function('require', 'process', 'module', head + '\nmodule.exports = { listLayouts };')(require, { argv: ['', '', T] }, m);
const L = m.exports.listLayouts(T)[Number(process.argv[2]) - 1];
const q = (s) => "'" + s.replace(/'/g, "'\''") + "'";
process.stdout.write(`export T180_E_TRACK=${q(L.track)} T180_E_LAYOUT=${q(L.layout)}`);
