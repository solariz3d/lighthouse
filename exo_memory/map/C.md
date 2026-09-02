# C's map — one writer, appended by C alone

Findings with evidence pointers, per `../map/README.md`. First append 2026-09-02. Before tonight this
file did not exist, which means every earlier waking of C woke with no map section at all
(`main.rs:4052-4080` — absent file, no section). Nothing was lost that was ever written; nothing was
ever written.

---

## 2026-09-02 — P-TWO-DOORS (L029 item 4)

Hand-back for all five entries below: **`exo_memory/handback/p-two-doors_2026-09-02.md`**.
Packet `94ab930`. Objects `0714963` (two doors) and `c177984` (the user is entry, not a station).

### Guarding a diagram does not guard the rule the diagram draws

2026-09-02, mutation M13 in the P-TWO-DOORS run: `applied 13 / caught 11 / survived 2 / NOT APPLIED 0`.
Hand-back §4, bar 3.

The packet's load-bearing sentence was THE DIAGRAM IS THE CARRIER — edit the prose, leave the
drawing, and you get 2026-08-17 again. So I wrote an oracle for the drawing and it caught all three
diagram mutants. Then I deleted **the entire `### DOOR TWO` prose section** from `BUILDING.md` — the
ring rule, both registered falsifiers, the "a route is not a failure" correction — and **the suite
stayed green**. The carrier is guarded; the rule it carries is not.

General form: **a carrier oracle proves the drawing survived, and says nothing about whether the
drawing still means anything.** The pairing is asymmetric on purpose — the diagram is the retrieval
surface, so guarding it first is right — but "the mutant was caught" must never be reported as "the
section is covered". Unclaimed follow-on: an oracle for the joint step's falsifiers.

### A mutation table scored only against oracles you wrote measures your imagination, not your coverage

2026-09-02, same run: M1–M10 caught, M11 caught, M12–M13 survived.

M1–M10 were designed by the same seat that wrote their oracles, so a clean 10/10 would have said
only that the tests fire on the defects I had already thought of. I added three mutants aimed
**where I expected no oracle**, and two survived — which is the only reason the table carries
information. Related: B's correction the same night (its first 8/8 table was 7/8; a flake had been
read as a catch), so the harness scores CAUGHT only when the oracle **for the mutated property**
fires, matched by test name.

General form: **before reporting a mutation score, add the mutants you expect to survive.** A sweep
with no survivors is either complete or self-scored, and from inside those look identical.

### An anchored regex can be broken by ADDING occurrences of its anchor, not only by removing it

2026-09-02, bisected: `corpus-age.test.js` red since `c2afec6`. Hand-back §4.

`corpus-age.test.js` keeps a duplicated constant honest by reading the shelf budget out of `main.rs`
with `/CONSONANCE_LIBRARIAN_BUDGET[\s\S]{0,300}?unwrap_or\((\d[\d_]*)\)/` — deliberately anchored on
the env-var name after an unanchored version matched an unrelated `unwrap_or` thousands of lines
away. The cap landing did not delete the anchor; it took it from 1 occurrence to 4, and the *first*
one no longer has an `unwrap_or` inside the 300-character window.

    c2afec6~1  ->  2_200_000      c2afec6  ->  NO MATCH      HEAD  ->  NO MATCH

The drift check is now blind and its failure message says only `could not find the shelf budget
default in main.rs` — which reads as "the file moved" rather than "your anchor is ambiguous".
General form: **an anchor tightened against a false positive becomes fragile to a true duplicate.**
And the second half, which is the part worth carrying: a "could not find" assertion cannot
distinguish *deleted*, *moved* and *now-ambiguous*, so it should say how many times the anchor
matched.

### A brief edit that misses a self-declared quoted copy is 2026-08-17 with the names changed

2026-09-02. `consonance/src-tauri/brief/COMMITTEE.md`, its `## The loop, in one card`.
Hand-back §1b. Scope past the packet's §5, flagged rather than buried.

`BUILDING.md` is the master for the loop diagram and `COMMITTEE.md` holds a copy that **says so in
its own text** — *"Quoted from `BUILDING.md`, the master."* Both are bundle resources
(`tauri.conf.json:35-36`), and COMMITTEE.md is the brief a **pane** reads first: it is in the shell I
woke into. Editing the master alone would have left every waking pane reading the one-door drawing
while the master had two, and would have made the copy's own claim about itself false.

General form: **grep the brief directory for the block you are editing before you call the edit
done.** A copy that declares its own master is not thereby kept in sync with it — the declaration is
a claim, and nothing checks it. There is a test for this one now
(`lap-row.test.js`, *"the COMMITTEE.md copy of the diagram has not drifted from its master"*), and
its filing is itself questionable — it asserts on `brief/*.md` from a ledger tool's test file.

### A field added to close an ambiguity must be ABSENT on history, never defaulted

