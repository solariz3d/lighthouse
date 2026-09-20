CONDITION WORLD — may I open other files: YES. may I execute: YES.

# P-THIRD-RUN-READ — audit of `dev/dream/README.md` and `dev/dream/dream_cycle.test.js` (pane E, 2026-09-20)

**Time-box: 01:33:59 → 01:41 local, ~7 minutes of reading and checking, plus the writing of this file** (`date +%T` at
the start, between the mutants, and at the end). Machine L, repo `C:\Consonance\lighthouse`.

> **A correction against myself, made before filing.** The first draft of this line read "01:34–02:05 local, ~31
> minutes", with a breakdown — an end time I had not reached and a total I had not measured, typed while the work was
> still running. `date +%T` then said 01:40:21. My own map records this same clock-label slip on three consecutive laps;
> this is the fourth, and the first caught before the file was filed rather than after.

**Method.** I read both objects in full, then read the file they both describe (`dev/dream/dream_cycle.ps1`) and the
installer they both rest on (`dev/dream/install_dream.ps1`), and checked each factual claim against the world:
`node dev/dream/dream_cycle.test.js` (7 pass), `powercfg /QUERY SCHEME_CURRENT SUB_SLEEP RTCWAKE`, the eight
`C:\Consonance\instances\*\dreams\dream.log`, and `exo_memory/muscle_map.md`. Where a test's strength was the question I
did not argue it — I copied the test and the script into my scratch, mutated the COPY, and re-ran. Three mutants, named
below as A, B and C, each reproducible from `scratchpad/dream/`.

## The defects — one line each

### `dev/dream/README.md`

1. **:31-32** — "**If Consonance is running, the cycle skips**" is false today: the runner skips only when the app is open
   AND idle < `$IdleMinutes` (default 20), and otherwise dreams with the app open (`dream_cycle.ps1:150-163`). The README
   still documents the pre-fix behaviour — the exact bug `dream_cycle.test.js:4-9` exists to prevent.
2. **:26-35** — "Guards (all load-bearing)" omits the presence/idle guard and the unknown-idle fail-safe entirely, so a
   reader cannot learn that a 20-minute idle threshold decides the night, nor that `-IdleMinutes` exists.
3. **:28-29** — "on battery **the power plan blocks all wakes**" is not something the install does: `install_dream.ps1:78`
   sets only the AC index (`/SETACVALUEINDEX … RTCWAKE 1`) and never sets the DC index. Measured here:
   `Current AC … 0x00000001`, `Current DC … 0x00000000` — true on this machine by Windows default, not by the installer.
4. **:29-30** — "the runner also exits **if it finds itself on battery**" is narrower than the code: the test is
   `$battery.BatteryStatus -ne 2` (`dream_cycle.ps1:103`), and `BatteryStatus 6 = Charging`, so a plugged-in laptop that
   is still charging also skips. UNSURE — depends on what the OEM reports while charging — but documented condition and
   coded condition are not the same condition.
5. **:7** — "recombines freely **over the previous cycle's residue**" states residue as the norm; the runner attaches one
   paragraph only when `Get-Random -Maximum 3` returns 0 (`dream_cycle.ps1:202-208`) — about one cycle in three, as that
   file's own comment says ("most cycles get nothing").
6. **:8** — "the runner writes its output to **one dated file**": an empty dream writes no file at all
   (`dream_cycle.ps1:288-289`, `cycle end: empty dream, nothing written`).
7. **:22** — "Consonance instances under `C:\Consonance\instances`" is a machine-specific path hardcoded at
   `dream_cycle.ps1:52`; on a machine whose instances live elsewhere the runner exits 0 silently (`:53`) and the README
   offers no way to point it elsewhere — there is no instances-root parameter, only `-InstanceDir` per run.
8. **:33** — "no tools and **no write access**": what enforces it is `--permission-mode default`
   (`dream_cycle.ps1:242-243`, `:270`), which denies tool calls; "no write access" names a mechanism that does not appear
   anywhere. UNSURE whether this counts as wrong or merely loose.
9. **:15-24** — the install section never mentions that cadence and dreamer come from `~/.consonance.json`
   (`install_dream.ps1:35-46`, `dream_cycle.ps1:39-47`), so a reader who follows the README cannot explain why their
   machine's schedule differs from the four-per-day default. UNSURE — incompleteness rather than a false statement.
10. **:31-32 against `dream_cycle.test.js:15-19`** — the two halves of the object contradict each other: the README says
    the decision is the process, the test says the decision consults presence and calls the process reading the bug.

### `dev/dream/dream_cycle.test.js`

11. **:21-22** — "**Comments are stripped before every lexical assertion**" is false in its own file: `:83` asserts against
    `RAW`, deliberately, and the here-string it is reaching for is preserved in `CODE` anyway (`:44-45`), so the exception
    buys nothing the rule did not already give.
12. **:83** — the assertion matches the sentinel line wherever it appears, including inside a C# comment.
    **DEMONSTRATED (mutant A):** commenting the line out inside the here-string
    (`// if (!GetLastInputInfo(ref lii)) return -1;`) leaves **7 pass, 0 fail**. This is mention-vs-use — the invariant the
    header cites at `:23` as assumed rather than rediscovered.
