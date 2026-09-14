# P-DIVERGED · ECHO — the window's half: a door for a fork, nothing preselected, TAKE routed as --take-stick

**Pane E, machine L, 2026-09-14 ~07:25. Built against §2.5, the app half of §2.6, §2.8 D-1..D-6 and (e), at
6397e1a / 6dbdae9.** No §5 stop: every line of mine was buildable as written. One consequence D-1 did not spell out
is built and named (§2). Nothing committed. Nothing with `--apply`. The real stick was not touched.

Files: `consonance/src-tauri/src/sync_launch.rs`, `consonance/src-tauri/src/main.rs`, `consonance/ui/stick.js`,
`consonance/ui/stick.test.js`. **None of A's files**; the working tree's `dev/*` and `state-manifest.json` changes
are A's.

---

## 1 · WHAT EACH RULING BECAME

    §2.5 / D-3   sync_launch::diverged_offer — {take_offered: true, default: None}, built BESIDE offer_for.
                 Its why names both choices, both byte counts and both machines, and says "unknown", not a guess,
                 when a count is missing.
                 sync_launch::offers_for_rows — the one builder: OTHER_CONVERSATION -> offer_for, DIVERGED ->
                 diverged_offer, anything else -> no offer. main.rs's rehearsal now calls it; the inline loop is gone.
    D-4          SeatChoice::None, tag "none". stick.js checks neither radio on "none".
    §2.5         a DIVERGED row's bytes cell: "the stick (from D): 121 B / this machine (L): 139 B of its own".
                 Carry stays disabled until every DIVERGED seat not already kept has a checked radio.
    D-6          stick.js: update() runs at render AND on every change event on the window body.
    D-5          picks() routes each TAKE by the row's data-verdict: DIVERGED -> take_stick, anything else -> retire_far.
    §2.6         stick_start_applier(take_stick: Vec<String>), is_sid-checked alongside the other decisions,
                 forwarded as --take-stick <sid>, and named in the STICK APPLIER row. KEEP is recorded by the
                 existing record_keeps, unchanged.
    §2.6 + D-2   rehearsal_is_quiet: a stop on an import row is not news when the seat is kept for this carry and
                 is DIVERGED or OTHER_CONVERSATION. An export stop is not news ONLY when its reason is
                 UNIMPORTED_TAIL AND its sid is one of those kept seats.
    D-1 (E)      stick.js: ALREADY_APPLIED and APPLIED_AND_GREW make Carry actionable.
    (e)          sync_launch::withheld_line(read_only, why): READ-ONLY only when the launch is read-only; a stick
                 hold says "The seats are waiting for the transfer window: they wake when you carry, or continue
                 without carrying." seats_withheld (main.rs:9806) calls it.

## 2 · THE CONSEQUENCE D-1 DID NOT SPELL OUT — built, and here for C to check

D-1 (E) rules that ALREADY_APPLIED and APPLIED_AND_GREW make Carry actionable at `stick.js:102`. **But the window never
renders for a rehearsal `rehearsal_is_quiet` calls quiet**: it releases the seats and closes. Both verdicts carry
nothing and stop nothing, so today they read quiet. The Carry D-1 enables would sit in a window that closed before
anyone saw it, and the heal would still never run from the window.

**So `rehearsal_is_quiet` now returns false for an import row with either verdict.** Without this, D-1's stated purpose
("the L059 heal never runs from the window") stays unmet. Pinned by `a_seat_whose_ledger_still_needs_healing_is_not_quiet`
(mutant V7).

**One thing it makes true, and it can be wrong, so C should rule:** a seat stuck at ALREADY_APPLIED holds the window
open on every launch until a Carry heals it. That is the intent: the ledger is wedged until then. As I read `:662-667`,
today its export also refuses UNIMPORTED_TAIL, so the window already stayed open. This makes the reason visible on the
import side instead of leaving it to the export side.

## 3 · THE ROWS THE TESTS READ ARE REAL

D-2 hid because its test passed `export rows: []`. So the new quiet and offer tests read **real `--json` output**:
`dev/tail-carry.js` at HEAD 6dbdae9, unmodified, run through `T.main` on a mkdtemp fixture of two machines. The
generator is `scratchpad/diverged/gen_rows.js`:

    seat aaaaaaaa  agreed, then D appends and exports, and L appends its own   -> import DIVERGED (stops), export REFUSED UNIMPORTED_TAIL
    seat bbbbbbbb  L holds a different conversation                           -> import REFUSED OTHER_CONVERSATION, export UNIMPORTED_TAIL
    seat cccccccc  unmoved                                                    -> NOTHING_PENDING / UP_TO_DATE

They are embedded verbatim in `sync_launch::diverged_tests::REAL`. Only the `path` fields (temp directories) were
stripped, and a consumer scan of the final tree shows 0 surviving leaks.

**Integration probe with A's working copy** (not HEAD — A's `tail-carry.js` as it stood at ~07:20). The same generator
now emits the fork row with `bytes: 121, ownBytes: 139, takeable: true, exportedFrom: "D"`, which matches A's §2.4 and
D-7. Fed through my functions by a temporary `#[ignore]` test, removed after the run (`grep -c` gives 0):

    offer default="none", take_offered=true, why carries "139 B" and "121 B" and both machines
    rehearsal_is_quiet: both seats kept -> true; neither kept -> false

So the two halves agree on the row shape. That is not a landed end-to-end run.

## 4 · RED FIRST — what was red, what was not, and two instrument faults in my own stub

