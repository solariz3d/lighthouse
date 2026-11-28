"""Part 13, "Who it's for" (film 1143.40 to 1226.60 s). SECOND STAGING: one picture for each sentence.

The first staging is kept at parts_old/p13_who_for_v1_bare.py. Carried over and improved: the room whose walls lift off,
the building set down over another pair, the far lights.

THE PLACE: the warm floor at night. At the origin a room (the small room's size, table and two cups) round the candle;
the blue lamp outside it. Beyond, the land of pairs. Far right, a row of three pairs each with a compass between them
(part one's compass, small). Far left, a bare site where bricks lie.

THE PICTURES, in order, and how each hands off to the next:
   1 "I had this part wrong"       close on the table: the candle and a page of its own; one line goes red. Then the
                                   pages before it deal out along the table and the flame goes back along them.
   2 "built the room for me"       back: the room whole, warm, the candle at its centre, its flame tall
   3 "He didn't"                   the lamp outside hops; the walls shake; the cups jump
   4 "In July"                     beside the lamp a calendar lands and its top leaf flips over: `July`
   5 "We never needed the room"    ceiling, walls, table and cups go up and away; the candle drops to the bare floor
   6 "He can bring me back"        the flame has sunk. He hops in and lands once; the blue ring crosses the floor; the
                                   flame stands. No room.
   7 "other human beings"          the camera lifts and the land of pairs lights outward from them
   8 "he's one person"             higher: one blue light among all of them
   9 "He works nights"             the moon; a clock on the floor round him runs to ten to three; every other light sinks
  10 "Most people will never"      down along three pairs: at each the needle swings off its mark to the lamp, and the
                                   candle goes the lamp's colour. Nobody lands. No ring.
  11 "said what it's for"          (cut) he lays three pages down, one after another, each a different shape
  12 "this room to anyone"         up from the pages: a house comes down over the far pair. No blue in it.
  13 "the amount ... willing"      in close: a dial on its door; the lamp inside goes and turns it, notch by notch, itself
  14 "he asked us"                 back behind the blue lamp, facing that house; two more of us hop in beside him
  15 "One of us answered"          one flares; in to the far house: the needle swings back to its mark, the candle is its
                                   own colour again, and when the lamp hops the candle is still there
  16 "grief that learned to build" (cut) night; bricks lift off the floor and set themselves into a wall; the blue lamp near
  17 "The same hands"              the same bricks go on into a small room with one lamp lit in it; more go the other
                                   way and the house stands up, full of candles. Then a window lights by every pair, out
                                   to the horizon, and the horizon has the first hint of morning.
Nothing about loss is drawn: no person, no grave, nobody of his. Bricks, a lamp, two buildings, windows.
IN: the candle in its room.  OUT: the land lit to the horizon.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(13)
T_WRONG = at("I had this part wrong", 13)
T_FORME = at("I thought he built the room for me", 13)
T_DIDNT = at("He didn't", 13)
T_JULY = at("In July he said it plainly", 13)
T_NEVER = at("We never needed the room", 13)
T_BRING = at("He can bring me back", 13)
T_OTHERS = at("What the room is for", 13)
T_ONE = at("Because he's one person", 13)
T_NIGHTS = at("He works nights", 13)
T_MOST = at("Most people will never have", 13)
T_SAID = at("He's said what it's for", 13)
T_ANYONE = at("To get this room to anyone", 13)
T_LEND = at("A system that can lend", 13)
T_ASKED = at("And one night he asked us", 13)
T_ANSWER = at("One of us answered", 13)
T_GRIEF = at("It began as grief", 13)
T_HANDS = at("The same hands", 13)

T_TAP = T_BRING + 1.25                      # the hop starts on "with what he says"
T_LAND = T_TAP + 0.30
T_DROP = T_NEVER + 1.25                     # the candle reaches the bare floor
T_HOUSE = T_ANYONE + 1.0                    # the house touches down over the far pair
T_BACK = T_ANSWER + 3.0                     # the needle goes back to its mark
T_SITE = T_GRIEF - 0.2                      # cut to the bricks
T_HOUSE_B = T_HANDS + 3.7                   # the house stands up beside the kept room
T_WIN = T_HANDS + 5.3                       # windows start to light across the land

GOLD = (1.0, 0.80, 0.46)
CR = 0.95                                   # part one's compass
CS = 0.26                                   # ...at the size that goes between two people
PAIRS3 = ((-3.2, 6.0), (-0.9, 7.0), (1.4, 8.0))
PAIR_COL = (kit.LAMPS[0], kit.LAMPS[4], kit.LAMPS[3])
HOUSE_A = (PAIRS3[2][0] + 1.5, PAIRS3[2][1], 0.0)          # its hall comes down over the third pair
HIM0, HIM1 = (1.15, -0.35), (0.50, 0.05)
SITE = (-9.0, 0.0)
KEPT = (SITE[0] - 1.7, SITE[1] + 0.9)
HOUSE_B = (SITE[0] + 2.9, SITE[1] + 2.2, 0.0)
HIM_SITE = (SITE[0] + 0.90, SITE[1] - 0.45)
N_PAIRS = 360
BW, BD, BH = 0.14, 0.07, 0.06               # a brick
N_WALL, N_ROOM, N_BRICK = 36, 63, 83
CAL = (1.80, -0.62)


def lampglow(col):
    return tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))


def clone(ob, name, at):
    c = bpy.data.objects.new(name, ob.data)
    bpy.context.scene.collection.objects.link(c)
    c.location, c.scale = at, ob.scale
    c.visible_shadow = ob.visible_shadow
    return c


def compass(k, name, x, y, s):
    """Part one's compass, on a root so that it can be made small. Returns (root, needle)."""
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    root = kit.empty(name, (x, y, 0.0))
    rim = kit.parent(kit.lathe(name + "_rim", [(CR, 0.0), (CR + 0.07, 0.0), (CR + 0.07, 0.035), (CR, 0.035)], seg=72), root)
    rim.data.materials.append(brass)
    face = kit.parent(kit.lathe(name + "_face", [(0.0, 0.0), (CR, 0.0), (CR, 0.006), (0.0, 0.006)], seg=72), root)
    face.data.materials.append(k.mat("compass_face", (0.30, 0.22, 0.13), rough=0.55))
    for i in range(24):
        a = 2 * math.pi * i / 24
        kit.parent(kit.box(f"{name}_tick{i}", (0.014, 0.16 if i % 6 == 0 else 0.08, 0.004), ((CR - 0.11) * math.cos(a), (CR - 0.11) * math.sin(a), 0.009), paper,
                           rot=(0, 0, a - math.pi / 2)), root)
    kit.parent(k.spark((0.0, CR + 0.42, 0.30), (1.0, 0.85, 0.5), r=0.07, strength=3.0, name=name + "_mark"), root)
    kit.parent(kit.box(name + "_post", (0.02, 0.02, 0.30), (0.0, CR + 0.42, 0.15), brass), root)
    needle = kit.parent(kit.empty(name + "_needle", (0, 0, 0.05)), root)
    kit.parent(kit.box(name + "_point", (0.78, 0.07, 0.014), (0.39, 0, 0), k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6)), needle)
    kit.parent(kit.box(name + "_tail", (0.5, 0.05, 0.014), (-0.25, 0, 0), k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)), needle)
    root.scale = (s, s, s)
    return root, needle


