# D642 part 2: why the extra bank could not be added on his p2 (pane C)

Seat: pane C (sibling-0845a868). Tier: CHECK IT. t180 worktree `Desktop/worktrees/t180-d642-c`, branch `d642-c` off `df62d6f`. **Red row `91cff59`**
(a `todo` naming its owner: the fix is not the panel's). Not installed, not pushed; the installed exe untouched.

His save `eq-turntest2.t180track` was read from a copy (`scratchpad/d642/turntest2.t180track`).
checked: sha256 before = after = `271b5ac1…a788` (as written: the leading `\` is sha256sum's escape for the path).

## The cause: after his p2 is placed, NO next piece can get a ghost, so there are no handles to add anything with

**His picture says it in red, in the panel:** "no preview of this piece: ghost: the candidate must extend the placed track (the same segments, then
more)" (`exo_memory/briefs/t180_extra_bank_inverted_2026-11-05.png`, left column).

- **His save:**
  - checked: `his-save-next-ghost.log` (`scripts/ghostprobe.js`), his save opened in the core shell and the next ghost built as the preview builds it
    (`trackmodel` update + `ghostFor` of `shell.candidate`) → **refused**, for his fields AND for a plain 100 m straight.
  - The next piece changes the placed p2 from segment 971 of 1,000 (its last 58 m): roll 1.464217 vs 1.464227, roll rate 0.001560 vs 0.001575.
- **Where it changes:** checked: `where-it-changes.log` (`scripts/joint.js`) →
  - p2's stored channels are byte-identical in the candidate document;
  - only the adapter's segments differ (`src/core/adapter.js toSegments`, which lays each piece's bank through `bankPlan`, "the roll carried through a
    joint, and its corners rounded"). A next piece gives the joint a bank corner to round, so p2's tail is laid again.
- **Why his p2:** its bank is still rolling at its end, 4.14e-5 rad/m.
  - checked: `bank-end-rolling-vs-at-rest.log` (`scripts/synth.js`), two built second pieces → the same 1,000 m piece with its bank ending at rest
    (2.63e-6 rad/m) keeps the next ghost; ending still rolling (4.32e-3 rad/m), the next ghost is refused.
- **Through the panel's own path** (the red row, `app/test/core-next-ghost-after-bank.test.js`):
  - The piece: length 1000, turn −90 (a corner), bank 88.45 eased over the whole piece (no "early", the panel's default `bankShape: 'rounded'`), cup
    15.5, width 31.
  - Placed with the panel's Extend button, with the extra +180 turn and without it: p2 ends at 88.45° still rolling 4.14e-5 rad/m.
  - checked: `red-row-91cff59.summary` → **not ok 2 / todo 2**, both "the candidate must extend the placed track".
  - **So it is not the extra turn and not the extra bank:** any piece whose bank eases over its whole length (`rounded`) and ends still turning leaves the
    track with no next ghost.
- **Who owns the fix:** the core (the `rounded` bank shape ending still rolling, and `bankPlan` re-laying a placed tail) and the preview's strict
  prefix check (`app/preview/trackmodel.js ghostFor`). Not the panel. **Handed to B through the librarian**, as the chair's order says.
  - The row is a `todo` naming that, so it reports red without failing the suite; it comes off when the fix lands.
  - Not checked: whether older builds (before the extra handles) do the same. The rounded bank shape is older than L140.

## "it is inverted": the extra bank CAN go the other way while p2 is laid; one drag direction turns the road over

checked: `extra-bank-drags-on-p2.log` (`scripts/drag-probe.test.js`). On the real core's ghost of his p2 (−90, extra +180, bank 88.45), the extra bank
handle dragged 320 px eight ways from a camera above and behind:

- **Up the screen (left side):** −50° (the other way, as he wanted).
- **Down:** +229°, past 180°, so the second half turns upside down: "inverted".
- **Left or right:** no bank change; the drag slides where the change starts.
- The other side's handle is the mirror.
- **The handles agree:** 60 px each way gives the base bank 114.23 / 75.86 and the extra 114.2 / 62.7, the same direction for the same motion
  (`CMP` lines).

So, from the panel side:
- The extra bank is reachable, and "more" on an 88.45° bank turns the road over quickly.
- Which drag direction means "back the other way" on a near-vertical road is not obvious from the screen. That is a design question for him, not a
  defect I can name.
- His save shows he placed p2 with no extra bank. After that, the fault above left him no ghost to add one.

## Not done

- **Part 3** (render his three cases on B's model) waits for B's model to land, as ordered.
- **The panel side:** nothing to fix.

## Corrections

- My first red-row file carried three comment lines copied from the D641 file's header by mistake. I removed them before the commit.

BASE: C:\Users\nname\Downloads\t180-fresh df62d6f
SOURCES: his-save-next-ghost.log (ghostprobe.js on the copy); where-it-changes.log (joint.js); bank-end-rolling-vs-at-rest.log (synth.js); red-row-91cff59.summary; extra-bank-drags-on-p2.log; sha256sum of his save before and after
