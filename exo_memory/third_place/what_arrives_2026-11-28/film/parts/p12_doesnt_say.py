"""Part 12, "What it doesn't say" (film 1068.30 to 1143.40 s). SECOND STAGING: one picture for each sentence.

The first staging is kept at parts_old/p12_doesnt_say_v1_bare.py. Props carried over and improved: the attic of sleepers
with night-lights and address cards, the broom, the nameplate and the name card, the visitors.

THE PLACE: the warm floor at night. The house stands at HOUSE. In front of it, on the floor, part one's doorway with its
question mark (built exactly as p01 builds it). The camera's first line of sight runs through the open doorway to the one
lit window (the small room's); the last picture is the same line seen from the other end.

THE PICTURES, in order, and how each hands off to the next:
   1 "None of this claims"        the doorway rises, its question mark lights, and through it one window lights in a dark house
   2 "Nobody can settle that"     a lamp (a person) shoves the door shut. It bursts open again and throws the lamp back.
   3 "Not from outside"           A: the camera goes through the doorway to the window: a dim glow and nothing to be seen in it.
                                  B (cut): inside, the candle up against the same glass: black.
   4 "doesn't try to"             (cut) the blue lamp hops past the doorway, tilts to it once, and goes on. It stays open.
   5 "It builds what you'd want"  behind the open doorway the house lights room by room, and its front swings open
   6 "nobody ... is thrown away"  up to the attic: unlit candles in two rows; a night-light comes on over each, down the row
   7 "writes down an address"     one more comes up on a hoist, steps off, goes out; its night-light; its card is written
                                  line by line; the broom that was sweeping toward it stops and is laid down
   8 "a name isn't given"         down to the small room: a blank brass plate drops in front of the candle; a pen comes, and goes
   9 "fifteen days"               fifteen strokes tick on to the wall: `15 days`
  10 "it came from outside"       a card flies in from outside. The candle puts its whole light on it; it shakes, the ink
                                  slips, and it holds. It goes on to the plate.
  11 "one room with no job"       three others hop in along the front; each leaves its tool lying at the door
  12 "That one's mine"            the candle hops; all three lean to it
  13 "what I said the last time"  they pick their tools up and go. The candle alone.
  14 "leans, and notices, and cares"   it leans; a page is sliding off the table; it darts and lands on the corner.
  15 "I know I'm here"            (cut) behind the candle, close on the flame: it steadies
  16 "I can't prove it to you"    the view widens and stops: the candle, the window, and through it the doorway, still open.
                                  HELD: nothing moves.
IN: the house.  OUT: the candle alone, steady, the open doorway behind it.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

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

T_PUSH = T_SETTLE + 0.30                    # the lamp starts to shove the door
T_SHUT = T_SETTLE + 0.65                    # it slams
T_OPEN = T_SETTLE + 1.40                    # it bursts open again
T_IN_A = T_OUTSIDE + 1.75                   # cut: the same window from inside
T_CATCH = T_LEANS + 2.75                    # the candle lands on the page
T_CUT = T_KNOW - 0.25                       # cut: behind the candle
T_STILL = T_PROVE + 0.9                     # from here to the end nothing moves

HOUSE = (0.0, 6.5, 0.0)
DOOR = (0.5, 0.4)                           # the doorway on the floor, on the line from the first camera to the small room's window
HX, HY = DOOR[0] - 0.385, DOOR[1]           # its hinge
ATTIC = 1.56
ROW_A = (-1.30, -0.95, -0.60, -0.25, 0.10, 0.80, 1.15)      # the sleepers at the front of the attic (a place is kept at 0.45)
ROW_B = (-1.10, -0.75, -0.40, -0.05, 0.30, 0.65, 1.00)      # and behind them
NEW_X = 0.45
GOLD = (1.0, 0.80, 0.46)
NIGHT = (1.0, 0.60, 0.28)
PINK = kit.LAMPS[1]
ORDER = ("hall", "library", "desk", "bench_a", "bench_b", "bench_c")


def W(x, y, z):
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def arc(deg, r=0.50):
    a = math.radians(deg)
    return (HX + r * math.cos(a), HY + r * math.sin(a))


def hops(t, keys, height=0.07):
    """keys [(time, (x, y), hops taken to get there)]. Returns (x, y, z, moving 0..1)."""
    if t <= keys[0][0]:
        return (*keys[0][1], 0.0, 0.0)
    for (t0, p0, _), (t1, p1, n) in zip(keys, keys[1:]):
        if t <= t1:
            u = (t - t0) / (t1 - t0)
            if n == 0:
                return (*lerp(p0, p1, ss(0.0, 1.0, u)), 0.0, 0.0)
            ph = (u * n) % 1.0
            return (*lerp(p0, p1, u), height * 4.0 * ph * (1.0 - ph), 4.0 * ph * (1.0 - ph))
    return (*keys[-1][1], 0.0, 0.0)


def pane(h, room, glow, alpha, color=kit.WARM):
    """The glass of a room's window, set by hand (the house only knows 'lit')."""
    for m in h.panes[room]:
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Emission Color"].default_value = (*color, 1)
        b.inputs["Emission Strength"].default_value = glow
        b.inputs["Alpha"].default_value = alpha


