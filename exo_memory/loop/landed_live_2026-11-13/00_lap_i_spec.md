# Lap I, the build spec: a landed change is live, or a seat is told it is not

Writer of the spec, an Opus reader on D, 2026-11-13, at lighthouse HEAD dce23a2b (main checkout). Read whole: the eight
reader files in this folder with their second readers and struck spans, `plan_vector_swarm_2026-11-13.md` from "SCORED AND
AIMED" to its end, `vector_swarm_2026-11-13/adversary_R02.md`, `hooks_drift_D_2026-11-13.md`, sections 0, 10 and 13 of
`room_better_2026-11-13/00_build_paths.md` with its second reader, `plan_room_stretch_2026-11-13.md`, and the Lap W spec's
W5, W3, W4 and section 3. Read-only except this file. Nothing installed, built, registered or committed.

Marks: `[read: <file>:<line>]` = a file in this folder, at that line, in its corrected form (struck text ignored; a second
reader's note wins over the line it corrects). `[read: <path>:<line>]` with a longer path = a file outside this folder that I
opened. `[inferred]` = mine. `[ours]` = a proposal. Digests carry their function. Short names below: `installer.md`,
`entries_on_d.md`, `prior_fixes.md`, `landing_path.md`, `running_binary.md`, `gate_modes.md`, `two_machines.md`,
`cost_of_drift.md` (all in this folder); `hooks_drift` = `loop/hooks_drift_D_2026-11-13.md`; `lap_w` =
`loop/wake_level2_2026-11-13/00_lap_w_spec.md`; `room_plan` = `loop/plan_room_stretch_2026-11-13.md`; `paths` =
`loop/room_better_2026-11-13/00_build_paths.md`.

**Primaries I opened myself, and why.** (1) `exo_memory/briefs/lighthouse_the_room.md:209`: the task quotes "change how often,
never delete" at :204 as the keeper's; three files here say :209 and the room's rule (`gate_modes.md:93-97`,
`cost_of_drift.md:263-266`, `prior_fixes.md:370-371`). Settled: it is at :209, given as the room's rule, after his words.
(2) `dev/shell/install.ps1` greps for `Lib =` and `.Hold`: `landing_path.md:276` and `installer.md:279-283` differ on which
rows are libraries. Settled: 7 Lib rows at :80, :81, :92, :118, :120, :135, :172 (second-reader-worker is :172); `Hold` is read
at :447 and set by no row. (3) The brief lines and the live instance intakes, because `gate_modes.md` first and second
readers disagree on which carriers hold the refusal text; my grep gives the counts in part I5. (4) `git diff --stat
main...lap-w-h-p`: whether Lap W's hook half is built (it is: 6 commits, 15 files, unmerged). (5) Four zero-count greps that
make the red checks exact: `CONSONANCE_APP_EXE` in `main.rs` 0; `consonance/tools/landed-live.js` absent; `landed-live` in
`push-gate.js` 0 and in `brief/BUILDING.md` 0 [read: my runs, 2026-11-13].

---

## 1. What this level changed

Against the room plan (`room_plan`: "Hygiene, small" :79-83, Lap C item 5 :62-63, Lap D :67-77) and `paths` sections 10
(:336-365) and 13 (:409-422).

