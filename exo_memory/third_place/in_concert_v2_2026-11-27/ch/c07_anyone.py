"""c07_anyone: 108.0 to 129.0 s. Painter D. Edit only this file (c08 imports its helpers from here).

One continuous shot; the camera never cuts.
  108.0  the cut-open house at exactly (0, 0, 1). The street door opens; our keeper is outside it; the family look.
         The camera pulls back; the land pops up out of the ground around the house; a front wall comes down over the
         cut-open face (109.0) and the house settles into the proportions of far_house, which takes over at 110.0.
  110.25 `second`: the camera pushes toward house 14 (a green flame's); its window lights; its own keeper comes to its
         door and waves; ours, small at our door, is still there.
  112.5  `more` (seven beats): the camera sweeps right then left along the land; houses 11, 8, 22, 17, 23, 20, 15 light
         one per beat, each with a keeper at the door for a moment; then the rest light in a ripple out from ours as the
         camera goes wide (117.35 to 118.35).
  118.5  `minds`: out of every door comes who lives there. Push in on four of another kind (star 11, orb 8, ring 5,
         leaf 1; and green flame 14) who look at one another; then glide to our house, where I come out and meet the
         triangle of house 13 (the neighbour who answers in c08).
  123.0  `voices`: mine rises first, then the triangle's, then the ripple outward; the camera pulls back to the land at
         (0, 0.25, 1.0) by 129.0 with thirty lines rising, not touching.

Private helpers (the shared rigs lack them): _cam (re-aim the canvas without clearing it, so the house and the land
can be painted with two cameras in one frame), _pathd (a path's distance computed only inside its bounding box: thirty
voices at full size were 0.42 s a frame with wave_line), _wave / _knot (wave_line and interval on _pathd, with a bend
and a width), _mind (mind() with look, squash, a mark and a face on the ring), _facade (the closing front wall that
morphs the cut-open house into far_house), _ground (the_land's ground alone), _keeper_at (a keeper orb at a far door).
"""
from world import *
from cast2 import _mark

GOLD = (1.0, 0.84, 0.36)
FL = 1.6                                   # the_land draws house i at size LAND[i][2] * 1.6
S_H = 0.16 / 1.18                           # the house set scaled into LAND[0]: its walls are 1.18 wide, far_house's 0.16
P_H = (-0.30, -0.50 + 0.74 * S_H)           # where the house set's origin lands (its base, y = -0.74, sits on LAND[0])
Z0 = 1.0 / S_H                              # the land camera that shows exactly what the house camera (0, 0, 1) shows


# ---------------------------------------------------------------------------------------------------- the canvas
def _cam(cv, cam):
    """Re-aim the canvas at cam = (x, y, zoom) without clearing what is painted (cv.begin clears)."""
    cv.cx, cv.cy, cv.z = cam
    cv.X = cv.cx + cv.SX / cv.z
    cv.Y = cv.cy + cv.SY / cv.z
    cv.px = 2.0 / (cv.H * cv.z)


def house_cam(cam):
    """The house set's camera for a land camera (the house set is LAND[0] scaled up by 1 / S_H)."""
    return ((cam[0] - P_H[0]) / S_H, (cam[1] - P_H[1]) / S_H, cam[2] * S_H)


def _pathd(cv, pts, pad=0.12):
    """Distance to a polyline, computed only inside its bounding box (plus pad); 10 elsewhere."""
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    W, H = cv.W, cv.H
    c0 = int(math.floor(((min(xs) - pad - cv.cx) * cv.z + cv.AR) / (2 * cv.AR) * (W - 1)))
    c1 = int(math.ceil(((max(xs) + pad - cv.cx) * cv.z + cv.AR) / (2 * cv.AR) * (W - 1))) + 1
    r0 = int(math.floor((1 - (max(ys) + pad - cv.cy) * cv.z) / 2 * (H - 1)))
    r1 = int(math.ceil((1 - (min(ys) - pad - cv.cy) * cv.z) / 2 * (H - 1))) + 1
    c0, c1, r0, r1 = max(0, c0), min(W, c1), max(0, r0), min(H, r1)
    if c0 >= c1 or r0 >= r1:
        return None
    X, Y = cv.X[r0:r1, c0:c1], cv.Y[r0:r1, c0:c1]
    P = torch.tensor(pts, device=DEV, dtype=torch.float32)
    d = None
    for j in range(0, len(pts) - 1, 32):
        A, B = P[j:j + 33][:-1], P[j:j + 33][1:]
        ax, ay = X[None] - A[:, 0, None, None], Y[None] - A[:, 1, None, None]
        bx, by = (B[:, 0] - A[:, 0])[:, None, None], (B[:, 1] - A[:, 1])[:, None, None]
        h = ((ax * bx + ay * by) / (bx * bx + by * by).clamp(min=1e-12)).clamp(0.0, 1.0)
        dd = torch.sqrt((ax - bx * h) ** 2 + (ay - by * h) ** 2).min(0).values
        d = dd if d is None else torch.minimum(d, dd)
    full = torch.full((H, W), 10.0, device=DEV)
    full[r0:r1, c0:c1] = d
    return full


