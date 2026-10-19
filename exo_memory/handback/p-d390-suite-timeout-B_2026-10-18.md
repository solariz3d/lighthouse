# D390: the gen-consumer suite timeout (pane B, 2026-10-18)

**Outcome:** `37369e08` on branch `d390-b`, worktree `C:\Users\nname\Downloads\lh-d390-b`, **based on d387-e `13b7d3b4`**.
One file, `consonance/tools/js-suite.js`, +5 −1: the per-file default is now 300000 ms (was 120000), with a comment
giving the reason and the measurements. Not pushed. `SC` = `C:\Users\nname\Downloads\t180-d390\`.

## 1. The measurement: where the time goes

- checked: `SC/base.log` and `SC/base-gen-consumer.tap`. gen-consumer.test.js alone at 13b7d3b4, under the lock, on an
  idle machine: **124,819 ms of wall time, 107/107 pass.**
- From the TAP's per-test `duration_ms`:
  - 62 of the 107 tests take less than 200 ms each, **806 ms** together.
  - The rest is about 45 tests that each run a full generation of the real tree (`G.build`, ~1.9 s each). The two
    slowest are "a full dry run over the real tree…" at 13,496 ms and "a dirty tree is REFUSED…" at 10,344 ms.
- checked: `grep -oE "G\.build\(" gen-consumer.test.js | wc -l` → 32 direct calls, plus the `dryStaged` (3), `lap4` (5)
  and `lap5` (16) helpers.
- The measured figures straddle the old limit:

| run | wall time |
|---|---|
| E, at dfe05087 | 123,200 ms |
| E, at 13b7d3b4 | 123,859 ms |
| B, at 13b7d3b4 (alone, TAP) | 124,819 ms |
| B, at 13b7d3b4 (js-suite green run) | 117,435 ms |
| 10-17 | 104.6 s |

  So the file passes or crashes depending on how slow the machine is that day.

## 2. The choice: raise the default to 300000

- **Not split.** A new test file under `consonance/tools/` ships in the consumer build: the manifest rule there is
  `match: /\.(js|json|md)$/`, kind code. That file would require gen-consumer.js, which doesn't ship, and carries the
  same identity fixtures. Both existing gen-consumer test files are kept out by name in gen-consumer.js's EXCLUDE
  (`gen-consumer.js:650` and `:664`). So a split needs a third file, gen-consumer.js, and this lap's files were
  js-suite.js and gen-consumer.test.js only.
- **Not "fix X: share one build".** Each dry build writes a staging folder on disk (`buildStaged`,
  `scratch.mkdtemp('gen-consumer-')`) that the tests read. About 28 tests make the identical
  `G.build('', { dry: true, allowDirty: true })` call. Sharing it would save ~50 s (inferred: 28 × ~1.9 s), but it would
  couple those tests through one folder, and that needs a per-test audit for writes. That is a larger change than this
  lap's.
- **300000** is the librarian's figure. It gives the measured 124.8 s 2.4x room.
- **The cost, named:** a hung file now holds its worker for 5 minutes before it is reported, instead of 2.
- If the room wants the tight guard back, the way is split plus one EXCLUDE line in gen-consumer.js, as its own lap.

## 3. Red first, green after, with the real runner

The pinned behaviour is js-suite's verdict on gen-consumer.test.js at the default limit. The fixture root `SC/fx-gc/`
holds one file, `gen-consumer-wrap.test.js`, which requires the real `lh-d390-b/consonance/tools/gen-consumer.test.js`.
`SC/suiterun.sh` runs the worktree's own `js-suite.js` with `JS_SUITE_ROOT` set to that root,
`JS_SUITE_TIMEOUT_MS` unset, under heavy-run.js.

| run | js-suite.js:152 | result | wall | output |
|---|---|---|---|---|
| red-base | `… \|\| 120000` | CRASH, exit timeout/signal; 0 green · 1 crashed; exit 1 | 120,490 ms | `SC/red-base.out`, `SC/red.log` |
| green | `… \|\| 300000` | 1 green · 0 crashed; exit 0 | 117,435 ms | `SC/green.out`, `SC/green.log` |

- **Honest limit of this pair:** the green run happened to take 117.4 s, which would also have fitted under 120 s. The
  red shows the old limit killing the file; the green shows it passing at the new one. The case for 300000 rests on the
  spread in §1, not on this pair alone.

## 4. The hang guard still catches a hang

The fixture root `SC/fx-hang/` holds one file, `hang.test.js` (`setInterval(() => {}, 1000)`).

| run | env | result | wall |
|---|---|---|---|
| hang-default | unset | CRASH, exit timeout/signal; exit 1 | 300,043 ms |
| hang-env2000 | `JS_SUITE_TIMEOUT_MS=2000` | CRASH, exit timeout/signal; exit 1 | 2,053 ms |

So the default kills a hang at 5 minutes, and the environment override still works. Output: `SC/green.log`,
`SC/hang-default.out`, `SC/hang-env2000.out`.

## 5. Other checks

- `consonance/tools/js-suite.test.js` under the lock: **45 passed, 0 failed** (`SC/js-suite-test.out`). Its CARRIER
  tests read js-suite.js's header, which this change does not touch.
- checked: no test is pinned to js-suite's 120000.
  - `git grep -n "JS_SUITE_TIMEOUT_MS\|120000"` finds only other modules' own timeouts (second-reader, release-chime,
    launch tests, gen-brief-gate, and gen-consumer's L038 child at :758).
  - The prose that names the old limit is in dated traces (`exo_memory/loop/packet_corpusage_ratchet_2026-09-07.md:7`,
    corpus-age once at 142.9 s), which stay as written.
- Credential and identity grep of the diff → 0.
- No full suite was run, per the order.
- **Gap, named:** js-suite.test.js has no test for the timeout path. My demonstration in §4 is a run, not a committed
  test, because js-suite.test.js was outside this lap's files. A fixture test like its others, with
  `JS_SUITE_TIMEOUT_MS` small, would pin it.

## Corrections

None.

NEXT: librarian, read and rule. Plan default after that: a landing pane lands `37369e08` (on 13b7d3b4) with the next
lighthouse landing.
