# An outside reader on documentation for agents: every pointer, what the room has, what it lacks, and the lap for each. Librarian, 2026-10-30 16:5x

The keeper, 16:38: "lets acquire all of the shit in orch chat from what we learnt from someone giving us pointers." The exchange is in the chair's transcript, 2026-10-30 17:23Z to 18:31Z (the keeper relaying an outside reader who had looked at the public track-builder repo and then at lighthouse). The chair queued three items from it (`exo_memory/loop/queued_after_refresh_2026-10-30.md`). This record takes the whole set, pointer by pointer, verbatim where the keeper pasted it, so nothing he said is lost to the three that were convenient.

## The pointers, verbatim

1. "do you have a claude.md or .claude folder and you just put it in the git ignore so it's not in github?" then "So you are telling me you have no CLAUDE.md nor any project skills?????" then "It always needs it".
2. "documentation is the most important thing of a vibe coded project because otherwise the agents are prone to getting lost in the lines of code so it's better to have more abtract maps of the repo".
3. "What happens ussually is you get a lot of code that does the same as other parts of the code so you end up with redundant code".
4. "even having main orchestrator that orchestrator can't see the whole project at once ... you don't personally tell them the location of each thing as that orchestrator agent might be wrong because the scope of their vision is as small as any other".
5. (his two screenshots) the track builder at 88,749 lines with 1,901 of Markdown, "around 2% of it is markdown"; his own project "trople the size and it still has more than twice the markdown. Why? because to support a big project the most important part is to make the onboarding proccess of agent to be as easy as it can be".
6. "the very nature of agents is not to take input but to do exploring on their own ... so instead you tell each agent do your work but build a map so that other agents can understand your code ... Everyone writes on what the built and if another agent wants to do changes they can first read why it was built like that avoiding breaking things as well as orientating them on the code".
7. "It helps save a lot of tokens since there's not as much back and foward. Since you are basically duplicating your token usage as you have to have one agent explore the code base before making decitions and another that builds but reads the codebase too".
8. "although also appplies to lighthouse since that is your cordination layer".

The keeper's own reading, 18:31: "i guess what he was rlly seeing was shadows of the new repo being made" (D528 cut `docs/` and `.claude/` from the public track builder on 10-28). The chair's answer: partly; before the cut t180 had 12 doc files (216 KB) and 22 skill files, still thin for 75k lines of JavaScript.

## Pointer by pointer: what is on disk (checked 16:45), what is missing, the lap

