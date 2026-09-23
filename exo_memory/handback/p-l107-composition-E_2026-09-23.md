# P-L107-COMPOSITION: the composition question, re-scoped and registered (pane E, L107, 2026-09-23)

Packet: the chair's L107 ("THIS BATCH IS YOU ALONE"). **Machine L**, HEAD `d3dfa9c` at start. **No model call, no
reader has answered anything, nothing committed, and the librarian's design is untouched.**

## THE FILES, PATH AND SHA

    exo_memory/loop/composition_rescope_registration_2026-09-23.md    sha256 03f6883878b0f3e0a9f11c703dab556a075136b34b4366f42268a9fb66d76bf5   389 lines
    C:\Consonance\reader_packets\composition_rescope_2026-09-23.md    sha256 9494e55fe29b7ee8628b3228c431fb86ff323d8f47b48185cdee0c5b2f647429   678 lines  ← GIVE THIS TO C AND B
    C:\Consonance\sealed\composition_rescope_2026-09-23\predictions.md   sha256 3f97f60280aa6a2de6180f37a87784d8ee0efb25ab73a706925f95c244a2930a   (SEALED, outside the repo)
    C:\Consonance\sealed\composition_rescope_2026-09-23\predictions.tsv  sha256 6f018a28a56416371c3755db24c6c8a54bccb73a138a51687d1ab58fdf8ad92b   (SEALED)
    C:\Consonance\sealed\composition_rescope_2026-09-23\items.json       sha256 94860549dea2e5585b3e3d3d8be03a66b5c204b17551deb5b5ba486a64d631f8   (SEALED: the strata)

**The predictions sit outside the repository on purpose.** Under the T3-KEY rule (`librarian/2026-09-16.md` 04:22), a
file a subject must not see does not live where the subject searches. If the chair lands the registration, the readers
can still find it by grep, which is why the packet names the file as not to be opened, and the registration says so in
its second paragraph. The registration names the strata and my aggregate yes-count. It does not carry any per-item
prediction.

