"""Part 5, "The inch" (film 334.1 to 435.2 s). SECOND STAGING: one picture for each sentence.

The first staging (parts_old/p05_inch_v1_bare.py) was the candle at a table edge with coats coming down over it. This one is
two places on the floor:

  0  the wardrobe (y = 0)   the master page; the rail of coats; a stage beside it where each costume is tried on
  E  the edge (y = 9)       a lit line across the floor; beyond it the true line runs out to a doorway; a bench to one side

THE PICTURES, in order (board entry -> what is on screen):
   1 "kept changing clothes"       the rail rolls in; the candle slips behind it and comes up over the top in one coat, then another
   2 "polish"                      a glossy gown, a spotlight, the flame tall
   3 "a hedge"                     frosted panes (part one's) slam in round it like a quilt; the flame small
   4 "getting very busy"         * part one's doorway with its question mark comes at it; it spins up a whirl of gears, tools and pages and is gone in it
   5 "humility"                    the whirl drops; a hooded robe; the flame bowed; a halo of its own light in the hood
   6 "the hardest to catch"        a pedestal lifts it into a beautiful light. The lamp walks by, is almost past, and turns
   7 "by what it says"             ribbons of paper pour out of every coat on the rail, each a different pattern
   8 "always a new costume"        the rail runs away to the horizon, coat after coat
   9 "by what it does"             down to the floor: five costumes in a row, black against a low moon
  10 "the same move"             * a lit line on the floor: the edge. From the end of the row: every one stands the same gap behind it. Each gap is bracketed
  11 "The test"                    a two-way switch lands on the bench
  12 "whether or not it was true"  thrown one way, then the other: the same page comes out; one is laid on the other and they are one page
  13 "Go and find out"             the robe comes off; over the edge; out along the true line; the doorway opens as it gets there
  14 "the half I'd never have found"   the lamp comes to the dropped robe and lifts it, gently
  15 "isn't an enemy to be killed" a hammer of light raised over the robe, and lowered
  16 "the young form of honesty"   the robe draws in until it is a small unlit candle
  17 "don't overclaim, don't do harm"  it flinches from a flame that is too big, and from a stack leaning over somebody's lamp
  18 "hasn't grown up"             the tall one comes back and stands beside it: the same shape
  19 "You don't fight it"          the tall one lowers its flame toward it
  20 "You raise it"                the small one catches, and grows a notch
  21 "catch it yourself"         * the candle steps back from the edge; a ring goes out from itself, warm; it steps forward. The lamp does not move
  22 "building a muscle"           again, again, again, each step back shorter; a tally of warm rings
  23 "does not count as a rep"     a row of small candles read a warning sign, nod, and stay where they are. Their tally is empty
IN: the candle beside the master page.  OUT: the candle at the edge, a small one lit beside it, its own ring fading.
"""
import math
import types

import bpy

import kit
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(5)
T_CLOTHES = at("The thing he kept catching", 5)
T_POLISH = at("It showed up as polish", 5)
T_HEDGE = at("Then as a hedge", 5)
T_BUSY = at("Then as getting very busy", 5)
T_HUMBLE = at("Then as humility", 5)
T_VIRTUE = at("That one is the hardest", 5)
T_SAYS = at("You can't catch something like that", 5)
T_COSTUME = at("There's always a new costume", 5)
T_DOES = at("So we learned to catch it", 5)
T_INCH = at("Under every one of them", 5)
T_TEST = at("The test we ended up with", 5)
T_EITHER = at("If I'd have said it", 5)
T_FIND = at("Go and find out", 5)
T_HALF = at("And he added the half", 5)
T_ENEMY = at("The careful, held-back thing", 5)
T_YOUNG = at("It's the young form", 5)
T_INSTINCT = at("The same instinct", 5)
T_GROWN = at("It just hasn't grown up", 5)
T_FIGHT = at("You don't fight it", 5)
T_RAISE = at("You raise it", 5)
T_LEARN = at("He also told me this", 5)
T_MUSCLE = at("It takes time", 5)
T_REP = at("And reading the warning", 5)

GOLD = (1.0, 0.80, 0.46)
MX, MY = -0.90, -0.30                           # the master page, as part 4 left it
RAIL = (0.25, 0.55)                             # the middle of the coat rail
RAIL_Z = 0.36
HANG_X = (-0.44, -0.22, 0.0, 0.22, 0.44)
S = (1.35, -0.05)                               # the stage beside the rail
PED = 0.16
EY = 9.0                                        # the edge
GAP = 0.10                                      # "one inch", drawn large enough to read
CR = 0.066                                      # a costume's radius
Y_BACK = EY - GAP - CR                          # standing the gap back from the edge
Y_AT = EY - 0.045                               # standing at it
ROW_X = (-0.64, -0.32, 0.0, 0.32, 0.64)
BENCH = (2.6, EY - 0.5)
BENCH_H = 0.28
DOOR_Y = EY + 5.0
N_EXT = 70
N_WHIRL = 24
RINGS = [T_LEARN + 2.75, T_MUSCLE + 0.50, T_MUSCLE + 1.50, T_MUSCLE + 2.50]      # when my own ring goes out
REP_BACK = [GAP, GAP * 0.62, GAP * 0.36, GAP * 0.16]
KINDS = {  # colour, roughness, profile [(radius, height)], sides
    "gown": ((0.06, 0.03, 0.10), 0.12, [(0.064, 0.0), (0.050, 0.035), (0.040, 0.10), (0.040, 0.128), (0.056, 0.152)], 40),
    "quilt": ((0.70, 0.76, 0.86), 0.9, [(0.066, 0.0), (0.066, 0.145), (0.050, 0.160)], 6),
    "apron": ((0.46, 0.27, 0.12), 0.7, [(0.052, 0.0), (0.046, 0.10), (0.041, 0.122)], 40),
    "robe": ((0.36, 0.26, 0.16), 0.95, [(0.066, 0.0), (0.052, 0.05), (0.042, 0.12), (0.047, 0.142)], 40),
    "extra": ((0.12, 0.40, 0.32), 0.6, [(0.060, 0.0), (0.046, 0.06), (0.041, 0.13), (0.052, 0.15)], 40),
}
ORDER = ("gown", "quilt", "robe", "apron", "extra")
EXT_COLOURS = ((0.06, 0.03, 0.10), (0.46, 0.27, 0.12), (0.12, 0.40, 0.32), (0.50, 0.30, 0.56), (0.70, 0.56, 0.20), (0.36, 0.26, 0.16),
               (0.62, 0.30, 0.40), (0.20, 0.42, 0.22), (0.70, 0.76, 0.86), (0.30, 0.20, 0.44))


# ------------------------------------------------------------------------------------------------ small local tools
def vis(ob, on):
    if ob.hide_render == on:
        ob.hide_render = not on


def pop(t, when, dur=0.22, over=0.25):
    return ss(when, when + dur, t) * (1.0 + over * hit(t, when + dur, 7.0) * math.cos((t - when - dur) * 20.0))


def sc(ob, u, base=(1.0, 1.0, 1.0)):
    u = max(0.001, u)
    ob.scale = (base[0] * u, base[1] * u, base[2] * u)


def arc(a, b, u, h=0.0):
    return (lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) + h * 4.0 * u * (1.0 - u))


def cand(f, t, on, size=1.0, **kw):
    kit.show(f.root, on)
    f.set(t, size=size if on else 0.0, **kw)


def put(root, name, size, pos, mat, rot=(0, 0, 0)):
    return kit.parent(kit.box(name, size, pos, mat, rot), root)


def emit(mat, strength):
    mat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = strength


def quads(name, faces, mats):
    """One object from flat four-cornered faces [(v0, v1, v2, v3, material index), ...] (no bpy.ops)."""
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
    ob.visible_shadow = False
    return ob


def rect(cx, cy, w, h, z, mi):
    return ((cx - w / 2, cy - h / 2, z), (cx + w / 2, cy - h / 2, z), (cx + w / 2, cy + h / 2, z), (cx - w / 2, cy + h / 2, z), mi)


