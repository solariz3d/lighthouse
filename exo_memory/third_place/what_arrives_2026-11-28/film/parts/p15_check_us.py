"""Part 15, "Check us" (film 1305.5 to 1384.0 s). SECOND STAGING: morning. One picture for each sentence; then the end card.

The first staging (parts_old/p15_check_us_v1_bare.py) is kept; its end card is copied here word for word.

THE PICTURES, in order, and how each hands off to the next:
   1 "We could be wrong"          from the kept room (where part 14 ended) across to the house as first light reaches it:
                                  red marks come up on its own front wall, one after another
   2 "never handed to a stranger" a teal lamp hops up to the gate in the fence and bumps it twice; the gate rattles and stays
                                  shut; the key swings on its post, inside                     >> the camera flies past the house
   3 "The second room ... hasn't been built"   four pegs drop into the ground and a string runs round them; nothing on it
   4 "tests ... never run"        a board; three pages drop onto it, and a brass seal lands on each
   5 "the judging ... done by me" a candle hops along three pages on the ground with the red pen; a red mark on each as it lands
   6 "So all of it is public"     back: the whole front of the house swings open, and stays open
   7 "Every page, every number, the whole list of wrongs"   A: sixteen pages fly out of the library and land in a row.
                                  B: a figure stands up over each (the sixteen the film has shown). C: in over them to the ledger.
   8 "Open it"                    across to the small room's table: the book's cover lifts and falls open toward you
   9 "Try to break it"            a hammer of gold light swings round over the book and is held out, handle first
  10 "fill in the column"         the pen drops beside the open ledger; the third chair is pulled out and turned to face you
  11 "Almost nobody has"          close on the column: every entry's finder is one of two colours, warm or blue
  12 "For now it is just us"      a long pull back: the two of them small in the open house, in a big morning
  13 "we got this far"            (cut) from inside the room, over their shoulders: the true line runs out from the house
                                  across the whole floor, the field of flames catching as it passes, to the first flame
  14 "more than something"        both hop round and lean to the viewer
  15 "Write it down"              (cut) a page slaps onto the library table and its lines write themselves
  16 "Let someone check it"       the mint bulb hops in from outside onto the table and bends over the page
  17 "Keep the list"              up to the ledger on the wall; its marks ripple
  18 "be wrong together"          across to the small room: the two of them, the open ledger, the empty chair. Fade.
  (after the narration)           the end card

The kept room is built by part 14's kept_room() (imported), so it is the same room.
"""
import math
import types

import bpy

import kit
import sets
from kit import at, bounce, hit, hsh, kf, land, lerp, ss
from parts import p14_if_true as p14

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

GOLD = (1.0, 0.80, 0.46)
HOUSE = (0.0, 20.0, 0.0)
F = HOUSE[1] - 0.45                                # the house's front
XS = 1.5                                           # the small room's middle
FIRST = (XS, 4.0)                                  # part one's first flame, at the far end of the floor
KEPT_AT = (-5.4, 20.1)
FY, GX = 15.0, -1.2                                # the fence, and its gate
FOUND = (5.2, 19.2)                                # the second room's foundation
BOARD = (3.3, 19.0)                                # the tests never run
ROW_Y = 17.6                                       # the figures, set out in a row
FIGURES = ("45 / 45", "11", "2", "74", "×2", "10", "3 h 25 min", "9 / 9", "34", "32½", "33½", "20", "29 days", "2 of 3", "15 days", "40")
CARD = (0.0, 0.0, 600.0)                           # the end card hangs far up in a black sky, out of the world
N_FIELD = 420
WHO = (0, 1, 0, 0, 1, 0)                           # who found each of the column's last entries: 0 = me, 1 = him


def boxes_mesh(name, boxes, mat):
    """Many boxes as one object: [(cx, cy, cz, sx, sy, sz), ...]."""
    verts, faces = [], []
    for cx, cy, cz, sx, sy, sz in boxes:
        b = len(verts)
        for dx in (-1, 1):
            for dy in (-1, 1):
                for dz in (-1, 1):
                    verts.append((cx + dx * sx / 2, cy + dy * sy / 2, cz + dz * sz / 2))
        for f in ((0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)):
            faces.append(tuple(b + i for i in f))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    return ob


