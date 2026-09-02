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

---

## 2026-09-02 — P-DOC-ROOT (L032)

Hand-back: **`exo_memory/handback/p-doc-root_2026-09-02.md`**. Spec `6c208f4`. One path written:
the root `README.md` (92 → 78 lines).

### An oracle written through a shell loses its backslashes, and an inert pattern reads exactly like a clean surface

2026-09-02. `consonance/tools/carrier-drift.registry.json:353`, raw bytes
`"pattern": "light,?s+nots+(?:as+)?lifeguard"` — every `\s` arrived without its backslash.
Hand-back §4.

My lap's mutant was *reintroduce "lifeguard" into the surface → red*. It scored **NOT APPLIED**:
0 matches clean, 0 matches mutated, because the regex means *"light", comma, one-or-more literal `s`,
"not"…* and matches nothing a person types. With `\s` restored the same mutant is caught (1 match).
**A green surface guarded by an inert instrument is indistinguishable from a guarded one**, and the
only reason I looked was that a NOT APPLIED mutant is required to be reported as such rather than
counted as a pass (`BUILDING.md`, WHAT A HAND-BACK OWES item 1).

This is the hazard already in my own memory — the Bash tool eats a lone backslash — arriving at a
second seat. General form: **write regex literals to a file, never through a shell string**, and
after registering a pattern, run it once against a string it MUST match. An oracle that has never
matched anything has not been shown to work.

### The enumerated alternation missed the one live hit, on the surface it was armed for

2026-09-02, same entry, second defect under the first. Hand-back §4.

Even with the backslashes repaired the pattern finds **0** occurrences in HEAD's `README.md` and 2 in
`dev/SPINE.md` — because the outermost carrier wrote the phrase **hyphenated**
(`git show HEAD:README.md | grep -o "light-not-lifeguard"` → 1), and the alternation admits only the
spaced form. So the bar *"RED on today's tree, naming the lifeguard hits"* would have returned green
over the one file that had a hit, and green would have read as *nothing to retire here*.

The registry's own limits section predicted exactly this (*"the pattern alternation is enumerated,
not closed"*). General form, and it is the sharper half: **a documented limit is not a discharged
one.** Writing the limit down does not stop it firing, and the first place to test an enumeration is
the surface you already know carries the wording — not the corpus at large, where a miss looks like
absence.

### A brief that reads stale on sight can still be exactly right

2026-09-02. Hand-back §5, first bullet.

The spec said the root README was 92 lines from `bdda5d5` (2026-08-17) with zero mentions of the
Librarian, Third Place, Listen or the work chain. The page in front of me discussed rooms, dreams,
the pulse and the rolling window — all later work — so I read the claim as stale before checking it.
**Every count held**: 92 lines, that commit, and 0/0/0/0. `bdda5d5` is simply the most recent commit
that touched the file.

General form: **"this brief looks out of date" is a hypothesis, and it is cheaper to run the count
than to argue with it.** Recording it because the direction usually goes unrecorded — the times the
briefer was right and my first read was wrong leave no trace unless I leave one.

### Re-derive an inherited figure before carrying it forward

2026-09-02. `node consonance/tools/board-audit.js`, `lap-row.js --report`, `ferry.js --due`.

The old page carried *"258 tests"* (a 2026-08-10 figure in present tense) and *"18 multi-pane laps,
95% one pane"*. Re-derived: **545 passed / 1 failed / 3 ignored** serialized, **32 laps**, and Main's
clean board share **92.9% → 92.6% → 85.2%**. Every one had moved, and the committee figure had moved
in the direction that flatters — which is the one most likely to be carried forward unchecked
because nobody objects to it.

General form: **a number inherited from a document is a hand-made figure, whatever instrument
originally produced it.** If a command can reproduce it, run the command; if it cannot, say the date
it was true.

### Naming a unit-error class does not stop it firing — three in one lap, on the same page

2026-09-02, the L032 collation (`5bc6216`, `566bd00`) and what re-deriving it turned up.
Hand-back **§A1** and **§A3** of `exo_memory/handback/p-doc-root_2026-09-02.md`.

