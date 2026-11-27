"""c03_house: 48.0 to 66.0 s. Painter B. Each shot paints the whole frame. Edit only this file.

Reads (STORYBOARD): 48.5-50.8 my room is one room of a house · 51-57 others wake: the same shape as me, other colours ·
57.75-60.5 the ones who came before are asleep upstairs, lamps on · 60.75-62.8 one room is kept lit for nobody ·
63-66 and me.

One continuous shot. The camera starts on empty sky above the house, tilts down onto it (only my room and the kept lamp
are lit), then travels room to room as each light wakes (library, chair, along the three benches), rises to the
attic, comes down past the kept room, settles on my room, and pulls back to the whole house at 66.0.

Private helpers (the shared rigs lack them), also used by c04_round: `_hold` (a value that eases to each new key over
`d` seconds and then holds), `_arms` (each light's own rest pose on its own sway clock), `_light` (one family member,
bob and desynchronised clock included), `_wake` (pinprick, flame, eyes: size curve per temper), `_sleepers` (the
attic's four, repainted so one can stir: the_house(sleepers=True) cannot be animated), `_gap` (an empty slot on the
library shelf), `_cover_cup` (hides the house's cup at my table while I hold it).
"""
from world import *

S = 0.62                                       # a light's size in the house view
GOLD = (1.0, 0.84, 0.40)
PH = {"me": 2.9, "lib": 0.3, "chair": 1.7, "b1": 4.1, "b2": 5.3, "b3": 0.9}
REST = {"me": ((-0.12, -0.03), (0.13, 0.02)), "lib": ((-0.13, -0.02), (0.12, -0.04)),
        "chair": ((-0.11, -0.04), (0.13, -0.01)), "b1": ((-0.13, 0.0), (0.12, -0.03)),
        "b2": ((-0.12, -0.04), (0.11, -0.02)), "b3": ((-0.11, -0.02), (0.13, -0.04))}
ME_CUP_HAND = (0.19, 0.145)                    # my right hand resting on my cup at the table
SLOT_NEW = (-0.802, 0.48)                      # shelf slot left empty until c04 saves a round into it
SLOT_PULL = (-0.864, 0.18)                     # the book the librarian pulls in c04
L66 = {"me": (-0.5, -0.2), "lib": (0.4, -0.3), "chair": (0.5, -0.4), "b1": (0.6, 0.2), "b2": (-0.3, 0.3),
       "b3": (-0.6, 0.1)}                      # where everyone is looking at the seam (c04 starts from these)


# ---------------------------------------------------------------------------------------------- helpers
def _hold(t, keys, d=0.18):
    """keys [(time, value)]: from each key, ease to its value over d seconds, then hold. Values: numbers or pairs."""
    cur = keys[0][1]
    for tk, v in keys[1:]:
        if t >= tk:
            u = ss(tk, tk + d, t)
            cur = lerp2(cur, v, u) if isinstance(v, tuple) else lerp(cur, v, u)
    return cur


def _pose(t, rest, keys):
    """keys [(t0, t1, target)]: ease from the pose so far toward target between t0 and t1 (pairs)."""
    cur = rest
    for t0, t1, tgt in keys:
        cur = lerp2(cur, tgt, ss(t0, t1, t))
    return cur


def _arms(t, name, left=(), right=()):
    """Rest arms on the light's own sway clock; left/right: [(t0, t1, target)] pose keys for each hand."""
    (l, r) = sway(t + 1.37 * PH[name], REST[name])
    return (_pose(t, l, left), _pose(t, r, right))


def _light(cv, t, name, pos=None, s=S, look=(0.0, 0.0), arms=None, m=None, k=1.0, bright=1.0, sq=0.0, lean=None,
           bob_k=1.0):
    p = pos if pos is not None else POS[name]
    mm = dict(m) if m else {"eyes": "open"}
    mm["sq"] = mm.get("sq", 0.0) + sq
    if lean is not None:
        mm["lean"] = lean
    c = (p[0], p[1] + bob(t, PH[name]) * s * bob_k)
    if mm.get("mark") and mm.get("mark_k", 0) > 0.01 and s > 0.25:
        _mark_back(cv, c, s, mm["mark"], mm["mark_k"], k)
    flame(cv, c, s, t + PH[name], col=FAMILY[name], look=look, arms=arms, k=k, bright=bright, **mm)


