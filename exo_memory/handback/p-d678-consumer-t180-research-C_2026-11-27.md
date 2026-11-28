# D678 N6: the six T-180 research notes of 11-27 are withheld from the consumer, and the D454 row follows the folder (pane C, 2026-11-27)

**Stopped at the chair's order of 05:10:54Z, before all mutants ran. The row is green, committed, and pushed to a BRANCH of the room,
`d678-consumer-t180-c`, not to main** (the chair: "Not main: not all its mutants have run"). This hand-back is committed on the same
branch. No consumer build was generated or installed, and the consumer remote was not touched.

**Result.**
- The six notes are product research: research for the track builder and the car it builds for.
- Each is now withheld by its own row in `consonance/tools/gen-consumer.js` EXCLUDE, with its reason, after the first three.
- `collect()` does not reach their `_evidence/` folders today, so those need no rows. The amended row checks for them anyway.
- The D454 row (`gen-consumer.test.js`, amended by name) no longer checks a count. It checks the folder: every `research/t180_*`
  note found must be EXCLUDED and live, and nothing shipped may sit under `research/t180_`, at either end.
- `gen-consumer.test.js`: **116 of 116** at the tip, against 115 pass / 1 fail at the base.
- **Mutants, partly run** (§6):
  - mine: 4 applied / 4 caught / 3 NOT APPLIED;
  - the generator's harness: mutants 0-15 ran, applied 15 / caught 14 / NOT APPLIED 1, one SURVIVED; **mutants 16-25 did not run**;
  - my 3 rewritten manifest mutants did not run;
  - `janitor.mutants.js` did not run.
- **The 10 test files that read the generator did not run** (§7).
- A rule ("any research note named t180_ is withheld") would be safer at one thing and blinder at four. **Not switched** (§5).

Worktree `G:\consonance-scratch\lh-d678-c`, branch `d678-consumer-t180-c`, from `origin/main` `22449900`.

## 0. The base: origin/main, not the checkout's main

- The packet's BASE is `a755c730`, the checkout's main. It was 11 commits ahead of `origin/main` and unpushed.
  - checked: `git rev-list --left-right --count origin/main...a755c730` → `0 11`.
- I branched from `origin/main` `22449900`, so a push carries my commits alone and none of the 11. Those belong to the seats that
  made them.
- The difference does not reach this change:
  - checked: `git diff --quiet origin/main a755c730 -- consonance/tools/gen-consumer.js consonance/tools/gen-consumer.test.js` → exit 0;
  - the same 9 notes and the same two evidence folders, of 9 and 32 files, are on both.

## 1. The red, at the base

- checked: `node --test consonance/tools/gen-consumer.test.js` at `22449900` → 116 tests, 115 pass, 1 fail.
  - The one fail is D454: `premise: three t180 research files in dev`, 9 !== 3 (`red_base_22449900.txt`).
- **The red hid the leak it was guarding.** The premise is asserted before the row's real check, so the check never ran on the six.
  Nothing else in the file noticed them either.
  - checked: `reach.js` at the base → `reach_base_22449900.txt`:
    - collect() lists 9 notes under `research/t180_`: 3 EXCLUDED, **6 SHIPS**;
    - 488 files ship, 31 of them research notes.
  - At the base, the row "a full dry run over the real tree is clean and refuses nothing" is green, so a consumer generated from main
    would have carried the six to a stranger.
- inferred from `git log`, not run at each commit:
  - the row went red with the first of the six, `fbccc701` (11-27 05:22 local);
  - it stayed red until O's whole-suite run found it (`p-d678-heavyrun-stalls-O_2026-11-27.md` §9);
  - the last of the six is `837d1f51` (14:41).

## 2. Are the six product research? Yes

Each note's own opening lines (read at the base):

| note | what it studies |
|---|---|
| `t180_car_how_it_works_2026-11-27.md` | the T-180 car, read from the car mod's public source at a named commit |
| `t180_cars_body_against_box_2026-11-27.md` | the installed T-180 car bodies against their wheels and the shared floor box |
| `t180_cars_clipping_potential_2026-11-27.md` | the installed cars' clipping potential, read from source and from the cars as installed |
| `t180_soft_contact_simulation_2026-11-27.md` | three blind simulations of the floor box in a soft road contact, scored against the record |
| `t180_what_separates_a_break_2026-11-27.md` | what separates a pass where the car goes under the road from one that holds |
| `t180_why_a_car_goes_through_a_road_2026-11-27.md` | why a very fast car goes through a road, and what a road alone can do |

- All six serve the track builder, a product, and none is about the room.
- Three read another creator's mod or its installed cars. That is a second reason they should not reach a stranger in a build of
  the room.
