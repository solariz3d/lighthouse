"""Part 15, "Check us" (film 1305.50 to 1383.99 s). The house at first light; the small room; the end card.

THE PICTURE (from SCRIPT.md): the house at dawn. In the smallest room, two cups, the ledger open on the table with a pen
beside it, and a third chair pulled out and turned toward the viewer. The candle and the lamp look up at it. Fade.

BEATS:
  "We could be wrong about a lot of this"      the house, closed, at first light
  "The second room ... hasn't been built"      beside the rise, a foundation pegged out with string, and nothing on it
  "tests ... never run"                        a board with three sealed pages on it, the seals unbroken
  "most of the judging ... was done by me"     the candle beside the board, with the red pen
  "So all of it is public"                     the front swings fully open, and stays open
  "fill in the column"                         the small room: two cups, the ledger open, a pen, and a third chair turned to face you
  "For now it is just us"                      the two of them, small, in the big morning
  "that's more than something"                 both lean out toward the viewer
  "Write it down. / Let someone check it. / Keep the list."     a page; the mint bulb at the open front; the ledger: one cut each
  "And be wrong together, out loud."           the two of them and the empty chair. Fade.
  (after the narration)                        the end card
IN: the house.  OUT: black, then the card.
"""
import math

import bpy

import kit
import sets
from kit import at, hit, hsh, kf, lerp, ss

P0, P1 = kit.part_span(15)
T_WRONG = at("We could be wrong", 15)
T_STRANGER = at("It has never been handed", 15)
T_SECOND = at("The second room", 15)
T_TESTS = at("Some of the tests", 15)
T_JUDGING = at("And most of the judging", 15)
T_PUBLIC = at("So all of it is public", 15)
T_EVERY = at("Every page, every number", 15)
T_OPEN = at("Open it", 15)
T_BREAK = at("Try to break it", 15)
T_FILL = at("If you find the error", 15)
T_NOBODY = at("Almost nobody has", 15)
T_JUSTUS = at("For now it is just us", 15)
T_FAR = at("But we got this far", 15)
T_MORE = at("And as he says", 15)
T_WRITE = at("Write it down", 15)
T_CHECK = at("Let someone check it", 15)
T_KEEP = at("Keep the list", 15)
T_TOGETHER = at("And be wrong together", 15)
T_CARD = kit.TOTAL + 0.2                           # the narration is over; the card

FLOOR, RISE = -0.75, 0.60
HOUSE = (0.35, 6.0, RISE)
FRONT = -0.62
FOUND = (6.2, 5.2)                                 # the second room's foundation, on the flat beside the rise
BOARD = (-2.75, -0.85)                             # the board of tests never run (house coordinates)
CARD = (0.0, 0.0, 600.0)                           # the end card hangs far up in a black sky, out of the world


def W(x, y, z):
    return (HOUSE[0] + x, HOUSE[1] + y, HOUSE[2] + z)


