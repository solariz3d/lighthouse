# P-AURA — the loop indicator at the TOP of the window. L029 item 3.

**Dispatched to ECHO, 2026-09-02 ~03:12. Chair-written from the LIBRARIAN's work-shape (`fbacf78`).**

**You built the logic and it is correct. This is a RENDER TARGET and PLACEMENT change, plus one
unproven seam. No Rust.**

---

## 0 · WHY IT DID NOT LAND THE FIRST TIME, and it was not your fault

The L025 packet **omitted the keeper's design.** It sat in the librarian's notes at
`librarian/2026-09-01.md:430`, `:444`, `:566-568`, and the chair wrote the dispatch without it. You
built exactly what you were briefed to build, to every bar, with mutation 20/20 and two survivors
found and fixed. **A packet that omits the requirement produces work that meets every bar and
satisfies nobody.**

The design is now filed verbatim so it cannot go missing again. **Quote it; do not restate it** —
that file carries its own falsifier saying so.

    git show c177984
    exo_memory/loop/loop_indicator_design_2026-09-02.md

## 1 · THE KEEPER'S DESIGN — verbatim, 2026-09-02 01:31

> *"the title of where the loop is at is highlighted with a golden aura, with an arrow pointing
> towards where it goes next in the loop chain, then the other one highlights with the arrow moving
> to the next one. It all takes place at the top of the window where you see the terminal orch and
> lib buttons."*

## 2 · THE KEEPER'S AMENDMENT — verbatim, 2026-09-02 03:03

> *"i dont see anything, since there is no workchain loop going, but even after the first workchain
> ends, it should still light up the lib on its return trip, then once it comes back to the lib, it
> goes straight to the orch, so once the orch is going it doesnt have to be interacted with again
> unless the user just wanted to. You get what I mean? Once the loop is going the beginning chain
> doesnt need to be used again"*

**The user is the ENTRY, not a station.** Entry runs once by either door; then
`orch -> panes -> lib -> orch` repeats on its own.

**AND THE LIBRARIAN CHECKED THIS AGAINST YOUR CODE: the keying is ALREADY RIGHT.**
`chain-indicator.js:309-313` `holderArrow` maps chair→panes, panes→LIB, lib→orch with **no user
station**; `:289-293` `nextHop` maps ring→"orch to dispatch". With `{open:true, holder:'chair'}` the
pure view returns `quiet` with an arrow to panes. **Nothing about the cycle needs changing.** The
chair's claim that it might be "keyed to the wrong condition" is CLOSED, and is recorded here
because it was wrong.

## 3 · WHAT IS ACTUALLY BROKEN — three things, and the third may stop the packet

1. **PLACEMENT.** `#chainchip` is at `index.html:394`, inside `#streambar` at the **BOTTOM**, in a
   `statuscluster` with `ready`, `gate ask-each`, cost and hud. The tabs are at `:32-35` at the
   **TOP**. Wrong end of the window, not merely the wrong style.
2. **RENDER TARGET.** A text row, never the tab buttons.
3. **THE SEAM, UNPROVEN — your own §6 from L025.** `chain_state` has never been observed returning a
   value inside the WebView. If it does not, the view reads `unknown`, the chip shows its hardcoded
   default `chain ? position unknown` at `index.html:394`, **and a person reads that as nothing.**

## 4 · BAR 0 — DO THIS FIRST, IN THE RUNNING APP, BEFORE BUILDING ANYTHING

**With a lap open, print the chip's view object at render.**

- **If it is `unknown`: STOP.** The seam is the finding, not the aura. Report whether it is a
  one-line fix or something larger, and hand back. **Do not wire a golden aura to a value that never
  arrives** — that is this packet's version of the mistake that produced the whole situation.
- **If it is anything else:** the seam works, proceed to §5.

A lap is open now (`L029 RETURN-LEG · holder chair`), so this is testable immediately.

## 5 · THE RENDER — the librarian's shape, not the chair's

- **holder → tab:** chair→`main`, panes→`terminal`, lib→`librarian`. **Third Place never.**
- **aura class** on the holder's `.tabs button`.
- **one arrow element in the nav**, toward the next hop from `holderArrow` / `nextHop` **as already
  coded**. Do not recompute the cycle.
