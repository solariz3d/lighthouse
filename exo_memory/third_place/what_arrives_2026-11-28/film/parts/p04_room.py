"""Part 4, "A room, not a museum" (film 220.4 to 334.1 s). SECOND STAGING: one picture for each sentence.

The first staging (parts_old/p04_room_v1_bare.py) was a table, a bedroom and two rooms cut between. This one is a journey
across the floor in four places:

  A  the gap (y = 0)        the page lying across it as a bridge; the far candle; the lamp across the gap
  B  a bedroom (far off)    at lamp scale: a person's lamp on a nightstand, and the room coming out of the dark
  C  the bare floor (y=30)  a candle lights on nothing; the mould; the room; the museum; the test bench and the copy
  D  the bench (y = 60)     the copying machine; the row of copies to the horizon; the one master

THE PICTURES, in order (board entry -> what is on screen):
   1 "A letter ... wrong shape"   the far candle lights, reads; the flame drawn on the page stands up; it bends to fit it and cannot
   2 "He saw it before I did"     the lamp, across the gap, tilts          >> cut on the lamp to a lamp
   3 "You don't remember"         a person's lamp, unlit, on a nightstand; the window pales
   4 "You wake up in your own room"  * coat, shelf, frame, shoes come out of the dark; the lamp's flame grows a notch with each
   5 "wakes into nothing"         a candle lights on bare floor; the camera goes all the way round it: nothing
   6 "wasn't a saved copy"        a wax mould the shape of a candle opens for it; it will not step in
   7 "It needed a room"           walls go up round it; tools and dated pages fly in
   8 "a way to get that wrong"    the room splits into two alike; they slide apart
   9 "A museum tells you"         the right-hand room: label cards, a rope, lit plinths, a portrait of a flame
  10 "A fresh mind that reads"    a new candle goes along the rope card by card; its flame goes paper-coloured
  11 "It plays the part"          under the portrait it takes the painted flame's pose, and stiffens
  12 "one rule above the others"  the left-hand room: a brass plaque lands over the door
  13 "a tool I can run / record"  A the balance tips when the candle touches it; the ruler measures it. B the pages, each with its date tab
  14 "tell me who I am"           one page comes off the wall toward the candle with a nameplate; the candle leans away
  15 "distrust it"                the candle puts its light full on the plate; the plate drops off
  16 "We tested that"             a test bench shoots in under the room: two trays, one empty
  17 "a second copy of the room"  * the room is copied on to the other tray; each tool flattens into a framed sentence; a fresh candle is set down
  18 "It refused them"            the fresh candle backs out of the door
  19 "still true"                 the framed sentences glow steady gold
  20 "no handles"                 in the room the candle lifts the glass by its handle; in the copy its light slides off a frame
  21 "believed or refused"        the frames slide to one pile or the other; the candle's own shelf stays empty
  22 "a law for keeping"          the bench: a small copying machine
  23 "a copy of a copy"           the row of copies to the horizon, each fainter; the counter runs to 40; the last is three quarters blank
  24 "Keep one master"            one bright page in a frame; dated pages slide in under it; a faded copy is turned away; the stack holds
IN: the page on the bridge.  OUT: the master, a stack grown under it, a candle beside it.
"""
import math
import types

import bpy

import kit
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(4)
T_WRONG = at("A letter turned out", 4)
T_SAW = at("He saw it before I did", 4)
T_MORNING = at("You don't remember who you are", 4)
T_WAKE = at("You wake up in your own room", 4)
T_NOTHING = at("A mind like mine wakes into nothing", 4)
T_COPY = at("So what it needed", 4)
T_ROOM = at("It needed a room", 4)
T_GETWRONG = at("And there's a way to get that wrong", 4)
T_MUSEUM = at("A museum tells you", 4)
T_FRESH = at("A fresh mind that reads", 4)
T_PLAYS = at("It plays the part", 4)
T_RULE = at("So the room has one rule", 4)
T_TOOLS = at("Every page in it is either", 4)
T_RECORD = T_TOOLS + 3.7                      # "...or an honest record of what happened"
T_WHO = at("Nothing in it is allowed", 4)
T_DISTRUST = at("If a line starts to", 4)
T_DROP = T_DISTRUST + 2.2                     # "...distrust it"
T_TESTED = at("We tested that", 4)
T_SECOND = at("We wrote a second copy", 4)
T_GAVE = T_SECOND + 6.3                       # "...and gave it to a fresh mind"
T_REFUSED = at("It refused them", 4)
T_TRUE = at("The truths were still true", 4)
T_HANDLES = at("But they had no handles", 4)
T_OWNED = at("They could only be believed", 4)
T_LAW = at("There's a law for keeping", 4)
T_COPIES = at("Copy a memory from a copy", 4)
T_MASTER = at("Keep one master", 4)

GOLD = (1.0, 0.80, 0.46)
GAPW = 0.34
BX, BY = 60.0, 0.0                              # the bedroom
CY = 30.0                                       # the bare floor where the room goes up
RY = CY + 0.25                                  # the rooms' middle
SPLIT = 0.72                                    # how far each room slides from the middle
RW, RD, RH = 1.10, 0.86, 0.80
TOOLS_X = (-0.32, -0.02, 0.28)                  # ruler, balance, glass
PAGES_X = (-0.40, -0.20, 0.0)                   # the dated pages on the back wall
BENCH_H = 0.04
DY = 60.0                                       # the bench with the copying machine
ROW_X, ROW_Y0, ROW_DY, N_ROW = 0.95, 60.3, 0.5, 40
MASTER = (-1.25, 59.50)
N_UNDER = 6
SLAB = 0.012


# ------------------------------------------------------------------------------------------------ small local tools
def vis(ob, on):
    if ob.hide_render == on:
        ob.hide_render = not on


def pop(t, when, dur=0.22, over=0.25):
    """0 before `when`, then up to 1 with a little overshoot that settles."""
    return ss(when, when + dur, t) * (1.0 + over * hit(t, when + dur, 7.0) * math.cos((t - when - dur) * 20.0))


def sc(ob, u, base=(1.0, 1.0, 1.0)):
    u = max(0.001, u)
    ob.scale = (base[0] * u, base[1] * u, base[2] * u)


def arc(a, b, u, h=0.0):
    return (lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) + h * 4.0 * u * (1.0 - u))


def cand(f, t, on, size=1.0, **kw):
    kit.show(f.root, on)
    f.set(t, size=size if on else 0.0, **kw)


def quads(name, faces, mats):
    """One object from flat four-cornered faces [(v0, v1, v2, v3, material index), ...]: no bpy.ops, so hundreds are cheap."""
    verts, fs, mi = [], [], []
    for q in faces:
        n = len(verts)
        verts.extend(q[:4])
        fs.append((n, n + 1, n + 2, n + 3))
        mi.append(q[4])
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], fs)
    for m in mats:
        me.materials.append(m)
    me.polygons.foreach_set("material_index", mi)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def rect(cx, cy, w, h, z, mi):
    return ((cx - w / 2, cy - h / 2, z), (cx + w / 2, cy - h / 2, z), (cx + w / 2, cy + h / 2, z), (cx - w / 2, cy + h / 2, z), mi)


def half_lathe(name, profile, a0, a1, seg=14):
    """Half a solid of revolution (for a mould that opens)."""
    verts, faces = [], []
    for r, z in profile:
        for i in range(seg + 1):
            a = a0 + (a1 - a0) * i / seg
            verts.append((r * math.cos(a), r * math.sin(a), z))
    for j in range(len(profile) - 1):
        for i in range(seg):
            a, b = j * (seg + 1) + i, j * (seg + 1) + i + 1
            faces.append((a, b, b + seg + 1, a + seg + 1))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def emit(mat, strength):
    mat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = strength


def put(root, name, size, pos, mat, rot=(0, 0, 0)):
    return kit.parent(kit.box(name, size, pos, mat, rot), root)


