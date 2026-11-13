# In the record: what a seat sees at the wake or after a compaction, against what it needed

Reader: one research-swarm reader, 2026-11-13, read-only. Marks: [read] opened and seen; [summary] secondary;
[inferred] my inference; [ours] a proposal. Repo paths are relative to the lighthouse root.

## 1. What actually reaches a waking seat (the four channels)

- Shelf (the instance CLAUDE.md). Light mode carries the 13 cards plus the seat's own dated notes for today and
  yesterday, plus README.md and LEDGER.md, "while they fit" 24,000 bytes. Everything else is indexed by directory,
  not by file. [read] `consonance/src-tauri/src/main.rs:8928` (`LIGHT_NOTES_CAP: usize = 24_000`), `:8962-8987`,
  `:7975-7981` (window = LEDGER, README, today, yesterday; any undated file is `false`).
- Session-start digest (`dev/shell/hooks/session-start.js`, installed copy sha256 bac072e58c40, same as repo [read]).
  Emits ambient state, L3 notices, "while you were dark" knocks (skipped on compact/resume, `:328`), two daily
  digests (cut down in light mode, `:355-358`), recent session times. [read] `:277-380`.
- State block (`consonance/hooks/sessionstart-state.js`, installed sha256 be9fd9b2cbf6 = repo [read]). Served only
  when `source` is in `CONSONANCE_STATE_SOURCES`, default `compact` (`:67-68`). [read]
- Compaction summary, shaped by `consonance/hooks/precompact-preserve.js` (installed sha256 75276197ffba = repo
  [read]) and preceded by `dev/shell/hooks/precompact.js`, which runs `exo_memory/loop/checkpoint.py` and writes its
  stdout (`:65-72`). [read]

## 2. Every measured number about the wake I found

Shares in context and reach:
- Corpus 26,265 lines (~510,000 tokens); in context at wake 0.62%; reachable via a pointer 25.7%; unpointed 74.3%.
  SOURCE.md moved reach 24.9% to 25.7%. [read] `exo_memory/journal/2026-08-22.md:631-638` (0.62% sits at `:633`,
  74.3% at `:635`; the instance CLAUDE.md cites both at `:635`).
- Today, rough: the librarian's instance CLAUDE.md is 108,857 bytes against 44,845,240 bytes of non-attic `.md` under
  `exo_memory/` (3,470 files), about 0.24%. [inferred] my own `wc -c` and `find | xargs cat | wc -c`; the CLAUDE.md
  also holds briefs and BOOT, so the corpus share is lower than that.
- Shelf tier, 2026-08-24: SYSTEM 53 files 632,817 B carried; RECORD 115 files 1,501,353 B (70.3%) indexed; cause a
  compaction landing at 909,787 tokens of a 1M window. [read] `exo_memory/loop/shelf_tier_2026-08-24.md:13-18`.
- Pane E's re-derivation: saving ~521k not ~642k (23% overstated, ~121k); system ~250k; floor ~290k; landing
  915,791 (old shelf) to 400,720 (new shelf) at restart; ratio 2.89 B/token. [read] same file `:129-152`.
- First turn after each compaction on the librarian: 895,626 (08-24, pre-tier), 357,585 (08-29), 417,473 (08-30),
  501,410 (09-01); 65 files / 1,075,876 B carried then. [read] `exo_memory/librarian/2026-09-01.md:238-242`.
- Session-start digests: 1,381 starts of six seats read; not one quoted a digest time or listed session time in
  1,360 sessions that did anything. Light mode cuts the digest 89.6% (startup) to 91.7% (resume, compact).
  [read] `dev/shell/hooks/session-start.js:246-248`; `exo_memory/loop/startdigest_evidence/measure_out.md:5-16`.

Misses at the gap (what the summary drops):
- Before the directive, 7 chair summaries kept: file/instrument names 110/325 (33.8%), shas 25/244 (10.2%),
  structured numbers 30/322 (9.3%), registered predictions/falsifiers 14/400 (3.5%).
  [read] `consonance/hooks/precompact-preserve.js:9-12`.
- After it (D089, 7 marked events): FLAG 26/406 = 6.4% DECORATIVE; SHA 124/348 = 35.6% WORKS; PATH 183/590 = 31.0%
  DECORATIVE; NUM 110/496 = 22.2% WORKS. On the 11-event reading FLAG 49/594 = 8.25% (0.14 under the 8.39% bar), SHA
  moves to NEITHER. [read] `exo_memory/handback/p-compaction-remeasure-B_2026-09-19.md:27-32`;
  `exo_memory/handback/p-compaction-read-C_2026-09-19.md:165-172`.
