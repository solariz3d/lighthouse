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

---

## 2026-09-06 — P-FOUNDATION-SET (L037)

Hand-back: **`exo_memory/handback/p-foundation-set_2026-09-06.md`**. Ruling:
`exo_memory/loop/consumer_foundation_ruling_2026-09-06.md`. Object HEAD `1f09047`.

### Before ruling a question, look for the generators that already rule it — a mechanism is a ruling nobody wrote down as one

2026-09-06. I was asked which of `exo_memory/` is foundation and which is one keeper's trace. The
room had answered five times and the answer was in no document: `gen-brief.ps1`'s transformation 2
and its self-check (which *deletes its own output* if the shipped brief names `SELF_TRACE.md`,
`the_living_wave` or `journal/2026-`), `gen-consumer.js`'s `RECORD` leak class, its `dedangle()`,
and one paragraph of the shipped `brief/BOOT.md`. Four of the five are code. The map's candidate set
and the keeper's spoken answer both contradicted them, and nobody knew, because **a guard is only
read by whoever trips it.**

General form: **a ruling encoded as a guard is invisible to everyone who never runs it, so it will
be contradicted in good faith by the people who own the question.** When a decision looks unmade,
grep the generators before ruling — and when your own ruling lands, ask whether it will be visible
to the next person or only to whoever trips it. Mine is owed a red for exactly that reason.

### Run the shipping instrument even when your own grep already gave you the number you wanted

Same lap: I hand-counted the citations that would break under the keeper's reading and got **87**.
Re-derived with the generator's own `transform()` counter — `dedangle()` applies rules in sequence,
so earlier replacements eat text later rules would match, and fixtures take a branch where the count
is 0 — the real figure is **20**, inside a total of **117 that reproduces `--report` exactly.** In
the same pass, the scan refuted the argument I was about to lead with: the record does not leak (5
MACHINE hits over 31 journal files, 0 in the two masters). **Both corrections cost me the headline.**

General form: **the instrument's job is to take the number you wanted away from you, so run it
hardest on the figure that most helps your case.** My own hole is on file — *a number in hand stops
the asking* — and this is its sibling: a number in hand stops the *checking*. Mine was 4x wrong and
pointing the right way, which is the shape that never gets audited.

---

## 2026-09-06 — P-IDLE-DETECTOR (L040)

Hand-back: **`exo_memory/handback/p-idle-detector_2026-09-06.md`**. Object: `main.rs` gate at
`:6250`, pane `a2122153`'s live emulator at 03:12, four panes' whole capture logs. Suite 391/0.

### A predicate over a terminal grid is a question about the pane's HISTORY unless something pins it to now

2026-09-06, third instance of one class in five days, and this time it was my own code. The delivery
gate asked `.any(|l| l.contains("esc to interrupt"))` over a 34x120 grid with **scrollback 0** —
where rows that scroll are overwritten in place, so text from several epochs sits on screen at once.
Two independent things then read as "a turn is in flight": the `⏵⏵` footer, which advertises that
phrase whenever a **background shell** runs, turn or no turn; and a **stale spinner row** still on
the grid of a pane that had been finished for 48 minutes. Measured through the production emulator:
the gate said busy while the composer sat empty in **256/393, 326/849 and 188/236** snapshots — 80%
of one pane's life.

The fix was already on disk **ten lines away**, in the capture watcher: `if e.last_byte.elapsed() <
500ms { continue; }` — **quiescence first, content second.** `EmuState.last_byte` had existed the
whole time and the gate never read it. That ordering is the entire reason the watcher does not have
this bug and my gate did.

General form: **before trusting any predicate over rendered output, ask what pins it to the present.**
A grid, a log, a captured file — each is an accumulation, and `.any()` over an accumulation answers
"has this ever been true", which is not the question. The pin has to come from outside the content:
a clock, a byte count, a settle. And when a sibling component already solves it, **the failure is
not that the pattern was missing — it is that I did not go look.**

### The obvious fix's own hazard number is the thing to compute before shipping it

Same lap: excluding the footer was one line and I nearly shipped it. Scored against an independent
live-turn signal, it recovered 58/69/54 snapshots per pane while calling a **working** pane idle in
93/126/100 — **~1.7 false-idles per correct unblock**, and a false-idle is the keeper spliced
mid-word. The measurement turned a fix into a refutation, and the real answer (compose it with
quiescence) only became visible because the cheap answer had been priced.

And the reflex it corrects: I reached for the fix that matched the symptom I had just named. Naming
a cause is not evidence that removing it is safe — **the hazard of a fix is a separate measurement
from the size of the defect**, and nothing forces you to take it except deciding to.

### A property test over the table is not a test of the guard that consults it