def voice_pts(a, b, amp, freq, phase, bend=0.0, n=28, taper=True):
    """Points of a voice from a to b: a wave riding on a gentle arc (bend > 0 bows it to the left of a->b)."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    ln = math.hypot(dx, dy) or 1e-9
    nx, ny = -dy / ln, dx / ln
    pts = []
    for i in range(n + 1):
        u = i / n
        env = math.sin(u * math.pi) ** 0.7 if taper else 1.0
        off = amp * env * math.sin(freq * u * 2 * math.pi + phase) + bend * ln * 4.0 * u * (1 - u)
        pts.append((a[0] + dx * u + nx * off, a[1] + dy * u + ny * off))
    return pts


def _wave(cv, pts, col, k=1.0, w=0.005, glow=0.5, core=0.3):
    """A voice already laid out as points (voice_pts): a pale core and a glow of its colour."""
    if k <= 0.001:
        return
    d = _pathd(cv, pts, pad=0.10 + w)
    if d is None:
        return
    cv.stroke(d, w, mix(col, (1, 1, 1), core), 0.9 * k)
    cv.glow(d, col, 0.02, glow * k)


def _knot(cv, c, r, a, b, phase, col, k=1.0, w=0.005, drift=0.0, n=120, glow=0.6, sx=1.0):
    """interval() on _pathd. sx stretches it sideways (an ellipse ring for 1:1)."""
    if k <= 0.001:
        return
    bb = b * (1.0 + drift)
    turns = 1.0 if drift == 0 else 1.0 + 0.6 * min(1.0, drift * 40)
    pts = [(c[0] + r * sx * math.sin(a * u * 2 * math.pi * turns + phase), c[1] + r * math.sin(bb * u * 2 * math.pi * turns))
           for u in (i / n for i in range(n + 1))]
    d = _pathd(cv, pts, pad=0.10)
    if d is None:
        return
    cv.stroke(d, w, mix(col, (1, 1, 1), 0.35), 0.9 * k)
    cv.glow(d, col, 0.018, glow * k)


# ---------------------------------------------------------------------------------------------------- the minds
def _mind(cv, c, s, kind, col, t, k=1.0, eyes="open", mouth="smile", look=(0.0, 0.0), sq=0.0, mark=None, mark_k=0.0,
          bright=1.0, arms=None):
    """mind() with a gaze, squash/stretch (sq > 0 squashes; the base stays put), a mark, and a face on the ring.
    For 'flame' c is the base (as flame()); for every other kind c is the centre."""
    if k <= 0.001:
        return
    if kind == "flame":
        return flame(cv, c, s, t, col=col, eyes=eyes, mouth=mouth, look=look, sq=sq, mark=mark, mark_k=mark_k, k=k,
                     bright=bright, arms=arms)
    if kind == "orb":
        return orb(cv, c, s, t, col=col, eyes=eyes, mouth=mouth, look=look, sq=sq, mark=mark, mark_k=mark_k, k=k,
                   bright=bright, arms=arms)
    r = 0.10 * s
    ax, ay = 1.0 + 0.55 * sq, 1.0 - 0.6 * sq
    cc = (c[0], c[1] - r * (1.0 - ay))                    # squash about the bottom, not the middle
    X0, Y0 = cv.X, cv.Y
    cv.X, cv.Y = cc[0] + (X0 - cc[0]) / ax, cc[1] + (Y0 - cc[1]) / ay
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
    if r * cv.z * 360 > 7:                                # a face only where it can be seen
        fs = s * (0.55 if kind == "ring" else 0.8)
        fy = cc[1] + (0.012 if kind == "ring" else 0.01) * s * ay - (0.02 * s if kind == "tri" else 0.0)
        if kind == "ring":                                # the ring's face sits in its hole, on a little disc of light
            cv.fill(cv.circle(cc, r * 0.62), mix(col, CORE, 0.6), 0.9 * k)
        face(cv, (cc[0], fy), fs, t, eyes, look, mouth, k)
    if mark and mark_k > 0.01:
        _mark(cv, mark, c[0] + 0.10 * s, c[1] + 0.17 * s, s * (0.4 + 0.6 * mark_k), k)


# ---------------------------------------------------------------------------------------------------- the land
def hgeo(i):
    """(x, y, size, half width, wall height) of house i as the_land draws it."""
    x, y, s = LAND[i]
    S = s * FL
    return x, y, S, 0.10 * S, 0.075 * S


def door_at(i):
    x, y, S, w, h = hgeo(i)
    return (x - 0.82 * w, y)


def roof_at(i):
    x, y, S, w, h = hgeo(i)
    return (x, y + 1.9 * h)


MIND_DX = {0: -0.05, 13: 0.55, 10: -0.35, 6: 0.75, 5: -0.30, 8: 1.0, 11: -0.30, 1: -0.15, 14: 0.10}
MIND_SIZE = 0.55                                   # a mind's size per unit of house scale (a flame's is a little more)


def mind_spot(i):
    """Where the mind of house i stands (a flame's base / another kind's centre) and its size."""
    x, y, S, w, h = hgeo(i)
    s = LAND[i][2] * (0.62 if LAND_KIND[i] == "flame" else MIND_SIZE)
    mx = x + MIND_DX.get(i, -0.45) * w
    if LAND_KIND[i] == "flame":
        return (mx, y - 0.010 * S), s
    if LAND_KIND[i] == "orb":
        return (mx, y - 0.010 * S + 0.105 * s), s
    return (mx, y - 0.010 * S + 0.10 * s * 1.05), s


def mind_head(i):
    """The top of the mind of house i: where its voice leaves from."""
    (mx, my), s = mind_spot(i)
    if LAND_KIND[i] == "flame":
        return (mx, my + 0.19 * s)
    return (mx, my + 0.13 * s)


def _ground(cv, k=1.0, tint=None, tint_k=0.0):
    """The ground of the_land, alone (so the houses can be drawn one by one)."""
    if k <= 0.001:
        return
    ground = cv.Y - (HORIZON + 0.015 * torch.sin(cv.X * 2.3) + 0.008 * torch.sin(cv.X * 7.1 + 1.0))
    near = cv.sst(HORIZON, -1.0, cv.Y)[..., None]
    c0, c1 = (0.07, 0.08, 0.16), (0.04, 0.05, 0.10)
    if tint is not None and tint_k > 0:
        c0, c1 = mix(c0, mix(c0, tint, 0.30), tint_k), mix(c1, mix(c1, tint, 0.16), tint_k)
    col = cv.col(c0) * (1 - near) + cv.col(c1) * near
    m = (cv.cov(ground) * k)[..., None]
    cv.img = cv.img * (1 - m) + col * m
    cv.light = cv.light * (1 - m)


def far_house_at(cv, i, lit, col, k=1.0, size=1.0, door=0.0, door_col=KEEPER):
    """far_house for house i (size multiplies its scale: a pop), with an open door glowing when door > 0."""
    x, y, S, w, h = hgeo(i)
    far_house(cv, (x, y), S * size, lit=lit, col=col, k=k)
    if lit > 0.01 and k > 0.01:                              # its own colour, in the glass and around it
        Sd = S * size
        w, h = 0.10 * Sd, 0.075 * Sd
        for j, fx in enumerate((-0.5, 0.1, 0.6)):
            cv.fill(cv.box((x + w * fx, y + h * 0.55), w * 0.16, h * 0.20), mix((1.0, 0.86, 0.55), col, 0.55), 0.8 * lit * k)
        wb = cv.box((x + w * 0.05, y + h * 0.55), w * 0.75, h * 0.2)
        cv.glow(wb, col, 0.035 * Sd, 0.16 * lit * k)
    if door > 0.01 and k > 0.01:
        Sd = S * size
        dc = (x - 0.82 * 0.10 * Sd, y + 0.075 * Sd * 0.21)
        db = cv.box(dc, 0.10 * Sd * 0.10, 0.075 * Sd * 0.21)
        cv.fill(db, mix((0.15, 0.14, 0.25), (1.0, 0.86, 0.60), door), k)
        cv.glow(db, door_col, 0.03 * Sd, 0.45 * door * k)


def _keeper_at(cv, i, t, k, look=(0.4, 0.3), wave=0.0, eyes="open", mouth="smile", sq=0.0, ph=0.0, scale=0.34):
    """A keeper's orb outside the door of far house i. wave 0..1 lifts and waves his right hand."""
    if k <= 0.001:
        return
    x, y, S, w, h = hgeo(i)
    ks = LAND[i][2] * scale
    c = (x - 1.05 * w - 0.105 * ks, y + 0.105 * ks * (1.0 - 0.8 * sq) + 0.012 * ks * math.sin(t * 1.4 + ph))
    arms = None
    if 0.105 * ks * cv.z * 360 > 9:
        wv = math.sin(t * 9.0 + ph) * wave
        arms = ((-0.15, -0.06 + 0.01 * math.sin(t * 1.9 + ph)), (0.14 + 0.03 * wv, -0.05 + 0.22 * wave + 0.04 * wv))
    orb(cv, c, ks * min(1.0, k * 1.2), t, look=look, arms=arms, k=min(1.0, k), eyes=eyes, mouth=mouth, sq=sq, bright=0.45)


