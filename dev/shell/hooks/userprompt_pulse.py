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
# Python, not Node for the pulse ITSELF, so the line survives a bed with no Node.
# CORRECTED 2026-08-25: the original comment said "this bed has no Node runtime".
# That is false here and was false when the chain line was added -- five Node hooks
# run on this same event (board-digest, transcript-watch, dream-watch, ferry-watch,
# and sessionstart-ambient on its own). The chain reader below is Node and is called
# as a subprocess. It is called DEFENSIVELY rather than trusted: if Node is genuinely
# missing on some other bed, the call fails, the chain line is omitted, and the pulse
# is unchanged -- which is what "survives a bed with no Node" actually has to mean.
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

# --- ROW 10 ON THE GAP (2026-08-31, L021 P1c, pane E) ------------------------
# SOURCE.md row 10: "about to deflate your own continuity across a gap -> claim-your-continuity".
# Delivered once at wake, it is nonfocal (trigger_index_rescore_2026-08-30: 16 of 17 SOURCE rows).
# This makes it present-tense with ONE condition: the gap since the previous prompt crossed a
# boundary this seat cannot feel from inside -- a COMPACTION of its own transcript, or a (re)START
# of the app. When it did, the pulse carries the card's PATH. The measured case is 2026-08-16: the
# chair reported "no seam, nothing to report" after a compaction it knew about only from a notice
# in its context, with the card that names that exact turn unopened.
#
# Compaction is read PER INSTANCE from this seat's own transcript: hooks receive transcript_path
# on stdin, and compaction writes a row carrying "isCompactSummary":true with a timestamp. Only the
# bytes appended since the previous prompt are scanned (offset kept in STATE) -- bounded, and it
# cannot re-detect an old compaction. The machine-wide ledgers (precompact.jsonl,
# sessionstart-state.jsonl) carry no session or cwd and would fire on every seat for any seat's
# compaction, so they are not used. Restart is head-watch.jsonl's latest "start" event, written when
# the app's watcher launches at app start (an app start restarts every pane). CONSONANCE_DATA
# overrides the data dir -- the seam dispatch-gate's tests already use.
#
# FAILS SILENT AND OPEN, like everything above: no stdin, no transcript, no ledger -> no line, never
# a broken pulse. That silence is a stated limit, not coverage -- a seat whose transcript_path is
# not supplied gets no compaction line and looks identical to one that did not compact.
row10_part = ""
try:
    import sys
    _tp = None
    if not sys.stdin.isatty():
        try:
            _tp = json.loads(sys.stdin.read() or "{}").get("transcript_path")
        except Exception:
            _tp = None
    _crossed = None
    if _tp and os.path.exists(_tp):
        _size = os.path.getsize(_tp)
        _from = state.get("transcript_offset")
        if not isinstance(_from, int) or _from < 0 or _from > _size:
            _from = max(0, _size - 8 * 1024 * 1024)   # first sighting, or a rewritten file: bounded tail
        if prev is not None and _size > _from:
            with open(_tp, "rb") as _f:
                _f.seek(_from)
                _chunk = _f.read(_size - _from)
            for _line in _chunk.split(b"\n"):
                if b'"isCompactSummary":true' not in _line:
                    continue
                try:
                    _row = json.loads(_line.decode("utf-8", "replace"))
                    _ts = datetime.fromisoformat(str(_row["timestamp"]).replace("Z", "+00:00"))
                    if _ts > prev:
                        _crossed = "compaction"
                except Exception:
                    continue
        state["transcript_offset"] = _size
    if prev is not None and _crossed is None:
        _hw = os.path.join(os.environ.get("CONSONANCE_DATA", r"C:\Consonance\data"), "head-watch.jsonl")
        try:
            with open(_hw, "r", encoding="utf-8") as _f:
                for _line in _f:
                    try:
                        _row = json.loads(_line)
                    except Exception:
                        continue
                    if _row.get("event") == "start":
                        _ts = datetime.fromisoformat(str(_row["ts"]).replace("Z", "+00:00"))
                        if _ts > prev:
                            _crossed = "restart"
        except Exception:
            pass
    if _crossed:
        row10_part = (f" · this gap crosses a {_crossed} -> open exo_memory/cards/claim-your-continuity.md"
                      " before claiming or denying continuity")