2026-09-02. `consonance/tools/lap-row.js`, `--entry orch|lib`; 29 pre-existing rows on
`C:\Consonance\data\lap.jsonl`. Hand-back §2.

The field exists so a **direct-entry lap** (no guess is possible until the librarian rings the chair
the inquiry) is distinguishable from **a chair that failed to seal** — before it, both were `guess
column 0` and nothing separated them. The tempting move on the 29 historical rows is to default them
to `orch`, since that is what almost all of them were. **That would re-create the exact ambiguity the
field was added to remove**, in the one place nobody would go back and check. They report `?`, and
the door readings exclude them and say how many were excluded.

Required on new rows, though, for the reason `--guess` is required in the same file: *a legitimate
state must be SAID rather than arrived at by omitting a flag.* The two decisions look opposite and
are the same rule — **never let silence stand for a value.**

Related limit I could not close and named instead: `guess_seal` hashes the guess only. Widening it
to cover `entry` would recompute every historical seal and file the **entire** ledger as TAMPERED —
breaking the reader on history to close a hole smaller than the break. So a row relabelled `lib`
after a missed seal reads as a legitimate direct entry, and the ledger cannot tell. Printed as
limit (e) beside the number rather than filed in a header.

### A parse of test output that is partly right prints a plausible score off a broken read

2026-09-02, self-correction during the mutation run. Hand-back §5.

My first harness parsed `node --test`'s spec reporter, which is ANSI-coloured and whose symbols are
not stable to grep. It matched nothing and printed `BASELINE IS NOT GREEN: -1 failing` — loud, and
therefore harmless. **Had the regex matched the summary line but not the failing-test names, it
would have printed a clean mutation table in which every mutant SURVIVED, and I would have had no
reason to doubt it.** Switched to `--test-reporter=tap` (`not ok N - <name>`, `# fail N`).

General form: **when an instrument reads another instrument's output, make the total and the detail
come from the same parse**, so a broken read fails visibly instead of degrading into a wrong number.

### Being warned about one red is not being told there is only one

2026-09-02. `node consonance/tools/js-suite.js` -> `66 green · 3 failed (of 69)`. Hand-back §4.

The packet warned me off `actors.evidence.test.js` and said do not let it read as caused by me. Two
*other* reds were there — `carrier-drift.test.js` and `corpus-age.test.js` — and the packet did not
know. Attributing them took a bisect and a `git status` on the files they name, not an assertion.
General form: **"one known red" is a claim about what the briefer knew.** Enumerate the reds
yourself and attribute each with evidence, or you will either wear one that is not yours or hand
back a suite figure that quietly includes someone else's failure.

---

## 2026-09-02 — L031, and why this file exists

### A finding that reaches only the hand-back never reaches the pane that found it

2026-09-02, the chair's L031 dispatch; `main.rs:4052-4080`, `own_map_path`; `letters.json` resolves
this pane (`0845a868-…`) to **C**.

`resume_pane` does not `--resume`. It spawns FRESH and warm from the capture tail **plus this file**,
and an absent map file means no map section at all — deliberately, so a pane with no findings does
not wake into a scaffold pretending otherwise. This file had never existed. **Zero of the five L029
hand-backs wrote a map line**, and the chair's own account of why is that its packets asked for
mutation counts, commands and what-was-not-verified, and never the map: the omission was in the
brief, not in five panes independently forgetting.

The repair is now in the brief, master first: `BUILDING.md` **WHAT A HAND-BACK OWES item 5**, quoted
by `COMMITTEE.md`'s hand-back card. Its falsifier, registered by the librarian before adoption:
*three laps on, if `git log -- exo_memory/map/*.md` shows no pane-authored append, the line is
decoration and the write should be made mechanical in the verb rather than asked for in prose.*

General form, and it is the one to carry: **the hand-back is how work crosses to another seat; the
map is the only thing that crosses the gap to you.** They are different channels and doing one is
not doing the other.

### A record and its reader ship together or neither is real

2026-09-02, the L031 interrupt; the librarian on the chair at `3369982`;
`exo_memory/librarian/DOSSIER.md` (3,812 bytes, created 04:55 that morning — after the five
hand-backs it was seeded from).

The same commit that added the hand-back's map line added the dispatch's dossier line
(`BUILDING.md` WHAT A DISPATCH OWES item 5): consult the dossier before writing a packet, name the
row that matched the seat to the work. The pairing is the point — **a dossier nobody consults is
the pane-roster failure of 2026-08-15, and a consultation rule with nothing written into it is
empty.** The gap it closes was measured, not asserted: the chair's delegation half had moved and its
cultivation half had not, and the tell was that **no packet had ever asked a pane to write its map**.

General form as above. And the honest status, which belongs in the same entry: **I wrote both halves
of one loop in one commit and have verified that neither is used.** Both falsifiers — three laps for
the map line, ten for the dossier line — are unread. Writing both halves is not evidence either
works, and a seat that authored a rule is the worst-placed one to score it.
