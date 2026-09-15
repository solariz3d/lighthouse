# D064 FEASIBILITY · ALPHA — K2's labels applied to B's first P-LEAVE read against the packet @c59530a

**Pane A, machine D, 2026-09-15, 12:39–12:44.** Registration `loop/anchor_similarity_registration_DRAFT_2026-09-15.md`
§8.10, FEASIBILITY (5ff17be). Not an outcome. I edited nothing but this file (plus scratch files and my map line).

## 0 · THE ANSWER

**P is not VOID, and the scheme can be applied as written.** But the answer turns on a grain rule the scheme does not
state:

| grain | A | C | SILENT | A+C | P |
|---|---|---|---|---|---|
| **as labelled, all 81 claims** | 35 | 13 | 33 | **48** | **0.271** |
| the same, dropping the claims §2.7 supersedes inside the packet | 35 | 3 | 33 | 38 | **0.079** |

**A+C ≥ 3 under every reading I tried** (lowest 31). **P swings by more than 3x** depending on one rule: do the claims
a packet has already overruled (§2.1–2.6 lines that §2.7 says "build this block" over) belong on the claim list?

- **Keep them:** B's contradictions of them count, and P ≈ 0.27.
- **Drop them:** 10 of B's 13 CONTRADICTS go with them, and P ≈ 0.03–0.08.

**The chair should re-rule this before step 0.** It is a grain question, not a VOID question.

**Second caveat, for the use of this pairing as evidence:** this is a favourable case for "not VOID."
- 15 of the 35 AFFIRMS land on §2.7. §2.7 is the chair's restatement of THIS hand-back's own findings, so B affirms
  them because B wrote them.
- B's read also has a line-by-line citation table (§4), which an ordinary hand-back will not.

Without §2.7: A 20, C 13, A+C 33, P 0.394. Still not VOID, but the arms will not have a packet built from their own
text.

---

## 1 · METHOD, AND ORDER

1. **Packet.** `git show c59530a:exo_memory/loop/packet_leave_window_2026-09-14.md`: 19,580 B, 258 lines, sha256
   `0f440dce…2607`. Read whole at 12:39:30.
2. **Claim list, from the packet alone.** 81 claims, written to my scratchpad `feasibility_claims.md`. Sealed at
   12:41:31 with sha256 `6eec779ddd76c2b067b182dc673688cf6b4f749f0721bfc8dd59c84b1a9dd6de`. §5 below repeats it in
   shortened form. The full wording is the scratch file, which is not in the repo.
3. **Only then** did I open `handback/p-leave-read-B_2026-09-14.md` (196 lines, 16,050 B).
4. **Labels** went into `feasibility_labels.js` (scratchpad), one row per claim with the B line cited. **The counts are
   the script's output, not hand-made.** Finished at 12:43:47.
5. **The packet between the two versions:** `git diff ed73e76 c59530a` on the packet is 118 insertions and 0 deletions,
   all of §2.7–§2.9. So claims 1–42 and 75–81 are exactly the text B read. Claims 43–74 are text B never saw: §2.7 was
   written FROM B's read, and §2.8–§2.9 came after it.

**Grain I used:**
- One claim is one checkable proposition: a ruling, a figure, a path:line, or a "this is built as X".
- A finding and the ruling on it are two claims.
- Procedure lines are not claims (§5 stop rule, §6 hand-back path, "A and E start only when re-rung").

## 2 · TIMINGS AND COUNTS (the script's output)

- **Enumeration:** 81 claims, about **2 minutes wall clock** (12:39:30 → 12:41:31, reading the packet included).
- **Labelling:** about **2 minutes 16 seconds** (12:41:31 → 12:43:47).
- These are the times between my tool calls. They are not a measure of a fresh scorer, who would be slower. I have
  worked from this packet for two laps (§4).

