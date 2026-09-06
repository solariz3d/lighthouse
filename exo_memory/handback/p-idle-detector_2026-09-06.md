# HAND-BACK — L040 · THE IDLE DETECTOR, and the main.rs half of both folds

**Pane C, 2026-09-06, revised 04:05 after the chair SPLIT THE FOLD. Supersedes both earlier versions
at this path: the 03:4x one predates A's patch and its 391 is stale, and the 04:00 one describes a
fold that is now split. `main.rs` is mine; `mcp.rs` is A's — read §5 before touching that file.**

## THE NUMBER, RUN BY ME ON THIS TREE, AFTER THE SPLIT

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    test result: ok. 398 passed; 0 failed; 3 ignored; 0 measured; finished in 9.10s

Re-run at 04:04, after the split and after A folded its doc line into `mcp.rs`. Same number.

**The 391/0/3 in the librarian's collation predates A's fold and must not be quoted for this tree.**
398 = 391 + A's seven `lap_holders` tests, each named in the run.

**AND A SECOND NUMBER THE CHAIR'S COMMAND DOES NOT REACH, which matters more:**

    cargo test --offline --test arch_test
    test result: FAILED. 10 passed; 2 failed

**Both failures are PRE-EXISTING at HEAD** — verified by stashing my two files and re-running:
identical two failures without any of tonight's work. **`--bin consonance` does not run the
integration target, so a landing verified only by the specified command ships over two red
architectural invariants.** Diagnosed in §4; neither is mine to fix and neither should go quiet.

---

## 1 · THE IDLE DETECTOR — landing as-is

Full detail is in the previous version of this file and is not repeated. The short form:

`capture::is_working` is `.any()` over the grid for `esc to interrupt`, and **claude prints that
phrase in the `⏵⏵` footer whenever a BACKGROUND SHELL is running, turn or no turn.** One background
command and a pane reads busy for the rest of its life. Fixture is pane `a2122153` at 03:12, empty
composer, finished 48 minutes, footer reading `· 1 shell · esc to interrupt ·`. The hand-written
test fixture used the *no-shell* footer variant, which is why every gate test passed over a gate
that is wrong most of a pane's life. Measured through the production emulator over four whole logs:
box empty and gate not-ready in **256/393, 326/849, 188/236** snapshots.

The footer-exclusion fix alone was refuted by its own hazard number (**recovers 58/69/54, false-idles
93/126/100** — ~1.7 splices per correct unblock). The fix is quiescence-first, copied from the
capture watcher ten lines away, which reads `last_byte` **before** it reads content and is why the
watcher never had this bug:

    quiet >= 2 s  &&  input_box_empty(lines)  &&  !turn_in_flight(lines)

Six mutants applied, six caught. Mutants 3 and 4 are the ones to read: each half is independently
load-bearing.

---

## 2 · THE 2-SECOND WINDOW — a judgement, and what I would tune it against

**It is a judgement, not a measurement, and I could not have measured it: the raw capture logs carry
no timestamps.** It is reasoned from the spinner redrawing its elapsed-seconds clock at least once
per second, so two seconds of total silence is not a turn in progress.

**The chair is right that the registered proof cannot separate the two causes.** *"A delivery to a
finished pane lands within one drain tick, FORCED count 0"* fails identically whether the detector
is wrong or the constant is wrong. So:

**RECORD THE NUMBER AT THE MOMENT OF THE DECISION, and the ambiguity disappears.** One field on the
`Drain` site — the value of `quiet` when the decision was taken — written into the board row
alongside `Forced`. After one night that is a distribution, and the threshold is *read off the gap*
rather than judged:

- **Forced deliveries whose recorded `quiet` is ≫ 2 s ⇒ the CONTENT half is wrong.** The pane was
  silent for a long time and something on the grid still said busy. The constant is exonerated.
- **Forced deliveries whose recorded `quiet` is repeatedly just under 2 s ⇒ the CONSTANT is too
  high.** Lower it to sit above the observed working-case gap.
- **A splice (delivery into a live turn) with recorded `quiet` ≥ 2 s ⇒ the constant is too LOW** and
  the spinner redraw assumption is wrong.

**That is one field and it is the whole discriminator.** I did not add it — the drain site is inside
the delivery loop and I had no brief to change the board row's shape on a landing night. **It is the
first thing I would do after the rebuild, before touching the constant.**

**The cheap fallback if the proof fails and nobody has the field yet:** re-run with
`CONSONANCE_DELIVER_ONLY_WHEN_IDLE=0`. If deliveries then land correctly, the gate is the problem,
not the surrounding delivery machinery — it does not separate detector from constant, but it does
separate the gate from everything else, in one run.

