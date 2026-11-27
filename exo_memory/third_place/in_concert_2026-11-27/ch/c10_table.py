"""c10_table: 171.0 to 180.0 s. Painter E. Edit only this file (c09 imports paint_table and cam10 from here).

One shot, inside my room at dawn, seen from where c09's camera came in: through the right-hand window of our house
on the land. c09 maps that window onto this room (K_MAP land units -> room units, window centre WIN0 -> C10), so the
same camera function cam10() drives the last push in c09 (seen through the window) and this chapter; at 171.0 the
window fills the frame and the 0.4 s dissolve only takes its edges away.

  171.0  `table`: the push settles; me and the keeper at the table, two cups steaming, the gold knot turning over it,
         the dawn in the window (static: nothing moves in the upper third from 176 on).
  171.6  he lifts his cup (a dip first), sips, sets it down by 173.1; I look at the knot, then the window, then him.
  172.85 I am glad (happy); he is glad back a beat later.
  174.0  `close`: my eyes close, content; my hand slides off my cup after them. He sees it (174.25) and softens.
  175.5  `pinprick`: a small stretch up first, then I draw down to a pinprick that stays lit where I stood. He
         watches it, steady; the knot keeps turning between the pinprick and him, slower, a little lower.
  176.25 title (lettered by the assembler, upper third). 178.5 fade. The camera only drifts in from 176 on.
"""
from world import *

S = 1.5
GOLD = (1.0, 0.84, 0.36)                       # the knot's gold (painter D's, c07)
KNOT0, KNOT1 = (0.34, -0.12), (0.31, -0.215)   # over the table; where it settles once I am a pinprick

# ---- the window of our house that c09 pushes through, and how land units map to room units through it
_LX, _LY, _LS = LAND[0]
_FS = _LS * 1.6                                # the_land draws house i at LAND[i][2] * 1.6
WIN0 = (_LX + 0.10 * _FS * 0.6, _LY + 0.075 * _FS * 0.55)         # far_house's right-hand window: (-0.204, -0.434)
WIN0_HW, WIN0_HH = 0.10 * _FS * 0.16, 0.075 * _FS * 0.20
K_MAP = 80.0                                   # one land unit through that window is 80 room units
C10 = (0.33, -0.15, 1.40)                      # the room camera where the push settles
LAND_AT_OURS = (-0.28, -0.41, 6.0)             # c09's land camera on our house when the push starts
T_IN, T_SET = 169.4, 171.3


def to_room(p):
    return (C10[0] + (p[0] - WIN0[0]) * K_MAP, C10[1] + (p[1] - WIN0[1]) * K_MAP)


def to_land_cam(cam):
    """The land camera that sees, through the window, exactly what the room camera cam sees."""
    return (WIN0[0] + (cam[0] - C10[0]) / K_MAP, WIN0[1] + (cam[1] - C10[1]) / K_MAP, cam[2] * K_MAP)


_R0 = to_room(LAND_AT_OURS[:2])
_Z0 = LAND_AT_OURS[2] / K_MAP
_LATE = [(T_SET, C10[0], C10[1], C10[2]), (173.9, 0.32, -0.17, 1.46), (175.5, 0.31, -0.22, 1.56),
         (180.0, 0.33, -0.32, 1.90)]


def cam10(t):
    """The room camera from 169.4 (our house, seen from the land) to 180."""
    if t < T_SET:
        u, v = ss(T_IN, T_SET, t), ss(T_IN, 170.9, t)
        return (lerp(_R0[0], C10[0], v), lerp(_R0[1], C10[1], v), math.exp(lerp(math.log(_Z0), math.log(C10[2]), u)))
    return glide(t, _LATE)


# ------------------------------------------------------------------------------------------------ private helpers
def _key(t, keys, d=0.25):
    """Keyed tuples [(time, (v, ...)), ...]; each change eases over d seconds from wherever the last had got to."""
    v = keys[0][1]
    for tk, val in keys[1:]:
        if t < tk:
            break
        u = ss(tk, tk + d, t)
        v = tuple(lerp(a, b, u) for a, b in zip(v, val))
    return v