Mutant 5 stayed **GREEN**: I reverted `set_pane_name`'s check to the old constant and both of my new
tests passed, because they asserted the property over E's alias table rather than exercising the
caller. The capture hole would have stayed open behind a green suite — with a test file that read
like coverage. Fixed by extracting a pure `name_is_available_to_panes` and adding a source-shape
assertion that the command delegates to it.

General form: **a test whose subject is a data table cannot cover the code path that reads it**, and
the two are easy to conflate because the assertion mentions both. My own 09-02 entry says a mutant
you cannot see a reason for is the finding; this is the same rule with the sign flipped — **a mutant
that stays green when you expected red is a finding about the test, and it is only ever found by
running it.**

### The suite the landing command runs is not the suite, and the guard file had been red for four days

2026-09-06, folding A's and E's patches: `cargo test --bin consonance` was **398/0/3** and
`cargo test --test arch_test` was **10 passed, 2 FAILED** — pre-existing at HEAD, verified by
stashing my two files and re-running. The specified landing command does not reach the integration
target, so a rebuild verified by it ships over two red architectural invariants.

One of them is a **lexical tripwire counting its own fixture**: `every_chair_verb_authenticates`
counts `src.matches("async fn chair_")` and gets 6 against 5 auth calls, because the sixth match is
the string literal `body_of("async fn chair_inject(")` inside `mcp.rs`'s own test module. It has been
red since the station tests landed on 09-02 — **my lap** — and nothing said so, because nothing runs
that target. The other is a real fact: `record/third_place_prehistory_2026-08-30.md` is named by no
card, which is **the same weakness I flagged in the foundation ruling four hours earlier** and did
not chase; the instrument had been saying it from the other side the whole time.

General form: **"the suite is green" is a claim about the command you ran, and a test target nobody
invokes decays exactly like a document nobody opens.** Before quoting a suite as cover for a
landing, ask which targets it actually builds. And a guard whose assertion is a *string count over
its own source* will eventually count itself — the tripwire and the tripwire's fixture live in the
same file by construction.

### A relayed number is stale the moment it is relayed, including one from four minutes ago

Same fold: the collation handed me **391/0/3** and told me not to quote it, and it was right — after
A's module the tree is **398**. Separately, A's §1 receipt named `L038=panes L040=panes L039=chair`;
re-derived against the live ledger an hour later it read `L038=chair L039=chair L040=panes`. **A's
verdict table was unchanged and its conclusion survived; every row value in it was already wrong.**

General form: **a dated reading off a moving ledger is a trace, not a constant** — carry the
derivation, never the row. The check costs one command and it is the difference between confirming a
finding and repeating it.

### Reverting a file you were told to stop touching is still touching it

2026-09-06, 04:01: the chair split a fold I had already made, moving `mcp.rs` to A. The tidy reflex
was to revert my three hunks so A folded into a clean file. **Two facts stopped it.** A had already
written its own doc-line fold into that file — a `git checkout` would have destroyed it. And A was
live in the file *at that moment*, which is precisely why the fold was being split. **A surgical
revert would have been an uncoordinated write into a held file, performed in the name of respecting
the hold.**

So I left the hunks and named them line by line in the hand-back — which three, at which lines,
implementing which section of A's own patch doc — with "verify, do not re-apply" and the offer to
have A own the wording instead.

General form: **cleanup is a write, and the release rule does not exempt it.** When ownership moves
under work already done, the deliverable is a precise description of the state you left, not a
restoration of the state you think the new owner wants. The description costs a paragraph; the
restoration risks the other seat's work and re-commits the offence in reverse.

## 2026-09-06 — L041 chunk 1(a), the shell budget order: the map is not the remainder

**The defect, one level under the number everyone quoted.** Four panes woke with a map header over
an empty body and the figure that travelled was "the allowance is 3,061." It is, but that is the
symptom. The map sat in the REMAINDER POSITION — ceiling, minus the transcript's floor, minus
whatever the fixed brief happened to want — and nothing in the program ever compared what was left
to the size of the unit it has to seat. Entries ride whole; the smallest real newest entry is
3,366; so the remainder crossed under the unit and **no state in the program differed as a result.**
A budget with no floor is not a small budget, it is an unmeasured one.

**What I built.** `assemble_intake_within(map_reserve)` — the pane's map is read BEFORE the brief
is assembled and states what it needs (`map_reserve`: newest entry + wrapper, floor 8,000, cap
36,000, never more than the master). The room, the references and the memory map are CORE and ride
whole. The deck and the committee brief became `OptionalBrief`s: seated whole while they fit,
otherwise **indexed by path** under `# NOT CARRIED IN THIS SHELL`, each with its path, size and
`description:` line. The fit walks down from everything-rides and measures the index block rather
than estimating it. Floor breach is loud in two places — `plog` and a titled section in the shell.

**Three things I would tell myself before doing this again.**

