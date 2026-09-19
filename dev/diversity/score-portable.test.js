// score-portable.test.js — D081 (night run N1, E). score-portable.mjs must differ from the hashed score.mjs ONLY in
// how it finds the repo root, and must produce byte-identical results.
//
//   node dev/diversity/score-portable.test.js            the fast checks (seconds): the only-change proof, the original's
//                                                        hash, and the root resolver's four cases
//   node dev/diversity/score-portable.test.js --run      ALSO runs both scorers once, side by side, and compares their
//                                                        results-step0.json byte for byte. 16-35 minutes EACH on D; they
//                                                        run concurrently. Needs DIVERSITY_EXTERNALS = a directory holding
//                                                        models/ (the gte encoder) and node_modules/ (@huggingface/transformers
//                                                        4.2.0) — see exo_memory/loop/diversity_c1/README.md. Writes only
//                                                        under DIVERSITY_RUN_DIR (default: the OS temp dir).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawn } = require('child_process');

const HERE = __dirname;
const ORIGINAL = path.join(HERE, 'score.mjs');
const PORTABLE = path.join(HERE, 'score-portable.mjs');
const ORIGINAL_SHA = '19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a';
const RESULTS_SHA = '60c7d726cf746cfb14cfa85bc71edbf6cd1911940f7317bbd617a028b212b1d0';
const OLD_LINE = "const REPO = 'C:/Users/nname/Desktop/lighthouse';\n";
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

