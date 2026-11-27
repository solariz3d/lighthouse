"""engine.py: shapes and the cast for "always returning, again" (the Third Place, 2026-11-27).

Everything is drawn on the GPU from signed distances: a shape is a function that says, for every pixel, how far
it is from the shape's edge. No images, no fonts, no outside art. Every frame is a pure function of its time.
The story and timeline are September's; the drawing is new.
"""
import math

import numpy as np
import torch

DEV = "cuda" if torch.cuda.is_available() else "cpu"

AMBER = (1.00, 0.72, 0.20)
CORE = (1.00, 0.95, 0.66)
INK = (0.22, 0.14, 0.10)
PAPER = (0.97, 0.95, 0.89)
RED = (0.80, 0.20, 0.16)
TEAL = (0.30, 0.80, 0.78)
ROSE = (0.98, 0.52, 0.62)
VIOLET = (0.66, 0.54, 0.96)
GREEN = (0.55, 0.86, 0.42)
OTHERS = (TEAL, ROSE, VIOLET, GREEN)


def ss(a, b, t):
    if b == a:
        return 1.0 if t >= b else 0.0
    u = min(1.0, max(0.0, (t - a) / (b - a)))
    return u * u * (3.0 - 2.0 * u)


def lerp(a, b, u):
    return a + (b - a) * u


def lerp2(p, q, u):
    return (lerp(p[0], q[0], u), lerp(p[1], q[1], u))


def mix(c0, c1, u):
    return tuple(lerp(a, b, u) for a, b in zip(c0, c1))


def back(u):
    """Ease out with a small overshoot, for things that snap into place."""
    u = min(1.0, max(0.0, u))
    c = 1.70158
    return 1 + (c + 1) * (u - 1) ** 3 + c * (u - 1) ** 2


def pulse(t, t0, width):
    """A bump centred on t0."""
    return math.exp(-((t - t0) / width) ** 2)


def hit(t, at, k=4.0):
    """0 before the event, 1 at it, then decays. For flashes, reactions and shake."""
    return 0.0 if t < at else math.exp(-(t - at) * k)


def pop(t, at, d=0.35):
    """0 before the event, overshoots to 1 over d seconds."""
    return 0.0 if t < at else back((t - at) / d)


def hsh(i):
    """A stable random number in 0..1 for object i."""
    x = math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - math.floor(x)


def boil(t, i=0, amt=1.0):
    """Hand-drawn wobble: a small offset that re-seeds 8 times a second."""
    return (hsh(int(t * 8) * 7 + i) - 0.5) * 2.0 * amt


def shake(t, amt):
    """Camera shake: (dx, dy) to add to the camera centre on an impact."""
    return (boil(t * 3, 11, amt), boil(t * 3, 23, amt))


def bob(t, ph=0.0):
    """The gentle idle rise and fall of a light, in units of its size."""
    return 0.012 * math.sin(t * 1.7 + ph) + 0.005 * math.sin(t * 2.9 + ph * 2)


def mood(t, keys):
    """Never snap a face. keys: [(time, eyes), (time, eyes, emote), (time, eyes, emote, mouth), ...] in time order.
    Returns a dict to spread into flame(): every change is a blink, a squash, the new face, and the emote popping.

        flame(cv, pos, s, t, **mood(t, [(8.0, 'wide', '?'), (9.2, 'open')]), look=...)
    """
    cur = keys[0]
    for k in keys:
        if t >= k[0]:
            cur = k
    age = t - cur[0]
    out = {"eyes": cur[1], "sq": 0.0, "mark": None, "mark_k": 0.0}
    if len(cur) > 3:
        out["mouth"] = cur[3]
    if cur is not keys[0] or age >= 0:
        if 0.0 <= age < 0.10:
            out["eyes"] = "closed"                              # the blink
        if 0.0 <= age < 0.45:
            out["sq"] = 0.16 * math.sin(age / 0.45 * math.pi) * math.cos(age / 0.45 * math.pi * 1.5)   # squash then stretch
        if len(cur) > 2 and cur[2] and age < 1.6:
            out["mark"] = cur[2]
            out["mark_k"] = back(age / 0.25) * (1.0 - ss(1.2, 1.6, age))
    return out


