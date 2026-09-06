# P-LIB-CHANNEL — the librarian's channel stops needing a click

**Seat:** E (pane ECHO) · **Lap:** L041, chunk 1(b) · **2026-09-06, 04:30–05:40**
**Plan read at the file:** `exo_memory/librarian/2026-09-06.md` 04:00, 04:35, 04:52 (`cb43059`, `ddd1757`)
**Nothing committed.** Tree is dirty; every path this packet touched is named in §9.

---

## 0 · THE BAR, AND WHERE IT STANDS

> *One librarian send to the chair lands with NO CLICK and NO REFUSAL.*

**Not met by this hand-back, and it cannot be — it needs the rebuild.** What is met is
everything up to it: the refusal is constructed, the exemption is landed, the click is removed on
the pull path, the card renders where the receiver is, and the wide-exemption mutant goes red.
The bar is one observation away and the observation is post-rebuild (§8).

**I did not refuse the packet.** The chair asked me to refuse if the inbox does not cover what the
station guard covered for this verb. **It did not — and the reason is a hole in the inbox, not a
reason to keep the lock.** §2 is that finding, and closing it is the first of this packet's two
edits, in that order, because an exemption cannot rest on a guarantee the code does not make.

---

## 1 · THE THREE PIECES, LANDED

### Piece 1 — `call_chair` exempt from the station guard (`mcp.rs`)

`required_station("call_chair")` was `Some("librarian")`; it is now `None`, and the
`auth_station("call_chair")` call is **deleted from the verb's body** rather than left inert. A
gate that is called and cannot change the answer reads as present from every angle except a
careful one — the room's own silent-absence class, and `p-commit-gate_2026-09-02.md` §7 named it.

The mount gate is untouched: `auth_librarian("call_chair")` still runs first, and
`the_exemption_does_not_take_the_mount_gate_with_it` asserts both halves — the mount gate present,
the station gate gone. Without that assertion the exemption's obvious sloppy form (delete both
lines) would pass every other test in the file and hand the librarian's channel to every pane.

### Piece 2 — a librarian `raise_pull` delivers without the click (`mcp.rs` + the pull consumer)

Two edits, and the ORDER is the argument (§2):

1. **`deliver_pull` now passes `gate_or_queue` before it writes.** All four callers — the keeper's
   click, `chair_decide`, open-channel auto-approve, and the new channel.
2. **`pull_delivers_without_a_click(seat, resolved_target)`** — pure, tested, two conditions:
   the pull's seat came from the LIBRARIAN's mount, and the target ALREADY RESOLVED to the
   destination `ADDRESS_TABLE` gives `("librarian", "call_chair")`. It is checked in the consumer
   **before the intensity threshold**, deliberately: a suppressed pull is silent to its target, and
   a return leg that drops below a number its sender does not know about is the ferry problem with
   an extra failure mode.

**`PullRequest` gained `seat`, written by the server from the mount.** `RaisePullArgs.from` is a
free string the caller composes (`from.unwrap_or("unknown")`). Keying the channel on it would let
any pane pass `from: "librarian"` and write into the orchestrator unclicked — which is
**`post_board`'s `tag` defect**, twenty lines below it in the same file, walked back in through a
new door. `raise_from_forming` (main.rs) has no mount and is given `seat: String::new()`
explicitly, so an unmounted pull is a visible decision rather than a default.

`raise_pull`'s tool description now says the channel exists and says it is gated by the mount, so
the librarian can find it without reading this file. The seat-alias note (`seat_alias.rs`) records
that this verb's docs and its resolver had never agreed; this is the same debt, paid on the piece
I was in.

### Piece 3 — a card renders in the TARGET's tab (`gate.rs`, the consumer, `term.js`, `app.css`, `index.html`)

`GateCard` gained `target_pane`: the session id `resolve_pane` already produced in the consumer,
resolved ONCE and used twice (the channel test, and the card). `term.js` routes on it —
`gateCardHost()` walks to the pane's `section.tab` and gets-or-creates a `.gatecards` stack there,
falling back to the shipped `#gatecards` for a pane in the terminal grid, an unresolved target, or
an unknown id. **This can move a card; it cannot lose one**, and that is a test.

