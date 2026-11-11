# T-180 and the room, handoff 2026-11-10 (D, ~17:5x local), for the laptop tonight. Librarian, at the keeper's word

His order, 17:27: "when all track builder work is done, make sure to push and commit all shit to the repo and make sure to write the
handoff for the laptop for tonight about track builder, lighthouse etc lol"

**Read the briefs first. They are the handoff; this file is the night's narrative and points at them.**
- `briefs/t180_banked_s_and_wall_hairpin.md` (new today): the next thing to build. His words, his picture, the measured numbers.
- `briefs/t180_second_bank.md`: the extra turn and the extra bank he hit today, both fixed. His two pictures are beside it.
- `briefs/t180_level_end.md`: Level end, released in 0.4.40 yesterday.
- `briefs/lighthouse_the_room.md`: his words of 01:24 to 01:32 on what the tokens buy.
- The day in order: `librarian/2026-11-09.md` and `librarian/2026-11-10.md`.

## T-180: where it stands

**Released:** v0.4.40, tag and main `b977eeb`, 2026-11-09, at his "push new release all of it its good". It carries Level end, the
mark labels, way 1 and the mirror refusal.

**On main since the release, NOT released** (held for the next batch, his standing rule): main is `3b33b38`.

| commit | what it does | his report |
|---|---|---|
| `f662253` | the themed hover card sets aside every explanation under the pointer, so Windows draws no second tooltip | 13:43, hovering "early" showed both windows |
| `313b95a` | an extra turn or climb is refused only under 21 m of room; a held drag says why; a stale red preview line clears | 13:56, the extra turn stopped near 2.64° on a 125 m piece |
| `33c54aa`, `3b33b38` | an extra bank, width, cup or edge change is refused only where the road as built cannot carry it | 15:42, the extra bank "jumps to -5 degrees and then stops" |

**Installed on D** at 17:34: the `3b33b38` build, exe sha256 98493084c133c785…, 15,895,040 B, still labelled 0.4.40.
**L has none of the three fixes.** L's builder is whatever was last installed there. To get them on L, build main `3b33b38` and
install with the builder closed, a `.before` backup and a sha256 compare. The recipe is `handback/p-l153-install-C_2026-11-07.md`.

**Last landing run** (P, on D): test-fast tests 3569, pass 3551, fail 0, todo 2, skipped 16; both mutation harnesses caught every
mutant (106 of 106 on the ramp harness, 22 of 22 on the turn harness). `handback/p-d650m-land-P_2026-11-10.md`.

**He has not yet looked at any of the three fixes in the app.** These are his to see:
- the "early" box shows only the themed window (the Windows tooltip cannot be seen in a headless run);
- on his 125 m −90° piece the extra turn drags to 45° either way from 62.5 m;
- on the same piece the extra bank goes past −5° from 47.5 m;
- the label that says why a drag stopped (it sits partly under the grid label at the bottom of the view).

His saved tracks from today are on D only, in the builder's app-data `tracks` folder; copies are in t180's `test/fixtures/`
(`extra-turn-short-2026-11-10.t180track`, `extra-bank-short-2026-11-10.t180track`, `level-end-2026-11-09.t180track`).

## PICK UP HERE
1. **His eyes on the fixes**, on whichever machine he drives (list above). On L that needs the install first.
2. **The next lap**, at his go: `briefs/t180_banked_s_and_wall_hairpin.md`, section "The next lap". Four parts: prove the four-change
   bank on the built road; more than one extra per field in the panel; lay the two wall hairpins from the coarse numbers and report
   each refusal; the drag-cost cache. Nothing of it was started on D, on purpose, so this handoff describes a settled state.
