# Lap W, the build spec: the wake, part by part, with the check that is red on a recorded case

Writer: the spec writer of the wake level-two swarm, on D, 2026-11-13, read-only except this file. HEAD 19040c87. No file
under `consonance/` or `dev/` changed since 3f5fa65d, the HEAD the readers cited (`git diff --stat 3f5fa65d HEAD -- consonance
dev` is empty) [read], so their code lines hold at HEAD.

Marks: [read: file:line] = I opened that file and saw it. A bare file name is a file in this folder
(`exo_memory/loop/wake_level2_2026-11-13/`); `plan` = `exo_memory/loop/plan_room_stretch_2026-11-13.md`; `plan1112` =
`exo_memory/loop/plan_retrieval_at_the_wake_2026-11-12.md`; `in_wake` = `exo_memory/loop/room_better_2026-11-13/in_wake.md`.
[inferred] = mine. [ours] = a proposal. I built only on the corrected forms: where a second reader marked a claim WRONG,
UNSUPPORTED or DOWNGRADED, this file uses the second reader's form. I opened one primary, to settle whether two files name the
same summary-length bar (they do: section 2, W2).

Short names used below: `launch` = launch_and_pull.md; `shelf` = shelf_builder.md; `compact` = compaction_directive.md;
`body` = body_line.md; `gate` = first_dispatch_gate.md; `prior` = prior_attempts.md; `cold` = cold_wake_cost.md;
`idle` = idle_compaction_keepwarm.md.

## 1. What level two changed

Against `plan` "Lap W" (:33-50) and "Lap C" (:52-65).

| item (plan line) | verdict | how | rests on |
|---|---|---|---|
| W1 "the shelf is built after the pull" (:37) | changed | The app never pulls the repo; the only pull is `launch.ps1`'s, before the app starts. So "after the pull" is W5's job. W1 instead stamps what the shelf was built from. | launch:144-149, :165-166 |
| W1 "a line with the HEAD and how far origin is ahead" (:37) | changed | Origin by `git ls-remote` at build, once per launch, never from the local `origin/main`: that ref was 0b85fead from 11-11 23:32:51, so a local count printed "0 behind" on the recorded case. Plus the launch's own pull outcome from W5's receipt. | shelf:84-87, :107-123, :143-147; launch:220-221; prior:243-248 |
| W1 "newest note's first screen" (:37) | changed | The first screen is the oldest part of an append-only note (6 h stale). Carry the newest whole `## ` entries through `map_carry`, from an 8,000 B reserve outside the 24,000 B cap. | shelf:161-190 |
| W1 "one pinned file" (:37) | kept | The letter, whole, under its own 8,000 B cap, outside the notes cap; said missing only where `librarian/` exists. | shelf:252-287 |
| W1 red check "a 65,000-byte note is named and not carried" (:37) | changed | This morning's shelf lacked the 11-13 note because the file was not on disk before the pull, not because of the cap. (b) and (c) are proved only on a replay of the pulled tree; the 08:42 case is (a)'s. | shelf:396-399 |
| W1 on L (not in plan) | added, his call | L printed the strict walk's sentence on 11-12, so L likely runs strict; a light-only W1 reaches D only. Strict needs an order change (his word) or L in light. | shelf:39-44, :211-215 |
| W1 test margin `main.rs:9154` (not in plan) | added, his call | Light is held 25 KB under strict by a test; W1's ~14 KB breaks it. A stated design property, not a test to edit quietly. | shelf:241-246 |
| W1d, rewrite the shelf when HEAD moves (not in plan) | added, named, not built here | A compaction re-injects the spawn-time CLAUDE.md, so the 11-12 L case (a compaction) is reached only by this, not by W1. | shelf:192-198, :305-306, :398-399 |
| W2 room-side class (:38) | changed | Librarian cwd only, as item 0, first; the letter gets its own bullet (it is not a Third Place letter); each kind says "none in this window" when empty. | compact:177-206 |
| W2 "its two stale lines" (:38) | changed | Three lines: `:111-113`, `:131`, and `:107-108` (false for every seat but Main). `:131` becomes count-free. The test pin at `precompact-preserve.test.js:149-157` is re-pinned by design. | compact:153-173, :208-213 |
| W2 red check `grep -c 'any of the five above'` (:38) | changed | Kept as a probe only: a comment edit turns it green. The red check is the window-path count on the recorded transcript, plus unit tests. | compact:286-291, :390 |
| W2 channel (not in plan) | added | A probe of the hook's output shape on 2.1.323, in a scratch session; a `# Compact instructions` section in `LIBRARIAN.md`, riding W1's rebuild. | compact:228-250, :380-387, :395-400 |
| W2 precondition (not in plan) | added | Score the item-6 bar first (due since early October, unscored, one command, non-author). | prior:192, :234-236 |
| W3 body line (:39) | changed | A new hook file, not an edit to `sessionstart-state.js`. Effort is readable from the transcript's last reply. Origin is labelled "last synced" and aged by the reflog entry time, never the commit time. | body:5-8, :94-96, :133-137, :163-182 |
| W3 red check "136 resume rows skipped" (:39) | changed | Never turns green under a new-file design (the state hook is untouched). The red check is a fixture of the 14:42:47Z wake. | body:195-199, :209-215, :308-309 |
| W3 + W2 seat pointer (not in plan) | added, merged | W2's SessionStart pointer line (newest note, Third Place newest, other machine's handoffs) goes into W3's new hook, librarian only, picked by file-name date. | compact:260-272, :397-398 |
| W4 gate (:40) | changed | A new PreToolUse hook copying `sources-gate.js`, not `dispatch-gate.js`. "Opened whole" and "newest" are defined. On D, `gates_mode` light makes a copied gate warn, so refusing is his call. | gate:19-24, :89-117, :137-163 |
| W4 red check "neither file opened" (:40) | changed | The room handoff WAS `cat` whole. Red for the seat's own note and for the newest L handoff by commit (dreamzone3). Only 3 of 154 wakes on D can test the handoff half. | gate:9-18, :61-67; prior:10-16 |
| W4 design holes (not in plan) | added | Exclude a redirected `cat`; normalise backslash paths; no exemption for a subagent ring. | gate:328-352 |
| W5 (:41) | changed | Cause found: the launcher's fetch was receiving a 90.5 MB pack (85 MB of it one encrypted transcript) and was cut at its 20 s total ceiling [2nd reader: or by a git error in the same second; the disk cannot tell the two apart (launch:299-300, :381). The outcome is the same: a cut transfer]. Fix: a receipt on disk (F1), a silence-bounded wait (F1b), a comment fix (F3). The four uncovered start paths were not used. | launch:11-17, :36-39, :177-235, :298-304 |
| W5 red check "307 commits behind" (:41) | changed | A tmp_pack probe on this morning's disk and a large-blob unit test. | launch:245-264 |
| Lap falsifier (:43-45) | changed | The plan merged two registrations: the 11-12 plan's (compactions) and the letter's (wakes). Quote both verbatim; one lap falsifier added in section 5. | prior:181-186 |
| Rebuild and restart (:46-48) | kept, one fact added | Do the restart when the seats are cold anyway, before a day's first message: a mid-day restart likely rewrites every seat whole. | cold:269-276 |
| Proposed panes (:49-50) | changed | Two panes split by file, so they never edit the same file (section 3). | [ours] |
| C1, model before the first request (:54-55) | changed | Cause: a resume keeps the transcript's model. `--model` on resume (Rust) saves 2.03 M Opus-write tokens this morning; it also outranks his `/model` past each restart. | cold:153-200 |
| C2, idle compaction vs keep-warm (:56-58) | changed | Race confirmed (293 idle compactions, 54.5 to 56.7 min). The safe line is a ping SENT before minute 54. Options A, B, B', D; each decides compactions, so each is his. 30 of 42 auto compactions since 11-03T12:53Z were idle. | idle:9-11, :80-84, :171-187, :365-372 |
| C3, keep-warm woke a 9.5-day seat (:59) | changed | Cause established: a local `/effort` echo counts as activation (`main.rs:13162`). O's write was brought forward; in 4 of 8 cases the writes (664,706) were added; 17.07 M read. Fix the rule structurally. | idle:12-19, :96-134, :376-378; cold:202-221 |
| C4, warm compaction at close or a fresh seat (:60-61) | kept | His word per seat. About 5.0 M / 5.3 M units this morning, less ~0.45 M of summary output. | cold:234-249 |
| C4b, cold `/compact` near the 967k line (not in plan) | added, his word | C and E resumed within 75k of the line and auto-compacted 9 min later. | cold:223-232 |
| C4c, a lower auto-compact line (not in plan) | added, his word | 1.3 to 2.7 M smaller first writes this morning (a floor). | cold:251-257 |
| C4d, keep warm across the gap (not in plan) | added, weak | About 0.1 to 0.6 M of 5.08 M. | cold:259-267 |
| C5, D's second-reader hook sync (:62-63) | kept as it was | No level-two file covers it. | [inferred] |
| C6, xhigh lean (:64-65) | kept, facts added | `modelSettings` already holds fable-5-2 `xhigh`; an effort change kept the cache in the one clean case (P). | cold:29-30, :132-136; body:91 |
| `seat-substrates` memory note (not in plan) | added, its owner's | It says a restart changes a seat's model; a resume keeps the transcript's. | cold:36-39 |

