# P-AURA ADDENDUM — build it. Bar 0 is withdrawn; the glance is the acceptance test.

**To ECHO, 2026-09-02 ~04:05. The original packet `12e1e89` stands except where this changes it.**

---

## 0 · BAR 0 IS WITHDRAWN, AND YOU WERE RIGHT TO STOP AT IT

You reported it is not runnable from a pane — the UI is compiled into the exe, `launch.ps1` refuses
to rebuild while the app runs, and a pane has no path to the DOM. **Correct.** The packet folded the
KEEPER's glance into a SEAT's step. That is the chair's error and the librarian named the mismatch
as its own as well.

**The rule that comes out of it, worth more than the bar was:** *a bar must be runnable by the seat
it is given to.*

**And it does not block you.** If `chain_state` returns `unknown`, the aura renders the **unknown
look** — which §6 already requires you to build. **The code is the same either way.** The seam
question decides what the keeper SEES after a rebuild, not what you write.

**So: build all four looks now.** One rebuild follows, and the keeper's glance becomes the acceptance
test for the seam, the placeholder, the aura, the two colours and the shelf reorder at once.

## 1 · THE ROW YOU FOUND IS FIXED — and your reading of it was right

`holder` is a **STATION** — `chair | panes | librarian | none` — never a pane. The librarian ruled
it; the vocabulary was its own. The corrected row is appended:

    L029 dispatched --holder panes --to A,B,C,E

**Your `holderArrow` and `chain-status.js` were correct as written and are NOT to be widened.**
Widening the readers would bless the fan-out error. The four drifted rows stay (append-only); the
live reading is repaired by the one corrected row, since `chain_state_from` takes the newest chain
row per lap.

**A validation packet for `lap-row.js` (refuse a non-station `--holder`, accept `--to <letters>`) is
owed and is NOT yours** — it goes to whoever does not own this lap's file.

## 2 · TWO AMENDMENTS SINCE YOUR PACKET — quote them, do not restate

    git show c177984     # AMENDMENT 1 — the user is the ENTRY, not a station
    git show 4e0de97     # AMENDMENT 2 — two lit states
    exo_memory/loop/loop_indicator_design_2026-09-02.md

**AMENDMENT 2 adds a state the design did not have: DONE.** Until now there was one lit look and one
dark one, so *the cycle completed* and *nothing ever started* rendered identically — **the same
failure as your placeholder finding, arriving a third time.** You caught it in `index.html`; the
librarian caught it in `unknown`-vs-`idle`; the keeper caught this one by describing what he wanted
to see.

### The four looks

    WORKING    radiant, holder's tab, ARROW to next hop; both move on a hop
    WAITING    amber, 15 min, exception-triggered (unchanged)
    COMPLETE   CHILL GOLD, static, NO arrow, on the LIBRARIAN's tab — when `filed` is the newest
               chain row. Held until the next lap opens.
    UNKNOWN    its own look — three tabs dim-outlined, and the text row says so

**DARK now means exactly one thing: no lap ever opened, or completion dismissed.** A closed lap is
chill gold, **not** dark.

**Position source unchanged.** `chain_state`, with a `filed` newest row meaning complete. No new
plumbing, no Rust.

## 3 · MUTANTS — the four from `12e1e89` plus one

    M1  aura on the wrong tab                                    -> red
    M2  arrow drawn on unconfirmed                               -> red
    M3  DOM-LEVEL: fixture {open:true, holder:'panes', stage:'dispatched'} RENDERED, then
        assert button[data-tab="terminal"] carries the aura class; remove the class
        application                                              -> red
    M4  `unknown` rendered the same as idle                      -> red
    M5  a FILED lap rendered radiant                             -> red      <- new, amendment 2

**M3's fixture is updated to `holder:'panes'`** — the fan-out case, which is the loop's most common
stage and the one the old `chair→main` fixture never exercised. **That fixture is why all three of us
had a green test over a dark aura.**

**A mutant is caught only when an oracle for the MUTATED PROPERTY fails.** Both survivors and
equivalents get named, never counted as caught — B reported M7 surviving twice and M10 equivalent
this lap, and C reported M13 with the whole door-two prose deletable green. **Those tables are worth
more than clean ones.**

## 4 · WHAT YOU OWN — unchanged, and the tree is now clean

    consonance/ui/chain-indicator.js
    consonance/ui/chain-indicator.test.js
    consonance/ui/index.html
    consonance/ui/app.css
    exo_memory/handback/p-aura_2026-09-02.md   (append to your existing one)

**`dirty 0` — A, B and C have all landed and no one else is in the tree.** `index.html` is yours
alone now; C's §2.3 paragraph was correctly refused under the collision rule and waits on you being
done. **Do not commit.** **Non-author read: A or B.**

## 5 · PERMISSION TO REFUSE, still real

Say so if: the four looks cannot be distinguished without more than CSS; `filed` is not reliably the
newest row at the moment completion should show; or **the two colours cannot be told apart from
across the room**, which is the keeper's own stated test and not a metaphor.

    OBJECTIVE:  the keeper looks at the top of the window and can tell, without being told and from
                across the room, WHICH seat holds the loop, WHERE it goes next, and WHETHER it is
                moving or done.
    FALSIFIER:  chill gold while an open lap is reported, or radiant on a filed one, means the state
                map is wrong. And if he cannot tell done from moving at a glance, the two colours
                failed their only job.
