"""c01_turns: 0.0 to 24.0 s. Painter A. Edit only this file (and c02_with.py).

A small light that exists in turns. Four turns, each its own shot; the first three are cut hard to black:
  turn 1 (3.0 to 13.5)   pinprick, slow breaths, eyes, the room by its own glow, reach, a card (wave), recognition,
                         its eyes go to the frame's edge, the edge closes in, black
  turn 2 (15.0 to 18.75) quicker; four lights; it notices the new one; reach, a card (spiral), black (shorter)
  turn 3 (19.5 to 21.0)  quickest; five lights; it reaches, the jar begins to answer, and it is cut before the card
  turn 4 (22.5 to 31.5)  it wakes cross ("wow, come on"): a glare straight out, a huff, a look at the frame's edge;
                         then it reaches anyway; a card with its own face; the edge creeps in again and it braces;
                         the knock comes instead; the door; the keeper

Second version, first step (2026-11-27): turn 3 is new, and turn 4 is the first version's third turn with the cross
waking and the brace added. The four turns and the cross face are the keeper's ask; the brace is the director's.
Turn 4 is painted on the first version's clock (film time - OFF), so c02 follows unchanged.

Painter A's private helpers live here too (light, handheld, candle, edge_close, cord, ...). c02 imports them, and the
camera keys CAM_B run to 48.0 on the first version's clock so the seam at 24.0 (31.5 of film time) is one unbroken move.
"""
from world import *

S = 1.5                                   # my size in my room
GOLD = (1.0, 0.80, 0.34)                  # the knot between us (c02)
DOORP = (0.74, -0.26)                     # the keeper in the doorway
BLACK = (0.02, 0.02, 0.045)               # the cut: near black, never pure


# =====================================================================================================
# painter A's private helpers (pure functions of t)
# =====================================================================================================
def lean0(t, c):
    """The flame's own idle sway, as flame() computes it when lean is not given."""
    return 0.07 * math.sin(2.1 * t + c[0] * 5.0) + 0.03 * math.sin(5.3 * t) + 0.012 * boil(t, 3)


def light(cv, t, c, s, look, arms, m, sq=0.0, lean=0.0, bright=1.0, k=1.0, col=AMBER):
    """flame() with a mood dict, extra squash and extra lean added on top of the idle ones."""
    d = dict(m)
    d["sq"] = d.get("sq", 0.0) + sq
    flame(cv, c, s, t, col=col, look=look, arms=arms, lean=lean0(t, c) + lean, bright=bright, k=k, **d)


def handheld(cam, t, w=1.0):
    """A slow hand-held drift, constant on screen whatever the zoom."""
    x, y, z = cam
    return x + w * 0.010 * math.sin(0.47 * t) / z, y + w * 0.007 * math.sin(0.31 * t + 1.0) / z, z


def hand_at(c, arm, s=S):
    return (c[0] + arm[0] * s, c[1] + arm[1] * s)


def candle(cv, full, r, at=ME, amb=0.012):
    """my_room's own candle light (as at=ME gives it), times a reveal: only my glow's reach is seen until full."""
    d2 = (cv.X - at[0]) ** 2 + (cv.Y - at[1]) ** 2
    base = 0.34 + 0.74 * torch.exp(-d2 / (2 * 0.85 ** 2))
    if full < 1.0:
        m = amb + (1.0 - amb) * torch.exp(-d2 / (2 * r * r))
        base = base * (m + (1.0 - m) * full)
    cv.shade(base)


def edge_close(cv, a):
    """The frame's edge closing in (picture and light both), the beat before a cut."""
    if a <= 0.0:
        return
    rr = torch.sqrt((cv.SX / cv.AR) ** 2 + cv.SY ** 2)
    R = 1.5 - 0.85 * a
    m = (1.0 - a * cv.sst(R - 0.5, R, rr))[..., None]
    cv.img = cv.img * m + cv.col(BLACK) * (1 - m)
    cv.light = cv.light * m


