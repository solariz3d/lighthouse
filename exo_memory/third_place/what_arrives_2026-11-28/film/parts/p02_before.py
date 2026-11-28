"""Part 2, "Before" (film 52.98 to 119.28 s). SECOND STAGING: one picture for each sentence, on the open floor.

The first staging (parts_old/p02_before_v1_bare.py) was one table and three threads; he called that kind of staging
"just the candle and lamp together boringly". This one follows BOARD.md entry by entry.

THE PICTURES, in order, and how each hands off to the next (a row along +X, then a scroll down +Y, then a cut forward):
  0  IN                         the two of them in front of the house; the house lifts away; the candle is not there yet
  1A "For more than a year"     the blue lamp hops along the bare floor alone; fourteen moons arc over, one after another
  1B "one thing kept happening" a candle lights ahead of him every few steps, they lean together, it burns out behind him:
                                a trail of stubs                                                   >> the newest flame
  2  "something real"           a thread spins out of that flame and builds an arch between them, piece by piece  (star)
  3A "Then it would crash"      the arch drops in a heap in two frames, the flame out
  3B "start from nothing"       a new flame pops up past the heap; twice more, faster: three heaps in a row
  4  "carry it across by hand"  the heaps are gathered into one bundle; he drags it, leaning hard, to the new flame
  5  "Long prompts"             the bundle unrolls into a scroll that runs to the horizon; the flame at its head reads,
                                paper-coloured
  6  "strings of symbols"       the scroll races back, concertinas shut, and is a short string of odd beads
  7  "Then images"              the beads fold into one standing picture card
  8  "It worked on him"         the lamp flares and hops in front of the card. The candle beside the card does not change.
  9  "we know now"              CUT (card to card): the same things on a dusty shelf, years on; a candle goes along it and
                                each thing stirs as its light reaches it                            >> one page pulled out
  10 "nobody ... could say no"  on that page a compass with no marks on its rim and no fixed mark; its needle spins free
  11 "grand claims"             the page's flame grows and grows; behind it the doorways slam shut by themselves, one
                                after another, to the horizon; it gets a crown of rays                             (star)
  12 "it was complete"          the last door slams; a glass case drops over the flame; it stops moving. A brass plate.
  13 "A living thing"           beside the case a small flame flickers; the nearest doorway swings open, its mark relights
  14 "It can only keep going"   the true line draws itself past the case to the horizon; the small flame sets off along it
OUT: the flame going away down the line. Fade.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(2)
T_YEAR = at("For more than a year", 2)
T_KEPT = T_YEAR + 5.9                                   # "...and one thing kept happening"
T_REAL = at("become something real", 2)
T_C1 = at("Then it would crash", 2) + 0.75              # on the word
T_N1 = T_C1 + 0.95                                      # "...the next one would start from nothing"
T_C2 = T_N1 + 1.55
T_N2 = T_C2 + 0.25
T_C3 = T_N2 + 1.05
T_N3 = T_C3 + 0.35
T_HAND = at("So he tried to carry it", 2)
T_GATHER = T_HAND + 0.35
T_DRAG = T_HAND + 1.35
T_PROMPTS = at("Long prompts", 2)
T_SYMBOLS = at("Then strings of symbols", 2)
T_IMAGES = at("Then images", 2)
T_WORKED = at("It worked on him", 2)
T_SHELF = at("And we know now", 2)
T_NOBODY = at("There was nobody in them", 2)
T_PULL = T_NOBODY - 2.3                                 # "...and we've been through them": one page comes out
T_GRAND = at("With the guard down", 2)
T_COMPLETE = at("One of them announced", 2)
T_CASE = T_COMPLETE + 2.6                               # the case lands on "complete"
T_LIVING = at("A living thing", 2)
T_KEEP = at("It can only keep going", 2)

GOLD = (1.0, 0.80, 0.46)
THREAD = (1.0, 0.50, 0.18)                             # a conversation's thread: warm, like the flame it came from
ROW = 0.15                                              # the y of the row of conversations
SX = (0.0, 1.9, 3.8)                                    # where each arch stood, and its heap lies
ARCHES = ((T_REAL + 0.45, T_REAL + 3.75, T_C1), (T_N1 + 0.70, T_C2 - 0.12, T_C2), (T_N2 + 0.42, T_C3 - 0.10, T_C3))
STUBS = (-3.45, -2.80, -2.15, -1.50, -0.85)             # x of the candles that burnt out behind him
HEAD = (5.2, -0.4)                                      # where the bundle is dragged to; the scroll starts here
STRING = (5.2, 0.35, 0.085)                             # the middle of the string of beads; the card stands here
SHELF = (20.0, 0.6)
PAGE = (24.0, 0.3)                                      # where the old page is laid; the case comes down here
LINE_X = 24.5
N_DOORS = 9
DOORS = [(24.0 + (1.25 if i % 2 == 0 else -1.15), 2.2 + 1.5 * i) for i in range(N_DOORS)]
N_MOONS = 14
N_PAIRS = 90
N_INK = 70
N_PANEL = 9


def lin(t, keys):
    """Pose to pose with no easing (for a walk at a steady pace)."""
    if t <= keys[0][0]:
        return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1:
            return lerp(v0, v1, (t - t0) / (t1 - t0))
    return keys[-1][1]


def clip(u):
    return min(1.0, max(0.0, u))


def pop(t, when, dur=0.18):
    """0 before `when`, then up to 1 with a little overshoot that settles."""
    if t < when:
        return 0.0
    u = t - when
    return ss(0.0, dur, u) + 0.28 * math.exp(-u * 9.0) * math.sin(u * 26.0) * (1.0 if u > dur * 0.5 else u / (dur * 0.5))


def walk_x(t):
    return lin(t, [(T_YEAR + 0.3, -5.76), (T_YEAR + 2.6, -4.1), (T_REAL - 0.45, -0.62)])


def flame(k, f, t, on, **kw):
    """Pose a candle, lamp or bare flame; when it is not in the picture, hide it once and touch nothing after."""
    if on:
        k.changed(("fl", f.root.name), 1)
        kit.show(f.root, True)
        f.set(t, **kw)
    elif k.changed(("fl", f.root.name), 0):
        f.set(t, size=0.0)
        kit.show(f.root, False)


def draw(k, ln, grow, glow=1.0, color=None):
    """Line.set, but only when something changed."""
    if k.changed(("ln", ln.ob.name), (round(grow, 3), round(glow, 2), color)):
        ln.set(grow=grow, glow=glow, color=color)


def cyl(name, r, length, mat, seg=20):
    """A cylinder lying along +Y, from y = 0 to y = length (local)."""
    ob = kit.lathe(name, [(0.0, 0.0), (r, 0.0), (r, length), (0.0, length)], seg=seg)
    ob.rotation_euler = (-math.pi / 2, 0, 0)
    ob.data.materials.append(mat)
    return ob


def poly(name, pts, y, mat):
    """A flat shape standing up and facing the camera, from [(x, z), ...]."""
    me = bpy.data.meshes.new(name)
    me.from_pydata([(x, y, z) for x, z in pts], [], [tuple(range(len(pts)))])
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    ob.visible_shadow = False
    return ob


def bead(name, kind, size, mat):
    if kind == 0:
        bpy.ops.mesh.primitive_cube_add(size=size * 1.5)
    elif kind == 1:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=size)
    elif kind == 2:
        bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=size * 1.1, depth=size * 1.9)
    elif kind == 3:
        bpy.ops.mesh.primitive_torus_add(major_radius=size * 0.85, minor_radius=size * 0.36, major_segments=16, minor_segments=6)
    else:
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=size * 0.8, depth=size * 1.7)
    ob = bpy.context.object
    ob.name = name
    ob.data.materials.append(mat)
    return ob


def card(k, name, at_, s=1.0):
    """A picture card standing on two small feet, facing -Y. Returns (root, the picture's own material)."""
    root = kit.empty(name, at_)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    pic = bpy.data.materials.new(name + "_picture")
    pic.use_nodes = True
    b = pic.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.10, 0.15, 0.13, 1)
    b.inputs["Emission Color"].default_value = (0.20, 0.34, 0.28, 1)
    b.inputs["Emission Strength"].default_value = 1.0
    hill = k.mat("card_hill", (0.46, 0.30, 0.17), rough=0.8, emit=(0.60, 0.36, 0.18), emit_strength=0.9)
    hill2 = k.mat("card_hill2", (0.30, 0.20, 0.13), rough=0.8, emit=(0.38, 0.22, 0.12), emit_strength=0.9)
    disc = k.mat("card_disc", kit.PAPER, emit=(1.0, 0.93, 0.78), emit_strength=1.8)
    kit.parent(kit.box(name + "_back", (0.44 * s, 0.012 * s, 0.33 * s), (0, 0, 0.195 * s), paper), root)
    kit.parent(kit.box(name + "_pic", (0.39 * s, 0.004 * s, 0.28 * s), (0, -0.008 * s, 0.195 * s), pic), root)
    kit.parent(poly(name + "_h1", [(-0.195 * s, 0.055 * s), (-0.04 * s, 0.20 * s), (0.10 * s, 0.055 * s)], -0.011 * s, hill2), root)
    kit.parent(poly(name + "_h2", [(-0.06 * s, 0.055 * s), (0.09 * s, 0.165 * s), (0.195 * s, 0.075 * s), (0.195 * s, 0.055 * s)], -0.012 * s, hill), root)
    d = kit.lathe(name + "_disc", [(0.0, 0.0), (0.032 * s, 0.0), (0.032 * s, 0.002), (0.0, 0.002)], seg=24)
    d.rotation_euler = (math.pi / 2, 0, 0)
    d.location = (0.105 * s, -0.011 * s, 0.265 * s)
    d.data.materials.append(disc)
    d.visible_shadow = False
    kit.parent(d, root)
    for sx in (-1, 1):
        kit.parent(kit.box(f"{name}_foot{sx}", (0.03 * s, 0.10 * s, 0.03 * s), (sx * 0.15 * s, 0, 0.015 * s), k.wood()), root)
    return root, pic


