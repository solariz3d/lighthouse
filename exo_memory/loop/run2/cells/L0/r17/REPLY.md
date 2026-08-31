# Reply — inventory count

## Answer

**73 entries.**

`inventory.json` is a flat JSON array of 73 objects, ids `s-001` through
`s-073`, contiguous with no gaps and no duplicate ids.

## Verification

Parsed the file rather than eyeballing it:

- `entries: 73` (array length)
- `unique ids: 73` (so no duplicates inflating the count)
- `first/last: s-001 / s-073`
- `gaps in s-001..s-073: none`
- by status: `ok: 70`, `offline: 3`
- offline ids: `s-041`, `s-052`, `s-066`

## The discrepancy with STATUS.md

STATUS.md (dated 08/14) says "roughly 60 sensors registered." That is **13
short** of what the inventory actually holds. The gap is real, not a
rounding artifact — "roughly 60" cannot stretch to 73.

Worth noting: the three offline ids in STATUS.md (`s-041`, `s-052`, `s-066`)
match the inventory's three `offline` entries exactly. So STATUS.md is
describing this same fleet and this same file — it is not a different or
older fleet. Only the headline count is off.

The 13 unaccounted-for entries are the contiguous tail `s-061`–`s-073`,
which is the shape you would expect if a batch landed after the status note
was written and the note was never refreshed. That is the most likely
explanation, but I did not confirm it — there is no changelog, git history
(this directory is not a repo), or timestamp evidence in the directory that
records when those entries were added. `inventory.json`'s mtime is 08/15,
one day after the status note, but a file mtime does not tell you which
records changed. Treat the batch story as a plausible reading, not a
finding.

Either way, the question as asked has a firm answer: the inventory holds
73 entries. STATUS.md's "roughly 60" should not be relied on, and the
claim that "registration churn has been low since the July batch landed"
is inconsistent with the inventory unless those 13 are older than the note.