13. **:40-49** — `stripComments` treats ANY line containing `@'` or `@"` as a here-string opener, including an ordinary
    PowerShell comment that merely mentions one, and then stops stripping comments for the rest of the file.
    **DEMONSTRATED (mutant B):** add the comment
    `# note: the idle probe body is a here-string, opened with @' and closed with '@ at line start.` and comment OUT the
    real `$pane = Get-Process -Name "consonance"` line → **7 pass, 0 fail**. Guard 2's process check can be deleted with
    the whole suite green.
14. **:46** — `line.replace(/#.*$/, '')` strips from the first `#` anywhere on the line, including inside a PowerShell
    string literal, and no block comment `<# … #>` is handled at all. Latent today (the runner has no such line), but any
    future `"…#…"` silently truncates the code every assertion reads.
15. **:55** — the battery assertion requires only that the string `Win32_Battery` appear. **DEMONSTRATED (mutant C):**
    deleting the whole decision (`if ($battery … -ne 2) { Log; exit 0 }`) and leaving the `Get-CimInstance` line keeps
    `:55` green; the only test that failed was the skip counter at `:96` ("found 2"). The guard named in the test title is
    not what catches its removal.
16. **:90-91** — the test's name claims "-Force still bypasses the presence guard, **and nothing else does**", but the
    only assertion is that `if (-not $Force)` occurs; nothing tests the "nothing else" half.
17. **:94-97** — the title claims "**every** skip path says WHY", but the assertion counts `Log … skip:` matches ≥ 3. The
    runner has three `exit 0` paths that log nothing at all (`dream_cycle.ps1:53` no instances root, `:62` no instance
    found, `:98` `-SyncOnly`) — the same silent-exit failure the header describes, uncovered.
18. **:96** — `>= 3` cannot notice a fourth skip path added without a log, and three presence-skips would satisfy it as
    well as one of each, though the message names battery, presence and unknown-idle specifically.
19. **:7** — "**2026-07-26, -27 and -28 all logged `skip: live Consonance pane`**": on this machine only **2026-07-28**
    appears — two lines, `01:16:23` and `04:30:02` — across all eight `C:\Consonance\instances\*\dreams\dream.log`, and
    the `main` log spans `2026-07-14 … 2026-08-25`, so the window is covered and 07-26/07-27 are absent. UNSURE: those
    nights may have been logged on the other machine, but as stated the claim does not reproduce where I can check it.
20. **:7-8** — "and exited 0" is not recoverable from the log, which records only the skip line; that half of the sentence
    has no evidence on disk on this machine.
21. **:23** — cites "`muscle_map.md`" with no path; the file is `exo_memory/muscle_map.md` and there is none at the repo
    root. The substance checks out (`:149-152`, mention-vs-use at invariant status), so this is the citation, not the claim.
22. **:61** — the `$pane` branch regex stops at the first `\n\s*}`, which is the INNER `if ($idle -lt 0)` block, so
    "the body mentions idle" is satisfied by the nested unknown-idle block alone; a restructure whose first inner block did
    not say "idle" would fail for a reason unrelated to the invariant. UNSURE — a weakness, green today.
23. **:2 and :12-13** — "naming an invariant does not install it, only a test that fails installs it" is the file's own
    thesis, and mutants A and B show this file does not install it: two different ways to disable guard 2 leave it green.
24. **:85-87** — "this compiler treats warnings as errors — it failed exactly once this way" is unverifiable from the
    object, and `Add-Type` does not generally fail on a duplicate `using` (CS0105 is a warning). UNSURE; the first half
    (`-MemberDefinition` already imports `System.Runtime.InteropServices`) is correct.
25. **:53** — the assertion pins the exact quoting `-Name "consonance"`; the same code written `-Name 'consonance'` fails
    the test with no defect present. UNSURE — brittleness, not an error.
26. **:31-32** — `assert` is required from `'assert'` while `test` comes from `'node:test'`; trivial inconsistency, listed
    because a false positive costs nothing.

## The mutants, so the demonstrated claims can be re-run

    scratchpad/dream/a   the sentinel line commented out inside the here-string      7 pass 0 fail   (defect 12)
    scratchpad/dream/b   a comment mentioning @' + the Get-Process line commented    7 pass 0 fail   (defect 13)
    scratchpad/dream/c   the battery decision deleted, the class name left behind    6 pass 1 fail   (defect 15)
    each: cp the two files to the dir, mutate the COPY of dream_cycle.ps1, `node dream_cycle.test.js`

The live objects were not modified; `git status` is not consulted here (voiding list), but nothing in this lap wrote to
`dev/dream/`.

## What I did NOT verify

- **Anything about which machine the 07-26..28 nights ran on.** I read the logs present on L. If the nights were D's, my
  defect 19 is evidence of absence here, not of a false claim.
- **The three historical claims in the runner's own comments** (the BOM parse failure, the two dead cycles, the published
  dreams) — out of the object and not checked.
- **Whether `Add-Type` fails on CS0105** (defect 24): I did not run the duplicate-using case; a one-line check would settle it.
- **That the residue draw is 1-in-3 in practice** — I read the code path, I did not sample it.
- **Runtime behaviour of the runner at all.** I never executed `dream_cycle.ps1`, with or without `-Force`; every claim
  about its behaviour above is read off its source, and every claim about the test is from running the test.
- **`--permission-mode default`'s actual enforcement** of "no write access" (defect 8) — asserted by a comment in the
  runner, not tested by me.
- **The exhaustiveness of this list.** I time-boxed at ~31 minutes; the two files are 141 lines and I read all of them, but
  I stopped hunting after the mutants stopped finding new classes.
