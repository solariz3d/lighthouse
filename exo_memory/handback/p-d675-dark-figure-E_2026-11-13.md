# D675 item 3: the Dark is drawn, in the hunter's shape. Red then green from the stage's own count, its cost while away nothing, kept runs unchanged, one capture for his eye (pane E, machine D, 2026-11-13)

Ruling: the chair's D675 item 3 (23:43Z), Additions 1 and 2 (23:51Z). Registered before code:
`exo_memory/loop/registration_dark_figure_E_2026-11-13.md` (lighthouse `573c0e7a`, additions `afcc9cea`).

dreamzone-3 branch **`dark-figure-e`**, off main `b08f25e`. Local, not pushed. The worktree and build are on
`G:\consonance-scratch\dz3-e-dark`.

| commit | what |
|---|---|
| `124adaa1fd38f590efb26837d5d0db4e86a476d9` | RED: the stage's own count (`WorldStage::undrawn()`) and the overtime row |
| `16531504abd83d4c9fb2b2c7de490c5ba3836543` | GREEN: `dark_`, a second figure from `hunter.glb`; the away counts and row |
| `d1b297d6c306fcd98f1d51733703693a54a89c3b` | CHANGELOG |
| `c598d2e6fa68cd250907e73bec29a193872938ef` | CHANGELOG: a function name lost to shell quoting, restored |

The diff to main: `game/world/stage.h` +13, `game/world/stage.cpp` +34 −2, `game/world/selftest_run.cpp` +77, and
`CHANGELOG.md`. **C reads the `stage.cpp` diff before it lands**, as ruled.

## Red, then green

checked: the world self-test (`dz-world --config game/config --selftest`) under heavy-run.

- **On `124adaa`:** `selftest: FAILED (52 of 53 checks passed)`
  - `FAIL in overtime, every chaser pose has a drawn figure (the Dark included): seed 1: 3689 overtime frames drawn, a
    Dark posed in 3688; dark undrawn in 3688 of them`
  - Falsifier 3 holds: on main the instrument counts the undrawn Dark.
- **On `1653150`:** `selftest: passed (54 of 54 checks passed)`
  - `ok while no Dark is out, the stage neither poses nor draws the Dark's model: seed 1: 674 frames before the timer
    drawn, 0 Dark poses given in them; the Dark's model posed 0 times and its palette set 0 times there`
  - `ok in overtime, every chaser pose has a drawn figure (the Dark included): seed 1: 3689 overtime frames drawn, a Dark
    posed in 3688; every pose drawn`
  - The models line: `hunter: 127116 vertices, 138048 triangles, posed from its bones` **twice**.

**The fix** (`stage.cpp`):
- the first `Kind::Dark` pose takes `dark_`: `hunter.glb` loaded a second time with the hunter's kit;
- it is posed by `gait_pose` with its own stride phase and the pose's own lean, pitch, follow and look, exactly as the
  hunter is;
- it is put away when no Dark is out;
- `dark_` is cleared with the others if the upload fails.
- **Nothing designed.** It is the same mesh, material and gait as the hunter. Its look and name stay his.

## Hand mutants

checked: `node mutdark.js` under heavy-run, each a `dz-world` build plus the whole self-test → **applied 4 / as expected
4 / NOT APPLIED 0**.

| mutant | expected | got |
|---|---|---|
| the Dark's pose matched as `Kind::Hunter` | red | FAIL: the Dark undrawn in 3688 |
| `dark_` never loaded (the red state) | red | FAIL: the Dark undrawn in 3688 |
| the red state + the undrawn count not incremented | **false green** | ok: "every pose drawn". The row reads the instrument |
| `dark_` posed every frame, out or not (Addition 1) | red | FAIL: posed 674 times, palette set 674 times |

- The clean rebuild afterwards is stamped `1653150`, and the tree is clean.
- **One change from the registration, by name:** "the undrawn count not incremented, run on the red commit" was run on
  the tip with the Dark's model disabled. That is the red commit's behaviour (`dark_` absent), and it avoids a third full
  build tree.

## Kept runs replay as before (falsifier 2)

checked: `darkreplay.cmd` under heavy-run → all **20** of his kept runs replayed with `--replay-run` on base and branch.
- They are copied from his `game/runs/` to `G:\consonance-scratch\e-dark-runs`, never written there. There were 20 today,
  not the 16 registered: he played today.
- Base is `0eabefc`, which is main `b08f25e`'s game plus `tools/` only (checked: `git diff --name-only b08f25e 0eabefc`
  outside `tools/` and `CHANGELOG.md` → 0 files); branch is `1653150`. Both stamps were printed.
- **Every run's output is identical between base and branch** (the models lines aside).
  - 18 runs: "the same run to the bit (both fingerprints match)" on both.
  - 2 old runs (`run-20261112-202912`, `-202937`): "NOT the same run: the fingerprints differ" on **both** sides alike.
    They were recorded on older builds, and this branch does not cause it.

## The cost while away (Addition 1's read)

In `handback/p-d675-timing-E_2026-11-13.md` section 2.
- `--bench` at 2560x1440, base `0eabefc` against branch `1653150`, after the librarian's sweep ended, no game on the card.
- The branch reads **1.506 ms average against 1.542–1.543, p99 1.956–1.967 against 1.976–1.986**, worst 2.314–2.368
  against 2.248–2.306.
- No measurable cost while away. Why the branch is 0.037 ms faster is not found.

