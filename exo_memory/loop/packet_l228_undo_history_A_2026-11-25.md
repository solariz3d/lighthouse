# Packet L228, pane A: rebuild the undo history of the two saved S projects

From the librarian's ring of 2026-11-25T07:28:39Z, verbatim below. His words, 01:27: "when i try to undo it to see the
piece and how it works, the whole thing despawns". Cause, checked by the librarian: in both saved projects the undo
sidecar's `past` holds one document, the empty one (eq-Smooth S as driven L.t180undo and eq-Smooth S flow L.t180undo, in
%APPDATA%\com.solariz3d.t180-track-builder\tracks). One undo goes from three pieces to none. The fault is in the
librarian's packets, not pane A's lap.

Same harness as L227 (exo_memory/handback/p-l227-A_2026-11-25.md), tier "check it", no code change, no suite.

1. For BOTH projects, write a new undo sidecar whose `past` is three documents in order (empty; the lead; the lead and the
   S) and whose `present` is byte for byte the track file as it is on disk now (the app restores a history only then:
   app/core/coreshell.js:102-106). Make the steps by laying each piece as its own step in the core shell, not by editing
   text by hand. The .t180track files are NOT rewritten; their sha256 before and after are printed. If a track file's
   bytes have changed since 07:24:00Z (he may have saved), stop and say so for that project.
2. Keep the two sidecars as they are now, copied into the evidence folder, before replacing them.
3. Prove it through the app's own load path, headless: open, undo three times (3 pieces, 2, 1, 0 on the way), redo three
   times, and the document's sha256 is the starting one. Print the piece counts.
4. Hand back the two lines he needs: he must close and reopen the project to get the new history.

Registered: failed if either .t180track file's sha256 differs after the lap, or if the app's load path drops the new
history.

His app is open; do not start, stop or build it. The re-read of pane B's L225 repair still goes first if it arrives.
Hand-back: exo_memory/handback/p-l228-A_2026-11-25.md, rung to the librarian as a pointer.
