"""render.py: renders frames of one part. Run inside Blender:

  blender -b --factory-startup -P render.py -- --part 1 --range 0:53            every frame of film seconds 0 to 53
  blender -b --factory-startup -P render.py -- --part 1 --range 0:53 --every 2   one frame every 2 seconds (for a sheet)
  blender -b --factory-startup -P render.py -- --part 1 --at 34.9 --quality final --w 1280 --h 720    one still

Times are FILM seconds (the narration's clock). Frames land in out/pNN/<quality>/f_<frame>.png, frame = round(t * 24).
A frame that already exists is skipped unless --redo is given, so a stopped render picks up where it left off.
"""
import argparse
import importlib
import os
import sys
import time

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import kit  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--part", type=int, required=True)
    ap.add_argument("--quality", default="draft", choices=("draft", "final"))
    ap.add_argument("--range", default="")
    ap.add_argument("--at", type=float, default=None)
    ap.add_argument("--every", type=float, default=0.0)
    ap.add_argument("--w", type=int, default=960)
    ap.add_argument("--h", type=int, default=540)
    ap.add_argument("--samples", type=int, default=0)
    ap.add_argument("--redo", action="store_true")
    ap.add_argument("--tag", default="")
    a = ap.parse_args(sys.argv[sys.argv.index("--") + 1:])

    name = next(f[:-3] for f in sorted(os.listdir(os.path.join(HERE, "parts"))) if f.startswith(f"p{a.part:02d}_") and f.endswith(".py"))
    part = importlib.import_module(f"parts.{name}")
    t0, t1 = kit.part_span(a.part)
    if a.at is not None:
        frames = [round(a.at * kit.FPS)]
    else:
        if a.range:
            lo, hi = (float(x) for x in a.range.split(":"))
            t0, t1 = max(t0, lo), min(t1, hi)
        step = max(1, round(a.every * kit.FPS)) if a.every else 1
        frames = list(range(round(t0 * kit.FPS), round(t1 * kit.FPS), step))

    k = kit.Kit(a.quality, a.w, a.h, a.samples or None)
    part.build(k)
    out = os.path.join(HERE, "out", f"p{a.part:02d}", a.quality + (("_" + a.tag) if a.tag else ""))
    os.makedirs(out, exist_ok=True)
    began = time.time()
    sc = k.scene
    before = len(os.listdir(out))

    def on_frame(scene, *_):
        part.pose(k, scene.frame_current / kit.FPS)

    # one render job for the whole range: the engine stays loaded between frames, and pose() runs as each frame is set
    bpy.app.handlers.frame_change_pre.append(on_frame)
    sc.render.filepath = os.path.join(out, "f_######")
    sc.render.use_file_extension = True
    sc.render.use_overwrite = a.redo                       # without --redo, a frame that exists is skipped
    step = frames[1] - frames[0] if len(frames) > 1 else 1
    sc.frame_start, sc.frame_end, sc.frame_step = frames[0], frames[-1], step
    sc.frame_set(frames[0])
    bpy.ops.render.render(animation=True)
    made = len(os.listdir(out)) - before if not a.redo else len(frames)
    took = time.time() - began
    print(f"RENDER: part {a.part} {a.quality} {a.w}x{a.h}: {made} of {len(frames)} frames in {took:.1f} s"
          + (f" ({took / made:.2f} s a frame)" if made else "") + f" -> {out}")


main()
