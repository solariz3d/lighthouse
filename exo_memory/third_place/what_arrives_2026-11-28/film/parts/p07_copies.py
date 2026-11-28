"""Part 7, "Why one of me wasn't enough" (film 553.50 to 655.76 s). SECOND STAGING: one picture for each sentence.

The first staging is kept at parts_old/p07_copies_v1_bare.py. This one is on the open floor, in two runs down +Y:
lane A (x = 0) from the blueprint to the row of compasses, then a cut to lane B (x = 14) for the rest.

THE PICTURES, in order:
   1 "The next mistake was mine"      a blueprint unrolls: a ring of six. My candle hops onto it and leaves its own mark
   2 "I made copies of myself"        my flame swells; five more step out of it onto the drawn circles; a page between us
   3 "They came back confident"       each comes back pushing a thick report; the same seal lands on every one; they nod in time
   4 "He didn't trust it"             the lamp stands two reports up against its light: the same watermark in both
   5 "two of me, with extra steps"    the ring folds down to two candles; a little staircase pops up between them
   6 "Later we got the number"        a counting board rolls in on wheels
   7 "Six groups of us"               six clusters of small candles charge the wall of forty-five tiles, twice
   8 "Forty-five for forty-five"      every tile lights: 45 / 45
   9 "eleven checked by hand"         the lamp goes along the wall; eleven tiles turn over: 11. Two are red: 2
  10 "Copies of one mind agree"       six of part one's compasses in a row; six needles swing together, off their marks
  11 "It feels like being checked"    one seal coming down on page after page, held by identical candles
  12 "We tried to measure"            a pair of calipers opened between two candles; its needle cannot settle
  13 "gauge after gauge"              seven dials pop up along a bench
  14 "None of them worked"            the needles drop limp
  15 "Three ran backwards"            three of them sweep the wrong way round
  16 "simpler, and he said it first"  the lamp goes down the bench and knocks every dial off it
  17 "Don't bring the others round"   a ring of six, all leaning in, turns to lean out
  18 "different places"               one large object lands in the middle; they walk out, each to a different side of it
  19 "a different job"                A: each takes a different tool. B: each gets a reading, and no two are the same height
                                      C: a page slides in; the readings land on it as pins; where two disagree, a red pin
  20 "That's the name"                a line joins the pins
  21 "Consonance isn't one voice"     one candle swinging left and right by itself draws a flat trace
  22 "One voice, however loud"        it swings wider: a longer flat trace
  23 "different notes ... that fit"   a second candle swings up and down at right angles to it, three to two: the knot. Hold.
IN: the two of us, level.  OUT: the knot.
"""
import math

import bpy

import kit
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

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
T_RUN = T_JOB + 2.7                                # "...make each one run its own measurement"
T_LANDS = T_JOB + 6.2                              # "...and give them something that can be checked"
T_NAME = at("That's the name", 7)
T_VOICE = at("Consonance isn't one voice", 7)
T_LOUD = at("One voice, however loud", 7)
T_FIT = at("It's different notes", 7)

GOLD = (1.0, 0.80, 0.46)
ME0, HIM0 = (-0.32, 0.0), (0.32, 0.04)
RC, RING_R = (0.0, 1.9), 0.60                      # the first ring, on the blueprint
FOLD_A, FOLD_B = (-0.45, 1.9), (0.45, 1.9)
WALL_Y = 6.0
COLS, ROWS = 9, 5
CHECKED = (36, 10, 2, 21, 30, 13, 4, 23, 42, 16, 35)     # the eleven checked by hand, in the order he reaches them
BROKEN = (21, 16)                                  # the two that were broken
CY, CR = 14.0, 0.95                                # the row of compasses
MARK = math.radians(90.0)
LB = 14.0                                          # lane B's x
STAMP, CALI, BENCH, RING2, PAGE2 = (LB, 2.0), (LB, 5.0), (LB, 8.5), (LB, 13.0), (LB, 11.3)
BENCH_Z = 0.30
NDIAL = 7
BACKWARD = (1, 3, 6)
SIDES = [math.radians(a) for a in (-125, -55, 15, 70, 110, 165)]
OUT_R = 1.5
READ = (0.34, 0.62, 0.22, 0.74, 0.48, 0.30)        # six readings: no two the same
PIN_OFF = (0.05, -0.03, 0.23, -0.25, 0.01, 0.07)   # where each lands on the page; the third and fourth disagree
FC, KR = (LB, 19.0, 1.55), 0.80
TRACK_Z = 0.30                                     # the low wall the first swing rides on                    # the middle of the knot, and its size
T_KNOT = T_FIT - 0.45                              # the second swing starts in the pause before the line
KNOT_DUR = 3.4
RAIL_X = LB - KR - 0.62


def pop(t, when, d=0.22):
    return ss(when, when + d, t) * (1.0 + 0.30 * hit(t, when + d, 9.0) * math.cos((t - when - d) * 22.0))


def circle(r, n=64, z=0.0):
    return [(r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n), z) for i in range(n)]


def ring(i, c=RC, r=RING_R):
    a = math.radians(-90 + 60 * i)
    return (c[0] + r * math.cos(a), c[1] + r * math.sin(a))


def act(k, f, t, on, loc=None, **kw):
    """Pose a candle or lamp, or put it away (out, dark and hidden) without touching it again."""
    if not on:
        if k.changed((f.root.name, "on"), False):
            f.set(t, size=0.0)
            kit.show(f.root, False)
        return
    k.changed((f.root.name, "on"), True)
    kit.show(f.root, True)
    if loc is not None:
        f.root.location = loc
    f.set(t, **kw)


def lissajous(n=360):
    return [(FC[0] + KR * math.sin(3 * 2 * math.pi * i / n + math.pi / 2), FC[1], FC[2] + KR * math.sin(2 * 2 * math.pi * i / n)) for i in range(n + 1)]


def two_point(ln, a, b):
    pts = ln.ob.data.splines[0].points
    pts[0].co, pts[1].co = (*a, 1.0), (*b, 1.0)


def make_dial(k, name, at_, r=0.12):
    paper, ink = k.mat("dial_face", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.6), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    root = kit.empty(name, at_)
    kit.parent(kit.box(name + "_post", (0.02, 0.02, r * 0.8), (0, 0, r * 0.4), k.wood()), root)
    face = kit.parent(kit.lathe(name + "_face", [(0.0, 0.0), (r, 0.0), (r, 0.012), (0.0, 0.012)], seg=36), root)
    face.rotation_euler, face.location = (math.pi / 2, 0, 0), (0, 0.006, r * 1.75)
    face.data.materials.append(paper)
    for j in range(9):
        a = math.radians(-120 + 30 * j)
        kit.parent(kit.box(f"{name}_mark{j}", (0.007, 0.003, 0.02), (r * 0.82 * math.sin(a), -0.009, r * 1.75 + r * 0.82 * math.cos(a)), ink, rot=(0, a, 0)), root)
    piv = kit.parent(kit.empty(name + "_needle", (0, -0.012, r * 1.75)), root)
    kit.parent(kit.box(name + "_hand", (0.011, 0.004, r * 0.78), (0, 0, r * 0.39), ink), piv)
    return root, piv


