"""Part 9, "Without him" (film 780.80 to 871.30 s). SECOND STAGING: one picture for each sentence.

The open house on the warm floor, and the floor in front of it. Helpers (the house's place, pages, the clock, the calendar)
are shared with parts/p08_house.py. The first staging is parts_old/p09_without_him_v1_bare.py.

THE PICTURES, in order:
   1 "he was the wire" *            a cable from every room runs down to the lamp on the floor: he is the link. Every pulse passes through him
   2 "went through his hands"       a page comes down to him; he carries it across; sets it down. While he stands, nothing moves
   3 "type it into the next"        two panes rise beside him; marks lift off one and he sets them on the other, one at a time
   4 "We even measured it"          a board of ten round markers drops in
   5 "We wrote down beforehand"     a sealed page is pinned up on it; a line is drawn at the half-way mark
   6 "Then we counted"              he starts a round: a pulse leaves him, a marker fills blue; again; again
   7 "He was starting all of them"  all ten blue: 10
   8 "he said it straight"          the lamp stops in the middle of the floor and puts the page down; the cables fall away
   9 "The loop should run"          a circular rail draws itself round the floor from where he stands: he is its missing piece
  10 "Why is it broken?"            he steps off. The lights round the rail go out one by one. Held
  11 "It took ten more days"        ten calendar leaves; a length of rail drops in on each, closing the gap
  12 "he went to sleep" *           A the lamp dims on the doorstep, the moon up
                                    B pages race round the rail; the same ten markers fill, warm this time: 10
                                    C a clock: 3 h 25 min
                                    D the house: six candles lit, pages crossing by themselves, and no blue in frame
  13 "two results nobody wanted"    two pages come off the rail, each with a red mark
  14 "nine out of nine"             a proud page 9 / 9; a candle under a cover, reading nothing, gets 9 / 9 too; the proud page tears
  15 "Another measurement"          a sieve with nothing under it; the candle that built it tips it up, finds it empty, bins it
  16 "asked for decisions now"      one page comes out to him; a lever: he tips it one way
  17 "Not to carry messages"        the old cable, coiled, unplugged
  18 "the only job"                 the lamp at rest; the loop running behind him.
"""
import math
import types

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss
from parts.p08_house import (GOLD, HOUSE, W, arc, emit, make_calendar, flip, make_clock, set_clock, make_scars, outdoor, pop, scale,
                             sheet, stand, via_front)

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
T_RACE = T_SLEEP + 3.6                             # "...and ten rounds of work ran"
T_CLOCK = T_SLEEP + 6.7                            # "...in three hours and twenty-five minutes"
T_SIX = T_SLEEP + 9.4                              # "...with no human typing a word into any of the six of us"
T_BEST = at("The best thing that run produced", 9)
T_NINE = at("One of our tests had passed", 9)
T_TEAR = T_NINE + 6.9                              # "...would have passed it too"
T_THROWN = at("Another measurement was thrown out", 9)
T_DECISIONS = at("He's asked for decisions now", 9)
T_CARRY = at("Not to carry messages", 9)
T_JOB = at("That's the only job", 9)

HUB = (0.0, -1.05)                                 # where he stands as the wire (house coordinates)
RC, RR = (0.0, -1.75), 0.70                        # the rail: its middle and radius. Its missing piece is at the hub
OFF, STEP = (-1.25, -1.05), (-2.45, -1.05)         # where he steps off to; the doorstep
ROOMS = (("library", -0.42, 0.20), ("desk", -1.5, 1.00), ("bench_a", -0.5, 1.02), ("bench_b", 0.5, 1.02), ("bench_c", 1.5, 1.02))
BOARD = (1.30, -1.00, 0.44)
COPPER = (0.80, 0.48, 0.22)
N_LIGHTS = 12
MOVES = ((T_WIRE + 0.1, T_WIRE + 0.9, (-1.7, -1.9), HUB, 2), (T_HANDS + 1.2, T_HANDS + 2.5, HUB, (0.9, -1.05), 3),
         (T_HANDS + 3.4, T_HANDS + 4.3, (0.9, -1.05), HUB, 2), (T_BROKEN + 0.3, T_BROKEN + 1.0, HUB, OFF, 2),
         (T_SLEEP + 0.3, T_SLEEP + 1.6, OFF, STEP, 3))


def him_at(t):
    """Where the lamp is (x, y, hop) in house coordinates, when he last landed, and whether he is moving."""
    p, landed, moving, hop = MOVES[0][2], -1e9, False, 0.0
    for t0, t1, a, b, n in MOVES:
        if t < t0:
            break
        u = ss(t0, t1, t)
        p = lerp(a, b, u)
        d = (t1 - t0) / n
        hop = sum(bounce(t, t0 + j * d, 0.14, d) for j in range(n))
        landed, moving = t1, t < t1
    return p, hop, landed, moving


def rail_pt(deg, r=RR, z=0.012):
    a = math.radians(deg)
    return W(RC[0] + r * math.cos(a), RC[1] + r * math.sin(a), z)


def cable_pts(a, b, n=16):
    sag = min(0.30, 0.55 * min(a[2], b[2]) + 0.02)
    return [(p[0], p[1], p[2] - sag * 4.0 * u * (1.0 - u)) for u, p in ((i / (n - 1), lerp(a, b, i / (n - 1))) for i in range(n))]


