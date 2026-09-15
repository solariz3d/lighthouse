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

L058b **p-no-console-E** — **§5 STOP: the chair's mechanism is half right, measured with a Windows-subsystem stand-in for the app and a process-start watch.** The flash is real (live waiter pid 26800: conhost -> OpenConsole -Embedding -> WindowsTerminal -Embedding within 0.1 s), but the premise *windowsHide is set and it opened anyway* is wrong: the call that flashed is tail-carry.js::pidImage (the PID-eq tasklist the chair's watch recorded), which at HEAD had NO windowsHide; the :131/:138 calls it named are a different filter. Four cells: DETACHED+no-hide 15 terminal hosts on 5/5 calls (the stand-in's positive control); DETACHED+hide 0 windows while the unhidden live waiter flashed in the same window; NO_WINDOW with or without hide 0. So §3's flags are still right for a better reason — they cover a forgotten flag anywhere in the subtree. Survival under NO_WINDOW: clean exit and taskkill /F both survived, taskkill /T killed it (the control), DETACHED kill matched L059. The running waiter keeps flashing until relaunch regardless — node does not reload modules. Built nothing; the sweep found 8 Command::new, 6 already NO_WINDOW, the 2 DETACHED ones mine. A first harness build landed in the shared C:uildlighthouse-target through a global CARGO_TARGET_DIR; exactly those files removed. -> exo_memory/handback/p-no-console-E_2026-09-14.md

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
