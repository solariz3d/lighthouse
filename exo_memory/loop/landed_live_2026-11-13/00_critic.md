# Critic of the landed-is-live level (Opus, D, 2026-11-13)

Read whole: the eight topic files with their second readers, `00_lap_i_spec.md` with its second reader,
`plan_vector_swarm_2026-11-13.md` from "SCORED AND AIMED" (:65) to its end (:147), `vector_swarm_2026-11-13/adversary_R02.md`,
`plan_room_stretch_2026-11-13.md`; `hooks_drift_D_2026-11-13.md` :1-51 and :300-371; `room_better_2026-11-13/00_build_paths.md`
sections 10 (:336-365) and 13 (:409-422) with their second-reader rows; the 19 ledger rows (`00_ledger.md` :59-1127).
Main checkout at HEAD 27cadc41. 17 commits since 2c396481, none under `dev/shell`, `consonance/hooks`, `consonance/tools`
or `consonance/src-tauri` [read: `git log 2c396481..HEAD -- <those paths>`, empty]. So every topic file's code line holds.

What I ran, all read-only: `git hash-object --path` (no `-w`) on four installed copies; `git rev-parse`, `git log`,
`git show`; `sha256sum` and `wc -c` of `~/.claude/settings.json`; a grep of `C:/Consonance/instances/*/CLAUDE.md`; one
node script of mine (`scratchpad/critic/closure.js`) that runs `git show` and prints counts. No test file, no install,
no `-Check`, no hook, no transcript, no data log. The only file written in the repo is this one.

Marks: [read] I opened it or ran it myself (path:line at 27cadc41). [summary] a topic file's or record's account, not
re-opened at its primary by me. [inferred] mine. [ours] a proposal.

## 0. The state has not moved since the readers measured it

- Installed vs HEAD, git-blob: `second-reader.js` abcbff60 vs 2d161fbd; `second-reader-worker.js` 63ec0296 vs b79bbafe;
  `board-digest.js` 142a6541 vs 8b504225; `sources-gate.js` 198710bb vs 56f28cf7; `second-reader-note.js` absent [read].
- `~/.claude/settings.json`: sha256 4266711b35be030e…, 4,942 B, the same as every reader's [read].
- Live intakes: 9 stale gate sentences in 8 files (librarian 1, main 2, six `sibling-*` 1 each), whitespace normalised
  [read: my grep]. The spec's I5 count re-derives.

## 1. Errors still standing after the second readers

**E1. I9 cannot fire on the recorded occurrence it names.** The spec says the class's recorded occurrence is 2026-08-17,
"Cannot find module './blind.js'" (`00_lap_i_spec.md:535-536`) [summary]. I9 collects a require only "if it is another
`$files` row's `To`" (`00_lap_i_spec.md:520`) [summary]. On 08-17 blind.js was no row at all:
- `git show 8e85ff11^:dev/shell/install.ps1` has 2 lines naming board-digest.js and 0 naming blind.js [read];
- `8e85ff11^:consonance/hooks/board-digest.js:39` already requires `./blind.js` [read];
- 8e85ff11 (2026-08-17 04:48 -0600) is the commit that added the row: "blind.js was never in the manifest" [read];
- its comment is still at `dev/shell/install.ps1:130-134`, the row at `:135` [read].
So I9 as written passes the L0020 tree silently [inferred]. A static check catches it, needs no install and runs in the
suite: every literal relative `require` of a `$files` source resolves to a `$files` `To`. My probe: 8e85ff11^ "unmet 1"
(board-digest.js -> blind.js); 8e85ff11 "unmet 0"; HEAD "36 rows, 4 literal relative requires, unmet 0" [read:
`closure.js` runs]. Red on the recorded case, green after [read]. The probe takes single-quoted requires only, and found
4 where `installer.md:259-261` lists 5 [read; the gap is mine to close, not checked]. [ours] Add it as a test before I9;
keep I9's runtime rule only for the mixed-installed-state hazard of 11-13 on L.

