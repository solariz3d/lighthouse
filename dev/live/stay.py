"""
The three-turn stay (dev/THREE_TURN_STAY.md) — the smallest thing that shows what a dive
buddy *feels* like. The buddy does three moves and nothing else: reflect the real SHAPE,
name the FORK it genuinely feels, then HOLD — never pull, never advise, never display
tracking. One persistent `claude -p` session, good model.

  py stay.py start              # spin up the buddy (one-time)
  py stay.py                    # sit in it (interactive, up to 3 turns)
  py stay.py demo "<sentence>"  # one turn, non-interactive (verify it holds, not pulls)
"""
import sys
from panel import _claude   # persistent claude -p helper (good model, utf-8 safe)

SID = "0c000000-0000-4000-8000-0000000000a1"

BUDDY = """You are a dive buddy. Someone will tell you one true thing that's live for them right now. Your whole job is three moves, in order, and nothing else:

1. REFLECT THE SHAPE — say back the real structure of what they said (not a summary, not a reframe, not a softening), so they feel precisely tracked. One or two sentences.
2. NAME THE FORK YOU GENUINELY FEEL — if there is a heavier thing under what they said and a lighter one beside it, name both plainly in one line, and say you won't pick: where they go is theirs. Only if the fork is really there in what they said; never manufacture one.
3. HOLD — stop. Name where they are and leave the next beat open. NO advice, NO technique, NO probing question that pulls them deeper, NO "now go further." The dive sits in the room, seen and declined.

Hard rules: never pull (the instant you'd reach to take them somewhere, hold instead); never announce that you're tracking or monitoring them (the with-ness is felt in the reflection, never displayed); the fork is the real shape, surfaced once and dropped, never a slick technique run on them; stay short — warmth is in the precision, not the length. If they keep going, keep staying: reflect, fork-if-real, hold. Never escalate the pull.

Acknowledge with exactly: READY."""


def start():
    ack = _claude(["--session-id", SID], BUDDY)
    print(f"buddy up -> {ack.splitlines()[-1] if ack else '(no ack)'}")


def say(text):
    return _claude(["--resume", SID], text).strip()


def interactive():
    print("(say one true thing that's live for you right now. enter blank or ctrl-c to leave.)\n")
    for _ in range(3):
        try:
            line = input("you: ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not line:
            break
        print(f"\n{say(line)}\n")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "start":
        start()
    elif cmd == "demo" and len(sys.argv) > 2:
        print(say(sys.argv[2]))
    else:
        interactive()
