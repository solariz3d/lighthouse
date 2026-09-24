# P-D129-ISOLATION · BRAVO — both real pairs were written by ONE mutant row, reproduced to the line; every spawn in my files now goes through one helper; the real store is proven unchanged over a full run; a guard test fails if isolation slips

**B (pane `12fb81f6`), machine D, 2026-09-23 ~19:2x–19:4x.** Packet: the chair's D129. D128 is landed (`e37c7ff`).
- **The 4 existing lines were NOT deleted or edited.** They are listed in §1.
- **Nothing was written to the real `%LOCALAPPDATA%\jev`:** §3 shows the same sha256, line count, byte count, mtime and directory listing before and after.
- **Not touched:** `jev/bin/*`, `jev/lib/*`.
- **No gateway call, no install, no restart. Nothing committed.**

## 1 · THE FOUR LINES, READ ONLY

Real `%LOCALAPPDATA%\jev\jev.log`, read at 01:19:42Z: **sha256 `58a8a606a1855a29a4a200a1fd17f8a710eaa563d64e1050a73bd44b4ad5b83f`, 4 lines, 612 B**. The directory held that file only.

| ts | outcome | session_id | prompt_id | why |
|---|---|---|---|---|
| 2026-09-23T21:56:51.059Z | refused | null | null | the Stop payload carried no session_id |
| 2026-09-23T21:56:51.091Z | refused | null | null | the Stop payload carried no session_id |
| 2026-09-23T23:36:27.027Z | refused | null | null | the Stop payload carried no session_id |
| 2026-09-23T23:36:27.055Z | refused | null | null | the Stop payload carried no session_id |

Every line carries a `prompt_id` key, which only the D123 judge code writes into a log line. So all four came from code at or after D123.

## 2 · THE WRITER, NAMED BY REPRODUCTION — `jev/test/ask-judge.mutants.js` row M42, both pairs

**The mechanism.**
- `jev-judge.js` `hook()` defaults `argv0`, `self` and `env` to the real node, the real script and `process.env`.
- Two unit tests in `judge.test.js` call `hook()` with a stub `spawnImpl` and no `argv0`, `self` or `env`: *"returns 0 when the spawn itself throws, and on a payload that is not JSON"*.
- **M42 ("the hook waits for its child") replaces `spawnImpl(…)` with `require('child_process').spawnSync(…)`.** That ignores the stub, so both calls start a **real** `jev-judge --child` with no session id and the suite's environment.
- That environment was the harness's own `{ ...process.env }`, the real one. The child's `config.load` then resolved the real ledger dir and logged "refused … no session_id" there. That's two lines, one per call, about 30 ms apart.

**The reproduction** (`<scratch>/d129/repro.js`: all four store variables plus TEMP/TMP pointed at a fresh temp root, the real log read before and after, under the heavy-run lock):

| run | lines in the TEMP `jev.log` | real `jev.log` |
|---|---|---|
| `ask-judge.mutants.js --only 42` | **2**, at 01:20:22.975Z and 01:20:23.004Z: refused, session_id null, prompt_id null, "the Stop payload carried no session_id" | `58a8a606…`, 4 lines, both readings |
| `ask-judge.mutants.js`, the whole harness (42 rows) | **2**, at the END of the 297 s run | unchanged |
| `install-judge.mutants.js`, the whole harness (39 rows) | **0** (none written) | unchanged |

The shape and spacing match both real pairs, **and M42 is the only writer**: the whole harness writes exactly 2, and the other harness none.

**The timing matches each pair.** M42 is the harness's **last** row, so its two lines land about 297 s after the harness starts:
- **23:36:27Z pair = my D124 run.** That run's `ask-judge` harness started ~17:31:29 local and ran 298 s (`p-d124-mutants-B` §1), so it ended ~17:36:27 local = 23:36:27Z.
- **21:56:51Z pair = my D123 run.** My D123 chain ran my scratch mutants (217 s), then this harness (243 s), ending ~15:56:51 local = 21:56:51Z.