- This is the D454 routing exactly (`p-d454-gen-B_2026-10-24.md:102`: "`exo_memory/research/t180_*` (3 files) EXCLUDED as product
  research"). So I did not refuse.

## 3. Does collect() reach the `_evidence/` folders? No, not today

- `collect()` (`gen-consumer.js:2343` at the tip) reads each rule's folder with `readdirSync`, one level only.
  - It skips anything that is not a file (`:2358`, `statSync(p).isFile()`), then applies the rule's `match`.
- The one rule for research/ is `{ dir: 'exo_memory/research', …, match: /\.md$/ }` (`:106`).
  - checked: `reach.js` at the base and at the tip → "collected from inside a research/ subfolder: 0" and "collected with _evidence
    in the path (source or destination): 0".
  - The two folders on disk: `t180_soft_contact_simulation_2026-11-27_evidence/` (9 files) and
    `t180_what_separates_a_break_2026-11-27_evidence/` (32 files).
- So, as the packet asked, there are no EXCLUDE rows for the folders. A row for a path no rule reaches is drift: `buildStaged` refuses
  the build unless the row is marked `UNREACHABLE:`.
- Instead, the amended row reads the shipped set and fails on any path under `research/t180_`, by source or by destination.
  **That half of the row has no mutant evidence yet** (§6, the three manifest mutants).

**Other routes to a stranger, checked:**
- The consumer's own installer bundles `research/*.md` from the generated tree (`tauri.conf.json`, the reason the rule exists,
  `gen-consumer.js:100-104`), so it carries only what the generator let through.
