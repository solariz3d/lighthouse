# p-claimreplay2-A — D305 item 8 (ledger D306): C's one revision replayed, original lists and E's held-out list; seat A, 2026-10-12

I ran the harness and wrote the reports out in full. **I judged no flag**; B does that next. The checker (`claim-check.js` at `58034dfd`) and the adapter are untouched (checked: `git diff --stat 10d316c8 HEAD -- consonance/hooks consonance/tools/claim-check-adapter.js` is empty). The switch is OFF (checked: `grep -c claim_check ~/.consonance.json` → 0).

**Result: commit `39fcef40` on `d305-a2` (worktree `G:\consonance-worktrees\a-d305a2-wt`, from main `10d316c8`). Local, named paths, not pushed.** Everything is in `exo_memory/handback/p-claimreplay2-A_2026-10-12_evidence/`. Every run was under the heavy-run lock. portable-paths green (389 files, 0 new), carrier-drift GREEN, after committing.

## Digests checked (sha256 of file bytes, `sha256sum` at 10d316c8)
| list | digest | equals |
|---|---|---|
| `census-units.json` (A, original) | `7a31cfc52bded0cf7063fb8ef5e512be3e9503483c9faa1e680c67b962e0c883` | the 10-11 freeze |
| `right-claims.json` | `68a4a1d16307ec3e73f1b45e5c9f1774fb835b04e127820ba12149f382814c35` | the 10-11 freeze |
| `week-replies.json` | `75743f4723061c71871c8c8f7d8ca595eb864ba64ccf0e9a4cb1814bba554b70` | the 10-11 freeze |
| E's held-out `census-units.json` | `f195b94f0e58a616ab772ac87ed196eb463e68dcf4d369e909e2cc06965fae1b` | the `f195b94f…` you named |
The checker file sha256 printed in every report: `ef8bb8683ff4ea1ace5f6802eb95e1b63c232501e17eda0d67a3dd575e6d9b78` (the adapter loads it).

## Caught and missed (a refusal of the erring turn; whether it flagged the wrong claim is B's)
| set | | first build v1 + Bash | **revision v1 + Bash** | first build v1 only | **revision v1 only** |
|---|---|---|---|---|---|
| original census, CN 27 | refused / allowed / unlocated | 13 / 9 / 5 | **13 / 9 / 5** | 9 / 13 / 5 | **9 / 13 / 5** |
| original census, CU 5 | | 5 unlocated | 5 unlocated | 5 unlocated | 5 unlocated |
| **E's held-out, CN 15** | refused / allowed / unlocated | not run | **10 / 5 / 0** | not run | **9 / 6 / 0** |
| E's held-out, CU 1 | | not run | 1 unlocated | not run | 1 unlocated |
| right sample 73, refused | | 35 (47.9%) | **30 (41.1%)** | 33 (45.2%) | **28 (38.4%)** |
| week 300, refused | | 202 (67.3%) | **173 (57.7%)** | 202 (67.3%) | **173 (57.7%)** |
- The first build's column is C's `p-claimcheck-C_2026-10-11.md` ("Replay over A's frozen lists"); the first build was **not** run on the held-out list by anyone (the held-out list did not exist then), and I did not run it. My revision numbers on the original lists **equal C's own `p-claimcheck2-C` table** line for line.
- Held-out as shares: 10/15 = 66.7% (Wilson 95% 41.7-84.8%) with the Bash path, 9/15 = 60.0% (35.7-80.2%) v1 only. Original located CN: 13/22 = 59.1% and 9/22 = 40.9%.
- The right and week figures are only on the original lists (E's held-out list is census units only).
- **Not a catch count:** per §2 a catch is a refusal that flags the wrong claim itself. These are refusals. The flags are in the reports.

## The reports, in full (`--show-claims`; every refusal listed, each flagged claim whole)
`orig-all.md` (238 table rows), `orig-v1.md`, `heldout-all.md` (16), `heldout-v1.md`. `all` = no `CLAIM_CHECK_VIAS`; `v1` = `CLAIM_CHECK_VIAS=v1`. Each begins with "What ran" (harness, checker, list digests, hygiene), then the census table (unit, class, result, flagged claim), then the right and week sections with the by-seat counts and every refused message with its flag. They hold seats' own sentences, Third Place lines removed (`[third-place line removed]`), secrets redacted.
- **Right sample, for §3a:** `right-kinds-all.tsv` and `right-kinds-v1.tsv` (made by `right-kinds.js`, gathering only) give each message's claims by kind from the B and C verdict files: RIGHT-CHECKED 59 claims in 40 messages, RIGHT-UNCHECKED 96 claims in 57 messages, 6 claims excluded (kinds differ). Messages with a RIGHT-CHECKED claim that were refused: **17 of 40 (v1 + Bash), 17 of 40 (v1 only)**. That is a message-level count: a message can hold both kinds, and the refusal may be of the unchecked claim, so it is **not** §3a's figure; B reads the flags to settle that.

## The harness change (minimal, with rows, red first)
`consonance/tools/claim-replay.js`: with `--show-claims` a report now **lists every refusal** (it stopped at 60 and printed "+N more not listed") and **prints each flagged claim whole** (it clipped at 160 characters). Without the flag nothing changes: still cut at 60, no claim text. Two new rows in `claim-replay.test.js` (one lists 65 of 65, one prints a 600-character claim whole); both were red before the edit. The test file is now 20 rows, all passing; mutants **17 / 17 caught / 0 not applied** on the earlier set, and **4 applied / 4 caught** on the new listing code (the first run of those four left one survivor, a note printed even when nothing was cut; I added the assertion). **No flag was needed for the second list:** `--lists <dir> --groups census` takes E's folder as it is (its `manifest.json` is there).

## What to know
- **The harness in main is not the one I froze.** C changed it in `15ae7d8f` (claim parts, prompt, a revised census path); I did not review that diff beyond running my own 18 rows, which passed on it unchanged, and the stub-free numbers above reproduce C's. The reports' "frozen with" harness hash is the old manifest's; the harness actually run is the sha256 printed in each report's first line (`f655c367…`).
- Only `Read` counts as opened; the turn is cut at the claim's second; claim times are E's (see `p-claimharness-A_2026-10-11.md`). For the held-out list those are E's own, which I did not re-read.
- I opened E's held-out folder only for the list, its manifest and E's hand-back summary. I did not read E's per-unit classification, and nothing from it was sent to C.

NEXT: B judges each flag in the four reports, blind to the checker's stated reasons, against `claim_check_registration_2026-10-11.md` §2 and §3; the librarian scores
