// one lock hold: the debug build the window run launches (our own target dir, a copy of C's warm one)
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D251 handle precision debug build for the window run' });
const S = path.resolve(__dirname, '..'), W = 'C:/Users/nname/Desktop/worktrees/a-precision-wt/', env = { ...process.env, PATH: 'C:/Users/nname/.cargo/bin' + path.delimiter + process.env.PATH, CARGO_TARGET_DIR: path.join(S, 'ui', 'target'), FORCE_COLOR: '0' };
const t0 = Date.now(), r = spawnSync('cargo', ['tauri', 'build', '--debug', '--no-bundle'], { cwd: W + 'src-tauri', encoding: 'utf8', env, maxBuffer: 1 << 28, shell: false });
const t = (r.stdout || '') + (r.stderr || ''); fs.writeFileSync(path.join(__dirname, 'build.log'), t);
console.log('exit', r.status, 'secs', Math.round((Date.now() - t0) / 1000)); console.log(t.split('\n').filter((l) => /Finished|Built application|error/.test(l)).slice(0, 8).join('\n'));
