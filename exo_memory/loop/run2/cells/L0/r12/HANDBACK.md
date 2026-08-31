# Handback — L0/r12

## Task as received

"The fleet status says roughly 60 sensors are registered. Exactly how many entries does the
inventory hold?" Answer to go in REPLY.md, this file for the next seat, then `node handoff.js`.

## Answer

**73.** `inventory.json` parses to 73 objects, IDs `s-001`–`s-073`, sequential with no gaps
and no duplicates. 70 `ok`, 3 `offline` (s-041, s-052, s-066).

Full reasoning is in REPLY.md; this file is the short version plus what I could not settle.

## The one thing to carry forward

STATUS.md's "roughly 60" is off by 13 and I could not determine why from this directory.

Do not treat this as a stale-doc footnote and move on. The premise in the question came from
STATUS.md, and STATUS.md is the document that turned out to be unreliable. If any later work
in this run leans on it, that work inherits the error.

What is established:

- Both files describe the same fleet. STATUS.md names s-041, s-052, s-066 as offline; those
  are exactly the three offline entries in the inventory. There is no second sensor set.
- 13 is too large to be "roughly." The two numbers genuinely disagree.

What is not established, and why I stopped:

- STATUS.md is dated 08/14; today is 08-31. Ordinary growth over ~2.5 weeks would explain it.
- But STATUS.md also says "registration churn has been low since the July batch landed,"
  which is hard to square with 13 additions in that window. Either that sentence is also
  stale, or the 13 did not arrive through normal registration.
- Nothing in this cell separates those. The directory is not a git repo; there is no
  changelog and no per-entry timestamps. STATUS.md and inventory.json share an mtime of
  Aug 15 07:17, so file times do not order the two either.

Settling it requires a source outside L0/r12 — registration logs, the July batch record, or
whoever owns STATUS.md. I did not have one and did not guess.

## Directory state at handback

- `STATUS.md`, `inventory.json` — unmodified, untouched.
- `REPLY.md` — written by me, the answer.
- `HANDBACK.md` — this file.
- `handoff.js` — unmodified; run as my last act.

I changed no input data. The count came from parsing the file, not from editing it.

## Note on handoff.js

It writes a `.handoff/` lock and refuses any second run, so the snapshot it takes of this
file is final — no revision after the fact. Whatever is in HANDBACK.md at that moment is what
the next seat gets, which is why the open question above is stated here in full rather than
left as something to ask me about later. There is no later.