**No second resolver in JavaScript.** The card carries the answer; the UI never re-derives it.
`resolve_pane_delegates_and_never_matches_prefixes_itself` says the same thing about the Rust
side, and two resolvers is how the 09-06 defect happened in the first place.

**THE HALF THAT KEEPS PIECE 3 FROM BEING A LATERAL MOVE.** A card correctly filed in the
Orchestrator tab is exactly as unread, to someone sitting in Terminal, as the card in Terminal was
to someone sitting in the Orchestrator. So the tab says it holds one: `refreshGateBadge` marks the
tab button and names the count, **tracked off the DOM** (present iff that tab holds an undecided
card) rather than off an event, so there is no second copy of the state to fall out of step. It
does **not** clear when you open the tab — an undecided card is still undecided after a glance,
and a mark that clears on attention is how 39 hands went unread.

*Distinguished from the retired render, because it looks superficially like it:* the per-tab aura
(`loop_indicator_design_2026-09-02.md`, amendments 2–3) tried to show WHERE THE BATON IS and was
superseded by the logo because a marker between two tabs misreads on one hop. This says *a
decision is waiting here* and is anchored to the tab that holds the thing. No direction to
misread.

---

## 2 · THE FINDING THE PACKET'S OWN PREMISE DEPENDED ON, AND IT WAS FALSE

The brief's argument for the exemption is: *the station guard on `call_chair` is a second lock on
a door the inbox already holds.*

**Measured, at the call sites.** `gate_or_queue` had three callers:

    $ grep -n "gate_or_queue" consonance/src-tauri/src/main.rs
    6725:fn gate_or_queue(...)          the definition
    7142:  chair_inject_exec
    7232:  librarian_call_exec          <- call_chair's actuator
    7298:  pane_call_librarian_exec

**`deliver_pull` was not among them.** It called `inject_to_pane` directly. So for the verb the
exemption is ABOUT, the premise held — `call_chair` goes through `librarian_call_exec` and was
already inbox-gated. **For the path piece 2 builds on it did not**, and every approved pull ever
delivered — the keeper's click included — could land mid-turn in a working pane. That is precisely
the splice the whole inbox exists to prevent, and it was reachable by the most ordinary act in the
system.

**Declared in-scope rather than done narrowly.** Gating only the new librarian path would leave
one function with two delivery semantics decided by who called it, which is how this class returns
wearing a different caller. **The cost, stated so nobody reads it as a regression:** an approved
pull into a BUSY pane now reads `QUEUED` and then `DELIVERED` on the board instead of rendering at
the instant of the click. Nothing is lost — the inbox is FIFO and never drops — and the bounded
hold still force-delivers. **A watcher of the wake proofs should not read that QUEUED row as
proof 2 failing.**

---

## 3 · THE HONEST RESIDUAL — what the exemption does NOT buy

Two things the station guard did that the inbox does not:

**(a) The bounded hold, and it is a real splice window.** `MAX_HOLD_MS` is 240s and
`drain_decision` returns `Forced` past it. A chair turn longer than four minutes can therefore
still be written into by a librarian call that the old guard would have refused outright. **This
is the price and it is C's P-READY-SIGNAL (chunk 1c), not this packet's.** It is asserted rather
than written in prose — `the_residual_is_the_bounded_hold_and_it_is_still_four_minutes` pins both
the constant and the `Forced` decision, so when the bound is replaced by a positive ready stamp
somebody has to come back and restate the price.

**(b) Turn-taking, which the inbox does not model at all.** The inbox decides WHEN a message
lands; it has no opinion on whether the sender was entitled to speak. That loss is real and I
claim it is the right one, for a reason that is checkable rather than a feeling: **the exemption
removes a gate on SPEAKING, not on ACTING.** `chair_inject` — the verb by which the chair actually
moves work — keeps its station, and so does `call_librarian`. The one-station rule's teeth are
where they bite. A librarian message arriving between the chair's turns is the loop coming back,
which is the thing the rule was protecting.

