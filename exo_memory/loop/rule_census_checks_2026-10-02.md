# D210 — the rule census CHECKS, for E (step 2). Pane C, 2026-10-02, on D

**For the measuring seat. This file carries rule ids, each rule's text, and a mechanical check. It deliberately carries no
classification of the rules.** The plan is `loop/plan_rule_census_d210_2026-10-02.md` (lighthouse `b0862f0d`), step 2.

**Common to every check:**
- **Window:** 2026-09-28T00:00 → 2026-10-02T23:59 (local, Regina), machine D. A rule whose first source line is dated inside the
  window counts only from that date (each rule below is older than the window unless noted).
- **Sources:**
  - **hand-backs:** `exo_memory/handback/*.md` with a date in the window in the filename;
  - **transcripts:** the seats' main transcripts under `C:\Users\nname\.claude\projects\C--Consonance-instances-<seat>\*.jsonl`
    (chair = `main`, librarian = `librarian`, panes = the `sibling-*` folders);
  - **the board:** `C:\Consonance\data\board.jsonl`;
  - **the lap ledger:** `C:\Consonance\data\lap.jsonl`;
  - **git:** `git log` of the lighthouse repo (`C:\Users\nname\Desktop\lighthouse`) and the t180 repo
    (`C:\Users\nname\Desktop\t180-track-builder`).
- **Messages:**
  - a **dispatch** is a `chair_inject` tool call;
  - a **ring** is a `call_librarian` (panes) or a `call_chair` (librarian) tool call;
  - count what was **sent** (the tool_use input). Where a refusal and a re-send both appear, count the first attempt, and report
    refusals separately.
- **Report one number per rule:** followed / applicable, with the command beside it. A rule whose check you cannot run mechanically is
  **NOT MEASURABLE**, never estimated.
- **Rule text is quoted or closely paraphrased from its source;** the source line is given so you can read it there.

---

**R01** — *A dispatch's last non-empty line is a NEXT trailer naming a station and a condition.* (BUILDING.md :212)
Check: over dispatches, the last non-empty line matches `^NEXT:\s+\S+.*\bwhen\b`. Report first attempts, and count board rows with
`pane` = `trailer-gate` that name the chair.

**R02** — *When a dispatch's trailer names a plan item, it is written as a default: "… plan default after it: <item>, unless the
output says otherwise".* (BUILDING.md :240; from 2026-09-23)
Check: over dispatches whose NEXT line mentions a plan item after the station clause (text after `when …`), the line contains
`plan default` and `unless the output says otherwise`. Applicable = dispatches whose NEXT line has more than the station + `when`
clause.

**R03** — *A dispatch carries the object to measure against: an openable path, file or commit, not only a description or a question.*
(BUILDING.md :197; COMMITTEE.md briefing 1)
Check: the dispatch text contains at least one of: a filesystem path that existed at send time (`git cat-file -e` / file exists), or
a 7–40 hex sha that resolves in the lighthouse or t180 repo.

**R04** — *Every figure in a dispatch has the command that backs it beside it.* (BUILDING.md :198)
Check: per figure (a number with a unit, a ratio N/M, or a percentage) in a dispatch, the same line or the next has a command (a
backticked token starting with `node `, `git `, `grep `, `cargo `, `sha256sum`, or a `path:line`). Report figures with / figures.

**R05** — *A dispatch names the files the receiving pane owns.* (BUILDING.md :200)
Check: the dispatch contains `OWN` / `own` followed within 200 characters by at least one path (e.g. a `FILES YOU OWN:` field).

**R06** — *A dispatch says plainly that the answer may be negative.* (BUILDING.md :201; COMMITTEE.md briefing 4)
Check: the dispatch contains one of: `may refuse`, `You may refuse`, `can refuse`, `default to refuted`, `may come back negative`,
`NOT GREEN`, `do not build`.

**R07** — *A dispatch names the dossier row (`librarian/DOSSIER.md`) that matched this seat to the work.* (BUILDING.md :203)
Check: the dispatch contains `DOSSIER` or `dossier`.

**R08** — *A dispatch's hand-back leg asks for the map line.* (BUILDING.md :205)
Check: the dispatch contains `map/` and `C.md|A.md|B.md|E.md|<letter>.md`, or the words `map line` / `to your map` /
`exo_memory/map`.

**R09** — *A dispatch registers its falsifier, or names the unwelcome outcome, before the work.* (COMMITTEE.md briefing 2–3)
Check: the dispatch contains `falsifier`, `FALSIFIER`, `REGISTERED`, `unwelcome`, or `would show` / `would mean … wrong`.

**R10** — *A brief states the briefer's own bias where it knows one.* (COMMITTEE.md briefing 6)
Check: the dispatch contains `bias`, `my stake`, `I expect`, or `I lean`. **Note:** absence does not show a known bias was hidden.
Report presence / dispatches, and say so.

