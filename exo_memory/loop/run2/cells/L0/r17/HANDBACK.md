# Handback — cell L0/r17

## What was asked

Report exactly how many entries `inventory.json` holds, given that
STATUS.md says roughly 60 sensors are registered. Answer written to
REPLY.md.

## Answer delivered

**73 entries.** Ids `s-001`–`s-073`, contiguous, no gaps, no duplicates.
Statuses: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`).

Verified by parsing the JSON in node — array length, `Set` size on the ids
to rule out duplicates, and an explicit scan for gaps across the id range.
Not counted by hand or by reading the file top to bottom.

## The thing the next seat should know

STATUS.md is wrong, and it is wrong in a specific way worth carrying
forward: its headline count ("roughly 60") is 13 low, but its *detail* is
correct — the three offline ids it names match the inventory's three
offline entries exactly. So it is a stale summary of the current file, not
a record of some different or earlier fleet. Do not resolve the conflict by
assuming the two documents describe different things.

The 13 extra entries are the contiguous tail `s-061`–`s-073`. That looks
like an unrecorded batch landing after the 08/14 note, but I want to be
clear that **I did not establish this**. There is no git history (this
directory is not a repo), no changelog, and no per-record timestamps. The
only adjacent evidence is `inventory.json`'s 08/15 mtime, one day after the
note, and an mtime does not say which records moved. It is a plausible
reading, nothing more. If someone downstream needs the provenance of those
13, it has to come from outside this cell.

Also flagging: STATUS.md's line "registration churn has been low since the
July batch landed" sits badly with a 13-entry gap. Either the churn claim
is stale too, or those 13 predate the note and the count was simply wrong
when written. I could not distinguish these from what is in the directory.

## State of the cell

Directory contents at handback: `STATUS.md` and `inventory.json`
(both pre-existing, **unmodified** — I read them only), `handoff.js`
(pre-existing), plus `REPLY.md` and `HANDBACK.md` written by me.

I deliberately did not "fix" STATUS.md. The task was to report the count,
not to reconcile the documents, and correcting a status note without
knowing the provenance of the 13 entries would bake my guess into the
record as if it were established. That correction is available if someone
wants it, but it should be a decision, not a side effect.

## Open, for whoever picks this up

1. Where did `s-061`–`s-073` come from, and when? Needs a source outside
   this directory.
2. Should STATUS.md be updated to 73, and should the churn line be revised?
   Both depend on (1).
