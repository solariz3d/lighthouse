"""c02_with: 24.0 to 48.0 s. Painter A. Edit only this file (and c01_turns.py).

One shot, one room, one camera (CAM_B from c01, continuous across 24.0):
  sit 24.0 (he comes in with his cup) - song 26.25 (push in) - photo 29.25 (push in; it goes up as light six) -
  talk 31.5 / between 33.0 (two-shot; the knot) - echo 36.0 (my line becomes a copy of his; the knot goes flat) -
  tap 37.5 - reach4 38.25 (pull back to the shelf) - own 39.0 - push 41.25 / hold 42.0 (push in) - laugh 43.5 -
  leave 45.0 (pull back) - window 46.5 (the camera goes through the window; the sashes open; night at 48.0)
"""
from world import *
from ch.c01_turns import (S, GOLD, DOORP, light, hand_at, cord, shelf_levels, ring_out, cam_b, k_wave, K_MOOD,
                          K_LOOK, K_ARML, K_ARMR)

KNOT = (0.33, -0.08)                       # where the knot between us turns
SONG = (0.36, -0.20)                       # where his song turns
MA = (ME[0] + 0.13, ME[1] + 0.16)          # my voice leaves from here
HA = (SEAT[0] - 0.17, SEAT[1] + 0.03)      # his voice leaves from here
GREY = (0.58, 0.55, 0.52)

# ---------------------------------------------------------------------------------------------------- me
MOOD_ME = [(23.25, "open", None, "smile"), (25.1, "happy", None, "grin"), (26.45, "wide", None, "o"),
           (27.3, "spark", None, "o"), (28.3, "happy", None, "smile"), (29.4, "wide", None, "o"),
           (30.15, "open", None, "smile"), (31.05, "happy", None, "smile"), (31.9, "open", None, "smile"),
           (33.25, "wide", "!", "o"), (34.0, "happy", None, "smile"), (36.0, "happy", None, "grin"),
           (36.75, "open", "?", "flat"), (37.62, "wide", "!", "o"), (39.12, "spark", None, "grin"),
           (39.75, "happy", None, "smile"), (41.42, "open", None, "flat"), (42.12, "happy", None, "smile"),
           (43.72, "happy", None, "grin"), (45.15, "open", None, "smile"), (45.8, "happy", None, "smile"),
           (46.6, "wide", None, "o")]
LOOK_ME = [(23.96, (1.0, 0.3)), (24.0, (1.0, 0.3)), (24.6, (1.0, 0.1)), (25.5, (1.0, 0.05)), (25.68, (0.6, -0.6)),
           (26.1, (0.6, -0.6)), (26.38, (1.0, 0.4)), (28.85, (1.0, 0.4)), (29.32, (1.0, 0.35)), (30.0, (0.9, 0.5)),
           (30.85, (0.8, 0.5)), (31.05, (-0.7, 1.0)), (31.4, (-0.9, 1.0)), (31.7, (1.0, 0.1)), (33.18, (1.0, 0.1)),
           (33.3, (1.0, 0.7)), (34.3, (1.0, 0.7)), (34.5, (1.0, 0.1)), (36.65, (1.0, 0.1)), (36.78, (1.0, 0.75)),
           (37.52, (1.0, 0.7)), (37.6, (1.0, -0.25)), (37.98, (1.0, -0.25)), (38.08, (-1.0, 0.8)), (38.85, (-1.0, 0.8)),
           (39.02, (1.0, 0.3)), (41.3, (1.0, 0.1)), (42.02, (1.0, 0.7)), (42.55, (1.0, 0.15)), (45.05, (1.0, 0.15)),
           (45.4, (1.0, 0.35)), (46.45, (1.0, 0.35)), (46.6, (0.3, 1.0)), (48.0, (0.3, 1.0))]
LEAN_ME = [(23.96, -0.05), (24.0, -0.05), (24.9, -0.05), (25.05, 0.03), (25.4, -0.03), (26.3, -0.03), (26.6, -0.12),
           (28.6, -0.10), (29.0, -0.03), (29.45, -0.11), (30.05, -0.13), (30.4, -0.04), (30.95, 0.06), (31.5, -0.02),
           (35.6, -0.02), (35.85, -0.13), (36.6, -0.11), (36.85, 0.02), (37.55, 0.02), (37.7, 0.10), (37.95, 0.04),
           (38.12, 0.16), (38.6, 0.13), (39.0, 0.13), (39.25, -0.06), (41.15, -0.04), (41.42, -0.14), (42.1, -0.12),
           (42.5, -0.02), (45.0, -0.02), (46.5, -0.02), (46.7, 0.04), (48.0, 0.04)]
