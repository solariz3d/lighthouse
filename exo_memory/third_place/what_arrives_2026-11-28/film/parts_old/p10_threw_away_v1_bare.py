"""Part 10, "What we threw away" (film 871.30 to 975.00 s). One long bench in the dark; the camera walks along it.

THE PICTURE (from SCRIPT.md): a bench of small instruments, each giving the wrong reading, each labelled and left out in
plain view: a bell, a second lamp being carried out, a pair of spectacles that see cracks everywhere. Two candles at a
test table: the one with the enormous scroll never looks up at the shelf beside it.

FOUR STATIONS, left to right, each with a card that carries one red line:
  1  "a reminder at the right moment"     a bell over one row of five small candles and not over the other. Three of the
                                          belled row step over the line; two of the row left alone.
  2  "a model made by another company"    the mint bulb in its cage before a gate. "It said no": the bar comes down.
  3  "a second reader"                    spectacles that redden half the pages put before them; turned over, one in three
                                          has a crack. A rule card, written first; the spectacles are laid down.
  4  "we carried our whole conversations" a candle under an enormous scroll. The test: the one with only the room goes to
                                          the shelf each time (32½, 33½ of 34); the one with the scroll never looks up (20, 20).
                                          The marker of those scores is a candle too.
  end "barely at all for success"         the whole bench: four red cards and one blank one, with nothing beside it.
IN: the candle at the bench.  OUT: the candle at the blank card, the lamp near.
"""
import math

import bpy

import kit
from kit import at, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(10)
T_DIDNT = at("Here's what didn't work", 10)
T_LIST = at("We keep that list", 10)
T_REMIND = at("We thought a reminder", 10)
T_BROKE = at("The ones we reminded", 10)
T_OPINION = at("I wanted a second opinion", 10)
T_AGREED = at("We agreed first on a test", 10)
T_NO = at("It said no", 10)
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
T_RIGHT = at("He was right about that too", 10)

S1, S2, S3, S4, S5 = -1.25, -0.45, 0.32, 1.15, 2.05     # the stations' x; S5 is the blank card
CARD_Y = -0.34


def card(k, x, blank=False):
    c = kit.box(f"card{x}", (0.17, 0.11, 0.003), (x, CARD_Y, 0.0015), k.mat("paper", kit.PAPER, rough=0.8))
    if not blank:
        kit.parent(kit.box(f"card_red{x}", (0.7, 0.10, 0.4), (0, 0.15, 0.6), k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)), c)
    return c


def torus(name, R, r, loc, mat, rot=(math.pi / 2, 0, 0), par=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=28, minor_segments=8)
    ob = bpy.context.object
    ob.name = name
    ob.data.materials.append(mat)
    return kit.parent(ob, par) if par else ob