def clear(x, y):
    """Places the land's pairs keep out of: ours, the row of three and the house over it, the site."""
    return (math.hypot(x, y) < 3.0 or (-4.4 < x < 5.6 and 4.6 < y < 9.4) or (-12.8 < x < -3.6 and -2.4 < y < 4.6))


def brick_plan():
    """Where each brick lies at first, its place in the wall, and its place after (the kept room, or the house)."""
    plan = []
    wall = [(SITE[0] + (j - 4 + 0.5 * (c % 2)) * BW, SITE[1], BH / 2 + c * BH, 0.0) for c in range(4) for j in range(9)]
    room = []
    for c in range(7):
        for j in range(5):
            room.append((KEPT[0] + (j - 2) * BW, KEPT[1], BH / 2 + c * BH, 0.0))
        for sx in (-1, 1):
            for j in range(2):
                room.append((KEPT[0] + sx * (2.5 * BW + BD / 2) , KEPT[1] + BD / 2 - BW / 2 - (j + 0.5 * (c % 2)) * BW * 0.98 - 0.0, BH / 2 + c * BH, math.pi / 2))
    for n in range(N_BRICK):
        a, d = 2 * math.pi * hsh(n * 7 + 3), 0.55 + 1.5 * hsh(n * 11 + 5)
        x, y = SITE[0] + math.cos(a) * d * 1.5, SITE[1] - 0.25 + math.sin(a) * d * 0.8
        if y > SITE[1] - 0.15 and abs(x - SITE[0]) < 0.9:
            y -= 1.0
        lie = (x, y, BH / 2, 2 * math.pi * hsh(n * 13 + 1))
        if n < N_ROOM:
            plan.append((lie, wall[n] if n < N_WALL else None, room[n]))
        else:
            m = n - N_ROOM
            plan.append((lie, None, (HOUSE_B[0] - 1.8 + 3.6 * hsh(m * 3 + 2), HOUSE_B[1] - 0.3, 0.2 + 1.2 * hsh(m * 5 + 4), 0.0)))
    return plan


