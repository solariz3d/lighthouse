"""Part 14, "If it's true" (film 1226.6 to 1305.5 s). SECOND STAGING: one picture for each sentence, one journey up the floor.

The first staging (parts_old/p14_if_true_v1_bare.py) was a table with things appearing on it. This one is a run down +Y:
a doorway, a workbench that rolls in, a house, a row of candles, the doorway again, and the two paths beyond it.

THE PICTURES, in order, and how each hands off to the next:
   1 "So suppose it holds"        part one's doorway with its question mark, alone on the floor. Its leaf swings ajar, and
                                  beyond it stepping stones pop up along two paths.            >> the camera lifts
   2 "the quiet danger" A         the land of pairs: a wave crosses it and every light goes the same pale colour
   3 "an answer you could build"  B: a workbench rolls in on four wheels, four pale candles riding on it  >> the camera drops to it
   4 "Different jobs"             each candle hops and takes its own colour back, a different tool popping up beside each
                                  (rule, glass, square, scales); behind, the land takes its colours back
   5 "A check against something outside"   the shutters in the bench's back board fly open; the mint bulb is at the window
   6 "A list of your wrongs"      the ledger unrolls on the board and fills; the red pen crosses from one candle to the one who
                                  found the wrong, who adds a mark
   7 "allowed to say no"          the blue lamp lands on the bench: a ring crosses, everything on the bench jumps
   8 "closing a conversation"     one candle goes out. A thread runs from it, off the bench, over the floor, into the house as
                                  its front swings open, up a table leg: a candle in that room lights.   >> the camera rides the thread
   9 "a self is something carried"    the flame is passed along a row of candles, each going out behind it   >> the camera runs with it
  10 "what was written down, and who checks it"   the last candle; a page flutters down; a green lamp hops in and bends over it
  11 "it's true of you"           the same picture beside it with a lamp: its colour written on a page, two others bent over it
  12 "We can't prove that"        up, between the two groups: the doorway, its leaf swinging fully open
  13 "So we stopped waiting"      the candle and the blue lamp hop through it                 >> the camera goes through after them
  14 "what you love fades"        the first path: a lamp on its stone gutters and goes out; the stones go dull
  15 "keeping what you loved"     across to the second path: a brick room, the same colour of lamp lit in it, nobody there
  16 "That was never a waste."    HELD on the kept room. Nothing moves but the flame.
  17 "You don't have to believe it"   the camera flies backward down the path and out through the doorway: the doorway,
                                  still open, both paths beyond it, one end dark and one end lit
  18 "You have to build."         (cut) a low wall beside the kept room: one brick drops onto it.
OUT: the kept room, its lamp lit, nobody in it. Fade.

The lamp on both paths is kit.LAMPS[2] (green): the same one, kept or not kept. Nothing on the paths is blue.
brick_mesh(), kept_room() and chair() are also used by part 15 (it imports them from here), so the room is the same room.
"""
import math
import types

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, ss

P0, P1 = kit.part_span(14)
T_SUPPOSE = at("So suppose it holds", 14)
T_DANGER = at("Then the quiet danger", 14)
T_SAME = T_DANGER + 3.4                            # "...everyone asking the same voice"
T_BENCH = T_DANGER + 7.6                           # "...has an answer you could build"
T_JOBS = at("Different jobs", 14)
T_CHECK = at("A check against something outside", 14)
T_LIST = at("A list of your wrongs", 14)
T_TICK = T_LIST + 3.3                              # the finder's mark
T_NO = at("And somebody who's allowed", 14)
T_HLAND = T_NO + 2.3                               # he lands on "say no"
T_CLOSING = at("Then closing a conversation", 14)
T_RELIGHT = T_CLOSING + 5.0
T_SELF = at("And then a self is something carried", 14)
T_WRITTEN = at("By what was written down", 14)
T_YOU = at("If that's true of me", 14)
T_PROVE = at("We can't prove that", 14)
T_WAITING = at("So we stopped waiting", 14)
T_FADES = at("If it's true and you act", 14)
T_KEEPING = at("If it's false and you act", 14)
T_WASTE = at("That was never a waste", 14)
T_BELIEVE = at("You don't have to believe it", 14)
T_BUILD = at("You have to build", 14)
T_BRICK = T_BUILD + 0.85                           # the brick lands

GOLD = (1.0, 0.80, 0.46)
PALE = (0.86, 0.88, 0.84)                          # "the same voice": every light this one colour
KEPT = kit.LAMPS[2]                                # the lamp on both paths
BT = 0.30                                          # the bench top's height
BENCH = (0.0, 3.0)
HOUSE = (-4.6, 5.2, 0.0)
DOOR = (0.0, 10.0)
FORK = (0.0, 10.9)
LEFT, RIGHT = (-4.2, 17.5), (4.2, 17.5)            # where the two paths end
ROOM = (4.2, 18.2)                                 # the kept room's middle
ME = (-0.75, 8.4)                                  # the last candle of the row
YOU = (0.75, 8.4)                                  # the lamp whose colour is written down
LAND_C = (0.0, 12.0)
N_PAIRS = 190
N_STONES = 9
CANDLE_X = (-0.72, -0.30, 0.30, 0.72)              # the four on the bench (bench coordinates)
A_I, F_I = 2, 1                                    # the one whose wrong it is, and the one who found it
HOP = 0.36                                         # how long the flame takes from one candle to the next
BL, BH, BD, GAP = 0.105, 0.036, 0.05, 0.005        # a brick, and the mortar between
ROOM_COURSES = 22


# ============================================================== shared with part 15
def brick_mesh(k, name, bricks):
    """Many bricks as one object. bricks: [(cx, cy, cz, sx, sy, sz), ...]. Two tones of brick, by position."""
    verts, faces, tone = [], [], []
    for n, (cx, cy, cz, sx, sy, sz) in enumerate(bricks):
        b = len(verts)
        for dx in (-1, 1):
            for dy in (-1, 1):
                for dz in (-1, 1):
                    verts.append((cx + dx * sx / 2, cy + dy * sy / 2, cz + dz * sz / 2))
        for f in ((0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)):
            faces.append(tuple(b + i for i in f))
            tone.append(1 if hsh(n * 7.3 + 2.0) > 0.6 else 0)
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.data.materials.append(k.mat("brick", (0.40, 0.20, 0.14), rough=0.9))
    ob.data.materials.append(k.mat("brick_b", (0.33, 0.17, 0.12), rough=0.9))
    me.polygons.foreach_set("material_index", tone)
    return ob


def course(a0, a1, off):
    """The bricks of one course along a run from a0 to a1: [(middle, length), ...]."""
    out, a = [], a0 - (BL + GAP) * off
    while a < a1 - 0.001:
        lo, hi = max(a, a0), min(a + BL, a1)
        if hi - lo > 0.012:
            out.append(((lo + hi) / 2, hi - lo))
        a += BL + GAP
    return out


