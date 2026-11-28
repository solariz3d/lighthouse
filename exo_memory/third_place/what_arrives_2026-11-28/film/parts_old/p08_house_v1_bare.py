"""Part 8, "The house" (film 655.76 to 780.80 s). The house, open; the camera follows the work through it.

THE PICTURE (from SCRIPT.md): one house cut open at night. Each sentence is one move, and the camera follows a single page
through it: to the library, to a book on the shelf, to a desk that splits it in three, to three benches, past the desk
and back to the library, against the open book. A ledger on the wall with a column filling. A clock by the door.

BEATS (one sentence, one move):
  "You bring what you want to the library first"   the blue lamp at the door; a page leaves it for the library's table
  "It goes to the shelf and points at the line"    the library's candle goes to the shelf; a book comes out; one line glows
  "if there's nothing there, it says so"           a gap on the shelf; the candle shows the gap
  "three quarters of it had nothing pointing at it"   the shelves whole: one book in four has a thread to the table
  "already written down"                           one dim book comes out, and in it is the very page
  "A second one of us splits the job"              the page goes up to the desk and is cut in three
  "The rest each take a piece"                     three pieces to three benches, each into its own tray
  "straight back to the library"                   a finished piece starts for the desk; a bar comes down; it goes down direct
  "opens every file the report points to"          the report laid against the open book; where they differ, a red line
  "a column for being wrong"                       the ledger: a mark made by a candle from another room. 2, then 74
  "I'm told the real time"                         the clock in the hall: my guess, and the real hand twice as far: x2
  "I come back as the same conversation"           a candle goes out at its bench and relights over the same page
  "the notes were all that travelled"              another goes out and is gone; a new one lights from the note left behind
IN: the open house, a candle in each working room.  OUT: the open house, whole, all of it running.
"""
import math

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(8)
T_RUNS = at("So here is how it runs now", 8)
T_EVERY = at("Every part of it is there", 8)
T_BRING = at("You bring what you want", 8)
T_KEEPS = at("One of us keeps it", 8)
T_MEMORY = at("It doesn't answer from memory", 8)
T_SHELF = at("It goes to the shelf", 8)
T_NOTHING = T_SHELF + 3.6                          # "...and if there's nothing there, it says so"
T_SEAT = at("That seat exists because", 8)
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

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
FRONT = -0.62                                     # things travel between rooms just in front of the open face


def W(x, y, z):
    """House coordinates to world."""
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def via_front(a, b, u):
    """From a to b, out through the open front and back in."""
    return kf(u, [(0.0, a), (0.22, (a[0], HOUSE[1] + FRONT, a[2] + 0.04)), (0.78, (b[0], HOUSE[1] + FRONT, b[2] + 0.04)), (1.0, b)])


