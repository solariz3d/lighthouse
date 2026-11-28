"""sets.py: the places that more than one part visits. Read-only to painters, like kit.py.

THE HOUSE is the film's one building: what he built. It is at candle scale (a room is 1.0 wide, 0.78 high, 0.9 deep) and
it opens like a doll's house: the front wall is one piece that can be shown, hidden, or swung away.

      attic                      the ones who stopped running, kept (part 12)
      desk | bench_a | bench_b | bench_c      upstairs: the one who splits the job, and the three who each take a piece
      hall | library (two wide)  | small      downstairs: the door and the clock; the library and its ledger; the room
                                              with no job in it, a table and two cups (the third place)

  h = sets.House(k, at=(0, 6, 0))
  h.spot("library")          -> (x, y, z): the middle of that room's floor, in world space. Stand things on it.
  h.top("library")           -> the top of that room's table or bench, in world space
  h.front(1.0)               1 = front wall closed (windows show the light inside); 0 = swung fully open
  h.lit("library", 1.0)      the room's own light (0 = dark). A room is lit when one of us is in it.
  h.ticks(74)                how many entries the ledger of wrongs shows (red marks; up to 80)
  h.clock(3, 25)             the clock in the hall
  h.show(False)              hide the whole house (and h.show(True) to bring it back)
  h.root                     move or scale the whole house (do not turn it: spot() and top() assume it faces -Y)
"""
import math

import bpy

import kit
from kit import box, empty, hsh, parent

CELL_W, CELL_H, DEPTH, WALL = 1.0, 0.78, 0.9, 0.03
ROOMS = {"hall": (0, 0, 1), "library": (1, 0, 2), "small": (3, 0, 1),
         "desk": (0, 1, 1), "bench_a": (1, 1, 1), "bench_b": (2, 1, 1), "bench_c": (3, 1, 1)}     # column, floor, cells wide
BOOKS = ((0.36, 0.12, 0.10), (0.12, 0.22, 0.20), (0.30, 0.24, 0.12), (0.16, 0.14, 0.26), (0.40, 0.30, 0.20), (0.10, 0.16, 0.30))


