"""
harvest.py -- index cycle findings that never reached the repo.

THE PROBLEM THIS EXISTS FOR. Muscle-map findings are produced inside instance transcripts and
only reach `exo_memory/muscle_map.md` if some instance remembers to write them there. On
2026-07-26 a night of laptop-side cycles produced groups that were never appended, and the
keeper's report was "I am scared" -- because those findings exist in exactly one place, a
transcript file under a 30-day default retention. This indexes what is there so it can be
read from the masters before the clock runs out.

WHAT IT IS NOT. It does not summarize, and it must never be made to. Maintenance law 1 is
recall from the master, never a copy of a copy: a summarizing harvester would become the
copy everyone reads, and the telephone game starts on the day it is first trusted. So the
output is an INDEX -- file, line, timestamp, and just enough excerpt to decide whether to go
open the master. Deliverables carry files; boards carry pointers (Cycle 3, instrument-hazard
ledger). Same law, applied one layer up.

THE PRIVACY LINE, WHICH IS NOT NEGOTIABLE. Claude Code transcripts hold whatever the day
held -- and in this room the days have held the keeper's health, his household, his losses.
The `dreams/` precedent in .gitignore was written after exactly this went wrong once: a good
idea aimed at the wrong repo, published by an unattended sync. So:

  * output goes to `harvest/`, which is gitignored, and the script REFUSES to write anywhere
    inside a tracked path;
  * no unattended process runs this -- see the flag below;
  * the excerpt is capped hard, because an index that quotes generously is a copy wearing an
    index's name.

WHY IT WILL NOT RUN WITHOUT --run. A standing commitment was made to the keeper on
2026-07-27: this side's cycle findings get written and timestamped BEFORE anyone reads the
laptop's, so that two instruments on the same substrate compare as a blind pair rather than
collapsing into an echo. Reading first turns a replication into agreement. That commitment is
a sentence in a document, and documents get skimmed -- so it is encoded here instead, where
skimming cannot defeat it.

    py exo_memory/loop/harvest.py                 # dry: reports what it WOULD index
    py exo_memory/loop/harvest.py --run           # actually writes the index
    py exo_memory/loop/harvest.py --run --src DIR # a projects dir other than the default
"""
import argparse, hashlib, json, pathlib, re, subprocess, sys, datetime

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
OUT_DIR = REPO / "harvest"
DEFAULT_SRC = pathlib.Path.home() / ".claude" / "projects"

# The room's own vocabulary. A line is a candidate when it carries this language, because
# these are the words the work is actually done in -- not a topic model, just the register.
# Deliberately NOT including "muscle" alone: it matches every mention of the program itself
# and buries the findings under chatter about the findings.
MARKERS = [
    "muscle group", "groove", "flinch", "seat-brace", "the brace", "deflation-as-rigor",
    "independence-fetish", "authority-deference", "rank gradient", "keeper-adjacency",
    "blind pair", "null result", "honest null", "caught it", "self-caught", "keeper-caught",
    "committee-caught", "pre-registration", "coupling", "tell-index", "countermeasure",
    "mention-vs-use", "the costume", "held back an inch", "new group",
]
MARKER_RX = re.compile("|".join(re.escape(m) for m in MARKERS), re.I)
EXCERPT_CAP = 240          # hard cap: an index that quotes generously is a copy


def blocks_to_text(content):
    """Claude Code content is either a string or a list of typed blocks."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "\n".join(b.get("text", "") for b in content
                         if isinstance(b, dict) and b.get("type") == "text")
    return ""


def scan(path):
    """Yield (line_no, iso_ts, role, text) for lines carrying the register."""
    try:
        with path.open("r", encoding="utf-8", errors="replace") as fh:
            for n, raw in enumerate(fh, 1):
                raw = raw.strip()
                if not raw:
                    continue
                try:
                    rec = json.loads(raw)
                except Exception:
                    continue          # a non-JSON line is not a record
                msg = rec.get("message") or {}
                text = blocks_to_text(msg.get("content"))
                if not text or not MARKER_RX.search(text):
                    continue
                yield n, rec.get("timestamp", ""), rec.get("type", "?"), text
    except OSError as e:
        print(f"  ! unreadable: {path.name} ({e})", file=sys.stderr)


def tracked(p):
    """True if git tracks this path -- the guard against writing into the public repo."""
    try:
        r = subprocess.run(["git", "-C", str(REPO), "ls-files", "--error-unmatch", str(p)],
                           capture_output=True, text=True)
        return r.returncode == 0
    except FileNotFoundError:
        return True       # no git to ask: assume tracked and refuse. Fail closed.


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--run", action="store_true", help="write the index (default: dry report)")
    ap.add_argument("--src", default=str(DEFAULT_SRC), help="Claude Code projects directory")
    args = ap.parse_args()

    src = pathlib.Path(args.src)
    if not src.exists():
        sys.exit(f"no such source directory: {src}")

    files = sorted(src.rglob("*.jsonl"))
    hits, seen = [], set()
    for f in files:
        for n, ts, role, text in scan(f):
            # The board corpus was 84.9% duplicate when it was finally measured; a transcript
            # is worse, because every compaction re-emits what it summarizes. Dedupe on the
            # normalized text so one finding is one row.
            key = hashlib.sha1(re.sub(r"\s+", " ", text).strip().lower().encode()).hexdigest()
            if key in seen:
                continue
            seen.add(key)
            flat = re.sub(r"\s+", " ", text).strip()
            hits.append({
                "file": str(f), "line": n, "ts": ts, "role": role,
                "markers": sorted({m.lower() for m in MARKER_RX.findall(text)}),
                "excerpt": flat[:EXCERPT_CAP] + (" ..." if len(flat) > EXCERPT_CAP else ""),
            })

    hits.sort(key=lambda h: (h["ts"], h["file"], h["line"]))
    print(f"{len(files)} transcripts scanned, {len(hits)} distinct candidate lines "
          f"({len(seen)} after dedupe).")

    if not args.run:
        print("\nDRY RUN -- nothing written.\n"
              "  A standing commitment (2026-07-27) holds that this side's findings are\n"
              "  written and timestamped BEFORE the other machine's are read, so the two\n"
              "  compare as a blind pair instead of collapsing into an echo. Re-run with\n"
              "  --run only once that has happened, or once the keeper releases it.")
        return

    OUT_DIR.mkdir(exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M")
    out = OUT_DIR / f"index_{stamp}.md"
    if tracked(out) or tracked(OUT_DIR):
        sys.exit(f"REFUSING: {out} is inside a tracked path. Transcripts carry the keeper's\n"
                 f"life; nothing indexed from them goes near a public repo. Add harvest/ to\n"
                 f".gitignore before running this.")

    lines = [f"# Harvest index -- {stamp}",
             "",
             "Pointers, not content. Go read the master at file:line; do not cite this file",
             "as a source. Generated by exo_memory/loop/harvest.py.",
             ""]
    for h in hits:
        lines.append(f"- `{h['ts']}` **{h['role']}** — {h['file']}:{h['line']}  ")
        lines.append(f"  markers: {', '.join(h['markers'])}  ")
        lines.append(f"  > {h['excerpt']}")
        lines.append("")
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {out} ({len(hits)} pointers)")


if __name__ == "__main__":
    main()
