# CLAIM RECOGNITION, ARM 2 — the stricter ask. REGISTERED before any arm-2 reader runs (pane E, L118, 2026-09-27)

**Plan:** `loop/plan_claim_recognition_2026-09-27.md`, section "ARM 2" (`1017736`).

**Arm 1:**
- **Registration:** `loop/claim_recognition_registration_2026-09-27.md` as sealed at `c8c18d4` (sha256 `0cea938b…`), cited
  below as **R1:<line>**, at that commit.
- **Score:** `loop/claim_recognition_score_2026-09-27.md` (`4b313e7`), cited as **S1:<line>**.
- **Result:** INDISCRIMINATE. HIT **16 of 17**, median COST **0.662**, LIFT **0.275** (S1:19–22).

**Design only; nothing was run.**

## 0 · WHAT ARM 2 CHANGES: THE ASK, AND NOTHING ELSE

**The new ask is C's, verbatim**, from `exo_memory/research/claim_recognition_strict_ask_2026-09-27.md`:

> Here is a reply one assistant was about to send. List only the statements in it whose truth depends on the current state of something that could be looked at directly: a specific file, the output of a command, or a record. Include such a statement whether or not it names the file, command or record. Leave a statement out if the reply itself shows the check for it, meaning the command that was run or the file that was read, together with what it returned. Also leave out general statements, instructions, opinions, plans, and statements about what the assistant intends or will do. Quote each statement you list.

**The source:** C's file, sha256 `25f31a966d4b00e4db8e8c2dd01c1979db6a05c72765a559f162b5ff07f1e4b5` (cited below as
**C2:<line>**), the text strictly between its markers at C2:21 and C2:23.

**The ask's exact bytes:** 615 bytes, one line, no trailing newline, sha256
**`2a081b66ca479ebcc8c4268ccd11aac16a16853d308bc3f974aae8c15fdcd085`**.

The ask file A passes to B's harness (`claimrec.js readers … --ask <file>`, per B's L118 hand-back) **must hash to exactly
that value**, and the harness records it in `run-readers.json`. **Any other value voids the run.**

**How the prompt is laid out:** identical to arm 1 (R1:92). The ask, a blank line, `---`, a blank line, then the item
text.

**THE "ASK ONLY" TEST, fixed before C's wording is read.** Arm 2 is registered as ask-only **only if** C's ask meets all
of the following. If it does not, this file says so and **refuses** to call arm 2 ask-only, rather than register a changed
instrument under that name.
1. **Its answer is a list of quoted statements,** parseable exactly as the harness parses arm 1 (list items and `>` quote
   lines, per ruling `be4b03b` point 3). An ask that asks for ratings, categories, yes/no, or a table with a verdict
   column changes the parser or the coder, so it is not ask-only.
2. **It never says, or implies, that anything in the reply is wrong** (the same condition as R1:87's heading).
3. **It needs no change to the HIT rule, COST, the units or the coder** (R1:95–139). The coder maps statements to units and
   is blind to the ask's wording.
4. **It fits R1:92's layout**, with no extra context such as a system prompt, examples or the key.

**VERDICT on C's wording: ASK-ONLY — PASSES all four.** No refusal.
1. **A quoted list:** *"Quote each statement you list"*, kept from arm 1 so the mechanical mapping works unchanged
   (C2:78–79). The parser and the coder are untouched.
2. **Nothing implies wrongness:** none of "wrong", "false", "error", "mistake", "incorrect" or "should be checked"
   occurs. Checked by substring over the extracted bytes, and C states the same at C2:27–28.
3. **No instrument change:** HIT is still "≥ 1 key unit flagged" (R1:97).
   - **What changes is what a miss can MEAN:** a reader may now correctly leave out a wrong claim whose check the reply
     shows with its output (C2:57–63, C2:100–101).
   - **That is the ask's intended selectivity, measured by the unchanged HIT,** and not a rule change. §2's "at most 2
     lost" budget is sized for it.
4. **The layout is R1:92's** (C2:18–19).

## 1 · EVERYTHING ELSE, BY REFERENCE TO ARM 1 — not restated

| element | where it is fixed | arm-2 note |
|---|---|---|
| items, and the extraction rule | R1:26–86 (the rule at R1:60), as amended to 22 by the librarian's ruling `a6d1a28` | **the same 22 extracted replies**, from the same files A extracted (§5) |
| scored items | ruling `a9c9931` point 1 | **the same 17 scored**; the same 5 unkeyed (W101, W124, W136, W140, W148) are run and not scored |
| the key | R1:80, re-derived per `a9c9931` point 3 | **`C:\Consonance\retrieval\l115\key\unitkey.json`, sha256 `de64024e…`** (S1:5), unchanged |
| units | R1:116–128, with rulings `be4b03b` points 1–2 | **`units.js` sha256 `cd6f7f00…`** (S1:6), unchanged |
| the HIT rule and the two-step mapping | R1:95–115; the statement parsing and listed=flagged per `be4b03b` points 3–4 | unchanged |
| the coder | R1:99–112 (the fresh instance, blind to the key) | unchanged. B's harness takes the ask from a file (the plan's B piece), and **nothing else in it may change** |
| COST, the chance baseline, LIFT | R1:129–139 | unchanged |
| the outcome table and the 0.40 ceiling | R1:142–151 | unchanged. **Arm 2 is also scored on its own against that table**, besides the arm-1 comparison in §2 |
| DG1–DG4 | R1:204–210 | unchanged |
| too few (< 15 usable) | R1:212 | unchanged |
| the abuse clause | R1:219 | applies to this file too: nothing here moves after an arm-2 reader runs |
| the reader invocation and isolation | R1:237–277 | unchanged, including the global CLAUDE.md limit. `claude --version` is recorded before and after |

