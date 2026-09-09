# P-SEAT-SWEEP — the sweep ate the tail, and the tail's absence said nothing

Lap D055, machine D (desktop). Owner of `consonance/src-tauri/src/main.rs` this lap; nothing else
in the repo was touched. Repo `C:\Users\nname\Desktop\lighthouse`, HEAD `7d94177`.

---

## 1. Both fixes taken. The ordering change REFUSED — §6.

Two edits, one file, one rebuild:

**Fix 1 — `append_synced_tail`'s missing-file arm (main.rs:9140-9169, post-fix numbering).** Was
`let Ok(transcript) = fs::read_to_string(&path) else { return };` — a bare, silent return. Now a
`match` whose `Err` arm takes the same path as the POINTER-ONLY arm below it: `plog` a row
(`MIGRATE TAIL sid=… tail=ABSENT (<io error>) intake=… -> POINTER ONLY`) and push
`prior_conversation_pointer`.

One addition beyond the letter of the packet, and it is deliberate. `prior_conversation_pointer`
lives in `sync_launch.rs`, which I do not own this lap, and its wording assumes the file **is**
there and merely too big: *"it did NOT fit in this shell: {bytes} bytes at `…`. Open it before you
answer."* Handed to a seat whose file is gone, that is a pointer at nothing. So the arm appends one
sentence of its own, in `main.rs`, saying the read failed and naming `captures/archive/` as where
the sweep puts a capture it retires. A pointer that misdescribes the disk is the same failure
wearing a helpful face.

**Fix 2 — `gc_captures`'s keep-set (main.rs:869, was :858 at HEAD).** `keep` now inserts `LIBRARIAN_SID` and
`THIRD_PLACE_SID` beside `MAIN_SID`. Three lines, no restructure.

Fix 1 first, as instructed, and the ordering is not decorative: fix 2 closes the disappearance we
measured; fix 1 closes the class. A read can fail for a reason nobody has met yet, and the next
one must leave a row.

---

## 2. What was re-derived at the file, not taken on trust

Everything in the chair's packet checked out. Re-derived here so this file stands alone:

- `gc_captures` at :858; `keep = read_kept() ∪ {MAIN_SID}` at :860. One call site, `.setup()`
  main.rs:9394 (pre-fix numbering). `read_kept()` reads `data/panes.json`; **no fixed-id seat is
  ever written there** — `spawn_main` / `spawn_librarian` / `spawn_third_place` insert into the
  live `panes` map and `letters.json`, never into the kept file. So all three fell through the
  keep-set and only Main was named.
- `append_synced_tail` at :9127; missing-file arm :9129; its own POINTER-ONLY arm :9156-9165.
- **`sync_at_launch` does NOT archive captures.** Worth stating, because the six `retire pane=… ->
  ARCHIVED` rows sit at the same second as the MIGRATE line and read as the migrate's own doing.
  They are not: `retire_capture` has exactly three callers — `gc_captures:876` and `clear_capture`
  from two frontend-driven un-keep paths (:3652, :7092). The migrate's `retire_plan` walks
  `home()` and retires the **`.jsonl` session files**, not the captures. The rows are the sweep's.
- The clock, converted from `data/persist.log` (epochs 1788965944 / 1788965946 / 1788966005):
  **08:59:04** install → **08:59:06** `retire pane=0c0c0c0b… -> ARCHIVED (had history)` →
  **09:00:05** the librarian seat spawns and reads a tail that has been gone for 59 seconds.
  One `MIGRATE TAIL` row in the whole file, `sid=0c0c0c0a` (persist.log:327). No `POINTER ONLY`
  row. Nothing for `0c0c0c0b` at all.
- The hash, re-derived rather than quoted:
  `git -C C:\Consonance\state hash-object C:\Consonance\data\captures\archive\0c0c0c0b-…-115b.txt`
  → `a10d1d0e57e277c327876dd4128cd2bb736ab627`, which `ls-tree -r -l origin/main` gives as the
  tree's **LIVE** blob (7069 B, `data/captures/0c0c0c0b….txt`). The tree's archive blob at that
  path is `ed9c3577` (92,499 B) and was overwritten by the rename. **The file the sweep archived
  IS the file the launcher had just installed.** The librarian's hand-back quoted `8184ad81` and
  `aee4ca3b`; both are wrong and are not propagated here. Its conclusion was right.
- `data/sync-pull.log`: "COMPLETE — 47 of 47 files present" then "installed 46 file(s)". The
  displaced set went to `attic/pre-sync-2026-09-09T14-59-05-515Z` — 14:59:05Z is 08:59:05 local,
  which brackets the install and the retire exactly.