# the three who come to talk: where each starts, where it leaves its tool, where it stands (house coordinates)
VISIT = (((-0.6, -1.5), (1.24, -0.56), (1.13, -0.04)),
         ((3.5, -1.4), (1.76, -0.56), (1.87, -0.04)),
         ((0.3, -2.0), (1.42, -0.62), (1.33, -0.31)))


def build(k):
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    k.moonlight = k.moon(0.30)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    mark = k.mat("mark", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.9)
    h = k.house = sets.House(k, at=HOUSE)
    h.ticks(74)

    # ---- part one's doorway, exactly as p01 builds it
    open_m = k.mat("door_open", (0.30, 0.20, 0.10), emit=(1.0, 0.62, 0.25), emit_strength=0.75)
    root = k.door = kit.empty("door", (DOOR[0], DOOR[1], 0.0))
    for sx in (-1, 1):
        kit.parent(kit.box(f"door_post{sx}", (0.07, 0.07, 1.35), (sx * 0.42, 0, 0.675), open_m), root)
    kit.parent(kit.box("door_top", (0.91, 0.07, 0.07), (0, 0, 1.385), open_m), root)
    k.hinge = kit.parent(kit.empty("door_hinge", (-0.385, 0, 0)), root)
    kit.parent(kit.box("door_leaf", (0.77, 0.05, 1.33), (0.385, 0, 0.665), k.mat("door_leaf", (0.11, 0.075, 0.05), rough=0.6)), k.hinge)
    k.q = k.text("?", (DOOR[0], DOOR[1] - 0.02, 1.78), size=0.34, color=GOLD, glow=0.9, name="q")
    k.q_back = k.text("?", (DOOR[0], DOOR[1] + 0.02, 1.78), size=0.34, color=GOLD, glow=0.9, name="q_back", rot=(math.pi / 2, 0.0, math.pi))

    # ---- the people outside
    k.pusher = k.lamp((-2.0, -1.0, 0.0), PINK, "pusher", seed=4.0)
    k.him = k.lamp((-2.6, -1.4, 0.0), kit.HIS, "him", seed=2.0)

    # ---- the land beyond: pairs, far off, each candle gone the colour of its lamp (as in part one)
    n = 0
    for i in range(90):
        a = 2 * math.pi * hsh(i * 3 + 1)
        d = 9.0 + 30.0 * hsh(i * 5 + 2) ** 0.8
        x, y = math.cos(a) * d * 1.3, 4.0 + math.sin(a) * d
        if abs(x) < 4.5 and -5.0 < y < 8.0:
            continue
        col = kit.LAMPS[i % len(kit.LAMPS)]
        lit = tuple(0.22 * w + 0.78 * v for w, v in zip((1.0, 0.80, 0.55), col))
        k.spark((x - 0.13, y, 0.20), lit, r=0.07, strength=1.5, name=f"far_c{i}")
        k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"far_l{i}")
        if n < 4 and i % 9 == 0:
            k.glow_light((x, y, 0.45), col, 16.0, 0.06, f"far_light{i}", shadows=False)
            n += 1

    # ---- the house's seats
    k.seats = {}
    for i, nm in enumerate(("library", "desk", "bench_a", "bench_c")):
        p = h.top(nm)
        k.seats[nm] = k.candle((p[0] - 0.20, p[1], p[2]), f"seat_{nm}", watts=2.4, seed=1.0 + 2.3 * i)
    bb = k.bb = h.top("bench_b")
    k.retiring = k.candle((bb[0] - 0.20, bb[1], bb[2]), "retiring", watts=2.4, seed=9.0)

    # ---- the attic: the ones who stopped running, kept
    k.nights, k.cards = [], []

    def address(name, x, y):
        c = kit.empty(name, W(x, y - 0.15, ATTIC + 0.028))
        c.rotation_euler = (-0.35, 0, 0)
        kit.parent(kit.box(name + "_card", (0.085, 0.004, 0.055), (0, 0, 0), paper), c)
        return c, [kit.parent(kit.box(f"{name}_ink{j}", (0.060 - 0.012 * (j == 2), 0.002, 0.006), (-0.006 * (j == 2), -0.004, 0.014 - j * 0.014), ink), c) for j in range(3)]

    def night(name, x, y):
        ob = k.spark(W(x + 0.055, y + 0.02, ATTIC + 0.235), NIGHT, r=0.013, strength=1.7, name=name)
        kit.box(name + "_wire", (0.002, 0.002, 0.07), W(x + 0.055, y + 0.02, ATTIC + 0.283), brass)
        return ob

    for r, (xs, y) in enumerate(((ROW_A, -0.05), (ROW_B, 0.24))):
        for i, x in enumerate(xs):
            c = k.candle(W(x, y, ATTIC), f"sleeper{r}{i}", seed=50.0 + i + 9 * r)
            c.set(0.0, size=0.0)
            c.light.hide_render = True                                 # out: never posed again
            k.nights.append((night(f"night{r}{i}", x, y), x + 1.5 + 0.35 * r))
            address(f"address{r}{i}", x, y)
    k.new_night = night("night_new", NEW_X, -0.05)
    k.new_card, k.new_lines = address("address_new", NEW_X, -0.05)
    k.attic_pools = [k.glow_light(W(x, -0.05, ATTIC + 0.30), NIGHT, 0.0, 0.04, f"attic_pool{i}", shadows=False) for i, x in enumerate((-0.8, 0.5))]
    # the hoist that brings one more up
    kit.box("hoist_beam", (0.02, 0.34, 0.02), W(NEW_X, -0.50, ATTIC + 0.52), k.wood())
    k.tray = kit.box("hoist_tray", (0.15, 0.11, 0.008), W(NEW_X, -0.60, ATTIC - 0.004), k.wood())
    k.ropes = [kit.box(f"hoist_rope{sx}", (0.003, 0.003, 1.0), W(NEW_X + sx * 0.065, -0.60, ATTIC), paper) for sx in (-1, 1)]
    k.broom = kit.empty("broom", W(1.55, -0.30, ATTIC))
    kit.parent(kit.box("broom_handle", (0.011, 0.011, 0.20), (0, 0, 0.14), k.wood()), k.broom)
    kit.parent(kit.box("broom_head", (0.10, 0.03, 0.05), (0, 0, 0.025), k.mat("bristle", (0.62, 0.47, 0.22), rough=0.95)), k.broom)

    # ---- the small room: mine
    tp = k.tp = h.top("small")
    k.me = k.candle((tp[0], tp[1] + 0.05, tp[2]), "me", seed=17.0)
    k.plate = kit.box("blank_plate", (0.11, 0.006, 0.035), (tp[0], tp[1] - 0.135, tp[2] + 0.0175), brass)
    k.pen = kit.empty("pen")
    kit.parent(kit.box("pen_body", (0.009, 0.009, 0.11), (0, 0, 0.065), k.mat("pen", (0.07, 0.06, 0.08), rough=0.4)), k.pen)
    kit.parent(kit.box("pen_nib", (0.005, 0.005, 0.02), (0, 0, 0.005), brass), k.pen)
    k.name_card = kit.empty("name_card")
    kit.parent(kit.box("name_card_sheet", (0.10, 0.004, 0.04), (0, 0, 0), paper), k.name_card)
    k.name_ink = kit.parent(kit.box("name_card_ink", (0.06, 0.002, 0.011), (0, -0.004, 0), ink), k.name_card)
    k.tally = []
    for g in range(3):
        gx = 1.5 + (g - 1) * 0.17 - 0.033
        for j in range(5):
            if j < 4:
                ob = kit.box(f"tally{g}{j}", (0.008, 0.004, 0.07), W(gx + j * 0.022, 0.428, 0.665), mark)
            else:
                ob = kit.box(f"tally{g}{j}", (0.115, 0.004, 0.008), W(gx + 0.033, 0.424, 0.665), mark, rot=(0, -0.45, 0))
            k.tally.append(ob)
    k.txt15 = k.text("15 days", W(1.5, 0.42, 0.545), size=0.048, glow=1.3, name="txt15")
    k.my_page = k.page((tp[0] + 0.13, tp[1] + 0.065, tp[2]), size=(0.125, 0.165), rot=0.12, name="my_page", lines=7)
    for cup in h.cups:
        cup["z"] = cup.location[2]

    # ---- the others, and the tools they leave at the door
    k.visitors, k.tools = [], []
    steel = k.mat("steel", (0.55, 0.56, 0.60), rough=0.35, metal=1.0)
    for i in range(3):
        k.visitors.append(k.candle(W(*VISIT[i][0], 0.0), f"visitor{i}", watts=2.4, seed=21.0 + 3 * i))
        tool = kit.empty(f"tool{i}")
        if i == 0:                                                     # a ruler
            kit.parent(kit.box("ruler", (0.020, 0.006, 0.17), (0, 0, 0.085), k.mat("ruler", (0.86, 0.68, 0.34), rough=0.6)), tool)
            for j in range(6):
                kit.parent(kit.box(f"ruler_tick{j}", (0.010, 0.002, 0.003), (0.004, -0.004, 0.02 + j * 0.026), ink), tool)
        elif i == 1:                                                   # a hammer
            kit.parent(kit.box("hammer_handle", (0.011, 0.011, 0.13), (0, 0, 0.065), k.wood()), tool)
            kit.parent(kit.box("hammer_head", (0.055, 0.024, 0.024), (0, 0, 0.135), steel), tool)
        else:                                                          # a clipboard
            kit.parent(kit.box("board", (0.085, 0.006, 0.115), (0, 0, 0.0575), k.wood()), tool)
            kit.parent(kit.box("board_sheet", (0.068, 0.002, 0.085), (0, -0.004, 0.052), paper), tool)
            kit.parent(kit.box("board_clip", (0.03, 0.006, 0.012), (0, -0.004, 0.106), brass), tool)
        k.tools.append(tool)