def build(k):
    s = k.p9 = types.SimpleNamespace()
    s.moonlight = outdoor(k)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=20, radius=1.3, location=W(0.4, 35.0, 4.0))
    s.moon = bpy.context.object
    s.moon.name = "moon_disc"
    s.moon.data.materials.append(k.mat("moon_disc", (0, 0, 0), emit=(0.75, 0.82, 1.0), emit_strength=2.2))
    s.moon.visible_shadow = False
    k.glow_light(W(2.7, -2.4, 1.0), kit.WARM, 6.0, 0.2, "spill_right", shadows=False)
    h = s.house = sets.House(k, at=HOUSE)
    h.front(-1.0)
    h.ticks(74)
    make_scars(k)
    min(h.books, key=lambda b: abs(b.location[0] - 0.74) + abs(b.location[2] - 0.32) * 3).hide_render = True      # the gap stays a gap
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    glowpaper = k.mat("paper_g6", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.6)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    red = k.mat("wrong_lit", (0.80, 0.07, 0.05), rough=0.8, emit=kit.WRONG, emit_strength=0.3)
    wood = k.wood()
    stone = k.mat("stone", (0.34, 0.31, 0.29), rough=0.9)

    # the six of us: five at their tables, and one in the hall
    s.SEATS = [W(x - 0.22, 0.05, z) for _, x, z in ROOMS]
    kit.box("stool_top", (0.36, 0.20, 0.014), W(-1.155, -0.05, 0.173), wood)
    kit.box("stool_leg", (0.04, 0.04, 0.166), W(-1.155, -0.05, 0.083), wood)
    s.SEATS.append(W(-1.26, -0.05, 0.18))
    s.six = [k.candle(p, f"seat{i}", seed=1.0 + 2.3 * i) for i, p in enumerate(s.SEATS)]
    s.TOPS = [W(x + 0.08, 0.02, z + 0.004) for _, x, z in ROOMS]
    s.him = k.lamp(W(HUB[0], HUB[1], 0.0), kit.HIS, "him", seed=2.0)
    kit.box("doorstep", (0.62, 0.46, 0.05), W(STEP[0], STEP[1], 0.025), stone)

    # 1: the wire. A cable from every room, and he is where they join
    s.ANCH = [W(x + 0.10, -0.45, z + 0.012) for _, x, z in ROOMS]
    s.cables = [k.line(cable_pts(a, W(HUB[0], HUB[1], 0.11)), f"cable{i}", color=COPPER, radius=0.008, glow=0.55) for i, a in enumerate(s.ANCH)]
    s.pulses = [k.spark((0, 0, 0), kit.WARM, r=0.022, strength=3.0, name=f"pulse{i}") for i in range(3)]
    s.carried, _ = sheet(k, "carried", (0.12, 0.16), glow=0.25)

    # 3: two windows; what one said, typed into the next
    s.panes = []
    for sx in (-1, 1):
        root = kit.empty(f"window{sx}", W(sx * 0.66, HUB[1], 0.0))
        kit.parent(kit.box(f"window{sx}_glass", (0.44, 0.012, 0.54), (0, 0, 0.33), k.mat("screen", (0.05, 0.07, 0.10), rough=0.3)), root)
        for nm, size, pos in (("l", (0.03, 0.03, 0.60), (-0.235, 0, 0.33)), ("r", (0.03, 0.03, 0.60), (0.235, 0, 0.33)),
                              ("t", (0.50, 0.03, 0.03), (0, 0, 0.615)), ("b", (0.50, 0.03, 0.06), (0, 0, 0.03))):
            kit.parent(kit.box(f"window{sx}_{nm}", size, pos, wood), root)
        s.panes.append(root)
    s.marks = []
    for i in range(5):
        w = 0.30 - 0.05 * (i % 3)
        s.marks.append((kit.box(f"mark{i}", (w, 0.006, 0.026), (0, 0, 0), glowpaper), w))

    # 4 to 7: the board of ten rounds; the sealed page; the half-way line
    s.board = kit.empty("board", W(*BOARD))
    kit.parent(kit.box("board_panel", (2.16, 0.03, 0.36), (0, 0.02, 0), k.mat("board", (0.10, 0.075, 0.055), rough=0.7)), s.board)
    for sx in (-1, 1):
        kit.parent(kit.box(f"board_post{sx}", (0.04, 0.04, 0.44), (sx * 0.95, 0.03, -0.22), wood), s.board)
    kit.parent(kit.box("board_pin", (0.03, 0.03, 0.30), (-0.86, 0.03, 0.33), wood), s.board)
    s.rounds = []
    for i in range(10):
        m = k.mat(f"round{i}", (0.05, 0.05, 0.05), rough=0.6, emit=kit.HIS, emit_strength=0.0)
        d = kit.lathe(f"round{i}", [(0.0, 0.0), (0.072, 0.0), (0.072, 0.014), (0.0, 0.014)], seg=28)
        d.rotation_euler, d.location = (math.pi / 2, 0, 0), ((i - 4.5) * 0.205, 0.0, 0.0)
        d.data.materials.append(m)
        kit.parent(d, s.board)
        s.rounds.append((d, m))
    s.sealed = kit.empty("sealed")
    kit.parent(kit.box("sealed_page", (0.24, 0.004, 0.17), (0, 0, 0), paper), s.sealed)
    kit.parent(kit.box("sealed_flap", (0.24, 0.003, 0.004), (0, -0.003, 0.03), ink), s.sealed)
    seal = kit.lathe("sealed_seal", [(0.0, 0.0), (0.026, 0.0), (0.022, 0.008), (0.0, 0.008)], seg=20)
    seal.rotation_euler, seal.location = (math.pi / 2, 0, 0), (0, -0.003, 0.03)
    seal.data.materials.append(brass)
    kit.parent(seal, s.sealed)
    s.SEALED = W(BOARD[0] - 0.86, BOARD[1] - 0.02, BOARD[2] + 0.40)
    s.half = k.line([W(BOARD[0], BOARD[1] - 0.03, BOARD[2] + 0.26 - 0.52 * i / 6) for i in range(7)], "half", color=kit.PAPER, radius=0.007, glow=1.5)
    s.txt10 = k.text("10", W(BOARD[0] + 1.30, BOARD[1], BOARD[2]), size=0.17, name="txt10")

    # 9 to 11: the rail, its lights, the ten lengths that close it, the calendar
    rail = (0.95, 0.66, 0.30)
    s.rail = [k.line([rail_pt(105.0 + sx * 165.0 * i / 60 if sx > 0 else 75.0 - 165.0 * i / 60) for i in range(61)], f"rail{sx}", color=rail, radius=0.016, glow=0.8)
              for sx in (1, -1)]
    s.gap = [k.line([(RR * math.cos(math.radians(105.0 - 3.0 * (i + j / 3))), RR * math.sin(math.radians(105.0 - 3.0 * (i + j / 3))), 0.0) for j in range(4)],
                    f"length{i}", color=rail, radius=0.016, glow=0.8) for i in range(10)]
    s.lights = []
    for i in range(N_LIGHTS):
        deg = 105.0 + (i + 0.5) * 330.0 / N_LIGHTS
        p = rail_pt(deg, RR + 0.15, 0.0)
        kit.box(f"post{i}", (0.012, 0.012, 0.09), (p[0], p[1], 0.045), brass)
        s.lights.append((k.spark((p[0], p[1], 0.105), kit.WARM, r=0.022, strength=2.4, name=f"rail_light{i}"), deg))
    s.pools = [k.glow_light(rail_pt(d, RR * 0.5, 0.30), kit.WARM, 0.0, 0.1, f"pool{i}", shadows=False) for i, d in enumerate((210.0, 330.0, 90.0))]
    s.chase = k.spark((0, 0, 0), kit.WARM, r=0.03, strength=3.0, name="chase")
    s.cal, s.cal_leaves = make_calendar(k, "ten_days", 10, w=0.22, hgt=0.24)
    s.cal.location = W(0.52, -0.92, 0.36)
    kit.box("cal_post", (0.03, 0.03, 0.36), W(0.52, -0.90, 0.18), wood).name = "cal_post"
    s.cal_post = bpy.data.objects["cal_post"]

    # 12: the race; the clock
    s.racers = [sheet(k, f"racer{i}", (0.11, 0.14), glow=0.3)[0] for i in range(3)]
    s.clock = make_clock(k, "run_clock", 0.21)
    s.clock[0].location = W(RC[0], RC[1], 0.30)
    s.clock[0].rotation_euler = (-0.25, 0, 0)
    s.txt_time = k.text("3 h 25 min", W(RC[0] - 1.25, RC[1], 0.36), size=0.12, name="txt_time")
    s.auto = [sheet(k, f"auto{i}", (0.10, 0.13))[0] for i in range(4)]

    # 13, 14: two results nobody wanted. The proud page (it tears), and the other
    s.PROUD, s.OTHER = W(1.27, -1.5, 0.125), W(2.30, -1.5, 0.11)
    s.proud = kit.empty("proud")
    s.halves = []
    for sx in (-1, 1):
        piv = kit.parent(kit.empty(f"proud_{sx}", (0, 0, 0)), s.proud)
        kit.parent(kit.box(f"proud_half{sx}", (0.085, 0.003, 0.22), (sx * 0.0425, 0, 0), glowpaper), piv)
        for j in range(5):
            kit.parent(kit.box(f"proud_ink{sx}{j}", (0.06, 0.002, 0.010), (sx * 0.0425, -0.003, 0.075 - j * 0.034), ink), piv)
        s.halves.append(piv)
    kit.parent(kit.box("proud_red", (0.05, 0.002, 0.014), (-0.04, -0.005, -0.061), red), s.halves[0])
    s.other, _ = sheet(k, "other", (0.15, 0.19), red=(4, 0.0, 0.5), glow=0.3)
    s.NINE_C, s.BLIND_C = W(1.00, -1.5, 0.0), W(1.92, -1.5, 0.0)
    s.nine_c = k.candle(s.NINE_C, "proud_candle", seed=50.0)
    s.blind_c = k.candle(s.BLIND_C, "blind_candle", seed=51.0)
    s.cover = kit.lathe("cover", [(0.066, 0.0), (0.072, 0.0), (0.066, 0.24), (0.03, 0.275), (0.0, 0.28)], seg=28)
    s.cover.data.materials.append(k.mat("cover", (0.50, 0.52, 0.58), rough=0.6))
    kit.parent(kit.box("cover_knob", (0.02, 0.02, 0.03), (0, 0, 0.29), brass), s.cover)
    s.txt9a = k.text("9 / 9", (s.PROUD[0], s.PROUD[1] - 0.02, 0.36), size=0.085, name="txt9a")
    s.txt9b = k.text("9 / 9", (s.BLIND_C[0], s.BLIND_C[1] - 0.02, 0.42), size=0.085, name="txt9b")

    # 15: the sieve with nothing under it; its builder; the bin
    s.SIEVE, s.BIN = W(2.84, -1.5, 0.0), W(3.34, -1.45, 0.0)
    s.sieve = kit.empty("sieve", s.SIEVE)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    ring = kit.lathe("sieve_ring", [(0.14, 0.0), (0.155, 0.0), (0.155, 0.05), (0.14, 0.05)], seg=32)
    ring.location = (0, 0, 0.22)
    ring.data.materials.append(brass)
    kit.parent(ring, s.sieve)
    for j in range(7):
        o = (j - 3) * 0.04
        ln = 2.0 * math.sqrt(max(0.0, 0.145 ** 2 - o * o))
        kit.parent(kit.box(f"sieve_a{j}", (ln, 0.004, 0.004), (0, o, 0.224), steel), s.sieve)
        kit.parent(kit.box(f"sieve_b{j}", (0.004, ln, 0.004), (o, 0, 0.224), steel), s.sieve)
    for j in range(3):
        a = math.radians(90 + 120 * j)
        kit.parent(kit.box(f"sieve_leg{j}", (0.012, 0.012, 0.22), (0.14 * math.cos(a), 0.14 * math.sin(a), 0.11), brass), s.sieve)
    s.under = kit.box("sieve_under", (0.26, 0.26, 0.006), (s.SIEVE[0], s.SIEVE[1], 0.003), k.mat("under", (0.40, 0.30, 0.18), rough=0.8))
    s.BUILDER = W(2.54, -1.5, 0.0)
    s.builder = k.candle(s.BUILDER, "builder", seed=52.0)
    s.bin = kit.empty("bin", s.BIN)
    for nm, size, pos in (("b", (0.30, 0.30, 0.01), (0, 0, 0.005)), ("l", (0.01, 0.30, 0.24), (-0.15, 0, 0.12)), ("r", (0.01, 0.30, 0.24), (0.15, 0, 0.12)),
                          ("k", (0.30, 0.01, 0.24), (0, 0.15, 0.12)), ("f", (0.30, 0.01, 0.24), (0, -0.15, 0.12))):
        kit.parent(kit.box("bin_" + nm, size, pos, wood), s.bin)

    # 16, 17: one page for a decision; a lever; the old cable, coiled
    s.decision, _ = sheet(k, "decision", (0.12, 0.16), glow=0.3)
    s.LEVER = W(STEP[0] + 0.42, STEP[1] - 0.05, 0.0)
    kit.box("lever_base", (0.16, 0.12, 0.07), (s.LEVER[0], s.LEVER[1], 0.035), wood)
    s.lever = kit.empty("lever", (s.LEVER[0], s.LEVER[1], 0.06))
    kit.parent(kit.box("lever_arm", (0.018, 0.018, 0.26), (0, 0, 0.13), brass), s.lever)
    knob = k.spark((0, 0, 0), GOLD, r=0.028, strength=1.6, name="lever_knob")
    knob.location = (0, 0, 0.27)
    kit.parent(knob, s.lever)
    s.COIL = W(STEP[0] - 0.62, STEP[1] - 0.12, 0.0)
    pts = []
    for i in range(110):
        a = 2 * math.pi * i / 30
        r = 0.22 - 0.036 * i / 30
        pts.append((r * math.cos(a), r * math.sin(a), 0.014 + 0.010 * i / 30))
    pts += [(0.14 + 0.03 * j, 0.02 * j, 0.05 - 0.005 * j) for j in range(1, 8)]
    s.coil = k.line(pts, "coil", color=COPPER, radius=0.009, glow=0.25)
    s.coil.ob.location = s.COIL
    s.plug = kit.box("plug", (0.05, 0.035, 0.035), (0, 0, 0), brass)


