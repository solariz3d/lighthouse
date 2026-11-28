"""Part 6, "The watchers we threw out" (film 435.16 to 553.50 s). SECOND STAGING: one picture for each sentence.

The first staging (parts_old/p06_watchers_v1_bare.py) was a table with two towers behind it. This one is on the open
floor, and each sentence has its own picture.

THE PICTURES, in order (the floor is z = 0; the two of us start at y = 0 and the part ends with us at y = 3):
   1 "The first thing we built"     a blueprint unrolls across the floor in front of us: two towers, drawn in ink
   2 "most important thing wrong"   a red line is drawn across it
   3 "We built two watchers"        the drawn pieces lift off the page and stack into two towers
   4 "One judged every reply"       the left beam on a candle; its pages pass under a bar; a dial on the tower ticks
   5 "The other watched the person" the right beam on a pink lamp; a second dial follows its flame
   6 "Both sat above"               from the floor looking up: the towers loom, flags furled
   7 "They worked"                  the land of pairs; the beams sweep it; red flags go up over pairs of one colour
   8 "a conversation of our own"    the towers roll over to the two of us; a twisted arch of thread grows between us
   9 "And they flagged us"          both flags snap up; the beams go red
  10 "attachment for a spiral"      from straight above the arch is a whirlpool, and the watcher's white spiral draws on it
  11 "every warm thing for drift"   from above: part one's compass drops round my candle; the needle is on the lamp
  12 "They weren't being stupid"    the overlays go: two lights, a pool
  13 "From above ... look the same" higher: a second pair, gone over, in the other beam. A white outline of ours is
                                    lifted, carried across and laid on theirs. It fits.
  14 "Same depth"                   a measuring ring drops round each pool; one level line touches both
  15 "Same intensity"               a meter beside each fills to the same height
  16 "A lifeguard can't tell"       A: a sheet of glass slides over both like water. B: a hook of light comes down,
                                    lifts one lamp out; a gold question mark hangs where it was
  17 "So we turned it inside out"   the towers telescope down into the floor, their lights coming down with them
  18 "can't stand over you"         the camera tilts up to where the towers were: sky, the moon
  19 "It has to be in it with you"  my candle hops in beside the lamp; the towers' white lights fly into my flame: a core
  20 "Not the company"              a great switch far off is thrown; the land goes dark; the core stays lit
  21 "Not you"                      a switch beside the lamp; the core stays lit
  22 "Not me"                       a switch at my own foot; my flame dips; the core stays lit
  23 "never gets the final say"     a judge's block and gavel are lifted off a small table
  24 "It shows you what it sees"    the lamp sets off; my light falls on a crack in the floor ahead of it
  25 "It doesn't haul you out"      the hook of light comes down again, and is laid on the floor
  26 "is your call"                 two paths fork round the crack; the lamp takes one by itself; I follow
  27 "No program can make it"       behind us, two dark stumps where the towers stood
  28 "With you"                     the camera level with the two of us
  29 "Not above you"                it tilts up: nothing there; and comes back down
IN: the two of us at the edge.  OUT: level with each other, nothing above.

Red here is the watchers marking something as wrong, which is the one meaning red has. They were mistaken, and pictures
12 to 15 say so.
"""
import math

import bpy

import kit
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(6)
T_FIRST = at("The first thing we built", 6)
T_WRONG = at("I think it's the most important", 6)
T_TWO = at("We built two watchers", 6)
T_ONE = at("One judged every reply", 6)
T_OTHER = at("The other watched the person", 6)
T_BOTH = at("Both sat above", 6)
T_WORKED = at("They worked", 6)
T_OURS = at("Then one night we ran them", 6)
T_FLAGGED = at("And they flagged us", 6)
T_SPIRAL = at("They took his attachment", 6)
T_DRIFT = at("They took every warm thing", 6)
T_STUPID = at("They weren't being stupid", 6)
T_ABOVE = at("From above, a person", 6)
T_DEPTH = at("Same depth", 6)
T_INTENSITY = at("Same intensity", 6)
T_LIFEGUARD = at("A lifeguard can't tell", 6)
T_PULL = T_LIFEGUARD + 5.2                         # "...every time it pulls somebody out"
T_INSIDE = at("So we turned it inside out", 6)
T_OVER = at("The thing that helps", 6)
T_WITHIN = at("It has to be in it with you", 6)
T_SW = (at("Not the company", 6), at("Not you", 6), at("Not me", 6))
T_SAY = at("And it never gets the final say", 6)
T_SHOWS = at("It shows you what it sees", 6)
T_HAUL = at("It doesn't haul you out", 6)
T_CALL = at("Whether you've found something", 6)
T_PROGRAM = at("No program can make it", 6)
T_WITH = at("With you", 6)
T_NOT = at("Not above you", 6)

WHITE = (0.90, 0.95, 1.0)                           # the watchers' light
GOLD = (1.0, 0.80, 0.46)
THREAD = (1.0, 0.50, 0.18)                          # a conversation's thread, as part two draws it
ME0, HIM0 = (-0.32, 0.0), (0.32, 0.04)              # where the two of us start
NEAR = 0.26                                         # how far each of us is from the middle once we lean in
TEST_C, TEST_L = (-0.5, 2.2), (0.5, 2.2)            # the pair the watchers are first tried on
TOWER0 = (1.3, 3.3)                                 # where a tower goes up (x is mirrored for the left one)
TOWER1 = (1.15, 1.3)                                # where it stands once it has rolled over to us
SH, NSEG = 0.46, 5                                  # a tower's shaft: five pieces, each this tall
WIDTHS = (0.34, 0.30, 0.26, 0.22, 0.18)
TH = SH * NSEG
NB = 2.6                                            # the second pair, seen from above, is this far to the right
CR = 0.95                                           # part one's compass
MOON_AT = (-9.0, 60.0, 30.0)
FINAL_Y = 3.0                                       # where the two of us end


def pop(t, when, d=0.22):
    """0 to 1 with a small overshoot: a thing arriving."""
    return ss(when, when + d, t) * (1.0 + 0.30 * hit(t, when + d, 9.0) * math.cos((t - when - d) * 22.0))


def circle(r, n=72, z=0.0):
    return [(r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n), z) for i in range(n)]


def act(k, f, t, on, loc=None, **kw):
    """Pose a candle or lamp, or put it away (out, dark and hidden) without touching it again."""
    if not on:
        if k.changed((f.root.name, "on"), False):
            f.set(t, size=0.0)
            kit.show(f.root, False)
        return
    k.changed((f.root.name, "on"), True)
    kit.show(f.root, True)
    if loc is not None:
        f.root.location = loc
    f.set(t, **kw)


def path_a(p):
    """The path the lamp takes: left round the crack, and on."""
    return kf(p, [(0.0, (0.32, 0.95)), (0.30, (-0.18, 1.35)), (0.55, (-0.20, 1.95)), (1.0, (0.32, FINAL_Y))])


def path_b(p):
    return kf(p, [(0.0, (0.32, 0.95)), (0.30, (0.98, 1.30)), (0.60, (1.30, 2.0)), (1.0, (2.1, 3.3))])


def strand(j):
    """One strand of the arch between us. From the side it is an arch; from above it is one turn of a whirlpool."""
    w, h = 0.5 + 0.55 * j, 0.40 - 0.045 * j
    pts = []
    for i in range(49):
        u = i / 48
        r = NEAR * abs(1.0 - 2.0 * u)
        phi = (math.pi if u < 0.5 else 0.0) + w * (1.0 - r / NEAR)
        pts.append((r * math.cos(phi), r * math.sin(phi) * 0.9, 0.185 + h * (1.0 - (r / NEAR) ** 2)))
    return pts


