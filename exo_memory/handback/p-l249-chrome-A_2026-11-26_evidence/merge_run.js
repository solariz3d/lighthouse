// L249 merge (pane A): the touched tests once on the merged tip, then the before/after pictures and the page, in sequence. This process is set to
// below normal first, so all it starts inherits it; each heavy part runs under `heavy-run --run`. Logs beside this file; pictures and page into EV.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'); const { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const TREE = 'C:/Consonance/t180-wt-colours', BEFORE = 'C:/Consonance/t180-wt-l249-before', HERE = __dirname;
const EV = 'C:/Consonance/lighthouse/exo_memory/handback/p-l249-chrome-A_2026-11-26_evidence';
const HR = 'C:/Consonance/lighthouse/consonance/tools/heavy-run.js', LEFT = 'C:/Consonance/lighthouse/consonance/tools/leftovers.js';
const log = (s) => fs.appendFileSync(path.join(HERE, 'merge_run.log'), `${new Date().toISOString()} ${s}\n`);
const run = (name, args, opts = {}) => { const t = Date.now(); const r = spawnSync(process.execPath, args, { cwd: TREE, encoding: 'utf8', maxBuffer: 256 << 20, env: { ...process.env, ...(opts.env || {}) } }); fs.writeFileSync(path.join(HERE, `${name}.out`), (r.stdout || '') + (r.stderr || '')); log(`${name} exit ${r.status} in ${Math.round((Date.now() - t) / 1000)} s`); return r; };
const git = (a) => spawnSync('git', a, { cwd: TREE, encoding: 'utf8' }).stdout.trim();
log(`start tip ${git(['rev-parse', 'HEAD'])} status-lines ${git(['status', '--short']).split('\n').filter(Boolean).length}; before ${spawnSync('git', ['rev-parse', 'HEAD'], { cwd: BEFORE, encoding: 'utf8' }).stdout.trim()}`);
run('leftovers_before', [LEFT]);
run('tests_static', [HR, '--run', '--cmd', 'L249 A merge: theme + markwindow', '--', process.execPath, '--test', '--test-reporter=tap', 'app/test/theme.test.js', 'app/test/markwindow.test.js']);
run('tests_texture_page', [HR, '--run', '--cmd', 'L249 A merge: texture-page', '--', process.execPath, '--test', '--test-reporter=tap', 'app/test/texture-page.test.js']);
run('shots', [HR, '--run', '--cmd', 'L249 A merge: before/after shots', '--', process.execPath, path.join(HERE, 'l249_shots.js'), path.join(EV, 'shots')], { env: { BEFORE, AFTER: TREE } });
run('page', [path.join(HERE, 'l249_page.js'), path.join(EV, 'shots'), path.join(EV, 'chrome_before_after.html'), git(['rev-parse', '--short', 'HEAD'])]);
run('leftovers_after', [LEFT]);
log(`end tip ${git(['rev-parse', 'HEAD'])} status-lines ${git(['status', '--short']).split('\n').filter(Boolean).length}`);