- **unconfirmed** = aura, **no arrow** (your D1, kept — a confident arrow on a superseded position is
  worse than none).
- **waiting** = amber at 15 min, **exception-triggered**, not always-on.
- **idle** = dark.
- **`unknown` GETS ITS OWN LOOK** — three tabs dim-outlined, and the text row says so. See §6.
- **`#chainchip` stays at the bottom** as the detail line.

**Files: `chain-indicator.js`, `index.html`, CSS. NO RUST.** The librarian's ruling: placement does
not widen scope — the state is computed once; the render gains a primary target at the top.

## 6 · THE FALSIFIER WAS UNDER-DETERMINED AND THE LIBRARIAN SHARPENED IT

The chair wrote: *"if the indicator is dark while `chain-status` reports an open lap, the render is
keyed to the wrong condition."* **That cannot separate two causes** — `unknown` and `idle` BOTH
render no aura (`:342-343`, `:376-399`), so a dead seam and a wrong key look identical.

**This is why `unknown` must have its own look.** Then:

    dark while open AND view != unknown   =>  the KEY is wrong
    dark while open AND view == unknown   =>  the SEAM is dead
    dark and no lap open                  =>  correct

## 7 · MUTANTS — landed-verified, serialized, an oracle per property

    M1  aura on the wrong tab                        -> red
    M2  arrow drawn on unconfirmed                   -> red
    M3  MUST BE DOM-LEVEL:  fixture {open:true, holder:'chair', stage:'return-leg'} RENDERED,
        then assert button[data-tab="main"] carries the aura class; remove the class
        application                                  -> red
    M4  `unknown` rendered the same as idle          -> red

**M3 IS THE LOAD-BEARING ONE AND ONLY AT DOM LEVEL.** A view-level version of it **already passes
today** and would not have caught tonight's failure — the view has been correct the whole time while
nothing reached the tabs. **A mutant that is green through the actual defect is not a mutant.**

*And the harness lesson from CHARLIE, 2026-09-01, because it cost a whole table:* its first harness
reported all four mutants as "DID NOT COMPILE" — it grepped `^error` and matched cargo's own closing
line. **It read the evidence of a CAUGHT mutant as evidence of a broken one.** Key on the result
line, not on the word error. B's variant of the same rule: **a mutant is caught only when an oracle
for the MUTATED PROPERTY fails**, never merely when something goes red.

*And the suite flakes ~10% in parallel* (`dirs_guard_tests::a_panicking_writer_still_puts_dirs_back`,
6/60 parallel, 0/40 serialized). **Score serialized.**

## 8 · WHAT YOU OWN

    consonance/ui/chain-indicator.js
    consonance/ui/chain-indicator.test.js
    consonance/ui/index.html
    consonance/ui/app.css
    exo_memory/handback/p-aura_2026-09-02.md

**`main.rs` is NOT yours** and is clean at `c2afec6` — do not touch it. **Do not commit.**
**Non-author read: A or B.** Not you, not the chair.

## 9 · PERMISSION TO REFUSE, and it is real

Say so if: bar 0 returns `unknown` (that is a STOP, not a failure); the aura cannot go on the tab
buttons without restructuring more than this covers; M3 cannot be written at DOM level with the
current test harness; or **the design as quoted cannot be built and the keeper needs to hear why.**

The chair has been wrong five times on this line alone: the omitted design, "bisect stops being
possible", "keyed to the wrong condition", a falsifier that could not separate two causes, and a
mutant that would have been green through the failure. **Every one was caught by someone else.**

## 10 · THE HAND-BACK

`exo_memory/handback/p-aura_2026-09-02.md`, then `call_librarian` with the POINTER and one line of
orientation, never the finding.

    OBJECTIVE:  with a lap open at ANY stage, the keeper looks at the TOP of the window and sees
                which seat holds the loop and where it goes next, without being told.
    FALSIFIER:  §6's three-way split. Dark with an open lap and a non-unknown view means the key is
                wrong; dark with unknown means the seam is dead; dark with no lap is correct.
