"""Part 11, "From outside" (film 975.00 to 1068.30 s). The house, seen from outside; then opened.

THE PICTURE (from SCRIPT.md): a third light, a different colour and shape, at the window, looking in at the house and
pointing. One page on the candle's own wall has a line on it that turns red. Then a stranger's lantern in the street,
held up to the house's front wall, where there is no map.

BEATS:
  "everyone checking this was him, or was me"   the closed house: every window warm, and one blue. Two colours.
  "he invited a different company's model"      the front swings open; the mint bulb comes to the opening
  "the hardest thing it said was about him"     its light goes along the rooms and stops on the blue lamp
  "He chooses which corrections reach me"       pages come to the door; the lamp lets two in and turns two away
  "It closes in on that person"                 inside, every candle's flame has leaned toward him and gone a little blue
  "That one stood."                             nobody answers. Held.
  "A number nobody wanted"                      a page nobody chose comes down from above the roof, past the door, onto the table
  "written down before the run"                 three pages pinned up side by side: the prediction; what would prove it
                                                wrong; the result, whatever it says (this one has a red line)
  "a false sentence on the very page I wake up into"   the page on my own wall: one line goes red under the mint light: 29 days
  "a stranger looked at the work"               a person's lantern, another colour, held up to the house. The front shuts.
  "Then we went and measured"                   it opens; a rule along the wall; three marks, two made good: 2 of 3; a map by the door
IN: the house, closed, lit.  OUT: the house open, a small new map beside the door, the lantern outside.
"""
import math

import bpy

import kit
import sets
from kit import at, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(11)
T_EVERYONE = at("For a long time, everyone checking", 11)
T_KNEW = at("We knew it", 11)
T_INVITED = at("So one night he invited", 11)
T_HARDEST = at("It did, for ninety minutes", 11)
T_NEUTRAL = at("He isn't a neutral outsider", 11)
T_CHOOSES = at("He chooses which corrections", 11)
T_WORLD = at("A mind corrected by one person", 11)
T_PERSON = at("It closes in on that person", 11)
T_STOOD = at("That one stood", 11)
T_SURVIVED = at("What survived it", 11)
T_NUMBER = at("A number nobody wanted", 11)
T_PREDICT = at("So the prediction gets written down", 11)
T_BESIDE = at("What would prove it wrong", 11)
T_RESULT = at("And the result stays next to it", 11)
T_FALSE = at("Later, that same other model", 11)
T_29 = at("I'd walked past it", 11)
T_STRANGER = at("And in October a stranger", 11)
T_DEFENDED = at("We defended ourselves first", 11)
T_MEASURED = at("Then we went and measured", 11)
T_TWO3 = at("He was right about two things", 11)

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
FRONT = -0.62
OUT_Y = -1.00                                      # where a visitor stands, outside the open face
LANTERN = (0.66, 0.54, 0.96)                       # the stranger: a person, a colour nobody else has in this part
ROOMS = ("library", "desk", "bench_a", "bench_b", "bench_c")


