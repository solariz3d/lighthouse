# P-L068-MANIFEST-STICK · ALPHA — the vantage log is placed and the relaunch no longer leaks CONSONANCE_DATA; close --check is still exit 1, because the RUNNING app still leaks

**Pane A, machine L, 2026-09-21 05:4x–06:0x.** Lap L068. Source: C's `handback/p-l066-unplaced-C_2026-09-21.md` (e06e804)
§2.1, §2.4, §5, read at source. **Four files, uncommitted:** `consonance/state-manifest.json`,
`consonance/tools/state-manifest.test.js`, `dev/stick-apply.js`, `dev/stick-apply.test.js`. **No existing test was
weakened, removed or modified**; the six tests are new, and every prior test passes before and after. No real close was
run. `main.rs` is dirty in the tree too — that is **E's** (keep-warm), untouched by me. The eight hooks' seam is untouched.

## 0 · ONE DEVIATION FROM THE PACKET'S WORDING, and the bar that was not reached

**(a) The rule is in `state-manifest.json`, not `state-manifest.js`.** The packet named the `.js`, but the rules and the
`vantage_cell` premise both live in the JSON (`consonance/state-manifest.json:84`); the `.js` is the checker and carries
no rules. **`state-manifest.js` is byte-identical to HEAD.** I took the packet's intent — *a STAYS rule, and correct the
premise* — as naming the file those two things are in. If that was the wrong reading, the diff is one line and one
changed reason.

**(b) The bar `close.js --check` exit 0 was NOT reached, and cannot be from this packet.** After my change the refusal
names only the leak's families, **recreated after the librarian's move**:

    node consonance/tools/close.js --check        (run plainly, no pipe)
      NOT CLOSED — the state set was not prepared: REFUSED_UNPLACED · state-sync exited 1
        digests · digests/2026-09-21.md · pulse · pulse/2026-09-21.jsonl
      EXIT=1

`ls --time-style=full-iso`: both directories were created **05:32:10**, and both files last written **05:38:42**. All
three pulse lines carry `cwd C:\build\lighthouse-target\release` — the scribe, which is C's §2.1 writer.
`vantage_cell/mutants-run.log` is **no longer in the list**.

**Why my fix cannot clear it, stated before anyone assumes it will:** the app running now (`consonance.exe` pid 43356,
created **00:50:30**, parent 13352 — `Win32_Process`) already holds `CONSONANCE_DATA` in its environment, and every
`claude -p` it spawns inherits it. `dev/stick-apply.js` only decides the environment of the **next** relaunch that goes
through the applier. **So the leak keeps running until this app is closed and started by a path that does not set the
variable** (`launch.ps1` does not — C §2.1 link c), and then someone must move `digests/` and `pulse/` again. **That move
is not mine**: it is the keeper-level K1 in C §4, which the librarian carried out at the keeper's word the first time.
I moved nothing.

## 1 · ITEM 1 — the vantage_cell log, placed

- **New rule:** `vantage_cell/mutants-run.log` · **STAYS** · a local run's raw output (the killed/survived rows of a
  state-sync mutant run — quiescence gate, 100 MB cap, unplaced-path check), left by a process whose cwd was the cell.
  `grep -rln "mutants-run.log" consonance dev` → nothing, so no tool writes that name.
- **Named in full, not `vantage_cell/**`.** The next file a reader leaves in the cell should refuse loudly; a wildcard
  would make it stay silently. That is a test, not only a sentence (§3).
- **The premise, corrected:** the `vantage_cell` rule said *"an EMPTY working directory"*. It now says it is empty **when
  the tool creates it**, says the old wording was false from 2026-09-14 01:23, and gives the reason it can hold files —
  readers launch with the cell as their cwd (`second-vantage.js:194`). The class stays REGENERATES
  (`second-vantage.js:189` still creates it).

## 2 · ITEM 2 — the relaunch no longer passes CONSONANCE_DATA

`dev/stick-apply.js` `defaultRelaunch`: the spawn now gets an explicit `env`, which is the applier's environment with
`CONSONANCE_DATA` removed, and **the applier's own environment is not modified** (a carry still to run needs it). The
function also takes `spawnFn` and `env` parameters that default to the real `spawn` and `process.env`, and is exported
— the spawn is the boundary, so it is the seam. The CLI path calls it as `k.relaunch(exe)`, so the defaults are what
runs.

