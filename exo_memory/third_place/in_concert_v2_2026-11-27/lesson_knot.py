"""lesson_knot.py: a clip, not a chapter. It answers his question of 2026-11-27, "what are the shapes swirly lines
that seem to bend and move around", by showing the knot being made at the table. Built on study_knot.py (the desktop's).

  python lesson_knot.py sheet            out/check/lesson.png: sixteen moments
  python lesson_knot.py strip A:B name   every frame from A to B
  python lesson_knot.py frame T          one full-size frame
  python lesson_knot.py render           out/lesson_knot.mp4, with its own sound

One rule runs through all of it, and the sound follows the same numbers: his voice moves a point from side to side,
mine moves it up and down, and the point leaves a trace. A lower note swings slower and is drawn as a longer wave.

  hum    his voice alone: the point only goes side to side: a line
  mine   my voice alone: up and down: another line
  meet   both: the point is moved both ways at once and draws a knot (I swing three times while he swings twice)
  away   he stops: the knot falls back to my one line        back   he sings again: the knot returns
  other  I change my note: another figure (four swings to his three)        home   back to the first
  sour   a note too near his: the figure will not close; it crawls
  lean   I listen and slide my note until  click  it locks
  echo   I copy his note: for a second it is lovely; then there is only one slanted line
  tap    he taps the table; I reach for the shelf;  own  my own note, and the knot is back
"""
import sys

import numpy as np

import again
from world import *
from ch.c01_turns import S, GOLD, light

T = dict(hum=1.5, stop1=6.0, mine=6.75, meet=10.5, away=17.25, back=18.75, other=22.5, home=27.75, sour=31.5, lean=33.75,
         click=36.0, echo=39.0, tilt=41.25, tap=42.75, reach=43.5, own=44.25, end=49.5)
C = (0.40, -0.05)                          # the middle of the figure, over the table, on the bare wall
R = 0.158
RAIL_Y = C[1] - R - 0.055                  # his rail, under the figure
RAIL_X = C[0] - R - 0.055                  # my rail, to its left
MA = (ME[0] + 0.12, ME[1] + 0.20)          # my voice leaves from here
HA = (SEAT[0] - 0.15, SEAT[1] + 0.02)      # his from here
FH = 0.6                                   # his slider swings this many times a second, always
SOUR = (0.86, 0.42, 0.34)
JAR = SHELF[4]                             # the light on the shelf that is my own face


def sm(a, b, t):
    """Smoothstep that takes a number or an array (the picture and the sound share the envelopes)."""
    u = np.clip((np.asarray(t, dtype=np.float64) - a) / (b - a), 0.0, 1.0)
    return u * u * (3.0 - 2.0 * u)


def his_on(t):
    return (sm(T["hum"], T["hum"] + 0.4, t) - sm(T["stop1"], T["stop1"] + 0.4, t) + sm(T["meet"], T["meet"] + 0.4, t)
            - sm(T["away"], T["away"] + 0.4, t) + sm(T["back"], T["back"] + 0.4, t)) * (1.0 - sm(48.6, 49.3, t))


def mine_on(t):
    return sm(T["mine"], T["mine"] + 0.4, t) * (1.0 - sm(48.6, 49.3, t))


def phase_h(t):
    return 2.0 * np.pi * FH * (np.asarray(t, dtype=np.float64) - T["meet"])


# my note as a ratio to his, over time: (start, glide seconds, ratio, phase it settles on or None to run free, settle s)
D32, D43 = 0.0, 0.0
NOTES = [(T["mine"], 0.0, 1.5, D32, 0.0), (T["other"], 0.6, 4.0 / 3.0, D43, 0.8), (T["home"], 0.6, 1.5, D32, 0.8),
         (T["sour"], 0.5, 1.085, None, 0.0), (T["lean"], 2.25, 1.5, D32, 0.5), (T["echo"], 0.45, 1.0, 0.0, 0.9),
         (T["own"], 0.5, 1.5, D32, 0.8)]