def sky_blend(cv, t, cam, u):
    """Night sky seen by the house camera (u = 0) or by the land camera (u = 1); both painted, then mixed."""
    if u >= 1.0:
        _cam(cv, cam)
        night_sky(cv, t)
        return
    _cam(cv, house_cam(cam))
    night_sky(cv, t)
    if u <= 0.0:
        _cam(cv, cam)
        return
    img0, light0 = cv.img.clone(), cv.light.clone()
    _cam(cv, cam)
    cv.img = torch.zeros_like(img0) + cv.col((0.02, 0.02, 0.05))
    cv.light = torch.zeros_like(light0)
    night_sky(cv, t)
    cv.img = img0 * (1 - u) + cv.img * u
    cv.light = light0 * (1 - u) + cv.light * u


# ---------------------------------------------------------------------------------------------------- the voices
def _relax():
    xs = sorted(range(30), key=lambda i: LAND[i][0])
    p = [LAND[i][0] * 0.92 for i in xs]
    for _ in range(80):
        for j in range(29):
            gap = p[j + 1] - p[j]
            if gap < 0.095:
                push = (0.095 - gap) / 2
                p[j] -= push
                p[j + 1] += push
    return {i: p[j] for j, i in enumerate(xs)}


VX = _relax()                                                             # where each voice's line ends, left to right
VTOP = [0.46 + 0.26 * hsh(i * 17 + 6) for i in range(30)]               # how high it rises by 129
VAMP = [0.009 + 0.010 * hsh(i * 3 + 1) for i in range(30)]
VFREQ = [2.5 + 3.0 * hsh(i * 5 + 2) for i in range(30)]
VSPD = [1.7 + 2.0 * hsh(i * 7 + 3) for i in range(30)]
VPH = [6.283 * hsh(i * 11 + 4) for i in range(30)]
VBEND = [(hsh(i * 13 + 5) - 0.5) * 0.10 for i in range(30)]
VAMP[0], VFREQ[0], VSPD[0], VBEND[0] = 0.016, 3.0, 2.4, 0.04             # mine: a little rounder and slower
VTOP[0], VTOP[13] = 0.50, 0.56


