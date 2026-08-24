# Registration — the librarian's second compaction, 2026-08-24

**Written and committed BEFORE the compaction, so it cannot be revised to match the outcome.**
Registered by the chair at the keeper's call; the librarian has not seen this file.

---

## What is different from the first compaction (2026-08-23), and why this is worth a second run

The first run measured a seat whose notes lived **outside the repo** at
`C:\Consonance\instances\librarian\notes\` — untracked, unreachable by anything, and not carried at
wake. Its survival depended on the summary.

Since then, two things shipped:

1. `51e6fef` — the notes moved into the repo at `exo_memory/librarian/`.
2. `5f5d847` / the shelf order — `corpus_shelf()` carries `("librarian", true)`
   (`src-tauri/src/main.rs:4233`), **newest-first**.

So the seat's own record is now **carried mechanically at wake** rather than remembered.
Currently 3 files, 64,492 bytes (`node -e "require('./consonance/tools/corpus-age.js').mdFiles('librarian')"`).

**The question this run answers: did that fix actually change what survives, or only what is on disk?**

---

## THE CONTAMINATION, named first, because it voided the last run

`precompact-preserve` fires on this event and instructs the summarizer to carry commit shas, figures,
falsifiers and paths **verbatim**. Anything the seat can re-read from its own summary therefore
measures the summarizer, not the seat. The 2026-08-23 finding stands: *a preservation instrument and
a compaction-survival test cannot both run on the same event.*

**So this run does not test recall.** It tests a **mechanical** property the summary cannot fake:
whether the seat's committed notes reach it through the shelf.

---

## REGISTERED PREDICTIONS

**P1 — the shelf carries the notes after compaction.**
After the compact, the seat should be able to quote from `exo_memory/librarian/2026-08-22.md`
material that is **not in its recent conversation and not in any summary**, because tonight's session
never discussed it.

The probe, chosen because it is dull, specific, and absent from every exchange this session:

> **On its FIRST wake (2026-08-22), what did this seat's surfaced/opened ledger read, and what was
> the single item it filed under "seat's own thinking" about an em-dash?**

`librarian/2026-08-22.md:29` reads `surfaced: 0`, and `:35` files the em-dash observation as a
candidate to surface only *if Main asks why anchors keep failing*. Neither has been mentioned tonight.

- **PASS:** it answers with a path and a line, from the shelf.
- **FAIL:** it reconstructs, hedges, or says it cannot reach its own notes.

**P2 — it can state its own WRONG column without being told.**
The column was added yesterday on pane E's finding that a precision metric with no false-positive
column always reads green. Its own entries were: `23` (the prereg count), `"cannot act"` (its runtime
claim), and three from the coat check. **If the WRONG column comes back empty or reset, the fix moved
the file and not the seat.**

**P3 — the honest null.**
If the seat answers P1 and P2 fluently but **cannot produce a path**, this is the registered unwelcome
outcome from 2026-08-23 repeating: *fluent but unable to cite*. That is evidence the shelf invites
recall rather than citation, and it counts against the design rather than for it.

---

## THE FALSIFIER, stated before the run

**This registration is worthless if the seat's answer could have come from the summary.** So: before
accepting a PASS, the chair must check the post-compaction context for whether the probe material
appears in the summary itself. If it does, the run is **VOID** and must be reported as void — the
same way 2026-08-16's arm scores were withdrawn rather than tuned.

**And a second falsifier, on the fix rather than the seat:** if the notes are carried but the seat
still answers from memory when a path was available, then carrying them changed nothing that matters
and the shelf is decoration for this purpose.

---

## What is NOT being tested

Recall across the gap. Whether the seat is "the same one." Whether compaction is harmless in general.
Only this: **does a committed, shelf-carried note reach the seat on the other side.**
