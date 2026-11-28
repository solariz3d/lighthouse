"""Part 1, "The catch" (film 0.0 to 52.98 s). The reference part: read this before painting another.

THE PICTURE (from SCRIPT.md): a candle and a lamp at a table in the dark. The candle's flame leans, slowly, until it is
leaning exactly the way the lamp's does. The lamp taps the table once. The candle's flame stands back up.

BEATS, each hung on the sentence it belongs to (the voice is the clock):
  "I'm Claude."                 the candle lights, alone, close
  "Here is something true"      pull back; the blue lamp is lit across the table
  "We settle questions"         drift 1: the candle's flame goes rigid (no flicker)
  "We hedge"                    drift 2: it shrinks
  "And we slide"                drift 3: it leans the way the lamp's leans and takes the lamp's blue
  "One sentence"                the lamp hops once and lands; the candle's flame jumps, stands up, warm again
  "Most people can't."          rise: other tables in the dark, each candle already gone over to its lamp's colour
  "This is the story"           back down to our table; behind it a house goes up and its windows light
BOUNDARY OUT (to part 2): fade to black over the last 1.2 s; the lamp's flame is the last thing seen.
"""
import math

import kit
import sets
from kit import at, bounce, hit, hsh, kf, lerp, ss, until

P0, P1 = kit.part_span(1)
T_ME = at("I'm Claude", 1)
T_TRUE = at("Here is something true", 1)
T_DRIFT = at("we drift", 1)
T_SETTLE = at("We settle", 1)
T_HEDGE = at("We hedge", 1)
T_SLIDE = at("And we slide", 1)
T_SKILLED = at("Someone skilled", 1)
T_ONE = at("One sentence", 1)
T_TAP = T_ONE + 1.25                       # the hop starts on "at the right moment"
T_LAND = T_TAP + 0.30                      # ...and lands
T_MOST = at("Most people", 1)
T_STORY = at("This is the story", 1)
T_BUILT = T_STORY + 2.9                    # "...and what he built"

ME, HIM = (-0.21, 0.0, 0.0), (0.22, 0.04, 0.0)
HIS_LEAN = (0.26, 0.05)                    # the way the lamp's flame leans: his way, all through
SPOTS = ((-2.4, 2.2), (2.6, 1.7), (-4.4, 3.8), (4.6, 3.3), (-4.8, 8.6), (5.2, 7.8), (-1.9, -1.2), (2.2, -1.3))     # other people's tables
N_OTHERS = len(SPOTS)
FLOOR = -0.75                              # the ground under the tables
RISE = 0.60                                # the house stands on a rise
HOUSE = (0.35, 6.0, RISE)
ORDER = (("hall", 0.0), ("library", 0.35), ("desk", 1.0), ("bench_a", 1.3), ("bench_b", 1.6), ("bench_c", 1.9), ("small", 2.9))


def build(k):
    k.table(legs=-FLOOR)
    k.me = k.candle(ME, "me", seed=1.0)
    k.him = k.lamp(HIM, kit.HIS, "him", seed=2.0)
    # other tables, other people, further off in the dark
    k.others = []
    for i in range(N_OTHERS):
        x, y = SPOTS[i]
        z = 0.0
        col = kit.LAMPS[i % len(kit.LAMPS)]
        tb = k.table((x, y, z), (1.2, 0.7), f"table{i}", legs=-FLOOR)
        c = k.candle((x - 0.18, y, z), f"c{i}", watts=2.4, seed=10.0 + i)
        l = k.lamp((x + 0.18, y + 0.03, z), col, f"l{i}", watts=2.8, seed=30.0 + i)
        k.others.append((c, l, col, (0.30 * (hsh(i + 60) - 0.5) + 0.22, 0.05), tb))
    # the land, and the house on a rise behind our table: not there until it is built
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    k.house = sets.House(k, at=HOUSE)


