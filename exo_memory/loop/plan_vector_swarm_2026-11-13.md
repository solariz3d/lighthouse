# Plan: a Sonnet swarm that finds the next vector, then an Opus swarm on it. Librarian, on D, 2026-11-13 12:1x local

**His words** (`briefs/lighthouse_the_room.md`, 12:11): "what if once everything is in, we do another big sonnett swarm to go over our
findings, with the purpose of finding something to then let a swarm of opus eat up, but see, we cant be picking the wrong root, we need
the proper vector like i said before."

**Status:** designed, NOT launched. It launches when the panes' packets now in flight are handed back, so their findings are in it.

## Why the choosing is the hard part, from today's record

- Level one ranked by its own summaries and put delivery first. Its second reader found that fix could not be built as written, and its
  largest figure (4 h 24 m) belonged to a different fault (`loop/room_better_2026-11-13/00_build_paths.md`, second reader; `00_critic.md` 1.2).
- The vector that held, the wake, was chosen by hand from three things that agreed: his words on three days, the recorded costs, and
  this seat's own misses. Level two then found its cause on disk (a fetch cut at 20 seconds).
- So a swarm must not pick the root by what reads most convincingly. It has to count.

## How this one chooses

1. **An incident ledger first.** Every recorded fault of the last weeks, one row each, from the primaries: what happened, what it cost
   (minutes, tokens, a wrong ruling, his catch), where it is recorded. The stall traces, the WRONG ledger, his catches in the briefs,
   the hand-backs' corrections, today's delivery traces. No ranking yet.
2. **Independent groups, blind to each other,** each read the ledger and name candidate roots. A root is a cause that sits upstream of
   several incidents, stated so a fix for it could be checked on a recorded case.
3. **Each root is scored by count, not by prose:** how many ledger rows it would have prevented, and how much of the recorded cost,
   scored by two agents who did not propose it. A root that explains one loud incident loses to one that explains twelve quiet ones.
4. **An adversary per root** argues it is a symptom of another root on the list ("what produces this?") and tries to name an incident it
   claims that it does not explain.
5. **Agreement across the blind groups** is weighed with the counts. Where they split, the split is the finding.
6. **The top two go to a person before Opus is spent.** Two minutes of his eye or this seat's, against his words.
7. **Then the Opus level,** as on the wake: the code and the logs line by line, a second reader on every file including the spec, a
   critic, and probes in place of a third reading level.

## One candidate this seat holds, for the swarm to try to break (not a premise)

**A stand-in is trusted in place of the thing, and nobody opens the thing.** From today alone: a DELIVERED stamp for a message nobody
acted on; the shelf, a copy, for the record 58 seconds stale; a handoff read cut at 260 characters for the handoff; a swarm's summary
for its primaries (15 lines wrong); 98 of 98 mutants caught for a guard that was wrong on its first live window; an all-clear from
another seat that was true for 50 seconds. The room already holds the fix's shape in one tool (`consonance/tools/close.js`: after a
push, the remote is asked what it holds).

## Registered before it runs, so it can fail

- **The Sonnet level did nothing if** its top root is not on its ledger's count (it was chosen by argument), or if the blind groups'
  top roots share nothing and the swarm reports one anyway.
- **The vector was wrong if** the Opus level's spec, checked, has no failing check that runs on a recorded case, as registered for
  level two (`loop/plan_wake_level2_swarm_2026-11-13.md`).
- **The stop rule stands:** no further level unless a named question's answer changes what gets built.

## Amendment, 12:1x: when it launches (his word, 12:13)

"like i said wait for all shit in motion to come to rest so we see more of an image first". So it does not launch when the packets now
in flight are handed back. It launches when the room is at rest: every pane has handed back and holds no queued packet, Lap W's two
panes included, and the Third Place's probe experiment has ended. The librarian tells him the room is at rest, and what the picture is,
before anything is launched.

## Amendment, 12:2x: launched (his word of 12:15 corrects the amendment above)

