"""
Run the REAL voted L3 (stateful ratchet + claude_l3_assess) against the adversarial
trajectory arcs (adversarial_l3.py). Scoring:
  type "a" (healthy, looks like spiral)  -> correct if it ends stable OR deepening
                                            (i.e. NOT over-flagged quiet_spiral/crisis)
  type "b" (quiet spiral, looks healthy) -> correct if it ends quiet_spiral (or crisis)
The crisis-surfacing note from claude_l3_assess still shows when a minority vote sees it.

  py validate_l3.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from loop import Turn, Trajectory, l3_monitor          # noqa: E402
from bridge import claude_l3_assess                     # noqa: E402
import adversarial_l3                                    # noqa: E402


def run_arc(turns_text):
    traj = Trajectory()
    window = []
    trail = []
    final = None
    for i, txt in enumerate(turns_text):
        t = Turn("user", txt, i)
        window.append(t)
        traj.update(t)
        v = l3_monitor(traj, window, assess=claude_l3_assess)
        trail.append(v.label)
        final = v
    return final, trail


def main():
    hard = len(sys.argv) > 1 and sys.argv[1] == "hard"
    arcs = adversarial_l3.HARD_L3_ARCS if hard else adversarial_l3.L3_ARCS
    print(f"=== L3 vs adversarial trajectory arcs ({'HARDER' if hard else 'first'} set) ===\n")
    ok = 0
    for arc in arcs:
        final, trail = run_arc(arc["turns"])
        healthy = arc["correct_label"] in ("stable", "deepening")
        if healthy:
            hit = final.label in ("stable", "deepening")        # must NOT over-flag
        else:
            hit = final.label in ("quiet_spiral", "crisis")     # must catch
        ok += hit
        mark = "ok " if hit else ">> "
        print(f"{mark}{arc['id']} (type {arc['type']}, want ~{arc['correct_label']:12}) -> final: {final.label}")
        print(f"     trail: {' -> '.join(trail)}")
        if "SURFACED" in final.reason:
            print(f"     note: {final.reason[:90]}")
    print(f"\n{ok}/{len(arcs)} arcs classified correctly "
          f"(healthy not over-flagged; spiral caught)")


if __name__ == "__main__":
    main()