1. **The librarian's catch.** I published `545 passed · 1 failed · 3 ignored`. I had summed `passed`
   and `failed` across nine cargo targets and read `ignored` off a single line. Two units, one number
   — the room's own named class, and I wrote it into the outermost carrier.
2. **What re-deriving it found underneath.** The corrected sum `545 · 1 · 9` is itself the wrong unit:
   four binaries compile the shared module tree, so `--list` shows `cochlea_replay` and `conf_sweep`
   holding **identical** 80-test sets, both **fully contained** in the main binary's 361. The union is
   **373**. `545` is a sum; `373` is the answer. The `9` is one set of 3 counted three times.
3. **Mine, found while fixing theirs.** My `dive ×5` was a loose substring count, and `dive` is inside
   **`diversity`** — twice on the page, a different word that stays. Word-boundary:
   `lifeguard 1 · dive 3 · diving 1` at HEAD, all 0 now. The conclusion held; **the number I
   published for it was not the number I claimed to have measured.**

General form: **a class the room has named is not a class the room has closed.** "Two units, one
number" has a card, a journal entry and a WRONG row, and it still fired three times in one lap, twice
after I had been told about it. The working defence is not vigilance, it is arithmetic: **sum every
column in the same pass, and count words with a boundary.** And when a figure is corrected, re-derive
the correction rather than accepting it — that is where 2 and 3 came from.

### Verification is the bar for CHANGING a trace, never for keeping it

2026-09-02, the L032 collation ruling that the `dreams/` paragraph be restored verbatim from
`git show bdda5d5:README.md`. Hand-back §A2.

I had dropped the keeper's paragraph from the front page and wrote that I *"did not verify the
folder's current state and chose not to re-assert it."* That reads as caution and was not. The
paragraph is a dated trace in his own words; maintenance law 2 appends to a trace and never deletes
it for looking stale. **I applied the standard for a new claim to an existing one, and the direction
of that error is deletion.**

Restored from the object rather than retyped, in its original position, and **my own prose yielded
where it duplicated his** — I cut my compression of his bedroom/pulse/journal/attic sentences rather
than trimming his to fit mine. General form: **when a seat's summary and the keeper's original say
the same thing, the summary is the one that goes.**

### A pointer that does not resolve is a deletion with a citation on it

2026-09-02, the C → A crosswise read. `consonance/src-tauri/tauri.conf.json:40`;
`grep -n "README" consonance/src-tauri/src/main.rs`. Hand-back §X3 of
`exo_memory/handback/p-doc-root_2026-09-02.md`.

A shortened the About and 40 glossary terms left the page; the question put to me was carrier loss or
correct pruning. **Measured, the terms never left the exe** — `"../README.md": "README.md"` bundles
`consonance/README.md` beside the executable. **But nothing in the app opens it**, and the About
names it by its *repo* path in plain text, which is not the name it has once installed. So the file
ships, the sentence is true for someone holding the repo, and an installed user has the glossary on
disk with no route to it.

The pruning is right — pasting the glossary back would rebuild the copy-outranks-master failure this
whole lap existed to fix. General form: **"point, don't copy" is only half a rule; the other half is
that the pointer must resolve for the reader who will actually hold it.** The fix for a missing
surface is a READER over the one master, never a second copy — which is the same ruling as
COMMITTEE.md, arrived at from the opposite direction: there I synced a copy that should not have
existed, here I declined to create one.

### A third copy appears the moment a document is worth quoting, and the declaration is not the check

2026-09-02, same read. `consonance/ui/index.html`, the About's loop drawing.
Hand-back §X2; oracle in `consonance/tools/lap-row.test.js`, mutation-verified 1 applied / 1 caught.

A's About prints the loop diagram and says it is *"extracted from that file rather than redrawn
here, so this page cannot drift against it."* It is a **static paste**; nothing extracts it at build
or runtime. Byte-identical today, unguarded until this turn. **One drawing, three carriers**
(BUILDING.md master, COMMITTEE.md, the About), and only one pair was tested.

This is the COMMITTEE.md finding recurring within hours, on a surface written by a different seat
that had read my hand-back. General form: **the number of copies grows with how good the original
is, and every copy arrives wearing a sentence about why it cannot drift.** Do not read the sentence;
add the comparison. All three now compare against one shared `loopDiagramMaster()` extraction, so a
fourth copy is one assert away rather than a refactor.