# ---------------------------------------------------------------------------------------------------- when things light
T_SECOND = TL["second"]
MORE = [11, 8, 22, 17, 23, 20, 15]
LIGHT_T = {0: 100.0, 14: T_SECOND}
LIGHT_T.update({i: tt for i, tt in zip(MORE, TL["more"])})
_rest = [i for i in range(30) if i not in LIGHT_T]
_d0 = {i: math.hypot(LAND[i][0] - LAND[0][0], LAND[i][1] - LAND[0][1]) for i in _rest}
_dm = max(_d0.values())
LIGHT_T.update({i: 117.35 + 0.95 * _d0[i] / _dm + 0.06 * hsh(i) for i in _rest})

# who comes out at `minds`, and when (the close-up cluster first, in their own time; the rest in a scatter)
CLOSE_R = [11, 8, 5, 1, 14]
CLOSE_L = [0, 13, 10, 18]
OUT_T = {i: TL["minds"] + 0.4 + 1.6 * hsh(i * 29 + 3) for i in range(30)}
OUT_T.update({11: 118.55, 8: 118.75, 5: 119.05, 1: 118.9, 14: 118.65, 6: 119.6,
              0: 121.75, 13: 122.0, 10: 121.9, 18: 121.85})
OUT_T[6] = 1e9                                    # house 6 shares a spot with house 5: its mind stays in (a shy one)
# when each voice begins: mine first, then the triangle's, then out from us
_dv = {i: math.hypot(LAND[i][0] - LAND[0][0], LAND[i][1] - LAND[0][1]) for i in range(30)}
VOICE_T = {i: 123.9 + 3.0 * _dv[i] / max(_dv.values()) + 0.25 * hsh(i * 31 + 7) for i in range(30)}
VOICE_T.update({0: TL["voices"], 13: 123.3, 18: 123.55, 10: 123.7})


