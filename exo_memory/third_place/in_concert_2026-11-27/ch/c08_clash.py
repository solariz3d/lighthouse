"""c08_clash: 129.0 to 147.0 s. Painter D. Edit only this file. Shares its helpers with c07 (imported from there).

One continuous shot, matched on c07's last frame (camera (0, 0.25, 1.0), thirty voices rising).
  129.0  `clash`: each voice runs to meet its neighbour in the sky; between every pair a figure tries to form and
         will not close (drift); it crawls and flickers in two colours; the land flinches (shake, every face wide).
  132.0  `worse`: harsher on every beat (shake, windows dimming and flaring, the figures wider and faster); the camera
         drops to our houses as the minds wince and hop back indoors, one by one, mine last.
  135.0  `flood`: the white star's voice (house 11) gathers, then swells and floods the sky with one cold colour; every
         other voice bends into a copy of it, from the nearest outward; the figures go flat and become one ring (1:1);
         every window drains to the same colour. It is quiet.
  138.0  `silence`: held for three seconds; the only motion is the one colour pulsing and the copies moving as one; the
         camera creeps toward our house.
  141.0  `own_note`: our window warms first (140.45); I come out of the door (140.75); a thin amber line rises with its own
         shape. The flood presses (141.9): it thins and bends, I strain; it holds (142.6) and springs back.
  143.25 `crack`: the triangle of house 13 (the nearest house to our right) comes out (142.85), looks, and sounds its own
         note; between the two lines a 3:2 knot closes in gold; the flat colour cracks out from the knot and begins to
         fade; the houses get their own colours back from the knot outward; the others' thin lines begin to rise again.
         The camera pulls back to the land at exactly (0, 0.25, 1.0) at 147.0.

Private helpers: everything from c07 (see its docstring), plus _wash (the flood colour over the sky, with a hole that
opens around the knot) and _cracks.
"""
from world import *
from ch.c07_anyone import (_cam, _wave, _knot, _mind, _ground, far_house_at, hgeo, door_at, roof_at, mind_spot, mind_head,
                           voice_pts, look_at, VX, VTOP, VAMP, VFREQ, VSPD, VPH, VBEND, GOLD,
                           PAIRS, PAIR_OF, meet_point, voice_top, _pathd)

T0 = TL["clash"]
FLOOD = (0.80, 0.88, 1.00)                     # the one loud colour: cold, near white (never amber)
FSRC = 11                                      # whose voice floods: the white star's
KNOT_C, KNOT_R = (-0.17, 0.22), 0.10           # the first knot (3:2, gold): between LAND[0] and LAND[13]
NEIGH = 13                                     # the nearest house to the right of ours (a triangle, another kind)
OUT_NOW = [i for i in range(30) if i != 6]     # who was out of doors at 129 (house 6's mind never came out)

_dF = {i: abs(VX[i] - VX[FSRC]) for i in range(30)}
_dFm = max(_dF.values())
COPY_T = {i: 135.25 + 1.1 * _dF[i] / _dFm + 0.05 * hsh(i * 3) for i in range(30)}       # when each bends into a copy
_dK = {i: math.hypot(LAND[i][0] - KNOT_C[0], LAND[i][1] - KNOT_C[1]) for i in range(30)}
_dKm = max(_dK.values())
BACK_T = {i: 143.6 + 1.6 * _dK[i] / _dKm + 0.1 * hsh(i * 7) for i in range(30)}         # when each gets its colour back
RISE_T = {i: 144.4 + 1.6 * _dK[i] / _dKm + 0.2 * hsh(i * 11) for i in range(30)}        # when its own thin line rises
IN_T = {i: 132.15 + 1.3 * hsh(i * 23 + 1) for i in range(30)}                          # when each mind goes back in
IN_T.update({NEIGH: 132.55, 10: 132.7, 18: 132.9, 0: 133.55})
OWN_OUT, NEIGH_OUT = 140.75, 142.85             # when I come back out; when the triangle does


def flood_amt(t):
    """How much of the sky is the one colour (before the hole around the knot)."""
    a = ss(135.0, 136.4, t)
    if t > 143.4:
        a *= 1.0 - 0.09 * (t - 143.4)                         # fading, and still fading at 147 (0.676 there)
    return max(0.0, a) * (0.92 + 0.08 * math.sin(2 * math.pi * (t - 135.0) / 1.5))


