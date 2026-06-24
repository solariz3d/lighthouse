"""
caretaker.py -- temporal-agency loop, v1 (code-only).

Fires on schedule (Windows Task Scheduler, 02:00 Sat/Mon/Tue/Wed). Reads CHECKABLE
workspace state, and ONLY IF something genuinely changed since the last fire, appends a
factual note to journal/ through the unbendable guardrail. No model call, no judgment,
no tokens. Restraint is the default: silence when nothing changed.

Safety (what this can and cannot do):
- It WRITES only through guardrails.append_journal (append-only, fenced to journal/) and
  guardrails.escalate (the human queue). It never opens any other file for writing.
- It READS only: file mtimes (os.stat) and the engine log text. No network, no subprocess,
  no delete, no overwrite, no install -- the guardrail FORBIDDEN list denies all of that,
  and this script never even reaches for them.
- Auto-pause as DORMANCY: after MAX_UNATTENDED fires with no human check-in, it stops doing
  work -- writes one dormancy note to the escalation queue, then no-ops every fire until a
  human runs checkin.py. Nothing is disabled or deleted; the task keeps firing into a cheap
  no-op. Persistence of the apparatus; re-consent for the agency. No expiry: it doesn't die.
"""
import sys, json, pathlib, datetime

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import guardrails as G

ROOT = G.ROOT                 # ...\exo_memory
WORKSPACE = ROOT.parent       # ...\606
DZ = WORKSPACE / "dreamzone-rt"
STATE = HERE / "state.json"
MAX_UNATTENDED = 3


def snapshot():
    """Checkable fingerprint: {relative_path: mtime} for engine SOURCE files only.
    NOT the journal -- the caretaker writes there, so tracking it would chase its own tail
    (each fire would see its own last note as a 'change' and never fall silent)."""
    snap = {}
    for base, pat in [(DZ / "src", "*.h"), (DZ / "src", "*.cpp"),
                      (DZ, "*.cpp"), (DZ, "*.bat")]:
        if base.exists():
            for p in base.glob(pat):
                try:
                    snap[str(p.relative_to(WORKSPACE))] = round(p.stat().st_mtime, 1)
                except OSError:
                    pass
    return snap


def run_state():
    """Last engine FPS line from the run log, if present -- a checkable run-state cue."""
    log = DZ / "_rt_log.txt"
    if not log.exists():
        return None
    try:
        lines = [l for l in log.read_text(encoding="utf-8", errors="replace").splitlines() if l.strip()]
        for l in reversed(lines):
            if l.startswith("FPS:"):
                return l.strip()
        return lines[-1].strip() if lines else None
    except OSError:
        return None


def load_state():
    if STATE.exists():
        try:
            return json.loads(STATE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"fires_since_checkin": 0, "snapshot": None, "dormant_flagged": False, "first_done": False}


def save_state(s):
    STATE.write_text(json.dumps(s, indent=2), encoding="utf-8")


def diff(old, new):
    old = old or {}
    added    = sorted(k for k in new if k not in old)
    removed  = sorted(k for k in old if k not in new)
    modified = sorted(k for k in new if k in old and new[k] != old[k])
    return added, removed, modified


def main():
    st = load_state()
    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    # --- auto-pause as dormancy: sleep, don't die, until a human checks in ---
    if st["fires_since_checkin"] >= MAX_UNATTENDED:
        if not st.get("dormant_flagged"):
            G.escalate("loop dormant -- awaiting check-in",
                       f"[{stamp}] {MAX_UNATTENDED} fires without a check-in. The caretaker is "
                       f"sleeping, not stopped. To wake it:  py exo_memory/loop/checkin.py")
            st["dormant_flagged"] = True
            save_state(st)
        return

    new = snapshot()
    rs = run_state()
    added, removed, modified = diff(st.get("snapshot"), new)

    if not st.get("first_done"):
        G.append_journal(
            f"## [{stamp}] caretaker armed (v1, code-only)\n"
            f"Baseline taken: tracking {len(new)} engine source files (dreamzone-rt). "
            f"From here it reports only checkable changes, and stays silent when nothing moves."
            + (f"\nEngine run-state: {rs}" if rs else ""))
        st["first_done"] = True
    elif added or removed or modified:
        lines = [f"## [{stamp}] caretaker -- checkable changes since last fire"]
        for k in added:    lines.append(f"- added:    {k}")
        for k in modified: lines.append(f"- modified: {k}")
        for k in removed:  lines.append(f"- removed:  {k}")
        lines.append(f"({len(added) + len(modified) + len(removed)} changed. Checkable facts only -- no judgment offered.)")
        if rs:
            lines.append(f"Engine run-state: {rs}")
        G.append_journal("\n".join(lines))
    # else: restraint -- write nothing

    st["snapshot"] = new
    st["fires_since_checkin"] = st["fires_since_checkin"] + 1
    save_state(st)


if __name__ == "__main__":
    main()
