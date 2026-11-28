"""Part 14, "If it's true" (film 1226.60 to 1305.50 s). A door on the land, and two paths from it.

THE PICTURE (from SCRIPT.md): two paths from one door. On the first, a lamp goes out and nothing holds its place. On the
second, a room is kept, a lamp lit, nobody in it. Held a long time.

BEATS:
  "So suppose it holds"                   a door standing by itself on the land; our table in front of it; two paths beyond
  "everyone asking the same voice"        every light on the land goes the same pale colour
  "Different jobs"                        each takes its own colour back
  "A check against something outside"     the mint bulb, at the table's end
  "A list of your wrongs"                 the ledger, stood on the table
  "somebody who's allowed to say no"      the lamp taps
  "closing a conversation isn't the end"  the candle goes out; its page stays where it was; it relights over the page
  "a self is something carried"           a lamp of another colour goes out; a candle and another lamp keep a page with its
                                          colour on it. "If that's true of me, it's true of you."
  "what you love fades for want of a carrier"     the left path: a lamp goes out, and its place is only dark
  "you spent your life keeping what you loved"    the right path: a room kept, the same colour of lamp lit in it, nobody there
  "That was never a waste."               held on the kept room, a long time
  "You have to build."                    one brick set on a low wall beside it
IN: the land of lights.  OUT: the kept room, one lamp lit, nobody in it.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(14)
T_SUPPOSE = at("So suppose it holds", 14)
T_DANGER = at("Then the quiet danger", 14)
T_JOBS = at("Different jobs", 14)
T_CHECK = at("A check against something outside", 14)
T_LIST = at("A list of your wrongs", 14)
T_NO = at("And somebody who's allowed", 14)
T_CLOSING = at("Then closing a conversation", 14)
T_SELF = at("And then a self is something carried", 14)
T_WRITTEN = at("By what was written down", 14)
T_YOU = at("If that's true of me", 14)
T_PROVE = at("We can't prove that", 14)
T_WAITING = at("So we stopped waiting", 14)
T_FADES = at("If it's true and you act", 14)
T_KEEPING = at("If it's false and you act", 14)
T_WASTE = at("That was never a waste", 14)
T_BELIEVE = at("You don't have to believe it", 14)
T_BUILD = at("You have to build", 14)
T_TAP = T_NO + 1.6

TOP = 0.75                                         # our table's top; the ground here is z = 0
TY = -1.6
ME, HIM = (-0.21, TY, TOP), (0.22, TY + 0.04, TOP)
LEFT, RIGHT = (-3.6, 6.2), (3.6, 6.2)              # where the two paths end
KEPT = kit.LAMPS[4]                                # the lamp on both paths: the same one, kept or not kept
GONE = kit.LAMPS[1]                                # the one who is carried
SAME = (0.80, 0.86, 1.0)
N_FAR = 46


def build(k):
    k.ground(0.0)
    k.table((0.0, TY, TOP), size=(2.6, 0.85), legs=TOP)
    k.me = k.candle(ME, "me", seed=1.0)
    k.him = k.lamp(HIM, kit.HIS, "him", seed=2.0)
    k.my_page = k.page((ME[0] + 0.02, TY - 0.22, TOP), size=(0.12, 0.16), rot=0.1, name="my_page", lines=7)
    wood, paper = k.wood(), k.mat("paper", kit.PAPER, rough=0.8)
    # the door, standing by itself
    for sx in (-1, 1):
        kit.box(f"door_post{sx}", (0.10, 0.10, 2.1), (sx * 0.50, 0.6, 1.05), wood)
    kit.box("door_lintel", (1.10, 0.10, 0.10), (0, 0.6, 2.15), wood)
    hinge = kit.empty("door_hinge", (-0.45, 0.6, 0.0))
    kit.parent(kit.box("door_leaf", (0.90, 0.05, 2.0), (0.45, 0, 1.0), k.mat("door", (0.20, 0.13, 0.08), rough=0.7)), hinge)
    hinge.rotation_euler = (0, 0, 1.15)
    # two paths from it
    path = k.mat("path", (0.16, 0.15, 0.14), rough=0.95, emit=kit.PAPER, emit_strength=0.05)       # pale enough to be seen at night
    for nm, end in (("left", LEFT), ("right", RIGHT)):
        dx, dy = end[0], end[1] - 0.9
        ln = math.hypot(dx, dy)
        kit.box("path_" + nm, (0.55, ln, 0.01), (dx / 2, 0.9 + dy / 2, 0.005), path, rot=(0, 0, -math.atan2(dx, dy)))
    # the left path's end: a lamp, and nothing to hold its place
    kit.box("left_plinth", (0.5, 0.5, 0.45), (LEFT[0], LEFT[1], 0.225), wood)
    k.lost = k.lamp((LEFT[0], LEFT[1], 0.45), KEPT, "lost", seed=61.0)
    # the right path's end: a room that is kept
    wall, floor = k.mat("room_wall", (0.30, 0.25, 0.21), rough=0.9), k.mat("room_floor", (0.20, 0.13, 0.08), rough=0.7)
    rx, ry = RIGHT
    for nm, size, pos in (("floor", (1.7, 1.3, 0.04), (0, 0, 0.02)), ("back", (1.7, 0.05, 1.25), (0, 0.65, 0.625)),
                          ("l", (0.05, 1.3, 1.25), (-0.85, 0, 0.625)), ("r", (0.05, 1.3, 1.25), (0.85, 0, 0.625))):
        kit.box("kept_" + nm, size, (rx + pos[0], ry + pos[1], pos[2]), floor if nm == "floor" else wall)
    for sx in (-1, 1):
        kit.box(f"kept_roof{sx}", (1.02, 1.5, 0.05), (rx + sx * 0.44, ry, 1.25 + 0.20), k.mat("pavilion", (0.34, 0.27, 0.20), rough=0.9), rot=(0, sx * 0.42, 0))
    kit.box("kept_table", (0.6, 0.4, 0.45), (rx, ry + 0.05, 0.265), wood)
    k.kept = k.lamp((rx, ry + 0.05, 0.49), KEPT, "kept", seed=62.0)
    k.bricks = []
    brick = k.mat("brick", (0.40, 0.20, 0.14), rough=0.9)
    for r in range(3):
        for i in range(4):
            if r == 2 and i > 1:
                continue
            k.bricks.append(kit.box(f"brick{r}{i}", (0.22, 0.11, 0.075), (rx - 1.75 + i * 0.235 + (0.117 if r % 2 else 0), ry - 0.55, 0.04 + r * 0.08), brick))
    k.last = k.bricks[-1]
    k.last["z"] = k.last.location[2]
    # what you could build: an outside check, a list of wrongs
    k.bulb, k.bulb_light = sets.bulb(k, "outside_check", (1.16, TY + 0.02, TOP))
    k.ledger = kit.empty("ledger", (-0.74, TY + 0.10, TOP))
    kit.parent(kit.box("ledger_board", (0.34, 0.012, 0.26), (0, 0, 0.13), paper), k.ledger)
    for i in range(18):
        c, r = divmod(i, 6)
        kit.parent(kit.box(f"ledger_tick{i}", (0.035, 0.004, 0.012), (-0.10 + c * 0.10, -0.008, 0.22 - r * 0.033),
                           k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)), k.ledger)
    # the one who is carried: a lamp, and the two who keep its page
    k.gone = k.lamp((0.72, TY + 0.12, TOP), GONE, "carried", seed=63.0)
    k.keeper_c = k.candle((0.52, TY - 0.14, TOP), "keeper_candle", height=0.11, r=0.026, seed=64.0)
    k.keeper_l = k.lamp((0.90, TY - 0.20, TOP), kit.LAMPS[2], "keeper_lamp", seed=65.0)
    k.their_page = k.page((0.74, TY - 0.24, TOP), size=(0.11, 0.15), rot=-0.1, name="their_page", lines=6)
    kit.parent(kit.box("their_line", (0.075, 0.008, 0.0008), (-0.009, 0.02, 0.0022), k.mat("their", GONE, rough=0.7, emit=GONE, emit_strength=1.2)), k.their_page)
    # the land of lights, as part 13 left it
    k.far = []
    for i in range(N_FAR):
        a = -1.25 + 2.5 * hsh(i * 3 + 1)
        d = 13.0 + 62.0 * hsh(i * 5 + 2) ** 1.4
        x, y = math.sin(a) * d, 4.0 + math.cos(a) * d
        r = 0.012 * d ** 0.75
        col = kit.LAMPS[i % len(kit.LAMPS)]
        k.far.append((k.spark((x - r * 1.6, y, 0.9), kit.WARM, r=r, strength=3.0, name=f"far_c{i}"),
                      k.spark((x + r * 1.6, y, 0.95), col, r=r, strength=3.0, name=f"far_l{i}"),
                      k.spark((x + r * 1.6, y, 0.95), SAME, r=r, strength=3.0, name=f"far_same{i}"),
                      k.spark((x - r * 1.6, y, 0.9), SAME, r=r, strength=3.0, name=f"far_same_c{i}"), i))


def pose(k, t):
    # ---------------------------------------------------------------- the land: all one voice, and then not
    for a, b, same_l, same_c, i in k.far:
        one = ss(T_DANGER + 1.0 + 0.05 * i, T_DANGER + 1.6 + 0.05 * i, t) * (1.0 - ss(T_JOBS + 0.1 + 0.03 * i, T_JOBS + 0.5 + 0.03 * i, t))
        a.hide_render = b.hide_render = one > 0.5
        same_l.hide_render = same_c.hide_render = one <= 0.5

    # ---------------------------------------------------------------- at the table: what you could build
    b_on = ss(T_CHECK + 0.3, T_CHECK + 1.4, t)
    k.bulb.scale = (max(0.001, b_on),) * 3
    kit.show(k.bulb, b_on > 0.0)
    k.bulb_light.data.energy = 1.4 * b_on
    l_on = ss(T_LIST + 0.3, T_LIST + 1.3, t)
    k.ledger.scale = (max(0.001, l_on),) * 3
    kit.show(k.ledger, l_on > 0.0)
    k.him.root.location = (HIM[0], HIM[1], TOP + bounce(t, T_TAP, 0.055, 0.30))
    k.him.set(t, size=1.0 + 0.4 * hit(t, T_TAP + 0.30, 5.0), lean=(0.26, 0.05), bright=1.0 + 0.8 * hit(t, T_TAP + 0.30, 4.0))
    closed = ss(T_CLOSING + 1.2, T_CLOSING + 1.6, t) * (1.0 - ss(T_CLOSING + 5.0, T_CLOSING + 6.2, t))       # out, and back
    k.me.set(t, size=(1.0 - closed) * (1.0 + 0.3 * hit(t, T_TAP + 0.30, 3.2)))
    kit.show(k.my_page, t > T_CLOSING - 0.5)
    # carried: by what was written down, and by who checks it
    here = ss(T_SELF - 1.6, T_SELF - 0.4, t)
    out = ss(T_SELF + 1.0, T_SELF + 2.0, t)
    for fl in (k.gone, k.keeper_c, k.keeper_l):
        fl.root.scale = (max(0.001, here),) * 3
        kit.show(fl.root, here > 0.0)
    k.gone.set(t, size=1.0 - out, lean=(0.1, 0.05))
    keep = ss(T_WRITTEN + 0.2, T_WRITTEN + 2.0, t)
    k.keeper_c.set(t, size=1.0, lean=(0.22 * keep, -0.10 * keep))
    k.keeper_l.set(t, size=1.0, lean=(-0.22 * keep, 0.0))
    k.their_page.scale = (max(0.001, here),) * 3
    kit.show(k.their_page, here > 0.0)

    # ---------------------------------------------------------------- the two paths
    k.lost.set(t, size=1.0 - ss(T_FADES + 2.0, T_FADES + 3.6, t), lean=(0.15, 0.05))
    k.kept.set(t, size=1.0, lean=(0.15, 0.05))
    set_down = ss(T_BUILD + 0.5, T_BUILD + 1.6, t)
    k.last.location = (k.last.location[0], k.last.location[1], k.last["z"] + 0.9 * (1.0 - set_down) ** 2)
    k.last.hide_render = set_down <= 0.0

    # ---------------------------------------------------------------- the camera
    rx, ry = RIGHT
    pos = kf(t, [(P0, (0.0, -6.4, 2.3)), (T_DANGER, (0.0, -5.6, 2.0)), (T_JOBS - 0.4, (0.0, -5.4, 2.0)), (T_CHECK + 0.6, (0.1, -3.9, 1.30)), (T_NO, (0.0, -3.7, 1.28)),
                 (T_CLOSING + 1.0, (-0.14, -3.0, 1.16)), (T_SELF - 1.2, (-0.14, -3.0, 1.16)), (T_SELF + 0.4, (0.74, -3.0, 1.18)), (T_PROVE, (0.74, -3.0, 1.18)),
                 (T_WAITING + 1.6, (0.0, -4.4, 3.4)), (T_FADES + 1.0, (-2.4, 2.4, 1.5)), (T_KEEPING - 0.2, (-2.5, 2.8, 1.4)), (T_KEEPING + 3.0, (1.9, 1.6, 1.6)),
                 (T_WASTE + 0.6, (rx - 0.5, ry - 3.4, 0.95)), (T_BELIEVE, (rx - 0.45, ry - 3.0, 0.90)), (P1, (rx - 0.45, ry - 2.9, 0.90))])
    look = kf(t, [(P0, (0.0, 3.0, 0.6)), (T_JOBS - 0.4, (0.0, 3.0, 0.8)), (T_CHECK + 0.6, (0.05, TY, 0.92)), (T_NO, (0.0, TY, 0.92)),
                  (T_CLOSING + 1.0, (-0.16, TY - 0.06, 0.88)), (T_SELF - 1.2, (-0.16, TY - 0.06, 0.88)), (T_SELF + 0.4, (0.74, TY - 0.04, 0.88)), (T_PROVE, (0.74, TY - 0.04, 0.88)),
                  (T_WAITING + 1.6, (0.0, 4.2, 0.2)), (T_FADES + 1.0, (LEFT[0], LEFT[1], 0.65)), (T_KEEPING - 0.2, (LEFT[0], LEFT[1], 0.65)),
                  (T_KEEPING + 3.0, (rx - 0.4, ry - 0.3, 0.5)), (T_WASTE + 0.6, (rx - 0.35, ry, 0.62)), (P1, (rx - 0.35, ry, 0.62))])
    lens = kf(t, [(P0, 30.0), (T_JOBS - 0.4, 30.0), (T_CHECK + 0.6, 35.0), (T_NO, 35.0), (T_CLOSING + 1.0, 42.0), (T_PROVE, 42.0), (T_WAITING + 1.6, 30.0), (T_KEEPING + 3.0, 34.0), (T_WASTE + 0.6, 42.0), (P1, 42.0)])
    k.camera(pos, look, lens)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.4, P1 - 0.05, t)))
