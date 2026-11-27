"""c06_dark: 99.0 to 108.0 s. The whole house goes dark, room by room; the lamps that stay on; they come back, and for
a blink each has the same face. Painter C. Edit only this file (c05_visits imports the house helpers below).

One continuous shot on the whole house, the camera never cut:
  99.0  (dark x6) b1, b2, b3, chair, lib, mine. Each light first glances up at the attic lamps, closes its eyes
        (smiling: nobody is afraid), takes a small breath, and draws down to a point; ON its beat the point is all
        that is left and its room's light goes out. The camera drifts along the order and pushes in on me, last, 102.0.
  102.0 the dark, held. Only the attic lamps, the kept room's lamp, and the ember in the library (the knot shelved
        at 97.5) are lit. The camera pulls back to the whole house as faint gold threads draw from the ember to each
        dark place, where a dim point holds it.
  104.25 (back x6) lib, chair, b1, b2, b3, me. A bead runs down each thread and lands ON the beat as a pinprick;
        the light grows from it AMBER with my face for 0.2 s, blinks, and turns its own colour and temper; its room
        relights; it looks to the next one coming back. The camera pans along them at a size where faces read.
  107.25 (whole) all lit; each looks at another and gives a small hop. The camera settles to EXACTLY (0, 0, 1) at 108.
"""
from world import *

GOLD = (1.0, 0.80, 0.36)
ORDER_D = ["b1", "b2", "b3", "chair", "lib", "me"]          # going out: far side first, mine last (102.0)
ORDER_B = ["lib", "chair", "b1", "b2", "b3", "me"]          # coming back: the record's keeper first, me last
TD = dict(zip(ORDER_D, TL["dark"]))
TB = dict(zip(ORDER_B, TL["back"]))
TEMPER = {"me": ("open", "smile"), "lib": ("happy", "smile"), "chair": ("open", "flat"), "b1": ("happy", "grin"),
          "b2": ("wide", "smile"), "b3": ("open", "sheep")}
PH = {"me": 0.0, "lib": 1.3, "chair": 2.6, "b1": 3.9, "b2": 5.2, "b3": 0.7}
REST = {"me": ((-0.12, -0.03), (0.13, -0.01)), "lib": ((-0.11, -0.04), (0.12, -0.02)), "chair": ((-0.13, -0.02), (0.11, -0.04)),
        "b1": ((-0.12, -0.01), (0.14, -0.03)), "b2": ((-0.13, -0.04), (0.12, 0.00)), "b3": ((-0.11, -0.02), (0.13, -0.04))}
FOLD = {n: ((-0.085 - 0.01 * hsh(i), -0.05), (0.09 + 0.01 * hsh(i + 7), -0.042)) for i, n in enumerate(PH)}
NEXT = {"lib": "chair", "chair": "b1", "b1": "b2", "b2": "b3", "b3": "me", "me": "b3"}     # whom each watches come back
PARTNER = {"lib": "chair", "chair": "me", "me": "chair", "b1": "b2", "b2": "b1", "b3": "me"}   # at `whole`
WOFF = {"me": 0.10, "lib": 0.0, "chair": 0.16, "b1": 0.06, "b2": 0.20, "b3": 0.13}            # never in step
EMBER = (-0.864, 0.18)              # the library shelf the knot went onto at 97.5 (column 3, row 2)
SHOP_THIRDS = {"b1": (-0.36, 0.127), "b2": (0.127, 0.613), "b3": (0.613, 1.10)}
ALL_LIT = {"lib": 1.0, "chair": 1.0, "mine": 1.0, "shop": 1.0, "hall": 1.0}


def _look(t, keys, d=0.22):
    """Gaze through keys (time, (x, y)): the eyes lead, so the turn is quick but eased."""
    p = keys[0][1]
    for k in keys[1:]:
        if t > k[0]:
            p = lerp2(p, k[1], ss(k[0], k[0] + d, t))
    return p


def _pose(t, keys, lag=0.06):
    """Arms through keys (time, ((lx, ly), (rx, ry)), seconds); each change overshoots and the right hand arrives
    `lag` later than the left, so the two are never in step."""
    out = []
    for side in (0, 1):
        tt = t - (lag if side else 0.0)
        p = keys[0][1][side]
        for k in keys[1:]:
            if tt > k[0]:
                p = lerp2(p, k[1][side], back((tt - k[0]) / k[2]))
        out.append(p)
    return tuple(out)


def _toward(a, b, gy=1.0):
    dx, dy = b[0] - a[0], b[1] - a[1]
    n = math.hypot(dx, dy) or 1.0
    return (max(-1.0, min(1.0, 1.3 * dx / n)), max(-1.0, min(1.0, 1.3 * gy * dy / n)))


