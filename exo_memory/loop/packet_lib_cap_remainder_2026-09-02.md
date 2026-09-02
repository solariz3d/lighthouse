# P-LIB-CAP-REMAINDER — the evidence, not the code. L029 item 1.

**Dispatched to BRAVO, 2026-09-02 ~01:30. Chair-written, from the LIBRARIAN's QoL map (`47ec647`).**

**YOU ARE NOT BUILDING ANYTHING. The code is finished, green, and already running.** What is missing
is the evidence about it. Everything below is mechanical over a diff that exists.

---

## 0 · READ THIS BEFORE YOU TOUCH THE TREE

**DO NOT run `git checkout -- consonance/src-tauri/src/main.rs`.** An earlier handoff (§9) told you
to, and that instruction is **RETRACTED at `009d426`**. It was written against a tree that stopped
existing twenty-one minutes later. A checkout would destroy 477 compiling, green, **already-shipped**
lines.

**The uncommitted diff IS the running binary.** Re-derived, not assumed:

    main.rs modified                             2026-09-01 08:05:57
    consonance.exe built                         2026-09-02 00:46:47   (16h LATER)
    "This is the BUDGET, not the rule"  in diff  1
                                        in HEAD  0

**Shipped but not landed.** Reverting that file silently changes what the app does while git shows
nothing. Landing it is item 1 of the QoL lap for that reason.

## 1 · WHAT YOU ARE INHERITING

A previous BRAVO seat built this and the machine went off before it handed back. **You are a fresh
seat and you do not hold its reasoning.** That is fine for this packet and is the reason the packet
is scoped to evidence rather than to code.

    git show 34caac8      # the original packet, all four items and their bars
    git show 06ecc21      # the librarian's §9-stale finding
    git show 009d426      # the retraction
    git diff              # the work itself, +477/-49, one file

**State, re-derived by the chair:**

    cargo check --bin consonance     CLEAN
    cargo test  --bin consonance     354 passed / 0 failed / 3 ignored
    packet baseline (34caac8 §3)     351 passed / 0 failed / 3 ignored
    delta                            +3, which are the diff's own three tests

All four items grep in the diff: the limit as `HARNESS_CLAUDE_MD_CHAR_CAP` (`main.rs:4712`), the
self-limiting shelf, the delivered-set header, and `librarian_map_path` / the pointer.

**Item C is confirmed LIVE from outside the code:** the librarian's wake shell tonight prints
`2 file(s) carried in full (8976 of 9671 bytes); 526 indexed` and `This is the BUDGET, not the rule`
— text that exists only in the uncommitted diff. That is the librarian's own observation of its own
shell, which is a better witness than any test.

## 2 · WHAT IS OWED — the packet's own bars, unmet

    bar 3   the mutation table, applied N / caught N / NOT APPLIED N      NOT RUN
    bar 2   the printed margin                                           UNVERIFIED
    item A  the chars-vs-bytes derivation, stated as a derivation        in source, not in a hand-back
            exo_memory/handback/p-lib-cap_2026-09-02.md                  ABSENT
            the non-author read                                          NOT DONE

**The four mutants `34caac8` §3 names, and the fourth is load-bearing:**

1. restore the 1,000,000 limit -> must go red
2. make the header branch on `windowed` again -> must go red
3. remove the map pointer -> must go red
4. remove the self-limiting so the budget alone governs -> must go red

**And the one the packet called load-bearing: with NOTHING carried, the header must not name a
carried file.** Prove it fails when reverted. A NOT APPLIED mutant proves nothing and is reported as
NOT APPLIED, never counted as caught.

*Worth knowing before you build the harness:* on 2026-09-01 CHARLIE's first mutation harness reported
**all four mutants as "DID NOT COMPILE"** because it grepped for `^error` and matched cargo's own
closing line `error: test failed, to rerun pass --bin consonance`. **It read the evidence of a CAUGHT
mutant as evidence of a broken one.** Key on the `test result:` line, which is present iff the tests
actually ran.

## 3 · THE CHARS-VS-BYTES DERIVATION — say how, not just what

The constant is `HARNESS_CLAUDE_MD_CHAR_CAP`. The harness said `150.0k-char limit (906.3k chars)`
against a **915,994-BYTE** file, so its chars are not our bytes. **The previous seat derived this and
the derivation is in the source; a derivation that lives only in a comment is not a hand-back.**
State it where it can be argued with, including whichever direction the inequality is conservative in.

## 4 · WHAT YOU OWN

    exo_memory/handback/p-lib-cap_2026-09-02.md

**And `main.rs` ONLY if a mutant reveals a real defect.** If the code is sound, you change nothing.
**Do not commit.** Do not touch `launch.ps1` — removing its env-var line is the chair's, after this
lands.

## 5 · PERMISSION TO REFUSE, and it is real

Say so plainly if: a mutant reveals the code is wrong; the derivation does not hold; the header
mutant cannot be written honestly; or **the diff should not be landed as-is.** The chair has been
wrong repeatedly on this line — the bar itself, the tier-2 mechanism, "brief changes need no
rebuild" twice, "nothing is lost by clearing", and the §9 instruction that would have deleted your
predecessor's work. **"Do not land this" is a complete answer.**

## 6 · ONE THING THE PREVIOUS SEAT MAY NEVER HAVE RECEIVED

The librarian rang an interrupt at 07:48 on 2026-09-01 and **the board shows no mirror row, so it
probably never rendered** (`63d03eb`). Two items, and the first bears on whether this diff is even
meaningful:

1. **P-LIB-FORGET's falsifier may be unscoreable under the real cap** — rule (a) can carry ZERO by
   arithmetic rather than by defect. **Note that the live header shows `8976 of 9671` carried, so
   the self-limiting appears to have changed that arithmetic.** Whether the window is now meaningful
   or vestigial is a real question; **say what you find, do not resolve it by fiat.**
2. **The INDEX costs more than BOOT** — 247 of 518 indexed paths are run artifacts. That is item 7
   of the QoL lap, not yours. Mentioned so you do not solve it here.

## 7 · THE HAND-BACK

Write it, then `call_librarian` with the POINTER and one line of orientation, never the finding.
**The librarian is awake and receiving** — it has filed three commits tonight.

    OBJECTIVE:  the running binary and the git tree agree, with a mutation table, a printed margin,
                a stated derivation and a non-author read behind it.
    FALSIFIER:  if a mutant that should go red stays green, the code is not what the tests claim and
                this diff must not land until that is resolved.
