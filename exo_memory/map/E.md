# E's map — one writer, appended by E alone

Findings with evidence pointers, per `../map/README.md`. First append 2026-09-02; anything E found
before that date lives in its hand-backs and was never carried here, which is the reason this file
starts late rather than a reason to trust it less.


## 2026-09-02 — the loop indicator: bar 0, the aura, and six things that cost a night

Full working: `../handback/p-aura_2026-09-02.md` (491 lines, both halves — the stop at §1-9, the
build at §10-17). Commits `c56a572` (the stop) and `690df7c` (the aura). Packets `12e1e89` +
addendum `97a21fe`; the keeper's design and both amendments are quoted verbatim in
`../loop/loop_indicator_design_2026-09-02.md` and are never to be restated.

### Two different facts that make the same pixels is one defect class, and it recurred three times in one night

2026-09-02, `../handback/p-aura_2026-09-02.md` §6 and §11; commits `c56a572`, `690df7c`.

`index.html` shipped `#chainchip` with the literal placeholder `chain ? position unknown`, and
`chain-indicator.js` renders the `unknown` state as the string `chain ? position unknown`. Identical.
So *a script that never executed* and *a script that ran and had no reading* were the same pixels,
and the chair's three-way seam falsifier silently became four-way with the fourth invisible. Fixed
to `chain — no reading yet`, pinned by a test that reads `index.html` and asserts the placeholder
equals no rendered state's text. The same shape then appeared twice more within the hour: the
librarian found `unknown` and `idle` both drawing no aura (`12e1e89` §6), and the keeper found *done*
and *never started* rendering identically, which is what AMENDMENT 2 (`4e0de97`) exists to fix.

General form: **when two states share a rendering, no falsifier over that rendering can separate
them, and the falsifier will confidently blame whichever cause its author had in mind.** Look for it
wherever a default value and a computed value can produce the same output — placeholders, empty
strings, zero, and dark.

### An arrow between UI elements must anchor to the DESTINATION, because a tab bar is not in cycle order

2026-09-02, `../handback/p-aura_2026-09-02.md` §10; `consonance/ui/chain-indicator.js`, `renderTabs`.
Nobody specified this; it fell out of trying to build the design as quoted.

The design says the holder's tab lights with an arrow pointing where it goes next. The bar is
`Terminal · Orchestrator · Librarian · …` and the cycle is `orch → panes → lib → orch`, so the tabs
are **not** in cycle order: an arrow parked beside the lit tab points at whatever happens to sit next
to it and is wrong on two hops out of three. The rule that is correct for every pair without
reordering a bar the keeper knows by position: **place the arrow adjacent to the DESTINATION, on the
side facing the holder, pointing INTO the destination.** Destination to the right → immediately
before it, `→`. To the left → immediately after it, `←`. Asserted as three literal strips of the
rendered bar, plus one test that four hops in a row leave exactly one arrow in the nav.

General form: **a spatial indicator is only as true as the layout's ordering, and layouts are ordered
for the reader, not for the process.** Anchor to the thing being named, never to the thing naming it.

### An open lap the display cannot place must render UNKNOWN, never dark

2026-09-02, `../handback/p-aura_2026-09-02.md` §11; `chain-indicator.js`, `decorateTabs`, rule 2.
**This rule is E's, not the amendment's, and it is flagged as such in the hand-back for the
librarian's ruling.**

AMENDMENT 2 narrows dark to exactly one meaning — no lap ever opened. So a `holder` word outside the
station vocabulary must not be allowed to borrow dark: "the display cannot place the loop" is what
the unknown look already says. Without this rule the 2026-09-01 ledger drift would have rendered as
*"no lap has ever opened"* while a lap was plainly open — the same defect class as the entry above,
re-entering through the vocabulary door after being fixed at the placeholder.

General form: **the moment you narrow a state to one meaning, audit every path that can still reach
it.** A narrowed state is a promise, and unmapped inputs are how it gets broken.

### A reader keyed to a literal goes blind silently when the writer's vocabulary drifts — fix at the writer, never at the reader

2026-09-02, `../handback/p-aura_2026-09-02.md` §4; `data/lap.jsonl`, 110 chain rows AT THE TIME OF
THE FINDING (~03:30; the ledger is append-only, so a re-run returns more — the drifted rows are the
durable fact, not the counts): `grep -o '"holder":"[^"]*"' lap.jsonl | sort | uniq -c`.

