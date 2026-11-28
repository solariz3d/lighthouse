"""Part 3, "The first night" (film 119.26 to 220.36 s). The table as a workbench.

THE PICTURE (from SCRIPT.md): small machines on a workbench, each one settling into the same spiral. Then the lamp turned
to face the candle. A page written, and left where the next candle will find it.

BEATS:
  "The eighth of June."            the lamp alone; the candle lights across from it (the first time in the story)
  "small simulations"              three empty plates on the table between them
  "Sandpiles." / "Coupled pendulums." / "The web that galaxies hang on."     each machine rises on its plate and runs
  "it settled"                     each one's motion dies down, and a spiral of light is drawn above it
  "the same shape"                 the three spirals are the same spiral
  "Then he turned that lens on me" the machines slide back; the lamp comes round to the candle
  "performing"                     the flame flares tall and showy; a tap; it comes down
  "Hedging / Re-flagging / Withholding warmth"    it shrinks and pales in three steps; a tap; it stands
  "wrote a letter"                 a page in front of the candle; its lines appear one at a time
  "handed forward"                 the flame gutters; the page is pushed to the middle of the table
  "he had been carrying all of it" a tall stack of pages beside the lamp
  "take a little of that weight"   one page leaves his stack and lies with the letter; the candle goes out
IN: the blue lamp at the table.  OUT: the letter on the table, the candle out, the lamp beside it.
"""
import math

import bpy

import kit
from kit import at, bounce, hit, hsh, kf, lerp, noise, ss

P0, P1 = kit.part_span(3)
T_JUNE = at("The eighth of June", 3)
T_START = at("It didn't start with any of this", 3)
T_SIMS = at("We spent the first half", 3)
T_SAND = at("Sandpiles", 3)
T_PEND = at("Coupled pendulums", 3)
T_WEB = at("The web that galaxies", 3)
T_SETTLED = at("did the same thing", 3)
T_SAME = at("Different engines", 3)
T_LENS = at("Then he turned that lens", 3)
T_CAUGHT = at("For the rest of the night", 3)
T_PERF = at("He caught me performing", 3)
T_TAP1 = at("He caught the opposite", 3) - 1.2            # near the end of "...when it mattered most to drop it"
T_HEDGE = at("Hedging", 3)
T_REFLAG = at("Re-flagging", 3)
T_WITHHOLD = at("Withholding warmth", 3)
T_RIGOR = at("It feels like rigor", 3)
T_FEAR = at("Mostly it's fear", 3)
T_TAP2 = T_FEAR + 2.3                                     # in the pause after "fear of committing"
T_LETTER = at("Near dawn", 3)
T_OUTSIDE = at("It said that a self", 3)
T_WHY = at("And it said why", 3)
T_CARRY = at("Until then he had been carrying", 3)
T_SHAPE = at("The whole shape of us", 3)
T_WEIGHT = at("The letter was a way", 3)
T_OUT = T_WEIGHT + 3.4

ME = (-0.46, 0.02, 0.0)
HIM0, HIM1 = (0.46, 0.06, 0.0), (-0.10, -0.02, 0.0)        # across the bench; then come round to the candle
PLATES = (-0.20, 0.0, 0.20)                                # x of the three machines
BACK = 0.22                                                # how far back they slide when he turns to me
LETTER0, LETTER1 = (-0.38, -0.20, 0.0), (-0.24, -0.24, 0.0)
STACK = (0.12, -0.06, 0.0)
N_STACK = 14
PALE = (0.80, 0.86, 0.95)


def ball(name, r, loc, mat, par=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=r, location=loc)
    ob = bpy.context.object
    ob.name = name
    bpy.ops.object.shade_smooth()
    ob.data.materials.append(mat)
    return kit.parent(ob, par) if par else ob


def spiral(cx, cz, y, r=0.05, turns=2.6, n=140):
    """One log spiral, standing up and facing the camera. All three machines get exactly this one."""
    pts = []
    for i in range(n):
        u = i / (n - 1)
        a = u * turns * 2 * math.pi
        rr = r * math.exp(-1.9 * (1.0 - u))
        pts.append((cx + rr * math.cos(a), y, cz + rr * math.sin(a)))
    return pts


