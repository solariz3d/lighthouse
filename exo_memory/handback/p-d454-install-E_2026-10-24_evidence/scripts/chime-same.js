// chime-same.js (D454 part 3, pane E): this machine's chime decisions, HEAD's release-chime against D454's, on an exact copy of the keeper's
// ~/.consonance.json (in a scratch home; his file is only read). Audio stubbed (CONSONANCE_CHIME_STUB), ledger in scratch (CONSONANCE_DATA), so
// nothing plays and nothing of his is written. For each push and release below: did it chime, and the ledger row's kind/decision/repo.
//   node chime-same.js <old release-chime.js> <new release-chime.js>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const [oldHook, newHook] = process.argv.slice(2);
const PUSH = (repo) => `To https://github.com/solariz3d/${repo}.git\n   a1b2c3d..e4f5a6b  main -> main\n`;
const CASES = [
  ['push t180-track-builder', 'git push origin main', PUSH('t180-track-builder')],
  ['push consonance', 'git push origin main', PUSH('consonance')],
  ['push lighthouse', 'git push origin main', PUSH('lighthouse')],
  ['push dotfiles', 'git push origin main', PUSH('dotfiles')],
  ['release t180', 'gh release create v1', 'https://github.com/solariz3d/t180-track-builder/releases/tag/v1\n'],
];
function runAll(hook) {
  const out = [];
  for (const [name, command, text] of CASES) {
    const root = fs.mkdtempSync(path.join(__dirname, 'chime-same-')), home = path.join(root, 'home'), data = path.join(root, 'data'), stub = path.join(root, 'stub.jsonl');
    fs.mkdirSync(home); fs.copyFileSync(path.join(os.homedir(), '.consonance.json'), path.join(home, '.consonance.json'));
    const payload = { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command }, tool_response: { stdout: text, stderr: '', exit_code: 0, interrupted: false }, cwd: root, session_id: 's1' };
    const r = spawnSync(process.execPath, [hook], { input: JSON.stringify(payload), encoding: 'utf8', timeout: 15000,
      env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: home, HOME: home, CONSONANCE_DATA: data, CONSONANCE_CHIME_STUB: stub } });
    const chimes = fs.existsSync(stub) ? fs.readFileSync(stub, 'utf8').split('\n').filter(Boolean).length : 0;
    const rows = fs.existsSync(path.join(data, 'release-chime.jsonl')) ? fs.readFileSync(path.join(data, 'release-chime.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { const j = JSON.parse(l); return [j.kind, j.decision, j.repo].join('/'); }) : [];
    out.push(`${name}: exit ${r.status} stdout ${JSON.stringify(r.stdout)} chimes ${chimes} ledger ${rows.join(',') || '-'}`);
    fs.rmSync(root, { recursive: true, force: true });
  }
  return out;
}
const a = runAll(oldHook), b = runAll(newHook);
for (let i = 0; i < a.length; i++) console.log((a[i] === b[i] ? 'same  ' : 'DIFF  ') + a[i] + (a[i] === b[i] ? '' : '   |   new: ' + b[i]));
console.log(a.join('\n') === b.join('\n') ? 'RESULT: the same on this machine\'s config' : 'RESULT: DIFFERENT');
