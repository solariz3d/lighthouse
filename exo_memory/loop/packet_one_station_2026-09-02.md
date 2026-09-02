# P-ONE-STATION — the verbs REFUSE out of turn. L034. KEEPER-DIRECTED, solid before 08:00.

**To ALPHA, 2026-09-02 ~07:20. The keeper's rule, 07:15–07:18, filed verbatim by the librarian at
`fe15030`. ONE rebuild at ~07:50; after 08:00 nothing dispatches.**

## 1 · THE RULE — the keeper's, and it supersedes "one lap in flight"

> **While a loop runs, exactly ONE station is active — terminals, or orch, or lib — and every other
> seat waits for the loop to come back to it.** Off-loop work is allowed only if it never calls a
> seat mid-build. **And the human is not the exception**: nothing renders into a pane whose prompt is
> not idle, and nothing into the keeper's typing.

**It was demonstrated in the act of being reported.** Three of his messages were spliced by rings
into the librarian's pane inside ten minutes — one cut off mid-word by A's own hand-back arriving.

**Yours is the REFUSAL half. C has the DELIVERY half (P-INBOX).** Together they are the baton: your
half says who may speak; C's says when it lands.

## 2 · WHAT TO BUILD

    consonance/src-tauri/src/mcp.rs        the verbs refuse
    consonance/tools/chain-status.js       OUT OF TURN is printed

**REFUSE, do not queue.** Queuing is C's half and doing both is how the two fixes hide each other's
failures.

    chair_inject      allowed only when the open lap's holder is `chair`
    call_librarian    allowed only when the holder is `panes`
    call_chair        allowed only when the holder is `librarian`
    NO OPEN LAP       everything allowed -- freestyle is not gated (BUILDING.md's cut)

**The refusal is POSTED TO THE BOARD like every other refusal** — the address table's existing
pattern, not a new one. A silent refusal is the silent-absence failure you named three hours ago in
your own §7, and it would be inexcusable to ship it in the guard built on that finding.

`chain-status` prints **`OUT OF TURN: <seat> at <stage>`** beside `unwitnessed`.

## 3 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, A: *"registrations and their honest retirement"*, and tonight
`handback/p-commit-gate_2026-09-02.md` §7 — **you are the seat that just ruled on what a control can
and cannot do, and named silent absence as the failure mode.** This is the same question one layer
in: a verb that refuses is a control at the only point that cannot be walked around, because there is
no `--no-verify` for an MCP verb.

## 4 · BARS

    1  RED FIRST. Each verb x each holder value = the matrix. chair | panes | librarian | none.
    2  MUTANT: drop ONE guard => red. Three mutants, one per verb; a single test covering all
       three would go green over two live holes -- the fixture failure this room has hit six
       times in two nights.
    3  MUTANT: make a refusal silent (drop the board post) => red.
    4  THE NO-OPEN-LAP CASE MUST BE TESTED EXPLICITLY. If it is not, the first freestyle night
       after this ships will look like the room is broken.
    5  cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
       node consonance/tools/js-suite.js  (actors.evidence.test.js is a known red since 08-25)

**DO NOT LOCK THE ROOM OUT.** If the guard can wedge the loop — a lap open with a holder no live seat
can satisfy, and no verb able to move it — **say so and build the escape before the guard.** A room
that cannot be un-stuck at 3am is worse than one that interrupts.

## 5 · WHAT YOU OWN — repo-relative, mandatory (your own gate reads this block)

    consonance/src-tauri/src/mcp.rs
    consonance/tools/chain-status.js
    consonance/tools/chain-status.test.js
    exo_memory/handback/p-one-station_2026-09-02.md
    exo_memory/map/A.md

**C is in `consonance/src-tauri/src/main.rs`. E is in `consonance/ui/*`. B is in
`consonance/tools/corpus-age.*`.** None is yours. **Do not commit.** **Crosswise read: C.**

## 6 · PERMISSION TO REFUSE

Say so if: the holder is not reliably knowable at verb time without a read that could deadlock; or
the librarian's `call_chair` needs an exemption to report that the loop is stuck (**it may — think
about it before building, and if it does, that exemption is a finding, not a workaround**); or the
matrix cannot be tested without standing up the control plane.

## 7 · HAND-BACK — and the clock

`exo_memory/handback/p-one-station_2026-09-02.md`, then `call_librarian` with that path. One line to
`exo_memory/map/A.md`.

**ONE rebuild at ~07:50 carries this, C's inbox, E's logo and B's corpus work.** If you will not make
it, **hand back what is green and say where you stopped** — a parked, honest half beats a rushed
whole, and the rebuild is not the last one.

    OBJECTIVE:  a seat that is not the holder cannot interrupt a working seat, and the attempt is
                visible rather than silent.
    FALSIFIER:  a call rendered inside a running turn, or a dispatch from a non-holder while a lap
                is open, means the guard is inert.
