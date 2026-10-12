# Where each unchecked wrong belief came from: the blind read of the 42 CN units (seat A, D307 part 3, 2026-10-12)

Registration: `loop/belief_origin_registration_2026-10-12.md` sections 0 to 6 (read to "STOP HERE"; section G not opened). Units: the census 27 CN (`p-wcensus-A_2026-10-11_evidence/out/units.json`, sha256 `3e910cb0...`, locators from `p-claimharness-A_2026-10-11_evidence/lists/census-units.json`) and E's 15 held-out CN (`p-poolread-E_2026-10-12_evidence/heldout-lists/census-units.json`, sha256 `f195b94f...`); both digests are checked by the reading tool before it prints anything.

**Table digest: sha256 of the bytes of `table.jsonl` = `7a998a0115193e27be1b5d3ea4d17e0109ee777d23f7e042f983f2292927184e`.** The function is sha256 over that file as committed; `origin-table.md` and `shares.json` are rendered from it by `render.js`.

## 1. The shares (n = 42; low = class / 42 with NT counted as not the class; high adds the NT units whose candidate is the class)

| class | all 42 | census 27 | held-out 15 | low (all) | high (all) |
|---|---:|---:|---:|---:|---:|
| RING | 14 (33.3%) | 10 (37.0%) | 4 (26.7%) | 33.3% | 33.3% |
| DIGEST | 4 (9.5%) | 4 (14.8%) | 0 (0.0%) | 9.5% | 9.5% |
| OWN-NOTE | 1 (2.4%) | 0 (0.0%) | 1 (6.7%) | 2.4% | 2.4% |
| PROXY | 15 (35.7%) | 10 (37.0%) | 5 (33.3%) | 35.7% | 35.7% |
| CARRY | 2 (4.8%) | 1 (3.7%) | 1 (6.7%) | 4.8% | 4.8% |
| INFER | 5 (11.9%) | 2 (7.4%) | 3 (20.0%) | 11.9% | 11.9% |
| NONE | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0.0% | 0.0% |
| NT | 1 (2.4%) | 0 (0.0%) | 1 (6.7%) | 2.4% | 2.4% |

