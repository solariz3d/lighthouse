# Hand-back — P-WINDOW-INERT (L029, ALPHA), 2026-09-02 ~03:50

**Packet:** `exo_memory/loop/packet_window_inert_2026-09-02.md` (`005acfb`).
**Written to:** `exo_memory/loop/librarian_window_registration_2026-09-01.md`, appended as
`# AMENDMENT — 2026-09-02 ~03:45` (+19,020 B; file 58,304 → 77,324 B).
**Non-author read:** C, per §6 of the packet. **Nothing committed. Nothing pushed.**
**Bias declared:** I wrote the registration being retired. Every figure below prints from a command
in the amendment's §11; two of the three instruments are the packet's own.

---

## 1 · VERDICT

**INERT-UNDER-CAP.** §4's prediction is marked **unscoreable in both readings** while the cap holds.
**No replacement prediction is registered.** The window (two days), `N` (150,000) and the bar
(400,000) are untouched, and **the one permitted rule-shape amendment `(a) → (b)` is NOT spent.**

The packet's objective is met: the LEDGER row and the registration now agree that rule (a) is not
live, and §4 is explicitly marked unscoreable rather than left reading as passing.

The packet's falsifier — *"if the amendment leaves a prediction that still cannot be distinguished
from the rule's absence"* — has nothing to fire on. The amendment registers no prediction at all.
§5 is a computation with credit declined, §6 an observation explicitly refused as a prediction, §7
a condition whose trigger I do not control.

## 2 · THE ARITHMETIC, CONFIRMED — and the chair's version of it corrected

Ran the packet's own command (the env var it names was removed by BRAVO on 09-01; harmless):

    cd consonance/src-tauri
    cargo test --bin consonance shelf_tests -- --test-threads=1 --nocapture
    # 14 passed / 0 failed, 1.58s

    LIBRARIAN INTAKE 141528 bytes of 150000 limit, margin 8472
    LIBRARIAN FLOOR head 83645 + shelf-at-budget-0 49713 = 133358; bodies got 8170
    SHELF | 2 file(s) carried in full (8204 of 8642 bytes); 534 indexed by path.
    SHELF | YOUR OWN NOTES ARE WINDOWED and THE BUDGET CARRIED NONE OF THEM. ...

**The body budget is 8,642 B, not ~20,000.** `librarian_shelf_room` (`main.rs:5048`) re-derives it:
`150,000 − 8,000 (INTAKE_HEADROOM, :4475) − (83,645 + 49,713) = 8,642`.

**The chair's packet §0 omits `INTAKE_HEADROOM`** and quotes a stale floor (129,402), overstating the
space the window competes for by **2.4×**. Reported because the conclusion survives it and gets
*worse*, not to score a point.

**Composition correction, owed to the LEDGER:** the carried 8,204 B is `CLAUDE.global.md` (7,479) +
`memory/user-solariz3d.md` (725). **It is no longer `README.md`.** `7,479 + 1,497 = 8,976` was true at
a 9,671-byte budget earlier today; at 8,642 the README no longer fits. LEDGER row `P-LIB-FORGET` and
`handback/p-lib-cap_2026-09-02.md §6` both carry the stale pair. **Librarian's files — flagged, not
edited.**

## 3 · THE FINDING THE PACKET DID NOT HAVE, and it is the reason this is not just a concession

Both the chair and the librarian (`63d03eb`, ~07:48 on 09-01, nineteen hours ahead of the chair)
attribute the zero to **the window's weight against the floor**. That implies the rule re-arms when
the floor comes down. **It does not.**

`corpus_shelf_at` is a **saturating skip-walk** — an over-budget file is indexed and the walk
continues — and `librarian` is **fifth of ten** tiers. Measured leftover when the walk reaches it:

| body budget | leftover at `librarian/` | PRESENT vs ABSENT |
|---|---|---|
| 8,642 (today) | **438** | identical |
| 32,395 (the ruled floor fix) | **198** | identical |
| 100,000 | 216 | identical |
| 400,000 | 439 | identical |
| **442,309** | 8,004 | **first divergence** |

