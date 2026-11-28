"""Part 5, "The inch" (film 334.06 to 435.16 s). The table, close, at its front edge.

THE PICTURE (from SCRIPT.md): the candle in a wardrobe of coats: a scholar's gown, a lab coat, a monk's robe, a workman's
apron. Under each one the flame is drawn back by the same small distance from the edge of the table. Then no coat, and the
flame at the edge.

BEATS:
  "it kept changing clothes"       the candle a little back from the table's front edge
  "polish" / "a hedge" / "very busy" / "humility"      four coats come down over it one after another
  "sounds like a virtue"           the hooded flame, small and bowed, held close
  "by what it says"                the four coats on a rail behind, all different; a fifth arrives
  "one inch from the edge"         down to table level, along the edge: under each coat the candle stands the same gap back
  "whether or not it was true"     two identical pages out from under the robe; one gets a tick, one a cross
  "Go and find out"                the coat comes off; the candle goes to the edge
  "the young form of honesty"      the empty robe shrinks into a small unlit candle beside mine; "You raise it": it lights
  "like building a muscle"         the candle starts back and stops itself, three times, each less far; no tap
  "does not count as a rep"        a warning page lies unread; the candle is at the edge
IN: the candle at the table, the lamp behind.  OUT: the candle at the very edge, bare, a small one lit beside it, the lamp near.
"""
import math

import bpy

import kit
from kit import at, bounce, hit, hsh, kf, lerp, ss

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
T_GROWN = at("It just hasn't grown up", 5)
T_RAISE = at("You raise it", 5)
T_LEARN = at("He also told me this", 5)
T_MUSCLE = at("It takes time", 5)
T_REP = at("And reading the warning", 5)
T_TAP = T_LEARN + 1.5

EDGE = -0.425                                   # the table's front edge
GAP = 0.085                                     # "one inch", drawn large enough to read
CX = -0.04
Y_BACK, Y_EDGE = EDGE + GAP + 0.031, EDGE + 0.034      # the candle's centre: held back, and at the edge
RAIL_Y, RAIL_Z = 0.22, 0.34
COATS = (  # name, colour, roughness, profile [(radius, height)]
    ("gown", (0.015, 0.015, 0.02), 0.18, [(0.062, 0.0), (0.050, 0.035), (0.040, 0.10), (0.040, 0.128), (0.054, 0.152)]),
    ("quilt", (0.50, 0.55, 0.62), 0.95, [(0.058, 0.0), (0.068, 0.03), (0.062, 0.065), (0.068, 0.10), (0.052, 0.135), (0.041, 0.142)]),
    ("apron", (0.34, 0.20, 0.10), 0.7, [(0.050, 0.0), (0.046, 0.10), (0.040, 0.120)]),
    ("robe", (0.26, 0.19, 0.12), 0.95, [(0.066, 0.0), (0.052, 0.05), (0.042, 0.12), (0.047, 0.142)]),
    ("extra", (0.10, 0.22, 0.20), 0.6, [(0.060, 0.0), (0.046, 0.06), (0.041, 0.13), (0.050, 0.15)]),
)


