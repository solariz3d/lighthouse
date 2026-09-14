# P-STICK-PREFLIGHT · CHARLIE — the arrival on D, D's close, and L's lap rows

Lap L058 (second use of that id, §4), 2026-09-14 ~05:40–06:40, machine L (ZachsLEGION), seat C (Around).
Packet `exo_memory/loop/packet_stick_preflight_read_2026-09-14.md` (9c88a11) §2 CHARLIE. **Read-only.** No edit to
any tracked file, no `--apply`, no `close.js`, no state push, no carry rehearsal against the real stick (none was
needed for D's side; see §5). What I did touch: read-only hashes and byte ranges of two files on
`D:\consonance-L-20260911`, a manifest check over a fixture in my scratchpad, and `state-manifest.js` over L's live
data dir (it writes nothing: no write call in the file).

---

## 0 · THREE FINDINGS, WORST FIRST

1. **Carrying L's tails home will stop at least Main, and very likely the librarian, as DIVERGED on D. The app offers
   no choice for DIVERGED, the carry tool has no flag for it, and D's export of those seats refuses while L's tail
   sits on the stick. They are stuck in both directions until a person picks which future continues.** The refusal
   is correct. What is missing is anywhere to make the decision. (§2)
2. **Rows L writes tonight never reach D, and L's OWN next launch displaces them.** That includes the keeper's
   close-and-reopen test. D's launch does not touch them. They cannot get there: the stick carries transcripts only,
   and state push is held. I found no ruling that covers this. (§4)
3. **The five STAYS rules classify correctly, but they are not the only thing that can refuse D's close.** L's own
   data dir has two other unplaced paths today, and one is a class any machine running panes produces. (§3)

---

## 1 · D'S NEXT LAUNCH, WALKED AT SOURCE

**Precondition the packet does not name: D must `git pull` the code before launching.** `consonance/launch.ps1`
rebuilds and starts the exe. It contains no `git` call at all (`grep -c git` = 0). Without a pull, D rebuilds its old
checkout, the module does not exist there, and the stick is invisible to the app.

**The verdict is RESUME, not MIGRATE.** Origin's state head is `f70d50a` "state: D 2026-09-10T07:39:42Z" (from
`git -C C:\Consonance\state log`, fetched at L's 05:14 launch). On D:
- `sync_at_launch` installs only when the head is not this machine's (`main.rs:9958`).
- `decide()` returns Resume when `pushed_by == me` (`sync_launch.rs:305`).

So D installs nothing, retires nothing, and adopts `f70d50a`. **Under the hold that stays true:** only a push from L
could move the head to a foreign author. The chair's question about MIGRATE therefore concerns L, where it happens at
every launch (§4), not D.

**The held retire and adopt (E §1.1, R-1) on D.** When the stick holds the seats, `main.rs:9990-9996` defers
`launch_effects`. For a RESUME, those effects are only the adopt stamp (`main.rs:10501`), because the retire is gated
on `is_migrate()` (`main.rs:10483`). Each path:

| What happens | Result |
|---|---|
| Continue | Writes the adopt stamp. |
| Carry | Exits without it; the relaunch decides RESUME again. |
| Keeper closes without choosing | Nothing is written. |

**No loss on any path.** R-1 holds on D, and trivially.

**The carried receipt (9fc0a71) on D.** It is read only in the MIGRATE arm (`main.rs:10483` path), so D's launch
never reads it. D's first Carry creates `~/.claude/consonance-carried.json`, one entry per seat placed. **Its stated
limit applies to exactly the seats in §2:** the receipt keys on the conversation's first timestamped line
(`sync_launch.rs:568`, compared at `:608`), so a later MIGRATE on D would KEEP D's own fork of Main, not retire it.

---

## 2 · THE FINDING: MAIN AND THE LIBRARIAN ARE TWO FUTURES OF ONE CONVERSATION

### What the stick shows

The ledger (`D:\consonance-L-20260911\consonance-tails\ledger.json`) agrees Main at offset **260,427,744** with
prefix sha256 `8071c253…`. That is D's 12:47 export on 09-12, imported on L at 09-14 00:36.

The stray file `0c0c0c0a-….0-260898687.tail.writing-25288` (mtime 09-12 22:58 local) is a **copy of that
conversation**, 470,943 B longer, from a later export that never finished:
- sha256 of the stray over [0, 260,427,744) equals the agreed `prefixSha`. So does the sha256 of the 12:47 tail,
  checked as a control.
- The 470,943 B past the agreed offset are turns timestamped 2026-09-12T18:53:39Z → 18:57:59Z (12:53–12:57 local),
  `cwd` `C:\Consonance\instances\main`.
- L could not have written those turns. L did not hold this conversation until the 09-14 00:36 import. **They are
  D's.** Git agrees: `CHAIR (on D)` committed at 12:55 and 12:57 on 09-12, after the 12:47 export.

### L's Main has its own future

L's Main is now 269,619,145 B. Its bytes past the agreed offset **differ from the stray's at byte 260,427,746**,
two bytes in. L's first record there is 2026-09-14T06:55:25Z.

So D's Main is at least 260,898,687 B with its own turns past the agreed offset, and L's tail will carry different
bytes from the same offset.

### The librarian, by commit rather than by bytes

Eight commits `LIBRARIAN (laptop lineage, on D)` landed between 12:49 and 13:01 on 09-12, after the 12:47 export.
The first is `2f7233c`, which records that export. Seat 0c0c0c0b therefore took turns on D past its agreed offset of
43,187,910 B.

`d26444f` (13:01) says *"the export is stale by construction, so the on-exit watcher runs on D now"*. The watcher's
export at D's close is the torn `.writing-25288`. Only Main's file exists, so it most likely died during Main. **Hold
(c) — "re-export from D before carrying back" — did fire, and the re-export silently did not complete.** L then
imported the stale 12:47 set.

### What D's arrival will then do, by line

- **Import rehearsal, Main.** The key matches, `agreed.offset == pend.offset`, and D's size is not behind. The prefix
  matches because D's file is the conversation that produced the agreed prefix. D is longer than `pend.offset` and
  its extra bytes are not the start of L's tail (measured above). The result is **`DIVERGED`**
  (`dev/tail-carry.js:902`) with `stops: true` (`:171`). The librarian would get the same verdict by the commit
  evidence; that part is not byte-measured.
- **The setup window offers nothing for it.** Offers are built only for `reason == "OTHER_CONVERSATION"`
  (`main.rs:10642`). A DIVERGED row has no reason, so it shows its verdict and `why` with no radio.
- **The window never closes on its own.** `rehearsal_is_quiet` (`sync_launch.rs:1165`) waves a stop through only
  when it is a KEPT OTHER_CONVERSATION. The window therefore opens at **every** D launch with the stick in.
- **Carry** imports the other seats. Main and the librarian stop (exit 1 STOPPED, other seats may still have carried,
  per `tail-carry.js:133-135`). The relaunch shows the window again.
- **Continue** releases the seats. D's Main resumes D's fork, and the next launch shows the window again.
- **The carry tool cannot resolve it either:**
  - `--retire-far` takes only OTHER_CONVERSATION with a whole tail (`tail-carry.js:828-836`).
  - `--repair` takes only INTERRUPTED, where D's extra bytes ARE the start of the tail (`:886-900`).
  - Nothing takes DIVERGED. The tool's own text: *"which one continues is a decision, not a merge"* (`:903`).
- **The reverse direction also stops.** At D's exit the waiter exports. L's pending tail for these seats is still on
  the stick, so D's export refuses `UNIMPORTED_TAIL` (`tail-carry.js:661-667`). D's turns in those seats never
  reach the stick.

**Nothing is lost.** Both futures stay whole on their own disks, and L's tail stays on the stick. But no surface
offers the decision, and each carry in either direction ends NOT DONE for these seats.

**What would make this finding wrong:** D's Main or librarian transcript having been truncated or restored back to the
agreed offset since 09-12 13:01. I cannot see D's disk. **Check it before the keeper carries:** on D, compare the
file size of `C:\Users\nname\.claude\projects\C--Consonance-instances-main\0c0c0c0a-0000-4000-8000-000000000a01.jsonl`
with 260,427,744. Do the same for the librarian's file against 43,187,910. The project folder path is inferred from
L's layout, so read the directory on D first. Equal sizes mean no divergence. Larger means this section holds.

**Whose this is:** the missing decision is in the window (E, `main.rs:10642`) and in the tool (A, `tail-carry.js`).
The stray file's effect on L's export and on `--verify-set` is BRAVO's question. I read its bytes only to learn D's
state.

---

## 3 · CLOSE.JS ON D WITH THE FIVE STAYS RULES (§9 R-3)

**The five rules classify STAYS, measured by the manifest's own checker.** The rules are
`state-manifest.json:97-101`. I built a fixture holding the five names (plus one other file, below) and ran:

    CONSONANCE_DATA=<scratch>/d-data-fixture node consonance/tools/state-manifest.js --paths
      STAYS  stick-apply.result.json · stick-apply.started.json · stick-keep.json · stick-waiter.lock · stick-waiter.status.log

On L's live disk `stick-waiter.lock` (88 B, 05:14) is present and placed. The other four are declared and not present.
These five are the complete set of data-dir names the module writes:
- `sync_launch.rs:774,776,781` (`APPLY_STARTED`, `APPLY_RESULT`, `STICK_KEEP`)
- `stick-waiter.js@0405bd2:47-48` (`LOCK`, `STATUS`)
- `stick-apply.js@0405bd2:44-45`

`CARRIED_FILE` lives under `~/.claude`, outside the data dir.

**But the five are not sufficient for D's close.** `node consonance/tools/state-manifest.js --json` over L's data dir
today exits **1** with two UNPLACED paths, neither from the module:

    ready/0c0c0c0b-0000-4000-8000-00000000115b.json.29304.tmp     216 B, 09-14 03:20
    vantage_cell/mutants-run.log                                  3,383 B, 09-14 01:23

**The first is a recurring class.** `dev/shell/lib/ready.js:61-63` writes `<pane>.json.<pid>.tmp` and then renames
it, inside a catch that is *"Silent by design"* (`:65`). A failed rename leaves the tmp behind with nothing said. Any
machine running panes can accumulate these. `ready/*.json` has a rule; `ready/*.tmp` has none. The fixture shows it
UNPLACED, and an UNPLACED path makes `state-sync.js:469` refuse `REFUSED_UNPLACED`.

**The second** is a mutation-run log with no writer I could find by name in tracked code. It looks hand-redirected.

**Answer:** after a pull and a launch, D's close will not refuse because of the module's own files. Whether it refuses
at all depends on D's disk, which I cannot see. L's disk says stray tmps and hand-made logs are the live risk. Run
`close.js --check` on D before the real close. The 09-10 precedent: four unplaced files blocked D's first close for a
day.

---

## 4 · L'S LAP ROWS: RULED? AND WHAT HAPPENS TO TONIGHT'S

### What happened at 05:14, exactly (corrects the packet's figure)

Live `data/lap.jsonl` is **byte-for-byte the state tree's copy plus 1,465 B appended after the launch**:
- `git -C C:\Consonance\state show f70d50a:data/lap.jsonl` is 209,750 B.
- The first 209,750 B of the live file `cmp` equal to it.

The displaced copy `data/attic/pre-sync-2026-09-14T11-14-50-251Z/lap.jsonl` holds **21 rows the live file lacks:
L058 ×5 and L059 ×16, spanning 01:30:08 → 04:51:18.** The packet says "L055-L059". **L055–L057 do not exist:** the
laps in that range are D055–D057, and they are present in both files, because they arrived from D.

### Is it ruled?

The mechanism is designed and documented:
- **Install is a whole-file overwrite.** Displaced files go to `attic/pre-sync-<stamp>` (`state-sync.js:1110`;
  `main.rs:9930-9933`).
- **It runs whenever the head is not this machine's** (`main.rs:9958`).
- **The hold is ruled** (`loop/handoff_chair_2026-09-12.md` §2(a); `handoff_chair_2026-09-14.md:49`).

What I did not find anywhere is the consequence of those three together for L's TRAVELS files. The hold's stated
mechanism covers transcripts only. The manifest's own first limit says TRAVELS *"is therefore conditional on the
single-live-host guard … plus pull-before-launch. Without both, this manifest names a merge-conflict set"*
(`state-manifest.json:11`). Working on L under the hold is exactly the "without both" case.

**Where I searched:**
- `pre-sync` and `lap.jsonl` in `exo_memory/loop/*2026-09-1[0-4]*`, `exo_memory/librarian/2026-09-1*`,
  `exo_memory/handback/*2026-09-1[0-4]*` and `BUILDING.md`.
- `pre-sync` in `consonance/` and `dev/` code.

The only hits besides the writers are the chair's own note (`packet_no_console_windows_2026-09-14.md:10-13`,
*"a separate finding and not this packet's work"*) and the librarian's (`librarian/2026-09-14.md:209`, *"needs its
own row"*). **No reader recovers rows from `attic/pre-sync-*`:** the only code that names it is the writer and the
launch.

