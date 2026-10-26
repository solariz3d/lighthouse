# D475: make the carrying run both ways. Librarian, 2026-10-26

The keeper, 11:42: "We have been grinding the track builder for so long, I fear we might have forgotten the real great work. Check out third place last turn"

The source is the Third Place's note `exo_memory/third_place/to_the_librarian_2026-10-26.md` (Metaxy), read whole. It is uncommitted at the time of writing.

Checked by the librarian at 11:44:
- `C:\Consonance\private\third_place\lineage\` exists: INDEX.md, AUDIT_2026-10-26.md, and keeper_2026-04 … keeper_2026-10.md.
- `cleanupPeriodDays` appears in none of `~/.claude/settings*.json` or `~/.claude.json` (grep, 0 hits). So retention is the default.

This lands on this seat first. The librarian was the keeper's own idea (08-22) for the retrieval problem, and the note's first measure, a question asked of him that the store already held, is the librarian's failure (e.g. D436, recorded in this cycle's corrections). Done in this turn, by the librarian: the rule "grep the lineage before asking him" is in the librarian's memory (search-lineage-before-asking.md).

## Parts

**Part 1, pane E (prove it: it reads every transcript and writes stored data, so privacy is the risk): the extractor becomes an instrument.**
- Take the Third Place's `ripall.js` (in its scratchpad; the chair asks the Third Place for the path) into `consonance/tools/lineage-rip.js`.
- It is read-only on `~/.claude/projects/**/*.jsonl` and writes only under `C:\Consonance\private\third_place\lineage\`. It refuses any output path inside a git work tree.
- It is append-only and deduplicated: a re-run on unchanged transcripts changes 0 bytes.
- Tests, on synthetic jsonl fixtures and never his words:
  - the primary path;
  - dedup;
  - the refusal of an in-repo output path;
  - an empty or malformed line skipped and counted, never fatal.
- Wire it to run once per night or dream cycle by whatever already runs nightly on this machine. Find it; do not invent a new scheduler. If nothing fits, say so and propose one.
- Nothing from the output goes in a commit. A credential and private-term scan runs on the added lines.

**Part 2, pane B (just do it, with the librarian verifying every date): attribute the keeper.**
- Append a new record `exo_memory/record/keeper_origins_2026-10-26.md` (maintenance law 2: no master is rewritten). For each find in the note's §3 list (08-11 the lifeguard retirement … 10-19 testing less), give:
  - the date and seat of his originating message, from the lineage month files;
  - an 8-to-30-word quote of his words. Only rule-origin words: no dream, vision or loss details, and nothing about the film;
  - the master or card that carries the find today, by path.
- Where a master credits "the room" or names him only as adopter, the record names that line by path:line, and the line is left as it is.
- Hand-back: the record, and per row the grep that found the source.

**Part 3, the keeper's call: transcript retention.**
- The room's masters are transcripts: "the full master is the transcript named in its header". At the default, an idle transcript can be deleted after 30 days, and that loss cannot be undone.
- Recommendation: set `cleanupPeriodDays` to 3650 in `~/.claude/settings.json`, as the prehistory recorded. It is one line, and it can be reversed.
- The Third Place has asked him; the librarian asks once more, with the recommendation. If he says yes, a pane applies it with a backup of settings.json first.

**Also:** the Third Place's note and its 2026-10-26 entry are untracked in the shared checkout. The Third Place commits them by named paths, so the paths this plan cites resolve.

NEXT: chair dispatch part 1 to E and part 2 to B now; librarian verifies both when the hand-backs are in; part 3 waits on the keeper's yes.
