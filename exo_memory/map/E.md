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
