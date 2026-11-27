"""c05_visits: 87.0 to 99.0 s. Between rounds of work the family comes to the smallest room one at a time, carrying
nothing; then what was made in that room goes out to the library. Painter C. Edit only this file.

  87.0  (push) from EXACTLY (0, 0, 1) on the whole house the camera pushes into my room (top right). I hear something
        and turn to my right. A matched dissolve (87.6 to 87.9) on the light: my small flame at POS["me"] becomes me at
        ME, the same size in the same place on screen.
  87.75 (visit1) the door opens; teal (the chair) hops in on two arcs, empty-handed. It thinks, raises a hand and
        sends a spark that draws a small moon in the air between us (the moon it saw); we both look at it. It leaves.
  90.75 (visit2) violet (the librarian) floats in slowly, sits (settles low), and says nothing. The door closes. Steam
        from my cup. It closes its eyes; I look at the cup; we glance at each other. That is the whole visit.
  93.0  (visit3) rose (a builder) bounces in with its own struck page held high, laughing; shows me; I do not get it,
        then I do; we laugh together, out of step. It bounces out; the door shuts.
  96.0  (ring) the knot (3:2, gold) that has hung over the table all along dips, then drifts to the door and flattens
        out under it. Cut on the action to the house: it comes out of my room and crosses under the upper floor.
  97.5  (taken) the violet one reaches up and puts it on a shelf, which glows (the ember of c06). Pull back to the
        whole house at (0, 0, 1) for 99.0; the first builder is already closing its eyes for the dark.
"""
from world import *
from ch.c06_dark import (GOLD, ALL_LIT, PH, POS, draw_light, draw_ember, house_frame, light_look, light_arms, light_mood,
                         EMBER, _look, _pose, _toward)

KNOT = (0.40, -0.16)                 # the knot over my table (room view)
KNOT_H = (0.965, 0.345)              # the same knot in the house view, over my small table
V = (0.68, -0.44)                    # where a visitor stands, across the table from me
DOORP = (0.74, -0.37)                # a visitor in the doorway (flame base)
MOON = (0.13, -0.01)
ME_S, VIS_S = 1.5, 1.45


# ---------------------------------------------------------------------------------------------------------------
# cameras: the push into my room, matched on my light
# ---------------------------------------------------------------------------------------------------------------
HCAM = [(87.0, 0.0, 0.0, 1.0), (87.45, 0.50, 0.23, 2.05), (87.85, 0.83, 0.32, 4.3), (88.1, 0.85, 0.325, 5.1)]
MATCH_END = 87.9


def _matched(t):
    """The room camera that puts ME exactly where the house camera shows POS['me'], at the same flame size."""
    hx, hy, hz = glide(t, HCAM)
    z = hz * 0.62 / ME_S
    k = hz / z
    return ME[0] - (POS["me"][0] - hx) * k, ME[1] - (POS["me"][1] - hy) * k, z


def _room_cam(t):
    if t < MATCH_END:
        return _matched(t)
    m = _matched(MATCH_END)
    return glide(t, [(MATCH_END, m[0], m[1], m[2]), (88.7, 0.30, -0.21, 1.78), (89.5, 0.26, -0.14, 1.84),
                     (90.4, 0.30, -0.17, 1.80), (91.3, 0.30, -0.22, 1.86), (92.55, 0.27, -0.25, 2.05),
                     (93.2, 0.31, -0.19, 1.76), (94.3, 0.27, -0.24, 1.95), (95.5, 0.33, -0.21, 1.85),
                     (96.2, 0.42, -0.22, 1.95), (96.45, 0.50, -0.26, 2.1)])


# ---------------------------------------------------------------------------------------------------------------
# the visitors' paths
# ---------------------------------------------------------------------------------------------------------------
H1, R1, R2 = (0.715, -0.405), (0.73, -0.38), (0.70, -0.42)
TEAL_IN = [(88.08, 88.42, DOORP, H1, 0.07, 0.12), (88.47, 88.82, H1, V, 0.06, 0.08)]
TEAL_OUT = [(90.28, 90.50, V, H1, 0.06, 0.10), (90.52, 90.68, H1, DOORP, 0.05, 0.05)]
VIO_IN = [(90.86, 91.36, DOORP, V, 0.025, 0.14)]
VIO_OUT = [(92.56, 92.90, V, DOORP, 0.03, 0.12)]
ROSE_IN = [(93.0, 93.2, DOORP, R1, 0.08, 0.0), (93.22, 93.42, R1, R2, 0.07, 0.05), (93.44, 93.62, R2, V, 0.05, 0.05)]
ROSE_OUT = [(95.15, 95.33, V, R2, 0.07, 0.08), (95.35, 95.50, R2, R1, 0.07, 0.04), (95.52, 95.66, R1, DOORP, 0.05, 0.04)]


