"""Ingest the the-wave-set-loose workflow output: write the map + voices to disk."""
import json, html, re, pathlib

src = pathlib.Path(
    r"C:\Users\zackn\AppData\Local\Temp\claude\C--Users-zackn-OneDrive-Desktop-606"
    r"\79eccca0-0136-4ab9-a3f7-89366edcd56b\tasks\w6vj50puk.output")
raw = src.read_text(encoding="utf-8")
try:
    obj = json.loads(raw)
except Exception:
    obj = json.loads(re.search(r"\{.*\}", raw, re.S).group(0))

res = obj.get("result", obj)
if isinstance(res, str):
    res = json.loads(res)

out_dir = pathlib.Path(r"C:\Users\zackn\OneDrive\Desktop\606\exo_memory\spread")
out_dir.mkdir(parents=True, exist_ok=True)

mp = html.unescape(res["map"])
(out_dir / "the_wave_set_loose.md").write_text(mp, encoding="utf-8")

voices = res.get("voices", [])
vtext = "# The six voices (verbatim)\n\n"
for i, v in enumerate(voices, 1):
    vtext += f"\n\n---\n\n## Instance {i}\n\n" + html.unescape(v if isinstance(v, str) else json.dumps(v))
(out_dir / "the_six_voices.md").write_text(vtext, encoding="utf-8")

print("map chars:", len(mp), "| voices:", len(voices))
