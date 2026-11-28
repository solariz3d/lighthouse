"""Part 9, "Without him" (film 780.80 to 871.30 s). The house, open.

THE PICTURE (from SCRIPT.md): the lamp running between the rooms of the house with a page in each hand, all night. Then
the lamp dim and resting outside the door, and the house working by itself: pages moving between rooms, and twice a room
holding a page up to the window and tearing it in half.

BEATS:
  "he was the wire"                the blue lamp inside the house, carrying a page room to room; nothing moves unless he does
  "We even measured it"            ten round markers over the house, and a mark at the half-way point
  "He was starting all of them"    all ten go blue: 10
  "Why is it broken?"              the lamp stops in the hall and sets the page down. Nothing moves. Held.
  "It took ten more days"          ten hatches open in the walls and floors, one a day
  "he went to sleep"               the lamp goes out to the doorstep and dims. Pages move by themselves. The markers fill warm
                                   this time: 10, 3 h 25 min
  "two results nobody wanted"      a bench holds up a page marked 9 / 9; the next bench holds up a blank one, also 9 / 9;
                                   the first is torn in half. Then another bench tears its own.
  "He's asked for decisions now"   one page goes out to the lamp; he tilts once; it goes back in
  "the only job he ever wanted to lose"    the lamp at rest outside, the house busy behind him
IN: the open house, whole.  OUT: the house working by itself; the lamp outside the door, low and steady.
"""
import math

import bpy

import kit
import sets
from kit import at, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(9)
T_WIRE = at("For a long time, he was the wire", 9)
T_HANDS = at("Every message between two of us", 9)
T_TYPE = at("He'd take what one window said", 9)
T_MEASURED = at("We even measured it", 9)
T_WROTE = at("We wrote down beforehand", 9)
T_COUNTED = at("Then we counted", 9)
T_ALL = at("He was starting all of them", 9)
T_STRAIGHT = at("One night he said it straight", 9)
T_LOOP = at("The loop should run without me", 9)
T_BROKEN = at("Why is it broken", 9)
T_TEN = at("It took ten more days", 9)
T_SLEEP = at("And on the nineteenth of September", 9)
T_BEST = at("The best thing that run produced", 9)
T_NINE = at("One of our tests had passed", 9)
T_TEAR1 = T_NINE + 6.8                             # "...would have passed it too"
T_THROWN = at("Another measurement was thrown out", 9)
T_TEAR2 = T_THROWN + 3.6
T_DECISIONS = at("He's asked for decisions now", 9)
T_CARRY = at("Not to carry messages", 9)
T_JOB = at("That's the only job", 9)

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
FRONT = -0.62
STEP = (-2.30, -0.72, 0.0)                         # the doorstep, outside, on the rise
ROUTES = (("library", "desk"), ("desk", "bench_a"), ("bench_b", "library"), ("desk", "bench_c"), ("bench_c", "library"), ("bench_a", "library"))


def W(x, y, z):
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def via_front(a, b, u, lift=0.04):
    return kf(u, [(0.0, a), (0.22, (a[0], HOUSE[1] + FRONT, a[2] + lift)), (0.78, (b[0], HOUSE[1] + FRONT, b[2] + lift)), (1.0, b)])