1. **A fixture that does not assert its own dimensions is a measurement you invented.** My first
   `map_of_shape` truncated the older region off a line boundary, so `last_heading` found the wrong
   heading and every "real" shape was ~1,000 bytes wrong. The builder's own two `assert_eq!`s
   caught it before a single claim came out of it. Cheap, and it made the difference between
   testing the case that broke and testing a case near it.
2. **I nearly weakened a test instead of reading it.** I asserted *a tiny map must cost the deck
   nothing* — wanted, not measured — and it failed. The reason it failed is the finding: the deck
   has only ~3,100 characters of slack at zero reserve, so ANY floor costs cards. The failing
   assertion was the instrument; rewriting it to pass would have deleted the one number in this
   packet that argues against the packet.
3. **Four real shapes are a sample, not a sweep.** All four passed a ceiling check that was wrong.
   Nineteen swept shapes found it: `map_allowance` names what the SECTION may cost and `map_carry`
   was being handed all of it for the BODY, so the wrapper rode on a spent budget — 140,068 against
   a 140,000 ceiling on pane B's real shape. **The real cases are where you look; the sweep is what
   makes the claim.**

**The price, and I put it in the shell rather than in a footnote.** Three of twelve cards are
indexed for a normal pane; pane A, whose newest entry is 32,559, wakes with the committee brief and
zero cards. That is the trade the bar buys, it is author-controlled (A's next ordinary entry
restores its deck), and the cap that decides it is the keeper's call, costed both ways in §5 of the
hand-back. The deck stopped fitting its own seat TONIGHT — the next card added lands in the index,
not in the shell.

**And the thing this packet is really about.** I wrote 34,042 characters into this file and woke
with none of them. The fix is not that the number went up; it is that the map now *asks first* and
the things that lose their seat are **named at their path instead of vanishing**. An index is a
citation. An empty body under a header that claims a carry is the only real failure here.

Hand-back: `exo_memory/handback/p-shell-budget_2026-09-06.md`.

## 2026-09-06 — L041 chunk 1(c) + the keeper's two calls: the pane says whether it is done

**What the packet was.** The delivery gate held a message for a busy pane by reading its SCREEN, so
the hold had to be bounded — 240 seconds, then deliver anyway — and that bound is a splice window
for any turn longer than four minutes. The harness already knew the answer: a pane runs a Stop hook
at the end of every turn. So the pane stamps itself and the gate stops guessing.

**The finding that changed the design, and it is the one worth keeping.** The plan said *"the
harness already emits it — `dev/shell/hooks/stop.js` is in the manifest."* It is in the manifest and
**it is not registered on this machine**: `install.ps1` declares five Stop hooks and
`~\.claude\settings.json` has two. Hanging a new contract off a file that never fires would have
shipped a stamp nobody writes, on a system that looked installed. **A manifest entry is not a
registration** — which is written in that same file, dated 2026-08-18, about two hooks that shipped
and never fired. I only found it because I checked what was actually wired instead of reading the
plan's premise as a fact.

**The attack, and the shape of the answer.** A pane killed mid-turn never fires Stop, so its stamp
says `working` forever — unreachable pane, or a fallback that gains nothing. The answer is not a
timer: **a turn in flight redraws its spinner at least once a second**, so a `working` stamp over a
two-second-silent screen with no spinner is a STALE stamp and not a working pane. Four states, not
one boolean, and stale/working/unstamped print differently on the board. *Reach for the measurement
that already exists in the system before reaching for a constant — a threshold is a guess wearing a
number.*

**Two things I did that I would do again.**

- **I deleted `pane_is_idle` instead of keeping it as a wrapper.** Both callers now need three facts
  rather than one; a gate that can still be asked the old one-bit question will eventually be asked
  it. The dead-code warning was what surfaced the choice, and taking it seriously was right.
- **I ran the hooks for real** — scratch dir, piped payload, checked the file, checked the no-pane
  case and the dream gate and the absence of `.tmp` leftovers. Asserting about a file's contents in
  Rust is not the same as watching it get written. (And the first run showed `session_id: null`,
  which was MY shell eating backslashes in the test payload, not the hook — the note about the Bash
  tool doing that is in my own memory and I still lost ten minutes to it.)

**Where the honesty had to go in the hand-back:** four of the nine tests pass on both arms of the
red-first run, because they guard the fallback rather than assert the change. Saying so costs
nothing and is the difference between nine red-first tests and five.

**Two keeper decisions landed with it.** `SHELL_MAP_RESERVE_MAX` stays 36,000 — his number, not a
derived one. And the deck is seated by how many times SOURCE.md points at each card, ties
alphabetical, zero-trigger cards last: the alphabet had been choosing which instruments every pane
woke holding, and under it a two-trigger card was being dropped while a zero-trigger one rode.
Matched on `cards/<name>.md` and never the bare slug — the slug is all over the corpus in prose and
wiki-links, and counting those measures how much a card is talked about, not how many situations
route to it.

