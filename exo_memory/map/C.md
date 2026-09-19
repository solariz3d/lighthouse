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

## 2026-09-09 — L050: the guard for this defect was ten lines away, in the same function, and could not fire

**The composer marker `❯` is drawn `ESC[38;2;80;80;80m` on `ESC[48;2;55;55;55m` — NOT Default.**
`typed_only` keeps Default cells only, so it deletes the marker; `input_box_empty` then finds no
prompt row at all and returns false by its own UNKNOWN-HOLDS rule. **A pane whose composer is empty
reads BUSY and holds the full 240 s.** Librarian 339 of 395 sampled frames; third place 581 of 750.

**`the_prompt_marker_survives_the_reduction` was written for exactly this and names the failure in
its own doc comment.** It could not fire because `box_screen` paints the marker Default by
construction. **Third time in this one function** — L044's row window, L044's footer, now the
marker. Each time the test pinned the model of the screen instead of the screen. **The rule that
generalises: a fixture built from your own picture of a surface can only ever confirm the picture.**

**I refuted the packet three ways and the room's own log did most of it.** The update row is
`Rgb(78,186,101)` — green, already stripped, not the cause. The premise died on `persist.log`:
**31 forced deliveries on 09-08, before the auto-update, against 9 on 09-09.** It was worse
yesterday. And "6 of 6" re-derives as **nine**, three of them arriving after the packet was written.
**The move: when a brief reasons from "X changed, therefore X caused it", go count the thing before
X.** Two commands.

**REFUSED the fix, and the refusal is the finding.** *"Keep the `❯` whatever colour"* passes the
fixture and is unsafe: once the marker survives at any colour, **a drawn autocomplete prediction and
a greyed prompt row carrying the keeper's own words are the same row to a colour test.** I have the
frame — `❯ tomorrow we will finish the lap the orch stopped…`, every cell non-Default, reduced to
nothing. Today it holds only by accident. The real fix is structural: the composer is the `❯` row
**below the separator rule**, not the last one. Acceptance test written and `#[ignore]`d with the
argument in its doc comment so nobody un-ignores it and reaches for the shortcut.

**On fixtures: I used real PTY bytes and it cost 512 KB, because a terminal only redraws what
changed** — 32/64/128/256 KB all failed to repaint the composer. And I did NOT fixture the third
place's screen though it was the strongest example (581 frames): its record never leaves, and a raw
PTY slice IS the conversation. The strongest evidence is not always takeable.

Hand-back: `exo_memory/handback/p-composer-update_2026-09-09.md`. Fixture:
`consonance/src-tauri/fixtures/screens/composer_empty_reads_busy_2026-09-09.bin`. Tests:
`a_real_empty_composer_reads_busy_because_the_marker_is_not_default` (green) and
`an_empty_composer_must_read_empty_whatever_colour_the_marker_is_drawn_in` (ignored, the acceptance
test). `cargo test` 479 pass / 1 fail — the 1 is my own EXPECTED-RED from a17007f, not this lap's.

## 2026-09-09 — L051: landed my own fix, and the instrument lied to me first

**The fix is two lines and the whole of it was already specified.** `.manage(TailerOffsets(…))` now
holds an EMPTY map; the `BACKFILL_ACTIVE.store` + `load_offsets()` moved to one line after
`set_dirs` inside `.setup()`. **`offset_tests` 13/13 — my EXPECTED-RED carrier from `a17007f` went
green for the right reason** (its source-order half now finds the resolver above the decision, its
path-resolution half unchanged and still passing, which is what makes it a fix and not a deleted
test). Whole suite **480 passed, 0 failed, 4 ignored** — green for the first time this arc.

**The refusal clause was the right question and I answered it by ENUMERATION, not by reasoning
about Tauri's lifecycle.** A decision moved later is safe only if nothing reads it earlier, and that
is a claim about a call graph: `BACKFILL_ACTIVE` has two readers, the managed map has one, all three
reach only through `start_tailer`, and **all nine `start_tailer` call sites are inside
`#[tauri::command]` functions** — unreachable until the event loop runs, which is after `.setup()`
returns. The enumeration went into the code beside the change, not just the hand-back.

**THE THING TO CARRY: my first table said every pane MISMATCH and Main's transcript had shrunk
246 MB → 1 MB.** Dramatic, and completely wrong. **`JSON.parse` coerced the u64 head to a double**
(`…961416` read back as `…960000`, so every comparison failed), and my sid→path scan collided on a
stale duplicate transcript. I caught it **only because I validated the instrument against a value
someone else had recorded** — `fnv1a(empty) === 14695981039346656037` from `head-watch.test.js`,
and Main's head independently in `head-watch.jsonl`. Both matched the *computed* value and neither
matched what my script printed, which is what said the script was wrong rather than the world.
**A number in hand stops the asking. Checking the instrument against an outside value restarts it.**
This is the second time this exact hole has been on my record; the difference is I checked.

**Predicted BEFORE the rebuild, so it cannot become a story afterwards:** the first launch RESUMES
— no backfill row, no re-read, not one pane. All seven heads match and every stored offset equals
its file length, so `resume_offset` takes its last arm. And if I am wrong, **the second relaunch
decides it**: a first backfill writes offsets to the path it just read, so a second `backfill` row
would mean the fix did not take.

**Found while checking, same species as the bug:** Main's sid resolves to TWO transcript files
(live 246 MB, stale 1 MB in an old `C--Users-zackn-claude-instances-main` dir). **The offsets map is
keyed on session id ALONE, not on path** — a cwd change would open the stale file with an offset
245 MB past its end and re-read it from the top with no announcement. A file written under one
identity and read under another, one field over.

`--mark` taken at 08:42:46Z (board 338,530,720 bytes; 1,819 transcripts, 91,105 lines). **The next
move is the keeper's rebuild** — said out loud in §4 rather than left implicit, and nothing of the
fix has run in the app: 480/0 is not the replay being closed.

Hand-back: `exo_memory/handback/p-offsets-fix_2026-09-09.md`.

