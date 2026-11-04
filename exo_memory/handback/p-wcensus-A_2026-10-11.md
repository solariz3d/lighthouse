# p-wcensus-A — D301 wave 3 item 7 (ledger D302): units for the full W census; seat A, 2026-10-11

I gathered. **No unit is classified and the lookup was not run.** I opened the D301 plan's lines 41-52 only (checked: `sed -n 41,52p`).

**Result: lighthouse `3ffaf969` on `b2e0c4ca`, branch `d301-a2`, worktree `G:\consonance-worktrees\a-d301a2-wt`. Local, named paths, not pushed.** Files in `exo_memory/handback/p-wcensus-A_2026-10-11_evidence/`: `census.js`, `today.json`, `out/units.json`, `out/units.tsv`, `out/digest.txt`.

## The digest
**`units.json` sha256 `3e910cb0397c651ba763a653a00e4247e6c6a13895ab90f41342cfa0d499e7e4`**; the function is sha256 over the UTF-8 bytes of `out/units.json`. checked: two full runs wrote byte-identical files (both printed it).

## One command
```
node exo_memory/handback/p-wcensus-A_2026-10-11_evidence/census.js --repo . --rev b2e0c4ca \
  --rows exo_memory/handback/p-scoreboard-E_2026-10-11_evidence/out/rows.tsv --projects ~/.claude/projects \
  --today <evidence>/today.json --fallback-checkout <the main lighthouse checkout> --out <dir>
```
`--until` defaults to 2026-10-11T21:36:00-06:00, so transcripts written after that do not move the digest. Run under `heavy-run.hold()`, read-only.

