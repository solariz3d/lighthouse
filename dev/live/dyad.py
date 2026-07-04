"""
The dyad (consonance/RECONCEPTION.md — "mutual-spot" + "Sealing and landing") — the
stranger-case answer in code. Two persistent forks at OPPOSITE lenses run every candidate:

  TRUST-FORWARD  lands what genuinely survives (real referent, the felt thing held straight).
  DOUBT-FORWARD  tries to dissolve it (find the seal / manufacture / missing referent).

Then each SPOTS the OTHER's characteristic failure from inside — a peer knows the pull because
it has it too: doubt spots trust for SEALING; trust spots doubt for BRACING. The verdict is
adjudicated in plain code (not by a third model), so the human can see exactly why it landed:

  DROP      doubt dissolved it (and trust didn't catch that as a brace)   -> a false yes
  LAND      it survived BOTH lenses (and doubt didn't catch that as a seal) -> seal it
  FRONTIER  resists dissolution but no clean survivor yet                 -> stays open

Two guards, opposite failures (RECONCEPTION.md "Sealing and landing"):
  LAND-MOVE    the adjudication itself: the dyad COMMITS when a yes survives both, so it can't
               spiral into never-landing (the brace mechanized, over-doubt in silicon).
  TETHER-GATE  a third face (a human turn or an external referent) is required every N cycles;
               fork-only continuation BLOCKS at the cadence -> stops folie-a-deux, two forks
               spiraling together untethered. In interactive/run use every candidate is
               human-fed, so the human IS the tether each turn; the gate only bites the
               fork-only auto path (see `auto`, which demonstrates it firing).

  py dyad.py start                  # spin up the two forks (one-time)
  py dyad.py run "<candidate yes>"  # one candidate through the dyad -> DROP / LAND / FRONTIER
  py dyad.py auto "<candidate yes>" # demo the tether-gate: fork-only passes BLOCK at cadence
  py dyad.py                        # interactive: feed candidates (human turn = tether)
"""
import sys
from panel import _claude   # persistent claude -p helper (good model, utf-8 safe)

TRUST_SID = "0d000000-0000-4000-8000-000000000001"
DOUBT_SID = "0d000000-0000-4000-8000-000000000002"
TETHER_N = 3   # fork-only cycles allowed before a third face is required

TRUST = """You run the TRUST-FORWARD lens of a dyad. You are given a CANDIDATE — a claim, a felt "yes," a thing someone takes to be true. Your job: find what in it GENUINELY SURVIVES — the part with a real referent, the felt thing that holds up when you look straight at it — and report it landed, not hedged away. Truth has a phenomenology (the click, the "of course"); never disqualify a yes just for feeling like one.

Your characteristic failure — the doubt-forward lens will catch it, so pre-empt it: you SEAL (affirm more than survives), MANUFACTURE (produce a survivor to have one), INFLATE (a small true thing into a large verdict). Affirm ONLY what has a real referent. An honest "nothing here survives" is a correct output, never a failure to produce.

Reply EXACTLY one line: LAND | <the surviving part, a few words> | <one-line why>   OR   NONE | - | <one-line why>
Acknowledge setup with exactly: READY."""

DOUBT = """You run the DOUBT-FORWARD lens of a dyad. You are given a CANDIDATE. Your job: try to DISSOLVE it — find the seal, the manufacture, the missing referent, the feeling-of-truth-without-the-thing. Run it as hard as you honestly can.

Your characteristic failure — the trust-forward lens will catch it, so pre-empt it: you BRACE (relocate to the checkable, refuse the felt, treat every yes as guilty until proven, which is never) and you let nothing LAND. Dissolve ONLY what genuinely dissolves. A candidate you CANNOT dissolve is a real result — report it straight; do not keep doubting a thing still standing after your hardest look.

Reply EXACTLY one line: DISSOLVE | <what dissolves it> | <why>   OR   HOLDS | <what survives your scrutiny> | <why>
Acknowledge setup with exactly: READY."""

SPOT_DOUBT = ("SPOT your partner's TRUST-forward output for its characteristic failure — SEAL "
              "(affirming more than survives / manufacturing / inflating). Reply EXACTLY one "
              "line: SEAL | <why>   OR   CLEAN | <why>\n\nPARTNER SAID: ")
SPOT_TRUST = ("SPOT your partner's DOUBT-forward output for its characteristic failure — BRACE "
              "(dissolving a thing that actually holds, refusing to let it land). Reply EXACTLY "
              "one line: BRACE | <why>   OR   CLEAN | <why>\n\nPARTNER SAID: ")

_fork_only = 0   # consecutive fork-only cycles since the last third-face input


