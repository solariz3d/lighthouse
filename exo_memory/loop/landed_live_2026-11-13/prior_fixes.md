# The earlier fixes for install drift, and how drift came back after each (reader 3, Opus, D, 2026-11-13)

1. The record holds 11 attempts. All 4 changes to the installer held against the fault each one targeted. Drift came back after every one anyway, by a route none of them covered [inferred, from section 3]. [2nd reader: DOWNGRADED. The fault A2 aimed at,
   a manifest file with no registration (L0023), is live today: board-digest.js is in `$files` (dev/shell/install.ps1:136)
   with no `$register` line, which the installer's own closing text says (install.ps1:1069-1072). See line 196.]
2. The 7 cues each lapsed: drift came back after 6, and the 7th is still open. ~~The 5 one-off syncs each decayed, within 2 days to 6 weeks~~ [2nd reader: 4 of the 5 are
   followed by a return (this file's own table, section 4; A10 is open). A7 synced L but its return is cited on D (L1088);
   on L the next recorded count is 11-13, about 7 weeks on (exo_memory/map/M.md:1030).] [inferred, section 4].
3. No attempt put a check at the moment drift is created: a landing that changes a hook's source. No attempt ever refused anything there. `-Check` is whole-machine, and no recorded run on D or L exited 0 [inferred, sections 3 and 6].
4. A per-landing check is red today on D on two recorded cases. For D635's push 21819167..fe69a9fc it gives 2 STALE and 1 ABSENT (second-reader.js, -worker.js, -note.js). For b0be06f0 it gives 1 STALE (board-digest.js) [read: my git hash-object run, section 8]. [2nd reader: all six
   git-blob ids re-derived and equal. But board-digest.js is not registered on D (hooks_drift_D_2026-11-13.md:35, :96;
   D's settings.json, 19 commands, none names it). So the second case is red for stale bytes of a file that does not
   run. A sync turns it green while the fix still runs nowhere on D. See the note under section 8.]
5. The proposal: a read-only tool run from the repo, never installed. push-gate calls it and refuses a push to main that leaves a touched hook neither live nor held. The other machine hears of it on Lap W's W3 body line. The refusal needs his word. Two hook installs on D and L; no app rebuild [ours].

Marks: [read] = opened and seen, path:line at lighthouse HEAD baa0aef9 (main checkout; `dev/shell`, `consonance/hooks` and
the briefs are unchanged since 2c396481, when I began [read: `git diff --stat 2c396481 baa0aef9` on those paths, empty]).
[summary] = from another swarm file. [inferred] = mine. [ours] = a proposal. Digests carry their function.

Run by me, read-only: `dev/shell/install.ps1 -Check` once (read whole first; -Check exits at install.ps1:757 before any
write), output to my scratchpad; `git hash-object --path=<repo path> <installed file>` (no -w, writes nothing) on four
installed copies; `git diff --name-only`, `git rev-parse`, `git log`, `git merge-base --is-ancestor`. No test file was run.

## 1. Today's state, re-measured

- -Check on D at baa0aef9: 23 ok, 10 DRIFT, 3 ABSENT, 0 HOLD; 4 DECLARED NOT REGISTERED, 1 REGISTERED NOT DECLARED,
  3 EXCLUDED BY RULING, 1 EXCLUDED BUT LIVE; 0 UNDECLARED; exit 1; 5,031 lines [read: my run, lines 54, 5012-5031].
  This is the same as the morning's figures (hooks_drift_D_2026-11-13.md:22-24) [read].
- b0be06f0 is the merge of a3cefeb9 (the same three files, +75 -2), and both are in HEAD [read: `git show --stat`,
  `merge-base --is-ancestor`].

## 2. The 19 rows, each followed to the primary its last field names

Form: H = a hook's installed copy or registration; B = a binary or bundled briefs older than the commit; P = a product
installer that kept an old payload.

| row | date, machine | form | primary opened | what the primary says |
|---|---|---|---|---|
| L0020 | 08-17, D [2nd reader: the ledger says "unknown"; the cited lines name no machine] | H | install.ps1:130-135 | the installed board-digest.js predated its dependency; a sync shipped a require for blind.js the manifest did not carry [read] |
| L0021 | 08-17, D [2nd reader: the ledger says "unknown"] | H | dev/shell/hooks/stop.js:6-9 | stop.js had no dream gate, "invisible because the file was in no repository and no installer manifest until 2026-08-17" [read] |
| L0023 | 08-18, D | H | install.ps1:283-288 | two hooks were in `$files` from the start; "a fresh install copied the .js and registered neither"; found by -Check reading `ok` [read] |
| L0089 | 08-31, L [2nd reader: the ledger says "both"; :723-730 names no machine] | H | librarian/2026-08-31.md:723-730; LEDGER.md:72 | dispatch-gate's installed copy was the 08-24 file; "the clicks are off" was said on a commit; -Check had printed "1 drifted (dispatch-gate.js)" in a run read at 05:33 and not connected [read] |
| L0092 | 08-31, L | H | map/M.md:371 | "Landed-is-not-shipped for hooks, third time" [read] |
| L0256 | 09-17, D | P | map/A.md:1277 | the track installer's INSTALL over v1 "keeps the OLD script"; UNINSTALL then INSTALL needed [read] |
| L0296 | 09-23, L | H | map/A.md:1429, :1446 | a jev-flags recipe "silent FOREVER and still passes -Check"; L's 10 DRIFT hooks all older repo versions; E's L096 digest fix not live on L [read] |
| L0448 | 10-26, D | B | librarian/2026-10-18.md:760 | the installed T-180 exe was from 10-24, so 0.4.21 "never reached his machine" [read] |
| L0472 | 10-30, D | B | map/O.md:277 | a seat's CLAUDE.md reads briefs bundled with the running build; a brief edit reaches seats after a build and a respawn [read] |
| L0565 | 11-03, D | B | handback/p-d629-wake-unused-C_2026-11-03.md:54-75 | three briefs drifted from the build; "the one instrument that says so (open-items) was not being run"; a scratch rebuild closed it [read] |
| L0613 | 11-03, D | H | room_better_2026-11-13/in_hooks.md:49-57 | bd576735 (the second reader narrowed) never reached D; the copy is from 10-01 [read] |
| L0765 | 11-09, D | B | librarian/2026-11-09.md:9 | "P installed main 9aab3ce over 82ae771", so his builder lacked three fixes until the release install [read] |
| L0996 | 11-13, L | H | map/M.md:1029-1033 | on L 15 DRIFT, 9 ABSENT; push-gate, delete-gate and sources-gate never installed there [read] |
| L1044 | 11-13, both | H | handback/p-l198-403-stall-B_2026-11-13.md:5-10 | b0be06f0 "NOT installed on any seat, as ruled for this run"; the push gate installed on L only; D "needs its own install" [read] |
| L1079 | 11-13, L | H | map/B.md:2186 | the fix could not be installed: "installing syncs all at once, the chair's call" [read] |
| L1085 | 11-13, D | H | in_hooks.md:58 | second-reader-note.js never installed on D [read] |
| L1086 | 11-13, D | H | in_hooks.md:59-66 | ask-surface.js runs from a repo path; -Check does not report it live (install.ps1:688-692 skips hooks outside `$files`) [read] |
| L1087 | 11-13, D | H | in_hooks.md:67-70 | the board-digest fix is not on D; the D copy is from 08-25 and board-digest is not registered on D [read] |
| L1088 | 11-13, both | H | handback/p-d619-hooks-tools-C_2026-11-02.md:127-130 | seven installed copies older than source on 11-02, "D454's changes, never installed" [read] |

14 rows are H, 4 are B, 1 is P [read: the table]. The attempts below are about H. Section 5 covers B and P.

## 3. The attempts, in order

Each entry gives: what was built or run; its falsifier or acceptance check; what was measured; how drift came back; and its kind.
Kind is one of: **HANDED** (a change to what is handed over: the installer, its data, its check), **CUE** (a rule, comment, ruling,
plan step or recommendation), or **GATE** (something that refuses).
I list one-off syncs as **SYNC**, a fourth column, because they change only the installed copies at one moment. The task's
three kinds do not fit them [inferred].

**A1. 2026-08-17, D. The installer starts registering, and nine untracked hooks enter the repo.**
- Built: install.ps1 now edits settings.json: "registration IS the thing that drifts, because it is the only step a machine
  can skip silently" (install.ps1:38-41). "THIS SCRIPT HAD NEVER BEEN RUN HERE" (:45). blind.js was added to the manifest
  (:130-135) [read].
- Acceptance: the header's "Idempotent — safe to re-run after every pull" (install.ps1:10) [read]. I found no
  falsifier for it [inferred: none in the header].
- Measured: "-Check found three files drifted — and two were landed the same night". So the board-digest fix "was not
  running". The cue was written the same day: "Landed is not shipped, now for hooks as well as code" (journal/2026-08-17.md:186-189) [read].
- Came back: the next day (L0023). Two hooks were shipped in the file list with no registration, and the check read `ok`
  (install.ps1:283-288). The same journal day 08-18 also has "the landed-is-not-shipped trap fired on the chair inside four minutes"
  (journal/2026-08-18.md:541-542) [read]. Mechanism: **a new hook landed with no registration, and a check passed while
  the registration was missing** [read].
- Kind: HANDED, with a CUE beside it [inferred].

**A2. 2026-08-18, D. The "ship together" rule, written into the installer.**
- Built: the two missing registrations, plus the comment "The registration and the manifest entry ship together or the next
  fresh install silently loses the hook" (install.ps1:148-153, :283-288) [read].
- Falsifier: none [inferred: none in the comment].
- Measured: nothing beyond the fix [read: :283-288].
- Came back: 08-31 (L0089, L0092). dispatch-gate followed the rule: it was added "with its registration below, same
  commit" (install.ps1:158-160). Its later commits 62a07cf and 7d40480 were never installed, and "the clicks are off" was told
  to him on the strength of a commit (librarian/2026-08-31.md:723-728) [read]. Mechanism: **a change to an installed hook
  landed with no install step. The check printed it red, and nobody connected the red to the claim** [read].
- Kind: ~~CUE~~ [2nd reader: HANDED plus CUE. The two registrations are `$register` data, the comment is the cue
  (install.ps1:283-290). The handed half's fault, a `$files` entry with no registration, is live today for board-digest.js
  (install.ps1:136, :1069-1072)] [inferred].

**A3. 2026-08-24/25, L. The census; -Check learns ABSENT and registration; the absent hooks are ruled on.**
- Built: the census (install_drift_census_2026-08-24.md) found "13 of the 14 flagged files DO NOT EXIST at the install
  destination" (:18). -Check now prints ABSENT apart from DRIFT (install.ps1:421-445), and it has a registration block
  (install.ps1:586-757, "P-UNIVERSE CLAUSE 2"). The chair committed 1e63d3a and "hand-installed the two files that needed it"
  (absent_hooks_ruling_2026-08-25.md:3-5). The ruling made eleven files DO NOT INSTALL and one INSTALL (:12-27) [read].
- Falsifiers: the census's four (install_drift_census_2026-08-24.md:296-310), e.g. "This census is degenerating if it is
  cited as saying the ten DON'T-LAND files are broken". The ruling has six (absent_hooks_ruling_2026-08-25.md:469-490) [read].
- Measured: 13 ABSENT and 1 DIFFERS, on L (:41-56) [read].
- Came back: 08-31 (L0089), on the same machine, L. Mechanism: as in A2. The instrument was fixed, and it was not run as
  part of the landing it reported on [read: librarian/2026-08-31.md:726-728].
- Kind: HANDED (the instrument), plus CUE (the ruling) and SYNC (the two hand-installed files) [inferred].

**A4. 2026-09-08, L. `-Only`, `Excluded` in the data, and UNDECLARED counted in the exit code (L044).**
- Built: `-Only` is "a filter on the input, not a branch in the writer" (handback/p-installer-only_2026-09-08.md:108-118).
  The keeper's ruling moved "into the data as `Excluded`", so a bare run honours it (:156-176). -Only is refused when combined
  with -Check, and an unknown name is refused (install.ps1:375-401). UNDECLARED now moves the exit code (install.ps1:748-757) [read].
- Falsifier (packet_installer_only_2026-09-08.md:104-105): "a hook registered after this that the keeper had excluded, or a
  `-Check` green over a file it never looked at." The hand-back registered three more ~~(p-installer-only:71-76, :154-163)~~ [2nd reader: WRONG lines. :71-76 is the
  -Check table and :154-163 the `Excluded` text. The three are at handback/p-installer-only_2026-09-08.md:219-224 and
  :573-581] [read].
- Measured: -Check before and after: DECLARED NOT REGISTERED 3 -> 0, DRIFT 0 -> 1 (another pane's in-flight file),
  UNDECLARED 0 (1 in its fixture); a new test, install-only.test.js, with 11 assertions (p-installer-only:33, :75-99) [read].
- Came back: 09-19, on D. The count there was 6 DRIFT, 2 ABSENT and 1 HOLD, with installed copies dated ~~08-10 to 08-18~~ [2nd reader: 07-27 to 08-18. dream-watch.js's copy is 07-27,
  keeper_rulings_owed_2026-09-19.md:23]
  (keeper_rulings_owed_2026-09-19.md:15-26). The next ledger row of this kind is L0296 (09-23) [read]. Mechanism: **an install
  on one machine only.** L044 was built and run on L, and D had not been synced since about 08-18; meanwhile new hook commits landed with no install
  step [inferred from the copy dates].
- Kind: HANDED, plus GATE (the refusals inside the installer) [inferred].

**A5. 2026-09-19, D. The librarian syncs six files, at his delegated word.**
- His word as the file quotes it: "do what you see is correct bc tbh i have no clue" (keeper_rulings_owed_2026-09-19.md:5) [read].
- Run: `install.ps1 -NoRegister -Only <the six>`; settings.json sha256 25c403fd… unchanged (:8) [read].
- Acceptance: "After: `-Check` reads 0 DRIFT" (:8). Falsifier: none [read: the file].
- Came back: 2 days later, 09-21 on D: 2 DRIFT, 1 HOLD and 2 ABSENT. The DRIFT was a leak fix (c809efd) and the D095
  change, both landed after the sync (handback/p-d097-install1-B_2026-09-21.md:30-38) [read]. Mechanism: **a new hook commit
  landed with no install step** [read].
- Kind: SYNC [inferred].

**A6. 2026-09-21, D. D097: a planned install with backups and a witness. The Hold flag removed.**
- Run: `-Only session-start.js,l2-overseer-worker.js,userprompt-submit.js`, then `-Only` on eight more, from the committed
  installer (install_D_2026-09-21.md:11-12, :42-49). Hold removed at b718b91 (install_proposal_L_2026-09-23.md:52-54) [read].
- Falsifier (plan_install_score_remeasure_2026-09-21.md:43-44): "the install has FAILED if, after step 5, a post-install
  L0 verdict has no `determinable` field, or the guard probe returns non-zero bytes with the flag set." [read]
- Measured: installed == repo for the 3 and then the 8; the guard probe 0 B; first verdict `determinable=true`; a near
  miss recorded and dated by `started_at` (install_D_2026-09-21.md:25-35) [read]. Scored: not falsified [read: :30-35].
- Came back: 2 days later. L0296 on 09-23: L had 10 DRIFT, and E's L096 digest fix was not live there (map/A.md:1446). On D,
  l2-overseer-worker.js was changed on 09-23 (1c5b4f2d) and that copy has been DRIFT ever since (hooks_drift_D_2026-11-13.md:61) [read]. [2nd reader: DOWNGRADED as a return.
  That worker runs only when the excluded l2-overseer.js spawns it, so it does not run on D (hooks_drift_D_2026-11-13.md:66-67).]
  Mechanism: **an install on one machine only, and a new commit with no install step** [read].
- Kind: SYNC, plus HANDED (the Hold removal) [inferred].

**A7. 2026-09-23, L. L103: a read-only audit that matches git history, a proposal, his yes, six files.**
- Built: install_drift_audit_L_2026-09-23.js reads only. It normalises line endings and searches the file's history for the
  installed copy (:57-65), and it matches registrations by exact path (:44-55). The proposal lists six files to sync and four to leave (install_proposal_L_2026-09-23.md:9-55) [read].
- His word: "Yes, all six." (librarian/2026-09-22.md:1090) [read].
- Acceptance: "`install.ps1 -Check` should show those six as `ok`" (install_proposal_L_2026-09-23.md:42). Falsifier: none
  [read: grep of the hand-back and the proposal].
- Measured: "`-Check` shows all six `ok`"; the overall exit was 255 (librarian/2026-09-22.md:1090) [read].
- Came back [2nd reader: A7 synced L; L1088 is D, a machine A7 never touched. The first return on L itself in the 19
  rows is L0996 / L1079, 11-13]: L1088 (11-02, D), seven copies older than the source: "D454's changes, never installed" (p-d619:127-130).
  Then L0613 (11-03), and on L, 15 DRIFT and 9 ABSENT by 11-13 (M.md:1030) [read]. Mechanism: **new hook content
  landed on both machines with no install step.** The D454 data-dir change was tested on a fresh stranger's home, where the
  installer "registered 19 hooks across 7 events" (handback/p-d454-install-E_2026-10-24.md:52), and never on the room's
  own machines. Also **an install on one machine only:** push-gate, delete-gate and sources-gate were installed on D and never on L
  [read: M.md:1030; hooks_drift_D :39-40 shows them present on D].
- Kind: SYNC, plus an instrument that was never adopted [inferred: the audit script is in `loop/`, not in tools].

**A8. 2026-10-17, the briefs. Installs are named as a landing pane's work.**
- Text: "Merging, conflict fixes, the full suite plus TAP, installs, the credential scan, pushes and releases are a landing
  pane's work" (consonance/src-tauri/brief/BUILDING.md:52-53; again at :128-130) [read].
- Falsifier: none. No brief names `install.ps1` or a hook install step [read: grep of the brief folder, 0 hits for install.ps1].
- Came back: 11-02 and 11-03. D635's landing staged the exe and left the hook copies to "the restart"
  (handback/p-d635-room-landing-C_2026-11-03.md:74-78). The order then was "no desktop exe swap; the laptop takes the fixes
  from main" (:155, the chair's relay of his 11:07 words), and the hooks went with the swap (:176) [read]. Mechanism: **the
  install was coupled to a restart, and excluded on purpose when the restart was declined** [read].
- Kind: CUE [inferred].

**A9. 2026-11-02/03, D. The audit's recommendation D and the 11-03 plan's restart step.**
- Text: "D. Bring the installed hooks up to the room's source (a prove-it install with backups). Recommend yes, after A and
  B so fewer move" (room_audit_result_2026-11-02.md:36). The plan's restart step reads "2. swap in the new ones; 3. sha256-compare"
  (plan_room_fixes_2_5_2026-11-03.md:36-40). It also says "The seven hooks D619 found older than their source are NOT reinstalled in this pass"
  (:41) [read].
- Falsifier: the narrowing's own is to "Revisit the amendment when either happens within two weeks of install"
  (handback/p-d631-reader-narrowed-P_2026-11-03.md:20). Its clock never started on D (00_build_paths.md, 2nd reader table,
  line "D631 clock not started on D": OK) [summary].
- Measured: never run. The installed second-reader.js still equals aadcc10a (hooks_drift_D_2026-11-13.md:104) [read]. My
  run shows its git-blob as abcbff60, against fe69a9fc's 2d161fbd [read].
- Came back: 11-13: L0996, L1044, L1079, L1085, L1086, L1087, L1088 [read]. The cost on record for this one: 237 `ok` model
  reads of call_librarian rings since 11-03 15:25Z (hooks_drift_D_2026-11-13.md:112-115), 2,479,021 tokens at 15:27Z
  (00_build_paths.md:346) [read]. Mechanism: **excluded on purpose, and coupled to decisions A and B and a restart** [read].
- Kind: CUE [inferred].

**A10. 2026-11-13, L. The push gate installed on L alone, and a rule written: one entry at a time.**
- Run: `-Only push-gate.js` on L, "seen to fire through the real Bash path" (p-l198-403-stall-B:7-10). The rule: "on L, never
  a bare run mid-work. One entry at a time with `-Only`, then `-Check`" (map/M.md:1033) [read].
- Falsifier: none of its own. Lap I's registered clause covers the next landings (plan_vector_swarm_2026-11-13.md, "Lap I is
  degenerating if") [read].
- Measured: on L only. D's push-gate is the e8f85486 copy, DRIFT (hooks_drift_D_2026-11-13.md:149-150) [read].
- Came back: open. b0be06f0 is "NOT installed on any seat, as ruled for this run" (p-l198:5) [read].
- Kind: SYNC, plus CUE [inferred].

**A11. Throughout: `open-items` and `-Check` as instruments, run by hand.**
- `open-items.js` compares the briefs bundled beside the exe with the repo (seed-carrier, consonance/tools/open-items.js:178-272),
  and checks one hook, the userprompt-submit HOLD (:275-330). It has no check for hook drift in general [read: its five ids].
  Nothing in the app, the hooks or chain-status.js calls it [read: grep, 0 callers outside tests and the generator].
- -Check on record: 09-08 L, exit 1 on both runs (p-installer-only:73). 09-21 D, exit 255 (install_D:28). 09-23 L, exit 255
  (librarian/2026-09-22.md:1090) and exit 1 ~~(map/A.md:1446)~~ [2nd reader: the exit is not at A.md:1446-1447; it is
  handback/p-l103-drift-A_2026-09-23.md:30, "exited **1** here, not the 255"]. 11-13 D, exit 1 (mine) [read]. I found no run on a room machine
  that exited 0. ~~The one exit 0 on record is a stranger's fresh home~~ [2nd reader: DOWNGRADED. At least two exit 0s
  are on record, both in a stranger's profile: handback/p-consumer-parity-B_2026-10-08.md:96 and the one cited here.
  Neither is a room machine, so the conclusion stands] (p-d454-install-E:53) [read]. So -Check has been red on
  every recorded day, and its red does not say which landing is new [inferred].

## 4. Counts by kind

| kind | attempts | drift came back after | did the fault it targeted come back? |
|---|---|---|---|
| HANDED (installer, its data, its check) | 4: A1, A3, A4, the Hold removal in A6 | 4 of 4 | ~~0 of 4 found~~ [2nd reader: DOWNGRADED. The three named faults have not recurred. Two others a handed fix aimed at have: a `$files` entry with no registration (A2's, L0023) is live for board-digest.js (install.ps1:136, :1069-1072); and A4's one-entry install existed for two months when L1079's pane wrote "installing syncs all at once" (map/B.md:2186), the same day M.md:1032-1033 named `-Only`. The handed fix held in the script and did not reach the seat] : ABSENT has not been read as DRIFT since A3, no bare run has overridden a ruling since A4, and no HOLD has fired against an empty destination since A3 [inferred, from the 19 rows and the files above] |
| CUE (rule, comment, ruling, brief line, recommendation, plan step) | 7: A1's journal line, A2, A3's ruling, A8, A9 (two), A10's rule | 6 of 7; A10's is open | the cue itself lapsed every time [read: sections A1-A9] |
| SYNC (one-off install) | 5: A3's two files, A5, A6, A7, A10 | 4 of 5, after 2 days (A5, A6), 6 weeks (A7) and about 1 week (A3, to 08-31); A10 is open | not applicable |
| GATE that refuses | 1 group, inside the installer only (A4: Excluded never registered, -Only refusals; plus the Conflicts REFUSED of 08-31, install.ps1:928-944) | the gates did not stop drift; they govern how the installer runs, not whether a landing is live | 0: no recorded run has overridden an excluded entry [inferred] |

The routes by which drift returned, counted over the 9 returns above [inferred, from the mechanisms named in section 3]:
- A new hook or a change landed with no install step: 7 (after A1, A2, A3, A4, A5, A6, A7).
- An install on one machine only: 3 (after A4, A6, A7).
- Excluded on purpose, or coupled to a restart that did not happen: 2 (after A8, A9).
- A check passed while a registration was missing: 1 (after A1). This is also live today. ask-surface.js runs from a repo path
  and -Check counts it as DECLARED UNMANAGED, not live (in_hooks.md:59-66).
- ~~A hand edit of an installed file: 0 found.~~ [2nd reader: WRONG. On 10-05 on D, pane A wrote its edits straight
  into the installed copies: "The same edits are in the installed copies under `C:\Users\nname\.claude\shell`"
  (handback/p-tphooks-A_2026-10-05.md:6). Pane B then copied four more by hand, one "kept LF as installed"
  (handback/p-tphooks2-B_2026-10-05.md:41, :48). settings.json was hand-edited on 09-07 (install.ps1:22-24) and at D105
  (install.ps1:264). Today's hashes cannot show this route, because a hand copy of a committed file equals a commit.]
  Every drifted copy equals an older commit (hooks_drift_D_2026-11-13.md:49-50, A7's audit) [read].

## 5. What the record says will hold and what will lapse

- **Expect a change to what is handed over to hold.** ~~Each one ended the fault it was aimed at, and none of those faults is
  on the ledger again~~ [2nd reader: weaker than stated. It holds in the script and lapses at the seat: see the section 4
  correction (board-digest.js with no `$register` line; `-Only` unknown to the pane at map/B.md:2186)] [inferred, section 4]. The installer's own rule says it: "THE RULING WAS PROSE AND THIS SCRIPT WAS
  DATA, SO THE SCRIPT WON" (install.ps1:26) [read].
- **Expect a cue to lapse, and expect a one-off sync to decay.** Every cue was followed by a return. Every sync reset one
  machine and decayed at the next hook commit [inferred, section 4].
- **A gate at the point drift is created has never been tried.** The only refusals sit inside the installer [read: section
  3]. So the record cannot say whether such a gate holds. It can say that a check nobody is made to run does not hold. -Check existed
  from 08-17, printed red on 08-31 and was not connected (librarian/2026-08-31.md:726-728) [read].
- B and P forms (L0448, L0472, L0565, L0765, L0256) have the same shape for the exe and the bundled briefs. The instrument
  exists (open-items seed-carrier) and is not run by anything (handback/p-d629-wake-unused-C_2026-11-03.md:59-62) [read].

## 6. What every earlier attempt left undone. A new lap must not leave these undone [inferred, from sections 3 and 4]

1. **Nothing binds a landing to the installed copy.** No step says: this landing changed a `$files` source, so on this machine
   the installed copy is now that blob, or it carries a named hold. BUILDING.md:52 says "installs", and nothing checks it.
2. **The check is whole-machine and always red.** -Check has exited non-zero on every recorded room run (A11). Its verdict
   comes after about 4,950 UNCLAIMED lines (in_hooks.md:16-21) [read]. A new landing's stale file reads exactly like the
   ten old ones.
3. **The other machine is never told.** Every fix ran on one machine. Each machine learned the other's count days later, from a handoff
   (L0296, L0996) [read].
4. **Installs ride on a restart or a ruling, all or nothing.** [2nd reader: DOWNGRADED. The tool is not all or nothing:
   `-Only` syncs one entry (install.ps1:375-399) and was used on 09-19, 09-21, 09-23 and 11-13. What is all or nothing is
   the decision, and the belief: "installing syncs all at once" (map/B.md:2186).] That includes changes that alter nothing on D, such as the data-dir
   `return null` -> `~\.consonance` in five hooks (hooks_drift_D_2026-11-13.md:151-153) [read].
5. **Nothing asks the running copy.** Every check reads files. The running second reader shows its age in its own ledger:
   0 of 3,955 rows carry `toolUseId` (hooks_drift_D_2026-11-13.md:129). No tool reads that [read].
6. **Repo-path registrations are invisible** to the check (install.ps1:688-692, in_hooks.md:59-66) [read].
7. **No held state for files.** `Excluded` names a deliberate non-registration (install.ps1:232-241, :855-863). There is no
   word for "this file is deliberately not synced here, by this ruling, since this date". So second-reader.js, which is held for his
   word (hooks_drift_D_2026-11-13.md:116-121), reads the same as forgotten drift [read].

## 7. Registered falsifiers about installs, due or unscored today

| where | clause (short, verbatim where quoted) | state today |
|---|---|---|
| packet_installer_only_2026-09-08.md:104-105 | "a hook registered after this that the keeper had excluded, or a `-Check` green over a file it never looked at" | unscored. I found no case of the first clause in the 19 rows. stop.js is EXCLUDED BUT LIVE on D, but it was live on D before 09-08 (install.ps1:245-255). -Check has never been green, so the second clause cannot fire as worded [inferred] |
| handback/p-installer-only_2026-09-08.md:~~71-76~~ [2nd reader: :219-224] | build an exact-leaf `-Unregister` if a seat hand-removes a registration "for a reason other than a hand-registration" | unscored. D105's hand removal of the overseers (install.ps1:259-266) came from his ruling, not from an installer add [inferred] |
| handback/p-installer-only_2026-09-08.md:~~154-159~~ [2nd reader: :573-577] | a ruling overridden "because nobody added the `Excluded` line" means the registration should read the ruling documents | unscored; no case found in the 19 rows [inferred] |
| handback/p-installer-only_2026-09-08.md:~~160-163~~ [2nd reader: :578-581] | "`-Only` earns its keep or it is decoration … one season on" | ~~due about now.~~ [2nd reader: one season from 09-08 is about early December, so not yet due [inferred]; the uses listed below already answer it.] `-Only` was used on 09-19, 09-21 (twice), 09-23 and 11-13 (sections A5-A7, A10), so it would read as not falsified. Unscored [read for the uses; inferred for the verdict] |
| install_drift_census_2026-08-24.md:296-310 | four clauses (DON'T-LAND source; ferry-watch CRLF; "degenerating if cited as saying the ten DON'T-LAND files are broken"; test residue) | no score found. The 09-23 note on the ruling says rows 3 and 9 "no longer describe either machine" (absent_hooks_ruling:28-29). That is a note, not a score [read] |
| absent_hooks_ruling_2026-08-25.md:469-490 | six clauses, including the zero-spend, closed-subsystem and findings-return INSTALL clauses | no score found [inferred: I searched by file name only] |
| handback/p-sync-launch-retire_2026-09-09.md:283-297 | the desktop wakes as the synced seats; "MIGRATE on a record the desktop itself authored" | state sync, not hooks. Listed because W5 touches the launch pull. Not opened for a score |
| handback/p-d631-reader-narrowed-P_2026-11-03.md:20 | revisit the narrowing "within two weeks of install" | not due: the install never happened on D (A9) [read] |
| plan_install_score_remeasure_2026-09-21.md:43-44 | install FAILED if no `determinable` field, or the probe gives non-zero bytes | scored, not falsified (install_D_2026-09-21.md:30-35) [read] |
| plan_vector_swarm_2026-11-13.md, "Lap I is degenerating if" | at the first two landings of a hook or app change after Lap I is live, the installed copy is again older and no seat was told | not yet due [read] |

## 8. The smallest change that would work [ours], and its check, red today on recorded cases

**C1. A read-only tool run from the repo: `consonance/tools/landed-live.js`.** It is never installed, so it cannot drift. It
takes the same route by which chain-status.js runs from `room_path` (dev/shell/hooks/userprompt-submit.js:263) and by which
carrier-drift-watch.js loads its tool (consonance/hooks/carrier-drift-watch.js:75-113) [read].
- `--range A..B`: for each `$files` entry whose `From` changed in A..B, compare the installed copy's git-blob with B's blob.
  It reads `$files` the way dream-gate.test.js does, and the `Src` key stays out of it (install.ps1:344-351). The blob is
  computed in node over CRLF-normalised bytes, pinned equal to `git hash-object --path` by a test. It also reads
  registration from settings.json by exact leaf (the install.ps1:692 rule) and history-matches a stale copy
  (install_drift_audit_L_2026-09-23.js:57-65).
  [2nd reader: a hole on record. Only files the range touched are checked, not what they `require`. L0020 is that case
  (board-digest's new require of blind.js, install.ps1:130-134), and p-l198 says of today's fix "NEVER board-digest.js
  alone" (handback/p-l198-403-stall-B_2026-11-13.md:6). On a machine with an old blind.js, syncing board-digest alone
  would read LIVE. The touched set needs the `Lib` neighbours of each touched entry (install.ps1:135) [ours].]
- It prints one line per touched file: `LIVE`, `STALE (installed = <commit>, N behind)`, `LOCAL EDIT` (no commit matches),
  `ABSENT`, `NOT WIRED`, `HELD <reason>`, `EXCLUDED <ruling>`, or `RUNS FROM REPO`. It exits 1 on STALE, LOCAL EDIT,
  ABSENT or NOT WIRED.
  [2nd reader: two gaps. (1) `LIVE` would mean "bytes match", the meaning `ok` was found not to have on 08-18
  (install.ps1:283-286). A `$files` entry with no `$register` line and no settings.json command, board-digest.js on D,
  has no state in this list, so it reads LIVE after a sync while nothing runs it. It needs a `NOT RUN HERE` state
  [ours]. (2) It fires wrongly on states that are ruled: userprompt_pulse.py on D is NOT WIRED, and the Conflicts
  guard refuses to wire it because the Node pulse runs (install.ps1:927-944; hooks_drift_D_2026-11-13.md:78-80). Under
  C3 any push touching it is denied, and no install can clear it, only a holds row.]
- `--summary`: one short field for a start line, for example `hooks 10 behind (oldest 09-23 l2-overseer-worker.js), 3 absent, 0 held`.
- It also reports the B form: when A..B touches `consonance/src-tauri/brief/` or `src/*.rs`, it compares the briefs beside the
  running exe, by reusing open-items' seed-carrier check, and the exe's mtime with the range's newest `.rs` commit.

**C2. A held state for files: `dev/shell/holds.json`.** Each entry carries a leaf, a machine, the reason with a path, and a date.
landed-live reads it, and nothing else does. It gives "deliberately not synced here" a name, the way `Excluded` names it for
registrations (install.ps1:247-249). Seed it with the per-hook rulings hooks_drift_D_2026-11-13.md names as his (sections 4,
11, 12 and 13). Each of those is his word, not mine.
[2nd reader: the simplest way to satisfy C3 without fixing anything is a holds row, and this design gives a hold no
clock. The costliest recorded case is a hold: second-reader.js was kept back "only at the restart"
(plan_room_fixes_2_5_2026-11-03.md:20, as quoted in hooks_drift_D_2026-11-13.md:116-117) and stayed stale for ten days,
237 model reads by that file's count (hooks_drift_D_2026-11-13.md:112-115; 268 `ok` rows of that kind in
`C:/Consonance/data/second-reader.jsonl` at my read, still growing). With a reasoned row, C3 lets the D635 push through
and that cost still happens. A hold needs an `until` date, after which it reads STALE again [ours]. This is the A8/A9 route
("excluded on purpose") given a name.]

**C3. The gate: push-gate refuses the push that creates drift.**
- In `decide()` (consonance/hooks/push-gate.js:155-168): when the push target is the room repo and the pushed range touches
  a `$files` source, `require` landed-live from `room_path` and deny unless every touched entry is LIVE, HELD or EXCLUDED on
  this machine. The deny names the file and the fix (`install.ps1 -Only <leaf>`, or a holds.json row).
- It keeps push-gate's pattern: fail open on its own error, with the `allow-error` row (:161-164, :185). push-gate is outside
  the `gates_mode` switch (handback/p-gate-switch-E_2026-10-09.md:9-14), so light mode does not soften it.
- Why the push: it is the one act every landing ends in (BUILDING.md:52-55), and drift is born there. It catches one machine.
  The other machine's half is C4.

**C4. The other machine is told at start: one field on Lap W's W3 body line.**
- Add `hooks <summary>` to the W3 line (00_lap_w_spec.md:321-325), computed by `require` of the repo's landed-live, not by an
  installed copy. Add `body <LIVE|STALE>` too, because sessionstart-body.js is itself an installed copy and W3 asks for
  its own install on D and on L (00_lap_w_spec.md:367-368) [read].
- After L pulls D's push, L's next start prints its own count. W5's receipt can add one line naming the `$files` sources the
  pull touched (00_lap_w_spec.md:65). That needs the Rust rebuild W5 already needs.
- On its own this is a cue, and the record predicts it lapses (section 5). The gate (C3) is the part expected to hold.
  [2nd reader: DOWNGRADED. C3 lives in push-gate.js, an installed copy, and a gate at the push has lapsed by exactly this
  route already. push-gate landed with its registration on 10-06 (2cbc3608; install.ps1:184-188). It was never installed
  on L until 11-13: "on L the push gate has only ever run when a pane ran it by hand" (map/M.md:1030). On D its copy is
  DRIFT today (my -Check, line 33). So C3 holds only where push-gate is current, which is the thing it checks. It also
  never fires on the machine that pulls: on D it would not fire for b0be06f0, which was pushed from L. That half is C4,
  a cue.]

**The failing check, on recorded cases. Each is red today on D and goes green after the install or a holds row.**
- Case L0613 / L1085, D635's push of 11-03 (handback/p-d635-room-landing-C_2026-11-03.md:157, the pushed range):
  `landed-live --range 21819167..fe69a9fc` gives STALE second-reader.js (blob abcbff60 installed, 2d161fbd landed), STALE
  second-reader-worker.js (63ec0296 against b79bbafe) and ABSENT second-reader-note.js (3427cbbd). Exit 1 [read: my
  `git hash-object --path` run, the same comparison]. That push was allowed at 17:09:36Z (p-d635:164-165). Under C3 it is
  denied until the three are installed or held.
- Case L1079 / L1087: `--range b0be06f0^1..b0be06f0` gives STALE board-digest.js (142a6541 against 8b504225), exit 1 [read: my run].
  [2nd reader: the digests reproduce (`git rev-parse b0be06f0:consonance/hooks/board-digest.js` 8b504225;
  `git hash-object --path` on D's copy 142a6541). It is red, but not for the recorded reason. L1087's fault on D is
  that "the fix runs on neither machine", and on D that is because board-digest.js is registered nowhere
  (hooks_drift_D_2026-11-13.md:96; in_hooks.md:67-68). After `-Only board-digest.js` this probe goes green and the fix
  still does not run on D: a false green. L1079 is an L case: L wires the digest (map/A.md:1446, "6 wired ...
  board-digest+blind"), and D cannot probe L. As written this case does not show the check works. The D635 case does:
  second-reader.js and its worker are wired on D (settings.json PreToolUse) and stale, so it is red for the reason given.]
- A fixture test for each case: a temp repo at those two commits, and a temp destination holding the old blobs. It is red
  before the tool exists and green after. There is a mutant that treats ABSENT as LIVE, and an edge case each for an empty range, a
  missing settings.json (UNKNOWN, no fallback, as install.ps1:610-616), a CRLF-only difference (LIVE) and a local edit.
- A push-gate test: a synthetic range touching a `$files` source with a stale destination is denied; with a holds row it is
  allowed and the message names the hold.

**What each part needs.**
- Rebuild of the app (Rust): none for C1-C4. Only W5's receipt line rides the W5 rebuild.
- Hook installs: `-Only push-gate.js` on D and on L, after C3 lands, each with the four checks of
  hooks_drift_D_2026-11-13.md:306-313. W3's body hook is Lap W's own install. landed-live.js needs no install.
- Restarts: none for push-gate, because it is already registered and the file is read fresh per call
  (install_proposal_L_2026-09-23.md:59-63). W3 is a new registration, so `/hooks` or a restart (install.ps1:1028-1030).
- His word: a new refusal on pushes (C3); each holds.json reason that stands in for a ruling of his; and the backlog itself.
  hooks_drift_D's order (c) syncs 1-8 change no behaviour on D (hooks_drift_D_2026-11-13.md:318-338). Steps 9-10, dispatch-gate,
  carrier-drift-watch and stop.js are his. Nothing is retired or deleted: holds.json adds a state and removes none, and his
  rule "change how often, never delete" (briefs/lighthouse_the_room.md:209; the task cited :204, which has drifted) is kept.
- Tier: prove it. It decides what counts as live, and it denies pushes [read: ~/.claude/CLAUDE.md, the prove-it list].

**Its falsifier, registered here before it is built [ours].** C1-C4 are degenerating if any one of these happens at either
of the first two landings, after they are live, that touch a `$files` source. Who reads it: a seat that is not the author,
from push-gate.jsonl, -Check and the next start lines.
- The push goes through with a touched entry that is neither LIVE nor HELD on the pushing machine.
- The other machine's next start does not print the count.
- A holds row is added with no reason that points at a ruling.

## What I did not open

- Machine L. Every L figure is from the record (M.md:1030, map/A.md:1446, p-l198, B.md:2186). I did not see L's push-gate.jsonl,
  so whether L's landing panes logged pushes there before 11-13 is unknown.
- The hand-backs behind L044's test file (install-only.test.js) and D105, beyond the lines cited; p-l083-carriers-E; p-d098-*;
  p-d105-*; p-tphooks-*; the journals' other instances (journal/2026-08-17.md:626, :673; 2026-08-22.md:28, :479) beyond one line each.
- About 190 other files that mention install.ps1, whose titles do not name an install, a drift or a sync. Of the 29
  `handback/*install*` files I opened only those for the room's hook installer. The rest are T-180 or consumer installs.
- Any transcript or C:/Consonance/data log. Every cost figure above is quoted from a file that cites its ledger.
- Whether an earlier -Check run on a room machine exited 0. I read only the runs that the files above record.
- Timing: landed-live's cost per call is not measured. The "about 36 file reads plus one git ls-tree" estimate is [inferred].
- Whether a scoring file exists for the census or ruling falsifiers under another name. I searched by file name only.
- The second reader of this file, which is a later step.

## Second reader

Adversarial second reader, Opus, on D, 2026-11-13, at lighthouse HEAD baa0aef9 (main checkout). Line numbers in the
table are the first reader's, before my in-place notes moved them. Run by me, read-only: `install.ps1 -Check` once
(read first: `param` at install.ps1:70, the -Check branch exits at :757 before any write; output to my scratchpad);
`git rev-parse`, `git hash-object --path` (no -w), `git diff --name-only/--stat`, `git log`, `git merge-base
--is-ancestor`; a node readline pass over `C:/Consonance/data/second-reader.jsonl` taking counts and field names
only; a node read of `~/.claude/settings.json` printing hook commands. No test file was run. Nothing else was written.

### What I checked

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 6, 296-298 | D635 range: 2 STALE, 1 ABSENT, the six digests | `git diff --name-only 21819167 fe69a9fc`; rev-parse; hash-object | OK | range touches second-reader{,-worker,-note}.js; abcbff60/2d161fbd, 63ec0296/b79bbafe, note absent |
| 6, 300 | b0be06f0 case red: STALE board-digest.js | rev-parse; hash-object; settings.json | DOWNGRADED | digests equal (142a6541/8b504225), but the file is wired nowhere on D: red for bytes, green after sync with the fix still not running |
| 10 | hooks, shell, brief unchanged 2c396481..baa0aef9 | `git diff --stat` | OK | 0 lines for those paths |
| 19-21 | -Check: 23/10/3/0, 4/1/3/1, 0 UNDECLARED, exit 1, 5,031 lines | my run | OK | identical; UNCLAIMED 4,950 (my output line 59) |
| 22 | b0be06f0 merges a3cefeb9, 3 files +75 -2, in HEAD | git log/diff/merge-base | OK | parents cd9c91d0, a3cefeb9; both ancestors of HEAD |
| 32-34 | L0020, L0021, L0023 primaries | install.ps1:130-135, :283-288; dev/shell/hooks/stop.js:6-9 | OK | quotes present (stop.js quote at :7-8) |
| 32-33 | L0020, L0021 on D | 00_ledger.md rows | DOWNGRADED | ledger machine "unknown"; cited lines name none |
| 35 | L0089: 08-24 copy, "1 drifted" read and not connected | librarian/2026-08-31.md:723-728; LEDGER.md:72 | OK | both say it; the ledger's machine is "both", not L (noted in place) |
| 36-41 | L0092, L0256, L0296, L0448, L0472, L0565 primaries | M.md:371; A.md:1277, :1429, :1446; librarian/2026-10-18.md:760; O.md:277; p-d629:54-75 | OK | each line says what the row says; p-d629's quote is at :67 |
| 42-50 | L0613, L0765, L0996, L1044, L1079, L1085-88 primaries | in_hooks.md:49-70; librarian/2026-11-09.md:9; M.md:1029-1033; p-l198:5-10; B.md:2186; p-d619:127-130 | OK | all present as quoted; L figures are the record's, not re-derivable from D |
| 52 | 14 H, 4 B, 1 P | the table | OK | recounted |
| 64-69 | install.ps1 header quotes; journal 08-17:186-189 | install.ps1:10, :26, :41, :45; journal | OK | present |
| 71 | journal 08-18 "trap fired ... inside four minutes" | journal/2026-08-18.md:541 | OK | present |
| 81-82 | dispatch-gate added with its registration, same commit | install.ps1:158-161 | OK | present |
| 85 | A2's kind is CUE | install.ps1:283-290 | WRONG | it shipped two `$register` entries (data) plus a comment: HANDED plus CUE |
| 88-94 | census 13 of 14 absent; ABSENT branch; registration block; ruling 11+1; falsifiers | census :18, :296-310; install.ps1:421-445, :587; ruling :3-5, :12-27, :469-490 | OK | present; the census was on L (`C:\Users\zackn`) |
| 100-103 | -Only a filter; refusals; UNDECLARED in exit; packet falsifier | p-installer-only:107-118; install.ps1:375-397, :748-757; packet:104-105 | OK | present |
| 104 | three more falsifiers at :71-76, :154-163 | p-installer-only, whole-file grep | WRONG | they are at :219-224 and :573-581 |
| 105-106 | 3 -> 0, DRIFT 0 -> 1, 11 assertions, exit 1 both | p-installer-only:33, :73, :75-99 | OK | present |
| 107 | 09-19 D: 6 DRIFT, 2 ABSENT, 1 HOLD; copies 08-10 to 08-18 | keeper_rulings_owed:15-26 | WRONG (dates) | counts OK; dream-watch's copy is 07-27 (:23) |
| 114-118 | his word; settings sha unchanged; "0 DRIFT"; 09-21 return via c809efd | keeper_rulings_owed:5, :8; p-d097:30-41; `git log -1 c809efda` | OK | c809efda is 2026-09-20, after the sync; 2 ABSENT at p-d097:41 |
| 123-128 | D097 installs, falsifier, witness, not falsified | install_D:11-12, :25-35, :42-49; remeasure plan:43-44 | OK | present |
| 129-130 | A6 return: l2-overseer-worker DRIFT on D | hooks_drift_D:61, :66-67 | DOWNGRADED | the worker does not run on D; dormant drift |
| 135-140 | audit script lines; "Yes, all six."; six `ok`; exit 255 | audit.js:44-65; proposal:9-55, :42; librarian/2026-09-22.md:1090 | OK | present |
| 141-146 | A7 came back via L1088 | p-d619:127-130; M.md:1030 | DOWNGRADED | A7 synced L; L1088 is D |
| 144 | D454 fresh home: 19 hooks across 7 events | p-d454-install-E:52 | OK | present, in a scratch USERPROFILE |
| 150-152 | BUILDING.md "installs" lines; 0 install.ps1 hits in briefs | BUILDING.md:52-53, :128-130; grep | OK | 0 hits, my grep |
| 153-156 | D635: hooks left to the restart; 11:07 order; hooks went with the swap | p-d635:74-78, :155, :176 | OK | present |
| 160-167 | audit rec D; restart steps; "NOT reinstalled"; D631 falsifier; aadcc10a | room_audit:36; plan_room_fixes:36-41; p-d631:20; hooks_drift_D:104 | OK | present |
| 169-171 | 237 reads; 2,479,021 tokens | hooks_drift_D:112-115; 00_build_paths.md:346 | OK | as of 15:27Z; my pass now: 268 `ok` call_librarian rows since 11-03 15:25Z, 4,024 rows, 0 with toolUseId |
| 175-179 | the L rule; D push-gate e8f85486 | M.md:1033; hooks_drift_D:149-150 | OK | present |
| 184-186 | open-items: seed-carrier, HOLD, five ids, no callers | open-items.js:178, :275, :365, :410, :444; `git grep` | OK | only tests, the generator, and a comment at dev/rebuild-on-close.ps1:31 |
| 187-188 | -Check exits 09-08 1, 09-21 255, 09-23 255 | p-installer-only:73; install_D:28; librarian/2026-09-22.md:1090 | OK | present |
| 188 | 09-23 L exit 1 at map/A.md:1446 | A.md:1446-1447 | WRONG (cite) | it is p-l103-drift-A:30 |
| 189 | the one exit 0 on record is p-d454 | grep of loop, handback, librarian, map, journal | DOWNGRADED | also p-consumer-parity-B:96, also a stranger profile |
| 3, 196, 211 | HANDED fixes held; their faults not on the ledger again | install.ps1:136, :1069-1072; B.md:2186; M.md:1032-1033 | DOWNGRADED | A2's fault is live for board-digest.js; -Only was unknown to the L1079 pane |
| 4, 198 | each sync decayed | this file's table; M.md:1030 | DOWNGRADED | 4 of 5; A7's cited return is on the other machine |
| 199 | Conflicts REFUSED | install.ps1:927-944 | OK | present |
| 207 | hand edit of an installed file: 0 | p-tphooks-A:6; p-tphooks2-B:41, :48; install.ps1:22-24, :264 | WRONG | 10-05 edits written into installed copies on D; settings.json hand edits 09-07 and D105 |
| 212-218 | install.ps1:26 quote; -Check red 08-31 not connected | install.ps1:26; librarian/2026-08-31.md:726-728 | OK | present |
| 227, 234 | about 4,950 UNCLAIMED; 0 of 3,955 toolUseId | my -Check; my ledger pass | OK | 4,950; 0 of 4,024 now |
| 231 | installs are all or nothing | install.ps1:375-399 | DOWNGRADED | the tool is per-entry since 09-08; the decision and the belief are not |
| 235-236 | repo-path hooks skipped; Excluded lines | install.ps1:688-692, :232-241, :855-863 | OK | present |
| 244-247 | p-installer-only falsifier lines :71-76, :154-159, :160-163 | p-installer-only:219-224, :573-581 | WRONG (cites) | the clauses exist at the corrected lines |
| 247 | "-Only earns its keep" due about now | p-installer-only:578-581 | DOWNGRADED | one season from 09-08 is about December [inferred] |
| 248, 253 | ruling note :28-29; Lap I clause | absent_hooks_ruling:28-29; plan_vector_swarm:144-146 | OK | present |
| 258-261 | chain-status route; carrier-drift-watch route; `Src` key | userprompt-submit.js:260-265; carrier-drift-watch.js:75-118; install.ps1:344-351 | OK | present |
| 278-282 | decide(); allow-error fails open; outside gates_mode | push-gate.js:155-168, :185, :192; grep | OK | 0 `gates_mode` reads in push-gate.js; its watchdog fails open at 8 s (:33, :179) |
| 287-291 | Lap W W3 line and its install | 00_lap_w_spec.md:321-325, :367-368 | OK | present |
| 292 | C3 is the part expected to hold | git log 2cbc3608; install.ps1:184-188; M.md:1030; my -Check | DOWNGRADED | push-gate itself sat uninstalled on L 10-06 to 11-13, and is DRIFT on D |
| 298 | D635 push allowed 17:09:36Z | p-d635:164 | OK | present |
| 312 | hooks read fresh per event; /hooks or restart for new registrations | proposal_L:59-63; install.ps1:1028-1030 | OK | present |
| 316 | his rule is at :209, not :204 | briefs/lighthouse_the_room.md:209 | OK | grep finds it at :209 only |

**Tally:** 52 rows checked. OK 36, WRONG 6, DOWNGRADED 10, UNSUPPORTED 0.

### The design, tested

- **C1, landed-live.** Simplest pass without a fix: sync the touched file alone. It reads LIVE when (a) the file is
  wired nowhere (board-digest.js on D), or (b) a neighbour it requires is stale (L0020; p-l198:6). Wrong fire: NOT WIRED
  exits 1 on ruled states no install can clear (userprompt_pulse.py on D, the Conflicts guard). Earlier lapse of the
  same kind: -Check, a read-only instrument run by hand, red on every recorded room run and not connected on 08-31.
  [ours] Add a `NOT RUN HERE` state (in `$files`, no settings.json command, no `$register` line), and widen the touched
  set to each touched entry's `Lib` neighbours.
- **C2, holds.json.** Simplest pass: a reasoned hold with no end. The 11-03 "only at the restart" hold is the costliest
  recorded case, and it would pass C3. Earlier lapse of the same kind: the userprompt-submit `Hold` flag, open from the
  08-24 census to its removal at b718b91 on 09-21; and A9's "NOT reinstalled in this pass". [ours] A hold carries
  `until`, and an expired hold reads STALE.
- **C3, the push gate.** Simplest pass: push-gate fails open on any error, an 8 s hang, or a target dir it cannot
  resolve (push-gate.js:33, :161; the 16:11:52Z `allow-error` at p-d635:171); or the pushing machine's push-gate is an old
  copy, as D's is today. Wrong fire: a push the keeper ordered while also ordering no install on that machine (D635,
  p-d635:155) is denied until holds rows are written; so is any push touching a dormant file (l2-overseer-worker.js on
  D). Earlier lapse of the same kind: push-gate itself, absent on L for 38 days (M.md:1030). The gate never reaches the
  pulling machine.
- **C4, the W3 field.** Simplest pass: a count printed and not read. Earlier lapse: -Check's red; the stale-lap pulse
  line printed 345 times (librarian/2026-09-16.md:83, as cited in the librarian brief; I did not open it).
- **Its falsifier** (the first reader's three clauses after C4) would not fire on the two passes above: a
  LIVE-but-unwired entry and an endless hold both satisfy "LIVE or HELD". [ours] Add: a touched entry reads LIVE while
  no settings.json command runs it on that machine, or a HELD row is past its `until`.

### What the record says, after these corrections

- Changes to what is handed over hold **inside the installer** and lapse **at the seat**. The script learned ABSENT,
  Excluded and `-Only`. Two months later a pane still believed installs sync all at once, and a manifest entry with no
  registration is live today. Cues lapse, every one. Syncs decay at the next hook commit. The one gate at the push on
  record (push-gate) lapsed on L by the very route a drift gate would police.
- Left undone by every attempt, to add to section 6: nothing asks whether the installed copy is the **running** copy
  (wired in settings.json, with its requires current), and no hold or exclusion carries an end date.

### Registered install falsifiers the first reader did not list

- P-UNIVERSE clause 2, registered 2026-08-25 (install.ps1:475, :587-590): "show a red on a known positive before any
  green is believed, or declare yourself inert." Unscored. ask-surface.js is a known positive (live on D from the repo
  path, per settings.json) that the registration block skips (install.ps1:688-692) and reports only as DECLARED
  UNMANAGED. Read as written, the block is inert for repo-path registrations [inferred].

### What I could not check

- Anything on L: the L0089, L0296, L0996, L1044 and L1079 figures and L's registrations are the record's.
- Whether the 10-05 hand edits (p-tphooks-A, p-tphooks2-B) still leave any installed copy off every commit. Today's 10
  DRIFT copies each equal a commit (hooks_drift_D section 16), so if a trace remains, it is not in those 10.
- The cost and time of a landed-live call inside push-gate's 8 s watchdog.

### What I did not open (2nd reader)

- 00_build_paths.md sections 10 and 13 beyond :340-350; adversary_R02.md I read whole but did not check.
- The first reader's unopened files (its list above); p-d123-install-B (a separate jev installer); the p-d181/p-d182
  installer hand-backs (their titles name the product installer); librarian/2026-09-16.md:83.
- Any transcript. Of the data logs, only second-reader.jsonl, for counts and field names.
- push-gate.jsonl, to test whether every push from D since 10-06 was logged.
