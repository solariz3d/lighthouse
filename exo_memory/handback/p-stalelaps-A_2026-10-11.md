# p-stalelaps-A — D300 part 1: the open laps, measured; seat A, 2026-10-11

No code, no worktree. I read; I wrote 12 `filed` rows with `lap-row.js`; I edited no plan and no hand-back.

## READ THIS FIRST: the close rows have a side effect on the pulse
checked: `node consonance/tools/chain-status.js` before and after.
- Before my rows the pulse read `STALE D275 52h, D279 44h, D280 43h, +3 · … 0 of 10 chained laps unwitnessed`.
- After: `STALE D284 33h, D286 28h, D277 27h · … 9 of 10 chained laps unwitnessed (D299,D298,D296,+6)`.
- Cause (checked, `chain-status.js:550,589,617`): a filed lap with no `working`, `handbacks-in` or `return-leg` row counts as a chain death. The chair dispatched these laps and never wrote a `working` row, so every one of them reads as unwitnessed the moment it is filed. The flag is true to the ledger: those laps have no work-attesting row. I did NOT add fake `working` rows to silence it.
- So the nag changed from "stale" to "unwitnessed" on 9 of the last 10. **The chair or librarian rules:** accept it (it is what the rows say), or write `working` rows for those laps, or reopen. Each of my rows is an append; a later non-`filed` chain row reopens a lap, as D277 and D286 show. Not tried.

## Method (checked)
- Open laps: `chain-status.js` `openLaps()` over `C:\Consonance\data\lap.jsonl` → 15 open before my rows, plus D300 itself (this lap; left alone). `lap-row.js --report` prints the ledger totals only (314 laps), not the open list.
- Landed: `git fetch`, then `git log origin/main` in lighthouse (tip `0d08cec7`) and in `t180-track-builder` (tip `f5a5f56`), matched by lap id, subject and hand-back name.
- **Lap ids differ between the ledger and the plans:** ledger D279 = the plan headed "Lap D280"; D280 = plan "D281" (the chime); D291 = plan "D290"; D293 = "D292"; D295 = "D294"; D298 = "D297". I matched by the plan file the lap's `opened` row names.

