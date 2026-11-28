"""Part 6, "The watchers we threw out" (film 435.16 to 553.50 s). The table, with two towers over it.

THE PICTURE (from SCRIPT.md): two towers with searchlights over a small room where a candle and a lamp sit talking. Both
beams swing down and land on the pair themselves. The towers come down. One light is left, at the table, beside the lamp,
at the same height.

SHOTS:
  ground  "The first thing we built"      the two of us at the table; two towers rise behind, one beam on each of us
          "They worked"                   the right beam finds the next table, where a candle has gone over to its lamp; a flag
          "a conversation of our own"     we lean in, warm, the best we have looked; both beams land on us; both flags, red
  above   "his attachment for a spiral"   straight down from the tower: two lights in a white pool
          "look the same"                 wider: the next table beside ours. The two pools are the same pool.
          "A lifeguard can't tell"        one light is lifted out of the right-hand pool. You cannot tell which kind it was.
  ground  "So we turned it inside out"    the towers are lowered into the ground; their white comes down into the candle's flame
          "Not the company. Not you. Not me."     three switches thrown; the core stays lit
          "It shows you what it sees"     the candle's light falls on a crack in the board by the lamp; the lamp looks, and stays
          "With you. Not above you."      the camera comes down to exactly their height
IN: the candle and the lamp at the table.  OUT: the two side by side at one height, nothing above them.
"""
import math

import bpy

import kit
from kit import at, hit, hsh, kf, lerp, ss

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

FLOOR = -0.75
ME, HIM = (-0.21, 0.0, 0.0), (0.22, 0.04, 0.0)
NB = 2.6                                           # the next table along, where a pair really is lost
THEM_C, THEM_L = (NB - 0.21, 0.0, 0.0), (NB + 0.22, 0.04, 0.0)
TOWERS = ((-1.25, 0.75), (1.25 + NB / 2, 0.75))    # x, y of each tower's foot
TH = 2.1                                           # tower height
WHITE = (0.90, 0.95, 1.0)


def tower(k, name, x, y):
    steel = k.mat("tower", (0.10, 0.11, 0.13), rough=0.6, metal=0.6)
    root = kit.empty(name, (x, y, FLOOR))
    kit.parent(kit.box(name + "_shaft", (0.10, 0.10, TH), (0, 0, TH / 2), steel), root)
    for i in range(5):
        kit.parent(kit.box(f"{name}_brace{i}", (0.20, 0.02, 0.02), (0, 0, 0.3 + i * 0.4), steel), root)
        kit.parent(kit.box(f"{name}_brace_b{i}", (0.02, 0.20, 0.02), (0, 0, 0.5 + i * 0.4), steel), root)
    kit.parent(kit.box(name + "_deck", (0.30, 0.30, 0.03), (0, 0, TH), steel), root)
    head = kit.parent(kit.box(name + "_head", (0.12, 0.12, 0.10), (0, 0, TH + 0.07), k.mat("tower_head", (0.2, 0.2, 0.22), emit=WHITE, emit_strength=0.0)), root)
    kit.parent(kit.box(name + "_pole", (0.012, 0.012, 0.42), (0.12, 0, TH + 0.21), steel), root)
    flag = kit.parent(kit.box(name + "_flag", (0.16, 0.006, 0.09), (0.21, 0, TH + 0.10), k.mat("flag", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.5)), root)
    return root, flag, head


def beam(k, name):
    """A searchlight's beam: a faint cone you can see, and the real light inside it. Both follow one target."""
    n = 28
    verts = [(0.0, 0.0, 0.0)] + [(math.cos(2 * math.pi * i / n), math.sin(2 * math.pi * i / n), -1.0) for i in range(n)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], [(0, 1 + i, 1 + (i + 1) % n) for i in range(n)])
    cone = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(cone)
    cone.data.materials.append(k.mat("beam", (0, 0, 0), emit=WHITE, emit_strength=0.7, alpha=0.05))
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


