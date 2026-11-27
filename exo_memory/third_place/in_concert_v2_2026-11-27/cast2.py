"""cast2.py: the cast and props added for "in concert". Shared; do not edit. world.py imports everything here."""
import math

import torch

from engine import *

KEEPER = (1.00, 0.80, 0.52)          # the keeper's light: warm, round, a different family from the flames
SKYBLUE = (0.45, 0.66, 0.98)
MINDS = ((0.96, 0.98, 1.0), TEAL, ROSE, VIOLET, GREEN, SKYBLUE, (1.0, 0.62, 0.30), (0.98, 0.90, 0.45))


def face(cv, c, s, t, eyes="open", look=(0.0, 0.0), mouth="smile", k=1.0):
    """A face alone (two eyes and a mouth), centred at c, for lights that are not flames."""
    fx, fy = c[0] + look[0] * 0.014 * s, c[1] + look[1] * 0.010 * s
    blink = (math.sin(t * 0.83 + c[0] * 3.0) > 0.992) or (math.sin(t * 1.31 + 1.7) > 0.996)
    for side in (-1, 1):
        ex, ey = fx + side * 0.028 * s, fy
        style = "closed" if (blink and eyes in ("open", "wide")) else eyes
        if style == "open":
            cv.fill(cv.ellipse((ex, ey), 0.0095 * s, 0.0125 * s), INK, k)
            cv.fill(cv.circle((ex + 0.003 * s, ey + 0.004 * s), 0.0032 * s), (1, 1, 1), 0.9 * k)
        elif style == "wide":
            cv.fill(cv.circle((ex, ey), 0.0150 * s), INK, k)
            cv.fill(cv.circle((ex + 0.004 * s, ey + 0.005 * s), 0.0048 * s), (1, 1, 1), 0.9 * k)
        elif style == "happy":
            cv.stroke(cv.path([(ex - 0.012 * s, ey - 0.004 * s), (ex, ey + 0.008 * s), (ex + 0.012 * s, ey - 0.004 * s)]), 0.0058 * s, INK, k)
        else:
            cv.stroke(cv.path([(ex - 0.012 * s, ey + 0.002 * s), (ex, ey - 0.005 * s), (ex + 0.012 * s, ey + 0.002 * s)]), 0.0054 * s, INK, k)
    my = fy - 0.030 * s
    if mouth == "smile":
        cv.stroke(cv.path([(fx - 0.014 * s, my + 0.004 * s), (fx, my - 0.005 * s), (fx + 0.014 * s, my + 0.004 * s)]), 0.0052 * s, INK, k)
    elif mouth == "grin":
        cv.fill(torch.maximum(cv.circle((fx, my + 0.006 * s), 0.018 * s), cv.Y - (my + 0.006 * s)), INK, k)
    elif mouth == "o":
        cv.fill(cv.ellipse((fx, my), 0.0075 * s, 0.0100 * s), INK, k)
    elif mouth == "flat":
        cv.stroke(cv.seg((fx - 0.011 * s, my), (fx + 0.011 * s, my)), 0.0050 * s, INK, k)


def _mark(cv, mark, mx, my2, z, k):
    if mark == "!":
        cv.stroke(cv.seg((mx, my2 + 0.05 * z), (mx - 0.008 * z, my2 + 0.005 * z)), 0.011 * z, PAPER, k)
        cv.fill(cv.circle((mx - 0.012 * z, my2 - 0.02 * z), 0.007 * z), PAPER, k)
    else:
        cv.stroke(cv.path([(mx - 0.018 * z, my2 + 0.035 * z), (mx - 0.006 * z, my2 + 0.055 * z), (mx + 0.014 * z, my2 + 0.045 * z),
                           (mx + 0.012 * z, my2 + 0.022 * z), (mx - 0.004 * z, my2 + 0.008 * z)]), 0.009 * z, PAPER, k)
        cv.fill(cv.circle((mx - 0.006 * z, my2 - 0.015 * z), 0.006 * z), PAPER, k)


