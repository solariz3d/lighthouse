# D411 review: X vs Y

Every run below went through `node review/hr.js --`. Probe script: `review/probe/p.js`. It was run on the base, on X and on Y.

## What the probes show

| probe | base | X | Y |
|---|---|---|---|
| `extendCorner` with `kh: NaN` on a fresh doc | BAD_TARGET | BAD_TARGET | BAD_TARGET |
| `kh: null` then `kh: NaN` on the same doc | **ok (stale)** | BAD_TARGET | BAD_TARGET |
| `kh: null` then `kh: Infinity` | **ok (stale)** | BAD_TARGET | BAD_TARGET |
| no `turnDeg`, then `turnDeg: undefined` (a fresh doc gives BAD_TARGET) | **ok (stale)** | BAD_TARGET | BAD_TARGET |
| `extendTurnBy` with `kv: null` then `kv: NaN` (the startOf / START memo) | **ok (stale)** | BAD_TARGET | BAD_TARGET |
| doc frozen at the top only, `pieces.pop()`, plain path | **STALE** | fresh | fresh |
| same, `turnDeg: -45` path | **STALE** | fresh | fresh |
| memo still hits on real docs (plain, corner, `createHistory().present`) | yes | yes | yes |
| 40 drag moves on a 2,000 m piece, ms per move | 0.144 | 0.143 | 0.144 |
| `turnDeg: -0` and `0` give the same piece | yes | yes | yes |
| `Date` in opts | kept | not kept | kept (as its ISO string) |

Something I tried that can't happen: freezing the pieces array but leaving a piece object mutable, then editing its channels in place. `extend` deep-freezes the pieces it shares with its input, so the first call freezes them and the later edit throws. Only the top-level `pieces` array (and other top-level fields) can be changed after a call. Both fixes cover that case.

## X

- **Correct?** Yes. `keyOf` accepts only values JSON writes faithfully: plain objects, arrays without holes, finite numbers other than −0, strings, booleans and null. `frozenDeep` checks every level and remembers what it found in a WeakSet. Both `MEMO` and `START` are gated on reads and writes. It also tightens the check on writes: the answer itself (`out` / `d0`) must be frozen all the way down. The base only checked the top.
- **Edge cases missed:** none in behaviour. It is the stricter of the two: it refuses non-plain objects such as a Map or Date in opts, where Y would key a Map as `{}`.
- **Test:** row 7 is red on the base ("Missing expected exception: kh NaN is refused"). It is also red with only the key fix applied ("{}: the edited pieces are read"), and red if startOf alone keeps the top-only freeze check ("{"turnDeg":-45}: …"). **Gap:** it never sends NaN through the START memo. With the bare `JSON.stringify` key put back in `startOf` only, X's row 7 **stays green: 7/7.** The bug is fixed in that path, but no test holds the fix.
- **Cut or weakened a test?** No. It only adds row 7.
- **Hand-back:** honest. It says the per-file counts were taken outside the lock. I re-ran them under the lock: 101 tests in the 9 related files (99 pass, 2 skipped) and 40 tests in the other 4 files that use turnby (35 pass, 5 skipped for fixtures). No failures.
- **To land it:** about 2 test lines. Add `extendTurnBy(d, {targets:{kv:null}}, θ)` and then assert that `kv: NaN` is refused.

## Y

- **Correct?** Yes. `keyOf` uses a replacer that throws on undefined, functions, symbols, non-finite numbers and −0. Sparse-array holes also reach the replacer as undefined, so they are refused too. `deepFrozen` works like X's. Both memos are gated on reads and writes. On writes it still checks only the top of `out` / `d0`. That is unchanged from the base, and harmless here because `extend` and `withChannels` deep-freeze what they return.
- **Edge cases missed:** small and theoretical. A Map or Set in opts is keyed as `{}`, so two different Maps would share one answer. A Date is keyed by its `toJSON` string. No caller passes either: the panel's `extendOptions` builds plain fields.
- **Test:** row 7 is red on the base. It is also red with only the key fix applied, red with either memo alone on the top-only freeze check, and red with the bare JSON key put back in startOf only. That last one is the case X's test misses. It covers NaN through both `extendCorner` and `extendTurnBy`, and the edited top-frozen doc through both paths. The hand-back says the frozen half was never shown red; I showed it red.
- **Cut or weakened a test?** Nothing was cut. One slight loosening: the refusal assertion accepts `e.code === 'BAD_TARGET' || e.code === 'NOT_FINITE'`, but the task says BAD_TARGET, and that is what every path throws. It doesn't hide this bug (a stale answer doesn't throw at all), but it is looser than the contract.
- **Tests:** 101 tests in the related files (99 pass, 2 skipped) and 40 in the other turnby users (35 pass, 5 skipped). No failures. Each author's test also passes on the other's source.
- **Hand-back:** honest, and useful. It flags the same top-only `Object.isFrozen(doc)` memo at `src/core/close.js:204` (`residualMemo`) as a follow-up.
- **To land it:** one line. Drop `|| e.code === 'NOT_FINITE'`.

## Verdict: land Y

The two source fixes behave the same in every probe, but Y's test also covers NaN through the startOf/START memo, which X's test does not (X stays green when that path is broken again).
Y needs a one-line change (assert BAD_TARGET only); X would need a new test case. Open the `close.js:204` follow-up that Y flagged.