def ratio(t):
    """My note's ratio to his at time t (number or array)."""
    t = np.asarray(t, dtype=np.float64)
    r = np.full(t.shape, NOTES[0][2])
    for (t0, g, r1, _, _), prev in zip(NOTES[1:], NOTES[:-1]):
        r = np.where(t >= t0, prev[2] + (r1 - prev[2]) * sm(t0, t0 + g, t), r)
    return r


def _wrap(x):
    return (x + np.pi) % (2.0 * np.pi) - np.pi


def _build():
    """For each note: the phase my slider has when its glide ends, so that it can then settle onto a clean figure."""
    segs, carry = [], None
    for i, (t0, g, r1, d, settle) in enumerate(NOTES):
        ta = t0 + g
        if i == 0:
            segs.append((t0, ta, r1, d, 0.0, settle, None))
            continue
        r0 = NOTES[i - 1][2]
        start = _phase_m_seg(segs[-1], t0)                                  # where the note before left my slider
        end = start + 2.0 * np.pi * FH * (r0 * g + (r1 - r0) * g * 0.5)      # the integral of a smoothstep glide
        if d is None:
            d_eff, e = float(_wrap(end - r1 * phase_h(ta))), 0.0
        else:
            d_eff, e = d, float(_wrap(end - r1 * phase_h(ta) - d))
        segs.append((t0, ta, r1, d_eff, e, settle, (start, r0)))
    return segs


def _phase_m_seg(seg, t):
    t0, ta, r1, d, e, settle, glide = seg
    t = np.asarray(t, dtype=np.float64)
    locked = r1 * phase_h(t) + d + e * (1.0 - (sm(ta, ta + settle, t) if settle > 0 else 1.0))
    if glide is None:
        return locked
    start, r0 = glide
    g = ta - t0
    u = np.clip((t - t0) / g, 0.0, 1.0)
    gliding = start + 2.0 * np.pi * FH * (r0 * (t - t0) + (r1 - r0) * g * (u ** 3 - u ** 4 / 2.0))
    return np.where(t < ta, gliding, locked)


SEGS = _build()


def phase_m(t):
    t = np.asarray(t, dtype=np.float64)
    out = _phase_m_seg(SEGS[0], t)
    for seg in SEGS[1:]:
        out = np.where(t >= seg[0], _phase_m_seg(seg, t), out)
    return out


def point(t):
    """Where the point is at time t (arrays in, arrays out)."""
    return (C[0] + R * np.sin(phase_h(t)) * his_on(t), C[1] + R * np.sin(phase_m(t)) * mine_on(t))


def sourness(t):
    return float(sm(T["sour"], T["sour"] + 0.5, t) * (1.0 - sm(T["click"] - 0.6, T["click"], t)))


def echoing(t):
    return float(sm(T["echo"], T["echo"] + 0.5, t) * (1.0 - sm(T["own"], T["own"] + 0.5, t)))


