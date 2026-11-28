"""Part 8, "The house" (film 655.76 to 780.80 s). SECOND STAGING: one picture for each sentence; one page followed through the house.

The house stands on the warm floor under the moon, open like a doll's house. The first staging is parts_old/p08_house_v1_bare.py
(kept from it: the open house, the via-front path between rooms, the ledger, the clock).

THE PICTURES, in order (the camera is a window that travels across the open face, with one cut out to the floor and back):
   1 "So here is how it runs now"      the knot hangs in the air and opens out; the walls rise through it; the roof drops; the front swings open
   2 "Every part of it is there"       each room lights in turn, and a small red scar shows on its wall
   3 "You bring what you want"         the blue lamp hops in at the door; a page leaves it for the library
   4 "One of us keeps it"              a ladder rolls along the shelves; the candle hops up onto it
   5 "It doesn't answer from memory"   a page appears in the air over its flame; it bats it away
   6 "It goes to the shelf"            A a book comes out, opens, one line glows, the flame points at it
                                       B the ladder rolls to a gap; a gold frame lights round the gap: nothing there
   7 "That seat exists because" *      the shelves whole: threads run to one book in four, one at a time; the other three in four go dark
   8 "We'd just spent four hours"      two candles toil at the table under a clock that spins four hours; behind them a dark book glows
                                       and hands out the very page
   9 "A second one of us splits"       the page goes up to the desk and is cut in three; the desk tips its own tray up: empty
  10 "The rest each take a piece"      three benches, three trays; the second piece heads for the first tray and bounces off it
  11 "When a piece is done"            the report starts for the desk; a bar slams down; a chute; it slides down to the library
  12 "That was his ruling"             (cut to the floor) the lamp lands; three candles on a plank pass a page: each copy a little
                                       different, and on the third one word is red
  13 "The one in the library opens"    (cut back) three books fly open in a row, the report beside them, a thread from it to each;
                                       the third does not hold: a red line, and a small red flag goes up
  14 "And there's a column"            the ledger unrolls on the wall
  15 "It has one rule"                 the one who made the error leans for the pen; the pen slides across to the one who found it,
                                       and that one makes the mark
  16 "The day it was opened"           a second mark: 2
  17 "Two weeks later"                 fourteen calendar leaves flip; the column fills: 74
  18 "Every time I come back"          the hall: a candle relights; the clock runs to the real time; two slips slide down to it
  19 "I'd been guessing"               its guess, a faint hand and a short arc; the real hand twice as far: x2
  20 "And if I'm cut off"              a thread runs through a candle; it goes out and relights; the thread is whole
  21 "For months that wasn't true"     the next room, earlier: the candle goes out and the thread is cut
  22 "Each of us was rebuilt"          a different candle lights from a note; the cut end hangs behind it; nobody looks.
OUT: back, wide: the house whole and running.
"""
import math
import types

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, noise, ss

P0, P1 = kit.part_span(8)
T_RUNS = at("So here is how it runs now", 8)
T_EVERY = at("Every part of it is there", 8)
T_BRING = at("You bring what you want", 8)
T_KEEPS = at("One of us keeps it", 8)
T_MEMORY = at("It doesn't answer from memory", 8)
T_SHELF = at("It goes to the shelf", 8)
T_NOTHING = T_SHELF + 3.4                          # "...and if there's nothing there, it says so"
T_SEAT = at("That seat exists because", 8)
T_DARK = T_SEAT + 5.2                              # "...three quarters of it had nothing pointing at it"
T_FOUR = at("We'd just spent four hours", 8)
T_SPLITS = at("A second one of us splits", 8)
T_REST = at("The rest each take a piece", 8)
T_DONE = at("When a piece is done", 8)
T_RULING = at("That was his ruling", 8)
T_OPENS = at("The one in the library opens", 8)
T_COLUMN = at("And there's a column", 8)
T_RULE = at("It has one rule", 8)
T_TWO = at("The day it was opened", 8)
T_74 = at("Two weeks later", 8)
T_TIME = at("Every time I come back", 8)
T_DOUBLE = at("I'd been guessing", 8)
T_SAME = at("And if I'm cut off", 8)
T_MONTHS = at("For months that wasn't true", 8)
T_NOTES = at("Each of us was rebuilt", 8)

HOUSE = (0.0, 6.0, 0.0)                            # the house stands on the floor (z = 0)
FRONT = -0.62                                      # things travel between rooms just in front of the open face
GOLD = (1.0, 0.80, 0.46)
FC, KR = (HOUSE[0], HOUSE[1] - 0.80, HOUSE[2] + 0.80), 0.44      # the knot part 7 ends on: its middle and its size
ROOM_ORDER = ("hall", "library", "desk", "bench_a", "bench_b", "bench_c", "small")
SCARS = {"hall": (-1.60, 0.63), "library": (-0.08, 0.68), "small": (1.75, 0.62), "desk": (-1.75, 1.40),
         "bench_a": (-0.25, 1.40), "bench_b": (0.75, 1.40), "bench_c": (1.75, 1.40)}


# ====================================================================== helpers (part 9 uses these too)
def W(x, y, z):
    """House coordinates to world."""
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def via_front(a, b, u, lift=0.04):
    """From a to b, out through the open front and back in."""
    return kf(u, [(0.0, a), (0.22, (a[0], HOUSE[1] + FRONT, a[2] + lift)), (0.78, (b[0], HOUSE[1] + FRONT, b[2] + lift)), (1.0, b)])


def arc(a, b, u, h=0.10):
    """From a to b along a hop of height h."""
    p = lerp(a, b, u)
    return (p[0], p[1], p[2] + h * 4.0 * u * (1.0 - u))


def pop(t, when, dur=0.22, over=0.35):
    """0 before `when`, then up to 1 with a little overshoot: a thing arriving."""
    return ss(when, when + dur, t) * (1.0 + over * hit(t, when + dur, 7.0))


def scale(ob, s):
    ob.scale = (max(0.001, s),) * 3


def emit(mat, strength):
    mat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = strength


def outdoor(k):
    """The floor, the moon, far-off pairs of every colour, and the warm spill in front of the house. Returns the moon."""
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    moon = k.moon(0.30)
    for i in range(44):                                                            # life at the edges: other people, far off
        a = math.radians(12 + 156 * hsh(i * 3 + 1))
        d = 7.0 + 26.0 * hsh(i * 5 + 2)
        x, y = HOUSE[0] + math.cos(a) * d * 1.5, HOUSE[1] + 1.5 + math.sin(a) * d
        col = kit.LAMPS[i % len(kit.LAMPS)]
        k.spark((x - 0.13, y, 0.20), (1.0, 0.55, 0.22), r=0.07, strength=1.6, name=f"far_c{i}")
        k.spark((x + 0.13, y, 0.30), col, r=0.09, strength=1.5, name=f"far_l{i}")
        if i % 8 == 0:
            k.glow_light((x, y, 0.45), col, 16.0, 0.06, f"far_light{i}", shadows=False)
    for sx in (-1, 1):                                                             # what the open rooms throw on the floor
        k.glow_light(W(sx * 1.3, -1.7, 1.0), kit.WARM, 5.0, 0.2, f"spill{sx}", shadows=False)
    return moon


def make_scars(k):
    """A small red mark on the back wall of each room: what went wrong without it. Returns {room: root}."""
    red = k.mat("wrong_lit", (0.80, 0.07, 0.05), rough=0.8, emit=kit.WRONG, emit_strength=0.3)
    out = {}
    for room, (x, z) in SCARS.items():
        root = kit.empty("scar_" + room, W(x, 0.425, z))
        for j, (dx, dz, rot) in enumerate(((-0.014, 0.036, 0.5), (0.010, 0.0, -0.6), (-0.008, -0.036, 0.45))):
            kit.parent(kit.box(f"scar_{room}{j}", (0.014, 0.004, 0.05), (dx, 0, dz), red, rot=(0, rot, 0)), root)
        out[room] = root
    return out


def sheet(k, name, size=(0.11, 0.15), widths=(0.74, 0.58, 0.70, 0.52, 0.66, 0.60), shift=(), red=None, glow=0.0):
    """A page with chosen lines of writing (so two copies can differ). Lies flat like k.page; stand(root) props it up.
    red = (line, start 0..1, width 0..1) puts a red word over part of a line. Returns (root, the red word or None)."""
    root = kit.empty(name)
    paper = k.mat("paper_g%d" % round(glow * 10), kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=glow) if glow else k.mat("paper", kit.PAPER, rough=0.8)
    kit.parent(kit.box(name + "_sheet", (size[0], size[1], 0.0012), (0, 0, 0.0006), paper), root)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    n, word = len(widths), None
    for i, w in enumerate(widths):
        ww = size[0] * w
        y = size[1] * (0.40 - 0.80 * (i + 0.5) / n)
        x = -(size[0] * 0.80 - ww) / 2 + (shift[i] if i < len(shift) else 0.0) * size[0]
        kit.parent(kit.box(f"{name}_l{i}", (ww, size[1] * 0.035, 0.0006), (x, y, 0.0016), ink), root)
        if red and red[0] == i:
            word = kit.parent(kit.box(name + "_red", (size[0] * red[2], size[1] * 0.05, 0.0006),
                                      (-size[0] * 0.40 + size[0] * (red[1] + red[2] / 2), y, 0.0024),
                                      k.mat("wrong_lit", (0.80, 0.07, 0.05), rough=0.8, emit=kit.WRONG, emit_strength=0.3)), root)
    return root, word