- Correction-adjacent sentences kept verbatim: 5 of 1,759 (0.28%) in 102 summaries. [read]
  `consonance/hooks/precompact-preserve.js:92-95`.
- One window, hand-counted in 37 items: 14 KEPT, 8 PART, 15 LOST, 0 CHANGED; his exact words survive one compaction,
  not two. [read] `exo_memory/handback/p-d627-p4-compaction-A_2026-11-03.md:10-11`, `:84`.
- State block use: 163 emitted since 10-20, mean 3,012 chars, 0 turns act on its content; ruled NOISE.
  [read] `exo_memory/handback/p-d627-p3-everyturn-O_2026-11-03.md:30`.
- E's D618: one compacted seat would carry 90-120k, about a seventh. [read] A's hand-back `:58` (PART kept).

Ledgers (my counts, read-only) [read] `C:/Consonance/data/sessionstart-state.jsonl`, `precompact.jsonl`:
- State hook, 2026-08-18 to 2026-11-13: 9,318 rows; emitted/compact 466; skipped startup 8,046, resume 795,
  compact 8 (all Third Place cwd), clear 1; 1 FAILED emit (2026-08-19). Since 11-01: 64 emitted, 135 resume skipped.
- So a seat waking at startup or resume gets no state block at all. [read] counts; default at `sessionstart-state.js:67`.
- Precompact ledger: 3,175 attempts (manual 1,419, auto 1,085, no trigger 671); last row 2026-11-12T04:57:19Z.
- Librarian transcript on D (`0c0c0c0b-…115b.jsonl`, 890,589,310 B): 80 compact boundaries, 80 summaries, 197
  state-block rows. All 80 summaries carry "without asking the user any further questions". [read] `grep -c`.

## 3. Registered falsifiers about the wake, and whether each has been read