---

## 3. Red-first, and it is red for the right reason

Three tests, new module `migrate_tail_and_sweep_tests` (main.rs:9215-9330), driven against the
real functions with `DirsGuard::take()` and a scratch data **and instances** root — `instances`
matters because `fixed_id_seats()` creates the seat cwds as a side effect, and an empty
`instances` would have made the test write `main/`, `librarian/`, `third-place/` into the
checkout.

To prove red I built a variant that is **HEAD's implementation plus only the new test module**
(`git show HEAD:…/main.rs` + the block spliced at the same anchor) and ran it:

```
test the_startup_sweep_keeps_every_fixed_id_seat_not_only_main ....................... FAILED
  "the sweep archived the librarian seat's tail…"
test a_synced_tail_that_is_not_on_disk_points_the_seat_at_it_instead_of_waking_it_blank FAILED
  "the seat was handed nothing and told nothing… Intake: \"the shell so far\\n\""
test a_synced_tail_that_fits_still_rides_as_the_conversation_itself .................. ok
test result: FAILED. 1 passed; 2 failed
```

The third is *supposed* to pass at HEAD: it is the guard that the fix does not become an
unconditional pointer. Both new-behaviour tests pass after the fix.

`the_startup_sweep_keeps_every_fixed_id_seat_not_only_main` iterates **`fixed_id_seats()`**, not
the three constants, so a fourth fixed seat added there and forgotten in the keep-set turns this
red instead of losing its thread on the next migrate. It also asserts a non-seat leftover *is*
retired — without that, a sweep that keeps everything would satisfy the seat assertions for the
wrong reason.

---

## 4. Mutation battery — 6 applied, 6 caught, 0 survivors, 0 NOT-APPLIED

Each mutant is a single exact-text substitution against the fixed file; the harness refuses to run
if its needle does not occur exactly once, and reports that as **NOT-APPLIED — which proves
nothing** and would be reported as such. It did not occur: all six applied.

| # | mutation | state | caught by |
|---|---|---|---|
| M1 | drop `keep.insert(LIBRARIAN_SID…)` | APPLIED | sweep test |
| M2 | drop `keep.insert(THIRD_PLACE_SID…)` | APPLIED | sweep test |
| M3 | `gc_captures` returns immediately (sweep does nothing) | APPLIED | sweep test (the leftover assertion) |
| M4 | drop the pointer push from the absent arm, keep the row | APPLIED | absent-tail test |
| M5 | drop the `plog` row from the absent arm, keep the pointer | APPLIED | absent-tail test |
| M6 | push the pointer unconditionally, even for a tail that reads | APPLIED | present-tail test |

Every mutant failed exactly one test and left the other two green, so the three tests are not
proxies for each other. M4/M5 matter most: they are the two halves of "plog a row **and** push the
pointer", and each is caught alone.

---

## 5. Suite count, with the command beside it

```
cd consonance/src-tauri
CARGO_TARGET_DIR=<scratchpad>/target-pseat cargo test --bin consonance
```

| | passed | failed | ignored |
|---|---|---|---|
| **before** (HEAD 7d94177, untouched) | 512 | 1 | 4 |
| **after** (both fixes + 3 tests) | **515** | **1** | 4 |

**The one failure is pre-existing and is not mine.**
`ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect` —
`premise: the anchor finds the composer`, `composer_row()` returns `None` on the committed
fixture. It fails at HEAD **before any edit of mine**, and it fails identically when run alone
(`--exact`, 0 passed / 1 failed / 516 filtered), so it is deterministic, not a parallelism
artifact. The fixture is intact: `fixtures/screens/composer_slash_command_reads_empty_2026-09-09.bin`
is 236,387 B on disk and `git cat-file -s` on the HEAD blob is 236,387 — not a CRLF checkout
corruption. The dossier records L053 as **513/0/4**; 512 + 1 = 513, so this is the *same* test set
with one member now red. **I did not touch it** (a failing test is fixed, never weakened), and I
have not diagnosed it — it is the composer-anchor seat's ground, and the discrepancy against L053's
green is worth a lap of someone's attention.

---

## 6. The ordering change: NO, and this is the argument, not a shrug

The librarian asked for the stronger form — *the sweep must not run before the migrate's tail read
at all; a file the launcher installed one second ago is not a leftover.* The premise is right and
I am refusing the remedy. Three reasons, in order of weight:

