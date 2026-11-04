# D287 landing js-suite: stopped, three findings. Chair, 2026-10-10 19:4x.

The run: `scratchpad/jssuite_d287.js` (heavy-run `hold()`, then `node consonance/tools/js-suite.js`, JS_SUITE_TIMEOUT_MS=400000) in the MAIN checkout at be4ccafd, started 18:33 local. At 19:39 it was still going (349 ok so far) and I stopped it and removed my own lock. No green or red verdict on main comes from it.

An earlier 18:33 attempt "passed" with an empty log. `heavy-run.js` is a library (`hold`/`acquire`, `module.exports` at :263) with no command line, so `node heavy-run.js -- <cmd>` ran nothing and exited 0. It is not counted.

## 1. The evidence copies put 922 old test files into the suite
- `git ls-files 'exo_memory/handback/*_evidence/*' | grep -cE '\.test\.(js|mjs|cjs)$'` gives **922**. The largest are p-d190-E-seal (413), p-d191-A (258), p-verify-B (153), p-d195-E-lag (44) and p-d196-A (43). They came in with D287 part 3 (69d89696, e23fcb24).
- js-suite discovers them, runs them, and some fail, e.g. `p-d190-E-seal_2026-09-29_evidence/.../d190/pre/test/core_cup.test.js` (exit 1). These are snapshots of OLD trees, kept as evidence. They are not tests of this tree.
- So no full js-suite on main can be green, or short, until discovery skips `*_evidence/`. Or the copies keep their bytes under a non-test name. Either way the evidence stays byte-for-byte. Which fix is a ruling.

## 2. Two hook tests read the REAL ~/.consonance.json
- `consonance/hooks/sources-gate.test.js` fails 4 (pass 54), e.g. "GAMING: a path merely mentioned in a Bash echo does not count as opened". `consonance/hooks/reply-slot.test.js` fails "FAIL OPEN: with no data dir ...", and its actual output reads `REPLY SLOT (warning only, gates_mode light) ...`.
- With an empty home (`USERPROFILE=$(mktemp -d) HOME=… node <test>`), both are green: 58/0 and 36/0.
- Cause: setting `"gates_mode": "light"` in ~/.consonance.json at 18:3x (the D277 go-live) reached the tests, because they do not pin their mode. Real defect: the tests are not hermetic. The gate code reads the switch per call (`mcp.rs` `gates_mode()`; the JS hooks likewise). So these tests now go red on any machine in light mode.

## 3. consumer-fork-wiring.test.js is red in the main checkout only
- In the main checkout it fails 1 ("exo_memory/cards/engagement-honesty-over-performance.md: the relabel did not reach the output: The keeper also caught"). It is green (2/0) in clean detached worktrees on G: at e9488fc5, at e23fcb24 and at 1dc31c9c (A's landed tip). So A's commits did not cause it.
- Cause: that card's working copy in the main checkout is CRLF (`git ls-files --eol` shows `i/lf w/crlf attr/text=auto eol=lf`; the file is dated 07-07, from before the eol attribute existed). The relabel row in `consonance/tools/consumer-relabel.js:192` matches `'He also caught\nme mistaking'`. 3,254 tracked files in the main checkout have CRLF working copies (`git ls-files --eol | grep -c 'w/crlf'`).
- Consequence for the collator: a landing suite run in the main checkout measures the checkout's line endings and its untracked files, not the commit. From here on I run landing suites in a clean worktree on G:.

## Held until these are ruled on
E's ef8fe910 is not landed, the janitor task is not installed, and main is not pushed. Main has A's part 1 (b03d7320, 50ed5c8d, 1dc31c9c) and the hand-backs (be4ccafd), all unpushed.
