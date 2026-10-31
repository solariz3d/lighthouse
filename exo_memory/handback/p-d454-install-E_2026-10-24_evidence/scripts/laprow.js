// laprow.js (D454 part 3, pane E): lap-row's ledger by the app's rule. Step "test" adds the red row; step "fix" replaces the fixed path.
// Usage: node laprow.js <lighthouse worktree> test|fix
'use strict';
const fs = require('fs'), path = require('path');
const [root, step] = process.argv.slice(2);
function edit(rel, fn) {
  const f = path.join(root, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
  const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(rel + ': anchor found ' + n + ' times: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
  fn(rep, (b) => { s = s.replace(/\n*$/, '\n') + b; });
  fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}
if (step === 'test') edit('consonance/tools/lap-row.test.js', (rep, append) => append('\n' +
  '// D454 part 3 (pane E): the data dir by the app\'s rule (main.rs data_dir: data_dir from ~/.consonance.json when set, else %USERPROFILE%\\.consonance).\n' +
  '// README tells a new user to run `node consonance/tools/lap-row.js --report`; with no data_dir it read one machine\'s fixed ledger path instead.\n' +
  'test(\'APP RULE (D454): with CONSONANCE_DATA, LAP_LEDGER and data_dir unset, --report reads USERPROFILE/.consonance/lap.jsonl\', () => {\n' +
  '  const h = require(\'./scratch.js\').mkdtemp(\'lap-home-\');\n' +
  '  const env = { ...process.env, USERPROFILE: h, HOME: h }; delete env.CONSONANCE_DATA; delete env.LAP_LEDGER;\n' +
  '  let out = \'\'; try { out = execFileSync(NODE, [TOOL, \'--report\'], { env, encoding: \'utf8\', stdio: [\'ignore\', \'pipe\', \'pipe\'] }); } catch (e) { out = String(e.stdout || \'\') + String(e.stderr || \'\'); }\n' +
  '  assert.strictEqual(out.split(/\\r?\\n/)[0], \'lap-row - \' + path.join(h, \'.consonance\', \'lap.jsonl\'), out.slice(0, 300));\n' +
  '});\n'));
else if (step === 'fix') edit('consonance/tools/lap-row.js', (rep) => rep(
  "const DATA_DIR = process.env.CONSONANCE_DATA || fromConfig('data_dir') || 'C:\\\\Consonance\\\\data';\n",
  "// D454: the third step is the app's own (main.rs default_data, %USERPROFILE%\\.consonance), not one machine's fixed folder.\n" +
  "const DATA_DIR = process.env.CONSONANCE_DATA || fromConfig('data_dir') || path.join(os.homedir(), '.consonance');\n"));
else throw new Error('step is test or fix');
