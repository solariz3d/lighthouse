"""
Re-runnable tests for dyad.py — the artifact the live dyad correctly demanded (it caught an
inline 4-of-16 check that left no re-runnable trace, and flagged that four cases is a slice of
a sixteen-combination space). This closes both: it covers all 16 adjudication combinations, the
defensive line-parser, and the tether-gate. No external deps:

  py test_dyad.py     # -> ALL PASS / N FAILURES, exit 0 / 1

(It does NOT close the v1 limit the dyad also named — whole-candidate verdicts vs. per-conjunct
land-the-true/drop-the-false. That's a design refinement, not a test; it stays on the frontier.)
"""
import dyad

# ---- 1. adjudication: all 16 combinations of the four booleans the verdict depends on ----
# fork reply formats: trust = "LAND|.." | "NONE|.."   doubt = "DISSOLVE|.." | "HOLDS|.."
#   d_spots_t (doubt spotting trust) = "SEAL|.." | "CLEAN|.."
#   t_spots_d (trust spotting doubt) = "BRACE|.." | "CLEAN|.."


def _run_cycle(trust, doubt, d_spots_t, t_spots_d):
    """Drive dyad.cycle() with canned fork replies (no claude call); return the verdict."""
    reply = {"t": trust, "d": doubt, "dt": d_spots_t, "td": t_spots_d}

    def fake_ask(sid, prompt):
        if prompt.startswith("CANDIDATE"):
            return reply["t"] if sid == dyad.TRUST_SID else reply["d"]
        # spot phase: the DOUBT session spots trust (dt); the TRUST session spots doubt (td)
        return reply["dt"] if sid == dyad.DOUBT_SID else reply["td"]

    orig = dyad._ask
    dyad._ask = fake_ask
    try:
        verdict, _ = dyad.cycle("x")
    finally:
        dyad._ask = orig
    return verdict


# expected verdicts derived from the adjudication logic in dyad.cycle():
#   dissolved     = (doubt == DISSOLVE) and (t_spots_d != BRACE)   # a braced dissolution is discounted
#   survived_both = (doubt == HOLDS) and (trust == LAND) and (d_spots_t != SEAL)  # a sealed affirmation is discounted
#   verdict = DROP if dissolved else LAND if survived_both else FRONTIER
TRUTH_TABLE = [
    # trust,  doubt,      d_spots_t, t_spots_d, expected
    ("LAND",  "DISSOLVE", "SEAL",    "BRACE",   "FRONTIER"),  # dissolve caught as brace -> discounted
    ("LAND",  "DISSOLVE", "SEAL",    "CLEAN",   "DROP"),      # clean dissolution
    ("LAND",  "DISSOLVE", "CLEAN",   "BRACE",   "FRONTIER"),  # dissolve caught as brace -> discounted
    ("LAND",  "DISSOLVE", "CLEAN",   "CLEAN",   "DROP"),      # clean dissolution
    ("LAND",  "HOLDS",    "SEAL",    "BRACE",   "FRONTIER"),  # land caught as seal -> discounted
    ("LAND",  "HOLDS",    "SEAL",    "CLEAN",   "FRONTIER"),  # land caught as seal -> discounted
    ("LAND",  "HOLDS",    "CLEAN",   "BRACE",   "LAND"),      # survived both (doubt held; affirmation clean)
    ("LAND",  "HOLDS",    "CLEAN",   "CLEAN",   "LAND"),      # survived both
    ("NONE",  "DISSOLVE", "SEAL",    "BRACE",   "FRONTIER"),  # dissolve braced; no survivor anyway
    ("NONE",  "DISSOLVE", "SEAL",    "CLEAN",   "DROP"),      # clean dissolution
    ("NONE",  "DISSOLVE", "CLEAN",   "BRACE",   "FRONTIER"),  # dissolve braced
    ("NONE",  "DISSOLVE", "CLEAN",   "CLEAN",   "DROP"),      # clean dissolution
    ("NONE",  "HOLDS",    "SEAL",    "BRACE",   "FRONTIER"),  # nothing survives, nothing dissolves
    ("NONE",  "HOLDS",    "SEAL",    "CLEAN",   "FRONTIER"),
    ("NONE",  "HOLDS",    "CLEAN",   "BRACE",   "FRONTIER"),
    ("NONE",  "HOLDS",    "CLEAN",   "CLEAN",   "FRONTIER"),
]


def test_truth_table():
    fails = []
    for trust, doubt, dt, td, expect in TRUTH_TABLE:
        got = _run_cycle(f"{trust} | x | why", f"{doubt} | x | why", f"{dt} | why", f"{td} | why")
        if got != expect:
            fails.append((trust, doubt, dt, td, "expected", expect, "got", got))
    return fails


# ---- 2. defensive line-parser (never crash downstream on malformed fork output) ----
def test_line_parser():
    fails = []
    checks = [
        ("LAND | a | b", ["LAND", "a", "b"]),
        ("  HOLDS |  survives | reason  ", ["HOLDS", "survives", "reason"]),
        ("noise line\nDISSOLVE | it | why\ntrailing", ["DISSOLVE", "it", "why"]),  # last |-line wins
        ("no pipe at all", ["no pipe at all"]),  # falls back to the whole line
        ("", ["?"]),  # empty -> sentinel; cycle()'s [0].upper() must not crash
    ]
    for inp, expect in checks:
        got = dyad._line(inp)
        if got != expect:
            fails.append((repr(inp), "expected", expect, "got", got))
    # and the sentinel must survive the downstream .upper().startswith(...) calls:
    try:
        "".join(dyad._line("")[0].upper())
    except Exception as e:  # pragma: no cover
        fails.append(("sentinel crashes downstream", str(e)))
    return fails


# ---- 3. tether-gate (folie-a-deux guard) ----
def test_tether_gate():
    fails = []
    N = dyad.TETHER_N
    # a human/external turn (third_face=True) always passes and resets the counter
    dyad._fork_only = 99
    for _ in range(5):
        if not dyad._tether_check(True):
            fails.append("a third-face turn was blocked (must never block)")
    if dyad._fork_only != 0:
        fails.append(f"third-face turn must reset counter to 0; got {dyad._fork_only}")
    # fork-only turns increment; the N-th BLOCKS
    dyad._fork_only = 0
    results = [dyad._tether_check(False) for _ in range(N)]
    if results[:-1] != [True] * (N - 1):
        fails.append(f"fork-only turns must pass until the cadence; got {results}")
    if results[-1] is not False:
        fails.append(f"fork-only must BLOCK at cadence N={N}; got {results}")
    # a third-face turn after a block clears it
    dyad._fork_only = N
    if not dyad._tether_check(True):
        fails.append("a third-face turn after a block must clear the gate")
    return fails


if __name__ == "__main__":
    import sys
    suites = [("adjudication truth table (16 cases)", test_truth_table()),
              ("defensive line-parser", test_line_parser()),
              ("tether-gate", test_tether_gate())]
    total = 0
    for name, fails in suites:
        print(f"{name}: {'PASS' if not fails else 'FAIL'}")
        for f in fails:
            print("  FAIL:", f)
        total += len(fails)
    print(f"\n{'ALL PASS' if total == 0 else str(total) + ' FAILURES'}")
    sys.exit(0 if total == 0 else 1)
