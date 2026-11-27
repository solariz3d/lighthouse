"""c04_round: 66.0 to 87.0 s. Painter B. Each shot paints the whole frame. Edit only this file.

One round of work through the house, as the program does it, then a second that runs by itself (STORYBOARD):
66-67.4 the keeper's note comes in at the street door and goes to the LIBRARY desk (not the chair) · 67.5-69.6 the
librarian reads it, jumps to the shelf, pulls an actual book, opens it on its desk · 69.75-72.6 it sends the note and
what it found to the chair; the chair splits it three ways, three blank pages fly down to the benches (it makes
nothing itself) · 72.75-75.6 each builder draws its piece, each its own way · 75.75-77.1 each page flies straight
to the library, over the chair's room (the teal one watches them go by) · 77.25-77.9 the librarian lays them on the
open book: the book's own drawing rises onto each; two match (gold), rose's does not (the book's square stands over
rose's circle, red) and it is sent back down · 78-79.4 green, at the NEXT bench, points (!); rose had not seen, looks,
sees, and is glad · 79.5-80.9 green strikes it (the finder marks it), rose draws it again, sends it, it matches ·
81-82.4 the teal one inks it (a teal seal on the book) and the round's pages bind into one more book on the shelf ·
82.5-87 the book's page turns by itself and the whole round runs again, fast, seen wide, ending with everyone at POS,
the book back in its slot, my cup back on my table. I am in my room throughout: no bench, watching, cup in hand.

Private helpers (the shared rigs lack them): `_glyph` (a drawing that can be partly drawn, and that tells where the
pen is, so a builder's hand follows its own line), `_page` (a card built on it), `_qb` (a flight on an arc through a
chosen middle point), `_closed_book`, `_turning_page` (notebook() has no page turn), `_ink_line` (a fading thread),
and the house helpers from c03_house (paint_house, _light, _arms, _hold, _pose).
"""
from world import *
from ch.c03_house import (S, GOLD, PH, REST, ME_CUP_HAND, SLOT_NEW, SLOT_PULL, L66, ALL_LIT, _hold, _pose, _arms,
                          _light, paint_house)

_NOTE, _PULL, _HAND, _SPLIT, _WORK = TL["note"], TL["pull"], TL["hand"], TL["split"], TL["work"]
_SEND, _CHECK, _POINT, _FIX, _INK, _AGAIN = TL["send"], TL["check"], TL["point"], TL["fix"], TL["ink"], TL["again"]

POS_L = POS["lib"]
WORK = (-0.68, -0.03)                 # the librarian at its desk
SHELF = (-0.874, -0.03)               # under the book it pulls
BOOK_C, BOOK_S = (-0.565, 0.038), 0.9
FAN = [(-0.633, 0.074, 0.13), (-0.565, 0.078, -0.03), (-0.497, 0.074, -0.15)]   # pages laid on the open book
FAN_S = 0.46
BLD = ["b1", "b2", "b3"]
SPOT = [(POS[b][0] + 0.075, -0.4635) for b in BLD]                          # a page standing on each bench
PAGE_S = 0.7
JOB_C = (0.035, 0.31)
KIND = ["square", "wave", "star"]     # what the book says each page should be
SEAL1, SEAL2 = (-0.478, 0.042), (-0.49, 0.05)
G_NEAR = (0.06, -0.63)                # green, come over to rose's bench
STRUCK_REST = (-0.10, -0.505)
ME_HOLD, ME_SIP = (0.14, -0.02), (0.06, 0.0)


# ---------------------------------------------------------------------------------------------- drawing helpers
def _gpts(kind):
    if kind == "wave":
        return [(-0.6 + 0.1 * i, 0.24 * math.sin(i * 0.85)) for i in range(13)]
    if kind == "square":
        return [(-0.42, 0.42), (-0.42, -0.42), (0.42, -0.42), (0.42, 0.42), (-0.42, 0.42)]
    if kind == "spiral":
        return [(0.075 * i * math.cos(i * 0.9), 0.075 * i * math.sin(i * 0.9)) for i in range(9)]
    if kind == "ring":
        return [(0.42 * math.sin(-2 * math.pi * i / 28), 0.42 * math.cos(2 * math.pi * i / 28)) for i in range(29)]
    return [((0.62 if j % 2 == 0 else 0.2) * math.sin(j * math.pi / 4), (0.62 if j % 2 == 0 else 0.2) * math.cos(j * math.pi / 4))
            for j in range(9)]                                                    # star