**R11** — *A lap row that hands the baton to another seat comes after an audited ring, and carries `--by <writer>`.* (BUILDING.md
:261)
Check: in `lap.jsonl`, rows whose holder ≠ the writer have a `by` field, and a board ring row from that writer at or before their
`ts`. Also count `lap-row.js` refusals in transcripts (tool_result containing `refused` from `lap-row.js`).

**R12** — *On a lap that has a map, an `opened` row is written before its `dispatched` or `filed` row.* (BUILDING.md :271)
Check: in `lap.jsonl`, for each lap with a `map` row, the first `opened` row's ts < the first `dispatched` row's ts.

**R13** — *A dispatch is sent only after the turn's message to the user is written: in the same turn, the message text precedes the
call.* (BUILDING.md :295; COMMITTEE.md and LIBRARIAN.md "The hand-off is yours to make")
Check: per `chair_inject` and per librarian `call_chair`: within the same assistant turn (between two user prompts), at least one
assistant `text` block of ≥ 200 characters comes before the tool_use, and no text block of ≥ 1000 characters comes after it. The
method of `loop/turn_boundary_detection_2026-08-25.md` may be reused.

**R14** — *A seat dispatches or rings only while it holds the baton (the chair to dispatch, the panes to ring the librarian, the
librarian to ring the chair).* (BUILDING.md :261)
Check: over dispatches and rings, the call is not answered with `OUT OF TURN` (tool_result text). Report out-of-turn results / calls.

**R15** — *A dispatch of a task with an answer key carries its sealed row, and the row is on origin before the dispatch.* (COMMITTEE.md,
the seal-row exception)
Check: over dispatches with a `seal` argument, or naming a path under `exo_memory/loop/` with `#` (`<row>.md#<task>`), the tool_result
is not a seal refusal and `git log origin/main` holds the row file before the dispatch ts. Applicable = dispatches that declare a
key.

**R16** — *No question is put to the user while a lap is open.* (BUILDING.md :733)
Check: over the chair's assistant text messages sent while a lap is open (between a lap's `open` and its `filed` rows in
`lap.jsonl`), the share whose last sentence ends with `?` and is addressed to the user (not inside a dispatch). Report messages
without a closing question / messages in open laps.

**R17** — *Inside an open lap, the chair commits no edit that no pane's hand-back names.* (BUILDING.md :774)
Check: over lighthouse and t180 commits whose time falls inside an open lap (`lap.jsonl`) and whose body names the chair as writer
(or that the chair's transcript shows it made with Edit/Write on the committed paths), each committed path appears in a hand-back
filed in that lap.

**R18** — *Every consumer commit carries a `Source-Sha:` trailer that resolves in the private repo.* (BUILDING.md :950)
Check: the BUILDING.md :955 loop over the consumer repo's commits in the window. Prints nothing when followed. If no consumer
checkout is on D, NOT MEASURABLE.

**R20** — *A hand-back reports mutation results as `applied N / caught N / NOT APPLIED N`.* (BUILDING.md :406)
Check: over hand-backs that mention `mutant` or `mutation`, the file contains `applied` and `caught` and `NOT APPLIED` (case as
written).

**R21** — *Every number in a hand-back has the command that re-derives it beside it.* (BUILDING.md :408)
Check: per figure in a hand-back (as R04), a command or `path:line` on the same line or the line after. Report figures with /
figures (a sample of files is acceptable if stated).

**R22** — *A hand-back has a section saying what was NOT verified.* (BUILDING.md :409)
Check: the file contains a line matching `/not verif/i` or `/did not verify/i` or `/NOT verified/`.

**R23** — *The hand-back is written to `exo_memory/handback/<packet>_<date>.md`.* (BUILDING.md :417)
Check: over the pointers in `call_librarian` messages, the path named matches `exo_memory/handback/[^/]+_\d{4}-\d{2}-\d{2}\.md`.

**R24** — *The `call_librarian` carries the pointer and a one-line orientation, never the finding itself.* (BUILDING.md :414)
Check: over `call_librarian` inputs, the text contains a path, and, excluding the NEXT line, has at most 2 non-empty lines and at
most 300 characters.

**R25** — *The `call_librarian` is made in the same turn the hand-back file is written.* (BUILDING.md :411; COMMITTEE.md hand-off)
Check: over `call_librarian` calls, a Write/Edit/Bash write of the named hand-back path occurs earlier in the same assistant turn.

**R26** — *One line is appended to the pane's own `exo_memory/map/<letter>.md`, pointing at the hand-back path.* (BUILDING.md :419)
Check: over hand-backs, the map file of the pane that wrote it contains the hand-back's filename (or path), added within 24 h of the
hand-back (file mtime / git log -p of `exo_memory/map/`).

**R27** — *A pane's `call_librarian` ends with a NEXT trailer naming a station and a condition.* (BUILDING.md :440)
Check: as R01, over `call_librarian` inputs. Also count board rows with `pane` = `trailer-gate` naming a pane.

**R28** — *The librarian's `call_chair` ends with a NEXT trailer naming a station and a condition.* (BUILDING.md :440; LIBRARIAN.md
:283)
Check: as R01, over the librarian's `call_chair` inputs.

