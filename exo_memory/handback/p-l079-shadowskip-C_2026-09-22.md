# P-L079-SHADOWSKIP — C (L079 packet C, on L, 2026-09-22) — UNCOMMITTED

**The shadow now does what A's judge does since 81b46fe: a failed Jev call skips THAT item — no row, one log line, retried next run — instead of ending the run.** A 4xx other than 429 still ends the run, and so do the secret scan's refusal-and-go-on (unchanged) and every other Refusal (unchanged, still stops). Owned and touched: `consonance/tools/jev-shadow.js`, `consonance/tools/jev-shadow.test.js`. Nothing else edited.

## 1. The rule — MIRRORED, not imported, and held equal by a test

- `transientStatus(err)` at `consonance/tools/jev-shadow.js:168` is **byte-identical** to A's at `consonance/tools/jev-judge.js:257`:
  - not a `GatewayError` → `null` (stops);
  - HTTP status ≥500 or 429 → the code (skip);
  - any other HTTP status → `null` (stops);
  - no status: "request failed before a response" → `'network'`, otherwise `'bad-answer'` (skip).
- **Why mirror:** A's function is not exported from jev-judge.js, and exporting it would mean editing A's file, which this packet does not own.
- **Keeping the two in step:** the test at `jev-shadow.test.js:339` extracts both function bodies with the harness's `extractFunction` and asserts they are equal. If either copy changes alone, the shadow suite goes red. If the room would rather import, the move is one export line in jev-judge.js plus deleting my copy; the test would then become redundant. Your call, not mine.
- **The catch** is at `jev-shadow.js:227-231`. It runs after the secret-scan branch, which is unchanged. `null` rethrows; otherwise it does `failed.push({key, status})`, logs `shadow: item <judge>:<id> failed (<status>) — skipped, retried next run` only if `log` was passed, and continues.
- **What `shadow()` changed:**
  - it takes an optional `log = null` (`:176`);
  - it returns `failed` next to asked/refused/remaining (`:237`).
- **Unchanged:**
  - no row on failure;
  - never re-ask an answered pair (the ledger key is untouched);
  - per-run cap;
  - the runner's 600 reserve, which lives in jev-shadow-runner.js and was not touched.
  - A failed call **still spends a place in the run's cap**, the same as A's.

## 2. Tests — red first

`cd C:/Consonance/lighthouse && node --test consonance/tools/jev-shadow.test.js`

- **Before the code:** 22 pass / 7 fail. All 7 new tests were red, and the 22 old ones stayed green.
- **After:** **29 pass / 0 fail**. That held twice plainly and once with `--test-concurrency=1`.

New tests (`:276–:345`):
- 503 on item 2 of 4: rows for i1, i3, i4, and `failed` = `[{key:'l2:i2',status:503}]`. The next run makes **exactly one** call and adds i2.
- 429, 500 and network are each skipped. A 403 ends the run with only i1 written.
- An answer that doesn't fit the schema is skipped as `'bad-answer'` with no row.
- The log lines are exactly the status and item id, with no error body.
- The cap is unchanged: `maxCalls 2` with a 503 on item 1 gives 2 calls, asked 1, remaining 2.
- The secret scan still refuses once and the run goes on, with `failed` empty.
- The mirror-equality test.

**One existing test changed, and the keeper rule is why it had to** (`:244`). It said a gateway **500** stops the run. The packet now requires a 5xx to be skipped, so under the new rule that test is verifiably wrong. It now uses a **401**, which is still a stop, with the same assertions: the run stops, the error surfaces, and no row is written. Its comment names the change. Nothing else in the file was weakened or removed.

## 3. Mutants — 7 applied · 7 caught · 0 survived · 0 no result · 0 NOT APPLIED

The harness is a scratch file outside the repo. It runs on temp copies of all of `consonance/tools` plus `dev/shell/hooks`, with a compile gate, and counts `cancelled` as not passing. Control: 29/0. The mirror-equality test catches any mutant inside `transientStatus` by construction, so I also report whether a **behavioural** test caught each one. **All 7 were caught by a behavioural test.**

- K1: no skip at all (the pre-L079 code).
- K2: a failed item gets a row.
- K3: every 4xx is skipped.
- K4: the log line carries the error body.
- K5: `failed` is not returned.
- K6: network and bad-answer are not skipped.
- K7: 429 is not transient.

## 4. Full suite — plain, `node consonance/tools/js-suite.js`

`114 green · 4 failed · 0 crashed · 0 silent · 1 canary (of 119)`. **None of the four touch jev-shadow**: `grep -l jev-shadow` over the four finds nothing. All four jev-* tests are green.

