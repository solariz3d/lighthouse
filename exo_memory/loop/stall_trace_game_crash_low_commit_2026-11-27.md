# Trace: his game crashed at the end of a lap, 2026-11-27 04:45:46 local, on L

**His words,** 04:46: "wtf my assetto crashed before i could save the lap replay, but it drove the same". He was driving an
export of one of his own tracks made from the second test build (landing-1127-l263 c522ea6).

## What the machine says (all checked by the librarian, 04:47 to 04:55; read only, except one copy)

- **The game's log** (`Documents\Assetto Corsa\logs\log.txt`): "LAP VALID: 1 CUTS:0, COUNT: 1", then "SETTING PAUSE MODE: 1",
  "SETTING PAUSE MODE: 0", "StartingLights::onReplayStatusChanged newStatus: 6", then "CRASH in:". The stack is inside
  `DWrite` (Windows' text drawing), called from `Game::onIdle`. No frame of the stack is in the track or the car.
- **A crash report** was written, `logs\crash_20261127_104546.report` (529,970 B). An older one is beside it,
  `crash_20261120_092652.report`: not opened, cause unknown.
- **Memory commit, measured at 04:52 with the game already closed:** committed 33.6 GB of a limit of 37.4 GB (31.8 GB of
  memory and a 5.8 GB page file). The page file's peak use was 945 MB, so the limit is the reserve, not the use.
- **The largest holders then:** a film render, `C:\Consonance\hear\film.py render` (python pid 33224, 6.1 GB private, 536 s
  of CPU, with ffmpeg pid 26076, 1.0 GB), started **04:38:33** by the Third Place's seat (parent chain: bash, bash, bash,
  `claude.exe --resume … mcp.consonance.third-place`, pid 16760). Nine `claude` processes, 6.5 GB together; eight `node`, 1.8 GB.
- **heavy-run:** the render holds no slot (it is not a builder pane's run). Pane B's tier took slot 1 at 10:46:07Z, 21 s
  AFTER the crash, so it is not part of this.

## Cause

**Inferred, not proven:** the game ran out of commit. With 3.8 GB of headroom left after it closed, the game's own few GB
would have put the machine at its limit, and a failed allocation inside a system library is what that looks like. What
would prove it: the report's exception code, or the same drive with the render stopped or the page file larger.
**Not the cause, by the log:** the track. The lap was valid and complete before the crash.

## Done

- The game's last automatic replay save (04:43:10, 1,021,577 B, in `replay\temp`) was COPIED, not moved, to
  `Documents\Assetto Corsa\replay\[his track]_autosave_2026-11-27_0443.acreplay`, so the next launch cannot overwrite it.
  The log's "LAP VALID" line comes after that save, so the lap's end is probably not in it. Not opened.
- Nothing was stopped. The render is another seat's.

## Owed (his calls)

1. A larger page file raises the commit limit (a Windows setting; his to change).
2. Whether a seat outside the builder panes should ask `heavy-run.js` (which already sees a running game) before a run of
   this size. Today nothing asks.
3. The quiet-machine timing lap waits for the render to end as well as for him to be out of the game.