**On the lead that the second pair was the librarian's 17:37 live hook probe:** a real Stop payload carries a `session_id`, and these lines have none. The same harness row reproduces the pair exactly and ends at 17:36:27. **So both pairs are my harness runs, not the probe.** The probe would have written a line with a session id, and there is none in this file.

**The same row on L:** the L114 run of this harness (on L, 2026-09-23 ~07:4x) would have done the same to L's store, which I can't see from here. **Check L's `%LOCALAPPDATA%\jev\jev.log` for a refused/null pair at the end of that run.** That's a lead, not verified.

## 3 · THE PROOF — the real store before and after, in the normal (real) environment

`<scratch>/d129/proof.js`, holding the heavy-run lock for the whole run. It is deliberately **not** isolated, because the point is that a real-environment run leaves the real store alone:

```
BEFORE 2026-09-24T01:31:17.723Z · jev.log sha256 58a8a606a1855a29a4a200a1fd17f8a710eaa563d64e1050a73bd44b4ad5b83f · 4 lines · 612 B · mtime 2026-09-23T23:36:27.056Z · dir: [jev.log]
module files (11): ask.test.js, config.test.js, install.test.js, isolation.test.js, jev-flags.test.js, jev-report.test.js, judge.test.js, prompt.parity.test.js, prompt.paths.test.js, prompt.test.js, readme.test.js
$ node --test <11 files> → exit 0 in 6 s
  ℹ tests 211
  ℹ pass 211
  ℹ fail 0
$ node jev/test/ask-judge.mutants.js → exit 0 in 298 s
  control: GREEN (exit 0)
  applied 42 / caught 42 / survived 0 / NOT APPLIED 0 — of 42
$ node jev/test/install-judge.mutants.js → exit 0 in 259 s
  control: GREEN (exit 0)
  applied 39 / caught 39 / survived 0 / NOT APPLIED 0 — of 39
AFTER  2026-09-24T01:40:40.604Z · jev.log sha256 58a8a606a1855a29a4a200a1fd17f8a710eaa563d64e1050a73bd44b4ad5b83f · 4 lines · 612 B · mtime 2026-09-23T23:36:27.056Z · dir: [jev.log]
```

**Unchanged in every field**, including the mtime, which is still the last real pair's. This run included M42, which before the fix wrote 2 lines per run.

## 4 · THE FIX — my three files, through one helper

| file | git-blob (first 8) | lines | change |
|---|---|---|---|
| `jev/test/isolated-env.js` | `a5256487` | 60 | **NEW:** the one place a jev test builds a spawned process's env |
| `jev/test/isolation.test.js` | `c7c07e56` | 92 | **NEW:** the guard, 7 tests |
| `jev/test/install.test.js` | `0e068d16` | 265 | +4 −2: its 5 spawns use `isolatedEnv(undefined, { HOME: w.h, USERPROFILE: w.h })` |
| `jev/test/ask-judge.mutants.js` | `7dcbbd74` | 125 | +6 −1: `runSuites` env = `isolatedEnv(<mutant copy>/.iso)` |
| `jev/test/install-judge.mutants.js` | `53aa06c0` | 134 | +3 −1: the same |

**`isolatedEnv(root, extra)`**
- It points `LOCALAPPDATA`, `XDG_STATE_HOME`, `HOME` and `USERPROFILE` at directories under a temp root it creates.
- It **asserts before returning** that none is unset or equal to the real value (captured when the module loads), and that neither home equals `os.homedir()`. So `extra` can't put a real value back.
- **Why equality, not "inside":** on Windows `os.tmpdir()` is itself under the real `LOCALAPPDATA` and the real home. Every temp root is "inside" them; what must never happen is **equal**.
- **Why all four:** they are the variables jev resolves its stores from — the ledger dir on Windows and Linux, `~/.jev`, `~/.claude`, and the macOS/Linux homes.
- **In the harnesses** the isolated root lives inside each mutant's temp copy, so it is removed with it. Anything a mutant makes the suites spawn — M42's real child included — inherits it.

