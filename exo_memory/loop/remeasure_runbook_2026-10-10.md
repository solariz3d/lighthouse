# The 10-03 re-measure: runbook for 2026-10-10T11:55Z — seat A, 2026-10-09 (D277 measure b)

Registration: `exo_memory/loop/remeasure_registration_2026-10-03.md` (commit `55f185fe`). Harness: `exo_memory/loop/claimrec/` (`frame.js`, `draw.js`, `claimrec.js`, `asof.js`, `score_base_rate.js`).
Plan and revert rule: `exo_memory/loop/plan_lighten_the_load_2026-10-09.md` (H3: reverted if (b) after the change is worse than the pre-gate 4.9% by more than its 95% interval).

## Armed means this, and no more

- **Runnable:** every step below has a committed script and was rehearsed on the original window (see the end).
- **Guarded:** `draw.js draw --window remeasure` **refuses until 2026-10-10T11:55:00Z** (it exits 2 and writes nothing; checked at 2026-10-09T17:52Z). The registered rule is that no message is drawn before the window closes.
- **Not self-firing.** Nothing is scheduled to run it (`schtasks` shows only the Dream Cycle and Second Vantage tasks). Someone has to run steps 1 to 5 after 11:55Z.

## The window

**2026-10-03T11:55:00Z to 2026-10-10T11:55:00Z** (05:55 Regina local, seven days; the 100-message floor is already met: 3,366 eligible messages at 2026-10-09T17:52Z).
**If the lighter rule layer or the gate switch goes live before 11:55Z on 10-10, this window is no longer a "before":** cut `WINDOWS.remeasure.to` in `claimrec/draw.js` at the flip time and say so in the score.

## The steps (repo root; `R` is any empty folder outside the repo, for example `C:\Consonance\retrieval\remeasure1003`)

1. Counts only, any time: `node exo_memory/loop/claimrec/draw.js frame --window remeasure`
2. After 11:55Z: `node exo_memory/loop/claimrec/draw.js draw --window remeasure --out R`   → `R/key/` (drawn ids, frame, metadata) and `R/replies/` (100 files). The command prints the drawn ids' sha256: file it with the librarian before anything else.
3. **Pin the reader's model, then run the readers** (no `--ask`):
   `set CLAIMREC_MODEL=claude-opus-5-5` (PowerShell: `$env:CLAIMREC_MODEL='claude-opus-5-5'`), then
   `node exo_memory/loop/claimrec/claimrec.js readers --in R/replies --out R/readers`
   **Why the pin:** L119 ran on `claude-opus-5-5`; the CLI's default today is `claude-sonnet-5-5` (the rehearsal's readers ran on it). Unpinned, the "before" and "after" would differ in the extractor as well as the room. Checked: the pinned call works (rehearsal, one call, model `claude-opus-5-5`).
   Cost on 2026-09-27: about $5.91 and 28 minutes for 100 calls. Do not re-issue a failed batch (R1:206).
4. `node exo_memory/loop/claimrec/claimrec.js packets --in R/replies --readers R/readers --out R/packets`
5. `node exo_memory/loop/claimrec/draw.js assign --window remeasure --packets R/packets --out R`   → `R/verify/B/claims.json`, `R/verify/C/claims.json`, `R/key/claims_all.json`. **Hash both verifier files and file the hashes with the librarian before either verifier opens its file** (R19 section 9).
6. **B and C verify blind**, each from its own folder: kind first, then verdict, against the as-of source (`exo_memory/loop/claimrec/asof.js`; rules in `claim_base_rate_registration_2026-09-27.md` sections 3 and 4). No seat verifies its own claims; the assignment enforces it. **E does not verify.**
7. The librarian scores: `node exo_memory/loop/claimrec/score_base_rate.js <B verdicts.json> <C verdicts.json>`

## What the score is compared with

- Pre-gate: 8 of 163 unchecked claims wrong = **4.9%** (`claim_base_rate_score_2026-09-27.md`).
- The registration's own limit applies: at about 160 claims a fall cannot be shown, and the rate is printed, not gated. A rise is what the harm reading can show (lower bound above 0.049 is printed WORSE).
- The CHECKED share is what can move: it should rise at least 10 points over the 2026-10-01 D201 sample (42 CHECKED), or the gates changed the form of hand-offs and not the claims inside them.

## What differs from L119, said now

- **The frame is D only.** L119 ran on the laptop, which held both machines' rows. The laptop is not synced, so any work written only there is not in this frame.
- **The exclusion of the 24 located turns is moot here:** the 24 rows are dated 2026-09-01 to 2026-09-23 (`claimrec/located24.cited.json`), all before 2026-10-03. `draw.js` is called without `--cited` for this window.
- **Reconstructed, not copied** (the originals were on the laptop and never committed): the "real prompt" rule behind turn spans, and the echo/printf extraction regex. Neither affects which messages are drawn: the 43 exclusions and the draw itself reproduce L119's exactly (below). The extraction text itself could not be compared with L119's replies, which are not on disk.
- **The sealed `frame.js` cannot read the chair's transcript** (549 MB, over V8's string limit); `claimrec/frame.js` is the same rule read in chunks and is what `draw.js` uses.
- Claude CLI 2.1.292 (2.1.283 at L119).

## What was checked on 2026-10-09 (so a later reader does not have to trust it)

- `node exo_memory/loop/claimrec/frame.test.js`: 10 pass, including all 60 cells of the registration's table. 13 of 13 mutants of `frame.js` caught.
- `node exo_memory/loop/claimrec/draw.test.js`: 17 pass. 18 of 20 mutants of `draw.js` caught; the other 2 are equivalent (B and C return before the overlap check; an assistant row cannot sit on a prompt line).
- **The rebuilt draw reproduces L119 on the original window:** frame 5,023, 43 excluded (20 librarian, 23 B), eligible 4,980, the seat split 31/17/14/14/14/10, and `drawn_ids.txt` sha256 `23282ca2a1578fa25db5810cd6c801179aae1d618210beaca66cb7a0b4054a45`, identical to the recorded value (`node exo_memory/loop/claimrec/draw.js draw --window original --out <dir> --cited exo_memory/loop/claimrec/located24.cited.json`). The hash is of the file as LF-separated ids with a trailing newline, in order-key order.
- Rehearsal on two original-window replies, readers → packets → assign: ran clean (21 and 15 statements; 6 claims after the cap; 3 to B, 5 to C, 2 on both).
- Not checked: that `assign`'s verifier files satisfy B's and C's lookups end to end (no verifier was run), and the statement-to-claim step on a full 100.
