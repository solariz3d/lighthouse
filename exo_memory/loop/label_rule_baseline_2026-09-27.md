# THE LABEL RULE — the PRE-RULE BASELINE, computed as the watch's §2 defines it (pane E, L126, on L, 2026-09-27 ~13:1xZ)

Packet: the chair's L126. The registration is `loop/label_rule_watch_registration_2026-09-27.md` (sha256 `3a1a424c…0eda`,
committed unchanged at `1f448d7`), cited here as **W:§**.
- **No post-rule number exists yet**, and none was computed here.
- The clarifications in §0 were written **before** any post-rule unit was read. They are also appended to the
  registration, dated.

## 0 · DATED CLARIFICATIONS, 2026-09-27 ~13:0xZ, before any post-rule number

W:§2 fixed the source, the window and the multiplication, but it left five choices open. They are fixed here.

- **C0 · R, the rule's landing.** The registration names R only as "the landing commit" (W:§1.3, §1.4) and cites **no
  sha**, so it cites neither `8389900` nor anything else.
  - **R = `1e7520a`** ("Briefs: the label rule …", 2026-09-27 04:35:57 −06:00 = 10:35:57Z). That is the rewritten form of
    `8389900` per `handback/p-l123-rewrite-A_2026-09-27.md:30`, and `8389900` means the same landing.
- **C1 · "on L" in W:§2.2** means **the six seats' transcripts as carried on L, with rows written on both machines**:
  exactly R19 §1, the L119 frame. **5,023 messages**, of which L-written 2,895 and D-written 2,128.
  - It does **not** mean L-written rows only. The L120 sample was drawn from both machines' rows.