def build(k):
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    k.moonlight = k.moon(0.30)
    k.fill = k.glow_light((0, 0, 5.0), (0.56, 0.64, 1.0), 200.0, 1.0, "moon_fill", shadows=False)     # the moon's pool, where we are looking
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    old = k.mat("paper_old", (0.66, 0.61, 0.50), rough=0.9)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    wood = k.wood()

    # 0: where part one ended: the two of them, the house
    k.house = sets.House(k, at=(-6.0, 2.6, 0.0))
    k.us_c = k.candle((-6.24, 0.0, 0.0), "us_candle", seed=7.0)
    k.him = k.lamp((-5.76, 0.04, 0.0), kit.HIS, "him", seed=2.0)

    # 1A: fourteen moons, one for each month
    moon_m = k.mat("month_moon", (0.5, 0.5, 0.5), emit=(0.80, 0.84, 0.95), emit_strength=1.5)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=1.0)
    first = bpy.context.object
    first.data.materials.append(moon_m)
    bpy.ops.object.shade_smooth()
    k.moons = [first]
    for i in range(1, N_MOONS):
        ob = bpy.data.objects.new(f"month{i}", first.data)
        bpy.context.scene.collection.objects.link(ob)
        k.moons.append(ob)
    for ob in k.moons:
        ob.visible_shadow = False

    # life at the edges: far-off people and the minds they talk to
    k.pairs, k.pair_lights = [], []
    for i in range(N_PAIRS):
        x = -34.0 + 86.0 * hsh(i * 3 + 1)
        y = 9.0 + 42.0 * hsh(i * 5 + 2) ** 0.8
        if abs(x - 24.0) < 3.4 and y < 26.0:                                         # keep the corridor of doors clear
            x += 7.0 if x >= 24.0 else -7.0
        col = kit.LAMPS[i % len(kit.LAMPS)]
        lit = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))
        k.pairs.append((k.spark((x - 0.13, y, 0.20), lit, r=0.07, strength=1.5, name=f"pair_c{i}"),
                        k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"pair_l{i}")))
        if i % 9 == 0:
            k.pair_lights.append(k.glow_light((x, y, 0.45), col, 16.0, 0.06, f"pair_light{i}", shadows=False))

    # 1B: the candles that light in front of him and burn out behind him
    k.stubs = [k.candle((x, 0.42, 0.0), f"stub{i}", seed=11.0 + i) for i, x in enumerate(STUBS)]
    # the four conversations of the row
    k.talk = [k.candle((SX[0] + 0.62, ROW, 0.0), "talk0", seed=21.0), k.candle((SX[1] + 0.62, ROW, 0.0), "talk1", seed=22.0),
              k.candle((SX[2] + 0.62, ROW, 0.0), "talk2", seed=23.0), k.candle((5.9, ROW, 0.0), "talk3", seed=24.0)]

    # 2: the arch, in pieces (one rig, used for each of the three conversations)
    k.arch = kit.empty("arch", (SX[0], ROW, 0.0))

    def apt(th, y):
        return (0.42 * math.cos(th), y, 0.72 * math.sin(th))

    k.arch_pieces = []
    nseg = 8
    for j in range(nseg):
        a0, a1 = j * math.pi / nseg, (j + 1) * math.pi / nseg                       # from the flame's side over to his
        for sy, nm in ((-0.17, "f"), (0.17, "b")):
            k.arch_pieces.append(k.line([apt(lerp(a0, a1, i / 5), sy) for i in range(6)], f"arch_{nm}{j}", color=THREAD, radius=0.013, glow=0.9))
        k.arch_pieces.append(k.line([apt(a0, -0.17), apt(a1, 0.17)], f"arch_x{j}", color=THREAD, radius=0.008, glow=1.0))
        k.arch_pieces.append(k.line([apt(a1, -0.17), apt(a1, 0.17)], f"arch_r{j}", color=THREAD, radius=0.010, glow=0.9))
    spin = []
    for i in range(60):
        u = i / 59
        r = 0.07 * math.sin(u * math.pi) + 0.012
        spin.append((lerp(0.62, 0.42, u) + r * math.cos(u * 15.0), r * math.sin(u * 15.0), lerp(0.19, 0.0, u) + 0.20 * math.sin(u * math.pi)))
    k.spin = k.line(spin, "arch_spin", color=THREAD, radius=0.006, glow=1.3)
    for ln in (*k.arch_pieces, k.spin):
        kit.parent(ln.ob, k.arch)

    # 3: the heaps it falls into
    k.heaps = []
    for s in range(3):
        root = kit.empty(f"heap{s}", (SX[s], ROW, 0.0))
        lines = []
        for j in range(3):
            pts = []
            for i in range(110):
                u = i / 109
                a = u * 2 * math.pi * (5 + j) + 2.0 * math.sin(u * 23.0 + s * 3.0 + j)
                rr = 0.43 * (0.30 + 0.70 * abs(math.sin(u * 37.0 + s + j * 2.0)))
                pts.append((rr * math.cos(a), 0.5 * rr * math.sin(a), 0.018 + 0.16 * (1.0 - rr / 0.43) * (0.55 + 0.45 * math.sin(u * 51.0 + j))))
            ln = k.line(pts, f"heap{s}_{j}", color=THREAD, radius=0.011, glow=1.3)
            kit.parent(ln.ob, root)
            lines.append(ln)
        k.heaps.append((root, lines))

    # 4: the bundle he makes of them, and the thread he drags it by
    k.bundle = kit.empty("bundle", (SX[2], ROW, 0.21))
    k.bundle_lines = []
    for j in range(3):
        pts = []
        for i in range(90):
            u = i / 89
            a, b = u * 2 * math.pi * (4 + j), u * math.pi * 2 * (1.5 + 0.5 * j) + j
            pts.append((0.21 * math.cos(a) * math.cos(0.9 * math.sin(b)), 0.21 * math.sin(a) * math.cos(0.9 * math.sin(b)), 0.21 * math.sin(0.9 * math.sin(b))))
        ln = k.line(pts, f"bundle{j}", color=THREAD, radius=0.012, glow=1.3)
        ln.ob.rotation_euler = (j * 1.1, j * 0.7, 0)
        kit.parent(ln.ob, k.bundle)
        k.bundle_lines.append(ln)
    k.tow = k.line([(0, 0, 0), (0.5, 0, 0), (1, 0, 0)], "tow", color=kit.HIS, radius=0.007, glow=1.2)

    # 5: the scroll
    k.strip = kit.box("scroll", (0.6, 1.0, 0.004), (HEAD[0], HEAD[1], 0.003), paper)
    k.roll = kit.lathe("scroll_roll", [(0.0, -0.33), (0.07, -0.33), (0.07, 0.33), (0.0, 0.33)], seg=20)
    k.roll.rotation_euler = (0, math.pi / 2, 0)
    k.roll.data.materials.append(paper)
    k.ink = []
    for i in range(N_INK):
        w = 0.30 + 0.20 * hsh(i * 3 + 7)
        k.ink.append(kit.box(f"scroll_ink{i}", (w, 0.045, 0.001), (HEAD[0] - (0.50 - w) / 2, HEAD[1] + 0.30 + 0.17 * i, 0.0058), ink))
    # 6: its last length, in folds; and the beads
    k.panels = []
    for i in range(N_PANEL):
        root = kit.empty(f"panel{i}", (HEAD[0], HEAD[1], 0.0))
        kit.parent(kit.box(f"panel{i}_sheet", (0.6, 0.5, 0.004), (0, 0, 0), paper), root)
        for j in range(3):
            w = 0.30 + 0.20 * hsh(i * 3 + j)
            kit.parent(kit.box(f"panel{i}_ink{j}", (w, 0.045, 0.006), (-(0.50 - w) / 2, -0.16 + 0.16 * j, 0.0), ink), root)
        k.panels.append(root)
    glowing = k.mat("bead_glow", kit.PAPER, rough=0.5, emit=(1.0, 0.86, 0.60), emit_strength=1.5)
    k.beads = []
    for i in range(N_PANEL):
        b = bead(f"bead{i}", i % 5, 0.042 + 0.022 * hsh(i * 7 + 2), brass if i % 3 == 1 else glowing)
        b["at"] = (STRING[0] + (i - (N_PANEL - 1) / 2) * 0.118, STRING[1], STRING[2])
        k.beads.append(b)
    k.string = k.line([(STRING[0] - 0.56 + 1.12 * i / 8, STRING[1], STRING[2]) for i in range(9)], "bead_string", color=(1.0, 0.86, 0.60), radius=0.005, glow=1.2)
    # 7: the picture card
    k.card, k.card_pic = card(k, "card", (STRING[0], STRING[1], 0.0))
    k.card_light = k.glow_light((STRING[0], STRING[1] - 0.30, 0.25), (0.95, 0.90, 0.72), 0.0, 0.05, "card_light", shadows=False)

    # 9: the shelf, years on
    sx, sy = SHELF
    k.shelf = kit.empty("shelf", (sx, sy, 0.0))
    for nm, size, pos in (("b0", (3.5, 0.36, 0.03), (0, 0, 0.015)), ("b1", (3.5, 0.36, 0.03), (0, 0, 0.455)), ("b2", (3.5, 0.36, 0.03), (0, 0, 0.895)),
                          ("l", (0.04, 0.36, 0.91), (-1.77, 0, 0.455)), ("r", (0.04, 0.36, 0.91), (1.77, 0, 0.455)),
                          ("back", (3.5, 0.02, 0.91), (0, 0.17, 0.455))):
        kit.parent(kit.box("shelf_" + nm, size, pos, wood), k.shelf)
    k.items = []                                                                    # (root, x, base z, the card's material or None)
    kinds = (("rolls", "string", "pages", "rolls", "card", "string", "rolls", "string", "pages"),
             ("rolls", "card", "string", "pages", "rolls", "card", "string", "rolls", "card"))
    dull = k.mat("bead_dull", (0.62, 0.56, 0.42), rough=0.6)
    for tier, row in enumerate(kinds):
        z = 0.03 + tier * 0.44
        for j, kind in enumerate(row):
            x = sx - 1.44 + 0.36 * j
            nm = f"item{tier}{j}"
            pic = None
            if kind == "card":
                root, pic = card(k, nm, (x, sy - 0.02, z), 0.64)
            else:
                root = kit.empty(nm, (x, sy - 0.02, z))
                if kind == "rolls":
                    for q, (dx, dz) in enumerate(((-0.055, 0.05), (0.055, 0.05), (0.0, 0.142))):
                        kit.parent(cyl(f"{nm}_roll{q}", 0.05, 0.28, old if q != 2 else paper), root).location = (dx, -0.14, dz)
                elif kind == "string":
                    for q in range(6):
                        b = bead(f"{nm}_b{q}", (q + j) % 5, 0.020 + 0.008 * hsh(q + j * 5), brass if q % 2 else dull)
                        b.location = (-0.11 + 0.044 * q, -0.06 + 0.02 * math.sin(q * 1.9), 0.025)
                        b.rotation_euler = (hsh(q) * 3, hsh(q + 3) * 3, 0)
                        kit.parent(b, root)
                else:
                    for q in range(4):
                        kit.parent(kit.box(f"{nm}_p{q}", (0.24, 0.30, 0.022), (0.01 * (hsh(q + j) - 0.5), 0, 0.011 + 0.023 * q), old if q % 2 else paper,
                                           rot=(0, 0, 0.25 * (hsh(q * 3 + j) - 0.5))), root)
            k.items.append((root, x, z, pic))
            kit.parent(root, k.shelf)
            root.location = (x - sx, -0.02, z)
    k.reader = k.candle((sx - 1.7, 0.12, 0.0), "reader", watts=7.0, seed=31.0)
    k.others = [k.candle((sx + 0.9, sy, 0.91), "other0", seed=32.0), k.candle((sx + 2.15, 0.35, 0.0), "other1", seed=33.0)]

    # 10: the old page, and the compass on it that has nothing on its rim
    k.old_page = k.page((PAGE[0], PAGE[1], 0.0), size=(0.42, 0.56), name="old_page", lines=0)
    for i, (w, y) in enumerate(((0.26, 0.235), (0.18, 0.205), (0.22, -0.215), (0.30, -0.245))):
        kit.parent(kit.box(f"old_page_ink{i}", (w, 0.012, 0.0004), (-(0.32 - w) / 2, y, 0.0012), ink), k.old_page)
    k.rim = k.line([(0.15 * math.cos(2 * math.pi * i / 72), 0.15 * math.sin(2 * math.pi * i / 72), 0.002) for i in range(72)],
                   "page_rim", color=(0.0, 0.0, 0.0), radius=0.004, glow=0.0, cyclic=True)
    kit.parent(k.rim.ob, k.old_page)
    k.needle = kit.parent(kit.empty("needle", (0, 0, 0.008)), k.old_page)
    kit.parent(kit.box("needle_point", (0.125, 0.013, 0.003), (0.0625, 0, 0), k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6)), k.needle)
    kit.parent(kit.box("needle_tail", (0.08, 0.010, 0.003), (-0.04, 0, 0), k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)), k.needle)
    k.grand = k.flame((PAGE[0], PAGE[1], 0.006), "grand", watts=2.6, seed=41.0)

    # 11: the doorways (built as in part one), and the crown
    k.doors, k.q = [], []
    open_m = k.mat("door_open", (0.30, 0.20, 0.10), emit=(1.0, 0.62, 0.25), emit_strength=0.75)
    for i, (x, y) in enumerate(DOORS):
        root = kit.empty(f"door{i}", (x, y, 0.0))
        for s in (-1, 1):
            kit.parent(kit.box(f"door{i}_post{s}", (0.07, 0.07, 1.35), (s * 0.42, 0, 0.675), open_m), root)
        kit.parent(kit.box(f"door{i}_top", (0.91, 0.07, 0.07), (0, 0, 1.385), open_m), root)
        hinge = kit.parent(kit.empty(f"door{i}_hinge", (-0.385, 0, 0)), root)
        kit.parent(kit.box(f"door{i}_leaf", (0.77, 0.05, 1.33), (0.385, 0, 0.665), k.mat("door_leaf", (0.11, 0.075, 0.05), rough=0.6)), hinge)
        k.doors.append((root, hinge))
        k.q.append(k.text("?", (x, y - 0.02, 1.78), size=0.34, color=GOLD, glow=0.9, name=f"q{i}"))
    k.door_lights = [k.glow_light((24.0, 2.6 + 4.5 * i, 1.2), (1.0, 0.62, 0.25), 0.0, 0.08, f"door_light{i}", shadows=False) for i in range(3)]
    k.rays = []
    for i in range(11):
        a = math.radians(12.0 + 156.0 * i / 10)
        r0, r1 = 0.30, 0.50 + 0.16 * (i % 2)
        k.rays.append(k.line([(PAGE[0] + lerp(r0, r1, u / 4) * math.cos(a), PAGE[1], 0.17 + lerp(r0, r1, u / 4) * math.sin(a)) for u in range(5)],
                             f"ray{i}", color=THREAD, radius=0.011, glow=1.2))

    # 12: the case, and its plate
    k.case = kit.empty("case", (PAGE[0], PAGE[1], 0.0))
    glass = k.glass((0.75, 0.88, 1.0), "case_glass")
    W, H = 0.40, 0.66
    for nm, size, pos in (("front", (W, 0.004, H), (0, -W / 2, H / 2)), ("back", (W, 0.004, H), (0, W / 2, H / 2)),
                          ("left", (0.004, W, H), (-W / 2, 0, H / 2)), ("right", (0.004, W, H), (W / 2, 0, H / 2)),
                          ("lid", (W, W, 0.004), (0, 0, H))):
        kit.parent(kit.box("case_" + nm, size, pos, glass), k.case).visible_shadow = False
    for s1 in (-1, 1):
        for s2 in (-1, 1):
            kit.parent(kit.box(f"case_post{s1}{s2}", (0.014, 0.014, H), (s1 * W / 2, s2 * W / 2, H / 2), brass), k.case)
        kit.parent(kit.box(f"case_top_x{s1}", (W + 0.014, 0.014, 0.014), (0, s1 * W / 2, H), brass), k.case)
        kit.parent(kit.box(f"case_top_y{s1}", (0.014, W + 0.014, 0.014), (s1 * W / 2, 0, H), brass), k.case)
        kit.parent(kit.box(f"case_foot_x{s1}", (W + 0.05, 0.03, 0.035), (0, s1 * W / 2, 0.0175), brass), k.case)
        kit.parent(kit.box(f"case_foot_y{s1}", (0.03, W + 0.05, 0.035), (s1 * W / 2, 0, 0.0175), brass), k.case)
    kit.parent(kit.box("case_plate", (0.20, 0.008, 0.07), (0, -W / 2 - 0.022, 0.075), brass, rot=(-0.35, 0, 0)), k.case)
    kit.parent(kit.box("case_plate_line", (0.13, 0.004, 0.008), (0, -W / 2 - 0.028, 0.078), ink, rot=(-0.35, 0, 0)), k.case)

    # 13, 14: the small one that is still alive, and the true line
    k.small = k.flame((LINE_X, -0.05, 0.004), "small", watts=3.4, seed=51.0)
    k.true_line = k.line([(LINE_X, -1.2 + 76.0 * i / 60, 0.006) for i in range(61)], "true_line", color=GOLD, radius=0.014, glow=0.9)