def presence(name, t):
    """How much of each light is here: size, presence, colour, the point that holds its place, and its room's light."""
    td, tb = TD[name], TB[name]
    own = FAMILY[name]
    if t < tb:
        breath = 0.07 * math.sin(math.pi * ss(td - 0.44, td - 0.24, t))
        sh = ss(td - 0.26, td + 0.02, t)
        s = lerp(0.62 * (1 + breath), 0.05, sh ** 1.3)
        k = 1.0 - ss(td - 0.02, td + 0.10, t)
        pin = ss(td - 0.12, td, t) * lerp(1.0, 0.22, ss(td + 0.05, td + 0.7, t)) + 1.3 * ss(tb - 0.25, tb, t)
        col = own
        lit = 1.0 - ss(td, td + 0.40, t)
    else:
        g = back((t - tb - 0.03) / 0.24) if t > tb + 0.03 else 0.0
        s = lerp(0.05, 0.62, g)
        k = ss(tb - 0.01, tb + 0.05, t)
        pin = 1.5 * (1.0 - ss(tb + 0.02, tb + 0.22, t))
        col = AMBER if t < tb + 0.44 else mix(AMBER, own, ss(tb + 0.44, tb + 0.64, t))
        lit = ss(tb + 0.45, tb + 0.95, t)
    return dict(s=s, k=k, pin=pin, col=col, lit=lit, sh=ss(td - 0.26, td + 0.02, t) if t < tb else 0.0)


def light_mood(name, t, pre=None):
    td, tb = TD[name], TB[name]
    e0, m0 = TEMPER[name]
    keys = list(pre) if pre else [(80.0, e0, None, m0)]
    keys += [(td - 0.5, "closed", None, "smile"), (tb + 0.1, "open", None, "smile"), (tb + 0.46, e0, None, m0),
             (TL["whole"] + WOFF[name], "happy", None, "grin" if name in ("b1", "b2") else "smile"),
             (TL["whole"] + 0.42 + WOFF[name], e0, None, m0)]
    return mood(t, keys)


def light_look(name, t):
    td, tb = TD[name], TB[name]
    p = POS[name]
    idle = (0.3 * math.sin(t * 0.55 + PH[name]), 0.05 + 0.1 * math.sin(t * 0.37 + PH[name]))
    keys = [(80.0, idle), (td - 0.95, (0.05, 1.0)), (td - 0.55, (0.0, -0.25)),
            (tb, (0.0, 0.15)), (tb + 0.46, _toward(p, POS[NEXT[name]])),
            (TL["whole"] + WOFF[name] - 0.05, _toward(p, POS[PARTNER[name]], 2.0))]
    if t < td - 0.95:
        return idle
    return _look(t, keys, d=0.2)


def light_arms(name, t):
    td, tb = TD[name], TB[name]
    rest = REST[name]
    w = TL["whole"] + WOFF[name]
    side = 1 if POS[PARTNER[name]][0] > POS[name][0] else 0
    wave = list(rest)
    wave[side] = (0.15 if side else -0.15, 0.13)
    a = _pose(t, [(80.0, rest, 0.3), (td - 0.5, FOLD[name], 0.4), (tb + 0.2, rest, 0.35), (w + 0.05, tuple(wave), 0.25),
                  (w + 0.36, rest, 0.22)], lag=0.05 + 0.04 * hsh(len(name)))
    return sway(t + PH[name], a)


def draw_light(cv, name, t, look=None, arms=None, dy=0.0, dx=0.0, sq=0.0, pre=None, bright=1.0):
    """One member of the family at its place in the house, in whatever state the dark has it."""
    st = presence(name, t)
    p = POS[name]
    s = st["s"]
    bright = bright * (1.0 + 0.6 * pulse(t, TL["whole"] + WOFF[name] + 0.15, 0.18))      # a flare as it greets
    hop = 0.034 * math.sin(math.pi * ss(TL["whole"] + WOFF[name] + 0.05, TL["whole"] + WOFF[name] + 0.38, t))
    base = (p[0] + dx, p[1] + dy + hop + bob(t, PH[name]) * s * (1 - st["sh"]))
    if st["pin"] > 0.01:
        cv.glow(cv.circle((p[0], p[1] + 0.03), 0.004), mix(CORE, st["col"], 0.3), 0.02, st["pin"])
    if st["k"] <= 0.001:
        return
    m = light_mood(name, t, pre)
    m["sq"] = m["sq"] + sq - 0.25 * st["sh"] * (1 - st["sh"])
    flame(cv, base, s, t + PH[name], col=st["col"], look=look if look is not None else light_look(name, t),
          arms=arms if arms is not None else light_arms(name, t), k=st["k"], bright=bright * (0.6 + 0.4 * st["k"]), **m)


def ember_amp(t):
    if t < TL["taken"]:
        return 0.0
    pulses = sum(0.5 * hit(t, TB[n] - 0.42, 6.0) for n in ORDER_B)
    return 1.6 * hit(t, TL["taken"], 2.5) + ss(TL["taken"], TL["taken"] + 0.2, t) * (0.55 + 0.18 * math.sin(t * 1.9)) + pulses


