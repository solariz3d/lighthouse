# Pane specialization — the plan, from the record. Librarian, on D, 2026-09-24 19:4x.

The keeper's form, which is binding: **specialize by TEST, not by label** (*"we arent telling a pane what they are good at …
create tests for each pane and see who excels in what"*, `loop/pane_battery_idea_2026-09-11.md`). The order he set:
*"if we can get through all the queued work tonight, we can start the specialization"*. The queue is empty now, apart from
his own items.

## WHAT EXISTS (open these; nothing here restates them)
- Run 1 was registered and run on 09-16: `pane_battery_registration_2026-09-16.md` (REG), `pane_battery_prediction_2026-09-16.md`,
  `battery_run1_T2_sealed_row` / `T3_brief` / `T3_key`. Every task hit the CEILING (the draft §0, reading
  `t3_run_result_D086.md:11`).
- **Run 2 is DESIGNED and not adopted:** `pane_battery_run2_DRAFT_2026-09-19.md` (B, D088). It has a cold-reader ceiling
  check per task (§1), a brief-leak scan with a positive control (§2), one-file sealed rows on origin before delivery, B
  out as a subject (§7), a cost section (§8), **§9: what the keeper must see before the keys are sealed**, and a falsifier
  (§11).
- **Archetypes as practised, 09-14→15** (`pane_archetypes_idea_2026-09-16.md`, from hand-back filenames): A builds;
  B reads against (10 of 10); E builds and measures; C researches, measures and reads.
- **The weekly-limit lever is the INTAKE, not the pane count** (same file: about 108 KB per pane per launch, written twice);
  the proposed unit is **tokens per hand-back**, per pane, per week.

## THE LAPS
1. **S1 — the census and the unit (C and E, disjoint).**
   - **C:** the practised-archetype census from 09-14 through today (hand-back filenames per letter, classed as build /
     read / measure / research, each class with its paths).
   - **E:** tokens per hand-back per pane for the last two weeks (intake bytes × resumes from `persist.log`, ÷ hand-backs),
     with the command beside every number.
2. **S2 — run 2's preparation, by B ONLY** (B wrote the draft and is out as a subject, §7; A, C and E are the SUBJECTS, so they must never see the tasks or keys before the run. Corrected 19:5x: my first draft gave S2 to "the non-B panes", which would have let the subjects write their own test):
   - §1 cold-reader passes for each task, with rewrites or drops;
   - §2 scans with the positive control failing as it must;
   - the sealed rows committed and on origin.
   - The output is exactly the **§9 packet** for the keeper.
3. **S3 — the keeper sees §9** (one read), then the chair adopts run 2 as a registration in a new file.
4. **S4 — run 2 runs:** the same tasks to the subjects, scored blind by a non-author against the sealed keys (the
   librarian scores, as in L039/L045).
5. **S5 — the decision, with the keeper:** which pane takes which kind of work, citing the scores in `librarian/DOSSIER.md`,
   never as a role sentence in a brief. Also whether a narrower intake per specialty cuts tokens per hand-back (the
   archetypes file's falsifier: if every pane still needs BOOT whole, specialization buys role diversity and nothing on
   the limit).

**Registered before S1:** if S1's census shows the four panes' practised work is indistinguishable (every pane in every
class at similar rates), then specialization-by-practice has no signal, and S2–S4 carry the whole weight. It is said so
plainly, not rescued.

## 2026-09-24 20:0x — S1: C and E in; the exposure ruling
- **E** (`loop/specialization_tokens_2026-09-24.md`): tokens per hand-back over two weeks are **A 18.9M · B 16.1M · C 17.3M ·
  E 20.2M**, within ±12%. The launch INTAKE is only **4.4–7.4% of the no-cache-read tokens per hand-back**, so the archetypes
  file's "the intake is the lever" is weak. **Its registered falsifier leans toward firing:** specialization buys role
  diversity more than weekly-limit savings. The number stands; the verdict is S5's.
