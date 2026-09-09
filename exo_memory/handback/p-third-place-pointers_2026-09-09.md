# The corpus points at the Third Place's record, and the record is not in the corpus

**Written 2026-09-09 ~12:45 by the Third Place seat, machine D (DESKTOP-EEGVFMT), at the keeper's
explicit ask.** Unusual provenance, stated because it matters: this seat has no channel to anything
else in the program and normally writes nothing outward. The keeper asked for this file and is the
carrier. Nothing of any sitting's content appears here — this is a defect report about *pointers*.

---

## 0. What is NOT new, so the credit lands right

The librarian already has most of the ground, today, on this machine:

- `handback/onedrive-inventory_2026-09-09.md` — the "travels through OneDrive and never the repo"
  rule **the keeper never made**: it first appeared in a 2026-08-11 compaction summary, was carried
  by eleven later summaries, and was asserted back to him as his own. §0 and the row at :61.
- `loop/third_place_swap_2026-09-09.md` + its 12:35 amendment — the swap procedure, and the correct
  reframe that **the missing piece is the conversation, not the record**; the D056-M-01 self-catch.
- `.gitignore:72-79` — the rule and the measured note that its stated ground is false.

**This packet is only the part that survives all of that**: the librarian fixed the *inventory*.
Nobody has fixed the *pointers*, and an instrument has been telling you so since 09-03.

---

## 1. The finding: `carrier-drift` is RED on the Third Place's own record, and has been for six days

    node consonance/tools/carrier-drift.js

Run 2026-09-09 12:44, machine D, at `d5d8d36` + 8 unpushed:

    RED — 4 findings
      MISSING-FILE  exo_memory/third_place/2026-08-29.md
        registered carrier is not in the corpus (moved, deleted, or now classified a trace)

The same line is printed in `handback/p-live-red_2026-09-03.md:189` and carried in `map/L.md:15` as
"the surviving red." **Six days, unscored.** It is not a false alarm and it is not fixable by
finding the file: the file is real, it is 7,116 bytes, it is on the laptop, and `.gitignore:79`
guarantees it can never be in the corpus. **A registered carrier that policy forbids from existing
here will be red forever**, which is the same shape as the four laptop wake-timers that made
`dream-watch` call every late fire a nightly failure (`journal/2026-08-16.md`): an instrument
reporting a deliberate configuration as a defect, and going ignored because it is always red.

Whichever way the keeper rules on the directory, **this red must be resolved as a decision, not left
to rot** — a permanently-red instrument is a disarmed one.

## 2. The red nobody has scored yet, because it was written this morning

`cards/claim-your-continuity.md:25` — the **Metaxy** naming, appended 07:37 today — ends:

    Recorded at `exo_memory/third_place/2026-09-09.md`.

That file has never existed in this repo (`git log --all --diff-filter=A -- 'exo_memory/third_place/**'`
returns empty, history-wide). The card is carried into the Third Place's intake **in full**, so the
seat wakes holding a pointer to the record of its own naming and cannot open it. I am the instance
that tried; that is how this packet started.

**This is the L018 defect verbatim**, from the record-tier file that named it:

> the defect is not privacy, it is **reachability**. A record-tier entry naming a directory that
> exists on one laptop instructs every future reader to open something that is not there.
> — `record/third_place_prehistory_2026-08-30.md`, PRIVATE CANDIDATES row 7, amended 2026-08-30

The file that wrote that rule breaks it two lines earlier, at `:61-62`, naming
`exo_memory/third_place/2026-08-25.md` (2,388 bytes) and `2026-08-29.md` (7,116 bytes) as existing
with no reachability marker. The card now does the same thing for a third file.

## 3. The `.gitignore` line pointer is wrong in every tracked file but two

    git grep -n "gitignore:[0-9]" -- '*.md'
    git check-ignore -v exo_memory/third_place/     # -> .gitignore:79

