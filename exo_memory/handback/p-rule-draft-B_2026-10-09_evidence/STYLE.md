# D277 part 3: the rule-layer rewrite, shared style guide (pane B, the one author). Every per-file pass follows this exactly.

## What you are making
A DRAFT of one instruction file, written to `C:\Users\nname\Desktop\worktrees\b-rule-draft\exo_memory\loop\rule_draft_2026-10-09\<NAME>.draft.md`
(the folder is NOT beside the originals on purpose: a `.draft.md` inside `consonance/src-tauri/brief/` is read by identity-diff as wake material and
turns it red). Plus a LEDGER `<NAME>.ledger.md` in the same folder. Write nothing else anywhere. Read-only everywhere else. Never open, read, quote
or grep anything under a `third_place` directory, and never open `brief/THIRD_PLACE.md`.

Inputs:
- the original file (read it whole);
- C's census: `C:\Users\nname\Desktop\lighthouse\exo_memory\loop\instruction_load_census_2026-10-09.md`, with its address list `…rules.tsv` (every
  candidate RULE block, `path`, `line`, PROHIB/POSITIVE, why/NO-WHY) and `…blocks.tsv` (every block with its class). The census classifier is about
  65% precise and misses about 20% of rules hidden in ROOM blocks, so read the file itself; the TSVs are a guide, not the truth.

## How to treat each block of the original
- **RULE** (an instruction to the seat): rewrite it in the voice below, with a one-line why. Merge duplicates into one rule.
- **RATIONALE for a rule** (the amendment story, the measurement, the keeper's quote that justifies a rule, "Ground 1/2/3", "AND THE MEASUREMENT THAT
  FORCED IT"): collapse it into that rule's why line, as a citation to where it lives: a record path (`exo_memory/journal/…`, `exo_memory/loop/…`,
  `exo_memory/librarian/…`), with a line or date where the original gives one. Cite, don't restate. Keep a short verbatim quote of the keeper only when
  that quote IS the authority for the rule (e.g. the push rule), and keep it to one line.
- **SUPERSEDED rules kept "as a trace"** (a rule followed by its own repeal or amendment): write only the rule as it stands now; the trace lives in git
  history and the dated record. Name the date of the amendment in the why.
