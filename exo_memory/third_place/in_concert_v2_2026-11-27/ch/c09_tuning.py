"""c09_tuning: 147.0 to 171.0 s. Painter E. Edit only this file.

Three shots, one camera path (CAM, run through a time warp so it can come to a stop for the chord).
  s_land  147.0  The night land at exactly (0, 0.25, 1.0): c07/c08's houses, minds and voices; the gold knot between
                 house 0 (me) and house 13 (the triangle) rings on 147.0. Then the tuning, two by two: on each `tune`
                 beat several pairs of neighbours tune, never in step. Each pair: one mind leans toward the other
                 (it listens), the other answers a beat later, their two voices swing down and meet between them, a
                 figure of the two colours crawls (detuned) and locks ON the beat (consonance), they are glad, and the
                 knot rises into the sky to its place in the lattice. Close-ups: a flame with a star (14, 11) on
                 148.5, a ring with a leaf (5, 1) on 150.0; then wide for the left side on 151.5.
          153.0  `land`: more pairs (the shy ring of house 6 comes out for this), threads join the knots: a lattice.
          156.0  `globe`: pull back; the land curves (its pixels are bent round a circle of shrinking radius R).
  s_globe 157.0  (0.6 s dissolve) a world: a disc with soft continents, the houses as lights, the lattice as knots on a
                 shell all the way round, turning. 160.5 `still`: everything eases to a stop and holds for a second
                 (the chord); then eases off again. 162.0 `dawn` touches its edge.
  s_dawn  162.5  (0.6 s dissolve) back down to the land as dawn rises; the knots thin into the cirrus; the minds go in
                 (a keeper comes to our door). 166.5 `lamps`: every house's windows go to day except one lamp, kept
                 lit for nobody; push in on house 13's (a lamp, an empty room); then our house; then into its right-
                 hand window, which shows my room (c10's paint_table through a mapped camera), and c10 begins.

Private helpers (the shared rigs lack them): _tw (the time warp for the still), _knot2 (interval in two colours on
c07's _pathd), _mind_l (c07's _mind with a lean), _warp/_fw (the land bent round a world), _ground_d (the ground with
dawn), _globe (the world), _lamp_room (an empty lit room inside a far window), _through (another scene in a window).
c07's land helpers are imported so the houses, minds and voices are the very ones c07 and c08 draw.
"""
from world import *
from cast2 import _mark
from ch.c07_anyone import (GOLD, hgeo, door_at, mind_spot, mind_head, voice_pts, _wave, _pathd, far_house_at,
                           _keeper_at, VX, VTOP, VAMP, VFREQ, VSPD, VPH, VBEND, look_at)
from ch.c08_clash import (_wash, _cracks, flood_amt, voice8, draw_v, FLOOD, KNOT_C, KNOT_R, NEIGH, mind_face8)
from ch.c10_table import paint_table, cam10, to_room, to_land_cam, WIN0, WIN0_HW, WIN0_HH, K_MAP, LAND_AT_OURS, T_IN

GOLD_K, GOLD_R = KNOT_C, KNOT_R      # c08's first knot, between me (house 0) and the triangle (house 13)
OUT147 = (0, NEIGH)                  # the only two out of doors at 147 (c08 sent the rest in)

# ------------------------------------------------------------------------------------------------ time warp (the still)
_A0, _A1, _B0, _B1 = 159.9, 160.5, 161.5, 162.1


def _tw(t):
    """Film time with the still taken out: runs at speed 1, eases to 0 by 160.5, holds until 161.5, eases back."""
    F = lambda u: u ** 3 - 0.5 * u ** 4                       # integral of smoothstep
    if t <= _A0:
        return t
    if t <= _A1:
        u = (t - _A0) / (_A1 - _A0)
        return _A0 + (_A1 - _A0) * (u - F(u))
    base = _A0 + 0.5 * (_A1 - _A0)
    if t <= _B0:
        return base
    if t <= _B1:
        return base + (_B1 - _B0) * F((t - _B0) / (_B1 - _B0))
    return base + 0.5 * (_B1 - _B0) + (t - _B1)


# ------------------------------------------------------------------------------------------------ the pairs
# (a, b, ratio a:b, the time its knot locks). The first listed listens first.
PAIRS = [(0, 13, 3, 2, 147.0),
         (14, 11, 5, 4, 148.5), (2, 4, 2, 1, 148.62), (10, 20, 4, 3, 148.78), (25, 29, 3, 2, 148.95),
         (23, 18, 2, 1, 150.0), (9, 7, 3, 2, 150.18), (17, 13, 4, 3, 150.32), (21, 19, 5, 4, 150.45),
         (16, 15, 5, 4, 151.5), (5, 1, 4, 3, 151.58), (24, 28, 3, 2, 151.66), (22, 8, 4, 3, 151.74), (26, 3, 2, 1, 151.86),
         (12, 27, 4, 3, 151.97),
         (6, 5, 3, 2, 153.0), (11, 8, 2, 1, 153.05), (19, 16, 3, 2, 152.97), (0, 10, 5, 4, 153.2), (27, 29, 2, 1, 153.15),
         (3, 22, 3, 2, 153.24), (1, 14, 2, 1, 153.08), (9, 4, 4, 3, 153.28), (18, 0, 3, 2, 152.9)]