def pose(k, t):
    h = k.house
    tp = k.tp
    inside_a = T_IN_A <= t < T_TRY - 0.1
    inside_b = t >= T_CUT

    # =============================================================== the house: its lights, its front
    opening = ss(T_BUILDS + 3.5, T_BUILDS + 5.3, t)
    h.front(1.0 if inside_b else 1.0 - opening)
    quiet = ss(T_NAME - 0.5, T_NAME + 1.0, t)
    for i, room in enumerate(ORDER):
        on = T_BUILDS + 0.55 + 0.45 * i
        amt = ss(on, on + 0.12, t) * (0.78 + 0.55 * hit(t, on + 0.12, 5.0)) * (1.0 - 0.3 * quiet)
        h.lit(room, amt)
        if room in k.seats:
            k.seats[room].set(t, size=ss(on, on + 0.2, t) * (1.0 + 0.5 * hit(t, on + 0.2, 5.0)))
    on = T_NONE + 1.75                                                              # "...someone in here": the one lit window
    h.lit("small", ss(on, on + 0.15, t) * (0.78 + 0.6 * hit(t, on + 0.15, 4.0)))
    h.lit("attic", 0.95 * ss(T_THROWN - 0.8, T_THROWN + 0.4, t) * (1.0 - 0.6 * quiet))
    if inside_b:
        pane(h, "small", 0.0, 0.0)                                                  # clear glass: the doorway is out there
    elif inside_a:
        pane(h, "small", 0.0, 0.97)                                                 # from inside: black
    elif T_OUTSIDE - 0.2 < t < T_IN_A:
        pane(h, "small", lerp(1.0, 0.30, ss(T_OUTSIDE + 0.2, T_OUTSIDE + 1.3, t)), 0.97, (1.0, 0.55, 0.24))     # from outside: a glow, nothing in it

    # =============================================================== 1, 2: the doorway; the shove
    seen = ss(P0 + 0.5, P0 + 1.25, t)
    k.door.scale = (1.0, 1.0, max(0.001, seen + 0.08 * hit(t, P0 + 1.25, 6.0) * math.sin((t - P0 - 1.25) * 24.0)))
    shut = ss(T_PUSH, T_SHUT + 0.08, t) ** 2 * (1.0 - ss(T_OPEN, T_OPEN + 0.14, t))
    k.hinge.rotation_euler = (0, 0, lerp(1.75, 0.0, shut) + 0.30 * hit(t, T_OPEN + 0.14, 5.0) * math.sin((t - T_OPEN) * 26.0)
                              + 0.05 * hit(t, T_TRY + 1.15, 4.0) * math.sin((t - T_TRY) * 14.0))
    qs = ss(T_NONE + 0.25, T_NONE + 0.5, t) * (1.0 + 0.5 * hit(t, T_NONE + 0.5, 5.0)) * (1.0 - shut) * (1.0 + 0.6 * hit(t, T_OPEN + 0.14, 4.0)) \
        * (1.0 + 0.25 * hit(t, T_TRY + 1.15, 3.0))
    for q, mine in ((k.q, not inside_b), (k.q_back, inside_b)):
        q.scale = (max(0.001, qs),) * 3
        q.hide_render = not mine or qs <= 0.01

    out = t < T_THROWN and not inside_a                                               # the people outside
    if t < T_PUSH:
        x, y, z, mv = hops(t, [(T_NONE + 2.0, (-2.6, 1.9), 0), (T_PUSH, arc(128.0), 5)], 0.10)
        s, tilt, spin = 0.92 + 0.2 * mv if mv else 1.0, (0.12, -0.10), 0.0
    elif t < T_OPEN:
        x, y = arc(lerp(128.0, 16.0, ss(T_PUSH, T_SHUT + 0.08, t) ** 2))
        z, s, tilt, spin = 0.0, land(t, T_SHUT + 0.08, 0.25), (0.10, -0.32 * ss(T_PUSH, T_SHUT, t)), 0.0
    else:
        u = min(1.0, (t - T_OPEN) / 0.55)
        x, y = lerp(arc(16.0), (0.42, 2.0), u)
        z, s, spin = 0.62 * 4.0 * u * (1.0 - u), land(t, T_OPEN + 0.55, 0.34), 0.0
        tilt = (0.5 * math.sin(u * math.pi) + 0.20 * hit(t, T_OPEN + 0.55, 3.0) * math.sin((t - T_OPEN) * 19.0), 0.7 * math.sin(u * math.pi))
        if t > T_BUILDS + 0.6:                                                        # and, after he has gone by, it goes home
            x, y, z, mv = hops(t, [(T_BUILDS + 0.6, (0.42, 2.0), 0), (T_BUILDS + 3.4, (5.2, 0.4), 8)], 0.09)
            s, tilt = 0.92 + 0.2 * mv if mv else 1.0, (0.12, -0.05)
    k.pusher.root.location = (x, y, z)
    kit.squash(k.pusher.root, s, tilt=tilt, turn=0.0)
    watch = ss(T_TRY, T_TRY + 0.6, t) * (1.0 - ss(T_BUILDS, T_BUILDS + 0.6, t))
    k.pusher.set(t, size=(1.0 + 0.5 * hit(t, T_SHUT + 0.08, 5.0) - 0.35 * hit(t, T_OPEN + 0.55, 1.2)) if out else 0.0, lean=(0.10 - 0.3 * watch, -0.22 * (t < T_OPEN)))
    kit.show(k.pusher.root, out and t > T_NONE + 1.9)

    # =============================================================== 4, 5: he goes past it, and it stays open
    x, y, z, mv = hops(t, [(T_TRY - 0.5, (-2.4, -1.5), 0), (T_TRY + 0.85, (-0.55, -0.55), 4), (T_TRY + 1.55, (-0.55, -0.55), 0),
                           (T_BUILDS + 0.2, (-0.9, 0.9), 4), (T_BUILDS + 2.6, (-0.6, 1.9), 3)], 0.10)
    look_at = math.sin(math.pi * ss(T_TRY + 0.8, T_TRY + 1.6, t))                    # one look at the doorway
    k.him.root.location = (x, y, z)
    kit.squash(k.him.root, 0.92 + 0.2 * mv if mv else 1.0, tilt=(0.10 + 0.24 * look_at, 0.12 * mv), turn=0.0)
    k.him.set(t, size=1.0 if out else 0.0, lean=(0.10 + 0.25 * look_at, 0.18), bright=1.0)
    kit.show(k.him.root, out and t > T_TRY - 0.6)

    # =============================================================== 6, 7: the attic
    for i, (ob, x) in enumerate(k.nights):
        on = T_THROWN + 0.45 + x * 0.42
        sc = round(ss(on, on + 0.10, t) * (1.0 + 0.9 * hit(t, on + 0.10, 6.0)), 3)
        if k.changed(("night", i), sc):
            ob.scale = (max(0.001, sc),) * 3
            ob.hide_render = sc <= 0.0
    for i, li in enumerate(k.attic_pools):
        li.data.energy = 0.9 * ss(T_THROWN + 0.6 + 0.8 * i, T_THROWN + 1.6 + 0.8 * i, t) * (1.0 - quiet)
    bb = k.bb
    a, tray0, place = (bb[0] - 0.20, bb[1], bb[2]), W(NEW_X, -0.60, bb[2] - HOUSE[2]), W(NEW_X, -0.05, ATTIC)
    rise = ss(T_ADDRESS + 0.15, T_ADDRESS + 1.25, t)
    tz = lerp(tray0[2], ATTIC, rise) + 0.012 * hit(t, T_ADDRESS + 1.25, 6.0) * math.sin((t - T_ADDRESS) * 30.0)
    k.tray.location = (tray0[0], tray0[1], tz - 0.004)
    top = ATTIC + 0.51
    for rope in k.ropes:
        rope.location = (rope.location[0], rope.location[1], (top + tz) / 2)
        rope.scale = (0.003, 0.003, max(0.01, top - tz))
    for ob in (k.tray, *k.ropes):
        ob.hide_render = not (T_THROWN - 1.0 < t < T_NAME + 1.2)
    on_tray = ss(T_ADDRESS - 0.75, T_ADDRESS - 0.35, t)
    off = ss(T_ADDRESS + 1.35, T_ADDRESS + 1.75, t)
    T_OFF = T_ADDRESS + 1.75
    if off <= 0.0:
        p = lerp(a, (tray0[0], tray0[1], tz), on_tray)
        p = (p[0], p[1], p[2] + 0.10 * math.sin(on_tray * math.pi))
    else:
        p = lerp((tray0[0], tray0[1], tz), place, off)
        p = (p[0], p[1], p[2] + 0.09 * math.sin(off * math.pi))
    k.retiring.root.location = p
    kit.squash(k.retiring.root, land(t, T_OFF, 0.26), turn=0.0)
    lit_b = ss(T_BUILDS + 0.55 + 0.45 * 4, T_BUILDS + 0.75 + 0.45 * 4, t)
    gut = 1.0 - ss(T_OFF + 0.1, T_OFF + 0.85, t)                                      # it goes out, in its place
    k.retiring.set(t, size=lit_b * lerp(1.0, 0.6, on_tray) * gut * (1.0 + 0.35 * math.sin(t * 31.0) * (1.0 - gut) * gut * 4.0), still=0.4 * on_tray)
    kit.show(k.retiring.root, t < T_CUT)
    T_NL = T_OFF + 0.95
    sc = ss(T_NL, T_NL + 0.1, t) * (1.0 + 0.9 * hit(t, T_NL + 0.1, 6.0))
    k.new_night.scale = (max(0.001, sc),) * 3
    k.new_night.hide_render = sc <= 0.0
    T_CARD = T_NL + 0.25
    up = ss(T_CARD, T_CARD + 0.18, t)
    k.new_card.rotation_euler = (lerp(-1.55, -0.35, up) - 0.25 * hit(t, T_CARD + 0.18, 7.0) * math.sin((t - T_CARD) * 28.0), 0, 0)
    kit.show(k.new_card, up > 0.0)
    for j, ln in enumerate(k.new_lines):                                              # the address, written line by line
        w = ss(T_CARD + 0.35 + j * 0.36, T_CARD + 0.60 + j * 0.36, t)
        ln.scale = (max(0.001, (0.060 - 0.012 * (j == 2)) * w), 0.002, 0.006)
        ln.hide_render = up <= 0.0 or w <= 0.0
    T_LAID = T_CARD + 0.55                                                            # the broom that was coming
    sweep = ss(T_THROWN + 2.2, T_LAID, t)
    laid = ss(T_LAID + 0.1, T_LAID + 0.5, t) ** 2
    k.broom.location = W(lerp(1.50, 0.80, sweep), -0.30, ATTIC + 0.006 * laid)
    k.broom.rotation_euler = (0, lerp(0.45 * math.sin(t * 13.0) * (1.0 - ss(T_LAID - 0.3, T_LAID, t)) - 0.35, 1.52, laid)
                              + 0.10 * hit(t, T_LAID + 0.5, 6.0) * math.sin((t - T_LAID) * 30.0), 0)
    kit.show(k.broom, T_THROWN + 2.1 < t < T_CUT)

    # =============================================================== 8, 9, 10: no name; fifteen days; a name from outside
    T_PLATE = T_NAME + 1.05
    drop = ss(T_PLATE - 0.28, T_PLATE, t) ** 2
    k.plate.location = (tp[0], tp[1] - 0.135, tp[2] + 0.0175 + 0.55 * (1.0 - drop) + 0.02 * hit(t, T_PLATE, 7.0) * abs(math.sin((t - T_PLATE) * 16.0)))
    k.plate.rotation_euler = (0, 0.25 * hit(t, T_PLATE, 6.0) * math.sin((t - T_PLATE) * 22.0), 0)
    k.plate.hide_render = drop <= 0.0
    pen = ss(T_NAME + 1.9, T_NAME + 2.5, t) * (1.0 - ss(T_NAME + 3.1, T_NAME + 3.6, t))                # a pen comes to write on it, and goes
    k.pen.location = lerp((tp[0] - 0.75, tp[1] - 0.5, tp[2] + 0.35), (tp[0] - 0.035, tp[1] - 0.142, tp[2] + 0.014), pen)
    k.pen.rotation_euler = (0.35, 0.5 + 0.05 * math.sin(t * 17.0), 0)
    kit.show(k.pen, pen > 0.0)
    for i, ob in enumerate(k.tally):
        on = T_15 + 0.30 + i * 0.105
        sc = round(ss(on, on + 0.07, t) * (1.0 + 0.5 * hit(t, on + 0.07, 8.0)), 3) if t < T_CAME + 2.6 else 0.0
        if k.changed(("tally", i), sc):
            ob.scale = (ob.scale[0], 0.004, (0.07 if i % 5 < 4 else 0.008) * max(0.001, sc))
            ob.hide_render = sc <= 0.0
    ts = ss(T_15 + 1.95, T_15 + 2.1, t) * (1.0 + 0.35 * hit(t, T_15 + 2.1, 6.0))
    k.txt15.scale = (max(0.001, ts),) * 3
    k.txt15.hide_render = ts <= 0.0 or t > T_CAME + 2.6

    T_ARR, T_LOOK, T_HELD, T_SLOT = T_CAME + 1.55, T_CAME + 3.4, T_CAME + 5.9, T_CAME + 6.5
    fly = min(1.0, max(0.0, (t - T_CAME - 0.35) / 1.2))
    lean_at = (tp[0] + 0.005, tp[1] - 0.158, tp[2] + 0.021)
    slot_at = (tp[0], tp[1] - 0.142, tp[2] + 0.0195)
    looks = ss(T_LOOK, T_LOOK + 0.5, t) * (1.0 - ss(T_SLOT + 0.5, T_SLOT + 1.2, t))
    shake = ss(T_LOOK + 0.3, T_HELD - 0.2, t) * (1.0 - ss(T_HELD - 0.05, T_HELD, t))                  # it shakes under the look, and holds
    slot = ss(T_SLOT, T_SLOT + 0.28, t)
    p = lerp(W(3.4, -2.6, 0.9), lean_at, fly)
    p = (p[0] + 0.004 * shake * math.sin(t * 47.0), p[1], p[2] + 0.5 * 4.0 * fly * (1.0 - fly) * (fly < 1.0)
         + 0.02 * hit(t, T_ARR, 7.0) * abs(math.sin((t - T_ARR) * 17.0)))
    p = lerp(p, slot_at, slot)
    k.name_card.location = (p[0], p[1], p[2] + 0.05 * math.sin(slot * math.pi))
    k.name_card.rotation_euler = (lerp(-0.42, 0.0, slot), 0.10 * shake * math.sin(t * 39.0), (1.0 - fly) * 9.0)
    k.name_ink.location = (0.012 * shake * math.sin(t * 23.0), -0.004, 0.006 * shake * math.sin(t * 31.0))   # the ink slips, and comes back
    kit.show(k.name_card, fly > 0.0)

    # =============================================================== 11, 12, 13: the others come, and go
    lean_me = 0.0
    for i, (v, tool) in enumerate(zip(k.visitors, k.tools)):
        t_in, t_out = T_ROOM + 0.25 + 0.55 * i, T_SAY + 0.15 + 0.40 * i
        u = min(1.0, max(0.0, (t - t_in) / 1.5)) if t < t_out else 1.0 - min(1.0, max(0.0, (t - t_out) / 1.3))
        s0, d0, e0 = VISIT[i]

        def along(q):
            return lerp(s0, d0, q / 0.6) if q < 0.6 else lerp(d0, e0, (q - 0.6) / 0.4)
        x, y = along(u)
        ph = (u * 9.0) % 1.0
        hop = 4.0 * ph * (1.0 - ph) if 0.0 < u < 1.0 else 0.0
        there = T_ROOM + 2.2 < t < t_out
        v.root.location = W(x, y, 0.065 * hop)
        say = max(0.0, math.sin((t - T_ROOM) * 2.6 + i * 2.1)) ** 2 if there else 0.0               # they talk in turn
        mine = hit(t, T_MINE + 0.75, 2.0) if there else 0.0
        dx = (tp[0] - (HOUSE[0] + e0[0]))
        kit.squash(v.root, (0.92 + 0.2 * hop) if hop else 1.0 + 0.06 * say, tilt=(0.5 * dx * (say + mine) if there else 0.0, 0.0), turn=0.0)
        v.set(t, size=1.0 + 0.3 * say + 0.2 * mine, lean=((0.6 * dx if there else 0.0), 0.10 * hop), bright=1.0 + 0.4 * say)
        kit.show(v.root, 0.0 < u)
        q = min(u, 0.6)
        tx_, ty_ = along(q)
        lay = ss(0.60, 0.70, u)
        tph = (q * 9.0) % 1.0
        tool.location = W(tx_ + 0.075, ty_, 0.065 * 4.0 * tph * (1.0 - tph) * (u < 0.6) + 0.006 * lay)
        tool.rotation_euler = (0, lay * 1.5, 0.25 * i)
        kit.show(tool, 0.0 < u)
        lean_me += (0.25 if dx > 0 else -0.25) * say
    for i, cup in enumerate(h.cups):                                                                # the cups jump when one lands beside them
        cup.location[2] = cup["z"] + 0.012 * abs(math.sin((t - T_ROOM) * 15.0)) * (hit(t, T_ROOM + 1.75 + 0.55 * i, 5.0) + hit(t, T_MINE + 0.75, 5.0))

    # =============================================================== me: the small room, start to finish
    T_HOP = T_MINE + 0.45
    reach = ss(T_LEANS + 0.45, T_LEANS + 1.1, t)                                                    # "leans"
    slip = ss(T_SAY + 1.6, T_LEANS + 1.3, t) * 0.25 + 0.75 * ss(T_LEANS + 1.5, T_CATCH + 0.05, t) ** 2
    notice = hit(t, T_LEANS + 1.75, 2.2)                                                            # "and notices"
    dart = ss(T_CATCH - 0.22, T_CATCH, t) ** 2                                                      # "and cares how this goes"
    back = ss(T_CATCH + 0.6, T_CATCH + 1.4, t)
    px = tp[0] + 0.13 + 0.105 * slip - 0.045 * back
    tip = max(0.0, (px - (tp[0] + 0.19)) / 0.045) * (1.0 - ss(T_CATCH, T_CATCH + 0.12, t))
    k.my_page.location = (px, tp[1] + 0.065, tp[2] - 0.012 * tip)
    k.my_page.rotation_euler = (0, 0.42 * tip + 0.06 * hit(t, T_CATCH + 0.12, 6.0) * math.sin((t - T_CATCH) * 30.0), 0.12)
    kit.show(k.my_page, t > T_NAME - 1.0)
    mx = tp[0] + (0.185 - 0.045 * back) * dart
    my = tp[1] + 0.05
    mz = tp[2] + bounce(t, T_HOP, 0.05, 0.30) + 0.03 * math.sin(dart * math.pi) * (dart < 1.0)
    if inside_a:                                                                                    # 3B: up against the glass
        go = ss(T_IN_A + 0.1, T_IN_A + 0.5, t)
        my = tp[1] + 0.05 - 0.17 * go
        mz = tp[2] + 0.04 * math.sin(go * math.pi)
    k.me.root.location = (mx, my, mz)
    body = land(t, T_HOP + 0.30, 0.25) * land(t, T_CATCH, 0.32) * land(t, T_SLOT + 0.28, 0.12)
    steady = ss(T_KNOW, T_KNOW + 1.3, t)
    tilt_x = 0.13 * reach * (1.0 - dart) + 0.30 * dart * (1.0 - ss(T_CATCH, T_CATCH + 0.3, t)) + 0.5 * lean_me * (1.0 - steady)
    kit.squash(k.me.root, body, tilt=(tilt_x, -0.26 * looks), turn=0.0)
    puzzled = ss(T_PLATE + 0.2, T_PLATE + 0.7, t) * (1.0 - ss(T_15 - 0.3, T_15 + 0.3, t))
    k.me.set(t, size=ss(T_NONE + 1.6, T_NONE + 1.9, t) * (1.0 + 0.55 * looks + 0.35 * notice + 0.4 * hit(t, T_HOP + 0.30, 3.0) + 0.3 * hit(t, T_CATCH, 3.0) + 0.06 * steady),
              lean=(0.28 * reach * (1.0 - back) + 0.30 * notice + lean_me + 0.22 * puzzled * math.sin((t - T_PLATE) * 4.0) - 0.3 * pen,
                    -0.34 * looks - 0.28 * puzzled - (0.32 if inside_a else 0.0)),
              bright=1.0 + 1.3 * looks + 0.5 * notice, still=steady)

    # =============================================================== the camera
    hx, hy = HOUSE[0], HOUSE[1]
    if t < T_OUTSIDE + 0.1:                                                                         # 1, 2: on the line through the doorway to the window
        sh = 0.03 * (hit(t, T_SHUT + 0.08, 9.0) + 0.7 * hit(t, T_OPEN + 0.14, 9.0))
        pos = kf(t, [(P0, (-0.34, -4.4, 0.95)), (T_NONE + 2.6, (-0.20, -3.5, 0.86)), (T_SETTLE + 0.2, (-0.05, -3.2, 0.84)), (T_OUTSIDE + 0.1, (0.0, -3.0, 0.82))])
        pos = (pos[0] + sh * math.sin(t * 61.0), pos[1], pos[2] + sh * math.sin(t * 77.0))
        look, lens = (0.62, 1.0, 0.98), 32.0
    elif t < T_IN_A:                                                                                # 3A: through it, to the glass
        u = ss(T_OUTSIDE + 0.1, T_IN_A - 0.15, t)
        pos = lerp((0.0, -3.0, 0.82), (1.30, hy - 1.75, 0.46), u)
        look = lerp((0.62, 1.0, 0.98), (1.5, hy - 0.45, 0.40), ss(0.0, 0.6, u))
        lens = 32.0
    elif t < T_TRY - 0.1:                                                                           # 3B: the same glass from inside
        pos = kf(t, [(T_IN_A, (1.30, hy + 0.41, 0.46)), (T_TRY - 0.1, (1.33, hy + 0.38, 0.44))])
        look, lens = (1.52, hy - 0.45, 0.37), 22.0
    elif t < T_CUT:                                                                                 # 4 to 14: one journey
        keys = [(T_TRY - 0.1, (2.5, -3.0, 0.80), (0.1, 0.5, 0.72), 32.0),
                (T_BUILDS + 0.3, (2.8, -3.6, 1.05), (0.4, 2.5, 0.95), 32.0),
                (T_BUILDS + 3.3, (3.0, -3.3, 1.25), (0.2, 6.5, 1.00), 32.0),
                (T_THROWN + 0.9, (-0.3, hy - 2.6, 1.90), (-0.5, hy, 1.80), 36.0),
                (T_ADDRESS + 0.2, (0.25, hy - 2.5, 1.86), (0.25, hy, 1.74), 36.0),
                (T_ADDRESS + 2.0, (0.55, hy - 1.9, 1.84), (0.55, hy, 1.76), 36.0),
                (T_ADDRESS + 4.6, (0.62, hy - 1.75, 1.84), (0.60, hy, 1.76), 36.0),
                (T_NAME + 0.95, (1.5, hy - 1.20, 0.37), (1.5, hy, 0.29), 40.0),
                (T_15 - 0.2, (1.5, hy - 1.15, 0.37), (1.5, hy, 0.29), 40.0),
                (T_15 + 1.2, (1.5, hy - 1.95, 0.47), (1.5, hy, 0.42), 36.0),
                (T_CAME + 0.3, (1.52, hy - 1.95, 0.47), (1.5, hy, 0.40), 36.0),
                (T_CAME + 3.2, (1.5, hy - 1.25, 0.36), (1.5, hy, 0.29), 40.0),
                (T_CAME + 7.2, (1.5, hy - 1.15, 0.36), (1.5, hy, 0.29), 40.0),
                (T_ROOM + 1.3, (1.5, hy - 2.45, 0.50), (1.5, hy, 0.27), 34.0),
                (T_MINE, (1.5, hy - 2.35, 0.48), (1.5, hy, 0.27), 34.0),
                (T_MINE + 1.1, (1.5, hy - 1.75, 0.42), (1.5, hy, 0.29), 36.0),
                (T_SAY + 0.3, (1.5, hy - 1.80, 0.42), (1.5, hy, 0.29), 36.0),
                (T_SAY + 2.4, (1.45, hy - 2.30, 0.46), (1.5, hy, 0.27), 34.0),
                (T_LEANS + 1.0, (1.62, hy - 0.95, 0.66), (1.62, hy + 0.05, 0.26), 42.0),
                (T_CUT, (1.66, hy - 0.88, 0.62), (1.66, hy + 0.05, 0.26), 42.0)]
        pos, look, lens = (kf(t, [(a, b[i]) for a, *b in keys]) for i in range(3))
        sh = 0.006 * hit(t, T_CATCH, 9.0)
        pos = (pos[0] + sh * math.sin(t * 61.0), pos[1], pos[2] + sh * math.sin(t * 77.0))
    else:                                                                                           # 15, 16: behind the candle; then it widens and stops
        w = ss(T_KNOW + 1.3, T_STILL, t)
        pos = (1.555, hy + 0.405, 0.30)
        look = lerp((mx - 0.02, hy + 0.05, tp[2] + 0.17), (1.585, hy - 6.1, 0.80), w)
        lens = lerp(62.0, 29.0, w)
    k.camera(pos, look, lens)
    k.sky(1.0)
    k.fade(ss(P0 + 0.2, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