## 2. The lap, part by part, in build order

Order [ours]: W5 (makes the pull happen and leaves a record) → W1 (stamps the shelf, reads W5's record) → W2 (summary side)
→ W3 (body line, reads W1's stamp) → W4 (gate, last, after his ruling). C3 and, if ruled, C1 ride W1's rebuild. W5 and W1
are pane R; W2, W3, W4 are pane H; they run at the same time (section 3).

### W5. The launcher's pull leaves a record, and finishes on a large catch-up

**Files.** `consonance/launch.ps1`: `Update-FromOrigin` `:410-561`, its fetch `:453-468`, the up-to-date start `:594-598`,
the stale comment `:78-81`; `consonance/launch.park.test.js` [read: launch:63, :193-196, :232-235].

**The change, in words** [ours, from launch:179-235]:
- F1. Every return of `Update-FromOrigin` writes `%LOCALAPPDATA%\consonance\launch-pull.json`, beside the fuse receipt, in a
  `try`, like the fuse's write. Fields: `at`, `machine`, `launch_id`, `outcome` (one of `pulled`, `current`,
  `skipped-running`, `skipped-branch`, `fetch-timeout`, `fetch-failed`, `refused-dirty`, `parked`, `ff-refused`, `error`),
  `head_before`, `head_after`, `behind`, `fetch_ms`, `bytes_received` (size of the newest `tmp_pack_*` at a kill),
  `last_progress` (the fetch's last `--progress` line), `why` (git's first stderr line). The fetch child's stderr is
  redirected as `Invoke-Bounded` does. Dialogs and returns stay as they are.
  [2nd reader: two musts the text leaves open. (1) Drain the redirected stderr asynchronously, as `Invoke-Bounded` does
  (`ReadToEndAsync`, `consonance/launch.ps1:95-98` area) [read]; a `--progress` stream into an undrained pipe can fill it
  and stall git [inferred]. (2) The receipt directory must be a PARAMETER of `Update-FromOrigin`, defaulting to
  `Get-FuseReceiptDir` as the fuse's `$ReceiptDir` does (`launch.ps1:133`) [read]. The park harness runs the REAL function
  and lifts only the functions named in `$want` (`launch.park.test.js:22`) [read]: with a hard-coded
  `$env:LOCALAPPDATA` path, tests (i) to (iii) would overwrite the live `launch-pull.json` that W1 and W5's falsifier read
  [inferred]. Tests pass a temp dir; any new helper joins `$want`.]
- The launcher sets `$env:CONSONANCE_LAUNCH_ID` (a fresh id) before each `Start-Process` of the app and writes the same id
  into the receipt; the app inherits it (W1 reads it). This replaces the `app_pid` design, which races the app's read, and
  the 300 s window, which names an earlier pull after a stick-apply relaunch [read: launch:214-217, :370-372].
- F1b. The fetch ceiling becomes a parameter of `Update-FromOrigin` (default 20 s) that holds only until index-pack opens a
  `tmp_pack_*` in the git dir's `objects\pack`. After that the launcher waits while that file grows (poll each 1 s; kill
  after 15 s with no growth), up to the fuse's own cap of 120 s. On the cap, kill as today. D066's no-answer case keeps its
  20 s end [read: launch:201-206, :256-264].
  [2nd reader: WRONG as a detector, and it breaks test (ii) below. git keeps a fetched pack (index-pack, `tmp_pack_*`) only
  when the fetch carries at least `fetch.unpackLimit` objects, else `transfer.unpackLimit`, "The default value is 100";
  below it the objects are unpacked into loose object files (https://git-scm.com/docs/git-config, `fetch.unpackLimit`
  and `transfer.unpackLimit`, downloaded with curl) [read]. Neither key is set in this repo (`git config --get`: exit 1)
  [read]. So a catch-up of one commit holding one large file (L pushing only a commit like 3de92e53) opens no `tmp_pack_*`,
  the wait never extends, and the fetch is cut at 20 s as today [inferred]. Test (ii)'s fixture, one commit with one 20 MB
  blob, is 3 objects, so it stays red after F1b as written [inferred]. Smallest close [ours]: add `-c fetch.unpackLimit=1`
  to the fetch's arguments (`launch.ps1:453`), so every fetch keeps a pack; or take liveness from stderr progress bytes
  instead of a file.]
- F3. Fix the comment's drifted pointers: `sync_at_launch()` at `main.rs:16403`, the stick-apply start at `:15387-15389`,
  `dev/ARRIVING.ps1:146` for the app start [read: launch:232-235].

**Failing checks on the recorded case.**
- On D's own disk, red today for the cause [read: launch:245-251, :363-365]: the newest `tmp_pack_*` in `.git/objects/pack`
  was created inside the launch window and is smaller than the catch-up.
  `ls -l --time-style=full-iso .git/objects/pack/tmp_pack_*` shows `tmp_pack_Hl1ze7`, 2,138,111 B, ~~created 08:41:38.860~~
  [2nd reader: `ls -l` prints the LAST-WRITE time, 08:41:57.664914800; the creation time 08:41:38 comes from PowerShell
  `Get-Item … CreationTime`. Both re-run today: 2,138,111 B, created 8:41:38, last written 08:41:57.664] [read];
  `git rev-list --objects --disk-usage 0b85fead..8fd453c6` prints 90516246. The window is the click (UserAssist 08:41:36.443)
  to the fuse's `at` (14:42:13.0153733Z).
- `ls "$LOCALAPPDATA/consonance/launch-pull.json"`: absent today (the folder holds 8 files) [read: launch:244-245]. This
  checks the report, not the pull.
- Unit tests in `launch.park.test.js` (red today) [read: launch:252-264]: (i) origin is a missing `file://` path → a receipt
  with `outcome: fetch-failed` and a non-empty `why`; (ii) the scripted origin gets one commit holding a 20 MB random blob;
  the total ceiling is set below that local fetch's measured time and the silence bound to 15 s; expect `pulled` and HEAD at
  origin. Today the real function kills the fetch while bytes still arrive. (iii) D066's never-answering local server still
  ends in about 20 s with `fetch-timeout` (this one guards the shortcut "just raise the ceiling").
  [2nd reader: a shortcut none of (i) to (iii) catches: once a pack opens, wait to the 120 s cap and never look at growth.
  (ii) passes, (iii) never opens a pack, so it passes too. Close it with (iv) [ours]: the wait helper, driven with a child
  that writes a growing file and then stops writing, scaled-down bounds (for example silence 1 s, cap 30 s); expect a kill
  about 1 s after growth stops, far under the cap. And (ii) needs at least 100 objects or the unpackLimit fix above.]

