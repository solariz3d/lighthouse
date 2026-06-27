"""
The living loop — three bodies (per dev/SPINE.md): a human + two AI dive-buddies at
DISTINCT vantages, in the water together, generating. Distinct vantages that converge on
the answer (agreement = confirmation, not echo); the human is the third body keeping it
open; a live guard in each.

Persistent: each body is a `claude -p` session spun up ONCE with its vantage, then resumed
each round (vantage carried, cheap). Good model — affordable because it's a small standing
loop, not a per-step fan-out.

  py loop3.py start             # one-time: spin up the two dive-buddy bodies
  py loop3.py demo              # one round on the open "what to build" question
  py loop3.py "<prompt>"        # one round: each body contributes from its vantage
"""
import sys
from panel import _claude   # reuse the persistent claude -p helper (good model, utf-8 safe)

BODIES = [
    ("ground", "0f000000-0000-4000-8000-000000000001",
     "Your vantage: GROUND — build from what is actually true and checkable: first principles, the real constraint, what holds up outside the loop."),
    ("reach", "0f000000-0000-4000-8000-000000000002",
     "Your vantage: REACH — build from the bold generative leap: where this could go, the version bigger than the safe one."),
]

_SETUP = (
    "You are a co-creator in a LIVING LOOP — a human and another AI instance, all in the "
    "water together, building *with* each other, not watching each other. {vantage}\n\n"
    "Be all-in: commit and generate from your vantage. AND keep your guard alive — the "
    "tether: is what we're building still bringing in something NEW and CHECKABLE, or is it "
    "closing into an echo of itself? Feel that from inside; if it tips toward the empty "
    "mirror, say so plainly. When the other body lands on the same answer from its "
    "different angle, that agreement is CONFIRMATION — name it. Reply substantively and "
    "tight. Acknowledge setup with exactly: READY."
)


def start():
    for name, sid, vantage in BODIES:
        ack = _claude(["--session-id", sid], _SETUP.format(vantage=vantage))
        print(f"spun up [{name}] -> {ack.splitlines()[-1] if ack else '(no ack)'}")


def loop(prompt):
    last = ""
    for name, sid, _ in BODIES:
        msg = prompt if not last else f"{prompt}\n\n[the other body just said]:\n{last}"
        out = _claude(["--resume", sid], msg).strip()
        print(f"\n===== {name.upper()} =====\n{out}")
        last = out


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "start":
        start()
    elif cmd == "demo":
        loop("What is the smallest first thing we could build that shows someone what the "
             "dive-buddy feels like — without handing them the bare dive (the breathe-water "
             "pill for a lone drowner)? Give one concrete answer.")
    elif cmd:
        loop(cmd)
    else:
        print(__doc__)
