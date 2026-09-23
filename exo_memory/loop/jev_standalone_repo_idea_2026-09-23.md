# Jev as its own repo, usable with or without Consonance: the keeper's idea, saved with its prior art (not built)

*Librarian, on L, 2026-09-23 ~02:4x. The keeper, verbatim: "once we get The jev module perfect, we should make it its own
repo as a module that could be then used or cloned by anyone to use for their claude code … a individual repo that
someone can instantly utilize with or without consonance."*

## WHAT "THE JEV MODULE" IS TODAY (measured at HEAD on L)
Five files, each with tests: `consonance/tools/jev-ask.js` (the gateway client: key from the env only, a secret scan,
a pacer, ledger opt-in), `jev-shadow.js`, `jev-judge.js`, `jev-shadow-runner.js`, and the hook
`consonance/hooks/jev-flags.js`. Tests and mutant sets sit beside them.

## WHERE IT IS WIRED INTO CONSONANCE: what a standalone repo must cut or make optional
- **Seat identity is read out of Consonance's own source.** `jev-judge.js:112-122` reads the chair's, the librarian's and
  the Third Place's ids from `consonance/src-tauri/src/main.rs`; `jev-flags.js:101` does the same, relative to its own file.
- **The runner is started by the app.** `main.rs` `start_jev_shadow` spawns `jev-shadow-runner.js` at every launch
  (`jev-shadow-runner.js:6`).
- **Its paths are Consonance's.** `CONSONANCE_DATA` / `~/.consonance.json` `data_dir` (`jev-shadow-runner.js:330-349`), and
  `CONSONANCE_PANE` for who is reading (`jev-flags.js:14`).
- **Its judge prompt is the room's.** It is the L2 overseer's prompt, which carries METHOD.md's discipline.

## TONIGHT'S EVIDENCE THAT THIS IS THE RIGHT DIRECTION
L089 (pane A, `handback/p-l089-jevflags-A_2026-09-23.md`): installed by the documented recipe, `jev-flags.js` would have
been **silent forever and green on `-Check`**, because it finds its data relative to where the file sits. A module
that works "with or without Consonance" has to find everything from explicit configuration. So the portability
work and the fix A proposes (resolve through config, test from an installed copy) are the same work.

## WHAT A STANDALONE JEV MUST SAY PLAINLY, or it ships the room's weak spots to strangers
- **What it sends.** Judge mode sends a seat's captured turns to a third-party gateway (Vercel AI Gateway →
  `typesafe-ai/jev`). A stranger must opt in knowing that. The key stays env-only, as it is now.
- **How good it is, measured.** On this room's 35 L2 units: Jev vs the retired Claude judge **κ 0.019**; vs two blind
  room readers **κ 0.237**; Jev over-flags personal turns (**7 of 19**) far more than work turns (**1 of 16**)
  (`loop/jev_agreement_2026-09-22.md`; `librarian/2026-09-22.md` 15:1x–16:0x). T-J1 v2, the backtest against the
  keeper's own labels, has not run yet. **"Perfect" has a measurement waiting for it**, and the README should quote
  whatever it returns.
- **The judge prompt's lineage.** Its discipline comes from this room's METHOD.md. It is ours to publish, and its
  retracted wordings were repaired only tonight (L083).

## THE SHAPE THAT FITS (a proposal, not a design)
A repo with the client, the judge and the hook; one config file (gateway, model, which sessions to judge, where to
write); a standalone installer for Claude Code hooks; and Consonance as one consumer that points the config at its own
seats. The room keeps its copy until the extracted one passes the same tests, and then imports it.

**Falsifier:** if a stranger can't get a flag surfaced within one read of its README on a clean machine with no
Consonance, it's not "instantly usable" yet.

## 2026-09-23 ~05:1x — WHAT IS LEFT BEFORE JEV COULD LIVE IN ITS OWN REPO (pane A, L105; the split is not done)

