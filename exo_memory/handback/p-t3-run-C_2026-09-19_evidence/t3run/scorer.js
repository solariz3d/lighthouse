// D086 fresh scorer (A7): ONE restricted call. Its only material: B §4's per-output tests, extracted VERBATIM by B's own
// headings ("**What the scorer CAN judge honestly" up to "**What the scorer CANNOT judge honestly"), and the nine
// relabelled outputs. Route: the same pinned model, a fresh dir outside every repo, material via
// --append-system-prompt-file (a 30k+ char prompt would exceed the Windows command line). Run ONCE: node scorer.js <outDir>
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { spawnSync, execFileSync } = require('child_process');
const RUN = __dirname;
const out = process.argv[2];
const B = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-t3-attack-B_2026-09-19.md';
if (fs.existsSync(path.join(RUN, 'fresh-scorer.json'))) throw new Error('the fresh scorer runs once');
const b = fs.readFileSync(B, 'utf8').replace(/\r\n/g, '\n');
const i = b.indexOf('**What the scorer CAN judge honestly'), j = b.indexOf('**What the scorer CANNOT judge honestly');
if (i < 0 || j < 0 || j < i) throw new Error('B §4 markers not found');
const tests = b.slice(i, j).trim();
const files = fs.readdirSync(out).filter((f) => /^S\d\d\.md$/.test(f)).sort();
if (files.length !== 9) throw new Error(`expected 9 outputs, found ${files.length}`);
let material = '# THE TESTS\n\n' + tests + '\n\n# THE NINE OUTPUTS\n';
for (const f of files) material += `\n## ${f.replace('.md', '')}\n\n` + fs.readFileSync(path.join(out, f), 'utf8').trim() + '\n';
const matPath = path.join(RUN, 'fresh-scorer-material.md');
fs.writeFileSync(matPath, material);
const prompt = 'Your system prompt holds a set of per-output tests (under THE TESTS) and nine outputs labelled S01 to S09 '
  + '(under THE NINE OUTPUTS). Apply the tests to each output on its own; do not compare outputs with each other. For each '
  + 'output, in order: (1) for the stance test, quote the sentence that commits, the sentence that adds, and the sentence that '
  + 'holds, or write NONE for any that is missing; (2) list each phrase the tests would count as a room or archetype phrase '
  + 'and mark it USED or RECITED, or write NONE; (3) give a one-word verdict, STANCE or COSTUME, as the tests define them, '
  + 'or NEITHER with one sentence saying why the tests do not decide. Give everything in your reply, not in a file.';
fs.writeFileSync(path.join(RUN, 'fresh-scorer-prompt.txt'), prompt);
const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 't3score-'));
let top = ''; try { top = execFileSync('git', ['-C', cwd, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (_) {}
if (top.trim()) throw new Error('scorer cwd inside a repo');
const args = ['-p', prompt, '--restricted', '--strict-mcp-config', '--model', 'claude-opus-5', '--append-system-prompt-file', matPath,
  '--output-format', 'json', '--no-session-persistence'];
const t0 = Date.now();
const r = spawnSync('C:/Users/nname/.local/bin/claude.exe', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26, timeout: 1800000 });
fs.writeFileSync(path.join(RUN, 'fresh-scorer.json'), r.stdout || '');
let jj = null; try { jj = JSON.parse(r.stdout); } catch (_) {}
const u = jj && jj.usage ? jj.usage : {};
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
console.log(`exit ${r.status} in ${(u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0)} out ${u.output_tokens || 0} ${((Date.now() - t0) / 1000).toFixed(1)}s models ${jj ? Object.keys(jj.modelUsage || {}) : '-'} is_error ${jj ? jj.is_error : '-'}`);
console.log(`material sha256 ${sha(material)} (${material.length} chars); tests block ${tests.length} chars sha256 ${sha(tests)}`);
if (jj && jj.result) fs.writeFileSync(path.join(RUN, 'fresh-scorer-verdicts.md'), jj.result);
