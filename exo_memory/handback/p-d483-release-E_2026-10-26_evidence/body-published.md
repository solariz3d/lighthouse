## T-180 Track Builder 0.4.22

### Dragging long pieces is smooth again

Since 0.4.20, dragging a piece longer than about 400 m lagged badly while its Bank, Cup or Edge field held a value. Each stretch or turn refitted the whole ramp at a cost that grew with the square of the length: about 150 ms a step at 1,000 m, and seconds at 3,000 m. The fit now costs about as much as the piece is long. The drag is back to smooth, and the road it lays is the same as before, to the last kept digit.

### New: Track ▸ Bank the lap

Closing a loop has banked its turns since 0.4.19, but a lap closed before then kept its flat turns, and no command banked a lap that was already closed. **Track ▸ Bank the lap** does that:

- It banks every upright curve of a closed lap into its turn, as closing a loop does, and the route stays exactly where it is.
- It is one undo step, and it is greyed out until the lap is closed.
- It keeps a copy of the track from before in the app's track-backups folder, as Smooth ramps does.
- A bank you laid yourself is kept, including a small one under 5°.
- Pressing it again leaves the lap as the first press made it.
- The status line says which pieces it banked and how far. It names every piece it held back: a loop or a steep ramp (too steep to bank), a piece that would lean out of its turn, or a place where the turn changes direction faster than the road can roll.

### Known limits

- **Bank the lap, two rare cases.**
  - A small bank you laid on one piece that sits between two of your own gently banked curves can be read as the builder's own and re-banked; the curves on either side keep yours.
  - A bank you laid leaning the other way from the turn is replaced by one leaning into it.
- **Bank the lap after a plain bend.** On a lap closed by a plain bend whose flat pieces wobble slightly, the first press can bank a little differently than it would on the same lap closed afresh, by under a degree.
- **A piece with very tightly bunched ramp points.** If a track file or a typed per-channel ramp puts several ramp points within a few centimetres of each other on one piece, the bank there can come out as a nonsense value. It did before this release too, in a slightly different way. The builder's own fields cannot lay such a cluster.

### The installer
`T-180.Track.Builder_0.4.22_x64-setup.exe`, 8,015,921 bytes, SHA-256 `123e87c523036e08a3375d72573d764033612d4814798f8272449ee82aeed077`. Windows only; it installs for the current user and is not code-signed, so SmartScreen warns about an unknown publisher the first time.

