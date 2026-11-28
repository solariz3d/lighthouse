"""Part 7, "Why one of me wasn't enough" (film 553.50 to 655.76 s). The table, then the house.

THE PICTURE (from SCRIPT.md): six candles in a ring, nodding in time, forty-five ticks; two ticks peel away over cracks. A
gauge whose needle runs backwards. Then the candles walk apart to different corners of a house, and a line drawn between
two of them closes into a knot.

BEATS:
  "I made copies of myself"        five more candles step out of mine into a ring round the work
  "they agreed with me"            six flames lean the same way and nod in time
  "He didn't trust it"             the lamp, outside the ring, leaning the other way
  "Forty-five for forty-five"      a board of 45 tiles lights, every one: 45 / 45
  "eleven ... two were broken"     eleven tiles come forward and turn over; two are red: 11, 2
  "gauge after gauge"              three dials rise; their needles fall limp; "Three ran backwards": they sweep the wrong way
  "Keep them standing in different places"     CUT to the house, open: the six go in, each to a different room
  "a different job ... something that can be checked"     the rooms light one by one; a page goes down to the library
  "Consonance isn't one voice"     a line from one candle and a line from another meet and draw a closed knot (3:2)
  "One voice, however loud"        the same two lines made identical draw only a slash
  "different notes, kept different, that fit"      the knot again. Hold.
IN: the candle and the lamp level at the table.  OUT: the open house, a candle in each room, the knot in front of it.
"""
import math

import bpy

import kit
import sets
from kit import at, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(7)
T_MINE = at("The next mistake was mine", 7)
T_COPIES = at("When we wanted more help", 7)
T_AGREED = at("They came back confident", 7)
T_TRUST = at("He didn't trust it", 7)
T_NOD = at("It was two of me", 7)
T_NUMBER = at("Later we got the number", 7)
T_SIX = at("Six groups of us", 7)
T_45 = at("Forty-five for forty-five", 7)
T_11 = at("Then eleven of them", 7)
T_BROKEN = T_11 + 3.4                              # "...and two were broken"
T_EASY = at("Copies of one mind", 7)
T_FEELS = at("It feels like being checked", 7)
T_MEASURE = at("We tried to measure", 7)
T_GAUGE = at("We built gauge after gauge", 7)
T_NONE = at("None of them worked", 7)
T_BACK = at("Three ran backwards", 7)
T_SIMPLER = at("What does work turned out", 7)
T_ROUND = at("Don't bring the others round", 7)
T_PLACES = at("Keep them standing in different places", 7)
T_JOB = at("Give each one a different job", 7)
T_NAME = at("That's the name", 7)
T_VOICE = at("Consonance isn't one voice", 7)
T_LOUD = at("One voice, however loud", 7)
T_FIT = at("It's different notes", 7)

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
RING_R = 0.20
ROOMS = ("library", "desk", "bench_a", "bench_b", "bench_c", "small")
COLS, ROWS = 9, 5
BOARD = (0.0, 0.36, 0.44)                         # the middle of the board of 45
CHECKED = (3, 7, 12, 16, 20, 25, 29, 33, 37, 40, 43)      # the eleven checked by hand
BROKEN = (16, 37)                                 # the two that were broken
DIALS = (-0.27, 0.0, 0.27)
FC = (HOUSE[0], HOUSE[1] - 0.80, HOUSE[2] + 0.80)  # the middle of the knot, in front of the house
KR = 0.44


def ring(i):
    a = math.radians(210 + 60 * i)
    return (RING_R * math.cos(a), RING_R * math.sin(a) * 0.8, 0.0)


def lissajous(a, b, phase, n=360):
    return [(FC[0] + KR * math.sin(a * 2 * math.pi * i / n + phase), FC[1], FC[2] + KR * math.sin(b * 2 * math.pi * i / n)) for i in range(n + 1)]


