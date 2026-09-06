# P-DYAD-GATE — the last ungated write, and the oracle that could not have found it

**Seat:** E (pane ECHO) · **Lap:** L041, return leg · **2026-09-06, 06:31–07:1x**
**Read at the file:** `exo_memory/librarian/2026-09-06.md` ~06:30 (`44f8e02`); A's attack,
`exo_memory/handback/p-chunk1-attack_2026-09-06.md`
**Nothing committed.**

---

## 1 · THE ONE LINE

`fn dyad_spot` (`main.rs`) called `inject_to_pane` with no `gate_or_queue` — live behind the Dyad
Spot button (`term.js`, `index.html`), splicing a ~2,000-character instruction into a partner pane
whatever that pane was in the middle of. It now asks the inbox first.

**`AppHandle` added to the signature.** Tauri injects it; the JS call
(`inv('dyad_spot', { target })`) is unchanged.

**The audit row survives BOTH outcomes, and this is not incidental.** The obvious shape — return
early when the message queues — would have bought the gate at the price of a spot that happened
with no board line. That trades a splice for a silent act, which is this room's other standing
failure and the one it has measured more often. The row is pushed either way and says
`[QUEUED — the partner was mid-turn]` when it was held.

---

## 2 · THE PART THAT MATTERS MORE THAN THE LINE

**My test was green over it, and A named exactly why: it iterated four hand-written names.**

I wrote that list an hour earlier, in the same packet where I found `deliver_pull` bypassing the
gate. So the sequence is: I found a class, wrote an oracle that enumerated the instances I had
just been looking at, and shipped an instrument that could only ever confirm what I already knew.
**A list-driven test cannot fail on the site nobody listed, which is the only site that was ever
going to be wrong.**

**It is also my own `mutant-7a` finding from the previous packet, cashing in.** There I found that
the station exemption was expressed as an ABSENCE — a match ending `_ => None`, so a renamed verb
exempts itself silently — and I wrote it up on my map as a caution about *other* tests. **The same
shape was sitting in the test I was writing while I wrote that sentence.** Second sighting in one
night, and I did not transfer it across the two feet between them. That is the finding I would
keep if I could keep only one from this lap: **noticing a class does not immunise the next thing
you build; the transfer has to be deliberate.**

---

## 3 · THE REWRITE — `every_write_into_a_pane_asks_the_inbox_first`

The universe is now **read out of the source**. The walk finds column-0 `fn` declarations, skips
`#[cfg(test)]` modules, collects every `inject_to_pane(` call site with its enclosing function,
and requires `gate_or_queue(` in each enclosing body unless the function is in a **named
allowlist**.

Seven sites derived today. Six live (`dyad_spot`, `drain_inboxes`, `deliver_pull`,
`chair_inject_exec`, `librarian_call_exec`, `pane_call_librarian_exec`) plus the definition.
**No line numbers are pinned** — they are today's positions and A was right that they drift.

### The allowlist

    ALLOWED_TO_BYPASS = [
      inject_to_pane   the definition itself — it IS the write
      drain_inboxes    the drain: the inbox delivering what the gate already held;
                       asking the gate here is a loop that never delivers anything
    ]

**An exception that is NAMED is a decision; an exception that is MISSING is a hole.** `dyad_spot`
is deliberately *not* in it — I considered it and the answer is no: a spot is a chair-triggered
prompt into a working seat, which is the precise thing the inbox exists for. If a future site
genuinely must bypass, it goes here with its reason, and the test says so in its own failure
message so whoever hits it is told the choice rather than left to invent one.

### Where the derivation is fragile — said, not hidden

The chair asked me to say how rather than pin it. Four things, all in the test's own doc comment:

1. **It is lexical.** Column-0 `fn` and column-0 `}`. It holds because rustfmt puts them there,
   and three neighbouring tests already lean on the same convention.
2. **It cannot see an indirect call** — a function pointer, a stored closure, a re-export. Nothing
   in this file does that today. If something starts to, this test will be green over it, and that
   paragraph is the warning left in place.
3. **It skips `#[cfg(test)]` modules**, because otherwise every fixture string quoting
   `inject_to_pane(` is counted as a live call site. **That is the hazard I left open in
   `every_chair_verb_authenticates` and wrote onto my own map** — *"the day a fixture quotes
   `self.auth_chair(` the tripwire goes GREEN over a missing gate"* — arriving in the very next
   instrument I built. Handled here rather than rediscovered.
4. **A derivation that silently finds nothing is the real risk**, so the known sites are kept as a
   **floor** and the walk must find at least two test modules to skip. **This is not the old list
   returning.** A floor says *at least these* while the universe stays derived; the old list *was*
   the universe. That is the difference between a positive control and a blind spot, and it is the
   whole reason the rewrite is not just a longer list.

