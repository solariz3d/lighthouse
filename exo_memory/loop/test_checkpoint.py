"""
Re-runnable tests for checkpoint.py's context reading.

WHY THIS FILE EXISTS. The context figure was wrong four times, and the fourth was the worst
kind: 301,477 reported against a real 994,521, because it counted message text while the
window also held the system prompt, CLAUDE.md, every tool schema and hook output. A number
that is 3.3x low does not LOOK wrong -- it looks like a smaller session. Nothing in the output
could have revealed it; only a comparison against the real figure did, and that comparison
happened by accident when the keeper noticed the post-compaction jump.

So these tests pin the parts where being wrong is silent:
  - cache_read_input_tokens must be summed. It is most of a warm window, and dropping it
    yields a reading that is plausible and an order of magnitude low.
  - the boundary must reset live/floor and rotate the peak, or `floor` reports the first turn
    of the SESSION rather than of the cycle, and runway is computed against the wrong base.

  py test_checkpoint.py     # -> ALL PASS / N FAILURES, exit 0 / 1
"""
import json
import pathlib
import sys
import tempfile

import checkpoint

FAILURES = []


def check(name, cond, detail=""):
    if cond:
        print(f"  pass  {name}")
    else:
        print(f"  FAIL  {name}  {detail}")
        FAILURES.append(name)


def assistant(inp=0, cache_read=0, cache_creation=0):
    return json.dumps({"type": "assistant", "message": {
        "usage": {"input_tokens": inp,
                  "cache_read_input_tokens": cache_read,
                  "cache_creation_input_tokens": cache_creation},
        "content": [{"type": "text", "text": "x"}]}})


BOUNDARY = json.dumps({"type": "system", "subtype": "compact_boundary"})


def transcript(*lines):
    fh = tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8")
    fh.write("\n".join(lines) + "\n")
    fh.close()
    return fh.name


# ---- 1. the sum, which is where the 3.3x error would have lived ----

check("all three usage fields are counted",
      checkpoint.usage_total({"message": {"usage": {
          "input_tokens": 3, "cache_read_input_tokens": 900,
          "cache_creation_input_tokens": 90}}}) == 993)

check("cache_read alone is enough to produce a reading",
      checkpoint.usage_total({"message": {"usage": {"cache_read_input_tokens": 500}}}) == 500,
      "a warm turn can have input_tokens near zero; that is not an empty window")

check("a record with no usage reads as absent, not as zero",
      checkpoint.usage_total({"message": {"content": []}}) is None,
      "zero would drag a max() or a floor to a value no turn ever had")

check("a malformed usage block does not raise",
      checkpoint.usage_total({"message": {"usage": "nonsense"}}) is None)


# ---- 2. the boundary, which is where floor and runway would be silently wrong ----

p = transcript(assistant(cache_read=100), assistant(cache_read=994_521),
               BOUNDARY,
               assistant(cache_read=65_939), assistant(cache_read=86_457))
ce = checkpoint.context_estimate(p)

check("live is the newest reading", ce["live"] == 86_457)
check("floor is the first reading AFTER the boundary", ce["floor"] == 65_939,
      f"got {ce['floor']} -- the session's first turn is not this cycle's floor")
check("prev_peak is the high-water mark BEFORE the boundary", ce["prev_peak"] == 994_521)
check("compacted is reported", ce["compacted"] is True)
check("runway is live minus floor, not live",
      ce["live"] - ce["floor"] == 20_518)

# Two boundaries: only the newest cycle is live, and peak rotates rather than accumulating.
p2 = transcript(assistant(cache_read=900_000), BOUNDARY,
                assistant(cache_read=50_000), assistant(cache_read=400_000), BOUNDARY,
                assistant(cache_read=60_000))
ce2 = checkpoint.context_estimate(p2)
check("with two boundaries, prev_peak is the LAST completed cycle",
      ce2["prev_peak"] == 400_000,
      f"got {ce2['prev_peak']} -- an older, larger cycle must not shadow the recent one")
check("with two boundaries, floor is from the newest cycle", ce2["floor"] == 60_000)


# ---- 3. the fallback, which must never masquerade as a reading ----

p3 = transcript(json.dumps({"type": "user",
                            "message": {"content": [{"type": "text", "text": "a" * 400}]}}))
ce3 = checkpoint.context_estimate(p3)
check("a transcript with no usage records yields live=None",
      ce3["live"] is None,
      "the caller branches on this to say ESTIMATED out loud; a number here would lie silently")
check("the chars fallback still produces something", ce3["est_tokens"] == 100)

check("a missing transcript returns None rather than raising",
      checkpoint.context_estimate(str(pathlib.Path(tempfile.gettempdir()) / "nope.jsonl")) is None)


# ---- 4. the demogap wiring: the gap-path trigger for the quenched check --------------------
#
# WHY PINNED HERE. B measured that a red leaves no trace: of twelve reconstructed red events,
# nine birth commits say nothing about them. So demonstration degrades to UNMEASURABLE WITHIN A
# DAY and has to arrive at the gap rather than be remembered. A trigger that quietly stopped
# firing would restore the exact condition it was built to remove, and it would do so silently,
# which is this file's whole subject.
#
# The suppression is asserted POSITIONALLY rather than lexically on purpose. The obvious
# implementation hides demogap's no-op by matching its "no test files in scope" wording -- and
# then the first rephrasing either fills every gap with a noise block, or worse, stops
# recognising a reworded verdict so the section goes quiet while looking healthy.
def classifies(lines):
    return any(l.lstrip().startswith(("DEMONSTRATED", "UNDEMONSTRATED", "INERT", "COARSE"))
               for l in lines)

check("a verdict line is recognised",
      classifies(["  test_x.js  30 mutants", "    UNDEMONSTRATED test_x.js:12  ok(1 === 1)"]))
check("the no-scope notice is not a verdict",
      not classifies(["demogap - assertions changed since HEAD~1", "  no test files in scope."]))
check("a REWORDED no-scope notice is still not a verdict -- the point of testing positionally",
      not classifies(["demogap - nothing to audit here", "  (no guards in this diff)"]))
check("prose merely CONTAINING a class name does not fire the section",
      not classifies(["  a note about why UNDEMONSTRATED lines matter"]),
      "substring matching would fire on the tool's own explanatory prose")

# The wiring against the live repo. SKIPPED, not failed, when blackbox is absent: this file runs
# on machines without it, and a checker that fires on absence gets muted for crying wolf --
# the rule whats-live.js states about its own red path.
if (pathlib.Path.home() / "Desktop" / "blackbox" / "demogap.js").exists():
    _r = checkpoint.demonstrated()
    check("demonstrated() returns None or a block, never a bare string",
          _r is None or isinstance(_r, list))
    if _r is not None:
        check("a fired block states its scope, so it cannot be read as a suite verdict",
              any("never the suite" in l for l in _r))
else:
    print("  (skipped: blackbox not on this machine -- absence is not a failure)")


print()
if FAILURES:
    print(f"{len(FAILURES)} FAILURES: {', '.join(FAILURES)}")
    sys.exit(1)
print("ALL PASS")