- **C2 · The source of WRONGs.**
  - The two L120 verdict files, re-hashed unchanged: `retrieval/l119/verify/B/verdicts.json` sha256 `a444e143…`, 193 rows;
    `…/C/verdicts.json` `3e67ea78…`, 164 rows (the same shas as S20's inputs).
  - The columns used are `claimId`, `kind` and `verdict`.
  - Overlap is resolved **exactly as the scorer resolves it** (`loop/claimrec/score_base_rate.js`): §9's rule
    (UNVERIFIABLE wins a CORRECT/WRONG split), and the librarian's declared kind-split rule (14 split claims excluded).
  - **WRONG is counted over all verdict-bearing claims of every kind**, CHECKED included, because the rule labels both.
  - **No WRONG column in any ledger is read** (W:§2.1 refused that).
- **C3 · What counts as a lap: every `open` row in the window, as an event.**
  - The window is `at` ∈ [2026-09-14T00:00Z, 2026-09-24T00:00Z).
  - **L-prefixed** laps come from L's ledger `C:\Consonance\data\lap.jsonl`. **D-prefixed** laps come from D's ledger as
    carried to L by state-sync, `C:\Consonance\state\data\lap.jsonl` (manifest `state-set.json`: machine D, at
    2026-09-25T01:29:16Z; the file's sha256 `6ce78d94…e4be` **matches the manifest**).
  - **Events, not distinct ids,** because ids are reused: L065 opens on 09-16, 09-20 and 09-21, each a separate lap of
    work. That gives L 80 events over 57 ids, and D 62 events over 62 ids.
  - **Voided laps are counted**, and a sensitivity line is printed without them.
- **C4 · "Per lap" is a RATIO over the window, not a sum over lap spans.**
  - The formula: (WRONG per sampled message) × (frame messages in the window) ÷ (lap opens in the window).
  - **Spans were tried and rejected:** the last lap of each session absorbs every unlapped hour after it. L065's span
    runs 117.5 h and holds 669 L plus 877 D messages; L059's runs 49.6 h (`baseline.js --laps`).
  - So "per lap" means **per lap's worth of the room's writing**, and messages written outside any lap are in the
    numerator.
- **C5 · The post-rule side uses C1–C4 unchanged**, over the post-rule frame and ledgers.
  - **If D's post-rule ledger or D's post-rule transcript rows are not carried to L, D is dropped from BOTH numerator and
    denominator.** The comparison is then against the **L-only baseline (3.26)**, not the pooled one.

## 1 · THE BASELINE

**The sample** (C2), from `node <scratchpad>/l126/baseline.js`:
- 300 unique claims from 100 messages, of which 14 are excluded as kind splits. There are **235 verdict-bearing** claims,
  and **9 are WRONG**: STATE 6, CONCLUSION 1, unchecked kind-split 1, CHECKED 1.
- **WRONG per verdict-bearing claim: 9 / 235 = 0.038** (CP95 0.018–0.072, by `node -e` bisection). This matches S20:25
  and :28 summed.
- **WRONG per sampled message: 9 / 100 = 0.090.** The cluster bootstrap over the 100 messages (seed `"L126-boot"`, 2,000
  resamples) gives **0.03–0.17**.

**The laps** (C3), from `node <scratchpad>/l126/perlap.js`:

| | lap opens in the window | frame messages | messages per lap |
|---|---|---|---|
| L (L-prefixed, L's ledger) | 80 (57 ids; L058 → L114) | 2,895 L-written | 36.19 |
| D (D-prefixed, D's state-sync ledger) | 62 (62 ids; D062 → D124) | 2,128 D-written | 34.32 |
| **both** | **142** | **5,023** | **35.37** |

Opens by day, L / D:

| day | L | D |
|---|---|---|
| 09-14 | 4 | 2 |
| 09-15 | 3 | 1 |
| 09-16 | 8 | 6 |
| 09-17 | 0 | 1 |
| 09-18 | 0 | 0 |
| 09-19 | 0 | 18 |
| 09-20 | 8 | 5 |
| 09-21 | 13 | 10 |
| 09-22 | 12 | 14 |
| 09-23 | 32 | 5 |

**The two ledgers agree where they overlap.** D's copy carries L rows up to its sync, and all 48 of the L opens it can
hold are in it verbatim (`perlap.js`, `lOpensAlsoInDcopy`). L's ledger holds no D-prefixed open in the window.

### THE PRE-RULE BASELINE: landed WRONGs per lap

| | point | bootstrap 95 |
|---|---|---|
| **both machines (the baseline)** | **3.18** | **1.06–6.01** |
| L only (C5's fallback) | 3.26 | 1.09–6.15 |
| D only | 3.09 | 1.03–5.83 |
| sensitivity: open events of voided ids removed (126 opens) | 3.59 | 1.20–6.78 |

The point is 0.09 × messages per lap. The interval is the message-level bootstrap interval scaled the same way. It is
**the sample's uncertainty only**; the frame counts are taken as fixed.

**Per W:§2.3–§2.4, this per-lap figure is PRINTED and DECIDES NOTHING.** The watch's gates are F1–F3 (W:§4), plus the
per-claim WORSE reading against **0.038** (W:§2.4).

## 2 · WHAT THIS BASELINE CANNOT SEE

- **D's WRONGs not carried to L.**
  - The frame holds the D rows that were carried in the six main transcripts (2,128 messages).
  - It does not hold **D sessions never carried**, subagent or probe sessions, or **D repo state after `5ced140`** (why
    the window stops at 09-23, R19 §1).
  - D's lap ledger is as of **2026-09-25T01:29Z**, which covers the window (it ends 09-24T00:00Z).
- **Laps with no WRONG column.** This baseline **reads no WRONG column at all** (W:§2.1). So a lap without one is not a
  gap here, **but neither is any WRONG a seat caught and recorded.**
  - The baseline counts WRONGs **present in what was written**, found by two blind verifiers, whether or not anyone
    noticed at the time.
  - It is therefore **not comparable** to the librarian's hand-carried WRONG column, or to the D-only 422-row census.
- **Self-reported entries.** **None are used.** Every WRONG here is a verifier's as-of verdict (κ verdict 0.664, S20:35).
  - A CORRECT/WRONG split between the two verifiers became UNVERIFIABLE, so the 9 is **conservative**.
  - The post-rule labels will be self-reported. That is W:§6's limit, and it does not apply to this number.
- **A lower bound, twice.**
  - **K = 3:** only a message's first three claims in hash order were verified (R19 §2), so WRONGs in a long message's
    other claims are not counted.
  - **Exclusions:** UNVERIFIABLE claims and the 14 kind splits carry no verdict.
  - "Landed WRONGs per lap" is therefore **WRONGs among ≤ 3 verified claims per message, per lap's worth of messages.**
    The post-rule side uses the same cap, so the comparison is like for like.
- **Lap counting is a convention** (C3, C4).
  - Ids are reused; 13 L opens and 3 D opens belong to ids that were voided at some point.
  - Messages outside laps are in the numerator.
  - A room that opens more, smaller laps lowers "per lap" without any change in WRONGs. **This is why W:§2.3 made the
    per-claim rate the unit.**
- **One window of ten days,** with 09-18 having no lap opens and 09-17 having one.

## 3 · A GAP FOUND IN THE REGISTRATION ITSELF, flagged and not fixed here (it is §1, which is A's instrument)

- **W:§1.3 says `LABEL_RE` "is written … into this file as a dated appendix in the L122 landing commit, before any
  post-rule unit is read."** It was not.
  - `git show --stat 1e7520a` touches only `BUILDING.md`, `COMMITTEE.md` and `LIBRARIAN.md`, and the registration has no
    appendix (`grep -n LABEL_RE`: only §1.3's own lines).
- **The registration's own clock is therefore "before any post-rule unit is read", not the landing commit.**
  - `LABEL_RE` must be pinned, **with its detector control run first (W:§1.3, DG-A1)**, before A's instrument reads any
    post-rule unit.
  - If A's instrument has already read post-rule units with an unpinned regex, **(a) is void for those units** (W:§1.3's
    abuse sentence), and the read restarts after the pin.

## 4 · COMMANDS

```
node <scratchpad>/l126/baseline.js [--laps]   # sha256 01e34dc1…3f7a — §1 sample; frame 5,023 (L 2,895 / D 2,128); spans (C4's rejection)
node <scratchpad>/l126/perlap.js              # sha256 aea0a78a…7681 — lap opens L 80 / D 62; D ledger sha = manifest; 48 of 48 shared
node -e "<0.09 × messages ÷ opens; CP by bisection>"   # §1 tables
sha256sum C:/Consonance/retrieval/l119/verify/*/verdicts.json   # a444e143…, 3e67ea78…
git show --stat 1e7520a                        # R; three brief files only
```