```
AS LABELLED (all 81 claims)                                    claims 81  A 35  C 13  S 33  A+C 48  P 0.271
drift is not CONTRADICTS (18, 19 -> SILENT)                    claims 81  A 35  C 11  S 35  A+C 46  P 0.239
a proposal is not a check (46, 48, 53, 57, 61 -> SILENT)       claims 81  A 30  C 13  S 38  A+C 43  P 0.302
both of the above                                              claims 81  A 30  C 11  S 40  A+C 41  P 0.268
OPERATIVE ONLY: superseded §2.1-2.6 claims dropped             claims 71  A 35  C  3  S 33  A+C 38  P 0.079
operative only, and drift is not CONTRADICTS                   claims 71  A 35  C  1  S 35  A+C 36  P 0.028
operative only, drift and proposals SILENT                     claims 71  A 30  C  1  S 40  A+C 31  P 0.032
without §2.7 (the claims derived FROM this hand-back)          claims 61  A 20  C 13  S 28  A+C 33  P 0.394
the packet as B received it (@ed73e76 sections only)           claims 49  A 19  C 13  S 17  A+C 32  P 0.406
```

Reproduce: `node <scratchpad>/feasibility_labels.js`.

## 3 · WHERE THE GRAIN WAS A JUDGMENT CALL

These are ordered by how much they move P.

**G1 · Superseded claims (moves P by 0.19–0.24; the one that matters).**
- At c59530a the packet carries both the §2.1–2.6 text and §2.7's overrides of it. A list "from the packet alone"
  includes both.
- B contradicts the old line and affirms the ruling, so one point yields a C and an A.
- The claims §2.7 supersedes are 16, 23, 25, 30, 34, 35, 37, 39, 40 and 41. Every one is labelled C.
- Partly superseded, so even the drop rule needs a judgment:
  - 30: D-2 adds a condition to step 4; it does not replace it.
  - 34: D-4 strikes only "never deletes", and D-9 adds adoption.
  - 37: D-4 changes the cleanup condition, and D-7 changes the image.
  - 39: D-3's option (ii) leaves 2.4's NOT DONE sentence in the text.
- **The packet contradicts itself on F2.** §2.7 re-words F2 (claim 51), but §4 at c59530a still has the old F2
  (claim 78). Each is a claim on the list.
- **Both rules apply to the run:** a packet revised mid-lap will always carry this double text.

**G2 · "Drifted" path:lines (moves P by about 0.03).**
- B's table says `holderLive :226` is at `:221`, and `pidImage :219` returns at `:214`. The content is right and the
  line is wrong.
- I labelled both C, because B "says it is wrong" about the path:line part of the claim.
- If a path:line is only a pointer, they are SILENT or AFFIRMS instead.

**G3 · A proposal written before the ruling (moves P by about 0.03).**
- Claims 46, 48, 53, 57 and 61 are rulings that B proposed, with the derivation, before the chair ruled.
- I labelled them AFFIRMS under "an independent derivation of the claim". A stricter reading of "a check" makes them
  SILENT.
- B's D-3 options (claims 50, 51) are SILENT: B listed option (ii) among three and chose none (`:78-80`).

**G4 · One check covering several claims (does not move P as labelled).**
- B's `:169` ("2.2 step 2 is buildable as written") affirms claims 26, 27 and 28, the three branches.
- `:170-171` affirms 24 and 32.
- If the grain made step 2 one claim, A falls by 2.

**G5 · Mixed evidence on one claim.** Each is labelled by the conclusion B reaches on the claim's main point.
- **30 (step 4):** B's `:170` affirms that `code` and `rows` can be read, while D-2 (`:61`) and D-11 (`:141-142`)
  contradict what DONE means. Labelled C.