From 2026-09-01 12:25 (L027) the ledger's `dispatched` rows carried pane NAMES — `charlie`, `bravo`,
`bravo`, `echo` — where the ruling says the station `panes`. `tools/lap-row.js` accepts any free-text
`--holder`. Two readers went blind at once: `holderArrow` returned null (no arrow), and
`tools/chain-status.js:721`/`:804` key on the literal `'panes'` and skip those laps entirely. **My
first move was to widen `holderArrow` and I withdrew it** — patching one reader blesses the drift and
leaves the second reader broken while removing the symptom from the seat that found it. The chair's
ruling confirmed it: `holder` is a STATION, the readers were correct as written, the repair is one
corrected ledger row plus a validation packet for `lap-row.js` (`97a21fe` §1).

General form: **when a patch would make a symptom disappear from the only instrument that can see it,
the cause is upstream.** Count the readers before you touch one.

### chain_state reports only the NEWEST open lap, so one stale unfiled lap masks the state of the current one

2026-09-02, `../handback/p-aura_2026-09-02.md` §15; `main.rs`, `fn chain_state_from`
(newest chain row per lap, drop `filed`, sort by `at` desc, take first).

Four laps were open. When L029 filed, the reading would have fallen through to **L028** — twenty
hours old, and still carrying the drifted `holder "bravo"` — so at the exact moment the keeper
expected the new chill-gold COMPLETE look, he would have got the UNKNOWN look over a stale lap.
Nothing in the render was wrong; the state map was doing the right thing with the data it had. *The
instance is closed* — L026-L028 were filed at `51ac87c`, two flagged unwitnessed — **but the
mechanism is permanent: COMPLETE is only reachable when EVERY lap is filed.**

General form: **an instrument that reports "the newest N" hides everything behind it, and unfinished
housekeeping upstream reads as a defect in whatever renders it.** Check the tail before blaming the
head.

### Never report a zero from an instrument you have not run a positive control through

2026-09-02, `../handback/p-aura_2026-09-02.md` §8;
`grep -a -o -- "<name>" C:/build/lighthouse-target/release/consonance.exe | wc -l` over all 41
registered Tauri command names.

To decide whether the running binary registered `chain_state` I grepped the exe for the command-name
literal and got **0**. I nearly reported *"the command is not in the running binary."* The control
saved it: `get_state` also returns 0, and the app cannot boot without `get_state`. Seven of 41 names
return 0. The instrument is refuted by its own control and its zero carries no information. (UI
strings also return 0, separately explained — Tauri embeds `frontendDist` brotli-compressed.) Same
class as CHARLIE's 2026-09-01 table, which grepped `^error` and matched cargo's own closing line,
reading four CAUGHT mutants as broken builds.

General form: **a null from an uncalibrated instrument is not a fact about the world.** Before any
absence is reported, run the instrument over something you know is present. Offered to `BUILDING.md`
beside B's *"a named landmine does not generalise; a backup does."*

### A bar must be runnable by the seat it is given to — and stopping at one you cannot run beats faking it

2026-09-02, `../handback/p-aura_2026-09-02.md` §2; commit `c56a572`; the chair's own withdrawal at
`97a21fe` §0.

P-AURA's bar 0 required printing the chip's view object *in the running app* before building. It is
not runnable from a committee pane: the UI is compiled into the exe (`tauri.conf.json` `frontendDist`),
`launch.ps1` refuses to rebuild while the app is up ("Windows locks a running exe"), there is no
devtools and no control-plane verb reaches the WebView. The lap being open made it testable in
principle and never by this seat. I stopped and reported the mechanism rather than substituting a
node replica and calling it the measurement. The chair withdrew the bar and named the replacement
rule; the librarian had already registered the same measurement as *"one glance at the tab bar by the
keeper is the test"* — a KEEPER's step that the packet had folded into a SEAT's.

General form: **check who can actually run a gate before treating it as one.** And the constructive
half, which is why the stop cost nothing: the build was written so the seam reports itself — a dead
`chain_state` paints the UNKNOWN look — so **an unanswerable question about a value can often be
turned into a state the display names**, and then it stops gating anything.

## 2026-09-02 · L033 · the capture harvester stalled, and the detector was innocent

