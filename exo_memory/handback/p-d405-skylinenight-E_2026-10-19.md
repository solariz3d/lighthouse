# Hand-back, pane E (machine D): D405 Skyline Night

Packet: the chair's D405 (sent 2026-10-19T12:59:34Z); the brief, read whole, `exo_memory/loop/plan_t180_handoff_2026-10-15.md:2774-2787`; released by the librarian at 06:59.
- Branch `d405-e` in worktree `C:\Users\nname\Downloads\t180-wt-e24`, from b306309 (v0.4.8). Clean after the commit. Nothing pushed.
- Work folder `C:\Users\nname\Downloads\t180-d405-e\`.

## 0. The answer

- **t180 `294cacd` on `b306309`:** 18 files, +266 −51. checked: `git log --oneline -2`; `git show --stat HEAD`.
- **The shots for the keeper,** headless and muted, Skyline left and Skyline Night right, each with a six-piece track:
  - `C:\Users\nname\Downloads\t180-d405-e\shots\compare-level.png`: looking level (the chase camera). Skyline's day and sun haze beside the night's navy panels, the warm city glow along the horizon, the road fading into it.
  - `C:\Users\nname\Downloads\t180-d405-e\shots\compare-up.png`: looking up (the Up arrow held; the view switches itself to free view). Skyline's blue with a cirrus streak beside the deep navy with a scatter of small stars.
  - The four single shots are beside them: `skyline-level.png`, `skyline-night-level.png`, `skyline-up.png`, `skyline-night-up.png`.
  - The camera label reads "… · sigil look (L)" in both looks, the bug C is checking (D409). It isn't touched here.

## 1. What it is

- **A sixth entry in Settings ▸ Theme, "Skyline Night", right after Skyline.** It's Skyline's frosted glass, gloss and pills at night:
  - **the panels:** deep navy glass (`--glass rgba(14, 30, 62, .82)`, `--panel #0e1d3b`), text `#e8f2ff`, dim `#a9c3e6`;
  - **the accent:** a lit sky-blue (`#7cc8ff`). The lit pill (an open menu's name, Export to Assetto Corsa, the pressed camera button) carries dark text `#04203f`, so it reads;
  - **the warning hues:** SIGIL's own (`--mine #d9a55a`, `--bad #e0573f`, `--warn #e3b448`, `--ok #8fc9a2`), the dark-surface forms of the same hues. No hue changed;
  - **styling only:** no box property (theme.test's styling row reads the file).
- **The sky, `city` (new, `app/preview/sky/city.js`):**
  - a warm glow along the horizon (`--sky-b`), stronger toward three cities round the compass (broad swells in whole multiples of the azimuth, so no seam), giving way to navy and a deep zenith;
  - a few stars (about one cell in 60 of a 3D grid, a gaussian about a pixel across), none in the glow, twinkling in place by at most 15%;
  - nothing moves across the sky; the glow breathes by under 5% over minutes;
  - D391's rules hold (`contractProblems('city', …)` → `[]`); the shared pass's dither applies as to every style.
- **The texture:** Skyline's paper grain with every speck's colour flipped (`scripts/texture_tiles.js` `grain(0.05, 2, true)`, the same seed). The specks seen on navy are the light ones, D399's rule.
  - checked: re-running the script writes the five existing tiles byte for byte (`git diff` lists only the new tile).
- **One melody for two looks.** `app/lib/theme.js` gains:
  - `LOOKS`: the four melodies' skins and `skyline-night`;
  - `melodyOf`: `skyline-night` → `skyline`.
  - **The melodies stay four.** `THEMES` and `sound.js` are unchanged.
- **Random may land on it:**
  - **at start,** the lower half of Skyline's quarter of the pick (r 0.25–0.375) is the night: one start in eight. The head hands its look to the boot (`window.__t180Look`), and `skinFor(music, melody, look)` keeps it over the player's skyline melody;
  - **while open,** Random picks among the five looks minus the one showing, and the melody follows through `melodyOf`.
  - The lower half, not the upper, so the page tests' pinned picks (0.4 is Skyline, 0.6 is Glass) start where they did.
- **Saved settings keep loading:** every saved value of 0.4.8 reads as before (theme.test's D394 rows, unchanged in what they hold), and `skyline-night` is a seventh name.

## 2. Red first, then green

- **The red:** v0.4.8 (`git archive b306309`) with D405's test files, every file the packet names, whole, muted (`red2.sh` → `t-red-*.out`):
  - **theme:** fail 5 (the head's look, seven choices, the head with a saved theme, the D405 row, a skin named for a look);
  - **settings:** fail 1 (row 7, seven names);
  - **sky:** fail 3 (the style list, the loader, the city row);
  - **sky-dither:** fail 2 (rows 1 and 2 on the city sky);
  - **texture-page:** fail 2 (rows 1 and 5 on the new look);
  - **menubar-page:** fail 2 (row 16, the Skyline Night label; row 18b at 0.6);
  - **theme-mutation:** its controls fail on the old tree.
- **Row 6 (new, texture-page), checked to catch what it claims:** on a copy of the final skin with dark body text (`--text #4a5f84`), 38 texts under 4.5:1 in the builder alone (File ▾ at 1.53, Undo at 1.53 …), not ok (`t-row6-mutant.out`). Its first run on the real skin was red for a reason I found to be the probe's, not the skin's (§5).
- **Whole, on the final tree, muted, under the lock** (`green.sh`, `green2.sh`, `green3.sh` → `t-green*-<name>.out`):

| file | result |
|---|---|
| theme | 12/12 (after the last change) |
| settings | 7/7 |
| sky | 14/14 |
| sky-dither | 3/3: city's longest flat run 4 px (level and up), the band 1.148:1 of its fog at most, 16 levels at rows 0, 2400 and 4320 |
| sky-caustics-aurora | 11/11 |
| texture-page | 6/6: Skyline Night 77 texts in the builder and 83 with the File menu open, 0 pushed under by the texture; row 6, 77 and 78 texts, **0 under 4.5:1 on their own pixels** |
| menubar-page | 21/21 |
| theme-mutation | 38/38: applied 36 / caught 36 / NOT APPLIED 0 (checked: `grep -ac '^ok [0-9]* - .*applied, and caught'`) |

## 3. The amended tests, by name

Each is marked `AMENDED (D405)` or `CHANGED D405` in the file, with why:
- **theme.test:**
  - "the page sets the skin in its head": the head's skin is a look, and its melody is the player's;
  - the boot's regex: it now hands over `window.__t180Look`;
  - "Settings ▸ Theme has six choices" becomes **seven**;
  - "the head reads the saved theme": the random pick's skin is a look (`lookAt(r)`);
  - "each skin the page links is a melody's" becomes "a look's".
- **settings.test row 7:** seven names.
- **sky.test:** the style list gains `city`; the loader loops over it.
- **menubar-page row 18:** Random may land on Skyline Night, whose files are skyline's. **Row 18b at 0.6:** after Glass, Random picks from aqua, skyline, aurora and skyline-night, so it's Aurora (was Skyline). **Row 19:** five looks. **Row 16:** lists Skyline Night.
- **sky-dither and texture-page:** their look and style maps gain the new look and style.
- **theme-mutation:**
  - T1, T4, T15 and S15 are repointed to the lines that changed;
  - T16's caughtBy follows its row's new title;
  - new: T17 (Skyline Night plays a melody of its own name), T18 (the random start never lands on the night), T19 (the boot turns a random night back into Skyline) and S17 (Skyline Night names no sky). All caught.
- No assertion was weakened. Each widens to the sixth look or follows a renamed rule.

## 4. Where my hunks sit in app/index.html (C's D409 removes #empty-art at :202-203 and :464-465)

- The head script (`:12-23` at 294cacd), the new stylesheet link (`:256`), the boot line (`:485`), and the live theme handler (`:587-589`).
- checked: `git diff -U0 b306309 294cacd -- app/index.html | grep '^@@'` → those four places, and `grep -c empty-art` in the diff → 0. Nothing of C's is edited.

## 5. Notes and corrections, mine

- **The city sky's band read 1.299 on its first build:** inside 1.30, but with no margin.
  - I found the spread was intrinsic (Y 0.0295 to 0.0761 over the band: at best 1.26 whatever the fog).
  - Letting the night take over higher (`smoothstep(0.04, 0.40)`, was 0.02–0.30) narrowed it, keeping the glow's full warmth. The fog moved to the band's middle (`color(srgb 0.34 0.25 0.26)`).
  - Now 1.148.
- **The brief's "every text ≥4.5:1" wasn't tested by any existing row.** texture-page row 2 counts only texts the texture pushes under. I added row 6 for the new look.
  - Its first run was red at "turn" 3.31 with the File menu open: the readout's TURN label, half covered by the menu. The probe kept it (part of it is seen) and sampled its whole box, menu pixels included.
  - Row 6 now leaves out a text outside the menu that the menu partly covers, and names it. It still holds every text in the builder, and the menu's own texts and every uncovered text with the menu open.
  - Skyline's own figures, reported, not asserted: 2 under in the builder (the readout over the bright sky 1.03, the grid hint 1.07), a pre-existing state of Skyline. Not this lap's.
- **The mute rule** (the chair's standing rule, and the 07:03 entry):
  - My own launcher (`C:\Users\nname\Downloads\t180-d397-e\cdp.js`, used by the 0.4.8 screenshots, `labels.js` and `shots405.js`) now passes `--mute-audio`. I added it at about 13:06Z, before any D405 launch.
  - The repo's page-test launchers lacked it: `app/test/soundrender.js` `launchChrome` (menubar-page, sky-dither) and texture-page's own spawn. I added `--mute-audio` to both in this commit, after stopping my queued red run before it launched anything (it was waiting at the gate).
  - **Before that, unmuted:**
    - The 0.4.8 screenshots (12:32–12:36Z) and the label read (13:04Z) launched Edge without it. inferred, by reading: they never started the builder's sound (it starts on a pointerdown or keydown, `sound.js:432`, and those scripts only `click()` and set fields).
    - **My D399 whole runs last night** (menubar-page and texture-page, about 03:45–03:48Z) went through the unmuted launchers. menubar-page's row 16 starts the sound on purpose (that tree was 0.4.7, before D401's rows 18 and 19), so that run likely played it aloud. I can't tell from here whether anyone heard; I name it so the rule's history is complete.
  - **Beside C's D409:** my two launcher lines are the same as C's `af4be25`, character for character (`'--mute-audio'` right after `'--headless=new'` in both). checked: `git show af4be25`. Identical changes merge clean at landing; C's added comment line is its own hunk.
- **The first queued red was stopped, not lost:** it was waiting behind A's D407 timing, and I moved the red to a fixed copy so the worktree could change meanwhile. The second was stopped to add the mute. The red of record is the third, `red3.log`.

## 6. Not done

- No push, no install, no full suite. The packet named the files to run whole.
- The sound side of the night look is checked by the page tests' file fetches (Skyline Night fetches skyline's place and undo), not by listening.

NEXT: librarian, show the keeper `shots\compare-level.png` and `compare-up.png` when this pointer arrives; D405 (294cacd) lands in 0.4.9 after his OK.