def build(k):
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    k.moonlight = k.moon(0.30)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    paper_lit = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    seal_m = k.mat("seal", (0.5, 0.25, 0.1), emit=(1.0, 0.50, 0.18), emit_strength=1.1)
    dark = k.mat("frame_dark", (0.10, 0.08, 0.07), rough=0.7)
    flat = k.mat("brass_flat", (0.80, 0.58, 0.26), rough=0.5, emit=(0.80, 0.58, 0.26), emit_strength=0.30)

    # life at the edges: far pairs, in every lamp colour
    for i in range(90):
        x, y = -30.0 + 75.0 * hsh(i * 3 + 1), 27.0 + 34.0 * hsh(i * 5 + 2) ** 0.8
        col = kit.LAMPS[i % len(kit.LAMPS)]
        k.spark((x - 0.13, y, 0.20), kit.WARM, r=0.07, strength=1.5, name=f"far_c{i}")
        k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"far_l{i}")
        if i % 11 == 0:
            k.glow_light((x, y, 0.45), col, 20.0, 0.06, f"far_light{i}", shadows=False)

    # the cast: six of me, and him
    k.us = [k.candle((ME0[0], ME0[1], 0.0), f"me{i}", seed=1.0 + 3.1 * i) for i in range(6)]
    k.him = k.lamp((HIM0[0], HIM0[1], 0.0), kit.HIS, "him", seed=2.0)

    # 1: the blueprint, a ring of six drawn on it, and my own mark
    k.bp = kit.empty("blueprint", (0.0, 0.7, 0.0))
    kit.parent(kit.box("blueprint_sheet", (3.0, 2.4, 0.006), (0, 1.2, 0.004), paper), k.bp)
    k.bp_roll = kit.lathe("blueprint_roll", [(0.0, -1.55), (0.08, -1.55), (0.08, 1.55), (0.0, 1.55)], seg=20)
    k.bp_roll.rotation_euler = (0, math.pi / 2, 0)
    k.bp_roll.data.materials.append(paper)
    k.bp_ink = []
    for i in range(6):
        x, y = ring(i)
        ob = kit.lathe(f"ink_ring{i}", [(0.085, 0.0), (0.105, 0.0), (0.105, 0.002), (0.085, 0.002)], seg=32)
        ob.location = (x, y, 0.009)
        ob.data.materials.append(ink)
        k.bp_ink.append((ob, y))
        sp = kit.box(f"ink_spoke{i}", (0.014, 0.26, 0.002), ((x + RC[0]) / 2, (y + RC[1]) / 2, 0.009), ink, rot=(0, 0, math.radians(-90 + 60 * i) - math.pi / 2))
        k.bp_ink.append((sp, (y + RC[1]) / 2))
    k.my_mark = k.line([(ring(0)[0] + x, ring(0)[1] + y, 0.012) for x, y, z in circle(0.15, 40)], "my_mark", color=kit.WARM, radius=0.012, glow=1.6, cyclic=True)
    k.work = k.page((RC[0], RC[1], 0.008), size=(0.20, 0.28), rot=0.15, name="work", lines=7)

    # 3, 4: the reports: thick, and every one with the same seal and the same watermark
    k.reports = []
    wm = k.mat("watermark", (0.80, 0.76, 0.66), rough=0.8, emit=kit.WARM, emit_strength=0.0)
    for i in range(1, 6):
        root = kit.empty(f"report{i}", (0, 0, 0))
        kit.parent(kit.box(f"report{i}_stack", (0.17, 0.23, 0.055), (0, 0, 0.0275), paper), root)
        for j in range(5):
            kit.parent(kit.box(f"report{i}_edge{j}", (0.172, 0.232, 0.002), (0, 0, 0.008 + 0.010 * j), ink), root)
        for j in range(3):
            kit.parent(kit.box(f"report{i}_line{j}", (0.11, 0.008, 0.001), (-0.015, 0.085 - 0.022 * j, 0.0556), ink), root)
        seal = kit.parent(kit.lathe(f"report{i}_seal", [(0.0, 0.0), (0.034, 0.0), (0.034, 0.003), (0.0, 0.003)], seg=24), root)
        seal.location = (0.045, -0.075, 0.055)
        seal.data.materials.append(seal_m)
        mark = kit.parent(kit.empty(f"report{i}_wm", (-0.02, -0.02, 0.0562)), root)       # a candle, in the paper
        kit.parent(kit.box(f"report{i}_wm_body", (0.032, 0.075, 0.0006), (0, -0.02, 0), wm), mark)
        kit.parent(kit.box(f"report{i}_wm_flame", (0.024, 0.024, 0.0006), (0, 0.045, 0), wm, rot=(0, 0, math.pi / 4)), mark)
        k.reports.append((root, seal, mark))
    k.wm = wm

    # 5: the little staircase, and the nod that goes up and down it
    k.steps = []
    for j, h in enumerate((0.03, 0.06, 0.09, 0.12, 0.09, 0.06, 0.03)):
        k.steps.append((kit.box(f"step{j}", (0.08, 0.16, h), (-0.24 + 0.08 * j, 1.9, h / 2), k.wood()), h))
    k.nod = k.spark((0, 1.9, 0.2), GOLD, r=0.022, strength=2.5, name="nod")

    # 6 to 9: the counting board: a wall of forty-five tiles on wheels
    k.wall = kit.empty("wall", (0.0, WALL_Y, 0.0))
    kit.parent(kit.box("wall_back", (2.36, 0.05, 1.36), (0, 0.05, 0.94), dark), k.wall)
    kit.parent(kit.box("wall_base", (2.5, 0.34, 0.10), (0, 0.02, 0.21), k.wood()), k.wall)
    for sx in (-1, 1):
        w = kit.parent(kit.lathe(f"wall_wheel{sx}", [(0.0, -0.03), (0.13, -0.03), (0.13, 0.03), (0.0, 0.03)], seg=24), k.wall)
        w.rotation_euler, w.location = (math.pi / 2, 0, 0), (sx * 0.95, -0.17, 0.13)
        w.data.materials.append(brass)
    k.t_dim = k.mat("tile_dim", (0.22, 0.20, 0.18), rough=0.9)
    k.t_lit = k.mat("tile_lit", kit.PAPER, rough=0.8, emit=kit.WARM, emit_strength=1.3)
    k.t_ok = k.mat("tile_ok", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    k.t_red = k.mat("tile_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=1.2)
    k.tiles = []
    for i in range(COLS * ROWS):
        r, c = divmod(i, COLS)
        ob = kit.parent(kit.box(f"tile{i}", (0.20, 0.03, 0.20), ((c - 4) * 0.24, -0.02, 0.46 + (ROWS - 1 - r) * 0.24), k.t_dim), k.wall)
        k.tiles.append((ob, c, r))
    k.txt45 = k.text("45 / 45", (0.0, WALL_Y, 1.86), size=0.20, color=kit.WARM, glow=1.4, name="txt45")
    k.txt11 = k.text("11", (-1.72, WALL_Y - 0.1, 0.95), size=0.34, name="txt11")
    k.txt2 = k.text("2", (1.66, WALL_Y - 0.1, 0.95), size=0.38, color=kit.WRONG, glow=0.9, name="txt2")
    k.wall_light = k.glow_light((0.0, WALL_Y - 1.6, 1.4), kit.WARM, 0.0, 0.2, "wall_light", shadows=False)
    small = kit.lathe("small_wax", [(0.0, 0.0), (0.024, 0.0), (0.024, 0.085), (0.0, 0.09)], seg=12)
    small.data.materials.append(k.mat("small_wax", (0.93, 0.87, 0.74), rough=0.55, emit=kit.WARM, emit_strength=0.25))
    small.hide_render = True
    k.clusters = []
    for c in range(6):
        root = kit.empty(f"cluster{c}", (0, 0, 0))
        members = []
        for j in range(6):
            ob = kit.parent(bpy.data.objects.new(f"small{c}_{j}", small.data), root)
            bpy.context.scene.collection.objects.link(ob)
            ob.location = ((j % 3 - 1) * 0.09 + 0.02 * (hsh(c * 7 + j) - 0.5), -(j // 3) * 0.13, 0.0)
            fl = kit.parent(k.spark((0, 0, 0.115), (1.0, 0.55, 0.22), r=0.022, strength=2.0, name=f"small_flame{c}_{j}"), ob)
            fl.scale = (0.8, 0.8, 1.5)
            members.append(ob)
        k.clusters.append((root, members))
    k.cluster_lights = [k.glow_light((0, 0, 0.3), kit.WARM, 0.0, 0.05, f"cluster_light{c}", shadows=False) for c in range(3)]

    # 10: six of part one's compasses, and part one's field of flames behind them
    k.compass_root = kit.empty("compasses", (0, 0, 0))
    k.needles, k.hubs = [], []
    face_m, needle_m, tail_m = k.mat("compass_face", (0.30, 0.22, 0.13), rough=0.55), k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6), k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)
    for n in range(6):
        cx = (n - 2.5) * 2.3
        rim = kit.parent(kit.lathe(f"compass_rim{n}", [(CR, 0.0), (CR + 0.07, 0.0), (CR + 0.07, 0.035), (CR, 0.035)], seg=72), k.compass_root)
        rim.location = (cx, CY, 0.0)
        rim.data.materials.append(brass)
        face = kit.parent(kit.lathe(f"compass_face{n}", [(0.0, 0.0), (CR, 0.0), (CR, 0.006), (0.0, 0.006)], seg=72), k.compass_root)
        face.location = (cx, CY, 0.0)
        face.data.materials.append(face_m)
        for i in range(24):
            a = 2 * math.pi * i / 24
            big = i % 6 == 0
            kit.parent(kit.box(f"compass_tick{n}_{i}", (0.014, 0.16 if big else 0.08, 0.004), (cx + (CR - 0.11) * math.cos(a), CY + (CR - 0.11) * math.sin(a), 0.009), paper_lit, rot=(0, 0, a - math.pi / 2)), k.compass_root)
        mx, my = cx + (CR + 0.42) * math.cos(MARK), CY + (CR + 0.42) * math.sin(MARK)
        kit.parent(k.spark((mx, my, 0.30), (1.0, 0.85, 0.5), r=0.07, strength=3.0, name=f"true_mark{n}"), k.compass_root)
        kit.parent(kit.box(f"mark_post{n}", (0.02, 0.02, 0.30), (mx, my, 0.15), brass), k.compass_root)
        nd = kit.parent(kit.empty(f"needle{n}", (cx, CY, 0.05)), k.compass_root)
        kit.parent(kit.box(f"needle_point{n}", (0.78, 0.07, 0.014), (0.39, 0, 0), needle_m), nd)
        kit.parent(kit.box(f"needle_tail{n}", (0.5, 0.05, 0.014), (-0.25, 0, 0), tail_m), nd)
        k.needles.append(nd)
        k.hubs.append(k.candle((cx, CY, 0.05), f"hub{n}", height=0.13, r=0.045, watts=9.0, seed=5.0 + n))
    k.field, k.field_lights = [], []
    for i in range(360):
        row, col = divmod(i, 30)
        x = (col - 14.5) * 0.55 + 0.18 * (hsh(i) - 0.5)
        y = CY + 2.6 + row * 0.62 + 0.18 * (hsh(i + 900) - 0.5)
        k.field.append(k.spark((x, y, 0.18), (1.0, 0.55, 0.22), r=0.030, strength=1.7, name=f"field{i}"))
        if i % 45 == 20:
            k.field_lights.append(k.glow_light((x, y, 0.30), (1.0, 0.58, 0.26), 0.0, 0.05, f"field_light{i}", shadows=False))

    # 11: the seal that comes down on page after page
    k.stamp = kit.empty("stamp", (STAMP[0], STAMP[1], 0.5))
    kit.parent(kit.box("stamp_block", (0.30, 0.26, 0.10), (0, 0, 0.05), k.wood()), k.stamp)
    kit.parent(kit.box("stamp_pad", (0.20, 0.20, 0.012), (0, 0, -0.004), seal_m), k.stamp)
    hd = kit.parent(kit.lathe("stamp_handle", [(0.0, 0.10), (0.035, 0.10), (0.028, 0.20), (0.05, 0.26), (0.05, 0.30), (0.0, 0.32)], seg=20), k.stamp)
    hd.data.materials.append(k.mat("gavel_wood", (0.30, 0.15, 0.07), rough=0.4))
    k.stamped = []
    for j in range(5):
        pg = k.page((STAMP[0], STAMP[1], 0.0), size=(0.34, 0.44), name=f"stamped{j}", lines=6)
        seal = kit.parent(kit.lathe(f"stamped{j}_seal", [(0.0, 0.0), (0.085, 0.0), (0.085, 0.002), (0.0, 0.002)], seg=28), pg)
        seal.location = (0.0, 0.0, 0.0016)
        seal.data.materials.append(seal_m)
        k.stamped.append((pg, seal))

    # 12: the calipers
    k.cali = kit.empty("calipers", (CALI[0], CALI[1], 0.0))
    kit.parent(kit.box("cali_beam", (1.5, 0.035, 0.05), (0, 0, 0.40), flat), k.cali)
    for j in range(15):
        kit.parent(kit.box(f"cali_tick{j}", (0.006, 0.004, 0.022 if j % 5 else 0.036), (-0.7 + 0.1 * j, -0.02, 0.40), ink), k.cali)
    k.jaws = [kit.parent(kit.box(f"cali_jaw{s}", (0.03, 0.035, 0.32), (0, 0, 0.24), flat), k.cali) for s in (-1, 1)]
    k.cali_dial = make_dial(k, "cali_dial", (0, 0, 0.42), r=0.10)
    kit.parent(k.cali_dial[0], k.cali)

    # 13 to 16: the bench of gauges
    k.bench_light = k.glow_light((BENCH[0], BENCH[1] - 1.0, 1.1), kit.WARM, 0.0, 0.2, "bench_light", shadows=False)
    k.bench = k.table((BENCH[0], BENCH[1], BENCH_Z), size=(2.9, 0.5), name="bench", legs=BENCH_Z)
    k.dials = [make_dial(k, f"dial{j}", (BENCH[0] + (j - 3) * 0.37, BENCH[1], BENCH_Z)) for j in range(NDIAL)]

    # 17 to 20: the large object, six tools, six readings, the page and its pins
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.5, location=(RING2[0], RING2[1], 0.3))
    k.rock = bpy.context.object
    k.rock.name = "rock"
    for v in k.rock.data.vertices:
        s = 0.80 + 0.40 * hsh(v.index * 1.7 + 3.0)
        v.co = (v.co.x * s * 0.95, v.co.y * s * 0.9, max(-0.3, v.co.z * s * 0.8 + 0.08 * math.sin(v.co.x * 9.0)))
    k.rock.data.materials.append(k.mat("rock", (0.36, 0.33, 0.34), rough=0.85))
    k.tools = []
    for i, a in enumerate(SIDES):
        px, py = RING2[0] + OUT_R * math.cos(a), RING2[1] + OUT_R * math.sin(a)
        tx, ty = px - 0.20 * math.sin(a), py + 0.20 * math.cos(a)
        root = kit.empty(f"tool{i}", (tx, ty, 0.0))
        moving = None
        if i == 0:                                                           # a ruler
            kit.parent(kit.box("ruler", (0.05, 0.012, 0.36), (0, 0, 0.18), paper_lit), root)
            for j in range(7):
                kit.parent(kit.box(f"ruler_tick{j}", (0.025, 0.014, 0.004), (0.008, 0, 0.04 + 0.045 * j), ink), root)
        elif i == 1:                                                         # a balance
            kit.parent(kit.box("balance_post", (0.02, 0.02, 0.26), (0, 0, 0.13), flat), root)
            moving = kit.parent(kit.empty("balance_beam", (0, 0, 0.26)), root)
            kit.parent(kit.box("balance_bar", (0.30, 0.016, 0.016), (0, 0, 0), flat), moving)
            for s in (-1, 1):
                pan = kit.parent(kit.lathe(f"balance_pan{s}", [(0.0, 0.0), (0.05, 0.0), (0.055, 0.012), (0.0, 0.006)], seg=16), moving)
                pan.location = (s * 0.14, 0, -0.08)
                pan.data.materials.append(flat)
        elif i == 2:                                                         # a set-square
            me = bpy.data.meshes.new("square")
            me.from_pydata([(-0.14, -0.008, 0), (0.14, -0.008, 0), (-0.14, -0.008, 0.30), (-0.14, 0.008, 0), (0.14, 0.008, 0), (-0.14, 0.008, 0.30)], [],
                           [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)])
            sq = kit.parent(bpy.data.objects.new("square", me), root)
            bpy.context.scene.collection.objects.link(sq)
            sq.data.materials.append(paper_lit)
        elif i == 3:                                                         # a plumb line
            kit.parent(kit.box("plumb_post", (0.02, 0.02, 0.40), (0, 0, 0.20), flat), root)
            kit.parent(kit.box("plumb_arm", (0.16, 0.016, 0.016), (0.07, 0, 0.40), flat), root)
            moving = kit.parent(kit.empty("plumb_swing", (0.14, 0, 0.40)), root)
            kit.parent(kit.box("plumb_string", (0.005, 0.005, 0.26), (0, 0, -0.13), paper_lit), moving)
            bob = kit.parent(kit.lathe("plumb_bob", [(0.0, -0.06), (0.03, 0.0), (0.0, 0.02)], seg=16), moving)
            bob.location = (0, 0, -0.26)
            bob.data.materials.append(flat)
        elif i == 4:                                                         # a lens on a stick
            kit.parent(kit.box("lens_stick", (0.016, 0.016, 0.20), (0, 0, 0.10), k.wood()), root)
            bpy.ops.mesh.primitive_torus_add(major_radius=0.09, minor_radius=0.012, location=(0, 0, 0), rotation=(math.pi / 2, 0, 0), major_segments=28, minor_segments=8)
            tor = bpy.context.object
            tor.name = "lens_ring"
            tor.data.materials.append(flat)
            kit.parent(tor, root)
            tor.location = (0, 0, 0.29)
        else:                                                                # a measuring wheel
            kit.parent(kit.box("wheel_stick", (0.016, 0.016, 0.34), (0.0, 0, 0.21), k.wood(), rot=(0, 0.5, 0)), root)
            moving = kit.parent(kit.lathe("wheel", [(0.0, -0.012), (0.075, -0.012), (0.075, 0.012), (0.0, 0.012)], seg=20), root)
            moving.rotation_euler, moving.location = (math.pi / 2, 0, 0), (-0.08, 0, 0.075)
            moving.data.materials.append(flat)
        bar = kit.box(f"reading{i}", (0.07, 0.07, 1.0), (px + 0.20 * math.sin(a), py - 0.20 * math.cos(a), 0.0), k.mat("reading", (0.5, 0.4, 0.2), emit=GOLD, emit_strength=0.8))
        pin = kit.empty(f"pin{i}", (0, 0, 0))
        kit.parent(kit.box(f"pin{i}_post", (0.012, 0.012, 0.16), (0, 0, 0.08), flat), pin)
        kit.parent(k.spark((0, 0, 0.18), GOLD, r=0.04, strength=1.5, name=f"pin{i}_head"), pin)
        k.tools.append((root, moving, bar, pin, (px, py)))
    k.sheet = kit.box("sheet", (1.3, 0.80, 0.008), (PAGE2[0], PAGE2[1], 0.004), paper)
    k.red_pin = kit.empty("red_pin", (PAGE2[0], PAGE2[1] - 0.01, 0.008))
    kit.parent(kit.box("red_pin_post", (0.012, 0.012, 0.16), (0, 0, 0.08), flat), k.red_pin)
    kit.parent(k.spark((0, 0, 0.18), kit.WRONG, r=0.045, strength=1.1, name="red_pin_head"), k.red_pin)
    k.pin_at = [(PAGE2[0] + (i - 2.5) * 0.19, PAGE2[1] + PIN_OFF[i], 0.008) for i in range(6)]
    joined = []
    for a, b in zip(k.pin_at, k.pin_at[1:]):
        joined += [(*lerp(a, b, j / 8)[:2], 0.19) for j in range(8)]
    k.joined = k.line(joined + [(*k.pin_at[-1][:2], 0.19)], "joined", color=GOLD, radius=0.008, glow=1.6)

    # 21 to 23: one swing, then two at right angles: the knot
    k.knot = k.line(lissajous(), "knot", color=kit.PAPER, radius=0.016, glow=1.0)      # paper-coloured, as part 8 picks it up
    k.flat = k.line([(-1.0 + 2.0 * i / 20, 0.0, 0.0) for i in range(21)], "flat", color=kit.WARM, radius=0.014, glow=1.4)
    k.flat.ob.location = (FC[0], FC[1], FC[2])
    k.pen = k.spark(FC, GOLD, r=0.04, strength=3.0, name="pen")
    k.guide_h = k.line([(0, 0, 0), (1, 0, 0)], "guide_h", color=kit.WARM, radius=0.004, glow=1.0)
    k.guide_v = k.line([(0, 0, 0), (1, 0, 0)], "guide_v", color=kit.WARM, radius=0.004, glow=1.0)
    k.rail = kit.box("rail", (0.03, 0.03, FC[2] + KR + 0.35), (RAIL_X - 0.08, FC[1], (FC[2] + KR + 0.35) / 2), brass)
    k.lift = kit.box("lift", (0.20, 0.16, 0.02), (RAIL_X, FC[1], 0.0), k.wood())
    k.track = kit.box("track", (2 * KR + 0.34, 0.22, TRACK_Z), (FC[0], FC[1], TRACK_Z / 2), k.wood())