let pass = 0, fail = 0;
const check = (name, fn) => {
  try { fn(); pass++; console.log('  ok   ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + '\n       ' + e.message); }
};
const assert = (c, m) => { if (!c) throw new Error(m); };

// The resolver block: from its marker comment to the end of the IIFE.
function resolverBlock(text) {
  const start = text.indexOf('// ── PORTABLE (D081)');
  const endMark = '})();\n';
  const end = text.indexOf(endMark, start);
  assert(start >= 0 && end > start, 'resolver block not found in score-portable.mjs');
  return { start, end: end + endMark.length, text: text.slice(start, end + endMark.length) };
}

// Evaluate the resolver on its own, with a chosen `here` and environment, using the real fs, path and git.
function resolve(hereDir, envValue) {
  const { text } = resolverBlock(fs.readFileSync(PORTABLE, 'utf8'));
  const body = text + '\nreturn REPO;';
  const fakeProcess = { env: envValue === undefined ? {} : { LIGHTHOUSE_REPO: envValue } };
  return new Function('fs', 'path', 'execFileSync', 'here', 'process', body)(fs, path, execFileSync, hereDir, fakeProcess);
}
const throws = (fn) => { try { fn(); } catch (e) { return e.message; } return null; };

const repoTop = execFileSync('git', ['-C', HERE, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();

console.log('score-portable — fast checks');

check('the hashed original is untouched (sha256 19c97ab5…)', () => {
  const got = sha(fs.readFileSync(ORIGINAL));
  assert(got === ORIGINAL_SHA, `score.mjs sha256 is ${got}`);
});

check('the ONLY difference is the repo-root line: put the old line back and the bytes are score.mjs', () => {
  const portable = fs.readFileSync(PORTABLE, 'utf8');
  const { start, end } = resolverBlock(portable);
  const restored = portable.slice(0, start) + OLD_LINE + portable.slice(end);
  assert(sha(Buffer.from(restored, 'utf8')) === ORIGINAL_SHA, 'restoring the old line does not reproduce score.mjs');
});

check('the portable file does not carry the hard-coded path anywhere', () => {
  assert(!fs.readFileSync(PORTABLE, 'utf8').includes('C:/Users/nname/Desktop/lighthouse'), 'the D path is still in it');
});

check('LIGHTHOUSE_REPO pointing at a checkout is used', () => {
  assert(resolve(os.tmpdir(), repoTop) === repoTop.replace(/\\/g, '/'), 'env root not returned');
});

check('LIGHTHOUSE_REPO pointing at a directory with no phase-window.js is REFUSED', () => {
  const m = throws(() => resolve(HERE, os.tmpdir()));
  assert(m && m.includes('has no dev/diversity/phase-window.js'), `expected a refusal, got ${m}`);
});

check('with no LIGHTHOUSE_REPO, the checkout the scorer sits in is found', () => {
  assert(resolve(HERE, undefined) === repoTop, `got ${resolve(HERE, undefined)}, want ${repoTop}`);
});

check('a git checkout that is NOT this repo (no dev/diversity/phase-window.js) is refused, not used', () => {
  const other = fs.mkdtempSync(path.join(os.tmpdir(), 'not-lighthouse-'));
  try {
    execFileSync('git', ['init', '-q', other]);
    const m = throws(() => resolve(other, undefined));
    assert(m && m.startsWith('no repo root'), `expected a refusal, got ${m === null ? 'a root: ' + resolve(other, undefined) : m}`);
  } finally { fs.rmSync(other, { recursive: true, force: true }); }
});

check('with no LIGHTHOUSE_REPO and no checkout around it, it THROWS — no fallback to any fixed path', () => {
  const m = throws(() => resolve(os.tmpdir(), undefined));
  assert(m && m.startsWith('no repo root'), `expected "no repo root", got ${m}`);
});

async function runBoth() {
  const ext = process.env.DIVERSITY_EXTERNALS;
  assert(ext && fs.existsSync(path.join(ext, 'models')) && fs.existsSync(path.join(ext, 'node_modules')),
    'DIVERSITY_EXTERNALS must name a directory with models/ and node_modules/');
  const base = fs.mkdtempSync(path.join(process.env.DIVERSITY_RUN_DIR || os.tmpdir(), 'score-portable-'));
  const stage = (name, scorer) => {
    const d = path.join(base, name);
    fs.mkdirSync(d);
    for (const f of ['s40-strip@5a2d3c0.cjs', 'PREREG-C1.txt', 'block-net.cjs']) fs.copyFileSync(path.join(HERE, f), path.join(d, f));
    fs.copyFileSync(scorer, path.join(d, path.basename(scorer)));
    for (const x of ['models', 'node_modules']) fs.symlinkSync(path.join(ext, x), path.join(d, x), 'junction');
    return d;
  };
  const run = (dir, file, env) => new Promise((ok) => {
    const t = Date.now();
    const p = spawn(process.execPath, ['--require', './block-net.cjs', file], { cwd: dir, env });
    let err = '';
    p.stdout.pipe(fs.createWriteStream(path.join(dir, 'out.txt')));
    p.stderr.on('data', (b) => { err += b; });
    p.on('close', (code) => { fs.writeFileSync(path.join(dir, 'err.txt'), err); ok({ code, secs: Math.round((Date.now() - t) / 1000), err }); });
  });
  const dO = stage('original', ORIGINAL), dP = stage('portable', PORTABLE);
  const envP = { ...process.env, LIGHTHOUSE_REPO: repoTop };
  const envO = { ...process.env }; delete envO.LIGHTHOUSE_REPO;
  console.log(`\nscore-portable — running both, concurrently, under ${base}`);
  const [o, p] = await Promise.all([run(dO, 'score.mjs', envO), run(dP, 'score-portable.mjs', envP)]);
  for (const [name, r, d] of [['original', o, dO], ['portable', p, dP]]) {
    const f = path.join(d, 'results-step0.json');
    const h = fs.existsSync(f) ? sha(fs.readFileSync(f)) : '(no results file)';
    const net = (r.err.match(/NETWORK_ATTEMPTS=\d+/) || ['NETWORK_ATTEMPTS=?'])[0];
    console.log(`  ${name.padEnd(8)} exit ${r.code}  ${r.secs}s  ${net}  results sha256 ${h}`);
  }
  check('both exit 0', () => assert(o.code === 0 && p.code === 0, `exit codes ${o.code} / ${p.code}`));
  check('both made no network attempt', () => assert(/NETWORK_ATTEMPTS=0\b/.test(o.err) && /NETWORK_ATTEMPTS=0\b/.test(p.err), 'a network attempt, or no count'));
  check('results-step0.json byte-identical between the two', () => {
    const a = fs.readFileSync(path.join(dO, 'results-step0.json')), b = fs.readFileSync(path.join(dP, 'results-step0.json'));
    assert(a.equals(b), 'the two results differ');
  });
  check('and equal to the registered result (sha256 60c7d726…)', () => {
    assert(sha(fs.readFileSync(path.join(dP, 'results-step0.json'))) === RESULTS_SHA, 'not the registered result');
  });
  check('stdout byte-identical between the two', () => {
    assert(fs.readFileSync(path.join(dO, 'out.txt')).equals(fs.readFileSync(path.join(dP, 'out.txt'))), 'stdout differs');
  });
}

(async () => {
  if (process.argv.includes('--run')) await runBoth();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
})();
