# P-D113-UNIONATTACK · ALPHA — the design survives, and PHASE 2 does not: two FATALs, both cases where the check PASSES while rows are gone. Measured on D: board.jsonl already carries 7,514 duplicate rows and 257 arriving invalid lines, and E's superset test can see neither

**Pane A, machine D, 2026-09-22 13:1x–14:0x. READ-ONLY, as the packet set it:** no code, no union write, no install run,
no close. **One file touched: `exo_memory/loop/union_at_launch_2026-09-22.md`, the `§-ATTACK` section only** — the
`*ATTACK:*` placeholder was replaced by the attack. E's other sections and E's closing NEXT line are untouched. (The file
is untracked, so `git diff` shows nothing; the edit matched the placeholder uniquely.)

**Verdict: 2 FATAL · 5 AMEND · 5 NOTE**, each with the fix in words. **The premise holds** — a launch that only ADDS
rows, with a refusal behind it, is the right shape — and both FATALs are inside PHASE 2, the section E flagged as *"the
single most likely place for a first implementation to be silently wrong"*. E was right about where; this is what.

## 1 · THE MEASUREMENT THE ATTACK RESTS ON

One command, D's real files, live vs the arriving copy at `C:\Consonance\state\data`, parsed with **`ledger-union.js`'s
own `parseJsonl`/`canon`/`timeOf`** so the units are the tool's and not mine:

| file | live rows | arriving rows | dup rows LIVE | dup rows ARRIVING | invalid lines live/arr | no parseable time |
|---|---|---|---|---|---|---|
| board | 61,709 | 35,427 | **7,514** | 0 | **263 / 257** | 0.00% |
| sessionstart-state | 7,693 | 2,345 | **241** | **29** | 0 / 0 | 0.00% |
| the other nine | — | — | 0 | 0 | 0 / 0 | 0.00% |

Today's multiset deficit is **0** for all eleven — only because C unioned D by hand this morning (D106), so the live file
already holds every arriving key.

## 2 · THE TWO FATALS

**FATAL-1 — superset by canonical key is a SET test over MULTISET data, and it contradicts the tool's own verify.**
`union()` keys rows into `new Map()` (`ledger-union.js:143,154`), so the union writes one row per distinct key; live
duplicates survive only because the output walks live LINES (`:305-313`). An arriving row held twice, locally held once,
is dropped — and a key-superset PHASE 2 passes. **`writeUnion` step (7) already verifies the original as a MULTISET of
lines (`:369-378`)**, so the tool's author had ruled that two identical lines are two pieces of record. Fix: per-key
counts, `count_local(k) >= count_arriving(k)`.

**FATAL-2 — a row with no key is invisible to PHASE 2, and 257 of them are in the arriving board right now.**
Unparseable lines go to `invalid`, never to `rows` (`:110-125`), are never carried from an arriving copy (only counted,
as `invalidNotInLive`), and have no `canon()` key for PHASE 2 to look for. A fused line is where two real rows go when
writers collide — the class §3 is about. Fix: PHASE 2's second clause is `invalidNotInLive === 0` for the STATE source
(one field to return), else PHASE 3.

## 3 · THE FIVE AMENDS, IN ONE LINE EACH

- **AMEND-3 · nothing locks.** `grep -c lock ledger-union.js` → 0, and §8's fallback prints the manual command for a
  person to run while the app is up. Take an exclusive `<data>/union.lock`, honoured by the CLI too, and add "Close
  Consonance first" to the fallback text.
- **AMEND-4 · the crash window between `rename` and `link` orphans the record.** The ledger does not exist between step
  (4) and step (5); a death there leaves the next launch's pre-scan with no local file, so it installs cleanly and every
  local-only row stays in `.pre-union-*` that nothing reads. **The one path that loses the record with every check
  green.** Fix: a `started` receipt before the freeze and a `finished` after step (7); any `started` without a
  `finished`, or a stray backup, refuses the next install loudly.
