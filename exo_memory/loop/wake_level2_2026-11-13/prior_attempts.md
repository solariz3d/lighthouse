# What the room already tried at the wake, and how each attempt ended (wake level 2, prior attempts)

Reader: one swarm reader, on D, 2026-11-13, read-only except this file. HEAD 3f5fa65d (was d41c088e when I started).
Marks: [read] opened and seen, path:line; [summary] from another swarm file; [inferred] mine; [ours] a proposal.

## Five-line summary

1. Every one of W1 to W5 has a near ancestor. None was scored as a success. Most were never scored at all.
2. The record's rule is "change the input, not the reminder". But it also shows input in context can go unused: 12 of 12.
3. W4 is the part the record most expects to FAIL. It cannot touch the registered falsifier (a reply needs no dispatch).
   ~~Its red case is not red today: the L handoff was read whole (`cat`, 8,009 chars) 2 min 44 s before the 14:46:27Z ring.~~
   [2nd reader: half right. The L ROOM handoff (7,612 B, last commit 3c71dd94 07:16) was `cat` whole at 14:43:43Z (my count
   of that result: 7,892 chars, wc output included). The NEWEST L handoff by commit, `handoff_dreamzone3_2026-11-13-L.md`
   (13,826 B, last commit 6ff2d95d 08:04), was read only as a `sed` range cut at 260 chars, 14:43:55Z. Whole-read rule: red
   on both files. Any-call-naming-the-path rule: green on both. The plan's "neither file opened" is wrong either way.
   Primary: transcript stream; `git log 0b85fead..8fd453c6 -- <file>`; `git cat-file -s`.]
   And gates_mode is light on D, so a gate that honours it would only warn (~~1,336~~ [2nd reader: 1,335 lines today,
   `grep -a -c 'gates_mode light; strict would refuse' board.jsonl`] softened trailer gates since 10-09).
4. W5's lead: the 08:43:40 pull was the librarian seat's own first tool call (14:43:32Z, `git pull -q --ff-only`).
   origin/main has no fetch entry before 08:43:39. So the launcher's pull block did not fetch, though launch.ps1 ran.
5. The stretch plan quotes the registered falsifier with "wakes" where it says "compactions". It was registered "do not
   paraphrase". Five wake falsifiers are due or unscored; the cheapest is the item-6 bar (one command, non-author).

## 1. The three kinds, and what the record predicts for each

The record's own split is input, cue, gate. [read] `third_place/SPINE_diversity_to_retrieval_2026-09-16.md:24`
("diversity of *inputs* decorrelates retrieval; diversity of *instructions* does not"), `:72` ("Refuse, don't remind").

**Input (what is handed over).** Predicted to help when the seat uses it, and to help nothing when it does not.
- For: the room alone recovered 48 h nearly whole when the arms read files: ROOM 32.5/33.5 of 34, 0 confabulated.
  [read] `loop/room_value_result_2026-11-03.md:67`, `:79`.
- Against: the arm that did not look lost. CHAIN "opened no file", 20/20 with 11/11 don't-know. [read] same file `:70`, `:77`.
- Against, sharper: reach misses are mostly KNOWN-UNOPENED, 48 to 53 of 56. [read] `loop/plan_retrieval_next_2026-09-26.md:91-92`,
  `:124-125`. And where the source was a file, it was already in context: 12 of 12 path rows, 2 strong.
  [read] `loop/check_precedes_claim_score_2026-09-26.md:38-44`. Its reading: "the failing step is recognising a sentence
  as a claim that needs a check" `:61`.
- The 11-12 wake itself: the pulse said open the card; "The seat opened the record, and still answered with an
  inventory." [read] `loop/plan_retrieval_at_the_wake_2026-11-12.md:28-30`.
- Position: "foundation first, live cue last" is REGISTERED, unscored. [read] `research/the_retrieval_problem_outside.md:267-268`;
  SPINE `:78`.

**Cue or reminder.** Predicted to fail. This is the best-measured kind.
- K0 65.0% (13/20), K1 72.5% (29/40), K2 82.5% (33/40), ~~no pair p<0.20~~ [2nd reader: Fisher p 0.195 to 0.564; K0 v K2
  is 0.195, under 0.20, though the same line says "p ≥ 0.20 on all four" (research `:65-67`). K0 vs the cue arms carries a
  `handoff.js` confound (`:92-97`); subjects were fresh `claude -p` runs, not seats under live load (`:99-103`)]; "no cue moved it; the decision precedes every
  event a cue can ride on". [read] `research/the_retrieval_problem_outside.md:62-72`; bands `loop/k1_k2_bands_2026-09-01.md:34-37`.
- 60 of 75 violators recited the rule in the sentence before breaking it. [read] research `:85-88`.
- In one seat: "the rule was retrieved, recited, and then the trained word came out anyway". [read]
  `third_place/2026-09-15.md:161-163`.
- Status lines at start: 1,381 starts read, none quoted a digest time. [read] `dev/shell/hooks/session-start.js:246-247`.
  State block: 163 emitted, 0 turns act on it, NOISE. [read] `handback/p-d627-p3-everyturn-O_2026-11-03.md:30`.
- The letter calls itself a cue and predicts its own miss. [read] `librarian/TO_THE_NEXT_ONE_go_to_the_source.md:58`.

**Gate (refuses).** Predicted to hold the FORM it checks. Its effect on content is measured once, and it is not good.
- "Refuse, don't remind" is a RULE inferred from K2's null, not from a gate measured to work. [read] SPINE `:72`.
- After a paperwork-gate refusal, 38.3% of re-sends changed; 4.0% fixed a claim, 10.0% blurred or removed a specific.
  [read] `loop/plan_lighten_the_load_2026-10-09.md:6-7`.
