// filmpage.js (pane E, 2026-11-13): the L185 re-film's mp4s and page from the two sides' frames.
// node filmpage.js <film dir with base/ and branch/>
// Refuses unless each side has 576 frames, none missing, and the two sides' capture lines (the run's stretches) agree.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const dir = process.argv[2];
const FF = 'C:/Users/nname/Downloads/always_returning/node_modules/ffmpeg-static/ffmpeg.exe';
const read = (side) => {
  const t = fs.readFileSync(path.join(dir, side, 'SIDE.txt'), 'utf8');
  const kv = {};
  for (const l of t.split(/\r?\n/)) { const m = l.match(/^(\w[\w ]*?)\s*=\s*(.*)$/); if (m) (kv[m[1]] = kv[m[1]] || []).push(m[2]); }
  return kv;
};
const base = read('base'), branch = read('branch');
for (const [n, s] of [['base', base], ['branch', branch]])
  if (!/^576 .*missing 0\)$/.test(s.frames[0])) { console.error(`REFUSED: ${n} frames: ${s.frames[0]}`); process.exit(5); }
const stretchLine = (s) => s.said.find((l) => /the straight from/.test(l)).replace(/^capture-lean: \S+; /, '');
if (stretchLine(base) !== stretchLine(branch)) { console.error('REFUSED: the replays differ:\n  ' + stretchLine(base) + '\n  ' + stretchLine(branch)); process.exit(5); }
for (const k of ['run', 'run dzr', 'run seed', 'run level', 'run recorded'])
  if (base[k][0] !== branch[k][0]) { console.error('REFUSED: ' + k + ' differs'); process.exit(5); }
const sb = base.commit[0], sr = branch.commit[0];
const meta = `before ${sb} | after ${sr} | ${base.run[0]} | seed ${base['run seed'][0]} level ${base['run level'][0]} | 144 frames a second`;
const made = [];
for (const st of ['straight', 'corner']) {
  const out = path.join(dir, `L185_${st}_before_after_144fps.mp4`);
  const r = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y',
    '-framerate', '144', '-i', path.join(dir, 'base', `film_${st}_%03d.png`),
    '-framerate', '144', '-i', path.join(dir, 'branch', `film_${st}_%03d.png`),
    '-filter_complex', '[0:v]scale=960:-2[a];[1:v]scale=960:-2[b];[a][b]hstack=inputs=2[v]', '-map', '[v]',
    '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '144',
    '-metadata', `comment=${meta}`, '-metadata', `title=L185 ${st}: before (left) and after (right)`, out], { encoding: 'utf8' });
  if (r.status !== 0) { console.error('ffmpeg failed: ' + r.stderr); process.exit(1); }
  for (const side of ['base', 'branch']) {
    const one = path.join(dir, `L185_${st}_${side === 'base' ? 'before' : 'after'}_full_144fps.mp4`);
    const q = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '144', '-i', path.join(dir, side, `film_${st}_%03d.png`),
      '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '144',
      '-metadata', `comment=${side === 'base' ? 'before ' + sb : 'after ' + sr} | ${base.run[0]} | 144 frames a second`, one], { encoding: 'utf8' });
    if (q.status !== 0) { console.error('ffmpeg failed: ' + q.stderr); process.exit(1); }
    made.push(path.basename(one));
  }
  made.push(path.basename(out));
}
console.log('made: ' + made.join(', '));
console.log('stretches (both sides): ' + stretchLine(base));
