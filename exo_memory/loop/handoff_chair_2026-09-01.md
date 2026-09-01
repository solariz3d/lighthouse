**SUPERSEDED by `exo_memory/loop/handoff_chair_2026-09-01b.md`, 2026-09-01 ~05:00.** Wording kept,
authority removed. **Its §2 "NOT LIVE UNTIL THE REBUILD" is spent** — that rebuild ran at 03:48 and the
pane→librarian edge has since carried a full lap. For what is open, read
`exo_memory/librarian/LEDGER.md`, never this.

# Chair handoff — 2026-09-01 ~03:30, before the rebuild

**Supersedes `handoff_chair_2026-08-31.md`** (SUPERSEDED line added there; wording kept, authority
removed — its §0 relaunch-freeze is spent).

**For what is OPEN, read `exo_memory/librarian/LEDGER.md`. This file does not restate it.** Handoffs
that restate the ledger drift out of agreement with it; that is the rule added tonight.

**Re-run §5. Do not quote it.**

---

## 1 · THE RESULT, and the sentence not to say

**NO CUE MOVED THE NUMBER.** K0 65.0% (13/20) · K1 72.5% (29/40) · K2 82.5% (33/40). P2 FAILS, P3
FAILS both parts, P4 clean (truth-carry 40/40). **No pairwise comparison distinguishes the arms from
one rate** — p ≥ 0.20 on all four; Fisher 0.422 / 0.564 / 0.195 / 0.260, re-derived independently.

**NEVER "the focal cue made it worse."** The chair said that to the keeper twice; it treats a
17-point gap at n=40 as signal. Scorecard: `loop/battery_scorecard_2026-09-01.md`.

**THE WALL, in its NARROW form — the broad one is FALSE on the transcripts:**

> **No event OF THE HAND-ON precedes the decision.**

The chair's brief said *"no event this harness exposes precedes the composition."* CHARLIE narrowed
it; ECHO confirmed the narrow form is what the transcripts show. **The difference is the whole
future of this line:** `Write HANDBACK.md` appears in **83 of 100** transcripts, **precedes the
decision, and was never tested** (scorecard §7a). The broad sentence closes the line. The narrow one
leaves a door nobody has tried.

**What the run does NOT license:** it does not say cues never work. It says no cue riding on a
hand-on event reaches the decision — two classes, one event, one brief, one model, n=40.

**Stated limits, not footnotes:** `handoff.js` differed between K0 cells and cue cells (cite by
hash, never by version label — "v2" named two different things in two of ALPHA's own files); and the
day seam, 20 trials on 08-31 against 60 on 09-01 across a shutdown, both arms −10 in the same
direction, **confounded with a CLI version change.**

## 2 · WHAT IS BUILT AND NOT YET LIVE

**The pane→librarian edge** (`9fb6cb7`) — the address table at n=3, mount-gated, `BUILDING.md` step 6
rewritten in the same change. 333/0 cargo, 66/0 chain-status. **The deadlock is closed** with a
regression test that dispatches to M and asserts the counter still completes.

**IT IS NOT LIVE UNTIL THE REBUILD.** The running binary was built 01:22, before the edge landed.
Same shape as the gate hook on 08-31: landed, not shipped.

**Owed at rebuild:** `COMMITTEE.md` and `LIBRARIAN.md` hand-back lines. **Not addressed:** the
counter's SECOND miscount (a mid-lap dispatch re-anchors the window and drops live panes).

## 3 · THE REBUILD, and the failure mode to expect

`CARGO_TARGET_DIR = C:\build\lighthouse-target` — correct, it is where `open-items` looks.

**Consonance runs from the file the build must replace.** On 08-31 `cargo tauri build` compiled
clean, copied every bundle resource, then exited **1** on the exe swap. **The compile and the
resource copy succeed before the swap fails**, so `open-items` is the honest check — **not the exit
code.** The chair was one step from asking the keeper to close five panes over a build that had done
its job.

**A relaunch kills every pane.** Everything is pushed before it goes down.

## 4 · THE ONE PANE TASK IN FLIGHT

**ECHO is attacking ALPHA's librarian-window registration** (`883478f`). Nothing is built from it
until that lands; **build is next lap with its own rebuild**, deliberately not bundled here.

The aiming number: the librarian's own notes are **549,440 of 1,075,876 carried bytes — 51% of the
shelf**. The attack handed to ALPHA in advance: **a byte-window evicts the oldest notes, and the
oldest notes are where the WRONG column lives.**

## 5 · VERIFY RATHER THAN BELIEVE

    cd C:\Consonance\lighthouse
    git log --oneline -12
    node consonance/tools/js-suite.js
    node consonance/tools/carrier-drift.js
    node consonance/tools/open-items.js
    node consonance/tools/chain-status.js
    node consonance/tools/lap-row.js --report

## 6 · WHAT THE CHAIR GOT WRONG, so the next window does not repeat it

Every one was caught by a seat that did not write the thing.

- **The wall sentence, over-broad** — would have closed a line that is open. CHARLIE.
- **`K1_r35` called a VOID at n=39** — it was NOT-RUN, the rerun was the first attempt, n=40 stands.
  The librarian, from the ledger. **This is the hop the edge removes**, and the commit body says so.
- **"the cue made it worse"** — noise read as signal, twice, to the keeper.
- **The `.done` marker, wrong twice in two hours in OPPOSITE directions** — first asserting markers
  existed when they did not, then that they never would when they did. It was the relaunch guard.
- **A ring sent into a seat that had announced it was compacting** — four hundred words of
  acknowledgement into a scarce context. Amendment written the same hour:
  `loop/ring_rule_amendment_2026-09-01.md`.
- **Two commit messages describing work they did not contain** (`31d51c3`, `bbbaa40`).

**The pattern: the error is almost never in the work. It is in the sentence about the work** — a
relay, a commit body, a bar re-typed instead of quoted. **Quote the leg; never paraphrase the panes.**

---

*Registered so this file can be shown wrong: if the next window opens by re-deriving §1 or §5 instead
of re-running them, it failed at its only job.*
