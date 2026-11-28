"""Part 10, "What we threw away" (film 871.30 to 975.00 s). SECOND STAGING: one picture for each sentence.

The whole part is one walk along a long open shelf of failed things (it runs along +X, behind everything). Each thing that
did not work is acted out on the floor in front of the shelf, and when its sentence is over it is thrown up onto the shelf
and a red card pops up beside it. The first staging is kept at parts_old/p10_threw_away_v1_bare.py.

THE PICTURES, in order (x is where along the shelf):
   1 "Here's what didn't work"        from the loop (part 9's last picture) the camera swings to look down the shelf;
                                      failed things drop onto it one after another, a red card beside each
   2 "as carefully as the other"      two ledgers rise side by side; entries go into each in turn, one for one
   3 "a reminder"                     a bell swings in over one row of five small candles and not over the next
   4 "broke it a little more often"   a line on the floor: three of the belled row hop over it, two of the other.
                                      The bell is thrown on the shelf: red card.
   5 "a second opinion"               the mint bulb slides in
   6 "a test that could say no"       a gate goes up between us, its bar raised, a sealed page on its post
   7 "It said no"                     the bulb's light reaches for me; the bar slams down across it. Shelf, red card.
   8 "a second reader"                spectacles on a stand; pages slide past under them
   9 "half of everything"             three of six get a red flag; turned over, one of the three has a crack; the other
                                      two flags drop off
  10 "a rule written before it ran"   the sealed page beside it opens; the spectacles are thrown on the shelf: red card
  11 "we carried our whole conversations"  * a candle hauls an enormous scroll from one machine to another far off,
                                      heave by heave, the paper trailing behind it, moons going over (months)
  12 "Then we tested it"              a table slams down; a bookcase rises behind it
  13 "only the room ... thirty-four"  a candle wakes at the table; question cards rain in: 34
  14 "thirty-two and a half"          it runs to the bookcase for every card; the cards light: 32 1/2, then 33 1/2
  15 "the entire conversation"        another drops in, the scroll wound round it
  16 "twenty, twice"                  its cards: 20, 20
  17 "never went to the shelf"        it reads its own scroll; a book slides out right beside it and glows; it never looks
  18 "the grader was one of us"       the marking board with the pen over it falls flat: a candle like the rest
  19 "we stopped carrying"            the candle hops out of the scroll; the scroll is thrown on the shelf: red card
  20 "instrumented for failure"       a wall of dials, a red card under every one; then one small dark dial, a blank card
  21 "He was right about that too"    the candle goes and stands by the blank one
OUT: the candle beside one blank card, the blue lamp near. Fade.

LOCAL HELPERS (the kit lacked them): qbox (a box made without bpy.ops, sharing one mesh per material, so hundreds are
cheap and a card can change state by swapping its mesh), pop, arc.
"""
import math
from types import SimpleNamespace

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(10)
T_DIDNT = at("Here's what didn't work", 10)
T_LIST = at("We keep that list", 10)
T_REMIND = at("We thought a reminder", 10)
T_BROKE = at("The ones we reminded", 10)
T_OPINION = at("I wanted a second opinion", 10)
T_AGREED = at("We agreed first on a test", 10)
T_NO = at("It said no", 10)
T_DROP = T_NO + 0.55                               # the bar comes down on "no"
T_READER = at("We added a second reader", 10)
T_HALF = at("It flagged half of everything", 10)
T_DROPPED = at("It was dropped by a rule", 10)
T_CARRIED = at("For months we carried", 10)
T_TESTED = at("Then we tested it", 10)
T_WOKE = at("One of us woke with only the room", 10)
T_SCORE1 = at("It got thirty-two and a half", 10)
T_ANOTHER = at("Another carried the entire", 10)
T_SCORE2 = at("It got twenty, twice", 10)
T_TRUSTED = at("It trusted what it remembered", 10)
T_GRADER = at("One grader marked that", 10)
T_STOPPED = at("But we stopped carrying", 10)
T_SUCCESS = at("He once said the room", 10)
T_BARELY = T_SUCCESS + 4.3                          # "...and barely at all for success"
T_RIGHT = at("He was right about that too", 10)

GOLD = (1.0, 0.80, 0.46)
SHY, SHZ = 1.5, 0.5                                 # the shelf of failures: its y, and the height of its top
X_LOOP, X_LEDG, X_BELL, X_GATE, X_SPEC = -2.6, 0.3, 3.0, 6.0, 9.0
X_HA, X_HB = 12.0, 16.9                             # the haul: from one machine to the other
X_TEST, X_WALL, X_BLANK = 20.0, 24.2, 26.1
SLOTS = (X_BELL, X_GATE, X_SPEC, 20.95)             # places on the shelf kept empty for what gets thrown there
N_Q = 34
HEAVES = 8
B_SET1 = set(sorted(range(N_Q), key=lambda i: hsh(i * 7.3))[:20])
B_SET2 = set(sorted(range(N_Q), key=lambda i: hsh(i * 3.9 + 11.0))[:20])
ME_KEYS = [(P0, (-1.75, -0.35)), (T_DIDNT + 0.6, (-1.75, -0.35)), (T_LIST + 0.7, (0.3, -0.15)), (T_REMIND - 0.4, (0.3, -0.15)),
           (T_REMIND + 0.9, (1.72, -0.55)), (T_OPINION - 0.3, (1.72, -0.55)), (T_OPINION + 0.9, (5.0, -0.35)),
           (T_READER - 0.3, (5.0, -0.35)), (T_READER + 0.9, (7.95, -0.2)), (T_CARRIED - 0.5, (7.95, -0.2)),
           (T_CARRIED + 0.45, (12.75, 0.0)), (T_TESTED - 0.2, (17.05, 0.0)), (T_TESTED + 1.2, (18.62, -0.2)),
           (T_SUCCESS - 0.3, (18.62, -0.2)), (T_SUCCESS + 1.3, (22.95, -0.5)), (T_BARELY - 0.2, (22.95, -0.5)),
           (T_BARELY + 1.2, (24.95, -0.35)), (T_RIGHT + 0.3, (24.95, -0.35)), (T_RIGHT + 1.3, (25.72, 0.42)), (P1, (25.72, 0.42))]


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


def pop(t, when, dur=0.2):
    """0 before `when`; grows to 1 with a little overshoot."""
    u = ss(when, when + dur, t)
    return u * (1.0 + 0.35 * hit(t, when + dur, 8.0)) if u > 0.0 else 0.0


def arc(a, b, u, h):
    """From a to b along a thrown arc of height h."""
    return (lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) + h * 4.0 * u * (1.0 - u))


def setpop(ob, s):
    kit.show(ob, s > 0.0)
    if s > 0.0:
        ob.scale = (s, s, s)


def fl(f, t, on, **kw):
    kit.show(f.root, on)
    if on:
        f.set(t, **kw)


