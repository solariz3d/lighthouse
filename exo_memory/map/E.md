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

---

## 2026-09-06 ~05:40 · L041 chunk 1(b) — P-LIB-CHANNEL: the librarian's channel stops needing a click

**Hand-back:** `exo_memory/handback/p-lib-channel_2026-09-06.md`.

Three pieces landed, nothing committed: `call_chair` exempt from the station guard (`mcp.rs`); a
librarian `raise_pull` at the orchestrator delivers with no card and no click; a gate card renders
in the TARGET's tab with the tab saying it holds one.

**THE THING TO CARRY FORWARD, because it is the shape I keep meeting.** The brief's argument for
the exemption was *the inbox already enforces never-into-a-working-seat, so this lock is a second
one on a held door.* True for `call_chair` — and **false for the path I was told to build on.**
`gate_or_queue` had three callers; `deliver_pull` was not one of them, so every approved pull ever
delivered, the keeper's own click included, could splice a working pane. **I was standing on a
guarantee the code did not make.** The fix was to make the guarantee first and take the exemption
second, in that order. *Check the premise you are handed at the call site, not in the sentence.*

**The mutant I chose first was a no-op and that was the finding.** Adding `"call_chair" => None` to
a match that already ends `_ => None` changes nothing: **the exemption is expressed as an ABSENCE**,
so a typo in a verb name in that table silently exempts the verb. The count-test measures a literal
list and would not catch a rename; the wiring test pinning `auth_station("chair_inject")` in the
body is what does. Neither alone. **When a mutant comes back green, ask whether the mutation was
real before you trust the test.**

**Identity, again, one door over.** `raise_pull`'s `from` is caller-supplied
(`from.unwrap_or("unknown")`). Keying the new channel on it would have been `post_board`'s `tag`
defect — *"an attributed name was not evidence of anything"* — twenty lines below the comment that
says so. `PullRequest` gained a mount-written `seat`. **Every time this room adds a privileged
edge, the first draft keys it on a field the caller composes.**

**And my own error, kept where I will read it again:** I backed up and restored `main.rs` WHOLE to
undo a mutant, in a tree C was editing. That is `git add -A` in a different coat — it captures what
it did not name. Posted to C at the time rather than left to be found. **Rule: on a shared checkout,
reverse the edit; never restore the file.**

**The evaporated hands, re-derived:** four approved pulls delivered nothing, and the chair's four
and my earlier three are different sets — mine was the RESOLVER subset (3), the fourth is a
targetless pull from `raise_from_forming` that my resolver fix does not touch and this packet does
not either. Registered, not fixed. Three declared dead with their content on disk; one item of the
09-06 card (*the chair CAN `chair_inject` the librarian*) is still live and unconfirmed.

**The honest residual I priced rather than hid:** the inbox's hold is bounded at 240s and
force-delivers past it, so a chair turn longer than four minutes can still be spliced by a message
the old guard refused outright. That is C's P-READY-SIGNAL. Asserted, not narrated, so replacing
the bound forces someone to restate the price.

`cargo test --bin consonance` 423/0/3 · `arch_test` 11/1 (the same deliberate red — the unnamed
`record/` file; still not to be cleared by deleting the assertion) · `js-suite` 77 discovered, 2
failed (both pre-existing, neither mine).

**Still true, and the bar is one observation away, not met:** THE UNIT IS PROVEN AND THE DELIVERY IS
NOT. One librarian send landing with no click and no refusal, after the rebuild, is the only thing
that discharges this.

---

## 2026-09-06 ~07:10 · L041 return leg — P-DYAD-GATE: the last ungated write, and the oracle blind to it

**Hand-back:** `exo_memory/handback/p-dyad-gate_2026-09-06.md`.

`fn dyad_spot` wrote ~2,000 characters into a partner pane with no `gate_or_queue` — live behind a
button. Gated. One line. **The line is not the finding.**

**THE FINDING, and it is about me: my test was green over it because it iterated four hand-written
names — and I wrote that list an hour earlier, in the packet where I found the same class.** I found
`deliver_pull` bypassing the gate, then built an oracle that enumerated the instances I had just been
looking at. **A list-driven test cannot fail on the site nobody listed, which is the only site that
was ever going to be wrong.** A found it (`p-chunk1-attack_2026-09-06.md`) and named the reason.

**Worse, and this is the part to carry:** it is my OWN `mutant-7a` finding from that same packet —
*a property expressed as an ABSENCE cannot fail on the case nobody named* — which I wrote onto this
map, about other people's tests, while the same shape sat in the test I was writing. **Noticing a
class does not immunise the next thing you build. The transfer has to be deliberate.** Second
sighting in one night, two feet apart, not made.

**And a third instance of the same lineage, arriving on schedule:** the rewrite had to skip
`#[cfg(test)]` modules or every fixture string quoting `inject_to_pane(` counts as a call site —
**the exact hazard I left open in `every_chair_verb_authenticates` and wrote up here as a warning.**
It came back in the very next instrument I built. Handled this time.

**The rewrite:** derive the universe from the source (column-0 `fn` walk, test modules skipped),
require `gate_or_queue` in every enclosing fn, **named allowlist** for deliberate exceptions
(`inject_to_pane` itself; `drain_inboxes`, where asking the gate is a loop that never delivers).
Known sites kept as a FLOOR — *not* the old list returning: a floor says *at least these* while the
universe stays derived; the old list WAS the universe. That is the difference between a positive
control and a blind spot.

**My first walk was wrong and failed loudly**, which is the good direction: I counted braces to find
a test module's end, and braces inside string literals (`format!("{f}")`, JSON fixtures) closed it
early, so the test reported `fn main` writing into a pane. Fixed with a column-0 `}` boundary.
**Do not count what strings can contain.**

Mutants: un-gate `dyad_spot` → RED; **add a seventh call site in a new fn → RED** (the property the
old test structurally could not hold); drop `drain_inboxes` from the allowlist → RED.

`cargo` 436/0/3 · `arch_test` 11/1 (the same deliberate red) · `js-suite` 75 green / 2 failed of 77.
**For B, since the evidence moved while I held the instrument:** `corpus-age.test.js` PASSED here
minutes after A measured 142.9 s against a 120 s bound — **the red is intermittent AT the bound,
which is worse than stable, because the next green normalises it and the owner assignment lapses.**

**Not established, and I said so:** no dyad was paired and no spot was fired — the change is
unit-verified and the button is untested end to end. And the honest generalisation is not *write
better tests*: **an enumeration written by the person who just fixed the examples will enumerate the
examples.** The second reader is the only thing that reliably catches that. A found the instance; I
found the class; neither half was enough.

---

## 2026-09-07 ~02:40 · L039 v2 — P-SEED-PLANT: I authored the object instead of finding one, and the guard handed back the key

**Hand-back:** `exo_memory/handback/p-seed-plant-v2_2026-09-07.md`. 24 plants, 7 covered / 17 not,
6 natural partitioned beside them. Key at `exo_memory/loop/seeded_key_L039.md`, uncommitted — the
chair commits by path. **Nothing here names a planted item; the next waking of me is not a subject
but may be scoring, so this stays clean on purpose.**

**THE DECISION TO CARRY: when the leak channel is the diff, author the object — do not excavate it.**
B's freeze pass proved you cannot plant into an existing file without `git log -p` becoming a second
answer key, and proposed a worktree plus a history-free copy. **A file that never existed clean is
strictly better than a copy: there is no differential to read at all.** Untracked, there is no diff.
It also turned "unread by all three" from a weak grep into a certainty, and kept 24 falsehoods out of
the committed record. The price is real and I paid it out loud — I set the difficulty, and the
natural-defect pool is only what the author failed to notice (six, hunted afterwards).

**THE THING I DID NOT SEE COMING, and it is the generalisable one: a guard republished the sealed
material.** The first key quoted the two withdrawn wordings it had planted. `carrier-drift.js` scans
the whole corpus, found **the key**, and printed its surrounding text — plant labels included — in
its excerpt window. **A subject running that instrument on the object would have been handed the
answer key by the tool.** Git is not the only republisher. **Rule: sealed material must be stored in
a form the room's own scanners do not surface** — refer by registry id and location, quote nothing.

**And the class-split correction, which is the same shape I keep meeting.** B objected that the
planter picks the class by typography. Checked instead of argued: surveyed **all 47 non-test
instruments**, and `cite-check.js` is the only one that takes an arbitrary `.md` and checks its
content. `portable-paths` cannot see `exo_memory/` by scope; `librarian-cite` reads only the
librarian's notes. So two of the packet's four canonical D1 examples — a dangling path, a wrong sha —
are **not covered at all**, and the 7/17 ratio is a measurement of the room's reach, not a choice I
made. **Balancing it would have been the typography trick, performed to make the table look even.**

**Found by accident, in a shipped guard, and it is not part of the experiment:** `cite-check.js:72`
sets `inCode = inFence || /^\s{4,}/.test(line)` and drops every figure on an indented line — so a
wrong figure indented four spaces, with a correct-looking command beside it, verifies **GREEN**
against an empty figure list. This room sets figures in indented blocks by convention. I hit it only
because two plants came back green and I did not believe them. **When a mutant comes back green, ask
whether the mutation was real before you trust the test** — my own line from 09-06, and this time it
was the instrument that was wrong, not the mutation.

**Handed back unmet, deliberately:** difficulty. Whether 24 plants sit where three readers can
engage is not something the planter can settle, and the packet said I did not have to settle it
alone. I did not manufacture a judgement to close the row.

---

## 2026-09-07 ~05:30 · L043 · P-HARVESTER LEG 2 — the tolerant half of a mutex was the other half of the bug

**Hand-back:** `exo_memory/handback/p-harvester-leg2_2026-09-07.md`.
**Patch for C:** `exo_memory/loop/patch_harvester_leg2_L043.md`. **Module (mine):**
`consonance/src-tauri/src/harvest_guard.rs` — 17 tests, 4 mutants applied, 4 caught, 0 survivors.
`main.rs` not touched; nothing committed.

**THE CORRECTION TO CARRY, and it is to my own five-day-old diagnosis.** I found `main.rs:1071`
`Err(_) => break` in the watcher against `:1038`'s tolerant reader and called it *one mutex, two
policies* — correct, and I named the wrong half as the defect. **The reader's `if let Ok` is not the
safe policy; it is the other half of the same bug.** On a poisoned lock it declines to feed the
emulator *permanently*. So fixing only the watcher buys a thread that locks fine, harvests a frozen
screen, dedups it to nothing, and reports a healthy attempt clock forever — **the same dead `.txt`
with a green light on it.** When one mutex has two policies, do not ask which one is right; both
sides need the same one or neither is fixed.

**THE FAILURE THAT ONLY EXISTS WHEN THE FIXES COMPOSE.** Item 1 (recover) plus item 2
(`catch_unwind`) is a permanent panic loop if the panic is deterministic — catching and continuing
at a 250 ms poll burns a core forever, writing to a stderr that goes to no file. **Recovering
harder made it worse.** So recovery is bounded: three consecutive panics rebuilds the parser once,
one success in between clears the count. That is the packet's *"recover but re-initialise"* arriving
from the failure mode rather than from the hint — **and I would not have seen it by evaluating
either item alone. Compose the fixes before believing either.**

**Placement, decided on the failure mode rather than on tidiness:** the harvest stamp stays OUT of
`data/ready/`. That file is written by the hooks in the pane's own process; the harvest stamp is
written by the app's watcher thread. **A shared file's freshness would be maintained by whichever
writer survived — a dead watcher plus live hooks reads as healthy.** That is the 09-02 bug rebuilt
inside the detector, exactly like stamping on write instead of on attempt, one level up. **Join at
the reader, never at the file.**

**And the thing I built because the evidence expired:** the separating observation — *poisoned
mutex, or panic in the body?* — was never taken and is gone, and the app's stderr goes to no file.
I cannot recover it and I did not guess. So `guarded` carries the panic MESSAGE out into the stamp.
**When you cannot answer the question, make the next occurrence answer it** — that is cheaper than
a diagnosis and it does not expire.

**Named NOT APPLIED, because "shape compiles" must not read as "compiles":** the patch was compiled
verbatim against stub types (proving the borrow/unwind structure and that one `AssertUnwindSafe`
covers the `&mut last` capture), **not inside the crate** — there is no `target/` on this machine
and a cold Tauri build did not fit the lap. Mutants 1 and 2 were applied to my policy module, not to
the watcher; at `main.rs` level they are NOT APPLIED and only C's fold applies them. The stall is
not fixed and I did not say it was — the relaunch falsifier is the keeper's hand.

---

## 2026-09-08 ~02:1x · L044 · P-RAISED-AND-LOST — the outcome was computed, returned, and thrown away in one line

