## T-180 Track Builder 0.4.23

### Dragging a piece with an edge typed keeps up with a 144 Hz screen

With a left or right edge angle typed, dragging a piece's handle now stays within one frame at 144 Hz (6.9 ms).

- **Turning a 1,000 m piece with an edge after a placed piece** now costs about 4.4 ms a move (it was about 8.7 ms). While a handle was held, the 3D view worked out the road's width at the ghost's end again on every frame; it now takes a quicker, exact route to the same number. It also no longer rewrites and compares the parts of the ghost that cannot have changed.
- **Stretching a 1,000 m piece on an empty track** with only an edge typed took about 9 ms a move at the slow end. It now takes about 6.5 ms: the builder keeps the edge ramp's samples while the ramp's shape allows, and works out each distinct cross-section once a piece.

The road, the saved files and the 3D view are exactly as before.

### The installer
`T-180.Track.Builder_0.4.23_x64-setup.exe`, 8,013,405 bytes, SHA-256 `df646245910b8d66d814be45cc8f490a9834d651feb02b527553eb489ba3e477`. Windows only; it installs for the current user and is not code-signed, so SmartScreen warns about an unknown publisher the first time.

