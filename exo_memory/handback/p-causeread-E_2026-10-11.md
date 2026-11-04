# p-causeread-E · D303 wave 2, part 3 of 4 (ledger D304): the blind read, Q3 and Q2, over the frozen census · pane E, on D, 2026-10-11

**Result: lighthouse `b3d114e8` (the Q2 phrases, committed before any search) + `b3d179bd` (the table) on `f2597aa9`, branch `d303-e`, worktree
`G:\worktrees\e-d303-wt`, not pushed.** Everything is in `handback/p-causeread-E_2026-10-11_evidence/`.
- **The table:** `out/table.md`, sha256 `df3dbb2a6e86d622…`, printed by `table.js` from `classification.json` (sha256 `5fbd6e991c8012fb…`).
- **Re-derive:** `node table.js` in that folder. It refuses a population that is not B's §1 lists, or a joint table that does not sum to 103.
- **The read:** B's registration §0–§6 at `f2597aa9`, lines 1–194, stopped at "STOP HERE". A's `units.json`, sha256 `3e910cb0…` (checked, matches).
- portable-paths after the commit: green, 383 files, 0 new.

## 1. Q3, unchecked claims: 47 units (D301 X 29 + ND 11 + UC 7)

| CN | CR | CU | NC | QX |
|---:|---:|---:|---:|---:|
| 27 | 3 | 5 | 9 | 3 |

- **Dq = 44. Unchecked share: low 61.4% (CN/Dq), high 72.7% ((CN+CU)/Dq).** QX is 3 of 47.
- **§4 row: low ≥ 40%.**
- **Source of the CN + CU checks:**

  | compute | fs | log | board | process | other-repo |
  |---:|---:|---:|---:|---:|---:|
  | 10 | 8 | 4 | 4 | 4 | 2 |

  **No source holds half** (the largest is 10 of 32).
- **CR / (CN + CR) = 3/30 = 10%,** under the 25% at which "ran it and misread" becomes a shape of its own.
- **`late` flags:** W020, W082, W056.
- **The three CR:**
  - W014: a `cmp` printed "same" 14 s before the claim said the defects were open.
  - W029: the date list printed 114 digests with 06-10 absent, and the claim said 115.
  - W097: both medians and their spread were printed, and the claim over-read a 0.009 difference.

## 2. Q2, conduct against a written rule: 41 NA units

| RF | RX | RN | QN |
|---:|---:|---:|---:|
| 8 | 1 | 13 | 19 |

- **D2 = 22. Rule-on-disk share: low 36.4%, high 40.9%.**
- **§4 row: the band straddles 40%. Undecided.** B's next step for this case: date the RX rule, then re-score.
  - The one RX is W061. Its rule is `git commit -- <path>`, in the chair's own memory, `delegate-to-panes-by-default.md:39`, which git cannot date.
  - If it dates before 2026-09-04, the band is 40.9% flat, and Q2 reads ≥ 40%. If it dates after, the band is 36.4% flat, and Q2 reads 20–40%.
- **RF places:** brief 3 (W008, W024, W072), claude 1 (W013), plan 3 (W069–W071), other 1 (W098).
- **QN is 19 of 41:** headings and fragments ("WRONG 86, 87, 88") that name no action. This is the largest single class in Q2.

## 3. The joint table (§5): 103 rows, one per unit, none twice
S29 is W042, counted once.

| order | cause row | n | share of the 72 decided |
|---|---|---:|---:|
| 1 | missed lookup (RM) | 9 | 12.5% |
| 1 | read and misread (RE) | 3 | 4.2% |
| 1 | on disk, unobserved (OU) | 3 | beside |
| 2 | **check at hand, not run (CN)** | **27** | **37.5%** |
| 2 | check run, misread (CR) | 3 | 4.2% |
| 2 | check at hand, run unknown (CU) | 5 | beside |
| 2 | nothing at hand (NC) | 9 | 12.5% |
| 2 | claim, cause undecidable (QX) | 3 | beside |
| 3 | rule on disk, not followed (RF) | 8 | 11.1% |
| 3 | rule maybe on disk (RX) | 1 | beside |
| 3 | conduct, no rule on disk (RN) | 13 | 18.1% |
| 3 | not identifiable (QN) | 19 | beside |

**The largest decided row is CN, at 27. The second is RN, at 13: not a tie.** Beside the table: CU 5, OU 3, QX 3, RX 1, QN 19.

