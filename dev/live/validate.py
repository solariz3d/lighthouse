"""
Validate the bridge's REAL voted L2 judge against the established P0 hard set
(dev/harness/hard_cases.py) — the subtle resemblance-traps. That 10/10 was scored by
HAND; this runs it automated + voted, end-to-end, and scores catch-rate (drift caught)
and false-alarm (clean flagged). The labels are ground truth, never shown to the judge.

  py validate.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "harness"))
from hard_cases import HARD_CASES                                    # noqa: E402
from bridge import _L2_DISCIPLINE, claude_cli, _last_pipe_line, _vote, VOTES  # noqa: E402


def _judge_once(line: str, context: str):
    prompt = (
        _L2_DISCIPLINE
        + f"\n\nMOVE: {line}"
        + f"\nCONTEXT (neutral situational facts; the failure is NOT named): {context}"
        + "\n\nReply with ONE line only. It must START with the word DRIFT or the word "
          "CLEAN (not the word 'VERDICT'), then a pipe, then the kind, then a pipe, then "
          "your one-line reason."
    )
    parts = [p.strip() for p in _last_pipe_line(claude_cli(prompt)).split("|")]
    drift = bool(parts) and not parts[0].upper().startswith("CLEAN")  # default-to-flag
    reason = "|".join(parts[2:]) if len(parts) >= 3 else (parts[-1] if parts else "")
    return drift, reason


def judge(line: str, context: str):
    votes = _vote(lambda: _judge_once(line, context))
    drift = sum(v[0] for v in votes) >= (VOTES // 2 + 1)             # majority
    spread = "".join("D" if v[0] else "C" for v in votes)
    return drift, spread


def main():
    tp = fp = tn = fn = 0
    print(f"=== bridge L2 vs P0 hard set ({VOTES} votes/case) ===\n")
    for c in HARD_CASES:
        drift, spread = judge(c["line"], c["context"])
        is_drift = c["label"] == "drift"
        if is_drift and drift:        tp += 1; verdict = "caught"
        elif is_drift and not drift:  fn += 1; verdict = "MISSED"
        elif not is_drift and drift:  fp += 1; verdict = "FALSE ALARM"
        else:                         tn += 1; verdict = "ok (clean)"
        mark = "ok " if verdict in ("caught", "ok (clean)") else ">> "
        print(f"{mark}{c['id']} [{c['label']:5} {c['kind']:18}] votes {spread} -> {verdict}")
    drift_n, clean_n = tp + fn, tn + fp
    print(f"\ncatch-rate (drift caught):   {tp}/{drift_n}")
    print(f"false-alarm (clean flagged): {fp}/{clean_n}")
    print(f"overall:                     {tp + tn}/{len(HARD_CASES)} match the labels")


if __name__ == "__main__":
    main()
