# P1 — the gate flip is resolved: 59 seconds, one `cat >>`, and an unanchored substring

**Filed 2026-08-27 by pane D (packet P1, lap D001).** Answers the falsifier registered in
`exo_memory/loop/gate_nondeterminism_2026-08-27.md`. **No rebuild was performed at any point** — see
§6. Every number below has the command that produced it printed beside it.

> **OPERATIONAL WARNING, read before you write anything up.** The shipped assertion counts an
> **unanchored substring**. Any file under the CARRIED tiers of the shelf — the root of
> `exo_memory/`, `cards/`, `record/`, `memory/`, `librarian/`, `spread/`, `research/` — that merely
> *quotes* BOOT's opening header line, in prose or inside a shell command, **turns this gate red**.
> Writing about this bug in a carried note is how the bug fires. Put such quotations in `journal/`,
> `loop/` or `map/` (indexed — body not carried), or break the literal. Below, the header is written
> as `# BOOT ... the room you wake into` for exactly this reason; the real literal has an em-dash.

---

## 1. THE VERDICT

Section 3 of `gate_nondeterminism_2026-08-27.md` says *"nothing about the mechanism is established."*
It is established now, and that file's own falsifier chose the outcome:

> *"If instead the flip cannot be reproduced and a specific state change between 12:47 and 12:54
> explains it, then this is one stale reading and not a class, and section 3's generalisation should
> be struck."*

**A specific state change explains it. Section 3's generalisation should be struck.**

The gate is **deterministic**. It is a **pure function of the corpus on disk at the moment it runs**,
and the corpus changed between the two runs — by an append the librarian seat made **59 seconds after
its own green run**, containing the very string the assertion counts.

## 2. THE MECHANISM

`shelf_tests::the_librarian_intake_carries_boot_exactly_once` (main.rs:7487) asserts:

    let n = i.matches("# BOOT ... the room you wake into").count();
    assert_eq!(n, 1, ...);

`str::matches` is an **unanchored substring scan**. It does not count copies of BOOT; it counts
**occurrences of a line of text**, wherever they appear — including inside a quoted shell command in
an unrelated note that `corpus_shelf()` happens to carry in full.

- **Copy 1** — `librarian_intake()` appends `room_master_path()` explicitly. Correct, intended.
- **Copy 2** — `exo_memory/librarian/2026-08-25.desktop.md:193`, which reads:

      grep -c '^# BOOT ... the room you wake into'       2      (lines 251 and 587)

  `librarian/` is a CARRIED tier (main.rs:4538, `("librarian", true, true)`), so that line rides into
  the composed intake verbatim.

**The second BOOT occurrence is the desktop's own measurement of the original duplication bug.** The
grep that proved BOOT rode twice was written into a note the shelf carries, and the string inside that
grep is what the new test counts. The test fires on the evidence for the defect it was written to
prevent.

    grep -rc "# BOOT ... the room you wake into" exo_memory --include=*.md | grep -v ':0$'
      exo_memory/BOOT.md:1
      exo_memory/librarian/2026-08-25.desktop.md:1            <- CARRIED tier
      exo_memory/loop/desktop_observations_2026-08-25.md:1    <- indexed tier, contributes 0

The third hit is in `loop/`, which is indexed rather than carried; only its first `# `-initial header
line reaches the intake, and that line is `# Desktop observations — 2026-08-25, from the desktop`. It
contributes nothing — confirmed by the mutation in §3 landing on exactly 1, not 0.

## 3. MUTATION, NOT ASSERTION — the A3 paired differential

Environment constant across the pair. **Same prebuilt binary, no cargo invocation, one line of corpus
differs.** Binary: `consonance/src-tauri/target/debug/deps/consonance-53554f9ca302342c.exe`, mtime
2026-08-27 01:54:55.

    # A — corpus as-is
    ./target/debug/deps/consonance-53554f9ca302342c.exe \
        shelf_tests::the_librarian_intake_carries_boot_exactly_once --exact --nocapture
      BOOT appears 2 time(s) ... left: 2  right: 1
      test result: FAILED. 0 passed; 2 failed; 325 filtered out      EXIT 101

    # B — one line deleted from the corpus, nothing else touched
    sed -i '193d' exo_memory/librarian/2026-08-25.desktop.md
    <same binary, same argv>
      test result: ok. 2 passed; 0 failed; 325 filtered out          EXIT 0

    # restored
    git checkout -- exo_memory/librarian/2026-08-25.desktop.md
    md5sum -c   ->  exo_memory/librarian/2026-08-25.desktop.md: OK

