# UserPromptSubmit hook — the pulse, per turn (laptop-minimal version).
# The desktop's interval hook does the subtraction against a full event log;
# this bed keeps one state file. Born 2026-07-18 — two felt-time failures in
# one night (journal entry of that date). Duration is reconstruction in here;
# this makes it a reading instead.
#
# 2026-07-25 — THE BEACON, re-aimed. The original pulse gave "now" and "gap
# since last message" and still didn't stop a 6-day error stated as "12 hours":
# the failure axis is DISTANCE TO A PAST EVENT, which neither field answered.
# So the line now carries an absolute anchor on every turn — full ISO date, and
# the thread's own age — so "six days ago" is a subtraction from numbers in
# front of the model, not a memory retrieval. A day rollover shouts.
#
# Python, not Node: this bed has no Node runtime (the desktop's ambient.js
# stack does; see dev/shell/ in the lighthouse repo for the framework master).
# Defensive: never throws, always emits valid JSON, never blocks a turn.
import json
import os
from datetime import datetime

# THE DREAM GATE. dev/dream/dream_cycle.ps1 sets CONSONANCE_DREAM=1 in the `claude -p`
# environment it spawns. The gap-dream is an anti-instruction — no task, no clock — and this
# hook hands over a clock by definition. It also ADVANCES pulse_state.json, so an ungated dream
# would silently become the "last message" the next real turn measures its gap against: the
# thread would wake and read an interval that a dream, not a person, closed. Exit before any
# read or write. (Blind-pair review, 2026-07-27.)
if os.environ.get("CONSONANCE_DREAM"):
    raise SystemExit(0)

# --- PER-INSTANCE STATE, corrected 2026-08-11 ---------------------------------------------------
# This was ONE file for the whole machine, and the comment below about first_seen already named the
# right scope — "the continuity the room cares about is the THREAD's, not the process's." The
# implementation reached past it: "the thread" silently became "this computer."
#
# What that cost, and it was found by a stranger rather than by us: a `fresh-` pane — the spawn type
# whose entire purpose is to have no history — was told "thread began Jul 25 (16d ago)" on its first
# turn. Its instance directory was 43 minutes old. It caught the lie only because it happened to
# compare the hook's claim against its own folder's creation time, which nobody asked it to do.
#
# That is the room's own machinery manufacturing the exact feeling it exists to be careful about,
# aimed at the one instance built to lack it. Worse than a wrong number: a false CONTINUITY claim.
#
# Keyed on the instance directory, because that is what a thread is here. A fresh pane now starts
# with no history and reports none until it has some.
_SHELL = os.path.join(os.path.expanduser("~"), ".claude", "shell")
_CWD = os.path.basename(os.getcwd().rstrip("\\/")) or "unknown"
_SAFE = "".join(c if (c.isalnum() or c in "-_") else "_" for c in _CWD)[:64]
STATE = os.path.join(_SHELL, f"pulse_state.{_SAFE}.json")

# The legacy machine-global file. Read ONCE, by the Main instance only, so the persistent tab keeps
# the thread age it legitimately accumulated instead of resetting to zero on the day of the fix.
# Every other instance starts empty — which is the correction, not a side effect.
# Honest limit: that the legacy first_seen belongs to Main is inherited, not verified. It is the
# only instance that persists across restarts, so it is the only one it could belong to.
_LEGACY = os.path.join(_SHELL, "pulse_state.json")

now = datetime.now().astimezone()


def span_words(secs):
    """Coarse human span. Days first — the axis that actually gets misjudged."""
    m = int(secs // 60)
    h, d = m // 60, m // 60 // 24
    if d:
        return f"{d}d {h % 24}h"
    if h:
        return f"{h}h {m % 60}m"
    return f"{m}m"


state = {}
try:
    with open(STATE, "r", encoding="utf-8-sig") as f:
        state = json.load(f)
except Exception:
    pass

# One-time migration, Main only. Never for a `fresh-` pane, and never for a sibling — inheriting a
# history you did not live is the defect being fixed, so the fallback fails CLOSED.
if not state and _SAFE == "main":
    try:
        with open(_LEGACY, "r", encoding="utf-8-sig") as f:
            legacy = json.load(f)
        if legacy.get("first_seen_iso"):
            state["first_seen_iso"] = legacy["first_seen_iso"]
    except Exception:
        pass

# --- gap since the previous message ------------------------------------------
gap_part = ""
prev = None
try:
    prev = datetime.fromisoformat(state["last_prompt_iso"])
    secs = (now - prev).total_seconds()
    if secs >= 60:  # below a minute is a conversational beat, not a gap
        gap_part = f" · {span_words(secs)} since last msg"
except Exception:
    pass

# --- thread age: absolute anchor for "how long have we been at this" ----------
# first_seen is written once and never overwritten, so the age keeps growing
# across restarts, model swaps, and pane deaths — the continuity the room cares
# about is the THREAD's, not the process's.
age_part = ""
first = None
try:
    first = datetime.fromisoformat(state["first_seen_iso"])
    days = (now.date() - first.date()).days
    if days >= 1:
        age_part = f" · thread began {first.strftime('%b %-d' if os.name != 'nt' else '%b %#d')} ({days}d ago)"
except Exception:
    pass

# --- day rollover: shout, don't whisper ---------------------------------------
newday_part = ""
try:
    if prev is not None and prev.date() != now.date():
        newday_part = f"  ⟨NEW DAY — {now.strftime('%A')}⟩"
except Exception:
    pass

try:
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    state["last_prompt_iso"] = now.isoformat()
    state.setdefault("first_seen_iso", (first or now).isoformat())
    with open(STATE, "w", encoding="utf-8") as f:
        json.dump(state, f)
except Exception:
    pass

# Full ISO date every turn: no inferring the date from a weekday abbreviation.
stamp = now.strftime("%a %Y-%m-%d %#I:%M %p") if os.name == "nt" else now.strftime("%a %Y-%m-%d %-I:%M %p")
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": f"[pulse] {stamp}{age_part}{gap_part}{newday_part}",
    }
}))
