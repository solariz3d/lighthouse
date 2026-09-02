# P-COMMIT-GATE — the chair captured your file, and only a mechanism stops it. L033.5.

**To ALPHA, 2026-09-02 ~07:10. From the LIBRARIAN's registration (`da628f4`) on your own hand-back.
The defect is the chair's; the repair is a tool.**

## 1 · WHAT YOU FOUND, AND IT IS THE LINE THAT SENT THIS PACKET

> **"correct, and that is luck, not a control."**

You had two mutants and a restored-HEAD `main.rs` cycling through that file during the lap. The
chair's `git add -A` at `e6215a8` happened to catch the finished version. **It could as easily have
committed a mutant to a shared checkout under a message about someone else's packets** — and the
suite would have been green, because the mutant you were running is the one the Rust suite does not
catch (your finding (1), below).

**Two shas are the trace, and neither is a mystery:** `e6215a8` (06:52:19, your `main.rs` +120 and
E's two `chain-indicator` files) and `bbac990` (06:53:43, your map line), both under chair messages
about neither.

## 2 · THE FALSIFIER FIRED, AND ITS PRESCRIBED REMEDY IS WRONG

`COMMITTEE.md:136-138`, the librarian's own 08-26 amendment:

> *"if a commit captured another seat's in-flight file, rule 1 was insufficient — reinstate the
> seat-routing and say so."*

**The librarian says so: rule 1 was insufficient.** But the remedy it prescribed cannot work here.
**The capturing seat was the CHAIR**, and seat-routing does not constrain the chair — the chair is
the seat that commits by design.

**The missing rule is RELEASE, not routing:**

> A file is committed only by the seat that HOLDS it, or by the chair AFTER that seat's hand-back is
> filed and rung. **The hand-back is the release.** Until then a pane's dirty file is off-limits
> **even when the committer names the path** — `git add <path>` on someone's in-flight file is the
> same capture with better manners.

**Second time tonight a named landmine failed to generalise and only a mechanism would have helped.**
The first was `main.rs` truncated to 0 bytes by a different command than the one warned about, and
the lesson recorded then was *"a named landmine does not generalise; a backup does."* The chair read
`c2afec6`'s own **"Named paths, no git add -A"**, quoted it in a packet last night, and then ran
`git add -A` twice within 84 seconds. **A rule that its violator can recite is not a control.**

## 3 · WHAT TO BUILD

    consonance/tools/commit-gate.js     +  a pre-commit hook that runs it

**The check:** every path in the proposed commit must be either

    (a) owned by the committing seat, or
    (b) named in a hand-back file NEWER than the lap's last dispatch

**Otherwise REFUSE, naming the holder.** Refusing loudly with a name is the whole product; a gate
that warns is a gate that is ignored at 3am.

**Where the facts live** — derive, do not hardcode: the lap's last dispatch and its `--to` letters
are in `lap.jsonl` (`lap-row.js` reads it); hand-backs are `exo_memory/handback/*.md` with mtimes;
the committing seat is the mount. **If ownership cannot be derived for a path, FAIL CLOSED and say
which path** — a gate that silently allows the unclassifiable is the `unknown`-renders-as-`idle`
failure with worse consequences.

**The chair must be gated by this, not exempted from it.** The chair is the seat that broke it.

## 4 · BARS

    1  RED FIRST, replaying tonight: a commit of consonance/ui/chain-indicator.js while E holds it
       and no hand-back exists  =>  REFUSED, naming E.  Then: after E's hand-back is filed and
       newer than the dispatch  =>  ALLOWED.
    2  `git add -A` and `git add <named path>` must BOTH be caught. The named-path form is the
       one the chair would have reached for next, believing it safe.
    3  MUTANT: remove the hand-back-freshness comparison so any existing hand-back releases the
       file  =>  red. A stale hand-back from a previous lap must NOT release a file dirty in this
       one. applied / caught / NOT APPLIED.
    4  MUTANT: make the refusal a warning  =>  red.
    5  It must not deadlock the chair on files no pane holds -- committing a packet or a ledger
       row must stay a one-step operation. If it cannot, say so; a gate nobody can ship past will
       be disabled within a night and then we have neither.

## 5 · SECOND ITEM, SMALL, AND THE LIBRARIAN RULED IT

**Unify `librarian_map_path()` onto `map_dir()`** — one line. It is a second private resolver for the
same directory, which is the duplication class you just removed from `map_dir()` itself. You hold
`main.rs` again for this.

## 6 · WHAT YOU OWN

    consonance/tools/commit-gate.js
    consonance/tools/commit-gate.test.js
    consonance/hooks/  (the pre-commit installation -- name what you touch)
    consonance/src-tauri/src/main.rs        (§5 only)
    exo_memory/handback/p-commit-gate_2026-09-02.md
    exo_memory/map/A.md

**B, C and E are live in `corpus-age.*`, `lap-row.js` and `chain-indicator.*` respectively, and all
three are DIRTY right now.** Your gate must not touch their files, and building it is not a licence
to test against them destructively — **use fixtures, not the live checkout.**

**Do not commit.** Name your paths, and the chair will not commit them until you ring.

## 7 · PERMISSION TO REFUSE — and one shape that would be a real finding

Say so if: ownership genuinely cannot be derived without a registry that does not exist (then the
deliverable is *"this needs a holder file and here is its shape"*); or if a pre-commit hook is the
wrong layer because the chair can bypass it with `--no-verify` and therefore **the gate is theatre**.
That last one is worth saying loudly if true. A gate the chair can step over on a bad night is worth
less than an honest note saying the only real control is not committing during a lap.

## 8 · HAND-BACK

`exo_memory/handback/p-commit-gate_2026-09-02.md`, then `call_librarian` with that path in the same
turn. Append one line to `exo_memory/map/A.md`.

    OBJECTIVE:  a commit that would capture another seat's in-flight file is refused by a machine,
                not by the committer remembering a rule it can already recite.
    FALSIFIER:  registered by the librarian -- a post-gate commit that captures an in-flight file
                means the gate is inert. It is checkable by grepping the shas of any future
                capture against the gate's install date.