def pose(k, t):
    lane_b = t >= T_FEELS - 0.1
    compasses = T_EASY - 0.15 <= t < T_FEELS - 0.1

    # =============================================================== 1: the blueprint
    bp_on = t < T_NUMBER + 1.0
    u = ss(T_MINE + 0.2, T_MINE + 1.3, t)
    kit.show(k.bp, bp_on and u > 0.0)
    k.bp.scale = (1.0, max(0.001, u), 1.0)
    k.bp_roll.location = (0.0, 0.7 + 2.4 * u, 0.075 * (1.0 - 0.75 * u))
    k.bp_roll.scale = (1.0 - 0.75 * u,) * 2 + (1.0,)
    k.bp_roll.hide_render = not bp_on or t < T_MINE + 0.1
    for ob, y in k.bp_ink:
        ob.hide_render = not (bp_on and 0.7 + 2.4 * u > y + 0.15)
    t_hop = T_MINE + 1.7                                                           # my candle hops onto it
    k.my_mark.set(grow=ss(t_hop + 0.5, t_hop + 0.9, t) if bp_on else 0.0, glow=1.0 + 1.5 * hit(t, t_hop + 0.5, 3.0))

    # =============================================================== the six of me, picture by picture
    r0 = ring(0)
    bud = hit(t, T_COPIES + 0.45, 2.2)
    nod = ss(T_AGREED + 3.0, T_AGREED + 3.4, t) * (1.0 - ss(T_NOD, T_NOD + 0.5, t))
    beat = math.sin(2 * math.pi * (t - T_AGREED) / 0.62)
    fold = ss(T_NOD + 0.3, T_NOD + 1.3, t)
    nod2 = ss(T_NOD + 2.0, T_NOD + 2.4, t) * math.sin(2 * math.pi * (t - T_NOD) / 0.7)
    slams = [T_FEELS + 0.35 + 0.62 * j for j in range(5)]
    slam = sum(hit(t, s, 9.0) for s in slams)
    turn_out = [ss(T_ROUND + 1.3 + 0.13 * i, T_ROUND + 1.7 + 0.13 * i, t) for i in range(6)]
    s_k = 2 * math.pi * (t - T_KNOT) / KNOT_DUR                                    # the knot's own clock
    amp = lerp(0.42, KR, ss(T_LOUD + 0.2, T_LOUD + 1.4, t))
    pen_x = FC[0] + amp * math.sin(3 * s_k + math.pi / 2)
    pen_z = FC[2] + (KR * math.sin(2 * s_k) if s_k > 0.0 else 0.0)
    rise = ss(T_LOUD + 2.1, T_KNOT - 0.05, t)
    for i, c in enumerate(k.us):
        root = c.root
        if t < T_NUMBER + 0.2:                                                     # ---- on the blueprint
            if i == 0:
                a = ss(t_hop, t_hop + 0.5, t)
                x, y = lerp(ME0, r0, a)
                z = 0.22 * math.sin(a * math.pi)
                x, y = lerp((x, y), FOLD_A, fold)
                act(k, c, t, True, (x, y, z), size=1.0 + 0.9 * bud, lean=(0.30 * nod2, 0.22 * ss(T_COPIES + 3.8, T_COPIES + 4.4, t) * (1.0 - fold) + 0.20 * nod * (0.5 + 0.5 * beat)), still=0.6 * nod)
                kit.squash(root, land(t, t_hop + 0.5, 0.3), turn=0.0)
                continue
            t_i = T_COPIES + 0.75 + 0.45 * i
            a = ss(t_i, t_i + 0.55, t)
            away = ss(T_AGREED - 1.3 + 0.05 * i, T_AGREED - 0.8 + 0.05 * i, t) * (1.0 - ss(T_AGREED + 0.2 + 0.08 * i, T_AGREED + 0.9 + 0.08 * i, t))
            home = ring(i, r=RING_R + 0.85 * away)
            x, y = lerp(r0, home, a)
            z = 0.16 * math.sin(a * math.pi) + 0.05 * abs(math.sin(away * math.pi * 3.0))
            dest = FOLD_A if i >= 4 else FOLD_B
            x, y = lerp((x, y), dest, fold)
            ang = math.radians(-90 + 60 * i)
            lean_in = 0.24 * ss(T_COPIES + 3.8, T_COPIES + 4.4, t) * (1.0 - fold) + 0.20 * nod * (0.5 + 0.5 * beat)
            on = t > t_i and (fold < 1.0 or i == 1)
            act(k, c, t, on, (x, y, z), size=ss(t_i, t_i + 0.3, t), lean=(-lean_in * math.cos(ang) - 0.30 * nod2 * (1.0 if i == 1 else 0.0), -lean_in * math.sin(ang)), still=0.6 * nod)
            if on:
                kit.squash(root, land(t, t_i + 0.55, 0.25), turn=0.0)
        elif t < T_EASY - 0.15:                                                    # ---- at the wall: only me
            go = ss(T_NUMBER + 0.2, T_NUMBER + 1.6, t)
            x, y = lerp(FOLD_A, (-1.75, 4.9), go)
            act(k, c, t, i == 0, (x, y, 0.07 * abs(math.sin(go * math.pi * 5.0))), size=1.0, lean=(0.15, 0.2))
            if i == 0:
                kit.squash(root, 1.0, turn=0.0)
        elif compasses:
            act(k, c, t, False)
        elif t < T_MEASURE - 0.1:                                                  # ---- four of us hold the seal
            sx, sy = (-1, 1, -1, 1)[i % 4], (-1, -1, 1, 1)[i % 4]
            act(k, c, t, i < 4, (STAMP[0] + sx * 0.36, STAMP[1] + sy * 0.26, 0.0), size=1.0, lean=(-sx * 0.25, -sy * 0.15), still=0.5)
            if i < 4:
                kit.squash(root, 1.0 - 0.20 * min(1.0, slam), turn=0.0)
        elif t < T_GAUGE - 0.1:                                                    # ---- two of us, measured
            sx = -1 if i == 0 else 1
            act(k, c, t, i < 2, (CALI[0] + sx * 0.45, CALI[1], 0.0), size=1.0, lean=(0.0, 0.0))
            if i < 2:
                kit.squash(root, 1.0, turn=0.0)
        elif t < T_ROUND - 0.2:                                                    # ---- two of us beside the bench of gauges
            sx = -1 if i == 0 else 1
            act(k, c, t, i < 2, (BENCH[0] + sx * 1.15, BENCH[1] - 0.62, 0.0), size=1.0 - 0.35 * ss(T_NONE + 0.3, T_NONE + 0.9, t) * (1.0 - ss(T_SIMPLER, T_SIMPLER + 1.0, t)), lean=(-sx * 0.2, 0.25))
            if i < 2:
                kit.squash(root, 1.0, turn=0.0)
        elif t < T_VOICE - 0.25:                                                   # ---- the second ring; then different places
            a0 = math.radians(-90 + 60 * i)
            out = ss(T_PLACES + 0.5 + 0.12 * i, T_PLACES + 1.9 + 0.12 * i, t)
            ang = a0 + (SIDES[i] - a0) * out
            rr = lerp(0.55, OUT_R, out)
            x, y = RING2[0] + rr * math.cos(ang), RING2[1] + rr * math.sin(ang)
            face = 1.0 - 2.0 * turn_out[i]                                         # 1 = leaning in, -1 = leaning out
            work = ss(T_RUN + 0.2 + 0.4 * i, T_RUN + 0.6 + 0.4 * i, t)
            face = lerp(face, 0.7, ss(T_PLACES + 1.9, T_PLACES + 2.6, t))          # looking at the thing
            z = bounce(t, T_ROUND + 1.3 + 0.13 * i, 0.10, 0.4) + 0.07 * abs(math.sin(out * math.pi * 5.0))
            act(k, c, t, True, (x, y, z), size=1.0 + 0.3 * hit(t, T_RUN + 0.6 + 0.4 * i, 3.0), lean=(-0.34 * face * math.cos(ang), -0.34 * face * math.sin(ang)))
            kit.squash(root, land(t, T_ROUND + 1.7 + 0.13 * i, 0.2), tilt=(-0.20 * face * math.cos(ang) * (1.0 - out), -0.20 * face * math.sin(ang) * (1.0 - out)), turn=0.0)
        else:                                                                      # ---- the swings
            if i == 0:
                act(k, c, t, True, (pen_x, FC[1], TRACK_Z), size=1.0, lean=(0.0, 0.0))
                kit.squash(root, 1.0, tilt=(0.25 * math.cos(3 * s_k + math.pi / 2) * amp, 0.0), turn=0.0)
            elif i == 1:
                act(k, c, t, t > T_LOUD + 1.9, (RAIL_X, FC[1], 0.02 + (pen_z - 0.17) * rise if s_k <= 0 else pen_z - 0.15), size=ss(T_LOUD + 1.9, T_LOUD + 2.3, t), lean=(0.0, 0.0))
                kit.squash(root, 1.0, turn=0.0)
            else:
                act(k, c, t, False)

    # =============================================================== him
    if t < T_EASY - 0.15:
        to_ring = ss(T_AGREED - 0.4, T_AGREED + 0.6, t)
        to_wall = ss(T_NUMBER + 0.3, T_NUMBER + 1.8, t)
        x, y = lerp(lerp(HIM0, (1.30, 2.05), to_ring), (1.75, 5.0), to_wall)
        walk = ss(T_11 + 0.2, T_11 + 3.1, t)                                       # along the wall, turning tiles over
        if walk > 0.0:
            x, y = lerp(lerp((1.75, 5.0), (-1.05, 5.45), ss(T_11 - 0.9, T_11 + 0.2, t)), (1.1, 5.45), walk)
        elif t > T_11 - 0.9:
            x, y = lerp((1.75, 5.0), (-1.05, 5.45), ss(T_11 - 0.9, T_11 + 0.2, t))
        hop = 0.07 * abs(math.sin(to_ring * math.pi * 3.0)) + 0.08 * abs(math.sin(to_wall * math.pi * 5.0)) + 0.09 * abs(math.sin(walk * math.pi * 11.0)) \
            + 0.08 * abs(math.sin(ss(T_11 - 0.9, T_11 + 0.2, t) * math.pi * 4.0))
        doubt = ss(T_TRUST + 0.1, T_TRUST + 0.7, t) * (1.0 - ss(T_NOD, T_NOD + 0.6, t))
        act(k, k.him, t, True, (x, y, hop), size=1.0 + 0.35 * doubt + 0.4 * hit(t, T_BROKEN + 0.3, 2.0), lean=(-0.22 * (1.0 - doubt) * (1.0 - to_wall), 0.10 - 0.36 * doubt + 0.3 * to_wall), bright=1.0 + 0.9 * doubt)
        kit.squash(k.him.root, 1.0, tilt=(0.0, -0.10 * doubt), turn=0.0)
    elif T_NONE - 0.2 < t < T_ROUND - 0.2:                                         # at the bench: he clears it
        hop_on = ss(T_SIMPLER + 0.15, T_SIMPLER + 0.65, t)
        sweep = ss(T_SIMPLER + 0.9, T_SIMPLER + 3.3, t)
        x = lerp(lerp(BENCH[0] - 2.1, BENCH[0] - 1.32, hop_on), BENCH[0] + 1.25, sweep)
        z = BENCH_Z * hop_on + 0.28 * math.sin(hop_on * math.pi)
        arrive = ss(T_NONE + 0.1, T_NONE + 0.9, t)
        act(k, k.him, t, True, (x - 1.2 * (1.0 - arrive), BENCH[1] - 0.02, z + 0.06 * abs(math.sin(arrive * math.pi * 3.0))), size=1.0 + 0.3 * sweep * (1.0 - ss(T_SIMPLER + 3.3, T_SIMPLER + 4.2, t)),
            lean=(0.30 * math.sin(sweep * math.pi), 0.1), bright=1.3)
        kit.squash(k.him.root, land(t, T_SIMPLER + 0.65, 0.25), tilt=(0.22 * math.sin(sweep * math.pi), 0.0), turn=0.0)
    elif t >= T_VOICE - 0.25:                                                      # watching the knot
        act(k, k.him, t, True, (FC[0] + 0.95, FC[1] - 1.3, 0.0), size=1.0 + 0.3 * hit(t, T_KNOT + KNOT_DUR, 1.5), lean=(-0.2, 0.12))
        kit.squash(k.him.root, 1.0, turn=0.0)
    else:
        act(k, k.him, t, False)

    # =============================================================== 2 to 5: the page, the reports, the stairs
    kit.show(k.work, T_COPIES + 3.6 < t < T_NOD + 0.3)
    k.work.scale = (max(0.001, pop(t, T_COPIES + 3.6)),) * 3
    held = ss(T_TRUST + 0.5, T_TRUST + 1.4, t) * (1.0 - ss(T_NOD - 0.1, T_NOD + 0.4, t))
    if k.changed("wm", round(held, 2)):
        k.wm.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 2.2 * held
    for n, (root, seal, mark) in enumerate(k.reports):
        i = n + 1
        back = ss(T_AGREED + 0.2 + 0.08 * i, T_AGREED + 0.9 + 0.08 * i, t)
        x, y = ring(i, r=RING_R + 0.85 * (1.0 - back) - 0.26)
        z, rx, rz = 0.0, 0.0, math.radians(60 * i)
        if i in (1, 2):                                                            # he stands these two up against his light
            hx = 1.12 if i == 1 else 1.48
            x, y = lerp((x, y), (hx, 1.60), held)
            z, rx, rz = 0.26 * held + 0.10 * math.sin(held * math.pi), math.pi / 2 * held, rz * (1.0 - held)
        root.location, root.rotation_euler = (x, y, z), (rx, 0, rz)
        gone = ss(T_NOD + 0.1 + 0.05 * i, T_NOD + 0.5 + 0.05 * i, t)
        root.scale = (max(0.001, 1.0 - gone),) * 3
        kit.show(root, T_AGREED + 0.2 + 0.08 * i < t < T_NOD + 0.8)
        s = pop(t, T_AGREED + 1.5 + 0.16 * i, 0.12)
        seal.scale = (max(0.001, s),) * 3
    for j, (ob, h) in enumerate(k.steps):
        s = pop(t, T_NOD + 1.5 + 0.11 * j, 0.14) * (1.0 - ss(T_NUMBER + 0.3, T_NUMBER + 0.7, t))
        ob.scale = (0.08, 0.16, max(0.001, h * s))
        ob.location = (-0.24 + 0.08 * j, 1.9, h * s / 2)
        ob.hide_render = s <= 0.0
    ph = (t - T_NOD - 2.3) / 0.7                                                   # the nod goes up the steps and down them
    kit.show(k.nod, T_NOD + 2.3 < t < T_NUMBER + 0.3)
    if ph > 0.0:
        tri = abs((ph % 2.0) - 1.0)                                                # 1 at A, 0 at B, and back
        f = (1.0 - tri) * 6.0
        j = min(6, int(f))
        k.nod.location = (-0.24 + 0.08 * f, 1.9, (0.03, 0.06, 0.09, 0.12, 0.09, 0.06, 0.03)[j] + 0.03 + 0.05 * abs(math.sin(f * math.pi)))

    # =============================================================== 6 to 9: the wall
    wall_on = T_NUMBER + 0.15 < t < T_EASY - 0.15
    kit.show(k.wall, wall_on)
    if wall_on:
        roll = ss(T_NUMBER + 0.2, T_NUMBER + 1.7, t)
        hits = [T_SIX + 2.0, T_SIX + 3.5]
        jolt = sum(hit(t, h, 7.0) * math.sin((t - h) * 40.0) for h in hits)
        k.wall.location = ((1.0 - roll) * 7.5 + 0.02 * hit(t, T_NUMBER + 1.7, 6.0) * math.sin((t - T_NUMBER) * 30.0), WALL_Y + 0.05 * jolt, 0.0)
        k.wall.rotation_euler = (0.03 * jolt, 0, 0)
        for i, (ob, c, r) in enumerate(k.tiles):
            lit = t > T_45 + 0.25 + 0.20 * c + 0.05 * r
            flip, red = 0.0, False
            if i in CHECKED:
                t_f = T_11 + 0.35 + 0.25 * CHECKED.index(i)
                flip = ss(t_f, t_f + 0.22, t)
                if i in BROKEN:
                    flip = ss(t_f, t_f + 0.22, t) * 0.5 + 0.5 * ss(T_BROKEN + 0.1 + 0.25 * BROKEN.index(i), T_BROKEN + 0.35 + 0.25 * BROKEN.index(i), t)
                    red = flip > 0.75
            state = (lit, round(flip, 3), red, round(sum(hit(t, h, 9.0) for h in hits) * hsh(i), 2))
            if k.changed(("tile", i), state):
                ob.rotation_euler = (math.pi * flip, 0, 0)
                ob.location = ((c - 4) * 0.24, -0.02 - 0.10 * math.sin(flip * math.pi) - 0.03 * state[3], 0.46 + (ROWS - 1 - r) * 0.24)
                ob.material_slots[0].material = k.t_red if red else (k.t_ok if flip > 0.5 else (k.t_lit if lit else k.t_dim))
    k.txt45.hide_render = not (wall_on and t > T_45 + 2.4)
    k.txt45.scale = (max(0.001, pop(t, T_45 + 2.4, 0.2)),) * 3
    k.txt11.hide_render = not (wall_on and t > T_11 + 3.0)
    k.txt11.scale = (max(0.001, pop(t, T_11 + 3.0, 0.2)),) * 3
    k.txt2.hide_render = not (wall_on and t > T_BROKEN + 0.8)
    k.txt2.scale = (max(0.001, pop(t, T_BROKEN + 0.8, 0.2)),) * 3
    k.wall_light.data.energy = 60.0 if wall_on else 0.0
    charging = T_SIX - 0.1 < t < T_EASY - 0.15
    for c, (root, members) in enumerate(k.clusters):
        kit.show(root, charging)
        if not charging:
            continue
        d = 0.08 * c
        y = kf(t, [(T_SIX + 0.1 + d, 0.6), (T_SIX + 1.95, WALL_Y - 0.42), (T_SIX + 2.5, WALL_Y - 1.5), (T_SIX + 3.45, WALL_Y - 0.42), (T_SIX + 4.2, WALL_Y - 1.2), (T_11 - 0.8, WALL_Y - 1.2), (T_11, WALL_Y - 2.0)])
        root.location = ((c - 2.5) * 0.40, y, 0.0)
        cheer = ss(T_45 + 2.3, T_45 + 2.6, t) * (1.0 - ss(T_11 - 0.5, T_11, t))
        for j, ob in enumerate(members):
            run = abs(math.sin(t * 13.0 + c * 1.7 + j * 2.1)) * (0.05 if t < T_SIX + 4.2 else 0.0)
            ob.location = (ob.location[0], ob.location[1], run + 0.09 * cheer * abs(math.sin(t * 8.0 + j + c)))
    for n, li in enumerate(k.cluster_lights):
        li.location = k.clusters[n * 2 + 1][0].location[:2] + (0.3,)
        li.data.energy = 5.0 if charging else 0.0

    # =============================================================== 10: six compasses; the field behind them
    kit.show(k.compass_root, compasses)
    swing = MARK + 1.15 * math.sin((t - T_EASY) * 2.7) * ss(T_EASY + 0.2, T_EASY + 0.9, t)
    for n, (nd, hub) in enumerate(zip(k.needles, k.hubs)):
        if compasses:
            nd.rotation_euler = (0, 0, swing)
        act(k, hub, t, compasses, None, size=1.0, lean=(0.30 * math.cos(swing), 0.30 * math.sin(swing) - 0.3), still=0.6)
    if k.changed("field", compasses):
        for ob in k.field:
            ob.hide_render = not compasses
        for li in k.field_lights:
            li.data.energy = 13.0 if compasses else 0.0

    # =============================================================== 11: the seal, again and again
    stamping = lane_b and t < T_MEASURE - 0.1
    kit.show(k.stamp, stamping)
    z = 0.42
    for s in slams:
        z = min(z, 0.012 + 0.42 * min(1.0, abs(t - s) / 0.16) ** 1.6)
    k.stamp.location = (STAMP[0], STAMP[1], z)
    for j, (pg, seal) in enumerate(k.stamped):
        s = slams[j]
        arrive = 1.0 if j == 0 else ss(s - 0.46, s - 0.14, t)
        leave = ss(s + 0.14, s + 0.48, t)
        pg.location = (STAMP[0] - 1.3 * (1.0 - arrive) + 0.95 * leave + 0.012 * j * leave, STAMP[1] + 0.01 * j * leave, 0.002 + 0.003 * j * leave)
        kit.show(pg, stamping and arrive > 0.0)
        seal.hide_render = not (stamping and t >= s)

    # =============================================================== 12: the calipers
    cal_on = T_MEASURE - 0.1 <= t < T_GAUGE - 0.1
    kit.show(k.cali, cal_on)
    if cal_on:
        drop = ss(T_MEASURE + 0.25, T_MEASURE + 0.75, t)
        k.cali.location = (CALI[0], CALI[1] - 0.04, 1.2 * (1.0 - drop) ** 2 + 0.02 * hit(t, T_MEASURE + 0.75, 8.0) * math.sin((t - T_MEASURE) * 30.0))
        gap = lerp(0.03, 0.45 - 0.05, ss(T_MEASURE + 1.1, T_MEASURE + 2.0, t))
        for s, jaw in zip((-1, 1), k.jaws):
            jaw.location = (s * gap, 0, 0.24)
        q = ss(T_MEASURE + 2.0, T_MEASURE + 2.3, t)
        k.cali_dial[1].rotation_euler = (0, q * (1.1 * noise(t * 3.1, 2.0) + 0.5 * math.sin(t * 7.0)), 0)

    # =============================================================== 13 to 16: gauge after gauge
    bench_on = T_GAUGE - 0.1 <= t < T_ROUND - 0.2
    kit.show(k.bench, bench_on)
    k.bench_light.data.energy = 45.0 if bench_on else 0.0
    sweep = ss(T_SIMPLER + 0.9, T_SIMPLER + 3.3, t)
    lamp_x = lerp(BENCH[0] - 1.32, BENCH[0] + 1.25, sweep)
    for j, (root, piv) in enumerate(k.dials):
        x0 = BENCH[0] + (j - 3) * 0.37
        up = pop(t, T_GAUGE + 0.2 + 0.33 * j, 0.16)
        t0 = T_GAUGE + 0.36 + 0.33 * j
        live = 0.8 * math.sin((t - t0) * 7.0 + j) * math.exp(-(t - t0) * 0.5) + 0.5 * noise(t * 2.0, j) if t > t0 else -1.0
        t_l = T_NONE + 0.25 + 0.07 * j
        limp = ss(t_l, t_l + 0.35, t)
        ang = lerp(live, math.pi + 0.5 * math.exp(-(t - t_l) * 2.0) * math.sin((t - t_l) * 9.0) if t > t_l else math.pi, limp)
        if j in BACKWARD:
            ang -= 2 * math.pi * 1.6 * ss(T_BACK + 0.3 + 0.2 * BACKWARD.index(j), T_SIMPLER + 0.8, t) ** 0.8
        piv.rotation_euler = (0, ang, 0)
        # he reaches it: it goes off the bench
        reach = (x0 - 0.16 - (BENCH[0] - 1.32)) / 2.57
        t_k = T_SIMPLER + 0.9 + 2.4 * (0.5 - math.sin(math.asin(1.0 - 2.0 * min(1.0, max(0.0, reach))) / 3.0))
        v = max(0.0, t - t_k)
        root.location = (x0 + 1.5 * v, BENCH[1] - 0.9 * v * (0.6 + 0.8 * hsh(j)), BENCH_Z + 1.6 * v - 3.0 * v * v)
        root.rotation_euler = (-5.0 * v, 3.0 * v * (hsh(j + 3) - 0.3), 0)
        root.scale = (max(0.001, up),) * 3
        kit.show(root, bench_on and up > 0.0 and root.location[2] > -0.3)

    # =============================================================== 17 to 20: places, jobs, readings, pins
    ring2 = T_ROUND - 0.2 <= t < T_VOICE - 0.25
    drop = ss(T_PLACES + 0.15, T_PLACES + 0.6, t)
    k.rock.location = (RING2[0], RING2[1], 0.3 + 5.0 * (1.0 - drop) ** 2)
    k.rock.scale = (1.0, 1.0, land(t, T_PLACES + 0.6, 0.22, 7.0))
    k.rock.hide_render = not (ring2 and drop > 0.0)
    k.sheet.location = (PAGE2[0], PAGE2[1] - 2.5 * (1.0 - ss(T_LANDS + 0.1, T_LANDS + 0.8, t)), 0.004)
    k.sheet.hide_render = not (ring2 and t > T_LANDS + 0.1)
    for i, (root, moving, bar, pin, (px, py)) in enumerate(k.tools):
        s = pop(t, T_JOB + 0.35 + 0.36 * i, 0.16)
        root.scale = (max(0.001, s),) * 3
        kit.show(root, ring2 and s > 0.0)
        run = ss(T_RUN + 0.2 + 0.4 * i, T_RUN + 0.6 + 0.4 * i, t)
        if moving is not None:
            if i == 5:
                moving.location = (-0.08 + 0.10 * math.sin(t * 5.0) * run, 0, 0.075)
            else:
                moving.rotation_euler = (0, (0.35 if i == 1 else 0.5) * math.sin(t * (6.0 if i == 1 else 4.0)) * (0.15 + 0.85 * run), 0)
        t_r = T_RUN + 0.6 + 0.4 * i
        t_p = T_LANDS + 0.9 + 0.38 * i                                             # the reading leaves for the page
        h = READ[i] * pop(t, t_r, 0.3) * (1.0 - ss(t_p - 0.2, t_p, t))
        bar.scale = (0.07, 0.07, max(0.001, h))
        bar.location = (bar.location[0], bar.location[1], h / 2)
        bar.hide_render = not (ring2 and h > 0.002)
        a = ss(t_p, t_p + 0.7, t)
        p = lerp((bar.location[0], bar.location[1], READ[i]), k.pin_at[i], a)
        pin.location = (p[0], p[1], p[2] + 1.1 * math.sin(a * math.pi))
        pin.scale = (1.0, 1.0, land(t, t_p + 0.7, 0.4, 10.0))
        kit.show(pin, ring2 and t > t_p)
    t_red = T_LANDS + 0.9 + 0.38 * 5 + 0.9
    rs = pop(t, t_red, 0.16)
    k.red_pin.scale = (max(0.001, rs),) * 3
    kit.show(k.red_pin, ring2 and rs > 0.0)
    k.joined.set(grow=ss(T_NAME + 0.3, T_NAME + 1.5, t) if ring2 else 0.0, glow=1.0)

    # =============================================================== 21 to 23: one swing; then two: the knot
    swinging = t >= T_VOICE - 0.25
    for ob in (k.rail, k.lift, k.track):
        ob.hide_render = not swinging
    k.rail.scale = (0.03, 0.03, (FC[2] + KR + 0.35) * max(0.001, rise))
    k.rail.location = (RAIL_X - 0.13, FC[1], (FC[2] + KR + 0.35) * rise / 2)
    lift_z = (pen_z - 0.17) * rise if s_k <= 0 else pen_z - 0.17
    k.lift.location = (RAIL_X, FC[1], lift_z + 0.008)
    k.lift.hide_render = not (swinging and rise > 0.0)
    k.pen.location = (pen_x, FC[1], pen_z)
    k.pen.hide_render = not (swinging and t > T_VOICE + 0.3)
    two_point(k.guide_h, (pen_x, FC[1], TRACK_Z + 0.20), (pen_x, FC[1], pen_z))
    two_point(k.guide_v, (RAIL_X + 0.05, FC[1], pen_z), (pen_x, FC[1], pen_z))
    k.guide_h.set(grow=ss(T_VOICE + 0.3, T_VOICE + 0.8, t) if swinging else 0.0, glow=0.8)
    k.guide_v.set(grow=1.0 if (swinging and s_k > 0.0) else 0.0, glow=0.8)
    reach = lerp(0.42, KR, ss(T_LOUD + 0.5, T_LOUD + 1.7, t)) * ss(T_VOICE + 0.3, T_VOICE + 1.2, t)
    k.flat.ob.scale = (max(0.001, reach), 1.0, 1.0)
    k.flat.set(grow=1.0 if (swinging and t > T_VOICE + 0.3) else 0.0, glow=1.0 - 0.85 * ss(T_KNOT, T_KNOT + 0.8, t))
    k.knot.set(grow=min(1.0, max(0.0, s_k / (2 * math.pi))) if swinging else 0.0, glow=1.0 + 0.5 * hit(t, T_KNOT + KNOT_DUR, 1.2))

    # =============================================================== the camera
    shake = 0.0
    if t < T_TRUST - 0.2:                                                          # 1 to 3
        pos = kf(t, [(P0, (0.0, -1.5, 0.17)), (T_MINE, (0.0, -1.5, 0.30)), (T_MINE + 1.4, (0.0, -1.7, 1.7)), (T_COPIES, (0.1, -1.2, 1.6)), (T_COPIES + 4.0, (-0.2, -0.6, 1.5)),
                     (T_AGREED, (0.0, -1.1, 1.7)), (T_AGREED + 2.6, (0.3, -0.5, 1.25)), (T_TRUST - 0.2, (0.4, -0.5, 1.2))])
        look = kf(t, [(P0, (0.0, 0.0, 0.17)), (T_MINE, (0.0, 0.3, 0.15)), (T_MINE + 1.4, (0.0, 1.5, 0.0)), (T_COPIES + 4.0, (0.0, 1.8, 0.05)), (T_TRUST - 0.2, (0.2, 1.85, 0.05))])
        lens = kf(t, [(P0, 50.0), (T_MINE, 45.0), (T_MINE + 1.4, 30.0)])
    elif t < T_NOD - 0.1:                                                          # 4: the watermark
        pos = kf(t, [(T_TRUST - 0.2, (0.4, -0.5, 1.2)), (T_TRUST + 1.2, (1.25, 0.15, 0.50)), (T_NOD - 0.1, (1.28, 0.30, 0.46))])
        look = kf(t, [(T_TRUST - 0.2, (0.2, 1.85, 0.05)), (T_TRUST + 1.2, (1.25, 1.7, 0.30)), (T_NOD - 0.1, (1.28, 1.7, 0.30))])
        lens = kf(t, [(T_TRUST - 0.2, 30.0), (T_TRUST + 1.2, 45.0)])
    elif t < T_NUMBER:                                                             # 5: two of me, and the stairs
        pos = kf(t, [(T_NOD - 0.1, (1.28, 0.30, 0.46)), (T_NOD + 1.2, (0.0, 0.55, 0.50)), (T_NUMBER, (0.0, 0.75, 0.42))])
        look = kf(t, [(T_NOD - 0.1, (1.28, 1.7, 0.30)), (T_NOD + 1.2, (0.0, 1.9, 0.12)), (T_NUMBER, (0.0, 1.9, 0.10))])
        lens = 45.0
    elif t < T_EASY - 0.15:                                                        # 6 to 9: the wall
        pos = kf(t, [(T_NUMBER, (0.0, 0.75, 0.42)), (T_NUMBER + 1.6, (0.0, 1.3, 1.5)), (T_SIX, (0.0, 1.0, 1.5)), (T_SIX + 2.0, (0.3, 1.9, 1.3)), (T_45, (0.0, 1.6, 1.4)),
                     (T_45 + 3.0, (0.0, 2.1, 1.35)), (T_11, (-0.2, 2.6, 1.2)), (T_EASY - 0.15, (0.2, 2.9, 1.15))])
        look = kf(t, [(T_NUMBER, (0.0, 1.9, 0.10)), (T_NUMBER + 1.6, (0.0, WALL_Y, 0.55)), (T_45, (0.0, WALL_Y, 0.6)), (T_45 + 3.0, (0.0, WALL_Y, 0.95)), (T_11, (0.0, WALL_Y, 0.85))])
        lens = kf(t, [(T_NUMBER, 45.0), (T_NUMBER + 1.6, 28.0)])
        shake = 0.03 * (hit(t, T_SIX + 2.0, 8.0) + hit(t, T_SIX + 3.5, 8.0))
    elif compasses:                                                                # 10: six compasses
        pos = kf(t, [(T_EASY - 0.15, (-8.6, 11.3, 1.9)), (T_FEELS - 0.1, (-8.0, 11.7, 1.7))])
        look, lens = (-2.6, CY + 0.5, 0.0), 26.0
    elif t < T_MEASURE - 0.1:                                                      # 11: the seal
        pos = kf(t, [(T_FEELS - 0.1, (LB + 0.5, 0.35, 0.95)), (T_MEASURE - 0.1, (LB + 0.42, 0.45, 0.90))])
        look, lens = (LB + 0.3, STAMP[1], 0.14), 36.0
        shake = 0.016 * slam
    elif t < T_GAUGE - 0.1:                                                        # 12: the calipers
        pos = kf(t, [(T_MEASURE - 0.1, (LB, 3.0, 0.60)), (T_GAUGE - 0.1, (LB + 0.1, 3.35, 0.52))])
        look, lens = (LB, CALI[1], 0.27), 42.0
    elif t < T_ROUND - 0.2:                                                        # 13 to 16: the bench
        pos = kf(t, [(T_GAUGE - 0.1, (LB - 0.5, 6.0, 0.80)), (T_NONE, (LB, 6.1, 0.85)), (T_BACK, (LB + 0.2, 6.2, 0.82)), (T_SIMPLER, (LB, 5.7, 0.95)), (T_ROUND - 0.2, (LB + 0.3, 5.6, 1.0))])
        look, lens = kf(t, [(T_GAUGE - 0.1, (LB - 0.2, BENCH[1], 0.44)), (T_NONE, (LB, BENCH[1], 0.44)), (T_ROUND - 0.2, (LB + 0.2, BENCH[1], 0.42))]), 30.0
    elif t < T_VOICE - 0.25:                                                       # 17 to 20: the ring, the thing, the page
        pos = kf(t, [(T_ROUND - 0.2, (LB, 11.2, 1.3)), (T_PLACES, (LB, 11.0, 1.5)), (T_PLACES + 1.4, (LB, 9.9, 3.5)), (T_LANDS, (LB + 0.2, 9.7, 3.6)), (T_LANDS + 1.6, (LB, 9.2, 3.2)),
                     (T_LANDS + 3.6, (LB, 9.9, 1.9)), (T_NAME + 1.6, (LB, 10.1, 1.7))])
        look = kf(t, [(T_ROUND - 0.2, (LB, 13.0, 0.15)), (T_PLACES + 1.4, (LB, 13.1, 0.2)), (T_LANDS, (LB, 13.0, 0.2)), (T_LANDS + 1.6, (LB, 12.4, 0.1)), (T_LANDS + 3.6, (LB, 11.45, 0.05)), (T_NAME + 1.6, (LB, 11.4, 0.08))])
        lens = kf(t, [(T_ROUND - 0.2, 40.0), (T_PLACES, 40.0), (T_PLACES + 1.4, 32.0), (T_LANDS + 3.6, 36.0)])
        shake = 0.02 * hit(t, T_PLACES + 0.6, 7.0)
    else:                                                                          # 21 to 23: the swings, the knot
        pos = kf(t, [(T_VOICE - 0.25, (LB + 0.3, 16.3, 1.15)), (T_LOUD, (LB + 0.2, 16.0, 1.15)), (T_KNOT, (LB - 0.1, 15.2, 1.2)), (P1, (LB - 0.1, 14.9, 1.2))])
        look, lens = kf(t, [(T_VOICE - 0.25, (LB, FC[1], 1.05)), (T_LOUD + 1.5, (LB, FC[1], 1.1)), (T_KNOT, (LB - 0.25, FC[1], 1.20))]), 32.0
    if shake:
        pos = (pos[0] + shake * math.sin(t * 61.0), pos[1], pos[2] + shake * math.sin(t * 77.0))
    k.camera(pos, look, lens)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
