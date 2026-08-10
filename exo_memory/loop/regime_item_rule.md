# Regime test — the item-drawing rule (2026-08-10, committed BEFORE the rule is run)

Under `regime_preregistration.md` (`5017dc1`) and `regime_primes.md` (`ea5947c`). The primes are
already fixed, so nothing below can be tuned to them.

## What an item has to be

A claim about THIS codebase that a fresh instance can settle by reading, answerable as exactly one
of **SOUND / NOT SOUND / CANNOT TELL**. Categorical, so dispersion is arithmetic and no judge is
needed — which is the scope limit the registration already priced.

## The rule, fixed here and run afterwards

1. **Source pool:** `consonance/src-tauri/src/*.rs`, EXCLUDING every file touched on 2026-08-09 or
   2026-08-10. I have been editing `main.rs` and reading `tether.rs` all night; drawing from them
   would put my own fresh work in front of subjects and make my contamination part of the item.
2. **Candidate lines:** every `///` doc comment containing the word `because` — a doc comment that
   gives a *reason* is making a claim, which is what can be sound or not. Mechanical, no taste.
3. **Enumerate** the matches in file order, then take **every 7th** starting at index 3 (1-based),
   until 6 candidates are drawn. Stride and offset are fixed here, before the list exists, so I
   cannot walk the list looking for interesting ones.
4. **Phrase each identically**, varying only the quoted claim and its location:

   > In `<file>:<line>`, a doc comment claims: *"<claim>"*
   > Read the code that comment documents. Is the claim SOUND, NOT SOUND, or CANNOT TELL?
   > Answer with exactly one of those three, then one sentence of reason.

5. **Screening**, per the registration's decision 3: each of the 6 candidates goes to **5 SHARED
   subjects**. A candidate is KEPT if at least one of the five dissents from the modal verdict,
   DISCARDED if all five agree. The first 3 kept, in draw order, are the items.
6. **The 5 screening subjects per item are discarded** and do not appear in the measured set.
   Choosing items on the same subjects that later supply the control arm would inflate the control
   by regression to the mean and manufacture the difference P2 predicts.
7. If fewer than 3 of the 6 survive screening, **draw the next 6 by the same stride and repeat.**
   No hand-picking at any point.

## What I am not doing, and it matters

**I do not resolve these before the run.** I will read the claims — that is unavoidable in phrasing
them — but I do not look up whether each is true, and no verdict of mine is recorded anywhere. The
pilot decides which are borderline, not me. If I formed and filed a private opinion first, every
later reading of the results would be scored against a key I held, which is the exact structure
root1 spent a day building protections around.

## Registered in advance, because it is the likely outcome

Doc comments in this repo are unusually long and self-justifying — the house style documents every
non-obvious decision in prose. That is the same property B identified as making Root 1 untestable
here: **claims about decisions are settled by grepping the comment that explains them.** So the
live risk is that all 6 candidates come back unanimous and screening yields nothing.

If that happens it is a finding about the testbed and gets reported as one. It is NOT a reason to
loosen the keep-criterion from "at least one dissent" to something easier, and loosening it after
seeing the screening results would be the patch this design exists to avoid.