**What proves it afterwards.** The next launch that opens behind origin on a large catch-up leaves no `tmp_pack_*` and two
reflog rows, `fetch --quiet origin main: fast-forward` and `merge origin/main: Fast-forward` [read: launch:250-251], and a
receipt whose `outcome` is `pulled`.
[2nd reader: the fetch row's text is built from the fetch's own arguments [inferred: git's fetch reflog message]. With
`--progress` added it would read `fetch --quiet --progress origin main: fast-forward`; match the row on its prefix
`fetch ` and `origin main: fast-forward`, not on today's exact text.]

**Needs.** No rebuild, no hook install: `launch.ps1` runs at every launch on both machines (L gets it by its next pull)
[read: launch:194, :374]. Tier: F1 check it; F1b prove it (it gates every launch and moves the tree) [read: launch:204-205].
His word only to start Lap W (`plan`:33).

**Cost per wake.** 0 bytes of seat context. Up to 100 s more launch time on a large catch-up [inferred: 120 s cap less 20 s].

**What could go wrong, and how it shows.**
- A trickling fetch (some bytes every 15 s) waits to the cap: the receipt shows `fetch_ms` near 120,000 [inferred].
- In a worktree the git dir differs; if the pack path is wrong the wait never extends: receipts keep saying `fetch-timeout`
  with `bytes_received` empty [inferred].
- The disk probe fires wrongly on a `tmp_pack_*` left by a seat's own killed fetch inside the window [read: launch:370-371].
- The cause itself, an 85 MB encrypted transcript per day in the repo, stays; that is his call (section 4) [read: launch:205-206].

### W1. The shelf says what it was built from, carries the newest note's newest entries, and the pinned letter

**Files.** `consonance/src-tauri/src/main.rs` at HEAD [read: shelf:16-52, :125-130]:
- `librarian_shelf_light_at` `:8950-9023` (carry loop `:8970-8979`, header `:8980-8995`); cap `LIGHT_NOTES_CAP` `:8928`;
- the rule comment "WHOLE FILES ONLY" `:7962-7963` (amend: a run of whole verbatim entries is not a distillation);
- `librarian_note_is_carried` `:7975-7981` (leave unchanged; it also drives the strict walk);
- stamp insertion points: `librarian_intake_head()` `:9336`, `main_intake()` `:7599`, `third_place_intake()` `:7766`,
  `intake_with_map` `:6306` (feeds `resumed_intake` `:6419`), `prepare_sibling_dir` `:3985`;
- tests: `intake_light_tests` near `:9109-9307`; the bounds `:9153` and `:9154`.

**The change, in words** [ours, from shelf:103-136, :171-180, :252-271; launch:208-228]:
- (a) The stamp. One impure helper reads `git rev-parse --short HEAD`, `symbolic-ref --short HEAD` and `ls-remote origin
  refs/heads/<branch>` in `repo_root()`, with `GIT_TERMINAL_PROMPT=0`, `GCM_INTERACTIVE=never`, the NO_WINDOW flag and a 5 s
  timeout; if the remote sha exists locally it adds `rev-list --count HEAD..<sha>`. No `git fetch`. It runs once per launch
  and is cached (the `LAUNCH_VERDICT` pattern, `:14401`, `:14616`), ~~with one build time per launch~~ and a `cfg(test)` seam like
  `intake_light`'s (`:3048-3059`) so tests make no network call and no seconds stamp can differ between two calls. One pure
  formatter makes the line; it goes FIRST in every intake named above.
  [2nd reader, two corrections. (1) WRONG: "one build time per launch". Seats are written at spawn, and spawns happen
  after launch: `spawn_sibling` and a librarian respawn are commands the UI calls at any hour (`main.rs:3981-3990`,
  `:9477-9504`) [read]. A launch-cached time and HEAD would print 08:42 and 0b85fead on a shelf built at 15:00 from a newer
  tree, the same false stamp W1 exists to end [inferred]. Read `rev-parse` and the time at each intake write (both local
  and cheap); cache only the `ls-remote` answer, for about 60 s as `shelf:120` first had it. The `cfg(test)` seam still
  fixes both for tests. The helper also needs a path argument (an `_at(repo)` form, like `librarian_shelf_light_at`) so
  the origin test below can drive it on clone X, bypassing cache and seam [ours]. (2) WRONG for `intake_with_map`: a
  fresh pane's brief is empty by design (`main.rs:6325-6326`, `(String::new(), requested)` when `is_fresh_cwd`) and
  `resumed_intake` removes its `CLAUDE.md` when the brief is empty (`:6424-6430`) [read]. A stamp put first
  unconditionally makes every fresh pane briefed. Add the stamp only to a non-empty brief, with a test: a fresh cwd
  still gets an empty intake [ours].]
- The line's fixed shape, so W3 can parse it [ours]: `Built <YYYY-MM-DD HH:MM:SS> on <machine> from HEAD <sha> (<branch>).`
  then one of `origin/<branch> by ls-remote: <sha>, NOT IN THIS CHECKOUT -- this shelf predates a pull.` /
  `origin is <n> commits ahead (fetched, not merged).` / `even with origin.` / `origin not checked: <error>.` then
  `The launch's pull: <outcome> at <time>[, <why>].` when `launch-pull.json`'s `launch_id` equals this process's
  `CONSONANCE_LAUNCH_ID`, else `The launch's pull: no record from this launch.` A consumer room with no git says
  `not a checkout`.
- (b) The newest note. A dated window note that does not fit whole goes through `map_carry(body, left)` and rides as its
  newest whole `## ` entries, verbatim, out of `NEWEST_NOTE_RESERVE = 8_000`, spent newest note first and outside
  `LIGHT_NOTES_CAP`. LEDGER and README are never tailed. Insert in the `else` arm at `:8976-8978`, before `over.push`. Label:
  `## librarian/<date>.md -- its newest <n> entries (<x> of <y> bytes; the rest is on disk)`. The header counts it apart from
  "carried in full". If `map_carry` returns nothing usable, the note stays on the `over` list by path, as today.
- (c) The pin. `LIBRARIAN_PINNED = ["TO_THE_NEXT_ONE_go_to_the_source.md"]` and `PINNED_CAP = 8_000`, outside the notes cap,
  carried whole as `## librarian/<name> (pinned)`; inserted after `:8979`, before the header. Over its cap: named by path and
  size. Missing: the header says so, only when `librarian/` exists, with no backticked absolute path.

**Failing checks on the recorded case.**
- Live file, red today: `grep -c "built from" C:/Consonance/instances/librarian/CLAUDE.md` and
  `grep -c '^Built from HEAD' …` both print 0 [read: launch:272; shelf:36-37]. After the rebuild and restart,
  `grep -c '^Built .* from HEAD '` prints 1 and its sha equals the HEAD `git reflog` shows at that spawn minute.
- `the_shelf_names_an_origin_commit_this_checkout_lacks` (Rust): a temp bare repo as origin; clone X at commit A; a second
  clone pushes B; X never fetches. Drive the IMPURE helper on X, not only the formatter: the line names B's sha and "NOT IN
  THIS CHECKOUT"; a clone at B prints "even with origin". A build from local refs fails it, as it should [read: shelf:138-147].
  Seed the no-receipt case with today's values (HEAD = local origin/main = 0b85fead): it must never print "current" or "0
  behind" [read: launch:265-271].
- `light_the_newest_note_over_the_cap_rides_as_its_newest_entries`: today's note is 50 entries `## 0H:MM — entry k` of about
  1,300 B; the last holds `NEWEST-ENTRY-50`, the first `OLDEST-ENTRY-01`; yesterday's note is 18,042 B; README present.
  Expect the newest marker in, the oldest out, the slice starting at `## `, yesterday whole, the label saying "newest". Red
  today: `:8973-8977` puts the 65,000 B note on `over` [read: shelf:217-223].
- Guards, green today and kept green: `light_a_tail_never_costs_yesterdays_whole_note`; a LEDGER fixture with `## ` entries
  and a marker that must stay absent (real LEDGER: 80,142 B, 7 headings) [read: shelf:224-231].
- `light_a_pinned_file_rides_whole` with window notes that fill the cap and the pin still asserted (a pin-only fixture
  passes a pin carried inside the cap); `light_a_missing_pin_is_said`. Red today: undated means never carried (`:7979`)
  [read: shelf:267-269, :284-286].
- A recorded replay, `#[ignore]` like `dump_intakes_for_measure` (`:9293-9307`): feed `git show
  8fd453c6:exo_memory/librarian/2026-11-13.md` as today; the shelf must contain "## 08:0x: the Third Place's swarm ended;
  the last commit (librarian, L)" [read: shelf:232-234]. Today it is absent: the note goes to `over` [read: shelf:372].
  [2nd reader: weak. That heading is the note's LAST entry (`git show 8fd453c6:exo_memory/librarian/2026-11-13.md`: 61,668
  B, 51 `## ` headings, the marker's heading at line 383, the last of them) [read], so a tail of one entry passes. Also
  assert the entry 9 back, the 07:1x one the 8,000 B tail reaches (shelf:165), or that the carried slice is at least the
  reserve less the largest entry [ours].]
- Pane-only replay, never on the live checkout: a scratch clone reset to 0b85fead with origin at 8fd453c6 prints 8fd453c6
  [read: shelf:148-149].

**What proves it afterwards.** The live grep above; the tests green; after the next restart the librarian's file carries the
stamp, the 11-13 or newer note's tail, and the letter.

**Needs.** Rust: one rebuild of Consonance and one restart; no hook install [read: shelf:297-300]. Before the restart, count
queued messages with no delivery row and check no lock is held (`plan`:46-48). Restart when the seats are cold anyway, before
a day's first message [read: cold:269-276]. A restart resumes each seat and cuts no context [read: launch:222]. The bound at
`:9153` changes on purpose (add the reserve and the pin cap); the 25 KB light-under-strict margin at `:9154` needs his word
[read: shelf:239-246, :401-403].

**Cost per wake.** Librarian about 14.1 KB (250 + 8,000 + 5,822), +13 % on 108,857 B; 0.70 to 0.89 % of its 48 h cache
reads; about 4 to 5k tokens on a 500k to 930k cold wake. The stamp alone, about 250 B per seat [read: shelf:151-152,
:291-296].

**What could go wrong, and how it shows.**
- The intake nears the 150,000-character cap (`main.rs:7930`): light was about 126 KB on today's tree before W1, so W1 puts
  it near 140 KB [inferred from shelf:243-246, :251]. It would show as the harness's refusal at spawn, so the landing pane
  measures the built intake against the cap before the restart [ours].
- `ls-remote` offline: a 5 s wait, then "origin not checked" (honest) [read: shelf:388-391].
- File order is merge order, not clock order: a clock-newer entry placed higher by git is missed by the tail [read:
  shelf:204-206].
- A spawn's `let _ = fs::write` drops a failed write; yesterday's shelf would stay with no word (not fixed here) [read:
  shelf:307-309].
- W1 does not reach a seat after a compaction: the harness re-injects the spawn-time copy [read: shelf:192-198]. That is W1d.
- The record's adverse case: this morning the letter's path was in the seat's own `wc` call, and his question turned it
  [read: prior:388-390]. W1 puts the thing in front of the seat; it does not make the seat use it.

### W2. The compaction directive: the item-6 score, the shape probe, the stale lines, the room-side class

**Files.** `consonance/hooks/precompact-preserve.js` `:107-108`, `:111-113`, `:131`, the ALIVE slot `:97-103`, `:110`;
`consonance/hooks/precompact-preserve.test.js` `:146`, `:149-157`; `dev/shell/hooks/precompact.js:70-71` (comment);
`consonance/src-tauri/brief/LIBRARIAN.md` (pane R) [read: compact:151-213, :239-250].

**The change, in words.**
- Step 0, before any edit: a non-author scores the item-6 bar with `node exo_memory/loop/compaction_corrections_2026-10-05/
  measure.js --after 2026-10-05T21:09:40Z` (counts only) [read: prior:192, :234-236]. 61 librarian compactions have passed
  since its start [read: prior:107-109].
- Step 1, the probe, in a scratch session that is no seat: reuse `exo_memory/loop/2026-08-18/compact-probe/` with its hook
  paths rewritten (it ran on another machine); three arms, a root-level JSON token, a plain-text token, a token in a scratch
  CLAUDE.md `# Compact instructions` section; force an auto pass with `CLAUDE_CODE_AUTO_COMPACT_WINDOW=100000`; a PostCompact
  logger counts each token in `compact_summary`. If the JSON token is 0 and the plain one is above 0, the hook's output
  becomes plain text and its shape tests change with it [read: compact:122-125, :233-238, :395-400].
  [2nd reader: the scratch session also runs the USER-level hooks unless told not to. `--settings` merges: "Keys you omit
  keep their file-based values" (https://code.claude.com/docs/en/cli-reference.md, `--settings` row, line 130 of the
  download) [read]. So at its compaction `precompact.js` would run `checkpoint.py --write` against the live room, since it
  finds the repo from `~/.consonance.json`'s `room_path` whatever the cwd (`dev/shell/hooks/precompact.js:39-40`, `:67-68`;
  `checkpoint.py:27`, `:554` writes `CHECKPOINT.md`) [read], and `precompact-preserve.js` would add the room's own
  directive to the summariser's instructions, confounding the token counts [inferred]. Start the probe with
  `--setting-sources project,local` (cli-reference.md line 129) [read] and its hooks in `--settings` or the scratch
  project's own settings file.]
- Step 2, the stale lines [read: compact:155-173]: `:111-113` become the three lines that state the pre-directive figures as
  pre-directive and the 2026-09-19 re-measure (keeping `33.8%` and `3.5%`, which `test.js:58-59` require); `:131` becomes
  "Prefer dropping narrative, atmosphere and restatement over dropping any numbered item above."; `:107-108` says "from a
  measurement of compaction summaries in this project", kept at two lines. `precompact.js:70-71` is corrected to say its
  stdout goes to the summariser as instructions, not to the seat [read: compact:136-138].
- Step 2, the room-side class [read: compact:177-206]: for the librarian's cwd only, item 0, above every task item: a
  section "Room side, with paths", carrying verbatim, each with its path: the user's own words about the room or the seat;
  letters to or from the Third Place (`exo_memory/third_place/`); the librarian's letter to its next instance
  (`exo_memory/librarian/TO_THE_NEXT_ONE_*.md`), its own bullet; catches and corrections about the seat
  (`exo_memory/librarian/<date>.md`, `exo_memory/map/M.md`); the open questions, each with its file. An empty kind reads
  "none in this window". Size about 600 characters on 1,774, under the 10,000 cap.
- Step 3, pane R: a `# Compact instructions` section in `LIBRARIAN.md` holding the same bullets; it reaches the seat at W1's
  restart (the brief is served from the bundled copy on D) [read: compact:239-248].

**Failing checks on the recorded case.**
- The window-path count over D's librarian transcript, red today [read: compact:286-291]: for each auto window, the room-side
  path classes the seat's own tool calls touched against the classes the summary names. Over 65 auto windows: `third_place/`
  touched 20, named 7; `map/M.md` 12 and 5; `lighthouse_the_room` 4 and 2; dated notes 51 and 50. The last window,
  2026-11-12T04:59:08Z: `third_place/` touched 1, named 0. Pass after: at the first natural auto compaction, every touched
  class is named. Forward-only (a recorded summary never changes); a replay may run on a copy, never a seat.
- Unit tests, red against HEAD, one behaviour each [read: compact:215-223]: the librarian gets "Room side, with paths" first
  on every trigger (Windows, slash, trailing-separator spellings; `librarian-old` gets none); a build seat gets none; the
  directive never states its own item count; the figures include `6.4%`; the dream gate still wins on the librarian's cwd.
- Probes, not checks: `grep -c 'any of the five above'` 1, `grep -c 'Room side'` 0, `grep -c '6\.4%'` 0,
  `grep -c 'summaries of this conversation'` 1, all on `consonance/hooks/precompact-preserve.js` [read: compact:278-280].
- Agreement test (pane R or the landing pane): the four bullets appear in both the hook and `LIBRARIAN.md`. It does not
  prove the summariser saw CLAUDE.md; the probe's third arm does [read: compact:395-396].

**What proves it afterwards.** The window-path count at the next natural auto compaction; the unit tests green; the probe's
token counts recorded beside the shape decision.

**Needs.** One install, `dev/shell/install.ps1 -Only` for `precompact-preserve.js`; `settings.json` unchanged, its sha equal
before and after [read: compact:300-303]. [2nd reader: holds: `install.ps1` writes `settings.json` only when a
registration is added, repointed or pruned (`dev/shell/install.ps1:983-987`) [read]. But step 2 also edits
`dev/shell/hooks/precompact.js`, installed and `ok` today (`install.ps1 -Check`, run read-only) [read]; after the comment
edit it reads DRIFT until installed. Name it in the same `-Only` list, or leave the comment.] Tier: prove it, with the hook's mutation run [read: compact:225-226]. The brief
section rides W1's rebuild and restart. The test re-pin at `:149-157` is a deliberate spec change: the pin holds the exact
lines D089 showed out of date; say so in the hand-back [read: compact:208-213]. No seat is compacted to test any of this.

**Cost per wake.** About 600 characters more to the summariser per librarian compaction, under its 10,000 cap. The summary
grows; the registered cut-back bar governs it: "cut back if the summaries' median grows > 15% with no gain"
(`consonance/hooks/precompact-preserve.js:94-95`), which `handback/p-compact-C_2026-10-05.md:12` states as a median over
21,475 characters [read: both primaries, opened by me to settle compact:393-394 against prior:192; the same bar].
The brief section, under 1 KB per wake.

**What could go wrong, and how it shows.**
- Four "none in this window" lines pass a heading count with nothing carried; only the window-path count catches it.
- A cwd that merely ends in `librarian` (a session opened in `exo_memory/librarian`) gets the section [read: compact:391-393].
- On 2.1.304 to 2.1.323 a rejected shape drops silently on auto; a manual `/compact` echo would say "failed" [read:
  compact:4-10, :128-132].
- The harness's fixed close ("pick up the last task") still owns the summary's last word [read: prior:119-120].

### W3. A body line at every start, resume included, with the librarian's room pointer

**Files.** New `consonance/hooks/sessionstart-body.js` and `consonance/hooks/sessionstart-body.test.js`;
`dev/shell/install.ps1`, one `$files` row (as at `:157`) and one registration row (as at `:290`, `Event = 'SessionStart'`)
[read: body:163-177].

**The change, in words** [ours, from body:74-121, :163-175 and the second reader's fixes]:
- The hook prints one `hookSpecificOutput.additionalContext` line, facts only, each field with its source when it is not
  first-hand:
  `[body] machine <tag> · model <id>[ (last reply)] · effort <level> (<env|last reply|saved>)|not readable · context <N>k
  <to resend|at last reply HH:MM|before compaction> · HEAD <sha> · origin/main last synced <age> ago, <b> behind by that copy
  · shelf built at <sha>[, <n> commits behind HEAD] · source <source>`.
- Sources, in order: machine from `CONSONANCE_MACHINE`, then `~/.consonance.json` `machine_tag`, then hostname (inline the
  ten lines and pin them equal to `state-sync.js:175-185` by a test); model from the input's `model`, else the last
  non-synthetic assistant row; effort from `CLAUDE_CODE_EFFORT_LEVEL`, then `CLAUDE_EFFORT`, then the last reply's top-level
  `effort`, then `modelSettings[<model>].effortLevel` "(saved)", else "not readable"; context from `context_tokens`, else the
  last reply's input + cache read + cache write; origin age from the origin/main reflog ENTRY time (never `%ct`, the commit
  time); the shelf's sha from W1's `from HEAD <sha>` line when present, else the file's mtime and `HEAD@{<mtime>}`.
- For the librarian's cwd only, a second clause: its newest dated note, the Third Place's newest file, and every
  `handoff_*_<date>-<other>.md` of the newest date for the other machine, each picked by the date in the file name (never by
  mtime: a pull stamps every file), read at HEAD `<sha>` [read: compact:260-268].
- Never dollars: `estimated_cache_write_usd` is not printed [read: body:112].
- Ledger `<data>/sessionstart-body.jsonl`: `{ts, source, bytes, ms, model_src, effort_src, ctx_src}`, and a `skipped` row
  with its reason for fresh panes, overseer runs and dream runs. Clock seam `BODY_NOW`. Each field fails on its own to
  "not readable"; the start is never blocked.

**Failing checks on the recorded case.**
- The probe that is red for the reason, on the record: at the 14:42:47Z wake's refs, `git rev-list --count HEAD..origin/main`
  was 0 while the origin/main reflog entry was 33.2 h old and L had pushed 307 commits [read: body:83, :100-102, :213].
- Fixture of that wake in `sessionstart-body.test.js` [read: body:200-215]: a temp repo with HEAD = origin/main = one
  commit whose commit date is hours OLDER than the `update-ref` date (`GIT_COMMITTER_DATE=2026-11-11T23:32:51-06:00` for the
  update-ref); a transcript whose last assistant row is `claude-opus-5-5`, usage 2 / 276,157 / 395, `effort` "high", at
  2026-11-12T05:33:49Z; `CLAUDE.md` with mtime 08:42:42; `BODY_NOW=2026-11-13T08:42:47-06:00`; payload `{source:'resume'}`
  with no `model` and no `context_tokens`. Expect `model claude-opus-5-5 (last reply)`, `effort high (last reply)`,
  `context 277k at last reply`, `last synced 33.2 h ago`, `0 behind by that copy`, `source resume`, at most 300 bytes. A hook
  that dates origin by commit time fails it.
  [2nd reader: the byte bound and the librarian clause conflict. The recorded 14:42:47Z wake is the librarian's, and the
  clause adds about 250 B to a line of about 245 B, so a fixture with the librarian's cwd cannot be "at most 300 bytes".
  Pin the fixture's cwd and bound each part: the body line at most 300 B; the clause tested on its own. Probe re-run:
  `git rev-list --count 0b85fead..0b85fead` 0; origin/main reflog entry `2026-11-11 23:32:51 -0600: update by push`; commit
  date of 0b85fead 23:32:49; 33.17 h to 08:42:47 [read].]
- Edges, one test each: payload `model` wins; `context_tokens` gives "to resend"; empty transcript and no model gives "model
  not readable"; no effort anywhere gives "effort not readable"; repo missing gives "HEAD not readable" with valid JSON and
  exit 0; a shelf 314 commits behind HEAD says so; the librarian clause picks by name date after a pull-stamped mtime tie.
- The plan's check ("136 resume rows skipped") never turns green under this design; the hand-back says the check moved
  [read: body:198-199].

**What proves it afterwards.** Ledger pairing: every `sessionstart-state.jsonl` row after the install has a body row of the
same `source` within 5 s, fresh, overseer, dream and Third Place rows aside (red today: 208 state rows since 11-01, 0 body
rows) [read: body:192-199]. Content is proved only by the fixture. The first real wake answers two unknowns as numbers in
the ledger: does `model` arrive on resumes, and does `CLAUDE_EFFORT` reach a SessionStart hook [read: body:168-170].

**Needs.** A hook install: a new entry with `-Only`, on D and on L; it adds one registration to `~/.claude/settings.json`,
~~so the file's sha changes by exactly that row~~ [read: body:183-186; inferred for the sha]. [2nd reader: WRONG.
`install.ps1` copies the file to `.bak-<time>` and rewrites it WHOLE with `$settings | ConvertTo-Json -Depth 24`
(`dev/shell/install.ps1:986-996`) [read]. Today's file is 2-space JSON, 4,942 B, last written by the client at 09:01:54
[read, parsed read-only], so the rewrite changes bytes well beyond the row [inferred: PowerShell's own JSON layout]. The
check is semantic: parse before and after; the one difference is the added hook entry. Same for W4.] No rebuild. Whether a running seat
picks up a new registration without a restart is not established [read: body:187-188]. `-Only` matters: a full install
would overwrite other drifted hooks [read: body:297-299]. His word: Lap W start.

**Cost per wake.** About 245 B (85 tokens) per start per seat, about 51 KB over 13 November days for all seats; the
librarian's pointer clause adds about 250 B [read: body:129-132; inferred for the clause]. About 180 ms per start [read:
body:133-138].

