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
