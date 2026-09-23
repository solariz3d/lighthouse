# Standalone Jev: the design, for the keeper's read. Librarian, on L, 2026-09-23 ~07:3x.

*Built from the research batch (R1 `loop/jev_r1_consistency_2026-09-23.md`, R4 `loop/jev_r4_cost_input_2026-09-23.md`,
R2+R3 `loop/jev_r2r3_score_2026-09-23.md`), from A's what's-left list (`loop/jev_standalone_repo_idea_2026-09-23.md`, 13 items),
and from the keeper's four decisions of 06:2x. Nothing is built yet. **This is what gets built if the keeper says go.***

## WHAT THE RESEARCH SAYS JEV IS — and therefore what the product may claim

- **Deterministic:** the same verdict on the same input, 0 flips in 20 real items × 3 and κ 0.938 stored vs fresh.
- **Cheap:** about 2.2k tokens in, 42 out, per judged turn; on a separate bill from Claude's weekly limit.
- **Its "clean" is reliable** (19 of 20 confirmed by blind readers). **Its "drift" is a hint, not a verdict:** 8 of 30
  confirmed, and its own confidence cannot tell the good ones apart. The over-flag is general (work and personal alike), and
  the model does it, not the prompt.
- **So the product must say:** *"Jev marks turns worth a second look. Measured on its first 56 units, about 1 in 4 marked
  turns was confirmed by a blind reader; the readers were the room's own and lean lenient."* **Never** "Jev caught drift."

## THE SHAPE — one module, two ways to run it

    jev/                         (new public repo, solariz3d/jev — name is the keeper's to change)
      bin/jev-judge              judge one turn (reads the transcript tail), write one ledger row
      bin/jev-flags              UserPromptSubmit hook: surface marked turns
      bin/jev-report             summary: how many turns judged, marked, confirmed if labels exist
      lib/  ask · judge · flags · room(config) · prompt(vendored builder + METHOD.md)
      install.js                 MERGES ~/.claude/settings.json (never replaces), any OS; --uninstall reverses it
      config.json                gateway, model, which sessions, where to write, the rubric file

**On its own (a stranger's machine):**
- **Judges every Claude Code session** (keeper's decision), opt-out per project (`.jev-off` file, or a config list).
- **Runs from a Stop hook, not an app:** after each finished turn, one Jev call in the background. There's no runner
  process to keep alive. That answers item 4, "the runner lives and dies with Consonance".
- **A marked turn shows up in that same session's next prompt** (keeper's decision) as one line: *"[jev · worth a second
  look] your last turn: <one-line reason>"*. That reaches the model and the user.
- **The rubric is the room's METHOD.md** (keeper's decision), with a config key to swap in any file.
- **The key is env-only (`AI_GATEWAY_API_KEY`), exactly as now.** The installer never asks for it and never writes it.
  The README says in its first screen that **judged turns are sent to the Vercel AI Gateway** (opt-in by installing,
  opt-out per project).

**Inside Consonance:** Consonance becomes one config. It points `sessions` at its seats (the roster adapter, item 2), sets
flags to reach **the chair and the librarian only** (as now), and keeps its own capture cadence if it wants one. The
room's `consonance/tools/jev-*.js` are replaced by the module once it passes the same tests (the parity tests already
exist: `jev-flags.test.js` "L105 PARITY").

## WHAT CHANGES FROM TODAY, item by item (A's list → decision)

| # | today | standalone |
|---|---|---|
| 1 seats | read from main.rs | **every session** by default; Consonance's roster is an adapter |
| 2 names | panes.json / letters.json | short session id; Consonance's adapter supplies letters |
| 3 who reads | chair + librarian | **the session itself**; Consonance config keeps chair + librarian |
| 4 runner | spawned by the app | **Stop hook**, one call per turn; no process |
| 5 prompt | borrowed from the room's L2 worker | vendored, with a parity test against the room's copy |
| 6 rubric | METHOD.md | **METHOD.md shipped**, swappable |
| 7 shadow half | measures against the Claude judges | stays in the room, not in the module |
| 8 ledgers | %LOCALAPPDATA% (Windows) | config key, per-OS default |
| 9 gateway | constants; reg.exe | config; no reg.exe off Windows |
| 10 installer | install.ps1 | install.js, merge-only, cross-platform, reversible |
| 11 tests | import room files | self-contained; parity tests live on the room side |
| 12 flags' room copy | parity-pinned | gone (item 1 removes main.rs) |
| 13 dream guard | CONSONANCE_DREAM | a config switch, default off |

## THE BUILD, IN BATCHES (strict wait-for-all, as the keeper chose)

1. **Batch 1, the core:** vendored prompt + parity test (A); config and room resolution (C); the Stop-hook judge with one
   call per turn and a ledger row (B); the flags hook in "same session" mode (E). The module lives in a new directory in
   this repo until it passes.
2. **Batch 2, the edges:** install.js merge-only with uninstall (B); jev-report (C); README with the measured precision
   and the gateway disclosure (E); Consonance as a config consumer, with the room's tools switched over behind a flag (A).
3. **Batch 3, proof:** a clean-machine test (no Consonance, a temp HOME) that a stranger's flow works end to end within one
   read of the README (the falsifier on file); then the repo is created and pushed **on the keeper's word**.

## STILL OPEN — the research that would change the claims

- **A reader from a different model family**, to split Jev's error from the room readers' leniency. Most needed.
- **The keeper's labels (T-J1 v2)**, fully built, waiting on his egress yes and his sitting.
- **The direct model test (V4),** blocked by a 403. Either the gateway key lacks Haiku access or the route needs a
  different endpoint; one check settles it.
