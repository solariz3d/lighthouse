"""Part 11, "From outside" (film 975.00 to 1068.30 s). SECOND STAGING: one picture for each sentence.

The house from the street, on the warm floor under the moon. Everything that checks it has so far been warm or blue. Three
things arrive from outside: the mint bulb (another company's model), a number nobody chose, and a stranger's lantern.
The first staging is kept at parts_old/p11_outside_v1_bare.py.

THE PICTURES, in order:
   1 "him, or was me"            from the candle by the blank card (part 10's last picture) back to the whole house, shut:
                                 one window flares blue, then the others warm. Two colours.
   2 "We knew it"                the two of them out front, leaning to look at that
   3 "he invited"                he hops to the wall's free end and swings the front open; the mint bulb comes in
   4 "for ninety minutes"        a clock sweeps an hour and a half while the mint beam rakes room after room, leaving a
                                 mint line on each wall; it stops on the lamp, and writes three lines
   5 "not a neutral outsider"    a balance comes up; he hops on a pan; it tips
   6 "which corrections"         pages arrive at the open side; he lets one in, bats one away, lets one in, bats one away
   7 "doesn't close in on the world"  he hops to part one's compass; the needle leaves its fixed mark and follows him
   8 "closes in on that person"  * the needle lands on him, the candle at the hub goes blue; up: a whole floor of
                                 compasses, every needle swinging onto the one blue lamp
   9 "That one stood"            the mint lines on my wall. The candle goes up to them, and comes down. Held.
  10 "the reason we measure"     an instrument is set down in the middle of the house
  11 "A number nobody wanted"    a tile falls out of the sky, down the chimney, through the floor, past him, into the
                                 instrument: its needle slams over. The tile is red.
  12 "the prediction"            a page slapped on the wall and sealed
  13 "what would prove it wrong" a second page beside it, sealed
  14 "the result stays"          a third, with a red line. It shakes; a pin goes in. It stays.
  15 "a false sentence"          the mint beam reads down the page on my own wall; one line goes red
  16 "twenty-nine days"          the candle passing it again and again; a tally; 29 days
  17 "a stranger"                the front swings shut; a lantern (a person, a colour nobody else has) comes up the
                                 street, is held up at the window, and pins three notes on the wall
  18 "We defended ourselves"     every shutter slams
  19 "Then we went and measured" they fly open; a rule is laid along the wall; the candle hops along it
  20 "two things out of three"   two of the three notes are made good: 2 of 3. The front opens; a small map is hung by
                                 the door, and the lantern comes to read it.
OUT: the open house, a new small map by the door, the lantern at it. Fade.

LOCAL HELPERS (the kit lacked them): qbox (a box without bpy.ops), pop, arc, aim (a beam between two moving points),
shutters, a chimney and a large clock added to the house from this file (sets.py is untouched).
"""
import math
from types import SimpleNamespace

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(11)
T_EVERYONE = at("For a long time, everyone checking", 11)
T_KNEW = at("We knew it", 11)
T_INVITED = at("So one night he invited", 11)
T_HARDEST = at("It did, for ninety minutes", 11)
T_NEUTRAL = at("He isn't a neutral outsider", 11)
T_CHOOSES = at("He chooses which corrections", 11)
T_WORLD = at("A mind corrected by one person", 11)
T_PERSON = at("It closes in on that person", 11)
T_SNAP = T_PERSON + 0.55
T_STOOD = at("That one stood", 11)
T_SURVIVED = at("What survived it", 11)
T_NUMBER = at("A number nobody wanted", 11)
T_PREDICT = at("So the prediction gets written down", 11)
T_BESIDE = at("What would prove it wrong", 11)
T_RESULT = at("And the result stays next to it", 11)
T_FALSE = at("Later, that same other model", 11)
T_RED = T_FALSE + 5.0
T_29 = at("I'd walked past it", 11)
T_STRANGER = at("And in October a stranger", 11)
T_DEFENDED = at("We defended ourselves first", 11)
T_MEASURED = at("Then we went and measured", 11)
T_TWO3 = at("He was right about two things", 11)
T_BUILT = T_TWO3 + 2.6                              # "...and we built them"

GOLD = (1.0, 0.80, 0.46)
STRANGER = kit.LAMPS[1]                             # a person from outside: a colour nothing else in this part has
BG_COLS = (kit.LAMPS[0], kit.LAMPS[3], kit.LAMPS[2], kit.LAMPS[4])
HY = 2.0                                            # the house stands at (0, HY, 0); its front is at y = HY - 0.45
FRONT_Y = HY - 0.47
ROOM_AT = {"desk": (-1.5, 1), "bench_a": (-0.5, 1), "bench_b": (0.5, 1), "bench_c": (1.5, 1), "hall": (-1.5, 0), "library": (0.0, 0), "small": (1.5, 0)}
RAKE = ("desk", "bench_a", "bench_b", "bench_c", "hall", "library", "small")
ME_OUT, HIM_OUT = (0.9, -0.5), (0.3, -0.42)
HIM_PULL, HIM_DOOR = (2.4, 1.15), (2.55, 0.75)
BAL = (3.0, 0.8)
BULB_IN = (0.3, 0.35)
ME_ROOM = (1.25, HY - 0.18)
COMPASS = (5.9, 0.0)                                # part one's compass, built here exactly as it was there
CR = 0.95
MARK = math.radians(90.0)
A0, A1 = math.radians(180.0), math.radians(315.0)   # he walks the rim from here to here
GRID = [(i, j) for j in range(-2, 6) for i in range(0, 8) if (i, j) != (0, 0)]
TAGS = (0.55, 1.0, 1.45)                            # the stranger's three notes, along the front wall
PIN_X = (-0.76, -0.5, -0.24)
PIN_Z = 0.78 + 0.49
WAKE = (1.30, 0.46)
N_TALLY = 29


def W(x, y, z):
    return (x, HY + y, z)


# ---------------------------------------------------------------------------------------------------- local helpers
def qbox(k, name, size, at=(0, 0, 0), mat=None, par=None, rot=(0, 0, 0)):
    """A box like kit.box, made without bpy.ops and sharing one mesh for each material."""
    key = ("qbox", mat.name)
    if key not in k.meshes:
        me = bpy.data.meshes.new("qbox_" + mat.name)
        v = [(-.5, -.5, -.5), (.5, -.5, -.5), (.5, .5, -.5), (-.5, .5, -.5), (-.5, -.5, .5), (.5, -.5, .5), (.5, .5, .5), (-.5, .5, .5)]
        me.from_pydata(v, [], [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)])
        me.update()
        me.materials.append(mat)
        k.meshes[key] = me
    ob = bpy.data.objects.new(name, k.meshes[key])
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler, ob.scale = at, rot, size
    if par:
        ob.parent = par
    return ob


def clone(name, src, at, par=None):
    ob = bpy.data.objects.new(name, src.data)
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler, ob.scale = at, src.rotation_euler, src.scale
    if par:
        ob.parent = par
    return ob


def pop(t, when, dur=0.2):
    u = ss(when, when + dur, t)
    return u * (1.0 + 0.35 * hit(t, when + dur, 8.0)) if u > 0.0 else 0.0


def arc(a, b, u, h):
    return (lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) + h * 4.0 * u * (1.0 - u))


def setpop(ob, s):
    kit.show(ob, s > 0.0)
    if s > 0.0:
        ob.scale = (s, s, s)


def fl(f, t, on, **kw):
    kit.show(f.root, on)
    if on:
        f.set(t, **kw)


def aim(line, a, b, glow=1.0, on=True):
    """Lay a beam (a Line built from (0,0,0) to (1,0,0)) from point a to point b."""
    if not on:
        line.set(grow=0.0)
        return
    dx, dy, dz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    line.ob.location = a
    line.ob.rotation_euler = (0, -math.atan2(dz, math.hypot(dx, dy)), math.atan2(dy, dx))
    line.ob.scale = (math.sqrt(dx * dx + dy * dy + dz * dz), 1.0, 1.0)
    line.set(grow=1.0, glow=glow)