| item (where) | verdict | how, and why | rests on |
|---|---|---|---|
| "Eight hook syncs on D that change nothing D does", one at a time, `-Only` + `-NoRegister` where unregistered, settings sha equal (room_plan:81-82) | **changed** | Seven of the eight now, one leaf per run, ALL with `-NoRegister` (the file-only form, settings never written). `push-gate.js` moves to after Lap W's merge, because branch `lap-w-h-p` changes it and the merge would make it DRIFT again; it is installed once, with Lap W's 10 MB rule. `userprompt_pulse.py` is added (file only; it is not run on D). Each sync gets its own red-to-green check, not only the settings sha. Part I6. | `two_machines.md:162-167`; `entries_on_d.md:101-110`, `:207-211`; `installer.md:94-98` |
| "`stop.js` stays" (room_plan:83) | **kept** | Left registered on D. `landed-live.js` prints it `EXCLUDED BUT LIVE` and does not fail on it. The delegated word covers leaving it, not deciding it. | `entries_on_d.md:115`, `:224-229`; `hooks_drift`:259-278 |
| "The three ABSENT hooks are not installed" (room_plan:83) | **changed** | `dispatch-gate.js` and `carrier-drift-watch.js` stay absent, but as named holds in the installer's data, each with a ruling pointer and an `until` date, honoured by the installer and read by `landed-live.js` (I7). `second-reader-note.js` becomes a keeper question (K2), not a flat no. | `prior_fixes.md:307-317`; `landing_path.md:263-268`; `entries_on_d.md:111-113`, `:155-157` |
| Lap C item 5: sync D's second-reader hook, "about 2.4 M tokens per ten days", his veto open (room_plan:62-63) | **kept, figures updated** | Still his question (K1). Now 268 `ok` model reads of pane rings, 2,799,638 tokens, 133 flagged, since 11-03 15:25Z (266 / 2,778,110 counted from the push); 0.89 M to 1.30 M Fable units, about 1% of one librarian day per day. Worker first; not tied to "the restart" (that condition already lapsed once). Its green check starts its window at the sync's `.bak` stamp. | `landing_path.md:185-188`; `cost_of_drift.md:199-210`, `:305-313`; `entries_on_d.md:104-105`, `:330-331` |
| Lap D items 1, 2, 4 (room_plan:69-77) | **kept** | Not this lap. | — |
| Lap D item 3: "fix 2c (landed, not installed)" (room_plan:74-75) | **changed** | On L, install it only as `-Only board-digest.js,blind.js` (L's blind.js lacks `sealedGate`). On D no install makes it live: board-digest.js is registered on no event there; registering it is K4. | `installer.md:105-119`; `two_machines.md:134-138`; `landing_path.md:143-153` |
| §10 smallest fix: "`-Only` one entry at a time, starting with second-reader.js, then second-reader-note.js" (paths:350) | **changed** | Order reversed: the behaviour-neutral syncs first, the second-reader pair only on K1, the note only on K2. | `entries_on_d.md:198-217`; `hooks_drift`:318-329 |
| §10: "teach -Check to print verdicts first" (paths:351) | **dropped** | The per-file verdicts already print first (lines 1-36); only the registration block sits after the 4,950 UNCLAIMED lines. The per-landing read is a new tool, not a -Check change. | `cost_of_drift.md:271-273` |
| §10: "…and to report repo-path registrations" (paths:351) | **changed** | Reported by `landed-live.js` as `RUNS FROM REPO` (ask-surface.js), not by -Check. | `landing_path.md:255`, `:270`; `installer.md:68-69` |
| §10 proving check: `grep -c relayed` on the installed second-reader.js returns 0 (paths:352-354) | **kept, extended** | Kept as K1's file check; the behaviour check is "first `skipped-class` row after the sync, and 0 `call_librarian` `ok` rows after it". | `cost_of_drift.md:305-313` |
| §10 "His call" on board-digest via `map/M.md:913` (paths:358-362) | **dropped** | WRONG at its primary (that line is L, 09-16). Replaced by K4 on its own evidence. | `paths`:359-362 (2nd reader) |
| §10 "Install only, between turns; never a bare installer run" (paths:355-356) | **kept** | Every install here is `-Only`, one leaf, between rings. | `two_machines.md:121-125` |
| §13 smallest fix: "one line in each brief that describes a refusal, naming the mode" (paths:416) | **changed** | Carriers widened: LIBRARIAN.md :113, :115, :133; COMMITTEE.md :172-174; BUILDING.md :232-233, :237-239; GATES.md :96-102, :316-317. The red check moves to the LIVE carriers, the instance `CLAUDE.md` files the app wrote at 08:42, matched with whitespace normalised. Part I5. | `gate_modes.md:14-17`, `:98-111`, `:255-262`, `:414-420` |
| §13 proving check: "LIBRARIAN.md does not name gates_mode at :113" (paths:417-418) | **changed** | Half of the old two-string check was already green (the GATES.md string breaks across two lines). New check: 9 stale sentences in 8 live intakes today, 0 after the rebuild and restart. | `gate_modes.md:257-262`; my grep (part I5) |
| §13 "Rebuild or install: brief text" (paths:419) | **changed** | A rebuild and a restart: seats read the copy beside the running exe, through the instance CLAUDE.md written at spawn. Rides Lap W's one restart. | `gate_modes.md:106-111`, `:263-264` |
| §13 the gates themselves: SOURCES and reply slot to the sender, a call_chair refusal (gate_modes P1, P2, P4) | **not taken here** | A gates lap, not a landed-is-live lap; listed in section 7. | `gate_modes.md:213-282` |
| `landed-live.js`, one read-only classifier run from the repo, never installed | **added** | The per-landing, per-machine read that -Check cannot give (always red; leaf-only; no Lib or require link). Part I1. | `landing_path.md:250-277`; `prior_fixes.md:282-306`; `installer.md:66-85` |
| whats-live's app rule by cargo's dep-info | **added** | Ends today's false RED on a MAP.md commit; names bundle files the build lacks. Part I2. | `running_binary.md:30-57`, `:172-183` |
| Three fields on Lap W's W3 body line: hooks, app, gates | **added** | The other machine and every waking seat are told at start, from the repo's rule, not an installed copy. Part I3. | `two_machines.md:304-334`; `running_binary.md:195-208`; `gate_modes.md:299-301` |
| `CONSONANCE_APP_EXE` set at each seat's spawn | **added** | Names the running exe exactly on every start path. Rides W1's rebuild. Part I4. | `running_binary.md:185-193` |
| LIVE-HERE in the landing hand-back and the all-clear | **added** | "installs" is a landing pane's job with no check behind it. Part I5. | `landing_path.md:39-46`, `:240-287`; `prior_fixes.md:247-248` |
| Holds and Lib `By` as installer data | **added** | "Deliberately not synced here" gets a name and an end date. Part I7. | `prior_fixes.md:261-263`, `:311-317`; `landing_path.md:263-268` |
| push-gate tells the pusher what the push leaves owed | **added** | The one act every landing ends in; the note goes to the sender, the one channel the record shows moving acts. Refusal on his word. Part I8. | `prior_fixes.md:319-326`, `:335-340`; `gate_modes.md:4-8`, `:127-131` |
| `-Only` refuses an unmet relative `require` | **added** | The L0020 / 11-13 board-digest-without-blind.js trap, in the data the installer already holds. Part I9. | `installer.md:246-264` with its 2nd reader `:253-258` |
| Installer receipt line (installer.md Part 1) | **not taken** | Its checks go green with a receipt nobody reads; `landed-live.js` derives the installed commit from history, and the body ledger gives time-to-live. Section 7. | `installer.md:312-319`, `:467-474` |
| A git-blob stamp on every ledger row (cost_of_drift §6) | **not taken** | Misses the recorded case (the worker writes the `ok` rows); the registered-entry byte compare covers more. | `cost_of_drift.md:281-287`, `:448-453` |
| A pulse clause in chain-status.js (landing_path §5) | **not taken** | Keyed on HEAD it nags; one shared state file lets one random seat consume it; its caller is itself an undeclared installed hook. W3's start-rate line carries it instead. | `landing_path.md:12-16`, `:302-307` |

---

## 2. The lap, part by part, in build order

Order [ours]: make drift VISIBLE (I1 to I5), then REMOVE today's drift on D entry by entry (I6, I7), then STOP IT RETURNING
(I8, I9). I7 sits between: it removes the false red of ruled absences and also holds against a bare run.

Common to every part. Tier: install state, gates and stored settings are "prove it" (test first, the mutation runs for the
file, the full suite at landing) [read: `running_binary.md:216`; `installer.md:180-181`]. A run of 3 test files or fewer needs no
heavy-run lock [read: `installer.md:327-329`]. Line numbers are at HEAD dce23a2b; `dev/shell/install.ps1` and
`consonance/hooks/push-gate.js` will shift when `lap-w-h-p` merges (+12 and ~~+35~~ lines) [read: my diff --stat]: re-find each
place by the quoted text. [2nd reader: WRONG for push-gate.js: `git diff --numstat main...lap-w-h-p` gives install.ps1 +12 -0
and push-gate.js +30 -5 (net +25); the stat's "35" is lines touched. Re-finding by quoted text, as said, is unaffected.]

### I1. `consonance/tools/landed-live.js`: one read of what a seat on this machine runs, against the repo

**Files.** New `consonance/tools/landed-live.js`, `consonance/tools/landed-live.test.js`,
`consonance/tools/landed-live.mutants.js`. It reads `dev/shell/install.ps1`, `~/.claude/settings.json`, `~/.consonance.json`
and the installed tree; it writes nothing. It lives in `tools/`, not `hooks/`, so -Check does not audit it as a hook
[read: `landing_path.md:376`]. It is never installed, so it cannot drift [read: `prior_fixes.md:282-284`].

**The change, in words** [ours, merging `landing_path.md:250-277`, `prior_fixes.md:282-306` and `installer.md:266-284`, with
every second-reader correction applied]:
- Parse the `$files` and `$register` blocks of the repo's `install.ps1` by whole lines inside each block, skipping lines
  whose first non-space is `#` (the commented `jev-flags.js` row would match otherwise) [read: `installer.md:268-272`]. Read
  `From`, `To`, `Lib`, `By`, `Hold`, `HoldOn`, `HoldUntil` from `$files`; `Event`, `Rel`, `Matcher`, `Excluded`, `LiveOn`,
  `Conflicts` from `$register`. A parse of 0 rows in either block prints `not readable (install.ps1 changed shape)`, exit 2.
  [2nd reader: DOWNGRADED, "by whole lines" loses keys. Nine `$register` rows span two lines, with the key on the second:
  `Excluded` for stop.js (`dev/shell/install.ps1:256-257`), `Matcher` for dispatch-gate.js (`:293-294`), `Conflicts` for
  userprompt_pulse.py (`:223-224`), `Matcher` and `Timeout` for second-reader-note.js (`:322-323`). A per-line parse reads
  stop.js as not Excluded. Parse each `@{ ... }` table to its closing `}` after dropping `#` lines; fixture D's
  `EXCLUDED BUT LIVE stop.js` row catches the per-line form, so keep it.]
- "Registered here" means: a settings.json command whose LAST quoted path equals `<USERPROFILE>\.claude\shell\<To>`,
  case-insensitive, the exact path, never the leaf [read: `installer.md:60-61`, `:68`; `landing_path.md:124-126`]. A Lib row
  is registered here when any hook its `By` names is.
- Bytes: the installed copy's git-blob, computed in node as `sha1("blob " + len + "\0" + bytes)` after CRLF to LF (the repo
  pins `eol=lf`), against HEAD's blob from ONE `git ls-tree -r HEAD -- dev/shell consonance/hooks` call. A test pins the node
  blob equal to `git hash-object --path=<From> <installed>` over every installed manifest file on the test machine
  [read: `prior_fixes.md:286-288`; `two_machines.md:113-115`].
- One state per entry, fixed words. Fails (exit 1) on the first group only:
  - fail: `OWED` (registered here, or Lib with a registered `By`, and the blob differs from HEAD's, or a literal relative
    `require` target that is another `$files` row differs); `NEW` (a `$register` row, not Excluded, file absent here, no hold
    here); `HOLD EXPIRED`; `LOCAL EDIT` (installed bytes match no commit of `From`; history is read only for non-LIVE entries).
  - print, never fail: `LIVE`; `NOT RUN HERE` (no settings command at the installed path and no live `By`: board-digest.js,
    userprompt_pulse.py and l2-overseer-worker.js on D); `HELD <ruling> until <date>`; `EXCLUDED <ruling>`; `EXCLUDED BUT LIVE
    <ruling>` (stop.js on D); `RUNS FROM REPO` (a command whose path is inside `room_path`: ask-surface.js on D);
    `WIRED ELSEWHERE <path>`.
  - Until I7 adds `By`, a Lib row with no `By` prints `LIB (no By)` and does not fail [ours].
    [2nd reader: WRONG against this spec's own checks. I1 lands before I7 (I7 waits for the merge), and the real
    install.ps1 has `Lib = $true` and no `By` on all 7 Lib rows (`:80`, `:81`, `:92`, `:118`, `:120`, `:135`, `:172`). So
    fixture A's `OWED second-reader-worker.js (By)`, the D-disk line "naming the three second-reader files" below and I3's
    `hooks 10 not live` (7 OWED + 3 NEW) all need `By`. Fix: every fixture writes its own install.ps1 with `By` on the
    Lib rows it uses, and the D-disk proof before I7 expects `LIB (no By) second-reader-worker.js` and exit 1 on the
    other two.]
- Every OWED line prints the exact install, with required neighbours: `install.ps1 -NoRegister -Only board-digest.js,blind.js`
  [read: `landing_path.md:261`; `prior_fixes.md:290-293`].
- Modes. `--all` (default; exit 0 unless unreadable). `--range A..B`: scope = `$files` rows whose `From` changed in A..B, plus
  their `By` neighbours and literal `require` targets; also, when A..B touches an exe input or a bundled brief, one `APP` line
  from I2's rule and one `BUNDLE` line from open-items' compare; exit 1 on any failing state in scope. `--explain`: adds
  `installed = <commit> (<n> behind)` per non-LIVE entry, oldest-first history match (mind the `--find-object` trap: the
  first hit is the commit that REMOVED the blob) [read: `installer.md:175-176`]. `--summary`: the I3 field text. `--json`.
- The last line, always: `LIVE-HERE <machine> HEAD <sha8>[ tree +<n>][ origin/main +<n> as of last fetch]: <live>/<run here>
  live; owed <leaves>; new <leaves>; held <leaves>`. "tree +n" is `git status --porcelain -- dev/shell consonance/hooks`; the
  origin count is local refs only, no fetch [read: `two_machines.md:619-626`].
- Exports `classify(opts)`, `summary(opts)`, `scope(range, opts)`, so I3 and I8 require one rule.

**Failing check on recorded cases** (fixtures in `landed-live.test.js`: temp repo and temp USERPROFILE under `scratch.js`
`mkdtemp`, `CONSONANCE_MACHINE` pinned; installed bytes from `git show <commit>:<path>` of the real history):
- A, L0613 / L1085, D635's push 21819167..fe69a9fc [read: `prior_fixes.md:343-347`]: installed second-reader.js = aadcc10a's
  blob (git-blob abcbff60), worker = aadcc10a's (63ec0296), note absent; HEAD holds fe69a9fc's three (2d161fbd, b79bbafe,
  3427cbbd); settings register second-reader.js on PreToolUse at the installed path. Expect `OWED second-reader.js`, `OWED
  second-reader-worker.js` (By), `NEW second-reader-note.js`, exit 1.
- What it prints today: the tool is absent (`ls consonance/tools/landed-live.js`: no such file) [read: my run]. The comparison
  it makes, by hand on D's real disk, is red for the recorded reason: `git hash-object --path` of the installed
  second-reader.js gives abcbff60, `git rev-parse fe69a9fc:consonance/hooks/second-reader.js` gives 2d161fbd [read:
  `prior_fixes.md:408`; `landing_path.md:341-347` with its 2nd reader OK]. [2nd reader: OK, re-run at HEAD 2c40640b:
  installed abcbff60, 63ec0296, note absent; fe69a9fc's 2d161fbd, b79bbafe, 3427cbbd; aadcc10a's abcbff60, 63ec0296. Both
  recorded ranges touch the same three hook sources; 21819167..fe69a9fc also touches main.rs (82da03fc's does not), so
  its `--range` output carries an APP line too.]
- B, L1079 / L1087 on L, 11-13: installed board-digest.js = 2c7b3872's blob (142a6541), installed blind.js = `1c0acf7f^`'s
  (no `sealedGate`, the export list B read on L); HEAD = b0be06f0; settings register board-digest.js (L's shape). Expect
  `OWED board-digest.js` naming blind.js and the line `-Only board-digest.js,blind.js`, exit 1. Edge B2: board-digest.js
  synced alone, blind.js still old: still OWED (the L0020 trap). Control: both at HEAD: LIVE, exit 0 [read:
  `landing_path.md:325-339`]. [2nd reader: blobs OK (`2c7b3872` board-digest 142a6541; `1c0acf7f^` and `5973d89b` give
  the same blind.js blob, a6a9ed54, 0 `sealedGate`, exports as B read on L). DOWNGRADED as a statement about L: L's
  installed board-digest.js blob is not on disk; the hand-back says only that it "predates the sealed gate"
  (`handback/p-l198-403-stall-B_2026-11-13.md:82`). 2c7b3872's blob is a fixture choice, not L's recorded copy.]
- C, the false green the second readers found, D's real shape: same files, settings WITHOUT board-digest.js. Expect `NOT RUN
  HERE`, exit 0, before and after a sync; never `LIVE` [read: `prior_fixes.md:349-355`, `:466-471`].
- D, ruled states that must not fail: userprompt_pulse.py (not registered, Conflicts) `NOT RUN HERE`; l2-overseer-worker.js
  (By an Excluded, unregistered hook) `NOT RUN HERE`; stop.js `EXCLUDED BUT LIVE`; ask-surface.js `RUNS FROM REPO`
  [read: `prior_fixes.md:297-302`; `landing_path.md:514-517`].
- E, the endless hold: second-reader.js held "only at the restart" from 11-03 [read: `prior_fixes.md:311-317`]: `HoldUntil
  2026-11-17`, now 2026-11-13: `HELD`, exit 0; now 2026-11-18: `HOLD EXPIRED`, exit 1. [2nd reader: needs a clock seam
  (an env var, as W3's `BODY_NOW`), which the spec does not name; install.ps1 has none either (its only `Get-Date` calls
  are the two `.bak` stamps, `:461`, `:986`), so I7's expired row needs one too.]
- Edges, one test each: empty range (exit 0, "nothing in range"); settings.json missing or unparseable (`UNKNOWN`, exit 2, no
  guess); CRLF-only difference (`LIVE`); bytes matching no commit (`LOCAL EDIT`); install.ps1 with no `$files` block (exit 2).
- Pin to the instrument: one test runs `install.ps1 -Check` on the fixture (install.ps1 copied into the temp repo, since
  `$repo` comes from the script's own path; `USERPROFILE` and `CONSONANCE_MACHINE` set) and asserts the same per-file
  ok/DRIFT/ABSENT verdicts, line endings aside [read: `two_machines.md:469-475`, `:602-606`].
- Mutants (`landed-live.mutants.js`, each asserted applied): ABSENT read as LIVE; leaf instead of exact path; `By` ignored;
  require neighbours skipped; `HoldUntil` ignored; CRLF normalisation dropped.

**What proves it afterwards, on D's real disk** [ours]: `node consonance/tools/landed-live.js --range 82da03fc..fe69a9fc`
exits 1 naming the three second-reader files (until K1/K2); `--range a3cefeb9^..b0be06f0` prints `NOT RUN HERE board-digest.js`
and exits 0, which is D's true state [read: `landing_path.md:330`]; `--all` agrees with a bare -Check's file verdicts
(23 ok, 10 DRIFT, 3 ABSENT today) and splits the 10 DRIFT into 6 registered, 2 not run here, 2 Lib [read:
`landing_path.md:274-277`, its 2nd reader row 238 OK]. [2nd reader: DOWNGRADED for the first range: "naming the three"
holds only once I7's `By` is on main (see the note on `LIB (no By)`). The second range touches only board-digest.js among
hook sources (`git diff --name-only a3cefeb9^ b0be06f0`: board-digest.js, its test, hooks/README.md), so exit 0 holds.
My -Check now, at HEAD 2c40640b: 23 ok, 10 DRIFT, 3 ABSENT, exit 1, 5,031 lines, unchanged.]

**Needs.** No rebuild, no hook install, no restart, no keeper word. Runs from the repo on both machines; L gets it by pull.

**Cost.** Per call about 18 ms in-process for the hashing and parsing plus one `git ls-tree` spawn; 128 to 151 ms wall
measured for the prototype of the same reads [read: `two_machines.md:14-15`, `:581`]. [2nd reader: DOWNGRADED: that
prototype (`hooks_receipt_proto.js`, `two_machines.md:346-348`) hashes raw sha256 and spawns no git; "the same reads" is
loose. The `git ls-tree` spawn and any `--find-object` walk are untimed.] `--range` adds one `git diff
--name-only` and a history walk only for non-LIVE entries [inferred]. 0 bytes per turn: nothing runs it per turn.

**What could go wrong.** The parse drifts from install.ps1's shape: the 0-rows exit and the -Check agreement test catch it.
HEAD is a branch or mid-merge: the last line prints HEAD and `tree +n`. A machine that has not pulled reads in step for an
unpulled fix: the last line prints `origin/main +n` [read: `two_machines.md:619-626`]. It fires on harmless drift (the
data-dir fallback in five hooks) exactly as on costly drift [read: `cost_of_drift.md:436-439`]; that is true state, and I6
clears it the same day [inferred].

### I2. whats-live.js judges the app by cargo's dep-info, not by "anything under src"

**Files.** `consonance/tools/whats-live.js` (the RED at :64-68 and :97-99; keep the rebuilt-not-restarted rule :100-102 and
the dreams rows); `consonance/tools/whats-live.test.js`; `consonance/tools/open-items.js` gains a `module.exports` for
`bundleResources` (:132), behind `require.main === module` for its run [read: `running_binary.md:172-183`, `:328`].
[2nd reader: OK, and larger than it reads: open-items.js runs its whole body at top level and ends in `process.exit(0)`
(the file's last line, 539 lines), so a bare `require` from whats-live.js would run every check and kill the caller. The
guard wraps the body; whats-live.js itself already has exports and the guard (`:161`, `:163`).]

**The change, in words** [ours, from `running_binary.md:172-183` with its 2nd reader]: a pure
`appStaleness({exe, depinfoText, stat, repoRoot, bundle})`. `inputsNewer` = every path in `<exe dir>/consonance.d` (the line
after `consonance.exe:`) plus `Cargo.toml` and `Cargo.lock` (cargo fingerprints them; they are not in the dep-info), newer than
the exe. `bundleNew` = files matched by a `tauri.conf.json` resource glob and absent from the dep-info list. RED only on
`inputsNewer`; `bundleNew` prints on its own non-red line. No dep-info: `inputs not readable` and today's src rule as the
fallback, never a silent green. Exe path: `CONSONANCE_APP_EXE` when set (I4), else the default release path, printed with
`(assumed path)`.

**Failing check on the recorded case.** `node consonance/tools/whats-live.js; echo $?` prints today "RED: the running release
binary predates 53bac6a0 ... that commit is NOT live" and exit 1; 53bac6a0 changes only `src/MAP.md`, which is not one of the
116 dep-info inputs, and 0 of the 116 are newer than the exe [read: `running_binary.md:30-44`, its 2nd reader rows 293, 296].
[2nd reader: OK, re-run at HEAD 2c40640b: `whats-live.js` exit 1 with that RED line; my stat pass over
`target/release/consonance.d`: 116 inputs, 0 newer, 0 missing; Cargo.toml and Cargo.lock older and not in the dep-info;
research 12 in the dep-info, 14 in the repo, the two named. Weak spot: a rule of "src/*.rs plus brief/*.md" passes
fixtures A and B and the Cargo.lock edge. Add one edge with a `ui/` file or `build.rs` newer: RED.]
After: exit 0, and one line naming the two `research/*_2026-11-13.md` files not in the bundle (until a build reruns the copy).
Unit fixtures: (A) the 11-13 facts expect `inputsNewer = []`, `bundleNew` = the two names; (B) the 11-03 true-stale case expects
`main.rs`, `mcp.rs`, `brief/BUILDING.md`, `brief/COMMITTEE.md` in `inputsNewer`; edges: no dep-info gives `readable: false`,
`Cargo.lock` newer gives RED [read: `running_binary.md:232-240`].

**What proves it afterwards.** The run on D exits 0 today's way; after Lap W's rebuild it still exits 0 and the bundle line
is gone (the rebuild reruns the copy, since W2 touches LIBRARIAN.md) [read: `running_binary.md:87-91`; inferred for the
rebuild].

**Needs.** None: a tool run from the repo. Tier: check it (it reports, it gates nothing) [read: `running_binary.md:270`].

**Cost.** One 13 KB read and about 120 stats per call [read: `running_binary.md:206`].

**What could go wrong.** mtime is a proxy for cargo's own fingerprint stamp; a file saved during a build can read current
[read: `running_binary.md:47-51`]. A branch switch or launch.ps1's park rewrites mtimes and reads STALE with no content change
[read: `running_binary.md:349-353`]. Both show as a STALE line that a `git status` contradicts.

### I3. Lap W's W3 body line: one more field (an addition, not a redesign)

**Files.** `consonance/hooks/sessionstart-body.js` and `.test.js`, today on `lap-w-h-p` (pane H's files) [read:
`two_machines.md:306-316`]. Built by pane H on its branch before Lap W lands, or on main right after it lands; nobody else
edits the file.

**The change, in words** [ours]: after `· source`, one field bounded at 90 B on its own (W3's 300 B bound stays on the body
part, as W3's second reader already split the librarian clause from it) [read: `lap_w`:351-353]:
`· landed: hooks <x> not live[ (<h> held)] · app <current|STALE <n>|not readable> · gates <light|strict>[, wake refuses]`.
- `hooks` = `require(<room_path>/consonance/tools/landed-live.js).summary()`: `x` counts OWED, NEW, HOLD EXPIRED and LOCAL
  EDIT; `h` counts HELD. Read from the REPO by `room_path`, so a rule change needs no reinstall [read: `running_binary.md:202-203`;
  `two_machines.md:352-353`].
- `app` = I2's `appStaleness` on `CONSONANCE_APP_EXE`, else the default path.
- `gates` = `gates_mode` by session-start.js's rule (anything but "light" is strict, a missing key prints `(default)`); on D
  add `, wake refuses`, since wake-gate denies there whatever the mode [read: `two_machines.md:360-361`, `:627-629`].
  [2nd reader: DOWNGRADED, it fires wrongly. `wake-gate.js:207` on `lap-w-h-p` (`const refuses = machine === 'D'`) holds
  only where the hook is installed and registered, and ruling 2 gates the librarian seat only
  (`plan_room_stretch_2026-11-13.md:102`). Printed "on D" unconditionally, the field claims a refusal before W4's install
  and to every pane: the landed-not-live fault inside its own receipt. Print it only when `classify()` reads wake-gate.js
  LIVE here and the cwd is the librarian's.]
- Each part in its own try, failing to `?` with a reason of at most 20 B; the start is never blocked.
- The body ledger row gains `live: {not_live: [<leaf>:<state>], held: [<leaf>], app_state, app_inputs_newer, gates}`. The
  NAMES are what make the lap's falsifier scorable as time-to-live [read: `two_machines.md:614-618`].
- Measured examples [read: my `Buffer.byteLength`]: `· landed: hooks 10 not live · app current · gates light` 58 B (D today,
  before any sync, without holds); `· landed: hooks 2 not live (2 held) · app current · gates light, wake refuses` 80 B.
  [2nd reader: OK, 58 B and 80 B (`Buffer.byteLength`). The all-fail form, three `?` with 20 B reasons, can pass 90 B:
  state the truncation.]

**Failing check on the recorded case.** On the record, no fixture: the librarian's transcript on D holds 69 SessionStart hook
outputs from 2026-11-01T07:04:42Z to 2026-11-13T18:54:20Z, and 0 of them name drift, absent, gates, `install.ps1` or
`consonance.exe` [read: `two_machines.md:436-442`, 2nd reader row OK]. The branch's sessionstart-body.js has 0 such fields
[read: `two_machines.md:315-316`]. Fixture (in `sessionstart-body.test.js`, on the branch, so it is red for the reason and not
for a missing module): D's 11-13 state, the ten DRIFT files written as their recorded commits' blobs, the three ABSENT left
out, the 19 recorded commands, `gates_mode: "light"`, install.ps1 at a pinned sha. Expect `hooks 10 not live` and the ledger's
ten names; today the field is absent [read: `two_machines.md:454-475`; the counts follow I1's classes, 7 OWED + 3 NEW,
inferred from `entries_on_d.md:101-113`]. Edges: no room_path; manifest 0 rows; settings missing; exe missing; the 11-13
bundle with 2 research files absent (2, not 1) [read: `two_machines.md:476-485` with 2nd reader]. Mutation: three anchors
added to the branch's `lapw-hooks.mutants.js` [read: `two_machines.md:486-488`]. [2nd reader: two corrections. (1) "10"
needs `By`: with the pinned install.ps1 at a sha before I7, the worker reads `LIB (no By)` and the count is 9; pin a sha
that carries I7's `By`. (2) `lapw-hooks.mutants.js` is pane H's branch file (`git diff --stat main...lap-w-h-p`) and is in
no row of section 3's table: name it in the after-merge row. Probes run: the branch body hook has 0 hits for drift, absent,
gates, install.ps1, consonance.exe and landed (grep -ci). The 69-output transcript pass was NOT re-run by me (905 MB; the
CPU rule); two readers re-derived it.]

**What proves it afterwards.** At the first start after W3's install on each machine, the body row's `live.not_live` equals
`landed-live.js --all`'s failing list, read by a seat that is not the lap's author. On L that row is the first record of L's
install state written by L at every start [read: `two_machines.md:490-496`].

**Needs.** Rides W3's own `-Only sessionstart-body.js` on D and on L, and the restart that picks up its new SessionStart
registration [read: `two_machines.md:418-427`]. If Lap W installs W3 before this field lands, one more
`-NoRegister -Only sessionstart-body.js` per machine, file only [inferred]. Needs I1 and I2 on main by then, or the field
prints `?`.

**Cost.** At most 90 B, about 31 tokens at 2.89 B a token, per start per seat; about 208 starts in 13 November days, so
about 19 KB over those days for all seats [read: `two_machines.md:390-393` for the rates; inferred for the total]. About
50 to 150 ms more per start, inside W3's 6 s watchdog [read: `two_machines.md:312-313`; inferred for the time].

**What could go wrong.** A count printed and not read: the state block was emitted 163 times and acted on 0 [read:
`two_machines.md:610-614`]. A line at every start makes "told" true by construction, so the plan's falsifier could never fire;
section 6 scores time-to-live instead [read: `two_machines.md:614-618`]. Where the body hook is not installed there is no line,
which looks like no news; W3's own pairing check (a body row within 5 s of each state row) is the guard, run on each machine
[read: `two_machines.md:630-632`].

### I4. The app names its exe to every seat (Rust; rides W1's rebuild)

**Files.** `consonance/src-tauri/src/main.rs`, in `spawn_claude_pane` beside `cmd.env("CONSONANCE_PANE", …)` at :1222-1223,
and a source-sweep test like the one at :24418 that already sweeps that body [read: `running_binary.md:185-193`, its 2nd
reader `:345-348`]. Pane R's file in Lap W [read: `lap_w`:485]: handed to R as an addition.

**The change, in words** [ours]: set `CONSONANCE_APP_EXE` to `std::env::current_exe()`, read once per process. Every seat is
spawned by the app whatever started the app, so this covers all five start paths [read: `running_binary.md:120-131`, `:190`].
The hook reads the exe's mtime itself, so a stale env value cannot fake an age.

**Failing check.** `grep -c CONSONANCE_APP_EXE consonance/src-tauri/src/main.rs` prints 0 today [read: my run]; the sweep
test is red until the line exists. On the record after the restart: every body row from a Consonance-spawned seat has
`app_state` in {current, STALE}; a `not readable` row from such a seat counts red [read: `running_binary.md:253-257`].

**Needs.** The rebuild and the one restart Lap W already makes. Until then I3 prints the app with `(assumed path)`. No
install. Tier: check it.

**Cost.** 0 bytes of context; one env var per spawn.

**What could go wrong.** The env reaches no build because the line was dropped in a merge: the sweep test pins it.
[2nd reader: confirmed at HEAD: `grep -c CONSONANCE_APP_EXE main.rs` 0; `cmd.env("CONSONANCE_PANE", &pane_id)` at :1222;
the sweep at :24418 is `body_of(&src(), "fn spawn_claude_pane(")`. Weak spot: a line setting any value passes the sweep,
and a wrong but existing path (the debug exe) still gives `app_state` current or STALE. Have the sweep require
`current_exe`, and have the first body row's exe path checked once against the running process's path.]

### I5. The briefs: LIVE-HERE in every landing, and the gate sentences say the mode they describe

**Files.** `consonance/src-tauri/brief/BUILDING.md` (:52-55 "Landings go to a pane", :123-124 the all-clear, :231-233 the
trailer, :237-239 SOURCES); `consonance/src-tauri/brief/COMMITTEE.md` (:143-149 the hand-back, :172-174 SOURCES) [read: my
`sed`]; `consonance/src-tauri/brief/LIBRARIAN.md` :113, :115, :133 (pane R's file: the three sentences handed to R);
`consonance/GATES.md` :96-102, ~~:316-317~~ (pane H's file: after `lap-w-h-p` lands) [read: `gate_modes.md:98-105`]. A new
`consonance/tools/brief-carriers.test.js`. [2nd reader: the "still refuses" sentence is at GATES.md:317-318 (the paragraph
:315-318); the other cited lines hold at HEAD as quoted.]

**The change, in words** [ours]:
- BUILDING.md, the landing: a landing that changes a file `landed-live.js` scopes pastes `node consonance/tools/landed-live.js
  --range <base>..<landed sha>` under `checked:` in its hand-back and puts the `LIVE-HERE` line in its ring. An `OWED` entry
  already registered and not held is installed in the same landing, one `-NoRegister -Only` run with the four checks, and the
  tool re-run and pasted. `NEW`, a hold, or a sync under an open ruling goes to the librarian [read: `landing_path.md:279-287`].
- BUILDING.md, the all-clear: it quotes the `LIVE-HERE` line; with a red it reads "landed and pushed; NOT live on <machine>:
  <items>", never "landed" alone [read: `landing_path.md:286-287`].
- The gate sentences: each "refuses" names the mode. In light: the trailer warns and its note returns to the sender; SOURCES
  writes a warn row and prints nothing; the reply slot shows the person a screen message. LIBRARIAN.md :115 is reworded:
  pane rings carry no bracketed note since D633 [read: `gate_modes.md:36-47`, `:249-254`].

**Failing check on the recorded case.** The live carriers, read-only: `grep -c` over `C:/Consonance/instances/*/CLAUDE.md`
(written by the app at 08:42 today) for "Until the keeper switches the gates", "sources-gate.js` refuses" and "refuses a
`chair_inject` without": librarian 1, main 2, six `sibling-*` intakes 1 each, 9 in 8 files [read: my grep; `gate_modes.md:418-420`
counted seven panes]. After the rebuild and restart: 0. `brief-carriers.test.js` asserts, with whitespace normalised, none of
those strings under `brief/` and in GATES.md, and that BUILDING.md names `landed-live.js --range`; today it is red on
LIBRARIAN.md, COMMITTEE.md and BUILDING.md, and `grep -c landed-live` on BUILDING.md is 0 [read: my runs].
[2nd reader: the instance count re-derives: librarian 1, main 2, six `sibling-*` 1 each, 9 in 8 files (literal and
whitespace-normalised agree). DOWNGRADED as a check: (1) its GATES.md half can never be red: the three strings occur 0 times
in GATES.md today; GATES.md's stale text is "It still refuses an item nothing in the turn touched" (normalised count 1) and
"no setting: turning it off" (1). (2) It does not cover LIBRARIAN.md:133 ("refuses a collation without it", 1 in the
brief and 1 in the librarian intake) or :115 ("with a bracketed note", 1 and 1), both named in the change, so a builder
who fixes :113 alone leaves two stale sentences green. Add those four strings. (3) The test is red until pane R's
LIBRARIAN.md lines and the after-merge GATES.md lines land; say so, as Lap W does for its bullets test.]

**What proves it afterwards.** The instance grep reads 0 after Lap W's restart. The first landing after it carries a
`LIVE-HERE` line in its hand-back, read by the librarian.

**Needs.** A rebuild and a restart to reach seats (the bundled copy and the instance CLAUDE.md written at spawn) [read:
`gate_modes.md:106-111`]: rides Lap W's, so it must be on main before that build. GATES.md is read in the repo: a pull is enough.

**Cost.** About 6 lines of about 120 B in the intakes, about 0.7 KB, about 250 tokens per pane intake [inferred].

**What could go wrong.** The LIVE-HERE line is a cue, and the record predicts cues lapse; D132 told "NOT live on D until someone
runs -Only" on 09-24 and the copy was still stale 50 days later [read: `landing_path.md:367-370`]. I3 and I8 back it, and
section 6 adds an age bound.

### I6. D's drift today, entry by entry

**Who and when.** A landing pane (installs are its job) [read: `landing_path.md:39-40`], on D, between rings, one leaf per
run, in this order. Before each: `node --test` on that hook's own test file at main (3 files or fewer per run). Each run:
`powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -NoRegister -Only <leaf>`. `-NoRegister`
exits before the settings step, so `settings.json` is not written [read: `installer.md:94-98`; `entries_on_d.md:198-205`].
After each: the run prints `synced <path>`; a `.bak-<stamp>` sits beside the file (the rollback is copying it back); a bare
-Check shows that entry `ok` and one DRIFT fewer; settings.json sha256 4266711b… and 4,942 B unchanged [read:
`hooks_drift`:306-313].

| # | leaf | state on D | red today → green after | rests on |
|---|---|---|---|---|
| 1 | `l2-overseer-worker.js` | DRIFT, dormant | `grep -c "carries no information"` on the installed file 0 → 1 | `entries_on_d.md:101` |
| 2 | `board-digest.js` | DRIFT, not registered | `grep -c sealedGate` 0 → 2; landed-live still `NOT RUN HERE` (fix 2c does not run on D) | `entries_on_d.md:103` with 2nd reader |
| 3 | `userprompt_pulse.py` | DRIFT, not run on D | `grep -c D454` 0 → 1 | `entries_on_d.md:102` |
| 4 | `second-reader-worker.js` | DRIFT, live (spawned) | rows with `toolUseId` 0 of 4,024 → the next `ok` row has it | `entries_on_d.md:105` |
| 5 | `ask-ending.js` | DRIFT, live on Stop | git-blob 05e6b613 → f66ef873; `ask-ending.jsonl` keeps growing | `entries_on_d.md:109` |
| 6 | `release-chime.js` | DRIFT, live | `grep -c defaultRepos` 0 → 3 | `entries_on_d.md:110` with 2nd reader |
| 7 | `delete-gate.js` | DRIFT, live, can deny | git-blob 50c5f477 → 4b8a60ce; no "PreToolUse:Bash hook error" on the next shell call | `entries_on_d.md:108`; `hooks_drift`:325 |
| 8 | `sources-gate.js` | DRIFT, live on rings | git-blob 198710bb → 56f28cf7; the next ring is delivered with its row and no gate error in `reply-slot.jsonl` | `entries_on_d.md:106`; `hooks_drift`:327 |
| 9 | `push-gate.js` | DRIFT | NOT NOW: after `lap-w-h-p` merges, once, carrying ruling 6 and I8 | `two_machines.md:164-167` |
| 10 | `second-reader.js` | DRIFT, live | ONLY on K1, after #4: `grep -c relayed` 0 → 1; the first `skipped-class` row after the `.bak` stamp; 0 `call_librarian` `ok` rows after it | `cost_of_drift.md:305-313`; `paths`:352-354 |
| 11 | `second-reader-note.js` | ABSENT | ONLY on K2, after #4 and #10, with `-Only` (it must register); semantic settings diff, one added PostToolUse group; picked up at Lap W's restart; `note-shown` rows 0 → >0 | `entries_on_d.md:113`, `:215-217`; `two_machines.md:124-127` |
| 12, 13 | `dispatch-gate.js`, `carrier-drift-watch.js` | ABSENT | not installed; held as data in I7 (K3) | `entries_on_d.md:111-112` |
| — | `userprompt-submit.js`, `stop.js`, `ask-surface.js` | ok / ok / repo path | nothing to sync; registration questions only (section 5) | `entries_on_d.md:114-115`; `cost_of_drift.md:260` |

**Failing check for the part, on the recorded state.** A bare -Check on D prints 10 DRIFT today [read: `entries_on_d.md:4-5`];
after #1 to #8 it prints 2 DRIFT (second-reader.js, push-gate.js) and the same 3 ABSENT and registration block [inferred from
the table]. After I1 lands, `landed-live.js --all` on D lists exactly the K-gated and held entries as not live.
[2nd reader: every row's red probe re-run at HEAD 2c40640b, all red for the reason given: `carries no information` 0/1;
`sealedGate` 0/2; `D454` 0/1; `toolUseId` 0 of 4,026 ledger rows (`skipped-class` 0); ask-ending 05e6b613 vs f66ef873;
`defaultRepos` 0/3; delete-gate 50c5f477 vs 4b8a60ce; sources-gate 198710bb vs 56f28cf7; push-gate 10400035 vs
5e28e575; `relayed` 0/1; settings.json 4,942 B, sha256 4266711b35be030e, 19 hooks. Rows 5, 7 and 8 prove the copy only, as
they must for a sync that changes nothing on D.]

**Needs.** Hook installs on D only, file only. No rebuild, no restart, no keeper word for #1 to #8: each is a committed copy
whose only change on D is a data-dir fallback, a default list or an added field [read: `entries_on_d.md:101-110`;
`cost_of_drift.md:186-188`]. Machine L: not this table (section 4). [2nd reader: DOWNGRADED wording: #1 changes a sentence
in the judge's prompt and #2 brings four commits of behaviour (`hooks_drift_D_2026-11-13.md:62-64`, `:86-91`); neither
runs on D (no registration), which is why no word is needed. And #7 and #8 can deny on every shell call or ring: "prove
it" by `~/.claude/CLAUDE.md`, as `entries_on_d.md:207-211` notes; the per-run test and the `.bak` already meet it.]

**Cost.** 0 per turn after; about 4 s per -Check, nine checks [read: `two_machines.md:26-27`].

**What could go wrong.** A sync of #8 mid-ring errs that ring: run between rings. #7 or #8 breaks every shell call or ring:
visible at the next call; copy the `.bak` back. The record predicts this sync decays at the next hook commit [read:
`prior_fixes.md:237-238`]: the first such commit is Lap W's merge (push-gate.js, precompact-preserve.js, precompact.js) [read:
`two_machines.md:162-167`], which is the first landing the lap's falsifier scores.

### I7. Holds and library links as installer data, honoured by the installer

**Files.** `dev/shell/install.ps1` (pane H's file in Lap W: after `lap-w-h-p` merges): the 7 Lib rows at :80, :81, :92, :118,
:120, :135, :172 gain `By = '<hook leaf>[,<leaf>]'`; the `dispatch-gate.js` and `carrier-drift-watch.js` rows gain
`Hold = '<ruling path:line>'; HoldOn = @('D'); HoldUntil = '<date>'`; the file loop :411-470, the `elseif ($f.Hold)` branch
:447 and the registration loop :854-966 [read: my grep; `installer.md:23-26`, `:37-40`]. New `dev/shell/install-holds.test.js`
on the harness of `consonance/tools/install-only.test.js` [read: `installer.md:294-297`].

**The change, in words** [ours, from `prior_fixes.md:307-317` and `landing_path.md:263-268`]:
- The machine tag (:661-668) is computed once above the file loop [read: `installer.md:205`].
- A row whose `Hold` applies here (`HoldOn` empty or holding this tag) is tested BEFORE the ABSENT branch: it prints
  `HELD <leaf>: <ruling> until <date>` and is neither copied nor overwritten. Today `Hold` is tested after ABSENT, so it cannot
  hold an absent entry [read: `landing_path.md:264-268`].
- The registration loop skips a `$register` row whose leaf is held here, and prints the same line.
- -Check prints `HELD` with ruling and date, and `HOLD EXPIRED` once the date has passed. An expired hold still stops the
  installer writing (no surprise writes), but -Check and `landed-live.js` treat it as red.
- `By` changes nothing the installer does; it is read by `landed-live.js` (I1).
- No git call is added to install.ps1, so the `$ErrorActionPreference = 'Stop'` throw on a non-repo cannot arise [read:
  `installer.md:217-224`].

**Failing check on the recorded case.** The recorded hold: "NOT installed, on purpose: `dispatch-gate`, `carrier-drift-watch`"
at the 09-21 install on D [read: `entries_on_d.md:111`, `:155-157`, citing `loop/install_D_2026-09-21.md:14`]. A bare write run
today would copy 3 ABSENT files and ADD 3 registrations, dispatch-gate.js among them [read: `installer.md:99-103`]. Fixture:
temp repo and USERPROFILE, `CONSONANCE_MACHINE=D`, the manifest with the hold. Bare run: red today (copies and registers);
after, neither, and `HELD` printed. The same run with `CONSONANCE_MACHINE=L` copies and registers it (L has it wired [read:
`two_machines.md:97`]). Expired: -Check prints `HOLD EXPIRED`, exit 1, and the bare run still writes nothing for it. Mutants:
the hold tested after ABSENT; `HoldOn` ignored; the registration skip removed.

**What proves it afterwards.** On D, -Check prints `HELD dispatch-gate.js` and `HELD carrier-drift-watch.js` with their ruling
and date in place of 2 of the 3 ABSENT lines and 2 of the 4 DECLARED NOT REGISTERED lines [inferred]; `landed-live.js` agrees.
[2nd reader: DOWNGRADED. The DECLARED NOT REGISTERED list is built in the -Check report, `dev/shell/install.ps1:671-687`
(`$notWired`), not in the file loop or the write loop (:854-966) this part's Files name. Without an edit there, -Check
still prints 4 DNR. Add :671-687 to Files. Two more holes: (1) "-Check ... exit 1" for an expired hold proves nothing,
since -Check exits 1 on D for other reasons (`:757`; today 4 DNR, 1 RND, 1 excluded-but-live); assert the `HOLD EXPIRED`
line. (2) The expired row needs a clock seam (install.ps1 reads no date but the `.bak` stamps). Also: K2's default ("a
hold with a date") implies a hold row for second-reader-note.js, which this part's data does not carry; and the new
`Hold` string reuses a key whose current meaning is a two-way conflict (`:447-452`, `:583`): say the old message changes.]

**Needs.** No rebuild, no install (install.ps1 runs from the repo [read: `installer.md:335`]), no restart. K3 for each hold's
pointer and date. Tier: prove it; the full suite at landing.

**Cost.** 0 per turn.

**What could go wrong.** A hold with no ruling pointer, or one renewed by habit: the falsifier's hold clause (section 6). A
typo in `HoldOn`: the hold silently does not apply, and `landed-live.js` shows `NEW` for it, which is the visible sign.

### I8. push-gate tells the pusher what the push leaves owed on this machine

**Files.** `consonance/hooks/push-gate.js`, `decide()` (:155-168 at HEAD; it moves when `lap-w-h-p`'s +35 lines land) and
`consonance/hooks/push-gate.test.js` [read: `prior_fixes.md:320-324`]. After the merge, so one install carries ruling 6 and
this.

**The change, in words** [ours, from `prior_fixes.md:319-326` with its 2nd reader, and the sender channel of
`gate_modes.md:4-8`]:
- When the push targets the room repo and the pushed range touches anything `landed-live.js` scopes, require it from
  `room_path` in a try and run `scope()` + `classify()` for this machine.
- Default mode `note`: allow, and print one PreToolUse `hookSpecificOutput.additionalContext` naming each OWED, NEW and HOLD
  EXPIRED entry with its exact `-Only` line, plus "the other machine needs the same after its pull".
- Mode `refuse`, on its own key `landed_live_push` in `~/.consonance.json`, not `gates_mode`: deny with the same text. His word
  (K6).
- The push-gate.jsonl row gains a field `live` (names and states). Not `src`: that name is taken in this ledger [read:
  `cost_of_drift.md:286-287`].
- push-gate's pattern is kept: on its own error or its 8 s watchdog it allows, with an `allow-error` row [read:
  `prior_fixes.md:323-324`, its 2nd reader row 455].

**Failing check on the recorded case.** D635's push 21819167..fe69a9fc was allowed at 17:09:36Z with three hook files
landed and not live [read: `prior_fixes.md:343-347`]. Test row: a synthetic `git push origin main` payload, a temp repo with
those blobs, a temp home with D's installed copies. Today: allow, no output; `grep -c landed-live consonance/hooks/push-gate.js`
is 0 [read: my run]. After: allow, with additionalContext naming `second-reader.js`, `second-reader-worker.js` (OWED) and
`second-reader-note.js` (NEW); with `refuse`, deny naming them. Controls: a range touching no manifest source prints nothing;
the same range with a HELD row allows and names the hold. Second row, b0be06f0 from L: L's settings shape and a blind.js
without `sealedGate`: the note names `board-digest.js,blind.js`.

**What proves it afterwards.** The next room push that touches a hook source writes a `live` field in `push-gate.jsonl`; the
pushing pane's transcript holds the note in that turn (counted, no text taken). That PreToolUse `additionalContext` reaches
the model beside a Bash result rests on the docs alone (hooks.md:2009); no recorded PreToolUse case exists [read:
`gate_modes.md:404-406`]. If it does not arrive, `refuse` does: a deny's reason is shown to Claude [read: `cost_of_drift.md:84`].

**Needs.** A hook install of `push-gate.js` on D and on L, `-NoRegister -Only push-gate.js` (registered on both since 11-13)
[read: `two_machines.md:45`]. No rebuild, no restart: a registered hook is read fresh per call [read: `prior_fixes.md:366-367`].
K6 for `refuse`.

**Cost.** Only on pushes: 157 push rows on D in November, about 12 a day [read: `entries_on_d.md:107`]. About 100 ms more per
push and 150 to 300 B of note only when something is owed [inferred].

**What could go wrong.** It sees only the pushing machine; the pulling machine learns at its next start (I3) [read:
`prior_fixes.md:335-340`]. It lives in an installed copy, the route by which push-gate itself sat uninstalled on L from 10-06 to
11-13 [read: `prior_fixes.md:476-481`]; I3 reports push-gate's own state on each machine. ~~A push he ordered with no install
on that machine is noted (not refused) unless a hold row says so~~ [read: `prior_fixes.md:477-480`]. [2nd reader: WRONG as
worded, the condition is inverted. In `note` mode every such push is noted; in `refuse` mode it is refused unless a hold
row covers the entry. And an ordering conflict with I5: I5 installs OWED entries after the push, so at the push the note
fires on every correct landing that touches a hook. K6's "a note ignored" must then be scored by whether the install
followed in that landing, not by whether the note fired; or I5 installs before the push, which `refuse` would force.
Probes: `decide()` at `consonance/hooks/push-gate.js:155-168`, watchdog `:33`/`:179`, fail-open `:185`, `:192`; allow
prints nothing (`:188`); `grep -c landed-live` 0. Its range is `src --not --remotes=<remote>` (`:163`), not an `A..B`:
`scope()` must take that form.]

### I9. `-Only` refuses a sync whose own relative `require` is left stale

**Files.** `dev/shell/install.ps1`, under `-Only`, before the file loop (after `lap-w-h-p` merges); rows in
`install-holds.test.js` or a sibling test on the same harness.

**The change, in words** [ours, `installer.md:246-264` as its 2nd reader scoped it]: for each SELECTED `.js` row whose installed
bytes differ from the repo source, or which is absent: for each literal `require('./x')` or `require('../x')` on a non-comment
line, resolved against the row's `To` directory; if it is another `$files` row's `To`, not also named, and its installed bytes
differ from its repo source, collect the pair. Any pair: print each and the corrected `-Only` list, exit 1, write nothing. For
each selected row, also print (never refuse) the live rows whose source requires it: `note: sources-gate.js is loaded by live
reply-slot.js`. Requires built by `path.join` (ready.js, ambient.js) are not seen here; `By` in I7 covers them for I1 [read:
`installer.md:262-264`].

**Failing check on the recorded case.** L on 11-13: ~~installed board-digest.js = 2c7b3872's blob~~, installed blind.js =
5973d89b's (no `sealedGate`), repo at b0be06f0; [2nd reader: UNSUPPORTED as a fact about L: L's board-digest blob is not
on disk, only that it "predates the sealed gate" (`handback/p-l198-403-stall-B_2026-11-13.md:82`). Use 2c7b3872's blob as
a stated fixture choice; the trap depends on blind.js alone (5973d89b's = `1c0acf7f^`'s, git-blob a6a9ed54, 0
`sealedGate`). Literal relative requires at HEAD, comment lines aside: board-digest.js:39, reply-slot.js:52,
claim-check.js:42 (unmanaged), session-start.js:387 and userprompt-submit.js:311; second-reader.js reaches its worker by
`path.join` (:32), so I9 cannot see that pair.] `-Only board-digest.js` exits 0 today and leaves a hook that "would throw on
every prompt" [read: `installer.md:105-110`, `:301-310`]. After: exit 1 naming blind.js, the installed board-digest.js
unchanged. Control: `-Only board-digest.js,blind.js` exits 0. Must-not-fire row, D today: `-Only reply-slot.js` (reply-slot
`ok`, sources-gate DRIFT) is not refused, because reply-slot's bytes do not change [read: `installer.md:253-258`]. The class's
recorded occurrence: 2026-08-17, "Cannot find module './blind.js'" on every prompt [read: `installer.md:317-319`].

**Needs.** No rebuild, no install, no restart, no keeper word. Tier: prove it.

**Cost.** 0 per turn; a few file reads per `-Only` run.

**What could go wrong.** A `require` inside a block comment refuses falsely; the refusal names it, so the cost is one more name
typed [read: `installer.md:263-264`].

---

## 3. Beside Lap W, which ends in ONE rebuild and restart

Lap W's state: its hook half (W2, W3, W4, ruling 6's push-gate rule, a mutant harness) is built on `lap-w-h-p`, unmerged
(6 commits, 15 files) [read: my `git log main..lap-w-h-p`, `git diff --stat`]. Its Rust half (W5, W1, W2 step 3, C3) is pane R's
(`main.rs`, `brief/LIBRARIAN.md`, `launch.ps1`, `launch.park.test.js`) [read: `lap_w`:482-485].

