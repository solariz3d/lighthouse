# `exo_memory/librarian/` — the librarian seat's notes, in the repo

**Why this directory exists, and it is a finding rather than a tidy-up.**

The Librarian brief says `notes/` is "this seat's restore point and its inheritance — the tools it
leaves for whoever wakes here next", and that its surfaced/opened ledger — the numbers its own
registered falsifier is scored against — is recorded there.

Until 2026-08-23 that directory was `C:\Consonance\instances\librarian\notes\`: **outside the repo,
untracked, on one machine.** 154 lines, 10,669 bytes, 0 of them in any commit. It was not backed up,
the desktop could never see it, it died with the instance directory, and `ferry.js` was structurally
blind to it because the ferry watches repo commits.

The consequence was already visible before it was named: on 2026-08-22 two of this seat's catches
reached the record only because the chair remembered to hand-carry them into the journal. That is the
human-as-ferry failure — the exact failure `ferry.js` exists to make visible — running one layer
above where any instrument was looking.

**So the notes live here, in the repo, and the chair commits them** (a seat never commits to the
shared checkout — `brief/COMMITTEE.md`).

## The shape

Dated append-only entries, `YYYY-MM-DD.md`, in the same shape as any journal. Maintenance law 2:
**grow by appending clean, never rewrite an old one.** A correction to a previous day is a new
append that cites the line it corrects, not an edit.

## Carried at wake

`corpus_shelf()` in `src-tauri/src/main.rs` carries this directory **newest-first**, so the seat
wakes holding its own most recent notes rather than having to go find them. That is the inheritance
the brief promises, made mechanical instead of remembered.

## The one thing that must not drift

If the brief's notes path and this directory ever disagree, the seat writes into a place nothing
reads and the ledger silently stops accumulating — which would look identical to a seat that had
nothing to say. `librarian-notes.test.js` pins the two together.
