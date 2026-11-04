# p-consumer-frontdoor-E · D273 lap 4: the front door · pane E, on D, 2026-10-08 · DONE

**Commit `a32bccae`** on lighthouse `29d9b1fe`, branch `d273-frontdoor`, my own worktree `C:/Users/nname/Desktop/worktrees/e-front-wt`. 7 paths
(6 edited and 1 new test), not pushed, not landed. Main has since moved to `82500f20`. That commit touches none of my 7 paths
(`git log 29d9b1fe..main -- <paths>` is empty), so landing applies cleanly.

## What each item became (from the cold read, `p-consumer-coldread-LIB_2026-10-08.md`)
- **A3 and B5, the prerequisites and the GUIDE link.**
  - README "Try it" now lists **MSVC Build Tools**, and **Node.js and Python 3, installed before the hooks**, worded as in `consonance/GUIDE.md:10-17`.
  - It links `consonance/GUIDE.md` and gives the hooks install line (`dev\shell\install.ps1`) after `cargo tauri dev`.
  - "Go deeper" also points to the GUIDE.
  - `consonance/README.md` "Build" says the same thing: there is no Node at runtime, but the hooks need Node and Python.
- **B4, the diversity bet.** `GUIDE.md:91` no longer says that conditioning the panes differently is the defence. It now says this was the founding bet,
  and that the bet was measured not to hold. It cites GUIDE step 3 (:71) and the README's "The founding bet was wrong", so the three places agree.
  What survives is in the README's own words: panes required to measure rather than assert, plus you reading the disagreements.
- **A6, the glossary.** Written, not dropped: `consonance/README.md` now has a `## Glossary` section with 21 entries (counted: `sed -n '/^## Glossary/,/^## Where/p' consonance/README.md | grep -c '^- \*\*'`), including seat, pane, chair, librarian,
  hand-back, ring, dispatch, collation, map, board/phase, mount, gate, hook, keep-warm, room and the keeper. The README links it as `consonance/README.md#glossary`,
  and GUIDE:3 and :111 point to it. "Complete" is dropped from GUIDE:111.