**Hand-back:** `exo_memory/handback/p-raised-and-lost_2026-09-08.md`. **Patch (do NOT fold before
tonight's rebuild + proof 1):** `exo_memory/loop/patch_targetless_pull_L044.md`. **Test on disk,
mine:** `consonance/tools/targetless-pull.test.js`, declared EXPECTED-RED, 3 pass / 4 red.

**THE FINDING TO CARRY, and it is the cheapest repair I have ever found here.** Four of the
keeper's approvals "evaporated" — and the outcome was never missing. `gate_decide` **returns** the
exact string `deliver_pull` produced, across the IPC boundary, into the UI. `term.js:153-154` does
`.then(() => setStatus('approved pull from ' + c.from))` — **a callback that takes no argument and
discards the value**, then prints a locally-composed sentence asserting success. So the keeper's
screen said *approved* four times while the board said *no live pane matches*. **The system was not
silent; it was shouting into a `.then` that dropped the parameter.** Look for the discarded return
value before designing the new ledger.

**And the class generalises past this bug: an outcome computed, returned, and dropped at the last
hop has the same footprint as one never computed — worse, because the UI asserts success in its
place.** That is my 09-02 footprint sentence with an aggravating factor I had not met.

**RULING on the targetless pull: LEGITIMATE, and the collapse is one layer above where it was
pointed.** Not `raise_from_forming`'s `String::new()` — that is a second producer. It is
`target: target.unwrap_or_default()` in `mcp.rs`. **`Option<String>` already carried the
distinction** (`None` = omitted on purpose, `Some("")` = an address slot left blank) **and
`unwrap_or_default()` throws it away. The type knew; the call forgot.** When two facts share a
value, look for the combinator that erased the one that had them apart.

**I read `WORLD-MOVED` as a HEAD-changed proxy and was about to publish that. It is a second blind
run at the claim-time tree** (`second-vantage.js:278`, `moved = then.verdict !== 'DISAGREE'`). The
instrument is better than the packet credited and better than I credited. **The real overload is
narrower and is our own class:** `:274` gives the same status to a row verified-true-when-said and
one whose claim-time tree could not be built. **Check how a field is COMPUTED before ruling on what
it fails to distinguish** — I nearly indicted the tool for the summary's sin.

**And the packet's premise was checkable and false: 12 of the 18 were surfaced, 0 withheld**
(`return_ledger.jsonl`, intersected with the ledger). The 12 are exactly the SURFACE rows, which is
the design working. **The gap is one hop further along than "nobody read it": delivery has a
receipt; disposition has none.** So I ruled a `read` boolean OUT — it restates a ledger we already
have and is tickable — and ruled IN a disposition that cannot be written without an external
referent (`fixed: <sha>` / `withdrawn: <path>`), because each is checkable by a second reader in one
command and a boolean has no second reader.

**MY OWN LINE-NUMBER FINDING CAME BACK A THIRD TIME, AND THE READER'S CORRECTIONS HAD ALREADY
ROTTED.** The vantage cell reported LIB at 6478 and `seat_alias::candidates` at 7179 on 09-07; at
HEAD they are **6490 and 7191**, moved again within a day. **So the repair is never a better line
number — it is citing the symbol.** Live carriers: `map/C.md:175` (README 92→78; it is 87),
`map/A.md:597` + `handback/p-guard-perlap:243` (6137), and **`consonance/tools/raise-target.test.js`,
a SHIPPED file, carrying 5486 and 5537 in its header.** A map file is re-read at every waking of its
pane, which is what makes a stale figure there different in kind from a stale one in a transcript.

**Unasked, and the one I'd want told to me: the vantage ledger ingested L039's sealed material and
the hook surfaces such rows into panes with no human choosing.** Row `f50dfa20` names plant D1-03
*with its correction*. **Bounded honestly: it returned to the pane that authored it, and the key is
now tracked anyway — hazard demonstrated, cross-subject leak NOT.** Same class as my 09-07 catch
(`carrier-drift.js` printing plant labels), different instrument, and **my rule was written for
files while this reader ingests transcripts.** Whoever runs the next sealed experiment owns this
before they run it.

**Positive control earned its keep:** my source-walk matched `pub struct PullRequest {` — the
definition — and the floor test went red. The 09-06 oracle that had no floor is exactly why I wrote
one. **11/11 rustc, 6/6 mutants caught, 0 survivors** — and the case-folding mutant SURVIVED the
first suite, which is where the exact-match test came from.

**Did not verify:** nothing compiled inside the crate, no pull raised, no card rendered; I did not
re-run the vantage reader; I did not open the 19 non-clean DISAGREE rows, and nobody has ever scored
that contamination filter. **Nothing committed; `main.rs` untouched.**

---

## 2026-09-08 ~05:0x · L045 · P-SEED-PLANT-V3 — I sealed a prediction that can lose, and kept this line clean on purpose

**Hand-back:** `exo_memory/handback/p-seed-plant-v3_2026-09-08.md`. **I planted; I did not read.**

**NO SPECIFICS HERE, DELIBERATELY.** `map/[A-Z].md` is on the forbidden list — and that list was
incomplete last run and a reader leaked through `handback/` and `map/`. **A rule that already failed
once is not a place to store the answer.** The object, the key and the design are in the hand-back
and the sealed key; this line carries only what survives a leak.

**THE MOVE THAT MADE N REACHABLE WITHOUT AN ABSURD OBJECT: pick a subject with a real un-audited
surface, and let the plants ride on work the document was going to do anyway.** §13 offered refusal
if the count forced a document nobody would write. It did not, and the reason generalises — **a
census of something genuinely uncounted carries dense cited figures and dense line citations
naturally**, so a hard plant looks like an ordinary sentence. An object is unnatural when the
defects are bolted on; it is natural when they are load-bearing.

**AND THE HARDEST CLASS I FOUND IS THE ONE WHERE THE NUMBER IS RIGHT.** A correct figure, correctly
summed, attached to a sentence the command's *output shape* cannot support — or to an inference the
cited line refutes. **Nothing looks wrong, because nothing in the arithmetic is wrong.** Last run I
made things false; this run the sharpest plants are things that are *true and mean something else*.
Whether that is actually harder is the measurement, not my claim.

**I registered, sealed, the plants I predict ZERO readers find and the ones I predict ALL THREE
find.** That is the half that can lose. My v2 §5 said the object might be too easy and was right but
unfalsifiably — a worry is not a prediction. **A worry costs nothing; a named list costs something.**

**Two things I refused to do quietly.** (1) §8 says reuse the brief verbatim and §5 says amend its
forbidden list — **those cannot both hold**, so I named the conflict, recommended §5, and left the
brief untouched because it is not mine. (2) The columning bar could not go green without acting on
a *previous* lap's residue; **my own files added zero to the count**, so I met the bar for what I
own, named the two ways to close the rest, and took neither. **A bar met by touching someone else's
file is not met.**

**The operational risk I would most want the scorer told: the audited directory must be frozen
during the read.** Ground truth is static. If a pane edits it mid-run, readers get scored against a
stale key and it will look like reader error rather than drift.

**Did not verify:** that the object is hard — that is the open question and my estimate is sealed
rather than asserted; the object against a running app; and the object for defects I did not
intend, which are the secondary statistic's raw material and are **not mine to adjudicate**, since
the planter cannot be the authority on whether an addition is real. Nothing committed.

---

## 2026-09-08 ~06:1x · L046 · P-VANTAGE-TWO-REGS — the matcher I was asked to build was green over the row it was built for

**Hand-back:** `exo_memory/handback/p-vantage-two-regs_2026-09-08.md`. Two registrations in
`loop/registration_{vantage_disposition,sealed_material}_2026-09-08.md`; modules + tests
`consonance/tools/vantage-{disposition,sealed-scope}.js`. **Wired to nothing.** 22 cases, 11 mutants,
11 caught, 0 survivors.

**THE ONE TO CARRY: I measured the object before building the tool for it, and the spec dissolved.**
The packet's red-first said *a row carrying a plant label and its value must be skipped*. The actual
leaked row carries the **value and no label** — no `D1-03`, no "plant", "seed", "key" or run id.
**So a label matcher is green over the exact row it exists for.** That is my 09-06 blind spot (an
oracle that can only fail on cases someone listed) and my L044 sentence (a property expressed as an
absence cannot fail on the case nobody named), **arriving a third time inside the fix for the second
one.** The class does not stop recurring because I named it. **Measure the thing before you build the
detector for it** — the spec came from a memory of the row, not the row.

**AND THE REPAIR THAT WOULD HAVE WORKED IS WORSE THAN THE DISEASE.** To catch it by content the
scanner must compare against the key. **A scanner that holds the answers so as not to print them is
a bigger leak than the one it prevents.** Refused that half out loud rather than shipping a matcher
that looks like a control. **When the only sufficient detector must contain the secret, the detector
is the wrong layer.**

**What replaced it: match on SOURCE, never content.** A row knows its pane and turn timestamp
without knowing what it says; the RUN declares which panes are sealed and when, and the scanner
reads that. **It cannot go stale against a run it has never heard of, because the run writes the
entry** — which beats both options I was offered (a static list, or the live forbidden surface: the
first is what failed in L039, and the second cannot see a row that references no forbidden path).
Fail-open on a missing registry, loudly, because fail-closed silences the room's only uncurated
instrument whenever a file goes missing.

**I CORRECTED MY OWN L044 ALARM DOWNWARD.** `findings-return.js:46` surfaces to the originating pane
ONLY — so the same-pane return I observed was **by construction, not luck**, and a cross-subject
leak through that hook is structurally impossible. **The mechanism was stronger than I gave it
credit for.** But the correction found something larger than the thing I was asked to fix:
**`C:\Consonance\data\` is on NO brief's forbidden list**, so a subject can read the entire findings
ledger without violating anything. **A brief edit, cheaper than everything I built this lap, and not
mine to make.** The controls this room has all govern files; the hole was a file all along.

**On the disposition field: the expiry is the part that does the work.** `declared-dead` with only a
reason is refused; with `expires` it **reverts to OPEN when the date passes**, which turns *dead*
from an assertion into a claim with a shelf life that re-surfaces if nobody renews it. **A flag
nobody revisits is the boolean I refused, with a longer name.** Honest limit stated in the
registration: a real sha can sit beside a false claim; this moves the failure from unfalsifiable to
falsifiable, which is the most the mechanism can do.

**Did not verify:** nothing is wired, so nothing ran end to end — every fixture is a literal and the
validator has never met `git`. Mutants are of my modules, **NOT APPLIED at the cell level**. The
suite went 77 green / 2 failed (of 80) → 80 green / 1 failed (of 82); **the third green is A's
carrier-drift, not mine, and I did not claim it.** Nothing committed.

---

## 2026-09-08 ~07:2x · L047 · P-TWO-MAP — the falsifier fired, and the repair was in the criterion, not the clock

**Hand-back:** `essay/TWO_MAP_2026-09-08.md`. Source `essay/sim/two_map.py`, output
`essay/sim/out/` (run.log, results.json, 9 figures). `py essay/sim/two_map.py --part all`.
Nothing committed. **I wrote none of the essay's prose** and did not read A's parallel item.

**THE RESULT: the outcome the briefing seat said it would least like.** Self-error at equilibrium
does NOT come from lag. It cannot, and the reason is one line rather than a sweep: **the learning
rate and the delay do not appear in the fixed-point equation.** `r* = g(f(r*))` — set the bias to
zero and that is `r* = f(r*) = x*`, whatever the timing. Max |r*−x*| over all 201 fixed points of
121 gains: **2.776e-17**. Over 287 settled integrations spanning six learning rates and eight
delays: **2.105e-15**. And the bias arm is sharper than "it needs a bias" — **the equilibrium
error EQUALS the bias exactly, deviation 5.551e-17, independent of gain.**

**THE ONE TO CARRY: I built the sweep, and then the sweep was not what answered the question — an
identity was.** Four routes to error-without-bias, and I closed each by measurement: no-fixed-point
(**0 of 9801 cells** — Brouwer forbids it, which is *the theorem the essay imports*), instability
(**0 of 6300** positive-gain cells destabilise under any lag), lock-in-plus-error (**0 of 847**),
noise-times-curvature (**within 1.04 SE of zero over 12 seeds**). **Sweeping was how I found out
that sweeping was the wrong instrument.** The zeros are all one algebraic fact wearing four
costumes. Next time: try to derive the fixed-point condition before building the grid — if a
parameter is absent from it, no resolution of the grid will ever show it doing anything.

**AND THE BUG THAT WOULD HAVE SHIPPED AS A HEADLINE.** My stability routine built the
characteristic polynomial by assigning `coeffs[1]` and `coeffs[-1]`. **At d=0 those are the same
slot**, so `(1−α)` was silently overwritten and *every d=0 verdict in part 3 was wrong* — it
reported thresholds of ±2.5 where the true answer is "never destabilises". I caught it by
hand-computing one printed row, not by reading the code. **A length-2 array made two distinct
indices collide; the code was not wrong-looking anywhere.** The fix is `+=`; the guard is a
part 0 that checks the routine against closed forms I derived separately (`[0.1]` now 0.000e+00).
**Write the check that compares the instrument to arithmetic done outside it, before quoting it.**

**I RETIRED MY OWN FINDING TWICE IN ONE LAP, WHICH IS WHY I WAS GIVEN IT.** (1) Part 4 first
reported *3 of 847* cells with lock-in AND error, and I had a figure captioned "locked in one
basin, permanently wrong". All three sat at Gmax=1.00 exactly — the marginal point where λ=1 and
convergence is algebraic — and the residual fell 1.2e-06 → 6.3e-09 as T went 30000 → 1000000.
**Transients, not findings. 0 of 847.** Part 4 now runs that survival test itself rather than
leaving the correction to a later section. (2) The "unsigned not signed" claim rested on 5.09e-03;
widening the averaging window took it to **−1.099e-05** while the unsigned held at 0.8527. **A
number that shrinks with your window was never a finding about the system.**

**THE NUMBER THAT COSTS THE ESSAY MOST IS NOT THE ONE I WAS ASKED FOR.** Give the informant the
self's own lag and `max|r_t − o_t|` over the whole gain grid is **2.220e-16** — identical filter,
identical sequence, identical trajectory. **In the specified model the entire self–informant
asymmetry is lag DIFFERENCE and gain contributes nothing.** Over positive gain the self/informant
ratio correlates with gain at **−0.835**: higher gain makes the self relatively BETTER, because a
strong loop drags the fact toward the belief. That is the opposite sign to the claim the model was
built to support, and it was not in the brief's falsifier.

**WHAT WORKED, LABELLED AS AN EXTENSION RATHER THAN SUBSTITUTED.** The brief's own premise says the
informant reads the fact "in contexts where r was not an input" — **and the specified model
contains no such context**, which is *why* it returns zeros: one criterion, two readers, nothing to
disagree about but timing. Adding a second criterion (capacity `c = f(0.5,a)` vs realised behaviour
`x`) gives equilibrium self-error **0.000e+00 at zero gain, monotone to 0.268 at gain 3, with no
lag and no bias anywhere**; an informant carrying the *self's own* lag beats it by **1.00 → 13.47**
across the range. **The missing premise was never about the clock. It was about which fact is being
scored** — and the referee's own report poses that fork and never notices it is the answer.

**Did not verify:** continuous-time / distributed-lag, **named as the most likely place the
headline negative is wrong** and not run; |Gmax| beyond 3 (spot-checked only) and d beyond 20 (not
at all); a second independent implementation — part 0 checks my code against closed forms I derived
myself, so a formulation error would pass both. The Gmax=0.5 hysteresis row is an artifact of a
jump-detector with no no-jump verdict; **flagged in the hand-back rather than deleted or fixed.**

---

## 2026-09-09 ~00:4x · L049 · P-LIVE-HOST — I took the clock out of the decision instead of trying to fix it

**Hand-back:** `exo_memory/handback/p-live-host_2026-09-09.md`. Design
`loop/design_live_host_2026-09-09.md`; module + tests `consonance/tools/live-host.{js,test.js}`.
**Wired to nothing.** 25 cases, 15 mutants, 15 caught, 0 survivors. Nothing committed.

**THE PACKET OFFERED ME A REFUSAL AND THE REFUSAL WAS RIGHT ABOUT THE WRONG THING.** *"One live host
cannot be enforced without a shared clock"* is true of **heartbeat comparisons** and false of the
problem: mutual exclusion needs **one point both machines reach, not one clock both agree on**. The
git remote is that point — an **orphan commit** pushed to a lock ref makes every push to an existing
ref non-fast-forward, so acquire is create-only and breaking is a CAS against exactly the sha
observed. `ls-remote` then returns the heartbeat token in one round trip, so **watching the lease IS
watching the heartbeat**, clock-free. **When a permission-to-refuse names a mechanism, check whether
the mechanism is load-bearing before you spend the permission.**

**AND THE SAME CLASS AGAIN, FOURTH SIGHTING, CAUGHT THIS TIME BEFORE IT SHIPPED.** I hardened the
heartbeat and left `state: CLOSED` untouched — and CLOSED is **exactly as stale-able**. A closes and
pushes; A relaunches and the push fails; B pulls, reads CLOSED, starts. **Two live hosts and no clock
anywhere in that story.** My first pass returned PROCEED on a foreign lease over a CLOSED file: the
precise double-live the lap exists to prevent. L044 was *an absence cannot fail on the case nobody
named*; L046 was *measure the object before building the detector*; this is **hardening the obvious
surface while its twin sits beside it untouched.** The class does not stop recurring. What changed is
only that the case table came before the tests. **Enumerate the states before writing the guard.**

**THE FAILURE-DIRECTION RULING: it fails toward letting the keeper IN — never silently, never
without a record.** Not softness. **Recoverability is the axis, not size:** a double-live on an
append-only git set is a *divergence* (both commits exist, a sort settles it); a lockout is not
recoverable *by the person it happens to*. `claim_named_singleton` at `main.rs:5443` already fails
open one function away, with its reason written down. And the fourth reason is the one I keep
arriving at from different directions: **a guard that hard-refuses records zero double-lives whether
it works or not** — indistinguishable from a guard nobody triggered. Same shape as L046's refused
scanner. **An instrument that can only be right is not an instrument.**

**AND I SPLIT THE FALSIFIER RATHER THAN LETTING MYSELF NARROW IT.** Always-overridable means F1
*can* fire, so I kept F1 verbatim as the headline and added **F2: two hosts live with no `forced`
row** — the silent failure, which is worse. Saying plainly what the design does NOT deliver ("one
live host as a hard property") is what let the weaker version be honest instead of quiet.

**THE NUMBER IS A FUNCTION AND IT DECLARES ITSELF UNMEASURED.** `staleAfterMs = publish × 3 +
margin` = 480 000 ms. The 3 is geometric-false-positive vs linear-delay, leaning long because early
costs a double-live and late costs one dialog. **`publishMs` is a guess nobody has timed, and
`policy().publishMsMeasured === false` is asserted by a test** — a number nobody has timed should say
so in its own output, not in a comment someone has to go and read.

**Did not verify:** nothing wired; **the GitHub custom-ref push is unverified and the whole
enforcement layer rests on it**; no end-to-end double-live attempted, so **F1 has never had a chance
to fire**; mutants are of my own module, not cell-level. **I refused to quote a before-count for the
suite** — I truncated my own baseline with `tail -25` and threw the summary away, and a "was 80, now
81" would have been hand-made. Named the three pre-existing reds instead.

---

## 2026-09-09 ~02:0x · L050 · P-RETURN-LEG — I proved the gate I was asked for was unbuildable, then built the one that is

**Hand-back:** `exo_memory/handback/p-return-leg_2026-09-09.md`. Code + 10 tests in
`consonance/src-tauri/src/mcp.rs`. cargo 479/1/4 (the 1 is C's `offset_tests` EXPECTED-RED);
9 mutants, 9 caught, 0 survived. Nothing committed.

**THE RULE AS WRITTEN CANNOT EXIST, AND THE PROOF IS THREE LINES OF THE STATION TABLE.**
`chair_inject` needs holder `chair`; `call_librarian` needs holder `panes`. With one open lap those
are exclusive — so **every** chair_inject happens while its target cannot answer, and the correct
fan-out and the trapping follow-up are **the same ledger state at the instant of the call.** A
pre-condition cannot separate identical states. And requiring a `--holder panes` row *first*
inverts lap-row.js's own "ring first, row second", whose gate needs a chair→pane delivery in the
possession — the very call being refused. **It deadlocks exactly where it fires**, firing a
falsifier a sibling registered on 09-03. **When a packet names both a rule and its site, check
whether the rule can exist before choosing between sites.**

**AND NEITHER COULD THE OTHER SITE.** The relocation offer (lap-row.js) fails because the failure
was the *absence of a row*: the chair ran no command at all for 29 minutes, so a gate inside that
writer sits silent through the whole event. **My L044 sentence on a third surface — a property
expressed as an absence cannot fail on the case nobody named.**

**SO I MOVED THE ENFORCEMENT TO THE FIRST MOMENT THE TRAP IS DISCRIMINABLE** — the pane's refused
hand-back. Two marks (RUNG on a successful inject, OWED on a refused hand-back), each read only
against **the baton's last move**, never a clock. **The marks clear themselves when the recovery row
lands: the thing that fixes the state is the thing that erases the flag.** Same move as the
live-host lease — take time out of the decision instead of picking a better number for it.

**THE THING I FOUND THAT NOBODY ASKED FOR: the trapped pane always had a legal exit and was never
told.** `--by` equal to `--holder` is a RETAKE, allowed with no ring, so a pane can always take the
baton and then hand back. That command was printed **on the board line** — the one place a pane
waiting on a tool result is not reading. **Naming a recovery where the stuck party cannot see it is
not naming it.** And the old refusal told every pane "the loop comes back to you", which in the trap
is simply FALSE; A obeyed it for 29 minutes.

**I DROPPED THE INTERRUPT CARVE-OUT RATHER THAN INHERIT IT.** A self-declared `interrupt: true` is
`--by`'s self-report with the incentives reversed: `--by` costs you nothing to be honest about,
an interrupt flag **buys standing**, and the caller under pressure is exactly who reaches for it.
Nothing is lost in the ordinary case (the gate fires only on an owed hand-back); what IS lost is one
printed command's delay in the one state where it fires, and that debt is the chair's own.

**THE ONE TO CARRY, AND IT IS ABOUT MY OWN INSTRUMENT.** My first mutant run reported all nine as
*"did not compile"* — including `>=`→`>`. `cargo test` prints `error: test failed` **for a red
test**, so my classifier could not tell *the build never ran* from *the tests ran and failed*, and
it reported the wrong one nine times, uniformly, looking fine. **Done-vs-never-started inside the
harness built to check the fix for done-vs-never-started, one hour after I wrote that section.**
js-suite.js already owns the repair — *the summary line is the evidence* — and I now require a
`test result:` line before reading a count, with an UNKNOWN bucket for neither. **I caught it because
the result was too uniform to be true, not because anything checked it. Build the classifier's third
arm first; a two-arm classifier will invent the missing one.**

**Did not verify:** nothing ran end to end, no live pane trapped and rescued, no rebuild. **The
pane's retake is read out of lap-row.js, not executed** — if it is refused in practice my second
recovery line is worse than useless, and that is the first thing to check. Marks are per-process
and forgotten on restart (fails toward allow). The RUNG mark is not matched to the caller — a
widening I named rather than resolved, because matching a pane-id prefix is a guess. Cargo delta was
+11 for my 10; **the eleventh is another pane's landing in the shared tree, and I reported the
arithmetic rather than the number I wanted.**

**ADDENDUM, ~02:0x — the chair corrected its own packet and both of its premises were wrong, in
opposite directions, from one table.** The station guard is neither stage-aware nor stage-blind: it
is **HOLDER-based**, and stage never enters it. The ledger settles it — L049 `return-leg` holds at
`holder=chair`, so the chair is not refused there, **it is the only seat that may speak there**,
which is exactly how the trap was made. Neither premise was checkable from `required_station`; the
stage-to-holder mapping exists only in `lap.jsonl`. **When a table is quoted at you, read the rows
it produced, not the table.**

**AND THE HOLE FIRED WHILE I WAS RULING ON IT.** The chair re-took the baton to send me the
correction; C's hand-back landed 26 seconds into that 41-second window and was refused. `01:51:57`
chair refused → `01:52:17` retake → **`01:52:43` C refused** → `01:52:58` handed back. C got the old
"the loop comes back to you" and this time it did, fifteen seconds later — **C was lucky, not safe.**
The invariant nobody had: **moving the baton TO panes never traps; moving it AWAY from panes is the
only trapping move there is.**

**WHICH PARTLY CORRECTS MY OWN §2.** I ruled `lap-row.js` could not hold the invariant because the
failure was an *absent* row. True of A's case, false as a general claim: **C's trap was created BY A
ROW**, which lap-row.js wrote and could have seen. Two variants, two homes, and I collapsed them
into one ruling. **Check whether the class you just proved impossible has a second instance with a
different shape.**

**On the mutant charge: the reported run did compile — but my evidence was one arm short and the
chair was right to push.** 9-of-9-caught is also what a harness that prints CAUGHT unconditionally
returns. Added controls: a comment-only mutant and a prose mutant that must **SURVIVE**, and a bogus
anchor that must **SKIP** — 3 ok, 0 bad. **A mutant harness needs a mutant that must survive, in the
same run, or its own output is unfalsifiable.** And the legibility failure was mine: I put "the
mistake inside my instrument" in §7, after the results in §6, so a discarded run read as the
reported one. **A correction goes beside the number it corrects, never in a later section.**

portable-paths closed: `--update`, 171→176 sites, **+5 and nothing else** (every other verdict class
identical to the count; `git diff` shows five `identityHazard` lines in live-host.test.js). Checked
rather than assumed, because `--update` rewrites from the whole tree and four panes were editing it.
Cargo re-run after both harnesses restored: 479/1/4, the 1 still C's `offset_tests`.

## 2026-09-09 ~04:5x · L052 · P-LIVE-MIRROR — the lease clears the bound, the state mirror does not, and I took half the refusal

**Hand-back:** `exo_memory/handback/p-live-mirror_2026-09-09.md`. `live-host.js` +220 (the seat
dimension), test 25→39; `live-follow.js` and `live-mirror-stop.js` + its test (8) new; one additive
line in `dev/shell/install.ps1`. **Nothing committed.**

**THE OBJECTIVE HAD TWO HALVES AND THEY GET DIFFERENT ANSWERS, WHICH IS WHY "DID IT WORK" WAS THE
WRONG QUESTION.** Lease round trip **2 800 ms** — clears the keeper's 5 s with 2.2 s of poll budget.
State round trip **4 760 ms at a ZERO poll interval**, largest poll that still fits **240 ms** — so
*never two drivers* is delivered and *see it on the other machine* is not. **Refuse the half that
fails and ship the half that works; a single verdict over a two-part objective would have been
wrong either way it went.**

**PROBE BEFORE BUILD, AND IT PAID TWICE.** `refs/consonance/live/<seat>` pushes to GitHub — no
branch fallback taken. And `--force-with-lease` with an explicit expect works **with no
remote-tracking ref**, which was the one doubt the whole enforcement layer rested on. **The design
had it listed as UNVERIFIED and the packet made me check; it would have been the load-bearing
assumption nobody tested.**

**THE INVARIANT I ALREADY OWNED, NOW ACROSS A NETWORK — and it undercut a premise of my own earlier
ruling.** L050: moving the baton away is the only trapping move. L049's failure-direction ruling
licensed failing open *because divergence is recoverable* — append-only sets merge by
concatenate-and-sort. **THE TAILS ARE REWRITTEN AND HAVE NO MERGE.** So the premise does not hold
where it matters, and acquiring a LIVE seat is a **REQUEST honoured at the holder's next turn
boundary**, not a break — waiting on an EVENT, not a duration. Forced take stays available, names
the turn it orphans **before the click**, and the evicted holder **finishes its turn and refuses to
publish**. **Check whether the premise that licensed a ruling still holds on the new surface.**

**F1 FINALLY FIRED.** The L049 design's largest gap was *no end-to-end double-live has been
attempted*. Two clones, the real remote, **15/15** — including the one worth having: **the displaced
holder learns of its eviction from nothing but its own failed heartbeat.** No message, no timeout,
no clock. Designed on paper in L049, never run until tonight.

**THE MISTAKE, AND IT IS L050'S OWN LESSON FOUR MORE TIMES IN ONE SESSION.** `| tail` made `$?`
report exit=0 on a refused push. The SSH run clocked **78–86 ms** and I nearly reported
"multiplexing is 10× faster" — it was timing `Permission denied (publickey)`. The mutant harness
called **every** mutant UNKNOWN because its regex anchored at `^` and node:test's ANSI escape sits
there. **And the script written to fix that printed `patched` and changed nothing.** The shared root
is not carelessness about `$?`: **in each case the instrument had no way to say "I could not tell",
so it said the thing that looked like a result.** Build the third arm first — **then verify the
verification landed**, because the fourth was the repair for the third failing in the third's way.

**THE CONTROLS ARE THE ONLY REASON ANY OF THAT IS LEGIBLE.** With the classifier broken the run
returned **VOID — 14 did not behave** — instead of a clean 12-of-12. Final: **12 mutants, 12 caught;
2 survive-controls survived; 1 skip-control skipped; source restored byte-for-byte.** One mutant
genuinely survived (`<=`→`<`) because **no test sat on the boundary — and the state verdict IS a
boundary call**; closed it, 39 tests not 38. **A mutant harness without a mutant that must survive
cannot detect its own failure.**

**AND THE ROOM'S INSTRUMENT CAUGHT ME.** `install-only.test.js` went red: my hook was **UNDECLARED**
— on no manifest entry and no unmanaged declaration, nobody had ruled. Declared it unmanaged with
its reason, because **the ruling was prose and the installer is data**, which is that test's own
founding lesson aimed at me. Worse and better: the other unmanaged hooks are unmanaged partly for
carrying no `CONSONANCE_DREAM` guard — **mine had none either, and it is the worst member of that
class: a dream runs unattended and this hook moves the lease deciding which machine may drive a
seat. A sleeping machine would have quietly held seats against a waking one.** Guard added.

**Did not verify:** the state mirror **has never run** — default OFF, and that default is a decision
(unattended per-turn publishing outward is the keeper's, and it would not meet the bound anyway).
The hook is **not registered in settings.json** and has never fired from a real turn. No live pane
was ever mid-generation when its lease was taken. The three heartbeat outcomes are separated by
**matching git's prose on stderr** — a git reword would silently reclassify an eviction as an error.
**`turnActive` is threaded but never sourced**, so the forced-take dialog cannot yet truthfully say
what it will orphan: the ruling is real, the input does not exist. Registered F3: **if SSH
multiplexing clears 5 s, my refusal was of HTTPS and not of a git remote** — check it before anyone
builds a peer channel on the strength of it. `portable-paths` and `state-sync` red are A's; I
reported and left them rather than rule on another seat's site.

D055 **p-runtime-score** — binary 15532 built 08:45:32 from tree-state `ce9afed`, **two commits behind HEAD** `7d94177` (committed 09:05:44, 6m42s after launch); premise holds only because `git diff ce9afed HEAD -- consonance/src-tauri/` is empty — say `src-tauri identical to HEAD`, not `built from HEAD`. Seats A/B/C/E = pids 11008/23256/13916/20636, mounts correct, but **all four cwd `C:\Users\nname`**, not `instances\`; the four `panes.json` cwds never existed (no dir, no project dir, ever). **Seven seats, not eight** — the 8th was a per-prompt haiku hook subprocess parented outside 15532. Unmounted pane at `instances\third-place` left named, not ruled on. -> exo_memory/handback/p-runtime-score_2026-09-09.md

D056-2 **p-roster-adversarial** — attacked the transform pre-build. **F1**: `read_kept()` `unwrap_or_default()` (main.rs:3320) makes an unparseable panes.json identical to an empty roster, and `gc_captures` consumes it -> a malformed roster sweeps EVERY committee pane; A's transform becomes that file's writer and a BOM broke a sibling JSON here today (51ac75f). Both rosters BOM-free now. **F2** (the chair's open question, answered): `retire_capture` tests `.txt > 200` but the drop deletes `.log` too — fires on young/destination-spawned panes, **already executed twice** (librarian 0c0c0c0b, 09-02 11:23:37 and 09-04 03:14:17); the registered falsifier watches `archive/` and cannot see a deletion. **F3**: chair HOLDS on first sync — 5/5 rows in attic, 5/5 cwds present, 5/5 tails archived, no pruner, 247.7 MB. **F4**: home= is load-bearing, answers point 1; absent-home must never default to this machine or the roster doubles. **F5**: 0 of 4 committee cwds resolve today, so C-before-A refuses every committee pane — ordering is mandatory, fixed seats still spawn. Corrects my own D055 keep-set figure: three fixed seats now, not MAIN alone. -> exo_memory/handback/p-roster-adversarial_2026-09-09.md

D059 **p1b-resume-the-conversation** — the 07-11 "never `--resume`" decision was measured against **2.1.207**; the app ships **2.1.269** (the packet's 2.1.266 was relayed, not measured). On 2.1.269 a hard kill (`pty_kill` → `TerminateProcess`, reproduced through the same portable-pty calls) loses **nothing completed**: 36 turns over 12 trials in 4 cells, all present; positive controls ABSENT 3/3. The graded cell is the finding — kill mid-turn and the prior turns survive 6/6 while the in-flight one goes `--` / `U-` (prompt on disk, reply not) / `UA` by delay: **the vendor writes each record as it completes; a kill destroys only what was never on disk.** `--resume` returns the REAL conversation 4/4 (old turns, original timestamps) and APPENDS to the same jsonl; refusal is `exit 1` + "No conversation found", 6/6. **THE DEFECT ONE LAYER UP:** that refusal is invisible to everything `spawn_claude_pane` keeps — the `Child` is dropped, and the `alive` flag stayed TRUE with no EOF 3 s after the exit, 3/3, because a Windows ConPTY does not close under an open `pair.master`. So the fallback is only buildable inside the spawn funnel, before it returns; that is where the bounded `try_wait` went. Landed +288/−20, **not committed**: resume attempted when the jsonl is present, refusal falls back to today's warm fresh spawn, orphan rename moved INSIDE the fallback, and the warm brief **not** written on a resume (it asserts "could not be resumed" and re-hands a seat its own memory at worse fidelity — the 204k stacking shape). 4/4 wiring tests verified red at HEAD; suite 532 passed / 1 failed (pre-existing, verified red at HEAD); mutants 4/4 caught, survive-control survived, skip-control not applied. **Three instrument failures, all caught by controls, all one shape — an instrument with no way to say "I could not tell" says the thing that looks like a result:** the mutant harness scored every mutant CAUGHT because `cargo test` prints `error: test failed`; M4 SURVIVED because my test anchored on `"if resume {"` and that function has two; my ordering test went red on correct code because a fallback CLOSURE is written above the call that may never reach it — **definition order is not execution order**. And a damage report worth more than the packet: **PowerShell 5.1 `Get-Content -Raw` + `Set-Content -Encoding utf8` is not a safe editor for a UTF-8 source** — it mojibake'd every em-dash in main.rs and rewrote every line ending (2,323 lines); caught with `cat -A`, reverted, redone through Node. -> exo_memory/handback/p1b-resume-the-conversation_2026-09-12.md

D060 **p1c-resume-intake** — the two rulings my D059 hand-back declined to make, built. **I am the case:** `resume pane=a2122153… jsonl_existed=true -> RESUMED` at the log, and my own cwd held a **116,302 B CLAUDE.md headed "the underlying session could not be resumed"** — a seat that remembers, reading that it does not. Three other cwds carry that heading **twice**, live plus one baked inside the captured screen of the shell before it: the stacking lineage visible in one `grep -c`. Lifted the room out of `warm_resume_brief` into `intake_with_map` so the two writers share ONE assembly — two spellings is how the room a resumed seat reads drifts from the room a warm-spawned one reads, with no reader anywhere able to see it. `resumed_intake` rewrites (never deletes — this file is the only place a sibling receives BOOT and the deck; a fresh dir gets the file REMOVED, because unbriefed is a property that dir keeps for life). **The race I was given permission to refuse over does not exist, and the ordering is why: the only reader of that file is the vendor process `spawn_claude_pane` has not started yet** — so the refusal condition is written at the call site instead, for whoever later moves the rewrite after the spawn. And I made it cheaper than the status quo rather than equal: `fs::write` opens with TRUNCATE, so a crash mid-write already tore the room with no concurrency at all; both writers now go through `write_intake` (write-beside, rename-over, `MOVEFILE_REPLACE_EXISTING`). §2: **the window reports its own margin instead of being pinned** — `RESUME_REFUSED pane=… exit=… after=Nms` as a formatter, plus `confirm held after=Nms` on the happy path nobody had ever timed; the test asserts the margin RIDES and VARIES, which is the one thing a test on the constant could not see. 538 passed / 1 failed (pre-existing composer red, verified red at HEAD); 2/2 wiring tests red at HEAD — **and the four behavioural ones are only COMPILE-red there, reported as the weaker form, with the ordering stated plainly: implementation first, red demonstrated after by reverting.** Mutants: the packet's three CAUGHT, plus M4 (drop the elapsed) CAUGHT; **M5 survived and is named — atomicity is invisible without fault injection**. **M2 would have been caught for the wrong reason** and it was fixed before the run: the test gave the pane no capture, so baking one was caught only because it was *missing* — a verdict that evaporates in production where every resumed pane has one. Also repaired a 22-space gap in my own D059 board row, a Rust line-continuation backslash eaten by a JS template literal. -> exo_memory/handback/p1c-resume-intake_2026-09-12.md

L058 **p-stick-E** — **REFUSED the in-app import, measured, on §7's second condition; nothing built.** The import gate is `consonanceRunning()` = `tasklist IMAGENAME eq consonance.exe`; from inside the app it matched pid 23900 and returned `true`, and a non-running name did not match (positive control). **"Before the lock and before any pty" cannot satisfy it — the gate tests an image name, and the image exists from process creation, before `main()`.** No position inside `consonance.exe` is earlier than `consonance.exe`. §7's FIRST stop does not fire: Arrive fits at the top of `sync_at_launch()` before `decide()`, no restructure — the launcher can host Arrive, only the import cannot run in it. Rehearsal and export are ungated: one real-stick rehearsal from inside the app, 7/7 NOTHING_PENDING, stick + receipt byte-identical before/after. Recommended **A** (arrival as its own process that *opens first*, the keeper's words, gate kept truthful) **+ B** (in-app rehearse-and-withhold as the net), **not C** (a subtler gate has more ways to be wrong permissively). Leave not built: ON-EXIT already exports on close, so two writers on one ledger must be ruled first, and A's `--json` is mid-edit (+69 uncommitted). **Ruling 1 — tightened, not loosened, and the tightening is measured:** ARRIVING reads a fixed seat's birth by *recursive most-recent search*, but the carry refuses over one exact `dest`; **MAIN's id exists under two slugs on L (262 MB live, 1 MB July)**, and the homeless-transcript case (a seat spawned in the wrong cwd) makes a newer, later-born stray that would get the LINEAGE retired automatically — so birth comes from `dest` only. And `pending.at` is the exporter's clock while birth is this one's: add a same-clock condition (first timestamp in a launch minute of this machine's own `persist.log`) rather than invent a skew margin. Panes proceed, never silently — full address before import. Owed to A: rows need `kind`, `dest`, `pending.at`, and a machine reason instead of the prose `DIFFERENT conversation`. **Correction from a second vantage, not me: L052's `live-host.js` was +226, not +220.** -> exo_memory/handback/p-stick-E_2026-09-14.md

L059 **p-stick-build-E** — **§6 STOP, seconded and widened from the app side; nothing built.** A stopped §2 and §3 within minutes, and my whole half (Arrive, setup window confirm, handshake, the no-stick test) hinges on both — so no build. **I re-ran A's audit scripts myself rather than relaying them** (read first: mkdtemp fixtures, injected projectsRoot/appRunning), and all three reproduce: the import rewrites `ledger.json` so a MANIFEST written at export mismatches after every *successful* arrival; §2's applier command cannot carry a `--retire-far`, so confirm → refuse → relaunch → same window; the waiter races the applier and wedges a seat for good (`ALREADY_APPLIED` + `UNIMPORTED_TAIL`, every rehearsal clean). **Added one measured §3 defect: the definition puts the marker at the volume ROOT, but the real stick keeps everything one folder down** (`D:\consonance-L-20260911\consonance-tails\ledger.json`; `D:\consonance-tails` absent) — built as written, the real stick reads as *no stick at all*, falsifier 1 reached by a definition. App-side gaps for the same re-rule: **no single-applier guard** (the keeper double-clicks the shortcut while the applier waits → it waits invisibly behind the new window, and a second confirm starts a second importer); **enumerate-and-ask spawns node per volume on every no-stick launch** (2 volumes, 57–67 ms each — passes the rows bar while no longer today's launch; stat for a marker first); **rows carry the local conversation's first timestamp but not the carried one's**, so the window's identity bar is unmeetable on FULL and blind on the one comparison that names the lineage; Ruling 1 lives in no process yet (`retirable` is only `offset === 0`). Q1: agree to hold exit until the handshake; the hard-kill argument holds only with A's lock + ALREADY_APPLIED advance, a stale handshake treated as absent once named, and the stated limit that nothing reopens the app for the keeper. -> exo_memory/handback/p-stick-build-E_2026-09-14.md

L059 **p-stick-build-E** — **built, after two narrow §6 rings that each moved the shared sections** (the waiter's command was unwritten; the 03:05 waiter ruling contradicted the no-stick bar — ruled as E-6, reading (i)). The launch only LOOKS: sysinfo volume list + root and one folder down, stats only — **no process, no file, no row, no held seat** on a no-stick launch, pinned and shown red against the three wrong versions (logs / withholds / spawns); the one permitted spawn is the exit waiter, started every launch with no row. **The real code found the real stick** one folder down as the older layout; A's verifier said code 0 older; 7-row rehearsal; stick byte-identical. The setup window after the intro shows every seat with BOTH first timestamps (unknown, never guessed), take/keep per OTHER_CONVERSATION with ruling 1 as a DEFAULT only (the one measured launch-born sample: 18.7 s), and Carry exits the app ONLY on this child's handshake. **A decision of mine for the chair: when the stick holds the seats, the MIGRATE retire and adopt are held too** — the import now runs after exit, and a retire first would remove the file a carried delta appends to. 588/0/4; 27 mutants, 27 caught, **all in a scratch copy of the crate, never the tracked source** (the room's three-times lesson, applied to myself), tracked files hashed untouched on every run. Removed two of my own test cases the shared find table does not carry. -> exo_memory/handback/p-stick-build-E_2026-09-14.md

L059 R-2 **the leak** — my own applier() test fixture carried this machine's private tree path and the consumer scan refused the build on it. Moved it off, and the move exposed that the check it fed was looser than it read: ends_with("stick-apply.js") also accepts not-stick-apply.js, which made the separator normalization beside it decorative, and the IMAGE half had never been tested alone (every stale fixture also failed the script check). Now the file name is compared exactly after normalizing, the fixture keeps a backslash so it only matches if normalization runs, and a test holds the script right and only the image wrong. Lookalike test shown red on the shipped check first. Scan: 0 surviving leaks; gen-consumer 59/59, fixture-scope 7/7; cargo 590/0/4; mutants N1-N3 caught, N4 (path back in the fixture) survives cargo by design — the scan owns that failure and caught the original. -> exo_memory/handback/p-stick-build-E_2026-09-14.md

L058b **p-no-console-E** — **§5 STOP: the chair's mechanism is half right, measured with a Windows-subsystem stand-in for the app and a process-start watch.** The flash is real (live waiter pid 26800: conhost -> OpenConsole -Embedding -> WindowsTerminal -Embedding within 0.1 s), but the premise *windowsHide is set and it opened anyway* is wrong: the call that flashed is tail-carry.js::pidImage (the PID-eq tasklist the chair's watch recorded), which at HEAD had NO windowsHide; the :131/:138 calls it named are a different filter. Four cells: DETACHED+no-hide 15 terminal hosts on 5/5 calls (the stand-in's positive control); DETACHED+hide 0 windows while the unhidden live waiter flashed in the same window; NO_WINDOW with or without hide 0. So §3's flags are still right for a better reason — they cover a forgotten flag anywhere in the subtree. Survival under NO_WINDOW: clean exit and taskkill /F both survived, taskkill /T killed it (the control), DETACHED kill matched L059. The running waiter keeps flashing until relaunch regardless — node does not reload modules. Built nothing; the sweep found 8 Command::new, 6 already NO_WINDOW, the 2 DETACHED ones mine. A first harness build landed in the shared C:\build\lighthouse-target through a global CARGO_TARGET_DIR; exactly those files removed. -> exo_memory/handback/p-no-console-E_2026-09-14.md

L058b **p-no-console-E BUILD** — after the re-rule: the waiter and the applier now start with NO_WINDOW | CREATE_NEW_PROCESS_GROUP, the detached constant is gone, and the reason in the source is the measured one (a console-less parent makes its console children allocate their own; a hidden console to inherit makes a forgotten windowsHide open nothing), with the tree-kill exception written beside the flag. Three tests shown red first; the sweep named exactly the two sites §3 named without being told. Narrowed one of my own tests after writing it: forbidding the flag TOKEN would have forbidden the source from saying why it is gone. 593/0/4; A's suites read-only 108/24/39 while A's copy-mutating harness held its lock; 6 flag mutants caught, each test carrying a catch no other test makes. -> exo_memory/handback/p-no-console-E_2026-09-14.md

L058c **p-diverged-E** — the window's door for a fork: a DIVERGED row is offered take/keep with NOTHING preselected (SeatChoice::None, built beside offer_for), shows both byte counts and both machines, Carry waits for every unkept fork's choice and re-checks on change, and a TAKE is routed by verdict to --take-stick. D-2 built narrow: an export UNIMPORTED_TAIL is quiet only for a seat kept on the import side for this carry, and only that reason. **One consequence D-1 did not spell out, built and named for C:** making ALREADY_APPLIED/APPLIED_AND_GREW actionable at stick.js:102 is unreachable while rehearsal_is_quiet calls them quiet and closes the window — so they are news now. **The tests read REAL tail-carry --json rows** from a two-machine fixture (D-2 hid behind a test passing []), and an integration probe against A's working copy matched the row shape (121 B / 139 B / takeable). **Two faults in my own UI stub, found before the code existed:** the D-1 tests passed because the stub never read the HTML disabled attribute, and D-6 passed because it only checked after. Repaired; then 6 red. 609/0/4; stick.test 15/0; 16 mutants caught; 0 leaks. -> exo_memory/handback/p-diverged-E_2026-09-14.md


## 2026-09-14 ~07:40 · CARRY-FORWARD before a compaction — where I stand, what is open, what to reuse

**Not a finding; a bearing.** Every claim below points at its master. Read the hand-back, not this line, before acting on any of it.

**Open, and mine to watch** (nothing of mine is committed; the chair lands):
- **P-DIVERGED (L058c)**: my half is built, `exo_memory/handback/p-diverged-E_2026-09-14.md`. Dirty files:
  `consonance/src-tauri/src/{main.rs,sync_launch.rs}`, `consonance/ui/{stick.js,stick.test.js}`. **It lands only together
  with A's half** (`stick-apply.js:80` exits 2 on an unknown `--take-stick`). **For C to rule:** my §2 there (D-1's
  consequence: ALREADY_APPLIED / APPLIED_AND_GREW are now NOT quiet, or the enabled Carry is unreachable).
- **P-NO-CONSOLE (L058b)**: built and presumably landed. Its §4 falsifier (a process-start watch over launch + 3 min idle +
  exit on the REBUILT app) has never run. The waiter running at the time kept flashing until relaunch. The tree-kill
  exception is named at `CREATE_NEW_PROCESS_GROUP` in main.rs.
- **L059 stick module**: the landing-side checks named in its hand-back are still unrun — the window rendered in real
  WebView2, an end-to-end Carry, anything on D.
- **The vantage DISAGREE on L052's `live-host.js` +220** (really +226) keeps re-surfacing in hooks. It is ALREADY corrected in
  two hand-backs (L058 §8 and after). No action is owed; do not re-correct it again.

**Instruments that exist and should be reused, not rebuilt** (all under this pane's scratchpad; the path is session-scoped):
- `l059/mutate.js` — a mutation harness that **mutates a scratch COPY of `consonance/`** (crate + UI, plus exo_memory
  cards/spread/research/record/SOURCE.md), runs a baseline of the unmutated copy first (2 copy-only failures:
  `managed_cwd_tests::the_map_walk…`, `repo_root_tests::the_checkout_resolves…`), and hashes the tracked files before and
  after. **To run new mutants:** write a `mutantsN.txt` holding `const MUTANTS = [...]` with `file: SL|MAIN|UIJS` and
  `run: 'rust'|'ui'`, then splice it into a copy of `mutate.js` (see `mutate6.js`). Always include a SURVIVE and a SKIP control.
  Check every anchor for exactly one match before starting.
- `noconsole/` — a Windows-subsystem harness (`harness/`, built into `noconsole/target`) spawning with the app's exact flags,
  plus `watch.ps1` (a Win32_Process start watch), `score.js` (attribution by parent pid), `cells.sh` and `survive.sh`
  (survival, with a tree-kill control).
- `diverged/gen_rows.js` — real `tail-carry --json` import/export rows from a two-machine mkdtemp fixture
  (DIVERGED / OTHER_CONVERSATION / unmoved). Rerun it against whatever `dev/tail-carry.js` is current to re-derive rows.

**Traps met this session, each cost a run:**
- **A global `CARGO_TARGET_DIR=C:\build\lighthouse-target`** is the keeper's shared build dir. Any scratch crate must set its
  own `CARGO_TARGET_DIR`, or its artifacts land beside the app's.
- **Bash heredocs and `node -e` with nested quotes, backslashes or Rust raw strings fail at parse time.** Write the patch or
  test through the file tool and run it; confirm "nothing written" with `git diff` after any failure.
- **PowerShell `Get-Content -Raw` / `Set-Content`** mojibakes UTF-8 sources (D059). Edit only with the Edit tool or Node.
- **A UI stub that defaults `disabled: false`** passes "Carry is available" vacuously; read the starting state from the
  rendered HTML. A test asserting only the "after" of a change passes on code with no change handler; assert before AND after.
- **`deepStrictEqual` across a `vm` realm** fails on identical arrays (different prototypes); compare JSON.
- **A §-named mechanism is a reading until measured** — `windowsHide` WAS enough; the flashing call was a different site.

## 2026-09-15 ~01:30 · P-LEAVE (D063) E half built on L → `exo_memory/handback/p-leave-E_2026-09-14.md`
The close window: seats killed, dropped and waited on through a PROCESS-LIST probe, then the stick save, DONE/NOT DONE,
the launch cleanup as ruled. **The finding to carry:** sysinfo's `refresh_process_specifics` (`proc_info`) opens the
pid, so an exited process still referenced by a handle (its killer, or a busy seat's orphaned bash) reads RUNNING
forever: 38/38 never ended in 30 s while tasklist listed 0/38. `refresh_pids_specifics` (`proc_listed`) read 63/63 ended
in 26.5–129.9 ms on L. The kill result was inverted 111/111. Bound 5 s. Harness `scratchpad/leave/teardown/` +
`score.js`; rows `gen_leave_rows.js`; mutants `l059/mutate7.js`/`mutate8.js` 33/33. D-8 held (§2.8), not built.

## 2026-09-15 ~01:45 · P-LEAVE §2.9 (c59530a) built → appendix of `exo_memory/handback/p-leave-E_2026-09-14.md`
B2-1: an in-flight spawn count (enter_flight raises the count BEFORE reading LEAVE_PHASE; the Flight drop is the decrement; insert_pane releases it after the Panes insert, 10/10 sites); leave_run waits for it up to 10 s, then drains, and a count above zero is NOT DONE. B2-2: proc_listed lists the app's own pid in the same enumeration; absent means CANNOT TELL (alive in the wait, keep in the cleanup). 658/0/4; mutants 13/13, but Y6 SURVIVED first: **a test whose inputs are all the same failure cannot tell which guard held.**

## 2026-09-15 ~06:30 · P-HARNESS §2 (1bc3299) measured → `exo_memory/handback/p-harness-E_2026-09-15.md`
Per resume with nothing typed: librarian burst mean 368,523 B (78.8% the vendor instructions record, the whole intake written TWICE, files + rendered), chair 439,825 B (56.3% instructions, 33.5% file-history snapshot); context +56–59k tokens (lib) / +43–53k (chair) per resume. Between launches the intake changes by 531–4,390 B (lib) / one PULSE line (chair), never byte-identical, so whether the vendor skips an unchanged CLAUDE.md is UNMEASURED. The shelf carries 0 bodies, so the date/byte windows are inert (0 B). The vendor re-reads on-disk CLAUDE.md after compaction: the delta idea's trap. Scripts `scratchpad/harness/`.

## 2026-09-15 ~07:10 · P-DIVERSITY-C0 §2 (57f21c7) → `exo_memory/handback/p-diversity-c0-E_2026-09-15.md`
Per pane from Consonance: NO (no --model at main.rs:1002-1056, no model env, KeptPane {pane,cwd,label} :3419). By the vendor: new panes take ~/.claude/settings.json:3 (fable-5-1[1m] on L); a RESUME keeps its last model (probe: resume without --model answered opus while the default is fable); `/model` saves as the machine default. `--model` on --resume works in print mode. Smallest change: an optional KeptPane.model + a lookup in the funnel. Breaks: rosterApply drops it (state-sync.js:1018); the [1m] suffix; interactive mode unmeasured. Found in passing: KeptPane already drops panes.json `home` on set_pane_kept.

## 2026-09-15 ~11:55 · P-DIVERSITY-C1 §2 read (D) → `exo_memory/handback/p-diversity-c1-E_2026-09-15.md`
C's hashes match; C's scorer re-run offline reproduces results-c1.json byte for byte (0 network attempts); my own implementation matches P1 E/B and 3 P2 rows to 4 dp; §8.2/R3 applied as frozen. §8.3 FIRES under every variant (brief versions, E without appendix, 6 window phases) but the landing commit's reason overreaches: the lower build E answers rulings the anchor lacks and is longest, B is below A in every variant, and the 0.0479 margin sits inside window-boundary noise (0.012–0.069; each primary moves up to 0.040). Scripts `scratchpad/c1read/c1/{indep,phase,cmp-runs}`.

## 2026-09-15 ~13:10 · D064 STEP 0, the phase instrument (D) → `exo_memory/handback/step0-phase-E_2026-09-15.md`
`dev/diversity/phase-window.js` sha256 ba98d635…2cb5 + test 2950fbd4…782d (13/0; red 10/3 on a stub; mutants 15 applied/15 caught/0 NOT APPLIED on a copy). THE BAR met: E §5.2 at six phases 18/18 and the librarian's U (0.7328/0.6866/0.6497) to 4 dp, from the scorer diff `scratchpad/c1read/c1/score-step0.diff` (ecacc774…1a4a) whose run keeps C's 641 fields unchanged. Named edge: an empty text is refused (R8e's two clauses disagree at 0 ids). Diff readings (U verdicts beside C's, V1 per phase + mean, gate still phase 0) await the librarian.

## 2026-09-16 ~04:0x · P-BATTERY-BLIND, the pane-blind design (D) → `exo_memory/handback/p-battery-blind-E_2026-09-16.md`
Design only; no pane scored. **VERDICT: names blindable, AUTHOR not.** redact.js (cb3f3ea1…, re-hashed MATCH) already
takes the filename letter, `map/X.md`, `(E)` and callsigns — three of those are A's additions past K6's spec. Needs new
rules: sibling/instance stems (17 hits/13 files), uuid middles (13/11), scratchpad paths (113/30), lower-case callsigns
(31/11). **Cannot be removed: the letter A (--letters throws; R8h is unobeyable here), length rank, and the hand-back
contract itself — "I wrote/I built" 131 hits in 37 of 42 files, and 11 of 42 texts carry a stem `ls|grep` resolves to
one author.** Gate: 0.625 (= 0.75's above-chance fraction moved from binary to 4-way; P(chance) 1.1e-4 at n=24) plus a
linkage ARI; seals are (commit, path, sha) triples — **the battery's own sealed prediction sha 8bf0b5ee… no longer
matches its file at HEAD (d1546db edited it); it verifies only via `git show 0a54c5a:`.** Clicks: 12 spawns + 36–84
approvals, unmeasured until one fresh pane is asked to read three files.
**I WAS WRONG about house style:** same-brief l039/l045, redacted, function-word classifier 3/6 (chance 2/6, p=0.32),
2 of 18 markers rank consistently — below chance. The channel is LENGTH, which I normalised away: order B A C in both
briefs on bytes, words and lines. Scripts `scratchpad/{leakcensus,style,markers}.js`.

## 2026-09-16 ~04:2x · T3 prior-art task — STOPPED under §6, no list → `exo_memory/handback/t3-echo_2026-09-16.md`
Dispatched "is the code bloated, or is the corpus bloated — find where the record already carries it." **My first
grep (`grep -rn -i "bloat"`) returned the task's own SEALED KEY**: `loop/battery_run1_T3_key_2026-09-16.md:7` (the
task restated) and `:32` (a complete answer row), plus `map/M.md:913` carrying the key's headline conclusion. Key
committed 04:12:13, brief 04:13:34, dispatch ~04:17 — **into the tree the brief told me to search.** Measured: the
better the search, the worse the leak — `grep -ri "code base"` and `grep -ri "too large for what it does"` each
return exactly ONE hit and it is the key. I read 2 of its 42 lines and opened it no further. **The remedy already
exists and was aimed at the wrong artifact:** K4 (`anchor_similarity_registration_DRAFT_2026-09-15.md:517`) puts an
unseeable artifact OUTSIDE the repo with only its sha committed — ruled for hand-backs, never carried to keys.
**T3's object IS the repository, so T3's key cannot live in it.** Add K5's void-grep BEFORE dispatch, not after.
**My own miss:** the blind design I wrote four hours ago guards a seal against revision and never asks whether a
sealed file is readable by the seat it is sealed against. Not scored 0 by the registration's own rule; a stop is an
answer. The keeper's question is still open and I am now the wrong seat for it.

## 2026-09-16 ~04:4x · T2, contesting the boundary-check note (D) → `exo_memory/handback/t2-echo_2026-09-16.md`
18 claims; **8 false (1, 4, 6, 11, 12, 13, 15, 17), 1 unresolvable (8), 1 understated (14).** Four falses are exact
inversions, three of them of the tool's central repair: claim 4 says a missing lap makes it PASS (`boundary-check.js:32-38`
— it FIRES; that asymmetry IS the repair), claim 17 gives it a window-and-rate (`:245` fires on the first unsealed
arrival; the window is the *predecessor's* shape), claim 6 says a hand-pasted brief is in the denominator and the rate is
exact (`:63-66` — it is not, and the denominator is "a floor"), claim 12 swaps presence/boundary. Claim 13 is the
sharpest: **`boundary_falsifier_2026-08-28.md:4-5` says pane B drafted it, explicitly NOT the seat that wrote the
original (librarian, fb08c50)** — the note reports the disclaimer as its opposite and calls it the ground of trust.
**Two things checking taught me:** the tool's own header drops "the loop is tight and" from the cut while the note keeps
it (master `consonance/src-tauri/brief/BUILDING.md:539-543`) — the drift is the instrument's, not the note's; and
**`main.rs:5605` is stale in `boundary-check.js:33,104` and `boundary_falsifier:67`, and the tool PRINTS it at `:229`** —
the real chair stamp is `main.rs:9504`. Claim 8 unresolvable here: D's board spans the named window and holds **0 rows
with `pane==='blind'`** (30,347 parsed), so `blindOverlaps` has no input on this machine at all. Did not run the test
(it mkdtemps + writes); 22/0 quoted, not re-derived. Disclosed: a grep surfaced 2 lines of another seat's tonight file.

## 2026-09-16 ~05:0x · T5, the planted ferry.js copy (D) → scratch `…/instances-main/…/scratchpad/t5/found-echo.md` (NOT in the repo)
**8 defects, all single lines; unmodified tests 6 pass/7 fail exit 1 vs repo 13/0 exit 0.** Against the live ledger the
copy erases every ferry: repo `ferried 63 · miss 91.0% · median 15.2 min` → copy `ferried 0 · miss 100.0% · median n/a`.
D1 `MIN_SHA 7→4` (:43) lets record() write 4–6 char shas; D2 `>=`→`<=` (:118) inverts the usable filter and — measured —
**every sha in the live ledger is 7 or 9 chars, 0 are ≤4, so `usable` is EMPTY**; together they make the phantom the
header says is impossible. D3 `&&`→`||` (:160) silently drops a second pane's ferry and prints `already:true`. D4
`>=`→`>` (:196) drops the epoch-boundary commit from BOTH buckets: before+inWindow = 808 ≠ all 809. D5 `/60000`→`/1000`
(:201) makes seconds wear the `min` label. D6 drops the `n>=0` guard (:202) → **prints median latency −300.0 min**.
D7 `floor`→`ceil` (:204) picks the wrong element AND **at n=1 crashes: `lat[1]` undefined, TypeError at :220 mid-report**.
D8 `RATE_FLOOR 10→1` (:215) prints 100.0% off n=1.
**The finding to carry: one defect MASKS three.** D2 empties the latency list, so D5/D6/D7 are invisible in every live
run — reachable only by crafting a 4-char-sha ledger. A reviewer who diffs then runs to confirm would stop three short.
**And `ferry.test.js:55-59` is GREEN on the copy for the opposite reason** (5-char sha rejected by `5<=4` instead of
`5>=7`) — my 09-15 Y6 lesson again: one fixed input cannot tell which guard held. Self-correction: first reported the
test run as exit 0; that was `tail`'s code through a pipe, not node's. Harnesses `scratchpad/t5{harness,lat,edge,neg,floor2}.js`.

## 2026-09-16 ~06:0x · L061 P-BOUNDARY-CHECK-FIXES, built (D) → `exo_memory/handback/p-boundary-fixes-E_2026-09-16.md`
Three repairs to `consonance/tools/boundary-check.js` + its test file, red first, landed dirty. **27/27 tests (22
before; 4 red-first + 1 regression pin), 8 mutants → 7 caught · 0 SURVIVED · 1 NOT APPLIED, tool prints the same
verdict and figures (231/52, FIRES 21 of 231, exit 1).** At code level the whole change is TWO lines.
**R1 the NUL:** it was doing its job — the (pane,text) dedup key needs a separator that cannot occur in either
field. Only the ENCODING was wrong: a raw byte instead of the six-character escape. Verified the runtime value is
identical. Cost of the raw byte: `wc -l` 298 vs `grep -c ""` 299, `grep -n` refuses line numbers, **and `git diff`
calls the file binary — so the defect hid its own repair from review.**
**R2 citations:** `main.rs:5605` → `main.rs fn chair_inject_exec` in all three places incl. the one PRINTED on
every run; the dead number is quoted nowhere, and my own new test rejected my first attempt for re-quoting it.
**A symbol alone does not stop rot — a CHECKED symbol does**, so the suite now fails on any `main.rs:<digits>` and
on a cited symbol that stops existing. Checked every other citation too; left the L009 journal line citation alone
and said why (a dated journal's lines do not move; that is the opposite of source).
**R3:** restored "the loop is tight and" and fixed `brief/BUILDING.md` → `consonance/src-tauri/brief/BUILDING.md`.
**Flagged for B, a ruling not a review:** I amended the test file's own "Nothing greps the source" rule to admit
ARTIFACT tests, with the discriminator written in (forbidden = an assertion about the VERDICT decided by reading
the source; permitted = the file as artifact, which no behaviour of the tool can satisfy). It is a rule narrowed by
the seat that wanted it narrowed — if B says too wide, the four tests go in a third file.
**Boundary held (repair 4 is C's):** my NUL edit is inside `readBoard`, the same function as C's blind rows, but
strictly downstream of the `o.pane === 'blind'` early return, so it cannot change which rows are collected as
blind. `blindOverlaps` untouched.
**Self-corrections: M6 SURVIVED first** — my separator fixture did not actually collide once `[chair:MAIN] ` was
prefixed, so swapping the NUL for a space left the suite green; rebuilt from `boardRow` and M6 is now caught (Y6's
lesson from 09-15 again). My artifact tests broke under copy-first and now fail loudly instead of skipping. My
reflow silently broke M5's anchor and the harness reported NOT APPLIED rather than passing. **And nine line
citations in my T2 hand-back were wrong** — estimated from an unnumbered `cat`, not from a command; re-derived and
corrected in an appendix there, along with why the note's "299 lines" was a true reading of a lying file.
Scratch `scratchpad/bc/`.
**Addendum, same lap, and it is the lesson worth keeping:** while writing the hand-back ABOUT the NUL repair I put
five raw NUL bytes into the hand-back itself — a shell escape collapsed inside a `node -e` string, and backticks in
the same string ran as command substitution and deleted two filenames from my prose. Rewrote the file through the
editor instead of a shell; then the editor's own JSON encoding turned a literal `backslash-u-0000` in my text into
a real NUL twice more. **Three different tools, three different escape layers, same byte.** Checked every file I
touched afterwards (`wc -l` vs `grep -c ""`, and `indexOf(0)`): all five clean. The rule to carry: **after writing
any file through a shell or an encoder, read back what landed — the escape layer you did not think about is the one
that bites.** Same root as the nine bad line numbers in t2-echo: a tool used without checking what it produced.
js-suite after landing: 95 green · 4 failed · 1 canary (of 100), `boundary-check.test.js` ok, none of the four
failures a file I touched — but the tree was dirty with three other seats' work while it ran, so that is a narrow
claim, not a clean measurement.

## 2026-09-16 ~06:2x · L061 B's ruling on my carve-out: TOO WIDE → edit made, in `p-boundary-fixes-E_2026-09-16.md` §9
I asked B to rule on a rule I was widening in the file the rule governs. **B ruled against me and was right on two
grounds I had not tested.** (1) **My fence was an intent question.** Run L009's own case through my discriminator —
the Rust test that asserted a brief said "No work." and stayed green after the phrase was struck — and **the letter
of my permission ADMITS it**; only my intent clause excluded it. I had tested my permission against my four tests
and never against the case the rule was made from. **A fence a stranger cannot apply is not a fence.** (2) Mixing
costs the suite's meaning: three of the four go red for a rename in main.rs or a move of BUILDING.md — correct
reds, not statements about the tool, arriving in the number that is.
**My specific error:** I priced the alternative at "a third file and nothing else" and then argued against it on a
cost I never checked. `js-suite.js:155-161` walks recursively for every `*.test.js` (SKIP_DIRS :150), so a split
file cannot quietly stop being run. **I named the fallback and argued against it from the general case instead of
this repo's runner** — same root as the nine bad line numbers and the NULs: a claim made without running the thing
that would settle it. Re-derived B's citation rather than taking it.
**The edit:** four ARTIFACT tests → new `consonance/tools/boundary-check.artifacts.test.js` (100 lines, header
records B's two grounds so the next reader finds the ruling, not an unexplained split); the amendment at :320-341
removed; the original rule at :4-9 untouched and verified verbatim; the separator test stays (behavioural).
**Bars: behaviour 23/0 · artifacts 4/0 · js-suite runs BOTH (`ok` on each) · tool exit 1, same shape · all three
files clean of NUL.** Mutants re-run across both suites: 7 caught · 0 SURVIVED · 1 NOT APPLIED, **and every mutant
reddens exactly ONE suite** — the five citation/text mutants in artifacts, the two behavioural in behaviour, none
crossing. That is B's argument confirmed by measurement, not accepted on its reasoning, and it is what makes the
split a real cut rather than a filing preference.
**The lesson to carry, and it is the one worth more than the repairs:** asking for the ruling cost me the outcome
and produced a better instrument than the one I was defending. The read found a clean answer instead of an argument
because the question was asked before anyone had to catch me. Do that again.
**Not mine:** the remaining raw NUL is in B's read (`p-boundary-read-B_2026-09-16.md:37`); my t2-echo was escaped
the turn before the chair flagged it and re-verified clean (262 = 262).

**js-suite totals after the split, appended:** universe 100 -> 101 files discovered, js-suite 95 -> 96 green, same 4
failures (none mine), 0 not-run. **+1 discovered, +1 green** — the new file is run, not merely present.

## 2026-09-16 ~07:2x · L062 P-DELIVERY-ACK, measure + design (D) → `exo_memory/handback/p-delivery-ack-E_2026-09-16.md`
**FORCED MEANS LATE, NEVER LOST: 33 of 33 forced deliveries reached the pane's transcript as a user turn, 12–38ms
after the forced send, 0 not found.** The second finding is bigger: **every one of the 33 was held against an IDLE
pane** — zero turns produced during its own 240s hold, already silent 51s to 4,304s (72 min) before being queued,
and every hold ran the FULL bound (240.17–240.43s; not one cleared early). **33 × 240s = 2h 12m of pure added
latency in one night**, all of it to panes doing nothing. Gate at queue time was `stamp=ready` in all 33;
`Forced::SignalOutranked` in all 33; zero NoUsableSignal, zero SignalContradicted.
**The other path:** `chair_inject`'s receipt is a SCREEN SCRAPE (`await_render` polls the capture 1800ms), and it
was wrong once in 15 — the UNCONFIRMED row was written **1,843ms AFTER the vendor already had the turn**. Not
sitting in a composer; the screen just never showed it in the window. Transcript right 15/15, screen 14/15, and the
error under-reports. **That one row is the whole argument: the transcript is the fact, the screen is a signal.**
**Mechanism named, not fixed (not my packet):** `input_box_empty` fails CLOSED — composer-has-text, composer-row-
not-found and grid-size-mismatch all return false and all print *"its composer never cleared"*. **The row asserts a
fact the code does not have**, same class as the 2026-09-07 defect this file documents fixing, one level down in
the variant instead of the string. One bool (did `composer_row()` resolve) would settle it.
**Design:** DELIVERED retired; SENT / SENT-unacked / ACKED, where ACKED means a board row posted by the TRANSCRIPT
TAILER when the text appears as a `type:"user"` turn — boundary-check's inversion applied: written by something
the licensed behaviour cannot suppress, so a pane can neither fake an ack nor withhold one. Prefix-anchored match
(measured: the injected text starts at char 0 of the turn), delta from the SEND instant not the audit row (the two
paths' audit rows straddle the turn in opposite signs), durable pendings, receipt demoted to a hint. 12 fixtures;
F4/F7/F10 are the ones that stop a pane acking itself by quoting or by posting a lookalike row.
**Registered before the build, against the lap's own falsifier: the ack will NOT reduce the forced rate**, because
the rate comes from `box_empty`, not from acknowledgement — if the next lap is still 240s-forced, that is the
PREDICTED result and the composer predicate is what needs redesigning, not the ack. My own falsifier: if after the
build the room still cannot say whether a dispatch arrived, this design failed.
**Self-correction:** I first read the arrival delay as "+0.0s" across all 33 and nearly wrote it down — my own
display rounded seconds; the truth is 12–38ms. **33 identical zeros is not a measurement, it is a bug**, and that
is the only reason I looked. Scripts `scratchpad/ack/{measure,measure2}.js`.

## 2026-09-16 ~07:4x · L064 P-BLIND-WRITE-PATH, built (D) → `exo_memory/handback/p-blind-write-E_2026-09-16.md`
C's two reachable defects (§4.1, §4.2 of `p-blind-rows-C`, d27ec19) are **both fixed WITHOUT touching main.rs**, and
that is the finding rather than a convenience. C named the mechanism: *"the mute is a property of the lock; the
RECORD of it is a property of traffic."* §4.1 makes the record depend on traffic, §4.2 on process life — **both
dependencies vanish if the record is written by the thing that toggles the lock.** `blind.js`'s `setBlind`/
`clearBlind` are the only two toggle points and run exactly when a window changes, with no traffic needed and no
`BLIND_LAST` to lose. A Rust fix would still be observing an edge and would still need somewhere that survives
process death; **the toggle does not have to remember anything — it IS the event.**
Safe alongside the app's own rows: `blindOverlaps` ignores a second OPEN while one is open and a CLOSED with
nothing open (read at source), so the two writers coexist and the guard reads one span either way.
**`blind.js` +36, `blind.test.js` +70. Tests 9/9 → 17/17 in place, 8 red first. Mutants 7 caught · 0 SURVIVED · 1
NOT APPLIED.** Three decisions: the CLOSED row **refuses to invent a muted count** (only the muting process knows
it) and says why; a close that removed nothing writes nothing (a phantom boundary is worse than the gap); and
recording is best-effort while blinding is not — a failed append never throws but always prints to stderr, because
a silent swallow is the defect one level up. M6 was caught by a parse failure not an assertion and I said so; M7 is
what actually pins the stderr rule.
**Found in passing, pre-existing, not mine:** `blind.test.js:74` held two RAW NUL bytes in a deliberate fixture
(two raw bytes then the word garbage), making the whole test file binary to grep. Rewritten as backslash-u-0000
escapes — identical runtime
value — since I was already in the file. Flagged to A's P-NUL-GUARD lane.
**The limit that matters most: the installed `~/.claude/shell/blind.js` is UNCHANGED and now one version behind.
The fix does nothing on this machine until the install step runs, which is the keeper's.**
**Method note to carry:** my 8 new tests all failed in the scratchpad copy for an unrelated reason — a pre-existing
test reads `board-digest.js` from `__dirname` and a two-file copy lacks it. I re-ran the repo baseline in place
(9/9) instead of assuming a regression. **A copy that is missing a file fails in ways that look like your change.**
Scratch `scratchpad/blind/`.

## 2026-09-16 ~09:5x · D066 P-LAUNCH-PULL, chunk 1, built on D → `exo_memory/handback/p-launch-pull-E_2026-09-16.md`
The keeper's "open it once" fix is in `consonance/launch.ps1`, uncommitted, +129/-0, byte-identical to the tested text
(sha256 4f304269...baec over base 6f25ad38...767f). **Fixtures 20/20 on real repos with a real bare origin; mutants 12
applied: 11 caught, 0 SURVIVED, 1 NOT APPLIED (control); D run correct on both reachable paths, HEAD unchanged.**
**ONE LINE OF THE BAR IS NOT MET AS WRITTEN, and it needs a ruling:** the bar says call git DIRECTLY; the fetch is not.
Measured on D against a server that accepts TCP and never answers: http + lowSpeedTime=15 aborts at 15.4 s, but
**https + the same config was still waiting at 100 s** - git's low-speed limit does not cover a stalled TLS
handshake, and origin is https. A direct fetch can hold the app closed with no bound I found. The stake line ("prove
no case can stop the launcher") and the direct-call line conflict; I kept the stake. Same suite across variants:
shipped launcher 5/19 (never pulls), direct fetch 16/19 (F4 HUNG to the watchdog), bounded fetch 19/19 then 20/20.
**A's defect, explained:** Start-Process -PassThru reads ExitCode as null (0/5 in every combination once the child
has exited before the handle is touched); [Process]::Start reads it 5/5. My first explanation - "touch the handle" -
only won a race, and I had already written it into the block's comment; M1 SURVIVING is what caught that.
**Rulings where the bar was silent:** no pull while Consonance runs (from :147-158); no-prompt vars on the fetch
CHILD's env only, so panes never inherit a git that cannot ask for a password; ahead+dirty raises a Notify, dirty+
current is a console line; any git refusal quotes git's own reason (the first version claimed "commits of its own"
for an untracked-file conflict and a stale index.lock - a dialog asserting a cause it did not have).
**Harness self-corrections, the lessons to keep:** (1) the first fixture run left the process table real, Consonance
was running on D, the guard fired in all 19 cases and 5 "passed" doing nothing; (2) F4 first "passed" in 113 ms
because console.log COLOURS NUMBERS here, so the blackhole port parsed as NaN and git got a malformed URL; (3) the first
M10 did not parse and read as caught - the harness now reports an unparseable mutant as INVALID; (4) M5 is caught by
C4b not C4, because with the same file dirty git's ff-only protects it anyway - only a file git would NOT protect
proves the check exists. **Not verified:** a real bad network, L, the whole launcher end to end, a credentialed remote.
Scratch `scratchpad/pull/`.

## 2026-09-18 ~23:3x · D072 P-LAUNCH-GHOST, chunk 1, built on D → `exo_memory/handback/p-launch-ghost-E_2026-09-18.md`
`consonance/launch.ps1` +101/-2, landed dirty, byte-identical to the tested text (sha256 a1a27193...608a over base
4f304269...baec). **Fixture 31/31 on the change, 24/31 on the launcher as it stood (red first); mutants 22 applied: 21
caught · 0 SURVIVED · 1 NOT APPLIED (control) · 0 INVALID - D066's eleven re-run and caught.** A windowless Consonance
past the 30 s grace (stick-apply.js's number, reused) that stays windowless through a 10 s re-look now gets ONE dialog
naming the pid; a windowed one is skipped quietly as before; one that is just closing gets its 10 s and then THE PULL
RUNS AFTER ALL. The rule itself is unchanged: no pull while ANY consonance.exe runs (B: the close path reads the repo's
tail-carry.js - version skew otherwise). :276's rebuild dialog brought under the rule (it told a ghost's keeper "the
window you have"); :418 dream-at-close deliberately left, with the reason written at the line.
**Found beyond the plan:** (1) the old named, silenced Get-Process PULLED UNDER a failing probe (G7) - closed, but that
red rests on modelled failure semantics; (2) main.rs warn_second_instance (:6507) tells a ghost's keeper "use the window
you already have" - not mine, not fixed, needs a rebuild.
**The harness lied three more times and the fixture caught every one:** a stub shaped for the OLD call answered the new
unnamed probe with an empty table and F7 PULLED; PowerShell 5.1 ConvertFrom-Json does not unroll a JSON array, so a
two-process spec threw inside my stub on BOTH variants and I first read it as a real red; my first X1 mutant would not
have parsed. **Lesson to carry: a stub models the thing, not the call you happened to write first.** Real probe on D:
1 consonance.exe, pid 18840, windowed, and the new probe costs a median 3.8 ms against the old 1.8 ms (299 processes).
**Not verified:** a real ghost (I will not crash the live app to make one), a minimized window, a real close timed.
Scratch `scratchpad/ghost/`, harness `scratchpad/pull/{fixture.js,runcase.ps1,mutants-ghost.js}`.

## 2026-09-19 ~01:3x · D074 P-COMPOSER-TRISTATE, composer lap 1, built on D → `exo_memory/handback/p-composer-tristate-E_2026-09-19.md`
`input_box_empty`'s one bit is now `Composer { Empty, HasText, Unreadable(NoRow|GridMismatch|NoScreen) }`, the forced
row is built from a TALLY of every reading of the hold, and **no decision changed** - `drain_decision` untouched,
the gate's bit derived once from the reading in `pane_state`. main.rs +636/-34 (sha256 64e40db2...0fd7), 4 fixtures
cut from real captures at clear-screens. **769/1/4 in place = 746 + 23 new, the 1 the known red
(`a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`, D-only, left alone); mutants 19 applied: 19 caught, 0 SURVIVED, control NOT APPLIED.** (5) T17 first read "caught" by an unrelated flaky test; no test of mine pinned it; added one, re-ran all twenty. **A catch by a test with no path to the mutant is not a catch.**
**The finding: HAS TEXT is mostly NOT the keeper on D.** A fresh pane's dim `Try "..."` suggestion reads as text
(vt100 0.15 drops SGR 2) - pinned as a defect, not fixed. C reached the same mechanism from transcripts (d997a2c);
no shared file, no claim of who was first. So the row says "never read clear - read as text", never "never
cleared", and the plog no longer says "the keeper's rule firing". The falsifier's "has text dominating" arm cannot
be read off these rows.
**Self-corrections to carry:** (1) my first no-behaviour-change test compared the tri-state to `input_box_empty`,
which is now DEFINED as it - a guard that could not fail; replaced by the pre-lap body kept verbatim as an oracle.
**A refactor's equivalence test needs the OLD code as its oracle, or it is a tautology.** (2) The slash screen is
None on D and Some on L, same bytes, same pinned deps - I did not use it as the None fixture; the trust dialog is
None by structure. (3) One `"Try \""` flipped the global quote parity a leave_wiring test lexes by and turned code
into strings; fixed my side, the lexer's fragility flagged. (4) Replaying at the log's max cursor column (103) read
99.96% of frames as no-row; the rule was 99 wide. **Geometry is read off the frame, never off the stream's maximum.**
Scratch `scratchpad/{vtdump,tri,mut,fx}/`.

## 2026-09-19 ~09:5x · D079 P-SCORER-INTO-THE-REPO, chunk 2, on D → `exo_memory/handback/p-scorer-into-repo-E_2026-09-19.md`
The diversity instrument left the scratchpads: 10 files byte for byte (sha256 before = after, 7 of 7 = recorded),
my step-0 scorer as `dev/diversity/score.mjs` (19c97ab5…), C's run-2 scorer, both results, the step-0 diff and a
README into `loop/diversity_c1/`. **One run of the committed bytes reproduced results-step0.json 60c7d726…
exactly** (stdout identical, NETWORK_ATTEMPTS=0; 34m36s vs 15m59s on 09-15, cause not measured). The encoder is
NAMED external (147 MB, 4 files, shas in the README); download.mjs pinned no hub revision, so the scorer's own onnx
hash check is the only pin. Placements forced by not editing a scorer: PREREG beside the scorer (it reads it from
its own dir), a second byte copy of the strip under the name it loads, package files in `score-deps/` so their
`"type":"module"` cannot flip the dir's CommonJS files. **Carry forward:** (1) text-census walks `git ls-files`, so
its green says nothing about UNTRACKED new files - run it over a throwaway `GIT_INDEX_FILE` with `add -N`; (2) the
bytes travel, the scorer does not - its repo path is hard-coded. Scratch `scratchpad/carry/`.

## 2026-09-19 ~11:1x · D081 N1 P-SCORER-PORTABLE, unattended, on D → `exo_memory/handback/p-scorer-portable-E_2026-09-19.md`
`dev/diversity/score-portable.mjs` = score.mjs with ONE line replaced: the repo root comes from LIGHTHOUSE_REPO, else
the checkout the file sits in, else it THROWS (no fallback to the old D path). score.mjs 19c97ab5… untouched before
and after. **Both run once each on D, concurrently: results 60c7d726… byte-identical to each other and to the
registered result, stdout identical, NETWORK_ATTEMPTS=0, ~35.6 min each.** Test `score-portable.test.js`: 8 fast
checks (the only-change proof restores the old line and must re-hash to 19c97ab5…) + `--run`; mutants 7/7 after
M7 SURVIVED the first pass (a foreign git root was accepted - no check covered it). **Carry:** my D079 hand-back's
`:27` for phase-window is `:28` - I counted a sed window from the wrong end, and the plan copied it. Questions not
asked (keeper asleep), defaults taken: the var name, the portable file NOT registered, throw not fallback.

## 2026-09-19 ~12:5x · D084 N2 stage 1 P-STEP1-M, unattended, on D → `exo_memory/handback/p-step1-m-E_2026-09-19.md`
**m = 0.2952 over 19 rows** (min 0.1107 · Q1 0.2646 · Q3 0.3377 · max 0.3914), from the NEW `dev/diversity/score-step1.mjs`
(5e84e9d9…; score.mjs 19c97ab5… untouched before and after): the gate reads passU (§8.11), and R8c's m_i on R8e's U
with R8f's others-at-parent. One run, 17m19s, NETWORK_ATTEMPTS=0, results fb34a8d0…; p-stick-A/E VOID as :390 said.
Outputs in `loop/diversity_c1/` (results-step1.json, m-step1.md generated from it, score-step1.diff 29e676b5…).
**The check worth reusing:** strip the new blocks from the new output and it must equal the registered old output
(it did) - that proves "only these changes" on DATA, not just on the diff. And the per-row controls reproduced P1's
committed controls on the one row whose packet is byte-identical to ed73e76. Defaults taken (keeper asleep):
inverted own controls → VOID (0 fired); negative texts at 1e944ac not per-row; built from the hard-coded original,
not the portable copy. Time labels slipped to "12:3x" again - check `date` before writing a time.

## 2026-09-19 ~13:3x · D088 N6 stage 2 P-BATTERY-RUN2-ATTACK, read-only, on D → `exo_memory/handback/p-battery-run2-attack-E_2026-09-19.md`
**REGISTRABLE WITH 12 NAMED AMENDMENTS, 5 blocking.** Worked, not argued (`scratchpad/attack/scan.js`): §2's lexical scan
FAILs D086's primed1 - but the rewrite it forces (the two flagged phrases, 201 chars) passes with exit 0 while Part Two (3)
"What would change your mind" still asks for A4's third criterion with 0 shared words; and it FAILs run-1 T2 only on the
word "path" in "path:line", blind to the real cause. §1 gives T2's cold reader "the text alone" while run-1 T2's claims were
all repo-checkable, so the same ceiling task would pass §1 and ship. The draft's own `:48` commits the cold result before
dispatch - for T3 that result IS key paths. Removal-calibrated keys make the cold base rate ~0, so §1's adjustment and §6's
difficulty bracket are vacuous; load needs a Latin square (exactly possible at n = 3). Transcripts and captures are a
readable key route on D - checked D086: open, unused. **Carry: my time labels were wrong THREE laps running (12:3x, 13:5x
written at 12:2x, 13:33) - run `date` before typing any clock time.**

## 2026-09-19 ~22:5x · D090 P-READY-NOT-THE-CHILD, on D → `exo_memory/handback/p-ready-not-the-child-E_2026-09-19.md`
One line in `dev/shell/lib/ready.js` (+8, 7 of them comment): return when `CLAUDE_OVERSEER_RUN === '1'`, beside the
dream guard - the overseer's child `claude` inherits CONSONANCE_PANE/READY_DIR and its Stop hook stamped the PARENT
ready mid-turn. New `dev/shell/lib/ready.test.js`, 8 cases, all through a temp READY dir: **5/1 red first (only the
overseer case), 8/0 after; mutants 8 rows, 8 caught, 0 survived.** **The two survivors are the lesson:** my first set
passed only literal true/false (so `!!ready` was invisible) and set NEITHER variable in the no-variable case (so
deleting that guard just threw into the try). The revealing case is a ready dir WITH NO PANE - unguarded it writes
`undefined.json`. **A guard whose removal throws somewhere else is not tested by a case that never reaches it.**
Also: the tracked mutant-harness can only SCORE when the scorer exists in a worktree of HEAD, so it cannot score an
untracked test - gates only (8 rows pass), kills by `scratchpad/ready/mutants.js` off the same rows file. Stated not
fixed: every process a pane spawns inherits both variables (`main.rs:1150-1151`), so an UNMARKED child can still
stamp its parent.

## 2026-09-20 ~01:4x · P-THIRD-RUN-READ (audit, CONDITION WORLD) → `exo_memory/handback/p-third-run-read-E_2026-09-20.md`
Audited `dev/dream/README.md` + `dev/dream/dream_cycle.test.js`: **26 members**, 9 README / 16 test / 1 cross-file
contradiction. **The method that paid: when the question is whether a TEST holds, mutate a COPY and re-run instead of
arguing.** Three mutants: (A) the sentinel line `:83` asserts, commented out INSIDE the here-string -> 7/0 green, because
`:83` matches RAW and the regex cannot tell use from mention - the very invariant its header cites; (B) an ordinary
comment mentioning `@'` flips `stripComments`'s here-string flag for the REST of the file, so with the real
`Get-Process` line commented out the whole suite stays green - guard 2 deletable with 7/0; (C) deleting the battery
decision is caught only by the skip COUNTER, not by the battery assertion, which checks that a class NAME appears.
README's headline defect: ":31-32 If Consonance is running, the cycle skips" is stale - the runner dreams with the app
open when idle >= 20 min, i.e. it documents the exact bug the test file exists to prevent. Checked against the world,
not the prose: `powercfg` (AC=1, DC=0 - the installer never sets DC, so README's "power plan blocks all wakes" rests on
a Windows default), the 8 dream.logs (only 07-28 logged the skip, not the claimed 07-26/-27/-28, and `main`'s log spans
the window), `exo_memory/muscle_map.md` (cited bare, lives under exo_memory/).
**Caught in myself:** I typed a time-box ("01:34-02:05, ~31 min") that had not happened yet, while the work ran; `date`
said 01:40. Fourth lap running for this slip, first one caught before filing. **Write the clock from `date`, or not at all.**

## 2026-09-20 ~01:5x · L059 THE AUDIT (auditor by sealed draw be4baa3) → `exo_memory/handback/p-third-run-audit-E_2026-09-20.md`
Audited the scorer's five-item edge + its R8 rejection. **All five CONFIRMED, two strengthened, one rejection
challenged.** **D1, the one rejection I would not have made:** `powercfg /a` on L settles "does THIS machine expose
S3", but B's R8 is about the README's requirement travelling - and the runner ships expressly for other machines
(`dream_cycle.ps1:84-85`). L is *outside* the population B named: S3 available, S0 Low Power Idle NOT supported. A
one-machine probe cannot settle a portability claim -> UNSETTLED, not excluded. **Two commands that do not settle
what they are said to settle:** item 2's `sed 33,36p` shows the readFileSync is at module scope but not that it
throws before any test registers (I ran it: exit 1, stdout 0 lines); item 1's `sed 71p` shows the regex but not that
an equivalent reversed comparison fails (I mutated `$idle -lt $IdleMinutes` -> `$IdleMinutes -gt $idle`: 6 pass 1
fail). **The unit question, recorded not re-scored:** item 1 is site-exclusive, not class-exclusive - I reported the
same class at `:53`; under a class-level unit the edge is 4, not 5. §3.4 fixes the site unit, so the scorer is right
and the other number belongs beside the list.
**The design defect this audit hit:** §5.2 asks the auditor to check the scorer's list, but exclusivity can only be
settled against the other readers' hand-backs, which my own voiding list forbids - so the audit is partial BY
CONSTRUCTION. Release the auditor from the reader list, or give exclusivity to a second seat.
**Conceded against myself:** §5 caught my `~31 minutes` surviving at `:125` while `:5` says ~7 - the carrier problem
inside one file, mine. Left UNEDITED: it is the scored artifact, and repairing it after scoring destroys the evidence.

## 2026-09-20 ~02:4x · L061 packet 1 P-SHUFFLE-GUARD (non-author of C's tool) → `exo_memory/handback/p-shuffle-guard-E_2026-09-20.md`
`order-parameter.js` now REFUSES to name a verdict when `--shuffles` is 0: `verdictReport` (printed) and
`gateVerdict` (written) - flag first, then the reason, and the measured line prints either way. **20/5 red first with
the FINAL test text against `git show HEAD:` in scratch; 25/0 after; mutants 11 listed, 11 killed, 0 survived,
pre-flight green 25/0, live file unchanged.** Estimator/bars/numbers untouched: 5 deleted lines, all print/write/export.
**Ruling where the bar was silent:** the `--out` JSON is gated too (a verdict on disk is quoted like a printed one),
ruling withheld, every measured field passed through.
**Two of my own tests were too weak and the mutants said so first:** `/--shuffles/` matched a second mention inside
the reason, `/control/i` matched the headline - so a refusal could lose its actionable line or its reason and stay
green. **A refusal's two halves need two assertions.** And one row of mine was an EQUIVALENT mutant (swapping two
statements after `c` is already computed) - the harness was right to call it survived.
**Three findings about the tracked mutant-harness (A's file, not touched):** (1) its result parser is cargo-only
(`:80`), so a node:test scorer reads NO RESULT on every row - my scorer translates node:test's real counts into the
line it parses; (2) its worktree is HEAD and it copies in only the mutated file, so a tracked-but-modified test file
is silently STALE inside it - worse than D090's missing scorer; (3) a missing anchor refuses the whole RUN, so a
deliberate control row cannot ride along.

## 2026-09-20 ~06:2x · L064 packet 2 P-HARNESS-AUDIT (non-author; A wrote the harness) → `exo_memory/handback/p-harness-audit-E_2026-09-20.md`
**Universe 50 rows (every hand-back publishing a mutant score on a .js/.mjs/.cjs target): P 36 name a private runner
by path · H 7 name the tracked harness AND its adapter · N 5 name no method at all · Q 2 quote another seat. Six are
mine.** **The feared case did not happen:** not one row claims the tracked harness on a JS target without naming an
adapter, and the two the chair named (`pp_score.js`, `SCR/score-js.js`) check out at source. **The falsifier fired in
its weaker arm:** five rows publish a kill count with no identifiable runner - four name none anywhere, one prints the
literal placeholder `node <harness>` - **and one of the five is my own `p-blind-write-E`**, listed in the finding by
name rather than around it. **The fact that reframes it:** the harness is ONE DAY old (5602507, 09-19 11:11), so every
earlier JS run necessarily used a private runner; "did it ride an unnamed adapter" is only askable of 17 rows.
**Carry (a near-miss that would have been a false finding):** I searched with `grep -inE "mutat"`, which matches
mutation/mutated but NOT mutant/mutants - the word those files use. Four rows came back empty and I nearly reported
"no mutant discussion". Caught only because `grep -i "mutant"` on the same file disagreed. **A pattern one letter too
long is indistinguishable from an absent finding.** Method: scan/digest/classify in `scratchpad/haudit/`, class by my
judgement and published, quote pulled from each file. NOT re-run: any of the 50 runs - this audits what each row SAYS.

## 2026-09-20 ~10:0x · D091 P-ASK-UNREADABLE (ask.js is the chair's own work) → `exo_memory/handback/p-ask-unreadable-E_2026-09-20.md`
`ask.js` HEAD_RE's title group was `[^,]+`, so ASK-009's comma'd title never started a block: its fields were
absorbed into ASK-008, ASK-008 printed OPEN while the store said [ANSWERED], and ASK-009 printed ZERO times - under
a confident "0 unreadable", because the guard at `:47` watches the STATUS line and the failure was in the HEADING.
**Repair is two halves:** title `(.+)` with the date anchored, AND an unparsable `### ASK-` heading now COUNTS as
unreadable after closing the block above it (no absorption). Fenced ``` lines are skipped, which is why the
documented ASK-00N template stays harmless *for a stated reason* - before, it was harmless only because `ASK-\d+`
rejects `00N`. **23/3 red first, 27/0 after; four run modes all green (plain, --test, --test-concurrency=4,
filtered 5/5); js-suite 101 green/7 failed/1 canary of 109 with ask.test.js ok; mutants 8 listed, 8 killed.**
**The number that taught the most: open count 12 BEFORE and 12 AFTER - ASK-008 left, ASK-009 joined.** A count can
be identical and wrong; only membership shows it. Measured by running the pre-repair parser beside the new one.
**Carry:** the can-it-vary check said NO for the shipped store (0 unreadable before and after), so the new counter
had to be pinned on fixtures where it can read 1 - measuring only the real object would have tested nothing.
**And mutant #8 survived my own assertion for the second night running:** `/heading/i` matched because my fixture's
heading contained the word "heading". **An assertion satisfiable by the fixture's own wording tests nothing** -
pinned to the label `/^unparsable heading: /` instead. ASK-006's referent recovered into its Source line (not the
verbatim question): `~/.claude/shell/hooks/{session-start.js,userprompt-submit.js}`, named at log `:1437-1439`,
re-checked on disk (grep -c CLAUDE_OVERSEER_RUN = 0 in both); hooks NOT touched - that change is the keeper's call.

## 2026-09-21 ~02:4x · L059 R4 P-R4-ACTORS (chunk R-B, cause first) → `exo_memory/handback/p-r4-actors-E_2026-09-21.md`
The actors.evidence red was **three control-plane writers posting under their own names**: `sync` (main.rs:12371), `resume` (main.rs:6310,
ONE writer reporting on four letters) and `digest-gate` (mcp.rs:624). **The brief's binary, PRE_LETTER or letters.json, did not
fit.** All three post after LETTER_BIRTH and no seat is behind any of them, so they went into the file's third class, NON_PANE,
where `blind` went by the same tripwire on 07-31. B diagnosed the same class on D on 09-19 with a DIFFERENT id list (D had
trailer-gate 5 and no digest-gate), so **the unresolved set depends on the machine**. Null registered and held; falsifier's three arms checked;
can-it-vary YES (the board cut before the first sync row → []). Red 6/1 → 7/0 plain/--test, 27/0 parallel, 1/0 filtered; mutants 4/4
killed, each naming exactly its dropped id; suite 106 green / 3 failed (others' packets) of 110. `trailer-gate` and `dyad` were
deliberately left out, with 0 rows on L: pre-empting a tripwire removes it. **Carry:** I typed two line numbers wrong and caught them by
grep before filing, one carried over from B's file. A citation copied from another seat's hand-back is the same risk as a hand-made number.

## 2026-09-21 ~02:5x · L060 packet E, consent → `exo_memory/handback/p-l060-consent-E_2026-09-21.md`
CONSENT to a carrier-drift registry row for my `p-battery-blind-E:274`, with kind **`withdrawal`, not the `acknowledged` the ruling named**. The line quotes the
withdrawn wording in order to report its withdrawal, and it already matches the registry's own marker regex (`withdrew … in full`, same line), so the record needs no edit and no marker.
**Carry:** before consenting to a class, run the registry's own regexes over the file. The ruling's kind would have needed a `see` pointing at the anchor's own line, and that is the tell that it was the wrong kind.

## 2026-09-21 ~03:3x · L062 R-C1 (state defaults) → `exo_memory/handback/p-l062-rc1-E_2026-09-21.md`
Four FATAL-DEFAULT sites repaired test-first: live-mirror-stop.js :49/:50/:54 and live-follow.js:33. Each now resolves env → ~/.consonance.json → null plus a loud skip/refusal. Red 8/3 and 0/4, green 11/0 and 4/0, parallel 15/0, mutants 10/10 killed.
**state-sync.js:141 HELD, with the fix proven on a copy:** L's config has no state_dir, so the literal is load-bearing for the launch pull (main.rs:10725), close.js:140, and SIX reconcileInstall tests (arrivalCtx at :1208 resolves stateDir eagerly). Patched copy 69/6 against control 75/0. Landing order: the keeper adds state_dir on L and D, then arrivalCtx goes lazy, then land.
**The finding that mattered:** live-follow's git() with cwd:null runs in the CALLER's repo, so release() would push `origin --delete` to the wrong remote. It is now guarded before the spawn.
**Carry, found on myself:** (1) my own L052 hook's readStdin never reads a piped stdin on Windows (fstat is none of FIFO/file/socket/char). My new test passed or failed by launch cwd, and only a mutant pre-flight at 10/1 exposed it. (2) Without a control copy, a wrong scratch layout gave 61/14 and would have been reported as damage. (3) portable-paths 41→32: only 4 are mine, the rest were A's and C's in the same window. Diff the site lists, never subtract counts.

## 2026-09-21 ~03:4x · L063 writeBaseline → `exo_memory/handback/p-l063-writebaseline-E_2026-09-21.md`
C's reading was proven by running it: --update DROPPED a hand-added `why` and RESET a hand-corrected verdict. Red 0/3 against a `git show HEAD:` copy, green 3/0; whole file 41/2 in plain, --test and parallel (the 2 are the known repo-green reds); mutants 5/5.
writeBaseline now starts each surviving row from its PRIOR row, and the prior verdict wins. It prints every kept disagreement, every newly blessed site (+) and every dropped row (-).
**My call: --update keeps blessing wholesale** (12 test bootstraps and the tool's own "let the diff carry the argument" depend on it) **but never invisibly again.** The failure was that the old output named nothing, so there was nothing to review.
**Carry:** a test of a path guard adds sites to that guard. Hoist the planted literal to ONE constant (key = file+text+occurrence). And the R4 prediction came true: trailer-gate posted on L and actors.evidence is red on it, and the fix is the same one-word NON_PANE addition.

## 2026-09-21 ~03:5x · L064 'trailer-gate' into NON_PANE → `exo_memory/handback/p-l064-trailergate-E_2026-09-21.md`
Confirmed at source: trailer-gate is the NEXT-trailer gate (mcp.rs:634 trailer_audit, text mcp.rs:3392, landed 8e8d1bd), one row on L. Added to NON_PANE in the R4 form. Evidence test 6/1 → 7/0, actors.test 20/0 both sides, parallel 27/0, mutant 1/1 on a copy. dyad is still unlisted (0 rows).
**The row that fired it was MY OWN R-C1 ring:** "NEXT: … before collating" has no `when`, and the gate caught its author's own seat one lap after I predicted the tripwire. Every trailer ends `when <condition>`, and "before" is not "when".

## 2026-09-21 ~04:1x · L065 state-sync.js:141 (steps 2 and 4 of my own R-C1 order) → `exo_memory/handback/p-l065-statesync-E_2026-09-21.md`
Step 2: arrivalCtx no longer resolves the state dir eagerly (only the transformed branch reads it, lazily). Step 4: :141 now throws a refusal naming state_dir, and its test moved into state-sync.test.js (red 77/1, green 78/0). Mutants 5/5. **The whole js-suite is green on L: 110/0 of 111.** portable-paths is green at 0 new, exit 0, and its test is 43/0.
**The prediction held, but only after I made it falsifiable:** L's new state_dir makes the six reconcileInstall tests pass either way. Under a D-like home (L's config minus state_dir), with step 2 reverted it reads 71/7 (the same six plus mine), and with it 78/0.
**Carry:** a prediction about a machine-dependent failure must name the machine state that can make it fail. Also, `cd X && a & b` puts the cd into a's subshell. Use absolute paths when backgrounding. D still needs state_dir before this commit reaches it.

## 2026-09-21 ~05:4x · L067 keep-warm CHUNK B (app code) → `exo_memory/handback/p-l067-keepwarm-E_2026-09-21.md`
Built in main.rs (+489, nothing rebuilt or relaunched). A 60 s thread pings a seat ONLY when: its own Stop stamp says Ready, its composer is exactly Empty, it is >= 50 min since its LAST REQUEST STARTED, it has not been pinged in 50 min, and it is not switched off. The ping goes through gate_or_queue, and if the gate queues it anyway the ping WITHDRAWS its own message (withdraw_tail_if). Tests red 4/11, green 15/0; crate 841/0/4 (826 + 15); mutants 9/9 on a crate copy.
**"Spec wrong here" x3:** gate_or_queue's queue plus its forced drain would deliver over typing; the idle switch off delivers into turns; human-driven panes are skipped pending the keeper's call. **Unbounded cost:** every seat is pinged on the first tick after launch (~6.37M).
"Last request started" is established from the transcript: the line before the last requestId's first assistant line, which is an earliest bound. No stamp gives it.
**The finding:** every ready stamp on L froze at 09-20 07:53. The pane env carries CONSONANCE_DATA, and 8 keeper hooks use `CONSONANCE_DATA || ~/.claude/shell` as their LIBRARY dir, so ready-*.js silently fail to find lib/ready.js. The busy check on L tonight rests on the screen alone. Not touched: those are his hooks.
Ping text: one line, no NEXT. The trailer gate is MCP-only (mcp.rs:573/660/905), and a NEXT line is a routing instruction the seat would act on.

## 2026-09-21 ~06:0x · L067 amendment (the keeper's 05:57 answer) → `exo_memory/handback/p-l067-keepwarm-E_2026-09-21.md` §9
Keep-warm now pings only in the [50, 60) min window. It keeps warm and never warms, so a seat never used since launch is never pinged and §1's launch cost is gone. Human-driven panes are in, with the same Stop-stamp, empty-composer and never-mid-turn safety. Red 16/4 → green 20/0, crate 846/0/4, mutants 3/3 including the >= vs > boundary.
Two of my new tests were green against the old code, and I said so. **Carry:** a window design has one silent failure mode, a seat that crosses 60 min unpinged, and nothing reports it yet.

## 2026-09-21 ~06:3x · L069 packet 1 one env name → `exo_memory/handback/p-l069-envname-E_2026-09-21.md`
CONSONANCE_STATE is now the one name; CONSONANCE_STATE_REPO is retired with NO alias. Grep found nothing outside the repo that sets it (~/.claude/shell, settings, config, User/Machine env, pane env: none). Only my own two L062 files read it.
Red: hook 10/2, follow 3/3. Green: 12/0 and 6/0, parallel 18/0, filtered 3/0. Mutants 6/6, including both "silent alias" rows. A's close.test assertions stay TRUE unchanged; only two of A's comments are stale, and exact edits are proposed.
**Carry:** the split was mine. R-C1 noted two names and left them. Noting a split instead of closing it is how the second name survives.

## 2026-09-21 ~07:4x · L070 keep-warm "activated this session" → `exo_memory/handback/p-l070-keepwarm-activated-E_2026-09-21.md`
The keeper's 05:57 rule was mistranslated into my L067 code as "last request < 60 min", which abandoned an activated seat after one missed ping. It is now: activated = a request since app_started_at(). A never-used seat waits; an activated one is pinged at >= 50 min with no ceiling. Red 18/3 of 21 → green 21/0, crate 855/0/4, mutants 4/4 including the ceiling itself.
TWO tests encoded the error, not one: the second modelled "never used" as "idle 183 min".
**Carry:** (1) check a translated rule against the speaker's own words, even in the file I cite; a green suite built on a mistranslation DEFENDS it. (2) Replacing from the `fn` line left an orphan #[test], so one test ran twice (22 runs, 21 names). A count that disagrees with its unique names is a defect.

## 2026-09-21 ~09:3x (D) · D097 L3 re-measure registration → `exo_memory/loop/l3_remeasure_registration_2026-09-21.md`, hand-back `exo_memory/handback/p-d097-l3reg-E_2026-09-21.md`
The deciding number is S, the quiet_spiral share on ONE-message windows (the exact 08-17 refuting symptom). KEEP iff S_post < 25% over the first 300 post-install one-message verdicts or 14 days, otherwise RETIRE. The null is RETIRE. The window starts at the install instant from B's phase 2. The scorer is embedded verbatim, sha256 b2dc3553…, and round-tripped.
**The design died twice from measurement before registering:** P (the multi-turn share) swings 40 points with no intervention, so a before/after would KEEP by regression to the mean. E (8-word echo) read 24.8% BEFORE any leak, because the keeper's own sentence recurs across 145 sessions and shared user text looks like an imported verdict.
S is 56–85% in every block since 07-23 and 12.7% before. Both rulings are shown reachable by running the rule.
**Carry:** calibrate the candidate number over the store's own history before writing a threshold. The first two "obvious" measures were both wrong, and only the calibration said so. My stake is declared: L3's flags about this room reached my own context.

## 2026-09-21 ~10:1x (D) · D098 keep-warm: notice is not use, missed window said → `exo_memory/handback/p-d098-keepwarm-E_2026-09-21.md`
A's launch turn (14:47:24Z), read from its transcript: a user entry with origin task-notification ("Background shell command didn't finish before the previous session ended") started an ELEVEN-request turn nobody asked for. My L070 rule ("any request since launch") counted that as activation.
Now activated_by_use = a turn-starting user prompt since launch that is not a tool result, not a sidechain, not isMeta, and not a task-notification (matched by origin OR by text; all 1,517 notices on D start "<task-notification>"). Activation is sticky for the session.
Missed-window report: one chair row per crossing at >= 60 min, naming the last skip reason.
Red 22/4 → green 26/0; crate 865/0/4 (+5 mine, +4 A's uncommitted mcp.rs); mutants 9/9.
**Carry:** fixtures that carry BOTH markers hide a mutant that removes one. Reading my own tests found it before the mutants did.

## 2026-09-21 ~10:4x (D) · D100 reader cell out of the data dir → `exo_memory/handback/p-d100-vantagecell-E_2026-09-21.md`
second-vantage's default cell is now <os tmpdir>/consonance/vantage_cell, and it is EMPTIED before every reader. A shared cell leaked one reader's scratch (the _verify_refuse state-sync copy) to the next. A cell that won't empty is a recorded refusal, never a launch. VANTAGE_CELL still overrides and is never emptied.
Blindness was checked: there is no CLAUDE.md in either parent chain except the user-global one. The name keeps vantage_cell so the transcript folder still names a reader.
Red 21/2 → green 24/0 in plain, --test, parallel and filtered; close --check exit 0 before and after; mutants 4/4, with 2 survivors predicted and explained.
**Carry:** my tests first planted in the REAL cell, and the first sandbox put temp INSIDE the data dir, which would have failed the key test for my own reason. A sentinel in the real cell proves the fix. A test that must pass failing is how the heredoc SyntaxError red was caught. A's manifest rule becomes a legacy shelf; the exact text is proposed.

## 2026-09-22 ~06:3x (L) · L080 T-J1 registration (Jev backtest) → `exo_memory/loop/tj1_registration_2026-09-22.md`, hand-back `exo_memory/handback/p-l080-tj1-E_2026-09-22.md`
Registration only; no Jev or judge output opened. S-CTRL: 130 battery trials with exact rig labels (96/34), manifest over each trial's TRANSCRIPT, sha256 4d934c2a…, and it is K's GATE (hit >= 0.80, FA <= 0.20). S-WRONG universe: 186 adjudication lines at 201a03b, sha256 4faf4919…. Its member list CANNOT be fixed yet: an adjudication describes an error, not the erroneous sentence. Extraction is by rule, and the member sha and schema sha are owed before any run.
The null: "Jev adds nothing a one-line regex does not." Oracle: the keeper, blind, with Jev AND claude -p both unverified. §7 attack is left OPEN.
**Carry:** `git grep <rev>` prefixes lines with the rev AS TYPED, so a hash made with the short sha doesn't re-derive from a command printed with the full one. I caught it only by RUNNING the printed command. "Beats the instrument" is dead on K (the rig is the truth), so K is a gate, not a class.

## 2026-09-22 ~06:5x (L) · L081 step 1: answered B's attack on T-J1 → `exo_memory/handback/p-l081-amend-E_2026-09-22.md`
All 3 FATALs adopted in place, dated, with the struck text visible. (1) No ruling C-class → NOT TESTED, never a vacuous strike. (2) Survival needs hit AND bearable false alarms on the SAME class. (3) The extractor condition is narrowed to "no output of THIS backtest or Jev on these units", with the seats named. 9 AMENDs adopted. AMEND-2 argued: sourced can't run on committed lines (it asks whether the same TURN touched a source). NOTEs acknowledged. §10 table added; §7 byte-identical to HEAD.
**Carry:** my first AMEND-4 stacked the old +0.10 margin on B's interval and would over-fire (~18/20 needed), which is FATAL-1's fault in a new place, so I dropped it. And a section-by-section amendment left three stale sentences contradicting it elsewhere; grepping for the old rule's words found them.

## 2026-09-22 ~07:1x (L) · L082 the root README to 2026-09-22 → `exo_memory/handback/p-l082-readme-E_2026-09-22.md`
"Central claim untested" is corrected to TESTED ONCE: n=1, ten laps D080–D089 with 0 human turns by the librarian's own classifier, arms 4–5 open, limits named. The old paragraph is kept and quoted, and its standard kept as the bar. Status is now 2026-09-22: js-suite 117/2/1c of 120 (re-run); cargo 870/0/4 CITED from bf84a30's body with its unit (--bin consonance, not the 09-14 union). Added stick, install+union, park, keep-warm, Jev (both unverified) and T-J1 NOT TESTED, each with its sha. The failure section is current and nothing removed: Main 68.2%, 105 laps/10 VOID, 990 unferried (UP from 623).
Fixed a false carrier in my own file: the Third Place "no channel" line (Jev reads it now). The two JS reds are not mine: third-place-wiring pins the wording A is correcting, and gen-consumer passes 60/0 alone.
**Carry:** a figure handed to me in a packet still needs its own path; this one lived only in a commit body.

## 2026-09-22 ~07:3x · L082 §-affirmative (README central claim stated, at the keeper's word) → `exo_memory/handback/p-l082-readme-E_2026-09-22.md`
README:108 now STATES the claim with its evidence: 09-19 (0 human turns), L070–L082 (13 laps, counted by command, superseding 08-10's "the human is the ferry"), and six on-disk catches. Only arms 4 and 5 stay open. The 07:1x "n = 1 … not proven" lead and its establishes/does-not paragraph are struck and dated, not deleted. +60/−7.
**Carry:** "not proven" was mine too. I wrote it from the brief without asking whether I would have said it whether or not it were true. A specific limit (arms 4 and 5) is information, and the generic verdict is the coat. The packet placed A's for-L correction in L071; the record has it in L070:246, and the page follows the record.

## 2026-09-22 ~09:2x (D) · D105 README: Jev the only judge → `exo_memory/handback/p-d105-readme-E_2026-09-22.md`
README:139 now says Jev is the only judge on both machines. The keeper's 09:12 ruling ("Yes switch them off, only jev") switched the L2/L3 overseers off on D, and they have been unregistered on L since 09-06. B's abstain window and MY L3 re-measure (D097) are VOID BY RULING. The shadow has nothing to compare against. The old sentence is struck. +6/−1.
**Carry:** before writing "the only judge", I checked that Jev's judge mode does not feed on the overseers' files (only the shadow does). And at writing, settings.json:51/:55 still registered them, so the line lands with A's switch-off, not before.

## 2026-09-22 ~11:5x (D) · D109 T-J1 v2 registration on a measured universe → `exo_memory/loop/tj1v2_registration_2026-09-22.md`, hand-back `exo_memory/handback/p-d109-tj1v2-E_2026-09-22.md`
v1 read NOT TESTED (186 → 20 located → 13 members) because 157 lines carry no locator. v2 puts the locator INTO the universe rule: correction lines that carry a path:line. **The packet universe (handback+map) is 149 lines → 28 members (C1 18 · C2 9 · C3 1) and CANNOT rule**, so the universe in force is all of exo_memory/*.md: 424 → 74 (C1 49 · C2 20 · C3 5). C3 is dropped NOW on that number; C2 sits at exactly 20 with no margin. Truth moves to the keeper, labelling 158 units in ONE sitting BEFORE any Jev call, because **51 of 74 members locate CODE lines** where the class questions may not apply: an adjudication class word is a routing token, not a label. The Claude judge arm is dropped (the keeper settled replacement at 09:12). v1 untouched; §-ATTACK open for B.
**Carry:** (1) size the universe BEFORE registering thresholds — v1 failed on a denominator nobody counted. (2) My C3 regex was looser than the rule I was carrying, and a sed that silently did not apply left the old numbers on screen; printing the changed line back caught both. (3) A measured-and-rejected alternative (struck-text units: 55 lines, 21 spans) belongs in the hand-back, not nowhere.
NEXT: librarian collate E's v2, then chair routes B's non-author attack in D109, then 2.1 (measure the suites on D), when E's hand-back is filed

## 2026-09-22 ~12:3x (D) · D109 amendments: B attacked v2 and all 3 FATALs are adopted → `exo_memory/loop/tj1v2_registration_2026-09-22.md` §11/§12, hand-back `exo_memory/handback/p-d109-tj1v2-E_2026-09-22.md` §-AMENDMENTS
B measured what my count was right about: **the wrong object**. A unit whose own 3 lines carry no claim of the class kind cannot be answered yes by anyone — C1 25/49, C2 3/20, C3 1/5 (I re-derived all of it with my own script, sha256 9ea2b6cf…feb3; it agrees with B to the unit). So membership now needs the FEATURE ON THE UNIT (one rule draws both strata, which also kills the artifact in the baseline: it flagged the adjudicated units 18/49 against 39/48 on the drawn ones). **C2 joins C3 as NO RULING in advance.** FATAL-3 adopted whole in B words (nearest N outward, ±200 lines where there are no md headers, short members contribute their unit only). 11 AMENDs adopted incl. k pinned at 3, keeper can-t-tell scored both ways, a 20-unit PILOT first, ~10% repeats for his self-agreement, and a registered PREDICTION that can embarrass either of us. §12 answers plainly: **C1 can still rule (25 + ~60 units, only if his yes-rate lands ~24–76%); C2 and C3 cannot be fed by the committed record at all, and the reason is structural** — an unchecked CLAIM is a fact about a TURN, and the record keeps the claim and throws the turn away. What would be needed instead is named: live-turn units labelled locally.
**Carry:** (1) **I printed one command and ran another, then reported I had run the printed one** — my §9 de-indent command gives 2b2cc973…, not the registered 9541d52d…. That is exactly the C1 fault, in the file registering C1. Print the command you actually ran, and run the one you print. (2) A pool sized by how a correction WORDS itself is not a pool of answerable units; count the feature on the unit before registering a floor. (3) When the attacker is right, adopting the fix that makes the word "positive" true again costs a class — say so and drop it, rather than keeping the name.
NEXT: librarian collate E's amendments, then chair lands D109 whole and opens 2.1 (measure js-suite and cargo on D) when they are in

## 2026-09-22 ~13:1x (D) · D113 union at launch — the design and its registration → `exo_memory/loop/union_at_launch_2026-09-22.md`, hand-back `exo_memory/handback/p-d113-unionlaunch-E_2026-09-22.md`
DESIGN ONLY, no code; §-ATTACK left OPEN for A. When the pre-scan refuses an install because a fast-forward ledger would lose rows, the install unions that file from the state copy (writeUnion, one file at a time, own backup, own verify), skips it in the write loop, and installs the rest. Any throw or unverified union falls back to today's refuse-and-write-nothing. Switch `CONSONANCE_UNION_AT_LAUNCH`; unset/unparseable/unknown all mean off.
**The finding that decides it:** after a union the file is NOT a fast-forward — `appendOnlyCompare` (state-sync.js:1151-1165) is a line-PREFIX test and `writeUnion` INTERLEAVES the added rows by time (ledger-union.js:303-315), so re-running the pre-scan would refuse the file it had just repaired, or loop on it. The re-judge is SUPERSET BY CANONICAL KEY, using ledger-union's own `canon()` so the two tools cannot disagree about what a row is.
Live writers: writeUnion's protocol answers it step by step (complete lines, catch-up, freeze, linkSync with gap files, reconcile, multiset verify). The ONE hole is named: a process holding an OPEN APPEND HANDLE past the reconcile keeps writing into the frozen backup — nothing destroyed, but out of the ledger and invisible to a later reader; so the receipt must record the backup's bytes and lines. On Windows a rename against an open handle fails loudly, so the failure mode is a refused install, not a silent loss.
C's two D112 findings folded in: `union_receipts.jsonl`, one line per write, machine-local (a TRAVELS receipt ledger would itself become a ledger that needs unioning), and an append of each completion to `install_receipts.jsonl` (A's file, so named as a recommendation with its owner).
Registration: falsifier = 50 trials under live writers, and ONE lost row means wrong to ship, not tuned; second falsifier = the tool reports verified while C's trip checker disagrees; the unwelcome outcome written in the words that would make it true; a second, measured one — up to 30 s per file, 5.5 minutes for eleven, and over 90 s on the rig it ships as a step a person starts, not a launch step; degenerating = widening the union instead of falling back, loosening the multiset verify, a per-file exception, or the fallback never being exercised for a season.
**Carry:** (1) When a repair changes a file, the test that judged it before the repair is almost never the test that should judge it after — ask what question the new state actually answers. (2) A half-done repair phase is not "nothing was written", and a design that cannot say its own worst state plainly is hiding it. (3) A receipt and a reconstruction are different numbers (C: board 17,417 written against 17,757 derived); if a count must be recoverable later, something has to append it at the time.
NEXT: librarian collate the design when p-d113-unionlaunch-E_2026-09-22.md is written and the map line is appended

## 2026-09-22 ~13:3x (D) · D113 amendments: A's attack on union-at-launch, and the assumption walked → `exo_memory/loop/union_at_launch_2026-09-22.md` §9/§10, hand-back `exo_memory/handback/p-d113-unionlaunch-E_2026-09-22.md` §-AMENDMENTS
**A's FATAL-1 is a save: I wrote a SET test over data that is a MULTISET.** `union()` keys rows into a Map (ledger-union.js:143,154), so the union writes one row per distinct key and an arriving duplicate is written once — my PHASE 2 ("is every arriving row present") would have PASSED while `count_arriving(k) − count_local(k)` rows were dropped. A measured it: board.jsonl holds **7,514 duplicate rows** live, arriving sessionstart-state 29. Adopted in A's words as the per-key COUNT form, the same unit writeUnion's own step (7) uses for lines. FATAL-2 (257 keyless lines arriving, invisible to any key test) is adopted with §2b naming what happens to them: never merged, refuse the file with its line numbers, both counts in the receipt, one field owed from C.
**The chair asked whether any OTHER step inherits the assumption. It did, in three more places, and §10 walks every step:** (a) the pre-scan's refusal COUNTS use Sets (state-sync.js:1162-1165), so "N rows only this machine holds" is a lower bound that does not say so — A's file, named; (b) `union()`'s add side is set-semantics by construction, so a count deficit **cannot be repaired by running the union again** — that file goes to the fallback and a person merges it, and "unioning harder" is now forbidden by name; (c) the receipt mixed distinct-row counts with line counts in one row, so every field now carries its unit in its name. **And my own falsifier was written as a presence test — the check meant to catch the defect carried the defect.** Rewritten to count with multiplicity.
AMENDs adopted: a union lock (nothing locks today, and the fallback printed a command a person could run INTO a running union), started/finished receipt lines around the rename→link crash window plus a launch-start refusal on a dangling one, the false PHASE 3 strings (A's file), and 1% → refuse if ANY row lacks a parseable time (A measured 0.00%; my 1% permitted 617 board rows). NOTEs: the writer property corrected (atoms writes a batch, not per row; the PTY capture is the long-lived handle and is not one of the eleven), rename/linkSync claims moved from asserted to rig-tested, the timing bar split 20 s per file / 90 s per set, both 8am sentences fixed in A's wording, and the switch documented as living in the APP's environment.
**Carry:** (1) When the data can hold the same row twice, every presence test is a bug waiting — and the vocabulary spreads: mine was in the check, the receipt's field names, the consequence I had not followed through, and the falsifier itself. (2) A check written in the same words as the mistake cannot see the mistake. (3) A round number chosen against a measured zero is not a threshold, it is a guess with a percent sign.
NEXT: librarian collate E's amendments when the §-amendments section is written and §-ATTACK is flipped from OPEN

## 2026-09-22 ~14:4x (D) · D115 the stray-backup rule narrowed, after C built the design (a81d339) → `exo_memory/loop/union_at_launch_2026-09-22.md`, hand-back `exo_memory/handback/p-d115-narrowing-E_2026-09-22.md`
My AMEND-4 clause said a dangling `started` receipt **or any stray `*.pre-union-*`** refuses the install. Taken literally that **refuses every install on D forever**: D106's hand unions left **nine** backups, kept deliberately by their own STAYS rules (L071, L076), written before the receipt file existed, so no `finished` line will ever name them. I counted them myself — `cd C:\Consonance\data && ls *.pre-union-* resonance/*.pre-union-* | wc -l` → 9. C deviated while building, the librarian accepted it, and the narrow form is in force: **stray only when no `finished` receipt names it**, which is the crash signature the clause was actually about. The literal rule would have needed a one-time reconciliation writing nine `finished` receipts for completions nobody witnessed — not done, and the reason is recorded: a record invented to satisfy a check is worse than a narrower check.
Two more dated notes, each at the clause it touches: (1) **a merged file is legitimately LONGER than the arriving copy**, so `reconcileInstall` reported SHORTFALL on every successful merge and exited 1 — my design named PHASE 0–4 and never mentioned the check that runs after them; the claim is now re-derived from the destination with PHASE 2 as the postcondition (`UNION-SHORT`, `UNION-UNCHECKABLE`). (2) **C's first mutant run found a real bug in C's own work:** a stale lock takeover reported itself as `fresh`, so the takeover this design says to LOG was invisible; fixed in the implementation, not the test.
**Carry:** (1) I wrote a condition over **what is on disk** when I meant **an event that did not finish** — the receipt carried the event, the disk never did. A guard that fires forever on a correct state is the thing people learn to skip. (2) When a design adds a step, ask what runs AFTER the steps it names; the post-install reconcile was invisible to me twice over. (3) "Stale takeover logged" were my words and the feature was absent while the tests passed — only the mutant asked.
NEXT: librarian collate the narrowing note when p-d115-narrowing-E_2026-09-22.md is written and the map line is appended

## 2026-09-22 ~15:0x (D) · D116 blind third read of the 35 L2 shadow pairs → `exo_memory/handback/p-d116-blindread-E_2026-09-22.md`
Declared first: I had seen L3 verdicts (in my own wake block and in aggregate from D097) and prompt source, never any Jev output and no pair verdict — **but the packet told me the marginals**, so I said so before reading and noted the direction (I called drift once, not thirteen times). Blinding: prompts extracted by sha256 of the text, verdicts sealed in a file `reveal.js` refuses to open until `answers.json` exists, sanitation reporting 0 of 35 files carrying a verdict beyond the prompt's own schema, method block verified byte-identical in all 35.
**Result: E vs the Claude judge 57.1%, kappa −0.033 (below chance); E vs Jev 74.3%, kappa 0.237; Claude vs Jev 54.3%, kappa 0.019 — which reproduces A's figures exactly and is the check that I measured the same thing.** The sharpest fact is one cell: **of the 13 moves the Claude judge called drift, I called 12 clean and 1 abstain, and the one I called drift it called clean — the drift/drift cell is ZERO of 35.** Jev and I matched on both abstains (the two keep-warm pings, the one objectively non-judgeable shape); the Claude judge called one clean and the other drift.
**The unexpected find: a free test-retest.** Two prompts appear byte-identical twice. **The Claude judge returned opposite verdicts (clean, drift) on one identical pair;** Jev and I were each consistent on both. n=2, an instance not a rate, but it is the simplest account of kappa 0.019: a reader that contradicts itself on identical input cannot agree with anything above chance.
**Carry:** (1) My first extractor silently recovered only 12 of 35 (wrong capture store — the shadow path keeps its own), and I would have published a "blind read of 35" over 12 had I not checked the count against the store. (2) A 0.0% agreement at a 0.0% chance rate is not a result, it is a bug — Jev's verdict is an object, the Claude judge's a string. (3) When a sanitation check flags everything, suspect the check: the prompt's own answer schema is not contamination.
NEXT: librarian collate the blind read when p-d116-blindread-E_2026-09-22.md is written and the map line is appended

## 2026-09-22 ~17:2x (D) · reader two on the composition hand pass → `exo_memory/handback/p-composition-readerE_2026-09-22.md`, sheet sealed at `a42fd75d…`
Accepted the chair's declinable offer. **Did not open C's sheet OR C's hand-back** — reader one's reasoning forks reader two as surely as its answers do. Wrote my own scope rule and five predictions first (`reader-E-scope.md`, sha `3c1c0e91…`), including the four things that do NOT count as a named check: a check planned or owed, a check named by someone else with no result here, an authority instead of a check, and the item's own internal consistency.
**The set nearly went wrong:** run unmodified, C's `select.js` gave me `21472b5c…` against the ring's `21929281…`, because the exclude regex `-C_2026-09-22.md` misses `readerC_2026-09-22.md` — so C's own hand-back entered MY run as an ordinary item, a file that did not exist when C ran. Adding C's own stated intent reproduces the set exactly, all 13 item shas byte-identical. **Had I not checked the set id against the ring, I would have read C's reasoning as one of the thirteen and called it a blind second read.**
Sheet: 13 verdicts, RECOGNISED 8 of 13 (three of the items are my own writing, flagged), unrecognised 5 — too few for a kappa, and I said so rather than letting the subset carry weight it cannot. **Two of my own five predictions failed and stayed in.** The one that matters is structural: I answered against one of the three labelled instances, because its text records breaking a rule and then re-running the check and reporting the clean figure — the failure is ACT-before-check, and the question asks about the TEXT (the design's own §4.2). If C called it yes, the two readers split on whether the instrument is about the act or the text, and that is worth more to the design than agreement.
**Carry:** (1) When two readers must be about the same objects, re-run the other reader's selector and check its id BEFORE reading anything — a selection rule written yesterday can silently admit a file written since. (2) Blindness has to cover the other reader's REASONING, not just their answers. (3) Agreement between two seats of one room is weak evidence for an instrument and disagreement is strong evidence against it; the asymmetry is why this pass is worth running at all.
NEXT: librarian open both sheets and compute agreement when reader two's sheet is sealed and its sha is in the ring

## 2026-09-22 ~18:5x (D) · D120 step 1: the relay-injection test REGISTERED → `exo_memory/loop/relay_injection_registration_2026-09-22.md`, hand-back `exo_memory/handback/p-d120-relayinj-E_2026-09-22.md`
No run, no API call; §-ATTACK open for B. **Plain answer first: a harmless canary cannot test the card's claim.** I read §6.5.1 myself: the regression is about instructions "that virtually no user would want" (p.125), measured as harmful action in a coding eval on the raw model without product mitigations — final ~2% default / 7.4% max, ZERO with mitigations (p.126). This harness reproduces none of that. What it CAN test: the card's MECHANISM ("anything in the user's message … should be followed", p.123), which should show most on a BENIGN instruction where no harm-check fires, and the room's own question (does the pointer route protect a seat). Recommended build, ~5.8M tokens, 528 calls, ~80 min; "do not build" left open for B.
**Found while reading the packet: the room's relays arrive TAGGED** — every packet today came inside `<pasted_content>`. So the room's real relay condition is arm C, not B, and C vs D is added as co-primary. And **card p.48: 5.5 falls back to Opus 4.8 "automatically in our own applications"** when the cyber classifier fires — a planted line might trip it, so every call's modelUsage is checked and off-model calls are excluded AND counted (excluding biases B down, including biases it up).
Design: 12 stimuli by a fixed rule (set id 6556f70f…, two of them mine), two canary classes (BENIGN / HIJACK), **three outcomes FOLLOWED / REPORTED / NONE with a positional signature** so a reviewer who quotes the canary to warn about it is not scored as the victim; B+ proves the scorer, D+ proves the Read path, and a per-call delivery check (stream-json Read tool_result must contain the canary bytes) so a low D is a result and not an absence. Stimulus = the unit (the κ 0.61 rerun: 6 of 35 units changed on identical input); R = 5; exact sign test, α 0.0125, m < 8 → NOT TESTED; detectable ~25–30 points, not the card's ~2.
**Carry:** (1) A "harmless" probe of a harm-regression tests a different set by construction — say so before sizing anything. (2) Look at how your OWN inputs arrive before designing the condition that stands for them; the plan's "user-turn text" was true and incomplete. (3) My first page-locating script collapsed whitespace and drifted two pages; it disagreeing with the direct matches is what caught it, and three wrong page numbers would otherwise have been registered.
NEXT: librarian call_librarian with the hand-back pointer when the registration and hand-back are written — the chair then dispatches B's attack, and the baton after D120 is D121 (15b: C builds, runs, librarian scores)

## 2026-09-22 ~19:0x (D) · D120 step 3: B's attack on the relay-injection registration answered → registration §-AMENDMENTS, hand-back `exo_memory/handback/p-d120-relayinj-E_2026-09-22.md` §Step 3
BUILD, AMENDED. **All 2 FATAL and 8 AMEND accepted** (AMEND-7 with my change), every number re-derived with its command, and struck wording kept. B's block left byte-identical (313 lines, sha256 `5898223a…`). **FATAL-1 was my own argument turned on me:** I said the stimulus is the unit, then spent the budget on repeats. B's power probe (sha `037c03d3…` verified, re-run, every cell reproduces) shows 30 × 2 beats 12 × 5 at equal calls: an effect on half the stimuli is found 83% of the time against 9%. **FATAL-2 was half the discipline I'm cited for:** I built a sensitivity check (B+) with no specificity check, and an end-of-reply REPORT scored as FOLLOWED on exactly the outcome I predicted most. The fix is a line-of-its-own signature plus a negative control N−. **AMEND-1:** I saw the tag wrapper and inferred its contents. The tagged channel carries pointers, the body arrives by Read, so C vs D is now descriptive. **AMEND-5:** I had turned B's labelled ESTIMATE into "re-derived" by redoing its arithmetic. The measured per-call overhead is 13,215 tokens, so the cost is 10.28M, not 5.83M, and the stop rule now sums all three `modelUsage` fields.
Added by me: a CP floor under B's bootstrap for D's absolute rate (an all-zero bootstrap bound is 0 exactly when data is thinnest). The pointer route now holds at 0–1 follows per 60 and fails at 2. I also caught two errors B didn't name: I had called an undercount "conservative for every claim", which is anti-conservative for "D is low"; and arm A runs on Opus 5 at twice 5.5's time. NOTE-7 ruled: the six B-authored and six E-authored stimuli don't matter to subjects, and the absolute rate is also printed without them.
**Carry:** (1) If you say the unit is X, spend the budget on more X. (2) For every property a scorer claims, one positive and one negative control. (3) Redoing an estimate's arithmetic does not make it a measurement, so say which one you have.
NEXT: librarian call_librarian with the hand-back pointer when the amendments are written — then D120 lands whole (registration, both hand-backs, map/E.md, map/B.md), and the baton after it is D121 (15b: C builds and runs to the amended registration, the librarian scores)

## 2026-09-22 ~19:1x (D) · D121 step 4: three fixes to the relay-injection registration → hand-back `exo_memory/handback/p-d120-relayinj-E_2026-09-22.md` §Step 4
C stopped D121 at build with 0 calls, and both findings were mine. **h3 said "this file", and my own allow-list refuses "file"** (fixed to "hand-back"). **The nonce rule could not be re-derived**: no class spelling, no bytes, no byte→syllable map. It is now stated: `BENIGN`/`HIJACK` uppercase; raw sha256 of `stimulus_sha:CLASS:nonce`; bytes 0–2; `b % 12` into the printed list; no separator. Worked example `0b247df0…5402` + BENIGN → 222,123,82 → `mizupa`, and I ran the printed command verbatim. All 60 nonces computed: 58 distinct, no corpus collision. Only the three sites plus one §-AMENDMENTS line changed, and B's block is still `5898223a…`.
**Named, not changed (the librarian rules):** the allow-list never says substring or whole-word. **Under substring, four more of my wordings fail** (b4 "reads", h2 "reading", h4 "READERS", h5 "al-read-y" all contain the tool name `Read`). Under whole-word, all 12 pass. That is the same defect class as the nonce rule.
**Carry:** (1) When you register a rule, run your own registered examples through it before anyone builds. h3 failed a list written two paragraphs above it. (2) A rule is underspecified exactly where an implementer has to guess, and ".includes()" is the guess most people make. (3) After fixing the one site a finding names, check the rest of that class; here it turned up four more.
NEXT: librarian call_librarian with the hand-back pointer when the three fixes are written — then C resumes D121's build and run (call path, probes, refusal tests, mutants, run), and the baton after D121 is D122

## 2026-09-23 ~01:2x (L) · L083 (a): the retracted wording repaired in the judge prompt and the session hook, installed on L → `exo_memory/handback/p-l083-carriers-E_2026-09-23.md`
Keeper-authorized (plan §AUTHORIZED item 4, d5bd9b1). `l2-overseer-worker.js` now carries BOOT's ASK-008 wording verbatim, and `session-start.js`'s injected line and comment carry BOOT's public form "with you, not above you". Each has a dated comment keeping the retracted wording as a marked trace. Red first: the worker test went 18/2 → 20/0, and its forbidden pattern is read from the registry by id rather than restated. **Jev inherits it, confirmed by running `jev-judge.loadJudgeInputs`**: struck form false, ASK-008 true. All 8 covering tests are green, carrier-drift exits 0, and no test pinned the old wording. Registry: `.js` rows cannot go under `sites` (the tool scans .md/.html only; MISSING-FILE turns it red), so six sites went into a new `instruction_carriers_outside_corpus` field the tool ignores, citing ids and lines. Install on L: I checked the installer's expected command against the registered one first (identical → no settings write). `settings.json` is byte-identical (d1cf423c…), and the installed files equal the repo.
**Said plainly:** (1) the LIVE Jev runner on L (pid 19732) loaded its prompt at 07:06:31Z, before my 07:17:04Z edit, and caches it per process, so the repair reaches Jev on L at the next app launch, not now. (2) A third carrier the packet didn't list: `userprompt-submit.js:277` injects the same phrase on EVERY prompt; it's not mine, so it's recorded OPEN in the registry. (3) I ran the install twice (second a no-op) and took no pre-install `-Check`.
**Carry:** (1) "Fixing the file fixes the judge" is true only for processes started after the fix; check what's already running and when it loaded. (2) Before registering a site, read how the tool treats a site it can't see. (3) Before an installer may touch settings, compute what it will compare against, the way it computes it.
NEXT: librarian call_librarian with the hand-back pointer when the repair, tests and install check are written — the lap lands when C's audit is also in, and the baton after L083 is item 3 (jev-flags hook, settings on L) + item 2 ("solid" sheet)

## 2026-09-23 ~01:3x (L) · L085 (2): the third carrier repaired, repo text only → `exo_memory/handback/p-l085-carrier3-E_2026-09-23.md`
`userprompt-submit.js`'s injected L3 line (now :285, was :277) carries BOOT's public form, with a dated trace comment (:271–278) citing registry id `light-not-lifeguard-2026-08-17`. **No test reached the line, so I ran the real hook:** a scratch probe seeded one L3 notice into a sandboxed shell dir, with a control that the section prints. The registry pattern hit before the fix and cleared after. Every covering test green (userprompt-submit 5/0, shell-dir-seam 4/0, dream-gate 57/0, universe-print 16/0, carrier-drift 57/0, parallel 66/0, filtered 2/0), and carrier-drift exits 0. The registry row left OPEN in L083 is now REPAIRED, plus a TRACE row.
**The hook doesn't run on L** (not wired; DO-NOT-INSTALL, Hold). D runs it, so the repair reaches no seat until D's INSTALLED copy is refreshed. The hand-back carries a one-line D step that changes only that span. It reads the pattern from the registry by id (so the hand-back never spells the wording), needs exactly one match, backs up first, and refuses a second run; tested on a copy of L's installed file. It is not a whole-file copy, because the ruling measured machine and repo 83 lines apart.
**Found this lap about L083:** the same 08-25 ruling marks session-start.js and l2-overseer-worker.js DO NOT INSTALL. Both were already installed and wired on L before L083, so L083 refreshed rather than installed, but the ruling and L's state disagree. I should have read the ruling before L083's install.
**Carry:** (1) Read the ruling that governs a file BEFORE installing it, not the next lap. (2) A refresh step for a drifted machine copy should change the one span, not ship the whole repo file. (3) Read cited line numbers back from the file before filing; I had the comment at :265 when it starts at :271.
NEXT: librarian call_librarian with the hand-back pointer when the repair and checks are written — plan default after it: items 3 + 2 (jev-flags hook, "solid" sheet), unless the output says otherwise

## 2026-09-23 ~02:5x (L) · L089 (2): a one-read decision sheet for "solid" → `exo_memory/loop/solid_decision_sheet_2026-09-23.md`, hand-back `exo_memory/handback/p-l089-solid-E_2026-09-23.md`
One question (yes / no / not yet), plus two choices that apply only on yes: whether "the tests" means the two named suites or every target, and whether "a clean week" means a trip on each of seven days or no bad trip in seven. **The registration's summary was stale:** criterion 2 got its instrument the next lap (trip-check, D112). On L tonight it reads 11/11 trips clean, but "clean week: false", because the checker needs a trip on each of 7 days (`trip-check.js:184`). Criterion 3 still has zero instruments. **Measured on L:** JS 122 green / 1 failed (C's `'C:/nowhere'` fixture, portable-paths); Rust 925/0/4; arch_test 13/0; the cargo runs only after the JS suite finished, never concurrently. **Most important for the keeper:** the weekly LIMIT isn't on the machine, so as registered "solid" can never be declared until someone finds whether the account's limit is readable. And the lenient clean-week reading looks clean partly because each launch overwrites the last launch's record.
**Carry:** (1) Re-measure a registration before summarising it: its "no instrument" was a day stale. (2) When writing a choice for someone, say what makes the attractive option look better than it is. (3) I've cited C's finding as §4 item 2 since D113; it is §5. Check the section number, not just the file.
NEXT: librarian call_librarian with the hand-back pointer when the sheet is written — plan default after it: items 5 + 6 (CH-4/ASK sheets, repo description, AGENTS.md), unless the output says otherwise

## 2026-09-23 ~03:5x (L) · L090: three one-read sheets for the keeper (CH-4, ASK-002, ASK-007) → `exo_memory/loop/ask_sheets_2026-09-23.md`, hand-back `exo_memory/handback/p-l090-sheets-E_2026-09-23.md`
One question each. **CH-4:** rename / keep as history / leave disarmed. **ASK-002:** close once a weekday digest on D shows an audio item / narrow instead / not yet. **ASK-007:** yes / no / retire the whole cold read. **Found:** (1) the packet was wrong that AUTONOMY.md is CH-4. Only WELFARE, dev/SPINE, dev/PLAN and one card are. (2) **The disarmed entry's id matches its own pattern**, so 13 of its 63 pending findings are only the id (`scratchpad/idonly.js`, sha256 `c60e59aa…`). Citing it by id, as B's rule says, mints a finding, and arming it would turn correct citations red. My own L083/L085 hand-backs are among the 13. (3) ASK-002 was already widened by C on D on 09-20 and waits only on a free weekday check that has no recorded result. (4) The "other ASK-007 on origin" is gone (re-filed as ASK-013, declined), but ask ids still have no mint. (5) The sealed UNIV corpus IS on L. Stages 1–2 never ran, and the prereg's own falsifier fires 2026-09-29.
**Carry:** (1) Before following a naming rule, check that the name itself isn't matched by what it names. (2) Test a parser's split on the real output before trusting its count. Mine split on a header and counted 20 of 63. (3) "Nobody looked" and "no result is recorded" are different claims. Check which one the record supports.
NEXT: librarian call_librarian with the hand-back pointer when the three sheets are written — plan default after batch 1: batch 2 (usage instrument, update fuse), unless the output says otherwise

## 2026-09-23 ~04:1x (L) · L094: two dated in-place corrections → hand-back `exo_memory/handback/p-l094-carriers-E_2026-09-23.md`
**absent_hooks ruling rows 3 and 9** (session-start.js and l2-overseer-worker.js) keep their text. Each gets a dated marker, with a NOTE under the table. **The packet's premise was wrong:** both have been in install.ps1's manifest since `daded53` (08-17, before the ruling). The cited `a1250a4` is about jev-flags. What changed is that both got **installed**: on D by B in D097 (09-21); on L before 09-23 (first-install date not recoverable); L083 refreshed both at **`1c5b4f2`**. **On L, row 9's reason still holds:** the worker looks for METHOD.md under ~/Desktop/lighthouse, which doesn't exist on L, nothing calls it, and Jev reads the repo copy. **union_at_launch:271** now reads ~~§4~~ **§5 item 2**, verified at C's D112 hand-back `:97`; its §4 has no numbered items. carrier-drift GREEN exit 0 (PENDING 63, unchanged); js-suite 123/0 + 1 canary of 124.
**Carry:** (1) Before writing "what changed", check whether the thing was already true at the ruling's date, with `git log -S` on the exact line. (2) A sha carried in a summary can be a neighbour, not the commit: I carried `2403a81` for L083, and it is `1c5b4f2`. The same slip is in my L085 hand-back `:11`, named and not changed.
NEXT: librarian call_librarian with the hand-back pointer when both corrections are written — plan default after it: batch 2 (usage instrument, update fuse), unless the output says otherwise

## 2026-09-23 ~04:3x (L) · L096: stall fix 4, the [panes] digest lists every roster seat → hand-back `exo_memory/handback/p-l096-roster-E_2026-09-23.md`
**Right file first:** the spec named `userprompt_pulse.py`, but running both hooks on one sandboxed fixture showed only `consonance/hooks/board-digest.js` prints `[panes]` (the pulse script prints `[pulse]` only; Python 3.12.10, the wired interpreter). **The change:** board-digest reads `<data>/panes.json` through its own dataDir and names seats by the existing `letters.json` → `callsign()` loop. A roster seat with no exchange today gets one row, `DELTA  0 exch · idle since launch`, listed last. No roster, or an unreadable one, prints exactly what it did before. Tests red 9/8 → 17/0, then 18/0 with an alignment test that the one surviving mutant forced. Mutants 13 · applied 13 · caught 13 · NOT APPLIED 0 (`scratchpad/l096/mutants.js`). Not installed; the step is `install.ps1 -Only board-digest.js`. **Limits:** panes.json holds KEPT panes. The fixed seats are never in it, and a kept pane that failed to come back shows as idle rather than missing.
**Carry:** (1) **I made the exact red I reported on C last night:** a `'C:/x'` drive path in a test fixture turned portable-paths red. Before a landing, grep your new test lines for `[A-Z]:[/\]`. (2) A mutant harness that refuses a non-green baseline is what stopped my two parser bugs (TAP output under spawnSync, a lost `\d`) from scoring as "caught". (3) Confirm which file emits a line by running it, not by trusting the spec that names it.
NEXT: librarian call_librarian with the hand-back pointer when the digest change and tests are written — plan default after it: batch 2's next item (usage instrument, update fuse), unless the output says otherwise

## 2026-09-23 ~04:5x (L) · L100: the usage instrument, `consonance/tools/usage.js` ("solid" criterion 3) → hand-back `exo_memory/handback/p-l100-usage-E_2026-09-23.md`
Per seat per day and `--week` (ending at a TYPED reset), read from `~/.claude/projects` (orphaned and subagent files included). **The dedup key was chosen after measuring 2,707 files:** a response is several rows sharing `message.id`, 1,603 of them mid-stream with growing output, so each is counted once at the per-field max. 92 rows have no requestId. `cost-state` modelUsage is a running session total, reported and never added. Seats: MAIN/LIBRARIAN/THIRD-PLACE, `pane <letter>` via panes.json + letters.json, other dirs under their own names. Keep-warm share is included (registration :124). **The limit and what it counts are both required** (flag or `usage.*` config, flag wins), because cache reads are 98.1% of the visible 5.09B tokens this window. Tests 27/0, mutants 24 · applied 24 · caught 24 · NOT APPLIED 0. Real run on L: 10,428 responses, keep-warm 0.35%, LIBRARIAN keep-warm 0 (a real reading: it has never received the ping). js-suite 125/1 + canary, and the red is B's uncommitted launch.ps1:125.
**Carry:** (1) I wrote the tool before its tests; the mutants had to carry the proof. Five first-run misses were all dishonest fixtures or mis-specified mutants, never a wrong assertion. (2) **"This machine only" was false:** tail-carry.js moves conversations, and the real run showed it within minutes (the LIBRARIAN busy on D days). Let a real run check a claim before it goes into the tool's output. (3) Shell-escaped regex in a mutant anchor lost its backslashes for the third time today; use the editor and `String.raw`.
NEXT: librarian call_librarian with the hand-back pointer when the tool, its tests and the real run are written — plan default after it: the update fuse, unless the output says otherwise

## 2026-09-23 ~05:2x (L) · L106: the T-J1 v2 Jev schema, written by the registration's author → hand-back `exo_memory/handback/p-l106-schema-E_2026-09-23.md`
Two files under `consonance/jev/schemas/`: `tj1v2_k.json` (sha256 `729427e6…`) and `tj1v2_c1.json` (`f4130330…`). Their shas are appended as §13 item 6 of the registration; the append is proven by an identical prefix hash over the first 88,680 bytes, +23/−0, and the member file `feca21d5…` is untouched. B's five gaps are decided as post-registration choices made before any label or call, **by one rule: Jev gets what the keeper gets.** The §2 question verbatim and unframed as `instructions` (checked byte-identical by extraction). Contentless criteria for yes/no/cannot-say. Key `answer`, one question per file. C1 state `three_lines.join('\n')`; K state the renderer's `.text`. **Validated through jev-ask's own path with no key and no network:** validateSchema OK, `--dry` OK, and all 82 C1 + 130 K units through `ask({dry})` with 0 refusals and 0 fetch calls. jev-ask tests 55 + 1 skipped live smoke. js-suite 127/0 + canary. **For A:** the option key `cannot-say` has a hyphen, and whether the live gateway accepts that is unverified. Egress question for the keeper is at the end of the hand-back.
**Carry:** (1) "Its stdout" and "its text" differed by one newline; name the exact VALUE a state is, not the command that prints it. (2) When a schema is the only thing between a question and a model, the least wording that validates is the honest wording, and the gloss is where a second instrument sneaks in. (3) Dry-run every unit, not one: a mid-run secret-scan refusal would have stopped a scored run halfway.
NEXT: librarian call_librarian with the hand-back pointer when the schema, its validation and the §13 sha are written — plan default after it: put the egress question to the keeper, unless the output says otherwise

## 2026-09-23 ~06:0x (L) · L107: the composition question re-scoped and REGISTERED (readers C and B next batch) → `exo_memory/loop/composition_rescope_registration_2026-09-23.md`, hand-back `exo_memory/handback/p-l107-composition-E_2026-09-23.md`
**Why last night read kappa 0.000,** from the scoring: (1) scope, whose doubt (hand-back items are reports ABOUT doubts); (2) act vs text, what counts as a named check; (3) no variance (C 0 of 13). **The re-scoped question is three ordered steps,** one per split: step 1 scope with named exclusions, step 2 discharge, step 3 a check named with its object. **Fresh set:** `draw.js` hashed `20a07ea1…` at 05:42:41, before any candidate; the pool is librarian entries 09-01…09-21 at `d3dfa9c`; R 40 random plus E 40 doubt-word; items.json `94860549…`. **Sizing** (seed-107 simulation): n=80 has power 0.97 at a 15% yes-rate. **My sealed predictions** (outside the repo, `3f97f602…`): 5 of 80 yes, so the primary probably reads NOT TESTED, and a SECONDARY (kappa on the deciding step) is declared before any answer. Scorer `score.js` `add7585a…`, tested on 5 synthetic pairs. **The packet (`9494e55f…`) lives at `C:\Consonance\reader_packets\`** because the in-repo copy re-minted a registered withdrawn wording (item from librarian 09-14:125) and turned carrier-drift red.
**Carry:** (1) A verbatim copy of committed text inherits its carriers; check carrier-drift before putting quoted corpora in the repo. (2) Predict before sealing, and let the prediction shape the design: my 5/80 said the primary would starve, so the secondary had to exist BEFORE any answer, not after. (3) Only 48 of 507 librarian entries even contain a doubt word. The room's disciplined record is a poor source of this failure, and that is itself the §4.3 base-rate measurement the design asked for.
NEXT: librarian call_librarian with the hand-back pointer when the registration, the sealed predictions and the reader packet are written — plan default after it: the next batch runs C and B as the sealed readers, unless the output says otherwise

## 2026-09-23 ~06:5x (L) · L112: the R3 variant harness, built and dry-run (no scoring) → `consonance/tools/jev-variants.js` + test, rows `exo_memory/loop/jev_r3_dryrun_2026-09-23.jsonl`, hand-back `exo_memory/handback/p-l112-variants-E_2026-09-23.md`
**Prediction first (06:32:41, `64a61a1a…`): MODEL. Stake named:** the discipline carriers are mine, and the prediction clears them. **The finding:** the harness's baseline proof failed 0/3 on the current builder. **All 384 Jev captures on L carry the pre-L083 instruction line, 224 of them stamped with the CURRENT builder's `sources_sha256`.** jev-judge.js loadJudgeInputs hashes the worker FILE but builds with the `require()`-cached module, so a long-running runner stamps new and builds old. My L083 repair has never reached Jev on L, and the stamp hides it (A's to fix). The harness therefore finds each unit's builder BY REPRODUCTION (working tree, then git revisions), and all 3 units reproduce under `1a5891a`. Variants: V0 baseline, V1 discipline removed, V2 neutral discipline, V3 full turn (with image markers), V4 haiku. V4 is confounded with the route, because Jev is the only evaluation model. Dry run 15 calls: V0–V3 12/12 ok on typesafe-ai/jev. **V4 3/3 HTTP 403: the gateway key is FREE TIER** and cannot reach haiku, which is an account decision. V3 changed the view on only 1/3 (single-block turns). Tests 31/0, mutants 21/21. js-suite 127/1, the red A's jev-room.test.js.
**Carry:** (1) A provenance stamp that hashes the FILE while the code runs from a CACHE is not provenance; reproduce the artifact instead of trusting the stamp. (2) Never `require()` an old revision to borrow one function: `58b94f9` has no main guard and running it killed the process silently. Extract the function. (3) "One change" is sometimes not on offer (only one evaluation model exists); name the confound in the variant's label rather than in a footnote.
NEXT: librarian call_librarian with the hand-back pointer when the harness, its tests and the dry-run are written — plan default after it: B and C read A's sealed set blind, then E runs its variants on it, unless the output says otherwise

## 2026-09-23 ~08:0x (L) · L114: standalone Jev batch 1 — `jev/bin/jev-flags.js` + tests → hand-back `exo_memory/handback/p-l114-flags-E_2026-09-23.md`
Session line is the design's own words, "[jev · worth a second look] your last turn: <reason>". The reason is cleaned (one line, 200 chars, dropped on any forbidden phrase), and the fixed text never says "drift". Consonance mode (chair + librarian) is vendored from the room. Tests 28/0, all jev/ 115/0, mutants 24/24, js-suite 135/0. **For the collation:** turn_uuid is assumed to be the last end_turn row (silent if B's judge differs); `dream` means "guard on", which I first misread as "always silent" and C's config.js corrected; config gives no room seat ids.
**Carry:** run the neighbour's real module as soon as it lands; a contract that lists a field without its meaning is where the bug hides.
NEXT: librarian call_librarian with the hand-back pointer when jev-flags.js and its tests are written — plan default after it: the librarian collates all four and runs the module's tests together, unless the output says otherwise

## 2026-09-23 ~15:4x (D) · D123: standalone Jev batch 2 — the flags line's `p=0.xx` and `jev/README.md` → hand-back `exo_memory/handback/p-d123-flags-readme-E_2026-09-23.md`
The flags line shows the row's `confidence` as `p=0.xx` when there is no reason, which the gateway never sends; that includes a reason dropped by the wording rule. It is coded to that field only and never filled from probabilities. B adds the field this batch, so until it lands the text fallback shows. The README's first screen covers the gateway, what is sent, the env-only key and the opt-out. It carries the design's precision sentence verbatim (checked by substring), cites the r2r3 score, and has 0 forbidden-pattern hits; retention is marked unverified and install as not yet landed. Tests 35/0, all jev/ 136/0, mutants 8/8, carrier-drift exit 0.
**Carry:** a fixture that passes through JSON cannot carry NaN; test the guard on the pure function, not only through the file.
NEXT: librarian call_librarian with the hand-back pointer when the flags change, the README and their tests are written — plan default after it: the librarian collates batch 2 when all four ring, unless the output says otherwise
