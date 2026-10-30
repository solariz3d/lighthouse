# Consonance learns from the outside reader: the system, not only the documents. Librarian, 2026-10-30 17:2x

The keeper, 17:23: "what do we have to do to learn from his insight to make consonance better system?" Today's laps answered the reader with documents (two code maps, six skills, one brief sentence) and one measurement (the duplicate scan). A document is read when someone remembers it; a system does it every time. This plan turns each of his points that survived a check into a mechanism in Consonance, and names the one point about the room's own behaviour that no document fixes. Source for his words: `exo_memory/research/outside_reader_agent_maps_2026-10-30.md`.

## What the day showed about the room, before the mechanisms

The chair's first reply to him (17:30Z) was a defence: right in principle, wrong about what we have. Five hours later the instruments had reversed half of it: no code maps (true), no skills (true), lighthouse's writing the wrong shape for "where is X" (true, conceded at 17:48Z); only "redundant code" failed, at 0.68 %. An earlier session had told the keeper lighthouse needed no skills. So the first mechanism is about the room, not the repo.

## Part 1: outside critique is measured before it is answered (brief rule, just do it, one pane)

One paragraph in `consonance/src-tauri/brief/BUILDING.md`, beside the curated-auditor amendment that BOOT already carries: when a critique arrives from outside the room (a reader, a tester, a friend's message relayed by the keeper), the chair's first move is to name the instrument that would test each checkable claim and run or dispatch it; the reply to the keeper carries the measurements, or says which are pending, and never a verdict on a claim no instrument has touched. Why: the 17:30Z reply; the record's rule that uncurated measurement is the room's one exterior (BOOT, the curated auditor). Falsifier: the next outside critique answered with "we already do that" before a number exists.

## Part 2: the map travels with the packet (Consonance intake, check it, one pane, needs the exe rebuild)

`assemble_intake_within` (main.rs) builds a seat's shell from the briefs and the deck. Add: when a packet names a repository (lighthouse, or a t180 worktree), the pane's wake carries that repository's code map whole (`consonance/src-tauri/src/MAP.md` 113 lines; t180 `MAP.md` 127 lines) under a heading "The map of what you are about to change", ahead of the deck, within the shell's byte budget; a map over the budget rides as a path line, as the deck does. The chair's packet template (BUILDING.md "What a dispatch carries") gains: every "where" in a packet is a MAP.md anchor or a path the librarian supplied, never the chair's memory. Why: his point 4, the orchestrator's vision is as small as any agent's, and the record's 115-that-was-70 (the chair briefing figures from memory). Falsifier: three laps on, packets still carry "where" lines with no anchor.

## Part 3: the map is kept by a gate, not a habit (mcp.rs, prove it, one pane, needs the exe rebuild)

`call_librarian` already runs the trailer gate and the digest gate on a hand-back. Add a map gate: when the hand-back's named repository shows source files created, split or deleted since the packet's base commit (a `git diff --name-status <base>..HEAD` over `src/`, `app/`, `consonance/src-tauri/src/`, `consonance/tools/`), and MAP.md is not in that diff, the ring is delivered with a bracketed warning naming the files (gates_mode light warns; strict refuses). Materially changed files are not gated (judgment), created and deleted ones are (mechanical). Why: his point 6, everyone writes what they built; the room's own history that a rule nobody checks goes stale (the map-line falsifier in COMMITTEE.md was written because of it). Tests first: a hand-back with a new file and no map change warns; with the map change passes; a change to an existing file passes; a deleted file warns. Falsifier: the gate fires on every ring because panes add scratch files under src/; then the path list is wrong, not the idea.

## Part 4: the token claim gets an instrument (consonance/tools, check it, one pane)

His point 7 was that maps cut the exploring an agent does before it builds, and nobody measured it. `consonance/tools/read-before-edit.js`: for a lap id, read each pane's transcript (the capture layer already keeps them; `jsonl_tap` knows the path), count tool calls that read or search files before that pane's first Edit or Write in the lap, and the bytes those reads returned; print per pane and per lap. Run it over the ten laps before the maps landed (D540 to D550) and the next ten after, same seats, same repos. Then it is a standing instrument like `leftovers.js`, one line per lap in the hand-back template. Why: a claim about tokens is the easiest claim to agree with and the cheapest to check; if the count does not fall, the maps are decoration for the panes and the room should say so (the record's falsifier, already registered). Falsifier: the instrument cannot tell a pane's reading for the lap from its reading for its own wake; then it measures nothing and is withdrawn.

## Part 5: skills reach the seats (no lap; a check at the restart)

Claude Code loads `.claude/skills` from the working directory's repository. Panes work in lighthouse worktrees, so once d556-o lands the five skills load on relevance in every pane. The track-equations skill is in the user folder and loads everywhere. Check at the keeper's next restart: a pane's `/skills` list shows the six; if not, the worktree cwd is the reason and Part 2's intake carries a skills index line instead.

## Parts 6 to 9: what OpenRig teaches (added 17:5x, from `exo_memory/research/openrig_against_consonance_2026-10-30.md` §3)

The keeper, 17:50: "I meant what could we learn from it and what the guy said." The reader's own points are Parts 1 to 5. OpenRig, read against Consonance, adds four, ranked by value; each is a lap only on his word.

- **Part 6, a seat that is not Claude (prove it, medium).** BOOT's curated-auditor amendment: agreement among correlated readers is the species to fear; the room has never had a reader off the substrate. OpenRig's shipped `starter` is a Claude builder and a Codex reviewer. In Consonance: a second spawn path beside `spawn_claude_pane` for a Codex seat with the same MCP tools and the same mount gating, a read-only reviewer first. Falsifier: if the Codex reader's corrections over ten laps are all ones a Claude pane also made, it added no decorrelation and the seat is retired.
- **Part 7, a typing guard (check it, small).** `drain_decision` knows a busy pane, not a human draft in the composer; OpenRig re-checks the composer "before Enter after any wait". In Consonance: the drain reads the composer line before `inject_to_pane` and holds while it is non-empty and changing. Falsifier: the keeper's typed line is clobbered once more after it lands.
- **Part 8, a PostCompact refocus (check it, small).** The room's post-compaction rule is a sentence in LIBRARIAN.md and BUILDING.md; OpenRig delivers orientation at the next prompt after a compaction, never mid-turn. In Consonance: a `PostCompact` hook that queues, for that seat, its own `exo_memory/map/<letter>.md` tail and its latest notes path, delivered by the same drain. This is Part 2 in a second form: the map at the moment it is needed. Falsifier: a seat's first turn after a compaction still opens with a question to the chair about what is in flight.
- **Part 9, a maturity stage on research files and cards (just do it).** OpenRig's `stage` field (`wip | provisional | established | canonical | superseded | retired`) in the frontmatter of `exo_memory/research/*.md` and the cards; the carrier-drift re-freeze log cites it; "superseded" names its successor. Answers the reader's "the record is the wrong shape" from the other side. Falsifier: a season on, no file has moved stage.

Not taken, with the reason in the study: full-bypass launch postures, edges that do not enforce, delivery without an idle default, a chat room.

## Order and cost

Part 1 now (a paragraph). Part 4 now (an instrument; no exe change). Parts 2 and 3 after the keeper's restart word, since both need consonance.exe rebuilt (D507's standing rule), and they are one rebuild together with the brief change already landed in d556-o. Nothing here touches the track builder or 0.4.31.

What this does not do: make the room agree with him where the instrument did not. Redundant code is not our problem (0.68 %), and the Markdown share is a proxy nobody should target.

surfaced: outside_reader_agent_maps_2026-10-30.md (the eight points); the chair transcript 17:30Z and 17:48Z; BOOT's curated-auditor section; main.rs `assemble_intake_within`, `room_brief_at`; mcp.rs `trailer_gate`, `digest_gate`; COMMITTEE.md "Your work" (the map sentence, d556-o); BUILDING.md "What a dispatch carries" item 6; p-d554 §2 (the scan's figures); memory `cold-start-reload-cost.md`.