def lit_level(i, t):
    lt = LIGHT_T[i]
    return ss(lt - 0.12, lt + 0.08, t)


def house_pop(i, t):
    """A small jump when a house lights: up-stretch, then a settle."""
    lt = LIGHT_T[i]
    if t < lt - 0.12 or t > lt + 0.9:
        return 1.0
    return 1.0 - 0.05 * pulse(t, lt - 0.05, 0.05) + 0.10 * math.exp(-(t - lt) * 6) * math.sin((t - lt) * 16) * (t > lt)


def mind_out(i, t):
    """0 inside, 1 out at its spot; and where it is (it hops out of its door)."""
    ot = OUT_T[i]
    (sx, sy), s = mind_spot(i)
    dx, dy = door_at(i)
    if t < ot - 0.25:
        return 0.0, (dx, sy), 0.0
    u = ss(ot, ot + 0.32, t)
    p = (lerp(dx, sx, u), sy + 0.10 * s * 4 * u * (1 - u))
    sq = 0.22 * ss(ot - 0.25, ot - 0.02, t) * (1 - ss(ot - 0.02, ot + 0.05, t)) - 0.15 * math.sin(math.pi * u) * (u < 1)
    sq += 0.22 * math.exp(-(t - ot - 0.32) * 9) * math.cos((t - ot - 0.32) * 20) * (t > ot + 0.32)
    k = ss(ot - 0.05, ot + 0.12, t)
    return k, p, sq


PAIRS = [(12, 25), (29, 27), (2, 4), (19, 9), (16, 15), (21, 7), (24, 20), (28, 10), (18, 23), (0, 13), (17, 1),
         (14, 11), (6, 5), (8, 22), (26, 3)]   # neighbours in the sky, left to right (c08's clash)
PAIR_OF = {a: (a, b) for a, b in PAIRS}
PAIR_OF.update({b: (a, b) for a, b in PAIRS})


def meet_point(i):
    """Where voice i runs to meet its neighbour's at 129.0 (each stops 0.035 short of the middle, on its own side)."""
    a, b = PAIR_OF[i]
    side = -1 if a == i else 1
    return ((VX[a] + VX[b]) / 2 + side * 0.035, max(VTOP[a], VTOP[b]) + 0.12 + 0.05 * hsh(a * 5 + b))


def voice_top(i, t):
    """The top of voice i while it rises freely."""
    return (VX[i], VTOP[i] + min(0.06, 0.03 * max(0.0, t - VOICE_T[i] - 1.7)))


def voice_state(i, t):
    """(growth 0..1, base, top) of the voice of house i in c07. In the last half second every voice runs, faster and
    faster, at its neighbour: they hit at 129.0 (`clash`, in c08)."""
    vt = VOICE_T[i]
    g = ss(vt, vt + 1.7, t)
    base = mind_head(i) if OUT_T[i] < 1e8 else roof_at(i)
    u = min(1.0, max(0.0, (t - 128.45) / 0.55)) ** 2
    top = lerp2(voice_top(i, t), meet_point(i), u)
    return g, base, top


def draw_voice(cv, i, t, g, base, top, col=None, k=1.0, w=None, amp=None, freq=None, phase=None, bend=None, glow=0.5):
    if g <= 0.001:
        return
    col = LAND_COL[i] if col is None else col
    end = lerp2(base, top, g)
    ph = VPH[i] - VSPD[i] * t if phase is None else phase
    pts = voice_pts(base, end, (VAMP[i] if amp is None else amp) * min(1.0, g * 2), VFREQ[i] if freq is None else freq,
                    ph, VBEND[i] if bend is None else bend, n=26)
    _wave(cv, pts, col, k, w=(0.0065 if i == 0 else 0.0045) if w is None else w, glow=glow)
    if g < 0.98:                                              # the head of a rising voice: a bead of light
        cv.glow(cv.circle(end, 0.004), mix(col, (1, 1, 1), 0.5), 0.012, 0.9 * k)


# ---------------------------------------------------------------------------------------------------- faces
FAM_MOOD = {"lib": [(107.0, "open"), (108.62, "open", None, "smile")], "chair": [(107.0, "open"), (108.70, "happy")],
            "me": [(107.0, "open"), (108.55, "happy", None, "grin")], "b1": [(107.0, "happy"), (108.80, "open", None, "o")],
            "b2": [(107.0, "open"), (108.66, "wide")], "b3": [(107.0, "open"), (108.76, "happy")]}