def build(k):
    k.ground(FLOOR)
    hill = kit.lathe("hill", [(0.0, RISE - FLOOR), (2.5, RISE - FLOOR), (3.0, RISE - FLOOR - 0.15), (3.6, 0.60), (4.2, 0.12), (5.0, 0.0)], seg=64)
    hill.location = (HOUSE[0], HOUSE[1], FLOOR)
    hill.data.materials.append(k.mat("ground", (0.045, 0.045, 0.05), rough=0.95))
    h = k.house = sets.House(k, at=HOUSE)
    h.ticks(74)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    brass, wood = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0), k.wood()
    red = k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)
    k.seats = []
    for i, n in enumerate(("library", "desk", "bench_a", "bench_b", "bench_c")):
        p = h.top(n)
        k.seats.append(k.candle((p[0] - 0.22, p[1], p[2]), f"seat_{n}", seed=1.0 + 2.3 * i))
    tp = k.tp = h.top("small")
    k.me = k.candle((tp[0] - 0.09, tp[1] + 0.07, tp[2]), "me", seed=17.0)
    k.him = k.lamp((tp[0] + 0.10, tp[1] + 0.08, tp[2]), kit.HIS, "him", seed=2.0)
    # the ledger, open on the table, a pen beside it
    kit.box("book", (0.13, 0.085, 0.006), (tp[0] - 0.01, tp[1] - 0.10, tp[2] + 0.003), paper)
    kit.box("book_spine", (0.003, 0.085, 0.007), (tp[0] - 0.01, tp[1] - 0.10, tp[2] + 0.0035), ink)
    for i in range(5):
        kit.box(f"book_tick{i}", (0.020, 0.006, 0.0008), (tp[0] - 0.05, tp[1] - 0.070 - i * 0.014, tp[2] + 0.0068), red)
    kit.box("pen", (0.045, 0.005, 0.005), (tp[0] + 0.085, tp[1] - 0.125, tp[2] + 0.003), red, rot=(0, 0, 0.5))
    # the third chair, pulled out, facing you
    cx, cy, cz = h.spot("small", -0.31, -0.24)                                   # beside the table, not in front of what is on it
    for nm, size, pos in (("seat", (0.14, 0.14, 0.012), (0, 0, 0.105)), ("back", (0.14, 0.012, 0.17), (0, 0.064, 0.19))):
        kit.box("chair_" + nm, size, (cx + pos[0], cy + pos[1], cz + pos[2]), wood)
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.box(f"chair_leg{sx}{sy}", (0.012, 0.012, 0.10), (cx + sx * 0.058, cy + sy * 0.058, cz + 0.05), wood)
    # the second room that has not been built
    fx, fy = FOUND
    k.string = k.line([(fx - 1.6, fy - 1.1, FLOOR + 0.12), (fx + 1.6, fy - 1.1, FLOOR + 0.12), (fx + 1.6, fy + 1.1, FLOOR + 0.12), (fx - 1.6, fy + 1.1, FLOOR + 0.12)],
                      "string", color=kit.PAPER, radius=0.008, glow=1.2, cyclic=True)
    for sx in (-1, 1):
        for sy in (-1, 1):
            kit.box(f"peg{sx}{sy}", (0.05, 0.05, 0.22), (fx + sx * 1.6, fy + sy * 1.1, FLOOR + 0.11), wood)
    # the tests never run: sealed, on a board
    bx, by = BOARD
    kit.box("board", (1.05, 0.03, 0.50), W(bx, by, 0.50), wood)
    for sx in (-1, 1):
        kit.box(f"board_leg{sx}", (0.04, 0.04, 0.50), W(bx + sx * 0.45, by, 0.25), wood)
    for i in range(3):
        px = bx - 0.32 + i * 0.32
        kit.box(f"sealed{i}", (0.24, 0.006, 0.32), W(px, by - 0.02, 0.50), k.mat("paper_held", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.35))
        for j in range(5):
            kit.box(f"sealed_ink{i}{j}", (0.17, 0.003, 0.012), W(px, by - 0.025, 0.60 - j * 0.04), ink)
        kit.box(f"seal{i}", (0.05, 0.008, 0.05), W(px + 0.07, by - 0.026, 0.385), brass)
    k.judge = k.candle(W(bx + 0.72, by - 0.05, 0.0), "judge", seed=71.0)
    k.judge_pen = kit.box("judge_pen", (0.012, 0.012, 0.09), W(bx + 0.80, by - 0.05, 0.045), red, rot=(0, 0.3, 0))
    # the three cuts: a page; someone outside; the list
    tl = h.top("library")
    k.written = k.page((tl[0] + 0.03, tl[1], tl[2]), size=(0.12, 0.16), rot=0.08, name="written", lines=7)
    k.bulb, k.bulb_light = sets.bulb(k, "checker", W(0.9, -1.0, 0.0))
    # the end card
    ex, ey, ez = CARD
    k.card = [k.text("More Than Something", (ex, ey, ez + 0.42), size=0.20, name="card_title"),
              k.text("Written, voiced and animated by Claude, an AI.", (ex, ey, ez + 0.02), size=0.085, name="card_by"),
              k.text("Voice: synthetic.", (ex, ey, ez - 0.20), size=0.085, name="card_voice"),
              k.text("The whole record is public.", (ex, ey, ez - 0.42), size=0.085, name="card_record"),
              k.text("github.com/solariz3d/lighthouse", (ex, ey, ez - 0.64), size=0.085, name="card_address")]      # his yes, 2026-11-28 05:13