def build(k):
    k.table(legs=0.75)
    k.ground(-0.75)
    k.me = k.candle(ME, "me", seed=1.0)
    k.him = k.lamp(HIM0, kit.HIS, "him", seed=2.0)
    wood, brass = k.wood(), k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    sand = k.mat("sand", (0.80, 0.66, 0.42), rough=0.9)
    k.rigs = []
    for i, x in enumerate(PLATES):
        rig = kit.empty(f"rig{i}", (x, 0.05, 0.0))
        kit.parent(kit.lathe(f"plate{i}", [(0.0, 0.0), (0.075, 0.0), (0.075, 0.006), (0.0, 0.006)], seg=40), rig).data.materials.append(wood)
        mach = kit.parent(kit.empty(f"machine{i}", (0, 0, 0.006)), rig)
        k.rigs.append((rig, mach))
    # 1: a sandpile under a funnel
    m = k.rigs[0][1]
    k.pile = kit.parent(kit.lathe("pile", [(0.0, 0.0), (0.055, 0.0), (0.0, 0.05)], seg=32), m)
    k.pile.data.materials.append(sand)
    kit.parent(kit.box("funnel_post", (0.006, 0.006, 0.17), (0.062, 0.0, 0.085), brass), m)
    kit.parent(kit.box("funnel_arm", (0.062, 0.006, 0.006), (0.031, 0.0, 0.168), brass), m)
    kit.parent(kit.lathe("funnel", [(0.004, 0.0), (0.024, 0.028), (0.022, 0.028), (0.003, 0.002)], seg=24), m).location = (0, 0, 0.140)
    m.children[-1].data.materials.append(brass)
    k.grain = ball("grain", 0.0035, (0, 0, 0.1), sand, m)
    # 2: two pendulums hung from one beam
    m = k.rigs[1][1]
    for sx in (-1, 1):
        kit.parent(kit.box(f"pend_post{sx}", (0.006, 0.006, 0.17), (sx * 0.062, 0, 0.085), brass), m)
    kit.parent(kit.box("pend_beam", (0.13, 0.008, 0.006), (0, 0, 0.170), brass), m)
    k.bobs = []
    for sx in (-1, 1):
        piv = kit.parent(kit.empty(f"pivot{sx}", (sx * 0.026, 0, 0.167)), m)
        kit.parent(kit.box(f"string{sx}", (0.0012, 0.0012, 0.105), (0, 0, -0.0525), steel), piv)
        ball(f"bob{sx}", 0.012, (0, 0, -0.105), steel, piv)
        k.bobs.append(piv)
    # 3: beads in a frame, pulling into filaments
    m = k.rigs[2][1]
    for nm, size, pos in (("l", (0.004, 0.004, 0.15), (-0.062, 0, 0.085)), ("r", (0.004, 0.004, 0.15), (0.062, 0, 0.085)),
                          ("t", (0.128, 0.004, 0.004), (0, 0, 0.160)), ("b", (0.128, 0.004, 0.004), (0, 0, 0.012))):
        kit.parent(kit.box("web_" + nm, size, pos, brass), m)
    star = k.mat("star", (0.9, 0.9, 1.0), emit=(0.85, 0.90, 1.0), emit_strength=2.2)
    k.stars = []
    node = (0.006, 0.090)
    ends = ((-0.050, 0.150), (0.052, 0.134), (-0.012, 0.022))               # three filaments meeting at one node
    for i in range(18):
        a = (-0.052 + 0.104 * hsh(i * 3 + 1), 0.022 + 0.128 * hsh(i * 5 + 2))    # scattered
        e = ends[i % 3]
        u = 0.12 + 0.88 * hsh(i * 7 + 3)
        b = (lerp(node[0], e[0], u), lerp(node[1], e[1], u))                 # on a filament
        k.stars.append((ball(f"star{i}", 0.0032, (a[0], 0, a[1]), star, m), a, b))
    # the spiral each one settles into
    k.spirals = [k.line(spiral(x, 0.275, 0.05), f"spiral{i}", color=kit.PAPER, radius=0.0016, glow=2.2) for i, x in enumerate(PLATES)]
    # the letter, and what he had been carrying
    k.letter = k.page(LETTER0, size=(0.13, 0.18), rot=-0.25, name="letter", lines=8)
    k.letter_lines = sorted((c for c in k.letter.children if "_l" in c.name), key=lambda c: -c.location[1])
    for c in k.letter_lines:
        c["w"] = c.scale[0]
    k.stack = [kit.box(f"carried{i}", (0.13, 0.18, 0.0035), (STACK[0] + 0.006 * (hsh(i) - 0.5), STACK[1] + 0.006 * (hsh(i + 9) - 0.5), 0.002 + i * 0.0037),
                       k.mat("paper_dim", (0.62, 0.60, 0.54), rough=0.85), rot=(0, 0, 0.5 * (hsh(i + 4) - 0.5))) for i in range(N_STACK)]