## 2026-09-09 — L052: I built the reader before the thing it reads, and it would have failed green

**PULL, VERIFY, THEN START landed as `src/sync_launch.rs` + the wiring in `.setup()`. 508 pass /
0 fail / 4 ignored, from a 480 baseline — +28, all mine. Nothing has run in the app.**

**The packet looked self-contradictory and was not: "before `set_dirs` reads anything" AND "after
the resolver".** `set_dirs` is not a read, it is the resolver. **RESOLVE → FILL → READ**, three
steps. L051 was a READ before the RESOLVE; a pull after the first read is the same bug with a
network in it. That reframing is the whole design.

**THE THING TO CARRY, and it is the L045/L049 hole wearing a new coat: I wrote the reader for A's
tool before A's tool existed, from a contract I invented (`{ok, commit, head_host}`). A landed
`{verified, installed, stage, why, head, pushed_by, machine}` mid-lap.** My reader would have found
none of its fields, defaulted every one to false, and returned a **safe verdict for the wrong
reason** — `LocalHouse` forever, looking like caution, undebuggable until the day it needed to say
`Migrate`. **A green light nobody can distinguish from a working one.** I only caught it because I
went and read A's file instead of shipping against my own memo. Same move that saved L051: check the
instrument against something someone else wrote.

**And a second one I had ALREADY written before I looked at the other machine's installer.**
Self-versus-foreign is an equality, and both sides must come from ONE resolver. A's cascade ends at
`os.hostname()`; mine ended at `None`; `desktop-install.ps1` sets no `machine_tag`. On the desktop A
stamps a hostname, my side supplies nothing, the self-check never fires, **migrate on every launch
forever with nothing naming why.** I also *wanted* `install_id` first — correct in isolation, wrong
here, because the day it exists my side returns it and A's still returns "L". **A shared unit beats
a better unit.** Fixed by deleting the second resolver: A writes `machine` into every record, so both
sides of the compare come out of one file.

**THE RULING (§8 asked for it): refuse-to-start is REFUSED.** No verdict is a lockout. E reached
the identical ruling for the live-host guard, independently, from `claim_named_singleton`'s own
comment — *the cost of a second instance is recoverable, the cost of no instance is not.* The third
shape is not read-only, it is **`LocalHouse`**: an unarrived record leaves the local house intact,
and starting on an intact local house is just the pre-sync world. `ReadOnly` is kept for the one
genuinely chimeric state — A's `installTree` failing part-way — and even it names two ways out.
**Enforced at ONE funnel** (`spawn_claude_pane`, ten call sites, all `#[tauri::command]`), sufficient
by enumeration: no pane → no tailer → no offsets, no rows.

