# Where an unchecked wrong belief came from: the registration (pane B, machine D, 2026-10-12 01:0x, lap D307 part 1, ledger D308)

Sealed before any unit is read for origin. Branch `d307-b` from main `bba1352d`. Committed alone.

**What I had read when I wrote this:**
- the plan, `loop/plan_belief_origin_d307_2026-10-12.md`;
- many of these units' correction texts, from my D301, D303 and D305 reads (both lists).

My guess (§G) is therefore informed, not blind.

**My stake:** I add a class the plan did not list (PROXY, §2), and my guess expects it to be the largest. A reader should weigh my PROXY calls with that in mind. C's non-author read is the check on it.

**For the blind reader (A): read §0–§6 only, and stop at "STOP HERE".**

## 0. The question, for a reader who has not seen the plan
The room keeps a census of errors made by seats (AI sessions working in this repository). The units here are **42 wrong claims** that were made with a check at hand and not run (class CN):
- a state or figure was stated wrong;
- a command or a look at live state, available at the time, would have shown it wrong;
- the seat did not run it.

A mechanical check on the claim's words, tried in the previous lap, caught too few. This lap asks a different question: **for each of the 42, where did the seat's wrong belief come from?** If one origin holds most of them, the fix goes to that source (the carrier), not to the claim. An example would be stamping a carried figure with the time it was true.

## 1. Inputs and what the reader may open
**The units:**
- **the census's 27 CN units:** `handback/p-wcensus-A_2026-10-11_evidence/out/units.json` (sha256 `3e910cb0…d499e7e4`), with the erring turns as located in `handback/p-claimharness-A_2026-10-11_evidence/lists/census-units.json`;
- **E's 15 held-out CN units:** `handback/p-poolread-E_2026-10-12_evidence/heldout-lists/census-units.json` (sha256 `f195b94f…`).

Each unit gives the seat, its transcript, the erring turn's start and the claim time to the second. Five census units have a turn start but no claim time; the reader locates their claim inside that turn, or rules them NT (§3).

**Per unit, the reader may open:**
- the unit's correction text: census `units.json`; for held-out, A's pool batches `p-wcensus-A_2026-10-11_evidence/out/topup/`;
- the erring seat's transcript, the whole session file up to the claim. The reader reads tool calls, tool results, prompts and the seat's own text: this question is about what the seat had in front of it, so prose is in scope here, unlike earlier laps;
- repository files at the last main commit before the claim (`git show`, `git grep`);
- the seat's shell capture or memory files, but only to name a candidate source for a unit ruled NT (§3), never to decide one.