**What could go wrong, and how it shows.**
- Nobody acts on it: its ancestor, the state block, was emitted 163 times and acted on 0 times [read: prior:122-132].
- "0 behind by that copy" after a push from D resets the age; a reader may take a fresh age to mean L was looked at [read:
  body:314-315].
- On L, the "other machine" must come from the machine tag, or L names its own handoff [read: compact:265-266].

### W4. The gate on the first dispatch after a wake (last; his ruling on light mode first)

**Files.** New `consonance/hooks/wake-gate.js` (about 200 lines) and `consonance/hooks/wake-gate.test.js`;
`consonance/GATES.md` (a section); `dev/shell/install.ps1`, a manifest row near `:179` and a registration near `:308`, matcher
`mcp__consonance__call_chair` [read: gate:194, :201-224].

**The change, in words** [ours, from gate:137-180 with the second reader's fixes at gate:328-352]:
- Copy `sources-gate.js`'s shape: tail-read `transcript_path` (4 MB doubling to 64 MB), count only completed non-error calls,
  write the ledger row `wake-gate.jsonl` before any deny, allow when the row cannot be written, an 8 s watchdog, fail open.
  Exports `wakeIndex(rows)`, `openedWhole(file, calls)`, `required(repo, machine, today)`, `decide(...)`, and a `--replay
  <jsonl>` mode.
- Scope: the librarian only (`CONSONANCE_PANE` equal to the `LIBRARIAN_SID` at `main.rs:7620`, else cwd ending `librarian`);
  exit 0 under `CONSONANCE_DREAM`. A call carrying `agent_id` (a subagent) is refused, not exempted: a workflow subagent
  inherits the librarian's pane id and is offered `call_chair` [read: gate:332-336].
- The wake: the last `compact_boundary` system row, or SessionStart `hook_success` attachment, in FILE order. First
  dispatch: no `call_chair` since the wake already delivered.
- Required: (a) the largest `exo_memory/librarian/YYYY-MM-DD.md` by file name (not more than a day ahead of the clock);
  (b) every `exo_memory/loop/handoff_*_<date>-<other>.md` at the newest such date, the other machine from the machine tag.
  Skips are recorded: `no-note`, `no-handoff`, `no-machine` (no tag fails open).
- Opened whole: a `Read` with no `offset` or `limit` (`allow_large` fine), or a Bash/PowerShell segment that is one stage
  with no `|` and no stdout redirect, `cat`/`type`/`Get-Content`/`gc` naming the file without `-TotalCount`, `-Head` or
  `-Tail`, whose result lacks the persisted-output tag. Paths are normalised on both sides (backslashes). Tool ids are
  de-duplicated. On a resume wake, a whole open after the last compaction counts if the file's mtime is older than the open;
  on a compact wake, nothing before it counts. `[interrupt]` in the text passes and is recorded.
- Decision under `gates_mode`: as `sources-gate.js` does (warn in light) unless he rules otherwise (section 4). The refusal
  text names the missing files and says to use one `Read` with `allow_large` and to ring in a later message.
- `required()` is the same list W3 prints for the librarian. Both hooks carry it; one test feeds both the same temp repo and
  asserts the lists are equal (the `dirs.test.js` pattern of pinned copies) [ours].

**Failing checks on the recorded case.**
- Red fixture: the 14:46:27Z ring rebuilt as structural JSONL (the SessionStart:resume attachment at 14:42:47.130Z, the 24
  calls before the ring with their recorded names, stage shapes and result lengths, patterns replaced by a placeholder, then
  the ring), and a temp repo holding the three files at their 8fd453c6 sizes. Expect deny, missing
  `librarian/2026-11-13.md` (grep and cut only) and `handoff_dreamzone3_2026-11-13-L.md` (sed and cut only); satisfied
  `handoff_lighthouse_2026-11-13-L.md` (a one-stage `cat`) [read: gate:206-211, :313-320].
- Green fixture beside it: the 2026-11-11T14:34:29Z resume wake, three plain Reads of the 11-11 -L handoffs with backslash
  paths before its ring at 15:13:22Z: (b) green, (a) red. It pins path normalisation [read: gate:321-323].
- Replay: `node consonance/hooks/wake-gate.js --replay <librarian transcript>`. The mode does not exist yet; the second
  reader's stand-in gives at most 140 of 154 wakes refused under the skip rule; of the 3 wakes that can test (b), 11-11
  14:34Z green, 11-12 04:59Z red, 11-13 14:42Z red on dreamzone3-L only [read: gate:212-221, :324-326].
- Edge tests, one per row of gate:167-180, plus: `cat <file> > /dev/null` does not count; a backslash path counts; a
  subagent ring is refused.
  [2nd reader: both recorded fixtures expect DENY (the 11-11 one is red on (a)), so a `decide()` that always denies passes
  them; only the `no-note` edge row allows. Name two allow tests [ours]: both files opened whole since the wake → allow;
  a second ring after a delivered first → allow. Today's probes: `consonance/hooks/wake-gate.js` absent (so no `--replay`);
  the room's existing gate fired on the recorded ring, `sources-gate.jsonl` 2026-11-13T14:46:27.243Z, call_chair, `warn`,
  kind `missing`, 23 calls, mode `light` [read].]

**What proves it afterwards.** Deny (or warn) rows in `wake-gate.jsonl`; the replay over wakes since the install reads 0
delivered without both files, `[interrupt]` and recorded skips aside. That holds on D only if he rules the gate refuses in
light [read: gate:218-220].

**Needs.** No rebuild. A hook install on D and on L, one registration each; his word [read: gate:225-228, :354-355]. Tier:
prove it (a gate is "a system's own delivery or gates"): test first, mutation runs, the full suite at landing [read:
gate:228-229].

**Cost per wake.** One refusal plus about 110,879 + 21,438 B of reads at today's sizes, about 46k tokens at 2.89 B per token;
13 to 21 KB more at every compaction, even with nothing new [read: gate:182-184, :348-349].

**What could go wrong, and how it shows.**
- A stop or hold ring after a wake meets a refusal; `[interrupt]` passes it, and a ring without it waits one read [read:
  gate:178; prior:376-377].
- A 110 KB note may be over a plain Read's cap; only `Read` with `allow_large` counts [read: gate:344-346].
- Own appends after a whole open on a resume refuse falsely; registered: if more than 1 in 5 refusals are `own-append`, add
  an exception [read: gate:170].
- A refused-by-trailer ring returns a non-error result and could be ledgered as a delivery [read: gate:350-352].
- Open, then ignore: the gate proves the file came back, not that it was used [read: gate:339-340].
- [2nd reader, added] The gate reads the LOCAL tree. On a tree behind origin (this morning before the seat's own pull),
  "newest" is the newest on disk, and stale files satisfy it [inferred]. W5 is what makes the two agree. Also: `install.ps1
  -Check` shows `hooks\sources-gate.js` as DRIFT on D today [read], so "copy sources-gate.js" copies the repo file, whose
  behaviour may differ from the copy running on D.

### Cost items that ride the same rebuild (each his call)

- **C3, keep-warm activation** (pane R, `main.rs:13162` in `activated_by_use` `:13138-13163`). Count a row as activation
  only when a request follows it after app start (an assistant row), still excluding task-notification turns; a tag list
  (`<command-name>`, `<local-command-`) is the fallback [read: idle:190-193, :215-220, :376-378; cold:219-221].
  Red today: `a_local_slash_command_after_launch_is_not_activation`, beside the D098 tests (`main.rs:23620-23680`, helpers
  `:23627`, `:23631`), on O's recorded shape (last request 11-04T02:09:26.991Z; launch 14:42:42Z; `/effort` echo
  14:51:28.831Z); a JS port of the function activates on O's real rows 52136 and 52137 today [read: idle:195-214]. The
  transcript probe red on all 8 recorded cases: a ping at 60+ idle minutes whose only non-meta user rows since launch are
  command echoes [read: idle:225-228]. `a_prompt_after_launch_is_activation_and_so_is_one_after_a_notice` stays green.
  Saves 17.07 M read and 664,706 written since 10-31 [read: idle:376-378]. Tier: prove it [read: idle:232].
  [2nd reader: primary checked: `main.rs:13162` is the `matches!` line; the D098 tests at `:23640-23677` all pair each
  prompt with a reply, so the structural rule keeps `a_prompt_after_launch_…` green [read]. The red test holds only the
  `/effort` shape, so refusing the text `/effort` passes it; add the recorded `/model` echo (fbf98f8e, 10-31, idle:120)
  as a second case [ours].]
- **C1, the model on resume** (pane R, after `main.rs:1141-1145`): push `--model <m>` when Consonance's config names a model
  for the seat; empty keeps today's behaviour. Pin test anchored on the `cmd.args` call, not a `find()` a comment can meet.
  Check: the first call after a wake is on the model named for that seat (red today wherever a seat is named Fable; the
  three switches this morning wrote 2,049,358) [read: cold:163-170, :183-193, :387-389]. The no-rebuild form
  (`ANTHROPIC_MODEL`) needs a probe with `--settings` on a throwaway session, never by writing `~/.claude/settings.json`
  [read: cold:171-178, :194-200].

## 3. Two panes at once, never the same file

| pane | files it alone edits | build lock | parts |
|---|---|---|---|
| H, hooks and node tests | `consonance/hooks/precompact-preserve.js` and `.test.js`; `dev/shell/hooks/precompact.js` (comment); `consonance/hooks/sessionstart-body.js` and `.test.js`; `consonance/hooks/wake-gate.js` and `.test.js`; `consonance/GATES.md`; `dev/shell/install.ps1` | none (node tests; a run of 3 test files or fewer needs no heavy-run lock, per `~/.claude/CLAUDE.md`) | W2 steps 0 to 2, the W2 probe (scratch session), W3, W4 |
| R, Rust and PowerShell | `consonance/src-tauri/src/main.rs`; `consonance/src-tauri/brief/LIBRARIAN.md`; `consonance/launch.ps1`; `consonance/launch.park.test.js` | `cargo test` locks the tree | W5, W1, W2 step 3, C3, C1 if ruled |

- Shared formats, fixed in this spec so neither pane waits: W1's stamp line (`Built … from HEAD <sha>`), which W3 parses;
  W5's `launch-pull.json` fields and `CONSONANCE_LAUNCH_ID`, which W1 reads; the four ROOM bullets, which both W2 halves
  carry [ours].
- `CHANGELOG.md` is edited by neither pane: each hand-back carries its entry text and the landing pane writes them [ours].
- The bullets-agreement test goes red until both panes land; the landing pane runs it [ours].
- The plan proposed P for the hooks and B for the Rust (`plan`:49-50); which panes is his word. On the relayed question,
  O made no request of its own from 11-04T02:09Z until a prompt at 17:04:20Z today and was working at 17:06Z [read:
  cold:138-141; idle:137-139]. [2nd reader: the two files differ by 3 s: cold's prompt row is 17:04:17Z, idle's first
  call 17:04:20Z. Re-read now, timestamps only: O's newest assistant row is 17:40:55Z, 231 assistant rows since 17:00Z
  (`sibling-36313935`, transcript tail) [read]. So O is active, not inactive, as of 17:45Z.]

## 4. The keeper's calls

Each is one plain question. His own words are quoted only as the files quote them, with the original path and line.

1. **Start Lap W?** It is parked at his word (`plan`:33). His words on the vector, 09:36: "really make sure you attack the
   right and most needed vector" (`briefs/lighthouse_the_room.md`, as quoted at `plan`:5-6) [read: plan:5-6]. Default the
   evidence leans to: start with W5 F1 and W2 step 0 (a receipt and a score: cheap, reversible, and each makes the next
   case readable), then W1 [inferred: prior:225-227, the record gives inputs the most support].
2. **Should the wake gate refuse on D while `gates_mode` is light, or only warn and record?** For refusing: a gate holds its
   form (47 strict refusals of the NEXT trailer); the record's own line, "the smallest room may not be text but wiring …
   what refuses" (`third_place/2026-09-15.md:201-203`) [read: prior:386-387]. For warning: warnings reached no seat (1,783);
   refusals changed content badly (4.0 % fixed, 10.0 % blurred); it costs about 46k tokens a wake; it cannot touch the
   falsifier that decides the lap [read: prior:55-64, :205-219; gate:182-184]. Default: build it, install it under light
   (warn and ledger), read its rows at the next two wakes beside the falsifier, then rule [ours].
3. **W2's room-side class: the librarian only, or every seat?** The 11-12 plan says "It touches every seat's compaction"
   [read: plan1112:43]; D245 kept build seats task-first [read: compact:177-181]. Default: librarian only.
4. **L's shelf: change the strict walk's order, or run L in `gates_mode` light?** Strict needs the 2026-09-02 cards-first
   order reversed; light is his key, no code [read: shelf:211-215; prior:82-84]. Default: L in light.
5. **May light's shelf come within less than 25 KB of strict (`main.rs:9154`)?** W1 adds up to 14 KB; it is a stated design
   property [read: shelf:241-246]. Default: lower the margin to what W1 needs, named in the commit, at his yes.
6. **Do the daily encrypted transcripts belong in the repo?** One of 85,215,537 B made this morning's catch-up 90.5 MB; every
   earlier launcher fetch carried 11,255,767 B or less [read: launch:11-13, :301-304]. F1b fixes the launch either way.
   Default: none from the evidence; it bears on every catch-up on both machines.
7. **Pin each seat's model on resume (`--model`)?** It saves the second full write when he wants a seat on another model
   (2.03 M this morning); it outranks his `/model` past every restart [read: cold:163-170]. Default: pin only where he names
   a model per seat; empty keeps today.
8. **Idle compaction: move the pings (A), turn it off per seat (B), raise its threshold (B'), or leave the default (D)?**
   Under D, 30 idle compactions of seats ran since 11-03T12:53Z with no per-seat word [read: idle:178, :365-368]. The rule,
   as the librarian's auto-memory records it (the seat's words, not his verbatim): "No seat's carried conversation is compacted or cut ... without the keeper's explicit word for that seat" and "never
   recommend a compaction on cost alone" (`no-cut-without-his-word.md:7`, `:11`, the librarian's auto-memory) [read:
   cold:147-151; idle:178]. The reader's view is B for the seats he names, paired with C4 or the cold-wake cost rises
   [read: idle:185-186]. No default from cost: the rule forbids it.