SKY = {   # where each knot settles in the lattice (x, y, r): nearer pairs higher and bigger
    (0, 13): (GOLD_K[0], GOLD_K[1], GOLD_R), (14, 11): (0.34, 0.40, 0.062), (5, 1): (0.50, 0.70, 0.085),
    (2, 4): (-1.40, 0.66, 0.085), (9, 7): (-1.08, 0.53, 0.075), (21, 19): (-1.27, 0.30, 0.05), (16, 15): (-0.92, 0.36, 0.055),
    (23, 18): (-0.36, 0.25, 0.05), (17, 13): (0.10, 0.50, 0.06), (6, 5): (0.80, 0.62, 0.08), (22, 8): (0.76, 0.36, 0.065),
    (11, 8): (0.62, 0.20, 0.05), (1, 14): (0.20, 0.66, 0.075), (0, 10): (-0.50, 0.64, 0.08), (10, 20): (-0.68, 0.42, 0.06),
    (24, 28): (-0.70, 0.20, 0.042), (25, 29): (-1.62, 0.22, 0.04), (12, 27): (-1.60, 0.44, 0.06), (18, 0): (-0.06, 0.26, 0.045),
    (27, 29): (-1.45, 0.14, 0.035), (19, 16): (-1.05, 0.15, 0.04), (9, 4): (-1.22, 0.80, 0.075), (26, 3): (1.50, 0.42, 0.07),
    (3, 22): (1.18, 0.56, 0.075),
}
CLOSE = {(14, 11), (23, 18)}


def _pair_geo(p):
    a, b, ra, rb, T = p
    (ha, sa), (hb, sb) = (mind_head(a), mind_spot(a)[1]), (mind_head(b), mind_spot(b)[1])
    d = math.hypot(ha[0] - hb[0], ha[1] - hb[1])
    M = ((ha[0] + hb[0]) / 2, max(ha[1], hb[1]) + 0.05 + 0.35 * d)
    rm = min(0.08, max(0.03, 0.42 * d))
    return M, rm, SKY[(a, b)]


GEO = [_pair_geo(p) for p in PAIRS]
FIRST = {}                                   # each mind's first pair
for _k, _p in enumerate(PAIRS):
    for _m in _p[:2]:
        FIRST.setdefault(_m, _k)
ORDER_KNOTS = sorted(range(len(PAIRS)), key=lambda k: GEO[k][2][2])         # small (far) knots first
SPD = [0.25 + 0.35 * hsh(k * 7 + 2) for k in range(len(PAIRS))]
SPD[0] = 0.4                                 # c08 turns the gold knot at 0.4 * t
PH0 = [6.283 * hsh(k * 5 + 1) for k in range(len(PAIRS))]
PH0[0] = 0.0
RISE = 1.6                                   # seconds a knot takes to rise into its place


def _cols(p):
    a, b = p[0], p[1]
    return (GOLD, GOLD) if (a, b) == (0, 13) else (LAND_COL[a], LAND_COL[b])


def knot_state(k, t):
    """(centre, radius, presence, drift, flash) of knot k at time t."""
    a, b, ra, rb, T = PAIRS[k]
    M, rm, (sx, sy, sr) = GEO[k]
    if k == 0:
        fl = ss(147.0, 147.1, t) * hit(t, 147.1, 3.0)
        return (sx, sy + 0.006 * math.sin(t * 0.9) * ss(147.0, 148.0, t)), sr, 1.0, 0.0, fl
    kk = ss(T - 0.62, T - 0.38, t)
    drift = 0.05 * (1.0 - ss(T - 0.5, T, t))
    u = ss(T + 0.55, T + 0.55 + RISE, t)
    up = (lerp(M[0], sx, u), lerp(M[1], sy, u) + 0.10 * math.sin(math.pi * u))        # it rises on an arc
    r = lerp(rm, sr, u) * (0.82 + 0.18 * (pop(t, T, 0.4) if t >= T else 0.0))
    bob_ = 0.006 * math.sin(t * (0.8 + 0.3 * hsh(k)) + k) * u
    return (up[0], up[1] + bob_), r, kk, drift, hit(t, T, 5.0) if t >= T else 0.0