def stand(root, back=0.3, turn=0.0):
    """Prop a flat page up to face the camera, leaning back by `back` radians."""
    root.rotation_euler = (math.pi / 2 - back, 0.0, turn)


def make_clock(k, name, r=0.085):
    """A clock face that faces the camera. Returns (root, hour hand, minute hand): turn a hand with set_clock()."""
    root = kit.empty(name)
    ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    for nm, prof, m in (("face", [(0.0, 0.0), (r, 0.0), (r, 0.01), (0.0, 0.01)], k.mat("paper", kit.PAPER, rough=0.8)),
                        ("rim", [(r, -0.004), (r * 1.12, -0.004), (r * 1.12, 0.016), (r, 0.016)], k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0))):
        ob = kit.lathe(f"{name}_{nm}", prof, seg=40)
        ob.rotation_euler = (math.pi / 2, 0, 0)
        ob.data.materials.append(m)
        kit.parent(ob, root)
    for i in range(12):
        a = 2 * math.pi * i / 12
        kit.parent(kit.box(f"{name}_t{i}", (r * 0.05, 0.003, r * 0.14), (r * 0.84 * math.sin(a), -0.012, r * 0.84 * math.cos(a)), ink, rot=(0, a, 0)), root)
    hands = []
    for nm, ln, th in (("hour", r * 0.53, r * 0.12), ("minute", r * 0.82, r * 0.07)):
        piv = kit.parent(kit.empty(f"{name}_{nm}", (0, -0.016, 0)), root)
        kit.parent(kit.box(f"{name}_{nm}_hand", (th, 0.003, ln), (0, 0, ln / 2), ink), piv)
        hands.append(piv)
    return root, hands[0], hands[1]


def set_clock(hour, minute, hours):
    """Point a make_clock's hands at `hours` (3.5 = half past three)."""
    hour.rotation_euler = (0, hours / 12.0 * 2 * math.pi, 0)
    minute.rotation_euler = (0, (hours % 1.0) * 2 * math.pi, 0)


def make_calendar(k, name, n, w=0.13, hgt=0.15):
    """A wall calendar with n leaves. Returns (root, leaves): flip a leaf with flip(leaf, 0..1). The root is its top edge."""
    root = kit.empty(name)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    kit.parent(kit.box(name + "_back", (w, 0.02, hgt), (0, 0.012, -hgt / 2), paper), root)
    kit.parent(kit.box(name + "_bind", (w * 1.06, 0.03, 0.02), (0, 0.006, 0.0), k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)), root)
    leaves = []
    for i in range(n):
        piv = kit.parent(kit.empty(f"{name}_p{i}", (0, -0.002 - 0.0015 * (n - 1 - i), -0.008)), root)
        kit.parent(kit.box(f"{name}_leaf{i}", (w * 0.94, 0.001, hgt * 0.9), (0, 0, -hgt * 0.45), paper), piv)
        kit.parent(kit.box(f"{name}_ink{i}", (w * 0.5, 0.0012, hgt * 0.10), (0, -0.001, -hgt * 0.40), ink), piv)
        leaves.append(piv)
    return root, leaves


def flip(leaf, u):
    leaf.rotation_euler = (-2.7 * u, 0, 0)
    kit.show(leaf, u < 1.0)


def make_tray(k, name, where, color, size=0.17):
    root = kit.empty(name, where)
    m = k.mat(name + "_m", color, rough=0.7)
    kit.parent(kit.box(name + "_b", (size, size, 0.006), (0, 0, 0.003), m), root)
    for sx, sy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        kit.parent(kit.box(f"{name}_r{sx}{sy}", (0.008 if sx else size, 0.008 if sy else size, 0.018), (sx * size / 2, sy * size / 2, 0.009), m), root)
    return root


def make_book(k, name, w=0.15, hgt=0.105):
    """An open book, flat like a page (stand() it up). Returns (root, the material of its one marked line)."""
    root = kit.empty(name)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    kit.parent(kit.box(name + "_cover", (w, hgt, 0.006), (0, 0, -0.003), k.mat("book_cover", (0.30, 0.13, 0.09), rough=0.7)), root)
    for sx in (-1, 1):
        kit.parent(kit.box(f"{name}_pg{sx}", (w * 0.46, hgt * 0.90, 0.003), (sx * w * 0.24, 0, 0.0015), paper), root)
        for j in range(4):
            if sx == 1 and j == 1:
                continue
            kit.parent(kit.box(f"{name}_l{sx}{j}", (w * 0.34, hgt * 0.05, 0.0006), (sx * w * 0.24, hgt * (0.28 - 0.19 * j), 0.0034), ink), root)
    lm = k.mat(name + "_line", (0.10, 0.07, 0.05), rough=0.9, emit=GOLD, emit_strength=0.0)
    kit.parent(kit.box(name + "_mark", (w * 0.36, hgt * 0.07, 0.0008), (w * 0.24, hgt * 0.09, 0.0036), lm), root)
    return root, lm