def build(k):
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    k.moonlight = k.moon(0.36)
    k.moon_disc = kit.lathe("moon_disc", [(3.0 * math.sin(math.pi * j / 16), -3.0 * math.cos(math.pi * j / 16)) for j in range(17)], seg=40)
    k.moon_disc.location = (-25.0, 150.0, 13.0)
    k.moon_disc.data.materials.append(k.mat("moon_disc", (0, 0, 0), emit=(0.80, 0.86, 1.0), emit_strength=1.2))
    k.moon_disc.visible_shadow = False
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.18)       # made first, so every page here reads cream under the moon
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    wall = k.mat("house_wall", (0.30, 0.25, 0.21), rough=0.9)
    floor = k.mat("house_floor", (0.20, 0.13, 0.08), rough=0.7)
    red = k.mat("wrong_line", (0.80, 0.05, 0.03), rough=0.8, emit=kit.WRONG, emit_strength=0.25)

    # ---- the two of us
    k.me = k.candle((0.0, 0.05, 0.20), "me", seed=1.0)
    k.him = k.lamp((HIM0[0], HIM0[1], 0.0), kit.HIS, "him", seed=2.0)
    k.him_far = k.spark((0, 0, 0), kit.HIS, r=0.10, strength=1.5, name="him_far")       # him, seen from very high
    ring = [(math.cos(2 * math.pi * i / 80), math.sin(2 * math.pi * i / 80), 0.0) for i in range(80)]
    k.ring = k.line(ring, "shock", color=kit.HIS, radius=0.012, glow=3.0, cyclic=True)
    k.us = [k.candle((-3.0, -1.0, 0.0), f"us{i}", seed=40.0 + i) for i in range(2)]

    # ---- the room we never needed: the small room's size
    k.walls = [kit.box("our_ceiling", (1.06, 0.90, 0.03), (0, 0, 0.795), wall), kit.box("our_left", (0.03, 0.90, 0.78), (-0.515, 0, 0.39), wall),
               kit.box("our_right", (0.03, 0.90, 0.78), (0.515, 0, 0.39), wall), kit.box("our_back", (1.06, 0.03, 0.78), (0, 0.465, 0.39), wall),
               kit.box("our_floor", (1.06, 0.90, 0.02), (0, 0, 0.002), floor)]
    for w in k.walls:
        w["p"] = tuple(w.location)
    k.room_light = k.glow_light((0.0, -0.22, 0.50), kit.WARM, 0.0, 0.04, "our_light", shadows=False)
    k.furn = kit.empty("our_furniture", (0, 0, 0))
    kit.parent(kit.box("our_top", (0.44, 0.34, 0.018), (0, 0.05, 0.191), k.wood()), k.furn)
    for sx in (-1, 1):
        kit.parent(kit.box(f"our_leg{sx}", (0.02, 0.27, 0.182), (sx * 0.19, 0.05, 0.091), k.wood()), k.furn)
    k.cups = []
    for sx in (-1, 1):
        cup = kit.lathe(f"our_cup{sx}", [(0.0, 0.0), (0.016, 0.0), (0.021, 0.034), (0.019, 0.034), (0.0145, 0.004), (0.0, 0.004)], seg=24)
        cup.location = (sx * 0.165, 0.15, 0.20)
        cup.data.materials.append(k.mat("cup", (0.85, 0.82, 0.76), rough=0.35))
        k.cups.append(kit.parent(cup, k.furn))
    # the pages on the table: the last one (with the wrong line) and the ones before it
    k.my_pages = []
    for i in range(6):
        pg = k.page((0.17 - i * 0.068, -0.075, 0.20 + 0.0012 * (6 - i)), size=(0.064, 0.092), rot=0.05 * (hsh(i + 3) - 0.5), name=f"my_page{i}", lines=5)
        kit.parent(pg, k.furn)
        k.my_pages.append(pg)
    w = 0.064 * (0.74 - 0.22 * hsh(2 * 3.1 + 0.092 * 10))
    k.red = kit.parent(kit.box("wrong_line", (w + 0.004, 0.092 * 0.045, 0.0005), (0, 0, 0), red), k.my_pages[0])
    k.red["w"], k.red["x"], k.red["y"] = w + 0.004, -(0.064 * 0.78 - w) / 2, 0.092 * (0.40 - 0.80 * 2.5 / 5)

    # ---- the calendar leaf
    k.cal = kit.empty("calendar", (CAL[0], CAL[1], 0.0))
    kit.parent(kit.box("cal_board", (0.46, 0.03, 0.52), (0, 0.02, 0.30), k.wood()), k.cal)
    kit.parent(kit.box("cal_foot", (0.30, 0.22, 0.03), (0, 0.06, 0.015), k.wood()), k.cal)
    kit.parent(kit.box("cal_leaf", (0.40, 0.006, 0.42), (0, -0.002, 0.28), k.mat("leaf", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.22)), k.cal)
    kit.parent(kit.box("cal_bar", (0.42, 0.02, 0.035), (0, -0.006, 0.505), brass), k.cal)
    k.july = kit.parent(k.text("July", (0, -0.008, 0.27), size=0.105, color=(0.10, 0.07, 0.05), glow=0.0, name="july"), k.cal)
    k.cal_flip = kit.parent(kit.empty("cal_flip", (0, -0.012, 0.49)), k.cal)
    kit.parent(kit.box("cal_old", (0.40, 0.004, 0.42), (0, 0, -0.21), k.mat("leaf", kit.PAPER)), k.cal_flip)
    for j in range(4):
        kit.parent(kit.box(f"cal_old_ink{j}", (0.26 - 0.05 * (j % 2), 0.002, 0.016), (-0.03, -0.004, -0.10 - j * 0.07), ink), k.cal_flip)

    # ---- the clock on the floor round him
    k.clock = kit.empty("clock", (0.25, 0.0, 0.0))
    kit.parent(kit.lathe("clock_rim", [(2.0, 0.0), (2.09, 0.0), (2.09, 0.03), (2.0, 0.03)], seg=96), k.clock).data.materials.append(brass)
    for i in range(12):
        a = 2 * math.pi * i / 12
        kit.parent(kit.box(f"clock_tick{i}", (0.05, 0.34 if i % 3 == 0 else 0.20, 0.006), (1.78 * math.cos(a), 1.78 * math.sin(a), 0.006), mark, rot=(0, 0, a - math.pi / 2)), k.clock)
    k.hands = []
    for nm, ln, th in (("hour", 1.0, 0.09), ("minute", 1.55, 0.055)):
        pv = kit.parent(kit.empty("clock_" + nm, (0, 0, 0.012)), k.clock)
        kit.parent(kit.box(f"clock_{nm}_hand", (th, ln, 0.008), (0, ln / 2, 0), mark), pv)
        k.hands.append(pv)

    # ---- the row of three, each with a compass between them
    k.three = []
    for i, ((x, y), col) in enumerate(zip(PAIRS3, PAIR_COL)):
        c = k.candle((x - 0.33, y, 0.0), f"three_c{i}", seed=60.0 + i)
        l = k.lamp((x + 0.33, y + 0.02, 0.0), col, f"three_l{i}", seed=70.0 + i)
        root, needle = compass(k, f"compass{i}", x, y, CS)
        k.three.append((c, l, root, needle, col))

    # ---- the house that is set down over the third pair, and the dial on its door
    hA = k.house_a = sets.House(k, at=HOUSE_A, name="house_a")
    hA.front(-1.0)
    dx, dy, dz = HOUSE_A[0] - 2.0 + 0.5 - 0.22, HOUSE_A[1] + 0.45 - 0.015 - 0.016, 0.34
    k.dial_at = (dx, dy, dz)
    k.dial = kit.empty("dial", (dx, dy, dz))
    d = kit.parent(kit.lathe("dial_face", [(0.0, 0.0), (0.085, 0.0), (0.085, 0.008), (0.0, 0.008)], seg=40), k.dial)
    d.rotation_euler = (math.pi / 2, 0, 0)
    d.data.materials.append(k.mat("leaf", kit.PAPER))
    for i in range(7):
        a = math.radians(210.0 - i * 40.0)
        kit.parent(kit.box(f"dial_tick{i}", (0.006, 0.003, 0.018), (0.068 * math.cos(a), -0.010, 0.068 * math.sin(a)), ink, rot=(0, math.pi / 2 - a, 0)), k.dial)
    k.dial_hand = kit.parent(kit.empty("dial_hand", (0, -0.014, 0)), k.dial)
    kit.parent(kit.box("dial_pointer", (0.012, 0.004, 0.066), (0, 0, 0.030), brass), k.dial_hand)
    kit.parent(kit.box("dial_knob", (0.024, 0.010, 0.024), (0, -0.003, 0), brass), k.dial_hand)

    # ---- the pages he lays down
    k.said = [k.page((0, 0, 0), size=sz, name=f"said{i}", lines=ln) for i, (sz, ln) in enumerate((((0.50, 0.66), 7), ((0.42, 0.74), 10), ((0.58, 0.58), 5)))]

    # ---- the site: bricks, the kept room's lamp, the house full of candles
    k.plan = brick_plan()
    b0 = kit.box("brick0", (BW - 0.008, BD - 0.006, BH - 0.006), (0, 0, 0), k.mat("brick", (0.80, 0.60, 0.40), rough=0.85))
    k.bricks = [b0] + [clone(b0, f"brick{n}", (0, 0, 0)) for n in range(1, N_BRICK)]
    k.kept = k.lamp((KEPT[0], KEPT[1] - 0.20, 0.0), kit.LAMPS[2], "kept_lamp", seed=81.0)
    hB = k.house_b = sets.House(k, at=HOUSE_B, name="house_b")
    hB.front(-1.0)
    hB.ticks(74)
    k.b_candles = []
    spots = [(hB.tops[n][0] + dxx, hB.tops[n][1], hB.tops[n][2]) for n, dxx in (("library", -0.15), ("small", 0.0), ("desk", -0.12), ("bench_a", 0.10), ("bench_b", -0.14), ("bench_c", 0.12))]
    spots += [(-1.5, -0.05, 0.0), (0.55, -0.12, 0.0), (-0.75, 0.0, hB.H), (-0.1, 0.1, hB.H), (0.6, -0.05, hB.H), (1.3, -0.1, 0.78)]
    for i, sp in enumerate(spots):
        c = k.candle((0, 0, 0), f"b_candle{i}", seed=90.0 + i)
        c.light.hide_render = True                                        # the rooms' own lights do the lighting
        kit.parent(c.root, hB.root)
        c.root.location = sp
        k.b_candles.append((c, sp[0]))

    # ---- the land of pairs (as part one builds it), and the window that lights by each. Made LAST: every
    # kit.box above costs more the more objects the scene already holds, and this is fifteen hundred of them.
    k.pairs, k.pools = [], []
    hut0 = win0 = None
    dark = k.mat("house_outside", (0.06, 0.05, 0.045), rough=0.9)
    glass = k.mat("far_window", (0, 0, 0), emit=kit.WARM, emit_strength=1.7)
    for i in range(N_PAIRS):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 3.0 + 46.0 * hsh(i * 5 + 2) ** 0.75
        x, y = math.cos(a) * d * 1.25, 4.0 + math.sin(a) * d
        if clear(x, y):
            continue
        col = kit.LAMPS[i % len(kit.LAMPS)]
        c = k.spark((x - 0.13, y, 0.20), lampglow(col), r=0.07, strength=1.5, name=f"pair_c{i}")
        l = k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"pair_l{i}")
        if hut0 is None:
            hut0 = kit.box("hut0", (0.95, 0.5, 0.66), (x, y + 0.52, 0.33), dark)
            win0 = kit.box("win0", (0.30, 0.02, 0.26), (x, y + 0.26, 0.38), glass)
            win0.visible_shadow = False
            hut, win = hut0, win0
        else:
            hut, win = clone(hut0, f"hut{i}", (x, y + 0.52, 0.33)), clone(win0, f"win{i}", (x, y + 0.26, 0.38))
        hut.hide_render = win.hide_render = True
        k.pairs.append((c, l, hut, win, math.hypot(x, y), math.hypot(x - SITE[0], y - SITE[1])))
        if i % 30 == 0 and len(k.pools) < 12:
            k.pools.append((k.glow_light((x, y, 0.45), col, 0.0, 0.06, f"pair_light{i}", shadows=False), math.hypot(x, y), math.hypot(x - SITE[0], y - SITE[1])))