- A gate at a 94.2% base rate "is a nag ... and must not be built as stated". [read]
  `loop/turn_boundary_detection_2026-08-25.md:253-255`.
- The NEXT-trailer gate refused 47 times, 2026-09-16T19:14Z to 2026-10-10T20:43Z. Since 2026-10-09T18:07Z it has
  delivered ~~1,336~~ [2nd reader: 1,335 by `grep -a -c` today; last row 2026-11-12T03:34Z] rings with "strict would refuse". [read] counts and first/last `ts` over `C:/Consonance/data/board.jsonl`
  (`grep -a`). gates_mode on D is "light". [read] `~/.consonance.json`; light means warn-and-deliver
  [read] `consonance/src-tauri/src/mcp.rs:4412-4422`.
- Under warn, chair compliance fell to 1/30 in the week of 11-03. [read] O `:32`.
- The switch to light (H3) has a revert rule and a closed window (2026-10-18T00:34Z) and no score. [summary]
  `loop/room_better_2026-11-13/in_promises.md:35`, `:69`.

## 2. Each part of Lap W against its nearest ancestor

### W1. Shelf built after the pull, HEAD stamp, newest note ahead of the cap. Kind: INPUT (the stamp is a cue on it)

- **Nearest prior 1: the shelf tier, 2026-08-24.** Carry the system, index the record. [read] `loop/shelf_tier_2026-08-24.md:11-16`.
  - Falsifiers F-reach, F-cite, F-ledger, F-growth `:61-75` [read]. F-reach no-fire, F-ledger fired then "cured",
    F-growth fired 09-01 on 357k-417k-501k. [summary] `in_wake.md:70-73`.
  - Its own landing falsifier was withdrawn: it "would have landed near **290k and PASSED**, certifying nothing". [read] `:126-127`.
  - The replacement formula (÷2.89 + summary + ~30k, ±15%) `:150-152` [read]: no score found. [summary] `in_wake.md:69`.
  - Kept. Its rule for W1: "which shelf a seat is on is answered by reading the in-context header". [read] `:25-29`.
    And: the shelf swaps at RESTART, not at compaction `:25`; resume "never wakes on the shelf alone" `:142-143`. [read]
