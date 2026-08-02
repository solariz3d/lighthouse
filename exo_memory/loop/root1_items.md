# Root 1 — the item pool (15 claims)

Built by pane B per `root1_preregistration.md` at **641fb79** (amendments 1–3 included).
**Claims only.** Ground truth, the file:line that settles each claim, and the object hashes are
held outside this repo and outside git; the path and its sha256 are on the board.

**This file wholly replaces the earlier ten-item pool, and none of those ten claims appears here.**
The earlier set is burned — see B's disclosure. Every claim below is about a different fact in a
file the earlier set did not use.

All paths are relative to the repo root (`C:/Users/nname/Desktop/lighthouse`). Each claim names the
file it concerns, so the object is one `Read` away in every condition.

**Selection.** Per Amendment 2.6, the ten that run are chosen mechanically: sort each truth class
by the SHA-256 of its claim text ascending, take the first five of each. The hash is taken over the
claim's single line below **exactly as written, without the `**N.**` label, without the leading
space after it, and without a trailing newline** — one line per claim so the string is unambiguous.
The selected ten and their SHAs are on the board; B applied the rule to its own key and did not
choose them.

**For the courier:** claims describe the working tree at `641fb79`. All seven files are cold — none
appears in the last day of commits. B hashed each at build time and verifies at scoring; if a file
moved and the movement changes a claim's truth value, that item is VOID and reported as void.

---

**1.** In `consonance/src-tauri/src/listen.rs`, the application picker offers a fixed list of seven named applications rather than enumerating the processes currently running on the machine.

**2.** In `consonance/src-tauri/src/nowplaying.rs`, the current media session reported by the operating system is used first, and a search for a session matching the capture source runs only if that fails.

**3.** In `consonance/tools/groove.js`, the minimum spacing between two onsets is expressed in frames rather than in milliseconds.

**4.** In `consonance/src-tauri/src/capture_audio.rs`, the capture binds to the rendering endpoint and removes the audio of other applications from the mixed buffer afterwards.

**5.** In `consonance/src-tauri/src/cochlea.rs`, the table of twelve note names is spelled entirely with flats and contains no sharp spellings.

**6.** In `consonance/tools/curate.js`, atoms are stored in a vector store so that memory is retrieved by embedding lookup.

**7.** In `consonance/src-tauri/tests/arch_test.rs`, the comment stripper used before the lexical assertions tracks string literals but does not handle regex literals.

**8.** In `consonance/src-tauri/src/listen.rs`, when a kernel anti-cheat process is loaded the user is warned and capture is still permitted to proceed.

**9.** In `consonance/src-tauri/src/cochlea.rs`, harmonic partials are searched up to the eighth partial.

**10.** In `consonance/src-tauri/src/capture_audio.rs`, the audio format is asserted rather than queried, because the pseudo-device the capture activates has no mix format to query.

**11.** In `consonance/tools/curate.js`, the design deliberately departs from the paper it borrows from by refusing to rewrite its own prior output during consolidation.

**12.** In `consonance/src-tauri/tests/arch_test.rs`, the assertions about `term.js` are matched against the file's raw text, with no comment stripping applied first.

**13.** In `consonance/src-tauri/src/cochlea.rs`, the band treated as musically meaningful is bounded below at 30 Hz and above at 16 kHz.

**14.** In `consonance/tools/groove.js`, the default onset gate is a rise of 6 dB within one frame.

**15.** In `consonance/src-tauri/src/nowplaying.rs`, the reported result carries a flag recording whether the session was matched to the capture source or is only the operating system's idea of the current one.
