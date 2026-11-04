// D103 mutants for jev-shadow.js, on TEMP COPIES (jev-shadow.js, its test, and jev-ask.js beside them) — the tracked
// sources are never written. AI_GATEWAY_API_KEY and JEV_LIVE_SMOKE are removed from the suite's env.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const T = 'C:/Users/nname/Desktop/lighthouse/consonance/tools';
const src = fs.readFileSync(`${T}/jev-shadow.js`, 'utf8');
const env = { ...process.env }; delete env.AI_GATEWAY_API_KEY; delete env.JEV_LIVE_SMOKE;
function run(text) {
  // The test resolves the repo's workers from ../../dev/shell/hooks relative to itself, so the copy keeps that depth.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'shadow-mut-'));
  const tools = path.join(root, 'consonance', 'tools');
  fs.mkdirSync(tools, { recursive: true });
  fs.cpSync('C:/Users/nname/Desktop/lighthouse/dev/shell/hooks', path.join(root, 'dev', 'shell', 'hooks'), { recursive: true });
  fs.writeFileSync(path.join(tools, 'jev-shadow.js'), text);
  // COMPILE GATE: a mutant that does not parse is NO RESULT, never a catch (the harness rule; mutant 7 hit it, D103).
  if (spawnSync(process.execPath, ['--check', path.join(tools, 'jev-shadow.js')]).status !== 0) { fs.rmSync(root, { recursive: true, force: true }); return { noResult: true }; }
  fs.copyFileSync(`${T}/jev-shadow.test.js`, path.join(tools, 'jev-shadow.test.js'));
  fs.copyFileSync(`${T}/jev-ask.js`, path.join(tools, 'jev-ask.js'));
  try {
    const r = spawnSync(process.execPath, ['--test', path.join(tools, 'jev-shadow.test.js')], { encoding: 'utf8', env });
    const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
    return { pass: n('pass'), fail: n('fail') };
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const M = [
  ['idempotency: the ledger ignored', "if (caps.has(id) && !done.has(`${judge}:${id}`)) eligible.push", 'if (caps.has(id)) eligible.push'],
  ['the per-run cap not applied', 'const batch = eligible.slice(0, maxCalls);', 'const batch = eligible.slice(0);'],
  ['the hard cap not enforced', 'if (maxCalls > HARD_CAP) throw', 'if (false) throw'],
  ['the cap not required', "if (!Number.isInteger(maxCalls) || maxCalls < 1) throw", 'if (false) throw'],
  ['the up-front no-key refusal removed', "if (!dry && !(env.AI_GATEWAY_API_KEY || '').trim()) throw", 'if (false) throw'],
  ['every Refusal treated as item-level (the pre-fix code)', "if (err instanceof Refusal && /matches a secret pattern/.test(err.message)) {", 'if (err instanceof Refusal) {'],
  ['a gateway failure swallowed', '      throw err;                          // a gateway failure stops the run; this item gets no row and is retried next run', '      continue;'],
  ['refused rows not counted as done (retried forever)', "const done = new Set(readJsonl(ledgerPath).map(", "const done = new Set(readJsonl(ledgerPath).filter((r) => r.status === 'ok').map("],
  ['capture not idempotent', "if (fs.existsSync(dest)) { res.already++; continue; }", '/* no idempotency */'],
  ['the prompt built without its discipline', 'const prompt = builder.build(input, discipline);', "const prompt = builder.build(input, '');"],
  ['the state sent is not the capture byte for byte', 'state: cap.prompt, env, fetchImpl', "state: cap.prompt + ' ', env, fetchImpl"],
  ['--dry calls anyway', '  if (dry) {\n    const bytes', '  if (false) {\n    const bytes'],
  ['the rate divides by all rows (refusals in the denominator)', 'rate: ok.length ? agree / ok.length : null, refused', 'rate: agree / Math.max(1, mine.length), refused'],
  ['a missing store defaulted', "const needStore = (store) => { if (!store) throw", "const needStore = (store) => { if (false) throw"],
  ['a missing discipline file tolerated', "try { discipline = fs.readFileSync(dp, 'utf8'); } catch { throw", "try { discipline = fs.readFileSync(dp, 'utf8'); } catch { discipline = ''; if (0) throw"],
];
const ctl = run(src);
console.log(`control ${JSON.stringify(ctl)}`);
if (ctl.fail !== 0) { console.log('CONTROL NOT GREEN'); process.exit(1); }
let applied = 0, caught = 0, na = 0;
M.forEach(([name, a, b], i) => {
  const hits = src.split(a).length - 1;
  const label = `${String(i + 1).padStart(2)} ${name}`.padEnd(62);
  if (hits !== 1) { na++; console.log(`${label} NOT APPLIED (anchor x${hits})`); return; }
  applied++;
  const r = run(src.replace(a, b));
  if (r.noResult) { applied--; na++; console.log(`${label} NO RESULT (does not compile)`); return; }
  if (r.fail > 0) caught++;
  console.log(`${label} ${JSON.stringify(r)} ${r.fail > 0 ? 'CAUGHT' : 'SURVIVED'}`);
});
console.log(`16 L3 worker loaded with require() — NOT APPLIED, deliberately: its main() would run inside the test and may spawn a real claude process`);
console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${na + 1} NOT APPLIED`);