**Must land on main before Lap W's rebuild** (the build copies briefs and compiles main.rs; the restart writes intakes):
- I5's BUILDING.md and COMMITTEE.md edits, and its three LIBRARIAN.md sentences (handed to pane R).
- I4's env line and its sweep test (handed to pane R; it rides W1's rebuild).
- I1 and I2, so I3's field reads something at the first start after the restart (otherwise it prints `?`).

**Ride on it:** I4 and I5 take effect at the restart; I3's first appearance needs W3's install and the restart (a new
SessionStart registration) [read: `two_machines.md:425-427`].

**Wait (no rebuild needed, after `lap-w-h-p` merges):** I3 if pane H has finished (a follow-up on main plus one file-only
reinstall); I5's GATES.md lines; I7 and I9 (install.ps1); I8 (push-gate.js), installed once with ruling 6; I6 #9.

**Can run now, independent of both:** I6 #1 to #8 on D. Prefer before the restart, so the first body lines read the low count.

**Two panes at once, never the same file** [ours]:

| pane | files it alone edits | build lock | parts |
|---|---|---|---|
| Lap I, node (hooks and node tests) | new `consonance/tools/landed-live.js`, `.test.js`, `.mutants.js`; `consonance/tools/whats-live.js` and `.test.js`; `consonance/tools/open-items.js` (export only); `consonance/src-tauri/brief/BUILDING.md`, `COMMITTEE.md`; new `consonance/tools/brief-carriers.test.js` | none (3 test files or fewer per run) | I1, I2, I5 (minus LIBRARIAN.md and GATES.md) |
| Lap W's R (Rust and PowerShell), two additions | `main.rs` (I4 line and test), `brief/LIBRARIAN.md` (I5's three sentences) | `cargo test` locks the tree | I4, I5's LIBRARIAN part |
| after `lap-w-h-p` merges: the node pane again (or H) | `consonance/hooks/sessionstart-body.js` and `.test.js` (if H has finished), `consonance/hooks/push-gate.js` and `.test.js`, `dev/shell/install.ps1`, new `dev/shell/install-holds.test.js`, `consonance/GATES.md` | none | I3, I5's GATES part, I7, I8, I9 |
| a landing pane | no source; the installs | the room's landing rules | I6, and each part's landing |

