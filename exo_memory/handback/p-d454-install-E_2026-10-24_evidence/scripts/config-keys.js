// config-keys.js (D454 part 3, pane E): the keeper's ~/.consonance.json gains the two keys that keep this machine exactly as it is once the
// D454 defaults land: "chime_repos" (the three products release-chime chimes for today) and "scratch_dir" (the G: root scratch.js picks today).
// NOT RUN ON HIS FILE BY THE SEAT THAT WROTE IT: it is his config, and that write waits for his yes.
//   node config-keys.js                 dry run: writes the changed text to a scratch copy only, and prints the diff
//   node config-keys.js --apply         backs up to ~/.consonance.json.before-d454 (refuses if that exists), then writes the same change
// The change is TEXT: the two keys are inserted before the closing brace, in the file's own indent and line ending, so every other byte stays.
// A key already present is left exactly as it is. After writing, the file must parse and every other key must be unchanged, or the backup goes back.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const apply = process.argv.includes('--apply');
const live = path.join(os.homedir(), '.consonance.json');
const backup = live + '.before-d454';
const scratchCopy = path.join(__dirname, 'consonance.json.after-d454');
const ADD = { chime_repos: ['t180', 'consonance', 'lighthouse'], scratch_dir: 'G:\\consonance-scratch' };

const before = fs.readFileSync(live, 'utf8');
const cfg = JSON.parse(before.replace(/^\uFEFF/, ''));
const todo = Object.keys(ADD).filter((k) => !(k in cfg));
if (!todo.length) { console.log('both keys already present; nothing to do'); process.exit(0); }
const eol = before.includes('\r\n') ? '\r\n' : '\n';
const close = before.lastIndexOf('}');
if (close < 0) throw new Error('no closing brace');
const head = before.slice(0, close).replace(/\s+$/, ''), tail = before.slice(close);
const indent = (/\n([ \t]+)"/.exec(before) || [, '  '])[1];
const lines = todo.map((k) => indent + JSON.stringify(k) + ': ' + JSON.stringify(ADD[k]));
const after = head + (head.endsWith('{') ? '' : ',') + eol + lines.join(',' + eol) + eol + tail;

const parsed = JSON.parse(after.replace(/^\uFEFF/, ''));
for (const k of Object.keys(cfg)) if (JSON.stringify(parsed[k]) !== JSON.stringify(cfg[k])) throw new Error('key changed: ' + k);
for (const k of todo) if (JSON.stringify(parsed[k]) !== JSON.stringify(ADD[k])) throw new Error('key not added: ' + k);

const target = apply ? live : scratchCopy;
if (apply) { if (fs.existsSync(backup)) throw new Error('backup exists, refusing: ' + backup); fs.copyFileSync(live, backup); }
fs.writeFileSync(target, after);
const d = spawnSync('git', ['diff', '--no-index', '--', apply ? backup : live, target], { encoding: 'utf8' });
console.log((apply ? 'APPLIED to ' : 'dry run, written to ') + target + '; added: ' + todo.join(', '));
console.log(d.stdout.split('\n').filter((l) => /^[+-](?![+-])/.test(l)).join('\n'));
if (apply) {
  const re = JSON.parse(fs.readFileSync(live, 'utf8').replace(/^\uFEFF/, ''));
  for (const k of Object.keys(cfg)) if (JSON.stringify(re[k]) !== JSON.stringify(cfg[k])) { fs.copyFileSync(backup, live); throw new Error('re-read differs at ' + k + '; the backup was put back'); }
  console.log('re-read: parses, every other key unchanged; backup at ' + backup);
}