9. **Is a `/effort` typed into a seat him activating it for keep-warm?** His 05:57 rule: "keep warm what is already warm, and
   then wait for each seat and pane to activate" (`plan_keep_warm_2026-09-21.md:75-76`) [read: idle:115-117]. The code's
   own rule is "a request since the app started" [read: cold:204-206]. Default: no (C3).
10. **A warm `/compact` at a day's close, a cold one near the 967k line, a lower auto-compact line, or a fresh seat?** Each
    compacts or cuts; per seat; no default, by the same rule [read: cold:223-257, :393-396].

## 5. What the record predicts, and the lap's falsifier

**Predicted to fail first: W4** [read: prior:203-219, :406-410]. It cannot move the falsifier that decides the lap (a reply
needs no dispatch); its mechanism already exists (`sources-gate.js` fired on this morning's ring and warned, kind "missing",
23 calls); in light it reaches no seat; its measured content effect is 4.0 % fixed against 10.0 % blurred.
**Next: W3**: its ancestor was emitted 163 times and acted on 0 times; its plan check tests presence, not use [read:
prior:122-132, :373-374, :410]. **Then W2**: its parent's re-measure is VOID AS WRITTEN with falsifiers DECORATIVE, item 6
has sat unscored, and the Third Place's room-side section has no bar [read: prior:95-113, :221-223].
**Most support: W1 and W5**, as inputs; but input in context goes unused (12 of 12 wrong path claims had the path in
context, 2 strong), and "No size of room closes that; only something firing at composition could"
(`third_place/2026-09-15.md:176-177`) [read: prior:33-36, :225-227, :386-387].

