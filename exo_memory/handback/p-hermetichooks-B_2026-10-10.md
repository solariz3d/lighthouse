# P-HERMETICHOOKS-B: D287 follow-up, the two hook tests stop reading the real home (pane B, machine D, 2026-10-10)

**DONE. Commit `793970ec` on branch `d287-b`** (worktree `G:\b-d287-wt`, from main `8b09b16e`). Not pushed. It touches 2 files, +37/−2:
- `consonance/hooks/sources-gate.test.js`
- `consonance/hooks/reply-slot.test.js`

**What changed:**
- Each file builds `STRICT_HOME`, an empty temp directory with no `.consonance.json`, and `envFor` gives every child `USERPROFILE` and `HOME` = that directory. With no config the hook runs strict. `os.homedir()` follows `USERPROFILE` on Windows.
- Each file gains one row, `D287 LIGHT: …`. The row writes `{"gates_mode":"light"}` into a second temp home and runs the same input twice:
  - **sources-gate:** strict denies a quoted cd-chain item, and light allows it with the row marked `mode: "light"`. Light still denies an item nothing in the turn touched.
  - **reply-slot:** strict blocks a would-block reply. Light prints `REPLY SLOT (warning only, gates_mode light)…` with no `decision`, exit 0 and empty stderr. Its row has `wouldBlock: true`, `blocked: false` and `mode: "light"`. A `Sources: none` reply prints nothing.
- No hook source was changed, and js-suite.js was not touched.

## Red first, then green (all under the heavy-run lock, through `scratchpad/d273/run.js`, which loads main's heavy-run.js by absolute path; `--test-concurrency=1`)

The real `~/.consonance.json` has `"gates_mode": "light"` (checked: `grep -o '"gates_mode"[^,}]*'`).