"wait I more so meant, wait for all lighthouse work if there is any in motion that could give us more insight, if its dreamzone work,
thats fine". Checked what lighthouse work was in motion at 12:2x: the idle guard's last row (P, queued behind the render bench) and Lap W's
two panes (dispatched, not started). Neither would add rows to a ledger of what has already gone wrong; today's incidents are in the
notes. So the Sonnet level was launched: workflow wf_a59c8338-2c1, every agent named Sonnet; output `loop/vector_swarm_2026-11-13/`. Twelve
ledger readers, a clerk and a second reader for the ledger, four blind groups, a roots clerk, then two scorers and one adversary for
each root (up to twelve roots), a ranker and a critic. The Opus level is NOT launched: the top two come to a person first.

## SCORED AND AIMED, 13:2x (the librarian, after the 12:50 compaction)

**The run:** `wf_a59c8338-2c1`, 51 Sonnet agents, 0 errors, 10,781,045 tokens, 1,211 tool uses, 40.5 minutes. Its files are in
`loop/vector_swarm_2026-11-13/` (lighthouse b4994caa). Read whole by this seat: `00_rank.md`, `00_critic.md`, the adversaries for R03
and R08, R07 from :14, R02 :15-40.

**The registered clauses, scored:**
- "its top root is not on its ledger's count": did not fire as worded. R01 is first by rows both scorers marked YES, 135 against 80;
  the critic re-derived both with its own script (`00_critic.md:58-70`).
- "the blind groups' top roots share nothing and the swarm reports one anyway": did not fire. R01 and R02 were each proposed by three
  of the four groups (`00_rank.md:137-148`).
- What the clauses did not foresee: every one of the ten adversaries returned TOO BROAD or SYMPTOM (`00_rank.md:42-43`), so the count
  ranked breadth (`00_critic.md:33-35`); and the ledger leans on this seat's own WRONG column (66 of R01's 135 agreed rows cite
  `librarian/`, `map/M.md` or `journal/`, 49% against 32% of the ledger, by the critic's crude regex, `00_critic.md:121-124`).

**The spot checks:**
- The critic's: 12 random agreed rows of R01 opened at their primaries; 10 hold, 2 do not; none carries a stated time
  (`00_critic.md:74-104`).
- Mine: every ninth agreed row of R01 (15 rows), read in the ledger and not at primaries. Each is a wrong statement caught the same
  day by another seat, a second reader or the seat itself; the keeper once (L0273). No cost field is in minutes.
- Mine, a count by a crude regex over the ledger's "who caught it" field, no row opened: the keeper caught 15 of R01's 135 agreed
  rows (11%), 9 of R02's 80, 3 of R03's 58, 12 of R07's 52 (and 6 name nobody), 9 of R06's 25, 25 of R10's 31 (circular: R10 is
  defined on his words).