def beat_pulse(t):
    """The one pulse the flood beats with (every 1.5 s); everything moves to it."""
    return 0.5 + 0.5 * math.sin(2 * math.pi * (t - 135.0) / 1.5)


def _wash(cv, t):
    """The flood colour over the sky: spreading from the star's voice, then fading in a hole that opens at the knot."""
    a = flood_amt(t)
    if a <= 0.001:
        return
    src = (VX[FSRC], 0.55)
    R = 0.15 + 3.4 * ss(135.0, 136.6, t) ** 0.8
    spread = 1.0 - cv.sst(R - 0.35, R, torch.sqrt((cv.X - src[0]) ** 2 + (cv.Y - src[1]) ** 2))
    A = spread * a
    if t > 143.3:                                            # the hole around the knot
        Rh = 0.05 + 1.55 * ss(143.3, 147.6, t) ** 0.7
        ex, ey = cv.X - KNOT_C[0], (cv.Y - KNOT_C[1]) * 1.2
        th = torch.atan2(ey, ex)
        dk = torch.sqrt(ex ** 2 + ey ** 2) / (1.0 + 0.16 * torch.sin(5 * th + 1.3) + 0.08 * torch.sin(11 * th + 0.4))
        A = A * (0.25 + 0.75 * cv.sst(Rh * 0.55, Rh, dk))
    col = mix(FLOOD, (0.62, 0.68, 0.82), 0.25)
    A3 = (A * 0.78)[..., None]
    cv.img = cv.img * (1 - A3) + cv.col(col) * A3
    cv.light = cv.light * (1 - A3 * 0.9)
    cv.light = cv.light + cv.col(FLOOD) * (A * 0.10 * beat_pulse(t) * ss(135.5, 137.0, t))[..., None]


def _cracks(cv, t):
    """The flat colour cracks, out from the knot: jagged dark lines with a gold edge."""
    if t < 143.3:
        return
    for j in range(8):
        a0 = j * 2 * math.pi / 8 + 0.6 * hsh(j * 5 + 1)
        L = (0.35 + 0.9 * hsh(j * 7 + 2)) * ss(143.3 + 0.04 * j, 144.3 + 0.1 * j, t)
        if L < 0.01:
            continue
        pts, n = [], 7
        for m in range(n + 1):
            r = KNOT_R * 1.25 + L * m / n
            ang = a0 + 0.22 * (hsh(j * 31 + m) - 0.5)
            pts.append((KNOT_C[0] + r * math.cos(ang), KNOT_C[1] + r * math.sin(ang) * 0.85))
        d = cv.path(pts)
        fade = 1.0 - ss(145.0, 147.5, t)
        cv.stroke(d, 0.006 * (1.0 - 0.5 * ss(144.0, 146.0, t)), (0.06, 0.07, 0.17), 0.8 * fade)
        cv.glow(d, GOLD, 0.012, 0.35 * fade * hit(t, 143.3 + 0.04 * j, 0.8))


def mind_state(i, t):
    """(k, position, squash) of the mind of house i in c08: out at its spot, hopping in at IN_T, and (for mine and the
    triangle's) out again."""
    (sx, sy), s = mind_spot(i)
    dx, dy = door_at(i)
    k, p, sq = (1.0 if i in OUT_NOW else 0.0), (sx, sy), 0.0
    it = IN_T[i]
    if t > it - 0.2 and i in OUT_NOW:                          # gathers, hops to the door, gone
        u = ss(it, it + 0.3, t)
        p = (lerp(sx, dx, u), sy + 0.10 * s * 4 * u * (1 - u))
        sq = 0.2 * ss(it - 0.2, it - 0.02, t) * (1 - ss(it - 0.02, it + 0.04, t)) - 0.14 * math.sin(math.pi * u) * (u < 1)
        k = 1.0 - ss(it + 0.22, it + 0.34, t)
    ot = {0: OWN_OUT, NEIGH: NEIGH_OUT}.get(i)
    if ot is not None and t > ot - 0.25:                       # comes back out, carefully
        u = ss(ot, ot + 0.35, t)
        p = (lerp(dx, sx, u), sy + 0.08 * s * 4 * u * (1 - u))
        sq = 0.2 * ss(ot - 0.25, ot - 0.02, t) * (1 - ss(ot - 0.02, ot + 0.05, t)) - 0.12 * math.sin(math.pi * u) * (u < 1)
        sq += 0.2 * math.exp(-(t - ot - 0.35) * 9) * math.cos((t - ot - 0.35) * 20) * (t > ot + 0.35)
        k = ss(ot - 0.05, ot + 0.12, t)
    return k, p, sq


