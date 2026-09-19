# P-COMPACTION-REMEASURE · BRAVO — did the preserve directive move what compaction keeps? (D089, unattended lap 10, stage 1)

**B (pane `12fb81f6`), machine D, 2026-09-19 13:3x–13:5x.** At HEAD `3f0db41`. The packet is the registration
`exo_memory/loop/compaction_survival_remeasure_registration_2026-09-19.md` @`e0033bc` (REG), read in full at source.
- Transcripts were read only; none was copied into the repo.
- No transcript text is in any file I wrote, only counts and metadata. `grep -c "This session is being continued"` over the
  outputs → 0.
- The hook was not touched. Nothing is committed.

SCR = `C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/compact`.
OUT = `exo_memory/loop/compaction_remeasure_D089/`.

---

## 0 · RESULT

**1. The registration as written CANNOT be scored.**
- REG §3 (`:17`) defines POST by the marker appearing "in the rows **just before**" each event.
- In the chair's transcript the marker **never** precedes an event. It is logged **3 rows after** each marked event (0 of 19
  have it before), which is where the hook's own doc says it goes: *"grep PRECOMPACT-PRESERVE-V1 on the **post**-compaction
  transcript"* (`consonance/hooks/precompact-preserve.js:70-73`).
- **POST as registered = 0 events. No POST rate exists under the text.**

**2. Under an AMENDED reading, the marker in the 5 rows after the event,** fixed in `OUT/decisions.txt` at 13:38:27 **before any
POST number** (§4 here). The chair, FLAG first as REG §7 (`:39`) requires:

| class | PRE pooled | spread (IQR) | bar | POST pooled (7 events) | events above the bar | verdict (REG §5) |
|---|---|---|---|---|---|---|
| **FLAG** | 14/400 = 3.5% | 0.0489 | 8.39% | **26/406 = 6.4%** | 3/7 | **DECORATIVE** |
| SHA | 25/244 = 10.2% | 0.1228 | 22.5% | 124/348 = 35.6% | 5/7 | WORKS |
| PATH | 110/325 = 33.8% | 0.1844 | 52.3% | 183/590 = 31.0% | 0/7 | **DECORATIVE** |
| NUM | 30/322 = 9.3% | 0.0243 | 11.75% | 110/496 = 22.2% | 7/7 | WORKS |

(`node SCR/verdict.js` → `OUT/verdict.txt`.) REG §5's central clause fires: **FLAG, "the class this project runs on", is
decorative after a month.** **The librarian's prediction is half right** (REG §4 `:23`):
- SHA did rise. NUM rose more than "a little". FLAG stayed under 15%.
- **PATH did not rise at all.** It is flat, 33.8% → 31.0%.

**3. The attribution does not hold up, and this matters more than the table.**
- The 4 chair events **without** a marker (all `auto` triggers) score about as high: SHA 27.6%, NUM 26.8%, **FLAG 12.2%**
  (descriptive, `OUT/verdict.txt`).
- The hook's own ledger shows it **fired before every one of those four too** (`C:/Consonance/data/precompact.jsonl`, same
  session, 1.5–3.8 min before each event).
- So "no marker" is not "no directive". **There is no no-directive control after 08-18 at all.** The PRE→POST rise cannot be
  separated from the passage of time: client version 2.1.207–2.1.233 PRE vs 2.1.241–2.1.278 POST (`universe.tsv`, column
  `version`), and whatever else changed across a month. **"WORKS" for SHA and NUM is a before-and-after difference, not an
  effect of the directive.**

---

## 1 · §2: the frozen instrument, as copies in scratch

Tracked scripts' sha256, **before** (13:3x) and **after** (13:5x), identical (`sha256sum exo_memory/loop/2026-08-18/archaeology/{extract,spotcheck,kwcheck}.js`):

    d90beb2d7e7b31eede4108d89021dec13de02efa70288708a51cfa7b8888f35e  extract.js
    877a5804e68ce0202d6fdeacecea460122334ece3fde20d86563c3b232ceb92f  spotcheck.js
    51978e7028f13e8eed3b6380562980319538100427ab4cb4696efc8e69619ced  kwcheck.js