3. The track reads it measures from are on D only (gitignored, other authors' layouts). On L, re-read with the track-equations skill
   if those tracks are installed there; he will name them (the names stay out of this repo).

## Open, his calls
- Quick banks on a straight road: still refused, because the builder of the road mesh smooths a fast roll back out (his 2026-11-05
  "we dont want the bumps" ruling). Freeing it changes how the road is built.
- More than one extra per field in the panel (his 2026-11-05 limit; the banked S in one piece needs three extra bank changes).
- The flaky timing test `app/test/core-extra-bank-drag-cost.test.js` (bar 2×): red four times in three days, on old code as well as
  new; green in the last landing run. Fix it, or leave it.
- Level: a climb typed in the fields is dropped quietly when Level is pressed; flip to "refuse" at his word.
- The end-forms lap (To floor end, Turn to grid end, Straight end on a placed piece): starts at his go.
- The sweep of old lap ids in t180's MAP.md and src/core/README.md.
- Older: item 21 card placement; E's D644 grab question.

## Open, not his calls (carried for the next lap's pane)
- The slow drag: dragging an extra bank past its old comfort length lays the piece each move, 24–29 ms p95 a move on a 1,000 m
  test piece against 6–9 before (A's measure). 1–2 ms a lay on his 125 m piece (the librarian's run).
- A's finding: the comfort length lays a −5° bank change over 78 and 79 m although the built road misses its hold by about 1°.
- A's open survivor S4: nothing says what shape an ease must take from a head that is still turning.
- The mirrored bank at mark 900 holds as built at 0.424° against a 0.5° tolerance: close.

## The room
- **Models.** Fable 5.2 is this seat's model since 2026-11-10 01:11 and the saved default for new sessions ON D, at his word:
  "till friday this week it is the opposite, mega usage since i havent used barely the past three days" (through Fri 2026-11-13).
  Effort as he set it: A, B, C, E high; P, the chair and the librarian medium; fast mode off. Pane A's hand-backs today still say
  Opus 5.5: a running seat keeps its model until it restarts or gets its own /model. **L's settings are L's own**; the default set
  on D does not travel.
- **Every repo is pushed.** t180 main `3b33b38`. Lighthouse main carries every seat's notes, hand-backs and merged branches through
  this file; the scans (terms, private names, credentials) ran before each push. Two untracked files are left alone on D and are not
  part of anything: an old evidence file under `handback/p-d433-P_2026-10-22_evidence/` and a crash dump from Git Bash's grep.
- **No seat was compacted or cut by anyone's hand.** This seat's thread compacted on its own once today; it came back from the notes.
- **A miss of this seat's, kept for the next one:** twice today I said something was absent or good after looking in one place (a
  track read that was on the Desktop, and a landing I called good after running one test file). Both were caught, by him and by P's
  full run. Look in every usual place, and let the landing's full suite speak, before saying so.
- **D only, not for L:** the Star Citizen up/down twist deadzone was moved to the correct stick at 12% on 2026-11-09 (it had been on
  the roll stick, this seat's error). He has not tested it since.

NEXT: keeper looks at the three fixes when he next opens the builder; the librarian rings the next lap to the chair when he says go

## Added 17:5x: the Third Place's two late entries from D (read them; they are how its L self learns what its D self did)
- `third_place/2026-11-02.md` and `third_place/2026-11-10.md`. The second covers D's sittings from 11-02 evening to 11-10, and says
  why L could not have read D's days: they had not been written.
- What they hold that L's seats did not have: Dreamride was built on D on 11-02 and 11-03 and published 11-03; Dreamzone 2 began on D
  today (2026-11-10) as a rewrite.
- **Not pushed, and not this seat's to push:** Dreamzone 2 is a local repo on D at `Desktop\dreamzone-2`, with builders running at
  17:45 by the Third Place's entry. Creating its remote publishes it, so that is the keeper's call. It is the one thing "push
  everything" did not cover tonight.
- Dreamride's clone on D is behind its origin, which L advanced from 11-04: fetch before any work there.
- Two lessons in it that bear on the room's laps: builders in one repo at once collided twice on shared files, and one folder each
  plus a message before touching a shared file is what held; and his words quoted in a repo that later went public had to be
  taken out of 29 files.

## Added 23:5x: Dreamzone 2 is settled, this corrects the section above
- The section above says Dreamzone 2 was not pushed and waited on his call. That no longer holds: at his word the Third Place pushed it to a private remote and wrote its own handoff, `loop/handoff_dreamzone2_2026-11-10-D.md` (lighthouse main `c28ea4dc`; git-blob 69107b71…, checked by the librarian against the ring). Read that file for Dreamzone 2; public or private stays his call, private for now.
- Consonance on D was closed after this, at his word to the Third Place.