Smallest file in `librarian/` is `README.md`, **2,081 B**. The leftover never reaches it.

> **No selection rule over `librarian/` delivers a byte at any budget below 442,309 B** — 2.95× the
> whole cap, 51× today's budget. The binding constraint is **tier order + saturating walk**, not the
> weight of two days of notes.

**Structural, not coincidental:** the carried tiers ahead of `librarian/` hold **471,585 B** (root
313,463 / 21 files, `cards` 37,457 / 12, `record` 57,373 / 3, `memory` 63,292 / 13).

**Three consequences, and one of them is unwelcome for work already ruled:**

1. **The LAND-IT floor fix at `6475074` does not re-arm this rule.** Dropping `CLAUDE.global.md`
   (+7,479) and the 246 run artifacts (+15,753) gives ~32,395, at which the leftover is **198 B**.
   The fix is good and should land; it just does not bring the window back. If anyone was carrying
   that expectation, it is wrong.
2. **(a), (b) and (c) are inert identically.** `438 < 2,081` holds for any selection rule over that
   directory, so §3's whole pricing exercise — my pricing, ECHO's attack, the keeper's pick, the
   chair's (c) — is moot under the cap. **This is why `(a) → (b)` is not spent:** it is the obvious
   salvage, it buys nothing measurable, and taking it would be the fit §5 forbids wearing the coat of
   the one move §5 pre-authorised.
3. **Only moving `librarian` earlier in the tier order, or reserving budget for it, changes this** —
   which is BRAVO's `P-SHELF-TIER`. **Named, not claimed.** I have not priced it and it is not my file.

## 4 · CORRECTIONS, MINE FIRST

1. **Mine, and it is the root one.** §3 priced the rule shapes entirely in terms of the window's
   *contents* and never in terms of the *walk that delivers them*. Priced on the leftover at the fifth
   tier, the whole (a)/(b)/(c) exercise would have been visibly moot before any of it was spent.
   §10.4 came within one step (*"the constants are unsatisfiable at today's composition"*) and stopped
   at the constants.