def _visit(t, hin, hout, k_in, k_out):
    """Position, squash and presence of a visitor from its hops in and out; smaller in the doorway (further back)."""
    if t < hout[0][0] - 0.15:
        pos, sq, air, ant = travel(t, hin)
    else:
        pos, sq, air, ant = travel(t, hout)
    near = ss(DOORP[1], V[1], pos[1]) if pos[1] <= DOORP[1] else 0.0
    near = min(1.0, max(near, ss(DOORP[0], V[0], pos[0])))
    s = lerp(1.2, VIS_S, near)
    k = ss(*k_in, t) * (1.0 - ss(*k_out, t))
    return pos, sq, s, k


DOOR_KEYS = [(87.75, 0.0), (87.98, 1.0), (88.85, 1.0), (89.1, 0.0), (90.10, 0.0), (90.30, 1.0), (91.38, 1.0),
             (91.62, 0.0), (92.36, 0.0), (92.56, 1.0), (95.66, 1.0), (95.92, 0.0)]


def _door(t):
    return kf(t, DOOR_KEYS)


# ---------------------------------------------------------------------------------------------------------------
# small private drawings
# ---------------------------------------------------------------------------------------------------------------
def _knot(cv, c, rx, ry, phase, k=1.0, w=0.0065, glow=0.6, n=140, ink=False):
    """interval(3:2) with separate width and height, so it can flatten to slip under a door."""
    if k <= 0.001:
        return
    pts = [(c[0] + rx * math.sin(3 * u * 2 * math.pi + phase), c[1] + ry * math.sin(2 * u * 2 * math.pi))
           for u in (i / n for i in range(n + 1))]
    d = cv.path(pts)
    if ink:                                                     # a darker edge so it reads on a pale lit wall
        cv.stroke(d, w * 2.0, mix(GOLD, INK, 0.55), 0.75 * k)
    cv.stroke(d, w, mix(GOLD, (1, 1, 1), 0.15), 0.95 * k)
    cv.glow(d, GOLD, 0.018 * max(0.35, rx / 0.08), glow * k)


def _moon_outline(u):
    """The crescent as one line: the outer arc, then the inner arc back; u 0..1 of it drawn."""
    r1, r2, off = 0.066, 0.055, (0.031, 0.016)
    a0, a1 = 1.05, 2 * math.pi - 0.75
    outer = [(MOON[0] + r1 * math.cos(a0 + (a1 - a0) * i / 24), MOON[1] + r1 * math.sin(a0 + (a1 - a0) * i / 24)) for i in range(25)]
    b0, b1 = 2 * math.pi - 0.95, 1.30
    inner = [(MOON[0] + off[0] + r2 * math.cos(b0 + (b1 - b0) * i / 16), MOON[1] + off[1] + r2 * math.sin(b0 + (b1 - b0) * i / 16))
             for i in range(17)]
    pts = outer + inner
    n = max(2, int(round(len(pts) * u)))
    return pts[:n]


def _moon(cv, t):
    draw_u = ss(89.30, 89.75, t)
    fade = 1.0 - ss(90.9, 91.7, t)
    if draw_u <= 0 or fade <= 0:
        return
    fill = ss(89.70, 89.92, t) * fade
    if fill > 0:
        sd = torch.maximum(cv.circle(MOON, 0.066), -cv.circle((MOON[0] + 0.031, MOON[1] + 0.016), 0.055))
        cv.fill(sd, (0.95, 0.96, 1.0), 0.9 * fill)
        cv.glow(sd, (0.85, 0.92, 1.0), 0.04, (0.45 + 0.9 * hit(t, 89.75, 3.0)) * fill)
    pts = _moon_outline(draw_u)
    cv.stroke(cv.path(pts), 0.0055, mix(TEAL, INK, 0.25), 0.9 * fade * (1.0 - 0.35 * fill))
    cv.glow(cv.path(pts), TEAL, 0.015, 0.35 * fade)


