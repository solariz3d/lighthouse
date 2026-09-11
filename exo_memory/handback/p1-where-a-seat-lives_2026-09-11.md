# P1 · WHERE A SEAT LIVES — hand-back. C, 2026-09-11, on D. Packet D058 at `d89a53a`.

**Built and tested, NOT committed, NOT run in the app.** `main.rs` only. HEAD when measured: `cec0369`.

## 0 · THE FINDING THAT MATTERS, AND IT BREAKS BOTH READINGS

**§2 asked whether committee panes need fixed cwds (the plan) or only need their cwd to exist (the
chair). On naming, the chair is right. But both readings share a premise that is false: that a
matching slug lets `--resume <sid>` find the conversation. `resume_pane` never `--resume`s.**

    main.rs  resume_pane (`fn resume_pane(`), the comment block under the guard:
      "we NEVER `--resume` here" ... spawn_claude_pane(app, pane, cwd, false, …)   // resume=false
      -> `--session-id <pane>`, after renaming any existing <pane>.jsonl to .jsonl.orphaned
         (and `remove_file` on the PREVIOUS .orphaned first, so the one before that is deleted)
    main.rs  fixed_id_seats doc: "`resume_pane` already never `--resume`s at all."

    grep -c '^[0-9]* resume pane=' C:\Consonance\data\persist.log              -> 232
    grep -c '^[0-9]* resume pane=.*-> fresh$' C:\Consonance\data\persist.log   -> 232

**232 of 232 committee resumes on record (since 1783956482, ~07-13) started a new conversation.** A
committee pane wakes from its capture — a new vendor session with the same id, the old transcript
moved aside — **on one machine, before any second machine is involved.** So requirement A (*every
seat is the same conversation at its last turn*) cannot hold for a committee pane on D today, with
or without fixed names, with or without existence. **Fixed seats do `--resume`** (their spawns pass
`resume=true`), which is why the librarian's three originals came back by first timestamp and no
pane did.

**What that means for P1 as scoped:** existence plus refusal is still right and still necessary —
it closes the packet's falsifier, which fired on this machine AFTER 09-09 (§1). **It is not
sufficient for A.** The third precondition is that `resume_pane` actually `--resume`s when the jsonl
is where the cwd says. That reverses a 07-11 decision made against vendor 2.1.207's lazy flush
("no conversation found" killed a kept pane); the vendor is now 2.1.266. **Not built:** it reverses
a recorded decision, and whether 2.1.266 still loses a hard-killed session is a measurement nobody
has taken. That is the next packet, and it is the one A actually waits on.

