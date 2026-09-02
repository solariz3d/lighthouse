# P-LOOP-LOGO — the loop is on the logo. L033.

**ECHO, 2026-09-02 ~07:25. Supersedes P-AURA-ARROW, whose state map survives intact and whose
render does not. Nothing committed; paths at the end.**

## 0 · THE PART THAT CARRIED, AND THE PART THAT DID NOT

**Carried, unchanged:** the actor→destination mapping. `nextHop` answers who ACTS next, and the
party who acts next is the party who now HOLDS the loop — so `positionTab(hop)` and
`tabForWho(nextHop(hop).who)` return the identical tab for all three hop kinds, and the
never-point-at-itself guard nulled the arrow at EVERY hop. **The chair's §2 derivation was correct
and I attacked it before believing it**: reverting to the actor reading turns 7 tests red today
(mutant M-A), and the staleness fixture proves the inversion directly — an arrow drew only when
ledger and board disagreed.

**Did not carry: the render.** Amendments 2 and 3 and the arc I drafted were all fighting the same
wall — the tabs are Terminal · Orchestrator · Librarian, which is not cycle order, so any mark
between two adjacent tabs reads "from this one to the next one" and misreads on at least one hop
whichever end it is anchored to. **The keeper's logo removes the wall instead of choosing a side:
read the three dots clockwise from the top and they ARE the cycle — panes → LIB → orch → panes.
Nothing is skipped, so direction is geometry rather than a convention a viewer has to learn.**

The arc was written, tested and **reverted unlanded** the minute amendment 4 arrived. Its geometry
helpers are gone from the file; what remains of it is this paragraph and the header comment on
`renderTabs`, kept because the constraint is the reason the logo is an answer and not a fourth
iteration.

## 1 · WHAT IS BUILT

**`consonance/ui/index.html`** — the logo in the tab bar, after About. Same coordinates as the About
hero (top `32,10`, bottom-right `51,43`, bottom-left `13,43`), so it is the same mark the window
already teaches. Dots carry `data-dot="terminal|librarian|main"`; a hidden `#chainarc` sits behind
them. The nav comment that described the superseded aura is corrected.

**`consonance/ui/chain-indicator.js`**
- `dotLook(view, station)` — amendment 2's four looks, moved onto the ACTIVE dot, still separated on
  three independent channels so losing one leaves two: **shape** (bare dot / dot+ring / larger still
  dot / unfilled dashed), **motion** (working breathes 2.4s, waiting 0.9s, complete DEAD STILL),
  **brightness** (radiant / amber / chill / muted).
- `loopArc(view)` — the faint clockwise arc to the next dot, sweep-flag 1. **Derived from
  `view.arrowTab`, not from the position**, which is what carries D1 forward: an `unconfirmed`
  delivery keeps its lit dot and draws no arc, because `arrowTab` is already null there. Optional by
  design — every state that must not assert a direction simply gets none and loses no position.
- `renderTabs` now only STRIPS the two superseded renders from the bar. **One indicator, not two.**
- `renderLogo(el, view)` — the paint. `start()` drives it.
- **`decorateTabs` is untouched.** Every view-level assertion from the previous packet still passes
  unmodified, which is the evidence that this is a render change and not a second theory of the loop.

**`consonance/ui/app.css`** — placement for `.chainlogo`; the one-line `.mainhead`; `.headmore`.
The now-unused `.tabs button.chain-hold-*` rules are **left in place, not deleted** — this lap does
not own the question of what else may want them, and they are inert once nothing applies them.