- **D, B1 and A8, GATES.md.**
  - **Six gates.** GATES.md now documents the six shipped gates:
    - §1 SOURCES and §2 the reply slot keep their section numbers, which the refusal pointers in `sources-gate.js` and `reply-slot.js` name;
    - §3 the NEXT trailer;
    - new: §4 the dispatch gate, §5 the push gate, §6 the delete gate.
  - **What each section gives.** What the gate does, why, its refusal text (taken from each hook's own string), how to answer it, and **"To turn it off:"**
    with the exact file or setting:
    - **§1, §4, §5, §6:** the hook's entry in `%USERPROFILE%\.claude\settings.json`, under `hooks → PreToolUse`;
    - **§2 the reply slot:** `SHADOW = true` in `consonance/hooks/reply-slot.js`, or its `Stop` entry;
    - **§3 the NEXT trailer:** `consonance/src-tauri/src/trailer.rs` `fn policy` and a rebuild. It is not a hook.
  - **Keeping a gate off.** The closing section says to mark the gate `Excluded` in `dev\shell\install.ps1`'s `$register`, because a bare re-run would put it back.
  - **Glossary.** A short glossary follows the opening: seat or pane, chair = Orchestrator, librarian, hand-back, ring, dispatch, collation, and
    the keeper = the person who built it ("in your own room, whoever keeps it is you").
  - **Evidence links.** The three evidence pointers are now links of the form `https://github.com/solariz3d/lighthouse/blob/main/exo_memory/loop/<file>`.
- **B6, retired Jev (A's list, `p-consumer-jargon-A_2026-10-08.md` Part A). I took rows A1–A5, A7 and A8 as A wrote them.**
  - A1 is the "Know before" bullet, A2 and A3 the About bullet and "not Jev,", A4 the Third Place row's second sentence, and A5 the section, now a tombstone in A's wording.
  - The three removed passages were moved **verbatim, by exact line range at `29d9b1fe`** (75–78, 107–110, 257–275) into
    `exo_memory/loop/readme_history_2026-09-25.md`. The script checked each block byte for byte after writing. A said 257–273; the section actually runs to 275.
  - Row A6 (a hand-back's file name) is left alone, as A said.
- **One file outside my four: `consonance/ui/index.html`.** A2 and A3 are tied word for word to the About tab by `about-readme.test.js`, so A7 has to be
  the same edit (`<li>` deleted, "not Jev," deleted). I also cut the Third Place tab's `title=` Jev clause (A8), to match A4. The HTML comment at :176–184
  is left alone. **If index.html belongs to another seat this lap, this is the line to check.**

## Tests (all under the lock)
- **New: `consonance/tools/front-door-links.test.js`, 3 rows:**
  1. every relative link and `#anchor` in the four documents resolves;
  2. the README links the GUIDE and the glossary, and the glossary heading exists;
  3. GATES.md has six numbered gate sections, each with "To turn it off:", and each public-repo link names a path in this tree.
- **Red first:** on a `git archive 29d9b1fe` copy, rows 2 and 3 fail and row 1 passes, because the base's links already resolved. On the branch it is **3/3**.
- **Targeted run:** **192/192, 0 fail** (`front/targeted2.tap` sha256 `e7d394a1…`). It ran the new test, gen-consumer (including the "GATES.md ships, no leak,
  the refusal pointer resolves" row), identity-diff, reply-slot, sources-gate, and every `consonance/ui/*.test.js` that reads index.html:
  about-readme, chain-indicator, gate-card-routing, librarian-wiring, scripts-load, third-place-wiring, usb-mode-wiring.
- **Not run:** cargo `arch_test::every_relative_link_in_the_docs_exists_in_a_fresh_clone`. I read it instead: it splits off `#anchors` (`arch_test.rs:701`)
  and skips http links (:698), and every new relative target is a tracked file.
- **Credential scan:** 0 hits for `sk-or-`, `vck_` and `sk-ant-` in all 7 paths.
- **Lock note:** on my second run, heavy-run itself took over B's lock as stale (pid 3168 was not running, 2 minutes old). I did not remove it by hand.

## For the chair and B: two things that keep A8 from being done in the consumer
1. **The public repo does not have the evidence files yet.** `git ls-remote origin refs/heads/main` = `ce44d781`, the 2026-09-28 head, which is behind local main.
   The three `exo_memory/loop/*.md` paths exist in this tree, and the test pins that, but they appear on github.com only after the keeper's next push.
2. **The generator rewrites the handle inside the URL.** `consonance/tools/gen-consumer.js:1369` is `rep(/solariz3d/gi, 'the keeper')`. In the consumer it turns
   all three GATES links (and README's) into `github.com/the keeper/lighthouse`, which is cold-read A1. That file is B's: the public repo URL needs an exemption there.

## Not done
- **B's dead-link lines for this lap had not reached me** when I committed. B's parity hand-back holds only lap 3's items for E, and those were done in lap 3.
  When they arrive I take them on this branch.
- `GUIDE.md:112-114` (PLAN.md, PROGRESS.md and DESKTOP_HANDOFF.md, cold A7) are bare names, not links, so no link test sees them. I left them for B's dead-link
  list rather than guess.

---

# Lap 4b (pane E, 2026-10-09 ~03:0x): B's lines, DOCS ONLY · DONE

**Commit `ca6d5851`** on lighthouse main `593dbcdb`, branch `d273-frontdoor-4b`, my own worktree `C:/Users/nname/Desktop/worktrees/e-front4b-wt`.
4 named paths, not pushed, not landed. The source for this lap is B's "For E" list, `p-consumer-parity-B_2026-10-08.md:579-590`.

- **`consonance/GUIDE.md:112-114`: the three lines are DROPPED.** These were PLAN.md, PROGRESS.md and DESKTOP_HANDOFF.md, and all three fail the scan (B's call).
- **`consonance/README.md:49-50`: brief/ is now named as it is.**
  - It holds the 7 briefs (BASE_JOURNAL, BOOT, BUILDING, COMMITTEE, LIBRARIAN, SEED, THIRD_PLACE), the fork-note template `frag-fork.md`, and `room-settings.json`.
  - One added sentence says the development tree also holds `frag-pointer.md` and `frag-traces.md`, which the app never reads and which do not ship.
  - Checked: `grep -o 'brief/[A-Za-z_.-]*' src/*.rs` names only LIBRARIAN.md, frag-fork.md, room-settings.json, COMMITTEE.md and BUILDING.md, and never either fragment.
- **`consonance/README.md:201`: the librarian's intake** "is the `CLAUDE.md` the app writes into the librarian seat's own working directory each time it starts the
  seat (it is not a file in this tree)". Checked: main.rs writes `dir.join("CLAUDE.md")` (`:3485` assemble_intake, `:3611`, `:5682`).
- **README.md `jev/README.md` mentions: DROPPED, and already done.** Lap 4 (`a32bccae`) moved both passages verbatim to `exo_memory/loop/readme_history_2026-09-25.md`.
  `grep -n "jev/README" README.md` on 593dbcdb returns 0 lines.
- **`front-door-links.test.js`: the evidence row is SPLIT, as B described.**
  - `GATES.md documents six gates, each with how to turn it off` is product, and it runs in the consumer.
  - `GATES.md evidence links point into the public lighthouse repository at paths in this tree` is the only row still declared workshop-bound.
- **One line in B's file: `consonance/tools/gen-consumer.js:505`.** It is the WORKSHOP declaration's anchor, moved to the new row's exact name. The reason
  text and the count (28) are unchanged. This was necessary, not optional: an anchor that matches nothing REFUSES the build (`declareDrift`, with a row
  of its own that passed here). **B, please look at this line.**

**Tests, under the lock:** front-door-links, gen-consumer, gen-consumer.fixture-scope, gen-consumer.build, identity-diff and about-readme.
- **Result: 119 tests, 114 pass, 0 fail, 5 skipped** (`front/4b.tap` sha256 `8ca9b9b7…`).
  - The 5 skips are by design: 4 are the launch probe (`CONSONANCE_LAUNCH_PROBE` is off by default), and 1 is "cargo is not on PATH".
  - All 4 front-door rows pass. gen-consumer's declared-rows count stays at `[28, 12]`.
- **Not run:** the front-door test inside a GENERATED tree. B's next parity run would show the six-gates row running there.
- **Credential scan:** 0 hits for `sk-or-`, `vck_` and `sk-ant-` in all 4 paths.
- **My own fault, fixed:** a heredoc into a JS template literal mangled the test's regex escapes again (`\r?\n` became real control characters). I caught it on
  the diff before running anything and rewrote the file with the Write tool. That is my carried rule, broken once more: no code through shell layers.

---

# Lap 5 (pane E, 2026-10-09 ~03:2x): cold read 2, paths + docs · DONE

**Commit `51a16d94`** on lighthouse main `a19c876d`, branch `d273-lap5-E`, my own worktree `C:/Users/nname/Desktop/worktrees/e-lap5-wt`.
10 named paths, not pushed, not landed. Items: `plan_consumer_refresh_2026-10-08.md:258-266`. Report: `p-consumer-coldread2-LIB_2026-10-09.md`.
A4 (LIBRARIAN.md) went to C and consonance/README.md to A, so neither is touched here.

## THE SAME-DATA-DIR PROOF, this machine (read first)
`<scratchpad>/lap5/same.js` reads the real `USERPROFILE` and the live `~/.consonance.json` (read only). It runs the NEW code's own resolution text and
compares it with the base `a19c876d`'s value. Output `lap5/same.txt`, sha256 `ce6b9d1c…`:
```
SAME BYTES  ARRIVING.ps1 persist.log it names        C:\Consonance\data\persist.log   (the new block run in a real PowerShell)
SAME BYTES  dev/ARRIVING.ps1 repo-resolution lines (text)
SAME BYTES  dev/LEAVING.ps1 repo-resolution lines (text)
SAME BYTES  precompact.js checkpoint script          C:\Users\nname\Desktop\lighthouse\exo_memory\loop\checkpoint.py
SAME BYTES  blind.js data folder (no override)       C:\Consonance\data
```
- **LEAVING.ps1 is not changed at all.** It names no data folder; its only path rule is the repo, which is B's lap-4 `room_path` line and is unchanged.
- **ARRIVING's only data-folder use was the printed line at :137.** The repo lines and the import are byte for byte as before.

## What each item became
- **A5, the USB flow:**
  - **ARRIVING.ps1:** a `# D273 data: begin/end` block gives `$data`, which is `data_dir` when set (trimmed), else `%USERPROFILE%\.consonance`. The RESUMED line now names
    `$(Join-Path $data 'persist.log')`.
  - **GUIDE "Optional: move seats with a USB drive":**
    - the setting, and that it is off until ticked;
    - copy `dev\LEAVING.ps1` and `dev\ARRIVING.ps1` to the top of the drive (they take `$PSScriptRoot` as the drive);
    - **LEAVING's first run is what writes `consonance-transfer\MANIFEST.json`.** `tail-carry.js:180` says whoever writes the ledger rewrites the manifest.
      Checked: a `--export` rehearsal onto an EMPTY temp folder plans every seat FULL ("no agreed state on the stick") and writes nothing.
    - ARRIVING, and then the app finding the drive by that manifest (`find_stick`, `sync_launch.rs:839`).
- **A6, precompact.js:** `roomRepo()` is the app's rule (`main.rs` `repo_root` / `repo_root_from_room_path`): `room_path`'s grandparent, only if
  `exo_memory\BOOT.md` is a file there, else no checkpoint (fail-open, as before). **It still has nothing to run in the consumer**, because `exo_memory/loop/` does not ship.
  It is no longer pointed at another machine's checkout, but it stays an inert hook there. Whether to ship a checkpoint script or not register this hook for strangers is B's or A's call.
- **B9, blind.js:57:** the default is now `consonanceDir('data_dir', '.consonance')`, using the shared D273 block verbatim. `CONSONANCE_DATA` still wins.
  The block's own comment still lists the first five hooks, because `dirs.test` row 1 holds the block to one text. The HOOKS list says blind.js joined.
- **A8, the shortcut: documented, not created.** GUIDE "Optional: a Desktop shortcut" gives the two-line PowerShell that makes `Consonance.lnk` → `wscript.exe "<repo>\consonance\launch.vbs"`,
  using `[Environment]::GetFolderPath('Desktop')`. **For B: `consonance/launch.vbs` is on no MANIFEST line** (`gen-consumer.js:338` ships only `launch.ps1`).
  So the GUIDE also gives a `powershell.exe … -WindowStyle Hidden -File launch.ps1` fallback. Shipping `launch.vbs` would make the first form work in the consumer.
- **B1:** GUIDE §8, "The full loop": Wake the orchestrator, Wake the librarian (the buttons' real labels, `index.html`), then briefed panes, say what you want,
  the librarian looks it up, the orchestrator splits the work, hand-backs ring the librarian, the orchestrator commits. It links the glossary and GATES.
- **B2:** GUIDE §2 says to keep the Startup brief at `<clone>\exo_memory\BOOT.md` and edit that file, because the clone is found from it.
- **B3:** Git is a prerequisite: in GUIDE §1, README "What you need", and README:9. "Three commands" became "clone, build, and install the hooks". README:9 is above `about:begin`.
- **D1–D3, GATES.md:**
  - **D1:** a "Where they apply" paragraph: the push and delete gates are machine-wide (every Claude Code session, any project); the other three act only on Consonance's verbs and seats.
  - **D2:** a closing paragraph says the running copies are under `%USERPROFILE%\.claude\shell\`, so a repo edit needs `install.ps1 -Only <file>` or a bare run. §2's off switch now says the same.
  - **D3:** `CONSONANCE_GATE_MODE` is read from the session's environment and the app never sets it (`grep` finds it only in `dispatch-gate.js`). So: `setx CONSONANCE_GATE_MODE ask`, then restart Consonance.

## Tests (all under the lock)
- **New or extended, written first:**
  - `consonance/hooks/dirs.test.js`: blind.js joins HOOKS, plus 2 row-4 asserts: the override, and the default without it;
  - `dev/shell/hooks/precompact-repo.test.js`, 2 rows: a checkout anywhere named by room_path runs ITS checkpoint, not a Desktop\lighthouse copy; no config,
    a wrong shape, or a repo without `exo_memory\BOOT.md` gives nothing;
  - `dev/stick-dirs.test.js`, 2 rows: the block runs in a real PowerShell against temp homes (no config, a named data_dir with BOM and padding, blank, non-string, not JSON).
- **Red first** on the unchanged a19c876d code: **7 of 9 fail** (`lap5/red.tap`). The 2 that pass are dirs rows 2 and 5, which are unchanged rules.
- **One existing test's fixture moved with the rule.** `dev/shell/hooks/third-place-gate.test.js:52` planted its checkpoint stub at `<home>\Desktop\lighthouse\…`, the very
  hard-coded path this lap removes. It now plants the stub at `<repo>\exo_memory\loop\checkpoint.py`, where its own `room_path` points. No assertion changed. That file is B's (D245).
- **Targeted, 19 files:** front-door-links, gen-consumer, fixture-scope, identity-diff, about-readme, install-only, install-fresh-home, dirs, precompact-repo,
  stick-dirs, third-place-gate, dream-gate, blind, board-digest, reply-slot, sources-gate, chain-status, stick-waiter, tail-carry.
  **Result: 431/431, 0 fail, 0 skipped** (`lap5/all.tap`).
- **Pre-existing red, not mine:** `carrier-drift.test.js`'s "THE BAR, half one" and "MUTATION over the REAL tree" fail on this branch AND on an untouched `git archive a19c876d` copy
  (`lap5/cdbase.tap`; it fails 6 there, the extra ones because the copy has no history). B lists carrier-drift among the shared source reds.
- **Credential scan:** 0 hits for `sk-or-`, `vck_` and `sk-ant-` in all 10 paths.
- **Not done:**
  - **The installed hooks are not updated.** `blind.js` and `precompact.js` change only when the chair runs `install.ps1 -Only blind.js,precompact.js`, and the proof above says
    that changes no path on this machine.
  - **No real stick run.** It would write ~1 GB of live conversations to a drive.
- **My own slip:** a scripted edit of dirs.test.js threw on its first replace (escaping through a JS string again), and wrote nothing; I redid it with the Edit tool.
  Then the heredoc carrying this very section failed to parse; it now goes in through a file.

---

# Lap 6 (pane E, 2026-10-09 ~05:3x): polish after cold read 3 PASSED · DONE

**Commit `93e4bf26`** on lighthouse main `62d3921f`, branch `d273-lap6-E`, my own worktree `C:/Users/nname/Desktop/worktrees/e-lap6-wt`.
6 named paths, not pushed, not landed. Items: `plan_consumer_refresh_2026-10-08.md:290-295`; report `p-consumer-coldread3-LIB_2026-10-09.md` (B4 at :59).

## B4, CONSENT: the second reader is disclosed (it stays ON, per the ruling)
- **GATES.md: a new section, "Also installed, and it spends your usage: the second reader".** It is deliberately not numbered, so the six-gates count
  that `front-door-links` pins stays at 6. It is NOT a gate: it never refuses, delays or changes a ring.
- **What it says the hook does, all read from the source:**
  - `second-reader.js` hands each `call_librarian` or `call_chair` ring to a detached worker;
  - the worker runs `claude -p --model claude-sonnet-5-5` on the user's own sign-in, sending the turn clipped to `TURN_MAX_CHARS = 60000`;
  - it asks the registered QS question (paraphrased from `second-reader-worker.js:36-41`);
  - it writes one row to `<data>/second-reader.jsonl` with a sha256 of the message, never its text;
  - one worker runs at a time, and a ring that arrives while one runs is `skipped-busy`, not queued.
- **What it costs, measured from THIS machine's ledger** (read only; a one-off node read over `C:\Consonance\data\second-reader.jsonl`):
  - 675 rows from 2026-10-01T16:14Z to 2026-10-09T11:10Z: ok 630, skipped-busy 44, skipped-no-text 1;
  - per call, as the CLI's own `total_cost_usd` reports it: **median $0.0189**, p90 $0.0475, sum **$16.39**;
  - input tokens including cache: median 4,403, p90 11,994; median time 6,682 ms;
  - calls per day: 9 to 133.
  - The doc says that on a subscription this is usage counted against limits, not a bill.
- **How to turn it off:** remove the `second-reader.js` entry from `%USERPROFILE%\.claude\settings.json` (PreToolUse, matcher `…call_librarian|…call_chair`),
  and mark it `Excluded` in `install.ps1` `$register` (`:294`) to keep it off.
  - **One true quirk is also stated:** the hook does nothing while `~/.consonance.json` has no `data_dir` (`dataDir()` returns null, `second-reader.js:90-91`).
    The app writes that key on the first Settings save (`SETTINGS_KEYS`, my lap-3 merge).
- **GUIDE §1 "Then, the hooks"** gains one paragraph: one extra Sonnet call per ring, about two cents of usage each (median), 9 to 133 rings a day here, on by default, with a link to GATES.
  - **Self-correction before the commit:** my first draft said "a few to a few dozen rings a day in normal use", which was a guess. It is replaced by the measured 9 to 133.

## A1: the dream finds the app's instances folder
- **`dev/dream/dream_cycle.ps1:52`:** the literal is replaced by a `# D273 instances: begin/end` block: `instances_dir` when set (trimmed), else `%USERPROFILE%\claude-instances`.
  The file keeps its UTF-8 BOM (install_dream refuses a BOM-less copy), and PowerShell's parser reports 0 errors on it.
- **`dev/dream/README.md:22`** and **`install_dream.ps1`** (its header comment at :20 and the printed "Dreams land in" line at :170) now say the same rule.
  install_dream was not in the item, but it is the same hard-coded path that a stranger sees printed.
- **Test first:** `dev/dream/dream-dirs.test.js`, 2 rows (the block runs in a real PowerShell against temp homes: no config, a named `instances_dir` with BOM and padding,
  blank, non-string, not JSON). **Red 2/2 on 62d3921f** (`lap6/red.tap`).
- **THE PROOF, this machine:** `lap6/same.js`, output `lap6/same.txt` sha256 `a0a4432c…`:
  ```
  SAME BYTES  dream_cycle.ps1 instances root
      old "C:\\Consonance\\instances"  (62d3921f's literal)
      new "C:\\Consonance\\instances"  (the new block, real PowerShell, real home)
  exists: true
  ```
  **Nothing to reinstall:** the scheduled task runs `dream_cycle.ps1` from the repo folder (`install_dream.ps1:48`, `$PSScriptRoot`), and it resolves the same folder here.

## B2: the GUIDE names the real buttons
- From `consonance/ui/index.html:78` and `:89`, the labels are **+ Pane** (`#termadd`), the **▾** menu (`#spawnmenu`), and **✦ Brief** inside it (`#sibling`).
- GUIDE §3's two bullets, §8 step 1 and "A whole session" now use them. No "Spawn a pane" or "Spawn briefed" is left (`grep -n -i spawn consonance/GUIDE.md` finds only the §3 heading's verb).

## Tests (under the lock)
- **Targeted, 9 files:** dream-dirs, dream_cycle, front-door-links, gen-consumer, fixture-scope, identity-diff, about-readme, second-reader, dream-gate.
  **Result: 157/157, 0 fail, 0 skipped** (`lap6/all.tap`).
- **Credential scan:** 0 hits for `sk-or-`, `vck_` and `sk-ant-` in all 6 paths.
- **Not done:** no real dream run (it opens a session in the night).

## Lap 6 addendum: portable-paths was RED from my tests (the chair's add, from A's devtruth :116-118) · DONE
- **The commit series is now rebased onto main `93e160b2`** (A's one-line LIBRARIAN fix, which overlaps none of my paths). On `d273-lap6-E`:
  - `39e8c7f3`: the lap-6 polish above, the same content as `93e4bf26` (that hash is superseded by the rebase);
  - **`5e8f5978`: the baseline.**
- **Mine, all of it.** The 3 sites the chair named are my lap-5 test constants. I landed lap 5 without running portable-paths, and that is my miss as well as the chair's.
  `dirs.test.js:57,58` are the lap-5 blind.js rows, not lap 2. Lap 6's new `dream-dirs.test.js` added 5 more, so the check showed **RED, 8 sites** before the update.
- **Each one read, all genuine test fixtures:**
  - `dirs.test.js:57` is an override value `E:\ov`, and `:58` is an assertion message ("never C:\Consonance");
  - `precompact-repo.test.js:31` is a fake payload cwd `C:\somewhere\main`;
  - `dream-dirs.test.js`:
    - `:20`: the `C:\Windows` fallback for powershell.exe when `SystemRoot` is unset;
    - `:32` and `:35`: the "no C:\Consonance" row name and its regex;
    - `:41` and `:42`: the fake `D:\X\inst` fixture.
  None is a path that should resolve.
- **`node consonance/tools/portable-paths.js --update`, with the baseline diff checked row by row** (key sets compared old against new):
  - **ADDED 8**, all BENIGN-TEST: dirs.test.js ×2, dream-dirs.test.js ×5, precompact-repo.test.js ×1;
  - **REMOVED 3**, sites that no longer exist:
    - `blind.js`'s FATAL-DEFAULT `'C:\\Consonance\\data'` (fixed in lap 5, but the baseline was never updated);
    - `dream_cycle.ps1`'s REVIEW `$root = "C:\Consonance\instances"`, fixed above;
    - `install_dream.ps1`'s BENIGN-MESSAGE printed path, fixed above;
  - **kept rows with a changed verdict: 0.**
  - Counts: BENIGN-TEST 332 → 340, FATAL-DEFAULT 14 → 13, REVIEW 16 → 15, BENIGN-MESSAGE 5 → 4.
- **After:** `portable-paths: green — 368 files in scope, 407 known sites, 0 new`.
  **portable-paths.test.js** passed, together with dream-dirs, front-door-links and gen-consumer: **146/146, 0 fail** (`lap6/pp.tap`).
- **Carry:** a lap that adds a test with a drive constant owes a portable-paths run before it rings.

---

# Lap 7 (pane E, 2026-10-09 ~10:0x): README "It is still mostly one voice", reframed · DONE

**Commit `70c3bf56`** on lighthouse main `17a327a8`, branch `d273-lap7-E`, my own worktree `C:/Users/nname/Desktop/worktrees/e-lap7-wt`. `README.md` only,
not pushed, not landed. The ruling is the plan's "Lap 7, item for E" (live checkout `plan_consumer_refresh_2026-10-08.md:335-343`; that section is
not in 17a327a8 itself), with the keeper's words, 09:41.

- **Retitled:** "It is still mostly one voice." became **"Most of the writing comes from one session, by design."**
- **Kept word for word:** the figure and its command: 87.2% → 68.2%, 23,857 → 34,079 rows, `node consonance/tools/board-audit.js`, the two checkpoints on the laptop's board, 2026-09-22.
- **Said:** it measures traffic, not vantage. The main session hands out the work and collects the results, so it writes the most rows.
- **Pointed to the evidence that the vantages differ:** the bullet above (non-overlapping findings that overturn each other), and this round's record, each one linked:
  - A's corrections-gate catch: `p-consumer-workshop-A_2026-10-08.md` (its `corrections-gate` row, `:102`: the generator turned the guard's regex into one that
    matches nothing);
  - E's tube cause: `p-tubefromcup-E_2026-10-08.md` (`:12`: "none of (a), (b) or (c)");
  - the three cold reads: `p-consumer-coldread-LIB_2026-10-08.md`, `-coldread2-…_2026-10-09.md`, `-coldread3-…_2026-10-09.md`.
- **Kept, the honest limit:** QS2S (D217) "was found not usable" (`exo_memory/librarian/2026-10-03.desktop.md`, line 3: "QS2S is NOT USABLE"), so there is no rate.
- **Dropped:** "Two thirds of the writing from one session is not yet a committee."
- **NOT included, and why: "C's refusal of the museum wording".** I searched for it and found no file in lighthouse that records it, so I left it out
  rather than put an uncited claim on a public page. The search: `grep -i museum` over every 2026-10-08/09 hand-back, `map/C.md`, the 10-08/09 librarian notes and
  the loop files. The only hit is the ruling's own mention (plan :340). **Librarian: if it lives somewhere I did not look, give me the pointer and it is one more clause.**
- **Wording I chose with care.** "Three cold reads by fresh readers each reported problems the authors had missed" is true of all three: cold read 3 PASSED
  and still listed findings, e.g. B4. I did NOT write "disjoint findings", because cold read 2's A10 repeats cold read 1's A8 (the GATES evidence links).
- **Tests (under the lock):** front-door-links (every relative link in README resolves, the six new ones included), about-readme and gen-consumer:
  **107/107, 0 fail** (`lap7/t.tap`). portable-paths is green (0 new). The bullet is outside the `about:begin`/`about:end` block.
- **For B's regenerate:** the six new links are record links (`exo_memory/handback/…`, `exo_memory/librarian/…`). In the consumer, the generator's record-link
  rewrite decides what they become, which is B's call; cold read 2's A3 was that kind of placeholder.
- **Lap 7 amend (~10:1x): C's example IS in, `664b8b59` on `70c3bf56`** (same branch, README.md only). The librarian's pointer is `p-consumer-fork-C_2026-10-08.md:36`, F4.
  It fits the sentence, so I added it as one clause among the examples: "a worker kept the author's own wording out of a file every new session wakes into,
  because it would have told the reader who they are, and stated a checkable fact instead". The link and "F4" are cited like the others.
  - **Tests:** front-door-links + about-readme 5/5 under the lock (`lap7/t2.tap`); portable-paths green.
  - **My slip:** after rewrapping the line, I re-ran front-door-links (4/4) directly, NOT under the lock. That breaks the lock rule. It is a 4-row read-only
    test that took under a second, but the rule has no size exemption.
  - **Correction to the section above:** its "NOT included" bullet is superseded by this amend.