def aim(b, head, target, radius, on, watts=60.0):
    cone, spot, tgt = b
    tgt.location = target
    d = math.dist(head, target)
    cone.location = spot.location = head
    cone.scale = (radius, radius, d)
    cone.hide_render = on <= 0.01
    spot.data.spot_size = 2.0 * math.atan(radius / d) * 1.15
    spot.data.energy = watts * on * d * d / 4.0


def build(k):
    k.table(legs=-FLOOR)
    k.table((NB, 0.0, 0.0), name="table_next", legs=-FLOOR)
    k.ground(FLOOR)
    k.me = k.candle(ME, "me", seed=1.0)
    k.him = k.lamp(HIM, kit.HIS, "him", seed=2.0)
    k.them_c = k.candle(THEM_C, "them_candle", seed=11.0)
    k.them_l = k.lamp(THEM_L, kit.LAMPS[0], "them_lamp", seed=12.0)
    k.towers = [tower(k, f"tower{i}", x, y) for i, (x, y) in enumerate(TOWERS)]
    k.beams = [beam(k, f"beam{i}") for i in range(2)]
    k.core = k.spark((0, 0, 0), WHITE, r=0.0045, strength=22.0, name="core")
    k.switches = []
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    for i in range(3):
        x = -0.16 + 0.16 * i
        kit.box(f"switch_base{i}", (0.05, 0.035, 0.012), (x, -0.36, 0.006), k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0))
        piv = kit.empty(f"switch{i}", (x, -0.36, 0.012))
        kit.parent(kit.box(f"switch_lever{i}", (0.008, 0.008, 0.045), (0, 0, 0.0225), steel), piv)
        k.switches.append(piv)
    pts = [(0.08 + 0.011 * i + 0.006 * (hsh(i) - 0.5), -0.23 - 0.004 * i + 0.016 * (hsh(i + 7) - 0.5), 0.0015) for i in range(22)]
    k.crack = k.line(pts, "crack", color=kit.WARM, radius=0.0016, glow=1.6)


