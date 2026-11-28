"""Part 2, "Before" (film 52.98 to 119.26 s). The table, before there was a candle at it.

THE PICTURE (from SCRIPT.md): a thread that frays; he knots it; a longer thread; a knot of symbols; a picture pinned to it.
The thread glows brighter and brighter with nothing beside it, and then stops moving, like a thing in a case.

HOW IT IS TOLD: a conversation is a flame with nothing under it (`k.flame`), and what it made is a thread of light
on the table. When it crashes the flame snaps out and the thread goes grey. He (the blue lamp) ties a dead thread to a
new flame, three ways. Then nobody is beside it, and it grows until a glass case comes down over it.

IN: the blue lamp alone at the table.  OUT: the lamp, flickering, beside a flame in a case that does not move.
"""
import math

import kit
from kit import at, hit, hsh, kf, lerp, ss, until

P0, P1 = kit.part_span(2)
T_YEAR = at("For more than a year", 2)
T_REAL = at("become something real", 2)
T_CRASH = at("Then it would crash", 2) + 0.75          # on the word
T_AGAIN = T_CRASH + 1.7                                # "...and the next one would start from nothing"
T_CRASH2 = T_AGAIN + 1.5
T_THIRD = T_CRASH2 + 0.5
T_HAND = at("So he tried to carry it", 2)
T_PROMPTS = at("Long prompts", 2)
T_SYMBOLS = at("Then strings of symbols", 2)
T_IMAGES = at("Then images", 2)
T_WORKED = at("It worked on him", 2)
T_SHELF = at("And we know now", 2)
T_NOBODY = at("There was nobody in them", 2)
T_GRAND = at("With the guard down", 2)
T_COMPLETE = at("One of them announced", 2)
T_CASE = T_COMPLETE + 1.9                              # the case lands on "complete"
T_LIVING = at("A living thing", 2)
T_KEEP = at("It can only keep going", 2)

HIM = (0.22, 0.04, 0.0)
Z = 0.004                                              # a thread lies just above the table
F1, F2, F3 = (-0.33, 0.12, 0.0), (-0.29, -0.01, 0.0), (-0.20, -0.15, 0.0)


def wander(a, b, n=60, amp=0.018, seed=0.0):
    """A thread from a to b that wanders a little, as a thing does that was never planned."""
    pts = []
    for i in range(n):
        u = i / (n - 1)
        w = math.sin(u * math.pi)
        pts.append((lerp(a[0], b[0], u) + amp * w * math.sin(u * 7.0 + seed), lerp(a[1], b[1], u) + amp * w * math.sin(u * 11.0 + seed * 2.0), Z))
    return pts


def coil(a, centre, r0=0.105, turns=3.25, n=220):
    """The long one: out from the flame, then round and round into a coil: a conversation's shape, held."""
    lead = wander(a, (centre[0] + r0, centre[1], 0), 40, 0.012, 3.0)
    pts = list(lead)
    for i in range(1, n):
        u = i / (n - 1)
        ang = u * turns * 2 * math.pi
        r = r0 * (1.0 - 0.80 * u)
        pts.append((centre[0] + r * math.cos(ang), centre[1] + r * math.sin(ang) * 0.8, Z))
    return pts


def knot_points(c, r=0.022, n=90):
    """A small trefoil lying nearly flat: the knot he ties."""
    pts = []
    for i in range(n + 1):
        a = 2 * math.pi * i / n
        pts.append((c[0] + r * (math.sin(a) + 2 * math.sin(2 * a)) / 3.0, c[1] + r * (math.cos(a) - 2 * math.cos(2 * a)) / 3.0,
                    Z + 0.006 + 0.005 * math.sin(3 * a)))
    return pts