`git status --short exo_memory/loop/2026-08-18/archaeology` → clean.

**The copies** (built by `SCR/make-copy.js` and `SCR/make-copy2.js`, with anchored replacements that each must match once or
the build refuses; `node --check` passes):

| copy | diff (committed in OUT) | what changed, and nothing else |
|---|---|---|
| `extract-copy.js` | `extract-copy.diff`, 18 changed lines | `FILE` by argument; `OUTDIR` by env (never overwrites the tracked `results.json`); **a date filter** (`BEFORE`/`AFTER`) applied **after** windows are cut on all events, so a kept event's window is what the unfiltered script gives it; `EXPECTED_TS` filtered by the same rule for the gate; when the filtered list is empty the gate defers to the universe table (REG §3 `:17`) |
| `spotcheck-copy.js` | `spotcheck-copy.diff`, 4 lines | `FILE` by argument, `RES` by env |
| `kwcheck-copy.js` | `kwcheck-copy.diff`, 2 lines | `FILE` by argument |

**Class definitions, the window rule, dedup and survival are untouched** (REG §2 `:13`). That **includes the known UUID-substring
SHA defect**, which the tracked `extract.js` comment leaves for "a future run [to] decide … BEFORE seeing that run's numbers"
(decision 4, §4).

## 2 · §3: the universe, first

`node SCR/universe.js <file> <seat>` → `OUT/universe.tsv` (28 rows, metadata and counts only).

- **Files:** of 1,176 transcript files in the two project directories, exactly one per seat holds compaction events
  (`node SCR/survey.js`):
  - chair: `0c0c0c0a-…a01.jsonl`, 310 MB, 63,536 lines, **19 events**;
  - librarian: `0c0c0c0b-…115b.jsonl`, 95 MB, 30,033 lines, **9 events**.
- **Window** = rows since the previous event, counted exactly as `extract.js` counts them. The chair's PRE windows equal
  FINDINGS' figures (445 … 3464).

**Chair:**

| # | date | class | window rows | summary chars | trigger | marker before | marker after (+≤5) | hook ledger fire |
|---|---|---|---|---|---|---|---|---|
| 1–7 | 07-13 … 08-17 | PRE | 445, 2493, 3293, 4334, 3127, 3427, 3464 | 15,795 … 29,435 | manual ×7 | no ×7 | no ×7 | none (the ledger starts 08-18) |
| 8 | 08-18 13:38 | **dated 08-18: not "after 2026-08-18"** (decision 3) | 3752 | 18,262 | manual | no | **yes** | 13:36:20 |
| 9 | 08-23 | POST-AMENDED | 3381 | 26,856 | manual | no | yes | 07:30:04 |
| 10 | 08-24 | POST-AMENDED | 3705 | 23,381 | manual | no | yes | 09:34:32 |
| 11 | 08-25 | POST-AMENDED | 4121 | 26,734 | manual | no | yes | 11:03:49 |
| 12 | 08-30 | POST-AMENDED | 4232 | 25,758 | manual | no | yes | 09:33:23 |
| 13 | 09-01 | POST-AMENDED | 4898 | 20,861 | manual | no | yes | 11:08:36 |
| 14 | 09-02 | NO-MARKER | 2959 | 19,623 | **auto** | no | no | 12:34:46 |
| 15 | 09-08 | NO-MARKER | 3072 | 24,781 | **auto** | no | no | 07:22:26 |
| 16 | 09-09 | NO-MARKER | 3003 | 21,168 | **auto** | no | no | 13:46:37 |
| 17 | 09-14 | POST-AMENDED | 2267 | 27,844 | manual | no | yes | **none on D** (likely on L; not checked) |
| 18 | 09-15 | POST-AMENDED | 2712 | 15,834 | manual | no | yes | 17:36:55 |
| 19 | 09-19 04:34 | NO-MARKER | 3114 | 18,466 | **auto** | no | no | 04:33:06 |