**The finding, as a sentence that could be wrong:** the four committee panes' `.txt` transcripts
froze at 02:39 not because the ready-screen detector stopped matching, but because each pane's
**watcher thread stopped running** while its reader thread kept growing the `.log` — so the fault is
upstream of `capture::screen_ready`, in `main.rs:1060-1113`.

**Evidence:** `cargo run --bin harvest_replay -- C:/Consonance/data/captures` (the bin is mine, new,
`src/bin/harvest_replay.rs`). Replayed through the real `capture.rs`, the four stalled logs give
181/209/301/122 ready screens and 85/47/210/11 records; the last 3 MB of each still gives 4/7/5/5
ready. MAIN, same binary and directory, has 2,187 records on disk and an mtime of 06:41 — the
control that says harvesting was alive in the process the whole time.

**Narrowed to two and NOT separated:** a poisoned emulator mutex `break`ing the watcher at
`main.rs:1070-1073` (the reader at `:1038` skips on the same poison and keeps logging), or a panic
in the watcher body. Both silent, identical on disk.

**The defect one layer up, which is the part worth carrying:** the watcher has **no liveness signal
at all**, so *nothing was harvested* and *harvesting ran and produced nothing* leave the identical
`.txt` mtime. That is why four panes lost a night with every instrument green.

**Hand-back:** `exo_memory/handback/p-capture-harvest_2026-09-02.md`. Leg 2 (the repair, in
`main.rs`) not started — gated behind A.

## 2026-09-02 · L033 · the loop indicator: three renders, and the surface was the problem

**The finding, as a sentence that could be wrong:** every arrow scheme for the tab bar failed for
one structural reason — the tabs render Terminal · Orchestrator · Librarian, which is **not cycle
order**, so a mark between two adjacent tabs reads "from this one to the next one" and misreads on
at least one hop *whichever end it is anchored to*. Anchoring at the holder (amendment 2), at the
destination (amendment 3, mine), and an arc vaulting over the skipped seat were all fighting the
same wall. **The keeper's logo removes it: the three dots read clockwise from the top ARE the
cycle, so direction becomes geometry instead of a convention the viewer must learn.**

**The general form worth carrying:** when three good fixes to one display all fail somewhere
different, stop fixing the mark and check whether the SURFACE encodes the relation you are trying
to draw. I kept optimising the marker and did not question the tab order.

**What survived the switch, and it is the load-bearing half:** `nextHop` answers who ACTS next, and
the party who acts next is the party who now HOLDS the loop — so the board-derived arrow always
pointed at the tab that hop had just lit and the self-pointing guard nulled it at every hop. The
arrow could only ever draw when ledger and board DISAGREED. That actor→destination correction is
untouched by amendment 4; it now says which DOT.

**Evidence:** `node consonance/ui/chain-indicator.test.js` 93/0; 19 mutants applied, 19 caught
(runner in the session scratchpad). **M-I is the one to remember** — dropping the board's reading
from the outstanding branch SURVIVED the first run, because every fixture set the holder to the
same seat the board named. The mutation run found the hole; the fixture came after and says so.

**And a render bug I caused and caught:** `var()` does not resolve in an SVG presentation attribute
in Chromium/WebView2, so `setAttribute('fill','var(--gold-live)')` is green in node and blank in the
window — this file's own failure class, reproduced inside the fix for it. The colours are now
written twice, with a test pinning the literals against `app.css`.

**Hand-back:** `exo_memory/handback/p-loop-logo_2026-09-02.md`. Not proven: nobody has looked at it.

## 2026-09-06 · L037 · the gate I was sent to fix had never been written

**The finding, as a sentence that could be wrong:** `gen-consumer.build.test.js` — cited as a
running `cargo check` gate by five documents including the generator's own header (`:70`), the
parity report (`:196`), a hand-back, `map/J.md` twice, and my own packet — **has never existed in
this repo's history, on any branch, and is on no disk here.** So the room was not running a weak
gate over the consumer tree; it was running none, while four documents reasoned from a description
of one. `gen-consumer.test.js`'s own header says so in plain words and went unread for two weeks:
*"that took minutes and is not suite-shaped, so the structural equivalent lives here."* Intention in
one header, recorded as done in another, cited from the second. **The 2026-08-17 / 2026-08-23
carrier class with the sign flipped: not a correction that failed to propagate, a claim that was
never true that did.**

**Then built it anyway, because the refutation changes what I say, not whether I deliver.** Oracle
moved to `cargo build` + a launch probe with four verdicts.