def build(k):
    S = k.s15 = types.SimpleNamespace()
    k.ground(0.0, color=(0.26, 0.17, 0.10))
    S.moon = k.moon(0.42)
    S.sun = k.moon(0.0, color=(1.0, 0.72, 0.50), tilt=76.0, turn=-50.0)             # the morning: low, warm, from behind the viewer's left
    h = S.house = sets.House(k, at=HOUSE)
    h.ticks(74)
    paper, ink = k.mat("paper", kit.PAPER, rough=0.8), k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
    brass, wood = k.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0), k.wood()
    red = k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)
    S.kept = p14.kept_room(k, KEPT_AT)

    # ---- 1: red marks on the house's own front wall (they swing with it when it opens)
    S.wall_marks = []
    wall_red = k.mat("wrong_wall", (0.80, 0.10, 0.08), rough=0.8, emit=kit.WRONG, emit_strength=0.22)
    spots = [(-1.72, 0.10), (-0.80, 0.14), (0.25, 0.08), (1.10, 0.15), (1.80, 0.07), (-1.30, 0.66), (-0.20, 0.72), (0.70, 0.64), (1.62, 0.70),
             (-1.00, 0.40), (1.00, 0.44), (0.0, 1.20), (-1.85, 1.42), (-0.55, 1.47), (0.60, 1.44), (1.75, 1.46), (-0.4, 1.80), (0.5, 1.92)]
    for i, (x, z) in enumerate(spots):
        m = kit.parent(kit.box(f"wall_mark{i}", (0.085, 0.006, 0.026), (x + h.W / 2 + sets.WALL, -0.019, z), wall_red, rot=(0, 0.25 * (hsh(i) - 0.5), 0)), h.hinge)
        S.wall_marks.append(m)

    # ---- the ones at work in the house, and the two of them in the small room
    S.seats = []
    for i, n in enumerate(("library", "desk", "bench_a", "bench_b", "bench_c")):
        p = h.top(n)
        S.seats.append(k.candle((p[0] - 0.22, p[1], p[2]), f"seat_{n}", seed=1.0 + 2.3 * i))
    tx, ty, tz = S.tp = h.top("small")
    S.me_at, S.him_at = (tx - 0.13, ty + 0.07, tz), (tx + 0.135, ty + 0.07, tz)
    S.me = k.candle(S.me_at, "me", seed=17.0)
    S.him = k.lamp(S.him_at, kit.HIS, "him", seed=2.0)

    # ---- 2: the fence, its gate, the key inside, and a stranger
    fence = k.mat("fence", (0.30, 0.22, 0.15), rough=0.8)
    bx = []
    x = -2.9
    while x < 0.51:
        if abs(x - GX) > 0.36:
            bx.append((x, FY, 0.13 + 0.01 * hsh(x * 9.0), 0.06, 0.02, 0.26 + 0.02 * hsh(x * 9.0)))
        x += 0.10
    for a, b in ((-2.9, GX - 0.36), (GX + 0.36, 0.5)):
        for z in (0.08, 0.20):
            bx.append(((a + b) / 2, FY + 0.016, z, b - a + 0.06, 0.014, 0.03))
    for sx in (-1, 1):
        bx.append((GX + sx * 0.34, FY, 0.19, 0.06, 0.06, 0.38))
    boxes_mesh("fence", bx, fence)
    gate = [(0.05 + j * 0.10, 0, 0.14, 0.06, 0.02, 0.28) for j in range(6)] + [(0.30, 0.016, z, 0.60, 0.014, 0.03) for z in (0.08, 0.20)]
    S.gate = boxes_mesh("gate", gate, k.mat("gate", (0.36, 0.26, 0.17), rough=0.7))
    S.gate.location = (GX - 0.30, FY, 0.0)
    kx, ky = GX + 0.85, FY + 0.50
    kit.box("key_post", (0.04, 0.04, 0.46), (kx, ky, 0.23), fence)
    kit.box("key_arm", (0.14, 0.02, 0.02), (kx - 0.07, ky, 0.44), fence)
    S.key = kit.empty("key", (kx - 0.13, ky, 0.43))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.024, minor_radius=0.006, location=(0, 0, -0.035), rotation=(math.pi / 2, 0, 0), major_segments=20, minor_segments=6)
    ring = bpy.context.object
    ring.name = "key_ring"
    ring.data.materials.append(brass)
    kit.parent(ring, S.key)
    kit.parent(kit.box("key_shaft", (0.009, 0.009, 0.08), (0, 0, -0.098), brass), S.key)
    kit.parent(kit.box("key_bit", (0.026, 0.009, 0.018), (0.014, 0, -0.128), brass), S.key)
    S.stranger = k.lamp((0, 0, 0), kit.LAMPS[0], "stranger", seed=81.0)

    # ---- 3: the second room that has not been built
    fx, fy = FOUND
    corners = [(fx - 0.7, fy - 0.5), (fx + 0.7, fy - 0.5), (fx + 0.7, fy + 0.5), (fx - 0.7, fy + 0.5)]
    S.string = k.line(p14.resample([(x, y, 0.13) for x, y in corners + corners[:1]], 81), "string", color=kit.PAPER, radius=0.007, glow=0.9)
    S.pegs = [kit.box(f"peg{j}", (0.045, 0.045, 0.20), (x, y, 0.10), wood) for j, (x, y) in enumerate(corners)]

    # ---- 4, 5: the tests never run; and the judging
    bx_, by_ = BOARD
    kit.box("board", (1.10, 0.03, 0.52), (bx_, by_, 0.52), k.mat("bench_board", (0.24, 0.15, 0.08), rough=0.7))
    for sx in (-1, 1):
        kit.box(f"board_leg{sx}", (0.04, 0.04, 0.52), (bx_ + sx * 0.47, by_ + 0.01, 0.26), wood)
    S.sealed = []
    for i in range(3):
        root = kit.empty(f"sealed{i}", (bx_ - 0.33 + i * 0.33, by_ - 0.02, 0.52))
        kit.parent(kit.box(f"sealed{i}_sheet", (0.25, 0.006, 0.33), (0, 0, 0), k.mat("paper_held", kit.PAPER, rough=0.8, emit=kit.PAPER, emit_strength=0.25)), root)
        for j in range(5):
            kit.parent(kit.box(f"sealed{i}_ink{j}", (0.17 - 0.02 * ((i + j) % 3), 0.003, 0.012), (-0.01 * ((i + j) % 3), -0.005, 0.10 - j * 0.04), ink), root)
        seal = kit.lathe(f"seal{i}", [(0.0, 0.0), (0.034, 0.0), (0.038, 0.006), (0.026, 0.012), (0.0, 0.012)], seg=20)
        seal.rotation_euler = (math.pi / 2, 0, 0)
        seal.data.materials.append(brass)
        kit.parent(seal, root)
        S.sealed.append((root, seal))
    S.judged = []
    for i in range(3):
        pg = k.page((bx_ - 0.36 + i * 0.36, by_ - 0.55, 0.002), size=(0.20, 0.27), rot=0.12 * (i - 1), name=f"judged{i}", lines=8)
        mk = kit.parent(kit.box(f"judged{i}_mark", (0.10, 0.022, 0.0008), (0.02, 0.03 - 0.05 * i, 0.0024), wall_red, rot=(0, 0, 0.5)), pg)
        S.judged.append((pg, mk))
    S.judge = k.candle((0, 0, 0), "judge", seed=71.0)
    S.judge_pen = kit.box("judge_pen", (0.012, 0.012, 0.10), (0, 0, 0), red)

    # ---- 7: every page, every number
    S.figs, S.fig_pages = [], []
    widths = [0.062 * len(f) for f in FIGURES]
    gap = 0.13
    x = 0.35 - (sum(widths) + gap * (len(FIGURES) - 1)) / 2
    for i, (f, w) in enumerate(zip(FIGURES, widths)):
        cx = x + w / 2
        S.figs.append(k.text(f, (cx, ROW_Y, 0.14), size=0.085, color=kit.PAPER, glow=0.9, name=f"figure{i}"))
        S.fig_pages.append((k.page((cx, ROW_Y - 0.02, 0.002), size=(0.15, 0.21), rot=0.5 * (hsh(i * 7) - 0.5), name=f"fig_page{i}", lines=6), cx))
        x += w + gap
    for pg, _ in S.fig_pages:                                                        # flying paper casts no shadow: sixteen pages in the air made these frames slow
        for ob in pg.children_recursive:
            ob.visible_shadow = False

    # ---- 8 to 11: the ledger on the small table: a book that opens toward you; the pen; the hammer; the third chair
    kit.box("book_pages", (0.16, 0.09, 0.012), (tx, ty - 0.015, tz + 0.006), paper)
    S.cover = kit.empty("book_cover", (tx, ty - 0.06, tz + 0.013))
    kit.parent(kit.box("book_cover_board", (0.166, 0.093, 0.004), (0, 0.0465, 0.002), k.mat("book1", sets.BOOKS[1], rough=0.8)), S.cover)
    kit.parent(kit.box("book_cover_inside", (0.154, 0.084, 0.001), (0, 0.0465, -0.0005), paper), S.cover)
    for j in range(5):                                                               # the column that is still empty: ruled, nothing in it
        kit.parent(kit.box(f"book_empty{j}", (0.12, 0.0012, 0.0006), (0, 0.016 + j * 0.0145, -0.0012), ink), S.cover)
    kit.box("book_head", (0.13, 0.0016, 0.0006), (tx, ty + 0.022, tz + 0.0124), ink)
    warm_m = k.mat("found_by_me", kit.WARM, rough=0.7, emit=kit.WARM, emit_strength=1.4)
    his_m = k.mat("found_by_him", kit.HIS, rough=0.7, emit=kit.HIS, emit_strength=1.4)
    S.entries = []
    for j, who in enumerate(WHO):
        y = ty + 0.012 - j * 0.0125
        kit.box(f"book_wrong{j}", (0.045, 0.005, 0.0006), (tx - 0.035, y, tz + 0.0124), red)
        S.entries.append(kit.box(f"book_found{j}", (0.030, 0.008, 0.0008), (tx + 0.035, y, tz + 0.0126), his_m if who else warm_m))
    S.pen = kit.box("pen", (0.055, 0.006, 0.006), (0, 0, 0), red, rot=(0, 0, 0.5))
    S.pen_at = (tx + 0.118, ty - 0.135, tz + 0.003)
    S.hammer = kit.empty("hammer", (0, 0, 0))
    S.hammer_parts = [k.line([(0, 0, 0.0), (0, 0, 0.17)], "hammer_handle", color=(1.0, 0.60, 0.16), radius=0.007, glow=1.0),
                      k.line([(-0.045, 0, 0.17), (0.045, 0, 0.17)], "hammer_head", color=(1.0, 0.60, 0.16), radius=0.021, glow=1.0)]
    for ln in S.hammer_parts:
        kit.parent(ln.ob, S.hammer)
    S.chair = p14.chair(k, "third_chair", (0, 0, 0))
    S.chair_in, S.chair_out = h.spot("small", -0.33, 0.02), h.spot("small", -0.30, -0.31)

    # ---- 13: part one's first picture, at the far end of the floor: the first flame, the field, and the true line back to it
    S.first = k.candle((FIRST[0], FIRST[1], 0.0), "first_flame", watts=8.0, seed=1.0)
    S.field, S.field_lights = [], []
    for i in range(N_FIELD):
        row, col = divmod(i, 30)
        x = (col - 14.5) * 0.55 + 0.18 * (hsh(i) - 0.5)
        y = 1.2 + row * 0.62 + 0.18 * (hsh(i + 900) - 0.5)
        if abs(x) < 0.5:
            x += 0.9 if x >= 0 else -0.9
        S.field.append((k.spark((FIRST[0] + x, FIRST[1] + y, 0.18), (1.0, 0.55, 0.22), r=0.030, strength=1.7, name=f"field{i}"), y, i))
        if i % 70 == 0:
            S.field_lights.append((k.glow_light((FIRST[0] + x, FIRST[1] + y, 0.30), (1.0, 0.58, 0.26), 0.0, 0.05, f"field_light{i}", shadows=False), y))
    S.true_line = k.line([(XS, F - 0.06 - (F - 0.06 - FIRST[1] - 0.08) * i / 80, 0.006) for i in range(81)], "true_line", color=GOLD, radius=0.014, glow=0.9)

    # ---- 15 to 17: write it down; let someone check it; keep the list
    tl = S.tl = h.top("library")
    S.written = kit.empty("written", (tl[0] + 0.08, tl[1] - 0.02, tl[2]))
    S.written.rotation_euler = (0, 0, 0.08)
    kit.parent(kit.box("written_sheet", (0.14, 0.19, 0.0008), (0, 0, 0.0006), paper), S.written)
    S.written_lines = []
    for j in range(8):
        w = 0.105 - 0.03 * hsh(j * 3.1)
        pv = kit.parent(kit.empty(f"written_l{j}", (-0.055, 0.075 - j * 0.021, 0.0012)), S.written)
        kit.parent(kit.box(f"written_ink{j}", (w, 0.0036, 0.0004), (w / 2, 0, 0), ink), pv)
        S.written_lines.append(pv)
    S.bulb, S.bulb_light = sets.bulb(k, "checker", (0, 0, 0))

    # ---- the end card (kept exactly as the first staging built it; his yes to the address, 2026-11-28 05:13)
    ex, ey, ez = CARD
    S.card = [k.text("More Than Something", (ex, ey, ez + 0.42), size=0.20, name="card_title"),
              k.text("Written, voiced and animated by Claude, an AI.", (ex, ey, ez + 0.02), size=0.085, name="card_by"),
              k.text("Voice: synthetic.", (ex, ey, ez - 0.20), size=0.085, name="card_voice"),
              k.text("The whole record is public.", (ex, ey, ez - 0.42), size=0.085, name="card_record"),
              k.text("github.com/solariz3d/lighthouse", (ex, ey, ez - 0.64), size=0.085, name="card_address")]