- **The same at HEAD 81b46fe, in a clean throwaway worktree (since removed):**
  - `carrier-drift.test.js` 56/1, "THE BAR, half two … RED against the tree at 21d5453^";
  - `gen-consumer.test.js` 58/1, "L038/A · … no $<digit> that is not regex source";
  - `dev/stick-waiter.test.js` 0/1 (the stick-waiter failure A's L070 note said has no owner).
- **`state-sync.test.js`:** 103/1 inside the suite, but the suite's tail kept only the passing lines, so **the failing case's name was not captured**. Run alone it was **104/0**, both at HEAD and on the live tree. It is not mine, and it is the same shape as the one-in-N 93/1 I reported in L072. It is an open flake with no owner.

## 5. FOR THE ROOM — two dependencies OUTSIDE my files, NOT FIXED

**(a) The runner does not log the shadow's failed items, and it mislabels an all-failed cadence.**
- `jev-shadow-runner.js:250` logs `shadow: asked …` only when asked or refused is non-zero. Otherwise `:256` says `shadow: nothing to shadow (N captures)`.
- So a cadence where every call 503s is written up as "nothing to shadow", and the per-item lines never appear, because the runner does not pass `log` into `shadow()`.
- The judge branch does this right at `:269-274`.
- Fix (A's file, this lap): either pass `log` into `shadow()` or loop over `r.failed` as at `:271`, and put `r.failed.length` in the `:250` condition.
- **Recommend landing it with this packet.** Without it the skip works, but it is silent on D.

**(b) The tracked D104 mutant harness `consonance/tools/jev-shadow.mutants.js` (mine, not in this packet) has had a red control since A's `1afa285`.**
- Its `COPIED` list (`:31`) lacks `jev-judge.js`, which the runner has required since `1afa285`.
- At HEAD, in a clean worktree: `control runner {"pass":0,"fail":1}` → "CONTROL NOT GREEN". So **no row it prints has meant anything since `1afa285`.**
- With L079 the shadow control also goes red (28/1), because the mirror test reads jev-judge.js.
- Row 7's anchor (`:47`, the old `throw err; // a gateway failure stops the run…` line) no longer exists, so that row would read NOT APPLIED.
- Fix: add `'jev-judge.js'` to COPIED, and re-anchor row 7 on `if (status === null) throw err;`. That is two lines.
- Say the word and I'll do it as its own packet with a green control shown.

## 6. NOT verified

- A live 503 from the real gateway. Every failure here is a stubbed fetch.
- Machine D, where the ~100-pair count is being built.
- The runner integration: see §5(a). No runner test exercises a failed shadow item.
- Whether the running runner (pid 32976) has picked this up. It has not been restarted, per standing orders, so it is **still running the old code** until the next restart.

## 7. Hashes (uncommitted)

`sha256sum consonance/tools/jev-shadow.js consonance/tools/jev-shadow.test.js`
- `jev-shadow.js`: sha256 `d29c9ecc0bf3bba3…`, 314 lines.
- `jev-shadow.test.js`: sha256 `8c5550d156fd7458…`, 402 lines.

NOT COMMITTED. The chair lands it.

## §-(b) — 2026-09-22 06:0x — the tracked mutant harness's control, fixed (L079 packet C, second half)

**What I edited:** only `consonance/tools/jev-shadow.mutants.js` (sha256 `fd67127960030661…`, uncommitted). Three changes:
- `:31` adds `'jev-judge.js'` to `COPIED`. The runner has required it since `1afa285`, and my L079 mirror-equality test now reads it too.
- `:11` adds jev-judge.js to the header comment's list of copied files.
- `:47` re-anchors row 7 on `if (status === null) throw err;` and replaces it with `if (status === null) continue;`. The row is renamed "a NON-transient gateway failure swallowed (L079: only 5xx/429/network/bad-answer skip)".

**GREEN CONTROL, then the rows.** This was run on a clean throwaway worktree at HEAD `81b46fe` with only my three files copied over (jev-shadow.js, jev-shadow.test.js, jev-shadow.mutants.js). All other files were as at HEAD: runner.js `a748ca48bb365f6b…`, runner.test.js `77458445b4181e62…`, jev-judge.js `4a8275d7346e5db3…`, jev-ask.js `b9385dba79c67be1…` (all sha256). The worktree has since been removed.

`node consonance/tools/jev-shadow.mutants.js`, exit 0:

```
control shadow  {"pass":29,"fail":0}
control runner  {"pass":37,"fail":0}
```

| rows | result |
|---|---|
| 1–15 [shadow] | APPLIED · CAUGHT, each with 1–3 failing tests. **Row 7, re-anchored: CAUGHT, pass 26 / fail 3** |
| 16–19, 21–25 [runner] | APPLIED · CAUGHT |
| 20 [runner] the app-pid watch removed | APPLIED · CAUGHT (hung: the suite did not finish in 120 s) |
| 26 [runner] timers registered after a startup stop | APPLIED · CAUGHT (hung) |
| L3 worker via require(); runner key-scrub; release token check | **NOT APPLIED**, each with its printed reason, and **not counted as caught** |

**26 applied · 26 caught (2 of them by hanging) · 0 survived · 0 no result · 3 NOT APPLIED.** The full output is saved outside the repo in scratch (`l079b-mutants-head.txt`).

**Why a snapshot and not the live tree:** the live tree cannot give a green control while A's half is in flight. On L at 06:00 the same command gave `control shadow {"pass":29,"fail":0}` and then `control runner {"pass":37,"fail":1}` → CONTROL NOT GREEN. The one red is A's red-first test ("L079: an ALL-503 shadow cadence logs each failed item … and NEVER 'nothing to shadow'"). A had written it in `jev-shadow-runner.test.js` but not yet made it pass in `jev-shadow-runner.js`. The test file's hash changed mid-run, from `77458445…` to `6ff2e6aa…`. That red is the expected red-first state of A's half, not my harness.

**NOT verified:** a green control on the live tree with A's runner half in place. It has to be re-run once A's runner code lands, before the chair lands the three pieces together:
`node consonance/tools/jev-shadow.mutants.js` → expect both controls green. The runner suite will then have more than 37 tests, and A's new test is not a mutant row, so the row count should stay at 26.