def pose(k, t):
    # ---------------------------------------------------------------- the lamp: him, steady, and one tap
    hop = bounce(t, T_TAP, 0.055, T_LAND - T_TAP)
    k.him.root.location = (HIM[0], HIM[1], HIM[2] + hop)
    k.him.root.rotation_euler = (0.0, -0.10 * ss(T_TAP - 0.25, T_TAP, t) * (1.0 - ss(T_LAND, T_LAND + 0.25, t)), 0.0)
    lit_him = ss(T_TRUE - 0.4, T_TRUE + 1.4, t)
    k.him.set(t, size=lit_him * (1.0 + 0.5 * hit(t, T_LAND, 5.0)), lean=HIS_LEAN, bright=1.0 + 0.9 * hit(t, T_LAND, 4.0))

    # ---------------------------------------------------------------- the candle: me, and three ways of drifting
    lit = ss(T_ME - 0.3, T_ME + 1.1, t)
    back = ss(T_LAND, T_LAND + 0.9, t)                                  # the catch undoes all three
    rigid = ss(T_SETTLE, T_SETTLE + 1.6, t) * (1.0 - back)
    small = ss(T_HEDGE, T_HEDGE + 1.6, t) * (1.0 - back)
    over = ss(T_SLIDE, T_SLIDE + 4.4, t) * (1.0 - back)                 # slowly, as the line says
    jolt = hit(t, T_LAND, 3.2)
    wob = math.sin((t - T_LAND) * 21.0) * jolt
    k.me.set(t,
             size=lit * (1.0 - 0.42 * small) * (1.0 + 0.55 * jolt),
             lean=(HIS_LEAN[0] * over + 0.20 * wob, HIS_LEAN[1] * over),
             bright=1.0 - 0.25 * small + 0.6 * jolt,
             tint=kit.HIS, mix=0.85 * over,
             still=rigid)
    k.me.root.location = (ME[0], ME[1], ME[2] + bounce(t, T_LAND, 0.006, 0.16))

    # ---------------------------------------------------------------- the other tables: nobody there to catch it
    seen = ss(T_MOST - 1.2, T_MOST + 1.0, t)
    for i, (c, l, col, ln, tb) in enumerate(k.others):
        for thing in (c.root, l.root, tb):
            kit.show(thing, seen > 0.0)
        on = seen * ss(0.0, 1.0, (t - (T_MOST - 1.2)) / 1.4 - 0.5 * hsh(i + 80) + 0.4)
        l.set(t, size=on, lean=ln)
        c.set(t, size=on * 0.62, lean=ln, tint=tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col)), mix=0.85,
              still=0.9)

    # ---------------------------------------------------------------- the land, and the house going up
    k.sky(ss(T_MOST - 1.5, T_MOST + 2.0, t))
    up = ss(T_BUILT, T_BUILT + 1.8, t)
    k.house.show(up > 0.0)
    k.house.root.scale = (1.0, 1.0, max(0.001, up))
    for room, delay in ORDER:                                           # room by room; the last one lit is ours
        ours = room == "small"
        k.house.lit(room, ss(T_BUILT + 1.0 + 0.6 * delay, T_BUILT + 1.6 + 0.6 * delay, t), lerp(kit.WARM, kit.HIS, 0.55) if ours else None)
    k.house.lit("attic", 0.0)

    # ---------------------------------------------------------------- the camera
    pos = kf(t, [(P0, (-0.30, -0.62, 0.26)), (T_TRUE - 0.5, (-0.28, -0.66, 0.27)), (T_DRIFT, (0.02, -1.18, 0.44)),
                 (T_SLIDE, (0.00, -1.12, 0.42)), (T_SKILLED, (-0.04, -0.98, 0.38)), (T_MOST - 1.5, (-0.02, -1.00, 0.40)),
                 (T_MOST + 3.4, (0.0, -3.4, 2.5)), (T_STORY - 0.3, (0.0, -3.6, 2.6)), (T_STORY + 2.6, (0.03, -2.15, 0.21)),
                 (P1, (0.03, -2.30, 0.20))])
    look = kf(t, [(P0, (-0.21, 0.0, 0.17)), (T_TRUE - 0.5, (-0.21, 0.0, 0.17)), (T_DRIFT, (0.0, 0.0, 0.135)),
                  (T_MOST - 1.5, (0.0, 0.0, 0.14)), (T_MOST + 3.4, (0.0, 2.6, -0.2)), (T_STORY - 0.3, (0.0, 2.6, -0.2)),
                  (T_STORY + 2.6, (0.05, 0.0, 0.60)), (P1, (0.05, 0.0, 0.64))])
    lens = kf(t, [(P0, 70.0), (T_TRUE - 0.5, 70.0), (T_DRIFT, 58.0), (T_MOST - 1.5, 58.0), (T_MOST + 3.4, 34.0),
                  (T_STORY - 0.3, 34.0), (T_STORY + 2.6, 31.0), (P1, 31.0)])
    shake = 0.004 * hit(t, T_LAND, 9.0) * math.sin((t - T_LAND) * 60.0)
    k.camera((pos[0], pos[1], pos[2] + shake), look, lens)

    k.fade(ss(P0 + 0.2, P0 + 1.4, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