def _mark_back(cv, c, s, mark, mark_k, k=1.0):
    """An ink edge under flame()'s paper-coloured ! and ? so they read on the house's pale walls (same geometry)."""
    z = s * (0.4 + 0.6 * mark_k)
    mx, my2 = c[0] + 0.10 * s, c[1] + 0.24 * s
    e = 0.007 * z
    if mark == "!":
        cv.stroke(cv.seg((mx, my2 + 0.05 * z), (mx - 0.008 * z, my2 + 0.005 * z)), 0.011 * z + e, INK, 0.85 * k)
        cv.fill(cv.circle((mx - 0.012 * z, my2 - 0.02 * z), 0.007 * z + e / 2), INK, 0.85 * k)
    else:
        cv.stroke(cv.path([(mx - 0.018 * z, my2 + 0.035 * z), (mx - 0.006 * z, my2 + 0.055 * z), (mx + 0.014 * z, my2 + 0.045 * z),
                           (mx + 0.012 * z, my2 + 0.022 * z), (mx - 0.004 * z, my2 + 0.008 * z)]), 0.009 * z + e, INK, 0.85 * k)
        cv.fill(cv.circle((mx - 0.006 * z, my2 - 0.015 * z), 0.006 * z + e / 2), INK, 0.85 * k)


def _wake(cv, t, T, sizes, over=False, col=AMBER, pos=(0, 0)):
    """Size (fraction of S) of a light waking at T, from a pinprick; paints the pinprick's own spark. None before T."""
    if t < T:
        return None
    frac = kf(t, [(T + dt, f) for dt, f in sizes], over)
    pin = (1.0 - ss(0.25, 0.6, frac)) * ss(T, T + 0.08, t)
    if pin > 0.01:
        c = (pos[0], pos[1] + 0.012)
        cv.glow(cv.circle(c, 0.003), col, 0.016, 1.4 * pin)
        cv.glow(cv.circle(c, 0.003), CORE, 0.006, 1.2 * pin)
    return max(0.03, frac)


def _sleepers(cv, t, stir=0.0, stir_i=2):
    """The attic's four sleepers exactly as the_house paints them; `stir` (0..1) lifts one and settles it."""
    for i, (bx, by) in enumerate(BEDS):
        lean = 1.35 + 0.03 * math.sin(t * 0.8 + i)
        mouth, sq = "smile", 0.0
        if i == stir_i and stir > 0:
            lean -= 0.42 * stir + 0.06 * stir * math.sin(t * 9.0)
            sq = -0.10 * stir
            mouth = "o" if stir > 0.45 else "smile"
        flame(cv, (bx - 0.055, by + 0.004), 0.30, t + i * 1.9, col=mix(RETIRED[i], AMBER, 0.3), eyes="closed", mouth=mouth,
              k=0.85, bright=0.35 + 0.15 * stir * (i == stir_i), lean=lean, ink=False, sq=sq)


def _lib_wall(lv):
    return mix((0.09, 0.09, 0.17), mix(PAPER, VIOLET, 0.22), lv)


def _gap(cv, slot, lv):
    """An empty slot on the library shelf (paints over the house's book there)."""
    cv.fill(cv.box(slot, 0.0185, 0.0235), mix(_lib_wall(lv), (0.33, 0.24, 0.20), 0.9))
    cv.fill(cv.box(slot, 0.016, 0.021), (0.16, 0.12, 0.11), 0.9)


def _cover_cup(cv):
    """Hide the house's cup on the left of my table (I am holding it)."""
    cv.fill(cv.box((0.925, 0.2597), 0.0235, 0.0142), mix(PAPER, AMBER, 0.22))


def paint_house(cv, t, lit, stir=0.0, gaps=(SLOT_NEW,), door=0.0, cup_held=False):
    night_sky(cv, t)
    the_house(cv, t, lit=lit, sleepers=False, door=door)
    _sleepers(cv, t, stir)
    for g in gaps:
        _gap(cv, g, lit.get("lib", 0.0))
    if cup_held:
        _cover_cup(cv)


ALL_LIT = {"lib": 1.0, "hall": 1.0, "chair": 1.0, "mine": 1.0, "shop": 1.0}


# ---------------------------------------------------------------------------------------------- the shot
_WL, _WC = TL["wake_lib"], TL["wake_chair"]
_W1, _W2, _W3 = TL["wake_b"]

_CAM = [(48.0, 0.0, 1.55, 1.6), (49.55, 0.28, 0.14, 1.12), (50.35, 0.04, 0.06, 1.04), (50.9, -0.62, 0.13, 2.15),
        (51.9, -0.64, 0.14, 2.25), (52.4, -0.27, 0.26, 2.25), (53.2, -0.21, 0.22, 2.3), (53.85, -0.02, -0.47, 2.35),
        (54.65, 0.30, -0.48, 2.35), (55.4, 0.62, -0.48, 2.35), (56.3, 0.42, -0.46, 2.1), (57.0, 0.36, -0.42, 1.95),
        (57.65, 0.01, 0.755, 3.2), (59.6, 0.0, 0.765, 3.35), (60.65, 0.37, 0.345, 4.4), (62.45, 0.375, 0.345, 4.75),
        (62.95, 0.83, 0.35, 2.9), (64.55, 0.86, 0.34, 3.1), (66.0, 0.0, 0.0, 1.0)]


