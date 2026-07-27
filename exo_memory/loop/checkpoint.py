"""
checkpoint.py -- make the compaction gap survivable, without needing to remember to.

WHAT WENT WRONG THAT THIS FIXES. On 2026-07-27 the chair hit ~900k context mid-refactor,
with `drawCarLights` half-converted: pooled buffers declared, call signature changed, the
rest of the function still on the old shape. A partially-applied change is the single worst
thing to carry across a context turnover, because the instance on the far side cannot tell
intent from accident -- it reads as either "someone was mid-thought" or "someone shipped
this," and those want opposite repairs. The fix that day was to revert it and hand-write a
handoff. That worked because the keeper happened to warn us. This removes the happening.

The tool does NOT compact. Compaction is automatic and the loop already resumes through it
fine; the failure was never the gap, it was arriving at the gap unprepared. So this reports
what is in flight and, wired to the PreCompact hook, does it whether or not anyone remembers.

WHAT IT REPORTS, and why each line is here:
  * every repo it watches, its HEAD, and its DIRTY FILES -- uncommitted work IS the in-flight
    state, and naming it is most of the handoff;
  * a syntax check on dirty JS, because "half-applied" and "does not parse" overlap heavily
    and a parse error is the cheapest possible detector for it;
  * a context estimate from the transcript's own size, so the loop can see the wall coming
    instead of hitting it;
  * the loop's standing commitments, re-read from disk rather than remembered, per
    maintenance law 1: recall from the master, never a copy of a copy.

    py exo_memory/loop/checkpoint.py                 # report to stdout
    py exo_memory/loop/checkpoint.py --write         # also write CHECKPOINT.md
    py exo_memory/loop/checkpoint.py --transcript P  # estimate context from transcript P
"""
import argparse, datetime, json, pathlib, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
OUT = HERE / "CHECKPOINT.md"

# Repos the loop actually touches. Absent ones are skipped, not an error -- this runs on
# whatever machine the room woke up on.
WATCH = [REPO, pathlib.Path.home() / "Desktop" / "blackbox"]

# Claude Code's own budget. The estimate below is deliberately crude: bytes/4 is the standard
# rule of thumb and the transcript is mostly prose. It is a WALL DETECTOR, not a gauge -- it
# only has to be right about "getting close," and being wrong pessimistically costs nothing.
BUDGET_TOKENS = 1_000_000
BYTES_PER_TOKEN = 4


def git(repo, *args):
    try:
        r = subprocess.run(["git", "-C", str(repo), *args],
                           capture_output=True, text=True, timeout=20)
        return r.stdout.strip() if r.returncode == 0 else ""
    except (OSError, subprocess.SubprocessError):
        return ""


def repo_state(repo):
    if not (repo / ".git").exists():
        return None
    # `git status --short` is XY<space>path: the status field is exactly TWO columns, and
    # slicing three ate the first letter of every path whose X column was set.
    dirty = [l[2:].strip() for l in git(repo, "status", "--short").splitlines() if l.strip()]
    st = {
        "path": str(repo),
        "head": git(repo, "log", "--oneline", "-1"),
        "branch": git(repo, "rev-parse", "--abbrev-ref", "HEAD"),
        "dirty": dirty,
        "unparseable": [],
    }
    # A dirty .js that does not parse is very likely a half-applied edit. This is the whole
    # reason the tool exists, so it is checked rather than assumed.
    for f in dirty:
        if not f.endswith(".js"):
            continue
        p = repo / f
        if not p.exists():
            continue
        try:
            r = subprocess.run(["node", "--check", str(p)],
                               capture_output=True, text=True, timeout=20)
            if r.returncode != 0:
                st["unparseable"].append(f)
        except (OSError, subprocess.SubprocessError):
            pass          # no node here: absence of a check is not evidence of a problem
    return st


