# L136: the built bank arrives on time. Librarian, on L, 2026-11-04 06:3x, at the keeper's "keep it going"

## The ask
- E found during L135 (`handback/p-l135-E_2026-11-04.md` §"re-check 380d44c", R2): a fast bank ramp is BUILT later than the document says.
  60° over 120 m reads 23.4° at the ramp's end, and the road takes 126 m more to settle (up to 280 m on 60° over 60 m). The same numbers
  hold on main `d10eacf`, so this predates L135.
- The keeper asked "how does that happen". I explained it and offered to have the rounding lean earlier, then he said "keep it going".

## The cause, read in code (t180 `0df08db`)
- `src/core/adapter.js:390-400` `bankPlan`: wherever the built roll accelerates past `BANK_BAR` (:402, 3 g at a wheel 10 m out at
  170 m/s), that corner is re-rounded by one quintic over a window **centred where the roll's two straight runs would meet**, grown until
  it is under the bar. `CORNER_MAX` 250 m either side (:404); `BANK_TURN_KEEP` 4° where the road turns (:406). Only the built roll
  moves; the document is not rewritten.
- So half of each window lies after the corner, and a ramp's end corner is still rolling past the point the document holds the target.
- **Physics floor (derived):** rolling Δ rest to rest under an acceleration bound a needs at least 2·√(Δ/a). With a = BANK_BAR, that is
  about 203 m for 60° and 117 m for 20°. So 60° over 60 m cannot be built on time without starting early. The roll has to begin
  before the document's ramp start.

## The rule to build
1. **A corner where the roll ARRIVES at a hold or a target** (its rate goes to 0 after it): place the window so it ENDS at the corner
   point, not centred on it. The built bank is then within 0.5° of the target at the document's ramp end.
2. **A corner where the roll LEAVES a hold:** place the window so it starts earlier as needed, so the roll's total length fits rule 1.
   The road leans in sooner, never later.
3. Where the window cannot fit (it would leave its run, cross `CORNER_MAX`, or overrun a hold shorter than it needs), fall back to
   today's centred window for that corner, and report it: return `{ late: m }` in `bankPlan`'s entry so a later lap can show it in the
   panel. No panel change in this lap.
4. `BANK_BAR`, `BANK_TURN_KEEP`, the carry, and everything outside the windows stay as they are. D626's joint-bump rows must stay
   green unchanged.

## The packet
**E first (measure, before any code). File it as the registration:**
- On `0df08db`, E's settle table (`l135settle.js`: 10/30/60° over 60/120/300 m, ease and rounded) plus three of the keeper's shapes from
  the repo fixtures (`test/`'s close-banks lap and the joint-feel fixtures).
- Record: the built bank at the document's ramp end, the settle distance, and the peak roll acceleration against BANK_BAR.
- State the pass bar now: after the change, the built bank at every ramp end is within 0.5° of the target wherever rule 1 fits. No
  window exceeds BANK_BAR. Every D626 row is unchanged. A hold of ≥ 2× the floor is untouched outside its windows.
- State the degenerating signature now: any new joint-bump row failing; any built road off its document in a hold that was right
  before; the fallback (3) firing on the keeper's own sketch piece (750 m, −28.47° early, second bank to 0).
**B (build), after E files the bar:**
- Branch `l136-bank-on-time` off `l135-second-bank` `0df08db`, so one install carries both. Only `src/core/adapter.js` plus tests.
- Write the tests first, each red on 0df08db:
  - 60° over 120 m arrives within 0.5° at 120 m;
  - 60° over 60 m starts rolling early and arrives at 60 m, or reports `late` if the run before is too short;
  - his sketch piece builds as before (its 80 m+ second ramp is under the bar);
  - the D626 rows are untouched.
- Add one mutation row (the window centred again) that a test catches.
**E (review, non-author):** re-run its own registered table on B's tip and score it against the bar it filed. Vary: one shape it did
not register.
**Then:** C folds it into the L install for the drive (the same procedure as L135), unless the keeper is already driving L135. In
that case it waits for his word.

Rules: heavy-run lock at 4096; own CARGO_TARGET_DIR; targeted tests in review, one full suite at the merge; commit by named paths;
no AC launches; no push.

NEXT: chair dispatch E (register the bar on 0df08db) now; B builds when E's registration is filed; E scores B's tip