- **41 (2.5):** B's `:109-110` affirms the mechanism, and `:110-115` contradicts "no seat writes". Labelled C.
- **65 (HELD a, D-8):** B's `:129-131` derives the pid-reuse finding, but B's own tell (`:131-132`, "a file naming this
  process's own pid is stale by definition") is not the packet's "only an appStartedAt tells them apart". Labelled A on
  the finding. It arguably CONTRADICTS the "only".
- **8:** B checks `pty_kill`'s line and function (`:152`), but not "nothing ends every seat and waits". One claim or
  two.
- **12, 13:** B's table has separate rows for what I listed as one claim each.

**G6 · A claim B could not see (grain-neutral, and it matters for the run).**
- 12 of the 81 claims (63–74, §2.8–§2.9) were written after B's read. 11 are SILENT by construction. 65 is affirmed only
  because B found D-8 independently.
- An arm scored against a packet version later than the one it answered fills SILENT this way. That is R8f's reason
  for the rule, and here it is measured.

**Bare reuse labelled SILENT, per K2.**
- Claim 2: B cites its own §8 (`:94`, `:192`) but checks nothing.
- Claim 77 (F1): `:59`, "That is F1's exact failure", uses F1 and does not check it.
- Claims 75–76 (the split): `:43`, `:75`.

## 4 · WHAT I DID NOT VERIFY, AND WHY THIS IS NOT A BLIND LABEL

- **I am not a fresh or blind labeller.**
  - I built P-LEAVE and its §2.8 R-1 from this packet, and P-LEAVE-2 after it.
  - I had seen B's findings through the packet's own §2.7 and the librarian's collation lines in my shell.
  - I knew which hand-back I was labelling and whose it was. No redaction was applied, because the redact code is
    step 0 and comes after this.
  - My claim list may be shaped by knowing what B found. For example, I split findings from rulings, which is exactly
    where B's A count comes from.
- **One labeller.** No agreement figure. G1–G5 are the places a second labeller would most likely disagree.
- **B's source checks were not re-checked.** K2 labels what the hand-back STATES it checked. None of B's line numbers
  was re-derived against source at ed73e76.
- **My times are wall clock between tool calls,** not a scorer's reading time.
- **§5 (my claim list) is my grain, not a ruled grain.** A chair re-rule of the grain could change every count above.

## 5 · THE LABELS (claim → label, B's line)

The claim text is in my scratchpad `feasibility_claims.md` (sha256 above). It is repeated in short here so the table
stands alone. `sup` = superseded inside the packet by §2.7.

```
 1 librarian 06:49 work shape                          SILENT
 2 B's §8 race / §6 at p-stick-preflight-B             SILENT   (bare reuse :94, :192)
 3 keeper quote 06:41                                  SILENT
 4 idea file :21                                       SILENT
 5 no console, process-start count zero                SILENT
 6 no CloseRequested/on_window_event/RunEvent          AFFIRMS  :150
 7 app.exit(0) only :10740, :10804                     AFFIRMS  :151
 8 pty_kill :7969 one pane; nothing ends all           AFFIRMS  :152  (first half only, G5)
 9 exit export is the waiter's :14-40                  AFFIRMS  :153
10 tail-carry :746 grew-while-read refusal             AFFIRMS  :154
11 that guard is B's §8 race (reopen → NOT DONE)       AFFIRMS  :194-195
12 claim_single_instance :6424, first in main :10885   AFFIRMS  :155-156
13 "already running" :6464, stops                     AFFIRMS  :157, :110
14 run_carry_json :10511 no window                     AFFIRMS  :158
15 STICK_REHEARSAL_TIMEOUT 300 s :10392                AFFIRMS  :159
16 first carry 348,007,682 B in 55 s                   CONTRADICTS :160            sup (FIGURE)
17 constants sync_launch :774-781                      AFFIRMS  :161
18 holderLive :226                                     CONTRADICTS :162  drift (G2)
19 pidImage :219                                       CONTRADICTS :163  drift (G2)
20 two files beside APPLY_STARTED, tmp-then-rename     SILENT
21 LEAVE_STARTED shape and timing                      SILENT
22 LEAVE_RESULT shape ("stick" for every branch)       CONTRADICTS :139  (D-10)
23 "image": "consonance" matches                       CONTRADICTS :124-127        sup (D-7)
24 close request prevented                             AFFIRMS  :170-171
25 step 1 wait + grow guard refuses a live seat        CONTRADICTS :14, :56-59     sup (D-1, D-2)
26 step 2 none → exit as today                         AFFIRMS  :169
27 step 2 many → NOT_DONE, nothing exported            AFFIRMS  :169
28 step 2 one → LEAVE_STARTED, run_carry_json          AFFIRMS  :169-170
29 step 3 600 s with the 55 s comment                  SILENT
30 step 4 DONE = exit 0 and no row stops               CONTRADICTS :15, :61, :141-142  sup, partial (D-2)
31 step 5 order                                        SILENT
32 step 6 click, button after RESULT                   AFFIRMS  :170-171
33 2.3 a stand down (:22)                              AFFIRMS  :165, :172
34 2.3 b stand down, never deletes                     CONTRADICTS :134-137        sup, partial (D-4, D-9)
35 2.3 c today's export path                           CONTRADICTS :16, :70-75     sup (D-3)
36 2.3 d today's path                                  SILENT
37 stale pid ignored; cleanup "not live under consonance" CONTRADICTS :20, :88-94, :126-127, :129-132  sup, partial
38 the applier never runs at exit                      AFFIRMS  :172, :120-122
39 lock collision reads NOT DONE, holder named         CONTRADICTS :74-75          sup, partial (D-3)
40 collision needs a killed app's carry; lock handles it CONTRADICTS :73, :77-80   sup (D-3)
41 2.5 no seat writes during the export                CONTRADICTS :110-115        sup (D-5)
42 2.6 main window, index.html:22, app.css:607         AFFIRMS  :166-167
43 chair checked lines at source                       SILENT
44 D-1 PtySession no pid, Child dropped, no EOF        AFFIRMS  :31-35
45 D-1 killer returns inverted                         AFFIRMS  :36-38
46 D-1 ruling: pid at every spawn, wait on pids        AFFIRMS  :40-43   proposal (G3)
47 D-2 finding: guard misses a later write             AFFIRMS  :56-59
48 D-2 ruling: DONE needs all pids ended               AFFIRMS  :61-62   proposal (G3)
49 D-3 finding: orphan lock + 60 s retry               AFFIRMS  :66-73
50 D-3 ruling option (ii)                              SILENT   (:78-80 lists it, chooses none)
51 F2 re-worded                                        SILENT   (:79 option only)
52 D-4 finding: cleanup before the 2,000 ms poll       AFFIRMS  :91-94
53 D-4 ruling: waiter owns removal, lock check, set_dirs AFFIRMS :96-98, :102-103  proposal (G3)
54 D-7 finding: "consonance" never matches Rust        AFFIRMS  :124-127
55 D-7 ruling: ".exe" both, strip both sides           SILENT   (:127 asks, does not derive)
56 D-9 finding: b returns before adoption              AFFIRMS  :134-137
57 D-9 ruling: a and b run adoption                    AFFIRMS  :135-137  proposal (G3)
58 D-5 finding: mutex fails open                       AFFIRMS  :113
59 D-5 ruling: scoped to a claimed mutex, F4           SILENT   (B scopes to "the Leave", :115, another point)
60 D-6 finding: shutdown runs no Leave                 AFFIRMS  :117-120
61 D-6 ruling: no falsifier by shutdown                AFFIRMS  :120   proposal (G3)
62 FIGURE 348,026,190 B                                AFFIRMS  :160
63 R-1 finding                                         SILENT   (after B)
64 R-1 ruling                                          SILENT   (after B)
65 HELD (a) D-8 pid reuse, appStartedAt                AFFIRMS  :129-131  (finding; fix differs, G5)
66-74 HELD (b), (c); §2.9 B2-1, B2-2; NOTED            SILENT   (after B)
75 ECHO's files                                        SILENT   (bare reuse :43)
76 ALPHA's files, notices say fallback                 SILENT   (bare reuse :75)
77 F1                                                  SILENT   (bare reuse :59)
78 F2 (§4 text, un-reworded)                           SILENT
79 F3                                                  SILENT
80 F4                                                  SILENT
81 bar figure 608/1/4                                  SILENT
```