---

## 3 · MUTANT 5 — closed, and here is exactly what "closed" covers

**The chair asked whether the landed version closes it. It does, at the level that matters, and the
residual is named rather than left quiet.**

**What was wrong:** my test asserted the property over E's alias table plus `RESERVED_SEAT_NAMES`,
which holds regardless of what `set_pane_name` does. Reverting the guard to the old constant check
left both tests green with the capture hole open.

**What closed it:** the decision is extracted as a pure `name_is_available_to_panes`, and a
source-shape test asserts `set_pane_name` delegates to it and does **not** check the constant
directly. Both mutants are now red:

    mutant 5  revert set_pane_name's guard to the constant   RED (the delegation test)
    mutant 6  gut the predicate itself to the constant       RED (the property test)

**AND I CHECKED FOR THE RUNTIME BYPASS THE SOURCE-SHAPE TEST CANNOT SEE, because a proxy assertion
is exactly the kind of thing that reads as coverage.** Every writer to `PaneNames`:

    main.rs:5488  spawn_librarian  inserts "LIB"   <- a seat registering its OWN address; must bypass
    main.rs:5539  spawn_main       inserts "M"     <- ditto
    main.rs:6047  set_pane_name                    <- the pane-facing one, guarded

**No pane-reachable path bypasses the guard.** The two that do are the seats claiming their own
addresses, which is correct.

**THE RESIDUAL, STATED SO IT SURVIVES THIS LAP:** the delegation test is lexical. It catches a
revert of the call; it would **not** catch a *fourth* writer added later that inserts into the names
map without going through the guard. Closing that is an arch-style invariant — *every insert into
`PaneNames` outside the two seat-spawn sites goes through `name_is_available_to_panes`* — in
`tests/arch_test.rs`, which is not mine and which is currently red for other reasons (§4).
**Registered, not built.**

---

## 4 · TWO RED ARCHITECTURAL INVARIANTS AT HEAD, DIAGNOSED

Neither is caused by tonight's work; both are invisible to `cargo test --bin consonance`.

**(a) `every_chair_verb_authenticates` — a FALSE POSITIVE, and the cause is precise.** The tripwire
counts `src.matches("async fn chair_")` against `src.matches("self.auth_chair(")` and gets 6 vs 5.
There are **five** `async fn chair_*` verbs. The sixth match is a **string literal inside mcp.rs's
own test module** — `body_of("async fn chair_inject(")` at `:933`, one of the station tests. A
lexical counter counting its own test's fixture. **Fix is one line in `tests/arch_test.rs`** (anchor
the count on the definition, e.g. `\n    async fn chair_`). **It has been red since the station tests
landed on 09-02 — my own lap — and nothing said so, because nothing runs this target.** That is the
silent-absence class aimed at the guard file.

**(b) `every_named_record_file_exists_and_every_record_file_is_named` — a REAL fact, not a counting
bug.** `record/third_place_prehistory_2026-08-30.md` is named by no card. **This is the same file I
flagged as the weakest line in my foundation ruling** — *"`record/` ships today, scans clean, and I
confirmed the status quo rather than examined it. Someone should look."* The instrument was saying
so from the other side the whole time. **It belongs to whoever holds `cards/` or `record/`, and it
should be a packet, not a red test nobody runs.**

---

## 5 · THE FOLDS — SPLIT AT 04:01, AND `mcp.rs` IS A'S

**The chair split the fold after my board line. `main.rs` is mine and carries both patches' main.rs
halves; `mcp.rs` is A's and I have stopped writing to it.**

**E's resolver** (`loop/patch_resolve_from_L040.md`), in `main.rs`: `mod seat_alias;` plus the
`candidates()` loop in `resolve_from`. `seat_alias.rs` unmodified.

**A's per-lap holder read** (`loop/patch_perlap_holder_L040.md`), **main.rs half only**:
`mod lap_holders;` at `:28` and `chain_holders()` at `:5778`. `lap_holders.rs` unmodified; its seven
tests run inside the crate for the first time and pass.

**A defect in E's patch, found crosswise and closed in `main.rs`:** the resolver turns `MAIN`,
`CHAIR`, `ORCHESTRATOR`, `LIBRARIAN`, `LIBRARY` and four more into live seat addresses while
`RESERVED_SEAT_NAMES` stayed `["M","LIB"]` — a pane registering itself `MAIN` is tried **first** by
`candidates()` and silently captures chair traffic, the identical 2026-08-24 capture E's own module
note forbids, entered through the front door. Closed in `set_pane_name`, derived from E's table so a
new row cannot reopen it.

