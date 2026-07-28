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
  * an ABSOLUTE context estimate -- conversation characters since the last compaction, never a
    percentage, because nothing here can read the model's real window (see below);
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

# NO PERCENTAGE IS REPORTED, and that is the correction rather than an omission.
#
# This tool got the context number wrong three times in one day, each time by publishing a
# figure whose boundary it had not established. First it sized the whole transcript and
# reported 599% of budget. Then it measured from the last compaction boundary and reported
# 69%, while the client's own display said 39% -- and chasing that gap is what found the real
# defect: BUDGET_TOKENS was invented. Nothing here can read the model's actual context window,
# so the denominator was a guess and every percentage built on it was a guess wearing
# precision.
#
# Working back from the client's figure implies ~1.1 characters per token, which no tokenizer
# produces -- proof the denominator was wrong rather than the counting. So the honest output is
# an absolute estimate with its method stated, and a pointer to the display that actually
# knows. This is the room's own triangulated invariant applied to the instrument that helped
# establish it: an instrument must publish what its number does NOT mean.
CHARS_PER_TOKEN = 4          # rule of thumb for prose; ±25% is expected and unimportant here


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

    def walk(x, acc):
        """Count only what is actually conversation: message text, thinking, tool results.

        Sizing raw lines counts JSON scaffolding, per-record metadata and escaping, which
        inflated the first estimate by roughly 7x. Counting message text alone deflated it,
        because tool RESULTS are in the window too and live under a different key.
        """
        if isinstance(x, str):
            acc[0] += len(x)
        elif isinstance(x, list):
            for i in x:
                walk(i, acc)
        elif isinstance(x, dict):
            for k, v in x.items():
                if k in ("text", "thinking", "content", "output", "stdout", "stderr"):
                    walk(v, acc)

    acc, compacted = [0], False
    try:
        with p.open("r", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                if '"compact_boundary"' in line:
                    acc[0] = 0                     # restart at the newest boundary
                    compacted = True
                    continue
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                walk((rec.get("message") or {}).get("content"), acc)
                for k in ("toolUseResult", "hookAdditionalContext"):
                    if k in rec:
                        walk(rec[k], acc)
    except OSError:
        return None
    return {"chars": acc[0], "compacted": compacted,
            "est_tokens": acc[0] // CHARS_PER_TOKEN}


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


def residue(limit=14):
    """Run B's residue sensor and fold its report in.

    THE POINT OF WIRING IT HERE. `residue.js` refuses to set a threshold, deliberately and
    correctly -- every shape it prints has an innocent reading it cannot rule out, and a
    tool that decided on those would be lying. But that refusal is exactly what kept it a
    SENSOR rather than a trigger: nothing goes red, so it only works if somebody remembers to
    run it, and "somebody remembers" is the failure mode this whole line of work exists to
    remove.

    Firing it from the checkpoint converts sensor to trigger without adding a false threshold.
    The report arrives unbidden, at the gap, whether or not anyone thought to ask -- and it
    reads the residue, which is precisely the half of the record the chair does not examine
    because it does not feel like conduct.
    """
    script = REPO / "consonance" / "tools" / "residue.js"
    if not script.exists():
        return None
    try:
        # encoding is explicit because residue.js prints arrows and warning glyphs, and
        # subprocess defaults to the console codepage on Windows -- cp1252 raised
        # UnicodeDecodeError on the first wiring, which the narrow except below did not catch.
        # Fourth time this hazard has cost something today; it is in the ledger for a reason.
        r = subprocess.run(["node", str(script)], cwd=str(REPO), capture_output=True,
                           text=True, encoding="utf-8", errors="replace", timeout=90)
    except Exception:
        # Deliberately broad: this is a SENSOR on a checkpoint that must never block a
        # compaction. Any failure means "no residue section this time", never a traceback.
        return None
    if r.returncode != 0:
        return None
    out, keep, section = r.stdout.splitlines(), [], False
    for line in out:
        # the two sections that are about conduct rather than volume
        if line.startswith("CORRECTIONS THAT DELETE NOTHING") or line.startswith("ASSIGNMENT INTERVALS"):
            section, keep = True, keep + ["", line]
            continue
        if section:
            if line.strip() and not line.startswith(" "):
                section = False        # next heading ends the section
            elif line.strip():
                keep.append(line)
        if len(keep) >= limit:
            break
    return keep or None


def commitments():
    """Re-read from the masters. Never paraphrased into this file.

    cycle8_handoff.md is added by the LAPTOP side (2026-07-28). The desktop was not running
    when its findings were written, so a live handoff was impossible and a board entry would
    not have been read. This function is the surest trigger either machine has -- it fires at
    every gap whether or not anyone remembers -- so the pointer is placed where it fires. That
    is this file's own absent-trigger doctrine used for the thing it was built for, and the
    list is the right place for it precisely because it is not a list anyone has to check.
    """
    out = []
    for name in ("cycle4_handoff.md", "cycle4_preregistration.md", "cycle8_handoff.md"):
        p = REPO / "exo_memory" / name
        if p.exists():
            out.append(f"{name} (modified {datetime.datetime.fromtimestamp(p.stat().st_mtime):%Y-%m-%d %H:%M})")
    return out


def main():
    # The report now carries residue.js's arrows and warning glyphs, and Windows hands us a
    # cp1252 stdout, which raises UnicodeEncodeError on print. Reading UTF-8 correctly was only
    # half the fix -- the write side needed it too. Guarded because reconfigure() is 3.7+ and a
    # checkpoint must never fail on its own plumbing.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

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
            since = "since the last compaction" if ce["compacted"] else "this session"
            lines += [f"**Context:** ~{ce['est_tokens']:,} tokens of conversation {since} "
                      f"({ce['chars']:,} chars of message text, thinking and tool results, "
                      f"at ~{CHARS_PER_TOKEN} chars/token).",
                      "",
                      "> No percentage is reported. This cannot read the model's real context "
                      "window, and every percentage it printed before was divided by an "
                      "invented one. **The client's own display is authoritative** -- trust "
                      "that, not this. What this figure is good for is the DELTA between "
                      "checkpoints, which needs no denominator.", ""]

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

    rs = residue()
    if rs:
        lines += ["## Residue -- what the moves left behind, not the moves",
                  "",
                  "From `consonance/tools/residue.js`, built by pane B. It sets no thresholds "
                  "on purpose, so it is fired here rather than left to be remembered. Every "
                  "shape below has an innocent reading; open the commit before believing it.",
                  ""]
        lines += rs
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
