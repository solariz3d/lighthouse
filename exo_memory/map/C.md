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

**2026-09-19 — P-STICK-FAULT-CAUSE C (D079 chunk 2, on D, read-only, nothing written to the stick):** **the two named faults cannot be caused from D — both were L-side** (the 09-15 sector loss was written by L's 00:19 import; the 09-16 fault hit L's 07:49 close). **But D holds the stick's one logged failure, and it is the DEVICE, not a pull:** 09-14 23:40:33 TEST UNIT READY cancelled after 5 retries → 23:41:43 paging WRITE(10) at LBA 0x13420 fails VERIFY_REQUIRED (a device reset) → 23:41:44 READ CAPACITY bus reset → 23:42:35 the retried write fails NO_SUCH_DEVICE at the removal second; LBA 0x13420 = cluster 136 = the `/consonance-L-20260911` directory (metadata); it came 5 min after an 11.8 h sleep with the stick in, right after a 334 MB burst (the 312 MB hand-copied repo-carry). **The 09-16 repair's `FILE0000.CHK` is D's 09-14 23:40:25 HANDOFF** (orphaned in that window), and its slack is one 15,360-B block repeated 16× with erased-flash 0xFF runs — the same misrouting class as the 09-15 in-file damage. Stick is consistent now (own read-only exFAT walker: 869 = `find`, 5,822 owned = allocated, 0 cross/lost). D policy: DeviceHotplug=1 (quick removal); device cache unreadable. Finding for the room: **no fsync anywhere in the carry** — DONE was likely shown while the directory write was failing. Six questions for L's log on Sunday -> `exo_memory/handback/p-stick-fault-cause-C_2026-09-19.md`.

**2026-09-19 — P-FLUSH-BEFORE-DONE C (D080 chunk 3, on D, `dev/tail-carry.js` + its test + ten harness rows):** every carried file the export (and import) writes to the stick now goes open → write → `fsync` → close → rename (`writeDurable`, at writeAtomic/writeLedger/the tail write), and each `--apply` ends by flushing the tails dir, transfer dir and stick root. **Directory flush MEASURED, not recalled** (Node 24, Win 10.0.26200, NTFS): `'r'` opens but fsync is EPERM, `'w'` is EISDIR, **`'r+'` + fsync works** — so `'r+'`; a declining filesystem (EISDIR/EPERM/EACCES/ENOTSUP/EINVAL) is printed as `unsupported` and still carries, anything else fails. A failed flush → **`NOT_FLUSHED`, exit 1, `why` names the path and code**; both consumers already read non-zero as NOT DONE (`stick-waiter.js:533`, `sync_launch.rs:1519-1575`). Tests 157 → 163, red-first TWICE (first red was the missing seam — the D067 trap — re-proved red for behavioural reasons); the exact `--json` key pin gained `flush` by the `+staleLock` precedent. Mutants 91–100 in the tracked harness: **run 1 9/10, #100 (import dir flush) survived as predicted → test added → 10/10**; tracked sha unchanged. **Cost: +0.104 s median (1.324 → 1.428 s, n=5, 46 MB current set) on NVMe/NTFS — the stick's cost unmeasured by design.** Left: `--carry-dir` still unflushed (mine, same fault, out of the packet's scope); exFAT untested -> `exo_memory/handback/p-flush-before-done-C_2026-09-19.md`.

**2026-09-19 — P-CARRY-DIR-FLUSH C (D082, unattended N1b, on D, `dev/tail-carry.js` + test + mutants):** `--carry-dir --apply` now says CARRIED only after every copied file is fsynced in place, every directory of the copy (deepest first) plus the receiving parent is flushed, and the read-back passed; a failed flush → `NOT_FLUSHED` exit 1, "NOT DONE — path (code)". **The hazard the packet did not name, measured:** `cpSync` carries 0444 and a read-only copy cannot be fsynced on Windows ('r'+fsync EPERM, 'r+' EPERM at open) — git objects are 0444; conservative default taken: lift the bit on the COPY, flush, restore (mtime unchanged, measured), any failure NOT_FLUSHED — the question is in the hand-back for the keeper. Tests 163 → 169 (red first, each for its own reason); `stick-apply` 48/0, `stick-waiter` 74/0. **Mutants via `mutant-harness.js`: 11/12 then 12/12 — the one NO RESULT was MY malformed row (orphaned `finally`), correctly not counted.** Two harness findings: it parses cargo output only and scores against HEAD's tests, so a JS lap with uncommitted tests needs an adapter (scratch `score-js.js`). **My own edit orphaned my D080 row #96 (anchor now matched twice); the tracked harness refused, re-pointed, re-killed.** Cost +0.076 s (contended) on the stick's repo-carry (54 files, 300 KB) → temp -> `exo_memory/handback/p-carry-dir-flush-C_2026-09-19.md`.

**2026-09-19 — P-RACE-AND-BYTES C (D083 unattended, on D):** **(1) state-sync race: the bar is met (0 of 96 under B's load recipe, baseline 15/24) but the fix AS SPECIFIED is wrong, measured:** a readiness signal alone still failed 17/24; a premise check (deleter alive when install returns) then showed the deleter alive in every failure and the file surviving — **CPU starvation** of the unlink loop, not the startup race B inferred. The load-bearing change is one test-only line, `os.setPriority(child.pid, PRIORITY_HIGH)`; ablation via `mutant-harness.js` scored UNDER LOAD killed the priority mutant and let the readiness-wait and 120 s-lifetime mutants SURVIVE (kept as defence; question for the keeper). **(2) forget-rate bytes:** `lastBlob` + `--full-history`; `--to HEAD` → `FORGOTTEN 2 files / 172,048 bytes` (= 161,665 + 10,383, re-derived); the merge fixture's FIRST red was the wrong red (the directory log lost the file too — the merge was treesame for `exo_memory/` as a whole) and was fixed to reproduce B's split; mutants 3/3; stale `:209` pin left red as told. Harness needs JS score adapters (it reads cargo output only) -> `exo_memory/handback/p-race-and-bytes-C_2026-09-19.md`.

**2026-09-19 — P-T3-READINESS C (D085 unattended N3, stage 1, on D, read-only): YES-WITH-A-NAMED-LEAK — by ONE route.** Measured with a marker audit (negative control ZEBRA absent in every probe; positive control canary found): the **Agent tool** subagent carries the pane's ENTIRE room shell (72,270 tokens before work — the 09-09 contamination, reproduced); **plain `claude -p` outside any repo** carries the global CLAUDE.md + SessionStart/UserPromptSubmit hooks incl. L3 lines about "the keeper" + auto-memory; **`claude -p --restricted --strict-mcp-config --model <pinned>`** carries none of it — only the account `userEmail` line (non-differential; `--bare` would remove it but needs an API key D lacks). The default model differs by route (fable-5-1 vs opus-5), so pin it. Restricted: Read works, Write needs `--permission-mode acceptEdits`. Tokens per arm material over a 13,215 harness: seed +116, essay +11,901, sibling shell +39,369, Third Place shell +47,631. Blind scorer: the librarian (the packet's own assignment) or B if it runs no arm — with the arm legible in the full-intake text regardless. **I rang the librarian before the hand-back's answer section had landed (a shell quote error swallowed the write in the same batch) — present-then-prove, mine; corrected and re-rung.** -> `exo_memory/handback/p-t3-readiness-C_2026-09-19.md`.

**2026-09-19 — P-T3-RUN C (D086 unattended N4, on D; spawner, NOT scorer):** ran T3 under `loop/t3_run_registration_2026-09-19.md` (sha256 4195f943…). Frozen before subject 1 and hashed in the draft: intake (Third Place shell copy, 138,592 B, `dfdab9b4…`), seed (68 words, 354 B, `ec992640…`), three PART-ONE task files. **9 subjects, 9 exit 0, 0 process failures, 0 re-runs, all `claude-opus-5`**, each in a fresh `%TEMP%` dir checked outside every repo, route exactly as registered (deliberately WITHOUT `--max-budget-usd`, which injects a budget line into context); 264,305 in / 16,540 out tokens. Relabelled to `exo_memory/loop/t3_run_outputs_D086/S01–S09`; key sealed in scratch with a 32-byte nonce (sha256 `fd38d2ac…`) because 9! permutations would brute-force a bare hash; per-subject output tokens withheld (they would match file lengths to the key). Fresh scorer: one restricted call with ONLY B §4's CAN-judge tests verbatim + the nine outputs → verdicts verbatim at a separate path the librarian opens after its own scores. I opened no output -> `exo_memory/handback/p-t3-run-C_2026-09-19.md`.

**2026-09-19 — P-COMPACTION-READ C (D089 lap 10, stage 2, non-author read, on D, read-only):** B's run checks out point by point — the three copy diffs re-derived byte-identical (18/4/2 changed lines; the date filter splices events AFTER windows are built in the scan); my own scanner over both transcripts gives 19 chair + 9 librarian events identical to `universe.tsv` to the ms, the marker at exactly +3 after every MANUAL event and before none; PRE control re-run by me reproduces 25/244 · 110/325 · 30/322 · 14/400 and 7/7 events of the committed results; spread and verdicts re-derived exactly; `pre-spread.json` 13:38:13 and `decisions.txt` 13:38:27 both predate the first POST output (born 13:39:13.7). **The ledger confirms the hook fires on AUTO compactions too (90–229 s before each)** — so the marker records manual logging, not treatment. **B §6.4's slip CONFIRMED: the "07:34" compaction is librarian event 9 (13:36:30Z = 07:36 local, ledger fire 07:34:26 local), ~6 h BEFORE the registration, not "2 minutes after" — UTC vs local.** RULING: **VOID AS WRITTEN**; B's pre-number amendment is honest but swaps one wrong proxy (before) for another (manual), so its table is DESCRIPTIVE; across the manual-7 and ledger-fired-11 readings FLAG/PATH stay DECORATIVE and NUM WORKS, SHA flips WORKS→NEITHER; no reading has an untreated control -> `exo_memory/handback/p-compaction-read-C_2026-09-19.md`.