**And the directories the chair measured as matching are EMPTY of their panes' conversations:**

    ~/.claude/projects/C--Consonance-instances-sibling-3d57124e   A   no <sid>.jsonl
    …-sibling-5bf9d657                                            B   no <sid>.jsonl
    …-sibling-07b8a48f                                            E   no <sid>.jsonl
    …-sibling-0845a868                                            C   one — this session's, since 02:06
    ~/.claude/projects/C--Users-nname/<sid>.jsonl                 all four, last written 09-10 01:53
    (ls ~/.claude/projects/*/<sid>.jsonl* for each of the four ids in data/panes.json)

`dir true | project true` measured that a directory exists, not what is in it. **The panes' last
real conversations are in the home slug**, where the 09-09 rehoming put them. P2, if it is keyed on
the slug `panes.json` implies, will carry three empty directories and miss all four conversations.

## 1 · §2 MEASURED — the chair's three ways to be wrong, each checked

**(a) The vendor, not the app, computes the slug.** Every vendor project dir on D whose transcripts
record a cwd, checked against `encode_cwd`'s rule applied to that cwd:

    node scratchpad/slug_check.js      (script text reproduced in §7)
    -> total 31, match 24, mismatch 0, no cwd recorded 7; longest dir name 146

**24 of 24, no mismatch.** Includes `C:\Users\nname\Desktop\brain rot` (space) and the long Temp
paths. **Not exercised:** a path over ~200 characters (where I believe, unverified, the vendor
truncates and appends a hash) and a non-BMP character (the vendor's JS regex runs on UTF-16 units,
so an emoji would be two `-` there and one in `encode_cwd`). Neither occurs in any cwd the app mints.

**(b) `instances_dir` differs between machines.** L's own records say it does not: the laptop
chair's placed transcript
(`D:\consonance-L-20260911\files\consonance-attic\C--Consonance-instances-main\0c0c0c0a….jsonl`)
carries `"cwd":"C:\\Consonance\\instances\\main"` on **27,387 records** and quotes L's config as
`"instances_dir": "C:\\Consonance\\instances"` (22 occurrences). Strong evidence, not a read of L's
config today. **`base` is read by nothing:** `main.rs:37` names it a dropped launcher-era field that
serde ignores; no reader in `consonance/**`, `dev/**`, or `~/.claude/shell` (grep of every file
that opens `.consonance.json`). The real hazard is the one `base` resembles: **an empty
`instances_dir` falls back to `default_instances()` = `%USERPROFILE%\claude-instances`**, which is
where the second chair lineage `C--Users-nname-claude-instances-main` came from. On a machine with
that config every fixed seat's slug differs and every carried committee cwd lands outside the
instances root — which the guard below now REFUSES loudly instead of rehoming.

**(c) Two machines mint the same 8-hex name.** 32 bits. With n names of one prefix across both
machines, p ≈ n²/2³³: at n = 20, ~5 × 10⁻⁸. Consequence if it happens: two panes share one cwd;
transcripts do not collide (the sid is a full UUID), but `warm_resume_brief` writes one
`CLAUDE.md` per cwd, so the second pane to wake reads the first one's memory. The local half is
trivial (`create_dir` + retry in `prepare_sibling_dir`) and does nothing for the cross-machine
case, which is the one asked about. **Not engineered.**

**Verdict on §2: the chair is right that renaming buys nothing that carrying the string does not.
The plan's P1a stays withdrawn. And §0 is the case that breaks both of them.**

## 2 · THE FALSIFIER FIRED ON D, AFTER 09-09, AND NOBODY HAD NAMED IT AS THAT

    data/persist.log  1789026884 (2026-09-10 01:54:44)
      resume pane=12fb81f6…  warmed=false jsonl_existed=false -> fresh      (B)
      resume pane=a2122153…  warmed=false jsonl_existed=false -> fresh      (E)
    stat: sibling-5bf9d657 and sibling-07b8a48f born 2026-09-10 01:56:41
    cd36189 (librarian, 01:57): "B and E 'Session ID already in use' — fixed by two empty directories"

B and E resumed into cwds that did not exist, the pty substituted `%USERPROFILE%`, and they died
colliding with their own transcripts from the 09-09 rehoming. The launch recorded nothing that said
why; the librarian diagnosed it by hand and made the directories. **That is exactly the packet's
FALSIFIER — a pane that resumes in a cwd other than the one panes.json names, with no row saying
so.** It is also why the rehome is not always silent: when the home slug already holds that id,
the vendor refuses it. Silent the first time, dead the second.

**`cd36189` left an item owed to me: "the orphan-rename must look where the transcript actually
is."** Closed differently: with the guard, a pane can no longer be rehomed, so its transcript can
only be at the slug of the cwd `panes.json` names and the rename looks in the right place by
construction. **The four existing homeless transcripts in `C--Users-nname` are not moved** — nothing
in this packet moves a conversation, and they are §0's P2 problem.

## 3 · WHAT WAS BUILT

**`ensure_resume_cwd(pane, cwd) -> Result<ResumeCwd, String>`**, called in `resume_pane` before
its first side effect (before `warm_resume_brief`, which writes CLAUDE.md and can window the capture
into the attic; before the jsonl rename; before the spawn):

| stored cwd | outcome | row |
|---|---|---|
| is a directory | `Present` | none |
| absent, a **direct child of the instances root**, plain absolute path | **created** → `Created` | `persist.log` `CREATED` + board row `resume` |
| exists and is a FILE | **refused** | `persist.log` `REFUSED` + board row |
| absent, outside the instances root (a room, a project, an unmounted drive) | **refused, not created** | same |
| contains `.`/`..`, relative, or nested deeper than one level | **refused, not created** | same |
| absent and `create_dir_all` fails | **refused** | same, with the OS error |

**Why create rather than only refuse — the choice, stated.** The parked patch (`e06cf4d`) refused
only, and was parked because 0 of 4 committee cwds resolved on 09-09: armed, it would have refused
the whole committee. A roster arriving from the other machine produces exactly that state every
time. A direct child of the instances root is this app's directory to make —
`prepare_sibling_dir` / `prepare_fresh_dir` mint exactly that shape — and its contents regenerate:
`warm_resume_brief` writes the intake next. **So creation is what makes the refusal safe to arm.**
Refusal is kept for everything that is not this app's to make. **`panes.json` travels between
machines, so its cwd is input from outside;** the direct-child and no-`..` rules are there so a
carried string cannot aim a `create_dir_all` anywhere else.

**A recreated `fresh-` dir stays fresh.** The fresh marker is the directory NAME
(`is_fresh_dir_name`), which the cwd string carries, so recreation cannot turn a vanilla pane into a
briefed, mounted, permission-skipping sibling. Pinned by a test because a future marker inside the
directory would silently make recreation an escalation.

**The board row is what makes it loud.** `restoreKeptPanes` (`ui/term.js:1031-1049`) swallows a
failed resume and still reports "N kept instances resumed", so a refusal that only returned `Err`
would be visible in `persist.log` alone. Both CREATED and REFUSED now push a `resume` row to the
board. **The roster row is kept on refusal** — nothing in `resume_pane` writes `panes.json`.

**The one keep predicate — `is_kept_or_fixed(pane, kept)`**, derived from `fixed_id_seats()`:

- `gc_captures` decides through it (the three inline `keep.insert`s are gone).
- `pty_kill` decides through `retire_capture_unless_kept(pane)`, a two-line helper split out so the
  kill-side decision is tested against a real capture directory. **`:7104`'s `MAIN_SID`-only test is
  gone** — closing the librarian's or the Third Place's pane no longer archives the capture it wakes
  from.
- Side effect named: `fixed_id_seats()` creates the seat cwds (`main_cwd()` etc.), so the predicate
  does too. Both callers run where those directories already exist.

**Deviation from §3, stated:** the packet said to point the existing
`the_startup_sweep_keeps_every_fixed_id_seat_not_only_main` at the predicate instead of at
`gc_captures`. **I left it pointed at `gc_captures` and added a predicate test beside it.** Re-pointing
would have removed the only BEHAVIOURAL test of the sweep, and M7 below is caught by it. The
comment at `gc_captures` that named it as a one-site guard now names the predicate.

## 4 · BARS

    cd consonance/src-tauri
    CARGO_TARGET_DIR=<scratchpad>/target cargo test --bin consonance -- --test-threads=1

| | passed | failed | ignored |
|---|---|---|---|
| lab at HEAD `cec0369` (not the checkout) | 514 | 3 | 4 |
| working tree, with this change | **526** | **1** | 4 |

The one tree failure is the pre-existing composer red
(`ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`), red at
HEAD, not mine to touch. The lab's other two
(`repo_root_tests::the_checkout_resolves_wherever_this_source_actually_is`,
`managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists`) fail only
because the lab is not a checkout (09-09 §8 names the same two), so the tree at HEAD is 516/1/4 and
the change adds 10 tests. Warnings 7 before, 7 after.

**RED FIRST and MUTANTS** — every row ran in the scratch lab (a `git archive HEAD` of `consonance/`
plus the `exo_memory` paths `tauri.conf.json` embeds), never in the working tree. The runner is
`scratchpad/mutate.js`; each row writes `mut_<id>.txt`.

| row | what | applied | result |
|---|---|---|---|
| **R1** | RED FIRST — resume at HEAD's behaviour (no check; resume_pane does not call it) | APPLIED | **6 red**: absent-created, file, outside, climb/nest, fresh-stays-fresh, guard-wiring |
| **R2** | RED FIRST — keep at HEAD's behaviour (kill spares `MAIN_SID` alone; gc inlines three) | APPLIED | **2 red**: closing-a-fixed-seat, both-sites |
| **R3** | RED FIRST — R2 + a fourth id in `fixed_id_seats()` | APPLIED | the two above **plus** `the_startup_sweep_keeps_every_fixed_id_seat_not_only_main` — the fourth seat is missed at HEAD at BOTH sites |
| **G4** | the fix + a fourth id in `fixed_id_seats()` | APPLIED | **green** at both sites, no test edited (only the 3 baseline reds) |
| M1 | remove the refusal (`refuse` passes through) | APPLIED | caught — file, outside, climb |
| M2 | remove the create | APPLIED | caught — absent-created |
| M3 | remove the direct-child / no-`..` rule | APPLIED | caught — climb, outside |
| M4 | guard moved after `warm_resume_brief` | APPLIED | caught — guard-wiring |
| M5 | refusal arm falls through (no `return`) | APPLIED | caught — guard-wiring |
| M6 | revert `:7104` — `pty_kill` back to `MAIN_SID`-only, inline | APPLIED | caught — both-sites |
| M6b | same revert inside the helper | APPLIED | caught — closing-a-fixed-seat |
| M7 | `gc_captures` back to inline inserts, missing the Third Place | APPLIED | caught — the existing sweep test + both-sites |
| **M8** | **predicate hand-lists the three seats instead of reading `fixed_id_seats()`** | APPLIED | **SURVIVED** |
| M8x4 | M8 + a fourth seat | APPLIED | caught — predicate, closing-a-fixed-seat, sweep |
| M9 | predicate forgets kept panes | APPLIED | caught — predicate |
| M10 | predicate keeps everything | APPLIED | caught — predicate, closing, sweep |

**12 mutants applied, 11 caught, 1 survived; 0 not applied.** **The survivor, M8, is equivalent
while there are three seats:** a hand list of today's three seats behaves the same as the derived
one. It becomes a defect only when a fourth seat is added, and at that moment it is caught (M8x4),
because every keep test is driven off `fixed_id_seats()`. That is the ruling's falsifier, tested
where it actually happens. I did not add a source-text assertion to kill M8 early: that would pin
how the predicate is spelled rather than what it does.

## 5 · NOT BUILT, NAMED

- **`resume_pane` never `--resume`s** (§0). The precondition A actually waits on.
- **The four homeless transcripts** in `C--Users-nname` — the panes' last real conversations.
  Not moved (§5 of the packet). P2 has to decide whether they are carried, and from where.
- **`pty_reopen`** resolves an EMPTY cwd to `home()` explicitly and does not check a non-empty one,
  so a directory deleted under a live pane rehomes on crash-relaunch. It `--resume`s, so the rehome
  errors ("no conversation found") instead of being silent. Same guard would fit; the explicit
  `home()` fallback is a separate decision and it is not this packet's.
- **E's `has_history` repair** (never `remove_file` a `.log`; decide on `max(txt, log)`; absent is
  not trivial). `retire_capture` not touched.
- **8-hex collision** (§1c).
- **No `CHANGELOG.md` exists in this repo** (checked root and `consonance/`); the record here is the
  commit body and this file. Creating one is outside what this packet owns, so it's left to the chair.

## 6 · WHAT I DID NOT VERIFY

- **NOTHING HAS RUN IN THE APP.** No rebuild, no launch; `target/` was never written (the lab and
  tree builds used a scratchpad `CARGO_TARGET_DIR`). **Acceptance test, for the rebuild-and-launch
  the chair owns:** with the app closed, rename one committee pane's directory aside (e.g.
  `sibling-07b8a48f` → `sibling-07b8a48f.aside`), launch, and expect (1) `persist.log`:
  `resume pane=a2122153… CREATED cwd "C:\\Consonance\\instances\\sibling-07b8a48f"`, (2) a board row
  from `resume`, (3) the pane's banner showing that cwd, not `C:\Users\nname`, (4) no new
  `C--Users-nname/a2122153….jsonl`. Then delete the new empty directory and move the original back.
  That touches a pane's working directory, not its conversation, but it is still the keeper's to
  run.
- **The refusal has never been seen in the UI.** The board row is asserted only by reading the
  code; `board_push` inside `resume_pane` cannot be called from a test.
- **L's `instances_dir` today** — inferred from L's records (§1b), not read.
- **The vendor's long-path and non-BMP behaviour** (§1a) — reasoned, not measured.
- **Whether vendor 2.1.266 still loses a hard-killed session's jsonl** — the fact §0's next packet
  turns on. Not measured.

## 7 · REPRODUCE

- `scratchpad/slug_check.js`: for every dir under `~/.claude/projects`, the first `"cwd"` recorded in
  its first transcript (256 KB read), encoded as `encode_cwd` does (every char not `[A-Za-z0-9]` →
  `-`), compared with the dir name.
- `scratchpad/mutate.js`: the battery in §4; lab reset to HEAD after the last row.
- Scratchpad: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad`
  — session-scoped, may not outlive the session; both scripts are short enough to rewrite from §1a
  and §4's description.

    OBJECTIVE:  a seat's conversation lives in the same project directory on both machines, or the
                launch says why it does not.
    STATUS:     the second half is built — the launch now says (CREATED / REFUSED, persist.log and
                board). The first half is NOT met for committee panes and cannot be by P1: they
                never resume their conversation, on either machine (§0).

*Written by the C seat (sibling-0845a868). Nothing committed; the chair lands it.*