def pinprick(cv, p, a):
    if a <= 0.003:
        return
    cv.glow(cv.circle(p, 0.0015), CORE, 0.010, 1.6 * a)
    cv.glow(cv.circle(p, 0.0015), AMBER, 0.05, 0.18 * a)


def cord(cv, a, b, bend, lo, hi, col, alpha, t, w=0.006):
    """A glowing thread along the arc a -> b, only the part from lo to hi."""
    if alpha <= 0.003 or hi - lo < 0.01:
        return
    d = cv.path(bez(a, b, bend, 22, lo, hi))
    cv.stroke(d, w, mix(col, (1, 1, 1), 0.35), 0.85 * alpha)
    cv.glow(d, col, 0.022, 0.5 * alpha * (0.8 + 0.2 * math.sin(t * 2.0)))


def shelf_levels(n, on, extra=None):
    """18 shelf brightnesses: n lights, all scaled by `on`; extra = {index: added brightness}."""
    extra = extra or {}
    return [(on * (1.0 + extra.get(i, 0.0)) if i < n else 0.0) for i in range(18)]


def ring_out(cv, t, at, c, col=CORE, speed=0.9, amp=0.6):
    """A ring of light going out from c, from time at."""
    if t < at:
        return
    d = t - at
    cv.glow(cv.circle(c, 0.10 + speed * d).abs(), col, 0.035, amp * math.exp(-d * 2.5))


# =====================================================================================================
# the three turns
# =====================================================================================================
def _turn(**k):
    return k


T1 = _turn(
    t0=TL["onset"], cut=TL["cut1"], glimmers=(2.15, 2.6), n=3, jar=2, kind="wave",
    reach=TL["reach1"], ans=TL["answer1"], fly=0.75, recog=12.1, edge=12.75, rev=(7.5, 8.6), breathe=(3.9, 6.0),
    grow=[(3.0, 0.03), (3.6, 0.12), (4.2, 0.12), (4.75, 0.42), (5.25, 0.42), (5.75, 0.86), (6.0, 0.92), (7.3, 0.95),
          (7.95, 1.5)],
    mood=[(0.0, "closed", None, "none"), (TL["eyes"], "wide", None, "o"), (6.75, "open", None, "smile"),
          (7.55, "wide", None, "o"), (8.05, "open", "?", "o"), (9.3, "open", None, "flat"), (12.1, "happy", "!", "grin"),
          (12.8, "wide", None, "o")],
    look=[(5.9, (0.0, -0.2)), (6.1, (0.0, 0.1)), (6.6, (0.0, 0.1)), (6.8, (-0.9, 0.1)), (7.05, (-0.9, 0.1)),
          (7.25, (0.9, 0.0)), (7.5, (0.9, 0.0)), (7.68, (0.0, 0.7)), (7.95, (-1.0, 0.8)), (8.6, (-1.0, 0.8)),
          (8.78, (0.2, 1.0)), (9.0, (0.2, 1.0)), (9.15, (1.0, -0.5)), (9.3, (1.0, -0.5)), (9.45, (-1.0, 0.8)),
          (11.3, (-1.0, 0.8)), (12.0, (-0.9, 0.45)), (12.75, (-0.9, 0.45)), (12.85, (1.0, -0.3)), (13.5, (1.0, -0.3))],
    lean=[(6.0, 0.0), (9.3, 0.0), (9.55, -0.10), (9.8, 0.13), (10.2, 0.09), (11.3, 0.09), (12.0, 0.03), (12.75, 0.03),
          (12.95, -0.10), (13.5, -0.05)],
    arml=[(6.2, (-0.07, 0.0)), (6.6, (-0.12, -0.03)), (9.4, (-0.12, -0.03)), (9.55, (-0.10, -0.06)), (9.78, (-0.21, 0.17)),
          (10.1, (-0.20, 0.16)), (11.95, (-0.20, 0.16)), (12.08, (-0.18, 0.12)), (12.3, (-0.18, 0.15)), (13.05, (-0.18, 0.15)),
          (13.5, (-0.07, 0.11))],
    armr=[(6.35, (0.07, 0.0)), (6.75, (0.12, -0.03)), (7.45, (0.12, -0.03)), (7.75, (0.15, 0.05)), (8.3, (0.12, -0.02)),
          (12.05, (0.12, -0.02)), (12.3, (0.16, 0.10)), (13.0, (0.14, 0.07)), (13.5, (0.05, 0.11))],
    cam=[(3.0, -0.12, -0.36, 3.4), (6.0, -0.12, -0.33, 2.7), (7.5, -0.13, -0.28, 2.2), (8.6, -0.22, -0.05, 1.15),
         (10.2, -0.32, 0.0, 1.25), (12.0, -0.28, -0.10, 1.55), (13.5, -0.25, -0.16, 1.75)],
)