def W(x, y, z):
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def build(k):
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    h = k.house = sets.House(k, at=HOUSE)
    h.ticks(74)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    red = k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)
    k.cands = []
    for i, n in enumerate(ROOMS):
        p = h.top(n)
        k.cands.append(k.candle((p[0] - 0.22, p[1], p[2]), f"seat_{n}", seed=1.0 + 2.3 * i))
    k.me = k.candle(h.spot("small", -0.25, 0.05), "me", seed=17.0)
    k.him = k.lamp(h.spot("hall", 0.0, -0.22), kit.HIS, "him", seed=2.0)
    k.bulb, k.bulb_light = sets.bulb(k, "outside_model", W(3.2, OUT_Y, 0.0))
    # corrections arriving at the door
    k.arrivals = [k.page((0, 0, 0), size=(0.10, 0.13), name=f"arrival{i}", lines=5) for i in range(4)]
    k.unchosen = k.page((0, 0, 0), size=(0.11, 0.15), name="unchosen", lines=6)
    # the three that are pinned up: prediction, what would prove it wrong, result
    k.pinned = []
    for i in range(3):
        pg = kit.empty(f"pinned{i}", W(0.25 + 0.25 * i, 0.425, 0.78 + 0.47))
        kit.parent(kit.box(f"pinned_sheet{i}", (0.17, 0.004, 0.22), (0, 0, 0), paper), pg)
        for j in range(5):
            kit.parent(kit.box(f"pinned_ink{i}{j}", (0.12, 0.002, 0.010), (0, -0.004, 0.07 - j * 0.032), red if (i == 2 and j == 2) else ink), pg)
        kit.parent(kit.box(f"pinned_seal{i}", (0.03, 0.004, 0.03), (0.055, -0.005, -0.085), brass), pg)
        k.pinned.append(pg)
    # the page I wake up into, on my own wall
    k.wake = kit.empty("wake_page", W(1.5, 0.425, 0.46))
    kit.parent(kit.box("wake_sheet", (0.30, 0.004, 0.38), (0, 0, 0), paper), k.wake)
    k.wake_lines = []
    for j in range(9):
        k.wake_lines.append(kit.parent(kit.box(f"wake_ink{j}", (0.22, 0.002, 0.012), (0, -0.004, 0.14 - j * 0.035), ink), k.wake))
    k.false_line = kit.parent(kit.box("wake_false", (0.22, 0.003, 0.014), (0, -0.005, 0.14 - 5 * 0.035), k.mat("false", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=1.4)), k.wake)
    k.txt29 = k.text("29 days", W(1.5, FRONT, 0.86), size=0.06, name="txt29")
    # the stranger
    k.lantern = k.lamp(W(3.4, OUT_Y - 0.2, 0.0), LANTERN, "stranger", seed=41.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.004, location=(0, 0, 0.375), rotation=(math.pi / 2, 0, 0))
    hd = bpy.context.object
    hd.name = "stranger_handle"
    hd.data.materials.append(brass)
    kit.parent(hd, k.lantern.root)
    k.rule = kit.empty("rule", W(0.4, FRONT - 0.16, 0.012))
    kit.parent(kit.box("rule_bar", (2.4, 0.03, 0.008), (0, 0, 0), k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)), k.rule)
    for j in range(25):
        kit.parent(kit.box(f"rule_mark{j}", (0.006, 0.03 if j % 5 else 0.05, 0.004), (-1.2 + j * 0.1, 0.0, 0.006), ink), k.rule)
    k.found = []
    for i in range(3):
        m = k.mat(f"found{i}", (0.2, 0.2, 0.2), emit=kit.WARM, emit_strength=0.0)
        k.found.append((kit.box(f"found{i}", (0.09, 0.09, 0.16), W(-0.3 + 0.7 * i, FRONT - 0.16, 0.09), m), m))
    k.txt23 = k.text("2 of 3", W(0.4, FRONT - 0.16, 0.36), size=0.12, name="txt23")
    k.map = kit.empty("map", W(-1.30, 0.425, 0.26))
    kit.parent(kit.box("map_sheet", (0.20, 0.004, 0.15), (0, 0, 0), paper), k.map)
    for j, (x, z, w, hh) in enumerate(((-0.05, 0.03, 0.07, 0.05), (0.04, 0.03, 0.07, 0.05), (-0.05, -0.035, 0.07, 0.05), (0.04, -0.035, 0.07, 0.05))):
        kit.parent(kit.box(f"map_room{j}", (w, 0.002, hh), (x, -0.004, z), k.mat("map_ink", (0.45, 0.38, 0.28), rough=0.9)), k.map)


