# The label rule — DRAFT (L121, pane C, on L, 2026-09-27)

**A draft only. No brief is edited.**
- Plan: `loop/plan_label_rule_and_push_2026-09-27.md` (`443ae45`), chunk 1.
- Evidence: `loop/claim_base_rate_score_2026-09-27.md` (`c127075`).
- The watch that says whether it works is E's: `loop/label_rule_watch_registration_2026-09-27.md`.
- **Order of what follows:** §1 the rule, §2 where it goes, §3 how to mark, §4 what it does not cover, §5 whether the
  data supports a rule this light.

---

## 1 · THE RULE, plain

A claim about the state of something (a file, a count, a commit, a test result, another seat) is one of two kinds:
- **CHECKED:** the check and its result are shown beside it;
- **INFERRED:** anything else, including a conclusion drawn from checked facts.

**Both are allowed.** Nothing is banned. **A reader who is going to ACT on an inferred claim checks it first.**

**Why this and not a ban:**
- **The keeper, 02:02:** *"we should not automatically assume its wrong until it is check to see."*
- **The score (`c127075`):** unchecked claims were wrong **8 of 163 (0.049)**; checked claims **1 of 72**.
- The rule moves the check to the seat that is about to rely on the claim, and gives that seat what it needs to choose:
  which claims were checked.

## 2 · PLACEMENT, exact

### 2a · BUILDING.md, WHAT A HAND-BACK OWES (`consonance/src-tauri/brief/BUILDING.md:404`): a new item 7

Inserted after item 6, before the `---` that ends the section (`:480`). The text as it would land:

```
7. **CHECKED OR INFERRED — mark it, don't hide it, don't ban it** (drafted 2026-09-27, L121; the keeper,
   02:02: *"we should not automatically assume its wrong until it is check to see."*). A claim about the
   state of something is either **checked** — the check and its result are shown beside it — or
   **inferred**, which is everything else, including a conclusion drawn from checked facts. Both are
   allowed. **A claim with no check beside it is read as inferred; a seat that ACTS on an inferred claim
   checks it first.** The fewest words that work:

       checked: <command or path:line> → <result>
       inferred: <the claim>

   `inferred:` is owed where a claim would otherwise read as checked: a figure, a verdict ("fixed",
   "green", "safe"), or a "so …". Plain prose around a shown check needs no label. Future, intent and
   opinion are not claims about state and take no label.

   *Why a label and not a rule against unchecked claims:* measured 2026-09-27 over 300 claims from the
   room's seats (`exo_memory/loop/claim_base_rate_score_2026-09-27.md`), unchecked claims were wrong 8 of 163
   (0.049, bootstrap 0.013–0.093) and checked ones 1 of 72. Unchecked is usually right; it is not yet
   known to be. The label tells the next reader which is which, so the check falls on the seat that
   would act on it. **A checked claim can still be wrong** (a misread result): the label says a check
   ran, not that it was read right.
```

- **No absolute paths:** the only path is repo-relative (`exo_memory/loop/…`). The command below prints
  `0 absolute paths`.