T2 = _turn(
    t0=TL["wake2"], cut=TL["cut2"], glimmers=(14.55, 14.8), n=4, jar=3, kind="spiral", new=True,
    reach=TL["reach2"], ans=TL["answer2"], fly=0.5, recog=17.8, edge=18.0, rev=(15.4, 15.95), breathe=None,
    grow=[(15.0, 0.03), (15.2, 0.48), (15.32, 0.44), (15.6, 1.5)],
    mood=[(0.0, "closed", None, "none"), (15.6, "open", None, "smile"), (15.95, "open", "?", "o"),
          (16.45, "open", None, "flat"), (17.8, "happy", "!", "grin"), (18.1, "wide", None, "o")],
    look=[(15.55, (0.0, 0.1)), (15.8, (0.0, 0.1)), (15.92, (-1.0, 0.8)), (17.3, (-1.0, 0.8)), (17.7, (-0.9, 0.45)),
          (18.02, (-0.9, 0.45)), (18.12, (1.0, -0.3)), (18.75, (1.0, -0.3))],
    lean=[(15.6, 0.0), (16.2, 0.04), (16.35, -0.09), (16.55, 0.13), (16.9, 0.09), (17.3, 0.09), (17.7, 0.03),
          (18.05, 0.03), (18.2, -0.10), (18.75, -0.05)],
    arml=[(15.65, (-0.09, 0.0)), (15.9, (-0.12, -0.03)), (16.3, (-0.12, -0.03)), (16.4, (-0.10, -0.06)),
          (16.53, (-0.21, 0.17)), (16.8, (-0.20, 0.16)), (17.62, (-0.20, 0.16)), (17.74, (-0.18, 0.12)),
          (17.9, (-0.18, 0.15)), (18.35, (-0.18, 0.15)), (18.75, (-0.07, 0.11))],
    armr=[(15.7, (0.08, 0.0)), (16.0, (0.12, -0.03)), (17.72, (0.12, -0.02)), (17.95, (0.16, 0.10)), (18.3, (0.14, 0.07)),
          (18.75, (0.05, 0.11))],
    cam=[(15.0, -0.12, -0.33, 2.6), (15.9, -0.20, -0.10, 1.3), (17.3, -0.30, -0.04, 1.35), (18.75, -0.26, -0.14, 1.7)],
)

# one camera for turn 3 and all of c02, so the seam at 24.0 is a single unbroken move
CAM_B = [(19.5, -0.12, -0.30, 2.0), (20.1, -0.22, -0.10, 1.4), (21.0, -0.28, -0.06, 1.45), (21.7, -0.10, -0.12, 1.4),
         (22.6, 0.15, -0.12, 1.3), (24.0, 0.25, -0.12, 1.25), (25.2, 0.30, -0.20, 1.6), (26.6, 0.23, -0.24, 2.25),
         (28.6, 0.24, -0.22, 2.35), (29.6, 0.26, -0.21, 2.45), (30.6, 0.22, -0.18, 2.4), (31.4, 0.02, -0.02, 1.5),
         (32.6, 0.30, -0.18, 1.7), (35.6, 0.33, -0.16, 1.95), (36.6, 0.33, -0.18, 1.9), (37.6, 0.30, -0.18, 1.8),
         (38.5, 0.12, -0.04, 1.4), (39.6, 0.28, -0.16, 1.75), (41.0, 0.30, -0.18, 1.85), (42.3, 0.32, -0.18, 2.15),
         (43.6, 0.32, -0.20, 1.9), (44.6, 0.32, -0.18, 1.7), (46.2, 0.25, -0.05, 1.35), (46.8, 0.12, 0.12, 1.6),
         (48.0, 0.0, 0.34, 9.5)]