## Units: 104
- **W001…W101: every W row of `rows.tsv`, in file order, no draw** (checked: `awk` count of `W` rows = 101). Finders: keeper 14, seat 86, unattributed 1 (E's column).
- **T1, T2** as in the sample (`today.json`), **S29** from your description: correction `librarian/2026-10-06.desktop.md:42`, `t_err` given as 2026-10-07T07:42Z, no claim line (a relayed message), marked `relayed_not_a_file_line`. **S29 and census row W042 are the same line** (`2026-10-06.desktop.md:42`); I kept both units, so count them once if you want 101 + 2.
- Same fields as the sample: correction item, its times, cited refs with first-commit times (156 refs; 101 resolved), the Reads of the located turn, `claim_at` for T1/T2 only. **The same Limits apply** (see `p-misssample-A_2026-10-11.md`: only `Read` counts as opened; the seat is the transcript folder under today's seat map; a "claim" hit can be the correction quoting the claim; transcripts start 09-09/09-12 for lettered seats). Transcript status: claim-located 47, correction-turn-located 35, neither 22 (the 104 units).

## ADDED: `t_err` and the sha before it
Each unit has `t_err`, `t_err_basis`, and:
- `sha_before_t_err_committer_date` and `sha_before_t_err_author_date`: the sha the lookup should `git grep` at.
- `sha_before_correction`: the same walk at the time the correction line was written (blame time), as an upper bound. null for W101 (an uncommitted line).
- `times_in_text`: any HH:MM tokens in the entry, listed raw, **not used** to set `t_err`.

**How `t_err` is picked** (in this order):
1. Given by the chair: S29 only (1).
2. **A claim located in a transcript** (the earliest assistant-authored occurrence of a quoted span) **that is not after the correction line was written**: 35 units (33 W + T1 + T2).
3. Otherwise **the start of the entry's own day, 00:00 at -06:00**: 68 units. **This is the weak basis.** The claim was that day or earlier, so the sha is the tree at the day's start and can only be EARLIER than the tree the seat had. A fact that landed later that same day will look "not on disk" at this sha. `sha_before_correction` is the other bound; a fact found at the day-start sha was surely on disk, a fact found only at `sha_before_correction` is not decided by this field. 11 claim hits were after the correction line (probably the correction's own quote); those fall to day-start and are not used.

**How the sha is picked when `t_err` falls between commits:** `git log <rev> --first-parent`, walking back from `b2e0c4ca`; the sha is the FIRST commit found whose committer date (or, for the second field, author date) is ≤ `t_err`. **The two differ for 1 unit** (checked), T1 (`fc946c52` by committer date, `1bd8610c` by author date). **Caveats:** it is main's tree, not the tree of the erring seat's worktree, so a fact on an unlanded branch is not in it; main's committer dates are LANDING times (a chair cherry-pick), so a hand-back written at 10:00 and landed at 14:00 is absent at a 12:00 `t_err`. The author-date field is there for that. With non-monotonic dates the walk can stop at a commit earlier in the chain than the nearest by time.

## Disclosed
- One unit (W101) reads an uncommitted working-copy line (`--fallback-checkout`, file mtime as its time). T2's claim line is now at `b2e0c4ca`, so it reads from git.
- 43 units cite no path at all (`cited_refs` empty), which is the case B's lookup step is for.
- The scoreboard rows (`rows.tsv`) were used as given.
- No test; reproducibility is the identical digests. `portable-paths` exit 0 (383 files, 0 new), `carrier-drift` exit 0, after committing.

## Top-up pool: not used
**UNREAD: prepared under Ruling 2, not read because the W census cleared the floor.** C's census read gives D = 31–34 (checked: `p-censusread-C_2026-10-11.md:19`). Built and committed before the stop (`d13223eb`): the 153-unit pool, 8 batches, digests below, nothing read or looked up; labelled by `out/topup/UNREAD.md` in the stop commit. Batch 1 digest `106875c212b0c7c982ca104202000b51e6e774a76a4ad3d8ea0da490f10be810`; all eight in `out/topup/digests.tsv`.

## Top-up pool (Ruling 2; added at commit `d13223eb`, same branch)
I opened the plan's "B's read (6a) and the ruling" section (main checkout, `14fd1f80`+). Nothing classified; B's lookup not run.

- **Pool size: 153** (checked: `census.js --pop H`, printed `TOPUP pool 153 of 985 H rows`). 985 = every `src=H` row; 153 have a claim located by a quoted span (same method as the census). By finder: seat 135, instrument 18. None was excluded as "after the correction line was written" (the census's 11 such W hits are a blame-time test, and a hand-back's blame time is its LANDING time, which is later than the transcript, so the test cannot fire here; see the flag below).
- **Rank:** `sha256(seed|correction_at|correction_text[0:80])` ascending, **seed `d301-topup-2026-10-11`**. **8 batches of 20 (7 full, batch 8 has 13).** Every unit carries the same fields as the census, `topup_rank`, `t_err` (= the located claim's time) and the same two shas plus `sha_before_correction`.
- **Digests (sha256 of each batch file's bytes; `out/topup/digests.tsv`):**
  1. `106875c212b0c7c982ca104202000b51e6e774a76a4ad3d8ea0da490f10be810`
  2. `01ee62288c11ea020d532016b53c0f2d10fa0791620993e9fcea592b3e89916c`
  3. `a93d906b4d814b591573ef0c7bb7f2981604c7089ec5a04a13817160bf5ce502`
  4. `9b1ee603f11e6333f2c79bca911cb2f0ee5509c7f5110bca76dcdfa5f0f9a1ef`
  5. `c26674e53b10bab5bba63b902d55ff6a799333c228996a2904e5d08fe40e282e`
  6. `7b51028fe8f7042b90353fc31a9fc7fe02cb898bd55fb9f62dfb8347726d474a`
  7. `af3f042449d0ee782e753901619560e7e30addb6126342d0996b8adddd99b590`
  8. `7bada21f82552cd32ac2bca467572162b9f01496c37c9f3a0340e21e4f3f54e4`
  checked: a second full H run wrote an identical `digests.tsv`. One command: the census command above with `--pop H --out <dir>` (about 2 minutes; the batches are in `<dir>/topup/`; `<dir>/units.json` holds all 985 and is not committed).
- **The census digest is unchanged: `3e910cb0…`** (checked: re-run after the edit printed the same sha256).

### READ THIS before C reads a batch: the located "claim" is mostly in the turn that wrote the correction
Each pool unit carries `claim_turn_vs_correction_turn`, from the transcripts: where the first assistant occurrence of the quoted wording sits against the turn that wrote the correction line (the correction's own first line, found in an assistant write).
| flag | pool of 153 |
|---|---:|
| earlier-turn-than-correction-write | 16 |
| **same-turn-as-correction-write** | **127** |
| correction-turn-unlocated | 9 |
| later-than-correction-write | 1 |
- **Same-turn means this script cannot tell** whether the wording is the original claim, made earlier in that same turn (e.g. "my draft said X, fixed before the commit"), or only the correction's own words quoting the claim from elsewhere. In the second case `t_err` is the correction's time, not the claim's, and the sha is LATER than the error: a lookup at it can find a fact that landed between the real error and the located hit, which biases toward RM. I do not know the share. If only earlier-turn hits are wanted, the pool is 16 (plus 9 unlocated, whose status I cannot say); I did not narrow it, because the ruling is sealed and the choice is the librarian's.
- **The same flag for the W census** is in `out/claim-turn-flags.json` (sha256 `10906fbce39c6c28d36ef9bd0351b0f55dd2961ea61899084a8ee080a4c8a53f`), written as a sidecar so `units.json` keeps its delivered digest. Of the 35 census units whose `t_err` is a located claim: **earlier-turn 12, same-turn 11, correction-turn-unlocated 12.** The 11 same-turn units carry the same bias in their `sha_before_t_err_*` fields.
- Also true of the whole pool: only `Read` counts as opened, the seat is the transcript folder under today's seat map, and `line_time` is the last write of the line (see the Limits in `p-misssample-A_2026-10-11.md`).

`portable-paths` exit 0 (383 files, 0 new), `carrier-drift` exit 0, after committing `d13223eb`.

NEXT: librarian dispatch C's blind read of `p-wcensus-A_2026-10-11_evidence/out/units.json` (digest `3e910cb0…`) once B's amendment is committed; batch `out/topup/batch-01.json` (digest `106875c2…`) only if D < 30, and decide whether same-turn hits stand
