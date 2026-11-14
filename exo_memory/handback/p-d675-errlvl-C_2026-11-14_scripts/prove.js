// prove.js <old build.bat> <new build.bat>: render/build.bat's three red lines, old against new, on the file itself.
// Each copy has its three program lines (cmake configure, cmake --build, dz-view --selftest) replaced by stubs that exit
// %C1%, %C2%, %C3%; everything else runs as written. For each step, a crash code (0xC0000005 = -1073741819) and a plain
// 1 are put on that step alone; what the copy prints and its exit code are recorded.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [, , oldBat, newBat] = process.argv;
const N = '\r\n';
const stubbed = (src) => {
  let s = fs.readFileSync(src, 'utf8');
  const lines = [
    ['  cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_RUNTIME_OUTPUT_DIRECTORY="%~dp0bin"', '  cmd /c exit %C1%'],
    ['cmake --build build' + N, 'cmd /c exit %C2%' + N],
    ['  bin\\dz-view.exe --selftest', '  cmd /c exit %C3%'],
  ];
  for (const [a, b] of lines) { if (s.split(a).length !== 2) throw new Error(`${src}: ${a}`); s = s.replace(a, () => b); }
  return s;
};
for (const [label, src] of [['old', oldBat], ['new', newBat]]) {
  const dir = path.join(__dirname, 'run-' + label);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'build.bat'), stubbed(src));
  for (const step of [1, 2, 3]) for (const code of ['-1073741819', '1', '0']) {
    if (code === '0' && step > 1) continue;   // all zeros once
    const env = { ...process.env, C1: '0', C2: '0', C3: '0' };
    env['C' + step] = code;
    const r = spawnSync('cmd', ['/c', path.join(dir, 'build.bat'), 'selftest'], { env, encoding: 'utf8', windowsHide: true });
    const said = (r.stdout + r.stderr).split(/\r?\n/).filter((l) => /BUILD|SELFTEST/.test(l)).map((l) => l.trim()).join(' / ');
    console.log(`${label}  ${code === '0' ? 'all steps 0         ' : `step ${step} exits ${code.padEnd(11)}`}  exit ${String(r.status).padEnd(2)}  ${said}`);
  }
}