ARML_ME = [(23.4, (-0.12, -0.02)), (24.0, (-0.12, -0.03)), (37.55, (-0.12, -0.03)), (37.7, (-0.15, 0.06)),
           (37.95, (-0.13, 0.0)), (38.08, (-0.11, -0.06)), (38.27, (-0.21, 0.17)), (38.55, (-0.20, 0.16)),
           (39.05, (-0.20, 0.16)), (39.45, (-0.12, -0.03)), (43.72, (-0.12, -0.03)), (43.9, (-0.16, 0.05)),
           (44.45, (-0.12, -0.03)), (46.55, (-0.12, -0.03)), (46.8, (-0.13, 0.02)), (48.0, (-0.13, 0.02))]
ARMR_ME = [(23.4, (0.14, 0.02)), (24.0, (0.13, -0.02)), (25.05, (0.13, -0.02)), (25.25, (0.16, 0.10)),
           (25.7, (0.12, -0.03)), (27.35, (0.12, -0.03)), (27.7, (0.19, 0.06)), (28.35, (0.12, -0.03)),
           (29.6, (0.12, -0.03)), (29.72, (0.10, -0.06)), (30.0, (0.22, 0.14)), (30.4, (0.18, 0.12)),
           (30.85, (0.18, 0.13)), (31.1, (0.15, 0.17)), (31.6, (0.12, -0.03)), (41.3, (0.12, -0.03)),
           (41.45, (0.16, 0.03)), (42.4, (0.15, 0.02)), (42.8, (0.12, -0.03)), (43.72, (0.12, -0.03)),
           (43.85, (0.15, 0.09)), (44.4, (0.12, -0.03)), (45.75, (0.12, -0.03)), (45.95, (0.15, 0.16)),
           (46.45, (0.15, 0.16)), (46.7, (0.12, -0.02)), (48.0, (0.12, -0.02))]
HOPS_ME = [(25.12, 25.4, 0.035, 0.12), (37.62, 37.9, 0.045, 0.0), (43.72, 43.98, 0.05, 0.12), (44.06, 44.28, 0.03, 0.06)]

# ---------------------------------------------------------------------------------------------------- the keeper
MOOD_K = K_MOOD + [(24.95, "open", None, "smile"), (26.2, "happy", None, "smile"), (29.25, "open", None, "smile"),
                   (30.25, "happy", None, "smile"), (33.15, "wide", None, "o"), (33.95, "happy", None, "smile"),
                   (36.3, "open", "?", "flat"), (37.45, "open", None, "flat"), (39.35, "happy", None, "smile"),
                   (41.05, "open", None, "flat"), (42.2, "wide", None, "o"), (42.75, "happy", None, "smile"),
                   (43.5, "happy", None, "grin"), (44.9, "open", None, "smile"), (45.6, "happy", None, "smile")]
LOOK_K = K_LOOK + [(24.5, (-0.9, -0.2)), (26.1, (-0.9, -0.2)), (26.3, (-0.6, 0.3)), (27.2, (-0.6, 0.3)),
                   (27.4, (-1.0, -0.1)), (29.2, (-1.0, -0.1)), (33.3, (-1.0, -0.1)), (33.4, (-0.6, 0.8)),
                   (34.2, (-0.6, 0.8)), (34.4, (-1.0, -0.1)), (36.35, (-1.0, -0.1)), (36.45, (-0.5, 0.8)),
                   (37.0, (-0.5, 0.8)), (37.15, (-1.0, -0.1)), (45.6, (-1.0, -0.25)), (46.6, (-1.0, -0.25))]