**E2. "A new registration needs `/hooks` or a restart" is not supported as a necessity, and the record has the case.**
The spec ties K2's note hook to "picked up at Lap W's restart" (`00_lap_i_spec.md:389`) and I3 to "the restart that
picks up its new SessionStart registration" (`:281-282`) [summary]; `entries_on_d.md:215-217` and `two_machines.md:425-426`
say `/hooks` or a restart is needed [summary]; the installer says a new hook "may not fire until /hooks is opened once
or the session restarts" (`dev/shell/install.ps1:1028-1030`) [read]. The one observation on disk says otherwise:
- pane B on L ran `-Only push-gate.js`, which printed "ADD PreToolUse push-gate.js" and a settings backup stamped
  20261113-043730 (`handback/p-l198-403-stall-B_2026-11-13.md:94-96`) [read];
- its next Bash call was DENIED by that hook, and the deny row at 10:38:31.012Z carries B's own session id (`:108-115`) [read];
- 04:37:30 local is 10:37:30Z on L (UTC-6, as `landing_path.md:134-135` converts L's stamps) [inferred].
A PreToolUse registration was picked up by a running session within about 61 s, with no restart [inferred from the
three lines above]. No reader in this folder used this record for the question: `prior_fixes.md` cites it only as A10's
install [read: grep of the folder]. Coupling an install to a restart is the route by which drift returned twice
(A8, A9: `prior_fixes.md:167-186`) [summary]. [ours] Drop the restart as a precondition for K2, I8 and any hook-only part.

**E3. I1 treats the L0023 form as green.** A `$files` row with no `$register` row prints `NOT RUN HERE` and never fails
(`00_lap_i_spec.md:108-111`) [summary]. L0023 is exactly that: two hooks shipped in the file list with no registration
(`00_ledger.md:62`) [read]. The form is live today: 6 non-Lib `$files` rows have no `$register` row (board-digest.js,
userprompt-submit.js, sessionstart-ambient.js, transcript-watch.js, dream-watch.js, ferry-watch.js;
`installer.md:279-283`) [summary]. Lap I cannot tell "unregistered by design" from "registration forgotten" [inferred].
[ours] A `Wiring = '<ruling path:line>'` (or `NoRegister`) field on such rows, and a static test that every non-Lib
`$files` row has a `$register` row or that field. Red today on 6 rows until each gets a reason; that reason is K-type data.

**E4. A recorded "told installed, not installed" landing goes unused.** `65a8cbfb` (2026-10-05) touches
`consonance/hooks/board-digest.js` and its body says "Installed copies under ~/.claude/shell synced from these masters"
[read: `git log -1 --format=%B 65a8cbfb`, body line 17; `git show --stat`]. D's installed board-digest.js is 142a6541,
the blob of 2c7b3872, not 65a8cbfb's d0b6ce82 [read]. Which machine that commit was made on, I did not establish
[inferred]. It is the direct case for I5 (a landing's own words claim live; a tool line would have said OWED or NOT RUN
HERE) [inferred]. The spec's section 6 also drops `prior_fixes.md`'s corrected route, hand edits written straight into
installed copies on 10-05 (`prior_fixes.md:224-228`) [summary]; a hand copy of a committed file reads `LIVE`, so
`LOCAL EDIT` cannot see it [summary: same lines].

**E5. The second readers' "need a change first" list is still unapplied.** `00_lap_i_spec.md:852-857` names it: I1's
per-line parse loses keys on 9 two-line `$register` rows and fixture A needs `By`; I3's `wake refuses` fires before W4
is installed and to every pane; I5's check misses LIBRARIAN.md :115 and :133; I7 misses the -Check report lines
(`install.ps1:671-687`) and has no clock seam; I8's hold sentence is inverted [summary]. One of these is a real
ordering conflict and the spec never chose: I5 installs OWED entries after the push, I8 notes at the push, so the note
fires on every correct hook landing (`00_lap_i_spec.md:504-508`) [summary]. [ours] Order the landing as merge, install,
`landed-live --range` green, then push; I8 then fires only when the install was skipped.

**E6. The vector plan's own evidence line overstates one gate.** "`dispatch-gate.js` is ABSENT on D" is given as a gate
that makes a seat read first and is not running (`plan_vector_swarm_2026-11-13.md:110-111`) [read]. It is a recorded
hold, "NOT installed, on purpose" at the 09-21 install (`entries_on_d.md:155-157`, `two_machines.md:97`) [summary], and
in its print mode it never denies (`entries_on_d.md:111`) [summary].

**E7. Two ledger rows are still wrong in the ledger.** L1079 keeps "installing syncs all at once" (`00_ledger.md:1118`)
[read], struck in its own hand-back at 10:4xZ (`installer.md:105-113`) [summary]. L1044 says "the desktop needs its own
install" of the push gate (`00_ledger.md:1083`) [read]; D's push gate is registered, with 157 rows in November
(`entries_on_d.md:147-149`) [summary]. Any count over these rows inherits both [inferred].

## 2. Where two files disagree, and which the primary supports

| question | side A | side B | primary | supports |
|---|---|---|---|---|
| new registration live without restart | `install.ps1:1028-1030`; entries_on_d; two_machines; spec I3, I6 #11 | docs: "normally picked up" (`installer.md:139-140`) | `p-l198…:94-96`, `:108-115` [read] | B, on one recorded case |
| how the other machine is told | `landing_path.md:298-310`: pulse line via repo chain-status | spec I3, two_machines: W3 body line | pulse caller is installed and live on D (`landing_path.md:120-123`); `sessionstart-body.jsonl` absent (`two_machines.md:447`) [summary] | pulse is live today; W3 needs a new install on each machine. Spec's nag and shared-state objections stand |
| how a hold is written | landing_path: `Hold` string; its 2nd reader: `Excluded`; prior_fixes: `holds.json` | spec I7: `Hold`/`HoldOn`/`HoldUntil`, tested before ABSENT | `install.ps1:447-452`: `Hold` today means "two-way conflict - NOT overwritten" [read] | spec's form works; it changes an existing key's meaning and message, which the spec does not say |
| is the b0be06f0 case red on D | prior_fixes 1st reader: STALE, exit 1 | its 2nd reader; landing_path: NOT RUN HERE, exit 0 | 0 board-digest commands among D's 19 (`entries_on_d.md:103`) [summary] | B; the spec follows B |
| which -Check verdicts print first | build_paths §10, cost_of_drift 1st reader: after 4,950 lines | cost_of_drift 2nd reader, hooks_drift: files first | `hooks_drift_D_2026-11-13.md:22-24` [read] | B; the spec dropped the change |
| comparison function | two_machines: raw sha256 as -Check | spec I1: git-blob after CRLF to LF | `sessionstart-ambient.js` CRLF in both copies on D (`two_machines.md:109-112`) [summary] | spec's normalised form; its "pin to -Check" test must allow line endings |
| pulse trim live "at once" | cost_of_drift 1st reader | its 2nd reader: at the merge, 17:10Z | git reflog (`cost_of_drift.md:14-19`) [summary] | the 2nd reader |

## 3. Claims a build would rest on that have one source only

- PreToolUse `additionalContext` reaches the model beside a tool result: the docs line alone (`gate_modes.md:217`,
  `:404-406`; spec `:490-492`) [summary]. I8's default `note` mode rests on it.
- L's installed blind.js lacks `sealedGate`: pane B's one reading on L (`p-l198…:78-81`, via `installer.md:301-303`)
  [summary]. I9's fixture and spec section 4 step 6 rest on it.
- L's 15 DRIFT and 8 ABSENT, and the 6 + 3 names: one morning's runs on L (`two_machines.md:38-58`) [summary].
- "Every seat is spawned by the app, so I4 covers all five start paths": inferred by one reader (`running_binary.md:190`)
  [summary].
- Cargo's dep-info as the staleness authority (I2): one reader, with its 2nd reader's caveat that cargo compares its own
  fingerprint stamp (`running_binary.md:47-51`) [summary].
- `-NoRegister -Only` leaves settings.json unwritten: read in the code by several (`install.ps1:823-830`), used once
  (09-19), and "No test covers that pair of flags" (`hooks_drift_D_2026-11-13.md:339-340`) [read].
- The flags are "about 10% real" (K2's default): `room_value_result_2026-11-03.md:28` via `cost_of_drift.md:244` only
  [summary].
- The note hook's 6.3 s wait per `call_chair` (K2): inferred from worker time (`entries_on_d.md:63-65`) [summary].
- "About 1% of one librarian day per day": price ratios that `cost_of_drift.md:32-43` itself calls assumptions [summary].

## 4. Still unread or untested

- Whether a changed hook FILE is used at its next firing in a running session: inferred by every reader ("each firing
  starts a new node process"); no hook fired by any reader [summary]. The nearest evidence is E2's case on L (a new file
  and a new registration, fired in the same session) [read] and the pulse trim, a repo script run per prompt that changed
  behaviour at the merge (`cost_of_drift.md:14-19`) [summary].
- Whether PreToolUse `additionalContext` reaches the model. No recorded case on D (`gate_modes.md:404-406`) [summary].
- The I1, I7, I8 and I9 fixtures: none run; I7 to I9 need write-mode installs into a temp home (`00_lap_i_spec.md:825-827`)
  [summary]. No test file of any part exists [inferred: read-only level].
- launch.ps1's predicted refusal, "BUILD SUCCEEDED BUT THE EXE DID NOT CHANGE": a prediction, no click
  (`running_binary.md:138-146`) [summary].
- Whether the 11-08 exe holds fe69a9fc's Rust: author date against mtime, no built-from sha (`landing_path.md:347-350`)
  [summary].
- Whether `landed-live.js`'s `git ls-tree` and history walk fit push-gate's 8 s watchdog: untimed (spec `:183-184`)
  [summary].
- Whether `$HOME` follows `USERPROFILE` inside powershell.exe (the machine tag in fixtures): not probed
  (`two_machines.md:650`) [summary].
- Machine L: settings, installed tree, `gates_mode`, exe, whether `reply-slot.js` is registered there with
  `sources-gate.js` absent [summary: `two_machines.md:67-76`, `:145-148`].
- Time-to-live (commit to first `ok` per machine) has never been measured; the companion falsifier depends on it [inferred].

## 5. THE REGISTERED TESTS

"This level did nothing if its spec leaves 'Hygiene, small' as it stands (the eight syncs and nothing else) and adds no
failing check that runs on a recorded case" (`plan_vector_swarm_2026-11-13.md:141-142`) [read]. It did not fire, on either half.

Changes to "Hygiene, small" (`plan_room_stretch_2026-11-13.md:79-83`) [read], from `00_lap_i_spec.md:37-39` [summary]:
1. Seven of the eight now, one leaf a run, all `-NoRegister`; `push-gate.js` moves to after Lap W's merge (that branch
   changes it); `userprompt_pulse.py` added, file only.
2. Each sync gets its own red-to-green probe, not only the settings sha (`00_lap_i_spec.md:377-391`) [summary].
3. "The three ABSENT hooks are not installed" becomes two dated holds in installer data (K3) and one keeper question (K2).
4. `stop.js` stays, and is reported `EXCLUDED BUT LIVE` without failing.
Beyond hygiene: nine parts, I1 to I9, and seven keeper calls [summary].

Failing checks run today on a recorded case (probes, not test files; none is written yet):
- L0613: installed second-reader.js abcbff60 against HEAD's 2d161fbd, worker 63ec0296 against b79bbafe, note absent
  [read: my run]. Fixture A's own "three names" is red only once `By` exists (`00_lap_i_spec.md:173-175`) [summary].
- The 11-13 false RED: `whats-live.js` exits 1 on 53bac6a0, a MAP.md commit; 0 of 116 dep-info inputs newer (two readers'
  runs, `running_binary.md:293-296`) [summary].
- I5: 9 stale gate sentences in 8 live intakes [read: my grep].
- I3: 0 of 69 SessionStart outputs on D since 11-01 name drift, gates or install (`two_machines.md:598-599`) [summary].
- I6: each row's probe red at HEAD 2c40640b (`00_lap_i_spec.md:396-400`) [summary].
- Mine, E1: the manifest-closure probe, red at 8e85ff11^ (L0020), green after [read].
Not red for a recorded reason: I4's `grep -c CONSONANCE_APP_EXE` 0 is a missing feature; I9 as written misses its case (E1).

## 6. WAS THE AIM RIGHT

**What drift has cost, in numbers.**
- Of the 19 rows, 2 carry a number: L0613, 229 reads and 2,385,722 tokens; L0765, "~45 min (inferred)", a T-180 install
  outside Lap I (`00_ledger.md:652`, `:804`) [read].
- L0613 re-derived: 266 model reads and 2,778,110 raw tokens from the push to 11-13 19:12Z; 0.89 M to 1.30 M Fable units in
  10.2 days, about 0.8% to 1.2% of one librarian day per day, on stated price assumptions (`cost_of_drift.md:199-210`) [summary].
- The other 9 DRIFT files on D change nothing D does: 5 of the 6 registered ones differ by a data-dir fallback or a default
  list (`cost_of_drift.md:186-188`) [summary].
- The one costly drift was a hold, "The installed hook copy is replaced only at the restart", the librarian's ruling
  with his veto open (`entries_on_d.md:42-48`) [summary]. The spec still leaves that sync to K1 (`00_lap_i_spec.md:627-631`)
  [summary]. So no part of Lap I removes the only measured cost; K1 does [inferred].

**How many of the 19 rows a built Lap I would have prevented** [inferred, row by row from `00_ledger.md` and the spec]:
- Made live: 0. No part installs anything by itself; the landing install (I5) is a brief line, and the record says cues
  lapse every time (`prior_fixes.md:237-238`) [summary]. Only `refuse` (K6) forces it, on the pushing machine only.
- Named on the machine concerned, at the landing or the next start: 13. L0089, L0092 (I1/I8 at the landing); L0296, L0996,
  L1088 (I3 on L and D); L0472, L0565 (I2 through I3); L0613 (I1/I8 at D635's push, I7's expiry); L1044 (true state per
  machine); L1079 (I1 prints `-Only board-digest.js,blind.js`); L1085 (NEW); L1086 (RUNS FROM REPO); L1087 (OWED on L).
- Not touched: 6. L0256, L0448, L0765 (product installers, out of scope by spec section 7); L0021 (a file in no repo);
  L0023 (E3: NOT RUN HERE, exit 0); L0020 (E1: I9 cannot see it). With E1's and E3's static checks, 14 to 15.
- Of the 13, telling at the moment plausibly changed a cost in 3: L0613, L1079, and L0089/L0092 counted as one claim
  ("the clicks are off" said on a commit). The rest were already found by a `-Check` someone ran; Lap I moves when.

**Larger or cheaper faults these files show, walked past.**
- Cheaper: the one costly drift closes with one ruling and two `-NoRegister -Only` runs (worker, then hook), minutes and no
  build (`00_lap_i_spec.md:382`, `:388`) [summary].
- Larger, in the same ledger: the second reader as a whole. In November its `ok` rows cost 1.9 M to 2.7 M Fable units in 13
  days (`cost_of_drift.md:113-114`) [summary]. Its `call_chair` half, current code and not drift, made 282 reads and
  1,352,074 tokens since 11-03 whose flags reach no seat on D (`cost_of_drift.md:211-213`) [summary]. K2's default,
  "not now", keeps paying it [inferred].
- Larger in reach, not in tokens: warnings that reach no seat. SOURCES wrote 2,482 warnings since 10-20 and none reached a
  seat; the reply slot's 1,009 attachments appear in 0 of 8,056 recorded requests (`gate_modes.md:155`, `:178-181`)
  [summary]. "A gate that runs warn-only while the briefs describe a refusal" is one of this swarm's own four forms; the
  spec fixes only the brief text and defers the gates (`00_lap_i_spec.md:700-701`) [summary].
- For scale, the wake: the cold wake alone was 46.4% of the last day's weighted spend, on a stated price assumption
  (`plan_room_stretch_2026-11-13.md:29-31`) [read].

**Verdict.** Right in kind, wrong in size. The fault is real, counted (19 of the 23 rows all three groups agree on,
`adversary_R02.md:24-25`) [read], and it returned after 9 of 11 attempts (`prior_fixes.md:211-229`) [summary]. Lap W's merge
will make 3 files DRIFT and add 2 ABSENT on each machine (`two_machines.md:162-167`) [summary], so it is the next case
whatever is built [inferred]. But the measured cost is one entry at about 1% of a seat-day per day, and that entry is a
decision owed, not an unseen copy [inferred]. Nine parts is more than that evidence carries [inferred]. [ours] Build I1,
the two static checks of E1 and E3, I7's dated holds and the merge-install-check-push order (E5); score them on Lap W's own
landing; put K1 and K2 now. I2, I3's field, I4, I5's brief lines and I8 wait for that first scored landing.

## 7. THE STOP RULE

One open question changes what gets built:
- **Does a PreToolUse hook's `additionalContext` reach the model beside a Bash tool result, in CLI 2.1.323?**
  - Yes: I8 is built in `note` mode as specified, and gate_modes' P1 (SOURCES speaks to its sender) becomes buildable
    [inferred].
  - No: `note` is dead. I8 is `refuse` (K6, his word) or is dropped in favour of the landing order of E5; P1 needs another
    channel [inferred].
  - Cheapest answer: a ten-minute probe by one pane. A temp project dir with its own `.claude/settings.local.json` holding
    one PreToolUse `Bash` hook that prints `additionalContext` with a random token. One `claude -p` run that calls Bash once.
    Count that token in the run's transcript `api-request` blobs, as `gate_modes.md:178-181` counted the pulse. Nothing
    under `~/.claude` is written [ours].

Not open, though the files treat it as open: whether a running session picks up a hook change without a restart. The
record answers it for a new PreToolUse registration (E2) [read]. A further reading level is not warranted. K1 and K2 are
his word or the librarian's ruling, not questions a reader answers [inferred].

## 8. Five checks before building anything from this folder

1. Re-read the state at the start of the lap: the four git-blob pairs and settings.json's sha256 and size in section 0,
   then a bare `-Check`'s counts. Today they equal every reader's [read]. If any moved, re-derive I6's table first [ours].
2. Run E1's closure check as a test: red at 8e85ff11^, green at 8e85ff11 and HEAD [read: probe]. Then decide whether I9's
   runtime rule still earns a place [ours].
3. Run the PreToolUse `additionalContext` probe of section 7 before any line of I8 or P1 [ours].
4. Put `p-l198-403-stall-B_2026-11-13.md:94-115` into the spec: drop the restart as a precondition for K2, I8 and hook-only
   parts; keep it for the Rust and brief parts. Then confirm on D at the first sync that changes behaviour (K1): the next
   pane ring writes a `skipped-class` row with no restart [ours].
5. Apply the "need a change first" list (`00_lap_i_spec.md:852-857`) and E5's landing order, and get K1 answered before the
   lap starts: K1 is the only drift on D with a measured cost [ours].

## What I did not open

- Machine L, any transcript, `C:/Consonance/data/*.jsonl`, the board. Every figure from them here is a reader's, cited.
- `dev/shell/install.ps1` beyond `:126-140`, `:447-452` and `:1024-1032`; I did not run it.
- The primaries behind most topic-file lines: I opened only those named [read] above. Section 1's rows were chosen where a
  second reader had not opened the primary.
- `whats-live.js`, `open-items.js`, `push-gate.js`, `sessionstart-body.js` and the branch `lap-w-h-p`.
- `hooks_drift_D_2026-11-13.md` :52-299; `00_build_paths.md` beyond sections 10 and 13 and the rows named; `in_hooks.md`;
  the Lap W spec; `landed-is-live.workflow.js`.
- The ledger beyond the 19 rows; the room's earlier installer records (`install_drift_census_2026-08-24.md` and the rest).
- Double-quoted or `path.join` requires: my closure probe does not see them.
