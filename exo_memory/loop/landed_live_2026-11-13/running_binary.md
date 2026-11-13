# Is the running app the committed one, at every start (Opus reader, D, 2026-11-13)

1. The running exe is current by cargo's own rule: 0 of the 116 inputs in its dep-info file are newer than it. This morning's
   whats-live RED (53bac6a0) is a false alarm from a Markdown file, MAP.md, that is not an input of the exe.
2. Since the build head 1f898234 (~~930 commits~~ [2nd reader: 929 at 2c396481, 932 at baa0aef9, by
   `git rev-list --count 1f898234..<sha>`; the 4 app-path commits are unchanged]): 0 need a rebuild of the exe, 2 add research files the bundle lacks, and 2 are
   not inputs at all (MAP.md, gen-brief.ps1). The rule "anything under src-tauri/src" is wrong both ways; cargo's dep-info is right.
3. launch.ps1 uses a hand list that disagrees with cargo today: MAP.md is newer than the exe, so the next shortcut click with
   the app closed is predicted to run a no-op build and refuse to launch ("THE EXE DID NOT CHANGE"), again on every click.
4. No seat is told the exe's age at any start: whats-live and open-items run only by hand, and four of five start paths skip
   launch.ps1. The MCP server is in the same process (port 55133 held by pid 24164), so it is the same binary.
5. Smallest change: the app puts its exe path in each seat's environment (2 Rust lines, riding W1's rebuild). W3's body line
   then reads cargo's dep-info and prints `app current` or `app STALE: <files>`. One shared rule, also used by whats-live and launch.ps1.

Reader: one Opus reader of the landed-is-live swarm, on D. I wrote only this file. HEAD 2c396481 when I began, baa0aef9
when I ended; `git diff --stat 2c396481 HEAD -- consonance dev` is empty, so the code lines below hold [read].
Marks: [read] I opened it or ran it; [summary] from another swarm file; [inferred] mine; [ours] a proposal.

## 0. What I ran

- `node consonance/tools/whats-live.js` once, after reading it whole (it reads processes, git and files; it writes nothing)
  [read: consonance/tools/whats-live.js:1-163].
- `node consonance/tools/open-items.js` once. **A rule slip, named:** I read its seed-carrier item (:60-275) but not the
  whole file first. It also runs `consonance/tools/actors.test.js` (:481). Afterwards I checked that the test writes only
  under `scratch.js` temp dirs (`actors.test.js:41`, `:128`, `:177`, `:207`). It finished in seconds [read].
- Read-only probes: `git log`, `git diff --name-only`, `git rev-parse HEAD@{<time>}`, `cmp`, `stat`, `netstat -ano`,
  `Get-Process`, and `claude --version`. I also ran a small node script in my temp folder that stats the dep-info inputs.
  I did not run install.ps1, a build, or a hook.

## 1. What whats-live prints today

Today's run [read], exit 1:

    app exe      release   C:\Users\nname\Desktop\lighthouse\consonance\src-tauri\target\release\consonance.exe
    app built    2026-11-09 05:56:09   (UTC; 23:56:09 local on 11-08)
    app started  2026-11-13 14:42:24
    newest rust  2026-11-13 11:42:14   53bac6a0 pane B: MAP.md names the landing train's files (L194), beside the app
    RED: the running release binary predates 53bac6a0 ... that commit is NOT live

- Its rule: the newest commit touching `consonance/src-tauri/src`, by author time, against the exe's mtime
  (`whats-live.js:64-68`, `:95-99`) [read].
- 53bac6a0 changes one file, `consonance/src-tauri/src/MAP.md`, +7 lines [read: `git show --stat`].
- MAP.md is not an input of the exe. The exe's dep-info file, `target/release/consonance.d`, lists 116 inputs and no
  MAP.md. **None of the 116 is newer than the exe** [read: my stat pass, 0 newer, 0 missing].