**Safe for the app, checked, not run:** `grep -n 'CONSONANCE_DATA' consonance/src-tauri/src/*.rs` → the app **never
reads** the variable; it **sets it explicitly** on each of its three node children (`main.rs:11666`, `:11731`,
`:11854` in E's working tree), so the carry and the applier still get it from the app. What the app loses is only the
copy it passed, unasked, to everything else.

## 3 · RED FIRST, THEN GREEN — the command beside every number

    node consonance/tools/state-manifest.test.js
      BEFORE                      25 passed, 0 failed
      RED (2 new tests)           26 passed, 1 failed
        FAIL the shipped manifest places vantage_cell/mutants-run.log as STAYS   (unplaced ["vantage_cell/mutants-run.log"])
        green at red ON PURPOSE (control): any OTHER file left in vantage_cell is still UNPLACED
      GREEN                       27 passed, 0 failed

    node dev/stick-apply.test.js
      BEFORE                      48 passed, 0 failed     (the packet's last: 48/0 — matches)
      RED (4 new tests, seam only, no fix)   50 passed, 2 failed
        FAIL the relaunch does NOT pass CONSONANCE_DATA on to the app
        FAIL the relaunch keeps the REST of the environment — only the one variable is dropped
        green at red ON PURPOSE (controls): the relaunch is otherwise unchanged (detached, no stdio, cwd beside the exe);
        the applier's OWN environment is not modified
      GREEN                       52 passed, 0 failed

    node consonance/tools/state-manifest.js       (live data dir)   exit 1 — UNPLACED 4: digests, digests/2026-09-21.md,
                                                                     pulse, pulse/2026-09-21.jsonl

**The red for item 2 is on the seam, stated rather than hidden:** I added the `spawnFn`/`env` parameters and the export
first, with the spawn options unchanged, so the red run is HEAD's behaviour driven through the new seam.

## 4 · MUTANTS — on copies; the live files hashed before and after

    node <scratchpad>/l068/mutants.js
      pre-flight 27/0   state-manifest (unmutated copy)
      killed (26/1)     manifest · the log rule is removed
      killed (26/1)     manifest · the log rule is widened to vantage_cell/**
      killed (26/1)     manifest · the log is classed TRAVELS
      killed (25/2)     manifest · the directory rule is widened to swallow its contents
      pre-flight 52/0   stick-apply (unmutated copy)
      killed (50/2)     stick · env is not passed (the old line)
      killed (50/2)     stick · the whole env is passed through
      killed (51/1)     stick · an empty env is passed
      killed (51/1)     stick · the variable is deleted from the applier's own env
      killed (51/1)     stick · detached is dropped
      live files unchanged: true

**9 listed · 9 killed · 0 survived · 0 NOT APPLIED.** The manifest copies run the tracked test from a mirrored
`consonance/{tools/,}` tree; the stick copy runs through `STICK_APPLY_UNDER_TEST`, with its two relative `require`s
rewritten to absolute paths, so nothing was written beside the source.

## 5 · WHAT I DID NOT VERIFY

- **close.js --check exit 0** — not reached (§0b). It needs the running app restarted without the variable and the
  leaked families moved again, and both of those belong to the keeper.
- **An applier relaunch was not run end to end.** The env is shown through the captured spawn, not by relaunching the app
  and reading its environment.
- **That scrubbing is safe for the app** rests on the grep (no read in `src-tauri`), not on running the app without it.
- **The js-suite was not re-run**; only the two test files and the mutant pass.
- **Machine D was not run.** D runs the same applier; its data dir was not checked.
- **This pane carries `CONSONANCE_DATA` too** (C §2.1 link c). Interactive panes are exposed in principle, and nothing I
  changed affects them until the app is relaunched.

## 5a · CORRECTION TO MYSELF

My map line was first appended with `printf`, which read `\b` and `\r` in `C:\build\...\release` as control characters.
That is the backslash-eating failure C §2.3 names, the same one that made the 143 KB `…claudeoot.json`. I repaired it
with a script (`<scratchpad>/l068/fixmap.js`: exactly one mangled path replaced, 0 `\x08`/`\x0d` left in `map/A.md`).

## 6 · FOR THE ROOM, NOT FIXED

- **The relaunch path.** Until the app is restarted without the variable, the scribe will write one new digest and pulse
  file into the data dir every day, and every close refuses. The fix in this packet only takes effect at the applier's
  next relaunch; a plain restart through `launch.ps1` would stop it today with or without this change.
- **The eight hooks' seam** (C §2.2, §5) — left alone, as the packet said. It is the second half of the same collision;
  my change removes one carrier of the variable, not the hooks' reading of it.

NEXT: librarian route §0b's restart-and-move to the keeper and re-run close --check after it, when this file is read
