# Long tracks: load faster, export without the page dying. Librarian, 2026-10-31 08:3x

The keeper, 08:20 on installed 0.4.32: the builder showed the page-crashed screen ("this page is having a problem"), his first; then "ELYSIUM also takes too long to load... tracks are long, sometimes even a lot longer, so it needs to load in faster and export".

## Measured (checked, librarian)
- Crash report: %LOCALAPPDATA%\com.solariz3d.t180-track-builder\EBWebView\Crashpad\reports\e882db08-34c3-4d10-934b-be3def1d57ca.dmp, written 08:19:36. The renderer ran out of JavaScript heap: last collections 819.3 -> 818.7 -> 818.2 MB at 341 s, then "allocation failure; GC in old space requested". The page had been working for about 5.7 minutes.
- Three earlier reports in the same folder carry the same out-of-memory line: 10-15 13:53 (heap about 886 MB), 10-15 16:07, 10-22 19:38. So the ceiling predates 0.4.32; the apron adds geometry on top of it.
- Nothing was written to the game folder; all five ELYSIUM folders are unchanged, his original kn5 sha256 21a13bf81a0c.
- ELYSIUM: 25,046 m (ui_track.json), kn5 203,816,893 B as exported 10-17.
- Not yet known: whether he was exporting or loading at 08:19 (asked).

## The lap (one pane, PROVE IT: export and stored data)
1. Measure first, headless, in the built app's WebView2 or the same Chromium: for ELYSIUM's layout and a synthetic 50 km and 100 km track, time to load and time to export, with the JS heap sampled every second. Name the step where the heap climbs (mesh build, kn5 assembly, the hand-off of the file bytes to the Rust side, map.png, the AI line). Numbers before any change.
2. Fix what the measurement names, smallest change first. Candidates only, not conclusions: the kn5 built as one whole buffer plus copies; the bytes crossing to Rust as a JSON array or base64 instead of raw bytes; geometry kept as plain JS arrays where typed arrays serve; work the page holds on to after a step ends.
3. Load time: the same profile on opening ELYSIUM; fix the biggest step.
4. Proof: a test that exports the 100 km synthetic in the real page under a fixed heap budget and finishes; ELYSIUM's export byte-equal to today's output for the same settings (or the difference named); the export harness whole; fixtures 0 of 9; full suite at landing. Report load and export times before and after, and peak heap.

Falsifier: if after the fix a 100 km track still crashes the page, or ELYSIUM's export changes bytes it should not, the cause was not the one measured.

Release: 0.4.32 does not publish until this lands; it rides as 0.4.33 with the rest of the batch (his named-trade rule: he tries it installed first).

surfaced: the four crash reports; ELYSIUM's ui_track.json and .t180b-builder.json; plan_t180_outside_review (CI), p-d582-batch-C (the built-app export test ran on a small track only).