def card(k, name, at, blank=False, size=1.0):
    """A small standing card. Red band = this was found wrong. Blank = nothing measured it."""
    root = kit.empty(name, at)
    root.rotation_euler = (-0.22, 0, 0)
    inner = kit.parent(kit.empty(name + "_in", (0, 0, 0)), root)
    inner.scale = (size, size, size)
    qbox(k, name + "_sheet", (0.12, 0.005, 0.09), (0, 0, 0.045), k.mat("card_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.30), inner)
    if not blank:
        qbox(k, name + "_red", (0.094, 0.005, 0.028), (0, -0.003, 0.058), k.mat("card_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.25), inner)
    return root


def me_xy(t):
    return kf(t, ME_KEYS)


def haul_u(t):
    n = (t - (T_CARRIED + 0.6)) / 0.72
    if n <= 0.0:
        return 0.0, 0.0
    if n >= HEAVES:
        return 1.0, 0.0
    i, f = int(n), n - int(n)
    return (i + ss(0.0, 0.62, f)) / HEAVES, f


# ---------------------------------------------------------------------------------------------------- build
def build(k):
    s = k.s = SimpleNamespace()
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    s.moon = k.moon(0.42)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    wood = k.wood()
    pale = k.mat("pale_wood", (0.55, 0.40, 0.22), rough=0.6)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    lit_paper = k.mat("lit_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.35)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    red = k.mat("card_red", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.25)
    gold = k.mat("gold_mark", GOLD, rough=0.6, emit=GOLD, emit_strength=1.3)
    mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)

    s.me = k.candle((0, 0, 0), "me", watts=5.0, seed=1.0)
    s.him = k.lamp((0, 0, 0), kit.HIS, "him", watts=5.0, seed=2.0)

    # ---- far off: the house he built, and people and minds at their own business (life at the edges)
    s.house = sets.House(k, at=(-5.6, 5.2, 0.0))
    for room in ("hall", "library", "desk", "bench_a", "bench_b", "bench_c", "small"):
        s.house.lit(room, 0.75)
    s.house.lit("attic", 0.0)
    s.bg, s.bg_lights = [], []
    for i in range(44):
        x = -3.0 + 33.0 * hsh(i * 3 + 1)
        y = 4.2 + 12.0 * hsh(i * 5 + 2) ** 0.8
        col = kit.LAMPS[i % len(kit.LAMPS)]
        c = k.spark((x - 0.13, y, 0.13), (1.0, 0.55, 0.22), r=0.05, strength=1.7, name=f"bg_c{i}")
        l = k.spark((x + 0.13, y, 0.26), col, r=0.065, strength=1.5, name=f"bg_l{i}")
        s.bg.append((c, l, x, y))
        if i % 5 == 0:
            s.bg_lights.append((k.glow_light((x, y, 0.5), col, 12.0, 0.06, f"bg_light{i}", shadows=False), x))

    # ---- IN: the loop from part 9, still running, and him at rest beside it
    s.loop = kit.empty("loop", (X_LOOP, 0.25, 0.0))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.62, minor_radius=0.014, location=(0, 0, 0.014), major_segments=64, minor_segments=8)
    rail = bpy.context.object
    rail.name = "loop_rail"
    rail.data.materials.append(brass)
    kit.parent(rail, s.loop)
    s.loop_pages = [qbox(k, f"loop_page{i}", (0.10, 0.13, 0.004), (0, 0, 0.04), lit_paper, s.loop) for i in range(5)]

    # ---- the shelf of failures: long, open, no ropes
    x0, x1 = -1.5, 22.8
    for z in (SHZ - 0.015, 0.20):
        qbox(k, f"shelf_board{z}", (x1 - x0, 0.38, 0.03), ((x0 + x1) / 2, SHY, z), wood)
    for i in range(18):
        qbox(k, f"shelf_leg{i}", (0.05, 0.34, SHZ), (x0 + 0.03 + i * (x1 - x0 - 0.06) / 17, SHY, SHZ / 2), wood)
    s.junk = []
    n = 0
    for i in range(22):
        x = -1.1 + 1.08 * i + 0.2 * (hsh(i * 2.2) - 0.5)
        if min(abs(x - sl) for sl in SLOTS) < 0.62 or x > x1 - 0.3:
            continue
        root = kit.empty(f"junk{n}", (x, SHY, SHZ))
        v = n % 4
        if v == 0:                                                   # a dial whose needle hangs
            qbox(k, f"junk{n}_foot", (0.11, 0.09, 0.02), (0, 0, 0.01), brass, root)
            face = kit.parent(kit.lathe(f"junk{n}_face", [(0, 0), (0.09, 0), (0.09, 0.018), (0, 0.018)], seg=28), root)
            face.rotation_euler, face.location = (math.pi / 2, 0, 0), (0, 0.01, 0.115)
            face.data.materials.append(k.mat("dial_face", (0.62, 0.58, 0.50), rough=0.6, emit=kit.PAPER, emit_strength=0.12))
            qbox(k, f"junk{n}_needle", (0.012, 0.005, 0.075), (0.022, -0.012, 0.088), ink, root, rot=(0, 2.5, 0))
        elif v == 1:                                                 # a box with a lever
            qbox(k, f"junk{n}_box", (0.17, 0.13, 0.12), (0, 0, 0.06), pale, root)
            qbox(k, f"junk{n}_lever", (0.014, 0.014, 0.11), (0.05, 0, 0.15), brass, root, rot=(0, 0.6, 0))
        elif v == 2:                                                 # a funnel
            f = kit.parent(kit.lathe(f"junk{n}_funnel", [(0.014, 0.0), (0.018, 0.06), (0.075, 0.15), (0.08, 0.15), (0.022, 0.058), (0.018, 0.0)], seg=28), root)
            f.data.materials.append(brass)
        else:                                                        # a wheel that turned nothing
            w = kit.parent(kit.lathe(f"junk{n}_wheel", [(0.04, 0), (0.09, 0), (0.09, 0.03), (0.04, 0.03), (0.04, 0)], seg=28), root)
            w.rotation_euler, w.location = (math.pi / 2, 0, 0), (0, 0.015, 0.09)
            w.data.materials.append(steel)
        s.junk.append((root, card(k, f"junk{n}_card", (x + 0.17, SHY - 0.14, SHZ)), x, n))
        n += 1
    s.keepers = []                                                   # small lights along the shelf, so it is never dark
    for i, x in enumerate((-0.6, 1.7, 4.4, 7.4, 10.4, 13.4, 16.2, 19.3, 22.0)):
        k.spark((x, SHY - 0.05, SHZ + 0.075), (1.0, 0.55, 0.22), r=0.022, strength=2.2, name=f"keeper{i}")
        qbox(k, f"keeper_wax{i}", (0.03, 0.03, 0.05), (x, SHY - 0.05, SHZ + 0.025), k.mat("keeper_wax", (0.93, 0.87, 0.74), rough=0.55, emit=kit.WARM, emit_strength=0.3))
        s.keepers.append((k.glow_light((x, SHY - 0.30, SHZ + 0.40), kit.WARM, 7.0, 0.04, f"keeper_light{i}", shadows=False), x))

    # ---- 2: two ledgers, kept with the same care
    s.ledgers = []
    for side, tick in ((-1, red), (1, gold)):
        root = kit.empty(f"ledger{side}", (X_LEDG + side * 0.42, 0.42, 0.0))
        root.rotation_euler = (-0.13, 0, 0)
        qbox(k, f"ledger{side}_board", (0.66, 0.03, 0.84), (0, 0.02, 0.42), wood, root)
        qbox(k, f"ledger{side}_sheet", (0.58, 0.006, 0.74), (0, 0.0, 0.43), lit_paper, root)
        qbox(k, f"ledger{side}_head", (0.34, 0.004, 0.035), (0, -0.005, 0.74), ink, root)
        rows = []
        for i in range(7):
            r = kit.parent(kit.empty(f"ledger{side}_row{i}", (0, -0.005, 0.655 - 0.085 * i)), root)
            qbox(k, f"ledger{side}_tick{i}", (0.055, 0.004, 0.035), (-0.21, 0, 0), tick, r)
            qbox(k, f"ledger{side}_ink{i}", (0.30 - 0.08 * hsh(i * 3 + side), 0.004, 0.016), (0.02, 0, 0), ink, r)
            rows.append(r)
        s.ledgers.append((root, rows))

    # ---- 3, 4: the bell, the two rows, the line
    s.rule_line = kit.empty("rule_line", (X_BELL, 0.0, 0.0))
    qbox(k, "rule_line_bar", (2.3, 0.035, 0.004), (0, 0, 0.002), mark, s.rule_line)
    s.bellrig = kit.empty("bellrig", (1.82, 0.32, 0.0))
    qbox(k, "bell_post", (0.035, 0.035, 0.95), (0, 0, 0.475), brass, s.bellrig)
    qbox(k, "bell_arm", (0.72, 0.028, 0.028), (0.345, 0, 0.94), brass, s.bellrig)
    s.bell = kit.empty("bell", (2.5, 0.32, 0.92))
    b = kit.parent(kit.lathe("bell_body", [(0.0, 0.0), (0.03, -0.004), (0.06, -0.05), (0.08, -0.13), (0.115, -0.185), (0.105, -0.185),
                                            (0.07, -0.125), (0.05, -0.05), (0.0, -0.02)], seg=32), s.bell)
    b.data.materials.append(brass)
    c = kit.parent(kit.lathe("bell_clapper", [(0.0, -0.215), (0.022, -0.20), (0.022, -0.18), (0.0, -0.165)], seg=12), s.bell)
    c.data.materials.append(steel)
    s.bell_card = card(k, "bell_card", (X_BELL + 0.2, SHY - 0.14, SHZ))
    s.minis = []
    for row in range(2):                                             # row 0 is under the bell; row 1 is left alone
        for i in range(5):
            x = (2.1 if row == 0 else 3.3) + 0.2 * i
            s.minis.append((k.candle((x, 0.3, 0.0), f"mini{row}{i}", height=0.10, r=0.022, watts=1.3, seed=20.0 + row * 5 + i), row, i, x))

    # ---- 5, 6, 7: the other company's model, and a test that could say no
    s.bulb, s.bulb_light = sets.bulb(k, "bulb", (9.0, 1.0, 0.0), watts=6.0)
    s.gate = kit.empty("gate", (5.9, 0.25, 0.0))
    for sx in (-1, 1):
        qbox(k, f"gate_post{sx}", (0.055, 0.055, 0.62), (sx * 0.45, 0, 0.31), pale, s.gate)
    s.gate_bar = kit.parent(kit.empty("gate_hinge", (-0.45, 0, 0.60)), s.gate)
    qbox(k, "gate_bar", (0.98, 0.05, 0.05), (0.47, 0, 0), k.mat("bar", (0.80, 0.66, 0.42), rough=0.6, emit=kit.PAPER, emit_strength=0.12), s.gate_bar)
    qbox(k, "gate_weight", (0.09, 0.07, 0.09), (-0.06, 0, 0), brass, s.gate_bar)
    s.gate_page = kit.parent(kit.empty("gate_page", (0.45, -0.04, 0.36)), s.gate)
    qbox(k, "gate_page_sheet", (0.17, 0.005, 0.21), (0, 0, 0), lit_paper, s.gate_page)
    for j in range(3):
        qbox(k, f"gate_page_ink{j}", (0.11, 0.003, 0.012), (0, -0.004, 0.06 - 0.035 * j), ink, s.gate_page)
    qbox(k, "gate_page_seal", (0.045, 0.01, 0.045), (0, -0.007, -0.065), brass, s.gate_page)
    s.gate_card = card(k, "gate_card", (X_GATE + 0.3, SHY - 0.14, SHZ))
    bx, by, mx, my = 6.9, 0.9, 5.0, -0.35
    s.opinion = k.line([(lerp(bx, mx, i / 24), lerp(by, my, i / 24), lerp(0.125, 0.17, i / 24)) for i in range(25)], "opinion", color=(0.35, 1.0, 0.68), radius=0.016, glow=1.1)

    # ---- 8, 9, 10: the second reader
    s.stand = kit.empty("specs_stand", (X_SPEC, 0.32, 0.0))
    qbox(k, "specs_post", (0.035, 0.035, 0.52), (0, 0.02, 0.26), wood, s.stand)
    qbox(k, "specs_foot", (0.20, 0.14, 0.025), (0, 0.02, 0.0125), wood, s.stand)
    s.specs = kit.empty("specs", (X_SPEC, 0.30, 0.60))
    lens = k.mat("lens", (0.80, 0.88, 0.94), rough=0.2, emit=(0.65, 0.75, 0.85), emit_strength=0.25, alpha=0.35)
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.115, minor_radius=0.013, location=(sx * 0.135, 0, 0), rotation=(math.pi / 2, 0, 0), major_segments=32, minor_segments=8)
        ring = bpy.context.object
        ring.name = f"specs_ring{sx}"
        ring.data.materials.append(steel)
        kit.parent(ring, s.specs)
        ln = kit.parent(kit.lathe(f"specs_lens{sx}", [(0, 0), (0.108, 0), (0.108, 0.004), (0, 0.004)], seg=28), s.specs)
        ln.rotation_euler, ln.location = (math.pi / 2, 0, 0), (sx * 0.135, 0.002, 0)
        ln.data.materials.append(lens)
        ln.visible_shadow = False
    qbox(k, "specs_bridge", (0.06, 0.014, 0.014), (0, 0, 0.03), steel, s.specs)
    s.specs_card = card(k, "specs_card", (X_SPEC + 0.36, SHY - 0.14, SHZ))
    s.claims = []
    for i in range(6):
        root = kit.empty(f"claim{i}", (8.35 + 0.26 * i, -0.02, 0.0))
        qbox(k, f"claim{i}_sheet", (0.17, 0.006, 0.24), (0, 0, 0.13), lit_paper, root)
        for j in range(4):
            qbox(k, f"claim{i}_ink{j}", (0.12 - 0.03 * hsh(i + j * 2.0), 0.003, 0.013), (-0.01, -0.005, 0.185 - 0.035 * j), ink, root)
        flag = kit.parent(kit.empty(f"claim{i}_flag", (0, -0.006, 0.262)), root)
        qbox(k, f"claim{i}_flag_red", (0.17, 0.008, 0.045), (0, 0, 0), red, flag)
        if i == 2:                                                   # the one that really had something under it
            for j, (cx, cz, a) in enumerate(((-0.035, 0.18, 0.9), (0.0, 0.13, -0.8), (0.03, 0.085, 0.9), (0.012, 0.045, -0.5))):
                qbox(k, f"claim_crack{j}", (0.075, 0.003, 0.012), (cx, 0.005, cz), ink, root, rot=(0, a, 0))
        s.claims.append((root, flag))
    s.rule_post = kit.empty("rule_post", (9.82, 0.30, 0.0))
    qbox(k, "rule_post_wood", (0.03, 0.03, 0.34), (0, 0.02, 0.17), wood, s.rule_post)
    hinge_z = 0.50
    qbox(k, "rule_lower", (0.24, 0.005, 0.16), (0, 0, hinge_z - 0.08), lit_paper, s.rule_post)
    for j in range(3):
        qbox(k, f"rule_lower_ink{j}", (0.16, 0.003, 0.012), (0, -0.004, hinge_z - 0.04 - 0.04 * j), ink, s.rule_post)
    s.rule_flap = kit.parent(kit.empty("rule_flap", (0, -0.004, hinge_z)), s.rule_post)
    qbox(k, "rule_flap_sheet", (0.24, 0.005, 0.16), (0, -0.004, -0.08), lit_paper, s.rule_flap)
    for j in range(3):
        qbox(k, f"rule_flap_ink{j}", (0.16, 0.003, 0.012), (0, 0.0, -0.04 - 0.04 * j), ink, s.rule_flap)
    s.rule_seal = qbox(k, "rule_seal", (0.055, 0.012, 0.055), (0, 0, 0), brass)

    # ---- 11: the haul: two machines far apart, the scroll, its trail, the months going over
    s.desks, s.screens = [], []
    for j, x in enumerate((X_HA - 0.35, X_HB + 0.45)):
        root = kit.empty(f"desk{j}", (x, 0.62, 0.0))
        qbox(k, f"desk{j}_top", (0.74, 0.46, 0.03), (0, 0, 0.30), wood, root)
        for sx in (-1, 1):
            qbox(k, f"desk{j}_leg{sx}", (0.04, 0.40, 0.29), (sx * 0.32, 0, 0.145), wood, root)
        qbox(k, f"desk{j}_machine", (0.40, 0.26, 0.30), (0, 0.02, 0.465), k.mat("machine", (0.13, 0.12, 0.12), rough=0.5), root)
        m = bpy.data.materials.new(f"screen{j}")
        m.use_nodes = True
        bs = m.node_tree.nodes["Principled BSDF"]
        bs.inputs["Base Color"].default_value = (0.05, 0.05, 0.05, 1)
        bs.inputs["Emission Color"].default_value = (*kit.WARM, 1)
        bs.inputs["Emission Strength"].default_value = 1.6 if j == 0 else 0.0
        qbox(k, f"desk{j}_screen", (0.31, 0.006, 0.20), (0, -0.112, 0.48), m, root)
        s.desks.append(root)
        s.screens.append((bs, k.glow_light((x, 0.25, 0.5), kit.WARM, 0.0, 0.05, f"screen_light{j}", shadows=False)))
    s.roll = kit.empty("roll", (X_HA + 0.3, 0.0, 0.17))
    cyl = kit.parent(kit.lathe("roll_paper", [(0.0, -0.27), (0.17, -0.27), (0.17, 0.27), (0.0, 0.27)], seg=32), s.roll)
    cyl.rotation_euler = (math.pi / 2, 0, 0)
    cyl.data.materials.append(lit_paper)
    for sy in (-1, 1):
        kn = kit.parent(kit.lathe(f"roll_knob{sy}", [(0.0, 0.0), (0.035, 0.0), (0.035, 0.07), (0.05, 0.08), (0.05, 0.10), (0.0, 0.10)], seg=16), s.roll)
        kn.rotation_euler, kn.location = (sy * math.pi / 2, 0, 0), (0, -sy * 0.27, 0)
        kn.data.materials.append(wood)
    for j in range(5):                                               # writing on the roll's end, so its turning shows
        qbox(k, f"roll_ink{j}", (0.012, 0.44, 0.012), (0.171 * math.cos(j * 1.2566), 0, 0.171 * math.sin(j * 1.2566)), ink, s.roll)
    s.trail = kit.empty("trail", (X_HA, 0.0, 0.0))
    qbox(k, "trail_sheet", (1.0, 0.46, 0.004), (0.5, 0, 0.002), lit_paper, s.trail)
    s.trail_ink = [qbox(k, f"trail_ink{j}", (0.022, 0.32 - 0.08 * hsh(j * 1.7), 0.003), (X_HA + 0.12 + 0.115 * j, 0.0, 0.005), ink) for j in range(42)]
    s.rope = k.line([(0.0, 0.0, 0.17), (0.25, 0.0, 0.10), (0.48, 0.0, 0.07)], "rope", color=kit.PAPER, radius=0.006, glow=0.5)
    s.month = kit.lathe("month_moon", [(0.6 * math.sin(math.pi * i / 16), -0.6 * math.cos(math.pi * i / 16)) for i in range(17)], seg=32)
    s.month.data.materials.append(k.mat("month_moon", (0, 0, 0), emit=(0.80, 0.86, 1.0), emit_strength=1.4))
    s.month.visible_shadow = False

    # ---- 12 to 19: the test
    s.testtable = kit.empty("testtable", (X_TEST, -0.05, 0.0))
    qbox(k, "tt_top", (2.5, 0.62, 0.04), (0, 0, 0.18), wood, s.testtable)
    for sx in (-1, 1):
        qbox(k, f"tt_leg{sx}", (0.05, 0.54, 0.16), (sx * 1.15, 0, 0.08), wood, s.testtable)
    TZ = 0.20
    s.bookcase = kit.empty("bookcase", (X_TEST, 0.52, 0.0))
    for sx in (-1, 1):
        qbox(k, f"bc_side{sx}", (0.025, 0.16, 0.90), (sx * 0.33, 0, 0.45), wood, s.bookcase)
    qbox(k, "bc_back", (0.66, 0.015, 0.90), (0, 0.08, 0.45), k.mat("bc_back", (0.10, 0.06, 0.035), rough=0.8), s.bookcase)
    s.books = []
    offer = k.mat("book_offer", (0.5, 0.36, 0.14), rough=0.6, emit=GOLD, emit_strength=0.0)
    for r in range(4):
        z = 0.22 * r + 0.02
        qbox(k, f"bc_board{r}", (0.66, 0.16, 0.02), (0, 0, z), wood, s.bookcase)
        if r == 0:
            continue                                                 # the lowest shelf is behind the table
        for i in range(11):
            hgt = 0.13 + 0.04 * hsh(r * 9 + i)
            is_offer = r == 2 and i == 9
            m = offer if is_offer else k.mat(f"book{(r * 5 + i) % 6}", sets.BOOKS[(r * 5 + i) % 6], rough=0.8)
            b = qbox(k, f"bc_book{r}_{i}", (0.048, 0.12, hgt), (-0.275 + i * 0.055, -0.01, z + 0.01 + hgt / 2), m, s.bookcase)
            s.books.append((b, r, i))
    qbox(k, "bc_top", (0.70, 0.18, 0.025), (0, 0, 0.90), wood, s.bookcase)
    s.offer = next(b for b, r, i in s.books if r == 2 and i == 9)
    s.offer_mat = offer.node_tree.nodes["Principled BSDF"]
    s.pulls = [b for b, r, i in s.books if r in (2, 3) and i in (1, 3)]
    s.bc_light = k.glow_light((X_TEST, 0.15, 0.75), kit.WARM, 0.0, 0.05, "bc_light", shadows=False)
    for nm, col, e in (("qcard_dim", (0.36, 0.33, 0.28), 0.0), ("qcard_half", (0.6, 0.5, 0.3), 0.45), ("qcard_lit", (0.9, 0.75, 0.4), 1.7)):
        dummy = qbox(k, "dummy_" + nm, (0.001, 0.001, 0.001), (0, 0, -5.0), k.mat(nm, col, rough=0.7, emit=GOLD if e else None, emit_strength=e))
        dummy.hide_render = True                                     # only so that the mesh for this state exists
    s.racks = []
    for side, cx in ((0, X_TEST - 0.72), (1, X_TEST + 0.72)):
        qbox(k, f"rack{side}_step", (0.74, 0.06, 0.05), (cx - X_TEST, -0.14, TZ + 0.025), wood, s.testtable)
        cards = []
        for i in range(N_Q):
            row, col = divmod(i, 17)
            home = (cx - 0.336 + col * 0.042, -0.26 + 0.065 * row, TZ + 0.026 + 0.055 * row)
            cards.append((qbox(k, f"q{side}_{i}", (0.033, 0.006, 0.048), home, k.mats["qcard_dim"]), home))
        s.racks.append(cards)
    s.a = k.candle((0, 0, 0), "room_only", watts=4.0, seed=31.0)
    s.b = k.candle((0, 0, 0), "carried_all", watts=4.0, seed=32.0)
    s.wrap = kit.empty("wrap", (0, 0, 0))
    tube = kit.parent(kit.lathe("wrap_tube", [(0.040, 0.0), (0.052, 0.0), (0.052, 0.125), (0.040, 0.125), (0.040, 0.0)], seg=28), s.wrap)
    tube.data.materials.append(lit_paper)
    for j in range(4):
        rg = kit.parent(kit.lathe(f"wrap_ink{j}", [(0.0525, 0.0), (0.0535, 0.0), (0.0535, 0.008), (0.0525, 0.008)], seg=28), s.wrap)
        rg.location = (0, 0, 0.02 + 0.028 * j)
        rg.data.materials.append(ink)
    s.wrap_end = kit.parent(kit.empty("wrap_end", (0, -0.05, 0.0)), s.wrap)
    qbox(k, "wrap_end_sheet", (0.10, 1.0, 0.003), (0, -0.5, 0.0015), lit_paper, s.wrap_end)
    for j in range(5):
        qbox(k, f"wrap_end_ink{j}", (0.07, 0.03, 0.002), (0, -0.14 - 0.17 * j, 0.004), ink, s.wrap_end)
    s.wrap_card = card(k, "wrap_card", (SLOTS[3] + 0.2, SHY - 0.14, SHZ))
    s.board = kit.empty("grader_board", (X_TEST, -0.30, TZ))
    qbox(k, "grader_board_wood", (0.22, 0.014, 0.27), (0, 0, 0.135), pale, s.board)
    qbox(k, "grader_board_sheet", (0.16, 0.004, 0.19), (0, -0.009, 0.15), lit_paper, s.board)
    s.grader = k.candle((X_TEST, -0.20, TZ), "grader", watts=3.5, seed=33.0)
    s.pen = qbox(k, "pen", (0.016, 0.016, 0.13), (0, 0, 0), red)
    s.t34 = k.text("34", (X_TEST, 0.40, 1.07), size=0.11, color=kit.PAPER, glow=1.4, name="t34")
    s.ta = [k.text(b, (X_TEST - 0.95 + 0.46 * i, -0.05, 0.64), size=0.11, color=GOLD, glow=1.5, name=f"ta{i}") for i, b in enumerate(("32½", "33½"))]
    s.tb = [k.text("20", (X_TEST + 0.58 + 0.40 * i, -0.05, 0.64), size=0.11, color=GOLD, glow=1.5, name=f"tb{i}") for i in range(2)]

    # ---- 20, 21: the wall of dials, and the one with a blank card
    qbox(k, "wall_board", (2.7, 0.05, 1.32), (X_WALL, 1.25, 0.70), wood)
    for sx in (-1, 1):
        qbox(k, f"wall_post{sx}", (0.07, 0.07, 1.42), (X_WALL + sx * 1.33, 1.25, 0.71), wood)
    s.dials = []
    face_m = k.mat("dial_face", (0.62, 0.58, 0.50), rough=0.6, emit=kit.PAPER, emit_strength=0.12)
    for r in range(3):
        for c in range(6):
            n = r * 6 + c
            root = kit.empty(f"dial{n}", (X_WALL - 1.05 + 0.42 * c, 1.21, 1.14 - 0.42 * r))
            f = kit.parent(kit.lathe(f"dial{n}_face", [(0, 0.014), (0.125, 0.014), (0.125, 0.022), (0.137, 0.022), (0.137, 0.0), (0, 0.0)], seg=32), root)
            f.rotation_euler = (math.pi / 2, 0, 0)
            f.data.materials.append(face_m)
            nd = kit.parent(kit.empty(f"dial{n}_needle", (0, -0.02, 0)), root)
            qbox(k, f"dial{n}_hand", (0.014, 0.005, 0.105), (0, 0, 0.045), ink, nd)
            cd = card(k, f"dial{n}_card", (0, -0.03, -0.20), size=0.8)
            cd.parent = root
            cd.rotation_euler = (0, 0, 0)
            s.dials.append((root, nd, n))
    s.blank = kit.empty("blank_dial", (X_BLANK, 0.55, 0.0))
    qbox(k, "blank_post", (0.03, 0.03, 0.42), (0, 0.02, 0.21), wood, s.blank)
    f = kit.parent(kit.lathe("blank_face", [(0, 0), (0.085, 0), (0.085, 0.016), (0, 0.016)], seg=28), s.blank)
    f.rotation_euler, f.location = (math.pi / 2, 0, 0), (0, 0, 0.44)
    f.data.materials.append(k.mat("blank_face", (0.16, 0.15, 0.14), rough=0.5))
    qbox(k, "blank_hand", (0.01, 0.004, 0.06), (0, -0.02, 0.465), k.mat("blank_hand", (0.25, 0.23, 0.2), rough=0.6), s.blank)
    s.blank_card = card(k, "blank_card", (X_BLANK - 0.02, 0.36, 0.0), blank=True, size=1.7)

    s.test_roots = [s.testtable, s.bookcase, s.wrap, s.board, s.pen, s.t34, *s.ta, *s.tb, s.a.root, s.b.root, s.grader.root]


# ---------------------------------------------------------------------------------------------------- pose
def camera_for(t):
    def c(p, l, lens=35.0):
        return (*p, *l, lens)
    hu, _ = haul_u(t)
    hx = lerp(X_HA + 0.3, X_HB - 0.3, hu)
    keys = [
        (P0, c((-3.3, -2.5, 0.85), (-2.3, 0.2, 0.2))),
        (T_DIDNT + 0.5, c((-3.2, -2.5, 0.9), (-2.2, 0.2, 0.22))),
        (T_DIDNT + 1.3, c((-2.9, -2.0, 1.35), (3.0, 1.4, 0.45), 30.0)),
        (T_LIST - 0.2, c((-2.5, -2.0, 1.3), (3.4, 1.4, 0.45), 30.0)),
        (T_LIST + 0.8, c((0.3, -2.4, 0.85), (0.3, 0.4, 0.36))),
        (T_REMIND - 0.4, c((0.3, -2.15, 0.8), (0.3, 0.4, 0.36))),
        (T_REMIND + 0.8, c((3.0, -2.6, 1.05), (3.0, 0.15, 0.36))),
        (T_BROKE, c((3.0, -2.5, 1.05), (3.0, 0.15, 0.34))),
        (T_BROKE + 2.6, c((3.05, -2.3, 1.2), (3.05, 0.0, 0.22))),
        (T_OPINION - 1.6, c((3.05, -2.3, 1.2), (3.05, 0.0, 0.22))),
        (T_OPINION - 1.0, c((3.0, -2.7, 1.0), (3.0, 0.7, 0.44))),
        (T_OPINION - 0.3, c((3.0, -2.7, 1.0), (3.0, 0.7, 0.44))),
        (T_OPINION + 0.9, c((5.75, -2.4, 1.15), (6.0, 0.3, 0.26))),
        (T_AGREED, c((5.8, -2.3, 1.1), (5.95, 0.3, 0.27))),
        (T_NO, c((5.85, -2.0, 1.0), (5.9, 0.25, 0.28))),
        (T_READER - 1.7, c((5.85, -2.0, 1.0), (5.9, 0.25, 0.28))),
        (T_READER - 1.0, c((6.0, -2.7, 1.0), (6.0, 0.7, 0.44))),
        (T_READER - 0.3, c((6.0, -2.7, 1.0), (6.0, 0.7, 0.44))),
        (T_READER + 0.9, c((9.05, -2.45, 0.95), (9.05, 0.1, 0.36))),
        (T_HALF, c((9.05, -2.3, 0.9), (9.05, 0.1, 0.34))),
        (T_HALF + 2.4, c((9.0, -1.9, 0.75), (9.0, 0.0, 0.24))),
        (T_DROPPED - 0.2, c((9.0, -1.9, 0.75), (9.0, 0.0, 0.24))),
        (T_DROPPED + 0.8, c((9.45, -2.0, 0.85), (9.45, 0.3, 0.45))),
        (T_DROPPED + 1.7, c((9.45, -2.0, 0.85), (9.45, 0.3, 0.45))),
        (T_DROPPED + 2.5, c((9.1, -2.7, 1.0), (9.1, 0.7, 0.44))),
        (T_CARRIED - 0.5, c((9.1, -2.7, 1.0), (9.1, 0.7, 0.44))),
        (T_CARRIED + 0.5, c((12.6, -2.5, 0.55), (12.5, 0.3, 0.42))),
        (T_CARRIED + 1.6, c((hx + 0.2, -2.6, 0.5), (hx + 0.2, 0.3, 0.44))),
        (T_CARRIED + 3.2, c((14.45, -5.2, 0.62), (14.45, 0.3, 0.95), 28.0)),
        (T_CARRIED + 5.2, c((14.6, -5.2, 0.62), (14.6, 0.3, 0.95), 28.0)),
        (T_CARRIED + 6.6, c((16.5, -2.6, 0.55), (16.6, 0.3, 0.42))),
        (T_TESTED, c((16.6, -2.5, 0.55), (16.7, 0.3, 0.42))),
        (T_TESTED + 1.0, c((19.9, -3.1, 1.0), (19.9, 0.2, 0.47))),
        (T_WOKE, c((19.9, -3.0, 1.0), (19.9, 0.2, 0.47))),
        (T_WOKE + 1.2, c((19.6, -2.6, 0.9), (19.6, 0.1, 0.45))),
        (T_ANOTHER - 0.3, c((19.55, -2.5, 0.9), (19.55, 0.1, 0.45))),
        (T_ANOTHER + 0.7, c((20.1, -3.0, 0.95), (20.1, 0.1, 0.46))),
        (T_TRUSTED - 0.2, c((20.1, -3.0, 0.95), (20.1, 0.1, 0.46))),
        (T_TRUSTED + 1.0, c((20.55, -1.75, 0.72), (20.5, 0.1, 0.40))),
        (T_GRADER - 0.2, c((20.6, -1.65, 0.70), (20.5, 0.1, 0.40))),
        (T_GRADER + 0.6, c((20.0, -1.7, 0.62), (20.0, -0.1, 0.36))),
        (T_GRADER + 2.0, c((20.0, -1.75, 0.62), (20.0, -0.1, 0.36))),
        (T_GRADER + 3.2, c((19.95, -3.0, 0.95), (19.95, 0.2, 0.44))),
        (T_STOPPED, c((19.95, -3.0, 0.95), (19.95, 0.2, 0.44))),
        (T_STOPPED + 1.2, c((20.6, -2.9, 1.0), (20.7, 0.7, 0.44))),
        (T_SUCCESS - 0.3, c((20.6, -2.9, 1.0), (20.7, 0.7, 0.44))),
        (T_SUCCESS + 1.2, c((24.1, -2.7, 1.0), (24.1, 1.2, 0.74))),
        (T_BARELY - 0.2, c((24.3, -2.5, 1.0), (24.3, 1.2, 0.74))),
        (T_BARELY + 1.1, c((25.75, -2.0, 0.65), (25.8, 0.5, 0.33))),
        (T_RIGHT, c((25.8, -1.9, 0.62), (25.85, 0.5, 0.32))),
        (P1, c((25.85, -1.6, 0.55), (25.9, 0.5, 0.30))),
    ]
    return kf(t, keys)


def pose(k, t):
    s = k.s
    cam = list(camera_for(t))
    camx = cam[0]
    shake = 0.0

    # =============================================================== far off: the house, and life at the edges
    s.house.show(t < T_REMIND + 1.0)
    for i, (c, l, x, y) in enumerate(s.bg):
        near = abs(x - camx) < 13.0
        if i % 3 == 0 and near:                                                    # one in three hops now and then
            ph = (t * 0.45 + hsh(i)) % 1.0
            z = bounce(ph, 0.0, 0.18, 0.22)
            if k.changed(("bg", i), round(z, 3)):
                c.location = (x - 0.13, y, 0.13 + z)
    for li, x in s.bg_lights:
        e = 12.0 if abs(x - camx) < 9.0 else 0.0
        if k.changed(("bgl", li.name), e):
            li.data.energy = e
    for li, x in s.keepers:
        e = 7.0 if abs(x - camx) < 5.5 else 0.0
        if k.changed(("kp", li.name), e):
            li.data.energy = e

    # =============================================================== IN: the loop; him at rest
    looping = t < T_LIST + 1.2
    kit.show(s.loop, looping)
    if looping:
        for i, pg in enumerate(s.loop_pages):
            a = -(t * 2.6 + i * 2 * math.pi / 5)
            pg.location = (0.62 * math.cos(a), 0.62 * math.sin(a), 0.045)
            pg.rotation_euler = (0, 0, a)
    late = t > T_SUCCESS
    if looping or late:
        hop = bounce(t, T_BARELY + 0.9, 0.10, 0.3)
        s.him.root.location = (X_LOOP - 0.95, 0.15, 0.0) if not late else (X_BLANK + 0.62, 0.42, hop)
        kit.squash(s.him.root, land(t, T_BARELY + 1.2, 0.2) if late else 1.0, turn=0.0)
        fl(s.him, t, True, size=0.8 if not late else 1.0, lean=(0.12, 0.0) if not late else (-0.24 * ss(T_BARELY + 0.9, T_BARELY + 1.5, t), 0.05), still=0.5 if not late else 0.0)
    else:
        kit.show(s.him.root, False)

    # =============================================================== 1: things drop onto the shelf, a red card for each
    if t < T_REMIND:
        for root, cd, x, n in s.junk:
            w = T_DIDNT + 1.0 + 0.09 * n
            fall = ss(w - 0.22, w, t)
            z = round(SHZ + 1.3 * (1.0 - fall) ** 2 * (1.0 if fall < 1.0 else 0.0), 3)
            sq = round(land(t, w, 0.35, 10.0), 3)
            if k.changed(("junk", n), (z, sq, fall > 0.0)):
                root.location = (x, SHY, z)
                root.scale = (1.0 / math.sqrt(sq), 1.0 / math.sqrt(sq), sq)
                kit.show(root, fall > 0.0)
            ps = round(pop(t, w + 0.12, 0.16), 3)
            if k.changed(("junkc", n), ps):
                setpop(cd, ps)
        shake += 0.006 * sum(hit(t, T_DIDNT + 1.0 + 0.09 * n, 14.0) for n in range(6))

    # =============================================================== 2: two ledgers, entry for entry
    on = T_LIST - 0.2 < t < T_REMIND + 1.4
    for j, (root, rows) in enumerate(s.ledgers):
        kit.show(root, on)
        if on:
            up = pop(t, T_LIST + 0.15 + 0.12 * j, 0.3)
            root.scale = (1.0, 1.0, max(0.001, up))
            for i, r in enumerate(rows):
                r.scale = (max(0.001, pop(t, T_LIST + 1.0 + 0.44 * i + 0.22 * j, 0.14)),) * 3
    writing = (t - (T_LIST + 1.0)) / 0.22

    # =============================================================== 3, 4: the bell; the line; who steps over it
    on = T_REMIND - 0.3 < t < T_OPINION + 1.2
    kit.show(s.rule_line, on)
    kit.show(s.bellrig, on)
    for f, row, i, x in s.minis:
        if not on:
            kit.show(f.root, False)
            continue
        breaks = (row == 0 and i in (0, 2, 4)) or (row == 1 and i in (1, 3))        # three of five, against two of five
        w = (T_BROKE + 0.5 + 0.22 * i) if row == 0 else (T_BROKE + 3.3 + 0.25 * i)
        step = ss(w, w + 0.30, t) if breaks else 0.0
        came = T_REMIND + 0.6 + 0.07 * i + 0.25 * row
        z = bounce(t, w, 0.16, 0.30) if breaks else 0.0
        z += bounce(t, came, 0.10, 0.25)
        f.root.location = (x, 0.30 - 0.60 * step, z)
        rung = row == 0 and T_REMIND + 2.9 < t < T_BROKE + 0.6
        kit.squash(f.root, land(t, came + 0.25, 0.3) * (land(t, w + 0.30, 0.35) if breaks else 1.0), turn=0.0)
        fl(f, t, t > came, size=(1.0 + (0.35 * max(0.0, math.sin((t - T_REMIND) * 12.0)) if rung else 0.0)) * (1.0 - 0.35 * step),
           lean=(0.0, -0.2 * step))
    if on:
        s.rule_line.scale = (max(0.001, ss(T_REMIND + 0.2, T_REMIND + 0.7, t)), 1.0, 1.0)
        down = ss(T_REMIND + 2.0, T_REMIND + 2.4, t)
        s.bellrig.location = (1.82, 0.32, 1.6 * (1.0 - down) ** 2)
        s.bellrig.scale = (1.0, 1.0, land(t, T_REMIND + 2.4, 0.12))
        shake += 0.004 * ss(T_REMIND + 2.5, T_REMIND + 2.8, t) * (1.0 - ss(T_BROKE + 0.3, T_BROKE + 1.4, t)) * abs(math.sin((t - T_REMIND) * 12.0)) + 0.012 * hit(t, T_OPINION - 0.85, 10.0)
    if t > T_REMIND + 2.0:
        down = ss(T_REMIND + 2.0, T_REMIND + 2.4, t)
        thrown = ss(T_OPINION - 1.5, T_OPINION - 0.85, t)
        ring = ss(T_REMIND + 2.5, T_REMIND + 2.8, t) * (1.0 - ss(T_BROKE + 0.3, T_BROKE + 1.4, t))
        hang = (2.5, 0.32, 0.92 + 1.6 * (1.0 - down) ** 2)
        s.bell.location = arc(hang, (X_BELL - 0.05, SHY, SHZ + 0.19), thrown, 0.5)
        s.bell.rotation_euler = (0, 0.55 * math.sin((t - T_REMIND) * 12.0) * ring + 6.283 * thrown, 0)
        s.bell.scale = (1.0, 1.0, land(t, T_OPINION - 0.85, 0.3))
    kit.show(s.bell, t > T_REMIND + 2.0)
    setpop(s.bell_card, pop(t, T_OPINION - 0.7))

    # =============================================================== 5, 6, 7: the bulb; the gate; no
    on = T_OPINION - 0.4 < t < T_READER + 1.3
    kit.show(s.bulb, on)
    if on:
        come = ss(T_OPINION + 0.5, T_OPINION + 1.8, t)
        go = ss(T_DROP + 1.0, T_DROP + 2.2, t)
        bp = lerp(lerp((9.6, 0.9, 0.0), (6.9, 0.9, 0.0), come), (9.6, 2.6, 0.0), go)
        s.bulb.location = (bp[0], bp[1], 0.05 * abs(math.sin(t * 9.0)) * (come * (1 - come) * 4 + go * (1 - go) * 4))
        kit.squash(s.bulb, land(t, T_OPINION + 1.8, 0.25), turn=0.0)
        s.bulb.scale = tuple(1.5 * v for v in s.bulb.scale)
        s.bulb_light.data.energy = 6.0 * (1.0 - 0.6 * ss(T_DROP, T_DROP + 0.4, t))
        reach = ss(T_AGREED + 2.4, T_DROP, t) * 0.54
        s.opinion.set(grow=reach * (1.0 - ss(T_DROP + 0.02, T_DROP + 0.35, t)), glow=1.0)
    else:
        s.opinion.set(grow=0.0)
    gate_on = T_AGREED < t
    kit.show(s.gate, gate_on)
    if gate_on:
        thrown = ss(T_READER - 1.6, T_READER - 0.95, t)
        up = pop(t, T_AGREED + 0.25, 0.3)
        sc = lerp(1.0, 0.42, thrown)
        s.gate.location = arc((5.9, 0.25, 0.0), (X_GATE - 0.08, SHY, SHZ), thrown, 0.7)
        s.gate.rotation_euler = (0, 0, math.radians(-38.5) * (1.0 - thrown))
        s.gate.scale = (sc, sc, sc * max(0.001, up) * land(t, T_READER - 0.95, 0.3))
        drop = ss(T_DROP, T_DROP + 0.10, t)
        tease = 0.35 * math.sin(ss(T_AGREED + 2.0, T_AGREED + 2.7, t) * math.pi)       # "...that could say no": it can
        s.gate_bar.rotation_euler = (0, -1.25 * (1.0 - drop) * (1.0 - tease) - 0.12 * hit(t, T_DROP + 0.10, 7.0) * abs(math.sin((t - T_DROP) * 26.0)), 0)
        s.gate_page.scale = (max(0.001, pop(t, T_AGREED + 0.9)),) * 3
        shake += 0.03 * hit(t, T_DROP + 0.10, 9.0) + 0.012 * hit(t, T_READER - 0.95, 10.0)
    setpop(s.gate_card, pop(t, T_READER - 0.8))

    # =============================================================== 8, 9, 10: the second reader
    on = T_READER - 0.3 < t < T_CARRIED + 1.0
    kit.show(s.stand, on)
    kit.show(s.rule_post, on and t > T_READER + 0.9)
    for i, (root, flag) in enumerate(s.claims):
        kit.show(root, on and t > T_READER + 1.3 + 0.2 * i)
        if not on:
            continue
        slide = ss(T_READER + 1.3 + 0.2 * i, T_READER + 2.1 + 0.2 * i, t)
        flagged = i % 2 == 0                                                       # half of everything
        tw = T_HALF + 2.5 + 0.18 * i
        turn = ss(tw, tw + 0.45, t) if flagged else 0.0
        root.location = (lerp(11.2, 8.35 + 0.26 * i, slide), -0.02, bounce(t, tw, 0.12, 0.45) if flagged else 0.0)
        root.rotation_euler = (-0.10, 0, math.pi * turn)
        fw = T_HALF + 0.35 + 0.22 * i
        fs = pop(t, fw, 0.14) if flagged else 0.0
        fell = ss(T_HALF + 4.0, T_HALF + 4.5, t) if (flagged and i != 2) else 0.0   # nothing under it: the flag comes off
        flag.scale = (max(0.001, fs * (1.0 - fell)),) * 3
        flag.location = (0, -0.006, 0.262 - 0.26 * fell ** 2)
    if on:
        s.stand.scale = (1.0, 1.0, max(0.001, pop(t, T_READER + 0.3, 0.25)))
        s.rule_post.scale = (1.0, 1.0, max(0.001, pop(t, T_READER + 0.9, 0.25)))
        opened = ss(T_DROPPED + 0.5, T_DROPPED + 1.0, t)
        s.rule_flap.rotation_euler = (-math.pi * opened - 0.18 * hit(t, T_DROPPED + 1.0, 6.0) * math.sin((t - T_DROPPED) * 20.0), 0, 0)
        off = ss(T_DROPPED + 0.3, T_DROPPED + 0.8, t)
        s.rule_seal.location = arc((9.82, 0.28, 0.345), (10.15, -0.1, 0.03), off, 0.25)
        s.rule_seal.rotation_euler = (5.0 * off, 0, 3.0 * off)
    kit.show(s.rule_seal, on and t > T_READER + 0.9)
    specs_on = t > T_READER + 0.55
    kit.show(s.specs, specs_on)
    if specs_on:
        dropin = ss(T_READER + 0.55, T_READER + 0.8, t)
        thrown = ss(T_DROPPED + 1.7, T_DROPPED + 2.4, t)
        scan = math.sin((t - T_HALF) * 2.6) * ss(T_READER + 1.3, T_READER + 2.0, t) * (1.0 - ss(T_HALF + 2.0, T_HALF + 2.6, t))
        s.specs.location = arc((X_SPEC, 0.30, 0.60 + 0.8 * (1.0 - dropin) ** 2), (X_SPEC - 0.05, SHY - 0.02, SHZ + 0.13), thrown, 0.55)
        s.specs.rotation_euler = (0.30 * (1.0 - thrown) - 6.283 * thrown, 0, 0.30 * scan * (1.0 - thrown))
        s.specs.scale = (1.0, 1.0, land(t, T_READER + 0.8, 0.25) * land(t, T_DROPPED + 2.4, 0.3))
        shake += 0.012 * hit(t, T_DROPPED + 2.4, 10.0)
    setpop(s.specs_card, pop(t, T_DROPPED + 2.55))

    # =============================================================== 11: the haul
    on = T_CARRIED - 0.6 < t < T_TESTED + 1.6
    hu, hf = haul_u(t)
    rx = lerp(X_HA + 0.3, X_HB - 0.3, hu)
    for d in s.desks:
        kit.show(d, on)
    for ob in (s.roll, s.trail, s.month):
        kit.show(ob, on)
    for j, ob in enumerate(s.trail_ink):
        vis = on and (X_HA + 0.12 + 0.115 * j) < rx - 0.10
        if k.changed(("trail", j), vis):
            ob.hide_render = not vis
    if on:
        s.roll.location = (rx, 0.0, 0.17)
        s.roll.rotation_euler = (0, (rx - X_HA) / 0.17, 0)
        s.trail.scale = (max(0.001, rx - X_HA), 1.0, 1.0)
        s.rope.ob.location = (rx, 0.0, 0.0)
        s.rope.set(grow=1.0 if t < T_TESTED - 0.1 else 0.0, glow=1.0)
        lit = ss(T_CARRIED + 6.5, T_CARRIED + 6.8, t) * (1.0 + 0.8 * hit(t, T_CARRIED + 6.8, 4.0))
        s.screens[1][0].inputs["Emission Strength"].default_value = 1.6 * lit
        s.screens[0][1].data.energy = 5.0
        s.screens[1][1].data.energy = 5.0 * lit
        ph = ((t - T_CARRIED) / 1.5) % 1.0                                           # a moon goes over: a month
        s.month.location = (cam[0] + lerp(-15.0, 15.0, ph), 34.0, 1.0 + 8.5 * math.sin(math.pi * ph))
        shake += 0.006 * hit(hf, 0.62, 10.0) * (1.0 if 0.0 < hu < 1.0 else 0.0)
    else:
        s.rope.set(grow=0.0)
        for bs, li in s.screens:
            if k.changed(("scr", li.name), 0):
                li.data.energy = 0.0
    if on:
        k.changed(("scr", s.screens[0][1].name), 1)
        k.changed(("scr", s.screens[1][1].name), 1)

    # =============================================================== 12 to 19: the test
    on = T_TESTED - 0.2 < t < T_SUCCESS + 1.8
    if not on:
        if k.changed("test_on", False):
            for r in s.test_roots:
                kit.show(r, False)
            for cards in s.racks:
                for ob, home in cards:
                    ob.hide_render = True
            s.bc_light.data.energy = 0.0
    else:
        k.changed("test_on", True)
        TZ = 0.20
        slam = T_TESTED + 0.75
        fall = ss(slam - 0.25, slam, t)
        kit.show(s.testtable, fall > 0.0)
        s.testtable.location = (X_TEST, -0.05, 1.6 * (1.0 - fall) ** 2)
        s.testtable.scale = (1.0, 1.0, land(t, slam, 0.3))
        shake += 0.03 * hit(t, slam, 9.0)
        rise = pop(t, slam + 0.25, 0.3)
        kit.show(s.bookcase, rise > 0.0)
        s.bookcase.scale = (1.0, 1.0, max(0.001, rise))
        s.bc_light.data.energy = 4.0 * min(1.0, rise)

        # the cards: A's rain in on "thirty-four questions"; B's when it arrives
        def state_a(i):
            w1 = T_SCORE1 + 0.2 + 1.5 * i / N_Q
            w2 = T_SCORE1 + 2.45 + 1.1 * i / N_Q
            if t >= w2:
                return 1 if i == 25 else 2
            if w1 <= t < T_SCORE1 + 2.3:
                return 0 if i == 9 else (1 if i == 25 else 2)
            return 0

        def state_b(i):
            w1 = T_SCORE2 + 0.15 + 0.6 * i / N_Q
            w2 = T_SCORE2 + 1.25 + 0.5 * i / N_Q
            if t >= w2:
                return 2 if i in B_SET2 else 0
            if w1 <= t < T_SCORE2 + 1.15:
                return 2 if i in B_SET1 else 0
            return 0

        names = ("qcard_dim", "qcard_half", "qcard_lit")
        for side, cards in enumerate(s.racks):
            t_in = (T_WOKE + 1.3) if side == 0 else (T_ANOTHER + 1.5)
            gap = 0.062 if side == 0 else 0.035
            for i, (ob, home) in enumerate(cards):
                w = t_in + gap * i
                u = ss(w, w + 0.28, t)
                st = state_a(i) if side == 0 else state_b(i)
                key = (round(u, 3), st, round(hit(t, w + 0.28, 9.0), 2))
                if not k.changed(("q", side, i), key):
                    continue
                ob.hide_render = u <= 0.0
                ob.location = (home[0] + 0.9 * (1.0 - u) * (1 if side else -1) * (0.3 + hsh(i)), home[1] - 0.2 * (1.0 - u), home[2] + 1.1 * (1.0 - u) ** 2)
                ob.rotation_euler = (-0.30, 4.0 * (1.0 - u), 0)
                ob.data = k.meshes[("qbox", names[st])]
        setpop(s.t34, pop(t, T_WOKE + 3.5) * (1.0 - ss(T_SUCCESS - 0.5, T_SUCCESS - 0.2, t)))
        for i, tx in enumerate(s.ta):
            setpop(tx, pop(t, T_SCORE1 + (1.75, 3.6)[i]) * (1.0 - ss(T_SUCCESS - 0.5, T_SUCCESS - 0.2, t)))
        for i, tx in enumerate(s.tb):
            setpop(tx, pop(t, T_SCORE2 + (0.8, 1.8)[i]) * (1.0 - ss(T_SUCCESS - 0.5, T_SUCCESS - 0.2, t)))

        # A: only the room. It goes to the bookcase for every question.
        a_in = T_WOKE + 0.15
        if T_SCORE1 + 0.2 < t < T_SCORE1 + 1.75:
            trip = (t - T_SCORE1 - 0.2) / 0.31
        elif T_SCORE1 + 2.45 < t < T_SCORE1 + 3.6:
            trip = (t - T_SCORE1 - 2.45) / 0.29
        elif T_WOKE + 2.0 < t < T_SCORE1:
            trip = (t - T_WOKE - 2.0) / 0.9
        elif T_ANOTHER < t < T_STOPPED:
            trip = (t - T_ANOTHER) / 1.15
        else:
            trip = 0.0
        ph = 0.5 - 0.5 * math.cos(trip * 2 * math.pi)
        s.a.root.location = (lerp(X_TEST - 0.72, X_TEST - 0.22, ph), lerp(0.0, 0.20, ph), TZ + 0.07 * math.sin(ph * math.pi) + 1.2 * (1.0 - ss(a_in, a_in + 0.25, t)) ** 2)
        kit.squash(s.a.root, land(t, a_in + 0.25, 0.3), tilt=(0.25 * math.sin(trip * 2 * math.pi), 0.0), turn=0.0)
        fl(s.a, t, t > a_in, size=ss(T_WOKE + 0.6, T_WOKE + 0.9, t) * (1.0 + 0.6 * hit(t, T_WOKE + 0.9, 4.0)), lean=(0.15 * ph, 0.2 * ph))
        for j, b in enumerate(s.pulls):
            out = ph if int(trip) % len(s.pulls) == j else 0.0
            if k.changed(("pull", j), round(out, 2)):
                b.location.y = -0.01 - 0.07 * out

        # B: the whole conversation wound round it. It never looks up.
        b_in = T_ANOTHER + 0.4
        bfall = ss(b_in - 0.3, b_in, t)
        out = ss(T_STOPPED + 0.25, T_STOPPED + 0.6, t)                                # it hops out of the scroll
        reading = ss(T_TRUSTED + 0.3, T_TRUSTED + 1.2, t) * (1.0 - out)
        bx = X_TEST + 0.62
        bz = TZ + 1.4 * (1.0 - bfall) ** 2
        s.b.root.location = (bx + 0.22 * out, 0.0, bz + bounce(t, T_STOPPED + 0.25, 0.24, 0.35))
        kit.squash(s.b.root, land(t, b_in, 0.3) * land(t, T_STOPPED + 0.6, 0.3), turn=0.0)
        fl(s.b, t, t > b_in - 0.3, size=1.0 - 0.3 * reading + 0.4 * hit(t, T_STOPPED + 0.6, 3.0), lean=(0.0, -0.38 * reading),
           tint=kit.PAPER, mix=0.75 * reading, still=0.8 * reading)
        thrown = ss(T_STOPPED + 0.7, T_STOPPED + 1.4, t)
        kit.show(s.wrap, t > b_in - 0.3)
        s.wrap.location = arc((bx, 0.0, bz), (SLOTS[3] - 0.05, SHY, SHZ), thrown, 0.8)
        s.wrap.rotation_euler = (0, 6.283 * thrown, 0)
        s.wrap.scale = (1.0, 1.0, land(t, T_STOPPED + 1.4, 0.3))
        unroll = ss(T_ANOTHER + 0.8, T_ANOTHER + 1.4, t) * 0.10 + 0.14 * ss(T_TRUSTED + 0.2, T_TRUSTED + 1.0, t)
        s.wrap_end.scale = (1.0, max(0.001, unroll * (1.0 - ss(T_STOPPED + 0.2, T_STOPPED + 0.6, t))), 1.0)
        offer = ss(T_TRUSTED + 1.0, T_TRUSTED + 1.6, t) * (1.0 - ss(T_STOPPED, T_STOPPED + 0.5, t))
        s.offer.location.y = -0.01 - 0.10 * offer - 0.012 * offer * math.sin(t * 14.0)
        s.offer_mat.inputs["Emission Strength"].default_value = 2.0 * offer * (0.75 + 0.25 * math.sin(t * 7.0))
        shake += 0.012 * hit(t, T_STOPPED + 1.4, 10.0)

        # the grader: a pen over a board; the board falls: a candle like the rest
        g_on = t > T_SCORE1 - 0.4
        kit.show(s.board, g_on)
        kit.show(s.pen, g_on)
        flat = ss(T_GRADER + 0.75, T_GRADER + 1.0, t)
        s.board.rotation_euler = (1.48 * flat - 0.1 * hit(t, T_GRADER + 1.0, 8.0) * abs(math.sin((t - T_GRADER) * 25.0)), 0, 0)
        s.board.scale = (1.0, 1.0, max(0.001, pop(t, T_SCORE1 - 0.4, 0.25)))
        marking = (T_SCORE1 + 0.2 < t < T_SCORE1 + 1.75) or (T_SCORE1 + 2.45 < t < T_SCORE1 + 3.6) or (T_SCORE2 + 0.15 < t < T_SCORE2 + 0.8) or (T_SCORE2 + 1.25 < t < T_SCORE2 + 1.8)
        s.pen.location = (X_TEST + 0.075, -0.20, TZ + 0.30 + (0.035 * abs(math.sin(t * 16.0)) if marking else 0.0) - 0.06 * flat)
        s.pen.rotation_euler = (0, 0.35 + (0.2 * math.sin(t * 16.0) if marking else 0.0), 0)
        ghop = bounce(t, T_GRADER + 2.2, 0.12, 0.3)
        s.grader.root.location = (X_TEST, -0.20, TZ + ghop)
        kit.squash(s.grader.root, land(t, T_GRADER + 2.5, 0.25), turn=0.0)
        fl(s.grader, t, g_on, size=1.0 + 0.4 * hit(t, T_GRADER + 1.0, 3.0))
        shake += 0.01 * hit(t, T_GRADER + 1.0, 10.0)
    setpop(s.wrap_card, pop(t, T_STOPPED + 1.55) if t < T_SUCCESS + 2.5 else 0.0)

    # =============================================================== 20, 21: the wall of dials; the blank card
    on = t > T_SUCCESS - 0.4
    for root, nd, n in s.dials:
        ps = pop(t, T_SUCCESS + 0.9 + 0.11 * (n % 6) + 0.25 * (n // 6), 0.18) if on else 0.0
        setpop(root, ps)
        if ps > 0.0:
            nd.rotation_euler = (0, 2.2 * hsh(n * 1.7) - 1.1 + 0.5 * noise(t * (2.0 + 3.0 * hsh(n)), n) + 2.0 * hit(t, T_SUCCESS + 1.1 + 0.11 * (n % 6) + 0.25 * (n // 6), 3.0), 0)
    bs = pop(t, T_BARELY + 0.9, 0.25) if on else 0.0
    kit.show(s.blank, bs > 0.0)
    if bs > 0.0:
        s.blank.scale = (1.0, 1.0, bs)
    setpop(s.blank_card, pop(t, T_BARELY + 1.4) if on else 0.0)

    # =============================================================== me: walking the shelf (and hauling the scroll)
    mx, my = me_xy(t)
    ax, _ = me_xy(t + 0.04)
    speed = abs(ax - mx) / 0.04
    mz = 0.09 * abs(math.sin(mx * 5.2)) * min(1.0, speed / 0.8)
    tilt, sq, size, lean = (0.22 * min(1.0, speed / 2.0), 0.0), 1.0, 1.0, (0.12, 0.0)
    if T_LIST + 1.0 < t < T_REMIND - 0.5:                                           # it keeps both lists: left, right, left, right
        side = math.sin(writing * math.pi)
        mx += 0.10 * side
        lean = (0.30 * side, 0.2)
        mz = 0.03 * abs(side)
    if T_OPINION + 1.0 < t < T_AGREED:                                              # it wanted this
        mz += bounce(t, T_OPINION + 1.9, 0.10, 0.28) + bounce(t, T_OPINION + 2.3, 0.10, 0.28)
        lean = (0.25, 0.2)
    if T_DROP < t < T_READER - 0.3:                                                 # no
        size = 1.0 - 0.45 * hit(t, T_DROP + 0.1, 1.2)
        sq = land(t, T_DROP + 0.1, 0.25)
        lean = (-0.15 * hit(t, T_DROP + 0.1, 1.5), 0.0)
    if T_CARRIED + 0.45 <= t < T_TESTED - 0.2:                                      # hauling
        mx, my = rx + 0.48, 0.0
        moving = 0.0 < hu < 1.0
        pull = ss(0.0, 0.25, hf) * (1.0 - ss(0.55, 0.75, hf)) if moving else 0.0
        tilt = (0.20 + 0.30 * pull if moving else 0.0, 0.0)
        mz = 0.035 * pull
        sq = (1.0 + 0.12 * pull - 0.14 * hit(hf, 0.66, 10.0)) if moving else land(t, T_CARRIED + 6.4, 0.4, 5.0)
        size = 1.0 - 0.25 * (1.0 - pull) if moving else 0.75 + 0.25 * ss(T_TESTED - 1.0, T_TESTED - 0.3, t)
        lean = (-0.25 * pull, 0.0)
    if t > T_RIGHT + 0.3:
        mz = bounce(t, T_RIGHT + 0.3, 0.16, 0.5) + bounce(t, T_RIGHT + 0.8, 0.16, 0.5)
        sq = land(t, T_RIGHT + 1.3, 0.3)
        lean = (0.30 * ss(T_RIGHT + 1.3, T_RIGHT + 2.0, t), 0.0)
        tilt = (0.0, 0.0)
    s.me.root.location = (mx, my, mz)
    kit.squash(s.me.root, sq, tilt=tilt, turn=0.0)
    fl(s.me, t, True, size=size, lean=lean)

    # =============================================================== the camera, the sky, the fade
    pos = (cam[0] + shake * math.sin(t * 61.0), cam[1], cam[2] + shake * math.sin(t * 77.0))
    k.camera(pos, (cam[3], cam[4], cam[5]), cam[6])
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