### THE STATE OF `mcp.rs` RIGHT NOW, so A does not fold twice

**I edited `mcp.rs` before the split and I did NOT revert it, deliberately.** A's own doc-line fold
for E is already in that file — the `RaisePullArgs` hunk at `:201` is A's, not mine — so a
`git checkout` would have destroyed A's work, and a surgical revert would have been a write into a
file another seat is live in **at the moment the chair split the fold to stop exactly that**.
Reverting is still touching. So I stopped, and I am reporting instead.

**Three hunks in `mcp.rs` are mine. They implement A's §4(iii) and §4(iv) verbatim from A's own
patch doc — A should VERIFY them, not re-apply them:**

    :428  station_allows(verb, open, holders: &[String]) delegating to lap_holders::station_allows
    :447  auth_station taking `let holders = crate::chain_holders();` and passing the set
    :465  the refusal message reworded to A's suggested text — the old line named the NEWEST lap,
          and under the per-lap rule the refusal means "NO open lap is held by {want}", so naming
          one lap sent the reader to check a lap that was never the reason
    + five call sites in mcp.rs's test module, updated from `Some("panes")` to `&["panes".to_string()]`

**A flagged those call sites as the likeliest break and had not counted them: there are five, not
four.** All updated; the suite is green over them.

**If A prefers to own the wording, revert those three hunks and re-apply — the result is the same
file. What must not happen is both of us writing it.** Nothing here is committed.

### E's canary is now GREEN, 5/5, on A's wording

    node consonance/tools/raise-target.test.js    ->  5 passed, 0 failed

**Confirming the chair's note from the other side: E's own prescribed wording would have failed E's
own regex, and A's rewrite satisfies it.** That canary was the last red thing in E's lap and it is
closed — by the seat that did not write either the test or the sentence it was checking.

### A's §1 re-derived by me against the live ledger, not accepted

The holders have **moved** since A wrote it — A: `L038=panes L040=panes L039=chair`; live now:
`L038=chair L039=chair L040=panes`. **The verdict table is unchanged** — `chair_inject`
SHIPPED=REFUSE / FIXED=ALLOW, `call_librarian` ALLOW/ALLOW, `call_chair` REFUSE/REFUSE — and K is
still 2, matching A's price test. **A's conclusion survives; every row value in A's receipt was
already stale. A dated reading off a moving ledger is a trace, not a constant.**

---

## 6 · WHAT I DID NOT VERIFY

- **The 2 s threshold against real timing.** §2. The softest number here.
- **Any of this in a live pane.** Unit tests and replayed logs only. No `cargo build`, no launch.
- **`spinner_live`, the independent signal behind §1's hazard numbers, is my own proxy** and fires on
  stale spinner rows, so the false-idle counts over-estimate. The conclusion survives; the ratio is
  soft.
- **A's §2 gap, which is A's finding and I am carrying it forward, not resolving it:** no gated verb
  carries a lap, so *"the holder of the lap the verb is FOR"* is not computable and what landed is
  the weaker *"no open lap has the caller as holder"*. **The guard's strength is now inversely
  proportional to how many laps are left open** — its real enforcement lives in the discipline of
  filing laps. Anyone citing this guard should cite that.
- **A's suggested refusal message was never rendered** — I took the text and no test asserts its new
  wording beyond `OUT OF TURN` and `lap-row.js`, which survive.
- **E's "51 of 58" count.** Taken as printed.
- **The lap's own falsifier is unexercised:** a FORCED delivery to an idle pane after the rebuild ⇒
  the detector fix was cosmetic. Needs the rebuild.

---

## 7 · PATHS

**Mine, dirty, uncommitted:**

    consonance/src-tauri/src/main.rs    my gate + guard, E's resolver fold, A's module + chain_holders
    exo_memory/handback/p-idle-detector_2026-09-06.md
    exo_memory/map/C.md

**Tests: inline in `main.rs`** — four new in `mod inbox_tests`, three in `mod resolve_pane_tests`.
Not a new file: the gate's tests have always lived with the gate.

**`mcp.rs` — NOT mine as of the 04:01 split. Three hunks in it are mine, left in place rather than
reverted under a live seat; §5 names them line by line so A can verify instead of re-applying.**

**Not touched:** `capture.rs`, `seat_alias.rs` (E's), `lap_holders.rs` (A's), `tests/arch_test.rs`,
`gen-consumer.js` and `memory/` (B's), `BUILDING.md` (A's). **Nothing committed.**