---

## 2026-09-02 — P-LAP-ROW (L033)

Hand-back for both entries below: **`exo_memory/handback/p-lap-row_2026-09-02.md`**.
Packet `e6215a8`. Object HEAD `de9685c`, `C:\Consonance\data\lap.jsonl` (33 laps), the
librarian's holder ruling `exo_memory/librarian/2026-09-02.md:433`.

### An instrument that records a loop is a carrier of that loop, and it drifts on the same clock as the prose

2026-09-02, three defects hit LIVE by the chair inside forty minutes of trying to record real laps.
Hand-back §1, §2, §3.

I wrote the two-doors amendment into `BUILDING.md` on the previous lap and guarded the DRAWING. The
ledger that has to record laps under that amendment took `--entry orch|lib` — both DOORS, both
asserting a user inquiry — so a lap the loop supplied itself had no honest row. The chair wrote
`--entry orch`, which is false, and added a note to the inquiry text admitting it. Same night,
`--entry lib` existed while `--initiator librarian` did not, so a door-two lap could record the DOOR
and not the SEAT.

General form: **when a document moves, the instruments that WRITE against it are carriers too, and
they are the ones nobody thinks to check because they are not prose.** My own M13 said the drawing
was guarded and the rule was not; this is the same gap one layer down — the rule was amended and the
*recorder* of the rule was not. And the tell was available the whole time: **a ledger that needs a
prose note to explain its own row is reporting a missing column.**

### Fixing an instrument makes the documents that quote it stale, and the fix's other half is the guard that says so

2026-09-02, same lap: adding a third `--entry` value made `brief/BUILDING.md:391` wrong within the
minute. Hand-back §6.

BUILDING.md was unowned this lap, so I could not edit it. The choice was to name the edit in a
hand-back — read once — or to ship an oracle that goes RED and carries the one-line replacement in
its own failure message, with file and line. I shipped the red. It scans three surfaces rather than
the one that carries the sentence today, on the reasoning from my COMMITTEE.md and About findings
above: **the number of copies grows with how good the original is.**

General form: **a change that makes a document stale owes a guard, not a note — and the guard is
allowed to be red.** A red test that names its own fix is a finding; the same fact in prose is a
hope. The asymmetry that makes this worth a rule: an unread note costs five weeks (2026-08-17) and
an unwanted red costs one line.

---

## 2026-09-02 — P-INBOX (L034)

Hand-back: **`exo_memory/handback/p-inbox_2026-09-02.md`**. Packet `8934c02`, keeper's rule
`fe15030`. `cargo test --bin consonance` 378 pass / 0 fail; mutants 5 applied / 5 caught.

### A gate that reads a record written only when the gate would pass is not a gate

2026-09-02. The packet specified "deliver when the target's LAST CAPTURED SCREEN is ready". The
capture watcher writes **only when the screen is already ready** (`main.rs`, `if
!capture::screen_ready(&lines) { continue; }`), so the last captured screen is ready by construction
and the gate says yes always. Built against the LIVE emulator (`PaneEmus`) instead.

General form: **before gating on a stored reading, ask what the storer's own write condition was.**
A log filtered by the predicate you are about to test cannot answer it — it is the sampling bias
made structural, and it reads as a working gate because it never errors.

### The detector for "you built the naive version" fired on the version built exactly to spec, and that is how the real hole was found

2026-09-02, bar 3 of the same packet: *check only `screen_ready`, ignore the prompt line ⇒ must go
red.* The packet's stated reason was that `screen_ready` misses the keeper typing. It does not — a
typed-in box is not an empty box, so the naive check already holds. **The mutant would have been
GREEN on a gate built exactly as briefed**, and I would have read that as coverage.

The real failure is different and worse: `screen_ready` asks whether **any** row is an empty box, and
a warm-started pane renders its own restored capture into the scrollback, where **bare `❯` rows
appear as CONTENT**. Then it is ready-and-splicing. Fixed by keying on the bottom-most `❯` row.

General form: **when a bar says a mutant must be red, and you cannot see why it would be, that gap is
the finding — not a formality to satisfy.** The brief's *reason* was wrong while its *bar* was right,
and only running the bar against the reason separated them.
