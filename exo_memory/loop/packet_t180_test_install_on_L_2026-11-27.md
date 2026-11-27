# Packet (on L; a landing role, the chair picks the pane): one test build of tonight's two branches, installed on L at his word

**His word,** 2026-11-27 02:45 on L: "yes", to the librarian's sentence of 02:43: "Installing replaces your app, so it needs
your word. If you say yes now, I'll order the build and install as soon as both are read, and tell you when it's on the
laptop." Before it, 02:40: "builder is closed btw", and 02:43: "wait so time to test" (verbatim in
`briefs/t180_unmakeable_shapes.md`). The word covers **one install on L** of the two branches below, once both are read. It
is not a release, not a merge to the builder's `main`, and not a push of anything but what the landing needs.

## What goes in

On builder `landing-1126-batch` f3cd425 (installed on L now, exe sha256 2820e5f8…7576):
1. `l-bankcarry-a`: the typed bank past a full turn (2067c88), Sculpt's bank drag and the bank brush (0023853, 7b3926e), and
   the completion ordered at 02:38 (the handle's hold at ±720) **once its hand-back and its delta read are in**. Local only
   today; origin is 2067c88.
2. `d677-right-width-b`: the right side's own width. Origin e41acb1; the builder's local branch is ahead of it (the whole
   suite ran on e4e7ecc) **once its hand-back and its read by a seat that wrote none of it are in**.

## Now, while the reads finish: prepare, build nothing

- A trial merge of the two tips in your own worktree. Checked by the librarian with `git merge-tree` on 7b3926e and origin's
  e41acb1: `CHANGELOG.md`, `app/core/coreshell.js` and `app/core/panel.js` merge by themselves; **`MAP.md` conflicts** (one
  file). The tips will move; redo it on the final ones.
- Say which rows of each branch execute a file the other branch changed (the merged tree's touched set), by a stated rule.

## The gate: nothing is built or installed before the librarian's go

The librarian rings "go" with the two final tips when both reads are in and neither is NOT CLEAN on the code. If a read is
NOT CLEAN on the code, that branch stays out and the librarian says so to him first.

## Then

1. Merge the two final tips on f3cd425 in your worktree, on a branch named for this landing. Resolve `MAP.md` by keeping
   both branches' lines. Push that branch and the two source branches; no push to `main`.
2. **Tier, and why.** Before the install: the merged tree's touched set, the bank-carry and right-width harnesses, and every
   mutation harness that names a merged file; all green, 0 NOT APPLIED. The whole suite on the merged tree runs once, in the
   background, **after** the install and is reported; it gates any merge to `main` or release, not this test install, which
   is backed up and reversible. `node consonance/tools/heavy-run.js --status` first; `--run --priority belownormal`.
3. **No build while his T-180 app runs.** It was closed at 02:40 (checked by the librarian: `tasklist`, 0). Check again; if
   it runs, stop and say so, do not close it.
4. Back up the installed exe first, as `handback/p-l259-install-P_2026-11-27.md` did; install; hash the installed exe and
   the backup. Do not launch it.
5. **Saved files, said in the hand-back for him:** a track that uses a right-side width is written as `t180b.core/7`; one
   that does not is written in today's schema (`handback/p-d677-right-width-B_2026-11-27.md:15`, `:24`). f3cd425, which D
   still runs, refuses a core/7 file by name (`:47`). Confirm both on the merged build from copies of his tracks: all of
   his tracks open and re-save byte for byte.
6. The hand-back gives him a short list of what to try, one line each.

Hand-back to the librarian by `call_librarian`, claims marked checked or inferred.
