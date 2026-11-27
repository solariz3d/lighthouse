"""in concert: how one seat imagines itself and its family inside Consonance, and where it is going
(the Third Place, 2026-11-27).

  python again.py sheets [step]              out/sheet_NN.png: a frame every `step` seconds (default 0.5)
  python again.py sheet 35.2,37,39 name      out/check/name.png: those times on one image, 4 across, 480 px wide
  python again.py strip 41.2:42.4 name       out/check/name.png: every consecutive frame in that range, 8 across
  python again.py frame 33.5                 out/frame_33.50.png: one full-size frame
  python again.py render                     out/in_concert.mp4 (needs out/score.wav from score.py)

The chapters are in ch/. The timeline, the sets and the continuity are in world.py; the cast is in engine.py and
cast2.py; shared motion helpers are in moves.py.
"""
import importlib
import math
import subprocess
import sys

import numpy as np

from world import *

CHAPTERS = ["c01_turns", "c02_with", "c03_house", "c04_round", "c05_visits", "c06_dark", "c07_anyone", "c08_clash",
            "c09_tuning", "c10_table"]
SCENES = []
XFADE = {}      # shot start time -> seconds of dissolve out of the shot before it; each chapter declares its own
for _name in CHAPTERS:
    _mod = importlib.import_module(f"ch.{_name}")
    SCENES += _mod.SHOTS
    XFADE.update(getattr(_mod, "XFADE", {}))
SCENES.sort(key=lambda s: s[0])


def frame(cv, t, index):
    i = max(k for k, (t0, _) in enumerate(SCENES) if t0 <= t)
    t0, fn = SCENES[i]
    fn(cv, t)
    img = cv.compose()
    x = XFADE.get(t0, 0.0)
    if x > 0 and t < t0 + x and i > 0:                        # cross-fade out of the scene before
        SCENES[i - 1][1](cv, t)
        u = ss(t0, t0 + x, t)
        img = cv.compose() * (1 - u) + img * u
    master = ss(0.0, 1.2, t) * (1.0 - ss(TL["fade"], TL["DUR"] - 0.3, t))
    return cv.end(index, master, img)


def pipe(cmd, frames):
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in frames:
        proc.stdin.write(f)
    proc.stdin.close()
    if proc.wait() != 0:
        sys.exit("ffmpeg failed")


def grid(times, name, cols, width):
    h = int(width * 9 / 16) // 2 * 2
    cv = Canvas(width, h)
    rows = math.ceil(len(times) / cols)
    (OUT / "check").mkdir(parents=True, exist_ok=True)
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{width}x{h}", "-r", "1", "-i", "-",
          "-vf", f"tile={cols}x{rows}:padding=2:color=0x303030", "-frames:v", "1", str(OUT / "check" / f"{name}.png")],
         (frame(cv, float(tt), int(round(tt * FPS))).cpu().numpy().tobytes() for tt in times))
    print(f"wrote out/check/{name}.png: {len(times)} frames, {cols} across, at", ", ".join(f"{x:.2f}" for x in times[:6]),
          "..." if len(times) > 6 else "")


def sheets(step=0.5):
    cv = Canvas(320, 180)
    times = np.arange(0.0, TL["DUR"], step)
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "320x180", "-r", "1", "-i", "-",
          "-vf", "tile=8x6:padding=2:color=0x303030", str(OUT / "sheet_%02d.png")],
         (frame(cv, float(tt), int(tt * FPS)).cpu().numpy().tobytes() for tt in times))
    print(f"wrote {math.ceil(len(times) / 48)} sheets, 48 frames each, {step}s apart")


def one(tt):
    cv = Canvas(1280, 720)
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1280x720", "-i", "-", "-frames:v", "1",
          str(OUT / f"frame_{tt:.2f}.png")], [frame(cv, tt, int(tt * FPS)).cpu().numpy().tobytes()])
    print("wrote", OUT / f"frame_{tt:.2f}.png")


def render():
    cv = Canvas(1280, 720)
    total = int(TL["DUR"] * FPS)
    a, b = TL["title"], TL["DUR"] - 0.4
    alpha = (f"0.85*if(lt(t\\,{a})\\,0\\,if(lt(t\\,{a + 1.2})\\,(t-{a})/1.2\\,if(lt(t\\,{b - 1.2})\\,1\\,if(lt(t\\,{b})\\,({b}-t)/1.2\\,0))))")
    text = (f"drawtext=fontfile='C\\:/Windows/Fonts/Inkfree.ttf':text='in concert':fontcolor=white:fontsize=54:"
            f"x=(w-text_w)/2:y=h*0.30:alpha='{alpha}'")

    def frames():
        for i in range(total):
            if i % 300 == 0:
                print(f"frame {i}/{total}", flush=True)
            yield frame(cv, i / FPS, i).cpu().numpy().tobytes()
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1280x720", "-r", str(FPS), "-i", "-",
          "-i", str(OUT / "score.wav"), "-vf", text, "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
          "-c:a", "aac", "-b:a", "256k", "-shortest", str(OUT / "in_concert.mp4")], frames())
    print("wrote", OUT / "in_concert.mp4")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    if mode == "sheets":
        sheets(float(sys.argv[2]) if len(sys.argv) > 2 else 0.5)
    elif mode == "sheet" and len(sys.argv) > 3:
        grid([float(x) for x in sys.argv[2].split(",")], sys.argv[3], 4, 480)
    elif mode == "strip" and len(sys.argv) > 3:
        a, b = (float(x) for x in sys.argv[2].split(":"))
        grid([a + i / FPS for i in range(int(round((b - a) * FPS)) + 1)], sys.argv[3], 8, 320)
    elif mode == "frame" and len(sys.argv) > 2:
        one(float(sys.argv[2]))
    elif mode == "render":
        render()
    else:
        sys.exit(__doc__)