1. **It is not a race that can be ordered away — the two events are in different processes'
   time.** `gc_captures()` is a line in `.setup()`. The tail read is inside `spawn_librarian` /
   `spawn_third_place` / `spawn_main`, which are `#[tauri::command]`s the **frontend** invokes
   after the event loop is up. The measured gap was 59 seconds, and it is unbounded: a seat the
   user never opens never reads its tail. "Do not sweep before the tail read" therefore has no
   correct implementation as a reorder — it has to become *never sweep*, or *sweep on a timer /
   after all three seats have spawned*, which is a new lifecycle for a function that currently has
   the pleasant property of running exactly once, at a known point, before anything can race it.
   That is a different packet and a bigger blast radius than the one that lost the hour.

2. **The freshness test the argument implies is not sound on the evidence I have.** "Installed one
   second ago" would be read from mtime, and I have not established that `state-sync.js`'s
   `installTree` writes a fresh mtime rather than preserving the source's — the manifest compares
   *hashes*, which is a hint that mtime is not load-bearing anywhere in that tool. A guard whose
   correctness rests on an untested property of another machine's writer is a guard that can fail
   silently in the direction we just paid for. I would not land it without measuring `installTree`
   first, and that file is not mine this lap.

3. **The keep-set fix is complete for the thing that broke.** The failure is a keep-set that is a
   strict subset of the seats the migrate wakes-from-tail. Making it a superset closes it for
   every fixed seat, forever, and the test is driven off `fixed_id_seats()` so it stays closed.
   Ordering would fix the same case a second way while leaving the *shape* of the bug — two lists
   that must agree — undocumented and untested.

**What I would endorse instead, if the chair wants the general form next lap** (I did not take
it): have `sync_at_launch` return the set of paths `--install` actually wrote and hand it to
`gc_captures` as an additional keep-set. That protects *any* travelled capture — including a
committee pane's, which the keep-set fix does **not** cover — and it rests on a fact the installer
already knows rather than on an mtime nobody has measured. It costs a change to
`sync_at_launch`'s return type and touches `sync_launch.rs`, so it is not a one-file lap.

---

## 7. What I did NOT verify — read this part

- **THE ACCEPTANCE TEST IS UN-RUN.** Neither fix is proven end-to-end, and it cannot be without a
  relaunch. **I did not relaunch and did not build into the live target.** `consonance.exe` PID
  15532 is running from `consonance/src-tauri/target/release/consonance.exe` — the very directory
  a build would write — and the keeper is away. Every compile in this lap went to
  `CARGO_TARGET_DIR=<scratchpad>/target-pseat`; `target/` was not written to at all.
- **What the acceptance test would be**, stated so the next person does not have to invent it:
  on D, with the state tree holding a head authored by L, launch Consonance and then assert three
  things in `data/persist.log` — (a) **no** `retire pane=0c0c0c0b…` and no `retire pane=3d000000…`
  row after the MIGRATE; (b) a `MIGRATE TAIL sid=0c0c0c0b… carried=…` row when the librarian
  spawns; (c) `git hash-object` on `captures/0c0c0c0b….txt` still matching the state tree's live
  blob after the sweep has run. And the negative half, which needs the file removed by hand before
  the seat spawns: a `MIGRATE TAIL sid=… tail=ABSENT … -> POINTER ONLY` row, and the seat's shell
  carrying the `PRIOR CONVERSATION — on disk, not in this shell` block.
- **A third silent path remains and I did not take it.** `append_synced_tail:9171` — a capture that
  exists but is *empty* still returns without a row. I left it: the packet named the missing-file
  arm, and pointing a seat at a genuinely empty file would tell it "you have a past here" when it
  does not. But it is silent, and if the room's rule is *every expected tail leaves a row*, that
  arm wants at least a `plog`. The chair's call, not mine.
- I did not verify the *other* two seats ever lost a tail — only the librarian's is in the record.
  Main was spared by the keep-set; third place has no capture in the archive, so it may simply
  never have had one to lose.
- I did not open `exo_memory/librarian/DOSSIER.md`, and did not read the librarian's hand-back
  beyond the two hashes the chair quoted as wrong.
- No `CHANGELOG.md` exists in this repo (the global instruction asks for one); the hand-back files
  and `exo_memory/map/*` are this room's change record and I did not create a competing one.
- Concurrent work by another seat appeared in the tree while I ran (`exo_memory/map/E.md`,
  `exo_memory/handback/p-runtime-score_2026-09-09.md`). Untouched. My diff is
  `consonance/src-tauri/src/main.rs` alone: **161 insertions, 3 deletions**.
- **Nothing is committed.** The change sits in the working tree.