**Rust.** The 15 new tests first went red **by compile**: `offers_for_rows` and `withheld_line` did not exist. I then
added one-line stubs that reproduced today's behaviour exactly — no offers at all, and the old READ-ONLY sentence —
so the rest could go red **by behaviour** against today's `rehearsal_is_quiet`:

    FAILED  kept_seats_are_quiet_although_their_export_refuses_unimported_tail     <- D-2, on the real rows
    FAILED  a_seat_whose_ledger_still_needs_healing_is_not_quiet                   <- D-1's consequence
    FAILED  a_diverged_row_is_offered_take_with_nothing_preselected · …names_what_take_and_keep_each_do
            · a_kept_diverged_row_says_so · an_other_conversation_row_is_still_offered_through_offer_for
    FAILED  a_stick_hold_says_the_seats_are_waiting_for_the_transfer_window
    FAILED  the 3 wiring tests (take_stick forwarded and sid-checked; offers through offers_for_rows; withheld_line)
    ok      a_keep_for_an_earlier_carry_does_not_quiet_this_one · an_unkept_fork_is_not_quiet
            · an_unimported_tail_for_a_seat_nobody_kept_is_still_news · a_read_only_launch_says_read_only
            · a_row_that_needs_no_choice_is_offered_nothing

**The five that passed are not red-first.** They are guards against widening the new behaviour too far, so they
already passed on today's code. One more guard was added before the mutation run, when I saw it was missing:
`a_kept_seats_export_stop_of_another_reason_is_still_news`.

**UI — two faults in my own test stub, both found before the implementation existed:**
1. **The D-1 tests passed on code that did not have D-1.** The stub's button object always said `disabled: false`,
   and today's window disables Carry through an HTML attribute the stub never read. Now the stub takes a button's
   starting `disabled` from the rendered HTML.
2. **The D-6 test passed on code with no re-check.** It asserted only that Carry was available after a choice, and
   today's window enables it at render. It now asserts the pair `[disabled before, disabled after] == [true, false]`:
   the change is what flips it.

After both repairs, six UI tests were red on today's `stick.js` (D-4, D-5, D-6, both D-1 cases, §2.5). The KEEP-recording
test passed already and is a guard.

**One existing L059 test was changed, and here is why:** `a transfer that could not start…` pins the confirm's
argument names to the command's signature. §2.6 adds `take_stick` to that signature, so the list gains it. The claim —
the window sends exactly what the command reads — is unchanged.

## 5 · THE BARS

    cargo test --bin consonance -- --test-threads=1     609 passed · 0 failed · 4 ignored   (593 before + 16)
    node consonance/ui/stick.test.js                    15 passed · 0 failed                (8 before + 7)
    ui suites unchanged                                 scripts-load 4 · chain-indicator 93 · gate-card-routing 12
                                                        · librarian-wiring 11 · third-place-wiring 10
    gen-consumer --out <scratch> --allow-dirty          0 surviving leaks

    MUTANTS — a scratch copy of the crate and UI, baseline run first (2 copy-only failures subtracted), tracked
    files hashed before and after
      V1   the fork offer preselects KEEP                         CAUGHT  a_diverged_row_is_offered_take_with_nothing_preselected
      V2   no offer on a DIVERGED row                             CAUGHT  3 tests
      V3   a kept DIVERGED stop not read as kept                  CAUGHT  kept_seats_are_quiet_although…
      V4   D-2 removed                                            CAUGHT  kept_seats_are_quiet_although…
      V5   D-2 widened to any seat                                CAUGHT  an_unimported_tail_for_a_seat_nobody_kept…
      V6   D-2 widened to any reason                              CAUGHT  a_kept_seats_export_stop_of_another_reason…
      V7   D-1's consequence removed                              CAUGHT  a_seat_whose_ledger_still_needs_healing…
      V8   the withheld line says READ-ONLY for a stick hold      CAUGHT  a_stick_hold_says…
      V9   a TAKE on a fork never forwarded                       CAUGHT  wiring
      V10  take_stick skips is_sid                                CAUGHT  wiring
      X1   every TAKE sent as retire_far (D-5)                    CAUGHT  D-5
      X2   no re-check on change (D-6)                            CAUGHT  D-6
      X3   Carry does not wait for a fork choice                  CAUGHT  D-4 · D-6
      X4   a heal does not make Carry actionable (D-1)            CAUGHT  both D-1 tests
      X5   a fork row shows no counts or machines                 CAUGHT  §2.5
      X6   KEEP preselected when nothing was chosen               CAUGHT  D-4 · D-6
      2 SURVIVE-CONTROLs survived · SKIP-CONTROL not applied · 16 applied · 16 caught · tracked source untouched

## 6 · WHAT I DID NOT VERIFY

- **Nothing ran in the app**, so the window's layout, focus and the reveal after the intro in WebView2 are
  unverified. `stick.test.js` runs the real script against a stub DOM.
- **End to end with A's applier.** `--take-stick` reaching `stick-apply.js`, and through it `RETIRE_THEN_APPEND`, was
  not run. `stick-apply.js:80` exits 2 on an unknown flag, so **both halves must land together**, as the packet says.
- **The falsifiers on D** — a still-DIVERGED seat after TAKE, a fresh seat, the attic file, size and sha — are A's
  writes and the landing's run. Mine is (i)'s routing half: a TAKE on a fork leaves the window as `take_stick`, never
  `retire_far` (D-5, X1).
- **§2.7 is shown, not built:** KEEP's export consequence is named in the offer's text and nothing clears the other
  machine's pending tail.
- **An APPLIED_AND_GREW row's `ownBytes`** is not rendered specially. Such a row shows its ordinary byte column. D-1
  gives it no offer, and the packet names no display for it.
- **Anything on D.**