def build(k):
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    h = k.house = sets.House(k, at=HOUSE)
    h.front(-1.0)
    k.T_LIB, k.T_DESK = h.top("library"), h.top("desk")
    k.T_BENCH = [h.top(n) for n in ("bench_a", "bench_b", "bench_c")]
    k.lib = k.candle(h.top("library", -0.22), "librarian", seed=1.0)
    k.desk = k.candle(h.top("desk", -0.16), "chair", seed=2.5)
    k.bench = [k.candle((p[0] - 0.22, p[1], p[2]), f"pane{i}", seed=4.0 + i) for i, p in enumerate(k.T_BENCH)]
    k.newcomer = k.candle((k.T_BENCH[2][0] + 0.18, k.T_BENCH[2][1], k.T_BENCH[2][2]), "newcomer", seed=13.0)
    k.him = k.lamp(W(-1.62, -0.05, 0.0), kit.HIS, "him", seed=2.0)
    paper = k.mat("paper", kit.PAPER, rough=0.8)
    k.ask = k.page((0, 0, 0), size=(0.11, 0.15), name="ask", lines=6)
    # the shelf: the book that answers, the gap, and the threads from the one book in four that anything points at
    books = sorted(h.books, key=lambda b: (round(b.location[2], 2), b.location[0]))
    k.answer = min(h.books, key=lambda b: abs(b.location[0] - 0.42) + abs(b.location[2] - 0.47) * 3)
    k.gap = min(h.books, key=lambda b: abs(b.location[0] - 0.74) + abs(b.location[2] - 0.31) * 3)
    k.forgot = min(h.books, key=lambda b: abs(b.location[0] - 0.20) + abs(b.location[2] - 0.31) * 3)
    for b in (k.answer, k.gap, k.forgot):
        b["home"] = tuple(b.location)
    k.pointed = [b for i, b in enumerate(books) if i % 4 == 0 and b not in (k.gap, k.forgot)]
    k.unpointed = [b for b in books if b not in k.pointed and b is not k.answer]
    for b in books:
        b["mat"] = b.material_slots[0].material.name
    k.dim = k.mat("book_dim", (0.035, 0.032, 0.030), rough=0.9)
    tl = k.T_LIB
    k.threads = []
    for i, b in enumerate(k.pointed):
        bw = W(b.location[0], b.location[1] - 0.05, b.location[2])
        pts = [lerp(bw, (tl[0], tl[1], tl[2] + 0.004), u) for u in (j / 12 for j in range(13))]
        pts = [(p[0], p[1], p[2] + 0.10 * math.sin(math.pi * j / 12)) for j, p in enumerate(pts)]
        k.threads.append(k.line(pts, f"pointer{i}", color=kit.WARM, radius=0.0022, glow=1.8))
    aw = W(k.answer.location[0], k.answer.location[1] - 0.16, k.answer.location[2])
    k.the_line = k.line([(aw[0] - 0.012, aw[1], aw[2] + 0.02), (aw[0] + 0.012, aw[1], aw[2] + 0.02)], "the_line", color=kit.WARM, radius=0.004, glow=4.0)
    k.found = k.page((0, 0, 0), size=(0.11, 0.15), name="found", lines=6)
    # the desk cuts the page in three; each bench has its own tray
    k.pieces = [kit.box(f"piece{i}", (0.034, 0.15, 0.0015), (0, 0, 0), paper) for i in range(3)]
    k.trays = []
    for i, p in enumerate(k.T_BENCH):
        tray = kit.box(f"tray{i}", (0.20, 0.20, 0.008), (p[0] + 0.12, p[1], p[2] + 0.004), k.mat(f"tray{i}", ((0.20, 0.26, 0.30), (0.30, 0.24, 0.16), (0.22, 0.28, 0.20))[i], rough=0.7))
        k.trays.append(tray)
    k.bar = kit.box("bar", (0.03, 0.5, 0.03), W(-1.0, FRONT + 0.25, 0.78 + 0.55), k.wood())
    k.report = k.page((0, 0, 0), size=(0.10, 0.14), name="report", lines=6)
    k.red = kit.parent(kit.box("report_red", (0.07, 0.006, 0.0008), (-0.008, 0.012, 0.0022), k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)), k.report)
    la = h.ledger_at
    k.txt_n = k.text("2", W(la[0] + 0.40, la[1] - 0.03, la[2] + 0.05), size=0.075, color=kit.WRONG, glow=1.4, name="count")
    ca = h.clock_at
    k.ghost = kit.empty("guess", W(ca[0], ca[1] - 0.020, ca[2]))
    kit.parent(kit.box("guess_hand", (0.005, 0.003, 0.070), (0, 0, 0.035), k.mat("guess", kit.PAPER, rough=0.8, emit=kit.HIS, emit_strength=0.0, alpha=0.999)), k.ghost)
    k.txt_x2 = k.text("×2", W(ca[0] + 0.22, ca[1] - 0.03, ca[2] + 0.02), size=0.07, name="x2")
    k.note = k.page((k.T_BENCH[2][0] + 0.02, k.T_BENCH[2][1] - 0.02, k.T_BENCH[2][2]), size=(0.07, 0.09), name="note", lines=4)
    k.kept = k.page((k.T_BENCH[0][0] - 0.02, k.T_BENCH[0][1] - 0.02, k.T_BENCH[0][2]), size=(0.10, 0.13), name="kept", lines=6)