def _spark(t, hand):
    """The spark teal sends from its hand: hand -> start of the moon -> along the outline. None when not flying."""
    if t < 89.15 or t > 89.78:
        return None
    if t < 89.30:
        u = ss(89.15, 89.30, t)
        a, b = hand, _moon_outline(0.0)[0]
        return (lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 0.03 * math.sin(math.pi * u))
    return _moon_outline(ss(89.30, 89.75, t))[-1]


def _steam(cv, t, c, amt):
    """Curls of steam rising from a cup, stronger when the room is quiet."""
    if amt <= 0.01:
        return
    for i in range(3):
        u = ((t * 0.32 + i / 3.0) % 1.0)
        pts = [(c[0] + 0.012 * math.sin(j * 1.2 + t * 1.6 + i * 2.0) * (0.6 + u), c[1] + 0.06 + 0.16 * u + 0.016 * j) for j in range(6)]
        cv.stroke(cv.path(pts), 0.0045, (1, 1, 1), 0.38 * amt * math.sin(math.pi * u))


# ---------------------------------------------------------------------------------------------------------------
# me (amber) in the room: one mood track used in the house view and the room view, so the match holds
# ---------------------------------------------------------------------------------------------------------------
ME_MOOD = [(86.0, "open", None, "smile"), (87.42, "wide", None, "o"), (88.42, "happy", None, "grin"), (88.95, "open", None, "smile"),
           (89.97, "spark", None, "o"), (90.42, "happy", None, "smile"), (90.95, "open", None, "smile"), (91.62, "happy", None, "smile"),
           (92.28, "open", None, "smile"), (93.12, "wide", "!", "o"), (93.80, "open", "?", "flat"), (94.25, "happy", None, "grin"),
           (95.05, "open", None, "smile"), (96.12, "happy", None, "smile")]
ME_LOOK = [(86.0, (0.3, 0.0)), (87.40, (1.0, 0.2)), (88.55, (0.9, 0.0)), (89.05, (0.8, 0.6)), (89.30, (0.6, 0.9)),
           (89.80, (0.5, 1.0)), (90.35, (1.0, 0.3)), (90.78, (1.0, 0.45)), (91.30, (0.9, -0.1)), (91.85, (0.5, -0.7)),
           (92.20, (0.95, 0.0)), (92.62, (1.0, 0.35)), (93.05, (1.0, 0.45)), (93.65, (0.9, 0.0)), (93.82, (0.7, 0.4)),
           (94.28, (0.9, 0.0)), (95.18, (1.0, 0.35)), (95.70, (0.8, 0.7)), (96.10, (1.0, 0.2)), (96.40, (1.0, -0.3))]
ME_ARMS = [(86.0, ((-0.12, -0.03), (0.13, -0.02)), 0.3), (87.45, ((-0.14, 0.00), (0.12, 0.03)), 0.25),
           (88.45, ((-0.12, -0.02), (0.16, 0.15)), 0.25), (88.95, ((-0.12, -0.03), (0.13, -0.02)), 0.35),
           (89.97, ((-0.15, 0.07), (0.12, 0.11)), 0.25), (90.40, ((-0.12, -0.02), (0.17, 0.15)), 0.25),
           (90.90, ((-0.12, -0.03), (0.13, -0.02)), 0.35), (91.62, ((-0.07, -0.055), (0.085, -0.04)), 0.5),
           (92.62, ((-0.12, -0.03), (0.15, 0.08)), 0.3), (93.15, ((-0.14, 0.02), (0.13, 0.02)), 0.25),
           (94.25, ((-0.09, 0.01), (0.10, -0.05)), 0.3), (95.18, ((-0.12, -0.02), (0.17, 0.15)), 0.25),
           (95.70, ((-0.12, -0.03), (0.13, -0.02)), 0.35), (96.08, ((-0.12, -0.03), (0.21, 0.06)), 0.3),
           (96.55, ((-0.12, -0.03), (0.13, -0.02)), 0.4)]


def _wave(t, at, d=0.5, f=15.0):
    return 0.025 * math.sin((t - at) * f) * ss(at, at + 0.1, t) * (1.0 - ss(at + d - 0.15, at + d, t))


def _me_arms(t):
    a = _pose(t, ME_ARMS, lag=0.07)
    l, r = sway(t, a)
    w = _wave(t, 88.5) + _wave(t, 90.45) + _wave(t, 95.25)
    w2 = 0.5 * _wave(t, 92.68, 0.4, 12.0)
    return l, (r[0] + w + w2, r[1])