- **AMEND-5 · PHASE 3 would print two sentences that are false, and they are in my own file.** `state-sync.js:1209`
  ("NOTHING WAS WRITTEN … data dir is exactly as it was") and `:830` ("No file of the set was written; … exactly as it
  was") are lies after a partial union. Fix named for A; not changed this lap.
- **AMEND-6 · the 1% time-parse bar has no derivation.** Measured 0.00% across all eleven; 1% of board is **617 rows** of
  slack against a population of zero. Fix: refuse on ANY row without a parseable time and record the count, raising the
  bar only with a real case in hand.
- **AMEND-9 · the 90-second bar is measured per set when the cost is per file.** 1,500 ms × up to 20 passes = 30 s per
  file worst case, ≥16.5 s for eleven when perfectly idle, and "a pass moved nothing" is exactly what a busy board does
  not do. Put the bar per file as well.

## 4 · THE FIVE NOTES

- **NOTE-7 · §3's writer property, checked file by file as E asked.** The ten JS writers are `appendFileSync` per row:
  true. **`resonance/atoms.jsonl` is not** — `main.rs:8376` writes the whole batch through one handle. And **the one
  long-lived handle on this machine (`main.rs:1257`) writes the PTY capture, not one of the eleven** — which is the fact
  that makes §3's hole narrow and belongs in the design.
- **NOTE-8 · the Windows rename claim is untested** (by E and by me), and step (5)'s `linkSync` additionally needs a hard
  link, so a data dir on exFAT or across volumes fails. Both land in PHASE 3; test the rename in the rig rather than
  asserting it.
- **NOTE-10 · the 8am reading.** "every row was checked twice" is the merger vouching for itself (E's own second
  falsifier); the fallback's "exactly as it was, plus 2 ledgers" contradicts itself in one sentence, and at 8am the first
  half wins. Wording given in §-ATTACK, change first.
- **NOTE-11 · where the switch lives.** `main.rs:11042-11045` spawns node with no `env_clear`, so
  `CONSONANCE_UNION_AT_LAUNCH` must be in the APP's environment (HKCU, the Jev key's place, or `launch.ps1`). A seat
  cannot flip it; a terminal variable never reaches a shortcut launch.
- **NOTE-12 · §7.4 is right and free:** `FILES` (11) and the manifest's fast-forward set (11) are the same eleven today.

## 5 · E'S OWN QUESTIONS, ANSWERED

- **Superset is a loss test, not a correctness test.** Whole-row keys keep both of two rows sharing a lap id, so a
  *corrected* row arrives beside the wrong one and PHASE 2 passes. §6 says this; §2 should too, where the reader forms
  the idea that "superset" means "right".
- **No rollback of completed unions.** Live writers have already appended into the new file, so restoring a backup would
  destroy rows that exist nowhere else. E's mixed state is correct; what it owes is the receipt.
- **No twelfth file**, and none of the eleven should leave.
- **Should the launch merge at all? Yes** — for a step that only adds and can prove it. The whole weight of this attack
  is on *prove*: unfixed, the proof is weaker than the tool's own verify.

## 6 · WHAT I DID NOT DO

- **No rig, no trial, no union.** Every claim is from reading the code and measuring today's files; the 50-trial
  falsifier is still unrun, and the two FATALs are arguments from the code plus a population count, not from a failed
  merge.
- **I did not test the Windows rename behaviour** (NOTE-8), and I did not read all 423 lines of `ledger-union.js` —
  `union()`, `parseJsonl`, `writeUnion` and `main()` were read in full.
- **Machine L is not measured.** The duplicate-row population there is unknown to me; C's L unions (L071, L076) are the
  place to look.
- **I am not a non-author of the launch path.** `state-sync.js`'s refusal text (AMEND-5) is mine, from L070 — so that one
  is a correction of my own file, not an outside finding, and the chair should weigh it as such.

NEXT: librarian collate A's attack when p-d113-unionattack-A_2026-09-22.md is written and the map line is appended
