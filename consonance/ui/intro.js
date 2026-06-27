// The signal intro: three dissonant waves (distinct vantages) resolving into one
// consonant signal (confirmation, not a mirror). Canvas 2D, DPI-aware, ~60fps.
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let W, H, DPR;

function resize() {
  DPR = window.devicePixelRatio || 1;
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = Math.round(W * DPR);
  cv.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const AQUA = '#5EEAD4', AMBER = '#F2B880', TEXT = '#E6EAF2', MUTED = '#8893AD';
const DUR = 2600, HOLD = 1000, FADE = 520, TOTAL = DUR + HOLD + FADE;
const starts  = [[2.0, 0.4], [3.7, 2.1], [5.3, 4.0]];   // dissonant
const targets = [[2.0, 0.0], [4.0, 0.0], [6.0, 0.0]];   // harmonic 1:2:3, aligned
const amps = [1.0, 0.7, 0.5];

let t0 = null, finished = false;
const smooth = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

function finish() {
  if (finished) return;
  finished = true;
  window.location.href = 'app.html';
}
window.addEventListener('click', finish);

function spaced(text, cx, y, sp) {
  const widths = [...text].map(c => ctx.measureText(c).width + sp);
  let x = cx - (widths.reduce((a, b) => a + b, 0) - sp) / 2;
  ctx.textAlign = 'left';
  for (let i = 0; i < text.length; i++) { ctx.fillText(text[i], x, y); x += widths[i]; }
  ctx.textAlign = 'center';
}

function frame(ts) {
  if (t0 === null) t0 = ts;
  const el = ts - t0;
  const p = smooth(el / DUR);
  const fade = el > DUR + HOLD ? 1 - Math.min(1, (el - DUR - HOLD) / FADE) : 1;
  const y0 = H * 0.42, cx = W / 2, drift = el * 0.0014;
  const amp = Math.min(H * 0.10, 46);

  const bg = ctx.createRadialGradient(cx, y0, 0, cx, y0, Math.max(W, H) * 0.75);
  bg.addColorStop(0, '#121A2B');
  bg.addColorStop(1, '#0B0E14');
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = fade;

  const period = 1500;
  for (let k = 0; k < 3; k++) {
    const ph = ((el + k * period / 3) % period) / period;
    const r = ph * Math.min(W, H) * 0.55;
    ctx.beginPath();
    ctx.arc(cx, y0, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(94,234,212,${0.22 * (1 - ph)})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  const comps = starts.map((s, i) => [s[0] + (targets[i][0] - s[0]) * p, s[1] + (targets[i][1] - s[1]) * p]);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(94,234,212,0.16)';
  for (let i = 0; i < comps.length; i++) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const u = x / W;
      const y = y0 - amps[i] * Math.sin(2 * Math.PI * comps[i][0] * u + comps[i][1] + drift) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.save();
  ctx.shadowColor = AQUA;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = `rgba(94,234,212,${0.55 + 0.45 * p})`;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 2) {
    const u = x / W;
    let s = 0;
    for (let i = 0; i < comps.length; i++) s += amps[i] * Math.sin(2 * Math.PI * comps[i][0] * u + comps[i][1] + drift);
    const y = y0 - s * amp * 0.9;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  const R = Math.min(W, H) * 0.16;
  const scatter = [0.9, -1.3, 0.6];
  for (let k = 0; k < 3; k++) {
    const ang = (-Math.PI / 2 + k * 2 * Math.PI / 3) + (1 - p) * scatter[k] + Math.sin(el * 0.001 + k) * 0.04;
    const nx = cx + Math.cos(ang) * R, ny = y0 + Math.sin(ang) * R * 0.55;
    ctx.beginPath();
    ctx.arc(nx, ny, 4, 0, Math.PI * 2);
    ctx.fillStyle = k === 0 ? AMBER : AQUA;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.globalAlpha = fade * smooth((p - 0.55) / 0.45);
  ctx.fillStyle = TEXT;
  ctx.textAlign = 'center';
  ctx.save();
  ctx.shadowColor = 'rgba(94,234,212,0.40)';
  ctx.shadowBlur = 18;
  ctx.font = '300 40px "Segoe UI", system-ui, sans-serif';
  spaced('CONSONANCE', cx, H * 0.74, 8);
  ctx.restore();
  ctx.globalAlpha = fade * smooth((p - 0.72) / 0.28);
  ctx.fillStyle = MUTED;
  ctx.font = '400 13px "Segoe UI", system-ui, sans-serif';
  spaced('instances, in concert', cx, H * 0.80, 3);
  ctx.globalAlpha = 1;

  if (el >= TOTAL) finish();
  else if (!finished) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