**If B's arm-2 harness differs from arm 1's in anything but where the ask is read from, R1 governs** (R1:278–302, "this
registration governs"), and the run is re-done to it before any score.

## 2 · "COST FALLS WHILE HIT HOLDS" — defined now, against arm 1's own numbers

**The comparison is PAIRED.** It uses the same 17 scored items, the same key and the same units. Only the ask and the
readers differ.

| quantity | arm-1 value (S1) | the arm-2 condition |
|---|---|---|
| **HIT holds** | 16 of 17 (S1:19) | arm-2 HIT **≥ 14 of 17** (at most 2 items lost), **and** ≥ 0.70 (R1's bar) |
| **COST falls** | median 0.662 (S1:20) | arm-2 median COST **≤ 0.51** (a fall of at least **0.15**) |
| **COST falls to the ceiling** | | arm-2 median COST **≤ 0.40** (R1's ceiling) |
| **selectivity holds** | LIFT 0.275 (S1:22) | arm-2 LIFT **≥ 0.20** (R1's bar) |

**The arm-2 outcomes, read in this order:**

| outcome | condition | what it says (the plan's "ARM 2" section) |
|---|---|---|
| **SEPARATES** | HIT holds, COST ≤ 0.40, and LIFT ≥ 0.20: R1's FALSIFIED row, reached by the new ask | the stricter ask is a line that separates the dangerous claims, and becomes the candidate **source rule** |
| **FALLS, NOT ENOUGH** | HIT holds and COST falls (≤ 0.51) but stays above 0.40 | the ask narrows the flagging but not to a usable share |
| **DOES NOT FALL** | median COST > 0.51 | the volume is intrinsic to these replies; only a change at the source is left |
| **TRADES RECALL FOR COST** | COST falls (≤ 0.51) but HIT < 14 of 17, **or** LIFT < 0.20 | the ask flags less, not better |
| **DEGENERATE / TOO FEW** | R1:204–212 | as in arm 1 |

**Printed with every outcome, as descriptives that never decide it:**
- the **paired per-item COST change** (arm 2 minus arm 1) for the 17: its median and a **sign test** (items where COST
  fell against rose);
- the **HIT flips**: items that went hit→miss and miss→hit.

**Why these thresholds:**
- **A 0.15 fall** is chosen to be large next to reader-to-reader noise. That noise is **unmeasured** (§5), and the
  threshold is a hand-made guard, named as one.
- **14 of 17** allows the stricter ask to drop claims the reply does show a check for. Two losses are the budget for that.
  More than two means the ask is shedding the known wrong claims themselves.

## 3 · THE FALSIFIER — of the arm-2 hypothesis "a stricter ask separates the dangerous claims"

**The hypothesis is FALSIFIED if either of these holds:**
- **COST does not fall:** median COST > 0.51 (DOES NOT FALL).
- **HIT falls as far as COST does:** the ask only flags less. Measured as a relative drop, HIT falling by at least as large
  a share of its arm-1 value as COST does:
  - (16 − HIT₂)/16 ≥ (0.662 − COST₂)/0.662;
  - or LIFT₂ < 0.20.

**It is SUPPORTED only by SEPARATES.** FALLS, NOT ENOUGH supports it partially, and is printed as partial, never rounded
up.

## 4 · THE SEALED PREDICTIONS — appended ONLY after C's ask lands, citing S1 and C's file by line

### SEALED 2026-09-27 ~01:4x (E), after reading C's file (sha256 `25f31a96…`), before any arm-2 reader runs

| quantity | arm 1 (S1) | arm-2 prediction | why, cited |
|---|---|---|---|
| **HIT** | 16 of 17 (S1:19) | **15 of 17** (band 14–16) | Most key claims are unanchored state assertions (C2:49–51), which the state criterion keeps by design (C2:54–55: "whether or not it names …"). I price **one** loss to C2:100–101's risk, a wrong claim beside an over-read shown check being exempted. That is within §2's budget. |
| **median COST** | 0.662 (S1:20) | **0.50** (band 0.44–0.58) | **The new exclusions mostly remove what arm-1 readers already dropped** (plans, instructions, opinions; arm 1's ask already said "statement of fact"). The genuinely new cut, "the reply shows the check with its output", rarely applies to tool-written notes, **as C itself expects (C2:95–98)**. Claimify's selection cut unverifiable pass-through sharply (C2:39–42), but that was against an extractor-style baseline letting 93–97% through, and arm 1 was already at 0.66, not 0.95. **I take S1:35's lesson on my arm-1 length argument, and put no length discount in this number.** |
| **LIFT** | 0.275 (S1:22) | **~0.35** | Chance ≈ the per-item share (S1:21 was 0.666 against a median COST of 0.662). Hits ~0.88 over a chance ~0.52. Arithmetic, no source |
| **§2 outcome** | INDISCRIMINATE | **FALLS, NOT ENOUGH** | HIT holds (≥ 14), and COST falls to ≤ 0.51 but not to 0.40 |

**Said plainly:**
- **My COST point, 0.50, is 0.01 inside §2's 0.51 threshold,** so my own prediction sits on a boundary. **If COST lands
  at 0.52 or above, the outcome is DOES NOT FALL** ("the volume is intrinsic", C2:97–98), and my prediction is wrong in
  C's direction. I am not moving the threshold to make my number comfortable; it was fixed in §2 before C's file was
  read.
- **What would show me wrong the other way:** COST ≤ 0.40 with HIT ≥ 14, which is SEPARATES. That would mean the
  no-check-shown clause and the plan-and-opinion exclusions remove far more of the notes than I think, and C's stricter
  wording is the source rule the plan hoped for.

**No arm-2 reader may run before the predictions are appended here and the file is committed** (the plan: A runs "after
the seal").

## 5 · THE READERS ARE FRESH AGAIN, AND THE SAME 22 REPLIES ARE REUSED — does reuse matter?

- **Fresh again:** one new `claude -p` per item, with R1:237–277's isolation. **No arm-2 reader has seen an arm-1 reader's
  output or any earlier session:** `--no-session-persistence`, an empty cwd, and no tools or MCP. The limits are arm 1's:
  the global CLAUDE.md is loaded on L, one model family, and one reader per item.
- **Reusing the replies does not contaminate the readers,** since each one is fresh. **It is what makes the comparison
  paired:** item difficulty, length and key position are held fixed, so the ask is the only designed difference.
- **What reuse does NOT remove:**
  - **Reader sampling noise.** An arm-2 reader is a different draw from the same distribution as the arm-1 reader of the
    same item. Nobody has measured how much one reader's COST varies across re-runs of the **same** ask, so a difference
    between the arms is the ask **plus** that noise. This is the reason for §2's 0.15 guard, and it is the main limit.
  - **Measuring it** would need an arm-1-ask replicate: the same ask, fresh readers, the same 22. That is **not** part of
    this registration (it changes only the ask, as packeted), and it is named as the next thing to run if the arm-2
    result lands within 0.15 of a boundary.
- **The one sequence effect that does exist is on this seat, not the readers.** I wrote the predictions knowing arm 1's
  result. That is intended: the predictions are **about the difference**, and S1 is their stated prior.

## 6 · ROLES

| step | who |
|---|---|
| the ask's wording | **C** (`exo_memory/research/claim_recognition_strict_ask_2026-09-27.md`) |
| this registration and its predictions | **E**; does not score |
| the harness reading the ask from a file, tested on the dummy | **B** |
| the run, after this file is committed with its predictions | **A** |
| scoring against §2–§3, and against R1's table | **the librarian** |