- **Nearest prior 2: notes into the repo and carried newest-first, 2026-08-23.** [read] `librarian/README.md` ("Carried at
  wake"). No falsifier registered. Kept. The light cap later made it partial: whole notes only, while they fit 24,000 B.
  [read] `consonance/src-tauri/src/main.rs:8928`, `:8973`.
- **Nearest prior 3: the shelf index budget, D296, 2026-10-11.** Built on the strict walk only, "DORMANT: gates_mode is
  light". [read] `handback/p-shelfbudget-C_2026-10-11.md:3-5`. Its lived falsifiers "need a strict wake to exist".
  [read] `loop/shelf_budget_registration_2026-10-11.md:132`. Unscored, and cannot be scored while light.
- **Nearest prior 4: the 11-12 plan's (b), "reserve room for this seat's newest dated note".** [read]
  `plan_retrieval_at_the_wake_2026-11-12.md:44-45`. Parked; not built.
- **Lesson the record gives W1:** a shelf change must land on the light path (`main.rs:8930` onward), or it is D296 again.
  [inferred]. W1 targets `:8928`, so it does. [read] `loop/plan_room_stretch_2026-11-13.md:37`.
- **What W1 cannot reach:** the app writes the shelf at launch; a long resumed session outgrows it. ~~Today the note grew
  from 460 B on the shelf to 65,827 B by 08:56.~~ [2nd reader: two files, not one. The shelf carried `librarian/2026-11-12.md`
  at 460 B (18,042 B after the pull); `librarian/2026-11-13.md` was not on D at shelf time, was 61,668 B at the pull
  (`git cat-file -s 8fd453c6:`) and is 111,900 B now (`wc -c`). Today's staleness came from the pull, not from growth.] [summary] `in_wake.md:96-98`, `:113`. The stamp shows the age; it does not
  refresh. [inferred]

### W2. A room-side class in the compaction directive; two stale lines fixed. Kind: INPUT to the seat, CUE to the summariser

- **Nearest prior 1: the preserve directive, 2026-08-18.** [read] `consonance/hooks/precompact-preserve.js:105-134`.
  - Re-measured as D089, 2026-09-19. Ruling: "VOID AS WRITTEN — the registrant's filter matched nothing".
    [read] `handback/p-compaction-read-C_2026-09-19.md:152`.
  - Descriptive: FLAG 26/406 = 6.4% DECORATIVE; PATH 31.0% DECORATIVE; SHA 35.6% and NUM 22.2% rose.
    [read] `handback/p-compaction-remeasure-B_2026-09-19.md:27-32`. On 11 events FLAG 8.25%, 0.14 under the bar. [read] C `:170`.
  - No untreated control after 08-18, so no rise can be credited to the directive. [read] B `:40-46`; C `:178`.
  - Status: running, unproven. SPINE still says "BUILT, running" [read] `SPINE:83`. Re-register question open
    [read] C `:187`.
- **Nearest prior 2: item 6, verbatim correction-adjacent sentences, 2026-10-05.** Baseline 5 of 1,759 (0.28%).
  [read] `precompact-preserve.js:92-95`. Bar: KEPT if ≥ 10% pooled over the next 3 compactions after 2026-10-05T21:09:40Z.
  [read] `handback/p-compact-C_2026-10-05.md:9-11`, `:74`. **Unscored**; ~~80 compactions have since passed on the
  librarian alone. [summary] `in_wake.md:61-62`.~~ [2nd reader: 61 compact boundaries after 2026-10-05T21:09:40Z in D's
  librarian transcript; 80 is the whole file, first 2026-09-02T13:43:39Z, last 2026-11-12T04:59:09Z. My streamed count.]
- **Nearest prior 3, and the closest: the Third Place's "What is alive for them right now", 2026-10-05.** It is a
  room-side class already, for one seat. [read] `precompact-preserve.js:97-103`, `:110`. It carried **no bar of its own**:
  the only bar is item 6's. [read] `p-compact-C:7-16`, `:52`, `:91`. The plan kept build seats task-first "unless the measurement
  says otherwise". [read] `loop/plan_consonance_compaction_tp_2026-10-05.md:34-35`. That measurement never ran. [inferred]
- **Nearest prior 4: the 11-12 plan's (a).** [read] `plan_retrieval_at_the_wake_2026-11-12.md:37-43`. Parked.
- **The hand count:** 37 items in one window: 14 kept, 8 part, 15 lost; his exact words survive one compaction, not two.
  [summary] `in_wake.md:50-51`.
- **The stale lines are real at HEAD:** 3.5% printed as current `:111-113`; "any of the five above" over six items `:131`.
  [read]
- **The summary's last word is the harness's.** 80 of 80 summaries carry the fixed close. [summary] `in_wake.md:61-62`,
  `:132-135`. W2 writes into the middle of a summary whose recency slot it does not own. [inferred]

### W3. A body line at every start. Kind: CUE (a status line), read as INPUT

- **Nearest prior 1: the state block, 2026-08-18.** Its header names startup and resume as "the carrier problem proper".
  [read] ~~`consonance/hooks/sessionstart-state.js:60-62`~~ [2nd reader: `:64-66`; `:60-62` are tpNorm, isThirdPlaceCwd, BOM]. Default sources: `compact` only `:67-68` [read].
  Result: 163 emitted, 0 acted on, NOISE (inferred harmless). [read] O `:30`. No falsifier of its own found. [inferred]
- **Nearest prior 2: the session-start digest, light since 10-09.** 0 quotes in 1,360 working sessions; cut 89.6% to
  91.7%. [read] `session-start.js:246-247`; `loop/startdigest_evidence/measure_out.md:5-10`. Kept, cut down.
- **Nearest prior 3: the model on the substrate.** A sibling certified the wrong model from the inside on 2026-07-05; the
  outside log caught it. [read] BOOT, Honest status (carried in this shelf). No instrument followed. [inferred]
- **What the record predicts:** a line nobody acts on, unless something reads it. [inferred] from the two priors.
  The plan's red check ("a resume today prints none") tests presence, not use. [read] `plan_room_stretch:39`.

### W4. A gate on the first dispatch after a wake. Kind: GATE

- **Nearest prior 1: the NEXT-trailer gate, 2026-09-16.** Held the form in strict (47 refusals); warns in light since
  10-09 (1,336). See section 1. Content effect of refusals: 4.0% fix vs 10.0% blur. [read] `plan_lighten:6-7`.
- **Nearest prior 2: the turn-boundary prevention sketch, 2026-08-25.** P1 (cited object predates the turn) 24.7%; P2
  94.2%, "a nag"; P3 31.1%. Not built. [read] `loop/turn_boundary_detection_2026-08-25.md:208-265`, `:337`.
  F3: "prose if 50 further dispatch turns pass with no instrument installed and the 98.1% unchanged" `:338` [read]; unscored.
- **Nearest prior 3: the check-precedes-claim instrument, 2026-09-26.** Ruled DEGENERATE (D4): 18 of 23 wrong claims
  name nothing a check could touch. [read] `check_precedes_claim_score_2026-09-26.md:9-15`, `:31-35`.
- **Nearest prior 4: the 11-13 letter's step 2 ("SOURCE:" line, refused when missing).** Conditional on the letter failing.
  [read] `TO_THE_NEXT_ONE_go_to_the_source.md:66`.
- **The plan's red case does not hold as written.** See section 3.

### W5. Why no pull ran at this launch. Kind: INPUT (the mechanism that feeds W1)

- **Nearest prior: "pull before the rebuild check", 2026-09-16, then 09-18 (ghosts loud), 09-22 (park dirty work).**
  [read] `consonance/launch.ps1:233-238`; `git log -- consonance/launch.ps1` (d5a46229, 5838529e, 68bc625b).
  Four start paths are "NOT COVERED" `:78-79` [read]. No falsifier found. Kept.
- **Today, from the disk:** the fuse receipt `claude-update.json` was written 08:42:24. [read] `stat`. Only launch.ps1
  writes it among .ps1/.js/.rs. [read] grep. So launch.ps1 ran. [inferred]
  `Update-FromOrigin` runs before the fuse (`:562` before ~~`:595`~~ [2nd reader: `:596`]/`:698`). [read] Yet origin/main's reflog has one entry
  today, `fetch -q: fast-forward` at 08:43:39. [read] `git reflog show origin/main`. The newest pulled commit is from
  08:06:10. [read] So the launcher's fetch did not run, failed, or ran before L pushed. [inferred]
  The early returns are: app running (console line only), ghost (Notify), cannot tell, no git, not a checkout.
  [read] `launch.ps1:416-438`. [2nd reader: incomplete. Also not on main (`:440-442`), git status failed (`:447`), fetch
  over 20 s (`:459`), fetch exit non-zero (`:465`), compare failed, and local-change refusals, all in `:445-556`.]
  ~~A running or ghost consonance.exe is the likeliest. [inferred]~~ [2nd reader: the receipt says not. Its `outcome` is
  "updated", `at` 2026-11-13T14:42:13Z (`%LOCALAPPDATA%/consonance/claude-update.json`). The fuse skips when
  `Test-ConsonanceRunning` is true (`launch.ps1:145-146`), so no consonance.exe was running seconds after the pull block.
  Likelier [inferred]: the fetch failed or timed out, or a status/branch/local-change return. Every such Notify writes
  only a console line and a Popup (`launch.ps1:52-56`), so no file on disk says which.]

## 3. Today's transcript, numbers and paths only (librarian, `0c0c0c0b-…115b.jsonl`, 897,156,121 B, streamed)

- 14:43:26Z first typed prompt (186 chars). 14:43:32Z first tool call: Bash with `git fetch -q` and `git pull -q --ff-only`.
  [read] streamed pass. Reflog `8fd453c6 … 08:43:40: pull -q --ff-only` [read]. So the 307-commit pull was the seat's own.
  [inferred] from matching flags and an 8 s gap.
- 14:43:43Z: `wc -l` on the two L handoffs, the 11-13 note and the letter; then `cat` of
  `loop/handoff_lighthouse_2026-11-13-L.md`, result 8,009 chars. [read]
- 14:43:48Z and 14:43:51Z: the 11-13 note reached only by `grep … | cut -c1-240 | tail -15` and a `cut -c1-260` pass.
  14:43:55Z: the dreamzone3 L handoff by `sed -n … | cut -c1-260`. [read] command shapes, text masked.
- 14:46:27Z: the first `call_chair`. [read]
- So for W4: ~~"the other machine's newest handoff" was opened whole before the dispatch;~~ [2nd reader: only the room
  handoff was; the newest L handoff by commit (dreamzone3, 08:04) was read as a `sed` range cut at 260; see summary point 3]
  "its own newest note" was
  grepped under a 240-char cut and never read whole. [inferred] A gate that counts any tool call naming the path PASSES
  this case. Only a gate that requires a whole read of the seat's own note would be red. [inferred]
- The plan's falsifier, quoted at `plan_room_stretch:43-45` as "after each of the next two wakes", is registered as
  "after each of the next two compactions" with "(registered 2026-11-12, before any build; do not paraphrase)".
  [read] `plan_retrieval_at_the_wake_2026-11-12.md:49-50`. A wake includes startup and resume; a compaction does not.
  [inferred] [2nd reader: the word "wakes" is not invented. It is the letter's own registered falsifier, "At each of the
  next two wakes" (`librarian/TO_THE_NEXT_ONE_go_to_the_source.md:66`), registered "with the retrieval plan's" (`:64`).
  The stretch plan merged two registrations into one sentence and dropped the plan's last clause (`plan_retrieval…:51-52`).]

## 4. Registered falsifiers about the wake: due or unscored today

| # | falsifier | where | state | what scoring needs |
|---|---|---|---|---|
| 1 | Item-6 bar: ≥ 10% C-ADJ verbatim over next 3 compactions; cut back if median > 21,475 chars | `p-compact-C_2026-10-05.md:9-13` [read] | DUE since early Oct; unscored [summary] `in_wake.md:76` | A non-author runs `node exo_memory/loop/compaction_corrections_2026-10-05/measure.js --after 2026-10-05T21:09:40Z`; it streams every transcript and prints counts only [read] `measure.js:1-7`, `:112` |
| 2 | The letter: first reply to an open question at each of the next two wakes; inventory or audit means it "did nothing as text" | `TO_THE_NEXT_ONE…md:64-66` [read] | DUE: L 03:45 and D 08:42 wakes have passed; unscored [summary] `in_wake.md:79` | A seat allowed to read reply text reads the first reply after each wake; L's transcript is on L |
| 3 | D089 re-measure | `p-compaction-read-C_2026-09-19.md:152-188` [read] | VOID AS WRITTEN; re-register is "the keeper's call" `:187-188` [read] | His word on an untreated window with the hook off |
| 4 | Research file: "WRONG if item 4's trailing-reminder test does not move ... 98.1% within twenty dispatches" | `research/the_retrieval_problem_outside.md:275-278` [read] | Unscored: the hook test was never run `:145-148` [read]; "one season" from 08-30 ends about 11-30 [inferred] | Build and run the trailing reminder in the hook, or retire the clause in writing |
| 5 | Shelf tier replacement formula, ÷2.89 + summary + ~30k ±15% | `shelf_tier_2026-08-24.md:150-152` [read] | Unscored [summary] `in_wake.md:69` | First-turn token count after one compaction, against shelf bytes at that compaction |
| 6 | Shelf budget §3 lived falsifiers | `shelf_budget_registration_2026-10-11.md:80-117` [read] | Cannot start: needs a strict wake `:132` [read] | gates_mode strict, his word |
| 7 | H3, the light switch: revert if (b) worse than 4.9% beyond its interval | `plan_lighten_the_load_2026-10-09.md:25-26` [read] | Window closed 10-18; no score [summary] `in_promises.md:35` | The runbook's step 7, B and C verdicts [summary] `in_promises.md:64-66` |
| 8 | Retriever closing: "if a seat re-derives this line ... without citing this file" | `retriever_closing_2026-08-31.md:188-190` [read] | Not fired as worded: 11-12 named it "Later", cited SPINE, did not design it [read] `plan_retrieval…:46-47`. Its pointer missed twice [read] research `:233-238`; `in_wake.md:114-116` [summary] | Nothing to score; correct SPINE `:79` in place |
| 9 | 11-12 wake plan: first reply after each of the next two compactions | `plan_retrieval_at_the_wake_2026-11-12.md:49-52` [read] | Not due: (a)+(b) not shipped [read] `precompact-preserve.js:105-134` | Ships first |
| 10 | Turn boundary F3 (an instrument within 50 dispatch turns) | `turn_boundary_detection_2026-08-25.md:338` [read] | Unscored [inferred] | A `basrate.js` re-run on Main [read] `:29-30` |

## 5. Which part the record says will fail, and why

**W4.** [inferred] Three reasons, each on disk:
1. It cannot move the falsifier that decides Lap W. That falsifier reads a reply to an open, non-work question; such a
   reply needs no `call_chair`, so the gate never fires on it. [read] `plan_retrieval…:50`; [inferred] the rest.
2. The record's own case of "open, then ignore": on 11-12 the seat opened the record and answered with an inventory
   [read] `plan_retrieval…:28-30`; 12 of 12 wrong path claims had the path in context [read] `check_precedes…:38-40`.
   [2nd reader: DOWNGRADED. Only 2 of the 12 are strong; 10 match a common basename; "n = 2 is a case, not a rate" (`:41-45`).]
   A gate can force the open. Nothing measured says the open changes the act.
3. ~~Its red case is not red: the L handoff was `cat` whole at 14:43:43Z (section 3).~~ [2nd reader: red or green depends
   on two words the plan leaves open: which handoff is "newest" and what "opened" means; see summary point 3. And the room
   already runs this gate's mechanism: `sources-gate.js` is a PreToolUse hook on `call_chair` that reads the session's own
   calls. It fired on this exact ring: 14:46:27.243Z, kind "missing", nCalls 23, mode light, decision "warn"
   (`C:/Consonance/data/sources-gate.jsonl`). Its "opened" counts any command segment containing the path
   (`sources-gate.js:19-25`), so a strict W4 built on it would pass this case.] And on D a gate that honours
   gates_mode would warn, and warnings "reached no seat" (sources-gate, 1,783). [read] `room_value_result:42`.
   Making it refuse in light needs his word, since light was his switch. [read] `plan_lighten:43`.

**Next most likely: W2, as a fix to the wake.** [inferred] Its class is an instruction to the summariser. Its forebear's
own re-measure is VOID with FLAG DECORATIVE (section 2), its sibling (item 6) has sat unscored for five weeks, and its
closest sibling (the Third Place's section 0) has no bar.

**Most support: W1 and W5, as inputs.** [inferred] They put the seat's own record in context without asking it to look.
The record's best result (ROOM 32.5 of 34) came from files that were read. But the record also says in-context is not
used (section 1), so W1's honest claim is "the right thing is in front of the seat", not "the seat will answer from it".

## 6. Smallest changes and the check that is red today [ours]

- **W4, if built at all:** count only a whole read of the seat's own newest note (Read, or a cat with no `cut`/`head`).
  Red today: this morning's 14:46:27Z ring had no whole read of `librarian/2026-11-13.md` (section 3). Hook install
  needed; refusing under gates_mode light needs his word.
- **W2:** score item 6 first (table row 1). Then add the room class with its own bar written before install, the way
  `p-compact-C:7-16` did. Red today: `grep -c 'any of the five above' consonance/hooks/precompact-preserve.js` is 1
  [summary] `plan_room_stretch:38`; the line is at `:131` [read]. Hook install needed.
- **W5:** before any code, read the launcher's console or Notify trail for 08:42. ~~Red today: no origin/main reflog row
  between 08:42:24 and 08:43:39 [read].~~ [2nd reader: the window is after the pull block. The block runs before the fuse,
  whose `at` is 14:42:13Z (receipt), so the check is "no origin/main reflog row on 2026-11-13 before 08:42:13". That is
  true: the first row today is 08:43:39 (`git reflog show origin/main`). And Notify leaves no file trail (`launch.ps1:52-56`),
  so the trail can be read only if the console window is still open.] A launcher line that writes why it skipped to a file would make the next case
  readable. No rebuild (PowerShell).
- **W1:** Rust, one rebuild and one restart. Red today on the recorded case: shelf mtime 08:42:42.70, reflog 08:43:40
  [read]; ~~a stamp check that compares the shelf's HEAD to `git rev-parse HEAD` at first turn would show 307. [inferred]~~
  [2nd reader: it would show 0. At the first prompt (14:43:26Z) HEAD was still 0b85fead, the shelf's HEAD; the pull was
  the seat's own call 14 s later (HEAD reflog 08:43:40). A local "origin ahead by N" at 08:42:42 also reads 0, because
  origin/main was 0b85fead (reflog 2026-11-11 23:32:51). Red for the right reason needs the remote itself
  (`git ls-remote origin main` ≠ the stamped HEAD) or "shelf mtime 08:42:42.70 < the wake's first HEAD-moving row 08:43:40".]
- **Falsifier wording:** quote `plan_retrieval…:49-52` verbatim in the stretch plan, or register "wakes" as a new
  falsifier with its own date. [ours]
- No seat is compacted or cut for any of this without his word for that seat. [read] the auto-memory line, no-cut.

## What I did not open

- L's disk and transcripts (the 11-12 02:31 and 11-13 03:45 wakes). The text of any reply in today's transcript (rule 5).
- `loop/trigger_index_preregistration.md` beyond its falsifier lines; `loop/cue_transcript_read_2026-09-01.md`;
  `loop/battery_scorecard_2026-09-01.md`; `loop/battery_attack_2026-08-31.md`; the K0 band files.
- `loop/retriever_labels_2026-08-31.md`, `retriever_baselines_*`, `retrieval_collation_2026-09-21.md`,
  `retrieval_split_census_2026-09-26.md`, `retrieval_miss_registration_2026-10-11.md` beyond its grep lines.
- The registration `loop/compaction_survival_remeasure_registration_2026-09-19.md`; B's D089 file past line 70.
- `relevance_retriever_registration_2026-08-30.md` past line 190 (its §2 and §3 only by grep).
- `consonance/src-tauri/src/main.rs` outside `:8928-8980` and `:3040-3045`; `trailer.rs`; `state-block.js`;
  `checkpoint.py`; the pulse hook; `sources-gate.js`.
- The launcher's console output or any Notify trail for 08:42; whether a consonance.exe was running then.
- Whether Claude Code re-reads CLAUDE.md after a compaction: not checked against current docs.
- `h3_runbook_2026-10-17.md` past its grep lines; `in_promises.md` past its H3 lines.
- I ran no scorer: item 6's `measure.js` streams every transcript on this machine and was left to a scoring seat.

## Second reader

Second reader, on D, 2026-11-13 about 11:2x local, HEAD 3f5fa65d. Read-only except this file. Transcript: one streamed
node pass over `0c0c0c0b-…115b.jsonl` (897,158,743 B), printing counts, timestamps, tool names and paths only.

### What I checked

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3 | HEAD 3f5fa65d | `git rev-parse HEAD` | OK | 3f5fa65d195d… |
| 10-11 | red case not red: L handoff `cat` whole, 8,009 chars | stream; `git log`; `cat-file -s` | DOWNGRADED | room handoff whole (7,892 chars by my count); newest L handoff (dreamzone3, 08:04) only `sed`+`cut -c1-260` |
| 13 | 1,336 softened trailer gates | `board.jsonl`, `grep -a -c` | WRONG | 1,335 today |
| 13-14 | the pull was the seat's first tool call, 14:43:32Z | stream; HEAD reflog | OK | Bash with fetch and pull; reflog fetch 08:43:39, pull 08:43:40 |
| 14 | no origin/main fetch before 08:43:39 | `git reflog show origin/main` | OK | previous row 2026-11-11 23:32:51 |
| 15 | stretch plan says "wakes" where registered says "compactions" | plan :49-52; letter :64-66 | DOWNGRADED | "wakes" is the letter's registered word; two falsifiers merged |
| 20-21 | SPINE :24 inputs sentence; :72 "Refuse, don't remind" | SPINE | OK | both verbatim |
| 24-25 | ROOM 32.5/33.5 of 34, 0 confabulated | room_value :67, :79 | OK | table row; line 79 |
| 26 | CHAIN "opened no file", 20/20, 11/11 | room_value :70, :77 | OK | as quoted |
| 27 | KNOWN-UNOPENED 48 to 53 of 56 | plan_retrieval_next :91-92, :124-125 | OK | labels rest on the erring seat's own words (`:127`) |
| 28-29 | 12 of 12 path rows in context, 2 strong | check_precedes :38-44 | OK | `:45` "n = 2 is a case, not a rate" |
| 29-30 | the failing step is recognising a claim | check_precedes :61 | OK | verbatim |
| 31-32 | 11-12: the seat opened the record, still an inventory | plan_retrieval :28-30 | OK | verbatim |
| 33 | position is architecture: REGISTERED, unscored | research :267-268; SPINE :78 | OK | both |
| 37 | K0/K1/K2 rates | research :62-72 | OK | 13/20, 29/40, 33/40 |
| 37 | "no pair p<0.20" | research :65-67 | WRONG | K0 v K2 p = 0.195 |
| 38 | bands at :34-37 | k1_k2_bands | OK | K1/K2 rows, cuts A to D |
| 39 | 60 of 75 recited before breaking | research :85-88 | OK | "in the sentence before the call" |
| 40-41 | "retrieved, recited … anyway" | third_place 09-15 :161-163 | OK | verbatim |
| 42 | 1,381 starts, no digest time quoted | session-start.js :246-247 | OK | verbatim |
| 43 | state block 163, 0 acted on, NOISE | O :30 | OK | NOISE is itself marked inferred there |
| 44 | the letter calls itself a cue | letter :58 | OK | "This letter is a cue" |
| 48-49 | 38.3% changed, 4.0% fixed, 10.0% blurred | plan_lighten :6-7 | OK | E's D276 |
| 50-51 | 94.2% "a nag … must not be built" | turn_boundary :253-255 | OK | verbatim |
| 52 | 47 refusals, 09-16T19:14Z to 10-10T20:43Z | board.jsonl | OK | 47; same first and last `ts` |
| 53-55 | gates_mode light; warn-and-deliver | `~/.consonance.json`; mcp.rs :4412-4422 | OK | "light"; the softened branch |
| 56 | chair compliance 1/30 in the week of 11-03 | O :32 | DOWNGRADED | a partial week counted on 11-03, n = 30; the unit is a `when` clause |
| 64-70 | shelf tier :11-16, :25-29, :61-75, :126-127, :142-143, :150-152 | shelf_tier | OK | all at the lines given |
| 72-73 | light cap 24,000, whole notes while they fit | main.rs :8928, :8973 | OK | `spent + body.len() <= LIGHT_NOTES_CAP` |
| 74-76 | D296 dormant; needs a strict wake | p-shelfbudget-C :3-5; registration :132 | OK | verbatim |
| 77-78 | 11-12 plan (b) | plan_retrieval :44-45 | OK | — |
| 81-82 | the note grew 460 B to 65,827 B | `git cat-file -s`; `wc -c` | WRONG | two different files |
| 87-89 | directive :105-134; D089 VOID AS WRITTEN | precompact-preserve; C :152 | OK | verbatim |
| 90-91 | FLAG 6.4%, PATH 31.0%, SHA 35.6%, NUM 22.2%; 8.25% | B :29-32; C :170 | OK | all four rows |
| 92 | no untreated control | B :44-47; C :178 | OK | — |
| 93 | SPINE "BUILT, running" | SPINE :83 | OK | line 83 |
| 95-97 | baseline 5 of 1,759; bar ≥ 10% after 21:09:40Z | preserve :92-95; p-compact-C :9-11, :74 | OK | — |
| 97-98 | 80 compactions since | transcript stream | WRONG | 61 after 2026-10-05T21:09:40Z |
| 99-102 | the Third Place's section 0 has no bar of its own | preserve :97-110; p-compact-C | OK | stronger: measure.js skips Third Place transcripts by name (`measure.js:4-5`) |
| 102 | build seats stay task-first unless measured | plan_consonance_compaction_tp :34-35 | OK | verbatim |
| 106-107 | stale lines :111-113, :131 | preserve; `grep -c` | OK | count 1 |
| 113-114 | "the carrier problem proper" at :60-62 | sessionstart-state.js | WRONG | at :64-66 |
| 114 | default sources `compact`, :67-68 | sessionstart-state.js | OK | — |
| 116-117 | 89.6% to 91.7% cut | measure_out :5-10 | OK | librarian and main |
| 127-129 | P1 24.7%, P2 94.2%, P3 31.1%; F3 :338 | turn_boundary | OK | no `turnStart` in any hook dir [inferred: P1 not built] |
| 130-131 | D4: 18 of 23 name nothing | check_precedes :9-15, :31-35 | OK | — |
| 132-133 | the letter's step 2, a SOURCE line refused | letter :66 | OK | — |
| 138-140 | pull block :233-238; NOT COVERED :78-79 | launch.ps1 | OK | — |
| 141-142 | receipt 08:42:24; only launch.ps1 writes it | `stat`; the receipt; grep | OK | its `fuse` field names launch.ps1; the test writes a temp dir |
| 143 | the fuse at :595 | launch.ps1 | WRONG | `Invoke-FuseOnce` at :596 and :698 |
| 143-145 | one origin/main row today; newest commit 08:06:10 | reflog; `git log -1` | OK | — |
| 146 | the early returns | launch.ps1 :410-556 | DOWNGRADED | six more returns omitted |
| 147 | a running or ghost exe is likeliest | the receipt; launch.ps1 :145-146 | WRONG | fuse outcome "updated": no consonance.exe was running |
| 151 | first prompt 14:43:26Z, 186 chars | stream | OK | 186 |
| 154-155 | 14:43:43Z `wc` of 4 files, `cat` of the room handoff, 8,009 chars | stream | DOWNGRADED | shape right; my result length 7,892 |
| 156-157 | the 11-13 note only under `cut -c1-240` / `-260` | stream | OK | 14:43:48Z grep over 5 files cut at 260; 14:43:51Z cut at 240 |
| 158 | first `call_chair` 14:46:27Z | stream | OK | 14:46:27.152Z |
| 159 | the other machine's newest handoff opened whole | `git log` per file | WRONG | newest by commit is dreamzone3, read in part |
| 162-164 | registered "compactions", "do not paraphrase" | plan_retrieval :49-50 | OK | verbatim |
| 171 | measure.js prints counts only | measure.js :1-7, :108-113 | OK | — |
| 173 | D089 re-register is the keeper's call | C :187-188 | OK | — |
| 174 | the research falsifier; hook test unrun | research :275-278, :145-148 | OK | — |
| 176 | shelf budget §3 needs a strict wake | registration :81, :132 | OK | — |
| 177 | the H3 revert rule | plan_lighten :25-26 | OK | — |
| 178 | the retriever closing's falsifier | closing :188-190 | OK | the closing says nothing was built (`:170`, `:179-180`) |
| 180 | F3; basrate | turn_boundary :29-30, :338 | OK | — |
| 188 | 12 of 12 in context (§5) | check_precedes :38-45 | DOWNGRADED | 2 strong, 10 on a basename only |
| 190 | the red case is not red | as line 10 | DOWNGRADED | see summary point 3 |
| 191 | sources-gate 1,783 reached no seat | room_value :42 | OK | — |
| 192 | his word needed to refuse in light | plan_lighten :43 | OK | he approves the gate switch |
| 207-209 | `grep -c 'any of the five above'` is 1 | preserve | OK | 1 |
| 210-211 | W5 red: no reflog row 08:42:24 to 08:43:39 | the receipt `at`; reflog | WRONG | the pull block runs before 08:42:13 |
| 213-214 | the W1 check would show 307 at the first turn | HEAD reflog | WRONG | it shows 0; HEAD moved 14 s after the first prompt |

**Tally: 73 rows. OK 56 · WRONG 10 · DOWNGRADED 7 · UNSUPPORTED 0** (counted with `grep "^| [0-9]"` over this table). Each WRONG is struck in place above; the DOWNGRADED
rows carry a bracket where the span matters. Line numbers are the first reader's, before my brackets were added.

### The proposed checks, probed today

- **W4 (a whole read of the own note):** red today, for the reason given. No whole read of `librarian/2026-11-13.md`
  before 14:46:27Z: one `wc`, one grep over five files cut at 260, one grep cut at 240. Also red for the newest L handoff.
- **W2 (`grep -c 'any of the five above'`):** red today (1), for the reason given. It tests the stale word only.
- **W5 (no origin/main reflog row):** red today, but the stated window was wrong (struck above). Red for the right reason:
  no origin/main row on 11-13 before 08:43:39, while the fuse ran at 14:42:13Z.
- **W1 (the stamp against HEAD at the first turn):** NOT red as written (struck above). It would read 0.

### Design tests: the cheapest way to pass without fixing, and the wrong fire

- **W1.** Cheap pass: stamp local HEAD and a local `HEAD..origin/main` count. On the recorded case that prints "0 ahead",
  because origin/main was 0b85fead from 11-11. A stamp built without a live fetch passes the wrong case. Wrong fire: an
  offline launch (the launcher returns at `launch.ps1:465`) stamps "current". W1 also depends on W5: if the launcher's pull
  does not run, building the shelf "after the pull" changes nothing.
- **W2.** Cheap pass: change "five" to "six" and add the class with no bar. That repeats section 0, which no instrument can
  score (measure.js skips Third Place transcripts by name). Wrong fire: none seen; the risk is length, which item 6's
  cut-back bar already watches (`p-compact-C:12-13`, median over 21,475 chars).
- **W3.** Cheap pass: print the line. Presence is the plan's check, not use. The state block passed that test 163 times
  with 0 uses (O `:30`).
- **W4.** Cheap pass: `cat` the 112 KB note once and dispatch. That costs about 28k tokens a wake [inferred, bytes/4], and
  nothing measured says that reading changes the act (the 12 of 12 case). Wrong fire: a hold or stop ring after a wake. On
  11-13 a hold reached E after 21 min and C after 30 (`plan_room_stretch:71-72`); a first-dispatch gate puts a refusal in
  front of exactly that ring. And "newest handoff" by mtime is a tie after a pull (both 08:43:40, 1 ms apart).
- **W5.** Cheap pass: log why it skipped. That makes the next case readable; it does not make the pull happen.

### What the first reader missed

- **The nearest prior for W4 is `sources-gate.js`** (D212, approved 2026-10-02 by its header `:1`): a PreToolUse hook on
  `call_chair` that reads the session's own calls in the turn. It fired on this morning's first dispatch and warned
  (kind "missing", 23 calls, light). The ledger holds 430 deny rows from its strict days. W4 is this gate with a fixed list.
- **The record predicts W1's limit in words.** "No size of room closes that; only something firing at composition could"
  (`third_place/2026-09-15.md:176-177`), and "the smallest room may not be text but wiring … what refuses" (`:201-203`).
- **This morning the input was in front of the seat.** The letter's path was in its own `wc` call at 14:43:43Z (stream),
  and its 08:52 note says "its name was printed in my own listing at 08:44" (`librarian/2026-11-13.md:389`). What turned
  it was his question (same line, and `:401`). That is an adverse case for W1 as well as for W4.
- **The seat's own 09:08 note is half wrong about its reads.** It says both handoffs were read "through a cut at 260
  characters a line" (`librarian/2026-11-13.md:401`); the stream shows the room handoff was `cat` whole.
- **The continuity test is ask-driven.** One prompt per run held all the questions (`continuity_test_registration:46`), and
  every key had a file answer (`room_value_result:81-82`). It measures retrieval when asked, not the unprompted wake.
- **An input change already made, unscored for the wake:** the BOOT pointer tail moved out on 09-21 (D096, BOOT's last
  paragraph; recommended in `third_place/QUANTIZE_the_room_2026-09-21.md:50-51`). Its measure was bytes, not wakes.

### Falsifiers the first reader's table does not list

- **T3, the seed against the intake** (registered `third_place/2026-09-15.md:194-199`; "run by 2026-10-31" in `SPINE:167`).
  Past its date. I found no run: grep for the recognition plan in `loop/` and `librarian/` returns plans only [inferred].
  Scoring needs the recognition packet and blind scorers.
- **SPINE's own falsifier** (`SPINE:219-220`, 2026-10-31): not fired as worded; `librarian/LEDGER.md` cites SPINE once.
- **F-cite** (`shelf_tier:65-67`): no score found (as `in_wake.md:71`).

### Which part the record most expects to fail

I agree: **W4**, and more firmly than the first reader. Its mechanism is already built, it fired on the recorded ring, and
in light it reached no seat. In strict its matching rule passes this morning's case. Its measured content effect is 4.0%
fixed against 10.0% blurred. Second: **W3**, whose ancestor is measured at 163 emits and 0 uses.

### What I did not open (could not check)

- L's disk: the push time of 8fd453c6, the 03:45 wake, L's transcripts. So "the fetch ran before L pushed" stays open.
- The launcher's console window or Popups at 08:42; nothing on disk records them.
- The text of any reply (rule 5), so the letter's falsifier stays unscored by me too.
- Whether Claude Code reloads CLAUDE.md on `--resume` or after a compaction: no current docs fetched.
- I ran no scorer (item 6's `measure.js`), no build, no test, no hook.