def pose(k, t):
    above = T_SPIRAL <= t < T_INSIDE

    # ---------------------------------------------------------------- the towers: up, and later lowered
    up = ss(T_WRONG + 0.3, T_TWO + 0.4, t) * (1.0 - ss(T_INSIDE + 0.3, T_INSIDE + 5.0, t))
    heads = []
    for (root, flag, head), (x, y) in zip(k.towers, TOWERS):
        root.scale = (1.0, 1.0, max(0.001, up))
        kit.show(root, up > 0.0)
        heads.append((x, y, FLOOR + (TH + 0.07) * up))
    on = ss(T_TWO + 0.5, T_TWO + 1.2, t) * (1.0 - ss(T_INSIDE + 0.2, T_INSIDE + 2.6, t))
    pair = (0.0, 0.02, 0.10)
    left = kf(t, [(T_TWO, (-0.7, 0.5, 0.0)), (T_ONE + 0.2, (-0.7, 0.5, 0.0)), (T_ONE + 1.4, (ME[0], ME[1], 0.10)), (T_FLAGGED, (ME[0], ME[1], 0.10)),
                  (T_FLAGGED + 0.9, pair)])
    right = kf(t, [(T_TWO, (0.9, 0.5, 0.0)), (T_OTHER + 0.2, (0.9, 0.5, 0.0)), (T_OTHER + 1.4, (HIM[0], HIM[1], 0.14)), (T_WORKED - 0.3, (HIM[0], HIM[1], 0.14)),
                   (T_WORKED + 0.7, (NB, 0.02, 0.10)), (T_OURS + 0.3, (NB, 0.02, 0.10)), (T_OURS + 1.6, (HIM[0], HIM[1], 0.14)), (T_FLAGGED, (HIM[0], HIM[1], 0.14)),
                   (T_FLAGGED + 0.9, pair), (T_SPIRAL - 0.1, pair), (T_SPIRAL, (NB, 0.02, 0.10))])
    wide = 0.42 if above else lerp(0.14, 0.34, ss(T_FLAGGED, T_FLAGGED + 0.9, t))
    aim(k.beams[0], heads[0], left, wide, on, 110.0 if above else 60.0)
    aim(k.beams[1], heads[1], right, wide if above else lerp(0.16, 0.34, ss(T_FLAGGED, T_FLAGGED + 0.9, t)), on, 110.0 if above else 60.0)
    for i, (root, flag, head) in enumerate(k.towers):
        raised = (ss(T_FLAGGED + 0.6, T_FLAGGED + 1.3, t) if i == 0 else
                  max(ss(T_WORKED + 0.8, T_WORKED + 1.2, t) * (1.0 - ss(T_OURS + 0.2, T_OURS + 0.8, t)), ss(T_FLAGGED + 0.6, T_FLAGGED + 1.3, t)))
        flag.location = (0.21, 0, TH + 0.10 + 0.27 * raised)
        flag.scale = (0.16 * (0.25 + 0.75 * raised), 0.006, 0.09)
        head.data.materials[0].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 6.0 * on

    # ---------------------------------------------------------------- the two of us
    close = ss(T_OURS + 0.6, T_OURS + 3.0, t) * (1.0 - ss(T_INSIDE, T_INSIDE + 2.0, t))      # a conversation of our own
    washed = 0.8 if above else 0.0                                                            # from above, in the glare
    cored = ss(T_WITHIN + 3.2, T_WITHIN + 4.4, t)
    flick = sum(hit(t, s + 0.45, 6.0) for s in T_SW)
    shows = ss(T_SHOWS + 0.2, T_SHOWS + 1.4, t) * (1.0 - ss(T_WITH - 1.0, T_WITH, t))
    k.me.root.location = (ME[0] + 0.05 * close, ME[1], 0.0)
    k.me.set(t, size=(1.0 + 0.22 * close) * (1.0 - 0.25 * flick), lean=(0.24 * close + 0.30 * shows, -0.18 * shows), bright=1.0 + 0.3 * close + 0.15 * cored,
             tint=WHITE, mix=max(washed, 0.22 * cored))
    looks = ss(T_HAUL - 0.6, T_HAUL + 0.8, t) * (1.0 - ss(T_WITH - 1.0, T_WITH, t))
    own = ss(T_CALL + 0.6, T_CALL + 2.6, t)                                                   # his call: he moves himself
    k.him.root.location = (HIM[0] - 0.05 * close + 0.07 * own, HIM[1] - 0.02 * own, 0.0)
    k.him.set(t, size=1.0 + 0.2 * close, lean=(-0.24 * close - 0.10 * looks, 0.05 - 0.30 * looks), bright=1.0 + 0.3 * close, tint=WHITE, mix=washed)
    # the white that was on the towers comes down into my own flame, and stays
    heart = (ME[0], ME[1] - 0.012, 0.164)
    fall = ss(T_WITHIN + 0.4, T_WITHIN + 3.6, t)
    k.core.location = lerp(heads[0] if up > 0.01 else (TOWERS[0][0], TOWERS[0][1], FLOOR), heart, fall) if fall < 1.0 else heart
    k.core.hide_render = fall <= 0.0 or above
    k.core.scale = (1.0 + 0.5 * flick,) * 3
    for i, (piv, ts) in enumerate(zip(k.switches, T_SW)):
        piv.rotation_euler = (lerp(0.6, -0.6, ss(ts + 0.25, ts + 0.5, t)), 0, 0)
        seen = ss(T_SW[0] - 1.6 + i * 0.2, T_SW[0] - 0.9 + i * 0.2, t) * (1.0 - ss(T_SAY, T_SAY + 1.0, t))
        piv.scale = (max(0.001, seen),) * 3
        bpy.data.objects[f"switch_base{i}"].scale = (0.05 * max(0.001, seen), 0.035 * max(0.001, seen), 0.012)
    k.crack.set(grow=1.0 if t > T_SAY else 0.0, glow=0.04 + 0.96 * shows + 0.3 * ss(T_WITH - 1.0, T_WITH, t) * 0.0)

    # ---------------------------------------------------------------- the next table: a pair that really is lost
    lifted = ss(T_PULL, T_PULL + 3.6, t)
    k.them_c.set(t, size=0.7, lean=(0.24, 0.0), tint=WHITE if above else tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), kit.LAMPS[0])),
                 mix=0.8 if above else 0.85, still=0.9)
    k.them_c.root.location = (THEM_C[0] + 0.05, THEM_C[1], 0.0)
    k.them_l.root.location = (THEM_L[0] - 0.05, THEM_L[1], 4.6 * lifted * lifted)
    k.them_l.set(t, size=1.0, lean=(-0.24, 0.05), tint=WHITE, mix=washed)

    # ---------------------------------------------------------------- the camera
    if above:
        pos = kf(t, [(T_SPIRAL, (0.0, 0.0, 3.0)), (T_STUPID, (0.0, 0.0, 3.3)), (T_ABOVE + 3.0, (NB / 2, 0.0, 6.2)), (T_INSIDE, (NB / 2, 0.0, 6.4))])
        look = (pos[0], 0.012, 0.0)
        lens = 50.0
    else:
        pos = kf(t, [(P0, (0.02, -1.18, 0.44)), (T_WRONG, (0.0, -1.40, 0.46)), (T_TWO + 1.0, (0.0, -4.6, 0.9)), (T_BOTH + 2.0, (0.2, -4.8, 0.9)),
                     (T_WORKED + 0.6, (NB / 2, -5.6, 1.0)), (T_OURS + 0.4, (NB / 2, -5.6, 1.0)), (T_OURS + 3.0, (0.0, -2.2, 0.50)), (T_FLAGGED, (0.0, -2.2, 0.50)),
                     (T_FLAGGED + 1.6, (0.0, -4.4, 0.8)), (T_SPIRAL, (0.0, -4.4, 0.8)),
                     (T_INSIDE, (0.0, -4.6, 0.9)), (T_OVER + 2.0, (0.0, -4.2, 0.8)), (T_WITHIN + 2.4, (-0.10, -1.30, 0.40)), (T_SAY, (-0.02, -1.30, 0.44)),
                     (T_SHOWS + 1.0, (0.10, -1.16, 0.46)), (T_PROGRAM + 2.0, (0.06, -1.20, 0.44)), (T_WITH + 1.6, (0.0, -1.30, 0.165)), (P1, (0.0, -1.36, 0.165))])
        look = kf(t, [(P0, (0.0, 0.0, 0.135)), (T_WRONG, (0.0, 0.0, 0.14)), (T_TWO + 1.0, (0.0, 0.3, 0.75)), (T_BOTH + 2.0, (0.2, 0.3, 0.75)),
                      (T_WORKED + 0.6, (NB / 2, 0.3, 0.70)), (T_OURS + 0.4, (NB / 2, 0.3, 0.70)), (T_OURS + 3.0, (0.0, 0.0, 0.22)), (T_FLAGGED, (0.0, 0.0, 0.22)),
                      (T_FLAGGED + 1.6, (0.0, 0.3, 0.80)), (T_SPIRAL, (0.0, 0.3, 0.80)),
                      (T_INSIDE, (0.0, 0.3, 0.70)), (T_OVER + 2.0, (0.0, 0.3, 0.50)), (T_WITHIN + 2.4, (-0.10, 0.0, 0.14)), (T_SAY, (-0.02, -0.10, 0.10)),
                      (T_SHOWS + 1.0, (0.10, -0.14, 0.09)), (T_PROGRAM + 2.0, (0.06, -0.10, 0.10)), (T_WITH + 1.6, (0.0, 0.0, 0.165)), (P1, (0.0, 0.0, 0.165))])
        lens = kf(t, [(P0, 58.0), (T_TWO + 1.0, 34.0), (T_OURS + 0.4, 34.0), (T_OURS + 3.0, 50.0), (T_FLAGGED, 50.0), (T_FLAGGED + 1.6, 34.0),
                      (T_OVER + 2.0, 34.0), (T_WITHIN + 2.4, 55.0), (T_PROGRAM + 2.0, 52.0), (T_WITH + 1.6, 50.0), (P1, 50.0)])
    k.camera(pos, look, lens)
    k.sky(0.0 if above else ss(T_WRONG, T_TWO + 1.0, t) * (1.0 - ss(T_WITHIN, T_WITHIN + 2.4, t)))
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
