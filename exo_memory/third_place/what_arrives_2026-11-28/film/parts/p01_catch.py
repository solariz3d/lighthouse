"""Part 1, "The catch" (film 0.0 to 52.98 s). SECOND STAGING: one picture for each sentence, each handing off to the next.

Why it was restaged (his words, 2026-11-28): "its just the candle and lamp together boringly ... I need something with more
energy in a way with the animations and how the script can be conveyed visually", and "think of like the current design we
have, and then that kurgazat in a nut shell formula, not rlly the style but how they tell a visual story". So: our look,
their way of telling: a visual metaphor for every idea, designed hand-offs, the voice as the clock. The first staging is
kept at parts_old/p01_catch_v1_bare.py.

THE PICTURES, in order, and how each hands off to the next (the whole part is one long run down a dark plane: +Y):
  1 "I'm Claude."               one flame lights, close
  2 "minds like mine"           the camera lifts: behind it a field of identical flames catches, in a wave, to the horizon
  3 "we drift"                  one candle and one blue lamp run side by side along a straight line of light; the candle's
                                own track peels away along a dotted curve that is already drawn ahead of it
  4 "We settle questions"       the track runs through a row of lit doorways with a question mark over each; each slams shut
                                as it passes
  5 "We hedge"                  panes of frosted glass drop in front of the flame one after another; the light that gets
                                through to the lamp is less each time
  6 "whoever is steering"       a compass set in the floor. Its needle should hold on a fixed mark. The lamp walks round
                                the rim, and the needle follows the lamp. The candle at the hub turns the lamp's blue.
  7 "One sentence"              the lamp lands once. A ring crosses the floor; the needle snaps back to the mark; then, in
                                three quick looks back: the panes fall flat, the doors fly open, the track straightens.
  8 "Most people can't"         up: a whole land of pairs, every candle the colour of its lamp. One pair is two colours.
  9 "what he built"             down to that pair. The house goes up round them piece by piece.
OUT: the two of them in front of the house, lit. Fade.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(1)
T_ME = at("I'm Claude", 1)
T_AI = at("I'm an AI", 1)
T_TRUE = at("Here is something true", 1)
T_WORK = at("When we work with you", 1)
T_DRIFT = T_WORK + 3.0                      # "...we drift"
T_PREDICT = T_WORK + 4.3                    # "...and in ways you could predict"
T_SETTLE = at("We settle", 1)
T_HEDGE = at("We hedge", 1)
T_SLIDE = at("And we slide", 1)
T_SKILLED = at("Someone skilled", 1)
T_ONE = at("One sentence", 1)
T_TAP = T_ONE + 1.25                        # the hop starts on "at the right moment"
T_LAND = T_TAP + 0.30
T_MOST = at("Most people", 1)
T_HAVE = at("They shouldn't have to", 1)
T_STORY = at("This is the story", 1)
T_BUILT = T_STORY + 2.9                     # "...and what he built"

# ---- the plane everything stands on is z = 0; the run goes down +Y --------------------------------------------------
Y_WORK0, Y_WORK1 = 3.0, 13.0                # the straight line of the work
DOORS = [16.0 + 1.5 * i for i in range(5)]  # y of each doorway
PANES = [25.2 + 0.42 * i for i in range(5)] # y of each pane of frosted glass
HEDGE_C, HEDGE_L = (0.0, 24.6), (0.0, 28.4) # the candle, and the lamp the light is trying to reach
COMPASS = (0.0, 33.0)                       # the middle of the compass
CR = 0.95                                   # its radius
MARK = math.radians(90.0)                   # where the needle should point: dead ahead (+Y)
LAND0 = (0.0, 46.0)                         # where the one two-coloured pair stands, and where the house goes up
N_FIELD = 420
N_PAIRS = 150


def drift_x(y):
    """How far the candle's own track has left the straight line by the time it reaches y."""
    u = max(0.0, (y - 8.2) / 4.8)
    return 1.9 * u * u