**Registered falsifiers that decide the lap, quoted, not paraphrased.**
- The 11-12 plan's [read: plan1112:49-52; markdown bold dropped]: "After (a) and (b) ship, the first reply after each of the
  next two compactions to an open, non-work question is read from the transcript. If either reply names nothing from the
  room beyond the handoff without a further prompt, (a)+(b) failed as an input change, as K2 failed as a cue, and the
  problem sits upstream of the input (the decision itself)."
- The letter's, "At each of the next two wakes" (`librarian/TO_THE_NEXT_ONE_go_to_the_source.md:66`), registered with the
  retrieval plan's; due and unscored [read: prior:184-186, :193].
- W5's own: if the next launch on either machine opens behind origin and `launch-pull.json` cannot say why, F1 failed
  [read: launch:274-275].

**The lap's falsifier, registered here before any build** [ours]. Lap W is degenerating if, at the first two librarian
wakes after its installed parts are live (any source, counted from the transcript by a seat that is not this lap's author),
the instruments show the input arrived and the act did not change: (1) the shelf's stamp names the HEAD the reflog shows at
that spawn; (2) the body line printed, every field with its source; (3) at a compaction wake, the summary names every
room-side class the window's own tool calls touched; and (4) the first reply to an open, non-work question still names
nothing from the room beyond the handoff without a further prompt. Then the inputs reached the seat and did not move the
act: stop adding inputs and cues, and take the 11-12 plan's branch "upstream of the input". If (1), (2) or (3) fails, the
build failed, not the idea; fix it before the falsifier is read again. This adds to the two registrations above and
replaces neither.

## 6. What this spec does NOT cover

- Lap D (the idle-holder guard, a stop order that outranks the queue, the API-error class) and the hygiene syncs.
- W1d, rewriting every seat's shelf when HEAD moves: the only change that reaches the 11-12 L case (a compaction).
- The strict walk's tail and pin (L), beyond the call in section 4.
- The same gap on other seats: the Third Place's shelf carries none of `third_place/` [read: shelf:279-281].
- The discarded spawn write (`let _ = fs::write` at `main.rs:9460`, `:9502`, `:9559`).
- `state-block.js`'s record pointer, the newest journal (10-24), 20 days stale [read: compact:110-113].
- The 11-12 plan's (c), the relevance retriever, and (d), the SOURCE line.
- Lap C item 5, D's second-reader hook sync; the correction of the `seat-substrates` memory note (its owner's).
- The summariser's actual prompt on any compaction (no transcript records it).
- Anything on L: every L-side claim is unmeasured.