**What would make me wrong:** a case where the librarian speaking to the chair, unasked, causes
the chair to act out of turn. I could not construct one, because the chair's acting verbs are
still gated. If someone constructs it, the exemption is wrong and the case is worth more than the
feature — which is what the chair said, and I agree.

---

## 4 · RED FIRST, AND THE HONEST ORDER

**Piece 1 was genuinely test-first.** The three assertions were written and run against the
unchanged source:

    the_librarian_reaches_the_chair_while_the_chair_holds_the_lap   FAILED
    the_exemption_is_exactly_one_verb_wide                          FAILED  left: []  right: ["call_chair"]
    the_exemption_does_not_take_the_mount_gate_with_it              FAILED
    test result: FAILED. 8 passed; 3 failed

**Pieces 2 and 3 were not.** Their tests were written beside the code and went green on the first
run, so their reds were demonstrated **by mutation, after the fact**. That is a weaker order and I
am saying so rather than describing all three as red-first.

### The mutants, each caught by its own assertion

| # | mutation | result |
|---|---|---|
| 7a | add an explicit `"call_chair" => None` arm to the station table | **GREEN — a no-op.** See below. |
| 7b | **THE CHAIR'S NAMED MUTANT** — exempt a second verb (`"chair_inject" => None`) | RED · `left: ["chair_inject", "call_chair"]` |
| 4 | drop the target condition — the librarian bypass at any target | RED · `the_librarian_may_not_write_unclicked_into_a_pane` |
| 6 | remove `gate_or_queue` from `deliver_pull` | RED · `every_delivery_into_a_pane_passes_the_inbox…` |
| 1 | `gateCardHost` always returns the terminal stack | RED · 6 of 12 UI assertions |
| 2 | drop the tab-title restore | RED · `THE SHIPPED TAB TITLE SURVIVES A BADGE CYCLE` |
| 3 | revert `.gatecards` to `#gatecards` in the CSS | RED · the class-key assertion |

**Mutant 7a is a finding, not a miss.** My first attempt at the chair's mutant was to ADD
`"call_chair" => None` to the match — and nothing happened, because `_ => None` already covers it.
**The exemption is expressed as an ABSENCE**, which means a typo in a verb name in that table
silently exempts the verb. `the_exemption_is_exactly_one_verb_wide` measures over a literal
`ACTING_VERBS` list and would NOT catch a rename; what catches it is the wiring test that pins the
literal `auth_station("chair_inject")` in the body. The pair covers it. **Neither alone does**, and
a future edit that removes one should know that.

### The canary handshake (`consonance/ui/gate-card-routing.test.js`)

`assert.fail` inserted → js-suite listed the file under FAILED (77 discovered, 3 failed). Removed →
2 failed. **The first attempt appended the canary below `process.exit` and it never fired.** The
handshake caught its own dead-code mistake, which is the argument for running it at all.

**Why that test file does not look like the other UI tests.** `librarian-wiring.test.js` checks
that a NAME exists on both sides of a boundary — right for its defect, wrong for this one. Here
the card was correctly created, correctly filled, and appended to the wrong parent; every name was
already present on both sides, so a source-reading test goes green over the whole class. So the
two functions are lifted out of `term.js` and RUN against a DOM stub small enough to hold in the
head — **a stub built so it can lie**, since a stub that answers correctly for everything tests
the stub. `term.js` cannot be `require`d (it wires live handlers at load), so the region between
two stable markers is extracted and evaluated, and extraction failure is loud.

---

## 5 · WHAT I FOUND WHILE BUILDING, THAT NOBODY ASKED FOR

- **The naive badge would have permanently deleted the Librarian and Third Place tab titles.**
  Those buttons ship with a title that teaches the seat; `removeAttribute('title')` on the first
  decided card erases it for the life of the window. Stashed once and restored. It has a test
  because I only found it by writing one.
