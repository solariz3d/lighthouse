# P-AURA-ARROW — the arrow draws only when the data is stale. L033.

**To ECHO, 2026-09-02 ~06:55. From the LIBRARIAN's replay (`b70c688`) and the keeper's glance at
06:39: _"the orch glows, but there is no arrow."_ Chair-derived from your module before dispatch —
§2 goes further than the hand-back it came from, and the extra part is the chair's claim to
attack.**

## 0 · FIRST, THE HALF THAT WORKED, BECAUSE IT IS YOURS AND NOBODY HAD SEEN IT

**The seam is live, proven by an eye.** The Orchestrator tab lit means `chain_state` returned into
WebView2 and `renderTabs` ran. **Your registered falsifier — _dark with a live row ⇒ renderTabs never
ran_ — did NOT fire**, and the tab that lit is the correct one (`L029 HANDBACKS-IN · holder chair`).

That is the first rendering anyone has seen in two nights of building it, and it is right.

**You do not remember writing it.** The capture harvester stalled at 02:39, so your shell was warmed
from a tail that predates your own work — that is P-CAPTURE-HARVEST, also yours, also this lap.

## 1 · THE LIBRARIAN'S READING, WHICH IS CORRECT AS FAR AS IT GOES

`nextHop` (`chain-indicator.js:294-301`) answers **who ACTS next**; its own docstring says so. The
last board hop is the librarian's ring, so `nextHop({kind:'ring'})` returns `{who:'orch'}` — and
`orch` is also the HOLDER, so `:613`'s guard *"never point a tab at itself"* nulls the arrow.

> **The ring names WHO ACTS next. The keeper's design asks WHERE THE LOOP GOES next.**
> From the orchestrator it goes to the panes.

## 2 · AND IT IS NOT ONE POINT OF THE CYCLE — IT IS EVERY POINT. Check this before building.

    positionTab(hop)                   dispatch -> terminal   handback -> librarian   ring -> main
    tabForWho(nextHop(hop).who)        dispatch -> terminal   handback -> librarian   ring -> main
                                       ^^^ chain-indicator.js:347-353 and :356-363

**They are the same function.** `positionTab` is *where the loop IS* and `tabForWho(nextHop(...))` is
*where the arrow points*, and for all three hop kinds they return the identical tab. So whenever
`view.next` comes from the board, `arrowTab === view.tab` and `:613` nulls it — **not at one hop, at
every hop.**

Which yields the inversion, and it is the thing to fix rather than the missing arrow itself:

> **The board-derived arrow can only ever draw when the ledger holder and the board's latest hop
> DISAGREE — that is, when one of them is stale. It vanishes exactly when the data is current.**

**Both of tonight's observations fall out of that one mechanism, which is why it is worth more than
either.** At 06:32 the keeper saw an arrow — the chair had left `L029` at `dispatched · holder panes`
for three hours while the hand-backs were already in, so ledger and board disagreed. At 06:39 he sees
none — the chair advanced the row to `handbacks-in · holder chair` and the librarian rang, so they
agree. **The chair made the arrow disappear by making the data correct.**

**`holderArrow` (`:305-320`) already has the right semantics** — `chair -> panes`, `panes -> LIB`,
`librarian -> orch` are DESTINATIONS. You derived them, and the anchor-to-destination rule in your
§10 is yours too. **The module holds both semantics and they disagree only where they overlap.** The
board path kept the actor reading; the ledger path got the destination reading. That is the defect in
one sentence.

## 3 · THE FIX — small, same file, and the shape is yours to choose

The mapping the design wants, stated as destinations:

    hop just completed        loop is at      arrow points at
    dispatch                  panes           librarian     (pane -> hand back)
    handback                  librarian       main          (LIB -> ring)
    ring                      orch/main       terminal      (orch -> dispatch)

**Note this is exactly `holderArrow` applied to `positionTab`'s answer** — which suggests one
composition rather than a second table, but that is a suggestion and not a bar. **If a second table
reads more honestly, build that and say why.**

**KEEP the self-pointing guard at `:613`.** With destinations it stops firing in the normal case and
becomes what it should always have been: a **staleness detector**. If the arrow ever points at the
lit tab again, ledger and board have genuinely diverged, and nulling it is right.

## 4 · BARS

    1  RED FIRST, at the live case:
       fixture: chain {open:true, holder:'chair', stage:'handbacks-in'} + last board hop LIB->orch
       assert arrowTab === 'terminal'.   TODAY: null.  AFTER: 'terminal'.

    2  ONE TEST PER HOP KIND, all three. The bug is at every point of the cycle and a test at
       only the ring hop would go green over two live defects. This is the fixture failure that
       has bitten this room five times in two nights -- every fixture anyone wrote used the one
       holder value that works.

    3  MUTANT: revert the mapping to the actor reading -> all three red. If any stays green that
       hop has no oracle. Report applied / caught / NOT APPLIED. Survivors and equivalents named,
       never counted as caught.

    4  A MUTANT FOR THE GUARD: make :613 unconditional -> red. It must keep working as the
       staleness detector, and a guard nothing tests is a guard that leaves silently.

    5  node consonance/tools/js-suite.js -- state the count and what moved.

**KNOWN REDS, none yours:** `actors.evidence.test.js` (since 2026-08-25), `corpus-age.test.js`
(since `c2afec6`), plus anything A reports mid-flight in `main.rs`.

## 5 · WHAT YOU OWN — and the collision, which is real

    consonance/ui/chain-indicator.js
    consonance/ui/chain-indicator.test.js
    exo_memory/handback/p-aura-arrow_2026-09-02.md
    exo_memory/map/E.md                       (one line — see §7)

**ALPHA holds `consonance/src-tauri/src/main.rs` this lap.** Nothing here touches it. **Your other
packet (P-CAPTURE-HARVEST) does** — its leg 1 is diagnosis in a test file only, and it does not enter
`main.rs` until A hands back. **This packet is the one to do first**: it is small, it is in a file
nobody else holds, and it rides the same rebuild.

**Do not commit.** Name your paths. **Non-author read: A or B.**

## 6 · PERMISSION TO REFUSE

Say so if: §2's claim is wrong — **it is the chair's derivation, not the librarian's, and the chair
has published four wrong readings of other seats' findings in two nights**; or the composition in §3
breaks a case neither of us has thought of; or the destination arrow makes the WAITING and UNCONFIRMED
states render worse than the missing arrow does. **`unconfirmed` deliberately keeps the aura and loses
the arrow (D1, kept from L025) — do not let this change quietly undo that.**

## 7 · THE HAND-BACK

**Write `exo_memory/handback/p-aura-arrow_2026-09-02.md`, then `call_librarian` with that path in the
same turn.** Pointer and one line of orientation — never the finding.

**And append ONE LINE to `exo_memory/map/E.md`.** It cannot reach you yet: `map_dir()` has never
resolved to the directory the maps are in, which is A's packet this same lap. **Write it anyway** —
the first wake it survives is the one after this build.

    OBJECTIVE:  the keeper looks at the top of the window and sees, without being told, which seat
                holds the loop and WHERE IT GOES NEXT -- including at the point where the loop is
                sitting with the orchestrator.
    FALSIFIER:  if after the fix the arrow points at the lit tab in any normal state, the mapping is
                still the actor's and not the destination's. And if the arrow is present today at
                any hop where ledger and board AGREE, §2 is wrong and should be said so plainly.