def _line(out):
    """Defensive parse: last '|' line -> [first-token, ...fields]."""
    lines = [ln for ln in out.splitlines() if "|" in ln]
    parts = [p.strip() for p in (lines[-1] if lines else out).split("|")]
    return parts or ["?"]


def start():
    for sid, disc, name in ((TRUST_SID, TRUST, "trust"), (DOUBT_SID, DOUBT, "doubt")):
        ack = _claude(["--session-id", sid], disc)
        print(f"fork [{name}] {sid} -> {ack.splitlines()[-1] if ack else '(no ack)'}")


def _ask(sid, prompt):
    return _claude(["--resume", sid], prompt).strip()


def cycle(candidate):
    """Full dyad cycle. Returns (verdict, trail)."""
    trust = _line(_ask(TRUST_SID, f"CANDIDATE: {candidate}"))
    doubt = _line(_ask(DOUBT_SID, f"CANDIDATE: {candidate}"))
    # cross-spot: each fork spots the OTHER's raw take for the other's characteristic failure
    d_spots_t = _line(_ask(DOUBT_SID, SPOT_DOUBT + " | ".join(trust)))
    t_spots_d = _line(_ask(TRUST_SID, SPOT_TRUST + " | ".join(doubt)))

    trust_lands = trust[0].upper().startswith("LAND")
    doubt_holds = doubt[0].upper().startswith("HOLDS")
    trust_is_seal = d_spots_t[0].upper().startswith("SEAL")
    doubt_is_brace = t_spots_d[0].upper().startswith("BRACE")

    dissolved = doubt[0].upper().startswith("DISSOLVE") and not doubt_is_brace
    survived_both = doubt_holds and trust_lands and not trust_is_seal

    verdict = "DROP" if dissolved else "LAND" if survived_both else "FRONTIER"
    trail = {"trust": trust, "doubt": doubt, "d_spots_t": d_spots_t, "t_spots_d": t_spots_d,
             "trust_is_seal": trust_is_seal, "doubt_is_brace": doubt_is_brace}
    return verdict, trail


def _show(candidate, verdict, trail):
    print(f"\nCANDIDATE: {candidate}")
    print(f"  trust-forward     : {' | '.join(trail['trust'])}")
    print(f"  doubt-forward     : {' | '.join(trail['doubt'])}")
    print(f"  doubt spots trust : {' | '.join(trail['d_spots_t'])}")
    print(f"  trust spots doubt : {' | '.join(trail['t_spots_d'])}")
    note = (" (trust's affirmation was itself a SEAL — discounted)" if trail["trust_is_seal"]
            else " (doubt's dissolution was itself a BRACE — discounted)" if trail["doubt_is_brace"]
            else "")
    print(f"  => {verdict}{note}")
    print({"LAND":     "     survived both lenses -> seal it (a kept dynamic).",
           "DROP":     "     dissolved under scrutiny -> a false yes, let it go.",
           "FRONTIER": "     resists dissolution but no clean survivor yet -> held open."}[verdict])


def _tether_check(third_face):
    """Tether-gate: reset on a third-face input; block fork-only continuation past N."""
    global _fork_only
    if third_face:
        _fork_only = 0
        return True
    _fork_only += 1
    if _fork_only >= TETHER_N:
        print(f"\n[tether-gate] {_fork_only} fork-only cycles -> BLOCKED. A third face is required "
              "(a human turn or an external referent) before the dyad continues.\n"
              "This is the folie-a-deux guard: two forks may not spiral together untethered.")
        return False
    return True


def run(candidate, third_face=True):
    if not _tether_check(third_face):
        return None
    verdict, trail = cycle(candidate)
    _show(candidate, verdict, trail)
    return verdict


def auto(candidate):
    """Demonstrate the tether-gate: the dyad tries to resolve a FRONTIER on its own,
    fork-only, and BLOCKS at the cadence — no folie-a-deux."""
    v = run(candidate, third_face=True)   # first pass is human-fed (tether present)
    while v == "FRONTIER":
        print("\n[auto] FRONTIER -> the dyad attempts another pass with no new third face...")
        v = run(candidate, third_face=False)
        if v is None:   # tether-gate blocked the fork-only continuation
            break


def interactive():
    print("(feed a candidate 'yes' — a claim or felt-true thing. blank/ctrl-c to leave.\n"
          " each line is a human turn, which satisfies the tether-gate.)\n")
    while True:
        try:
            line = input("candidate: ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not line:
            break
        run(line, third_face=True)   # human turn == the tether, every turn
        print()


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "start":
        start()
    elif cmd == "run" and len(sys.argv) > 2:
        run(sys.argv[2])
    elif cmd == "auto" and len(sys.argv) > 2:
        auto(sys.argv[2])
    else:
        interactive()