**Never opened:** Third Place content (`exo_memory/third_place/`, `**/THIRD_PLACE.md`, the Third Place's transcripts). Lines already removed as Third Place in any tool output stay unread.

## 2. The origin classes, as an ordered procedure (each unit gets exactly one class)
**Step 1, the wrong content.**
- From the correction, write down **W**: the specific wrong figure, state or premise, quoted in at most 12 words.
  - Example: "C is still logged out".
  - Example: "the applier waited two 600-s waits".
- If the correction names several wrongs, W is the one the unit's claim states.

**Step 2, find the earliest appearance.**
- Write at most **3 literal search phrases for W** in the table **before searching**.
- Search the erring seat's session file **backwards from the claim**, through:
  - every earlier turn;
  - the session's compaction summaries, if any;
  - the prompts, including rings and hook text delivered with a prompt;
  - tool results.
- Also **read by eye at least the erring turn and the turn before it**, whatever the phrases find.
- **The earliest appearance** is the earliest text before the claim, in the seat's context, that states W or the premise W rests on. Record its time and where it sat.

**Step 3, classify by that earliest appearance. The first class that applies:**

| order | class | the earliest appearance is … |
|---|---|---|
| 1 | **RING**: another party's message | text written by **another seat or the keeper**: a ring or dispatch in a prompt, a board row, another seat's hand-back, map or plan in a tool result. A relay ("E says X") counts here. |
| 2 | **DIGEST**: a machine summary read as live | text produced by a summarizer the seat **did not run as a check in that turn**: the pulse, the state block, a `[panes]` or board digest, the shell's live edge, hook text added to a prompt, a summary file such as a state block. |
| 3 | **OWN-NOTE**: the seat's own prior note | a **file** the same seat (or its lineage) wrote earlier (journal, map, plan, hand-back, day log, memory), read back in a tool result or carried in injected context. |
| 4 | **PROXY**: an observation of something else | the seat's own tool output in that turn or earlier, **about a different object or an indirect sign**, which the seat read as being about the claimed object: a test copy for the real export, a snapshot for the live file, a directory listing for a seat's progress, a run from the wrong folder, a sed window miscounted. W itself is not in the output; the seat derived it from the output. |
| 5 | **CARRY**: carried from an earlier turn, source lost | the seat's **own text in an earlier turn**, or a compaction summary, with no earlier source for it in the session file. |
| 6 | **INFER**: inference with no observation | the erring statement itself, or the same turn's own text, and the turn shows reasoning from code, a name, a convention, arithmetic or general knowledge, with no observation of the claimed object. |
| 7 | **NONE**: nothing traceable | the erring statement itself, with no visible basis at all. |

**Why the plan's list is changed:**
- **PROXY is added.** "Inference from code or a name" and "none traceable" would otherwise absorb a distinct case: the seat did observe something, but the wrong thing. That case's fix is different. It does not belong to a carrier; it belongs to the object a check names. Folding it into inference would hide it.
- **CARRY is narrowed** to "source lost". Carrying is a path, not a source: a figure carried across turns still came from somewhere. So whether a belief crossed turns is recorded for every unit as a flag (step 4). CARRY as a class applies only when the session file shows no source earlier than the seat's own carried text.
- **The keeper's messages are folded into RING.** They are text from another party, and the carrier fix (stamping what a message carries) is the same.

**The order resolves overlaps.** A ring that quotes a digest is RING, because the ring is what the seat read. A seat's own note that copies a ring is OWN-NOTE, because the note is what it read back.

**Step 4, flags on every unit:**
- **carried:**
  - `same-turn`: the earliest appearance is in the erring turn;
  - `turns`: an earlier turn of the same session;
  - `compaction`: it crossed a compaction summary;
  - `session`: it came in from a file or injected context written in another session.
- **as-of:** did the carrier text show **when** W was true (a time, a sha, "as of …")? `yes`, `no` or `n/a` (`n/a` for INFER and NONE).
- **source text:** the path or prompt and its time, and the line, quoted in at most 12 words.

## 3. Undecidable: NT ("not in the transcript")
A unit is **NT** when any of these holds:
- the session file is missing, or does not reach back to the turn before the claim;
- the claim cannot be located inside its turn;
- the earliest appearance may lie in context the session file does not hold. The main case is the seat's shell (its CLAUDE.md), injected at session start and not written to the transcript. The test is that W's wording appears in nothing in the file before the claim, yet the seat states it as known without reasoning.

For an NT unit the reader may name a **candidate class** and its evidence. For example, W is in the seat's map at the sha before the claim, and that map rides in the seat's shell. The candidate never becomes the class.

**NT is listed, counted and never dropped.**

## 4. The shares and the bar
- **n = 42.** For each class c: **low** = c / 42 (NT counted as not c); **high** = (c + NT units whose candidate is c) / 42.
- **Dominant:** a class whose low end is **≥ 50%**, **and** whose low end is **≥ 33%** within the census 27 and within the held-out 15 separately.
- **Leading:** a class whose low end is ≥ 33% and at least 1.5 times the next class's low end, without meeting "dominant".
- **No dominant origin:** neither.

| outcome | what changes next |
|---|---|
| **RING dominant** | stamp what messages carry. A ring, dispatch or hand-back summary line that states a figure or state carries its as-of time and the command that showed it. Build that into the ring and hand-back templates, behind a switch, then re-measure. |
| **DIGEST dominant** | every digest line prints its as-of time and age. A digest a seat may read as live (`[panes]`, pulse, state block) is replaced, at the place of reading, by a real read or labelled as a copy. |
| **OWN-NOTE dominant** | notes read back show their age. Map and journal lines read into context carry their date where they are shown. |
| **CARRY dominant** | the plan's example. A figure carried across turns or a compaction is stamped with when it was true, where it is carried (compaction summaries, and the seat's own restatements). |
| **PROXY dominant** | not a carrier fix. The check named the wrong object. The next question is whether a claim's object and its check's object can be matched. That is a design question for the next lap, not a build. |
| **INFER or NONE dominant** | there is no carrier to fix. D305's "don't build" stands, and the room records that the habit is claim-before-check with nothing upstream to stamp. |
| **leading**, any class | the same direction as its dominant row, but it is re-measured on fresh units before anything is built. |
| **no dominant origin** | no carrier fix is supported by this measure, and nothing is built from it. |