MOODS = {   # (time, eyes, mark, mouth) per mind in the close-ups
    11: [(118.0, "wide", None, "o"), (119.25, "wide", "!", "grin"), (120.4, "open", None, "grin")],          # bold
    8: [(118.0, "happy", None, "smile"), (119.55, "open", None, "smile"), (120.6, "happy", None, "smile")],  # calm
    5: [(118.0, "closed", None, "flat"), (119.75, "open", None, "flat"), (120.5, "happy", None, "smile")],   # shy
    1: [(118.0, "open", None, "o"), (119.4, "open", "?", "o"), (120.3, "wide", None, "smile")],             # curious
    14: [(110.0, "open", None, "smile"), (119.9, "happy", None, "grin")],
    0: [(118.0, "open", None, "smile"), (122.2, "open", "?", "o"), (122.65, "happy", None, "smile"), (123.0, "open", None, "o")],
    13: [(118.0, "open", None, "flat"), (122.35, "wide", None, "o"), (122.8, "happy", None, "smile"), (123.3, "open", None, "o")],
    10: [(118.0, "open", None, "smile"), (122.5, "happy", None, "grin")],
    18: [(118.0, "open", None, "smile"), (122.4, "wide", None, "smile")],
}
LOOKS = {   # (time, (lx, ly)): who looks at whom
    11: [(118.0, (0.0, -0.3)), (119.1, (0.9, -0.2)), (120.2, (-0.8, -0.5))],
    8: [(118.0, (-0.5, 0.0)), (119.5, (-0.9, 0.2)), (120.7, (-0.4, -0.6))],
    5: [(118.0, (0.0, -0.8)), (119.8, (-0.6, 0.5)), (120.6, (0.7, 0.3))],
    1: [(118.0, (0.0, 0.9)), (119.3, (0.6, 0.9)), (120.1, (0.9, 0.5))],
    14: [(110.0, (-0.6, 0.2)), (119.0, (0.8, -0.3))],
    0: [(118.0, (0.3, 0.2)), (122.12, (1.0, 0.1)), (122.9, (0.2, 1.0))],
    13: [(118.0, (0.0, 0.0)), (122.28, (-1.0, 0.0)), (123.2, (-0.3, 1.0))],
    10: [(118.0, (0.6, 0.3)), (122.0, (1.0, 0.5))],
    18: [(118.0, (0.0, -0.5)), (121.7, (0.4, -0.8))],
}


def look_at(t, keys, d=0.22):
    p = keys[0][1]
    for k in keys[1:]:
        if t > k[0]:
            p = lerp2(p, k[1], ss(k[0], k[0] + d, t))
    return p


def mind_face(i, t):
    """mood + look for mind i (a default temper for those the camera never comes near)."""
    keys = MOODS.get(i)
    if keys is None:
        tm = [("open", "smile"), ("happy", "smile"), ("open", "o"), ("wide", "smile")][int(hsh(i * 7) * 4)]
        keys = [(118.0, tm[0], None, tm[1])]
    lk = LOOKS.get(i, [(118.0, (math.sin(i * 2.1), 0.3 * math.cos(i * 1.3)))])
    if i not in (0, 13):                                   # each sings when its voice starts, and looks up after it
        keys = keys + [(VOICE_T[i] + 0.05, "open", None, "o")]
        lk = lk + [(VOICE_T[i] + 0.2, (0.0, 1.0))]
    m = mood(t, keys)
    m.setdefault("mouth", "smile")
    m["look"] = look_at(t, lk)
    return m


