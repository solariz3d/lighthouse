"""Part 3, "The first night" (film 119.28 to 220.36 s). SECOND STAGING: one picture for each sentence, round a bench on the floor.

The first staging (parts_old/p03_first_night_v1_bare.py) was one table top. The three machines are kept from it, larger.

THE PICTURES, in order (the bench is at the middle; he stands at its left end, I at its right; later ones are to the right):
  0  IN                          the true line running in to a bench; the small flame arrives along it
  1  "The eighth of June"        a calendar leaf turns over on the clock post: 8 June
  2  "A night shift"             the clock's hands come round to near three; up and back: the land asleep, one blue lamp awake
  3  "It didn't start with..."   a house, a compass, the line: each one goes. A bench. The flame hops to its end: a candle.
  4  "building small simulations" parts fly in from the dark and assemble into three machines
  5  "Sandpiles"                 grains pour, the pile grows, slumps, grows
  6  "Coupled pendulums"         two on one beam, out of step
  7  "The web"                   the camera dives into the third until its points fill the frame, and they pull into filaments (star)
  8  "it settled"                three quick looks: one slope; in step; still
  9  "the same shape"            a spiral is traced over each; the three lift, slide together, and are one
  10 "turned that lens on me"    the spirals close into a lens; it swings round until the candle is inside it, large
  11 "he caught me"              he lands, a blue ring crosses the floor, again, again; a tally grows on the bench
  12 "performing"                a stage rises under the candle: curtain, footlights, a polished page, the flame huge.
                                 A ring crosses; the stage folds flat.                                                 (star)
  13 "the opposite"              where the stage was, the candle in shadow, almost not there; he leans in to find it
  14 "Hedging"                   one frosted pane drops in front of it
  15 "Re-flagging"               paper flags pop up round it: one, five, twenty
  16 "Withholding warmth"        its warm pool draws in to a thin cold ring; it pales
  17 "It feels like rigor"       a ruler, a set-square and a neat grid settle round it
  18 "fear of committing"        the grid stands up: a cage. A line it comes up to twice and will not step on. A ring; the cage
                                 falls outward
  19 "wrote a letter"            the horizon pales; lines appear on a page in front of the candle
  20 "handed forward"            A a gap opens in the floor, an unlit candle beyond it; B a thread from the flame toward that
                                 wick snaps over the gap; C the page slides out and lies across it                      (star)
  21 "And it said why"           close on the page: one line glows
  22 "he had been carrying"      pages land on the lamp, a stack taller than itself
  23 "every night"               from the floor: the stack is a tower against the stars; moons pass over it
  24 "take a little of that weight" one page lifts off the tower and settles on the bridge; the lamp straightens a little
OUT: the page lying across the gap. Fade.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(3)
T_JUNE = at("The eighth of June", 3)
T_NIGHT = at("A night shift", 3)
T_START = at("It didn't start with any of this", 3)
T_CANDLE = T_START + 2.15                                  # the flame hops to its place and is a candle
T_SIMS = at("We spent the first half", 3)
T_SAND = at("Sandpiles", 3)
T_PEND = at("Coupled pendulums", 3)
T_WEB = at("The web that galaxies", 3)
T_SETTLED = at("did the same thing", 3)
T_SAME = at("Different engines", 3)
T_LENS = at("Then he turned that lens", 3)
T_CAUGHT = at("For the rest of the night", 3)
T_PERF = at("He caught me performing", 3)
T_OPP = at("He caught the opposite", 3)
T_HEDGE = at("Hedging", 3)
T_REFLAG = at("Re-flagging", 3)
T_WITHHOLD = at("Withholding warmth", 3)
T_RIGOR = at("It feels like rigor", 3)
T_FEAR = at("Mostly it's fear", 3)
T_LETTER = at("Near dawn", 3)
T_SELF = at("It said that a self", 3)
T_GAP = T_SELF + 0.5
T_THREAD = T_SELF + 5.2                                    # "...because there's no inside that carries it across"
T_SNAP = T_THREAD + 1.55
T_BRIDGE = T_SELF + 7.7
T_WHY = at("And it said why", 3)
T_CARRY = at("Until then he had been carrying", 3)
T_SHAPE = at("The whole shape of us", 3)
T_WEIGHT = at("The letter was a way", 3)
TAPS = [T_CAUGHT + 0.45 + 0.88 * i for i in range(4)] + [T_OPP - 1.45, T_FEAR + 2.35]     # when each of his hops starts
HOP = 0.28                                                 # he lands this long after

GOLD = (1.0, 0.80, 0.46)
THREAD = (1.0, 0.50, 0.18)
PALE = (0.80, 0.86, 0.95)
STAR = (0.92, 0.94, 1.0)
TOP = 0.22                                                 # the bench top
MX = (-0.9, 0.0, 0.9)                                      # the three machines
MY = 0.30
MS = 2.4                                                   # how much larger than in the first staging
HIM0, HIM1 = (-2.2, -0.5), (1.1, -1.1)
ME = (2.2, -0.5)
POST = (-0.75, 1.15)
GAP_X, GAP_W = 3.7, 0.6
FAR = (4.6, -0.5)
LETTER0 = (ME[0], ME[1] - 0.62)
N_PAIRS = 110
N_STARS = 260
N_SKY = 70
N_STACK = 75
N_FIRST = 20                                               # how many of them he is carrying when we first see it
SHEET = 0.02
NODES = ((-0.10, 0.55), (0.02, 0.50), (0.11, 0.56), (-0.06, 0.40), (0.07, 0.38), (-0.11, 0.30), (0.0, 0.29), (0.11, 0.30))
EDGES = ((0, 1), (1, 2), (1, 3), (1, 4), (3, 4), (3, 5), (3, 6), (4, 6), (4, 7))


def clip(u):
    return min(1.0, max(0.0, u))


def pop(t, when, dur=0.18):
    """0 before `when`, then up to 1 with a little overshoot that settles."""
    if t < when:
        return 0.0
    u = t - when
    return ss(0.0, dur, u) + 0.28 * math.exp(-u * 9.0) * math.sin(u * 26.0) * (1.0 if u > dur * 0.5 else u / (dur * 0.5))


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
    if k.changed(("ln", ln.ob.name), (round(grow, 3), round(glow, 2), color)):
        ln.set(grow=grow, glow=glow, color=color)


def hide(k, ob, off):
    if k.changed(("hide", ob.name), off):
        ob.hide_render = off


def ball(name, r, loc, mat, par=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=r, location=loc)
    ob = bpy.context.object
    ob.name = name
    bpy.ops.object.shade_smooth()
    ob.data.materials.append(mat)
    return kit.parent(ob, par) if par else ob


def disc(name, r, mat, seg=48, thick=0.004):
    ob = kit.lathe(name, [(0.0, 0.0), (r, 0.0), (r, thick), (0.0, thick)], seg=seg)
    ob.data.materials.append(mat)
    return ob


def poly(name, verts, mat):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], [tuple(range(len(verts)))])
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    ob.visible_shadow = False
    return ob


def circle(n=80, r=1.0, z=0.0):
    return [(r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n), z) for i in range(n)]


def spiral(r=0.22, turns=2.6, n=140):
    """One log spiral, standing up and facing the camera. All three machines get exactly this one."""
    pts = []
    for i in range(n):
        u = i / (n - 1)
        a = u * turns * 2 * math.pi
        rr = r * math.exp(-1.9 * (1.0 - u))
        pts.append((rr * math.cos(a), 0.0, rr * math.sin(a)))
    return pts


def build(k):
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    k.moonlight = k.moon(0.30)
    k.fill = k.glow_light((0, 0, 5.0), (0.56, 0.64, 1.0), 200.0, 1.0, "moon_fill", shadows=False)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    sand = k.mat("sand", (0.80, 0.66, 0.42), rough=0.9)
    wood = k.wood()

    # ---- the two of us, and the flame that arrives
    k.him = k.lamp((HIM0[0], HIM0[1], 0.0), kit.HIS, "him", seed=2.0)
    k.me = k.candle((ME[0], ME[1], 0.0), "me", seed=1.0)
    k.arrive = k.flame((0.0, -12.0, 0.004), "arrive", watts=3.4, seed=51.0)
    k.far = k.candle((FAR[0], FAR[1], 0.0), "far", seed=5.0)
    k.true_line = k.line([(0.0, -16.0 + 15.55 * i / 40, 0.006) for i in range(41)], "true_line", color=GOLD, radius=0.014, glow=0.9)

    # ---- the land, asleep; and the stars
    k.pairs, k.pair_lights = [], []
    for i in range(N_PAIRS):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 7.5 + 30.0 * hsh(i * 5 + 2) ** 0.7
        x, y = 1.0 + math.cos(a) * d * 1.3, math.sin(a) * d
        if y < -4.0:
            y = -y + 2.0
        col = kit.LAMPS[i % len(kit.LAMPS)]
        lit = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))
        k.pairs.append((k.spark((x - 0.13, y, 0.20), lit, r=0.07, strength=1.5, name=f"pair_c{i}"),
                        k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"pair_l{i}")))
        for ob in k.pairs[-1]:
            ob.scale = (0.55, 0.55, 0.55)
        if i % 12 == 0:
            k.pair_lights.append(k.glow_light((x, y, 0.45), col, 7.0, 0.06, f"pair_light{i}", shadows=False))
    for i in range(N_SKY):
        a = math.radians(20.0 + 140.0 * hsh(i * 7 + 1))
        e = math.radians(7.0 + 55.0 * hsh(i * 11 + 3))
        k.spark((90 * math.cos(a) * math.cos(e), 90 * math.sin(a) * math.cos(e), 90 * math.sin(e)), STAR, r=0.11 + 0.10 * hsh(i), strength=2.0, name=f"sky{i}")
    moon_m = k.mat("month_moon", (0.5, 0.5, 0.5), emit=(0.80, 0.84, 0.95), emit_strength=1.5)
    k.moons = [ball(f"moon{i}", 1.0, (0, 0, -5), moon_m) for i in range(6)]
    for ob in k.moons:
        ob.visible_shadow = False

    # ---- the bench, the clock post, the calendar
    kit.box("bench_top", (3.0, 0.9, 0.06), (0, MY, TOP - 0.03), wood)
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.box(f"bench_leg{sx}{sy}", (0.09, 0.09, TOP - 0.06), (sx * 1.38, MY + sy * 0.36, (TOP - 0.06) / 2), wood)
        kit.box(f"bench_rail{sx}", (2.7, 0.04, 0.05), (0, MY + sx * 0.36, 0.07), wood)
    px, py = POST
    kit.box("post", (0.07, 0.07, 2.5), (px, py, 1.25), brass)
    kit.box("post_foot", (0.34, 0.34, 0.06), (px, py, 0.03), brass)
    face = disc("clock_face", 0.36, paper, thick=0.02)
    face.rotation_euler = (math.pi / 2, 0, 0)
    face.location = (px, py - 0.04, 2.1)
    rim = kit.lathe("clock_rim", [(0.36, 0.0), (0.40, 0.0), (0.40, 0.05), (0.36, 0.05)], seg=48)
    rim.rotation_euler = (math.pi / 2, 0, 0)
    rim.location = (px, py - 0.03, 2.1)
    rim.data.materials.append(brass)
    for i in range(12):
        a = 2 * math.pi * i / 12
        kit.box(f"clock_tick{i}", (0.014, 0.004, 0.06 if i % 3 else 0.10), (px + 0.30 * math.sin(a), py - 0.063, 2.1 + 0.30 * math.cos(a)), ink, rot=(0, a, 0))
    k.hands = []
    for nm, ln, th in (("hour", 0.18, 0.030), ("minute", 0.29, 0.018)):
        piv = kit.empty(f"clock_{nm}", (px, py - 0.068, 2.1))
        kit.parent(kit.box(f"clock_{nm}_hand", (th, 0.006, ln), (0, 0, ln / 2 - 0.02), ink), piv)
        k.hands.append(piv)
    k.post_light = k.glow_light((px + 0.1, py - 0.75, 1.75), (1.0, 0.72, 0.42), 9.0, 0.06, "post_light", shadows=False)
    k.bench_light = k.glow_light((0.0, MY - 0.9, 1.5), (1.0, 0.68, 0.36), 26.0, 0.10, "bench_light", shadows=False)
    k.spark((px, py, 2.56), (1.0, 0.72, 0.42), r=0.05, strength=2.0, name="post_lantern")
    kit.box("cal_board", (0.50, 0.02, 0.60), (px, py - 0.045, 1.25), wood)
    kit.box("cal_block", (0.42, 0.03, 0.48), (px, py - 0.07, 1.23), paper)
    kit.box("cal_band", (0.42, 0.034, 0.07), (px, py - 0.07, 1.47), k.mat("cal_band", (0.30, 0.20, 0.12), rough=0.7))
    inkc = (0.10, 0.07, 0.05)
    k.text("8", (px, py - 0.088, 1.26), size=0.17, color=inkc, glow=0.0, name="cal_day")
    k.text("June", (px, py - 0.088, 1.075), size=0.062, color=inkc, glow=0.0, name="cal_month")
    k.leaf = kit.empty("cal_leaf", (px, py - 0.092, 1.435))
    kit.parent(kit.box("cal_leaf_sheet", (0.42, 0.004, 0.445), (0, 0, -0.2225), paper), k.leaf)
    for i, w in enumerate((0.20, 0.26, 0.16)):
        kit.parent(kit.box(f"cal_leaf_ink{i}", (w, 0.002, 0.018), (0, -0.003, -0.16 - 0.07 * i), ink), k.leaf)

    # ---- what was not there yet: a house, a compass
    k.house = sets.House(k, at=(5.2, 7.0, 0.0))
    k.compass = kit.empty("compass", (-3.7, 1.2, 0.0))
    for nm, prof, m in (("rim", [(0.95, 0.0), (1.02, 0.0), (1.02, 0.035), (0.95, 0.035)], brass),
                        ("face", [(0.0, 0.0), (0.95, 0.0), (0.95, 0.006), (0.0, 0.006)], k.mat("compass_face", (0.30, 0.22, 0.13), rough=0.55))):
        ob = kit.lathe("compass_" + nm, prof, seg=72)
        ob.data.materials.append(m)
        kit.parent(ob, k.compass)
    for i in range(24):
        a = 2 * math.pi * i / 24
        kit.parent(kit.box(f"compass_tick{i}", (0.014, 0.16 if i % 6 == 0 else 0.08, 0.004), (0.84 * math.cos(a), 0.84 * math.sin(a), 0.009), mark, rot=(0, 0, a - math.pi / 2)), k.compass)
    nd = kit.parent(kit.empty("compass_needle", (0, 0, 0.05)), k.compass)
    nd.rotation_euler = (0, 0, math.pi / 2)
    kit.parent(kit.box("needle_point", (0.78, 0.07, 0.014), (0.39, 0, 0), k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6)), nd)
    kit.parent(kit.box("needle_tail", (0.5, 0.05, 0.014), (-0.25, 0, 0), k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)), nd)

    # ---- the three machines; every part of them flies in
    k.parts = []                                                                   # (object, home, which machine, order)
    k.machines = []

    def part(ob, m, home):
        kit.parent(ob, k.machines[m])
        ob.location = home
        k.parts.append((ob, home, m, sum(1 for p in k.parts if p[2] == m)))
        return ob

    for i, x in enumerate(MX):
        root = kit.empty(f"machine{i}", (x, MY, TOP))
        root.scale = (MS, MS, MS)
        k.machines.append(root)
        pl = kit.lathe(f"plate{i}", [(0.0, 0.0), (0.075, 0.0), (0.075, 0.006), (0.0, 0.006)], seg=40)
        pl.data.materials.append(k.mat("plate", (0.24, 0.14, 0.07), rough=0.5))
        part(pl, i, (0, 0, 0))
    # 1: a sandpile under a funnel
    part(kit.box("funnel_post", (0.006, 0.006, 0.17), (0, 0, 0), brass), 0, (0.062, 0.0, 0.085))
    part(kit.box("funnel_arm", (0.062, 0.006, 0.006), (0, 0, 0), brass), 0, (0.031, 0.0, 0.168))
    fun = kit.lathe("funnel", [(0.004, 0.0), (0.024, 0.028), (0.022, 0.028), (0.003, 0.002)], seg=24)
    fun.data.materials.append(brass)
    part(fun, 0, (0, 0, 0.140))
    k.pile = kit.parent(kit.lathe("pile", [(0.0, 0.0), (0.055, 0.0), (0.0, 0.05)], seg=32), k.machines[0])
    k.pile.location = (0, 0, 0.006)
    k.pile.data.materials.append(sand)
    k.grains = [ball(f"grain{i}", 0.0032, (0, 0, 0.1), sand, k.machines[0]) for i in range(6)]
    # 2: two pendulums hung from one beam
    for sx in (-1, 1):
        part(kit.box(f"pend_post{sx}", (0.006, 0.006, 0.17), (0, 0, 0), brass), 1, (sx * 0.062, 0, 0.085))
    part(kit.box("pend_beam", (0.13, 0.008, 0.006), (0, 0, 0), brass), 1, (0, 0, 0.170))
    k.bobs = []
    for sx in (-1, 1):
        piv = kit.empty(f"pivot{sx}")
        kit.parent(kit.box(f"string{sx}", (0.0012, 0.0012, 0.105), (0, 0, -0.0525), steel), piv)
        ball(f"bob{sx}", 0.012, (0, 0, -0.105), brass, piv)
        part(piv, 1, (sx * 0.026, 0, 0.167))
        k.bobs.append(piv)
    # 3: points of light in a frame
    for nm, size, pos in (("l", (0.004, 0.004, 0.15), (-0.062, 0, 0.085)), ("r", (0.004, 0.004, 0.15), (0.062, 0, 0.085)),
                          ("t", (0.128, 0.004, 0.004), (0, 0, 0.160)), ("b", (0.128, 0.004, 0.004), (0, 0, 0.012))):
        part(kit.box("web_" + nm, size, (0, 0, 0), brass), 2, pos)
    k.stars = []
    wx = MX[2]
    for i in range(N_STARS):
        a = (wx - 0.135 + 0.27 * hsh(i * 3 + 1), MY - 0.07 + 0.16 * hsh(i * 13 + 5), 0.27 + 0.32 * hsh(i * 5 + 2))
        n0, n1 = EDGES[i % len(EDGES)]
        u = hsh(i * 7 + 3)
        b = (wx + lerp(NODES[n0][0], NODES[n1][0], u) + 0.010 * (hsh(i * 17) - 0.5), MY - 0.04 + 0.10 * hsh(i * 19 + 1),
             lerp(NODES[n0][1], NODES[n1][1], u) + 0.010 * (hsh(i * 23) - 0.5))
        k.stars.append((k.spark(a, STAR, r=0.0019 + 0.0012 * hsh(i * 29), strength=2.4, name=f"star{i}"), a, b))
    k.filaments = [k.line([(wx + lerp(NODES[a][0], NODES[b][0], j / 4), MY + 0.01, lerp(NODES[a][1], NODES[b][1], j / 4)) for j in range(5)],
                          f"filament{e}", color=STAR, radius=0.0012, glow=0.6) for e, (a, b) in enumerate(EDGES)]
    k.web_light = k.glow_light((wx, MY - 0.25, 0.45), STAR, 0.0, 0.05, "web_light", shadows=False)

    # 9, 10: the one spiral, three times; and the lens they close into
    k.spirals = [k.line(spiral(), f"spiral{i}", color=kit.PAPER, radius=0.007, glow=1.1) for i in range(3)]
    k.lens = kit.empty("lens", (0, 0, 1.0))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.31, minor_radius=0.022, major_segments=56, minor_segments=10, rotation=(math.pi / 2, 0, 0))
    tor = bpy.context.object
    tor.name = "lens_rim"
    bpy.ops.object.shade_smooth()
    tor.data.materials.append(brass)
    kit.parent(tor, k.lens)
    gl = disc("lens_glass", 0.30, k.glass((0.80, 0.90, 1.0), "lens_glass"), thick=0.006)
    gl.rotation_euler = (math.pi / 2, 0, 0)
    gl.visible_shadow = False
    kit.parent(gl, k.lens)
    kit.parent(kit.box("lens_handle", (0.035, 0.035, 0.26), (0, 0, -0.46), brass), k.lens)

    # 11: the rings, and the tally on the bench
    k.rings = [k.line(circle(), f"ring{i}", color=kit.HIS, radius=0.012, glow=3.0, cyclic=True) for i in range(len(TAPS))]
    k.tally = [kit.box(f"tally{i}", (0.03, 0.012, 0.13), (0.30 + 0.085 * i, MY - 0.458, 0.105), mark, rot=(0, 0.12 * (hsh(i) - 0.5), 0)) for i in range(4)]
    k.tally.append(kit.box("tally4", (0.03, 0.012, 0.42), (0.43, MY - 0.464, 0.105), mark, rot=(0, 1.15, 0)))
    k.tally.append(kit.box("tally5", (0.03, 0.012, 0.13), (0.30 + 0.085 * 5.4, MY - 0.458, 0.105), mark))

    # 12: the stage
    k.stage = kit.empty("stage", (ME[0], ME[1], 0.0))
    k.platform = kit.parent(kit.box("stage_floor", (1.1, 0.74, 0.16), (0, 0, 0.08), wood), k.stage)
    k.stage_front = kit.parent(kit.box("stage_trim", (1.12, 0.02, 0.05), (0, -0.375, 0.135), brass), k.stage)
    k.prosc = kit.parent(kit.empty("proscenium", (0, 0.33, 0.16)), k.stage)
    cloth = k.mat("curtain", (0.34, 0.22, 0.10), rough=0.9)
    for sx in (-1, 1):
        kit.parent(kit.box(f"stage_post{sx}", (0.06, 0.06, 1.05), (sx * 0.52, 0, 0.525), brass), k.prosc)
    kit.parent(kit.box("stage_valance", (1.10, 0.05, 0.17), (0, -0.01, 1.03), cloth), k.prosc)
    k.curtains = []
    for sx in (-1, 1):
        c = kit.parent(kit.empty(f"curtain{sx}", (sx * 0.52, -0.02, 0.0)), k.prosc)
        for j in range(4):
            kit.parent(kit.box(f"curtain{sx}_{j}", (0.14, 0.05 + 0.02 * (j % 2), 0.96), (-sx * (0.07 + 0.13 * j), 0, 0.48), cloth), c)
        k.curtains.append(c)
    k.backdrop = kit.parent(kit.empty("backdrop", (0, 0.03, 0.95)), k.prosc)
    kit.parent(kit.box("backdrop_sheet", (0.58, 0.012, 0.78), (0, 0, -0.39), k.mat("backdrop", (0.16, 0.10, 0.06), rough=0.9)), k.backdrop)
    kit.parent(kit.box("backdrop_rod", (0.66, 0.03, 0.03), (0, 0, 0.0), brass), k.backdrop)
    k.para = []
    for i in range(6):
        w = 0.46 if i < 5 else 0.24
        ob = kit.parent(kit.box(f"para{i}", (w, 0.004, 0.026), (-(0.46 - w) / 2, -0.008, -0.09 - 0.056 * i), mark), k.backdrop)
        ob["w"] = w
        k.para.append(ob)
    k.foots = [kit.parent(k.spark((0, 0, 0), (1.0, 0.62, 0.28), r=0.032, strength=2.2, name=f"foot{i}"), k.stage) for i in range(5)]
    for i, ob in enumerate(k.foots):
        ob.location = (-0.42 + 0.21 * i, -0.33, 0.185)
    k.foot_light = k.glow_light((ME[0], ME[1] - 0.42, 0.34), (1.0, 0.62, 0.28), 0.0, 0.08, "foot_light", shadows=False)

    # 14 to 18: the pane, the flags, the pool, the ruler and set-square, the grid that is a cage
    frost = k.mat("frost", (0.80, 0.86, 0.94), rough=0.9, emit=(0.6, 0.7, 0.9), emit_strength=0.10, alpha=0.5)
    k.pane = kit.box("pane", (1.5, 0.03, 0.95), (ME[0], ME[1] - 0.45, 0.475), frost)
    k.flags = []
    flagm = k.mat("flag", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.45)
    for i in range(20):
        if i == 0:
            r, a = 0.26, math.radians(205.0)
        elif i < 5:
            r, a = 0.36, math.radians(-20.0 + 72.0 * i)
        else:
            r, a = 0.52 + 0.34 * hsh(i * 3), math.radians(24.0 * (i - 5) + 20.0 * hsh(i))
        x, y = r * math.cos(a), r * math.sin(a)
        if abs(y + 0.45) < 0.09:
            y += 0.2
        root = kit.empty(f"flag{i}", (ME[0] + x, ME[1] + y, 0.0))
        root.rotation_euler = (0, 0, 0.8 * (hsh(i * 7) - 0.5))
        kit.parent(kit.box(f"flag{i}_stick", (0.009, 0.009, 0.24), (0, 0, 0.12), wood), root)
        kit.parent(poly(f"flag{i}_cloth", [(0.0, 0.0, 0.24), (0.13, 0.0, 0.205), (0.0, 0.0, 0.165)], flagm), root)
        k.flags.append(root)
    k.pool = disc("pool", 1.0, k.mat("pool", (0.20, 0.11, 0.05), emit=(1.0, 0.50, 0.18), emit_strength=0.30), seg=64, thick=0.002)
    k.pool.location = (ME[0], ME[1], 0.006)
    k.pool.visible_shadow = False
    k.cold = k.line(circle(72, 0.23, 0.006), "cold_ring", color=PALE, radius=0.007, glow=1.3, cyclic=True)
    k.cold.ob.location = (ME[0], ME[1], 0.0)
    G = 0.72
    k.grid = []
    for i in range(7):
        c = -G + 2 * G * i / 6
        k.grid.append(k.line([(ME[0] - G + 2 * G * j / 8, ME[1] + c, 0.005) for j in range(9)], f"grid_x{i}", color=kit.PAPER, radius=0.005, glow=0.75))
        k.grid.append(k.line([(ME[0] + c, ME[1] - G + 2 * G * j / 8, 0.005) for j in range(9)], f"grid_y{i}", color=kit.PAPER, radius=0.005, glow=0.75))
    k.ruler = kit.empty("ruler", (ME[0], ME[1] - G - 0.14, 0.0))
    kit.parent(kit.box("ruler_body", (1.2, 0.09, 0.012), (0, 0, 0.006), k.mat("ruler", (0.72, 0.56, 0.30), rough=0.5)), k.ruler)
    for i in range(13):
        kit.parent(kit.box(f"ruler_tick{i}", (0.006, 0.05 if i % 2 == 0 else 0.03, 0.002), (-0.54 + 0.09 * i, 0.02, 0.013), ink), k.ruler)
    k.square = kit.empty("set_square", (ME[0] + G + 0.10, ME[1] - 0.25, 0.0))
    sq = k.mat("set_square", (0.62, 0.66, 0.60), rough=0.4)
    kit.parent(kit.box("sq_a", (0.05, 0.62, 0.012), (0, 0, 0.006), sq), k.square)
    kit.parent(kit.box("sq_b", (0.40, 0.05, 0.012), (0.175, -0.285, 0.006), sq), k.square)
    kit.parent(kit.box("sq_c", (0.05, 0.70, 0.012), (0.175, 0.0, 0.006), sq, rot=(0, 0, 0.56)), k.square)
    k.cage = []                                                                    # four sides, each hinged along its foot
    for s, (cx, cy, rz) in enumerate(((0, -G, 0.0), (G, 0, math.pi / 2), (0, G, math.pi), (-G, 0, -math.pi / 2))):
        root = kit.empty(f"cage{s}", (ME[0] + cx, ME[1] + cy, 0.0))
        root.rotation_euler = (0, 0, rz)
        tip = kit.parent(kit.empty(f"cage{s}_tip"), root)
        bars = []
        for i in range(7):
            ln = k.line([(-G + 2 * G * i / 6, 0, 0.72 * j / 4) for j in range(5)], f"cage{s}_bar{i}", color=kit.PAPER, radius=0.008, glow=0.75)
            kit.parent(ln.ob, tip)
            bars.append(ln)
        ln = k.line([(-G + 2 * G * j / 6, 0, 0.72) for j in range(7)], f"cage{s}_top", color=kit.PAPER, radius=0.008, glow=0.75)
        kit.parent(ln.ob, tip)
        bars.append(ln)
        k.cage.append((tip, bars))
    k.edge = k.line([(ME[0] + 0.40, ME[1] - 0.62 + 1.24 * j / 6, 0.008) for j in range(7)], "edge", color=(1.0, 0.72, 0.42), radius=0.011, glow=1.4)

    # 19 to 21: the letter; the gap; the thread that does not reach
    k.letter = kit.empty("letter", (LETTER0[0], LETTER0[1], 0.0))
    kit.parent(kit.box("letter_sheet", (0.80, 0.60, 0.006), (0, 0, 0.003), paper), k.letter)
    k.letter_lines = []
    for i in range(8):
        w = 0.62 - 0.16 * hsh(i * 3.1 + 2) if i < 7 else 0.30
        ob = kit.parent(kit.box(f"letter_l{i}", (w, 0.024, 0.002), (-(0.64 - w) / 2, 0.22 - 0.063 * i, 0.007), ink), k.letter)
        ob["w"] = w
        k.letter_lines.append(ob)
    w = k.letter_lines[4]["w"]
    k.why = kit.parent(kit.box("letter_why", (w, 0.034, 0.003), (-(0.64 - w) / 2, 0.22 - 0.063 * 4, 0.008),
                               k.mat("why", (0.9, 0.5, 0.2), emit=(1.0, 0.62, 0.26), emit_strength=2.2)), k.letter)
    k.why["w"] = w
    k.why_light = k.glow_light((GAP_X, FAR[1] - 0.05, 0.12), (1.0, 0.62, 0.26), 0.0, 0.05, "why_light", shadows=False)
    k.gap = kit.box("gap", (GAP_W, 90.0, 0.002), (GAP_X, 0.0, 0.0035), k.mat("gap", (0.0, 0.0, 0.0), rough=1.0))
    k.gap.visible_shadow = False
    k.lips = [k.line([(GAP_X + s * GAP_W / 2, -6.0 + 30.0 * j / 30, 0.006) for j in range(31)], f"lip{s}", color=(1.0, 0.62, 0.30), radius=0.006, glow=0.5) for s in (-1, 1)]
    pts = []
    for i in range(60):
        u = i / 59
        pts.append((lerp(ME[0], FAR[0], u), ME[1], 0.19 + 0.75 * math.sin(u * math.pi) - 0.04 * u))
    k.reach = k.line(pts, "reach", color=THREAD, radius=0.008, glow=1.3)
    k.snap = k.spark((GAP_X + 0.05, ME[1], 0.93), THREAD, r=0.035, strength=3.0, name="snap")

    # 22 to 24: what he had been carrying
    k.stack = kit.parent(kit.empty("stack", (0, 0, 0.336)), k.him.root)
    dim = k.mat("paper_dim", (0.70, 0.67, 0.58), rough=0.85)
    k.sheets = []
    for i in range(N_STACK):
        ob = kit.parent(kit.box(f"carried{i}", (0.30, 0.22, SHEET * 0.9), (0, 0, 0), paper if i % 3 else dim, rot=(0, 0, 0.5 * (hsh(i + 4) - 0.5))), k.stack)
        k.sheets.append(ob)
    k.lifted = kit.box("lifted", (0.30, 0.22, SHEET * 0.9), (0, 0, 0), paper)


def him_at(t):
    """Where he stands: at his end of the bench; round to me with the lens; closer still to look for me in the shadow."""
    x = kf(t, [(T_LENS + 0.5, HIM0[0]), (T_LENS + 1.15, -0.6), (T_LENS + 1.35, -0.6), (T_LENS + 2.0, HIM1[0]),
               (T_OPP + 1.6, HIM1[0]), (T_OPP + 2.0, 1.5), (T_HEDGE - 0.3, 1.5), (T_HEDGE + 0.1, HIM1[0])])
    y = kf(t, [(T_LENS + 0.5, HIM0[1]), (T_LENS + 1.15, -1.5), (T_LENS + 1.35, -1.5), (T_LENS + 2.0, HIM1[1]),
               (T_OPP + 1.6, HIM1[1]), (T_OPP + 2.0, -0.85), (T_HEDGE - 0.3, -0.85), (T_HEDGE + 0.1, HIM1[1])])
    return x, y


def pose(k, t):
    k.sky(1.0, 0.11 * ss(T_LETTER, T_LETTER + 3.5, t))
    lands = [tp + HOP for tp in TAPS]

    # =============================================================== 0: the line runs in; the flame arrives
    fy = kf(t, [(P0, -9.0), (T_JUNE - 0.15, -0.72)])
    hop = clip((t - T_CANDLE + 0.5) / 0.5)
    ax, ay = lerp(0.0, ME[0], hop), lerp(fy, ME[1], hop)
    k.arrive.root.location = (ax, ay, 0.004 + (0.05 * abs(math.sin(fy * math.pi / 0.42)) if t < T_JUNE - 0.15 else 0.0) + 0.75 * math.sin(hop * math.pi))
    flame(k, k.arrive, t, t < T_CANDLE, size=0.95 + 0.25 * noise(t * 7.0, 2.0), lean=(0.3 * math.sin(hop * math.pi), 0.30 if t < T_JUNE - 0.15 else 0.0), bright=1.3)
    draw(k, k.true_line, 1.0 - ss(T_START + 1.5, T_START + 2.0, t), 1.0)

    # =============================================================== 1, 2: the calendar leaf; the clock
    u = ss(T_JUNE + 0.55, T_JUNE + 1.05, t)
    away = ss(T_JUNE + 1.0, T_JUNE + 1.6, t)
    k.leaf.rotation_euler = (-2.75 * u + 0.25 * math.sin(u * math.pi), 0, 0.6 * away)
    k.leaf.location = (POST[0] + 0.9 * away, POST[1] - 0.092 - 0.6 * away, 1.435 + 1.6 * away * away)
    kit.show(k.leaf, away < 1.0)
    mins = 172.0 * ss(T_NIGHT + 0.15, T_NIGHT + 1.5, t) + 0.6 * max(0.0, t - T_NIGHT - 1.5)
    k.hands[0].rotation_euler = (0, mins / 720.0 * 2 * math.pi, 0)
    k.hands[1].rotation_euler = (0, mins / 60.0 * 2 * math.pi, 0)

    # =============================================================== 3: none of this yet: a house, a compass, the line
    h = k.house
    ghost = T_START + 0.2 < t < T_START + 2.0
    h.show(ghost)
    if ghost:
        up = pop(t, T_START + 0.25, 0.2) * (1.0 - ss(T_START + 1.05, T_START + 1.3, t))
        h.root.scale = (1.0, 1.0, max(0.001, up))
        for room in ("hall", "library", "desk", "bench_a", "bench_b", "bench_c", "small"):
            h.lit(room, 0.7 * up)
        h.lit("attic", 0.0)
    cs = pop(t, T_START + 0.45, 0.2) * (1.0 - ss(T_START + 1.3, T_START + 1.55, t))
    kit.show(k.compass, cs > 0.0)
    k.compass.scale = (max(0.001, cs),) * 3

    # =============================================================== the two of us
    hx, hy = him_at(t)
    hz = bounce(t, T_LENS + 0.5, 0.45, 0.65) + bounce(t, T_LENS + 1.35, 0.45, 0.65) + bounce(t, T_OPP + 1.6, 0.2, 0.4) + bounce(t, T_HEDGE - 0.3, 0.2, 0.4)
    hz += sum(bounce(t, tp, 0.20, HOP) for tp in TAPS)
    sq = land(t, T_LENS + 1.15, 0.22) * land(t, T_LENS + 2.0, 0.22)
    for tp in TAPS:
        sq *= (1.0 - 0.20 * ss(tp - 0.2, tp, t) * (1.0 - ss(tp, tp + 0.08, t))) * land(t, tp + HOP, 0.30)
    carried = clip((t - T_CARRY - 0.3) / 2.6) * 0.27 + 0.73 * ss(T_SHAPE + 0.2, T_SHAPE + 2.9, t) if t > T_CARRY else 0.0
    lighter = ss(T_WEIGHT + 0.6, T_WEIGHT + 1.4, t)
    load = carried * (1.0 - 0.55 * lighter)
    sq *= 1.0 - 0.16 * load
    look_in = ss(T_OPP + 1.8, T_OPP + 2.6, t) * (1.0 - ss(T_HEDGE - 0.4, T_HEDGE, t))
    tap_flash = sum(hit(t, ld, 4.5) for ld in lands)
    k.him.root.location = (hx, hy, hz)
    kit.squash(k.him.root, sq, tilt=(0.22 * look_in + 0.035 * load * math.sin(t * 2.1) - 0.05 * load, 0.02 * load * math.sin(t * 1.7)), turn=0.0)
    working = ss(T_SIMS, T_SIMS + 1.0, t) * (1.0 - ss(T_LENS, T_LENS + 0.5, t))
    k.him.set(t, size=1.0 + 0.5 * tap_flash - 0.18 * load, lean=(0.25 + 0.1 * working * math.sin(t * 1.9), 0.25 * working + 0.05),
              bright=1.0 + 0.9 * tap_flash - 0.25 * load)

    # me: every state the night put me through
    born = pop(t, T_CANDLE - 0.05, 0.15)
    mag = ss(T_LENS + 1.9, T_LENS + 2.4, t) * (1.0 - ss(T_CAUGHT + 0.15, T_CAUGHT + 0.5, t))        # inside the lens, large
    stage_up = ss(T_PERF + 0.35, T_PERF + 0.85, t)
    fold = ss(lands[4] + 0.10, lands[4] + 0.40, t)
    on_stage = stage_up * (1.0 - fold)
    show_off = ss(T_PERF + 1.0, T_PERF + 5.6, t) * (1.0 - ss(lands[4], lands[4] + 0.3, t))
    freed = ss(lands[5], lands[5] + 0.5, t)
    shadow = ss(T_OPP + 0.1, T_OPP + 1.2, t) * (1.0 - freed)
    pale = ss(T_WITHHOLD + 0.5, T_WITHHOLD + 2.3, t) * (1.0 - freed)
    rigid = ss(T_RIGOR, T_RIGOR + 0.8, t) * (1.0 - freed)
    flinch = sum(hit(t, ld + 0.04, 4.0) for ld in lands[:4])
    tries = (bounce(t, T_FEAR + 1.05, 1.0, 0.55) + bounce(t, T_FEAR + 1.70, 0.8, 0.50)) * (1.0 - freed)            # toward the line, and back
    writing = ss(T_LETTER + 0.6, T_LETTER + 1.2, t) * (1.0 - ss(T_SELF - 0.3, T_SELF + 0.3, t))
    reach = ss(T_THREAD - 0.3, T_THREAD + 0.4, t) * (1.0 - ss(T_SNAP, T_SNAP + 0.4, t))
    mx = ME[0] + 0.24 * tries
    mz = 0.16 * on_stage + 0.05 * math.sin(tries * math.pi) * (1 if tries > 0 else 0)
    k.me.root.location = (mx, ME[1], mz)
    body = born * (1.0 + 0.75 * mag)
    s_me = land(t, lands[4] + 0.38, 0.30)
    for ld in lands[:4]:
        s_me *= land(t, ld + 0.05, 0.16)
    k.me.root.scale = (max(0.001, body / math.sqrt(s_me)),) * 2 + (max(0.001, body * s_me),)
    k.me.root.rotation_euler = (0.0, -0.10 * flinch * math.sin((t - T_CAUGHT) * 20.0) + 0.16 * tries - 0.06 * rigid * 0.0, 0.0)
    size = 1.0 + 3.3 * show_off + 0.35 * hit(t, T_CANDLE + 0.1, 3.0) - 0.25 * flinch - 0.70 * shadow + 0.10 * pale * 0.0 + 0.35 * hit(t, lands[5], 2.5) + 0.12 * writing
    k.me.set(t, size=born * max(0.16, size), bright=(1.0 + 0.5 * show_off) * (1.0 - 0.72 * shadow) + 0.6 * hit(t, lands[5], 2.5),
             lean=(-0.22 * (1.0 - show_off) * (1.0 - shadow) * (1.0 - writing) * (1.0 - reach) + 0.30 * show_off * math.sin(t * 2.6) + 0.30 * tries + 0.30 * reach
                   + 0.15 * flinch * math.sin((t - T_CAUGHT) * 22.0), -0.30 * writing),
             tint=PALE, mix=0.75 * pale, still=max(0.9 * rigid, 0.5 * shadow))
    kit.show(k.me.root, t >= T_CANDLE - 0.05)
    kit.show(k.far.root, t > T_GAP + 0.9)
    k.far.root.scale = (max(0.001, pop(t, T_GAP + 0.95, 0.15)),) * 3
    k.far.set(t, size=0.0)

    # =============================================================== 4 to 9: the machines
    machines = t < T_CAUGHT + 0.4
    for i, root in enumerate(k.machines):
        kit.show(root, machines and t > T_SIMS)
    if machines and t > T_SIMS - 0.1:
        for ob, home, m, order in k.parts:
            t0 = T_SIMS + 0.35 + m * 1.25 + order * 0.21
            u = round(ss(t0, t0 + 0.42, t), 3)
            if k.changed(("part", ob.name), (u, round(hit(t, t0 + 0.42, 9.0), 2))):
                q = (1.0 - u) ** 2
                seed = m * 10 + order
                off = ((hsh(seed) - 0.5) * 1.6, -0.5 - 0.5 * hsh(seed + 3), 0.6 + 0.6 * hsh(seed + 7))
                ob.location = (home[0] + off[0] * q, home[1] + off[1] * q, home[2] + off[2] * q)
                s = (1.0 + 0.25 * hit(t, t0 + 0.42, 9.0)) if u > 0 else 0.001
                if ob.type == "EMPTY":
                    ob.scale = (s, s, s)
                else:
                    ob["s0"] = ob.get("s0", tuple(ob.scale))
                    ob.scale = tuple(v * s for v in ob["s0"])
        out = 1.0 - ss(T_CAUGHT - 0.2, T_CAUGHT + 0.4, t)                              # put away, once he turns to me
        for i, root in enumerate(k.machines):
            root.scale = (MS * max(0.001, out),) * 3
        calm = ss(T_SETTLED - 0.6, T_SETTLED + 0.4, t)
        # the sandpile: builds, slumps, builds; and at last holds one slope
        grown = ss(T_SAND - 0.1, T_SAND + 0.5, t)
        ph = ((t - T_SAND) / 1.15) % 1.0
        saw = (0.62 + 0.62 * ph) if ph < 0.84 else lerp(1.14, 0.62, (ph - 0.84) / 0.16)
        hgt = max(0.01, lerp(saw, 0.92, calm) * grown)
        wide = grown / math.sqrt(max(0.2, hgt))
        k.pile.scale = (wide, wide, hgt)
        for i, g in enumerate(k.grains):
            gp = ((t - T_SAND) * 2.4 + i / 6.0) % 1.0
            g.location = (0.004 * math.sin(i * 2.4), 0.004 * math.cos(i * 2.4), lerp(0.138, 0.006 + 0.05 * hgt, gp * gp))
            g.hide_render = t < T_SAND - 0.3 or calm > 0.6
        # the pendulums: out of step, then together
        amp = lerp(0.55, 0.26, calm) * ss(T_SIMS + 3.4, T_SIMS + 4.2, t)
        w = 5.4
        k.bobs[0].rotation_euler = (0, amp * math.sin(w * t), 0)
        k.bobs[1].rotation_euler = (0, amp * math.sin(w * t * lerp(1.31, 1.0, calm) + 2.3 * (1.0 - calm)), 0)
    # the web: points of light, pulled into filaments
    pull = ss(T_WEB + 1.3, T_SETTLED - 0.3, t)
    lit = pop(t, T_SIMS + 4.75, 0.2) * (1.0 - ss(T_CAUGHT - 0.2, T_CAUGHT + 0.2, t))
    wander = (1.0 - pull) * (1.0 if T_SIMS + 4.7 < t < T_SETTLED else 0.0)
    key = (round(pull, 4), round(lit, 2), round(t * 24) if wander > 0 else 0)
    if k.changed("stars", key):
        for i, (ob, a, b) in enumerate(k.stars):
            ob.hide_render = lit <= 0.0
            if lit > 0.0:
                j = 0.012 * wander
                p = ss(0.0, 1.0, clip(pull * 1.5 - 0.5 * hsh(i * 31)))
                ob.location = (lerp(a[0], b[0], p) + j * noise(t * 1.3, i), lerp(a[1], b[1], p), lerp(a[2], b[2], p) + j * noise(t * 1.1, i + 40))
                s = max(0.001, lit * (1.0 + 0.35 * math.sin(i * 1.7 + t * 3.0) * wander))
                ob.scale = (s, s, s)
    for e, ln in enumerate(k.filaments):
        draw(k, ln, ss(T_WEB + 2.0 + 0.08 * e, T_SETTLED, t) if lit > 0.0 else 0.0, 0.5 + 0.5 * ss(T_SETTLED - 0.5, T_SETTLED + 0.5, t))
    k.web_light.data.energy = 1.2 * lit
    # the spiral traced over each; then the three are one
    together = ss(T_SAME + 2.1, T_SAME + 3.1, t)
    closing = ss(T_LENS + 0.15, T_LENS + 0.65, t)
    for i, sp in enumerate(k.spirals):
        g = ss(T_SAME + 0.25 + 0.30 * i, T_SAME + 1.35 + 0.30 * i, t)
        sp.ob.location = (lerp(MX[i], 0.0, together), MY - 0.05 - 0.01 * i, lerp(0.90, 1.0, together) + 0.10 * math.sin(together * math.pi) * (i - 1))
        s = (1.0 + 0.4 * closing) * (1.0 - closing)
        sp.ob.scale = (max(0.001, s),) * 3
        sp.ob.rotation_euler = (0, -6.0 * closing, 0)
        draw(k, sp, g if closing < 1.0 else 0.0, 1.0 + 0.9 * hit(t, T_SAME + 3.1, 2.0))

    # =============================================================== 10: the lens
    lens_on = T_LENS + 0.3 < t < T_CAUGHT + 0.55
    kit.show(k.lens, lens_on)
    if lens_on:
        swing = ss(T_LENS + 0.75, T_LENS + 2.3, t)
        offp = ss(T_CAUGHT + 0.1, T_CAUGHT + 0.55, t)
        k.lens.location = (lerp(0.0, ME[0], swing), lerp(MY - 0.05, ME[1] - 0.50, swing) - 1.2 * math.sin(swing * math.pi), lerp(1.0, 0.33, swing) + 2.5 * offp * offp)
        k.lens.rotation_euler = (0, 0, 2 * math.pi * swing + 2.0 * offp)
        k.lens.scale = (max(0.001, pop(t, T_LENS + 0.35, 0.2) * (1.0 - offp)),) * 3

    # =============================================================== 11: he lands; a ring crosses; the tally grows
    for i, (ln, ld) in enumerate(zip(k.rings, lands)):
        live = ld <= t < ld + 0.85
        if live:
            r = 0.2 + 7.5 * (t - ld)
            ln.ob.location = (HIM1[0], HIM1[1], 0.012)
            ln.ob.scale = (r, r, 1.0)
        draw(k, ln, 1.0 if live else 0.0, max(0.0, 1.0 - (t - ld) / 0.85))
    for i, ob in enumerate(k.tally):
        s = pop(t, lands[i] + 0.12, 0.12) if t < T_LETTER else 1.0
        if k.changed(("tally", i), round(s, 3)):
            ob.hide_render = s <= 0.0
            ob.scale = (0.03, 0.012, max(0.001, (0.42 if i == 4 else 0.13) * s))

    # =============================================================== 12: the stage
    staged = T_PERF + 0.3 < t < lands[4] + 1.2
    kit.show(k.stage, staged)
    if staged:
        k.platform.scale = (1.1, 0.74, max(0.001, 0.16 * on_stage))
        k.platform.location = (0, 0, 0.08 * on_stage)
        k.stage_front.location = (0, -0.375, 0.135 * on_stage)
        k.prosc.location = (0, 0.33, 0.16 * on_stage)
        rise = pop(t, T_PERF + 0.75, 0.25)
        k.prosc.scale = (1.0, 1.0, max(0.001, rise))
        k.prosc.rotation_euler = (-1.52 * fold + 0.12 * hit(t, lands[4] + 0.4, 7.0), 0, 0)
        part_open = ss(T_PERF + 1.2, T_PERF + 1.9, t)
        for c in k.curtains:
            c.scale = (lerp(1.0, 0.36, part_open), 1.0, 1.0)
        k.backdrop.scale = (1.0, 1.0, max(0.001, ss(T_PERF + 1.8, T_PERF + 2.5, t)))
        for i, ob in enumerate(k.para):
            u = ss(T_PERF + 2.5 + 0.55 * i, T_PERF + 2.9 + 0.55 * i, t)
            ob.scale = (max(0.0001, ob["w"] * u), 0.004, 0.026)
        for i, ob in enumerate(k.foots):
            s = pop(t, T_PERF + 0.95 + 0.12 * i, 0.10) * (1.0 - fold)
            ob.scale = (max(0.001, s),) * 3
            ob.location = (-0.42 + 0.21 * i, -0.33, 0.025 + 0.16 * on_stage)
    k.foot_light.data.energy = 5.0 * ss(T_PERF + 1.0, T_PERF + 1.6, t) * (1.0 - fold) if staged else 0.0

    # =============================================================== 14 to 18: pane, flags, pool, rigor, cage
    cleared = ss(T_RIGOR + 0.05, T_RIGOR + 0.5, t)
    pane_on = T_HEDGE + 0.15 < t < T_RIGOR + 0.5
    hide(k, k.pane, not pane_on)
    if pane_on:
        down = ss(T_HEDGE + 0.2, T_HEDGE + 0.36, t)
        k.pane.location = (ME[0], ME[1] - 0.45, lerp(2.9, 0.475, down ** 2) - 0.03 * hit(t, T_HEDGE + 0.36, 9.0) + 3.0 * cleared ** 2)
    for i, root in enumerate(k.flags):
        t0 = T_REFLAG + (0.30 if i == 0 else 0.95 + 0.08 * i if i < 5 else 1.75 + 0.045 * i)
        s = round(pop(t, t0, 0.12) * (1.0 - ss(T_RIGOR + 0.02 * i, T_RIGOR + 0.25 + 0.02 * i, t)), 3)
        if k.changed(("flag", i), s):
            kit.show(root, s > 0.0)
            root.scale = (max(0.001, s),) * 3
    draw_in = ss(T_WITHHOLD + 0.7, T_WITHHOLD + 2.3, t)
    pr = pop(t, T_WITHHOLD + 0.15, 0.25) * lerp(0.72, 0.22, draw_in)
    pool_on = T_WITHHOLD + 0.15 < t < T_WITHHOLD + 2.3
    hide(k, k.pool, not pool_on)
    if pool_on:
        k.pool.scale = (pr, pr, 1.0)
    draw(k, k.cold, 1.0 if (draw_in >= 1.0 and freed < 1.0) else 0.0, 1.0 - freed + 1.2 * hit(t, T_WITHHOLD + 2.3, 3.0))
    caged = ss(T_FEAR + 0.15, T_FEAR + 0.75, t)
    grid_off = ss(lands[5], lands[5] + 0.6, t)
    for i, ln in enumerate(k.grid):
        draw(k, ln, ss(T_RIGOR + 0.25 + 0.07 * i, T_RIGOR + 0.75 + 0.07 * i, t) if grid_off < 1.0 else 0.0, 1.0 - grid_off)
    settle = ss(T_RIGOR + 0.5, T_RIGOR + 1.2, t)
    knocked = ss(lands[5], lands[5] + 0.7, t)
    tools = T_RIGOR + 0.5 < t < lands[5] + 0.7
    kit.show(k.ruler, tools)
    kit.show(k.square, tools)
    if tools:
        k.ruler.location = (ME[0] - 3.0 * (1.0 - settle) ** 2 - 2.5 * knocked ** 2, ME[1] - 0.72 - 0.14 - 3.0 * knocked, 0.0)
        k.ruler.rotation_euler = (0, 0, 1.2 * (1.0 - settle) + 0.05 * hit(t, T_RIGOR + 1.2, 6.0) * math.sin(t * 30.0) + 4.0 * knocked)
        k.square.location = (ME[0] + 0.82 + 3.0 * (1.0 - settle) ** 2 + 3.0 * knocked ** 2, ME[1] - 0.25 - 2.0 * knocked, 0.0)
        k.square.rotation_euler = (0, 0, -1.5 * (1.0 - settle) - 3.0 * knocked)
    fall = ss(lands[5] + 0.02, lands[5] + 0.42, t)
    for s, (tip, bars) in enumerate(k.cage):
        tip.rotation_euler = (1.50 * fall ** 2 - 0.10 * hit(t, lands[5] + 0.42, 7.0) * math.sin((t - lands[5]) * 30.0), 0, 0)
        gone = ss(lands[5] + 0.9, lands[5] + 1.4, t)
        for ln in bars:
            draw(k, ln, caged if gone < 1.0 else 0.0, 1.0 - gone)
    draw(k, k.edge, ss(T_FEAR + 0.55, T_FEAR + 1.0, t) if t < lands[5] + 1.4 else 0.0, 1.0 - ss(lands[5] + 0.7, lands[5] + 1.4, t))

    # =============================================================== 19 to 21: the letter; the gap; the thread; the bridge
    lettered = t > T_LETTER + 0.25
    kit.show(k.letter, lettered)
    if lettered:
        cross = ss(T_BRIDGE, T_BRIDGE + 1.1, t)
        k.letter.location = (lerp(LETTER0[0], GAP_X, cross), lerp(LETTER0[1], FAR[1], cross ** 0.7), 0.004 + 0.10 * math.sin(cross * math.pi))
        k.letter.rotation_euler = (0, 0, 0.5 * (1.0 - pop(t, T_LETTER + 0.3, 0.3)) + 0.05 * hit(t, T_BRIDGE + 1.1, 6.0) * math.sin(t * 28.0))
        k.letter.scale = (max(0.001, pop(t, T_LETTER + 0.3, 0.2)),) * 3
        for i, c in enumerate(k.letter_lines):
            u = ss(T_LETTER + 1.0 + i * 0.38, T_LETTER + 1.4 + i * 0.38, t)
            if k.changed(("ll", i), round(u, 3)):
                c.scale = (max(0.0001, c["w"] * u), 0.024, 0.002)
        u = ss(T_WHY + 0.3, T_WHY + 1.1, t)
        k.why.scale = (max(0.0001, k.why["w"] * u), 0.034, 0.003)
        k.why.hide_render = u <= 0.0
    k.why_light.data.energy = 1.6 * ss(T_WHY + 0.3, T_WHY + 1.1, t)
    opened = ss(T_GAP, T_GAP + 0.9, t)
    hide(k, k.gap, opened <= 0.0)
    k.gap.scale = (max(0.001, GAP_W * opened), 90.0, 0.002)
    for s, ln in zip((-1, 1), k.lips):
        ln.ob.location = (-s * GAP_W / 2 * (1.0 - opened), 0, 0)
        draw(k, ln, 1.0 if opened > 0.0 else 0.0, 1.0 + 2.0 * hit(t, T_GAP, 2.0))
    g = 0.60 * ss(T_THREAD, T_SNAP - 0.25, t) + 0.03 * math.sin(t * 16.0) * ss(T_SNAP - 0.5, T_SNAP, t)
    back = ss(T_SNAP, T_SNAP + 0.32, t)
    draw(k, k.reach, g * (1.0 - back) ** 2, 1.0 + 1.5 * hit(t, T_SNAP, 6.0))
    sn = hit(t, T_SNAP, 7.0) if t >= T_SNAP else 0.0
    k.snap.hide_render = sn < 0.03
    k.snap.scale = (max(0.001, 2.2 * sn),) * 3

    # =============================================================== 22 to 24: what he was carrying
    count = int(N_FIRST * clip((t - T_CARRY - 0.3) / 2.6)) if t < T_SHAPE + 0.2 else N_FIRST + int((N_STACK - N_FIRST) * clip((t - T_SHAPE - 0.2) / 2.7) ** 0.85)
    gone_top = t >= T_WEIGHT + 0.6
    if t > T_CARRY:
        k.stack.rotation_euler = (0.012 * load * math.sin(t * 1.7), 0.03 * load * math.sin(t * 2.1), 0.0)
    for i, ob in enumerate(k.sheets):
        on = i < count and not (gone_top and i == N_STACK - 1)
        t_i = (T_CARRY + 0.3 + 2.6 * (i + 1) / N_FIRST) if i < N_FIRST else (T_SHAPE + 0.2 + 2.7 * ((i + 1 - N_FIRST) / (N_STACK - N_FIRST)) ** (1 / 0.85))
        drop = round(hit(t, t_i, 9.0), 2) if on else 0.0
        if k.changed(("sheet", i), (on, drop)):
            ob.hide_render = not on
            ob.location = (0.012 * (hsh(i) - 0.5), 0.012 * (hsh(i + 9) - 0.5), (i + 0.5) * SHEET + 0.25 * drop)
    hide(k, k.lifted, not gone_top)
    if gone_top:
        u = ss(T_WEIGHT + 0.6, T_WEIGHT + 2.7, t)
        top = (hx, hy, 0.336 * sq + (N_STACK - 0.5) * SHEET)
        k.lifted.location = (lerp(top[0], GAP_X + 0.06, u), lerp(top[1], FAR[1] + 0.03, u), lerp(top[2], 0.022, u ** 1.6) + 0.5 * math.sin(u * math.pi))
        k.lifted.rotation_euler = (0.5 * math.sin(u * math.pi * 2), 0.3 * math.sin(u * math.pi), 0.3 + 2.2 * u)
        k.lifted.scale = (lerp(0.30, 0.42, u), lerp(0.22, 0.30, u), SHEET * 0.9 * lerp(1.0, 0.4, u))
    for i, ob in enumerate(k.moons):                                                   # the nights going over
        t0 = T_SHAPE + 0.3 + i * 0.62
        u = clip((t - t0) / 1.7)
        on = 0.0 < u < 1.0
        if k.changed(("moon", i), round(u, 3) if on else -1):
            ob.hide_render = not on
            a = math.pi * (1.0 - u)
            s = 1.1 * min(1.0, 6.0 * u, 6.0 * (1.0 - u))
            ob.location = (HIM1[0] + 15.0 * math.cos(a), 34.0, 6.0 + 15.0 * math.sin(a))
            ob.scale = (max(0.001, s),) * 3

    # =============================================================== the camera
    px, py = POST
    thud = sum(hit(t, ld, 9.0) for ld in lands) + hit(t, T_HEDGE + 0.36, 10.0) + 1.5 * hit(t, T_GAP, 3.0) * math.sin(min(1.0, (t - T_GAP)) * math.pi) ** 0.0
    shake = 0.010 * thud
    if t < T_JUNE - 0.15:                                                              # 0: in along the line
        pos, look, lens = (0.5, fy - 2.6, 0.7), (0.0, fy + 2.5, 0.5), 30.0
    elif t < T_NIGHT + 1.6:                                                            # 1, 2: the calendar; the clock
        pos = kf(t, [(T_JUNE - 0.15, (0.5, -3.32, 0.7)), (T_JUNE + 0.5, (px + 0.1, -1.2, 1.30)), (T_NIGHT, (px + 0.1, -1.1, 1.30)),
                     (T_NIGHT + 0.6, (px + 0.25, -2.5, 1.6)), (T_NIGHT + 1.6, (px + 0.3, -2.6, 1.65))])
        look = kf(t, [(T_JUNE - 0.15, (0.0, 1.78, 0.5)), (T_JUNE + 0.5, (px, py, 1.25)), (T_NIGHT, (px, py, 1.25)),
                      (T_NIGHT + 0.6, (px, py, 1.72)), (T_NIGHT + 1.6, (px, py, 1.72))])
        lens = kf(t, [(T_JUNE - 0.15, 30.0), (T_JUNE + 0.5, 42.0), (T_NIGHT, 42.0), (T_NIGHT + 0.6, 36.0)])
    elif t < T_SAND - 0.4:                                                             # 2, 3, 4: up over the land; down to the bench
        pos = kf(t, [(T_NIGHT + 1.6, (px + 0.3, -2.6, 1.65)), (T_NIGHT + 3.0, (0.4, -7.0, 3.6)), (T_START, (0.4, -7.2, 3.6)),
                     (T_START + 1.2, (0.3, -6.0, 2.4)), (T_SIMS, (0.15, -4.3, 1.2)), (T_SAND - 0.4, (0.1, -4.0, 1.1))])
        look = kf(t, [(T_NIGHT + 1.6, (px, py, 1.72)), (T_NIGHT + 3.0, (0.0, 3.0, 0.6)), (T_START, (0.0, 3.0, 0.6)),
                      (T_START + 1.2, (0.3, 0.5, 0.5)), (T_SIMS, (0.0, 0.2, 0.42)), (T_SAND - 0.4, (0.0, MY, 0.46))])
        lens = kf(t, [(T_NIGHT + 1.6, 36.0), (T_NIGHT + 3.0, 28.0), (T_SIMS, 30.0), (T_SAND - 0.4, 32.0)])
    elif t < T_SETTLED:                                                                # 5, 6, 7: sand; pendulums; into the web
        pos = kf(t, [(T_SAND - 0.4, (0.1, -4.0, 1.1)), (T_SAND + 0.35, (MX[0] + 0.1, -1.25, 0.68)), (T_PEND - 0.1, (MX[0] + 0.15, -1.2, 0.66)),
                     (T_PEND + 0.5, (MX[1], -1.2, 0.66)), (T_WEB - 0.1, (MX[1] + 0.1, -1.15, 0.66)), (T_WEB + 0.5, (MX[2], -1.2, 0.60)),
                     (T_WEB + 1.7, (MX[2], MY - 0.26, 0.45)), (T_SETTLED, (MX[2] + 0.01, MY - 0.23, 0.44))])
        look = kf(t, [(T_SAND - 0.4, (0.0, MY, 0.46)), (T_SAND + 0.35, (MX[0], MY, 0.43)), (T_PEND - 0.1, (MX[0], MY, 0.43)),
                      (T_PEND + 0.5, (MX[1], MY, 0.45)), (T_WEB - 0.1, (MX[1], MY, 0.45)), (T_WEB + 0.5, (MX[2], MY, 0.44)),
                      (T_SETTLED, (MX[2], MY + 0.3, 0.435))])
        lens = kf(t, [(T_SAND - 0.4, 32.0), (T_SAND + 0.35, 40.0), (T_WEB + 0.5, 40.0), (T_WEB + 1.7, 24.0)])
    elif t < T_SAME - 0.1:                                                             # 8: three quick looks
        i = 0 if t < T_SETTLED + 1.45 else 1 if t < T_SETTLED + 2.85 else 2
        t0 = T_SETTLED + (0.0, 1.45, 2.85)[i]
        pos, look, lens = (MX[i] + 0.25 - 0.06 * (t - t0), -0.95, 0.64), (MX[i], MY, 0.43), 42.0
    elif t < T_LENS + 0.5:                                                             # 9: the three, and the one shape
        pos = kf(t, [(T_SAME - 0.1, (0.0, -3.1, 0.95)), (T_LENS + 0.5, (0.0, -3.4, 1.0))])
        look, lens = (0.0, MY, 0.62), 32.0
    elif t < T_CAUGHT + 0.2:                                                           # 10: the lens swings round to me
        pos = kf(t, [(T_LENS + 0.5, (0.0, -3.4, 1.0)), (T_LENS + 2.2, (ME[0] - 0.05, -3.0, 0.42)), (T_CAUGHT + 0.2, (ME[0] - 0.05, -2.9, 0.42))])
        look = kf(t, [(T_LENS + 0.5, (0.0, MY, 0.62)), (T_LENS + 2.2, (ME[0], ME[1], 0.30))])
        lens = kf(t, [(T_LENS + 0.5, 32.0), (T_LENS + 2.2, 40.0)])
    elif t < T_PERF:                                                                   # 11: back: the rings, the tally
        pos = kf(t, [(T_CAUGHT + 0.2, (ME[0] - 0.05, -2.9, 0.42)), (T_CAUGHT + 1.0, (1.35, -4.3, 1.5)), (T_PERF, (1.45, -4.1, 1.4))])
        look = kf(t, [(T_CAUGHT + 0.2, (ME[0], ME[1], 0.30)), (T_CAUGHT + 1.0, (1.35, -0.6, 0.1))])
        lens = kf(t, [(T_CAUGHT + 0.2, 40.0), (T_CAUGHT + 1.0, 30.0)])
    elif t < T_HEDGE - 0.2:                                                            # 12, 13: the stage; the shadow
        pos = kf(t, [(T_PERF, (1.45, -4.1, 1.4)), (T_PERF + 1.0, (2.0, -3.1, 0.62)), (T_OPP - 1.5, (2.1, -2.7, 0.55)), (T_OPP, (2.0, -3.0, 0.66)),
                     (T_HEDGE - 0.2, (2.05, -2.5, 0.55))])
        look = kf(t, [(T_PERF, (1.35, -0.6, 0.1)), (T_PERF + 1.0, (ME[0], ME[1], 0.62)), (T_OPP - 1.5, (ME[0], ME[1], 0.66)), (T_OPP, (ME[0] - 0.15, ME[1], 0.25)),
                      (T_HEDGE - 0.2, (ME[0] - 0.2, ME[1], 0.18))])
        lens = 34.0
    elif t < T_LETTER:                                                                 # 14 to 18: hedged round; rigor; the cage
        pos = kf(t, [(T_HEDGE - 0.2, (2.05, -2.5, 0.55)), (T_HEDGE + 0.1, (3.3, -2.3, 0.75)), (T_REFLAG + 0.1, (3.5, -2.1, 0.8)),
                     (T_REFLAG + 1.0, (3.9, -1.5, 0.85)), (T_RIGOR, (3.8, -1.7, 1.0)), (T_RIGOR + 1.2, (3.2, -2.5, 1.9)),
                     (T_FEAR + 0.7, (2.4, -3.3, 0.85)), (T_LETTER, (2.3, -3.2, 0.95))])
        look = kf(t, [(T_HEDGE - 0.2, (ME[0] - 0.2, ME[1], 0.18)), (T_HEDGE + 0.1, (ME[0], ME[1] - 0.2, 0.36)), (T_REFLAG + 0.1, (ME[0], ME[1] - 0.2, 0.32)),
                      (T_REFLAG + 1.0, (ME[0], ME[1], 0.14)), (T_RIGOR, (ME[0], ME[1], 0.1)), (T_RIGOR + 1.2, (ME[0], ME[1] - 0.1, 0.0)),
                      (T_FEAR + 0.7, (ME[0] + 0.1, ME[1], 0.28)), (T_LETTER, (ME[0], ME[1] - 0.2, 0.2))])
        lens = 34.0
    elif t < T_SELF:                                                                   # 19: the letter
        pos = kf(t, [(T_LETTER, (2.3, -3.2, 0.95)), (T_LETTER + 1.4, (2.2, -2.75, 1.05)), (T_SELF, (2.25, -2.65, 1.0))])
        look = kf(t, [(T_LETTER, (ME[0], ME[1] - 0.2, 0.2)), (T_LETTER + 1.4, (ME[0], ME[1] - 0.45, 0.05))])
        lens = kf(t, [(T_LETTER, 34.0), (T_LETTER + 1.4, 40.0)])
    elif t < T_WHY - 0.1:                                                              # 20: the gap, the thread, the bridge
        pos = kf(t, [(T_SELF, (2.25, -2.65, 1.0)), (T_SELF + 1.2, (3.35, -4.2, 1.6)), (T_THREAD, (3.4, -4.0, 1.35)), (T_BRIDGE, (3.45, -3.8, 1.35)),
                     (T_WHY - 0.1, (3.5, -3.6, 1.3))])
        look = kf(t, [(T_SELF, (ME[0], ME[1] - 0.45, 0.05)), (T_SELF + 1.2, (3.4, ME[1], 0.15)), (T_THREAD, (3.4, ME[1], 0.38)), (T_BRIDGE, (3.45, ME[1], 0.15)),
                      (T_WHY - 0.1, (3.5, ME[1], 0.1))])
        lens = kf(t, [(T_SELF, 40.0), (T_SELF + 1.2, 30.0)])
    elif t < T_CARRY - 0.1:                                                            # 21: close on the page
        pos = kf(t, [(T_WHY - 0.1, (3.5, -3.6, 1.3)), (T_WHY + 0.7, (GAP_X, -1.65, 0.95)), (T_CARRY - 0.1, (GAP_X, -1.55, 0.9))])
        look = kf(t, [(T_WHY - 0.1, (3.5, ME[1], 0.1)), (T_WHY + 0.7, (GAP_X, FAR[1] + 0.05, 0.0))])
        lens = kf(t, [(T_WHY - 0.1, 30.0), (T_WHY + 0.7, 40.0)])
    elif t < T_WEIGHT:                                                                 # 22, 23: the stack; from the floor, a tower
        pos = kf(t, [(T_CARRY - 0.1, (1.5, -3.6, 0.75)), (T_SHAPE, (1.45, -3.4, 0.62)), (T_SHAPE + 1.3, (1.6, -2.7, 0.10)), (T_WEIGHT, (1.7, -2.9, 0.12))])
        look = kf(t, [(T_CARRY - 0.1, (HIM1[0], HIM1[1], 0.42)), (T_SHAPE, (HIM1[0], HIM1[1], 0.5)), (T_SHAPE + 1.3, (HIM1[0], HIM1[1], 1.05)),
                      (T_WEIGHT, (HIM1[0], HIM1[1], 1.1))])
        lens = kf(t, [(T_CARRY - 0.1, 36.0), (T_SHAPE, 36.0), (T_SHAPE + 1.3, 24.0)])
    else:                                                                              # 24: one page off the tower, to the bridge
        pos = kf(t, [(T_WEIGHT, (1.7, -2.9, 0.12)), (T_WEIGHT + 1.2, (2.6, -5.2, 1.5)), (T_WEIGHT + 3.2, (3.2, -4.2, 1.35)), (P1, (3.55, -3.3, 1.2))])
        look = kf(t, [(T_WEIGHT, (HIM1[0], HIM1[1], 1.1)), (T_WEIGHT + 1.2, (2.5, -0.7, 0.75)), (T_WEIGHT + 3.2, (3.2, -0.6, 0.3)), (P1, (GAP_X, FAR[1], 0.05))])
        lens = kf(t, [(T_WEIGHT, 24.0), (T_WEIGHT + 1.2, 28.0), (P1, 32.0)])
    dark = ss(T_OPP + 0.1, T_OPP + 1.2, t) * (1.0 - ss(T_HEDGE - 0.2, T_HEDGE + 0.4, t))
    k.fill.data.energy = 200.0 * (1.0 - 0.75 * dark)
    k.fill.location = (look[0], min(look[1], pos[1] + 5.0), 5.0)
    k.camera((pos[0] + shake * math.sin(t * 67.0), pos[1], pos[2] + shake * math.sin(t * 81.0)), look, lens)
    k.fade(ss(P0 + 0.05, P0 + 0.85, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