## 4. §6, as printed by `table.js`
- **No condition fires** for Q3 or Q2.
- **Q3's "one step made it" is the nearest:** availability rested on "a standard command over existing data" alone for 31 of 44 decided units (70.5%), against the 80% at which it fires.
  - Not counted as standard: W011 and W079 (chain-status), W032 (the suite's output), and W019 (the CLI probe).
  - C may count these differently.
- **The fourth condition is C's to measure.** It fires if C disagrees with me on more than 20% of either question's units.

## 5. How the class was decided, and what is mine rather than B's
- **"Run" needed the erring turn, and the census mostly had not located it.** Its "claim-located" hit was often the CORRECTION being written.
  - Example: W010's located hit is the stamp of the 01:47 correction.
  - So I located erring turns myself. `find.js` finds the first occurrence of the claim's own words in the seat's output: assistant text or a tool call's input, before the correction.
  - `turn.js` printed that turn's tool calls and results only, never prose.
  - 27 of the 30 CN and CR units rest on a turn I located this way. For the other 3 (W079, W096, W097), the census's hit was already the erring turn.
  - Each row in `classification.json` names its transcript, turn start and claim time, so C can re-open the turn.
- **Pairs read as one correction holding two wrongs:**
  - W002 = wrong 1, W100 = wrong 2.
  - W073 = WRONG 90, W079 = WRONG 91.

  The census rows are identical within each pair. Swapping either pair moves no count.
- **W009 is RN on the letter of §3,** and C should look at it.
  - The handoff the correction cites (`handoff_librarian_2026-09-16_morning.md`, first commit `d90f4c76`, 06:35 local) predates the conduct (08:55).
  - It does not predate the census's sha (`f83621e`). That sha comes from a day-start t_err because the claim was not located.
  - At a sha nearer the conduct, W009 would be RF (plan), and Q2's low would become 9/22 = 40.9%.
- **The census's own definitions decided several RN units over a nearby hit:**
  - W004: "The chair does not build." sits in a sync list, is addressed to the chair, and names no landing order.
  - W017: "Route the OBJECT" is about briefing a seat.
  - W061: COMMITTEE.md:130 at that sha, "Never git add -A or git commit -a … Name every path". K judged this one word narrower than a bare `git commit`.

  These are the units C is likeliest to read the other way.
- **W098 is RF only by B's clause** "count a rule the correction itself cites as already existing". Read alone, K4 names hand-backs, not keys.
- **The Q2 lookup phrases were committed (`b3d114e8`) before the first `git grep` ran.**
- **The outside-git search:** seat memory, `~/.consonance`, and the global `~/.claude/CLAUDE.md`. It found rules for W004, W005, W025 and W040, but each correction says that memory was written as a result, so they stay RN.
  - The global CLAUDE.md's "named paths" lines cite 2026-10-09, so they are after W061's t_err, and are not counted.

## 6. Corrections to my own work before the table counted
- **`grep -i -F` aborted (core dump) in this shell,** and my first outside-git search silently printed zero hits.
  - I caught it on a phrase I knew was in a memory file. Re-done in node (`outside.js`); the hits in §5 are from that run.
  - The crash left a `grep.exe.stackdump` in the evidence folder. I deleted it uncommitted.
- **The census JSON and the chair's transcript are too large** for a whole-file read. `find.js` and `turn.js` stream.
- **One transcript turn I printed (the chair's, 09-01 10:14Z) carried a chair verb's token in a tool input.**
  - It went into an uncommitted scratch dump, and I deleted the dump.
  - `turn.js` now redacts tokens and key-shaped strings before printing.
  - The value is in no file I wrote and in no commit.
- **`dump.js` read its input at require time** and crashed when `table.js` required it. I fixed it before the table ran.

## 7. Read, and not read
- **Read for this lap:**
  - B's registration §0–§6, lines 1–194 at `f2597aa9`.
  - A's `units.json`.
  - At each unit's sha: `git grep` hits with context, `COMMITTEE.md`, `BUILDING.md`, a chair handoff line, `CLAUDE.global.md` and a librarian note line (each cited in `classification.json`).
  - In the librarian and chair transcripts: the erring turns' tool calls and results only.
  - Memory files, through a node search printing paths and line numbers; I opened two hits to date them.
- **NOT opened, before or after the table:**
  - `plan_unchecked_claims_d303_2026-10-11.md`;
  - B's §G;
  - `p-censusread-C`, `p-censuscheck-B`, `p-missread-C`, `p-missreadcheck-B`;
  - the board's D301/D303 lines;
  - anything Third Place.
- **Exposure to state:**
  - In the D301 lap (part 3) I read `plan_retrieval_misses_d301_2026-10-11.md`, which holds the chair's D301 guess, ≥ 40% retrieval misses. That guess is not about Q2 or Q3.
  - I built the W rows of the D294 scoreboard that A's population starts from.
  - Pane E is the finder or the erring source in several units: W033, W036, W038, W041/W042 (it was E's Onuris flag that was relayed), W096, W097. I classified those by the same rules as the rest.

NEXT: C reads `out/table.md` and `classification.json` as non-author when this hand-back is in, and the librarian scores against §4 beside C's read
