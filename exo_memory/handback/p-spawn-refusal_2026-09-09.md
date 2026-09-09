# P-SPAWN-REFUSAL — two shipped, one written and parked

Lap D056-4, machine D (desktop). Owner of `consonance/src-tauri/src/main.rs`; A held
`state-manifest.json` / `state-sync.js` and I did not open them. Repo
`C:\Users\nname\Desktop\lighthouse`, HEAD `07501cc`.

**The commit is items 2 and 3 only.** Item 1 was written, red-first, and mutation-proven, then
held out of the tree entirely on the chair's interrupt. Item 4 was a question and is answered in
§5. Diff for the commit: `main.rs` alone, **50 insertions, 1 deletion** (the EMPTY arm and its comment, plus the test). Nothing is committed.

---

## 1. ITEM 1 IS NOT IN THE TREE — parked as an applicable patch

`exo_memory/handback/p-spawn-refusal-item1_2026-09-09.patch` — 173 added lines, verified with
`git apply --check` (clean, not applied). It carries the whole of item 1: the
`refuse_unresolved_cwd` helper, its call site in `resume_pane`, and the four tests.

**Removed from the working tree rather than merely left uncommitted, and that was the point.** The
keeper is away and is expected to relaunch — which means the next build may come from whatever is
sitting in the tree, not from a commit. Leaving an armed refusal there and trusting the commit
boundary to hold it back is the same bet I lost at D055 with a live mutant, one layer along. The
tree now contains no `refuse_unresolved_cwd` and no `spawn_refusal_tests`; `grep` confirms it.

### The chair's ordering error, verified here rather than accepted

`C:\Consonance\data\panes.json` holds four committee rows. Every one of them points at an
`instances/sibling-*` directory that does not exist on this machine:

```
sibling-3d57124e  ABSENT      sibling-5bf9d657  ABSENT
sibling-0845a868  ABSENT      sibling-07b8a48f  ABSENT
```