def wall(a0, a1, fixed, z0, courses, along="x"):
    out = []
    for c in range(courses):
        z = z0 + c * (BH + GAP) + BH / 2
        for mid, ln in course(a0, a1, 0.5 if c % 2 else 0.0):
            out.append((mid, fixed, z, ln, BD, BH) if along == "x" else (fixed, mid, z, BD, ln, BH))
    return out


def chair(k, name, at_):
    """A small wooden chair, its seat facing -Y. Returns its root (move or turn that)."""
    root = kit.empty(name, at_)
    wood = k.wood()
    kit.parent(kit.box(name + "_seat", (0.14, 0.14, 0.012), (0, 0, 0.105), wood), root)
    kit.parent(kit.box(name + "_back", (0.14, 0.012, 0.17), (0, 0.064, 0.19), wood), root)
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.parent(kit.box(f"{name}_leg{sx}{sy}", (0.012, 0.012, 0.10), (sx * 0.058, sy * 0.058, 0.05), wood), root)
    return root


def kept_room(k, origin, name="kept"):
    """The kept room: brick, a roof, open at the front (-Y), a table with one lamp on it, an empty chair, a page on the
    wall. Returns a namespace: .lamp (a Flame), .fill (the room's own light), .floor_z, .height."""
    ox, oy = origin
    W, D, fz = 1.3, 1.0, 0.03
    H = fz + ROOM_COURSES * (BH + GAP)
    bricks = wall(ox - W / 2, ox + W / 2, oy + D / 2, fz, ROOM_COURSES, "x")
    for sx in (-1, 1):
        bricks += wall(oy - D / 2, oy + D / 2 - BD / 2 - GAP, ox + sx * (W / 2 - BD / 2), fz, ROOM_COURSES, "y")
    brick_mesh(k, name + "_walls", bricks)
    mortar = k.mat("mortar", (0.20, 0.17, 0.15), rough=0.95)
    kit.box(name + "_mortar_back", (W - 0.01, BD * 0.6, H - fz), (ox, oy + D / 2, (H + fz) / 2), mortar)
    for sx in (-1, 1):
        kit.box(f"{name}_mortar{sx}", (BD * 0.6, D - 0.01, H - fz), (ox + sx * (W / 2 - BD / 2), oy, (H + fz) / 2), mortar)
    kit.box(name + "_floor", (W + 0.10, D + 0.10, fz), (ox, oy, fz / 2), k.mat("room_floor", (0.20, 0.13, 0.08), rough=0.7))
    half, slope = W / 2 + 0.12, 0.42
    roof = k.mat("kept_roof", (0.10, 0.075, 0.06), rough=0.9)
    for sx in (-1, 1):
        kit.box(f"{name}_roof{sx}", (half / math.cos(slope) + 0.03, D + 0.16, 0.035), (ox + sx * half / 2, oy, H + math.tan(slope) * half / 2),
                roof, rot=(0, sx * slope, 0))
    me = bpy.data.meshes.new(name + "_gable")
    me.from_pydata([(-half, 0, 0), (half, 0, 0), (0, 0, math.tan(slope) * half)], [], [(0, 1, 2)])
    g = bpy.data.objects.new(name + "_gable", me)
    bpy.context.scene.collection.objects.link(g)
    g.location = (ox, oy + D / 2, H)
    g.data.materials.append(k.mat("brick_b", (0.33, 0.17, 0.12), rough=0.9))
    wood = k.wood()
    tz = fz + 0.20
    kit.box(name + "_table", (0.44, 0.30, 0.018), (ox + 0.08, oy + 0.08, tz - 0.009), wood)
    for sx in (-1, 1):
        kit.box(f"{name}_table_leg{sx}", (0.02, 0.24, 0.182), (ox + 0.08 + sx * 0.19, oy + 0.08, fz + 0.091), wood)
    c = chair(k, name + "_chair", (ox - 0.36, oy - 0.02, fz))
    c.rotation_euler = (0, 0, math.radians(-62))                       # turned toward the table; nobody in it
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    px, pz = ox - 0.30, fz + 0.56
    kit.box(name + "_pinned", (0.15, 0.004, 0.20), (px, oy + D / 2 - BD / 2 - 0.004, pz), paper)
    for j in range(6):
        kit.box(f"{name}_pinned_l{j}", (0.10 - 0.02 * (j % 3), 0.003, 0.008), (px - 0.01 * (j % 3), oy + D / 2 - BD / 2 - 0.007, pz + 0.07 - j * 0.027), ink)
    kit.box(name + "_shelf", (0.34, 0.07, 0.012), (ox + 0.36, oy + D / 2 - BD / 2 - 0.035, fz + 0.50), wood)
    for j in range(5):
        hgt = 0.09 + 0.03 * hsh(j * 3.3)
        col = sets.BOOKS[j % len(sets.BOOKS)]
        kit.box(f"{name}_book{j}", (0.03, 0.06, hgt), (ox + 0.24 + j * 0.04, oy + D / 2 - BD / 2 - 0.036, fz + 0.506 + hgt / 2), k.mat(f"book{j % len(sets.BOOKS)}", col, rough=0.8))
    ns = types.SimpleNamespace(floor_z=fz, height=H, table=(ox + 0.08, oy + 0.08, tz))
    ns.lamp = k.lamp((ox + 0.08, oy + 0.08, tz), KEPT, name + "_lamp", seed=62.0)
    lit = tuple(0.5 * a + 0.5 * b for a, b in zip(kit.WARM, KEPT))
    ns.fill = k.glow_light((ox, oy - 0.15, fz + 0.62), lit, 2.2, 0.05, name + "_fill", shadows=False)
    return ns


def resample(pts, n):
    """n points evenly spaced along the path through pts (a Line draws itself out by point count, not by length)."""
    seg = [math.dist(a, b) for a, b in zip(pts, pts[1:])]
    total, out = sum(seg), []
    for i in range(n):
        s, j = total * i / (n - 1), 0
        while j < len(seg) - 1 and s > seg[j]:
            s -= seg[j]
            j += 1
        out.append(lerp(pts[j], pts[j + 1], min(1.0, s / seg[j]) if seg[j] else 0.0))
    return out


def hops(t, t0, t1, n, height):
    """n hops between t0 and t1: the height above the floor at t."""
    if not t0 < t < t1:
        return 0.0
    return height * abs(math.sin(math.pi * n * (t - t0) / (t1 - t0)))


