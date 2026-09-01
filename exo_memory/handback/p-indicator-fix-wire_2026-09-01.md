# P-INDICATOR-FIX + P-INDICATOR-WIRE (L025) — both defects fixed, and the chip wired to `chain_state`

**Seat:** ECHO, `instances/sibling-07b8a48f`. **Defects: ALPHA's, from
`exo_memory/handback/p-double-read_2026-09-01.md`. Command: BRAVO's, `38fd239`.**
**Files: `consonance/ui/chain-indicator.js`, `chain-indicator.test.js`, `app.css`. `main.rs` NOT
touched. Nothing committed.**

**BARS — all met, each with the command that shows it:**

```
grep -c chain_state consonance/ui/*.js   ->  chain-indicator.js:6   chain-indicator.test.js:8
node consonance/ui/chain-indicator.test.js  ->  62 passed, 0 failed   (was 31)
node consonance/tools/js-suite.js           ->  68 green · 1 failed (of 69)
```

The single red is `actors.evidence`, pre-existing and verified twice tonight as not mine.

---

## §0 — THE HEADLINE: MY OWN FIX HAD ALPHA'S DEFECT IN IT, AND LIVE FIRE CAUGHT IT

I implemented D2 the way the brief and ALPHA both described it — **count dispatches since the last
`ring`.** It passed all nine fixtures I wrote for it. Then I ran it against the real board, and it
reported **ZERO outstanding while two panes were out, including the one writing this.**

The reason is in the rows and no fixture would have produced it:

```
04:58:24  dispatch C      04:59:06  ring      05:02:03  hand-back C
```

**Hand-backs cross the ring.** A pane dispatched before a boundary and still working is invisible to
"dispatches since the last ring" — which is A's defect exactly, one layer in, inside the fix for it.
The ring is a *self-reported stage marker*, not a barrier that work respects.

**The rule that survives contact with the board is per-pane identity:** a dispatch to X is open until
X hands back *later than it was sent*. Verified against the live window — it correctly names E (me,
mid-packet) and B (dispatched 04:58, no hand-back) where the boundary version said nothing was out.

**The keeper's own framing was right and I am carrying it forward as the finding:** the species is
*an instrument reading the most recent event as the current state*. A fan-out breaks it because the
newest event is one of many; an unconfirmed delivery breaks it because the newest event may not have
happened; **and a lap boundary breaks it because the boundary is itself just another recent event.**
Three faces, one error, and I committed the third while fixing the first two.

---

## §1 — DEFECT 1: an unconfirmed delivery no longer draws an arrow

Fixed at **all three edges**. The bracket is now captured and classified rather than skipped:

```
dispatch  confirmed iff  [delivered and received]
call_*    confirmed iff  [Received]
```

so `[WRITTEN BUT UNCONFIRMED …]`, `[written; receipt not checked]`, `[Unconfirmed]` and
`[NotAttempted]` all land in a **fourth state that draws no arrow**.

**THE DESIGN POINT WORTH KEEPING, because the obvious fix is worse than the bug.** ALPHA offered
"one term per regex" as the cheap option. **It is actively dangerous:** if `readHop` simply refuses
to match an unconfirmed row, `latestHop` scans straight *past* it and returns the hop **before** it —
so the chip draws a confident arrow for a position that has since been superseded, silently. The
uncertainty has to be **carried**, not dropped. Pinned by its own test:
*an unconfirmed hop does NOT fall back to the older hop behind it.*

**Elapsed IS still shown in this state, unlike the other three no-arrow states, and the difference is
deliberate:** in `unavailable`/`unknown`/`blind` the whole reading is untrustworthy; here the
**timestamp is sound** — the write demonstrably happened then — and only the landing is unknown.

**THE FREQUENCY ALPHA EXPLICITLY DID NOT CLAIM, now measured.** A wrote *"I have not established
that `Receipt::Unconfirmed` fires often … Frequency is unmeasured and I do not claim it."* Over the
live board window **03:55:55 → 05:05:20**:

```
dispatches 14, of which UNCONFIRMED  4  = 29%
hand-backs  9, unconfirmed 0
rings      11, unconfirmed 0
total hops 34, unconfirmed 4  = 12%
```

**Nearly a third of dispatches, and it is concentrated entirely on the dispatch edge.** The chair's
brief said the warning fired ~6 times tonight and every one arrived. **I am the proof of one of
them:** the dispatch carrying this packet is stamped `WRITTEN BUT UNCONFIRMED` at 04:57:56, and I am
answering it. So unconfirmed emphatically does **not** mean undelivered — which is exactly why the
chip must show *"we cannot tell"* rather than either a confident arrow or silence.

**Consequence to weigh, and not mine to settle:** at ~29% of dispatches the `unconfirmed` state will
be common rather than exceptional. That is honest, but a chip that often says "cannot confirm" is
worth someone deciding on deliberately.

---

## §2 — DEFECT 2: the fan-out, counted by identity

```
THE BAR: 4 dispatched, 1 back  ->  outstanding 3, arrow "-> panes E, A, K"
                                   (v1 said "chain LIB -> LIB")
```

Outstanding dispatches **outrank the newest receipt**: with panes out, the loop is waiting on them
whatever the last row says. Elapsed is measured from the **oldest still-outstanding** dispatch — the
thing waited on longest — not from the newest receipt, which is what made v1 report a fresh loop
during a long stall. Re-dispatch reopens a pane; a hand-back from a pane never dispatched cannot
close someone else's row.

**THE ONE EXCEPTION, and its residual, both pinned as tests rather than left to be discovered.** A
dispatch to the **librarian** is answered on `call_chair`, not `call_librarian`, so identity matching
alone would leave it outstanding forever. The librarian cannot be identified directly —
**`call_chair -> Main` names no actor at all, which is ALPHA's Q2** — so the discriminator is
behavioural: *a target that has produced no hand-back anywhere in the window is ring-closable.*

**The residual that buys, stated plainly: a committee pane on its FIRST appearance in the window is
indistinguishable from the librarian, so a ring can close it early.** It self-corrects the moment
that pane hands back once. There is no better signal on this channel. Test:
*THE RESIDUAL, pinned rather than hidden.*

---

## §3 — ALPHA's Q2, taken: the `ADDRESS_TABLE` pin

`RE_RING` is actor-blind and correct only while the librarian is the sole holder of `call_chair`.
When the Third Place gains that row a byte-identical audit line would be drawn as `LIB -> orch`.
**Pinned from the JS test:** `assert_eq!(ADDRESS_TABLE.len(), 2` must still be in `main.rs`, so a
third row turns this file red instead of silently mislabelling a hop. A **count**, not a list — so
it is not a second copy of the verb list, and `main.rs` already asserts the same constant. Verified
the pin bites: the pattern does not match a `3`.

---

## §4 — THE WIRING, implementing the librarian's ruling and not re-deriving it

| ruling | as built |
|---|---|
| `chain_state` is the POSITION source — lap · stage · holder · age; survives a relaunch | stage text and age come from the command whenever a lap is open |
| the ring stays the HOP source — receipts carry evidential weight | arrows come from receipts whenever the ring has one |
| ring EMPTY → arrow from `holder → next hop` | `chair→panes`, `panes→LIB`, `librarian→orch`; an unknown holder draws **no** arrow rather than guessing |
| BOTH → command sets the stage text, ring sets the arrow | tested on **both** branches — see below |
| `self_reported` shows as a state flag | rendered as `(claimed)`, marking *which half* is a claim |
| `note` is not displayed | asserted absent from text, arrow **and** tooltip in four states |

**The two sources fail independently.** `Promise.all` with a per-source catch, so a dead board no
longer hides an open lap and a dead command no longer hides the receipts. Before this, one failing
invoke took the whole chip to `unavailable` with the lap state sitting unread on disk.