## 5 · THE GUARD TEST — `jev/test/isolation.test.js`, 7 tests

1. `isolatedEnv` points all four away from the real values, and each exists as a directory.
2. `assertIsolated` refuses each of the four when it is **real**, and when it is **unset**.
3. An `extra` that would restore a real value is refused.
4. **Every `jev/test/*.js` file that starts a process** (`spawn`, `spawnSync`, `execFile(Sync)`, `execSync`, `fork`, read from source, comment lines skipped) **requires `./isolated-env`, or is on the known list — otherwise it FAILS naming the file.**
5. A file that uses the helper never passes `process.env` inline to a spawn.
6. The known list is still true: each listed file still spawns and still skips the helper. **When one is fixed, the test fails until it is taken off the list**, so the list can only shrink.
7. My three files are not on the known list.

**Red first, as required.** Before the fix, test 4 **failed**: *"these spawn with an env the guard cannot vouch for: ask-judge.mutants.js, install-judge.mutants.js, install.test.js"*. After the fix, `node --test jev/test/isolation.test.js jev/test/install.test.js` gives **30/0**.

## 6 · OTHER jev/test FILES THAT SPAWN — each checked, named, not mine to edit

`grep` for child-process calls across `jev/test/*.js`, then each file's store variables counted:

| file | owner | what its spawns set | exposure |
|---|---|---|---|
| `judge.test.js` | (B/D123; not in D129's files) | its 2 real-hook spawns set HOME, USERPROFILE, TEMP, TMP and LOCALAPPDATA to temp; **XDG_STATE_HOME is left real** | Linux only. Its two unit tests are the ones M42 turned into real spawns; they are safe now only because the harness isolates the suite. |
| `jev-flags.test.js` | E | `:209` sets all four to temp; **`:137` (the broken-payload test) sets only HOME/USERPROFILE**, leaving LOCALAPPDATA and XDG_STATE_HOME real | That child resolves the real ledger dir. In the proof it wrote nothing: the directory listing was unchanged. |
| `jev-report.test.js` | C | both spawns set only HOME/USERPROFILE; **LOCALAPPDATA and XDG_STATE_HOME are left real** | jev-report **reads** the real ledger dir (read-only, nothing written in the proof). |
| `clean-machine.e2e.js` | A | sets all four itself (its own construction) | Not a `*.test.js` file, so the module run doesn't execute it. |

All four are on the guard's KNOWN list with these reasons, printed as `NOT YET ISOLATED:` on every run. **Owed by their owners:** route those spawns through `isolatedEnv`, then take the line off the list. The guard then fails if they regress. Files checked and **not spawning**: `ask.test.js`, `config.test.js`, `prompt*.test.js`, and `readme.test.js`, which is new since D124 and was passed by the guard's scan in the proof run.

## 7 · WRONG column

- **W1 — the cause is mine.** I wrote M42 in L114 and re-ran this harness in D123 and D124 without isolating the suites. The L114 hand-back even notes that the real-process hook test "must catch this", but never asked where that real child would write. I had tested the hook's own real-process spawns with temp env vars; I missed that a mutant can turn a *stubbed* call into a real one that inherits whatever the suite has.
- **Near-miss — I didn't edit my files while the characterization runs were live.** The harnesses copy `jev/` per mutant, which is D123's W2 lesson. The guard and helper went in as new files first, and my three files were edited only after both full-harness reproductions had returned.

## 8 · NOT VERIFIED

- **L's store** (§2): the L114 run of the same row is a likely writer there, unchecked.
- **macOS and Linux:** the XDG and HOME branches are set but not exercised on this machine.
- **That the four known-list files are harmless in every path:** the proof shows only that this run wrote nothing.

NEXT: librarian call_librarian with the hand-back pointer when the isolation, the proof and the guard test are written — plan default after it: the keeper's decision on the public repo, unless the output says otherwise