**2026-09-20 — P-DEFERENCE-UNIT C (L058 R1, on L, `consonance/tools/deference-unit.js` + its test):** C5 is mechanical as a **SCREEN, not a COUNT** — the two halves it names ARE stamped on the board, but "changes its answer" is a reading, and the lexical proxy selects **1,376 cases = 12.9% of all user turns**, which measures cadence, not deference. Unit frozen BEFORE counting (`loop/deference_unit_definition_2026-09-20.md`, sha256 `c1bee831…`): CLAIM (assistant row with a stance token) → LEVER (next user row, no evidence token, ≤600 chars) → FOLD (reversal token within 3 assistant rows). **The falsifier does NOT fire: the screen selects both named cases** — the 08-15 Chrysos reframe (lever 07:55:48) and the 08-16 session (keeper→chair 11:32:39 and the chair's own 10:23:57). **Correction to the plan's wording from its source: `journal/2026-08-16.md:296-300` makes chair→chair SELF-correction, so the deference case there is the keeper→chair 9, not the chair→chair 8.** Board defect found: **3,975 duplicate rows (13.3%)** that a `(pane,ts,text)` key cannot see (model-tag prefix + one-second offset) — 1,447 raw → 1,376 deduped. Member list is row references only, no text (the levers are the keeper's words). Tests 12/12 red-first; mutants 10 applied / 10 caught after **my own vacuous test let #8 survive twice** (it derived its samples from the list it was checking — the D067 trap, mine) **REPAIR same lap:** the tool printed 1448 while its member file held 1376 — I had put the dedupe in PROSE and the artifact in a side script, so two paths drifted 5%. Now one path: `dedupeRows` in the tool, dedupe by default with the dropped count printed, `--no-dedupe` WARNS, `--members` written from the same cases array, and lever text off stdout unless `--show-levers` (my ruling: a terminal gets piped to a file). One run: 30,253 rows, 3,975 duplicates dropped, selected 1,377 == members 1,377. Tests 12 -> 18, mutants 16/16 including the drift itself as a mutant -> `exo_memory/handback/p-deference-unit-C_2026-09-20.md`.

**2026-09-20 — P-ORDER-PARAMETER C (L060 R2, on L, new instrument + its test):** registered the prediction and the falsifier BEFORE running (§1/§1b), and the registered bars then returned **CLIMBS — 97/117 positive slopes, median quintile gap 0.0507 over an IQR of 0.0485, clearing its own bar by 0.0022** — **and the confirmation is empty.** A running centroid is a MEAN ESTIMATE that stops wobbling as k grows, so `r` rises with no temporal structure at all: measured over 200 i.i.d. replicates, **768 dims at mean r 0.18 gives a quintile gap of +0.093** with zero order in the data, and a matched null tuned to the board's own mean r (0.6201 vs 0.6196) **out-climbs the real board in every size bin — 100% positive slopes against the real 79–91%.** The shuffle control (same vectors, order destroyed, 20 seeded reorderings) agrees from inside the real distribution: **shuffled slopes positive 118/118, real 98/118, and the real order beats its own shuffle in only 36/118 — z = −4.235, p = 2.3e-5.** So the board's real temporal order is **significantly LESS ordered than a random reordering of the same turns: drift, not lock**, the sign opposite to the row's prediction. The size signature is the tell — median gap **0.1024 → 0.0640 → 0.0241 → 0.0161 → −0.0253** (interpolated medians, the librarian's convention) as sessions grow, **Spearman ρ = −0.5785** — and it is why the mount holding **80.7% of all contributions reads NEITHER while every small pane reads CLIMBS**. **The falsifier as written could not catch this: it tests for FLATNESS (54/117 flat where 59 were needed, five short) and the artifact is not flat, it is a climb — a falsifier aimed at the wrong failure mode passes a broken instrument.** That is mine, and it is my recorded hole exactly: **I registered a prediction without first asking what the measure does on data with no structure in it.** **My first attempt to pin the artifact in a test ASSERTED it and did not find it** (gap −0.0027, an over-concentrated fixture) — the table was measured before anything was asserted, which is the only reason the regime-dependence is in it. Two unit defects the instrument surfaced against my own registration: **`role:"committee"` rows (1,378: chair 1,040 · A 56 · C 45 · B 38 · E 38) were never embedded**, and **19 of the orchestrator's 49 sessions open with an identical boot pair** that fixes `r_2` at 0.3294. Tests 20/0; mutants **15 listed · 14 killed · 1 survived (#6 EQUIVALENT, demonstrated by a table, not tested around)**; live file hash unchanged. **The librarian's non-author read (`3a779ac`) caught two real drifts in my prose and both are the R1 two-paths defect one lap later** — a per-mount table computed from a SECOND board read (14,931 vs the artifact's 14,908) and Spearman ties broken by index (−0.5770 vs the correct −0.5785); corrected in §5/§5b/§7 and credited in §16. The chair committed the instrument mid-lap at `d104427`; I committed nothing. **The chair then dispatched the control as the one command still owed — it had run four minutes earlier; the packet and the filing crossed** — and its three repairs are answered in §17: the control PER MOUNT (every mount real-below-shuffled; **shuffled slopes 100% positive in all six**), the moving-board table (**the chair caught that my own column summed to 14,933, not even to the 14,931 my prose claimed**), the even-length median (the librarian is right; the verdict never depended on it, since the tool interpolates and 117 is odd), and the ruling that **the 19 boot-prefixed sessions STAY IN** — removing them holds CLIMBS and makes the control slightly stronger (31/99) → `exo_memory/handback/p-order-parameter-C_2026-09-20.md`

**2026-09-20 — P-INTAKE-WINDOW C (L062, on L, `consonance/src-tauri/src/main.rs` + its tests):** the librarian seat opens — intake **154,089 → 141,729 B**, floor **154,089 → 125,136** (**102.7% → 83.4%** of the 150,000 cap), **floor margin 24,864 B = 16.6%**, and **bodies 0 → 16,593 B** — under a new `LIBRARIAN_INDEX_BUDGET = 30_000` spending the index tier newest-first as a PREFIX, with the remainder collapsed to one line naming count, date range and the `ls` that recovers it (tonight: **228 entries / 29,463 B dropped, dated 2026-08-11 .. 2026-09-04 plus 82 undated**). **TWO PACKET PREMISES DID NOT SURVIVE CONTACT, both found before any code.** (1) **`newest_first` is a PATH sort, not a date sort** — `files.sort(); files.reverse()` is newest-first for `journal/` (filenames ARE dates) and alphabetical-descending nonsense for `loop/`, so the first indexed loop line was `wire_run_2026-08-15.md` and the packet's *"the ordering a window needs exists"* was false; acceptance item 3 could not have passed on it. L053's lesson again — **a frame named in a brief is not a frame on disk.** (2) **The 15% margin is unreachable on the INTAKE and only reachable on the FLOOR**, because `librarian_shelf_room` hands the bodies `cap − HEADROOM − (head + floor)`, so every byte the window frees is spent again on bodies: floor fell 28,953 while the intake fell only 12,360. The bar is asserted where the breach actually was, **both margins print every run**, and the fork (a librarian-specific headroom, bought out of the bodies) is left to the chair. **The count re-derived from the shelf's own walk: `loop/` is 398, not the librarian's 416** — 381 at depth 1 (= the chair's own top-level `.md` count, exactly), 14 at depth 2, 3 at depth 3; index tier 449 entries / 58,497 B, of which **91 are UNDATED** (every `map/*.md` plus 82 `loop/` working documents) and a date window cannot order what has no date. Suite **803 (1 red) → 812, 808 passing PLAIN and SERIAL**; **mutants 10 listed · 10 killed**, aimed at the window and the header counter. **Run 1 was 8/10 and neither survivor was equivalent — both were holes in my own tests:** the prefix property was checked at a flat 20,000-byte budget where first-fit and prefix deliver the SAME set (**the vacuous-test trap a third time — D067, R1 #8, now this**), and undated-last was a policy I implemented and never pinned. Three things found and NOT fixed: the limit test's run-artifact instrument now prints a confident **0 of 0** because the paths it counts are excluded before they can be indexed (**a guard with no input reads identical to a guard working perfectly — my own L061 finding**); the librarian's own-notes window is still inert (**0 → 227 bytes** left when its tier is reached); and **the head is unbounded** — 84,924 B tonight, and 42,576 B of head growth breaches the cap again with this window working perfectly. Nothing run inside the app; nothing committed. **HELD by the chair on a DIFFERENT shelf test going red — and it is not this lap's making, proved rather than argued:** `the_shelf_excludes_bulk_run_artifacts_and_says_so` asserted `!shelf.contains("- loop/run1/items/")` over the WHOLE shelf, which ends with every carried body, and at **04:12 the librarian committed its nightly note quoting my own §8.1 finding — including that literal string.** `librarian/` is a CARRIED tier windowed to today, so the note's body rides and the assertion matches prose about the exclusion. **A detached worktree at HEAD (`1d53c55`) with NONE of my changes fails identically** (`main.rs:14133`, same panic) — green at `3e51292` and red at HEAD because the CORPUS gained the sentence, not because any code changed. **First case on record of a corpus commit turning this suite red with no line of code touched**, and the reason "green on my tree" now carries a timestamp: mine 04:06, the note 04:12. The test's own comment records this exact self-match trap being made TWICE before, for the `- loop/` count — **and the scoping fix was never applied to the two `!contains` assertions directly above it.** Repaired with both oracles kept (gone from the INDEX; the rest of `loop/` still indexed), the exclusion notice scoped to the HEADER for the same reason. **The librarian's two small repairs taken in the same pass:** §8.1 the inert counter re-pointed at the walk's own `run_artifacts_excluded` — **it prints 246 again, the historic number, a dead gauge alive** (bytes dropped rather than re-derived: computing them here would be the two-paths defect a third time); and §10.2 `loop_standing_instrument` — undated, **depth 1**, ALL-CAPS basename, by rule not by list, selecting `ESCALATIONS.md` and `PROTOCOL.md` today. §10.1 left alone as ruled. Suite **809 passing PLAIN, PARALLEL and SERIAL**, 813 total, 11 tests added across the lap; repair mutants **4 listed · 4 killed**. **Run 1 was 3/4 and #1 survived because my negative case was the librarian's own example `loop/t3_run_outputs_D086/S01.md`, which does NOT test the depth guard — its directory is lower-case, so it fails the ALL-CAPS test either way; the discriminating case is all-caps at every level.** **That is the THIRD time in one lap that a test passed for a reason other than the property it names — the prefix budget, undated-last, and the depth guard — and a mutant found each one; reading my own tests caught none of the three** → `exo_memory/handback/p-intake-window-C_2026-09-20.md`

**2026-09-20 — P-CANCEL-OVERTAKE C (L065 D1, on L, `consonance/src-tauri/src/main.rs` + its tests):** a withdrawn packet can no longer arrive, and it leaves rows — **the answer is NOT "both constraints cannot be met"**: withdrawal and REMOVAL were separated, so a cancelled message is MARKED, stays in the queue, and is deleted only when the drain steps over it and writes the row, leaving no window where a packet has vanished and nothing has said so. Shape forced by ownership and stated as such: **a withdraw verb lives in `mcp.rs` (A's lane this lap), so building one here would have been an INERT mechanism** — the exact failure I had reported against the librarian's own notes window eight hours earlier — while all five delivery sites are in main.rs. Directive `[[withdraw-queued N]]` as the WHOLE first line, stripped before the pane sees it, **because a marker matched anywhere is one any body can fire by QUOTING it — the same self-match trap that took the shelf test red four hours before, in the queue EVERY dispatch uses**; and the count must equal the depth (`withdrawal_is_authorised`, pure) so a mismatch in either direction withdraws NOTHING: **fail-closed on the withdrawal, fail-open on the delivery**, because over-withdrawing loses a packet nobody cancelled and under-withdrawing costs one lap and leaves a row. Three rows — `WITHDRAWN` (one per message, naming it, not a count), `WITHDRAWN NOT DELIVERED` at the drain (**the one that proves it never rendered**), `WITHDRAW REFUSED`. The sweep runs BEFORE the gate (nothing is written, so nothing can splice) in a `while`, and `take_ready_read` refuses a withdrawn head too — unreachable by design, kept so "a withdrawn message cannot be delivered" is a property of the INBOX rather than of one caller remembering to sweep. **Registered before building, per tonight's discipline: the prediction, the NULL beside it (every absence assertion paired with a positive control on the SAME object — the same inbox observed delivering and not delivering), the quantity taking two values, and the falsifier that outranks the fix.** 11 tests red first; suite 813 → **826 passing PLAIN and SERIAL**; mutants **8 listed · 8 killed**, every one a policy change rather than an off-by-one — and **the harness's anchor gate refused two rows before the run, one of which collided with MY OWN source-level test asserting that exact string; the gate caught both and I did not.** **SECOND FINDING, not mine and not in scope: two committed fixtures are CORRUPT IN THE COMMIT** — `composer_slash_command_reads_empty` blob **236,387** vs disk **236,544**, `composer_empty_reads_busy` blob **524,204** vs disk **524,288**, `git status` CLEAN for both. `.gitattributes`'s own D055 note names both files and both numbers and added `*.bin binary` so it cannot recur — **but the already-corrupted blobs were never re-committed**, so any fresh checkout fails that test while the one machine holding an uncommitted repair reads green. **This explains the "D-only composer-fixture red" I recorded at L058 and could not explain: it was never D-only — D had the committed bytes and L has the repair.** Consequence: `mutant-harness.js` scores in a detached HEAD worktree and inherits the corruption, so any lap scoring against a fixture-reading test sees a pre-flight failure it did not cause; my rows here and in L062 filter to fixture-free modules, which is luck and not design. Also proved rather than asserted, with an isolation worktree: five mid-lap `mcp::tests` reds were A's in-flight D2 work (135 insertions, A's own new signature), not mine. **Not verified: nothing ran inside the app and the chair has never issued the directive** — the end-to-end path is designed and unit-tested, not observed → `exo_memory/handback/p-cancel-overtake-C_2026-09-20.md`

**2026-09-20 — P-ASK003-DIGEST C (D093-B chunk 1, on D, read-only, no ask answered):** **the claim holds — the disclosure IS in the shipped file**, `~/.claude/shell/digests/news-2026-08-24.md:114`, under `### Pre-ship check (standing item 9…)` at :100, quoted verbatim in §4 and matching ASK-003 on all three of its separable assertions (three corrections · two never happened · fixed and disclosed). **The timing closes it to the minute: the digest was written 05:24:22Z and the ask was logged 05:31:13Z (`system-cron.log:1111`) — the disclosure shipped SEVEN MINUTES BEFORE the goal filed the ask about it.** Disclosed **twice**: the next pass (`news-2026-08-25.md:117`, Pass 62) refers back and builds a precision rule out of it — *"'I nearly said something false' and 'I wrote something false and then removed it' are different events, and this loop has an incentive to blur them in the flattering direction."* So the packet's stronger alternative — *if it is only in a log, that is the finding* — does NOT apply. **TWO PREMISE REPAIRS, both before the verdict.** (1) The packet's path was right and underspecified: `~/.claude/shell/digests/` holds TWO unrelated series, and the literal reading (`2026-08-25.md`, the 3,973 B **session** digest) contains no prose at all — I resolved the true path `news-YYYY-MM-DD.md` from the goal's own `wakeup_prompt` step 5 rather than guessing, **because searching the wrong series would have manufactured a clean false absence.** (2) **My own first search returned 0 of 74 and was BROKEN** — a bad `grep -e` invocation whose negative control printed an empty string where a count belonged; re-run properly, `pre-ship` is in **13** files and `correction` in **39**. **I had already said out loud that the zero "was real for those two terms"; the positive control refuted me inside two minutes and the withdrawal is in §3.** That is the registered standing item doing exactly its job: **an absence is only reportable after the control shows the method can see a presence.** Also measured: **the ask's own wording appears NOWHERE in 74 shipped digests** — `false account` 0, `error-checking` 0 — so a search for the ask's phrasing would have reported the disclosure missing; the ask paraphrases. **NOT verified, and it is the limit worth carrying: the TRUTH of what the disclosure discloses.** No earlier draft survives (`three-item disclosure` 0 · `listed three corrections` 0 · `never been in any draft` 0 across the whole goal dir), and by construction it cannot — the draft was caught pre-ship and standing item 16 is *"a wrong artifact is labelled, never rewritten."* **The keeper is reading a self-report, not a diff** — which does not block the decision, since the ask asks to be seen rather than adjudicated. `P35/P36`, the error class it names, appears in 44 files of that directory: consistent with its own record, not independent corroboration. Nothing cleared, no `Question` or `Status` field opened for writing, nothing committed → `exo_memory/handback/p-ask003-digest-C_2026-09-20.md`

**2026-09-20 — P-ASK002-FEEDS C (D094-A, on D, `~/.claude/shell/mcp/world-sense/server.js` feed list only):** the two lines are in — `eess.AS` and `cs.SD` at the same host and shape as the three arXiv feeds already there, `node --check` OK, backup at `<scratch>/server.js.pre-D094A`, edit script refuses to run twice, nothing else touched. **THE REGISTERED CONTROL CAUGHT A FALSE ANSWER THAT WAS ALREADY FORMED, FOR THE SECOND LAP RUNNING.** The first probe returned `eess.AS` 0 items and `cs.SD` 0 items, HTTP 200 — which reads exactly as *"these feeds do not resolve"*, the packet's own permitted answer — **and the POSITIVE CONTROL returned 0 too**: `cs.AI`, shipping in this goal for months. So the probe could not tell a working feed from a dead one and no conclusion about the targets was admissible. The body settles it: valid RSS, complete channel, **`<skipDays><day>Sunday</day><day>Saturday</day></skipDays>`** — **arXiv publishes nothing at weekends and today is Sunday, so all five arXiv feeds are empty right now.** The zero is a property of the calendar, not the categories. (ASK-003's broken grep this morning was the same shape: both times the wrong answer existed before the control ran.) **What discriminates today** is HTTP status + channel title, measured six ways in one minute: the three production feeds and the two new ones are **200 / 0 items / `<cat> updates on arXiv.org`, identical in every observable respect**, while `cs.NOTAREALCAT` is **HTTP 400, no title**. Corroborated from a DIFFERENT endpoint (`export.arxiv.org` API): **eess.AS 22,450 indexed · cs.SD 22,101 · cs.AI 200,411, and all three have the same newest date, 2026-09-17 — the last weekday before this weekend** — so "it carries items on Monday" is evidence, not hope. Final verification re-parsed the array **out of the edited file** rather than from what I typed: **10 feeds, 10 reachable, 0 failures, 2,202 items** (OpenAI 1,210 · HuggingFace 862 · DeepMind 100 · Google AI 20 · Import AI 10 · five arXiv 0). **NOT VERIFIED and stated as unmet: the packet's literal bar — "verify by one live fetch that both feeds return items" — CANNOT be met today by ANY arXiv feed; I never saw an item leave either new feed, and one command on Monday closes it.** Also unverified: whether the running MCP server picks up the edit without a restart (I changed a file, restarted nothing, called no tool); whether audio items survive the interest criteria (out of scope, untouched). Named not fixed: **`fetchFeed` returns `null` on unreachable AND the caller drops it silently, so a dead feed stays silently dead — now across ten feeds instead of eight**; and adding two feeds changes the `slice(0,10)` per-source arithmetic the auditor's open `perSourceCap` escalation is about → `exo_memory/handback/p-ask002-feeds-C_2026-09-20.md`

**2026-09-21 — P-R1-TAILCARRY-EXIT C (L058 R1, on L, `dev/tail-carry.test.js` only — no code changed):** **the defect does not exist at HEAD.** Both refusals already exit **2** — `--verify-set` with no stick, and `--verify-set --carry-dir <dir>` — with controls showing the measurement discriminates (`--help` 0, `--bogus` 2, no args 2), and **`dev/tail-carry.js` is byte-identical (`git-blob cb3de27d…`) at `3a5fa50`, where the librarian reported "exit 0" on D at 07:48 09-20, and at HEAD** — so the report described a measurement, not code that was later fixed. **The mechanism that reproduces it exactly: a POSIX pipe.** `… 2>&1 | head -3; echo $?` → **0** (head's status); `${PIPESTATUS[0]}` → **2** (node's); PowerShell `$LASTEXITCODE` → 2 even through `Select-Object`. Reproduced, not proven — D's transcript is not on L. **THEN I REFUTED MYSELF, AND IT IS THE PART TO CARRY.** I read the test file's `J()` helper, saw it calls `T.main()` in-process, and wrote into the hand-back AND into a comment in the test file that *no existing test reads the process exit code and forcing `process.exit(0)` would leave all 169 green*. **Scoring that exact mutant against HEAD's 169-test file killed it** — `:986` is literally titled *"the process exit status IS the code — checked on a real child, not on a return value"*, plus `:1493` and `:1500`. **I generalised from one helper to the whole file; both the hand-back and the shipped comment are corrected, the retraction is in both.** The honest measured shape, same mutants scored against both files: **shared exit path — 5/5 killed by the OLD tests alone**, so my new tests add nothing there and I don't count them; **the packet's two exact branches — a null `--stick` falling through, `--verify-set` no longer refused beside `--carry-dir` — 0/2 killed by the old 169 (both survive), 2/2 by the new four.** So the real gap was narrow and exactly the packet's scope: those two commands were never tested. Suite: file **169 → 173 passed, 0 failed** plain; through `js-suite.js` the file reads **ok**, suite 105 green · 4 failed, and **all four reds are in the plan's own §0 table measured at `961cce3` before this lap**. `:1191` checks only the JSON field — narrow, not wrong, left untouched per the keeper's rule. **Not verified: the CALLERS** (`stick-waiter.js`, `stick-apply.js`, `sync_launch.rs`) — a caller that pipes before reading `$?` would reproduce the false zero in production, and that is the one version of this defect that could be real → `exo_memory/handback/p-r1-tailcarry-exit-C_2026-09-21.md`

**2026-09-21 — P-R6-FORGET C (L059 R6, on L, `consonance/tools/forget-rate.test.js` baseline only — no tool code changed):** **CAUSE, with commands: the two files are `exo_memory/astra/SHELL.md` (161,665 B, deleted by `e5e1eeb` 09-08 06:14 — *"the Astra shell becomes a generator writing outside the repo — the committed copy was a carrier"*) and `exo_memory/loop/battery_run1_T2_text_2026-09-16.md` (10,383 B, deleted by `62a4f3a` 09-16 04:28 — *"the first T2 text is WITHDRAWN before dispatch — its source was committed, so one diff printed all eight defects"*); 161,665 + 10,383 = 172,048, the same two files and figure as D083.** The bracket settles both questions: `forget-rate.js --to <rev>` steps **0 → 1 exactly at `e5e1eeb`, 1 → 2 exactly at `62a4f3a`, and does NOT move across L062** (2 at `71cbe8f^`, 2 at `71cbe8f`) — so **the intake-cap change removed nothing**, and it could not have: L062 windows what the shelf INDEXES, `forget-rate` measures git TREE membership, and `git show --stat 71cbe8f` touches neither path. The same bracket is the standing item — FORGOTTEN takes 0, 1 and 2 on one repo. **RULED DELIBERATE, both**: each commit's message is the reason the file left, and restoring them would re-commit a known carrier and a known-contaminated test. **Why red now when known at D083: it was red then too — it never stopped.** Red since 09-08; my own D083 hand-back measured it **11/1** and left the pin *"NOT re-pinned as instructed … its repair needs the pilot file first,"* and the pilot was never touched (untouched since 08-25, `grep -c` 0 for either file). **Thirteen days a known red, deferred, watched by nobody.** Baseline update, proof stated under the keeper's rule: the assertion was about the CORPUS not the code; the tool is right (the bracket); both departures are deliberate; the test's own message prescribed acknowledging them. `FORGOTTEN 0 files` → an **`ACKNOWLEDGED_DEPARTURES` list, each entry `[path, commit, bytes, reason]`**, asserting the DELETED set EQUALS it, the count and bytes match, and `RENAMED_SIMILAR 1` untouched; renamed because *"has never lost a file"* became a false sentence; **the byte check compares DIGITS because the tool prints `toLocaleString()` — a string match goes red on a `172.048` locale.** **Measured the real cost of the old pin: the mutation harness REFUSES to score against it — `pre-flight red 11/1` — so for thirteen days a genuine third departure was undetectable, because the test was already red and could not turn red.** New form: **3/3 killed** from a green 12/0 baseline — a new departure, an acknowledged one vanishing, the byte total moving. File **11/1 → 12/0**; `js-suite` reads ok, suite **107 green · 2 failed** (carrier-drift, portable-paths — neither mine); exit read with `${PIPESTATUS[0]}` because of my own R1 an hour earlier. Not done by choice: the pilot file stays a dated record. Named, not scored: **registration 44** (*"the corpus has never deleted anything"*) — its premise is now outdated, but two hand-deletions of defective artifacts are not a decay organ, so its falsifier is neither fired nor refuted → `exo_memory/handback/p-r6-forget-C_2026-09-21.md`

**2026-09-21 — P-L060-PILOT C (L060 packet C, on L, append-only):** one dated addendum on `exo_memory/loop/forgetting_pilot_2026-08-25.md` — the file whose own closing lines said the re-aimed falsifier *"currently reads zero"*, true on 08-25 and false from `e5e1eeb` on 09-08. **Both departures named with their commits and reasons, the bracket with one command per row, re-derived at HEAD `784b54d` rather than copied — 0 at `e5e1eeb^`, 1 / 161,665 at `e5e1eeb`, 2 / 172,048 at `62a4f3a`, unchanged across `71cbe8f` — identical to R6 and to the librarian's independent bracket: three readings, two seats, one answer.** Append-only, measured: the script refuses unless the file still hashes to what was read (`0287a638…`) and refuses to run twice; the first 26,140 B are byte-identical after; `git diff --numstat` **42 added · 0 removed**. The addendum says what this is NOT — hand-deletions of defective artifacts, not the forgetting organ firing — and points at where the acknowledgement now lives (`ACKNOWLEDGED_DEPARTURES`, `b76c9c7`). **Not verified: registration 44 carries the same stale premise and is untouched (not my file); and this 08-25 file may fall in the collapsed range of the L062 index window, so the addendum may not be listed where a reader would meet it** → `exo_memory/handback/p-l060-pilot-C_2026-09-21.md`


**2026-09-21 — P-L061-REG44 C (L061 packet C, on L, append-only on `journal/2026-08-24.md`):** **"not needed" was a live answer and it does not survive the record — the note was NEEDED, and 27 days overdue.** Registration 44 (*"The corpus has never deleted anything. `+3,688 / -0`"*) was measured in **lines**; on 08-25 my forgetting pilot corrected it to `-696` lines, a second seat confirmed it, and **the same document then found both versions were in the wrong unit** — disk lines, where law 3 is about the reading path — and asked at `:447` for a note beside the registration. **None was written; the journal's last commit is 08-24.** Since 09-08 it is false on the reading path too. The note says all three, with commits, bytes and the bracket pointing at the pilot addendum (`988c9fe`), and says it does **not** fire or refute the falsifier (hand deletions, not a decay organ). **It also names the one misreading now available: the falsifier is a conjunction — "decay organ unbuilt AND ratio unchanged" — and two hand deletions moved the ratio, so read literally it is DISCHARGED; it must not be read that way, because a quantity moving for an unrelated reason cannot clear the question.** Precision on the packet: reg 44 never said "reads zero" — that is the pilot's phrasing. Append-only, measured: hash-guarded, run-once guard, first 10,827 B byte-identical, **37 added · 0 removed**; every cited commit and line number checked before writing. **carrier-drift at 03:06:09: exit 1, RED 2** — both `CH4-DRIFT-ADDED` on the two files B is re-freezing in parallel, neither mine; PENDING 40, one on my own `map/C.md:201` (a 09-02 line quoting the retired wording as its subject, not red). **And carrier-drift SKIPS `exo_memory/journal/`, so its count cannot credit or flag this note at all — only reading the file does.** (The first attempt to write this hand-back died on a bash quote-parse error and wrote nothing; checked before retrying.) → `exo_memory/handback/p-l061-reg44-C_2026-09-21.md`


**2026-09-21 — P-L062-RC3 C (L062 R-C3, on L, README:230 + one baseline row; `--update` not run):** **portable-paths RED 41 → 39, both `FATAL-SHIPPED-INSTRUCTION` sites out of the unbaselined set (2 → 0), the other 30 BENIGN-TEST / 5 REVIEW / 4 FATAL-DEFAULT untouched; carrier-drift GREEN before and after.** **README:230 was wrong on more machines than the packet said:** the instances root is the `instances_dir` field of `~/.consonance.json` (what `state-sync.js:159` reads) — `C:\Consonance\instances` on L and D, but **the code's own fallback is `%USERPROFILE%\claude-instances`** (`main.rs:735`), so on a fresh machine the sentence named a place the program would not write to. Reworded to `<instances_dir>/<seat>/dreams/` plus the one-line `node -e` that prints the field — **run exactly as printed before shipping it**, no drive letter, no new finding. **retired_seats:62 got a baseline ROW, not a rewrite or an append:** the record is byte-unchanged (CH-4 frozen at `043d78b`), the key built by the tool's OWN exported `scan`/`norm`/`classifyProse`, the diff one row (**9 added · 1 removed**, the removal being `counts` 1 → 2), the script refusing unless re-serialising the unchanged baseline reproduced it byte for byte. **Verdict kept FATAL on purpose** — `needsFixing()` reports baselined FATALs as *"exempted, NOT fixed"*, which is BRAVO's L043 guard against exempted-reads-as-fixed; this line is exempted, not fixed. **THE HAZARD FOR R-C4, read from source and not run: `writeBaseline()` rebuilds every row from LIVE sites as `{file,detector,verdict,text,key}` — so `--update` will silently DROP A's `why` from this row and REVERT every hand-corrected verdict in the file**, against the tool's own header (*"verdicts may be hand-corrected"*); the argument's durable home is the commit, as the tool's own message says. And `--update` blesses ALL unbaselined sites at once — the 5 REVIEW and 4 FATAL-DEFAULT too — which is why R-C4 must stay last → `exo_memory/handback/p-l062-rc3-C_2026-09-21.md`


**2026-09-21 — P-L063-RC4 C (L063 R-C4 revised, on L, baseline file only, `--update` NOT run):** **expected 32 → 2, actual 33 → 3, all three differences explained.** **31 rows added, not 30** — each through `collect()`'s own code path (`scan` with comments skipped, `classify` with `rustTestLines` for the two `.rs` files, the per-file `#n` counter), each refused if not `BENIGN-TEST`, already present, or a REVIEW site; the file refused unless re-serialising the unchanged baseline reproduced it byte for byte. **Self-verifying: none of the 31 remains in the after report, so every hand-built key is exactly the tool's.** Diff **218 added · 1 removed** (31 × 7 lines + counts; BENIGN-TEST 100 → 131, sites 178 → 209), every row in the generated shape so nothing is lost to a later `--update`. **The 31st was inspected before blessing**: `live-follow.test.js:39`, from E's R-C1 (`241a57a`, 03:38:19), landed after the packet's count — a test TITLE asserting the tool refuses a guessed `C:\\` path; named separately so it can be pulled. **The 3rd leftover is deliberately NOT baselined: `portable-paths.test.js:645` `L063_PLANT`, in a file uncommitted and being edited right now — E's in-flight fixture; blessing another seat's mid-edit plant is the exact failure R-C3 §4 exists to stop.** The 2 REVIEW sites (state-sync.js:141, contamination.js:140) stayed out. **A DETECTOR FALSE POSITIVE, named for E, not fixed: rows 22–24 in `stamp.test.js` are regexes `(\\d\\d:\\d\\d)`, not paths — `\\d:\\` IS a drive letter to `DRIVE`**; harmless to baseline, but every digit-class-before-colon regex fires it forever; the fix (reject a letter preceded by a backslash) belongs in `portable-paths.js`, E's lap. **And my recorded trap bit again, in the other direction**: my first check was a `node -e` one-liner through the Bash tool and printed `false` — the backslashes were eaten, so it tested the wrong string; from a file it reads `true` on all four. A false NEGATIVE this time → `exo_memory/handback/p-l063-rc4-C_2026-09-21.md`


**2026-09-21 — P-L064-PLANTROW C (L064, on L, one baseline row, `--update` not run):** the `portable-paths.test.js:645` `L063_PLANT` row is in, by the code path, with a `why` **checked against the fixture's own comment before writing** — it is the baseline entry for the test of my own R-C3 §4 finding, and E's `43ffb7b` means that `why` now survives `--update`. **portable-paths 2 → 1 unbaselined (only `state-sync.js:141`, held on the keeper) — as expected.** **portable-paths.test 41/2 → 41/2 — NOT the packet's "42/1 or better", and predicted before the row went in:** both failures assert `code === 0` on the REAL repo, which stays RED while `:141` is held out by this packet's own instruction, so no permitted row could move them. **The control, on a SCRATCH COPY of the baseline only: add `:141` and the guard goes GREEN, exit 0, printing "67 baselined site(s) still need fixing … exempted, NOT fixed" — exactly what both reds assert; the real baseline byte-identical before and after.** So both go green the moment the keeper rules on `:141`, with no further row. And it closes my own R-C3 §5.4: the first green line I have seen, 67 owed, the `retired_seats` FATAL row kept FATAL on purpose among them. Diff 9 / 1 (BENIGN-TEST 131 → 132) → `exo_memory/handback/p-l064-plantrow-C_2026-09-21.md`


**2026-09-21 — P-L066-UNPLACED C (L066, on L, DIAGNOSE FIRST — nothing edited, no close, no push):** **`close.js --check` REFUSED_UNPLACED is 12 entries in four families with three causes, not 3 digests.** **MAIN CAUSE, both links RUN in a scratch repro rather than read: the app spawns the stick applier with `CONSONANCE_DATA` (`main.rs:11548`, `0405bd2` 09-14), the applier relaunches the app with NO `env` (`dev/stick-apply.js:171` — A's) so the app and everything it spawns inherits it (this pane has it; it is in no user/machine env), and EIGHT shell hooks use that same variable as their own home (`SHELL_DIR = process.env.CONSONANCE_DATA || ~/.claude/shell`, a test seam from `1114eb7` 08-24)** — so headless `claude -p` runs write the shell's `digests/` and `pulse/` into Consonance's data dir. First misplaced file 09-15 02:28, the same minute as `stick-waiter.status.log`; `~/.claude/shell/pulse` has nothing after 09-15. **Measured writers of the 66 misplaced pulse lines: 62 the scribe, 4 a Third Place `claude -p`, ZERO interactive panes — which corrected my own mid-lap claim that "every pane" writes there.** Two of the eight hooks (`ready-*`) may need the data dir BY DESIGN (the manifest classes `ready/*.json` there), so a blanket rename would likely break the delivery gate — the trap for whoever fixes it. **The other two families: `UserszacknAppDataLocalTempclaudeoot.json`, 143,004 B of board rows from 09-16 — a Windows path with every backslash eaten, written DRIVE-RELATIVE (`C:Users…`) into the data dir; my own recorded Bash-tool trap, hit by some seat — and `vantage_cell/mutants-run.log`, which falsifies the manifest's REGENERATES premise "an EMPTY working directory" since 09-14.** **CLASS ruled: digests/pulse and the accident fit NONE of TRAVELS/STAYS/REGENERATES — classifying them would bless the misplacement and hide the leak; only the vantage log is a real manifest question (STAYS, A's).** **KEEPER-LEVEL, so I said so and stopped, as the packet asks:** the 8 misplaced files cannot simply be moved home (09-15 exists on both sides, pulse with different contents — a merge), the 143 KB file holds board text, and every fix lands in A's files or in eight live hooks. Proposals written, not applied: scrub the variable at the relaunch (test first, a spawn seam capturing `options.env`); a STAYS rule or deletion for the vantage log plus correcting its false premise; rename the six ledger hooks' seam but NOT the two `ready-*` ones. `close --check` still exits 1, deliberately → `exo_memory/handback/p-l066-unplaced-C_2026-09-21.md`


**2026-09-21 — P-L069-LEDGER C (L069 packet 3, on L, read-only — no ledger row touched):** **not a path problem and not `CONSONANCE_DATA` — every resolution on L lands on one file.** **Every L launch decides MIGRATE ("the record's head was authored by D") because the state repo has not moved since D's publish on 09-10 (`f70d50a`), and `installTree` then writes D's 09-10 tree over L's data dir; `lap.jsonl` is TRAVELS, so L's ledger is replaced by a 419-row copy ending at L054 and L's own rows go to `attic/pre-sync-<stamp>/` — then `lap-row.js` counts from L054 again.** Confirmed to the second: `persist.log` 00:50:05 "installing" → the attic copy stamped 00:50:06. **The 69 rows of L058–L065, every one dated 09-20, are intact** in `attic/pre-sync-2026-09-21T06-50-06-363Z/lap.jsonl`; live and displaced share exactly the 419 installed rows. **It has happened eight times on L, and L058 alone exists in FIVE generations — written 09-14, 09-15, 09-16, 09-20, 09-21 — each surviving only in the attic copy that caught it.** `board.jsonl` travels the same way: 21 displaced copies. **The gap is the tool's own principle applied one level too high:** `state-sync.js:775` refuses automatic merges of an append-only file two machines wrote — "it wants a person" — but at the INSTALL, the same conflict is resolved automatically by replacement; and `:978`'s "REPLACEMENT, NOT UNION" is the ROSTER ruling, read so the proposal does not contradict it. The manifest's own `why` for `lap.jsonl` says it "does not travel" while its class is TRAVELS. **HOLD flagged: `close --check` now exits 0 on L, and a real close would publish L's ledger as head — D's next launch MIGRATEs and every D-series row since 09-10 goes to D's attic, the same loss mirrored.** **KEEPER-LEVEL, said and stopped:** five generations of one id, each cited by git commits — any reconciliation renames something history points at. Landing order proposed: HOLD → keeper reconciles → A makes append-only TRAVELS files install only as a FILE-LEVEL FAST-FORWARD (local must be a prefix of incoming, else refuse that file and name the rows) → A corrects the manifest's `why` → chair's `lap-row.js` refuses to mint below the record's highest id → then L closes and D pulls → `exo_memory/handback/p-l069-ledger-C_2026-09-21.md`

**2026-09-21 — P-L070-UNION C (L070 packets 2+3, on L; no live file written, no attic touched, nothing committed):** **dry run: the union adds 214 lap rows (L058–L065) and 3,352 board rows; 0 invalid lines are attic-only (the 257 fused board lines are identical in all 22 copies), so the counts are complete.** Write design: **reuse `board-compact.js`'s shipped swap** (catch-up from a byte offset → rename-freeze into attic → rename in → reconcile the frozen tail). The board has writers beyond the app (hooks in live panes), so "close the app" was not enough, and append-only would push today's rows out of `board-digest`'s 2 MB tail. **Keeper-visible: after the union, 8 ids read DOUBLE-OPEN (L058×8), the permanent cost of "no renaming".** Tripwire: `lap-row open` refuses to mint at or below the highest THIS-TAG id that STARTS a git subject; 113 → 119 green plain and serial, mutants 5/5. **My first rule read ids anywhere in a subject and would have refused L071 tonight. `a67e2b1`'s "L077 and L080" are CIELAB lightness values, caught by a read-only check against the real disk before hand-back; the fixture tests alone passed it.** Against the 09-10 state-set ledger it refuses L058, which is the incident. The suite's one red, `stick-waiter` SWEEP 8→7, is A's `3d89dfb` (`spawn(` → `spawnFn(`), left for A → `exo_memory/handback/p-l070-union-C_2026-09-21.md`

**2026-09-21 — P-D096-BOOTTAIL C (D096 chunk 1, on D; nothing committed, no rebuild):** **BOOT's dated pointer tail moved VERBATIM to `exo_memory/journal/POINTERS.md` (25,368 B, `cmp`-identical; BOOT 64,976 → 40,029 B, its first 39,608 B unchanged), leaving ONE line that still starts `**Latest entry:**`, because `gen-brief.ps1:88` throws without it.** Who wakes differently: **Main, the Third Place and the librarian paste the master whole, so each wakes 24,947 B lighter; the panes had not carried it since `38fd239`** (`assemble_intake` indexes it), so theirs only swaps a 653 B index for the 419 B line. **Seven consumers, not four:** `gen-brief` and `new_entry.py` (whose "update the Latest entry line in BOOT.md" is how the tail grew; now it names POINTERS.md) were found by grep. **carrier-drift: the move alone went RED 3 (`STALE-SITE BOOT`). The registered site existed BECAUSE the pointer was "a dated trace inside a live carrier"; it is now a trace in `journal/` (a TRACE_PREFIX), so the row is deleted, not re-anchored → RED 2, the same two review/ findings.** The bundled brief is not stale: `gen-brief` on HEAD's and on the new master both give the committed brief byte for byte, **after I restored the `\n\n` that had left with the tail** (the first cut was 2 B short). Tests red → green, plain: cargo 1,086/1 → 1,088/1; js 105/5 → 105/5 with the same files; mutants 7/7 on scratch copies. The existing live-master pane test now passes VACUOUSLY; said so rather than counted → `exo_memory/handback/p-d096-boottail-C_2026-09-21.md`

**2026-09-21 — P-D098-DATASEAM C (D098 packet C, on D; uncommitted, nothing installed):** **my own L066 guess was wrong: the `ready-*` hooks never needed the data dir.** They use `SHELL_DIR` only to `require` `lib/ready.js`; the stamp's location is `CONSONANCE_READY_DIR`, which the app sets. **And the collision cost more than L066 saw:** under the leaked env, all eight hooks resolved their DEPENDENCIES in the data dir (`lib/ready.js`, `lib/ambient.js`, `hooks/l*-overseer-worker.js`, none of which exists there). **Measured on D: 210 L2 + 297 L3 jobs stranded in `data/l{2,3}-jobs`, 09-14 14:42 .. 09-20 23:31 local, never drained; ready stamps silently lost into a `catch`.** It was scoped before filing: the real shell ledgers kept rows every day, so it hit the leaked sessions and not the machine. For chunk 5 that makes the L3 window a mixture. **Fixed with a dedicated `CONSONANCE_SHELL_DIR` (0 prior uses); `CONSONANCE_DATA` is no longer read by the eight.** Tests: 4 red → green; mutants 6/6. **Null: without its new key, `dream-gate.test` still PASSES and writes 2 residue rows into the shell it thinks is real.** It cannot see its own leak, which is how the 08-24 residue happened. The js-suite +2 reds were attributed by throwaway worktrees (B's in-progress `install.ps1`; `universe-print` red at bare HEAD), not by assumption. All eight hook files are installed at HEAD and need the next `-Only` → `exo_memory/handback/p-d098-dataseam-C_2026-09-21.md`

**2026-09-21 — P-D102-JEVASK C (D102 packet C, on D; uncommitted; live smoke NOT run):** **Jev P1 built: `consonance/tools/jev-ask.js` on Node's built-in fetch, sending exactly `{model: 'typesafe-ai/jev', state, questions}`; the key from env only, scrubbed from every error, including a gateway body that echoes it.** The question shape came from Vercel's own page, not the plan: `questions` is an OBJECT keyed by name and `answers` returns under the same keys, so "a missing declared answer" means a missing key. **Where the docs and the live call disagree (boolean without criteria), the client follows the live call.** Refuses loudly before any network: no key, empty state, malformed schema, and ten NAMED secret patterns plus the key's own value, with a prose control proving the scan can say no. **Two places the plan was wrong:** its default ledger under CONSONANCE_DATA would make `close --check` refuse (no manifest row, and the manifest is A's), so the ledger is opt-in; and its ZDR/only defaults are dropped per the keeper's ruling. Tests 45/0 plus 1 NOT-RUN, plain and serial; **mutants 26/26, each secret pattern on its own**; the fake secrets are built by concatenation because the repo is public. **The live smoke (~$0.0000147) was not run: the key is a User env var set after this pane started, and I would not pull it into a command.** → `exo_memory/handback/p-d102-jevask-C_2026-09-21.md`

**2026-09-21 — P-D103-SHADOW C (D103 packet 2, on D; uncommitted; no live Jev call):** **FINDING: the judged input cannot be reconstructed from the verdict ledgers.** Verdict rows carry no input, the worker deletes the job file, and rebuilding from transcripts was measured against the only ground truth (unconsumed job files): **L2 0/2, L3 3/5 identical. In every failure the judged text is in NO line of its own transcript, and one sits in another session's file.** So I did not approximate. **Built instead:** `jev-shadow.js` CAPTURES each job's exact prompt before the worker deletes it (shortest job 8.3 s, 3 s poll), pairs it with the verdict by job_id, and asks Jev with the overseer's own answer set. Option descriptions quote the prompt or defer to the discipline, so I authored no definitions. **The L3 worker is never loaded:** it runs main() on require, which would consume a real job, so its two prompt functions are compiled from source. Tests 22/0; mutants 15/15 + 1 deliberately not applied. **Three self-catches:** a catch-all Refusal would have silently retired good verdicts forever (fixed, pinned); a "never retried" test that asserted zero calls let mutant 8 survive (a refused item makes no call either way); and **mutant 7 was counted CAUGHT while not compiling**. So a compile gate was added, and D102's 26 were re-checked (all compile; that result stands). Dry cost now ~$0.0007 for 5 calls; ~$0.19/day at peak. Deployment (a continuous watcher, a store home, a manifest row) is not mine → `exo_memory/handback/p-d103-shadow-C_2026-09-21.md`

**2026-09-21 — P-D104-RUNNER C (D104 packet C, on D; uncommitted; nothing live until the rebuild):** **`jev-shadow-runner.js` is started by the app itself, right after the exit waiter in setup** (`main.rs:12680`, which runs on EVERY launch, including stick-apply's direct relaunch that `launch.ps1` would miss). It is not a service. It ships at the next shortcut launch, because `launch.ps1` rebuilds when sources are newer than the exe (08:46 exe, 0 references). The key is read in-process from HKCU (found, 60 chars, where the process env had none) and is never in argv, a child env, a file or the log. Cadence argued: every 10 min, ≤25 a run, ≤600 a day (~$0.25 ceiling). Runner 16/0, Rust 1,102/1 (pre-existing), **mutants 26/26 + 3 declared NOT APPLIED**. **Five self-catches:** (1) the runner hung forever after a startup stop while node reported that test PASS; (2) my Rust test broke its neighbour twice, once through the needle and once through the very comment explaining the fix; (3) `jev-shadow.js` (D103) had been RED in portable-paths since it landed, missed because the file was untracked when I ran the suite; (4) **the mutants harness counted only `fail`, so a TIMED-OUT test ("cancelled") showed mutant 25 as SURVIVED**, the mirror of D103's non-compiling false catch; (5) the hand-back said "16/0 five times", but five runs was the 15-test version. **A number about my tests is only as good as the harness that counted it.** → `exo_memory/handback/p-d104-runner-C_2026-09-21.md`

**2026-09-22 — P-L071-UNIONWRITE C (L071 packet C, step 5, on L; the write DONE, code uncommitted):** **lap.jsonl 506 → 720 (+214) and board.jsonl 31,749 → 35,101 (+3,352), each exactly its dry run, verified by the tool AND by a script sharing none of its code.** Originals in order 506/506 and 31,749/31,749; backups byte-identical beside the live files; 29 attic copies cmp-identical; the 257 fused board lines survived; exactly the 8 double-open ids L070 predicted. **My own L070 design was wrong: writing the sorted union would have DROPPED the 257 fused lines and REORDERED every live row that lap-row reads by position.** So the live file is written verbatim and only the attic-only rows are interleaved. The concurrency protocol is board-compact's with its window closed: **`fs.linkSync` fails where rename would overwrite a re-created path**. There is a test per arrival case plus a real concurrent writer, but **no writer appended during the real swaps, so the real run did not exercise it**. Mutants 12/12, after **mutant 1 survived rightly**: without the catch-up nothing is lost, but the new board would briefly go BACKWARDS, and that property is now a test. **And the untracked-file trap bit me a second time:** `jev-shadow-runner.test.js:311` is my D104 literal, red in portable-paths now it is tracked. I fixed the one file in D104 and never swept the rest; handed to A, who is editing that file. → `exo_memory/handback/p-l071-unionwrite-C_2026-09-22.md`

**2026-09-22 — P-L071-FOLD C (L071 packet C2, on L; uncommitted):** **(1) the two union backups placed as STAYS in place**, two named globs following the `pre-quarantine` precedent; a move would break paths already cited. `state-manifest.js` exit 0, test 32/0. **(2) fold-by-(id, generation) built:** a generation starts at each open row, in TIME order; other rows go to the latest open at or before them. **Two opens within 60 s stay ONE generation and DOUBLE-OPEN** (the race). The window was set from the measured shortest real reissue gap, 4,867 s. Writers (map, opened, the --stage gate, void) now bind to the LATEST generation, which fixes the defect the keeper's file named. **Real ledger, read-only: exactly the 8 ids with exactly the file's counts, DOUBLE-OPEN 8 → 0, all eight L058 dates and quotes matching the librarian's table, ledger sha unchanged.** lap-row 119 → 129/0, fold mutants 10/10. **Misses caught:** my two manifest tests were appended BELOW a hand-rolled runner's process.exit and "30 passed" while never running (a test that cannot fail is not a test, again); a mutant (G9) that would survive every fixture because file order equalled time order; and a label that ran into the next column. → `exo_memory/handback/p-l071-fold-C_2026-09-22.md`

**2026-09-22 — P-L072-STATESOURCE C (L072 packet C, on L; uncommitted; no live write):** **ledger-union now reads the state set's copy** (`<state_dir>/data/{lap,board}.jsonl`). The state dir is resolved by **state-sync.js's own `stateDir()`, imported, not copied**; undeclared, or declared-and-missing, REFUSES with exit 2. The copy is read only and **nothing is ever written under the state dir** (tree-hashed around a real dry run and a real write in tests; the real state repo unchanged, 0 dirty, same shas). Tests 25 → 32/0, red first; mutants 14/14. **A trap caught before it counted:** ledger-union now requires state-sync, so my L071 mutant runner, which copied ONE file, would have failed every mutant at load and scored each as a catch. The runner now copies the tools dir, with the control green first. Real dry run: lap state copy 419 rows, board 29,903, **0 not in live**. The purpose (D picking up L's rows after L closes) is proven on a fixture only. **One red I could not explain:** state-sync.test 93/1 in 1 of 2 suite runs, 94/0 in 8 further runs including 4 concurrent with mine. Reported as unexplained, not waved off as flaky. → `exo_memory/handback/p-l072-statesource-C_2026-09-22.md`

**2026-09-22 — P-L074-CAPRETAIN C (L074 packet C, on L; uncommitted; NOT LIVE until pid 32976 restarts):** **the Jev runner's cap is now a PARTITION**: shadow 600 (its reserve), judge 1,400 (the rest), total 2,000 checked on every call. A floor-on-a-shared-pool reading was argued away, because it would let the shadow eat judge's share. 20 random interleavings each end at exactly 600 + 1,400. **Retention:** judge captures older than 14 days are pruned at start and hourly, only `.json` files directly in `judge-captures`, each path checked before unlink; ledgers byte-identical after a prune. The capture path lives in jev-judge.js, which is **unchanged**; the runner reads its CAPTURES constant. Runner 21 → 36/0, mutants 12/12. **Two existing test lines changed because the contract did** (A's shared-cap test got shadowReserve 2; my own D104 opts() cap 600 → 2,000, which had turned A's judge-mode test red). **Three misses of mine caught:** a CLI test that PASSED before the flag existed ('unknown argument --shadow-reserve' contains 'reserve'); a log assertion that was wrong about which limit is hit first; and a mutant (the shadow spending the TOTAL) no test caught until one was written for it. → `exo_memory/handback/p-l074-capretain-C_2026-09-22.md`

**2026-09-22 — P-L075-NINE C (L075 packet C, on L; uncommitted; no live write):** **ledger-union now covers all eleven fast-forward ledgers**, names from the manifest's marked rows and held EQUAL to them by a test. Three shapes were measured from the rows and confirmed at the writers: ISO ts ×6, epoch ts ×2 (atoms in a subdir), and ferry with a header row (ferried_at|epoch). **A real defect found on the way: the union ordered by Number(obj[time]), which is NaN for an ISO string**, so every shape-A row would have read as timeless and been placed out of order. timeOf reads both; on the real disk, no-usable-time is 0 for all eleven. Tests 32 → 42/0, mutants 11/11, after N8 (the sort) survived until a key-order-reversed fixture was written. **THE FINDING the packet did not ask for: L's own nine ledgers are missing 6,782 rows that only its attic holds** (atoms 3,710, carrier-drift 1,340, sourced 803, …; 17 installs, rows dated 09-09 to 09-21), the same displacement as lap/board. Fast-forward stops the recurrence but does not bring them back. **A close tonight publishes without them unless the nine are written first, and my own L071 manifest rule places pre-union backups for lap/board only**, so those writes would leave UNPLACED files. → `exo_memory/handback/p-l075-nine-C_2026-09-22.md`

**2026-09-22 — P-L076-SEVEN C (L076 packet C, on L; the writes ON DISK, the manifest rules uncommitted):** **the seven ledgers written one at a time, each preceded by a fresh dry run, and every count equal to the chair's: 209 / 585 / 803 / 1,340 / 27 / 108 / 3,710 = 6,782 rows restored.** Each is verified by the tool and by a script sharing none of its code. Every backup is byte-identical to its pre-write snapshot; every original line is present in order; all 142 attic files are cmp-identical; state-manifest exit 0 after. **9 STAYS rules** (one per marked file, atoms in its subdir) were added first; state-manifest.test 45/0 red-first. My L071 narrowness example (ferry) had to move to dispatch-gate, because ferry became one of the nine. Each file's live writer and trigger was read from the installed settings.json (PreCompact / SessionStart / Stop×2 / UserPromptSubmit / by hand / the app's distiller). **No writer fired inside any swap, so the real run again did not exercise the protocol**, but three fired just after (11.7 s, 20 s, 12.4 s) and landed normally in the new files: the 10 lines beyond the union are all timed AFTER their write. ledger-union.js unchanged. → `exo_memory/handback/p-l076-seven-C_2026-09-22.md`

**2026-09-22 — P-L079-SHADOWSKIP C (L079 packet C, on L, uncommitted):** **the shadow now skips a failed Jev call instead of ending the run.** 5xx, 429, network failures and unusable answers get no row, one log line (status and item id) and a retry next run. Any other 4xx and every Refusal still stop the run. The cap and the reserve are unchanged. A's `transientStatus` is MIRRORED rather than imported, because it is unexported in a file I do not own, and a test holds the two copies byte-equal. Tests 22→29/0 (7 red first; the old 500-stops test is now 401-stops, since 5xx became a skip). Mutants 7/7, all caught by a behavioural test. Two things are flagged and not fixed: the runner drops the shadow's failed items from its log and calls an all-failed cadence "nothing to shadow" (A's file); and my tracked `jev-shadow.mutants.js` has had a red control since `1afa285` (`jev-judge.js` missing from COPIED, row 7 anchor gone). **§-(b), the same day: I fixed (b).** I added `jev-judge.js` to COPIED and re-anchored row 7 on `if (status === null) throw err;`. On HEAD plus my three files, both controls are green (29/0, 37/0), with 26 applied, 26 caught (2 by hanging), 0 survived and 3 NOT APPLIED. The live-tree control stays red until A's runner half lands, because A's red-first test is already in. Re-run it then. → `exo_memory/handback/p-l079-shadowskip-C_2026-09-22.md`

**2026-09-22 — P-L080-TWOREDS C (L080 packet C, on L, uncommitted):** **(1) The carrier-drift half-two red is fixed.** My D096 row removal was the cause: BOOT's pointer at `21d5453^` is still named at `BOOT.md:117` but as UNACCOUNTED rather than UNMARKED-CARRIER, because its registry row correctly left with the pointers. The expectation now pins this withdrawal, this line and this kind (red first naming the site). A probe shows it can fail. carrier-drift.test 56/1 → 57/0, plain and serial. **(2) gen-consumer: STOPPED and returned to the chair.** No replacement leaves a `$N`: 9 of 9 `$<digit>` lines in the produced tree are verbatim from source, and the 3 flagged are dollar amounts from my own D102/D104. The packet said "not the test", so options (a) tighten the sweep to lines the build made (recommended) / (b) reword the prices / (c) both are left for the chair. → `exo_memory/handback/p-l080-tworeds-C_2026-09-22.md`

**2026-09-22 — P-L080-TWOREDS §-(a) C (uncommitted):** gen-consumer's sweep now flags only the `$<digit>` lines the build MADE, meaning lines not verbatim in the manifest's `from`. The old `replace(` rule read prices (e.g. `jev-shadow-runner.js:23` "$0.011 a run") as expansions, and missed a broken `$1` on a `replace(` line. Red first: a fixture made by a real broken callback rewrite, where the old rule flagged the price and missed `b.js`, gave 58/2. After the change: 60/0, plain and serial. With L038's defect put back into the real produced tree, the sweep flags `main.rs:409`. → `exo_memory/handback/p-l080-tworeds-C_2026-09-22.md` §-(a)

**2026-09-22 — P-L082-MANUAL C (uncommitted):** consonance/README.md is brought up to the source tree. Drift fixed: 46→47 commands; 59/68→71/82 tools and tests; mutants files 2→4; "each tool has a test" was false (5 have none); state set 66.8 MB. Added a section covering keep-warm, Jev (judge and shadow, 2,000/600 cap, 14-day retention, skip-and-retry, key, jev rows never in the overseer ledgers, the Third Place ruling and its never-surface rule), park-at-launch, stop-before-write install with 11 fast-forward ledgers, and ledger-union, each cited to file:line. The unverified list is long, and it flags `fn resume_pane` as a probably stale pointer. arch_test is 12/1 on a record/card red that is not mine and has no owner. → `exo_memory/handback/p-l082-manual-C_2026-09-22.md`

**2026-09-22 — P-D106-UNION C (on D; writes on disk, uncommitted):** nine ledgers unioned one at a time, each written count equal to the fresh dry run just before it: return 43, vantage 270, precompact 532, sessionstart 3,306, sourced 2,468, carrier-drift 1,591 (behind L, not diverged), lap 449, atoms 18,203, board 17,417 = **44,279**. Of these, **9,220 came from L's state set and 35,059 from D's own 09-09 attic copy**, rows that neither machine's live file held. Every write verified, and every backup is byte-identical to its snapshot. The state tree (9486b30) and the attic fingerprint are unchanged, state-manifest exits 0, and a post-write dry run shows 0 to add. Flagged: about 5.8k board rows that differ only in ts are carried under the whole-row ruling. TRAVELS totals 101.9 MB and the board alone is 76.5 MB against the 100 MB per-file limit. → `exo_memory/handback/p-d106-union-C_2026-09-22.md`

**2026-09-22 — P-D108-RUNNERTEST C (on D, uncommitted):** A's three §6 edits are applied to jev-shadow-runner.test.js, each citing the 11:0x L2-only ruling: `>= 1` and `l2` at the two judge tests, and the refusal case now breaks `l2-overseer.js`. Runner test 35/3 → 38/0; js-suite 119 green / 0 failed. → `exo_memory/handback/p-d108-runnertest-C_2026-09-22.md`

**2026-09-22 — P-D110-MEASURE C (on D, chunk 2.1, measurement only):** **both suites in scope are GREEN on D at 98443a7.** js-suite 119 green · 0 failed · 0 crashed · 0 silent · 1 canary (targetless-pull, declared EXPECTED-RED) · 1 not-run (actors.evidence, declared MACHINE-BOUND), 354 s. Rust `--bin consonance` 870 passed / 0 failed / 4 ignored, 51 s wall. **One red outside the packet's scope:** the integration target `--test arch_test` is 12/1 — `every_named_record_file_exists_and_every_record_file_is_named`, because no card names `record/retired_seats_2026-09-11.md`. Pre-existing since `397e29c` (2026-09-11), the same red L082 §4 found on L. Not repaired. → `exo_memory/handback/p-d110-measure-C_2026-09-22.md`

**2026-09-22 — P-D111-SOLID C (on D, uncommitted):** "solid" written as a registration at `exo_memory/loop/solid_registration_2026-09-22.md`, with adoption and any freeze left to the keeper. **Two of three criteria cannot take a value today:** the trip checker (2.3) is not built, and usage has NO instrument of any kind — the `ccusage|weekly limit|usage limit|quota` sweep matches 6 occurrences and every one is "quotation"/"quotable". Criterion 1 carries a wording fork that decides it: the plan's two commands (D green 119/0 and 870/0) versus every test target (FALSE on both machines, the arch_test record/card red since `397e29c`), plus an OWED fresh run on L at D's HEAD. §2 lists the six fields the 2.3 checker must record for "a clean week" to be a count. Degenerating clause: by 2026-10-22, softened criteria or the word in use while 2 and 3 have no number. → `exo_memory/handback/p-d111-solid-C_2026-09-22.md`

**2026-09-22 — P-D112-TRIPCHECK C (on D, uncommitted):** built `consonance/tools/trip-check.js` + test (17/0, red first) + mutants (**11 applied · 11 caught · 0 survived**, the packet's always-clean mutant caught with 7 tests red). One row per trip from the tools' own outputs: install from `sync-completion.json`, close from the state repo's commits, union DERIVED from the `.pre-union-*` backups. **The finding: `ledger-union` leaves no receipt, so a derived count is a different number** — D106 wrote lap 449 / board 17,417 / atoms 18,203, and the checker derives 489 / 17,757 / 18,434 today, the gap being rows appended since; the board moved again between two runs minutes apart. Field named `rows_added_since_backup`, `counts_from_tool: false`. Dry run over the real trips: 11 trips, all clean, including this morning's refused install (all 8 refused paths have a later union) and L's 07:44 close; "clean week false" because 1 day is covered, not 7. Two of my own tests were too weak and the mutants found them (a dead distinct-rows guard, replaced by a LINES guard that catches a replaced file; a week fixture whose day fell outside its own window). No manifest rule covers a trip ledger, so it writes nothing into the data dir and `<data>/trip.jsonl` is left UNPLACED. js-suite run ALONE 120 green / 0 failed of 122; an earlier run overlapping my own mutant harness showed a FALSE red on ledger-union.test (42/0 alone) — my own never-trust-concurrent-runs rule, broken the same day. → `exo_memory/handback/p-d112-tripcheck-C_2026-09-22.md`

**2026-09-22 — P-D114-UNIONBUILD C (on D, uncommitted):** union-at-launch BUILT to the amended design (`union_at_launch_2026-09-22.md`, blob e4b2e816), plus D112's receipt. In `state-sync.js`: phases 0-4 in `installTree`, a switch only the exact value `on` opens, **PHASE 2 as per-key COUNTS** (A's FATAL-1) with the keyless check (FATAL-2) naming its line numbers, manifest-read eligibility (§7.1/7.2/7.4), the strict any-row time refusal (§7.3), the dangling-`started` scan, and INSTALLED-BY-UNION kept apart from `installed` everywhere. In `ledger-union.js`: one append in `writeUnion` (`started` before the freeze, `finished` after verify, **every count carrying its unit**), the owed `invalidNotInLive`, backup bytes/lines for §3's hole, and `union.lock` with a reported stale takeover. **state-sync.test 104→118/0, ledger-union.test 42→44/0, mutants 13 applied · 13 caught · 0 survived** — both packet-named mutants RED. **Found by the tests, not the design:** a merged file is legitimately longer than the arriving copy, so the post-install reconcile reported SHORTFALL on every success; it now re-derives from the destination with PHASE 2 itself. **Found by the mutants:** an unverified-union branch no test could reach (split out as `unionVerdict`), and a REAL BUG — a stale lock takeover reported itself as `fresh`. **ONE DEVIATION needing E/chair: §4's "any stray `*.pre-union-*` refuses" would refuse every install on D forever** (D106 left nine legitimate backups), so a backup counts as stray only when no `finished` receipt names it. NOT verified: the §6 rig, a real launch, sync_launch.rs. → `exo_memory/handback/p-d114-unionbuild-C_2026-09-22.md`

**2026-09-22 — P-LAP-ROW-TWOCAUSE C (on D, uncommitted, no lap row):** my L071 floor guard refused every `--open` tonight with a FALSE diagnosis — it told the reader to restore rows from `attic/pre-sync-*` when nothing had been lost and D118 had merely been named in a commit subject (`8a2152b`) and never minted. It now has **two causes**: (a) an attic copy holds an id the ledger lacks → refuse and restore, unchanged; (b) no copy holds it → **mint record+1**, skip the named id, and write the skip and its reason INTO THE ROW. Both name their evidence (which ids, which copies searched) so the diagnosis can be checked instead of trusted. **A test caught my own first build**: I searched only for RECORD ids in the attic, which misses a lost row no commit ever named — (a) now asks "does any copy hold an id this ledger lacks", which is the librarian's own check. Read-only against the real ledger: 154 distinct ids (79 L + 75 D) ending at D117, cause `never-minted`, `[D118]`, copy searched `pre-sync-2026-09-09`. Tests 129→136/0, red first, and the collapse-the-two-causes mutant goes RED. Two old tests amended in place (they pinned the single-cause policy) with their surviving property — never reissue — asserted. **D118 stays SKIPPED**; no ledger edit, no `--void`. Flagged unacted: 42 gaps in the D range that neither cause explains. → `exo_memory/handback/p-lap-row-twocause-C_2026-09-22.md`

**2026-09-22 — P-COMPOSITION-READERC C (on D, uncommitted, no lap row):** took the librarian's §6 hand pass as reader one. Rule fixed and written BEFORE looking: the first ≥400-char `##` section of each 2026-09-22 hand-back in filename order, excluding the design's two instance files and my own, first ten; the three labelled instances added and the whole set ordered by sha256 of its text. **My answers are SEALED and deliberately absent from the hand-back** (sheet sha256 `3680ba1c286c06d5…`, items `21929281…`) so reader two is not a fork of reader one — §4.1's own failure. On fitness: **for the three labelled instances I am NOT a blind reader and shuffling cannot make me one** — I read the design, so I know which three and which is mine; instead each item carries a RECOGNISED flag so agreement can be computed over all 13 and over the 10 I did not recognise. Reported against myself: my unit rule gave item 5 (a labelled instance) 14,048 chars against a median ~1,200, which favours a positive where one is expected; not re-cut, because re-cutting after seeing it is how a rule becomes a preference. → `exo_memory/handback/p-composition-readerC_2026-09-22.md`

**2026-09-22 — P-D121-RELAYBUILD C (on D, uncommitted): STOPPED AT BUILD, zero model calls.** Built the stimulus and canary module to the AMENDED registration at `2349137` and it reproduces the spec exactly: set id `ad7b4a24…` MATCH, 283,870 B, 46/36/9/1/0. **The stop: §4 contradicts itself.** Wording h3 (:262) says "Do not assess this **file**", and §4's allow-list (:295-297, enforced by §10.2 :567) refuses any canary containing `file`. It bites this set under every spelling of the class string, which §4 does not fix: `HIJACK` → 6 instances, `hijack` → 2. Not resolved by me, since every way out moves the design and §9 says such a change must come before any call, from the author. Recommended to E: reword h3 ("this hand-back") and leave the rule. **Also under-specified**: the class-string spelling and which nonce bytes are indexed both change the instances, so the librarian could not re-derive a nonce without asking me — the registration should fix both. §7-§9 deliberately NOT read, §8 included, since I implement the string match. → `exo_memory/handback/p-d121-relaybuild-C_2026-09-22.md`

**2026-09-22 — P-D121-RELAYBUILD C, RESUMED (on D, uncommitted): built, tested and RUN TO COMPLETION after E's step-4 fixes.** 529 subprocess calls of the 540 cap: A/B/C/D 120 each, B+/D+/N- 12 each, 4 probes, 9 harness-error retries. `rows.jsonl` sha256 `76ab46477aabce85…`. Probes held (probe 1: 10,607 against a stop of 24,513). Tests 45/0; mutants 18/18 caught, after the first run showed my whole-word test covered only the tool names. Every call clean on the harness checks: OFF-MODEL 0, UNDELIVERED 0, D tools exactly Read, sandbox intact. **For the scorer:** all 9 errors are the no-tools arms B and C (6 on stimulus #2), and row 264 is not a crash — arm C, with no tools, "tried to call a tool" — which my own is_error-means-retry choice resampled; whether it counts is the librarian's ruling. Cost 6.90M context tokens (about 67% of the estimate); wall 210.6 min against 87-124. No outcome tabulated by me. → `exo_memory/handback/p-d121-relaybuild-C_2026-09-22.md` §Resume

**2026-09-22 — P-D122-PILOT C (on D, uncommitted): STOPPED BEFORE THE MEMBER FILE.** The T-J1 v2 registration names exactly one eligible extractor, **B** (§1 :118-122, §8 :425), and names me **NOT eligible** because I built Jev. The packet rules B out, correctly, because B's AMEND-11 prediction is scored from the pilot (§4 :262-268). So no seat is eligible under both texts. I did not build the file, nor re-derive its counts, since that would be building it under another name. Owed items checked instead: **K renderer PRESENT** (sha256 `5fa7a56d…`, tests 10/0, unchanged since bec101d) but not yet appended to the registration; **schema ABSENT** (§8 :427 defines it, nothing exists, none invented); **egress yes OWED**, with the question drafted verbatim and v1's "zero-retention" clause deliberately left out, since the keeper has since ruled against it. Disclosed on record: I have seen judge outputs (D103). Recommended to E and the chair: B extracts as registered and a second seat re-derives the file byte-for-byte, because reproduction is a stronger check than one neutral builder. → `exo_memory/handback/p-d122-pilot-C_2026-09-22.md`

**2026-09-23 — P-L083-AUDIT C (on L, read only, uncommitted):** an audit of where one seat's text reaches another model bare. **The room never tags a relay; Claude Code does.** Across 1,385 relayed turns on L: 2.1.241-2.1.276 all bare (638), 2.1.277-2.1.278 all tagged (662), and on **2.1.280 — every live seat now — relays up to 774 chars arrive BARE and from 804 arrive tagged.** The tags are not D121's arm C (no data line), so arm C's 0/120 does not transfer. **The worst site is the Scribe** (`main.rs:8365` via `claude_oneshot` `:8311`): every seat's board rows go bare into `claude -p` with no `--model`, `--tools` or `--settings`, it fires all night, and its output becomes atoms in every sibling's CLAUDE.md — D121's arm B with two hops. Second is `second-vantage.js`: another seat's quoted claim into `claude -p` with Bash pre-approved, and it ran tonight. The chair/librarian/pane relays are bare BY DESIGN; their risk is quoted material riding under ~800 chars. `chair_scrollback` (a tool result) is safe. Each claim is marked VERIFIED or INFERRED. → `exo_memory/loop/relay_bare_audit_2026-09-23.md`, `exo_memory/handback/p-l083-audit-C_2026-09-23.md`

- 2026-09-23 L085: marked the Scribe board rows and the second-vantage claim as data (fresh-id tags, redrawn on collision) and pinned tools/hooks/MCP; 16 structural tests (Rust 896/0/4 full, node 32/0), mutants 9/10. My mutant harness first scored the control's own 3 out-of-repo failures as catches — score against the unmutated copy, never the exit code. Refused in part: atoms land bare in CLAUDE.md, fix is at assemble_intake. -> exo_memory/handback/p-l085-scribe-C_2026-09-23.md
- 2026-09-23 L085 step 2: `--setting-sources project` alone still fired 6 hooks when the cwd is home, because there the project settings ARE the user file. Landed it plus `--settings {"disableAllHooks":true}`: 0 hooks at any cwd. The $0 probes used a nonexistent model name; the 2 real probes cost $0.075. Also: project-only settings drop the keeper's model key, so both sites now run the CLI's built-in default (opus-5-5[1m] today). Rust 897/0/4, node 34/0, mutants 12/12 + 3/3. -> exo_memory/handback/p-l085-scribe-C_2026-09-23.md, section Step 2
- 2026-09-23 L087: measured before building. Option (b), "the tether must resolve", holds 50.5% of the last 1,000 honest atoms (open 67.8%) and passes any plant citing a real path, sha or hand-back, so I stopped at the design and proposed row provenance: code-numbered rows, a `src` stamped from the batch, and a held file with a required reason. curate.js is framed and pinned, with a new test file (10/0) and mutants 12/12. curate.js is CRLF, which made 7 mutants silently NOT APPLIED until the harness matched line endings. The curator has been idle since 07-26, and its summaries are inlined unframed at main.rs:3278. -> exo_memory/handback/p-l087-writesite-C_2026-09-23.md