## What I did not open

- Any primary but two: `consonance/hooks/precompact-preserve.js:90-96` and `exo_memory/handback/p-compact-C_2026-10-05.md:12`,
  to settle whether two files named the same bar; plus `git rev-parse`, `git diff --stat` and `git log | wc -l` for HEAD.
- The code at every other cited line, the docs pages, every transcript and ledger, the board: each claim about them rests on
  the level-two file cited beside it.
- `wake-level-two.workflow.js` in this folder; the room-better swarm files beyond `in_wake.md`.
- L's disk.

## Second reader

Second reader of this spec, on D, 2026-11-13 about 17:45Z, read-only except this file. HEAD d474b273; `git diff --stat
3f5fa65d HEAD -- consonance dev` is empty [read], so every code line the spec cites holds at HEAD. Method: each line of
sections 1 and 2 opened at its topic-file line (after that file's second reader); then each file:line to change, each
check and each needs-claim opened at the primary (code at HEAD, `~/.claude/settings.json` parsed read-only, `install.ps1
-Check`, the git-config and cli-reference pages downloaded with curl). Corrections are in place above, marked
`[2nd reader: ...]`. Transcripts: timestamps and counts only.

**Section 1 (36 rows).** Every `rests on` citation opened in its topic file: 35 OK; 1 DOWNGRADED (W5 row: "cut at its 20 s
total ceiling" is one of two readings the disk allows, launch:299-300, :381). The C2 figure "30 of 42 auto" holds at
idle:39 and :294 (idle:11 omits "auto").

**Sections 2 and 3, against the primary:**

| part | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| W5 | `Update-FromOrigin` :410-561, fetch :453-468, start :594-598, comment :78-81 | `consonance/launch.ps1` | OK | fn at :410; fetch args :453; `WaitForExit(20000)` :459; `Start-Process $exe` :597 |
| W5 | F1 outcomes map to the exits | launch.ps1:410-561 | OK | each `return` sits on one named exit |
| W5 | fetch stderr redirected as `Invoke-Bounded` | launch.ps1:95-98 area, :453-458 | OK, note | the fetch redirects nothing today; drain async (added) |
| W5 | launch id replaces `app_pid` (no `-PassThru` at :597) | launch.ps1:597, :703 | OK | :597 bare; :703 has `-PassThru` |
| W5 | F1b: extend while `tmp_pack_*` grows | git-config docs; `git config --get` | WRONG | under 100 objects git unpacks loose, no `tmp_pack_*`; test (ii) stays red |
| W5 | fuse cap 120 s | launch.ps1:132 | OK | `[int]$TimeoutSec = 120` |
| W5 | F3 targets | main.rs:16403, :15387-15389; ARRIVING.ps1:146 | OK | as cited; ARRIVING :52 pull has no ceiling |
| W5 | disk probe values | `ls -l`; PowerShell `Get-Item`; `rev-list --disk-usage` | DOWNGRADED | 2,138,111 B; 90,516,246; `ls` shows 08:41:57.664, not the creation time |
| W5 | receipt absent, folder of 8 | `ls %LOCALAPPDATA%\consonance` | OK | 8 entries, no `launch-pull.json` |
| W5 | unit tests (i)-(iii) | launch.park.test.js:18-27 | DOWNGRADED | real fn, so the receipt dir must be a parameter; silence path untested (iv added) |
| W5 | reflog proof text | git fetch reflog | DOWNGRADED | [inferred] the text changes with `--progress` |
| W5 | no rebuild, no hook install | launch.ps1 run by the shortcut | OK | PowerShell only |
| W1 | cited lines :8928, :8950-9023, :8970-8979, :7962, :7975, :9336, :7599, :7766, :6306, :6419, :3985 | main.rs | OK | each at, or up to four lines past, the named fn head |
| W1 | stamp cached once per launch, one build time | main.rs:3981-3990, :9477-9504 | WRONG | later spawns would carry the launch's time and HEAD |
| W1 | stamp first in `intake_with_map` | main.rs:6325-6326, :6424-6430 | WRONG | fresh panes are empty by design; stamp only a non-empty brief |
| W1 | `LAUNCH_VERDICT` :14401/:14616; seam :3048-3059; NO_WINDOW :7357-7361 | main.rs | OK | as cited |
| W1 | (b) `map_carry` carries newest whole `## ` entries | main.rs:5134-5146 | OK | `MapTier::Newest` slices at a heading |
| W1 | (c) an undated file is never carried | main.rs:7975-7981 | OK | as the topic's second reader found |
| W1 | live grep red | `C:/Consonance/instances/librarian/CLAUDE.md` | OK | `built from` 0, `^Built from HEAD` 0, `^Built .* from HEAD ` 0; 108,857 B, 08:42:42.70 |
| W1 | origin test drives the impure helper | design | OK, note | needs an `_at(repo)` form (added) |
| W1 | newest-entries test red, guards green | main.rs:8970-8979 | OK | [inferred from code, not run] |
| W1 | replay marker | `git show 8fd453c6:…/2026-11-13.md` | DOWNGRADED | the marker is the last of 51 headings; a 1-entry tail passes |
| W1 | bounds :9153, :9154 | main.rs:9153-9154 | OK | `+ 6_000`; `+ 25_000 <= strict` |
| W1 | rebuild + restart, no hook install | main.rs is the app | OK | |
| W2 | :107-108, :111-113, :131, ALIVE :97-103, :110; test :146, :58-59, :163 | precompact-preserve.js and .test.js | OK | "any of the five above" over six items |
| W2 | step 0 command | measure.js:1-12 | OK | `--after ISO` exists; prints counts and ids |
| W2 | step 1 scratch probe | cli-reference.md :129-130; precompact.js:39-40, :67-68; checkpoint.py:554 | DOWNGRADED | user hooks fire unless `--setting-sources project,local` |
| W2 | probes 1 / 0 / 0 / 1 | grep on precompact-preserve.js | OK | 1, 0, 0, 1 today |
| W2 | window-path count red | compact:286-291 | OK | the topic second reader's count; not re-run here |
| W2 | install `-Only`, settings unchanged | install.ps1:983-987 | OK, note | writes only on change; the precompact.js comment edit makes it DRIFT |
| W2 | cut-back bar | precompact-preserve.js:94-95; p-compact-C:12 | OK | "> 21,475 characters" |
| W3 | install rows :157, :290; `-Only` :70 | install.ps1 | OK | as cited; `-Only` filters manifest and register (:375-386) |
| W3 | red probe | git rev-list; origin/main reflog | OK | 0; 23:32:51 push; 33.17 h |
| W3 | fixture at most 300 B | design against the librarian clause | DOWNGRADED | the recorded wake's cwd adds ~250 B |
| W3 | settings sha changes by one row | install.ps1:986-996; settings.json | WRONG | whole-file `ConvertTo-Json` rewrite |
| W3 | body ledger absent | `ls C:/Consonance/data` | OK | absent; hook file absent |
| W3 | `-Only` matters | `install.ps1 -Check` | OK | DRIFT on other hooks; session-start, state, precompact, preserve ok |
| W4 | rows near :179, :308 | install.ps1:179, :308 | OK | the sources-gate rows |
| W4 | sources-gate shape | sources-gate.js:15-17, :31, :42-43, :361-402 | OK | ledger first, 8 s watchdog, light warns |
| W4 | scope by pane id | main.rs:7620, :1222 | OK | `cmd.env("CONSONANCE_PANE", &pane_id)` |
| W4 | red and green fixtures | gate:206-211, :313-323 | DOWNGRADED | both expect deny; always-deny passes; allow tests added |
| W4 | replay mode absent | `ls consonance/hooks` | OK | no `wake-gate.js` |
| W4 | sources-gate fired on the ring | sources-gate.jsonl | OK | 14:46:27.243Z warn, missing, 23, light |
| W4 | no rebuild; install on each machine; prove it | install.ps1; GATES.md exists | OK, note | the same settings rewrite as W3 |
| C3 | :13162 in :13138-13163; D098 tests; helpers :23627, :23631 | main.rs | OK | the existing tests pair prompts with replies |
| C3 | the red test closes the shortcut | design | DOWNGRADED | an `/effort`-only refusal passes; add the `/model` shape |
| C1 | push `--model` after :1141-1145 | main.rs:1141-1145 | OK | `--resume` / `--session-id`, no `--model` |
| §3 | no file edited by both panes | the two file lists | OK | H: hooks, GATES.md, install.ps1, precompact.js; R: main.rs, LIBRARIAN.md, launch.ps1, its test |
| §3 | O's times | cold:139-141; idle:130, :138 | OK | 17:04:17Z row, 17:04:20Z call; newest assistant row now 17:40:55Z |

**Tally (85 rows: 36 in section 1, 49 in the table):** OK 72, WRONG 4, DOWNGRADED 9, UNSUPPORTED 0.

**Probes run today, read-only, and what they print:**
- W5: `tmp_pack_Hl1ze7` 2,138,111 B (created 8:41:38, last written 08:41:57.664); `--disk-usage 0b85fead..8fd453c6`
  prints 90516246; `launch-pull.json` absent. Red for the cause.
- W1: the three greps on the live librarian file print 0, 0, 0. Red.
- W2: 1, 0, 0, 1. Red as probes only (a comment edit turns them).
- W3: count 0 beside a 33.17 h reflog age; `sessionstart-body.js` and its ledger absent. Red.
- W4: `wake-gate.js` absent; the existing gate's row at the ring says `warn`. The replay cannot run until the mode exists.

**The simplest pass that fixes nothing, per part, and whether the spec now closes it:**
- W5: a receipt that reports `fetch-timeout` (closed by the cause probe and test ii); a wait to the cap that ignores
  growth (closed only by the added test iv); a one-commit catch-up that never extends (closed only by the unpackLimit fix).
- W1: a stamp from local refs (closed by the impure-helper test); a tail inside the cap (the guard); a pin inside the cap
  (the filled-cap fixture); a one-entry tail (closed only by the added replay assertion); a launch-cached stamp (closed
  only by the correction above).
- W2: four "none in this window" lines (closed by the window-path count, forward-only); a probe confounded by user hooks
  (closed only by `--setting-sources`).
- W3: a ledger row with a wrong line (closed by the fixture); `%ct` dating (closed by the older commit date); a fixture
  on a non-librarian cwd that never tests the clause (closed only by the split bound).
- W4: always deny (closed only by the added allow tests); `cat > /dev/null` (closed); warn in light (his ruling).
- C3: refuse only `/effort` (closed only by the added `/model` case).

**A builder can start from as written:** W1 (b) and (c); W2 steps 0, 2 and 3; W4 after his light-mode ruling, adding the
two allow tests as it is built; C1 at his word.

**Need a change first:** W5 F1b and its tests (unpackLimit, a receipt-dir parameter, test iv); W1 (a), the stamp (read
HEAD and time at each write, skip empty pane briefs, an `_at(repo)` helper); W2 step 1, the probe
(`--setting-sources project,local`); W3 (the fixture's cwd and byte bound; a semantic settings check); C3 (a second,
`/model` case).

**Needs, confirmed at the primary:** a rebuild of `consonance/src-tauri` and one restart: W1, W2 step 3, C3, C1. A hook
install with `install.ps1 -Only`: W2 (no settings change; add `precompact.js` if its comment is edited), W3 and W4 (each
rewrites `settings.json` whole, with a `.bak`). Nothing for W5 (PowerShell at launch). His word: Lap W start; W4 refusing
in light; W2 wider than the librarian; L's mode; the `:9154` margin; C1; the encrypted transcripts in the repo. No part
compacts a seat.

### What I did not open (second reader)

- L's disk, config and transcripts.
- The topic files' own transcript passes: the W2 window-path count and the W4 base rate were not re-run.
- `state-sync.js:175-185`, `dirs.test.js`, `sessionstart-state.test.js`, `GATES.md` beyond its existence, `mcp.rs`,
  `trailer.rs`, `checkpoint.py` beyond its write lines.
- The Rust and node tests: none was built or run, so every "red today" for a test is read from code.
- How PowerShell 5.1 lays out `ConvertTo-Json` here: the rewrite is read from `install.ps1`; the layout change is inferred.
- Whether git's fetch reflog text carries `--progress`: inferred, not tried.
