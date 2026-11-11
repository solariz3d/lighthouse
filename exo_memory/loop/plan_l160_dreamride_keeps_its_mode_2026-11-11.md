# L160: a Dreamride song keeps its mode. Librarian, 2026-11-11 01:5x (L)

What he said and what was found: `briefs/dreamride_the_songs.md`, which is the master. Seed 971140 changes from major to its
parallel minor at stage 7, when a minor progression (`automaton/prog.picardy`) is installed. He heard this as "it pitches down a
little bit and ruins the coherent feel of the pitch".

Repo: `C:\Users\zackn\Downloads\dreamride` (public). Before working, read `HANDOFF.md`: the 11-06 update and §4.6 (the method).

## Rules for both panes
- **Do not quote him** in the dreamride repo or in its commits. His words live in the brief only.
- **Old versions play byte for byte** (`tests/versions.rs`). The fix is generator **version 4**; v1–v3 do not change.
- **Builds:** `CARGO_TARGET_DIR=C:\Users\zackn\Downloads\dreamride\target` (A uses its own tools dir), `cargo build -j 4`. Two
  panes build at once, so this uses 8 threads in total, under the heavy-run lock.
- **Nothing is committed or pushed.** That is his call, and the sealed keys are in that repo.

## A: measure first (read-only on the engine; tools in `research/2026-11-05/tools/`, `-j 4`)
Register the prediction in `docs/what_makes_music_bad.md` before running. Then answer:
1. Over 200 fresh seeds at v3, whole streams: what share of songs change `c` (the lens) mid-song, at which stage, and from what
   cause: a progression install, or the `Mode` move (`stream.rs:1058`)?
2. Over the judged set (`examples\` good, and `judged\bad\`): how many of the bad stretches contain a change of `c`, against how
   many of the good ones? Report raw counts, because the sets are small.
3. Seed 971140: confirm that stage 7 is the only change of `c` in its first 8 stages.
- Hand back: `handback/p-l160-measure-A_2026-11-11.md`, every number with the command that reproduces it.

## B: build v4 (src + tests, `-j 4`)
1. **v4 rule: a song keeps its home mode.**
   - A progression pick (`stream.rs:1363`) takes only progressions whose mode is the song's current mode.
   - The `Mode` move is not offered at v4.
   - A species whose book has no progression in the home mode keeps its current progression; it does not change mode.
2. **Tests (written first, each failing on v3 where that applies):**
   - over N seeds at v4, `c` never changes after stage 1;
   - 971140 at v4 stays at c = 5 through stage 8;
   - `tests/versions.rs` still passes, so v1–v3 are byte-identical;
   - the edge case: a book with only one mode.
3. **For his ear:**
   - render 971140 stages 4–7 at v3 and at v4 as WAVs into `C:\Users\zackn\OneDrive\Desktop\Dreamride\L160 971140 v3 v4\`, not
     blind (he knows which is which; this is a check of the fix, not a preference test);
   - put a `stream_s971140_v4.seed` into `examples\`, so the app opens it;
   - the desktop shortcut's launcher rebuilds the app on its next open.
4. Update `docs/versions.md` and the CHANGELOG (v4: what changed and why).
- Hand back: `handback/p-l160-v4-B_2026-11-11.md`, with the full `cargo test --release --no-fail-fast` count.

## Registered before the run (the librarian)
- **Prediction:** at v4, 971140 keeps its major scale through stage 8, and he hears no drop where he heard one.
- **Falsified if:** he hears a drop again at v4. Then the cause is elsewhere: the bass at stage 6, `automaton/bass.rows`, an octave
  figure `+ 12 cl(...)`, is the next suspect.
- **A pass would not show** that mode changes are always bad. One song is one data point. A's count over the judged set is the
  first wider check.

## Not in this lap
- Seed 70372, "too muddy over time": waiting on where he hears it; he marked 1–4 bad and 5–8 good.