- No file is in two rows. `CHANGELOG.md` is edited by no building pane; each hand-back carries its entry text and the landing
  pane writes them, as Lap W does [read: `lap_w`:490].
- The shared format, fixed here so neither waits: `landed-live.js`'s exports `classify`, `summary`, `scope` and the state words
  of I1; I3 and I8 depend on them.

---

## 4. On L, from the repo alone (a seat on L, in `C:\Consonance\lighthouse`)

What D knows of L is 8.7 h old and partial: 15 DRIFT and 8 ABSENT after `-Only push-gate.js` at 10:3xZ on 11-13; 6 of 15
and 3 of 9 named; L's gates_mode, exe and running app not on disk [read: `two_machines.md:3-5`, `:38-77`]. Every step below is
[ours] unless marked; the order follows L's facts, not D's verdicts [read: `two_machines.md:121-160`].

1. `git pull --ff-only` on main once I1 and I2 have landed; confirm with `git log -1 --format=%h` and `ls
   consonance/tools/landed-live.js`.
2. Report only: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check` (documented
   report-only; every write sits in a non-Check branch, exit at :757) [read: `two_machines.md:245-249`]. Keep its file states and
   registration block, not the UNCLAIMED list.
3. Report only: `node consonance/tools/landed-live.js --all --explain`. Before any sync, it must show no `LOCAL EDIT` (the
   "no loss risk" was last shown on L on 09-23 for another set) [read: `two_machines.md:155-157`].
4. Read the named keys of `~/.consonance.json` (machine_tag, gates_mode, data_dir, room_path, chime_repos), never the whole
   file: the owed `gates_mode` read on L [read: `two_machines.md:68-72`, `:268-269`].
5. Write steps 2 to 4 into `exo_memory/loop/landed_live_2026-11-13/state_L.md`, and commit it by named path. If the step-6
   and step-7 snippets of `two_machines.md:220-239` are used for the app and the ledgers, apply their two corrections first:
   build the path class with `String.fromCharCode(92)`, and read the time key `t` as well as `ts` [read:
   `two_machines.md:252-257`].
6. Syncs on L, one leaf per run, each with: settings.json parsed before and after (the installer rewrites it whole), a bare
   -Check after, only that entry may move [read: `two_machines.md:121-125`]:
   - `-NoRegister -Only board-digest.js,blind.js` together, never board-digest.js alone; this is the one machine where fix 2c
     runs [read: `two_machines.md:134-138`]. On the librarian's word: the 11-13 hold was "for this run" [read:
     `installer.md:111`; `landing_path.md:139`].
   - The other registered DRIFT entries `landed-live.js` lists as OWED, by D's per-entry procedure (I6).
   - `sources-gate.js` and `delete-gate.js` are ABSENT on L: installing them adds a gate on every ring and every shell call.
     His word (K7) [read: `two_machines.md:142-144`].
   - Check whether `reply-slot.js` is registered on L; if it is, its `require('./sources-gate.js')` fails there and the reply
     slot never fires on L: report it, do not fix it in this step [read: `two_machines.md:145-148`].
   - Lap W's own entries (W2's precompact-preserve.js and precompact.js, W3's sessionstart-body.js, W4's wake-gate.js, and
     push-gate.js with ruling 6 and I8) at Lap W's landing on L, one `-Only` each [read: `two_machines.md:130-131`,
     `:151-154`].
7. After W3 is installed and L's app restarts: the first body ledger row on L carries `live.not_live`; read it with `node
   -e` over `<data_dir>/sessionstart-body.jsonl` (numbers and names only), and append the count to `state_L.md`.

---

## 5. The keeper's calls

Each is one plain question. His words are quoted only verbatim, with path and line. The one standing line of his that bears on
all of them: "what I am isnt just the good things, its everything good and bad, all mixing together to give the priors that
reinstantiate who I am, what if we take something away from you that we cannot understand or interpret as a part of you"
[read: `exo_memory/briefs/lighthouse_the_room.md:209`]; the rule the room drew from it, in the same line, is "change how often,
never delete" (the room's words, not his) [read: same line; `gate_modes.md:93-97`]. Nothing here retires or deletes a hook.

- **K1. On D, may the second reader stop reading pane rings (sync `second-reader.js`, the 11-03 narrowing)?** For: 268 model
  reads of pane rings and 2,799,638 tokens since 11-03, 133 flagged, and no hook on D reads the flags [read:
  `entries_on_d.md:49-57`]; the ruling was "NARROW, not stop", the librarian's, with his veto open, and no later word of his was
  found [read: `entries_on_d.md:42-48`]. Against: a flagged pane ring would go unread; the hook's own falsifier revisits if an
  error in a pane ring is found that nothing else caught [read: `hooks_drift`:118-120]. Default the evidence leans to: yes, sync.
- **K2. On D, install and register `second-reader-note.js`?** For: the chair-ring flags reach no seat today [read:
  `cost_of_drift.md:211-213`]. Against: it holds the librarian's turn about 6.3 s (p90 9.4 s) on every `call_chair`, about 31
  min in ten days, and speaks on 210 of 280 rings, 75% [read: `entries_on_d.md:63-68`]; "about 10% real" for the reader's flags
  [read: `cost_of_drift.md:244`]. Default: not now; a hold with a date.
- **K3. Hold `dispatch-gate.js` and `carrier-drift-watch.js` off D, as data, until which date?** For: both were "NOT
  installed, on purpose" on 09-21 [read: `entries_on_d.md:111`]; carrier-drift-watch costs 4 to 5 s at every turn end in every
  session and its Stop output reaches no one [read: `entries_on_d.md:84-91`]; W4 does not reuse dispatch-gate [read:
  `entries_on_d.md:221-222`]. Default: hold both on D; date two weeks out, as the D631 falsifier counts [inferred].
- **K4. On D, register `board-digest.js`, so fix 2c runs there?** For: the fix exists. Against: it has not run on D since 07-25
  or earlier, and no reason for its absence is on disk [read: `entries_on_d.md:103`; `installer.md:116-119`]. Default: leave it
  `NOT RUN HERE`.
- **K5. On D, declare `stop.js` (and the Node pulse) as live by ruling (`LiveOn = @('D')`), so -Check stops calling them red?**
  For: the installer has the form, unused [read: `entries_on_d.md:228-229`; `two_machines.md:100-103`]. Against: it changes what
  -Check reports, which was his call on 09-21 [read: `two_machines.md:641-643`]; `landed-live.js` already does not fail on them.
  Default: leave -Check as it is.
- **K6. Should push-gate refuse a room push that leaves a touched hook not live on the pushing machine, or only tell the
  pusher?** For telling: the one warning that moved acts was the one addressed to the sender (call_chair misses 79.8% to 19.6%)
  [read: `gate_modes.md:127-131`]. For refusing: a cue is predicted to lapse [read: `prior_fixes.md:237-238`]. Against
  refusing: push-gate has "no real catch" and its keeping is his [read: `cost_of_drift.md:256`]; it fails open [read:
  `prior_fixes.md:476-478`]. Default: `note` now; `refuse` only if the first two scored landings show a note ignored.
- **K7. On L, install `sources-gate.js` and `delete-gate.js` (new registrations there)?** For: D has run both for weeks; delete-gate
  has 2 real denies [read: `cost_of_drift.md:257`]. Against: sources-gate in light has moved nothing in its ledger [read:
  `gate_modes.md:152-163`]. Default: delete-gate yes; sources-gate not until a gates lap decides where its warning goes.

---

## 6. What the record predicts, and the falsifier

**Why drift returned after each fix on record** [read: `prior_fixes.md:211-229`, `:490-495`]: of 9 returns, 7 came by a hook
change that landed with no install step, 3 by an install on one machine only, 2 by an install excluded on purpose or tied to a
restart that did not happen, 1 by a check that passed while a registration was missing. Changes to what is handed over held IN
THE INSTALLER and lapsed AT THE SEAT; cues lapsed every time; syncs decayed at the next hook commit; a gate at the moment
drift is created was never tried. Nothing asked whether the installed copy was the running copy, and no hold carried an end
date [read: `prior_fixes.md:490-495`].

**What that predicts for these parts** [inferred from the lines above]:
- I6 decays at the next hook commit: Lap W's merge makes push-gate.js, precompact-preserve.js and precompact.js stale on D and L
  [read: `two_machines.md:162-167`].
- I5's LIVE-HERE line is a cue: expected to lapse unless I3 and I8 make the miss visible.
- I3's field is a cue at start rate: its ancestor was emitted 163 times and acted on 0 [read: `two_machines.md:613-614`].
- I7 and I9 are handed changes: expected to hold in the installer.
- I8 in `note` mode is the sender channel, the one measured to move acts; in `refuse` mode it is the untried gate. It lives in
  an installed copy, the route by which push-gate itself lapsed on L for 38 days [read: `prior_fixes.md:476-481`].

**The registered falsifier for the lap as a whole**, quoted from `loop/plan_vector_swarm_2026-11-13.md:144-146`:

> - **Lap I is degenerating if,** at the first two landings of a hook or app change after its parts are live, the installed copy on
>   the landing machine is again older than the repo and no seat was told (read from `install.ps1 -Check` and the board by a seat
>   that is not the lap's author).

**Why it needs companions** [read: `two_machines.md:614-618`; `landing_path.md:367-370`; `prior_fixes.md:484-486`]: with I3
live, "told" is true by construction, so the clause can no longer fire; telling without installing is on record (D132); and a
LIVE-but-unwired entry or an endless hold would pass "LIVE or HELD".

**Companion clauses, registered here before any part is built** [ours]. Lap I is also degenerating if, at either of the first
two landings that change a `$files` source after I1 and I3 are live (the first is expected to be Lap W's own landing):
1. an entry the landing touched is not LIVE or HELD in the body ledger on EACH machine within 48 h of the push;
2. the landing's hand-back carries no `LIVE-HERE` line;
3. `landed-live.js` prints LIVE for an entry that no settings.json command on that machine runs, or disagrees with a bare
   -Check on any file's bytes (line endings aside);
4. a HELD row is past its `until` with no renewal that cites a ruling.
Read by a seat that is not the lap's author, from `landed-live.js --all`, `sessionstart-body.jsonl` on each machine,
`push-gate.jsonl` and the hand-back.

---

## 7. What this spec does NOT cover

- The gates themselves: SOURCES and the reply slot speaking to the sender, a narrow `call_chair` refusal, W4's light arm on L
  (`gate_modes.md` P1, P2, P4, P5). A gates lap; their recorded counts are at `gate_modes.md:118-193`.
- `ask-surface.js`: run from the repo path, a "CUT candidate" with no dream guard; this lap only reports it [read:
  `cost_of_drift.md:260`].
- launch.ps1's rebuild test by dep-info and an `app-build.json` receipt (W5's file); its predicted refusal on a MAP.md-only
  change is a prediction, with no recorded click [read: `running_binary.md:138-146`, `:245-250`]. Registered to watch: a
  launch that prints "BUILD SUCCEEDED BUT THE EXE DID NOT CHANGE".
- build.rs `rerun-if-changed` on bundle folders: the missing research files are a lag that closes at the next brief-touching
  build, which Lap W's rebuild is [read: `running_binary.md:87-91`].
- An installer receipt line, ledger blob stamps, a chain-status pulse clause (section 1). What would change my mind on the
  receipt: a recorded case where the install TIME, not the installed commit, decided a question.
- T-180 and track installer rows (L0256, L0448, L0765) and the bundled-brief rows beyond I2 and I5 [read:
  `landing_path.md:98-100`].
- Hook timeouts: 8 of 19 wired hooks on D carry none, and the installer never compares a timeout [read: `installer.md:43-45`].
- Whether a running session reloads a changed registration without a restart: the docs say "normally"; nothing here relies on
  it beyond what a restart gives [read: `installer.md:134-153`].
- `close.js`, state sync, the 85 MB transcript, the CLI version, the heavy-run lock, compaction of any seat.
- Machine L's actual state: only the read in section 4 can give it.

## What I did not open

- Machine L, any transcript, `C:/Consonance/data/*.jsonl`, the board. Every figure from them here is a reader's, cited.
- The primaries behind the reader files, except the five named at the top. No test, hook, build, install or `-Check` was run.
- `lap-w-h-p`'s file bodies (only its log and diff stat); the Lap W spec beyond W5, W3, W4 and sections 2 to 3.
- `install-only.test.js`, `scratch.js`, `push-gate.js`, `whats-live.js`, `open-items.js`, `sessionstart-body.js`: their lines here
  are the readers', at HEAD 2c396481 to dce23a2b, where no code under `consonance/` or `dev/` changed [read:
  `running_binary.md:285-286`].
- `in_hooks.md`, `00_critic.md`, `00_ledger.md` and the L handoff, except as the reader files cite them.
- The workflow script `landed-is-live.workflow.js` in this folder.

## Second reader

Second reader of the spec: an Opus reader on D, 2026-11-13, at lighthouse HEAD 2c40640b (one commit after dce23a2b, a
Third Place note; no file under `consonance/` or `dev/` changed). Read-only except this file. Line numbers in the table
are the spec's own, before my in-place notes moved them. Run by me, all report-only: `install.ps1 -Check` once, plain
(read first: the file loop writes only under `-not $Check`, `:403-406`, `:437-469`, and the Check branch exits at `:757`
before the settings writes at `:840`, `:998`), output to my scratchpad; `node consonance/tools/whats-live.js` (read whole
first: it spawns `Get-Process` and git and writes nothing); a node stat pass over `target/release/consonance.d`; a node
count over `C:/Consonance/data/second-reader.jsonl` (numbers and field names only); a node parse of `settings.json`
printing event, matcher and path; `git rev-parse`, `git hash-object --path` (no `-w`), `git diff --name-only/--numstat`,
`git ls-files --eol`, `git show lap-w-h-p:<path>`; greps on the installed copies, the briefs and
`C:/Consonance/instances/*/CLAUDE.md`. No test file was run. No transcript was read.

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 17-19 | the rule is at :209, the room's words after his | `briefs/lighthouse_the_room.md:209` | OK | his sentence and "change how often" both on :209 |
| 20-22 | 7 Lib rows; `Hold` read at :447, set by none | `install.ps1:80`, `:81`, `:92`, `:118`, `:120`, `:135`, `:172`, `:447` | OK | `:124` is the comment line |
| 24 | `lap-w-h-p`: 6 commits, 15 files, unmerged | `git log main..lap-w-h-p`; `--stat` | OK | 6; 15 files, +1363 -23 |
| 25-26 | four zero counts | grep; ls | OK | 0, absent, 0, 0 |
| 37 | seven syncs plus the pulse, all `-NoRegister`; push-gate after the merge | `plan_room_stretch:81-82`; `install.ps1:823-830`; numstat | OK | `-NoRegister` exits at :830 |
| 38 | stop.js kept; the word covers leaving it | `entries_on_d.md:115`, `:224-229` | OK | |
| 39 | dispatch-gate, carrier-drift-watch as named holds | `prior_fixes.md:307-317`; `landing_path.md:263-268` | OK | |
| 40 | K1: 268 / 2,799,638 / 133 | `second-reader.jsonl` (my count) | OK | now 269 / 2,805,322 / 134; 267 from the push; 0 `toolUseId` in 4,026 |
| 42 | fix 2c: L with blind.js; on D registered nowhere | `install.ps1` (no board-digest `$register` row); settings.json | OK | 0 of 19 |
| 43 | order reversed | `entries_on_d.md:198-217`; `hooks_drift:318-329` | OK | |
| 44 | file verdicts print first | my -Check | OK | DRIFT/ABSENT at 12-36; UNCLAIMED :59; block :5014-5025 |
| 45 | ask-surface.js runs from the repo path | settings.json | OK | UserPromptSubmit |
| 46 | `grep -c relayed` 0 installed | installed and repo second-reader.js | OK | 0 / 1 |
| 47 | `M.md:913` dropped | `paths`:359-362 | OK | |
| 48 | `-Only`, one leaf, between rings | `two_machines.md:121-125` | OK | |
| 49 | carriers widened | LIBRARIAN :113, :115, :133; COMMITTEE :172-174; BUILDING :232-233, :237-239; GATES :96-102 | OK | GATES's other sentence is :317-318 (I5 row) |
| 50 | 9 stale sentences in 8 live intakes | `C:/Consonance/instances/*/CLAUDE.md` | OK | 1 + 2 + 6, literal and normalised |
| 51 | rebuild and restart reach seats | `gate_modes.md:106-111`; `tauri.conf.json` resources | OK | |
| 52-63 | the remaining rows' topic cites | the topic files after their 2nd readers | OK | each line says it |
| 54 | whats-live's RED is false | my run; dep-info pass | OK | exit 1; 116 inputs, 0 newer |
| 75 | push-gate shifts +35 | `git diff --numstat` | WRONG | +30 -5, net +25 |
| 83 | `tools/` not audited as a hook | `landing_path.md:376` | OK | |
| 87-90 | parse by whole lines | `install.ps1:223-224`, `:256-257`, `:293-294`, `:322-323` | DOWNGRADED | keys sit on continuation lines |
| 91-93 | registered = exact installed path | settings.json; `install.ps1:798-802` | OK | `"<node>" "<dest>\<Rel>"` |
| 94-97 | blob after CRLF to LF equals `hash-object --path` | `git ls-files --eol`; hash-object | OK | sessionstart-ambient.js i/lf w/crlf; installed, normalised, c3dc11e2 = HEAD |
| 106 | `LIB (no By)` until I7 | `install.ps1` Lib rows; fixture A; I3 | WRONG | contradicts fixture A, the D proof and I3's count |
| 121-124 | fixture A blobs | rev-parse; hash-object | OK | all five ids |
| 125-128 | red by hand today | hash-object | OK | abcbff60 vs 2d161fbd |
| 129-133 | fixture B as L's state | `p-l198…:82`; rev-parse | DOWNGRADED | blind.js a6a9ed54 OK; L's digest blob not on disk |
| 139-140 | hold expiry test | install.ps1 (`Get-Date` only at :461, :986) | DOWNGRADED | needs a clock seam |
| 149-153 | proofs on D's disk | `git diff --name-only` both ranges; my -Check | DOWNGRADED | "the three" needs `By`; second range and 23/10/3 OK |
| 157-158 | cost from the prototype | `two_machines.md:346-348` | DOWNGRADED | raw sha256, no git spawn |
| 169-171 | whats-live lines; open-items export | `whats-live.js:64-68`, `:97-102`, `:161-163`; `open-items.js:132` | OK | open-items runs top-level, ends `process.exit(0)` |
| 181-183 | RED today; 0 of 116 newer | my run and stat pass | OK | |
| 184 | two research files outside the bundle | stat pass | OK | the two 11-13 names |
| 185-187 | unit fixtures | design | OK | add a `ui/` or `build.rs` edge |
| 195 | 13 KB read, ~120 stats | `consonance.d` | OK | 12,858 B; 116 inputs |
| 203-205 | branch file; line ends `· source` | `lap-w-h-p:…/sessionstart-body.js:192` | OK | |
| 207-208 | the 300 B bound is on the body part | `lap_w`:351-353 | OK | |
| 214-215 | `, wake refuses` on D | `lap-w-h-p:…/wake-gate.js:207`; `plan_room_stretch:102` | DOWNGRADED | true only once installed, and for the librarian only |
| 219-220 | 58 B, 80 B | `Buffer.byteLength` | OK | |
| 222-225 | 69 outputs, 0 named; branch 0 fields | `two_machines.md:436-442` (2nd reader OK); branch grep | OK | grep 0 for six words; transcript pass not re-run |
| 227-229 | `hooks 10 not live` = 7 OWED + 3 NEW | install.ps1 Lib rows | DOWNGRADED | 9 without `By` |
| 231 | mutants anchors | `git diff --stat main...lap-w-h-p` | DOWNGRADED | file missing from section 3's table |
| 242-244 | cost per start | `two_machines.md:390-393` | OK | 90 / 2.89 = 31 |
| 254-256 | env beside :1222-1223; sweep like :24418 | `main.rs:1222-1223`, `:24418` | OK | |
| 262-264 | grep 0; sweep red | grep | OK | weak: any value passes the sweep |
| 275-279 | I5 file lines | the briefs | DOWNGRADED | GATES "still refuses" is :317-318 |
| 292-297 | I5 failing check | normalised counts over briefs and intakes | DOWNGRADED | GATES half cannot be red; :133, :115 uncovered |
| 302-303 | GATES.md read in the repo | `tauri.conf.json` (not bundled); `main.rs:3002-3006` | OK | |
| 313-319 | file-only run; settings unchanged | `install.ps1:823-830`; settings.json | OK | 4,942 B, 4266711b35be030e |
| 321-335 | rows 1-8, the red probes | installed copies; ledger | OK | all red for the reason (I6 note) |
| 337-339 | 10 DRIFT to 2 | the table | OK | |
| 341-342 | change kinds for #1-#8 | `hooks_drift:62-64`, `:86-91` | DOWNGRADED | #1, #2 are not data-dir; they do not run on D |
| 354-358 | I7 lines | `install.ps1:80-172`, `:411-470`, `:447`, `:661-668`, `:854-966` | OK | |
| 362-364 | Hold tested after ABSENT | `install.ps1:434-447` | OK | |
| 372-378 | bare run red today on the fixture | the code | OK | the ABSENT branch copies before any Hold test |
| 380-381 | -Check shows HELD in place of 2 DNR | `install.ps1:671-687`, `:757` | DOWNGRADED | DNR is built in the report, not in the Files named |
| 383 | install.ps1 runs from the repo | `install.ps1:73` | OK | |
| 393-394 | `decide()` :155-168 | `push-gate.js` | OK | |
| 407-408 | fails open, 8 s | `push-gate.js:33`, `:179`, `:185`, `:192` | OK | |
| 412 | allow prints nothing; grep 0 | `push-gate.js:188`; grep | OK | |
| 423-424 | file install, no restart | settings.json; `prior_fixes.md:366-367` | OK | |
| 427 | 157 push rows, ~12 a day | `entries_on_d.md:107` | OK | |
| 433 | "noted unless a hold row" | design | WRONG | inverted; and I5's order makes it fire at every hook landing |
| 444-446 | literal requires; `path.join` unseen | grep at HEAD | OK | second-reader.js:32 spawns its worker by path |
| 448-449 | L's installed digest = 2c7b3872 | `p-l198…:82` | UNSUPPORTED | not on disk |
| 451-452 | reply-slot must not fire | `reply-slot.js:52`; `installer.md:253-258` | OK | |
| 487-493 | no file in two rows; Lap W files declared | both spec tables | OK | except the mutants file (row 231) |

**Tally: 69 rows. OK 53, WRONG 3, UNSUPPORTED 1, DOWNGRADED 12.**

**The failing checks, probed today** (each printed what the spec says, unless marked):
- I1: tool absent; the hand compare is red for L0613's reason (abcbff60 vs 2d161fbd). Fixture A's worker line and the D
  proof's "three names" are red only once `By` exists.
- I2: `whats-live.js` exit 1 on 53bac6a0, and 0 of 116 dep-info inputs newer: red for the reason.
- I3: the branch body hook greps 0 for every receipt word: red for the reason. Transcript pass not re-run.
- I4: `grep -c CONSONANCE_APP_EXE main.rs` 0.
- I5: instance intakes 9 in 8 files; `landed-live` in BUILDING.md 0. GATES.md's half is green today for the chosen strings.
- I6: every row's probe red (I6 note).
- I7, I8, I9: fixtures not run (they need write-mode installs into a temp home, or a branch file); the code paths that make
  them red today were read at HEAD: ABSENT before Hold (`install.ps1:434-447`), no landed-live in push-gate.js, no
  require scan in install.ps1.

**The simplest way to pass each check without the fix, and what closes it** [ours]:
- I1: sync the touched file alone and read LIVE: fixtures B2 and C close it. A per-line parse that drops `Excluded`:
  fixture D closes it. A blob test over the files installed on the test machine is vacuous where nothing is installed:
  pin the CRLF case on a fixture file too.
- I2: "src/*.rs plus brief/*.md" passes both fixtures: add a `ui/` or `build.rs` edge.
- I3: a count printed and never read: the time-to-live score in section 6 is the answer, and it needs the names in the
  ledger, which the part has.
- I4: any value in the env passes the sweep: require `current_exe` in the sweep and check the first row's path once.
- I5: fix LIBRARIAN.md:113 only: extend the strings (note in place).
- I6: copies that decay at the next hook commit: predicted, and scored by section 6.
- I7: assert -Check's exit code: it is 1 anyway; assert the `HOLD EXPIRED` line.
- I8: a note that fires on every correct landing reads as noise: score K6 on whether the install followed.
- I9: none found beyond the `path.join` blind spot the part names.

**Files, across panes.** No Lap I file is in two Lap I rows. Every Lap W file Lap I edits is named with its owner
(`install.ps1`, `GATES.md`, `sessionstart-body.js` and its test for H, after the merge; `main.rs` and `LIBRARIAN.md` for
R, as additions), except `consonance/tools/lapw-hooks.mutants.js` (H's branch file, edited by I3, in no row). push-gate.js
is in no Lap W row but is changed on `lap-w-h-p`; the spec handles it by waiting for the merge. `brief-carriers.test.js`
reads files three owners edit; it is red until all three land.

**A builder can start from these as written:** I2, I4, I6 (#1 to #8 now; #9 to #11 as gated), I9 (state the fixture
choice).

**These need a change first:** I1 (parse each hashtable across lines; fixtures carry `By`, and the D proof expects
`LIB (no By)` until I7), I3 (pin a manifest with `By`; print `wake refuses` only when wake-gate.js is live and the seat is
the librarian; add the mutants file to the pane table), I5 (the four extra strings; say the test is red until R and H
land), I7 (add the -Check report lines `:671-687`; a clock seam; assert the line, not the exit code), I8 (fix the inverted
sentence; `scope()` takes push-gate's `src --not --remotes` form; say whether the landing installs before or after the
push).

### What I did not open (second reader)

- Machine L. Every L statement checked here was checked against files committed on L.
- The librarian's 905 MB transcript (the 69-output pass): not re-run, by the CPU rule; two readers re-derived it.
- Any test file: none run. The I7, I8 and I9 fixtures need write-mode installs into a temp home, or a branch file.
- `lap-w-h-p` beyond the `sessionstart-body.js` and `wake-gate.js` lines and the diff stat; Lap W's spec beyond W3 and
  section 3.
- `install.ps1` lines 470-625 and 700-790 beyond greps; `open-items.js` beyond its top-level structure and `:132`.
- The topic files' primaries behind lines I did not re-run (the gate counts, the cost tables, the start paths).
- `in_hooks.md`, `00_critic.md`, `00_ledger.md`, the L handoff, and the workflow script in this folder.