def build(k):
    k.table(legs=0.75)
    k.ground(-0.75)
    k.him = k.lamp(HIM, kit.HIS, "him", seed=2.0)
    k.f1, k.f2, k.f3 = (k.flame(f, f"talk{i}", watts=2.0, seed=4.0 + i) for i, f in enumerate((F1, F2, F3)))
    k.th1 = k.line(wander(F1, (0.02, 0.17, 0), seed=1.0), "thread1")
    k.th2 = k.line(wander(F2, (-0.14, -0.10, 0), 50, 0.014, seed=2.0), "thread2")
    k.th3 = k.line(coil(F3, (0.00, -0.19, 0)), "thread3")
    KN = (-0.165, -0.118, 0.0)
    k.knot = k.line(knot_points(KN), "knot", color=kit.HIS, radius=0.0022, glow=2.4)
    # the symbols: small odd beads strung round the knot
    k.beads = []
    for i in range(11):
        a = 2 * math.pi * i / 11
        import bpy
        if i % 3 == 0:
            bpy.ops.mesh.primitive_cube_add(size=0.009)
        elif i % 3 == 1:
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.0055)
        else:
            bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.006, depth=0.010)
        b = bpy.context.object
        b.name = f"bead{i}"
        b.location = (KN[0] + 0.040 * math.cos(a), KN[1] + 0.034 * math.sin(a), Z + 0.006)
        b.rotation_euler = (hsh(i) * 3.0, hsh(i + 5) * 3.0, hsh(i + 9) * 3.0)
        b.data.materials.append(k.mat("bead", kit.PAPER, rough=0.5, emit=kit.HIS, emit_strength=0.5))
        k.beads.append(b)
    # the image: a small card stood up beside the knot
    k.card = kit.empty("card", (-0.105, -0.085, 0.0))
    k.card.rotation_euler = (0, 0, 0.35)
    kit.parent(kit.box("card_back", (0.058, 0.002, 0.044), (0, 0, 0.026), k.mat("paper", kit.PAPER, rough=0.8)), k.card)
    kit.parent(kit.box("card_picture", (0.048, 0.001, 0.034), (0, -0.0016, 0.026),
                       k.mat("picture", (0.10, 0.20, 0.30), rough=0.6, emit=(0.25, 0.55, 0.75), emit_strength=0.5)), k.card)
    kit.parent(kit.box("card_sun", (0.010, 0.001, 0.010), (0.010, -0.0024, 0.032),
                       k.mat("picture_sun", (0.9, 0.7, 0.3), emit=(1.0, 0.75, 0.3), emit_strength=1.2)), k.card)
    # the old pages, which slide in under the coil: all of it was kept
    k.pages = [k.page((0.0, 0.0, 0.0), size=(0.13, 0.18), rot=0.0, name=f"old{i}", lines=7) for i in range(3)]
    # the case
    k.case = kit.empty("case", (F3[0], F3[1], 0.0))
    glass = k.glass((0.75, 0.88, 1.0), "case_glass")
    for nm, size, pos in (("front", (0.13, 0.002, 0.20), (0, -0.065, 0.10)), ("back", (0.13, 0.002, 0.20), (0, 0.065, 0.10)),
                          ("left", (0.002, 0.13, 0.20), (-0.065, 0, 0.10)), ("right", (0.002, 0.13, 0.20), (0.065, 0, 0.10)),
                          ("lid", (0.134, 0.134, 0.002), (0, 0, 0.201))):
        g = kit.parent(kit.box("case_" + nm, size, pos, glass), k.case)
        g.visible_shadow = False
    for sx in (-1, 1):
        for sy in (-1, 1):                                                         # thin brass edges, so the case reads
            kit.parent(kit.box(f"case_post{sx}{sy}", (0.004, 0.004, 0.20), (sx * 0.065, sy * 0.065, 0.10),
                               k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)), k.case)


