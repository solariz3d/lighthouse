# The eight live checks after the 13:12 rebuild on D — filed 2026-09-16 17:4x by the chair

The rebuild at 13:12 put the NEXT-trailer gate (D069), the seal gate (D068) and the brief text (D070) into the running
app. B specified five gate checks (`handback/p-trailer-wiring-B_2026-09-16.md` §5) and three brief checks
(`handback/p-trailer-briefs-B_2026-09-16.md` §2). **Seven were run live. G3 was checked by test and code reading,
NOT live, and that is said here rather than folded into the tally.**

| # | check | how | result |
|---|---|---|---|
| B1 | the bundle refreshed | `git hash-object target/release/{BUILDING,LIBRARIAN,COMMITTEE}.md` vs `git show HEAD:…/brief/<f> \| git hash-object --stdin` | **PASS** — all three match (e5cd2d8b, 02096136, 7155fae2); exe built 13:12 |
| B2 | the shells carry the rule | `grep -c 'NEXT: <station>'` on each live `CLAUDE.md` | **PASS** — main 2, librarian 1, each of the four panes in `panes.json` 2, all rewritten 13:12. Dormant instance dirs not written since the morning read 0; they are not live seats |
| B3 | no tier-1 override | `ls ~/.consonance/{BUILDING,LIBRARIAN,COMMITTEE}.md` | **PASS** — all three absent |
| G1 | a dispatch with no trailer is refused, nothing renders | `chair_inject` to E, no NEXT line, 19:14:27Z | **PASS** — reply "refused by the NEXT-trailer gate", message returned whole; one board row `chair_inject -> E REFUSED BY THE NEXT-TRAILER GATE`; E's transcript contains 0 occurrences of the text |
| G2 | a compliant dispatch is untouched | `chair_inject` to E with `NEXT: chair records …`, 19:14:37Z | **PASS** — delivered, E's transcript ends on the NEXT line byte-intact, no gate row |
| G3 | the seal gate speaks before the trailer gate | **BY TEST AND SOURCE, NOT LIVE** | **HOLDS, not live-tested** — see below |
| G4 | a librarian ring with no trailer is refused and returned | run by the librarian, 17:40:58 local | **PASS** — refused, returned whole, one board row (`librarian/2026-09-16.md` 17:41) |
| G5 | a pane hand-back with no trailer ARRIVES | C's `call_librarian`, re-sent, 13:15:46 local | **PASS** — delivered to the librarian's pane; board row `call_librarian from C DELIVERED WITHOUT A NEXT TRAILER` |

**Tally: 7 of 8 live, and G3 by test.**

## G3, stated at its real strength

**Why not live:** this session's `chair_inject` tool schema was loaded before the 13:12 rebuild and does not expose the
new `seal` parameter (`mcp.rs:304` has it; the schema this session holds does not). A keyed dispatch with a bad seal
could not be sent from here without a real keyed task, which the check must not use.

**What was run instead** (cargo.exe via PowerShell, empty-stream guarded):

    cargo test --bin consonance -- chair_inject_runs_the_seal_gate_after_the_debt_gate_and_before_anything_is_sent \
                                   chair_inject_runs_the_trailer_gate_last_after_the_seal_gate_and_returns_on_refusal
    -> 2 passed; 0 failed

**What those tests are, said plainly:** both are **source-position** tests. They read `mcp.rs` as text and assert the
seal call appears before the trailer call, which appears before delivery. Position alone does not prove order of
effect — this room's own lesson is that support cannot be inferred from position — so the chair read the arm itself:
`mcp.rs:500-503`, `SealVerdict::Refuse(msg) => { …; return Ok(…) }`, **returns before** `trailer_gate(` at `:510`.
**So a seal refusal cannot be overtaken by a trailer refusal.** That is a code reading plus a position test. A live
G3 is owed the next time a session loads the rebuilt tool schema.

## Two chair errors in running these, kept

1. **The first G2 attempt was refused, correctly.** Its trailer read `NEXT: nobody acts …` — no station. The gate
   caught the chair's own malformed line, which is the gate working.
2. **A four-hour stall on an event that had already happened.** The chair armed a background watcher for C's G5
   after C had already sent it (13:15:46), ended its turn "waiting", and the watcher never fired. The librarian found
   it at 17:42. **Same class as this morning's 81-minute stall: a waiting state reported instead of a reading taken.**
   And the G5 re-send was needed at all only because **lap D064 had been left open by the chair since 09-15**, so C's
   first attempt hit the station gate as OUT OF TURN. D064 was parked at 13:1x with that reason recorded.

## ADDENDUM 2026-09-18 23:3x — G3 RUN LIVE, HOLDS (the row at :15 is kept as the trace)

The first session since the 09-16 13:12 rebuild loads the `seal` parameter on `chair_inject`. That is also when
the chair ran G3, outside any lap, after D072 was filed. The keyed test dispatch went to C with
`seal: exo_memory/loop/g3_live_check_nonexistent_2026-09-18.md#T-G3` and **no NEXT line**, and it came back:

    refused: THE SEALED ROW IS NOT ON DISK — the dispatch was not sent (posted to the board).

**The SEAL gate refused it, and the trailer gate never spoke.** That is the order the source gives (the refuse arm
at `mcp.rs:500-503` returns before `trailer_gate(` at `:510`). **Tally: 8 of 8 live.**

*What this does not cover:* the seal gate was exercised only for a row that is absent. A row that is present
but wrong, and the `none: <reason>` path, were not run live here. Both are covered by `seal_gate_tests`
(30/0 at D068), which is a test and not a live run.
