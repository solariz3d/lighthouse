"""
mapindex.py -- what is actually LIVE in muscle_map.md, and what has been overtaken.

WHY THIS EXISTS. The map went 92 -> 1,465 lines in two days with ONE line deleted. 25 sections;
three carry a status marker. The other 22 sit at full authority whether or not a later entry
overturned them, and nobody -- not the chair, not the keeper, not the other machine -- knows
which. The keeper's report was "consonance has become so convoluted to me that I'm not truly
sure what is going on," and that is not a comprehension failure on his part. It is a measured
property of a file that only grows.

WHAT IT DOES. Prints one row per section: line number, date, title, status. Nothing is written,
nothing is moved, nothing is deleted. This is the inventory that has to exist before anyone
argues about restructuring, because the argument depends on a number nobody currently has.

WHY A SCRIPT AND NOT A TABLE. Two machines write this file. A hand-written inventory is stale
the moment the other side commits, and a stale index of a file people are trying to read is
worse than none -- that is this room's own invariant about gauges, applied one level up.

WHAT ITS ANSWER DOES NOT MEAN. Supersession is detected from TEXT, not from understanding. It
finds explicit strikes and seals exactly; it guesses at the rest by looking for a later section
whose title announces a correction and whose body names an earlier section's subject. It will
miss a silent overturn -- an entry that contradicts an earlier one without saying so -- and that
is precisely the failure mode the whole exercise is about. Treat LIVE as "not detectably
superseded," never as "confirmed current."

    py exo_memory/loop/mapindex.py            # the table
    py exo_memory/loop/mapindex.py --live     # only what is still standing
    py exo_memory/loop/mapindex.py --file F   # a different map
"""
import argparse, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
DEFAULT = HERE.parent / "muscle_map.md"

# A later section announces itself as revising an earlier one with these words in its TITLE.
# Deliberately narrow: a body full of the word "correction" is a discussion, not a supersession.
#
# `result` was in this list on the first run and it flagged three false positives immediately:
# every cycle result matched, so cycle 6 read as superseding cycle 5 and every self-contained
# finding read as overturning the one before it. A LATER FINDING IS NOT A REVISION. Only words
# that announce revising something already written belong here -- checked by opening all three
# guesses, which is the only reason the defect was found rather than shipped as a number.
REVISION_RX = re.compile(r"\b(corrected|correction|amendment|amended|struck|revised|"
                         r"supersed\w*|retract\w*|withdraw\w*)\b", re.I)
DATE_RX = re.compile(r"\((\d{4}-\d{2}-\d{2})[^)]*\)|(\d{4}-\d{2}-\d{2})")

# Words that carry a section's subject. Stripped of scaffolding so two sections about the same
# thing share tokens even when their titles are worded differently.
STOP = set("""the a an and or of to in on at for with by is are was were be been it its this
that these those from as not no but if then than what which who whom whose how why when where
map room chair keeper cycle cycles pane panes one two three first second new note notes""".split())


def sections(text):
    out = []
    for m in re.finditer(r"^## (.+)$", text, re.M):
        line = text.count("\n", 0, m.start()) + 1
        out.append({"line": line, "title": m.group(1).strip(), "start": m.start()})
    for i, s in enumerate(out):
        s["body"] = text[s["start"]:(out[i + 1]["start"] if i + 1 < len(out) else len(text))]
    return out


def tokens(title):
    words = re.findall(r"[a-z][a-z-]{3,}", title.lower())
    return {w for w in words if w not in STOP}


def classify(secs):
    for i, s in enumerate(secs):
        body, title = s["body"], s["title"]
        s["date"] = ""
        d = DATE_RX.search(title) or DATE_RX.search(body[:400])
        if d:
            s["date"] = d.group(1) or d.group(2) or ""

        # Exact signals first -- these are markers someone deliberately wrote.
        if re.search(r"^### \d+\..*—\s*sealed", body, re.M | re.I) or "— sealed" in title.lower():
            s["status"], s["by"] = "SEALED", ""
            continue
        if "STRUCK" in body:
            s["status"], s["by"] = "STRUCK", "in place"
            continue

        # Guess: a LATER section that announces a revision and names this one's subject.
        mine, best = tokens(title), None
        if mine:
            for later in secs[i + 1:]:
                if not REVISION_RX.search(later["title"]):
                    continue
                overlap = mine & (tokens(later["title"]) | tokens(later["body"][:1200]))
                if len(overlap) >= 2:
                    best = later
                    break
        s["status"] = "SUPERSEDED?" if best else "LIVE"
        s["by"] = f"L{best['line']}" if best else ""
    return secs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", default=str(DEFAULT))
    ap.add_argument("--live", action="store_true")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    p = pathlib.Path(a.file)
    if not p.exists():
        sys.exit(f"no such file: {p}")
    text = p.read_text(encoding="utf-8", errors="replace")
    secs = classify(sections(text))
    rows = [s for s in secs if not (a.live and s["status"] != "LIVE")]

    print(f"mapindex — {p.name}: {len(text.splitlines())} lines, {len(secs)} sections\n")
    print(f"{'line':>5}  {'date':<10} {'status':<12} {'by':<6} title")
    print(f"{'-'*5}  {'-'*10} {'-'*12} {'-'*6} {'-'*52}")
    for s in rows:
        t = s["title"]
        t = t if len(t) <= 62 else t[:59] + "..."
        print(f"{s['line']:>5}  {s['date']:<10} {s['status']:<12} {s['by']:<6} {t}")

    counts = {}
    for s in secs:
        counts[s["status"]] = counts.get(s["status"], 0) + 1
    print("\n" + "  ".join(f"{k}={v}" for k, v in sorted(counts.items())))
    print("\nSUPERSEDED? is a GUESS from titles and shared subject words -- open it before")
    print("believing it. LIVE means 'not detectably superseded', never 'confirmed current':")
    print("an entry that contradicts an earlier one without saying so reads as LIVE here, and")
    print("that silent overturn is the exact failure this file was written to expose.")


if __name__ == "__main__":
    main()
