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

NEXT: librarian dispatch C's blind read of `p-wcensus-A_2026-10-11_evidence/out/units.json` (digest `3e910cb0…`) once B's amendment is committed