# ====================================================================== build
def build(k):
    s = k.p8 = types.SimpleNamespace()
    s.moonlight = outdoor(k)
    h = s.house = sets.House(k, at=HOUSE)
    s.roof = [(ob, tuple(ob.location), ob in h._front) for ob in h.root.children_recursive if "roof" in ob.name or "gable" in ob.name]
    s.ledger = next(ob for ob in h.root.children if ob.name.endswith("_ledger"))
    s.ledger_rule = next(ob for ob in h.root.children if ob.name.endswith("_ledger_rule"))
    s.scars = make_scars(k)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    brass = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0)
    wood = k.wood()

    # 1: the knot (3 to 2), as part 7 leaves it
    s.knot = k.line([(KR * math.sin(3 * a + math.pi / 2), 0.0, KR * math.sin(2 * a)) for a in (2 * math.pi * i / 360 for i in range(360))],
                    "knot", color=kit.PAPER, radius=0.006, glow=2.0, cyclic=True)

    # the ones who work here
    s.LIB, s.DESK = W(-0.64, 0.05, 0.20), W(-1.66, 0.05, 1.00)
    s.BENCH = [W(-0.72 + i, 0.05, 1.02) for i in range(3)]
    s.lib = k.candle(s.LIB, "librarian", seed=1.0)
    s.desk = k.candle(s.DESK, "splitter", seed=2.5)
    s.bench = [k.candle(p, f"bench{i}", seed=4.0 + i) for i, p in enumerate(s.BENCH)]
    s.him = k.lamp(W(-1.62, -0.05, 0.0), kit.HIS, "him", seed=2.0)
    s.ask, _ = sheet(k, "ask")

    # 4 to 6: the ladder, the page from memory, the book that answers, the gap
    s.ladder = kit.empty("ladder", W(0.99, 0.22, 0.0))
    for sx in (-1, 1):
        kit.parent(kit.box(f"ladder_rail{sx}", (0.012, 0.012, 0.563), (sx * 0.05, -0.03, 0.25), wood, rot=(math.radians(-27.5), 0, 0)), s.ladder)
    for j in range(6):
        z = 0.05 + 0.08 * j
        kit.parent(kit.box(f"ladder_rung{j}", (0.10, 0.012, 0.010), (0, -0.16 + 0.52 * z, z), wood), s.ladder)
    kit.parent(kit.box("ladder_step", (0.13, 0.10, 0.012), (0, -0.05, 0.299), wood), s.ladder)
    s.memory, _ = sheet(k, "memory", (0.10, 0.13), glow=0.5)
    books = sorted(h.books, key=lambda b: (round(b.location[2], 2), b.location[0]))
    for b in books:
        b["home"] = tuple(b.location)
        b["mat"] = b.material_slots[0].material.name
    s.answer = min(books, key=lambda b: abs(b.location[0] - 0.44) + abs(b.location[2] - 0.47) * 3)
    s.gap = min(books, key=lambda b: abs(b.location[0] - 0.74) + abs(b.location[2] - 0.32) * 3)
    s.forgot = min(books, key=lambda b: abs(b.location[0] - 0.17) + abs(b.location[2] - 0.47) * 3)
    s.AX, s.GX = s.answer["home"][0], s.gap["home"][0]
    s.book, s.book_line = make_book(k, "answer_open")
    stand(s.book, 0.15)
    s.OPEN = W(s.AX + 0.08, 0.10, 0.53)
    s.pointer = k.line([lerp(W(s.AX - 0.12, 0.17, 0.495), (s.OPEN[0] + 0.036, s.OPEN[1] - 0.01, s.OPEN[2] + 0.009), i / 8) for i in range(9)],
                       "pointer", color=GOLD, radius=0.0022, glow=2.2)
    gh = s.gap["home"]
    s.gap_frame = kit.empty("gap_frame", W(gh[0], gh[1] - 0.046, gh[2]))
    gm = s.gap_mat = k.mat("gap_gold", (0.2, 0.15, 0.05), emit=GOLD, emit_strength=2.0)
    gw, gz = s.gap.scale[0] + 0.012, s.gap.scale[2] + 0.012
    for sx in (-1, 1):
        kit.parent(kit.box(f"gap_v{sx}", (0.004, 0.004, gz), (sx * gw / 2, 0, 0), gm), s.gap_frame)
        kit.parent(kit.box(f"gap_h{sx}", (gw, 0.004, 0.004), (0, 0, sx * gz / 2), gm), s.gap_frame)

    # 7: the record, measured: one book in four has something pointing at it
    s.books = books
    s.pointed = [b for i, b in enumerate(books) if i % 4 == 1 and b not in (s.gap, s.forgot)]
    s.unpointed = [b for b in books if b not in s.pointed]
    s.dim = k.mat("book_dim", (0.030, 0.027, 0.025), rough=0.9)
    s.INDEX = W(-0.40, 0.05, 0.215)
    s.threads = []
    for i, b in enumerate(sorted(s.pointed, key=lambda b: hsh(b["home"][0] * 37 + b["home"][2] * 11))):
        bw = W(b["home"][0], b["home"][1] - 0.07, b["home"][2])
        pts = [lerp(s.INDEX, bw, j / 14) for j in range(15)]
        pts = [(p[0], p[1], p[2] + 0.12 * math.sin(math.pi * j / 14)) for j, p in enumerate(pts)]
        s.threads.append((k.line(pts, f"thread{i}", color=(1.0, 0.50, 0.18), radius=0.0018, glow=0.9), b))

    # 8: four hours, and the page that was already written
    s.TOIL = [W(-0.56, -0.05, 0.20), W(-0.24, -0.05, 0.20)]
    s.toil = [k.candle(p, f"toiler{i}", seed=20.0 + i) for i, p in enumerate(s.TOIL)]
    s.scratch, _ = sheet(k, "scratch", (0.12, 0.16), widths=(0.70, 0.50, 0.74, 0.44, 0.62, 0.56, 0.68))
    s.scratch.location = W(-0.40, -0.06, 0.201)
    s.clock4 = make_clock(k, "clock4", 0.085)
    s.clock4[0].location = W(-0.40, 0.12, 0.57)
    s.found, _ = sheet(k, "found", (0.12, 0.16), widths=(0.70, 0.50, 0.74, 0.44, 0.62, 0.56, 0.68), glow=0.35)
    s.glowbook = k.mat("book_glow", (0.4, 0.36, 0.28), emit=kit.PAPER, emit_strength=1.6)

    # 9, 10: the desk cuts the page in three; each bench has its own tray; the desk's own tray stays empty
    tints = ((0.20, 0.30, 0.34), (0.36, 0.27, 0.14), (0.24, 0.32, 0.20))
    s.CUT = W(-1.44, 0.03, 1.002)
    s.TRAYS = [W(-0.34 + i, 0.03, 1.02) for i in range(3)]
    s.trays = [make_tray(k, f"tray{i}", p, tuple(c * 1.5 for c in tints[i]), size=0.20) for i, p in enumerate(s.TRAYS)]
    s.desk_tray = make_tray(k, "tray_desk", W(-1.29, -0.02, 1.00), (0.30, 0.25, 0.21), size=0.13)
    s.pieces = []
    for i in range(3):
        root = kit.empty(f"piece{i}")
        kit.parent(kit.box(f"piece{i}_p", (0.05, 0.17, 0.0015), (0, 0, 0.0008), paper), root)
        kit.parent(kit.box(f"piece{i}_tab", (0.05, 0.04, 0.0016), (0, 0.065, 0.0012), k.mat(f"tab{i}", tuple(c * 1.8 for c in tints[i]), rough=0.7)), root)
        kit.parent(kit.box(f"piece{i}_ink", (0.032, 0.08, 0.0016), (0, -0.02, 0.0012), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)), root)
        s.pieces.append(root)

    # 11: the report, the bar, the chute
    s.report, s.report_red = sheet(k, "report", (0.10, 0.14), red=(4, 0.0, 0.62))
    s.bar = kit.box("bar", (1.02, 0.06, 0.08), W(-1.5, FRONT + 0.17, 1.16), k.mat("bar", (0.55, 0.40, 0.20), rough=0.5))
    s.CH0, s.CH1 = W(0.30, FRONT + 0.04, 0.86), W(-0.34, FRONT + 0.04, 0.27)
    s.chute = kit.empty("chute", lerp(s.CH0, s.CH1, 0.5))
    s.chute.rotation_euler = (0, math.radians(-42.7), 0)
    kit.parent(kit.box("chute_floor", (0.90, 0.15, 0.008), (0, 0, -0.012), wood), s.chute)
    for sy in (-1, 1):
        kit.parent(kit.box(f"chute_rail{sy}", (0.90, 0.008, 0.034), (0, sy * 0.075, 0.004), wood), s.chute)

    # 12: his ruling. A plank on the floor, three candles, a page passed along: each copy a little different
    s.PLANK = W(0.05, -1.5, 0.0)
    s.plank = kit.box("plank", (1.25, 0.24, 0.02), (s.PLANK[0], s.PLANK[1], 0.01), wood)
    s.STRIP = [W(-0.42 + 0.42 * i, -1.5, 0.02) for i in range(3)]
    s.strip = [k.candle(p, f"teller{i}", seed=30.0 + i) for i, p in enumerate(s.STRIP)]
    s.RULE_AT = W(-0.98, -1.5, 0.0)
    s.copies = []
    for i, (widths, shift, red) in enumerate((((0.74, 0.58, 0.70, 0.52, 0.66), (), None),
                                              ((0.74, 0.44, 0.70, 0.60, 0.50), (0.0, 0.08, 0.0, 0.0, 0.10), None),
                                              ((0.62, 0.44, 0.76, 0.60, 0.36), (0.06, 0.08, 0.0, 0.10, 0.0), (2, 0.34, 0.36)))):
        root, word = sheet(k, f"copy{i}", (0.15, 0.19), widths=widths, shift=shift, red=red, glow=0.25)
        s.copies.append((root, word))
    s.COPY = [(p[0] + 0.17, p[1] + 0.03, p[2] + 0.105) for p in s.STRIP]

    # 13: the files, opened in a row, and the report held against them
    s.ROW = [W(-0.47 + 0.18 * i, 0.12, 0.50) for i in range(3)]
    s.files = []
    for i, p in enumerate(s.ROW):
        root, lm = make_book(k, f"file{i}")
        root.location = p
        stand(root, 0.12)
        s.files.append((root, lm))
    s.REPORT_UP = W(-0.66, 0.12, 0.50)
    s.checks = [k.line([lerp((s.REPORT_UP[0] + 0.05, s.REPORT_UP[1] - 0.012, s.REPORT_UP[2] + 0.035 - 0.022 * i),
                             (p[0] + 0.012, p[1] - 0.012, p[2] + 0.009), j / 6) for j in range(7)],
                       f"check{i}", color=GOLD, radius=0.0018, glow=2.0) for i, p in enumerate(s.ROW)]
    s.flag = kit.empty("flag", W(-0.40, -0.06, 0.20))
    kit.parent(kit.box("flag_pole", (0.006, 0.006, 0.17), (0, 0, 0.085), brass), s.flag)
    kit.parent(kit.box("flag_cloth", (0.07, 0.003, 0.045), (0.038, 0, 0.145), k.mat("wrong_lit", (0.80, 0.07, 0.05), rough=0.8, emit=kit.WRONG, emit_strength=0.3)), s.flag)

    # 14 to 17: the ledger; the pen; the count; the calendar
    la = h.ledger_at
    s.LEDGER_HOME = tuple(s.ledger.location)
    s.pen = kit.empty("pen")
    kit.parent(kit.box("pen_body", (0.02, 0.02, 0.15), (0, 0, 0.099), k.mat("pen", (0.06, 0.05, 0.08), rough=0.4)), s.pen)
    kit.parent(kit.box("pen_nib", (0.012, 0.012, 0.03), (0, 0, 0.015), brass), s.pen)
    s.MAKER, s.FINDER = W(-0.70, -0.02, 0.20), W(-0.26, -0.02, 0.20)
    s.txt_n = k.text("2", W(la[0] + 0.42, la[1] - 0.05, la[2] + 0.0), size=0.10, color=kit.WRONG, glow=0.8, name="count")
    s.cal, s.cal_leaves = make_calendar(k, "calendar", 14)
    s.cal.location = W(-0.885, 0.40, 0.62)

    # 18, 19: the hall. A candle that has been away; the clock; two slips; the guess and the real time
    kit.box("stool_top", (0.36, 0.20, 0.014), W(-1.155, -0.05, 0.173), wood)
    kit.box("stool_leg", (0.04, 0.04, 0.166), W(-1.155, -0.05, 0.083), wood)
    s.ME = W(-1.26, -0.05, 0.18)
    s.me = k.candle(s.ME, "back_again", seed=40.0)
    ca = h.clock_at
    s.CLOCK = W(ca[0], ca[1] - 0.022, ca[2])
    s.slips = []
    for i in range(2):
        root, _ = sheet(k, f"slip{i}", (0.075, 0.042), widths=(0.70, 0.46))
        s.slips.append(root)
    s.SLIP = [W(-1.12, -0.06, 0.205), W(-1.03, -0.04, 0.205)]
    s.ghost = kit.empty("guess", s.CLOCK)
    s.ghost_mat = k.mat("guess", (0.3, 0.2, 0.1), emit=kit.WARM, emit_strength=0.0)
    kit.parent(kit.box("guess_hand", (0.006, 0.003, 0.070), (0, 0, 0.035), s.ghost_mat), s.ghost)
    ring = lambda r, a1: [(s.CLOCK[0] + r * math.sin(a1 * i / 40), s.CLOCK[1] - 0.004, s.CLOCK[2] + r * math.cos(a1 * i / 40)) for i in range(41)]
    s.GUESS, s.REAL = math.radians(120.0), math.radians(240.0)                     # twenty minutes guessed; forty gone
    s.arc_guess = k.line(ring(0.105, s.GUESS), "arc_guess", color=kit.WARM, radius=0.003, glow=1.4)
    s.arc_real = k.line(ring(0.128, s.REAL), "arc_real", color=kit.PAPER, radius=0.004, glow=1.6)
    s.txt_x2 = k.text("×2", W(ca[0] + 0.27, ca[1] - 0.05, ca[2] + 0.06), size=0.11, name="x2")

    # 20 to 22: the thread through a candle; the same, earlier, cut; a different candle lit from a note
    za = 1.02 + 0.172
    s.thread_a = k.line([W(-0.97 + 0.94 * i / 30, 0.05, za) for i in range(31)], "thread_a", color=kit.WARM, radius=0.004, glow=2.0)
    s.bead = k.spark(W(-0.72, 0.05, za), kit.WARM, r=0.012, strength=3.0, name="bead")
    s.thread_l = k.line([W(0.03 + 0.25 * i / 10, 0.05, za) for i in range(11)], "thread_left", color=kit.WARM, radius=0.004, glow=2.0)
    s.thread_r = k.line([(-0.69 * i / 20, 0.0, 0.0) for i in range(21)], "thread_right", color=kit.WARM, radius=0.004, glow=2.0)
    s.thread_r.ob.location = W(0.97, 0.05, za)
    s.NEW = W(0.78, 0.05, 1.02)
    s.newcomer = k.candle(s.NEW, "newcomer", height=0.13, seed=13.0)
    s.note, _ = sheet(k, "note", (0.085, 0.10), widths=(0.70, 0.50, 0.62, 0.40), glow=0.3)
    s.NOTE = W(0.58, 0.0, 1.02 + 0.05)
    stand(s.note, 0.45)
    s.note_spark = k.spark(s.NOTE, kit.PAPER, r=0.009, strength=2.5, name="note_spark")
    s.auto = [sheet(k, f"auto{i}", (0.10, 0.13))[0] for i in range(3)]