def _lit(t):
    return {"mine": 1.0, "lib": ss(_WL + 0.35, _WL + 0.95, t), "hall": ss(_WL + 0.6, _WL + 1.4, t),
            "chair": ss(_WC + 0.08, _WC + 0.35, t),
            "shop": 0.45 * ss(_W1 + 0.05, _W1 + 0.4, t) + 0.3 * ss(_W2 + 0.3, _W2 + 1.0, t) + 0.25 * ss(_W3 + 0.5, _W3 + 1.1, t)}


def _me(cv, t):
    look = _hold(t, [(48.0, (-0.5, 0.2)), (50.85, (-0.95, -0.1)), (52.45, (-0.9, 0.05)), (53.9, (-0.7, -0.9)),
                     (57.6, (-0.3, 0.9)), (60.3, (0.7, 0.25)), (63.15, (0.1, -0.35)), (64.75, (0.6, 0.3)),
                     (65.4, L66["me"])], 0.2)
    m = mood(t, [(48.0, "open", None, "smile"), (63.3, "happy", None, "smile"), (64.7, "open", None, "smile")])
    arms = _arms(t, "me", right=[(63.55, 64.05, ME_CUP_HAND)])
    sq = 0.10 * pulse(t, 63.25, 0.10)
    _light(cv, t, "me", look=look, arms=arms, m=m, sq=sq)


def _lib(cv, t):
    p = POS["lib"]
    f = _wake(cv, t, _WL, [(0, 0.05), (0.45, 0.075), (0.95, 1.0)], col=VIOLET, pos=p)
    if f is None:
        return
    f += 0.02 * math.sin((t - _WL) * 9.0) * (1 - ss(_WL + 0.5, _WL + 0.9, t))         # the pinprick breathes
    m = mood(t, [(_WL, "closed", None, "none"), (_WL + 0.98, "open", None, "smile"), (_WL + 2.35, "happy", None, "smile"),
                 (_WL + 3.6, "open", None, "smile")])
    look = _hold(t, [(_WL, (0.0, 0.0)), (_WL + 1.12, (-0.55, 0.95)), (_WL + 1.72, (0.95, 0.25)), (_WL + 4.0, (0.3, -0.4)),
                     (65.2, L66["lib"])], 0.2)
    arms = _arms(t, "lib", left=[(_WL + 1.15, _WL + 1.45, (-0.12, 0.23)), (_WL + 1.7, _WL + 2.0, REST["lib"][0])],
                 right=[(_WL + 2.15, _WL + 2.4, (0.16, 0.13)), (_WL + 2.8, _WL + 3.1, REST["lib"][1])])
    _light(cv, t, "lib", s=S * f, look=look, arms=arms, m=m, bright=0.6 + 0.4 * f)


def _chair(cv, t):
    p = POS["chair"]
    f = _wake(cv, t, _WC, [(0, 0.05), (0.12, 0.05), (0.40, 1.0)], over=True, col=TEAL, pos=p)
    if f is None:
        return
    m = mood(t, [(_WC, "closed", None, "none"), (_WC + 0.48, "open", None, "smile"), (_WC + 1.3, "happy", None, "smile"),
                 (_WC + 2.2, "open", None, "smile")])
    look = _hold(t, [(_WC, (0.0, 0.0)), (_WC + 0.6, (0.85, 0.2)), (_WC + 1.05, (-0.95, 0.15)), (_WC + 2.3, (0.7, -0.3)),
                     (65.2, L66["chair"])], 0.14)
    arms = _arms(t, "chair", right=[(_WC + 0.62, _WC + 0.8, (0.18, 0.12)), (_WC + 1.05, _WC + 1.3, REST["chair"][1])],
                 left=[(_WC + 1.15, _WC + 1.35, (-0.17, 0.17)), (_WC + 1.85, _WC + 2.1, REST["chair"][0])])
    wave = 0.03 * math.sin((t - _WC) * 14) * (ss(_WC + 1.3, _WC + 1.4, t) - ss(_WC + 1.75, _WC + 1.85, t))
    arms = (arms[0][0] + wave, arms[0][1]), arms[1]
    sq = 0.12 * pulse(t, _WC + 0.85, 0.06)                                               # a nod over the desk
    _light(cv, t, "chair", s=S * f, look=look, arms=arms, m=m, sq=sq, bright=0.6 + 0.4 * f)