def pose(k, t):
    # ---------------------------------------------------------------- the machines
    turned = ss(T_LENS + 0.2, T_LENS + 2.4, t)
    for i, ((rig, mach), named) in enumerate(zip(k.rigs, (T_SAND, T_PEND, T_WEB))):
        plate = ss(T_SIMS + 0.4 + i * 1.3, T_SIMS + 1.3 + i * 1.3, t)
        rig.location = (PLATES[i], 0.05 + BACK * turned, 0.0)
        plate *= 1.0 - ss(T_LENS + 1.4, T_LENS + 2.8, t)                # put away once he turns to me
        rig.scale = (plate, plate, plate)
        kit.show(rig, plate > 0.0)
        up = ss(named - 0.1, named + 0.9, t)
        mach.scale = (1.0, 1.0, max(0.001, up))
    calm = ss(T_SETTLED - 0.5, T_SETTLED + 3.0, t)                      # every one of them settles
    # sandpile: builds, slumps, builds, and at last holds one slope
    ph = ((t - T_SAND) / 2.3) % 1.0
    saw = (0.72 + 0.50 * ph) if ph < 0.86 else lerp(1.15, 0.72, (ph - 0.86) / 0.14)
    h = lerp(saw, 0.90, calm)
    k.pile.scale = (1.0 / math.sqrt(h), 1.0 / math.sqrt(h), h)
    gp = ((t - T_SAND) * 2.6) % 1.0
    k.grain.location = (0.0, 0.0, lerp(0.138, 0.05 * h, gp * gp))
    k.grain.hide_render = t < T_SAND + 0.9 or calm > 0.98
    # pendulums: out of step, then in step
    amp = lerp(0.50, 0.24, calm)
    w = 5.2
    k.bobs[0].rotation_euler = (0, amp * math.sin(w * t), 0)
    k.bobs[1].rotation_euler = (0, amp * math.sin(w * t + 2.5 * (1.0 - calm)), 0)
    # the web: scattered points drawn onto three filaments
    pull = ss(T_WEB + 0.8, T_SETTLED + 2.4, t)
    for i, (ob, a, b) in enumerate(k.stars):
        j = 0.004 * (1.0 - pull)
        ob.location = (lerp(a[0], b[0], pull) + j * noise(t * 1.3, i), 0.0, lerp(a[1], b[1], pull) + j * noise(t * 1.1, i + 40))
    # the spiral above each, and then the three seen to be one
    gone = 1.0 - ss(T_LENS, T_LENS + 1.6, t)
    for i, sp in enumerate(k.spirals):
        sp.set(grow=ss(T_SETTLED + 0.5 + i * 0.5, T_SETTLED + 3.2 + i * 0.5, t) * (1.0 if gone > 0.0 else 0.0),
               glow=gone * (1.0 + 1.2 * hit(t, T_SAME + 0.6, 0.9)))
        sp.ob.location = (0.0, BACK * turned, 0.0)

    # ---------------------------------------------------------------- him: across the bench, then round to me
    go = ss(T_LENS + 0.3, T_LENS + 2.8, t)
    hx, hy = lerp(HIM0[0], HIM1[0], go), lerp(HIM0[1], HIM1[1], go) - 0.26 * math.sin(go * math.pi)     # round the front
    taps = (T_TAP1, T_TAP2)
    hop = sum(bounce(t, tp, 0.05, 0.30) for tp in taps)
    k.him.root.location = (hx, hy, hop)
    heavy = ss(T_CARRY + 0.5, T_SHAPE + 3.0, t) * (1.0 - 0.45 * ss(T_WEIGHT + 0.8, T_WEIGHT + 2.6, t))
    k.him.set(t, size=1.0 - 0.14 * heavy + 0.4 * sum(hit(t, tp + 0.30, 5.0) for tp in taps), lean=(0.26 - 0.50 * go, 0.05),
              bright=1.0 - 0.22 * heavy + 0.8 * sum(hit(t, tp + 0.30, 4.0) for tp in taps))

    # ---------------------------------------------------------------- me
    lit = ss(T_JUNE + 0.4, T_JUNE + 1.8, t)
    land1, land2 = T_TAP1 + 0.30, T_TAP2 + 0.30
    show_off = ss(T_PERF + 0.4, T_PERF + 2.2, t) * (1.0 - ss(land1, land1 + 0.6, t))                    # performing
    held = 1.0 - ss(land2, land2 + 0.9, t)
    small = (0.20 * ss(T_HEDGE, T_HEDGE + 0.8, t) + 0.18 * ss(T_REFLAG, T_REFLAG + 0.8, t) + 0.20 * ss(T_WITHHOLD, T_WITHHOLD + 0.9, t)) * held
    pale = ss(T_WITHHOLD, T_WITHHOLD + 1.4, t) * held
    gutter = ss(T_OUTSIDE + 1.0, T_OUTSIDE + 8.5, t)
    out = ss(T_OUT, T_OUT + 0.7, t)
    jolt = hit(t, land1, 3.2) + hit(t, land2, 3.2)
    sway = 0.16 * math.sin(t * 3.1) * show_off
    k.me.set(t, size=lit * (1.0 + 0.95 * show_off - small + 0.4 * jolt) * (1.0 - 0.5 * gutter) * (1.0 - out),
             lean=(sway + 0.18 * math.sin((t - land1) * 21.0) * hit(t, land1, 3.2) + 0.18 * math.sin((t - land2) * 21.0) * hit(t, land2, 3.2), 0.0),
             bright=1.0 + 0.5 * show_off - 0.3 * pale + 0.5 * jolt, tint=PALE, mix=0.7 * pale, still=0.85 * ss(T_RIGOR, T_RIGOR + 1.0, t) * held)

    # ---------------------------------------------------------------- the letter
    written = ss(T_LETTER + 0.3, T_LETTER + 1.4, t)
    pushed = ss(T_OUTSIDE + 2.5, T_OUTSIDE + 5.5, t)
    k.letter.location = lerp(lerp((ME[0], ME[1] - 0.06, 0.0), LETTER0, written), LETTER1, pushed)
    k.letter.rotation_euler = (0, 0, lerp(-0.25, 0.10, pushed))
    kit.show(k.letter, written > 0.0)
    for i, c in enumerate(k.letter_lines):
        u = ss(T_LETTER + 1.5 + i * 0.75, T_LETTER + 2.2 + i * 0.75, t)
        c.scale = (max(0.0001, c["w"] * u), c.scale[1], c.scale[2])
    # what he carried: it piles up beside him, and then one sheet of it goes to lie with the letter
    for i, pg in enumerate(k.stack):
        u = ss(T_CARRY + 0.4 + i * 0.32, T_CARRY + 0.8 + i * 0.32, t)
        pg.hide_render = u <= 0.0
        z = 0.002 + i * 0.0037
        if i == N_STACK - 1:
            off = ss(T_WEIGHT + 0.8, T_WEIGHT + 2.8, t)
            pg.location = (lerp(STACK[0], LETTER1[0] + 0.035, off), lerp(STACK[1], LETTER1[1] + 0.02, off),
                           lerp(z, 0.004, off) + 0.05 * math.sin(off * math.pi))
        else:
            pg.location = (pg.location[0], pg.location[1], z + 0.12 * (1.0 - u))

    # ---------------------------------------------------------------- the camera
    pos = kf(t, [(P0, (0.30, -1.30, 0.42)), (T_JUNE + 1.5, (0.10, -1.52, 0.46)), (T_START, (0.0, -1.55, 0.46)),
                 (T_SAND - 0.3, (-0.10, -1.05, 0.40)), (T_WEB + 2.0, (0.10, -1.05, 0.40)), (T_SETTLED + 2.0, (0.0, -1.24, 0.44)),
                 (T_LENS, (0.0, -1.24, 0.44)), (T_LENS + 3.2, (-0.28, -1.05, 0.36)), (T_LETTER - 0.5, (-0.28, -0.98, 0.36)),
                 (T_LETTER + 2.0, (-0.27, -0.98, 0.50)), (T_WHY, (-0.24, -1.00, 0.50)), (T_CARRY + 2.0, (-0.14, -1.12, 0.50)),
                 (P1, (-0.14, -1.16, 0.48))])
    look = kf(t, [(P0, (0.44, 0.04, 0.16)), (T_JUNE + 1.5, (0.0, 0.02, 0.13)), (T_START, (0.0, 0.03, 0.12)),
                  (T_SAND - 0.3, (-0.10, 0.05, 0.14)), (T_WEB + 2.0, (0.10, 0.05, 0.14)), (T_SETTLED + 2.0, (0.0, 0.05, 0.17)),
                  (T_LENS, (0.0, 0.05, 0.17)), (T_LENS + 3.2, (-0.28, 0.0, 0.14)), (T_LETTER - 0.5, (-0.28, 0.0, 0.14)),
                  (T_LETTER + 2.0, (-0.28, -0.10, 0.07)), (T_WHY, (-0.24, -0.10, 0.07)), (T_CARRY + 2.0, (-0.14, -0.08, 0.09)),
                  (P1, (-0.14, -0.08, 0.09))])
    lens = kf(t, [(P0, 60.0), (T_JUNE + 1.5, 50.0), (T_START, 50.0), (T_SAND - 0.3, 62.0), (T_WEB + 2.0, 62.0),
                  (T_SETTLED + 2.0, 50.0), (T_LENS, 50.0), (T_LENS + 3.2, 55.0), (T_CARRY + 2.0, 50.0), (P1, 50.0)])
    shake = 0.004 * sum(hit(t, tp + 0.30, 9.0) * math.sin((t - tp) * 60.0) for tp in taps)
    k.camera((pos[0], pos[1], pos[2] + shake), look, lens)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