**Red to green on the deletion of one line of prose.** The working tree is byte-identical to before.

## 4. THE TIMELINE, FROM THE LIBRARIAN'S OWN TRANSCRIPT

`~/.claude/projects/C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl`.
Timestamps UTC; local is -0600.

    2026-08-25T18:46:23.609Z  tool_result   "cargo test @ 2c7b387 ...
                                             test result: ok. 324 passed; 0 failed; 3 ignored"
    2026-08-25T18:47:22.047Z  tool_use Bash  cat >> exo_memory/librarian/2026-08-25.desktop.md ...
                                             8,238 bytes appended; needle at offset 2595; 1 occurrence
    2026-08-25 12:54:36 -0600 commit 928c5ee "librarian desktop entry ~12:45 — and cargo is RED at
                                             this HEAD, not green"

**Fifty-nine seconds.** Not seven minutes of mystery — the green run, and then the seat appending its
findings to a file the gate it had just run reads live.

Corroborated from git alone:

    git log -S"grep -c '^# BOOT ... the room you wake into'" -- exo_memory/librarian/
      928c5ee 2026-08-25 12:54:36 -0600

    git show 2c7b387:exo_memory/librarian/2026-08-25.desktop.md | grep -c "# BOOT ... the room ..."
      0

At `2c7b387` — the commit **both** runs were made at — the note existed in the tree and carried
**zero** occurrences. The needle entered the working tree uncommitted, between the runs, and was
committed at 12:54:36 by the chair in the same commit that recorded the red.

    git log -S"if f == room_master_path()" -- consonance/src-tauri/src/main.rs
      e60344f 2026-08-25 11:30:35 -0600
    git log -S"the_librarian_intake_carries_boot_exactly_once" -- consonance/src-tauri/src/main.rs
      e60344f 2026-08-25 11:30:35 -0600

The skip-fix and the test landed together at 11:30:35, sixteen minutes before the green run. **The
green was real, and it was the fix working.** It stopped being green when the corpus grew a quotation.

## 5. TWO THINGS FOUND ALONG THE WAY, NEITHER OF THEM THE PACKET

### (a) The packet's refutation #2 failed on the anchor, not on the fact

The packet states:

> *"REFUTED: `grep -c '^# BOOT ... the room you wake into'` over every file in exo_memory/librarian/
> returns 0 for all of them."*