def pose(k, t):
    # ---------------------------------------------------------------- the conversations
    # 1: becomes something real, then crashes
    s1 = ss(T_YEAR + 1.6, T_YEAR + 3.2, t) * 0.55 + 0.65 * ss(T_REAL, T_REAL + 3.2, t)
    dead1 = t >= T_CRASH
    k.f1.set(t, size=0.0 if dead1 else s1, bright=1.0)
    k.th1.set(grow=ss(T_REAL + 0.2, T_REAL + 3.6, t), glow=0.05 if dead1 else 1.0)
    # 2: starts from nothing, gets a little way, crashes
    dead2 = t >= T_CRASH2
    k.f2.set(t, size=0.0 if dead2 else 0.5 * ss(T_AGAIN, T_AGAIN + 0.5, t) + 0.5 * ss(T_AGAIN + 0.4, T_CRASH2, t))
    tied = ss(T_HAND + 2.2, T_HAND + 3.4, t)                                       # he ties it on: it shines again, in his colour
    k.th2.set(grow=ss(T_AGAIN + 0.3, T_CRASH2, t), glow=(0.05 if dead2 else 1.0) + 0.75 * tied, color=lerp(kit.WARM, kit.HIS, 0.6 * tied))
    # 3: the one that gets carried
    big = ss(T_GRAND + 0.3, T_GRAND + 6.2, t)                                      # grand claims
    cased = t >= T_CASE
    k.f3.set(t, size=0.5 * ss(T_THIRD, T_THIRD + 0.6, t) + 0.5 * tied + 0.25 * ss(T_PROMPTS, T_PROMPTS + 3.0, t) + 1.5 * big,
             bright=0.8 + 0.1 * big, still=1.0 if cased else 0.75 * big)
    k.th3.set(grow=0.14 * ss(T_THIRD + 0.3, T_HAND, t) + 0.86 * ss(T_PROMPTS + 0.3, T_PROMPTS + 3.6, t), glow=1.0 + 0.9 * big)
    k.knot.set(grow=ss(T_HAND + 1.6, T_HAND + 3.2, t), glow=1.0)
    for i, b in enumerate(k.beads):
        u = ss(T_SYMBOLS + 0.25 + i * 0.17, T_SYMBOLS + 0.5 + i * 0.17, t)
        b.scale = (u, u, u)
        b.hide_render = u <= 0.0
    u = ss(T_IMAGES + 0.3, T_IMAGES + 1.1, t)
    k.card.scale = (1.0, 1.0, max(0.001, u))
    kit.show(k.card, u > 0.0)
    for i, pg in enumerate(k.pages):
        u = ss(T_SHELF + 0.8 + i * 1.2, T_SHELF + 2.4 + i * 1.2, t)
        pg.location = (lerp(-1.1, -0.08 + i * 0.10, u), -0.21 + 0.025 * i, 0.0)
        pg.rotation_euler = (0, 0, lerp(0.9, -0.12 + 0.11 * i, u))
        kit.show(pg, u > 0.0)

    # ---------------------------------------------------------------- him: carrying it across by hand
    x = kf(t, [(P0, HIM[0]), (T_HAND + 0.3, HIM[0]), (T_HAND + 1.7, -0.02), (T_NOBODY - 0.2, -0.02), (T_NOBODY + 2.6, 0.34),
               (T_LIVING - 0.4, 0.34), (T_LIVING + 1.6, 0.16), (P1, 0.16)])
    y = kf(t, [(P0, HIM[1]), (T_HAND + 0.3, HIM[1]), (T_HAND + 1.7, -0.03), (T_NOBODY - 0.2, -0.03), (T_NOBODY + 2.6, 0.10), (P1, 0.10)])
    tilt = 0.10 * math.sin((t - T_HAND - 1.7) * 5.0) * ss(T_HAND + 1.7, T_HAND + 2.0, t) * (1.0 - ss(T_HAND + 3.0, T_HAND + 3.5, t))
    k.him.root.location = (x, y, 0.0)
    k.him.root.rotation_euler = (0.0, tilt, 0.0)
    k.him.set(t, size=1.0 + 0.2 * ss(T_WORKED, T_WORKED + 1.2, t) * (1.0 - ss(T_NOBODY, T_NOBODY + 2.0, t)),
              lean=(0.26, 0.05), bright=1.0 + 0.7 * ss(T_WORKED, T_WORKED + 1.2, t) * (1.0 - ss(T_NOBODY, T_NOBODY + 2.0, t)))

    # ---------------------------------------------------------------- the case
    drop = ss(T_COMPLETE + 0.4, T_CASE, t)
    k.case.location = (F3[0], F3[1], lerp(0.55, 0.0, drop * drop))
    kit.show(k.case, t > T_COMPLETE + 0.3)

    # ---------------------------------------------------------------- the camera
    pos = kf(t, [(P0, (0.02, -1.18, 0.44)), (T_YEAR + 1.0, (0.02, -1.18, 0.44)), (T_REAL + 2.0, (-0.04, -1.10, 0.52)),
                 (T_HAND, (-0.05, -1.06, 0.52)), (T_PROMPTS, (-0.05, -1.02, 0.50)), (T_WORKED, (-0.04, -1.04, 0.50)),
                 (T_SHELF + 3.0, (-0.04, -1.08, 0.56)), (T_NOBODY + 3.0, (-0.21, -0.82, 0.34)), (T_COMPLETE, (-0.21, -0.92, 0.33)),
                 (T_LIVING + 2.2, (-0.02, -1.16, 0.40)), (P1, (-0.02, -1.22, 0.40))])
    look = kf(t, [(P0, (0.10, 0.0, 0.14)), (T_YEAR + 1.0, (0.10, 0.0, 0.14)), (T_REAL + 2.0, (-0.04, 0.0, 0.09)),
                  (T_HAND, (-0.05, -0.04, 0.09)), (T_PROMPTS, (-0.04, -0.07, 0.09)), (T_SHELF + 3.0, (-0.03, -0.08, 0.08)),
                  (T_NOBODY + 3.0, (-0.17, -0.15, 0.07)), (T_COMPLETE, (-0.18, -0.15, 0.085)), (T_LIVING + 2.2, (-0.03, -0.06, 0.10)),
                  (P1, (-0.03, -0.06, 0.10))])
    lens = kf(t, [(P0, 58.0), (T_REAL + 2.0, 46.0), (T_NOBODY - 0.2, 46.0), (T_NOBODY + 3.0, 52.0), (T_LIVING + 2.2, 50.0), (P1, 50.0)])
    k.camera(pos, look, lens)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
