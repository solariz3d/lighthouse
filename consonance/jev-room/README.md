# consonance/jev-room — the room as a consumer of the standalone jev/ module (D123, pane A)

`.jev/config.json` here is the room's Jev config, in exactly the shape a stranger writes at `~/.jev/config.json`. It is read by
`jev/lib/config.js` `load()` with `home` = this folder (`consonance/tools/jev-judge.js` `loadJevModule`), so it is
validated by the module's own rules: an unknown key or a bad value is a refusal, not a guess.

**It is used only when `CONSONANCE_JEV_MODULE=on`** is in the Consonance app's environment. That is read once, in
`consonance/tools/jev-shadow-runner.js` `run()`, and it takes the exact value `on`, as `CONSONANCE_UNION_AT_LAUNCH` does.
**Off, the default, the room's judge is exactly what it was before D123**, and this file is never opened.

What each key says, since JSON carries no comments:

- `judge: "listed"`, `sessions`: the three fixed seats, **Main, the librarian and the Third Place**, the ids in
  `consonance/src-tauri/src/main.rs`. `consonance/tools/jev-module.test.js` turns red if they drift. **The room still
  judges its roster panes too.** Those come from `<data>/panes.json` at run time, as today, and change too often for a
  static list.
- `audience: "consonance"`: flags go to the chair and the librarian (`consonance/hooks/jev-flags.js`), never to the judged
  seat. `loadJevModule` refuses any other value.
- `dream: true`: the room's `CONSONANCE_DREAM` guard stays on.
- **Not here, deliberately: `ledgerDir`.** The room writes where it always has, `%LOCALAPPDATA%\consonance\jev-shadow`
  (the runner's store). `jev/lib/config.js` accepts only an absolute path or one starting with `~`, and `~` means the
  `home` passed in, which is this folder. So no literal can name `%LOCALAPPDATA%` portably across the two machines.
- **Not here either: `rubric` and `gateway`.** The defaults apply: `jev/METHOD.md`, which is byte-identical to the room's
  `METHOD.md` (`jev/test/prompt.parity.test.js`), and the Vercel AI Gateway with `typesafe-ai/jev`.