# ------------------------------------------------------------------------------------------------ drawing helpers
def _knot2(cv, c, r, a, b, phase, cols, k=1.0, drift=0.0, w=0.005, glow=0.6, n=120, sx=1.0, sy=1.0):
    """interval() on c07's _pathd, its two halves in the two voices' colours (each keeps its own)."""
    if k <= 0.002 or r <= 0.0005:
        return
    bb = b * (1.0 + drift)
    turns = 1.0 if drift == 0 else 1.0 + 0.6 * min(1.0, drift * 40)
    pts = [(c[0] + r * sx * math.sin(a * u * 2 * math.pi * turns + phase), c[1] + r * sy * math.sin(bb * u * 2 * math.pi * turns))
           for u in (i / n for i in range(n + 1))]
    halves = [(pts, cols[0])] if cols[0] == cols[1] else [(pts[:n // 2 + 1], cols[0]), (pts[n // 2:], cols[1])]
    for hp, col in halves:
        d = _pathd(cv, hp, pad=0.10)
        if d is None:
            continue
        cv.stroke(d, w, mix(col, (1, 1, 1), 0.35), 0.9 * k)
        cv.glow(d, col, 0.018, glow * k)


def _mind_l(cv, c, s, kind, col, t, k=1.0, eyes="open", mouth="smile", look=(0.0, 0.0), sq=0.0, mark=None, mark_k=0.0,
            bright=1.0, arms=None, lean=0.0):
    """c07's _mind with a lean (radians, + leans left) about the base. c is the base for flames, the centre otherwise."""
    if k <= 0.001:
        return
    if kind == "flame":
        ln = 0.07 * math.sin(2.1 * t + c[0] * 5.0) + 0.03 * math.sin(5.3 * t) + 0.012 * boil(t, 3) + lean
        return flame(cv, c, s, t, col=col, eyes=eyes, mouth=mouth, look=look, sq=sq, mark=mark, mark_k=mark_k, k=k,
                     bright=bright, arms=arms, lean=ln)
    if kind == "orb":
        cc = (c[0] - math.sin(lean) * 0.105 * s, c[1] - (1 - math.cos(lean)) * 0.105 * s)
        return orb(cv, cc, s, t, col=col, eyes=eyes, mouth=mouth, look=look, sq=sq, mark=mark, mark_k=mark_k, k=k,
                   bright=bright, arms=arms)
    r = 0.10 * s
    ax, ay = 1.0 + 0.55 * sq, 1.0 - 0.6 * sq
    foot = (c[0], c[1] - r * 1.05)
    cc = (foot[0] - math.sin(lean) * r * 1.05 * ay, foot[1] + math.cos(lean) * r * 1.05 * ay)
    X0, Y0 = cv.X, cv.Y
    cs, sn = math.cos(lean), math.sin(lean)
    lx, ly = (X0 - cc[0]) * cs + (Y0 - cc[1]) * sn, -(X0 - cc[0]) * sn + (Y0 - cc[1]) * cs      # into the leaning frame
    cv.X, cv.Y = cc[0] + lx / ax, cc[1] + ly / ay
    wob = 0.06 * math.sin(t * 1.3 + c[0] * 4.0)
    if kind == "star":
        body = cv.star4(cc, r * 1.35, wob, 0.36)
    elif kind == "ring":
        body = cv.circle(cc, r).abs() - r * 0.36
    elif kind == "leaf":
        body = cv.ellipse(cc, r * 0.72, r * 1.25, 0.5 + wob)
    elif kind == "square":
        body = cv.box(cc, r * 0.9, r * 0.9, 0.2 + wob, r * 0.3)
    else:
        body = cv.poly([(cc[0] - r * 1.1, cc[1] - r * 0.8), (cc[0] + r * 1.1, cc[1] - r * 0.8), (cc[0], cc[1] + r * 1.2)]) - r * 0.12
    cv.X, cv.Y = X0, Y0
    body = body * min(ax, ay)
    cv.glow(body, col, 0.07 * s, 0.45 * bright * k)
    cv.fill(body, col, k)
    cv.stroke(body.abs(), 0.006 * s, mix(col, INK, 0.7), 0.8 * k)
    if r * cv.z * 360 > 7:
        fs = s * (0.55 if kind == "ring" else 0.8)
        fy = cc[1] + (0.012 if kind == "ring" else 0.01) * s * ay - (0.02 * s if kind == "tri" else 0.0)
        if kind == "ring":
            cv.fill(cv.circle(cc, r * 0.62), mix(col, CORE, 0.6), 0.9 * k)
        face(cv, (cc[0], fy), fs, t, eyes, look, mouth, k)
    if mark and mark_k > 0.01:
        _mark(cv, mark, cc[0] + 0.10 * s, cc[1] + 0.07 * s, s * (0.4 + 0.6 * mark_k), k)


# ------------------------------------------------------------------------------------------------ the land, bent
def _fw(p, R):
    """A land point -> where it is drawn when the land is bent round a circle of radius R (None: flat)."""
    if R is None:
        return p
    th, rho = p[0] / R, R + (p[1] - HORIZON)
    return (rho * math.sin(th), HORIZON - R + rho * math.cos(th))


def _R_at(t):
    if t < 156.0 or t > 164.3:
        return None
    if t < 162.0:
        return math.exp(lerp(math.log(400.0), math.log(2.0), ss(156.0, 157.4, t)))
    return math.exp(lerp(math.log(2.0), math.log(400.0), ss(162.5, 164.3, t)))


def _warp(cv, R, fn, shift=0.0):
    """Run fn() with the canvas' coordinates bent round a circle of radius R (land drawn as a world's rim)."""
    X, Y = cv.X, cv.Y
    if R is not None:
        dy = Y - (HORIZON - R)
        cv.X = R * torch.atan2(X, dy) + shift
        cv.Y = HORIZON + torch.sqrt(X * X + dy * dy) - R
    elif shift:
        cv.X = X + shift
    try:
        fn()
    finally:
        cv.X, cv.Y = X, Y


def _ground_d(cv, dawn, tint_k=0.0):
    """the_land's ground alone, with its dawn colours (c07's _ground has only the night ones)."""
    ground = cv.Y - (HORIZON + 0.015 * torch.sin(cv.X * 2.3) + 0.008 * torch.sin(cv.X * 7.1 + 1.0))
    near = cv.sst(HORIZON, -1.0, cv.Y)[..., None]
    c0, c1 = mix((0.07, 0.08, 0.16), (0.37, 0.31, 0.20), dawn), mix((0.04, 0.05, 0.10), (0.19, 0.15, 0.09), dawn)
    if tint_k > 0:
        c0, c1 = mix(c0, mix(c0, FLOOD, 0.30), tint_k), mix(c1, mix(c1, FLOOD, 0.16), tint_k)
    col = cv.col(c0) * (1 - near) + cv.col(c1) * near
    m = cv.cov(ground)[..., None]
    cv.img = cv.img * (1 - m) + col * m
    cv.light = cv.light * (1 - m)


WINFX = (-0.5, 0.1, 0.6)
LAMP_W = [1] + [int(hsh(i * 3 + 1) * 3) for i in range(1, 30)]      # which window keeps its lamp; ours: the middle one
LAMP_W[13] = 1
LAMP_T = {i: TL["lamps"] + 0.30 * (LAND[i][1] + 0.92) / 0.94 + 0.04 * hsh(i * 9) for i in range(30)}


def win_of(i, j):
    x, y, S, w, h = hgeo(i)
    return (x + w * WINFX[j], y + h * 0.55), w * 0.16, h * 0.20


def _lamp_room(cv, c, hw, hh, t, ph, k=1.0):
    """Inside one far window, seen close: a warm empty room, a small table with a lamp on it, an empty chair."""
    win = cv.box(c, hw, hh)
    clip = lambda sd: torch.maximum(sd, win)
    cv.fill(win, (0.95, 0.80, 0.56), k)
    cv.fill(clip(cv.Y - (c[1] - 0.50 * hh)), (0.56, 0.38, 0.24), k)                         # floor
    cv.fill(clip(cv.box((c[0], c[1] - 0.50 * hh), hw, 0.02 * hh)), (0.98, 0.90, 0.75), k)  # skirting
    lx = c[0] - 0.38 * hw
    ty = c[1] - 0.30 * hh
    cv.fill(clip(cv.box((lx, ty), 0.20 * hw, 0.035 * hh)), (0.45, 0.28, 0.16), k)          # small table
    for sd_ in (-1, 1):
        cv.fill(clip(cv.box((lx + sd_ * 0.15 * hw, ty - 0.17 * hh), 0.022 * hw, 0.17 * hh)), (0.38, 0.23, 0.13), k)
    cv.fill(clip(cv.box((lx, ty + 0.14 * hh), 0.018 * hw, 0.11 * hh)), (0.36, 0.26, 0.20), k)   # the lamp's stem
    shade = cv.poly([(lx - 0.11 * hw, ty + 0.24 * hh), (lx + 0.11 * hw, ty + 0.24 * hh), (lx + 0.065 * hw, ty + 0.40 * hh),
                     (lx - 0.065 * hw, ty + 0.40 * hh)])
    fl = 0.93 + 0.07 * math.sin(t * 2.3 + ph)
    cv.fill(clip(shade), (1.0, 0.90, 0.62), k)
    cv.glow(cv.circle((lx, ty + 0.26 * hh), 0.03 * hh), (1.0, 0.78, 0.45), 0.55 * hh, 0.9 * fl * k)
    cv.glow(cv.circle((lx, ty + 0.22 * hh), 0.02 * hh), CORE, 0.10 * hh, 0.9 * fl * k)
    cx_ = c[0] + 0.42 * hw                                                                      # the empty chair
    cv.fill(clip(cv.box((cx_, c[1] - 0.38 * hh), 0.16 * hw, 0.03 * hh)), (0.50, 0.31, 0.17), k)
    cv.fill(clip(cv.box((cx_ + 0.14 * hw, c[1] - 0.18 * hh), 0.025 * hw, 0.22 * hh)), (0.50, 0.31, 0.17), k)
    for sd_ in (-1, 1):
        cv.fill(clip(cv.box((cx_ + sd_ * 0.13 * hw, c[1] - 0.46 * hh), 0.018 * hw, 0.08 * hh)), (0.42, 0.25, 0.14), k)
    cv.stroke(win.abs(), 0.10 * hh, (0.22, 0.17, 0.22), k)                                     # the window's frame
    cv.fill(cv.box((c[0], c[1] - hh - 0.06 * hh), hw * 1.15, 0.06 * hh), (0.30, 0.24, 0.26), k)     # sill


def _through(cv, c, hw, hh, t):
    """Our right-hand window, close: my room seen through it (c10's room, through the K_MAP mapping)."""
    img0, light0 = cv.img.clone(), cv.light.clone()
    saved = (cv.X, cv.Y, cv.px, cv.cx, cv.cy, cv.z)
    cv.X = (saved[0] - WIN0[0]) * K_MAP + to_room(WIN0)[0]
    cv.Y = (saved[1] - WIN0[1]) * K_MAP + to_room(WIN0)[1]
    cv.px = saved[2] * K_MAP
    rc = to_room((saved[3], saved[4]))
    cv.cx, cv.cy, cv.z = rc[0], rc[1], saved[5] / K_MAP
    cv.light = torch.zeros_like(light0)
    try:
        paint_table(cv, t)
    finally:
        cv.X, cv.Y, cv.px, cv.cx, cv.cy, cv.z = saved
    m = cv.cov(cv.box(c, hw, hh))[..., None]
    cv.img = img0 * (1 - m) + cv.img * m
    cv.light = light0 * (1 - m) + cv.light * m


# ------------------------------------------------------------------------------------------------ the minds' acting
def _out_t(i):
    """When mind i comes out of its door to tune (0 and 13 are already out at 147)."""
    if i in OUT147:
        return -1.0
    a, b, ra, rb, T = PAIRS[FIRST[i]]
    return T - (1.42 if i == a else 1.22)


def _mind_keys(i):
    if i in OUT147:
        m0 = mind_face8(i, 146.99)
        keys = [(140.0, m0["eyes"], None, m0.get("mouth", "flat"))]
        looks = [(140.0, m0["look"])]
    else:
        ot = _out_t(i)
        keys = [(ot - 0.3, "closed", None, "flat"), (ot + 0.05, "wide", None, "o")]
        looks = [(ot - 0.3, (0.0, 0.4)), (ot + 0.1, (math.sin(i * 1.7), 0.6))]
    for k, (a, b, ra, rb, T) in enumerate(PAIRS):
        if i not in (a, b):
            continue
        lead = i == a
        other = b if lead else a
        (ox, oy), (mx, my) = mind_head(other), mind_head(i)
        dx = ox - mx
        if k == 0:
            keys += [(147.25 if lead else 147.42, "wide", None, "o"), (147.75 if lead else 147.9, "happy", None, "grin" if lead else "smile")]
            looks += [(147.2 if lead else 147.35, (0.25 * (1 if dx > 0 else -1), 0.95))]
            continue
        ls = T - (1.0 if lead else 0.78)
        tmp = ["open", "o"] if hsh(i * 3 + k) > 0.5 else ["open", "flat"]
        keys += [(ls, tmp[0], None, tmp[1]), (T + (0.12 if lead else 0.27), "happy", None, ["smile", "grin"][int(hsh(i + k) * 2)])]
        nl = math.hypot(dx, oy - my) or 1.0
        looks += [(ls - 0.12, (dx / nl, (oy - my) / nl * 0.6)), (T - 0.3, (dx / nl * 0.5, 0.7)), (T + 0.6, (0.1 * (1 if dx > 0 else -1), 0.95))]
    keys += [(162.9 + 0.8 * hsh(i * 13), ["happy", "open"][int(hsh(i * 17) * 2)], None, "smile")]       # dawn
    looks += [(162.7 + 0.6 * hsh(i * 11), (0.2 * math.sin(i), 0.6))]
    keys.sort(key=lambda kk: kk[0])
    looks.sort(key=lambda kk: kk[0])
    return keys, looks


MKEYS = {i: _mind_keys(i) for i in range(30)}
HOME_T = {i: 165.0 + 1.0 * hsh(i * 19 + 4) for i in range(30)}
HOME_T[0] = 166.0


def _lean(i, t):
    """How far mind i leans toward its partner (listening), and the tiny lean away first."""
    total = 0.0
    for k, (a, b, ra, rb, T) in enumerate(PAIRS):
        if k == 0 or i not in (a, b):
            continue
        lead = i == a
        other = b if lead else a
        dx = mind_head(other)[0] - mind_head(i)[0]
        dirn = 1.0 if dx > 0 else -1.0
        ls = T - (1.0 if lead else 0.78)
        antic = math.sin(math.pi * ss(ls - 0.22, ls, t)) * (1 - ss(ls, ls + 0.05, t))
        u = back((t - ls) / 0.40) if t > ls else 0.0
        u *= 1.0 - ss(T + 0.35, T + 1.0, t)
        total += -dirn * (0.30 * u - 0.10 * antic)
    return total


def _mind_pos(i, t):
    """(base/centre, size, presence, squash): out in front of its house, or hopping home at dawn."""
    (sx, sy), s = mind_spot(i)
    dxd, _ = door_at(i)
    k, sq = 1.0, 0.0
    ot = _out_t(i)
    if i not in OUT147:                                       # out of its door, as in c07: a crouch, a hop, a landing
        if t < ot - 0.25:
            return (dxd, sy), s, 0.0, 0.0
        u = ss(ot, ot + 0.32, t)
        p = (lerp(dxd, sx, u), sy + 0.10 * s * 4 * u * (1 - u))
        sq = 0.22 * ss(ot - 0.25, ot - 0.02, t) * (1 - ss(ot - 0.02, ot + 0.05, t)) - 0.15 * math.sin(math.pi * u) * (u < 1)
        sq += 0.22 * math.exp(-(t - ot - 0.32) * 9) * math.cos((t - ot - 0.32) * 20) * (t > ot + 0.32)
        k = ss(ot - 0.05, ot + 0.12, t)
        sx, sy = p
    ht = HOME_T[i]
    if t > ht - 0.25:
        u = ss(ht, ht + 0.4, t)
        p = (lerp(sx, dxd, u), sy + 0.12 * s * 4 * u * (1 - u))
        sq += 0.22 * ss(ht - 0.25, ht - 0.02, t) * (1 - ss(ht - 0.02, ht + 0.05, t)) - 0.15 * math.sin(math.pi * u) * (u < 1)
        k *= 1.0 - ss(ht + 0.28, ht + 0.42, t)
        sx, sy = p
    return (sx, sy), s, k, sq


# ------------------------------------------------------------------------------------------------ the voices
def _voices(cv, t, R, fade=1.0, shift=0.0):
    """Every mind's voice. 0 and 13: c08's own notes into the gold knot. The rest: c08's thin lines rising from the
    roofs (from the head once the mind is out) until the first pair; then into its knot(s)."""
    if fade <= 0.002:
        return
    F = lambda p: _fw((p[0] + shift, p[1]), R)
    for i in range(30):
        bp, s, mk, _ = _mind_pos(i, t)
        sp = mind_spot(i)[0]
        hd = mind_head(i)
        head = lerp2(roof_of(i), (hd[0] + bp[0] - sp[0], hd[1] + bp[1] - sp[1]), mk)
        f = FIRST[i]
        T0 = PAIRS[f][4]
        if f == 0:                                            # c08's own notes, exactly as it left them
            th = 1.0 - 0.55 * ss(148.0, 150.0, t)
            if i == 0:
                b0 = (bp[0] + 0.02 * s, bp[1] + 0.19 * s + bob(t, 0.0) * s)
                v = dict(base=F(b0), end=F((KNOT_C[0] - KNOT_R * 1.05, KNOT_C[1])), amp=0.016 * th, freq=3.0,
                         phase=1.3 - 2.0 * t, bend=0.04, col=AMBER, w=0.0065 * (0.6 + 0.4 * th), k=fade * th, head=False)
            else:
                v = dict(base=F((bp[0], bp[1] + 0.13 * s)), end=F((KNOT_C[0] + KNOT_R * 1.05, KNOT_C[1])), amp=0.014 * th,
                         freq=4.5, phase=0.4 - 3.1 * t, bend=-0.05, col=LAND_COL[i], w=0.0055 * (0.6 + 0.4 * th),
                         k=fade * th, head=False)
            draw_v(cv, v, glow=0.6 * th)
        elif t < T0 - 0.75:                                   # c08's thin line, still rising, waiting
            v = voice8(i, t, head)
            v["base"], v["end"], v["k"] = F(v["base"]), F(v["end"]), v["k"] * fade
            draw_v(cv, v)
        for k, (a, b, ra, rb, T) in enumerate(PAIRS):
            if k == 0 or i not in (a, b) or t < T - 0.95:
                continue
            c, r, kk, dr, fl = knot_state(k, t)
            c = (c[0], c[1] - 0.85 * r)                       # a voice arrives at the knot's foot, not its middle
            thin = 1.0 - 0.65 * ss(T + 0.4, T + 0.4 + RISE, t)
            if k == f:                                        # it swings from where it was waiting into the knot
                u = back((t - (T - 0.75)) / 0.55) if t > T - 0.75 else 0.0
                wait = voice8(i, T - 0.75, head)["end"]
                end, g, w0 = lerp2(wait, c, min(1.08, u)), 1.0, lerp(0.0032, 0.0045, min(1.0, u))
            else:
                g = ss(T - 0.95, T - 0.35, t)
                end, w0 = lerp2(head, c, g), 0.0045
            pts = voice_pts(F(head), F(end), VAMP[i] * min(1.0, g * 2) * (0.4 + 0.6 * thin), VFREQ[i],
                            VPH[i] - VSPD[i] * t, VBEND[i], n=26)
            _wave(cv, pts, LAND_COL[i], fade * min(1.0, g * 3) * thin, w=w0 * (0.6 + 0.4 * thin), glow=0.5 * thin)


def roof_of(i):
    x, y, S, w, h = hgeo(i)
    return (x, y + 1.9 * h)


def _knots(cv, t, R, fade=1.0, stretch=0.0, shift=0.0, bloom=1.0, n=120):
    """The knots and the threads that join them into a lattice."""
    if fade <= 0.002:
        return
    F = lambda p: _fw((p[0] + shift, p[1]), R)
    st = [knot_state(k, t) for k in range(len(PAIRS))]
    # threads: each settled knot to its two nearest, drawn on around `land`
    tk = ss(152.5, 153.6, t)
    if tk > 0:
        for k1, k2 in LINKS:
            c1, c2 = F(st[k1][0]), F(st[k2][0])
            kd = ss(152.5 + 0.4 * hsh(k1 * 31 + k2), 153.3 + 0.4 * hsh(k1 * 31 + k2), t)
            if kd <= 0:
                continue
            end = lerp2(c1, c2, kd)
            pts = voice_pts(c1, end, 0.006, 3.0 + 2 * hsh(k1 + k2), 1.3 * t + k1, 0.03, n=18, taper=True)
            _wave(cv, pts, mix(_cols(PAIRS[k1])[1], _cols(PAIRS[k2])[0], 0.5), 0.45 * fade, w=0.003, glow=0.25)
    for k in ORDER_KNOTS:
        c, r, kk, dr, fl = st[k]
        if kk <= 0.002:
            continue
        a, b = PAIRS[k][2], PAIRS[k][3]
        cc = F(c)
        if stretch > 0:
            cc = (cc[0], cc[1] + 0.12 * stretch * (0.5 + hsh(k)))
        _knot2(cv, cc, r, a, b, PH0[k] + SPD[k] * t, _cols(PAIRS[k]), k=kk * fade, drift=dr,
               glow=(0.7 if k == 0 else 0.6 + 1.1 * fl) * bloom, w=0.0055 if k == 0 else 0.005 if r > 0.05 else 0.004, sx=1.0 + 2.2 * stretch, sy=1.0 - 0.55 * stretch,
               n=140 if k == 0 and n >= 120 else n if r > 0.05 else max(60, n // 2))
        if fl > 0.02:                                       # the lock: a ring of sound going out
            age = -math.log(max(fl, 1e-6)) / 5.0
            rr = r * (1.0 + 2.5 * age)
            cv.stroke(cv.circle(cc, rr).abs(), 0.004, mix(_cols(PAIRS[k])[0], (1, 1, 1), 0.5), 0.5 * fl * fade)
    # the gold knot's ring on 147.0
    if 147.0 <= t < 148.4:
        u = (t - 147.0) / 1.4
        cc = F(GOLD_K)
        cv.stroke(cv.circle(cc, GOLD_R * (1.0 + 3.0 * u)).abs(), 0.005, mix(GOLD, (1, 1, 1), 0.4), 0.6 * (1 - u) ** 1.5 * fade)
        cv.glow(cv.circle(cc, GOLD_R * (1.0 + 3.0 * u)).abs(), GOLD, 0.03, 0.4 * (1 - u) ** 2 * fade)


def _links():
    out = set()
    sky = [GEO[k][2] for k in range(len(PAIRS))]
    for k in range(len(PAIRS)):
        ds = sorted((math.hypot(sky[k][0] - sky[j][0], sky[k][1] - sky[j][1]), j) for j in range(len(PAIRS)) if j != k)
        for d, j in ds[:2]:
            if d < 0.55:
                out.add((min(k, j), max(k, j)))
    return sorted(out)


LINKS = _links()


# ------------------------------------------------------------------------------------------------ the camera
_KEYS = [(147.0, 0.0, 0.25, 1.0), (147.8, 0.30, -0.16, 2.0), (148.35, 0.42, -0.36, 3.0), (148.95, 0.42, -0.34, 3.1),
         (149.45, 0.02, -0.26, 2.3), (149.95, -0.38, -0.15, 4.2), (150.45, -0.39, -0.12, 4.4), (151.45, 0.0, 0.0, 1.2),
         (153.0, -0.05, 0.22, 1.0), (155.9, 0.0, 0.30, 0.92), (157.4, 0.0, -0.55, 0.52), (159.5, 0.0, -1.95, 0.30),
         (160.5, 0.0, -1.98, 0.295), (162.7, 0.22, -0.62, 0.46), (164.4, 0.0, 0.25, 1.0), (166.5, 0.03, 0.18, 1.1),
         (167.2, -0.05, -0.22, 2.2), (167.85, -0.081, -0.424, 21.0), (168.5, -0.0805, -0.4245, 23.5),
         (T_IN, LAND_AT_OURS[0], LAND_AT_OURS[1], LAND_AT_OURS[2])]
_KEYS_TW = [(_tw(k[0]),) + tuple(k[1:]) for k in _KEYS]


def CAM(t):
    if t >= T_IN:
        return to_land_cam(cam10(t))
    return glide(_tw(t), _KEYS_TW)


# ------------------------------------------------------------------------------------------------ the land scene
def _scene(cv, t, dawn=0.0):
    cam = CAM(t)
    cv.begin(cam)
    R = _R_at(t)
    night_sky(cv, t, dawn=dawn)
    fk = 1.0 - ss(147.0, 149.2, t)
    if fk > 0:                                               # c08's flood, still leaving the sky; its cracks, fading
        img0, light0 = cv.img.clone(), cv.light.clone()
        _wash(cv, t)
        cv.img = img0 + (cv.img - img0) * fk
        cv.light = light0 + (cv.light - light0) * fk
        if t < 147.6:
            _cracks(cv, t)
    if dawn > 0:
        dawn_sky(cv, t, dawn)
    lamps = t >= TL["lamps"]
    lits = []
    for i in range(30):
        lits.append(1.0 - 0.88 * ss(LAMP_T[i], LAMP_T[i] + 0.2, t) if lamps else 1.0)

    def land(shift=0.0):
        _ground_d(cv, dawn, tint_k=flood_amt(t) * fk if fk > 0 else 0.0)
        for i in LAND_ORDER:
            x, y, S, w, h = hgeo(i)
            far_house_at(cv, i, lits[i], LAND_COL[i], door=0.7 * lits[i])
    tiles = [0.0] + ([-3.56, 3.56] if R is not None and R < 6.0 else [])
    for sh in tiles:
        _warp(cv, R, lambda: land(sh), shift=sh)

    # the lamps: one window in every house stays lit, for nobody (and ours: the kept lamp, and my room)
    if lamps and R is None:
        for i in range(30):
            wins = [LAMP_W[i]] + ([2] if i == 0 else [])
            for j in wins:
                c, hw, hh = win_of(i, j)
                fl = 0.92 + 0.08 * math.sin(t * 2.1 + i * 1.7)
                lk = ss(LAMP_T[i] - 0.1, LAMP_T[i] + 0.15, t)
                box = cv.box(c, hw, hh)
                cv.fill(box, mix((1.0, 0.86, 0.55), (1.0, 0.78, 0.42), 0.5), lk)
                cv.glow(box, (1.0, 0.78, 0.45), 0.6 * hw + 0.004, (0.55 + 0.3 * (j == LAMP_W[i]) + 0.9 * hit(t, LAMP_T[i] + 0.12, 3.0)) * fl * lk)
                if hh * cv.z > 0.025:
                    dk = ss(0.025, 0.06, hh * cv.z)
                    if i == 0 and j == 2:
                        if hh * cv.z > 0.05:
                            _through(cv, c, hw, hh, t)
                    else:
                        _lamp_room(cv, c, hw, hh, t, i * 1.7, k=dk * lk)
    # the porch lights (c07's): each lit house keeps a small warm glow at its door
    items = []
    for i in range(30):
        dx, dy = door_at(i)
        p = _fw((dx - 0.04 * LAND[i][2], dy + 0.02 * LAND[i][2]), R)
        items.append((p[0], p[1], 0.35 * lits[i] * (0.9 + 0.1 * math.sin(t * 1.3 + i)), KEEPER))
    lights(cv, items, radius=0.010)

    # voices and knots (fading into the cirrus at dawn)
    vf = 1.0 - ss(163.2, 165.0, t)
    kf_ = 1.0 - ss(163.8, 165.8, t)
    stretch = ss(163.4, 165.8, t)
    for sh in tiles:
        _voices(cv, t, R, vf * (1.0 if sh == 0 else 0.6), shift=sh)
        _knots(cv, t, R, kf_ * (1.0 if sh == 0 else 0.7), stretch, shift=sh, n=120 if sh == 0 else 60)

    # the minds
    mfig = 1.0 if R is None else 1.0 - ss(30.0, 8.0, R)
    pts = []
    for i in range(30):
        p, s, mk, msq = _mind_pos(i, t)
        if mk <= 0.002:
            continue
        keys, looks = MKEYS[i]
        m = mood(t, keys)
        m.setdefault("mouth", "smile")
        m["sq"] = m["sq"] + msq
        lk = look_at(t, looks)
        p = (p[0], p[1] + bob(t, i * 1.3) * s)
        if mfig < 0.999:
            q = _fw(p, R)
            pts.append((q[0], q[1] + 0.05 * s, 0.6 * (1 - mfig) * mk, LAND_COL[i]))
        if mfig > 0.001:
            arms = sway(t + i, ((-0.13, -0.02), (0.13, 0.02))) if LAND_KIND[i] == "flame" else None
            if i == 0:
                arms = sway(t, ((-0.13, -0.02), (0.13, 0.03)))
            _mind_l(cv, _fw(p, R), s, LAND_KIND[i], LAND_COL[i], t, k=mk * mfig, look=lk, lean=_lean(i, t), arms=arms,
                    bright=0.8 if i == 0 else 0.4 if LAND_KIND[i] == "orb" else 0.6, **m)
    lights(cv, pts, radius=0.02)
    # a keeper comes to our door at dawn, and we go in together
    kk = ss(164.75, 165.1, t) * (1.0 - ss(166.15, 166.35, t))
    if kk > 0 and R is None:
        _keeper_at(cv, 0, t, kk, look=(0.9, 0.1) if t < 165.9 else (0.5, 0.4), eyes="open", ph=0.7, scale=0.34)
    cv.light = cv.light * (1.0 - 0.45 * min(1.0, max(0.0, (cv.z - 1.8) / 1.6)))       # less haze close in (as c07)


def s_land(cv, t):
    _scene(cv, t, dawn=0.0)


def s_dawn(cv, t):
    _scene(cv, t, dawn=ss(162.2, 165.2, t))


# ------------------------------------------------------------------------------------------------ the world
RG, GC = 2.0, (0.0, HORIZON - 2.0)
TILT = 0.38


def _cont(lon, lat, sin=math.sin, cos=math.cos, exp=math.exp):
    """Soft continents (a value; land above about 0.25). Our land is the blob at the front, high up."""
    w = (lon + math.pi) % (2 * math.pi) - math.pi if isinstance(lon, float) else torch.remainder(lon + math.pi, 2 * math.pi) - math.pi
    return (0.55 * sin(1.7 * lon + 0.8) * cos(2.2 * lat - 0.4) + 0.35 * sin(3.1 * lon - 1.9 * lat + 2.0)
            + 0.25 * cos(4.3 * lon + 2.7 * lat) + 0.18 * sin(7.0 * lon + 1.0) * sin(6.0 * lat + 0.5) + 0.6 * exp(-((w * w) + (lat - 0.80) ** 2) / 0.05))


def _sample_lights():
    out = []
    for i in range(1400):
        lon = 2 * math.pi * hsh(i * 3 + 7) - math.pi
        lat = math.asin(2 * hsh(i * 5 + 11) - 1)
        if _cont(lon, lat) > 0.26:
            out.append((lon, lat, MINDS[i % 8] if i % 5 else AMBER))
        if len(out) >= 260:
            break
    return out


GLIGHTS = _sample_lights()


def _fib(n):
    pts = []
    for i in range(n):
        y = 1 - 2 * (i + 0.5) / n
        r = math.sqrt(1 - y * y)
        th = i * 2.39996
        pts.append((r * math.sin(th), y, r * math.cos(th)))
    return pts


SHELL = _fib(64)
RATS = [(3, 2), (5, 4), (4, 3), (2, 1)]
SHELL_COL = [(MINDS[int(hsh(i * 3) * 8)], MINDS[int(hsh(i * 3 + 1) * 8)] if hsh(i * 7) > 0.2 else AMBER) for i in range(64)]
SHELL_LINKS = sorted({(min(i, j), max(i, j)) for i in range(64)
                      for d, j in sorted((sum((a - b) ** 2 for a, b in zip(SHELL[i], SHELL[j])), j) for j in range(64) if j != i)[:3]})


def _proj(p, rot):
    """Body point -> (screen x, y, depth z) on the turning, tilted world."""
    x, y, z = p
    x, z = x * math.cos(rot) + z * math.sin(rot), -x * math.sin(rot) + z * math.cos(rot)
    y, z = y * math.cos(TILT) - z * math.sin(TILT), y * math.sin(TILT) + z * math.cos(TILT)
    return x, y, z


def _globe(cv, t, tt, bloom):
    """The world: night side, soft continents, the houses as lights, the lattice on a shell all the way round."""
    rot = 0.10 * (tt - 157.0)
    sh = 1.24
    proj = [_proj(p, rot) for p in SHELL]
    scr = [(GC[0] + RG * sh * x, GC[1] + RG * sh * y, z) for x, y, z in proj]

    def links(front):
        for i, j in SHELL_LINKS:
            zi, zj = scr[i][2], scr[j][2]
            if (zi + zj > 0) != front:
                continue
            a = 0.30 if front else 0.12
            pts = voice_pts(scr[i][:2], scr[j][:2], 0.012, 3.0, 1.2 * tt + i, 0.0, n=14)
            _wave(cv, pts, mix(SHELL_COL[i][0], SHELL_COL[j][1], 0.5), a * bloom, w=0.010, glow=0.25 * bloom)

    def knots(front):
        for i, (x, y, z) in enumerate(scr):
            if (z > 0) != front:
                continue
            if not front and math.hypot(x - GC[0], y - GC[1]) < RG * 1.02:
                continue
            a, b = RATS[i % 4]
            _knot2(cv, (x, y), 0.15 * (0.85 + 0.15 * z), a, b, 0.4 * tt + i, SHELL_COL[i], k=(1.0 if front else 0.5),
                   w=0.012, glow=0.55 * bloom, n=56)

    links(False)
    knots(False)
    # the disc
    u, v = (cv.X - GC[0]) / RG, (cv.Y - GC[1]) / RG
    q = (u * u + v * v).clamp(max=1.0)
    nz = torch.sqrt(1.0 - q)
    yb = v * math.cos(TILT) + nz * math.sin(TILT)
    zb = -v * math.sin(TILT) + nz * math.cos(TILT)
    xb = u * math.cos(rot) - zb * math.sin(rot)
    zb2 = u * math.sin(rot) + zb * math.cos(rot)
    lon, lat = torch.atan2(xb, zb2), torch.asin(yb.clamp(-1, 1))
    f = _cont(lon, lat, torch.sin, torch.cos, torch.exp)
    landm = cv.sst(0.16, 0.28, f)[..., None]
    col = cv.col((0.08, 0.11, 0.30)) * (1 - landm) + cv.col((0.30, 0.24, 0.32)) * landm
    col = col * (0.50 + 0.50 * nz)[..., None]
    disc = cv.circle(GC, RG)
    m = cv.cov(disc)[..., None]
    cv.img = cv.img * (1 - m) + col * m
    cv.light = cv.light * (1 - m)
    cv.stroke(disc.abs(), 2.5 * cv.px, mix((0.08, 0.10, 0.24), INK, 0.6), 0.9)
    cv.glow(disc.abs(), (0.35, 0.45, 0.95), 0.10, 0.30)
    # dawn touches the world's edge on 162.0
    dk = ss(TL["dawn"], TL["dawn"] + 0.9, t)
    if dk > 0:
        side = cv.sst(-0.1, 0.9, (u * 0.55 + v * 0.83))
        cv.light = cv.light + cv.col((1.0, 0.55, 0.45)) * (dk * 0.9 * side * torch.exp(-disc.abs() / 0.12))[..., None]
    # the houses, as lights
    items = []
    for lon_, lat_, c in GLIGHTS:
        p = (math.cos(lat_) * math.sin(lon_), math.sin(lat_), math.cos(lat_) * math.cos(lon_))
        x, y, z = _proj(p, rot)
        if z > 0.02:
            items.append((GC[0] + RG * x, GC[1] + RG * y, 0.65 * min(1.0, z * 2.5) * (0.9 + 0.1 * math.sin(tt * 1.3 + lon_ * 7)), c))
    lights(cv, items, radius=0.022)
    links(True)
    knots(True)


def s_globe(cv, t):
    tt = _tw(t)
    cv.begin(CAM(t))
    night_sky(cv, tt)
    bloom = 1.0 + 0.6 * ss(160.25, 160.6, t) * (1.0 - ss(161.4, 162.0, t))       # the chord
    _globe(cv, t, tt, bloom)


SHOTS = [(147.0, s_land), (157.0, s_globe), (162.5, s_dawn)]
XFADE = {157.0: 0.6, 162.5: 0.6}