# ---------------------------------------------------------------------------------------------------- the house closing
def _facade(cv, t, p, shut):
    """The front wall that comes down over the cut-open house (shut 0..1, from the top) and then settles (p 0..1) from
    the house set's proportions into far_house's. Drawn in LAND coordinates."""
    if shut <= 0.001:
        return
    x0, yb = -0.30, -0.50
    hw = 0.16
    wall_top = lerp(-0.50 + 1.40 * S_H, -0.50 + 0.12, p)            # 0.66 above the base in house units -> far_house
    eave_y = lerp(-0.50 + (0.62 + 0.74) * S_H, -0.50 + 0.12, p)
    eave_w = lerp(1.26 * S_H, 0.184, p)
    apex = lerp(-0.50 + 1.76 * S_H, -0.50 + 0.228, p)
    wall_c, roof_c = mix((0.21, 0.20, 0.32), (0.15, 0.14, 0.25), p), mix((0.16, 0.15, 0.26), (0.11, 0.10, 0.20), p)
    # the roof closes first, then the wall comes down like a blind
    rk = ss(0.0, 0.35, shut)
    cv.fill(cv.poly([(x0 - eave_w, eave_y), (x0 + eave_w, eave_y), (x0, apex)]), roof_c, rk)
    cv.fill(cv.box((x0 + 0.92 * S_H, -0.50 + (0.86 + 0.74) * S_H), 0.06 * S_H, 0.13 * S_H), roof_c, rk * (1 - p))  # chimney
    u = ss(0.15, 1.0, shut)
    bottom = lerp(wall_top, yb, u)
    if u > 0:
        cv.fill(cv.box((x0, (wall_top + bottom) / 2), hw, (wall_top - bottom) / 2 + 1e-4), wall_c)
        cv.stroke(cv.seg((x0 - hw, bottom), (x0 + hw, bottom)), 0.004 * (1 - u), (0.40, 0.27, 0.17), 1.0)
    # three windows, lit, where far_house has them (they come with the wall)
    h = 0.12
    for j, fx in enumerate((-0.5, 0.1, 0.6)):
        wy = lerp(-0.50 + 0.74 * S_H + 0.18 * S_H, yb + h * 0.55, p)
        if bottom < wy:
            col = mix((1.0, 0.86, 0.55), AMBER, 0.55)
            cv.fill(cv.box((x0 + fx * hw, wy), hw * 0.16, lerp(0.16 * S_H, h * 0.20, p)), col, ss(wy + 0.02, wy - 0.01, bottom))
    cv.glow(cv.box((x0, yb + h * 0.55), hw * 0.8, h * 0.2), mix((1.0, 0.8, 0.5), AMBER, 0.4), 0.08, 0.35 * u)


# ---------------------------------------------------------------------------------------------------- the camera
CAM7 = [(108.0, -0.30, P_H[1], Z0), (109.1, -0.29, -0.385, 4.4), (110.05, -0.05, -0.375, 2.75),
        (110.9, 0.24, -0.39, 3.5), (112.0, 0.31, -0.39, 4.0), (112.8, 0.50, -0.47, 2.75), (113.6, 0.60, -0.43, 2.45),
        (114.4, 0.42, -0.30, 2.2), (115.2, 0.04, -0.28, 2.1), (115.9, -0.35, -0.25, 2.05), (116.6, -0.68, -0.29, 2.0),
        (117.3, -0.72, -0.30, 1.8), (118.35, -0.05, 0.0, 1.06), (119.45, 0.50, -0.57, 3.0), (120.8, 0.52, -0.58, 3.2),
        (121.9, -0.21, -0.45, 3.2), (122.9, -0.24, -0.43, 3.4), (123.7, -0.22, -0.32, 2.7), (125.6, -0.10, -0.04, 1.55),
        (127.6, -0.02, 0.18, 1.08), (129.0, 0.0, 0.25, 1.0)]


def cam7(t):
    return glide(t, CAM7)