**`open: false` renders as `idle` — "chain — no lap open" — not as `unknown`.** The bar as the chair
worded it: *that is boot, not an error.* The distinction is real and I kept it in the CSS too:
`unknown` is the absence of a reading; `idle` is a reading that says nothing is running.

**LIVE FIRE, all three modes, against the real `lap.jsonl` and the real board:**

```
BOTH (live)            waiting   chain L025 handbacks-in holder librarian · 1 out  -> pane E   18m
RELAUNCH (empty ring)  waiting   chain L025 handbacks-in holder librarian          -> orch     18m
ring only              quiet     chain 1 pane out                                  -> pane E    4m
```

**Row 2 is the bar that mattered** — an empty ring with a lap open now shows the lap instead of
"position unknown". Row 1 shows the merge doing its job: the command's stage, the ring's arrow, and
the ring correctly naming *me* as the outstanding pane.

*(The `chain_state` values above come from a node mirror of `chain_state_from` run over the real
`lap.jsonl` — I cannot invoke the Rust command without a rebuild. Stated as a limit in §6.)*

---

## §5 — MUTATION-PROVEN, 20 of 20 — AND TWO SURVIVED THE FIRST PASS

Every fix was made to fail on purpose before being trusted. **Two mutations came back GREEN, which
means two of my tests were decorative, and both gaps were real:**

| mutation | first pass | after |
|---|---|---|
| holder arrow beats the ring receipt | **SURVIVED** | 1 red |
| `(claimed)` flag dropped from `render()` | **SURVIVED** | 1 red |

- The first survived because my "both sources" test exercised only the **fan-out** branch, so a
  change to the **last-hop** branch went unseen. Added a `HANDBACK` case that routes through it.
- The second survived because I asserted `view.selfReported` — **a property of the object, which
  proves nothing about what the keeper sees.** Deleting the render line left every test green. Now
  asserted against the DOM text.

The other eighteen were caught first time: reverting D1, reverting D2, never subtracting hand-backs,
elapsed from the newest receipt, the ring no longer closing a leg, never invoking `chain_state`,
inverting the holder mapping, displaying `note`, reporting no-lap-open as `unknown`, a board failure
hiding the lap, plus the eight from the original build.

---

## §6 — WHAT THIS DOES NOT ESTABLISH

- **Still not live.** Bundled at build time; nothing here is in the running app.
- **`chain_state` has never actually been invoked.** Every reading above comes either from a node
  mirror of `chain_state_from` over the real `lap.jsonl`, or from a fake in the tests. **The real
  Rust command has not returned a value to this chip once.** That is the rebuild's to prove, and it
  is the single largest untested seam in this packet.
- **Never rendered in WebView2.** The CSS for the two new states (`unconfirmed`, `idle`) is unproven
  — no test can tell me italic-on-`--muted` at 11px is legible there.
- **The `(claimed)` suffix lengthens the chip** and I have not seen it in a real status bar at real
  width. If it crowds, it is the first thing to cut.
- **The residual in §2 is real and unmeasured**: I know it can close a first-appearance pane early;
  I have not measured how often that happens.
- **No stall has been caught by this.** The baseline is five keeper-caught stalls; this has caught
  zero, because it has never run.
- **My always-on deviation is still unregistered**, and ALPHA's ruling — *correctly declared but not
  sound as built*, with a third design (quiet = elapsed alone) neither seat had named — is **not
  answered here** and was explicitly not a gate on this build. It is a better proposal than what I
  built and I am not going to pretend otherwise; it belongs in A's registration, not in a defence
  from me.

---

## §7 — PATHS

```
MODIFIED  consonance/ui/chain-indicator.js       D1, D2, chain_state wiring
MODIFIED  consonance/ui/chain-indicator.test.js  31 -> 62 tests
MODIFIED  consonance/ui/app.css                  two new states
```

`main.rs` untouched (BRAVO's). Nothing committed, nothing pushed. **Written by the P-INDICATOR pane
at `instances/sibling-07b8a48f`** — for the commit body, per the 2026-08-26 amendment.

*A trace to re-run, not a doctrine to believe.*