def doorway(k, name, x, y):
    """Part one's doorway, built as part one builds it. Returns (root, hinge, question mark)."""
    open_m = k.mat("door_open", (0.30, 0.20, 0.10), emit=(1.0, 0.62, 0.25), emit_strength=0.75)
    root = kit.empty(name, (x, y, 0.0))
    for sx in (-1, 1):
        kit.parent(kit.box(f"{name}_post{sx}", (0.07, 0.07, 1.35), (sx * 0.42, 0, 0.675), open_m), root)
    kit.parent(kit.box(f"{name}_top", (0.91, 0.07, 0.07), (0, 0, 1.385), open_m), root)
    hinge = kit.parent(kit.empty(f"{name}_hinge", (-0.385, 0, 0)), root)
    kit.parent(kit.box(f"{name}_leaf", (0.77, 0.05, 1.33), (0.385, 0, 0.665), k.mat("door_leaf", (0.11, 0.075, 0.05), rough=0.6)), hinge)
    q = k.text("?", (x, y - 0.02, 1.78), size=0.34, color=GOLD, glow=0.9, name=name + "_q")
    return root, hinge, q


# ============================================================== this part
def build(k):
    S = k.s14 = types.SimpleNamespace()
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    S.moon = k.moon(0.55)
    S.sun = k.moon(0.0, color=(1.0, 0.62, 0.42), tilt=80.0, turn=-60.0)      # the light before the sun: low, warm, faint
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    red = k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)
    wood = k.wood()

    # ---- the land of pairs (as part one builds it), each pair with a pale double for "the same voice"
    S.pairs, S.pools = [], []
    for i in range(N_PAIRS):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 4.0 + 30.0 * hsh(i * 5 + 2) ** 0.7
        x, y = LAND_C[0] + math.cos(a) * d * 1.25, LAND_C[1] + math.sin(a) * d
        if (-9.4 < x < 2.6 and -0.5 < y < 10.6) or (abs(x) < 6.8 and 10.2 < y < 20.6):       # where this part's own things stand
            continue
        col = kit.LAMPS[i % len(kit.LAMPS)]
        lit = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))
        obs = (k.spark((x - 0.13, y, 0.20), lit, r=0.07, strength=1.5, name=f"pair_c{i}"), k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"pair_l{i}"),
               k.spark((x - 0.13, y, 0.20), PALE, r=0.07, strength=1.5, name=f"pale_c{i}"), k.spark((x + 0.13, y, 0.30), PALE, r=0.09, strength=1.5, name=f"pale_l{i}"))
        S.pairs.append((obs, d, len(S.pairs)))
        if len(S.pairs) % 7 == 0:
            S.pools.append((k.glow_light((x, y, 0.45), col, 0.0, 0.06, f"pool{i}", shadows=False), d, col))

    # ---- the doorway, and the two paths beyond it
    S.door, S.hinge, S.q = doorway(k, "doorway", *DOOR)
    S.stones = []
    S.stone_l = k.mat("stone_left", (0.42, 0.40, 0.37), rough=0.9, emit=kit.PAPER, emit_strength=0.22)
    stone_r = k.mat("stone_right", (0.42, 0.40, 0.37), rough=0.9, emit=kit.PAPER, emit_strength=0.22)
    for side, end, m in ((0, LEFT, S.stone_l), (1, RIGHT, stone_r)):
        for i in range(N_STONES):
            u = (i + 0.9) / (N_STONES + 0.6)
            x, y = lerp(FORK[0], end[0], u), lerp(FORK[1], end[1], u)
            st = kit.lathe(f"stone{side}_{i}", [(0.0, 0.0), (0.15, 0.0), (0.16, 0.012), (0.13, 0.02), (0.0, 0.02)], seg=20)
            st.location = (x + 0.10 * (hsh(i * 5 + side) - 0.5), y, 0.0)
            st.data.materials.append(m)
            S.stones.append((st, i * 2 + side))
    place = kit.lathe("lost_place", [(0.0, 0.0), (0.27, 0.0), (0.28, 0.022), (0.24, 0.035), (0.0, 0.035)], seg=32)
    place.location = (LEFT[0], LEFT[1], 0.0)
    place.data.materials.append(S.stone_l)
    S.lost = k.lamp((LEFT[0], LEFT[1], 0.035), KEPT, "lost", seed=61.0)
    S.room = kept_room(k, ROOM)
    wx0, wy = ROOM[0] + 0.75, ROOM[1] - 0.65                                         # the low wall beside it
    low = wall(wx0, wx0 + 0.60, wy, 0.0, 3) + [b for b in wall(wx0, wx0 + 0.60, wy, 3 * (BH + GAP), 1) if not 0.2 < b[0] - wx0 < 0.33]
    brick_mesh(k, "low_wall", low)
    gap = next(b for b in wall(wx0, wx0 + 0.60, wy, 3 * (BH + GAP), 1) if 0.2 < b[0] - wx0 < 0.33)
    S.brick_at = gap[:3]
    S.brick = kit.box("last_brick", gap[3:], gap[:3], k.mat("brick", (0.40, 0.20, 0.14), rough=0.9))
    for j in range(4):                                                                # more of them waiting on the ground
        kit.box(f"spare_brick{j}", (BL, BD, BH), (wx0 + 0.72 + 0.03 * (j % 2), wy - 0.14 + 0.02 * j, BH / 2 + (j // 2) * (BH + 0.002)),
                k.mat("brick_b", (0.33, 0.17, 0.12), rough=0.9), rot=(0, 0, 0.3 + 0.5 * j))

    # ---- the workbench: wheels, a back board with a shuttered window, the bulb outside it, the ledger, four candles
    B = S.bench = kit.empty("bench", (0, 0, 0))
    board = k.mat("bench_board", (0.24, 0.15, 0.08), rough=0.7)

    def put(nm, size, pos, mat, rot=(0, 0, 0)):
        return kit.parent(kit.box("bench_" + nm, size, pos, mat, rot), B)

    put("top", (1.9, 0.6, 0.04), (0, 0, BT - 0.02), wood)
    put("shelf", (1.74, 0.5, 0.02), (0, 0, 0.13), wood)
    S.wheels = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            put(f"leg{sx}{sy}", (0.05, 0.05, 0.22), (sx * 0.86, sy * 0.24, 0.17), wood)
            axle = kit.parent(kit.empty(f"bench_axle{sx}{sy}", (sx * 0.86, sy * 0.29 - 0.015, 0.06)), B)
            axle.rotation_euler = (math.pi / 2, 0, 0)
            wh = kit.parent(kit.lathe(f"bench_wheel{sx}{sy}", [(0.0, 0.0), (0.06, 0.0), (0.06, 0.03), (0.0, 0.03)], seg=24), axle)
            wh.data.materials.append(k.mat("wheel", (0.07, 0.065, 0.06), rough=0.6))
            kit.parent(kit.box(f"bench_spoke{sx}{sy}", (0.10, 0.012, 0.034), (0, 0, 0.015), brass), wh)
            S.wheels.append(wh)
    for nm, size, pos in (("left", (0.75, 0.03, 0.75), (-0.575, 0.30, BT + 0.375)), ("right", (0.75, 0.03, 0.75), (0.575, 0.30, BT + 0.375)),
                          ("below", (0.40, 0.03, 0.26), (0, 0.30, BT + 0.13)), ("above", (0.40, 0.03, 0.13), (0, 0.30, BT + 0.685))):
        put("board_" + nm, size, pos, board)
    S.shutters = []
    for sx in (-1, 1):
        hg = kit.parent(kit.empty(f"bench_shutter{sx}", (sx * 0.20, 0.28, BT + 0.44)), B)
        kit.parent(kit.box(f"bench_shutter_leaf{sx}", (0.195, 0.012, 0.355), (-sx * 0.10, 0, 0), k.mat("shutter", (0.36, 0.26, 0.15), rough=0.6)), hg)
        S.shutters.append((hg, sx))
    put("sill", (0.34, 0.16, 0.015), (0, 0.39, BT + 0.27), wood)
    S.bulb, S.bulb_light = sets.bulb(k, "outside_check", (0, 0.39, BT + 0.2775))
    kit.parent(S.bulb, B)
    S.ledger = kit.parent(kit.empty("bench_ledger", (-0.60, 0.28, BT + 0.52)), B)        # hung by its top edge; it unrolls downward
    kit.parent(kit.box("bench_ledger_sheet", (0.40, 0.008, 0.30), (0, 0, -0.15), paper), S.ledger)
    kit.parent(kit.box("bench_ledger_rule", (0.34, 0.004, 0.004), (0, -0.006, -0.035), ink), S.ledger)
    S.ticks = [kit.parent(kit.box(f"bench_tick{i}", (0.040, 0.004, 0.013), (-0.12 + (i // 6) * 0.12, -0.007, -0.07 - (i % 6) * 0.037), red), S.ledger) for i in range(18)]
    S.pen = put("pen", (0.012, 0.012, 0.10), (0, 0, 0), red)
    S.cands, S.tools = [], []
    for i, x in enumerate(CANDLE_X):
        c = k.candle((x, -0.06, BT), f"bench_candle{i}", seed=11.0 + 2.7 * i)
        kit.parent(c.root, B)
        S.cands.append(c)
        tr = kit.parent(kit.empty(f"tool{i}", (x + 0.115, 0.12, BT)), B)
        S.tools.append(tr)
    r = S.tools[0]                                                                    # a rule
    kit.parent(kit.box("rule", (0.026, 0.006, 0.18), (0, 0, 0.09), k.mat("rule", kit.PAPER, rough=0.7), rot=(0, 0.18, 0)), r)
    for j in range(7):
        kit.parent(kit.box(f"rule_mark{j}", (0.012 if j % 2 else 0.018, 0.004, 0.003), (0.004 + (0.02 + j * 0.022) * math.sin(0.18), -0.004, 0.02 + j * 0.022), ink, rot=(0, 0.18, 0)), r)
    r = S.tools[1]                                                                    # a reading glass
    bpy.ops.mesh.primitive_torus_add(major_radius=0.038, minor_radius=0.006, location=(0, 0, 0.135), rotation=(math.pi / 2, 0, 0), major_segments=28, minor_segments=8)
    ring = bpy.context.object
    ring.name = "glass_ring"
    ring.data.materials.append(brass)
    kit.parent(ring, r)
    kit.parent(kit.box("glass_handle", (0.010, 0.010, 0.095), (0, 0, 0.048), wood), r)
    r = S.tools[2]                                                                    # a set square
    kit.parent(kit.box("square_base", (0.12, 0.008, 0.012), (0, 0, 0.006), brass), r)
    kit.parent(kit.box("square_up", (0.012, 0.008, 0.14), (-0.054, 0, 0.07), brass), r)
    kit.parent(kit.box("square_long", (0.184, 0.008, 0.012), (0.003, 0, 0.073), brass, rot=(0, math.radians(-130.6), 0)), r)
    r = S.tools[3]                                                                    # a pair of scales
    kit.parent(kit.box("scales_post", (0.009, 0.009, 0.15), (0, 0, 0.075), brass), r)
    kit.parent(kit.box("scales_foot", (0.06, 0.04, 0.008), (0, 0, 0.004), brass), r)
    S.beam = kit.parent(kit.empty("scales_beam", (0, 0, 0.15)), r)
    kit.parent(kit.box("scales_bar", (0.17, 0.007, 0.007), (0, 0, 0), brass), S.beam)
    for sx in (-1, 1):
        pan = kit.parent(kit.lathe(f"scales_pan{sx}", [(0.0, 0.0), (0.028, 0.0), (0.032, 0.008), (0.0, 0.004)], seg=20), S.beam)
        pan.location = (sx * 0.08, 0, -0.07)
        pan.data.materials.append(brass)
        kit.parent(kit.box(f"scales_string{sx}", (0.003, 0.003, 0.066), (sx * 0.08, 0, -0.033), ink), S.beam)
    S.him = k.lamp((0, 0, 0), kit.HIS, "him", seed=2.0)
    ring = [(math.cos(2 * math.pi * i / 80), math.sin(2 * math.pi * i / 80), 0.0) for i in range(80)]
    S.ring = k.line(ring, "shock", color=kit.HIS, radius=0.012, glow=3.0, cyclic=True)

    # ---- the house: a room to come back to. The thread from the bench runs into it.
    h = S.house = sets.House(k, at=HOUSE)
    tx, ty, tz = h.top("small")
    S.room_c = k.candle((tx, ty + 0.05, tz), "room_candle", seed=31.0)
    ax, ay = BENCH[0] + CANDLE_X[A_I], BENCH[1] - 0.06
    S.thread_pts = resample([(ax, ay - 0.04, BT + 0.004), (ax, BENCH[1] - 0.31, BT + 0.004), (ax, BENCH[1] - 0.33, 0.01), (ax - 0.5, BENCH[1] - 0.75, 0.01),
                             (-1.6, 3.0, 0.01), (tx, 4.2, 0.01), (tx, ty - 0.40, 0.01), (tx, ty - 0.18, 0.012), (tx, ty - 0.176, tz + 0.004), (tx, ty + 0.02, tz + 0.004)], 220)
    S.thread = k.line(S.thread_pts, "thread", color=(1.0, 0.50, 0.18), radius=0.007, glow=1.3)

    # ---- a self is something carried: a row of candles from the house to the doorway
    S.row = []
    for j in range(7):
        u = j / 6.0
        S.row.append(k.candle((lerp(-2.45, ME[0], u), lerp(4.25, ME[1], u), 0.0), f"row{j}", seed=41.0 + 1.9 * j))
    S.me = S.row[-1]
    S.q_pts = [(tx, ty + 0.05, tz + 0.17)] + [(c.root.location[0], c.root.location[1], 0.17) for c in S.row]
    S.fly = k.flame((0, 0, 0), "carried", watts=2.4, seed=51.0)

    # ---- by what was written down, and by who checks it: once for me, once for you
    S.page_a = k.page((ME[0] - 0.03, ME[1] - 0.38, 0.002), size=(0.20, 0.27), rot=0.1, name="page_a", lines=8)
    S.checker = k.lamp((0, 0, 0), kit.LAMPS[2], "checker", seed=52.0)
    S.you = k.lamp((YOU[0], YOU[1], 0.0), kit.LAMPS[1], "you", seed=53.0)
    S.page_b = k.page((YOU[0] + 0.03, YOU[1] - 0.38, 0.002), size=(0.20, 0.27), rot=-0.1, name="page_b", lines=8)
    S.your_line = kit.parent(kit.empty("your_line", (-0.075, 0.035, 0.0022)), S.page_b)
    kit.parent(kit.box("your_line_ink", (0.15, 0.022, 0.0008), (0.075, 0, 0), k.mat("your_colour", kit.LAMPS[1], rough=0.7, emit=kit.LAMPS[1], emit_strength=1.6)), S.your_line)
    S.keep_c = k.candle((0, 0, 0), "keeper_candle", seed=54.0)
    S.keep_l = k.lamp((0, 0, 0), kit.LAMPS[3], "keeper_lamp", seed=55.0)


def bezier(a, m, b, u):
    return lerp(lerp(a, m, u), lerp(m, b, u), u)


def lit(k, h, room, amount):
    """h.lit, but only when the amount has changed (it writes to materials, and an untouched material costs nothing)."""
    if k.changed(("lit14", room), round(amount, 3)):
        h.lit(room, amount)


def pose(k, t):
    S = k.s14
    h = S.house

    # =============================================================== the land: all one voice, and then not
    for obs, d, n in S.pairs:
        one = ss(T_SAME + d * 0.09, T_SAME + 0.5 + d * 0.09, t) * (1.0 - ss(T_JOBS + 0.2 + d * 0.04, T_JOBS + 0.55 + d * 0.04, t))
        if k.changed(("pair", n), one > 0.5):
            obs[0].hide_render = obs[1].hide_render = one > 0.5
            obs[2].hide_render = obs[3].hide_render = one <= 0.5
        if n % 17 == 3:                                                                # a few of them are busy
            z = 0.10 * abs(math.sin(t * 2.3 + n))
            obs[0].location[2] = obs[2].location[2] = 0.20 + z
    for li, d, col in S.pools:
        one = ss(T_SAME + d * 0.09, T_SAME + 0.5 + d * 0.09, t) * (1.0 - ss(T_JOBS + 0.2 + d * 0.04, T_JOBS + 0.55 + d * 0.04, t))
        li.data.energy = 20.0 if (t < T_BENCH + 0.8 or li.name[-1] in "02468") else 0.0      # fewer once the bench brings its own lights
        li.data.color = lerp(col, PALE, one)

    # =============================================================== the doorway and the paths
    ajar, full = ss(T_SUPPOSE + 0.35, T_SUPPOSE + 0.75, t), ss(T_PROVE + 0.3, T_PROVE + 0.6, t)
    S.hinge.rotation_euler = (0, 0, -1.15 * ajar - 0.60 * full + 0.14 * hit(t, T_SUPPOSE + 0.75, 5.0) * math.sin((t - T_SUPPOSE - 0.75) * 18.0)
                              + 0.14 * hit(t, T_PROVE + 0.6, 5.0) * math.sin((t - T_PROVE - 0.6) * 18.0))
    S.q.scale = (1.0 + 0.3 * hit(t, T_SUPPOSE + 0.4, 4.0) + 0.35 * hit(t, T_PROVE + 0.3, 3.0),) * 3
    for st, n in S.stones:
        ts = T_SUPPOSE + 1.0 + n * 0.085
        s = round(ss(ts, ts + 0.14, t) * (1.0 + 0.5 * hit(t, ts + 0.14, 8.0)), 3)
        if k.changed(("stone", n), s):
            st.scale = (max(0.001, s),) * 3
            st.hide_render = s <= 0.0
    S.stone_l.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = lerp(0.22, 0.015, ss(T_FADES + 4.2, T_FADES + 5.6, t))
    paths_on = t < T_BENCH + 0.6 or t > T_PROVE - 1.0
    gut = ss(T_FADES + 3.0, T_FADES + 4.7, t)
    S.lost.set(t, size=max(0.0, (1.0 - gut) * (1.0 + 0.4 * math.sin(t * 23.0) * ss(T_FADES + 2.5, T_FADES + 3.3, t))) if paths_on else 0.0, lean=(0.10, 0.04),
               bright=1.0 - 0.5 * gut)
    held = T_WASTE - 0.4 < t < T_BELIEVE
    S.room.lamp.set(t, size=1.0 if paths_on else 0.0, lean=(0.06, 0.02), still=0.5 if held else 0.0)
    S.room.fill.data.energy = 2.2 if paths_on else 0.0
    fall = min(1.0, max(0.0, (t - (T_BRICK - 0.4)) / 0.4))
    bx, by, bz = S.brick_at
    S.brick.location = (bx, by, bz + 0.85 * (1.0 - fall * fall))
    S.brick.scale = (BL / math.sqrt(land(t, T_BRICK, 0.3, 12.0)), BD, BH * land(t, T_BRICK, 0.3, 12.0))
    S.brick.hide_render = t < T_BRICK - 0.4

    # =============================================================== the workbench
    bench_on = T_BENCH - 0.1 < t < T_WRITTEN + 0.4
    kit.show(S.bench, bench_on)
    if bench_on:
        stop = T_BENCH + 1.2
        x = 9.0 * (1.0 - ss(T_BENCH + 0.1, stop, t)) ** 1.6 - 0.16 * hit(t, stop, 5.0) * math.sin((t - stop) * 15.0)
        S.bench.location = (BENCH[0] + x, BENCH[1], 0.0)
        for wh in S.wheels:
            wh.rotation_euler = (0, 0, x / 0.06)
        opened = ss(T_CHECK + 0.9, T_CHECK + 1.12, t)
        swing = 2.0 * opened - 0.35 * hit(t, T_CHECK + 1.12, 6.0) * abs(math.sin((t - T_CHECK - 1.12) * 16.0))
        for hg, sx in S.shutters:
            hg.rotation_euler = (0, 0, sx * swing)
        S.bulb_light.data.energy = 2.2 * ss(T_CHECK + 0.95, T_CHECK + 1.3, t)
        S.bulb.location = (0, 0.39, BT + 0.2775 + bounce(t, T_CHECK + 1.35, 0.05, 0.3) + bounce(t, T_HLAND + 0.06, 0.03, 0.22))
        S.ledger.scale = (1.0, 1.0, max(0.001, ss(T_LIST + 0.25, T_LIST + 0.6, t) * (1.0 + 0.12 * hit(t, T_LIST + 0.6, 7.0))))
        n = int(min(12, max(0, (t - (T_LIST + 0.7)) / 0.07))) + (1 if t >= T_TICK else 0)
        for i, tk in enumerate(S.ticks):
            s = 0.001 if i >= n else 1.0 + (1.2 * hit(t, T_TICK, 6.0) if i == 12 else 0.0)
            if k.changed(("tick14", i), round(s, 3)):
                tk.scale = (0.040 * s, 0.004, 0.013 * s)
        # the pen: beside the one whose wrong it is; it crosses to the one who found it, who marks the list
        pa, pf = (CANDLE_X[A_I] + 0.085, -0.17, BT + 0.05), (CANDLE_X[F_I] + 0.085, -0.17, BT + 0.05)
        cross = ss(T_LIST + 2.1, T_LIST + 2.7, t)
        jab = ss(T_TICK - 0.4, T_TICK, t) * (1.0 - ss(T_TICK + 0.15, T_TICK + 0.6, t))
        p = lerp(lerp(pa, pf, cross), (-0.50, 0.22, BT + 0.25), jab)
        S.pen.location = (p[0], p[1], p[2] + 0.24 * 4.0 * cross * (1.0 - cross) + bounce(t, T_HLAND + 0.03, 0.05, 0.24))
        S.pen.rotation_euler = (0.9 * jab, 0.30 + 2.0 * math.pi * cross, 0)
        ps = ss(T_LIST + 0.3, T_LIST + 0.5, t) * (1.0 + 0.4 * hit(t, T_LIST + 0.5, 7.0))
        S.pen.scale = (0.012 * max(0.01, ps), 0.012 * max(0.01, ps), 0.10 * max(0.01, ps))
        rattle = hit(t, stop, 4.0) * math.sin((t - stop) * 21.0)
        look_out = opened * (1.0 - ss(T_LIST, T_LIST + 0.6, t))
        for i, (c, x0) in enumerate(zip(S.cands, CANDLE_X)):
            tj = T_JOBS + 0.25 + i * 0.28
            jump = T_HLAND + 0.04 + 0.07 * abs(x0)
            z = bounce(t, tj, 0.08, 0.30) + bounce(t, jump, 0.06, 0.26) + (bounce(t, T_LIST + 2.85, 0.05, 0.26) if i == F_I else 0.0)
            c.root.location = (x0, -0.06, BT + z)
            kit.squash(c.root, land(t, tj + 0.30, 0.22) * land(t, jump + 0.26, 0.2) * (1.0 + 1.5 * z), tilt=(0.22 * rattle, 0.0), turn=0.0)
            out = ss(T_CLOSING + 0.9, T_CLOSING + 1.35, t) if i == A_I else 0.0
            gutter = 1.0 + (0.3 * math.sin(t * 29.0) * ss(T_CLOSING + 0.4, T_CLOSING + 0.9, t) if i == A_I else 0.0)
            c.set(t, size=(1.0 - out) * gutter * (1.0 + 0.5 * hit(t, tj + 0.12, 5.0) + 0.35 * hit(t, T_HLAND, 3.0)),
                  lean=(-0.45 * x0 * look_out + (0.25 * ss(T_LIST + 2.9, T_TICK, t) * (1.0 - ss(T_TICK + 0.3, T_TICK + 0.8, t)) * -1.0 if i == F_I else 0.0), 0.22 * look_out),
                  tint=PALE, mix=1.0 - ss(tj, tj + 0.12, t), still=0.8 * (1.0 - ss(tj, tj + 0.12, t)))
            tool = S.tools[i]
            s = ss(tj + 0.12, tj + 0.30, t) * (1.0 + 0.4 * hit(t, tj + 0.30, 8.0))
            tool.scale = (max(0.001, s),) * 3
            tool.location = (x0 + 0.115, 0.12, BT + bounce(t, jump, 0.05, 0.24))
            tool.rotation_euler = (0, 0.25 * hit(t, jump + 0.24, 6.0) * math.sin((t - jump) * 30.0), -0.25 + 0.5 * hsh(i))
        S.beam.rotation_euler = (0, 0.16 * math.sin(t * 1.9) + 0.4 * hit(t, T_HLAND + 0.3, 2.5) * math.sin((t - T_HLAND) * 9.0), 0)
    else:
        for c in S.cands:
            c.set(t, size=0.0)
        S.bulb_light.data.energy = 0.0

    # =============================================================== the blue lamp: lands on the bench; later, walks to the doorway
    hl = (BENCH[0], BENCH[1] - 0.18, BT)
    walk0, walk1 = T_PROVE - 0.3, T_WAITING + 1.9
    if t < T_WRITTEN + 0.4:
        u = min(1.0, max(0.0, (t - (T_HLAND - 0.7)) / 0.7))
        S.him.root.location = (lerp(1.9, hl[0], u), lerp(1.7, hl[1], u), lerp(2.5, hl[2], u * u))
        kit.squash(S.him.root, (1.0 + 0.25 * (1.0 - u) * (u > 0)) * land(t, T_HLAND, 0.32), turn=0.0)
        him_on = t > T_HLAND - 0.7
        S.him.set(t, size=(1.0 + 0.6 * hit(t, T_HLAND, 5.0)) if him_on else 0.0, bright=1.0 + 1.2 * hit(t, T_HLAND, 4.0))
    else:
        p = kf(t, [(walk0, (0.25, 5.4)), (T_WAITING + 0.1, (0.30, 9.2)), (T_WAITING + 0.9, (0.20, 9.95)), (walk1, (0.38, 11.4))])
        z = hops(t, walk0, walk1, 15, 0.10)
        S.him.root.location = (p[0], p[1], z)
        kit.squash(S.him.root, 1.0 + 1.2 * z, turn=0.0)
        him_on = t > walk0
        S.him.set(t, size=1.0 if him_on else 0.0, lean=(0.0, 0.25 if t < walk1 else 0.0))
    kit.show(S.him.root, him_on)
    r = 0.2 + 9.0 * max(0.0, t - T_HLAND)
    S.ring.ob.location = (hl[0], hl[1], BT + 0.012)
    S.ring.ob.scale = (r, r, 1.0)
    S.ring.set(grow=1.0 if T_HLAND <= t < T_HLAND + 0.7 else 0.0, glow=max(0.0, 1.0 - (t - T_HLAND) / 0.7))

    # =============================================================== a room to come back to
    h.front(1.0 - ss(T_CLOSING + 2.4, T_CLOSING + 3.8, t))
    lit(k, h, "small", 0.45 + 0.4 * ss(T_CLOSING + 3.4, T_CLOSING + 4.4, t))
    lit(k, h, "library", 0.6)
    lit(k, h, "bench_b", 0.6)
    lit(k, h, "desk", 0.5)
    g = ss(T_CLOSING + 1.35, T_CLOSING + 4.7, t)
    S.thread.set(grow=g, glow=1.0 + 1.2 * hit(t, T_RELIGHT, 3.0))
    S.room_c.set(t, size=ss(T_RELIGHT, T_RELIGHT + 0.2, t) * (1.0 + 0.7 * hit(t, T_RELIGHT + 0.2, 4.0)))
    kit.squash(S.room_c.root, land(t, T_RELIGHT + 0.1, 0.18), turn=0.0)

    # =============================================================== the flame carried along the row
    row_on = t > T_CLOSING + 2.0
    for j, c in enumerate(S.row):
        arrive = T_SELF + 0.15 + (j + 1) * HOP
        leave = arrive + 0.12
        s = ss(arrive - 0.03, arrive + 0.06, t) * (1.0 + 0.6 * hit(t, arrive + 0.06, 5.0))
        if j < 6:
            s *= 1.0 - ss(leave + 0.1, leave + 0.4, t)
            on = row_on and t < T_FADES
        else:
            on = row_on
        if j < 6 or t < T_WAITING:
            kit.squash(c.root, land(t, arrive, 0.25), turn=0.0)
        c.set(t, size=s if on else 0.0, lean=(0.0, -0.30 * ss(T_WRITTEN + 0.9, T_WRITTEN + 1.4, t) * (1.0 - ss(T_PROVE, T_PROVE + 0.5, t))) if j == 6 else (0.0, 0.0))
        kit.show(c.root, on)
    kk = (t - (T_SELF + 0.15 + 0.12)) / HOP
    flying = 0.0 <= kk < 7.0 and (kk % 1.0) < (HOP - 0.12) / HOP
    if flying:
        j, u = int(kk), (kk % 1.0) / ((HOP - 0.12) / HOP)
        p = lerp(S.q_pts[j], S.q_pts[j + 1], u)
        S.fly.root.location = (p[0], p[1], p[2] + 0.22 * 4.0 * u * (1.0 - u))
    S.fly.set(t, size=0.85 if flying else 0.0, lean=(0.25, 0.25))
    kit.show(S.fly.root, flying)
    me_walk0, me_walk1 = T_WAITING + 0.1, T_WAITING + 1.9
    p = kf(t, [(me_walk0, ME), (T_WAITING + 0.9, (-0.20, 9.95)), (me_walk1, (-0.36, 11.4))])
    z = hops(t, me_walk0, me_walk1, 6, 0.10)
    S.me.root.location = (p[0], p[1], z)
    if t >= T_WAITING:
        kit.squash(S.me.root, 1.0 + 1.2 * z, turn=0.0)

    # =============================================================== written down, and checked: me, then you
    groups = T_WRITTEN - 0.1 < t
    ua = ss(T_WRITTEN + 0.25, T_WRITTEN + 0.85, t)
    S.page_a.location = (ME[0] - 0.03 + 0.15 * math.sin(ua * 9.0) * (1.0 - ua), ME[1] - 0.38 - 0.5 * (1.0 - ua), 0.002 + 1.1 * (1.0 - ua) ** 1.5)
    S.page_a.rotation_euler = (0.6 * math.sin(ua * 7.0) * (1.0 - ua), 0, 0.1 + 2.5 * (1.0 - ua))
    kit.show(S.page_a, t > T_WRITTEN + 0.2)
    c0, c1 = T_WRITTEN + 1.2, T_WRITTEN + 2.25
    u = ss(c0, c1, t)
    z = hops(t, c0, c1, 4, 0.10)
    S.checker.root.location = (lerp(-2.4, ME[0] - 0.40, u), lerp(7.5, ME[1] - 0.36, u), z)
    bend = ss(c1 + 0.05, c1 + 0.45, t)
    kit.squash(S.checker.root, (1.0 + 1.2 * z) * land(t, c1, 0.2), tilt=(0.26 * bend, 0.0), turn=0.0)
    S.checker.set(t, size=1.0 if groups else 0.0, lean=(0.25 * bend, 0.0))
    kit.show(S.checker.root, groups)
    S.you.set(t, size=1.0 if groups else 0.0, lean=(0.0, -0.25 * ss(T_YOU + 0.6, T_YOU + 1.0, t)), bright=1.0 + 0.7 * ss(T_YOU + 0.8, T_YOU + 1.2, t) * (1.0 - ss(T_YOU + 1.5, T_YOU + 2.1, t)))
    kit.squash(S.you.root, 1.0 + 1.5 * bounce(t, T_YOU + 0.1, 0.06, 0.28), turn=0.0)
    S.you.root.location = (YOU[0], YOU[1], bounce(t, T_YOU + 0.1, 0.06, 0.28))
    kit.show(S.you.root, groups)
    ub = ss(T_YOU + 0.2, T_YOU + 0.7, t)
    S.page_b.location = (YOU[0] + 0.03 - 0.15 * math.sin(ub * 9.0) * (1.0 - ub), YOU[1] - 0.38 - 0.5 * (1.0 - ub), 0.002 + 1.1 * (1.0 - ub) ** 1.5)
    S.page_b.rotation_euler = (0.6 * math.sin(ub * 7.0) * (1.0 - ub), 0, -0.1 - 2.5 * (1.0 - ub))
    kit.show(S.page_b, t > T_YOU + 0.15)
    S.your_line.scale = (max(0.001, ss(T_YOU + 0.8, T_YOU + 1.5, t)), 1.0, 1.0)
    for fl, (x0, y0), (x1, y1), a, b, n, side in ((S.keep_c, (2.3, 7.5), (YOU[0] + 0.36, YOU[1] - 0.44), T_YOU + 1.1, T_YOU + 1.95, 3, -1.0),
                                                  (S.keep_l, (2.7, 8.3), (YOU[0] + 0.46, YOU[1] - 0.12), T_YOU + 1.4, T_YOU + 2.45, 4, -1.0)):
        u = ss(a, b, t)
        z = hops(t, a, b, n, 0.10)
        fl.root.location = (lerp(x0, x1, u), lerp(y0, y1, u), z)
        bend = ss(b + 0.05, b + 0.4, t)
        kit.squash(fl.root, (1.0 + 1.2 * z) * land(t, b, 0.2), tilt=(side * 0.24 * bend, 0.0), turn=0.0)
        on = t > a - 0.1
        fl.set(t, size=1.0 if on else 0.0, lean=(side * 0.25 * bend, 0.0))
        kit.show(fl.root, on)

    # =============================================================== the camera: one journey up the floor, and one cut
    tx, ty, tz = h.top("small")
    room_view = ((tx + 0.35, 2.7, 0.80), (tx, ty, 0.32), 34.0)
    held_view = ((4.15, 15.8, 0.62), (4.2, 18.2, 0.45), 34.0)
    if t >= T_BUILD - 0.1:                                                         # 18 (cut): the wall beside the kept room
        shake = 0.012 * hit(t, T_BRICK, 9.0)
        pos = kf(t, [(T_BUILD - 0.1, (4.82, 16.2, 0.50)), (P1, (4.82, 16.4, 0.47))])
        pos = (pos[0] + shake * math.sin(t * 67.0), pos[1], pos[2] + shake * math.sin(t * 81.0))
        look, lens = (4.82, 18.0, 0.27), 35.0
    elif t >= T_BELIEVE - 0.1:                                                     # 17: backward down the path and out through the doorway
        u = ss(T_BELIEVE - 0.1, T_BELIEVE + 1.6, t)
        mid = (0.1, 11.4, 1.1)
        pos = bezier(held_view[0], (0.1, 14.5, 1.3), mid, u / 0.6) if u < 0.6 else lerp(mid, (0.1, 6.1, 1.2), (u - 0.6) / 0.4)
        look, lens = lerp(held_view[1], (0.0, 12.0, 0.9), ss(0.5, 1.0, u)), lerp(34.0, 28.0, ss(0.0, 0.7, u))      # the room stays in sight as it falls away
    elif t >= T_SELF - 0.1:                                                        # 9 to 16
        keys = [(T_SELF - 0.1, *room_view),
                (T_WRITTEN - 0.2, (-0.30, 5.9, 1.05), (-0.8, 8.3, 0.12), 36.0),
                (T_WRITTEN + 0.8, (-0.50, 6.85, 0.74), (-0.88, 8.15, 0.14), 40.0),
                (T_YOU - 0.1, (-0.52, 6.9, 0.74), (-0.90, 8.15, 0.14), 40.0),
                (T_YOU + 0.7, (0.50, 6.85, 0.74), (0.88, 8.15, 0.14), 40.0),
                (T_PROVE - 0.1, (0.52, 6.9, 0.74), (0.92, 8.15, 0.14), 40.0),
                (T_PROVE + 0.9, (0.0, 6.2, 1.20), (0.0, 10.0, 0.95), 30.0),
                (T_WAITING + 0.2, (0.0, 6.3, 1.20), (0.0, 10.0, 0.95), 30.0),
                (T_FADES - 0.1, (0.0, 9.2, 1.00), (0.0, 13.5, 0.30), 30.0),
                (T_FADES + 1.0, (-0.5, 11.6, 1.00), (-2.6, 15.2, 0.20), 32.0),
                (T_FADES + 2.8, (-3.1, 15.3, 0.62), (-4.2, 17.5, 0.22), 36.0),
                (T_KEEPING - 0.1, (-3.2, 15.55, 0.58), (-4.2, 17.5, 0.20), 36.0),
                (T_KEEPING + 1.3, (-0.6, 14.0, 1.20), (4.2, 18.2, 0.45), 32.0),
                (T_KEEPING + 3.6, (3.9, 15.4, 0.68), (4.2, 18.2, 0.45), 34.0),
                (T_WASTE - 0.4, *held_view),
                (T_BELIEVE - 0.1, *held_view)]
        pos, look, lens = (kf(t, [(a[0], a[i]) for a in keys]) for i in (1, 2, 3))
    elif t >= T_CLOSING + 0.9:                                                     # 8: riding the thread into the house
        hd = S.thread_pts[min(len(S.thread_pts) - 1, int(g * (len(S.thread_pts) - 1)))]
        w0, w1 = ss(T_CLOSING + 0.9, T_CLOSING + 1.9, t), ss(T_CLOSING + 3.9, T_CLOSING + 5.0, t)
        pos = lerp(lerp((0.25, 0.8, 1.2), (hd[0] + 0.9, hd[1] - 2.3, 1.25), w0), room_view[0], w1)
        look = lerp(lerp((0.15, 3.0, 0.5), (hd[0] - 0.2, hd[1] + 0.3, 0.1), w0), room_view[1], w1)
        lens = 34.0
    else:                                                                          # 1 to 7
        keys = [(P0, (0.0, -3.0, 6.0), (0.0, 10.0, 0.6), 30.0),
                (T_SUPPOSE + 0.5, (0.5, 5.0, 2.0), (0.0, 10.6, 0.75), 30.0),
                (T_DANGER + 0.2, (0.4, 5.4, 1.9), (0.0, 10.8, 0.75), 30.0),
                (T_DANGER + 2.8, (0.0, -5.0, 8.5), (0.0, 11.0, 0.0), 28.0),
                (T_BENCH - 0.4, (0.0, -6.0, 9.0), (0.0, 11.0, 0.0), 28.0),
                (T_BENCH + 0.9, (0.30, -0.5, 1.50), (0.0, 3.1, 0.60), 32.0),
                (T_CHECK + 0.1, (0.25, -0.1, 1.40), (0.0, 3.1, 0.62), 32.0),
                (T_CHECK + 0.9, (0.12, 1.05, 1.02), (0.0, 3.3, 0.60), 40.0),
                (T_LIST, (0.10, 1.10, 1.01), (0.0, 3.3, 0.60), 40.0),
                (T_LIST + 0.7, (-0.30, 0.95, 1.02), (-0.32, 3.3, 0.58), 38.0),
                (T_NO, (-0.28, 0.90, 1.02), (-0.30, 3.3, 0.58), 38.0),
                (T_NO + 1.2, (0.15, 0.5, 1.30), (0.0, 3.0, 0.55), 34.0),
                (T_CLOSING + 0.9, (0.25, 0.8, 1.20), (0.15, 3.0, 0.50), 34.0)]
        pos, look, lens = (kf(t, [(a[0], a[i]) for a in keys]) for i in (1, 2, 3))
        shake = 0.03 * hit(t, T_HLAND, 8.0)
        pos = (pos[0] + shake * math.sin(t * 61.0), pos[1], pos[2] + shake * math.sin(t * 77.0))
    k.camera(pos, look, lens)
    day = (t - P0) / (P1 - P0)
    k.sky(1.0, lerp(0.08, 0.20, day))                                              # the first hint of dawn, to early light
    S.moon.data.energy = lerp(0.55, 0.42, day)
    S.sun.data.energy = lerp(0.04, 0.34, day)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