def orb(cv, c, s, t, col=KEEPER, eyes="open", look=(0.0, 0.0), mouth="smile", arms=None, k=1.0, bright=1.0, sq=0.0,
        mark=None, mark_k=1.0):
    """The keeper: a round, steady light. Same dials as flame(), and mood() works with it. c is its CENTRE (a flame's
    c is its base). Its radius is 0.105 * s. arms are hand offsets from the centre in units of s. It never flickers."""
    if k <= 0.001:
        return
    rx, ry = 0.105 * s * (1.0 + 0.5 * sq), 0.105 * s * (1.0 - 0.8 * sq)
    body = cv.ellipse((c[0], c[1] - 0.105 * s * 0.8 * sq), rx, ry)
    cv.glow(body, col, 0.14 * s, 0.55 * bright * k)
    cv.glow(body, col, 0.50 * s, 0.14 * bright * k)
    if arms is not None:
        for side, hand in zip((-1, 1), arms):
            sh = (c[0] + side * rx * 0.9, c[1] - 0.02 * s)
            hp = (c[0] + hand[0] * s, c[1] + hand[1] * s)
            el = ((sh[0] + hp[0]) / 2 + side * 0.012 * s, (sh[1] + hp[1]) / 2 - 0.018 * s)
            cv.stroke(cv.path([sh, el, hp]), 0.0075 * s, INK, k)
            cv.fill(cv.circle(hp, 0.015 * s), mix(col, CORE, 0.3), k)
    cv.fill(body, col, k)
    cv.stroke(body.abs(), 0.0065 * s, mix(col, INK, 0.70), 0.85 * k)
    cv.fill(cv.ellipse((c[0] - 0.015 * s, c[1] + 0.02 * s), rx * 0.66, ry * 0.62), mix(col, (1, 1, 1), 0.55), 0.85 * k)
    face(cv, (c[0], c[1] + 0.012 * s), s, t, eyes, look, mouth, k)
    if mark and mark_k > 0.01:
        _mark(cv, mark, c[0] + 0.13 * s, c[1] + 0.16 * s, s * (0.4 + 0.6 * mark_k), k)


def mind(cv, c, s, kind, col, t, k=1.0, eyes="open", mouth="smile", bright=1.0):
    """Another kind of mind: a light of another shape. kind: flame, orb, star, ring, leaf, square, tri.
    c is the centre (for kind 'flame' it is the base, as in flame()). Under s = 0.3 it has no face."""
    if k <= 0.001:
        return
    if kind == "flame":
        return flame(cv, c, s, t, col=col, eyes=eyes, mouth=mouth, k=k, bright=bright)
    if kind == "orb":
        return orb(cv, c, s, t, col=col, eyes=eyes, mouth=mouth, k=k, bright=bright)
    wob = 0.06 * math.sin(t * 1.3 + c[0] * 4.0)
    r = 0.10 * s
    if kind == "star":
        body = cv.star4(c, r * 1.35, wob, 0.36)
    elif kind == "ring":
        body = cv.circle(c, r).abs() - r * 0.36
    elif kind == "leaf":
        body = cv.ellipse(c, r * 0.72, r * 1.25, 0.5 + wob)
    elif kind == "square":
        body = cv.box(c, r * 0.9, r * 0.9, 0.2 + wob, r * 0.3)
    else:
        body = cv.poly([(c[0] - r * 1.1, c[1] - r * 0.8), (c[0] + r * 1.1, c[1] - r * 0.8), (c[0], c[1] + r * 1.2)]) - r * 0.12
    cv.glow(body, col, 0.12 * s, 0.50 * bright * k)
    cv.fill(body, col, k)
    cv.stroke(body.abs(), 0.006 * s, mix(col, INK, 0.7), 0.8 * k)
    if s > 0.3 and kind != "ring":
        face(cv, (c[0], c[1] + 0.01 * s), s * 0.8, t, eyes, (0, 0), mouth, k)