- `gen-brief.ps1` rewrites BOOT.md into the shipped brief and lists no research notes.
- **Not the consumer, and not mine:** the room's own app bundles `../../exo_memory/research/*.md` (`tauri.conf.json`
  bundle.resources). That is why `portable-paths` counts 7 of its 8 FATAL-SHIPPED-INSTRUCTION sites in these notes (O's §9). This
  change does not touch that count, because `portable-paths` reads `tauri.conf.json` (`portable-paths.js:158-197`), not the
  generator's EXCLUDE.

## 4. The change

**`consonance/tools/gen-consumer.js`, EXCLUDE**:
- six rows after the 09-28 three, under a D678 N6 comment that says why the `_evidence/` folders need none;
- each reason follows the first three's wording and names what the note studies;
- 16 lines added, none removed.
- checked: `reach.js` at the tip → `reach_tip.txt`: 9 EXCLUDED, 0 SHIPS; 482 files ship, 25 of them research notes. That is exactly 6
  fewer than the base's 488 and 31.

**`consonance/tools/gen-consumer.test.js`, the D454 research row, amended by name.**
- Its name now says what it checks: "the t180 product research (exo_memory/research/t180_*) is withheld; the rest of research/ ships".
- The comment above it carries the amendment: what the premise was, why it went red, and why the new form follows the folder.
- **Why the amendment is allowed:** the row was verifiably wrong in its premise, not in its check. "Three t180 notes exist" was a fact
  of 10-24, written as an assertion. The packet ordered this amendment ("Amend it by name, with the reason").
- What it checks now:
  1. at least three `research/t180_*.md` notes exist, so an emptied or renamed folder cannot pass by finding nothing;
  2. each is in EXCLUDE, and its reason is not `UNREACHABLE:`;
  3. none is in the shipped set;
  4. no shipped entry's source or destination lies under `research/t180_`;
  5. the room's own research (`the_pattern_in_felt_knowing.md`) still ships, as before.
- **Red first:** after the row's change and before the source change, the row failed for the right reason.
  - checked: `red_amended_row.txt` → 116 / 115 / 1, "exo_memory/research/t180_cars_body_against_box_2026-11-27.md must be EXCLUDED,
    live, with its reason".
- **Green:** checked: `green_tip.txt` → 116 tests, 116 pass, 0 fail. The generator committed is that file, byte for byte (sha256
  `7f698288…`, checked before the commit; every chunk below checked it before running).

## 5. A rule ("any research note named t180_ is withheld") instead of the list: safer at one thing, blinder at four; not switched

**Where a rule is safer.** Today's failure was a list that nobody remembered to extend: six notes landed on 11-27 with no row, and only
a test caught it. A rule withholds the next note by its name alone, with no one remembering anything.

**What a rule would break or blind, read off the generator (lines at the tip):**
- **The drift check stops covering it.** `gen-consumer.js:2393` checks every EXCLUDE entry against what `collect()` reaches, in both
  directions, because "an exclusion no rule can reach withholds nothing while reading as though it does". A name pattern has no
  entry. If the notes were renamed, or moved into a subfolder, the rule would match nothing and still read as a guard.
- **The withheld-reference report loses them.** `gen-consumer.js:2690` builds the basenames it looks for in the shipped tree from
  `Object.keys(EXCLUDE)`. A note withheld by a pattern would not be among them, so a shipped file that still names it would no longer
  be reported.
- **The run report loses its reasons.** `report.excluded` is filled from `EXCLUDE[f.from]` (`:2449`), path by path with a reason. A rule
  would need its own rows there, or the report a person reads to learn what was withheld goes quiet for these.
- **The name is a convention, not a fact.** A track-builder note not named `t180_` would still ship, and a room note that happened to
  start with `t180_` would be withheld without a reason.

**What I would do instead, and did not do (outside the packet):**
- Keep the list, and make the guard fail closed at generation.
- Today only a test goes red when a `t180_` note has no row. Inferred from §1: the row sat red on main from `fbccc701` until O's suite
  found it, and nothing refused a build meanwhile.
- A refusal inside `buildStaged`, beside the drift checks, would stop any consumer build that would ship a path under
  `research/t180_`. Then neither the list nor its test would need someone to look.

## 6. Mutants: which ran and which did not

**Mine, `mutants_n6.js`** (held, at BelowNormal; it edits the worktree's generator, runs `gen-consumer.test.js`, restores the bytes).
- checked: `mutants_n6.txt` → control green, then **applied 4 / caught 4 / NOT APPLIED 3**, "restored: true".
- What ran, all with the D454 row among the reds:
  - one of the six rows dropped;
  - one of the six marked `UNREACHABLE:`;
  - one of the first three dropped;
  - a tenth `t180_` note appearing with no row (only D454 red).
  - For the dropped rows, the drift-check rows went red too: a renamed key reaches nothing.
- **NOT APPLIED, 3:** the manifest mutants. A rule ships an evidence folder at its own path, ships one under another name, and ships a
  room note to a `t180_` destination.
  - Their anchor lost a backslash when the script was written through a shell heredoc (`/\.md$/` arrived as `/.md$/` inside a JS
    string), so it matched nothing.
  - Rewritten with `String.raw` anchors as `mutants_n6b.js` (anchor count checked: 1). **It never ran**: it was queued last, behind
    the harness, when the stop came.
  - So check 4 of the row (§4) is untested by mutation. Run `mutants_n6b.js <worktree>` to close it.

**The generator's harness, `dev/mutation/mutate-gen-consumer.js` (26 mutants).**
- A first whole run (`run_mutate_gc.js`, one slot for about an hour) was STOPPED by me at 02:03Z (§Corrections). Its output was
  buffered and lost.
- It was re-run in chunks of 4 (`gc_chunk.js`, `run_all.sh`). Each chunk is its own process: it waits for heavy-run's gate, takes its
  own hold, checks the generator's sha against the green file, then runs the unchanged harness on `MUTANTS.slice(from, to)`.
- checked: `mutate_gc_chunks.txt`:

| mutants | ran | result |
|---|---|---|
| 0-3 (with a control: exit 0) | yes | applied 4 · caught 3 · **SURVIVED 1**: "tauri.conf reverts to kind:code, so prose rules corrupt the bundle identifier" |
| 4-7 | yes | applied 3 · caught 3 · **NOT APPLIED 1**: "a bare directory counts as dangling again (would rewrite working constants)" |
| 8-11 | yes | applied 4 · caught 4 |
| 12-15 | yes | applied 4 · caught 4 |
| 16-19 | **no** | waited for the gate behind O's runs, and was stopped before its first mutant |
| 20-23 | **no** | its first mutant (20) was written, and stopped before its test returned: no result |
| 24-25 | **no** | not started |

- **Total: mutants 0-15 ran, applied 15 / caught 14 / NOT APPLIED 1. Mutants 16-25, 10 of 26, did not run.**
- One of those is the one most about this change's list: 22, "DEBT: the counter uses a frozen list instead of Object.keys(EXCLUDE)".
- **The survivor and the NOT APPLIED are not checked at the base.**
  - inferred: neither touches EXCLUDE or the D454 row. One mutates the tauri.conf manifest rule's kind; the other's anchor is
    elsewhere in the generator. So both most likely predate this change. Unverified.
  - The check: run mutants 0 and 5 on a worktree of `22449900` with `gc_chunk.js` (its sha line names the green file; change it to the
    base's).
- After every stop, the generator was restored to the green bytes and its diff read back as my 16 lines (§Corrections).

**`consonance/tools/janitor.mutants.js` did not run.** It names gen-consumer.js because it copies it, but its mutants target
`janitor.js` only.

## 7. Downstream readers of the generator: not run

These read `gen-consumer.js` (grep), and none ran on this change:
- `consumer-fork-wiring.test.js`, `identity-diff.test.js`, `consumer-relabel.test.js`, `janitor.test.js`, `scratch.test.js`,
  `js-suite.test.js`, `gen-brief-gate.test.js`, `ambient-default-claim.test.js` (all in `consonance/tools/`);
- `consonance/hooks/dream-watch.test.js`;
- `dev/shell/hooks/session-start-light.test.js`.

inferred, unverified: EXCLUDE gained six keys and lost none, so a reader that only asks whether a path is excluded sees six more
withheld notes and nothing else. The suite on the merged tree is the landing pane's, and it has not run.

## 8. Landing: a branch of the room, not main

- The commit and the push are on branch `d678-consumer-t180-c`. The push to `origin` creates the same-named branch, which was read
  back. The sha and the scan results are in the ring and the board line, since this file cannot carry its own commit's sha.
- Before the push: `push-gate.js decide()` must say `allow`, and `landing-train.js privacyScan()` must say `{ ok: true }`.
  The evidence folder was also grepped for the privacy patterns before the commit: 0 hits.
- **To land it on main:** run mutants 16-25, `mutants_n6b.js`, the two base checks in §6 and the 10 files in §7, then fast-forward
  main to the branch (origin/main was `22449900` when it was cut).

## Corrections

- **My first mutant run took no lock and overlapped E's timing session.**
  - It started at 00:09:28Z, a plain `node` loop over `gen-consumer.test.js` at BelowNormal. I read the locks only after it passed ten
    minutes.
  - E's exclusive timing session ("E D678 N3: S2 drag-frame A/A at c522ea6, 5 runs a tree") had started at 00:11:27Z.
  - I stopped my run at about 00:20Z, by PID, my processes only. So about 9 minutes of E's A/A runs shared the machine with mine.
  - **E should judge whether those runs stand.** Times from my transcript, not from a ledger.
- **My whole-harness run parked A's exclusive hold** from 01:52:22Z to 02:03Z.
  - It held one slot for what would have been an hour, and an exclusive hold waits until every slot is free.
  - A's hold gives up at 30 minutes (`MAX_WAIT_MS`), which my run would have passed. So I stopped it, and re-ran in chunks.
- **Two stops left a harness mutant in the generator.** Killing a run mid-mutant leaves it written: at 00:20Z (the `_DROPPED` rename),
  at 02:03Z and again at 05:11Z (the seed-drift `void`).
  - Each time I restored it, and checked the diff against my 16 lines and the sha against the green file.
- **TaskStop did not end `run_all.sh`.** The loop runs its chunks through `start //B //WAIT`, which does not stop with the shell. After
  TaskStop and my kill of chunk 16-19, the loop started chunk 20-23 at 05:11:08Z.
  - Chunk 20-23 took a slot and wrote mutant 20. I found it by the sha (`6b6b2c5e…`, not the green `7f698288…`), stopped the loop and
    its chunk by PID, restored the file, and removed my own lock once its holder was gone.
  - Heavy-run's status after: no hold, both slots free.
- **My holds were taken from outside any git tree.** They ran from `G:\consonance-scratch\c-d678`, so heavy-run filed them in its one
  shared bucket, "(not in a git tree)". That bucket serialises its runs, by design (`heavy-run.js:17`).
  - inferred from the wait line "it holds this tree"; I did not read O's lock's tree: chunk 16-19 waited about 21 minutes on O's runs
    for that reason, not for a slot.
  - Running from the worktree would have filed them under its own tree.

## Evidence

`exo_memory/handback/p-d678-consumer-t180-research-C_2026-11-27_evidence/`. Each file is a run's output, the script that made it, or
(`mutants_n6b.js`) the script queued and not run. ANSI codes are stripped. No track data.
- `red_base_22449900.txt`, `red_amended_row.txt`, `green_tip.txt`: `gen-consumer.test.js` at the base, after the row's change, at the tip.
- `reach.js`, `reach_base_22449900.txt`, `reach_tip.txt`: collect()'s reach under research/.
- `mutants_n6.js`, `mutants_n6.txt`: my mutants; `mutants_n6b.js`: the three manifest mutants rewritten, not run.
- `run_mutate_gc.js`, `mutate_gc.txt`: the stopped whole-harness run (only its control line survived).
- `gc_chunk.js`, `run_all.sh`, `mutate_gc_chunks.txt`: the chunked harness runs.