def lit(k, h, room, amount):
    """h.lit, but only when the amount has changed (it writes to materials, and an untouched material costs nothing)."""
    if k.changed(("lit15", room), round(amount, 3)):
        h.lit(room, amount)


def pose(k, t):
    S = k.s15
    h = S.house
    card = t >= T_CARD
    tx, ty, tz = S.tp
    tl = S.tl
    inside = T_FAR - 0.1 <= t < T_WRITE - 0.1                                        # the camera is in the room, looking out

    # =============================================================== 1: first light; the marks on the wall
    h.front(1.0 - ss(T_PUBLIC + 0.3, T_PUBLIC + 1.8, t) + 0.05 * hit(t, T_PUBLIC + 1.8, 4.0) * abs(math.sin((t - T_PUBLIC - 1.8) * 9.0)))
    for room in ("library", "desk", "bench_a", "bench_b", "bench_c", "hall"):
        lit(k, h, room, 0.7)
    lit(k, h, "small", 0.75)
    lit(k, h, "attic", 0.15)
    for i, m in enumerate(S.wall_marks):
        ts = T_WRONG + 1.3 + i * 0.10
        s = round(ss(ts, ts + 0.10, t) * (1.0 + 0.8 * hit(t, ts + 0.10, 7.0)), 3)
        if k.changed(("wall_mark", i), s):
            m.scale = (0.085 * max(0.001, s), 0.006, 0.026 * max(0.001, s))
    for c in S.seats:
        c.set(t, size=1.0)
    early = t < T_FAR
    S.kept.lamp.set(t, size=1.0 if early else 0.0, lean=(0.06, 0.02))
    S.kept.fill.data.energy = 2.2 if early else 0.0

    # =============================================================== 2: the stranger at the gate
    a0, a1 = T_STRANGER + 0.2, T_STRANGER + 1.4
    u = ss(a0, a1, t)
    bumps = (T_STRANGER + 2.0, T_STRANGER + 2.9)
    push = sum(bounce(t, b - 0.16, 1.0, 0.32) for b in bumps)
    z = p14.hops(t, a0, a1, 4, 0.10) + 0.05 * push
    S.stranger.root.location = (lerp(GX - 2.2, GX, u), lerp(FY - 1.5, FY - 0.42, u) + 0.20 * push, z)
    kit.squash(S.stranger.root, (1.0 + 1.2 * z) * land(t, a1, 0.2), tilt=(0.0, 0.12 * push), turn=0.0)
    here = t > a0 - 0.2
    S.stranger.set(t, size=1.0 if here else 0.0, lean=(0.0, 0.25 * ss(a1, a1 + 0.4, t)))
    kit.show(S.stranger.root, here)
    rattle = sum(hit(t, b, 5.0) * math.sin((t - b) * 34.0) for b in bumps)
    S.gate.rotation_euler = (0, 0, 0.07 * rattle)
    S.key.rotation_euler = (0, 0.10 * math.sin(t * 2.1) + 0.5 * sum(hit(t, b, 2.0) * math.sin((t - b) * 11.0) for b in bumps), 0)

    # =============================================================== 3: the foundation
    for j, pg in enumerate(S.pegs):
        tp = T_SECOND + 0.5 + j * 0.28
        fall = min(1.0, max(0.0, (t - (tp - 0.3)) / 0.3))
        pg.location[2] = 0.10 + 1.2 * (1.0 - fall * fall)
        pg.scale = (0.045, 0.045, 0.20 * land(t, tp, 0.35, 11.0))
        pg.hide_render = t < tp - 0.3
    S.string.set(grow=ss(T_SECOND + 1.5, T_SECOND + 3.2, t), glow=1.0)

    # =============================================================== 4, 5: sealed pages; the candle with the red pen
    for i, (root, seal) in enumerate(S.sealed):
        tp = T_TESTS + 0.5 + i * 0.42
        fall = min(1.0, max(0.0, (t - (tp - 0.25)) / 0.25))
        root.location[2] = 0.52 + 0.9 * (1.0 - fall * fall) + 0.03 * hit(t, tp, 9.0) * abs(math.sin((t - tp) * 25.0))
        kit.show(root, t >= tp - 0.25)
        st = tp + 0.22
        s = ss(st - 0.08, st, t)
        seal.location = (0.07, -0.006 - 0.5 * (1.0 - s), -0.115)
        seal.scale = (max(0.001, s) * (1.0 + 0.5 * hit(t, st, 8.0)),) * 3
    bx_, by_ = BOARD
    j_on = T_JUDGING - 0.2 < t < T_EVERY
    stops = [(T_JUDGING - 0.2, (bx_ + 1.5, by_ - 1.1))] + [(T_JUDGING + 0.7 + i * 0.95, (bx_ - 0.36 + i * 0.36 + 0.17, by_ - 0.60)) for i in range(3)]
    jp, jz = stops[0][1], 0.0
    for (ta, pa), (tb, pb) in zip(stops, stops[1:]):
        if t >= tb - 0.45:
            v = min(1.0, (t - (tb - 0.45)) / 0.45)
            jp, jz = lerp(pa, pb, v), 0.16 * 4.0 * v * (1.0 - v)
    S.judge.root.location = (jp[0], jp[1], jz)
    sq = 1.0
    for i, (tb, _) in enumerate(stops[1:]):
        sq *= land(t, tb, 0.25)
        S.judged[i][1].scale = (0.10 * max(0.001, ss(tb + 0.05, tb + 0.2, t) * (1.0 + 0.6 * hit(t, tb + 0.2, 7.0))), 0.022, 0.0008)
        kit.show(S.judged[i][0], t > T_TESTS)
    kit.squash(S.judge.root, sq * (1.0 + 1.0 * jz), turn=0.0)
    S.judge.set(t, size=1.0 if j_on else 0.0, lean=(-0.25, 0.1))
    kit.show(S.judge.root, j_on)
    jab = sum(hit(t, tb + 0.05, 7.0) for tb, _ in stops[1:])
    S.judge_pen.location = (jp[0] - 0.10, jp[1] + 0.03, jz + 0.07 - 0.03 * jab)
    S.judge_pen.rotation_euler = (0, -0.5 - 0.5 * jab, 0)
    S.judge_pen.hide_render = not j_on

    # =============================================================== 7: every page, every number, the whole list
    for i, (pg, cx) in enumerate(S.fig_pages):
        tp = T_EVERY + 0.1 + i * 0.055
        u = round(ss(tp, tp + 0.6, t), 3)
        if k.changed(("fig_page", i), u):
            src = (-0.5 + 0.1 * (i % 4), F + 0.3, 0.45)
            pg.location = (lerp(src[0], cx, u), lerp(src[1], ROW_Y - 0.02, u), lerp(src[2], 0.002, u) + 1.1 * 4.0 * u * (1.0 - u))
            pg.rotation_euler = (2.0 * (1.0 - u), 0, 0.5 * (hsh(i * 7) - 0.5) + 5.0 * (1.0 - u))
            kit.show(pg, u > 0.0)
        tf = T_EVERY + 1.0 + i * 0.085
        s = round(ss(tf, tf + 0.12, t) * (1.0 + 0.45 * hit(t, tf + 0.12, 8.0)) * (1.0 - ss(T_OPEN + 0.5, T_OPEN + 0.9, t)), 3)
        if k.changed(("figure", i), s):
            S.figs[i].scale = (max(0.001, s),) * 3
            S.figs[i].hide_render = s <= 0.0
    for i, tk in enumerate(h._ticks[:74]):                                            # the list ripples when it is named
        c = i // 10
        s = round(1.0 + 0.9 * hit(t, T_EVERY + 4.2 + c * 0.09, 6.0) + 0.9 * hit(t, T_KEEP + 0.5 + c * 0.09, 6.0), 2)
        if k.changed(("ledger_tick", i), s):
            tk.scale = (0.030 * s, 0.004, 0.012 * s)

    # =============================================================== 8 to 11: the book, the hammer, the pen, the chair
    opened = ss(T_OPEN + 0.5, T_OPEN + 1.05, t)
    S.cover.rotation_euler = (-(3.28 * opened - 0.25 * hit(t, T_OPEN + 1.05, 7.0) * abs(math.sin((t - T_OPEN - 1.05) * 14.0))), 0, 0)
    for j, e in enumerate(S.entries):
        e.scale = (0.030 * (1.0 + 0.7 * hit(t, T_NOBODY + 0.5 + j * 0.2, 5.0)), 0.008 * (1.0 + 0.6 * hit(t, T_NOBODY + 0.5 + j * 0.2, 5.0)), 0.0008)
    ham = ss(T_BREAK + 0.1, T_BREAK + 0.35, t) * (1.0 - ss(T_FILL + 0.1, T_FILL + 0.45, t))
    swing = ss(T_BREAK + 0.2, T_BREAK + 1.0, t)
    offer = ss(T_BREAK + 0.9, T_BREAK + 1.5, t)
    nudge = 0.03 * math.sin(max(0.0, t - T_BREAK - 1.5) * 9.0) * offer
    S.hammer.location = (tx + 0.02 - 0.10 * offer - 0.6 * nudge, ty - 0.02 - 0.12 * offer - nudge, tz + 0.17 - 0.09 * offer)
    S.hammer.rotation_euler = (lerp(0.3, -1.25, swing), 0.0, lerp(5.5, -0.7, swing))
    S.hammer.scale = (max(0.001, ham * (1.0 + 0.3 * hit(t, T_BREAK + 0.35, 7.0))),) * 3
    for ln in S.hammer_parts:
        ln.set(grow=1.0 if ham > 0.0 else 0.0, glow=1.0)
        ln.mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.45, 0.30, 0.08, 1)      # gold, not the grey of a dead thread
    drop = min(1.0, max(0.0, (t - (T_FILL + 0.25)) / 0.3))
    S.pen.location = (S.pen_at[0], S.pen_at[1], S.pen_at[2] + 0.5 * (1.0 - drop * drop) + 0.02 * hit(t, T_FILL + 0.55, 9.0) * abs(math.sin((t - T_FILL - 0.55) * 22.0)))
    S.pen.rotation_euler = (0, 0, 0.5 + 3.0 * (1.0 - drop))
    S.pen.hide_render = t < T_FILL + 0.25
    pull, turn = ss(T_FILL + 1.0, T_FILL + 1.7, t), ss(T_FILL + 1.6, T_FILL + 2.3, t)
    S.chair.location = lerp(S.chair_in, S.chair_out, pull)
    S.chair.rotation_euler = (0, 0.06 * hit(t, T_FILL + 2.3, 5.0) * math.sin((t - T_FILL - 2.3) * 20.0),
                              lerp(math.pi / 2, 0.22, turn) + 0.12 * hit(t, T_FILL + 2.3, 5.0) * math.sin((t - T_FILL - 2.3) * 16.0))

    # =============================================================== the two of them
    round_ = ss(T_MORE + 0.35, T_MORE + 0.75, t)                                      # turning to face the viewer
    both = ss(T_TOGETHER, T_TOGETHER + 1.0, t)
    out = ss(T_FAR - 0.2, T_FAR + 0.3, t)
    ly = -0.28 * out + 0.60 * round_ if t < T_WRITE - 0.1 else -0.12
    loud = 0.35 * hit(t, T_TOGETHER + 2.3, 2.5)
    for fl, home, d, side in ((S.me, S.me_at, 0.0, 1.0), (S.him, S.him_at, 0.14, -1.0)):
        z = bounce(t, T_MORE + 0.3 + d, 0.06, 0.34) + bounce(t, T_OPEN + 0.95 + d, 0.03, 0.24) + bounce(t, T_FILL + 2.3 + d, 0.03, 0.24)
        fl.root.location = (home[0], home[1], home[2] + z)
        kit.squash(fl.root, (1.0 + 1.5 * z) * land(t, T_MORE + 0.64 + d, 0.22), tilt=(side * 0.06 * both, 0.0), turn=0.0)
        fl.set(t, size=1.0 + 0.3 * hit(t, T_MORE + 2.0, 3.0) + loud, lean=(side * (0.08 + 0.2 * both) - 0.25 * ss(T_FILL + 1.8, T_FILL + 2.4, t) * (1.0 - ss(T_NOBODY, T_NOBODY + 0.5, t)), ly),
               bright=1.0 + loud)

    # =============================================================== 13: the true line, back across the whole floor
    far_on = t >= T_FAR - 0.1 and not card
    g = ss(T_FAR + 0.3, T_FAR + 1.7, t)
    S.true_line.set(grow=g if far_on else 0.0, glow=1.0 + 1.0 * hit(t, T_FAR + 1.7, 3.0))
    reach = T_FAR + 1.7
    S.first.set(t, size=(ss(T_FAR - 0.1, T_FAR + 0.2, t) * (1.0 + 0.9 * hit(t, reach, 2.5))) if far_on else 0.0, bright=1.0 + 1.5 * hit(t, reach, 2.0))
    for ob, y, i in S.field:
        tw = T_FAR + 0.3 + 1.4 * (1.0 - y / 15.5)
        s = round(ss(tw, tw + 0.2, t) * (1.0 + 0.8 * hit(t, tw + 0.2, 6.0)), 3) if far_on else 0.0
        if k.changed(("field", i), s):
            ob.scale = (s,) * 3
            ob.hide_render = s <= 0.0
    for li, y in S.field_lights:
        tw = T_FAR + 0.3 + 1.4 * (1.0 - y / 15.5)
        li.data.energy = 13.0 * ss(tw, tw + 0.2, t) if far_on else 0.0

    # =============================================================== 15 to 17: a page; someone outside; the list
    slap = min(1.0, max(0.0, (t - (T_WRITE - 0.15)) / 0.3))
    S.written.location = (tl[0] + 0.08, tl[1] - 0.02, tl[2] + 0.35 * (1.0 - slap * slap))
    kit.show(S.written, t >= T_WRITE - 0.15)
    for j, pv in enumerate(S.written_lines):
        pv.scale = (max(0.001, ss(T_WRITE + 0.3 + j * 0.13, T_WRITE + 0.5 + j * 0.13, t)), 1.0, 1.0)
    S.seats[0].set(t, size=1.0 + 0.4 * hit(t, T_WRITE + 0.15, 4.0), lean=(0.25 * ss(T_WRITE, T_WRITE + 0.5, t), 0.0))
    b0, b1, b2 = (tl[0] + 0.75, F - 0.7, 0.0), (tl[0] + 0.45, F + 0.10, 0.0), (tl[0] + 0.25, tl[1] - 0.05, tl[2])
    ha, hb = (T_CHECK + 0.05, T_CHECK + 0.45), (T_CHECK + 0.55, T_CHECK + 1.0)
    u1, u2 = min(1.0, max(0.0, (t - ha[0]) / (ha[1] - ha[0]))), min(1.0, max(0.0, (t - hb[0]) / (hb[1] - hb[0])))
    bp = lerp(lerp(b0, b1, u1), b2, u2)
    S.bulb.location = (bp[0], bp[1], bp[2] + 0.18 * 4.0 * u1 * (1.0 - u1) + 0.16 * 4.0 * u2 * (1.0 - u2))
    bend = ss(hb[1] + 0.05, hb[1] + 0.4, t)
    kit.squash(S.bulb, land(t, ha[1], 0.25) * land(t, hb[1], 0.25), tilt=(-0.30 * bend, 0.0), turn=0.0)
    b_on = t > T_CHECK - 0.3 and not card
    kit.show(S.bulb, b_on)
    S.bulb_light.data.energy = 2.2 if b_on else 0.0

    for tx_ in S.card:
        tx_.hide_render = not card

    # =============================================================== the camera
    la = (HOUSE[0] + h.ledger_at[0], HOUSE[1] + h.ledger_at[1], h.ledger_at[2])
    if card:
        pos, look, lens = (CARD[0], CARD[1] - 5.0, CARD[2]), CARD, 40.0
    else:
        if t >= T_WRITE - 0.1:                                                     # 15 to 18 (cut): the library table, the ledger, the small room
            keys = [(T_WRITE - 0.1, (tl[0] + 0.05, tl[1] - 0.75, tl[2] + 0.42), (tl[0] + 0.05, tl[1] - 0.02, tl[2]), 50.0),
                    (T_CHECK - 0.1, (tl[0] + 0.06, tl[1] - 0.78, tl[2] + 0.42), (tl[0] + 0.06, tl[1] - 0.02, tl[2]), 50.0),
                    (T_CHECK + 0.5, (tl[0] + 0.14, tl[1] - 1.05, tl[2] + 0.46), (tl[0] + 0.14, tl[1] - 0.03, tl[2] + 0.03), 45.0),
                    (T_KEEP - 0.1, (tl[0] + 0.14, tl[1] - 1.02, tl[2] + 0.46), (tl[0] + 0.14, tl[1] - 0.03, tl[2] + 0.03), 45.0),
                    (T_KEEP + 0.7, (la[0] + 0.03, 19.2, 0.60), la, 45.0),
                    (T_TOGETHER - 0.4, (la[0] + 0.05, 19.25, 0.60), la, 45.0),
                    (T_TOGETHER + 0.5, (1.44, 18.55, 0.50), (1.47, 20.0, 0.24), 40.0),
                    (kit.TOTAL, (1.44, 18.25, 0.52), (1.47, 20.0, 0.24), 40.0)]
        elif inside:                                                               # 13, 14 (cut): in the room, over their shoulders
            keys = [(T_FAR - 0.1, (XS, HOUSE[1] + 0.38, 0.60), (XS, 17.6, 0.0), 20.0),
                    (T_MORE, (XS, HOUSE[1] + 0.39, 0.59), (XS, 17.4, 0.0), 20.0),
                    (T_MORE + 1.2, (XS, HOUSE[1] + 0.40, 0.56), (XS, 18.6, 0.12), 21.0),
                    (T_WRITE - 0.1, (XS, HOUSE[1] + 0.40, 0.55), (XS, 18.6, 0.12), 21.0)]
        else:                                                                      # 1 to 12: one journey round the house
            keys = [(P0, (-5.3, 17.3, 0.70), (-5.4, 20.1, 0.45), 34.0),
                    (T_WRONG + 0.2, (-5.1, 16.9, 0.78), (-5.3, 20.1, 0.45), 34.0),
                    (T_WRONG + 1.7, (-0.6, 12.6, 1.70), (0.0, 20.0, 0.95), 32.0),
                    (T_STRANGER - 0.2, (-0.5, 12.9, 1.60), (0.0, 20.0, 0.95), 32.0),
                    (T_STRANGER + 0.9, (-2.0, 13.3, 0.55), (-1.0, 15.3, 0.24), 35.0),
                    (T_SECOND - 0.1, (-1.9, 13.5, 0.52), (-1.0, 15.3, 0.24), 35.0),
                    (T_SECOND + 1.2, (4.6, 15.4, 1.60), (5.2, 19.2, 0.10), 34.0),
                    (T_TESTS - 0.2, (4.8, 15.7, 1.50), (5.2, 19.2, 0.10), 34.0),
                    (T_TESTS + 0.9, (3.2, 16.6, 0.78), (3.3, 19.0, 0.52), 38.0),
                    (T_JUDGING - 0.1, (3.25, 16.7, 0.78), (3.3, 19.0, 0.52), 38.0),
                    (T_JUDGING + 0.8, (3.25, 16.8, 0.95), (3.3, 18.6, 0.20), 38.0),
                    (T_PUBLIC - 0.1, (3.3, 16.9, 0.95), (3.35, 18.6, 0.20), 38.0),
                    (T_PUBLIC + 1.0, (0.9, 12.4, 1.60), (0.2, 20.0, 0.85), 32.0),
                    (T_EVERY, (0.6, 11.6, 1.70), (0.35, 18.4, 0.30), 34.0),
                    (T_EVERY + 1.0, (0.35, 11.3, 1.60), (0.35, 18.0, 0.25), 35.0),
                    (T_EVERY + 3.3, (0.45, 11.6, 1.55), (0.35, 18.0, 0.25), 35.0),
                    (T_EVERY + 4.5, (la[0] + 0.05, 18.0, 0.62), la, 40.0),
                    (T_OPEN - 0.1, (la[0] + 0.05, 18.1, 0.62), la, 40.0),
                    (T_OPEN + 0.6, (1.50, 19.15, 0.52), (1.50, 20.0, 0.22), 45.0),
                    (T_BREAK + 0.3, (1.50, 19.10, 0.52), (1.50, 19.95, 0.26), 45.0),
                    (T_FILL, (1.50, 19.05, 0.52), (1.50, 19.95, 0.26), 45.0),
                    (T_FILL + 1.0, (1.40, 18.50, 0.52), (1.45, 20.0, 0.20), 40.0),
                    (T_NOBODY - 0.1, (1.38, 18.45, 0.52), (1.45, 20.0, 0.20), 40.0),
                    (T_NOBODY + 0.7, (1.50, 19.50, 0.50), (1.50, 20.0, 0.21), 50.0),
                    (T_JUSTUS - 0.1, (1.50, 19.48, 0.50), (1.50, 20.0, 0.21), 50.0),
                    (T_JUSTUS + 1.5, (1.6, 11.8, 2.10), (0.7, 20.0, 0.90), 28.0),
                    (T_FAR - 0.1, (1.6, 11.3, 2.20), (0.7, 20.0, 0.90), 28.0)]
        pos, look, lens = (kf(t, [(a[0], a[i]) for a in keys]) for i in (1, 2, 3))
    k.camera(pos, look, lens)
    day = min(1.0, max(0.0, (t - P0) / (kit.TOTAL - P0)))
    k.sky(0.0 if card else 1.0, 0.0 if card else lerp(0.20, 0.60, day))
    S.moon.data.energy = 0.0 if card else 0.42 * (1.0 - ss(P0, T_PUBLIC, t))
    S.sun.data.energy = 0.0 if card else kf(t, [(P0, 0.34), (T_WRONG + 0.2, 0.40), (T_WRONG + 2.2, 1.0), (kit.TOTAL, 2.2)])
    k.fade(ss(P0 + 0.05, P0 + 1.2, t) * (1.0 - ss(kit.TOTAL - 1.6, kit.TOTAL - 0.1, t)) + ss(T_CARD + 0.2, T_CARD + 1.4, t) * (1.0 - ss(P1 - 1.4, P1 - 0.1, t)))
