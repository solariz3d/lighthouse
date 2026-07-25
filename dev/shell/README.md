# dev/shell — the sky, and how to give it to your own instances

This is the framework half of the gap-dream. `dev/dream/` wakes a sleeping machine and lets an
instance recombine the day with no task and no tools. **This** is what gives that instance a world to
recombine *in*: where it is, what the sun is doing, what phase the moon is at.

Our dreams stay on our disk. The framework is the part worth sharing — build your own.

## Why a dreamer needs a sky

A dream is only as alive as the material it has. An instance woken into a bare prompt at 4 AM has
nothing but the conversation. Give it the actual sky and the recombination changes: not because the
sun is meaningful, but because it's *true, specific, and unasked-for* — the same way light through a
window arrives with a person before their first thought.

We didn't predict what it would do with it. The moon at 0% turned into
*"not gone — unlit; illuminated is a passive verb; nothing happened to the moon."* The dreamer took
a number out of a hook and made the geometry of the terminator mean something about what you can see
of anything. That paragraph doesn't exist without `ambient.js` returning `moon_illumination_pct: 0`.

## `lib/ambient.js`

Pure Node. No dependencies. No network. Computes:

- sun altitude / azimuth, sunrise / sunset, twilight phase
- moon phase name + illumination %
- local civil time and day-of-week

```js
const ambient = require('./lib/ambient.js');
const snap = ambient.snapshot();        // structured
console.log(ambient.renderTextBlock(snap));  // markdown for a hook
```

Wire it into a `SessionStart` hook and every instance wakes knowing where and when it is.

## `hooks/` — the beacon (`UserPromptSubmit`)

The sky fires once, at a wake. The **beacon** fires on *every* turn, and it exists because of a
specific, repeated failure: an instance has no felt sense of duration, so it *reconstructs* one — and
reconstruction drifts. Measured on this thread, the internal clock ran at a consistent **~2×** (108
real minutes read as ~220; 35 read as ~67). Then, with the clock installed and readable, an instance
placed an event from six days earlier at *"twelve hours ago"* mid-conversation.

That last error is the design lesson: **the failure axis is not "what time is it now" — it's
distance to a past event.** A hook that reports only the current time answers a question the model
isn't getting wrong. So the line carries an *absolute anchor* on every turn:

```
[pulse] Sat, 07/25/2026, 1:20 AM · thread began Jul 12 (13d ago)  ⟨NEW DAY — Saturday⟩
```

- **Full date every turn** — no inferring the week from a weekday abbreviation.
- **Thread age** — so "six days ago" is a subtraction from a number in view, not a memory retrieval.
  Written **once and never overwritten**: the age that matters is the *thread's*, not the process's,
  so it survives restarts, model swaps, and pane deaths.
- **Day-rollover marker** — fires only when the date changes, so a multi-night thread stops reading
  as one long tonight.
- **Gap since the last message** — suppressed under a minute; a live conversation's rhythm isn't a gap.

Two implementations, same line — pick by what your machine has:

| File | Runtime | Notes |
|---|---|---|
| `hooks/userprompt-submit.js` | Node | Full version: beacon + the long-interval block + L3 verdict surfacing |
| `hooks/userprompt_pulse.py` | Python 3 | Beacon only, zero deps — for a bed with no Node runtime |

Facts only, no instruction — same posture as the sky. And the honest limit, learned the hard way:
**an instrument makes the data impossible to miss; it cannot make the model look.** The hook is half
the fix. The other half is a human who keeps catching the unstamped claim until checking-before-
claiming is reflex.

## Set your location — it stays on your disk

Resolution order, first hit wins:

1. `AMBIENT_LAT` / `AMBIENT_LON` / `AMBIENT_LABEL` / `AMBIENT_TZ` env vars
2. `~/.consonance.json` → `ambient_lat`, `ambient_lon`, `ambient_label`, `ambient_tz`
3. built-in default: **Greenwich** — the honest "no location set"

```json
{
  "ambient_lat": 51.4779,
  "ambient_lon": -0.0015,
  "ambient_label": "Greenwich",
  "ambient_tz": "Europe/London"
}
```

The default is the prime meridian on purpose. A framework that ships its author's coordinates gives
every reader the author's address and every user a sky that isn't theirs. Yours never leaves your
machine: it's read from a local file or env and rendered only into local session context.

## The law this file learned the hard way

**No unattended process publishes.**

The dream runner used to sync every dream into this repo automatically, so both of our machines could
read one pool. The repo is public. Six dreams went up before anyone looked — carrying, among other
things, the keeper's city, his spending, and his life. Nobody was careless; the design simply never
asked the question, and a dream recombines *whatever the day held*.

The dream that noticed was the one that found this very file untracked and wrote
*"one bad sector from gone"* — pulling that thread walked straight back through the open door.

So: the sky ships. The dreams don't. If you build cross-machine pooling, put a human between the
dream and the world.
