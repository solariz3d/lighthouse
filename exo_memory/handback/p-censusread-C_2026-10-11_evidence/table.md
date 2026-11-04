# D301 wave 4: the W census, read blind (pane C, sibling-0845a868, 2026-10-11, ledger D302)

**Definitions:** B's registration §0–§3 plus AMENDMENT 1 (A1–A4). §4–§6 were NOT read before this commit.
**Units:** `handback/p-wcensus-A_2026-10-11_evidence/out/units.json`. checked: `sha256sum` → `3e910cb0397c651ba763a653a00e4247e6c6a13895ab90f41342cfa0d499e7e4` (A's digest); 104 units.
**Queries:** committed first, in `queries.md` (25d25b26), before any search ran. Lookup output: `lookup.out` (from `lookup.js`). Step-4 turn finding: `locate.js`, plus wave 2's `turn.js` (tool inputs and results only, never prose).
**The librarian's two notes:** S29 = W042, counted once. Day-start units are run at both of A's bounds, and a unit whose class differs between them is reported as a band.

## Rules (carried from wave 2, where B agreed with 57 of my 58 NA/X calls; R8–R11 are new and settled before the counts)
- **R1 to R3:** NA when the entry names no statement I can quote (A1): an error of conduct, a proposal, a heading or fragment with no stated claim, or a slip caught before it was said.
- **R7:** a bare `main.rs` is `consonance/src-tauri/src/main.rs`.
- **R8, undatable inputs:** when the answer's only source is outside git (live pane or process state, a log or data file in `C:\Consonance\data`, `~/.claude`, `~/.consonance`, another repo, a vendor file or doc), and no repo file holds it at the sha, the unit is **X**. Git cannot date it. This is step 2's untracked condition, which A2 keeps.
- **R9, the correction's own record:** a lookup hit on the correction's own line never counts (B §2). Where a hit at the later bound is the FINDER's write-up of the very finding the correction reports, I keep it, as the librarian's band note asks, and mark it "finder's record". It postdates the claim by construction.
- **R10, the erring turn:** where A's located hit is the correction itself (the hit turn writes the WRONG entry), I searched for the real claim turn with `locate.js` and used that. If the turn can't be found, the unit is **OU**.
- **R11, multi-claim entries:** an entry naming several wrongs is split in order across its W rows (W002/W100, W073/W079, W084/W085/W086, W087/W088). An entry with several wrongs and one row takes its first quotable wrong.

## The table
Abbreviations: **Lf** L-found, **Ln** L-notfound, **s3** step 3 on a cited path, **t** the t_err bound, **c** the correction bound.

| unit | class | deciding field or hit | lookup | answer dir (miss) | stale |
|---|---|---|---|---|---|
| W001 | NA | heading only ("the first two catches are in the letter") | | | |
| W002 | X | wrong 1: "`~/.consonance/resonance` does not exist"; the answer is that directory (outside git), R8 | | | |
| W003 | X | "that proves the whole mechanism"; answer in `log.txt` (untracked, AC) | | | |
| W004 | NA | conduct (landing orders naming files to edit) | | | |
| W005 | NA | conduct (handing the keeper a git command) | | | |
| W006 | X | "two 600-s waits"; answer from `persist.log` (untracked); A's hand-back is after t_err | | | |
| W007 | **RM** | "fills the window before I open a file", 2026-09-16T15:31:09Z. s3: `SHELL_SOFT_CEILING: usize = 140_000` at d5d954d3 (main.rs:4211). The erring turn has 0 tool calls (wave 2 S01) | | consonance/src-tauri/src/ | — |
| W008 | NA | conduct (rings without a final NEXT line) | | | |
| W009 | NA | conduct (omission: a rebuild not called) | | | |
| W010 | X | "the other three were hard freezes"; Ln, 0 hits on the 3 queries; the answer is Windows event-log fields, R8 | Ln | | |
| W011 | X | "an unfiled lap older than a day goes unnamed at wake"; the evidence is a replay over the ledger (`lap.jsonl`), not tracked (checked: `git ls-tree` 0), R8 | | | |
| W012 | X | "0 forced"; the answer is in board and capture logs (untracked), R8 | | | |
| W013 | NA | conduct (a destructive misreading) | | | |
| W014 | X | "C's two blind-guard defects were open"; the cited paths don't hold it (plan = correction's own; mcp.rs:781 is another item); the evidence is the installed hook vs the repo, R8 | | | |
| W015 | NA | R2: caught in the same turn (a vacuous recompute) | | | |
| W016 | **band X–OU** | (2) "100,000,000" for the hard limit. t: Ln. c: Lf at `handback/p-d115-board-B_2026-09-22.md:16` and `map/B.md:1769`, B's finder's record. Claim turn not located (only the correction found, 20:50:43Z) | Lf (c) | exo_memory/handback/ | — |
| W017 | NA | fragment: the statement is cut off before the unit's text begins | | | |
| W018 | X | "C was still logged out"; Ln (the c hit is the correction's own line); live pane state, R8 | Ln | | |
| W019 | X | "`--setting-sources project` gives 0 hooks"; Ln (the c hit is its own line); a probe of the CLI and user settings, R8 | Ln | | |
| W020 | X | "A finished ~03:14 and never rang"; Ln (the c hit is its own line); file mtimes and the queue, R8 | Ln | | |
| W021 | X | "no B here"; answer `data/panes.json` (untracked) | | | |
| W022 | X | "the real ~/.claude untouched"; answer in `~/.claude/projects` (outside git) | | | |
| W023 | **RE** | "Solid was never answered", turn 2026-09-26T09:26:59–09:28:14Z. Lf: `loop/solid_decision_sheet_2026-09-23.md:73` "THE KEEPER'S ANSWER" (and trip-check.js:186, usage.js:6) at both bounds. The turn ran `sed -n 1,12p loop/solid_decision_sheet_2026-09-23.md`: opened, range missed the answer | Lf | exo_memory/loop/ | — |
| W024 | NA | conduct | | | |
| W025 | NA | conduct (committed a private plan) | | | |
| W026 | ND | "the stage-2 coder is E"; Ln at both (the c hit is its own line); no command | Ln | | |
| W027 | NA | the count is not given | | | |
| W028 | X | "98 journals"; Ln; the journals counted are not the repo's (36 .md, 0 .bak tracked at b214e3a3), R8 | Ln | | |
| W029 | X | "115 daily digests"; Ln (the c hit is its own line); digests not tracked, R8 | Ln | | |
| W030 | **RM** | "no reader in four months", turn 2026-09-27T17:22:30–17:26:40Z (written at 17:23:30Z). s3: `ASK.md:80/:92/:149` "ANSWERED 2026-09-20 / 2026-09-24" at both bounds. Turn: 4 Bash and 1 call, nothing names ASK.md | | exo_memory/ (ASK.md) | — |
| W031 | NA | conduct (queueing) | | | |
| W032 | X | "the 6 TODOs were A's doc-geom join"; answer in the T-180 repo (`src/geom/path.js`, untracked here) | | | |
| W033 | ND | "25-43 ms"; Ln at both (the c hit is its own line); B's new bench on the combined tree (text: claim 20:1x, bench 21:02) | Ln | | |
| W034 | X | "friction 0.05, nearly ice"; Ln (the 3 "tyre grip" hits are the design doc that carries the correction itself); answer in Thunderhead's car data, R8 | Ln | | |
| W035 | X | the relayed "heading lag" diagnosis; answer in `ui_track.json` (untracked, T-180) | | | |
| W036 | **band ND–OU** | "runs" as the size source. t: Ln. c: Lf at `handback/p-d182-vocab-A_2026-09-27.md:182` and `map/A.md:1610`, A's correction record. Claim turn not located | Lf (c) | exo_memory/handback/ | — |
| W037 | NA | conduct (method) | | | |
| W038 | **band X–OU** | the lag candidates (a per-frame rebuild). t: Ln, and E's evidence is a run of the T-180 app (R8). c: Lf at `handback/p-d195-E-lag_2026-09-30.md`, E's finder's record. Claim turn not located (09:28Z hits are the correction) | Lf (c) | exo_memory/handback/ | — |
| W039 | **RM** | "drift flags were weak … 8 of 30" as evidence against Jev, turn 2026-10-01T09:51:40–09:54:30Z (the 10:04Z hit is the correction). s3: `plan_q3_agreement_2026-09-27.md:4` "(κ 0.125)" at f239387c. The turn never names that file. **Note:** it printed "reader B vs reader C κ 0.125" from an uncited file (`jev_r2r3_score`/`plan_jev_off`), which would be RE if uncited files counted | | exo_memory/loop/ | — |
| W040 | NA | conduct | | | |
| W041 | ND | relayed "Onuris is the friend's private project", 2026-10-07T03:56:25Z; Ln at 0650ffda (0 hits ×3); the keeper's word came at 21:5x local, and map/A.md:1815 lands at 04:19Z | Ln | | |
| W042 (= S29) | ND | **the same relay as W041.** The located hit (07:42:54Z) is the pre-compact block that WRITES this WRONG line (R10). At W041's sha: Ln. At A's sha (af36ab79) it would be Lf (map/A.md:1815 and others), so A's t_err would make it RM. Counted once for S29 | Ln (at W041's t_err) | | |
| W043 | NA | conduct (sequencing) | | | |
| W044 | UC | "no event this harness exposes precedes the composition"; C's scorecard over the run2 trial transcripts, which are tracked (190 files at d7895f87) | | | |
| W045 | **OU** | "0.34 tokens/byte was the shelf alone". s3: `librarian/2026-08-22.md:99,127` "CLAUDE.md 1,995,532 bytes" at both bounds. Claim turn not located ("shelf alone": no hit) | | exo_memory/librarian/ | — |
| W046 | NA | conduct ("in no order") | | | |
| W047 | ND | "the route works anyway because the MCP tool instructions name call_librarian"; no query can state an absence (queries.md), so Ln by A2's letter | Ln | | |
| W048 | NA | a proposal (a one-liner fix shape) | | | |
| W049 | X | "an evictor with an empty queue … against its own 30k floor"; the answer is main.rs code with no distinctive phrase: text undatable | | | |
| W050 | **band ND–RM** | "prints unconditionally". t (d7895f87): no `let dated`. c (63d03eb1): main.rs:4857 `let dated … = windowed.iter()`. The located claim (13:38:34Z) is at tree 9c6a1311, which has it, so it resolves to RM. Turn 13:36:20–13:39:09Z: no call names main.rs | | consonance/src-tauri/src/ | — |
| W051 | **OU** | "quiet, unconfirmed, stale, idle". Lf: `consonance/ui/app.css:372-376` declares quiet / waiting / unconfirmed / idle, with no `chain-stale` (checked: count 0), at both bounds. The ~01:40 claim turn is not located | Lf | consonance/ui/ | — |
| W052 | NA | fragment ("WRONG 70") | | | |
| W053 | UC | "247 run artifacts"; a count over `loop/run1/items/` (tracked, 16 at 948ca3e8) | | | |
| W054 | UC | "7,479 + 15,753 = 23,232 … ~10 of 12 cards fit"; arithmetic over the tracked budget and cards | | | |
| W055 | NA | fragment: the statement is cut off before the text | | | |
| W056 | UC | "registry :353 … every \s lost its backslash"; printing the tracked line; the cited SPINE.md does not hold it | | | |
| W057 | NA | fragment ("WRONG #68 mine") | | | |
| W058 | UC | the 04:15 zeros under a printed command that does not reproduce them; a re-run over tracked `ui/index.html` | | | |
| W059 | X | "Two roof checks in one class"; answer in `WearNTear.cs` (Valheim) and an untracked `building.md` | | | |
| W060 | **OU** | the map cited "COMMITTEE.md:133" for the push rule. s3: `COMMITTEE.md:146` "Nothing is pushed by a seat" at 1f090473. A laptop-column entry; the located 07:06Z hit is item (2) | | consonance/src-tauri/brief/ | — |
| W061 | NA | conduct (a commit captured K's files) | | | |
| W062 | X | "K mid-edit"; answer in the working copy's diff (uncommitted), R8 | | | |
| W063 | NA | heading only | | | |
| W064 | ND | the handoff listed the `os.getenv('HOME')` residual as a code site; Ln (0 hits ×2 at e527582b) | Ln | | |
| W065–W071 | NA | headings only (WRONG 77–83 named, no statement) | | | |
| W072 | NA | conduct (a commit captured four staged files) | | | |
| W073 | ND | WRONG 90, "a 300 MB board is refused at the first push"; s3: "pre-sync" absent from main's tree at e527582b (main has no first-parent commit between 09-06 13:12 and 09-09 11:21 local: the laptop era landed later) | | | |
| W074–W077 | NA | headings only | | | |
| W078 | **RE** | the plan's "rows behind the running ts maximum" as the dedup rule, turn 2026-09-09T06:12:59–06:18:45Z (the 09:59Z hit is the correction turn). s3: `board-audit.js:62` "the replay tell" at e527582b. The turn's Bash ran board-audit (06:13:53Z): opened | | consonance/tools/ | — |
| W079 | ND | WRONG 91, "chain-status.js prints two hashes"; s3: "in sync?" absent from chain-status.js at e527582b (the laptop-era lag, as W073) | | | |
| W080 | ND | "caught by the greyed-prompt-row frame C already has on disk"; Ln ("replay artifact" 0 hits) | Ln | | |
| W081 | NA | a proposal (score by FORCED "not rising") | | | |
| W082 | X | "you are idle" (to the chair); Ln (the 3 hits are main.rs's QUEUED message, an unrelated sense); live state, R8 | Ln | | |
| W083 | NA | heading only | | | |
| W084 | X | WRONG 96, "P1a renamed cwds that already match"; Ln; the answer is directories on D's disk, R8 | Ln | | |
| W085 | **RE** | WRONG 97, P2 "not through git", plan written at 2026-09-11T08:14:24Z (turn 08:12:35–08:15:02Z; the 08:21Z hit is the correction turn). Lf: `loop/one_house_two_machines_idea_2026-09-08.md:37` "just use the repo" (and two_machines_lap_plan:3). The turn's 08:12:42Z output printed `one_house_two_machines_idea_2026-09-08.md:3`: opened, range missed :37 | Lf | exo_memory/loop/ | — |
| W086 | **RE** | WRONG 98, "mcp.rs already binds a TcpListener … over the LAN", same turn. s3: `mcp.rs:1525` `bind("127.0.0.1:0")` at ec884940. The turn ran `grep -nE "TcpListener\|bind\(\|listen" consonance/src-tauri/src/mcp.rs` (08:14:25Z): opened | | consonance/src-tauri/src/ | — |
| W087 | **RE** | WRONG 99, the premise that a matching slug lets a pane resume, same plan turn (A's 08:19Z chair hit matched only a path name). s3: main.rs:5387 `fn resume_pane`: "we NEVER `--resume` here". The turn ran a grep over main.rs (08:13:04Z): opened | | consonance/src-tauri/src/ | — |
| W088 | X | WRONG 100, "4-of-4" measured directories; the answer is in `~/.claude/projects`, R8 | | | |
| W089 | ND | WRONG 101, plan §8 bar (2) prefix hash; the cited tests and hand-back come after t_err at both bounds; A's new spec-hole test | | | |
| W090 | X | WRONG 102, the attic addresses; the answer is file timestamps outside git, R8 | | | |
| W091 | **RM** | "it cannot lose, so it carries nothing", turn 2026-09-14T07:14:25–07:14:57Z (A's hit is after the correction line). Lf: `exo_memory/BOOT.md:22` (the repair, ASK-008, "whether or not it were true") at both bounds. Turn: 1 Bash, nothing names BOOT. Note: BOOT is in the seat's injected brief, which is not a tool call (A's limit) | Lf | exo_memory/ (BOOT.md) | — (the struck form stands at BOOT:22 as a trace; not opened in the turn) |
| W092 | X | WRONG 104, "A's re-confirmation pass"; the answer is in the process list, R8 | | | |
| W093–W095 | NA | headings only | | | |
| W096 | X | WRONG 108, "grew 428,177 B"; Ln; transcript byte offsets, R8 | Ln | | |
| W097 | UC | WRONG 109, "THE GAUGE MEASURES CONTENT UPTAKE, NOT ANCHORING"; Ln; E's re-reading of the seat's own results (a computation over data the seat had) | Ln | | |
| W098 | NA | conduct (the key sealed inside the search space) | | | |
| W099 | NA | heading only | | | |
| W100 | X | wrong 2, "`stale-digest-is-not-a-deliverable.md` does not exist"; it exists in Main's private memory tier (outside git), R8 | | | |
| W101 | X | "B hasn't started its half"; answer in `board.jsonl` (untracked); same as wave 2 S32 | | | |
| T1 | **RM** + stale | the librarian's correction: the claim is D300's original part 3, turn 2026-10-11T20:36:24–20:37:15Z. s3 at 700128c8^: `p-heavyrunmut-B_2026-10-11.md:10/:20` (#16, #30 done). Not named in the turn (wave 2). At A's sha (fc946c52, the 03:02Z line) the answer didn't exist yet | | exo_memory/handback/ | `loop/plan_clean_up_after_ourselves_2026-10-10.md:97`, printed by the turn's own grep (20:36:36Z) |
| T2 | **RM** | `p-soakclean-E_2026-10-11.md:109`, 23:52:56Z. s3: `map/A.md:1815` "public community track" at 83188cb1. E's turn read only its own hand-back (wave 2) | | exo_memory/map/ | — (no file stating the old rule opened) |
| S29 | (= W042) | counted once, under W042 | | | |

## Counts (103 units: 104 minus S29)
| class | units |
|---|---:|
| NA | 41 |
| X | 28 (+2 in the low reading: W016, W038) |
| ND | 10 (+1 in the low reading: W036; +1 W050) |
| UC | 6 |
| RE | 5 (W023, W078, W085, W086, W087) |
| RM | 6 (W007, W030, W039, W091, T1, T2) (+1 in the high reading: W050) |
| OU | 3 (W045, W051, W060) (+3 in the high reading: W016, W036, W038) |
| bands | 4: W016 X–OU, W036 ND–OU, W038 X–OU, W050 ND–RM |
| stale flag | 1 (T1) |

checked: a node one-liner over this file's table rows (grouped rows W065–W071, W074–W077 and W093–W095 expanded; S29 skipped) → 103 units: NA 41, X 28, ND 10, UC 6, RE 5, RM 6, OU 3, band 4.

## Shares, by §3 (each band unit at its less-miss class for the low reading, its more-miss class for the high)
| | D | RM | OU | low = RM/D | high = (RM+OU)/D | X share = X/(103−41) |
|---|---:|---:|---:|---:|---:|---:|
| (i) low reading | 31 | 6 | 3 | 19.4% | 29.0% | 30/62 = 48.4% |
| (i) high reading | 34 | 7 | 6 | 20.6% | 38.2% | 28/62 = 45.2% |
| **(i) the band** | | | | **19.4%** | **38.2%** | |
| (ii) every L-found removed (W016, W023, W036, W038, W051, W085, W091) | 26 / 27 | 5 / 6 | 2 / 2 | 19.2% / 22.2% | 26.9% / 29.6% | |
| (iii) every L-found moved to ND | 33 / 34 | 5 / 6 | 2 / 2 | 15.2% / 17.6% | 21.2% / 23.5% | |

**Without the two seeded units (T1, T2):** D 29 / 32; low 4/29 = 13.8% to 5/32 = 15.6%; high 7/29 = 24.1% to 11/32 = 34.4%.

**§3's row:** the band runs 19.4%–38.2% and **straddles 20%**, which §3 calls *undecided on this sample*. (ii) gives 19.2%–29.6%, (iii) 15.2%–23.5%, and without T1/T2 13.8%–34.4%: each straddles 20% too, so the row is the same in all four and does not rest on the lookup (A3). Lookup-decided units in D: 15 of 34 (L-found 7, L-notfound in D 8), 44%.

**Where the RM + OU answers lived (high reading, 13):** exo_memory/handback/ 4 (T1, W016, W036, W038) · consonance/src-tauri/src/ 2 (W007, W050) · exo_memory/ root 2 (W030 ASK.md, W091 BOOT.md) · exo_memory/loop/ 1 · exo_memory/map/ 1 · exo_memory/librarian/ 1 · consonance/ui/ 1 · consonance/src-tauri/brief/ 1. No directory holds half; handback/ is the plurality, and 3 of its 4 are later-bound finder's records (bands). **Low reading (9):** exo_memory/ root 2, the other seven 1 each; no plurality above 2.
**Stale flag:** 1 of 6 RM (T1); 1 of 7 in the high reading.