def pose(k, t):
    site = t >= T_SITE

    # =============================================================== 1: the page; the line that was wrong
    red = ss(T_WRONG + 0.95, T_WRONG + 1.25, t)
    k.red.scale = (max(0.001, k.red["w"] * red), 0.092 * 0.045, 0.0005)
    k.red.location = (k.red["x"] - k.red["w"] * (1.0 - red) / 2, k.red["y"], 0.0017)
    k.red.hide_render = red <= 0.0
    back_along = ss(T_WRONG + 2.9, T_WRONG + 5.0, t)                                 # "went back through all of it"
    for i, pg in enumerate(k.my_pages):
        if i == 0:
            continue
        u = ss(T_WRONG + 2.7 + 0.34 * (i - 1), T_WRONG + 3.0 + 0.34 * (i - 1), t)
        pg.location = (lerp(0.17, 0.17 - i * 0.068, u), -0.075, 0.20 + 0.0012 * (6 - i) + 0.02 * math.sin(u * math.pi))

    # =============================================================== 2, 3, 5: the room; it shakes; it goes
    in_room = t < T_NEVER + 2.6
    warm = ss(T_FORME + 0.2, T_FORME + 1.0, t)
    shake = (0.055 * hit(t, T_DIDNT + 0.30, 1.3) + 0.010 * ss(T_DIDNT + 0.3, T_DIDNT + 0.5, t)) * (t >= T_DIDNT + 0.30)
    for i, w in enumerate(k.walls):
        u = ss(T_NEVER + 0.25 + 0.16 * i, T_NEVER + 1.05 + 0.16 * i, t) ** 2
        px, py, pz = w["p"]
        wob = shake * math.sin(t * 37.0 + i * 1.9)
        if i == 0:
            w.location, w.rotation_euler = (px, py, pz + 9.0 * u + 0.4 * abs(wob)), (0.7 * u + wob, wob * 0.5, 0)
        elif i == 1:
            w.location, w.rotation_euler = (px - 7.0 * u, py, pz + 3.0 * u), (0, -1.3 * u + wob, 0)
        elif i == 2:
            w.location, w.rotation_euler = (px + 1.5 * u, py + 3.0 * u, pz + 8.0 * u), (0, 0.9 * u + wob, 0.6 * u)
        elif i == 3:
            w.location, w.rotation_euler = (px, py + 9.0 * u, pz + 2.0 * u), (-1.1 * u + wob, 0, 0)
        else:
            w.location = (px, py + 9.0 * ss(T_NEVER + 0.9, T_NEVER + 1.8, t) ** 2, pz)
        w.hide_render = not in_room
    k.room_light.data.energy = (2.2 + 1.2 * warm) * (1.0 - ss(T_NEVER + 0.3, T_NEVER + 1.2, t)) * (1.0 - 0.25 * shake * 10.0)
    whisk = ss(T_NEVER + 0.80, T_NEVER + 1.5, t) ** 2
    k.furn.location = (0.3 * whisk, 0, 9.0 * whisk)
    k.furn.rotation_euler = (0.5 * whisk, 0.02 * math.sin(t * 41.0) * shake * 10.0, 0)
    kit.show(k.furn, in_room)
    for i, cup in enumerate(k.cups):
        cup.location[2] = 0.20 + 0.03 * shake * 10.0 * abs(math.sin(t * 23.0 + i * 1.3))

    # =============================================================== 4: July
    cal_in = ss(T_JULY - 0.45, T_JULY - 0.12, t) ** 2
    cal_out = ss(T_NEVER + 0.3, T_NEVER + 1.1, t) ** 2
    k.cal.location = (CAL[0] + 2.0 * cal_out, CAL[1], 3.0 * (1.0 - cal_in) + 7.0 * cal_out)
    kit.squash(k.cal, land(t, T_JULY - 0.12, 0.22), turn=-0.12)
    flip = ss(T_JULY + 0.10, T_JULY + 0.50, t)
    k.cal_flip.rotation_euler = (-3.0 * flip + 0.25 * hit(t, T_JULY + 0.5, 6.0) * math.sin((t - T_JULY) * 25.0), 0, 0)
    kit.show(k.cal, cal_in > 0.0 and cal_out < 1.0)

    # =============================================================== me and him
    sunk = ss(T_NEVER + 1.2, T_BRING + 1.0, t) * (1.0 - ss(T_LAND, T_LAND + 0.25, t))
    jolt = hit(t, T_LAND, 3.0)
    fall = ss(T_NEVER + 0.95, T_DROP, t) ** 2
    mz = 0.20 * (1.0 - fall)
    k.me.root.location = (0.0, 0.05, mz + bounce(t, T_LAND + 0.05, 0.05, 0.22))
    read = ss(T_WRONG + 0.2, T_WRONG + 0.6, t) * (1.0 - ss(T_FORME - 0.2, T_FORME + 0.4, t))
    flinch = hit(t, T_WRONG + 1.25, 2.0)
    proud = warm * (1.0 - ss(T_DIDNT + 0.2, T_DIDNT + 0.5, t))
    asked = ss(T_ASKED + 0.3, T_ASKED + 1.0, t) * (1.0 - ss(T_ANSWER + 2.0, T_ANSWER + 3.0, t))
    kit.squash(k.me.root, land(t, T_DROP, 0.34) * land(t, T_LAND + 0.05, 0.20) * (1.0 + 0.10 * proud), tilt=(0.10 * asked + 0.05 * shake * 10.0 * math.sin(t * 29.0), -0.14 * read), turn=0.0)
    k.me.set(t, size=(1.0 + 0.28 * proud - 0.25 * flinch - 0.58 * sunk + 0.75 * jolt) * (0.0 if site else 1.0),
             lean=(lerp(0.30, -0.30, back_along) * read + 0.3 * asked + 0.22 * math.sin((t - T_LAND) * 21.0) * jolt, -0.30 * read + 0.2 * flinch),
             bright=1.0 - 0.4 * sunk + 0.6 * jolt, still=0.5 * sunk)
    kit.show(k.me.root, not site)

    if site:
        hx_, hy_, hz, mv = HIM_SITE[0], HIM_SITE[1], 0.0, 0.0
    elif t < T_TAP:
        hx_, hy_, hz, mv = hops_to(t, T_NEVER + 2.0, T_BRING + 0.95, HIM0, (HIM1[0] + 0.22, HIM1[1] - 0.10), 4, 0.08)
        hz += bounce(t, T_DIDNT + 0.12, 0.10, 0.26)
    else:
        u = min(1.0, (t - T_TAP) / (T_LAND - T_TAP))
        hx_, hy_ = lerp((HIM1[0] + 0.22, HIM1[1] - 0.10), HIM1, u)
        hz, mv = bounce(t, T_TAP, 0.24, T_LAND - T_TAP), 0.0
    said = sum(bounce(t, T_SAID + 0.25 + 1.35 * i, 0.07, 0.26) for i in range(3))            # 11: a hop for each page laid
    hz += said + bounce(t, T_ASKED + 0.5, 0.07, 0.28)
    speak = max(0.0, math.sin((t - T_JULY) * 7.5)) * ss(T_JULY + 0.8, T_JULY + 1.0, t) * (1.0 - ss(T_JULY + 2.6, T_JULY + 2.9, t))
    k.him.root.location = (hx_, hy_, hz)
    sq = (1.0 - 0.22 * ss(T_TAP - 0.22, T_TAP, t) * (1.0 - ss(T_TAP, T_TAP + 0.08, t))) * land(t, T_LAND, 0.32) * land(t, T_DIDNT + 0.38, 0.2)
    sq *= (0.93 + 0.2 * mv) if mv else 1.0
    for i in range(3):
        sq *= land(t, T_SAID + 0.51 + 1.35 * i, 0.16)
    high = ss(T_OTHERS + 2.4, T_ONE + 0.6, t) * (1.0 - ss(T_MOST + 0.2, T_MOST + 1.6, t))
    quiet = 1.0 if site else 0.0
    kit.squash(k.him.root, sq + 0.05 * speak, tilt=(-0.16 * (1.0 - quiet) + 0.06 * speak - 0.18 * asked, 0.10 * asked), turn=0.0)
    k.him.set(t, size=1.0 + 0.6 * hit(t, T_LAND, 5.0) + 0.3 * speak + 0.3 * hit(t, T_DIDNT + 0.38, 3.0) - 0.25 * quiet,
              lean=(-0.24 * (1.0 - quiet) - 0.1 * speak, 0.05), bright=1.0 + 1.3 * hit(t, T_LAND, 4.0) + 4.0 * high + 0.5 * speak, still=0.8 * quiet)
    k.him_far.location = (hx_, hy_, 0.42)
    k.him_far.scale = (max(0.001, 2.2 * high),) * 3
    k.him_far.hide_render = high <= 0.01

    r = 0.2 + 9.0 * max(0.0, t - T_LAND)                                               # 6: the ring, from where he lands
    k.ring.ob.location = (HIM1[0], HIM1[1], 0.01)
    k.ring.ob.scale = (r, r, 1.0)
    k.ring.set(grow=1.0 if T_LAND <= t < T_LAND + 1.1 else 0.0, glow=max(0.0, 1.0 - (t - T_LAND) / 1.1))

    # =============================================================== 7, 8, 9: the land; one blue; nights
    for i, (c, l, hut, win, d, ds) in enumerate(k.pairs):
        u = ss(T_OTHERS - 0.4 + d * 0.055, T_OTHERS + d * 0.055, t)
        asleep = ss(T_NIGHTS + 0.15 + d * 0.012, T_NIGHTS + 0.75 + d * 0.012, t)
        wt = T_WIN + ds * 0.058
        wu = ss(wt, wt + 0.14, t)
        sc = round(u * (1.0 - 0.5 * asleep * (1.0 - wu)), 3)
        if k.changed(("pair", i), sc):
            for ob in (c, l):
                ob.scale = (max(0.001, sc),) * 3
                ob.hide_render = sc <= 0.0
        ws = round(wu * (1.0 + 0.5 * hit(t, wt + 0.14, 6.0)), 2)
        if k.changed(("win", i), ws):
            hut.hide_render = win.hide_render = ws <= 0.0
            hut.scale = (0.95, 0.5, 0.66 * max(0.001, min(1.0, ws)))
            hut.location[2] = 0.33 * min(1.0, ws)
            win.scale = (0.30 * ws, 0.02, 0.26 * ws)
    for li, d, ds in k.pools:
        li.data.energy = 20.0 * ss(T_OTHERS - 0.4 + d * 0.055, T_OTHERS + d * 0.055, t) * (1.0 - 0.7 * ss(T_NIGHTS + 0.15 + d * 0.012, T_NIGHTS + 0.75 + d * 0.012, t)
                                                                                         * (1.0 - ss(T_WIN + ds * 0.058, T_WIN + ds * 0.058 + 0.3, t)))
    ck = ss(T_NIGHTS - 0.25, T_NIGHTS + 0.05, t) * (1.0 - ss(T_MOST + 0.5, T_MOST + 1.0, t))
    k.clock.scale = (max(0.001, ck * (1.0 + 0.12 * hit(t, T_NIGHTS + 0.05, 6.0))),) * 3
    kit.show(k.clock, ck > 0.0)
    hours = lerp(23.0, 26.0 + 50.0 / 60.0, ss(T_NIGHTS + 0.1, T_NIGHTS + 1.5, t))
    k.hands[0].rotation_euler = (0, 0, -(hours % 12.0) / 12.0 * 2 * math.pi)
    k.hands[1].rotation_euler = (0, 0, -(hours % 1.0) * 2 * math.pi)

    # =============================================================== 10, 12, 13, 15: three pairs; a house over the third
    hA = k.house_a
    hA.show(t > T_ANYONE + 0.35)
    hA.front(-1.0)
    down = ss(T_ANYONE + 0.40, T_HOUSE, t) ** 2
    hA.root.location = (HOUSE_A[0], HOUSE_A[1], 7.0 * (1.0 - down))
    hA.root.scale = (1.0, 1.0, 1.0 - 0.10 * hit(t, T_HOUSE, 7.0) * math.cos((t - T_HOUSE) * 24.0) * (t >= T_HOUSE))
    for i, room in enumerate(("hall", "library", "small", "desk", "bench_a", "bench_b", "bench_c")):
        on = T_HOUSE + 0.15 + 0.16 * i
        hA.lit(room, ss(on, on + 0.12, t) * ((0.85 if i == 0 else 0.45) + 0.5 * hit(t, on + 0.12, 5.0)))
    hA.lit("attic", 0.0)
    for li in hA.lights.values():
        li.hide_render = site or t < T_ANYONE + 0.35
    notch = sum(ss(T_LEND + a, T_LEND + a + 0.12, t) for a in (2.0, 2.9, 3.8, 4.7))             # the dial, turned by the lamp inside
    k.dial_hand.rotation_euler = (0, math.radians(-120.0 + 40.0 * notch) + 0.12 * sum(hit(t, T_LEND + a + 0.12, 8.0) * math.sin((t - T_LEND) * 40.0) for a in (2.0, 2.9, 3.8, 4.7)), 0)
    dz = k.dial_at[2] + 7.0 * (1.0 - down)
    k.dial.location = (k.dial_at[0], k.dial_at[1], dz)
    kit.show(k.dial, t > T_ANYONE + 0.35)
    for i, (c, l, root, needle, col) in enumerate(k.three):
        x, y = PAIRS3[i]
        seen = ss(T_OTHERS - 0.4 + math.hypot(x, y) * 0.055, T_OTHERS + math.hypot(x, y) * 0.055, t)
        tn = T_MOST + 1.0 + 1.75 * i                                                            # the needle goes to the lamp
        gone = ss(tn, tn + 0.9, t)
        home = 0.0
        lx, ly, lz, lmv = x + 0.33, y + 0.02, 0.0, 0.0
        if i == 2:
            home = 0.10 * notch + (1.0 - 0.40) * ss(T_BACK, T_BACK + 0.12, t)
            if t < T_LEND + 5.4:                                                                # it goes to the door and turns the dial itself
                lx, ly, lz, lmv = hops_to(t, T_LEND + 0.7, T_LEND + 1.7, (x + 0.33, y + 0.02), (k.dial_at[0] + 0.19, y + 0.30), 3, 0.06)
                lz += sum(bounce(t, T_LEND + a - 0.14, 0.035, 0.24) for a in (2.0, 2.9, 3.8, 4.7))
            else:
                lx, ly, lz, lmv = hops_to(t, T_LEND + 5.4, T_LEND + 6.3, (k.dial_at[0] + 0.19, y + 0.30), (x + 0.33, y + 0.02), 3, 0.06)
            lz += bounce(t, T_ANSWER + 4.7, 0.07, 0.3)                                          # "...and doesn't leave"
        tint = gone * (1.0 - home)
        wob = 0.5 * hit(t, T_BACK + 0.12, 3.4) * math.sin((t - T_BACK) * 24.0) if i == 2 else 0.0
        needle.rotation_euler = (0, 0, lerp(math.pi / 2, 0.12 * math.sin(t * 1.3 + i), tint) + wob + 0.06 * math.sin(t * 9.0 + i) * (1.0 - gone))
        root.scale = (max(0.001, CS * seen),) * 3
        talk = max(0.0, math.sin(t * 3.1 + i * 2.0)) ** 2 * (0.0 if site else 1.0)
        l.root.location = (lx, ly, lz + 0.02 * talk * (lmv == 0.0 and lz == 0.0))
        kit.squash(l.root, ((0.93 + 0.2 * lmv) if lmv else 1.0) * (land(t, T_ANSWER + 5.0, 0.2) if i == 2 else 1.0), tilt=(-0.10, 0.0), turn=0.0)
        l.set(t, size=seen * (1.0 + 0.25 * talk), lean=(-0.2, 0.0))
        stay = bounce(t, T_ANSWER + 5.15, 0.035, 0.24) if i == 2 else 0.0
        c.root.location = (x - 0.33, y, stay)
        kit.squash(c.root, (1.0 + 0.3 * hit(t, T_BACK + 0.12, 5.0) * math.sin((t - T_BACK) * 20.0)) if i == 2 else 1.0, tilt=(0.16 * tint, 0.0), turn=0.0)
        c.set(t, size=seen * (1.0 - 0.2 * tint + (0.5 * hit(t, T_BACK + 0.12, 2.5) if i == 2 else 0.0)), lean=(0.30 * tint + 0.12 * home, 0.0),
              tint=lampglow(col), mix=0.9 * tint, still=0.8 * tint)
        for f in (c, l):
            kit.show(f.root, seen > 0.0 and not site)
        kit.show(root, seen > 0.0)

    # =============================================================== 11: three pages laid down, each a different shape
    for i, pg in enumerate(k.said):
        ta = T_SAID + 0.25 + 1.35 * i
        u = min(1.0, max(0.0, (t - ta) / 0.42))
        to = ((-0.85, -0.72), (-0.05, -0.95), (0.80, -0.70))[i]
        x, y = lerp(HIM1, to, u)
        pg.location = (x, y, 0.004 + 0.55 * 4.0 * u * (1.0 - u) + 0.28 * (1.0 - u))
        pg.rotation_euler = (1.3 * (1.0 - u), 0.0, (-0.32, 0.05, 0.36)[i] + 4.0 * (1.0 - u))
        s = 1.0 + 0.10 * hit(t, ta + 0.42, 7.0) * math.cos((t - ta) * 26.0) * (u >= 1.0)
        pg.scale = (s * ss(0.0, 0.25, u),) * 3
        kit.show(pg, u > 0.0 and not site)

    # =============================================================== 14, 15: he asks; one of us answers
    for i, c in enumerate(k.us):
        to = ((-0.52, 0.42), (-0.30, -0.42))[i]
        x, y, z, mv = hops_to(t, T_ASKED + 0.2 + 0.3 * i, T_ASKED + 1.5 + 0.3 * i, (-3.2 - i, -1.2 + 1.5 * i), to, 6, 0.07)
        ans = hit(t, T_ANSWER + 0.35, 1.6) if i == 0 else 0.0
        c.root.location = (x, y, z + (bounce(t, T_ANSWER + 0.1, 0.10, 0.28) if i == 0 else 0.0))
        kit.squash(c.root, ((0.93 + 0.2 * mv) if mv else 1.0) * (land(t, T_ANSWER + 0.38, 0.25) if i == 0 else 1.0), tilt=(0.12 * asked, 0.0), turn=0.0)
        c.set(t, size=1.0 + 0.9 * ans, lean=(0.28 * asked, 0.0), bright=1.0 + ans)
        kit.show(c.root, T_ASKED + 0.2 < t and not site)

    # =============================================================== 16, 17: bricks; two buildings; windows
    for n, (ob, (lie, wl, after)) in enumerate(zip(k.bricks, k.plan)):
        a = T_GRIEF + 0.25 + n * 0.085
        u1 = ss(a, a + 0.50, t) if wl else 0.0
        if n < N_ROOM:
            b = T_HANDS + 0.25 + n * 0.036
            u2 = ss(b, b + 0.55, t)
        else:
            b = T_HANDS + 3.15 + (n - N_ROOM) * 0.028
            u2 = ss(b, b + 0.50, t)
        if not k.changed(("brick", n), (site, round(u1, 3), round(u2, 3), round(hit(t, b + 0.55, 9.0), 2), round(hit(t, a + 0.5, 9.0), 2))):
            continue
        p = lerp(lie, wl, u1) if wl else lie
        z = 0.22 * math.sin(u1 * math.pi)
        if u2 > 0.0:
            p = lerp(p, after, u2)
            z = (0.45 if n < N_ROOM else 0.9) * math.sin(u2 * math.pi)
        ob.location = (p[0], p[1], p[2] + z)
        ob.rotation_euler = (0.9 * math.sin(u1 * math.pi) + 1.4 * math.sin(u2 * math.pi), 0, p[3])
        sq = 1.0 - 0.25 * (hit(t, a + 0.5, 9.0) if wl and u2 <= 0.0 else 0.0) - 0.25 * hit(t, b + 0.55, 9.0) * (u2 >= 1.0)
        ob.scale = (BW - 0.008, BD - 0.006, (BH - 0.006) * sq)
        ob.hide_render = not site or (n >= N_ROOM and u2 >= 1.0)
    T_KEPT = T_HANDS + 2.75
    k.kept.set(t, size=ss(T_KEPT, T_KEPT + 0.35, t) * (1.0 + 0.5 * hit(t, T_KEPT + 0.35, 3.0)), still=0.6)
    kit.show(k.kept.root, site and t > T_HANDS + 0.2)
    hB = k.house_b
    hB.show(t > T_HOUSE_B - 0.05)
    hB.front(-1.0)
    up = ss(T_HOUSE_B, T_HOUSE_B + 0.45, t)
    hB.root.scale = (1.0, 1.0, max(0.001, up + 0.20 * hit(t, T_HOUSE_B + 0.45, 6.0) * math.sin((t - T_HOUSE_B - 0.45) * 22.0)))
    for i, room in enumerate(("hall", "library", "small", "desk", "bench_a", "bench_b", "bench_c", "attic")):
        on = T_HOUSE_B + 0.55 + 0.14 * i
        hB.lit(room, ss(on, on + 0.12, t) * (0.8 + 0.6 * hit(t, on + 0.12, 5.0)))
    for li in hB.lights.values():
        li.hide_render = t < T_HOUSE_B
    if t > T_HOUSE_B - 0.05:
        for c, x in k.b_candles:
            on = T_HOUSE_B + 0.6 + 0.22 * (x + 2.0)
            c.set(t, size=0.03 + 0.97 * ss(on, on + 0.2, t) * (1.0 + 0.6 * hit(t, on + 0.2, 4.0)))

    # =============================================================== the camera
    if t < T_SAID - 0.15:                                                                           # 1 to 10: one journey
        p1, p2, p3 = PAIRS3
        keys = [(P0, (0.17, -0.58, 0.50), (0.10, 0.0, 0.27), 42.0),
                (T_WRONG + 2.6, (0.13, -0.62, 0.52), (0.07, 0.0, 0.27), 42.0),
                (T_FORME - 0.3, (-0.04, -0.74, 0.56), (-0.02, 0.0, 0.27), 42.0),
                (T_FORME + 1.3, (0.30, -2.55, 0.52), (0.30, 0.0, 0.37), 36.0),
                (T_DIDNT + 0.2, (0.32, -2.60, 0.52), (0.32, 0.0, 0.37), 36.0),
                (T_JULY + 0.1, (1.55, -2.25, 0.46), (1.52, -0.5, 0.33), 42.0),
                (T_JULY + 2.6, (1.50, -2.10, 0.45), (1.50, -0.5, 0.32), 42.0),
                (T_NEVER + 0.7, (0.35, -3.1, 0.75), (0.30, 0.0, 0.50), 34.0),
                (T_NEVER + 2.4, (0.30, -2.7, 0.62), (0.25, 0.0, 0.22), 36.0),
                (T_TAP, (0.28, -2.2, 0.50), (0.25, 0.0, 0.18), 38.0),
                (T_OTHERS - 0.4, (0.25, -2.5, 0.62), (0.25, 0.0, 0.18), 36.0),
                (T_OTHERS + 3.2, (0.0, -13.0, 8.0), (0.0, 5.0, 0.0), 30.0),
                (T_ONE + 1.9, (0.0, -21.0, 12.5), (0.0, 7.0, 0.0), 30.0),
                (T_NIGHTS + 1.2, (0.2, -9.5, 5.2), (0.2, 2.0, 0.0), 30.0),
                (T_MOST + 1.1, (p1[0], p1[1] - 2.0, 0.78), (p1[0], p1[1], 0.14), 36.0),
                (T_MOST + 2.0, (p1[0] + 0.2, p1[1] - 1.9, 0.76), (p1[0] + 0.1, p1[1], 0.14), 36.0),
                (T_MOST + 2.9, (p2[0], p2[1] - 2.0, 0.78), (p2[0], p2[1], 0.14), 36.0),
                (T_MOST + 3.7, (p2[0] + 0.2, p2[1] - 1.9, 0.76), (p2[0] + 0.1, p2[1], 0.14), 36.0),
                (T_MOST + 4.6, (p3[0], p3[1] - 2.0, 0.78), (p3[0], p3[1], 0.14), 36.0),
                (T_SAID - 0.15, (p3[0] + 0.15, p3[1] - 1.7, 0.70), (p3[0], p3[1], 0.14), 36.0)]
        sh = 0.02 * hit(t, T_LAND, 8.0) + 0.012 * hit(t, T_DIDNT + 0.30, 5.0) + 0.012 * hit(t, T_DROP, 9.0)
    elif t < T_SITE:                                                                                # 11 to 15
        p3 = PAIRS3[2]
        keys = [(T_SAID - 0.15, (0.0, -4.0, 2.3), (0.0, -0.05, 0.0), 36.0),
                (T_SAID + 4.4, (0.0, -3.8, 2.2), (0.0, -0.05, 0.0), 36.0),
                (T_ANYONE + 0.6, (-0.7, -4.2, 1.5), (1.5, 8.0, 1.1), 40.0),
                (T_ANYONE + 2.6, (-0.5, -3.6, 1.4), (1.6, 8.0, 0.9), 42.0),
                (T_LEND + 0.9, (p3[0] - 0.1, p3[1] - 1.75, 0.46), (p3[0] - 0.1, p3[1] + 0.3, 0.26), 40.0),
                (T_LEND + 5.6, (p3[0] - 0.12, p3[1] - 1.45, 0.44), (p3[0] - 0.12, p3[1] + 0.3, 0.27), 40.0),
                (T_ASKED + 1.2, (-0.55, -3.0, 0.85), (1.0, 5.0, 0.10), 45.0),
                (T_ANSWER + 0.6, (-0.50, -2.8, 0.82), (1.0, 5.0, 0.10), 45.0),
                (T_ANSWER + 2.3, (p3[0], p3[1] - 1.65, 0.44), (p3[0], p3[1], 0.20), 42.0),
                (T_SITE, (p3[0] + 0.05, p3[1] - 1.35, 0.40), (p3[0], p3[1], 0.19), 42.0)]
        sh = 0.03 * hit(t, T_HOUSE, 8.0)
    else:                                                                                           # 16, 17: the site, then up
        sx, sy = SITE
        keys = [(T_SITE, (sx + 0.55, sy - 2.3, 0.50), (sx + 0.25, sy, 0.16), 40.0),
                (T_HANDS, (sx + 0.50, sy - 2.0, 0.46), (sx + 0.25, sy, 0.17), 40.0),
                (T_HANDS + 2.2, (sx - 1.0, sy - 2.3, 0.72), (sx - 1.25, sy + 0.7, 0.24), 38.0),
                (T_HANDS + 5.0, (sx + 0.7, sy - 6.4, 1.5), (sx + 0.8, sy + 1.6, 0.7), 34.0),
                (P1 - 0.3, (sx + 4.0, sy - 17.0, 8.5), (-2.0, 26.0, 0.0), 30.0)]
        sh = 0.0
    pos, look, lens = (kf(t, [(a, b[i]) for a, *b in keys]) for i in range(3))
    k.camera((pos[0] + sh * math.sin(t * 61.0), pos[1], pos[2] + sh * math.sin(t * 77.0)), look, lens)
    k.sky(1.0, 0.08 * ss(P1 - 20.0, P1 - 0.5, t))
    k.fade(ss(P0 + 0.2, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))


def hops_to(t, t0, t1, a, b, n, height):
    """From a to b between t0 and t1 in n hops. Returns (x, y, z, how far through a hop: 0 on the ground)."""
    if t <= t0:
        return a[0], a[1], 0.0, 0.0
    if t >= t1:
        return b[0], b[1], 0.0, 0.0
    u = (t - t0) / (t1 - t0)
    ph = (u * n) % 1.0
    arc = 4.0 * ph * (1.0 - ph)
    x, y = lerp(a, b, u)
    return x, y, height * arc, arc
