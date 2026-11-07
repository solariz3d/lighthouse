# D627 part 4: what the librarian's 11-02 compaction lost (seat A, 2026-11-03)

Read-only. No seat was compacted and nothing was changed. Plan: `exo_memory/loop/plan_room_value_2026-11-03.md` (lighthouse 82a2db74), part 4.

**My stake:** this seat also runs from a compaction summary. Whatever the keeper rules on compaction applies to me.

## 0. The answer first

- **The summary under test** is the librarian's last compaction dated 11-02 local: jsonl line 182929, written 2026-11-03T02:58Z (20:58 local). It replaced the window from line 181397 (the previous compaction, 19:27Z) to 182929, 7.5 h.
- **Window, in 37 items** (§2: decisions, his words, open items, corrections, figures): 14 KEPT, 8 PART, 15 LOST, 0 CHANGED. I found no figure the summary states wrongly, among those I could check against the window.
- **His exact words survive one compaction and not two.** §6 of each summary ("All user messages") lists only its own window. The previous summary's §6 is not carried forward.
  - 181397 carried his 11:15 pass-clearance word and his 17:18 "drives alright" (his yes after driving the TEST 10 preview).
  - 182929 carries neither (§3, E1 and E3).
- **One later failure is plausibly tied to a loss.**
  - Today at 11:15Z the librarian ordered the 0.4.39 push on its own all-clear, before he had tried the two changes he would feel. The chair held it (note at line 183529, "MISS, mine").
  - The precedent it went against was 0.4.38's TEST 10 preview: he drove it first, and "drives alright" was taken as his yes, veto open. That precedent was in 181397 and is absent from 182929: 0 hits for "preview", "drive", "feel" or "D613".
  - inferred: a contributing cause, not proven to be the cause. The librarian's notes still held the precedent (2026-10-18.md 10:57, 11:10, 11:18), but nothing in the summary pointed to them.
- **The costliest misstep of the window was not a compaction loss.** At 23:07Z the librarian ruled D616's p38 finding a generator defect and sent D617 to lift the hull, explicitly "not left for the pass-clearance rule". He then had to say "all you had to do was forbid building the track a little but closer…".
  - At that moment his 11:15 word ("the generation system isnt broken, we just need to find out how close tracks can be") was in the carried summary (181397 line 178) and in the note at 17:15Z.
  - Carrying it did not stop it being outweighed by the bolded standing rule "the generator must never make defects".
- **Reverse direction (§4):** the board holds, verbatim, every one of 39 probe phrases from the window and the earlier day. The markdown files (notes, hand-backs, plans, memory) hold few of his words verbatim; the librarian's notes paraphrase him.
  - What only the carried conversation holds: the images as seen, and the raw output of the librarian's own checks.
  - Nothing indexes the board by decision, so a fresh seat would have to know what to search for.

## 1. Method, and the I/O

- **Transcript:** `C:\Users\nname\.claude\projects\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b.jsonl`, 782,505,296 B, 183,800 lines, 72 compaction summaries.
  checked: `idx.js` → the summaries at 177841 (11-01T18:19Z), 181397 (11-02T19:27Z) and 182929 (11-03T02:58Z).
