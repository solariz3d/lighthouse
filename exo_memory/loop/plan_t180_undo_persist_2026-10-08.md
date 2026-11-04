# T-180: Undo survives Save, closing the program, and reopening the track. Librarian, on D, 2026-10-08 11:5x. Lap D272.

The keeper, 11:55: "found a critical bug for qofl, so when you save a track, but then close program, reopen and go back to it, you cannot undo pieces of
the track from where you were it being a new instance of the save, not cool".

## Why (read at t180 6a799cb)
- The undo history lives only in memory: `src/core/document.js:428` `createHistory(doc)` → `{ past: [], present, future: [] }`.
- `app/core/coreshell.js` `open(name)` builds a FRESH history from the file (`D.createHistory(d)`), and `save` writes only `D.serialize(doc())`. So
  every reopen starts with nothing to undo.
- What exists today: "Previous versions…" (each Save keeps the version it replaces, the newest 20, plus pre-Close and pre-Delete copies). That is whole
  saves, not steps.

## The lap (A, who owns the shell's open/save/autosave paths in the core page; DATA tier: a new file beside the track; the track format unchanged)
1. **Save writes the history too**, as a SIDECAR next to the track (`eq-<name>.t180undo`, beside `eq-<name>.t180track`): the past and future
   documents, serialized with `D.serialize`, newest last, capped at the **last 200 steps** (say the size on FIRST TRACK).
   - The track file itself is not changed, so share codes, exports and older builds read it exactly as now.
2. **Open reads it back:** if the sidecar's last "present" equals the opened file byte for byte, the history is restored, so Ctrl+Z steps back from
   where he left off. If it doesn't match (the file was replaced, pasted or edited elsewhere), the history is dropped silently, never mixed.
   Reading must never block opening the track: a bad sidecar means open with no history, and the status line says so once.
3. **The unsaved autosave/restore path** keeps its history the same way, so Restore after a crash can undo too.
4. **Previous versions…** and the pre-Close / pre-Delete backups stay as they are.
- Rows red first:
  - save, then a fresh shell opens the track, then undo walks back the same steps, and redo returns;
  - a mismatched or corrupt sidecar opens the track with an empty history and a message;
  - the cap holds at 200;
  - the track file's bytes are identical with and without the feature.
  - Targeted tests; the save/open rows of core-shell. CHANGELOG under [Unreleased].
- Then install, and it goes into 0.3.3's release (not yet public) or 0.3.4.

NEXT: chair dispatch D272 to A when this plan is read