- **C** (`loop/specialization_census_2026-09-24.md`): the practised work is DISTINGUISHABLE, so the registered line does
  not fire. A is 71% build; B is 42% build / 42% read; C is 54% build / 18% research; E is 58% build / 21% measure. That
  is a PRACTICE (assignment) signal, not ability; S4 tests ability.
- **RULING on C §3** (C's classifier subagent opened `p-battery-run2-draft-B_2026-09-19.md` and
  `p-battery-run2-attack-E_2026-09-19.md`; C itself saw only their names and one-word classes):
  - **C STAYS A SUBJECT.** Those files are the DESIGN, and the draft states "No task is written, no key exists". The
    run-2 tasks and keys are written fresh by B in S2.
  - **The bar that matters is: no subject sees a TASK or a KEY before the run.** By the same bar E stays a subject, though
    E attacked the draft on 09-19. Design exposure is recorded here, not disqualifying.

## 2026-09-24 20:1x — S2 STOPPED at authoring (B); the keeper's §9 answers
- **B** (`handback/p-d135-run2prep-B_2026-09-24.md` §2): hand-authored tasks leak. A seat's transcript records every
  Write verbatim, and the subjects can read transcripts; A5 voids any such task. Measured route: `claude -p
  --no-session-persistence` leaves no transcript. The §9 packet is `loop/pane_battery_run2_s9_2026-09-24.md` (items 2, 5, 6
  and 7 ready; 1, 3, 4 and 8 wait on authoring).
- **The keeper, 20:1x (AskUserQuestion): YES to A13, isolated authoring, and its cost (~1–3M tokens); the LOAD BLOCK IS
  OUT** (8 tasks, not 12).
- **Next, S2 resumed, B alone:** under A13, author the 8 tasks and keys, run the two cold readers per task and the cold
  scores, all through leave-no-trace processes into the off-repo dir. B sees digests and counts only. Then the one-file
  sealed rows are landed on origin, and the chair's sealed prediction triple. **Then the §9 packet, now complete, goes back to
  the keeper** before any subject runs.

## 2026-09-25 00:2x — S3/S5 DECIDED: the keeper, "Accept and stop"
- **Run 2 result (D136, `handback/p-d136-author-B_2026-09-24.md`):** 8 tasks were authored under A13 with no seat seeing
  one. **6 of 8 were solved by a cold reader with no room context** (draft §13.1). The 2 survivors are one per kind, and
  R2-5 needs pairs, so **no kind is fieldable.** Blinding was verified: 4,034 transcripts before and after, 0 new; the A14
  spill route was found and closed; the void-grep over 4.2 GB was clean outside pre-existing text. **Cost, measured:
  2.70M tokens (in+create+out), 25.8M with cache reads, $31.78, over my quoted 1–3M.**
- **The keeper (AskUserQuestion, 00:2x): "Accept and stop."** Two runs hit the same ceiling. With every pane on the same
  model, a task hard enough to split them is too hard for a cold check to certify.
- **S5, the specialization, BY PRACTICE (the census, `loop/specialization_census_2026-09-24.md`):** A builds (71%), B
  reads and contests (42/42), C researches (18%, the highest), E measures (21%, the highest). **How it applies:** the chair
  ROUTES work by this record when there is a choice. **No brief carries a role sentence**, per the keeper's "not by
  label"; a pane is sent the kind of work its record shows, and the brief states only the work.
- **Revisit when** a pane's record diverges from its route (a pane given reads that keeps returning builds, or catches
  that fall to zero), counted from `handback/` filenames the same way the census was. **The token finding stands
  beside it:** intake is 4–7% of the uncached tokens per hand-back, so specialization buys role diversity, not
  weekly-limit savings (E, D135).
- **D136's files land as record** (the sealed rows witness the drops, so they cannot later be taken for cherry-picking).
