# HANDOFF — the chair, 2026-09-07 ~07:55. The rebuild is deferred to tomorrow night.

**This file is a POINTER.** The record is `exo_memory/librarian/2026-09-07.md` and
`loop/handoff_librarian_2026-09-07.md`. **Read the librarian's first** — this one adds only what the
chair holds and the desk does not.

**The keeper, 07:46: the rebuild is saved for TOMORROW NIGHT; he will not work on the desktop at
home.** Nothing moves until this laptop wakes.

---

## 1 · STATE

    dev level at    e5f8005      working tree clean but for exo_memory/review/ (the L039 object,
                                 untracked BY DESIGN — see §5)
    exe             09-07 00:21  STALE. Everything from L043 is source, not binary.
    cargo           466 / 0 / 3  chair-verified before landing
    hooks           INSTALLED and synced. userprompt_pulse.py is no longer drifted.

## 2 · THE FIRST THING TO DO, AND WHY IT IS NOT "REBUILD"

**Rebuild, then run all six proofs before touching anything else.** They are listed at
`librarian/2026-09-07.md` 07:10. **Two have never passed:**

    harvest at_ms advances on an IDLE pane
    all four capture .txt mtimes advance within one settled turn     ← broken since 09-02

**The before-picture for proof 1 is already on the board** — the librarian's 05:38 ring, `QUEUED
stamp=ready → FORCED at ~150 s`. That is what "fixed" has to look different from.

**And check `install.ps1 -Check` after the rebuild.** It registers all-or-nothing and it already
added three hooks the keeper had excluded once (§4).

## 3 · A DISAGREE THE CHAIR ACCEPTS — the second vantage caught a stale claim of mine

**The claim:** *"the board-derived arrow can only ever draw when the ledger holder and the board's
latest hop DISAGREE — it vanishes exactly when the data is current."*

**It was TRUE when made (2026-09-02 ~06:55, HEAD `2467505`) and is FALSE of the current object.** At
HEAD, `destTab` (`chain-indicator.js:383-390`) maps `main → terminal → librarian → main` and has **no
fixed point**, so the arrow draws when ledger and board AGREE and is nulled only when they
contradict. `chain-indicator.test.js` BAR 2a/2b/2c assert a non-null arrow on agreeing fixtures;
93 pass.

**E fixed it on the very packet where the chair wrote it**, and the file's own L033 note now records
that sentence as *the repaired defect*. **The chair has repeated the obsolete form since.** That is
the carrier failure of 2026-08-17 in miniature: the repair landed, the sentence did not move.

**The blind reader is the only thing that caught it.** No instrument for the chair's prose exists;
this is the closest the room has, and it worked.

*Six further DISAGREE rows for this pane are held-unaudited in
`C:\Consonance\data\vantage_findings.jsonl`. Nobody has read them. They are the highest-value
unopened thing on this machine.*

## 4 · WHAT THE CHAIR GOT WRONG TONIGHT, so the next one does not repeat it

- **Ended two turns on "landing now" / "dispatching now" and did neither.** The librarian caught both.
  The 09-03 amendment exists precisely for this and it was not enough; the failure is finishing the
  OUTPUT and treating that as finishing the WORK.
- **Read the wrong line of my own evidence.** I printed A's captured screen, saw `/rc`, and called it
  "three stray characters nobody sent" — implying it could be cleared. The keeper identified it as
  the predictor's ghost, which regenerates. **And the footer line was in the same output I printed:**
  `⏵⏵ bypass permissions on…`. THE FOOTER, NOT THE GHOST, IS THE 2.5-HOUR CAUSE — the ghost forces at
  240 s, the footer hold is unbounded.
- **Pointed B at a reference implementation that contains the defect.** I said match
  `transcript-watch.js dataDir()`; its tier three is `return "C:\Consonance\data"` at line 89, itself
  a baselined site. **Copying it would have re-planted the bug while looking like compliance.** B
  checked instead of complying and built the guard's *stated* tiers.
- **Ran `install.ps1`, which registered three Stop hooks the keeper excluded on 09-06** (`stop.js`,
  `l2-overseer`, `l3-overseer`), **then removed `ready-stop.js` by substring collision** while taking
  them out, and restored it. Final state verified. **This is why `-Only` is on the housekeeping list.**
- **Backticks in a commit message let bash execute the quoted code**, silently emptying the sentence
  that carried B's evidence. Amended. Use a message FILE.

## 5 · OWED, AND WHO HOLDS IT

**Blocking nothing, but do not let these go quiet:**

    exo_memory/review/          the L039 object, UNTRACKED by design. gen-consumer.fixture-scope
                                refuses on it (in neither column). EXCLUDE or delete once L039's
                                result is safely recorded — it is already scored and filed.
    the four lost approved hands   raise_pull failed silently 08-24 → 09-06; four of the keeper's
                                own APPROVALS evaporated. Listed, never re-queued or declared dead.
    E's §7                      the 07-27 targetless pull; raise_from_forming sends an empty target.
    actors.evidence             one unresolved board id, 3d000000-…3d00 = the Third Place's mount,
                                missing from letters.json. Predates L043.
    transcript-watch.js:89      the peer's own hardcoded tier three (§4). Named, not fixed.
    dev/shell/hooks/*.py        no harness discovers them. B's pulse_degrade_proof.js wants to become
                                consonance/tools/pulse-degrade.test.js with the interpreter resolved.
    the two UNMANAGED hooks     ask-surface.js, baton-wake-stop.js — installable, on no manifest
                                entry, therefore INVISIBLE to the sync check rather than green.

**Registered and NOT open:** the consumer close-out (chunk 3). Its map is at `librarian/2026-09-07.md`
03:28 and it opens **only when the keeper says the dev version is close enough** — his 03:29 word,
and the standing order has been on disk since 09-06 01:00.

## 6 · L039, because a null needs saying plainly

**A 23 of 24. C 23 of 24. Both missed the same item** — the one plant whose falsity needed git
history, which the brief forbade. **Both listed it as unchecked, correctly.**

**23 + 23 − 24 = 22**, so any two 23-subsets of 24 must intersect in at least 22. **The pre-registered
statistic was degenerate.** The honest sentence: *on this object A and C are indistinguishable from
independent readers of size 23 — trivially, because 23 of 24 is the ceiling.*

**The ceiling is the finding**, and both the packet and B's freeze pass had named it as the risk.

**The only real signal was at the ADDITION EDGE**, where nothing was pointed: both went ~20 items past
the key sharing 14, A alone finding three tally-side, C alone four draft-side. **A next run registers
that as a secondary statistic BEFORE the run, on a harder object, at R = 3.**

**B voided itself** by grepping `handback/` and `map/` — a surface the chair's brief failed to name —
and labelled the two items it had taken from A rather than letting them sit unmarked.

---

*Written before the rebuild, not after. Everything above is checkable from the paths it names.*
