# Packet L247 (pane A, on L; pane C reads second): a "turbo" run preset in Consonance

His words, 02:50, are in `briefs/lighthouse_the_room.md` (the 2026-11-26 section). In short: "normal" is the setup as it
is now; a Settings choice "turbo" puts every Opus pane on xhigh effort, and the orchestrator and librarian on Fable at
high effort. He also said: "I dont want to overtune our workflow too far."

## What exists (checked)
- `claude` takes `--effort <level>` (low, medium, high, xhigh, max).
- `spawn_claude_pane` passes `--model` from `~/.consonance.json` `seat_models` (`consonance/src-tauri/src/main.rs:1118-1204`).

## The change (consonance repo, the room's main line)
1. A key `run_preset` in `~/.consonance.json`: `"normal"` (the default, and what a missing key means) or `"turbo"`.
   - Normal: today's behaviour exactly. `seat_models` as written, and no `--effort` flag.
   - Turbo: the seat's model and effort come from one table in code that names each seat. Panes A, B, C and E get opus at
     xhigh. Main and the librarian get fable at high. The Third Place keeps its `seat_models` entry (fable) at high.
2. The preset applies when a seat is spawned or resumed. It does not reach a running seat, so the Settings row says
   "takes effect at the next relaunch". Log each spawn's model and effort in plog, as SEAT MODEL does now.
3. **Settings:** one row, Run preset, with Normal and Turbo. Saving it writes the key and leaves every other key byte for
   byte as it was. Back up the file first, the way the seat_models edit did (`.consonance.json.bak-<date>-...`).
4. An unknown preset value is refused loudly in plog and runs as normal; it never guesses.

## Tier and rows
**Check it** (well-worn config plumbing; a fault shows in plog at the next spawn and undoes with one key). Rows:
- normal reproduces today's argv exactly;
- turbo gives each seat its model and effort;
- an unknown value runs as normal and logs the refusal;
- saving the preset keeps every other key.

Run the touched tests only; the whole suite runs at the landing. The landing goes through the landing train. Then
he relaunches: the exe is locked while the app runs, and the build happens at launch.

## Registered (before the run)
Failed if, after his relaunch with Turbo on: a seat's first reply is not on the model the table names (read it from the
transcript's model field), or Normal does not give back today's argv.

Hand-back to the librarian, claims checked or inferred.