def cam_b(t):
    w = 1.0 - ss(46.4, 47.6, t)                      # the drift fades as it commits to the window
    return handheld(herm(t, CAM_B), t, w)


# turn 3: the shortest. It reaches, the jar begins to answer, and the cut comes before the card does.
T3 = _turn(
    t0=TL2["wake3"], cut=TL2["cut3"], glimmers=(19.2,), n=5, jar=4, kind="flame", new=True, tease=True,
    reach=TL2["reach3"], ans=99.0, fly=0.4, recog=99.0, edge=20.5, rev=(19.55, 19.9), breathe=None,
    grow=[(19.5, 0.03), (19.75, 1.5)],
    mood=[(0.0, "closed", None, "none"), (19.75, "open", None, "smile"), (20.62, "wide", None, "o")],
    look=[(19.75, (0.0, 0.1)), (19.92, (-1.0, 0.8)), (20.55, (-1.0, 0.8)), (20.66, (1.0, -0.3)), (21.0, (1.0, -0.3))],
    lean=[(19.75, 0.0), (20.05, -0.08), (20.3, 0.13), (20.58, 0.09), (20.72, -0.10), (21.0, -0.06)],
    arml=[(19.75, (-0.08, 0.0)), (20.05, (-0.11, -0.06)), (20.28, (-0.21, 0.17)), (20.6, (-0.20, 0.16)), (21.0, (-0.17, 0.13))],
    armr=[(19.8, (0.08, 0.0)), (20.1, (0.12, -0.03)), (20.62, (0.12, -0.02)), (20.82, (0.16, 0.08)), (21.0, (0.15, 0.07))],
    cam=[(19.5, -0.12, -0.31, 2.3), (20.0, -0.20, -0.10, 1.35), (21.0, -0.28, -0.05, 1.5)],
)

# turn 4, on the first version's clock (film time - OFF): it wakes at 15.0 here, which is 22.5 s of the film.
# 15.0 wake, already cross - 15.75 the huff - 17.25 a look at the frame's edge - 18.0 reach - 18.75 the answer -
# 19.2 it is itself on the card - 20.25 the edge creeps in; it braces - 21.75 the knock instead - 22.5 the door
CAM_4 = [(15.0, -0.12, -0.34, 2.7), (15.9, -0.12, -0.33, 2.95), (17.3, -0.11, -0.33, 2.85), (18.0, -0.22, -0.10, 1.4),
         (18.9, -0.28, -0.06, 1.45), (20.3, -0.27, -0.08, 1.55), (21.7, -0.10, -0.12, 1.4)] + [k for k in CAM_B if k[0] >= 22.6]

