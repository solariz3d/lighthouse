# THE LABEL RULE — the WATCH, registered before the rule lands (pane E, L121, on L, 2026-09-27 ~04:2x)

Packet: the chair's L121, at the keeper's 04:11 "do 1 and 2 in chunks". Plan `loop/plan_label_rule_and_push_2026-09-27.md`
(`443ae45`), chunk 1. The rule is C's to draft (`loop/label_rule_draft_2026-09-27.md`), landing at L122. **I have not
opened C's draft.** This watch is fixed without its wording, so that it cannot be shaped to it. The one thing it needs
from the rule, the exact marker, is pinned from the LANDED text at L122 (§1.3), not from the draft.

**The base this stands on:**
- **The L119 registration** `loop/claim_base_rate_registration_2026-09-27.md`, sha256 `b6910a78…c4f`, sealed at
  `cf2439b`. It is cited as **R19:<line>**, and it governs wherever this file says "by reference".
- **The L120 score** `loop/claim_base_rate_score_2026-09-27.md`, sha256 `ba246b83…07c0`, at `c127075`. It is cited as
  **S20:<line>**.

**Nothing is sampled or verified here.** The only things run were counts, in §7.

---

## 0 · WHAT THE RULE CLAIMS, and so what "works" means

- **The rule is "mark, don't ban"** (S20:47–51, the keeper at 02:02). A claim says whether it was CHECKED or INFERRED, and
  a reader who will act on an INFERRED claim checks it first.
- **So the rule does not promise fewer WRONG claims written.** It promises that the WRONGs arrive **marked**, so the
  reader knows which to check.
- **The rule works if three things hold:**
  1. the labels are **used** (§1);
  2. the labels are **informative**: WRONGs sit under INFERRED, and CHECKED is near-clean (§2);
  3. the labels **match what the text shows**: a claim marked CHECKED shows its check (§3).
- **The rule is decoration if the labels are absent, uninformative or false.** §4 fixes those readings.

## 1 · (a) THE LABELLED SHARE

### 1.1 Frame: two strata, reported separately and pooled
- **H, hand-backs.** Every file under `exo_memory/handback/` whose **first commit** is after the seat's exposure (§1.4).
  The unit is the file. Its claim text is the whole file.
- **K, replies to the keeper.** In the six seats' main transcripts on L (the R19:11 seat table, the same six session
  files), a keeper-typed prompt is a `type:"user"` row that meets all of the following:
  - it is not `isMeta` and not `isCompactSummary`;
  - it carries no `tool_result`;
  - after any `<pasted_content …>` opener is stripped, its text does not start with `[` (this excludes `[chair:`,
    `[pane:`, `[librarian:` and `[keep-warm`) or `<`;
  - it does not start with `This session is being continued`.

  The unit is the **last assistant message with text** before the next user row that is not a tool result. Its claim
  text is extracted by arm 1's §1 rule (R19:63).