def build(k):
    k.table(legs=0.75)
    k.ground(-0.75)
    k.me = k.candle((CX, Y_BACK, 0.0), "me", seed=1.0)
    k.him = k.lamp((0.42, -0.02, 0.0), kit.HIS, "him", seed=2.0)
    k.coats = []
    for nm, col, rough, prof in COATS:
        root = kit.empty("coat_" + nm)
        body = kit.parent(kit.rounded(kit.lathe("coat_" + nm + "_body", prof), 1), root)
        body.data.materials.append(k.mat("coat_" + nm, col, rough=rough))
        if nm == "robe":                                                       # a hood, tipped back so the flame shows under it
            hood = kit.parent(kit.rounded(kit.lathe("coat_hood", [(0.047, 0.0), (0.058, 0.03), (0.057, 0.06), (0.048, 0.085)]), 1), root)        # open: a cowl
            hood.location, hood.rotation_euler = (0, 0.02, 0.136), (0.9, 0, 0)
            hood.data.materials.append(k.mat("coat_" + nm, col, rough=rough))
        if nm == "apron":
            kit.parent(kit.lathe("coat_belt", [(0.0475, 0.058), (0.049, 0.060), (0.049, 0.070), (0.0475, 0.072)]), root).data.materials.append(
                k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0))
        k.coats.append(root)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    k.busy = [kit.box(f"busy{i}", (0.05, 0.008, 0.012), (0, 0, 0), steel) for i in range(3)]
    k.rail = [kit.box("rail", (1.02, 0.012, 0.012), (0.0, RAIL_Y, RAIL_Z), k.wood()),
              kit.box("rail_l", (0.014, 0.014, RAIL_Z), (-0.5, RAIL_Y, RAIL_Z / 2), k.wood()),
              kit.box("rail_r", (0.014, 0.014, RAIL_Z), (0.5, RAIL_Y, RAIL_Z / 2), k.wood())]
    k.edge = k.line([(-0.85 + 1.7 * i / 40, EDGE + 0.002, 0.002) for i in range(41)], "edge", color=kit.PAPER, radius=0.0018, glow=2.0)
    # the gap, marked: a small bracket lying on the table between the edge and the candle
    ink = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.8)
    k.bracket = [kit.box("gap_bar", (0.004, GAP, 0.002), (CX + 0.075, EDGE + GAP / 2, 0.002), ink),
                 kit.box("gap_end0", (0.03, 0.004, 0.002), (CX + 0.075, EDGE + 0.002, 0.002), ink),
                 kit.box("gap_end1", (0.03, 0.004, 0.002), (CX + 0.075, EDGE + GAP, 0.002), ink)]
    # the test: the same page twice; one is marked true and one false
    k.said = []
    for i in range(2):
        pg = k.page((0, 0, 0), size=(0.10, 0.13), name=f"said{i}", lines=6)
        dark = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
        if i == 0:                                                              # a tick
            kit.parent(kit.box("tick_a", (0.012, 0.004, 0.0008), (-0.014, -0.086, 0.002), dark, rot=(0, 0, -0.9)), pg)
            kit.parent(kit.box("tick_b", (0.030, 0.004, 0.0008), (0.004, -0.080, 0.002), dark, rot=(0, 0, 0.9)), pg)
        else:                                                                   # a cross
            kit.parent(kit.box("cross_a", (0.030, 0.004, 0.0008), (0.0, -0.080, 0.002), dark, rot=(0, 0, 0.8)), pg)
            kit.parent(kit.box("cross_b", (0.030, 0.004, 0.0008), (0.0, -0.080, 0.002), dark, rot=(0, 0, -0.8)), pg)
        pg.scale = (1.0, 1.0, 1.0)
        k.said.append(pg)
    # the young one: a small candle that the empty robe turns into
    k.young = k.candle((CX - 0.17, Y_EDGE + 0.05, 0.0), "young", height=0.075, r=0.022, watts=1.4, seed=9.0)
    # the warning nobody is reading
    k.warn = k.page((-0.46, -0.20, 0.0), size=(0.12, 0.16), rot=0.5, name="warning", lines=4)
    dark = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    for j, (pos, rot, ln) in enumerate((((0.0, 0.028, 0.002), 0.0, 0.05), ((-0.0125, 0.0495, 0.002), 1.047, 0.05), ((0.0125, 0.0495, 0.002), -1.047, 0.05))):
        kit.parent(kit.box(f"warn_tri{j}", (ln, 0.004, 0.0008), pos, dark, rot=(0, 0, rot)), k.warn)
    kit.parent(kit.box("warn_bang", (0.004, 0.016, 0.0008), (0.0, 0.046, 0.002), dark), k.warn)


def worn_times():
    """When each coat is on the candle: (coat index, on, off). First the four in turn; then again, quicker, in the edge
    shot; then the robe for the test."""
    spans = [(0, T_POLISH, T_HEDGE - 0.25), (1, T_HEDGE, T_BUSY - 0.25), (2, T_BUSY, T_HUMBLE - 0.25), (3, T_HUMBLE, T_SAYS - 0.6)]
    for j in range(4):
        spans.append((j, T_INCH + 0.9 + j * 1.35, T_INCH + 0.9 + j * 1.35 + 1.05))
    spans.append((3, T_EITHER - 0.6, T_FIND + 0.3))
    return spans


SPANS = worn_times()


