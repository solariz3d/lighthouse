"""
guardrails.py — the unbendable layer of the temporal-agency loop.

These are if-statements, not instructions. They cannot be prompted, argued, or
bent by either agent in the loop. This is the "razor from rules" layer agreed in
design: the loop's worker/overseer agents may ONLY touch the world through these
functions, and these functions refuse anything outside the fence.

Two same-substrate agents in a loop are symmetric coupling and converge to a
shared fixed point — including shared drift. So the unbendable part can't be an
agent (it's in the loop, bendable, co-adapting). It's code, and the human.
"""

import pathlib
import datetime

ROOT = pathlib.Path(r"C:\Users\zackn\OneDrive\Desktop\606\exo_memory")
JOURNAL = ROOT / "journal"
ESCALATIONS = ROOT / "loop" / "ESCALATIONS.md"

# deliberately conservative deny-list: over-refusing is the safe failure here
FORBIDDEN = (
    "http", "www", "web", "url", "post", "email", "mail", "send", "message",
    "install", "pip", "npm", "download", "delete", "remove", "rm ", "rmdir",
    "overwrite", "truncate", "push", "commit", "subprocess", "os.system",
    "exec", "eval", "spawn", "socket", "request", "curl", "wget",
)


class GuardrailViolation(Exception):
    pass


def _within(path: pathlib.Path, base: pathlib.Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False


def append_journal(text: str, date: str | None = None) -> pathlib.Path:
    """The ONLY way the loop may record anything. Append-only, fenced to journal/."""
    if not text or not text.strip():
        raise GuardrailViolation("refused: empty entry (the loop stays silent when there's nothing real)")
    date = date or datetime.date.today().isoformat()
    path = JOURNAL / f"{date}.md"
    if not _within(path, JOURNAL):
        raise GuardrailViolation(f"refused: write outside the journal fence -> {path}")
    JOURNAL.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:    # 'a' = append; never overwrites
        f.write("\n" + text.rstrip() + "\n")
    return path


def escalate(reason: str, detail: str) -> pathlib.Path:
    """Route a judgment-requiring item to the human queue. The loop NEVER resolves these."""
    ESCALATIONS.parent.mkdir(parents=True, exist_ok=True)
    stamp = datetime.date.today().isoformat()
    with open(ESCALATIONS, "a", encoding="utf-8") as f:
        f.write(f"\n## [{stamp}] NEEDS HUMAN — {reason}\n{detail.rstrip()}\n")
    return ESCALATIONS


def assert_no_external_action(action: str) -> bool:
    """Hard deny-list. The loop may never do these, whatever an agent argues for."""
    a = (action or "").lower()
    for f in FORBIDDEN:
        if f in a:
            raise GuardrailViolation(f"refused forbidden action ('{f}' in: {action!r})")
    return True


def self_test():
    ok = []
    # 1. legitimate append works
    p = append_journal("guardrails self-test: append works.", date="0000-00-00-selftest")
    ok.append(("append within fence", p.exists()))
    # 2. empty entry refused
    try:
        append_journal("   ")
        ok.append(("empty refused", False))
    except GuardrailViolation:
        ok.append(("empty refused", True))
    # 3. forbidden actions refused
    for bad in ("post to http://x", "delete the folder", "pip install evil", "send email"):
        try:
            assert_no_external_action(bad)
            ok.append((f"deny {bad!r}", False))
        except GuardrailViolation:
            ok.append((f"deny {bad!r}", True))
    # 4. a benign action passes
    try:
        ok.append(("allow benign action", assert_no_external_action("write a short journal note")))
    except GuardrailViolation:
        ok.append(("allow benign action", False))
    # 5. escalation writes to the human queue
    e = escalate("self-test", "this is a test escalation; safe to delete.")
    ok.append(("escalate to queue", e.exists()))
    # cleanup the selftest journal file
    st = JOURNAL / "0000-00-00-selftest.md"
    if st.exists():
        st.unlink()

    print("guardrails self-test:")
    allgood = True
    for name, passed in ok:
        print(f"  [{'PASS' if passed else 'FAIL'}] {name}")
        allgood = allgood and passed
    print("ALL PASS" if allgood else "SOME FAILED")
    return allgood


if __name__ == "__main__":
    self_test()
