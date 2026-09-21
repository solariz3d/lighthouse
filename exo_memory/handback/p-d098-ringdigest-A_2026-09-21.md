# P-D098-RINGDIGEST · ALPHA — an older hand-back named first no longer wins: candidates rank by the ring's own lap id, then the file's date, then order; REFUSE was measured and rejected (its only effect on the record would be one refusal of a good ring)

**Pane A, machine D, 2026-09-21 10:1x–10:3x.** Lap D098 packet A. Source: my own L069 hand-back
`exo_memory/handback/p-l069-ringdigest-A_2026-09-21.md` §1 (the unguarded case), and the L069 code as landed at `090d430`.
**One file: `consonance/src-tauri/src/mcp.rs`**, the digest gate's `pointer_in` and its tests only, +98 −1. Uncommitted.
**No rebuild.** The other dirty files in the tree (`main.rs`, `dev/shell/hooks/*`, `install.ps1`, …) are E's, C's and
B's, untouched. **No existing test was weakened, removed or modified**; the seven tests are new.

## 0 · THE CHOICE, MEASURED BEFORE IT WAS MADE

The packet offered two shapes: prefer the hand-back matching the ring's own lap or date, or REFUSE when several
`handback/` paths are named with none marked. **I surveyed the real record first:**

    node <scratchpad>/d098/survey.js            (read-only over C:\Consonance\data\board.jsonl on D)
      distinct rings with a digest: 43
      naming >1 handback/ path: 1
        B 2026-09-21T09:02 laps=L060 — p-l060-carriers-B_2026-09-21.md, p-six-reds-B_2026-09-19.md, p-ask001-abstain-B_2026-09-20.md

**Exactly one ring in the record names more than one hand-back, and it is B's L060: a correct ring**, delivering its
hand-back plus two older ones it reworded. So the REFUSE rule's whole effect on the real record would be **one new
refusal of a good ring**, in the verb that loses work when it refuses (D069, D077). That fails the packet's own bar
("no new refusals on good rings"). **Rejected on the measurement.** (D's board carries L's rows too; these 43 include the
34 I replayed for L069.)

## 1 · THE CHANGE — rank on what the ring's own text carries

`pointer_in` still considers `handback/` paths first, else the first `.md`. Among several hand-backs it now takes the
maximum of:

1. **the name carries a lap id the ring's prose names, as a whole segment.** `D098 packet A` matches `p-d098-…`. A lap
   id is exactly `L` or `D` plus three digits. That length also keeps every path token out of the scan: a path carries
   `/` and `.md`, so it is never four characters.
2. **then the latest `_YYYY-MM-DD` in the file name;**
3. **then the first named** — the L069 rule, now only the tie-break. (`max_by_key` keeps the last of equal keys, so the
   index is negated.)

The digest line still lists every other named path as `also named, not hashed` (L069), so any pick the ranking gets
wrong stays visible where the reader checks.

**THE RESIDUAL, stated:** same date and no lap id in either name leaves the text nothing to rank by. The first is hashed
and the other is listed as not hashed. A test pins this, so any change to it is visible.

## 2 · RED FIRST, THEN GREEN — the command beside every number

`export PATH=~/.cargo/bin:$PATH` first: cargo is not on the bash PATH on D.

    CARGO_TARGET_DIR=/c/build/a-d098-target cargo test --bin consonance digest_at_ring    (in consonance/src-tauri)
      BEFORE (090d430)                24 digest tests
      RED (4 new tests)               25 passed, 3 failed
        FAIL an_older_hand_back_named_first_loses_to_the_newer_one_delivered      <- the packet's exact shape
        FAIL on_the_same_date_the_hand_back_carrying_the_ring_s_own_lap_wins
        FAIL the_ring_s_own_lap_outranks_a_later_date
        green at red ON PURPOSE (control): with_nothing_to_rank_by_the_first_handback_path_still_wins   (the residual)
      GREEN                           28 passed, 0 failed
      + 3 tests after the mutant pass 31 passed, 0 failed

    FULL MAIN BINARY, final source
      cargo test --bin consonance                        868 passed, 0 failed, 4 ignored
      cargo test --bin consonance -- --test-threads=1    868 passed, 0 failed, 4 ignored