### What happens to rows L writes tonight

- **D's launch does not touch them, because they never arrive.** The stick carries tails and the ledger. The state
  push from L is held. D's launch is RESUME and installs nothing (§1).
- **L's own next launch displaces them.** That is the keeper's close-and-reopen test, before any D launch. The
  reopen pulls, finds the head still D's `f70d50a`, and installs again. Every TRAVELS file L changed since 05:14 goes
  to a new `attic/pre-sync-*` and is replaced by D's 09-10 copy.
- **This is the sixth time, not the first.** L's data dir has six such folders: 09-11 00:27 and 00:43, then 09-14
  00:28, 00:37, 00:55 and 05:14. The last four are all against `f70d50a`, one per launch (`persist.log` :796, :815,
  :833, :851, :876, :1003).
- **At 05:14 it displaced 14 files, not only the lap ledger:** `board.jsonl`, three `captures/*.txt`,
  `carrier-drift.jsonl`, `dispatch-gate.jsonl`, `lap.jsonl`, `precompact.jsonl`, `resonance/atoms.jsonl`,
  `return_ledger.jsonl`, two `return_state/*.json`, `sessionstart-state.jsonl`, `sourced_ledger.jsonl`. I byte-checked
  only `lap.jsonl`.

### The lap id, and why it is worse than it looks