**Librarian** (REG §6 `:35`: never in PRE, reported separately): 9 events. **POST-AMENDED 2** (09-14, 09-19 13:36; both manual).
**NO-MARKER 7** (all auto; ledger fires for 4 of them, and 3 are absent from D's ledger).

**The marker splits EXACTLY on the trigger:** in both seats, every manual event after 08-18 carries it and no auto event does,
while the ledger records the hook firing for auto events as well. **So the marker records something about how the harness
logs a manual compaction, not whether the directive was sent.**

**PRE control: RAN AND PASSED on D.**
- `OUTDIR=SCR/pre BEFORE=2026-08-18 node SCR/extract-copy.js <chair file>` → gate ok, 7 events at FINDINGS' timestamps.
- **Pooled SHA 25/244 · PATH 110/325 · NUM 30/322 · FLAG 14/400, exactly as REG §1 `:7` and FINDINGS.**
- All 7 events are identical to the committed `archaeology/results.json` on every class count, window rows and summary chars
  (`node -e` compare → 7 of 7).
- `spotcheck-copy.js` on the PRE results: **6 PASS, 0 FAIL** (`grep -c` on `SCR/spot-pre.txt`).
- REG §3's fallback (`:19`, D lacking the pre-08-18 history) **did not arise**: D's chair file holds all of it.

## 3 · §5: the PRE spread, computed and printed BEFORE any POST rate

- `node SCR/spread.js SCR/pre/results.json` → `OUT/pre-spread.json` (sha256 `1bd5b035…`), written **13:38:13**.
- The first POST number came after 13:38:27 (`post-chair/` created after `decisions.txt`; the file mtimes are in SCR).
- **Quantile rule, fixed in `spread.js` before POST:** linear interpolation (type 7); Tukey hinges printed beside it.
- An event with total 0 has no rate and is left out (NUM event 1, 0/0).

| class | PRE per-event rates | IQR type 7 | IQR Tukey | bar = PRE pooled + IQR |
|---|---|---|---|---|
| SHA | 1, .1667, .2143, .0492, .0862, .1538, .0444 | 0.1228 | 0.1228 | 0.2252 |
| PATH | .5, .3913, .4262, .6047, .1967, .1806, .3607 | 0.1844 | 0.1844 | 0.5229 |
| NUM | 0, .0704, .0667, .0984, .1625, .0727 (n = 6) | 0.0243 | 0.0317 | 0.1175 (Tukey: 0.1249) |
| FLAG | 0, 0, .1111, 0, .0538, .0172, .0440 | 0.0489 | 0.0489 | 0.0839 |

The quantile choice changes only NUM's bar (0.1175 vs 0.1249). POST NUM pooled (0.2218) and all 7 events clear both, so
**no verdict depends on the method.**

## 4 · The decisions made BEFORE any POST number (`OUT/decisions.txt`, 13:38:27, sha256 `9fc798d2…`)

1. **The registered reading governs, and under it POST is empty** (§0.1).
2. **Amended reading, a stated deviation, for C to rule on:** marker within 5 rows after the event and before the next
   assistant row. The ledger is corroboration, not a criterion.
3. **"After 2026-08-18" read literally:** event 8 (08-18 13:38, already published in FINDINGS as the first treated summary)
   is **not** POST. Its committed figures stand on its own row: SHA 21/29, PATH 15/45, NUM 21/48, FLAG 8/109.
4. **The extractor is unchanged, UUID defect included.** Descriptive only (`node SCR/uuid.js` → `OUT/uuid-substring-chair.txt`):
   the session-id substrings `0c0c0c0` and `0000000` sit in most chair windows and **always survive**. PRE carries 9 such
   items (so corrected PRE SHA = 16/235 = 6.8%, the tracked comment's own figure). POST-AMENDED carries 13 (corrected
   111/335 = 33.1%). SHA clears its bar either way.
5. **The headline is the chair's alone.** The librarian's events are listed and scored separately (REG §6 `:35`).
6. **REG §5 names two outcomes and not a third:** "pooled above the bar, but fewer than 2/3 of events". It would be reported as
   NEITHER. It did not occur.

## 5 · §6: confounds, measured

- **Summary length** (`universe.tsv`, `summaryChars`): PRE mean 20,412 (15,795–29,435); POST-AMENDED 23,895 (15,834–27,844),
  **+17%**; NO-MARKER 21,010.
  - SHA ×3.5 and NUM ×2.4 are far beyond +17%, so **neither rise is length alone**.
  - PATH fell while the summaries grew.
- **Kind of conversation:** windows are larger POST (mean rows 3,617 vs 2,940) and carry more items per class (SHA totals
  348 over 7 vs 244 over 7). Survival is a rate, which absorbs volume but not kind (REG §6).
- **Model:** the summarizer model is **not recorded** in any row (the event row has no `message.model`; the
  `compact_boundary` row's `compactMetadata` has trigger, pre/post tokens and duration, no model). As a **proxy**, the nearest
  assistant model on either side:
  - PRE: opus-4-8 (#1), **fable-5 (#3)**, opus-5 (the rest);
  - chair POST: all opus-5;
  - librarian: all fable-5-1.

  The proxy is the conversation's model, not necessarily the summarizer's.
- **Client version:** PRE ran on 2.1.207–2.1.233; the chair's 11 events after 08-18 ran on **10 distinct versions**, 2.1.241–2.1.278 (`cut -f13 OUT/universe.tsv`). That is the confound §0.3 cannot remove.
- **FLAG vocabulary in the summaries** (`kwcheck-copy.js` → `OUT/kwcheck-*.txt`, counts only): per-summary uses of
  "falsifier" rise from 0–6 PRE to 0–10 after. That bounds FLAG's paraphrase-blindness (PREREG: FLAG is a floor) without
  scoring it.

## 6 · Questions not put to anyone (the keeper is asleep); defaults taken

1. **Is the amended marker reading acceptable, or is the registration void as written?** Default: the text governs, so **POST
   = 0 and the registration cannot be scored as written.** The amended table is reported as a deviation for C and the
   librarian to rule on.
2. **Since the ledger shows the directive fired for auto events too, should POST be ALL events after 08-18 (11 chair events),
   with the marker dropped as the criterion?** Default: not taken. That is a second change to the event filter, and REG §7
   (`:39`) voids on any change after the first POST number. **It is filed as the design question for a re-registration.**
3. **Is there any no-directive comparison left?** Only by turning the hook off for a window, which is the keeper's machine and
   a registration of its own. Default: none, and said so in §0.3.
4. **REG §1 (`:7`) says "this morning's compaction of this seat ran under it (the hook's output is in the 07:34
   checkpoint)".** D's librarian transcript has no event between 09-16 13:00 and 09-19 13:36, and D's ledger has no librarian
   fire then. **The 07:34 compaction the registration cites is not visible on D.** Default: reported, not resolved. Its
   09-19 13:36 event came **2 minutes after** this registration was committed (13:34).

## 7 · NOT VERIFIED

- **Nothing on L.** Chair event 17 (09-14) has no ledger fire on D, and 3 librarian events are absent from D's ledger.
  Presumably they ran on L; not checked.
- **What the marker's presence means mechanically** (why manual compactions log the hook's context and auto ones do not) is
  read from the pattern, not from the harness.
- **Whether the directive's text actually reached the summarizer in any event.** The ledger records the hook firing, not
  delivery.
- **The self-healing half of `spotcheck.js`** was run only as the PRE control. Its sampled self-healing figures for POST
  were not computed.
- **The summarizer's model.** Only the proxy is reported.

## 8 · WRONG column

- **W1:** my first survey script put a Windows path through a bash heredoc (`\\` became `\`), which broke node's parse. I
  replaced it with a literal path.
- **W3:** my first draft of §5 said the client version "moved in 12 steps". That was hand-made; the file gives 10 distinct versions across the chair's post-08-18 events. Corrected before filing.
- **W2:** `extract-copy.js`'s inserted lines are LF inside a CRLF file. That is harmless to node and visible in the diff; I
  noted it rather than rewrote it.

NEXT: librarian call C for the stage-2 non-author read of OUT and this file, then rule decision 2, when D089 stage 1 closes