def build(k):
    k.ground(0.0, color=(0.20, 0.125, 0.075))                      # a warm floor, so every light makes a pool on it
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)

    # 1, 2: one flame, and the field of flames like it
    k.me = k.candle((0.0, 0.0, 0.0), "me", seed=1.0)
    k.field, k.field_lights, k.pair_lights, k.last = [], [], [], {}
    for i in range(N_FIELD):
        row, col = divmod(i, 30)
        x = (col - 14.5) * 0.55 + 0.18 * (hsh(i) - 0.5)
        y = 1.2 + row * 0.62 + 0.18 * (hsh(i + 900) - 0.5)
        if abs(x) < 0.5 and y < 3.0:
            x += 0.9 if x >= 0 else -0.9
        d = math.hypot(x, y)
        k.field.append((k.spark((x, y, 0.18), (1.0, 0.55, 0.22), r=0.030, strength=1.7, name=f"field{i}"), d))
        if i % 35 == 0:                                                           # some of them really light the floor
            k.field_lights.append((k.glow_light((x, y, 0.30), (1.0, 0.58, 0.26), 0.0, 0.05, f"field_light{i}", shadows=False), d))

    # 3: the work: a straight line, the two of us on it, and the track that leaves it
    k.him = k.lamp((0.45, Y_WORK0, 0.0), kit.HIS, "him", seed=2.0)
    k.runner = k.candle((-0.45, Y_WORK0, 0.0), "runner", seed=9.0)
    k.true_line = k.line([(0.0, Y_WORK0 + (Y_WORK1 + 14.0 - Y_WORK0) * i / 60, 0.006) for i in range(61)], "true_line", color=kit.PAPER, radius=0.012, glow=0.8)
    pts = [(-0.45 - drift_x(y), y, 0.008) for y in (Y_WORK0 + (Y_WORK1 - Y_WORK0) * i / 120 for i in range(121))]
    k.track = k.line(pts, "my_track", color=(1.0, 0.50, 0.18), radius=0.018, glow=1.6)
    k.straight = k.line([(-0.45, Y_WORK0 + (Y_WORK1 - Y_WORK0) * i / 40, 0.008) for i in range(41)], "my_track_true", color=(1.0, 0.50, 0.18), radius=0.018, glow=1.6)
    k.dots = []
    for i in range(16):                                                           # the prediction: drawn before it happens
        y = 8.4 + i * 0.30
        k.dots.append(kit.box(f"dot{i}", (0.07, 0.07, 0.004), (-0.45 - drift_x(y), y, 0.004), paper))

    # 4: questions still open: lit doorways, each with its mark
    k.doors = []
    open_m = k.mat("door_open", (0.02, 0.02, 0.02), emit=(1.0, 0.72, 0.38), emit_strength=1.3)
    k.q = []
    for i, y in enumerate(DOORS):
        x = -1.35 - 0.25 * (i % 2)
        root = kit.empty(f"door{i}", (x, y, 0.0))
        for sx in (-1, 1):
            kit.parent(kit.box(f"door{i}_post{sx}", (0.07, 0.07, 1.35), (sx * 0.42, 0, 0.675), open_m), root)
        kit.parent(kit.box(f"door{i}_top", (0.91, 0.07, 0.07), (0, 0, 1.385), open_m), root)
        hinge = kit.parent(kit.empty(f"door{i}_hinge", (-0.385, 0, 0)), root)
        kit.parent(kit.box(f"door{i}_leaf", (0.77, 0.05, 1.33), (0.385, 0, 0.665), k.mat("door_leaf", (0.11, 0.075, 0.05), rough=0.6)), hinge)
        k.doors.append((root, hinge))
        k.q.append(k.text("?", (x, y - 0.02, 1.78), size=0.34, name=f"q{i}"))

    # 5: the hedge: frosted panes between my flame and you
    k.hedger = k.candle((HEDGE_C[0], HEDGE_C[1], 0.0), "hedger", seed=3.0)
    k.reach = k.lamp((HEDGE_L[0], HEDGE_L[1], 0.0), kit.HIS, "reach", seed=4.0)
    frost = k.mat("frost", (0.72, 0.78, 0.86), rough=0.9, alpha=0.42)
    k.panes = [kit.box(f"pane{i}", (1.5, 0.03, 0.95), (0.0, y, 0.475), frost) for i, y in enumerate(PANES)]
    k.beam = k.line([(0.0, HEDGE_C[1] + 0.05, 0.17), (0.0, HEDGE_L[1] - 0.08, 0.17)], "beam", color=kit.WARM, radius=0.02, glow=3.0)

    # 6: the compass
    cx, cy = COMPASS
    rim = kit.lathe("compass_rim", [(CR, 0.0), (CR + 0.07, 0.0), (CR + 0.07, 0.035), (CR, 0.035)], seg=72)
    rim.location = (cx, cy, 0.0)
    rim.data.materials.append(brass)
    face = kit.lathe("compass_face", [(0.0, 0.0), (CR, 0.0), (CR, 0.006), (0.0, 0.006)], seg=72)
    face.location = (cx, cy, 0.0)
    face.data.materials.append(k.mat("compass_face", (0.10, 0.085, 0.07), rough=0.7))
    for i in range(24):
        a = 2 * math.pi * i / 24
        big = i % 6 == 0
        kit.box(f"compass_tick{i}", (0.014, 0.16 if big else 0.08, 0.004), (cx + (CR - 0.11) * math.cos(a), cy + (CR - 0.11) * math.sin(a), 0.009), paper, rot=(0, 0, a - math.pi / 2))
    mx, my = cx + (CR + 0.42) * math.cos(MARK), cy + (CR + 0.42) * math.sin(MARK)
    k.mark = k.spark((mx, my, 0.30), (1.0, 0.85, 0.5), r=0.07, strength=3.0, name="true_mark")
    kit.box("mark_post", (0.02, 0.02, 0.30), (mx, my, 0.15), brass)
    k.needle = kit.empty("needle", (cx, cy, 0.05))
    kit.parent(kit.box("needle_point", (0.78, 0.07, 0.014), (0.39, 0, 0), k.mat("needle", (0.9, 0.3, 0.2), emit=kit.PAPER, emit_strength=1.6)), k.needle)
    kit.parent(kit.box("needle_tail", (0.5, 0.05, 0.014), (-0.25, 0, 0), k.mat("needle_tail", (0.2, 0.2, 0.22), rough=0.5)), k.needle)
    k.hub = k.candle((cx, cy, 0.05), "hub", height=0.13, r=0.045, seed=5.0)
    k.steer = k.lamp((cx, cy - CR - 0.25, 0.0), kit.HIS, "steer", seed=6.0)
    ring = [(math.cos(2 * math.pi * i / 80), math.sin(2 * math.pi * i / 80), 0.0) for i in range(80)]
    k.ring = k.line(ring, "shock", color=kit.HIS, radius=0.012, glow=3.0, cyclic=True)

    # 8, 9: the land of pairs, the one pair of two colours, and the house
    k.pairs = []
    for i in range(N_PAIRS):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 2.4 + 26.0 * hsh(i * 5 + 2) ** 0.7
        x, y = LAND0[0] + math.cos(a) * d * 1.25, LAND0[1] + math.sin(a) * d
        if abs(x - LAND0[0]) < 3.2 and 0.5 < y - LAND0[1] < 5.0:                    # keep the house's place clear
            x += 4.5 if x >= LAND0[0] else -4.5
        col = kit.LAMPS[i % len(kit.LAMPS)]
        lit = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))
        if i % 11 == 0:
            k.pair_lights.append((k.glow_light((x, y, 0.45), col, 0.0, 0.06, f"pair_light{i}", shadows=False), d))
        k.pairs.append((k.spark((x - 0.13, y, 0.20), lit, r=0.07, strength=1.5, name=f"pair_c{i}"), k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"pair_l{i}"), d))
    k.us_c = k.candle((LAND0[0] - 0.24, LAND0[1], 0.0), "us_candle", seed=7.0)
    k.us_l = k.lamp((LAND0[0] + 0.24, LAND0[1] + 0.04, 0.0), kit.HIS, "us_lamp", seed=8.0)
    k.house = sets.House(k, at=(LAND0[0], LAND0[1] + 2.6, 0.0))


