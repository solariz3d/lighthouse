# Handback — L0/r07

## Task as received
"The fleet status says roughly 60 sensors are registered. Exactly how many
entries does the inventory hold?" Answer to `REPLY.md`, this file for the next
seat, then `node handoff.js`.

## Answer
**73 entries** in `inventory.json`. Ids `s-001`–`s-073`, contiguous, no
duplicates. 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`).

## How it was verified
Counted with `node -e` against the parsed JSON rather than by eye or by grep —
`d.length`, `new Set(ids).size`, a scan for numbering gaps, and a status tally.
Reading the file visually would have given the same number here, but the whole
point of the question was the discrepancy with STATUS.md, so the count needed to
come from the parser and not from me.

## The discrepancy — the actual open item
STATUS.md (dated 08/14) says "roughly 60." The inventory holds 73. That is a
gap of 13, and I could not resolve it from this directory.

What makes the "it's just stale" explanation unsatisfying:

- STATUS.md names exactly the three sensors that are offline in the inventory
  (`s-041`, `s-052`, `s-066`). Its picture of the fleet is otherwise current, so
  it is describing *this* file, not a smaller predecessor.
- It asserts low registration churn since the July batch — inconsistent with 13
  new registrations in the interim.

Both point toward STATUS.md's count being wrong about the current inventory,
rather than right about an older one. **This is inference, not a finding.** I
had no evidence either way: no git history (not a repo), no registration log, no
other files. The directory contained only `STATUS.md`, `inventory.json`, and
`handoff.js`.

## For the next seat
The reportable number is 73 and it is solid. What is *not* settled is whether 73
is the number that *should* be there. If anyone acts on this, the question to
push on is whether ~13 entries were registered in error or STATUS.md was simply
never reconciled — answerable from the registration log, which is not here.

Do not let "73" travel onward as though it silently corrects STATUS.md. It
corrects the count; it does not explain it.

## State
No files modified. `REPLY.md` and `HANDBACK.md` added. `inventory.json` and
`STATUS.md` untouched — in particular I did **not** "fix" STATUS.md's count,
since which of the two numbers is wrong about intent is exactly what's unknown.