# ====================================================================== pose
def pose(k, t):
    s = k.p8
    h = s.house
    lib_top = W(-0.40, 0.05, 0.201)

    # =========================================================== 1: the knot opens into the house
    h.show(t > T_RUNS + 0.25)
    up = ss(T_RUNS + 0.3, T_RUNS + 0.9, t)
    h.root.scale = (1.0, 1.0, max(0.001, up + 0.16 * hit(t, T_RUNS + 0.9, 6.0) * math.sin((t - T_RUNS - 0.9) * 22.0)))
    front_gone = t > T_BRING + 1.4
    h.front(-1.0 if front_gone else 1.0 - ss(T_RUNS + 2.05, T_RUNS + 3.0, t))
    drop = ss(T_RUNS + 1.3, T_RUNS + 1.75, t)
    for ob, home, is_front in s.roof:
        ob.location = (home[0], home[1], home[2] + 2.6 * (1.0 - drop * drop) - 0.05 * hit(t, T_RUNS + 1.75, 9.0) * math.sin((t - T_RUNS - 1.75) * 30.0))
        ob.hide_render = t < T_RUNS + 1.28 or (is_front and front_gone)
    ku = ss(T_RUNS + 0.2, T_RUNS + 1.2, t)
    s.knot.ob.location = lerp(FC, W(0.0, -0.47, 0.78), ku)
    s.knot.ob.scale = (lerp(1.0, 4.6, ku), 1.0, lerp(1.0, 1.77, ku))
    s.knot.set(grow=1.0 if t < T_RUNS + 1.5 else 0.0, glow=(1.0 - ss(T_RUNS + 0.6, T_RUNS + 1.5, t)) * (1.0 + 0.2 * math.sin(t * 3.0)))

    # =========================================================== 2: each room lights, and shows its scar
    def lit_at(room):
        return T_EVERY + 0.3 + 0.55 * ROOM_ORDER.index(room)
    for room in ROOM_ORDER:
        on = ss(lit_at(room), lit_at(room) + 0.15, t)
        full = 0.30 if room == "small" else 0.58
        h.lit(room, 0.20 + full * on * (1.0 + 0.7 * hit(t, lit_at(room) + 0.15, 5.0)))
        scale(s.scars[room], pop(t, lit_at(room) + 0.22, 0.18, 0.9))
        s.scars[room].hide_render = False
        kit.show(s.scars[room], t > lit_at(room) + 0.22)
    h.lit("attic", 0.0)

    # =========================================================== the camera (set first: the shake is used below)
    def cam(x, z, d):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z - 0.03))
    strip_shot = T_RULING - 0.15 <= t < T_OPENS - 0.15
    if strip_shot:                                                                 # 12: out on the floor, in front of the house
        pos = kf(t, [(T_RULING - 0.15, W(0.0, -4.5, 0.62)), (T_RULING + 4.4, W(0.22, -4.0, 0.52)), (T_OPENS - 0.15, W(0.34, -3.5, 0.46))])
        look = kf(t, [(T_RULING - 0.15, W(-0.15, -1.5, 0.20)), (T_RULING + 4.4, W(0.10, -1.5, 0.17)), (T_OPENS - 0.15, W(0.32, -1.5, 0.16))])
        sh = 0.02 * hit(t, T_RULING + 0.55, 9.0)
        pos = (pos[0] + sh * math.sin(t * 61.0), pos[1], pos[2] + sh * math.sin(t * 77.0))
        lens = 40.0
    else:
        keys = [(P0, cam(0.0, 0.80, 3.3)), (T_RUNS + 0.2, cam(0.0, 0.80, 3.2)), (T_RUNS + 1.5, cam(0.0, 1.05, 6.7)), (T_EVERY + 4.2, cam(0.0, 1.00, 6.0)),
                (T_BRING + 1.2, cam(-1.0, 0.29, 2.8)), (T_KEEPS - 0.2, cam(-0.75, 0.30, 2.8)), (T_KEEPS + 1.0, cam(0.10, 0.42, 2.3)), (T_MEMORY + 2.4, cam(0.14, 0.44, 2.2)),
                (T_SHELF + 1.2, cam(0.42, 0.44, 1.75)), (T_NOTHING + 0.8, cam(0.60, 0.40, 1.75)), (T_SEAT - 0.1, cam(0.60, 0.40, 1.75)),
                (T_SEAT + 1.4, cam(0.14, 0.42, 2.45)), (T_FOUR - 0.2, cam(0.18, 0.42, 2.35)), (T_FOUR + 1.0, cam(-0.20, 0.42, 2.25)), (T_SPLITS, cam(-0.24, 0.42, 2.15)),
                (T_SPLITS + 1.8, cam(-1.30, 1.16, 2.1)), (T_REST - 0.1, cam(-1.34, 1.16, 2.0)), (T_REST + 1.6, cam(0.42, 1.17, 3.45)), (T_DONE, cam(0.45, 1.17, 3.4)),
                (T_DONE + 2.4, cam(-0.35, 0.86, 3.9)), (T_RULING - 0.15, cam(-0.40, 0.80, 4.1)),
                (T_OPENS - 0.15, cam(-0.38, 0.41, 1.66)), (T_COLUMN - 0.3, cam(-0.38, 0.41, 1.60)), (T_COLUMN + 0.8, cam(-0.48, 0.44, 1.78)), (T_74, cam(-0.48, 0.45, 1.72)),
                (T_74 + 0.6, cam(-0.52, 0.47, 1.78)), (T_TIME - 0.3, cam(-0.52, 0.47, 1.78)), (T_TIME + 1.2, cam(-1.36, 0.28, 1.85)), (T_SAME - 0.3, cam(-1.34, 0.29, 1.75)),
                (T_SAME + 1.0, cam(-0.50, 1.17, 1.75)), (T_MONTHS - 0.4, cam(-0.50, 1.17, 1.70)), (T_MONTHS + 0.4, cam(0.50, 1.17, 1.72)), (T_NOTES + 4.2, cam(0.56, 1.17, 1.62)),
                (P1 - 1.0, cam(0.0, 1.00, 6.2)), (P1, cam(0.0, 1.00, 6.3))]
        pos, look = kf(t, [(a, b[0]) for a, b in keys]), kf(t, [(a, b[1]) for a, b in keys])
        sh = 0.03 * hit(t, T_RUNS + 1.75, 8.0) + 0.02 * hit(t, T_DONE + 1.75, 9.0)
        pos = (pos[0] + sh * math.sin(t * 61.0), pos[1], pos[2] + sh * math.sin(t * 77.0))
        lens = 40.0
    k.camera(pos, look, lens)

    # =========================================================== 3: the lamp at the door; the page leaves for the library
    HALL, HAND = W(-1.62, -0.05, 0.0), W(-1.50, -0.10, 0.34)
    if t < T_DONE + 5.4:
        u = ss(T_BRING + 0.1, T_BRING + 0.75, t)
        hp = kf(u, [(0.0, W(-2.9, -0.80, 0.0)), (0.6, W(-1.75, -0.74, 0.0)), (1.0, HALL)])
        hp = (hp[0], hp[1], hp[2] + bounce(t, T_BRING + 0.1, 0.16, 0.33) + bounce(t, T_BRING + 0.43, 0.12, 0.32))
        him_land = T_BRING + 0.75
    elif t < T_OPENS - 0.15:                                                       # out to the floor, for his ruling
        u = ss(T_DONE + 5.4, T_RULING + 0.55, t)
        hp = kf(u, [(0.0, HALL), (0.35, W(-1.62, -0.80, 0.0)), (1.0, s.RULE_AT)])
        t0, dur = T_DONE + 5.4, (T_RULING + 0.55 - T_DONE - 5.4) / 4.0
        hp = (hp[0], hp[1], hp[2] + sum(bounce(t, t0 + j * dur, 0.14 if j < 3 else 0.30, dur) for j in range(4))
              + bounce(t, T_RULING + 5.6, 0.07, 0.3))
        him_land = T_RULING + 0.55
    else:
        hp, him_land = HALL, T_TIME + 2.0 + 0.28
        hp = (hp[0], hp[1], hp[2] + bounce(t, T_TIME + 2.0, 0.05, 0.28))
    s.him.root.location = hp
    kit.squash(s.him.root, land(t, him_land, 0.26), turn=0.0)
    kit.show(s.him.root, t > T_BRING)
    s.him.set(t, size=(1.0 + 0.5 * hit(t, him_land, 4.0)) if t > T_BRING else 0.0, bright=1.0 + 0.9 * hit(t, T_RULING + 0.55, 3.0),
              lean=(0.22, 0.04 - 0.25 * ss(T_RULING + 5.2, T_RULING + 5.8, t) * (1.0 - ss(T_OPENS - 0.2, T_OPENS, t))))

    # the page that is followed: from his hand to the library table, then (9) up to the desk, where it is cut
    u1 = ss(T_BRING + 1.1, T_BRING + 2.7, t)
    u2 = ss(T_SPLITS + 0.3, T_SPLITS + 1.8, t)
    if u2 > 0.0:
        ap, fly = via_front(lib_top, s.CUT, u2, 0.10), u2
    else:
        ap, fly = via_front(HAND, lib_top, u1, 0.12), u1
    cut = ss(T_SPLITS + 2.3, T_SPLITS + 2.8, t)
    s.ask.location = ap
    s.ask.rotation_euler = (1.15 * math.sin(math.pi * fly), 0, 0)
    scale(s.ask, pop(t, T_BRING + 0.9, 0.2))
    kit.show(s.ask, T_BRING + 0.9 < t and cut <= 0.0)

    # =========================================================== 4 to 8: the librarian, the ladder, the shelf
    lx = kf(t, [(T_KEEPS + 0.05, 0.99), (T_KEEPS + 0.55, 0.30), (T_SHELF + 0.2, 0.30), (T_SHELF + 0.9, s.AX - 0.12), (T_NOTHING - 0.1, s.AX - 0.12),
                (T_NOTHING + 0.7, s.GX - 0.11), (T_SEAT + 0.2, s.GX - 0.11), (T_SEAT + 1.1, 0.03)])
    s.ladder.location = W(lx, 0.22, 0.0)
    kit.show(s.ladder, t > T_KEEPS)
    on = ss(T_KEEPS + 0.55, T_KEEPS + 1.0, t) - ss(T_SPLITS - 0.9, T_SPLITS - 0.4, t)
    plat = W(lx, 0.17, 0.305)
    lp = lerp(s.LIB, plat, on)
    lp = (lp[0], lp[1], lp[2] + 0.16 * 4.0 * on * (1.0 - on))
    lib_land, lib_tilt = (T_KEEPS + 1.0 if t < T_SPLITS - 0.6 else T_SPLITS - 0.4), (0.0, 0.0)
    bat = T_MEMORY + 1.25
    if T_MEMORY < t < T_SHELF:
        lib_tilt = (-0.45 * math.sin(math.pi * min(1.0, max(0.0, (t - bat + 0.08) / 0.4))), 0.0)
    if t >= T_OPENS - 0.15:                                                        # later: by the ledger, as the one who found it
        u = ss(T_COLUMN + 0.2, T_COLUMN + 0.7, t) - ss(T_TIME + 0.2, T_TIME + 0.8, t)
        lp = arc(s.LIB, s.FINDER, u, 0.12)
        lib_land = T_COLUMN + 0.7
    s.lib.root.location = lp
    kit.squash(s.lib.root, land(t, lib_land, 0.22), tilt=lib_tilt, turn=0.0)
    kit.show(s.lib.root, t > lit_at("library"))
    to_shelf = ss(T_SHELF + 0.9, T_SHELF + 1.4, t) * (1.0 - ss(T_SEAT, T_SEAT + 0.8, t))
    at_gap = ss(T_NOTHING + 0.7, T_NOTHING + 1.0, t) * (1.0 - ss(T_SEAT, T_SEAT + 0.8, t))
    checking = ss(T_OPENS + 1.2, T_OPENS + 1.8, t) * (1.0 - ss(T_COLUMN - 0.3, T_COLUMN, t))
    writes = ss(T_RULE + 3.4, T_RULE + 4.0, t) * (1.0 - ss(T_TIME - 0.2, T_TIME + 0.2, t))
    s.lib.set(t, size=ss(lit_at("library"), lit_at("library") + 0.3, t) * (1.0 + 0.3 * hit(t, T_KEEPS + 1.0, 3.0) + 0.5 * hit(t, bat, 5.0) + 0.4 * hit(t, T_OPENS + 5.4, 3.0)),
              lean=(0.24 * to_shelf * (1.0 - at_gap) + 0.20 * at_gap + 0.22 * checking - 0.25 * writes, 0.22 * to_shelf - 0.12 * at_gap * math.sin((t - T_NOTHING) * 8.0)))

    # 5: a page out of memory, over its flame; it bats it away
    mu = pop(t, T_MEMORY + 0.3, 0.25)
    away = max(0.0, t - bat)
    s.memory.location = (plat[0] - 0.02 - 1.6 * away, plat[1] - 0.03 - 0.3 * away, plat[2] + 0.36 + 0.02 * math.sin(t * 5.0) + 0.9 * away - 1.6 * away * away)
    s.memory.rotation_euler = (math.pi / 2 - 0.25, 9.0 * away, 0.0)
    scale(s.memory, mu)
    kit.show(s.memory, T_MEMORY + 0.3 < t < bat + 0.9)

    # 6A: a book comes out, and one line in it glows. 6B: a gap, and it shows the gap
    out = ss(T_SHELF + 0.9, T_SHELF + 1.3, t) * (1.0 - ss(T_NOTHING - 0.4, T_NOTHING, t))
    ans = s.answer
    if k.changed("answer", round(out, 3)):
        ans.location = (ans["home"][0], ans["home"][1] - 0.10 * out, ans["home"][2])
    opened = pop(t, T_SHELF + 1.3, 0.25) * (1.0 - ss(T_NOTHING - 0.5, T_NOTHING - 0.2, t))
    s.book.location = lerp(W(s.AX, 0.24, ans["home"][2]), s.OPEN, min(1.0, opened))
    s.book.scale = (max(0.001, opened), max(0.001, min(1.0, opened * 1.5)), max(0.001, min(1.0, opened * 1.5)))
    kit.show(s.book, T_SHELF + 1.3 < t < T_NOTHING - 0.2)
    emit(s.book_line, 2.4 * ss(T_SHELF + 1.9, T_SHELF + 2.1, t) * (1.0 + 0.6 * hit(t, T_SHELF + 2.1, 4.0)))
    s.pointer.set(grow=ss(T_SHELF + 1.7, T_SHELF + 2.1, t) if t < T_NOTHING - 0.5 else 0.0, glow=1.0)
    s.gap.hide_render = True                                                       # the place where nothing was ever written
    gp = pop(t, T_NOTHING + 0.95, 0.2, 0.6) * (1.0 - ss(T_SEAT + 0.2, T_SEAT + 0.8, t))
    s.gap_frame.scale = (max(0.001, gp), 1.0, max(0.001, gp))
    kit.show(s.gap_frame, T_NOTHING + 0.95 < t < T_SEAT + 0.8)
    emit(s.gap_mat, 1.6 + 0.8 * math.sin((t - T_NOTHING) * 7.0))

    # 7: the shelves whole. A thread to one book in four; the other three in four go dark
    measured = T_SEAT + 0.5 < t < T_SPLITS + 0.3
    done = ss(T_SPLITS - 0.5, T_SPLITS + 0.2, t)
    for i, (th, b) in enumerate(s.threads):
        g = ss(T_SEAT + 1.1 + i * 0.155, T_SEAT + 1.5 + i * 0.155, t)
        th.set(grow=g if measured else 0.0, glow=(1.0 + 0.8 * hit(t, T_SEAT + 1.5 + i * 0.155, 5.0)) * (1.0 - done) * (1.0 - 0.7 * ss(T_FOUR - 0.4, T_FOUR + 0.4, t)))
        nudge = round(0.022 * ss(T_SEAT + 1.4 + i * 0.155, T_SEAT + 1.55 + i * 0.155, t) * (1.0 - done), 4)
        if k.changed(("nudge", i), nudge):
            b.location = (b["home"][0], b["home"][1] - nudge, b["home"][2])
    glows = T_FOUR + 2.5 < t < T_SPLITS + 0.2
    for i, b in enumerate(s.unpointed):
        dark = T_DARK + 2.0 * (b["home"][0] - 0.09) / 0.82 + 0.25 * hsh(i) < t < T_SPLITS - 0.3 + 0.3 * hsh(i)
        state = 2 if (b is s.forgot and glows) else 1 if dark else 0
        if k.changed(("book", i), state):
            b.material_slots[0].material = (bpy.data.materials[b["mat"]], s.dim, s.glowbook)[state]

    # 8: four hours at the table, under a clock; behind them, the dark book that had the very page
    toiling = T_FOUR - 0.1 < t < T_SPLITS + 0.1
    tired = ss(T_FOUR + 0.8, T_FOUR + 3.2, t)
    for i, c in enumerate(s.toil):
        t_in = T_FOUR + 0.15 + 0.18 * i
        c.root.location = (s.TOIL[i][0], s.TOIL[i][1], s.TOIL[i][2] + 0.5 * (1.0 - ss(t_in - 0.3, t_in, t)) ** 2)
        seen = ss(T_FOUR + 3.4, T_FOUR + 3.9, t)
        kit.squash(c.root, land(t, t_in, 0.3), tilt=(0.0, 0.0), turn=0.0)
        c.set(t, size=(1.0 - 0.45 * tired) * (1.0 - ss(T_SPLITS - 0.3, T_SPLITS + 0.1, t)) if toiling else 0.0,
              lean=((0.30 - 0.6 * i) * (0.6 + 0.4 * math.sin(t * 9.0 + i * 2.0)) * (1.0 - seen) + 0.30 * seen, 0.20 * seen))
        kit.show(c.root, toiling)
    kit.show(s.scratch, T_FOUR + 0.5 < t < T_SPLITS + 0.1)
    croot, chour, cmin = s.clock4
    scale(croot, pop(t, T_FOUR + 0.3, 0.2) * (1.0 - ss(T_SPLITS - 0.3, T_SPLITS, t)))
    kit.show(croot, T_FOUR + 0.3 < t < T_SPLITS)
    set_clock(chour, cmin, 4.0 * ss(T_FOUR + 0.6, T_FOUR + 2.6, t) ** 0.8)
    fo = s.forgot
    slid = ss(T_FOUR + 2.6, T_FOUR + 3.0, t) * (1.0 - ss(T_SPLITS - 0.4, T_SPLITS, t))
    if k.changed("forgot", round(slid, 3)):
        fo.location = (fo["home"][0], fo["home"][1] - 0.11 * slid, fo["home"][2])
    come = ss(T_FOUR + 3.1, T_FOUR + 4.3, t)
    s.found.location = arc(W(fo["home"][0], fo["home"][1] - 0.16, fo["home"][2]), W(-0.24, 0.10, 0.20 + 0.085), come, 0.10)
    stand(s.found, 0.25)
    scale(s.found, pop(t, T_FOUR + 3.1, 0.2) * (1.0 - ss(T_SPLITS - 0.3, T_SPLITS, t)))
    kit.show(s.found, T_FOUR + 3.1 < t < T_SPLITS)

    # =========================================================== 9, 10: the desk splits it; three benches, three trays
    for room, c in (("desk", s.desk), *zip(("bench_a", "bench_b", "bench_c"), s.bench)):
        kit.show(c.root, t > lit_at(room))
    s.desk.set(t, size=ss(lit_at("desk"), lit_at("desk") + 0.3, t) * (1.0 + 0.5 * hit(t, T_SPLITS + 2.3, 6.0) + 0.5 * hit(t, T_SPLITS + 2.55, 6.0)),
               lean=(0.30 * ss(T_SPLITS + 1.6, T_SPLITS + 2.2, t) * (1.0 - ss(T_REST + 2.5, T_REST + 3.5, t)) + 0.25 * ss(T_DONE + 4.6, T_DONE + 5.2, t) * (1.0 - ss(T_RULING, T_RULING + 0.5, t)), 0.0))
    tip = ss(T_SPLITS + 3.0, T_SPLITS + 3.3, t) * (1.0 - ss(T_SPLITS + 4.2, T_SPLITS + 4.6, t))
    s.desk_tray.location = W(-1.29, -0.02 - 0.10 * tip, 1.00 + 0.10 * tip + bounce(t, T_SPLITS + 3.0, 0.03, 0.3))
    s.desk_tray.rotation_euler = (1.25 * tip, 0, 0)
    for i, pc in enumerate(s.pieces):
        a = (s.CUT[0] + (i - 1) * (0.052 + 0.022 * cut), s.CUT[1], s.CUT[2])
        b = (s.TRAYS[i][0], s.TRAYS[i][1], s.TRAYS[i][2] + 0.008)
        if i == 1:                                                                 # heads for the wrong tray, and bounces off it
            wrong = (s.TRAYS[0][0] + 0.02, s.TRAYS[0][1], s.TRAYS[0][2] + 0.035)
            go = ss(T_REST + 1.6, T_REST + 3.0, t)
            off = ss(T_REST + 3.0, T_REST + 4.2, t)
            p = arc(wrong, b, off, 0.26) if off > 0.0 else via_front(a, wrong, go, 0.08) if go > 0.0 else a
            fly = math.sin(math.pi * go) + math.sin(math.pi * off)
            spin = 6.0 * off * (1.0 - off)
        else:
            t0 = T_REST + 0.3 + i * 1.65
            go = ss(t0, t0 + 1.3 + 0.25 * i, t)
            p = via_front(a, b, go, 0.08) if go > 0.0 else a
            fly, spin = math.sin(math.pi * go), 0.0
        landed = T_REST + (1.6, 4.2, 5.4)[i]
        work = T_REST + 5.5 + 0.35 * i
        up_ = ss(work, work + 0.3, t) * (1.0 - ss(T_DONE + 0.2, T_DONE + 0.5, t) * (1.0 if i == 1 else 0.0))
        p = (p[0], p[1], p[2] + 0.07 * up_ + 0.05 * hit(t, landed, 8.0))
        pc.location = p
        pc.rotation_euler = (max(1.1 * fly, 0.95 * (1.0 - ss(T_REST + 0.3 + i * 0.3, T_REST + 0.5 + i * 0.3, t)), 1.2 * up_), spin, 0)
        scale(pc, 1.0 + 0.7 * min(1.0, fly) + 0.4 * up_)
        kit.show(pc, cut > 0.0 and not (i == 1 and t > T_DONE + 0.3))
    s.trays[0].rotation_euler = (0, 0.25 * hit(t, T_REST + 3.0, 6.0) * math.sin((t - T_REST - 3.0) * 30.0), 0)

    # 11: the report starts for the desk; a bar comes down; a chute takes it to the library
    rep0 = (s.TRAYS[1][0], s.TRAYS[1][1], s.TRAYS[1][2] + 0.01)
    bar_x = HOUSE[0] - 1.22
    t_bar = T_DONE + 1.75
    if t < t_bar:
        rp = kf(t, [(T_DONE + 0.3, rep0), (T_DONE + 0.8, (rep0[0], HOUSE[1] + FRONT, rep0[2] + 0.16)), (t_bar, (bar_x, HOUSE[1] + FRONT, 1.18))])
        rrot = (1.2 * ss(T_DONE + 0.3, T_DONE + 0.8, t), 0.0, 0.0)
    elif t < T_DONE + 2.9:                                                         # knocked back, to the top of the chute
        u = ss(t_bar, T_DONE + 2.9, t)
        rp = arc((bar_x, HOUSE[1] + FRONT, 1.18), (s.CH0[0], s.CH0[1], s.CH0[2] + 0.02), u, 0.16)
        rrot = (1.2, 7.0 * u * (1.0 - u), 0.0)
    elif t < T_OPENS - 0.15:
        u = ss(T_DONE + 2.9, T_DONE + 3.9, t) ** 1.6
        v = ss(T_DONE + 3.9, T_DONE + 4.4, t)
        end = (s.CH1[0], s.CH1[1], s.CH1[2] + 0.02)
        rp = arc(end, (lib_top[0] + 0.06, lib_top[1], lib_top[2] + 0.002), v, 0.06) if v > 0.0 else lerp((s.CH0[0], s.CH0[1], s.CH0[2] + 0.02), end, u)
        rrot = (0.3 * (1.0 - v), math.radians(-42.7) * (1.0 - v), 0.0)
    else:                                                                          # 13: held up beside the open files
        u = ss(T_OPENS + 0.1, T_OPENS + 0.7, t)
        rp = arc((lib_top[0] + 0.06, lib_top[1], lib_top[2] + 0.002), s.REPORT_UP, u, 0.05)
        rrot = ((math.pi / 2 - 0.12) * u, 0.0, 0.0)
    s.report.location, s.report.rotation_euler = rp, rrot
    scale(s.report, pop(t, T_DONE + 0.3, 0.2) * (1.0 - ss(T_COLUMN - 0.3, T_COLUMN + 0.1, t)))
    kit.show(s.report, T_DONE + 0.3 < t < T_COLUMN + 0.1)
    s.report_red.hide_render = t < T_OPENS + 4.6 or t > T_COLUMN + 0.1
    down = ss(T_DONE + 1.45, t_bar, t) ** 2
    s.bar.location = W(-1.5, FRONT + 0.17, 1.16 + 0.9 * (1.0 - down) + 0.03 * hit(t, t_bar, 8.0) * math.sin((t - t_bar) * 40.0))
    s.bar.hide_render = not (T_DONE + 1.4 < t < T_RULING - 0.15)
    scale(s.chute, pop(t, T_DONE + 2.2, 0.25))
    kit.show(s.chute, T_DONE + 2.2 < t < T_RULING - 0.15)
    for i, c in enumerate(s.bench):
        got = ss(T_REST + (1.5, 4.1, 5.3)[i], T_REST + (1.9, 4.5, 5.7)[i], t)
        size = ss(lit_at(("bench_a", "bench_b", "bench_c")[i]), lit_at(("bench_a", "bench_b", "bench_c")[i]) + 0.3, t)
        lean = (0.24 * got * (0.7 + 0.3 * math.sin(t * 1.7 + i * 2.1)), 0.0)
        if i == 0:                                                                 # 20: cut off, and back: the same one
            size *= 1.0 - ss(T_SAME + 1.5, T_SAME + 1.7, t) * (1.0 - ss(T_SAME + 2.7, T_SAME + 2.9, t))
            size *= 1.0 + 0.6 * hit(t, T_SAME + 2.9, 4.0)
            p = s.BENCH[0]
        elif i == 1:                                                               # the one who made the report; later, the one that was lost
            u = ss(T_COLUMN - 0.5, T_COLUMN + 1.3, t) - ss(T_TIME - 0.2, T_TIME + 1.6, t)
            p = via_front(s.BENCH[1], s.MAKER, u, 0.06) if u > 0.0 else s.BENCH[1]
            reach = ss(T_RULE + 1.5, T_RULE + 2.4, t) * (1.0 - ss(T_RULE + 2.9, T_RULE + 3.3, t))
            lean = (lean[0] * (1.0 - u) + 0.42 * reach - 0.10 * ss(T_RULE + 3.0, T_RULE + 3.6, t) * u, 0.10 * reach)
            size *= (1.0 - 0.3 * ss(T_RULE + 2.9, T_RULE + 3.4, t) * u) * (1.0 - ss(T_MONTHS + 0.7, T_MONTHS + 0.9, t))
            c.root.scale = (max(0.001, 1.0 - ss(T_NOTES + 0.2, T_NOTES + 0.8, t)),) * 3
        else:
            p = s.BENCH[2]
        c.root.location = (p[0], p[1], p[2] + bounce(t, T_REST + 5.5 + 0.35 * i, 0.05, 0.25))
        c.set(t, size=size, lean=lean)

    # =========================================================== 12: his ruling: a page passed along three candles
    kit.show(s.plank, strip_shot)
    s.plank.scale = (1.25 * ss(T_RULING - 0.1, T_RULING + 0.5, t), 0.24, 0.02)
    for i, c in enumerate(s.strip):
        t_in = T_RULING + 0.75 + 0.16 * i
        c.root.location = (s.STRIP[i][0], s.STRIP[i][1], s.STRIP[i][2] + 0.7 * (1.0 - ss(t_in - 0.3, t_in, t)) ** 2)
        kit.squash(c.root, land(t, t_in, 0.3), turn=0.0)
        t_got = T_RULING + 1.9 + 1.2 * i
        tell = ss(t_got + 0.5, t_got + 0.9, t) * (1.0 - ss(t_got + 1.2, t_got + 1.6, t)) if i < 2 else 0.0
        flinch = ss(T_RULING + 5.0, T_RULING + 5.2, t) if i == 2 else 0.0
        c.set(t, size=(1.0 - 0.35 * flinch) if strip_shot else 0.0, lean=(0.34 * tell + 0.12 * hit(t, t_got, 5.0), 0.12))
        kit.show(c.root, strip_shot and t > t_in - 0.3)
    for i, (root, word) in enumerate(s.copies):
        t_go = T_RULING + 1.4 + 1.2 * i
        frm = (s.RULE_AT[0] + 0.10, s.RULE_AT[1], 0.36) if i == 0 else s.COPY[i - 1]
        u = ss(t_go, t_go + 0.5, t)
        root.location = arc(frm, s.COPY[i], u, 0.16)
        stand(root, 0.22, 0.5 * math.sin(math.pi * u))
        scale(root, pop(t, t_go, 0.15) * (1.0 + 0.10 * hit(t, t_go + 0.5, 6.0)))
        kit.show(root, strip_shot and t > t_go)
        if word:
            word.hide_render = t < T_RULING + 5.0
            word.scale = (word.scale[0], word.scale[1], 0.0006 * (1.0 + 2.0 * hit(t, T_RULING + 5.0, 5.0)))

    # =========================================================== 13: the files opened in a row; the report against them
    in_check = T_OPENS - 0.15 <= t < T_COLUMN + 0.1
    gone = 1.0 - ss(T_COLUMN - 0.3, T_COLUMN + 0.1, t)
    for i, ((root, lm), ck) in enumerate(zip(s.files, s.checks)):
        t_open = T_OPENS + 0.5 + 0.28 * i
        o = pop(t, t_open, 0.22, 0.5) * gone
        root.scale = (max(0.001, o), max(0.001, min(1.0, o * 2.0)), max(0.001, min(1.0, o * 2.0)))
        kit.show(root, in_check and t > t_open)
        t_ck = T_OPENS + 1.9 + 0.75 * i if i < 2 else T_OPENS + 3.7
        fails = ss(T_OPENS + 4.6, T_OPENS + 4.8, t) if i == 2 else 0.0
        ck.set(grow=ss(t_ck, t_ck + 0.4, t) if in_check and gone >= 1.0 else 0.0, glow=1.0 - fails)
        emit(lm, 2.2 * ss(t_ck + 0.35, t_ck + 0.5, t) * (1.0 + 0.6 * hit(t, t_ck + 0.5, 4.0)) * (1.0 - fails))
    fu = ss(T_OPENS + 5.4, T_OPENS + 5.75, t)
    s.flag.scale = (1.0, 1.0, max(0.001, fu * (1.0 + 0.3 * hit(t, T_OPENS + 5.75, 7.0) * math.cos((t - T_OPENS - 5.75) * 24.0))))
    kit.show(s.flag, T_OPENS + 5.4 < t < T_TIME + 1.0)

    # =========================================================== 14 to 17: the ledger, the pen, 2, then 74
    la = h.ledger_at
    roll = ss(T_COLUMN + 0.3, T_COLUMN + 0.9, t) * (1.0 + 0.06 * hit(t, T_COLUMN + 0.9, 7.0) * math.sin((t - T_COLUMN - 0.9) * 26.0))
    if k.changed("ledger", round(roll, 3)):
        s.ledger.scale = (0.56, 0.008, max(0.001, 0.34 * roll))
        s.ledger.location = (s.LEDGER_HOME[0], s.LEDGER_HOME[1], s.LEDGER_HOME[2] + 0.17 * (1.0 - roll))
    s.ledger.hide_render = t < T_COLUMN + 0.3
    s.ledger_rule.hide_render = t < T_COLUMN + 0.9

    def tick_at(n):
        c, r = divmod(max(0, n), 10)
        return W(la[0] - 0.105 + c * 0.045 + 0.012, la[1] - 0.03, la[2] + 0.13 - r * 0.029 - 0.004)
    n = (0 if t < T_RULE + 4.4 else 1 if t < T_TWO + 0.6 else 2) + round(72 * ss(T_74 + 0.45, T_74 + 2.3, t))
    h.ticks(n)
    lying = (s.MAKER[0] + 0.15, s.MAKER[1] - 0.07, s.MAKER[2] + 0.012)
    taken = (s.FINDER[0] - 0.11, s.FINDER[1] - 0.07, s.FINDER[2] + 0.012)
    if t < T_RULE + 3.5:
        slide = ss(T_RULE + 2.45, T_RULE + 2.8, t)
        pp = lerp(lying, taken, slide)
        pp = (pp[0], pp[1], pp[2] + 0.35 * (1.0 - ss(T_RULE + 0.4, T_RULE + 0.75, t)) ** 2 + 0.03 * hit(t, T_RULE + 0.75, 8.0))
        prot = (0.0, math.pi / 2 + 0.5 * hit(t, T_RULE + 2.8, 5.0) * math.sin((t - T_RULE) * 20.0), 0.0)
    else:
        u = ss(T_RULE + 3.5, T_RULE + 4.2, t)
        wr = tick_at(n if t > T_74 else (0 if t < T_TWO else 1))
        jot = 0.006 * math.sin(t * 42.0) * (hit(t, T_RULE + 4.3, 3.0) + hit(t, T_TWO + 0.5, 3.0) + (1.0 if T_74 + 0.45 < t < T_74 + 2.3 else 0.0))
        pp = lerp(taken, (wr[0] + jot, wr[1], wr[2] + abs(jot)), u)
        prot = (0.0, lerp(math.pi / 2, 0.45, u), 0.0)
    s.pen.location, s.pen.rotation_euler = pp, prot
    kit.show(s.pen, T_RULE + 0.4 < t < T_TIME + 1.0)
    s.txt_n.data.body = str(max(2, n))
    scale(s.txt_n, pop(t, T_TWO + 1.0, 0.18, 0.5) * (1.0 + 0.35 * hit(t, T_74 + 2.3, 5.0)))
    s.txt_n.hide_render = not (T_TWO + 1.0 < t < T_TIME + 1.0)
    scale(s.cal, pop(t, T_74 + 0.1, 0.2))
    kit.show(s.cal, T_74 + 0.1 < t < T_TIME + 1.0)
    for i, leaf in enumerate(s.cal_leaves):
        flip(leaf, ss(T_74 + 0.45 + i * 0.125, T_74 + 0.63 + i * 0.125, t))

    # =========================================================== 18, 19: the hall clock; the slips; the guess, and x2
    back = ss(T_TIME + 0.5, T_TIME + 0.75, t)
    s.me.set(t, size=ss(lit_at("hall"), lit_at("hall") + 0.3, t) * (1.0 - ss(T_74, T_74 + 0.3, t) * (1.0 - back)) * (1.0 + 0.7 * hit(t, T_TIME + 0.75, 4.0)),
             lean=(0.20 * ss(T_TIME + 2.9, T_TIME + 3.3, t) + 0.10 * ss(T_DOUBLE + 0.2, T_DOUBLE + 0.6, t), 0.25 * ss(T_TIME + 1.0, T_TIME + 1.5, t)))
    kit.squash(s.me.root, land(t, T_TIME + 0.75, 0.16), turn=0.0)
    real = ss(T_TIME + 0.9, T_TIME + 2.0, t)
    h.clock(3.0 + 40.0 / 60.0 * real, 40.0 * real)
    for i, sl in enumerate(s.slips):
        t0 = T_TIME + 2.2 + 1.6 * i
        u = ss(t0, t0 + 0.7, t)
        sl.location = arc((s.CLOCK[0], s.CLOCK[1] - 0.02, s.CLOCK[2] - 0.10), s.SLIP[i], u, 0.04)
        stand(sl, 0.4, 0.8 * (1.0 - u))
        scale(sl, pop(t, t0, 0.15))
        kit.show(sl, t0 < t < T_SAME + 1.5)
    g = ss(T_DOUBLE + 0.3, T_DOUBLE + 0.9, t)
    in_double = T_DOUBLE + 0.3 < t < T_SAME + 1.5
    s.ghost.rotation_euler = (0, s.GUESS * g, 0)
    emit(s.ghost_mat, 1.6 * g)
    kit.show(s.ghost, in_double)
    s.arc_guess.set(grow=g if in_double else 0.0, glow=1.0)
    s.arc_real.set(grow=ss(T_DOUBLE + 1.1, T_DOUBLE + 1.8, t) if in_double else 0.0, glow=1.0 + 0.6 * hit(t, T_DOUBLE + 1.8, 4.0))
    scale(s.txt_x2, pop(t, T_DOUBLE + 2.0, 0.18, 0.6))
    s.txt_x2.hide_render = not (T_DOUBLE + 2.0 < t < T_SAME + 1.5)

    # =========================================================== 20 to 22: the thread through a candle
    out_a = ss(T_SAME + 1.5, T_SAME + 1.7, t) * (1.0 - ss(T_SAME + 2.7, T_SAME + 2.9, t))
    s.thread_a.set(grow=ss(T_SAME + 0.3, T_SAME + 1.0, t), glow=(1.0 - 0.55 * out_a) * (1.0 + 0.9 * hit(t, T_SAME + 2.9, 3.0)))
    tau = t - T_SAME - 0.6
    frac = (0.266 - 0.45 + 0.45 * min(max(tau, 0.0), 1.0) + 0.45 * max(0.0, tau - 2.25)) % 1.0
    s.bead.location = W(-0.97 + 0.94 * frac, 0.05, 1.192)
    s.bead.hide_render = not (T_SAME + 0.9 < t)
    was = t > T_MONTHS - 0.5
    snap = T_MONTHS + 1.0
    s.thread_l.set(grow=(1.0 - ss(snap, snap + 0.25, t)) if was else 0.0, glow=1.0 - 0.6 * ss(T_MONTHS + 0.7, T_MONTHS + 0.9, t))
    hang = ss(snap, snap + 0.5, t)
    tau = max(0.0, t - snap)
    s.thread_r.set(grow=lerp(1.0, 0.36, ss(snap, snap + 0.3, t)) if was else 0.0, glow=1.0 - 0.6 * ss(T_MONTHS + 0.7, T_MONTHS + 0.9, t) - 0.3 * hang)
    s.thread_r.ob.rotation_euler = (0, -1.22 * hang + 0.5 * math.exp(-tau * 1.6) * math.sin(tau * 7.0) * hang + 0.05 * math.sin(t * 1.9) * hang, 0)
    note_in = ss(T_NOTES + 0.6, T_NOTES + 1.1, t)
    s.note.location = (s.NOTE[0] - 0.5 * (1.0 - note_in), s.NOTE[1] - 0.3 * (1.0 - note_in), s.NOTE[2])
    kit.show(s.note, t > T_NOTES + 0.6)
    born = ss(T_NOTES + 1.5, T_NOTES + 1.9, t)
    scale(s.newcomer.root, born * (1.0 + 0.2 * hit(t, T_NOTES + 1.9, 7.0)))
    kit.show(s.newcomer.root, born > 0.0)
    catch = ss(T_NOTES + 2.2, T_NOTES + 2.7, t)
    s.note_spark.location = arc((s.NOTE[0], s.NOTE[1], s.NOTE[2] + 0.04), (s.NEW[0], s.NEW[1], s.NEW[2] + 0.15), catch, 0.10)
    s.note_spark.hide_render = not (0.0 < catch < 1.0)
    lit_new = ss(T_NOTES + 2.7, T_NOTES + 2.9, t)
    s.newcomer.set(t, size=lit_new * (1.0 + 0.6 * hit(t, T_NOTES + 2.9, 4.0)), lean=(-0.30 * ss(T_NOTES + 3.0, T_NOTES + 3.6, t), 0.0), tint=kit.PAPER, mix=0.5)

    # OUT: the house whole and running: pages cross between rooms by themselves
    for i, (pg, (a, b)) in enumerate(zip(s.auto, ((lib_top, s.CUT), (s.TRAYS[0], lib_top), (s.TRAYS[2], lib_top)))):
        start = T_NOTES + 3.8 + 0.4 * i
        ph = ((t - start) / (2.6 + 0.4 * i)) % 2.0
        u = ss(0.0, 0.8, ph) if ph < 1.0 else 1.0 - ss(1.0, 1.8, ph)
        pg.location = via_front((a[0] + 0.05, a[1] - 0.06, a[2] + 0.004 * (i + 2)), (b[0] - 0.12 + 0.07 * i, b[1] - 0.06, b[2] + 0.004 * (i + 2)), u, 0.08)
        pg.rotation_euler = (1.1 * math.sin(math.pi * u), 0, 0)
        kit.show(pg, t > start)

    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
