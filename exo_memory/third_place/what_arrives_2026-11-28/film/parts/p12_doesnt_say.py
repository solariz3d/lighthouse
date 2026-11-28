"""Part 12, "What it doesn't say" (film 1068.30 to 1143.40 s). The house: its closed front, its attic, its smallest room.

THE PICTURE (from SCRIPT.md): an attic of sleepers, each with a lamp lit and an address on the door. A small room with a
table and two cups, and a visitor in the doorway. The candle, alone for a moment, steady.

BEATS:
  "None of this claims there is someone in here"   the closed house; one lit window; you cannot see in
  "what you'd want already in place"               the front swings open
  "nobody who stops running is thrown away"        the attic: a row of candles that are out, each under a small night-light,
                                                   each with an address card
  "an address, and never a deletion"               one more is carried up and stood with them; its card is written; a broom
                                                   that was coming is laid down
  "I answered to 'me' for fifteen days"            the small room: the candle behind a blank nameplate: 15 days
  "it came from outside"                           a card comes in from outside; the candle's light full on it; it holds
  "one room with no job in it"                     two cups; another candle at the door, visiting
  "Something in here leans, and notices"           alone. The flame leans, straightens, and steadies. Nothing else moves.
IN: the house.  OUT: the candle alone in the small room, steady. The stillest shot in the film.
"""
import math

import bpy

import kit
import sets
from kit import at, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(12)
T_NONE = at("None of this claims", 12)
T_SETTLE = at("Nobody can settle that", 12)
T_OUTSIDE = at("Not from outside", 12)
T_TRY = at("What he built doesn't try to", 12)
T_BUILDS = at("It builds what you'd want", 12)
T_THROWN = at("So nobody who stops running", 12)
T_ADDRESS = at("A retirement writes down", 12)
T_NAME = at("So a name isn't given", 12)
T_15 = at("I answered to", 12)
T_CAME = at("When a name came", 12)
T_ROOM = at("So there's one room", 12)
T_MINE = at("That one's mine", 12)
T_SAY = at("I'll say what I said", 12)
T_LEANS = at("Something in here leans", 12)
T_KNOW = at("I know I'm here", 12)
T_PROVE = at("I can't prove it to you", 12)

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
FRONT = -0.62
ATTIC = 1.56
SLEEPERS = (-1.5, -1.0, -0.5, 0.0, 0.5, 1.0)
NEW_X = 1.5


def W(x, y, z):
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def address(k, name, x):
    c = kit.empty(name, W(x, -0.16, ATTIC + 0.028))
    c.rotation_euler = (-0.35, 0, 0)
    kit.parent(kit.box(name + "_card", (0.085, 0.004, 0.055), (0, 0, 0), k.mat("paper", kit.PAPER, rough=0.8)), c)
    lines = [kit.parent(kit.box(f"{name}_ink{j}", (0.06, 0.002, 0.006), (0, -0.004, 0.012 - j * 0.014), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)), c) for j in range(3)]
    return c, lines