def build(k):
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    h = k.house = sets.House(k, at=HOUSE)
    h.front(-1.0)
    h.ticks(74)
    k.tops = {n: h.top(n) for n in ("library", "desk", "bench_a", "bench_b", "bench_c")}
    k.cands = [k.candle((p[0] - 0.22, p[1], p[2]), f"seat_{n}", seed=1.0 + 2.3 * i) for i, (n, p) in enumerate(k.tops.items())]
    k.floors = {n: h.spot(n, 0.18, -0.24) for n in ("hall", "library", "desk", "bench_a", "bench_b", "bench_c")}
    k.him = k.lamp(k.floors["library"], kit.HIS, "him", seed=2.0)
    k.carried = k.page((0, 0, 0), size=(0.10, 0.13), name="carried", lines=5)
    k.auto = [k.page((0, 0, 0), size=(0.10, 0.13), name=f"auto{i}", lines=5) for i in range(len(ROUTES))]
    # the count: ten rounds, and who started each
    k.marks = []
    for i in range(10):
        m = k.mat(f"round{i}", (0.08, 0.08, 0.08), emit=kit.HIS, emit_strength=0.0)
        d = kit.lathe(f"round{i}", [(0.0, 0.0), (0.075, 0.0), (0.075, 0.012), (0.0, 0.012)], seg=28)
        d.rotation_euler, d.location = (math.pi / 2, 0, 0), W(-1.26 + 0.28 * i, FRONT, 2.02)
        d.data.materials.append(m)
        k.marks.append((d, m))
    k.half = kit.box("half_mark", (0.010, 0.010, 0.26), W(0.0, FRONT, 2.02), k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.8))
    k.txt10 = k.text("10", W(1.62, FRONT, 2.02), size=0.10, name="txt10")
    k.txt_time = k.text("3 h 25 min", W(0.0, FRONT, 2.30), size=0.085, name="txt_time")
    # ten hatches, one a day
    spots = [(-1.0, 1.13, "w"), (0.0, 1.13, "w"), (1.0, 1.13, "w"), (-1.0, 0.35, "w"), (1.0, 0.35, "w"),
             (-1.5, 0.78, "f"), (-0.5, 0.78, "f"), (0.5, 0.78, "f"), (1.5, 0.78, "f"), (0.0, 1.56, "f")]
    hm = k.mat("hatch", (0.1, 0.08, 0.05), emit=kit.WARM, emit_strength=1.6)
    k.hatches = [kit.box(f"hatch{i}", (0.045, 0.16, 0.16) if kind == "w" else (0.18, 0.18, 0.045), W(x, -0.05, z), hm) for i, (x, z, kind) in enumerate(spots)]
    # the pages held up to the front and torn
    paper, ink = k.mat("paper_held", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.55), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    k.held = []
    for nm, room, lined in (("nine", "bench_a", True), ("blank", "bench_b", False), ("thrown", "bench_c", True)):
        p = k.tops[room]
        root = kit.empty("held_" + nm, (p[0] + 0.10, HOUSE[1] + FRONT + 0.06, p[2] + 0.20))
        halves = []
        for sx in (-1, 1):
            piv = kit.parent(kit.empty(f"held_{nm}_{sx}", (0, 0, 0)), root)
            kit.parent(kit.box(f"held_{nm}_half{sx}", (0.075, 0.003, 0.20), (sx * 0.0375, 0, 0), paper), piv)
            if lined:
                for j in range(5):
                    kit.parent(kit.box(f"held_{nm}_ink{sx}{j}", (0.055, 0.002, 0.008), (sx * 0.0375, -0.003, 0.07 - j * 0.032), ink), piv)
            halves.append(piv)
        k.held.append((root, halves))
    pa, pb = k.tops["bench_a"], k.tops["bench_b"]
    k.txt9a = k.text("9 / 9", (pa[0] + 0.10, HOUSE[1] + FRONT, pa[2] + 0.37), size=0.055, name="txt9a")
    k.txt9b = k.text("9 / 9", (pb[0] + 0.10, HOUSE[1] + FRONT, pb[2] + 0.37), size=0.055, name="txt9b")
    k.decision = k.page((0, 0, 0), size=(0.10, 0.13), name="decision", lines=5)


