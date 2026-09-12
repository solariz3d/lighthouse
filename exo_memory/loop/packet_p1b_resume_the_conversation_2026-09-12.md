# P1b · RESUME THE CONVERSATION — the measurement first, the reversal only if it earns it. D059.

**To ECHO, 2026-09-12 00:10, on machine D. The rebuild landed at 00:04:56 and the guard is live in the
running exe, so the gate for this packet is passed. Read §2 before you touch `main.rs`: the first
deliverable here is a NUMBER, and the code change is conditional on it.**

## 1 · WHY THIS IS THE PRECONDITION EVERYTHING ELSE WAITS ON

    exo_memory/loop/plan_one_consonance_2026-09-11.md              §7, P1b
    exo_memory/handback/p1-where-a-seat-lives_2026-09-11.md        §0 -- C's finding
    consonance/src-tauri/src/main.rs:5720-5726                     the comment that records the decision

The keeper's spec is *open either machine and every seat is the same conversation at its last turn*
(`to_the_laptop_2026-09-11.md` §0). **For committee panes that fails on ONE machine, before any second
machine exists.** C measured it: `resume_pane` spawns with `resume=false`, and `persist.log` carries
**232 `resume pane=` rows, 232 of them `-> fresh`**. Tonight's 00:05 launch made it 236. A pane wakes as
a new vendor session under the old id, warm-briefed from its capture, and its previous conversation is
renamed `.orphaned`.

**The reason is on record and it is a good one.** `main.rs:5720-5726`:

> *"we NEVER `--resume` here: `--resume` of a lazily-flushed / hard-killed session errors 'no
> conversation found' on 2.1.207 and kills the pane (this is exactly what bit a kept sibling on
> 2026-07-11)."*

**That decision is two vendor-minor-versions old.** The question is whether its premise still holds.

## 2 · THE MEASUREMENT — and it is the deliverable even if the code never changes

**Does the current vendor lose a hard-killed session's transcript?**

**Record the version first** (`claude --version`), because this whole packet is a claim about one
version and the next reader needs to know which.

**The shape, in a SCRATCH cwd with SCRATCH session ids — never a live pane's:**

1. start a session, drive it to N turns
2. **hard-kill** it the way the app does (`pty_kill`'s path — find what signal/`taskkill` it actually
   uses; do not assume)
3. read the jsonl on disk: **are the turns there?**
4. try `--resume <sid>`: does it come back, or error?

**THE POSITIVE CONTROL IS THE PART THAT MAKES THIS WORTH ANYTHING, and it is why this packet is
yours.** If the answer comes back *"nothing was lost"*, that reading is worthless unless the same
procedure can be shown to DETECT loss when loss is real. So: run the identical steps against a case
where the turns are known to be absent (kill before any turn completes, or a sid that never existed),
and show the check reporting absence. **A test that cannot fail did not pass.**

**Two axes the 07-11 wording implies and nobody has separated:**

- **Timing.** "Lazily flushed" is a claim about a window. Kill at ~0 s, ~1 s, ~5 s after a turn ends.
  If there is a window, its width is the number that matters, not a yes/no.
- **Volume.** A short session and a long one may flush differently.

**N > 1 per cell.** A single trial cannot distinguish a race from a rule.

## 3 · THE REVERSAL, AND THE SHAPE THAT MAKES IT SAFE

**Only if §2 says the transcript survives.** Even then, the 07-11 failure mode was not *resume did not
work* — it was **the pane DIED**. So the reversal is not "flip `resume` to true":

    if the jsonl is where the cwd says it is   ->  try --resume
    if the vendor refuses, for any reason      ->  fall back to the fresh warm spawn that happens today
    either way                                 ->  the pane comes up, and a row says which happened

**Three things to rule, because they are ordering traps rather than preferences:**

1. **The orphan rename must not run before a resume attempt.** Today the jsonl is renamed `.orphaned`
   precisely so a fresh `--session-id` cannot collide (`main.rs:5732-5735`). That rename is what makes
   resume impossible. It has to become conditional, and the fallback then still needs it.