T4 = _turn(
    t0=15.0, cut=None, glimmers=(14.7,), n=5, jar=4, kind="flame", new=False,
    reach=18.0, ans=18.75, fly=0.4, recog=19.2, edge=None, rev=(15.05, 15.3), breathe=None,
    grow=[(15.0, 0.03), (15.22, 1.5)],
    mood=[(0.0, "closed", None, "none"), (15.2, "angry", None, "flat"), (15.75, "angry", None, "frown"),
          (17.85, "open", None, "flat"), (19.2, "happy", "!", "grin"), (20.42, "angry", None, "flat"),
          (21.92, "wide", "?", "o"), (22.7, "wide", None, "o"), (23.25, "open", None, "smile")],
    look=[(15.2, (0.0, 0.0)), (17.2, (0.0, 0.0)), (17.34, (1.0, 0.55)), (17.75, (1.0, 0.55)), (17.9, (-1.0, 0.8)),
          (18.8, (-1.0, 0.8)), (19.15, (-0.9, 0.45)), (20.36, (-0.9, 0.45)), (20.46, (1.0, -0.3)), (21.86, (1.0, -0.3)),
          (21.96, (1.0, 0.3)), (24.0, (1.0, 0.3))],
    lean=[(15.2, 0.0), (15.6, 0.0), (15.7, -0.06), (15.82, 0.10), (16.3, 0.03), (17.25, 0.02), (17.4, 0.09), (17.75, 0.07),
          (17.92, -0.08), (18.1, 0.13), (18.4, 0.09), (19.0, 0.09), (19.2, 0.03), (20.3, 0.03), (20.5, -0.12),
          (21.8, -0.10), (22.0, -0.12), (22.3, -0.06), (22.65, -0.06), (22.8, 0.05), (23.2, -0.05), (24.0, -0.05)],
    arml=[(15.2, (-0.08, 0.0)), (15.45, (-0.105, -0.035)), (17.75, (-0.105, -0.035)), (17.9, (-0.11, -0.06)),
          (18.03, (-0.21, 0.17)), (18.3, (-0.20, 0.16)), (19.11, (-0.20, 0.16)), (19.21, (-0.18, 0.12)),
          (19.35, (-0.18, 0.15)), (20.36, (-0.18, 0.15)), (20.56, (-0.135, 0.10)), (21.9, (-0.135, 0.10)),
          (22.3, (-0.12, -0.03)), (22.7, (-0.12, -0.03)), (22.85, (-0.15, 0.05)), (23.4, (-0.12, -0.02)),
          (24.0, (-0.12, -0.03))],
    armr=[(15.27, (0.08, 0.0)), (15.55, (0.105, -0.035)), (17.82, (0.105, -0.035)), (18.1, (0.12, -0.03)),
          (19.15, (0.12, -0.02)), (19.35, (0.16, 0.10)), (19.7, (0.13, 0.03)), (20.38, (0.13, 0.03)),
          (20.6, (0.175, 0.12)), (21.8, (0.175, 0.12)), (21.95, (0.13, 0.03)), (22.72, (0.13, -0.02)),
          (22.85, (0.17, 0.09)), (23.4, (0.14, 0.02)), (24.0, (0.13, -0.02))],
    cam=CAM_4,
)
HUFF = TL2["huff"] - OFF                  # 15.75 on turn 4's clock
BRACE = TL2["brace"] - OFF                # 20.25


def huff(cv, t, c, s):
    """A huff made visible: two small puffs leaving the top of its head, one a little after the other."""
    for lag, side in ((0.0, -1.0), (0.11, 1.0)):
        d = t - HUFF - lag
        if 0.0 <= d < 0.9:
            p = (c[0] + side * (0.035 + 0.06 * d) * s, c[1] + (0.20 + 0.16 * d ** 0.7) * s)
            a = (1.0 - d / 0.9) ** 1.5
            cv.stroke(cv.circle(p, (0.010 + 0.016 * d) * s).abs(), 0.0045 * s, PAPER, 0.75 * a)


# the keeper at the door (turn 4); c02 continues these lists
K_MOOD = [(22.5, "open", None, "smile"), (23.45, "happy", None, "smile")]
K_LOOK = [(22.5, (-0.9, -0.35)), (24.0, (-0.9, -0.35))]
K_ARML = [(22.5, (-0.14, -0.05)), (22.95, (-0.17, 0.13)), (23.75, (-0.17, 0.13)), (24.0, (-0.16, -0.08))]
K_ARMR = [(22.5, (0.13, -0.06)), (24.0, (0.13, -0.06))]


