# T-180: the keeper's four choices, and export straight into AC. Librarian, on D, 2026-10-06 06:0x. Lap D250.

The keeper's answers, 05:5x (AskUserQuestion):
- Jumps: "good luck making it work right yourself, I feel like the jumps are going to have to be tested by the user through trial and
  error driving it in assetto themselves. For quality of life, when the track is saved and exported, it should automatically create the
  folder in the assetto track folder in steam. So that the user doesnt have to make a new folder every time manually for a new track, then
  it saves the export into the folder."
- Ghost piece: "Always". Handle spot: "Near end, like my picture". Loop select: "Short way across start".

## What already exists (checked)
- **Install to AC** is built and mounted (`app/install/index.js`, `app/install/install.js`, `src-tauri/src/ac.rs`): the first click asks
  for the AC folder once (`set_ac_root`, refused unless it holds `content\tracks`; remembered in `ac_root.txt`), then writes
  `<AC>\content\tracks\t180b_<name>` with every check on, never over a folder the builder did not make. The keeper does not know it is there.

## The items
1. **Find AC through Steam, no picking (A or C; EXPORT tier for the native part).** When no AC folder is remembered, look it up: Steam's
   path from the registry (`HKCU\Software\Valve\Steam\SteamPath`), then `steamapps\libraryfolders.vdf` for every library, then
   `steamapps\common\assettocorsa\content\tracks`. Found → remember it and install with no dialog; not found → the existing picker.
   Make the button obvious beside Export ("Export to Assetto Corsa"), and say in the result line where it went and that re-exporting the
   same track updates that folder. Tests use a FAKE Steam tree; never the real AC install.
2. **Jumps are tuned by driving (E; EXPORT tier).** The keeper's ruling: the user tests jumps in AC by trial and error. So the ramp-reach
   check (`landing-misses-zone`) becomes a WARNING that does not block export or install, worded plainly ("this jump may fly past its
   landing at the lap's speed"). A gap with no landing ramp stays RED (that is a hole, not a jump). Ramp sizing is unchanged.
3. **Handles at the near end (A; FEEL).** Length and width handles move to the piece's near end, as in his picture (`at` in `KINDS`).
4. **Shift-click across a closed lap's start goes the short way (C, who found it; GEOMETRY for the core part).** A run that wraps the seam
   is selected as the pieces either side of the line; Save as piece and Delete handle a wrapped run, or refuse it by name if the core
   cannot keep it.
- Ghost "always": already the default; no change.

## Checks
Authors and lookers run targeted tests only; the librarian runs the touched harnesses once on merged main at install (rule of 2026-10-06).

NEXT: chair dispatch items 1–4 when A's Add-jump control has handed back (item 3 can fold into it)