**The seat headers (amendment 4's second half).** All three `.mainhead` spans are one line plus a
`title` carrying every sentence that was there. **Nothing deleted.** The librarian's two-doors
paragraph becomes a pointer — *"Two doors — see About ▸ The loop"* — and the About's own loop
section already holds the master form of it (it ends by naming `BUILDING.md` § THE JOINT STEP), so
this removes a third copy rather than creating one. `.mainhead` gains
`white-space:nowrap; overflow:hidden; text-overflow:ellipsis` for the same reason the chip has it:
a header that silently truncates and a header that is short must not make the same pixels. The
`▾ hover for the rest` cue is there because **a tooltip nobody knows about is a deletion wearing a
shrink's clothes.**

## 2 · A REAL RENDER BUG, CAUGHT BEFORE IT SHIPPED — and it is the file's own failure class

The first version set `circle.setAttribute('fill', 'var(--gold-live)')`. **`var()` does not resolve
in an SVG presentation attribute in Chromium, which is WebView2, which is this app.** Every test
here would have been green and the keeper would have looked at the tab bar and seen wrong colours or
nothing — the exact 2026-08-15 / 2026-09-01 shape this file exists because of, reproduced by me
inside the fix for it.

The repair writes **both**: the literal hex in the attribute (guaranteed to paint) and the custom
property in `style` (which resolves, and outranks the attribute, so `app.css` stays the source of
truth). The duplication has an oracle rather than a comment — a test reads `app.css` and asserts the
three literals are still what it defines, and two mutants score the plumbing (M-R, M-S below).

## 3 · BARS

**Tests: `node consonance/ui/chain-indicator.test.js` → 93 passed, 0 failed.** Was 89/0 before this
packet; the tab-render tests were re-aimed at the dots rather than deleted, and 5 net new tests.

**MUTANTS — 19 applied, 19 caught, 0 survived, 0 not-applied.**

    THE STATE MAP, carried forward from P-AURA-ARROW (it now decides WHICH DOT)
    M-A  revert to the ACTOR reading (the shipped defect)                   CAUGHT  7 red
    M-B  the self-pointing guard made UNCONDITIONAL                         CAUGHT  8 red
    M-C  the self-pointing guard REMOVED                                    CAUGHT  1 red
    M-D  destTab becomes the identity (arc points at the lit dot)           CAUGHT  9 red
    M-E  hop RING     / main -> librarian instead of terminal               CAUGHT  3 red
    M-F  hop DISPATCH / terminal -> main instead of librarian               CAUGHT  3 red
    M-G  hop HANDBACK / librarian -> terminal instead of main               CAUGHT  3 red
    M-H  atStation dropped from the last-hop branch                         CAUGHT  1 red
    M-I  atStation dropped from the outstanding branch                      CAUGHT  1 red

    AMENDMENT 4'S THREE NAMED MUTANTS
    M-J  SWAP THE ORCH AND LIB DOTS                                         CAUGHT  2 red
    M-K  FILED rendered RADIANT                                             CAUGHT  1 red
    M-L  ARC DRAWN ON UNCONFIRMED                                           CAUGHT  3 red

    THE LOOKS AND THE PLUMBING
    M-M  the CLOCKWISE sweep flag reversed                                  CAUGHT  1 red
    M-N  waiting loses its ring (the SHAPE channel)                         CAUGHT  1 red
    M-O  unknown paints the plain logo instead of dashing the dots          CAUGHT  3 red
    M-P  the lit dot ignores the holder (every dot lights)                  CAUGHT  2 red
    M-Q  renderTabs stops clearing the aura/marker (TWO indicators)         CAUGHT  1 red
    M-R  the ATTRIBUTE carries var() again (green here, blank in the app)   CAUGHT  6 red
    M-S  the style stops carrying the custom property                       CAUGHT  1 red

Reproduce: the runner is in the session scratchpad, `mutate.js`, and applies each patch to a copy,
runs the suite, and restores. **Patterns are written in a file and never passed through a shell
string** — the rule registered earlier today, and it earned its keep twice tonight: bash ate the
backticked identifiers out of two comment blocks I passed through `node -e`, which I found and
repaired with the editor instead.

**M-I is why the mutation run is in this hand-back and not a footnote.** In the previous packet it
SURVIVED — dropping `atStation` from the outstanding branch changed nothing, because every fixture
set the holder to the same seat the board named, so the fallback happened to agree. **The mutation
run found the hole; the fixture that kills it was written afterwards and is named as such in the
test.** That fixture is the 06:32 shape: a stale `holder chair` row with a dispatch still out.

**`node consonance/tools/js-suite.js` → 70 files discovered, 70 ran, 0 NOT-RUN, 4 FAILED:**
`actors.evidence.test.js`, `carrier-drift.test.js`, `lap-row.test.js`, `librarian-notes.test.js`.

**The red set MOVED under me and I did not cause it.** At the start of this lap it was three
(`actors.evidence`, `carrier-drift`, `corpus-age`) over 69 files. `corpus-age` is now green and two
others are red, because B and C are editing `lap-row.js`, `corpus-age.js` and the carrier-drift
registry in this same checkout while I ran. **What I checked rather than assumed:** the only failing
tool that reads any file of mine is `carrier-drift`, which scans `consonance/ui/index.html` as a
description surface — and `grep -c -i lifeguard consonance/ui/index.html` returns **0**, so my edits
add no findings to it. Its failure is a registry census (28 vs 25), which is B's live work.

**`cargo test --bin consonance` NOT RUN.** It compiles `main.rs`, and I have not entered that file.

## 4 · WHAT I DID NOT VERIFY — and the refusal condition, answered honestly

- **I cannot see it.** No test here renders pixels. The keeper's own falsifier — *can he say from
  across the room which seat holds the loop and whether it is moving or done* — is a proof only he
  can run, after the rebuild. **Do not describe this as working until he has looked.**
- **The refusal the packet invited — "the logo cannot carry five states legibly at tab-bar size" —
  I am NOT taking, but I am not clear of it either.** At 26px the dots are 4.2–5px. Brightness and
  motion carry fine at that size; **shape is the channel I am least sure of** — the waiting ring is
  1.6px on a 5px dot, and the unknown dash is 2.2/2.2 on a 4.2px circle. If either reads as mush,
  the honest fixes are a larger logo or dropping the ring in favour of a size step, and both are one
  constant. Say so after looking rather than assuming it works because it tests.
- **The arc's visual weight is a guess.** `stroke-opacity .45` on a 2.2px path; it is optional by
  design, so if it muddies the mark, deleting it costs nothing that carries state.
- **No layout test exists**, deliberately — there is no layout engine in this harness, and a
  mutation of a width rule would have no oracle. The one-line `.mainhead` is asserted nowhere; only
  a person can see whether the ellipsis lands well.
- **The `.chainlogo` placement inside a `display:flex` nav** is untested for wrapping at narrow
  widths.

## 5 · CORRECTIONS I MADE TO MYSELF

- The `var()`-in-an-attribute bug (§2), found by reasoning about the platform rather than by any
  test — which is precisely why the test now exists.
- I built amendment 3's arc and then reverted it unlanded. That is not waste, but it is 25 minutes
  spent on a render that a better idea replaced, and the reason I did not see the better idea is
  that I kept optimising the marker instead of questioning the surface it sat on.
- The first mutation run reported 8 of 9 with M-I surviving. I reported the survivor rather than
  quietly adding a fixture and claiming 9 of 9.

## 6 · PATHS TOUCHED (nothing committed, nothing pushed)

    consonance/ui/chain-indicator.js
    consonance/ui/chain-indicator.test.js
    consonance/ui/index.html          <- logo element, nav comment, three shrunk seat headers
    consonance/ui/app.css             <- .chainlogo, .mainhead one-line, .headmore
    exo_memory/handback/p-loop-logo_2026-09-02.md
    exo_memory/map/E.md               <- one appended line

**`index.html` and `app.css` were not in P-AURA-ARROW's ownership list**; amendment 4 directs work in
both (the logo's placement and the `.mainhead` shrink), so I took them. **Flagging it rather than
assuming it**: if another seat held either this lap, the collision is mine to have caused and the
edits are small and separable.

**Non-author read: A or B.**