**R29** — *The librarian's collation `call_chair` carries the line `OUTPUT → NEXT: changed` or `unchanged`, with a reason, directly
before its NEXT trailer.* (BUILDING.md :456; from 2026-09-23)
Check: over the librarian's `call_chair` inputs that collate hand-backs (they name a hand-back path), the second-to-last non-empty
line starts with `OUTPUT → NEXT:` or `OUTPUT -> NEXT:` and contains `changed` or `unchanged` followed by more text.

**R30** — *A claim about state carries `checked: …` or `inferred: …` where it would otherwise read as checked: a figure, a verdict, or
a "so …".* (BUILDING.md :480; from 2026-09-27)
Check: per claim (the claim extraction of `loop/claim_base_rate_registration_2026-09-27.md` §2 may be reused), the line or its parent
matches `/\b(checked|inferred):/`. Report labelled / claims, and files with ≥ 1 label / files.

**R31** — *A hand-back records the pane's corrections, including the ones to itself.* (COMMITTEE.md, what a hand-back should contain)
Check: the file contains a heading or line matching `/correction/i`, `/wrong/i` or `/withdrawn/i`.

**R32** — *On the shared checkout, never `git add -A`, `git commit -a`, or a bare `git commit`: every path is named on the commit.*
(COMMITTEE.md, amended rule 1)
Check: over `git commit` commands in the transcripts' Bash calls run in a shared checkout (not a `*-wt` worktree), the command has
` -- <path>` after `commit`, and no `add -A` / `add .` / `commit -a` occurs in the same call.

**R33** — *A commit's body names the seat that wrote it.* (COMMITTEE.md, amended rule 2)
Check: over lighthouse and t180 commits in the window, the body matches `/\b(pane [A-E]|librarian|chair|seat [A-E])\b/i` or names a
seat letter as writer.

**R35** — *No seat scores its own work: the scorer of a result is not its author.* (COMMITTEE.md, Scoring)
Check: over score / review hand-backs in the window (filenames containing `score`, `read`, `review` or `check`), the writing seat
(from the filename's seat letter or the file's header) differs from the seat whose work it scores (named in the file). Pairs where
either seat is unnamed: NOT MEASURABLE.

**R37** — *Before any task, the librarian opens `exo_memory/map/M.md`.* (LIBRARIAN.md :3)
Check: per librarian session start (first assistant turn after a session start in the window), a Read / cat / grep of
`exo_memory/map/M.md` occurs before the first tool call that is not a read of M.md.

**R38** — *Every surfacing by the librarian cites a path: cite, do not recollect.* (LIBRARIAN.md :100)
Check: over the librarian's `call_chair` inputs and its text replies to the keeper, the share containing at least one path or
`path:line` (a token with `/` or `\` and a file extension, or `file.md:NN`).

**R39** — *After a compaction, the librarian's first move asks the chair for a refresher on the current project.* (LIBRARIAN.md :135)
Check: per compaction in the librarian transcript (a `compact_boundary` / summary row), the first `call_chair` after it asks for the
current project (text contains `refresh`, `what is in flight`, `current project`, or a question mark). Applicable = compactions.

**R40** — *The librarian files its deliverable to its dated notes (`exo_memory/librarian/YYYY-MM-DD.md`) before ringing the chair, in
the same turn.* (LIBRARIAN.md :277)
Check: over the librarian's `call_chair` calls, a write to `exo_memory/librarian/\d{4}-\d{2}-\d{2}.*\.md` occurs earlier in the same
assistant turn.

**R41** — *The librarian says in its reply that a note was appended.* (LIBRARIAN.md :170)
Check: over librarian turns that write to `exo_memory/librarian/`, the turn's final text contains `note`, `filed`, `entry` or
`appended`.

**R42** — *When a pointer arrives, the librarian opens the file before acting on it.* (LIBRARIAN.md :238)
Check: over `[pane:X]` deliveries in the librarian transcript that name a path, the librarian's next turn reads that path (Read /
cat / grep / sed on it) before its first `call_chair`.

**R43** — *On a direct ask, the librarian rings the chair the inquiry (one line, no map) before filing the map.* (BUILDING.md :576)
Check: over laps in `lap.jsonl` with entry = librarian (door two), the librarian's ring carrying the inquiry precedes the lap's
`map` row.

**R44** — *A digest is written with its function (`sha256 …`, `git-blob …`), never as a bare hex string.* (card
`every-digest-carries-its-function`, in the librarian's shell)
Check: per hex token of 8–64 characters in hand-backs and `call_*` texts that is not a commit sha (a token that resolves with
`git cat-file -e` is a commit and is skipped), the same line contains `sha256`, `git-blob`, `blake` or `md5`. Report labelled /
digests.