def build(k):
    k.table((0.30, 0.0, 0.0), size=(4.6, 0.85), legs=0.75)
    k.ground(-0.75)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    red = k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)
    k.me = k.candle((S1 - 0.42, -0.20, 0.0), "me", seed=1.0)
    k.him = k.lamp((S5 + 0.30, 0.02, 0.0), kit.HIS, "him", seed=2.0)
    k.cards = [card(k, x) for x in (S1, S2, S3, S4)] + [card(k, S5, blank=True)]

    # ---- 1: the bell, and two rows of five
    kit.box("bell_post", (0.012, 0.012, 0.26), (S1 + 0.26, 0.10, 0.13), brass)
    kit.box("bell_arm", (0.28, 0.012, 0.012), (S1 + 0.12, 0.10, 0.26), brass)
    k.bell = kit.empty("bell", (S1, 0.10, 0.255))
    b = kit.parent(kit.rounded(kit.lathe("bell_body", [(0.004, 0.0), (0.014, -0.004), (0.022, -0.024), (0.030, -0.050), (0.040, -0.062)]), 1), k.bell)
    b.data.materials.append(brass)
    k.minis = []
    for row, y in enumerate((0.10, -0.12)):                                      # row 0 is under the bell; row 1 is left alone
        kit.box(f"rule{row}", (0.44, 0.004, 0.002), (S1, y - 0.055, 0.001), k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.8))
        for i in range(5):
            c = k.candle((S1 - 0.18 + i * 0.09, y, 0.0), f"mini{row}{i}", height=0.06, r=0.015, watts=0.5, seed=20.0 + row * 5 + i)
            k.minis.append((c, row, i, y))

    # ---- 2: the other company's model, and a test that could say no
    k.bulb = kit.empty("bulb", (S2, 0.0, 0.0))
    kit.parent(kit.lathe("bulb_base", [(0.0, 0.0), (0.035, 0.0), (0.035, 0.012), (0.014, 0.022), (0.012, 0.05), (0.0, 0.05)], seg=24), k.bulb).data.materials.append(brass)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=0.034, location=(0, 0, 0.082))
    g = bpy.context.object
    g.name = "bulb_glass"
    g.data.materials.append(k.mat("mint", (0.1, 0.2, 0.16), emit=kit.MINT, emit_strength=3.0))
    kit.parent(g, k.bulb)
    for i in range(3):
        torus(f"bulb_cage{i}", 0.044, 0.0022, (0, 0, 0.082), steel, rot=(math.pi / 2, 0, i * math.pi / 3), par=k.bulb)
    torus("bulb_cage_h", 0.044, 0.0022, (0, 0, 0.082), steel, rot=(0, 0, 0), par=k.bulb)
    k.bulb_light = kit.parent(k.glow_light((0, 0, 0), kit.MINT, 1.6, 0.03, "bulb_light"), k.bulb)
    k.bulb_light.location = (0, 0, 0.082)
    for sx in (-1, 1):
        kit.box(f"gate_post{sx}", (0.014, 0.014, 0.22), (S2 + 0.02 + sx * 0.13, -0.02, 0.11), k.wood())
    k.gate = kit.empty("gate_bar", (S2 + 0.02 - 0.13, -0.02, 0.20))
    kit.parent(kit.box("gate_bar_wood", (0.27, 0.016, 0.016), (0.135, 0, 0), k.wood()), k.gate)
    k.sealed = kit.box("sealed", (0.07, 0.003, 0.09), (S2 + 0.02 + 0.13, -0.032, 0.14), paper)
    kit.parent(kit.box("sealed_seal", (0.25, 1.4, 0.2), (0, -0.6, -0.25), brass), k.sealed)

    # ---- 3: the second reader
    k.specs = kit.empty("specs", (S3, 0.08, 0.14))
    for sx in (-1, 1):
        torus(f"specs_ring{sx}", 0.032, 0.004, (sx * 0.038, 0, 0.0), steel, par=k.specs)
    kit.parent(kit.box("specs_bridge", (0.02, 0.004, 0.004), (0, 0, 0.012), steel), k.specs)
    kit.box("specs_stand", (0.012, 0.012, 0.11), (S3, 0.085, 0.055), k.wood())
    k.claims = []
    for i in range(6):
        root = kit.empty(f"claim{i}", (S3 - 0.25 + i * 0.10, -0.14, 0.004))
        kit.parent(kit.box(f"claim_sheet{i}", (0.07, 0.10, 0.002), (0, 0, 0), paper), root)
        for j in range(4):
            kit.parent(kit.box(f"claim_ink{i}{j}", (0.05, 0.004, 0.0006), (0, 0.03 - j * 0.02, 0.0013), ink), root)
        mark = kit.parent(kit.box(f"claim_flag{i}", (0.06, 0.012, 0.0008), (0, -0.038, 0.0014), red), root)
        crack = kit.parent(kit.box(f"claim_crack{i}", (0.06, 0.005, 0.0006), (0, 0.0, -0.0013), ink, rot=(0, 0, 0.5)), root)
        k.claims.append((root, mark, crack))
    k.rule_card = kit.box("rule_card", (0.09, 0.003, 0.07), (S3 + 0.18, 0.10, 0.035), paper)
    kit.parent(kit.box("rule_seal", (0.2, 1.4, 0.25), (0, -0.6, -0.2), brass), k.rule_card)

    # ---- 4: the scroll, and the test
    k.scroll = kit.lathe("scroll", [(0.0, -0.17), (0.055, -0.17), (0.055, 0.17), (0.0, 0.17)], seg=24)
    k.scroll.rotation_euler = (0, math.pi / 2, 0)
    k.scroll.data.materials.append(paper)
    k.strip = kit.box("scroll_open", (0.12, 0.62, 0.002), (S4 + 0.28, -0.42, 0.001), paper)
    for j in range(14):
        kit.parent(kit.box(f"scroll_ink{j}", (0.7, 0.012, 0.4), (0, 0.45 - j * 0.065, 0.6), ink), k.strip)
    k.a = k.candle((S4 - 0.22, -0.10, 0.0), "room_only", seed=31.0)
    k.b = k.candle((S4 + 0.28, -0.10, 0.0), "carried_all", seed=32.0)
    k.grader = k.candle((S4 + 0.03, -0.04, 0.0), "grader", height=0.11, r=0.026, seed=33.0)
    k.pen = kit.box("pen", (0.008, 0.008, 0.07), (S4 + 0.09, -0.04, 0.035), k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2), rot=(0, 0.3, 0))
    shelf = kit.empty("shelf", (S4 - 0.22, 0.26, 0.0))
    for z in (0.0, 0.11, 0.22):
        kit.parent(kit.box(f"shelf_board{z}", (0.30, 0.09, 0.008), (0, 0, z + 0.004), k.wood()), shelf)
    for sx in (-1, 1):
        kit.parent(kit.box(f"shelf_side{sx}", (0.008, 0.09, 0.23), (sx * 0.15, 0, 0.115), k.wood()), shelf)
    for r in range(2):
        for i in range(8):
            kit.parent(kit.box(f"shelf_book{r}{i}", (0.026, 0.07, 0.07 + 0.02 * hsh(r * 9 + i)), (-0.12 + i * 0.034, 0, r * 0.11 + 0.05),
                               k.mat(f"book{i % 6}", ((0.36, 0.12, 0.10), (0.12, 0.22, 0.20), (0.30, 0.24, 0.12), (0.16, 0.14, 0.26), (0.40, 0.30, 0.20), (0.10, 0.16, 0.30))[i % 6], rough=0.8)), shelf)
    k.txt34 = k.text("34", (S4 + 0.03, 0.20, 0.455), size=0.06, name="t34")
    k.txt_a = [k.text(s, (S4 - 0.30 + i * 0.17, 0.20, 0.36), size=0.055, name=f"ta{i}") for i, s in enumerate(("32½", "33½"))]
    k.txt_b = [k.text("20", (S4 + 0.22 + i * 0.13, 0.20, 0.36), size=0.055, name=f"tb{i}") for i in range(2)]