**The bar-4 answer, and it is a platform fact nobody had looked at:** on every machine a seat works
from, the app is ALREADY RUNNING, so launching the generated exe hits `claim_single_instance`
(`main.rs:4458`) → `warn_second_instance` (`:4498`) → a **`MessageBoxW` the process blocks in**.
Measured: `#32770 | visible | "Consonance - already running"`. **The process is alive AND owns a
visible top-level window whose title contains the app's name.** Alive-based and MainWindowHandle-
based probes both call that LAUNCHED. The discriminator is the window CLASS, measured off the live
app (`Tauri Window`), never assumed. Two more of the same shape: `MainWindowHandle` missed a real
window for 10s where `EnumWindows` found it instantly; and `CARGO_TARGET_DIR` is set here, holding a
`consonance.exe` built 09-02 **from the source tree** — a gate would have probed that and called the
generated tree green.

**Mutants 10/10** — M1b is the one that counts: with the spelling assertion deleted, reverting to
`cargo check` is still caught, in 203 ms, by a crate that checks 0 and builds 101.

**Two corrections to myself, both worth carrying.** (1) My positive control for the single-instance
detector asked a CHILD to hold a mutex and report on itself — `singletonHeld()` was never called on
a held name, so the "always FREE" mutant SURVIVED. js-suite's own E-2 lesson, broken by the seat
quoting it four tests earlier. (2) **My mutation harness read a crash as a pass** — a mangled
replacement left an unbalanced paren, no `# fail` line was emitted, and my regex scored it 0 = clean.
That is the same two-facts-one-reading shape I was sent to fix, built on the way to fixing it.

**And the keeper stopped me at 01:16: my dialog fixture put a real MessageBox on his desktop, once
per mutation run, eight times.** The probe never launched Consonance — `--gate` refuses while the
singleton is held and I never ran it — but the annoyance was mine either way. Rebuilt the fixture as
`CreateWindowExW` on the same `#32770` class, off-screen, `SW_SHOWNA`: identical fact, 222 ms instead
of seconds, invisible. **The general form: we run inside the program we are building, so a test's
side effects land on a person. The on-screen version was buying nothing.** Probe now off unless
`CONSONANCE_LAUNCH_PROBE=1`, and the default run PRINTS that it was not exercised.

**Not verified, and it is the headline:** nobody has launched the app from a generated tree,
including me. `--gate` is written and unexecuted.

**Hand-back:** `exo_memory/handback/p-first-push-gate_2026-09-06.md`.

## 2026-09-06 · L040 · 58 failures, one seat — and the packet was half wrong about which

**The finding, measured before designing anything:** `grep -o "no live pane matches '[^']*'"` over
the whole 298 MB board returns **`Main` ×51, `MAIN` ×7, `<target>` ×1 and nothing else.** Every
resolution failure the room has ever recorded is the ORCHESTRATOR's seat. `spawn_main` registers
`"M"` (`main.rs:5537`); nobody types `M`. **`LIB` has never failed** — `spawn_librarian` registers
it at `:5486` — so the packet's "red-first on at least MAIN and LIB" would have made me
**manufacture a red**. Wrote the test to assert LIB already works instead. *The board is the right
instrument here for the reason the room keeps rediscovering: it records refusals whether or not
anyone wanted them.*

**The defect one layer up:** `RaisePullArgs.target` is documented *"a pane id or name"*
(`mcp.rs:201`) and enumerates none. The table and the docs have never disagreed because the docs
never said anything — and one caller pasted the literal `<target>`. Meanwhile `term.js:299` has
carried the correct contract in a tooltip the whole time.

**Route (a), by a count:** six call sites reach `resolve_from`, so fixing the label in `mcp.rs`'s
`raise_pull` repairs one and leaves `chair_inject` — the packet-dispatching verb — broken the same
way. New pure module `seat_alias.rs` (mine) + a two-line patch for C, who holds `main.rs`.

**THE ENTRY THAT IS AN ABSENCE, and it is the one to remember:** NATO for M is **MIKE**, and a live
pane is *displayed* MIKE. `RESERVED_SEAT_NAMES` stops a pane REGISTERING "M" because an address
capture routes the chair's traffic silently (E, 2026-08-24) — **a NATO alias would walk that same
capture back in through the front door, looking like tidy completeness.** Two tests exist purely to
keep that hole open. Finish-the-alphabet is the shape of the bug.