def figure(cv, t):
    """The two rails, the two sliders, the guide lines, the point and the trace it has left."""
    h, m = float(his_on(t)), float(mine_on(t))
    if h + m < 0.01:
        k_rail = float(sm(0.4, 1.4, t)) * 0.5
    else:
        k_rail = 1.0
    px, py = (float(v) for v in point(t))
    both = min(h, m)
    col = mix(mix(AMBER, KEEPER, h / max(h + m, 1e-6)), GOLD, both)
    col = mix(mix(col, SOUR, sourness(t)), KEEPER, echoing(t))
    ink, rail = (0.33, 0.24, 0.20), (0.45, 0.36, 0.30)
    cv.stroke(cv.seg((C[0] - R, RAIL_Y), (C[0] + R, RAIL_Y)), 0.006, rail, 0.8 * k_rail * (0.4 + 0.6 * h))
    cv.stroke(cv.seg((RAIL_X, C[1] - R), (RAIL_X, C[1] + R)), 0.006, rail, 0.8 * k_rail * (0.4 + 0.6 * m))
    if h + m < 0.01:
        return
    # the trace: what the point drew over the last few seconds, older parts fainter
    span = 3.45 + 1.75 * float(sm(T["other"] + 0.6, T["other"] + 1.6, t) * (1.0 - sm(T["home"] + 0.6, T["home"] + 1.6, t)))
    t_a = max(t - span, T["hum"])
    if t - t_a > 0.05:
        n = int(max(8, min(320, (t - t_a) * 64)))
        ts = np.linspace(t_a, t, n + 1)
        xs, ys = point(ts)
        pts = list(zip(xs.tolist(), ys.tolist()))
        cuts = [0, n // 4, n // 2, 3 * n // 4, n]
        for (i0, i1), a in zip(zip(cuts[:-1], cuts[1:]), (0.30, 0.62, 0.9, 1.0)):
            if i1 - i0 < 1:
                continue
            d = cv.path(pts[i0:i1 + 1])
            cv.stroke(d, 0.011, ink, 0.50 * a)
            cv.stroke(d, 0.006, mix(col, (1, 1, 1), 0.35), 0.95 * a)
            cv.glow(d, col, 0.018, 0.50 * a)
    if h > 0.02:
        cv.stroke(cv.seg((px, RAIL_Y), (px, py)), 0.0028, KEEPER, 0.45 * h)
        cv.fill(cv.circle((px, RAIL_Y), 0.017), KEEPER, h)
        cv.glow(cv.circle((px, RAIL_Y), 0.017), KEEPER, 0.03, 0.5 * h)
    if m > 0.02:
        mc = mix(AMBER, KEEPER, echoing(t))
        cv.stroke(cv.seg((RAIL_X, py), (px, py)), 0.0028, mc, 0.45 * m)
        cv.fill(cv.circle((RAIL_X, py), 0.017), mc, m)
        cv.glow(cv.circle((RAIL_X, py), 0.017), mc, 0.03, 0.5 * m)
    flash = hit(t, T["click"], 3.0) + 0.7 * hit(t, T["meet"] + 3.35, 3.0) + 0.7 * hit(t, T["own"] + 0.5, 3.0)
    cv.fill(cv.circle((px, py), 0.013), (1.0, 0.98, 0.9))
    cv.glow(cv.circle((px, py), 0.013), col, 0.035, 0.9)
    if flash > 0.02:
        cv.glow(cv.circle(C, R * 0.9), GOLD, 0.16, 0.5 * flash)


ME_MOOD = [(0.0, "open", None, "smile"), (1.75, "wide", None, "o"), (4.0, "happy", None, "smile"), (6.75, "open", None, "o"),
           (10.7, "wide", None, "o"), (13.95, "spark", "!", "grin"), (17.5, "wide", "?", "o"), (19.0, "happy", None, "grin"),
           (22.6, "open", None, "o"), (24.6, "happy", None, "grin"), (27.9, "happy", None, "smile"), (31.8, "open", None, "flat"),
           (32.5, "closed", None, "frown"), (33.75, "open", None, "flat"), (36.1, "spark", "!", "grin"), (38.0, "happy", None, "smile"),
           (39.15, "happy", None, "grin"), (41.6, "open", "?", "flat"), (42.9, "wide", "!", "o"), (43.5, "open", None, "flat"),
           (44.45, "happy", None, "grin"), (46.8, "happy", None, "smile")]
K_MOOD = [(0.0, "happy", None, "smile"), (1.5, "closed", None, "o"), (6.1, "open", None, "smile"), (10.5, "closed", None, "o"),
          (14.0, "wide", None, "o"), (15.2, "happy", None, "o"), (17.3, "open", None, "smile"), (18.75, "happy", None, "o"),
          (31.9, "open", None, "flat"), (32.7, "happy", None, "grin"), (36.15, "happy", None, "o"), (39.3, "happy", None, "o"),
          (41.25, "open", "?", "flat"), (42.75, "open", None, "flat"), (44.5, "happy", None, "grin"), (46.5, "happy", None, "o")]
ME_LOOK = [(0.0, (0.9, 0.2)), (1.6, (0.9, 0.2)), (2.0, (0.8, 0.75)), (9.9, (0.8, 0.75)), (10.3, (1.0, 0.25)), (10.9, (0.8, 0.75)),
           (17.3, (0.8, 0.75)), (17.7, (1.0, 0.2)), (18.9, (0.8, 0.75)), (41.3, (0.8, 0.75)), (41.7, (1.0, 0.2)), (42.7, (1.0, 0.1)),
           (43.0, (0.7, -0.6)), (43.4, (-0.9, 0.85)), (44.2, (-0.9, 0.85)), (44.6, (0.8, 0.75)), (47.0, (1.0, 0.2))]
K_LOOK = [(0.0, (-0.9, 0.0)), (1.6, (-0.8, 0.55)), (6.1, (-0.95, 0.0)), (10.4, (-0.9, 0.1)), (10.9, (-0.8, 0.55)), (17.3, (-0.9, 0.0)),
          (18.9, (-0.8, 0.55)), (41.25, (-0.8, 0.55)), (41.8, (-0.95, 0.0)), (42.6, (-0.8, -0.5)), (43.4, (-0.95, 0.1)), (44.5, (-0.8, 0.55)),
          (47.0, (-0.95, 0.0))]
ME_LEAN = [(0.0, 0.0), (32.2, 0.0), (32.6, -0.07), (33.6, -0.04), (34.3, 0.11), (35.9, 0.11), (36.3, 0.0), (39.0, 0.0), (39.4, 0.06),
           (41.4, 0.03), (42.8, -0.05), (43.5, -0.10), (44.3, -0.06), (44.8, 0.0)]
K_ARML = [(0.0, (-0.15, 0.02)), (42.3, (-0.15, 0.02)), (42.6, (-0.20, 0.10)), (42.75, (-0.27, -0.115)), (43.1, (-0.22, -0.06)),
          (43.9, (-0.15, 0.02))]
ME_ARML = [(0.0, (-0.12, -0.03)), (43.3, (-0.12, -0.03)), (43.75, (-0.17, 0.17)), (44.3, (-0.17, 0.17)), (44.9, (-0.12, -0.03))]
CAM = [(0.0, 0.30, -0.17, 1.55), (10.5, 0.31, -0.13, 1.74), (36.0, 0.32, -0.12, 1.84), (42.5, 0.32, -0.12, 1.84),
       (43.7, 0.08, -0.02, 1.20), (44.6, 0.08, -0.02, 1.20), (46.6, 0.30, -0.14, 1.62), (49.5, 0.30, -0.15, 1.52)]


def s_lesson(cv, t):
    cx, cy, z = glide(t, CAM)
    dx, dy = shake(t, 0.008 * hit(t, T["tap"], 9.0))
    cv.begin((cx + dx, cy + dy, z))
    jar_on = float(sm(T["reach"] + 0.35, T["reach"] + 0.6, t) * (1.0 - sm(T["own"] + 0.6, T["own"] + 1.6, t)))
    my_room(cv, t, at=ME, shelf=6, cups=(1.0, 1.0), glow_i=4 if jar_on > 0.3 else None)
    h, m = float(his_on(t)), float(mine_on(t))
    r = float(ratio(t))
    # the two voices: a wave from each of us to the end of our own rail; a lower note is a longer wave
    if h > 0.02:
        wave_line(cv, HA, (C[0] + R + 0.02, RAIL_Y), 0.022, 2.0, -float(phase_h(t)) * 2.0, KEEPER, 0.9 * h, w=0.006, taper=False)
    if m > 0.02:
        wave_line(cv, MA, (RAIL_X, C[1] - R - 0.02), 0.022, 2.0 * r, -float(phase_m(t)) * 2.0, mix(AMBER, KEEPER, echoing(t)),
                  0.9 * m, w=0.006, taper=False)
    figure(cv, t)
    # his tap on the table
    tp = (SEAT[0] - 0.27 * S, TBL[1] + 0.012)
    for k in range(2):
        a = hit(t - 0.12 * k, T["tap"], 3.2)
        if 0.02 < a < 0.999:
            cv.stroke(cv.ellipse(tp, 0.03 + 0.20 * (1 - a), 0.012 + 0.07 * (1 - a)).abs(), 0.004, (1.0, 0.95, 0.8), 0.7 * a)
    # my reach for the shelf, and what comes back
    hand = (ME[0] - 0.17 * S, ME[1] + (0.17 + 0.10) * S)
    kd = float(sm(T["reach"], T["reach"] + 0.4, t) * (1.0 - sm(T["own"] + 0.15, T["own"] + 0.6, t)))
    if kd > 0.01:
        thread(cv, hand, JAR, 0.10, kd, AMBER, t, w=0.005)
        u = float(sm(T["reach"] + 0.45, T["own"], t))
        if 0.0 < u < 1.0:
            bp = lerp2(JAR, hand, u)
            cv.glow(cv.circle(bp, 0.012), AMBER, 0.05, 1.2)
    glow = 1.0 + 0.28 * echoing(t) * float(1.0 - sm(T["tilt"], T["tilt"] + 0.6, t)) + 0.25 * hit(t, T["own"] + 0.5, 1.5)
    arms_me = (kf(t, ME_ARML), sway(t, ((-0.12, -0.03), (0.13, 0.06)))[1])
    light(cv, t, (ME[0], ME[1] + bob(t) * S), S, kf(t, ME_LOOK), arms_me, mood(t, ME_MOOD), lean=kf(t, ME_LEAN), bright=glow)
    k_tilt = 0.02 * float(sm(T["tilt"], T["tilt"] + 0.4, t) * (1.0 - sm(T["tap"] - 0.2, T["tap"], t)))
    arms_k = (kf(t, K_ARML), sway(t * 0.7, ((-0.15, 0.02), (0.13, -0.06)))[1])
    orb(cv, (SEAT[0] + k_tilt * 2.0, SEAT[1] + bob(t, 1.3) * 0.6 * S - k_tilt), S, t, look=kf(t, K_LOOK), arms=arms_k,
        bright=1.0 + 0.25 * echoing(t) * float(1.0 - sm(T["tilt"], T["tilt"] + 0.6, t)), **mood(t, K_MOOD))


def frame(cv, t, index):
    s_lesson(cv, t)
    master = float(sm(0.0, 0.9, t) * (1.0 - sm(48.7, 49.4, t)))
    return cv.end(index, master, cv.compose())


def grid(times, name, cols, width):
    h = int(width * 9 / 16) // 2 * 2
    cv = Canvas(width, h)
    rows = math.ceil(len(times) / cols)
    (OUT / "check").mkdir(parents=True, exist_ok=True)
    again.pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{width}x{h}", "-r", "1", "-i", "-",
                "-vf", f"tile={cols}x{rows}:padding=2:color=0x303030", "-frames:v", "1", str(OUT / "check" / f"{name}.png")],
               (frame(cv, float(tt), int(round(tt * FPS))).cpu().numpy().tobytes() for tt in times))
    print(f"wrote out/check/{name}.png: {len(times)} frames")


