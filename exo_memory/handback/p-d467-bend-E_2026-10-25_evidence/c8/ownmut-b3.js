// ownmut-b3.js (D467, pane E): B3 alone, after row 35 was added: part 3 leaves the window out
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const root = 'C:/Users/nname/Downloads/t180-wt-e467', f = path.join(root, 'app/core/closejob.js');
const from = 'const moved = displacementOf(base, closed).reduce(', to = 'const moved = displacementOf(base, closed).filter((x) => !(edited || []).includes(x.piece)).reduce(';
const orig = fs.readFileSync(f, 'utf8'), lf = orig.split('\r\n').join('\n');
if (lf.split(from).length !== 2) { console.log('NOT APPLIED B3'); console.log('applied 0 / caught 0 / NOT APPLIED 1'); process.exit(0); }
fs.writeFileSync(f, (orig.includes('\r\n') ? lf.replace(from, () => to).split('\n').join('\r\n') : lf.replace(from, () => to)));
try {
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-name-pattern=row (21|25|26|28|29|34|35)\\b', path.join(root, 'app/test/sculpt-tools.test.js')], { cwd: root, encoding: 'utf8', timeout: 600000 });
  const failed = r.status !== 0 && /^# fail [1-9]/m.test(r.stdout);
  console.log((failed ? 'caught     ' : 'NOT CAUGHT ') + 'B3 part 3 leaves the window out  (' + ((/^# fail \d+/m.exec(r.stdout) || ['?'])[0]) + ')');
  console.log(`applied 1 / caught ${failed ? 1 : 0} / NOT APPLIED 0`);
} finally { fs.writeFileSync(f, orig); }