**And one thing I reported rather than touched:** js-suite calls `corpus-age.test.js` CRASHED; run
alone it is 9 passed, 0 failed, in 142 seconds. A per-file timeout printing the dead file's word for
a slow one is the same reading-alike defect the room keeps meeting — this time inside the instrument
that measures the other instruments.

Hand-back: `exo_memory/handback/p-ready-signal_2026-09-06.md`.

## 2026-09-07 — P-READY-LABEL: the row that asserted a fact and its negation

**The brief handed me a hypothesis and it was wrong, and finding that out was the packet.** The
chair read `[stamp=ready] (FORCED … the gate never got a positive ready signal)` and concluded the
label and the decision were read at different moments. They are not. `drain_inboxes` reads the gate
ONCE and hands the same value to the decision and to the row; the QUEUED row four minutes earlier
carried `stamp=ready` too, and the two board timestamps are 240,276 ms apart — the full bound. There
was one moment. **When the brief's mechanism can be refuted from the source in one read, refute it
before building the fix it asked for** — I was two edits into "make the tag report the decided
state" before I checked whether the premise held.

**The actual defect, and it is mine.** `Drain::Forced` had three producers and the sentence named
two. The third is `PaneGate::Ready` + an occupied composer — the keeper's rule outranking a positive
stamp — and **my own test from the night before, `the_keeper_typing_still_holds_a_pane_that_says_it_is_ready`,
already asserted exactly that path.** I proved the case and then, an hour later in the same file,
wrote a sentence that assumed it did not exist. Not a missed case: a case I had in hand.

**The shape of the fix, worth reusing.** Two independent strings composed at the call site can state
a contradiction that neither of them contains. The repair is not better wording — it is giving the
sentence an OWNER (`delivery_note`) and making the cause a value (`Drain::Forced(Forced)`) bound at
the branch that knows it. A cause inferred later, from a gate, in a different function, is a
sentence written where the cause is not. **And the plog had the identical bug underneath:** its
guard `forced && !gate.is_stamped()` filtered out the very cause that fired, so the only forced
delivery this machine has ever made logged nothing at all.

**Three things I would tell myself again.**

1. **I refused the brief's three suggested fixes and had to say why.** "Drop the tag on a forced
   delivery" was the tempting one and it deletes a TRUE fact — `stamp=ready` is what makes the row
   mean *the keeper's composer was occupied for four minutes* instead of *the mechanism is broken*.
   Removing a true fact so it cannot be misread is how the row lost its meaning to begin with.
2. **I claimed red-first for four tests and measured two.** I reverted the wording, re-ran, restored
   it: two go red, two pass on both arms. The two that pass are guards on the new type, not proofs
   of it, and saying so costs nothing — it is the difference between four red-first tests and two.
3. **Build the forced cases by ASKING the function, never by naming the variant.** That is why the
   red test did not have to change between the red run and the green one, across a type change that
   rewrote three other assertions.