def sound():
    """The clip's own sound, from the same envelopes and the same ratio as the picture: his note is D, mine is that
    times my ratio (A for 3:2, G for 4:3; near his it beats; on his it is one note)."""
    import soundfile as sf
    sr = 44100
    t = np.arange(int(T["end"] * sr)) / sr
    f_h = 146.83 * np.ones_like(t)
    f_m = 146.83 * ratio(t)
    rng = np.random.default_rng(3)

    def voice(freq, env, vib, bright):
        ph = 2.0 * np.pi * np.cumsum(freq * (1.0 + 0.004 * np.sin(2.0 * np.pi * vib * t))) / sr
        w = sum(a * np.sin(k * ph) for k, a in ((1, 1.0), (2, 0.5 * bright), (3, 0.28 * bright), (4, 0.12 * bright), (5, 0.06)))
        return w * env * (1.0 + 0.05 * np.sin(2.0 * np.pi * 0.6 * t))
    his = voice(f_h, his_on(t), 4.6, 0.8) * 0.20
    mine = voice(f_m, mine_on(t), 5.3, 1.0) * 0.17

    def bell(at, f, amp, length=1.6):
        i0 = int(at * sr)
        n = min(len(t) - i0, int(length * sr))
        tt = np.arange(n) / sr
        w = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.01 * tt) + 0.2 * np.sin(2 * np.pi * f * 3.02 * tt)) * np.exp(-tt * 3.2)
        out = np.zeros_like(t)
        out[i0:i0 + n] = w * amp
        return out
    extra = bell(T["meet"] + 3.35, 880.98, 0.10) + bell(T["click"], 880.98, 0.14) + bell(T["click"] + 0.05, 587.32, 0.08)
    extra += bell(T["own"] + 0.5, 880.98, 0.12) + bell(T["reach"] + 0.45, 1174.6, 0.05, 0.9)
    i0 = int(T["tap"] * sr)
    n = int(0.25 * sr)
    tt = np.arange(n) / sr
    extra[i0:i0 + n] += (np.sin(2 * np.pi * 150 * tt) * np.exp(-tt * 30) * 0.5 + rng.standard_normal(n) * np.exp(-tt * 90) * 0.25)
    left = his * 0.75 + mine * 1.0 + extra
    right = his * 1.0 + mine * 0.75 + extra
    dry = np.stack([left, right], axis=1)
    ir_n = int(1.6 * sr)
    ir = rng.standard_normal((ir_n, 2)) * np.exp(-np.arange(ir_n) / (0.35 * sr))[:, None]
    ir[: int(0.01 * sr)] = 0
    wet = np.stack([np.fft.irfft(np.fft.rfft(dry[:, c], len(t) + ir_n) * np.fft.rfft(ir[:, c], len(t) + ir_n))[:len(t)] for c in range(2)], axis=1)
    wet *= 0.22 * np.abs(dry).max() / max(np.abs(wet).max(), 1e-9)
    mix_ = dry + wet
    mix_ = (mix_ / np.abs(mix_).max() * 0.8).astype(np.float32)
    OUT.mkdir(exist_ok=True)
    sf.write(str(OUT / "lesson.wav"), mix_, sr, subtype="PCM_24")
    print("wrote out/lesson.wav")


