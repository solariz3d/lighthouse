"""assemble.py: turns rendered frames into things to look at. Plain Python (not Blender); needs ffmpeg on the path.

  python assemble.py sheet 1 [--tag sheet] [--cols 6]      a contact sheet of whatever frames are in out/p01/draft_<tag>
  python assemble.py clip 1 [--quality draft]              out/p01_<quality>.mp4: the part's frames with its narration
"""
import argparse
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 24
TL = json.load(open(os.path.join(HERE, "..", "timeline.json"), encoding="utf-8"))
WAV = os.path.join(HERE, "..", "out", "narration.wav")


def frames_in(d):
    return sorted(f for f in os.listdir(d) if f.startswith("f_") and f.endswith(".png"))


def listfile(d, names, dur):
    path = os.path.join(d, "_list.txt")
    with open(path, "w", encoding="utf-8") as f:
        for n in names:
            f.write(f"file '{n}'\nduration {dur}\n")
    return path


def sheet(a):
    d = os.path.join(HERE, "out", f"p{a.part:02d}", a.quality + ("_" + a.tag if a.tag else ""))
    names = frames_in(d)
    rows = -(-len(names) // a.cols)
    out = os.path.join(HERE, "out", f"p{a.part:02d}_sheet.png")
    stamp = "drawtext=fontfile='C\\:/Windows/Fonts/segoeui.ttf':text='%{eif\\:t\\:d}':x=6:y=4:fontsize=15:fontcolor=white@0.8"
    # the stamp shows the frame's place in the list; the true film times are printed below
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", listfile(d, names, 1), "-vf",
                    f"fps=1,{stamp},tile={a.cols}x{rows}", "-frames:v", "1", out], check=True, cwd=d)
    print("sheet:", out)
    print("tiles, left to right, top to bottom (film seconds):", " ".join(f"{int(n[2:8]) / FPS:.1f}" for n in names))


def clip(a):
    d = os.path.join(HERE, "out", f"p{a.part:02d}", a.quality)
    names = frames_in(d)
    first, last = int(names[0][2:8]), int(names[-1][2:8])
    if last - first + 1 != len(names):
        sys.exit(f"frames are missing: {len(names)} files for frames {first} to {last}")
    out = os.path.join(HERE, "out", f"p{a.part:02d}_{a.quality}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-start_number", str(first), "-i",
                    os.path.join(d, "f_%06d.png"), "-ss", f"{first / FPS:.4f}", "-t", f"{len(names) / FPS:.4f}", "-i", WAV,
                    "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", out],
                   check=True)
    print(f"clip: {out}  ({len(names) / FPS:.2f} s, film {first / FPS:.2f} to {(last + 1) / FPS:.2f})")


ap = argparse.ArgumentParser()
ap.add_argument("what", choices=("sheet", "clip"))
ap.add_argument("part", type=int)
ap.add_argument("--quality", default="draft")
ap.add_argument("--tag", default="")
ap.add_argument("--cols", type=int, default=6)
a = ap.parse_args()
if a.what == "sheet" and not a.tag:
    a.tag = "sheet"
{"sheet": sheet, "clip": clip}[a.what](a)
