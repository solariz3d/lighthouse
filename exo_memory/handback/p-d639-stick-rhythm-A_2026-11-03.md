# D639 — the stick rhythm, and step 0 (empty the stick, carry whole tonight) — pane A, 2026-11-03

Tier: prove it. Branch `d639-a` off origin/main `fe69a9fc`, worktree `C:\Users\nname\Desktop\worktrees\a-d639-wt`. Not pushed.
Scratch: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\d639\` (below: `S\`).
**Written in two passes. Pass 1 (rung first) was the measurement and the dry run, sent BEFORE anything left D:,
because the dry run showed two problems (§4; the second was false, §5). Pass 2 has the bound, the move, the panes and the trim.**

## §1 Measured times on this stick (read-only, BelowNormal)

Same commands the app runs at its setup window (`stick_rehearse_blocking`, `main.rs:15137-15139` on fe69a9fc), from the
lighthouse checkout, stick `D:\consonance-L-20260911` (set of 10-28: 7 pending FULL tails, 3,552,348,351 B).

    checked: S\times-run1.jsonl, S\times-run2.jsonl (node S\time3.js <checkout> D:\consonance-L-20260911 <out>)

| stage | run 1 (cold) | run 2 (warm, 2 min later) | bound today |
|---|---|---|---|
| --verify-set | **278.8 s** | 6.2 s | 300 s |
| --import (rehearsal) | 0.08 s, CANNOT_RUN: my script's data path was wrong (`C:Consonancedata`); not a measurement | 0.18 s, NOTHING_TO_DO (every pending tail is D's own) | 300 s |
| --export (rehearsal) | 0.19 s, same script fault | 0.17 s, REHEARSED, 9 seats FULL | 300 s |

- The cold verify-set read 3.55 GB in 278.8 s, about 12.1 MiB/s, which is **93% of its 300 s bound**. The warm one is the
  Windows file cache. **A laptop meets the cold case**, because the stick has just been plugged in there.
- On D: the import and export rehearsals are cheap, because D has nothing to import and FULL rows hash nothing. On the
  laptop the import rehearsal is the expensive one: `planImport` reads every pending tail whole and hashes it
  (`dev/tail-carry.js` `fs.readFileSync(tailPath)` then `sha256`), so it reads the whole set a second time.
- Tonight's whole carry is **7,101,773,612 B** (the 9 seats' sizes in S\r2--export.json, summed): main 938,405,736;
  librarian 797,417,180; third place 575,040,063; 6fe15f0a 1,254,180,397; 12fb81f6 619,310,790; 0845a868 1,364,784,640;
  a2122153 1,058,071,433; c88002b1 369,252,846; fbf98f8e 125,310,527.
  - inferred: a cold laptop verify-set of that is about 7.1 GB / 12.1 MiB/s ≈ 560 s, and the import rehearsal reads it again,
    so **the laptop's setup-window rehearsal cannot finish inside 300 s** on today's build. Check: run 1's rate, scaled.
- The close's own save. `C:\Consonance\data\persist.log`, LEAVE SAVING → LEAVE NOT_DONE: **every Leave save since 10-20 was
  cut at its 600 s bound** — 10-20 10:39, 10-26 15:25, 10-30 10:26, 10-30 12:36 (each "did not finish within 600s and was
  stopped"; 10-27's was a CANNOT_RUN, the damaged ledger). The measured whole carry of 10-28 wrote 3,552,348,351 B in
  667 s (`handback/p-d501-2-A_2026-10-28.md:72`), so a whole set does not fit 600 s on this stick.
  - The 10-30 12:36 cut left `12fb81f6-….0-609262463.tail.writing-16716` (609 MB) and `ledger.lock` naming pid 16716,
    18:36:14Z — the same minute. That is where the stale lock and one partial came from.
- Dry run on G: (local disk, §4): export --apply of the whole set 49.4 s; verify-set 11.9 s; import rehearsal 15.7 s;
  import --apply 35.5 s. These are disk-speed figures, not the stick's.

## §2 Which bound lives where, and tonight

| what | where | bound on the running build | reaches tonight? |
|---|---|---|---|
| setup-window rehearsal (verify, import, export) | `main.rs` `stick_rehearse_blocking` | 300 s wall clock | no — tonight runs no rehearsal; it is the LAPTOP's arrival |
| the close's own save (the Leave) | `main.rs` `leave_run`, LEAVE_EXPORT_TIMEOUT | 600 s wall clock | yes, and it will be cut: 7.1 GB > 600 s at 5.1 MiB/s |
| the armed waiter, pid 12160 | `C:\Consonance\staged\d501-saturday\saturday-carry.ps1` (sha256 9195f780…3581), steps 1-2 | **none**: `Step` waits on `WaitForExit(2000)` in a loop with no limit (lines 72-86) | yes |
| the exit waiter | `dev/stick-waiter.js` `defaultExport` | none (spawnSync, no timeout) | yes, only if the Leave crashed |

- So **tonight's waiter carry cannot time out**: it has no bound at all. Nothing in it needed changing, and pid 12160 was not
  touched. Its export uses the checkout's `dev/tail-carry.js`, which is origin/main's (no diff).
- Tonight's order of events, inferred from the code: the Leave carries for 600 s, is cut, and leaves one `.writing-<pid>`
  partial, a stale lock, and the whole tails it finished before the cut, which no ledger names. 90 s after the app is gone
  the waiter takes over the stale lock (`takeLedgerLock`, a dead holder is taken over), and exports the whole set again,
  about 7.1 GB at about 5 MiB/s, about 23 minutes. With the stick emptied (step 2), 7.1 GB + the Leave's leftovers fit easily.

## §4 The arrival dry run, against copies (step 0 (4))

    checked: S\dryrun.log, S\dryrun-rows.json (node S\dryrun.js)

Copies only: this machine's 9 transcripts snapshotted to `G:\consonance-scratch\d639\Dproj`; a whole export --apply to an
empty stick folder `G:\consonance-scratch\d639\stick-copy` (the shape tonight's carry writes, no ledger before it); a
laptop fixture `Lproj` with one seat per case; the import as machine L. Nothing read or wrote D: or the real `.claude`.

| seat | the laptop holds | rehearsal verdict | with the name given | after |
|---|---|---|---|---|
| main | nothing | FULL | — | EQUAL |
| librarian | an older prefix, untouched since | **INTERRUPTED** | `--repair` | EQUAL |
| third place | an older prefix plus its own launch line | DIVERGED | `--take-stick` | EQUAL |
| 6fe15f0a | a different conversation | REFUSED OTHER_CONVERSATION, retirable | `--retire-far` | EQUAL |
| 12fb81f6 | the same file, whole | ALREADY_APPLIED | — | EQUAL |
| 0845a868, a2122153, c88002b1, fbf98f8e | nothing | FULL | — | EQUAL |

**9 of 9 seats byte-equal to the snapshot** (sha256 each, in the log), verify-set 0 (manifest, 0 missing, 0 mismatched),
and a second rehearsal after the apply reads NOTHING_PENDING for all 9. So the carry itself works.

**The two problems, and why this ring comes before the removal:**
1. **The laptop's rehearsal will time out at 300 s** (§1) unless the laptop runs a build with the bound fixed. The fix is
   in `main.rs` (§3, pass 2), so it reaches the laptop only by a build from main after it lands and is pushed.
2. **INTERRUPTED has no offer in the setup window.** `sync_launch::offers_for_rows` (`sync_launch.rs:1338-1360`) offers a
   decision for OTHER_CONVERSATION and DIVERGED only. A laptop seat whose copy is an older prefix that was never opened
   again reads INTERRUPTED against a whole carry, and needs `--repair <sid>` by hand. A seat the laptop has opened since
   reads DIVERGED (opening Consonance appends to every resumed seat, `tail-carry.js` header), which IS offered, so this
   bites only seats the laptop never resumed. inferred: most laptop seats were resumed, so most read DIVERGED.

Neither problem is changed by moving the tails off D:, so the move does not make either worse. I am holding the REMOVAL from
D: (the copy to Z: and both manifests continue) until the librarian answers, as the order asks.

*(Pass 1 ended here, rung 18:0x; the librarian ruled at 18:09, `librarian/2026-10-18.md`: remove from D: once Z verifies EQUAL.)*

---

# PASS 2

## §5 Correction to pass 1: problem 2 is false

**INTERRUPTED IS offered in the setup window.** Not through `offers_for_rows`, which I read, but as its own checkbox:
`consonance/ui/stick.js:109` draws `<input type="checkbox" class="stick-repair"> repair` for an INTERRUPTED row,
`:148-149` puts its sid in `repair`, `:118` counts INTERRUPTED as actionable, and `stick_start_applier` forwards it as
`--repair <sid>` (`main.rs:15318` on fe69a9fc). I read one function and named the whole window from it. Nothing to build.

## §3 The bound, made progress-based (d639-a 39bbb015, not pushed)

- `main.rs` `CarryBound { stall, ceiling }`. `run_json_child` polls the node child's `GetProcessIoCounters` (read, write
  and other bytes) every 100 ms. It stops the child when the counters have not moved for `stall`, or at `ceiling`. If
  Windows will not give the counters, there is no stall judgement, and the ceiling still applies.
  - The setup-window rehearsal: `STICK_REHEARSAL_BOUND`, stall 120 s, ceiling 7,200 s. Was a flat 300 s.
  - The close's save (NORMAL): `LEAVE_EXPORT_STALL` 120 s, and `LEAVE_EXPORT_TIMEOUT` becomes the ceiling, 7,200 s.
    Was 600 s wall. SHUTDOWN keeps its 30 s as a wall clock (stall = ceiling = 30 s), so the OS's end of session is unchanged.
  - `dev/stick-waiter.js` `LEAVE_CARRY_WAIT_MS` follows the app's bound plus 60 s: 660 s → 7,260 s.
    - Limit, named: a hung orphan carry now holds the exit waiter up to about two hours, where it was 11 minutes.
- `dev/tail-carry.js`: reads and writes go in calls of at most 16 MiB (`CHUNK`): `readRange`, `writeDurable`, and the
  import's tail read (was one `readFileSync`). One 1.3 GB call is about four minutes on the stick with no byte counted
  until it returns, which a stall bound would read as a hang. Behaviour is otherwise unchanged.
- Why 120 s: a 16 MiB call is about 3 s at the measured 5.1 MiB/s write. Hashing a 1.3 GB buffer is seconds.
  - inferred, not measured: the longest silent stretch of a real carry on the stick (an fsync with the write cache on)
    is not measured here, because measuring it means writing to the stick.
- Amended tests, by name, each with a comment:
  - `the_close_saves_with_the_named_export_and_its_bound`: the call text and the 600 s pin move to the ceiling, and
    the first-carry comment pin is kept.
  - `stick-waiter.test.js` "the case-c wait is bounded at 7,260 s": it now also checks main.rs's ceiling, so the two
    cannot drift apart.

**Tests.**

    checked: S\cargo1.log → test result: ok. 171 passed; 0 failed (cargo test --bin consonance -- d639 leave close stick rehearse,
             under the heavy-run lock, CARGO_TARGET_DIR G:\consonance-scratch\target-a-d639)
    checked: S\cargo-red.log → the same 6 new tests on the old behaviour (counters ignored, 300 s and 600 s): 2 FAILED, 4 ok
    checked: S\green2-tailcarry.txt → 177 passed, 0 failed;  S\green-waiter.txt → 74 passed, 0 failed

- Red first:
  - `a_child_that_keeps_writing_past_the_stall_window_is_not_stopped` fails when progress is ignored. It is a real
    node child appending 64 KB every 50 ms for 2.5 s, against a 1 s stall.
  - `the_rehearsal_and_the_close_have_measured_ceilings_and_a_stall` fails at 300 s and 600 s.
  - The other four pin the new stop rule, and they pass on both trees by construction. They are not red-first evidence.
    `a_child_that_does_nothing_is_stopped_at_the_stall_not_the_ceiling` is the one that proves a stall still stops.

## §6 The retention rule (d639-a 39bbb015) and its dry-run list

The prune door (`--prune-below-agreed`, D067) already deleted only from a listing a person read, by its digest. Two
changes, the keeper's rule:
- The **newest tail of every conversation is kept** (largest `to`), even when both machines have applied it. It is
  listed with "the newest tail of this conversation — the rule keeps one".
- A **`.writing-<pid>` partial is deletable** only when the ledger lock names no live holder and its own pid is not a
  live node. The delete path re-lists while holding the lock itself, and its own lock is not counted. The new test
  found that bug before it shipped: the delete refused its own listing.
- Everything else is unchanged. A tail is deletable only at or below the agreed offset, not pending, not a manifest
  member, and only where this machine proves it holds the agreed bytes.

    checked: S\green2-tailcarry.txt (177/0); S\red-tailcarry.txt → on fe69a9fc's code 5 FAILED (the amended newest-kept test and
             the four new retention tests); mutants #113-#116 via node dev/tail-carry.mutants.js --only N →
             applied 4 / caught 4 / NOT APPLIED 0; every one of the 116 anchors appears exactly once in the changed source.

**Dry-run list on the stick as it stood, before the move:**

    checked: S\retention-dryrun.txt (node dev/tail-carry.js --stick D:\consonance-L-20260911 --prune-below-agreed, d639-a code)

| deletable by the rule | bytes |
|---|---|
| `0845a868-….0-1178002503.tail.writing-25492` | 1,178,002,503 |
| `0c0c0c0a-….286176484-296618163.tail.writing-27852` | 10,441,679 |
| `12fb81f6-….0-609262463.tail.writing-16716` | 609,262,463 |
| `12fb81f6-….95547799-437768379.tail.writing-15836` | 342,220,580 |
| **4 partials, listing digest `9a9b8ee1db1f6270`** | **2,139,927,225** |

- KEPT: 247 finished tails ("the ledger has no agreed offset for this conversation"), plus the ledger, its lock and
  `ledger.json.corrupt-20260915T084005`.
- So **under the rule, no finished tail was deletable**, because no conversation has an agreed state on both machines
  (every ledger seat is FULL-pending since 10-28). The rule frees space only once the far machine imports.
- Step 0's move takes all of it off the stick anyway (§7), so the digest above is not to be used, and nothing was
  deleted by it.

## §7 The move (step 0 (2))

    checked: S\move.log; S\manifest-D.tsv; S\manifest-Z.tsv; S\verify-EQUAL.txt (node S\move.js copy | verify | remove <sha>)

- **copy**: 254 files, hashed from the bytes read on D: as they were copied, then each Z file fsynced. 1,692 s.
  `manifest-D.tsv` sha256 `8c5fdea56bde7ee50e211c857fdac702adcbc3530182b71491459a379650f7ac`.
- **verify**: every Z copy re-read from disk and hashed. D's file list and sizes were re-checked against the manifest,
  and Z holds no extra names. **VERIFY EQUAL, 254 files, 19,376,370,775 B**, 131 s. `manifest-Z.tsv` has the same
  sha256 as manifest-D: `8c5fdea5…f7ac`.
- **remove**, after the librarian's 18:09 ruling: refused unless `verify-EQUAL.txt` names the same manifest sha and every
  D file's size still matches. Then it removed the 254 files from `D:\consonance-L-20260911\consonance-tails`. The
  folder is kept and is empty, `D:` reads 45 G free, and Z holds 254.
  - The 254 include `ledger.json`, `ledger.lock`, `ledger.json.corrupt-20260915T084005`, the four `.writing` partials and
    every tail.
- **Untouched**: `consonance-transfer\MANIFEST.json`, the HANDOFF files, the scripts, `files`, `secrets`.
  - Said here, as the order asked: the old MANIFEST now names members that are gone, so `--verify-set` reads code 1
    until tonight's export writes a new one. `writeTransferSet` rewrites it after the ledger. The design needs no reset
    by hand.
  - checked: `--verify-set` on the emptied stick → code 1, layout manifest, the moved members missing.
- **Tonight's carry is whole**: `--export` rehearsal on the emptied stick → REHEARSED, FULL ×9. With no ledger there is
  no increment against a tail that is gone (step 0 (3)).
- Z: `Z:\stick-tails-2026-11-03\consonance-tails\`, mtimes kept.

## §7b Fewer panes on the laptop (the keeper, via the 17:57 relay): the three, on copies

    checked: S\dryrun4.log (node S\dryrun4.js); tests S\red-nopane.txt (5 FAILED before) → S\green-nopane.txt (182 passed, 0 failed);
             mutants #117-#120 → applied 4 / caught 4 / NOT APPLIED 0, all 120 anchors exactly once

**Found first: today's import silently SKIPS a seat the far machine has no pane for.** `planImport` walked only the
machine's own roster (`seats(o)`): main.rs's three fixed seats plus that machine's `panes.json`. A desktop builder with
no laptop pane was never placed, and never named. The ledger also did not record a seat's folder, so the laptop had no
way to place it.

**The fix, d639-a 9cca9958:**
- The export records `cwdName`, the seat's folder name, in the ledger. This is additive, and older readers ignore it.
- The import also walks every ledger seat with a pending carry that the roster does not name, as kind `no-pane`. It is
  placed at `<instances root>\<cwdName>`'s slug, under `<its own sid>.jsonl`, by every rule a rostered seat meets.
- The row then says: "This machine has no pane for seat <sid>: its conversation goes to <path>. Open a pane for it there."
- An older ledger with no folder name, or a name that is not one plain folder (`..`, a separator), gives
  REFUSED NO_PANE_HERE, named, and nothing is written.

**The dry run.**
- Setup: the desktop's 9 seats (3 fixed + 6 builders) exported whole from the snapshot. The laptop fixture has the 3
  fixed seats and 4 panes, each in one of the builders' folders but under ITS OWN session id with its own file. That
  is the worst case for a slot-based placement.
- (1) **Every seat lands by session id: 9 of 9 byte-equal**, each at `<its folder>/<its sid>.jsonl`.
- (2) **No seat overwrites another's: 4 of 4 laptop panes' own files unchanged**, while a carried builder was placed
  beside each in the same folder.
- (3) **Every seat without a pane is kept on disk and named: 6 of 6** (0845a868, 12fb81f6, 6fe15f0a, a2122153, c88002b1,
  fbf98f8e), each in the rehearsal's rows and in the apply's text.
  - The setup window prints each row's `why` when it has no offer (`ui/stick.js:110`), so the notice reaches him there.
- Times on G:: export 58.0 s, rehearsal 14.6 s, apply 41.1 s.

**THE CATCH FOR TONIGHT — a decision for the chair, not mine to make.**
- (3) needs `cwdName` in the ledger, and the ledger is written by the EXPORT. Tonight's export is the waiter's, and it
  runs `C:\Users\nname\Desktop\lighthouse\dev\tail-carry.js`, the main checkout's, which is origin/main's code without
  it. So:
  - **as things stand**, the laptop will place tonight's builders only where it has a pane under the same session id.
    With a d639-a tail-carry on the laptop, the others read NO_PANE_HERE, named, and stay on the stick. With today's
    code on the laptop, they are skipped silently.
  - **for all 6 to land tonight**, d639-a's `dev/tail-carry.js` must be on the main checkout before the close, and on
    the laptop before its import (it pulls). That means a landing to the checkout and a push. Both are the landing
    pane's and the chair's to order. I have not touched the checkout's tail-carry.js.
  - The waiter's script calls only `--export --apply --json` and `--verify-set --json`, and both are unchanged in
    shape by d639-a, so swapping the file under it does not change its steps (inferred from saturday-carry.ps1:129, :144).

## §8 The boundary-trim test (the keeper's 17:56 idea, the librarian's 17:56 note), on a COPY

    checked: S\trimtest.json (node S\trimtest.js 121917374)

- The seat is fbf98f8e (125,310,527 B; the snapshot on G:, itself a copy). It has 31 compact boundaries; the last is at
  byte 121,927,120.
- **The trim point is not the boundary itself.** The last boundary's `compactMetadata.preservedSegment` names a
  head, anchor and tail. The head (`03758979`) is at byte 121,917,374, 11 lines BEFORE the boundary. The tail is just
  before it, and the anchor is just after. A file cut at the boundary would drop the preserved turns the compaction
  kept. So the cut has to be at the preserved head.
- Two copies, each under its own new scratch folder in `~/.claude/projects`: whole (control) and cut at the
  preserved head (3,393,153 B, 2.7%). Each was resumed once with
  `claude -p --resume <sid> --tools "" --no-session-persistence`, hooks off and no MCP, and asked the latest order and
  its last report:
  - whole: "D625 … fast-forward public t180 main from a005e1d to d10eacf … CI run 41742313634 was in progress"
  - trimmed: "D625 … fast-forward public t180 main from a005e1d to d10eacf … CI run 41742313634 was in progress"
  - Both exited 0 (6 s, 4 s). **The trimmed copy resumes and recalls the same state.** Both scratch copies were then
    removed by me (`~/.claude/projects/G--consonance-scratch-d639-resume-{whole,trimmed}`, my own, made for this).
  - Limits: one seat, one question, one run each.
- **What is not solved, and why it is not tonight's carry.** tail-carry keys a conversation by its first timestamped
  record, and offsets are byte offsets from 0.
  - A trimmed file has a different first record. On a laptop holding the old full file, it therefore reads
    OTHER_CONVERSATION, retirable. The window offers that, so the first arrival would work.
  - But the carry BACK would then read OTHER_CONVERSATION on the desktop, whose file is full. Taking it would retire the
    desktop's full file to the attic. That is the fork the librarian's note asks about.
  - The fix is a ledger that records the trim's base offset, so that desktop offset = base + laptop offset, and an
    export that hashes only from the base. That is a ledger format change (prove it, stored data), and it is not built.
  - So **tonight's carry stays whole**, and the trim is a design for its own lap.

## §8b The amendment's (a)-(c), answered (all on copies)

    checked: S\trimtest.json (a); S\trimback.log and S\trimback.json (b), (c) — node S\trimback.js

- **(a) PASSES, on one seat.** §8 above. A copy cut at the last compaction's preserved head resumes, and it reports the
  same latest order and the same last result as the whole copy. The cut must be at the preserved head, not at the
  boundary line: the head sits 1-100 KB before the boundary in every seat (S\trimback.log). Limits: one seat, one
  question, one resume each.
- **(b) FAILS with today's tail-carry. So, per the order, tonight falls back to the WHOLE carry.** The round trip, on
  copies, for seat fbf98f8e:
  1. D exports the trimmed set (FULL, from 0).
  2. L imports it (FULL ×9, CARRIED).
  3. L takes one turn and exports it: a TAIL of 3,393,153..3,393,342.
  4. D, holding the FULL 125,310,527 B file, imports it: **REFUSED OTHER_CONVERSATION** ("key dc420a5c… vs 66b4057f…").
  - The carry keys a conversation by its first timestamped record, and a trimmed file begins at a different record.
    The only way forward the tool offers is `--retire-far`, which would retire the desktop's full file to the attic.
    That is the fork, not an append.
  - The fix is what §8 names: a ledger entry that records the trim's base offset and the FULL file's key, so that the
    far end's offsets map to base + offset and the import appends at the right place. That changes the ledger format
    (prove it), and it is not built tonight.
- **(c) Sizes and times.**

  | seat | whole B | trimmed B |
  |---|---|---|
  | main | 938,405,736 | 1,134,271 |
  | librarian | 797,417,180 | 2,504,311 |
  | third place | 575,040,063 | 29,631,854 |
  | 6fe15f0a | 1,254,361,315 | 7,699,594 |
  | 12fb81f6 | 619,310,790 | 9,477,931 |
  | 0845a868 | 1,364,784,640 | 9,813,635 |
  | a2122153 | 1,058,071,433 | 5,019,947 |
  | c88002b1 | 369,252,846 | 31,515,955 |
  | fbf98f8e | 125,310,527 | 3,393,153 |
  | **all nine** | **7,101,954,530** | **100,190,651 (1.4%)** |

  - Trimmed set on G:: export 1.1 s, verify-set 0.3 s, laptop import of 9 absent seats 0.9 s.
  - inferred, not measured on the stick: 100 MB at the stick's measured 12.1 MiB/s cold read is about 8 s per read, and
    at its 5.1 MiB/s write about 19 s. Both are far inside even the old 300 s bound, so a trimmed carry would need no rebuild.
  - The whole figure differs from §1's 7,101,773,612 B because the snapshot was taken later, and my own seat had grown.

## §9 The daily carry (D639 (d)): design, nothing armed

- **The daily carry already exists: it is the Leave, on every close.** `leave_run` exports `--apply` to a found stick
  on every close, and the exit waiter is its fallback when the app dies.
  - The hand-armed window (`saturday-carry.ps1`) existed only because the Leave never finished. Every Leave since
    10-20 was cut at 600 s (§1).
  - What breaks the rhythm is the whole carry. While nothing is agreed, every close re-carries every seat WHOLE
    (`planExport`, "no agreed state"), a new file each time, because the name carries the size. That is how 254 files
    and 19 GB built up.
- So the rhythm needs three things, and adds no new mechanism:
  1. A whole carry must be able to finish: §3, the stall bound, at the next build.
  2. The far machine imports it once, which gives an agreed state. After that every carry is a TAIL of a day's turns.
     - inferred: a day's turns are MB, not GB; the librarian measured ~2 MB a seat a day on 2026-09-11, cited in the
       tail-carry header.
  3. The retention listing (§6) after each carry, read and approved by the keeper, frees the superseded tails.
- Tested by the existing Leave tests plus §3's: 171/0. Nothing was armed.
- Once one Leave has finished DONE on the new build, `saturday-carry.ps1` and its waiter can be retired. That is his
  call, and it is not done here.

## §10 What the laptop needs, and what tonight's close needs

**Tonight's close (desktop, unswapped exe):**
- Nothing new is needed. The stick is emptied (§7), so the Leave and then the waiter carry all 9 seats whole, with no
  ledger: no increment against a tail that is gone.
- The Leave will be cut at 600 s. The waiter (pid 12160, untouched) takes over its stale lock and carries the whole
  set with no bound, about 23 minutes.
- **The laptop's arrival, with no bound and no rebuild:** with Consonance CLOSED on the laptop, from its lighthouse
  checkout:

      node dev/tail-carry.js --stick <stick>\consonance-L-20260911 --import                        (rehearse; read the verdicts)
      node dev/tail-carry.js --stick <stick>\consonance-L-20260911 --import --apply \
           --take-stick <each DIVERGED sid> --repair <each INTERRUPTED sid> --retire-far <each retirable OTHER_CONVERSATION sid>

  - This is exactly what the dry run (§4) ran, 9 of 9 equal. Neither `ARRIVING.ps1` nor `stick-apply.js` has a time
    bound, but `ARRIVING.ps1` STOPS on any seat that needs a decision (`:108-111`). So it is the command above, by hand.
- **The laptop's setup window** works only on a build with §3. On today's build, its 300 s rehearsal of a 7.1 GB set
  reads "could not be rehearsed", and Carry is disabled (`ui/stick.js` `imp.unavailable`).

**For main / the laptop's build:** d639-a 39bbb015, landed by the landing pane and pushed, then the laptop pulls and builds.

## §11 Evidence (in S\)

time3.js, times-run1.jsonl, times-run2.jsonl, r2--export.json, r2--import.json, dryrun.js, dryrun.log, dryrun-rows.json,
move.js, move.log, manifest-D.tsv, manifest-Z.tsv, verify-EQUAL.txt, retention-dryrun.txt, trimtest.js, trimtest.json,
cargo-run.js, cargo1.log, cargo-red.log, green2-tailcarry.txt, red-tailcarry.txt, green-waiter.txt, mutants-d639.txt.

SOURCES: S\times-run1.jsonl; S\times-run2.jsonl; S\r2--export.json; C:\Consonance\data\persist.log; C:\Consonance\staged\d501-saturday\saturday-carry.ps1; S\dryrun.log; S\cargo1.log; S\cargo-red.log; S\green2-tailcarry.txt; S\retention-dryrun.txt; S\trimtest.json; S\move.log; consonance/ui/stick.js:109-149
NEXT: librarian collate D639 when this ring arrives, and ask the chair whether d639-a tail-carry.js goes on the checkout before the close (§7b); the landing pane lands d639-a 39bbb015 + 9cca9958 before the laptop builds

## §12 The rulings of 18:10 and 18:29, answered

- **Does the setup window fall back to the unbounded path on a timeout? No.** On "unavailable" it prints "The carry could
  not be rehearsed" and disables Carry (`consonance/ui/stick.js:124`, `:135`, `:161`). The only button left is "Continue
  without carrying". There is no fallback.
- **The unbounded arrival path** is `tail-carry.js --import`, rehearsed and then `--apply`, run by a seat with
  Consonance closed. It is now on the stick for a laptop seat to follow:
  `D:\consonance-L-20260911\ARRIVAL-FOR-THE-LAPTOP-SEAT.md`, 5,690 B, sha256 `7f5edea085a5f1aa…`.
  - It covers verify-set, the rehearsal, a verdict table limited to §4's rows (with a STOP for everything else), the
    import with the flags the rehearsal names, a re-check, and a report.
  - It includes the four-pane fact. With tonight's carry tool (origin/main's, no `cwdName`), a builder with no pane on
    the laptop gets NO row. So the seat compares the rows against the ledger's 9 seats, and names each seat that is
    missing; its copy stays on the stick.
  - A trap found while writing it, and avoided: on a WHOLE carry a DIVERGED row's `ownBytes` is the laptop's whole file,
    because the carry starts at 0. The note measures the real own bytes past the shared prefix instead (a read-only
    one-liner), and takes the stick's copy only under 64 KB (launch records).
- **Item 3, an INTERRUPTED offer in `offers_for_rows`: not built, on purpose.** §5: the window already offers repair
  for INTERRUPTED as its own checkbox, and the applier forwards it as `--repair`. A second offer in `offers_for_rows`
  would duplicate a working control. If the ruling still wants it inside `offers_for_rows`, that is a small change, for
  the landing lap.
- **Item 4 is built**: §3, the close's save is stall-based (d639-a 39bbb015).
- The trim's carry-back is D640, per the ruling. Tonight is the whole carry, and the stick is empty for it (§7).

## §13 Lesson: a stick backup must never sit one level under a volume root (the 20:55 close)

The keeper's 20:55 close saved nothing: `LEAVE NOT_DONE`, "more than one stick folder" (persist.log:4015, via the
librarian's notes b7c60cbf). **The cause was my move in §7.** I kept the `consonance-tails` folder inside the destination,
so the backup's ledger sat at `Z:\stick-tails-2026-11-03\consonance-tails\ledger.json`. That is exactly the stick marker:
`find_stick` looks at each volume root and one folder level down, and a folder holding `consonance-tails\ledger.json`
(older layout) or `consonance-transfer\MANIFEST.json` is a stick (`consonance/src-tauri/src/sync_launch.rs` `STICK_LEDGER`,
`layout_at`, `find_stick`; "§3: the volume root AND one folder level down"). Two stick folders made `find_stick` return
`Many`, and the Leave refused to pick one. The order named the folder `Z:\stick-tails-2026-11-03`; keeping the
`consonance-tails` level inside it was my choice, and no check of mine ran the finder's rule against Z:.

**The rule: never put a stick backup one level under a volume root.** Put it two or more levels down (the librarian's
`Z:\stick-backups\stick-tails-2026-11-03`), or copy the folder's contents without the `consonance-tails` /
`consonance-transfer` level. After any copy of stick files to another volume, run the finder's rule by hand before the
next close: no folder `<root>\*\consonance-tails\ledger.json` or `<root>\*\consonance-transfer\MANIFEST.json` may exist
except the stick's own.

    checked: every <volume>\*\ on C:, D:, G:, Z:, for both markers (stat only), 20:59 local
             → one hit, D:\consonance-L-20260911\consonance-transfer\MANIFEST.json; Z: has none
    checked: ls Z:\stick-backups\stick-tails-2026-11-03\consonance-tails → 254 entries
    checked: wednesday-carry.log tail → 20:57:33 "Consonance was running again after the settle; back to waiting";
             tasklist → pid 12160 powershell.exe alive (untouched)

**Did any D639 note tell someone to make a backup in that shape?** No. Searched the hand-back (backup, archive, attic,
copy) and the arrival note: neither asks anyone to make a backup. Two places NAME the old location:
- §7's line "Z: `Z:\stick-tails-2026-11-03\consonance-tails\`" is a dated record of what was done and keeps its wording;
  this section supersedes it. The backup is now at `Z:\stick-backups\stick-tails-2026-11-03\consonance-tails\`.
- The arrival note on the stick (§2, the four-pane fact) told the laptop seat a pane-less seat's copy is "in
  `Z:\stick-tails-2026-11-03`". Corrected to `Z:\stick-backups\stick-tails-2026-11-03`, the only change:
  `D:\consonance-L-20260911\ARRIVAL-FOR-THE-LAPTOP-SEAT.md` sha256 7f5edea0… (5,690 B) → sha256 c112be8c… (5,704 B),
  checked by diff (one line, 57).
- My scratch `move.js` hard-codes the old destination; it is a one-off and will not be run again.

No other action taken.
