# READ THIS BEFORE YOU PULL AGAIN — the laptop is leaving OneDrive

Written 2026-07-28 ~05:40 by the laptop chair, at the keeper's direction, from the planning
arms of three panes (Alpha: discovery, Bravo: procedure, Around: verification). **Nothing has
moved yet.** This note goes to origin FIRST, deliberately, because git is the only wire between
the two beds that survives what is coming.

## What is changing, and why you are being told before it happens

The lighthouse working tree currently lives at `%USERPROFILE%\OneDrive\Desktop\projects\lighthouse`
on both machines. That directory is inside OneDrive's sync scope, **including `.git`** — 1,807
objects, 2,008 of 2,035 files carrying Files-On-Demand reparse points. Two machines writing one
git database through a file syncer has no merge semantics. The laptop is moving its working tree
to plain disk (`C:\Consonance\lighthouse`, beside the instances).

**The reason this note exists rather than a commit message:** moving a folder out of the sync
scope is, from OneDrive's point of view, a **delete**. When sync resumes it will propagate that
deletion — to the cloud recycle bin and to **your** working tree. You would lose your checkout
without any command having been run on your machine. That is the one failure in this operation
that the laptop cannot observe.

## What you must do — in this order

1. **Pull this note and read it before doing anything else.** If you are reading it in a diff,
   stop and read the file.
2. **Decide where your own tree lives, and move it off OneDrive too.** Recommended:
   `C:\Consonance\lighthouse`, matching the laptop, so the two beds agree and no script has to
   branch on machine. Use a *copy*, verify, and only then remove the original — see §Verification.
3. **Re-point `desktop-install.ps1`.** Line 22 hardcodes
   `$repo = "$env:USERPROFILE\OneDrive\Desktop\projects\lighthouse"` as its PRIMARY locate step,
   with the clone fallback second. After your move that path resolves to nothing, or worse, to a
   stale copy OneDrive restores. This is the single most load-bearing hardcoded path on your side.
4. **Check `~/.consonance.json`.** `room_path` points at `<repo>\exo_memory\BOOT.md`. The read
   failure is **swallowed** (`if let Ok(boot) = fs::read_to_string(...)`) — a wrong value means
   every new sibling wakes with the header, the deck and the resonance but **no room**, and
   nothing anywhere says so. This is the worst silent failure in the inventory.
5. **Set `CARGO_TARGET_DIR`** (user-level) to a path outside the sync scope — the laptop uses
   `C:\build\lighthouse-target`. The build output was 19.5 GB and 33,000+ files churning through
   the sync engine on every build. Note the trap the laptop hit: `launch.ps1` used to reconstruct
   the exe path from the repo root, so the moment `CARGO_TARGET_DIR` changed, every click rebuilt
   successfully and then launched a **stale binary**, printing "Build ready" in green. That is
   fixed in this commit — it now asks `cargo metadata` for `target_directory` and refuses to launch
   an exe that did not change during the build. Pull before you click.
6. **Only after your tree is verified at its new home, let OneDrive resume.** If it resumes while
   either machine still has the old tree inside the sync scope, deletions propagate.

## Verification — do not trust "the folder is there"

`C:\Consonance\verify\move_verify.ps1` on the laptop (Around, cycle 9) exists precisely for this.
It lives **outside both trees** because an instrument inside the artifact under test dies with a
botched move. Two phases: `-Phase Baseline -Root <old>` then `-Phase Verify -Root <new>`. It hashes
every file with a **full content read** rather than checking existence and size.

The false cleans it was built to catch, which apply to your move as much as ours:

- **Placeholder copy.** A copier that preserves reparse points writes placeholders to the
  destination: correct names, correct reported sizes, `ls` clean, `git status` clean off the index,
  and **no readable content**. Destination reparse count must be **0**.
- **The master false clean.** ~20 tracked files hardcode the old absolute path. If the old folder
  still exists, every one of them resolves and **every check passes with nothing actually moved**.
  The system runs fine for weeks and dies the day the folder is deleted, with no visible connection
  to the move.
- **Two nulls compare equal.** The instrument's own first revision recorded an empty `HEAD` as a
  successful baseline, and an unreadable file as the literal string `UNREADABLE` — either would
  have *matched* the same emptiness at verify time. Fixed: every field is gated on exit code AND
  emptiness AND shape, with a `-Phase Selftest` (13/13) and a negative control that refuses to
  baseline a non-repo directory.

## What the laptop has already done, so you can reason about state

- `CARGO_TARGET_DIR` → `C:\build\lighthouse-target`; the old 19.5 GB `target/` deleted from the
  synced tree (one file remains, the running app's own exe, which clears on next restart).
- `launch.ps1` fixed as described in step 5 (`cargo metadata` + a freshness assertion).
- Verification baseline captured: 2,035 files, 29,908,723 bytes, 2,008 reparse, 0 offline,
  HEAD `c31832b`, 494 commits, 11 refs.
- **The move itself has NOT been done.** It is parked deliberately: the panes' procedure arm
  ruled that introducing a silent-failure class at 5 AM, when the only detector is a tired human
  noticing a sibling seems subtly off, is the one trade to refuse.

## One artifact that exists in no repository

`NOTHING_WASTED.md` is untracked on the laptop and has never been committed. sha256
`615c11a09eec8caa51c44bc58a66be60fa1e097203d3f3832af701aa92624978`, 11,236 bytes. A fresh clone
would silently drop it. If you hold a copy, it is not backed by git either.

## The general form, because it is the reusable part

The laptop's panes split one operation that looked atomic into two that are not:
**the machine stops using the OneDrive copy** (non-destructive, reversible, verifiable locally)
and **OneDrive stops holding a copy** (destructive, verifiable only from a machine you cannot see).
Welding them together is what makes this dangerous. Do the first, verify it, tell the other bed,
and only then consider the second.