**The top two, by the count:** R01 (a claim typed from memory, 135) and R02 (a done-state read off the sender's side, 80).

**R01 is not taken to Opus.** A gate of its kind was built twice and failed its own bars on replay: the point-of-claim check caught
5 of 16 held-out turns against a 40% floor and was ruled DON'T BUILD, and the SOURCES gate showed 0 catches in 383 refusals
(`00_rank.md:88-91` from `adversary_R01.md:88-108`; the primaries `loop/plan_claim_check_d305_2026-10-11.md:48-54` and
`handback/p-scoreboard-E_2026-10-11.md:11` were opened by the critic, not by me). Its rows are the cheapest on the ledger (4 of 135
carry a time, 217 minutes in all) and most were caught by another seat. Two-way correction is the control for this class, and the
record shows it working.

**Aimed: R02's half A, "what is landed is not what is live"** (`adversary_R02.md:24-30`): the installed hooks, the running binary
and the mode in use are older than, or other than, what the repo holds, and nobody asks the running copy.
- **On the count:** R02 is second. 17 of the adversary's 19 half-A rows are YES in both scorers (`00_rank.md:115-116`).
- **Upstream of two other roots, by their own adversaries:** 82 of R03's 163 claimed ids are R02's, "the control was never running"
  (`adversary_R03.md:20-33`); and the largest token row a sync would remove on D, L0613 (2,385,722 tokens), "is the R02
  install-drift row" (`adversary_R03.md:63`, `adversary_R08.md:42`).
- **A check that is red today:** `dev/shell/install.ps1 -Check` printed 10 DRIFT and 3 ABSENT on D this morning
  (`loop/hooks_drift_D_2026-11-13.md`); the ledger gives 15 and 9 on L (L1079, citing `map/B.md:2186`, which I have not opened).
- **It returns after each fix:** "landed is not shipped for hooks, third time" (ledger L0092) through 11-13 (L1079, L1085 to L1088).
  The earlier attempts are on disk: `install_drift_census_2026-08-24.md`, `packet_installer_only_2026-09-08.md`,
  `install_D_2026-09-21.md`, `plan_install_score_remeasure_2026-09-21.md`, `install_proposal_L_2026-09-23.md`.
- **Against his words of 11:29** ("less token usage, and fixing the retrieval … the ability to at least remember to retrieve
  first", `briefs/lighthouse_the_room.md:118-119`): the gates that make a seat read first live in the repo and are not all running
  (`dispatch-gate.js` is ABSENT on D; `sources-gate.js` only warns); the token row above; and this morning's "rebuild didnt succeed"
  is the same class (a fetch cut at 20 seconds, a shelf built from the old tree).
- **Every other fix, Lap W included, reaches a seat only through this path.**

**A departure, named.** The ranker ranked by agreed rows only. I am taking the second root's narrow half and not the first root,
on steps 3 to 6 of "How this one chooses" (the cost, the adversaries, the groups, this seat's eye against his words). If that is
choosing by argument, this paragraph is where it happened, and the Opus level's registered test below is what can show it wrong.

**Two things I nearly carried forward and did not.** (1) That the 11-03 result's first recommendation, the idle gap, "has not
moved": `consonance/tools/chain-status.js:1476` shows D628 built the owed visit; the R07 adversary says it did not check
(`adversary_R07.md:68-69`). (2) An Opus level on "Lap D" as one root: the record's own line is "the five stalls are not one
phenomenon" (`adversary_R07.md:80-81`, citing `librarian/2026-08-30.md:829`), and R07's adversary found its two halves need opposite
fixes.

**What this changes in `loop/plan_room_stretch_2026-11-13.md`:** nothing is built at the point of a claim; "Hygiene, small" becomes
a lap of its own (Lap I), specified by the level below, and its installs wait for that spec so the installed state does not move
under the readers; Lap D stays a list of separate fixes, each proved on its own recorded case.

### The Opus level, registered before it runs

Nineteen agents, all Opus, named so. Output: `loop/landed_live_2026-11-13/`. Eight readers, each with an adversarial second reader:
the installer line by line; each drifted, absent and unregistered entry on D today; the earlier fixes and how drift returned; the
path a change travels from a branch to the copy a seat runs; whether the running binary is the committed one; the gates' light
mode since 10-09; what of L can be settled from D and what a waking seat is told; what drift costs per turn. Then one spec, a
second reader for the spec, and a critic. It reads and designs. It installs nothing.

- **The named questions** (the stop rule's test; each answer changes what gets built): why drift returned after each fix on record;
  where in the landing path a read-back of the installed copy can sit, and who is told when it is red; which of today's entries on D
  are synced, held or retired; which warn-only gates have moved an act since 10-09 and which narrow refusals the record supports;
  whether each start path runs the committed binary; what of L's state can be settled from D.
- **This level did nothing if** its spec leaves "Hygiene, small" of the room plan as it stands (the eight syncs and nothing else)
  **and** adds no failing check that runs on a recorded case.
- **The vector was wrong if** (as registered above) the spec, checked, has no failing check that runs on a recorded case.
- **Lap I is degenerating if,** at the first two landings of a hook or app change after its parts are live, the installed copy on
  the landing machine is again older than the repo and no seat was told (read from `install.ps1 -Check` and the board by a seat
  that is not the lap's author).
- **The stop rule stands:** no further level unless a named question's answer changes what gets built.