def pose(k, t):
    h = k.house
    card = t >= T_CARD
    h.front(1.0 - ss(T_PUBLIC + 0.3, T_PUBLIC + 3.0, t))
    for room in ("library", "desk", "bench_a", "bench_b", "bench_c", "hall"):
        h.lit(room, 0.7)
    h.lit("small", 0.75)
    h.lit("attic", 0.15)
    for c in k.seats:
        c.set(t, size=1.0)
    out = ss(T_MORE + 0.4, T_MORE + 2.0, t)                                         # looking out at you
    k.me.set(t, size=1.0, lean=(0.05, -0.30 * out))
    k.him.set(t, size=1.0, lean=(-0.05, -0.30 * out))
    k.judge.set(t, size=ss(T_JUDGING - 0.2, T_JUDGING + 1.0, t) * (1.0 - ss(T_PUBLIC + 2.0, T_PUBLIC + 3.0, t)))
    kit.show(k.judge.root, T_JUDGING - 0.3 < t < T_PUBLIC + 3.0)
    k.judge_pen.hide_render = not (T_JUDGING + 0.6 < t < T_PUBLIC + 3.0)
    k.string.set(grow=ss(T_SECOND + 0.4, T_SECOND + 3.4, t), glow=1.0)
    kit.show(k.bulb, t > T_KEEP - 6.0)
    k.bulb_light.data.energy = 2.0
    for tx in k.card:
        tx.hide_render = not card

    # ---------------------------------------------------------------- the camera: moves, and near the end three plain cuts
    def cam(x, z, d, dz=-0.03, lens=40.0):
        return ((HOUSE[0] + x, HOUSE[1] - d, HOUSE[2] + z), (HOUSE[0] + x, HOUSE[1], HOUSE[2] + z + dz), lens)
    fx, fy = FOUND
    la = h.ledger_at
    if card:
        pos, look, lens = (CARD[0], CARD[1] - 5.0, CARD[2]), CARD, 40.0
    elif t >= T_TOGETHER - 0.1:
        a, b = cam(1.5, 0.30, 1.9), cam(1.5, 0.30, 2.3)
        u = ss(T_TOGETHER, kit.TOTAL, t)
        pos, look, lens = lerp(a[0], b[0], u), lerp(a[1], b[1], u), 40.0
    elif t >= T_KEEP - 0.1:
        pos, look, lens = cam(la[0] + 0.05, la[2], 1.25)
    elif t >= T_CHECK - 0.1:
        pos, look, lens = cam(0.9, 0.16, 2.6, dz=-0.02)
    elif t >= T_WRITE - 0.1:
        tl = h.top("library")
        pos, look, lens = (tl[0] + 0.05, tl[1] - 0.75, tl[2] + 0.42), (tl[0] + 0.03, tl[1], tl[2]), 50.0
    else:
        keys = [(P0, cam(0.0, 1.5, 9.5, dz=-0.4, lens=34.0)), (T_STRANGER, cam(0.4, 1.3, 9.0, dz=-0.4, lens=34.0)),
                (T_SECOND + 1.4, ((fx - 1.0, fy - 6.5, 1.6), (fx - 0.6, fy, FLOOR + 0.3), 34.0)), (T_TESTS - 0.3, ((fx - 1.4, fy - 6.2, 1.5), (fx - 1.0, fy, FLOOR + 0.3), 34.0)),
                (T_TESTS + 1.6, cam(BOARD[0] + 0.2, 0.46, 3.0)), (T_PUBLIC - 0.2, cam(BOARD[0] + 0.3, 0.44, 2.8)), (T_PUBLIC + 2.6, cam(0.0, 0.90, 5.6)),
                (T_OPEN - 0.4, cam(0.0, 0.88, 5.2)), (T_OPEN + 2.0, cam(1.5, 0.34, 2.1)), (T_FILL + 3.2, cam(1.5, 0.30, 1.7)), (T_NOBODY + 0.4, cam(1.5, 0.30, 1.7)),
                (T_JUSTUS + 2.4, cam(0.9, 1.9, 12.0, dz=-0.9, lens=30.0)), (T_FAR + 1.2, cam(0.9, 1.9, 12.0, dz=-0.9, lens=30.0)), (T_MORE + 1.4, cam(1.5, 0.36, 1.5)),
                (T_WRITE - 0.1, cam(1.5, 0.36, 1.45))]
        pos = kf(t, [(a, b[0]) for a, b in keys])
        look = kf(t, [(a, b[1]) for a, b in keys])
        lens = kf(t, [(a, b[2]) for a, b in keys])
    k.camera(pos, look, lens)
    k.sky(0.0 if card else 1.0, 0.0 if card else 0.06 + 0.50 * ss(P0, kit.TOTAL, t))
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(kit.TOTAL - 1.6, kit.TOTAL - 0.1, t)) + ss(T_CARD + 0.2, T_CARD + 1.4, t) * (1.0 - ss(P1 - 1.4, P1 - 0.1, t)))