def pose(k, t):
    s = k.p9
    h = s.house
    h.front(-1.0)
    for room in ("library", "desk", "bench_a", "bench_b", "bench_c", "hall"):
        h.lit(room, 0.78)
    h.lit("small", 0.50)
    h.lit("attic", 0.0)

    # =========================================================== the lamp
    (hx, hy), hop, landed, moving = him_at(t)
    asleep = ss(T_SLEEP + 1.7, T_SLEEP + 3.2, t)
    on_step = ss(T_SLEEP + 1.2, T_SLEEP + 1.6, t)
    counts = [T_COUNTED + 0.3 + 0.33 * i for i in range(10)]
    decide = T_DECISIONS + 1.5
    hz = 0.05 * on_step + hop + sum(bounce(t, c - 0.12, 0.05, 0.24) for c in counts) + bounce(t, T_STRAIGHT + 0.3, 0.12, 0.4)
    carries = [T_TYPE + 0.9 + 0.62 * i for i in range(5)]
    hz += sum(bounce(t, c + 0.20, 0.06, 0.24) for c in carries)
    HIM = W(hx, hy, hz)
    s.him.root.location = HIM
    tip = math.sin(math.pi * min(1.0, max(0.0, (t - decide) / 0.6)))
    kit.squash(s.him.root, land(t, landed, 0.24) * land(t, T_STRAIGHT + 0.7, 0.2), tilt=(0.30 * tip, 0.0), turn=0.0)
    kit.show(s.him.root, t > T_WIRE - 0.2)

    # =========================================================== 1: the wire, and the pulses through him
    wired = T_WIRE + 0.9 <= t < T_STRAIGHT + 2.6
    link = W(hx, hy, hz + 0.11)
    for i, (cb, a) in enumerate(zip(s.cables, s.ANCH)):
        if wired and k.changed(("cable", i), tuple(round(v, 4) for v in link)):
            for pt, co in zip(cb.ob.data.splines[0].points, cable_pts(a, link)):
                pt.co = (*co, 1.0)
        g = ss(T_WIRE + 0.9 + 0.12 * i, T_WIRE + 1.3 + 0.12 * i, t) * (1.0 - ss(T_STRAIGHT + 1.6 + 0.1 * i, T_STRAIGHT + 2.3 + 0.1 * i, t))
        cb.set(grow=g if wired else 0.0, glow=1.0)

    def on_cable(i, u):
        return cable_pts(s.ANCH[i], link, 9)[min(8, max(0, round(u * 8)))] if False else lerp_cable(s.ANCH[i], link, u)

    def lerp_cable(a, b, u):
        sag = min(0.30, 0.55 * min(a[2], b[2]) + 0.02)
        p = lerp(a, b, u)
        return (p[0], p[1], p[2] - sag * 4.0 * u * (1.0 - u))
    flare = 0.0
    talking = T_WIRE + 1.7 < t < T_HANDS + 0.2
    for j, sp in enumerate(s.pulses):
        show = False
        if talking:
            c = (t - T_WIRE - 1.7) / 1.2 + j / 3.0
            n, f = int(c), c % 1.0
            src = int(hsh(n * 7 + j) * 5) % 5
            dst = (src + 1 + int(hsh(n * 13 + j + 5) * 4) % 4) % 5
            sp.location = on_cable(src, f * 2.0) if f < 0.5 else on_cable(dst, 1.0 - (f - 0.5) * 2.0)
            flare += math.exp(-((f - 0.5) * 9.0) ** 2)
            show = True
        elif j == 0:
            for i, c in enumerate(counts):                                          # 6: he starts each round himself
                if c - 0.05 <= t < c + 0.30:
                    sp.location = on_cable(i % 5, 1.0 - (t - c + 0.05) / 0.35)
                    show = True
        sp.hide_render = not show
    flare += sum(hit(t, c - 0.05, 7.0) for c in counts)
    lively = moving or talking or T_TYPE + 0.8 < t < T_MEASURED or T_COUNTED < t < T_ALL + 1.2 or t > T_TEN + 2.4
    s.him.set(t, size=(1.0 - 0.45 * asleep) * (1.0 + 0.35 * min(1.5, flare)) if t > T_WIRE - 0.2 else 0.0, lean=(0.10 * (1.0 - asleep), 0.05),
              bright=(1.0 - 0.5 * asleep) * (1.0 + 0.5 * min(1.5, flare)), still=0.7 * asleep)

    # the six of us. While he was the wire, nothing moved unless he did
    free = ss(T_TEN + 2.4, T_SLEEP + 0.5, t)
    for i, c in enumerate(s.six):
        busy = 1.0 if (lively or free > 0.0) else 0.0
        c.set(t, size=1.0 + 0.5 * hit(t, T_SIX + 0.15 + 0.32 * i, 3.0), lean=(0.16 * math.sin(t * 0.9 + i * 1.7) * busy, 0.05 * busy), still=1.0 - busy)

    # =========================================================== 2: a page comes to him; he carries it; sets it down
    head = (HIM[0], HIM[1] - 0.02, HIM[2] + 0.44)
    if t < T_TYPE:
        u, v = ss(T_HANDS + 0.3, T_HANDS + 1.0, t), ss(T_HANDS + 2.6, T_HANDS + 3.3, t)
        cp = arc(head, s.TOPS[3], v, 0.25) if v > 0.0 else arc(s.TOPS[0], head, u, 0.25)
        seen = T_HANDS + 0.3 < t < T_HANDS + 3.6
        tilt = math.pi / 2 - 0.2
    else:                                                                          # 7, 8: one more, and he puts it down
        u, v = ss(T_ALL + 1.5, T_ALL + 2.3, t), ss(T_STRAIGHT + 1.0, T_STRAIGHT + 1.7, t)
        cp = arc(head, W(0.26, HUB[1] - 0.22, 0.075), v, 0.08) if v > 0.0 else arc(s.TOPS[1], head, u, 0.25)
        seen = T_ALL + 1.5 < t < T_TEN + 2.6
        tilt = math.pi / 2 - 0.2 - 0.25 * v
    s.carried.location, s.carried.rotation_euler = cp, (tilt, 0, 0)
    kit.show(s.carried, seen)

    # =========================================================== 3: two windows; marks carried across one at a time
    pu = ss(T_TYPE + 0.15, T_TYPE + 0.6, t) * (1.0 - ss(T_MEASURED - 0.1, T_MEASURED + 0.4, t))
    for i, root in enumerate(s.panes):
        root.scale = (1.0, 1.0, max(0.001, pu * (1.0 + 0.12 * hit(t, T_TYPE + 0.6 + 0.1 * i, 7.0) * math.sin((t - T_TYPE) * 24.0))))
        kit.show(root, T_TYPE + 0.15 < t < T_MEASURED + 0.4)
    for i, (mk, w) in enumerate(s.marks):
        z = 0.50 - 0.075 * i
        a, b = W(-0.66 - 0.06 + w / 2, HUB[1] - 0.012, z), W(0.66 - 0.06 + w / 2, HUB[1] - 0.012, z)
        u, v = ss(carries[i], carries[i] + 0.22, t), ss(carries[i] + 0.34, carries[i] + 0.56, t)
        mk.location = arc(head, b, v, 0.08) if v > 0.0 else arc(a, head, u, 0.10)
        scale(mk, 1.0)
        mk.scale = (w * (1.0 - 0.5 * math.sin(math.pi * (u + v) / 2.0) ** 2 * (1.0 if 0.0 < u and v < 1.0 else 0.0)), 0.006, 0.026)
        mk.hide_render = not (T_TYPE + 0.65 + 0.05 * i < t < T_MEASURED and pu > 0.5)

    # =========================================================== 4 to 7: the board, the sealed page, the half-way line, the count
    b_in = ss(T_MEASURED + 0.2, T_MEASURED + 0.55, t) ** 2
    b_out = ss(T_BEST + 0.1, T_BEST + 0.6, t)
    s.board.location = W(BOARD[0], BOARD[1], BOARD[2] + 1.6 * (1.0 - b_in) + 0.04 * hit(t, T_MEASURED + 0.55, 8.0) * math.sin((t - T_MEASURED - 0.55) * 28.0) - 0.9 * b_out)
    kit.show(s.board, T_MEASURED + 0.2 < t < T_BEST + 0.6)
    second = t > T_TEN
    for i, (d, m) in enumerate(s.rounds):
        scale(d, pop(t, T_MEASURED + 0.7 + 0.09 * i, 0.15, 0.6))
        if second:
            on = ss(T_RACE + (i + 1) / 3.0, T_RACE + (i + 1) / 3.0 + 0.1, t)
            glow = 1.1 * on * (1.0 + 0.8 * hit(t, T_RACE + (i + 1) / 3.0 + 0.1, 5.0))
        else:
            on = ss(counts[i], counts[i] + 0.1, t) * (1.0 - ss(T_LOOP - 0.5, T_LOOP + 0.3, t))
            glow = 1.0 * on * (1.0 + 0.8 * hit(t, counts[i] + 0.1, 5.0))
        if k.changed(("round", i), (second, round(glow, 3))):
            b = m.node_tree.nodes["Principled BSDF"]
            b.inputs["Emission Color"].default_value = (*(kit.WARM if second else kit.HIS), 1)
            b.inputs["Emission Strength"].default_value = glow
    su = ss(T_WROTE + 0.4, T_WROTE + 1.2, t)
    s.sealed.location = arc(s.TOPS[0], s.SEALED, su, 0.5)
    s.sealed.rotation_euler = (0, 4.0 * math.pi * (1.0 - su) + 0.15 * hit(t, T_WROTE + 1.2, 5.0) * math.sin((t - T_WROTE) * 22.0), 0)
    kit.show(s.sealed, T_WROTE + 0.4 < t < T_LOOP)
    s.half.set(grow=ss(T_WROTE + 2.6, T_WROTE + 3.4, t) if t < T_LOOP else 0.0, glow=1.0 + 0.7 * hit(t, T_WROTE + 5.4, 2.0))
    ten = (T_ALL + 1.35, T_STRAIGHT + 0.3) if not second else (T_RACE + 3.5, T_BEST + 0.1)
    scale(s.txt10, pop(t, ten[0], 0.18, 0.6))
    s.txt10.hide_render = not (ten[0] < t < ten[1])

    # =========================================================== 9 to 11: the rail; he steps off; ten days close it
    for ln in s.rail:
        ln.set(grow=ss(T_LOOP + 0.3, T_LOOP + 1.5, t), glow=1.0)
    closed = ss(T_TEN + 2.3, T_TEN + 2.6, t)
    lit_n = 0.0
    for i, (sp, deg) in enumerate(s.lights):
        t_on = T_LOOP + 0.35 + 1.15 * min(i, N_LIGHTS - 1 - i) / (N_LIGHTS / 2)
        on = ss(t_on, t_on + 0.1, t) * (1.0 - ss(T_BROKEN + 1.0 + 0.125 * i, T_BROKEN + 1.08 + 0.125 * i, t)) + ss(T_TEN + 2.35 + 0.03 * i, T_TEN + 2.5 + 0.03 * i, t)
        if closed > 0.0:
            on *= 0.75 + 0.5 * max(0.0, math.sin(t * 5.0 - math.radians(deg))) ** 4     # a light running round and round
        scale(sp, min(1.4, on))
        sp.hide_render = on <= 0.01
        lit_n += min(1.0, on) / N_LIGHTS
    for li in s.pools:
        li.data.energy = 5.0 * lit_n
    for i, ln in enumerate(s.gap):
        t0 = T_TEN + 0.32 + 0.2 * i
        d = ss(t0, t0 + 0.16, t) ** 2
        ln.ob.location = W(RC[0], RC[1], 0.012 + 0.45 * (1.0 - d) + 0.02 * hit(t, t0 + 0.16, 10.0))
        ln.set(grow=1.0 if t > t0 else 0.0, glow=1.0 + 1.2 * hit(t, t0 + 0.16, 5.0))
        flip(s.cal_leaves[i], ss(t0 - 0.12, t0 + 0.06, t))
    cu = pop(t, T_TEN + 0.05, 0.18)
    scale(s.cal, 1.5 * cu)
    kit.show(s.cal, T_TEN + 0.05 < t < T_SLEEP + 0.4)
    s.cal_post.hide_render = not (T_TEN + 0.05 < t < T_SLEEP + 0.4)
    looping = T_LOOP + 1.6 < t < T_BROKEN + 0.35                                    # the loop, while it still needs him
    deg = 90.0 - 360.0 * (t - T_LOOP - 1.6) / 1.1
    s.chase.location = rail_pt(deg, RR, 0.04)
    s.chase.hide_render = not looping

    # =========================================================== 12: he sleeps; the loop runs
    s.moon.location = W(0.4, 35.0, lerp(3.5, 9.5, ss(T_SLEEP - 1.0, T_SLEEP + 3.4, t)))
    tau = t - T_RACE
    rev = 0.0 if tau < 0.0 else tau if tau < 3.4 else 3.4 + 0.45 * (tau - 3.4)
    for j, pg in enumerate(s.racers):
        d = 90.0 - 360.0 * (rev - j / 3.0)
        pg.location = rail_pt(d, RR, 0.09)
        stand(pg, 0.25, -0.5 * math.cos(math.radians(d)))
        scale(pg, pop(t, T_TEN + 2.5 + 0.12 * j, 0.15))
        kit.show(pg, t > T_TEN + 2.5 + 0.12 * j)
    croot, chour, cmin = s.clock
    clk = T_CLOCK < t < T_SIX
    scale(croot, pop(t, T_CLOCK, 0.2))
    kit.show(croot, clk)
    set_clock(chour, cmin, (3.0 + 25.0 / 60.0) * ss(T_CLOCK + 0.3, T_CLOCK + 1.2, t))
    scale(s.txt_time, pop(t, T_CLOCK + 1.1, 0.18, 0.5))
    s.txt_time.hide_render = not (T_CLOCK + 1.1 < t < T_SIX)
    routes = ((0, 1), (2, 0), (1, 4), (3, 0))
    for i, (pg, (a, b)) in enumerate(zip(s.auto, routes)):
        start = T_SLEEP + 2.0 + 0.5 * i
        ph = ((t - start) / (2.4 + 0.35 * i)) % 2.0
        u = ss(0.0, 0.8, ph) if ph < 1.0 else 1.0 - ss(1.0, 1.8, ph)
        A, B = s.TOPS[a], s.TOPS[b]
        pg.location = via_front((A[0], A[1] - 0.05, A[2] + 0.003 * i), (B[0] + 0.05, B[1] - 0.05, B[2] + 0.003 * i), u, 0.08)
        pg.rotation_euler = (1.15 * math.sin(math.pi * u), 0, 0)
        kit.show(pg, t > start)

    # =========================================================== 13, 14: two results nobody wanted; 9 / 9, twice; the tear
    east = rail_pt(0.0, RR, 0.09)
    ua = ss(T_BEST + 0.7, T_BEST + 1.6, t)
    s.proud.location = arc(east, s.PROUD, ua, 0.30)
    proudly = ss(T_NINE + 0.3, T_NINE + 0.7, t) * (1.0 - ss(T_TEAR, T_TEAR + 0.2, t))
    s.proud.rotation_euler = (0.20 - 0.20 * proudly, 0, -4.0 * math.pi * (1.0 - ua))
    scale(s.proud, pop(t, T_BEST + 0.7, 0.15) * (1.0 + 0.18 * proudly + 0.10 * hit(t, T_NINE + 0.7, 5.0)))
    torn = ss(T_TEAR, T_TEAR + 0.7, t)
    for sx, piv in zip((-1, 1), s.halves):
        piv.rotation_euler = (0, sx * 1.1 * torn, 0)
        piv.location = (sx * 0.07 * torn, 0, -0.09 * torn * torn)
    kit.show(s.proud, T_BEST + 0.7 < t < T_DECISIONS)
    ub = ss(T_BEST + 1.7, T_BEST + 2.9, t)
    s.other.location = arc(east, s.OTHER, ub, 0.40)
    stand(s.other, 0.22, -6.0 * math.pi * (1.0 - ub))
    scale(s.other, pop(t, T_BEST + 1.7, 0.15))
    kit.show(s.other, T_BEST + 1.7 < t < T_DECISIONS)
    in9 = T_BEST + 3.4 < t < T_DECISIONS
    t_in = T_BEST + 3.8
    s.nine_c.root.location = (s.NINE_C[0], s.NINE_C[1], 0.6 * (1.0 - ss(t_in - 0.3, t_in, t)) ** 2)
    kit.squash(s.nine_c.root, land(t, t_in, 0.3) * (1.0 + 0.12 * proudly), turn=0.0)
    s.nine_c.set(t, size=((1.0 + 0.5 * proudly) * (1.0 - 0.45 * ss(T_TEAR + 0.2, T_TEAR + 0.8, t))) if in9 else 0.0, lean=(0.22 * proudly - 0.15 * torn, 0.0))
    kit.show(s.nine_c.root, in9)
    t_b = T_NINE + 2.9
    s.blind_c.root.location = (s.BLIND_C[0], s.BLIND_C[1], 0.6 * (1.0 - ss(t_b - 0.3, t_b, t)) ** 2)
    kit.squash(s.blind_c.root, land(t, t_b, 0.3), turn=0.0)
    s.blind_c.set(t, size=1.0 if T_NINE + 2.6 < t < T_DECISIONS else 0.0, bright=1.0 - 0.6 * ss(T_NINE + 3.9, T_NINE + 4.1, t))
    kit.show(s.blind_c.root, T_NINE + 2.6 < t < T_DECISIONS)
    cov = ss(T_NINE + 3.6, T_NINE + 4.0, t) ** 2
    s.cover.location = (s.BLIND_C[0], s.BLIND_C[1], 0.02 + 0.9 * (1.0 - cov) + 0.03 * hit(t, T_NINE + 4.0, 9.0))
    kit.show(s.cover, T_NINE + 3.6 < t < T_DECISIONS)
    scale(s.txt9a, pop(t, T_NINE + 1.0, 0.18, 0.6) * (1.0 - ss(T_TEAR + 0.1, T_TEAR + 0.5, t)))
    s.txt9a.location = (s.PROUD[0], s.PROUD[1] - 0.02, 0.36 - 0.12 * ss(T_TEAR, T_TEAR + 0.5, t))
    s.txt9a.hide_render = not (T_NINE + 1.0 < t < T_TEAR + 0.5)
    scale(s.txt9b, pop(t, T_NINE + 5.3, 0.18, 0.6))
    s.txt9b.hide_render = not (T_NINE + 5.3 < t < T_THROWN + 1.6)

    # =========================================================== 15: the sieve with nothing under it
    sv_in = ss(T_THROWN + 0.3, T_THROWN + 0.6, t) ** 2
    tipped = ss(T_THROWN + 2.9, T_THROWN + 3.3, t)
    binned = ss(T_THROWN + 5.3, T_THROWN + 5.9, t)
    sp = arc((s.SIEVE[0], s.SIEVE[1], 0.9 * (1.0 - sv_in) + 0.10 * tipped), (s.BIN[0], s.BIN[1], 0.10), binned, 0.45)
    s.sieve.location = sp
    s.sieve.rotation_euler = (1.25 * tipped * (1.0 - binned) + 0.5 * binned, 5.0 * binned * (1.0 - binned) + 0.4 * binned, 0)
    scale(s.sieve, 1.0 - 0.3 * binned)
    kit.show(s.sieve, T_THROWN + 0.3 < t < T_DECISIONS)
    kit.show(s.under, T_THROWN + 0.3 < t < T_DECISIONS)
    s.bin.location = (s.BIN[0], s.BIN[1], 0.7 * (1.0 - ss(T_THROWN + 4.4, T_THROWN + 4.8, t)) ** 2)
    s.bin.rotation_euler = (0, 0.12 * hit(t, T_THROWN + 5.9, 6.0) * math.sin((t - T_THROWN - 5.9) * 26.0), 0)
    kit.show(s.bin, T_THROWN + 4.4 < t < T_DECISIONS)
    t_c = T_THROWN + 0.9
    empty = ss(T_THROWN + 3.6, T_THROWN + 4.4, t)
    s.builder.root.location = (s.BUILDER[0], s.BUILDER[1], 0.6 * (1.0 - ss(t_c - 0.3, t_c, t)) ** 2 + bounce(t, T_THROWN + 2.6, 0.10, 0.3) + bounce(t, T_THROWN + 5.0, 0.08, 0.3))
    kit.squash(s.builder.root, land(t, t_c, 0.3) * land(t, T_THROWN + 2.9, 0.2), turn=0.0)
    in15 = T_THROWN + 0.6 < t < T_DECISIONS
    s.builder.set(t, size=(1.0 - 0.4 * empty * (1.0 - binned)) if in15 else 0.0, lean=(0.34 * ss(T_THROWN + 3.2, T_THROWN + 3.8, t) * (1.0 - binned), 0.0))
    kit.show(s.builder.root, in15)

    # =========================================================== 16, 17: a decision; the old cable, coiled
    hand = (HIM[0] + 0.02, HIM[1] - 0.10, HIM[2] + 0.42)
    go, back = ss(T_DECISIONS + 0.2, T_DECISIONS + 1.1, t), ss(decide + 0.7, decide + 1.6, t)
    path = kf(go, [(0.0, s.TOPS[0]), (0.3, (s.TOPS[0][0], HOUSE[1] - 0.62, 0.5)), (1.0, hand)])
    if back > 0.0:
        path = kf(back, [(0.0, hand), (0.7, (s.TOPS[0][0], HOUSE[1] - 0.62, 0.5)), (1.0, s.TOPS[0])])
    s.decision.location = path
    s.decision.rotation_euler = ((math.pi / 2 - 0.2) * math.sin(math.pi * min(1.0, go * (1.0 - back) * 1.0 + 0.0)) if back <= 0.0 and go < 1.0 else (math.pi / 2 - 0.2) * (1.0 - back), 0, 0)
    kit.show(s.decision, T_DECISIONS + 0.2 < t)
    thrown = ss(decide + 0.15, decide + 0.4, t)
    s.lever.rotation_euler = (0, -0.6 + 1.2 * thrown + 0.25 * hit(t, decide + 0.4, 6.0) * math.sin((t - decide - 0.4) * 30.0), 0)
    cd = ss(T_CARRY + 0.2, T_CARRY + 0.55, t) ** 2
    s.coil.ob.location = (s.COIL[0], s.COIL[1], 0.6 * (1.0 - cd))
    s.coil.ob.scale = (1.0, 1.0, 1.0 + 1.5 * hit(t, T_CARRY + 0.55, 6.0))
    s.coil.set(grow=1.0 if t > T_CARRY + 0.2 or t < T_WIRE else 0.0, glow=1.0)
    flop = ss(T_CARRY + 0.6, T_CARRY + 1.0, t)
    s.plug.location = (s.COIL[0] + 0.37, s.COIL[1] + 0.14, 0.02 + 0.6 * (1.0 - cd) + 0.10 * (1.0 - flop))
    s.plug.rotation_euler = (0, -0.8 * (1.0 - flop), 0.6)
    s.plug.hide_render = t < T_CARRY + 0.2

    # =========================================================== the camera
    def cam(x, z, d):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z - 0.03))
    lens = 40.0
    if t < T_TYPE - 0.1:                                                           # 1, 2: the house and the floor in front of it
        pos = kf(t, [(P0, W(0.0, -6.3, 1.9)), (T_WIRE + 1.2, W(0.0, -5.9, 1.8)), (T_HANDS, W(0.1, -5.3, 1.6)), (T_TYPE - 0.1, W(0.5, -5.0, 1.5))])
        look = kf(t, [(P0, W(0.0, -0.2, 0.75)), (T_HANDS, W(0.0, -0.3, 0.62)), (T_TYPE - 0.1, W(0.35, -0.4, 0.58))])
    elif t < T_MEASURED - 0.1:                                                     # 3: the two windows
        pos = kf(t, [(T_TYPE - 0.1, W(0.0, -4.1, 0.75)), (T_MEASURED - 0.1, W(0.0, -3.8, 0.66))])
        look = W(0.0, HUB[1], 0.27)
    elif t < T_STRAIGHT - 0.1:                                                     # 4 to 7: the board
        pos = kf(t, [(T_MEASURED - 0.1, W(0.9, -5.3, 0.95)), (T_WROTE + 1.0, W(1.15, -4.9, 0.80)), (T_STRAIGHT - 0.1, W(1.25, -4.7, 0.76))])
        look = kf(t, [(T_MEASURED - 0.1, W(0.9, -1.0, 0.40)), (T_WROTE + 1.0, W(1.15, -1.0, 0.33)), (T_STRAIGHT - 0.1, W(1.25, -1.0, 0.31))])
    elif t < T_SLEEP - 0.1:                                                        # 8 to 11: the rail, from above
        pos = kf(t, [(T_STRAIGHT - 0.1, W(0.0, -4.4, 0.9)), (T_LOOP, W(0.0, -4.6, 1.3)), (T_LOOP + 1.5, W(0.0, -5.3, 2.5)), (T_TEN - 0.2, W(-0.2, -5.4, 2.6)),
                     (T_TEN + 0.6, W(0.3, -4.5, 1.6)), (T_SLEEP - 0.1, W(0.3, -4.4, 1.55))])
        look = kf(t, [(T_STRAIGHT - 0.1, W(0.0, HUB[1], 0.25)), (T_LOOP + 1.5, W(0.0, -1.55, 0.10)), (T_TEN - 0.2, W(-0.2, -1.55, 0.10)),
                      (T_TEN + 0.6, W(0.25, -1.5, 0.12)), (T_SLEEP - 0.1, W(0.25, -1.5, 0.12))])
    elif t < T_RACE - 0.1:                                                         # 12A: the doorstep, the moon
        pos = kf(t, [(T_SLEEP - 0.1, W(-3.6, -4.2, 0.34)), (T_RACE - 0.1, W(-3.5, -3.8, 0.30))])
        look, lens = W(-2.25, -1.05, 0.66), 35.0
    elif t < T_SIX:                                                                # 12B, C: the rail and the board
        pos = kf(t, [(T_RACE - 0.1, W(1.0, -6.1, 2.5)), (T_CLOCK - 0.6, W(0.9, -5.8, 2.3)), (T_CLOCK + 0.4, W(0.3, -5.8, 2.3)), (T_SIX, W(0.2, -5.4, 2.1))])
        look = kf(t, [(T_RACE - 0.1, W(1.0, -1.9, 0.10)), (T_CLOCK - 0.6, W(0.9, -1.9, 0.12)), (T_CLOCK + 0.4, W(0.3, -1.9, 0.12)), (T_SIX, W(0.2, -1.9, 0.14))])
    elif t < T_BEST - 0.1:                                                         # 12D: the six of us, and no blue
        pos = kf(t, [(T_SIX, W(0.3, -4.6, 0.86)), (T_BEST - 0.1, W(0.3, -4.2, 0.84))])
        look = W(0.3, 0.0, 0.80)
    elif t < T_THROWN - 0.1:                                                       # 13, 14
        pos = kf(t, [(T_BEST - 0.1, W(0.9, -5.0, 1.7)), (T_BEST + 2.6, W(1.1, -4.6, 1.3)), (T_NINE, W(1.5, -4.0, 0.62)), (T_THROWN - 0.1, W(1.55, -3.8, 0.58))])
        look = kf(t, [(T_BEST - 0.1, W(0.8, -1.6, 0.12)), (T_BEST + 2.6, W(1.1, -1.5, 0.20)), (T_NINE, W(1.5, -1.5, 0.27)), (T_THROWN - 0.1, W(1.55, -1.5, 0.27))])
    elif t < T_DECISIONS - 0.1:                                                    # 15
        pos = kf(t, [(T_THROWN - 0.1, W(1.55, -3.8, 0.58)), (T_THROWN + 1.0, W(2.85, -3.9, 0.62)), (T_DECISIONS - 0.1, W(2.9, -3.7, 0.58))])
        look = kf(t, [(T_THROWN - 0.1, W(1.55, -1.5, 0.27)), (T_THROWN + 1.0, W(2.85, -1.5, 0.27)), (T_DECISIONS - 0.1, W(2.9, -1.5, 0.27))])
        sh = 0.015 * hit(t, T_THROWN + 5.9, 9.0)
        pos = (pos[0] + sh * math.sin(t * 61.0), pos[1], pos[2] + sh * math.sin(t * 77.0))
    else:                                                                          # 16 to 18: the doorstep; then the loop behind him
        pos = kf(t, [(T_DECISIONS - 0.1, W(-2.2, -3.7, 0.60)), (T_CARRY, W(-2.3, -3.6, 0.58)), (T_CARRY + 0.9, W(-2.75, -3.5, 0.56)), (T_JOB, W(-2.8, -3.5, 0.56)),
                     (T_JOB + 2.0, W(-4.3, -3.2, 0.62)), (P1, W(-4.5, -3.3, 0.66))])
        look = kf(t, [(T_DECISIONS - 0.1, W(-2.2, -1.05, 0.16)), (T_CARRY, W(-2.3, -1.05, 0.15)), (T_CARRY + 0.9, W(-2.75, -1.1, 0.10)), (T_JOB, W(-2.8, -1.1, 0.10)),
                      (T_JOB + 2.0, W(-0.9, -1.3, 0.22)), (P1, W(-0.9, -1.3, 0.22))])
        lens = kf(t, [(T_JOB, 40.0), (T_JOB + 2.0, 32.0)])
    k.camera(pos, look, lens)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