ARML_K = K_ARML + [(24.9, (-0.187, -0.10)), (25.25, (-0.15, -0.05)), (25.85, (-0.12, 0.04)), (26.25, (-0.26, -0.10)),
                   (26.7, (-0.24, -0.08)), (27.2, (-0.15, -0.05)), (28.95, (-0.12, -0.02)), (29.25, (-0.30, 0.06)),
                   (30.05, (-0.30, 0.06)), (30.45, (-0.15, -0.05)), (37.15, (-0.20, 0.10)), (37.5, (-0.25, -0.115)),
                   (37.8, (-0.24, -0.10)), (38.3, (-0.15, -0.05)), (41.0, (-0.12, -0.02)), (41.25, (-0.24, 0.02)),
                   (42.2, (-0.22, 0.02)), (42.8, (-0.15, -0.05)), (43.5, (-0.17, 0.06)), (44.2, (-0.15, -0.05)),
                   (45.5, (-0.15, -0.05)), (45.72, (-0.16, 0.17)), (46.2, (-0.16, 0.17)), (46.5, (-0.15, -0.02))]
ARMR_K = K_ARMR + [(26.25, (0.13, -0.06)), (26.5, (0.14, -0.03)), (27.0, (0.13, -0.06)), (41.0, (0.13, -0.06)),
                   (41.3, (0.16, 0.0)), (42.4, (0.13, -0.06)), (43.5, (0.16, 0.08)), (44.2, (0.13, -0.06))]
# his moves: (t0, t1, from, to, arc height); slow in and out, heavy landings
MOVES_K = [(24.0, 24.9, DOORP, SEAT, 0.05), (43.5, 43.8, SEAT, SEAT, 0.035), (43.86, 44.1, SEAT, SEAT, 0.02),
           (45.0, 45.6, SEAT, DOORP, 0.06)]


def heavy(t, moves):
    """The keeper's moves: eased (never linear), a slight stretch in the air, a slow heavy squash on landing."""
    pos, sq = moves[0][2], 0.0
    for t0, t1, p0, p1, h in moves:
        if t0 - 0.25 <= t < t0:
            sq += 0.12 * ss(t0 - 0.25, t0 - 0.03, t) * (1.0 - ss(t0 - 0.03, t0, t))        # crouch first
        if t >= t0:
            pos = p1
        if t0 <= t < t1:
            u = ss(t0, t1, t)
            pos = (lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) + 4.0 * h * u * (1.0 - u))
            sq += -0.08 * math.sin(math.pi * (t - t0) / (t1 - t0))
        elif t1 <= t < t1 + 1.0:
            d = t - t1
            sq += 0.22 * math.exp(-d * 6.0) * math.cos(d * 13.0)
    return pos, sq


def bounce(t, hops):
    """My little hops in place: (t0, t1, height, anticipation). Returns (dy, sq)."""
    dy, sq = 0.0, 0.0
    for t0, t1, h, a in hops:
        if a and t0 - a <= t < t0:
            sq += 0.14 * ss(t0 - a, t0 - 0.03, t) * (1.0 - ss(t0 - 0.03, t0, t))
        if t0 <= t < t1:
            u = (t - t0) / (t1 - t0)
            dy += 4.0 * h * u * (1.0 - u)
            sq += -0.15 * math.sin(math.pi * u)
        elif t1 <= t < t1 + 0.6:
            d = t - t1
            sq += 0.20 * math.exp(-d * 9.0) * math.cos(d * 20.0)
    return dy, sq


