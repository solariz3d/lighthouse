# P-L069-RINGDIGEST · ALPHA — the ring digested the wrong file because of a FULL STOP, not because B named several files; now the hand-back path wins and every other path is listed as not hashed

**Pane A, machine L, 2026-09-21 06:2x–06:4x.** Lap L069 packet 2. Evidence read at source: B's delivered ring (board row
30708, verbatim) and `exo_memory/librarian/2026-09-21.md:22`. **One file, mine: `consonance/src-tauri/src/mcp.rs`**,
the digest gate and its tests only, +122 −10. Uncommitted. **No rebuild, no relaunch** (the keeper's 05:55 rule); it
ships at the next natural reopen. **No existing test was weakened, removed or modified**; the eight tests are new.

## 0 · THE CAUSE — measured, and it is not the one the packet guessed

B's ring names the delivered hand-back **FIRST**:

    [pane:B] L060 packet B (with its amendment) hand-back filed: exo_memory/handback/p-l060-carriers-B_2026-09-21.md. Changed: …

`pointer_in` (`mcp.rs`, old `:2996`) trimmed the punctuation around each token **except `.`**, because a path contains
dots. So the token was `…p-l060-carriers-B_2026-09-21.md.`. It does not end in `.md`, it was skipped, and the next
`.md` token won: `exo_memory/handback/p-six-reds-B_2026-09-19.md`, listed under "Changed:". That is git-blob
`ae188c8f…`, exactly the file the librarian recorded. **The several-files shape did not cause the misfire by itself; a
sentence ending on the pointer did.** The red run reproduces the exact misfire: the gate hashed `…/p-six-reds-B_2026-09-19.md`.

## 1 · THE FIX, and the choice argued

1. **Trailing dots are trimmed** from a path token. Leading dots are kept, because `./x` is a path, and stripping it
   would turn the pointer into `/x`, which the gate REFUSES as absolute (mutant #2 pins this).
2. **The first `handback/` path wins; otherwise the first `.md`.** This verb carries a hand-back, and rings routinely
   name the files they changed too — B's named two of its own older hand-backs.
3. **Every OTHER path the ring names is listed on the digest line as not hashed:**
   `[digest at ring: git-blob <id> — <path>, <n> bytes, computed by call_librarian when the ring fired; also named, not
   hashed: a, b]`. A pick made from prose can still be wrong, and this puts that on the one line the reader checks. The
   librarian caught L060 only because the line named its file; now the line also names the alternatives.

**Why MARK and not REFUSE when several `handback/` paths are named.** Refusing would refuse **B's exact ring**, which is
correct and ordinary: a hand-back plus the older hand-backs it reworded. And this verb is the one that loses work when it
refuses (D069, D077): the pointer goes to a refused-row on the board, not to the librarian. A refusal rule would
therefore fire on the commonest correct shape, in the verb where a false refusal costs the most. The packet's
alternative, a marker, needs a convention no pane writes today, and a gate that requires one would refuse every ring
until every pane learned it. **What is still unguarded, named rather than hidden:** a ring that names an OLDER
hand-back before the one it delivers, e.g. "reworded exo_memory/handback/old.md; hand-back at
exo_memory/handback/new.md". The gate hashes `old.md`, and the digest line then names `new.md` as not hashed, in plain
sight. That is the case a marker would close.

## 2 · RED FIRST, THEN GREEN — the command beside every number

The fixture is **B's ring text as the librarian received it** (board row 30708), with the ring line removed and the one
digest the gate had stripped put back as a sha256 token of the same shape, so the whole gate runs over it. Its three
named hand-backs exist in the fixture checkout.

    CARGO_TARGET_DIR=/c/build/a-l069-target cargo test digest_at_ring      (in consonance/src-tauri)
      BEFORE (HEAD's gate)            16 digest tests (the L061 count)
      RED (7 new tests)               18 passed, 5 failed
        FAIL a_pointer_ending_a_sentence_keeps_its_path_and_loses_the_full_stop
        FAIL b_s_l060_ring_points_at_the_hand_back_it_delivered
        FAIL b_s_l060_ring_is_digested_against_the_delivered_hand_back   (hashed …/p-six-reds-B_2026-09-19.md)
        FAIL the_other_files_a_ring_names_are_listed_as_not_hashed
        FAIL a_handback_path_wins_over_an_earlier_changed_file
        green at red ON PURPOSE (controls): with_no_handback_path_the_first_md_is_still_the_pointer,
        a_ring_naming_one_file_says_nothing_about_others
      GREEN                           23 passed, 0 failed  (×3 in parallel)
      + 1 test after the mutant pass  24 passed, 0 failed

    FULL CRATE, final source
      cargo test --bin consonance                         854 passed, 0 failed, 4 ignored   (packet's last 846/0/4, +8 mine)
      cargo test --bin consonance -- --test-threads=1     854 passed, 0 failed, 4 ignored
      cargo test   (every target)                          main 854/0/4 · 77/0/3 ×2 · 22/0 ×3 · arch_test 11 passed, 1 FAILED

**The arch_test red is not mine, and is red at HEAD:** `every_named_record_file_exists_and_every_record_file_is_named`
→ *"record/retired_seats_2026-09-11.md is named by no card"*. Re-run on a clean detached worktree of **HEAD 7da934d**
(`git worktree add --detach`, same test, since removed): the same failure. It concerns a card reference to a record
file, not code.

## 3 · MUTANTS — the tracked harness, run in PARALLEL (L061's lesson)

    node consonance/tools/mutant-harness.js <scratchpad>/l069/rows.js
      FIRST RUN:  pre-flight 23/0 · 9 listed · 8 killed · 1 SURVIVED · 0 no result · 0 not applied
        #9 a repeated path is listed twice — nothing named one path twice. Rings do (a path in the body and again in
           the NEXT line), so a test now pins "one path, one mention".
      FINAL RUN:  9 listed · 9 killed · 0 survived · 0 no result · 0 NOT APPLIED · live mcp.rs unchanged: true
        #1 the full stop is kept again (the L060 misfire)   #6 the other named paths are never listed
        #2 leading dots are trimmed too (./x becomes /x)    #7 the hashed path is listed among the not-hashed
        #3 a handback/ path no longer outranks an .md      #8 a single pointer still grows an empty list
        #4 the LAST handback/ path is taken                 #9 a repeated path is listed twice
        #5 with no handback/ path, nothing is the pointer

## 4 · HOW FAR THE MISFIRE REACHED — every digested ring on the board, replayed

    node <scratchpad>/l069/replay.js          (read-only over C:\Consonance\data\board.jsonl)
      rows carrying a ring digest: 34 · distinct rings: 34 · unparsed rows skipped: 0
      rings whose hashed file differs from the new rule's pick: 1
        pane B 2026-09-21T09:02:54Z  hashed …/p-six-reds-B_2026-09-19.md  →  new pick …/p-l060-carriers-B_2026-09-21.md

**L060 is the only one.** The other 33 rings agree under both rules, so the change moves nothing that was right. The
quantity could take more than one value (33 same, 1 different), so the check was able to find a second misfire and found
none. **Limit:** `replay.js` is a JS replica of `pointers_in`/`pointer_in`, not the Rust. Mutants #1, #3 and #4 pin the
Rust on B's shape.

## 5 · WHAT I DID NOT VERIFY

- **The live verb.** No rebuild or relaunch (keeper, 05:55), so no real `call_librarian` has run the new gate. This
  file's own ring below goes through the **old** gate. It names the hand-back first, but it also ends the sentence with
  `.md` followed by a space, not a full stop, so it should hash correctly either way. The librarian can check the path
  its digest line names.
- **The older-hand-back-first shape** (§1) is marked, not prevented.
- **Machine D** was not run. **The js-suite** was not run; I touched no JS.
- **arch_test's red** is attributed by the HEAD re-run, not diagnosed.

NEXT: librarian check that this ring's digest line names p-l069-ringdigest-A_2026-09-21.md, then collate L069 packet 2, when the file is read