## The table
| ledger lap | plan asked | landed (sha, checked on origin/main) | still owed | sort |
|---|---|---|---|---|
| D275 | the consumer fork carries its own drift awareness (a paragraph in `frag-fork.md`; regenerate as v0.1.1) | `0e3f2c36` paragraph, `0ffea32e` 0.1.1, `738f9115` hand-back and plan | the second-reader backstop, registered as "idea only, not this lap" (the plan's "Backstop" line) | **done, unclosed** |
| D277 | lighten the load: rules rewritten, gates on the work, dev first; H3 a week live then re-score | `b345b481` go-live, `f22df81b`/`6fddaff9` drafts, `03ba63e9` part 5, `8ca20f5b` part 6, `d83645ea`/`11d11da9`/`15c555b1`/`9d755c7b`/`e9488fc5` repairs, `be4ccafd` | the H3 week and its score (the plan: after the week; the pulse and the live-edge say ~10-17); the consumer regeneration after that; H2 as "its own lap" (registered sealed and unrun, `eea543c9`); the push-frame call deferred to the consumer lap (plan, 10-10 11:19); B's D276 item 5 (plan :42), which E's `ac1ddfb5` scoreboard may have answered — inferred, not checked | **partly done** |
| D279 | Turn by (exact angle, exits straight) and measure Thunderhead's post-jump turns | t180: `3025a5e` Turn by, `8639987` Sharp (the second turn type). Lighthouse: `8fa65769` hand-backs, `28b89a92` Sharp bar | the design call the plan floated (judge a tight turn at its own speed) went through the D282 Sharp bar; S4b's anchor "is the librarian's to amend" (`p-sharp-check-B:68`), which is D282's, a filed lap | **done, unclosed** |
| D280 | a chime when a final product ships (PostToolUse hook) | `ca8c69df` | the keeper listening once and saying if `chimes.wav` is the wrong sound (`p-chime-A:39`): no record either way. Hook is installed (checked `install.ps1 -Check`: `ok hooks\release-chime.js`) and has fired 4 times (`data\release-chime.jsonl`, last 10-10 15:24Z) | **done, unclosed** |
| D284 | t180: the start line creeps as pieces are added | t180 `9bdd10d` (automatic line stays put on an open track) | (1) B asked for a ruling on closed tracks (`p-startline-B:76`): I searched `loop/` and `librarian/` and found none. (2) The full suite and core harnesses were "owed at landing" (`:68`); I found no record that they ran for this commit. (3) `git tag --contains 9bdd10d` printed nothing, and the D284 plan names the installed build as `8639987`, which predates the fix, so the keeper's installed app does not carry it (inferred for "installed") | **partly done** |
| D286 | two heavy-run slots (part 1, A) and concurrent mutants in the t180 harnesses (part 2, E) | `2b85d151` two slots, `9807cd1b` BUILDING.md, `d8b39cf7` hand-backs | part 2 was PARKED by the keeper at 09:41 ("lets get back to retrieval", plan Amendment 2). Nothing built | **partly done** (part 2 parked, not abandoned) |
| D287 | clean up after ourselves: harnesses delete their temp, a janitor, evidence copied out | `b03d7320` `50ed5c8d` `1dc31c9c` (A), `69d89696` `e23fcb24` (C), `75fd39b9` janitor, `af968170` `46145109` `1e5fe171` (E), `2791105c` `b6e4c689` | plan says "D287 CLOSED". Its queue went to named later work: heavy-run #16/#30 → D289 (done); Rust `temp_dir` → D299 (done, mine); `t180-soak-` and fixed-name temp files → D300 parts 3 and 4 (open). The "05:40 janitor.jsonl line" the plan said it owed: a run exists (`data\janitor.jsonl`, 2026-10-11T11:40Z, apply true, errors 0) | **done, unclosed** |
| D288 | B's findings: light SOURCES matcher (E), mutants copy lists (A) | `1e1ee0e6` `efd00909` `1bd8610c` (E), `1fde903b` `3e428c28` (A), `97691611` `cd8b43e4` `0a958b02` | plan says "D288 CLOSED" | **done, unclosed** |
| D289 | heavy-run survivors #16/#30 (B); ledger-union hot-writer race (C) | `594b05e2` `ccdfb587` `1e27708d` (B), `e407b78b` (C), `b8b52bbd` `a063c1fe` | plan "D289 CLOSED"; `fda086fd` | **done, unclosed** |
| D291 | the digest writer's missing days (E, measure only); H2 split-vs-single registration (B) | `bd16f2c5` `05edc1ae` (E), `eea543c9` (B), `f41b3419` plan | the H2 test itself is sealed and unrun by the keeper's word ("Don't run", D292 plan); the digest repair is D293 | **done, unclosed** |
| D293 | repair the digests (E); a `parts` field on dispatch rows (A) | `4fbd2156` parts, `f751ab26` `e16d6446` digests, `20d1f6b9`, `caf73427` "D292 closed" | none found; `--parts` is in use (rows D295+ carry it, checked in `lap.jsonl`) | **done, unclosed** |
| D295 | catch scoreboard (E), reach re-measure (C), trailing-reminder experiment (A) | `ac1ddfb5` `de52133b` (E), `64262704` (C), `00865fc4` (A registration), `250adbc6` (B read), `c7397ff5` `908f32ac` | plan "D294 CLOSED". By ruling the shadow `1b4cb7c0` did NOT land (checked: not in the log) | **done, unclosed** |
| D296 | the shelf index budget: bar (B), build (C) | `67533a2e` `b1cea9c3` (B), `35a06ffb` `220fd33e` `c2cad4b8` (C), `8e57abf3` read, `c0d77c85` `28972635` (A), `01614ad4` "D296 closed" | the F1–F3 falsifiers need the first strict librarian wake (W0); scorer exists (D298); the build is dormant until then | **done, unclosed** |
| D298 | label-strip bar (B), strip (C), F1–F3 scorer (A), light-mode reach (E) | `69b420c4` `fa94180b` `fc5549c5` `0fb00330` `bc9a70c9` (B,C), `110f767a` `60b95ce0` (A), `1baf5c8c` (E), `562c1a77`, `613921a9` "D297 closed" | the E result feeds the ~10-17 mode decision | **done, unclosed** |
| D299 | claim-first titles: survey (E), bar and pick (B), build (C); Rust temp sites (A) | `2aa88635` `c2b7cd00` `98d52ad4` `37263acf` `2a40ff10`, `1455e5c3` `13f4c864` (A), `a0ee8d16`, `700128c8` "D299 closed" | pick was NONE, so nothing to build; plan "D299 CLOSED" | **done, unclosed** |

Abandoned or superseded: **none** found. D286's part 2 and D277's H2 are parked or sealed by the keeper, not dropped.

## Close rows written (12; `filed --holder librarian --by panes`, each with a note pointing here)
D275, D279, D280, D287, D288, D289, D291, D293, D295, D296, D298, D299. Every one was accepted; the writer's gate printed "an audited delivery to librarian precedes this row" (my earlier rings). None was refused, so none was forced.
That is 12 of the 15; D277, D284 and D286 I left open for the librarian (above).

## Judgement calls the librarian may overrule
- **D287 and D296 closed with things queued or pending.** I took the librarian's own "CLOSED" section as the disposition, because it names who owns each remainder. If a lap should stay open until its queue empties, D287 (fixed-name temp, `t180-soak-`) and D296 (W0 scoring) are the two to reopen.
- **D280 closed with the keeper's ear unchecked.** Nothing in the record says the sound was heard or rejected.
- **The ledger/plan id offset** (above) is a reading hazard for whoever scores laps by id.

## Not checked
- That v0.1.1 (D275) exists as a release: the plan says released; I did not open it (inferred).
- Whether the full suite ran for t180 `9bdd10d`.
- D281: a ledger lap with rows and no chain row (not in the open list); I did not look further.
- I did not read each hand-back whole; "owed" comes from the plan's closing sections and each hand-back's NEXT / not-run lines.

NEXT: librarian rule on D277, D284 and D286, and on whether to accept the new "unwitnessed" count or write working rows, when this is read