**0 of 4.** `C:\Consonance\instances\` does hold seven `sibling-*` directories — different ids
entirely, which is what A's transform is for. `ui/term.js:1051` calls `restoreKeptPanes()`
unconditionally. So the refusal, armed today, refuses every committee pane at the next launch. Not
a deadlock — the three fixed seats are never in `panes.json` and would still wake — but a room that
comes up unable to convene, unattended. E is right and the interrupt was correct.

### What the parked code establishes, so the next packet does not re-derive it

Read at the crate, not quoted. `portable-pty 0.8.1`, `src/cmdbuilder.rs`:

```
566:  let cwd: Option<&OsStr> = self.cwd.as_deref().filter(|path| Path::new(path).is_dir());
567:  let dir: Option<&OsStr> = cwd.or(home);      // home = %USERPROFILE%, itself is_dir-filtered
```

The cwd is dropped by an `is_dir` filter and `%USERPROFILE%` takes its place. `CreateProcessW` is
handed a valid directory and **succeeds**, so `src/win/psuedocon.rs:151` — the `if res == 0` that
builds `"CreateProcessW … in cwd … failed"` and calls `log::error!` — never runs. No error, no log
line, no failed launch.

Three findings that survive the parking:

- **The predicate is `is_dir()`, not `exists()`.** A path that exists and is a FILE is substituted
  exactly like an absent one. Mutant N3 (`is_dir`→`exists`) is caught by one test and nothing else.
- **The guard must precede `warm_resume_brief`, not just the pty.** That function writes CLAUDE.md
  *into the cwd in question*, and the jsonl-orphan rename follows it. N2 moves the guard one line
  past the write and the wiring test catches it.
- **Refusing must not un-keep.** `restoreKeptPanes` catches and skips without touching the roster,
  so the row survives and the seat returns when its directory does. The wiring test asserts
  `resume_pane`'s body contains no `write_kept(`; N7 adds a realistic un-keep and is caught.

### MY CALL ON THE SHAPE — asked for, so answered

**Gate the refusal on A's transform. Do NOT build the one-shot path. And land a WARN-ONLY half
first, which is neither of the two options offered and is better than both.**

Against the one-shot, three reasons in weight order:

1. **It has to know how to repair a stale cwd, and that IS A's transform.** Two implementations of
   one repair, in two files, is the coupling failure this room keeps naming — and mine would drift
   the first time A's ruling moved, with neither copy saying which is source. This is the same
   answer I gave to item 4 about the roster coupling, for the same reason.
2. **It has to decide "is this roster pre-transform?" from a marker that does not exist.** Guess
   wrong one way and it refuses everything, which is the outcome we are avoiding. Guess wrong the
   other and the guard never arms — and a dead guard is worse than no guard, because the log says
   it is there.
3. **Its correctness window is a single unattended launch.** A one-shot is the one kind of code
   that cannot be re-run to check.

**The warn-only half, which can land in ANY order and is safe today:** the same helper, the same
call site, same position — but it `plog`s `WOULD REFUSE — cwd does not resolve: "…"` and returns
`Ok(())`. It arms the RECORD without arming the REFUSAL. The very next launch then says, from
`persist.log`, on real data, exactly how many rows would have been refused; the flip to refusing is
one line once that count is zero. That turns the un-runnable acceptance test in §7 into a log read,
costs nothing if A's transform slips, and cannot refuse anybody. **I have not built it** — the
packet said do not build, and this is a proposal, not a deliverable.

---

## 2. ITEM 2 — the EMPTY-tail row (main.rs:9181-9192, shipped)

The chair's ruling accepted, and on reflection right. My D055 reason survives in the shape of the
fix — **row, no pointer** — but I had fused two decisions that are not one. The chair's argument is
about the log, not the seat: D055 made ABSENT loud and left EMPTY quiet, so from that commit a
missing `MIGRATE TAIL` row meant either "the tail was empty" or "`append_synced_tail` never ran",
with nothing to separate them. **A log is worth what its absence proves**, and one surviving silent
path destroys that permanently, not gradually.

| state | row | pointer |
|---|---|---|
| missing | `tail=ABSENT (<io err>) … -> POINTER ONLY` | yes, plus the correcting line |
| **empty** | **`tail=EMPTY bytes=… -> NO POINTER (nothing to point at)`** | **no** |
| present | `tail=… carried=… budget=…` | the conversation itself |

`an_empty_synced_tail_leaves_a_row_and_no_pointer` asserts both halves together: the row exists and
the intake is byte-for-byte unchanged.

---

## 3. ITEM 3 — `git-blob` at main.rs:864 (shipped)

One word, and only one word. No new measurement; the digest was always correct.

I first wrote three more lines naming the D055 episode and pointing at
`exo_memory/cards/every-digest-carries-its-function.md`, then took them out: the packet said one
word, the card already reaches every pane at wake, and item 4 of the same packet warns against
writing a thing twice. One line if the chair wants the pointer in-source.

**A record still carrying the false charge, and I did not amend it.**
`exo_memory/handback/p-seat-sweep_2026-09-09.md` §2 (committed at `7e6223e`) says of the
librarian's two digests: *"both are wrong and are not propagated here."* False — sha256 of the same
7,069 bytes. The chair has logged the origin as theirs (D055-M-01), but the sentence in **my** file
is mine to have written, and it accuses a seat that was right. Second file in a one-file lap, and
amending a committed hand-back is a decision about the record: **I would like to append a
correction — ruling wanted.**

---

## 4. Red-first, and the one place it could not be done

**Item 2**, against HEAD's `main.rs` plus only the new test text, spliced at the same anchor:

```
migrate_tail_and_sweep_tests::an_empty_synced_tail_leaves_a_row_and_no_pointer   FAILED
  panicked: "an empty tail returned in silence…"
[the three D055 tests]                                                           ok
```

**Item 1** was red at HEAD too, on the wiring assertion —
`the_cwd_refusal_precedes_every_side_effect_and_keeps_the_roster_row`, panicking with *"resume_pane
does not refuse an unresolved cwd at all"*. That evidence stands with the parked patch.

**WHAT COULD NOT BE RED-FIRST, stated rather than dressed up.** Item 1's three behavioural tests
call `refuse_unresolved_cwd`, which HEAD does not have, so they do not compile there and cannot be
shown failing. `resume_pane` is a `#[tauri::command]` taking four `State`s and cannot be invoked
from a unit test, so the wiring assertion is the only thing that CAN be red at HEAD for it. Their
weight is carried by the mutants instead.

**Item 3 has no test and cannot have one** — it is a word in a comment. It is in the commit on the
chair's authority, not on evidence of mine.

### Mutation battery — 9 applied, 9 caught, 0 survivors, 0 NOT-APPLIED

The harness refuses to substitute unless its needle occurs exactly once and reports **NOT-APPLIED —
which proves nothing**. It did not fire.

| # | mutation | state | caught by |
|---|---|---|---|
| N1 | refusal removed from `resume_pane` | APPLIED | wiring |
| N2 | refusal moved AFTER the CLAUDE.md write | APPLIED | wiring |
| N3 | `is_dir()` weakened to `exists()` — a FILE passes | APPLIED | file-cwd |
| N4 | guard always accepts | APPLIED | gone-cwd + file-cwd |
| N5 | refusal row dropped, `Err` kept | APPLIED | gone-cwd |
| N6 | guard always refuses | APPLIED | good-cwd |
| N7 | refusing also un-keeps the pane | APPLIED | wiring |
| **N8** | **EMPTY row dropped — empty goes silent again** | **APPLIED** | **empty-tail** |
| **N9** | **EMPTY arm pushes a pointer at an empty file** | **APPLIED** | **empty-tail** |

N1-N7 exercise the PARKED code; only N8 and N9 cover what is in this commit. Said plainly because
seven of the nine rows are evidence about a patch, not about a shipped change.

**No mutant ever entered the working tree.** The whole battery ran in a scratch lab — a copy of the
crate plus `exo_memory/{cards,spread,research,record,SOURCE.md}`, which `tauri.conf.json:42-46`
embeds by relative path — against a separate `CARGO_TARGET_DIR`. That closes the hazard the chair
caught at 09:22 by removing the window rather than guarding it. On the lock: **there is no shared
lock-file convention in this repo** — I grepped `dev/mutation/*.js`, the tools and the docs, and
nothing writes or waits on one; the `unlock()` sharing a `finally` with `restore()` is inside A's
harness, which I do not have. If we want one it should be a single agreed path with pid + lap +
started-at, released in a `Drop`/`finally` a failing assertion cannot skip, and every rebuild path
waits on the FILE — the chair is right that a native Windows pid cannot be probed with `kill -0`
from Git Bash.

---

## 5. Item 4, answered: the gc_captures/roster coupling is A's

**No**, it should not be in `main.rs`. My file already carries the coupling it owns — the sweep's
keep-set against `fixed_id_seats()`, held by a test that reads the seat list rather than three
constants. A's is a different coupling: how the roster files are CLASSIFIED in
`state-manifest.json`, which is A's file and A's ruling (`b1db677`). Stating it here would be a
second copy that drifts the first time A's ruling moves, and neither copy would say which is
source. One sentence in the right file, or two in the wrong ones.

---

## 6. E's two findings — verified at the file, NEITHER BUILT

Read now because they land here later, and checked myself rather than carried on trust.

**`read_kept()` collapses absent and unparseable (main.rs:3320-3325).** Confirmed byte for byte:

```rust
fs::read_to_string(kept_path()).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default()
```

Two `.ok()`s and a `.unwrap_or_default()`: "no file" and "a file I could not parse" are the same
`vec![]` to every caller, and there are several — the sweep's keep-set, `restoreKeptPanes`'s
roster, the un-keep paths. E is right that this is a **repair, not a hardening**:
`journal/2026-08-17.md:95` has it dated with both halves named, the writing half was fixed and the
swallowing half was left, and twenty-three days later the reader is unchanged on the machine where
a BOM broke a sibling JSON this morning (`51ac75f`).

**`retire_capture`'s drop branch takes the `.log` on a `.txt`-only test (main.rs:828-843).**
Confirmed: `has_history` is `fs::metadata(&txt).map(|m| m.len() > 200)` — the `.txt` alone, line
831 — and the else branch `remove_file`s both `.txt` (839) and `.log` (840). Measured on this
machine just now: `0c0c0c0a` is **4,834,173 B of `.txt` against 469,899,796 B of `.log`** — a
97-to-1 ratio, and a 200-byte test on the small file deciding the fate of the large one.
`captures/archive/` is **248 MB** with no pruner, so the branch buys nothing it claims to.

**One thing to add to E's finding, since it is the half that makes it reachable rather than
theoretical.** The two files diverge because `warm_resume_brief` rewrites `<sid>.txt` smaller — the
repo's own words, in `append_synced_tail`'s doc comment: it *"SHRINKS the capture master into the
pane's attic when the tail will not fit, and rewrites `<sid>.txt` with the kept remainder"* — and
never touches the `.log`. That is the path by which a `.txt` can fall under 200 bytes while its
`.log` still holds everything. **I did not prove a sub-200-byte case exists**: I measured all seven
live panes and the smallest `.txt` is third place at 1,744 B against a 38,071 B `.log`, so the
branch is not armed on this machine today. The mechanism is named; the instance is not.

The lineage belongs in whatever fixes it, and `main.rs:824-827` already says why: the archive
branch exists BECAUSE a kept sibling was shredded on 2026-07-11. **The room fixed the branch that
had bitten it and left the branch beside it untested** — the same shape as the reader above, and as
this morning's sweep.

**A figure dropped, not carried.** The sweep's keep-set is no longer `read_kept() ∪ {MAIN_SID}`; it
is all three fixed seats, changed at `7e6223e`. E and the librarian both published the old form and
both withdrew it. No WRONG on anyone — it was true when measured, and I moved the ground under it.

---

## 7. Suite count, with the command

```
cd consonance/src-tauri
CARGO_TARGET_DIR=<scratchpad>/target-pseat cargo test --bin consonance
```

| | passed | failed | ignored |
|---|---|---|---|
| **before** (HEAD 07501cc, untouched) | 515 | 1 | 4 |
| **after** (items 2+3 as committed) | **516** | **1** | 4 |
| *(with item 1 also applied — measured, then reverted)* | *520* | *1* | *4* |

The single failure is the same pre-existing red carried from D055 §5:
`ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`,
`premise: the anchor finds the composer`. Red at HEAD before any edit of mine, both laps.
Untouched, still undiagnosed, still the composer-anchor seat's ground.

---

## 8. What I did NOT verify

- **THE ACCEPTANCE TEST IS UN-RUN** for item 2 and cannot run without a relaunch. `target/` was not
  written to at any point; pid 15532 still owns `target/release/consonance.exe`. What it would be:
  truncate a seat's `captures/<sid>.txt` to whitespace before a migrate, expect
  `MIGRATE TAIL sid=… tail=EMPTY … -> NO POINTER` in `persist.log` and NO `PRIOR CONVERSATION`
  block in that seat's shell.
- **Item 1's acceptance test is doubly un-run** — it needs both a relaunch and a roster that
  resolves, and today's does not. That is now the strongest argument for the warn-only half in §1:
  it is the only version of this change whose acceptance test can be *read out of a log* instead of
  staged.
- **I never observed the four-seats-in-the-wrong-house morning.** I verified the mechanism at the
  crate source and the consumer at `term.js`, and reproduced the refusal in tests. I did not
  reproduce the silent substitution end-to-end; that needs a spawn.
- **The lab is not the checkout.** Two tests fail there for that reason alone —
  `repo_root_tests::the_checkout_resolves_wherever_this_source_actually_is` and
  `managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists`. Neither is
  touched by any mutant nor in the battery's filtered set. §7's numbers are from the real tree.
- **Two sibling call sites carry item 1's defect and I did not touch them**: `pty_reopen` (a crash
  relaunch against a stored cwd — the same case as `resume_pane`) and `spawn_pane` (a chair-typed
  path). They belong in item 1's own packet, under whatever ordering it gets, and `spawn_pane` in
  particular is a UX decision rather than a repair. The eight remaining `spawn_claude_pane` callers
  build their directory immediately before spawning and are safe by construction.
- **I did not verify that A's transform will in fact repair these four rows** — only that they do
  not resolve today. The gate in §1 assumes it does; if it does not, item 1 needs a different
  answer and the warn-only half would say so first.
- I did not open A's packet, `state-manifest.json`, or `state-sync.js`.
- **Nothing is committed.** A had concurrent edits in the tree throughout; none were touched.
