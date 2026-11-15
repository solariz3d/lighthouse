# Page: where the room's running files are written, and whether they can move off C:. Pane P, 2026-11-15, NO CHANGE MADE

For the librarian to rule, and for him to be told. Asked by the chair (D677, 13:58Z). It touches how every seat runs, so this is a page,
not a change.

**The four kinds, as measured** (`exo_memory/handback/p-d677-disk2-P_2026-11-15.md`; G:\consonance-scratch\p-disk2\growth.json, two
readings 0.65 h apart, a quiet hour):

| kind | on C: now | growth that hour |
|---|---|---|
| worktrees in use or recent | 103, 18.66 GB | +1 MB/h (the night's ~15 GB fall was new worktrees and their builds) |
| the live sessions' scratch | 24.33 GB | +18 MB/h |
| the seats' transcripts | 10.36 GB | +21 MB/h |
| the app's capture logs | 4.22 GB | +6 MB/h |

The drives: C: had 76.73 GB free at 07:58 local; G: 281 GB and Z: 923 GB at 06:57.

## 1. WORKTREES (18.66 GB; the kind that fills C: fastest when laps build)

**Where it is chosen today: by each seat, by hand.**
- The packets and `COMMITTEE.md` ("Work in your own worktree, the one your packet names, or one you add with `git worktree add` outside
  the shared checkout") leave the path to the pane. The habit is `C:\Users\nname\Desktop\worktrees\<name>`.
- `~/.consonance.json` names the habit: `worktrees_dir` = `C:\Users\nname\Desktop\worktrees`. It is read by the janitor for build output
  (`consonance/tools/janitor.js:26`, `:243`).
- The janitor's owned folders, `worktrees_dirs`, ALREADY include `G:\worktrees` and `G:\consonance-worktrees` (checked: the config, read
  07:58).
- Two tools make their own worktrees where they are told: `consonance/tools/landing-train.js:15` and `second-vantage.js:89`.
- **Build output** (cargo `target`, the game's `build`) is written inside each worktree. `CARGO_TARGET_DIR` can move cargo's.

**Can it go to G:? Yes, and nothing in the code holds it on C:.**
- Panes have already worked from G: (`G:\consonance-scratch\p-d675-timer`, B's and O's landing trees on G:), and those builds, self-tests
  and suites ran there.
- Z: is the archive drive (HDD), not for working trees: builds there would be slow.

**What it would need:**
- one line in `COMMITTEE.md`'s "Your work" section: new worktrees go under `G:\consonance-worktrees\`;
- `worktrees_dir` in `~/.consonance.json` set to that folder;
- nothing restarted.
- **Existing live worktrees** are moved by their owner when idle, with `git worktree move <old> <new>`, which updates the owner repo's
  record. Never by copying the folder.

**What could break:**
- **Hand-backs and briefs cite worktree paths** (`Desktop\worktrees\…`). Old citations stay valid only while those folders exist. That
  is a reader's inconvenience, not a run's.
- A packet that names a C: path by habit will put new work back on C:. The rule has to be in the packet template, not only in the docs.
- **Junctions:** a worktree on G: must not hold a junction to live data. The 09-28 lesson stands either way.
- The disk guard (`heavy-run.js` `writePaths`) reads the run's working directory, so runs from G: stop being refused when C: is low. That
  is a gain; it is said because it changes which drive the guard protects.

## 2. THE LIVE SESSIONS' SCRATCH (24.33 GB)

**Where it is chosen today: by Claude Code, not by the room.**
- Each session's scratchpad and task output go under `os.tmpdir()\claude\<project>\<session>\` (the `Temp\claude` folders measured).
- The app sets no temp variable for a seat. checked: `consonance/src-tauri/src/main.rs:1059-1281`, the seat launch, sets
  `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION`, `TERM`, `FORCE_COLOR`, `CLAUDE_CODE_FORCE_SESSION_PERSIST`, `CONSONANCE_PANE` and
  `CONSONANCE_READY_DIR`, nothing else of the kind.
- The room's own tool scratch is already on G:: `consonance/tools/scratch.js`, root `G:\consonance-scratch`.

**Can it go to G:? Yes, by Claude Code's own documented variable.**
- `CLAUDE_CODE_TMPDIR`: "Override the temp directory used for internal temp files. Claude Code appends … `/claude/` on Windows. Default:
  … `os.tmpdir()` on … Windows … Claude Code's own temp files always use your override. Set it in your shell, user settings, or managed
  settings." (code.claude.com/docs/en/env-vars, read 2026-11-15.)

**What it would need:** either
- `"env": { "CLAUDE_CODE_TMPDIR": "G:\\consonance-tmp" }` in `~/.claude/settings.json` (user scope); or
- one `cmd.env("CLAUDE_CODE_TMPDIR", …)` beside the others at `main.rs` ~1280, the seats only, and an app rebuild.
- Either way it takes effect at each session's start, so each seat once restarted (resumed).
- **inferred, not tested:** a resumed session keeps its transcript and simply gets new scratch on G:.
- **One test before the room:** one fresh session with the variable, and its scratchpad path read back. One command, before anything else.

**What could break:**
- **The user-settings route reaches every Claude Code session on this machine, his own included.** The app route reaches only the seats.
  That is the reason to prefer the app route.
- Hand-backs cite scratch paths (`S/…` under `Temp\claude\…`). The old paths stay valid until those folders are removed. A seat
  mid-lap that restarts loses easy reach of its own earlier scratch; the files are still there.
- **The 24.33 GB already on C: does not move by itself.** It belongs to live sessions and is copied, checked and removed only after each
  session has restarted onto G:.

## 3. THE SEATS' TRANSCRIPTS (10.36 GB; seats resume from them)

**Where it is chosen today: by Claude Code.**
- `~/.claude/projects/<encoded cwd>/<session>.jsonl`, under the config directory.
- The app reads it there from the home folder (`main.rs:2740`, `:6703`) and writes per-project trust into `~/.claude.json` (`:4181`).
- **24 of the room's tools and hooks read `~/.claude/projects` from the home folder:** board-digest, dispatch-gate, chain-status, janitor,
  sourced, usage, read-before-edit, memory-sweep, head-watch, label-watch, pane-status, claim-replay and others.
  - checked: Grep of `consonance/{hooks,tools}/*.js` for the path, 29 files with tests.
  - **Only `chain-status.js` takes a seam** (`CONSONANCE_PROJECTS_DIR`); none reads `CLAUDE_CONFIG_DIR`.

**Can it go to G:? Only by moving the whole config directory, or by a junction. Both are risky.**
- `CLAUDE_CONFIG_DIR` "Override the configuration directory (default: `~/.claude`). All settings, session history, and plugins are stored
  under this path" (the same docs).
  - It moves settings, hooks registration, plugins and every transcript together.
  - **Every one of the 24 readers, and the app, would then read a stale `C:` copy or nothing:** the pulse, the board digest, the gates
    that read transcripts, the janitor's live-pane check.
- **A directory junction** `~\.claude\projects` → `G:\…` would be transparent to every reader and to Claude Code.

**What it would need:**
- **All seats stopped and the app closed,** because the files are open while a seat runs.
- The folder copied whole, checked, then either the junction made (and the C: copy removed after a checked restart), or every reader
  changed to follow `CLAUDE_CONFIG_DIR` first.
- **A seat that resumes before its transcript is reachable wakes empty.** That is the failure the room most has to avoid.

**What could break:**
- the junction lesson of 09-28, a worktree removal that emptied a junction's TARGET: any tool that deletes recursively and follows the
  link could empty the transcripts. rmdir /s and git's worktree removal do not follow a junction; a careless script could.
- the pulse and the gates, if the move is by `CLAUDE_CONFIG_DIR` and the readers are not changed first;
- his own Claude Code sessions, which share `~/.claude`.
- **Recommendation: last, if at all.** At +21 MB/h this is the smallest grower per gain, and the riskiest to move.

## 4. THE APP'S CAPTURE LOGS (4.22 GB)

**Where it is chosen today: by the app.**
- `capture_dir()` = `data_dir()\captures`, `consonance/src-tauri/src/main.rs:840-843`. Raw PTY bytes per pane, appended (`:833-839`).
- `data_dir()` (`:826-830`) is `data_dir` in `~/.consonance.json`, `C:\Consonance\data` today.

**Can it go to G:? Yes, two ways.**
- **(a) The whole data folder,** by changing `data_dir`. It carries the board, the lap ledger, the locks, the MCP mount files, the ledgers
  of every gate. Most tools and hooks resolve it through `CONSONANCE_DATA` or the config, but a few default to the literal
  `C:\Consonance\data` when `CONSONANCE_DATA` is unset (`consonance/tools/curate.js:68`, `head-watch.js:35`, `agreement-spread.js:252`,
  `balance-check.js:196`).
- **(b) The captures alone,** by a new setting read by `capture_dir()`. A small code change in `main.rs` and an app rebuild.

**What it would need:** the app closed (it holds the logs open), the folder copied, checked and moved, the setting changed, the app
started. (b) also needs the rebuild.

**What could break:**
- (a): the four literal defaults read the old place. A board or ledger split across two drives during the move would lose rows, so the
  app must be closed for it.
- (b): the scroll-up band and the warm-resume brief read the captures (`main.rs:833-860`). They follow `capture_dir()`, so they move with
  it.

## My reading, for the ruling

**Order by gain over risk:**
1. **Worktrees to G: by rule and config.** No restart; the largest and fastest grower when laps build; G: already proven by several
   seats.
2. **Scratch to G: by `CLAUDE_CODE_TMPDIR`,** set by the app for the seats only. One app rebuild, each seat resumed once, after one test
   session.
3. **Captures to G:** by (b), at the next app rebuild.
4. **Transcripts: leave on C: unless C: fills again.** If they must move, a junction made with the app closed, after the folder is
   copied and checked, and named in GATES.md so no tool deletes through it.

**What this page did not do:**
- It changed nothing.
- It did not test `CLAUDE_CODE_TMPDIR` on this machine.
- It did not check the remaining readers one by one beyond the Grep counts above.

SOURCES: consonance/src-tauri/src/main.rs:826-843, :1059-1281, :2740, :4181, :6703; consonance/tools/janitor.js:26-36, :243; landing-train.js:15; second-vantage.js:89; curate.js:68; head-watch.js:35; agreement-spread.js:252; balance-check.js:196; Grep of consonance/{hooks,tools}/*.js for the projects path (29 files) and for CLAUDE_CONFIG_DIR|CONSONANCE_PROJECTS_DIR (2 non-test files); ~/.consonance.json (data_dir, worktrees_dir, worktrees_dirs); ~/.claude/settings.json (env: DISABLE_AUTOUPDATER only); code.claude.com/docs/en/settings and /env-vars (CLAUDE_CODE_TMPDIR, CLAUDE_CONFIG_DIR rows); G:\consonance-scratch\p-disk2\growth.json
NEXT: librarian rule the order and tell him when this is read; nothing is changed until it is ruled