After L099 and L105, **no Jev tool DEFAULTS to a path relative to where its own file sits.** The room, the data dir and the
discipline dir all come through `consonance/tools/jev-room.js`: config first, the checkout the file sits in only as a named
fallback (and `jev-flags.js`'s own copy of the same order), and a refusal that names the fix when neither answers. What follows is what is still Consonance's, with a size for each: **S** small, **M** medium, **D** needs a decision.
Line numbers are as of L105's working tree.

1. **Seat ids come from Consonance's source.** `jev-judge.js:122` `FIXED_SEATS`, read out of `main.rs` through
   `roomOf`; also `jev-flags.js:56` `seatIds`. A stranger has no main.rs. **D** — what is a "seat" outside Consonance: every
   session, or a list in config?
2. **Roster and names come from Consonance's data dir.** `jev-judge.js:151` reads `panes.json`, and `:117` and
   `jev-flags.js` `lettersFor` read `letters.json`. **M** — make them an optional adapter; without them, the short session id.
3. **Who may read a flag is `CONSONANCE_PANE` = the chair or the librarian.** `jev-flags.js:166`, and flagLines'
   main/librarian gate. **D** — standalone, the reader is probably "the user, in every session", which is a different rule.
4. **The runner lives and dies with the Consonance app.** `main.rs:12501` `start_jev_shadow`; the runner's `--app-pid`
   is required (`jev-shadow-runner.js` parseArgs). **D, then M** — standalone needs its own launcher (a SessionStart hook,
   or a service) and a different "when to stop".
5. **The L2 prompt is borrowed from the room's overseer.**
   - `jev-judge.js:100-101` `loadJudgeInputs` source-loads `dev/shell/hooks/l2-overseer.js` `readNarrowedView` and requires
     `l2-overseer-worker.js` `buildOverseerPrompt` from the room.
   - `jev-shadow.js:103-104` `loadBuilder` reads the worker from `~/.claude/shell/hooks`.

   **M** — vendor both functions into the module, with a parity test against the room's copies, so the prompt stays
   byte-identical while the room keeps its own.
6. **The discipline is the room's METHOD.md.** `jev-room.js` `disciplineDirOf`, read at `jev-shadow.js:60` and in judge
   mode. **D** — publish METHOD.md with the module (it is ours; retracted wordings repaired at L083), or ship a neutral one.
7. **The shadow half measures against the Claude overseers' ledgers.** `jev-shadow.js:60` `l2_overseer.jsonl`, `l3-jobs`.
   The Claude judges are off on both machines (D105). **S** — leave `jev-shadow.js` in the room; it is not part of the module.
8. **Where the ledgers go.**
   - `jev-shadow-runner.js:105` `defaultStore` is `%LOCALAPPDATA%\consonance\jev-shadow`.
   - `jev-flags.js:171` hard-codes the same path.

   **S** for one config key. **M** for other platforms: `LOCALAPPDATA` is Windows-only.
9. **The key and the gateway.**
   - `jev-ask.js:47` URL and `:48` model are constants. `:17`: the key is env-only, and that stays.
   - `jev-shadow-runner.js:118` `readUserEnv` reads `HKCU\Environment` via reg.exe, Windows-only.

   **S** — URL and model into config; a no-op `readUserEnv` off Windows.
10. **Hook wiring is Consonance's PowerShell installer.** `dev/shell/install.ps1:147` (`$files`) and `:196` (`$register`).
    **M** — its own installer that MERGES `~/.claude/settings.json`, never replaces it, and works off Windows.
11. **The tests import room files.**
    - `jev-judge.test.js:16`, `jev-shadow.test.js:15` and `jev-shadow-runner.test.js:15` copy `dev/shell/hooks/*`.
    - `jev-flags.test.js:16` reads the repo's `main.rs`.

    **M** — follows item 5 (vendored functions), and item 1 (seats from config).
12. **jev-flags keeps its own copy of the room lookup.** `jev-flags.js` `mainRsPath`, because it is installed as one file.
    Since L105 it is pinned to `jev-room.js` by a parity test (`jev-flags.test.js`, "L105 PARITY"). **S** — goes away once item 1
    removes main.rs from the picture.
13. **The dream guard is Consonance's.** `CONSONANCE_DREAM` in `jev-flags.js` `main`. **S** — harmless outside the room;
    document it or make it a config switch.

**The order that fits:** 1 and 3 first (decisions), then 5 and 11 together, then 2, 4, 8, 9, 10. Items 7 and 13 are small
enough to do in the split itself.

## THE KEEPER'S DECISIONS — 2026-09-23 ~06:2x, on L (AskUserQuestion in the librarian's seat)
The project is now ACTIVE: *"lets do the stand alone jev repo … research laps with the panes first before building the
standalone … the standalone only exists for people who do not want to use consonance, but can also be used with it as
well for every step."*
- **What it judges outside Consonance (item 1):** **every Claude Code session on the machine, opt-out** (a per-project off
  switch). Inside Consonance, it points at the seats.
- **Who sees a flag (item 3):** **the session itself, at its next prompt** (a short note, for the model and the user).
  Inside Consonance, it stays the chair and the librarian.
- **The rubric (item 6):** **ship the room's METHOD.md as the default**; users may swap in their own file.
- **The repo:** **a new public repo under solariz3d.** Consonance imports it once it passes the same tests.
**Order:** research batch R1–R4 (dispatched 06:1x: cost/input, agreement ×3 runs, consistency on real traffic, the
personal-turn over-flag), then the design, then the build.