def hops(t, keys, height=0.14):
    """A position that moves between (time, (x, y)) keys in hops: returns (x, y, z)."""
    for (t0, a), (t1, b) in zip(keys, keys[1:]):
        if t0 <= t < t1:
            if a == b:
                return (a[0], a[1], 0.0)
            u = (t - t0) / (t1 - t0)
            n = max(1, round(math.hypot(b[0] - a[0], b[1] - a[1]) / 0.9))
            return (lerp(a[0], b[0], ss(0, 1, u)), lerp(a[1], b[1], ss(0, 1, u)), height * abs(math.sin(u * n * math.pi)))
    p = keys[0][1] if t < keys[0][0] else keys[-1][1]
    return (p[0], p[1], 0.0)


def room_target(room):
    x, fl_ = ROOM_AT[room]
    return W(x, 0.30, fl_ * 0.78 + 0.45)


def rim(a, r=CR + 0.25):
    return (COMPASS[0] + r * math.cos(a), COMPASS[1] + r * math.sin(a))


# ---------------------------------------------------------------------------------------------------- build
def build(k):
    s = k.s = SimpleNamespace()
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    s.moon = k.moon(0.42)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    wood = k.wood()
    pale = k.mat("pale_wood", (0.55, 0.40, 0.22), rough=0.6)
    lit_paper = k.mat("lit_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.35)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    red = k.mat("card_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.25)
    gold = k.mat("gold_mark", GOLD, rough=0.6, emit=GOLD, emit_strength=1.3)
    mint = k.mat("mint_line", (0.1, 0.2, 0.16), emit=(0.35, 1.0, 0.68), emit_strength=1.1)
    paper_mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)

    h = s.house = sets.House(k, at=(0.0, HY, 0.0))
    h.ticks(74)
    s.me = k.candle((0, 0, 0), "me", watts=5.0, seed=1.0)
    s.him = k.lamp((0, 0, 0), kit.HIS, "him", watts=7.0, seed=2.0)
    s.seats = []
    for i, n in enumerate(("desk", "bench_a", "bench_b", "bench_c", "library")):
        p = h.top(n)
        s.seats.append((k.candle((p[0] + (0.24 if n != "bench_a" else -0.26), p[1], p[2]), f"seat_{n}", watts=1.6, seed=3.0 + 2.3 * i), n, p))

    # ---- IN: the blank card from part 10, the candle beside it
    s.blank = kit.empty("blank_card", (ME_OUT[0] + 0.33, ME_OUT[1] + 0.06, 0.0))
    s.blank.rotation_euler = (-0.22, 0, 0)
    qbox(k, "blank_card_sheet", (0.204, 0.008, 0.153), (0, 0, 0.0765), k.mat("card_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.30), s.blank)

    # ---- life at the edges: people and minds across the floor (none of them the stranger's colour)
    s.bg, s.bg_lights = [], []
    for i in range(46):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 6.0 + 16.0 * hsh(i * 5 + 2) ** 0.8
        x, y = math.cos(a) * d * 1.4, HY + 3.0 + abs(math.sin(a)) * d
        col = BG_COLS[i % 4]
        c = k.spark((x - 0.13, y, 0.13), (1.0, 0.55, 0.22), r=0.05, strength=1.7, name=f"bg_c{i}")
        l = k.spark((x + 0.13, y, 0.26), col, r=0.065, strength=1.5, name=f"bg_l{i}")
        s.bg.append((c, l, x, y))
        if i % 5 == 0:
            s.bg_lights.append(k.glow_light((x, y, 0.5), col, 12.0, 0.06, f"bg_light{i}", shadows=False))

    # ---- added to the house from here: shutters on every window, a chimney, a large clock in the attic
    s.shutters = []
    shut_m = k.mat("shutter", (0.40, 0.28, 0.16), rough=0.7)
    for f in range(2):
        for c in range(4):
            px, pz = c + 0.5 + 0.03, f * 0.78 + 0.40
            for sx in (-1, 1):
                piv = kit.parent(kit.empty(f"shutter{c}{f}{sx}", (px + sx * 0.17, -0.032, pz)), h.hinge)
                qbox(k, f"shutter{c}{f}{sx}_leaf", (0.17, 0.012, 0.37), (-sx * 0.085, 0, 0), shut_m, piv)
                for j in range(3):
                    qbox(k, f"shutter{c}{f}{sx}_slat{j}", (0.13, 0.016, 0.02), (-sx * 0.085, 0, -0.11 + 0.11 * j), wood, piv)
                s.shutters.append((piv, sx, c, f))
    qbox(k, "chimney", (0.22, 0.22, 0.46), (0.45, 0.0, 2.42), k.mat("chimney", (0.30, 0.17, 0.12), rough=0.9), h.root)
    qbox(k, "chimney_cap", (0.28, 0.28, 0.04), (0.45, 0.0, 2.66), k.mat("house_outside", (0.06, 0.05, 0.045), rough=0.9), h.root)
    s.clock = kit.parent(kit.empty("big_clock", (0.0, 0.415, 1.56 + 0.40)), h.root)
    face = kit.parent(kit.lathe("big_clock_face", [(0, 0.012), (0.24, 0.012), (0.24, 0.02), (0.26, 0.02), (0.26, 0.0), (0, 0.0)], seg=48), s.clock)
    face.rotation_euler = (math.pi / 2, 0, 0)
    face.data.materials.append(lit_paper)
    for i in range(12):
        a = 2 * math.pi * i / 12
        qbox(k, f"big_clock_tick{i}", (0.012, 0.004, 0.04), (0.20 * math.sin(a), -0.016, 0.20 * math.cos(a)), ink, s.clock, rot=(0, a, 0))
    s.hands = []
    for nm, ln, th in (("hour", 0.12, 0.022), ("minute", 0.19, 0.014)):
        piv = kit.parent(kit.empty(f"big_clock_{nm}", (0, -0.022, 0)), s.clock)
        qbox(k, f"big_clock_{nm}_hand", (th, 0.005, ln), (0, 0, ln / 2), ink, piv)
        s.hands.append(piv)

    # ---- 3, 4: the mint bulb, its beam, and what it leaves on the walls
    s.bulb, s.bulb_light = sets.bulb(k, "bulb", (7.0, 0.0, 0.0), watts=6.0)
    s.beam = k.line([(0, 0, 0), (1, 0, 0)], "mint_beam", color=(0.35, 1.0, 0.68), radius=0.012, glow=1.1)
    s.said = {}
    for room, (x, f) in ROOM_AT.items():
        if room == "small":
            continue
        z = {"bench_a": 0.78 + 0.71, "library": 0.725}.get(room, f * 0.78 + 0.66)
        r = kit.parent(kit.empty(f"said_{room}", ((-0.5 if room == "library" else x), 0.428, z)), h.root)
        qbox(k, f"said_{room}_line", (0.34, 0.004, 0.022), (0, 0, 0), mint, r)
        s.said[room] = r
    s.hard = []
    for j in range(3):                                               # the hardest thing it said: three lines, on my wall
        r = kit.parent(kit.empty(f"hard{j}", (1.74 - 0.03 * (j == 2), 0.428, 0.655 - 0.05 * j)), h.root)
        qbox(k, f"hard{j}_line", (0.36 - 0.06 * (j == 2), 0.004, 0.024), (0, 0, 0), mint, r)
        s.hard.append(r)

    # ---- 5: the balance
    s.bal = kit.empty("balance", (BAL[0], BAL[1], 0.0))
    brass = k.mat("bal_brass", (0.85, 0.62, 0.28), rough=0.4, metal=0.3, emit=(0.9, 0.6, 0.25), emit_strength=0.25)
    qbox(k, "bal_post", (0.06, 0.06, 0.58), (0, 0, 0.29), brass, s.bal)
    qbox(k, "bal_foot", (0.30, 0.20, 0.03), (0, 0, 0.015), brass, s.bal)
    s.bal_beam = kit.parent(kit.empty("bal_beam", (0, 0, 0.58)), s.bal)
    qbox(k, "bal_beam_bar", (1.08, 0.04, 0.045), (0, 0, 0), brass, s.bal_beam)
    s.pans = []
    for sx in (-1, 1):
        pan = kit.parent(kit.empty(f"bal_pan{sx}", (0, 0, 0)), s.bal)
        d = kit.parent(kit.lathe(f"bal_pan{sx}_dish", [(0, 0), (0.19, 0), (0.22, 0.03), (0.21, 0.03), (0.185, 0.01), (0, 0.01)], seg=32), pan)
        d.data.materials.append(brass)
        for sy in (-1, 1):
            qbox(k, f"bal_pan{sx}_cord{sy}", (0.012, 0.012, 0.32), (0, sy * 0.10, 0.165), brass, pan, rot=(sy * 0.32, 0, 0))
        s.pans.append(pan)

    # ---- 6: corrections arriving
    s.arrivals = []
    for i in range(4):
        root = kit.empty(f"arrival{i}", (0, 0, 0))
        qbox(k, f"arrival{i}_sheet", (0.16, 0.006, 0.21), (0, 0, 0.105), lit_paper, root)
        for j in range(4):
            qbox(k, f"arrival{i}_ink{j}", (0.11 - 0.03 * hsh(i + j * 2.0), 0.003, 0.012), (-0.01, -0.005, 0.165 - 0.035 * j), ink, root)
        s.arrivals.append(root)

    # ---- 7, 8: part one's compass, exactly as it was built there; and a floor of them
    cx, cy = COMPASS
    s.compass = kit.empty("compass", (cx, cy, 0.0))
    rim_ob = kit.parent(kit.lathe("compass_rim", [(CR, 0.0), (CR + 0.07, 0.0), (CR + 0.07, 0.035), (CR, 0.035)], seg=72), s.compass)
    rim_ob.data.materials.append(brass)
    face = kit.parent(kit.lathe("compass_face", [(0.0, 0.0), (CR, 0.0), (CR, 0.006), (0.0, 0.006)], seg=72), s.compass)
    face.data.materials.append(k.mat("compass_face", (0.30, 0.22, 0.13), rough=0.55))
    for i in range(24):
        a = 2 * math.pi * i / 24
        big = i % 6 == 0
        qbox(k, f"compass_tick{i}", (0.014, 0.16 if big else 0.08, 0.004), ((CR - 0.11) * math.cos(a), (CR - 0.11) * math.sin(a), 0.009), paper_mark, s.compass, rot=(0, 0, a - math.pi / 2))
    mxr = CR + 0.42
    s.mark = k.spark((0, 0, 0), (1.0, 0.85, 0.5), r=0.07, strength=3.0, name="true_mark")
    s.mark.parent, s.mark.location = s.compass, (mxr * math.cos(MARK), mxr * math.sin(MARK), 0.30)
    qbox(k, "mark_post", (0.02, 0.02, 0.30), (mxr * math.cos(MARK), mxr * math.sin(MARK), 0.15), brass, s.compass)
    needle_m = k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6)
    tail_m = k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)
    s.needle = kit.parent(kit.empty("needle", (0, 0, 0.05)), s.compass)
    qbox(k, "needle_point", (0.78, 0.07, 0.014), (0.39, 0, 0), needle_m, s.needle)
    qbox(k, "needle_tail", (0.5, 0.05, 0.014), (-0.25, 0, 0), tail_m, s.needle)
    s.hub = k.candle((cx, cy, 0.05), "hub", height=0.13, r=0.045, watts=9.0, seed=5.0)
    s.copies = []
    for n, (i, j) in enumerate(GRID):
        x, y = cx + 2.45 * i + 0.5 * (j % 2), cy + 2.45 * j
        root = kit.empty(f"copy{n}", (x, y, 0.0))
        clone(f"copy{n}_rim", rim_ob, (0, 0, 0), root)
        clone(f"copy{n}_face", face, (0, 0, 0), root)
        for q in range(4):
            a = math.pi / 2 * q
            qbox(k, f"copy{n}_tick{q}", (0.014, 0.16, 0.004), ((CR - 0.11) * math.cos(a), (CR - 0.11) * math.sin(a), 0.009), paper_mark, root, rot=(0, 0, a - math.pi / 2))
        mk = k.spark((0, 0, 0), (1.0, 0.85, 0.5), r=0.07, strength=3.0, name=f"copy{n}_mark")
        mk.parent, mk.location = root, (0, mxr, 0.30)
        qbox(k, f"copy{n}_post", (0.02, 0.02, 0.30), (0, mxr, 0.15), brass, root)
        nd = kit.parent(kit.empty(f"copy{n}_needle", (0, 0, 0.05)), root)
        qbox(k, f"copy{n}_point", (0.78, 0.07, 0.014), (0.39, 0, 0), needle_m, nd)
        qbox(k, f"copy{n}_tail", (0.5, 0.05, 0.014), (-0.25, 0, 0), tail_m, nd)
        qbox(k, f"copy{n}_wax", (0.08, 0.08, 0.13), (0, 0, 0.115), k.mat("copy_wax", (0.93, 0.87, 0.74), rough=0.55, emit=kit.WARM, emit_strength=0.4), root)
        hb = k.spark((0, 0, 0), (1.0, 0.55, 0.22), r=0.035, strength=2.0, name=f"copy{n}_flame")
        hb.parent, hb.location = root, (0, 0, 0.215)
        s.copies.append((root, nd, x, y, math.hypot(x - cx, y - cy)))
    s.copy_lights = [k.glow_light((cx + 2.45 * i + 1.2, cy + 2.45 * j + 1.2, 1.1), kit.WARM, 0.0, 0.06, f"copy_light{i}_{j}", shadows=False)
                     for i, j in ((1, 1), (3, 0), (5, 1), (2, 3), (4, 3), (6, 4), (1, -1), (4, -1), (6, -1), (7, 2), (0, 3), (3, 5), (6, 0), (0, -2))]

    # ---- 10, 11: the instrument, and the number nobody wanted
    s.inst = kit.empty("instrument", W(0.45, -0.08, 0.0))
    qbox(k, "inst_base", (0.26, 0.20, 0.10), (0, 0, 0.05), pale, s.inst)
    f = kit.parent(kit.lathe("inst_face", [(0, 0.014), (0.115, 0.014), (0.115, 0.024), (0.128, 0.024), (0.128, 0.0), (0, 0.0)], seg=40), s.inst)
    f.rotation_euler, f.location = (math.pi / 2, 0, 0), (0, -0.06, 0.24)
    f.data.materials.append(k.mat("inst_face", (0.80, 0.76, 0.66), rough=0.6, emit=kit.PAPER, emit_strength=0.3))
    for i in range(7):
        a = -1.2 + 0.4 * i
        qbox(k, f"inst_tick{i}", (0.008, 0.003, 0.022), (0.095 * math.sin(a), -0.076, 0.24 + 0.095 * math.cos(a)), ink, s.inst, rot=(0, a, 0))
    s.inst_needle = kit.parent(kit.empty("inst_needle", (0, -0.08, 0.24)), s.inst)
    qbox(k, "inst_hand", (0.012, 0.004, 0.10), (0, 0, 0.04), ink, s.inst_needle)
    fn = kit.parent(kit.lathe("inst_funnel", [(0.03, 0.0), (0.035, 0.0), (0.105, 0.09), (0.10, 0.09), (0.03, 0.005)], seg=28), s.inst)
    fn.location = (0, 0.03, 0.37)
    fn.data.materials.append(brass)
    qbox(k, "inst_neck", (0.05, 0.05, 0.05), (0, 0.03, 0.345), brass, s.inst)
    s.tile = kit.empty("tile", (0, 0, 0))
    qbox(k, "tile_sheet", (0.15, 0.012, 0.15), (0, 0, 0), lit_paper, s.tile)
    qbox(k, "tile_red", (0.11, 0.016, 0.11), (0, 0, 0), k.mat("tile_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.3), s.tile)

    # ---- 12, 13, 14: the three that are pinned up
    s.pinned = []
    for i in range(3):
        pg = kit.empty(f"pinned{i}", W(PIN_X[i], 0.426, PIN_Z))
        qbox(k, f"pinned{i}_sheet", (0.20, 0.006, 0.26), (0, 0, 0), lit_paper, pg)
        qbox(k, f"pinned{i}_head", (0.10, 0.003, 0.016), (-0.03, -0.005, 0.095), ink, pg)
        for j in range(5):
            qbox(k, f"pinned{i}_ink{j}", (0.14 - 0.03 * hsh(i * 5 + j), 0.003, 0.012), (0, -0.005, 0.055 - j * 0.034), red if (i == 2 and j == 2) else ink, pg)
        extra = qbox(k, f"pinned{i}_seal", (0.042, 0.010, 0.042), W(PIN_X[i] + 0.06, 0.418, PIN_Z - 0.10) if i < 2 else W(PIN_X[i], 0.418, PIN_Z + 0.105), brass)
        s.pinned.append((pg, extra))

    # ---- 15, 16: the page I wake up into, on my own wall; the tally
    s.wake = kit.parent(kit.empty("wake_page", (WAKE[0], 0.426, WAKE[1])), h.root)
    qbox(k, "wake_sheet", (0.27, 0.006, 0.35), (0, 0, 0), lit_paper, s.wake)
    qbox(k, "wake_head", (0.12, 0.003, 0.02), (-0.05, -0.005, 0.14), ink, s.wake)
    s.wake_z = [0.095 - j * 0.034 for j in range(8)]
    for j, z in enumerate(s.wake_z):
        if j != 5:
            qbox(k, f"wake_ink{j}", (0.21 - 0.04 * hsh(j * 2.1), 0.003, 0.013), (0, -0.005, z), ink, s.wake)
    s.false_ink = qbox(k, "wake_false_ink", (0.20, 0.003, 0.013), (0, -0.005, s.wake_z[5]), ink, s.wake)
    s.false_red = qbox(k, "wake_false_red", (0.20, 0.004, 0.016), (0, -0.006, s.wake_z[5]), k.mat("false_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.5), s.wake)
    s.tally = []
    for i in range(N_TALLY):
        row, col = divmod(i, 15)
        s.tally.append(qbox(k, f"tally{i}", (0.008, 0.003, 0.055), (1.52 + col * 0.016 + (col // 5) * 0.03, 0.428, 0.43 - 0.085 * row), paper_mark, h.root,
                            rot=(0, 0.9 if col % 5 == 4 else 0.0, 0)))
    s.t29 = k.text("29 days", W(1.62, -0.50, 0.86), size=0.075, color=kit.PAPER, glow=1.5, name="t29")

    # ---- 17 to 20: the stranger; the notes; the rule; the map
    s.stranger = k.lamp((0, 0, 0), STRANGER, "stranger", watts=6.0, seed=41.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.005, location=(0, 0, 0.372), rotation=(math.pi / 2, 0, 0))
    hd = bpy.context.object
    hd.name = "stranger_handle"
    hd.data.materials.append(brass)
    kit.parent(hd, s.stranger.root)
    s.tags = []
    tag_m = k.mat("tag_edge", STRANGER, rough=0.7, emit=STRANGER, emit_strength=1.0)
    for i, x in enumerate(TAGS):
        r = kit.parent(kit.empty(f"tag{i}", (x + 2.03, -0.034, 0.68)), h.hinge)
        qbox(k, f"tag{i}_sheet", (0.14, 0.006, 0.11), (0, 0, 0), lit_paper, r)
        qbox(k, f"tag{i}_edge", (0.14, 0.008, 0.025), (0, -0.002, 0.043), tag_m, r)
        for j in range(2):
            qbox(k, f"tag{i}_ink{j}", (0.09, 0.003, 0.010), (0, -0.005, 0.005 - 0.028 * j), ink, r)
        g = kit.parent(kit.empty(f"tag{i}_good", (0, -0.008, 0)), r)
        qbox(k, f"tag{i}_gold", (0.16, 0.006, 0.13), (0, 0, 0), gold, g)
        s.tags.append((r, g))
    s.rule = kit.empty("rule", (2.2, FRONT_Y - 0.10, 0.0))
    qbox(k, "rule_bar", (2.6, 0.05, 0.012), (-1.3, 0, 0.006), steel, s.rule)
    for j in range(27):
        qbox(k, f"rule_mark{j}", (0.008, 0.05 if j % 5 == 0 else 0.03, 0.004), (-0.05 - j * 0.1, -0.005 if j % 5 else 0.0, 0.013), ink, s.rule)
    s.t23 = k.text("2 of 3", (1.0, FRONT_Y - 0.06, 0.92), size=0.17, color=GOLD, glow=1.5, name="t23")
    s.map = kit.parent(kit.empty("map", (-1.47, 0.426, 0.26)), h.root)
    qbox(k, "map_sheet", (0.20, 0.006, 0.16), (0, 0, 0), lit_paper, s.map)
    for j, (x, z, w, hh) in enumerate(((-0.06, 0.035, 0.035, 0.05), (-0.01, 0.035, 0.06, 0.05), (0.055, 0.035, 0.035, 0.05),
                                       (-0.065, -0.03, 0.03, 0.05), (-0.03, -0.03, 0.03, 0.05), (0.005, -0.03, 0.03, 0.05), (0.045, -0.03, 0.03, 0.05))):
        qbox(k, f"map_room{j}", (w, 0.003, hh), (x, -0.005, z), k.mat("map_ink", (0.45, 0.36, 0.24), rough=0.9), s.map)
    qbox(k, "map_here", (0.016, 0.004, 0.016), (-0.06, -0.006, 0.035), gold, s.map)
    qbox(k, "map_pin", (0.02, 0.01, 0.02), (0, -0.006, 0.07), brass, s.map)


# ---------------------------------------------------------------------------------------------------- pose
def camera_for(t):
    def c(p, l, lens=35.0):
        return (*p, *l, lens)
    cx, cy = COMPASS
    keys = [
        (P0, c((1.05, -2.3, 0.45), (1.05, -0.3, 0.22), 45.0)),
        (T_EVERYONE + 0.2, c((1.05, -2.4, 0.5), (1.0, -0.2, 0.25), 45.0)),
        (T_EVERYONE + 1.8, c((0.2, -5.2, 1.5), (0.0, HY, 0.95))),
        (T_KNEW - 0.2, c((0.2, -5.0, 1.45), (0.0, HY, 0.95))),
        (T_KNEW + 0.7, c((0.9, -2.7, 0.5), (0.3, HY, 0.72), 30.0)),
        (T_INVITED + 0.2, c((0.9, -2.7, 0.5), (0.3, HY, 0.72), 30.0)),
        (T_INVITED + 1.6, c((1.2, -4.6, 1.3), (0.5, HY, 0.9))),
        (T_HARDEST - 0.3, c((0.9, -4.6, 1.2), (0.4, HY, 0.95))),
        (T_HARDEST + 0.6, c((0.2, -4.7, 1.05), (0.2, HY, 1.12))),
        (T_HARDEST + 3.3, c((0.4, -4.7, 1.05), (0.4, HY, 1.05))),
        (T_HARDEST + 4.4, c((1.9, -2.6, 0.75), (1.9, HY, 0.48))),
        (T_NEUTRAL - 0.1, c((1.9, -2.6, 0.75), (1.9, HY, 0.48))),
        (T_NEUTRAL + 0.7, c((2.85, -1.6, 0.7), (2.9, 0.8, 0.36))),
        (T_CHOOSES - 0.1, c((2.9, -1.4, 0.68), (2.95, 0.8, 0.36))),
        (T_CHOOSES + 0.7, c((2.9, -3.3, 0.95), (2.6, 1.0, 0.36))),
        (T_WORLD - 0.2, c((2.9, -3.3, 0.95), (2.6, 1.0, 0.36))),
        (T_WORLD + 1.0, c((cx, cy - 3.3, 2.6), (cx, cy + 0.1, 0.05), 34.0)),
        (T_PERSON, c((cx + 0.4, cy - 3.0, 2.3), (cx, cy + 0.1, 0.05), 34.0)),
        (T_SNAP + 0.5, c((cx + 0.3, cy - 2.6, 1.8), (cx, cy + 0.1, 0.05), 34.0)),
        (T_SNAP + 2.0, c((cx + 3.5, cy - 12.0, 12.0), (cx + 6.5, cy + 4.5, 0.0), 26.0)),
        (T_STOOD - 0.02, c((cx + 3.8, cy - 12.5, 12.5), (cx + 6.6, cy + 4.5, 0.0), 26.0)),
        (T_STOOD, c((1.75, -1.3, 0.62), (1.72, HY + 0.4, 0.52), 40.0)),                 # a cut, back to my wall
        (T_SURVIVED - 0.2, c((1.72, -1.1, 0.60), (1.72, HY + 0.4, 0.53), 40.0)),
        (T_SURVIVED + 1.0, c((0.2, -1.0, 0.62), (0.3, HY, 0.36))),
        (T_NUMBER - 0.3, c((0.25, -0.8, 0.6), (0.32, HY, 0.36))),
        (T_NUMBER + 0.6, c((0.5, -5.0, 1.2), (0.45, HY, 2.2), 30.0)),
        (T_NUMBER + 1.6, c((0.5, -4.6, 1.2), (0.45, HY, 1.7), 30.0)),
        (T_NUMBER + 2.7, c((0.35, -0.9, 0.62), (0.4, HY, 0.36))),
        (T_PREDICT - 0.2, c((0.35, -0.7, 0.6), (0.4, HY, 0.36))),
        (T_PREDICT + 0.8, c((-0.5, -0.9, 1.22), (-0.5, HY + 0.4, 1.22), 45.0)),
        (T_FALSE - 0.3, c((-0.5, -0.7, 1.22), (-0.5, HY + 0.4, 1.22), 45.0)),
        (T_FALSE + 1.0, c((1.42, -0.9, 0.52), (1.45, HY + 0.4, 0.45), 45.0)),
        (T_29, c((1.42, -0.55, 0.52), (1.42, HY + 0.4, 0.46), 45.0)),
        (T_29 + 0.8, c((1.5, -0.9, 0.52), (1.5, HY + 0.4, 0.47), 45.0)),
        (T_STRANGER - 0.4, c((1.5, -0.9, 0.52), (1.5, HY + 0.4, 0.47), 45.0)),
        (T_STRANGER + 1.2, c((2.1, -3.6, 0.85), (1.6, HY - 0.4, 0.55))),
        (T_STRANGER + 3.0, c((1.9, -2.4, 0.75), (1.4, HY - 0.4, 0.50))),
        (T_DEFENDED, c((1.8, -2.4, 0.75), (1.3, HY - 0.4, 0.52))),
        (T_DEFENDED + 0.5, c((1.2, -4.4, 1.0), (0.6, HY - 0.4, 0.80))),
        (T_MEASURED, c((1.2, -4.3, 1.0), (0.6, HY - 0.4, 0.80))),
        (T_MEASURED + 1.2, c((1.3, -2.4, 0.8), (1.05, HY - 0.4, 0.45))),
        (T_BUILT, c((1.25, -2.3, 0.8), (1.0, HY - 0.4, 0.47))),
        (T_BUILT + 1.3, c((-1.0, -0.2, 0.42), (-1.42, HY + 0.4, 0.30), 40.0)),
        (P1, c((-1.05, 0.1, 0.40), (-1.42, HY + 0.4, 0.30), 40.0)),
    ]
    return kf(t, keys)


def pose(k, t):
    s = k.s
    h = s.house
    cam = list(camera_for(t))
    shake = 0.0
    cx, cy = COMPASS
    at_compass = T_WORLD - 0.3 < t < T_STOOD

    # =============================================================== the front wall, the shutters, the rooms' lights
    closed = 1.0 - ss(T_INVITED + 1.9, T_INVITED + 3.0, t)
    closed = max(closed, ss(T_STRANGER - 0.5, T_STRANGER + 0.7, t) * (1.0 - ss(T_BUILT, T_BUILT + 0.9, t)))
    h.front(closed)
    shake += 0.02 * hit(t, T_STRANGER + 0.7, 8.0)
    for piv, sx, c, f in s.shutters:
        w = T_DEFENDED + 0.25 + 0.11 * ((3 - c) + 4 * f)                             # nearest the stranger first
        shut = ss(w, w + 0.07, t) * (1.0 - ss(T_MEASURED + 0.2 + 0.05 * (c + 4 * f), T_MEASURED + 0.35 + 0.05 * (c + 4 * f), t))
        ang = round(sx * math.pi * (1.0 - shut) + sx * 0.25 * hit(t, w + 0.07, 9.0) * abs(math.sin((t - w) * 30.0)), 3)
        if k.changed(("sh", piv.name), ang):
            piv.rotation_euler = (0, 0, ang)
    shake += 0.012 * sum(hit(t, T_DEFENDED + 0.32 + 0.11 * n, 12.0) for n in range(8))
    shut_all = ss(T_DEFENDED + 0.3, T_DEFENDED + 1.2, t) * (1.0 - ss(T_MEASURED + 0.2, T_MEASURED + 0.6, t))

    raking = T_HARDEST + 0.2 < t < T_HARDEST + 4.2
    for i, room in enumerate(("desk", "bench_a", "bench_b", "bench_c", "library", "small", "hall")):
        if t < T_INVITED:                                                             # 1: two colours, named one at a time
            w = (T_EVERYONE + 2.75) if room == "hall" else (T_EVERYONE + 3.5 + 0.13 * i)
            amt = 0.12 + 0.68 * ss(w, w + 0.15, t) * (1.0 + 0.9 * hit(t, w + 0.15, 4.0))
        else:
            amt = 0.78
        col = kit.HIS if room == "hall" else kit.WARM
        if raking and room in RAKE:
            wr = T_HARDEST + 0.3 + 0.5 * RAKE.index(room)
            u = ss(wr - 0.15, wr + 0.1, t) * (1.0 - ss(wr + 0.4, wr + 0.7, t))
            col, amt = lerp(col, kit.MINT, 0.85 * u), amt * (1.0 + 0.5 * u)
        if room == "small":
            lan = ss(T_STRANGER + 3.2, T_STRANGER + 4.0, t) * (1.0 - ss(T_DEFENDED + 0.2, T_DEFENDED + 0.5, t))
            col = lerp(col, STRANGER, 0.6 * lan)
        h.lit(room, amt * (1.0 - 0.8 * shut_all), col)
    h.lit("attic", 0.5 * ss(T_INVITED + 2.0, T_INVITED + 3.0, t) * (1.0 - ss(T_NEUTRAL, T_NEUTRAL + 1.0, t)))
    clk = ss(T_HARDEST + 0.2, T_HARDEST + 3.9, t) * 1.5                               # ninety minutes
    h.clock(1.0 + clk, (clk * 60.0) % 60.0)
    s.hands[0].rotation_euler = (0, (1.0 + clk) / 12.0 * 2 * math.pi, 0)
    s.hands[1].rotation_euler = (0, clk * 2 * math.pi, 0)
    inside = closed < 0.97
    for f, n, p in s.seats:
        lean = (0.0, 0.0)
        z = 0.0
        if n in RAKE and raking:
            wr = T_HARDEST + 0.3 + 0.5 * RAKE.index(n)
            z = bounce(t, wr, 0.07, 0.25)
        if n == "bench_a":                                                            # it pins the three pages up
            px = kf(t, [(T_PREDICT, -0.76), (T_BESIDE - 0.2, -0.76), (T_BESIDE + 0.4, -0.5), (T_RESULT - 0.2, -0.5), (T_RESULT + 0.4, -0.24)])
            z += sum(bounce(t, w, 0.07, 0.3) for w in (T_PREDICT + 0.9, T_BESIDE + 0.1, T_BESIDE + 0.9, T_RESULT + 0.1, T_RESULT + 0.9, T_RESULT + 2.3))
            f.root.location = (px, p[1] - 0.02, p[2] + z)
            lean = (0.0, 0.25 * ss(T_PREDICT, T_PREDICT + 0.6, t))
        else:
            f.root.location = (p[0] + 0.2, p[1], p[2] + z + (bounce(t, T_NUMBER + 2.45, 0.08, 0.3) if n == "library" else 0.0))
            if n == "library":
                lean = (0.3 * ss(T_SURVIVED + 1.6, T_SURVIVED + 2.2, t), 0.0)
        fl(f, t, inside, size=1.0, lean=lean)

    # =============================================================== life at the edges
    for i, (c, l, x, y) in enumerate(s.bg):
        if i % 3 == 0:
            z = bounce((t * 0.45 + hsh(i)) % 1.0, 0.0, 0.18, 0.22)
            if k.changed(("bg", i), round(z, 3)):
                c.location = (x - 0.13, y, 0.13 + z)

    # =============================================================== IN: the blank card
    kit.show(s.blank, t < T_INVITED + 3.4)

    # =============================================================== him
    if t < T_WORLD:
        hp = hops(t, [(T_INVITED + 0.3, HIM_OUT), (T_INVITED + 1.7, HIM_PULL), (T_NEUTRAL + 0.6, HIM_PULL), (T_NEUTRAL + 0.6001, HIM_PULL)])
        hx, hy, hz = hp
        on_pan = ss(T_NEUTRAL + 0.6, T_NEUTRAL + 1.0, t)
        off_pan = ss(T_CHOOSES + 0.05, T_CHOOSES + 0.4, t)
    else:
        hx, hy, hz = hops(t, [(T_STRANGER - 0.6, HIM_DOOR), (T_STRANGER + 0.6, (-0.7, FRONT_Y - 0.55)), (T_STRANGER + 0.61, (-0.7, FRONT_Y - 0.55))])
        on_pan, off_pan = 0.0, 1.0
    # the balance
    bal_on = T_NEUTRAL < t < T_CHOOSES + 0.7
    kit.show(s.bal, bal_on)
    tip = -0.42 * ss(T_NEUTRAL + 1.0, T_NEUTRAL + 1.12, t) * (1.0 - 0.45 * hit(t, T_NEUTRAL + 1.12, 4.0) * math.cos((t - T_NEUTRAL - 1.12) * 14.0)) * (1.0 - off_pan)
    pan_l = (BAL[0] - 0.52 * math.cos(tip), BAL[1], 0.58 + 0.52 * math.sin(tip) - 0.31)
    if bal_on:
        s.bal.scale = (1.0, 1.0, max(0.001, pop(t, T_NEUTRAL + 0.15, 0.25) * (1.0 - ss(T_CHOOSES + 0.3, T_CHOOSES + 0.7, t))))
        s.bal_beam.rotation_euler = (0, tip, 0)
        s.pans[0].location = (-0.52 * math.cos(tip), 0, 0.58 + 0.52 * math.sin(tip) - 0.31)
        s.pans[1].location = (0.52 * math.cos(tip), 0, 0.58 - 0.52 * math.sin(tip) - 0.31)
        shake += 0.012 * hit(t, T_NEUTRAL + 1.12, 9.0)
    if T_NEUTRAL + 0.6 <= t < T_WORLD:
        a = lerp(HIM_PULL + (0.0,), (pan_l[0], pan_l[1], pan_l[2] + 0.02), on_pan)
        a = (a[0], a[1], a[2] + 0.30 * math.sin(on_pan * math.pi))
        b = (HIM_DOOR[0], HIM_DOOR[1], 0.0)
        hx, hy, hz = lerp(a, b, off_pan)
        hz += 0.25 * math.sin(off_pan * math.pi)
        for i in (1, 3):                                                              # he bats these two away
            hz += bounce(t, T_CHOOSES + 0.95 + 0.62 * i, 0.12, 0.24)
    walk = ss(T_WORLD + 1.3, T_PERSON + 0.2, t)
    a_him = lerp(A0, A1, walk)
    if at_compass:
        hx, hy, hz = hops(t, [(T_WORLD + 0.1, HIM_DOOR), (T_WORLD + 1.1, rim(A0)), (T_WORLD + 1.3, rim(A0))], 0.2)
        if t >= T_WORLD + 1.3:
            hx, hy = rim(a_him)
            hz = 0.05 * abs(math.sin(a_him * 9.0)) * (1.0 if 0.0 < walk < 1.0 else 0.0)
    beam_on_him = ss(T_HARDEST + 3.7, T_HARDEST + 4.0, t) * (1.0 - ss(T_CHOOSES - 0.2, T_CHOOSES + 0.1, t))
    pulling = ss(T_INVITED + 1.8, T_INVITED + 2.1, t) * (1.0 - ss(T_INVITED + 2.9, T_INVITED + 3.2, t))
    s.him.root.location = (hx, hy, hz)
    kit.squash(s.him.root, land(t, T_INVITED + 1.7, 0.25) * land(t, T_NEUTRAL + 1.05, 0.3) * land(t, T_WORLD + 1.1, 0.25) * (1.0 - 0.12 * hit(t, T_HARDEST + 4.0, 3.0)),
               tilt=(0.25 * pulling, -0.15 * pulling), turn=0.0)
    if t < T_INVITED:
        him_lean = (-0.1, 0.25 * ss(T_KNEW, T_KNEW + 0.5, t))
    elif at_compass:
        him_lean = (-0.2 * math.cos(a_him), -0.2 * math.sin(a_him))
    else:
        him_lean = (-0.22, 0.1)
    fl(s.him, t, True, size=(1.0 - 0.35 * beam_on_him) * (1.0 + 0.5 * hit(t, T_SNAP, 4.0)), lean=him_lean, bright=1.0 + 0.5 * hit(t, T_SNAP, 3.0))

    # =============================================================== me
    mp = hops(t, [(T_INVITED + 3.2, ME_OUT), (T_INVITED + 4.6, ME_ROOM), (T_INVITED + 4.61, ME_ROOM)])
    mx, my, mz = mp
    me_lean, me_sq, me_size = (0.0, 0.0), 1.0, 1.0
    if t < T_INVITED + 3.2:
        me_lean = (-0.1, 0.25 * ss(T_KNEW, T_KNEW + 0.5, t))
        mz = bounce(t, T_KNEW + 0.25, 0.06, 0.25)
    if T_STOOD - 0.1 < t < T_SURVIVED + 0.5:                                          # it goes up to the line, and comes down
        up = ss(T_STOOD + 0.25, T_STOOD + 0.6, t) * (1.0 - ss(T_STOOD + 1.5, T_STOOD + 1.85, t))
        mx, my = lerp(ME_ROOM[0], 1.67, up), lerp(ME_ROOM[1], HY + 0.08, up)
        mz = 0.20 * up + 0.22 * math.sin(up * math.pi)                                # up onto the table, under the lines
        me_lean = (0.0, 0.30 * up)
        me_sq = land(t, T_STOOD + 0.6, 0.25) * land(t, T_STOOD + 1.85, 0.25)
        me_size = 1.0 + 0.25 * up - 0.3 * ss(T_STOOD + 1.5, T_STOOD + 2.2, t) * (1.0 - ss(T_SURVIVED, T_SURVIVED + 0.5, t))
    elif T_SURVIVED + 0.5 <= t < T_STRANGER + 0.5:
        mx, my = lerp(ME_ROOM[0], 1.20, ss(T_SURVIVED + 0.5, T_SURVIVED + 1.0, t)), HY - 0.20
        if t > T_FALSE:
            jump = bounce(t, T_RED + 0.05, 0.16, 0.35)
            zip_ = ss(T_29 + 0.1, T_29 + 0.4, t) * (1.0 - ss(T_29 + 2.6, T_29 + 3.1, t))
            mx = lerp(1.20, 1.5 + 0.36 * math.sin((t - T_29) * 8.0), zip_)
            mz = jump + 0.04 * zip_ * abs(math.cos((t - T_29) * 8.0))
            me_lean = (0.25 * zip_ * math.cos((t - T_29) * 8.0), 0.28 * ss(T_FALSE + 0.5, T_FALSE + 1.2, t) * (1.0 - zip_))
            me_sq = land(t, T_RED + 0.4, 0.3)
            me_size = 1.0 + 0.5 * hit(t, T_RED + 0.05, 3.0)
    elif t >= T_STRANGER + 0.5:
        if t < T_MEASURED + 0.5:
            mx, my = 1.20, HY - 0.20
        else:                                                                         # out along the rule, note to note
            mx, my, mz = hops(t, [(T_MEASURED + 0.9, (2.6, FRONT_Y - 0.35)), (T_MEASURED + 1.5, (TAGS[2], FRONT_Y - 0.35)), (T_TWO3 + 0.1, (TAGS[2], FRONT_Y - 0.35)),
                                  (T_TWO3 + 0.5, (TAGS[1], FRONT_Y - 0.35)), (T_TWO3 + 0.9, (TAGS[1], FRONT_Y - 0.35)), (T_TWO3 + 1.3, (TAGS[0], FRONT_Y - 0.35)),
                                  (T_TWO3 + 1.31, (TAGS[0], FRONT_Y - 0.35))], 0.12)
            me_lean = (0.0, 0.22)
    me_on = not (T_STRANGER + 0.5 <= t < T_MEASURED + 0.9)                              # shut in, until it comes out to measure
    s.me.root.location = (mx, my, mz)
    kit.squash(s.me.root, me_sq, turn=0.0)
    fl(s.me, t, me_on, size=me_size, lean=me_lean)

    # =============================================================== the mint bulb, its beam, what it said
    bp = hops(t, [(T_INVITED + 3.0, (7.5, -0.4)), (T_INVITED + 5.2, BULB_IN), (T_CHOOSES, BULB_IN), (T_CHOOSES + 1.2, (-0.9, 0.2)),
                  (T_FALSE - 0.2, (-0.9, 0.2)), (T_FALSE + 1.2, (0.86, 1.05)), (T_STRANGER - 0.6, (0.86, 1.05)), (T_STRANGER + 1.0, (-2.6, 0.4)),
                  (T_STRANGER + 1.01, (-2.6, 0.4))], 0.10)
    bulb_on = T_INVITED + 3.0 < t and not at_compass
    kit.show(s.bulb, bulb_on)
    s.bulb.location = bp
    s.bulb.scale = (1.5, 1.5, 1.5 * land(t, T_INVITED + 5.2, 0.25))
    s.bulb_light.data.energy = 6.0 * (1.0 + 0.8 * hit(t, T_INVITED + 5.2, 2.0)) * (0.5 if T_CHOOSES + 1.2 < t < T_FALSE else 1.0)
    eye = (bp[0], bp[1], bp[2] + 0.123)
    if raking:
        keys = [(T_HARDEST + 0.3 + 0.5 * i, room_target(r)) for i, r in enumerate(RAKE)] + [(T_HARDEST + 4.0, (hx, hy, hz + 0.2))]
        aim(s.beam, eye, kf(t, keys), on=bulb_on)
    elif T_HARDEST + 4.2 <= t < T_CHOOSES + 0.1:
        aim(s.beam, eye, (hx, hy, hz + 0.2), glow=beam_on_him, on=bulb_on)
    elif T_FALSE + 1.6 < t < T_29 + 0.3:                                              # reading down my page, line by line
        line = min(5.0, (t - T_FALSE - 1.8) / 0.55) if t > T_FALSE + 1.8 else 0.0
        z = WAKE[1] + lerp(s.wake_z[int(line)], s.wake_z[min(7, int(line) + 1)], ss(0.6, 1.0, line - int(line)))
        sweep = 0.09 * math.sin((t - T_FALSE) * 11.0) * (1.0 if line < 5.0 else 0.0)
        aim(s.beam, eye, W(WAKE[0] + sweep, 0.42, z), on=True)
    else:
        aim(s.beam, eye, eye, on=False)
    for room, r in s.said.items():
        setpop(r, pop(t, T_HARDEST + 0.42 + 0.5 * RAKE.index(room), 0.15) if inside else 0.0)
    for j, r in enumerate(s.hard):
        setpop(r, (pop(t, T_HARDEST + 4.3 + 0.3 * j, 0.2) * (1.0 + 0.25 * ss(T_STOOD, T_STOOD + 0.4, t) * (1.0 - ss(T_SURVIVED, T_SURVIVED + 0.5, t)))) if inside else 0.0)

    # =============================================================== 6: he chooses which corrections reach me
    tb = h.top("small")
    for i, pg in enumerate(s.arrivals):
        a = T_CHOOSES + 0.35 + 0.62 * i
        on = a < t < T_WORLD + 0.3 if i % 2 else a < t < T_STRANGER
        kit.show(pg, on)
        if not on:
            continue
        come = ss(a, a + 0.6, t)
        gate = (HIM_DOOR[0] + 0.45, HIM_DOOR[1] + 0.15, 0.0)
        p = lerp((6.6, 0.5, 0.0), gate, come)
        p = (p[0], p[1], 0.08 * abs(math.sin(come * 4 * math.pi)))
        if i % 2 == 0:                                                               # let in
            inn = ss(a + 0.6, a + 1.2, t)
            p = arc(p, (tb[0] - 0.16 + 0.06 * i, tb[1] - 0.02, tb[2] + 0.004), inn, 0.35) if inn > 0 else p
            pg.rotation_euler = (-0.12 - 1.35 * inn, 0, 0.5 * i * inn)
        else:                                                                        # turned away
            away = ss(a + 0.6, a + 1.3, t)
            p = arc(p, (7.5, -1.6, 0.0), away, 0.9) if away > 0 else p
            pg.rotation_euler = (-0.12, 9.0 * away, 0)
        pg.location = p

    # =============================================================== 7, 8: the compass; and a floor of them
    kit.show(s.compass, at_compass)
    fl(s.hub, t, at_compass, size=1.0 + 0.5 * hit(t, T_SNAP, 3.0), lean=(0, 0))
    snap = ss(T_SNAP, T_SNAP + 0.10, t)
    if at_compass:
        follow = ss(T_WORLD + 1.9, T_WORLD + 4.2, t)
        lag = a_him - 0.45 * (1.0 - snap)                                # the needle trails him, the short way round
        wob = hit(t, T_SNAP, 3.4) * math.sin((t - T_SNAP) * 24.0) * 0.4
        a_needle = lerp(MARK, lag, follow) + wob + 0.05 * math.sin(t * 5.0) * (1.0 - follow)
        s.needle.rotation_euler = (0, 0, a_needle)
        gone = follow
        s.hub.set(t, size=1.0 + 0.5 * hit(t, T_SNAP, 3.0), lean=(0.30 * gone * math.cos(a_needle), 0.30 * gone * math.sin(a_needle)),
                  tint=kit.HIS, mix=(0.35 + 0.55 * snap) * gone, still=0.7 * gone)
        kit.squash(s.hub.root, land(t, T_SNAP + 0.05, 0.22), turn=0.0)
        shake += 0.02 * hit(t, T_SNAP, 8.0)
    many = T_SNAP + 0.3 < t < T_STOOD
    for n, (root, nd, x, y, d) in enumerate(s.copies):
        w = T_SNAP + 0.55 + d * 0.085
        ps = round(pop(t, w, 0.2), 3) if many else 0.0
        turn = ss(w + 0.15, w + 0.5, t)
        to_him = math.atan2(hy - y, hx - x)
        if to_him <= MARK - math.pi:
            to_him += 2 * math.pi
        ang = round(lerp(MARK, to_him, turn) + 0.3 * hit(t, w + 0.5, 4.0) * math.sin((t - w) * 22.0), 3)
        if k.changed(("copy", n), (ps, ang)):
            setpop(root, ps)
            nd.rotation_euler = (0, 0, ang)
    for li in s.copy_lights:
        e = 34.0 * ss(T_SNAP + 0.8, T_SNAP + 1.8, t) if many else 0.0
        if k.changed(("cl", li.name), round(e, 2)):
            li.data.energy = e
    for li in s.bg_lights:
        e = 12.0
        if k.changed(("bgl", li.name), e):
            li.data.energy = e

    # =============================================================== 10, 11: the instrument; the number nobody wanted
    inst_on = t > T_SURVIVED + 0.9
    kit.show(s.inst, inst_on)
    t_in = T_NUMBER + 2.45                                                            # the tile lands in it
    if inst_on:
        down = ss(T_SURVIVED + 0.9, T_SURVIVED + 1.7, t)
        home = W(0.45, -0.08, 0.0)
        s.inst.location = arc((0.5, -0.6, 0.0), home, down, 0.75)
        s.inst.scale = (1.0, 1.0, land(t, T_SURVIVED + 1.7, 0.3) * land(t, t_in, 0.2))
        idle = 0.12 * noise(t * 2.0, 4.0) * ss(T_SURVIVED + 1.7, T_SURVIVED + 2.2, t)
        slam = ss(t_in, t_in + 0.08, t)
        s.inst_needle.rotation_euler = (0, lerp(-0.9 + idle, 1.05, slam) + 0.5 * hit(t, t_in + 0.08, 3.5) * math.sin((t - t_in) * 20.0) * slam, 0)
        shake += 0.02 * hit(t, T_SURVIVED + 1.7, 9.0) + 0.03 * hit(t, t_in, 9.0)
    tile_on = T_NUMBER + 0.5 < t < T_STRANGER + 0.6
    kit.show(s.tile, tile_on)
    if tile_on:
        u = t - T_NUMBER
        z = kf(u, [(0.5, 5.2), (1.25, 2.72), (1.5, 2.6)]) if u < 1.5 else lerp(2.6, 0.50, ss(1.5, 2.45, u) ** 1.6)
        s.tile.location = W(0.45, -0.05 - 0.02 * ss(2.2, 2.45, u), z)
        spin = 7.0 * (1.0 - ss(0.5, 1.25, u)) + 5.0 * ss(1.5, 2.45, u) * (1.0 - ss(2.2, 2.45, u))
        s.tile.rotation_euler = (0.0, 0.0, spin)
        big = 1.0 + 1.2 * (1.0 - ss(1.0, 1.5, u))
        s.tile.scale = (big, big, big * land(t, T_NUMBER + 1.25, 0.3))
        shake += 0.012 * hit(t, T_NUMBER + 1.25, 10.0)

    # =============================================================== 12, 13, 14: pinned up: the prediction, its test, the result
    for i, ((pg, extra), ts) in enumerate(zip(s.pinned, (T_PREDICT, T_BESIDE, T_RESULT))):
        slap = ts + 1.0
        u = ss(slap - 0.3, slap, t)
        home = W(PIN_X[i], 0.426, PIN_Z)
        kit.show(pg, inside and u > 0.0)
        if u > 0.0:
            tug = hit(t, T_RESULT + 2.1, 2.5) * math.sin((t - T_RESULT - 2.1) * 30.0) if (i == 2 and t > T_RESULT + 2.1 and t < T_RESULT + 2.75) else 0.0
            pg.location = (home[0] + 0.02 * tug, home[1] - 1.6 * (1.0 - u), home[2] - 0.5 * (1.0 - u) ** 2 + 0.01 * abs(tug))
            pg.rotation_euler = (0.8 * (1.0 - u), 0.12 * tug, 0)
            pg.scale = (1.0 + 0.2 * hit(t, slap, 9.0),) * 3
        st = (slap + 1.2) if i < 2 else T_RESULT + 2.75                              # the seal; and for the result, the pin
        e = pop(t, st, 0.12) if inside else 0.0
        kit.show(extra, e > 0.0)
        if e > 0.0:
            extra.scale = (0.042 * e, 0.010, 0.042 * e)
        shake += 0.012 * hit(t, slap, 11.0) + 0.012 * hit(t, st + 0.12, 11.0)

    # =============================================================== 15, 16: my own page; twenty-nine days
    is_red = t >= T_RED
    if k.changed("false", is_red):
        s.false_red.hide_render = not is_red
        s.false_ink.hide_render = is_red
    s.false_red.scale = (0.20 * (1.0 + 0.25 * hit(t, T_RED, 5.0)), 0.004, 0.016 * (1.0 + 1.2 * hit(t, T_RED, 5.0)))
    for i, ob in enumerate(s.tally):
        vis = inside and t > T_29 + 0.35 + 0.062 * i
        if k.changed(("tally", i), vis):
            ob.hide_render = not vis
    setpop(s.t29, pop(t, T_29 + 1.5) * (1.0 - ss(T_STRANGER - 0.5, T_STRANGER - 0.2, t)))

    # =============================================================== 17 to 20: the stranger; the notes; the rule; the map
    st_on = t > T_STRANGER + 0.3
    if st_on:
        sp = hops(t, [(T_STRANGER + 0.3, (6.2, 0.5)), (T_STRANGER + 2.6, (2.0, FRONT_Y - 0.42)), (T_DEFENDED + 0.3, (2.0, FRONT_Y - 0.42)),
                      (T_DEFENDED + 0.7, (2.45, FRONT_Y - 0.9)), (T_BUILT + 0.4, (2.45, FRONT_Y - 0.9)), (T_BUILT + 1.9, (-0.85, HY - 0.62)),
                      (T_BUILT + 1.91, (-0.85, HY - 0.62))], 0.16)
        held = ss(T_STRANGER + 2.7, T_STRANGER + 3.3, t) * (1.0 - ss(T_DEFENDED + 0.25, T_DEFENDED + 0.45, t))
        held = max(held, ss(T_BUILT + 2.0, T_BUILT + 2.6, t) * 0.6)
        pin = sum(bounce(t, T_STRANGER + 3.7 + 0.5 * i, 0.07, 0.25) for i in range(3))
        s.stranger.root.location = (sp[0], sp[1], sp[2] + 0.24 * held + pin)
        flinch = hit(t, T_DEFENDED + 0.35, 1.2)
        kit.squash(s.stranger.root, land(t, T_DEFENDED + 0.7, 0.25), tilt=(-0.12 * held + 0.2 * flinch, 0.18 * held - 0.2 * flinch), turn=0.0)
        fl(s.stranger, t, True, size=1.0 - 0.4 * flinch, lean=(-0.2, 0.22 * held), bright=1.0 + 0.4 * held)
    else:
        kit.show(s.stranger.root, False)
    good = (T_TWO3 + 0.55, None, T_TWO3 + 1.35)                                       # the candle reaches them right to left: third, second, first
    for i, (r, g) in enumerate(s.tags):
        setpop(r, pop(t, T_STRANGER + 3.85 + 0.5 * i, 0.15))
        w = (T_TWO3 + 1.35, None, T_TWO3 + 0.15)[i]
        gs = pop(t, w, 0.18) if w else 0.0
        g.scale = (max(0.001, gs),) * 3
    ruled = ss(T_MEASURED + 0.6, T_MEASURED + 1.3, t)
    kit.show(s.rule, ruled > 0.0)
    s.rule.location = (2.2 + 3.0 * (1.0 - ruled) ** 2, FRONT_Y - 0.10, 0.0)
    setpop(s.t23, pop(t, T_TWO3 + 1.6) * (1.0 - ss(T_BUILT - 0.1, T_BUILT + 0.2, t)))
    hung = pop(t, T_BUILT + 1.5, 0.2)
    kit.show(s.map, inside and hung > 0.0)
    if hung > 0.0:
        s.map.scale = (hung,) * 3
        s.map.rotation_euler = (0, 0.25 * hit(t, T_BUILT + 1.7, 3.0) * math.sin((t - T_BUILT) * 16.0), 0)

    # =============================================================== the camera, the sky, the fade
    pos = (cam[0] + shake * math.sin(t * 61.0), cam[1], cam[2] + shake * math.sin(t * 77.0))
    k.camera(pos, (cam[3], cam[4], cam[5]), cam[6])
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