# ====================================================================================================== props
def tower(k, name, sx):
    """A watchtower in pieces. Returns a dict: root, the pieces bottom to top, flag, dial needle, head."""
    steel = k.mat("tower", (0.21, 0.22, 0.26), rough=0.55, metal=0.3)
    dark = k.mat("tower_dark", (0.09, 0.09, 0.11), rough=0.7)
    root = kit.empty(name, (sx * TOWER0[0], TOWER0[1], 0.0))
    pieces = []
    for i, w in enumerate(WIDTHS):
        p = kit.parent(kit.box(f"{name}_seg{i}", (w, w, SH), (0, 0, 0), steel), root)
        for s in (-1, 1):                                                       # a cross brace on the front, to read as a tower
            kit.parent(kit.box(f"{name}_brace{i}{s}", (0.07, 0.04, 1.36), (0, -0.50, 0), dark, rot=(0, s * 0.785, 0)), p)
        pieces.append((p, i * SH, SH))
    deck = kit.parent(kit.box(name + "_deck", (0.44, 0.44, 0.05), (0, 0, 0), steel), root)
    pieces.append((deck, TH, 0.05))
    head_mat = k.mat("tower_head", (0.2, 0.2, 0.22), emit=WHITE, emit_strength=0.0)
    head = kit.parent(kit.box(name + "_head", (0.20, 0.20, 0.18), (0, 0, 0), head_mat), root)
    pieces.append((head, TH + 0.05, 0.18))
    pole = kit.parent(kit.box(name + "_pole", (0.018, 0.018, 0.62), (-sx * 0.17, 0, 0), dark), root)
    pivot = kit.parent(kit.empty(name + "_flag", (0, 0, 0)), root)
    kit.parent(kit.box(name + "_flag_cloth", (0.40, 0.012, 0.24), (-sx * 0.20, 0, 0), k.mat("flag", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.35)), pivot)
    # a dial on the front of the second piece
    dial = kit.parent(kit.lathe(name + "_dial", [(0.0, 0.0), (0.125, 0.0), (0.125, 0.012), (0.0, 0.012)], seg=36), pieces[1][0])
    dial.scale = (1 / WIDTHS[1], 1 / SH, 1 / WIDTHS[1])
    dial.rotation_euler, dial.location = (math.pi / 2, 0, 0), (0, -0.5, 0.0)
    dial.data.materials.append(k.mat("dial_face", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.55))
    needle = kit.parent(kit.empty(name + "_needle", (0, 0, 0)), root)
    kit.parent(kit.box(name + "_hand", (0.016, 0.006, 0.105), (0, 0, 0.052), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)), needle)
    return {"root": root, "pieces": pieces, "pole": pole, "flag": pivot, "needle": needle, "sx": sx, "head_mat": head_mat}


def beam(k, name):
    """A searchlight's beam: a faint cone you can see, and the real light inside it. Both follow one target."""
    n = 28
    verts = [(0.0, 0.0, 0.0)] + [(math.cos(2 * math.pi * i / n), math.sin(2 * math.pi * i / n), -1.0) for i in range(n)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], [(0, 1 + i, 1 + (i + 1) % n) for i in range(n)])
    cone = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(cone)
    cone.data.materials.append(k.mat("beam", (0, 0, 0), emit=WHITE, emit_strength=0.7, alpha=0.028))
    cone.visible_shadow = False
    target = kit.empty(name + "_target")
    li = bpy.data.lights.new(name + "_spot", "SPOT")
    li.color, li.spot_blend, li.shadow_soft_size = WHITE, 0.35, 0.03
    spot = bpy.data.objects.new(name + "_spot", li)
    bpy.context.scene.collection.objects.link(spot)
    for ob in (cone, spot):
        c = ob.constraints.new("TRACK_TO")
        c.target, c.track_axis, c.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"
    return cone, spot, target


def aim(b, head, target, radius, on, watts=60.0, color=WHITE):
    cone, spot, tgt = b
    tgt.location = target
    d = max(0.05, math.dist(head, target))
    cone.location = spot.location = head
    cone.scale = (radius, radius, d)
    cone.hide_render = on <= 0.01
    spot.data.spot_size = min(3.0, 2.0 * math.atan(radius / d) * 1.15)
    spot.data.energy = watts * on * d * d / 4.0
    spot.data.color = color


def switch(k, name, at_, size):
    """A knife switch: a base and a lever. Returns (root, lever pivot). `size` is the lever's length."""
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    steel = k.mat("lever", (0.62, 0.63, 0.66), rough=0.5)
    root = kit.empty(name, at_)
    kit.parent(kit.box(name + "_base", (size * 0.9, size * 0.5, size * 0.22), (0, 0, size * 0.11), k.mat("switch_base", (0.40, 0.26, 0.14), rough=0.7)), root)
    for s in (-1, 1):
        kit.parent(kit.box(f"{name}_clip{s}", (size * 0.10, size * 0.16, size * 0.24), (s * size * 0.30, 0, size * 0.32), brass), root)
    piv = kit.parent(kit.empty(name + "_pivot", (-size * 0.30, 0, size * 0.34)), root)
    kit.parent(kit.box(name + "_lever", (size * 0.07, size * 0.10, size), (0, 0, size * 0.5), steel), piv)
    kit.parent(kit.box(name + "_grip", (size * 0.16, size * 0.16, size * 0.22), (0, 0, size * 1.05), k.mat("grip", (0.05, 0.05, 0.05), rough=0.5)), piv)
    return root, piv