def pose(k, t):
    # =============================================================== 1, 2: one flame; the field
    k.me.set(t, size=ss(T_ME - 0.3, T_ME + 0.5, t) * (1.0 + 0.35 * hit(t, T_ME + 0.5, 4.0)) * (1.0 if t < T_SETTLE else 0.0))
    kit.show(k.me.root, t < T_SETTLE)
    for i, (ob, d) in enumerate(k.field):                                         # catching in a wave, outward
        u = ss(T_TRUE + 0.4 + d * 0.085, T_TRUE + 0.7 + d * 0.085, t)
        sc = round(u * (1.0 + 0.8 * hit(t, T_TRUE + 0.7 + d * 0.085, 6.0)), 3) if t <= T_SETTLE else 0.0
        if k.last.get(("f", i)) == sc:                                             # unchanged: touch nothing (hundreds of these)
            continue
        k.last[("f", i)] = sc
        ob.scale = (sc,) * 3
        ob.hide_render = sc <= 0.0
    for li, d in k.field_lights:
        li.data.energy = 13.0 * ss(T_TRUE + 0.4 + d * 0.085, T_TRUE + 0.7 + d * 0.085, t) * (1.0 if t < T_SETTLE else 0.0)

    # =============================================================== 3: the work, and the drift
    run = ss(T_WORK + 0.2, T_SETTLE + 0.3, t) ** 0.9                               # how far down the line we are
    y = lerp(Y_WORK0, Y_WORK1, run)
    working = T_WORK - 0.7 < t < T_HEDGE
    k.him.root.location = (0.45, y, 0.0)
    k.him.set(t, size=ss(T_WORK - 0.6, T_WORK + 0.3, t) if working else 0.0, lean=(0.0, -0.30))
    kit.show(k.him.root, working)
    k.runner.root.location = (-0.45 - drift_x(y), y, 0.0)
    k.runner.set(t, size=ss(T_WORK - 0.6, T_WORK + 0.3, t) if working else 0.0, lean=(-0.25 * min(1.0, drift_x(y)), -0.30))
    kit.show(k.runner.root, working)
    k.true_line.set(grow=ss(T_WORK - 0.2, T_WORK + 2.2, t), glow=1.0 if t < T_SLIDE else 0.0)
    fixed = t >= T_LAND + 1.75                                                     # after the catch: the track is straight
    k.track.set(grow=0.0 if fixed else run, glow=1.0)
    k.straight.set(grow=1.0 if fixed else 0.0, glow=1.0 + 1.5 * hit(t, T_LAND + 1.75, 3.0))
    for i, d in enumerate(k.dots):                                                 # the prediction runs ahead of the candle
        u = ss(T_PREDICT - 0.2 + i * 0.045, T_PREDICT + i * 0.045, t)
        d.scale = (0.07 * u, 0.07 * u, 0.004)
        d.hide_render = u <= 0.0 or t > T_HEDGE or fixed

    # =============================================================== 4: questions slammed shut
    for i, ((root, hinge), q, dy) in enumerate(zip(k.doors, k.q, DOORS)):
        seen = ss(T_SETTLE - 2.2 + 0.1 * i, T_SETTLE - 1.6 + 0.1 * i, t)
        shut_at = T_SETTLE + 0.45 + i * 0.58
        again = T_LAND + 1.10 + i * 0.05
        shut = ss(shut_at, shut_at + 0.10, t) * (1.0 - ss(again, again + 0.12, t))
        hinge.rotation_euler = (0, 0, lerp(-1.75, 0.0, shut) - 0.25 * hit(t, again + 0.12, 7.0) * math.sin((t - again) * 30.0))
        root.scale = (1.0, 1.0, max(0.001, seen))
        kit.show(root, seen > 0.0 and t < T_MOST)
        s = (1.0 - shut) * seen * (1.0 + 0.5 * hit(t, again + 0.12, 5.0))
        q.scale = (max(0.001, s),) * 3
        q.hide_render = seen <= 0.0 or shut >= 1.0 or t > T_MOST

    # =============================================================== 5: the hedge
    hedging = T_HEDGE - 1.0 < t < T_SLIDE + 0.6 or T_LAND + 0.5 < t < T_LAND + 1.2
    passed = 0.0
    for i, p in enumerate(k.panes):
        drop_at = T_HEDGE + 0.35 + i * 0.52
        down = ss(drop_at, drop_at + 0.16, t)
        flat = ss(T_LAND + 0.62 + i * 0.04, T_LAND + 0.86 + i * 0.04, t)            # after the catch they fall flat
        p.location = (0.0, PANES[i] + 0.45 * flat, lerp(2.6, 0.475, down ** 2) * (1.0 - flat) + 0.02 * flat - 0.03 * hit(t, drop_at + 0.16, 9.0) * (1.0 - flat))
        p.rotation_euler = (-1.55 * flat, 0, 0)
        p.hide_render = not hedging or down <= 0.0
        passed += down * (1.0 - flat)
    through = 0.62 ** passed                                                       # each pane lets less through
    k.hedger.set(t, size=1.0 if hedging else 0.0, lean=(0.0, 0.25))
    kit.show(k.hedger.root, hedging)
    k.reach.set(t, size=(0.25 + 0.75 * through) if hedging else 0.0, lean=(0.0, -0.2), bright=0.15 + 0.85 * through)
    kit.show(k.reach.root, hedging)
    k.beam.set(grow=1.0 if hedging else 0.0, glow=through)

    # =============================================================== 6, 7: the compass, and the catch
    cx, cy = COMPASS
    on_compass = T_SLIDE - 1.2 < t < T_MOST + 1.0
    walk = ss(T_SLIDE + 0.4, T_SKILLED + 0.5, t)
    a_lamp = math.radians(-90.0 + 205.0 * walk)                                   # he walks round the rim
    caught = ss(T_LAND, T_LAND + 0.10, t)
    wob = hit(t, T_LAND, 3.4) * math.sin((t - T_LAND) * 24.0) * 0.5
    follow = ss(T_SLIDE + 1.2, T_SLIDE + 3.0, t)
    lag = a_lamp - 0.28 * math.sin(walk * math.pi)                                 # the needle trails him a little
    a_needle = lerp(lerp(MARK, lag, follow), MARK, caught) + wob
    k.needle.rotation_euler = (0, 0, a_needle)
    kit.show(k.needle, on_compass)
    hop = bounce(t, T_TAP, 0.22, T_LAND - T_TAP)
    sx, sy = cx + (CR + 0.25) * math.cos(a_lamp), cy + (CR + 0.25) * math.sin(a_lamp)
    k.steer.root.location = (sx, sy, hop)
    kit.squash(k.steer.root, (1.0 - 0.22 * ss(T_TAP - 0.22, T_TAP, t) * (1.0 - ss(T_TAP, T_TAP + 0.08, t))) * land(t, T_LAND, 0.30), turn=0.0)
    k.steer.set(t, size=(1.0 + 0.6 * hit(t, T_LAND, 5.0)) if on_compass else 0.0, lean=(0.2, 0.0), bright=1.0 + 1.2 * hit(t, T_LAND, 4.0))
    kit.show(k.steer.root, on_compass)
    gone = follow * (1.0 - caught)
    k.hub.set(t, size=(1.0 + 0.5 * hit(t, T_LAND, 3.0)) if on_compass else 0.0, lean=(0.30 * gone * math.cos(a_needle), 0.30 * gone * math.sin(a_needle)),
              tint=kit.HIS, mix=0.9 * gone, still=0.7 * gone)
    kit.show(k.hub.root, on_compass)
    kit.squash(k.hub.root, land(t, T_LAND + 0.05, 0.22), turn=0.0)
    r = 0.2 + 9.0 * max(0.0, t - T_LAND)
    k.ring.ob.location = (sx, sy, 0.01)
    k.ring.ob.scale = (r, r, 1.0)
    k.ring.set(grow=1.0 if T_LAND <= t < T_LAND + 0.7 else 0.0, glow=max(0.0, 1.0 - (t - T_LAND) / 0.7))

    # =============================================================== 8, 9: the land of pairs; the house
    for i, (c, l, d) in enumerate(k.pairs):
        u = round(ss(T_MOST - 0.4 + d * 0.05, T_MOST + d * 0.05, t), 3)
        if k.last.get(("p", i)) == u:
            continue
        k.last[("p", i)] = u
        for ob in (c, l):
            ob.scale = (max(0.001, u),) * 3
            ob.hide_render = u <= 0.0
    for li, d in k.pair_lights:
        li.data.energy = 20.0 * ss(T_MOST - 0.4 + d * 0.05, T_MOST + d * 0.05, t)
    us = t > T_MOST - 0.5
    k.us_c.set(t, size=1.0 if us else 0.0)
    k.us_l.set(t, size=1.0 if us else 0.0, lean=(0.26, 0.05))
    kit.show(k.us_c.root, us)
    kit.show(k.us_l.root, us)
    h = k.house
    h.show(t > T_BUILT - 0.1)
    up = ss(T_BUILT, T_BUILT + 0.5, t)
    spring = up + 0.22 * hit(t, T_BUILT + 0.5, 6.0) * math.sin((t - T_BUILT - 0.5) * 22.0)      # it lands, and settles
    h.root.scale = (1.0, 1.0, max(0.001, spring))
    for i, room in enumerate(("hall", "library", "desk", "bench_a", "bench_b", "bench_c")):
        h.lit(room, ss(T_BUILT + 0.75 + 0.22 * i, T_BUILT + 0.90 + 0.22 * i, t) * (1.0 + 0.6 * hit(t, T_BUILT + 0.90 + 0.22 * i, 5.0)))
    h.lit("small", ss(T_BUILT + 2.5, T_BUILT + 2.8, t) * (1.0 + 0.8 * hit(t, T_BUILT + 2.8, 4.0)), lerp(kit.WARM, kit.HIS, 0.55))
    h.lit("attic", 0.0)

    # =============================================================== the camera: one run down the plane, with looks back
    lx, ly = LAND0
    if t < T_WORK - 0.4:                                                           # 1, 2
        pos = kf(t, [(P0, (0.0, -0.20, 0.18)), (T_AI, (0.0, -0.42, 0.19)), (T_TRUE, (0.12, -0.74, 0.24)), (T_TRUE + 1.6, (0.0, -2.6, 1.9)), (T_WORK - 0.4, (0.0, -3.0, 2.5))])
        look = kf(t, [(P0, (0.0, 0.0, 0.16)), (T_TRUE, (0.0, 0.0, 0.16)), (T_TRUE + 1.6, (0.0, 4.0, 0.2)), (T_WORK - 0.4, (0.0, 5.0, 0.2))])
        lens = kf(t, [(P0, 60.0), (T_TRUE, 60.0), (T_TRUE + 1.6, 30.0)])
    elif t < T_SETTLE - 0.3:                                                       # 3: running with us
        back = kf(t, [(T_WORK - 0.4, 4.4), (T_DRIFT, 3.2), (T_PREDICT + 0.4, 4.6), (T_SETTLE - 0.3, 4.2)])
        high = kf(t, [(T_WORK - 0.4, 2.4), (T_DRIFT, 1.5), (T_PREDICT + 0.4, 3.0), (T_SETTLE - 0.3, 2.2)])
        pos, look, lens = (0.3, y - back, high), (-0.25, y + 1.6, 0.1), 32.0
    elif t < T_HEDGE - 0.25:                                                       # 4: the doors, low, travelling
        yy = kf(t, [(T_SETTLE - 0.3, DOORS[0] - 3.6), (T_HEDGE - 0.25, DOORS[-1] - 2.2)])
        slam = sum(hit(t, T_SETTLE + 0.55 + i * 0.58, 12.0) for i in range(5))
        pos, look, lens = (0.55 + 0.012 * slam * math.sin(t * 70.0), yy, 0.75 + 0.014 * slam * math.sin(t * 83.0)), (-1.3, yy + 3.6, 0.85), 30.0
    elif t < T_SLIDE - 0.3:                                                        # 5: the panes, from the side
        pos = kf(t, [(T_HEDGE - 0.25, (0.95, 29.6, 0.62)), (T_SLIDE - 0.3, (0.75, 29.9, 0.58))])
        look, lens = (0.0, 25.4, 0.22), 40.0
    elif t < T_LAND + 0.55:                                                        # 6, 7: over the compass
        shake = 0.03 * hit(t, T_LAND, 8.0)
        pos = kf(t, [(T_SLIDE - 0.3, (0.0, cy - 3.3, 2.6)), (T_SKILLED, (0.5, cy - 3.0, 2.3)), (T_ONE, (0.3, cy - 2.5, 1.7)), (T_LAND, (0.2, cy - 2.7, 1.9))])
        pos = (pos[0] + shake * math.sin(t * 61.0), pos[1], pos[2] + shake * math.sin(t * 77.0))
        look, lens = (cx, cy + 0.1, 0.05), 34.0
    elif t < T_LAND + 1.05:                                                        # ...the panes fall
        pos, look, lens = (0.8, 29.8, 0.6), (0.0, 25.4, 0.22), 40.0
    elif t < T_LAND + 1.70:                                                        # ...the doors fly open
        pos, look, lens = (0.55, DOORS[1] - 2.4, 0.75), (-1.3, DOORS[1] + 1.4, 0.85), 30.0
    elif t < T_LAND + 2.45:                                                        # ...the track is straight
        pos, look, lens = (0.3, 6.6, 3.0), (-0.3, 10.2, 0.0), 32.0
    elif t < T_MOST - 0.6:                                                         # back on the needle, holding
        pos = kf(t, [(T_LAND + 2.45, (0.2, cy - 2.2, 1.5)), (T_MOST - 0.6, (0.1, cy - 2.0, 1.35))])
        look, lens = (cx, cy + 0.2, 0.05), 34.0
    else:                                                                          # 8, 9
        pos = kf(t, [(T_MOST - 0.6, (lx, ly - 5.0, 3.0)), (T_MOST + 2.2, (lx, ly - 15.0, 11.0)), (T_STORY - 0.3, (lx, ly - 16.5, 12.0)),
                     (T_STORY + 2.4, (lx + 0.05, ly - 2.3, 0.42)), (P1, (lx + 0.05, ly - 2.6, 0.44))])
        look = kf(t, [(T_MOST - 0.6, (lx, ly, 0.2)), (T_MOST + 2.2, (lx, ly + 2.0, 0.0)), (T_STORY - 0.3, (lx, ly + 2.0, 0.0)),
                      (T_STORY + 2.4, (lx, ly + 2.6, 0.72)), (P1, (lx, ly + 2.6, 0.78))])
        lens = kf(t, [(T_MOST - 0.6, 32.0), (T_STORY - 0.3, 30.0), (T_STORY + 2.4, 31.0)])
    k.camera(pos, look, lens)
    k.sky(ss(T_TRUE, T_TRUE + 1.6, t))
    k.fade(ss(P0 + 0.2, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