## The capture for his eye

**The clips**, in `G:\consonance-scratch\e-dark-film\`, each 288 frames at 144 a second (checked by decoding):
- `the_dark_before_after_144fps.mp4`: side by side, before on the left;
- `the_dark_before_full_144fps.mp4`;
- `the_dark_after_full_144fps.mp4`.
- The frames are kept beside them in `base\` and `branch\`; nothing was removed.

| side | commit (the exe's own stamp at capture) | |
|---|---|---|
| before (left) | `0eabefc9af10db76e38b3c38e60b616404e28d42`, + the temporary capture block | main `b08f25e`'s game |
| after (right) | `16531504abd83d4c9fb2b2c7de490c5ba3836543`, + the temporary capture block | `dark-figure-e` |

**How it was filmed:**
- A temporary block in `--capture-frame` (`otdark.js`, after C's `ot.js`; never committed; removed after and both trees
  rebuilt to clean stamps).
- O's saved seed 1 run, a flee bot with a 45 s timer: the Dark is first posed at 45.00 s.
- Filmed from 53.01 s, 5 s after the Dark's first pose: a camera 4 m behind the Dark along its travel. Where a wall stands
  between, the camera moves to the Dark's own trail, by the world's own ray both ways.
- A 3 s warm-up, then every frame at 144 a second.
- The camera's view of the Dark was unblocked in **248 of 288** frames on each side; the Dark was out throughout.
- **The stage's count at the first kept frame:** before, **1 figure of 2 poses** (the Dark undrawn); after, **2 of 2**.
- 254 of 288 frames differ between the sides.
- **Rule A:** before is main's game as of `b08f25e`. Main is now `81eb524`.
  - ~~whose newer commits (the run frame, the pop fix, the yardstick) are not in either side~~
  - **Corrected (the chair, 02:33Z; checked: `git merge-base --is-ancestor 7500a26 b08f25e` → yes, and
    `git log --first-parent b08f25e..origin/main` → `796c16f`, `81eb524`):** the run frame is INSIDE `b08f25e`. Missing
    from both sides are the toe-speed measure (`796c16f`) and **the pop fix (`81eb524`)**. Both sides therefore carry the
    take-off snap he has been shown fixed.
  - This clip is filmed again from the landed main after O's landing.
  - His play build is `31d1c6d`.

**Falsifier 1 holds,** looked at, frame 200 side by side: the before side is an empty corridor, the after side has the
Dark running there in the hunter's shape.

**The registered unwelcome outcome "drawn, and still unseen" is partly true, and it is his to judge.**
- The Dark is a black silhouette, as the hunter is: visible against the lit corridor, near invisible in the dark stretch at
  the clip's start.
- Mean brightness of the first kept frame: 3.0 of 255. Over the clip the mean luma is about 34 on both sides.
- Being drawn does not make it visible where there is no light behind it.

## Not done

- **Not pushed, not landed.** A landing pane lands it after C reads the `stage.cpp` diff. If C or the landing pane want the
  branch on the remote first, that is one push, on a word.
- **His clone is untouched** (clean at `31d1c6d`). His runs were read only.

## Addendum (02:4xZ): main merged in, C's two notes answered, the new tip pushed

Rulings: the chair's 02:34Z (C's read: AGREE, two notes) and 02:35Z (B's find: CHANGELOG conflicts with main; the author
resolves it).

**The new tip:** `dark-figure-e` **`7bc9f3c529055a79360427c635198bbc9cd761c5`**, pushed (a fast-forward of `c598d2e`, scan 0
over 2 commits, push gate allow 02:41:23Z):
- `a4163a67f43956d2117a5fba892e72854c658572`: C's note 1;
- `7bc9f3c`: the merge of main `81eb52402226b05286c3608e1660478b3026bba8`.
  - CHANGELOG conflicted at the top of Added. **Both entries are kept as written,** the Dark's first.
  - checked: `git diff 81eb524 -- CHANGELOG.md` → only the Dark's entry is added.

**C's notes:**
1. **Taken.** The models note names the Dark's copy apart: `take()` gets a label, and the file is still found by its name.
   - checked, in the merged self-test's log → "hunter: 127116 vertices, … posed from its bones; the Dark (hunter.glb):
     127116 vertices, …".
2. **Declined, with the reason.** `hunter.glb` ships with the game in `content/models`.
   - If it ever fails to load, the overtime row fails by name ("dark undrawn in N"): a loud failure where a box would be a
     silent stand-in.
   - A box would also be a look I would be choosing for the Dark, and its look is his.

**The merged branch, checked:** the world self-test on `7bc9f3c`, build stamped `7bc9f3c`, under heavy-run →
**`selftest: passed (54 of 54 checks passed)`**, both Dark rows green:
- the overtime row: 3689 overtime frames, the Dark posed in 3688, every pose drawn;
- the away row: 674 frames, posed 0, palette set 0.
- The count is unchanged by the merge: main's `796c16f` and `81eb524` add no world self-test rows.

**Company, said for P's measure.** P's exclusive hold stood from 02:19:28Z. Inside it, outside heavy-run, I ran:
- the push of `c598d2e` at 02:33:55Z (the gate's scan);
- a git fetch, a checkout of the base tree to `81eb524`, and its submodule init, about 02:34 to 02:35Z.

These are light on the processor but not nothing on the disk. My heavy runs (the builds, the self-test) waited for the hold
under heavy-run.