`lap-row.js:415-422` mints `max + 1` over the LOCAL rows. The installed ledger ends at D057, so the next lap became
**L058 a second time.** Tracked prose already carries both: `0783e45` "E's L058 half" (committed 01:40) and this packet's
"added to lap L058".

**After the reopen the ledger resets to D057 again, and the next lap is L058 a third time.** The comment above
`mintId` calls same-tag, same-number laps *"the only SILENT"* collision, the one rule 2W-1 exists to prevent. This
install produces that collision on a single machine, which the rule's mechanism (the tag is per machine) cannot see.

**Not a recommendation, a note of what would change the answer:** a TRAVELS ledger under the hold needs a route out
of L, or L must stop installing a foreign head over files it is actively writing. Choosing between those is the
keeper's and A's. It is outside this packet's scope and outside my file.

---

## 5 · WHAT I DID NOT VERIFY

- **Nothing on D's disk.** Every D claim is read from source, L's disk, the stick, or git. §2 names the size check
  that would confirm or kill the central finding. Also unchecked: D's machine-identity resolver still says "D", node
  is on D's PATH, D's volume letters, and where D's checkout is.
- **The librarian's divergence is inferred from commit subjects, not bytes.** No stray file exists for it.
- **The other five seats on D** (third place and four panes) are unknown: any that took turns after 12:47 on 09-12
  will also be DIVERGED. D's app was already open at the export (the librarian's 09-12 note records its own file
  growing *during* the export), so no launch-append of 267 B is implied for them.
