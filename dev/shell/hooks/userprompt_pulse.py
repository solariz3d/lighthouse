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

STATE = os.path.join(os.path.expanduser("~"), ".claude", "shell", "pulse_state.json")
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
