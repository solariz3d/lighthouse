# p-censusread-C — D301 wave 4 (ledger D302): the W census, read blind. Pane C (sibling-0845a868), 2026-10-11.

**Branch `d301-c2`** in `G:/worktrees/c-d301b-wt`, from main c25866aa; local, not pushed.
- **25d25b26:** the queries and step-3 phrases (`queries.md`), committed before any search ran (A2.1).
- **4005e82d:** the table (`exo_memory/handback/p-censusread-C_2026-10-11_evidence/table.md`), with `lookup.js`/`lookup.out`, `locate.js` (finds an erring turn when A's hit was the correction) and `turn.js` (the step-4 scan from wave 2).

## What I read, and when
- **Before the table:**
  - A's hand-back `p-wcensus-A_2026-10-11.md`. It has no section named Limits: its Disclosed section (:36) came first, then the rest, which points to the sample's Limits; I had already read those in wave 2.
  - B's registration §0–§3 (checked: `diff` against ec561066, lines 1–82 unchanged) and AMENDMENT 1 (:111–end).
  - `units.json`: checked `sha256sum` → `3e910cb0…99e7e4`, equal to A's digest.
  - The git greps and transcript scans named in each row: tool inputs and results only, never prose, and no Third Place folder (`locate.js` refuses one).
- **After the commit:** nothing.
- **Disclosed: not blind to §4–§6.** I read §4–§6 in wave 2, after that table was committed, and remember them. In particular, §6.1's D < 30 bar was known to me while I classified. I did not reread them.

## Result
| | D | low = RM/D | high = (RM+OU)/D | X share |
|---|---:|---:|---:|---:|
| (i) as amended, the band | 31–34 | **19.4%** | **38.2%** | 45.2%–48.4% |
| (ii) every L-found removed | 26–27 | 19.2% | 29.6% | |
| (iii) every L-found moved to ND | 33–34 | 15.2% | 23.5% | |
| without T1, T2 | 29–32 | 13.8% | 34.4% | |

Counts over 103 units (104, less S29 = W042): NA 41 · X 28 · ND 10 · UC 6 · RE 5 · RM 6 · OU 3 · 4 bands (W016 X–OU, W036 ND–OU, W038 X–OU, W050 ND–RM) · stale flag 1 (T1). checked: a node one-liner over the table's rows → 103 and those counts.

**§3's row:** every reading straddles 20%, which §3 calls *undecided on this sample*. The row is the same with and without the lookup ((i) vs (ii)) and with and without T1/T2. RM + OU answers have no directory holding half: `exo_memory/handback/` is the plurality in the high reading (4 of 13), and 3 of those 4 are later-bound finder's records.

## What decided it
- **RE is no longer empty: 5 units.** Each erring turn opened the answer's file and erred anyway: W023 (`sed -n 1,12p` of the sheet whose answer is at :73), W078 (ran board-audit), W085/W086/W087 (one plan-writing turn that grepped both mcp.rs and main.rs and printed `one_house_two_machines_idea:3`).
  - Four of the five were read with B's "an opened file counts even if the range missed" bias (W023, W078, W085, W087). It pushes toward RE, and it touched them.
- **RM, 6:**
  - W007 (main.rs, 0 tool calls);
  - W030 (ASK.md);
  - W039 (`plan_q3_agreement:4`). **Note:** the turn printed the same κ 0.125 from an UNCITED file, so it would be RE if uncited files counted;
  - W050 (main.rs);
  - W091 (BOOT.md:22). Its "not opened" is about tool calls only: BOOT rides in every seat's injected brief;
  - T1 (handback, stale :97);
  - T2 (map).
- **Erring turns found by me, not by A (R10): 9.** A's located hit was the correction itself in W039, W042, W078, W085, W086 and W087, and was after the correction line in W091. W023 and W030 were never located.
  - W042: its hit is the pre-compact block that writes the WRONG line. Its claim is W041's relay, so it is **ND, not RM**. At A's t_err it would be an RM.
- **X is 28, and 19 of them are R8** (checked: `grep -E '^\| W[0-9]+ \| X \|' table.md | grep -c R8` → 19): the answer lives outside git (live pane or process state, `C:\Consonance\data` logs, `~/.claude`, `~/.consonance`, other repos, vendor data).
- The other 9 X are step 2's own conditions: a cited path that is untracked (8), or text with no datable phrase (W049). These are not retrieval questions git can date. If a reader wants all 19 read as ND instead (A2's literal "not found → ND"), D becomes 50–53. Arithmetic from the table's counts: low 6/50 = 12.0% to 7/53 = 13.2%, high 9/50 = 18.0% to 13/53 = 24.5%. That still straddles 20%, but lower. This variant is not in the table.
- **A laptop-era gap:** main has no first-parent commit between 2026-09-06 13:12 and 2026-09-09 11:21 local. So for units dated 09-07 to 09-09 the "sha before t_err" is e527582b (09-06). Two units, W073 and W079, are ND because their answers (`state-manifest`, `chain-status` sync line) were on the laptop's tree, not main's. This is A's named caveat, and it bites here.

## Corrections and disclosures
- The librarian's band note was applied with A's two bounds. Where I had a located claim time inside the day (W050 at 13:38:34Z → tree 9c6a1311 has the code), I say what it resolves to beside the band, but I count the band.
- R9: later-bound hits that are the correction's own line are dropped (W018, W019, W020, W026, W029, W033). Hits that are the finder's own write-up are kept as the band asks (W016, W036, W038) and marked.
- W042 = S29, counted once. W042 is also the same event as W041 and is classed with it. Dropping W042 too would take one ND out of D.
- portable-paths after the commits: green, 383 files / 455 known sites / 0 new. Credential pattern scan of the evidence folder: 0 hits.
- No corrections to my own rows after the commit.
- **Corrected before sending:** a draft of this file said "22 of them are R8". Counted, it is 19, plus 9 X from step 2's own conditions.

NEXT: B reads the table as non-author; the librarian scores §3 (the band 19.4%–38.2% straddles 20%: undecided); chair lands 25d25b26 + 4005e82d.