class House:
    def __init__(self, k, at=(0.0, 0.0, 0.0), name="house"):
        self.k, self.name = k, name
        self.root = empty(name, at)
        wall = k.mat("house_wall", (0.30, 0.25, 0.21), rough=0.9)
        floor = k.mat("house_floor", (0.20, 0.13, 0.08), rough=0.7)
        dark = k.mat("house_outside", (0.06, 0.05, 0.045), rough=0.9)
        wood = k.wood()
        W, H = 4 * CELL_W, 2 * CELL_H
        self.W, self.H = W, H

        def put(nm, size, pos, mat, rot=(0, 0, 0)):
            return parent(box(f"{name}_{nm}", size, pos, mat, rot), self.root)

        # the shell: back wall, side walls, floors, the walls between rooms
        put("back", (W + 2 * WALL, WALL, H + CELL_H * 0.0), (0, DEPTH / 2, H / 2), wall)
        for sx in (-1, 1):
            put(f"side{sx}", (WALL, DEPTH, H), (sx * (W / 2 + WALL / 2), 0, H / 2), wall)
        for f in range(3):
            put(f"floor{f}", (W + 2 * WALL, DEPTH, WALL), (0, 0, f * CELL_H - WALL / 2), floor)
        for col, fl in ((1, 0), (3, 0), (1, 1), (2, 1), (3, 1)):                 # ground floor: hall | library | small
            put(f"div{col}{fl}", (WALL, DEPTH, CELL_H - WALL), (-W / 2 + col * CELL_W, 0, fl * CELL_H + (CELL_H - WALL) / 2), wall)

        # the roof and the attic under it
        rise, half = 0.95, W / 2 + 0.16
        slope = math.atan2(rise, half)
        length = math.hypot(rise, half)
        for sx in (-1, 1):
            put(f"roof{sx}", (length + 0.05, DEPTH + 0.16, WALL), (sx * half / 2, 0, H + rise / 2), dark, rot=(0, sx * slope, 0))
        me = bpy.data.meshes.new(name + "_gable")                                  # the back of the attic
        me.from_pydata([(-half, 0, 0), (half, 0, 0), (0, 0, rise)], [], [(0, 1, 2)])
        g = bpy.data.objects.new(name + "_gable", me)
        bpy.context.scene.collection.objects.link(g)
        g.location = (0, DEPTH / 2, H)
        g.data.materials.append(wall)
        parent(g, self.root)
        self.rise = rise

        # the rooms' own lights (a room is lit when one of us is in it)
        self.lights = {}
        for nm, (col, fl, wide) in {**ROOMS, "attic": (1, 2, 2)}.items():
            cx = -W / 2 + (col + wide / 2) * CELL_W
            li = k.glow_light((0, 0, 0), kit.WARM, 0.0, 0.04, f"{name}_light_{nm}", shadows=False)
            parent(li, self.root)
            li.location = (cx, -0.22, fl * CELL_H + CELL_H * 0.62)
            self.lights[nm] = li

        # furniture -------------------------------------------------------------------------------------------------
        self.tops = {}

        def table(nm, w, d, h, x, y=0.05):
            col, fl, wide = ROOMS[nm]
            cx = -W / 2 + (col + wide / 2) * CELL_W + x
            z = fl * CELL_H
            put(f"{nm}_top", (w, d, 0.018), (cx, y, z + h - 0.009), wood)
            for sx in (-1, 1):
                put(f"{nm}_leg{sx}", (0.02, d * 0.8, h - 0.018), (cx + sx * (w / 2 - 0.03), y, z + (h - 0.018) / 2), wood)
            self.tops[nm] = (cx, y, z + h)

        table("library", 0.62, 0.36, 0.20, -0.42)          # the reading table, left half of the library
        table("small", 0.44, 0.34, 0.20, 0.0)              # the room with no job in it
        table("desk", 0.56, 0.32, 0.22, 0.0)               # the one who splits the job
        for nm in ("bench_a", "bench_b", "bench_c"):
            table(nm, 0.66, 0.34, 0.24, 0.0)

        # the library's shelves, on the back wall of its right half, and the ledger of wrongs on the left
        col, fl, wide = ROOMS["library"]
        x0 = -W / 2 + col * CELL_W
        self.books = []
        for r in range(4):
            z = 0.10 + r * 0.155
            put(f"shelf{r}", (0.86, 0.10, 0.012), (x0 + 1.50, DEPTH / 2 - 0.07, z), wood)
            x = x0 + 1.09
            i = 0
            while x < x0 + 1.90:
                w = 0.022 + 0.022 * hsh(r * 31 + i)
                hgt = 0.095 + 0.035 * hsh(r * 17 + i + 3)
                m = k.mat(f"book{(r * 5 + i) % len(BOOKS)}", BOOKS[(r * 5 + i) % len(BOOKS)], rough=0.8)
                self.books.append(put(f"book{r}_{i}", (w, 0.085, hgt), (x + w / 2, DEPTH / 2 - 0.075, z + 0.006 + hgt / 2), m))
                x += w + 0.003
                i += 1
        self.ledger_at = (x0 + 0.50, DEPTH / 2 - WALL / 2 - 0.004, 0.50)
        put("ledger", (0.56, 0.008, 0.34), self.ledger_at, k.mat("paper", kit.PAPER, rough=0.8))
        put("ledger_rule", (0.004, 0.004, 0.30), (self.ledger_at[0] - 0.14, self.ledger_at[1] - 0.006, self.ledger_at[2]),
            k.mat("ink", (0.10, 0.07, 0.05), rough=0.9))
        red = k.mat("wrong", kit.WRONG, rough=0.8, emit=kit.WRONG, emit_strength=0.2)
        self._ticks = []
        for i in range(80):                                                         # 8 columns of 10, filled downward
            c, r = divmod(i, 10)
            self._ticks.append(put(f"tick{i}", (0.030, 0.004, 0.012), (self.ledger_at[0] - 0.105 + c * 0.045,
                                                                         self.ledger_at[1] - 0.007, self.ledger_at[2] + 0.13 - r * 0.029), red))
        self.ticks(0)

        # the clock in the hall, by the door
        cx = -W / 2 + 0.5 * CELL_W
        self.clock_at = (cx + 0.18, DEPTH / 2 - WALL / 2 - 0.006, 0.52)
        face = kit.lathe(f"{name}_clock", [(0.0, 0.0), (0.085, 0.0), (0.085, 0.01), (0.0, 0.01)], seg=40)
        face.rotation_euler = (math.pi / 2, 0, 0)
        face.location = self.clock_at
        face.data.materials.append(k.mat("paper", kit.PAPER, rough=0.8))
        parent(face, self.root)
        ink = k.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
        self._hands = []
        for nm, ln, th in (("hour", 0.045, 0.010), ("minute", 0.070, 0.006)):
            pivot = parent(empty(f"{name}_{nm}", (self.clock_at[0], self.clock_at[1] - 0.014, self.clock_at[2])), self.root)
            parent(box(f"{name}_{nm}_hand", (th, 0.003, ln), (0, 0, ln / 2), ink), pivot)
            self._hands.append(pivot)
        put("door", (0.24, 0.012, 0.46), (cx - 0.22, DEPTH / 2 - WALL / 2 - 0.006, 0.23), wood)

        # the two cups in the small room
        tx, ty, tz = self.tops["small"]
        self.cups = []
        for sx in (-1, 1):
            cup = kit.lathe(f"{name}_cup{sx}", [(0.0, 0.0), (0.016, 0.0), (0.021, 0.034), (0.019, 0.034), (0.0145, 0.004), (0.0, 0.004)], seg=24)
            cup.location = (tx + sx * 0.12, ty - 0.07, tz)
            cup.data.materials.append(k.mat("cup", (0.85, 0.82, 0.76), rough=0.35))
            self.cups.append(parent(cup, self.root))

        # the front wall: one piece, hinged at the left edge, with a window for every room and the door
        self.hinge = parent(empty(f"{name}_hinge", (-W / 2 - WALL, -DEPTH / 2, 0)), self.root)
        self._front = []
        self.panes = {}

        def fput(nm, size, pos, mat):
            ob = parent(box(f"{name}_front_{nm}", size, (pos[0] + W / 2 + WALL, pos[1], pos[2]), mat), self.hinge)
            self._front.append(ob)
            return ob

        win_w, win_h = 0.34, 0.36
        cells = [(c, f) for f in range(2) for c in range(4)]
        for f in range(2):                                                          # horizontal bands above and below windows
            zc = f * CELL_H
            fput(f"low{f}", (W + 2 * WALL, WALL, 0.22), (0, 0, zc + 0.11), dark)
            fput(f"high{f}", (W + 2 * WALL, WALL, CELL_H - 0.22 - win_h), (0, 0, zc + 0.22 + win_h + (CELL_H - 0.22 - win_h) / 2), dark)
            for c in range(5):                                                      # posts between the windows
                left = -W / 2 - WALL if c == 0 else -W / 2 + (c - 1) * CELL_W + CELL_W / 2 + win_w / 2
                right = W / 2 + WALL if c == 4 else -W / 2 + c * CELL_W + CELL_W / 2 - win_w / 2
                fput(f"post{f}{c}", (right - left, WALL, win_h), ((left + right) / 2, 0, zc + 0.22 + win_h / 2), dark)
        for c, f in cells:
            nm = next(n for n, (col, fl, wide) in ROOMS.items() if fl == f and col <= c < col + wide)
            m = k.mat(f"{name}_pane_{c}{f}", (0, 0, 0), emit=kit.WARM, emit_strength=0.0, alpha=0.999)
            b = m.node_tree.nodes["Principled BSDF"]
            b.inputs["Alpha"].default_value = 0.0                                   # clear glass until it is given a glow
            pane = fput(f"pane{c}{f}", (win_w, 0.004, win_h), (-W / 2 + c * CELL_W + CELL_W / 2, 0, f * CELL_H + 0.22 + win_h / 2), m)
            pane.visible_shadow = False
            px, pz = -W / 2 + c * CELL_W + CELL_W / 2, f * CELL_H + 0.22 + win_h / 2          # the bars of the window
            fput(f"bar_v{c}{f}", (0.014, 0.012, win_h), (px, -0.004, pz), dark)
            fput(f"bar_h{c}{f}", (win_w, 0.012, 0.014), (px, -0.004, pz), dark)
            self.panes.setdefault(nm, []).append(m)
        me = bpy.data.meshes.new(name + "_front_gable")
        me.from_pydata([(-half, 0, 0), (half, 0, 0), (0, 0, rise)], [], [(0, 2, 1)])
        fg = bpy.data.objects.new(name + "_front_gable", me)
        bpy.context.scene.collection.objects.link(fg)
        fg.location = (W / 2 + WALL, 0, H)
        fg.data.materials.append(dark)
        parent(fg, self.hinge)
        self._front.append(fg)
        self.front(1.0)

    # ------------------------------------------------------------------ where things are
    def _world(self, local):
        r, sc = self.root.location, self.root.scale
        return (r[0] + local[0] * sc[0], r[1] + local[1] * sc[1], r[2] + local[2] * sc[2])

    def spot(self, room, dx=0.0, dy=0.0):
        """The middle of a room's floor (world space, for a house that has been moved or scaled but not turned)."""
        if room == "attic":
            return self._world((dx, dy, self.H))
        col, fl, wide = ROOMS[room]
        return self._world((-self.W / 2 + (col + wide / 2) * CELL_W + dx, dy, fl * CELL_H))

    def top(self, room, dx=0.0, dy=0.0):
        """The top of a room's table or bench (world space)."""
        x, y, z = self.tops[room]
        return self._world((x + dx, y + dy, z))

    # ------------------------------------------------------------------ what a part poses
    def front(self, closed=1.0):
        """1 = closed. 0 = swung open on its left edge, out of the camera's way. Below 0.02 it is not drawn at all."""
        self.hinge.rotation_euler = (0, 0, -(1.0 - closed) * math.radians(118))
        for ob in self._front:
            ob.hide_render = closed < 0.0

    def lit(self, room, amount=1.0, color=None, watts=3.0):
        """A room's own light. With the front closed, its window glows to match."""
        li = self.lights[room]
        li.data.energy = watts * amount
        li.data.color = color or kit.WARM
        for m in self.panes.get(room, ()):
            b = m.node_tree.nodes["Principled BSDF"]
            b.inputs["Emission Color"].default_value = (*(color or kit.WARM), 1)
            b.inputs["Emission Strength"].default_value = 1.3 * amount
            b.inputs["Alpha"].default_value = min(0.92, amount * 2.0)

    def ticks(self, n):
        if getattr(self, "_n", None) == n:
            return
        self._n = n
        for i, ob in enumerate(self._ticks):
            ob.hide_render = i >= n

    def show(self, on=True):
        """Show or hide the whole house (use this, not kit.show, so the ledger keeps its count)."""
        if self.root.get("_shown", None) == on:
            return
        kit.show(self.root, on)
        if on:                                             # un-hiding showed every tick; put the count back
            n, self._n = self._n, None
            self.ticks(n)

    def clock(self, hours, minutes):
        self._hands[0].rotation_euler = (0, (hours % 12 + minutes / 60.0) / 12.0 * 2 * math.pi, 0)
        self._hands[1].rotation_euler = (0, minutes / 60.0 * 2 * math.pi, 0)