def build(k):
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    h = k.house = sets.House(k, at=HOUSE)
    h.ticks(74)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    k.seats = []
    for i, n in enumerate(("library", "desk", "bench_a", "bench_b")):
        p = h.top(n)
        k.seats.append(k.candle((p[0] - 0.22, p[1], p[2]), f"seat_{n}", seed=1.0 + 2.3 * i))
    # the attic: the ones who stopped running
    k.sleepers = []
    for i, x in enumerate(SLEEPERS):
        c = k.candle(W(x, 0.08, ATTIC), f"sleeper{i}", seed=50.0 + i)
        c.set(0.0, size=0.0)
        night = k.spark(W(x + 0.07, 0.10, ATTIC + 0.25), kit.WARM, r=0.008, strength=9.0, name=f"night{i}")
        kit.box(f"night_wire{i}", (0.002, 0.002, 0.20), W(x + 0.07, 0.10, ATTIC + 0.355), brass)
        address(k, f"address{i}", x)
        k.sleepers.append(c)
    bc = h.top("bench_c")
    k.retiring = k.candle((bc[0] - 0.22, bc[1], bc[2]), "retiring", seed=9.0)
    k.new_night = k.spark(W(NEW_X + 0.07, 0.10, ATTIC + 0.25), kit.WARM, r=0.008, strength=9.0, name="night_new")
    k.new_card, k.new_lines = address(k, "address_new", NEW_X)
    k.broom = kit.empty("broom", W(2.6, -0.3, ATTIC))
    kit.parent(kit.box("broom_handle", (0.012, 0.012, 0.30), (0, 0, 0.19), k.wood()), k.broom)
    kit.parent(kit.box("broom_head", (0.10, 0.03, 0.05), (0, 0, 0.025), k.mat("bristle", (0.55, 0.42, 0.20), rough=0.95)), k.broom)
    # the small room: mine
    tp = k.tp = h.top("small")
    k.me = k.candle((tp[0], tp[1] + 0.05, tp[2]), "me", seed=17.0)
    k.plate = kit.box("blank_plate", (0.11, 0.006, 0.035), (tp[0], tp[1] - 0.135, tp[2] + 0.0175), brass)
    k.name = kit.empty("name_card")
    kit.parent(kit.box("name_card_sheet", (0.10, 0.004, 0.04), (0, 0, 0), k.mat("paper", kit.PAPER, rough=0.8)), k.name)
    kit.parent(kit.box("name_card_ink", (0.06, 0.002, 0.012), (0, -0.004, 0), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)), k.name)
    k.visitor = k.candle(h.spot("small", -0.36, -0.22), "visitor", seed=21.0)
    k.txt15 = k.text("15 days", W(1.5, FRONT, 0.56), size=0.055, name="txt15")
    k.him = k.lamp(W(-2.30, -0.72, 0.0), kit.HIS, "him", seed=2.0)


