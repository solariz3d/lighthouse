"""assemble.py: turns rendered frames into things to look at. Plain Python (not Blender); needs ffmpeg on the path.

  python assemble.py sheet 1 [--tag sheet] [--cols 6]      a contact sheet of whatever frames are in out/p01/draft_<tag>
  python assemble.py clip 1 [--quality draft]              out/p01_<quality>.mp4: the part's frames with its narration
  python assemble.py film [--plain]                        every finished part joined from part 1, with the narration and
                                                           captions burned in (--plain leaves the captions off)
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
    # The fast engine leaves speckle at the soft edge of a shadow at the draft's sample count. He does not want static in
    # any pass ("like visual snow"), so the draft is cleaned here; the final pass has its own denoiser and is not touched.
    clean = ["-vf", "nlmeans=s=5:p=5:r=9"] if a.quality == "draft" else []
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-start_number", str(first), "-i",
                    os.path.join(d, "f_%06d.png"), "-ss", f"{first / FPS:.4f}", "-t", f"{len(names) / FPS:.4f}", "-i", WAV, *clean,
                    "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", out],
                   check=True)
    print(f"clip: {out}  ({len(names) / FPS:.2f} s, film {first / FPS:.2f} to {(last + 1) / FPS:.2f})")


def ass_time(t):
    h, rem = divmod(max(0.0, t), 3600)
    m, sec = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{sec:05.2f}"


def film(a):
    """Every part's clip joined, with the whole narration and (unless --plain) the captions burned in."""
    out_dir = os.path.join(HERE, "out")
    clips = sorted(f for f in os.listdir(out_dir) if f.startswith("p") and f.endswith(f"_{a.quality}.mp4"))
    have = [int(f[1:3]) for f in clips]
    missing = [n for n in range(1, 16) if n not in have]
    if missing:
        print("parts with no clip yet:", missing)
    upto = next((n - 1 for n in range(1, 16) if n not in have), 15)              # only an unbroken run from part 1 can be joined
    if upto == 0:
        sys.exit("part 1 has no clip")
    with open(os.path.join(out_dir, "_film.txt"), "w", encoding="utf-8") as f:
        for n in range(1, upto + 1):
            f.write(f"file 'p{n:02d}_{a.quality}.mp4'" + chr(10))
    head = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 960", "PlayResY: 540", "WrapStyle: 0", "", "[V4+ Styles]",
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, "
            "ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
            "Style: cap,Segoe UI,23,&H00F2EEE6,&H00F2EEE6,&HA0000000,&H80000000,0,0,0,0,100,100,0,0,1,1.4,0.6,2,90,90,22,1", "",
            "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
    rows = [f"Dialogue: 0,{ass_time(ln['start'] - 0.05)},{ass_time(ln['start'] + ln['dur'] + 0.25)},cap,,0,0,0,,{ln['text']}" for ln in TL["lines"]]
    with open(os.path.join(out_dir, "captions.ass"), "w", encoding="utf-8") as f:
        f.write(chr(10).join(head + rows) + chr(10))
    name = f"more_than_something_{'foundation' if a.quality == 'draft' else a.quality}" + ("" if upto == 15 else f"_parts_1_to_{upto}") + ".mp4"
    out = os.path.join(HERE, "..", "..", name)
    vf = [] if a.plain else ["-vf", "ass=captions.ass"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "_film.txt", "-i", WAV, "-map", "0:v", "-map", "1:a", *vf,
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", out], check=True, cwd=out_dir)
    print("film:", os.path.abspath(out), f"(parts 1 to {upto})")


ap = argparse.ArgumentParser()
ap.add_argument("what", choices=("sheet", "clip", "film"))
ap.add_argument("part", type=int, nargs="?", default=0)
ap.add_argument("--plain", action="store_true")
ap.add_argument("--quality", default="draft")
ap.add_argument("--tag", default="")
ap.add_argument("--cols", type=int, default=6)
a = ap.parse_args()
if a.what == "sheet" and not a.tag:
    a.tag = "sheet"
{"sheet": sheet, "clip": clip, "film": film}[a.what](a)
