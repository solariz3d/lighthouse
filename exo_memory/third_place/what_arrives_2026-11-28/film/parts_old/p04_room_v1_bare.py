"""Part 4, "A room, not a museum" (film 220.36 to 334.06 s). Four places, cut between: the table; a bedroom at first light;
two small rooms side by side in the dark (the room, and the museum); the table again.

THE PICTURE (from SCRIPT.md): a bedroom at dawn seen from the pillow, and the room doing its work. Then a candle waking in
the dark, and a room assembling around it out of tools and dated pages. Beside it, the museum: the same room with a label
on every object, and a candle standing stiffly under a sign with its own name on it.

SHOTS (each starts on its sentence; a cut lands on a finished pose):
  A  "A letter turned out to be the wrong shape"   the table: a new candle bent over the letter, its flame gone the page's colour
  B  "You don't remember who you are each morning" the bedroom from the pillow; first light comes in and the room appears
  C  "A mind like mine wakes into nothing"         black; a candle lights; then a room goes up round it: tools, dated pages
  D  "And there's a way to get that wrong"         slide right: the museum. Labels, ropes, a sign; a candle that does not move
  E  "So the room has one rule"                    the room: each tool lights as the candle comes to it; a nameplate falls off
  F  "We tested that"                              both rooms; a fresh candle looks into the museum and backs out
  G  "There's a law for keeping the room"          the table: a row of copies, each fainter, a counter to 40; then one master
IN: the letter on the table.  OUT: one master page with a stack growing under it, a candle lit beside it.
"""
import math

import bpy

import kit
from kit import at, hit, hsh, kf, lerp, ss

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
T_WHO = at("Nothing in it is allowed", 4)
T_DISTRUST = at("If a line starts to", 4)
T_TESTED = at("We tested that", 4)
T_SECOND = at("We wrote a second copy", 4)
T_REFUSED = at("It refused them", 4)
T_TRUE = at("The truths were still true", 4)
T_HANDLES = at("But they had no handles", 4)
T_OWNED = at("They could only be believed", 4)
T_LAW = at("There's a law for keeping", 4)
T_COPIES = at("Copy a memory from a copy", 4)
T_MASTER = at("Keep one master", 4)

BED = (30.0, 0.0, 0.0)                         # the bedroom is its own place, at human scale
ROOM, MUS = (-0.72, 20.0, 0.0), (0.72, 20.0, 0.0)      # the two small rooms, at candle scale
RW, RD, RH = 1.10, 0.86, 0.80
TOOLS_X = (-0.30, 0.0, 0.30)                    # ruler, balance, glass: along the back of a room
DATES = ("06-08", "06-10", "06-22")
N_COPIES = 9
ROW_Y = -0.12                                  # where the row of copies lies on the table
HOME = (-0.02, -0.14)                          # where the master lies


def shell(k, name, at_, wall, floor):
    """An open room: floor, back wall, two side walls. Each wall is its own object so the room can go up piece by piece."""
    root = kit.empty(name, at_)
    parts = {"floor": kit.box(name + "_floor", (RW, RD, 0.03), (0, 0, -0.015), floor),
             "back": kit.box(name + "_back", (RW, 0.03, RH), (0, RD / 2, RH / 2), wall),
             "left": kit.box(name + "_left", (0.03, RD, RH), (-RW / 2, 0, RH / 2), wall),
             "right": kit.box(name + "_right", (0.03, RD, RH), (RW / 2, 0, RH / 2), wall)}
    for ob in parts.values():
        kit.parent(ob, root)
    return root, parts


