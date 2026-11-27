// hcheck.js: the height channel h along the road for the five documents of render265b.js (the same code; required, not copied)
const path = require('path'), Module = require('module');
const T = process.argv[2], SCRIPT = process.argv[3];
// reuse render265b.js's part 1 by loading it with a stub for the page part: run only its document code
const src = require('fs').readFileSync(SCRIPT, 'utf8').split('// ── PART 2: the page ──')[0] + `
  const R = (x) => Math.round(x * 1e4) / 1e4, hs = (d, a, b) => { const v = []; for (let s = a; s <= b; s += 1) v.push(at(d, 'h', s)); return { min: R(Math.min(...v)), max: R(Math.max(...v)), spread: R(Math.max(...v) - Math.min(...v)) }; };
  for (const [k, d] of Object.entries({ base, ...DOCS })) console.log(k.padEnd(8), 'h over the turn (200-440)', JSON.stringify(hs(d, LO, HI)), ' h 150-490', JSON.stringify(hs(d, 150, 490)), ' h at 230/260/290/320', [230, 260, 290, 320].map((s) => R(at(d, 'h', s))).join(' '));
})();`;
const m = new Module(SCRIPT, null); m.filename = SCRIPT; m.paths = Module._nodeModulePaths(path.dirname(SCRIPT));
process.argv = [process.argv[0], SCRIPT, T, require('os').tmpdir() + '/hcheck-unused', require('os').tmpdir() + '/hcheck-unused-raw'];
m._compile(src.replace("fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(RAW, { recursive: true });", '').replace(/const J = JSON\.parse[\s\S]*?console\.log\(JSON\.stringify\(out\.measured\), 'same as committed:', out\.check\.same\);/, ''), SCRIPT);
