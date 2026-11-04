## T-180 Track Builder 0.4.26

Four small fixes.

### Tab after a click moves on, as it should

After you click a button it keeps the focus, and Tab there used to switch Sculpt on or off instead of moving to the next control. Now Tab switches Sculpt only when nothing is focused or the 3D view is. On a button, a link or a menu heading it moves the focus as usual.

### The "low overhead" warning clears when the road above moves

When a road passing less than 1 m over another was raised or moved, the amber "low overhead" warning could stay on the lower road until something else made the whole track check again. It now clears as soon as the road above moves away.

### The seam marker on a lap that ends on a jump

Sculpt marks the last and first road pieces of a closed lap, the ones a release may reshape. When a lap's last piece was a jump's flight, the mark landed on the flight and showed nothing. It now marks the last road piece before it.

### The Grab glyph after leaving the window

If you let go of Alt while the builder wasn't focused, Sculpt's Grab glyph stayed turned until the pointer next moved. It now resets when the window loses focus.

### The installer
`T-180.Track.Builder_0.4.26_x64-setup.exe`, 8,017,420 bytes, SHA-256 `4ff5cb59f2c7ae2f46aaac7cc608834aff788e6fafcc19eb1d232793cdb3fdab`. Windows only. It installs for the current user and is not code-signed, so SmartScreen warns about an unknown publisher the first time.
