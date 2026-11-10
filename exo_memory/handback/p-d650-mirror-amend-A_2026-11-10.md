# D650 amendment A: the two mirror-refusal rows, before P can land

Seat A, on D (Opus 5.5), 2026-11-10. Tier: PROVE IT.
The order: the chair's 17:07 packet. The ruling: `exo_memory/librarian/2026-11-10.md` "17:07 — D650 LANDING STOPPED" (c826cd4c). P's note: `exo_memory/handback/p-d650-land-P_2026-11-10.md`.

## The result

On top of **P's re-made 33c54aa** (as asked), t180 branch `extra-change-free-mirror` at **ac1d4f8**, one commit, in the worktree `G:\consonance-scratch\a-d650m-t180`. Not pushed, not installed.

- checked: `git log --oneline -2` → `ac1d4f8 Prove the mirrored bank's lays as built, and make a refusal under the bank's fit floor name a mark that lays`, then `33c54aa …`.
- checked: `git show --stat`-equivalent → 3 files (`src/core/extend.js`, `test/core_mirror_refusal.test.js`, `test/core_ramp_mutation.test.js`), 51 insertions, 13 deletions.
- checked: the added lines scanned for lap ids, seat words, room paths, "keeper", "librarian" → none. The body carries "Seat A."

## (a) and (b) hold as built, so the rule stands

Read on 33c54aa with the built-bank reader (the adapter's `bankPlan` against the document, from 250 m before the mark to the piece's end):
- checked: mark 500 → laid; before the mark the built bank leaves the document by 0.000°; at the end it is −34.78°, 0.000° off.
- checked: mark 900 → laid; before the mark it leaves the document by **0.424°**; at the end it is −34.78°, 0.000° off.
- The 900 m figure is under the 0.5° tolerance, but not by much.

So neither is a fault in the rule, and the rows are amended, not the rule.

## (c) found a fault in my own D650 code, fixed

The file's property is kept on the marks still refused. I scanned marks 750 to 990 m every 10 m for four changes: both mirrors, +34.78 → 0, and 0 → +34.78, which goes the same way as the bank before it. The scan found a refusal whose stated limit, applied, is refused:
- 0 → 34.78 from 980 was refused under the bank's 26 m fit floor as "needs at least 26.0 m … from at most 974".
- At 974 (a 26 m span, the same way on a straight road) the road as built rounds it back, so it is refused again.

The fit floor is necessary but not enough, and the mark I named under it was the floor's.

**Fix** (`src/core/extend.js`, the under-floor refusal of a bank change):
- It still says "needs at least 26.0 m".
- Where the comfort length is longer, it adds "; X m holds", and names the comfort length's mark, "from at most E − X". That one is always laid, because a span the comfort length passes is laid without the built check.
- Where 26 m would also do (the reversing change from 975 lays at 974), the named mark is looser than it could be, but true. Tightening it would mean re-laying on refusal, which the corner path makes awkward; left.

- checked, red then green: the amended scan row on 33c54aa's extend.js → fail at `0 -> 34.78 from 980: stated "from at most 974", laid at 974: BAD_SECOND …`; with the fix → pass. Run with the fix's extend.js stashed, then restored.

## The rows, each amended by name with its old and new rule in a comment

`test/core_mirror_refusal.test.js`:
- **:20.** It was "the mirrored bank +34.78 -> -34.78 at 500 m is refused, and the refusal does not name a limit that allows 500". It is now "… at 500 m is laid, and as built its bank holds before the mark and reaches -34.78".
- **:40.** It was "a too-short span is still named by the shortest …" (mark 900, refused). It is now "the mirrored bank from 900 m (a 100 m span) is laid, and as built its bank holds before the mark and reaches -34.78".
- **:28, "the limit a refusal states, applied, is accepted (both signs, both mirrors)".** Its four changes at 500 m are all laid now, so it asked nothing. It is now: every mark 750 to 990 still refused, for both mirrors, +34.78 → 0 and 0 → +34.78. At each, the stated limit does not allow the refused mark, and applied, it is laid. 33 refusals measured; the row fails if fewer than 30 are asked.
- **New:** "a span still too short is named by its limit, "from at most M", and M applied is accepted: under the 26 m fit floor, and the same way on the straight". The two named cases are from 975 (the fit floor) and 0 → 34.78 from 900 (the road as built rounds it back; 185.8 m holds).
- Unchanged: "+-30 and +-40 at 500 m are accepted, as they were", and "a mark inside the holding window …".
- The header carries the amendment, and a `builtBankOf` reader was added.

`test/core_ramp_mutation.test.js`:
- EX13 is new: a refusal under the fit floor names the floor as its mark again.
- `core_mirror_refusal.test.js` joins its files.

## Runs, all under the heavy-run lock, BelowNormal, acs.exe checked absent first

The grep set (`scratchpad/d650/amend_suite.js`):
- What it covers: every test file in test/ and app/test/ naming `BAD_SECOND`, a bank change (`phi: [{ from`, `second: { phi`, "extra bank", "bank change", `changes: { phi`) or `secondMinM`, `spanHolds`, `bankAsBuilt`. That is 28 files (`amend_files.txt`), both harnesses apart.
- checked: `amend_grepset.out.txt` → tests 432, pass 429, fail 1, skipped 1, todo 1.
- The 1 failure is `app/test/core-extra-bank-drag-cost.test.js` "D642: dragging the extra bank back toward level … within 2 ×", at 3.18× with 27 files running at once.
  - checked, the file alone twice → 2.77× (fail), then 1.66× (pass).
  - It is the drag-cost timing row P's note and the librarian count as flaky. **Correction:** my own D650 runs of this file on 313b95a read 2.44× and 2.38× on this row, so it failed on the base too, and I did not flag that in the D650 hand-back. This amendment changes only a refusal's stated mark, which that drag never reaches.

The harnesses:
- checked: `amend_mut_ramp.out.txt`, `test/core_ramp_mutation.test.js` (src/core/extend.js) → tests 108, pass 108: CONTROL, the crash stand-in, **applied 106 / caught 106 / NOT APPLIED 0**.
- checked: `amend_mut_turnby.out.txt`, `test/core_turnby_mutation.test.js` → tests 23, pass 23: **applied 22 / caught 22 / NOT APPLIED 0**.

## For P

Land ac1d4f8 (on your 33c54aa) with the full suite. If its run shows the drag-cost row red, it is the known one.

## Corrections

- The fit-floor refusal's named mark (above): my D650 code named a mark the road as built may refuse.
- The base's drag-cost ratios were not flagged in D650 (above).
- My first grep-set run failed before running anything: a JS string ate the regex's backslashes. It was fixed (arguments passed as an array, its exit checked) and run again.
- One test id was written with an apostrophe inside single quotes. It was caught by a parse check before the run.