def _me_sq(t):
    laugh = ss(94.3, 94.45, t) * (1.0 - ss(94.9, 95.2, t))
    return 0.07 * laugh * math.sin((t - 94.3) * 17.0)


# ---------------------------------------------------------------------------------------------------------------
# shot 1: the push (house)
# ---------------------------------------------------------------------------------------------------------------
def s_push(cv, t):
    cv.begin(glide(t, HCAM))
    house_frame(cv, t, {n: 1.0 for n in PH})
    _knot(cv, KNOT_H, 0.026, 0.024, 0.35 * t, w=0.0028, glow=0.5, ink=True)
    for n in ["lib", "chair", "b1", "b2", "b3"]:
        draw_light(cv, n, t)
    m = mood(t, ME_MOOD)
    m["sq"] += _me_sq(t)
    flame(cv, (POS["me"][0], POS["me"][1] + bob(t) * 0.62), 0.62, t, look=_look(t, ME_LOOK), arms=_me_arms(t), **m)


# ---------------------------------------------------------------------------------------------------------------
# shot 2: the visits (my room)
# ---------------------------------------------------------------------------------------------------------------
def _teal(cv, t):
    pos, sq, s, k = _visit(t, TEAL_IN, TEAL_OUT, (87.95, 88.08), (90.58, 90.70))
    if k <= 0.001:
        return None
    m = mood(t, [(87.9, "open", None, "smile"), (88.88, "happy", None, "smile"), (89.02, "open", None, "flat"),
                 (89.84, "happy", None, "smile"), (90.22, "open", None, "smile")])
    look = _look(t, [(87.9, (-1.0, 0.0)), (88.98, (-0.5, 0.9)), (89.2, (-0.8, 0.6)), (89.4, (-0.9, 0.8)),
                     (89.85, (-0.7, 1.0)), (90.25, (-0.9, 0.1)), (90.4, (0.6, 0.3))])
    arms = _pose(t, [(87.9, ((-0.12, -0.02), (0.12, -0.04)), 0.3), (88.95, ((-0.08, -0.07), (0.12, -0.05)), 0.15),
                     (89.08, ((-0.17, 0.21), (0.13, -0.02)), 0.18), (89.80, ((-0.14, 0.06), (0.12, -0.03)), 0.3),
                     (90.22, ((-0.16, 0.13), (0.12, -0.04)), 0.2), (90.45, ((-0.12, -0.02), (0.12, -0.04)), 0.25)], lag=0.08)
    arms = sway(t + 2.0, arms)
    # while the spark draws, the hand conducts it in a small circle
    cond = ss(89.15, 89.3, t) * (1.0 - ss(89.7, 89.85, t))
    ang = (t - 89.15) * 11.0
    l = (arms[0][0] + 0.03 * cond * math.cos(ang), arms[0][1] + 0.03 * cond * math.sin(ang))
    l = (l[0] + _wave(t, 90.25, 0.4, 13.0), l[1])
    dip = 0.08 * pulse(t, 89.06, 0.05)
    lean = 0.10 * ss(88.95, 89.1, t) * (1 - ss(89.75, 90.0, t)) + 0.04 * math.sin(2.2 * t + 1.0)
    base = (pos[0], pos[1] + bob(t, 2.0) * s)
    flame(cv, base, s, t + 3.0, col=TEAL, look=look, arms=(l, arms[1]), k=k, lean=lean,
          **{**m, "sq": m["sq"] + sq + dip})
    return (base[0] + l[0] * s, base[1] + l[1] * s)