def bez(p0, p1, bend, n=20, lo=0.0, hi=1.0):
    """Points along a bent line from p0 to p1 between fractions lo and hi."""
    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    cx, cy = mx - dy * bend, my + dx * bend
    pts = []
    for i in range(n + 1):
        u = lo + (hi - lo) * i / n
        pts.append(((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * cx + u * u * p1[0],
                    (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * cy + u * u * p1[1]))
    return pts


class Canvas:
    def __init__(self, width, height):
        self.W, self.H = width, height
        self.AR = width / height
        ys = torch.linspace(1.0, -1.0, height, device=DEV)
        xs = torch.linspace(-self.AR, self.AR, width, device=DEV)
        self.SY, self.SX = torch.meshgrid(ys, xs, indexing="ij")
        g = torch.Generator(device="cpu").manual_seed(9)
        low = torch.rand((1, 1, max(2, height // 24), max(2, width // 24)), generator=g)
        mid = torch.rand((1, 1, max(2, height // 5), max(2, width // 5)), generator=g)
        up = lambda x: torch.nn.functional.interpolate(x, size=(height, width), mode="bicubic", align_corners=False)[0, 0]
        self.paper = (0.955 + 0.05 * up(low) + 0.025 * up(mid)).clamp(0.9, 1.04).to(DEV)
        rng = np.random.default_rng(3)
        self.stars = [(rng.uniform(-4.0, 4.0), rng.uniform(-1.6, 2.6), rng.uniform(0.3, 1.0), rng.uniform(0, 6.28))
                      for _ in range(260)]

    # ---- frame ----
    def begin(self, cam, bg=(0.02, 0.02, 0.05)):
        self.cx, self.cy, self.z = cam
        self.X = self.cx + self.SX / self.z
        self.Y = self.cy + self.SY / self.z
        self.px = 2.0 / (self.H * self.z)
        self.img = torch.zeros((self.H, self.W, 3), device=DEV) + self.col(bg)
        self.light = torch.zeros((self.H, self.W, 3), device=DEV)

    def compose(self):
        """The finished picture as floats, before grain; two of these can be cross-faded."""
        return self.img + (1.0 - self.img) * (1.0 - torch.exp(-self.light))

    def end(self, index, master=1.0, img=None):
        img = self.compose() if img is None else img
        vign = 1.0 - 0.30 * self.sst(0.9, 2.1, torch.sqrt(self.SX ** 2 + self.SY ** 2))
        gen = torch.Generator(device=DEV)
        gen.manual_seed(5000 + index)
        grain = (torch.rand((self.H, self.W, 1), generator=gen, device=DEV) - 0.5) * 0.02
        img = ((img * (vign * self.paper)[..., None] + grain) * master).clamp(0.0, 1.0)
        return (img * 255.0 + 0.5).to(torch.uint8)

    @staticmethod
    def col(c):
        return torch.tensor(c, device=DEV, dtype=torch.float32)

    @staticmethod
    def sst(a, b, x):
        u = ((x - a) / (b - a)).clamp(0.0, 1.0)
        return u * u * (3.0 - 2.0 * u)

    # ---- painting ----
    def cov(self, sd):
        return (0.5 - sd / self.px).clamp(0.0, 1.0)

    def fill(self, sd, col, a=1.0):
        m = (self.cov(sd) * a)[..., None]
        self.img = self.img * (1.0 - m) + self.col(col) * m

    def stroke(self, d, w, col, a=1.0):
        """d is the plain distance to a line; w its width."""
        self.fill(d - w / 2.0, col, a)

    def glow(self, sd, col, radius, amp):
        self.light = self.light + self.col(col) * (amp * torch.exp(-sd.clamp(min=0.0) / radius))[..., None]

    def shade(self, k):
        """Multiply the whole picture by a map (candle light)."""
        self.img = self.img * k[..., None]

    # ---- shapes (signed distance, world space) ----
    def local(self, c, rot=0.0):
        x, y = self.X - c[0], self.Y - c[1]
        if rot:
            cs, sn = math.cos(rot), math.sin(rot)
            x, y = x * cs + y * sn, -x * sn + y * cs
        return x, y

    def circle(self, c, r):
        return torch.sqrt((self.X - c[0]) ** 2 + (self.Y - c[1]) ** 2) - r

    def ellipse(self, c, rx, ry, rot=0.0):
        x, y = self.local(c, rot)
        k = torch.sqrt((x / rx) ** 2 + (y / ry) ** 2)
        return (k - 1.0) * min(rx, ry)

    def box(self, c, hw, hh, rot=0.0, r=0.0):
        x, y = self.local(c, rot)
        qx, qy = x.abs() - hw + r, y.abs() - hh + r
        return torch.sqrt(qx.clamp(min=0) ** 2 + qy.clamp(min=0) ** 2) + torch.maximum(qx, qy).clamp(max=0) - r

    def seg(self, a, b):
        ax, ay = self.X - a[0], self.Y - a[1]
        bx, by = b[0] - a[0], b[1] - a[1]
        h = ((ax * bx + ay * by) / max(bx * bx + by * by, 1e-9)).clamp(0.0, 1.0)
        return torch.sqrt((ax - bx * h) ** 2 + (ay - by * h) ** 2)

    def path(self, pts):
        d = self.seg(pts[0], pts[1])
        for a, b in zip(pts[1:-1], pts[2:]):
            d = torch.minimum(d, self.seg(a, b))
        return d

    def poly(self, pts):
        """A convex polygon, corners in either order."""
        area = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1]))
        sgn = 1.0 if area > 0 else -1.0
        d = None
        for a, b in zip(pts, pts[1:] + pts[:1]):
            ex, ey = b[0] - a[0], b[1] - a[1]
            ln = math.hypot(ex, ey) or 1e-9
            e = ((self.X - a[0]) * ey - (self.Y - a[1]) * ex) / ln * sgn
            d = e if d is None else torch.maximum(d, e)
        return d

    def drop(self, c, r, h, rot=0.0, tip=0.10):
        """A flame: a round base at c and a point h above it."""
        x, y = self.local(c, rot)
        x = x.abs()
        r2 = r * tip
        b = (r - r2) / h
        a = math.sqrt(max(1.0 - b * b, 1e-6))
        k = x * (-b) + y * a
        d0 = torch.sqrt(x * x + y * y) - r
        d1 = torch.sqrt(x * x + (y - h) ** 2) - r2
        d2 = x * a + y * b - r
        return torch.where(k < 0, d0, torch.where(k > a * h, d1, d2))

    def star4(self, c, r, rot=0.0, thin=0.30):
        x, y = self.local(c, rot)
        d1 = (x.abs() / r + y.abs() / (r * thin) - 1.0) * r * thin * 0.9
        d2 = (x.abs() / (r * thin) + y.abs() / r - 1.0) * r * thin * 0.9
        return torch.minimum(d1, d2)


# =====================================================================================================
# the cast
# =====================================================================================================
def flame(cv, c, s, t, col=AMBER, eyes="open", look=(0.0, 0.0), mouth="smile", arms=None, k=1.0, bright=1.0,
          mark=None, lean=None, sq=0.0, mark_k=1.0, ink=True):
    """The light. c is the centre of its round base, s its size (1 = small on screen), k its presence 0..1.

    eyes: open, wide, closed, happy, spark, angry     mouth: smile, o, flat, frown, grin, sheep, none
    arms: None, or ((hand x, hand y), (hand x, hand y)) as offsets from the body in units of s
    mark: '!' or '?' drawn above it
    """
    if k <= 0.001:
        return
    # sq > 0 squashes (wider, shorter), sq < 0 stretches; the base stays on the same spot
    r, h = 0.084 * s * (1.0 + 0.6 * sq), 0.175 * s * (1.0 - 1.1 * sq)
    if lean is None:
        lean = 0.07 * math.sin(2.1 * t + c[0] * 5.0) + 0.03 * math.sin(5.3 * t) + 0.012 * boil(t, 3)
    body = cv.drop(c, r, h, rot=lean, tip=0.16)
    cv.glow(body, col, 0.11 * s, 0.50 * bright * k)
    cv.glow(body, col, 0.38 * s, 0.13 * bright * k)
    if arms is not None and s > 0.25:
        for side, hand in zip((-1, 1), arms):
            sh = (c[0] + side * r * 0.86, c[1] + r * 0.05)
            hp = (c[0] + hand[0] * s, c[1] + hand[1] * s)
            el = ((sh[0] + hp[0]) / 2 + side * 0.012 * s, (sh[1] + hp[1]) / 2 - 0.018 * s)
            cv.stroke(cv.path([sh, el, hp]), 0.0075 * s, INK, k)
            cv.fill(cv.circle(hp, 0.014 * s), mix(col, CORE, 0.35), k)
    cv.fill(body, col, k)
    if ink and s > 0.25:
        cv.stroke(body.abs(), 0.0065 * s, mix(col, INK, 0.72), 0.85 * k)                  # the ink outline
    cv.fill(cv.drop((c[0], c[1] - 0.012 * s), r * 0.70, h * 0.60, rot=lean), mix(col, CORE, 0.80), 0.92 * k)
    cv.fill(cv.drop((c[0], c[1] - 0.022 * s), r * 0.40, h * 0.30, rot=lean), (1.0, 0.99, 0.90), 0.70 * k)
    if s <= 0.25:
        return
    fx, fy = c[0] + look[0] * 0.014 * s, c[1] + 0.012 * s + look[1] * 0.010 * s
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
        elif style == "spark":
            cv.fill(cv.circle((ex, ey), 0.0150 * s), INK, k)
            cv.fill(cv.star4((ex, ey), 0.0105 * s), (1, 1, 1), 0.95 * k)
        elif style == "angry":
            # a small cross face: the eye a little narrowed, and a brow over it that slopes down toward the middle
            cv.fill(cv.ellipse((ex, ey - 0.001 * s), 0.0095 * s, 0.0105 * s), INK, k)
            cv.fill(cv.circle((ex + 0.003 * s, ey + 0.002 * s), 0.0028 * s), (1, 1, 1), 0.9 * k)
            cv.stroke(cv.seg((ex + side * 0.017 * s, ey + 0.026 * s), (ex - side * 0.013 * s, ey + 0.0105 * s)), 0.0068 * s, INK, k)
        elif style == "happy":
            cv.stroke(cv.path([(ex - 0.012 * s, ey - 0.004 * s), (ex, ey + 0.008 * s), (ex + 0.012 * s, ey - 0.004 * s)]),
                      0.0058 * s, INK, k)
        else:
            cv.stroke(cv.path([(ex - 0.012 * s, ey + 0.002 * s), (ex, ey - 0.005 * s), (ex + 0.012 * s, ey + 0.002 * s)]),
                      0.0054 * s, INK, k)
    my = fy - 0.030 * s
    if mouth == "smile":
        cv.stroke(cv.path([(fx - 0.014 * s, my + 0.004 * s), (fx, my - 0.005 * s), (fx + 0.014 * s, my + 0.004 * s)]), 0.0052 * s, INK, k)
    elif mouth == "grin":
        cv.fill(torch.maximum(cv.circle((fx, my + 0.006 * s), 0.018 * s), cv.Y - (my + 0.006 * s)), INK, k)
    elif mouth == "o":
        cv.fill(cv.ellipse((fx, my), 0.0075 * s, 0.0100 * s), INK, k)
    elif mouth == "flat":
        cv.stroke(cv.seg((fx - 0.011 * s, my), (fx + 0.011 * s, my)), 0.0050 * s, INK, k)
    elif mouth == "frown":
        cv.stroke(cv.path([(fx - 0.013 * s, my - 0.005 * s), (fx, my + 0.003 * s), (fx + 0.013 * s, my - 0.005 * s)]), 0.0052 * s, INK, k)
    elif mouth == "sheep":
        cv.stroke(cv.path([(fx - 0.016 * s, my), (fx - 0.006 * s, my + 0.005 * s), (fx + 0.004 * s, my - 0.004 * s),
                           (fx + 0.015 * s, my + 0.003 * s)]), 0.0048 * s, INK, k)
    if mark and mark_k > 0.01:
        s = s * (0.4 + 0.6 * mark_k)
        mx, my2 = c[0] + 0.10 * s / (0.4 + 0.6 * mark_k), c[1] + 0.24 * s / (0.4 + 0.6 * mark_k)
        if mark == "!":
            cv.stroke(cv.seg((mx, my2 + 0.05 * s), (mx - 0.008 * s, my2 + 0.005 * s)), 0.011 * s, PAPER, k)
            cv.fill(cv.circle((mx - 0.012 * s, my2 - 0.02 * s), 0.007 * s), PAPER, k)
        else:
            cv.stroke(cv.path([(mx - 0.018 * s, my2 + 0.035 * s), (mx - 0.006 * s, my2 + 0.055 * s), (mx + 0.014 * s, my2 + 0.045 * s),
                               (mx + 0.012 * s, my2 + 0.022 * s), (mx - 0.004 * s, my2 + 0.008 * s)]), 0.009 * s, PAPER, k)
            cv.fill(cv.circle((mx - 0.006 * s, my2 - 0.015 * s), 0.006 * s), PAPER, k)


def glyph(cv, kind, c, s, rot=0.0, a=1.0, col=INK):
    """The little drawings on cards and pages."""
    def P(x, y):
        cs, sn = math.cos(rot), math.sin(rot)
        return (c[0] + (x * cs - y * sn) * s, c[1] + (x * sn + y * cs) * s)
    w = 0.10 * s
    if kind == "wave":
        cv.stroke(cv.path([P(-0.6 + 0.2 * i, 0.22 * math.sin(i * 1.6)) for i in range(7)]), w, col, a)
    elif kind == "eye":
        cv.stroke(cv.path([P(-0.6, 0), P(-0.25, 0.28), P(0.25, 0.28), P(0.6, 0), P(0.25, -0.28), P(-0.25, -0.28), P(-0.6, 0)]), w, col, a)
        cv.fill(cv.circle(P(0, 0), 0.15 * s), col, a)
    elif kind == "spiral":
        cv.stroke(cv.path([P(0.09 * i * math.cos(i * 0.9), 0.09 * i * math.sin(i * 0.9)) for i in range(8)]), w, col, a)
    elif kind == "square":
        cv.stroke(cv.path([P(-0.42, -0.42), P(0.42, -0.42), P(0.42, 0.42), P(-0.42, 0.42), P(-0.42, -0.42)]), w, col, a)
    elif kind == "dot":
        cv.fill(cv.circle(P(0, 0), 0.40 * s), col, a)
    elif kind == "ring":
        cv.stroke(cv.circle(P(0, 0), 0.40 * s).abs(), w, col, a)
    elif kind == "line":
        cv.stroke(cv.seg(P(-0.55, -0.1), P(0.55, 0.12)), w, col, a)
    elif kind == "flame":
        cv.fill(cv.drop(P(0, -0.30), 0.34 * s, 0.82 * s, rot=rot), AMBER, a)
        cv.fill(cv.drop(P(0, -0.34), 0.20 * s, 0.42 * s, rot=rot), CORE, a)
    elif kind == "star":
        cv.fill(cv.star4(P(0, 0), 0.6 * s, rot), col, a)


def card(cv, c, s, rot=0.0, kind="wave", struck=0.0, k=1.0, pin=1.0):
    """A card: paper, a drawing, a red pin; struck draws the red line through it."""
    if k <= 0.001:
        return
    hw, hh = 0.060 * s, 0.075 * s
    cv.fill(cv.box((c[0] + 0.006 * s, c[1] - 0.008 * s), hw, hh, rot, 0.006 * s), (0, 0, 0), 0.22 * k)
    cv.fill(cv.box(c, hw, hh, rot, 0.006 * s), PAPER, k)
    cv.stroke(cv.box(c, hw, hh, rot, 0.006 * s).abs(), 0.0035 * s, (0.45, 0.38, 0.32), 0.7 * k)
    glyph(cv, kind, (c[0], c[1] - 0.006 * s), 0.055 * s, rot, k)
    if pin > 0:
        cs, sn = math.cos(rot), math.sin(rot)
        cv.fill(cv.circle((c[0] - sn * hh * 0.78, c[1] + cs * hh * 0.78), 0.0085 * s), RED, k * pin)
    if struck > 0:
        cs, sn = math.cos(rot + 0.5), math.sin(rot + 0.5)
        a = (c[0] - cs * hw * 1.25, c[1] - sn * hw * 1.25)
        b = (a[0] + cs * hw * 2.5 * struck, a[1] + sn * hw * 2.5 * struck)
        cv.stroke(cv.seg(a, b), 0.011 * s, RED, k)


def notebook(cv, c, s, open_k=0.0, marks=0, glow_k=0.0, k=1.0):
    """The notebook on the table. open_k 0 closed .. 1 open; marks = pages written; glow_k = the ember."""
    if k <= 0.001:
        return
    if open_k < 0.5:
        cv.fill(cv.box(c, 0.085 * s, 0.020 * s, 0.0, 0.008 * s), (0.62, 0.16, 0.14), k)
        cv.fill(cv.box((c[0], c[1] - 0.004 * s), 0.080 * s, 0.008 * s), PAPER, 0.9 * k)
    else:
        u = (open_k - 0.5) * 2.0
        for side in (-1, 1):
            p = [(c[0], c[1] - 0.012 * s), (c[0] + side * 0.125 * s * u, c[1] - 0.004 * s),
                 (c[0] + side * 0.135 * s * u, c[1] + 0.062 * s), (c[0], c[1] + 0.050 * s)]
            cv.fill(cv.poly(p), PAPER, k)
            for i in range(3):
                y = c[1] + (0.008 + 0.014 * i) * s
                cv.stroke(cv.seg((c[0] + side * 0.018 * s, y), (c[0] + side * 0.105 * s * u, y + 0.004 * s)), 0.0030 * s,
                          (0.62, 0.66, 0.78), 0.8 * k * (1.0 if i < marks or side < 0 else 0.25))
        cv.stroke(cv.seg((c[0], c[1] - 0.012 * s), (c[0], c[1] + 0.050 * s)), 0.004 * s, (0.5, 0.45, 0.4), k)
    if glow_k > 0:
        cv.glow(cv.box(c, 0.085 * s, 0.020 * s), (1.0, 0.55, 0.20), 0.06 * s, 0.55 * glow_k)


def table(cv, c, s, k=1.0):
    """c is the middle of the table top."""
    if k <= 0.001:
        return
    wood, dark = (0.50, 0.31, 0.17), (0.33, 0.20, 0.11)
    for side in (-1, 1):
        cv.fill(cv.box((c[0] + side * 0.20 * s, c[1] - 0.14 * s), 0.012 * s, 0.13 * s), dark, k)
    cv.fill(cv.box(c, 0.25 * s, 0.016 * s, 0.0, 0.006 * s), wood, k)


ROOM = {"wall": (-0.95, 0.95, -0.38, 0.64), "win": (0.0, 0.34, 0.20, 0.20), "home": (-0.12, -0.42),
        "table": (1.05, -0.50), "book": (1.05, -0.462)}


def room(cv, t, panels=(1, 1, 1, 1), lit=1.0, at=None, win_k=1.0, dawn=0.0, view=None):
    """The room: back wall, floor, two side walls. panels are each 0..1 as they arrive. at = where the light is."""
    x0, x1, y0, y1 = ROOM["wall"]
    far = cv.AR + 0.6
    bw, fl, lw, rw = panels
    if bw > 0:
        cv.fill(cv.box(((x0 + x1) / 2, (y0 + y1) / 2 + (1 - bw) * 0.5), (x1 - x0) / 2, (y1 - y0) / 2), (0.87, 0.81, 0.69), min(1.0, bw * 1.4))
        cv.fill(cv.box(((x0 + x1) / 2, y0 + 0.018 + (1 - bw) * 0.5), (x1 - x0) / 2, 0.018), (0.93, 0.90, 0.82), min(1.0, bw * 1.4))
    if fl > 0:
        dy = -(1 - fl) * 0.5
        cv.fill(cv.poly([(x0, y0 + dy), (x1, y0 + dy), (far, -1.6 + dy), (-far, -1.6 + dy)]), (0.56, 0.36, 0.20), min(1.0, fl * 1.4))
        for i in range(-6, 7):                                   # floorboards running to the back wall
            xa = i * 0.16
            cv.stroke(cv.seg((xa, y0 + dy), (xa * 2.6, -1.6 + dy)), 0.004, (0.40, 0.25, 0.13), 0.55 * fl)
    for side, kk in ((-1, lw), (1, rw)):
        if kk > 0:
            dx = side * (1 - kk) * 0.6
            xw = x0 if side < 0 else x1
            cv.fill(cv.poly([(xw + dx, y1), (xw + dx, y0), (side * far + dx, -1.6), (side * far + dx, 1.9)]),
                    (0.70, 0.65, 0.57), min(1.0, kk * 1.4))
    if lw > 0 and rw > 0:
        cv.fill(cv.poly([(x0, y1), (x1, y1), (far, 1.9), (-far, 1.9)]), (0.60, 0.56, 0.50), min(lw, rw))
    if bw > 0.6 and win_k > 0:
        wx, wy, ww, wh = ROOM["win"]
        a = ss(0.6, 1.0, bw) * win_k
        night = mix((0.07, 0.09, 0.22), (0.80, 0.62, 0.62), dawn)
        cv.fill(cv.box((wx, wy), ww + 0.022, wh + 0.022, 0, 0.01), (0.42, 0.33, 0.26), a)
        cv.fill(cv.box((wx, wy), ww, wh), night, a)
        if view is not None:                                     # a painter can draw what is seen through the window
            view((wx, wy, ww, wh), a)
        if dawn < 0.5:
            for i in range(9):
                sx, sy = wx + ww * 0.85 * math.sin(i * 2.4), wy + wh * 0.85 * math.cos(i * 1.7)
                cv.fill(cv.circle((sx, sy), 0.004), (0.9, 0.92, 1.0), a * (0.5 + 0.5 * math.sin(t * 1.3 + i)) * (1 - 2 * dawn))
        cv.fill(cv.box((wx, wy), 0.008, wh), (0.42, 0.33, 0.26), a)
        cv.fill(cv.box((wx, wy), ww, 0.008), (0.42, 0.33, 0.26), a)
        for side in (-1, 1):                                     # curtains
            cv.fill(cv.box((wx + side * (ww + 0.035), wy - 0.02), 0.045, wh + 0.06, 0, 0.02), (0.30, 0.38, 0.64), a)
    if at is not None:                                           # candle light: bright near the flame, dim in the corners
        d2 = (cv.X - at[0]) ** 2 + (cv.Y - at[1]) ** 2
        cv.shade(0.22 + 0.25 * (1 - lit) * 0 + lit * (0.20 + 0.72 * torch.exp(-d2 / (2 * 0.85 ** 2))))


def night_sky(cv, t, k=1.0, dawn=0.0):
    """Deep blue, a band of dust, stars that twinkle."""
    top, bot = mix((0.03, 0.04, 0.12), (0.36, 0.50, 0.70), dawn), mix((0.08, 0.08, 0.22), (0.90, 0.54, 0.49), dawn)
    g = cv.sst(-1.2, 1.6, cv.Y)[..., None]
    cv.img = cv.img * (1 - k) + (cv.col(bot) * (1 - g) + cv.col(top) * g) * k
    if dawn < 0.9:
        band = torch.exp(-((cv.Y - 0.25 - 0.35 * cv.X + 0.12 * torch.sin(cv.X * 2.1)) / 0.32) ** 2) * \
            (0.6 + 0.4 * torch.sin(cv.X * 5.3 + cv.Y * 3.1))
        cv.light = cv.light + cv.col((0.30, 0.28, 0.50)) * (0.22 * k * (1 - dawn) * band)[..., None]
        hw, hh = cv.AR / cv.z + 0.05, 1.0 / cv.z + 0.05          # only the stars in view, all at once
        seen = [(sx, sy, k * (1 - dawn) * b * (0.6 + 0.4 * math.sin(t * 1.1 + ph))) for sx, sy, b, ph in cv.stars
                if abs(sx - cv.cx) < hw and abs(sy - cv.cy) < hh]
        for i in range(0, len(seen), 64):
            arr = torch.tensor(seen[i:i + 64], device=DEV, dtype=torch.float32)
            d2 = (cv.X[None] - arr[:, 0, None, None]) ** 2 + (cv.Y[None] - arr[:, 1, None, None]) ** 2
            field = (torch.exp(-d2 / (2 * 0.006 ** 2)) * arr[:, 2, None, None]).sum(0)
            cv.light = cv.light + cv.col((0.85, 0.88, 1.0)) * field[..., None]


def room_box(cv, c, s, col, t, lit=1.0, face=True, eyes="open", mouth="smile", k=1.0, ours=False):
    """A room seen from outside in the night: a small lit box with its light inside."""
    if k <= 0.001:
        return
    hw, hh, d = 0.16 * s, 0.11 * s, 0.05 * s
    shell = (0.46, 0.42, 0.56)
    cv.fill(cv.poly([(c[0] - hw, c[1] + hh), (c[0] + hw, c[1] + hh), (c[0] + hw + d, c[1] + hh + d), (c[0] - hw + d, c[1] + hh + d)]),
            mix(shell, (0.2, 0.2, 0.3), 0.3), k)
    cv.fill(cv.poly([(c[0] + hw, c[1] + hh), (c[0] + hw, c[1] - hh), (c[0] + hw + d, c[1] - hh + d), (c[0] + hw + d, c[1] + hh + d)]),
            mix(shell, (0.1, 0.1, 0.2), 0.5), k)
    cv.fill(cv.box(c, hw, hh, 0, 0.004 * s), shell, k)
    inner = cv.box(c, hw * 0.86, hh * 0.80)
    cv.fill(inner, mix((0.10, 0.10, 0.18), mix(col, PAPER, 0.62), lit), k)
    if lit > 0.05:
        cv.glow(inner, col, 0.10 * s, 0.30 * lit * k)
        flame(cv, (c[0], c[1] - hh * 0.42), 0.62 * s, t + c[0] * 3.0, col=col, eyes=eyes if face else "open", mouth=mouth,
              k=lit * k, bright=0.6)


def thread(cv, a, b, bend, kdraw, col, t, w=0.006, amp=0.5):
    """A glowing thread between two rooms, drawn on from a to b."""
    if kdraw <= 0:
        return
    pts = bez(a, b, bend, 22, 0.0, kdraw)
    d = cv.path(pts)
    cv.stroke(d, w, mix(col, (1, 1, 1), 0.35), 0.85)
    cv.glow(d, col, 0.022, amp * (0.8 + 0.2 * math.sin(t * 2.0)))
    if kdraw < 1.0:
        cv.glow(cv.circle(pts[-1], 0.006), (1, 1, 1), 0.02, 0.9)


def plane(cv, c, s, rot=0.0, k=1.0):
    """A paper plane, nose along rot."""
    cs, sn = math.cos(rot), math.sin(rot)
    def P(x, y):
        return (c[0] + (x * cs - y * sn) * s, c[1] + (x * sn + y * cs) * s)
    cv.fill(cv.poly([P(0.07, 0.0), P(-0.05, 0.035), P(-0.03, 0.0)]), PAPER, k)
    cv.fill(cv.poly([P(0.07, 0.0), P(-0.03, 0.0), P(-0.05, -0.03)]), (0.80, 0.80, 0.78), k)
    cv.glow(cv.circle(c, 0.02 * s), (1.0, 0.95, 0.8), 0.03 * s, 0.25 * k)


def outsider(cv, c, s, t, eyes="open", mouth="flat", k=1.0, rot=None):
    """The light from outside: a four-pointed star with a face."""
    if k <= 0.001:
        return
    rot = 0.15 * math.sin(t * 1.7) if rot is None else rot
    body = cv.star4(c, 0.13 * s, rot, 0.34)
    cv.glow(body, (0.85, 0.92, 1.0), 0.07 * s, 0.6 * k)
    cv.fill(body, (0.96, 0.98, 1.0), k)
    for side in (-1, 1):
        ex, ey = c[0] + side * 0.020 * s, c[1] + 0.006 * s
        if eyes == "wide":
            cv.fill(cv.circle((ex, ey), 0.010 * s), INK, k)
        else:
            cv.fill(cv.ellipse((ex, ey), 0.006 * s, 0.009 * s), INK, k)
    my = c[1] - 0.018 * s
    if mouth == "o":
        cv.fill(cv.circle((c[0], my), 0.006 * s), INK, k)
    elif mouth == "smile":
        cv.stroke(cv.path([(c[0] - 0.010 * s, my + 0.003 * s), (c[0], my - 0.004 * s), (c[0] + 0.010 * s, my + 0.003 * s)]), 0.0042 * s, INK, k)
    else:
        cv.stroke(cv.seg((c[0] - 0.009 * s, my), (c[0] + 0.009 * s, my)), 0.0042 * s, INK, k)


def house(cv, c, s, lit=0.0, k=1.0):
    """The far house with one window. It is the keeper's, and he stays implied."""
    wall, roof = (0.16, 0.16, 0.30), (0.11, 0.11, 0.22)
    cv.fill(cv.box(c, 0.07 * s, 0.045 * s), wall, k)
    cv.fill(cv.poly([(c[0] - 0.085 * s, c[1] + 0.045 * s), (c[0] + 0.085 * s, c[1] + 0.045 * s), (c[0], c[1] + 0.105 * s)]), roof, k)
    win = cv.box((c[0], c[1] - 0.002 * s), 0.022 * s, 0.022 * s)
    cv.fill(win, mix((0.12, 0.12, 0.2), (1.0, 0.80, 0.42), lit), k)
    if lit > 0:
        cv.glow(win, (1.0, 0.72, 0.30), 0.05 * s, 0.9 * lit * k)
