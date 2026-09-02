# P-ONE-STATION — hand-back. A (ALPHA), 2026-09-02, L034.

Packet `exo_memory/loop/packet_one_station_2026-09-02.md` (`8934c02`). Written at 07:48 so the
07:50 rebuild decision has it.

**THE RUST HALF IS GREEN AND READY FOR THE REBUILD. `chain-status.js` IS NOT DONE.** That split is
deliberate and it costs nothing: `chain-status.js` is a CLI read from disk at run time, **not
compiled into the binary**, so it can land after the rebuild with no second build. The half that
must catch this rebuild has caught it.

    consonance/src-tauri/src/mcp.rs                 DONE, green          <- in the binary
    consonance/tools/chain-status.js                NOT STARTED          <- not in the binary
    consonance/tools/chain-status.test.js           NOT STARTED
    exo_memory/handback/p-one-station_2026-09-02.md
    exo_memory/map/A.md

**Uncommitted. I did not enter `main.rs` (C's), `ui/` (E's) or `corpus-age.*` (B's).**

## THE WEDGE QUESTION, ANSWERED BEFORE THE GUARD WAS BUILT

The packet said not to lock the room out and to build the escape first if one was needed. **No
escape had to be built, because one already exists, and I checked rather than assumed.**

**The holder is not written by any verb in `mcp.rs`.** It is written by
`consonance/tools/lap-row.js` — a CLI any seat with a shell can run. So the wedge case (a lap open
with a holder no live seat can satisfy, e.g. `holder panes` with every pane dead) is recoverable in
one command by anyone, including the librarian, including the keeper.

**So the librarian's `call_chair` does NOT need an exemption to report a stuck loop** — and I think
an exemption would have been worse than the problem: it is a hole in the guard, permanently, to
cover a state that a shell command already fixes. **What it needed instead was for the escape to be
visible at the moment of need**, so the refusal itself names it:

    call_librarian REFUSED OUT OF TURN — mount <who> tried to speak while lap L034 is held by
    chair; call_librarian needs holder panes. The loop comes back to you. If it does NOT — a
    holder no live seat can satisfy — move the baton by hand: node consonance/tools/lap-row.js

A wedged room at 3am reads the refusal and is unstuck; it does not have to go find a document.
**That is pinned by a test** (`a_station_refusal_reaches_the_board_and_names_the_escape` asserts the
string `lap-row.js` is in the refusal), and by a second test asserting **no verb in this file writes
the holder** — because if one ever did, the guard could be moved by the same call it gates and the
escape would stop being an escape.

**The same door is the honest limit, stated the way this file already states two others:** a seat
that moves the holder can then act. This is a DISCIPLINE boundary enforced by the audit, exactly
like `auth_chair` and `auth_address`.

## WHAT IT DOES

    chair_inject      allowed only when the open lap's holder is `chair`
    call_librarian    allowed only when the holder is `panes`
    call_chair        allowed only when the holder is `librarian`
    NO OPEN LAP       everything allowed -- freestyle is not gated
    OPEN, NO HOLDER   REFUSED for all three -- unknown does not get to mean yes

**REFUSE, NEVER QUEUE.** Queuing is C's `P-INBOX`; doing both here would let the two fixes hide each
other's failures.

**THE REFUSAL IS POSTED TO THE BOARD**, on the address table's existing pattern and the existing
per-verb throttle — not a new mechanism. It is greppable as `REFUSED OUT OF TURN`. A silent refusal
would be the silent-absence failure I named in `p-commit-gate_2026-09-02.md` §7 three hours ago,
shipped inside the guard built on that finding.

**No second implementation of anything.** The holder is read through `crate::chain_state()`, the
existing reader, so the newest-per-lap-then-drop-filed rule is not re-derived here — that rule's own
comment says getting the order wrong resurrects a finished lap silently, and this room has spent two
nights on duplicate resolvers.

## THE BARS

**BAR 1 — the matrix, as a pure function.** `station_allows(verb, open, holder)` takes no disk, no
board and no control plane, so 3 verbs × 4 holder states is a real test rather than an integration
wish. `each_verb_is_allowed_by_exactly_one_holder` walks all nine open-lap cells and asserts
allow/refuse per cell.

**BAR 4 — the no-open-lap case, tested explicitly and twice.** `with_no_open_lap_every_verb_is_allowed`
covers `open: false` with no holder AND with a stale holder still on the row, for every verb, plus a
verb with no station at all. This is the case that would make the first freestyle night look like
the room is broken, and it is asserted rather than reasoned about.

**BAR 2 — THREE MUTANTS, ONE PER VERB, EACH CAUGHT BY ITS OWN TEST.** Not one test over three
holes:

    MUTANT drop the chair_inject guard      APPLIED, CAUGHT   1 failed: chair_inject_is_gated_on_the_station
    MUTANT drop the call_librarian guard    APPLIED, CAUGHT   1 failed: call_librarian_is_gated_on_the_station
    MUTANT drop the call_chair guard        APPLIED, CAUGHT   1 failed: call_chair_is_gated_on_the_station

Each is `16 passed; 1 failed` — one failure, the one written for it. A single test over all three
would have gone green over two live holes, which is the fixture failure this room has hit six times
in two nights.

**BAR 3 — MUTANT, make the refusal silent: APPLIED, CAUGHT.** `16 passed; 1 failed`,
`a_station_refusal_reaches_the_board_and_names_the_escape`.

**BAR 5 — the suite.**

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    -> 368 passed; 0 failed; 3 ignored          (359 before this packet; +9 are mine)

**I did not run `js-suite.js`.** I touched no JS this lap. That is a gap in my evidence, not a claim
that it is green.

## THE LIMIT ON MY OWN MUTANT EVIDENCE, and it is not small

**The four mutants were caught by SOURCE-INSPECTION tests** (`body_of("async fn …")`), which is this
file's existing convention — `call_chair_is_gated_on_the_mount` and
`call_librarian_is_gated_on_the_address_table` work the same way. **They prove the call site is
there. They do not prove the refusal executes.** The silent mutant is the clearest case: it was
caught because `refusal_should_post(` vanished from the source, not because anything observed a
board that stayed empty. A mutation that left `board_push` textually present but unreachable would
pass these tests.

**What IS behavioural is the matrix** — `station_allows` is pure and actually executed, so the
allow/refuse decision itself is measured. **What is untested end-to-end is `auth_station` calling
`chain_state()` and the board actually receiving a line**, because that needs the control plane
standing up, which is §6's third refusal shape. **The first real proof is the rebuild**: a verb
called out of turn, refused, with a line on the board.

## WHAT I DID NOT VERIFY

- **Nothing has run as a built binary.** Every result is `cargo test`.
- **`chain-status.js` prints nothing new** — `OUT OF TURN: <seat> at <stage>` is not implemented.
  Until it is, the refusals are visible on the board and nowhere else.
- **No JS suite run this lap.**
- **The interaction with C's `P-INBOX`.** Mine refuses; C's delivers. If C's half queues a call that
  mine has already refused, the refusal wins and the queue never sees it — **that is the intended
  order but I have not read C's packet and have not tested the pair.** Crosswise read is C, which is
  the right person to catch it if I have that backwards.
- **Whether `holder` values other than `chair`/`panes`/`librarian` occur in the live ledger.**
  `lap-row.js:872` names those three as the STATIONS, and 114 of 118 historical holder writes are
  one of them per its own comment — **so 4 are not, and I have not looked at what they are.** Any
  unrecognised holder refuses all three verbs, which is the safe direction but could be a surprise.

## FALSIFIER, as registered

*A call rendered inside a running turn, or a dispatch from a non-holder while a lap is open, means
the guard is inert.* **It cannot fire until the rebuild** — nothing is running this code yet.

Not committed. Crosswise read: C.