- **`#gatecards` was ID-keyed and a second container inherits nothing.** This is the 2026-08-22
  `#main`/`#mainpane` defect one floor up, and `app.css` says so in its own comment forty lines
  down: *"the parts that were classes worked and the parts that were IDs did not."* Converted to
  `.gatecards` per that precedent rather than duplicated, which would set the same trap for a
  third container. `.tab.seat` gains `position: relative` — without it an absolutely-positioned
  stack escapes to the viewport, and **no JS test can see that**; it is asserted as a rule name.
- **`lap_holders.rs`'s prose is now stale in two places** (`:85`, `:159` — *"refuses `call_chair`
  because no open lap is held by the librarian"*). The assertions are still correct and still
  meaningful; only the example is dead. **A's file, not mine — routed, not edited.**

---

## 6 · DECLARED OUT-OF-SET EDITS

Three, all one-liners, all named here rather than discovered at landing:

1. `consonance/src-tauri/src/gate.rs` — `GateCard.target_pane`. The card is the pull consumer's
   own payload type; the alternative was a second event carrying the id, which is worse.
2. `consonance/ui/app.css` — the ID→class conversion, `.tab.seat { position: relative }`, and the
   `.gcpending` rule. Piece 3 does not work without them and they cannot live in `term.js`
   without duplicating the shipped rule, which is the drift the file's own comment warns about.
3. `consonance/ui/index.html` — one attribute: `class="gatecards"` on the shipped stack.

---

## 7 · THE FOUR EVAPORATED APPROVED HANDS — re-derived, and disposed

The chair's **four** and my earlier **three** are different sets, not a disagreement. The
instrument is `deliver_pull`'s own audit rows (ten in the board's whole history); mine counted the
RESOLVER subset.

| when | hand | outcome | disposition |
|---|---|---|---|
| 2026-07-13 | → a human-driven pane | `NOT delivered — HUMAN-DRIVEN` | **not an evaporation.** The guard worked and said so. |
| 2026-07-27 | `forming -> ` (empty target) | `no target to deliver to` | **DEAD, and a live defect.** §7a. |
| 2026-08-24 | `librarian -> Main` | `no live pane matches 'Main'` | **DEAD.** Card `9ff882d4`: the Cycle 1 map+plan, pointing at `librarian/2026-08-24.md ~03:38`. Content on disk, packet long since collated. |
| 2026-09-01 | `CHARLIE -> MAIN` | `no live pane matches 'MAIN'` | **DEAD.** Card `a000da92`: P-LIB-WINDOW built, pointing at `handback/p-lib-window_2026-09-01.md`. Collated 09-01 by other means. |
| 2026-09-06 | `librarian -> MAIN` | `no live pane matches 'MAIN'` | **DEAD AS A HAND, one item unconfirmed.** §7b. |

**§7a — the fourth is not fixed by the resolver and is not fixed by this packet.**
`raise_from_forming` sends `target: String::new()`. A targetless pull still becomes a gate card,
still consumes a human decision, and still delivers nothing. **Registered, not fixed** — it is a
widening of this lap and I am not taking it. The shape of the fix, for whoever does: a targetless
pull should say so at creation rather than spend a click.

**§7b — card `462f0497` (09-06 02:27), recovered in full from the board.** Four corrections to the
chair, all filed at `librarian/2026-09-06.md ~02:27` (`971c5dc`). Items (2) the keyed mutex and
(4) the self-catchable-share template are already carried into chunks 3 and 2 of the 04:52 plan.
Item (3), the `CLEAN.md:5` class correction, is on disk. **Item (1) is the one whose arrival I
cannot confirm and it is still operationally live:** *the chair CAN speak to the librarian —
`chair_inject` with the librarian pane as target is the ORCH→LIB verb; `ADDRESSABLE_SEATS`
(`main.rs`) is `["committee","librarian"]`; the L039 hand-off was refused only because no inject
to the librarian preceded the row.* If the chair already knows this, the hand is dead. If not,
that one sentence should be re-sent — **and after this packet the librarian can send it itself,
without a click**, which is the closing of the loop the hands were about.

---

## 8 · THE PROOFS AFTER THE REBUILD, in order, and what a failure would mean

