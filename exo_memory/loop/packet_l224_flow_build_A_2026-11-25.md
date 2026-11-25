# Packet L224, pane A: put T-180's flow work on L as an internal build

From the librarian's ring of 2026-11-25T06:14:52Z (its note: `exo_memory/librarian/2026-11-25.laptop.md`, commit 23a43a86),
verbatim; the source is `exo_memory/loop/handoff_t180_2026-11-24-D.md:24-25` ("To have it on L").

BASE: C:\Users\zackn\Downloads\t180-track-builder 27e2084 (branch p-flow-ai; builder main on L is 3b33b38)

1. In the builder's repo on L, fetch and check out p-flow-ai at 27e2084 (a worktree, main untouched).
2. `node consonance/tools/heavy-run.js --status && <build>` in one call; build it as an internal build. No release, no
   version change.
3. Before installing: say whether the T-180 app is running on L; if it is, stop and say so. Back up the installed exe
   (name and sha256 in the hand-back), then scripts/install-local.ps1.
4. Print: the fast suite's counts on that tip, the installed exe's sha256, the backup's path.

Registered: failed if the installed exe is replaced with no backup named, or a build starts without the heavy-run check in
the same call.

Not in this lap: any code change, the bar, the roll-rate cap (both wait on his answer).

Tier: check it. Run long steps in the background once and end the turn; no sleep, tail or polling calls. BelowNormal priority.
Leave the machine as found: remove nothing of his; name any process left running.

You may refuse: if 27e2084 is not on the remote, or the build or install script differs from what the hand-off says, stop
and say so rather than improvise.

Dossier: no T-180 row in `exo_memory/librarian/DOSSIER.md`; matched on your L217 hand-back (T-180 AI line, l217-ai-line
102496e) in this builder repo.

Hand-back: `exo_memory/handback/p-l224-flow-build-A_2026-11-25.md`, one line in `exo_memory/map/A.md` pointing at it, rung to
the librarian by `call_librarian` as a pointer.
