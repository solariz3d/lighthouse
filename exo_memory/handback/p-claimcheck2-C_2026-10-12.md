# p-claimcheck2-C — D305 wave 3, item 7 (ledger D306): the one revision of the claim check, against the same bar. Pane C (sibling-0845a868), 2026-10-12.

**50a9f71f** on `d305-c2` (`G:/worktrees/c-d305b-wt`, from main 4b077884; local, not pushed).
- **Files:** `consonance/hooks/claim-check.js` and its test. The adapter is unchanged.
- **Evidence:** `exo_memory/handback/p-claimcheck2-C_2026-10-12_evidence/`. It holds both replay reports (without claim text), the red, green and final logs, the mutant runner and its log, and the replay log with the by-class split.
- **The switch stays OFF.** checked: `grep -c claim_check ~/.consonance.json` → 0.

## What the revision changes (aimed at B's categories, not at any unit)
**Bare numbers** (B: 194 week flags; "list numbers" a named misfire):
- A bare single digit 1–9, with no unit and no decimal, is no longer a figure. Examples: "2 rules", "7 commits". These are the number words E had already left out, written as digits.
- Nor is a label number: after part, item, step, lap, row, line, section and the like, or an enumerator "(14)".
- Zero stays a figure ("0 hits" is a claim). So do multi-digit counts, decimals, and anything with a unit.

**Process words** (B: 88):
- Said of a seat ("B has finished"), a run word is now that seat's board state. That seat's own ring as the turn's prompt (`[pane:B] …`) backs it, and another seat's ring does not.
- Said of anything else, a run word is backed by a process read, or by a run in the turn that names the thing: a command sharing a word of 4+ characters with the unit.
- A state word after if, when, once, after, until or unless (in the same unit) is skipped as `conditional`. B's FALSE draws included "finished after a future check" and a future "green".

**Not changed, on purpose:** a figure restated from an EARLIER turn is still refused. That is E's turn scope (§7.1). Some of the 3a landings are exactly this: messages with 0 calls in the turn.

## Replay, side by side
A's original lists, `--show-claims`, both ways. Digests unchanged since the first build: census `7a31cfc5…`, right `68a4a1d1…`, week `75743f47…`.

| | first build, v1 + Bash | **revision, v1 + Bash** | first build, v1 only | **revision, v1 only** |
|---|---|---|---|---|
| CN 27: refused / allowed / unlocated | 13 / 9 / 5 | **13 / 9 / 5** | 9 / 13 / 5 | **9 / 13 / 5** |
| CU 5 | 5 unlocated | 5 unlocated | 5 unlocated | 5 unlocated |
| right-claim sample (73): refused | 35 (47.9%) | **30 (41.1%)** | 33 (45.2%) | **28 (38.4%)** |
| week (300): refused | 202 (67.3%) | **173 (57.7%)** | 202 (67.3%) | **173 (57.7%)** |

checked: `report-all.md`, `report-v1.md` (revision) beside the first build's reports in `p-claimcheck-C_2026-10-11_evidence/`.

**By class, week, v1 + Bash** (`byclass.js`, in `replay.log`):

| | first build | revision |
|---|---|---|
| figure alone would refuse | 133 | **124** |
| state alone would refuse | 133 | **90** |
| refusals carrying both | 64 | **41** |
| `number` flags | 194 | **156** |
| process-need flags | 88 | **18** |
| board-need flags (the seat words moved here) | 58 | **65** |

On the right sample, the figure class alone would refuse 29 → 28 messages, and the state class 20 → 12.

**No catch lost (checked).**
- The 13 refused CN units are the same 13, both ways.
- In the `--show-claims` reports, every token B's sheet names for a catch is still flagged:
  - the sizes, the decimal and the 3-digit count;
  - the CLI version and the times;
  - "logged out" and "does not exist";
  - "never rang" and "hasn't started".
- Three census rows changed, and they are listed here because they are named. I did not tune on them.
  - **W020** lost its `finished` flag and keeps `never rang`, in the same wrong sentence.
  - **W101** lost one `started` and keeps `hasn't started`.
  - **W021**, a refusal elsewhere, carries fewer flags.
- These are the only census ids I name. None is in the code, the tests or the comments: checked, `grep -cE "\bW[0-9]{3}\b"` → 0 in both files.

**3a, inferred, for B to judge.** I re-ran the six right-sample messages B lists as 3a landings, to see the categories. Those are the 3a sample, not census units; I looked at them, so the cut is not blind to them.
- Two of the six messages now pass: the bare-digit one, and the seat "finished" backed by the seat's own ring.
- A third no longer flags its "7".
- inferred: about 4 of B's 10 landings go, which would leave 3a near 6 of 59 (≈10%). B's claim-level judging decides.
- The remaining landings are figures restated from an earlier turn: the turn-scope cost above.

## Checks
- **Red first:** the 4 new rows (8–11) failed on the first build's claim-check.js, which was unchanged (checked: `git diff --stat` empty in `red.log`). The other 23 hook rows passed.
- **Green, final:** 51 of 51 (27 hook, 6 adapter, A's 18), plus `dirs` 5, `reply-slot` 38 and `sources-gate` 64 (`final.log`). All under the heavy-run lock.
- **Mutants** (`mut.js`, on a copy tree at 4b077884; the 25 from the first build plus 9 on the revision): **applied 34 / caught 34 / NOT APPLIED 0, control clean** (`mut2.log`).
  - The first pass caught 33. "An enumerator (n) is a figure again" survived, because my row's only enumerator was a single digit, which N1's rule already drops. I added "(14)" to the row.
  - Also from that first pass: my runner's cleanup DELETED the five files it had copied in. At 4b077884 they are tracked (the first build landed), so the copy tree was left 4 files dirty. I restored it with `git checkout`, fixed the runner to restore instead of delete, and re-ran: 0 dirty after.
- **After committing:** `portable-paths` green (389 files in scope / 455 known sites / 0 new); `carrier-drift` GREEN. Credential pattern scan of the evidence and the two files: 0.

## Corrections
- 50a9f71f's message says "Rows: 5 new". **It is 4 new rows (8–11)**, plus one added assertion in row 11 and a widened row 8. The message is not amended; this line corrects it.

## Not opened
A's top-up pool (`p-wcensus-A_2026-10-11_evidence/out/topup/`); E's pool classification (`p-poolread-E`); B's §G. I read B's read, which lists the catches by id in its §2 (to know which catches not to lose), and its judging sheet's §3a/§3b only (lines 31–81). I did not read the sheet's §2.

**Leftovers, mine:** `G:/worktrees/c-d305b-base` (detached, clean) and `scratchpad/d305r/`.

NEXT: A replays 50a9f71f on the original lists and E's held-out units; B judges; the librarian applies §5.