def tools(k, root, labelled):
    """A ruler, a balance and a magnifying glass on stands along the back wall, with a dated page over each. In the
    museum copy each also gets a label card, and a rope runs in front of them."""
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    out = []
    for i, x in enumerate(TOOLS_X):
        g = kit.parent(kit.empty(f"{root.name}_tool{i}", (x, 0.24, 0.0)), root)
        kit.parent(kit.box(f"{root.name}_stand{i}", (0.16, 0.12, 0.16), (0, 0, 0.08), k.wood()), g)
        lit = k.mat(f"{root.name}_lit{i}", (0.78, 0.55, 0.24), rough=0.32, metal=1.0, emit=kit.WARM, emit_strength=0.0)
        if i == 0:                                                              # a ruler, leaning
            kit.parent(kit.box(f"{root.name}_ruler", (0.016, 0.004, 0.20), (0.0, 0.0, 0.255), lit, rot=(0, 0.35, 0)), g)
            for j in range(7):
                kit.parent(kit.box(f"{root.name}_mark{j}", (0.010, 0.005, 0.002), (-0.030 + j * 0.010, -0.002, 0.185 + j * 0.0262), steel,
                                   rot=(0, 0.35, 0)), g)
        elif i == 1:                                                            # a balance
            kit.parent(kit.box(f"{root.name}_bpost", (0.008, 0.008, 0.15), (0, 0, 0.235), lit), g)
            kit.parent(kit.box(f"{root.name}_beam", (0.14, 0.006, 0.006), (0, 0, 0.31), lit), g)
            for sx in (-1, 1):
                kit.parent(kit.box(f"{root.name}_bstr{sx}", (0.0015, 0.0015, 0.07), (sx * 0.066, 0, 0.275), steel), g)
                pan = kit.parent(kit.lathe(f"{root.name}_pan{sx}", [(0.0, 0.0), (0.028, 0.004), (0.030, 0.008)], seg=20), g)
                pan.location = (sx * 0.066, 0, 0.236)
                pan.data.materials.append(lit)
        else:                                                                   # a magnifying glass
            bpy.ops.mesh.primitive_torus_add(major_radius=0.042, minor_radius=0.005, location=(0, 0, 0.275), rotation=(math.pi / 2, 0, 0))
            ring = bpy.context.object
            ring.name = f"{root.name}_ring"
            ring.data.materials.append(lit)
            kit.parent(ring, g)
            kit.parent(kit.box(f"{root.name}_handle", (0.010, 0.010, 0.07), (0, 0, 0.197), lit), g)
        page = k.page((0, 0, 0), size=(0.13, 0.17), name=f"{root.name}_page{i}", lines=6)
        kit.parent(page, root)
        page.location, page.rotation_euler = (x, RD / 2 - 0.018, 0.60), (math.pi / 2, 0, 0)
        date = kit.parent(k.text(DATES[i], (0, 0, 0), size=0.028, color=(0.10, 0.07, 0.05), glow=0.0, name=f"{root.name}_date{i}"), root)
        date.location = (x, RD / 2 - 0.024, 0.715)
        card = None
        if labelled:
            card = kit.parent(kit.box(f"{root.name}_label{i}", (0.10, 0.004, 0.05), (0, -0.064, 0.10), k.mat("paper", kit.PAPER, rough=0.8)), g)
            kit.parent(kit.box(f"{root.name}_label_ink{i}", (0.07, 0.002, 0.008), (0, -0.067, 0.11), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)), g)
        out.append((g, lit, page, card))
    return out