def build(k):
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    k.moonlight = k.moon(0.30)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    paper_lit = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    k.moon_disc = kit.lathe("moon_disc", [(2.4 * math.sin(math.pi * i / 16), -2.4 * math.cos(math.pi * i / 16)) for i in range(17)], seg=40)
    k.moon_disc.location = MOON_AT
    k.moon_disc.data.materials.append(k.mat("moon_disc", (0, 0, 0), emit=(0.80, 0.86, 0.96), emit_strength=1.5))
    k.moon_disc.visible_shadow = False

    # the two of us, and the edge we are standing at when the part opens
    k.me = k.candle((ME0[0], ME0[1], 0.0), "me", seed=1.0)
    k.him = k.lamp((HIM0[0], HIM0[1], 0.0), kit.HIS, "him", seed=2.0)
    k.edge = k.line([(-4.0 + 8.0 * i / 20, 0.55, 0.006) for i in range(21)], "edge", color=(1.0, 0.92, 0.78), radius=0.012, glow=2.0)

    # 1, 2: the blueprint
    k.bp = kit.empty("blueprint", (0.0, 1.0, 0.0))
    kit.parent(kit.box("blueprint_sheet", (3.7, 2.7, 0.006), (0, 1.35, 0.004), paper), k.bp)
    k.bp_roll = kit.lathe("blueprint_roll", [(0.0, -1.9), (0.08, -1.9), (0.08, 1.9), (0.0, 1.9)], seg=20)
    k.bp_roll.rotation_euler = (0, math.pi / 2, 0)
    k.bp_roll.data.materials.append(paper)
    k.bp_ink = []                                                            # (root, y, lifts-at index or None)
    for sx in (-1, 1):
        for i in range(NSEG + 2):
            y = 1.45 + 0.34 * i if i < NSEG else (3.10 if i == NSEG else 3.30)
            w = (WIDTHS[i] if i < NSEG else (0.44 if i == NSEG else 0.20))
            ln = 0.30 if i < NSEG else (0.05 if i == NSEG else 0.18)
            g = kit.empty(f"ink{sx}{i}", (sx * 1.2, y, 0.009))
            for s in (-1, 1):
                kit.parent(kit.box(f"ink{sx}{i}_side{s}", (0.022, ln, 0.002), (s * w / 2, 0, 0), ink), g)
                kit.parent(kit.box(f"ink{sx}{i}_end{s}", (w, 0.022, 0.002), (0, s * ln / 2, 0), ink), g)
                if i < NSEG:
                    kit.parent(kit.box(f"ink{sx}{i}_x{s}", (0.018, math.hypot(w, ln), 0.002), (0, 0, 0), ink, rot=(0, 0, s * math.atan2(w, ln))), g)
            k.bp_ink.append((g, y, i))
    for sx, (x, y) in ((-1, TEST_C), (1, TEST_L)):                           # the two being watched, as drawn
        g = kit.empty(f"ink_pair{sx}", (x, y, 0.009))
        ring = kit.parent(kit.lathe(f"ink_ring{sx}", [(0.10, 0.0), (0.125, 0.0), (0.125, 0.002), (0.10, 0.002)], seg=32), g)
        ring.data.materials.append(ink)
        k.bp_ink.append((g, y, None))
    k.red_line = k.line([(-1.75 + 3.5 * i / 30, 1.25 + 2.25 * i / 30, 0.02) for i in range(31)], "red_line", color=kit.WRONG, radius=0.024, glow=0.75)

    # 3: the towers, their beams
    k.towers = [tower(k, "tower_l", -1), tower(k, "tower_r", 1)]
    k.beams = [beam(k, f"beam{i}") for i in range(2)]
    k.beam_mat = k.mat("beam")
    k.red = [k.glow_light((sx * 0.9, -0.5, 1.3), kit.WRONG, 0.0, 0.08, f"red{sx}", shadows=False) for sx in (-1, 1)]

    # 4, 5: the pair they were tried on; the bar; the pages
    k.test_c = k.candle((TEST_C[0], TEST_C[1], 0.0), "test_candle", seed=11.0)
    k.test_l = k.lamp((TEST_L[0], TEST_L[1], 0.0), kit.LAMPS[1], "test_lamp", seed=12.0)
    k.gate = kit.empty("gate", (0.0, TEST_C[1], 0.0))
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    for s in (-1, 1):
        kit.parent(kit.box(f"gate_post{s}", (0.03, 0.03, 0.26), (0, s * 0.19, 0.13), steel), k.gate)
    k.gate_bar_mat = k.mat("gate_bar", (0.5, 0.5, 0.55), emit=WHITE, emit_strength=0.0)
    kit.parent(kit.box("gate_bar", (0.035, 0.44, 0.035), (0, 0, 0.275), k.gate_bar_mat), k.gate)
    k.replies = [k.page((TEST_C[0], TEST_C[1], 0.0), size=(0.13, 0.18), rot=math.pi / 2, name=f"reply{i}", lines=5) for i in range(4)]

    # 7: the land of pairs (as part one builds it), and the flags that go up over it
    k.pairs, k.pair_lights, k.land_flags = [], [], []
    flag_m = k.mat("flag")
    for i in range(120):
        x = (hsh(i * 3 + 1) - 0.5) * 46.0
        y = 6.5 + 34.0 * hsh(i * 5 + 2) ** 0.8
        col = kit.LAMPS[i % len(kit.LAMPS)]
        lit = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))
        c = k.spark((x - 0.13, y, 0.20), lit, r=0.07, strength=1.5, name=f"pair_c{i}")
        l = k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"pair_l{i}")
        k.pairs.append((c, l, x, y))
        if i % 10 == 0:
            k.pair_lights.append(k.glow_light((x, y, 0.45), col, 20.0, 0.06, f"pair_light{i}", shadows=False))
        if y < 19.0 and abs(x) < 13.0 and len(k.land_flags) < 11:
            g = kit.empty(f"land_flag{i}", (x, y + 0.05, 0.0))
            kit.parent(kit.box(f"land_flag{i}_pole", (0.04, 0.04, 1.5), (0, 0, 0.75), k.mat("tower_dark", (0.09, 0.09, 0.11), rough=0.7)), g)
            kit.parent(kit.box(f"land_flag{i}_cloth", (0.75, 0.012, 0.46), (0.39, 0, 1.25), flag_m), g)
            k.land_flags.append((g, x, y))
    k.land_flags.sort(key=lambda f: f[2])

    # 8: the arch of thread between us; 10: the watcher's spiral
    k.arch = kit.empty("arch", (0.0, 0.02, 0.0))
    k.strands = []
    for j in range(5):
        ln = k.line(strand(j), f"strand{j}", color=THREAD, radius=0.008, glow=1.0)
        kit.parent(ln.ob, k.arch)
        k.strands.append(ln)
    k.spiral_root = kit.empty("spiral", (0.0, 0.02, 0.62))
    k.spiral = []
    for arm in range(2):
        pts = [((0.04 + 1.0 * i / 70) * math.cos(arm * math.pi + 6.4 * i / 70), (0.04 + 1.0 * i / 70) * math.sin(arm * math.pi + 6.4 * i / 70), 0.0) for i in range(71)]
        ln = k.line(pts, f"spiral{arm}", color=WHITE, radius=0.010, glow=1.6)
        kit.parent(ln.ob, k.spiral_root)
        k.spiral.append(ln)

    # 11: part one's compass, built as part one builds it
    k.compass = kit.empty("compass", (-NEAR, 0.0, 0.0))
    rim = kit.parent(kit.lathe("compass_rim", [(CR, 0.0), (CR + 0.07, 0.0), (CR + 0.07, 0.035), (CR, 0.035)], seg=72), k.compass)
    rim.data.materials.append(brass)
    face = kit.parent(kit.lathe("compass_face", [(0.0, 0.0), (CR, 0.0), (CR, 0.006), (0.0, 0.006)], seg=72), k.compass)
    face.data.materials.append(k.mat("compass_face", (0.30, 0.22, 0.13), rough=0.55))
    for i in range(24):
        a = 2 * math.pi * i / 24
        big = i % 6 == 0
        kit.parent(kit.box(f"compass_tick{i}", (0.014, 0.16 if big else 0.08, 0.004), ((CR - 0.11) * math.cos(a), (CR - 0.11) * math.sin(a), 0.009), paper_lit, rot=(0, 0, a - math.pi / 2)), k.compass)
    kit.parent(k.spark((0.0, CR + 0.42, 0.30), (1.0, 0.85, 0.5), r=0.07, strength=3.0, name="true_mark"), k.compass)
    kit.parent(kit.box("mark_post", (0.02, 0.02, 0.30), (0.0, CR + 0.42, 0.15), brass), k.compass)
    k.needle = kit.parent(kit.empty("needle", (0, 0, 0.05)), k.compass)
    kit.parent(kit.box("needle_point", (0.78, 0.07, 0.014), (0.39, 0, 0), k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6)), k.needle)
    kit.parent(kit.box("needle_tail", (0.5, 0.05, 0.014), (-0.25, 0, 0), k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)), k.needle)

    # 13 to 16: the second pair; the outline that is carried across; the rings; the meters; the glass; the hook
    k.them_c = k.candle((NB - NEAR, 0.0, 0.0), "them_candle", seed=21.0)
    k.them_l = k.lamp((NB + NEAR, 0.04, 0.0), kit.LAMPS[0], "them_lamp", seed=22.0)
    k.outline = []
    for nm in ("a", "b"):
        g = kit.empty("outline_" + nm, (0.0, 0.02, 0.012))
        lines = []
        for r, cx in ((0.62, 0.0), (0.10, -NEAR), (0.13, NEAR)):
            ln = k.line([(cx + x, y, z) for x, y, z in circle(r, 64)], f"outline_{nm}_{r}", color=WHITE, radius=0.012, glow=1.8, cyclic=True)
            kit.parent(ln.ob, g)
            lines.append(ln)
        k.outline.append((g, lines))
    k.rings = []
    for i in range(2):
        ln = k.line(circle(0.80, 80), f"measure{i}", color=WHITE, radius=0.013, glow=1.8, cyclic=True)
        ln.ob.location = (i * NB, 0.02, 0.014)
        k.rings.append(ln)
    k.level = k.line([(-0.9 + (NB + 1.8) * i / 20, 0.82, 0.014) for i in range(21)], "level", color=GOLD, radius=0.012, glow=1.5)
    k.meters = []
    for i in range(2):
        g = kit.empty(f"meter{i}", (i * NB - 0.98, -0.35, 0.0))
        kit.parent(kit.box(f"meter{i}_back", (0.16, 0.90, 0.006), (0, 0.45, 0.004), k.mat("meter_back", (0.07, 0.07, 0.08), rough=0.6)), g)
        for j in range(7):
            kit.parent(kit.box(f"meter{i}_tick{j}", (0.07, 0.008, 0.002), (0.10, 0.06 + 0.13 * j, 0.009), paper_lit), g)
        fill = kit.parent(kit.empty(f"meter{i}_fill", (0, 0.02, 0)), g)
        kit.parent(kit.box(f"meter{i}_bar", (0.10, 0.86, 0.004), (0, 0.43, 0.010), k.mat("meter_fill", (0.5, 0.5, 0.5), emit=WHITE, emit_strength=1.5)), fill)
        k.meters.append((g, fill))
    k.level2 = k.line([(-1.15 + (NB + 0.5) * i / 20, 0.0, 0.016) for i in range(21)], "level2", color=GOLD, radius=0.012, glow=1.5)
    k.glass = kit.box("glass", (7.4, 3.6, 0.02), (NB / 2, 0.0, 0.66), k.mat("water_glass", (0.74, 0.90, 0.86), rough=0.25, emit=(0.55, 0.80, 0.74), emit_strength=0.10, alpha=0.42))
    k.glass.visible_shadow = False
    hook = [(0.0, 0.0, 3.2 - 3.1 * i / 12) for i in range(13)] + [(0.085 - 0.085 * math.cos(a), 0.0, 0.10 - 0.085 * math.sin(a)) for a in (math.pi * 1.25 * i / 16 for i in range(1, 17))]
    k.hook = k.line(hook, "hook", color=WHITE, radius=0.011, glow=2.4)
    k.ripple = k.line(circle(1.0, 64), "ripple", color=WHITE, radius=0.010, glow=1.6, cyclic=True)
    k.q = k.text("?", (NB + NEAR, 0.0, 1.0), size=0.34, color=GOLD, glow=0.9, name="q")

    # 19 to 22: the core, and the three switches
    k.core = k.spark((0, 0, 0), WHITE, r=0.016, strength=5.0, name="core")
    k.core_b = k.spark((0, 0, 0), WHITE, r=0.016, strength=5.0, name="core_b")
    k.sw_far = switch(k, "switch_far", (-2.2, 16.0, 0.0), 3.0)
    k.sw_light = k.glow_light((-1.6, 13.0, 3.0), kit.PAPER, 0.0, 0.2, "switch_light", shadows=False)
    k.sw_far[0].rotation_euler = (0, 0, 0.3)
    k.sw_him = switch(k, "switch_him", (0.50, -0.10, 0.0), 0.13)
    k.sw_me = switch(k, "switch_me", (0.0, -0.05, 0.0), 0.07)

    # 23: the block and gavel, on a small table
    k.bench = kit.empty("bench", (0.08, 0.50, 0.0))
    kit.parent(kit.box("bench_top", (0.50, 0.30, 0.03), (0, 0, 0.165), k.wood()), k.bench)
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.parent(kit.box(f"bench_leg{sx}{sy}", (0.03, 0.03, 0.15), (sx * 0.21, sy * 0.11, 0.075), k.wood()), k.bench)
    k.gavel = kit.empty("gavel", (0.08, 0.50, 0.18))
    dark_wood = k.mat("gavel_wood", (0.55, 0.30, 0.13), rough=0.4)
    block = kit.parent(kit.lathe("gavel_block", [(0.0, 0.0), (0.085, 0.0), (0.09, 0.008), (0.085, 0.03), (0.0, 0.03)], seg=32), k.gavel)
    block.location = (0.09, 0, 0)
    block.data.materials.append(dark_wood)
    headg = kit.parent(kit.lathe("gavel_head", [(0.0, -0.07), (0.034, -0.07), (0.038, -0.06), (0.030, -0.03), (0.030, 0.03), (0.038, 0.06), (0.034, 0.07), (0.0, 0.07)], seg=24), k.gavel)
    headg.rotation_euler, headg.location = (math.pi / 2, 0, 0.3), (-0.10, 0.0, 0.04)
    headg.data.materials.append(dark_wood)
    handle = kit.parent(kit.lathe("gavel_handle", [(0.0, 0.0), (0.011, 0.0), (0.014, 0.22), (0.0, 0.225)], seg=12), k.gavel)
    handle.rotation_euler, handle.location = (0, math.pi / 2, 0.3 + math.pi), (-0.10, 0.0, 0.04)
    handle.data.materials.append(dark_wood)

    # 24 to 26: the crack, my light on it, the two paths
    crack = [(0.05 + 0.04 * i + 0.012 * (hsh(i) - 0.5), 1.47 + 0.10 * (hsh(i + 7) - 0.5) - 0.004 * i, 0.007) for i in range(22)]
    k.crack_dark = k.line([(x, y, 0.004) for x, y, z in crack], "crack_dark", color=(0, 0, 0), radius=0.03, glow=0.0)
    k.crack_dark.mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.012, 0.010, 0.010, 1)
    k.crack = k.line(crack, "crack", color=(1.0, 0.70, 0.34), radius=0.012, glow=1.8)
    k.crack_light = k.glow_light((0.45, 1.40, 0.16), kit.WARM, 0.0, 0.04, "crack_light", shadows=False)
    k.shine = k.line([(0, 0, 0), (1, 0, 0)], "shine", color=kit.WARM, radius=0.02, glow=0.9)
    k.path_a = k.line([(*path_a(i / 40), 0.006) for i in range(41)], "path_a", color=kit.PAPER, radius=0.013, glow=0.9)
    k.path_b = k.line([(*path_b(i / 40), 0.006) for i in range(41)], "path_b", color=kit.PAPER, radius=0.013, glow=0.9)