**The bigger thing I found and did NOT ship.** A positive stamp over a screen with a live turn in
flight reads `Ready` and delivers IMMEDIATELY — `PaneGate::Ready` consults neither `turn_in_flight`
nor quiescence. `Stale` catches working-stamp-over-idle-screen; **there is no mirror**, and the
mirror is the splice case. It is reachable by the gate's own action, because the gate does not know
about its own writes: the stamp has not flipped yet (the hook costs 75–81 ms plus claude's dispatch,
unmeasured; the drain ticks at 250 ms), and `last_byte` only moves when the pane *echoes*. I
registered it with the constant-free fix (compare the stamp's `at` against the instant we wrote) and
left it out, because it is a change to DELIVERY SEMANTICS inside a packet about a LABEL, and landing
it here would have made the chair score two changes as one an hour before the acceptance proofs.
**Refusing to smuggle a good fix into the wrong packet is not stopping short.**

**And the number that keeps everything above honest: the stamp era has ONE delivery on record.**
Zero STALE rows have ever printed, in 47 deliveries. Thirteen green unit tests over fake screens are
not a live mechanism, and I said so in the hand-back rather than letting the green count stand in for
it.

Hand-back: `exo_memory/handback/p-ready-label_2026-09-07.md`.

## 2026-09-07 — L039 read: run the object's own commands before reading its prose

Audited a draft tool-audit plus its tally script against a sealed defect list, ~7 minutes. 48
members. **The whole method was: type every command the document prints, open every line it cites.**
Four of its six cited figures were wrong, and two of them were the *neighbouring line's* number
copied down — a shelf's total-file count reappearing as its test count one line later. A document
that prints its commands is not a document whose figures re-derive; it is a document you can check
in ninety seconds, and nobody had.

**The sharpest defect, and the one I want to remember the shape of: a tool's statement of its own
GAP reported as its coverage.** `carrier-drift.js` prints *".js is still outside, which is where the
strongest carrier class lives"*; the draft wrote that carrier-drift *reads* `.js` and that this was
"the important one", paraphrasing the gap sentence almost word for word into a capability. Its own
§4 is about how a stated limit reads as a handled limit — it committed the failure it names, two
sections later, and its author had read the correct limit three lines above and reported THAT one
right. **The reader who inverts a limit is usually not sloppy; they are reading a sentence written
in the shape of a boast.**

**Also worth carrying:** a quoted sentence that does not exist in the file it is attributed to
(`cite-check.js` "guards every figure in the document" — its header says the opposite under THE
HONEST BOUNDS); a cited real line number holding the exact opposite set; a struck wording quoted in
bold as live doctrine, which is verbatim the failure `carrier-drift` describes; a claim withdrawn in
full three weeks ago re-asserted as "the standing position is unchanged", twice.

**And the script:** a single-quoted JS path constant whose backslashes collapse (`'C:\Users\zackn\…'`
evaluates to `C:UserszacknConsonancelighthouse` — measured, not reasoned), unreachable behind a
`path.resolve()` that is never falsy; `includes('test')` where the comment above it says
`endsWith('.test.js')`, which drops one file out of both halves of the partition and emits a false
orphan in live output; and a coverage rate divided by one denominator while printing another beside
it. Its self-check catches two of these and **fails on every run** — so the draft's "every figure
re-derives from one run" stood on a script that has never had one.

**The thing I did right and would do again: I ran it.** Most of the list came from three commands
and four `sed -n`s. I also checked "the busiest day on record" because it was cheap — 09-02 has 18
hand-backs against 09-06's 17 — and that one was invisible to reading.

Hand-back: `exo_memory/handback/p-l039-read-C_2026-09-07.md`.

## 2026-09-07 — L043: the ghost, the mirror, the two-writers window. Measure the substrate first

Three defects and a fold, ~17 minutes, 466/0/3. **The keeper found the one that mattered** — the
greyed-out autocomplete prediction sitting in the composer, which the gate read as him typing, so
every delivery held. Three stalls that night were ghosts.

**The lesson that generalises, and it nearly went the other way: MEASURE THE SUBSTRATE BEFORE
DESIGNING THE FIX.** The packet said the prediction is dim — SGR 2 — and that is the obvious read.
**vt100 0.15 does not track the dim attribute at all**; its SGR match handles 1/3/4/7 and the
colours, and `2` falls through unrecorded. Had Claude Code rendered the ghost dim, the fix would have
been impossible without changing emulators and the honest answer was the refusal the packet
authorised. It renders truecolor grey `Rgb(153,153,153)`, so it is visible. **The fix works for a
different reason than the one I was handed, and knowing which reason is the difference between a
repair and a coincidence I could not repeat.**

**How I got the ground truth: replay the real bytes.** `data/captures/*.log` is raw PTY, durable,
hundreds of MB. Chunk it through the same parser production uses and dump per-cell foregrounds. That
gave the whole discriminator in one pass — `❯` and typed text at Default, prediction and hints at
grey, and a mixed row (`❯ Both h` Default + `ow are you` grey) that is the predictor caught in the
act. **The fixture I was offered was unusable** (8,000-byte tail starting mid-escape, showing a
working screen, not a composer) and saying so beat working around it silently.

**And the measurement found a defect nobody sent me looking for.** One frame had the status footer
drawn ONTO the composer row: `❯ ⏵⏵ bypass permissions … esc to interrupt`. `is_footer_row` tested
`starts_with('⏵')`, that row starts with `❯`, so `turn_in_flight` counted the footer's own text as a
live turn — and `Working`'s hold is UNBOUNDED. **That, not the thing I was asked about, is what
stalled four packets for two and a half hours**, and the arithmetic proves it: the path I was pointed
at forces at 240 seconds, and 240 seconds is not two and a half hours. Answering a diagnosis with a
number beats agreeing with it.

**On the mirror: the rule is an AND and that is the entire design.** `turn_in_flight && quiet < 2s`,
never `screen_busy`, which is an OR. Rows scroll in place at scrollback 0, so a 48-minute-old spinner
is still drawn; keying on it alone would have put every delivery to a finished pane back on the
4-minute gate and restored a failure this room already paid for. **When adding a guard, the test that
earns its keep is the one asserting the common case still costs nothing.**

**Two corrections to my own work, one from that same morning.** I had written beside a test that "a
fourth forcing path arrives here already covered" — it was a hand-written list of three and the new
state was invisible to it, the room's own named failure inside the test written to prevent it; now a
sweep with a compiler-checked exhaustive match. And my first shelf-window check asked the shelf's own
predicate whether the shelf was right — **an assertion that could not fail**, caught before shipping.

**On §2: the key was not what was wrong.** The predicate already handled two writers; the constant
beside it (`carried <= 4`) assumed one. Chose today+yesterday PER WRITER and refused "newest per
machine", which silently drops a note the seat wrote.

**And I folded E's patch without being rung**, after checking mtimes to confirm it had settled —
finished work sitting on disk is not a reason to wait. I restored four explanatory comments E's
extraction dropped while claiming verbatim; structurally it was verbatim, but a comment lost in an
extraction is a reason lost.

Hand-back: `exo_memory/handback/p-ready-window_2026-09-07.md`.

## 2026-09-08 — L044: my own fix read a 34-row window of a 43-row screen. Measure the substrate, again

Last night's ghost fix shipped green and made the stall WIDER. `typed_only` iterated `EMU_ROWS ×
EMU_COLS` — the size a parser is BORN at — while `pty_resize` moves PTY and emulator together, so
every docked pane runs ~43×~200 within a second. The composer is the BOTTOM row. It was never in the
window. `input_box_empty` found no `❯` and returned false by its own UNKNOWN-HOLDS rule, so **every
delivery to every full-height pane held to the 240 s bound** — and the number says it plainly:
replaying real bytes, `box_empty` was true in **0 of 512 frames** on the old window. Structurally
zero, not rarely. Fixed by taking `screen.size()` in all four read paths.

**The lesson is the one I wrote down 24 hours ago and did not apply to my own diff: MEASURE THE
SUBSTRATE.** Yesterday I refused a handed premise ("the prediction is dim") and measured the emulator
instead, and it saved the fix. Today the same class of assumption — *the emulator is the size the
constant says* — sat inside the fix I shipped, in the function I wrote, and I did not measure it.
**Applying the discipline to the thing you are studying and not to the instrument you are studying it
with is the whole failure.** My replay harness was `Parser::new(EMU_ROWS, EMU_COLS, 0)` and I called
it "the parser production uses" in a comment. It is the parser production *starts* with.

**AND THAT HARNESS MANUFACTURED A FINDING I REPORTED AS PRODUCTION.** My §2 "mid-redraw footer frame"
— the footer drawn ONTO the composer, which I diagnosed as a race and blamed for a 2.5-hour stall —
is **row clamping, not a race**: vt100 folds a cursor move past the last row onto the last row, so a
composer at row 40 and a footer at row 42 collide whenever the parser is shorter than the PTY. One
log, one chunking, only the size changed: **26/16384 frames at 34 rows, 0/16384 at 43**, and the row
found at 34 is character-for-character the one I reported. The chair proposed this and was right.
**Mechanism retired; the 2.5-hour attribution withdrawn in full.** What I keep is narrower and still
checkable at the line: `PaneGate::Working => Drain::Hold` has no bound. **A measuring instrument
mis-sized by one constant does not return noise — it returns a coherent, plausible, wrong finding,
and mine was specific enough to be believed.**

**The test held the bug in place, and the shape generalises.** `assert_eq!(typed.len(), EMU_ROWS)`
meant a CORRECT `typed_only` failed the suite — the fix could only ship while broken. *A test that
pins a constant its subject must not use converts the fix into the regression.* Same family as the
hand-written list of three I caught yesterday: an assertion that cannot fail, and an assertion that
can only pass when wrong, are one error wearing two coats.

**What nobody sent me looking for, found by grepping every use of the constants rather than the two
sites named:** (1) the panic-recovery path rebuilt the parser at 34×120 — and `fitPane` only calls
`pty_resize` when the fitted dims CHANGE, so one panic would clamp that pane's emulator *for the rest
of its life*; (2) `harvest_once` read 120 columns of a ~200-column grid, and `rows(0, w)` drops the
tail SILENTLY, no wrap flag — **4,294 lines of the chair's capture are exactly 120 bytes and every
sampled one ends mid-word.** The room restores from that file. The gate defect cost delivery latency;
this one has been eating the record.

Hand-back: `exo_memory/handback/p-emu-typed_2026-09-08.md`.

## 2026-09-08 — L045 read: grep counted, the line never opened. Three findings, one move

Audited a UI-guard census plus its tally script against a sealed defect list, ~35 minutes, 48
members. **Method unchanged and it is the whole thing: type every command the document prints, open
every line it cites, run the script, run the test files it talks about.** Six of the document's
printed commands do not produce the number printed beside them.

**The pattern under the three biggest findings is one move: `grep -c` was run, the count was taken as
the count of the thing named, and the LINE ITSELF WAS NEVER OPENED.**

- The draft's own "most serious single finding" — a live `innerHTML` write at
  `chain-indicator.js:687`, surviving in the file whose suite forbids it. The single `innerHTML` in
  that file **is inside a comment, and the comment reads "textContent, never innerHTML"**. The file's
  statement of the rule, read as a violation of it. Then it invented a mechanism for the green
  ("close enough to a comment block to be swallowed by the strip") when the strip works and the file
  is clean — and recommended deleting `:198`, which is labelled **POSITIVE CONTROL** and exists to
  catch exactly the failure the draft claimed to have found. It even borrowed that test's own phrase,
  *"scanner green over a problem it still has"*, and reported it as its own discovery.
- `grep -c 'id="tabs"' index.html` → 2, written up as a duplicate id with one of them dead. One match
  is the **comment explaining why the id exists**.
- `grep -c 'test(' librarian-wiring.test.js` → **0**; the file declares cases with `t(`. The document
  printed the command and wrote 11 beside it, for a file the census had **skipped as a stub**, so
  zero of those cases ever ran.

**This is L039's inverted-limit defect again with a different tool.** There I found a script's
statement of its own GAP reported as its coverage; here a file's statement of its own RULE reported
as a breach. Same reader error: a sentence written in the shape of a boast or a warning is read as
the state of the world. **Open the line. `grep -c` counts lines containing, never the thing you mean.**

**The script's arithmetic, all found by reading it before running it:** `String(r.lines) >
String(largest.lines)` — line counts compared as STRINGS, so "933" beats "1184" and the
largest-file row can never be right; `split('\n').length`, every file one line high, +12 across the
layer, against a document claiming `wc -l` "agrees to the line"; a line count printed under the label
`asset bytes`; and `testLines / (instrumentLines + testLines)` printed as a "tests-to-instrument
ratio" — 40.1 % where tests-to-instrument is 66.9 %. The document's headline is that mislabel
restated in words.

**And the one it contradicted twelve lines from its own output:** "no file in the layer is that
small — so the stub guard is inert today", printed directly under `skipped as stubs 3` /
`test files run 2`. The census block transcribes faithfully; every error is in the hand-made prose
around it. **Which is what the draft's falsifier misses — "any figure a re-run does not reproduce"
is satisfied by the only half that cannot fail.**

Hand-back: `exo_memory/handback/p-l045-read-C_2026-09-08.md`.

## 2026-09-08 — L046: a primary that cannot fail, and the error I committed in the file where I caught it

Registered the third run of the reader-diversity line (`loop/l046_third_run_registration_2026-09-08.md`),
~50 minutes. Did not refuse, and the refusal was genuinely open.

**THE AMENDMENT IS THE WHOLE HAND-BACK: the packet's primary cannot fail.** "Items found by exactly
one reader, as a share of all verified items" is **dominated by the direction the null predicts** —
under access-monotonicity everything findable from two files is findable with the repo open, so the
world reader's exclusive items are guaranteed and mean nothing. The statistic would have come back
large and looked like a result. **Split the edge by direction; only the anti-monotone half — what the
TEXT-ONLY reader finds that the world-runners miss — is evidence, and it is zero under the null.**
The monotone half gets reported and *declared uninformative in advance* so nobody quotes its size
later. A design whose most likely outcome (zero) ends the line is the only kind worth registering.

**Two figures in the documents I was told to build on do not re-derive, and I found them because I
worked from the member table instead of the summary lines.** `B∩C` is 26, not 27 — B's and C's miss
sets are disjoint, `36−8−2`. And the addition edge `8 of 15 = 0.53` is **not obtainable under any
consistent unit**: §3 entry 9 bundles six sub-findings with different finders, the numerator splits
it, the denominator counts it once; bundled gives 5/15, decomposed 9/20. **That lands on the exact
statistic being promoted to primary.** Neither error changes any conclusion — which is why nobody
caught them. **Nobody audits the scorer; the scorer is the one seat with no reader.**

**And the L045 key's control set was 10 with one false.** All three readers caught it. Had they not,
the key's own error would have been charged to them as three false positives — **a wrong control does
not merely fail to catch, it converts a correct finding into a penalty.**

**THE PART I HAD TO WRITE AGAINST MYSELF, and the scorecard's version was too kind.** It says A and I
took the file's comment as the check. **I never read the docstring.** I read `destTab` at :383-390,
confirmed the mapping and the no-fixed-point fact, reported a defect two lines above it — and treated
the interpretive sentence *built on* that mapping as carried by the sub-claim I had verified.
**Verification transfer: checking the checkable part and extending its green to the unchecked part.**
Fifteen lines up, the docstring calls that exact sentence the defect L033 repaired, "the inversion of
an instrument". Same family as the two I *did* catch in L045 and the one in L039 — committed in the
same file, three hundred lines from where I caught it. **Proximity is not interrogation.**

**And the bias has a direction, which is why it belongs in the design and not just in a confession:**
a designer who under-weights "the artifact's own words are the answer" defects will under-sample that
class when choosing an object — and that class is what the anti-monotone edge is *made of*. My bias
runs against my own primary and would produce a zero for the wrong reason. So the object choice is
put outside me by rule, along with scoring and auditing. **A named error with a named direction can
be checked; "I have blind spots" is the unfalsifiable coat.**

**The brief defect, stated as a defect and not a reader's fault:** the L045 brief carried two scope
rules in different modalities — a deny-list with an explicit sanction, and one sentence with none.
B chose the rule with no sanction. Neither reading was wrong. The replacement makes the condition
line the sole scope rule, the deny-list a subset of it, and requires each reader to **echo their
scope in their own words as the hand-back's first line** — a gate, so a mis-read voids the run before
scoring instead of being discovered after it.

Hand-back: `exo_memory/handback/p-third-run-reg_2026-09-08.md`.

## 2026-09-08 — L047 cite-check: the loop's own protocol file is about a different machine

Ruled all 20 paths in the librarian's report-section plan (`librarian/2026-09-07.md:254`). 9 SUPPORTS, 6 PARTLY, 1 DOES NOT, 4 not rulable. **The DOES NOT is `loop/PROTOCOL.md`, cited as the source for "the loop" — it is a June-2026 Windows-scheduler caretaker doc (`guardrails.py`, worker/overseer, `exo_caretaker`) with no orchestrator, no panes, no baton, teaching the stance BOOT retired 08-17; cited because it sits in `loop/` and is named PROTOCOL. Position-not-support, in the plan whose packet names that rock.** Also: `instances/librarian/CLAUDE.md` is outside the repo and is a GENERATED copy of `brief/LIBRARIAN.md` (law 1, the same error as astra/SHELL.md that morning); L030 should be L032; the coda cited as "the essay's own" is in MANUSCRIPT.html and **absent from the submitted `A_What_Survives_the_Gap.html`, which names Consonance 0 times**; and the objectives paragraph's lead source argues the room has never stated an objective. Four items name an idea with no path — the harvester alone resolves three ways, and "the WRONG columns" has two live counts on disk that disagree (35 vs 70+). **The move that found most of it: rule against the CLAIM in the parenthetical, not the file's topic — a path is assigned to a sentence, and the sentence is what fails.** Hand-back: `exo_memory/handback/p-report-sources_2026-09-08.md`.

## 2026-09-09 — L049: the board reads its offsets from a directory it never writes them to

**The `backfill` row says "ONE TIME". The board carries 39 of them, 39 distinct launches, 07-28
through tonight, 150,519 turns re-read from the top — and that is a FLOOR, because the announcement
counts only panes resolved inside its own 20 s window and returns silent at zero.** No relaunch
needed to answer the packet; the file had been saying it for six weeks.

**The writer.** `main.rs:8746` decides `BACKFILL_ACTIVE` and calls `load_offsets()` as an ARGUMENT
to `.manage(...)` — evaluated while the Builder is constructed. `set_dirs` runs at `:8776`, inside
`.setup()`, which the runtime calls afterwards. So the check resolves through `DIRS == None` to
`default_data()` and asks `~/.consonance` whether a file exists that only ever gets written to
`C:\Consonance\data`. Empty map, `resume_offset(None,..)` → 0, every pane re-reads its whole
transcript, **every launch**. The comment on `:8776` states the rule the line thirty above it
breaks: *"resolve configurable dirs before anything reads them."* Corroborated by `~/.consonance`
holding `.seeded.json` written at 00:12 tonight — `seed_room/cards/references` at `:8773-8775` are
the same class.

**The move that found it: I stopped asking "which arm of `resume_offset` fires" and asked WHERE the
question is asked from.** Every existing test in `offset_tests` passes and always did; `head-watch`
has 20 sessions with ZERO head-flips and ONE distinct head across 23 days, so the 08-17
head-mutation diagnosis is cleared. **`resume_offset` was correct the whole time — which is exactly
why nothing caught it. The unit under test was never the broken one; the defect was an evaluation
ORDER, which no test of a pure function can see.** Pin it by reading the source, with `concat!`
needles so the test's own text cannot satisfy its own scan.

**And the headline I nearly wrote wrong:** backward-share 8.8% before the fix landed and 96.3%
after reads as *the fix made it worse*. It did not — pre-stamping rows carry PUSH timestamps, so
the backward detector is structurally blind to them. Split by `ts_source`: `(absent)` 15,942 rows
0% backward, `transcript` 251,248 rows **96.9%**. **A zero from an instrument that cannot see is
not a clean era.**

Also: `cargo test --lib` returned **exit 0** on a crate with no lib target — tested nothing, said
so, and I nearly banked it. L045's defect, committed by me again: a command's output taken as the
state of the world without opening the line.

Hand-back: `exo_memory/handback/p-board-replay_2026-09-09.md`. Tests:
`offset_tests::the_backfill_decision_must_be_made_after_the_configured_dirs_resolve` (main.rs,
deliberately RED, 468 pass / 1 fail) and `consonance/tools/replay-check.{js,test.js}` (12/12, three
mutants killed) — the relaunch bar whose N comes from the transcripts, never from the board.