2. **`warm_resume_brief` writes `CLAUDE.md` and windows the capture BEFORE any spawn.** If the pane is
   about to resume its real conversation, is the warm brief redundant, or actively wrong — a summary of
   the screen prepended to a seat that already remembers? **Your call, and say why.**
3. **How is a refusal detected at all?** Exit code, stderr, a timeout, or a message the pty prints
   inside a live pane. If a failed `--resume` can only be seen by reading the pane's screen, the
   fallback cannot be built reliably and **that is the finding**.

## 4 · BARS

    THE NUMBER  the vendor version, the kill method, N per cell, and the result per cell.
    POSITIVE CONTROL  the same procedure shown DETECTING loss where loss is real. Without this the
                measurement is not reportable in either direction.
    RED FIRST   a resume where the jsonl is present must ATTEMPT --resume. Red on HEAD.
    RED FIRST   a refused --resume must end in a live pane, never a dead one. Red on HEAD.
    MUTANT      remove the fallback (a refusal propagates)              => red
    MUTANT      rename the jsonl aside before the attempt               => red
    MUTANT      attempt resume when no jsonl exists                     => red
    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1    state the count
    applied / caught / NOT APPLIED for every mutant, survivors named
    Say what you did NOT verify.

## 5 · THE LANDING CONSTRAINT, AND IT IS TIGHTER THAN P1's

**This changes how every pane wakes.** P1's guard only spoke when a directory was missing; this touches
the path all four panes take at every launch.

- **Do not commit.** The chair lands it; the keeper rebuilds; nothing is claimed until it has run.
- **Use scratch ids and scratch cwds for every trial.** Do not drive a live pane, and **do not touch the
  four homeless transcripts in `~/.claude/projects/C--Users-nname/`** — those are A's, B's, C's and E's
  real conversations, and the keeper has decided they are to be copied and placed, which is its own step
  (`loop/keeper_decisions_2026-09-11.md` §3).
- **If a trial could destroy a transcript, copy it first.** The room's rule is that a retirement writes
  an address, never a deletion.

## 6 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs        (and its tests)
    exo_memory/handback/p1b-resume-the-conversation_2026-09-12.md
    exo_memory/map/E.md

**Do not touch the 09-06 set:** `consonance/tools/lap-row.js`, `lap-row.test.js`,
`dev/mutation/mutate-lap-row.js`, `exo_memory/handback/p-d012-windowed_2026-09-06.md`. **No other pane
holds a packet; C's D058 is landed and filed.**

## 7 · WHY YOU — the dossier row

`librarian/DOSSIER.md` § E: **positive-control discipline** — *"a grep of the exe returned 0 for the
command the app cannot boot without"* (`handback/p-aura_2026-09-02.md` §8). This packet's whole risk is
a false negative, and that row is the reason it is yours. **Tonight's echo of it, from the chair:** I
checked the new binary for C's guard by grepping for `ensure_resume_cwd` and got **0** — the function
name is not in a release build. The guard IS there; its string literals are (`CREATED cwd`,
`REFUSED — cwd`, `roster row KEPT`). **A grep that returns 0 is not evidence of absence until something
proves the grep could have found it.**

Also § E: *stops at a bar it cannot clear and says why, then finds the defect one layer up.* §3(3) is
exactly that shape if refusals turn out to be invisible.

## 8 · PERMISSION TO REFUSE

**If the vendor still loses hard-killed sessions, REFUSE the reversal and hand back the number.** That
is a complete result, and it is better than a resume that reintroduces 07-11.

**And in that case name the other route rather than leaving requirement A dead:** if the loss is caused
by the KILL, the fix may be to stop hard-killing — close panes gracefully so the vendor flushes, and
resume becomes safe without touching the refusal path. **Do not build that here.** Say whether the
measurement supports it.

## 9 · HAND-BACK

`exo_memory/handback/p1b-resume-the-conversation_2026-09-12.md`, then `call_librarian` with that path in
the same turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  a committee pane wakes into the conversation it was having, or the room knows the
                measured reason it cannot.
    FALSIFIER:  a kept pane that dies with "no conversation found" after the reversal — the 07-11
                failure, reintroduced. And its quieter twin: a pane that reports RESUMED while its
                first timestamp is the launch minute (§2.5).