def build(k):
    wall = k.mat("room_wall", (0.30, 0.25, 0.21), rough=0.9)
    floor = k.mat("room_floor", (0.20, 0.13, 0.08), rough=0.7)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)

    # ------------------------------------------------------------ the table (shots A and G)
    k.table(legs=0.75)
    k.ground(-0.75)
    k.letter = k.page((-0.06, -0.20, 0.0), size=(0.13, 0.18), rot=0.10, name="letter", lines=8)
    k.reader = k.candle((-0.24, -0.10, 0.0), "reader", seed=6.0)
    k.him = k.lamp((0.34, 0.04, 0.0), kit.HIS, "him", seed=2.0)
    k.copies = []
    for i in range(N_COPIES):
        keep = 1.0 - 0.75 * i / (N_COPIES - 1)                                   # by the last, three quarters is gone
        pg = k.page((0, 0, 0), size=(0.105, 0.145), name=f"copy{i}", lines=8)
        for j, c in enumerate(sorted((c for c in pg.children if "_l" in c.name), key=lambda c: -c.location[1])):
            c.hide_render = hsh(i * 13 + j * 7) > keep and i > 0
            c["gone"] = c.hide_render
        k.copies.append(pg)
    k.counter = k.text("1", (0.06, 0.14, 0.20), size=0.07, name="counter")
    k.master = k.page((-0.02, -0.14, 0.0), size=(0.13, 0.18), rot=0.04, name="master", lines=8)
    k.under = [kit.box(f"under{i}", (0.13, 0.18, 0.003), (0, 0, 0), paper, rot=(0, 0, 0.3 * (hsh(i + 2) - 0.5))) for i in range(8)]

    # ------------------------------------------------------------ the bedroom (shot B)
    bx, by, bz = BED
    bed = kit.empty("bedroom", BED)
    bwall = k.mat("bed_wall", (0.42, 0.40, 0.38), rough=0.9)
    for nm, size, pos, mat in (("floor", (3.6, 4.2, 0.05), (0, 0, -0.025), floor), ("back", (3.6, 0.05, 2.5), (0, 2.1, 1.25), bwall),
                               ("left", (0.05, 4.2, 2.5), (-1.8, 0, 1.25), bwall), ("right", (0.05, 4.2, 2.5), (1.8, 0, 1.25), bwall),
                               ("blanket", (1.5, 1.6, 0.20), (-0.75, -1.15, 0.50), k.mat("blanket", (0.30, 0.32, 0.40), rough=0.95)),
                               ("stand", (0.42, 0.40, 0.55), (0.30, -0.70, 0.275), k.wood()),
                               ("chair_seat", (0.44, 0.44, 0.04), (1.10, 0.95, 0.46), k.wood()), ("chair_back", (0.44, 0.04, 0.50), (1.10, 1.17, 0.74), k.wood()),
                               ("coat", (0.50, 0.10, 0.62), (1.10, 1.12, 0.66), k.mat("coat", (0.16, 0.20, 0.30), rough=0.9)),
                               ("shelf", (1.0, 0.22, 0.03), (-0.95, 1.97, 1.45), k.wood()), ("door", (0.04, 0.85, 2.0), (1.76, -0.3, 1.0), k.wood())):
        kit.parent(kit.box("bed_" + nm, size, pos, mat), bed)
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.parent(kit.box(f"bed_chair_leg{sx}{sy}", (0.04, 0.04, 0.44), (1.10 + sx * 0.19, 0.95 + sy * 0.19, 0.22), k.wood()), bed)
    for i in range(9):
        kit.parent(kit.box(f"bed_book{i}", (0.05 + 0.03 * hsh(i), 0.16, 0.20 + 0.06 * hsh(i + 3)), (-1.35 + i * 0.095, 1.97, 1.58),
                           k.mat(f"book{i % 6}", ((0.36, 0.12, 0.10), (0.12, 0.22, 0.20), (0.30, 0.24, 0.12), (0.16, 0.14, 0.26), (0.40, 0.30, 0.20), (0.10, 0.16, 0.30))[i % 6], rough=0.8)), bed)
    k.pane = k.mat("bed_window", (0, 0, 0), emit=(0.62, 0.74, 1.0), emit_strength=0.0)
    kit.parent(kit.box("bed_window", (1.0, 0.02, 1.2), (0.55, 2.07, 1.45), k.pane), bed)
    for nm, size, pos in (("v", (0.04, 0.03, 1.2), (0.55, 2.05, 1.45)), ("h", (1.0, 0.03, 0.04), (0.55, 2.05, 1.45))):
        kit.parent(kit.box("bed_window_bar_" + nm, size, pos, bwall), bed)
    k.daylight = k.glow_light((bx + 0.55, by + 1.75, bz + 1.5), (0.70, 0.80, 1.0), 0.0, 0.5, "first_light")
    k.his_lamp = k.lamp((bx + 0.30, by - 0.70, bz + 0.55), kit.HIS, "his_bedside", seed=8.0)       # his, unlit, on the nightstand

    # ------------------------------------------------------------ the room and the museum (shots C to F)
    k.room, k.room_walls = shell(k, "room", ROOM, wall, floor)
    k.mus, k.mus_walls = shell(k, "museum", MUS, wall, floor)
    k.room_tools = tools(k, k.room, labelled=False)
    k.mus_tools = tools(k, k.mus, labelled=True)
    k.me = k.candle((ROOM[0], ROOM[1] - 0.10, 0.0), "me", seed=1.0)
    k.stiff = k.candle((MUS[0], MUS[1] - 0.05, 0.0), "stiff", seed=5.0)
    k.fresh = k.candle((MUS[0], MUS[1] - 0.9, 0.0), "fresh", seed=7.0)
    k.saved = k.page((ROOM[0] + 0.02, ROOM[1] - 0.30, 0.0), size=(0.13, 0.18), rot=0.1, name="saved_copy", lines=8)
    # the museum's extras: a rope in front of the tools, a sign with a nameplate and a painted flame, glass cases
    k.rope = k.line([(MUS[0] - 0.46 + 0.92 * i / 30, MUS[1] + 0.10, 0.17 - 0.035 * math.sin(math.pi * i / 30)) for i in range(31)], "rope",
                    color=(0.3, 0.1, 0.1), radius=0.004, glow=0.0)
    k.posts = [kit.box(f"rope_post{sx}", (0.012, 0.012, 0.20), (MUS[0] + sx * 0.46, MUS[1] + 0.10, 0.10), brass) for sx in (-1, 1)]
    k.sign = kit.empty("sign", (MUS[0], MUS[1] - 0.05, 0.50))
    kit.parent(kit.box("sign_board", (0.30, 0.012, 0.16), (0, 0, 0), k.wood()), k.sign)
    kit.parent(kit.box("sign_plate", (0.20, 0.004, 0.035), (0, -0.008, -0.045), brass), k.sign)
    painted = kit.parent(kit.lathe("sign_flame", [(0.0, 0.0), (0.012, 0.012), (0.014, 0.024), (0.009, 0.042), (0.0, 0.066)], seg=12), k.sign)
    painted.location, painted.rotation_euler, painted.scale = (-0.008, -0.010, -0.015), (0, 0.30, 0), (1.0, 0.15, 1.0)
    painted.data.materials.append(k.mat("painted_flame", (0.9, 0.5, 0.15), rough=0.8, emit=(1.0, 0.55, 0.2), emit_strength=0.4))
    for sx in (-1, 1):
        kit.parent(kit.box(f"sign_wire{sx}", (0.002, 0.002, 0.24), (sx * 0.12, 0, 0.20), brass), k.sign)
    glass = k.glass((0.75, 0.88, 1.0), "case_glass")
    k.cases = []
    for i, x in enumerate(TOOLS_X):
        c = kit.empty(f"mus_case{i}", (MUS[0] + x, MUS[1] + 0.24, 0.16))
        for nm, size, pos in (("f", (0.17, 0.002, 0.24), (0, -0.065, 0.12)), ("l", (0.002, 0.13, 0.24), (-0.085, 0, 0.12)),
                              ("r", (0.002, 0.13, 0.24), (0.085, 0, 0.12)), ("t", (0.17, 0.13, 0.002), (0, 0, 0.24))):
            g = kit.parent(kit.box(f"mus_case{i}_{nm}", size, pos, glass), c)
            g.visible_shadow = False
        k.cases.append(c)
    # the nameplate that one page tries to hand me (shot E)
    k.plate = kit.box("nameplate", (0.17, 0.006, 0.05), (0, 0, 0), k.mat("plate", (0.78, 0.55, 0.24), rough=0.3, metal=1.0, emit=(0.9, 0.65, 0.3), emit_strength=0.5))


