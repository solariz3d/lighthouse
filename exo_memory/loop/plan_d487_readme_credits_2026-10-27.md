# D487: the README's Credits say plainly what the AI did with community tracks. Librarian, 2026-10-27

The keeper, 06:32–06:34:
- "i still swear dogheish will hate that we "studied" his tracks, misinterpreting what it means for an LLM to "study" something, most people think they steal it"
- "I mean i sort of did feed you the tracks lol"
- "say sakura speedway and hazen loop"

## One part, the first free pane (just do it)

In t180 `README.md`, replace the "## Credits" section (origin/main 82afc11, :237–240) with this text, verbatim and wrapped to the file's line width:

    ## Credits
    Built on the work of the T-180 community: ohyeah2389, who made the car and the test track, and the authors of the tracks that set the bar for what a good T-180 track is, Sakura Speedway and Hazen Loop above all.

    The AI agents that built this tool did open those tracks on the developer's own machine. They ran measuring scripts over the track files and replays to learn how wide the road is, how steep the banks get and how tight the turns run. That is how the checker knows what the car can handle, and how **Width like…** can offer a familiar width. What came out is those numbers and nothing else. No mesh, texture, layout or file from anyone's track is in this repo or in anything the builder makes. Reading a file to measure it doesn't train the model or keep a copy, and the agents remember nothing of it afterwards.

- Before committing, check the claim "No mesh, texture, layout or file from anyone's track is in this repo": `git ls-files` contains no .kn5, .ini, .dds or .png from any community track, and no test fixture holds a community track's layout. If anything does, stop and report it. Do not change the text to fit.
- Build it on d486-a (b6106130), so it rides the next batch with the X fix. 0 "keeper" in the added lines. No CHANGELOG line (docs only).

## Amended, 06:36, at the keeper's word: "or maybe dont mention it at all. credits to ohyeah only for making the cars"

The text above is withdrawn. Replace "## Credits" with this, verbatim:

    ## Credits
    The car is ohyeah2389's work: the T-180 car (and its test track) that this builder is made for.

- Leave the rest of the repo as it is. The track names in docs/FINDINGS.md, results/, the tests and the Width like… list are not touched by this order.
- The no-content check before committing still runs.

## A stopped at the gate, 06:38 (`p-d487-A_2026-10-27.md`, 3d3182c4, read whole)

- A stopped on the first text: two renders of whole community tracks are tracked in the repo, `results/sakura_full.png` and `results/rainbow_full.png` (since 6de135e, 2026-09-27).
- The amended text (06:36) makes no claim about content, so **A goes ahead with the amended text now** on d486-a.
- Whether to remove the two PNGs is the keeper's call, since it is a delete from a public repo. I have asked him and recommended removing them.

## Read, 06:39 (A 47f2f0ea / t180 d486-a dcedd30): accepted

- The diff is the Credits text, verbatim as amended.
- It rides the next batch with d486-a b6106130.
- The PNG question waits on the keeper.

## D488, 06:41, at the keeper's word: "remove them". Pane A (just do it)

- On d486-a (after dcedd30): `git rm results/sakura_full.png results/rainbow_full.png`.
- The only reference is `src/texmaker/presets.js:3`, a comment that cites `results/rainbow_full.png` as where the colour stops came from (checked by the librarian with `git grep` at dcedd30). Reword that comment so it names no file and no track. The colour stops stay byte-equal.
- Remove from the tip only. **No history rewrite and no force push.** The files stay in 6de135e's history; rewriting public history is a separate, irreversible call he has not made.
- Check that `git grep -E "sakura_full|rainbow_full"` returns 0. Run the texmaker tests (touched file). 0 "keeper" in the added lines.
- It rides the next batch with d486-a.

## D488 read, 06:51 (A e0f804ea / t180 d486-a cdd19bf7): accepted

- Both PNGs are removed at the tip. The comment-only diff was read by the librarian. `git grep` returns 0, and texmaker tests are 32/0. History is untouched.
- **A fold-in, ruled (just do it):** presets.js:2 still cites "(the README's promise)", which since D487 points at nothing. A drops the phrase on d486-a.
- Then d486-a (b6106130, dcedd30, cdd19bf7 + the fold-in) rides the next batch. D487/D488 CLOSED once the fold-in lands.