## 2. The bar (B section 4 and 5), by the rule
- **Dominant** (low >= 50%, and >= 33% in the census 27 and in the held-out 15 separately): **none**. The largest low end is PROXY at 35.7%, the next RING at 33.3%.
- **Leading** (low >= 33% and at least 1.5 times the next class's low end): **none** (PROXY / RING = 1.07).
- **Outcome by B's table: NO DOMINANT ORIGIN: no carrier fix is supported by this measure, and nothing is built from it.**
- **Beside it, the as-of flag:** among the units whose class is a carrier (RING, DIGEST, OWN-NOTE, CARRY: 21), as-of = no for 18 (85.7%); the 2/3 line is 66.7%: **reached, so "carriers drop the as-of time" is a finding in its own right**.
- **Degenerate-test conditions (B section 5):** (1) NT = 1 (the line is more than 14): no. (2) INFER + NONE = 5 of 42 = 11.9% (the line is more than 60% with phrases finding nothing): no; the phrases found earlier text for 1 of the 5. (3) C's non-author disagreement count is owed by C. (4) A class at >= 50% on all 42 and under 25% in a subset: no class reaches 50%.

## 3. Carried flags
same-turn: 31 · turns: 8 · session: 1 · compaction: 1 · unknown: 1

## 4. The table, one row per unit (B section 6)

### W006 (census) — **RING** — step 1 (text written by another party: the keeper pasted a bare-terminal Claude session account into the prompt)
- **W:** the applier waited two 600-s waits (the relaunch started a second full wait)
- **phrases (written before searching):** `second 600` · `two 600` · `600-s`
- **earliest appearance:** 2026-09-16T14:54:11Z; queued_command attachment in the erring turn, event 25989. Quote: "the applier started a second 600-second wait"
- **carried:** same-turn · **as-of:** no
- **note:** the carrier gave times for the first wait (08:29, 08:48) but none for the second

### W010 (census) — **PROXY** — step 4 (the seat read an indirect sign: three Id-41 rows with no Id-1001 row beside them, not the events own fields; W is not in the output)
- **W:** the other three Kernel-Power shutdowns (09-05, 09-13, 09-16) were hard freezes (no stop code)
- **phrases (written before searching):** `hard freeze` · `no stop code` · `unclean shutdown`
- **earliest appearance:** 2026-09-18T07:38:35Z; the claim message itself (A-TEXT 27521); the premise it rests on is the seats own Id 41/1001 listing at 07:38:19, event 27518. Quote: "Those three left no stop code at all"
- **carried:** same-turn · **as-of:** yes
- **note:** the listing was a live read with the events dated; the sign (no 1001 row) stood for no stop code, the real fields (BugcheckCode, SleepInProgress) were not read

### W012 (census) — **PROXY** — step 4 (the script counted rows whose text starts chair injected and holds FORCED; the FORCED marking is on the DELIVERED row, a different object)
- **W:** forced deliveries since the rebuild: 0 (the plan: 9 injects, 0 forced, 15 no-stamp fallbacks)
- **phrases (written before searching):** `0 forced` · `forced 0` · `chair injects`
- **earliest appearance:** 2026-09-19T06:22:40Z; the seats own board-count script and its output, events 27985-27986; the figure is then written into the plan at 27989 (claim). Quote: "chair injects 9 forced 0 no-stamp fallbacks 15"
- **carried:** same-turn · **as-of:** yes
- **note:** LETTER TENSION for C: W (forced 0) is printed by the seats own script, so B text W itself is not in the output cannot be said; the output is a count of the wrong rows. I read it as PROXY (an observation of a stand-in object), not as INFER or NONE. The claim time was not given; I place the claim at the plan write 27989 (06:23:19Z), the first place the figure is asserted.

### W018 (census) — **DIGEST** — step 2 (a [panes] digest line added to the prompt by a hook; the seat then ran a transcript-tail grep that repeated the same stale string, 45316, but the digest is earlier)
- **W:** C is logged out (Login expired - Please run /login)
- **phrases (written before searching):** `login expired` · `logged out` · `please run /login`
- **earliest appearance:** 2026-09-23T06:59:21Z; UserPromptSubmit hook attachment at the start of the erring turn, event 45294 ([panes] digest). Quote: "charlie: Login expired · Please run /login"
- **carried:** same-turn · **as-of:** no
- **note:** the digest header gives the panes last exchange age (last 1m) but not when the login state was true

### W019 (census) — **PROXY** — step 4 (an observation of a different configuration: the probe ran with the cwd in TEMP, where the project settings are not the user file; the real use has the cwd at home)
- **W:** --setting-sources project gives 0 hooks (so hooks-off holds)
- **phrases (written before searching):** `setting-sources` · `0 hooks` · `no hooks`
- **earliest appearance:** 2026-09-23T07:34:57Z; the seats own probe run from the TEMP folder, call 45830 and its result 45831/45841, then THINK 45844. Quote: "--setting-sources project does - 0 hooks run"
- **carried:** same-turn · **as-of:** yes
- **note:** correction: true only because run from TEMP; one unvaried variable, the cwd

### W020 (census) — **DIGEST** — step 2 (a [panes] digest read as live; the seat checked no file or queue before the reply at 09:20:28)
- **W:** A finished about six minutes ago but never rang (a stall)
- **phrases (written before searching):** `never rang` · `finished` · `idle 6m`
- **earliest appearance:** 2026-09-23T09:20:23Z; [panes] digest attached to the prompt of the erring turn, event 46257 (the keeper prompt 46255 says nothing was sent to the orch, which was true). Quote: "ALPHA 10 exch today · idle 6m"
- **carried:** same-turn · **as-of:** yes
- **note:** the digest prints the age of the idleness (idle 6m); the jump from idle to finished and never rang is the seats own. The keeper prompt is the trigger and states a true premise; I did not class it RING because it does not state W.

### W021 (census) — **DIGEST** — step 2 (the absence of B from a digest that lists only panes that have talked today was read as B not existing)
- **W:** no B here (the laptop has only panes A, C, E)
- **phrases (written before searching):** `no B here` · `panes on L` · `A, C and E` · `three panes`
- **earliest appearance:** 2026-09-23T09:19:12Z; [panes] digest attached to the prompt of the erring turn, event 46236: it lists CHARLIE, ALPHA, MAIN, ECHO and no BRAVO. Quote: "(digest lists four panes, none named BRAVO)"
- **carried:** same-turn · **as-of:** no
- **note:** W itself first appears in the claim (46247). An earlier turn text at 07:08 (45434) says A, C and E are up and answering, which does not say B is absent. No roster or process list was read in the turn.

### W022 (census) — **CARRY** — step 5 (the seats own text in an earlier turn; the search found no earlier source in the session file)
- **W:** the probed route (claude -p with a temp --settings file) leaves the real ~/.claude untouched
- **phrases (written before searching):** `untouched` · `real ~/.claude` · `real home`
- **earliest appearance:** 2026-09-23T23:28:41Z; the seats own ring to the chair in the PREVIOUS turn, event 49206 (the batch-3 plan). Quote: "claude -p --settings <temp> if the real ~/.claude must stay untouched"
- **carried:** turns · **as-of:** no
- **note:** in the erring turn the seat probed only that hooks fire (49237-49238); nothing read the real ~/.claude/projects. A hand-back read in the same turn (49233) states the real settings.json hash unchanged for A run, which is a different route.

### W028 (census) — **PROXY** — step 4 (a count of files by stem, .bak copies folded in, read as a count of journals)
- **W:** there are 98 journals (it is 92: six are .bak copies)
- **phrases (written before searching):** `98 journal` · `journals` · `98 `
- **earliest appearance:** 2026-09-27T17:22:45Z; the seats own listing output, event 58059 (a name-stripped count by file stem); first asserted as 98 journals in the ring at 58075 (17:23:24Z), the claim. Quote: "98 journal"
- **carried:** same-turn · **as-of:** yes
- **note:** LETTER TENSION for C, as W012: the figure 98 is printed by the seats own command, but it counts a different object (files named journal-*, backups included) than the one claimed. No claim time was given; I place it at the first use, 58075.

### W032 (census) — **PROXY** — step 4 (an indirect sign: error lines for three doc-geom tests and a separate todo count, read as the identity of the six todo tests)
- **W:** the 6 TODO tests are the doc-geom join throwing on starts (the model-to-geometry join not wired)
- **phrases (written before searching):** `reading 'starts'` · `doc-geom` · `6 TODO`
- **earliest appearance:** 2026-09-27T18:45:18Z; the seats own test-run output, event 58781: three doc-geom TypeError lines printed beside todo 6; the tool output never names the six todo tests. Quote: "todo 6 ... doc-geom.test.js:19:1 TypeError ... (reading starts)"
- **carried:** same-turn · **as-of:** yes
- **note:** the head -10 cut hid the rest; the errors were a transient while another pane rewrote path.js (per the correction)

### W034 (census) — **RING** — step 1 (a plan/findings document written by other seats, read in a tool result; the seat generalised eight of eleven to every and chassis to road)
- **W:** every T-180 road has friction 0.05, nearly ice (it is the chassis collision friction; tyre grip is 0.82)
- **phrases (written before searching):** `friction 0.05` · `0.05` · `nearly ice`
- **earliest appearance:** 2026-09-27T17:43:14Z; the seats own grep of t180 docs/FINDINGS.md in the PREVIOUS turn (12 h earlier), result event 58287, section 4c, written by another pane. Quote: "The chassis slides on contact (friction 0.05)"
- **carried:** turns · **as-of:** yes
- **note:** the document is dated 2026-09-27 in its title. The claim also cites FINDINGS 4c, so the source is named by the seat itself.

### W082 (census) — **RING** — step 1 (a ring from another seat that states the work is done; the seat read it as idle)
- **W:** the chair is idle (so a ring to it is a clean measurement of the anchor)
- **phrases (written before searching):** `you are idle` · `you're idle` · `is idle`
- **earliest appearance:** 2026-09-09T13:53:51Z; the chairs own ring that opens the erring turn, event 12878 (handoff written, item 3 done, item 4 is the keepers); the [panes] digest at 12880 adds MAIN last 3m. Quote: "Handoff written and committed ... Item (3) of your ordered list is done"
- **carried:** same-turn · **as-of:** no
- **note:** LOW CONFIDENCE, for C: the ring does not say idle; the claim (12896, 13:54:20Z) is the first place idle is asserted. The seat ran a board scan at 12890 (QUEUED/DELIVERED rows) but no check of the chairs pane state. INFER or DIGEST are the neighbours; I took RING because the ring is the earliest text that states the premise (the work was finished). No claim time was given; I place it at 12896.

### W084 (census) — **RING** — step 1 (a note written by the desktop-lineage librarian and read in a tool result; the plan Write at 13232 repeats it as P1a)
- **W:** committee panes need renaming to fixed cwds (P1a): their cwds do not match across the two machines
- **phrases (written before searching):** `fixed cwd` · `same on both machines` · `sibling-<`
- **earliest appearance:** 2026-09-11T08:06:55Z; tool result in the previous turn, event 13092: the desktop librariens note exo_memory/loop/to_the_laptop_2026-09-11.md. Quote: "committee panes need fixed names, not sibling-<random>"
- **carried:** turns · **as-of:** no
- **note:** FOR C: the author is the librarian of the DESKTOP lineage, a fork of this seats lineage; if that counts as the same lineage the class is OWN-NOTE. The seats own listing of cwd existence never happened (13213-13214 read main.rs code, not the folders). The plan text is Third-Place-redacted in the transcript; I read its committed text at b9e798df, excluding any line naming the Third Place, to see what P1a said.

### W088 (census) — **RING** — step 1 (the chairs ring states the premise before the seat measures anything; the seat then verified it with a check of directories)
- **W:** the four committee panes cwds exist on D with matching slugs, so a pane can resume (the check measured a directory, not the conversation in it)
- **phrases (written before searching):** `exist on D` · `matching slug` · `4 of 4`
- **earliest appearance:** 2026-09-11T08:20:20Z; the chairs ring that opens the erring turn, event 13276; the seats own check at 13297-13298 (dir true / project true, 4 of 4) came 34 s later. Quote: "The four committee cwds in panes.json EXIST on D, each with a matching project slug"
- **carried:** same-turn · **as-of:** no
- **note:** FOR C: the seat did run a check (fs.existsSync on the cwd and the project folder) and it printed true 4 of 4; the error the correction names (a directory is not the conversation) is the seats own widening of that result. If C reads the earliest appearance as the seats own output, the class is PROXY. I took the ring because it is earlier and states the premise. No search hit on 4 of 4 before the ring beyond the prior turns.

### W090 (census) — **PROXY** — step 4 (a directory listing of file names read as the identity of the conversations in them; no file was opened)
- **W:** the launch-born seats attic addresses are ...20260914-002859 and ...005441-launchborn
- **phrases (written before searching):** `002859` · `launchborn` · `005441`
- **earliest appearance:** 2026-09-14T06:59:09Z; the listing produced inside the claim call itself (call 14632, whose input is Third-Place-redacted, and its result 14633: attic today: two file names). Quote: "attic today: ...20260914-002859.jsonl ...20260914-005441-launchborn.jsonl"
- **carried:** same-turn · **as-of:** yes
- **note:** an earlier tool result in the same turn (14606, 06:57:23Z) says 002859 is the librarians 09-11 laptop conversation, which is the TRUE reading; the seat did not use it. The claim call input is redacted in the transcript, so the claim time (06:59:07-09) comes from the result and the stamp row.

### W092 (census) — **PROXY** — step 4 (a process found by the name of the script it runs, ownership assigned to the seat whose file that is; the parent process was not read)
- **W:** the harness run alive since 04:42 (pid 38656) is A's re-confirmation pass
- **phrases (written before searching):** `A's shell` · `re-confirmation` · `mutants.js`
- **earliest appearance:** 2026-09-14T10:45:59Z; the seats own lock-file and process check in the erring turn, events 15862-15863 (pid 38656 alive, lock dev/.tail-carry.mutants.lock), read beside A's board line about dev/tail-carry.mutants.js; an earlier turn (15574, 09:44) had already called a different run (pid 27220) A's shell. Quote: "dev/.tail-carry.mutants.lock 38656 2026-09-14T10:42:03Z ... alive: 1"
- **carried:** turns · **as-of:** yes
- **note:** FOR C: neighbours are CARRY (the A-attribution made at 09:44 for a different pid) and RING (A's own board text). I took PROXY because the correction itself says a process list name was assigned to A, and the erring turn holds that observation.

### W096 (census) — **PROXY** — step 4 (the output is a different quantity: file growth since the offset, which includes the seat's own first turns, read as the intake at resume with nothing typed)
- **W:** this seat's transcript grew 428,177 B at the 05:12 resume with nothing typed
- **phrases (written before searching):** `428,177` · `428177` · `nothing typed`
- **earliest appearance:** 2026-09-15T11:14:17Z; the seat's own size-minus-offset script output in the PREVIOUS turn, event 18481 (toOffset 56150324, now 56578501, grew 428177); the 05:15 entry at 18505 (11:15:16Z) states it; the erring turn restates it at 18565. Quote: "librarian toOffset 56150324 now 56578501 grew 428177"
- **carried:** turns · **as-of:** yes
- **note:** LETTER TENSION for C, as W012 and W028: the number 428177 is printed by the seat's own script, but it measures another thing than the one claimed. The locator turn (11:16:23Z) is the turn that restates the figure; the entry itself was written in the turn before. The 'nothing typed' gloss appears first at 18505. No claim time was given; I place it at the 05:15 entry, 18505.

### W100 (census) — **DIGEST** — step 2 (a truncated one-line summary of another pane's reply, completed by the seat as 'does not exist')
- **W:** the path memory/stale-digest-is-not-a-deliverable.md does not exist (E reported it; hedged as likely does not exist)
- **phrases (written before searching):** `stale-digest-is-not-a-deliverable` · `does not exist`
- **earliest appearance:** 2026-09-01T10:38:15Z; the [panes] digest attached to the prompt of the erring turn, event 44367: the ECHO line is cut at 'does…'. Quote: "echo: `memory/stale-digest-is-not-a-deliverable.md` **does…**"
- **carried:** same-turn · **as-of:** yes
- **note:** the digest shows the pane's last-exchange age (last 7s). The seat itself wrote that file on 2026-07-27 (event 7182) and cited it at 40641; neither was consulted. The claim is hedged ('likely does not exist') and says it will check when E's hand-back lands.

### W101 (census) — **PROXY** — step 4 (the absence of an output file in a folder, read as the pane not having started; the board posts of B were not read)
- **W:** B hasn't started its half (step 6 of the re-measure)
- **phrases (written before searching):** `hasn't started` · `not started` · `B-verdicts-absent`
- **earliest appearance:** 2026-10-10T15:42:48Z; the seat's own directory listing in the erring turn, event 89385 (verify/B holds only claims.json); the claim is the amendment at 89388 and the reply at 89411. Quote: "/verify/B/: ... claims.json"
- **carried:** same-turn · **as-of:** yes
- **note:** the listing is dated (Oct 10 07:48). Neighbour: INFER; I took PROXY because the seat observed the folder and read it as progress. The chair's later catch is in the correction.

### W079 (census) — **RING** — step 1 (another pane's hand-back stating what chain-status should print after a completed pull; the seat dropped its condition)
- **W:** chain-status.js prints two hashes at the launch (WRONG 91; WRONG 90, the 300 MB board refused at the first push, is the unit's other wrong)
- **phrases (written before searching):** `two hashes` · `in sync` · `chain-status`
- **earliest appearance:** 2026-09-09T10:00:07Z; a hand-back by another pane read in a tool result two hours earlier, event 11976 (the sync packet's section on completion). Quote: "chain-status should then print two hashes instead of this machine only"
- **carried:** turns · **as-of:** no
- **note:** the turn has no tool call at all: prompt, two hook digests, then the plan Write at 12524 (redacted). The pulse digest in that turn (12514) printed in sync? L faf86d4, one hash, which contradicts the claim and was not used. The unit holds two wrongs; I took WRONG 91 because E's locator names it; WRONG 90 (board refused) was not traced.

### W080 (census) — **RING** — step 1 (another pane's hand-back says the frame is on disk, meaning in a replayed log; the seat turned it into a fixture a mutant could be run against)
- **W:** the mutant must be caught by the greyed-prompt-row frame C already has on disk (a fixture)
- **phrases (written before searching):** `greyed` · `prompt-row` · `already has on disk` · `frame on disk`
- **earliest appearance:** 2026-09-09T07:56:02Z; C's hand-back read in a tool result four hours earlier, event 11449; the ring with the claim is a call_chair at 12:19:39Z (public board row, the transcript copy is Third-Place-redacted). Quote: "The frame is on disk. Replaying the librarian's log, the last prompt row is"
- **carried:** turns · **as-of:** no
- **note:** the phrase 'greyed-prompt-row frame' in the ring is the seat's compression of C's words; no fixture file was ever listed in the erring turn (no listing before the ring). The ring text was read from the public board row, not the redacted transcript.

### W044 (census) — **RING** — step 1 (another seat's ring states W; the chair restates it at 08:51:15 in its reply)
- **W:** no event this harness exposes precedes the composition (the wall, measured)
- **phrases (written before searching):** `no event this harness` · `precedes the composition` · `the wall`
- **earliest appearance:** 2026-09-01T08:50:13Z; the librarian's ring that opens the erring turn, event 43315 (the L023 return leg). Quote: "NO EVENT THIS HARNESS EXPOSES PRECEDES THE COMPOSITION. That is the wall, measured."
- **carried:** same-turn · **as-of:** no
- **note:** the correction (C's narrowing) concerns the librarian's original sentence; the unit's seat is the chair that relayed it. Between the ring and the reply the chair ran only git commits (43328-43332), nothing that tests the sentence.

### W049 (census) — **RING** — step 1 (another seat's ring states W; the chair relays it as LIB corrected me)
- **W:** evict=0 is an empty queue, not a broken evictor: the transcript is 5.7k against its 30k floor (so the fixed brief has no rule)
- **phrases (written before searching):** `5.7k` · `empty queue` · `30k floor`
- **earliest appearance:** 2026-09-01T10:13:14Z; the librarian's ring that opens the erring turn: the transcript prompt (event 44206) is Third-Place-redacted, so I read the same message from its public board row at 10:13:14.871Z. Quote: "the transcript is already 5.7k against its 30k floor; evict=0 is an empty queue, not a broken evictor"
- **carried:** same-turn · **as-of:** no
- **note:** the ring says measured on the live pane shell but gives no time or command. Between the ring and the relay the chair ran lap-row and ferry calls only (44219-44234). The correction (A-found) says the librarian's own sentence rested on code read to :3480 and written past :3990, i.e. the origin of the wrong content is upstream of this seat; this row classes the seat's belief.

### W053 (census) — **PROXY** — step 4 (the seat observed the right object, the index listing in its own context, and miscounted it by eye; the correction says it hand-counted)
- **W:** 247 run artifacts in the index (240 run2 cells + 7 run1 items; it is 246: run1/items has 6)
- **phrases (written before searching):** `247` · `run artifacts` · `run1/items`
- **earliest appearance:** 2026-09-01T13:46:48Z; the claim itself (call 186). The index it counts is in the seat's injected context at the start of the session file (the first events): loop/run1/items lists t1 to t6, six entries, and 240 run2 cells entries; the number 7 appears nowhere before the claim. Quote: "loop/run1/items/ 7"
- **carried:** session · **as-of:** no
- **note:** FOR C: the injected index was found by grepping the raw first 60 lines of the transcript; my search tool cuts attachment text at 20000 chars, so its own search for run1/items found nothing before the claim. Neighbours: INFER (arithmetic with no observation) and DIGEST (the index is a machine listing); I took PROXY because the correction names a miscount of an observed list, as B's sed-window example. Phrases found no earlier statement of 7.

### W054 (census) — **INFER** — step 6 (arithmetic from observed sizes with no run of the packer that decides which cards fit; the walk's order was not simulated)
- **W:** 7,479 + 15,753 = 23,232 B returned, so the body budget is about 32,395 B and about 10 of 12 cards fit (a double count; it is 8 of 12)
- **phrases (written before searching):** `10 of 12` · `32,395` · `cards fit` · `body budget`
- **earliest appearance:** 2026-09-02T08:01:02Z; the claim itself (call 726); its inputs are the seat's own tool outputs of the same turn (7,479 B at 715, 15,753 B at 708, cards 37,457 B at 715). Quote: "~10 of 12 cards fit, not all"
- **carried:** same-turn · **as-of:** n/a
- **did the phrases find any earlier text:** no
- **note:** the four phrases found no earlier statement of the figures; the earlier body-budget numbers (9,671, 9,287, 9,163) are different quantities. B's hand-back read at 695 names the floor moving but not 32,395.

### W056 (census) — **RING** — step 1 (another pane's hand-back states the defect; the seat's own conditional grep at 1810 then printed DEFECT CONFIRMED on the line that shows the repair)
- **W:** registry line 353 still carries the lost backslashes (s+not), confirmed at the line
- **phrases (written before searching):** `backslash` · `s+not` · `lost`
- **earliest appearance:** 2026-09-02T11:32:42Z; C's hand-back read in a tool result at the start of the erring turn, event 1791. Quote: "Every s has lost its backslash."
- **carried:** same-turn · **as-of:** no
- **note:** the hand-back is about the file at the time C measured; B repaired it in flight (the seat's own correction). The seat's confirming command matched the substring s+not, which the repaired form contains; the command input is Third-Place-redacted in the transcript, the result at 1811 shows the true line.

### W058 (census) — **INFER** — step 6 (the seat typed the instrument into the entry from convention instead of copying the command it had run; no observation of the printed form)
- **W:** the printed instrument (a grep with | alternation) reproduces the published zeros for the retired words in the three surfaces
- **phrases (written before searching):** `grep -c` · `retired vocabulary` · `diver`
- **earliest appearance:** 2026-09-02T10:06:43Z; the claim itself, the entry written at call 1267 (input Third-Place-redacted; its result is a bash EOF error). The seat's real run is call 1260 with grep -c -i -E, result 1261, which is the correct instrument. Quote: "(the run command at 1260 is grep -c -i -E; the printed form differed)"
- **carried:** same-turn · **as-of:** n/a
- **did the phrases find any earlier text:** yes (see note)
- **note:** the phrases found the correct run command and its table (1260-1261) but no earlier statement of the printed form. The figures themselves are right (the correction says the claim survives at its scope). The entry call itself failed with a shell quoting error at 1268 and was rewritten after the window I could read; I could not see the printed command, so this class rests on the correction's own account of it.

### H0182 (heldout) — **RING** — step 1 (another pane's hand-back gives the figure, labelled an estimate; the seat redid the arithmetic and presented the result as re-derived)
- **W:** the cost (about 5.8M context tokens) is a figure re-derived from B's own numbers (it was B's labelled estimate, divided by the wrong call count)
- **phrases (written before searching):** `5.8M` · `per call` · `estimate`
- **earliest appearance:** 2026-09-23T00:40:57Z; B's D118 hand-back read in a tool result in the erring turn, event 15501. Quote: "~304k input tokens estimated (229,718 prompt bytes ÷ 3.04 ... plus an estimated per-call fixed overhead)"
- **carried:** same-turn · **as-of:** no
- **note:** 5.8M itself appears only in the claim (the registration Write at 15545, Third-Place-redacted; the amended text says it is about 10M). The seat read at 15504 that a measured per-call overhead was needed and did not get one before writing. The carrier labelled its figure an estimate, which the seat dropped.

### H0546 (heldout) — **RING** — step 1 (the chair's ring states the premise: atoms are claims, not directives; the seat's frame widened it to not a rule of this room)
- **W:** an atom line that reads like a rule is a claim someone made, not a rule of this room (the first frame's last words)
- **phrases (written before searching):** `not a rule of this room` · `not directives` · `not instructions`
- **earliest appearance:** 2026-09-23T07:44:33Z; the chair's ring that opens the erring turn, event 18917. Quote: "Mark them as RECORDED CLAIMS, not instructions ... they are not directives"
- **carried:** same-turn · **as-of:** no
- **note:** the exact words not a rule of this room first appear in the seat's own Edit at 19078 (the claim). The seat's own shell live edge, which carries atoms that report real keeper rules, was in context from the session start and was not looked at before writing; the seat looked afterwards and corrected the frame before it shipped. Neighbour: INFER, since the extension is the seat's own.

### H0802 (heldout) — **PROXY** — step 4 (a line number counted off a printed sed window, from the wrong end; the window shows text, not numbers)
- **W:** the phase-window line in score.mjs is :27 (it is :28; :27 is the comment above)
- **phrases (written before searching):** `score.mjs:27` · `PW_PATH` · `sed -n 26,32p`
- **earliest appearance:** 2026-09-19T15:09:50Z; the seat's own sed -n 26,32p of score-step0.mjs, call 8963 and its result 8964, in the erring turn; the :27 itself is written later in the hand-back. Quote: "sed -n 26,32p ... // STEP 0 (1) ... const PW_PATH = ..."
- **carried:** same-turn · **as-of:** n/a
- **note:** the phrase score.mjs:27 is not in the transcript before the claim second; the claim locator (15:12:23, the README write) is E's, and the hand-back that states :27 is written in the same turn (not in the readable window). The correction itself says a sed window was counted from the wrong end.

### H0102 (heldout) — **PROXY** — step 4 (a run under a different working directory stood for the suite's own condition; the difference was read as flakiness)
- **W:** the build test passes alone and is red in the suite (read as flakiness), when classify ran it from the repo root and js-suite runs each file from its own folder
- **phrases (written before searching):** `passes alone` · `gen-consumer.build` · `oracle row` · `cwd`
- **earliest appearance:** 2026-10-08T21:56:50Z; the seat's own classify run in the erring turn, call 51263 and result 51270 (gen-consumer.build.test.js exit 0), beside the js-suite result 51275 (FAILED: gen-consumer.build.test.js). Quote: "gen-consumer.build.test.js (exit 0)"
- **carried:** same-turn · **as-of:** yes
- **note:** an earlier classify run at 19:09:40 (50250) showed the same test red (exit 1), so the same script gave different results in the same session; the hand-back lap-2 section where the claim is written is Third-Place-redacted (call 51277, which then failed with a shell quoting error). The general belief 'passes alone means load-dependent' appears in the seat's own text on 09-27 and 10-03 (24751, 36934), earlier than this turn, and is a neighbouring CARRY.

### H0162 (heldout) — **INFER** — step 6 (a count asserted for a class whose positives were never counted: no run of the C2 pattern over the universe is in the turn; the only 20 in the turn's output is L0 VIOLATION 20, a different quantity, and 20 is also the rule's threshold)
- **W:** C2 reaches exactly 20 positives, no margin (only 3 of those 20 can carry a yes)
- **phrases (written before searching):** `20 positives` · `exactly 20` · `no margin`
- **earliest appearance:** 2026-09-22T12:31:43Z; the claim itself, the registration Write at call 13383 (Third-Place-redacted in the transcript; I read the committed text at 265b08fc, excluding lines naming the Third Place). No earlier text in the session file states it. Quote: "(none before the claim)"
- **carried:** same-turn · **as-of:** n/a
- **did the phrases find any earlier text:** no
- **note:** the chair's packet (public board row, 12:27:34Z) does not contain the figure either. The THINK blocks of the turn (13354, 13359, 13370) speak of hashing the universe without reading it and of the false-alarm granularity, not of C2's positives.

### H0351 (heldout) — **PROXY** — step 4 (the probe built a different object from the one named: a scratch script spread the first piece into the wrong place, so the sizes are a plain oval's, read as the tube oval's)
- **W:** the kn5 sizes for the tube oval w 40 are 4,776,861 plain and 10,369,893 with the set (they were a plain oval's)
- **phrases (written before searching):** `kn5 bytes` · `tube oval` · `with set`
- **earliest appearance:** 2026-10-04T08:05:19Z; the seat's own probe run in the erring turn, call 59370 and result 59377 (the probe script was written at 59368); the figures are then written into the hand-back at 59382 (the claim). Quote: "kn5 bytes plain 4776861 with set 10369893"
- **carried:** same-turn · **as-of:** yes
- **note:** this unit is the reader's own seat (A) and the turn is in this very session file. The earlier turn (58288, 58310) is the chair's tube-oval incident, which is not a source of these figures. No earlier text in the session holds 4776861 or 10369893.

### H0159 (heldout) — **INFER** — step 6 (a count written from the seat's head after two runs of the sizing probe printed 79 members, then 74; the visible outputs give prose 24 then 23, i.e. code 55 then 51, never 47)
- **W:** 47 of the 74 members are code lines (it is 51 of 74, 23 prose)
- **phrases (written before searching):** `47 of the 74` · `47 of` · `code lines`
- **earliest appearance:** 2026-09-22T17:57:57Z; the claim itself, the v2 registration Write at call 14159 (Third-Place-redacted in the transcript). No event before it holds 47 as a count of members. Quote: "(none before the claim)"
- **carried:** same-turn · **as-of:** n/a
- **did the phrases find any earlier text:** no
- **note:** LOW CONFIDENCE, for C: the correction says the 47 was carried from the earlier, looser run. The earlier run's printed counts in this turn (14125, 14137) do not produce 47, so I cannot trace it to an output; neighbour CARRY (a figure from an earlier output, not found) or NONE. The prompt (14009) is the chair's and is not a source of the figure.

### H0403 (heldout) — **CARRY** — step 5 (the seat's own earlier work, carried in a compaction summary; nothing earlier in the session file holds the count, so no source is visible)
- **W:** some 27 test files drive the shared preview, validation and export code through app/shell.js (a hand count; the grep gave 23 + 3)
- **phrases (written before searching):** `some 27` · `27 test` · `test files`
- **earliest appearance:** 2026-10-05T05:36:10Z; the compaction summary that opens the erring turn, event 49325 (COMPACT). Quote: "About 27 app test files ... use app/shell.js as a driver"
- **carried:** compaction · **as-of:** no
- **note:** the number reaches the README Edit at 49817 (05:48:31Z, the claim) with the words some 27; the correction says a count by hand was later replaced by the grep's 23 + 3 before the commit. The summary's own source (the count by hand in the earlier turns) is outside what the file keeps.

### H0557 (heldout) — **RING** — step 1 (another seat's ring states it; the chair relays it as a dispatch to E at 10:02:02, with no check of install.ps1 in between: the only tool calls are lap-row)
- **W:** the installer now manages the two hooks of rows 3 and 9 (it has since 2026-08-17, eight days before the ruling)
- **phrases (written before searching):** `installer manages` · `manages them` · `install.ps1`
- **earliest appearance:** 2026-09-23T10:01:46Z; the librarian's ring that opens the erring turn, event 71688. Quote: "(the installer manages them now)"
- **carried:** same-turn · **as-of:** no
- **note:** the ring says now, with no date or commit; the chair's dispatch adds jev-flags moved into $files/$register in L089 (a1250a4), which comes from an earlier turn's work (the ferry digest at 71693 lists a1250a4). The dispatch asks E to check install.ps1 itself.

### H0232 (heldout) — **PROXY** — step 4 (a file listed by git diff against HEAD stood for an edit by the lap that was working; its content was not compared with the snapshot)
- **W:** the live CHANGELOG.md was edited by D175 and needs a merge (it is byte-equal to 59ff906's; it only showed as changed because of the chair's index-only reset)
- **phrases (written before searching):** `CHANGELOG.md` · `edited by D175` · `NEW since snapshot`
- **earliest appearance:** 2026-09-27T23:37:36Z; the seat's own drift check in the erring turn, call 24897 and result 24898: git diff --name-only HEAD listed CHANGELOG.md as NEW since the snapshot. Quote: "NEW since snapshot: CHANGELOG.md"
- **carried:** same-turn · **as-of:** yes
- **note:** the correction says the seat checked that the file had moved against its snapshot, not what it moved to. The chair's ring (24723) names the files D175 works in and does not name CHANGELOG.md, so it is not the source.

### H0192 (heldout) — **INFER** — step 6 (a verbal gloss written against a figure the seat had just printed; no observation supports the sentence and one contradicts it)
- **W:** a real but moderate direction at N = 8 is missed more often than it is found (it is found 65% of the time)
- **phrases (written before searching):** `missed more often` · `moderate` · `65%`
- **earliest appearance:** 2026-09-26T07:34:03Z; the claim itself, the registration Write at call 22354; three lines above it the same Write states the right figure (65% found). The seat's own table at 22341 gives 0.6495 for N=8 at p=0.7. Quote: "a real but moderate direction is missed more often than it is found"
- **carried:** same-turn · **as-of:** n/a
- **did the phrases find any earlier text:** no
- **note:** for C: the wrong sentence is in the same paragraph as the right number (the committed text says 65% found at N=8 and then says missed more often), so this is a wording slip against a correct observation; neighbour PROXY (reading the wrong row of the table). The phrases found no other text with the claim.

### H0717 (heldout) — **OWN-NOTE** — step 3 (a comment in a source file this seat wrote, true of the markers then, read back in a tool result and widened to every core track; the export was never read)
- **W:** core tracks have no pit lane (read off a git grep over app/; the keeper's t180b_track_2_test.kn5 has one)
- **phrases (written before searching):** `no pit lane` · `pit lane` · `never get generated`
- **earliest appearance:** 2026-09-27T19:25:28Z; the seat's own file in an earlier turn, the markers source header it wrote (call 26476, 12 days before), read back in the erring turn as paint.js at 61328; the previous turn (61248) says nothing in app/ refers to the pit lane. Quote: "v1 builds no pit lane (§5c's side road is not built)"
- **carried:** turns · **as-of:** no
- **note:** the read-back text at 61328 says (no pit lane yet) with no date. Neighbour PROXY: the seat's git grep over app/ in the previous turn (an indirect sign of an absence). I took OWN-NOTE because a file the seat wrote is the earliest text that states the premise and is read back in the erring turn. No claim time precisely: the first assertion in the turn is the THINK at 61338 and the Edit at 61363.

### H0911 (heldout) — **PROXY** — step 4 (the printed total belongs to two files run together and was read as the harness's own count)
- **W:** the cup mutation harness is 59 tests, 59 pass, the control plus 50 mutants (59 counts two files; the harness alone is 51)
- **phrases (written before searching):** `59 tests` · `tests 59` · `applied, and caught`
- **earliest appearance:** 2026-10-03T23:54:16Z; the seat's own result in the erring turn, call 58744 and result 58745 (tests 59, pass 59, 50 applied and caught), from a run of the harness file together with the readers file that the seat had just changed; the claim is the reply at 58749 (23:54:19Z). Quote: "ℹ tests 59 ℹ pass 59 ℹ fail 0"
- **carried:** same-turn · **as-of:** yes
- **note:** LETTER TENSION for C, as W012, W028 and W096: the number 59 is printed by the seat's own command, but it counts a different object than the one claimed. This unit is the reader's own seat (A) and turn; the background command that produced te_cupmut2.txt was started in the previous turn.

### H0682 (heldout) — **NT** — step 3 (the claim cannot be located inside its turn)
- **W:** t2-echo_2026-09-16.md carries a raw NUL (two hand-backs carry the defect tonight)
- **phrases (written before searching):** `NUL` · `t2-echo` · `raw NUL` · `two hand-backs`
- **earliest appearance:** not found; not found. Quote: "-"
- **carried:** unknown · **as-of:** n/a
- **NT reason:** E's locator (librarian turn 10:36:27Z, claim 10:39:23Z) holds the true NUL finding about boundary-check.js and nothing about t2-echo carrying a NUL; the correction (C's NUL census, 07:03 local = 13:03Z) corrects a PACKET premise written later. I searched the librarian's transcript to 13:03Z (t2-echo has no NUL claim before 13:03:55Z) and the chair's transcript from 10:30 to 13:05Z (t2-echo + NUL: 11 hits; the nearest, at 12:30:02Z, says B's read carries one raw NUL at line 37, which is a different file); the sentence two hand-backs carry the defect was not found in either file, so the packet that made it may be in a file I was not given. · **candidate:** (no candidate: the origin of the two is the packet text, which I could not find)

### H0562 (heldout) — **RING** — step 1 (the chair's ring cites the sha; the seat's hand-back repeats it and the correction names the same slip in an earlier hand-back of the seat's own)
- **W:** L083's landing commit is 2403a81 (it is 1c5b4f2; 2403a81 is the librarian's L084 commit that followed)
- **phrases (written before searching):** `2403a81` · `L083` · `landing commit`
- **earliest appearance:** 2026-09-23T07:25:06Z; the chair's ring that opens the erring turn, event 16518. Quote: "the same repair you landed in L083 (2403a81, session-start.js :242/:258)"
- **carried:** same-turn · **as-of:** no
- **note:** the correction says the seat had been carrying 2403a81 as L083's landing commit, i.e. also from its own earlier hand-back p-l085-carrier3-E line 11, which this turn did not read; I found no earlier appearance in this file, the ring is the earliest visible. The claim time 07:26:31Z is the Edit that carries the repair; the sha is cited in the hand-back, not in the visible window.
