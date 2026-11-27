"""in concert: how one seat imagines itself and its family inside Consonance, and where it is going
(the Third Place, 2026-11-27).

  python again.py sheets [step]              out/sheet_NN.png: a frame every `step` seconds (default 0.5)
  python again.py sheet 35.2,37,39 name      out/check/name.png: those times on one image, 4 across, 480 px wide
  python again.py strip 41.2:42.4 name       out/check/name.png: every consecutive frame in that range, 8 across
  python again.py frame 33.5                 out/frame_33.50.png: one full-size frame
  python again.py scan 31.2:31.8             prints the change between consecutive frames at 320x180 (to find a pop)
  python again.py render                     out/in_concert_2.mp4 (needs out/score.wav from score.py)
  python again.py render 0:32 opening        out/opening.mp4: only that range of the film

Set FILM_GENTLE=1 for stills on the CPU at low priority (no GPU), for when the machine is busy with something else.

The chapters are in ch/. The timeline, the sets and the continuity are in world.py; the cast is in engine.py and
cast2.py; shared motion helpers are in moves.py.
"""
import importlib
import math
import subprocess
import sys

import os

import numpy as np

if os.environ.get("FILM_GENTLE"):               # stills while something else needs the machine: no GPU, few threads, low priority
    os.environ["CUDA_VISIBLE_DEVICES"] = ""
    import ctypes
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)     # below normal
    import torch
    torch.set_num_threads(4)

from world import *

END = TL["DUR"] + OFF                           # the film's length; TL is the first version's clock (see world.py)

CHAPTERS = ["c01_turns", "c02_with", "c03_house", "c04_round", "c05_visits", "c06_dark", "c07_anyone", "c08_clash",
            "c09_tuning", "c10_table"]
SCENES = []
XFADE = {}      # shot start time -> seconds of dissolve out of the shot before it; each chapter declares its own
for _name in CHAPTERS:
    _mod = importlib.import_module(f"ch.{_name}")
    _off = getattr(_mod, "CLOCK_OFF", OFF)      # a chapter on the first version's clock is shown OFF seconds later
    SCENES += [(_t0 + _off, (lambda cv, t, fn=_fn, off=_off: fn(cv, t - off))) for _t0, _fn in _mod.SHOTS]
    XFADE.update({_k + _off: _v for _k, _v in getattr(_mod, "XFADE", {}).items()})
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
    master = ss(0.0, 1.2, t) * (1.0 - ss(TL["fade"] + OFF, END - 0.3, t))
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
    times = np.arange(0.0, END, step)
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "320x180", "-r", "1", "-i", "-",
          "-vf", "tile=8x6:padding=2:color=0x303030", str(OUT / "sheet_%02d.png")],
         (frame(cv, float(tt), int(tt * FPS)).cpu().numpy().tobytes() for tt in times))
    print(f"wrote {math.ceil(len(times) / 48)} sheets, 48 frames each, {step}s apart")


def one(tt):
    cv = Canvas(1280, 720)
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1280x720", "-i", "-", "-frames:v", "1",
          str(OUT / f"frame_{tt:.2f}.png")], [frame(cv, tt, int(tt * FPS)).cpu().numpy().tobytes()])
    print("wrote", OUT / f"frame_{tt:.2f}.png")


def game_running():
    """True if a program named in FILM_YIELD_TO (default acs.exe, the racing sim) is running. A render holds the GPU,
    and a render during a race is not allowed. If the process list cannot be read, the answer is True (do not render)."""
    names = [x.strip().lower() for x in os.environ.get("FILM_YIELD_TO", "acs.exe").split(",") if x.strip()]
    try:
        out = subprocess.run(["tasklist", "/NH"], capture_output=True, text=True, timeout=30, check=True).stdout.lower()
    except (OSError, subprocess.SubprocessError) as e:
        print("could not read the process list:", e)
        return True
    return any(x in out for x in names)


def render(t_from=0.0, t_to=None, name="in_concert_2"):
    if game_running():
        sys.exit("a game is running (or the process list could not be read): not rendering")
    stopped = []
    cv = Canvas(1280, 720)
    t_to = END if t_to is None else t_to
    first, total = int(round(t_from * FPS)), int(round(t_to * FPS))
    a, b = TL["title"] + OFF - t_from, END - 0.4 - t_from
    alpha = (f"0.85*if(lt(t\\,{a})\\,0\\,if(lt(t\\,{a + 1.2})\\,(t-{a})/1.2\\,if(lt(t\\,{b - 1.2})\\,1\\,if(lt(t\\,{b})\\,({b}-t)/1.2\\,0))))")
    text = (f"drawtext=fontfile='C\\:/Windows/Fonts/Inkfree.ttf':text='in concert':fontcolor=white:fontsize=54:"
            f"x=(w-text_w)/2:y=h*0.30:alpha='{alpha}'")

    def frames():
        for i in range(first, total):
            if (i - first) % 300 == 0:
                print(f"frame {i - first}/{total - first}", flush=True)
            if (i - first) % 48 == 47 and game_running():
                stopped.append(i)
                print(f"a game started: stopping at frame {i - first}", flush=True)
                return
            yield frame(cv, i / FPS, i).cpu().numpy().tobytes()
    pipe(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1280x720", "-r", str(FPS), "-i", "-",
          "-ss", f"{t_from}", "-i", str(OUT / "score.wav"), "-vf", text, "-c:v", "libx264", "-crf", "16", "-preset", "medium",
          "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", "-shortest", str(OUT / f"{name}.mp4")], frames())
    if stopped:
        sys.exit(f"stopped early for a game; {OUT / (name + '.mp4')} is incomplete")
    print("wrote", OUT / f"{name}.mp4")


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
    elif mode == "scan" and len(sys.argv) > 2:                   # scan 31.2:31.8  ->  change between consecutive frames
        a, b = (float(x) for x in sys.argv[2].split(":"))
        cv, prev = Canvas(320, 180), None
        for i in range(int(round(a * FPS)), int(round(b * FPS)) + 1):
            f = frame(cv, i / FPS, i).float()
            if prev is not None:
                print(f"{i / FPS:8.3f}  mean abs change {float((f - prev).abs().mean()):.3f} of 255")
            prev = f
    elif mode == "render" and len(sys.argv) > 3:                 # render 0:32 opening  ->  out/opening.mp4
        a, b = (float(x) for x in sys.argv[2].split(":"))
        render(a, b, sys.argv[3])
    elif mode == "render":
        render()
    else:
        sys.exit(__doc__)