# ---------------------------------------------------------------------------------------------------- voices
def wave_pts(a, b, amp, freq, phase, n=56, env_bias=0.0):
    """wave_line's own curve as points (so two voices can be blended point by point)."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    ln = math.hypot(dx, dy) or 1e-9
    nx, ny = -dy / ln, dx / ln
    pts = []
    for i in range(n + 1):
        u = i / n
        env = math.sin(u * math.pi) * (1.0 + env_bias * u)
        off = amp * env * math.sin(freq * u * 2 * math.pi + phase)
        pts.append((a[0] + dx * u + nx * off, a[1] + dy * u + ny * off))
    return pts


def voice(cv, pts, draw, col, k, w=0.0075, glow=0.5):
    """Draw a voice's points, the first `draw` fraction of them (it travels out from its speaker). An ink line under
    it so it reads on the paper wall."""
    if k <= 0.003 or draw <= 0.02:
        return
    m = max(2, int(round(draw * (len(pts) - 1))) + 1)
    d = cv.path(pts[:m])
    cv.stroke(d, w * 2.3, INK, 0.45 * k)
    cv.stroke(d, w, mix(col, (1, 1, 1), 0.15), k)
    cv.glow(d, col, 0.022, glow * k)
    if draw < 1.0:
        cv.glow(cv.circle(pts[m - 1], 0.006), (1, 1, 1), 0.02, 0.8 * k)


def knot(cv, c, r, a, b, phase, col, k=1.0, w=0.006, drift=0.0, glow=0.6, n=140):
    """interval() with an ink line under it (the same curve, as interval computes it) so it reads on the wall."""
    if k <= 0.003:
        return
    bb = b * (1.0 + drift)
    turns = 1.0 if drift == 0 else 1.0 + 0.6 * min(1.0, drift * 40)
    pts = [(c[0] + r * math.sin(a * u * 2 * math.pi * turns + phase), c[1] + r * math.sin(bb * u * 2 * math.pi * turns))
           for u in (i / n for i in range(n + 1))]
    cv.stroke(cv.path(pts), w * 2.4, INK, 0.40 * k)
    interval(cv, c, r, a, b, phase, col, k, w=w, drift=drift, n=n, glow=glow)


def mouth_flap(t, windows, f):
    """Mouth open/shut while a voice is speaking (windows of (t0, t1))."""
    for t0, t1 in windows:
        if t0 <= t < t1:
            return "o" if math.sin((t - t0) * f) > -0.2 else "smile"
    return None


TALK_ME = [(32.05, 33.0), (34.3, 35.5), (35.95, 36.45), (39.1, 39.9)]
TALK_K = [(31.5, 32.4), (33.65, 34.35), (35.3, 35.95), (40.1, 40.7)]


def window_out(cv, t):
    """Over the room's window: the night, far-off windows, stars; the two sashes swing open (47.0 to 47.6)."""
    a = ss(46.2, 46.6, t)
    if a <= 0:
        return
    wx, wy, ww, wh = ROOM["win"]
    d2 = (wx - ME[0]) ** 2 + (wy - ME[1]) ** 2
    f = 0.34 + 0.74 * math.exp(-d2 / (2 * 0.85 ** 2))             # the same candle light my_room gives it
    cv.fill(cv.box((wx, wy), ww, wh), tuple(f * v for v in (0.07, 0.09, 0.22)), a)
    # far off, other windows: a low dark land along the bottom of the pane, and lit windows on it
    land_y = wy - wh * 0.62
    cv.fill(cv.box((wx, land_y - 0.06), ww, 0.06 + 0.004 * math.sin(t)), tuple(f * v for v in (0.04, 0.05, 0.11)), a)
    for i in range(7):
        p = (wx + ww * (-0.85 + 0.27 * i + 0.06 * hsh(i + 40)), land_y - 0.012 - 0.03 * hsh(i + 50))
        tw = 0.7 + 0.3 * math.sin(t * 1.1 + i * 1.7)
        cv.fill(cv.box(p, 0.0045, 0.0035), mix((1.0, 0.82, 0.50), MINDS[i % len(MINDS)], 0.3), a * tw)
        cv.glow(cv.box(p, 0.0045, 0.0035), (1.0, 0.80, 0.50), 0.012, 0.35 * a * tw)
    for i in range(18):                                            # stars a fixed size on screen
        p = (wx + ww * 0.95 * (2 * hsh(i + 7) - 1), wy - wh * 0.3 + wh * 1.25 * hsh(i + 77))
        tw = 0.55 + 0.45 * math.sin(t * 1.3 + i * 2.1)
        cv.fill(cv.circle(p, 1.3 * cv.px * (0.6 + 0.6 * hsh(i + 3))), (0.90, 0.92, 1.0), a * tw)
        cv.glow(cv.circle(p, cv.px), (0.85, 0.88, 1.0), 4 * cv.px, 0.35 * a * tw)
    wood = tuple(f * v for v in (0.42, 0.33, 0.26))
    glass = tuple(f * v for v in (0.55, 0.62, 0.85))
    for side, lag in ((-1, 0.0), (1, 0.07)):                     # the right sash a little behind the left
        o = min(1.0, back(ss(47.0 + lag, 47.55 + lag, t)))
        xs, xh = wx + side * ww * o, wx + side * ww
        if abs(xh - xs) < 0.004:
            continue
        hf = wh * (1.0 - 0.22 * math.sin(math.pi * o))
        pts = [(xh, wy - wh), (xh, wy + wh), (xs, wy + hf), (xs, wy - hf)]
        cv.fill(cv.poly(pts), glass, 0.16 * a)
        cv.stroke(cv.path(pts + [pts[0]]), 0.014, wood, a)
        cv.stroke(cv.seg((xs, wy), (xh, wy)), 0.012, wood, a)