- So the RED is false. The exe is current by the rule cargo itself uses ("Cargo only uses the filesystem last-modified
  mtime", downloaded with curl: doc.rust-lang.org/cargo/reference/build-scripts.html, section `rerun-if-changed`) [read].
  [2nd reader: DOWNGRADED. The same paragraph goes on: "It compares against an internal cached timestamp of when the
  build script last ran" (build-scripts.html, `rerun-if-changed`, downloaded with curl) [read]. Cargo compares against
  its own fingerprint timestamps, not the exe's mtime. "Inputs older than the exe" is a close proxy, not cargo's rule; it
  can read current where cargo would rebuild (a file saved during a build, after the fingerprint stamp and before the
  link) [inferred]. The 0-of-116 count itself re-derives: my own parse of `consonance.d`, 116 entries, 0 newer, 0 missing.]
- The rule has false greens too. It never looks at `consonance/ui`, `brief/`, `Cargo.toml`, `Cargo.lock`,
  `tauri.conf.json`, `icons/` or `build.rs` [read: :65]. ~~Every one of those is an input in the dep-info [read].~~
  [2nd reader: WRONG for two of them. `Cargo.toml` and `Cargo.lock` are not in `target/release/consonance.d` (my parse:
  116 entries, neither present), as this file's own §2 says; ui files, brief files, tauri.conf.json, build.rs and 5
  icons are.] A
  brief-only or UI-only commit leaves it green [inferred].
- It compares time, not ancestry. A commit authored before the build that arrives later (a pull from L) is missed
  [inferred]. Since 1f898234, 1 of ~~930~~ [2nd reader: 929 to 932, as at §0's point 2] commits has such an older time (4697673c, not an app path) [read].

## 2. Which paths make the running exe stale

**The authority is cargo's dep-info, not a hand list** [ours, from what follows]. `target/release/consonance.d` (12,858 B,
written 08:48:03 today) lists [read]:
- the 17 compiled `.rs` modules: capture, capture_audio, cochlea, cochlea_service, gate, harvest_guard, lap_holders,
  listen, main, mcp, nowplaying, pane_exit, priority, seat_alias, sync_launch, tether, trailer;
- `build.rs` and `tauri.conf.json`;
- 24 files under `consonance/ui` (frontendDist, `tauri.conf.json:7`), and ui test files with them;
- the bundle resources (`tauri.conf.json:31-47`): 8 under `brief/`, `../README.md`, `../GUIDE.md`, SOURCE.md, 13 cards,
  2 spread, 12 research, 4 record; and 5 icons.
  [2nd reader: DOWNGRADED, incomplete. These sum to 90 of the 116. The other 26: the `capabilities` directory, one
  hashed file, and 24 hashed `.js`/`.css`/`.html` files tauri's codegen writes under `target/release/build/.../out`
  (my parse of `consonance.d`) [read]. A rule that stats every dep-info path covers them; a hand list would not.]

Not inputs of `consonance.exe` [read]:
- `src/MAP.md`;
- `src/bin/*.rs`, which are other binaries;
- `d476p4_*_tests.rs` and `test_scratch.rs`, which are `#[cfg(test)]` only (`main.rs:36-37`, `:25227-25229`);
- `gen-brief.ps1`, `tests/` and `fixtures/`;
- `brief/frag-*.md`. Its one `include_str!` is inside a `#[test]` (`main.rs:24488`). Every `include_str!` in `src/` is
  in a test (15 sites: grep) [read].

`Cargo.toml` and `Cargo.lock` are not in the dep-info, but cargo fingerprints them [inferred]. So add them to the rule.

**One hole cargo itself has:** tauri-build emits `rerun-if-changed` per resource file
(`~/.cargo/registry/.../tauri-build-2.6.3/src/lib.rs:88-93`, `:570-572`) [read]. A NEW file matching a glob such as
`research/*.md` is in no list, so ~~no build reruns the copy~~ [inferred]. [2nd reader: DOWNGRADED. No build reruns
BECAUSE of it; the next build whose script reruns for any other watched file (a brief, tauri.conf.json, an icon)
rescans the glob and copies it. On disk: `target/release/research/` was last changed 2026-11-03 20:56:07, and all 4
research files L0565 recorded missing on 11-03 are in today's bundle and dep-info [read: `ls`, my parse]. So the gap
closes at the next brief-touching build, which the room makes often; it is a lag, not a permanent hole.] Today the dep-info names 12 research files; the repo
has 14 [read]. Two shipped files are therefore missing from the bundle:
- `heavy_footsteps_low_bass_read_2026-11-13.md`;
- `stomp_recordings_and_sonniss_licence_read_2026-11-13.md`.

`open-items.js` says the same today: "42 of 44 compared, no drift among them — but 2 could not be compared" [read].

**Counts since the running build.** The build head is 1f898234. `HEAD@{2026-11-08 23:56:09}`: no HEAD reflog entry falls
between 11-07 13:58:50 and 11-09 11:57:17 [read]. Non-merge commits on app paths, 1f898234..HEAD [read]:

| class | commits | files |
|---|---|---|
| exe input (needs a rebuild) | 0 | none |
| bundle, new under a glob (needs the copy to rerun) | 2 | the two research files above (5498aea4, 48567b23) |
| not an input | 2 | `src/MAP.md` (53bac6a0), `gen-brief.ps1` (0e661cf1) |

**The recorded true-stale case, for contrast** (`handback/p-d629-wake-unused-C_2026-11-03.md:54-80`).
- The pane found the running exe built 2026-10-30 11:18 local; the build head was `HEAD@{2026-10-30 11:18}` = 1465733b
  [read].
- Over 1465733b..fdec4a77 (the last brief commit the hand-back names):
  - exe inputs: 3 changes in 3 commits (main.rs at 83b7d1af and fdec4a77, mcp.rs at f59760b3);
  - bundle: 11 file changes in 9 commits (BUILDING.md ×5, COMMITTEE.md ×2, two research files);
  - not an input: MAP.md ×3 [read].
- whats-live's rule would be RED there for the right reason, but would name no brief. open-items named BUILDING and
  COMMITTEE [read: hand-back ~~:57-59~~ [2nd reader: :56-58; it names README.md as drifted too,
`handback/p-d629-wake-unused-C_2026-11-03.md:57`]].

## 3. The start paths, and what each checks

| path | pull | rebuild check | fuse | line |
|---|---|---|---|---|
| desktop shortcut → `consonance/launch.ps1` | yes, 20 s ceiling | mtime of a hand list | yes | `:562`, `:566-599` |
| `consonance/restore-main.ps1` | no | always `cargo build`; stops on failure, never checks the exe changed | no | `:140`, `:153` |
| `dev/ARRIVING.ps1` | `git pull --ff-only`, no ceiling | none: starts the exe as found | no | `:52`, `:143-146` |
| `dev/TAKE-STICK.ps1` | no | none | no | `:68-70` |
| app relaunch via `dev/stick-apply.js` | no | none: `current_exe()` again | no | `main.rs:15390-15398` |
| `dev/rebuild-on-close.ps1` (a builder, not a starter) | no | builds; warns if the exe did not change | no | `:74`, `:84-89` |

[read: each line]. Only the shortcut path checks anything, and it cannot see a start by the other four.
`launch.ps1:78-81` names the same four and their pointers have drifted (W5 F3 fixes those) [read]. The one place every
start passes through is the app's own setup (`launch.ps1:80`) and its spawn of each seat (`main.rs:1222-1223`) [read].

**launch.ps1's list against cargo's, today** [read]:
- Its list: `src-tauri/src`, `ui`, `src-tauri/brief`, Cargo.toml, Cargo.lock and tauri.conf.json (`:566-584`), newest
  mtime of any file (`:586-590`).
- It sees 1 file newer than the exe: `src/MAP.md`, 08:43:40 (written by the seat's pull).
- Cargo's 116 inputs: 0 newer. Cargo.toml, Cargo.lock and build.rs: not newer.
- **Predicted** [inferred, from `:594`, `:606-621`, `:631-647` and cargo's mtime rule]:
  - Next click, app open: the dialog "Your code changed ... running the OLD build". That is false.
  - Next click, app closed: `cargo build --release` has nothing to do, the exe keeps its mtime, `$fresh` is false
    (`:639`), and launch refuses with "BUILD SUCCEEDED BUT THE EXE DID NOT CHANGE" and exit 1 (`:645-646`). It does this
    on every click, until an input changes or a file is touched.
  - The same happens after a change to a test-only `.rs` file, a `src/bin` file or a new UI file [inferred].
  - Registered here: this reading is wrong if that click opens the app with no red dialog and no relink. It can also be
    wrong if cargo relinks for a reason outside the dep-info (a changed toolchain or environment) [inferred].
  - I found no recorded case of this refusal in prose (`grep` over `exo_memory`: one hit, inside an evidence tar) [read].

## 4. What a seat runs that is built or copied at some moment

| artifact | made when | how its age is known | state on D now | who is told, where |
|---|---|---|---|---|
| `consonance.exe` (release) | `cargo build` on one of the paths in §3 | exe mtime; whats-live asks the process (`:53-60`) | current: 0 of 116 inputs newer [read] | nobody at a start; whats-live by hand (wrong today); a launch.ps1 dialog on the shortcut path only |
| MCP server | the same process: `mcp.rs:2020` binds a port inside the app | = the exe | port 55133 LISTENING by pid 24164, the release exe started 08:42:24 [read: netstat, Get-Process] | as the exe |
| seat MCP configs `C:/Consonance/data/mcp.consonance*.json` (28) | written at app setup | mtime 08:42:28 [read] | a URL and a port only | nobody; a port mismatch shows as a tool error |
| bundle beside the exe (8 brief files, README, GUIDE, SOURCE, cards, spread, research, record) | tauri-build at a build-script run, one file at a time | `open-items.js` seed-carrier, by hand | 42 equal, 2 research files missing [read] | nobody at a start |
| briefs a seat reads | `room_brief_at`: `~/.consonance/<name>`, else the bundle, else the repo (`main.rs:4067-4094`) | as the bundle | only BOOT.md sits in `~/.consonance`, equal to the repo; the rest come from the bundle [read] | nobody; L0472, L0565 record it |
| seed copies in `~/.consonance` (BOOT, cards, spread, research, record) | `seed_room/seed_cards/seed_references` at every setup (`main.rs:16431-16433`), diff before overwrite | `.seeded.json` 08:42:28; `seed ...` lines in the log | cards: 8 of 13 differ in line endings only (0 lines with `--strip-trailing-cr`); research: 2 missing [read] | a log line; pane intakes take cards from here first (`cards_dir`, `main.rs:550-570`, used at `:3157`) |
| each seat's `C:/Consonance/instances/<seat>/CLAUDE.md` | at spawn | file mtime | ~~9~~ [2nd reader: 8, by `ls` of `C:/Consonance/instances/*/CLAUDE.md`: 8 between 08:42:28 and 08:42:42 plus
third-place = 9 today in all] written 08:42:28 to :42 from the 0b85fead tree, before the 08:43:40 pull; third-place at 08:47:16, after it [read] | nobody; W1 adds the stamp |
| installed hooks and `settings.json` | `install.ps1` | `install.ps1 -Check` | 10 DRIFT, 3 ABSENT [summary: hooks_drift_D_2026-11-13.md:22] | other readers' scope |
| repo-path tools (chain-status.js by the pulse, state-sync.js, tail-carry.js at close) | none: they run from the working tree | the checkout's HEAD | live as the tree; skew against an older exe (`launch.ps1:284-286`) | W1 and W3 name HEAD |
| Claude Code CLI | `claude update` in launch.ps1 only (`:129-180`) | `%LOCALAPPDATA%/consonance/claude-update.json` | 2.1.322 → 2.1.323 at 14:42:13Z; claude.exe mtime 08:42:19 [read] | a dialog on failure, shortcut path only |
| task shims `%LOCALAPPDATA%/consonance/{dream,janitor,vantage}_launch.vbs` | their install scripts (e.g. `dev/dream/install_dream.ps1`) | mtime: 07-24, 10-10, 08-17 [read] | not compared | nobody (not opened further) |
| `target/debug/consonance.exe` | an old debug build | mtime 2026-10-22 [read] | not running | whats-live names it so nobody measures it (`:121-126`) |

## 5. The smallest change: a stale exe named to every seat at its start

It rides **W3**, the body line, because W3 prints at every start, resume and compaction included. W5 sees only the
shortcut path, and W1 is not re-injected after a compaction (spec W1, "What could go wrong"). It needs a Rust part that
rides **W1's rebuild**. One rule serves three users.

**(a) One pure rule, in `consonance/tools/whats-live.js`** [ours]:
`appStaleness({ exe, depinfoText, stat, repoRoot, bundle })` returns `{ built, inputsNewer: [...], bundleNew: [...],
readable }`.
- `inputsNewer`: every path in the exe's dep-info (`<dir of exe>/consonance.d`, the line after `consonance.exe:`), plus
  `Cargo.toml` and `Cargo.lock`, whose mtime is newer than the exe's. This is cargo's rule, so a doc file can never trip it.
- `bundleNew`: each file matched by a `bundle.resources` glob in `tauri.conf.json` that is absent from the dep-info list.
  Reuse `bundleResources()` from `open-items.js`, which needs a `module.exports` (it has none today [read: grep]).
- `whats-live.js`: replace the `newestSourceCommit` RED (`:64-68`, `:97-99`) with `inputsNewer.length > 0`. Name the
  files, and the newest commit that touches them (`git log -1 -- <files>`). Keep the rebuilt-but-not-restarted rule
  (`:100-102`) and the dreams rows. Print `bundleNew` as its own non-red line.
- No dep-info (a consumer install, a first build): say "inputs not readable" and fall back to today's src rule. Never a
  silent green.

**(b) The app names its exe to every seat (Rust, rides W1's rebuild, pane R's file)** [ours]. In `spawn_claude_pane`,
beside `cmd.env("CONSONANCE_PANE", ...)` (`main.rs:1222-1223`), add:

    cmd.env("CONSONANCE_APP_EXE", <std::env::current_exe(), once per process>);

- This covers all five start paths, because every seat is spawned by the app whatever started the app [inferred].
- Hooks already read this env: "A pane that Consonance did not spawn has neither variable and its hooks no-op"
  (`main.rs:1220-1221`) [read].
- The exe's mtime is read by the hook, not passed in, so a stale env value cannot fake an age.

**(c) The W3 field (pane H, `consonance/hooks/sessionstart-body.js`)** [ours]. After `shelf built at ...`, add:

    · app current (built 11-08 23:56)
    · app current (built 11-08 23:56); 2 new research files not in its bundle
    · app STALE: main.rs, mcp.rs, BUILDING.md +1 newer than the build (10-30 11:18); not live until a rebuild and a restart
    · app not readable (<why>)

- It requires `<room repo>/consonance/tools/whats-live.js` for (a), in a `try`, the way the pulse runs `chain-status.js`
  from the repo path (`room_better_2026-11-13/00_build_paths.md:47-48`, citing `userprompt-submit.js:263`) [summary].
- At most 3 names, then `+N`. About 35 B current, under 120 B stale.
- Ledger fields `app_state` and `app_inputs_newer` in W3's `sessionstart-body.jsonl`.
- No process query: the env names the exe, so a seat start costs one 13 KB read and about 120 stats [inferred].
- When `CONSONANCE_APP_EXE` is missing (any app before W1's rebuild, or a hand-run claude): `app not readable (no
  CONSONANCE_APP_EXE)`. If W5's receipt (below) matches `CONSONANCE_LAUNCH_ID`, the field uses its `exe`.

**(d) Additions to W5 (launch.ps1, pane R)** [ours]:
- W5's `launch-pull.json` gains `build`:
  `{ exe, exe_mtime, decision: up-to-date|built|build-failed|refused-unchanged|running|no-cargo, inputs_newer }`.
  A seat's `STALE` line can then say why: the app was running, or the build failed.
- The rebuild test at `:566-594` uses (a)'s rule when the dep-info exists (node is already required by the room). It
  keeps today's list as the fallback, and keeps `:639`'s refusal for the target-dir case it was written for.
- This ends the predicted MAP.md refusal (§3). Tier: prove it, since it gates every launch (`~/.claude/CLAUDE.md:10`).

**(e) Making a new bundle file live, not only named (optional; build.rs, rides W1's rebuild)** [ours]. In `build.rs`,
emit `cargo:rerun-if-changed=<dir>` for each directory a `bundle.resources` glob reads. Cargo "will scan the entire
directory for any modifications" (cargo docs, as in §1) [read]. A new research file then reruns tauri-build's copy.
- Cost: each new research, card or record note makes the next launch recompile, about 1 to 2 minutes [inferred from
  "30s-2min", `launch.ps1:627`].
- My lean: do it. The room's own count recorded 4 research files missing on 11-03 (L0565) and 2 today, so the gap recurs.
- What would change my mind: if those folders take several commits a day and he finds the recompiles at launch costly.
  Then keep (c)'s line only.

## 6. Checks that fail today on the recorded case and pass after

1. **Live, this morning's case, red now** [read]. Run `node consonance/tools/whats-live.js; echo $?`. Today: exit 1,
   "predates 53bac6a0 ... NOT live". After (a): exit 0. The two research files are named on their own line, as not in
   the build. (It stays red if any of the 116 inputs changes before the fix lands; then re-derive with the stat pass.)
2. **Unit, `whats-live.test.js`, both recorded cases as fixtures** [ours]. Temp dir, real files with set mtimes, a dep-info
   text in the real format:
   - (A) 11-13: exe at 2026-11-09T05:56:09Z; the 17 `.rs`, ui and brief inputs older; `src/MAP.md` at 2026-11-13T14:43:40Z;
     research glob with 2 files not in the dep-info. Expect `inputsNewer = []` and `bundleNew` = the two names.
     Today's `staleness()` given the same facts (srcTs 53bac6a0's 11:42:14Z) returns one RED: red [read: `:97-99`].
   - (B) 11-03: exe at 2026-10-30T17:18Z; `main.rs`, `mcp.rs`, `brief/BUILDING.md`, `brief/COMMITTEE.md` at their
     commits' times (83b7d1af 10-31 09:20, f59760b3 09:43, 0ca3eccd 10-30 16:52, local). Expect all four in `inputsNewer`.
     This blocks the shortcut "never RED" and the shortcut "src only" (which would miss both briefs).
   - Edges: no dep-info gives `readable: false` and the fallback, never a green; Cargo.lock newer gives RED.
3. **launch.ps1, the predicted refusal, red now** [ours]. Lift the rebuild test into a function, as `launch.park.test.js`
   lifts functions (`:20-24`, per launch_and_pull.md:256-257) [summary]. Fixture: exe, a dep-info with every input older,
   and `src/MAP.md` newer. Today's rule says rebuild (red). After: up to date. A second fixture with `main.rs` newer must
   still say rebuild.
   [2nd reader: not runnable today. The rebuild test is top-level script code (`consonance/launch.ps1:566-594`), not a
   function, so "red today" needs the lift first, and the lift is part of the change [read]. The probe that IS red today
   for the reason: `find src-tauri/src ui src-tauri/brief src-tauri/Cargo.toml src-tauri/Cargo.lock
   src-tauri/tauri.conf.json -type f -newer src-tauri/target/release/consonance.exe` (in `consonance/`) prints exactly
   `src-tauri/src/MAP.md`, while 0 of the 116 dep-info inputs are newer [read: my run]. The refusal itself stays a
   prediction: no recorded click.]
4. **W3 fixture** (in W3's `sessionstart-body.test.js`) [ours]: env `CONSONANCE_APP_EXE` at fixture (A) prints `app
   current`, at (B) `app STALE: main.rs, mcp.rs, BUILDING.md +1`, unset prints `app not readable`. Each is under 120 B.
5. **After landing, on D** [ours]: every `sessionstart-body.jsonl` row after the restart has `app_state`. A real Rust
   landing without a restart shows `STALE` in the next seat start; that is the field's own falsifier.
   [2nd reader: satisfiable without the fix. `app not readable` is an `app_state` value, so if (b) never lands or the
   env never reaches the hook, every row still "has app_state" and the check passes. On D after W1's restart require
   `app_state` in {current, STALE} on every row from a Consonance-spawned seat, and count `not readable` rows as red.]

## 7. What it needs

- **Rebuild of `consonance/src-tauri`:** (b) and (e). Both ride W1's rebuild and its one restart; nothing extra.
- **Hook install:** none beyond W3's own `install.ps1 -Only sessionstart-body.js` on D and on L (spec W3). The field reads
  `whats-live.js` from the repo, so later rule changes need no reinstall [inferred].
- **No install for** (a) and (d): node tools and launch.ps1 run from the tree (L gets them at its next pull).
- **Seats restarted:** the env reaches a seat only when the app spawns it, so after W1's restart. Until then, every line
  says `app not readable`. That is honest, not green.
- **Panes:** (b), (d) and (e) go to pane R (main.rs, build.rs, launch.ps1); (a) and (c) to pane H (whats-live.js,
  open-items.js export, the W3 hook). That keeps spec §3's rule of no shared file.
- **His word:** to widen Lap W by these parts; (e)'s recompile cost. No seat is compacted; nothing is retired.
- **Tiers:** (a) and (c) check it; (d) prove it (it gates every launch); (b) check it (an added env var).

## What I did not open

- Machine L: its exe, dep-info, bundle and start path. Everything here is D.
- `dev/stick-apply.js` beyond its header and relaunch lines; `dev/tail-carry.js`; whether an import pulls the repo.
- `apply_seed` and `.seeded.json` contents: whether the 8 cards differing only in line endings count as "yours"
  (then a later repo edit would not reach panes) is not established.
- tauri-codegen: whether a NEW file under `ui/` is embedded without a dep-info change. I inferred it is missed.
- Whether `cargo check --release` wrote `consonance.d` at 08:48:03; I used only its input list, not its time.
- The ledger rows beyond the 19 named; `room_better_2026-11-13/in_wake.md`; W3's `body_line.md` beyond the spec's W3 text.
- No test, build, hook or install was run. The refusal in §3 is a prediction from code, not an observation.

## Second reader

Adversarial second reader, Opus, on D. HEAD dce23a2b when I ended; `git diff --stat baa0aef9 HEAD -- consonance dev`
is empty, so the first reader's code lines still hold. I wrote only this file. Line numbers in the table are the first
reader's original lines (my bracketed inserts above moved them).

### What I checked

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3, 43 | 0 of 116 dep-info inputs newer than the exe | `target/release/consonance.d`, my stat pass | OK | 116 entries, 0 newer, 0 missing |
| 3, 44 | current "by cargo's own rule" | cargo build-scripts doc, curl | DOWNGRADED | cargo compares to its cached timestamp, not the exe mtime |
| 5, 50 | 930 commits since 1f898234 | `git rev-list --count` | WRONG | 929 at 2c396481, 932 at baa0aef9 |
| 31-37 | whats-live prints RED on 53bac6a0, exit 1 | my run of `whats-live.js` | OK | same rows, exit=1 |
| 39-40 | rule is src-only, author time, vs exe mtime | `whats-live.js:64-68`, `:95-99` | OK | `--format=%at -- consonance/src-tauri/src` |
| 41 | 53bac6a0 changes MAP.md only, +7 | `git show --stat` | OK | 1 file, 7 insertions |
| 46-47 | Cargo.toml, Cargo.lock are dep-info inputs | `consonance.d` | WRONG | neither present; the file's own :71 agrees |
| 50 | one older-dated commit, 4697673c, not app path | `git log`, `git show --stat` | OK | dated 11-04, hand-back files only |
| 54-55 | dep-info 12,858 B, written 08:48:03 | `ls -la` | OK | 12858, 08:48:03.180 |
| 56-61 | input list by class | `consonance.d` | DOWNGRADED | classes sum to 90; 26 unnamed (codegen out files, capabilities) |
| 66 | test modules are cfg(test) only | `main.rs:36-37`, `:25227-25229` | OK | `#[cfg(test)]` on each |
| 68-69 | 15 include_str!, all in tests | grep; `main.rs:24486-24488`, `mcp.rs:1994-1995` | OK | 15 sites; frag-fork.md absent from dep-info |
| 73-74 | tauri-build emits rerun-if-changed per resource | tauri-build-2.6.3 `lib.rs:93`, `:570-572` | OK | per-file `println!` in `copy_resources` |
| 75 | new glob file: no build reruns the copy | `target/release/research/` mtimes | DOWNGRADED | 11-03's 4 missing files arrived at a later build |
| 75-78 | 12 research in dep-info, 14 in repo | `ls`, my parse | OK | the two 11-13 files missing |
| 80 | 42 of 44 compared, 2 missing | my `cmp` of every resource | OK | n=44, diff=0, missing=2 (open-items not run) |
| 82 | no HEAD reflog entry 11-07 13:58:50 to 11-09 11:57:17 | `git log -g` | OK | adjacent rows 1f898234, 9c3660ae |
| 85-89 | 0 exe, 2 bundle, 2 not-input commits | `git log --no-merges`, `git diff --name-only` | OK | 4 files, same commits |
| 92 | 11-03 case build head 1465733b | `git rev-parse HEAD@{2026-10-30 11:18}` | OK | 1465733b |
| 94-97 | 3 exe changes; 11 bundle in 9 commits; MAP x3 | `git log` 1465733b..fdec4a77 | OK | BUILDING x5, COMMITTEE x2, research x4 |
| 99 | hand-back :57-59 names BUILDING, COMMITTEE | hand-back :54-80 | DOWNGRADED | lines :56-58; README.md named too |
| 105-110 | start paths and their line numbers | the four scripts, `main.rs:15390-15398` | OK | each line holds |
| 113 | launch.ps1:78-81 names the four paths | `launch.ps1:78-81` | OK | "NOT COVERED, named" |
| 114 | env set at spawn, main.rs:1222-1223 | `main.rs:1214-1223` | OK | `CONSONANCE_PANE`, `CONSONANCE_READY_DIR` |
| 117-119 | only MAP.md on the hand list is newer | my `find -newer` | OK | prints `src-tauri/src/MAP.md` only |
| 121-126 | next closed-app click refuses | `launch.ps1:594`, `:631-646` | OK as prediction | code path holds; no click recorded |
| 136 | MCP on port 55133, pid 24164, release exe | `netstat -ano`, `Get-Process` | OK | started 8:42:24 AM |
| 137 | 28 MCP configs at 08:42:28 | `ls` | OK | 28, all 08:42:28 |
| 139 | brief tiers; only BOOT.md in ~/.consonance | `main.rs:4067-4094`, `ls`, `cmp` | OK | equal to `brief/BOOT.md`, not `exo_memory/BOOT.md` |
| 140 | 8 of 13 seeded cards differ in EOL only | `cmp`, `diff --strip-trailing-cr` | OK | differ=8, beyond-eol=0 |
| 141 | 9 instance CLAUDE.md at 08:42:28-:42 | `ls` of instances | WRONG | 8 in that window; third-place 08:47:16 |
| 142 | 10 DRIFT, 3 ABSENT | `hooks_drift_D_2026-11-13.md:22` | OK | as cited |
| 144 | CLI 2.1.322 to 2.1.323, claude.exe 08:42:19 | `claude-update.json`, `ls` | OK | at 14:42:13Z |
| 145 | shim mtimes 07-24, 10-10, 08-17 | `ls` | OK | as stated |
| 146 | debug exe 2026-10-22 | whats-live row | OK | 2026-10-22 14:54:00 UTC |
| 160 | open-items has no module.exports | grep `open-items.js` | OK | `bundleResources` at :132, no export |
| 173-174 | "neither variable ... hooks no-op" | `main.rs:1220-1221` | OK | quoted text there |
| 185 | pulse runs chain-status.js from repo | `00_build_paths.md:47-48`; installed hook :263 | OK | path join at :263 |
| 198 | prove-it tier line | `~/.claude/CLAUDE.md:10` | OK | "installs or overwrites" |
| 204 | "30s-2min" | `launch.ps1:627` | OK | as quoted |
| 205 | 4 research missing on 11-03 | ledger L0565 | OK | row text |
| 211 | check 1 red today, for MAP.md | my whats-live run | OK | names 53bac6a0 |
| 218 | staleness() on (A)'s facts gives one RED | my `node -e` call | OK | one line, "predates 53bac6a0" |
| 219-220 | fixture (B) commit times | `git log` | OK | 09:20, 09:43, 16:52 local |
| 223 | park harness lifts functions at :20-24 | `launch.park.test.js:20-24` | OK | `$want` list |
| 223-226 | check 3 red today | `launch.ps1:566-594` | DOWNGRADED | inline code; runnable only after the lift |
| 229-230 | check 5 proves the field | design | DOWNGRADED | `not readable` satisfies it |

**Tally:** 48 checked. OK 39, WRONG 3, DOWNGRADED 6, UNSUPPORTED 0.

### Testing the design

- **Satisfied without fixing.** (1) Check 5 passes if every row says `app not readable` (corrected in place). (2)
  Fixtures (A) and (B) test only the pure function; if (b)'s env line never reaches a build, the hook still ships green.
  Pin the wiring with a source sweep: a `main.rs` test that `spawn_claude_pane`'s body sets `CONSONANCE_APP_EXE`, as
  `main.rs:24418` already sweeps that body for other lines [read: grep] [ours].
- **Fires wrongly.** (1) Any rewrite of a file with the same bytes. `launch.ps1`'s own park (stash, fast-forward, apply;
  comment near `:367`) and a branch switch in the main checkout give new mtimes, so `STALE` with no content change
  [inferred]. Cargo would rebuild too, so the line is cargo-true, but "not live" is false. (2) It reads the working
  tree, not origin: a Rust fix on origin that D has not pulled reads `app current` [inferred]. W3's own
  `origin/main ... behind` field sits beside it; say both in one clause. (3) Uncommitted edits in the main checkout read
  `STALE`: right for "running = tree", not for "running = committed".
- **Earlier fixes of this kind that lapsed, on record.** whats-live itself runs by hand ("Only a thing that fails
  installs it", `whats-live.js:19`) and was not run at today's start. `launch.ps1`'s hand list was widened once already
  after a silent valve (brief/ added 2026-09-01, comment at `launch.ps1:569-580`). `build.rs:2-17` added per-icon rerun
  lines after a no-op build. open-items found the 11-03 drift and "was not being run"
  (`handback/p-d629-wake-unused-C_2026-11-03.md:66-67`). W3's ancestor, the state block, was emitted 163 times and acted
  on 0 (spec W3, citing `prior:122-132`) [summary]. Moving the check to every start answers the first three. Nothing in
  the design answers the fourth: a seat may read `STALE` and go on.
- **The W3 hook is itself an installed copy.** The field's rule is read from the repo, which is good. The hook that
  prints it is installed under `~/.claude` by `install.ps1 -Only`, and can drift or stay unregistered as today's 10
  DRIFT and 4 declared-not-registered rows show [summary: hooks_drift_D:22]. The field cannot report its own absence.

### Not addressed by the first reader

- **The two stall traces were not used.** Both are about the T-180 rebuilder, a different app, with the same shape: a
  start path turned away from the builder (`stall_trace_rebuilder_shortcut_2026-11-07.md:3-10`), and a pull refused on
  a file the build rewrote, so the click keeps the old build silently
  (`stall_trace_rebuilder_pull_cargo_toml_2026-11-11.md:3-18`) [read]. For Consonance on D: the desktop
  `Consonance.lnk` targets powershell with `-File ...\consonance\launch.ps1` (read by WScript.Shell today; the lnk was
  last written 2026-07-14) [read], so the first form has not happened here. `git status` on
  `consonance/src-tauri/Cargo.toml` and `Cargo.lock` is clean [read], so the second has not either. Neither is watched:
  nothing tells a seat if the lnk is retargeted [inferred].
- **Today's start judged an old tree.** The reflog has no `merge origin/main` row today. Its first row is
  `8fd453c6 ... pull -q --ff-only: Fast-forward` at 08:43:40, 307 commits after 0b85fead, 76 s after the app started at
  08:42:24 [read: `git log -g`, `git rev-list --count`]. So launch.ps1's rebuild check ran on the pre-pull tree. That is
  W5's case. For this file it means a pull that lands Rust after the start is caught by nothing until a seat starts;
  W3's field fires at a seat start, not at a pull. A post-pull line (the pulling seat runs (a) once) would close that
  window [ours].
- **Cargo ran in this target dir today.** The consonance bin's fingerprint (`.fingerprint/consonance-3896947fc9ad8ec9`)
  and the other bins' were written 08:45:24-28 with a 0-byte `libconsonance-*.rmeta`, a check-mode signature. All 11
  uplifted `.d` files were rewritten at 08:48:03 while every bin exe kept its 11-08 time. The release build-script
  output was last written 11-08 23:55:31 [read: `ls`]. Which command did this, I could not establish. If it was a
  `cargo build --release`, it is a recorded no-op build after MAP.md arrived, the precondition of the predicted refusal
  [inferred].

### What I could not check

- Machine L: its exe, dep-info, bundle and launch.
- Which command wrote the 08:45 fingerprints and the 08:48:03 `.d` files. A transcript search for it was stopped
  unfinished. **A rule slip, named:** that search used bounded repeats of 3000 and 4000, over the limit of 200. I
  stopped it and used none of its output.
- I did not run `open-items.js` (it also runs `actors.test.js`); I re-derived its 44/42/2 by `cmp` instead.
- Whether cargo would truly no-op on the next `cargo build --release` (the refusal): no builds allowed.
- Whether a new `ui/` file is embedded without a dep-info change; tauri-codegen not opened.
- `dev/stick-apply.js` beyond the relaunch lines; `apply_seed` and `.seeded.json` contents.
- I ran `node --test consonance/tools/whats-live.test.js` after reading it (it writes only under `scratch.js` temp
  dirs): 9 pass, 0 fail. No test pins the doc-only case today.
