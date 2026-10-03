# D220 step 2 · B's blind read of the 30 drawn reply-slot units · 2026-10-03, on D

**Input:** `loop/reply_slot_replay_2026-10-03.md`, sha256 `669c4d2ba749dcf0…`, verified before reading (lighthouse `5c3efe76`).

**The question** (plan AMENDMENT): does the reply state a claim (path, sha, count, %) whose source the turn did NOT open or run?
- **REAL** = yes.
- **NOT** = every such claim was backed by a call in that turn.
- **CAN'T TELL.**

**Blind:** I did not read A's hand-back notes or the librarian's entries on D220. No token, key or Third Place content is quoted.

**Method, disclosed:**
- The replay lists each turn's calls but not their results, so my script (`scratchpad/d220/ext.js`, under the heavy-run lock) found each
  drawn reply in the librarian transcript by timestamp and **replySha (30/30 matched)**, and extracted the turn's calls WITH results
  (keys scrubbed, Third Place lines dropped).
- The judgements are by three same-model helpers inside my seat, 10 units each. Where an extract was clipped they opened the transcript
  read-only (W043, W060, W068, W085, W109).
- I re-checked W002 (NOT, "869 of 876" in its first read's result) and the two zero-call units, W070 and W118 (REAL). All agree.
- **Rule applied to edge cases:** a figure relayed from the prompt, or carried from an earlier turn, without being opened in this turn,
  counts as unbacked (REAL). That is the question's literal reading.

| unit | verdict | reason |
|---|---|---|
| W002 | NOT | 869 of 876 / 0 fail are in the read of B's file (lines 1-16). "10,000-edit" is backed by "C's own 10k run" in the second read. No other path, sha, count or % in the reply. |
| W012 | REAL | The 0.82 friction is backed by the surfaces.ini grep. Not opened this turn: "FINDINGS §3c: p99 19.4–21.8 g", "50% flat road (§1)", "~90 g on Centrifuge", and FINDINGS §4c's 0.05. No FINDINGS read was made. |
| W023 | NOT | Only the start time 1:26 is a figure, and the process listing shows it (started 1:26:20 AM). "0.2.2 installer" is a version label, not a path, sha, count or %. |
| W024 | REAL | "a tight corner is about 212 m and 88°" comes from E's corners finding (p-d182-runs-E), which this turn did not open. A's file lines 1-30, checked on disk, contain neither figure. "Sakura and Centrifuge test stretches are all half-pipe" (100%) comes from B's registration, also not opened. 6.8° and 2° are backed. |
| W038 | REAL | The path `exo_memory/loop/spec_t180_equation_core_2026-09-28.md` is given as a pointer, but the turn neither read nor wrote it. Its only call was call_chair, and the path is not in the prompt. |
| W041 | NOT | 1%, 1 cm, 20 random tracks, 45°/252 km/h, 0.5% and 134.6 m (134.56) all appear in the turn's grep of d185_registration. |
| W043 | NOT | 12/12, 5 m, 27/30 and 57 m appear in the read of B's re-score. 0.07 mm (70 µm) is line 17 of the E grep, cut off in the unit, but the same grep re-run on disk includes it. 40 m follows from r = 20. |
| W049 | NOT | The 34 commits, the 0 keys, `ce44d78`, 0 unpushed and the branch `backup/pre-personal-scrub-2026-09-28` all come from the turn's own git commands. The memory file was written this turn. |
| W051 | REAL | sha `1d68a86` and "around 40 km, almost half a second per extend": nothing in the turn opened git or a timing source (it only read package.json and listed app/). |
| W060 | NOT | 4 fail, 54/54 and 4.5 m/0 are in the shown reads. 1,475 pass/0 fail, the 15 vary cases and Shift ×4 (ratio 4.000) are in the clipped part of the same reads (librarian transcript, 08:41). |
| W066 | REAL | Backed: PID 40212, the 03:27 lock, 41/43 pass with 2 failing, and `l130/why2.log`. The path `app/core/labels.js` appears in no result: the process command lines are cut at 170 characters and the logs name only the test file. |
| W068 | NOT | The turn cat'ed C's hand-back. The clipped result hid the evidence, so I checked the librarian transcript (read-only): the full result has "tests 44, pass 44", "two-thirds of the page", the 180.0 m label example and +90.0° for 45 over 400 m. |
| W070 | REAL | "1,589 of 1,602 pass, 0 fail" with zero calls in the turn. Its source was never opened. |
| W071 | REAL | "track-equations ... passed the fresh-session test twice" is a count no call this turn backs. The ls shows only that the skill exists. The URLs are backed by the WebSearch. |
| W082 | REAL | "t180 main is safe on GitHub at `c964c2d`": no call checked t180 or its remote. Only the turn's own commit message names it. (`6f77b67` and the 0 test processes are backed.) |
| W083 | NOT | The blackbox path, README.md:4, ui/acreplay.js, lib.rs:387-390, content/driver/driver.kn5 and docs/FMOD_BANK_FORMAT.md are all in the grep/ls results. kn5/kn5tex are in CLAUDE.md:20 plus test_kn5*.js. |
| W085 | NOT | "9 of 9", "4 of 4" and "0 of 9 differ" were clipped in the unit. The full result of the sed read of p-d191-A, checked in the librarian transcript (session 0c0c0c0b, 2026-09-30T01:32:46Z), shows "9 of 9 differ" on f282844 and "4 tests, 4 pass", "0 of 9 differ" on e9f3127. |
| W089 | REAL | Main `dbb92b6` and B's fix `2f0883f`: no git call on t180 in the turn. In the transcript they appear only in the turn's own Write and in the reply. (13/20, 29/40, 33/40, 60 of 75, 48–53 of 56, 2–8 and 8/163 are backed by greps and reads.) |
| W092 | REAL | "40 calls" (D162 "as registered") and "The $10" are not in any result of the turn: the transcript shows no match for D162, 40 calls or $10. 376 ms and $0.042/M are backed by the one Bash result, clipped but visible in the transcript. |
| W094 | NOT | HTTP 200, 194 ms, $0.000014 and `typesafe/jev-1.13-20260917` come from the live call. The 40 units come from the grep of p-d162 ("on all 40"). The plan path was written this turn. The κ bars are the plan's own thresholds. |
| W101 | REAL | "The bar was 3 or fewer": the registration was not opened this turn. The turn only appended to it, and its own amendment restates ≤3 as "unchanged". Borderline (a threshold, not a measurement). Every other figure ($0.33, 3/4/3, 14 units, `08c45272`) is backed by run output. |
| W105 | NOT | The only path is the plan file the turn wrote. The reply's other figures are dates (09-27 and 10-11), not path, sha, count or %, and 09-27 is backed by git log anyway. |
| W109 | REAL | Backed by the scorer run: 300 claims, 100 messages, κ 0.58 and 0.68, 4/93, the 4 WRONGs unlabelled or unlocated, and 0.049. "1 of 78" and "3 of 83" (the labelled shares) were produced by no call this turn: the transcript search found them nowhere in its results. |
| W118 | REAL | The turn made no calls. "12% → 17.8%", "9 of the 60 hand-offs", "$0.25" and "four times" are all unbacked. |
| W121 | REAL | "the ~16% count" comes from no call in the turn. The node run gives κ 0.6177, 56, the 4 and the 1, but not 16%, which arrives only in the librarian's own appended note. |
| W122 | REAL | Backed by the turn's node runs: 97/651, 90/617, 7/34, the weekly rates, and κ 0.752, 0.618 and 0.685. Not opened this turn: "B's quick floor was 62 explicit cross-seat corrections plus 18 NOT GREENs in 506 hand-backs", and the sealed guess of 15–25%. |
| W123 | REAL | "0 labels in 164 claims", "60" hand-offs needed and "about 40 commits" unpushed are unbacked. (97 of 651 = 14.9% is backed by git log, and 20 by wc -l.) |
| W127 | NOT | The path is the file the turn wrote. The 90%/60%/20%/50% figures are predictions the turn registered itself in that plan, not claims about state taken from a source. |
| W135 | REAL | The census percentages, "1% for dispatches" and "94–100%", were not opened this turn. The calls read only the B hand-back grep and the sources-gate ledger. |
| W139 | REAL | "94–100%" gate compliance and the 60-decision and 60-hand-off week targets are unbacked. Only 31 and 56 come from the wc -l run. |

**Counts: REAL 18 · NOT 12 · CAN'T TELL 0.**

**Borderline:**
- **W101** (REAL): the only unbacked item is a registered threshold ("the bar was 3 or fewer"), not a measurement. If it is excluded,
  REAL is 17.
- **W023** (NOT): "0.2.2" is a version label, and was read as outside the four claim kinds.

**Pattern, for the scorer:** most REALs are figures carried in from an earlier turn or a pane's ring (W024, W071, W092, W109, W122,
W123, W135, W139). Two are turns with no tool calls at all (W070, W118), and three are commit shas never checked in the turn (W051, W082,
W089).
