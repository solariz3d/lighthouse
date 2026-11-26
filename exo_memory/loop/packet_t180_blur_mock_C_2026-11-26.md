# Packet L245 (pane C; on L): the blur, shown as an artifact

His word (02:23): "lets see the blur in an artifact". Brief: `briefs/t180_ui_declutter.md`.

Build one HTML page from A's real pictures (`handback/p-l242-themed-marks-A_2026-11-26_evidence/pics/<look>/`), for
each of glass, aqua, aurora, skyline and skyline-night:
- left: A's `hover_bank.png` as it is (the canvas window, no blur);
- right: the same look's `rest.png` as the background, with the same label as an HTML window placed where A's window
  sits, styled with that theme's own panel CSS from `app/themes/<look>.css` (its `backdrop-filter` blur, radius, border,
  sheen), so the blur is real CSS over the real render.

Publish it with the Artifact tool if this seat has it (it is private by default). Otherwise hand the librarian the HTML
file and its pictures, and the librarian publishes. No code changes in the builder.

Also say in the hand-back what HTML windows would cost in the builder: the placement code that would move, the hit
tests, and the frame cost of a blur over a 60 fps WebGL canvas. Measure if it is cheap to; mark it inferred if not.
Hand-back to the librarian, claims checked or inferred.