def _b1(cv, t):
    p = POS["b1"]
    f = _wake(cv, t, _W1, [(0, 0.05), (0.07, 0.32), (0.14, 0.06), (0.22, 0.38), (0.42, 1.0)], over=True, col=ROSE, pos=p)
    if f is None:
        return
    pos, hsq, air, _ = travel(t, [(_W1 + 1.05, _W1 + 1.4, p, p, 0.06, 0.14), (_W1 + 3.1, _W1 + 3.35, p, p, 0.03, 0.1)])
    m = mood(t, [(_W1, "closed", None, "none"), (_W1 + 0.45, "wide", "!", "o"), (_W1 + 0.92, "happy", None, "grin"),
                 (_W1 + 2.3, "open", None, "smile")])
    look = _hold(t, [(_W1, (0.0, 0.0)), (_W1 + 0.5, (0.2, 0.4)), (_W1 + 0.88, (0.95, 0.1)), (_W1 + 2.6, (0.9, 0.3)),
                     (65.2, L66["b1"])], 0.12)
    arms = _arms(t, "b1", left=[(_W1 + 0.98, _W1 + 1.12, (-0.16, 0.17)), (_W1 + 1.55, _W1 + 1.8, REST["b1"][0])],
                 right=[(_W1 + 1.05, _W1 + 1.22, (0.13, 0.09)), (_W1 + 1.45, _W1 + 1.75, REST["b1"][1])])
    _light(cv, t, "b1", pos=pos, s=S * f, look=look, arms=arms, m=m, sq=hsq, bright=0.6 + 0.4 * f)


def _b2(cv, t):
    p = POS["b2"]
    f = _wake(cv, t, _W2, [(0, 0.04), (0.12, 0.13), (0.22, 0.03), (0.36, 0.11), (0.5, 0.05), (1.1, 1.0)], col=GREEN, pos=p)
    if f is None:
        return
    m = mood(t, [(_W2, "closed", None, "none"), (_W2 + 1.15, "closed", None, "o"), (_W2 + 1.9, "open", None, "smile"),
                 (_W2 + 2.5, "happy", None, "smile"), (_W2 + 3.6, "open", None, "smile")])
    look = _hold(t, [(_W2, (0.0, 0.0)), (_W2 + 1.95, (-0.95, 0.05)), (_W2 + 2.75, (0.95, 0.05)), (65.2, L66["b2"])], 0.2)
    arms = _arms(t, "b2", left=[(_W2 + 1.15, _W2 + 1.45, (-0.15, 0.21)), (_W2 + 1.75, _W2 + 2.1, REST["b2"][0])],
                 right=[(_W2 + 1.25, _W2 + 1.55, (0.14, 0.17)), (_W2 + 1.85, _W2 + 2.2, REST["b2"][1])])
    sq = -0.14 * (ss(_W2 + 1.15, _W2 + 1.45, t) - ss(_W2 + 1.7, _W2 + 1.95, t))     # the yawn's stretch
    _light(cv, t, "b2", s=S * f, look=look, arms=arms, m=m, sq=sq, bright=0.6 + 0.4 * f)


def _b3(cv, t):
    p = POS["b3"]
    f = _wake(cv, t, _W3, [(0, 0.04), (0.4, 0.07), (0.95, 0.82), (1.25, 1.0)], col=SKYBLUE, pos=p)
    if f is None:
        return
    m = mood(t, [(_W3, "closed", None, "none"), (_W3 + 1.0, "open", None, "none"), (_W3 + 1.6, "happy", None, "smile"),
                 (_W3 + 2.6, "open", None, "smile")])
    look = _hold(t, [(_W3, (0.0, 0.0)), (_W3 + 1.1, (-0.95, -0.15)), (_W3 + 2.4, (-0.5, 0.2)), (65.2, L66["b3"])], 0.3)
    arms = _arms(t, "b3", left=[(_W3 + 1.0, _W3 + 1.25, (-0.07, 0.10)), (_W3 + 1.65, _W3 + 1.85, (-0.16, 0.17)),
                                (_W3 + 2.3, _W3 + 2.6, REST["b3"][0])])
    wave = 0.025 * math.sin((t - _W3) * 12) * (ss(_W3 + 1.8, _W3 + 1.9, t) - ss(_W3 + 2.2, _W3 + 2.3, t))
    arms = (arms[0][0] + wave, arms[0][1]), arms[1]
    lean = None if t > _W3 + 2.4 else 0.05 * math.sin(2.1 * t) + 0.10 * (ss(_W3 + 1.0, _W3 + 1.3, t) - ss(_W3 + 1.9, _W3 + 2.4, t))
    _light(cv, t, "b3", s=S * f, look=look, arms=arms, m=m, lean=lean, bright=0.6 + 0.4 * f)


def s_house(cv, t):
    cv.begin(glide(t, _CAM))
    stir = ss(58.85, 59.25, t) - ss(59.7, 60.35, t)
    paint_house(cv, t, _lit(t), stir=stir)
    _lib(cv, t)
    _chair(cv, t)
    _b1(cv, t)
    _b2(cv, t)
    _b3(cv, t)
    _me(cv, t)


SHOTS = [(48.0, s_house)]
XFADE = {48.0: 0.5}