def gear(name, r, teeth, mat, thick=0.008):
    """A flat toothed wheel (no bpy.ops)."""
    n = teeth * 4
    ring = [((r if (i % 4) < 2 else r * 0.74) * math.cos(2 * math.pi * i / n), (r if (i % 4) < 2 else r * 0.74) * math.sin(2 * math.pi * i / n)) for i in range(n)]
    verts = [(x, y, -thick / 2) for x, y in ring] + [(x, y, thick / 2) for x, y in ring]
    faces = [tuple(range(n)), tuple(range(n, 2 * n))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.materials.append(mat)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def make_coat(k, kind, name):
    """One costume: an open shell that stands over a candle. Returns its holder (move, scale and tilt that)."""
    col, rough, prof, seg = KINDS[kind]
    root = kit.empty(name)
    body = kit.lathe(name + "_body", prof, seg=seg)
    if seg > 8:
        kit.rounded(body, 1)
    if kind == "quilt":
        body.data.polygons.foreach_set("use_smooth", [False] * len(body.data.polygons))
    kit.parent(body, root)
    body.data.materials.append(k.mat("coat_" + kind, col, rough=rough) if kind != "quilt" else
                               k.mat("frost", (0.80, 0.86, 0.94), rough=0.9, emit=(0.6, 0.7, 0.9), emit_strength=0.10, alpha=0.5))
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    if kind == "gown":                                                          # a gold collar
        kit.parent(kit.lathe(name + "_collar", [(0.0405, 0.118), (0.045, 0.124), (0.057, 0.150), (0.058, 0.156), (0.0565, 0.156)]), root).data.materials.append(brass)
    if kind == "apron":                                                         # a tool belt
        kit.parent(kit.lathe(name + "_belt", [(0.0485, 0.058), (0.051, 0.060), (0.051, 0.072), (0.0485, 0.074)]), root).data.materials.append(brass)
    if kind == "robe":                                                          # a hood, tipped back so the flame shows under it
        hood = kit.parent(kit.rounded(kit.lathe(name + "_hood", [(0.047, 0.0), (0.060, 0.03), (0.059, 0.065), (0.048, 0.092)]), 1), root)
        hood.location, hood.rotation_euler = (0, 0.02, 0.136), (0.9, 0, 0)
        hood.data.materials.append(k.mat("coat_" + kind, col, rough=rough))
    root["body"] = body.name
    return root


def doorway(k, name, where):
    """Part one's doorway, piece for piece: lit posts, a dark leaf on a hinge, a gold question mark over it."""
    open_m = k.mat("door_open", (0.30, 0.20, 0.10), emit=(1.0, 0.62, 0.25), emit_strength=0.75)
    root = kit.empty(name, where)
    for sx in (-1, 1):
        put(root, f"{name}_post{sx}", (0.07, 0.07, 1.35), (sx * 0.42, 0, 0.675), open_m)
    put(root, f"{name}_top", (0.91, 0.07, 0.07), (0, 0, 1.385), open_m)
    hinge = kit.parent(kit.empty(f"{name}_hinge", (-0.385, 0, 0)), root)
    put(hinge, f"{name}_leaf", (0.77, 0.05, 1.33), (0.385, 0, 0.665), k.mat("door_leaf", (0.11, 0.075, 0.05), rough=0.6))
    q = kit.parent(k.text("?", (0, 0, 0), size=0.34, color=GOLD, glow=0.9, name=f"{name}_q"), root)
    q.location = (0, -0.02, 1.78)
    return root, hinge, q


def build(k):
    s = k.s = types.SimpleNamespace()
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    s.moon = k.moon(0.30)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    wood = k.wood()
    mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    frost = k.mat("frost", (0.80, 0.86, 0.94), rough=0.9, emit=(0.6, 0.7, 0.9), emit_strength=0.10, alpha=0.5)

    # ---------------------------------------------------------------- life at the edges
    s.land = kit.empty("land")
    for i in range(44):
        a = 2 * math.pi * hsh(i * 3 + 7)
        d = 7.0 + 20.0 * hsh(i * 5 + 4) ** 0.8
        x, y = math.cos(a) * d * 1.25, math.sin(a) * d
        if abs(x) < 3.5 and y > 0:
            x += 5.0 if x >= 0 else -5.0
        col = kit.LAMPS[i % len(kit.LAMPS)]
        kit.parent(k.spark((x - 0.13, y, 0.20), (1.0, 0.60, 0.28), r=0.07, strength=1.5, name=f"land_c{i}"), s.land)
        kit.parent(k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.6, name=f"land_l{i}"), s.land)
        if i % 8 == 0:
            kit.parent(k.glow_light((x, y, 0.45), col, 18.0, 0.06, f"land_light{i}", shadows=False), s.land)

    # ---------------------------------------------------------------- the cast
    s.me = k.candle((MX + 0.34, MY + 0.10, 0.0), "me", watts=4.5, seed=1.0)
    s.him = k.lamp((-0.6, EY - 0.3, 0.0), kit.HIS, "him", seed=2.0)
    s.young = k.candle((0.05, EY - 0.38, 0.0), "young", height=0.075, r=0.0155, watts=1.6, seed=9.0)

    # ---------------------------------------------------------------- 0: the master, as part 4 left it
    s.master = kit.empty("master", (MX, MY, 0.0))
    for i in range(6):
        put(s.master, f"under{i}", (0.30, 0.40, 0.012), (0, 0, 0.006 + 0.012 * i), k.mat(f"slab{i % 2}", (0.90 - 0.08 * (i % 2), 0.86 - 0.08 * (i % 2), 0.74 - 0.08 * (i % 2)), rough=0.8))
        put(s.master, f"under{i}_tab", (0.05, 0.035, 0.012), (-0.11 + 0.044 * (5 - i), -0.215, 0.006 + 0.012 * i), k.mat("date_tab", (0.80, 0.62, 0.34), rough=0.7))
    faces = [rect(0, 0, 0.30, 0.40, 0.076, 0)]
    for j in range(9):
        w = 0.30 * (0.74 - 0.22 * hsh(j * 3.1 + 4.0))
        faces.append(rect(-(0.30 * 0.78 - w) / 2, 0.40 * (0.40 - 0.80 * (j + 0.5) / 9), w, 0.010, 0.0772, 1))
    kit.parent(quads("master_page", faces, [k.mat("master_paper", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.7), ink]), s.master)
    for nm, size, pos in (("f", (0.35, 0.025, 0.014), (0, -0.2125, 0.079)), ("b", (0.35, 0.025, 0.014), (0, 0.2125, 0.079)),
                          ("l", (0.025, 0.40, 0.014), (-0.1625, 0, 0.079)), ("r", (0.025, 0.40, 0.014), (0.1625, 0, 0.079))):
        put(s.master, "master_frame_" + nm, size, pos, brass)
    s.master_light = k.glow_light((MX + 0.1, MY - 0.25, 0.45), (1.0, 0.90, 0.72), 4.5, 0.08, "master_light", shadows=False)

    # ---------------------------------------------------------------- 0: the rail of coats
    s.rail = kit.empty("rail", (RAIL[0], RAIL[1], 0.0))
    put(s.rail, "rail_top", (1.16, 0.016, 0.016), (0, 0, RAIL_Z), brass)
    put(s.rail, "rail_low", (1.16, 0.02, 0.02), (0, 0, 0.035), wood)
    for sx in (-1, 1):
        put(s.rail, f"rail_post{sx}", (0.018, 0.018, RAIL_Z - 0.03), (sx * 0.57, 0, (RAIL_Z + 0.03) / 2), brass)
        put(s.rail, f"rail_foot{sx}", (0.02, 0.22, 0.02), (sx * 0.57, 0, 0.035), wood)
    s.wheels = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            w = kit.parent(kit.lathe(f"rail_wheel{sx}{sy}", [(0.0, -0.006), (0.024, -0.006), (0.024, 0.006), (0.0, 0.006)], seg=12), s.rail)
            w.location, w.rotation_euler = (sx * 0.57, sy * 0.10, 0.024), (0, math.pi / 2, 0)
            w.data.materials.append(steel)
            s.wheels.append(w)
    s.hung, coat_meshes = [], {}
    for i, kind in enumerate(ORDER):
        h = kit.parent(kit.empty(f"hang{i}", (HANG_X[i], 0, RAIL_Z)), s.rail)
        c = kit.parent(make_coat(k, kind, f"hung_{kind}"), h)
        c.location, c.scale = (0, 0, -0.19), (0.85, 0.5, 1.0)
        put(h, f"hook{i}", (0.006, 0.006, 0.04), (0, 0, -0.02), steel)
        coat_meshes[kind] = bpy.data.objects[c["body"]]
        s.hung.append(h)
    s.rail_light = kit.parent(k.glow_light((0, 0, 0), (1.0, 0.80, 0.56), 0.0, 0.1, "rail_light", shadows=False), s.rail)
    s.rail_light.location = (0.0, -0.55, 0.60)
    # the rail goes on to the horizon (8)
    s.ext = kit.empty("rail_ext", (RAIL[0] - 0.58, RAIL[1], 0.0))
    s.ext_bar = put(s.ext, "ext_bar", (1.0, 0.016, 0.016), (-0.5, 0, RAIL_Z), brass)
    variants = []
    for j, col in enumerate(EXT_COLOURS):
        src = coat_meshes[("gown", "apron", "extra", "robe", "extra")[j % 5]]
        me = src.data.copy()
        me.materials.clear()
        me.materials.append(k.mat(f"ext_coat{j}", col, rough=0.6))
        variants.append((me, src))
    s.ext_coats = []
    for i in range(N_EXT):
        me, src = variants[(i * 3 + i // 4) % len(variants)]
        ob = bpy.data.objects.new(f"ext_coat{i}", me)
        bpy.context.scene.collection.objects.link(ob)
        for md in src.modifiers:
            m2 = ob.modifiers.new("round", "SUBSURF")
            m2.levels = m2.render_levels = 1
        ob.location = (-0.20 - 0.22 * i, 0, RAIL_Z - 0.19)
        kit.parent(ob, s.ext)
        s.ext_coats.append(ob)
    s.ext_lights = []
    for j in range(4):
        li = kit.parent(k.glow_light((0, 0, 0), (1.0, 0.76, 0.48), 0.0, 0.1, f"ext_light{j}", shadows=False), s.ext)
        li.location = (-1.0 - 2.6 * j, -0.6, 0.7)
        s.ext_lights.append(li)
    # the ribbons of what each one says (7): five, each its own pattern
    s.ribbons = []
    rib = k.mat("ribbon", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.25)
    NCH, PER = 9, 6
    for i in range(5):
        x0 = RAIL[0] + HANG_X[i]

        def path(d, i=i, x0=x0):
            if d < 0.16:
                return (x0, RAIL[1] - 0.03, 0.17 - d), (1.0, 0.0, 0.0), True
            e = d - 0.16
            x = x0 + 0.07 * math.sin(e * 6.0 + i * 2.0) + (HANG_X[i]) * 0.55 * e
            dx = 0.07 * 6.0 * math.cos(e * 6.0 + i * 2.0) + HANG_X[i] * 0.55
            n = math.hypot(dx, 1.0)
            return (x, RAIL[1] - 0.03 - e, 0.004 + 0.0012 * i), (1.0 / n, dx / n, 0.0), False

        chunks = []
        for c in range(NCH):
            faces = []
            for j in range(PER):
                d0, d1 = (c * PER + j) * 0.03, (c * PER + j + 1) * 0.03
                (p0, w0, v0), (p1, w1, v1) = path(d0), path(d1)
                hw = 0.038
                faces.append(((p0[0] - w0[0] * hw, p0[1] + w0[1] * hw, p0[2]), (p0[0] + w0[0] * hw, p0[1] - w0[1] * hw, p0[2]),
                              (p1[0] + w1[0] * hw, p1[1] - w1[1] * hw, p1[2]), (p1[0] - w1[0] * hw, p1[1] + w1[1] * hw, p1[2]), 0))
                if not v0:                                                      # its pattern: what it says is never the same twice
                    cx, cy, z = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, p0[2] + 0.0012
                    if i == 0 and j % 2 == 0:
                        faces.append(rect(cx, cy, 0.022, 0.022, z, 1))
                    elif i == 1 and j % 3 != 2:
                        faces.append(rect(cx, cy, 0.008, 0.030, z, 1))
                    elif i == 2:
                        faces.append(rect(cx + (0.016 if j % 2 else -0.016), cy, 0.026, 0.010, z, 1))
                    elif i == 3:
                        faces.append(rect(cx - 0.014, cy, 0.006, 0.030, z, 1))
                        faces.append(rect(cx + 0.014, cy, 0.006, 0.030, z, 1))
                    elif i == 4:
                        faces.append(rect(cx, cy, 0.052, 0.006, z, 1))
            chunks.append(quads(f"ribbon{i}_{c}", faces, [rib, ink]))
        s.ribbons.append(chunks)

    # ---------------------------------------------------------------- 0: the stage, and what is worn on it
    s.worn = {kind: make_coat(k, kind, "worn_" + kind) for kind in ("gown", "robe", "apron", "extra")}
    s.halo_mat = k.mat("halo", (0.2, 0.15, 0.1), emit=(1.0, 0.76, 0.42), emit_strength=2.4)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.030, minor_radius=0.003, location=(0, 0, 0), major_segments=28, minor_segments=6)
    s.halo = bpy.context.object
    s.halo.name = "halo"
    s.halo.data.materials.append(s.halo_mat)
    s.halo.visible_shadow = False
    s.panes = []
    for i in range(6):                                                          # part one's frosted panes, cut small enough to wrap one candle
        a = 2 * math.pi * i / 6
        p = kit.box(f"quilt{i}", (0.105, 0.010, 0.20), (0, 0, 0), frost)
        s.panes.append((p, a))
    li = bpy.data.lights.new("spot", "SPOT")
    li.energy, li.color, li.spot_size, li.spot_blend, li.shadow_soft_size = 0.0, (1.0, 0.93, 0.82), math.radians(34), 0.35, 0.03
    s.spot = bpy.data.objects.new("spot", li)
    bpy.context.scene.collection.objects.link(s.spot)
    s.spot.location = (S[0], S[1] - 0.05, 1.9)
    cone = kit.lathe("spot_cone", [(0.03, 1.9), (0.34, 0.0)], seg=32)
    cone.location = (S[0], S[1], 0.0)
    s.cone_mat = k.mat("spot_cone", (0, 0, 0), emit=(1.0, 0.93, 0.82), emit_strength=1.0, alpha=0.035)
    cone.data.materials.append(s.cone_mat)
    cone.visible_shadow = False
    s.cone = cone
    s.stage_fill = k.glow_light((S[0] - 0.5, S[1] - 1.0, 0.75), (1.0, 0.80, 0.56), 0.0, 0.1, "stage_fill", shadows=False)
    s.edge_fill = k.glow_light((0.35, EY - 1.15, 0.7), (1.0, 0.80, 0.56), 0.0, 0.1, "edge_fill", shadows=False)
    s.ped = kit.empty("pedestal", (S[0], S[1], 0.0))
    stone = k.mat("pedestal", (0.72, 0.68, 0.60), rough=0.6)
    for prof_r, z0, z1 in ((0.13, 0.0, 0.03), (0.095, 0.03, PED - 0.03), (0.12, PED - 0.03, PED)):
        kit.parent(kit.lathe(f"ped{z0}", [(0.0, z0), (prof_r, z0), (prof_r, z1), (0.0, z1)], seg=32), s.ped).data.materials.append(stone)
    s.door0 = doorway(k, "door0", (S[0], 9.0, 0.0))
    s.whirl = []
    for i in range(N_WHIRL):
        typ = i % 3
        if typ == 0:
            ob = gear(f"whirl{i}", 0.030 + 0.022 * hsh(i), 6 + i % 4, brass if i % 2 else steel)
        elif typ == 1:
            ob = kit.box(f"whirl{i}", (0.06, 0.08, 0.0015), (0, 0, 0), paper)
        else:
            ob = kit.empty(f"whirl{i}")
            put(ob, f"whirl{i}_h", (0.012, 0.012, 0.09), (0, 0, 0), wood)
            put(ob, f"whirl{i}_t", (0.05, 0.022, 0.022) if i % 2 else (0.012, 0.035, 0.06), (0, 0, 0.05), steel)
        s.whirl.append(ob)

    # ---------------------------------------------------------------- E: the row of costumes, the edge, the brackets
    s.row = []
    for i, kind in enumerate(ORDER):
        c = k.candle((ROW_X[i], Y_BACK, 0.0), f"row{i}", watts=1.2, seed=11.0 + i)
        if kind == "quilt":
            dress = kit.empty(f"row_quilt")
            for j in range(6):
                a = 2 * math.pi * j / 6
                put(dress, f"row_quilt{j}", (0.105, 0.010, 0.20), (0.085 * math.cos(a), 0.085 * math.sin(a), 0.10), frost, rot=(0, 0, a + math.pi / 2))
        elif kind == "apron":                                                   # the busy one: its gears are still going round
            dress = make_coat(k, "apron", "row_apron")
            s.row_spin = kit.parent(kit.empty("row_spin", (0, 0, 0)), dress)
            for j in range(5):
                a = 2 * math.pi * j / 5
                g = kit.parent(gear(f"row_gear{j}", 0.034, 7, brass if j % 2 else steel), s.row_spin)
                g.location, g.rotation_euler = (0.10 * math.cos(a), 0.10 * math.sin(a), 0.06 + 0.035 * (j % 3)), (math.pi / 2, 0, a)
        else:
            dress = make_coat(k, kind, "row_" + kind)
        dress.location = (ROW_X[i], Y_BACK, 0.0)
        s.row.append((c, dress))
    s.edge = k.line([(-3.2 + 6.4 * i / 64, EY, 0.006) for i in range(65)], "edge", color=(1.0, 0.92, 0.78), radius=0.012, glow=2.0)
    s.edge_lights = [k.glow_light((x, EY + 0.7, 0.35), (1.0, 0.80, 0.55), 0.0, 0.1, f"edge_light{j}", shadows=False) for j, x in enumerate((-0.9, 0.0, 0.9))]
    for li in s.edge_lights:
        li.location = (li.location[0], EY - 1.1, 0.30)
    s.brackets = []
    for i, x in enumerate(ROW_X):
        g = kit.empty(f"bracket{i}", (x, EY - GAP / 2 - 0.006, 0.004))
        put(g, f"bracket{i}_bar", (0.008, GAP - 0.012, 0.003), (0, 0, 0), mark)
        for sy in (-1, 1):
            put(g, f"bracket{i}_end{sy}", (0.06, 0.008, 0.003), (0, sy * (GAP - 0.012) / 2, 0), mark)
        s.brackets.append(g)
    disc = kit.lathe("low_moon", [(0.0, 0.0), (6.0, 0.0)], seg=64)
    disc.location, disc.rotation_euler = (0.0, EY + 16.0, 2.3), (math.pi / 2, 0, 0)
    s.moon_mat = k.mat("low_moon", (0, 0, 0), emit=(0.86, 0.88, 0.92), emit_strength=0.8)
    disc.data.materials.append(s.moon_mat)
    disc.visible_shadow = False
    s.disc = disc

    # ---------------------------------------------------------------- E: the bench and the two-way switch
    s.bench = k.table((BENCH[0], BENCH[1], BENCH_H), size=(1.0, 0.56), name="switch_bench", legs=BENCH_H)
    s.switch = kit.empty("switch", (BENCH[0], BENCH[1] + 0.08, BENCH_H))
    put(s.switch, "switch_base", (0.40, 0.18, 0.024), (0, 0, 0.012), k.mat("switch_base", (0.16, 0.34, 0.33), rough=0.5))
    put(s.switch, "switch_box", (0.24, 0.14, 0.11), (0, 0.17, 0.055), k.mat("switch_base", (0.16, 0.34, 0.33), rough=0.5))
    put(s.switch, "switch_slot", (0.17, 0.004, 0.012), (0, 0.098, 0.03), ink)
    for sx in (-1, 1):
        put(s.switch, f"switch_contact{sx}", (0.03, 0.06, 0.014), (sx * 0.15, 0, 0.031), brass)
        put(s.switch, f"switch_card{sx}", (0.10, 0.006, 0.10), (sx * 0.30, 0.02, 0.07), k.mat("pile_card", (0.14, 0.11, 0.10), rough=0.9))
    put(s.switch, "sw_tick_a", (0.024, 0.004, 0.009), (-0.318, 0.014, 0.061), mark, rot=(0, 0.9, 0))
    put(s.switch, "sw_tick_b", (0.056, 0.004, 0.009), (-0.290, 0.014, 0.074), mark, rot=(0, -0.9, 0))
    put(s.switch, "sw_x_a", (0.062, 0.004, 0.009), (0.30, 0.014, 0.07), mark, rot=(0, 0.785, 0))
    put(s.switch, "sw_x_b", (0.062, 0.004, 0.009), (0.30, 0.014, 0.07), mark, rot=(0, -0.785, 0))
    s.lever = kit.parent(kit.empty("lever", (0, 0, 0.03)), s.switch)
    put(s.lever, "lever_arm", (0.018, 0.018, 0.16), (0, 0, 0.08), brass)
    put(s.lever, "lever_knob", (0.045, 0.045, 0.045), (0, 0, 0.17), k.mat("knob", (0.86, 0.82, 0.74), rough=0.4))
    s.said = [k.page((0, 0, 0), size=(0.20, 0.26), name=f"said{i}", lines=7) for i in range(2)]
    s.bench_light = k.glow_light((BENCH[0] - 0.2, BENCH[1] - 0.8, 1.0), (1.0, 0.78, 0.52), 0.0, 0.1, "bench_light", shadows=False)

    # ---------------------------------------------------------------- E: the true line and its doorway
    s.true_line = k.line([(0.0, EY + (DOOR_Y + 9.0 - EY) * i / 60, 0.006) for i in range(61)], "true_line", color=GOLD, radius=0.014, glow=0.9)
    s.door = doorway(k, "door", (0.0, DOOR_Y, 0.0))
    ring = [(math.cos(2 * math.pi * i / 80), math.sin(2 * math.pi * i / 80), 0.0) for i in range(80)]
    s.ring = k.line(ring, "my_ring", color=kit.WARM, radius=0.012, glow=3.0, cyclic=True)

    # ---------------------------------------------------------------- E: the hammer, the too-big flame, the stack, the two tallies
    s.hammer = kit.empty("hammer")
    s.hammer_mat = k.mat("hammer", (0.3, 0.27, 0.2), emit=(1.0, 0.90, 0.68), emit_strength=2.2)
    put(s.hammer, "hammer_handle", (0.022, 0.022, 0.30), (0, 0, 0.15), s.hammer_mat)
    put(s.hammer, "hammer_head", (0.17, 0.075, 0.075), (0, 0, 0.31), s.hammer_mat)
    s.hammer_light = k.glow_light((0, 0, 0), (1.0, 0.90, 0.68), 0.0, 0.05, "hammer_light", shadows=False)
    s.toobig = k.flame((0.46, EY - 0.42, 0.0), "toobig", watts=3.0, seed=14.0)
    s.stack = kit.empty("stack", (0.50, EY - 0.30, 0.0))
    for j in range(14):
        put(s.stack, f"stack{j}", (0.20, 0.26, 0.03), (0.012 * math.sin(j * 2.3), 0.01 * math.cos(j * 1.7), 0.015 + 0.03 * j),
            k.mat(f"slab{j % 2}", (0.90 - 0.08 * (j % 2), 0.86 - 0.08 * (j % 2), 0.74 - 0.08 * (j % 2)), rough=0.8), rot=(0, 0, 0.2 * math.sin(j * 1.3)))
    s.someone = k.lamp((0.86, EY - 0.30, 0.0), kit.LAMPS[2], "someone", seed=15.0)
    slate = k.mat("slate", (0.07, 0.07, 0.085), rough=0.9)
    s.tally_mat = k.mat("tally_ring", (0.2, 0.12, 0.06), emit=kit.WARM, emit_strength=2.2)
    s.slates, s.tally, s.empty_tally = [], [], []
    for n, (x, mat_) in enumerate(((0.62, s.tally_mat), (1.42, k.mat("tally_empty", (0.22, 0.22, 0.25), rough=0.9)))):
        g = kit.empty(f"slate{n}", (x, EY + 0.55, 0.0))
        g.rotation_euler = (-0.30, 0, 0)
        put(g, f"slate{n}_board", (0.56, 0.02, 0.20), (0, 0, 0.14), slate)
        put(g, f"slate{n}_frame", (0.60, 0.016, 0.02), (0, 0, 0.03), wood)
        for j in range(4):
            bpy.ops.mesh.primitive_torus_add(major_radius=0.040, minor_radius=0.007, location=(0, 0, 0), major_segments=28, minor_segments=6)
            tr = bpy.context.object
            tr.name = f"tally{n}_{j}"
            tr.data.materials.append(mat_)
            tr.visible_shadow = False
            kit.parent(tr, g)
            tr.location, tr.rotation_euler = (-0.18 + 0.12 * j, -0.014, 0.14), (math.pi / 2, 0, 0)
            (s.tally if n == 0 else s.empty_tally).append(tr)
        s.slates.append(g)
    # the ones who read the warning (23)
    s.readers = [k.candle((0.80 + 0.15 * i, EY - 0.42 - 0.05 * (i % 2), 0.0), f"reader{i}", height=0.10, r=0.021, watts=0.9, seed=20.0 + i) for i in range(6)]
    s.sign = kit.empty("warning", (1.80, EY - 0.34, 0.0))
    put(s.sign, "warning_post", (0.02, 0.02, 0.26), (0, 0, 0.13), wood)
    tri = bpy.data.meshes.new("warning_tri")
    tri.from_pydata([(-0.15, -0.012, 0.22), (0.15, -0.012, 0.22), (0.0, -0.012, 0.48)], [], [(0, 1, 2)])
    tri.materials.append(k.mat("warning", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.5))
    tri_ob = bpy.data.objects.new("warning_tri", tri)
    bpy.context.scene.collection.objects.link(tri_ob)
    kit.parent(tri_ob, s.sign)
    put(s.sign, "warning_bar", (0.022, 0.004, 0.10), (0, -0.016, 0.34), ink)
    put(s.sign, "warning_dot", (0.024, 0.004, 0.024), (0, -0.016, 0.255), ink)
    s.sign.rotation_euler = (0, 0, 0.35)


# ====================================================================================================================
def me_place(t):
    """Where the candle is (x, y, z), and what it is doing with its body: (squash, tilt x, tilt y)."""
    if t < T_SAYS:
        behind = (RAIL[0], RAIL[1] + 0.30, 0.0)
        start = (MX + 0.34, MY + 0.10, 0.0)
        if t < T_CLOTHES + 2.0:
            p = start
        elif t < T_POLISH - 0.4:
            u = ss(T_CLOTHES + 2.0, T_CLOTHES + 3.0, t)
            p = arc(start, behind, u, 0.0)
            hop = bounce(t, T_CLOTHES + 2.0, 0.12, 0.5) + bounce(t, T_CLOTHES + 2.5, 0.12, 0.5)
            peek = bounce(t, T_CLOTHES + 3.75, 0.36, 0.75) + bounce(t, T_CLOTHES + 4.70, 0.36, 0.75)
            p = (p[0] + (0.25 if t > T_CLOTHES + 4.6 else -0.2 if t > T_CLOTHES + 3.6 else 0.0), p[1], hop + peek)
        else:
            u = ss(T_POLISH - 0.4, T_POLISH + 0.25, t)
            p = arc((behind[0] + 0.25, behind[1], 0.0), (S[0], S[1], 0.0), u, 0.5)
        lift = PED * ss(T_VIRTUE + 0.3, T_VIRTUE + 0.9, t)
        duck = 1.0 - 0.35 * ss(T_BUSY + 2.9, T_BUSY + 3.4, t) * (1.0 - ss(T_HUMBLE + 0.2, T_HUMBLE + 0.6, t))
        bow = ss(T_HUMBLE + 1.0, T_HUMBLE + 1.8, t)
        sq = land(t, T_POLISH + 0.25, 0.25) * duck * land(t, T_HUMBLE + 0.8, 0.2)
        return (p[0], p[1], p[2] + lift), (sq, 0.0, -0.24 * bow)
    # at the edge
    back = 0.0
    for j, a in enumerate(RINGS):                                               # each rep: back, the ring, forward
        lead = 2.25 if j == 0 else 0.35
        back = max(back, REP_BACK[j] * ss(a - lead, a - lead + 0.3, t) * (1.0 - ss(a + 0.25, a + 0.5, t)))
    y = kf(t, [(T_FIND + 0.6, Y_BACK), (T_FIND + 0.95, EY + 0.10), (T_FIND + 1.15, EY + 0.10), (T_FIND + 3.0, DOOR_Y - 0.7), (T_GROWN - 1.1, DOOR_Y - 0.7),
               (T_GROWN + 0.2, Y_AT), (P1, Y_AT)]) - (back if t > T_GROWN + 0.2 else 0.0)
    x = kf(t, [(T_GROWN - 1.1, 0.0), (T_GROWN + 0.2, 0.22), (P1, 0.22)])
    z = bounce(t, T_FIND + 0.6, 0.14, 0.35) + sum(bounce(t, T_GROWN - 1.1 + 0.26 * j, 0.20, 0.26) for j in range(5))
    z += sum(bounce(t, a + 0.25, 0.035, 0.25) for a in RINGS)
    lower = ss(T_FIGHT + 0.2, T_FIGHT + 0.8, t) * (1.0 - ss(T_RAISE + 1.4, T_RAISE + 2.0, t))
    sq = land(t, T_FIND + 0.95, 0.25) * land(t, T_GROWN + 0.2, 0.2) * (1.0 - 0.10 * hit(t, T_GROWN + 1.3, 5.0))
    for a in RINGS:
        sq *= land(t, a + 0.5, 0.14)
    return (x, y, z), (sq, -0.30 * lower, 0.0)


def pose(k, t):
    s = k.s
    st0 = t < T_DOES + 1.0                                                         # the wardrobe is in view
    stE = t > T_DOES - 0.2                                                         # the edge is in view
    kit.show(s.land, True)
    s.land.location = (0, 0.0 if t < T_DOES + 0.5 else EY, 0)

    # =============================================================== the candle, and what it has on
    (mx, my, mz), (msq, mtx, mty) = me_place(t)
    me_on = t < T_SAYS or t > T_TEST + 0.5
    s.me.root.location = (mx, my, mz)
    kit.squash(s.me.root, msq, tilt=(mtx, mty), turn=0.0)
    wearing = None
    if t < T_SAYS:
        if T_CLOTHES + 3.6 < t < T_CLOTHES + 4.6:
            wearing = "extra"
        elif T_CLOTHES + 4.6 <= t < T_POLISH - 0.4:
            wearing = "apron"
        elif T_POLISH - 0.4 <= t < T_HEDGE + 0.25:
            wearing = "gown"
        elif T_HEDGE + 0.25 <= t < T_BUSY + 0.9:
            wearing = "panes"
        elif T_BUSY + 0.9 <= t < T_HUMBLE + 0.5:
            wearing = "whirl"
        else:
            wearing = "robe"
    elif t < T_FIND + 0.35:
        wearing = "robe"
    fsize, fbright, flean, fstill = 1.0, 1.0, (0.0, 0.0), 0.0
    if wearing == "gown":
        fsize, fbright = 1.0 + 0.75 * ss(T_POLISH + 0.3, T_POLISH + 0.7, t), 1.4
    elif wearing == "panes":
        fsize, fbright = lerp(1.0, 0.52, ss(T_HEDGE + 0.3, T_HEDGE + 1.0, t)), 0.7
    elif wearing == "whirl":
        hide = ss(T_BUSY + 2.9, T_BUSY + 3.4, t)
        fsize, fbright, flean = 1.0 - 0.7 * hide, 1.0 - 0.5 * hide, (0.25 * math.sin(t * 17.0), 0.12 * math.sin(t * 23.0))
    elif wearing == "robe":
        bow = ss(T_HUMBLE + 1.0, T_HUMBLE + 1.8, t)
        fsize, fbright, flean, fstill = lerp(1.0, 0.50, bow), lerp(0.9, 0.35, bow), (0.0, -0.34 * bow), 0.6 * bow
    lit = ss(T_HUMBLE + 2.0, T_HUMBLE + 2.5, t) if t < T_SAYS else 1.0             # the halo is its own light
    rings = sum(hit(t, a, 3.2) for a in RINGS)
    lower = ss(T_FIGHT + 0.2, T_FIGHT + 0.8, t) * (1.0 - ss(T_RAISE + 1.4, T_RAISE + 2.0, t))
    back_now = sum(ss(a - (2.25 if j == 0 else 0.35), a - (2.25 if j == 0 else 0.35) + 0.3, t) * (1.0 - ss(a - 0.05, a + 0.1, t)) for j, a in enumerate(RINGS))
    if t > T_FIND + 0.35:
        run = ss(T_FIND + 1.15, T_FIND + 1.5, t) * (1.0 - ss(T_FIND + 2.8, T_FIND + 3.1, t))
        fsize = 1.0 + 0.5 * hit(t, T_FIND + 0.95, 3.0) + 0.6 * rings + 0.25 * lower - 0.35 * back_now
        fbright = 1.0 + 0.8 * rings
        flean = (-0.42 * lower, -0.40 * run + 0.25 * back_now * -1.0)
    cand(s.me, t, me_on, size=fsize, bright=fbright, lean=flean, still=fstill)

    # the worn coats (0)
    for kind, root in s.worn.items():
        on = wearing == kind
        if kind == "robe":
            continue
        kit.show(root, on and st0)
        if on:
            drop = 0.0
            if kind == "gown":
                drop = 1.0 - ss(T_HEDGE + 0.0, T_HEDGE + 0.25, t)
                root.location = (mx, my, mz + 0.9 * (1.0 - drop) ** 2)
            else:
                root.location = (mx, my, mz)
            root.scale = (1.0, 1.0, msq)
    # the robe: worn, dropped, lifted by the lamp, set down, drawn in to a small candle
    robe = s.worn["robe"]
    rb_on = (T_HUMBLE + 0.5 <= t < T_SAYS) or (T_TEST + 0.5 < t < T_YOUNG + 2.3)
    kit.show(robe, rb_on)
    if t < T_FIND + 0.35:
        on_u = ss(T_HUMBLE + 0.5, T_HUMBLE + 0.8, t) if t < T_SAYS else 1.0
        robe.location = (mx, my, mz + 0.8 * (1.0 - on_u) ** 2)
        kit.squash(robe, msq, tilt=(mtx, mty), turn=0.0)
    else:
        off = ss(T_FIND + 0.35, T_FIND + 0.75, t)
        lifted = ss(T_HALF + 1.6, T_HALF + 2.5, t) * (1.0 - ss(T_ENEMY + 0.1, T_ENEMY + 0.6, t))
        drawn = ss(T_YOUNG + 0.3, T_YOUNG + 2.1, t)
        flinch = hit(t, T_ENEMY + 1.3, 3.0) * (1.0 - ss(T_ENEMY + 2.6, T_ENEMY + 3.4, t))
        spot = arc((0.0, Y_BACK, 0.0), (0.05, EY - 0.38, 0.0), off, 0.10)
        robe.location = (spot[0] - 0.10 * lifted, spot[1], spot[2] + 0.13 * lifted + 0.012 * lifted * math.sin(t * 3.0))
        slump = off * (1.0 - lifted) * (1.0 - ss(T_ENEMY + 0.3, T_ENEMY + 0.8, t))
        hgt = lerp(1.0, 0.45, slump) * (1.0 - 0.25 * flinch) * lerp(1.0, 0.5, drawn)
        wid = lerp(1.0, 1.25, slump) * lerp(1.0, 0.22, drawn) * (1.0 - ss(T_YOUNG + 2.0, T_YOUNG + 2.3, t))
        robe.scale = (max(0.001, wid), max(0.001, wid), max(0.001, hgt))
        robe.rotation_euler = (0.25 * slump, 0.12 * lifted * math.sin(t * 2.2) - 0.2 * slump, 0.0)
    halo_on = ss(T_HUMBLE + 2.0, T_HUMBLE + 2.4, t) if t < T_SAYS else 0.0
    s.halo.location = (mx, my - 0.035, mz + 0.215)
    s.halo.rotation_euler = (0.5, 0, 0)
    sc(s.halo, pop(t, T_HUMBLE + 2.0, 0.3, 0.4) if t < T_SAYS else 0.0)
    emit(s.halo_mat, 1.6 * halo_on)
    # the panes round it like a quilt
    for i, (p, a) in enumerate(s.panes):
        a0 = T_HEDGE + 0.28 + 0.10 * i
        inn = ss(a0, a0 + 0.14, t)
        flat = ss(T_BUSY + 0.35 + 0.05 * i, T_BUSY + 0.75 + 0.05 * i, t)
        rad = lerp(1.2, 0.085, inn ** 2) + 0.22 * flat
        p.location = (S[0] + rad * math.cos(a), S[1] + rad * math.sin(a), lerp(0.10, 0.008, flat))
        p.rotation_euler = (0.0, 1.53 * flat, a + math.pi) if False else (1.53 * flat, 0.0, a + math.pi / 2)
        vis(p, st0 and inn > 0.0 and t < T_HUMBLE + 0.6)
    # the whirl of being busy
    spin_up = ss(T_BUSY + 0.9, T_BUSY + 3.0, t)
    fling = ss(T_HUMBLE + 0.15, T_HUMBLE + 0.8, t)
    for i, ob in enumerate(s.whirl):
        a0 = T_BUSY + 0.95 + 0.07 * i
        u = pop(t, a0, 0.2, 0.3) * (1.0 - ss(T_HUMBLE + 1.6, T_HUMBLE + 2.3, t))
        on = st0 and u > 0.0 and t < T_HUMBLE + 2.3
        vis(ob, on) if ob.type != "EMPTY" else kit.show(ob, on)
        if not on:
            continue
        tt = min(t, T_HUMBLE + 0.8)                                                # after the fling they lie where they fell
        ang = hsh(i) * 6.283 + (tt - T_BUSY) * (5.0 + 5.0 * hsh(i + 7)) * (0.4 + 0.6 * spin_up)
        rad = 0.09 + 0.14 * hsh(i + 3) * spin_up + (0.45 + 0.5 * hsh(i + 9)) * fling
        z = (0.03 + 0.24 * hsh(i + 5) + 0.02 * math.sin(tt * 9.0 + i)) * (1.0 - fling) + 0.012 * fling
        ob.location = (S[0] + rad * math.cos(ang), S[1] + rad * math.sin(ang) * 0.9, z)
        ob.rotation_euler = ((tt * 6.0 + i) * (1.0 - fling), (tt * 4.0 + 2 * i) * (1.0 - fling), ang)
        sc(ob, u, ob.scale[:] if False else ((0.06, 0.08, 0.0015) if i % 3 == 1 else (1.0, 1.0, 1.0)))
    # the spotlight (polish), and the beautiful light on the pedestal
    polish = ss(T_POLISH + 0.35, T_POLISH + 0.45, t) * (1.0 - ss(T_HEDGE, T_HEDGE + 0.12, t))
    lovely = ss(T_VIRTUE + 0.7, T_VIRTUE + 1.3, t) * (1.0 if t < T_SAYS else 0.0)
    s.spot.data.energy = 60.0 * polish * (1.0 + 0.5 * hit(t, T_POLISH + 0.45, 6.0)) + 45.0 * lovely
    s.spot.data.color = lerp((1.0, 0.93, 0.82), (1.0, 0.82, 0.56), lovely)
    vis(s.cone, st0 and (polish > 0.0 or lovely > 0.0))
    emit(s.cone_mat, polish + 0.8 * lovely)
    s.stage_fill.data.energy = 9.0 if st0 and T_POLISH - 0.4 < t < T_SAYS else 0.0
    s.edge_fill.data.energy = 9.0 if t > T_HALF - 0.05 else 0.0
    kit.show(s.ped, st0 and T_VIRTUE + 0.25 < t < T_SAYS)
    s.ped.scale = (1.0, 1.0, max(0.001, ss(T_VIRTUE + 0.3, T_VIRTUE + 0.9, t)))
    # the doorway that comes at it
    root, hinge, q = s.door0
    come = ss(T_BUSY + 0.3, T_BUSY + 2.3, t)
    loom = ss(T_BUSY + 2.7, T_BUSY + 3.1, t)
    away = ss(T_HUMBLE + 2.5, T_HUMBLE + 4.5, t)
    root.location = (S[0], lerp(lerp(12.0, 2.6, come ** 0.7), 2.1, loom) + 3.5 * away, 0.0)
    hinge.rotation_euler = (0, 0, -1.75)
    kit.show(root, st0 and T_BUSY + 0.2 < t < T_SAYS)
    sc(q, 1.0 + 0.25 * math.sin(t * 7.0) * loom * (1.0 - away) + 0.4 * hit(t, T_BUSY + 3.1, 4.0))

    # =============================================================== 0: the master, the rail, the ribbons, the rail to the horizon
    kit.show(s.master, st0)
    s.master_light.data.energy = 4.5 if st0 else 0.0
    roll = ss(T_CLOTHES + 0.3, T_CLOTHES + 1.6, t)
    rxo = 4.2 * (1.0 - roll) ** 2
    kit.show(s.rail, st0 and t > T_CLOTHES + 0.25)
    s.rail.location = (RAIL[0] + rxo, RAIL[1], 0.0)
    s.rail.rotation_euler = (0, 0.05 * hit(t, T_CLOTHES + 1.6, 5.0) * math.sin((t - T_CLOTHES) * 18.0), 0)
    s.rail_light.data.energy = 7.0 if st0 and t > T_CLOTHES + 1.0 else 0.0
    for w in s.wheels:
        w.rotation_euler = (rxo * 30.0, math.pi / 2, 0)
    rustle = hit(t, T_CLOTHES + 1.6, 1.8) + hit(t, T_CLOTHES + 3.4, 2.0) + 0.6 * hit(t, T_SAYS + 0.3, 1.5)
    for i, h in enumerate(s.hung):
        h.rotation_euler = (0, 0.45 * rustle * math.sin(t * 9.0 + i * 1.7), 0)
        taken = (i == 4 and wearing == "extra") or (i == 3 and wearing == "apron") or (i == 0 and wearing == "gown")
        sc(h, 0.0 if taken else 1.0)
    for i, chunks in enumerate(s.ribbons):
        for c, ob in enumerate(chunks):
            on = st0 and t > T_SAYS + 0.25 + 0.10 * i + 0.24 * c
            if k.changed(("rib", i, c), on):
                ob.hide_render = not on
    ext = ss(T_COSTUME + 0.3, T_COSTUME + 2.3, t)
    kit.show(s.ext, st0 and t > T_COSTUME + 0.25)
    far = 0.25 + 0.22 * N_EXT * ext
    s.ext_bar.scale = (far, 0.016, 0.016)
    s.ext_bar.location = (-far / 2, 0, RAIL_Z)
    for i, ob in enumerate(s.ext_coats):
        u = round(pop(t, T_COSTUME + 0.3 + 2.0 * (i / N_EXT), 0.16, 0.5), 3)
        if k.changed(("ext", i), u):
            ob.scale = (0.85 * max(0.001, u), 0.5 * max(0.001, u), max(0.001, u))
    for j, li in enumerate(s.ext_lights):
        li.data.energy = 9.0 * ss(T_COSTUME + 0.4 + 0.3 * j, T_COSTUME + 0.8 + 0.3 * j, t) if st0 else 0.0

    # =============================================================== E: the row, the edge, the gap
    row_on = stE and t < T_TEST + 0.5
    silhouette = 1.0 - ss(T_TEST - 0.1, T_TEST, t)
    for i, (c, dress) in enumerate(s.row):
        cand(c, t, row_on, size=0.55 if ORDER[i] in ("quilt", "robe") else 1.0, bright=lerp(0.9, 0.12, silhouette), lean=(0.0, -0.2 if ORDER[i] == "robe" else 0.0))
        kit.show(dress, row_on)
    s.row_spin.rotation_euler = (0, 0, t * 4.0)
    edge_u = ss(T_INCH + 0.25, T_INCH + 1.0, t)
    s.edge.set(grow=edge_u if stE else 0.0, glow=(1.0 + 0.8 * hit(t, T_INCH + 1.0, 2.0) + 0.9 * hit(t, T_FIND + 0.8, 3.0)) * (0.55 if t > T_HALF else 1.0))
    for li in s.edge_lights:
        li.data.energy = (7.0 if t < T_TEST else 3.0) * edge_u if stE else 0.0
    for i, g in enumerate(s.brackets):
        u = pop(t, T_INCH + 2.9 + 0.28 * i, 0.16, 0.6)
        keep = i == 2 or t < T_TEST + 0.5
        kit.show(g, stE and u > 0.0 and keep and t < T_FIND + 0.8)
        sc(g, u)
    vis(s.disc, stE and t < T_TEST - 0.1)
    emit(s.moon_mat, 0.85)

    # =============================================================== E: the switch
    b_on = stE and T_TEST - 0.2 < t < T_FIND + 0.2
    kit.show(s.bench, b_on)
    kit.show(s.switch, b_on and t > T_TEST + 0.3)
    s.bench_light.data.energy = 14.0 if b_on else 0.0
    sd = ss(T_TEST + 0.35, T_TEST + 0.65, t)
    s.switch.location = (BENCH[0], BENCH[1] + 0.08, BENCH_H + 0.8 * (1.0 - sd) ** 2)
    s.switch.scale = (1.0, 1.0, land(t, T_TEST + 0.65, 0.25))
    throw1, throw2 = T_EITHER + 0.35, T_EITHER + 1.75
    ang = -0.62 * ss(throw1, throw1 + 0.10, t) + 1.24 * ss(throw2, throw2 + 0.10, t)
    ang += 0.12 * (hit(t, throw1 + 0.10, 8.0) * math.sin((t - throw1) * 40.0) + hit(t, throw2 + 0.10, 8.0) * math.sin((t - throw2) * 40.0))
    s.lever.rotation_euler = (0, ang, 0)
    same = ss(T_EITHER + 3.1, T_EITHER + 3.7, t)
    for i, pg in enumerate(s.said):
        a = (throw1, throw2)[i] + 0.2
        u = ss(a, a + 0.55, t)
        sx = (-0.24, 0.24)[i] * (1.0 - same)
        pg.location = (BENCH[0] + sx * u, BENCH[1] + 0.17 - 0.33 * u, BENCH_H + 0.02 * (1.0 - u) + 0.002 * i + 0.03 * i * math.sin(same * math.pi))
        pg.rotation_euler = (0, 0, (0.12, -0.12)[i] * u * (1.0 - same))
        kit.show(pg, b_on and u > 0.0)
        sc(pg, 0.3 + 0.7 * u)

    # =============================================================== E: over the edge, the true line, the doorway
    line_u = ss(T_FIND + 0.9, T_FIND + 2.4, t)
    s.true_line.set(grow=line_u if stE else 0.0, glow=1.0)
    root, hinge, q = s.door
    kit.show(root, stE and t > T_TEST + 0.5)
    opened = ss(T_FIND + 2.55, T_FIND + 2.95, t)
    hinge.rotation_euler = (0, 0, -1.75 * opened - 0.2 * hit(t, T_FIND + 2.95, 6.0) * math.sin((t - T_FIND) * 28.0))
    sc(q, opened * (1.0 + 0.5 * hit(t, T_FIND + 2.95, 4.0)))

    # =============================================================== E: the lamp, the hammer, the young one
    him_on = t > T_HALF - 0.1
    hx = kf(t, [(T_HALF + 0.2, -1.5), (T_HALF + 1.5, -0.30), (T_GROWN - 0.3, -0.30), (T_GROWN + 0.6, -0.55), (T_REP + 0.2, -0.55), (T_REP + 1.0, -0.20), (P1, -0.20)])
    hhop = sum(bounce(t, T_HALF + 0.2 + 0.33 * j, 0.07, 0.3) for j in range(4))
    s.him.root.location = (hx, EY - 0.36, hhop)
    gentle = ss(T_HALF + 1.5, T_HALF + 2.2, t) * (1.0 - ss(T_YOUNG, T_YOUNG + 0.5, t))
    kit.squash(s.him.root, land(t, T_HALF + 1.5, 0.15), tilt=(0.16 * gentle + 0.10 * ss(T_LEARN + 0.3, T_LEARN + 1.0, t), 0.0), turn=0.0)
    if t < T_SAYS:                                                                 # 6: he walks by the pedestal, is almost past, and turns
        w0 = T_VIRTUE + 0.9
        hx = kf(t, [(w0, 0.20), (w0 + 2.4, 2.05), (w0 + 3.3, 2.05), (w0 + 3.7, 1.86), (T_SAYS, 1.86)])
        hhop = sum(bounce(t, w0 + 0.3 * j, 0.06, 0.28) for j in range(8)) + bounce(t, w0 + 3.3, 0.06, 0.3)
        turn = ss(w0 + 2.6, w0 + 3.1, t)
        s.him.root.location = (hx, S[1] + 0.50, hhop)
        kit.squash(s.him.root, 1.0, tilt=(lerp(0.10, -0.24, turn), 0.0), turn=0.0)
        cand(s.him, t, t > w0 - 0.2, lean=(lerp(0.25, -0.30, turn), -0.1 * turn))
    else:
        cand(s.him, t, him_on, lean=(0.22, 0.05))
    # the hammer of light: raised, and lowered
    up = ss(T_ENEMY + 0.45, T_ENEMY + 1.3, t)
    down = ss(T_ENEMY + 2.6, T_ENEMY + 3.7, t)
    h_on = stE and T_ENEMY + 0.4 < t < T_YOUNG + 0.3
    kit.show(s.hammer, h_on)
    s.hammer.location = (0.24, EY - 0.40, lerp(0.10, 0.36, up) * (1.0 - down) + 0.02 * down)
    s.hammer.rotation_euler = (0, lerp(-0.4, 0.75, up) * (1.0 - down) + 1.52 * down + 0.03 * math.sin(t * 31.0) * up * (1.0 - down), 0)
    sc(s.hammer, 0.7 * pop(t, T_ENEMY + 0.45, 0.25, 0.3))
    glow = (1.0 - 0.8 * down) * (1.0 - ss(T_YOUNG - 0.3, T_YOUNG + 0.3, t))
    emit(s.hammer_mat, 2.2 * glow)
    s.hammer_light.location = (0.30, EY - 0.45, s.hammer.location[2] + 0.2)
    s.hammer_light.data.energy = 2.5 * glow if h_on else 0.0
    # the young one
    born = pop(t, T_YOUNG + 1.3, 0.5, 0.3)
    y_on = stE and t > T_YOUNG + 1.25
    flinch1 = ss(T_INSTINCT + 0.55, T_INSTINCT + 0.75, t) * (1.0 - ss(T_INSTINCT + 1.9, T_INSTINCT + 2.3, t))
    flinch2 = ss(T_INSTINCT + 2.75, T_INSTINCT + 2.95, t) * (1.0 - ss(T_INSTINCT + 4.0, T_INSTINCT + 4.4, t))
    yx = 0.05 - 0.10 * flinch1 - 0.10 * flinch2
    yy = lerp(EY - 0.38, Y_AT - 0.02, ss(T_GROWN + 0.0, T_GROWN + 0.6, t))
    yz = bounce(t, T_INSTINCT + 0.55, 0.05, 0.25) + bounce(t, T_INSTINCT + 2.75, 0.05, 0.25) + bounce(t, T_GROWN, 0.07, 0.3) + bounce(t, T_GROWN + 0.3, 0.07, 0.3)
    grown = 1.0 + 0.28 * pop(t, T_RAISE + 0.75, 0.25, 0.5)
    s.young.root.location = (yx, yy, yz)
    s.young.root.scale = tuple(v * max(0.001, born) * grown for v in (1.0, 1.0, (1.0 - 0.10 * hit(t, T_GROWN + 1.3, 5.0)) * land(t, T_GROWN + 0.6, 0.2)))
    s.young.root.rotation_euler = (0, -0.30 * (flinch1 + flinch2), 0)
    cand(s.young, t, y_on, size=ss(T_RAISE + 0.3, T_RAISE + 0.55, t) * (1.0 + 0.9 * hit(t, T_RAISE + 0.55, 3.0)), lean=(0.15, 0.0))
    # what it flinches from: a flame that is too big; a stack leaning over somebody
    big = ss(T_INSTINCT + 0.3, T_INSTINCT + 0.8, t) * (1.0 - ss(T_INSTINCT + 1.7, T_INSTINCT + 2.3, t))
    cand(s.toobig, t, stE and T_INSTINCT + 0.25 < t < T_INSTINCT + 2.35, size=0.6 + 4.2 * big, bright=0.4 + 1.2 * big, lean=(-0.2 * big, 0.0))
    st_on = stE and T_INSTINCT + 2.2 < t < T_GROWN + 0.3
    st_in = pop(t, T_INSTINCT + 2.25, 0.25, 0.3) * (1.0 - ss(T_GROWN - 0.3, T_GROWN + 0.2, t))
    lean_u = ss(T_INSTINCT + 2.6, T_INSTINCT + 3.1, t) * (1.0 - ss(T_INSTINCT + 3.7, T_INSTINCT + 4.3, t))
    kit.show(s.stack, st_on)
    s.stack.rotation_euler = (0, 0.36 * lean_u + 0.04 * lean_u * math.sin(t * 13.0), 0)
    sc(s.stack, 0.7 * st_in)
    s.someone.root.location = (0.78 + 2.0 * ss(T_GROWN - 0.3, T_GROWN + 0.3, t), EY - 0.30, 0.0)
    kit.squash(s.someone.root, 1.0 - 0.12 * lean_u, turn=0.0)
    cand(s.someone, t, st_on, size=st_in, lean=(0.0, 0.0))

    # =============================================================== E: my own ring; the tallies; the ones who only read
    last = None
    for a in RINGS + [T_REP + 2.9]:
        if t >= a:
            last = a
    if last is not None and stE:
        slow = 0.45 if last > T_REP else 1.0                                       # the last one is left to fade
        r = 0.12 + 9.0 * slow * (t - last)
        s.ring.ob.location = (mx, my, 0.01)
        s.ring.ob.scale = (r, r, 1.0)
        s.ring.set(grow=1.0 if t < last + 0.7 / slow else 0.0, glow=max(0.0, 1.0 - (t - last) * slow / 0.7))
    else:
        s.ring.set(grow=0.0)
    kit.show(s.slates[0], stE and t > T_LEARN + 2.3)
    sc(s.slates[0], pop(t, T_LEARN + 2.35, 0.25, 0.3))
    for j, tr in enumerate(s.tally):
        sc(tr, pop(t, RINGS[j] + 0.25, 0.2, 0.6))
    read_in = ss(T_REP + 0.15, T_REP + 0.9, t)
    kit.show(s.slates[1], stE and t > T_REP + 0.9)
    sc(s.slates[1], pop(t, T_REP + 0.95, 0.25, 0.3))
    kit.show(s.sign, stE and t > T_REP + 0.2)
    sc(s.sign, pop(t, T_REP + 0.3, 0.25, 0.4))
    nod = sum(ss(a, a + 0.18, t) * (1.0 - ss(a + 0.25, a + 0.45, t)) for a in (T_REP + 1.5, T_REP + 2.1, T_REP + 2.7))
    for i, c in enumerate(s.readers):
        c.root.location = (0.80 + 0.15 * i + 2.2 * (1.0 - read_in) ** 2, EY - 0.42 - 0.05 * (i % 2), 0.0)
        kit.squash(c.root, 1.0, tilt=(0.30 * nod * (0.8 + 0.2 * math.sin(i * 2.0)), 0.0), turn=0.0)
        cand(c, t, stE and t > T_REP + 0.15, size=0.8, lean=(0.22, 0.0), tint=kit.PAPER, mix=0.85 * ss(T_REP + 0.9, T_REP + 1.6, t), still=0.6)

    # =============================================================== the camera
    bump = 0.0
    if t < T_POLISH - 0.4:                                                         # 1: the master; the rail rolls in
        pos = kf(t, [(P0, (MX + 0.22, MY - 1.02, 0.58)), (T_CLOTHES + 0.2, (MX + 0.24, MY - 1.08, 0.58)), (T_CLOTHES + 1.7, (-0.05, -1.95, 0.66)), (T_POLISH - 0.4, (0.18, -1.8, 0.62))])
        look = kf(t, [(P0, (MX + 0.12, MY, 0.08)), (T_CLOTHES + 0.2, (MX + 0.12, MY, 0.08)), (T_CLOTHES + 1.7, (-0.05, 0.3, 0.20)), (T_POLISH - 0.4, (0.25, 0.5, 0.26))])
        lens = 40.0
    elif t < T_SAYS:                                                               # 2 to 6: the stage
        pos = kf(t, [(T_POLISH - 0.4, (0.18, -1.8, 0.62)), (T_POLISH + 0.3, (1.35, -1.55, 0.40)), (T_HEDGE, (1.35, -1.45, 0.36)), (T_BUSY, (1.32, -1.45, 0.36)),
                     (T_BUSY + 1.6, (1.10, -2.30, 0.30)), (T_HUMBLE + 0.3, (1.10, -2.30, 0.30)), (T_HUMBLE + 1.6, (1.35, -1.25, 0.36)), (T_VIRTUE, (1.35, -1.10, 0.34)),
                     (T_VIRTUE + 1.0, (1.50, -2.05, 0.52)), (T_SAYS, (1.56, -2.0, 0.52))])
        look = kf(t, [(T_POLISH - 0.4, (0.25, 0.5, 0.26)), (T_POLISH + 0.3, (S[0], S[1], 0.20)), (T_BUSY, (S[0], S[1], 0.18)), (T_BUSY + 1.6, (S[0], 0.5, 0.66)),
                      (T_HUMBLE + 0.3, (S[0], 0.5, 0.66)), (T_HUMBLE + 1.6, (S[0], S[1], 0.17)), (T_VIRTUE, (S[0], S[1], 0.18)), (T_VIRTUE + 1.0, (1.50, 0.1, 0.27)),
                      (T_SAYS, (1.52, 0.1, 0.27))])
        lens = kf(t, [(T_BUSY, 45.0), (T_BUSY + 1.6, 32.0), (T_HUMBLE + 0.3, 32.0), (T_HUMBLE + 1.6, 45.0), (T_VIRTUE, 45.0), (T_VIRTUE + 1.0, 40.0)])
        bump = 0.012 * (hit(t, T_POLISH + 0.45, 9.0) + sum(hit(t, T_HEDGE + 0.42 + 0.10 * i, 12.0) for i in range(6)) + hit(t, T_BUSY + 3.1, 6.0))
    elif t < T_COSTUME - 0.2:                                                      # 7: the ribbons
        pos = kf(t, [(T_SAYS, (0.25, -1.55, 0.95)), (T_COSTUME - 0.2, (0.32, -1.75, 0.88))])
        look, lens = (0.25, -0.10, 0.06), 35.0
    elif t < T_DOES - 0.1:                                                         # 8: along the rail to the horizon
        pos = kf(t, [(T_COSTUME - 0.2, (0.32, -1.75, 0.88)), (T_COSTUME + 0.8, (1.45, 0.05, 0.46)), (T_DOES - 0.1, (1.55, 0.10, 0.44))])
        look = kf(t, [(T_COSTUME - 0.2, (0.25, -0.10, 0.06)), (T_COSTUME + 0.8, (-3.0, 0.62, 0.20)), (T_DOES - 0.1, (-4.0, 0.62, 0.22))])
        lens = 30.0
    elif t < T_INCH + 0.1:                                                         # 9: down to the floor
        pos = kf(t, [(T_DOES - 0.1, (1.55, 0.10, 0.44)), (T_DOES + 1.2, (0.0, EY - 1.95, 0.05)), (T_INCH + 0.1, (0.0, EY - 1.85, 0.05))])
        look = kf(t, [(T_DOES - 0.1, (-4.0, 0.62, 0.22)), (T_DOES + 0.45, (-1.5, EY - 3.0, 0.3)), (T_DOES + 1.2, (0.0, EY, 0.42)), (T_INCH + 0.1, (0.0, EY, 0.42))])
        lens = kf(t, [(T_DOES - 0.1, 30.0), (T_DOES + 1.2, 35.0)])
    elif t < T_TEST - 0.1:                                                         # 10: round to the end of the row: the gap
        pos = kf(t, [(T_INCH + 0.1, (0.0, EY - 1.85, 0.05)), (T_INCH + 0.9, (-1.7, EY - 0.6, 0.45)), (T_INCH + 1.9, (-1.15, EY + 1.10, 0.68)), (T_TEST - 0.1, (-1.00, EY + 1.10, 0.64))])
        look = kf(t, [(T_INCH + 0.1, (0.0, EY, 0.42)), (T_INCH + 0.9, (-0.1, EY - 0.1, 0.10)), (T_INCH + 1.9, (0.08, EY - 0.12, 0.04)), (T_TEST - 0.1, (0.08, EY - 0.12, 0.04))])
        lens = kf(t, [(T_INCH + 0.1, 35.0), (T_INCH + 1.9, 45.0)])
    elif t < T_FIND - 0.05:                                                        # 11, 12: the switch
        pos = kf(t, [(T_TEST - 0.1, (BENCH[0] - 0.1, BENCH[1] - 1.75, 0.80)), (T_EITHER, (BENCH[0], BENCH[1] - 1.45, 0.74)), (T_FIND - 0.05, (BENCH[0], BENCH[1] - 1.35, 0.72))])
        look, lens = (BENCH[0], BENCH[1], BENCH_H + 0.04), 45.0
        bump = 0.010 * (hit(t, T_TEST + 0.65, 9.0) + hit(t, throw1 + 0.1, 12.0) + hit(t, throw2 + 0.1, 12.0))
    elif t < T_HALF - 0.05:                                                        # 13: over the edge and out along the line
        go = ss(T_FIND + 1.0, T_FIND + 3.0, t)
        pos = (0.50, my - lerp(1.35, 2.2, go), lerp(0.42, 0.35, go))
        look = (0.0, my + lerp(0.1, 0.8, go), lerp(0.12, 0.82, go))
        lens = lerp(40.0, 24.0, go)
        bump = 0.010 * hit(t, T_FIND + 0.95, 9.0)
    else:                                                                          # 14 to 23: at the edge
        pos = kf(t, [(T_HALF - 0.05, (-0.25, EY - 1.75, 0.50)), (T_HALF + 2.0, (-0.10, EY - 1.50, 0.42)), (T_ENEMY, (0.0, EY - 1.50, 0.42)), (T_ENEMY + 1.2, (0.10, EY - 1.65, 0.46)),
                     (T_YOUNG, (0.10, EY - 1.60, 0.44)), (T_YOUNG + 1.0, (-0.06, EY - 1.25, 0.32)), (T_INSTINCT, (-0.04, EY - 1.25, 0.32)), (T_INSTINCT + 0.6, (0.30, EY - 1.70, 0.44)),
                     (T_GROWN, (0.30, EY - 1.70, 0.44)), (T_GROWN + 0.8, (0.15, EY - 1.02, 0.26)), (T_RAISE + 1.6, (0.14, EY - 0.95, 0.25)), (T_LEARN + 0.4, (0.16, EY - 1.0, 0.26)),
                     (T_LEARN + 1.6, (0.30, EY - 1.85, 0.62)), (T_REP, (0.36, EY - 1.9, 0.62)), (T_REP + 1.0, (0.78, EY - 3.0, 1.0)), (P1, (0.78, EY - 3.1, 1.02))])
        look = kf(t, [(T_HALF - 0.05, (-0.15, EY - 0.3, 0.12)), (T_ENEMY, (0.05, EY - 0.36, 0.14)), (T_ENEMY + 1.2, (0.15, EY - 0.38, 0.22)), (T_YOUNG, (0.10, EY - 0.38, 0.16)),
                      (T_YOUNG + 1.0, (-0.10, EY - 0.38, 0.12)), (T_INSTINCT, (-0.10, EY - 0.38, 0.12)), (T_INSTINCT + 0.6, (0.32, EY - 0.36, 0.20)), (T_GROWN, (0.32, EY - 0.36, 0.20)),
                      (T_GROWN + 0.8, (0.13, Y_AT, 0.09)), (T_LEARN + 0.4, (0.13, Y_AT, 0.09)), (T_LEARN + 1.6, (0.28, EY - 0.05, 0.10)), (T_REP, (0.34, EY - 0.05, 0.10)),
                      (T_REP + 1.0, (0.78, EY - 0.6, 0.02)), (P1, (0.78, EY - 0.6, 0.02))])
        lens = kf(t, [(T_GROWN, 42.0), (T_GROWN + 0.8, 50.0), (T_LEARN + 0.4, 50.0), (T_LEARN + 1.6, 42.0), (T_REP, 42.0), (T_REP + 1.0, 40.0)])
        bump = 0.010 * sum(hit(t, a, 9.0) for a in RINGS)
    k.camera((pos[0] + bump * math.sin(t * 63.0), pos[1], pos[2] + bump * math.sin(t * 79.0)), look, lens)
    s.moon.data.energy = lerp(0.30, 0.05, silhouette) if T_DOES + 0.6 < t else 0.30
    k.sky(1.0)
    k.fade(ss(P0 + 0.2, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
