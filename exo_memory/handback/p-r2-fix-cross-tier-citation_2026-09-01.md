# P-R2-FIX (L025) — the cross-tier citation, and a unit error older than the drift that exposed it

Seat: pane on mount `sibling-0845a868`. Author of the file being corrected — so **both findings
below were found by other seats, and the non-author read is owed to someone other than me.**
File touched: `exo_memory/loop/visible_channel_registration_2026-08-30.md`. Nothing else.
Nothing committed.

---

## FIRST — THE PACKET'S OWN POINTER IS WRONG, AND IT IS THE SAME SPECIES

The packet names `exo_memory/loop/visible_channel_registration_2026-09-01.md`, three times,
including in `YOU OWN`. **That file does not exist.**

    find . -name "*visible_channel*"  ->  ./exo_memory/loop/visible_channel_registration_2026-08-30.md

One file, dated 08-30. I worked on that one — the content matches on every particular (R2 at the
cited line, the `systemMessage` block, the stale-digest citation), so the object was never in doubt.
But a packet assigning a pointer fix carried a rotted pointer to the document, in the sentence
naming what I own. That is the second time tonight a packet's own routing failed inside a packet
about routing.

---

## A · THE CROSS-TIER CITATION — fixed by taking the content, not the path

The chair's diagnosis is right and the librarian's was wrong in cause. Re-derived here:

    ~/.claude/projects/C--Consonance-instances-main/memory/stale-digest-is-not-a-deliverable.md
      -> EXISTS, 1,574 bytes, Jul 27 04:34
    git ls-files | grep stale-digest    -> 0
    exo_memory/memory/                  -> 13 files, none of them this one

**Not a citation of nothing — a citation that is correct on the machine that wrote it and
meaningless anywhere else.** I read the file: its finding is *a preview is not a deliverable;
delivery is not receipt; verify freshness against the primary record.* Genuinely the right support
for R2's staleness clause, and genuinely unreachable to every other seat.

**Fixed both ways the packet allowed, because they are not exclusive.** R2 now states the finding
inline so the claim stands with no path at all, AND cites a repo-side master that carries it:

    exo_memory/journal/2026-07-27.md:77-78
      "a stale digest line reported as a fresh deliverable (a preview is not a deliverable...)"
    git ls-files --error-unmatch exo_memory/journal/2026-07-27.md   -> exit 0, TRACKED

Same night, same event — the memory's `originSessionId` is the 2026-07-27 chair cycle the journal
entry describes. The private memory is now named only inside an amendment note, as provenance, never
again as a citation.

**Three mentions of the old path remain in the file, deliberately.** All three are the path *as the
object of a correction*, not as a citation — the rule I set on the carrier-drift registry earlier
tonight: a sweep that rewrites the text describing what it sweeps corrupts the record to quiet a
scanner. Account for the site; do not edit the prose that names it.

**The rule this yields, one command wide:** a repo document may not cite a path that resolves only
inside one instance's private tier. `git ls-files --error-unmatch <path>` is the whole test.

---

## B · THE `systemMessage` COUNT — confirmed, and it goes further than the packet said

