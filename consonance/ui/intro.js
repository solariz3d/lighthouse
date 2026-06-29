// The signal intro: three dissonant waves (distinct vantages) resolving into one
// consonant signal (confirmation, not a mirror). Canvas 2D, DPI-aware, ~60fps.
// Lives as an overlay on the app (#intro-overlay) so the AudioContext belongs to
// the app's page and survives the visual fade — the audio breathes out past it.
const cv = document.getElementById('c');
if (!cv) { /* no intro on this page */ } else {
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

// Audio: same dissonance→consonance the waves do, in tones — but textured.
// Three voices at the visual's frequency ratios (starts at 220, 220×3.7/2,
// 220×5.3/2 Hz; glide to 220, 440, 660 — the 1:2:3 harmonic the waves resolve
// to). Each voice is a detuned stack of 3 oscillators (chorus/fatness), panned
// across the stereo field, behind a lowpass filter that opens as the
// dissonance resolves (muffled→clear), with slow attack envelopes so they
// swell in rather than punch. A sub at 110Hz for weight, a high shimmer at
// E5 for air, and a synthetic convolver reverb for space.
let audio = null;

// Tiny synthetic IR: white noise with exponential decay — basic plate-like reverb.
function makeReverbIR(ac, seconds, decay) {
  const rate = ac.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ac.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function startAudio() {
  if (audio) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    if (ac.resume) ac.resume().catch(() => {});
    const now = ac.currentTime;
    const dur = DUR / 1000, hold = HOLD / 1000, fade = FADE / 1000;

    // Master bus — dry path
    const master = ac.createGain();
    master.gain.value = 0.075;
    master.connect(ac.destination);

    // Parallel reverb bus
    const reverb = ac.createConvolver();
    reverb.buffer = makeReverbIR(ac, 1.5, 2.2);
    const revGain = ac.createGain();
    revGain.gain.value = 0.40;
    reverb.connect(revGain).connect(ac.destination);

    const allOscs = [];

    // Sub at 110Hz — quiet, slow swell, adds weight without muddying the fundamental.
    // No scheduled fade-out: sustains at peak so stopAudio's graceful breath has signal
    // to fade from (the visual is an overlay now, audio outlasts it).
    const sub = ac.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 110;
    const subG = ac.createGain();
    subG.gain.setValueAtTime(0, now);
    subG.gain.linearRampToValueAtTime(0.45, now + 0.9);
    sub.connect(subG).connect(master);
    sub.start(now);
    // stop scheduled far out — stopAudio will stop earlier when it fades
    sub.stop(now + dur + hold + fade + 5.0);
    allOscs.push(sub);

    // Three voices, each a 3-osc detuned stack, lowpass-filtered, panned.
    const fStart = [220, 220 * 3.7 / 2.0, 220 * 5.3 / 2.0];
    const fEnd   = [220, 440, 660];
    const peak   = [0.55, 0.35, 0.28];
    const pan    = [0, -0.32, 0.32];
    const detune = [-8, 0, 8]; // cents — chorus width per voice

    fStart.forEach((f0, i) => {
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 0.65;
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.linearRampToValueAtTime(2800, now + dur);

      const env = ac.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(peak[i], now + 1.0);

      const panner = ac.createStereoPanner();
      panner.pan.value = pan[i];

      detune.forEach((cents) => {
        const osc = ac.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f0, now);
        osc.frequency.linearRampToValueAtTime(fEnd[i], now + dur);
        osc.detune.value = cents;
        osc.connect(filter);
        osc.start(now);
        osc.stop(now + dur + hold + fade + 5.0); // stopAudio will end earlier
        allOscs.push(osc);
      });

      filter.connect(env).connect(panner);
      panner.connect(master);
      panner.connect(reverb);
    });

    // Shimmer — fifth harmonic of A4 ish (E5), very slow fade-in, sits high.
    // No scheduled fade-out; stopAudio drives the breath.
    const shimmer = ac.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 660; // E5, matches voice-3's target — reinforces the resolution
    const shimG = ac.createGain();
    shimG.gain.setValueAtTime(0, now);
    shimG.gain.linearRampToValueAtTime(0.06, now + 1.6);
    shimmer.connect(shimG).connect(master);
    shimG.connect(reverb);
    shimmer.start(now);
    shimmer.stop(now + dur + hold + fade + 5.0);
    allOscs.push(shimmer);

    // No scheduled master/revGain fade — stopAudio handles the breath-out so the
    // audio outlasts the overlay's visual fade and decays gracefully as the app appears.

    audio = { ac, oscs: allOscs, master, revGain };
  } catch (e) { /* silent fallback — audio is decoration, not required */ }
}

// Graceful breath-out: master gain rolls down over ~1.5s while the reverb tail
// decays for another ~0.5s past that. Overlapping the overlay's 800ms CSS fade
// so the audio is still going when the app becomes visible underneath.
function stopAudio() {
  if (!audio) return;
  try {
    const { ac, oscs, master, revGain } = audio;
    const now = ac.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.5);
    if (revGain) {
      revGain.gain.cancelScheduledValues(now);
      revGain.gain.setValueAtTime(revGain.gain.value, now);
      revGain.gain.linearRampToValueAtTime(0, now + 2.0);
    }
    oscs.forEach(o => { try { o.stop(now + 2.1); } catch (e) {} });
    setTimeout(() => { try { ac.close(); } catch (e) {} }, 2300);
  } catch (e) {}
  audio = null;
}

// Fades the overlay out via CSS (revealing the app underneath) AND begins the
// long audio breath-out. Audio context persists in this page — the reverb tail
// keeps decaying as the user starts using the app.
function finish() {
  if (finished) return;
  finished = true;
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    overlay.classList.add('fading');
    // remove from DOM after the CSS transition completes
    setTimeout(() => { try { overlay.remove(); } catch (e) {} }, 900);
  }
  stopAudio();
}
cv.addEventListener('click', finish);

function spaced(text, cx, y, sp) {
  const widths = [...text].map(c => ctx.measureText(c).width + sp);
  let x = cx - (widths.reduce((a, b) => a + b, 0) - sp) / 2;
  ctx.textAlign = 'left';
  for (let i = 0; i < text.length; i++) { ctx.fillText(text[i], x, y); x += widths[i]; }
  ctx.textAlign = 'center';
}

function frame(ts) {
  if (t0 === null) { t0 = ts; startAudio(); }
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
}  // end of: if (cv) — no intro on pages without #c canvas
