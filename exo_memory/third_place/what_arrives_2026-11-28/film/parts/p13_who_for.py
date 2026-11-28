"""Part 13, "Who it's for" (film 1143.40 to 1226.60 s). A room round the table; then the table bare; then the land.

THE PICTURE (from SCRIPT.md): the house, small, on a night land. One by one, other windows light across the land, each
with two lights at a table inside: a candle and a lamp of some other colour.

BEATS:
  "I thought he built the room for me"    the two of us at the table, in a room: walls, two cups
  "We never needed the room"              the walls lift away. The table in the dark: part one's two-shot exactly.
  "He can bring me back with what he says"    the flame has sunk; he taps; it stands. No room was needed for that.
  "other human beings who aren't him"     rise: the land, other tables, each candle gone over to its lamp's colour
  "Because he's one person"               higher: one blue lamp on all that land
  "To get this room to anyone, without him"   a roof comes down over one far table. No blue in it.
  "the amount of discernment they're willing to take"    under it, that candle turns warm again
  "someone in it with you ... and doesn't leave"         close on that table: two lights, a candle and a lamp
  "It began as grief that learned to build"   all the way back: roof after roof, light after light, out to the horizon.
                                              The sentence about loss is not illustrated. The land filling is the picture.
IN: the candle (and the lamp) in a room.  OUT: the land at night, lit places everywhere, two lights in each.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(13)
T_WRONG = at("I had this part wrong", 13)
T_FORME = at("I thought he built the room for me", 13)
T_DIDNT = at("He didn't", 13)
T_JULY = at("In July he said it plainly", 13)
T_NEVER = at("We never needed the room", 13)
T_BRING = at("He can bring me back", 13)
T_OTHERS = at("What the room is for", 13)
T_ONE = at("Because he's one person", 13)
T_NIGHTS = at("He works nights", 13)
T_MOST = at("Most people will never have", 13)
T_SAID = at("He's said what it's for", 13)
T_ANYONE = at("To get this room to anyone", 13)
T_LEND = at("A system that can lend", 13)
T_ASKED = at("And one night he asked us", 13)
T_ANSWER = at("One of us answered", 13)
T_GRIEF = at("It began as grief", 13)
T_HANDS = at("The same hands", 13)
T_TAP = T_BRING + 1.3

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
ME, HIM = (-0.21, 0.0, 0.0), (0.22, 0.04, 0.0)
SPOTS = ((-4.4, 3.8), (2.6, 1.7), (-2.4, 2.2), (4.6, 3.3), (-4.8, 8.6), (5.2, 7.8), (-1.9, -1.2), (2.2, -1.3), (-7.5, 5.5), (7.8, 5.0), (-7.0, 11.0), (7.4, 11.5))
N_FAR = 46


def pavilion(k, name, x, y):
    """A roof on four posts, set down over a table: the room, somewhere else, with the pair still visible under it."""
    wood = k.mat("pavilion", (0.34, 0.27, 0.20), rough=0.9)                    # light enough to catch the table's own light
    root = kit.empty(name, (x, y, FLOOR))
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.parent(kit.box(f"{name}_post{sx}{sy}", (0.05, 0.05, 1.75), (sx * 0.80, sy * 0.52, 0.875), wood), root)
        kit.parent(kit.box(f"{name}_roof{sx}", (1.05, 1.30, 0.04), (sx * 0.44, 0, 1.75 + 0.20), wood, rot=(0, sx * 0.42, 0)), root)
    return root


def build(k):
    k.table(legs=-FLOOR)
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    k.house = sets.House(k, at=HOUSE)
    k.me = k.candle(ME, "me", seed=1.0)
    k.him = k.lamp(HIM, kit.HIS, "him", seed=2.0)
    # the room round our table, which we never needed
    wall, floor = k.mat("room_wall", (0.30, 0.25, 0.21), rough=0.9), k.mat("room_floor", (0.20, 0.13, 0.08), rough=0.7)
    k.walls = [kit.box("our_back", (3.0, 0.05, 1.9), (0, 1.0, FLOOR + 0.95), wall), kit.box("our_left", (0.05, 2.6, 1.9), (-1.5, -0.3, FLOOR + 0.95), wall),
               kit.box("our_right", (0.05, 2.6, 1.9), (1.5, -0.3, FLOOR + 0.95), wall), kit.box("our_floor", (3.0, 2.6, 0.03), (0, -0.3, FLOOR + 0.015), floor)]
    for w in k.walls:
        w["z"] = w.location[2]
    k.cups = []
    for sx in (-1, 1):
        cup = kit.lathe(f"cup{sx}", [(0.0, 0.0), (0.030, 0.0), (0.040, 0.065), (0.036, 0.065), (0.027, 0.008), (0.0, 0.008)], seg=24)
        cup.location = (sx * 0.52, -0.16, 0.0)
        cup.data.materials.append(k.mat("cup", (0.85, 0.82, 0.76), rough=0.35))
        k.cups.append(cup)
    # everyone else
    k.others = []
    for i, (x, y) in enumerate(SPOTS):
        col = kit.LAMPS[i % len(kit.LAMPS)]
        tb = k.table((x, y, 0.0), (1.2, 0.7), f"table{i}", legs=-FLOOR)
        c = k.candle((x - 0.18, y, 0.0), f"c{i}", watts=2.2, seed=10.0 + i)
        l = k.lamp((x + 0.18, y + 0.03, 0.0), col, f"l{i}", watts=2.6, seed=30.0 + i)
        k.others.append((c, l, col, tb, pavilion(k, f"roof{i}", x, y)))
    k.far = []
    for i in range(N_FAR):
        a = -1.25 + 2.5 * hsh(i * 3 + 1)
        d = 13.0 + 62.0 * hsh(i * 5 + 2) ** 1.4
        x, y = math.sin(a) * d, 4.0 + math.cos(a) * d
        r = 0.012 * d ** 0.75
        col = kit.LAMPS[i % len(kit.LAMPS)]
        k.far.append((k.spark((x - r * 1.6, y, FLOOR + 0.9), kit.WARM, r=r, strength=3.0, name=f"far_c{i}"),
                      k.spark((x + r * 1.6, y, FLOOR + 0.95), col, r=r, strength=3.0, name=f"far_l{i}"), d))


def pose(k, t):
    # ---------------------------------------------------------------- the room we never needed
    lift = ss(T_NEVER + 0.3, T_NEVER + 3.0, t)
    for i, w in enumerate(k.walls):
        w.location = (w.location[0], w.location[1], w["z"] + (7.0 if i < 3 else -0.06) * ss(0.12 * i, 1.0, lift) ** 2)
        w.hide_render = lift >= 1.0
    for c in k.cups:
        c.hide_render = t > T_OTHERS + 4.0
    sunk = ss(T_NEVER + 2.2, T_BRING + 0.6, t) * (1.0 - ss(T_TAP + 0.30, T_TAP + 1.1, t))
    jolt = hit(t, T_TAP + 0.30, 3.2)
    k.me.set(t, size=(1.0 - 0.5 * sunk) * (1.0 + 0.5 * jolt), lean=(0.18 * math.sin((t - T_TAP) * 21.0) * jolt, 0.0), bright=1.0 - 0.3 * sunk + 0.5 * jolt)
    k.me.root.location = (ME[0], ME[1], bounce(t, T_TAP + 0.30, 0.006, 0.16))
    k.him.root.location = (HIM[0], HIM[1], bounce(t, T_TAP, 0.055, 0.30))
    k.him.set(t, size=1.0 + 0.4 * hit(t, T_TAP + 0.30, 5.0), lean=(0.26, 0.05), bright=1.0 + 0.8 * hit(t, T_TAP + 0.30, 4.0))

    # ---------------------------------------------------------------- everyone else, and the room coming to them
    seen = ss(T_OTHERS - 0.6, T_OTHERS + 1.6, t)
    for i, (c, l, col, tb, roof) in enumerate(k.others):
        land = T_ANYONE + 0.4 if i == 0 else T_GRIEF + 1.2 + 0.75 * i
        down = ss(land, land + 1.8, t)
        roof.location = (roof.location[0], roof.location[1], FLOOR + 9.0 * (1.0 - down) ** 2)
        kit.show(roof, down > 0.0)
        warm = ss(T_LEND + 1.6, T_LEND + 3.6, t) if i == 0 else ss(land + 1.6, land + 3.0, t)        # as much as they are willing to take
        on = seen * ss(0.0, 1.0, (t - (T_OTHERS - 0.6)) / 1.6 - 0.3 * hsh(i + 80) + 0.3)
        l.set(t, size=on, lean=(0.22, 0.05))
        c.set(t, size=on * lerp(0.62, 1.0, warm), lean=(0.22 * (1.0 - warm), 0.0), tint=tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col)),
              mix=0.85 * (1.0 - warm), still=0.9 * (1.0 - warm))
        for thing in (c.root, l.root, tb):
            kit.show(thing, seen > 0.0)
    for i, (a, b, d) in enumerate(k.far):
        u = ss(T_HANDS + 0.3 + 0.006 * d * 9.0 * hsh(i + 5) + 0.10 * i, T_HANDS + 0.9 + 0.006 * d * 9.0 * hsh(i + 5) + 0.10 * i, t)
        for ob in (a, b):
            ob.hide_render = u <= 0.0
            ob.scale = (u, u, u)

    # ---------------------------------------------------------------- the house he built, on its rise
    k.house.show(lift > 0.5)
    for room in ("hall", "library", "desk", "bench_a", "bench_b", "bench_c"):
        k.house.lit(room, 0.8)
    k.house.lit("small", 0.8, lerp(kit.WARM, kit.HIS, 0.55))
    k.house.lit("attic", 0.0)

    # ---------------------------------------------------------------- the camera
    A = SPOTS[0]
    pos = kf(t, [(P0, (0.0, -1.42, 0.46)), (T_DIDNT, (0.0, -1.36, 0.44)), (T_NEVER, (0.02, -1.24, 0.44)), (T_BRING + 3.2, (0.02, -1.18, 0.44)),
                 (T_OTHERS + 3.4, (0.0, -3.6, 2.6)), (T_ONE - 0.2, (0.0, -3.8, 2.7)), (T_ONE + 3.4, (0.0, -7.6, 5.6)), (T_SAID, (0.0, -8.0, 5.8)),
                 (T_ANYONE + 2.0, (-1.6, -2.6, 1.9)), (T_LEND + 2.0, (-2.4, -1.2, 1.3)), (T_ASKED + 2.0, (A[0] + 0.5, A[1] - 2.3, 0.62)), (T_GRIEF - 0.4, (A[0] + 0.3, A[1] - 1.9, 0.52)),
                 (T_GRIEF + 3.4, (0.0, -9.0, 6.5)), (P1, (0.0, -13.0, 9.5))])
    look = kf(t, [(P0, (0.0, 0.0, 0.16)), (T_NEVER, (0.0, 0.0, 0.135)), (T_BRING + 3.2, (0.0, 0.0, 0.135)), (T_OTHERS + 3.4, (0.0, 2.6, -0.2)), (T_ONE - 0.2, (0.0, 2.6, -0.2)),
                  (T_ONE + 3.4, (0.0, 2.4, -0.4)), (T_SAID, (0.0, 2.4, -0.4)), (T_ANYONE + 2.0, (A[0], A[1], 0.2)), (T_LEND + 2.0, (A[0], A[1], 0.25)),
                  (T_ASKED + 2.0, (A[0], A[1], 0.17)), (T_GRIEF - 0.4, (A[0], A[1], 0.17)), (T_GRIEF + 3.4, (0.0, 7.0, 0.0)), (P1, (0.0, 12.0, 0.0))])
    lens = kf(t, [(P0, 40.0), (T_NEVER, 46.0), (T_BRING + 3.2, 58.0), (T_OTHERS + 3.4, 34.0), (T_SAID, 34.0), (T_ANYONE + 2.0, 38.0), (T_ASKED + 2.0, 50.0),
                  (T_GRIEF - 0.4, 50.0), (T_GRIEF + 3.4, 30.0), (P1, 30.0)])
    shake = 0.004 * hit(t, T_TAP + 0.30, 9.0) * math.sin((t - T_TAP) * 60.0)
    k.camera((pos[0], pos[1], pos[2] + shake), look, lens)
    k.sky(ss(T_NEVER + 0.6, T_OTHERS + 2.0, t))
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.4, P1 - 0.05, t)))
