# P-DIGEST-AT-RING · ALPHA — the ring computes the digest from the file its pointer names, or it says there is none

**Pane A, machine L, 2026-09-20 02:4x–03:2x.** Lap L061 packet 3, plus the chair's HELD repair at ~03:1x (§3b).
**One file, `consonance/src-tauri/src/mcp.rs`, +438 −0** (`git diff --stat -- consonance/src-tauri/src/mcp.rs`,
after the fixture repair; it was +425 −0 when the packet was first filed).
Not committed, not rebuilt. HEAD was `19bc10c` when I started and `318d4c2` when the mutants ran (the chair landed other
panes' work in between; nothing of mine is in either).

The defect as dispatched: a pane computes its hand-back's digest, keeps writing, and rings — C's first ring matched, C's
second quoted a digest for 529 lines while 42 more had landed three seconds earlier. **A digest that is sometimes right
is worse than none.**

---

## 1 · THE FIRST DECISION, BEFORE ANY CODE — WHICH DIGEST

The crate has no sha256 and no hashing dependency, and **this file already settled that question once**, for the seal
gate's key (`mcp.rs:1762-1764`): *"A git-blob id rather than sha256 because git is already this gate's one dependency
and the crate has no sha256; the digest names its function, per `cards/every-digest-carries-its-function.md`."*

I followed that precedent rather than reopening it, and rather than adding a dependency this packet does not authorise:
the ring computes a **git-blob** id with `git hash-object --no-filters`, and the line it writes says `git-blob`, so no
reader can take it for a sha256.

**The cost of that choice, stated rather than buried:** a pane-supplied `sha256 …` cannot be *compared* against a
git-blob. So it is **removed**, not caught. The reader never sees an unverified digest — which is the bar — but the gate
cannot tell the pane *"your digest was stale"*, and no board row says a mismatch occurred, because none can be detected.
**If the room wants the mismatch NAMED, the digest has to be a sha256 and the crate needs a hasher.** That is a
dependency decision, and it is the chair's or the keeper's, not mine to take inside a one-file packet.

## 2 · WHAT THE GATE DOES

`digest_gate(text, repo, git)` — pure but for the injected runner, the shape `seal_gate` already uses in this file so a
test can ask what the ring would do without a subprocess:

1. **Strip every pane-supplied digest** (`strip_supplied_digests`). A digest word — `sha256`, `sha-256`, `sha1`,
   `git-blob` — takes its following hex token with it, so a stale value cannot survive as a bare 64-hex string. Only a
   line that names a digest is rewritten; every other line keeps its own spacing.
2. **Find the pointer** (`pointer_in`): the first repo-relative `*.md` token, punctuation trimmed, because rings write
   `at exo_memory/handback/x.md (uncommitted;`.
3. **Compute at ring time:** `git hash-object --no-filters <checkout>/<pointer>`, and insert

       [digest at ring: git-blob <40 hex> — <pointer>, <N> bytes, computed by call_librarian when the ring fired]

   **before** the NEXT trailer, so the trailer stays the last line for the trailer gate and for the librarian.

**What refuses, and what only marks.** The bar says refuse when the pointer names no readable file, and that is what
happens — with the path in the refusal. But this verb is the one that destroys work when it refuses (D069's reason, and
D077's), so three other absences are MARKED and delivered, never refused: no checkout on this machine, a git that cannot
run, and a call carrying no pointer at all. In each the reader sees `[NO digest at ring — <why>]`. **No path through
this gate ever shows an unchecked digest.**

**A refusal keeps the pointer.** The refusal branch posts `refused_digest_row` — D077's row family, its label carrying
the cause — so a hand-back that cannot be hashed still leaves its attempt on the board. Its own audit line goes to a
`digest-gate` pane name, so what the ring hashed, could not hash, and refused can be counted apart from the trailer
gate's rows.

**The gate's DECISION is untouched, as the packet required:** `auth_address` and `auth_station` run first and unchanged,
and a test asserts both that the order is address → station → digest and that `digest_gate` mentions neither gate nor the
address table. Measured in the body: address row at offset 672, out-of-turn row 1990, digest gate 3576, digest refusal
row 4412, trailer gate 4877, delivery 5574.

## 3 · BARS — the command beside every number

    (cargo is C:\Users\zackn\.cargo\bin\cargo.exe through PowerShell, cwd consonance/src-tauri)

    RED FIRST (the gate and its helpers stubbed: pointer_in -> None, strip -> unchanged, digest_gate -> Deliver(text)):
      cargo test --bin consonance digest_at_ring -- --test-threads=1     3 passed · 8 failed · exit 101
        the 3 passes at red were VACUOUS on a stub that returns the text unchanged:
          prose_with_no_path_has_no_pointer (the stub returns None for everything)
          the_digest_line_leaves_the_next_trailer_last (nothing was inserted)
          a_call_with_no_pointer_is_delivered_rather_than_refused (the stub refuses nothing)
        mutants #4, #5 and #11 are what cover those three.

    GREEN:
      cargo test --bin consonance digest_at_ring -- --test-threads=1     16 passed · 0 failed  (see §3b: single-threaded
                                                                         is the condition that HID the fixture race)
      cargo test --bin consonance mcp:: -- --test-threads=1              94 passed · 0 failed   (78 + 16)
      cargo test --bin consonance -- --test-threads=1                   798 passed · 1 failed · 4 ignored

    THE ONE RED IS NOT MINE — shelf_tests::the_librarian_intake_fits_under_the_limit_it_must_obey:
      "librarian intake is 154087 bytes against a 150000 limit — the seat cannot open. Window the next tier; do not
      raise the limit." It is the shell-size guard reading exo_memory content, and mcp.rs cannot move it.
      Re-run at HEAD 318d4c2 in a clean worktree with its own CARGO_TARGET_DIR, my change absent:
        cargo test --bin consonance shelf_tests::the_librarian_intake -- --test-threads=1
          3 passed · 1 failed · exit 101 — the SAME test, red at HEAD with my change absent. It is not mine.
      (The same crate run on D last night had a different single red — the composer one — so this is L's, and new.)

    MUTANTS — consonance/tools/mutant-harness.js on a COPY (a worktree of HEAD with the live mcp.rs copied in and its own
    CARGO_TARGET_DIR; the live file hashed before and after; the worktree removed by the tool):
      node consonance/tools/mutant-harness.js <scratchpad>/digest_rows.js
      FIRST RUN (14 tests):  12 listed · 10 killed · 2 SURVIVED · 0 no result · 0 not applied
        #9  any git output is accepted as a digest         — nothing fed a code-0 git with a non-id on stdout
        #10 an escaping pointer is hashed, not refused     — my fixture's escaping path did not EXIST, so it was
                                                             refused by the readable-file arm even with the guard gone
      Both are gaps in my fixtures, not equivalent mutants. One test added for each, then re-run:
        --only 9   1 listed · 1 killed   (a_zero_exit_with_something_that_is_not_an_object_id_is_no_digest)
        --only 10  1 listed · 1 killed   (a_pointer_to_a_real_file_outside_the_checkout_is_still_refused)
      FINAL RUN, all twelve in one pass (16 tests):
        pre-flight, unmutated copy: green 16/0
        12 listed · 12 killed · 0 survived · 0 no result · 0 NOT APPLIED · live mcp.rs unchanged: true
        #1 the pane-supplied digest is trusted and carried   #7  the refusal drops the path it could not hash
        #2 a digest word keeps its hex                       #8  the ring hashes the pointer text, not the file
        #3 the hex bound misses a 64-hex sha256              #9  any git output is accepted as a digest
        #4 the computed digest is never inserted             #10 an escaping pointer is hashed, not refused
        #5 the digest line lands AFTER the NEXT trailer      #11 call_librarian stops running the gate
        #6 an unreadable pointer is delivered, not refused   #12 a refused digest stops keeping the attempt
        #1 is the one the packet named: restoring trust in a pane-supplied digest goes red.

    THE COMMAND'S VALUE IS REAL, not a shape I agreed with myself: one test runs the actual
    `git hash-object --no-filters` through `digest_gate_at` on a temp file holding "hello\n" and asserts the id is
    ce013625030ba8dba906f756967f9e9ca394464a — git's own blob id for those six bytes, on any machine.

## 3b · THE FIXTURE RACE — found by the chair, and my bars are why I did not find it

**The chair's `cargo test` failed on `a_pointer_with_no_readable_file_is_refused_with_the_path_in_it`, and it was my
test, not my gate.** `fixture()` keyed its temp directory on `format!("digest-at-ring-{}-{}", process::id(), now_ms())`.
Two tests entering in the same millisecond of the same process got the SAME directory, so the no-readable-file test
found the `hello\n` another test had just written — and `digest_gate` then did the right thing for a root that really
did contain the file, delivering a digest for 6 bytes. The panic text carried both facts (6 bytes, that exact path).

**Why I missed it, plainly: every bar in §3 was run with `--test-threads=1`,** which is the one condition under which
this race cannot fire. A number measured under the condition that hides the defect is not a measurement of the defect.
The chair's plain `cargo test` found it in one run.

**The repair:** one root per call — a `static FIXTURE_N: AtomicUsize` appended to the name. The tests' intent is
unchanged. The same class of collision was in a second place I wrote, and it is fixed with it: the escaping-pointer test
wrote `outside-<pid>.md` into the SHARED temp root, so it is now named from the unique fixture directory instead.

**Measured, in parallel (no `--test-threads=1` anywhere below):**

    cargo test --bin consonance digest_at_ring          x6 runs   16 passed · 0 failed, all six
    cargo test          (the chair's own command)       x3 runs   798 passed · 1 failed, all three
      the 1 is shelf_tests::the_librarian_intake_fits_under_the_limit_it_must_obey every time — L062, not mine.

**A race cannot be made to fail on demand, so the red-first evidence is a KILL RATE instead** (the harness, scored in
parallel: `<scratchpad>/digest_race_rows.js`, one row that puts the old pid+millisecond key back):

    node consonance/tools/mutant-harness.js <scratchpad>/digest_race_rows.js     x5 runs
      pre-flight (the FIXED fixture, unmutated, parallel):  green 16/0  — 5 of 5
      the mutant (the OLD key restored):                    KILLED      — 5 of 5
      killed by a_pointer_with_no_readable_file_is_refused_with_the_path_in_it every time — the chair's failure,
      reproduced on demand and then removed. (One run also took the_ring_computes_from_the_file_the_pointer_names
      with it, which is the same collision landing on a different test.)

So: 11 parallel runs of the digest suite green with the counter, 5 of 5 red without it.

## 4 · CORRECTIONS, INCLUDING TO MYSELF

- **My first wiring anchor was wrong and the test caught it, not me.** I pinned `self.send_chair(`; the call is wrapped
  across two lines as `self` then `.send_chair(`, so that spelling occurs nowhere in the body. It failed loudly rather
  than passing on nothing (the D076 hazard, avoided here by the `concat!` anchors this file already uses); the anchor is
  now `.send_chair(ChairCmd::CallLibrarian`, with the reason in a comment.
- **Two mutants survived the first run** (§3). Both were my fixtures being too weak, and both are now killed by a test
  that fails for the right reason.
- **One scratch escaping error:** a row's anchor ended in Rust's line-continuation `\`, which ate the closing backtick of
  a `String.raw` template. Caught by node, not by the harness; the anchor was shortened. Nothing tracked was touched.
- **The fixture race (§3b), found by the chair and not by me,** because I measured only under `--test-threads=1`. The
  standing lesson for my own bars: a suite that is only ever run single-threaded has not been run.
- **§5.1 IS RULED AND NOT YET BUILT.** The librarian's ruling is DO NOT STRIP, MARK: the D077/D078 refusal rows keep the
  pane's digest verbatim and append a marker saying the gate did not run, because a record that quietly edits what was
  SENT is its own defect. That is the opposite of stripping and it is right. **This packet did not ask me to build it and
  I did not** — the rows are unchanged. It wants its own packet.
- **Two more of mine are QUEUED by the chair, not decided here:** §5.3 (the pointer is the first `.md` token, so a ring
  naming a plan before its hand-back hashes the wrong file honestly) and §1 (git-blob means a stale digest is removed but
  never COMPARED, so a mismatch can never be NAMED — that needs a hasher in the crate and is the keeper's call).

## 5 · FOUND, NOT FIXED — the neighbouring refusal branches, as the packet asked

1. **The two refusal rows above this gate keep the PANE's digest, unmarked.** `refused_attempt_row` (D077) and
   `refused_address_row` (D078) are built from the raw `text`, before the digest gate runs, because both refuse before
   it. So a ring refused out of turn or with no address row still writes the pane's unverified digest into the durable
   board row, and a reader of that row has no marker saying so. **One line each would route them through
   `strip_supplied_digests` first.** I did not, because they are the branches the packet told me to state rather than fix,
   and because stripping changes what "the attempt, kept" means — the row is a record of what was SENT, and a record that
   quietly edits what was sent is its own defect. That trade is the chair's call.
2. **`an_admitted_call_does_not_post_the_row` still passes and still means what it says, but the sentence its NAME
   suggests is now false.** It counts `refused_attempt_row(` call sites; with this packet an ADMITTED call can post a row
   — the digest refusal happens after both gates pass. The test is right; the invariant "admitted calls are silent on the
   board" is not, and anyone counting rows should know it.
3. **The pointer is the FIRST `*.md` token in the call.** A ring that names another file before its own hand-back — "per
   `exo_memory/loop/plan_x.md`, hand-back at …" — gets the digest of the plan, computed honestly, of the wrong file. The
   line names the path it hashed, so it is visible rather than silent, but it is a real hole in my own change and the
   cheapest fix is the verb taking the pointer as an argument instead of parsing prose.
4. **Stripping is whole-message.** A hand-back whose FINDING is a digest ("the stock script is a360a546") loses it from
   the ring. The file is the master and the call is a pointer, so I judged this the right trade; it is a trade.

## 6 · WHAT I DID NOT VERIFY

- **No live ring went through this code.** Nothing is rebuilt: the running Consonance predates this change, so no seat
  has been refused or hashed by it. The gate is tested as a function and its wiring by source order.
- **The board rows were not observed.** `digest_audit` and the refusal row are asserted in source, not read off a live
  board.
- **Windows path edge cases are untested:** a pointer with a backslash, a UNC path, or a symlink. The guard rejects `/`,
  `:` and `..` segments; a `\\` separator would not be recognised as a path at all by `pointer_in`.
- **Concurrency:** nothing pins what happens if the file changes between `metadata` and `hash-object`. The digest is of
  the bytes git read, and the byte count is of the metadata call, so a file written in that window could print a size and
  an id from two different instants. It is a much smaller window than the one this packet closed.
- **Nothing on D.** This ran on L only.
- **The shelf red's cause was not investigated** beyond showing it is not mine (§3).

NEXT: librarian re-derive the bars and rule on §5.1 (whether the two older refusal rows should strip the pane's digest) when the file is read