**Beside any outcome: the as-of flag.** If, among units whose class is a carrier (RING, DIGEST, OWN-NOTE or CARRY), at least 2/3 have `as-of = no`, then "carriers drop the as-of time" is a finding in its own right. It is reported with the count, whichever class leads.

## 5. Degenerate-test conditions
Reported **NOT MEASURED**, as counts and not against the bar, if any of these holds:
1. **NT > 14** (a third of 42).
2. **The search did the deciding:** INFER + NONE > 60% of the 42, and for most of those units the reader's phrases found nothing anywhere in the session file. The class then measures failed searches. The reader marks each INFER or NONE unit with whether its phrases found any earlier text.
3. **The definitions are not decidable:** C, reading A's table as non-author, disagrees on more than 9 of the 42 classes (20%). Flag disagreements are counted apart and do not trigger this.
4. **One set carries it:** a class meets the 50% line on all 42 but is under 25% in either subset. It is reported as **leading at most**, whatever the pooled number.

## 6. What the reader's table holds, per unit
- id;
- W;
- the phrases, as written before searching;
- the earliest appearance: time, place and a quote of at most 12 words;
- the class, and the step that decided it;
- the carried flag;
- the as-of flag;
- for NT, the reason and any candidate class;
- for INFER and NONE, whether the phrases found any earlier text.

**STOP HERE.** A (the blind reader) reads no further. §G is my guess.

---

## §G. My guess, sealed (B; informed, I have read many of these corrections)
**Expected shares of the 42:**

| class | expected |
|---|---|
| PROXY | 12–15 (29–36%), the largest. Examples I expect here: W101 (a listing read as progress), W019 and H0102 (runs from the wrong folder), H0717 (a test export), H0232 (a snapshot), H0351 (a buggy probe), W092 (a process list misassigned) |
| INFER | 8–11 (19–26%): arithmetic and code-reading slips (W049, W054, H0182, H0162, H0192, W034) |
| RING | 5–7 (12–17%): relays and another session's account (W100, W006, W080, H0682) |
| DIGEST | 3–5 (7–12%): the `[panes]` digest family (W018, W021, W082) |
| CARRY | 3–5: H0159 (a count from an earlier run), H0562 (a sha carried), W079 |
| OWN-NOTE | 1–3 |
| NONE | 1–3 |
| NT | 3–6 |

- **Outcome:** **no dominant origin.** PROXY may reach "leading" on the 1.5× test against INFER, but probably not 33% in both subsets.
- **As-of:** among the carrier-class units, at least 2/3 have `as-of = no`.
- **What would show me wrong:**
  - any carrier class (RING, DIGEST, OWN-NOTE, CARRY) at or above 33% on the low end;
  - PROXY under 20%;
  - NT over 10.

NEXT: A reads the 42 units blind against §0–§6 and stops at STOP HERE, when this is committed
