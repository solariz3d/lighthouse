# The loop indicator — the keeper's design, verbatim. QoL item 3, L029.

**Filed 2026-09-02 ~01:35, before the packet is written, because this design already went missing
once and the cost was a whole build aimed at the wrong render target.**

---

## THE DESIGN — the keeper, 2026-09-02 01:31, verbatim and not paraphrased

> *"the title of where the loop is at is highlighted with a golden aura, with an arrow pointing
> towards where it goes next in the loop chain, then the other one highlights with the arrow moving
> to the next one. It all takes place at the top of the window where you see the terminal orch and
> lib buttons."*

**That is the whole specification and it is not to be restated in anyone's own words.** Every packet
touching this quotes it.

## WHAT WAS BUILT INSTEAD, and it is not E's fault

`chain-indicator.js:511` mounts into **`#chainchip` — a separate text row.** The tab buttons
(`.tabs button[data-tab="main"|"librarian"|"terminal"]`, `index.html:32`, `term.js:911-923`) were
never touched.

**The position and hop logic is CORRECT and tested.** `chain_state` as the position source, the board
ring as the hop source, the L025 vocabulary ruling, D1's fourth no-arrow state, D2's per-pane
identity, mutation 20/20 with two survivors found and fixed. **Only the render target is wrong.**

**How it went missing, named on all three sides:**

- The design was in the librarian's notes at `librarian/2026-09-01.md:430`, `:444`, `:566-568`.
- **The L025 packet did not carry it.** The chair wrote that dispatch.
- The librarian filed it as its own miss too: *"that miss is mine as much as anyone's."*

**E built exactly what it was briefed to build.** A packet that omits the requirement produces work
that meets every bar and satisfies nobody — which is this room's own thesis about bars, arriving
again from a new direction.

## THE APPARENT CONFLICT, RULED — the librarian, 2026-09-02

C's `visible_channel_registration:96` says **"not registered: any per-turn always-on rendering."**
That governs the **NOTICE channel** (`systemMessage`, `:78`) — a message that FIRES.

**The aura is a STATUS DISPLAY: it fires nothing and interrupts nobody. Different object, no
conflict.** The exception rule keeps its job on the amber/stale state at 15 minutes.

## THE PACKET SHAPE — E, same file, RENDER CHANGE ONLY

The pure view function at `chain-indicator.js:338` is already tested and does not move.

1. **holder → tab:** orch → `main`, LIB → `librarian`, panes → `terminal`.
2. **the holder's tab gets a golden-aura class** while a lap is open.
3. **an arrow between tabs**, from holder to next hop; next hop from `ADDRESS_TABLE`, as C registered.
4. **on a hop, aura and arrow move.** No verdict word. `self_reported` renders `(claimed)`.
   **UNCONFIRMED draws NO arrow** — E's D1 kept, because a confident arrow on a superseded position
   is worse than none.
5. **amber at 15 minutes stays exception-triggered**, not always-on.
6. **the `#chainchip` row stays** as the detail line unless the keeper says drop it.

**Mutations:** aura on the wrong tab → red; arrow on unconfirmed → red.
**Non-author read:** A or B. Not E, and not the chair.

## ORDERING

**After L029 item 1 lands** (`116b593`, B's remainder). Not before — the tree is already carrying one
uncommitted diff that is the running binary, and a second concurrent change to a different file is
how a bisect stops being possible.

---

    OBJECTIVE:  the keeper looks at the top of the window and can see, without being told, which
                seat holds the loop and where it goes next.
    FALSIFIER:  if the aura ships and the keeper still has to ask "where is the loop", the render
                target was not the problem and this file is wrong about the diagnosis.

*Registered so this can fail: if a future packet touching the indicator restates the design in its
own words rather than quoting the block above, the thing that went missing once has gone missing
again in the same way, and the quoting rule is decoration.*
