// stick2.js (a copy of stick.js for the take-off pop clip: 200 px a metre so the 2.15 m hunter fits, and a dot on each toe joint) <before zz_joints.txt> <after zz_joints.txt> <section stop|run> <out.mp4> <ffmpeg> [slow from to]
// The drawn hunter's joints from gait_pose (dumped by a temporary probe), seen from the side: before (main) on the left,
// after (the branch) on the right, the floor a line, the right leg lighter. Real time at 60 frames a second (every 4th
// tick of 240); with "slow" the ticks from..to again one a frame at 30 frames a second (8 times slower).
'use strict';
const fs = require('fs'), { spawn } = require('child_process');
const [, , fa, fb, section, out, ff, slow, s0, s1] = process.argv;
const read = (f) => fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/)).filter((p) => p[0] === section)
  .map((p) => ({ tick: +p[1], speed: +p[2], j: Array.from({ length: (p.length - 3) / 3 }, (_, k) => [+p[3 + 3 * k], +p[4 + 3 * k], +p[5 + 3 * k]]) }));
const A = read(fa), B = read(fb);
const n = Math.min(A.length, B.length);
const W = 640, H = 540, PW = 2 * W;
// joints: Eye Head Neck Chest Pelvis ShoulderL ElbowL WristL HandL ShoulderR ElbowR WristR HandR HipL KneeL AnkleL ToeL HipR KneeR AnkleR ToeR
const bones = [[1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 7], [7, 8], [3, 9], [9, 10], [10, 11], [11, 12], [4, 13], [13, 14], [14, 15], [15, 16], [4, 17], [17, 18], [18, 19], [19, 20]];
const right = new Set([9, 10, 11, 12, 17, 18, 19, 20]);
const scale = 200;   // pixels a metre
const toPx = (v, panel) => [panel * W + W / 2 + v[2] * scale, H - 60 - v[1] * scale];   // z forward to the right, y up
function frame(a, b) {
  const img = Buffer.alloc(PW * H * 3, 24);
  const put = (x, y, c) => { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= PW || y >= H) return; const o = (y * PW + x) * 3; img[o] = c[0]; img[o + 1] = c[1]; img[o + 2] = c[2]; };
  const disc = (x, y, r, c) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) put(x + dx, y + dy, c); };
  const seg = (p, q, c) => { const d = Math.max(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1]), 1); for (let i = 0; i <= d; i++) disc(p[0] + (q[0] - p[0]) * i / d, p[1] + (q[1] - p[1]) * i / d, 3, c); };
  for (let panel = 0; panel < 2; panel++) {
    const yf = H - 60;
    for (let x = panel * W + 20; x < panel * W + W - 20; x++) put(x, yf, [120, 120, 120]);
    for (let y = 0; y < H; y++) put(W, y, [70, 70, 70]);
    // a mark at the standing pelvis height, to read the hips' rise and fall against
    const s = (panel ? b : a);
    const pel = toPx(s.j[4], panel), standY = H - 60 - 0.98 * scale;
    for (let x = panel * W + 40; x < panel * W + 120; x++) put(x, standY, [90, 60, 60]);
    for (const [i, k] of bones) seg(toPx(s.j[i], panel), toPx(s.j[k], panel), right.has(k) ? [235, 235, 235] : [140, 170, 220]);
    disc(pel[0], pel[1], 6, [230, 120, 90]);
    for (const t of [16, 20]) { const q = toPx(s.j[t], panel); disc(q[0], q[1], 7, t === 20 ? [255, 210, 80] : [120, 220, 255]); }
    // the speed as a bar along the top, 0 to 12.6 m/s
    for (let x = 0; x < (W - 40) * Math.min(s.speed / 12.6, 1); x++) for (let y = 12; y < 18; y++) put(panel * W + 20 + x, y, [200, 200, 90]);
  }
  return img;
}
const ticks = [];
for (let i = 0; i < n; i += 4) ticks.push([i, 60]);
const p = spawn(ff, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${PW}x${H}`, '-r', '60', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', out], { windowsHide: true, stdio: ['pipe', 'inherit', 'inherit'] });
(async () => {
  const write = (buf) => new Promise((r) => { if (!p.stdin.write(buf)) p.stdin.once('drain', r); else r(); });
  for (const [i] of ticks) await write(frame(A[i], B[i]));
  if (slow === 'slow') for (let i = +s0; i <= Math.min(+s1, n - 1); i++) { const f = frame(A[i], B[i]); await write(f); await write(f); }   // one tick, two 60 fps frames: 8x slower
  p.stdin.end();
})();
p.on('close', (c) => console.log(`stick: ${out} (${ticks.length} frames real time${slow === 'slow' ? `, ticks ${s0}-${s1} slowed` : ''}), ffmpeg exit ${c}`));