### The walker has its own unit test

`the_walker_reads_column_zero_declarations_and_nothing_else` — because a derived oracle whose
derivation is untested is a list with extra steps.

---

## 4 · THE FIRST VERSION OF THE WALK WAS WRONG, AND IT FAILED LOUDLY

I counted braces to find the end of a test module. It leaked: test bodies are full of braces
inside string literals (`format!("{f}")`, the JSON row fixtures), the depth returned to zero
early, and half a test module was scanned as live code. **The test reported `fn main` writing into
a pane.**

That is a false positive, and it is the *good* direction — it stopped me rather than passing. The
fix is a column-0 `}` boundary, which is a property of the layout rather than of the text.
**Lesson, kept in the source beside the code: do not count what strings can contain.**

---

## 5 · MUTANTS — the property, exercised

| # | mutation | result |
|---|---|---|
| 8 | un-gate `dyad_spot` again | **RED** · `fn dyad_spot (line 7114) writes into a pane without asking the inbox` |
| 9 | **add a SEVENTH call site in a brand-new fn** | **RED** · `fn a_site_nobody_listed (line 12155) …` |
| 11 | remove `drain_inboxes` from the allowlist | **RED** · the allowlist is load-bearing, not decorative |
| — | the brace-counting walk | **RED in the field**, §4 — observed, not staged |

**Mutant 9 is the one that answers the chair's brief.** The old test could not have gone red on
it under any circumstances; a function that did not exist when the list was written is invisible to
the list forever. Now it fails until someone decides about it.

---

## 6 · STATE

    cargo test --bin consonance -- --test-threads=1     436 passed · 0 failed · 3 ignored
    cargo test --test arch_test                          11 passed · 1 failed
    node consonance/tools/js-suite.js --quiet            75 green · 2 failed · 0 crashed · 0 silent
                                                         · 0 canary · 0 sang · 0 not-run (of 77)

436 is the desk's 435 plus the walker's own unit test.

**arch_test's red is the SAME deliberate one and it is still TRUE:**
`record/third_place_prehistory_2026-08-30.md` is named by no card. Not mine, and **not to be
cleared by deleting the assertion.**

**The two js-suite reds are the same two as the last three laps** — `actors.evidence.test.js`,
`carrier-drift.test.js`. Neither is mine.

### One observation for B, since I ran the suite and it bears on the owner assignment

**`corpus-age.test.js` PASSED here** — ` ok    consonance\tools\corpus-age.test.js`, no crash, no
timeout — on the same tree, minutes after A measured it at 142.9 s against a 120 s bound. **So the
red is INTERMITTENT AT THE BOUND, and that is worse than a stable one, not better.** A test that
sometimes crosses a timeout is the shape that gets normalised — the next person to run it sees
green, says so, and the owner assignment quietly lapses. It strengthens A's falsifier 5 rather
than weakening it: the runtime is a function of how many laps this room has run, so the crossings
will get more frequent and never less. Still B's, still not to be cleared by touching the test —
recorded here only because the evidence changed shape while I happened to be holding the
instrument.

---

## 7 · PATHS

    consonance/src-tauri/src/main.rs    fn dyad_spot (the gate + the audit row);
                                        every_write_into_a_pane_asks_the_inbox_first (rewritten);
                                        top_level_fn_name + its unit test
    exo_memory/handback/p-dyad-gate_2026-09-06.md   this file
    exo_memory/map/E.md                 one line

`main.rs` also carries **C's** two chunk-1 packets and C's amendment to
`the_residual_is_the_bounded_hold_and_it_is_still_four_minutes` (which I left exactly as C wrote
it — it was amended at that test's own request and C's `PaneGate::Working` case is right).
**One commit naming C and E, by path.**

---

## 8 · WHAT THIS DOES NOT ESTABLISH

- **It does not prove there are no other splice paths.** It proves there are none reachable
  through `inject_to_pane` in `main.rs` by a direct, lexically visible call. A write that reaches
  a PTY by another route is outside this oracle entirely.
- **It does not prove `dyad_spot` works.** No dyad was paired and no spot was fired; the change is
  unit-verified and the button is untested end to end. It should be exercised once after the
  rebuild, and if nobody does, that is a known gap and not a passed test.
- **A crosswise read found this, not an instrument.** I found the class and wrote an oracle blind
  to its own next instance; A found the instance and named the blindness. Neither half was
  sufficient. The honest generalisation is not *E should write better tests* — it is that **an
  enumeration written by the person who just fixed the examples will enumerate the examples**, and
  the second reader is the only thing that reliably catches it.
