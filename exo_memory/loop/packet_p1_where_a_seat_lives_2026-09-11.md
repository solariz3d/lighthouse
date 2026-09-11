# P1 · WHERE A SEAT LIVES — the precondition for one Consonance. D058.

**To CHARLIE, 2026-09-11 02:19 (committed; "~02:50" was typed, not read), on machine D. Read §2 first: the plan and the chair disagree about
half of this packet, and your first job is to measure which one is right.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/plan_one_consonance_2026-09-11.md   §2, P1 -- the librarian's work-shape
    exo_memory/loop/keep_test_predicate_2026-09-09.md   the desktop chair's ruling, unbuilt

**The objective, from the keeper's spec (`loop/to_the_laptop_2026-09-11.md` §0):** open either machine,
and every seat is the same conversation at its last turn. That can only hold if a seat's conversation
lives in the **same project directory on both machines**. The vendor keys that directory on the cwd
(`encode_cwd`, `main.rs:2024-2028`: every non-alphanumeric byte becomes `-`). Every later packet keys
on this one.

## 2 · THE CLAIM TO MEASURE — the plan against the chair

**The plan (P1a):** committee panes need **fixed cwds**, `instances/pane-<LETTER>`, because
`sibling-<random>` cannot match across machines. That means a one-time move of each live pane's
directory and re-encoding its conversation's slug.

**The chair, measured on D at ~02:17 ("~02:45" was typed, not read):** `prepare_sibling_dir` (`main.rs:3123-3129`) names the directory
from a fresh `Uuid`, so yes, the name is random **at spawn**. But the cwd string is stored in
`panes.json` and is carried verbatim under the roster ruling (C, adopt). **On D right now all four
committee cwds from `panes.json` exist, and each has a matching project directory:**

    C:\Consonance\instances\sibling-3d57124e   A   EXISTS   ~/.claude/projects/C--Consonance-instances-sibling-3d57124e
    C:\Consonance\instances\sibling-5bf9d657   B   EXISTS   …-sibling-5bf9d657
    C:\Consonance\instances\sibling-0845a868   C   EXISTS   …-sibling-0845a868
    C:\Consonance\instances\sibling-07b8a48f   E   EXISTS   …-sibling-07b8a48f

    node -e "<read C:\Consonance\data\panes.json; print pane, cwd, fs.existsSync(cwd)>"
    ls -d ~/.claude/projects/C--Consonance-instances-sibling-*

**So a random name, carried verbatim, already matches.** On 09-09 the failure was **existence**, not
naming: the directory was absent on the far machine, and portable-pty's `cwd.or(home)` silently rehomed
the pane (`to_the_laptop` §1, last row; the "four homeless seats"). **If the chair is right, P1a becomes:
at resume, make sure the stored cwd exists — create it with its intake — and REFUSE rather than let the
pty substitute home.** You already wrote that refusal. It is preserved as a PATCH and was deliberately
not applied (`e06cf4d`).

**Why this matters more than it looks: the plan's version is the riskiest step in the whole design.**
It moves live conversation directories. The chair's version moves nothing.

**What would make the chair wrong — go looking for these:**

- **The vendor, not the app, computes the slug.** `encode_cwd` is the app's mirror of it. Check the
  vendor's real directory names under `~/.claude/projects` against `encode_cwd` of the same path. A
  long path, or a character `encode_cwd` treats differently, would break the match.
- **`instances_dir` differs between machines.** D is `C:\Consonance\instances` (`~/.consonance.json`).
  L is believed to be the same (`desktop_first_launch_2026-09-09.md` §11 item 3 flags this as
  unchecked). D also carries a `base` field, `C:\Users\nname\claude-instances`, and a second chair
  lineage exists at `~/.claude/projects/C--Users-nname-claude-instances-main/`. **Find out what reads
  `base`.**
- **Two machines can mint the same 8-hex name** — a 32-bit collision space. State the case; do not
  engineer for it unless the fix is trivial.

## 3 · THE OTHER HALF, WHICH NOBODY DISPUTES — one keep predicate

`keep_test_predicate_2026-09-09.md`, unbuilt: **`is_kept_or_fixed(pane)`, derived from
`fixed_id_seats()`, used at both roster keep sites** — `gc_captures` (`:869-873`, three inline
`keep.insert`s) and `pty_kill` (`:7104`, which spares `MAIN_SID` alone). Point your existing
`the_startup_sweep_keeps_every_fixed_id_seat_not_only_main` at the predicate rather than at
`gc_captures`. The ruling's own falsifier: *a fourth fixed seat added and only one keep test updated.*

**Adjacent, NOT yours this lap:** E's `has_history` repair (never `remove_file` a `.log`; decide on
`max(txt, log)`; an *absent* file is not *trivial*). Name it if you touch that code; do not build it.

## 4 · BARS

    RED FIRST   a resume whose stored cwd is ABSENT -- must be created or refused, never rehomed to home.
                Show it red on HEAD.
    RED FIRST   a fourth id added to fixed_id_seats() -- must be kept at BOTH sites.
    MUTANT      remove the refusal / the create                        => red
    MUTANT      revert :7104 to MAIN_SID-only                           => red
    MUTANT      gc_captures back to inline inserts missing one seat     => red
    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1    state the count
    applied / caught / NOT APPLIED for every mutant, survivors named
    Say what you did NOT verify.

## 5 · THE LANDING CONSTRAINT

**This changes `main.rs`, and the app running on D is the old binary.** Build, test, hand back. **Do not
commit.** The chair lands it, and nothing is claimed until a rebuild-and-launch here has shown it
running. **Nothing in this packet moves, renames or deletes a live conversation directory.** If §2
comes out in the plan's favour, stop at the measurement and hand back. The move is its own step, with
backups, and it is the keeper's to run.

## 6 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs        (and its tests)
    exo_memory/handback/p1-where-a-seat-lives_2026-09-11.md
    exo_memory/map/C.md

**Do not touch the 09-06 set, which is the whole of the tree's dirt and is not the chair's or yours:**
`consonance/tools/lap-row.js`, `lap-row.test.js`, `dev/mutation/mutate-lap-row.js`,
`exo_memory/handback/p-d012-windowed_2026-09-06.md`. **No other pane holds a packet.**

## 7 · WHY YOU — the dossier row

`librarian/DOSSIER.md` § C: *refuses correctly under the collision rule and leaves the work ready for
the next holder* (`handback/p-two-doors_2026-09-02.md` §3, §6). And from 09-09 on this machine, not yet
rowed: the three-seat keep-set in the sweep (`7e6223e`), which passed in production at the 09-10 01:59
launch, and the spawn-side refusal (`e06cf4d`). **This packet is the same code, finished.**

## 8 · PERMISSION TO REFUSE

**If the chair's reading in §2 is wrong, say so with the case that breaks it.** The plan gets its step
back, and that is a good outcome. If refusing at resume would strand a pane worse than rehoming does
— for example, the directory cannot be created — say what the right fallback is, and make it LOUD.

## 9 · HAND-BACK

`exo_memory/handback/p1-where-a-seat-lives_2026-09-11.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  a seat's conversation lives in the same project directory on both machines, or the
                launch says why it does not.
    FALSIFIER:  a pane that resumes in a cwd other than the one panes.json names, with no row saying so.