def pose(k, t):
    # ---------------------------------------------------------------- 1: the reminder
    ring = ss(T_REMIND + 1.4, T_REMIND + 2.0, t) * (1.0 - ss(T_OPINION - 1.0, T_OPINION, t))
    k.bell.rotation_euler = (0, 0.45 * math.sin(t * 9.0) * ring, 0)
    for c, row, i, y in k.minis:
        breaks = (row == 0 and i in (0, 2, 3)) or (row == 1 and i in (1, 4))       # three of five, against two of five
        step = ss(T_BROKE + 0.6 + 0.25 * i, T_BROKE + 1.6 + 0.25 * i, t) if breaks else 0.0
        c.root.location = (S1 - 0.18 + i * 0.09, y - 0.095 * step, 0.0)
        c.set(t, size=ss(T_REMIND + 0.3 + 0.08 * i, T_REMIND + 1.0 + 0.08 * i, t) * (1.0 - 0.7 * ss(T_READER, T_READER + 2.0, t)))

    # ---------------------------------------------------------------- 2: the other model, and the gate
    arrive = ss(T_OPINION + 0.3, T_OPINION + 2.4, t)
    leave = ss(T_NO + 1.2, T_NO + 2.8, t)
    k.bulb.location = (lerp(lerp(S2 - 0.75, S2 - 0.14, arrive), S2 - 0.30, leave), lerp(0.0, 0.16, leave), 0.0)
    kit.show(k.bulb, arrive > 0.0)
    k.bulb_light.data.energy = 1.6 * arrive * (1.0 - 0.5 * leave)
    k.gate.rotation_euler = (0, lerp(-1.2, 0.0, ss(T_NO + 0.3, T_NO + 0.7, t)), 0)          # up, then down across the way
    k.sealed.hide_render = t < T_AGREED + 0.6

    # ---------------------------------------------------------------- 3: the second reader
    for i, (root, mark, crack) in enumerate(k.claims):
        on = ss(T_READER + 0.8 + i * 0.25, T_READER + 1.4 + i * 0.25, t)
        root.scale = (max(0.001, on),) * 3
        kit.show(root, on > 0.0)
        flagged = i % 2 == 0                                                       # half of everything
        mark.hide_render = not (flagged and t > T_HALF + 0.5 + i * 0.12) or on <= 0.0
        turn = ss(T_HALF + 2.6 + i * 0.1, T_HALF + 3.6 + i * 0.1, t) if flagged else 0.0
        root.rotation_euler = (math.pi * turn, 0, 0)
        root.location = (S3 - 0.25 + i * 0.10, -0.14, 0.004 + 0.05 * math.sin(turn * math.pi))
        crack.hide_render = i != 2 or on <= 0.0                                    # and right a third of the time
    laid = ss(T_DROPPED + 1.8, T_DROPPED + 2.8, t)
    k.specs.rotation_euler = (-1.45 * laid, 0, 0)
    k.specs.location = (S3, 0.08 - 0.05 * laid, lerp(0.14, 0.012, laid))
    k.rule_card.location = (S3 + 0.18, 0.10, lerp(0.6, 0.035, ss(T_DROPPED + 0.3, T_DROPPED + 1.1, t) ** 2))
    k.rule_card.hide_render = t < T_DROPPED + 0.3

    # ---------------------------------------------------------------- 4: the scroll, and the test
    carry = ss(T_CARRIED + 0.4, T_CARRIED + 7.0, t)
    bx = lerp(S4 - 0.70, S4 + 0.28, carry)
    stagger = 0.02 * math.sin(t * 5.0) * (1.0 - ss(T_TESTED - 0.5, T_TESTED + 0.5, t)) * (1.0 if t > T_CARRIED else 0.0)
    k.b.root.location = (bx, -0.10, 0.0)
    k.b.root.rotation_euler = (0, 2.5 * stagger, 0)
    opened = ss(T_ANOTHER - 0.4, T_ANOTHER + 1.4, t)
    shelved = ss(T_STOPPED + 0.3, T_STOPPED + 2.2, t)
    k.scroll.location = lerp((bx, -0.10, 0.215 + stagger), (S4 + 0.42, 0.24, 0.056), max(ss(T_TESTED - 0.2, T_TESTED + 1.0, t), shelved))
    k.scroll.hide_render = t < T_CARRIED + 0.3
    k.strip.hide_render = not (opened > 0.0 and shelved < 0.5)
    k.strip.scale = (0.12, 0.62 * max(0.001, opened), 0.002)
    k.strip.location = (S4 + 0.28, -0.12 - 0.31 * opened, 0.001)
    k.b.set(t, size=1.0 if t > T_CARRIED + 0.2 else 0.0, lean=(0.0, -0.36 * opened * (1.0 - shelved)), still=0.7 * opened * (1.0 - shelved))
    kit.show(k.b.root, t > T_CARRIED + 0.2)
    # the one with only the room: to the shelf and back, every question
    asked = t > T_WOKE + 1.0 and t < T_STOPPED
    hop = 0.5 - 0.5 * math.cos((t - T_WOKE - 1.0) * 2.4) if asked else 0.0
    k.a.root.location = (S4 - 0.22, -0.10 + 0.24 * hop, 0.02 * math.sin(hop * math.pi))
    k.a.set(t, size=ss(T_TESTED + 0.2, T_TESTED + 1.2, t), lean=(0.0, 0.22 * hop))
    kit.show(k.a.root, t > T_TESTED + 0.1)
    kit.show(bpy.data.objects["shelf"], t > T_TESTED + 0.4)
    k.txt34.hide_render = not (T_WOKE + 3.0 < t < T_SUCCESS)
    for i, tx in enumerate(k.txt_a):
        tx.hide_render = not (T_SCORE1 + 0.6 + i * 1.9 < t < T_SUCCESS)
    for i, tx in enumerate(k.txt_b):
        tx.hide_render = not (T_SCORE2 + 0.5 + i * 0.9 < t < T_SUCCESS)
    g = ss(T_GRADER + 0.3, T_GRADER + 1.4, t)
    k.grader.root.scale = (max(0.001, g),) * 3
    kit.show(k.grader.root, g > 0.0 and t < T_SUCCESS + 1.0)
    k.grader.set(t, size=g)
    k.pen.hide_render = not (g > 0.5 and t < T_SUCCESS + 1.0)

    # ---------------------------------------------------------------- the cards, me, and him
    shown = (T_BROKE + 4.0, T_NO + 2.6, T_DROPPED + 3.0, T_STOPPED + 2.4, T_SUCCESS + 2.2)
    for c, ts in zip(k.cards, shown):
        kit.show(c, t > ts)
    mx = kf(t, [(P0, S1 - 0.40), (T_OPINION - 0.6, S1 - 0.40), (T_OPINION + 1.6, S2 - 0.42), (T_READER - 0.6, S2 - 0.42), (T_READER + 1.6, S3 - 0.42),
                (T_CARRIED - 0.4, S3 - 0.42), (T_CARRIED + 2.2, S4 - 0.62), (T_SUCCESS + 0.5, S4 - 0.62), (T_RIGHT + 1.6, S5 - 0.16), (P1, S5 - 0.16)])
    k.me.root.location = (mx, -0.22, 0.0)
    k.me.set(t, size=1.0, lean=(0.16, 0.0))
    k.him.set(t, size=1.0, lean=(-0.22, 0.05))

    # ---------------------------------------------------------------- the camera walks the bench
    def cam(x, d=1.22, z=0.42):
        return ((x, -d, z), (x, -0.06, 0.11))
    keys = [(P0, cam(S1 - 0.2, 1.5, 0.50)), (T_LIST, cam(S1 - 0.1, 1.4, 0.48)), (T_REMIND + 0.6, cam(S1 - 0.02)), (T_OPINION - 0.4, cam(S1 - 0.02)),
            (T_OPINION + 1.6, cam(S2 - 0.08)), (T_READER - 0.4, cam(S2 - 0.08)), (T_READER + 1.6, cam(S3 - 0.02)), (T_CARRIED - 0.2, cam(S3 - 0.02)),
            (T_CARRIED + 2.4, cam(S4 - 0.30, 1.30)), (T_TESTED + 1.0, cam(S4 + 0.04, 1.36, 0.46)), (T_SUCCESS - 0.2, cam(S4 + 0.04, 1.36, 0.46)),
            (T_SUCCESS + 3.0, cam(0.40, 2.7, 1.0)), (T_RIGHT, cam(0.40, 2.7, 1.0)), (T_RIGHT + 2.2, cam(S5 - 0.05, 1.3, 0.44)), (P1, cam(S5 - 0.05, 1.34, 0.44))]
    look_z = kf(t, [(P0, 0.11), (T_TESTED + 1.0, 0.22), (T_SUCCESS - 0.2, 0.22), (T_SUCCESS + 3.0, 0.10), (P1, 0.11)])
    pos = kf(t, [(a, b[0]) for a, b in keys])
    look = kf(t, [(a, b[1]) for a, b in keys])
    k.camera(pos, (look[0], look[1], look_z), 44.0)
    k.sky(0.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