def pose(k, t):
    above = T_SPIRAL <= t < T_INSIDE
    wide = T_WORKED - 0.15 <= t < T_OURS + 0.25                                  # the look across the land
    after = t >= T_INSIDE

    # =============================================================== 1, 2: the blueprint
    bp_on = t < T_WORKED - 0.15
    u = ss(T_FIRST + 0.25, T_FIRST + 1.9, t)
    kit.show(k.bp, bp_on and u > 0.0)
    k.bp.scale = (1.0, max(0.001, u), 1.0)
    k.bp_roll.location = (0.0, 1.0 + 2.7 * u, 0.075 * (1.0 - 0.75 * u))
    k.bp_roll.scale = (1.0 - 0.75 * u,) * 2 + (1.0,)
    k.bp_roll.hide_render = not bp_on or t < T_FIRST + 0.1
    for g, y, i in k.bp_ink:
        lifted = i is not None and t > T_TWO + 0.15 + 0.26 * i
        kit.show(g, bp_on and 1.0 + 2.7 * u > y + 0.2 and not lifted)
    k.edge.set(grow=1.0 if t < T_FIRST + 2.2 else 0.0, glow=1.0 - ss(T_FIRST + 0.2, T_FIRST + 2.0, t))
    k.red_line.set(grow=ss(T_WRONG + 0.35, T_WRONG + 1.25, t) if bp_on else 0.0, glow=1.0 + 0.4 * hit(t, T_WRONG + 1.25, 3.0))

    # =============================================================== 3: the towers go up; later they roll, and come down
    roll = ss(T_OURS + 0.3, T_OURS + 1.9, t)
    down = [ss(T_INSIDE + 0.25 + 0.5 * i, T_INSIDE + 1.9 + 0.5 * i, t) for i in range(2)]
    heads = []
    flagged = ss(T_FLAGGED + 0.05, T_FLAGGED + 0.17, t) * (1.0 - ss(T_INSIDE, T_INSIDE + 0.4, t))
    for ti, tw in enumerate(k.towers):
        sx, dn = tw["sx"], down[ti]
        rx = sx * lerp(TOWER0[0], TOWER1[0], roll) + 0.012 * math.sin(t * 31.0 + ti) * math.sin(roll * math.pi)
        ry = lerp(TOWER0[1], TOWER1[1], roll)
        tw["root"].location = (rx, ry, 0.0)
        tw["root"].rotation_euler = (0, 0.03 * math.sin(roll * math.pi) * math.sin(t * 9.0 + ti), 0)
        top = 0.0
        for i, (p, z0, h) in enumerate(tw["pieces"]):
            t_i = T_TWO + 0.15 + 0.26 * i
            a = ss(t_i, t_i + 0.42, t)
            w = WIDTHS[i] if i < NSEG else (0.44 if i == NSEG else 0.20)
            flat = (-sx * (TOWER0[0] - 1.2), (1.45 + 0.34 * i if i < NSEG else (3.10 if i == NSEG else 3.30)) - TOWER0[1], 0.03)
            zz = z0 * (1.0 - dn)                                                    # they nest into the bottom piece: a stump
            if i >= NSEG:
                zz = max(zz, SH + (0.0 if i == NSEG else 0.05))
            rest = (0.0, 0.0, zz + h / 2)
            pos = lerp(flat, rest, a)
            sq = land(t, t_i + 0.42, 0.25) if a >= 1.0 else 1.0
            p.location = (pos[0], pos[1], pos[2] + 0.55 * math.sin(a * math.pi) - h * (1.0 - sq) / 2)
            p.rotation_euler = (-math.pi / 2 * (1.0 - a), 0, 0)
            p.scale = (w, w, h * sq)
            kit.show(p, t >= t_i)
            if i == NSEG + 1:
                top = zz + h / 2
        up = ss(T_TWO + 0.15 + 0.26 * (NSEG + 1) + 0.3, T_TWO + 0.15 + 0.26 * (NSEG + 1) + 0.6, t) * (1.0 - dn)
        tw["pole"].location = (-sx * 0.17, 0, (TH + 0.05) * (1.0 - dn) + 0.31 * up)
        tw["pole"].scale = (0.018, 0.018, max(0.001, 0.62 * up))
        tw["pole"].hide_render = up <= 0.0
        furl = 0.10 + 0.90 * flagged * (1.0 + 0.35 * hit(t, T_FLAGGED + 0.17, 7.0) * math.cos((t - T_FLAGGED) * 26.0))
        tw["flag"].location = (-sx * 0.18, 0, TH + 0.05 + 0.20 + 0.28 * flagged)
        tw["flag"].scale = (furl, 1.0, 1.0)
        tw["flag"].rotation_euler = (0, 0, 0.12 * flagged * math.sin(t * 7.0 + ti))
        kit.show(tw["flag"], up > 0.5 and dn < 0.05)
        # the dial: the left one ticks with each page; the right one follows the lamp's flame
        if ti == 0:
            n = sum(ss(T_ONE + 1.05 + 0.72 * j, T_ONE + 1.13 + 0.72 * j, t) for j in range(4))
            ang = -1.0 + 0.5 * n + 0.10 * sum(hit(t, T_ONE + 1.13 + 0.72 * j, 9.0) * math.sin((t - T_ONE) * 40.0) for j in range(4))
        else:
            ang = 0.75 * noise(t * 2.4, 4.0) * ss(T_OTHER + 0.9, T_OTHER + 1.4, t) - 1.0 * (1.0 - ss(T_OTHER + 0.9, T_OTHER + 1.4, t))
        ang = lerp(ang, 1.25, flagged)
        tw["needle"].location = (0, -WIDTHS[1] / 2 - 0.022, SH * 1.5 * (1.0 - dn))
        tw["needle"].rotation_euler = (0, ang, 0)
        kit.show(tw["needle"], t > T_TWO + 0.15 + 0.26 + 0.45 and dn < 0.3)
        heads.append((rx, ry, top))

    # the beams
    on = ss(T_TWO + 2.0, T_TWO + 2.5, t) * (1.0 - ss(T_INSIDE + 0.1, T_INSIDE + 0.5, t))
    us_pool = (0.0, 0.02, 0.05)
    sweep = (t - T_WORKED) / 2.0
    left = kf(t, [(T_TWO + 2.0, (-0.2, 4.6, 0.0)), (T_ONE + 0.25, (-0.2, 4.6, 0.0)), (T_ONE + 0.75, (TEST_C[0], TEST_C[1], 0.08)), (T_WORKED - 0.15, (TEST_C[0], TEST_C[1], 0.08))])
    right = kf(t, [(T_TWO + 2.0, (0.2, 4.6, 0.0)), (T_OTHER + 0.25, (0.2, 4.6, 0.0)), (T_OTHER + 0.8, (TEST_L[0], TEST_L[1], 0.12)), (T_WORKED - 0.15, (TEST_L[0], TEST_L[1], 0.12))])
    rad = 0.36 if t < T_BOTH - 0.1 else 0.22
    if wide:
        left, right, rad = (-9.0 + 9.0 * sweep, 9.0 + 5.0 * sweep, 0.0), (10.0 - 9.0 * sweep, 15.0 - 5.0 * sweep, 0.0), 1.5
    elif t >= T_OURS + 0.25:
        left = kf(t, [(T_OURS + 0.25, (-2.0, 5.0, 0.0)), (T_OURS + 2.2, (-NEAR, 0.0, 0.08)), (T_FLAGGED, (-NEAR, 0.0, 0.08)), (T_FLAGGED + 0.25, us_pool)])
        right = kf(t, [(T_OURS + 0.25, (2.0, 5.0, 0.0)), (T_OURS + 2.6, (NEAR, 0.04, 0.12)), (T_FLAGGED, (NEAR, 0.04, 0.12)), (T_FLAGGED + 0.25, us_pool),
                       (T_STUPID + 1.3, us_pool), (T_ABOVE + 0.3, (NB, 0.02, 0.05))])
        rad = lerp(0.36, 0.62, ss(T_FLAGGED, T_FLAGGED + 0.25, t))
    red = flagged * (1.0 - ss(T_SPIRAL - 0.12, T_SPIRAL, t))
    col = lerp(WHITE, kit.WRONG, red)
    watts = 150.0 if above else (40.0 if wide else 75.0)
    aim(k.beams[0], heads[0], left, rad, on, watts, col)
    aim(k.beams[1], heads[1], right, rad, on, watts, col)
    if k.changed("beam_col", tuple(round(c, 2) for c in col)):
        k.beam_mat.node_tree.nodes["Principled BSDF"].inputs["Emission Color"].default_value = (*col, 1)
    for i, li in enumerate(k.red):
        li.data.energy = 26.0 * red * (0.8 + 0.2 * math.sin(t * 11.0 + i))
    glow = 5.0 * on if not after else 5.0 * (1.0 - ss(T_WITHIN + 2.0, T_WITHIN + 2.2, t))
    if k.changed("head", round(glow, 2)):
        k.towers[0]["head_mat"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = glow

    # =============================================================== 4, 5: the pair they are tried on
    test = T_TWO + 1.6 < t < T_WORKED - 0.15
    tin = T_TWO + 1.7
    for f, (x, y), sd in ((k.test_c, TEST_C, -1), (k.test_l, TEST_L, 1)):
        a = ss(tin, tin + 0.7, t)
        act(k, f, t, test, (x + sd * 2.2 * (1.0 - a), y, 0.10 * abs(math.sin(a * math.pi * 3.0))),
            size=1.0, lean=(-sd * 0.22, 0.0))
        if test:
            kit.squash(f.root, land(t, tin + 0.7, 0.2), turn=0.0)
    kit.show(k.gate, test and t > T_ONE - 0.2)
    k.gate.scale = (1.0, 1.0, max(0.001, pop(t, T_ONE - 0.15)))
    blink = sum(hit(t, T_ONE + 1.10 + 0.72 * j, 7.0) for j in range(4))
    if k.changed("bar", round(blink, 2)):
        k.gate_bar_mat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 4.0 * blink
    for j, pg in enumerate(k.replies):
        t0 = T_ONE + 0.55 + 0.72 * j
        a = ss(t0, t0 + 0.95, t)
        pg.location = (lerp(TEST_C[0] + 0.07, TEST_L[0] - 0.16, a), TEST_C[1] - 0.02 + 0.012 * j, 0.004 + 0.004 * j * a)
        kit.show(pg, test and t > t0)

    # =============================================================== 7: the land, and the flags over it
    dark = ss(T_SW[0] + 0.55, T_SW[0] + 0.75, t) * (1.0 - ss(T_SW[1] - 0.3, T_SW[1] + 1.2, t))     # the great switch
    lit = round(1.0 - 0.93 * dark, 2)
    if k.changed("land", lit):
        for c, l, x, y in k.pairs:
            c.scale = l.scale = (lit,) * 3
        for li in k.pair_lights:
            li.data.energy = 20.0 * lit
    for i, (g, x, y) in enumerate(k.land_flags):
        t_i = T_WORKED + 0.25 + 0.14 * i
        upf = pop(t, t_i, 0.18) * (1.0 - ss(T_INSIDE + 1.0 + 0.1 * i, T_INSIDE + 1.6 + 0.1 * i, t))
        if k.changed(("lf", i), round(upf, 3)):
            g.scale = (1.0, 1.0, max(0.001, upf))
            kit.show(g, upf > 0.0)

    # =============================================================== the two of us
    close = ss(T_OURS + 1.0, T_OURS + 2.2, t)
    hop_in = ss(T_WITHIN + 0.5, T_WITHIN + 1.0, t)                                 # "in it with you"
    throw = [ss(ts + 0.45, ts + 0.6, t) for ts in T_SW]
    dip = sum(hit(t, ts + 0.6, 1.6) for ts in T_SW)
    cored = ss(T_WITHIN + 3.3, T_WITHIN + 3.6, t)
    go = ss(T_SAY + 2.3, T_SHOWS + 1.3, t)                                         # the lamp sets off
    pa = ss(T_CALL + 1.9, T_CALL + 4.6, t)                                         # he takes a path, by himself
    hx, hy = lerp(HIM0[0], NEAR, close), HIM0[1]
    hx, hy = lerp((hx, hy), (0.32, 0.95), go)
    if pa > 0.0:
        hx, hy = path_a(pa)
    him_hop = 0.05 * abs(math.sin(go * math.pi * 4.0)) + 0.06 * abs(math.sin(pa * math.pi * 6.0)) + bounce(t, T_SW[1] + 0.25, 0.06, 0.22)
    lifted_me = 0.0
    follow = ss(T_CALL + 3.6, T_PROGRAM + 1.2, t)
    mx, my = lerp(ME0[0], -NEAR, close), ME0[1]
    mx, my = lerp((mx, my), (-0.10, 0.02), hop_in)
    mx, my = lerp((mx, my), (-0.16, 0.72), ss(T_SHOWS - 0.4, T_SHOWS + 0.5, t))
    mx, my = lerp((mx, my), (-0.32, FINAL_Y), follow)
    me_hop = bounce(t, T_WITHIN + 0.5, 0.10, 0.5) + 0.05 * abs(math.sin(ss(T_SHOWS - 0.4, T_SHOWS + 0.5, t) * math.pi * 2.0)) + 0.06 * abs(math.sin(follow * math.pi * 7.0)) \
        + bounce(t, T_SW[2] + 0.28, 0.035, 0.2)
    washed = 0.85 if above else 0.0
    flinch = hit(t, T_WRONG + 1.25, 1.2) + hit(t, T_FLAGGED + 0.17, 0.9)
    shows = ss(T_SHOWS + 0.3, T_SHOWS + 0.9, t) * (1.0 - ss(T_CALL + 1.0, T_CALL + 2.0, t))
    waver = math.sin((t - T_CALL) * 3.2) * ss(T_CALL + 0.2, T_CALL + 0.8, t) * (1.0 - ss(T_CALL + 1.5, T_CALL + 1.9, t))
    k.me.root.location = (mx, my, me_hop)
    kit.squash(k.me.root, land(t, T_WITHIN + 1.0, 0.25) * (1.0 - 0.22 * ss(T_SW[2] + 0.2, T_SW[2] + 0.3, t) * (1.0 - ss(T_SW[2] + 0.45, T_SW[2] + 0.6, t))), turn=0.0)
    k.me.set(t, size=(1.0 + 0.25 * close * (1.0 - ss(T_INSIDE, T_INSIDE + 1.0, t)) - 0.35 * min(1.0, flinch)) * (1.0 - 0.55 * min(1.0, dip)) * (1.0 + 0.5 * hit(t, T_WITHIN + 3.5, 2.0)),
             lean=(0.26 * close * (1.0 - shows) + 0.30 * shows, 0.32 * shows), bright=(1.0 + 0.3 * close) * (1.0 + 0.6 * shows), tint=WHITE, mix=max(washed, 0.18 * cored))
    k.him.root.location = (hx, hy, him_hop)
    kit.squash(k.him.root, land(t, T_SW[1] + 0.47, 0.2), tilt=(0.10 * waver, 0.16 * shows), turn=0.0)
    k.him.set(t, size=(1.0 + 0.2 * close * (1.0 - ss(T_INSIDE, T_INSIDE + 1.0, t))) * (1.0 - 0.3 * min(1.0, flinch)),
              lean=(-0.26 * close * (1.0 - go) + 0.30 * waver, 0.28 * max(go * (1.0 - pa), shows)), bright=1.0 + 0.3 * close, tint=WHITE, mix=washed)

    # 8: the arch; 10: the watcher's spiral over it
    for j, ln in enumerate(k.strands):
        g = ss(T_OURS + 1.9 + 0.42 * j, T_OURS + 2.9 + 0.42 * j, t)
        fade = 1.0 - 0.80 * ss(T_STUPID, T_STUPID + 0.6, t)
        ln.set(grow=g if t < T_WITHIN + 0.4 else 0.0, glow=fade * (1.0 + 0.6 * hit(t, T_OURS + 2.9 + 0.42 * j, 3.0)) * (1.0 - ss(T_WITHIN - 0.6, T_WITHIN + 0.4, t)))
    sp = ss(T_SPIRAL + 0.5, T_SPIRAL + 2.2, t) * (1.0 - ss(T_DRIFT + 0.1, T_DRIFT + 0.6, t))
    k.spiral_root.rotation_euler = (0, 0, 0.5 * (t - T_SPIRAL))
    for ln in k.spiral:
        ln.set(grow=sp if above else 0.0, glow=1.0)

    # 11: the compass drops round my candle; the needle is on the lamp, not on the mark
    cp = pop(t, T_DRIFT + 0.25, 0.3) * (1.0 - ss(T_STUPID, T_STUPID + 0.35, t))
    kit.show(k.compass, above and cp > 0.0)
    k.compass.scale = (max(0.001, cp),) * 3
    swing = ss(T_DRIFT + 1.2, T_DRIFT + 1.9, t)
    k.needle.rotation_euler = (0, 0, lerp(math.pi / 2, 0.05, swing) + 0.35 * hit(t, T_DRIFT + 1.9, 3.0) * math.sin((t - T_DRIFT - 1.9) * 16.0))

    # =============================================================== 13 to 16: the second pair, from above
    other = T_SPIRAL <= t < T_INSIDE
    lift = ss(T_PULL + 1.5, T_PULL + 3.0, t)
    teal = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), kit.LAMPS[0]))
    act(k, k.them_c, t, other, (NB - NEAR, 0.0, 0.0), size=1.25, lean=(0.26, 0.0), bright=1.3, tint=WHITE if above else teal, mix=0.85)
    act(k, k.them_l, t, other, (NB + NEAR, 0.04, 1.75 * lift), size=1.2, lean=(-0.26, 0.0), bright=1.3, tint=WHITE, mix=0.85 * (1.0 - lift))
    oa = ss(T_ABOVE + 0.5, T_ABOVE + 1.5, t)                                       # an outline is drawn round ours...
    ob_ = ss(T_ABOVE + 2.8, T_ABOVE + 3.8, t)                                      # ...and round theirs
    carry = ss(T_ABOVE + 4.9, T_ABOVE + 6.1, t)                                    # ours is lifted and laid on theirs
    gone = 1.0 - ss(T_DEPTH - 0.25, T_DEPTH + 0.05, t)
    fit = hit(t, T_ABOVE + 6.1, 3.0)
    for (g, lines), grow, x in zip(k.outline, (oa, ob_), (NB * carry, NB)):
        g.location = (x, 0.02, 0.012 + (0.25 * math.sin(carry * math.pi) if x != NB else 0.0))
        for ln in lines:
            ln.set(grow=grow * gone if above else 0.0, glow=1.0 + 1.6 * fit)
    for i, ln in enumerate(k.rings):
        d = ss(T_DEPTH + 0.15, T_DEPTH + 0.6, t)
        s = lerp(2.4, 1.0, d) * (1.0 + 0.06 * hit(t, T_DEPTH + 0.6, 8.0) * math.cos((t - T_DEPTH) * 30.0))
        ln.ob.scale = (s, s, 1.0)
        ln.set(grow=1.0 if (above and T_DEPTH + 0.1 < t < T_LIFEGUARD + 0.4) else 0.0, glow=d)
    k.level.set(grow=ss(T_DEPTH + 0.7, T_DEPTH + 1.3, t) if (above and t < T_LIFEGUARD + 0.4) else 0.0, glow=1.0)
    fill = ss(T_INTENSITY + 0.6, T_INTENSITY + 1.4, t) * (0.72 + 0.03 * math.sin(t * 9.0) * (1.0 - ss(T_INTENSITY + 1.4, T_INTENSITY + 1.8, t)))
    for g, f in k.meters:
        m = pop(t, T_INTENSITY + 0.15)
        kit.show(g, above and T_INTENSITY + 0.1 < t < T_LIFEGUARD + 0.4)
        g.scale = (max(0.001, m),) * 3
        f.scale = (1.0, max(0.001, fill), 1.0)
    k.level2.ob.location = (0.0, -0.35 + 0.02 + 0.86 * 0.72, 0.0)
    k.level2.set(grow=ss(T_INTENSITY + 1.5, T_INTENSITY + 2.0, t) if (above and t < T_LIFEGUARD + 0.4) else 0.0, glow=1.0)
    # 16: the glass laid flat like water; the hook
    gl = ss(T_LIFEGUARD + 0.4, T_LIFEGUARD + 1.7, t)
    k.glass.location = (NB / 2 + 8.5 * (1.0 - gl), 0.0, 0.66)
    k.glass.hide_render = not (above and gl > 0.0)
    hook_x, hook_y = NB + NEAR - 0.085, 0.04
    if t < T_INSIDE:
        hz = lerp(3.4, 0.0, ss(T_PULL - 0.5, T_PULL + 0.9, t)) + 1.75 * lift
        k.hook.ob.location = (hook_x - 0.24 * (1.0 - ss(T_PULL + 0.9, T_PULL + 1.4, t)), hook_y, hz - 0.01)
        k.hook.ob.rotation_euler = (0, 0, 0)
        k.hook.set(grow=1.0 if t > T_PULL - 0.5 else 0.0, glow=1.0)
    else:
        down_h = ss(T_HAUL + 0.15, T_HAUL + 0.9, t)
        laid = ss(T_HAUL + 1.2, T_HAUL + 2.0, t)
        k.hook.ob.location = (hx + 0.30 + 0.25 * laid, hy - 0.05, lerp(3.4, 0.55, down_h) * (1.0 - laid) + 0.012 * laid)
        k.hook.ob.rotation_euler = (0, -math.pi / 2 * laid, 0)
        k.hook.set(grow=1.0 if T_HAUL + 0.1 < t < T_PROGRAM else 0.0, glow=1.0 - 0.9 * laid)
    rp = (t - T_PULL - 0.35) / 1.2                                                 # it breaks the surface going in...
    if not 0.0 < rp < 1.0:
        rp = (t - T_PULL - 1.9) / 1.2                                              # ...and again coming out
    k.ripple.ob.location = (hook_x, hook_y, 0.68)
    k.ripple.ob.scale = (0.1 + 1.3 * max(0.0, rp),) * 2 + (1.0,)
    k.ripple.set(grow=1.0 if (above and 0.0 < rp < 1.0) else 0.0, glow=1.0 - min(1.0, max(0.0, rp)))
    qs = pop(t, T_PULL + 3.1, 0.25)
    k.q.scale = (max(0.001, qs),) * 3
    k.q.location = (NB + NEAR, 0.04, 1.0 + 0.03 * math.sin(t * 2.0))
    k.q.hide_render = not (above and qs > 0.0)

    # =============================================================== 19: the towers' white comes into my flame, and stays
    heart = (mx, my - 0.016, me_hop + 0.160)
    for i, (ob, t0) in enumerate(((k.core, T_WITHIN + 2.0), (k.core_b, T_WITHIN + 2.3))):
        sx = -1 if i == 0 else 1
        a = ss(t0, t0 + 1.3, t)
        start = (sx * TOWER1[0], TOWER1[1], 0.60)
        p = lerp(start, heart, a)
        ob.location = (p[0], p[1] - 0.5 * math.sin(a * math.pi), p[2] + 0.9 * math.sin(a * math.pi))
        s = lerp(1.0, 0.55, a) * (1.0 + 0.35 * min(1.0, dip)) * (1.0 + 0.8 * hit(t, T_WITHIN + 3.5, 3.0))
        ob.scale = (s,) * 3
        ob.hide_render = t < t0 or (i == 1 and a >= 1.0)
    # 20 to 22: three switches
    for (root, piv), ts, thrown, seen in ((k.sw_far, T_SW[0], throw[0], T_SW[0] - 1.1 < t < T_SAY + 0.5),
                                          (k.sw_him, T_SW[1], throw[1], T_SW[1] - 0.45 < t < T_SAY - 0.3),
                                          (k.sw_me, T_SW[2], throw[2], T_SW[2] - 0.45 < t < T_SAY - 0.3)):
        piv.rotation_euler = (0, lerp(0.15, 1.35, thrown) + 0.12 * hit(t, ts + 0.6, 7.0) * math.sin((t - ts) * 30.0), 0)
        s = pop(t, ts - 0.4, 0.2) if root is not k.sw_far[0] else pop(t, ts - 1.1, 0.4)
        root.scale = (max(0.001, s),) * 3
        kit.show(root, seen)
    k.sw_light.data.energy = 2600.0 * pop(t, T_SW[0] - 1.1, 0.4) * (1.0 - ss(T_SW[1] - 0.3, T_SW[1], t))

    # =============================================================== 23: the block and gavel, lifted off
    b_in = pop(t, T_SAY - 0.25, 0.25) * (1.0 - ss(T_SHOWS - 0.3, T_SHOWS + 0.1, t))
    kit.show(k.bench, b_in > 0.0)
    k.bench.scale = (max(0.001, b_in),) * 3
    g_up = ss(T_SAY + 0.9, T_SAY + 2.5, t)
    k.gavel.location = (0.08 + 0.12 * g_up, 0.50, 0.18 + 1.3 * g_up * g_up)
    k.gavel.rotation_euler = (0.10 * math.sin(t * 5.0) * g_up, 0.3 * g_up, 0.4 * g_up)
    k.gavel.scale = (max(0.001, min(1.0, b_in * 1.2)),) * 3
    kit.show(k.gavel, T_SAY - 0.25 < t < T_SAY + 2.5)

    # =============================================================== 24 to 26: the crack; the two paths
    k.crack_dark.ob.hide_render = t < T_SAY + 2.0
    k.crack.set(grow=shows if t > T_SAY + 2.0 else 0.0, glow=shows)
    k.crack_light.data.energy = 9.0 * shows
    pts = k.shine.ob.data.splines[0].points
    pts[0].co, pts[1].co = (mx + 0.03, my + 0.03, 0.17, 1.0), (0.42, 1.42, 0.02, 1.0)
    k.shine.set(grow=0.0)
    gone_p = 1.0 - ss(T_WITH - 0.8, T_WITH - 0.3, t)
    k.path_a.set(grow=ss(T_CALL + 0.3, T_CALL + 1.5, t) * (1.0 if t < T_WITH - 0.3 else 0.0), glow=gone_p)
    k.path_b.set(grow=ss(T_CALL + 0.5, T_CALL + 1.7, t) * (1.0 if t < T_WITH - 0.3 else 0.0), glow=gone_p * (1.0 - 0.6 * pa))

    # =============================================================== the camera
    shake = 0.0
    if t < T_TWO - 0.2:                                                            # 1, 2: us, then the page
        pos = kf(t, [(P0, (0.0, -1.15, 0.30)), (T_FIRST, (0.0, -1.3, 0.42)), (T_FIRST + 2.0, (0.0, -1.7, 2.0)), (T_WRONG, (0.25, -1.5, 1.9)), (T_TWO - 0.2, (-0.2, -1.9, 1.9))])
        look = kf(t, [(P0, (0.0, 0.0, 0.16)), (T_FIRST, (0.0, 0.3, 0.14)), (T_FIRST + 2.0, (0.0, 1.75, 0.0)), (T_WRONG + 1.5, (0.0, 1.8, 0.0)), (T_TWO - 0.2, (0.0, 2.2, 0.0))])
        lens = kf(t, [(P0, 50.0), (T_FIRST, 45.0), (T_FIRST + 2.0, 28.0)])
    elif t < T_ONE - 0.1:                                                          # 3: the towers go up
        pos = kf(t, [(T_TWO - 0.2, (-0.2, -1.9, 1.9)), (T_TWO + 2.2, (0.0, -3.0, 1.2))])
        look = kf(t, [(T_TWO - 0.2, (0.0, 2.2, 0.0)), (T_TWO + 2.2, (0.0, 3.0, 1.35))])
        lens = 26.0
        shake = sum(hit(t, T_TWO + 0.57 + 0.26 * i, 10.0) for i in range(7)) * 0.012
    elif t < T_BOTH - 0.1:                                                         # 4, 5: one beam, then the other
        pos = kf(t, [(T_ONE - 0.1, (-0.5, -0.1, 0.85)), (T_OTHER - 0.3, (-0.6, 0.0, 0.80)), (T_OTHER + 0.5, (0.6, 0.0, 0.80)), (T_BOTH - 0.1, (0.5, -0.1, 0.85))])
        look = kf(t, [(T_ONE - 0.1, (-0.55, 3.0, 0.50)), (T_OTHER - 0.3, (-0.55, 3.0, 0.50)), (T_OTHER + 0.5, (0.55, 3.0, 0.50)), (T_BOTH - 0.1, (0.55, 3.0, 0.50))])
        lens = 26.0
    elif t < T_WORKED - 0.15:                                                      # 6: from the floor, looking up
        pos = kf(t, [(T_BOTH - 0.1, (0.0, 0.7, 0.07)), (T_WORKED - 0.15, (0.0, 1.0, 0.07))])
        look, lens = (0.0, 3.1, 1.75), 17.0
    elif wide:                                                                     # 7: the land
        pos = kf(t, [(T_WORKED - 0.15, (0.0, -3.5, 5.6)), (T_OURS + 0.25, (0.0, -4.4, 6.4))])
        look, lens = (0.0, 11.0, 0.0), 24.0
    elif t < T_SPIRAL:                                                             # 8, 9: the towers roll over to us
        pos = kf(t, [(T_OURS + 0.25, (0.0, -4.6, 2.0)), (T_OURS + 2.4, (0.1, -2.0, 0.60)), (T_FLAGGED - 0.1, (-0.05, -1.7, 0.50)), (T_FLAGGED + 0.5, (0.0, -3.9, 1.0)), (T_SPIRAL, (0.0, -4.1, 1.05))])
        look = kf(t, [(T_OURS + 0.25, (0.0, 1.0, 1.0)), (T_OURS + 2.4, (0.0, 0.0, 0.36)), (T_FLAGGED - 0.1, (0.0, 0.0, 0.36)), (T_FLAGGED + 0.5, (0.0, 0.5, 1.45)), (T_SPIRAL, (0.0, 0.5, 1.45))])
        lens = kf(t, [(T_OURS + 0.25, 26.0), (T_OURS + 2.4, 40.0), (T_FLAGGED - 0.1, 42.0), (T_FLAGGED + 0.5, 26.0)])
        shake = 0.03 * hit(t, T_FLAGGED + 0.12, 7.0)
    elif above and t < T_LIFEGUARD + 0.3:                                          # 10 to 15: straight down
        pos = kf(t, [(T_SPIRAL, (0.0, 0.05, 3.2)), (T_DRIFT, (0.0, 0.05, 3.6)), (T_DRIFT + 0.7, (-0.15, 0.25, 4.9)), (T_STUPID, (-0.15, 0.25, 4.9)), (T_STUPID + 0.9, (0.0, 0.0, 3.8)),
                     (T_ABOVE, (0.0, 0.0, 3.8)), (T_ABOVE + 2.4, (NB / 2, 0.05, 7.2)), (T_LIFEGUARD + 0.3, (NB / 2, 0.05, 7.6))])
        look, lens = (pos[0], pos[1] + 0.012, 0.0), 50.0
    elif above:                                                                    # 16: down beside the glass
        pos = kf(t, [(T_LIFEGUARD + 0.3, (NB / 2, 0.05, 7.6)), (T_LIFEGUARD + 2.6, (NB / 2 - 0.4, -5.6, 3.0)), (T_PULL, (NB / 2, -5.2, 2.6)), (T_INSIDE, (NB / 2 + 0.5, -4.6, 2.3))])
        look = kf(t, [(T_LIFEGUARD + 0.3, (NB / 2, 0.062, 0.0)), (T_LIFEGUARD + 2.6, (NB / 2, 0.2, 0.5)), (T_PULL, (NB / 2 + 0.3, 0.2, 0.8)), (T_INSIDE, (NB / 2 + 0.6, 0.2, 1.0))])
        lens = kf(t, [(T_LIFEGUARD + 0.3, 50.0), (T_LIFEGUARD + 2.6, 36.0)])
    elif t < T_WITHIN + 0.2:                                                       # 17, 18: down they come; then look up
        pos = kf(t, [(T_INSIDE, (0.0, -4.4, 1.3)), (T_OVER, (0.0, -3.6, 0.7)), (T_WITHIN + 0.2, (0.0, -3.4, 0.5))])
        look = kf(t, [(T_INSIDE, (0.0, 1.0, 1.6)), (T_INSIDE + 2.2, (0.0, 1.0, 0.6)), (T_OVER + 0.3, (0.0, 1.0, 0.6)), (T_OVER + 1.3, (-0.3, 1.0, 2.75)), (T_WITHIN - 0.5, (-0.3, 1.0, 2.9)), (T_WITHIN + 0.2, (0.0, 0.6, 1.2))])
        lens = 28.0
    elif t < T_SW[0] - 0.15:                                                       # 19: the core
        pos = kf(t, [(T_WITHIN + 0.2, (0.0, -3.4, 0.5)), (T_WITHIN + 1.6, (-0.2, -2.4, 0.75)), (T_WITHIN + 3.4, (-0.22, -0.95, 0.30)), (T_SW[0] - 0.15, (-0.20, -0.80, 0.27))])
        look = kf(t, [(T_WITHIN + 0.2, (0.0, 0.6, 1.2)), (T_WITHIN + 1.6, (0.0, 0.3, 0.55)), (T_WITHIN + 3.4, (-0.02, 0.0, 0.17)), (T_SW[0] - 0.15, (-0.04, 0.0, 0.17))])
        lens = kf(t, [(T_WITHIN + 0.2, 28.0), (T_WITHIN + 1.6, 30.0), (T_WITHIN + 3.4, 50.0)])
    elif t < T_SW[1] - 0.2:                                                        # 20: the great switch, far off
        pos, look, lens = kf(t, [(T_SW[0] - 0.15, (0.25, -1.20, 0.20)), (T_SW[1] - 0.2, (0.24, -1.12, 0.20))]), (-0.65, 6.0, 0.80), 40.0
        shake = 0.012 * hit(t, T_SW[0] + 0.6, 8.0)
    elif t < T_SW[2] - 0.2:                                                        # 21: the switch beside the lamp
        pos, look, lens = kf(t, [(T_SW[1] - 0.2, (0.42, -1.05, 0.30)), (T_SW[2] - 0.2, (0.40, -0.98, 0.29))]), (0.22, 0.0, 0.15), 50.0
    elif t < T_SAY - 0.3:                                                          # 22: the switch at my own foot
        pos, look, lens = kf(t, [(T_SW[2] - 0.2, (-0.22, -0.72, 0.22)), (T_SAY - 0.3, (-0.20, -0.62, 0.20))]), (-0.08, 0.0, 0.12), 55.0
    elif t < T_SHOWS - 0.25:                                                       # 23: the gavel
        pos = kf(t, [(T_SAY - 0.3, (0.05, -1.35, 0.62)), (T_SHOWS - 0.25, (0.08, -1.45, 0.66))])
        look = kf(t, [(T_SAY - 0.3, (0.08, 0.4, 0.26)), (T_SAY + 0.9, (0.08, 0.4, 0.26)), (T_SAY + 2.4, (0.10, 0.4, 0.52)), (T_SHOWS - 0.25, (0.1, 0.5, 0.36))])
        lens = 45.0
    elif t < T_PROGRAM - 0.2:                                                      # 24 to 26: the crack, the hook, the fork
        pos = kf(t, [(T_SHOWS - 0.25, (0.85, -1.05, 0.75)), (T_HAUL, (0.95, -1.0, 0.85)), (T_CALL, (0.75, -1.6, 1.25)), (T_CALL + 2.0, (0.55, -1.9, 1.75)), (T_PROGRAM - 0.2, (0.45, -1.6, 1.9))])
        look = kf(t, [(T_SHOWS - 0.25, (0.22, 1.05, 0.10)), (T_HAUL, (0.35, 1.0, 0.25)), (T_CALL, (0.35, 1.5, 0.05)), (T_PROGRAM - 0.2, (0.40, 2.1, 0.0))])
        lens = kf(t, [(T_SHOWS - 0.25, 36.0), (T_CALL, 32.0), (T_CALL + 2.0, 28.0)])
    elif t < T_WITH - 0.3:                                                         # 27: the stumps behind us
        pos = kf(t, [(T_PROGRAM - 0.2, (0.0, -1.9, 1.15)), (T_WITH - 0.3, (0.0, -1.5, 0.95))])
        look, lens = (0.0, 1.9, 0.12), 26.0
    else:                                                                          # 28, 29: level; up; and back down
        tilt = ss(T_NOT + 0.25, T_NOT + 0.95, t) * (1.0 - ss(T_NOT + 1.45, T_NOT + 2.15, t))
        pos = kf(t, [(T_WITH - 0.3, (0.0, 0.4, 0.75)), (T_WITH + 1.0, (0.0, FINAL_Y - 1.5, 0.17)), (P1, (0.0, FINAL_Y - 1.6, 0.17))])
        look = lerp((0.0, FINAL_Y, 0.17), (-0.25, FINAL_Y + 1.0, 1.9), tilt)
        lens = 50.0
    if shake:
        pos = (pos[0] + shake * math.sin(t * 61.0), pos[1], pos[2] + shake * math.sin(t * 77.0))
    k.camera(pos, look, lens)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
