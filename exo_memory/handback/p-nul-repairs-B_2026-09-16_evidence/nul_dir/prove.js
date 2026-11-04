// P-NUL-REPAIRS proof harness. Usage:
//   node prove.js capture <label>     run every probe against the CURRENT tool files, save outputs
//   node prove.js compare <a> <b>     byte-compare two captures
//   node prove.js control             run the discriminating probes against SPACE-separator mutants
// Writes only under this scratch dir. The data dir for essay-provenance is a frozen SNAPSHOT so live
// board traffic cannot move the output between the two captures.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const TOOLS = 'C:/Users/nname/Desktop/lighthouse/consonance/tools';
const SNAP = path.join(HERE, 'data-snapshot');
const NUL = String.fromCharCode(0);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

// A corpus whose arm labels contain SPACES, chosen so that joining a permutation with a space
// COLLIDES: ['a b','c','a','b c'] and ['a','b c','a b','c'] both join to "a b c a b c".
// Under a NUL separator they stay distinct; under a space they merge. That makes this fixture
// able to tell the separator's value apart — a fixture that cannot is a green test on anything.
const TSV = ['session\tt\tarm', 'S1\t1\ta b', 'S1\t2\tc', 'S1\t3\ta', 'S1\t4\tb c',
  'S2\t1\ta b', 'S2\t2\ta', 'S2\t3\tc', 'S2\t4\tb c'].join('\n') + '\n';
const LABELS = ['a b', 'c', 'a', 'b c'];

function probesFor(couplingFile, essayModuleFile) {
  const out = {};
  const fx = path.join(HERE, 'corpus.tsv');
  fs.writeFileSync(fx, TSV);
  for (const args of [['--json', '--seed', '1'], ['--seed', '1']]) {
    const r = spawnSync(process.execPath, [couplingFile, fx, ...args], { cwd: TOOLS });
    out[`coupling CLI ${args.join(' ')}`] = Buffer.concat([r.stdout || Buffer.alloc(0), Buffer.from('\n--stderr--\n'), r.stderr || Buffer.from(String(r.error || '')), Buffer.from(`\nexit ${r.status}`)]);
  }
  // direct: the exact reference set the separator deduplicates
  delete require.cache[require.resolve(couplingFile)];
  const ct = require(couplingFile);
  const arr = [...ct.allArrangements(LABELS, [[0, 1, 2, 3]])];
  out['coupling allArrangements'] = Buffer.from(JSON.stringify({ n: arr.length, arr }));
  // essay: the key function over pairs, including a path containing a space
  delete require.cache[require.resolve(essayModuleFile)];
  const ep = require(essayModuleFile);
  const full = 'a'.repeat(40);
  const keys = [[full, 'essay/x y.md'], [full, 'essay/x'], ['b'.repeat(40), 'y.md']].map(([f, p]) => ep.correctionKey(f, p));
  out['essay correctionKey'] = Buffer.from(JSON.stringify({ keys, distinct: new Set(keys).size }));
  return out;
}

function essayCli() {
  // In place: REPO_ROOT derives from __dirname, so the essay CLI must run from the real tools dir.
  const r = spawnSync(process.execPath, [path.join(TOOLS, 'essay-provenance.js'), '--json'],
    { cwd: TOOLS, env: { ...process.env, CONSONANCE_DATA: SNAP } });
  return Buffer.concat([r.stdout || Buffer.alloc(0), Buffer.from('\n--stderr--\n'), r.stderr || Buffer.from(String(r.error || '')), Buffer.from(`\nexit ${r.status}`)]);
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'capture') {
  const dir = path.join(HERE, 'cap-' + a);
  fs.mkdirSync(dir, { recursive: true });
  const outs = probesFor(path.join(TOOLS, 'coupling-test.js'), path.join(TOOLS, 'essay-provenance.js'));
  outs['essay CLI --json (snapshot data)'] = essayCli();
  for (const [k, v] of Object.entries(outs)) {
    fs.writeFileSync(path.join(dir, k.replace(/[^\w]+/g, '_') + '.out'), v);
    console.log(`${sha(v).slice(0, 16)}  ${String(v.length).padStart(7)} B  ${k}`);
  }
} else if (cmd === 'compare') {
  const A = path.join(HERE, 'cap-' + a), B = path.join(HERE, 'cap-' + b);
  let same = 0, diff = 0;
  for (const f of fs.readdirSync(A)) {
    const x = fs.readFileSync(path.join(A, f)), y = fs.readFileSync(path.join(B, f));
    const eq = Buffer.compare(x, y) === 0;
    eq ? same++ : diff++;
    console.log(`${eq ? 'IDENTICAL' : 'DIFFERS  '}  ${f}  (${x.length} B vs ${y.length} B)`);
  }
  console.log(`\n${same} identical, ${diff} differ`);
} else if (cmd === 'control') {
  // The separator's VALUE changed to a space, on copies. The discriminating probes must now DIFFER
  // from the 'before' capture, or they could not have caught a value change at all.
  const mdir = path.join(HERE, 'mutant');
  fs.mkdirSync(mdir, { recursive: true });
  for (const f of ['coupling-test.js', 'essay-provenance.js', 'actors.js']) {
    const src = path.join(TOOLS, f);
    if (!fs.existsSync(src)) continue;
    let t = fs.readFileSync(src);
    if (f !== 'actors.js') {
      const i = t.indexOf(0);
      if (i === -1) { console.log(`control: no NUL byte left in ${f} — run control BEFORE repairing`); process.exit(2); }
      t = Buffer.concat([t.subarray(0, i), Buffer.from(' '), t.subarray(i + 1)]);
    }
    fs.writeFileSync(path.join(mdir, f), t);
  }
  const outs = probesFor(path.join(mdir, 'coupling-test.js'), path.join(mdir, 'essay-provenance.js'));
  const before = path.join(HERE, 'cap-before');
  for (const [k, v] of Object.entries(outs)) {
    const f = path.join(before, k.replace(/[^\w]+/g, '_') + '.out');
    const eq = Buffer.compare(fs.readFileSync(f), v) === 0;
    console.log(`${eq ? 'SAME AS BEFORE (probe cannot see the separator)' : 'DIFFERS from before (probe sees the value)'}  ${k}`);
  }
} else {
  console.log('usage: capture <label> | compare <a> <b> | control');
}