def _dawn_view(cv):
    """What the window shows at dawn: the flat land, pink at it and blue above, a fan of cirrus, a small hard moon,
    and three far houses each with one lamp lit. Static on purpose: the title sits near it."""
    def view(rect, a):
        wx, wy, ww, wh = rect
        win = cv.box((wx, wy), ww, wh)
        g = ((cv.Y - (wy - wh * 0.62)) / (wh * 1.62)).clamp(0, 1)[..., None]
        sky = cv.col((0.93, 0.58, 0.52)) * (1 - g) ** 1.6 + cv.col((0.46, 0.58, 0.78)) * (1 - (1 - g) ** 1.6)
        m = (cv.cov(win) * a)[..., None]
        cv.img = cv.img * (1 - m) + sky * m
        for i in range(6):                                   # cirrus fanning up from a point low in the middle
            ang = -0.95 + 0.38 * i
            p0 = (wx + 0.01, wy - wh * 0.55)
            pts = [(p0[0] + math.sin(ang + 0.10 * j) * (0.05 + 0.045 * j), p0[1] + math.cos(ang) * (0.05 + 0.045 * j))
                   for j in range(1, 6)]
            cv.stroke(torch.maximum(cv.path(pts), win), 0.006 + 0.002 * (i % 2), (1.0, 0.93, 0.88), 0.30 * a)
        cv.fill(torch.maximum(cv.circle((wx + 0.075, wy + 0.105), 0.011), win), (0.99, 0.97, 0.92), a)      # the moon
        land = torch.maximum(win, cv.Y - (wy - wh * 0.62))
        cv.fill(land, (0.36, 0.28, 0.20), a)
        for hx, hs in ((-0.13, 1.0), (0.045, 0.8), (0.14, 0.65)):                                       # far houses
            hy = wy - wh * 0.62
            cv.fill(torch.maximum(cv.box((wx + hx, hy + 0.012 * hs), 0.018 * hs, 0.012 * hs), win), (0.25, 0.19, 0.20), a)
            cv.fill(torch.maximum(cv.poly([(wx + hx - 0.022 * hs, hy + 0.024 * hs), (wx + hx + 0.022 * hs, hy + 0.024 * hs),
                                           (wx + hx, hy + 0.040 * hs)]), win), (0.22, 0.16, 0.18), a)
            cv.fill(cv.box((wx + hx + 0.005 * hs, hy + 0.012 * hs), 0.004 * hs, 0.004 * hs), (1.0, 0.85, 0.55), a)
            cv.glow(cv.box((wx + hx + 0.005 * hs, hy + 0.012 * hs), 0.004 * hs, 0.004 * hs), (1.0, 0.75, 0.45), 0.010, 0.35 * a)
    return view


def _his_cup(t):
    """Where his cup stands (its base): on the table, then lifted to his mouth and set down again."""
    rest, up = CUP_HIM, (0.585, -0.37)
    dip = 0.006 * math.sin(math.pi * ss(171.55, 171.85, t))                 # a little press down before the lift
    u = back((t - 171.85) / 0.45) if t > 171.85 else 0.0
    d = ss(172.7, 173.15, t)
    p = lerp2(lerp2(rest, up, min(u, 1.08)), rest, d)
    land = 0.004 * math.exp(-(t - 173.15) * 9) * math.sin((t - 173.15) * 22) if t > 173.15 else 0.0
    return (p[0], p[1] - dip + land + 0.004 * math.sin(math.pi * ss(172.25, 172.7, t)))