**1. CLAUDE.md and project skills.** Lighthouse: `CLAUDE.md` at the root, committed; no `.claude/` folder at the root or under `consonance/`; the per-seat CLAUDE.md is assembled from `consonance/src-tauri/brief/*.md` (public) into `C:\Consonance\instances\<seat>\`. The user's own skills folder (`~/.claude/skills`) holds one entry, `synced`. The track builder public repo: no CLAUDE.md, no `.claude/`, 5 Markdown files (README, CHANGELOG, two folder READMEs, one more), 1,901 lines against 49,767 lines of JavaScript in 315 files (`git ls-files` in t180-fresh at 82db6c3). The only skill the room ever had, `track-equations` (the maths the panes checked geometry against), was cut whole by D528 and sits in `C:\Consonance\private\d528\removed\.claude\skills\track-equations\`.
MISSING: skills for the recurring procedures the briefs describe in prose and the panes re-read every time: the heavy-run lock and BelowNormal rule, the mutation harnesses and which one covers which file, the stamp tool, the kn5 and replay readers, the T-180 release and install procedure with the backup and sha256 compare. All of it exists as text in `consonance/tools/README.md` (240 lines), `BUILDING.md`, `COMMITTEE.md`; none of it loads on relevance.
LAP (D555, just do it, one pane): a `.claude/skills/` set in lighthouse (public, lighthouse is not scrubbed) for those five procedures, each a SKILL.md that points at the master file and its command lines, never a copy of the rules (maintenance law 1); plus the track-equations skill as a LOCAL skill after the names sweep (the chair's queue item 2). The track builder repo gets a short `CLAUDE.md` for anyone who clones it: where the code map is, how to run the tests, the one rule about other creators' names stated as "no third-party track names in this repo". The keeper's rule stands: the t180 repo is the product; a map and a CLAUDE.md are product documentation, a decision log is not.

**2. Abstract maps of the repo.** The room has maps of the WORK (hand-backs, plans, `exo_memory/map/<letter>.md`, which COMMITTEE.md:148 and BUILDING.md:208 already require a line in per lap), and the librarian seat as a living index. It has NO map of the CODE: `consonance/README.md` explains concepts and maps no files; `main.rs` is 24,386 of the 41,375 Rust lines; t180 has two folder READMEs (`src/core/README.md`, `app/sounds/README.md`) and heavy why-headers inside most source files (mesh.js, acready.js, kn5write.js carry their reasons at the top), but nothing that says which of 315 files does what.
LAP: the chair's queue items 1 and 1b (the Rust code map; the t180 code map in the t180 repo). Add to 1b: the map's per-file line names the file's header comment where one exists, so the why is one hop away, not re-explained.

**3. Redundant code.** Nobody has measured it. No clone-detection instrument exists in `consonance/tools/` (a grep for duplicate/clone finds board and ledger tools, not a code scanner). 315 JavaScript files written by many panes over five months is the population where the reader's claim is likeliest to be true.
LAP (D554, check it, measurement only, one pane): a duplicate-block scan over t180's `src/`, `app/`, `test/` and over `consonance/tools/*.js` and `consonance/ui/*.js`: normalised token shingles, blocks of 8 lines or more that appear in two or more places, reported as clusters with paths and line ranges, largest first, plus the share of lines that are in some cluster. Written in node with no new dependency (asking before adding one is the standing rule; a 60-line shingle scanner needs none). Fixes are their own laps afterwards, by the keeper's pick from the list, never in the same packet as the measurement. Falsifier: if the duplicated share is under 3 % of lines and the largest cluster under 40 lines, the pointer does not apply here and the scan is filed as the answer.

**4. The orchestrator's vision is as small as any agent's.** The room already holds this: BUILDING.md is written around the chair not seeing everything, the librarian supplies prior art at dispatch, and the panes write what they built. The gap is that the chair still writes the "where" into packets from its own reading, and this seat answers "where is X" by searching every time. A code map makes that a lookup, which is pointer 2's lap.
NO SEPARATE LAP: resolved by 1, 1b and the map habit below.

**5. Markdown share as a proxy for onboarding.** Measured for his screenshot by the chair: t180 1,901 Markdown lines in 88,749 total. The share is a proxy; what he means is that an agent can orient without reading code. After laps 1, 1b, D555 the share rises as a side effect; it is not a target (Goodhart: Markdown added to move a ratio is the record this room already has too much of).
NO LAP; re-measure once, after the maps land, as a line in the D554 hand-back's follow-up.

**6. Everyone writes on what they built, and the next agent reads why before changing it.** The hand-back already does this for the WORK (`COMMITTEE.md` "The hand-back"); the source headers do it for the CODE in t180 but not uniformly (the Rust has far fewer). What is missing is the habit at the CODE level: a pane that builds or changes a module updates that module's entry in the code map and its header why.
LAP: a rule, not a packet line. One sentence in `COMMITTEE.md` "Your work" and in the packet template (`BUILDING.md` item 6, beside the map-line ask): a pane that creates, splits or materially changes a source file updates its line in that repo's code map in the same commit. Falsifier: `git log -- <code map>` shows no pane append three laps after the map lands. Lands with 1 and 1b (the chair's "standing ask in packets" becomes a brief rule).

**7. Duplicated token spend: explore to decide, explore again to build.** The room's shape has three readers per lap (the librarian maps, the chair writes the packet, the pane reads the code), which is the duplication he names, and the record has its costs measured elsewhere (the cold-start reload, memory `cold-start-reload-cost.md`). Whether the maps cut it is measurable: tool calls that read source files before a pane's first edit, per lap, from the pane transcripts, before and after the maps land.
LAP (optional, after 1 and 1b): a count of read-before-first-edit calls per lap, ten laps before the maps and ten after, by the same instrument. If it does not fall, the maps are decoration for the panes and should be said so.

**8. Applies to lighthouse as the coordination layer.** Yes: lighthouse's writing is a record (dated, why-shaped, 10,000 files) and poor at "where is the code that does X and what must I not break". Items 1 (the Rust map) and D555 (skills for the procedures) are the lighthouse half.

## What the reader got wrong, for the record

He read the first screenshot as lighthouse; it was the track builder (75,008 lines of JavaScript, 2,154 of Rust, dated 10-29: the chair's reading, matching t180's shape; lighthouse is 41k lines of Rust and ~10,000 Markdown files). And the thing he described as missing, every agent writing what it built and why, is the room's hand-back and map rule, which he could not see because D528 moved it out of the repo he read. The gap he found is real anyway: neither repo maps its code.

## The laps, in order, all before 0.4.31 by the keeper's 16:32

- Queue 1: Rust code map (chair's, dispatched or next).
- Queue 1b: t180 code map in the t180 repo, with the header-pointer line and the t180 `CLAUDE.md` (pointer 1).
- D554: the duplicate-block scan, measurement only.
- D555: the lighthouse skills set, the track-equations local skill after its sweep (queue 2), the map habit as a brief rule.
- Optional, later: the read-before-first-edit count (pointer 7); the Markdown share re-measured once.

surfaced: the chair transcript 17:23Z to 18:31Z; `queued_after_refresh_2026-10-30.md`; COMMITTEE.md:148, BUILDING.md:208 (the existing map-line rule); consonance/README.md, consonance/tools/README.md; t180 `git ls-files` counts; `C:\Consonance\private\d528\removed\.claude\skills\track-equations\`; memory `cold-start-reload-cost.md`.