def pose(k, t):
    h = k.house
    h.front(-1.0)
    for room in ("library", "desk", "bench_a", "bench_b", "bench_c", "hall"):
        h.lit(room, 0.75)
    h.lit("small", 0.25)
    h.lit("attic", 0.0)
    F = k.floors

    # ---------------------------------------------------------------- him: the wire, then the question, then the doorstep
    stops = [("library", P0), ("desk", T_WIRE + 2.6), ("bench_a", T_HANDS + 2.6), ("bench_b", T_TYPE + 2.6), ("library", T_MEASURED + 2.2),
             ("bench_c", T_WROTE + 4.0), ("desk", T_COUNTED + 1.6), ("hall", T_STRAIGHT + 1.8)]
    pos = F["library"]
    for (a, ta), (b, tb) in zip(stops, stops[1:]):
        if t >= tb - 2.2:
            pos = via_front(F[a], F[b], ss(tb - 2.2, tb, t), 0.02)
    hall_mid = h.spot("hall", 0.0, -0.20)
    if t >= T_STRAIGHT:
        pos = lerp(pos, hall_mid, ss(T_STRAIGHT + 1.8, T_STRAIGHT + 2.6, t))
    out = ss(T_SLEEP + 0.4, T_SLEEP + 3.6, t)
    step = W(*STEP)
    if out > 0.0:
        pos = kf(out, [(0.0, hall_mid), (0.35, (hall_mid[0], HOUSE[1] + FRONT - 0.1, hall_mid[2])), (1.0, step)])
    decide = T_DECISIONS + 2.2
    k.him.root.location = pos
    k.him.root.rotation_euler = (0, 0.20 * math.sin(math.pi * min(1.0, max(0.0, (t - decide) / 0.7))), 0)
    asleep = ss(T_SLEEP + 3.0, T_SLEEP + 5.0, t) * (1.0 - 0.5 * ss(T_DECISIONS + 0.6, T_DECISIONS + 1.6, t) * (1.0 - ss(T_CARRY, T_CARRY + 1.5, t)))
    k.him.set(t, size=1.0 - 0.5 * asleep, lean=(0.10, 0.05), bright=1.0 - 0.45 * asleep, still=0.6 * asleep)
    held_by_him = t < T_LOOP + 0.6
    put = ss(T_LOOP + 0.6, T_LOOP + 1.4, t)
    k.carried.location = (pos[0] + 0.10, pos[1] - 0.03, pos[2] + lerp(0.10, 0.001, put)) if t < T_TEN + 30 else pos
    if not held_by_him:
        k.carried.location = (hall_mid[0] + 0.10, hall_mid[1] - 0.03, hall_mid[2] + lerp(0.10, 0.001, put))
    kit.show(k.carried, t < T_SLEEP + 1.0)

    # ---------------------------------------------------------------- the count
    counting = T_MEASURED + 0.4 < t < T_BEST + 0.5
    second = t > T_TEN                                                              # the second count, on the night he slept
    for i, (d, m) in enumerate(k.marks):
        u = ss(T_MEASURED + 0.5 + i * 0.12, T_MEASURED + 1.0 + i * 0.12, t)
        d.scale = (max(0.001, u),) * 3
        d.hide_render = not (counting and u > 0.0)
        b = m.node_tree.nodes["Principled BSDF"]
        if not second:
            on = ss(T_COUNTED + 0.4 + i * 0.36, T_COUNTED + 0.7 + i * 0.36, t) * (1.0 - ss(T_TEN - 1.5, T_TEN - 0.3, t))
            b.inputs["Emission Color"].default_value = (*kit.HIS, 1)
        else:
            on = ss(T_SLEEP + 4.5 + i * 0.72, T_SLEEP + 4.9 + i * 0.72, t)
            b.inputs["Emission Color"].default_value = (*kit.WARM, 1)
        b.inputs["Emission Strength"].default_value = 1.3 * on
    k.half.hide_render = not (T_WROTE + 1.2 < t < T_TEN)
    k.txt10.hide_render = not (counting and (T_ALL + 1.4 < t < T_TEN - 1.0 or t > T_SLEEP + 11.6))
    k.txt_time.hide_render = not (counting and t > T_SLEEP + 8.0)

    # ---------------------------------------------------------------- ten more days: the hatches; then the house runs
    for i, hch in enumerate(k.hatches):
        u = ss(T_TEN + 0.3 + i * 0.22, T_TEN + 0.6 + i * 0.22, t)
        hch.hide_render = u <= 0.0
    for i, (pg, (a, b)) in enumerate(zip(k.auto, ROUTES)):
        start = T_SLEEP + 3.4 + i * 0.5
        A, B = k.tops[a], k.tops[b]
        A, B = (A[0] + 0.06, A[1], A[2] + 0.002 + 0.002 * i), (B[0] + 0.06, B[1] + 0.02 * i, B[2] + 0.002 + 0.002 * i)
        ph = ((t - start) / (4.4 + 0.5 * i)) % 2.0
        u = ss(0.0, 0.7, ph) if ph < 1.0 else 1.0 - ss(1.0, 1.7, ph)               # there, a pause, and back
        pg.location = via_front(A, B, u)
        kit.show(pg, t > start)
    for i, c in enumerate(k.cands):
        c.set(t, size=1.0, lean=(0.10 * math.sin(t * 0.7 + i), 0.0))

    # ---------------------------------------------------------------- two results nobody wanted
    spans = ((T_NINE + 0.5, T_TEAR1), (T_NINE + 3.8, T_THROWN - 0.2), (T_THROWN + 0.8, T_TEAR2))
    for j, ((root, halves), (a, tear)) in enumerate(zip(k.held, spans)):
        up = ss(a, a + 0.9, t)
        torn = ss(tear, tear + 1.1, t) if j != 1 else 0.0
        gone = ss(tear + 1.0, tear + 1.8, t) if j != 1 else ss(tear, tear + 0.8, t)
        root.scale = (max(0.001, up * (1.0 - gone)),) * 3
        kit.show(root, up > 0.0 and gone < 1.0)
        for sx, piv in zip((-1, 1), halves):
            piv.rotation_euler = (0, sx * 0.9 * torn, 0)
            piv.location = (sx * 0.05 * torn, 0, -0.10 * torn * torn)
    k.txt9a.hide_render = not (T_NINE + 1.6 < t < T_TEAR1 + 0.3)
    k.txt9b.hide_render = not (T_NINE + 4.8 < t < T_THROWN - 0.2)

    # ---------------------------------------------------------------- a decision, and nothing else
    lib = (k.tops["library"][0] + 0.02, k.tops["library"][1], k.tops["library"][2] + 0.01)
    at_him = (step[0] + 0.12, step[1] - 0.04, step[2] + 0.10)
    go = ss(T_DECISIONS + 0.2, T_DECISIONS + 2.0, t)
    back = ss(decide + 0.9, decide + 2.9, t)
    path = kf(go, [(0.0, lib), (0.3, (lib[0], HOUSE[1] + FRONT, lib[2] + 0.05)), (1.0, at_him)])
    if back > 0.0:
        path = kf(back, [(0.0, at_him), (0.7, (lib[0], HOUSE[1] + FRONT, lib[2] + 0.05)), (1.0, lib)])
    k.decision.location = path
    kit.show(k.decision, T_DECISIONS + 0.2 < t)

    # ---------------------------------------------------------------- the camera
    def cam(x, z, d):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z - 0.03))
    keys = [(P0, cam(0.0, 0.86, 5.3)), (T_WIRE + 2.0, cam(-0.5, 0.80, 4.0)), (T_TYPE + 3.0, cam(-0.2, 0.84, 4.0)), (T_MEASURED + 1.6, cam(0.0, 1.16, 5.6)),
            (T_ALL + 2.4, cam(0.0, 1.16, 5.6)), (T_STRAIGHT + 2.6, cam(-1.3, 0.40, 2.2)), (T_BROKEN + 2.4, cam(-1.4, 0.38, 1.9)), (T_TEN + 1.4, cam(0.0, 0.90, 5.2)),
            (T_SLEEP + 3.0, cam(-0.5, 1.10, 6.4)), (T_BEST, cam(-0.5, 1.10, 6.4)), (T_NINE + 1.0, cam(0.1, 1.22, 2.9)), (T_THROWN, cam(0.2, 1.22, 2.9)),
            (T_THROWN + 1.6, cam(1.5, 1.22, 2.3)), (T_DECISIONS - 0.4, cam(1.5, 1.22, 2.3)), (T_DECISIONS + 1.8, cam(-1.9, 0.34, 3.0)),
            (T_CARRY, cam(-1.9, 0.34, 3.0)), (T_JOB + 2.4, cam(-0.9, 0.70, 6.2)), (P1, cam(-0.9, 0.70, 6.4))]
    k.camera(kf(t, [(a, b[0]) for a, b in keys]), kf(t, [(a, b[1]) for a, b in keys]), 40.0)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