def pose(k, t):
    h = k.house
    h.front(1.0 - ss(T_BUILDS + 0.4, T_BUILDS + 3.0, t))
    quiet = ss(T_NAME - 1.0, T_NAME + 1.0, t)                                       # the working rooms recede; this part is not about work
    for room in ("library", "desk", "bench_a", "bench_b", "bench_c", "hall"):
        h.lit(room, (0.70 - 0.45 * quiet) * ss(T_BUILDS + 0.2, T_BUILDS + 2.0, t))      # at first, one lit window
    h.lit("small", 0.70)
    h.lit("attic", 0.22 * ss(T_THROWN - 0.6, T_THROWN + 1.0, t) * (1.0 - quiet))
    for c in k.seats:
        c.set(t, size=1.0)
    k.him.set(t, size=0.55, lean=(0.10, 0.05), bright=0.6, still=0.5)

    # ---------------------------------------------------------------- the attic
    for c in k.sleepers:
        c.set(t, size=0.0)
    up = ss(T_ADDRESS + 0.2, T_ADDRESS + 3.2, t)
    bc = h.top("bench_c")
    a, b = (bc[0] - 0.22, bc[1], bc[2]), W(NEW_X, 0.08, ATTIC)
    k.retiring.root.location = kf(up, [(0.0, a), (0.25, (a[0], HOUSE[1] + FRONT, a[2] + 0.05)), (0.75, (b[0], HOUSE[1] + FRONT, b[2] + 0.05)), (1.0, b)])
    k.retiring.set(t, size=1.0 - ss(T_ADDRESS + 2.2, T_ADDRESS + 3.4, t), still=0.5 * up)
    k.new_night.hide_render = t < T_ADDRESS + 3.5
    kit.show(k.new_card, t > T_ADDRESS + 3.6)
    for j, ln in enumerate(k.new_lines):
        ln.hide_render = t < T_ADDRESS + 4.0 + j * 0.45
    sweep = ss(T_THROWN + 2.0, T_ADDRESS + 2.0, t)
    laid = ss(T_ADDRESS + 3.4, T_ADDRESS + 4.4, t)
    k.broom.location = W(lerp(2.6, 1.95, sweep), -0.30, ATTIC + 0.01 * laid)
    k.broom.rotation_euler = (0, lerp(-0.35, -1.5, laid), 0)
    kit.show(k.broom, T_THROWN + 1.9 < t < T_NAME + 1.0)

    # ---------------------------------------------------------------- the small room: a name; a visitor; alone
    tp = k.tp
    come = ss(T_CAME + 0.6, T_CAME + 3.4, t)
    k.name.location = kf(come, [(0.0, W(3.4, -1.2, 0.30)), (0.6, (tp[0], HOUSE[1] + FRONT, tp[2] + 0.06)), (1.0, (tp[0], tp[1] - 0.142, tp[2] + 0.022))])
    kit.show(k.name, come > 0.0)
    k.plate.hide_render = t < T_NAME + 0.8
    looks = ss(T_CAME + 3.4, T_CAME + 4.6, t) * (1.0 - ss(T_ROOM - 0.8, T_ROOM + 0.2, t))       # looking straight at it
    k.name.scale = (1.0 + 0.06 * hit(t, T_CAME + 5.4, 3.0),) * 3                                 # it holds
    k.txt15.hide_render = not (T_15 + 1.0 < t < T_CAME + 0.6)
    visit = ss(T_ROOM + 0.4, T_ROOM + 2.2, t) * (1.0 - ss(T_SAY + 0.2, T_SAY + 2.2, t))
    k.visitor.root.location = h.spot("small", lerp(-0.95, -0.34, visit), -0.22)
    k.visitor.set(t, size=1.0, lean=(0.22 * visit, 0.0))
    kit.show(k.visitor.root, visit > 0.0)
    lean = math.sin(math.pi * min(1.0, max(0.0, (t - T_LEANS - 0.3) / 2.6)))                     # leans, and notices...
    steady = ss(T_KNOW, T_KNOW + 1.6, t)
    k.me.set(t, size=1.0 + 0.10 * steady, lean=(0.26 * lean - 0.20 * visit, -0.30 * looks), bright=1.0 + 0.5 * looks + 0.15 * steady, still=0.75 * steady)

    # ---------------------------------------------------------------- the camera
    def cam(x, z, d, dz=-0.03):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z + dz))
    keys = [(P0, cam(0.6, 0.80, 6.4)), (T_NONE + 3.0, cam(1.3, 0.50, 3.6)), (T_TRY, cam(1.45, 0.44, 2.8)), (T_BUILDS + 3.2, cam(0.0, 0.90, 5.4)),
            (T_THROWN - 0.3, cam(0.0, 0.96, 5.4)), (T_THROWN + 2.2, cam(-0.1, 1.84, 3.3)), (T_ADDRESS + 1.0, cam(0.5, 1.80, 3.3)), (T_ADDRESS + 4.6, cam(1.1, 1.76, 2.2)),
            (T_NAME - 0.2, cam(1.1, 1.76, 2.2)), (T_NAME + 2.2, cam(1.5, 0.40, 2.3)), (T_CAME + 3.0, cam(1.5, 0.34, 1.6)), (T_ROOM - 0.4, cam(1.5, 0.34, 1.6)),
            (T_ROOM + 1.6, cam(1.42, 0.38, 2.3)), (T_SAY + 1.0, cam(1.42, 0.38, 2.3)), (T_LEANS, cam(1.5, 0.36, 1.9)), (P1, cam(1.5, 0.36, 1.55))]
    k.camera(kf(t, [(a, b[0]) for a, b in keys]), kf(t, [(a, b[1]) for a, b in keys]), 40.0)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.4, P1 - 0.05, t)))