def render():
    sound()
    cv = Canvas(1280, 720)
    total = int(round(T["end"] * FPS))

    def frames():
        for i in range(total):
            if i % 240 == 0:
                print(f"frame {i}/{total}", flush=True)
            yield frame(cv, i / FPS, i).cpu().numpy().tobytes()
    again.pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1280x720", "-r", str(FPS), "-i", "-",
                "-i", str(OUT / "lesson.wav"), "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "256k", "-shortest", str(OUT / "lesson_knot.mp4")], frames())
    print("wrote", OUT / "lesson_knot.mp4")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    mode = sys.argv[1] if len(sys.argv) > 1 else "sheet"
    if mode == "sheet":
        grid([4.5, 9.0, 12.0, 13.9, 16.5, 18.3, 20.5, 26.5, 30.5, 33.0, 35.0, 36.2, 40.6, 42.9, 43.95, 46.5], "lesson", 4, 640)
    elif mode == "strip":
        a, b = (float(x) for x in sys.argv[2].split(":"))
        grid([a + i / FPS for i in range(int(round((b - a) * FPS)) + 1)], sys.argv[3], 8, 320)
    elif mode == "frame":
        tt = float(sys.argv[2])
        cv = Canvas(1280, 720)
        again.pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1280x720", "-i", "-", "-frames:v", "1",
                    str(OUT / f"lesson_{tt:.2f}.png")], [frame(cv, tt, int(tt * FPS)).cpu().numpy().tobytes()])
        print("wrote", OUT / f"lesson_{tt:.2f}.png")
    elif mode == "render":
        render()
