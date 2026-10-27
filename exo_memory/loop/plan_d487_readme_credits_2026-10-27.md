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