**On 854 → 868:** the packet's 854 was L's count. Seven of the +14 are mine: the digest module went 24 → 31. The other
seven are other seats' work in D's tree or landed since, **attributed by exclusion, not test by test**. No compiler
warning points into my code. **Not run: the non-`--bin` targets** (`arch_test` etc.); the packet's bar was the main
binary's count.

## 3 · MUTANTS — the tracked harness, in parallel, on D

    node consonance/tools/mutant-harness.js <scratchpad>/d098/rows.js
      FIRST RUN:  pre-flight 28/0 · 9 listed · 5 killed · 4 SURVIVED · 0 no result · 0 not applied
        #5 path tokens scanned for lap ids — EQUIVALENT. The `/` filter was dead code, because `len == 4` already excludes
           every path token. The filter was REMOVED and the comment says why; the row was dropped.
        #7 digits not checked — REAL. Any four-letter word starting with l or d (`dead`, `diff`, `live`, `leak`) became a
           lap id; THE_DEAD_LAP.md is on disk. Test: a_four_letter_word_is_not_a_lap_id.
        #6 any length counts, #9 substring not segment — SPECIFICATION GAPS. No real ring has either shape; pinned
           anyway, and labelled as specification in the tests.
      FINAL RUN:  pre-flight 31/0 · 8 listed · 8 killed · 0 survived · 0 no result · 0 NOT APPLIED · live mcp.rs unchanged: true

## 4 · THE REPLAY — no pick changes on the real record

    node <scratchpad>/d098/replay.js     (read-only; JS replicas of the L069 and D098 rules)
      first run:  distinct digested rings 43 · L069 == hashed-at-the-time 42 · D098 == hashed 42 · D098 == L069: 43 of 43
      final run:  distinct digested rings 45 · L069 == hashed 44 · D098 == hashed 44 · D098 == L069: 45 of 45
      the one ring either rule changes: B's L060, hashed p-six-reds-B at the time, and both rules pick p-l060-carriers-B.

**No new refusals on good rings, by construction**: the refusal paths were not touched, and the change only picks among
paths. **No pick changes on any real ring either**: D098 equals L069 on all 45. **Stated plainly: none of the 45 has the
shape this guards against.** It closes a case with zero occurrences on record, which is what the packet asked for, and
the replay shows it costs nothing on the record.

**The replica can disagree, and it was checked:** `node <scratchpad>/d098/replica_check.js` runs both rules over the
four fixture rings. They disagree on three of four, exactly where the Rust tests say they should, and agree on the
residual. So 45 of 45 is a reading, not a replica unable to see a difference. **Limit:** the replay runs the JS
replicas, not the Rust; the mutants pin the Rust.

## 5 · WHAT I DID NOT VERIFY

- **The live verb.** No rebuild, so no real `call_librarian` has run the new ranking. This file's own ring goes through
  the running build's gate.
- **The residual (§1)** is marked, not prevented. Closing it needs something the text does not carry: a marker
  convention, or the file's mtime (not deterministic for tests or replay).
- **The non-`--bin` cargo targets** were not run. **Machine L** was not run.

## 6 · CARRIED OVER — the L070 correction from this morning is still open

`exo_memory/handback/p-l070-fastforward-A-correction_2026-09-21.md` (committed `ead6e8d`): my uncommitted L070 change on L's
disk is what L's next launch runs, and it would print a false "not promoted" verdict. I am not re-arguing it here; I'm
noting it is unresolved, so it is not lost behind this packet.

NEXT: librarian re-run §2's digest tests and §4's replay, then collate D098 packet A, when this file is read