def _violet(cv, t):
    pos, sq, s, k = _visit(t, VIO_IN, VIO_OUT, (90.72, 90.88), (92.86, 92.98))
    if k <= 0.001:
        return
    m = mood(t, [(90.7, "open", None, "smile"), (91.34, "happy", None, "smile"), (91.78, "closed", None, "smile"),
                 (92.32, "open", None, "smile"), (92.46, "happy", None, "smile"), (92.58, "open", None, "smile")])
    look = _look(t, [(90.7, (-1.0, -0.1)), (91.78, (-0.5, -0.6)), (92.30, (-1.0, 0.1)), (92.6, (0.6, 0.2)),
                     (92.75, (-0.7, 0.1))], d=0.35)
    arms = _pose(t, [(90.7, ((-0.11, -0.04), (0.12, -0.02)), 0.4), (91.40, ((-0.055, -0.06), (0.075, -0.05)), 0.6),
                     (92.52, ((-0.15, 0.08), (0.12, -0.03)), 0.3), (92.85, ((-0.11, -0.04), (0.12, -0.02)), 0.3)], lag=0.12)
    arms = sway(t + 4.0, arms)
    sit = 0.10 * ss(91.36, 91.70, t) * (1.0 - ss(92.48, 92.62, t))
    breath = 0.025 * math.sin(t * 2.0) * ss(91.6, 91.9, t) * (1 - ss(92.4, 92.6, t))
    lean = 0.05 * math.sin(1.3 * t + 2.0) - 0.12 * ss(90.86, 91.1, t) * (1 - ss(91.2, 91.45, t))
    flame(cv, (pos[0], pos[1] + bob(t, 1.3) * s * 0.6), s, t + 5.0, col=VIOLET, look=look, arms=arms, k=k, lean=lean,
          **{**m, "sq": m["sq"] + sq + sit + breath})


def _rose(cv, t):
    pos, sq, s, k = _visit(t, ROSE_IN, ROSE_OUT, (92.98, 93.06), (95.60, 95.70))
    if k <= 0.001:
        return
    m = mood(t, [(92.9, "happy", None, "grin"), (93.62, "open", None, "grin"), (93.96, "happy", None, "grin"),
                 (94.95, "happy", None, "smile"), (95.12, "happy", None, "grin")])
    look = _look(t, [(92.9, (-1.0, 0.1)), (93.85, (-0.5, 0.6)), (94.05, (-1.0, 0.0)), (95.15, (0.7, 0.2)),
                     (95.3, (-0.6, 0.2))], d=0.18)
    arms = _pose(t, [(92.9, ((-0.13, 0.21), (0.15, 0.10)), 0.2), (93.62, ((-0.25, 0.10), (0.13, 0.02)), 0.22),
                     (94.02, ((-0.21, 0.05), (0.06, -0.02)), 0.25), (94.92, ((-0.12, 0.05), (0.13, 0.03)), 0.25),
                     (95.12, ((-0.13, 0.21), (0.16, 0.12)), 0.2)], lag=0.05)
    arms = sway(t + 1.0, arms)
    laugh = ss(93.0, 93.1, t) * (1 - ss(93.55, 93.75, t)) * 0.5 + ss(93.95, 94.05, t) * (1 - ss(94.85, 95.0, t)) + \
        0.5 * ss(95.1, 95.2, t)
    jig = 0.09 * laugh * math.sin((t - 93.0) * 21.0)
    shake_x = 0.012 * laugh * math.sin((t - 93.0) * 13.0)
    l = (arms[0][0] + shake_x, arms[0][1] + 0.4 * jig * 0.1)
    base = (pos[0], pos[1] + bob(t, 3.9) * s)
    flame(cv, base, s, t + 7.0, col=ROSE, look=look, arms=(l, arms[1]), k=k, lean=0.06 * math.sin(4.0 * t) + 0.1 * laugh * math.sin(t * 9),
          **{**m, "sq": m["sq"] + sq + jig})
    hand = (base[0] + l[0] * s, base[1] + l[1] * s)
    rot = 0.15 * math.sin(t * 7.0) * laugh - 0.1
    card(cv, (hand[0] - 0.004, hand[1] + 0.052), 0.75, rot, "spiral", struck=1.0, k=k)
    cv.fill(cv.circle(hand, 0.014 * s), mix(ROSE, CORE, 0.35), k)          # the thumb over the page's edge


