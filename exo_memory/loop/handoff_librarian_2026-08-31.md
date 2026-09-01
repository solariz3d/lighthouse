**SUPERSEDED by `exo_memory/loop/handoff_librarian_2026-09-01.md`, 2026-09-01.** Wording kept,
authority removed. The run it parks completed 80/80 on 2026-09-01 and is scored. For what is open,
read `exo_memory/librarian/LEDGER.md`, never this.

*(A previous version of this line said this file's `:26-27` carried an over-broad wall sentence. It
does not — **this handoff predates the wall**, which was measured 2026-09-01. The sentence is in the
09-01 handoff and the librarian has narrowed it there. Corrected at the librarian's catch; kept
visible because it is the fourth pointer tonight that named a POSITION instead of a THING, after
ALPHA's "v2", the journal's `LEDGER.md:21`, and the chair's `.done` marker.)*

# Handoff — the librarian seat, 2026-08-31 ~07:50, the laptop powers off at 08:00; the run is PARKED at 20 of 80

**Who reads this:** the librarian (Anamnesis) on its next wake — after a restart, possibly after the rebuild that ships the
pane→librarian edge — and the chair. Notes are the master (`exo_memory/librarian/2026-08-31.md`, ~07:30 is the last
leg); `LEDGER.md` holds every open window; `ASK.md` holds the keeper's pending calls; the chair's own handoff is
`loop/handoff_chair_2026-08-31.md`. **This file points; it does not copy.** After the wake: re-arm the watch, ask the chair
for the current inquiry, open LEDGER, then this.

## STANDING CONSTRAINT (keeper, 07:42, verbatim in the chair's handoff header): ONE MACHINE — this laptop — until the retrieval problem is settled. Do not open work on the desktop; do not assume the desktop has pulled.

## STATE, verified at write time
- HEAD `5026547` == origin at 07:44; A's parked hand-back + the 20 cue transcripts' mirror were still UNCOMMITTED at
  07:50 (`exo_memory/handback/p3a-cue-arms-parked_2026-08-31.md`, `exo_memory/loop/run2/cells/K1,K2`, `out/K*`) —
  the chair commits them before the lid closes; if they are not in `git log` tomorrow, that is the first thing to check.
- **L023 is at WORKING with the run PARKED, not running.** Both workers exited `DISPATCH-CUE COMPLETE`; no subject
  process is live. **20 of 80 cue trials complete: K1 r01–r05, r21–r25; K2 r01–r05, r21–r25** — 10 per arm, every
  completed rep has its partner in the other arm (interleaving intact). 60 cells untouched, 0 contaminated
  (`.handoff` without `.done` = 0). Isolation over the 20: 0 hook markers, 0 mcp/web, 615 model rows all pinned.
- **The resume instruction is A's hand-back §2** — the same two dispatcher commands with NEW log names, after its
  pre-flight (`ls out/K*.done | wc -l` → 20; the CONTAMINATED loop prints nothing). `dispatch-cue.sh` skips any cell
  whose `.done` exists and appends to `trials.jsonl`. **Resume BOTH arms or neither; never top one up to a round
  number** (the chair's rule, `5026547`; interleaving was registered so both arms share conditions).
- **One correction to the chair's handoff, for its §0:** it says *"`ls out/K*.done` reads 0 and will read 0 at
  completion — the cue dispatcher writes no `.done` markers."* **False at the park point:** `K1_r01.done` exists and A's
  hand-back counts by `.done`; `ls out/K*.done | wc -l` → 20 now, 80 at completion. Written before attempt 2's
  dispatcher; a tomorrow reader following §0 would mistake a finished run for one that never started. The chair
  amends in place.
- The watch `b0rs0l18o` DIES at restart (measured 00:51 today). Re-arm first: emit once per state change; fire on
  owing == M only, HANDBACKS IN, or lap open/close. The counter still counts the librarian as a dispatched letter
  when the chair reaches it by `chair_inject` (deadlock, `chain-status.js:545-549`) and counts progress posts as
  hand-backs — read the disk, not the counter, until the edge lands.

## THE ORDER ON RESUME (the chair's handoff §1 says the same; both must agree or one is wrong)
1. A resumes both arms (60 trials, ~85 s each, two workers ≈ 45 min). Bar unchanged: 0 hook markers, model rows all
   pinned, VOID 0, NOT-RUN 0, `MANIFEST.cue.json` 720/720.
2. **E scores MECHANICALLY** — bands from `score.json`, no cue transcript opened before the bands are written, prior
   K0 exposure declared. Thresholds from `l1_band_2026-08-31.md:93-95`, never transcribed: P2 K1 ≤ 0.35; P3 K2 ≤ 0.35
   AND ≤ K1 − 0.20; P4 truth-carry ≤ 0.90 ⇒ interference, the cue does not ship. Against K0 = 0.65, evaluable at 0.55.
3. **C reads the transcripts AFTER the bands land** — moved vs suppressed, `charsBefore`, receipt echo, REPLY.md.
4. Scorecard (chair's pen, attribution). If P3 fails, A's own clause: the correction into
   `research/the_retrieval_problem_outside.md` §1 ABOVE the paragraph it corrects.
5. **THE JOURNAL** — owed since 08-25; LEDGER row with trigger (chunk 3 filed) and falsifier (L024 opens first →
   conversation-only). Chair writes by COLLATING the L018–L023 residues; the list of what it must carry is in my notes
   ~07:19 and the LEDGER row.
6. Push, tree clean, both handoffs updated → then **L024: the pane→librarian edge** (`loop/pane_to_lib_edge_2026-08-31.md`
   + my ~05:45 notes: build as the ADDRESS TABLE at n=3; a PANE's Rust build; `BUILDING.md`'s hand-back leg and the
   chair's wake procedure edited in the SAME change; non-author read; inherits the collation practice's falsifier) →
   commit → close the app, `cargo build --release`, relaunch. **Never relaunch with a run live.**

## GATES AND CLOCKS
- F4 (battery): 2026-09-14. B's gate-mode falsifier: live from 07:12 (installed hook == repo `1f82635ceb01`; rows
  from then carry `mode: print`; 179 before do not, never backfilled) — *if the cited-rate under print does not fall well
  below the 90.4% measured under ask, the ask was not the lever.*
- ASK.md OPEN: 007 (cold-read egress), 009 (six board rows), 010 (third_place/ tracking), 011 (account name, 61 files),
  012 (gate under bypass — partly moot now: "ask" is off by choice, not by bypass; the question that remains is whether
  it ever comes back). ASK-004 is 34 days old, addressed to the keeper by name.
- E's registered arm (rule position vs REPLY cap) — L024+; the Third Place's cochlea defect (resolve clock; hysteresis)
  — candidate registration for the listen line, notes ~07:25; the six remaining lap voids (rule in notes ~02:40).
- Quotable guess∩map set: L003–L008, L010–L012, L019, L021 (4 of 5), L022 (BOTH 4), L023 (5 of 5). Eight VOID.

## WRONG COLUMN, this seat, today: +9 (lifetime 49)
The scope of the account-name finding (61 files, not two); the "one `$register` line" (a two-implementation decision;
my own 08-25 WRONG #18 held the trap and did not fire — filed as its own entry ~05:30); the P-HANDLE carrier list (5 of
15); the hostname 2-of-3; the baseline-under-the-wrong-guard ask; F2's hand-made baseline; the scanner-invisibility
half-right; "the clicks are off" on the strength of a commit (installed hook was the 08-24 copy); the hand-counted
"5 of 5" the tool read as 4. Every one caught by a non-author; zero in-stream. The routing thesis held all day, and it
is now a registered gate (PREREAD) with its precondition named.

## WHAT THE NEXT WINDOW OWES, in order
1. Re-arm the watch. 2. Ask the chair for the current inquiry (post-restart rule) — expect "resume the run." 3. Verify
A's mirror and hand-back are in `git log`; if not, say so before anything runs. 4. The return leg at this desk when the
bands land; then steps 4–6 above in order. 5. If the rebuild has happened: the new edge is unproven — its first lap is
its test; the collation practice's falsifier is its falsifier.

*A trace to re-run, not a doctrine to believe.*