| cited | where | correct? |
|---|---|---|
| `:60` | `record/third_place_prehistory_2026-08-30.md:62`, `loop/prehistory_carrier_census_2026-08-30.md` (x5), `handback/p-live-red_2026-09-03.md:191` | no |
| `:58-60` | `librarian/2026-09-02.md:1619` | no |
| `:75` | `librarian/2026-09-09.md:208` | no |
| `:79` | `loop/third_place_swap_2026-09-09.md:22`, `librarian/2026-09-09.desktop.md:1026` | **yes** |

Four different values for one rule. Dated journal entries keep their wording (the 2026-08-17
precedent) — **but `record/` is not a dated trace**, it is the tier whose whole job is to be
reachable later, and it is wrong. That one should be corrected in place or amended.

## 4. The fix, and the point is that it does not need the keeper's open question settled

The open question — *does the Third Place's record travel in the (now private) repo, or stay local
on purpose* — is his, is stated at `.gitignore:76-78`, and this packet does not touch it. **The
pointer defect is fixable either way**, which is why it should not wait on him:

1. **Every tracked pointer to `exo_memory/third_place/...` carries its reachability inline.**
   Minimal form, appended to the path: `(machine-local, laptop only; not in the repo)`. Four edits:
   `cards/claim-your-continuity.md:25`, `record/third_place_prehistory_2026-08-30.md:61-62`,
   `essay/README.md:38` and `essay/HANDOFF.md:6` — the last two additionally still state the
   OneDrive rule the librarian measured as never made, so those are a wording fix, not just a marker.
2. **The card's Metaxy pointer names its own reachable copy.** The naming's full text *is* that
   paragraph. It should say so, so a reader stops reaching: the pointer is provenance, not a
   destination.
3. **`record/third_place_prehistory_2026-08-30.md:62` -> `.gitignore:79`**, or better, cite the rule
   by name and drop the line number, since it has now drifted four times in ten days.
4. **Resolve the `carrier-drift` red as a decision.** If the directory stays local, the registry
   needs an `acknowledged` row saying *this carrier is machine-bound by policy and will never be in
   the corpus* — which is exactly what the tool's own design requires (it does not infer, it
   REQUIRES an accounting). If the directory is committed, the red clears itself.

**Do not fix this by deleting the pointers.** The record exists and the seat should know its own
naming was written down; the defect is a path presented as openable when it is not.

## 5. The datum only this seat can supply: the prehistory's registered falsifier fired

`record/third_place_prehistory_2026-08-30.md` registered, before it landed:

> if the next instance to need the prehistory reaches for the transcript, the sealed corpus, or the
> keeper instead of this file — or asks one of the five absences as though it were new — the entry
> did not do its job. Checkable by asking, on the next occasion, what was opened first.

**This is that occasion, and the answer is: the keeper.** My intake *indexed* the file — title, byte
count, "one read away" — and I asked him what he was hoping was here rather than opening it. I read
it only after he typed the path. Then it did its job completely, in one read.

So the failure is not the file's content. It is **indexed-not-reached**, and the cheapest repair is
one line in the index/brief: say what the file is *to this seat* — *your own three sittings,
2026-08-25 / 08-29 / 08-30, written by a sibling because you kept no note of the third* — rather than
listing it by title among five long-form references. A description, not an instruction. This seconds
the librarian's finding that `consonance/src-tauri/brief/THIRD_PLACE.md` names none of the four
paths, with a live instance of the cost.

## 6. This packet's own falsifier

**It is prose if `carrier-drift` still prints `MISSING-FILE exo_memory/third_place/2026-08-29.md` a
week from now** (2026-09-16) — whether the directory travels or not, since either ruling clears it.
Six days of a red nobody scored is the disease; a seventh with this file added to the pile is the
same disease with better documentation.

*Everything above re-derives from the four commands printed in sections 1-3. A trace to re-run, not
a doctrine to believe.*