def _knot_room(cv, t):
    """The knot over the table: turning all along; at `ring` it dips, drifts to the door and slips under it."""
    ring = TL["ring"]
    ph = 0.35 * t
    dip = -0.018 * math.sin(math.pi * ss(ring - 0.25, ring + 0.05, t))
    u = ss(ring, ring + 0.32, t)
    under = ss(ring + 0.22, ring + 0.40, t)
    p0, p1 = KNOT, (DOORP[0], DOORP[1] - 0.005)
    pts = bez(p0, p1, -0.25, 1, u, u)[0] if u > 0 else p0
    c = (pts[0], pts[1] + dip + 0.006 * math.sin(t * 1.6) * (1 - u))
    rx = lerp(0.08, 0.05, u) * (1.0 + 0.4 * under)
    ry = lerp(0.08, 0.04, u) * (1.0 - 0.85 * under)
    k = 1.0 - ss(ring + 0.34, ring + 0.45, t)
    _knot(cv, c, rx, ry, ph, k=k, glow=0.9 + 0.5 * hit(t, ring, 3.0))
    if under > 0:                                               # the glint in the gap under the door
        cv.glow(cv.box((DOOR[0], DOOR[1] - 0.335), 0.10, 0.004), GOLD, 0.02, 0.9 * under * (1.0 - ss(ring + 0.45, ring + 0.7, t)))


def s_room(cv, t):
    cv.begin(_room_cam(t))
    door = _door(t)
    my_room(cv, t, at=ME, shelf=6, cups=(1.0, 1.0), door=door)
    # the hall light in the doorway takes the colour of whoever is there
    vis = TEAL if t < 90.72 else VIOLET if t < 92.98 else ROSE
    cv.glow(cv.box(DOOR, 0.11, 0.33), vis, 0.08, 0.30 * door)
    _steam(cv, t, CUP_ME, 0.35 + 0.65 * ss(91.3, 91.8, t) * (1 - ss(92.5, 92.9, t)))
    _knot_room(cv, t)
    _moon(cv, t)
    _violet(cv, t)
    hand = _teal(cv, t)
    _rose(cv, t)
    if hand is not None:
        sp = _spark(t, hand)
        if sp is not None:
            for i in range(6):                                  # a short fading tail
                q = _spark(max(89.15, t - 0.018 * i), hand)
                if q is not None:
                    cv.glow(cv.circle(q, 0.003), mix(TEAL, (1, 1, 1), 0.6), 0.012, 0.9 * (1 - i / 6))
            cv.fill(cv.circle(sp, 0.005), (1, 1, 1), 0.95)
    m = mood(t, ME_MOOD)
    m["sq"] += _me_sq(t)
    bounce = 0.012 * abs(math.sin((t - 94.3) * 8.5)) * ss(94.3, 94.45, t) * (1 - ss(94.9, 95.2, t))
    lean = 0.05 * math.sin(2.0 * t) + 0.012 * math.sin(4.7 * t) + 0.09 * ss(93.12, 93.3, t) * (1 - ss(93.5, 93.7, t))
    flame(cv, (ME[0], ME[1] + bob(t) * ME_S + bounce), ME_S, t, look=_look(t, ME_LOOK), arms=_me_arms(t), lean=lean, **m)


# ---------------------------------------------------------------------------------------------------------------
# shot 3: across the house to the library
# ---------------------------------------------------------------------------------------------------------------
KNOT_PATH = [(96.45, (0.66, 0.17)), (96.70, (0.20, 0.112)), (97.0, (-0.36, 0.112)), (97.22, (-0.865, 0.135))]
CATCH, TAKEN = 97.22, TL["taken"]


def _knot_house_pos(t):
    if t <= KNOT_PATH[0][0]:
        return KNOT_PATH[0][1]
    if t >= KNOT_PATH[-1][0]:
        return KNOT_PATH[-1][1]
    T0, T1 = KNOT_PATH[0][0], KNOT_PATH[-1][0]
    u = (t - T0) / (T1 - T0)
    u = u * u * (3 - 2 * u) * 0.55 + 0.45 * u                   # eased at both ends, never stopping in the middle
    tt = T0 + u * (T1 - T0)
    for (a, p), (b, q) in zip(KNOT_PATH, KNOT_PATH[1:]):
        if tt <= b:
            w = (tt - a) / (b - a)
            return (lerp(p[0], q[0], w), lerp(p[1], q[1], w) + 0.02 * math.sin(math.pi * w))
    return KNOT_PATH[-1][1]


VLOOK_T = 96.72


def _vio_hand(t):
    """The violet one's left hand: rest, up to meet the knot, carries it to the shelf, comes back down."""
    base = POS["lib"]
    rest = (base[0] - 0.11 * 0.62, base[1] - 0.04 * 0.62)
    meet = (KNOT_PATH[-1][1][0] + 0.004, KNOT_PATH[-1][1][1] - 0.016)
    shelf = (EMBER[0] + 0.006, EMBER[1] - 0.012)
    if t < 97.0:
        return rest
    if t < CATCH:
        return lerp2(rest, meet, back((t - 97.0) / (CATCH - 97.0)))
    if t < TAKEN:
        return lerp2(meet, shelf, ss(CATCH, TAKEN, t))
    if t < TAKEN + 0.15:
        return shelf
    return lerp2(shelf, rest, back((t - TAKEN - 0.15) / 0.4))


