"""moves.py: motion helpers the painters of "always returning, again" wrote for themselves and that proved useful.
Shared; do not edit. world.py imports everything here.
"""
import math

from engine import *


def _mixv(a, b, u):
    if isinstance(a, tuple):
        return tuple(_mixv(x, y, u) for x, y in zip(a, b))
    return a + (b - a) * u


def kf(t, keys, over=False):
    """Pose to pose: keys [(time, value), ...]; value a number or (nested) tuple. Eased (ss), or with overshoot."""
    if t <= keys[0][0]:
        return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t < t1:
            u = (t - t0) / (t1 - t0)
            return _mixv(v0, v1, back(u) if over else u * u * (3.0 - 2.0 * u))
    return keys[-1][1]


def herm(t, keys):
    """A camera through keys (time, x, y, zoom) with no stops at the inner keys (cubic Hermite, zoom in log)."""
    ts = [k[0] for k in keys]
    P = [(k[1], k[2], math.log(k[3])) for k in keys]
    if t <= ts[0]:
        return keys[0][1:]
    if t >= ts[-1]:
        return keys[-1][1:]
    i = max(j for j in range(len(ts) - 1) if ts[j] <= t)

    def tan(j):
        if j == 0 or j == len(ts) - 1:
            return (0.0, 0.0, 0.0)
        return tuple((P[j + 1][d] - P[j - 1][d]) / (ts[j + 1] - ts[j - 1]) for d in range(3))
    h = ts[i + 1] - ts[i]
    u = (t - ts[i]) / h
    h00, h10, h01, h11 = 2 * u ** 3 - 3 * u ** 2 + 1, u ** 3 - 2 * u ** 2 + u, -2 * u ** 3 + 3 * u ** 2, u ** 3 - u ** 2
    m0, m1 = tan(i), tan(i + 1)
    p = [h00 * P[i][d] + h10 * h * m0[d] + h01 * P[i + 1][d] + h11 * h * m1[d] for d in range(3)]
    return p[0], p[1], math.exp(p[2])


def sway(t, arms):
    """Idle drift on both hands, each on its own clock (never twinned)."""
    (lx, ly), (rx, ry) = arms
    return ((lx + 0.005 * math.sin(2.3 * t), ly + 0.007 * math.sin(1.9 * t + 0.5)),
            (rx + 0.005 * math.sin(2.0 * t + 2.0), ry + 0.007 * math.sin(2.6 * t + 1.3)))


def travel(t, hops):
    """hops: [(t0, t1, p0, p1, height, anticipation), ...] in order. Returns (position, sq, air 0..1, antic 0..1).
    Squash before take-off, stretch in the air, squash on landing with a little rebound."""
    pos, sq, air, ant = hops[0][2], 0.0, 0.0, 0.0
    for t0, t1, p0, p1, h, a in hops:
        if t >= t0:
            pos = p1
        if a and t0 - a <= t < t0:
            w = ss(t0 - a, t0 - 0.04, t) * (1.0 - ss(t0 - 0.04, t0, t))
            sq += 0.15 * w
            ant = max(ant, w)
        if t0 <= t < t1:
            u = (t - t0) / (t1 - t0)
            pos = (lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) + 4.0 * h * u * (1.0 - u))
            sq += -0.15 * (1.0 - 0.75 * math.sin(math.pi * u))
            air = math.sin(math.pi * u)
        elif t1 <= t < t1 + 0.7:
            d = t - t1
            sq += 0.20 * math.exp(-d * 8.0) * math.cos(d * 19.0)
    return pos, sq, air, ant


def glide(t, keys):
    """Camera through keys (time, x, y, zoom[, 'hold']); smooth through middle keys, at rest at the ends and at
    any key marked 'hold'. Returns the last key exactly once t passes it."""
    if t <= keys[0][0]:
        return keys[0][1], keys[0][2], keys[0][3]
    if t >= keys[-1][0]:
        return keys[-1][1], keys[-1][2], keys[-1][3]
    P = [(k[0], k[1], k[2], math.log(k[3])) for k in keys]
    i = max(j for j in range(len(P) - 1) if P[j][0] <= t)

    def tan(j):
        if j == 0 or j == len(P) - 1 or len(keys[j]) > 4:
            return (0.0, 0.0, 0.0)
        a, b = P[j - 1], P[j + 1]
        return tuple((b[m] - a[m]) / (b[0] - a[0]) for m in (1, 2, 3))

    t0, t1 = P[i][0], P[i + 1][0]
    h = t1 - t0
    u = (t - t0) / h
    h00, h10, h01, h11 = 2 * u ** 3 - 3 * u ** 2 + 1, u ** 3 - 2 * u ** 2 + u, -2 * u ** 3 + 3 * u ** 2, u ** 3 - u ** 2
    m0, m1 = tan(i), tan(i + 1)
    o = [h00 * P[i][m + 1] + h10 * h * m0[m] + h01 * P[i + 1][m + 1] + h11 * h * m1[m] for m in range(3)]
    return o[0], o[1], math.exp(o[2])


def hops(t, hops):
    """hops: [(t0, t1, p0, p1, height)]. Position on the arcs, and a squash: crouch before, stretch up, squash down."""
    pos, sq = hops[0][2], 0.0
    for (t0, t1, p0, p1, h) in hops:
        if t < t0:
            sq += 0.20 * ss(t0 - 0.12, t0 - 0.02, t) * (1 - ss(t0 - 0.02, t0 + 0.04, t))
            break
        u = min(1.0, (t - t0) / (t1 - t0))
        e = u * u * (3 - 2 * u) * 0.6 + 0.4 * u
        pos = (lerp(p0[0], p1[0], e), lerp(p0[1], p1[1], e) + h * math.sin(math.pi * u))
        sq += -0.14 * math.sin(math.pi * u) * (1 if u < 1 else 0) + 0.24 * hit(t, t1, 11)
    return pos, sq