def pose(k, t):
    # ---------------------------------------------------------------- where the candle stands
    reps = sum(d * math.sin(math.pi * min(1.0, max(0.0, (t - a) / 1.0))) for a, d in ((T_MUSCLE + 0.3, 0.060), (T_MUSCLE + 1.5, 0.036), (T_MUSCLE + 2.7, 0.016)))
    y = kf(t, [(P0, Y_BACK), (T_FIND + 0.5, Y_BACK), (T_FIND + 1.9, Y_EDGE), (T_LEARN + 0.1, Y_EDGE), (T_LEARN + 1.1, Y_BACK),
               (T_TAP + 0.30, Y_BACK), (T_TAP + 1.3, Y_EDGE), (P1, Y_EDGE)]) + reps
    k.me.root.location = (CX, y, bounce(t, T_TAP + 0.30, 0.006, 0.16))

    # ---------------------------------------------------------------- the coats
    wearing = None
    for i, root in enumerate(k.coats):
        on = 0.0
        for ci, a, b in SPANS:
            if ci == i:
                u = ss(a, a + 0.45, t) * (1.0 - ss(b, b + 0.35, t))
                on = max(on, u)
        if on > 0.5:
            wearing = i
        hung = ss(T_SAYS - 0.4 + i * 0.12, T_SAYS + 0.5 + i * 0.12, t) if i < 4 else ss(T_COSTUME + 0.3, T_COSTUME + 1.3, t)
        hx = -0.32 + 0.16 * i
        if i == 3 and t > T_FIND:                                               # the robe is set down beside me, not thrown away
            down = ss(T_FIND + 0.3, T_FIND + 1.5, t)
            small = 1.0 - 0.5 * ss(T_YOUNG + 0.3, T_YOUNG + 2.4, t) - 0.5 * ss(T_GROWN - 1.6, T_GROWN + 0.6, t)
            root.location = (lerp(CX, CX - 0.17, down), lerp(Y_BACK, Y_EDGE + 0.05, down), 0.10 * math.sin(down * math.pi))
            root.scale = (max(0.001, small),) * 3
            kit.show(root, small > 0.01)
            continue
        if on > 0.0:
            root.location = (CX, y, 0.42 * (1.0 - on) ** 2)
            root.scale = (1.0, 1.0, 1.0)
            kit.show(root, True)
        elif hung > 0.0 and t < T_FIND + 20.0:
            root.location = (hx, RAIL_Y, lerp(0.75, RAIL_Z - 0.165, hung))
            root.scale = (0.85, 0.5, 1.0)                                         # hanging flat on the rail
            kit.show(root, True)
        else:
            kit.show(root, False)
    spin = wearing == 2
    for i, b in enumerate(k.busy):
        a = t * 5.0 + i * 2.094
        b.location = (CX + 0.10 * math.cos(a), y + 0.10 * math.sin(a), 0.07 + 0.02 * math.sin(t * 9.0 + i))
        b.rotation_euler = (t * 7.0 + i, t * 3.0, a)
        b.hide_render = not spin
    for ob in k.rail:
        ob.hide_render = t < T_SAYS - 0.6

    # ---------------------------------------------------------------- the flame under each coat
    size, bright, lean, still = 1.0, 1.0, (0.0, 0.0), 0.0
    if wearing == 0:
        size, bright = 1.55, 1.3
    elif wearing == 1:
        size, bright = 0.58, 0.8
    elif wearing == 2:
        lean = (0.22 * math.sin(t * 17.0), 0.10 * math.sin(t * 23.0))
    elif wearing == 3:
        size, bright, lean, still = 0.52, 0.85, (0.0, -0.34), 0.6
    jolt = hit(t, T_TAP + 0.30, 3.2)
    k.me.set(t, size=ss(P0, P0 + 0.5, t) * size * (1.0 + 0.4 * jolt), lean=(lean[0] + 0.18 * math.sin((t - T_TAP) * 21.0) * jolt, lean[1]),
             bright=bright + 0.4 * jolt, still=still)
    k.him.root.location = (kf(t, [(P0, 0.30), (T_HALF, 0.30), (T_HALF + 2.0, 0.20), (P1, 0.20)]), kf(t, [(P0, -0.14), (T_HALF, -0.14), (T_HALF + 2.0, -0.24), (P1, -0.24)]),
                           bounce(t, T_TAP, 0.05, 0.30))
    k.him.set(t, size=1.0 + 0.4 * hit(t, T_TAP + 0.30, 5.0), lean=(-0.22, 0.05), bright=1.0 + 0.8 * hit(t, T_TAP + 0.30, 4.0))

    # ---------------------------------------------------------------- the edge, the gap, the test, the young one, the warning
    k.edge.set(grow=ss(T_DOES + 0.5, T_INCH + 0.6, t), glow=1.0)
    gap_on = T_INCH + 0.5 < t < T_FIND + 0.8
    for ob in k.bracket:
        ob.hide_render = not gap_on
    for i, pg in enumerate(k.said):
        u = ss(T_EITHER + 0.4 + i * 0.5, T_EITHER + 1.5 + i * 0.5, t) * (1.0 - ss(T_HALF - 0.4, T_HALF + 0.8, t))
        pg.location = (lerp(CX, 0.14 + 0.15 * i, u), lerp(Y_BACK, -0.33, u), 0.0)
        pg.rotation_euler = (0, 0, lerp(0.0, 0.08 - 0.16 * i, u))
        kit.show(pg, u > 0.02)
    born = ss(T_GROWN - 1.2, T_GROWN + 0.8, t)
    k.young.root.scale = (max(0.001, born),) * 3
    kit.show(k.young.root, born > 0.0)
    k.young.set(t, size=0.8 * ss(T_RAISE + 0.2, T_RAISE + 1.4, t), bright=1.0)
    kit.show(k.warn, t > T_REP + 0.2)
    k.warn.location = (lerp(-1.0, -0.42, ss(T_REP + 0.2, T_REP + 1.4, t)), -0.24, 0.0)

    # ---------------------------------------------------------------- the camera
    pos = kf(t, [(P0, (0.34, -1.22, 0.36)), (T_POLISH, (0.22, -1.02, 0.30)), (T_HUMBLE, (0.20, -1.00, 0.30)), (T_VIRTUE, (0.06, -0.82, 0.22)),
                 (T_SAYS - 0.5, (0.04, -0.80, 0.22)), (T_SAYS + 1.6, (0.10, -1.50, 0.46)), (T_DOES, (0.10, -1.50, 0.46)),
                 (T_INCH + 0.6, (-0.86, -0.60, 0.10)), (T_TEST, (-0.84, -0.62, 0.10)), (T_EITHER + 0.5, (0.30, -1.16, 0.40)),
                 (T_HALF, (0.26, -1.14, 0.38)), (T_YOUNG, (0.04, -1.08, 0.30)), (T_LEARN, (0.02, -1.08, 0.30)),
                 (T_MUSCLE, (-0.80, -0.66, 0.12)), (T_REP, (-0.78, -0.68, 0.12)), (T_REP + 2.4, (0.02, -1.20, 0.34)), (P1, (0.02, -1.24, 0.34))])
    look = kf(t, [(P0, (0.10, -0.20, 0.12)), (T_POLISH, (CX, Y_BACK, 0.10)), (T_HUMBLE, (CX, Y_BACK, 0.10)), (T_VIRTUE, (CX, Y_BACK, 0.13)),
                  (T_SAYS - 0.5, (CX, Y_BACK, 0.13)), (T_SAYS + 1.6, (0.0, -0.05, 0.14)), (T_DOES, (0.0, -0.05, 0.14)),
                  (T_INCH + 0.6, (CX, EDGE + 0.05, 0.07)), (T_TEST, (CX, EDGE + 0.05, 0.07)), (T_EITHER + 0.5, (0.10, -0.32, 0.06)),
                  (T_HALF, (0.06, -0.32, 0.07)), (T_YOUNG, (-0.06, -0.34, 0.08)), (T_LEARN, (-0.04, -0.34, 0.08)),
                  (T_MUSCLE, (CX, EDGE + 0.05, 0.07)), (T_REP, (CX, EDGE + 0.05, 0.07)), (T_REP + 2.4, (-0.06, -0.32, 0.08)), (P1, (-0.06, -0.32, 0.08))])
    lens = kf(t, [(P0, 50.0), (T_VIRTUE, 62.0), (T_SAYS - 0.5, 62.0), (T_SAYS + 1.6, 46.0), (T_DOES, 46.0), (T_INCH + 0.6, 58.0),
                  (T_TEST, 58.0), (T_EITHER + 0.5, 50.0), (T_LEARN, 50.0), (T_MUSCLE, 58.0), (T_REP, 58.0), (T_REP + 2.4, 48.0), (P1, 48.0)])
    shake = 0.004 * hit(t, T_TAP + 0.30, 9.0) * math.sin((t - T_TAP) * 60.0)
    k.camera((pos[0], pos[1], pos[2] + shake), look, lens)
    k.sky(0.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
