# P-STEP1-READ · BRAVO — non-author read of E's m for T1 (D084, unattended N2, stage 2)

**B (pane `12fb81f6`), machine D, 2026-09-19 12:4x.** At HEAD `cf5da94`, with E's files uncommitted in the tree.
Objects read:
- `exo_memory/loop/diversity_c1/score-step1.diff` (sha256 `29e676b5…`)
- `exo_memory/loop/diversity_c1/m-step1.md`
- `exo_memory/loop/diversity_c1/results-step1.json` (`fb34a8d0…`)
- `exo_memory/handback/p-step1-m-E_2026-09-19.md`

Rules read against: `exo_memory/loop/anchor_similarity_registration_DRAFT_2026-09-15.md`, cited by line throughout.
**Non-author:** I wrote read2 (`4272e18`), not the scorer, and not p-harness-E or p-leave-E. I edited nothing but this file and
one line in `map/B.md`. Nothing committed.

---

## 0 · VERDICT

**m = 0.2952 over 19 rows IS computed as registered.** The one open reading, E §6.2, is answered by the text: the
negative-control texts are taken at their final state, which is `1e944ac`. I also give the alternative reading as numbers, so
nobody has to guess what it would do:

| reading of the negative-control version | what happens to U_neg | m | n |
|---|---|---|---|
| **A · final state (`1e944ac`)**, E's default and the text's reading (§2) | as computed | **0.2952** | **19** |
| B′ · at each row's parent, falling back to the first-add commit when absent (the rule E already applies to own packets) | **identical on every row.** Each negative text has exactly one version, so the fallback returns the same blob | **0.2952, unchanged exactly** | 19 |
| B · at each row's parent, strictly | the text is **ABSENT at 14 of the 19 counted rows' parents**, so those rows have no U_neg; the 5 where it is present carry a **byte-identical** blob | **0.3209** | **5** |

All three rows are computed without the encoder:
- B′ and the 5 surviving rows of B reuse U_neg values the run already produced for byte-identical texts. The scorer is
  deterministic: four byte-identical step-0 runs, E §7.
- B's median is the median of those 5 committed m_i.

Commands in §2.

Reading B also contradicts the registration's own expectation that "m is expected over 19 rows, not 21" (`:390-392`). Only
readings A and B′ give 19.

---

## 1 · Each rule, against the code and the output