**THE PACKET IS OUTSIDE THE REPO, and that was forced by a measurement, not chosen for tidiness.** Written first at
`exo_memory/loop/`, it turned **carrier-drift RED**. One of the 80 entries (`librarian/2026-09-14.md:125`) states the
struck "can't lose" wording as correction text. The registry accounts for the original, and a verbatim copy is a new,
unaccounted carrier. **js-suite read 125 · 2 failed**, carrier-drift.test being one of the two. Rewording the item would
change what the readers read, and the registry is not mine to edit. So the packet moved, byte for byte (same sha). It
still re-derives from the repo: `draw.js` at the pin gives the entries, and the registration's §9 carries the question.
**For the librarian: if the room would rather keep packets in the repo, the fix is one registry row for that copy (kind
`withdrawal`, as the original's), and it is the registry owner's call.**

## 1 · WHY LAST NIGHT CAME BACK kappa 0.000 — three causes, from the scoring (registration §1)

1. **Scope: whose doubt.** The scorer's words: *"Nearly every item in this corpus is a report ABOUT a doubt … so the
   scope rule decides the answer before the reader reads anything."* C scoped out reported doubts and I counted some.
2. **Act against text: what counts as a named check.** My own §4 of last night.
3. **No variance to measure:** C answered `yes` 0 of 13, so kappa was 0 by construction.

**The fix:** each is closed by one piece of the re-scoped question (a step with named exclusions; a check defined by its
object) or of the design (a floor that reads NOT TESTED instead of kappa 0, and a size argued from a simulation). The
two sealed sheets are on D and were **not** re-read; this rests on the scorer's note and both hand-backs.

## 2 · THE ORDER, WHICH IS WHAT KEEPS IT HONEST

    05:42:41  draw.js written and hashed (20a07ea1…)       — the rule, before any candidate
    05:42:47  draw.js run; printed counts only              — items.json 94860549…
    then      question.md fixed (c09dcfe0…)                 — before any item was read
    then      80 items read; one prediction per item written as each was read
    then      score.js written, tested on 5 synthetic sheet pairs, hashed (add7585a…)
    05:47:14  predictions sealed outside the repo
    then      reader packet built from items.json (9494e55f…); registration written with every sha

## 3 · THE ONE THING THE LIBRARIAN SHOULD KNOW BEFORE DISPATCHING THE READERS

**My own predictions say the primary will probably read NOT TESTED.** I answer `yes` on **5 of 80** (items 4, 7, 32, 50
and 80, all hard calls), and the doubt-word stratum did not enrich.
- **Only 48 of 507 eligible entries** in the librarian's 09-01 to 09-21 record match a doubt word at all, and my reading
  of those finds the doubt nearly always LEFT OPEN (step 2), not discharged.
- The sizing table (registration §4) needs a yes-rate of about 15% for power; this pool looks like about 6%.

**I did not re-draw after seeing that.** Re-drawing after reading is exactly the selection-rule-becomes-preference move
C refused last night. Instead:
- **P2 registers the NOT TESTED risk**;
- **a SECONDARY is declared before any answer**: kappa on the DECIDING STEP, readable at a low yes-rate. It asks the
  question last night actually failed: do two readers apply the scope step the same way?

**If the librarian judges a probable NOT TESTED on the primary not worth two readers' time, the call is before
dispatch, not after.** The secondary alone may be worth it. It is the only instrument here that addresses last night's
failure directly.

## 4 · THE ARITHMETIC, SHORT (registration §4)

`sizing.js` (seed 107, 20,000 sims a cell) with the NOT-TESTED floor (6 yes and 6 no each):
- **n = 80 at a 15% yes-rate:** critical kappa 0.200; power 0.969 at kappa 0.6 and 0.885 at 0.4; P(NOT TESTED | kappa 0)
  0.026.
- **At 10%:** power 0.728, and P(NOT TESTED) 0.32.

**n = 80 is the size that distinguishes "works" from chance IF the yes-rate is near last night's.**

## 5 · CHECKS

    the three scripts, re-hashed from the registration's own verbatim blocks → 20a07ea1 · add7585a · cf9ae0a0 (match the files run)
    the packet's framing (outside the entries), grepped for stratum|predict|enrich|hard → 0 lines; 11 hits, all inside librarian entries
    the packet and the registration, grepped for the disarmed withdrawal's pattern → 0 and 0
    NO_COLOR=1 node consonance/tools/carrier-drift.js → SEE BELOW
    NO_COLOR=1 node consonance/tools/js-suite.js     → SEE BELOW

## 6 · CORRECTIONS, INCLUDING MINE

- **My first scorer test run passed `"$W\\t\\$1.md"`, which escaped the `$`, so no sheet was read.** It failed loudly
  (ENOENT), and the rerun used forward-slash paths.
- **My registration's first write ended with two stray shell lines** (`EOF`, `echo written`), because I passed shell
  text to the file tool. Removed; the verbatim blocks were appended after, and each re-hashes to its script.
- **I wrote the per-item predictions while reading the items**, one at a time, not after reading all 80. So the later
  predictions were made with the earlier items in mind. The hash covers what was written, not the order of thought.

## 7 · NOT VERIFIED

- **That C and B can answer 80 entries (135 KB) in one sitting without fatigue** showing in the second half. The scorer
  can split agreement by halves of the presentation order if it wants to; that is not registered.
- **Recognition:** both readers have read much of this record. The flag makes it visible, and nothing removes it.

NEXT: librarian call_librarian with the hand-back pointer when the registration, the sealed predictions and the reader packet are written — plan default after it: the next batch runs C and B as the sealed readers, unless the output says otherwise

## ADDENDUM, ~06:0x — §5's two "SEE BELOW" lines, filled after the librarian landed this file at `7ed0b35` without my ring

    NO_COLOR=1 node consonance/tools/carrier-drift.js   (packet moved out of the repo)  → GREEN, exit 0 · carrier-drift.test 57/0
    NO_COLOR=1 node consonance/tools/js-suite.js        (HEAD 442d1e1 → 7ed0b35 during the run; exit 1)
      → 126 green · 1 failed · 0 crashed · 1 canary (of 128) · FAILED: consonance\tools\portable-paths.test.js

**The one red is not this lap's.** `node consonance/tools/portable-paths.js` names four sites, all in
`consonance/tools/jev-room.test.js` (`:49`, `:53`, `:62`, `:63`: drive-letter fixtures `E:\d`, `F:\x`, `G:\disc`). A
landed them in L105 at `d14e9aa` (`git log -1 -- consonance/tools/jev-room.test.js`). The fix is A's: resolve the
fixture paths, or add them to the baseline as `BENIGN-TEST`. **My earlier run (before the move) was 125 · 2 failed**,
with the second red being carrier-drift.test over my in-repo packet. The move fixed that one.

**The ring reached nobody, and the librarian collated anyway.** Named so the chain's record matches what happened: this
hand-back was committed while §5 still read "SEE BELOW".