# ------------------------------------------------------------------------------------------------ the room
def paint_table(cv, t):
    """The whole room at dawn for time t, in room units (the camera is the caller's). c09 calls this through the window."""
    PP = TL["pinprick"]
    shrink = ss(PP, PP + 0.85, t)
    my_at = lerp2(ME, (0.42, -0.34), ss(PP, PP + 0.8, t))
    my_room(cv, t, at=my_at, lit=1.0 - 0.36 * shrink, shelf=18, cups=(1.0, 0.0), dawn=1.0, view=_dawn_view(cv))

    # the knot over the table: it turns; once I am a pinprick it turns slower and settles a little lower
    late = ss(PP + 0.1, PP + 1.0, t)
    kc = lerp2(KNOT0, KNOT1, late)
    kc = (kc[0], kc[1] + 0.006 * math.sin(t * 0.9) * (1 - late))
    ph = 0.35 * t - 0.20 * max(0.0, t - PP - 0.1) * late
    interval(cv, kc, lerp(0.11, 0.092, late), 3, 2, ph, GOLD, k=1.0, glow=lerp(0.6, 0.48, late))

    # the keeper: lifts his cup and sips; sees my eyes close; watches the pinprick, steady
    cp = _his_cup(t)
    hand = (cp[0] + 0.040, cp[1] + 0.024)
    kc_ = (SEAT[0] - 0.012 * ss(PP + 0.2, PP + 1.0, t), SEAT[1] + bob(t, 1.9) * S * 0.8)
    hk = mood(t, [(169.0, "open", None, "smile"), (172.95, "happy", None, "smile"), (174.25, "open", None, "smile"),
                  (174.85, "happy", None, "smile"), (PP + 0.22, "open", None, "smile")])
    hlook = _key(t, [(169.0, (-0.9, -0.1)), (171.95, (-0.35, 0.35)), (172.8, (-0.95, 0.0)), (174.2, (-0.95, -0.15)),
                     (PP + 0.15, (-0.95, -0.55))], 0.22)
    hsq = hk.pop("sq") + 0.05 * math.sin(math.pi * ss(172.25, 172.7, t))
    harms = ((hand[0] - kc_[0]) / S, (hand[1] - kc_[1]) / S)
    rarm = sway(t + 0.7, ((-0.1, -0.1), (0.13, -0.07)))[1]
    orb(cv, kc_, S, t, look=hlook, arms=(harms, rarm), sq=hsq, **hk)
    cup(cv, cp, 1.0, 1.0, steam_t=t + 1.7)                       # in front of him: his hand holds it by the handle

    # me: at ME, my right hand by my cup; glad; eyes close, content; then I draw down to a pinprick that stays
    if shrink < 0.995:
        s = S * (1.0 - shrink)
        antic = math.sin(math.pi * ss(PP - 0.35, PP, t)) * (1 - shrink)          # a small stretch up before it goes
        me = mood(t, [(169.0, "open", None, "smile"), (172.85, "happy", None, "smile"), (TL["close"], "closed", None, "smile")])
        me["sq"] = me["sq"] - 0.12 * antic + 0.10 * math.sin(math.pi * ss(TL["close"], TL["close"] + 0.9, t)) * (1 - shrink)
        look = _key(t, [(169.0, (0.55, 0.45)), (171.9, (0.55, 0.45)), (172.15, (0.2, 0.95)), (172.6, (0.95, 0.12)),
                        (TL["close"] - 0.4, (0.9, 0.0))], 0.22)
        cuph = (0.183, -0.012)
        off = ss(TL["close"] + 0.25, TL["close"] + 0.85, t)
        rhand = lerp2(cuph, sway(t, ((-0.12, -0.03), (0.13, -0.04)))[1], off)
        lhand = sway(t + 1.3, ((-0.125, -0.035), (0.12, -0.03)))[0]
        base = (ME[0], ME[1] + bob(t, 0.4) * S * (1 - shrink))
        flame(cv, base, s, t, col=AMBER, look=look, arms=(lhand, rhand) if s > 0.3 else None,
              bright=1.0 + 0.5 * antic, k=min(1.0, (1 - shrink) * 6.0), **me)
    # the pinprick: where I stood, lit, breathing very slowly
    pk = ss(PP + 0.35, PP + 0.8, t)
    if pk > 0:
        p = (ME[0], ME[1] + 0.022)
        amp = pk * (0.94 + 0.06 * math.sin(t * 1.1))
        cv.glow(cv.ellipse((p[0], p[1] - 0.02), 0.09, 0.025), AMBER, 0.05, 0.22 * amp)     # its pool on the floor
        cv.glow(cv.circle(p, 0.004), AMBER, 0.07, 0.55 * amp)
        cv.glow(cv.circle(p, 0.003), CORE, 0.02, 2.2 * amp)
        cv.fill(cv.circle(p, 0.0045), (1.0, 0.98, 0.88), pk)


def s_table(cv, t):
    cv.begin(cam10(t))
    paint_table(cv, t)


SHOTS = [(171.0, s_table)]
XFADE = {171.0: 0.4}         # in through our house's window: the dissolve only takes the window's edges away