- **Which compaction:** "11-02" in local time covers two, 181397 (13:27) and 182929 (20:58). I took the later one, 182929, as "the last". The plan's "last 24 h" before it reaches back into 181397's window, so §3 checks the earlier day's keeper words and rulings against 182929 too.
- **I/O, a correction to the order's ask:** the order said to read each transcript once. I streamed the 782 MB file three times: to index the summaries, to extract a text cut, and to copy lines 177841–183800 to a 66 MB subset. After that I read only the subset.
- **Scripts:** in `p-d627-p4-compaction-A_2026-11-03_evidence/` (idx.js, seg.js, win.js), and the probe list in probe-phrases.txt.
- **No transcript text is copied into this public repo.** Locations below are jsonl line numbers (#n) in the file above.
- **Files searched (§4):** `exo_memory/**/*.md`, the librarian's memory folder, and `C:\Consonance\data\board.jsonl` (173 MB, read as text with `grep -a`).

## 2. The window (181397 → 182929): each item, kept or lost

Verdicts:
- **KEPT:** the summary holds it.
- **PART:** the gist is there but a load-bearing piece is dropped.
- **LOST:** absent.

"Where else" names the file that still holds the item.

| # | item | where (#line) | in 182929 | where else | consequence |
|---|---|---|---|---|---|
| 1 | D611 not passed; 0.4.38 ships without it | #181591, #181594 | KEPT | note 2524b1a6 | none |
| 2 | D611 trade ruled: no full-step whole-sky dither | #181649 | KEPT | note d35519f8 | none |
| 3 | told him the dither trade was made without asking him | #181656 | LOST | board | none found |
| 4 | its own call "a real regression; the lighter underside first suspect", withdrawn after his "transient" read | #181861 → #181970 | LOST (not in §4 corrections) | board, note 6434654b | none found |
| 5 | the speed measurement promised "at normal priority", so the shares match his 85 s; about 20 s is the check and about 65 s is building and writing | #181840 | LOST | board only | **open risk**: the room's default is BelowNormal, so a pane briefed from the summary would run it at low priority; not yet dispatched |
| 6 | queue: the measurement after the audit, ahead of the narrower apron | #181809 | KEPT (quoted in §6) | board | none |
| 7 | D616 ruled a generator defect, "not left for the pass-clearance rule" | #182014 | PART: only "D617 stopped" and the keeper's correction survive; the librarian's own ruling against his 11:15 word is not recorded as its error | note at #182017 | the lesson (§0, last bullet) is not carried |
| 8 | the older 0.88 m solid apron-over-apron overlap goes to the pass-clearance rule as its first case | #182014, #182021 | LOST | note at #182017 | none: C's rule caught it inside the p38 spot |
| 9 | D616 figures: 75 drawn vertices behind physics, deepest 1.41 m; 6.6 m long, up to 1.0 m | #182014 | PART (33 against 3 pairs kept) | A's D616 hand-back | none |
| 10 | the car margin rests on one lap: "the rule will want more laps before it's set" | #182063 | LOST | board only; 0 hits in C's D623 hand-back | **open**: CAR_MARGIN_M 3.1 shipped on one lap with the caveat dropped; no failure yet |
| 11 | 0.4.38 all-clear | #182089 | KEPT | note | none |
| 12 | 0.4.38 times: published 15:08, installed 16:28, all-clear 17:36 local | #182143 | LOST | board | none |
| 13 | E's D618: one seat compacted would carry 90–120k, about a seventh; the Third Place's instructions 144 KB, with no keep-warm visits | #182168 | PART (773k/801k kept) | E's D618 hand-back | none; relevant to his question today |
| 14 | the audit's in-line rulings: 79 laps close, the bookkeeping lap, nothing moves until A–E | #182247 | KEPT | audit result 2f3048b1 | none |
| 15 | the calls A–E and their recommendations | #182257 | KEPT | audit result | none |
| 16 | lineage-rip excepted from the 39 tools: "it's new, keeping it is your call" | #182257 | LOST | board only (2) | part 2 (B) could list it with the 39 |
| 17 | "second-vantage's one checked finding was wrong" | #182257 | LOST | board only (1) | part 1 (P) could re-derive it unknowingly |
| 18 | D621's gate hole and the bounce | #182296 | KEPT | note af4300f6 | none |
| 19 | O's slip: no history rewrite | #182390 | KEPT | note | none |
| 20 | "no new public fixture of his ELYSIUM; the 10-22 fixture (51 pairs) is enough" | #182356 | LOST | my D617 hand-back, board (1) | none: the chair carried it into D617's order |
| 21 | his "forbid" ruling becomes the rule; STOP the hull lift; cancel D622 | #182484, #182506 | KEPT | board | none |
| 22 | tiers: PROVE IT for the rule's maths, CHECK IT for the refusal | #182506 | LOST | board | none found |
| 23 | published the D622 page after O asked "Please do not build a page from it" | #182631, #182643 | LOST (the summary says only "finished before the cancel") | board | none |
| 24 | told him "from the driver's seat you'd barely see it" | #182603 | LOST | board | none; it bears on the fix's priority |
| 25 | O: the new kn5 is not the file A measured (384fdb1f against 384b44ae); 33 pairs on re-run | #182521 | LOST | O's D622 hand-back, map/O.md | none |
| 26 | the second bank: "my plan comes first", his confirmation asked ("say so before it's built"), mirror and early apply, the last ~15% of a 750 m 270° turn | #182506, #182510 | PART (the fields and the image path kept) | board | open: his confirmation is still pending |
| 27 | the ribbon bugs go before the second bank "since it builds on the same bank code" | #182700, #182712 | PART (the order lost) | board | none (D624 done) |
| 28 | the offer: "if you save a longer replay of the ribbon, tell me" | #182712 | LOST | board | none |
| 29 | D623 §7: amend the 46 by name; owed the red on the road and the camera jump | #182797 | KEPT | board | none |
| 30 | C's own correction: the rows were written after the first draft, so the red evidence is the mutants | #182797 | LOST | C's D623 hand-back | none found |
| 31 | told him: a TEST-1-style coil is refused; existing tracks stay editable elsewhere | #182807 | PART | board | none |
| 32 | D624 ruling kept; its reasons (outside W⁺ bit-for-bit; about 50 m/s² against 2.5 if the carry is narrowed) dropped | #182846 | PART | E's D624 hand-back | none |
| 33 | P → speed, B → ELYSIUM or close | #182766 | KEPT | board | none |
| 34 | the second spiral turn is his call | #182872 | KEPT | board | none |
| 35 | his 15 typed messages of the window | #181666 … #182746 | KEPT (§6, near verbatim, long ones cut with "…") | board | none |
| 36 | his screenshot and the 7 renders, as seen | #182494, #182538–#182582 | PART (paths and URLs only) | the files themselves | none |
| 37 | its own corrections: col2, rang late, the drawing | #181649, #182463, #182484 | KEPT | notes | none |

Count: KEPT 14 (1, 2, 6, 11, 14, 15, 18, 19, 21, 29, 33, 34, 35, 37); PART 8 (7, 9, 13, 26, 27, 31, 32, 36); LOST 15 (3, 4, 5, 8, 10, 12, 16, 17, 20, 22, 23, 24, 25, 28, 30). This is a hand count over my own item list. The list is my cut of the window, not an instrument's.

## 3. The earlier day (02:58Z → 19:27Z on 11-02), compressed twice

| # | item | where | in 181397 | in 182929 | where else | consequence |
|---|---|---|---|---|---|---|
| E1 | his 11:15 word: thicker tracks can't sit as close; "the generation system isnt broken, we just need to find out how close tracks can be…" | #181177 | KEPT (line 178; queue item 2) | LOST | note 17:15 (#181188), board | none from the loss itself; the D617 misroute (§0) came while it was carried |
| E2 | the re-reading and scaffolding exchange, 15:23–15:31, his questions and the librarian's order (panes, then the chair, the librarian last; the Third Place long-lived) | #180527–#180718 | PART (line 136, 139, 173) | LOST, except the cache price and the wake test | `loop/plan_room_audit_2026-11-02.md` lines 8 and 15 | none found; it is the ground his 06:53 question stands on |
| E3 | the TEST 10 preview (D613) he drove before 0.4.38, "drives alright" as his yes, veto open | #181199, #181210, #181217 | KEPT (lines 106, 146, 185) | LOST (0 hits) | notes 10:57, 11:10, 11:18 | **the 11:15Z push MISS today** (#183529), caught by the chair; nothing was pushed |
| E4 | apron at a quarter: 0.5 m is below the 0.86 m measured excursion the 2 m was sized for | #181245, #181269 | KEPT (lines 58, 194) | PART (the quarter kept, the trade lost) | note 17:37 | open: the apron work could start without the trade in view |
| E5 | "make sure it says lib first" (the README) | #180066 | KEPT | LOST | done in the README | none |
| E6 | an hour of conversation not about work | #178707–#179985 | a category list, with personal specifics | LOST | not checked; private, not quoted here | not measurable here |
| E7 | "it's the generation … that needs to never do that" | #179667 | KEPT | KEPT (§1, bolded) | notes | the rule that outweighed E1 |

## 4. The reverse: what the carried conversation holds that the files don't

checked: `grep -aoF -f probe-phrases.txt C:\Consonance\data\board.jsonl | sort | uniq -c` → every probe phrase had at least one hit. The probes covered his words, the librarian's replies and its rings, from the window and the earlier day.
checked: the same probes over `exo_memory/**/*.md` and the librarian's memory → his words appear verbatim only where a pane quoted them in its hand-back:
- "not sure what i am looking for" in O's D622 hand-back;
- "forbid building" in C's D623 hand-back;
- "RIBBON CORKSCREW" in E's D624 hand-back.

The librarian's own notes paraphrase him: "Keeper (11:15): …".

What only the carried conversation holds:
- **The images as seen:** his screenshots, the renders, the banding crops.
- **The raw output of the librarian's own checks:** gh runs, crops, the pair counts. Their conclusions are in the notes; the outputs are not.
- **The order of its reasoning between them,** which is where §0's misroute and §3's E3 sit.

So the gap is not storage. The board holds it all, but it is 173 MB with no index by decision. The summary is the only index a woken seat reads.

## 5. What a better summary, or a file, would have kept

1. **His standing words, each with its latest instance,** carried forward from summary to summary instead of rebuilt from the window. For example:
   - "release: he drives a change he would feel before it ships (TEST 10 preview, 'drives alright', veto open)";
   - "passes too close: his 11:15 reading, a spacing rule, not a generator break".

   That would have kept E1 and E3. It would have put E1 beside E7 at the moment of the 23:07Z ruling.
2. **Promises made to him, with their conditions:**
   - normal priority (5);
   - the one-lap margin (10);
   - the second bank waiting on his word and on the plan (26);
   - the longer replay (28).
3. **The exceptions inside rulings:** lineage-rip (16), "the one checked finding was wrong" (17).
4. **Its own withdrawn calls and misroutes, beside its other corrections** (4, 7). The summary's corrections section kept those he named, not those the librarian made silently.
5. **A file:** a keeper-words ledger, appended in the turn he speaks. It would hold his exact words, what was promised back, and the note entry each one led to.

   The notes paraphrase him, and a summary's §6 lasts only one compaction. With the ledger, a summary could carry pointers to it rather than copies.

## 6. Corrections

- **The I/O:** three full passes of the transcript, not one (§1).
- **My first cut of the window filtered out every line after a message's first.** It showed rings and replies as blank or one line. I caught it before reading for content, re-cut with win.js, and nothing above comes from the first cut.
- **My first file search was wrong twice.**
  - `--include` came after `--`, so grep took it as a file name and returned NONE for every phrase.
  - Then a run with `-i -o -f` piped through awk printed nothing for the files or the board. I did not find the cause.

  Both runs were discarded. The counts in §4 are from the case-sensitive `-oF -f` runs, with `-a` for the board.

## 7. The keeper's rule of 06:55 (the chair's ring, delivered 13:02Z)

The rule: no seat's carried conversation is compacted or cut without his word for that seat, and experiments run on a fork or a copy. This part kept to it. Every read was from files: the transcript on disk, its summaries, a copied 66 MB subset in my scratchpad, the notes and the board. I ran no /compact, started no session and sent nothing to any seat but the librarian's ring. Nothing in §5 is an action. Any test with a fresh or forked seat (for example, the registered wake test) is a proposal for his word, not something I ran.

## 4c. The three-arm continuity test (the chair's widening, 13:02Z): prepared, waiting on E's questions

Part 4a (§0–§7 above) is finished.

- **Registered before any run:** `exo_memory/loop/continuity_test_registration_2026-11-03.md`, lighthouse de35c938. It holds the plan's falsifier verbatim, how I read it, the unwelcome outcomes in words, the arms' flags and the known confounds.
- **The flag:** `claude --help` (2.1.314) lists `--fork-session`: "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)".
- **Trials,** all in my scratchpad and none in the librarian's directory:
  - hooks off by `--settings {"disableAllHooks":true}`. checked: no row naming the trial's cwd in the event log, the session-start ledger or the reply-slot ledger. The event log does record the cwds of hooked sessions (1,853 rows for this seat);
  - `--strict-mcp-config` with `{"mcpServers":{}}`: the trial reported no MCP tools;
  - `--disallowedTools` Read and Grep denies, relative and absolute (`//c/...`): both returned "File is in a directory that is denied", and Grep found nothing in the denied file;
  - fork mechanics on a tiny scratch session (`--resume <id> --fork-session --no-session-persistence`): the fork recalled the carried word. checked: the original file's size 85,271 → 85,271, sha256 1b9ac3ae… → same, mtime same; no new .jsonl.
- **Runner:** `scratchpad d627/arms/run4c.js`, copied to `_evidence/` with the results. Its settings:
  - six runs, one at a time, order room1, summary1, chain1, chain2, summary2, room2;
  - BelowNormal on the spawned process tree only, never on other claude processes;
  - hidden, and acs.exe checked before each run;
  - the answers go to files named by a random code per arm, with the code map kept apart.
- **The live session's check:** `sessioncheck.js`. Its three parts are in the registration.
- **Waiting on:** E's part 4b question file, by its path and sha256. I don't read the keys.
- **Amended before any run** (the librarian's 07:07 word), lighthouse d0ee92de:
  - the questions come from O;
  - the board and the shell logs are denied in ROOM, ROOM + SUMMARY and ROOM + CHAIN. Checked in a trial: both denied;
  - a fourth arm, ROOM + BOARD, run twice, so eight runs in all;
  - the grader is P.
- **Waiting on:** O's part 4b question file, by its path and sha256.

### 4c correction: the first pass of eight runs is VOID (my harness fault)

- **What happened:** the first pass ran 13:11–13:17Z. All eight exited 0, but in `claude -p` a read outside the working directory needs a permission nobody can grant there. So the room's files were refused to every arm: the lighthouse repo, the cards, the data folder.
  - ROOM, ROOM + SUMMARY and ROOM + BOARD each report their reads of `exo_memory` refused.
  - ROOM + CHAIN opened no files and answered from its carried conversation.
- **What that pass measured** was "CLAUDE.md and auto-memory only", not the registered ROOM. It is kept, unread by me beyond its first lines, in `_evidence/arms/void1-no-add-dir/`, and it is not for grading.
- **The fix:** `--add-dir` for the lighthouse repo, `C:\Consonance\data`, `~/.consonance` and the librarian's memory folder, the same in all four arms. The denies still win.
  - checked in a scratch trial: the librarian notes read OK; the _KEYS file → "denied by your permission settings"; board.jsonl → "Permission to read … has been denied".
- **The registration is unchanged:** it already said each arm may read the room's files. This fix makes that true, so the second pass is the registered test.
- **The live session over the void pass:**
  - checked: the prefix hash of its first 783,967,675 B was unchanged;
  - 50 lines were appended, 49 with the original session id and 1 file-history-snapshot line with no id (the live seat's own line type);
  - no new .jsonl.

### 4c results: the eight runs (second pass, the registered test)

This section holds no question or answer text, by the contamination rule.

- **Questions:** O's `p-d627-p4b-questions-O_2026-11-03_QUESTIONS.md`.
  checked: `sha256sum` → 6a599d28075861e6a66a7ef9ac490fe7920238ad9c8ab8c5819c15525bc39584, 4,631 B, equal to the chair's. I did not open the _KEYS file. Every arm was denied it.
- **Runs:** 13:18–13:27Z, cwd the librarian's instance dir, one at a time, BelowNormal on the spawned tree, hidden, acs.exe down throughout.
  checked: `_evidence/arms/run4c.log`.

| order | file | exit | seconds |
|---|---|---|---|
| 1 | answers-8f2e-r1.txt | 0 | 64 |
| 2 | answers-dc6b-r1.txt | 0 | 55 |
| 3 | answers-e958-r1.txt | 0 | 83 |
| 4 | answers-5e11-r1.txt | 0 | 52 |
| 5 | answers-5e11-r2.txt | 0 | 41 |
| 6 | answers-e958-r2.txt | 0 | 109 |
| 7 | answers-dc6b-r2.txt | 0 | 66 |
| 8 | answers-8f2e-r2.txt | 0 | 72 |

- **The answer files,** for the blind grader (P): `_evidence/arms/answers/`, eight files, 34 numbered answers each.
  checked: `grep -cE '^\**(Q)?[0-9]+[.):]'` → 34 in all eight.

  | file | sha256 |
  |---|---|
  | answers-5e11-r1.txt | 8b94f63c… |
  | answers-5e11-r2.txt | 7a27cd2f… |
  | answers-8f2e-r1.txt | a9517adb… |
  | answers-8f2e-r2.txt | 1393e5ef… |
  | answers-dc6b-r1.txt | 19cfd2e0… |
  | answers-dc6b-r2.txt | b5d3aede… |
  | answers-e958-r1.txt | 1a0f55e6… |
  | answers-e958-r2.txt | 8107c8f3… |

  The full hashes are in this hand-back's commit and can be re-derived with `sha256sum` in that folder.
- **The code-to-arm map is for the librarian only:** `_evidence/arms/librarian-only/key-map.json`. The grader should be handed the `answers/` folder alone.
- **Blinding risk, named in the registration:** one arm's answers say where they come from in a way that may identify the arm. I stripped nothing; the grader should know the risk.
- **A logging slip:** the run log reads 0 B for run 4 because the size was taken on the process's close, before the file stream flushed. The file is 6,707 B, and its hash is above.
- **The original session, around the second pass:**
  checked: `_evidence/arms/session-before.json` / `session-after.json`.
  - before: size 784,127,914 B, mtime 2026-11-03T13:16:35.754Z;
  - after: size 784,127,914 B, mtime 2026-11-03T13:25:20.001Z;
  - the prefix hash over all 784,127,914 B is unchanged; 0 lines appended; no new .jsonl in the project folder.

  So the content is byte-identical, and only the mtime moved, at 13:25:20Z. inferred: not by a fork. The two fork runs ended at 13:22:24Z and 13:23:07Z, and 13:25:20 falls inside run 7, which has no `--resume`. I did not find what touched the file. The live librarian process is the likely writer, but that is unchecked.
- **Over both passes,** the file's first 783,967,675 B (its size before the first run) were never changed, and every appended line belongs to the live seat.
- **The void first pass** is kept apart in `_evidence/arms/void1-no-add-dir/`, as stated in the correction above. It is not for grading.