- **Command:** `node <scratchpad>/l121abs.js`, which scans this file's fenced blocks for a drive letter or a `/Users/`,
  `/home/` or `\Users\` prefix. It printed `2 fenced blocks, 0 absolute paths`.

### 2b · The one-line pointer for replies to the keeper

The line:

```
- **Checked or inferred** (2026-09-27): in a reply to the keeper as in a hand-back, a claim about state shows its check (`checked: <command> → <result>`) or reads as inferred, and is marked `inferred:` where it would otherwise sound checked. **`BUILDING.md`'s WHAT A HAND-BACK OWES, item 7, is the master; this is the pointer.**
```

**Where it goes.** BUILDING.md reaches only the chair (`consonance/src-tauri/src/main.rs:6759`, `room_brief("BUILDING.md")`).
The other two seats that write to the keeper wake on their own briefs, so the pointer must sit in each:
- **Panes:** `consonance/src-tauri/brief/COMMITTEE.md`, section "What a hand-back should contain" (`:98`). Add it as the
  list's next bullet, after the map-line bullet (`:106-111`). That section already points at BUILDING.md this way
  (`:107`).
- **The librarian:** `consonance/src-tauri/brief/LIBRARIAN.md`, section "Talking to the other seats" (`:220`). Add it as
  its closing line. The librarian's collation rings already cite BUILDING's hand-back section as their master (`:291`).
- **The chair:** no pointer. Item 7 is in its own brief.

**One master, two pointers, no restatement** (the carrier rule). When item 7 changes, the pointers still point.

## 3 · HOW A SEAT MARKS A CLAIM, in practice

**The fewest words:** `checked: <command or path:line> → <result>` against `inferred: <claim>`.
- **In practice most of a hand-back is already CHECKED:** a result block printed under its command satisfies the rule
  with no new word.
- **The new habit is the word `inferred:`**, on the sentences that sound checked and are not.

**One example of each, from real hand-backs, at HEAD:**
- **CHECKED:** `exo_memory/handback/p-l114-flags-E_2026-09-23.md:121`,
  `NO_COLOR=1 node consonance/tools/js-suite.js (HEAD 87518f9) → 135 green · 0 failed · 1 canary (of 136)`. The command
  and its result sit on one line, so this is already the shape.
- **INFERRED, marked in words the rule would shorten:** `exo_memory/handback/p-d118-outside-B_2026-09-22.md:171`,
  *"It needs one precondition I have not checked: that the L3 store contains repeats."* Under the rule:
  `inferred: the L3 store contains repeats`. A reader who would act on it runs the count first.

**The unmarked case the rule is for.** Of the 13 claims I verified WRONG in L120 (`handback/p-l120-verify-C_2026-09-27.md`),
11 were unchecked (9 state, 2 conclusion), plain assertions with nothing to mark them unchecked (for example "B ruled it too wide", "twenty minutes ago").
Each of those 11 would have carried `inferred:`, and the reader would have known to look. The other 2 were CHECKED and
misread, which the label cannot catch (§4).

## 4 · WHAT THE RULE DOES NOT COVER

- **The future, intent, plans, instructions, opinions and questions** ("A will run…", "I'll check…", "next: …"). These
  are not claims about state. The base-rate registration routed them out before any verdict (§3 of
  `loop/claim_base_rate_registration_2026-09-27.md`), and the rule does the same.
- **A check's correctness.** `checked:` says a check ran and shows its result. It does not certify the reading. One
  CHECKED claim in 72 was still wrong, and in L120 I found checks that were run and misread (a filter that dropped the
  rows it was about, a unit copied from a mislabelled tool output). **The label shows the check; it cannot vouch for it.**
- **Claims inside commit messages.** Arm 1 found one (W123) that no reply-level reader could see. The rule applies to
  hand-backs and replies, not to commit messages.
- **Which unchecked claims matter.** The rule does not rank them. The reader who is about to act decides.

## 5 · DOES THE DATA SUPPORT A RULE THIS LIGHT? Yes, narrowly. **Not a refusal**

- **For:** p = 0.049, with a bootstrap upper bound of 0.093 ≤ 0.10. That is §10's "mark, don't ban" row, fixed before
  any number existed. Conclusions were not riskier (1 in 41), so there is no case for a heavier rule on "so …" claims.
- **The margin is thin:** p sits 0.001 under the 0.05 line. And the frame was mostly tool-written notes, not replies to
  the keeper (score, Limits). **For replies to the keeper, this rule is an extrapolation.** E's watch is where that
  gets tested.
- **One risk the numbers show, which the wording above answers.** κ on KIND was 0.418: two careful readers agreed only
  61% of the time on whether a claim was checked, state or conclusion.
  - So "checked" cannot be left to judgement.
  - Item 7 defines it by what is ON THE PAGE (the check and its result, shown beside the claim), and makes "no check
    beside it" read as inferred by default.
  - That default is what keeps the rule light: a seat only has to write `inferred:` where a claim would otherwise sound
    checked.
- **What would make me withdraw this** (E's watch owns the formal falsifier): if, after the rule lands, landed WRONG
  claims keep arriving unmarked at the same rate, the label is decoration and the ban-or-gate rows of §10 come back into
  play.

---

**NOT verified here:**
- The proposed text has not been run through the brief's own tests (`the_brief_does_not_duplicate_the_verb_list` and the
  rest). A lands it and runs them (L122).
- `inferred:` is not yet a word any tool looks for. Counting it is E's watch.
- The pointer sites' line numbers are read at HEAD `443ae45`. The lander re-reads them.