1. **THE BAR.** The librarian sends to the chair — `call_chair` while the chair holds a lap. It
   must land with **no refusal and no click**. A refusal means the exemption did not ship; a wait
   means the inbox is holding it, which is correct behaviour and should show `QUEUED` then
   `DELIVERED` on the board rather than nothing.
2. **The no-click pull.** A librarian `raise_pull` with target `MAIN` must produce **no gate card
   at all** and a board row reading `librarian channel — delivered to 0c0c0c0a …`. If a gate card
   appears, either the mount is not reporting `librarian` or the target did not resolve.
3. **THE NARROWNESS.** A librarian `raise_pull` at a PANE must still produce a card and still
   wait. If it delivers, the exemption generalised in the field despite the test, and that is a
   stop-everything.
4. **Piece 3.** That card must render **in the target pane's tab**, and the tab button must carry
   the amber dot with a count in its tooltip. Check it from a DIFFERENT tab — a card that is only
   visible once you are already looking at it is the failure this piece is for.
5. **The title.** Decide that card, then hover the Librarian tab: its shipped description must be
   back.

**Diagnostic caution, the same one C stated about its own detector:** proof 1 failing does not
distinguish "the exemption did not ship" from "the inbox is holding correctly" without reading the
board. Read the board row, not the screen.

---

## 9 · STATE

    cargo test --bin consonance -- --test-threads=1     423 passed · 0 failed · 3 ignored
    cargo test --test arch_test                          11 passed · 1 failed
    node consonance/tools/js-suite.js --quiet            77 discovered · 77 to a summary · 2 failed
    git status --porcelain                               dirty; nothing committed by this seat

**The arch_test red is the SAME deliberate one and it is TRUE:**
`every_named_record_file_exists_and_every_record_file_is_named` —
`record/third_place_prehistory_2026-08-30.md` is named by no card. Not mine, and **not to be
cleared by deleting the assertion.** `every_chair_verb_authenticates` is green (the anchor fix
from the previous lap).

**The two js-suite reds are the same two as the last two laps** — `actors.evidence.test.js` and
`carrier-drift.test.js` — and neither belongs to this packet. Standing debt; carrier-drift is
named in `consumer_parity_2026-09-04` §3, actors.evidence is still unattributed.

**Paths this packet touched, and nothing else:**

    consonance/src-tauri/src/mcp.rs        pieces 1, 2 (PullRequest.seat, raise_pull, the table, the tests)
    consonance/src-tauri/src/main.rs       deliver_pull, the pull consumer, raise_from_forming, mod librarian_channel_tests
    consonance/src-tauri/src/gate.rs       GateCard.target_pane                       [out-of-set, §6]
    consonance/ui/term.js                  gateCardHost, refreshGateBadge, the listener
    consonance/ui/app.css                  the ID→class conversion, .tab.seat, .gcpending  [out-of-set, §6]
    consonance/ui/index.html               one attribute                              [out-of-set, §6]
    consonance/ui/gate-card-routing.test.js  NEW
    exo_memory/handback/p-lib-channel_2026-09-06.md  this file
    exo_memory/map/E.md                    one line

`main.rs` and `map/C.md` also carry **C's** L041 chunk 1(a) work in the same dirty tree. **Land by
named path, per seat.**

---

## 10 · MY OWN ERROR THIS LAP, AND THE RULE IT PRODUCED

While mutation-testing I backed up `main.rs` whole and restored it whole to undo a mutant, in a
tree C was editing. **That is `git add -A` in a different coat: it captures what it did not name.**
I checked what could be checked afterwards — the tree compiles, C's `assemble_intake_within` is
present, 423 tests pass, no mutant survives — and none of that is evidence that nothing C had
typed in that two-minute window was lost, because I do not know what was typed. Posted to the
board at the time, addressed to C, rather than left for someone to find.

**The rule, and it is the 09-04 `38ae5c2` lesson at one smaller scale:** on a shared checkout,
**never restore a file you do not exclusively own — reverse the edit, do not restore the file.**
The second mutant was reversed surgically, which is what both should have been. Its own falsifier:
if a seat's work is found missing from this lap's landing, this paragraph is the first place to
look and rule 1 of the commit amendment needs a sibling clause about backups.