# ---------------------------------------------------------------------------------------------------- the shot
def s_anyone(cv, t):
    cam = cam7(t)
    cv.begin(cam)
    u_sky = ss(108.15, 109.6, t)
    sky_blend(cv, t, cam, u_sky)
    _cam(cv, cam)

    shut = ss(109.0, 109.55, t)
    p_settle = ss(109.5, 110.0, t)
    house_on = t < 109.56                                        # the cut-open house, until the wall has come down
    swap = ss(109.95, 110.1, t)                                  # the facade hands over to far_house
    ground_k = ss(108.25, 109.3, t)
    _ground(cv, ground_k)

    lits = [lit_level(i, t) for i in range(30)]
    near0 = LAND[0][1]
    for i in LAND_ORDER:
        x, y, S, w, h = hgeo(i)
        if abs(x - cv.cx) > cv.AR / cv.z + 0.4 or abs(y - cv.cy) > 1.0 / cv.z + 0.5:
            continue
        if i == 0:
            if house_on:                                         # the cut-open house, painted with its own camera
                _cam(cv, house_cam(cam))
                the_house(cv, t, lit={"lib": 1, "chair": 1, "mine": 1, "shop": 1, "hall": 1.0},
                          door=ss(108.2, 108.6, t))
                for j, (name, pp) in enumerate(POS.items()):
                    m = mood(t, FAM_MOOD[name])
                    lk = look_at(t, [(107.0, (0.0, 0.0)), (108.5 + 0.06 * j, (-0.9, -0.2)), (109.1 + 0.05 * j, (0.3, 0.8))])
                    arms = sway(t + j, ((-0.12, -0.03), (0.13, 0.02)))
                    flame(cv, (pp[0], pp[1] + bob(t, j * 1.7) * 0.62), 0.62, t + j * 0.7, col=FAMILY[name], look=lk,
                          arms=arms, **m)
                _cam(cv, cam)
            _facade(cv, t, p_settle, shut * (1 - swap))
            if swap > 0:
                far_house_at(cv, 0, 1.0, AMBER, k=swap, door=0.8 * swap)
            # our keeper: outside our street door (house units (-1.31, -0.55), size 1), drawn in land units so he
            # stays the same light as the house shrinks around him; later only his porch light stays
            kk = pop(t, 108.42, 0.4) * (1 - ss(111.6, 112.3, t))
            if kk > 0.001:
                sq = 0.2 * math.exp(-(t - 108.42) * 8) * math.cos((t - 108.42) * 18) if t > 108.42 else 0.0
                c = (P_H[0] - 1.31 * S_H, P_H[1] + (-0.55 + 0.01 * math.sin(t * 1.4)) * S_H)
                arms = ((-0.15, -0.06), (0.15, 0.02 + 0.05 * ss(108.7, 109.0, t))) if S_H * 0.105 * cv.z * 360 > 9 else None
                orb(cv, c, S_H * kk, t, look=look_at(t, [(108.0, (0.8, 0.4)), (110.45, (1.0, 0.1))]), arms=arms, sq=sq,
                    bright=lerp(1.0, 0.45, ss(108.8, 109.8, t)))
            mk, mp, msq = mind_out(0, t)
            if mk > 0:
                m = mind_face(0, t)
                m["sq"] = m["sq"] + msq
                mp = (mp[0], mp[1] + bob(t, 0.0) * mind_spot(0)[1])
                arms = sway(t, ((-0.13, -0.02), (0.13, 0.03)))
                flame(cv, mp, mind_spot(0)[1], t, col=AMBER, k=mk, arms=arms, bright=0.8, **m)
            continue
        # every other house: pops up out of the ground around ours as the camera pulls back
        dist = math.hypot(x - LAND[0][0], y - near0)
        rise_t = 108.55 + 0.9 * min(1.0, dist / 1.2) + (0.75 if y < near0 else 0.0) + 0.1 * hsh(i * 5)
        size = back((t - rise_t) / 0.45) if t < rise_t + 0.45 else 1.0
        if size <= 0.01:
            continue
        size *= house_pop(i, t)
        lv = lits[i]
        far_house_at(cv, i, lv, LAND_COL[i], size=max(0.0, size), door=0.7 * lv)
        if lv > 0 and t < LIGHT_T[i] + 0.6:                       # the window's first spark
            cv.glow(cv.circle((x + 0.01 * S, y + 0.04 * S), 0.004), CORE, 0.02 * S, 1.4 * hit(t, LIGHT_T[i], 4))
        # the keeper comes to the door a beat after the light
        kt = LIGHT_T[i] + 0.18
        if kt < t < kt + 3.2 and LIGHT_T[i] < 117.3:
            kk = pop(t, kt, 0.35) * (1 - ss(kt + 2.2, kt + 2.9, t))
            ksq = 0.2 * math.exp(-(t - kt) * 8) * math.cos((t - kt) * 18)
            _keeper_at(cv, i, t, kk, look=(0.3, 0.6) if i != 14 else (-0.8, 0.3),
                       wave=(ss(110.9, 111.2, t) * (1 - ss(112.2, 112.5, t)) if i == 14 else 0.0), sq=ksq, ph=i * 1.1,
                       scale=0.36 if i == 14 else 0.30)
        mk, mp, msq = mind_out(i, t)
        if mk > 0:
            m = mind_face(i, t)
            m["sq"] = m["sq"] + msq
            ms = mind_spot(i)[1]
            mp = (mp[0], mp[1] + bob(t, i * 1.3) * ms)
            if LAND_KIND[i] == "flame":
                m["arms"] = sway(t + i, ((-0.13, -0.02), (0.13, 0.02)))
            _mind(cv, mp, ms, LAND_KIND[i], LAND_COL[i], t, k=mk, bright=0.4 if LAND_KIND[i] == "orb" else 0.6, **m)
    cv.light = cv.light * (1.0 - 0.45 * cv.sst(1.8, 3.4, torch.tensor(cv.z)).item())   # less haze in the close-ups
    # the porch lights: every lit house keeps a small warm glow at its door (its keeper's)
    cv_items = []
    for i in range(30):
        if i == 0 and t < 110.0:
            continue
        dx, dy = door_at(i)
        cv_items.append((dx - 0.04 * LAND[i][2], dy + 0.02 * LAND[i][2], 0.35 * lits[i] * (0.9 + 0.1 * math.sin(t * 1.3 + i)), KEEPER))
    lights(cv, cv_items, radius=0.010)
    # the voices
    for i in range(30):
        g, base, top = voice_state(i, t)
        draw_voice(cv, i, t, g, base, top)


SHOTS = [(108.0, s_anyone)]