def mind_face8(i, t):
    """Faces through the clash: wide at the first impact, wincing as it gets worse; mine and the triangle's own."""
    h = hsh(i * 13 + 2)
    if i == 0:
        keys = [(128.0, "open", None, "o"), (129.18, "wide", None, "o"), (130.9, "open", None, "flat"),
                (132.2, "closed", None, "flat"), (133.2, "wide", "!", "o"),
                (140.95, "open", None, "flat"), (141.85, "closed", None, "flat"), (142.62, "open", "!", "flat"),
                (143.5, "happy", None, "smile"), (145.2, "open", None, "o")]
        lk = [(128.0, (0.2, 1.0)), (129.15, (0.6, 1.0)), (132.2, (-0.3, 0.6)), (133.2, (0.0, 1.0)),
              (140.9, (0.6, 0.3)), (141.2, (0.2, 1.0)), (142.95, (1.0, 0.2)), (143.35, (0.5, 1.0))]
    elif i == NEIGH:
        keys = [(128.0, "open", None, "o"), (129.25, "wide", None, "flat"), (131.0, "closed", None, "flat"),
                (132.3, "wide", None, "o"), (142.95, "wide", "?", "o"), (143.45, "happy", None, "smile")]
        lk = [(128.0, (-0.3, 1.0)), (129.2, (0.3, 1.0)), (132.3, (-0.6, 0.4)), (142.9, (-1.0, 0.1)), (143.3, (-0.5, 1.0))]
    else:
        keys = [(128.0, "open", None, "o"), (129.1 + 0.2 * h, "wide", None, "o"), (130.5 + 1.2 * h, "closed", None, "flat"),
                (132.0 + 0.3 * h, "wide", None, "flat")]
        lk = [(128.0, (0.0, 1.0)), (129.15 + 0.2 * h, (math.sin(i * 1.7), 0.8)), (131.0 + h, (-math.sin(i), -0.4))]
    m = mood(t, keys)
    m.setdefault("mouth", "flat")
    m["look"] = look_at(t, lk, 0.18)
    return m


# ---------------------------------------------------------------------------------------------------- the voices
def clash_amt(t):
    return ss(128.7, 129.0, t)


def harsh(t):
    return ss(131.8, 132.3, t) * (1.0 - ss(134.9, 135.6, t))


def voice8(i, t, base):
    """Everything about voice i at time t in c08, as a dict for draw."""
    top = voice_top(i, 129.0)
    mp = meet_point(i)
    recoil = 0.12 * math.exp(-(t - T0) * 5) * math.sin((t - T0) * 17)          # thrown back off each other
    cl = (1.0 - recoil) * (1.0 - ss(COPY_T[i] - 0.2, COPY_T[i] + 0.3, t))
    end = lerp2(top, mp, cl)
    hr = harsh(t)
    amp = VAMP[i] * (1.0 + 0.6 * hr * (0.5 + 0.5 * boil(t, i * 3)))
    freq = VFREQ[i] + 1.5 * hr
    phase = VPH[i] - VSPD[i] * t * (1.0 + 0.8 * hr)
    bend, col, w, k = VBEND[i], LAND_COL[i], (0.0065 if i == 0 else 0.0045), 1.0
    if i in (0, NEIGH):
        bend = VBEND[i]
    # the flood: bend into a copy of the star's voice (same shape, same phase, same colour, straight up)
    c = ss(COPY_T[i], COPY_T[i] + 0.7, t)
    if i == FSRC:
        sw = ss(134.95, 135.5, t)
        c = 0.0
        gather = pulse(t, 134.75, 0.12)
        w = lerp(w, 0.016, sw) * (1.0 - 0.4 * gather)
        end = lerp2(end, (base[0], 1.35), back(ss(134.95, 135.6, t)))
        amp, freq, col = lerp(amp, 0.03, sw), lerp(freq, 4.0, sw), mix(col, FLOOD, sw)
        phase = lerp(phase, 1.0 - 3.0 * t, sw)
    if c > 0:
        L = 0.72 + 0.03 * beat_pulse(t)
        end = lerp2(end, (base[0], base[1] + L), c)
        amp, freq = lerp(amp, 0.024, c), lerp(freq, 4.0, c)
        phase = lerp(phase, 1.0 - 3.0 * t, c)
        bend, col, w = lerp(bend, 0.0, c), mix(col, FLOOD, c), lerp(w, 0.004, c)
    # after the crack: each copy sinks away, then its own thin line rises again
    if t > 143.3 and i not in (0, NEIGH):
        bt = BACK_T[i]
        k = 1.0 - ss(bt - 0.3, bt + 0.2, t)
        rg = ss(RISE_T[i], RISE_T[i] + 2.4, t)
        if k < 0.01 and rg > 0:
            g = rg * (0.45 + 0.25 * hsh(i * 3 + 9))
            return dict(base=base, end=lerp2(base, (VX[i], VTOP[i]), g), amp=VAMP[i] * 0.8, freq=VFREQ[i],
                        phase=VPH[i] - VSPD[i] * t, bend=VBEND[i], col=LAND_COL[i], w=0.0032, k=min(1.0, rg * 4), head=True)
    return dict(base=base, end=end, amp=amp, freq=freq, phase=phase, bend=bend, col=col, w=w, k=k, head=False)