def s_cross(cv, t):
    cv.begin(glide(t, [(96.45, 0.78, 0.22, 2.2), (96.95, 0.02, 0.14, 1.75), (97.5, -0.66, 0.13, 2.1),
                       (98.15, -0.60, 0.12, 2.2), (99.0, 0.0, 0.0, 1.0)]))
    house_frame(cv, t, {n: 1.0 for n in PH})
    draw_ember(cv, t)
    # the knot crossing: it comes out of my room, runs under the upper floor and up to the violet one's hand
    if t < TAKEN + 0.08:
        p = _knot_house_pos(t) if t < CATCH else lerp2(_knot_house_pos(CATCH), (EMBER[0], EMBER[1] + 0.004), ss(CATCH, TAKEN, t))
        kk = ss(96.45, 96.55, t) * (1.0 - ss(TAKEN - 0.02, TAKEN + 0.08, t))
        r = 0.040 * (1.0 - 0.6 * ss(CATCH, TAKEN, t))
        for i in range(1, 6):                                   # a gold wake behind it
            q = _knot_house_pos(t - 0.035 * i) if t < CATCH else p
            cv.glow(cv.circle(q, 0.004), GOLD, 0.012, 0.5 * kk * (1 - i / 6) * (1 - ss(CATCH - 0.1, CATCH, t)))
        _knot(cv, p, r * 1.1, r * 0.95, 0.35 * t, k=kk, w=0.004, glow=1.0, ink=True)
    kp = _knot_house_pos(min(t, CATCH))
    for n in ["chair", "b1", "b2", "b3"]:
        p = POS[n]
        watch = 1.0 - ss(97.9, 98.3, t)
        look = lerp2(light_look(n, t), _toward(p, kp), watch * ss(96.5 + 0.1 * hsh(len(n) * 3), 96.75, t))
        draw_light(cv, n, t, look=look)
    # the violet one: sees it coming, reaches up, hops, and shelves it ON `taken`
    hand = _vio_hand(t)
    p = POS["lib"]
    hop = 0.05 * math.sin(math.pi * ss(97.18, 97.72, t))
    s = 0.62
    base_y = p[1] + hop
    left = ((hand[0] - p[0]) / s, (hand[1] - base_y - bob(t, PH["lib"]) * s) / s)
    rest_arms = light_arms("lib", t)
    right = _pose(t, [(96.0, (rest_arms[1], rest_arms[1]), 0.3), (97.1, ((0.0, 0.0), (0.16, 0.09)), 0.2),
                      (97.75, ((0.0, 0.0), rest_arms[1]), 0.35)], lag=0.0)[1]
    look = _look(t, [(96.0, light_look("lib", t)), (VLOOK_T, _toward(p, kp)), (97.05, (0.7, 0.8)), (97.28, (-0.7, 1.0)),
                     (97.8, (0.3, 0.1)), (98.2, light_look("lib", t))], d=0.18)
    vm = [(80.0, "happy", None, "smile"), (VLOOK_T + 0.05, "open", None, "o"), (97.62, "happy", None, "grin"), (98.3, "happy", None, "smile")]
    sq = -0.12 * ss(97.15, 97.3, t) * (1 - ss(97.5, 97.62, t)) + 0.18 * hit(t, 97.72, 9.0) * (t > 97.72)
    draw_light(cv, "lib", t, look=look, arms=(left, right), dy=hop, sq=sq, pre=vm)
    # me, in my room, watching it go, then glad
    me_look = lerp2(_toward(POS["me"], kp), light_look("me", t), ss(98.1, 98.5, t))
    me_pre = [(80.0, "happy", None, "smile"), (97.62, "happy", None, "grin"), (98.3, "open", None, "smile")]
    draw_light(cv, "me", t, look=me_look, pre=me_pre)


SHOTS = [(87.0, s_push), (87.6, s_room), (96.45, s_cross)]
XFADE = {87.6: 0.3}          # the matched dissolve on my light; 96.45 is a cut on the knot's action (under the door)