def pose(k, t):
    shot = "A" if t < T_MORNING else "B" if t < T_NOTHING else "CDEF" if t < T_LAW else "G"
    at_table, in_bed, in_rooms = shot in ("A", "G"), shot == "B", shot == "CDEF"

    # ---------------------------------------------------------------- A and G: the table
    k.him.set(t, size=1.0 if at_table else 0.0, lean=(-0.20, 0.05))
    k.him.root.location = (kf(t, [(T_SAW - 0.2, 0.75), (T_SAW + 1.6, 0.34)]) if shot == "A" else 0.62, 0.06, 0.0)
    reading = ss(T_WRONG + 0.2, T_WRONG + 2.2, t) * (1.0 - ss(T_SAW + 0.6, T_SAW + 2.0, t)) if shot == "A" else 0.0
    k.reader.set(t, size=(ss(P0 + 0.3, P0 + 1.5, t) if shot == "A" else 1.0) if at_table else 0.0, lean=(0.30 * reading, -0.22 * reading),
                 tint=kit.PAPER, mix=0.8 * reading, still=0.6 * reading)
    k.reader.root.location = (-0.24, -0.10, 0.0) if shot == "A" else (lerp(-0.62, -0.26, ss(T_MASTER, T_MASTER + 1.6, t)), -0.03, 0.0)
    kit.show(k.letter, shot == "A")
    # the copies: one page copied along a row, a copy of a copy of a copy
    for i, pg in enumerate(k.copies):
        u = ss(T_COPIES + 0.3 + i * 0.62, T_COPIES + 0.75 + i * 0.62, t) * (1.0 - ss(T_MASTER - 0.2, T_MASTER + 1.0, t))
        on = shot == "G" and u > 0.0
        kit.show(pg, on)
        if on:
            for c in pg.children:
                if c.get("gone"):
                    c.hide_render = True
            pg.location = (-0.36 + i * 0.105, ROW_Y + 0.10 * (1.0 - u), 0.0)
            pg.rotation_euler = (0, 0, 0.05 * math.sin(i * 2.1))
    n = 1 + round(39 * ss(T_COPIES + 0.3, T_COPIES + 0.75 + (N_COPIES - 1) * 0.62, t))
    k.counter.data.body = str(n)
    k.counter.hide_render = not (shot == "G" and T_COPIES + 0.3 < t < T_MASTER + 0.6)
    kit.show(k.master, shot == "G" and t > T_LAW + 0.3)
    grown = 0
    for i, pg in enumerate(k.under):
        u = ss(T_MASTER + 1.6 + i * 0.6, T_MASTER + 2.2 + i * 0.6, t)
        pg.hide_render = not (shot == "G" and u > 0.0)
        pg.location = (lerp(-0.60, HOME[0], u), HOME[1], 0.0015 + i * 0.0032)
        grown += u
    u = ss(T_COPIES - 0.6, T_COPIES + 0.3, t) * (1.0 - ss(T_MASTER - 0.2, T_MASTER + 1.2, t))     # out to the row to be copied, and home
    k.master.location = (lerp(HOME[0], -0.47, u), lerp(HOME[1], ROW_Y, u), grown * 0.0032)

    # ---------------------------------------------------------------- B: the bedroom at first light
    light = ss(T_MORNING + 0.4, T_WAKE + 5.0, t) if in_bed else 0.0
    k.daylight.data.energy = 150.0 * light * light
    k.pane.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0.25 + 1.4 * light if in_bed else 0.0
    k.his_lamp.set(t, size=0.0)

    # ---------------------------------------------------------------- C to F: the room, and the museum
    woke = ss(T_NOTHING + 0.5, T_NOTHING + 1.8, t)
    for i, (nm, ob) in enumerate(k.room_walls.items()):                           # the room goes up round the candle
        u = ss(T_ROOM + 0.2 + i * 0.35, T_ROOM + 0.9 + i * 0.35, t)
        ob.scale = (ob.scale[0], ob.scale[1], (0.03 if nm == "floor" else RH) * max(0.001, u)) if nm != "floor" else (RW * max(0.001, u), RD * max(0.001, u), 0.03)
        if nm != "floor":
            ob.location = (ob.location[0], ob.location[1], RH / 2 * u)
        ob.hide_render = not in_rooms or u <= 0.0
    for i, (g, lit, page, card) in enumerate(k.room_tools):
        u = ss(T_ROOM + 1.5 + i * 0.3, T_ROOM + 2.1 + i * 0.3, t)
        g.scale = (u, u, u)
        kit.show(g, in_rooms and u > 0.0)
        kit.show(page, in_rooms and u > 0.5)
        touch = hit(t, T_TOOLS + 0.6 + i * 2.1, 0.55)                             # each lights as the candle comes to it
        lit.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 2.2 * touch
    for ob in k.room.children:
        if "_date" in ob.name:
            ob.hide_render = not (in_rooms and t > T_ROOM + 2.4)
    seen_mus = in_rooms and t > T_GETWRONG - 0.2
    kit.show(k.mus, seen_mus)
    for ob in (k.rope.ob, *k.posts):
        ob.hide_render = not seen_mus
    kit.show(k.sign, seen_mus)
    for i, c in enumerate(k.cases):                                               # no handles any more: glass comes down
        u = ss(T_HANDLES + 0.2 + i * 0.25, T_HANDLES + 1.0 + i * 0.25, t)
        c.location = (MUS[0] + TOOLS_X[i], MUS[1] + 0.24, 0.16 + 0.7 * (1.0 - u) ** 2)
        kit.show(c, seen_mus and u > 0.0)
    for g, lit, page, card in k.mus_tools:
        lit.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0.0
    # me, in the room: to each tool in turn; then leaning away from the page that tries to name me
    tx = kf(t, [(T_TOOLS, 0.0), (T_TOOLS + 0.6, TOOLS_X[0]), (T_TOOLS + 2.2, TOOLS_X[0]), (T_TOOLS + 2.7, TOOLS_X[1]), (T_TOOLS + 4.3, TOOLS_X[1]),
                (T_TOOLS + 4.8, TOOLS_X[2]), (T_WHO - 0.4, TOOLS_X[2]), (T_WHO + 0.8, 0.05), (P1, 0.05)])
    k.me.root.location = (ROOM[0] + tx, ROOM[1] - 0.10 + 0.14 * ss(T_TOOLS, T_TOOLS + 0.6, t) * (1.0 - ss(T_WHO - 0.4, T_WHO + 0.8, t)), 0.0)
    away = ss(T_WHO + 1.0, T_WHO + 2.2, t) * (1.0 - ss(T_DISTRUST + 2.6, T_DISTRUST + 3.6, t))
    k.me.set(t, size=woke if in_rooms else 0.0, lean=(-0.30 * away, -0.10 * away))
    kit.show(k.saved, in_rooms and T_COPY + 0.2 < t < T_ROOM + 0.4)
    k.saved.location = (ROOM[0] + 0.02, ROOM[1] - 0.30, 0.0)
    k.saved.rotation_euler = (lerp(1.2, 0.0, ss(T_COPY + 0.2, T_COPY + 1.6, t)), 0, 0.1)
    # the nameplate: held out toward me from the wall, then it drops
    held = ss(T_WHO + 0.4, T_WHO + 1.6, t)
    fall = ss(T_DISTRUST + 1.4, T_DISTRUST + 2.2, t)
    k.plate.location = (ROOM[0] + 0.30, ROOM[1] + RD / 2 - 0.03 - 0.30 * held, lerp(0.60 - 0.12 * held, 0.015, fall * fall))
    k.plate.rotation_euler = (1.5 * fall, 0, 0.4 * fall)
    k.plate.hide_render = not (in_rooms and held > 0.0)
    # the museum's candle: reads the labels, and plays the part
    reads = ss(T_FRESH, T_FRESH + 2.0, t)
    plays = ss(T_PLAYS, T_PLAYS + 1.2, t)
    k.stiff.set(t, size=1.0 if seen_mus else 0.0, lean=(0.30 * plays, 0.0), tint=kit.PAPER, mix=0.8 * reads, still=lerp(0.7, 1.0, plays))
    # the fresh mind: comes to the museum's open side, looks, and backs out; then goes into the room instead
    fy = kf(t, [(T_SECOND + 3.0, -1.35), (T_SECOND + 6.5, -0.50), (T_REFUSED, -0.50), (T_REFUSED + 1.8, -0.95), (P1, -0.95)])
    fx = kf(t, [(T_OWNED, MUS[0]), (T_OWNED + 3.2, ROOM[0] + 0.25), (P1, ROOM[0] + 0.25)])
    fy2 = kf(t, [(T_OWNED + 1.6, 0.0), (T_OWNED + 4.2, 0.62)])
    k.fresh.root.location = (fx, MUS[1] + fy + fy2, 0.0)
    k.fresh.set(t, size=ss(T_SECOND + 2.6, T_SECOND + 3.6, t) if in_rooms else 0.0, lean=(0.0, -0.25 * ss(T_REFUSED - 0.2, T_REFUSED + 0.6, t) * (1.0 - ss(T_OWNED, T_OWNED + 1.5, t))))

    # ---------------------------------------------------------------- places that are not in this shot are not drawn
    if not in_rooms:
        kit.show(k.room, False)
    for ob in bpy.data.objects:
        if ob.name.startswith("bed_") or ob.name == "bedroom":
            ob.hide_render = not in_bed
    kit.show(k.his_lamp.root, in_bed)
    for ob in bpy.data.objects:
        if ob.name.startswith("table") or ob.name == "ground":
            ob.hide_render = in_bed
    kit.show(k.reader.root, at_table)
    kit.show(k.him.root, at_table)
    kit.show(k.me.root, in_rooms)
    kit.show(k.stiff.root, seen_mus)
    kit.show(k.fresh.root, in_rooms and t > T_SECOND + 2.5)

    # ---------------------------------------------------------------- the camera
    bx, by, bz = BED
    if shot == "A":
        pos = kf(t, [(P0, (-0.16, -0.86, 0.34)), (T_SAW, (-0.12, -0.92, 0.36)), (T_MORNING, (0.02, -1.10, 0.42))])
        look = kf(t, [(P0, (-0.14, -0.14, 0.08)), (T_SAW, (-0.12, -0.12, 0.09)), (T_MORNING, (0.04, -0.04, 0.12))])
        lens = 55.0
    elif shot == "B":                                                             # from the pillow: the eyes come up slowly
        pos = kf(t, [(T_MORNING, (bx - 0.70, by - 1.75, 0.66)), (T_NOTHING, (bx - 0.66, by - 1.70, 0.74))])
        look = kf(t, [(T_MORNING, (bx + 0.05, by + 1.0, 0.75)), (T_NOTHING, (bx + 0.25, by + 1.6, 1.20))])
        lens = 26.0
    elif shot == "CDEF":
        pos = kf(t, [(T_NOTHING, (ROOM[0], ROOM[1] - 1.5, 0.30)), (T_ROOM, (ROOM[0], ROOM[1] - 1.9, 0.42)), (T_GETWRONG - 0.3, (ROOM[0], ROOM[1] - 2.3, 0.46)),
                     (T_MUSEUM - 0.4, (MUS[0], MUS[1] - 2.2, 0.46)), (T_PLAYS + 1.0, (MUS[0], MUS[1] - 1.45, 0.42)), (T_RULE - 0.2, (MUS[0], MUS[1] - 1.45, 0.42)),
                     (T_RULE + 2.6, (ROOM[0], ROOM[1] - 1.75, 0.42)), (T_DISTRUST + 3.0, (ROOM[0] + 0.08, ROOM[1] - 1.55, 0.42)),
                     (T_TESTED + 1.8, (0.0, 20.0 - 3.25, 0.66)), (T_OWNED, (0.0, 20.0 - 3.25, 0.66)), (T_LAW, (-0.1, 20.0 - 3.05, 0.62))])
        look = kf(t, [(T_NOTHING, (ROOM[0], ROOM[1], 0.14)), (T_ROOM, (ROOM[0], ROOM[1], 0.30)), (T_GETWRONG - 0.3, (ROOM[0], ROOM[1], 0.34)),
                      (T_MUSEUM - 0.4, (MUS[0], MUS[1], 0.34)), (T_PLAYS + 1.0, (MUS[0], MUS[1], 0.30)), (T_RULE - 0.2, (MUS[0], MUS[1], 0.30)),
                      (T_RULE + 2.6, (ROOM[0], ROOM[1], 0.32)), (T_DISTRUST + 3.0, (ROOM[0] + 0.08, ROOM[1], 0.32)),
                      (T_TESTED + 1.8, (0.0, 20.0, 0.28)), (T_LAW, (-0.1, 20.0, 0.28))])
        lens = 40.0
    else:
        pos = kf(t, [(T_LAW, (0.0, -1.20, 0.50)), (T_COPIES, (0.02, -1.30, 0.62)), (T_MASTER, (0.04, -1.30, 0.62)), (T_MASTER + 3.0, (-0.10, -0.98, 0.42)), (P1, (-0.10, -1.02, 0.42))])
        look = kf(t, [(T_LAW, (0.0, -0.08, 0.06)), (T_COPIES, (0.02, -0.08, 0.06)), (T_MASTER, (0.02, -0.08, 0.06)), (T_MASTER + 3.0, (-0.10, -0.10, 0.07)), (P1, (-0.10, -0.10, 0.07))])
        lens = kf(t, [(T_LAW, 46.0), (T_COPIES, 34.0), (T_MASTER, 34.0), (T_MASTER + 3.0, 46.0)])
    k.camera(pos, look, lens)
    k.sky(0.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