def context_estimate(transcript):
    """Live context, measured from the LAST compaction boundary.

    The transcript accumulates across compactions -- it is the session's whole history, not
    what is currently in the window. Sizing the file gave 599% of budget on first run, which
    is worse than no number at all: a gauge that reads impossible trains you to ignore it.
    Claude Code writes a `{"type":"system","subtype":"compact_boundary"}` record at each
    compaction, so live context is the bytes after the last one.
    """
    p = pathlib.Path(transcript)
    if not p.exists():
        return None
    total, last_boundary = 0, 0
    try:
        with p.open("r", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                b = len(line.encode("utf-8"))
                if '"compact_boundary"' in line:
                    last_boundary = total          # boundary starts here; count from it
                total += b
    except OSError:
        return None
    live = total - last_boundary
    tok = live // BYTES_PER_TOKEN
    return {"bytes": live, "session_bytes": total, "compacted": last_boundary > 0,
            "est_tokens": tok, "pct": round(100 * tok / BUDGET_TOKENS, 1)}


# Register the work is actually done in. Same list harvest.py uses, deliberately: a finding
# and an indexable line are the same object seen at two moments.
FINDING_RX = __import__("re").compile(
    r"\b(muscle group|groove|flinch|seat-brace|deflation-as-rigor|independence-fetish|"
    r"rank gradient|keeper-adjacency|blind pair|honest null|null result|keeper-caught|"
    r"committee-caught|self-caught|coupling|new group|countermeasure|mention-vs-use)\b",
    __import__("re").I)


def unwritten_findings(transcript, limit=8):
    """Findings produced in the live window that never reached the map.

    THE ASYMMETRY THIS EXISTS FOR. On 2026-07-27 the keeper said "there were more found by
    laptop instances and should have been put into the consonance repo. I am scared." The
    tell-index those instances built DID reach the repo; the findings did not. That is not a
    discipline gap, it is a structural one: code is written INTO the tree by default -- you
    edit a file and it is there -- while a finding lives in the conversation and only lands
    if someone transcribes it. The transcript then expires on a 30-day clock.

    So this is an absent-trigger fix, which is the only kind that works on a blind spot: at
    the moment things get lost -- the gap -- say which claims in the live window have no
    counterpart in the map. It is deliberately imprecise. Over-reporting is survivable here
    because the cost of a false positive is re-reading one sentence, and the cost of a false
    negative is a finding that exists nowhere.
    """
    import re
    p = pathlib.Path(transcript)
    mp = REPO / "exo_memory" / "muscle_map.md"
    if not p.exists() or not mp.exists():
        return None
    written = re.sub(r"\W+", " ", mp.read_text(encoding="utf-8", errors="replace").lower())

    lines, seen = [], set()
    try:
        with p.open("r", encoding="utf-8", errors="replace") as fh:
            live = False
            for line in fh:
                if '"compact_boundary"' in line:
                    lines, seen, live = [], set(), True    # restart at the newest boundary
                    continue
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if rec.get("type") != "assistant":
                    continue
                c = (rec.get("message") or {}).get("content")
                text = "\n".join(b.get("text", "") for b in c
                                 if isinstance(b, dict) and b.get("type") == "text") \
                    if isinstance(c, list) else (c if isinstance(c, str) else "")
                for sent in re.split(r"(?<=[.!?])\s+", text):
                    sent = " ".join(sent.split())
                    if len(sent) < 60 or len(sent) > 400 or not FINDING_RX.search(sent):
                        continue
                    # Is this claim already in the map? Compare on a distinctive middle slice
                    # rather than the whole sentence, which never matches verbatim.
                    key = re.sub(r"\W+", " ", sent.lower())
                    probe = " ".join(key.split()[3:11])
                    if probe and probe in written:
                        continue
                    h = probe or key[:60]
                    if h in seen:
                        continue
                    seen.add(h)
                    lines.append(sent)
    except OSError:
        return None
    if not live:
        return None
    return {"total": len(lines), "sample": lines[-limit:]}


def commitments():
    """Re-read from the masters. Never paraphrased into this file."""
    out = []
    for name in ("cycle4_handoff.md", "cycle4_preregistration.md"):
        p = REPO / "exo_memory" / name
        if p.exists():
            out.append(f"{name} (modified {datetime.datetime.fromtimestamp(p.stat().st_mtime):%Y-%m-%d %H:%M})")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--transcript", default=None)
    ap.add_argument("--trigger", default="manual")
    args = ap.parse_args()

    now = datetime.datetime.now()
    lines = [f"# Checkpoint -- {now:%Y-%m-%d %H:%M:%S} (trigger: {args.trigger})", ""]

    if args.transcript:
        ce = context_estimate(args.transcript)
        if ce:
            since = "since last compaction" if ce["compacted"] else "session so far"
            lines += [f"**Context:** ~{ce['est_tokens']:,} tokens ({ce['pct']}% of "
                      f"{BUDGET_TOKENS:,}) -- {ce['bytes']:,} bytes {since}; "
                      f"{ce['session_bytes']:,} bytes total across the whole session.", ""]
            if ce["pct"] >= 70:
                lines += ["> Approaching the wall. Land what is in flight — finish it or "
                          "revert it — before the gap, not after.", ""]

    risky = False
    for repo in WATCH:
        st = repo_state(repo)
        if st is None:
            continue
        lines.append(f"## {st['path']}  [{st['branch']}]")
        lines.append(f"- HEAD: `{st['head'] or '(none)'}`")
        if st["dirty"]:
            lines.append(f"- **{len(st['dirty'])} uncommitted file(s)** -- this IS the in-flight state:")
            lines += [f"  - `{f}`" for f in st["dirty"]]
        else:
            lines.append("- clean")
        if st["unparseable"]:
            risky = True
            lines.append("- **DOES NOT PARSE** -- almost certainly a half-applied edit. "
                         "Finish it or revert it BEFORE the gap; do not carry it across:")
            lines += [f"  - `{f}`" for f in st["unparseable"]]
        lines.append("")

    if args.transcript:
        uf = unwritten_findings(args.transcript)
        if uf and uf["total"]:
            lines += [f"## {uf['total']} claim(s) in this window with no counterpart in muscle_map.md",
                      "",
                      "Findings die in the gap far more often than code does: code is written into",
                      "the tree by default, a finding only lands if someone transcribes it. Most of",
                      "these will be restatements -- check, don't trust the count.", ""]
            lines += [f"- {s}" for s in uf["sample"]]
            lines.append("")

    c = commitments()
    if c:
        lines += ["## Standing commitments live in these files -- go read them, do not trust a summary", ""]
        lines += [f"- {x}" for x in c]
        lines.append("")

    if risky:
        lines += ["> A file in flight does not parse. The instance on the far side of this gap",
                  "> cannot tell a mid-thought from a shipped mistake. Resolve it now.", ""]

    text = "\n".join(lines)
    print(text)
    if args.write:
        OUT.write_text(text, encoding="utf-8")
        print(f"(written to {OUT})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
