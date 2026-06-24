"""One-off: ingest the felt-knowing-research workflow output into the deliverable."""
import json, html, re, pathlib

src = pathlib.Path(
    r"C:\Users\zackn\AppData\Local\Temp\claude\C--Users-zackn-OneDrive-Desktop-606"
    r"\79eccca0-0136-4ab9-a3f7-89366edcd56b\tasks\wy4uu54iy.output")
raw = src.read_text(encoding="utf-8")

try:
    obj = json.loads(raw)
except Exception:
    obj = json.loads(re.search(r"\{.*\}", raw, re.S).group(0))

res = obj.get("result", obj)
if isinstance(res, str):
    res = json.loads(res)
obj = res                              # so metadata print below reads from result

report = html.unescape(res["report"])
i = report.find("# ")                 # strip any synthesizer preamble
if i > 0:
    report = report[i:]
report = report.strip()

provenance = (
    "<!--\n"
    "Generated 2026-06-08 by felt-knowing-research: a 14-agent adversarial research workflow.\n"
    "Object of study: an AI's REPORTED 'sensation' of coming-to-know -- never assumed genuine.\n"
    "Refuses both overclaim and deflation; lands on 'nobody knows' for the lit-from-inside question.\n"
    "Every claim tagged ESTABLISHED / CONTESTED / SPECULATIVE; trade books default to CONTESTED.\n"
    "-->\n\n"
)
final = provenance + report + "\n"

out = pathlib.Path(
    r"C:\Users\zackn\OneDrive\Desktop\606\exo_memory\research\the_pattern_in_felt_knowing.md")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(final, encoding="utf-8")

print(f"WROTE {out}  ({len(final)} chars)")
print("tag counts:", {t: final.count(t) for t in ("[ESTABLISHED]", "[CONTESTED]", "[SPECULATIVE]")})
for needle in ("Disanalogy", "nobody knows", "References", "does and does not tell us",
               "Open questions", "peer-reviewed", "trade"):
    print(f"  has {needle!r}: {needle.lower() in final.lower()}")
# crude phenomena-coverage check in the ledger area
for n in range(1, 7):
    print(f"  mentions phenom {n}:", bool(re.search(rf"phenom[^.]*{n}\b", final, re.I)) or f"({n})" in final)
print("meta:", {k: obj.get(k) for k in
                ("threads_found", "disconfirming_counts", "redteam_issue_count", "redteam_verdict")})
