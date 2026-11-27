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

## CORRECTION, 04:58 the same morning: the cause above is refuted, and two of my statements were wrong

**His words,** 04:49: "the same bug sometimes rarely happens on my desktop too with more ram 64gb, so idk if its that, ever
since i started to race t-180s on assetto it has always been a rare transient problem with the replays, could be big to some
how patch for the community but good luck finding that"

After them I read the dump inside the report (the report is a zip; `scratchpad/tools/mdmp.js`, standard library, reads the
exception record and the module list). Checked:

| report | exception | where | what it read |
|---|---|---|---|
| 2026-11-27 10:45:46Z (tonight, at the replay switch) | 0xC0000005, access violation | `assettocorsa\dwrite.dll + 0x101C3F3`, version 0.2.11.0, image 35,155,968 B | address 0x7ECD002DB414, in no module |
| 2026-11-20 09:26:52Z (loading another T-180 track's AI line) | 0xC0000005, access violation | `acs.exe + 0x2A62EC` (`AISpline::calculateNormals` by the log) | address 0x90 |

- **Wrong, mine:** "the stack is inside Windows' text drawing". The `dwrite.dll` in the stack is the one in the game's own
  folder: Custom Shaders Patch, which loads under that name (121,008,424 B on disk). Windows' `DWrite.dll` is loaded too, as
  a separate module, and the fault is not in it.
- **Refuted, mine:** "the game ran out of commit". The fault is a read through a pointer to nowhere, not a failed
  allocation, and it happens on his 64 GB desktop too (his word). The commit figures above are true and did not cause this.
- **Wrong, mine:** the times. The measurements were taken between 04:46 and 04:49, not "04:47 to 04:55" or "04:52".
- The 11-20 crash is a different fault (a null read while loading an AI line), not the replay one.
- Custom Shaders Patch's own log has no line between the 04:43:10 automatic replay save and the crash 156 s later.
- Two searches found no public report of this fault (no name of his, no project name in the queries).
- L holds only these two reports. His desktop, where it has happened for longer, should hold more.

**What would find it:** every crash report on D read with the same script. If the replay ones share one address in
Custom Shaders Patch 0.2.11, that address with the reports is what its author can act on; it is not a thing the builder
can patch. Owed to D, at his word.

## SECOND CORRECTION, 04:53 (clock read, not guessed; the "04:58" above was about 04:51): L holds 12 crash reports, not 2

I had listed the folder's six newest files and counted two. All 12 read with `_evidence/mdmp.js` (`node mdmp.js <dump>`;
each report is a zip holding the dump, the game's log and `race.ini`). Checked:

| reports | exception | where | at what moment | on |
|---|---|---|---|---|
| **11** (09-13 x3, 11-01 x2, 11-18 x5, 11-20) | access violation, read of 0x90 | `acs.exe + 0x2A62EC` (8) or `+ 0x2A62E0` (3) | loading the track's `ai/fast_lane.ai` | [another author's T-180 test track] 6; his own builder exports 5 ([one] 2 on 11-01, [another] 3 on 11-18) |
| **1** (tonight) | access violation, read of 0x7ECD002DB414 | Custom Shaders Patch `dwrite.dll + 0x101C3F3`, 0.2.11.0 | the switch to the replay after a lap | his own export, no AI line |

- **The 11 are the fault already on record:** `briefs/t180_export_ai_line.md` (opened 2026-11-18; `AISpline::calculateNormals`
  on a near-vertical step of the exported line; exporter fix on `l217-ai-line` 102496e) and
  `handback/p-d603-laniakea-C_2026-11-01.md`. **Not in that brief, as far as a grep shows:** 6 of the 11 are on a track the
  builder did not make, with that track's own AI line (382,736 B, a `.bak` of the same size beside it). Not opened further.
- **Tonight's is the only report of the replay fault on L.** One report is no pattern; his desktop is where a pattern could be read.
- All 12 are with the same car, one car on track.