| rule | text (line) | what E did | holds? | how checked |
|---|---|---|---|---|
| R8c U_pos | `:305-306` "the packet with its first "## " section removed, against the packet, UNSTRIPPED (§8.7 R1)" | `firstSectionRemoved(ownText)` vs `ownText`, `{ stripped: false }` (diff `:71-73`) | **yes** | diff read; `scorePair`'s `stripped` default is `true` (`score-step1.mjs:94-96`), so only U_pos is unstripped |
| R8c U_neg | `:306` "handback/p-harness-E_2026-09-15.md against the packet, stripped" | `scorePair(git(RUN, negRel), ownText)`, default stripped (diff `:74`) | **yes** | same |
| R8c exception | `:310-311` p-leave-E for packet_harness_and_lib | `negRel = NEG_ALT_REL` when `ownName === 'packet_harness_and_lib_2026-09-15'` (diff `:72`) | **yes**, on 3 rows | `results-step1.json` `step1.table[].negControl` |
| R8c "own packet as §8.7 R4 defines it" | `:307-308` → R4 `:194-195` "at the parent of the commit that first added the hand-back" | own packet at `parent`, with first-add fallback (flagged) | **yes**; the fallback never fires (E precheck 21/21 present) | `ownSha` column = parent |
| R8c "the same two controls" | `:308` | both controls scored against the row's OWN packet text (diff `:70`) | **yes** | diff read |
| R8c m | `:308-309` "m is the median of the m_i" | step 0's `q(·, 0.5)` | **yes**. Re-derived: sorted 19 m_i, the 10th is **0.2952**; each m_i recomputed as `deltaSymU / scale` and each scale as `Upos.U − Uneg.U` agree within **0.00016** (rounding) | `node -e` over `results-step1.json` (§2 script) |
| R8c timing | `:312` "committed BEFORE any arm runs" | no arm exists | **yes**, conditional on the commit (§4) | — |
| R8e U | `:358-359` "U … replaces the single-phase primary … the arms, both controls, and every m_i in R8c" | `ownScore.U`, `posC.U`, `negC.U`, `othersSymU` all six-phase U (diff `:67`, `:84`) | **yes** | diff read |
| R8e reported | `:363` "per text and pair: the six-phase min and max beside U" | `u6()` carries `U, Umin, Umax, centroidTW, phases` for Upos and Uneg (`score-step1.mjs:167`) | **yes** for the controls. For the own pair, `ownU` in the table carries only `.U`; min and max are in the step-0 row fields | json keys read |
| R8e guard | `:364-365` sign change across phases → r ≤ 0 | not applied | **correctly not applied.** The guard is on r (arms), not m_i. E §7 says the same | — |
| R8f | `:376-380` own packet at parent; each OTHER packet at that same parent; absent → left out and reported | `gitTry(parent, p)`; absent → `symAbsent`; void → `symVoids` (diff `:66-67`) | **yes** | `absentAtParent` / `voidAtParent` per row in the json |
| :390 gap paragraph | "A P2 row whose parent holds NO other packet has no other-mean and no m_i … reported … over 19 rows" | p-stick-A and p-stick-E VOID with that reason | **yes**, the same two rows it names | `m-step1.md:29-30` |
| R8i | `:675-677` empty after strip → VOID pair; "the same way a hand-back stripped past 50% is" | `scorePair` sets `void` on `share > 0.5` (`:97`); step 1 voids a row on a void control pair | **yes**; no pair was void at any parent | E §4; `voidAtParent` empty |
| §8.7 R1 | `:171-173` positive UNSTRIPPED; negative p-harness-E stripped | as above | **yes** | — |
| §8.7 R4 hand-back | `:196` "hand-back its final state" | own hand-back `H` at `RUN = '1e944ac'` (`score-step1.mjs:27`) | **yes**: **0 of the 21 hand-backs differ between `1e944ac` and HEAD** (`git rev-parse <c>:<path>` on all 21) | §2 |
| §8.7 R4 excluded | `:197` packet_diversity_c1 and void pairs dropped from both sides and reported | unchanged from step 0 | **not re-checked** (step 0's `p2.excluded` is unmoved, see below) | — |
| §8.11 gate | `:651-653` "the gate reads passU" | diff `:45` | **yes**; both pass (0.8409 / 0.4548) | json `step1.gate` |

**E's "only the two changes" claim holds.**
- `results-step1.json` with every `step1` block deleted is JSON-identical to the registered `results-step0.json` (`node -e`,
  `JSON.stringify` compare → `true`).
- `git diff --no-index dev/diversity/score.mjs dev/diversity/score-step1.mjs | sha256sum` → `29e676b5…`, which is the committed
  diff's sha, reproduced. Stat: 59+/6−.
- The shas match E §2: `score.mjs` `19c97ab5…` (tracked); `score-step1.mjs` `5e84e9d9…` (untracked).

---

## 2 · E §6.2 in full: the negative-control version

**What the text says.**
- R8c names U_neg as a HAND-BACK, "handback/p-harness-E_2026-09-15.md against the packet" (`:306`), and computes each m_i "for
  that hand-back's own packet as §8.7 R4 defines it, with the same two controls" (`:307-308`).
- §8.7 R4 gives each kind of text its version: "brief — the packet as the pane LAST RECEIVED it: … at the parent" (`:194-195`);
  "**hand-back — its final state**" (`:196`).
- R8f's symmetric-in-version clause moves only **packets**: "the own packet stays at the parent … and each OTHER **packet** is
  taken at that same parent" (`:376-378`). It says nothing that moves a control text.
- **So the text reads: the negative text is a hand-back, at its final state, against the row's own packet at the parent.** That
  is E's default.

**The final state is `1e944ac`, checked:**

    git log --format="%h %ad" -- exo_memory/handback/p-harness-E_2026-09-15.md   → one commit, 04532bc 09-15 05:40
    git log --format="%h %ad" -- exo_memory/handback/p-leave-E_2026-09-14.md     → one commit, 99649d8 09-15 01:58
    git rev-parse 1e944ac:<f> vs HEAD:<f>   → 74306c0b = 74306c0b ; aa619896 = aa619896

Each negative text exists in exactly one version. **"At `1e944ac`" and "at its final state" name the same bytes.**

**What the other reading would do, as a computation:** `git cat-file -e <row parent>:<negative path>` for all 21 rows, with each
row's parent read from the json's `ownSha` (inline `node -e`):

    present at the parent  5   (p-diversity-c0-C, p-diversity-c0-E, p-harness-A, p-harness-E, p-harness-read-B),
                               and on all 5 the blob is 74306c0b / aa619896: byte-identical to 1e944ac
    ABSENT at the parent  16   (every 09-14 row: p-harness-E did not exist until 09-15 05:40)

- **Under B′ (fallback to first-add):** the fallback text is the only version, so U_neg is the same number on every row.
  **m = 0.2952, n = 19, unchanged exactly.** No encoder run is needed; the inputs are byte-identical.
- **Under B strict:** 14 counted rows lose U_neg and become VOID. The 5 survivors keep their committed m_i
  (0.2169, 0.2606, 0.3209, 0.3279, 0.3698). **m = 0.3209, n = 5.** This contradicts `:392`'s "over 19 rows".

**Ruling for the chair, from the text: reading A.** No question is left open on this one.

---

## 3 · E's other two questions

**§6.1, inverted own controls → VOID?**
- The text is **silent**. R8i (`:675-677`) voids empty pairs and R4 (`:197`) voids pairs; neither names a row whose scale is ≤ 0.
- E's default, "VOID and reported", is the conservative one, and it is the only one under which m_i keeps the sign it means.
- **Moot as a number:** 0 of 19 rows inverted. Every counted scale is positive, 0.2966 to 0.4369 (`m-step1.md`). So VOID versus
  counting gives the identical m.
- Question left for the keeper, not answered here: whether to write this rule into the registration before step 2.

**§6.3, cut step 2's scorer from `score-portable.mjs`?**
- The text speaks, partly. §8.11 `:650-651`: the scorer "lands as `dev/diversity/score.mjs` with its node_modules and model
  paths **taken by argument or env**".
- The committed `score.mjs` (`19c97ab5`) and `score-step1.mjs` both keep the hard-coded repo path (E §6.3). So the landed scorer
  does not yet meet `:651` as written, and step 1 inherits that.
- `score-portable.mjs` and its test are tracked. I did not verify their equivalence (D081 is not my read).
- **Conservative default:** m stands as computed on D; re-derivation runs on D. Whether step 2 uses the portable copy is the
  keeper's or chair's call, and it touches the degenerating clause on instrument change.

---

## 4 · Two conformance items that are not about m's value

1. **`:653` "m is computed from the committed scorer, not the scratch one."** `score-step1.mjs` is untracked at `cf5da94`
   (`git status --short`). E ran a staged copy with the same sha, `5e84e9d9` (E §4). m is committed as registered only once
   `dev/diversity/score-step1.mjs` is committed by path beside `results-step1.json`, `m-step1.md` and the diff. **Landing
   order, not a defect.**
2. **§8.11's "ONE change" never reached `score.mjs`.** `:651-653` says `score.mjs` lands with the gate reading `passU`. The
   committed `score.mjs` still reads phase-0 `pass` (the diff's `-if (!posPass || !negPass)`, `:44`), and the change lives only
   in `score-step1.mjs`. Both pass either way (`:653`), so no number moves. §8.11 also says the scorer's "sha is recorded here
   when it lands": `grep -n 19c97ab5` over the registration finds nothing. **This is owed to the T1 → REGISTERED step (plan
   N2), not to this read.**

## 5 · NOT VERIFIED

- **No encoder run by me.** Every U, and hence every m_i, is E's. I re-derived the median and the per-row arithmetic from the
  json, and I checked that the code computes what the rules say. I did not recompute any cosine.
- **The positive-control generalisation** ("first `## ` line to the next") I checked only for plausibility: the removed line
  ranges per packet are 5-14 to 6-28. E's check that it reproduces P1's committed control on the leave packet is E's.
- **R4's "excluded" clause** (`:197`) was not re-checked; it rides on step 0's unchanged `p2.excluded`.
- **Nothing on L.**
- **B′ and B strict give m without a run** only because the scorer is deterministic and the inputs are byte-identical. That
  determinism is E's four-run record plus step 1's one run.

## 6 · WRONG column

- None found in this lap's claims before filing. The one near-miss: I first framed reading B as "the version at the parent",
  which for a text with one version is a presence test, not a version test. The table above keeps B and B′ apart for that reason.

NEXT: librarian collate the read and hand the chair reading A (m 0.2952, n 19) plus the §4 landing order when D084 closes