- **PRINCIPLE / IDENTITY text** (who the seat is, the room's stance, with-you-not-above-you, the company-not-consolation material): keep VERBATIM,
  except remove capitals used for emphasis. Do not prune it. If unsure whether a block is principle or rationale, keep it verbatim and say so in the
  ledger.
- **REGISTERED FALSIFIERS / instruments** (a falsifier, a command that checks a rule): keep, one short line each, with the command and where it was
  registered.
- **"This is wrong" is a valid outcome.** If a rule is wrong, stale, or false on this machine, drop or fix it and say why in the ledger.

## The voice (one voice across all files)
- Second person, present tense, plain words. "You" is the seat reading the file.
- **Positive:** say what to do. "Commit by named paths in your own worktree", not "do not commit with -a". Use a prohibition only when no positive
  form says the same thing, and then plainly ("Leave Third Place files unread").
- **Each rule has a why**, on the same bullet after "Why:" or as one indented line. One line, not a paragraph. If the why is a measurement, cite it.
- **No capitals for emphasis.** No MUST/NEVER/ALWAYS/CRITICAL/IMPORTANT, no ALL-CAPS phrases, no "AMENDED", no "THE RULE". Allowed: proper names and
  acronyms (D276, ASK-008, MCP, NSIS), file and tool names (`BOOT.md`, `SOURCES:`, `NEXT:` as field names in backticks), git refs.
- **Bold only for headings or a rule's first few words if that helps scanning;** never bold whole sentences for emphasis. Aim for under one bold span
  per rule.
- Short sections with plain headings. Bullet rules. No struck-through text, no "(struck …)" history.
- Shorter is better when nothing is lost. The target is the same rules in far fewer words, not fewer rules.

## Canonical homes (deduplicate ACROSS files: a rule lives in ONE file; other files point to it in one line)
- `COMMITTEE.md`: everything a PANE does: worktrees, commits by named paths, red-first tests, fixing the implementation not the test, the heavy-run lock,
  hand-backs (what they hold), ringing the librarian, no junctions in a handed-over worktree, the credential rule (never quote a token or key).
- `BUILDING.md`: everything the CHAIR (orchestrator) does: dispatch, laps and the baton, landing order (commit before dispatch), collation of pane work,
  pushes and publishing (only on the keeper's word, after the credential scan), questions to the user inside a lap, the dev/consumer split.
- `LIBRARIAN.md`: the librarian: rulings, collation of hand-backs into the plan, notes, the publish of the consumer, cite-don't-recollect.
- `CLAUDE.global`: general engineering practice for every project on this machine (tests, scope, errors, patterns, dependencies, safety, security,
  changelog, autonomy). It must stay valid for non-room projects too. It gets ONE line saying that inside the committee room the briefs decide
  committing, asking and test timing (contradictions 3, 4, 5 below).
- `CLAUDE.project` (lighthouse/CLAUDE.md, 512 B): keep tiny.

## Keep (the work checks need these) and drop (paperwork ceremony D276 scored as catching nothing)
Keep, each as a plain rule with its why:
- tests red first, then green; fix the implementation, never weaken a test; amend a test by name, with a comment, only when its rule changed;
- run node and cargo test runs under the heavy-run lock (`consonance/tools/heavy-run.js`), so suites don't starve each other;
- parity of the generated consumer tree; the landing order; commit by named paths; push only on the keeper's word, after the credential scan;
- no junction in a worktree you hand over; never quote a token or key; leave Third Place files unread.

Drop or demote to a convention, and FLAG each in the ledger as `DROP (D276)` with the cite
`exo_memory/loop/loop_friction_B_2026-10-09.md` (paperwork gates: 0 catches in 38 refusals) and `exo_memory/loop/loop_friction_measure_2026-10-09.md`
(E: 4.0% of re-sends fixed a claim, 10.0% blurred a specific):
- the SOURCES line's exact-wording requirement: becomes "list what you read or ran for this message" (E is reworking the gate to match what was run,
  behind a switch the keeper flips: say "when the keeper switches the gates" where the live behaviour differs);
- the NEXT trailer's strict grammar: becomes the convention "end a hand-off with who acts next, and when";
- the reply slot's Sources requirement: becomes a warning (same switch);
- required defensive sections in hand-backs ("does not establish", "my own fault" headings): becomes "record corrections plainly when there are any".

## The six contradictions (C's census §4): resolve each exactly so, and NAME it in a final section "Contradictions resolved" of the file it lands in
1. **Who commits (COMMITTEE:113, :210 vs :117, :240-241).** The 2026-08-26 amendment wins: a pane commits by named paths in its own worktree; the chair
   lands on main. Why: it is the practice every lap since uses, and a seat must not read a rule and its repeal in one file. (COMMITTEE)
2. **Librarian commits (LIBRARIAN:170 vs :173).** The 2026-08-26 amendment wins: the librarian may commit its own files by named paths. (LIBRARIAN)
3. **Asking the user (global :86, :92 vs BUILDING:758-778).** Both survive, scoped: inside a lap, the chair does not stop to ask the user, and instead
   finds the keeper's prior word and proceeds (BUILDING:778), because a question parks the chain; outside a lap, and for any keeper-owned call (a push,
   a delete, a release, a licence, an irreversible change), ask. The global file gets the scoping line. (BUILDING + CLAUDE.global)
4. **Running the suite before reporting (global :3 vs BUILDING:178, :189).** Both survive, scoped: a pane runs the tests that cover its change, under the
   lock, before it hands back; the collator runs the full suite before it lands or reports success to the keeper. "Before reporting success" means
   before the landing report. (COMMITTEE + BUILDING + CLAUDE.global)
5. **Committing at all (Claude Code's tool text "commit or push only when the user asks" vs the room).** Resolved in our text by stating the keeper's
   standing authorisation: in this room, committing by named paths in your own worktree is authorised for every lap; pushing is not, and still needs
   the keeper's word. We can't edit the system prompt; this sentence is the answer to it. (COMMITTEE, referenced from BUILDING and CLAUDE.global)
6. **A false path (LIBRARIAN:160 `C:/Consonance/lighthouse/…`).** Fact fix: the repository is the one `room_path` in `~/.consonance.json` names (on
   machine D, `C:\Users\nname\Desktop\lighthouse`). (LIBRARIAN)

## The ledger (`<NAME>.ledger.md`)
A table, one row per block of the original that you changed, merged, moved, cited or dropped (unchanged principle blocks need no row; say how many
there were):
`original lines | class you gave it | outcome (rewritten / merged into rule N / cited / moved to <file> / dropped) | flag (DROP (D276), WRONG, FACT-FIX, CONTRADICTION n, or none) | note`.

## Your final message
Plain text: the draft's path, the ledger's path, the number of rules in the draft, the blocks rewritten/merged/cited/dropped, every DROP and WRONG
with one line each, and anything you were unsure of. No preamble.