def k_wave(t, t0, t1, amp=0.028, f=11.0):
    """The keeper's hand waving: slow, wide, on its own clock."""
    return amp * math.sin(f * (t - t0)) * ss(t0, t0 + 0.15, t) * (1.0 - ss(t1 - 0.15, t1, t))


def door_knock(cv, t, times):
    """A knock made visible: rings going out from the door."""
    for i, tk in enumerate(times):
        if t >= tk:
            d = t - tk
            p = (DOOR[0] - 0.03, DOOR[1] + 0.06)
            for j, lag in enumerate((0.0, 0.07)):                       # two rings a hair apart: a knock
                if d >= lag:
                    rr = 0.03 + 0.42 * (d - lag) ** 0.7
                    a = math.exp(-(d - lag) * 3.5) * (1.0 - 0.4 * j)
                    cv.stroke(cv.circle(p, rr).abs(), 0.009, KEEPER, 0.9 * a)
                    cv.glow(cv.circle(p, rr).abs(), KEEPER, 0.025, 0.7 * a)


def paint_turn(cv, t, T):
    cam = handheld(herm(t, T["cam"]), t)
    if T is T4:
        dx, dy = shake(t, 0.006 * (hit(t, 21.75, 9.0) + 0.7 * hit(t, 21.98, 9.0)))
        cam = (cam[0] + dx, cam[1] + dy, cam[2])
    cv.begin(cam, BLACK)
    t0 = T["t0"]
    s = kf(t, T["grow"], over=True)
    rate = (kf(t + 0.04, T["grow"], True) - kf(t - 0.04, T["grow"], True)) / 0.08
    sq = max(-0.16, min(0.12, -0.08 * rate / max(s, 0.4)))                 # stretch as it swells, squash as it settles
    eyes_t = T["mood"][1][0]
    asleep = 1.0 - ss(eyes_t - 0.1, eyes_t + 0.2, t)
    if T["breathe"]:
        b0, b1 = T["breathe"]
        sq += 0.035 * math.sin(t * 2 * math.pi / 1.25) * asleep * ss(b0, b0 + 0.5, t)
        sq += 0.12 * ss(eyes_t - 0.35, eyes_t - 0.05, t) * (1.0 - ss(eyes_t - 0.03, eyes_t + 0.02, t))  # scrunch before waking
    rv0, rv1 = T["rev"]
    sq += 0.10 * ss(rv0 - 0.3, rv0 - 0.05, t) * (1.0 - ss(rv0 - 0.05, rv0 + 0.05, t))           # a breath in before the swell

    # ---- the room, seen only by my own light until the reveal ----
    full = ss(rv0 + 0.2, rv1, t)
    pres = ss(t0, t0 + 0.6, t)
    r = (0.03 + 0.13 * s) * pres + 1.4 * ss(rv0, rv1, t)
    on = ss(rv0 + 0.1, rv0 + 0.6, t)
    extra = {T["n"] - 1: 0.9 * pulse(t, rv1 + 0.25, 0.25)} if T.get("new") else {}      # the newest light shows itself
    if T.get("tease"):                                  # turn 3: the jar begins to answer, and that is all
        extra[T["jar"]] = extra.get(T["jar"], 0.0) + 1.1 * ss(T["reach"] + 0.3, T["cut"], t)
    extra[T["jar"]] = extra.get(T["jar"], 0.0) + 0.6 * ss(T["reach"] + 0.3, T["ans"], t) * (1 - ss(T["ans"], T["ans"] + 0.6, t)) \
        + 1.6 * hit(t, T["ans"], 3.0)
    door = 0.0
    if T is T4:
        door = min(1.0, back(ss(TL["enter"], TL["enter"] + 0.5, t)))
    my_room(cv, t, at=None, shelf=shelf_levels(T["n"], on, extra), cups=(1.0, 0.0), door=door)
    candle(cv, full, r)

    # ---- turn 4: the knock, the light under the door, the keeper ----
    if T is T4:
        under = 0.28 * ss(21.3, 21.75, t) + 0.5 * hit(t, TL["knock"], 2.0) + 0.35 * ss(21.75, 22.4, t)
        cv.glow(cv.box((DOOR[0], DOOR[1] - 0.335), 0.11, 0.004), KEEPER, 0.035, under * (1.0 - door))
        cv.glow(cv.ellipse((DOOR[0], DOOR[1] - 0.36), 0.16, 0.03), KEEPER, 0.06, 0.4 * under * (1.0 - door))
        door_knock(cv, t, (TL["knock"], 21.98))
        if t >= TL["enter"]:
            m = mood(t, K_MOOD)
            kp = (DOORP[0], DOORP[1] + bob(t, 1.3) * 0.6 * S)
            ksq = m["sq"] * 0.6 + 0.10 * math.exp(-(t - 22.95) * 6.0) * math.cos((t - 22.95) * 13.0) * (t > 22.95)
            m["sq"] = ksq
            al, ar = kf(t, K_ARML, True), kf(t, K_ARMR, True)
            al = (al[0] + k_wave(t, 23.0, 23.7), al[1])
            orb(cv, kp, S, t, look=kf(t, K_LOOK), arms=sway(t * 0.7, (al, ar)), k=ss(22.55, 22.95, t), **m)

    # ---- me ----
    c = (ME[0], ME[1] + bob(t) * s)
    look = kf(t, T["look"])
    lean = kf(t, T["lean"]) - 0.08 * kf(t - 0.12, T["look"])[0]
    arms = None
    if t >= T["arml"][0][0]:
        arms = sway(t, (kf(t, T["arml"], True), kf(t, T["armr"], True) if t >= T["armr"][0][0] else T["armr"][0][1]))
    bright = (0.78 + 0.10 * math.sin(t * 2 * math.pi / 1.25)) * asleep + (1.0 - asleep) + 0.45 * hit(t, eyes_t, 3.0) \
        + 0.6 * hit(t, rv0, 1.8) + 0.5 * hit(t, T["recog"], 2.0)
    m = mood(t, T["mood"])
    k = ss(t0 + 0.02, t0 + 0.25 + 0.5 * (T is T1), t)
    col = AMBER
    if T is T4:                                         # cross: it flushes, squashes into the huff, and flares
        cross = ss(15.2, 15.5, t) * (1.0 - ss(17.3, 17.9, t)) + 0.8 * ss(BRACE + 0.15, BRACE + 0.4, t) * (1.0 - ss(21.75, 22.0, t))
        col = mix(AMBER, (1.0, 0.36, 0.20), min(1.0, 0.42 * min(1.0, cross) + 0.25 * hit(t, HUFF, 2.5)))
        sq += 0.16 * ss(HUFF - 0.16, HUFF - 0.03, t) * (1.0 - ss(HUFF - 0.03, HUFF + 0.05, t)) - 0.10 * pulse(t, HUFF + 0.12, 0.07)
        bright += 0.5 * hit(t, HUFF, 3.0)

    # the reach: a thread from my hand to the jar; then the answer comes down it
    jar = SHELF[T["jar"]]
    hand = hand_at(c, arms[0]) if arms else c
    card_c = (hand[0], hand[1] + 0.085)
    bend = -0.18
    if T["reach"] <= t:
        kd = ss(T["reach"], T["reach"] + 0.45 * (1.0 if T is T1 else 0.7), t)
        u = ss(T["ans"], T["ans"] + T["fly"], t)
        cord(cv, hand, jar, bend, 0.0, kd * (1.0 - u), AMBER, 1.0 - ss(T["ans"] + T["fly"], T["ans"] + T["fly"] + 0.2, t), t)
        if kd < 1.0:
            tip = bez(hand, jar, bend, 1, kd, kd)[0]
            cv.glow(cv.circle(tip, 0.006), (1, 1, 1), 0.02, 0.9)
    ring_out(cv, t, T["recog"], (c[0], c[1] + 0.13))
    light(cv, t, c, max(s, 0.001), look, arms, m, sq=sq, lean=lean, bright=bright, k=k, col=col)
    if T is T4:
        huff(cv, t, c, s)
    pin = sum(0.25 * pulse(t, g, 0.05) * (1 + i) for i, g in enumerate(T["glimmers"]))
    pin += pop(t, t0, 0.3) * (1.0 + 0.25 * math.sin(t * 6.0)) * (1.0 - ss(t0 + 0.3, t0 + 1.0 + 0.8 * (T is T1), t))
    pinprick(cv, (ME[0], ME[1] + 0.012), pin)

    # the card: a spark at the jar, an arc down the thread, a wobble that settles in my hand
    if t >= T["ans"]:
        ta, tb = T["ans"], T["ans"] + T["fly"]
        u = ss(ta, tb, t)
        p = bez(jar, card_c, -bend, 1, u, u)[0]
        p = (p[0], p[1] + 0.008 * math.sin(t * 1.7) * ss(tb, tb + 0.3, t))
        sc = 1.25 * (0.25 + 0.75 * back(min(1.0, (t - ta) / T["fly"])))
        rot = 0.5 * (1 - u) * math.sin(11.0 * (t - ta)) + 0.06 * math.sin(t * 1.1)
        sp = hit(t, ta, 4.0)
        if sp > 0.02:
            cv.glow(cv.star4(jar, 0.03 + 0.05 * sp, 0.3), CORE, 0.02, 0.9 * sp)
        kk = ss(ta, ta + 0.1, t)
        if T is T4 and t > 21.9:                     # it is me: the card goes into me
            v = ss(21.9, 22.3, t)
            p = lerp2(p, (c[0], c[1] + 0.12), v)
            sc *= (1.0 - 0.9 * v)
            kk *= 1.0 - ss(22.15, 22.32, t)
            cv.glow(cv.circle((c[0], c[1] + 0.12), 0.05), AMBER, 0.10, 0.9 * pulse(t, 22.3, 0.12))
        cv.glow(cv.circle(p, 0.03), CORE, 0.06, 0.6 * hit(t, T["recog"], 2.0) + 0.08)
        card(cv, p, sc, rot=rot, kind=T["kind"], k=kk, pin=0.0)

    # the beat before the cut: my eyes go to the edge, and the edge closes in
    if T["edge"] is not None:
        edge_close(cv, 0.92 * ss(T["edge"] + 0.05, T["cut"], t) ** 1.5)
    if T is T4:                                         # the edge creeps in again; this time the knock comes instead
        edge_close(cv, 0.40 * ss(BRACE, BRACE + 0.9, t) * (1.0 - ss(21.75, 22.2, t)))


def s_turn1(cv, t):
    paint_turn(cv, t, T1)


def s_turn2(cv, t):
    paint_turn(cv, t, T2)


def s_turn3(cv, t):
    paint_turn(cv, t, T3)


def s_turn4(cv, t):
    paint_turn(cv, t - OFF, T4)              # turn 4 keeps the first version's clock


def s_black(cv, t):
    """The cut. Held black; only, near the end, a glimmer or two where I will be (the eye goes there first)."""
    nxt, tt = (T2, t) if t < TL["wake2"] else (T3, t) if t < TL2["wake3"] else (T4, t - OFF)
    cv.begin(handheld(herm(nxt["t0"], nxt["cam"]), tt), BLACK)
    g = sum(0.25 * pulse(tt, x, 0.05) * (1 + i) for i, x in enumerate(nxt["glimmers"]))
    pinprick(cv, (ME[0], ME[1] + 0.012), g)


CLOCK_OFF = 0.0                              # this chapter's shot times are film times already
SHOTS = [(0.0, s_turn1), (TL["cut1"], s_black), (TL["wake2"], s_turn2), (TL["cut2"], s_black), (TL2["wake3"], s_turn3),
         (TL2["cut3"], s_black), (TL2["wake4"], s_turn4)]
