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