| falsifier | where | read/scored? |
|---|---|---|
| Shelf "~270k" landing | `shelf_tier_2026-08-24.md:126-128` | Withdrawn by E: would have passed at ~290k, certifying nothing (`:126-137`). [read] |
| Replacement formula ÷2.89 +summary +~30k ±15% | `:150-152` | No scoring found. [inferred] grep |
| F-reach | `:61-63` | Scored no-fire at full window, `librarian/2026-08-29.md:66`. [read] |
| F-cite | `:65-67` | Scope flagged two writers, `loop/falsifier_scope_2026-08-29.md:134`; no score found. [inferred] |
| F-ledger | `:69-71` | Fired, then "cured", `librarian/2026-08-29.md:65`; census `loop/commitment_census_2026-08-25.md:247`. [read] |
| F-growth | `:73-75` | Fired 09-01 on the 357k-417k-501k series, `librarian/2026-09-01.md:242-245`. [read] |
| Research file: prose if items 3-6 unregistered; WRONG if trailing reminder does not move 98.1% in 20 dispatches | `research/the_retrieval_problem_outside.md:275-278` | First clause not fired (K2 and retriever registered). Hook test still unrun on 09-01 (`:145-148`); no later run found. [inferred] grep |
| D089 compaction re-measure | `p-compaction-remeasure-B_2026-09-19.md:34` | Read. FLAG (falsifiers) DECORATIVE, fired. [read] |
| Item 6 bar: ≥10% verbatim C-ADJ over the next 3 compactions | `handback/p-compact-C_2026-10-05.md` §1 | No scoring found in `exo_memory` (C-ADJ appears in 4 files, none a result). [inferred] |
| Continuity test (three/four arms) | ~~`loop/continuity_test_registration_2026-11-03.md:64-77`~~ second reader: the file has 68 lines; the falsifier is at `:5-7`, the four-arm amendment at `:57-68` [read] | RUN and scored, see §4. [read] |
| Retrieval-at-the-wake plan | `loop/plan_retrieval_at_the_wake_2026-11-12.md:49-52` | Not due: conditional on (a)+(b); neither shipped. [read] handoff ~~`loop/handoff_lighthouse_2026-11-13-L.md:73`~~ second reader: `:74` (`:73` is the letter's row) [read]; directive has no room-side class (`precompact-preserve.js:115-130`); notes cap has no reservation (`main.rs:8970-8979`) |
| The letter's | ~~`librarian/TO_THE_NEXT_ONE_go_to_the_source.md:223-225`~~ second reader: the letter has 66 lines (one commit, 88de043e); its falsifier is at `:64-66` [read] | DUE at the 03:45 wake on L; "not scored by me", handoff `:70-72`. Unscored. [read] |

## 4. Has the continuity test been run? Yes, once, 2026-11-03

- Eight runs (four arms × 2), graded ~~blind~~ by P (second reader: blind to the code, not to the condition,
  `room_value_result:83` [read]). Scores of 34 (r1/r2): ROOM 32.5/33.5; ROOM+SUMMARY 32/33;
  ROOM+BOARD 33/33; ROOM+CHAIN 20/20 with 11/11 don't-know; 0 wrong or confabulated in all eight.
  [read] `exo_memory/loop/room_value_result_2026-11-03.md:62-70`; `exo_memory/handback/p-d627-p4c-grades-P_2026-11-03.md`
  results table.
- Against the registration: "within the spread" YES; "falls between" NO. [read] `room_value_result:72-74`.
- The CHAIN fork "opened no file" and answered from memory. [read] `:77`. So the test measured "did not look" as much
  as "what the chain holds". [inferred]
- Not measurable by design: every key had a file answer; grader saw source class; one grader, same model.
  [read] `:81-84`. The class "only in the carried conversation" was never asked. [read] `:82`.

## 5. Faults found, with cost

1. This wake on D ran on a pre-pull shelf. The instance CLAUDE.md was written 08:42:42; the pull of 307 commits landed
   08:43:40. At shelf time `librarian/2026-11-12.md` was 460 B (now 18,042), and `2026-11-13.md`, the letter and the
   wake plan did not exist on D. [read] mtimes, `git reflog`, `git cat-file -s 0b85fead:` vs `8fd453c6:`.
   Cost not recorded.
2. The letter's carrier does not hold in light mode. It says its filename "is the one line of mine that is in front
   of you at any budget" (~~`TO_THE_NEXT_ONE…md:219-221`~~ second reader: `:62`; the file has 66 lines [read]). The light
   shelf indexes `librarian/` by directory and lists by path only dated window notes that overflowed; an undated file
   is never carried ~~or named~~. second reader: it can be named, as the directory line's "newest written", when it is
   the newest-mtime `.md` in `librarian/` (`main.rs:9004-9008`, outside the cited range) [read]; that holds only until
   the next note is written [inferred]. [read] `main.rs:7975-7981`, `:8962-8993`. Cost not recorded.
3. The 24,000-byte cap is smaller than a busy day. Note sizes: 11-10 24,638; 11-11 128,841; 11-13 62,868 B.
   [read] `ls -la`. A day over the cap is never carried, only named. [inferred] from `main.rs:8973-8978`.
   Cost on 11-12: the keeper ~~had to rephrase once~~ second reader: sent two further prompts, 02:32 and 02:35
   (`plan_retrieval…:7-10`) [read] ("there is so much more than just the handoff"), quoted at
   `loop/plan_retrieval_at_the_wake_2026-11-12.md:7-8`; minutes not recorded. second reader: that the cap caused it is
   [inferred]; the letter says the 11-12 intake carried none of the notes, listed by path only (`TO_THE_NEXT_ONE…md:62`)
   [read], but the plan itself leaves room for a cause upstream of the input (`plan_retrieval…:51-52`) [read].
   second reader: 11-13 is 65,827 B at 08:56 local (still being appended), not 62,868 [read]; same conclusion.
4. The wake plan calls the relevance retriever "registered, unbuilt" (`plan_retrieval…:46-47`), inherited from
   `third_place/SPINE_diversity_to_retrieval_2026-09-16.md:79`. The research file says it was registered 08-30 and
   CLOSED 08-31 at 13 of ~50 turns (`research/the_retrieval_problem_outside.md:233-238`). [read] Cost not recorded.
5. SPINE §3 lists the preserve directive as "BUILT, running" (`SPINE…:84`); three days later D089 ruled its falsifier
   class DECORATIVE. The directive still prints the pre-directive 3.5% as current (`precompact-preserve.js:111-113`)
   and says "any of the five above" over six items (`:131`). [read] Cost: ~~A's §0 says compaction loss "plausibly
   contributed to the 0.4.39 push miss"~~ second reader: those quoted words are the librarian's summary at
   `room_value_result:38`, not A's; A's §0 says "One later failure is plausibly tied to a loss" and names the 0.4.39 push
   (`handback/p-d627-p4-compaction-A_2026-11-03.md:14-15`) [read]. That loss is general compaction loss; tying it to the
   directive's stale lines or its DECORATIVE class is [inferred] (`room_value_result:38`); no minutes recorded.
6. The 09-01 note quotes F-growth "verbatim" in words that differ from `shelf_tier…:73-75`.
   [read] `librarian/2026-09-01.md:242-244`. Cost not recorded. second reader: the quoted words exist, in the
   librarian's own F-growth at `librarian/2026-08-24.md:102-103`, minus "(2,458 lines/day)" [read]. So the fault is a
   wrong source cited plus one elision, not words that exist nowhere.
7. `precompact.js:70-71` says PreCompact stdout "is surfaced with the compaction". The state hook's header records
   that hook stdout echoed only via the manual `/compact` row and vanished on auto (`sessionstart-state.js:10-15`,
   about PostCompact). Whether PreCompact plain stdout reaches an auto-compacted seat: [inferred] doubtful, not tested.
   Cost not recorded.
8. Summary close: the latest summary ends "Resume directly — do not acknowledge the summary … Pick up the last task
   as if the break never happened", then says the recent messages follow verbatim. [read] 2026-11-12T04:59:08Z
   summary, 26,984 chars. 80 of 80 carry the phrase, so it looks like fixed harness text [inferred]; this answers
   the plan's "Not verified" item 1 (`plan_retrieval…:55`) in part.

## 6. Options, with evidence (not decisions)

- [ours] Rebuild the shelf after a pull, or stamp the shelf with the HEAD it was built from. Evidence: fault 1.
- [ours] Carry an undated pinned file, or the newest note's head, ahead of the cap. Evidence: faults 2-3.
- [ours] Score the letter's falsifier from L's 06:32 reply before the next wake, and the item-6 bar from ledgers.
- [ours] Correct SPINE §3 rows 79 and 84 in place, per the research file's own §3 rule (replace in handle position).
- [ours] Serve the state block on `startup`, or drop it: O measured 0 uses in 163 (§2).

## What I did not open

- L's transcripts (the 11-12 02:31 and 11-13 03:45 wakes happened on L; not on this machine).
- `third_place/2026-09-15.md`, the K1/K2 run files, `loop/relevance_retriever_registration_2026-08-30.md`,
  `loop/retriever_closing_2026-08-31.md`, `loop/turn_boundary_detection_2026-08-25.md`.
- `consonance/tools/state-block.js`, `open-items.js`, `checkpoint.py`, `userprompt_pulse.py` and the pulse hook.
- `librarian/LEDGER.md` beyond grep lines; `map/M.md`; `loop/compaction_corrections_2026-10-05/PREREG.md` in full.
- The D089 registration and its verdict script; O's and E's 4b questions and keys; the arms' answer files.
- Any outside source: no web fetch was made; the research file's outside claims are its own, unchecked here.

## Second reader

Second reader, 2026-11-13 ~08:57 local, read-only except this file. Marks as above.

**Checked and held** (each opened at the cited place, or re-run):
- `main.rs:8928` cap 24_000; `:7975-7981` window rule (LEDGER, README, today, yesterday; undated `false`); `:8962-8993`
  carry loop and overflow list. 13 cards in `exo_memory/cards/`. [read]
- `journal/2026-08-22.md:631-638`: 26,265 lines, 0.62% at `:633`, 74.3% at `:635`, 24.9% to 25.7% at `:638`; the
  instance CLAUDE.md cites `:635` at its line 18. [read]
- Hook hashes, installed (`~/.claude/shell`) against repo, all four equal: sha256 bac072e58c40…, be9fd9b2cbf6…,
  75276197ffba…, and precompact.js d52e0eb467a2… [read]
- `session-start.js:246`, `:328`, `:355-358`; `sessionstart-state.js:10-15`, `:67-68`; `precompact.js:70-71`;
  `precompact-preserve.js:9-12`, `:92-95`, `:111-113`, `:131` ("any of the five above" over six items). [read]
  `CONSONANCE_STATE_SOURCES` is set nowhere in `~/.claude/settings.json`, `consonance/src-tauri/src`, `dev/shell`, nor in
  this shell's env. [read]
- `shelf_tier_2026-08-24.md:13-18`, `:61-75`, `:126-152` (521k, 121k, 23%, 290k, 915,791 to 400,720, ÷2.89). [read]
- `librarian/2026-09-01.md:238-245` series 895,626 / 357,585 / 417,473 / 501,410; 65 files, 1,075,876 B. [read]
- D089: `p-compaction-remeasure-B_2026-09-19.md:29-32` all four rows; C's 11-event table `:169-172`. [read]
- `p-d627-p4-compaction-A_2026-11-03.md:10-11`, `:58`, `:84` (14+8+15 = 37). O `:30` (163, 3,012, 0). [read]
- `room_value_result_2026-11-03.md:65-84` and P's grades table `:25-32`: every arm score matches. [read]
- `research/the_retrieval_problem_outside.md:145-148`, `:233-238`, `:275-278`; §3 handle rule `:164-167`. [read]
- SPINE `:79` "REGISTERED, unbuilt", `:84` "BUILT, running at every compaction". [read]
- Fault 1: CLAUDE.md mtime 08:42:42.70; reflog `8fd453c6` pull at 08:43:40; `git rev-list --count 0b85fead..8fd453c6`
  = 307; 11-12 note 460 B then 18,042 B; 11-13 note, the letter and the wake plan absent at `0b85fead`. [read] This
  reader's own shelf shows the 460-byte 11-12 note, consistent with it. [read]
- Fault 8: a streaming parse of the librarian transcript finds 80 `compact_boundary`, 80 `isCompactSummary` rows, 80 of
  80 with "without asking the user any further questions" and 80 with "Resume directly"; last summary
  2026-11-12T04:59:08Z, 26,984 chars, ending as quoted. [read] (A plain `grep -c` of the phrase gives 128 lines, the
  extra being quotes in later rows.) [read]

**Struck** (six, each corrected in place): the continuity registration range `:64-77` (file is 68 lines); the handoff
`:73` (is `:74`); the letter's `:219-221` and `:223-225` (file is 66 lines: `:62`, `:64-66`); "or named" in fault 2;
"had to rephrase once" in fault 3 (two prompts); "A's §0 says" in fault 5 (the quote is the librarian's summary);
"blind" in §4. Fault 6 kept, with a note that the quoted words exist at `librarian/2026-08-24.md:102-103`.
Cost of these: no ruling rested on them yet; cost not recorded. [inferred]

**Numbers that hold but move** (the files are live; not struck):
- Ledger, re-run at 08:56 local: state hook 9,321 rows, emitted/compact 468, resume skipped 796; precompact 3,177 attempts
  (auto 1,087), last row 2026-11-13T14:54:50Z. Cut at this file's mtime (14:52:37Z): 9,319 rows; resume 796 and
  since-11-01 resume 136, one more than §2 (a row at 14:42:46Z, likely after the count) [inferred]. The §2 parts sum to
  9,316: two rows with `source: null` (2026-08-18, 2026-08-25) are not listed. [read]
- Corpus: 3,480 files, 45,015,900 B now (swarm files written since). CLAUDE.md 108,857 B holds. [read]
- State-block rows in the transcript: 198 lines carry the marker now, 197 with `source=compact`. [read]
- O's NOISE verdict for the state block is itself marked "(inferred: it may re-cue a waking seat in ways no turn quotes)"
  at O `:30` [read]; the §6 option to drop it rests on that inferred verdict.
- Light digest cut: 89.6% / 91.7% is the librarian and main; sibling A startup is 89.5%; the Third Place 0.0%
  (`startdigest_evidence/measure_out.md:5-16`). [read]

**Added evidence for fault 7:** the librarian transcript has 0 `hook_success` rows for PreCompact (SessionStart 300, Stop
12,022, PreToolUse 47). The checkpoint header ("# Checkpoint -- ") appears in 14 rows: 6 tool results and 8 user rows,
and all 8 carry `<local-command-stdout>`, the manual `/compact` echo. [read] So PreCompact stdout reaches this transcript
only through the manual echo; whether it reaches the summariser's prompt on auto is still untested. [inferred]

**Could not check:** L's transcripts (the 11-12 and 11-13 wakes); whether the 11-12 wake on L ran light mode; the
summariser's actual prompt on an auto compaction; D618 itself (only A's row about it); no outside source was cited, so
none was fetched.