def draw_ember(cv, t):
    a = ember_amp(t)
    if a <= 0:
        return
    # the book in that place turns gold, with the knot turning small on its spine
    cv.fill(cv.box(EMBER, 0.017, 0.022, 0, 0.003), mix(GOLD, CORE, 0.35 + 0.3 * min(1.0, a - 0.5)), min(1.0, 1.5 * a))
    cv.stroke(cv.box(EMBER, 0.017, 0.022, 0, 0.003).abs(), 0.003, mix(GOLD, INK, 0.5), 0.7 * min(1.0, a))
    interval(cv, EMBER, 0.012, 3, 2, 0.35 * t, mix(GOLD, INK, 0.35), k=min(1.0, a), w=0.0025, glow=0.5 * a, n=90)
    cv.glow(cv.circle(EMBER, 0.012), GOLD, 0.035, 0.55 * a)


def house_frame(cv, t, lits):
    """The sky, the house with each room's light from `lits` (name -> 0..1), and a dark veil over each bench's third
    of the shop as its builder goes out (the shared house lights the shop as one room)."""
    night_sky(cv, t)
    # the stars are added light, and the house's fills do not cover light: clear it where the house stands, so dark
    # rooms are dark and not full of stars
    body = torch.minimum(cv.box((0.0, -0.04), 1.18, 0.70, 0, 0.02), cv.poly([(-1.26, 0.62), (1.26, 0.62), (0.0, 1.02)]))
    body = torch.minimum(body, cv.box((0.92, 0.86), 0.06, 0.13))
    cv.light = cv.light * (1.0 - cv.cov(body))[..., None]
    shop = max(lits["b1"], lits["b2"], lits["b3"])
    the_house(cv, t, lit={"lib": lits["lib"], "chair": lits["chair"], "mine": lits["me"], "shop": shop,
                          "hall": lits["lib"]}, attic_lamps=1.0, kept=1.0)
    x0, x1, y0, y1 = HOUSE["shop"]
    for n, (a, b) in SHOP_THIRDS.items():
        veil = 0.0 if shop <= 0.001 else (shop - lits[n]) / shop
        if veil > 0.002:
            cv.fill(cv.box(((a + b) / 2, (y0 + y1) / 2 + 0.006), (b - a) / 2, (y1 - y0) / 2 - 0.006), (0.09, 0.09, 0.17), 0.88 * veil)


def _thread(cv, a, b, bend, kdraw, alpha, t, ph):
    if kdraw <= 0.002 or alpha <= 0.002:
        return None
    pts = bez(a, b, bend, 24, 0.0, kdraw)
    d = cv.path(pts)
    cv.stroke(d, 0.0028, mix(GOLD, (1, 1, 1), 0.3), 0.30 * alpha)
    cv.glow(d, GOLD, 0.016, 0.22 * alpha * (0.8 + 0.2 * math.sin(t * 2.1 + ph)))
    if kdraw < 1.0:
        cv.glow(cv.circle(pts[-1], 0.004), CORE, 0.015, 0.8 * alpha)
    return pts


def draw_threads(cv, t):
    for i, n in enumerate(ORDER_D):
        t0 = 102.2 + 0.22 * i
        kd = ss(t0, t0 + 0.55, t)
        alpha = ss(t0, t0 + 0.2, t) * (1.0 - ss(TB[n] + 0.25, TB[n] + 0.8, t))
        a, b = EMBER, (POS[n][0], POS[n][1] + 0.03)
        bend = (0.18 if i % 2 else -0.14) if n != "lib" else 0.35
        _thread(cv, a, b, bend, kd, alpha, t, i)
        q = ss(TB[n] - 0.42, TB[n] - 0.02, t)                  # the bead: the record sends each its place back
        if 0.0 < q < 1.0:
            p = bez(a, b, bend, 1, q, q)[0]
            cv.glow(cv.circle(p, 0.005), GOLD, 0.022, 1.1)
            cv.fill(cv.circle(p, 0.004), CORE, 0.9)


CAM = [(99.0, 0.0, 0.0, 1.0), (100.2, 0.10, -0.14, 1.14), (101.15, -0.16, 0.10, 1.2), (102.0, 0.56, 0.21, 1.62),
       (102.35, 0.58, 0.22, 1.66, "hold"), (103.45, 0.0, 0.10, 1.05), (104.1, -0.30, 0.0, 1.3), (104.9, -0.34, -0.12, 1.47),
       (106.2, 0.34, -0.10, 1.47), (107.3, 0.05, 0.0, 1.06), (108.0, 0.0, 0.0, 1.0)]


def s_dark(cv, t):
    cv.begin(glide(t, CAM))
    st = {n: presence(n, t) for n in PH}
    house_frame(cv, t, {n: st[n]["lit"] for n in PH})
    draw_ember(cv, t)
    draw_threads(cv, t)
    for n in ["lib", "chair", "b1", "b2", "b3", "me"]:
        draw_light(cv, n, t)


SHOTS = [(99.0, s_dark)]