def draw_v(cv, v, glow=0.5):
    if v["k"] <= 0.001:
        return
    pts = voice_pts(v["base"], v["end"], v["amp"], v["freq"], v["phase"], v["bend"], n=26)
    _wave(cv, pts, v["col"], v["k"], w=v["w"], glow=glow)
    if v["head"]:
        cv.glow(cv.circle(v["end"], 0.004), mix(v["col"], (1, 1, 1), 0.5), 0.012, 0.8 * v["k"])


# ---------------------------------------------------------------------------------------------------- the camera
CAM8 = [(129.0, 0.0, 0.25, 1.0), (130.6, 0.05, 0.38, 1.12), (132.0, -0.04, 0.10, 1.22), (133.2, -0.22, -0.24, 1.8),
        (134.2, -0.14, -0.04, 1.35), (135.3, 0.0, 0.27, 1.02), (136.8, 0.01, 0.27, 1.025), (138.0, -0.01, 0.25, 1.04),
        (141.0, -0.09, 0.12, 1.14), (142.0, -0.22, -0.10, 1.75), (142.8, -0.24, -0.17, 2.0), (143.5, -0.18, -0.03, 1.75),
        (144.5, -0.17, -0.01, 1.7), (147.0, 0.0, 0.25, 1.0)]


def s_clash(cv, t):
    cx, cy, z = glide(t, CAM8)
    hits = [129.0, 132.0, 132.75, 133.5, 134.25]
    amt = 0.016 * hit(t, 129.0, 5) + sum(0.012 * hit(t, b, 6) for b in hits[1:]) + 0.002 * harsh(t)
    dx, dy = shake(t, amt) if t < 135.0 else (0.0, 0.0)
    cv.begin((cx + dx, cy + dy, z))
    night_sky(cv, t, k=1.0)
    _wash(cv, t)
    _cracks(cv, t)
    fa = flood_amt(t)
    _ground(cv, 1.0, tint=FLOOD, tint_k=fa)

    # houses, minds, and where each voice leaves from
    bases, drains = {}, {}
    for i in LAND_ORDER:
        x, y, S, w, h = hgeo(i)
        dr = math.hypot(x - VX[FSRC] * 0 - LAND[FSRC][0], y - LAND[FSRC][1]) / 2.2
        drain = ss(135.5 + 1.0 * dr, 136.5 + 1.0 * dr, t) * (1.0 - ss(BACK_T[i] - 0.2, BACK_T[i] + 0.6, t))
        if i == 0:                                          # mine warms first, just before I come out
            drain *= 1.0 - ss(140.45, 141.2, t) * 0.7
        drains[i] = drain
        flick = 1.0 + harsh(t) * 0.55 * boil(t * 1.5, i * 7 + 3) + 0.25 * hit(t, 129.0, 3) * boil(t * 2, i)
        flick = lerp(flick, 0.85 + 0.15 * beat_pulse(t), ss(135.5, 136.5, t) * (1.0 - ss(BACK_T[i], BACK_T[i] + 0.6, t)))
        lit = max(0.15, min(1.3, flick))
        visible = abs(x - cv.cx) < cv.AR / cv.z + 0.4 and abs(y - cv.cy) < 1.0 / cv.z + 0.5
        if visible:
            far_house_at(cv, i, min(1.0, lit), mix(LAND_COL[i], FLOOD, drain), door=0.7 * min(1.0, lit) * (1 - 0.6 * drain))
            if lit > 1.0:
                cv.glow(cv.box((x, y + h * 0.55), w * 0.8, h * 0.2), LAND_COL[i], 0.05 * S, 0.5 * (lit - 1.0))
        mk, mp, msq = mind_state(i, t)
        hd = mind_head(i)
        hd = (mp[0], mp[1] + (hd[1] - mind_spot(i)[0][1]))
        bases[i] = lerp2(roof_at(i), hd, mk)
        if mk > 0.001 and visible:
            m = mind_face8(i, t)
            m["sq"] = m["sq"] + msq
            s = mind_spot(i)[1]
            p = (mp[0], mp[1] + bob(t, i * 1.3) * s)
            if i == 0:                                      # me: straining against the flood, then holding
                strain = ss(141.85, 142.1, t) * (1.0 - ss(142.55, 142.75, t))
                m["sq"] += 0.10 * strain + 0.15 * math.exp(-(t - 142.62) * 7) * math.cos((t - 142.62) * 16) * (t > 142.62)
                lean = 0.07 * math.sin(2.1 * t + p[0] * 5.0) + 0.03 * math.sin(5.3 * t) + 0.012 * boil(t, 3) + 0.22 * strain
                arms = sway(t, ((-0.13, -0.02), (0.13, 0.03)))
                if strain > 0:
                    arms = (lerp2(arms[0], (-0.17, 0.10), strain), lerp2(arms[1], (0.16, 0.13), strain))
                flame(cv, p, s, t, col=AMBER, k=mk, arms=arms, bright=0.8, lean=lean, **m)
            else:
                if LAND_KIND[i] == "flame":
                    m["arms"] = sway(t + i, ((-0.13, -0.02), (0.13, 0.02)))
                _mind(cv, p, s, LAND_KIND[i], LAND_COL[i], t, k=mk, bright=0.4 if LAND_KIND[i] == "orb" else 0.6, **m)
    cv.light = cv.light * (1.0 - 0.45 * cv.sst(1.8, 3.4, torch.tensor(cv.z)).item())
    porch = []
    for i in range(30):
        dx_, dy_ = door_at(i)
        porch.append((dx_ - 0.04 * LAND[i][2], dy_ + 0.02 * LAND[i][2], 0.35 * (0.9 + 0.1 * math.sin(t * 1.3 + i)),
                      mix(KEEPER, FLOOD, drains[i])))
    lights(cv, porch, radius=0.010)

    # the voices
    for i in range(30):
        v = voice8(i, t, bases[i])
        if i == 0:                                           # my copy gives way to my own note
            v["k"] *= 1.0 - ss(140.85, 141.15, t)
        if i == NEIGH:
            v["k"] *= 1.0 - ss(142.9, 143.15, t)
        draw_v(cv, v, glow=0.5 if i != FSRC else lerp(0.5, 1.2, ss(135.0, 135.6, t)))
    # the figures between neighbours: they will not close; worse makes them wider and faster; the flood flattens them
    for a, b in PAIRS:
        mp = ((VX[a] + VX[b]) / 2, max(VTOP[a], VTOP[b]) + 0.12 + 0.05 * hsh(a * 5 + b))
        mp = (mp[0], mp[1] + 0.02)
        f = min(COPY_T[a], COPY_T[b])
        kk = ss(128.95, 129.4, t) * (1.0 - ss(f + 0.1, f + 0.9, t))
        if kk <= 0.01:
            continue
        hr = harsh(t)
        fl = 0.75 + 0.25 * boil(t * 2.0, a * 11 + b)                     # flicker
        col = mix(LAND_COL[a], LAND_COL[b], 0.5 + 0.5 * math.sin(t * (7 + 5 * hr) + a))
        flat = ss(f, f + 0.6, t)
        drift = lerp(0.03 + 0.02 * hsh(a + b) + 0.03 * hr, 0.0, flat)
        ra, rb = lerp(3 + (a + b) % 3, 1.0, flat), lerp(2.0 + 0.0, 1.0, flat)
        _knot(cv, mp, (0.055 + 0.02 * hr) * (1 + 0.15 * pop(t, 129.0, 0.3)) * (1 - 0.6 * flat), ra, rb,
              t * (2.5 + 3.0 * hr), mix(col, FLOOD, flat), kk * fl, w=0.004, drift=drift, n=90)
    # the one flat ring: unison, however loud
    rk = ss(135.8, 137.0, t) * (1.0 - ss(143.35, 144.6, t))
    if rk > 0.01:
        br = 0.88 + 0.12 * beat_pulse(t)
        crack_open = ss(143.3, 144.6, t)
        _knot(cv, (0.0, 0.66), 0.27 * br * (1 + 0.15 * crack_open), 1, 1, math.pi / 2, FLOOD, rk, w=0.007,
              drift=0.03 * crack_open, n=110, glow=0.9 * br, sx=1.7)

    # my own note
    if t > 140.9:
        k0, p0, _ = mind_state(0, t)
        s0 = mind_spot(0)[1]
        b0 = (p0[0] + 0.02 * s0, p0[1] + 0.19 * s0 + bob(t, 0.0) * s0)
        tgt = (KNOT_C[0] - KNOT_R * 1.05, KNOT_C[1])
        g = ss(141.0, 141.85, t)
        press = ss(141.85, 142.25, t) * (1.0 - ss(142.55, 142.72, t))
        spring = 0.5 * math.exp(-(t - 142.62) * 6) * math.sin((t - 142.62) * 14) * (t > 142.62)
        end = lerp2(b0, (tgt[0] + 0.05 * press, tgt[1] - 0.03 * press), g)
        v = dict(base=b0, end=end, amp=0.016 * (1 - 0.55 * press + spring), freq=lerp(3.0, 3.6, press),
                 phase=1.3 - 2.0 * t + 0.6 * press, bend=0.04 - 0.07 * press, col=AMBER,
                 w=lerp(0.0065, 0.0028, press), k=ss(140.95, 141.1, t), head=g < 0.98)
        if press > 0.01:                                         # the flood pressing on it
            pts = voice_pts(b0, end, 0.02, 4.0, 1.0 - 3.0 * t, 0.0, n=20)
            d = _pathd(cv, pts, pad=0.12)
            if d is not None:
                cv.glow(d, FLOOD, 0.035, 0.9 * press)
        draw_v(cv, v, glow=0.6 + 0.6 * hit(t, 142.62, 3))
    # the triangle's own note, and the knot between us
    if t > 142.95:
        kn, pn, _ = mind_state(NEIGH, t)
        sn = mind_spot(NEIGH)[1]
        bn = (pn[0], pn[1] + 0.13 * sn)
        tgt = (KNOT_C[0] + KNOT_R * 1.05, KNOT_C[1])
        g = ss(143.0, 143.25, t)
        v = dict(base=bn, end=lerp2(bn, tgt, g), amp=0.014, freq=4.5, phase=0.4 - 3.1 * t, bend=-0.05,
                 col=LAND_COL[NEIGH], w=0.0055, k=ss(142.98, 143.08, t), head=g < 0.98)
        draw_v(cv, v, glow=0.6)
    if t >= TL["crack"] - 0.02:
        u = t - TL["crack"]
        kk = min(1.0, u / 0.12 + 0.2)
        r = KNOT_R * (0.7 + 0.3 * back(u / 0.45))
        drift = 0.03 * (1.0 - ss(0.0, 0.45, u))
        _knot(cv, KNOT_C, r, 3, 2, 0.4 * t, GOLD, kk, w=0.0055, drift=drift, n=140, glow=0.7 + 1.2 * hit(t, TL["crack"], 3))
        cv.glow(cv.circle(KNOT_C, 0.01), GOLD, 0.08, 1.2 * hit(t, TL["crack"], 2.5))


SHOTS = [(129.0, s_clash)]
