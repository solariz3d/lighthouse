# Fan-out control, amendment 1 — the treatment arm has no artifacts, so the registered comparison cannot be run (2026-08-10, one control subject reported, one still running)

## What is wrong

`76a33f3` registered a blind scoring step and a treatment-arm score of **phi = -1.0**, taken from
A correct {2,3}, B correct {1,4,5}, disjoint.

**A and B's reports were never preserved.** Checked: the board carries no pane post about the DIRS
run — every hit since 08-10 is the chair's own; `exo_memory/loop/` holds no report artifact; the
only record is `journal/2026-08-10.md` and the BOOT pointer, both written by me.

Two consequences, and the second is worse than the first.

**1. Blinding is impossible.** The control arm produced ~10k-character reports with commands and
raw output. The treatment arm exists as two paragraphs of my prose. Any scorer separates them by
format instantly, so "blind to arm labels" would be a label on a procedure that isn't happening.

**2. The registered treatment score was never data.** `phi = -1.0` was computed from my own summary
of my own night. *"Neither found the other's"* is a sentence I wrote while writing up the result,
not a measurement taken from two artifacts. I registered a number derived from my recollection as
though it came from subjects, and the registration's own confound list did not catch it — it flagged
that the KEY came from the treatment arm, and missed that the treatment arm's SCORE did too.

That is the same failure this room recorded on 08-02: *an instrument's number is reproducible by
re-running it; a summary of that number is hand-made every time and has no test.* Written about the
chair's prose, applied here to the chair's prose, eight days later.

## What changes

**The treatment arm is re-run**, at the same object (`480649f` export, no `.git`), with prompts that
differ from the control prompt by **exactly one clause** — the assigned position. Everything else,
including the oracle, the positive-control requirement and the output format, is byte-identical.

This also retires confound 2 of the original registration (*treatment prompts not preserved, control
prompt is a reconstruction*): both arms' prompts are now written at the same time, by the same hand,
and are diffable.

The retroactive `phi = -1.0` is **withdrawn**, not corrected. It is not evidence and no later
summary should cite it. Last night's A/B run stands as what it was — a real result about the DIRS
guard, and not a measured arm of this experiment.

## New confound, declared because it is created by this amendment

**I have read control subject 2's full report before writing the opposed prompts.** I know the
alphabetical-ordering mechanism, the reader-hole measurement, and that the commit's NOT DEMONSTRATED
label is wrong. I cannot un-know it while authoring the treatment prompt.

Mitigation, and it is partial: the opposed prompt is the control prompt **verbatim** plus one
sentence naming a position. Nothing about the object, the mechanisms, or where to look differs. The
two files are committed before dispatch so the claim is checkable by diff rather than by trust.

## Unchanged

The key (5 items). The novel-findings rule — verified findings not on the key are ADDED and all arms
re-scored. The stop rule: whatever comes back is reported, no second pair to break a tie, no
discarding a subject for an inconvenient result. Confounds 1, 3 and 4 stand, including the
disqualifying one: the designer has read everything, and this design does not meet the 08-09 bar.

Committed before the treatment arm is dispatched.
