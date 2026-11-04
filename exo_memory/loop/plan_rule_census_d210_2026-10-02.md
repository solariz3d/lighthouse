# D210 — where MD rules WORK, to see where they fail: the rule-compliance census. Librarian, on D, 2026-10-02 12:5x.

The keeper, 12:54: "MD files work, we know it affects how claude code works, maybe we can see where it works to understand where it
fails." Then: "do it".

## Why
Every intervention on the writer failed under seal: cues, the retriever, check-before-claim, labels (`loop/label_watch_score_second_read_2026-10-02.md`).
But some brief rules ARE followed. The librarian's 12:5x grep over 82 hand-backs (09-28..10-02) found:
- a sha256 beside a digest in 74/82;
- a "NOT verified" section in 46/82;
- `checked:`/`inferred:` in 25/82 files, but on 0–1% of claims;
- the NEXT trailer on essentially every ring (refused otherwise);
- dispatch-before-finish broken in 101 of 103 (`loop/turn_boundary_detection_2026-08-25.md`).

Contrast is the method: what separates a followed rule from an ignored one.

## REGISTERED before any census row (the librarian's predictions; the falsifiers are fixed now)
**H1 (gate):** rules enforced by a mechanical refusal (hook, gate, the trailer check) are followed at **≥ 90%**.
**H2 (slot):** ungated rules that fill a FIXED SLOT (a template heading, a block at a known place, a field) are followed at **≥ 60%**.
**H3 (inline):** ungated rules that must fire MID-COMPOSITION, per claim or per sentence (labels, "check before you claim", "cite
path:line on every figure") are followed at **≤ 20%**.
**Falsifiers:**
- H3 is wrong if any inline, ungated rule reaches ≥ 50%.
- H2 is wrong if the slot rules' median is < 40%.
- The whole frame is wrong if feature tags do not separate the rates: the inline median ≥ the slot median.
**Abuse clause:** no rule is re-tagged after its rate is computed. Tags are fixed first, by a seat that has not seen the rates.

## The lap (strict order)
1. **C: the rule list + tags, BEFORE any measuring.**
   - Extract every testable rule from: `consonance/src-tauri/brief/BUILDING.md` (WHAT A HAND-BACK OWES / WHAT A DISPATCH OWES),
     `brief/COMMITTEE.md`, the librarian `CLAUDE.md`, and the pane briefs.
   - Testable means a mechanical check exists on transcripts, hand-backs or commits.
   - Tag each rule: **gated** (yes/no, with the gate's path) · **position** (slot-start / slot-end / template-field / inline-per-claim /
     judgment-mid-turn) · **unit** (per message / per file / per claim / per commit) · **who** (panes / chair / librarian).
   - Write `loop/rule_census_list_2026-10-02.md` and commit it, with its sha256, before step 2.
2. **E: measure each rule's compliance mechanically**, blind to C's tags (E gets only the rule text and its check).
   - Window: 09-28 → 10-02, D. Sources: `exo_memory/handback/`, the seats' main transcripts, `git log`.
   - One number per rule, as followed / applicable, with the command beside it. A rule with no mechanical check comes back NOT
     MEASURABLE, never estimated.
   - Output: `loop/rule_census_rates_2026-10-02.md`.
3. **Librarian scores** H1–H3 and the falsifiers, joining tags to rates by rule id, and names the cases that break the pattern.
- Instrument tier: greps and scripts, under the heavy-run lock if node runs long. No model calls needed.
- **What it is for:** if H1/H2 hold and H3 holds, the next build converts the key inline checks into GATED SLOTS. For example, a
  "Sources opened" block per hand-back that a gate refuses when empty: the Third Place's "refuse, don't remind" (SPINE `:72`),
  applied to claims.

NEXT: chair dispatch D210 step 1 to C when this plan is read

## Step 1 collated + RULINGS (librarian, 13:0x): `handback/p-d210-C_2026-10-02.md` (git-blob `527055de…`), commit `892b9747` in `c-d210-wt`
- 41 rules (R01–R44, minus R19, R34, R36). gated 7 / ungated 34. Positions: slot-end 12, template-field 15, slot-start 4,
  inline-per-claim 5, judgment-mid-turn 5. List sha256 `1f21c3fe…ffa`; the E-facing checks file (no tags) sha256 `45baf1c4…4f9`.
- **RULING 1 (the judgment-mid-turn bucket):** it is in neither H2 nor H3 as registered, so it is REPORTED SEPARATELY, with no bar.
  Folding it into H3 now, after the rule list exists, would be choosing a bucket for a known-bad rule (R13, 101/103). That is the abuse
  the clause forbids. It is the librarian's omission at registration, recorded as such.
- **RULING 2 (C's exposure):** C read the plan's five preliminary rates (R44, R22, R30, R27/R28, R13) before tagging. **The score is
  computed twice: with all 41, and with those five ids removed.** If a hypothesis passes only with them, it does not pass.
- **RULING 3 (the gate leak in the checks file):** E's checks for R01/R11/R14/R15/R27 mention refusal rows. That leak is accepted. E
  measures mechanically, so a rate is a count, not a judgment the tag could bias. Disclosed, not blocking.
- **OUTPUT → NEXT: unchanged.** E measures every rule from `loop/rule_census_checks_2026-10-02.md` (from `892b9747`), blind to the list
  file. One number per rule with its command, or NOT MEASURABLE.