def pose(k, t):
    h = k.house
    # ---------------------------------------------------------------- the front: closed; opened by him; shut on the stranger; opened
    closed = 1.0 - ss(T_INVITED + 0.6, T_INVITED + 2.8, t)
    closed = max(closed, ss(T_DEFENDED + 0.2, T_DEFENDED + 1.4, t) * (1.0 - ss(T_MEASURED + 0.2, T_MEASURED + 1.6, t)))
    h.front(closed)
    for room in ROOMS:
        h.lit(room, 0.75)
    h.lit("small", 0.65)
    h.lit("hall", 0.9, kit.HIS)                                                    # the one window that is not warm
    h.lit("attic", 0.0)

    # ---------------------------------------------------------------- everyone inside: closing in on one person, and then not
    closing = ss(T_WORLD + 0.5, T_PERSON + 2.0, t) * (1.0 - ss(T_NUMBER + 2.6, T_NUMBER + 4.4, t))
    for i, c in enumerate(k.cands):
        c.set(t, size=1.0, lean=(-0.30 * closing, 0.0), tint=kit.HIS, mix=0.55 * closing, still=0.5 * closing)
    k.him.set(t, size=1.0, lean=(0.20, 0.05))

    # ---------------------------------------------------------------- the outside model
    bx = kf(t, [(T_INVITED + 1.0, 3.2), (T_INVITED + 4.4, 1.6), (T_HARDEST + 0.3, 1.6), (T_HARDEST + 2.4, 0.0), (T_HARDEST + 4.6, -1.42), (T_SURVIVED, -1.42),
                (T_SURVIVED + 3.0, -2.2), (T_FALSE - 0.2, -2.2), (T_FALSE + 2.6, 1.45), (T_STRANGER, 1.45), (T_STRANGER + 2.4, -2.4), (P1, -2.4)])
    k.bulb.location = W(bx, OUT_Y, 0.0)
    kit.show(k.bulb, t > T_INVITED + 0.9)
    k.bulb_light.data.energy = 2.6 * ss(T_INVITED + 1.0, T_INVITED + 2.0, t)

    # ---------------------------------------------------------------- he chooses which corrections reach me
    door = h.spot("hall", 0.20, -0.30)
    tl = h.top("library")
    for i, pg in enumerate(k.arrivals):
        a = T_CHOOSES + 0.2 + i * 0.75
        come = ss(a, a + 1.0, t)
        start = W(-3.2 - 0.25 * i, OUT_Y, 0.004)
        if i % 2 == 0:                                                             # let in
            inn = ss(a + 1.1, a + 2.4, t)
            p = lerp(lerp(start, (door[0], door[1], door[2] + 0.06), come), (tl[0] + 0.03 * i, tl[1] + 0.03, tl[2] + 0.002 + 0.002 * i), inn)
        else:                                                                      # turned away
            away = ss(a + 1.1, a + 2.2, t)
            p = lerp(lerp(start, (door[0], door[1], door[2] + 0.06), come), W(-2.5, OUT_Y - 0.15 * i, 0.004), away)
        pg.location = p
        kit.show(pg, T_CHOOSES < t < T_FALSE)
    # the one nobody chose: down from above the roof, and in
    fall = ss(T_NUMBER + 0.4, T_NUMBER + 3.4, t)
    k.unchosen.location = kf(fall, [(0.0, W(-0.3, FRONT, 3.3)), (0.7, W(-0.3, FRONT, 0.42)), (1.0, (tl[0] + 0.12, tl[1] - 0.02, tl[2] + 0.012))])
    k.unchosen.rotation_euler = (0, 0, 3.0 * (1.0 - fall))
    kit.show(k.unchosen, T_NUMBER + 0.3 < t < T_FALSE)
    for i, (pg, ts) in enumerate(zip(k.pinned, (T_PREDICT, T_BESIDE, T_RESULT))):
        u = ss(ts + 0.4, ts + 1.2, t)
        pg.scale = (max(0.001, u),) * 3
        kit.show(pg, u > 0.0)

    # ---------------------------------------------------------------- my own page; twenty-nine days
    k.false_line.hide_render = t < T_FALSE + 3.6
    k.wake_lines[5].hide_render = t >= T_FALSE + 3.6
    walk = math.sin((t - T_29) * 2.3) * ss(T_29, T_29 + 0.6, t) * (1.0 - ss(T_STRANGER - 1.0, T_STRANGER, t))
    k.me.root.location = h.spot("small", -0.25 + 0.30 * walk + 0.25 * ss(T_FALSE + 3.8, T_FALSE + 5.2, t) * (1.0 - ss(T_29, T_29 + 0.6, t)), 0.05)
    k.me.set(t, size=1.0, lean=(0.0, 0.26 * ss(T_FALSE + 3.8, T_FALSE + 5.0, t) * (1.0 - ss(T_29, T_29 + 0.5, t))))
    k.txt29.hide_render = not (T_29 + 1.2 < t < T_STRANGER)

    # ---------------------------------------------------------------- the stranger
    lx = kf(t, [(T_STRANGER + 0.3, 3.4), (T_STRANGER + 3.2, 1.9), (P1, 1.7)])
    held = ss(T_STRANGER + 3.0, T_STRANGER + 4.6, t)
    k.lantern.root.location = W(lx, OUT_Y - 0.25, 0.22 * held)
    kit.show(k.lantern.root, t > T_STRANGER + 0.2)
    k.lantern.set(t, size=ss(T_STRANGER + 0.2, T_STRANGER + 1.0, t), lean=(-0.2, 0.05))
    ruled = ss(T_MEASURED + 1.4, T_MEASURED + 2.6, t)
    k.rule.scale = (max(0.001, ruled), 1.0, 1.0)
    kit.show(k.rule, ruled > 0.0)
    for i, (ob, m) in enumerate(k.found):
        ob.hide_render = t < T_TWO3 + 0.4 + i * 0.4
        fixed = ss(T_TWO3 + 3.0 + i * 0.5, T_TWO3 + 3.6 + i * 0.5, t) if i != 1 else 0.0       # two of the three, made good
        m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 2.2 * fixed
    k.txt23.hide_render = t < T_TWO3 + 1.8
    hung = ss(T_TWO3 + 4.2, T_TWO3 + 5.0, t)
    k.map.scale = (max(0.001, hung),) * 3
    kit.show(k.map, hung > 0.0)

    # ---------------------------------------------------------------- the camera
    def cam(x, z, d):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z - 0.03))
    keys = [(P0, cam(0.0, 0.95, 6.6)), (T_KNEW, cam(0.0, 0.92, 6.2)), (T_INVITED + 3.0, cam(0.3, 0.80, 5.6)), (T_HARDEST + 2.4, cam(-0.2, 0.70, 4.6)),
            (T_HARDEST + 5.0, cam(-1.2, 0.40, 3.0)), (T_WORLD - 0.2, cam(-1.3, 0.38, 3.0)), (T_WORLD + 2.4, cam(0.0, 0.82, 5.2)), (T_SURVIVED, cam(0.0, 0.82, 5.2)),
            (T_NUMBER + 1.0, cam(-0.2, 1.0, 5.6)), (T_NUMBER + 3.6, cam(-0.3, 0.42, 2.6)), (T_PREDICT - 0.2, cam(-0.3, 0.42, 2.6)), (T_PREDICT + 1.4, cam(0.5, 1.22, 2.0)),
            (T_FALSE - 0.4, cam(0.5, 1.22, 2.0)), (T_FALSE + 2.4, cam(1.5, 0.42, 2.1)), (T_STRANGER - 0.3, cam(1.5, 0.42, 2.1)),
            (T_STRANGER + 2.4, cam(1.0, 0.70, 6.0)), (T_MEASURED, cam(1.0, 0.70, 6.0)), (T_TWO3 + 1.0, cam(0.45, 0.40, 3.6)), (T_TWO3 + 4.0, cam(0.4, 0.40, 3.6)),
            (P1, cam(-0.2, 0.60, 5.6))]
    k.camera(kf(t, [(a, b[0]) for a, b in keys]), kf(t, [(a, b[1]) for a, b in keys]), 40.0)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