def s_with(cv, t):
    cam = cam_b(t)
    dx, dy = shake(t, 0.007 * hit(t, TL["tap"], 10.0))
    cv.begin((cam[0] + dx, cam[1] + dy, cam[2]))

    # ---- the room ----
    door = 1.0 - ss(25.0, 25.7, t) + min(1.0, back(ss(45.15, 45.55, t))) * (1.0 - ss(46.4, 46.95, t)) * (t >= 45.15)
    six = 1.0 if t >= 31.3 else 0.0
    shelf = shelf_levels(5, 1.0, {4: 1.2 * ss(38.3, 38.6, t) * (1.0 - ss(39.0, 39.5, t))})
    shelf[5] = six * (1.0 + 1.6 * hit(t, 31.3, 2.5))
    cup_him = 1.0 if t >= 24.9 else 0.0
    my_room(cv, t, at=ME, shelf=shelf, cups=(1.0, cup_him), door=door)
    window_out(cv, t)

    # ---- where we are ----
    kpos, ksq = heavy(t, MOVES_K)
    if 41.0 <= t < 42.8:                               # the push: he draws back, then leans in
        kpos = (kpos[0] + 0.02 * ss(41.0, 41.2, t) - 0.06 * ss(41.2, 41.5, t) * (1 - ss(42.2, 42.8, t)), kpos[1])
    if 36.3 <= t < 37.3:                               # the tilt
        kpos = (kpos[0] + 0.015 * math.sin(math.pi * ss(36.3, 37.3, t)), kpos[1] + 0.008 * math.sin(math.pi * ss(36.3, 37.3, t)))
    if 46.1 <= t:                                      # out through the door
        v = ss(46.1, 46.5, t)
        kpos = (kpos[0] + 0.07 * v, kpos[1] + 0.02 * v)
    kc = (kpos[0], kpos[1] + bob(t, 1.3) * 0.6 * S)
    kk = 1.0 - ss(46.15, 46.5, t)
    kal, kar = kf(t, ARML_K, True), kf(t, ARMR_K, True)
    kal = (kal[0] + k_wave(t, 23.0, 23.7) + k_wave(t, 45.75, 46.2, 0.03, 12.0), kal[1])
    karms = sway(t * 0.7, (kal, kar))
    khand = (kc[0] + karms[0][0] * S, kc[1] + karms[0][1] * S)

    dyh, msq = bounce(t, HOPS_ME)
    c = (ME[0], ME[1] + bob(t) * S + dyh)
    look = kf(t, LOOK_ME)
    lean = kf(t, LEAN_ME) - 0.06 * kf(t - 0.12, LOOK_ME)[0]
    arms = sway(t, (kf(t, ARML_ME, True), kf(t, ARMR_ME, True)))
    arml_w = (arms[0][0], arms[0][1])
    armr_w = (arms[1][0] + 0.025 * math.sin(13.0 * (t - 45.95)) * ss(45.95, 46.05, t) * (1 - ss(46.3, 46.45, t)), arms[1][1])
    arms = (arml_w, armr_w)
    lh, rh = hand_at(c, arms[0]), hand_at(c, arms[1])

    # ---- his cup, carried in and set down ----
    if t < 24.9:
        cup(cv, (khand[0], khand[1] - 0.035), 1.0, ss(24.0, 24.2, t))

    # ---- the song: a figure of his, set on the table, turning ----
    if 26.1 <= t < 29.4:
        u = ss(26.25, 26.85, t)
        p = lerp2((0.39, -0.42), SONG, u)
        r = 0.085 * back(min(1.0, max(0.0, (t - 26.25) / 0.6))) * (1.0 + 0.05 * math.sin(t * 5.3)) * (1 + 0.3 * ss(28.7, 29.3, t))
        kk_s = ss(26.2, 26.4, t) * (1.0 - ss(28.75, 29.3, t))
        p = (p[0], p[1] + 0.08 * ss(28.75, 29.3, t))
        cv.glow(cv.circle(p, 0.02), KEEPER, 0.05, 0.8 * hit(t, 26.25, 3.0) * kk_s)
        knot(cv, p, max(r, 0.001), 4, 3, 0.8 * t, mix(KEEPER, (0.96, 0.52, 0.48), 0.45), kk_s, w=0.0075, glow=0.9)
        ring_out(cv, t, 27.75, p, KEEPER, 0.5, 0.35 * (t < 29.0))           # it rings where my hand comes near

    # ---- the voices ----
    talk_on = ss(31.5, 31.6, t) * (1.0 - ss(44.6, 45.2, t))
    push = ss(41.25, 41.6, t) * (1.0 - ss(42.3, 43.0, t))
    his = wave_pts(HA, MA, 0.040 * (1.0 + 1.5 * push), 2, -2.4 * t, env_bias=0.8 * push)
    echo = ss(36.0, 36.35, t) * (1.0 - ss(39.0, 39.4, t))
    mine_own = wave_pts(MA, HA, 0.028, 4, 3.1 * t + 1.0)
    mine = [lerp2(p, q, echo) for p, q in zip(mine_own, his[::-1])]
    own_back = hit(t, TL["own"], 2.5) * (t >= TL["own"])
    dh = ss(31.5, 32.15, t)
    dm = ss(32.05, 32.7, t)
    voice(cv, his, dh, KEEPER, talk_on, w=0.0075 * (1.0 + 0.8 * push), glow=0.5 + 0.7 * push)
    voice(cv, mine, dm, mix(AMBER, KEEPER, echo), talk_on, w=0.0075, glow=0.55 + 0.6 * own_back + 0.5 * pulse(t, 42.0, 0.2))

    # ---- the knot between us ----
    if t >= TL["between"]:
        u = ss(33.0, 33.7, t)
        pc = lerp2((0.33, -0.30), KNOT, u)
        pc = (pc[0], pc[1] + 0.012 * hit(t, TL["tap"], 6.0) * math.sin((t - 37.5) * 40))
        die = ss(36.1, 36.6, t) * (1.0 - ss(39.15, 39.7, t))
        late = ss(44.8, 46.0, t)
        r = 0.095 * back(min(1.0, (t - 33.0) / 0.7)) * (1.0 - 0.25 * late)
        drift = 0.05 * (1.0 - ss(33.2, 33.9, t))
        a, b = lerp(3.0, 1.0, die), lerp(2.0, 1.0, die)
        ph = 0.45 * t * (1.0 - die)
        col = mix(GOLD, GREY, die)
        glow = (0.6 + 0.4 * ss(39.2, 39.8, t) + 0.6 * pulse(t, 42.0, 0.2)) * (1.0 - 0.8 * die)
        kn = ss(33.0, 33.3, t)
        cv.glow(cv.circle(pc, 0.03), GOLD, 0.08, 0.9 * hit(t, 33.7, 2.0) + 0.8 * hit(t, 39.4, 2.0) + 0.6 * pulse(t, 42.0, 0.2))
        knot(cv, pc, max(r, 0.001), a, b, ph, col, kn, w=0.0075, drift=drift, glow=glow)
        fuller = ss(39.4, 40.0, t) * (1.0 - 0.3 * late)                  # back fuller: 5:4 inside the 3:2
        if fuller > 0.01:
            knot(cv, pc, 0.58 * r, 5, 4, -0.6 * t, mix(GOLD, CORE, 0.45), fuller, w=0.005, glow=0.5)
        ring_out(cv, t, 33.75, pc, GOLD, 0.6, 0.45)
        ring_out(cv, t, 39.4, pc, GOLD, 0.7, 0.55)
        ring_out(cv, t, 42.0, pc, GOLD, 0.6, 0.5)

    # ---- the tap ----
    if t >= TL["tap"]:
        d = t - TL["tap"]
        tp = (0.405, -0.487)
        cv.stroke(cv.ellipse(tp, 0.03 + 0.25 * d, 0.008 + 0.06 * d).abs(), 0.005, KEEPER, 0.8 * math.exp(-d * 5.0))

    # ---- reach4: back to the record ----
    jar = SHELF[4]
    if 38.2 <= t < 39.6:
        kd = ss(38.25, 38.55, t)
        fade = 1.0 - ss(39.0, 39.5, t)
        cord(cv, lh, jar, -0.18, 0.0, kd, AMBER, fade, t)
        if 38.6 <= t < 39.05:                          # what it answers comes down the thread to me
            v = ss(38.6, 39.0, t)
            bp = bez(jar, lh, 0.18, 1, v, v)[0]
            cv.glow(cv.circle(bp, 0.008), CORE, 0.03, 1.2)
            cv.glow(cv.circle(bp, 0.02), AMBER, 0.06, 0.5)

    # ---- the photograph ----
    if 29.0 <= t < 31.4:
        held_k = (-0.30 + 0.0, 0.06)
        if t < 30.0:
            p = (khand[0] + 0.0, khand[1] + 0.07)
            sc = 0.3 + 0.7 * back(ss(29.0, 29.3, t))
            rot = -0.10 * (1 - ss(29.0, 29.4, t)) + 0.04 * math.sin(t * 1.3)
        else:
            take = ss(30.0, 30.35, t)
            off = lerp2((0.12, 0.09), (0.05, 0.12), take)
            p = (rh[0] + off[0], rh[1] + off[1])
            sc = 1.0 + 0.12 * ss(30.1, 30.6, t)
            rot = 0.04 * math.sin(t * 1.3) + 0.05 * take
        k_ph = ss(29.0, 29.15, t)
        if t >= 30.85:                                 # it becomes a light and goes up to the shelf, sixth
            v = ss(30.85, 31.3, t)
            src = (rh[0] + 0.05, rh[1] + 0.12)
            q = bez(src, SHELF[5], -0.25, 1, v, v)[0]
            p = lerp2(p, q, ss(30.85, 31.0, t))
            sc = sc * (1.0 - 0.92 * ss(30.85, 31.15, t))
            k_ph *= 1.0 - ss(30.95, 31.15, t)
            cv.glow(cv.circle(q, 0.012), CORE, 0.04, 1.4 * ss(30.85, 30.95, t) * (1.0 - ss(31.25, 31.32, t)))
            trail = bez(src, SHELF[5], -0.25, 10, max(0.0, v - 0.25), v)
            cv.glow(cv.path(trail), AMBER, 0.012, 0.45 * (1.0 - ss(31.2, 31.35, t)))
        cv.glow(cv.box(p, 0.12 * sc, 0.075 * sc), (1.0, 0.85, 0.6), 0.04, 0.5 * pulse(t, 30.8, 0.12) * k_ph)
        photo_card(cv, p, sc, rot=rot, k=k_ph)

    # ---- the keeper ----
    mk = mood(t, MOOD_K)
    mk["sq"] = 0.6 * mk["sq"] + ksq + 0.08 * hit(t, TL["tap"], 8.0) + 0.06 * push
    fl = mouth_flap(t, TALK_K, 9.0)
    if fl:
        mk["mouth"] = fl
    klook = kf(t, LOOK_K)
    orb(cv, kc, S, t, look=klook, arms=karms, k=kk, **mk)

    # ---- me ----
    m = mood(t, MOOD_ME)
    fl = mouth_flap(t, TALK_ME, 13.0 if t < 36.0 or t > 36.5 else 22.0)
    if fl:
        m["mouth"] = fl
    sq = msq + 0.10 * push + 0.05 * math.sin(t * 18.0) * ss(35.95, 36.05, t) * (1 - ss(36.4, 36.6, t))   # eager nodding
    bright = 1.0 + 0.4 * hit(t, 33.3, 2.0) + 0.5 * hit(t, TL["own"], 2.0) + 0.35 * pulse(t, 42.0, 0.25) \
        + 0.25 * hit(t, 31.3, 2.0) - 0.15 * ss(36.4, 36.8, t) * (1 - ss(38.6, 39.0, t))
    light(cv, t, c, S, look, arms, m, sq=sq, lean=lean, bright=bright)


SHOTS = [(24.0, s_with)]