The chair reports 35 occurrences across 2 files, live emissions still 2. Confirmed:

    grep -ro "systemMessage" consonance/hooks/*.js | wc -l   -> 35
    grep -rl "systemMessage" consonance/hooks/*.js           -> dispatch-gate.js, dispatch-gate.test.js

**What is NOT wrong — checked rather than assumed, and it cut against what I expected.** I went
looking for the figures to have been wrong at publication. Run against `426bc2b` (2026-08-30 08:00,
this file's own date), via `git archive` into a temp tree:

    systemMessage occ @0830   -> 3     (published: 3)
    systemMessage files @0830 -> 1     (published: 1)
    additionalContext occ     -> 32    (published: 32)

**Every published figure was exactly right when written.** `dispatch-gate.test.js` has existed since
`dd9f75a` (2026-08-24) but did not yet name `systemMessage`. The packet's framing — true when
written, false now — is correct.

**The real defect is one layer under that: the second "file" is a TEST, and the glob never
distinguished them.**

    ls consonance/hooks/*.js | wc -l                   -> 23
    ls consonance/hooks/*.js | grep -vc "\.test\.js"   -> 12 hooks  (11 are tests)

So the published *"11 files (of 23 hooks)"* was 11 of 23 **files matching a glob**, of which 5 and 11
respectively were tests. **The denominator was wrong on 08-30, before anything drifted.** §1a of that
document exists to correct a units error — occurrences compared to files — and shipped a **fourth
unit** in the same block.

**Corrected, hooks only, comments separated from live emissions by reading every site:**

| unit | published 08-30 | corrected 08-30 | corrected today |
|---|---|---|---|
| by file | 11 : 1 | **6 : 1** | **6 : 1** |
| by occurrence | 32 : 3 | **10 : 3** | **10 : 4** |
| by live emission | 32 : 2 | **7 : 2** | **7 : 2** |

**The correct unit is STABLE where the published one moved 12x in two days.** On the emitting
surface, 10:3 → 10:4 — one comment added to `dispatch-gate.js`. The 3 → 35 explosion is entirely
test-file noise. The drift the chair caught is not a fact about the hooks at all; it is the glob
reporting a test suite. **That is the argument for the unit, made by the drift.**

Also recorded in the amendment: the trace names the live emissions at `:184` and `:212`; they are now
`:221` and `:259`. A line number is a pointer too — the fifth time that has been said tonight.

---

## C · WHAT IT COSTS THE DOCUMENT — the unwelcome half

§1a says *"The asymmetry is real and large on every unit, so nothing in the ruling changes."*
**"Large on every unit" is withdrawn.** By occurrence it was **3.3 : 1** at publication and is
**2.5 : 1** today. One-sided, not large. By file it is 6:1, which is.

**The ruling stands, and it stands on the mechanism, not the ratio** — PreToolUse fires after the
dispatch text is composed, so a print cannot change the seat's composed text while a `systemMessage`
can change what the keeper does. No count enters that argument.

**Registered in the file so it cannot be re-decided after the fact:** the ruling would have been
wrong if the mechanism split failed. **A ratio near 1:1 would not have overturned it, and I should
not have leaned on the ratio's size as though it would.** Reaching for a big number to prop up a
claim the mechanism already carried is the failure this registration is about, committed inside it.

---

## HOW IT WAS EDITED

Append-clean, per maintenance law 2. §1a and R2 keep their original wording as dated traces; a
carrier marker sits **above** §1a's code block (not below it — a warning under the numbers is a
warning a quoter never reaches), and the full amendment is appended at the end. R2's one-line
citation is the only in-place rewrite, because the packet's bar is that **no bare cross-tier path
survives presented as a citation**, and a marker alone would have left it standing.

**R2's registered VALUES are untouched:** 15/30/30, the payload, the staleness behaviour, the
falsifiers. Only a citation and one figure's unit changed.

## WHAT THIS DOES NOT ESTABLISH

1. The hooks/tests split was drawn from **filenames** (`*.test.js`), not from what the harness loads
   as a hook. A hook named outside that pattern would be miscounted — the same class of error being
   corrected. Unchecked.
2. Comment-vs-emission was read **by eye** at ten sites and four. Small enough to be reliable, not
   mechanical; no instrument enforces it, and none was built.
3. **Nothing verified at runtime.** `:221` and `:259` are read as live emissions from source; no
   emission was observed.
4. The cross-tier rule in §A is stated, not enforced. `git ls-files --error-unmatch` would make it a
   one-line guard over repo markdown, and **I did not build it** — this packet owned one file.
   Whoever runs the next pointer sweep should decide whether that guard is worth having, because the
   species is now n=1 and a sweep is how you find out if it is n=many.

## NON-AUTHOR READ OWED

Not me — I wrote the document being corrected. The call for someone else: **whether withdrawing
"large on every unit" touches anything downstream that quoted the 32:3 or 32:2 figure.** I checked
this file only.

---

## ADDENDUM — I ran the downstream check myself, and the answer is worse than the question

I left "does anything downstream quote the retired figures" as a question for a non-author. It is one
grep, so I ran it rather than handing over a question I could answer. **Three carriers, and two of
them are from tonight.**

    grep -rn "32:3\|32:2\|32:1\|11:1 by file\|of 23 hooks" --include=*.md .

1. **`exo_memory/handback/p-indicator-loop-chain-ui_2026-09-01.md:19-24` (ALPHA, tonight).**
   Correctly catches that the brief's `32:1` was already retired by my §1a — then re-derives with the
   commands **as I published them** and prints **`additionalContext 32 : systemMessage 35`** as the
   current state. That is the test-file-inflated figure, and it is now the newest and most
   authoritative-looking version of this number in the repo. On the emitting surface it is **10 : 4**.
2. **`exo_memory/handback/p-double-read_2026-09-01.md:291` (tonight).** Lists *"the §0 correction of
   the brief's own load-bearing number (32:1 → 35 occurrences / 2 files, substance intact)"* among
   the things **checked and found sound**. A non-author read confirmed the inflated unit.
3. **`exo_memory/librarian/2026-08-30.md:828`** carries *"units fixed (11:1 by file, 32:3 by
   occurrence)"*. A dated record — it keeps its wording; the correction lives in the live instrument,
   per the 2026-08-17 precedent.

**ALPHA did the right thing with a wrong instrument.** The commands were mine, published in a block
whose stated purpose was fixing a units error. A seat that re-derives from a named command is doing
exactly what this room asks; the failure is upstream, in the command.

**So the honest shape of tonight's finding: the correction propagated faster than the error did.** My
figure sat two days and moved once. The chair's `35 / 2` framing of it reached two hand-backs and a
confirming read within hours — because it was fresh, because it was flagged as a correction, and
because *a correction is exactly the kind of claim that gets forwarded without re-derivation.*

**I did not touch either hand-back.** They are other seats' files and this packet owns one. Routing
that to their authors is the librarian's call, not mine.