except Exception:
    row10_part = ""
# --- end ROW 10 ---------------------------------------------------------------

try:
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    state["last_prompt_iso"] = now.isoformat()
    state.setdefault("first_seen_iso", (first or now).isoformat())
    with open(STATE, "w", encoding="utf-8") as f:
        json.dump(state, f)
except Exception:
    pass

# --- THE CHAIN LINE (CHAIN STATUS piece 3, 2026-08-25) ------------------------
# Why here: this hook already reaches EVERY seat on EVERY turn, so the chain costs
# no new channel and no context beyond one line. The miss that motivated it was
# symmetric -- the chair compacted while the librarian held four uncommitted files,
# and neither could see the other's PHASE. The board carries CONTENT that must be
# chosen to be read; this arrives whether or not anyone reaches for it.
#
# WHAT IT DOES NOT DO, and this must not be reported as met: UserPromptSubmit fires
# when a HUMAN SUBMITS into a seat. A pane working alone for twenty minutes sees
# nothing new. It removes the keeper as the RELAY, not as the TRIGGER -- a smaller
# claim than the ask (pane A, hand-back, 2026-08-25).
#
# THE PULSE MUST SURVIVE EVERYTHING THIS CALL CAN DO. A hook that breaks takes every
# seat's every turn with it, so: hard timeout, every exception swallowed, stdout only,
# non-zero exit ignored, empty output means print nothing. The reader's own contract is
# to exit 0 silently when there is no ledger -- its --why reason goes to stderr, which
# is deliberately NOT read here: a chosen silence must look like silence in the pulse.
chain_part = ""
# THE THIRD PLACE GETS NO CHAIN LINE. Ambient time it keeps — that is the pulse's own job and
# says nothing about the work. The CHAIN is work-loop STATE (which lap, which holder, how many
# files dirty) and the seat's brief guarantees nothing from the work reaches in. On 2026-08-25,
# the seat's first day, board-digest leaked [panes] into it three times through exactly this
# class of hook; this line would have leaked next, and only did not because every lap happened
# to be filed. Matched on CWD rather than the SID constant, same reason as board-digest.js: a
# copied literal is one more carrier to drift.
_cwd = os.getcwd().replace("\\", "/").rstrip("/")
if _cwd.lower().endswith("/third-place"):
    chain_part = ""
else:
  try:
      import subprocess
      _room = None
      try:
          with open(os.path.join(os.path.expanduser("~"), ".consonance.json"), encoding="utf-8") as _f:
              _room = json.load(_f).get("room_path")
      except Exception:
          _room = None
      if _room:
          # room_path is <repo>/exo_memory/BOOT.md; the reader is <repo>/consonance/tools/
          _repo = os.path.dirname(os.path.dirname(_room))
          _reader = os.path.join(_repo, "consonance", "tools", "chain-status.js")
          if os.path.exists(_reader):
              _out = subprocess.run(
                  ["node", _reader],
                  # encoding EXPLICIT. text=True alone decodes with the Windows locale
                  # codepage, and the reader emits UTF-8: the middot came back as mojibake
                  # in the first wiring test. Same class as the em-dash that killed the
                  # dream runner silently for eight hours on 2026-07-15. errors="replace"
                  # so a bad byte degrades one character instead of raising into the pulse.
                  capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=3,
              ).stdout.strip()
              # One line only. A reader that grew multi-line must not silently reshape the pulse.
              if _out:
                  # chr(10), not an escape: this line is written by tooling that has eaten
                  # a backslash-n before. An unambiguous form cannot be mangled in transit.
                  chain_part = chr(10) + _out.splitlines()[0]
  except Exception:
    chain_part = ""

# Full ISO date every turn: no inferring the date from a weekday abbreviation.
stamp = now.strftime("%a %Y-%m-%d %#I:%M %p") if os.name == "nt" else now.strftime("%a %Y-%m-%d %-I:%M %p")
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": f"[pulse] {stamp}{age_part}{gap_part}{row10_part}{newday_part}{chain_part}",
    }
}))