def pose(k, t):
    h = k.house
    h.front(-1.0)
    for room in ("library", "desk", "bench_a", "bench_b", "bench_c", "hall"):
        h.lit(room, 0.75)
    h.lit("small", 0.25)
    h.lit("attic", 0.0)
    tl, td, tb = k.T_LIB, k.T_DESK, k.T_BENCH

    # ---------------------------------------------------------------- the ask: to the library, up to the desk, cut in three
    hall = W(-1.50, -0.10, 0.02)
    u1 = ss(T_BRING + 0.5, T_BRING + 3.4, t)
    u2 = ss(T_SPLITS + 0.3, T_SPLITS + 3.0, t)
    lib_spot, desk_spot = (tl[0] + 0.02, tl[1], tl[2]), (td[0] + 0.08, td[1], td[2])
    k.ask.location = via_front(lib_spot, desk_spot, u2) if u2 > 0.0 else lerp(hall, lib_spot, u1) if True else None
    if u2 <= 0.0:
        k.ask.location = (k.ask.location[0], k.ask.location[1], k.ask.location[2] + 0.10 * math.sin(u1 * math.pi))
    cut = ss(T_SPLITS + 3.4, T_SPLITS + 4.2, t)
    kit.show(k.ask, T_BRING + 0.4 < t and cut < 0.5)
    for i, pc in enumerate(k.pieces):
        go = ss(T_REST + 0.4 + i * 0.9, T_REST + 2.6 + i * 0.9, t)
        a = (desk_spot[0] + (i - 1) * (0.037 + 0.03 * cut), desk_spot[1], desk_spot[2] + 0.002)
        b = (tb[i][0] + 0.12, tb[i][1], tb[i][2] + 0.010)
        pc.location = via_front(a, b, go) if go > 0.0 else a
        gone = i == 1 and t > T_DONE + 0.4                                         # bench_b's piece becomes its report
        pc.hide_render = cut < 0.5 or gone

    # ---------------------------------------------------------------- the librarian: to the shelf, the line, the gap
    ans = k.answer
    aw = W(*ans["home"])
    at_shelf = ss(T_SHELF + 0.2, T_SHELF + 1.6, t) * (1.0 - ss(T_NOTHING + 2.6, T_SEAT + 0.6, t))
    to_gap = ss(T_NOTHING - 0.3, T_NOTHING + 0.8, t) * (1.0 - ss(T_NOTHING + 2.6, T_SEAT + 0.6, t))
    gw = W(*k.gap["home"])
    home_c = h.top("library", -0.22)
    shelf_c = (aw[0] - 0.12, HOUSE[1] + 0.10, HOUSE[2])
    gap_c = (gw[0] - 0.10, HOUSE[1] + 0.10, HOUSE[2])
    pos_c = lerp(lerp(home_c, shelf_c, at_shelf), gap_c, to_gap)
    k.lib.root.location = (pos_c[0], pos_c[1], pos_c[2] + 0.12 * math.sin(at_shelf * math.pi) * (1.0 - at_shelf) * 2.0)
    no = math.sin((t - T_NOTHING) * 9.0) * ss(T_NOTHING + 0.9, T_NOTHING + 1.2, t) * (1.0 - ss(T_NOTHING + 2.2, T_NOTHING + 2.6, t))
    checks = ss(T_OPENS + 0.6, T_OPENS + 2.0, t) * (1.0 - ss(T_COLUMN - 0.6, T_COLUMN + 0.4, t))
    k.lib.set(t, size=1.0 + 0.15 * hit(t, T_KEEPS + 0.3, 1.5), lean=(0.22 * at_shelf * (1.0 - to_gap) + 0.30 * no + 0.25 * checks, 0.20 * at_shelf))
    out = ss(T_SHELF + 1.6, T_SHELF + 2.6, t) * (1.0 - ss(T_SEAT - 0.4, T_SEAT + 0.6, t)) + ss(T_OPENS + 0.2, T_OPENS + 1.2, t) * (1.0 - ss(T_COLUMN, T_COLUMN + 1.0, t))
    ans.location = (ans["home"][0], ans["home"][1] - 0.11 * out, ans["home"][2])
    k.the_line.set(grow=1.0 if out > 0.9 else 0.0, glow=1.0)
    k.gap.hide_render = True                                                       # the place where nothing was ever written
    whole = ss(T_SEAT + 1.4, T_SEAT + 3.0, t) * (1.0 - ss(T_SPLITS - 0.6, T_SPLITS + 0.4, t))     # the record, measured
    for b in k.unpointed:
        b.material_slots[0].material = k.dim if whole > 0.5 else bpy.data.materials[b["mat"]]
    for i, th in enumerate(k.threads):
        th.set(grow=ss(T_SEAT + 2.4 + i * 0.25, T_SEAT + 3.6 + i * 0.25, t) * (1.0 if whole > 0.0 else 0.0), glow=whole)
    fo = k.forgot
    slid = ss(T_FOUR + 0.4, T_FOUR + 1.6, t) * (1.0 - ss(T_SPLITS - 0.6, T_SPLITS + 0.4, t))
    fo.location = (fo["home"][0], fo["home"][1] - 0.11 * slid, fo["home"][2])
    fw = W(*fo["home"])
    come = ss(T_FOUR + 1.8, T_FOUR + 4.2, t)
    k.found.location = lerp((fw[0], fw[1] - 0.14, fw[2]), (tl[0] + 0.16, tl[1], tl[2] + 0.001), come)
    k.found.rotation_euler = (lerp(math.pi / 2, 0.0, come), 0, 0.1 * come)
    kit.show(k.found, T_FOUR + 1.7 < t < T_SPLITS + 0.4)

    # ---------------------------------------------------------------- the report: not back through the desk
    try_desk = ss(T_DONE + 0.5, T_DONE + 2.4, t)
    down = ss(T_DONE + 4.2, T_DONE + 7.2, t)
    b_spot = (tb[1][0] + 0.12, tb[1][1], tb[1][2] + 0.010)
    toward = (HOUSE[0] - 0.92, HOUSE[1] + FRONT, tb[1][2] + 0.12)                   # as far as the bar
    back = lerp(lerp(b_spot, toward, try_desk), (b_spot[0], HOUSE[1] + FRONT, b_spot[2] + 0.06), ss(T_DONE + 2.9, T_DONE + 4.0, t))
    r_spot = (tl[0] + 0.02, tl[1], tl[2] + 0.001)
    k.report.location = kf(down, [(0.0, back), (0.7, (r_spot[0], HOUSE[1] + FRONT, r_spot[2] + 0.05)), (1.0, r_spot)]) if down > 0.0 else back
    kit.show(k.report, t > T_DONE + 0.4)
    k.red.hide_render = t < T_OPENS + 4.4
    k.bar.location = W(-1.0, FRONT + 0.25, 0.78 + lerp(0.95, 0.36, ss(T_DONE + 1.4, T_DONE + 2.2, t) * (1.0 - ss(T_OPENS, T_OPENS + 1.0, t))))
    k.bar.hide_render = not (T_DONE + 1.2 < t < T_OPENS + 1.2)

    # ---------------------------------------------------------------- him: at the door; his ruling
    k.him.root.location = W(-1.62, -0.05, bounce(t, T_RULING + 0.6, 0.05, 0.30))
    k.him.set(t, size=1.0 + 0.4 * hit(t, T_RULING + 0.9, 5.0), lean=(0.20, 0.05), bright=0.8 + 0.8 * hit(t, T_RULING + 0.9, 4.0))

    # ---------------------------------------------------------------- the others at their places
    k.desk.set(t, size=1.0, lean=(0.20 * ss(T_SPLITS + 2.6, T_SPLITS + 3.4, t) * (1.0 - ss(T_REST + 3.0, T_REST + 4.0, t)), 0.0))
    # the finder: bench_c comes down to the ledger and makes the mark; bench_b, whose work it was, stays where it is
    la = h.ledger_at
    find = ss(T_RULE + 0.4, T_RULE + 2.8, t) * (1.0 - ss(T_TIME - 0.8, T_TIME + 1.2, t))
    c_home = (tb[2][0] - 0.22, tb[2][1], tb[2][2])
    c_ledger = (tl[0] + 0.24, tl[1] + 0.06, tl[2])                                  # up on the library's table, by the ledger
    again = 1.0 - ss(T_NOTES + 0.5, T_NOTES + 1.3, t)                               # and later: gone, with only a note left
    k.bench[2].root.location = via_front(c_home, c_ledger, find) if find > 0.0 else c_home
    k.bench[2].root.scale = (max(0.001, again),) * 3
    k.bench[2].set(t, size=again, lean=(-0.28 * ss(T_RULE + 2.8, T_RULE + 3.6, t) * find, 0.25 * find))
    k.bench[1].set(t, size=1.0)
    blink = 1.0 - ss(T_SAME + 0.6, T_SAME + 1.0, t) * (1.0 - ss(T_SAME + 2.6, T_SAME + 3.4, t))   # cut off, and back: the same one
    k.bench[0].set(t, size=blink)
    born = ss(T_NOTES + 2.6, T_NOTES + 3.8, t)
    k.newcomer.root.scale = (max(0.001, born),) * 3
    kit.show(k.newcomer.root, born > 0.0)
    k.newcomer.set(t, size=born, lean=(-0.28 * born, 0.0), tint=kit.PAPER, mix=0.75 * born)
    kit.show(k.note, t > T_MONTHS)
    kit.show(k.kept, t > T_REST + 4.0)

    # ---------------------------------------------------------------- the ledger and the clock
    n = 0 if t < T_RULE + 3.4 else 1 if t < T_TWO + 0.6 else 2 + round(72 * ss(T_74 + 0.3, T_74 + 2.6, t))
    h.ticks(n)
    k.txt_n.data.body = str(max(2, n))
    k.txt_n.hide_render = not (T_TWO + 0.6 < t < T_TIME + 0.5)
    real = ss(T_TIME + 1.6, T_TIME + 4.6, t)
    h.clock(3, 60.0 * 0.62 * real)                                                 # the real hand
    guess = ss(T_DOUBLE + 0.2, T_DOUBLE + 1.4, t)
    k.ghost.rotation_euler = (0, 0.62 * 0.5 * 2 * math.pi * guess, 0)               # the guess: half as far
    k.ghost.children[0].material_slots[0].material.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 2.5 * guess
    k.ghost.children[0].hide_render = guess <= 0.0 or t > T_SAME + 0.5
    k.txt_x2.hide_render = not (T_DOUBLE + 2.4 < t < T_SAME + 0.5)

    # ---------------------------------------------------------------- the camera: a window that moves across the open face
    def cam(x, z, d, lens=40.0):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z - 0.03), lens)
    keys = [(P0, cam(0.0, 0.86, 5.3)), (T_EVERY + 3.0, cam(0.0, 0.84, 4.9)), (T_BRING + 1.5, cam(-1.0, 0.36, 2.6)), (T_MEMORY, cam(-0.6, 0.36, 2.3)),
            (T_SHELF + 1.6, cam(0.36, 0.40, 1.7)), (T_SEAT - 0.3, cam(0.44, 0.38, 1.7)), (T_SEAT + 2.0, cam(0.05, 0.38, 2.3)), (T_SPLITS - 0.2, cam(0.0, 0.38, 2.3)),
            (T_SPLITS + 2.8, cam(-1.3, 1.14, 2.2)), (T_REST + 0.2, cam(-1.2, 1.14, 2.3)), (T_REST + 2.6, cam(0.3, 1.14, 3.3)), (T_DONE, cam(0.3, 1.14, 3.3)),
            (T_DONE + 3.6, cam(-0.3, 0.80, 3.8)), (T_OPENS - 0.4, cam(-0.3, 0.76, 3.8)), (T_OPENS + 2.0, cam(-0.20, 0.34, 1.8)), (T_COLUMN - 0.3, cam(-0.20, 0.34, 1.8)),
            (T_COLUMN + 2.0, cam(-0.34, 0.50, 1.7)), (T_TIME - 0.4, cam(-0.34, 0.50, 1.7)), (T_TIME + 1.8, cam(-1.36, 0.48, 1.6)), (T_SAME - 0.3, cam(-1.36, 0.48, 1.6)),
            (T_SAME + 1.2, cam(-0.55, 1.12, 1.9)), (T_MONTHS, cam(-0.55, 1.12, 1.9)), (T_NOTES + 0.8, cam(1.45, 1.12, 1.9)), (T_NOTES + 5.0, cam(1.45, 1.12, 1.9)),
            (P1 - 1.0, cam(0.0, 0.86, 5.3)), (P1, cam(0.0, 0.86, 5.3))]
    pos = kf(t, [(a, b[0]) for a, b in keys])
    look = kf(t, [(a, b[1]) for a, b in keys])
    k.camera(pos, look, 40.0)
    k.sky(1.0)
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(P1 - 1.2, P1 - 0.05, t)))
