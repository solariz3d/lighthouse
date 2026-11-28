"""house_test.py: stills of the house, closed and open. blender -b --factory-startup -P house_test.py"""
import os, sys
import bpy
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import kit, sets
k = kit.Kit("draft", 960, 540)
h = sets.House(k, at=(0, 0, 0))
k.sky(1.0)
k.ground(-0.02)
me = k.candle(h.top("library", -0.12), "lib")
c2 = k.candle(h.top("desk"), "desk")
cs = [k.candle(h.top(n), n) for n in ("bench_a", "bench_b", "bench_c")]
me3 = k.candle(h.top("small", -0.02, 0.06), "tp")
for i, fl in enumerate([me, c2, *cs, me3]):
    fl.set(3.0 + i, size=1.0)
for r in ("library", "desk", "bench_a", "bench_b", "bench_c", "small", "hall"):
    h.lit(r, 1.0)
h.ticks(74); h.clock(3, 25)
os.makedirs(os.path.join(HERE, "out", "house"), exist_ok=True)
for nm, closed, pos, look, lens in (("closed", 1.0, (0.0, -6.5, 1.1), (0, 0, 1.1), 50), ("open", 0.0, (0.0, -5.2, 1.0), (0.0, 0, 0.95), 50),
                                    ("library", 0.0, (-0.1, -1.9, 0.42), (-0.1, 0.3, 0.38), 40)):
    h.front(closed)
    k.camera(pos, look, lens)
    k.scene.render.filepath = os.path.join(HERE, "out", "house", nm + ".png")
    bpy.ops.render.render(write_still=True)
print("HOUSE: done")