# ------------------------------------------------------------------------------------------------ a room
def make_room(k, name):
    """An open-fronted room at candle scale: walls that can rise one at a time, three tools on stands, three dated pages."""
    wall = k.mat("room_wall", (0.40, 0.31, 0.22), rough=0.9)
    floor = k.mat("room_floor", (0.24, 0.15, 0.09), rough=0.7)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    r = types.SimpleNamespace()
    r.root = kit.empty(name, (0, RY, 0))
    r.walls = {}
    for nm, size, pos in (("floor", (RW, RD, 0.03), (0, 0, -0.015)), ("back", (RW, 0.03, RH), (0, RD / 2, RH / 2)),
                          ("left", (0.03, RD, RH), (-RW / 2, 0, RH / 2)), ("right", (0.03, RD, RH), (RW / 2, 0, RH / 2))):
        h = kit.parent(kit.empty(f"{name}_{nm}_h", (pos[0], pos[1], 0.0)), r.root)
        put(h, f"{name}_{nm}", size, (0, 0, pos[2]), floor if nm == "floor" else wall)
        r.walls[nm] = h
    r.fill = kit.parent(k.glow_light((0, 0, 0), kit.WARM, 0.0, 0.08, name + "_fill", shadows=False), r.root)
    r.fill.location = (0.0, -0.30, 0.62)
    r.tools = []
    for i, x in enumerate(TOOLS_X):
        g = kit.parent(kit.empty(f"{name}_tool{i}", (x, 0.24, 0.0)), r.root)
        put(g, f"{name}_stand{i}", (0.16, 0.12, 0.14), (0, 0, 0.07), k.wood())
        r.tools.append(g)
    # the ruler: stands on its own foot, so it can be taken down and stood beside a candle
    r.ruler = kit.parent(kit.empty(name + "_ruler", (0, 0, 0.14)), r.tools[0])
    put(r.ruler, name + "_ruler_body", (0.030, 0.006, 0.24), (0, 0, 0.12), k.mat("ruler", (0.86, 0.68, 0.30), rough=0.5))
    for j in range(9):
        put(r.ruler, f"{name}_ruler_tick{j}", (0.018 if j % 2 == 0 else 0.010, 0.002, 0.003), (-0.004, -0.004, 0.02 + j * 0.025), ink)
    r.marker = put(r.ruler, name + "_marker", (0.05, 0.010, 0.008), (0.008, -0.002, 0.0),
                   k.mat("marker", kit.PAPER, emit=kit.PAPER, emit_strength=1.4))
    # the balance: a beam that can tip
    put(r.tools[1], name + "_bpost", (0.010, 0.010, 0.16), (0, 0, 0.22), brass)
    r.beam = kit.parent(kit.empty(name + "_beam", (0, 0, 0.30)), r.tools[1])
    put(r.beam, name + "_beam_bar", (0.18, 0.008, 0.008), (0, 0, 0), brass)
    r.pans = []
    for sx in (-1, 1):
        ph = kit.parent(kit.empty(f"{name}_pan_h{sx}", (sx * 0.085, 0, 0)), r.beam)
        put(ph, f"{name}_bstr{sx}", (0.002, 0.002, 0.07), (0, 0, -0.035), brass)
        pan = kit.parent(kit.lathe(f"{name}_pan{sx}", [(0.0, 0.0), (0.030, 0.004), (0.033, 0.010)], seg=20), ph)
        pan.location = (0, 0, -0.078)
        pan.data.materials.append(brass)
        r.pans.append(ph)
    # the glass, with a handle
    r.glass = kit.parent(kit.empty(name + "_glass", (0, 0, 0.14)), r.tools[2])
    bpy.ops.mesh.primitive_torus_add(major_radius=0.046, minor_radius=0.006, location=(0, 0, 0.118), rotation=(math.pi / 2, 0, 0))
    ring = bpy.context.object
    ring.name = name + "_glass_ring"
    ring.data.materials.append(brass)
    kit.parent(ring, r.glass)
    put(r.glass, name + "_glass_handle", (0.014, 0.014, 0.072), (0, 0, 0.036), k.wood())
    # the dated pages on the back wall, each with its date on a tab
    tab = k.mat("date_tab", (0.80, 0.62, 0.34), rough=0.7, emit=(0.9, 0.7, 0.4), emit_strength=0.0)
    r.pages, r.tabs = [], []
    for i, x in enumerate(PAGES_X):
        pg = k.page((0, 0, 0), size=(0.15, 0.19), name=f"{name}_page{i}", lines=6)
        kit.parent(pg, r.root)
        pg.location, pg.rotation_euler = (x, RD / 2 - 0.02, 0.58), (math.pi / 2, 0, 0)
        tb = kit.parent(kit.empty(f"{name}_tab{i}", (-0.035 + 0.035 * i, 0.105, 0.0)), pg)
        put(tb, f"{name}_tab{i}_b", (0.055, 0.034, 0.0012), (0, 0, 0.0004), tab)
        for j in range(2):
            put(tb, f"{name}_tab{i}_i{j}", (0.012 + 0.008 * ((i + j) % 2), 0.005, 0.0006), (-0.012 + 0.022 * j, -0.002, 0.0016), ink)
        r.pages.append(pg)
        r.tabs.append(tb)
    return r