- **The machine** is split by the hook command path (R19, `frame.js` in §11: `\Users\zackn\` = L). **This watch reads
  L's rows only**, with the D-side limit in §6.

### 1.2 Extraction
- **The same harness as L119, by reference** (R19:61–69): arm 1's reader with arm 1's sealed ask and isolation, the
  statements parsed per `be4b03b` point 3, and **K = 3 per unit** in `sha256(unitId + "|" + statementIndex)` order.
  `unitId` is the message.id for K, and the file path plus its first-commit sha for H.
- **One addition, needed because the reader returns quotes, not the lines around them:** each quoted claim is
  **located verbatim** in the unit text (the first exact-substring match, after whitespace is collapsed on both sides).
  - A claim that cannot be located is **UNLOCATED**. It is counted and excluded from the share.
  - **If more than 20% of claims are UNLOCATED, the share is not reported (DG-A2).**

### 1.3 What counts as labelled — a mechanical detector, pinned at landing
- **The marker** is whatever exact token or tokens the rule, **as landed in `BUILDING.md` at L122**, tells a writer to use
  for CHECKED and INFERRED.
- **It is written as one case-sensitive regex, `LABEL_RE`, into this file as a dated appendix in the L122 landing
  commit, before any post-rule unit is read.** A regex changed after any post-rule unit is read voids (a) (the abuse
  clause, R19's form).
- **A located claim is LABELLED if `LABEL_RE` matches within:**
  - the physical line that holds the claim's first character;
  - the nearest preceding heading or bullet parent of that line, which **covers** the claims under it; or
  - the table row that holds the claim.

  The label read is the matched token, CHECKED or INFERRED. If both match, it is **MIXED**, which counts as labelled and
  is printed.
- **THE DETECTOR CONTROL runs first, and it is the reason (a) can be read at all.** This room already uses "CHECKED" as a
  KIND word (R19:75, every L119/L120 file).
  - `LABEL_RE` is run over the **last 30 H units and the last 30 K units before R** (R = the landing commit), with the
    same extraction and location.
  - **If the pre-rule "labelled" share exceeds 0.05, the detector is counting vocabulary, not labels.** It is refixed,
    and the refix is recorded, **before any post-rule unit is read (DG-A1).**

### 1.4 Exposure: when a seat has actually been given the rule
- A seat is exposed from its **first session start (`startup`, `resume` or `compact`) after R on L whose loaded shell
  carries the rule.** This is checked by grepping that seat's instance `CLAUDE.md` for the pointer line A lands at L122.
- **A seat awake across R has not read the rule until it next wakes.** Counting its units would score a rule it never
  saw.
- **If the pointer never reaches a seat's shell, that seat is NOT DELIVERED.** It is printed as such, and it is the
  carrier finding, not a zero share.
- **The landing lap (L122) is excluded for every seat.**

### 1.5 N and the reads
- **First read:** the first **30 H units and 30 K units** after exposure. That gives 180 claims before exclusions. At a
  share of 0.5, the CP95 on 90 claims per stratum is about ±0.11.
- **Second read:** the **next** 30 H and 30 K units, the same N. **Decay is the failure mode this room's rules have
  had** (the NEXT-trailer warnings, the carrier retirements BOOT records), so one read is not enough.
- **K is dominated by the librarian.** Keeper-typed prompts per seat, per day, on L from 09-14 to 09-27 (§7): the
  librarian has 7–90 a day, and every other seat has 0–12. **The K stratum is therefore mostly the librarian's**, and the
  per-seat count is printed beside it.

## 2 · (b) LANDED WRONGs, AGAINST A PRE-RULE BASELINE

### 2.1 The per-lap census baseline is REFUSED on L, and why (the packet allows this)
The packet asks for landed WRONGs **per lap** against a pre-rule window. The record on L cannot fix that baseline:
- **The 422-row WRONG census** (`703dc74`) is **D-only and unpushed.** `git show 703dc74` on L gives "unknown
  revision", and R19:51 already names it D-only. Only its 48 located or unlocated rows were recovered on L
  (`loop/retrieval_located_rows_recovered_2026-09-27.md`), and 24 of those are NOT LOCATABLE. That is not a per-lap
  count.
- **The librarian's WRONG column is a hand-carried running number, not one row per error.** The librarian said so itself
  (`librarian/2026-09-07.md:278`): `grep -ohE "WRONG #?[0-9]{1,3}"` gives 28 distinct numbers against a counter reading
  80 → 83, part of it numbered on D's files. A per-lap count from it would be a hand-made figure.
- **Even with the census on L, it counts WRONGs FOUND, not WRONGs landed.** It moves with how hard anyone looked. A fall
  after the rule could mean less looking. A per-lap census comparison **cannot tell the rule working from the looking
  stopping**, so it would be refused as the gate even if it were on L.

### 2.2 The baseline that L does hold, which is uncurated
**L120's random sample** (S20:21–28): 300 claims from 100 messages drawn by hash from the six seats' messages, 09-14 to
09-23 on L, with verdicts from two blind verifiers:
- unchecked WRONG **8 / 163 = 0.049** (bootstrap 0.013–0.093, S20:25);
- CHECKED WRONG **1 / 72 = 0.014** (S20:28);
- all verdict-bearing claims **9 / 235 = 0.038**, from those two rows.

**This is the pre-rule baseline window: 09-14 to 09-23 UTC, on L, the R19 frame.** Nobody chose which claims are in it.

### 2.3 The post-rule measurement: L119 run again, plus the self-label
- **The frame** is R19 §1 with the window moved: all six seats' messages of 200 or more characters written on L after
  each seat's exposure (§1.4). The seed salt is `"L121W|"` in place of `"L119|"`.
- **The draw:** M = 100 and K = 3 (R19 §6), the extraction by R19 §2, kinds and verdicts by R19 §3–§4, and the verifiers
  and blindness by R19 §9. The chair dispatches the verifiers, and E is excluded again (E holds §5).
- **What is added:** each claim's **self-label**, which is `LABEL_RE` per §1.3, applied mechanically and **before** the
  claims go to the verifiers.
- **The self-label is MASKED in the claims packet the verifiers receive** (each matched token is replaced by `[·]`), so
  the verifier's kind is not copied from it. **Limit:** a verifier who opens the raw transcript can see it. Verifiers are
  told not to read the marker, and κ(self, verifier) in §3 is **biased upward** by any leak.
- **Every post-rule WRONG is printed with its self-label.** INFERRED is the rule working as intended. **CHECKED is a
  false check, the worse failure.** UNLABELLED means the rule was not used.
- **"Per lap" is printed, and it decides nothing.** It is the WRONG rate × the verdict-bearing claims per lap. Claims per
  lap are counted from the frame's messages between the chain's lap-open rows on the board, and lap ids come from the
  board (`node consonance/tools/chain-status.js`). The per-claim rate is the unit, because it is what the baseline is in.

### 2.4 What (b) can and cannot show, in advance
- **A fall in the pooled WRONG rate cannot be shown at this N.** Showing 0.049 → 0.025 at α 0.05 and power 0.8 needs
  about 970 unchecked claims per arm (the two-proportion normal formula, §7). This sample has about 160.
- **So the pooled rate is printed, not gated.** The gate for (b) is §4's F2, which asks whether the WRONGs land under the
  right label. The sample can answer that.
- **The one pooled reading that does gate is harm.** If the post-rule pooled WRONG rate's bootstrap lower bound exceeds
  the baseline's point (0.038, all verdict-bearing), the rule coincided with more WRONGs. This is printed as **WORSE**,
  and the chair asks why.

## 3 · DO THE LABELS MATCH WHAT THE TEXT SHOWS
- **On the §2.3 sample, where B and C agree on kind** (R19:75–78), with CHECKED against the two unchecked kinds together
  and NOT-A-CLAIM excluded: the **agreement between the self-label and that agreed kind** is reported, with κ.
- **Why only the agreed claims:** B and C agreed on kind at only κ 0.418 (S20:36). Measured against one verifier, a
  self-label could look wrong where the verifiers themselves split. The claims where they agree are the ones whose kind
  is settled enough to test a label against.

## 4 · THE FALSIFIERS — the readings that say the rule is DECORATION (fixed now)

**Outcomes are per stratum (H, K), then pooled:**
- **WORKS:** no F fires.
- **DECORATION:** any F fires, named by which one.
- **NOT TESTED:** a DG fires.

| | reading | fires when |
|---|---|---|
| **F1** | **not used** | the labelled share is **< 0.50** in a stratum at the first read, **or** is < 0.50 at the second read (decay) |
| **F2** | **not informative** | on the §2.3 sample: rate(WRONG \| self-CHECKED) ≥ rate(WRONG \| self-INFERRED), **with at least 3 WRONGs under self-CHECKED**; **or** at least 3 WRONGs under self-CHECKED where the message or turn shows no check with its result (**false checks**) |
| **F3** | **false labels** | the self-label agrees with the B+C-agreed kind (§3) on **< 0.75** of claims |

- **F2's "at least 3" is the price of the sample.** At the baseline's 1 in 72, one or two CHECKED WRONGs are expected by
  chance. **F2 can fire only if false checks are materially more common than that.** A clean F2 at this N says "no large
  false-check rate", not "none".
- **The degenerate clauses (no outcome, and the reason is the finding):**
  - **DG-A1:** the detector control is above 0.05 and was not refixed before post-rule reading.
  - **DG-A2:** more than 20% of claims are UNLOCATED.
  - **DG-A3:** fewer than 20 H or 20 K units within 14 days of R. The stratum is NOT TESTED at that read.
  - **DG-B1 to DG-B4:** R19 §8's four, unchanged (R19:201–217): UNVERIFIABLE above 50%, fewer than 60 verdict-bearing
    unchecked claims, verdict κ below 0.40, or more than 20% of messages yielding no claim.
  - **DG-B5:** fewer than 30 self-CHECKED claims. F2 is NOT TESTED.
  - **NOT DELIVERED** (§1.4): a seat is printed, and it is outside every share.
- **THE ABUSE CLAUSE (R19's):** any change to a threshold, stratum, N or window after a post-rule unit is read voids that
  part. **"The rule needs more time"** is allowed only as the second read already registered here, **not** as a third
  read added after the second one disappoints.

## 5 · SEALED PREDICTIONS (E), written before the rule lands and before C's draft is read

- **(a) first read:** H **0.70**, K **0.35**, pooled **0.53**. **Second read:** H 0.60, K 0.30.
  - **So F1 fires on K at the first read, and on H at neither.**
  - The reason: hand-backs are structured notes written under a checklist (WHAT A HAND-BACK OWES). Replies to the keeper
    are in the plain register he asks for, where a tag on every claim reads as noise. The rule's own pointer line for
    replies is one sentence, against a whole item for hand-backs.
- **(b):** pooled post-rule WRONG **0.04**, unchanged from the 0.038 baseline and not shown either way. WRONG \|
  self-INFERRED 0.06, and WRONG \| self-CHECKED 0.02.
  - **DG-B5 does not fire.** I expect about 60–80 self-CHECKED claims.
  - **F2 does not fire,** with 1–2 false checks.
- **(3):** agreement **0.80**, so **F3 does not fire**, narrowly.
- **So: WORKS on H, DECORATION (F1) on K.** The useful answer is that the rule needs a different form for replies to the
  keeper, not that it failed.
- **Where I could be wrong in the costly direction:** K above 0.50. That would mean the keeper-facing register absorbs
  tags better than I think, and my plain-register argument was wrong. S20:54 already found my L119 predictions a row too
  pessimistic.

## 6 · LIMITS (d), and what this watch cannot see
- **Two machines.** This watch reads **L only.**
  - D's seats get the rule only after chunk 3's pull, and their shells regenerate on D. Units written on D count only if
    they are carried to L (the stick, or merged git) **and** meet §1.4's exposure check on D's instance `CLAUDE.md`.
  - Otherwise D is printed as **NOT READ**. R19's D-side limit (R19:51, the 24-hour rule) carries over.
- **Labels are self-reported.** The label is the writer's own statement about the writer's own check. §3 and F2's
  false-check arm are the only guards, and they rest on the verifiers' kind.
- **The kind κ was 0.418 in L120** (S20:36). §3 therefore uses only B+C-agreed claims, which leaves about 60% of the
  overlap-sized set. F3 is a coarse test on a narrow base. If the post-rule kind κ is under 0.40, **F3 is NOT TESTED.**
  That is a DG added now, not later.
- **Masking is not proof of blindness** (§2.3).
- **What (a) cannot tell:** whether a reader **checked an INFERRED claim before acting on it.** That is the rule's second
  half, and it is not measured here. Measuring it needs acted-on claims traced across packets, which is a separate
  registration, and it is named as the gap.
- **The WRONG-per-lap unit is refused** (§2.1). If the census is later carried to L, it may be printed beside the
  results as found-WRONGs per lap. **It is never a gate,** for the looking-effort reason.

## 7 · COMMANDS, and what they gave

```
git show 703dc74                                   # on L: "unknown revision" — the census is not here
grep -n "8 / 163\|1 / 72\|κ kind" exo_memory/loop/claim_base_rate_score_2026-09-27.md   # S20:25, :28, :36
node <scratchpad>/kp.js    # keeper-typed prompts per seat per UTC day, L, 09-14..09-27 (counts only; §1.1's
                           # filter minus the continuation-summary exclusion, so slight over-count)
  lib 49 42 88 9 7 27 58 90 87 51 10 18 31 11 · chair 12 12 2 2 0 1 0 5 5 2 0 1 2 0 · A/B/C/E 0–4 per day
git log --since=… --diff-filter=A --name-only -- exo_memory/handback   # hand-backs added per day on L, 09-20..09-26:
  33 34 57 47 17 8 18  →  30 H units in about 1–4 days
# §2.4: n = (1.96·√(2·0.037·0.963) + 0.84·√(0.049·0.951 + 0.025·0.975))² / 0.024² ≈ 969 per arm  (node -e; my hand figure was 971, from rounded intermediates)
```

---

## AMENDMENT A · 2026-10-01 (pane E, the registrar; D201 phase 1, on D) — committed BEFORE any post-rule unit is read

Packet: the chair's D201 (lap row D202). Plan `loop/plan_label_watch_first_read_2026-10-01.md` (`b3b6d109`, sha256
`9183705a…e91e6b`). It fixes the two defects the librarian found before any read: **(1) `LABEL_RE` was never pinned** (no §1.3
appendix; the file's only commit was `1f448d71`), and **(2) the frame was L-only**, while the work since 09-27 is on D.
**No post-rule unit's labelling has been read.** Post-rule units below are COUNTED only. The control (A2) reads pre-rule units only.

### A1 · `LABEL_RE`, pinned from the landed text
- **Source:** the rule as landed at `1e7520a7`, `consonance/src-tauri/brief/BUILDING.md:487–488`, WHAT A HAND-BACK OWES item 7:
  `checked: <command or path:line> → <result>` and `inferred: <the claim>`.
- **`LABEL_RE = /\b(checked|inferred):/`**: case-sensitive, and group 1 is the label read (`checked` → CHECKED, `inferred` → INFERRED, both → MIXED).
  - It does **not** match the all-caps kind word `CHECKED` (R19:75), `unchecked:` (no word boundary inside a word), or a
    sentence-case `Checked:`.
  - The last is a known UNDER-count, accepted: the landed rule tells a writer to use the lowercase tokens, and §1.3 pins "the exact token".
- Applied per §1.3, unchanged: the claim's physical line, its nearest preceding heading or bullet parent, and the table row (its own line).

### A2 · The detector control (§1.3): PASSES, so no refix is needed (DG-A1 does not fire)
- **Units:** the last 30 H and the last 30 K before R (`1e7520a7`, 2026-09-27T10:35:57Z), from D's history and transcripts, both machines' rows.
  - H: 30 hand-back files by first commit, 2026-09-26T08:13Z → 2026-09-27T10:24Z (22 written on L, 8 on D).
  - K: 30 replies to the keeper, 2026-09-26T13:33Z → 2026-09-27T10:11Z (L: librarian 11, two siblings 1 each; D: librarian 15, chair 2).
- **Extraction:** as §1.2. Arm 1's reader is `claimrec.js readers` with no `--ask` (ask sha256 `07e7f855…d3c1`, arm 1, `c8c18d4` §2).
  - 60 calls, 60 exit 0.
  - `claude --version` was 2.1.286 before and after; the model was `claude-sonnet-5-5`; 0 transcripts were added.
  - Statements were parsed by `parseStatements`; K = 3 per unit in `sha256(unitId|statementIndex)` order; claims were located per §1.2.
- **Result:**

  | stratum | statements | kept | located | UNLOCATED | **labelled** | share |
  |---|---|---|---|---|---|---|
  | H | 1,278 | 90 | 68 | 22 (24.4%) | **0** | **0.000** |
  | K | 375 | 87 | 71 | 16 (18.4%) | **0** | **0.000** |
  | pooled | 1,653 | 177 | 139 | 38 (21.5%) | **0** | **0.000** |

  - The bar is a pre-rule labelled share > 0.05 → refix. **0.000 ≤ 0.05, so `LABEL_RE` stands as pinned.**
  - For scale: the raw `LABEL_RE` matches anywhere in the 60 units total 10, in 6 units. None of them falls on a located claim's line or parent.
- **Commands** (record: `C:\Consonance\sealed\label_watch_2026-10-01\d201_phase1\`, all under the heavy-run lock):

      node frame.js <worktree> out                      # frame, exposure, counts; writes out/control/*.md (pre-rule only)
      node exo_memory/loop/claimrec/claimrec.js readers --in out/control --out out/readers
      node control_score.js <worktree> out              # the table above -> out/control-score.json (sha256 9631c689…674a)

### A3 · ⚠ A FINDING FOR A RULING BEFORE THE READ (not applied here): the locator loses H above DG-A2's 20%
- On the control, **H's UNLOCATED share is 24.4%**, above DG-A2's 20%. If the post-rule rate is similar, **H will be NOT TESTED at the read.**
  K (18.4%) is under the bar.
- **Why, on the 22 H misses** (`unloc_diag.js`, pre-rule units only):
  - 6 differ from the text only by markdown (asterisk, underscore, backtick);
  - 5 are ellipsis-joined quotes;
  - 5 statements carry no quote;
  - 6 are other mismatches.
- **A locator that also strips those markdown characters on both sides, and locates an ellipsis-joined quote by its first part of 6 or more words, would bring H to about 11/90 (12%).**
  inferred: estimated from the categories above, not run as a rule.
- **This amendment does NOT change the locator.** The packet holds everything else as sealed. Under the abuse clause, a change made now,
  before any post-rule unit is read, would not void. **It is the librarian's ruling to make** before phase 2, and either answer is lawful now.

### A4 · The frame: machine D added, and L kept where reachable
- **Machine of a row:** by the hook command path (R19's rule): `\Users\nname\` = D, `\Users\zackn\` = L.
  - **Row by row, not file by file.** It is the most recent hook command path seen in its transcript file, in file order.
  - checked: the persistent session files on D carry rows from BOTH machines. The librarian's has 175 session starts on D and 147 on L, read from SessionStart hook entries.
- **Seats (D's live instances):** librarian, chair (`main`), and siblings `07b8a48f` (E), `0845a868`, `3d57124e`, `5bf9d657`.
  The fresh-*, the stale siblings and third-place are outside the frame, as in R19.
- **When the rule reached each machine's brief:**
  - **L:** at R, `1e7520a7`, 2026-09-27T10:35:57Z.
  - **D:** the merge `988fe6f9` at 2026-09-27T14:44:20Z. checked: `1e7520a7` is its ancestor, and D's resolved brief
    `consonance/src-tauri/target/release/BUILDING.md` carries item 7, with mtime 14:44:02Z.
- **Exposure (§1.4):** a seat's first session start after that time on that machine, with the hook source startup, resume, compact **or clear**.
  `clear` is added because a `/clear` reloads the shell exactly as the other three do.

  | seat | exposed on D | exposed on L |
  |---|---|---|
  | librarian | 2026-09-27T17:20:23Z (startup) | 2026-09-27T13:10:34Z (resume) |
  | chair | 17:49:03Z (compact) | 13:10:30Z (resume) |
  | sib-07b8a48f (E) | 19:20:46Z (compact) | 13:09:49Z (resume) |
  | sib-0845a868 | 17:26:08Z (compact) | 2026-09-29T06:26:48Z (resume) |
  | sib-3d57124e | 17:34:48Z (compact) | 13:09:46Z (resume) |
  | sib-5bf9d657 | 23:16:30Z (compact) | 13:09:47Z (resume) |

  - **Shell check on D:** each of the six instance `CLAUDE.md` files on D carries the rule today. `grep -c "Checked or inferred"` = 1 for the
    librarian and the four siblings; `main/CLAUDE.md` carries item 7 itself. **NOT DELIVERED: none.**
  - inferred: that each D shell carried it from its exposure time on. The shell regenerates at each start from the brief above, which has carried
    it since 14:44Z, but a past shell's text is not on disk.
  - **L:** the shells are not reachable, so exposure on L is inferred from the session starts in the carried rows.
- **Units per machine** (post-exposure, inside the 14-day window to 2026-10-11; COUNTED, not read):

  | stratum | D | L (reachable) | pooled |
  |---|---|---|---|
  | **K** | 124 (librarian 118, chair 2, E 2, 0845a868 1, 3d57124e 1) | 58 (librarian 48, chair 3, 3d57124e 3, 0845a868 2, 5bf9d657 2) | **182** |
  | **H** | 94 (first commit after D's latest seat exposure, 23:16:30Z; 129 after the earliest) | 0 reachable | **94** |

  - An H unit's machine is the lap letter in its file name (`p-d…` = D, `p-l…` = L), else the commit subject's "on L / on D".
  - **7 post-R hand-backs carry neither and are excluded** (counted here).
  - L's own hand-backs after R are in L's unpushed commits, so they are NOT READ from D (§6's limit, now for H only).
- **DG-A3 does not fire on D or pooled:** ≥ 20 H and ≥ 20 K inside the window.
- **The first read (§1.5)** takes the first 30 H and 30 K after exposure **in time order, pooled across machines**, and every share is printed per
  machine and pooled.

### A5 · Unchanged, as sealed
N, F1–F3, DG-A/DG-B, §5's predictions and the abuse clause stand exactly as written above. §6's "this watch reads L only" is replaced by A4's frame.
Nothing in §1–§7 is edited. This amendment is appended, dated, and committed by path before phase 2.