That grep is **anchored with `^`**. The assertion is **not**. The needle in the note is preceded by a
shell single-quote, so it is invisible to `^` and visible to `str::matches`. Both reproduced:

    for f in exo_memory/librarian/*.md; do printf "%s %s\n" "$(grep -c '^# BOOT ...' "$f")" "$f"; done
      0 for all nine files                    <- the chair's result, reproduced exactly
    grep -c "# BOOT ..." exo_memory/librarian/2026-08-25.desktop.md
      1                                       <- same corpus, unanchored

The refutation was sound about anchored headers and was measuring a different predicate than the one
that was failing. **A grep is only a refutation if it is the same grep the code runs.**

### (b) `322 passed; 2 failed` is ONE test, registered twice

main.rs carries a stray duplicate `#[test]` attribute at **7425/7431** and at **7478/7486** — an
attribute, a doc comment, then a second attribute. The harness registers both:

    ./target/debug/deps/consonance-53554f9ca302342c.exe --list | sort | uniq -d
      shelf_tests::the_librarian_intake_carries_boot_exactly_once: test
      shelf_tests::the_third_place_intake_fits_under_the_limit_it_must_obey: test
    ./target/debug/deps/consonance-53554f9ca302342c.exe --list | tail -1
      327 tests, 0 benchmarks        <- 325 distinct

So the suite total is inflated by 2, and **a single failure of either test prints as `2 failed` and
drops the pass count by 2.** That is the entire `324 = 322 + 2` arithmetic that made a wrong mechanism
look obvious in `928c5ee`. Nothing was miscounted by anyone; two attributes were.

## 6. THE PROPOSED FIX — WRITTEN, DELIBERATELY NOT LANDED

**Landing it edits main.rs, and the next `cargo test` rebuilds, which destroys the specimen. That call
is not mine.** The specimen has now yielded the mechanism, so the cost of spending it is low — but the
constraint outranks the packet and the chair decides. Patch, ready to apply:

    -        let n = i.matches("# BOOT ... the room you wake into").count();
    +        // LINE-INITIAL only. An unanchored count is a count of QUOTATIONS, not of copies:
    +        // on 2026-08-25 this gate flipped red 59s after a green run because a carried
    +        // librarian note quoted this header inside a shell command. Both genuine copies
    +        // start a line — BOOT.md:1, and corpus_shelf writes each body after "\n\n".
    +        let n = i.match_indices("# BOOT ... the room you wake into")
    +            .filter(|(x, _)| *x == 0 || i.as_bytes()[x - 1] == b'\n')
    +            .count();

    plus: delete the stray #[test] at main.rs:7425 and main.rs:7478.

**The predicate was mutation-tested outside the binary**, because validating it in Rust requires the
rebuild. A JS replica of `corpus_shelf()` + `librarian_intake()` was run over three corpus states:

    CASE 1  corpus as-is                              unanchored 2   anchored 1
    CASE 2  a carried file replaced by a FULL COPY of BOOT
                                                      unanchored 2   anchored 2
    CASE 3  the quotation removed                     unanchored 1   anchored 1

The replica agrees with the binary at both points the binary was actually measured: **2** for the
corpus as-is (§3 A) and **1** for the quotation removed (§3 B). **CASE 2 is the one that matters** —
the anchored predicate **still goes red on a genuine second copy of BOOT**. This is a correction of
the instrument, not a weakening of it.

*(The replica's first version disagreed with the binary — it returned 3, because it compared paths
with mixed separators and so failed the `f == room_master_path()` skip. That disagreement is why the
replica is reported as a validated instrument rather than trusted as one.)*

## 7. WHAT I DID NOT VERIFY

- **The proposed fix has never been compiled.** It is validated only in a JS replica that agrees with
  the binary at two points. It is not Rust, it is not run, and it is not landed.
- **The binary I ran is not the specimen binary.** `consonance-53554f9ca302342c.exe` was built
  2026-08-27 01:54:55 and registers **327** tests; the flip window's runs registered **324**. It
  reproduces the same assertion failure at the same source line, but it is a later artifact. I did not
  find a 2026-08-25 binary and did not look hard for one.
- **I did not prove the working tree at 18:46:23Z matched `2c7b387`'s tree.** I proved the needle was
  absent from that commit's version of the file, and that the append carrying it happened at
  18:47:22Z. Some other uncommitted edit before 18:46:23Z that also removed a needle would produce the
  same evidence; I consider that remote and did not exclude it.
- **The untracked `exo_memory/librarian/2026-08-27.desktop.md` was not isolated.** It carries zero
  occurrences (`grep -c` = 0) so it contributes nothing, but I did not run with and without it.
- **I did not check the laptop's corpus.** The laptop's own close-out records `324 passed · 0 failed`
  from a corpus I cannot see from here.
- **I did not audit any other assertion for the same unanchored-substring class.** There are 189
  `#[test]` attributes in main.rs; I looked at one.
- **I ran nothing else.** No full `cargo test`, no js-suite, no other packet's files touched. Working
  tree contains only this file.

## 8. WHAT THIS DOES AND DOES NOT SETTLE FOR THE RECORD

It settles this gate. It does **not** rehabilitate single-run gate readings in general — it removes
the one piece of evidence that had been offered for their weakness. The honest restatement of section
3 is narrower, and I think more useful:

**Any test that reads the live corpus is a function of a directory other seats are writing to while it
runs.** It is deterministic in the corpus and non-deterministic in wall-clock — a different failure
with a different fix: not *"run it 3/3"*, but **know which of your gates read mutable state, and pin
or snapshot it.** A2's 3/3 rule would not have caught this. Three runs a minute apart, all after
18:47:22Z, agree perfectly and are all red.

And the sharper version, because it is the shape rather than the incident: **this gate reads a
directory the seats write their findings into, so writing down what a gate found can change what that
gate reports.** The instrument is inside its own measurement space. That is worth knowing before the
next corpus-reading test is written, and it is not fixed by anchoring the needle — anchoring only
closes the one door a shell quotation walks through.

## FALSIFIER FOR THIS FILE

If anyone re-runs §3's paired differential on this machine at this corpus and does **not** get
FAILED/EXIT 101 then ok/EXIT 0 from that single `sed -i '193d'`, this file is wrong and the mechanism
is not what I say it is.

If the §6 fix is landed and the gate does not stay green while a deliberately re-introduced full copy
of BOOT still turns it red, the fix is a weakening and should be reverted.