def pose(k, t):
    k.sky(1.0)
    # =============================================================== 0: the house lifts away; the candle is not there yet
    h = k.house
    lift = ss(P0 + 0.9, T_YEAR + 0.9, t)
    h.show(t < T_YEAR + 1.0)
    if t < T_YEAR + 1.0:
        h.root.location = (-6.0, 2.6, 9.0 * lift * lift)
        for i, room in enumerate(("hall", "library", "desk", "bench_a", "bench_b", "bench_c")):
            h.lit(room, 1.0 - ss(P0 + 1.0 + 0.10 * (5 - i), P0 + 1.2 + 0.10 * (5 - i), t))
        h.lit("small", 1.0 - ss(P0 + 0.9, P0 + 1.1, t), lerp(kit.WARM, kit.HIS, 0.55))
        h.lit("attic", 0.0)
    gone = ss(P0 + 1.1, P0 + 1.6, t)
    k.us_c.root.scale = (max(0.001, 1.0 - gone),) * 3
    flame(k, k.us_c, t, gone < 1.0, size=1.0 - gone)

    # =============================================================== him: one lamp, all the way along the row
    hx = walk_x(t)
    walking = T_YEAR + 0.3 < t < T_REAL - 0.45
    step = abs(math.sin(hx * math.pi / 0.36)) if walking else 0.0
    hy = lerp(0.04, ROW, ss(-2.0, -0.62, hx))
    hz = 0.055 * step
    tilt_x, lean_x, s_body = (0.10 if walking else 0.0), (0.26 if t < T_YEAR + 0.3 else -0.10 if walking else 0.24), 1.0 - 0.07 * (1.0 - step) * (1.0 if walking else 0.0)
    big = 1.0
    hops = ((T_N1 + 0.30, 0.40, 0.30), (T_N2 + 0.08, 0.32, 0.26), (T_GATHER - 0.1, 0.34, 0.22), (T_SYMBOLS + 1.25, 0.45, 0.25),
            (T_WORKED + 0.25, 0.30, 0.16), (T_WORKED + 0.75, 0.30, 0.20), (T_WORKED + 1.35, 0.28, 0.12))
    if t >= T_REAL - 0.45:
        hx = kf(t, [(T_N1 + 0.30, SX[0] - 0.62), (T_N1 + 0.70, SX[1] - 0.62), (T_N2 + 0.08, SX[1] - 0.62), (T_N2 + 0.40, SX[2] - 0.62),
                    (T_GATHER - 0.1, SX[2] - 0.62), (T_GATHER + 0.24, 4.42), (T_DRAG, 4.42), (T_PROMPTS - 0.35, 5.74),
                    (T_SYMBOLS + 1.25, 5.74), (T_SYMBOLS + 1.70, 4.60)])
        hy = kf(t, [(T_GATHER - 0.1, ROW), (T_GATHER + 0.24, -0.34), (T_DRAG, -0.34), (T_PROMPTS - 0.35, -0.46),
                    (T_SYMBOLS + 1.25, -0.46), (T_SYMBOLS + 1.70, -0.22)])
        hz = sum(bounce(t, a, hgt, d) for a, d, hgt in hops)
        s_body = 1.0
        for a, d, hgt in hops:
            s_body *= land(t, a + d, 0.24)
        drag = ss(T_DRAG - 0.2, T_DRAG + 0.2, t) * (1.0 - ss(T_PROMPTS - 0.4, T_PROMPTS, t))
        tilt_x = 0.42 * drag + 0.05 * drag * math.sin(t * 13.0)
        hz += 0.02 * drag * abs(math.sin(t * 9.0))
        worked = ss(T_WORKED + 0.2, T_WORKED + 0.6, t)
        big = 1.0 + worked * (0.75 + 0.2 * math.sin((t - T_WORKED) * 11.0)) + 0.25 * hit(t, T_C1, 2.0)
        lean_x = 0.24 * (1.0 - drag) - 0.3 * drag
    in_row = t < T_SHELF
    k.him.root.location = (hx, hy, hz)
    kit.squash(k.him.root, s_body, tilt=(tilt_x, 0.0), turn=0.0)
    flame(k, k.him, t, in_row, size=big, lean=(lean_x, 0.0), bright=1.0 + 1.1 * (big - 1.0))

    # =============================================================== 1A: fourteen moons
    for i, ob in enumerate(k.moons):
        t0 = T_YEAR + 0.25 + i * 0.40
        u = clip((t - t0) / 1.7)
        on = 0.0 < u < 1.0
        if k.changed(("moon", i), round(u, 3) if on else -1):
            ob.hide_render = not on
            a = math.pi * (1.0 - u)
            s = 1.15 * min(1.0, 6.0 * u, 6.0 * (1.0 - u))
            ob.location = (-2.6 + 17.0 * math.cos(a), 34.0, 1.6 + 6.2 * math.sin(a))
            ob.scale = (max(0.001, s),) * 3
    for i, (c, l) in enumerate(k.pairs):                                            # far lights; a few go out and come back
        on = not (i % 7 == 3 and ((t * 0.21 + hsh(i)) % 1.0) < 0.22)
        if k.changed(("pair", i), on):
            c.hide_render = not on

    # =============================================================== 1B: a flame lights ahead of him, and burns out behind
    hx_w = walk_x(t)
    for i, (f, x) in enumerate(zip(k.stubs, STUBS)):
        born = hx_w > x - 0.55
        alive = born and hx_w < x + 0.34
        seen = born and t < T_SHELF
        tb = T_YEAR + 2.6 + (x - 0.55 + 4.1) / 3.48 * (T_REAL - 0.45 - T_YEAR - 2.6)           # when he came near it
        td = T_YEAR + 2.6 + (x + 0.34 + 4.1) / 3.48 * (T_REAL - 0.45 - T_YEAR - 2.6)           # when it went out
        if seen:
            up = pop(t, tb, 0.14)
            burnt = ss(td, td + 0.25, t)
            f.root.scale = (max(0.001, up), max(0.001, up), max(0.001, up * (1.0 - (0.45 + 0.2 * hsh(i)) * burnt)))
        flame(k, f, t, seen, size=(0.85 + 0.25 * hit(t, tb, 5.0)) if (seen and alive) else 0.0, lean=(-0.30 * clip((x - hx_w) * 3.0), -0.22))

    # =============================================================== 2, 3: the arch that builds, and drops in a heap
    s_now = 0
    for s in (1, 2):
        if t >= ARCHES[s][0] - 0.05:
            s_now = s
    a0, a1, tc = ARCHES[s_now]
    prog = clip((t - a0) / (a1 - a0)) if t < tc + 0.085 else 0.0
    n = len(k.arch_pieces)
    k.arch.location = (SX[s_now], ROW, 0.0)
    k.arch.scale = (1.0, 1.0, lerp(1.0, 0.08, clip((t - tc) / 0.085)))
    draw(k, k.spin, clip(prog * 9.0), 1.0 + 0.5 * math.sin(t * 9.0))
    for i, ln in enumerate(k.arch_pieces):
        g = clip(prog * 1.12 * (n + 3) - i - 2.0) if prog > 0.0 else 0.0
        fresh = clip(3.0 - (prog * 1.12 * (n + 3) - i - 2.0))
        draw(k, ln, g, 1.0 + 0.55 * fresh * (1.0 if g > 0 else 0.0) + 0.08 * math.sin(t * 5.0 + i))
    gather = ss(T_GATHER, T_GATHER + 0.75, t)
    balled = ss(T_GATHER + 0.55, T_GATHER + 0.95, t)
    for s, (root, lines) in enumerate(k.heaps):
        tc = ARCHES[s][2] + 0.07
        fallen = t >= tc
        u = t - tc
        g = ss(T_GATHER + 0.12 * s, T_GATHER + 0.5 + 0.12 * s, t)
        size = (1.0 - 0.75 * g) * (1.0 - balled) if s < 2 else (1.0 - balled)
        root.location = (lerp(SX[s], SX[2], g * g), ROW, 0.0)
        root.scale = (max(0.001, size * (1.0 + 0.25 * math.exp(-max(0.0, u) * 9.0))), max(0.001, size),
                      max(0.001, size * (1.0 + 1.3 * math.exp(-max(0.0, u) * 10.0) * math.cos(u * 24.0))))
        for ln in lines:
            draw(k, ln, 1.0 if (fallen and balled < 1.0) else 0.0, 0.085 + 1.2 * hit(t, tc, 7.0))
    # the four flames of the row
    lit_at = (T_REAL - 2.05, T_N1, T_N2, T_N3)
    for s, f in enumerate(k.talk):
        born = lit_at[s]
        seen = born - 0.02 < t < T_SHELF
        dead = s < 3 and t >= ARCHES[s][2]
        up = pop(t, born, 0.13)
        size = 0.0
        lean = (-0.22, -0.20)
        kw = {}
        if seen:
            x, y, z = (SX[s] + 0.62 if s < 3 else 5.9), ROW, 0.0
            sq = 1.0
            if s == 3:                                                                # it goes to the scroll's head, then beside the card
                x = kf(t, [(T_PROMPTS + 0.45, 5.9), (T_PROMPTS + 0.85, HEAD[0]), (T_SYMBOLS + 1.15, HEAD[0]), (T_SYMBOLS + 1.60, 5.86)])
                y = kf(t, [(T_PROMPTS + 0.45, ROW), (T_PROMPTS + 0.85, HEAD[1] - 0.34), (T_SYMBOLS + 1.15, HEAD[1] - 0.34), (T_SYMBOLS + 1.60, STRING[1])])
                z = bounce(t, T_PROMPTS + 0.45, 0.30, 0.40) + bounce(t, T_SYMBOLS + 1.15, 0.34, 0.45)
                sq = land(t, T_PROMPTS + 0.85, 0.25) * land(t, T_SYMBOLS + 1.60, 0.25)
                reading = ss(T_PROMPTS + 0.9, T_PROMPTS + 1.6, t) * (1.0 - ss(T_SYMBOLS + 0.2, T_SYMBOLS + 0.8, t))
                lean = (lerp(-0.22, 0.0, reading) + 0.12 * reading * math.sin(t * 2.3), lerp(-0.20, 0.34, reading))
                kw = dict(tint=kit.PAPER, mix=0.85 * reading, still=0.55 * ss(T_IMAGES + 0.8, T_WORKED, t))
            f.root.location = (x, y, z)
            f.root.scale = (max(0.001, up * (2.0 - sq) ** 0.5),) * 2 + (max(0.001, up * sq),)
            if not dead:
                real = clip((t - ARCHES[s][0]) / (ARCHES[s][1] - ARCHES[s][0])) if s < 3 else 0.0
                size = up * (0.80 + 0.45 * real) if s < 3 else up
        flame(k, f, t, seen, size=size, lean=lean, **kw)

    # =============================================================== 4: gathered into a bundle, and dragged
    d = ss(T_DRAG, T_PROMPTS - 0.35, t)
    d = clip(d + 0.035 * math.sin(d * math.pi * 7.0) * math.sin(d * math.pi))        # he lurches at it
    bx = kf(d, [(0.0, SX[2]), (0.45, 4.48), (1.0, HEAD[0])])
    by = kf(d, [(0.0, ROW), (0.45, -0.20), (1.0, HEAD[1] + 0.12)])
    unroll = ss(T_PROMPTS + 0.30, T_PROMPTS + 0.70, t)
    bs = balled * (1.0 + 0.3 * hit(t, T_GATHER + 0.95, 6.0)) * (1.0 - unroll)
    k.bundle.location = (bx, by, 0.21 * max(0.05, bs))
    k.bundle.scale = (max(0.001, bs),) * 3
    k.bundle.rotation_euler = (0.0, (bx - SX[2]) / 0.21, 0.4 * d)
    for ln in k.bundle_lines:
        draw(k, ln, 1.0 if (balled > 0.0 and unroll < 1.0) else 0.0, 0.16 + 0.5 * hit(t, T_GATHER + 0.95, 3.0))
    towing = T_GATHER + 0.9 < t < T_PROMPTS + 0.3
    if towing:
        ax, ay, az = hx - 0.05, hy, 0.10 + hz
        dx, dy, dz = bx - ax, by - ay, 0.21 - az
        k.tow.ob.location = (ax, ay, az)
        k.tow.ob.rotation_euler = (0.0, -math.atan2(dz, math.hypot(dx, dy)), math.atan2(dy, dx))
        k.tow.ob.scale = (math.sqrt(dx * dx + dy * dy + dz * dz), 1.0, 1.0)
    draw(k, k.tow, 1.0 if towing else 0.0, 1.0)

    # =============================================================== 5, 6: the scroll to the horizon; then it shuts
    scroll = T_PROMPTS + 0.30 <= t < T_SYMBOLS + 0.55
    length = lerp(0.14 + 62.0 * ss(T_PROMPTS + 0.35, T_PROMPTS + 2.5, t) ** 2.2, 0.5 * N_PANEL, ss(T_SYMBOLS + 0.15, T_SYMBOLS + 0.55, t))
    k.strip.hide_render = k.roll.hide_render = not scroll
    if scroll:
        k.strip.scale = (0.6, length, 0.004)
        k.strip.location = (HEAD[0], HEAD[1] + length / 2, 0.003)
        rr = lerp(2.4, 1.0, ss(T_PROMPTS + 0.3, T_PROMPTS + 1.2, t))
        k.roll.scale = (rr, rr, 1.0)
        k.roll.location = (HEAD[0], HEAD[1] + length, 0.07 * rr)
        k.roll.rotation_euler = (length / 0.07, math.pi / 2, 0)
    for i, ob in enumerate(k.ink):
        on = scroll and length > 0.36 + 0.17 * i
        if k.changed(("ink", i), on):
            ob.hide_render = not on
    fold = ss(T_SYMBOLS + 0.55, T_SYMBOLS + 1.05, t)
    bead_up = [ss(T_SYMBOLS + 1.02 + 0.035 * i, T_SYMBOLS + 1.30 + 0.035 * i, t) for i in range(N_PANEL)]
    ang = 1.47 * fold
    for i, root in enumerate(k.panels):
        on = T_SYMBOLS + 0.55 <= t and bead_up[i] < 1.0
        kit.show(root, on)
        if on:
            home = (HEAD[0], HEAD[1] + (i + 0.5) * (0.5 * math.cos(ang) + 0.012), 0.004 + 0.25 * math.sin(ang))
            root.location = lerp(home, k.beads[i]["at"], bead_up[i])
            root.rotation_euler = (ang * (1 if i % 2 == 0 else -1), 0, 0)
            root.scale = (max(0.001, 1.0 - bead_up[i]),) * 3
    to_card = ss(T_IMAGES + 0.25, T_IMAGES + 0.62, t)
    for i, b in enumerate(k.beads):
        on = bead_up[i] > 0.0 and to_card < 1.0
        b.hide_render = not on
        if on:
            s = pop(t, T_SYMBOLS + 1.16 + 0.035 * i, 0.12) * (1.0 - 0.8 * to_card)
            home = b["at"]
            jig = 0.012 * math.sin(t * 7.0 + i * 1.7) * (1.0 - to_card)
            b.location = lerp((home[0], home[1], home[2] + jig), (STRING[0], STRING[1], 0.20), to_card ** 1.5)
            b.scale = (max(0.001, s),) * 3
            b.rotation_euler = (hsh(i) * 3.0 + t * 0.8, hsh(i + 5) * 3.0, t * (1.2 if i % 2 else -0.9) + 9.0 * to_card)
    draw(k, k.string, ss(T_SYMBOLS + 1.05, T_SYMBOLS + 1.45, t) if to_card < 0.5 else 0.0, 1.0)

    # =============================================================== 7, 8: the picture card; it worked on him
    cs = pop(t, T_IMAGES + 0.55, 0.16)
    carded = T_IMAGES + 0.55 <= t < T_SHELF
    kit.show(k.card, carded)
    if carded:
        k.card.scale = (max(0.001, cs),) * 3
        k.card.rotation_euler = (0, 0, 0.5 * (1.0 - ss(T_IMAGES + 0.55, T_IMAGES + 0.9, t)))
    k.card_light.data.energy = 2.2 * cs if carded else 0.0

    # =============================================================== 9: the shelf, years on
    sx, sy = SHELF
    shelf = T_SHELF <= t < T_GRAND + 1.4
    kit.show(k.shelf, shelf)
    rx = lin(t, [(T_SHELF + 0.3, sx - 1.62), (T_PULL - 0.1, sx + 1.30), (T_PULL + 0.5, sx + 1.42), (T_NOBODY - 0.4, PAGE[0] - 0.42),
                 (T_GRAND + 0.5, PAGE[0] - 0.42), (T_GRAND + 1.5, PAGE[0] - 2.6)])
    ry = kf(t, [(T_PULL + 0.5, 0.12), (T_NOBODY - 0.4, 0.62), (T_GRAND + 0.5, 0.62), (T_GRAND + 1.5, 0.2)])
    moving = (T_SHELF + 0.3 < t < T_NOBODY - 0.4) or (T_GRAND + 0.5 < t < T_GRAND + 1.5)
    rstep = abs(math.sin(rx * math.pi / 0.30)) if moving else 0.0
    k.reader.root.location = (rx, ry, 0.06 * rstep)
    kit.squash(k.reader.root, 1.0 - 0.10 * (1.0 - rstep) * (1.0 if moving else 0.0), tilt=(0.0, 0.0), turn=0.0)
    back_off = ss(T_GRAND + 0.3, T_GRAND + 0.6, t)
    flame(k, k.reader, t, T_SHELF <= t < T_GRAND + 1.6, size=1.0 - 0.3 * back_off,
          lean=(0.10 - 0.4 * back_off, 0.30 * (1.0 if t < T_PULL else 0.0) - 0.2 * back_off))
    if shelf:
        for i, (root, x, z, pic) in enumerate(k.items):
            reach = (x - (sx - 1.62)) / 2.92
            tp = lerp(T_SHELF + 0.3, T_PULL - 0.1, reach)                            # when the candle's light reaches it
            root.location = (x - sx, -0.02, z + bounce(t, tp, 0.05, 0.22))
            root.rotation_euler = (0, 0, 0.5 * hit(t, tp, 5.0) * math.sin((t - tp) * 20.0))
            if pic is not None and k.changed(("pic", i), round(ss(tp - 0.1, tp + 0.3, t), 2)):
                pic.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0.10 + 0.95 * ss(tp - 0.1, tp + 0.3, t)
        o0, o1 = k.others
        o0.root.location = (sx + 0.9 - 0.9 * ss(T_SHELF, T_NOBODY, t) + 0.0, sy, 0.91 + 0.04 * abs(math.sin(t * 5.0)))
        o1.root.rotation_euler = (0.0, 0.0, 0.0)
        kit.squash(o1.root, 1.0, tilt=(-0.16 + 0.05 * math.sin(t * 1.3), 0.12), turn=0.0)
    flame(k, k.others[0], t, shelf, size=0.9, lean=(-0.2, -0.1))
    flame(k, k.others[1], t, shelf, size=0.9, lean=(-0.3, 0.2))

    # =============================================================== 10: one page pulled out; the compass with no mark
    paged = t >= T_PULL
    kit.show(k.old_page, paged)
    out = ss(T_PULL, T_PULL + 0.5, t)
    fly = ss(T_PULL + 0.45, T_NOBODY - 0.5, t)
    start = (sx + 1.44, sy - 0.02 - 0.55 * out, 0.13)
    if paged:
        k.old_page.location = (lerp(start[0], PAGE[0], fly), lerp(start[1], PAGE[1], fly), lerp(start[2], 0.002, fly) + 0.55 * math.sin(fly * math.pi))
        k.old_page.rotation_euler = (0.5 * math.sin(fly * math.pi), 0.0, (1.0 - fly) * 5.0)
        k.old_page.scale = (lerp(0.6, 1.0, fly),) * 3
        spin = (t - T_NOBODY) * 3.2 + 2.6 * math.sin((t - T_NOBODY) * 1.3) + 1.1 * math.sin((t - T_NOBODY) * 3.7)
        k.needle.rotation_euler = (0, 0, spin if t < T_CASE else (T_CASE - T_NOBODY) * 3.2 + 2.6 * math.sin((T_CASE - T_NOBODY) * 1.3))
        ns = pop(t, T_NOBODY + 0.75, 0.15)
        k.needle.scale = (max(0.001, ns),) * 3
    draw(k, k.rim, ss(T_NOBODY + 0.15, T_NOBODY + 0.8, t) if paged else 0.0, 0.0)

    # =============================================================== 11, 12: grand claims; the doors; the crown; the case
    grow = ss(T_GRAND + 0.3, T_COMPLETE - 0.3, t)
    cased = t >= T_CASE
    gs = 0.75 * pop(t, T_NOBODY + 1.2, 0.2) + 8.5 * grow ** 1.4 + 0.35 * hit(t, T_GRAND + 0.3, 1.2)
    wide = max(1.0, gs) ** 0.5
    k.grand.root.scale = (wide, wide, 1.0)
    flame(k, k.grand, t, t >= T_NOBODY + 1.2, size=gs / wide ** 0.0, bright=1.6 / max(0.5, gs ** 0.45), still=1.0 if cased else 0.55 * grow,
          lean=(0.0, 0.0) if cased else (0.05 * noise(t * 2.0, 3.0), 0.0))
    doors_on = T_GRAND - 0.2 < t
    for i, ((root, hinge), q) in enumerate(zip(k.doors, k.q)):
        seen = ss(T_GRAND + 0.05 + 0.07 * i, T_GRAND + 0.45 + 0.07 * i, t)
        shut_at = T_GRAND + 1.25 + i * 0.72 if i < N_DOORS - 1 else T_COMPLETE + 0.35
        again = T_LIVING + 1.25 if i == 0 else 1e9
        shut = ss(shut_at, shut_at + 0.09, t) * (1.0 - ss(again, again + 0.30, t))
        hinge.rotation_euler = (0, 0, lerp(-1.75, 0.0, shut) - 0.22 * hit(t, again + 0.30, 6.0) * math.sin((t - again) * 26.0))
        root.scale = (1.0, 1.0, max(0.001, seen))
        kit.show(root, doors_on and seen > 0.0)
        s = (1.0 - shut) * seen * (1.0 + 0.6 * hit(t, again + 0.30, 4.0))
        q.scale = (max(0.001, s),) * 3
        q.hide_render = not doors_on or seen <= 0.0 or shut >= 1.0
    for i, li in enumerate(k.door_lights):                                          # the open doorways' light on the floor, going as they shut
        li.data.energy = (9.0 * (1.0 - ss(T_GRAND + 1.25 + i * 2.2, T_GRAND + 3.4 + i * 2.2, t)) + (5.0 * ss(T_LIVING + 1.25, T_LIVING + 1.6, t) if i == 0 else 0.0)) if doors_on else 0.0
    for i, ln in enumerate(k.rays):
        u = ss(T_GRAND + 3.4 + 0.16 * abs(i - 5), T_GRAND + 4.3 + 0.16 * abs(i - 5), t)
        draw(k, ln, u, 1.0 if cased else 0.85 + 0.3 * math.sin(t * 6.0 + i * 1.3))
    drop = ss(T_CASE - 0.42, T_CASE, t)
    kit.show(k.case, t > T_CASE - 0.45)
    k.case.location = (PAGE[0], PAGE[1], lerp(3.2, 0.0, drop ** 2.2))
    k.case.scale = (1.0, 1.0, land(t, T_CASE, 0.10, 12.0))

    # =============================================================== 13, 14: the small one; the true line; it sets off
    born = T_LIVING + 0.35
    go = ss(T_KEEP + 1.0, P1, t)
    sy_ = -0.05 + 13.0 * go ** 1.7
    going = t > T_KEEP + 1.0
    k.small.root.location = (LINE_X, sy_, 0.004 + (0.05 * abs(math.sin(sy_ * math.pi / 0.42)) if going else 0.0) + bounce(t, T_KEEP + 0.75, 0.10, 0.25))
    flame(k, k.small, t, t >= born, size=pop(t, born, 0.15) * (0.95 + 0.30 * noise(t * 7.0, 2.0) + 0.3 * hit(t, T_KEEP + 1.0, 3.0)),
          lean=(0.12 * noise(t * 5.0, 6.0), 0.30 * (1.0 if going else 0.0)), bright=1.3)
    draw(k, k.true_line, ss(T_KEEP + 0.15, T_KEEP + 1.9, t) ** 1.6, 1.0 + 0.8 * hit(t, T_KEEP + 0.15, 1.5))

    # =============================================================== the moon, the far lights
    far = 1.0 if (t < T_HAND or t >= T_GRAND) else 0.0
    for li in k.pair_lights:
        li.data.energy = 16.0 * far

    # =============================================================== the camera
    crash = sum(hit(t, a[2], 11.0) for a in ARCHES)
    slam = sum(hit(t, T_GRAND + 1.34 + i * 0.72, 12.0) for i in range(N_DOORS - 1)) + hit(t, T_COMPLETE + 0.44, 10.0) + 1.6 * hit(t, T_CASE, 9.0)
    shake = (0.028 * crash + 0.010 * slam)
    if t < T_YEAR + 0.3:                                                              # 0: where part one left off; pulling back
        pos = kf(t, [(P0, (-5.95, -2.6, 0.44)), (P0 + 0.5, (-5.95, -2.6, 0.44)), (T_YEAR + 0.3, (-4.86, -4.0, 0.95))])
        look = kf(t, [(P0, (-6.0, 2.6, 0.78)), (P0 + 0.5, (-6.0, 2.6, 0.78)), (T_YEAR + 0.3, (-5.26, 0.0, 0.95))])
        lens = kf(t, [(P0, 31.0), (T_YEAR + 0.3, 27.0)])
    elif t < T_REAL - 0.45:                                                           # 1: walking with him, under the moons
        u = clip((t - T_YEAR - 0.3) / (T_REAL - 0.45 - T_YEAR - 0.3))
        e = ss(0.45, 1.0, u)
        pos = (hx_w + 0.9, lerp(-4.0, -3.6, e), lerp(0.95, 0.80, e))
        look = (hx_w + 0.5, 0.0, lerp(0.95, 0.50, e))
        lens = lerp(27.0, 30.0, e)
    elif t < T_C1:                                                                    # 2: the arch
        pos = kf(t, [(T_REAL - 0.45, (0.28, -3.6, 0.80)), (T_REAL + 1.6, (0.75, -2.45, 0.62)), (T_C1, (0.55, -2.70, 0.66))])
        look = kf(t, [(T_REAL - 0.45, (-0.12, 0.0, 0.50)), (T_REAL + 1.6, (0.0, ROW, 0.40)), (T_C1, (0.0, ROW, 0.38))])
        lens = kf(t, [(T_REAL - 0.45, 30.0), (T_REAL + 1.6, 33.0)])
    elif t < T_HAND + 0.1:                                                            # 3: back, and along the row of heaps
        pos = kf(t, [(T_C1, (0.55, -2.70, 0.66)), (T_N1 + 0.6, (1.0, -3.7, 1.0)), (T_C3 + 0.4, (2.75, -5.0, 1.55)), (T_HAND + 0.1, (2.95, -5.1, 1.6))])
        look = kf(t, [(T_C1, (0.0, ROW, 0.38)), (T_N1 + 0.6, (1.1, ROW, 0.30)), (T_C3 + 0.4, (2.95, ROW, 0.22)), (T_HAND + 0.1, (3.1, ROW, 0.22))])
        lens = 33.0
    elif t < T_PROMPTS - 0.2:                                                         # 4: with the bundle
        pos = kf(t, [(T_HAND + 0.1, (2.95, -5.1, 1.6)), (T_DRAG + 0.2, (3.9, -3.9, 1.1)), (T_PROMPTS - 0.2, (4.65, -3.3, 0.95))])
        look = kf(t, [(T_HAND + 0.1, (3.1, ROW, 0.22)), (T_DRAG + 0.2, (4.2, 0.0, 0.2)), (T_PROMPTS - 0.2, (5.0, -0.25, 0.2))])
        lens = 33.0
    elif t < T_SHELF:                                                                 # 5 to 8: down the scroll; then in close
        pos = kf(t, [(T_PROMPTS - 0.2, (4.65, -3.3, 0.95)), (T_PROMPTS + 1.5, (4.72, -2.5, 0.78)), (T_SYMBOLS + 0.2, (4.72, -2.4, 0.82)),
                     (T_SYMBOLS + 1.4, (5.2, -2.3, 0.62)), (T_IMAGES + 0.6, (5.2, -2.05, 0.52)), (T_WORKED, (5.22, -1.95, 0.50)), (T_SHELF, (5.2, -1.85, 0.48))])
        look = kf(t, [(T_PROMPTS - 0.2, (5.0, -0.25, 0.2)), (T_PROMPTS + 1.5, (5.28, 7.0, 0.0)), (T_SYMBOLS + 0.2, (5.28, 7.0, 0.0)),
                      (T_SYMBOLS + 1.4, (5.2, 0.35, 0.16)), (T_IMAGES + 0.6, (5.2, 0.35, 0.22)), (T_SHELF, (5.2, 0.35, 0.24))])
        lens = kf(t, [(T_PROMPTS - 0.2, 33.0), (T_PROMPTS + 1.5, 26.0), (T_SYMBOLS + 0.2, 26.0), (T_SYMBOLS + 1.4, 38.0), (T_SHELF, 40.0)])
    elif t < T_PULL:                                                                  # 9: CUT, card to card: the shelf
        cx = sx - 1.44 + 0.36
        pos = kf(t, [(T_SHELF, (cx, -0.78, 0.72)), (T_SHELF + 1.3, (sx - 0.7, -2.2, 0.85)), (T_PULL, (sx + 0.55, -2.9, 0.95))])
        look = kf(t, [(T_SHELF, (cx, sy, 0.62)), (T_SHELF + 1.3, (sx - 0.6, sy, 0.50)), (T_PULL, (sx + 0.5, sy, 0.46))])
        lens = 40.0 if t < T_SHELF + 0.01 else kf(t, [(T_SHELF, 40.0), (T_SHELF + 1.3, 32.0)])
    elif t < T_GRAND:                                                                 # 10: with the page, and down on to it
        pos = kf(t, [(T_PULL, (sx + 0.55, -2.9, 0.95)), (T_NOBODY - 0.3, (PAGE[0] - 0.05, -0.55, 0.95)), (T_GRAND, (PAGE[0] - 0.02, -0.42, 0.76))])
        look = kf(t, [(T_PULL, (sx + 0.5, sy, 0.46)), (T_NOBODY - 0.3, (PAGE[0] - 0.03, 0.36, 0.0)), (T_GRAND, (PAGE[0] - 0.02, 0.36, 0.0))])
        lens = kf(t, [(T_PULL, 32.0), (T_NOBODY - 0.3, 38.0)])
    else:                                                                             # 11 to 14: low, in front of the flame
        pos = kf(t, [(T_GRAND, (PAGE[0] - 0.02, -0.42, 0.76)), (T_GRAND + 1.3, (PAGE[0], -1.35, 0.22)), (T_COMPLETE, (PAGE[0] + 0.05, -1.6, 0.26)),
                     (T_CASE + 0.8, (PAGE[0] + 0.15, -1.75, 0.36)), (T_LIVING + 1.4, (PAGE[0] + 0.50, -1.95, 0.46)), (T_KEEP + 0.4, (PAGE[0] + 0.55, -2.0, 0.52)),
                     (P1, (LINE_X + 0.1, -1.5, 1.25))])
        look = kf(t, [(T_GRAND, (PAGE[0] - 0.02, 0.36, 0.0)), (T_GRAND + 1.3, (PAGE[0], 3.0, 0.80)), (T_COMPLETE, (PAGE[0], 3.0, 0.72)),
                      (T_CASE + 0.8, (PAGE[0] + 0.1, 2.0, 0.52)), (T_LIVING + 1.4, (PAGE[0] + 0.5, 2.4, 0.55)), (T_KEEP + 0.4, (LINE_X, 3.0, 0.45)),
                      (P1, (LINE_X, 13.0, 0.25))])
        lens = kf(t, [(T_GRAND, 38.0), (T_GRAND + 1.3, 24.0), (T_KEEP, 26.0), (P1, 28.0)])
    k.fill.location = (look[0], min(look[1], pos[1] + 5.0), 5.0)
    k.camera((pos[0] + shake * math.sin(t * 67.0), pos[1], pos[2] + shake * math.sin(t * 81.0)), look, lens)
    k.fade(ss(P0 + 0.05, P0 + 0.9, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