| run | tree | result |
|---|---|---|
| `node --test consonance/hooks/sources-gate.test.js` | 8b09b16e, unmodified | **54 pass / 4 fail** of 58: the METADATA (×2) and GAMING (×2) rows |
| `node --test consonance/hooks/reply-slot.test.js` | 8b09b16e, unmodified | **30 pass / 6 fail** of 36: D218 SCOPE, FAIL OPEN (no data dir), LIVE CHAIR, LIVE FIXABLE, LIVE PIN, VERDICT |
| the same, sources-gate | 793970ec | **59 / 0** |
| the same, reply-slot | 793970ec | **37 / 0** |
| `gate-mode.test.js` (E's in-process light tests, untouched) | 793970ec | 6 / 0 |
| **control:** the new rows only (`--test-name-pattern=D287`) on a COPY whose `gatesModeFrom` always returns strict | copy | sources-gate **0/1** (light denied the chain); reply-slot **0/1** ("light blocked"). So both rows have teeth |

The chair saw 1 reply-slot failure; I saw 6. All 6 are the light mode: five rows expect a block and get a warning, and VERDICT expects an `ls` not to count. They are green once the home is pinned.

Logs: `scratchpad/d287b/` (`red-*.out`, `green-*.out`, `green2-rs.out`, `gm.out`, `mut-*.out`, `mut2-rs.out`, `base-*mut.out`, `sgmut.out`, `rsmut.out`).

## Findings beyond the ask

**F1 — HOOK, for E (D277 part 2, `ad3103b5`): light mode accepts a path that was only MENTIONED.**
- The four sources-gate rows that went red in light are the GAMING and METADATA guards:
  - `echo C:/work/a.md`, a comment line, or `ls <path>` counts as having opened the path.
  - The cause is `lightMatch`'s first rule, `light-command`: `cmd.includes(itemC)` (`sources-gate.js`, in `lightMatch`) is true for any command whose text contains the item, so a path item matches its own echo.
- **This contradicts the light block's own comment** ("It still refuses an item nothing in the turn touched") and the ruling's "what was actually run or fetched" (`plan_lighten_the_load_2026-10-09.md:34`). An echo ran, but it did not open the path.
- A likely fix: apply `light-command` only to an item that is itself a command (backticked, or one whose first word is a program), never to a bare path.
- **Not changed (the hook is not mine), and not pinned:** my light row does not assert the echo case either way.
- The reply slot uses the same matcher (`VERDICT … an ls does not open` was red in light), so this one cause affects both gates.

**F2 — HARNESS, for A (D287 part 1, `50ed5c8d`): both mutants harnesses are red at their control on main.**
- `sources-gate.mutants.js` and `reply-slot.mutants.js` copy only the hook, its suite and its siblings into the mutant tree (`sources-gate.mutants.js:116-120`). The suites now `require('../tools/scratch.js')`, which the copy lacks.
- At `8b09b16e` with my change stashed: **control 11 pass / 25 fail** (sources-gate) and **8 / 50** (reply-slot), so "CONTROL NOT GREEN" before my change.
- With my change the control fails at load (0 / 1), because `STRICT_HOME` calls `tmpDir()` at module load. Either way no mutant result means anything until the harness copies `consonance/tools/scratch.js`. That is a one-line fix in each harness, which I don't own.

**F3 — reply-slot in light writes its warning even when the ledger cannot be written.** That is why "FAIL OPEN … a ledger that cannot be written … prints nothing" went red in light. It still never blocks and exits 0, so fail-open holds. I'd call it by design (a warning is not a gate) and did not pin it. Noting it so E can say otherwise.

## The ruling

I agree with it. My one argument: the ruling says both modes are tested "on purpose", but in-process light behaviour was already tested by `gate-mode.test.js` (6 rows). What the new rows add is the spawned path: the hook reading the home, the mode field on the row, and warn versus block on stdout. That is the part the real config was leaking into.

## Other tests: what spawns these hooks or reads `~/.consonance.json` without pinning HOME (listed, not fixed)

How I searched: `git grep -l -E "sources-gate\.js|reply-slot\.js|\.consonance\.json|gates_mode|homedir\(\)" -- '*.test.js' '*.mutants.js'`, then each file with no `USERPROFILE|HOME` was read by hand. `gates_mode` is read by only three sources: `sources-gate.js`, `reply-slot.js` and `dev/shell/hooks/session-start.js` (checked: `git grep -l -E "gatesMode|gates_mode" -- '*.js' ':!*.test.js'`).

| file | what it touches | at risk from the real home? |
|---|---|---|
| `consonance/tools/sources-gate.mutants.js`, `reply-slot.mutants.js` | spawn the two suites on a copy | no longer, since the suites pin their home now. Their control is red for F2 |
| `consonance/hooks/delete-gate.test.js`, `push-gate.test.js` | spawn hooks whose `dataDir()` falls back to the config's `data_dir` | **no**: every spawn sets `CONSONANCE_DATA`, so the fallback is never reached. The real home appears only as a cwd value |
| `consonance/tools/actors.evidence.test.js` | reads the real config's `data_dir` in-process | **by design**: an evidence test about the real board (its own header, :47) |
| `consonance/hooks/dream-gate.test.js`, `consonance/tools/identity-diff.test.js` | name the two hooks as text (a call-site table, the wake list) | no: they never spawn them |
| `consonance/hooks/gate-mode.test.js` | calls `gatesModeFrom(raw)` with literal strings | no: it never calls `gatesMode()` |
| `jev/test/install-judge.mutants.js`, `exo_memory/loop/d121_relay/harness.test.js` | use `os.homedir()` as a path value | no: they don't read the config |
| `dev/shell/hooks/session-start-light.test.js` (the third `gates_mode` reader) | spawns session-start | already pins its home |

Inferred: none of the listed files will go red because of the real home's `gates_mode`. Checked for the two harnesses (F2 is a different cause), and by reading the others' spawn environments, not by running them.

## What I did NOT check
- The full js-suite (the collator's job), and the two mutants harnesses past their control (F2 blocks them).
- Whether `data_dir` or `room_path` in a real home could change other rows of these two files: the pinned home removes both, so they can't now.

## Corrections to myself
- **W1:** my first reply-slot light row lost its regex escapes through a heredoc (`\(` became `(`), so it failed on its own assertion. I replaced it with `startsWith` via Edit, and the file went green 37/37.

NEXT: librarian route F1 to E and F2 to A when this is read. The chair lands `793970ec` with A's part, by the ruling's order.