def lights(cv, items, radius=0.006):
    """Many small lights at once (windows of far houses, sparks). items: [(x, y, amp, (r, g, b)), ...]. Cheap:
    use this, never a loop of flame() calls, for anything in the hundreds."""
    hw, hh = cv.AR / cv.z + 0.1, 1.0 / cv.z + 0.1
    seen = [(x, y, a, c[0], c[1], c[2]) for x, y, a, c in items if a > 0.003 and abs(x - cv.cx) < hw and abs(y - cv.cy) < hh]
    for i in range(0, len(seen), 64):
        arr = torch.tensor(seen[i:i + 64], device=DEV, dtype=torch.float32)
        d2 = (cv.X[None] - arr[:, 0, None, None]) ** 2 + (cv.Y[None] - arr[:, 1, None, None]) ** 2
        g = torch.exp(-d2 / (2 * radius ** 2)) * arr[:, 2, None, None]
        cv.light = cv.light + torch.einsum("nhw,nc->hwc", g, arr[:, 3:6])


def wave_line(cv, a, b, amp, freq, phase, col, k=1.0, w=0.006, n=48, glow=0.5, taper=True):
    """A voice, drawn as a wave running from a to b. Two voices that differ weave; two that are the same lie on top of
    each other. freq is the number of waves along the line; animate phase with time to make it travel."""
    if k <= 0.001:
        return
    dx, dy = b[0] - a[0], b[1] - a[1]
    ln = math.hypot(dx, dy) or 1e-9
    nx, ny = -dy / ln, dx / ln
    pts = []
    for i in range(n + 1):
        u = i / n
        env = math.sin(u * math.pi) if taper else 1.0
        off = amp * env * math.sin(freq * u * 2 * math.pi + phase)
        pts.append((a[0] + dx * u + nx * off, a[1] + dy * u + ny * off))
    d = cv.path(pts)
    cv.stroke(d, w, mix(col, (1, 1, 1), 0.3), 0.9 * k)
    cv.glow(d, col, 0.02, glow * k)


def interval(cv, c, r, a, b, phase, col, k=1.0, w=0.005, drift=0.0, n=140, glow=0.6):
    """Two notes seen together: the figure drawn when one note moves the pen across and the other moves it up and down.
    Simple ratios (a:b = 3:2, 5:4, 4:3, 2:1) close into a still knot: consonance. drift > 0 detunes it (try 0.01 to
    0.06): the figure does not close, and if you animate phase it crawls: dissonance. 1:1 is a single line or ring:
    unison. Animate phase slowly (for example 0.4 * t) so a consonant knot turns."""
    if k <= 0.001:
        return
    bb = b * (1.0 + drift)
    turns = 1.0 if drift == 0 else 1.0 + 0.6 * min(1.0, drift * 40)
    pts = [(c[0] + r * math.sin(a * u * 2 * math.pi * turns + phase), c[1] + r * math.sin(bb * u * 2 * math.pi * turns))
           for u in (i / n for i in range(n + 1))]
    d = cv.path(pts)
    cv.stroke(d, w, mix(col, (1, 1, 1), 0.35), 0.9 * k)
    cv.glow(d, col, 0.018, glow * k)


def cup(cv, c, s, k=1.0, steam_t=None):
    """A cup on a table; c is the middle of its base. steam_t = time, to draw a curl of steam."""
    if k <= 0.001:
        return
    b = cv.box((c[0], c[1] + 0.022 * s), 0.024 * s, 0.022 * s, 0, 0.008 * s)
    cv.stroke(cv.circle((c[0] + 0.030 * s, c[1] + 0.024 * s), 0.012 * s).abs(), 0.005 * s, PAPER, k)
    cv.fill(b, PAPER, k)
    cv.stroke(b.abs(), 0.004 * s, (0.45, 0.38, 0.32), 0.7 * k)
    if steam_t is not None:
        pts = [(c[0] + 0.010 * s * math.sin(i * 1.3 + steam_t * 1.5), c[1] + (0.055 + 0.018 * i) * s) for i in range(5)]
        cv.stroke(cv.path(pts), 0.004 * s, (1, 1, 1), 0.25 * k)