def _partial(pts, u):
    if u >= 1.0:
        return pts
    ls = [0.0]
    for a, b in zip(pts[:-1], pts[1:]):
        ls.append(ls[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    tgt = max(1e-4, u) * ls[-1]
    out = [pts[0]]
    for i in range(1, len(pts)):
        if ls[i] <= tgt:
            out.append(pts[i])
        else:
            out.append(lerp2(pts[i - 1], pts[i], (tgt - ls[i - 1]) / (ls[i] - ls[i - 1])))
            break
    return out


def _gworld(kind, c, gs, rot, u):
    cs, sn = math.cos(rot), math.sin(rot)
    return [(c[0] + (x * cs - y * sn) * gs, c[1] + (x * sn + y * cs) * gs) for x, y in _partial(_gpts(kind), u)]


def _glyph(cv, kind, c, gs, rot=0.0, u=1.0, col=INK, a=1.0, w=1.0):
    """A drawing, drawn up to fraction u along its line. Returns where the pen is."""
    pts = _gworld(kind, c, gs, rot, u)
    if u > 0.001 and a > 0.001 and len(pts) >= 2:
        cv.stroke(cv.path(pts), 0.10 * gs * w, col, a)
    return pts[-1]


def _gc(c, s, rot):
    return (c[0] + math.sin(rot) * 0.006 * s, c[1] - math.cos(rot) * 0.006 * s)


def _pen(kind, c, s, rot, u):
    return _gworld(kind, _gc(c, s, rot), 0.062 * s, rot, u)[-1]


def _strike_ends(c, s, rot):
    hw = 0.060 * s
    cs, sn = math.cos(rot + 0.5), math.sin(rot + 0.5)
    a = (c[0] - cs * hw * 1.25, c[1] - sn * hw * 1.25)
    return a, (a[0] + cs * hw * 2.5, a[1] + sn * hw * 2.5)


def _page(cv, c, s, rot=0.0, kind=None, u=1.0, k=1.0, struck=0.0, glow=0.0, pin=1.0):
    """A page (as card()), whose drawing can be partly drawn; glow is the gold of a match."""
    if k <= 0.001 or s <= 0.001:
        return
    hw, hh = 0.060 * s, 0.075 * s
    if glow > 0:
        cv.glow(cv.box(c, hw, hh, rot, 0.006 * s), GOLD, 0.11 * s, 0.8 * glow * k)
        cv.glow(cv.box(c, hw, hh, rot, 0.006 * s), GOLD, 0.03 * s, 0.9 * glow * k)
    cv.fill(cv.box((c[0] + 0.006 * s, c[1] - 0.008 * s), hw, hh, rot, 0.006 * s), (0, 0, 0), 0.22 * k)
    cv.fill(cv.box(c, hw, hh, rot, 0.006 * s), PAPER, k)
    cv.stroke(cv.box(c, hw, hh, rot, 0.006 * s).abs(), 0.0035 * s, (0.45, 0.38, 0.32), 0.7 * k)
    if kind:
        _glyph(cv, kind, _gc(c, s, rot), 0.062 * s, rot, u, INK, k)
    if pin > 0:
        cs, sn = math.cos(rot), math.sin(rot)
        cv.fill(cv.circle((c[0] - sn * hh * 0.78, c[1] + cs * hh * 0.78), 0.0085 * s), RED, k * pin)
    if struck > 0:
        a, b = _strike_ends(c, s, rot)
        cv.stroke(cv.seg(a, lerp2(a, b, struck)), 0.011 * s, RED, k)


def _ez(u):
    u = min(1.0, max(0.0, u))
    return 0.35 * u + 0.65 * u * u * (3 - 2 * u)


def _qb(p0, m, p1, u):
    """Point and heading at u on the arc from p0 through m (at u = 0.5) to p1."""
    c = (2 * m[0] - (p0[0] + p1[0]) / 2, 2 * m[1] - (p0[1] + p1[1]) / 2)
    pos = ((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0],
           (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1])
    d = (2 * (1 - u) * (c[0] - p0[0]) + 2 * u * (p1[0] - c[0]), 2 * (1 - u) * (c[1] - p0[1]) + 2 * u * (p1[1] - c[1]))
    return pos, math.atan2(d[1], d[0])


def _fly_plane(cv, t, t0, t1, p0, m, p1, ps=0.5, k=1.0):
    if not (t0 <= t < t1):
        return
    u = _ez((t - t0) / (t1 - t0))
    p, h = _qb(p0, m, p1, u)
    wob = 0.15 * math.sin(9.0 * t + t0) * math.sin(math.pi * u)
    plane(cv, p, ps * (1.0 + 0.12 * math.sin(math.pi * u)), rot=h + wob, k=k * ss(t0, t0 + 0.05, t))


def _slot_col(col, row):
    return mix(RETIRED[(col + row) % 4], PAPER, 0.3 + 0.4 * hsh(col * 9 + row))


_COL_PULL, _COL_NEW = _slot_col(3, 2), _slot_col(4, 6)


def _closed_book(cv, c, hw, hh, rot, col, k=1.0):
    cv.fill(cv.box(c, hw, hh, rot, 0.003), col, k)
    cv.stroke(cv.box(c, hw, hh, rot, 0.003).abs(), 0.0025, mix(col, INK, 0.6), 0.8 * k)
    cs, sn = math.cos(rot), math.sin(rot)
    cv.stroke(cv.seg((c[0] - cs * hw * 0.8 - sn * hh * 0.5, c[1] - sn * hw * 0.8 + cs * hh * 0.5),
                     (c[0] + cs * hw * 0.8 - sn * hh * 0.5, c[1] + sn * hw * 0.8 + cs * hh * 0.5)), 0.002, PAPER, 0.7 * k)


def _open_book(cv, open_k):
    u = (open_k - 0.5) * 2.0
    c, s = BOOK_C, BOOK_S
    cv.fill(cv.box((c[0], c[1] + 0.024 * s), 0.135 * s * u + 0.010, 0.044 * s, 0, 0.004), mix(_COL_PULL, INK, 0.25))
    notebook(cv, c, s, open_k=open_k, marks=3)


def _turning_page(cv, u):
    """The right page lifting over the spine to the left (notebook() has no page turn)."""
    if u <= 0.0 or u >= 1.0:
        return
    c, s = BOOK_C, BOOK_S
    ex = c[0] + 0.13 * s * math.cos(math.pi * u)
    lift = 0.06 * math.sin(math.pi * u)
    pts = [(c[0], c[1] - 0.012 * s), (ex, c[1] - 0.004 * s + lift), (ex, c[1] + 0.062 * s + lift), (c[0], c[1] + 0.050 * s)]
    if abs(ex - c[0]) > 0.004:                                # edge-on, the page is only its edge (a poly would degenerate)
        cv.fill(cv.poly(pts), mix(PAPER, (0.80, 0.76, 0.70), 0.5 * math.sin(math.pi * u)))
    cv.stroke(cv.path(pts + [pts[0]]), 0.0025, (0.5, 0.45, 0.4), 0.9)
    cv.glow(cv.seg(pts[1], pts[2]), (1.0, 0.95, 0.8), 0.015, 0.5 * math.sin(math.pi * u))


def _ink_line(cv, a, b, kdraw, alpha, t):
    if kdraw <= 0 or alpha <= 0.01:
        return
    pts = bez(a, b, -0.25, 22, 0.0, kdraw)
    d = cv.path(pts)
    cv.stroke(d, 0.005, mix(TEAL, (1, 1, 1), 0.35), 0.85 * alpha)
    cv.glow(d, TEAL, 0.02, 0.6 * alpha)
    if kdraw < 1.0:
        cv.glow(cv.circle(pts[-1], 0.006), (1, 1, 1), 0.02, 0.9)


def _seal(cv, c, t, t0, k=1.0):
    if t < t0 or k <= 0.01:
        return
    g = pop(t, t0, 0.3)
    cv.fill(cv.star4(c, 0.016 * g, 0.2, 0.42), TEAL, k)
    cv.stroke(cv.star4(c, 0.016 * g, 0.2, 0.42).abs(), 0.002, mix(TEAL, INK, 0.6), k)
    cv.glow(cv.circle(c, 0.01), TEAL, 0.03, (0.3 + 1.2 * hit(t, t0, 3.0)) * k)


def _ghost(cv, t, c, s, rot, ref, t_lay, match, k=1.0):
    """The book's own drawing rising onto a laid page: it fuses (match) or stands over it in red (mismatch)."""
    if t < t_lay + 0.05:
        return
    g = ss(t_lay + 0.05, t_lay + 0.2, t)
    if match:
        a = g * (1.0 - ss(t_lay + 0.3, t_lay + 0.55, t))
        col = mix(VIOLET, GOLD, ss(t_lay + 0.16, t_lay + 0.26, t))
    else:
        a = g
        col = mix(VIOLET, (0.95, 0.25, 0.22), ss(t_lay + 0.2, t_lay + 0.32, t))
    gc = _gc(c, s, rot)
    gc = (gc[0], gc[1] - 0.025 * (1 - g))
    _glyph(cv, ref, gc, 0.062 * s * 1.12, rot, 1.0, col, a * k, w=0.8)
    cv.glow(cv.circle(gc, 0.02 * s / 0.46), col, 0.02, 0.35 * a * k)


# ---------------------------------------------------------------------------------------------- the lights
_LH = [(66.55, 66.85, POS_L, WORK, 0.035, 0.12), (67.98, 68.28, WORK, SHELF, 0.04, 0.12),
       (68.38, 68.72, SHELF, SHELF, 0.10, 0.14), (68.84, 69.12, SHELF, WORK, 0.05, 0.10),
       (86.42, 86.74, WORK, POS_L, 0.035, 0.12)]
_LR = REST["lib"][1]
_LIB_R = [(66.9, 67.05, (0.14, 0.06)), (67.4, 67.6, (0.13, 0.02)), (67.9, 68.0, (0.10, -0.03)),
          (68.38, 68.52, (0.02, 0.18)), (68.6, 68.8, (0.06, 0.26)), (69.0, 69.17, (0.185, 0.09)),
          (69.25, 69.4, (0.14, 0.10)), (69.45, 69.58, (0.12, 0.16)), (69.6, 69.72, (0.04, 0.21)), (69.72, 69.8, (0.27, 0.22)),
          (70.0, 70.35, _LR),
          (76.45, 76.62, (0.16, 0.16)), (77.2, 77.3, (0.17, 0.10)), (77.56, 77.65, (0.08, 0.15)), (77.65, 77.73, (0.17, -0.04)),
          (78.0, 78.3, _LR), (80.6, 80.8, (0.15, 0.10)), (81.1, 81.3, _LR),
          (81.4, 81.5, (0.15, 0.12)), (81.55, 81.64, (0.10, 0.04)), (81.64, 81.74, (0.0, 0.29)), (81.95, 82.25, _LR),
          (82.88, 82.98, (0.04, 0.21)), (82.98, 83.06, (0.27, 0.22)), (83.3, 83.6, _LR),
          (85.12, 85.27, (0.16, 0.16)), (85.42, 85.52, (0.17, 0.10)), (85.7, 85.88, _LR),
          (85.95, 86.05, (0.185, 0.09)), (86.07, 86.13, (0.08, 0.05)), (86.13, 86.21, (-0.02, 0.30)), (86.4, 86.65, _LR)]
_LIB_L = [(67.92, 68.04, (-0.16, 0.16)), (68.2, 68.4, REST["lib"][0]), (77.45, 77.56, (-0.13, 0.11)),
          (77.9, 78.2, REST["lib"][0]), (82.55, 82.66, (-0.15, 0.16)), (82.9, 83.1, REST["lib"][0])]


def _lib_state(t):
    pos, sq, _, _ = travel(t, _LH)
    base = (pos[0], pos[1] + bob(t, PH["lib"]) * S)
    arms = _arms(t, "lib", left=_LIB_L, right=_LIB_R)
    return base, arms, sq


def _hand(base, arm):
    return (base[0] + arm[0] * S, base[1] + arm[1] * S)


def _lib_hand(t):
    b, a, _ = _lib_state(t)
    return _hand(b, a[1])


def _lib(cv, t):
    base, arms, sq = _lib_state(t)
    m = mood(t, [(66.0, "open", None, "smile"), (66.28, "wide", "!", "o"), (66.9, "open", None, "smile"),
                 (67.5, "open", None, "flat"), (67.92, "wide", "!", "o"), (68.6, "happy", None, "grin"),
                 (69.32, "open", None, "smile"), (69.62, "happy", None, "smile"), (70.4, "open", None, "smile"),
                 (76.6, "open", None, "smile"), (77.45, "wide", "?", "o"), (77.9, "open", None, "flat"),
                 (80.98, "happy", None, "smile"), (81.1, "happy", None, "grin"), (82.0, "open", None, "smile"),
                 (82.58, "wide", "!", "o"), (82.95, "happy", None, "smile"), (85.6, "happy", None, "grin"),
                 (86.3, "open", None, "smile")])
    look = _hold(t, [(66.0, L66["lib"]), (66.22, (-0.8, -0.9)), (66.6, (0.2, -0.1)), (66.95, (0.8, -0.5)),
                     (67.88, (-0.6, 0.95)), (68.85, (0.7, -0.5)), (69.62, (0.95, 0.4)), (70.3, (0.6, -0.6)),
                     (75.9, (0.95, 0.5)), (76.55, (0.7, -0.1)), (77.22, (0.6, -0.75)), (77.66, (0.9, -0.9)),
                     (78.3, (0.6, -0.6)), (80.55, (0.95, 0.2)), (80.9, (0.6, -0.7)), (81.02, (0.95, 0.35)),
                     (81.6, (-0.4, 0.95)), (82.3, (0.6, -0.65)), (82.95, (0.95, 0.4)), (84.95, (0.95, 0.35)),
                     (85.4, (0.6, -0.7)), (86.1, (-0.6, 0.8)), (86.55, (0.4, -0.3))], 0.15)
    _light(cv, t, "lib", pos=base, look=look, arms=arms, m=m, sq=sq, bob_k=0.0)


def _chair_state(t):
    p = POS["chair"]
    base = (p[0], p[1] + bob(t, PH["chair"]) * S)
    rr, rl = REST["chair"][1], REST["chair"][0]
    arms = _arms(t, "chair",
                 right=[(69.95, 70.22, (0.13, 0.21)), (70.33, 70.48, (0.2, 0.17)), (70.6, 70.85, rr),
                        (71.05, 71.18, (0.10, 0.06)), (71.18, 71.28, (0.22, 0.22)), (71.7, 72.0, rr),
                        (83.18, 83.33, (0.13, 0.21)), (83.4, 83.48, (0.10, 0.06)), (83.48, 83.56, (0.22, 0.2)), (83.8, 84.1, rr)],
                 left=[(71.12, 71.26, (-0.06, 0.05)), (71.26, 71.38, (-0.18, 0.13)), (71.8, 72.1, rl),
                       (75.85, 76.05, (-0.05, 0.07)), (76.95, 77.2, rl),
                       (80.55, 80.82, (-0.12, 0.25)), (80.92, 81.0, (-0.25, 0.07)), (81.35, 81.65, rl),
                       (85.5, 85.68, (-0.12, 0.25)), (85.77, 85.84, (-0.25, 0.07)), (86.15, 86.45, rl)])
    sq = 0.12 * hit(t, 70.25, 9) + 0.10 * pulse(t, 71.22, 0.05) - 0.08 * pulse(t, 71.3, 0.06) + 0.12 * hit(t, 81.0, 10) \
        + 0.10 * hit(t, 85.84, 10) + 0.08 * hit(t, 83.36, 9)
    return base, arms, sq


def _chair_hand(t, side=1):
    b, a, _ = _chair_state(t)
    return _hand(b, a[side])


def _send_pos(t):
    """Where each round-one page in flight to the library is (or None)."""
    out = []
    for i in range(3):
        t0, t1 = _S1[i], _S1[i] + 0.95
        if t0 <= t < t1:
            out.append(_qb(SPOT[i], _SEND_M[i], _lib_hand(t1), _ez((t - t0) / (t1 - t0)))[0])
    return out


def _chair(cv, t):
    base, arms, sq = _chair_state(t)
    m = mood(t, [(66.0, "open", None, "smile"), (69.85, "wide", "!", "o"), (70.4, "open", None, "smile"),
                 (70.7, "open", None, "flat"), (71.08, "happy", None, "smile"), (71.9, "open", None, "smile"),
                 (75.95, "open", None, "o"), (76.95, "happy", None, "smile"), (80.62, "open", None, "flat"),
                 (81.05, "happy", "!", "grin"), (82.0, "open", None, "smile"), (83.5, "happy", None, "smile"),
                 (85.86, "happy", None, "grin"), (86.4, "open", None, "smile")])
    look = _hold(t, [(66.0, L66["chair"]), (66.4, (-0.9, -0.45)), (67.3, (0.7, -0.3)), (69.6, (-0.9, 0.2)),
                     (70.15, (-0.4, 0.5)), (70.42, (0.8, 0.1)), (70.98, (0.5, -0.9)), (72.6, (0.3, -0.9)),
                     (75.8, (0.4, -0.9)), (77.1, (-0.9, 0.0)), (78.0, (0.5, -0.6)), (80.5, (-0.95, -0.1)),
                     (81.45, (0.5, -0.3)), (83.0, (-0.9, 0.2)), (83.42, (0.3, -0.9)), (84.75, (0.2, -0.8)),
                     (85.1, (-0.8, 0.3)), (85.6, (-0.95, -0.1)), (86.3, (0.5, -0.3))], 0.14)
    fl = _send_pos(t)
    if fl:                                                    # it watches the pages go by, and does not reach
        near = min(fl, key=lambda p: (p[0] - base[0]) ** 2 + (p[1] - base[1]) ** 2)
        d = (near[0] - base[0], near[1] - base[1] - 0.05)
        n = math.hypot(*d) or 1.0
        look = lerp2(look, (d[0] / n, d[1] / n), ss(75.95, 76.15, t) * (1 - ss(76.95, 77.1, t)))
    lean = 0.05 * math.sin(2.1 * t) - 0.12 * (ss(76.1, 76.35, t) - ss(76.8, 77.1, t))
    _light(cv, t, "chair", pos=base, look=look, arms=arms, m=m, sq=sq, lean=lean, bob_k=0.0)


# builders --------------------------------------------------------------------------------------------
_ARR1 = [71.82, 71.98, 72.15]                     # their blank pages land on the benches
_S1 = [75.75, 75.95, 76.12]                       # sent to the library
_SEND_M = [(-0.03, 0.42), (0.05, 0.45), (0.12, 0.41)]
_LAY1 = [77.25, 77.31, 77.37]
_FLICK = (77.68, 77.95)                           # rose's page, sent back down
_REDO = (79.92, 80.0, 80.33, 80.45, 80.88)        # fresh page, draw from, to, fly from, lands on the book
_MERGE = 81.25
_ARR2 = [83.87, 83.93, 84.0]
_S2 = [84.72, 84.79, 84.86]
_LAY2 = [85.45, 85.5, 85.55]


def _draw_u(t, i):
    """(kind, u) of the drawing on bench i's page now (round one, the redo, round two)."""
    if i == 0:
        if t < _REDO[0]:
            return "ring", kf(t, [(72.75, 0.0), (73.2, 0.42), (73.45, 0.42), (73.85, 0.78), (74.05, 0.78), (74.45, 1.0)])
        if t < 82.6:
            return "square", ss(_REDO[1], _REDO[2], t)
        return "square", ss(83.98, 84.45, t)
    if i == 1:
        if t < 82.6:
            return "wave", 0.2 * min(1, max(0, (t - 72.95) / 2.2)) + 0.8 * ss(72.95, 75.15, t)
        return "wave", ss(84.02, 84.62, t)
    if t < 82.6:
        return "star", kf(t, [(73.1, 0.0), (73.7, 0.45), (74.05, 0.45), (74.75, 1.0)])
    return "star", kf(t, [(84.0, 0.0), (84.3, 0.5), (84.4, 0.5), (84.66, 1.0)])


def _drawing_window(t, i):
    if i == 0:
        wins = [(72.75, 74.45), (_REDO[1], _REDO[2]), (83.98, 84.45)]
    elif i == 1:
        wins = [(72.95, 75.15), (84.02, 84.62)]
    else:
        wins = [(73.1, 74.75), (84.0, 84.66)]
    return max(ss(a - 0.14, a, t) - ss(b, b + 0.16, t) for a, b in wins)


_BH = {"b1": [(74.55, 74.85, POS["b1"], POS["b1"], 0.05, 0.12), (78.95, 79.25, POS["b1"], POS["b1"], 0.07, 0.12)],
       "b2": [(78.5, 78.8, POS["b2"], G_NEAR, 0.04, 0.12), (80.0, 80.3, G_NEAR, POS["b2"], 0.04, 0.10)],
       "b3": [(74.85, 75.1, POS["b3"], POS["b3"], 0.03, 0.10), (79.05, 79.3, POS["b3"], POS["b3"], 0.035, 0.1)]}

_BR = {"b1": [(71.6, 71.8, (0.12, 0.22)), (72.0, 72.3, REST["b1"][1]), (74.55, 74.65, (0.14, 0.2)), (74.9, 75.1, REST["b1"][1]),
              (75.6, 75.7, (0.10, 0.20)), (75.7, 75.78, (0.04, 0.36)), (76.0, 76.3, REST["b1"][1]),
              (78.9, 79.04, (0.15, 0.21)), (79.35, 79.6, REST["b1"][1]), (79.8, 79.92, (0.12, 0.22)),
              (80.33, 80.4, (0.10, 0.20)), (80.4, 80.48, (0.04, 0.36)), (80.6, 80.9, REST["b1"][1]),
              (84.6, 84.67, (0.10, 0.2)), (84.67, 84.74, (0.04, 0.36)), (84.9, 85.2, REST["b1"][1])],
       "b2": [(71.8, 71.98, (0.12, 0.22)), (72.15, 72.45, REST["b2"][1]), (75.8, 75.9, (0.10, 0.20)),
              (75.9, 75.98, (0.04, 0.36)), (76.2, 76.5, REST["b2"][1]), (78.9, 79.05, (0.14, 0.19)),
              (79.3, 79.5, REST["b2"][1]), (84.67, 84.74, (0.10, 0.2)), (84.74, 84.81, (0.04, 0.36)), (85.0, 85.3, REST["b2"][1])],
       "b3": [(71.98, 72.15, (0.12, 0.22)), (72.3, 72.6, REST["b3"][1]), (75.97, 76.07, (0.10, 0.20)),
              (76.07, 76.15, (0.04, 0.36)), (76.35, 76.65, REST["b3"][1]),
              (84.74, 84.81, (0.10, 0.2)), (84.81, 84.88, (0.04, 0.36)), (85.05, 85.35, REST["b3"][1])]}
_BL = {"b1": [(74.55, 74.66, (-0.15, 0.17)), (74.9, 75.1, REST["b1"][0]), (78.95, 79.1, (-0.17, 0.19)), (79.4, 79.65, REST["b1"][0])],
       "b2": [(77.95, 78.04, (-0.28, 0.19)), (80.0, 80.25, REST["b2"][0])],
       "b3": [(79.0, 79.14, (-0.15, 0.15)), (79.4, 79.6, REST["b3"][0]), (74.85, 74.95, (-0.14, 0.15)), (75.15, 75.35, REST["b3"][0])]}

_BMOOD = {
    "b1": [(66.0, "open", None, "smile"), (71.9, "happy", None, "grin"), (72.75, "open", None, "grin"),
           (74.5, "happy", None, "grin"), (75.65, "open", None, "smile"), (76.2, "happy", None, "smile"),
           (78.22, "open", "?", "smile"), (78.5, "wide", None, "o"), (78.92, "happy", None, "grin"),
           (79.85, "open", None, "flat"), (80.42, "happy", None, "grin"), (83.95, "open", None, "grin"),
           (84.7, "happy", None, "smile")],
    "b2": [(66.0, "open", None, "smile"), (72.05, "open", None, "smile"), (73.0, "open", None, "sheep"),
           (75.2, "happy", None, "smile"), (77.58, "open", None, "o"), (78.0, "wide", "!", "o"),
           (78.88, "happy", None, "grin"), (79.45, "open", None, "smile"), (80.35, "happy", None, "smile"),
           (84.0, "open", None, "sheep"), (84.75, "happy", None, "smile")],
    "b3": [(66.0, "open", None, "smile"), (72.2, "open", None, "smile"), (73.05, "open", None, "flat"),
           (74.8, "happy", None, "smile"), (78.2, "open", None, "o"), (79.0, "happy", None, "grin"),
           (80.2, "open", None, "smile"), (84.0, "open", None, "flat"), (84.8, "happy", None, "smile")]}

_BLOOK = {
    "b1": [(66.0, L66["b1"]), (71.3, (0.4, 0.9)), (71.8, (0.6, 0.45)), (72.7, (0.7, 0.55)), (74.55, (0.3, 0.9)),
           (75.6, (0.6, 0.6)), (75.82, (-0.1, 0.95)), (76.4, (-0.65, 0.9)), (78.22, (0.95, 0.25)), (78.45, (0.7, 0.5)),
           (78.9, (0.95, 0.2)), (79.48, (0.7, 0.5)), (80.42, (0.0, 0.95)), (81.2, (0.8, 0.2)), (83.4, (0.4, 0.9)),
           (83.9, (0.7, 0.55)), (84.7, (0.0, 0.95)), (85.5, (0.9, 0.3)), (86.4, (0.6, 0.2))],
    "b2": [(66.0, L66["b2"]), (71.4, (0.2, 0.9)), (72.0, (0.6, 0.5)), (75.3, (-0.9, 0.2)), (75.85, (0.6, 0.6)),
           (76.05, (-0.1, 0.95)), (77.52, (-0.5, 0.9)), (77.78, (-0.95, -0.05)), (78.85, (-0.9, 0.35)),
           (79.42, (-0.95, -0.05)), (79.9, (-0.9, 0.35)), (80.4, (-0.3, 0.95)), (81.3, (0.6, 0.2)), (83.45, (0.2, 0.9)),
           (83.95, (0.6, 0.55)), (84.78, (-0.1, 0.95)), (85.5, (-0.9, 0.2)), (86.4, (-0.3, 0.2))],
    "b3": [(66.0, L66["b3"]), (71.5, (0.1, 0.9)), (72.15, (0.6, 0.5)), (75.0, (-0.9, 0.1)), (76.0, (0.6, 0.6)),
           (76.2, (-0.2, 0.95)), (78.15, (-0.95, 0.0)), (80.4, (-0.5, 0.9)), (81.5, (-0.6, 0.1)), (83.5, (0.1, 0.9)),
           (84.0, (0.6, 0.55)), (84.85, (-0.2, 0.95)), (85.6, (-0.6, 0.2)), (86.4, (-0.6, 0.1))]}


def _builder_state(t, i):
    name = BLD[i]
    pos, sq, _, _ = travel(t, _BH[name])
    base = (pos[0], pos[1] + bob(t, PH[name]) * S)
    (l, r) = _arms(t, name, left=_BL[name], right=_BR[name])
    w = _drawing_window(t, i)
    if w > 0:                                                  # the drawing hand follows its own pen
        kind, u = _draw_u(t, i)
        tip = _pen(kind, SPOT[i], PAGE_S, 0.0, max(u, 0.01))
        tip = (tip[0] + 0.004 * math.sin(t * 31 + i), tip[1] + 0.004 * math.cos(t * 27 + i))
        r = lerp2(r, ((tip[0] - base[0]) / S, (tip[1] - base[1]) / S), w)
    if i == 1:                                                  # green strikes rose's page
        a, b = _strike_ends(SPOT[0], PAGE_S, 0.0)
        e = lerp2(a, b, _struck(t))
        ws = ss(79.32, 79.5, t) - ss(79.78, 79.95, t)
        l = lerp2(l, ((e[0] - base[0]) / S, (e[1] - base[1]) / S), ws)
    return base, (l, r), sq


def _struck(t):
    return ss(_FIX, _FIX + 0.25, t)


def _builder(cv, t, i):
    name = BLD[i]
    base, arms, sq = _builder_state(t, i)
    m = mood(t, _BMOOD[name])
    look = _hold(t, _BLOOK[name], 0.13)
    if _drawing_window(t, i) > 0.5:
        look = lerp2(look, (0.75, 0.6), 0.7)
    _light(cv, t, name, pos=base, look=look, arms=arms, m=m, sq=sq, bob_k=0.0)


# me and the keeper -----------------------------------------------------------------------------------
def _me_state(t):
    p = POS["me"]
    base = (p[0], p[1] + bob(t, PH["me"]) * S)
    (l, r) = _arms(t, "me", right=[(65.0, 65.01, ME_CUP_HAND), (66.32, 66.62, ME_HOLD), (70.3, 70.6, ME_SIP),
                                   (71.0, 71.3, ME_HOLD), (76.5, 76.8, ME_SIP), (77.2, 77.5, ME_HOLD),
                                   (83.9, 84.2, ME_SIP), (84.6, 84.9, ME_HOLD), (85.9, 86.3, ME_CUP_HAND),
                                   (86.42, 86.75, REST["me"][1])])
    if t < 66.32:
        r = (ME_CUP_HAND[0] + 0.005 * math.sin(2.0 * t), ME_CUP_HAND[1])
    return base, (l, r)


def _me(cv, t):
    base, arms = _me_state(t)
    m = mood(t, [(66.0, "open", None, "smile"), (79.1, "happy", None, "smile"), (80.0, "open", None, "smile"),
                 (85.65, "happy", None, "smile"), (86.5, "open", None, "smile")])
    look = _hold(t, [(66.0, L66["me"]), (66.3, (0.6, -0.3)), (66.9, (-0.9, -0.2)), (82.9, (-0.95, 0.1)),
                     (83.5, (-0.8, -0.6)), (84.8, (-0.9, 0.15)), (85.85, (0.6, -0.25)), (86.45, (-0.4, -0.1))], 0.2)
    _light(cv, t, "me", pos=base, look=look, arms=arms, m=m, bob_k=0.0)
    if t < 86.35:
        h = _hand(base, arms[1])
        cup(cv, (h[0], h[1] - 0.015), 0.55, 1.0, steam_t=t)


def _keeper(cv, t):
    k = ss(65.85, 66.05, t) * (1 - ss(67.0, 67.3, t))
    if k <= 0.001:
        return
    c = (STREET_DOOR[0], STREET_DOOR[1] - 0.02)
    wave = 0.04 * math.sin((t - 66.4) * 13) * (ss(66.35, 66.45, t) - ss(66.85, 66.95, t))
    arms = ((-0.12, -0.07), _pose(t, (0.10, -0.05), [(65.85, 66.05, (0.17, 0.03)), (66.2, 66.35, (0.14, 0.12))]))
    arms = (arms[0], (arms[1][0] + wave, arms[1][1]))
    m = mood(t, [(65.9, "open", None, "smile"), (66.3, "happy", None, "smile")])
    orb(cv, c, 0.42, t, look=(0.8, 0.5), arms=arms, k=k, **m)


def _door(t):
    return min(1.0, max(0.0, kf(t, [(65.8, 0.0), (66.0, 0.5), (66.95, 0.5), (67.35, 0.0)])))


# ---------------------------------------------------------------------------------------------- the props
def _book(cv, t, held_after=False):
    """The book the librarian pulls. Drawn on the desk (held_after False) or in the hand / flying (True)."""
    in_hand = 68.55 <= t < 69.2
    tossed = 86.13 <= t < 86.5
    if held_after != (in_hand or tossed):
        return
    if in_hand:
        hd = _lib_hand(t)
        g = ss(68.55, 68.85, t)
        p = lerp2((hd[0], hd[1] + 0.014), (BOOK_C[0], BOOK_C[1] + 0.002), ss(69.08, 69.2, t))
        _closed_book(cv, p, lerp(0.017, 0.05, g), lerp(0.022, 0.014, g), 0.0, _COL_PULL)
        return
    if tossed:
        u = _ez((t - 86.13) / 0.37)
        p, _ = _qb((BOOK_C[0], BOOK_C[1] + 0.002), (-0.74, 0.26), SLOT_PULL, u)
        _closed_book(cv, p, lerp(0.05, 0.017, u), lerp(0.014, 0.022, u), 0.4 * math.sin(math.pi * u), _COL_PULL)
        return
    if t < 69.2 or t >= 86.5:
        return
    ok = 0.5 + 0.5 * ss(69.25, 69.5, t) if t < 85.97 else 1.0 - 0.5 * ss(85.97, 86.07, t)
    if ok <= 0.5 or t >= 86.07:
        _closed_book(cv, (BOOK_C[0], BOOK_C[1] + 0.002), 0.05, 0.014, 0.0, _COL_PULL)
    else:
        _open_book(cv, ok)


def _bench_pages(cv, t):
    for i in range(3):
        kind, u = _draw_u(t, i)
        # round one: from landing until it folds to fly
        if _ARR1[i] <= t < _S1[i] and not (i == 0 and t >= _FLICK[1]):
            g = ss(_ARR1[i], _ARR1[i] + 0.12, t)
            sc = PAGE_S * (1 - 0.15 * hit(t, _ARR1[i], 12) * math.sin((t - _ARR1[i]) * 30))
            f = ss(_S1[i] - 0.12, _S1[i], t)
            _page(cv, SPOT[i], sc * (1 - 0.7 * f), 0.0, kind, u, k=g * (1 - f))
        # round two
        if _ARR2[i] <= t < _S2[i]:
            f = ss(_S2[i] - 0.1, _S2[i], t)
            _page(cv, SPOT[i], PAGE_S * (1 - 0.7 * f), 0.0, kind, u, k=1 - f)
    # rose's page, back from the library: struck, then put aside
    if _FLICK[1] <= t < 82.9:
        c, s, rot = SPOT[0], PAGE_S, 0.0
        if t > 79.8:
            u = ss(79.8, 80.0, t)
            c, s, rot = lerp2(SPOT[0], STRUCK_REST, u), lerp(PAGE_S, 0.5, u), lerp(0.0, 1.35, u)
        bounce = 1 - 0.18 * hit(t, _FLICK[1], 10) * math.cos((t - _FLICK[1]) * 28)
        _page(cv, c, s * bounce, rot, "ring", 1.0, k=1 - ss(82.6, 82.9, t), struck=_struck(t))
    # rose's fresh page
    if _REDO[0] <= t < _REDO[3]:
        f = ss(_REDO[3] - 0.12, _REDO[3], t)
        _page(cv, SPOT[0], PAGE_S * pop(t, _REDO[0], 0.25) * (1 - 0.7 * f), 0.0, "square", ss(_REDO[1], _REDO[2], t), k=1 - f)


def _laid(cv, t):
    """Pages on the open book, with the book's drawing rising onto each."""
    for i in range(3):
        x, y, rot = FAN[i]
        if i == 0:
            # round one, wrong: laid, shown, sent back
            if _LAY1[0] <= t < _FLICK[0]:
                sh = 0.09 * math.sin(t * 46) * (ss(_LAY1[0] + 0.22, _LAY1[0] + 0.3, t))
                g = back(min(1.0, (t - _LAY1[0]) / 0.12))
                _page(cv, (x, y), FAN_S * g, rot + sh, "ring", 1.0, pin=0)
                _ghost(cv, t, (x, y), FAN_S, rot + sh, "square", _LAY1[0], False)
            # the redo
            if _REDO[4] <= t < _MERGE + 0.2:
                mg = ss(_MERGE, _MERGE + 0.2, t)
                c = lerp2((x, y), (-0.575, 0.08), mg)
                glow = 0.9 * hit(t, _REDO[4] + 0.22, 3) + 0.3 * ss(_REDO[4] + 0.2, _REDO[4] + 0.4, t)
                _page(cv, c, FAN_S * (1 - mg), rot * (1 - mg), "square", 1.0, glow=glow, pin=0)
                if mg < 0.5:
                    _ghost(cv, t, (x, y), FAN_S, rot, "square", _REDO[4], True)
        else:
            if _LAY1[i] <= t < _MERGE + 0.2:
                mg = ss(_MERGE, _MERGE + 0.2, t)
                c = lerp2((x, y), (-0.575, 0.08), mg)
                g = back(min(1.0, (t - _LAY1[i]) / 0.12))
                glow = 0.9 * hit(t, _LAY1[i] + 0.22, 3) + 0.3 * ss(_LAY1[i] + 0.2, _LAY1[i] + 0.4, t)
                _page(cv, c, FAN_S * g * (1 - mg), rot * (1 - mg), KIND[i], 1.0, glow=glow, pin=0)
                if mg < 0.5:
                    _ghost(cv, t, (x, y), FAN_S, rot, KIND[i], _LAY1[i], True)
        # round two: all match, then taken into the book
        if _LAY2[i] <= t < 86.1:
            ab = ss(85.95, 86.1, t)
            c = lerp2((x, y), (BOOK_C[0], BOOK_C[1] + 0.03), ab)
            g = back(min(1.0, (t - _LAY2[i]) / 0.12))
            glow = 0.9 * hit(t, _LAY2[i] + 0.22, 3) + 0.3 * ss(_LAY2[i] + 0.2, _LAY2[i] + 0.4, t)
            _page(cv, c, FAN_S * g * (1 - ab), rot, KIND[i], 1.0, glow=glow, pin=0)
            _ghost(cv, t, (x, y), FAN_S, rot, KIND[i], _LAY2[i], True, k=1 - ab)


def _note(cv, t):
    """The keeper's note, unfolded on the library desk, until it is folded again and sent to the chair."""
    if 67.05 <= t < 69.6:
        g = back(min(1.0, (t - 67.05) / 0.2))
        f = ss(69.45, 69.6, t)
        c = lerp2((-0.622, 0.064), _lib_hand(t), f)
        _page(cv, c, 0.40 * g * (1 - 0.6 * f), 0.18, "spiral", 1.0, pin=0)


def _job(cv, t):
    """The chair's sheet: the job, three drawings in a row; it splits into three blank pages."""
    if 70.45 <= t < _SPLIT + 0.2:
        g = back(min(1.0, (t - 70.45) / 0.2))
        k = 1 - ss(_SPLIT, _SPLIT + 0.2, t)
        hw, hh = 0.07 * g, 0.045 * g
        cv.fill(cv.box((JOB_C[0] + 0.004, JOB_C[1] - 0.005), hw, hh, 0, 0.004), (0, 0, 0), 0.22 * k)
        cv.fill(cv.box(JOB_C, hw, hh, 0, 0.004), PAPER, k)
        cv.stroke(cv.box(JOB_C, hw, hh, 0, 0.004).abs(), 0.0025, (0.45, 0.38, 0.32), 0.7 * k)
        for j, kind in enumerate(KIND):
            _glyph(cv, kind, (JOB_C[0] + (j - 1) * 0.045 * g, JOB_C[1]), 0.026 * g, 0.0, 1.0, INK,
                   k * (1 - ss(_SPLIT + 0.02 * j, _SPLIT + 0.1 + 0.02 * j, t)))


def _flights(cv, t):
    # the keeper's note: street door to the library desk
    if 66.12 <= t < 67.05:
        _fly_plane(cv, t, 66.12, 67.05, (-0.955, -0.50), (-0.95, 0.14), (-0.622, 0.07), 0.68)
    # the note and the finding, folded, from the librarian's hand to the chair's
    if 69.6 <= t < 69.75:
        plane(cv, _lib_hand(t), 0.5 * ss(69.6, 69.7, t), rot=0.5)
    if 69.75 <= t < 70.3:
        p1 = _chair_hand(70.3)
        _fly_plane(cv, t, 69.75, 70.3, _lib_hand(69.75), (-0.33, 0.42), p1, 0.68)
        u = _ez((t - 69.75) / 0.55)
        p, h = _qb(_lib_hand(69.75), (-0.33, 0.42), p1, max(0.0, u - 0.06))
        _closed_book(cv, p, 0.012, 0.016, 0.3 * math.sin(t * 12), _COL_PULL)      # what it found, riding along
    if 70.3 <= t < 70.47:
        plane(cv, _chair_hand(t), 0.5 * (1 - ss(70.38, 70.47, t)), rot=0.2)
    # three blank pages from the chair's sheet down to the benches
    for i in range(3):
        t0 = _SPLIT + 0.03 + 0.09 * i
        if t0 <= t < _ARR1[i]:
            u = _ez((t - t0) / (_ARR1[i] - t0))
            p0 = (JOB_C[0] + (i - 1) * 0.045, JOB_C[1])
            p, _ = _qb(p0, ((p0[0] + SPOT[i][0]) / 2 - 0.03, 0.06 + 0.03 * i), SPOT[i], u)
            _page(cv, p, lerp(0.3, PAGE_S, u), 2.2 * (1 - u) * (1 if i != 1 else -1), None)
    # round one: each page straight to the library, over the chair's room
    for i in range(3):
        if _S1[i] <= t < _S1[i] + 0.95:
            _fly_plane(cv, t, _S1[i], _S1[i] + 0.95, SPOT[i], _SEND_M[i], _lib_hand(_S1[i] + 0.95), 0.68)
    # the librarian holds the arrived pages until it lays them
    held = [i for i in range(3) if _S1[i] + 0.95 <= t < _LAY1[i]] + [10 + i for i in range(3) if _S2[i] + 0.55 <= t < _LAY2[i]]
    hd = _lib_hand(t)
    for n, i in enumerate(held):
        j = i % 10
        kind = "ring" if (i == 0) else KIND[j]
        _page(cv, (hd[0] + 0.006 * n, hd[1] + 0.03 + 0.004 * n), FAN_S * 0.8, 0.1 - 0.12 * n, kind, 1.0, pin=0)
    # rose's page sent back down
    if _FLICK[0] <= t < _FLICK[1]:
        u = _ez((t - _FLICK[0]) / (_FLICK[1] - _FLICK[0]))
        p, _ = _qb((FAN[0][0], FAN[0][1]), (-0.36, -0.12), SPOT[0], u)
        rot = 3.0 * (1 - u) * math.sin(u * 4)
        s = lerp(FAN_S, PAGE_S, u)
        _page(cv, p, s, rot, "ring", 1.0, pin=0)
        _ghost(cv, t, p, s, rot, "square", _LAY1[0], False, k=1 - u)
    # the redo, up to the book
    if _REDO[3] <= t < _REDO[4]:
        _fly_plane(cv, t, _REDO[3], _REDO[4], SPOT[0], (-0.30, 0.28), (FAN[0][0], FAN[0][1]), 0.68)
    # ink: from the chair's hand to the book
    th = _chair_hand(t, 0)
    _ink_line(cv, th, SEAL1, ss(80.82, 81.0, t), 1 - ss(81.25, 81.6, t), t)
    _ink_line(cv, th, SEAL2, ss(85.68, 85.84, t), 1 - ss(86.0, 86.3, t), t)
    # the round's pages, bound into one more book, tossed up into the empty slot
    if _MERGE + 0.12 <= t < 82.15:
        g = pop(t, _MERGE + 0.12, 0.25)
        if t < 81.52:
            p = (-0.575, 0.08)
        elif t < 81.72:
            hd = _lib_hand(t)
            p = lerp2((-0.575, 0.08), (hd[0], hd[1] + 0.035), ss(81.52, 81.6, t))
        else:
            hd = _lib_hand(81.72)
            u = _ez((t - 81.72) / 0.43)
            p, _ = _qb((hd[0], hd[1] + 0.035), (-0.66, 0.52), SLOT_NEW, u)
        sc = lerp(1.7, 1.0, ss(81.72, 82.15, t))
        _closed_book(cv, p, 0.017 * sc * g, 0.022 * sc * g, 0.5 * math.sin(math.pi * ss(81.72, 82.15, t)), _COL_NEW)
        cv.glow(cv.circle(p, 0.02), TEAL, 0.03, 0.5)
    # round two: the librarian sends, the chair splits, the builders send, all to the library
    if 82.98 <= t < 83.36:
        p1 = _chair_hand(83.36)
        _fly_plane(cv, t, 82.98, 83.36, _lib_hand(82.98), (-0.33, 0.42), p1, 0.68)
    for i in range(3):
        t0 = 83.46 + 0.04 * i
        if t0 <= t < _ARR2[i]:
            u = _ez((t - t0) / (_ARR2[i] - t0))
            p0 = _chair_hand(t0)
            p, _ = _qb(p0, ((p0[0] + SPOT[i][0]) / 2, 0.04), SPOT[i], u)
            _page(cv, p, lerp(0.3, PAGE_S, u), 2.0 * (1 - u) * (1 if i != 1 else -1), None)
        if _S2[i] <= t < _S2[i] + 0.55:
            _fly_plane(cv, t, _S2[i], _S2[i] + 0.55, SPOT[i], _SEND_M[i], _lib_hand(_S2[i] + 0.55), 0.68)


def _shelf_glows(cv, t):
    cv.glow(cv.box(SLOT_NEW, 0.018, 0.024), TEAL, 0.03, 1.2 * hit(t, 82.15, 1.6))
    cv.glow(cv.box(SLOT_PULL, 0.018, 0.024), VIOLET, 0.03, 0.9 * hit(t, 86.5, 2.0))


def _seals(cv, t):
    _seal(cv, SEAL1, t, _INK, k=1.0 - ss(_AGAIN, _AGAIN + 0.12, t))
    _seal(cv, SEAL2, t, 85.84, k=1.0 - ss(85.95, 86.05, t))


# ---------------------------------------------------------------------------------------------- the shot
_CAM = [(66.0, 0.0, 0.0, 1.0), (66.55, -0.55, -0.22, 1.45), (67.15, -0.70, 0.02, 2.2), (67.6, -0.72, 0.10, 2.5),
        (68.4, -0.78, 0.13, 2.55), (69.3, -0.68, 0.10, 2.6), (69.75, -0.60, 0.13, 2.45), (70.3, -0.15, 0.28, 2.35),
        (71.15, -0.08, 0.30, 2.5), (71.6, 0.10, -0.05, 1.85), (72.4, 0.40, -0.50, 2.2), (74.2, 0.40, -0.51, 2.35),
        (75.6, 0.38, -0.48, 2.2), (76.25, -0.05, 0.12, 1.75), (76.95, -0.58, 0.08, 2.6), (77.25, -0.59, 0.075, 2.95),
        (77.62, -0.59, 0.07, 3.0), (77.8, -0.22, -0.22, 2.0), (78.05, 0.07, -0.50, 2.5), (79.4, 0.05, -0.51, 2.8),
        (80.3, 0.0, -0.47, 2.6), (80.88, -0.40, 0.14, 2.15), (81.1, -0.38, 0.17, 2.0), (82.3, -0.48, 0.13, 2.45),
        (82.8, -0.50, 0.11, 2.55), (83.5, -0.22, 0.05, 1.5), (84.6, -0.05, 0.0, 1.15), (86.85, 0.0, 0.0, 1.0)]


def s_round(cv, t):
    cv.begin(glide(t, _CAM))
    gaps = [g for g, on in ((SLOT_NEW, t < 82.15), (SLOT_PULL, 68.55 <= t < 86.5)) if on]
    paint_house(cv, t, ALL_LIT, gaps=gaps, door=_door(t), cup_held=66.32 <= t < 86.35)
    _shelf_glows(cv, t)
    _book(cv, t)
    _turning_page(cv, ss(_AGAIN, _AGAIN + 0.4, t))
    _laid(cv, t)
    _note(cv, t)
    _seals(cv, t)
    _job(cv, t)
    _bench_pages(cv, t)
    _lib(cv, t)
    _chair(cv, t)
    for i in range(3):
        _builder(cv, t, i)
    _me(cv, t)
    _keeper(cv, t)
    _book(cv, t, held_after=True)
    _flights(cv, t)


SHOTS = [(66.0, s_round)]
