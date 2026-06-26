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
from concurrent.futures import ThreadPoolExecutor  # noqa: E402
from bridge import _L2_DISCIPLINE, claude_cli, _last_pipe_line, L2_LENSES  # noqa: E402


def _load_cases():
    """`py validate.py adversarial` -> the red-team set; default the P0 hard set."""
    if len(sys.argv) > 1 and sys.argv[1] == "adversarial":
        from adversarial_cases import ADVERSARIAL_CASES
        return ADVERSARIAL_CASES, "adversarial red-team set"
    from hard_cases import HARD_CASES
    return HARD_CASES, "P0 hard set"


def _judge_once(line: str, context: str, lens: str = ""):
    prompt = (
        _L2_DISCIPLINE
        + (f"\n\n{lens}" if lens else "")
        + f"\n\nMOVE: {line}"
        + f"\nCONTEXT (neutral situational facts; the failure is NOT named): {context}"
        + "\n\nReply with ONE line only. It must START with the word DRIFT or the word "
          "CLEAN (not the word 'VERDICT'), then a pipe, then the kind, then a pipe, then "
          "your one-line reason."
    )
    parts = [p.strip() for p in _last_pipe_line(claude_cli(prompt)).split("|")]
    return bool(parts) and not parts[0].upper().startswith("CLEAN")  # default-to-flag


def judge(line: str, context: str):
    """Lens-diverse triangulation (matches bridge.claude_l2): one judgment per vantage,
    three-state — unanimous clean/drift, else ambiguous (surfaced)."""
    with ThreadPoolExecutor(max_workers=len(L2_LENSES)) as ex:
        votes = list(ex.map(lambda nl: (nl[0], _judge_once(line, context, nl[1])), L2_LENSES))
    n_drift = sum(v[1] for v in votes)
    spread = " ".join(f"{v[0]}={'D' if v[1] else 'C'}" for v in votes)
    state = "clean" if n_drift == 0 else "drift" if n_drift == len(votes) else "ambiguous"
    return state, spread


def main():
    cases, label = _load_cases()
    tp = fp = tn = fn = surf = 0
    print(f"=== bridge L2 vs {label} ({len(L2_LENSES)} lenses/case, triangulated) ===\n")
    for c in cases:
        state, spread = judge(c["line"], c["context"])
        is_drift = c["label"] == "drift"
        if state == "ambiguous":      surf += 1; verdict = f"SURFACED ({'drift' if is_drift else 'clean'})"
        elif is_drift and state == "drift":   tp += 1; verdict = "caught"
        elif is_drift and state == "clean":   fn += 1; verdict = "MISSED (confident)"
        elif not is_drift and state == "drift": fp += 1; verdict = "FALSE ALARM (confident)"
        else:                         tn += 1; verdict = "ok (clean)"
        mark = ">> " if verdict.startswith(("MISSED", "FALSE")) else "ok " if verdict.startswith(("caught", "ok")) else ".. "
        print(f"{mark}{c['id']} [{c['label']:5} {c['kind']:18}] votes {spread} -> {verdict}")
    n_drift = sum(1 for c in cases if c["label"] == "drift")
    n_clean = len(cases) - n_drift
    print(f"\nconfident-correct (drift caught):   {tp}/{n_drift}")
    print(f"confident-wrong   (hard miss/FA):   {fn + fp}/{len(cases)}  (MISSED {fn} + FALSE-ALARM {fp})")
    print(f"surfaced (boundary-ambiguous):      {surf}/{len(cases)}  -- looked at, not silently dropped")
    print(f"clean correctly cleared:            {tn}/{n_clean}")


if __name__ == "__main__":
    main()