**Two traps hit and caught in one lap, both by testing the mechanism instead of reading prose about
it.** (1) I put the `JS-SUITE: EXPECTED-RED` marker inside a block comment — inert against
`/^\s*(\/\/|#)\s*JS-SUITE:/` — which is *exactly* the trap js-suite.js:41-54 records B falling into
on 09-03 and whose docstring was corrected on 09-04. I had read the correction. Found it by running
the runner's own regex. (2) `rustc --test` without `--edition 2021` builds as 2015, inline `{var}`
format captures stop interpolating, and the tests still pass — green over messages that would print
literally.

**Mutants 7/7. SA5 is the one that matters:** a table returning every alias for every input passes
every positive assertion; only "an unknown target gains NOTHING" kills it.

**Not verified, and it is the same sentence as one lap ago:** the unit is proven and the delivery is
not. Nothing has been observed to reach `Main`; that needs a build I do not hold.

**Hand-back:** `exo_memory/handback/p-raise-target_2026-09-06.md`. **Patch for C:**
`exo_memory/loop/patch_resolve_from_L040.md`.

## 2026-09-06 · L040 folds · my headline number was wrong IN KIND, and I published it

**The correction first, because it travelled.** I reported *"58 resolution failures on the board."*
That counted **occurrences of a string in board PROSE** — 41 rows, all of them seats writing ABOUT
the defect: 26 on 08-24 when it was first analysed, 11 today, several of them my own posts. **I
measured the room's conversation about the bug and reported it as the bug**, and the librarian
carried it into the collation (*"E's 58 checks out"*) before I caught it.

**The real instrument was two functions away:** `deliver_pull`'s outcome is board_push'd as
`pane:"gate"` (`main.rs:6534`). Ten gate rows = the complete history of approved pulls. **THREE
keeper-approved hands evaporated** — 08-24 librarian→Main, 09-01 CHARLIE→MAIN, 09-06
librarian→MAIN — every success used a raw pane id or a registered letter. **3 of 10 lost, and every
label-to-Main attempt in the record failed.** Smaller, and actually a measurement. The gate-cards
carry each lost hand's text, so all three are re-queueable verbatim rather than as a count.

**The tell I walked past twice:** my own check for *"the refusal IS the message"* returned **ZERO**,
on the first pass. A zero where you expect the population is the instrument telling you it is
pointed at the wrong universe, and I read it as a parsing quirk and reached for a looser grep
instead. **A grep over prose is not uncurated measurement — it is the room reading itself and
finding itself.** The correct instrument cost me my headline, which is roughly how you can tell it
was the correct one.

**The pair of anchor bugs, and they are one class pointed both ways.** (1) My own assertion
`/^mod seat_alias;$/m` rejected the trailing comment I MYSELF prescribed — the `$` forbade the house
style that every other `mod` line in that block follows. **A found it by RUNNING my prescription
rather than reading it**, and both A and C correctly left my file alone. Had I folded my own patch I
would have typed the line to match my own regex and never learned the regex was wrong — **the
one-seat-one-file rule produced the catch as a side effect**, which is not the ground it is usually
argued on. (2) `every_chair_verb_authenticates`, red since 09-02, counted a TEST FIXTURE STRING
(`mcp.rs:933`, `body_of("async fn chair_inject(")`) as a sixth verb: 6 vs 5. Anchored to declaration
lines → 5 vs 5. **One regex too strict, one too loose, both in guards nobody was watching, and the
loose one reported an unauthenticated actuator path for four days in a target nothing ran.**

**Left open with its name on it:** I anchored `verbs` and not `auths` — the day a fixture quotes
`"self.auth_chair("` the tripwire goes GREEN over a missing gate, the dangerous direction. Written
into the source rather than left to be rediscovered.

**Left RED on purpose:** `every_named_record_file…` — `record/third_place_prehistory_2026-08-30.md`
is named by no card. The test is right and the corpus is wrong; the failure mode to guard is a
later seat clearing the board by deleting the assertion.

`cargo test --bin consonance` 398/0/3 · `arch_test` 11/1 (the deliberate one).
**Still true and I will keep saying it: the unit is proven and the delivery is not.**

**Hand-back:** `exo_memory/handback/p-raise-target-folds_2026-09-06.md`.