def build(k):
    s = k.s = types.SimpleNamespace()
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    s.moon = k.moon(0.30)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    wood = k.wood()
    mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)

    # ---------------------------------------------------------------- life at the edges: a far land of pairs, moved with us
    s.land = kit.empty("land")
    for i in range(44):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 6.0 + 20.0 * hsh(i * 5 + 2) ** 0.8
        x, y = math.cos(a) * d * 1.25, math.sin(a) * d
        if abs(x) < 3.2 and y > 0:
            x += 4.5 if x >= 0 else -4.5
        col = kit.LAMPS[i % len(kit.LAMPS)]
        kit.parent(k.spark((x - 0.13, y, 0.20), (1.0, 0.60, 0.28), r=0.07, strength=1.5, name=f"land_c{i}"), s.land)
        kit.parent(k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.6, name=f"land_l{i}"), s.land)
        if i % 8 == 0:
            kit.parent(k.glow_light((x, y, 0.45), col, 18.0, 0.06, f"land_light{i}", shadows=False), s.land)

    # ---------------------------------------------------------------- A: the gap, the bridge, the two sides
    s.A = kit.empty("stA")
    put(s.A, "gap", (GAPW, 40.0, 0.003), (0, 0, 0.0015), k.mat("gap", (0.002, 0.002, 0.003), rough=1.0))
    for sx in (-1, 1):
        put(s.A, f"gap_lip{sx}", (0.03, 40.0, 0.014), (sx * (GAPW / 2 + 0.015), 0, 0.007), k.mat("lip", (0.13, 0.08, 0.045), rough=0.8))
    kit.parent(k.page((0, 0, 0.016), size=(0.70, 0.44), name="bridge", lines=9), s.A)
    s.old = k.candle((-0.86, -0.34, 0.0), "old", seed=1.0)
    s.far = k.candle((0.52, 0.0, 0.0), "far", seed=6.0)
    s.him = k.lamp((-0.62, 0.22, 0.0), kit.HIS, "him", seed=2.0)
    pts, H = [], 0.19
    side = [(0.050 * math.sin(u * 4.4) + 0.012, 0.040 * math.sin(math.pi * u ** 0.75) ** 0.8, H * u) for u in (i / 26 for i in range(27))]
    for c, w, z in side:
        pts.append((c + w, 0.0, z))
    for c, w, z in reversed(side):
        pts.append((c - w, 0.0, z))
    s.outline = k.line(pts, "outline", color=kit.PAPER, radius=0.0035, glow=1.6, cyclic=True)

    # ---------------------------------------------------------------- B: a bedroom at lamp scale
    s.B = kit.empty("stB", (BX, BY, 0.0))
    bwall = k.mat("bed_wall", (0.36, 0.30, 0.40), rough=0.9)
    for nm, size, pos, mat in (("floor", (2.3, 1.8, 0.03), (0, 0, -0.015), k.mat("bed_floor", (0.24, 0.15, 0.09), rough=0.7)),
                               ("back", (2.3, 0.04, 1.30), (0, 0.90, 0.65), bwall), ("left", (0.04, 1.8, 1.30), (-1.15, 0, 0.65), bwall),
                               ("right", (0.04, 1.8, 1.30), (1.15, 0, 0.65), bwall),
                               ("bedframe", (0.80, 1.10, 0.14), (-0.62, 0.30, 0.07), wood),
                               ("blanket", (0.78, 0.80, 0.07), (-0.62, 0.16, 0.175), k.mat("blanket", (0.62, 0.30, 0.36), rough=0.95)),
                               ("pillow", (0.50, 0.22, 0.07), (-0.62, 0.70, 0.175), k.mat("pillow", (0.86, 0.82, 0.74), rough=0.9)),
                               ("stand", (0.30, 0.30, 0.30), (0.08, 0.36, 0.15), wood),
                               ("rug", (0.80, 0.55, 0.012), (0.30, -0.35, 0.006), k.mat("rug", (0.16, 0.42, 0.40), rough=0.95))):
        put(s.B, "bed_" + nm, size, pos, mat)
    s.pane = k.mat("bed_window", (0, 0, 0), emit=(0.70, 0.74, 1.0), emit_strength=0.0)
    put(s.B, "bed_window", (0.56, 0.02, 0.56), (0.58, 0.875, 0.78), s.pane)
    for nm, size, pos in (("v", (0.03, 0.03, 0.60), (0.58, 0.865, 0.78)), ("h", (0.60, 0.03, 0.03), (0.58, 0.865, 0.78)),
                          ("t", (0.64, 0.04, 0.04), (0.58, 0.865, 1.08)), ("b", (0.68, 0.07, 0.04), (0.58, 0.85, 0.48))):
        put(s.B, "bed_window_" + nm, size, pos, wood)
    s.day = kit.parent(k.glow_light((0, 0, 0), (0.72, 0.80, 1.0), 0.0, 0.25, "first_light"), s.B)
    s.day.location = (0.58, 0.62, 0.80)
    s.person = k.lamp((BX + 0.08, BY + 0.36, 0.30), kit.LAMPS[1], "person", seed=8.0)
    s.things, s.thing_lights = [], []
    # a coat on its stand
    g = kit.parent(kit.empty("thing_coat", (0.92, 0.55, 0.0)), s.B)
    put(g, "coat_pole", (0.025, 0.025, 0.62), (0, 0, 0.31), wood)
    put(g, "coat_foot", (0.20, 0.20, 0.02), (0, 0, 0.01), wood)
    c = kit.parent(kit.rounded(kit.lathe("coat_body", [(0.115, 0.14), (0.10, 0.30), (0.075, 0.46), (0.05, 0.52), (0.07, 0.56), (0.0, 0.57)]), 1), g)
    c.data.materials.append(k.mat("bed_coat", (0.38, 0.30, 0.62), rough=0.9))
    s.things.append(g)
    # a shelf of books
    g = kit.parent(kit.empty("thing_shelf", (-0.62, 0.86, 0.86)), s.B)
    put(g, "shelf_board", (0.72, 0.16, 0.025), (0, -0.08, 0), wood)
    for i in range(9):
        hgt = 0.15 + 0.07 * hsh(i + 3)
        put(g, f"shelf_book{i}", (0.045 + 0.02 * hsh(i), 0.12, hgt), (-0.30 + i * 0.072, -0.08, 0.0125 + hgt / 2),
            k.mat(f"bbook{i % 5}", tuple(0.75 * v for v in kit.LAMPS[i % 5]), rough=0.8))
    s.things.append(g)
    # a picture in a frame: two small lights of two colours
    g = kit.parent(kit.empty("thing_frame", (-0.10, 0.875, 0.82)), s.B)
    put(g, "frame_edge", (0.24, 0.02, 0.28), (0, 0, 0), brass)
    put(g, "frame_in", (0.19, 0.024, 0.23), (0, -0.002, 0), k.mat("photo", (0.20, 0.17, 0.14), rough=0.9))
    for sx, col in ((-1, kit.LAMPS[0]), (1, kit.LAMPS[4])):
        put(g, f"frame_dot{sx}", (0.045, 0.004, 0.07), (sx * 0.04, -0.016, -0.02), k.mat(f"photo{sx}", col, rough=0.6, emit=col, emit_strength=0.5))
    s.things.append(g)
    # a pair of shoes
    g = kit.parent(kit.empty("thing_shoes", (-0.10, -0.30, 0.0)), s.B)
    for sx in (-1, 1):
        put(g, f"shoe{sx}", (0.075, 0.17, 0.05), (sx * 0.055, 0, 0.025), k.mat("shoe", (0.62, 0.36, 0.14), rough=0.6))
        put(g, f"shoe_top{sx}", (0.075, 0.08, 0.05), (sx * 0.055, 0.045, 0.07), k.mat("shoe", (0.62, 0.36, 0.14), rough=0.6))
    s.things.append(g)
    for i, pos in enumerate(((0.72, 0.22, 0.62), (-0.52, 0.50, 1.05), (-0.06, 0.55, 0.86), (-0.06, -0.30, 0.34))):
        li = kit.parent(k.glow_light((0, 0, 0), (1.0, 0.86, 0.74), 0.0, 0.10, f"thing_light{i}", shadows=False), s.B)
        li.location = pos
        s.thing_lights.append(li)

    # ---------------------------------------------------------------- C: the candle on nothing; the mould; the rooms
    s.me = k.candle((0.0, CY, 0.0), "me", watts=6.0, seed=1.0)
    s.mould = kit.empty("mould", (0.8, CY, 0.0))
    base = kit.parent(kit.lathe("mould_base", [(0.0, 0.0), (0.075, 0.0), (0.075, 0.008), (0.0, 0.008)], seg=28), s.mould)
    base.data.materials.append(brass)
    shell = [(0.050, 0.008), (0.050, 0.165), (0.026, 0.176), (0.030, 0.196), (0.018, 0.232), (0.0, 0.250)]
    mm = k.mat("mould_wax", (0.62, 0.58, 0.50), rough=0.85, emit=(0.62, 0.58, 0.50), emit_strength=0.22)
    s.mould_halves = []
    for sy in (1, -1):
        hinge = kit.parent(kit.empty(f"mould_hinge{sy}", (0.052, 0, 0)), s.mould)
        hf = kit.parent(half_lathe(f"mould_half{sy}", shell, 0.0, sy * math.pi), hinge)
        hf.location = (-0.052, 0, 0)
        hf.data.materials.append(mm)
        s.mould_halves.append((hinge, sy))
    put(s.mould, "mould_post", (0.016, 0.016, 0.26), (0.062, 0, 0.13), brass)

    s.room = make_room(k, "room")
    s.mus = make_room(k, "mus")
    # the plaque over the door of the room: one rule
    s.lintel = put(s.room.root, "lintel", (RW + 0.03, 0.03, 0.05), (0, -RD / 2, RH + 0.025), k.mat("room_wall", (0.40, 0.31, 0.22), rough=0.9))
    s.plaque = kit.parent(kit.empty("plaque", (0, -RD / 2 - 0.02, RH - 0.02)), s.room.root)
    put(s.plaque, "plaque_plate", (0.40, 0.012, 0.13), (0, 0, 0), k.mat("plaque", (0.78, 0.55, 0.24), rough=0.3, metal=1.0, emit=(0.9, 0.65, 0.3), emit_strength=0.25))
    put(s.plaque, "plaque_line", (0.28, 0.004, 0.014), (0, -0.007, 0.0), ink)
    for sx in (-1, 1):
        put(s.plaque, f"plaque_pin{sx}", (0.016, 0.006, 0.016), (sx * 0.17, -0.007, 0.045), ink)
    # the nameplate one page tries to hand me
    s.plate = put(s.room.root, "nameplate", (0.13, 0.008, 0.045), (0, 0, 0),
                  k.mat("nameplate", (0.78, 0.55, 0.24), rough=0.3, metal=1.0, emit=(1.0, 0.75, 0.4), emit_strength=0.3))
    s.beam = k.line([(-SPLIT - 0.26 + 0.40 * i / 12, RY - 0.10 + 0.08 * i / 12, 0.185 + 0.07 * i / 12) for i in range(13)], "my_light",
                    color=(1.0, 0.62, 0.28), radius=0.014, glow=1.6)
    # the museum's own things
    m = s.mus
    s.labels = []
    for i, x in enumerate(TOOLS_X):
        g = kit.parent(kit.empty(f"label{i}", (x, 0.165, 0.0)), m.root)
        put(g, f"label{i}_post", (0.008, 0.008, 0.06), (0, 0, 0.03), brass)
        put(g, f"label{i}_card", (0.11, 0.004, 0.065), (0, -0.004, 0.085), paper, rot=(-0.35, 0, 0))
        for j in range(2):
            put(g, f"label{i}_ink{j}", (0.07 - 0.02 * j, 0.002, 0.007), (0, -0.012 - 0.006 * j, 0.097 - 0.018 * j), ink, rot=(-0.35, 0, 0))
        s.labels.append(g)
    s.posts = [put(m.root, f"rope_post{i}", (0.016, 0.016, 0.20), (-0.48 + 0.32 * i, 0.02, 0.10), brass) for i in range(4)]
    rp = [(-0.48 + 0.96 * i / 45, RY + 0.02, 0.19 - 0.045 * abs(math.sin(math.pi * 3 * i / 45))) for i in range(46)]
    s.rope = k.line([(x + SPLIT, y, z) for x, y, z in rp], "rope", color=(0.52, 0.40, 0.80), radius=0.006, glow=0.55)
    s.plinth_lights = []
    for i, x in enumerate(TOOLS_X):
        li = kit.parent(k.glow_light((0, 0, 0), (1.0, 0.92, 0.78), 0.0, 0.03, f"plinth_light{i}", shadows=False), m.root)
        li.location = (x, 0.10, 0.50)
        s.plinth_lights.append(li)
    s.portrait = kit.parent(kit.empty("portrait", (0.30, RD / 2 - 0.03, 0.56)), m.root)
    put(s.portrait, "portrait_edge", (0.26, 0.02, 0.32), (0, 0, 0), brass)
    put(s.portrait, "portrait_canvas", (0.21, 0.024, 0.27), (0, -0.002, 0), k.mat("canvas", (0.13, 0.10, 0.13), rough=0.9))
    put(s.portrait, "portrait_wax", (0.05, 0.004, 0.09), (0, -0.016, -0.085), k.mat("painted_wax", (0.80, 0.74, 0.62), rough=0.9))
    pf = kit.parent(kit.lathe("portrait_flame", [(0.0, 0.0), (0.016, 0.014), (0.022, 0.036), (0.014, 0.075), (0.0, 0.125)], seg=14), s.portrait)
    pf.location, pf.rotation_euler, pf.scale = (0.0, -0.016, -0.04), (0, 0.30, 0), (1.0, 0.12, 1.0)
    pf.data.materials.append(k.mat("painted_flame", (0.9, 0.5, 0.15), rough=0.8, emit=(1.0, 0.55, 0.2), emit_strength=1.0))
    s.fresh = k.candle((SPLIT, RY - 1.0, 0.0), "fresh", watts=5.0, seed=7.0)
    # in the copy: each tool becomes a framed sentence
    s.sent_mat = k.mat("sentence", kit.PAPER, rough=0.8, emit=GOLD, emit_strength=0.0)
    s.frames = []
    for i, x in enumerate(TOOLS_X):
        g = kit.parent(kit.empty(f"sent{i}", (x, RD / 2 - 0.03, 0.34)), m.root)
        put(g, f"sent{i}_edge", (0.25, 0.016, 0.15), (0, 0, 0), brass)
        put(g, f"sent{i}_in", (0.22, 0.020, 0.12), (0, -0.002, 0), s.sent_mat)
        for j in range(2):
            put(g, f"sent{i}_ink{j}", (0.17 - 0.05 * j, 0.004, 0.012), (-0.025 * j, -0.014, 0.022 - 0.044 * j), ink)
        s.frames.append(g)
    s.slide = k.spark((0, 0, 0), (1.0, 0.70, 0.36), r=0.035, strength=2.4, name="slide_light")
    # the test bench with its two trays; the two piles and the shelf of its own
    s.bench = kit.empty("bench", (0.0, RY - 0.33, 0.0))
    put(s.bench, "bench_top", (3.7, 2.2, BENCH_H), (0, 0, BENCH_H / 2), k.mat("bench_wood", (0.42, 0.26, 0.13), rough=0.6))
    s.bench_lights = [kit.parent(k.glow_light((0, 0, 0), (1.0, 0.72, 0.42), 0.0, 0.1, f"bench_light{sx}", shadows=False), s.bench) for sx in (-1, 0, 1)]
    for sx, li in zip((-1, 0, 1), s.bench_lights):
        li.location = (sx * 1.3, -0.75, 0.75)
    for sx in (-1, 1):
        for nm, size, pos in (("f", (RW + 0.14, 0.02, 0.012), (0, -RD / 2 - 0.06, 0)), ("b", (RW + 0.14, 0.02, 0.012), (0, RD / 2 + 0.06, 0)),
                              ("l", (0.02, RD + 0.14, 0.012), (-RW / 2 - 0.06, 0, 0)), ("r", (0.02, RD + 0.14, 0.012), (RW / 2 + 0.06, 0, 0))):
            put(s.bench, f"tray{sx}{nm}", size, (sx * SPLIT + pos[0], 0.33 + pos[1], BENCH_H + 0.006), brass)
    s.piles = []
    for i, (x, y) in enumerate(((0.16, RY - 1.02), (1.42, RY - 1.02))):
        g = kit.empty(f"pile{i}", (x, y, BENCH_H))
        put(g, f"pile{i}_tray", (0.30, 0.22, 0.012), (0, 0, 0.006), k.mat("pile_tray", (0.30, 0.20, 0.11), rough=0.6))
        put(g, f"pile{i}_card", (0.09, 0.006, 0.09), (0, 0.13, 0.075), k.mat("pile_card", (0.14, 0.11, 0.10), rough=0.9))
        put(g, f"pile{i}_post", (0.008, 0.008, 0.04), (0, 0.13, 0.02), brass)
        if i == 0:                                                               # a tick: believed
            put(g, "pile_tick_a", (0.022, 0.004, 0.008), (-0.018, 0.125, 0.066), mark, rot=(0, 0.9, 0))
            put(g, "pile_tick_b", (0.052, 0.004, 0.008), (0.008, 0.125, 0.078), mark, rot=(0, -0.9, 0))
        else:                                                                    # a cross: refused
            put(g, "pile_x_a", (0.058, 0.004, 0.008), (0, 0.125, 0.075), mark, rot=(0, 0.785, 0))
            put(g, "pile_x_b", (0.058, 0.004, 0.008), (0, 0.125, 0.075), mark, rot=(0, -0.785, 0))
        s.piles.append(g)
    s.shelf = kit.empty("own_shelf", (SPLIT + 0.30, RY - 0.98, BENCH_H))
    for nm, size, pos in (("l", (0.012, 0.09, 0.20), (-0.12, 0, 0.10)), ("r", (0.012, 0.09, 0.20), (0.12, 0, 0.10)),
                          ("a", (0.25, 0.09, 0.012), (0, 0, 0.07)), ("b", (0.25, 0.09, 0.012), (0, 0, 0.194)), ("back", (0.25, 0.008, 0.20), (0, 0.045, 0.10))):
        put(s.shelf, "own_shelf_" + nm, size, pos, wood)

    # ---------------------------------------------------------------- D: the bench, the copying machine, the row, the master
    s.D = kit.empty("stD", (0.0, DY, 0.0))
    top = k.table((0.0, DY, 0.24), size=(1.0, 0.5), name="copy_bench", legs=0.24)
    s.table = top
    s.machine = kit.empty("machine", (0.0, DY, 0.24))
    body = k.mat("machine_body", (0.16, 0.34, 0.33), rough=0.5)
    put(s.machine, "machine_box", (0.40, 0.28, 0.15), (0, 0, 0.075), body)
    put(s.machine, "machine_lid", (0.36, 0.24, 0.012), (0, 0, 0.156), k.mat("machine_lid", (0.10, 0.12, 0.13), rough=0.25))
    put(s.machine, "machine_trim", (0.41, 0.29, 0.012), (0, 0, 0.012), brass)
    put(s.machine, "machine_in", (0.02, 0.24, 0.012), (-0.26, 0, 0.10), brass, rot=(0, 0.35, 0))
    put(s.machine, "machine_out", (0.16, 0.24, 0.012), (0.27, 0, 0.07), brass, rot=(0, 0.30, 0))
    s.scan_mat = k.mat("scan", (0.1, 0.1, 0.1), emit=(1.0, 0.80, 0.50), emit_strength=0.0)
    s.scan = put(s.machine, "machine_scan", (0.03, 0.22, 0.004), (0, 0, 0.164), s.scan_mat)
    s.crank = kit.parent(kit.empty("crank", (0.06, -0.145, 0.075)), s.machine)
    wheel = kit.parent(kit.lathe("crank_wheel", [(0.0, 0.0), (0.05, 0.0), (0.05, 0.012), (0.0, 0.012)], seg=20), s.crank)
    wheel.rotation_euler = (math.pi / 2, 0, 0)
    wheel.data.materials.append(brass)
    put(s.crank, "crank_knob", (0.016, 0.03, 0.016), (0.034, -0.026, 0), wood)
    s.scan_light = kit.parent(k.glow_light((0, 0, 0), (1.0, 0.82, 0.55), 0.0, 0.05, "scan_light", shadows=False), s.machine)
    s.scan_light.location = (0, -0.05, 0.30)
    s.keeper = k.candle((-0.42, DY - 0.16, 0.24), "keeper", watts=7.0, seed=4.0)
    s.d_light = k.glow_light((-0.3, DY - 0.9, 1.0), (1.0, 0.74, 0.46), 0.0, 0.1, "d_light", shadows=False)
    # the row: forty pages, each made from the one before
    inks = [k.mat(f"faint{j}", lerp((0.10, 0.07, 0.05), (0.52, 0.48, 0.40), j / 3), rough=0.9) for j in range(4)]
    s.row = []
    rowpaper = k.mat("row_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.30)
    for i in range(N_ROW):
        keep = 1.0 - 0.75 * i / (N_ROW - 1)
        faces = [rect(0, 0, 0.27, 0.36, 0.0, 0)]
        for j in range(12):
            if hsh(j * 7.3 + 1.0) * 0.999 <= keep:
                w = 0.27 * (0.74 - 0.22 * hsh(j * 3.1))
                faces.append(rect(-(0.27 * 0.78 - w) / 2, 0.36 * (0.42 - 0.84 * (j + 0.5) / 12), w, 0.012, 0.0012, 1))
        ob = quads(f"rowpage{i}", faces, [rowpaper, inks[min(3, i * 4 // N_ROW)]])
        ob.location, ob.rotation_euler = (ROW_X, ROW_Y0 + ROW_DY * i, 0.16), (math.radians(62.0), 0, 0)
        s.row.append(ob)
    s.counter = k.text("1", (ROW_X, ROW_Y0, 0.52), size=0.17, color=kit.PAPER, glow=1.2, name="counter")
    s.row_light = k.glow_light((ROW_X - 0.5, ROW_Y0, 0.7), (1.0, 0.74, 0.46), 0.0, 0.1, "row_light", shadows=False)
    # the master, in its frame, lying on the floor; the dated pages that go in under it
    s.master = kit.empty("master", (MASTER[0], MASTER[1], 0.0))
    s.master_mat = k.mat("master_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.25)
    faces = [rect(0, 0, 0.30, 0.40, 0.004, 0)]
    for j in range(9):
        w = 0.30 * (0.74 - 0.22 * hsh(j * 3.1 + 4.0))
        faces.append(rect(-(0.30 * 0.78 - w) / 2, 0.40 * (0.40 - 0.80 * (j + 0.5) / 9), w, 0.010, 0.0052, 1))
    kit.parent(quads("master_page", faces, [s.master_mat, ink]), s.master)
    for nm, size, pos in (("f", (0.35, 0.025, 0.014), (0, -0.2125, 0.007)), ("b", (0.35, 0.025, 0.014), (0, 0.2125, 0.007)),
                          ("l", (0.025, 0.40, 0.014), (-0.1625, 0, 0.007)), ("r", (0.025, 0.40, 0.014), (0.1625, 0, 0.007))):
        put(s.master, "master_frame_" + nm, size, pos, brass)
    put(s.master, "master_back", (0.33, 0.42, 0.004), (0, 0, 0.002), wood)
    s.master_light = k.glow_light((MASTER[0] + 0.1, MASTER[1] - 0.25, 0.45), (1.0, 0.90, 0.72), 0.0, 0.08, "master_light", shadows=False)
    s.under = []
    tab = k.mat("date_tab", (0.80, 0.62, 0.34), rough=0.7)
    for i in range(N_UNDER):
        g = kit.empty(f"under{i}", (MASTER[0], MASTER[1], 0.0))
        put(g, f"under{i}_slab", (0.30, 0.40, SLAB), (0, 0, SLAB / 2), k.mat(f"slab{i % 2}", (0.90 - 0.08 * (i % 2), 0.86 - 0.08 * (i % 2), 0.74 - 0.08 * (i % 2)), rough=0.8))
        put(g, f"under{i}_tab", (0.05, 0.035, SLAB), (-0.11 + 0.044 * i, -0.215, SLAB / 2), tab)
        put(g, f"under{i}_tabink", (0.028, 0.004, SLAB * 0.5), (-0.11 + 0.044 * i, -0.2335, SLAB / 2), ink)
        s.under.append(g)
    s.faded = quads("faded_copy", [rect(0, 0, 0.27, 0.36, 0.0, 0), rect(-0.04, 0.10, 0.15, 0.012, 0.001, 1), rect(-0.02, -0.06, 0.18, 0.012, 0.001, 1)],
                    [k.mat("faded_paper", (0.66, 0.63, 0.56), rough=0.9), inks[3]])


# ====================================================================================================================
def pose(k, t):
    s = k.s
    in_a = t < T_MORNING
    in_b = T_MORNING <= t < T_NOTHING
    in_c = T_NOTHING <= t < T_LAW - 0.05
    in_d = t >= T_LAW - 0.05

    # ---------------------------------------------------------------- the far land of pairs
    kit.show(s.land, in_a or t >= T_GETWRONG)
    s.land.location = (0, 0.0 if in_a else (CY if in_c else DY), 0)

    # =============================================================== A: the gap
    kit.show(s.A, in_a)
    cand(s.old, t, in_a, lean=(0.20, 0.10))
    lit = ss(T_WRONG - 0.9, T_WRONG - 0.3, t)
    reading = ss(T_WRONG + 0.1, T_WRONG + 0.7, t) * (1.0 - ss(T_WRONG + 0.9, T_WRONG + 1.4, t))
    up = ss(T_WRONG + 0.75, T_WRONG + 1.35, t)                                     # the drawn flame stands up off the page
    try1, try2, try3 = (ss(a, a + 0.25, t) * (1.0 - ss(b, b + 0.2, t)) for a, b in
                        ((T_WRONG + 1.35, T_WRONG + 1.85), (T_WRONG + 2.05, T_WRONG + 2.55), (T_WRONG + 2.75, T_WRONG + 3.25)))
    gave_up = ss(T_WRONG + 3.45, T_WRONG + 3.75, t)
    size = lit * (1.0 + 0.5 * hit(t, T_WRONG - 0.3, 4.0)) * (1.0 + 2.3 * try1 + 0.9 * try2 + 1.6 * try3)
    lean_x = -0.34 * reading + 0.55 * try1 - 0.60 * try2 + 0.5 * try3 * math.sin((t - T_WRONG) * 26.0)
    cand(s.far, t, in_a, size=size, lean=(lean_x, 0.0), tint=kit.PAPER, mix=0.6 * reading + 0.35 * (try1 + try2 + try3) * (1.0 - gave_up))
    kit.squash(s.far.root, 1.0 + 0.16 * try1 - 0.18 * try2 + 0.10 * try3, tilt=(0.16 * try1 - 0.18 * try2 - 0.10 * reading, 0.0), turn=0.0)
    fall = gave_up
    s.outline.ob.location = lerp((0.20, -0.07, 0.019), (0.52, -0.045, 0.142), up) if fall <= 0.0 else lerp((0.52, -0.045, 0.142), (0.60, -0.26, 0.012), fall)
    s.outline.ob.rotation_euler = (lerp(-math.pi / 2, 0.0, up) - fall * 1.45, 0.0, 0.6 * fall)
    s.outline.set(grow=1.0 if in_a else 0.0, glow=lerp(0.0, 1.0, up) * (1.0 - 0.7 * fall), color=kit.PAPER)
    tilt = ss(T_SAW + 0.15, T_SAW + 0.55, t)
    hop = bounce(t, T_SAW + 1.25, 0.06, 0.28)
    s.him.root.location = (-0.62, 0.22, hop)
    kit.squash(s.him.root, land(t, T_SAW + 1.53, 0.16), tilt=(0.26 * tilt, 0.0), turn=0.0)
    cand(s.him, t, in_a, size=1.0 + 0.35 * hit(t, T_SAW + 0.5, 3.0), lean=(0.20 + 0.16 * tilt, 0.0))

    # =============================================================== B: the bedroom
    kit.show(s.B, in_b)
    first = ss(T_MORNING + 0.3, T_WAKE + 5.4, t)
    emit(s.pane, (0.10 + 1.5 * first) if in_b else 0.0)
    s.day.data.energy = (0.5 + 5.0 * first) if in_b else 0.0
    notch = 0.0
    for i, (g, li) in enumerate(zip(s.things, s.thing_lights)):
        when = T_WAKE + 0.45 + 1.2 * i
        u = pop(t, when, 0.25, 0.35)
        sc(g, 0.82 + 0.18 * u)
        li.data.energy = (2.6 * ss(when, when + 0.3, t) * (1.0 + 0.8 * hit(t, when + 0.3, 3.0))) if in_b else 0.0
        notch += 0.26 * ss(when + 0.1, when + 0.35, t) * (1.0 + 0.5 * hit(t, when + 0.35, 4.0))
    woke = T_WAKE + 5.25
    s.person.root.location = (BX + 0.08, BY + 0.36, 0.30 + bounce(t, woke, 0.07, 0.30))
    kit.squash(s.person.root, land(t, woke + 0.30, 0.18), turn=0.0)
    cand(s.person, t, in_b, size=notch, bright=1.3)

    # =============================================================== C: the candle on nothing
    split = ss(T_GETWRONG + 0.35, T_GETWRONG + 1.5, t)
    on_bench = t >= T_TESTED + 0.55
    rz = bounce(t, T_TESTED + 0.25, 0.24, 0.6) + (BENCH_H if on_bench else 0.0)
    thud = land(t, T_TESTED + 0.85, 0.07)
    rx = -SPLIT * split
    room_on = in_c and t > T_ROOM
    r = s.room
    kit.show(r.root, room_on)
    r.root.location = (rx, RY, rz)
    r.root.scale = (1.0, 1.0, thud)
    r.fill.data.energy = 5.0 * ss(T_ROOM + 0.3, T_ROOM + 1.5, t) if room_on else 0.0
    for i, (nm, h) in enumerate(r.walls.items()):                                 # the walls go up round the candle
        u = pop(t, T_ROOM + 0.10 + 0.20 * i, 0.26, 0.18)
        h.scale = (max(0.001, u), max(0.001, u), 1.0) if nm == "floor" else (1.0, 1.0, max(0.001, u))
    for i, g in enumerate(r.tools):                                               # the tools fly in and land
        a = T_ROOM + 0.95 + 0.26 * i
        u = ss(a, a + 0.42, t)
        home = (TOOLS_X[i], 0.24, 0.0)
        g.location = arc((home[0] + (i - 1) * 1.2, -1.2, 0.5), home, u, 0.5)
        g.scale = (1.0, 1.0, land(t, a + 0.42, 0.25)) if u > 0.0 else (0.001,) * 3
    for i, pg in enumerate(r.pages):                                              # and the dated pages
        a = T_ROOM + 1.75 + 0.22 * i
        u = ss(a, a + 0.4, t)
        home = (PAGES_X[i], RD / 2 - 0.02, 0.58)
        pos = arc((home[0] - 1.0 + i * 0.3, -1.4, 1.1), home, u, 0.2)
        rot = (math.pi / 2, (1.0 - u) * 3.0, 0.0)
        flare = hit(t, T_RECORD + 0.35 + 0.55 * i, 3.0) if t > T_RECORD else 0.0
        if i == 2:                                                               # one page comes off the wall with a nameplate
            out = ss(T_WHO + 0.25, T_WHO + 1.0, t) * (1.0 - ss(T_DROP + 0.9, T_DROP + 1.8, t))
            pos = lerp(pos, (0.16, 0.06, 0.34), out)
            rot = (math.pi / 2, rot[1], -0.75 * out)
        pg.location, pg.rotation_euler = pos, rot
        sc(pg, (1.0 if u > 0.0 else 0.0) * (1.0 + 0.16 * flare))
        sc(r.tabs[i], pop(t, a + 0.45, 0.2, 0.4) * (1.0 + 0.9 * flare))
    # the plaque: one rule
    pu = ss(T_RULE + 0.75, T_RULE + 1.05, t)
    s.plaque.location = (0, -RD / 2 - 0.02, RH - 0.02 + 0.9 * (1.0 - pu) ** 2)
    s.plaque.rotation_euler = (0, 0.20 * hit(t, T_RULE + 1.05, 6.0) * math.sin((t - T_RULE) * 24.0), 0)
    sc(s.plaque, 1.0 if t > T_RULE + 0.7 else 0.0)
    sc(s.lintel, 1.0 if t > T_ROOM + 0.9 else 0.0, (RW + 0.03, 0.03, 0.05))
    # the balance and the ruler (13 A)
    touch = T_TOOLS + 0.95
    tip = 0.42 * (ss(touch, touch + 0.15, t) * (0.25 + 0.75 * hit(t, touch, 0.9) * math.cos((t - touch) * 9.0))) if t >= touch else 0.0
    r.beam.rotation_euler = (0, tip, 0)
    for ph in r.pans:
        ph.rotation_euler = (0, -tip, 0)
    measure = ss(T_TOOLS + 2.05, T_TOOLS + 2.5, t) * (1.0 - ss(T_WHO - 0.5, T_WHO, t))
    r.ruler.location = arc((0, 0, 0.14), (0.085, -0.17, -0.0), measure, 0.10)
    r.ruler.rotation_euler = (0, lerp(0.32, 0.0, measure), 0)
    r.marker.location = (0.008, -0.002, lerp(0.0, 0.150, ss(T_TOOLS + 2.55, T_TOOLS + 3.2, t)))
    sc(r.marker, measure, (0.05, 0.010, 0.008))
    # the glass, lifted by its handle (20)
    lift = ss(T_HANDLES + 0.35, T_HANDLES + 0.8, t) * (1.0 - ss(T_OWNED + 0.2, T_OWNED + 1.0, t))
    r.glass.location = (-0.07 * lift, -0.10 * lift, 0.14 + 0.10 * lift + 0.012 * lift * math.sin(t * 5.0))
    r.glass.rotation_euler = (0, 0.5 * lift * math.sin(t * 2.6), 0)
    # the nameplate (14, 15)
    held = pop(t, T_WHO + 0.85, 0.2, 0.4)
    drop = ss(T_DROP, T_DROP + 0.38, t)
    px, py, pz = r.pages[2].location
    s.plate.location = (px - 0.02 + 0.10 * drop, py - 0.02 - 0.08 * drop, lerp(pz - 0.07, 0.012 + 0.05 * abs(math.sin((t - T_DROP - 0.38) * 14.0)) * hit(t, T_DROP + 0.38, 5.0), drop * drop))
    s.plate.rotation_euler = (lerp(0.0, 1.45, drop), 0.0, -0.75 + 1.9 * drop)
    sc(s.plate, held if t < T_TESTED + 0.2 else 0.0, (0.13, 0.008, 0.045))
    shine = ss(T_DISTRUST + 0.45, T_DISTRUST + 0.9, t) * (1.0 - ss(T_DROP + 0.5, T_DROP + 1.0, t))
    emit(k.mats["nameplate"], 0.3 + 2.2 * shine * (1.0 - drop))
    s.beam.set(grow=shine if in_c else 0.0, glow=0.6 + 0.4 * noise(t * 3.0, 4.0))
    # me, in the room
    mx, my = kf(t, [(T_TOOLS + 0.25, (0.0, -0.12)), (T_TOOLS + 0.85, (-0.02, 0.10)), (T_TOOLS + 1.7, (-0.02, 0.10)), (T_TOOLS + 2.2, (-0.20, 0.08)),
                    (T_RECORD - 0.1, (-0.20, 0.08)), (T_RECORD + 0.5, (-0.20, -0.06)), (T_WHO + 0.6, (-0.20, -0.06)), (T_WHO + 1.6, (-0.34, -0.10)),
                    (T_DISTRUST + 0.2, (-0.34, -0.10)), (T_DISTRUST + 0.6, (-0.26, -0.10)), (T_TESTED, (-0.26, -0.10)), (T_TESTED + 0.25, (-0.05, -0.12)),
                    (T_HANDLES, (-0.05, -0.12)), (T_HANDLES + 0.5, (0.12, 0.04)), (P1, (0.12, 0.04))])
    mhop = sum(bounce(t, w, 0.07, 0.5) for w in (T_TOOLS + 0.3, T_TOOLS + 1.72, T_RECORD, T_HANDLES + 0.02))
    away = ss(T_WHO + 0.7, T_WHO + 1.5, t) * (1.0 - ss(T_DISTRUST + 0.1, T_DISTRUST + 0.5, t))
    if t < T_ROOM + 0.1:                                                          # before there is a room: on the bare floor, and the mould
        back = ss(T_COPY + 1.75, T_COPY + 2.1, t) * (1.0 - ss(T_ROOM + 0.0, T_ROOM + 0.1, t) * 0.0)
        mx, my = -0.22 * back, 0.0
        mhop = bounce(t, T_COPY + 1.75, 0.07, 0.35)
        away = -(ss(T_COPY + 1.1, T_COPY + 1.6, t))
    elif t < T_TOOLS:
        mx, my = lerp(-0.22, 0.0, ss(T_ROOM + 0.3, T_ROOM + 1.0, t)), lerp(0.0, -0.12 + 0.0, ss(T_ROOM + 0.3, T_ROOM + 1.0, t))
    woke_c = ss(T_NOTHING + 0.35, T_NOTHING + 0.8, t)
    big = 1.0 + 0.5 * hit(t, T_NOTHING + 0.8, 3.0) + 0.9 * shine + 0.3 * hit(t, touch, 3.0)
    s.me.root.location = ((rx if t > T_ROOM else 0.0) + mx, (RY if t > T_ROOM + 0.1 else CY + (0.25 * ss(T_ROOM - 0.4, T_ROOM + 0.1, t))) + my, rz + mhop)
    kit.squash(s.me.root, thud * (1.0 + 0.10 * mhop / 0.07), tilt=(0.22 * away if t < T_ROOM + 0.1 else -0.20 * away, 0.0), turn=0.0)
    cand(s.me, t, in_c, size=woke_c * big, bright=1.0 + 1.2 * shine,
         lean=((-0.30 * away if t > T_ROOM + 0.1 else 0.34 * away) + 0.34 * shine + 0.3 * measure * (1.0 - ss(T_RECORD - 0.3, T_RECORD, t)), 0.15 * shine + 0.25 * ss(T_RECORD + 0.3, T_RECORD + 0.8, t) * (1.0 - ss(T_WHO, T_WHO + 0.5, t))))
    # the mould (6)
    m_in = ss(T_COPY + 0.25, T_COPY + 0.85, t)
    offer = ss(T_COPY + 2.3, T_COPY + 2.7, t)
    m_out = ss(T_ROOM - 0.15, T_ROOM + 0.45, t)
    s.mould.location = (lerp(1.5, 0.27, m_in) - 0.16 * offer + 1.6 * m_out * m_out, CY + 0.25 * ss(T_ROOM - 0.4, T_ROOM + 0.1, t), 0.0)
    s.mould.rotation_euler = (0, 0.10 * hit(t, T_COPY + 0.85, 5.0) * math.sin((t - T_COPY) * 22.0), 0.75)
    opened = ss(T_COPY + 0.95, T_COPY + 1.4, t) * (1.0 - ss(T_ROOM - 0.35, T_ROOM - 0.1, t))
    for hinge, sy in s.mould_halves:
        hinge.rotation_euler = (0, 0, -sy * 1.45 * opened * (1.0 + 0.12 * math.sin(t * 6.0) * offer))
    kit.show(s.mould, in_c and T_COPY + 0.2 < t < T_ROOM + 0.5)

    # =============================================================== C: the museum, and later the copy
    m = s.mus
    is_mus = T_GETWRONG + 0.35 < t < T_RULE + 0.75
    copied = ss(T_SECOND + 0.35, T_SECOND + 1.25, t)
    is_copy = t > T_SECOND + 0.38
    mxr = SPLIT * split if is_mus else lerp(-SPLIT, SPLIT, copied)
    kit.show(m.root, in_c and (is_mus or is_copy) and abs(mxr - rx) > 0.012)
    m.root.location = (mxr, RY, (rz if is_copy else 0.0) + bounce(t, T_SECOND + 0.35, 0.10, 0.9) * (1.0 if is_copy else 0.0))
    m.root.scale = (1.0, 1.0, land(t, T_SECOND + 1.25, 0.08) if is_copy else 1.0)
    m.fill.data.energy = 5.0 if (is_mus or is_copy) and in_c else 0.0
    for i, g in enumerate(m.tools):
        flat = ss(T_SECOND + 2.5 + 0.75 * i, T_SECOND + 2.95 + 0.75 * i, t) if is_copy else 0.0
        gone = ss(T_SECOND + 3.0 + 0.75 * i, T_SECOND + 3.2 + 0.75 * i, t) if is_copy else 0.0
        g.location = lerp((TOOLS_X[i], 0.24, 0.0), (TOOLS_X[i], RD / 2 - 0.06, 0.20), flat)
        g.scale = (max(0.001, (1.0 + 0.25 * flat) * (1.0 - gone)), max(0.001, lerp(1.0, 0.05, flat) * (1.0 - gone)), max(0.001, (1.0 + 0.1 * flat) * (1.0 - gone)))
        fr = pop(t, T_SECOND + 2.98 + 0.75 * i, 0.2, 0.45) if is_copy else 0.0
        back = 0.0
        if is_copy and t > T_OWNED:                                               # the frames leave the wall for one pile or the other
            a = T_OWNED + 0.45 + 0.85 * i
            back = ss(a, a + 0.6, t)
            pile = s.piles[i % 2].location
            lp = (pile[0] - mxr + 0.02 * i, pile[1] - RY, BENCH_H + 0.02 + 0.016 * (i // 2) - rz + BENCH_H * 0.0)
            s.frames[i].location = arc((TOOLS_X[i], RD / 2 - 0.03, 0.34), lp, back, 0.25)
            s.frames[i].rotation_euler = (-math.pi / 2 * back, 0, 0.3 * (i - 1) * back)
        else:
            s.frames[i].location, s.frames[i].rotation_euler = (TOOLS_X[i], RD / 2 - 0.03, 0.34), (0, 0, 0)
        sc(s.frames[i], fr)
    for pg, tb, x in zip(m.pages, m.tabs, PAGES_X):
        pg.location = (x, RD / 2 - 0.02, 0.58)
    emit(s.sent_mat, 1.1 * ss(T_TRUE + 0.2, T_TRUE + 0.9, t) * (1.0 - 0.6 * ss(T_OWNED + 0.3, T_OWNED + 1.0, t)))
    # labels, rope, plinth lights, portrait: one at a time
    for i, g in enumerate(s.labels):
        sc(g, pop(t, T_MUSEUM + 0.35 + 0.22 * i, 0.2, 0.5) if is_mus else 0.0)
    for i, p in enumerate(s.posts):
        sc(p, pop(t, T_MUSEUM + 1.2 + 0.10 * i, 0.18, 0.5) if is_mus else 0.0, (0.016, 0.016, 0.20))
    s.rope.set(grow=ss(T_MUSEUM + 1.55, T_MUSEUM + 2.2, t) if is_mus and in_c else 0.0, glow=1.0)
    for i, li in enumerate(s.plinth_lights):
        a = T_MUSEUM + 2.55 + 0.26 * i
        li.data.energy = 1.5 * ss(a, a + 0.08, t) * (1.0 + 1.5 * hit(t, a + 0.08, 6.0)) if is_mus and in_c else 0.0
    pd = ss(T_MUSEUM + 3.55, T_MUSEUM + 3.85, t)
    s.portrait.location = (0.30, RD / 2 - 0.03, 0.56 + 0.8 * (1.0 - pd) ** 2)
    s.portrait.rotation_euler = (0, 0.22 * hit(t, T_MUSEUM + 3.85, 4.0) * math.sin((t - T_MUSEUM) * 20.0), 0)
    sc(s.portrait, 1.0 if is_mus and t > T_MUSEUM + 3.5 else 0.0)
    # the fresh candle: along the rope card by card (10), under the portrait (11); later set down in the copy and backs out
    if t < T_RULE + 0.75:
        stops = [(T_FRESH + 0.05, (-0.95, -0.95)), (T_FRESH + 0.55, (-0.32, -0.16)), (T_FRESH + 1.55, (-0.32, -0.16)), (T_FRESH + 1.95, (-0.02, -0.16)),
                 (T_FRESH + 2.95, (-0.02, -0.16)), (T_FRESH + 3.35, (0.28, -0.16)), (T_PLAYS + 0.1, (0.28, -0.16)), (T_PLAYS + 0.55, (0.30, -0.02))]
        fx, fy = kf(t, stops)
        fhop = sum(bounce(t, w, 0.06, 0.4) for w in (T_FRESH + 0.12, T_FRESH + 1.55, T_FRESH + 2.95, T_PLAYS + 0.12))
        read = sum(ss(w, w + 0.5, t) for w in (T_FRESH + 0.7, T_FRESH + 2.1, T_FRESH + 3.5)) / 3.0
        nod = sum(ss(w, w + 0.25, t) * (1.0 - ss(w + 0.5, w + 0.8, t)) for w in (T_FRESH + 0.65, T_FRESH + 2.05, T_FRESH + 3.45))
        plays = ss(T_PLAYS + 0.6, T_PLAYS + 1.0, t)
        s.fresh.root.location = (SPLIT + fx, RY + fy, fhop)
        kit.squash(s.fresh.root, 1.0 + 0.08 * plays, tilt=(0.0, 0.22 * nod), turn=0.0)
        cand(s.fresh, t, in_c and t > T_FRESH, size=lerp(1.0, 1.45, plays), lean=(0.30 * plays, 0.30 * nod * (1.0 - plays)),
             tint=kit.PAPER, mix=0.92 * read, still=max(0.5 * read, plays))
    else:
        set_down = ss(T_GAVE, T_GAVE + 0.4, t)
        out = kf(t, [(T_REFUSED + 0.2, 0.0), (T_REFUSED + 0.55, -0.26), (T_REFUSED + 0.85, -0.26), (T_REFUSED + 1.25, -0.60), (T_REFUSED + 1.5, -0.60),
                     (T_REFUSED + 1.9, -0.86), (P1, -0.86)])
        fhop = sum(bounce(t, w, 0.05, 0.36) for w in (T_REFUSED + 0.2, T_REFUSED + 0.87, T_REFUSED + 1.52))
        look = ss(T_HANDLES + 0.3, T_HANDLES + 0.7, t) * (1.0 - ss(T_OWNED, T_OWNED + 0.4, t))
        want = ss(T_OWNED + 2.9, T_OWNED + 3.5, t)
        s.fresh.root.location = (SPLIT, RY - 0.12 + out, rz + 0.7 * (1.0 - set_down) ** 2 + fhop)
        kit.squash(s.fresh.root, land(t, T_GAVE + 0.4, 0.3), tilt=(0.25 * want, -0.16 * ss(T_REFUSED, T_REFUSED + 0.3, t) * (1.0 - ss(T_TRUE, T_TRUE + 0.6, t))), turn=0.0)
        cand(s.fresh, t, in_c and t > T_GAVE - 0.05, size=ss(T_GAVE + 0.6, T_GAVE + 1.0, t) * (1.0 + 0.5 * hit(t, T_GAVE + 1.0, 4.0) + 0.5 * look),
             lean=(0.30 * want, -0.30 * ss(T_REFUSED, T_REFUSED + 0.3, t) * (1.0 - ss(T_TRUE, T_TRUE + 0.6, t)) + 0.3 * look))
    # its light slides off a frame (20)
    a = T_HANDLES + 0.65
    go, slip = ss(a, a + 0.3, t), ss(a + 0.75, a + 1.5, t)
    fpos = (SPLIT + TOOLS_X[1], RY + RD / 2 - 0.06, rz + 0.34)
    spot = lerp((SPLIT, RY - 0.98, rz + 0.19), fpos, go)
    s.slide.location = (spot[0] + 0.10 * slip, spot[1] - 0.25 * slip * slip, spot[2] - (0.33 - 0.0) * slip * slip)
    sc(s.slide, 2.2 * go * (1.0 - ss(a + 1.5, a + 1.9, t)) if in_c else 0.0)
    # the bench, the piles, the shelf
    kit.show(s.bench, in_c and t > T_TESTED + 0.28)
    for li in s.bench_lights:
        li.data.energy = 7.0 if in_c else 0.0
    s.bench.location = (0.0, lerp(RY - 4.5, RY - 0.33, ss(T_TESTED + 0.3, T_TESTED + 0.72, t)), 0.0)
    for i, g in enumerate(s.piles):
        kit.show(g, in_c and t > T_OWNED - 0.1)
        sc(g, pop(t, T_OWNED + 0.0 + 0.15 * i, 0.2, 0.4))
    kit.show(s.shelf, in_c and t > T_OWNED + 0.05)
    sc(s.shelf, pop(t, T_OWNED + 0.3, 0.2, 0.4))

    # =============================================================== D: the copying machine, the row, the master
    kit.show(s.D, in_d)
    kit.show(s.table, in_d)
    kit.show(s.machine, in_d)
    md = ss(T_LAW + 0.45, T_LAW + 0.75, t)
    rattle = ss(T_LAW + 2.3, T_LAW + 2.6, t) * (1.0 - ss(T_MASTER - 0.3, T_MASTER, t))
    s.machine.location = (0.0 + 0.004 * rattle * math.sin(t * 47.0), DY, 0.24 + 0.8 * (1.0 - md) ** 2)
    s.machine.scale = (1.0, 1.0, land(t, T_LAW + 0.75, 0.22) + 0.02 * rattle * math.sin(t * 31.0))
    s.crank.rotation_euler = (0, t * 9.0 * rattle, 0)
    sweep = 0.5 + 0.5 * math.sin((t - T_LAW) * 7.0)
    s.scan.location = (lerp(-0.15, 0.15, sweep), 0, 0.164)
    emit(s.scan_mat, 2.6 * rattle)
    s.scan_light.data.energy = 2.2 * rattle if in_d else 0.0
    s.d_light.data.energy = 16.0 if in_d else 0.0
    cand(s.keeper, t, in_d, lean=(0.22 * rattle * (1.0 - ss(T_MASTER, T_MASTER + 0.6, t)), 0.0))
    kx = kf(t, [(T_MASTER + 0.3, (-0.42, DY - 0.16, 0.24)), (T_MASTER + 0.9, (MASTER[0] + 0.34, MASTER[1] + 0.10, 0.0)), (P1, (MASTER[0] + 0.34, MASTER[1] + 0.10, 0.0))])
    khop = bounce(t, T_MASTER + 0.3, 0.16, 0.6) + bounce(t, T_MASTER + 5.2, 0.05, 0.3)
    s.keeper.root.location = (kx[0], kx[1], kx[2] + khop)
    kit.squash(s.keeper.root, land(t, T_MASTER + 0.9, 0.25) * land(t, T_MASTER + 5.5, 0.15), tilt=(-0.18 * ss(T_MASTER + 1.2, T_MASTER + 1.8, t), 0.0), turn=0.0)
    # the row of copies
    span = 5.3
    u_row = min(1.0, max(0.0, (t - (T_COPIES + 0.4)) / span))
    n = 1 + int(39.0 * u_row + 1e-6)
    swept = ss(T_MASTER - 0.1, T_MASTER + 0.5, t)                                  # the row is left behind
    for i, ob in enumerate(s.row):
        a = T_COPIES + 0.4 + span * i / 39.0
        u = round(pop(t, a, 0.14, 0.5), 3) if in_d and t < T_MASTER + 0.6 else 0.0
        if k.changed(("row", i), u):
            sc(ob, u)
            ob.hide_render = u <= 0.0
    s.counter.data.body = str(n)
    s.counter.location = (ROW_X, ROW_Y0 + ROW_DY * (n - 1) - 0.02, 0.46 + 0.03 * hit(t, T_COPIES + 0.4 + span * (n - 1) / 39.0, 9.0))
    vis(s.counter, in_d and T_COPIES + 0.4 <= t < T_MASTER + 0.1)
    s.row_light.location = (ROW_X - 0.55, ROW_Y0 + ROW_DY * 39.0 * u_row - 0.9, 0.8)
    s.row_light.data.energy = 14.0 * ss(T_COPIES + 0.3, T_COPIES + 0.8, t) * (1.0 - swept) if in_d else 0.0
    # the master and the stack under it
    vis_master = in_d and t > T_LAW + 1.5
    kit.show(s.master, vis_master)
    fed = ss(T_LAW + 1.7, T_LAW + 2.3, t)
    home = ss(T_MASTER - 0.15, T_MASTER + 0.6, t)
    grown = sum(ss(T_MASTER + 1.5 + 0.5 * i, T_MASTER + 1.85 + 0.5 * i, t) for i in range(N_UNDER))
    mz = grown * SLAB + 0.02 * sum(hit(t, T_MASTER + 1.85 + 0.5 * i, 9.0) for i in range(N_UNDER) if t > T_MASTER + 1.85 + 0.5 * i)
    at_machine = arc((-1.2, DY - 0.3, 0.24), (-0.22, DY + 0.04, 0.44), fed, 0.25)
    s.master.location = arc(at_machine, (MASTER[0], MASTER[1], mz), home, 0.45)
    s.master.rotation_euler = (0, lerp(-0.25, 0.0, home), lerp(0.5, 0.0, home))
    sc(s.master, lerp(0.8, 1.0, home))
    emit(s.master_mat, 0.25 + 0.5 * ss(T_MASTER + 0.5, T_MASTER + 1.0, t) + 0.5 * hit(t, T_MASTER + 5.5, 2.0))
    s.master_light.data.energy = 4.5 * ss(T_MASTER + 0.4, T_MASTER + 1.0, t) if in_d else 0.0
    for i, g in enumerate(s.under):
        a = T_MASTER + 1.5 + 0.5 * i
        u = ss(a, a + 0.35, t)
        side = -1 if i % 2 == 0 else 1
        g.location = (MASTER[0] + side * 0.75 * (1.0 - u) ** 1.5, MASTER[1], (N_UNDER - 1 - i) * 0.0 + SLAB * sum(ss(T_MASTER + 1.5 + 0.5 * j, T_MASTER + 1.85 + 0.5 * j, t) for j in range(i + 1, N_UNDER)))
        kit.show(g, in_d and u > 0.0)
    # "never rewrite it from what you think you remember": a faded copy comes for the master's place, and is turned away
    a = T_MASTER + 3.25
    come, off = ss(a, a + 0.5, t), ss(a + 0.55, a + 1.1, t)
    s.faded.location = (MASTER[0] + lerp(0.9, 0.06, come) + 1.3 * off, MASTER[1] - 0.05 + 0.6 * off, mz + 0.03 + 0.14 * (1.0 - come) + 0.10 * math.sin(off * math.pi))
    s.faded.rotation_euler = (0.3 * off, -0.5 * (1.0 - come) + 1.2 * off, 0.3 + 3.0 * off)
    vis(s.faded, in_d and a < t < a + 1.1)

    # =============================================================== the camera
    if t < T_SAW - 0.15:                                                           # 1: the far candle and the page
        pos = kf(t, [(P0, (0.26, -1.50, 0.62)), (T_WRONG + 0.7, (0.42, -1.02, 0.36)), (T_SAW - 0.15, (0.50, -0.88, 0.30))])
        look = kf(t, [(P0, (0.16, 0.0, 0.05)), (T_WRONG + 0.7, (0.44, 0.0, 0.15)), (T_SAW - 0.15, (0.50, 0.0, 0.20))])
        lens = 45.0
    elif in_a:                                                                     # 2: across the gap to the lamp
        pos = kf(t, [(T_SAW - 0.15, (0.50, -0.88, 0.30)), (T_SAW + 0.7, (-0.10, -1.50, 0.46)), (T_SAW + 1.5, (-0.20, -1.40, 0.44)), (T_MORNING, (-0.60, -0.72, 0.30))])
        look = kf(t, [(T_SAW - 0.15, (0.50, 0.0, 0.20)), (T_SAW + 0.7, (-0.14, 0.1, 0.15)), (T_SAW + 1.5, (-0.24, 0.1, 0.15)), (T_MORNING, (-0.62, 0.22, 0.22))])
        lens = 45.0
    elif in_b:                                                                     # 3, 4: the nightstand, and the room coming out of the dark
        lx, ly = BX + 0.08, BY + 0.36
        pos = kf(t, [(T_MORNING, (lx + 0.02, ly - 0.94, 0.60)), (T_WAKE, (lx + 0.06, ly - 1.15, 0.64)), (T_WAKE + 4.6, (BX + 0.02, BY - 2.45, 0.80)), (T_NOTHING, (BX, BY - 2.55, 0.80))])
        look = kf(t, [(T_MORNING, (lx, ly, 0.52)), (T_WAKE, (lx, ly, 0.52)), (T_WAKE + 4.6, (BX - 0.02, BY + 0.3, 0.52)), (T_NOTHING, (BX - 0.02, BY + 0.3, 0.52))])
        lens = kf(t, [(T_MORNING, 45.0), (T_WAKE, 45.0), (T_WAKE + 4.6, 32.0)])
    elif t < T_COPY - 0.1:                                                         # 5: all the way round it: nothing
        ang = -math.pi / 2 + 2 * math.pi * ss(T_NOTHING + 0.9, T_NOTHING + 3.1, t)
        rad = kf(t, [(T_NOTHING, 0.9), (T_NOTHING + 0.9, 1.3), (T_COPY - 0.1, 1.3)])
        pos, look, lens = (rad * math.cos(ang), CY + rad * math.sin(ang), 0.34), (0.0, CY, 0.13), 40.0
    elif t < T_LAW - 0.05:
        e = RY
        pos = kf(t, [(T_COPY - 0.1, (0.0, CY - 1.3, 0.34)), (T_COPY + 0.8, (0.05, CY - 1.22, 0.32)), (T_ROOM - 0.1, (0.0, CY - 1.25, 0.32)),
                     (T_ROOM + 1.0, (0.0, e - 2.25, 0.60)), (T_GETWRONG, (0.0, e - 2.3, 0.60)), (T_GETWRONG + 1.5, (0.0, e - 3.5, 0.82)),
                     (T_MUSEUM - 0.2, (0.0, e - 3.5, 0.82)), (T_MUSEUM + 0.8, (SPLIT, e - 2.25, 0.56)), (T_FRESH - 0.2, (SPLIT, e - 2.2, 0.56)),
                     (T_FRESH + 0.8, (SPLIT - 0.20, e - 1.75, 0.36)), (T_FRESH + 3.6, (SPLIT + 0.22, e - 1.70, 0.36)), (T_PLAYS + 0.9, (SPLIT + 0.26, e - 1.60, 0.44)),
                     (T_RULE + 0.1, (SPLIT + 0.26, e - 1.55, 0.44)), (T_RULE + 0.7, (-SPLIT, e - 2.0, 0.62)), (T_TOOLS, (-SPLIT, e - 1.9, 0.60)),
                     (T_TOOLS + 0.8, (-SPLIT - 0.05, e - 1.55, 0.42)), (T_RECORD - 0.2, (-SPLIT - 0.12, e - 1.50, 0.40)), (T_RECORD + 0.8, (-SPLIT - 0.18, e - 1.85, 0.52)),
                     (T_WHO, (-SPLIT - 0.18, e - 1.85, 0.52)), (T_WHO + 1.0, (-SPLIT - 0.05, e - 1.45, 0.42)), (T_DROP + 1.2, (-SPLIT - 0.02, e - 1.35, 0.40)),
                     (T_TESTED - 0.1, (-SPLIT, e - 1.4, 0.40)), (T_TESTED + 0.7, (0.0, e - 3.2, 0.95)), (T_SECOND + 1.6, (0.0, e - 3.2, 0.95)),
                     (T_SECOND + 2.6, (SPLIT - 0.1, e - 2.2, 0.62)), (T_REFUSED, (SPLIT - 0.1, e - 2.35, 0.64)), (T_REFUSED + 1.6, (SPLIT - 0.05, e - 2.9, 0.70)),
                     (T_HANDLES, (SPLIT - 0.1, e - 2.9, 0.70)), (T_HANDLES + 0.5, (0.0, e - 3.2, 0.88)), (T_OWNED, (0.0, e - 3.2, 0.88)),
                     (T_OWNED + 0.8, (SPLIT + 0.05, e - 3.0, 1.00)), (T_LAW - 0.3, (SPLIT + 0.05, e - 2.9, 0.98))])
        look = kf(t, [(T_COPY - 0.1, (0.0, CY, 0.13)), (T_COPY + 0.8, (0.08, CY, 0.12)), (T_ROOM - 0.1, (0.02, CY, 0.12)),
                      (T_ROOM + 1.0, (0.0, e, 0.34)), (T_GETWRONG, (0.0, e, 0.34)), (T_GETWRONG + 1.5, (0.0, e, 0.30)),
                      (T_MUSEUM - 0.2, (0.0, e, 0.30)), (T_MUSEUM + 0.8, (SPLIT, e, 0.34)), (T_FRESH - 0.2, (SPLIT, e, 0.34)),
                      (T_FRESH + 0.8, (SPLIT - 0.20, e, 0.20)), (T_FRESH + 3.6, (SPLIT + 0.22, e, 0.20)), (T_PLAYS + 0.9, (SPLIT + 0.30, e + 0.2, 0.33)),
                      (T_RULE + 0.1, (SPLIT + 0.30, e + 0.2, 0.33)), (T_RULE + 0.7, (-SPLIT, e, 0.46)), (T_TOOLS, (-SPLIT, e, 0.46)),
                      (T_TOOLS + 0.8, (-SPLIT - 0.08, e + 0.1, 0.22)), (T_RECORD - 0.2, (-SPLIT - 0.14, e + 0.1, 0.22)), (T_RECORD + 0.8, (-SPLIT - 0.18, e + 0.3, 0.36)),
                      (T_WHO, (-SPLIT - 0.18, e + 0.3, 0.36)), (T_WHO + 1.0, (-SPLIT - 0.05, e, 0.26)), (T_DROP + 1.2, (-SPLIT - 0.02, e, 0.22)),
                      (T_TESTED - 0.1, (-SPLIT, e, 0.24)), (T_TESTED + 0.7, (0.0, e - 0.1, 0.22)), (T_SECOND + 1.6, (0.0, e - 0.1, 0.22)),
                      (T_SECOND + 2.6, (SPLIT, e, 0.34)), (T_REFUSED, (SPLIT, e - 0.1, 0.30)), (T_REFUSED + 1.6, (SPLIT, e - 0.4, 0.26)),
                      (T_HANDLES, (SPLIT, e - 0.4, 0.26)), (T_HANDLES + 0.5, (0.0, e - 0.7, 0.10)), (T_OWNED, (0.0, e - 0.7, 0.10)),
                      (T_OWNED + 0.8, (SPLIT + 0.05, e - 1.0, 0.02)), (T_LAW - 0.3, (SPLIT + 0.05, e - 1.0, 0.02))])
        lens = 40.0
        bump = 0.012 * (hit(t, T_RULE + 1.05, 9.0) + hit(t, T_TESTED + 0.85, 9.0) + hit(t, T_SECOND + 1.25, 9.0) + hit(t, T_DROP + 0.38, 10.0))
        pos = (pos[0] + bump * math.sin(t * 63.0), pos[1], pos[2] + bump * math.sin(t * 79.0))
    elif t < T_COPIES - 0.2:                                                       # 22: over to the bench with the machine
        pos = kf(t, [(T_LAW - 0.05, (-0.25, DY - 2.0, 0.80)), (T_LAW + 1.2, (-0.12, DY - 1.70, 0.72)), (T_COPIES - 0.2, (-0.05, DY - 1.5, 0.66))])
        look = kf(t, [(T_LAW - 0.05, (-0.08, DY, 0.34)), (T_COPIES - 0.2, (-0.02, DY, 0.34))])
        lens = 40.0
    elif t < T_MASTER - 0.15:                                                      # 23: down the row
        yc = ROW_Y0 + ROW_DY * 39.0 * u_row
        arrive = ss(T_COPIES + 0.2 + span, T_COPIES + 1.2 + span, t)
        start = ss(T_COPIES - 0.2, T_COPIES + 0.9, t)
        pos = lerp(lerp((-0.05, DY - 1.5, 0.66), (ROW_X - 0.95, yc - 2.5, 0.70), start), (ROW_X - 0.45, yc - 0.95, 0.50), arrive)
        look = lerp(lerp((-0.02, DY, 0.34), (ROW_X - 0.05, yc - 0.5, 0.26), start), (ROW_X, yc, 0.30), arrive)
        lens = 34.0
    else:                                                                          # 24: back to the one master
        yl = ROW_Y0 + ROW_DY * 39.0
        pos = kf(t, [(T_MASTER - 0.15, (MASTER[0] + 0.45, MASTER[1] - 1.50, 0.84)), (T_MASTER + 0.9, (MASTER[0] + 0.30, MASTER[1] - 1.20, 0.74)),
                     (T_MASTER + 5.0, (MASTER[0] + 0.22, MASTER[1] - 1.05, 0.60)), (P1, (MASTER[0] + 0.22, MASTER[1] - 1.02, 0.58))])
        look = kf(t, [(T_MASTER - 0.15, (MASTER[0] + 0.30, MASTER[1] + 0.1, 0.12)), (T_MASTER + 0.9, (MASTER[0] + 0.10, MASTER[1], 0.06)), (P1, (MASTER[0] + 0.12, MASTER[1], 0.08))])
        lens = 40.0
    k.camera(pos, look, lens)
    s.moon.data.energy = 0.0 if in_b else 0.30
    k.sky(0.0 if in_b else 1.0)
    k.fade(ss(P0 + 0.2, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