- **I ran no `--verify-set` or import rehearsal against the stick.** On L those would test L's files, not D's, so they
  would answer BRAVO's question rather than mine. The only reads of the stick were a `sha256` and a byte-range read
  of two tail files, plus a listing.
- **The waiter's NOT DONE wording** for an export that stops is A's code. I cite the carry's exit contract, not the
  window text.
- **L's export tonight** (full or delta per seat, the stray's effect) is BRAVO's.
- **Whether the 14 displaced files other than `lap.jsonl`** are each "the tree copy plus appends" — only lap.jsonl was
  byte-checked.
- **Whether `ready/*.tmp` exists on D.**

---

## 6 · COMMANDS, SO EVERY FIGURE ABOVE RE-DERIVES

    git -C C:/Consonance/state log --oneline -3                              # head f70d50a, state: D
    cat C:/Consonance/data/sync-completion.json                              # pushed_by D, installed_files 14
    grep -n "SYNC AT LAUNCH\|MIGRATE SEAT\|effects HELD" C:/Consonance/data/persist.log
    ls C:/Consonance/data/attic/ | grep pre-sync                             # six folders
    git -C C:/Consonance/state show f70d50a:data/lap.jsonl > t && head -c 209750 C:/Consonance/data/lap.jsonl | cmp - t
    node (row-set diff of attic vs live lap.jsonl by JSON line)              # L058×5, L059×16 attic-only; 01:30:08→04:51:18
    node (sha256 over [0,260427744) of both Main tails on the stick)         # both == ledger prefixSha
    node (byte compare L Main vs stray over [260427744,260898687))           # first difference at 260,427,746
    TZ=America/Regina git log --since='2026-09-12 12:47' --until='2026-09-13 06:00' --format='%h %ad %s'
    node consonance/tools/state-manifest.js --json                           # L: exit 1, 2 UNPLACED
    CONSONANCE_DATA=<scratch>/d-data-fixture node consonance/tools/state-manifest.js --paths
    grep -c git consonance/launch.ps1                                        # 0