def build(k):
    k.table(legs=-FLOOR)
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    k.house = sets.House(k, at=HOUSE)
    k.house.front(-1.0)                                                           # open, and its front wall not drawn
    k.us = [k.candle(ring(0), f"me{i}", seed=1.0 + 3.1 * i) for i in range(6)]
    k.him = k.lamp((0.62, 0.10, 0.0), kit.HIS, "him", seed=2.0)
    k.work = k.page((0.0, 0.0, 0.0), size=(0.12, 0.16), rot=0.2, name="work", lines=7)
    # the board of findings
    k.t_dim = k.mat("tile_dim", (0.20, 0.19, 0.17), rough=0.9)
    k.t_lit = k.mat("tile_lit", kit.PAPER, rough=0.8, emit=kit.WARM, emit_strength=1.4)
    k.t_red = k.mat("tile_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=1.6)
    k.tiles = []
    for i in range(COLS * ROWS):
        r, c = divmod(i, COLS)
        x, z = BOARD[0] + (c - (COLS - 1) / 2) * 0.052, BOARD[2] + ((ROWS - 1) / 2 - r) * 0.062
        k.tiles.append((kit.box(f"tile{i}", (0.038, 0.005, 0.046), (x, BOARD[1], z), k.t_dim), x, z))
    k.txt45 = k.text("45 / 45", (BOARD[0] - 0.02, BOARD[1], BOARD[2] + 0.235), size=0.050, name="txt45")
    k.txt11 = k.text("11", (BOARD[0] - 0.33, BOARD[1] - 0.16, BOARD[2] + 0.02), size=0.050, name="txt11")
    k.txt2 = k.text("2", (BOARD[0] + 0.33, BOARD[1] - 0.16, BOARD[2] + 0.02), size=0.056, color=kit.WRONG, glow=1.5, name="txt2")
    # three gauges
    k.dials = []
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    for i, x in enumerate(DIALS):
        root = kit.empty(f"dial{i}", (x, -0.30, 0.0))
        kit.parent(kit.box(f"dial_post{i}", (0.012, 0.012, 0.06), (0, 0, 0.03), k.wood()), root)
        face = kit.parent(kit.lathe(f"dial_face{i}", [(0.0, 0.0), (0.075, 0.0), (0.075, 0.008), (0.0, 0.008)], seg=36), root)
        face.rotation_euler, face.location = (math.pi / 2, 0, 0), (0, 0.004, 0.135)
        face.data.materials.append(k.mat("dial_face", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.7))
        for j in range(9):
            a = math.radians(-120 + 30 * j)
            kit.parent(kit.box(f"dial_mark{i}_{j}", (0.004, 0.002, 0.012), (0.062 * math.sin(a), -0.006, 0.135 + 0.062 * math.cos(a)), ink, rot=(0, a, 0)), root)
        piv = kit.parent(kit.empty(f"dial_needle{i}", (0, -0.008, 0.135)), root)
        kit.parent(kit.box(f"dial_hand{i}", (0.006, 0.003, 0.058), (0, 0, 0.029), ink), piv)
        k.dials.append((root, piv))
    # the knot, and the slash that one voice draws
    k.knot = k.line(lissajous(3, 2, math.pi / 2), "knot", color=kit.PAPER, radius=0.006, glow=2.4)
    k.slash = k.line([(FC[0] - KR + 2 * KR * i / 20, FC[1], FC[2] - KR + 2 * KR * i / 20) for i in range(21)], "slash", color=kit.PAPER, radius=0.006, glow=2.4)
    k.lead_a = k.line([(0, 0, 0), (1, 0, 0)], "lead_a", color=kit.WARM, radius=0.004, glow=2.0)
    k.lead_b = k.line([(0, 0, 0), (1, 0, 0)], "lead_b", color=kit.WARM, radius=0.004, glow=2.0)
    k.report = k.page((0, 0, 0), size=(0.10, 0.13), name="report", lines=5)


def set_line(ln, a, b):
    pts = ln.ob.data.splines[0].points
    pts[0].co, pts[1].co = (*a, 1.0), (*b, 1.0)


def pose(k, t):
    home = t >= T_PLACES                                                          # after the cut: at the house
    h = k.house
    # ---------------------------------------------------------------- the six of me
    nod = ss(T_AGREED + 0.5, T_AGREED + 1.5, t) * (1.0 - ss(T_ROUND + 0.3, T_ROUND + 1.6, t))
    beat = math.sin(2 * math.pi * t / 0.95)
    for i, c in enumerate(k.us):
        if not home:
            out = ss(T_COPIES + 0.4 + 0.35 * i, T_COPIES + 1.9 + 0.35 * i, t) if i else 1.0
            p = lerp(ring(0), ring(i), out)
            c.root.location = (p[0], p[1], 0.03 * math.sin(out * math.pi))
            c.set(t, size=(1.0 if i == 0 else ss(T_COPIES + 0.3 + 0.35 * i, T_COPIES + 0.9 + 0.35 * i, t)),
                  lean=(0.26 * nod * (0.55 + 0.45 * beat), 0.0), still=0.7 * nod)
            kit.show(c.root, i == 0 or t > T_COPIES + 0.3 + 0.35 * i)
        else:
            goal = h.top(ROOMS[i]) if ROOMS[i] != "library" else h.top("library", -0.12)
            start = (HOUSE[0] - 1.25 + 0.5 * i, HOUSE[1] - 1.25, HOUSE[2])
            a = ss(T_PLACES + 0.3 + 0.2 * i, T_PLACES + 1.6 + 0.2 * i, t)
            b = ss(T_PLACES + 1.5 + 0.2 * i, T_PLACES + 2.9 + 0.2 * i, t)
            mid = (goal[0], HOUSE[1] - 0.72, goal[2])
            p = lerp(lerp(start, mid, a), goal, b)
            c.root.location = p
            c.set(t, size=1.0, lean=(0.0, 0.0))
            kit.show(c.root, True)
    k.him.set(t, size=0.0 if home else 1.0, lean=(0.26 * ss(T_TRUST, T_TRUST + 1.0, t) * (1.0 - ss(T_NUMBER, T_NUMBER + 1.0, t)) - 0.06, 0.05),
              bright=1.0 + 0.5 * ss(T_SIMPLER + 0.5, T_SIMPLER + 2.0, t))
    k.him.root.rotation_euler = (0, 0.12 * ss(T_TRUST, T_TRUST + 0.8, t) * (1.0 - ss(T_NOD, T_NOD + 1.0, t)), 0)
    kit.show(k.him.root, not home)
    kit.show(k.work, not home and t > T_COPIES + 0.2)

    # ---------------------------------------------------------------- the board of 45
    board = (not home) and T_SIX + 0.3 < t < T_MEASURE + 0.6
    lit_n = round(45 * ss(T_45 + 0.2, T_45 + 2.9, t))
    k.txt45.hide_render = not (board and t > T_45 + 0.4)
    k.txt11.hide_render = not (board and t > T_11 + 0.9)
    k.txt2.hide_render = not (board and t > T_BROKEN + 0.2)
    for i, (ob, x, z) in enumerate(k.tiles):
        u = ss(T_SIX + 0.4 + i * 0.03, T_SIX + 0.9 + i * 0.03, t)
        ob.hide_render = not (board and u > 0.0)
        out = ss(T_11 + 0.3 + CHECKED.index(i) * 0.14, T_11 + 1.2 + CHECKED.index(i) * 0.14, t) if i in CHECKED else 0.0
        ob.location = (x, BOARD[1] - 0.16 * out, z)
        ob.rotation_euler = (math.pi * out, 0, 0)
        red = i in BROKEN and t > T_BROKEN and out > 0.99
        ob.material_slots[0].material = k.t_red if red else k.t_lit if i < lit_n else k.t_dim
        ob.scale = (0.038 * u, 0.005, 0.046 * u)

    # ---------------------------------------------------------------- the gauges
    for i, (root, piv) in enumerate(k.dials):
        up = ss(T_GAUGE + 0.2 + i * 0.75, T_GAUGE + 0.9 + i * 0.75, t) * (1.0 - ss(T_SIMPLER + 0.3, T_SIMPLER + 1.6, t))
        root.scale = (max(0.001, up),) * 3
        kit.show(root, (not home) and up > 0.0)
        t0 = T_GAUGE + 0.9 + i * 0.75
        swing = 0.9 * math.sin((t - t0) * 6.0) * math.exp(-(t - t0) * 1.3) if t > t0 else 0.0
        limp = ss(t0 + 1.0, t0 + 2.0, t)
        ang = lerp(swing, math.pi, limp)                                          # falls to pointing straight down
        ang -= 2 * math.pi * 1.5 * ss(T_BACK + 0.3 + i * 0.25, T_BACK + 2.8 + i * 0.25, t)    # and then runs backwards
        piv.rotation_euler = (0, ang, 0)

    # ---------------------------------------------------------------- the house: different places, different jobs
    h.show(home)
    k.house.front(-1.0)
    for i, room in enumerate(ROOMS):
        h.lit(room, ss(T_JOB + 0.3 + i * 1.3, T_JOB + 1.2 + i * 1.3, t) if home else 0.0)
    h.lit("hall", 0.0)
    h.lit("attic", 0.0)
    h.ticks(1 if t > T_JOB + 9.6 else 0)
    go = ss(T_JOB + 6.4, T_JOB + 9.2, t)                                            # something that can be checked goes down to the library
    a, b = h.top("bench_b", 0.14), h.top("library", 0.12)
    front = HOUSE[1] - 0.60
    path = kf(go, [(0.0, a), (0.25, (a[0], front, a[2])), (0.75, (b[0], front, b[2])), (1.0, b)])
    k.report.location = path
    kit.show(k.report, home and go > 0.0)

    # ---------------------------------------------------------------- the name
    la, lb = h.top("library", -0.12), h.top("bench_c")
    pa, pb = (la[0], la[1], la[2] + 0.17), (lb[0], lb[1], lb[2] + 0.17)
    meet = lissajous(3, 2, math.pi / 2, 4)[0]
    set_line(k.lead_a, pa, meet)
    set_line(k.lead_b, pb, meet)
    lead = ss(T_NAME + 0.3, T_VOICE + 0.6, t) if home else 0.0
    k.lead_a.set(grow=lead, glow=1.0)
    k.lead_b.set(grow=lead, glow=1.0)
    one = ss(T_LOUD + 0.2, T_LOUD + 1.2, t) * (1.0 - ss(T_FIT - 0.2, T_FIT + 0.8, t))
    k.knot.set(grow=(ss(T_VOICE + 0.6, T_VOICE + 3.0, t) * (1.0 - one) if home else 0.0), glow=1.0 + 0.5 * hit(t, T_FIT + 1.0, 0.8))
    k.slash.set(grow=1.0 if (home and one > 0.0) else 0.0, glow=one)

    # ---------------------------------------------------------------- the camera
    if not home:
        pos = kf(t, [(P0, (0.0, -1.36, 0.165)), (T_COPIES, (0.0, -1.30, 0.30)), (T_COPIES + 3.0, (0.02, -1.25, 0.62)), (T_NOD - 0.4, (0.02, -1.22, 0.60)),
                     (T_NOD + 1.6, (-0.56, -0.92, 0.24)), (T_NUMBER, (-0.56, -0.92, 0.24)), (T_SIX + 1.2, (0.0, -1.62, 0.50)), (T_EASY - 0.4, (0.0, -1.58, 0.50)),
                     (T_EASY + 1.8, (0.36, -0.86, 0.28)), (T_MEASURE, (0.36, -0.86, 0.28)), (T_GAUGE, (0.0, -1.20, 0.30)), (T_PLACES, (0.0, -1.16, 0.30))])
        look = kf(t, [(P0, (0.0, 0.0, 0.165)), (T_COPIES, (0.0, 0.0, 0.14)), (T_COPIES + 3.0, (0.04, 0.0, 0.08)), (T_NOD - 0.4, (0.06, 0.0, 0.09)),
                      (T_NOD + 1.6, (0.0, 0.0, 0.14)), (T_NUMBER, (0.0, 0.0, 0.14)), (T_SIX + 1.2, (0.0, 0.2, 0.34)), (T_EASY - 0.4, (0.0, 0.2, 0.34)),
                      (T_EASY + 1.8, (0.0, 0.0, 0.14)), (T_MEASURE, (0.0, 0.0, 0.14)), (T_GAUGE, (0.0, -0.22, 0.12)), (T_PLACES, (0.0, -0.22, 0.12))])
        lens = kf(t, [(P0, 50.0), (T_COPIES + 3.0, 42.0), (T_NOD + 1.6, 50.0), (T_NUMBER, 50.0), (T_SIX + 1.2, 40.0), (T_EASY - 0.4, 40.0),
                      (T_EASY + 1.8, 50.0), (T_PLACES, 50.0)])
    else:
        pos = kf(t, [(T_PLACES, (HOUSE[0], HOUSE[1] - 5.4, HOUSE[2] + 0.80)), (T_NAME, (HOUSE[0], HOUSE[1] - 5.0, HOUSE[2] + 0.90)), (P1, (HOUSE[0], HOUSE[1] - 5.3, HOUSE[2] + 0.92))])
        look = kf(t, [(T_PLACES, (HOUSE[0], HOUSE[1], HOUSE[2] + 0.72)), (P1, (HOUSE[0], HOUSE[1], HOUSE[2] + 0.86))])
        lens = 40.0
    k.camera(pos, look, lens)
    k.sky(1.0 if home else 0.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