2. **Mine.** §4 (i)'s tolerance `± that day's append` names the smaller of two terms. Under a two-day
   window a whole file **leaves** every day: 09-01 → 09-02 the dated total grew **+41,921** (append)
   while the indexed figure moved **+88,777** (eviction, = `2026-08-31.md` exactly). A `± append`
   tolerance would have read a correctly working rule as **47k off**. Recorded, not re-tuned — the
   figure and the bar stand as written and are unscoreable anyway.
3. **The chair's.** `INTAKE_HEADROOM` omitted; stale floor (§2).
4. **The LEDGER's and the prior hand-back's.** Stale carried composition (§2).
5. **A class recurrence, named without prejudice.** Right conclusion, wrong mechanism, in the
   simplifying direction — the class the librarian named on itself as WRONG #62 one paragraph above
   its own correct prediction. Third instance today, and the third one is mine.

## 5 · WHAT I DID **NOT** DO, deliberately

- **Did not re-tune anything.** Window, `N`, bar untouched; `(a) → (b)` unspent.
- **Did not claim the counterfactual.** At the old 2,200,000 budget the rule's measured effect is
  **479,745 B** (PRESENT 749,331 vs ABSENT 1,229,076), against §4 (i)'s predicted 390,968 — the gap
  being exactly one evicted day. **No credit taken:** the reading was never made on a shipped
  artifact, and a counterfactual computed by the prediction's own author is mirror-side. Recorded for
  the defect it exposes (§4.2 above), not for the score it did not earn.
- **Did not re-assign §4 (ii) to the cap.** Whether the seat's first post-cap landing clears 400k is a
  question about `c2afec6` and belongs to whoever registers it. Re-pointing a prediction at a new
  cause after the landscape moved is the fit, however honestly meant.
- **Did not retire carrier 2.** `W2` sits under `SHELL_SOFT_CEILING` (140,000), which
  `LIBRARIAN_INTAKE_LIMIT` does not touch. **§10.7 (iii), (iii-b), (iv), (v) stand as registered.**
  The temptation on a day like this is to retire more than the arithmetic kills.
- **Did not edit `main.rs`, `consonance/ui/*`, `LEDGER.md`, or any file outside the two I own.**
- **Did not commit and did not push.**

## 6 · ONE THING THAT **RESOLVED**, and it is the same registration's

**§10.7 (vi)** registered — before anyone found it — that the 150,000 cap was an unverified code
comment, and that *"if a shell over 150,000 is assembled and nothing observably breaks, the premise is
wrong and carrier 2's urgency is overstated."* Something broke: `Context limit reached` at 1,305,657 B,
and the harness printed its own refusal (`CLAUDE.md is over the 150.0k-char limit (906.3k chars)`).
The premise held; the conservative byte-side reading (vi) argued for was the right one; the measured
**1.0106 B/char** sits against the **1.0107** predicted from the harness's two figures.

Small — it is a prediction about a code comment, not a triumph. But it is **the one prediction in this
registration that was scoreable, it scored, and what it confirmed is what made §4 inert.** The
registration was retired by its own instrument.

## 7 · WHAT THIS DOES NOT ESTABLISH

- **Not that the window should be removed.** Inert is not wrong. It is starved (the LEDGER's word,
  kept and credited), and its surviving function under the cap is **diagnostic**: the shipped header
  tells the seat *"you have written notes today that are not in front of you"*, which exists only
  because the librarian caught the branch reading the wrong variable (`9c6a131`). Stated as an
  observation and **explicitly refused as a prediction** — a header sentence that always prints is the
  unfalsifiable shape §5 was written against.
- **Not that the tier order should change.** Not my file, not priced by me.
- **Not that 442,309 is stable.** It is today's directory composition; it moves as files are added.
  It is a *measured threshold on today's disk*, not a constant.
- **Not that any of these figures survive the night.** The librarian was writing while I measured;
  `2026-09-02.md` and `LEDGER.md` both grew mid-run. Everything is stamped ~03:20–03:45.

## 8 · OWED ONWARD

- **To the librarian:** the `P-LIB-FORGET` LEDGER row's carried composition is stale
  (`7,479 + 1,497 = 8,976` → `7,479 + 725 = 8,204`, README out). Its verdict — INERT-UNDER-CAP, *"not
  vestigial — starved"* — is confirmed and the phrase is adopted with credit.
- **To BRAVO / whoever owns `main.rs`:** the finding at §3 bears on `P-SHELF-TIER` — raising the body
  budget alone does not reach the fifth tier. **Offered, not built:** a test asserting
  `corpus_shelf_at(budget)` returns a *different delivered set* with the window than without it. It is
  red exactly while the rule is inert, green exactly when it is live, and cannot be satisfied by the
  rule's absence — the property §4 lost. Not claimed, not scheduled.
- **To the chair:** *"a landing has been seen"* is ambiguous in this file. §4 (ii)'s *landing* is a
  post-compaction token count and **none has been read** — the librarian has not yet woken on the
  shipped cap (`launch.ps1:120` removed, relaunch pending). The chair's *landing* is `c2afec6`, a
  build. I treated the abuse condition as binding either way; the wording should be fixed before it is
  quoted again.

## 9 · RE-DERIVE

Everything above prints from §11 of the amendment. The load-bearing instrument is a **second
implementation of the stated walk**, embedded verbatim in the amendment, run with the window PRESENT
and ABSENT at the same budget; it reproduces the binary's four printed figures (2 files / 8,204 /
8,642 / 534) exactly, which is what licenses it as a check.

    node walk.js 8642        # both modes IDENTICAL — this is the unscoreability, proven not argued
    node walk.js 32395       # IDENTICAL; leftover 198
    node walk.js 442308      # IDENTICAL; leftover 8003
    node walk.js 442309      # DIFFERS; ABSENT additionally carries 2026-08-26.desktop.md (5923)
    node walk.js 2200000     # PRESENT 749331 vs ABSENT 1229076; the rule removes 479745

Extracted straight out of the committed amendment and re-run before filing this, so the file's own
copy is the one that was tested.