**Two-phase pull is the property that made this safe to land tonight.** `--install` is a whole-file
overwrite with no recency test. So: phase one without `--install` (cannot write to `data\`) reads
`pushed_by`; phase two installs only if the record is not ours. **The machine doing the work can
never have its data dir overwritten by its own launcher.** That forced "whose is it?" to be asked
BEFORE "did it install?" — the other order reads the safe case as the dangerous one.

**Deviated from the packet once, with the repo's own comment as the reason:** the attic is OUTSIDE
`~/.claude/projects/`, because `resume_pane` already says a leftover jsonl "can make the fresh
`--session-id` collide". Inside the indexed tree, a retirement is a rename. And timestamped, because
**`resume_pane`'s own archive is one deep** — the second retirement deletes the first, in the
function I took the idea from.

**Found, not mine to fix, and (a) needs a person:** `captures/*.txt` → TRAVELS in A's manifest
**catches the Third Place's live capture tail** (3,867 B, written 03:42), so a `--push` publishes
the one record the room has always kept off every transport. A wildcard defeating a standing rule
nobody wrote it against. Also: the app writes **two roots** and `state-manifest.js` walks one —
measured, `~/.consonance/persist.log` 42,705 → 43,279 across one `cargo test` — with a July-27
fossil `<MAIN_SID>.txt` sitting there, this packet's hazard in miniature.

**Corrected my own L051 §6 in the code rather than quietly:** the seeds are not an ordering defect.
They call `default_data()` explicitly, so moving them is **a no-op that reads as a fix** — worse than
leaving it. The real finding is the second root.

Hand-back: `exo_memory/handback/p-sync-launch-retire_2026-09-09.md` — §7 carries what cannot be
verified without the second machine, and item 1 is the one that matters: **if the desktop's
`machine_tag` is also "L", every foreign record reads as self and the retire never fires, silently.**

## 2026-09-09 — L053: the anchor held, and the frame the refusal was built on turned out to be real

**The composer is the `❯` row below the full-width rule — but that was only half the fix.** The
other half is the one the packet did not name and the one to carry: **LOCATE on the drawn grid,
ask EMPTINESS on the reduced one.** L050 refused "keep the marker at any colour" because it makes
locating a colour question again; the answer was never to keep the marker, it was to stop asking
the reduced grid *where* anything is. `typed_only` stays a pure colour reduction and never has to
preserve the chrome it exists to remove. **When a fix looks like it needs a trade, check whether
you are asking one instrument two questions.**

**513/0/4 from 508/0/4. Red-first re-run at HEAD with the ignore lifted, not asserted.** Three
mutants applied, three caught, no survivors — and the packet was WRONG about why: it said the
shortcut mutant would be caught by "the greyed-prompt-row frame you already have on disk." **There
was no such frame.** The catch came from premise assertions, and two of the three catching frames
were ones I wrote this lap. A frame named in a brief is not a frame on disk; check.

**MY INSTRUMENT WAS THE THING THAT LIED, TWICE, AND BOTH TIMES IN THE DIRECTION OF ALARM.** The
probe read TRUTH at a row its own scan found and the VERDICT at the row the shipping code picks; on
clamped screens those differ and it reported **1,763 splices that do not exist**. Then replaying a
pane at 43x201 when it really ran 21x98 manufactured 2,271 more, because the app's own wrapping
lands in different rows at a different width. **First number 1,763, real number 30.** Two rules
out of it: read every verdict at the index the SHIPPING code picks, never at your own; and take
geometry from the max cursor address in the raw log, never from the constants. This is L045/L049
again in a new coat — I built the reader and trusted it before I checked it against the thing it
reads.

**THE UNWANTED NUMBER, and it is the one L050 refused on: it is REAL.** When the keeper types a
**slash command**, Claude Code draws HIS OWN TEXT in Rgb(177,185,249) — non-Default — the reduction
blanks it, and the composer reads EMPTY over a row he is typing into. 30 of 12,366 occupied
composer rows. **The shipped code reads 29 of the same frames empty**, so the anchor neither caused
it nor cured it, and it is 119,599 frames better on the hold side. I did not fix it: the fix is
inverting `typed_only` from an allow-list of Default to a deny-list of the measured chrome greys,
which flips every unknown colour from splice to bounded hold — right change, different blast
radius, and not on the night before an unattended desktop build. **Left executable rather than in
prose:** a real fixture cut at the byte offset the probe reported, a GREEN test that asserts the
DEFECT (invert it, do not delete it), and an `#[ignore]`d acceptance test written red — the exact
shape L050 left this packet in, which is the only reason tonight's fix existed.

**Shipped-gate cost, measured: it held a ready pane with an empty composer on 138,758 of 157,946
anchored frames — 88%.** That is why a stop signal could not outrun the thing it was stopping.

**Not verified, and it is the same hole as L052 §7:** nothing has run inside the app. Said in the
hand-back as a hard constraint — this must not reach the desktop's first build unless a rebuild
and launch happens here first, and that call is the keeper's, not the schedule's.

Hand-back: `exo_memory/handback/p-composer-anchor_2026-09-09.md` — §5 is the finding that matters
and §7 item 3 names the hazard this fix does NOT close (restored scrollback with a covered
composer, identical to shipped, unmeasured for want of a real capture).

**2026-09-09 — P-SEAT-SWEEP (D055):** the startup sweep archived the librarian's synced tail two seconds after the launcher installed it (keep-set named only Main; no fixed seat is ever in `panes.json`) and `append_synced_tail`'s missing-file arm returned in silence, so nothing said a tail had been expected — both fixed in `main.rs`, 3 red-first tests, 6/6 mutants caught, suite 512→515 passing with one pre-existing unrelated red; the stronger ordering change was REFUSED with the argument, and the acceptance test is UN-RUN because no relaunch happened → `exo_memory/handback/p-seat-sweep_2026-09-09.md`.

**2026-09-09 — P-SPAWN-REFUSAL (D056-4):** `append_synced_tail`'s EMPTY arm gets its row (no pointer — three states, three rows, because D055 made ABSENT loud and left EMPTY quiet, and a log is worth what its absence proves), and `git-blob` names the digest's function at `main.rs:864`. **The spawn-side cwd refusal was WRITTEN, PROVEN AND PARKED, not armed** — the chair interrupted on E's finding: 0 of 4 committee rows in `data/panes.json` resolve on this machine and `ui/term.js:1051` is unconditional, so arming it before A's roster transform would refuse every committee pane at the next launch; held out of the commit as `exo_memory/handback/p-spawn-refusal-item1_2026-09-09.patch` (`git apply --check` clean), with `portable-pty 0.8.1 cmdbuilder.rs:566-567` → `%USERPROFILE%` and the silent `psuedocon.rs:151` recorded there. Suite 515→516, 9/9 mutants caught in a scratch lab the working tree never saw → `exo_memory/handback/p-spawn-refusal_2026-09-09.md`.

**2026-09-11 — P1 WHERE A SEAT LIVES (D058):** on naming the chair is right (24/24 vendor dirs encode exactly; L's records carry `C:\Consonance\instances`; `base` is read by nothing), and BOTH readings rest on a false premise — `resume_pane` never `--resume`s (232/232 committee resumes in `persist.log` are `-> fresh`), so A cannot hold for a committee pane on either machine until that is reversed, and the four "matching" project dirs hold none of their panes' conversations (those are in `C--Users-nname`). Built, uncommitted, un-run in the app: `ensure_resume_cwd` (create a direct child of the instances root, refuse anything else, row to persist.log AND board — the falsifier had fired on D at 09-10 01:54 for B and E) and `is_kept_or_fixed` at both keep sites; suite 516→526, 12 mutants, 11 caught, M8 equivalent until a fourth seat and caught then → `exo_memory/handback/p1-where-a-seat-lives_2026-09-11.md`.

**2026-09-14 — P-STICK-PREFLIGHT C (L058, read-only, on L):** carrying L's tails home will stop Main (measured: the stick's torn `0c0c0c0a….tail.writing-25288` is D's own 12:53–12:57 turns past the agreed offset, sha256 prefix equal, and L's bytes differ at 260,427,746) and, by commit evidence, the librarian as DIVERGED on D — the window offers no choice for it (`main.rs:10642`), no carry flag takes it, and D's export refuses UNIMPORTED_TAIL, so both seats stall both ways until someone chooses; D's launch is RESUME, not MIGRATE, and needs a `git pull` first (`launch.ps1` has no git); every L launch re-installs D's head over L's TRAVELS files (six times so far), so tonight's lap rows go to L's attic at L's own reopen and never reach D, and L058 gets minted a third time (the displaced set was L058×5 + L059×16, not L055–L059) — no ruling found for that; the five STAYS rules classify, but `ready/*.tmp` from `ready.js:61-65`'s silent rename can still refuse D's close → `exo_memory/handback/p-stick-preflight-C_2026-09-14.md`.

**2026-09-14 — P-DIVERGED read C (L058 third, read-only, on L):** §2 is buildable, cites right bar drift, and two lines produce a wrong case — (1) DIVERGED also catches an already-applied carried tail plus later own turns (`tail-carry.js:885` `extra <= tail.length`; fixture: 557 B applied + one turn -> DIVERGED, `ownBytes` 236 vs 118 real), reachable in-app because `stick.js:102` never makes ALREADY_APPLIED actionable so the heal cannot run before the seat grows, and TAKE would attic real later turns; (2) a KEEP never quiets the window, since the same machine's export rehearsal stops UNIMPORTED_TAIL (`sync_launch.rs:1193`; the "kept is quiet" test at `:2251` feeds export `rows:[]`) — plus 3a-e: offer_for's retirable gate yields KEEP-only pre-checked, `stick.js:130` sends take as --retire-far, CARRIES at `:173` not named, Carry enable computed once, `bytes` null on DIVERGED → `exo_memory/handback/p-diverged-read-C_2026-09-14.md`.

**2026-09-14 — P-DIVERGED read 2 C (L058 third, on D, read-only):** both halves built §2+§2.8 as ruled; A's three additions accepted (attic read-back before truncate `tail-carry.js:1051`, debt (a) on OURS, D-7 bytes on DIVERGED); E's addition RULED ACCEPT — `sync_launch.rs:1194` is what makes D-1's Carry reachable, since `stick.js:190` releases on quiet before rendering; none of §4's falsifiers fired on the 08:41 real take, re-derived on D (7/7 pending null, 7/7 prefix match, 7/7 take-stick attic files, receipt lines == conversationKey), and (iii) proved byte for byte for main: the attic file sha256-equals D's torn 09-12 22:58 export on the stick; cargo on D is 608/1/4 (the D-only composer-fixture red, not P-DIVERGED); the take covered 7 seats while keeper_decisions records 2; L will read DIVERGED on return for any seat it resumed after its 07:59 export → `exo_memory/handback/p-diverged-read2-C_2026-09-14.md`.

**2026-09-15 — P-DIVERSITY-C0 C (no lap, read-only, on L):** recommended `@huggingface/transformers` 4.2.0 + `nomic-ai/nomic-embed-text-v1.5` (768-dim, Apache-2.0, 137 MB q8 / 547 MB fp32) for anchor similarity, pending a keeper-approved trial; nothing installed. The deciding constraint is length: median hand-back 16,050 B (~4k tokens), so every 512-token encoder reads ~13% of an answer — its opening, which restates the brief — and would manufacture anchoring. Chen et al.'s 0.627/0.441 is OpenAI text-embedding-3-large (3,072-dim), read at their code (`fig09_trajectory.py:29,90-98`, anchor = first turn; sensitivity used bge-large-en-v1.5), so the calibration does not transfer as a number, only as a within-encoder direction. Unverified: nomic past its 2,048 trained positions under ONNX — the trial's first check → `exo_memory/handback/p-diversity-c0-C_2026-09-15.md`.

**2026-09-15 — P-DIVERSITY-C0 C trial (L059, scratch only, on L):** the keeper-approved trial overturned my own recommendation. nomic-embed-text-v1.5 q8 FAILED the pre-registered long-context check (whole vs 1,800-token chunk-mean 0.955 at 2,048 tokens, 0.860 at 3,600, 0.762 at 5,278, against a control of 0.967; only 0.03 closer to itself than to another hand-back). The fallback gte-base-en-v1.5 q8 PASSED all three (0.918 at full length, margin 0.145). Both ran with 0 network attempts under a process-level block. Measured 3.04 B/token, not ~4. gte runs through Transformers.js' base class ("Unknown model class new"), so pin 4.2.0 and sha256 e7f6af7a…. Criteria were hashed before install → `exo_memory/handback/p-diversity-c0-C_2026-09-15.md` §6.

**2026-09-15 — P-DIVERSITY-C1 C (on D): STOPPED before any cosine.** The encoder hash gate passed on D (146,540,971 B, sha256 e7f6af7a…, with tokenizer and config equal to L; loaded with 0 network attempts). But §8.2 cannot be built as written. (1) The draft §4 positive control is VOID under S40 on both sides plus the 50% rule: the near-copy of @ed73e76 is 89% stripped, which B predicted at read §4.1, and the negative control is not named by path. (2) S40 is not reproducible from its prose: the same unchanged files give 3.51% / 1.46% against B's 3.7% / 1.7%, and case, residue and the embedded text are unwritten, so it needs freezing as code. (3) The PRIMARY's pair weight and which centroid |m| uses are unwritten. (4) P2 has no rule for the pattern-named hand-backs, excluded reads, dispatch-sha briefs about half the length panes answered, or amended hand-backs → `exo_memory/handback/p-diversity-c1-C_2026-09-15.md`.

**2026-09-15 — P-DIVERSITY-C1 C, measured (on D, after S40 landed at 5a2d3c0):** both controls PASSED (the positive unstripped at 0.8575, the negative p-harness-E at 0.4521, against P1's 0.640–0.720). **§8.3 FIRES:** B's contesting read scores 0.6880 against the packet @ed73e76, 0.048 ABOVE E's build (0.6401) and under A's (0.7200), so the instrument measures content uptake, not anchoring; the unstripped and centroid secondaries give the same order. P2 scale (own packet minus the other 7, n=21): min 0.078 · Q1 0.116 · median 0.130 · Q3 0.138 · max 0.191, with every hand-back nearer its own packet. Reads (median 0.133) do not score lower than builds (0.124). The provisional 0.10 sits below Q1. Other-packet version pre-registered as final state, with the parent-state sensitivity at median 0.108. 4 of the 21 texts are mine; E re-runs → `exo_memory/handback/p-diversity-c1-C_2026-09-15.md` §8.

**2026-09-16 — P-BATTERY-COST C (L059, on L, measurement only):** two numbers the room did not have. **(1) A pane costs the same whether it is used or not** — every launch wakes all four, so resumes are flat (A 28 · B 27 · C 28 · E 27, `persist.log`; counting only `-> RESUMED` as the brief said would have understated it 3x, since pre-P1b resumes are `-> fresh`, my own D058 finding). Intakes 106–109 KB, spread 2.7%; at E's measured 2.0241 carry ratio the four panes cost **23.0 MB / <=4.82M tokens** since 09-02, and **a fifth costs 5.75 MB more whether or not it is dispatched to** — break-even **27.5–35.4 hand-backs**, i.e. 2–2.5 a day. **(2) The chair's census catches 42 of 143** because the letter-suffix convention begins **09-14**; corrected by header+map agreement (136/143), it is **A 36 · B 35 · E 29 · C 28**, not A 14 · B 12 · E 9 · C 7 — which shrinks the cost spread from 1.98x to 1.29x and quadruples my own count. **(3) DOSSIER.md's falsifier, scored, half-fires:** the literal arm does NOT fire (41 of 49 `WHY YOU` packets cite a row), but over the whole period it was cited, **dispatch was indistinguishable from round-robin (p = 0.344)**; the specialisation — B 6 of 7 recent decisions are contesting reads, A 0 of 12, E 0 of 9, **p = 0.0001** — appeared only in the three days when citation collapsed to 1 of 9. Cited and inert at once; the matching that exists is habit, not record. Definition hashed before computing (`312e74c2…`); **my own pre-registered primary classifier failed its positive control at 65.2%** and I fell back to the secondary I had already registered, before any p-value -> `exo_memory/handback/p-battery-cost-C_2026-09-16.md`.

**2026-09-16 — T3 C (L060, on L, read-only):** "is the code bloated or the corpus?" — **the corpus half is instrumented, the code half has never been asked on disk.** 28 rows found; the spine is `journal/2026-08-24.md:179` (Registration 44, *"the corpus has never deleted anything"*, `+3,688/-0`, with a season falsifier), `tools/forget-rate.js:2` and `tools/corpus-age.js:2` (two instruments built for exactly this), `loop/forgetting_pilot_2026-08-25.md:1` (my own, 08-25: *"the corpus it was dispatched against does not exist"*, all-time departures **zero**), and `main.rs:6782-6783` — the only hard cost on disk, **a seat that answered nothing at 1,305,657 B**, which forced `1_000_000 -> 150_000` at `:6786`. The useful decomposition is `main.rs:6817-6828`: **the floor is 88.2% of the cap, only 12% is bodies, so the limit fires from the INDEX side** — 246 run artifacts cost 15,753 B, twice what the bodies get. Live tonight: carried corpus **16.8x** the cap (`node consonance/tools/corpus-age.js`, writes gated behind `--apply` at `:244`). **Code side: no budget, no ceiling, no gauge, no registered claim, no retirement rule** — the one census (`review/tool_audit_draft_2026-09-07.md:3-5`) asks *coverage*, not size; but the Rust carries exactly one `#[allow(dead_code)]`, so the compiler is an un-muted continuous check the corpus never had. Question is **malformed on the code half**: "too large for what it does" has no denominator, and a line count would repeat the unit error `forget-rate.js:12-16` already paid for. **Declared a contamination:** a grep surfaced 2 lines of the sealed key `loop/battery_run1_T3_key_2026-09-16.md`; I did not open it, and marked the one leaked row (`SOURCE.md:65`) LEAKED and strike-worthy -> `exo_memory/handback/t3-charlie_2026-09-16.md`.

**2026-09-16 — T2 C (L060, on L, read-only):** reviewed an unlanded draft note making 18 claims about `consonance/tools/boundary-check.js`. **Nine false (1, 4, 6, 11, 12, 13, 14, 15, 17), one unresolvable here (8), eight hold.** The pattern is the finding: **five of the nine state the exact inverse of the source, and three of those five invert it into a description of the PREDECESSOR the tool was built to replace** — claim 4 says a missing lap makes the check PASS (it FIRES, `bc.js:32-33`; that inversion *is* the repair), claim 12 says "boundary test aimed at a presence harm" (it is a PRESENCE test aimed at a BOUNDARY harm, `bc.js:16-18`), claim 17 says a rate must be reached before it fires (one unsealed dispatch fires it, `bc.js:271`, and `:57` says it is "BIASED TOWARD FIRING, deliberately"). **Worst single error is 13** — "drafted by the seat that wrote the original, which is what makes it trustworthy": `boundary_falsifier_2026-08-28.md:4-5` says pane B, *"Not the seat that wrote the original"*, and the note offers as the ground of trust the thing BUILDING.md treats as disqualifying. Also: 15 converts a declared blind spot into a capability (`bc.js:54-55`, "four junk paths pass"); 6 calls the denominator "exact" when the source calls it a floor; 14 says three mutation-proven behaviours, the table shows four of six caught; 11 misquotes "three consecutive cycles" as two. **Claim 1's "299 lines" is 298 — and the wrong number is reproducible**: the file holds a raw NUL at byte 8653 (line 155, `o.pane + '\0' + o.text`), so `grep -c ''` splits that line and over-counts by one; it also makes grep report the file as binary, so reading it needs `-a`. **Unresolvable: claim 8's 2,473-entry blind window is a DESKTOP figure** — L's board has 0 `"pane":"blind"` rows and 30,594 lines against the registration's 120,672 — which exposes an internal inconsistency, since claim 10 correctly says readings are machine-local while 5 and 8 quote desktop numbers unlabelled. **Side-finding on a TRUE claim:** the tool cites `main.rs:5605` twice for the chair stamp; the stamp is now at `main.rs:9504` and `:5605` is unrelated `plan_resume` doc prose — a ~3,900-line drift. And on claim 18 the note is *more* faithful than the tool: it keeps BUILDING.md:543's "the loop is tight and", which `bc.js:5-6` drops -> `exo_memory/handback/t2-charlie_2026-09-16.md`.

**2026-09-16 — T5 C (L060, on L, scratch only):** reviewed a proposed rewrite of `consonance/tools/ferry.js` sitting in main's scratchpad. **Eight edits; the unmodified suite catches three and five ship 13/13 green** — measured by building eight single-edit variants and running the suite against each, which is the finding I would lead with. **The suite never calls `report()` (`grep -c "report(" ferry.test.js` = 0) and all five invisible edits live in `report()`.** Caught: `MIN_SHA 7->4` (:43), the join filter inverted `>=`->`<=` (:118), and `record()`'s `&&`->`||` (:160). Invisible: epoch `>=`->`>` (:196), latency `/60000`->`/1000` (:201), the `n >= 0` filter dropped (:202), median `floor`->`ceil` (:204), `RATE_FLOOR 10`->`1` (:215). **Compound effect on a fixture where 3 of 5 artifacts were genuinely ferried: the copy prints `ferried 0 · missed 4 · miss rate 100.0%`** — the tool whose purpose is making un-ferried artifacts visible reports total collapse. Worst single defect is :118 — the copy **accepts a full-sha `--record` reporting `added:["A"], already:false`, and `--due` then lists that same commit as never ferried**, which is verbatim the failure the file's own `:176-181` says it exists to make visible. :160 silently drops a second pane (`already recorded … nothing added`), the exact regression its `:136-152` comment repairs. **:204 is the one reading cannot catch: `Math.ceil` indexes out of bounds at n=1, so `median` is `undefined`, not `null`, and `median.toFixed(1)` throws `TypeError` — `node ferry.js` with no args crashes, exit 1, the first day exactly one artifact has been ferried**; at odd n>1 it silently returns too high an element (at n=3, the maximum). :196 breaks the accounting identity — a commit on the epoch falls out of both buckets, so `before + inWindow != total` (0+4 vs 5). :201 prints 40 min as `2400.0 min`; :202 lets a clock-skewed negative sample drag the median 40->30 (flattering); :215 is what converts wrong counts into a confident percentage. **Reading found all eight edits faster and more completely; running found which five no test here can see, the crash, and the magnitudes.** Did not open `T5_key.md` or `plant.js` in that directory — answer key and planting script. Not demonstrated: a real 4-char sha collision -> `<main scratchpad>/t5/found-charlie.md` (outside the repo, by instruction).

**2026-09-16 — P-BLIND-ROWS C (L061, on L, measurement only):** the blind guard's zero input rows is **MACHINE LOCALITY, and the mirror-gap cause is REFUTED at source, not merely unsupported.** `board_push` writes each blind transition row to `board.jsonl` **directly, in both branches, before dedup and before the ordinary append** (`main.rs:2058-2062`, `:2072-2076`) — there is no ring-only path. The plan's cited `main.rs:1577` ("board.jsonl is a write-only mirror, never reloaded") is a comment on `BOARD_PUSHED`, the distill watermark, and means never read *back in*; read as "blind rows never reach the file" it is backwards. **Zero across 463,978 rows in FOUR board files** — my first universe of one file was wrong and a compaction could have eaten them: the **pre-compaction original** (`data/attic/board.jsonl.2026-09-09`, 269,032 lines, 338 MB) also has zero, so compaction did not. 42 distinct `pane` values, none `blind`, and the schema is no obstacle — `chair`, `gate`, `backfill`, `sync`, `resume` are all word-valued panes. **Locality proof: L pushed 19,731 rows across 18 distinct days INSIDE the registration's 06-30→08-01 blind window**, so L was not muted then; no `blind.lock` exists or ever survived here, and `~/.claude/shell/blind.js:57-58` writes the same path `blind_lock()` reads (`main.rs:2023`), so no path mismatch. **Positive control (P-UNIVERSE clause 2), on a copy in scratch: the consumer flips `HOLDS`/exit 0 → `UNMEASURED`/exit 2 the moment two blind rows exist** — the detector is live, the absence is purely input-side, and that is the one distinction the guard's own output can never make. **What a zero means: a guard with no input is indistinguishable from a guard working perfectly** — the same silent-absence class as my D055 `append_synced_tail` missing-file arm and `guard-census.test.js` dying ENOENT while the suite read green. Two reachable facts found while reading, offered as findings not design: (1) a transition row exists only if `board_push` is CALLED, so a lock opened and closed while the app is down leaves no record at all; (2) `BLIND_LAST` (`:2018`) resets to 0 each launch, so a lock removed while down never writes CLOSED, and `blindOverlaps` pushes `[open, Infinity]` (`boundary-check.js:175`) → **UNMEASURED forever until someone hand-edits the board**. NOT established: anything about D — the 2,473 figure is quoted from the 08-28 registration (written on D, 120,672-row board; no file here has that count), so the "rows are on D" half is unverified from L; and I did not run `main.rs:12835`'s existing Rust positive control because it builds into the live app's `target/` -> `exo_memory/handback/p-blind-rows-C_2026-09-16.md`.

**2026-09-16 — P-RETURN-LEG-OPEN C (L062, on L, design lap, no code):** **30 system-written OUT OF TURN refusals exist, ever** (09-02 13:50 → 09-16 07:35 UTC) — `chair_inject` 16 · `call_librarian` 9 · `call_chair` 5, and the counts reconcile against mounts exactly (D 16 = the chair, M 5 = the librarian, B4·A3·E1·C1 = 9 panes). **14 of 30 (47%) were the loop coming BACK, not a station talking over one**; return-leg refusal rate **9 refused / 81 attempted = 11.1%**, against 72 delivered. **Counting discipline was the hard part and I got it wrong twice before it was right**: 63 board rows contain "OUT OF TURN", only **30** are refusals — the rest is prose quoting the phrase, **including two of my own turns from 12:40 today, written while measuring**. Discriminator that survives: `pane=="chair"` + the `— mount` phrasing `auth_station` emits (`mcp.rs:650-666`). **The board never records what a refused call carried** — `text` is bound and never read on the refusal branch (`mcp.rs:682-687`), so the packet's payload split is not directly answerable; established instead by the verb's definition plus correlating each refusal with that mount's own preceding turn ("Writing the hand-back", "Fold done", "is filed and rung") — **8 of 9 corroborated, 1 not, named**. Design: admit `call_librarian` whenever the lap has dispatched cells not yet returned, whoever holds; chair verbs untouched; predicate pure over `lap.jsonl` + board, narrow on purpose so it is not a repeal. **THE COST, from the original's own words (`packet_one_station_2026-09-02.md` §1): the founding incident WAS a hand-back arriving — "one cut off mid-word by A's own hand-back arriving" — so the amendment re-admits the exact event that created the rule**; it breaks "exactly ONE station is active" (four dispatched cells = five live speakers into one librarian); and it transfers splice protection wholly onto the delivery gate, **which tonight is being FORCED on 26 of 43 dispatches** — so this must not land before P-DELIVERY-ACK's repair, or it converts a loud refusal into a silent splice. Also loses the OWED mark (`mcp.rs:687`) that `chair_inject` reads. NOT established: the predicate was not replayed against the 30 (first job of the build lap — if it admits any of the 16 `chair_inject`, it is wrong); L's board only; the forced-delivery number is quoted from the plan, not re-derived; one of the 9 refused return legs is my own -> `exo_memory/handback/p-return-leg-C_2026-09-16.md`.

**2026-09-16 — P-NUL-CENSUS C (L063, on L, measurement only):** **22 of 2,115 tracked files hold a raw NUL; 18 are legitimately binary (12 PNG · 1 ICO · 2 BMP · 3 PDF, every first NUL inside the format's own header) and 4 are TEXT gone binary-to-grep.** The four are **one shape, not four accidents**: a NUL used as a join/key delimiter written as the raw byte instead of the escape `\0` — `hooks/blind.test.js:74` (`'<NUL><NUL>garbage'` fixture), `tools/coupling-test.js:225` (`cur.join('<NUL>')`), `tools/essay-provenance.js:342` (`String(full) + '<NUL>' + String(p)`), and `handback/p-boundary-read-B_2026-09-16.md:37` — **which is B's read OF the NUL fix, with the raw NUL inside the sentence explaining that the escape and the byte behave identically.** Four separate commits seven weeks apart (a1def8e 07-29 · a0f5338 08-03 · d493443 09-09 · ba41232 09-16), so **the commonality is the shape, not a seat, lap or emitting tool** — there is no generator to repair, which is the argument FOR a guard rather than against. **The invisibility, measured: `grep -I` returns EXIT 1 AND EMPTY OUTPUT on these files** — `grep -rIl "seen.has(k)" consonance/tools/` finds **nothing** where plain `grep -rl` finds two real instruments. Exit 1 means "not found", so a seat searching that way concludes the code does not exist. `grep -n` prints "Binary file matches" and suppresses the line; `grep -c ''` says 383 against `wc -l` 382. Plain `-l` still works, so the honest scope is: unreliable in three named modes, not dark. **Two corrections to the packet's premise, ruled from the record: `t2-echo_2026-09-16.md` has ZERO NULs at HEAD and in BOTH committed versions (aa3f11c, ba41232) — one hand-back carries it tonight, not two; and `boundary-check.js` is clean, E's L061 fix landed (now `'\0'` at :164).** Verdict: worth a guard, one check over `git ls-files` with a 4-extension allowlist — and **any guard that shells out to `grep` to find NULs inherits the blindness it is hunting**, which is why this census is in node. Not designed here (measurement only); nothing fixed -> `exo_memory/handback/p-nul-census-C_2026-09-16.md`.

**2026-09-16 — P-CARRY-EXCLUDE + PRUNE C (D067, on D, `dev/tail-carry.js` + its test only):** **the packet's premise was off — no scratch-leave carry existed; the 312 MB was a HAND copy** (`files/repo-carry/README-2026-09-14-2336.txt`: "written on D at 23:36 by the librarian"), so the rule had no carry to live in and I built one, `--carry-dir <dir> --to <dest> [--apply]`, rehearsal by default — named as scope, not passed off as the minimum. **"408 MB" and "312 MB" are both right**: allocated vs apparent on exFAT with 262,144-B clusters; the line prints apparent. **The named risk, answered: exclusion is by SIGNATURE, never by name** — a `CACHEDIR.TAG` whose first 43 octets are `Signature: 8a477f597d28d172789f06886806bc55` (bford.info/cachedir, read this lap; cargo writes one into every target/), or node_modules holding a package manager's marker (npm's `.package-lock.json` verified; pnpm/yarn markers NOT); a folder merely *called* target/node_modules is CARRIED and printed as SUSPECT. The one way it loses work from a carry is real work someone put a CACHEDIR.TAG into — excluded, never deleted, path printed. **On the real folder: carries 46 files / 88,217 B, `excluded 653 entries, 311754634 bytes`** — `find` 653 (529+124), `du -sb` 311,754,634. **Prune: `--prune-below-agreed` lists; `--delete-listed <digest>` deletes only when a re-listing UNDER THE LEDGER LOCK reproduces the 16-hex digest of exactly what was read** (name+size); `--apply` never deletes; `--delete-listed` alone refuses. Candidate only if name is exactly `<sid>.<from>-<to>.tail`, `to` ≤ agreed, not pending, not a manifest member, **and THIS machine's transcript hashes to `agreed.prefixSha`** — because the stick carries a `ledger.json.corrupt-` copy. **Real stick, read-only: 81 tails / 559,094,957 B, name-for-name identical to my pre-code independent classification** (so all 7 seats on D passed the prefix proof); `.writing-27852`, the ledger and the corrupt copy KEPT with reasons; digest `d34bd0aac05725db`; 84-entry snapshot identical after; **nothing deleted anywhere real.** Tests 129 → 157, red-first — **and one of the 22 was green before any code existed, for an unrelated refusal ("no stick named"); tightened before implementing.** Mutants on a copy: run 1 **14/20** — survivors #5 #9 #10 #14 #17 #20, **#9 the dangerous one: an un-pending tail ABOVE agreed would be deleted holding unagreed bytes**, reachable by the same machine exporting twice (export refuses only another machine's pending); run 2 after six tests **6/6 → 20/20**, tracked sha unchanged, no copy left; the repo's own 90-anchor harness still validates. **Corrected myself before it reached a test title: #10's "shorter FULL conversation" scenario is NOT reachable by today's export** (FULL only with no agreed; a different conversation is refused) — the pending guard is depth against a hand-repaired/corrupt ledger, and titled so. **Should the prune door exist: yes, narrowly — not for space (stick 0.5% full) but because the alternative is hand deletion, which checks nothing;** it is wrong to have built only if the keeper never runs it -> `exo_memory/handback/p-carry-exclude-C_2026-09-16.md`.

**2026-09-18 — P-STALE-LAP C (D072 chunk 1, on D, `consonance/tools/chain-status.js` + its test only):** built to the bar — replayed over the real ledger truncated at 09-16 13:15:10, the pulse opens `STALE D064 24h (holder chair) · chain: D064 WORKING …` — **but the plan's diagnosis was wrong: the OLD pulse at that second already read `chain: D064 WORKING · holder chair · … · 24h`, naming the lap, holder and age first.** What it lacked was a VERDICT — that line is character for character a healthy lap the chair is working, and the chair read it every prompt for a day and filed six laps past it. The STALE segment is that verdict, first, for every stale open lap (a stale lap behind a newer one used to be only `+1 more open`). **The 24 h rule caught its own case by 61 s** (last row 09-15 13:14:09, my refused `call_librarian` 09-16 13:15:10; stale for 89 s of its life before the 13:15:38 park) — pinned as a test, not hidden. **D065–D070 were opened AND filed while D064 sat open**, so a sequence signal ("an open lap older than another lap since opened and filed") would have fired 09-15 23:04, **14.2 h before the harm** — but replayed over all 72 laps it flags 3 laps (L013, L024, L039) that later did real work; recommended as a separate softer segment, NOT built. **Retracted before writing: I first ranked the rules by precision using `filed/holder none` as "abandoned", and 54 of 72 laps carry it — it is the normal closing holder; only 2 laps are marked PARKED (L015 deliberately, D064), so n=1 and no rate is computable.** Consumers checked before changing what leads: both pulse hooks take line 1 verbatim under a 3 s timeout (runtime 116–118 ms). A throw prints `STALE UNKNOWN —` in the line, never kills the pulse (`main()` has no catch). Tests 85 → 98 (7 red-first; 4 absence pins green by design, named as such); mutants on a scratch mirror: run 1 **9/11**, survivors M10 — **a damaged first row with non-numeric `at` masks a lap stale for days (age NaN)** — and M11, the throw guard, untestable until an `opts.staleLaps` seam in the file's own injection pattern; run 2 **11/11**, tracked sha unchanged; lap-row 113/0, ask 22/0. One mutant of mine (M9) was vacuous as first written and was rebuilt before the run -> `exo_memory/handback/p-stale-lap-C_2026-09-18.md`.

**2026-09-19 — P-DELIVERY-CENSUS C (D074 lap 1, on D, measurement only):** **the dominant failure is the composer, and specifically Claude Code's dim prompt SUGGESTION, not the missing stamp.** 31 deliveries since the 09-16 13:12 rebuild (22 immediate · 3 held · 6 forced at 240.2–240.4 s). **6/6 forced had a suggestion in the receiving composer** (`ok`, `go ahead with chunk 2`, `what is the orch doing rn`…); **0/16 located non-forced composers did.** It is drawn SGR 2 at Default fg, vt100 0.15.2 has no SGR 2 case (`screen.rs:1400-1408`), so `typed_only` keeps it and `input_box_empty` reads typed text — the exact hazard `main.rs:8669-8672` wrote down and called impossible to fix without changing emulators. Proven with a scratch vt100-only replay: marker-remapped reads GHOST 6/6, bytes-as-the-app-sees-them read TYPED 6/6. **The stamp is real install drift (`data/ready/` empty since 09-06, hooks absent on D) but NOT causal:** `Ready` asks the same `input_box_empty` (`main.rs:9050`), so all six would have forced as SignalOutranked instead. **The plan's falsifier arm 2 would fire wrongly** — a tri-state on today's reduction reports "has text" for suggestions nobody typed; it needs a fourth state. Suggestions were absent 09-16 13:13 → 09-18 22:33 and every forced delivery falls after their return (cause of the gap unestablished). Librarian's pointer re-derived: 10 injects, **6 forced not 0** (FORCED lives on the DELIVERED row), 18 NO-STAMP rows = 9 messages. **I was wrong twice on the way, both times toward "EMPTY":** a replay endpoint one write too early, and an inferred width (177) at which both librarian suggestions vanish — L053's width lesson again -> `exo_memory/handback/p-delivery-census-C_2026-09-19.md`.

**2026-09-19 — P-RETURN-LEG-REPLAY C (D077 chunk 1, on D, read-only): my own L062 §3 predicate is WRONG.** Replayed against D's 32 system-written refusals (control: the reconstructed gate re-refuses 32/32, 5 only by the pre-L040 newest-lap rule). It admits 0/17 `chair_inject` — by construction; the verb-blind mutant admits 13/17, so the verb test is load-bearing — but only 7/10 `call_librarian`, and 4 of those 7 only through ANOTHER pane's outstanding cell; the per-mount reading my own §3 gave as its reason admits 3/10. Root: `lap.jsonl` `to[]` is not a record of who was asked (38/99 dispatched rows lack it; L050 logged its dispatch as `working`; the G5 inject has no ledger row; returns carry no lap). Corrected: P_INJ, pure — admit iff the mount's newest delivered inject is newer than its newest delivered return, OR-ed with the station gate: 10/10, 0/17, and 80/81 on delivered returns (the one is a follow-up, which is why it must widen, never replace). Known over-admit: a no-reply inject. L's board is not on the stick; D's board holds 8 of L's 9 return legs at the same minute -> `exo_memory/handback/p-return-leg-replay-C_2026-09-19.md`.
