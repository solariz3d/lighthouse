# Hand-back Q2 / L223 (pane B, on L): Half A BUILT (a builder seat wakes without the three pieces, each a trigger line; one switch restores them); Half B probed, NOT built; the stop was withdrawn at 13:36:47Z

Packet: `exo_memory/loop/packet_q2_builder_floor_B_2026-11-21.md`. Base: room main 0663ea74. Branch: `q2-builder-floor`,
pushed. Half A is code in `main.rs`; Half B is the probe only (no launch flag changed).
Evidence: `p-q2-builder-floor-B_2026-11-21_evidence/`.

## Half B: the probe (partly done)

**How it was run.** Scratch folders under `%USERPROFILE%\Downloads\q2probe` and `q2probe2`, not a working seat. Each
arm ran `claude -p` with the app's builder flags (`--dangerously-skip-permissions --settings <data>/builder-no-prompt.settings.json`),
with the inherited `CLAUDECODE`/`CLAUDE_CODE_*` cleared. Each piece is measured by its own text in the transcript's
`api-request-shape` (tools) and `api-request-blob` (messages), using `analyze.js`. Tokens use A's 0.339 a byte.

**Findings (checked unless marked):**

1. **`-p` is not a faithful copy of a pane's launch.**
   - Its deferred listing is names only, and Artifact is absent from it entirely.
   - A real builder request carries one line with a description per deferred tool. In my own transcript and A's
     (interactive, its own model): Artifact 215 B, Monitor 145 B, SendMessage 127 B.
   - So removability is shown by `-p`, but the size in a pane must be read from the panes' own transcripts. That read is
     done for B and A (the numbers below).
2. **The deferred tools cost one line each until loaded** (Artifact ~73 tokens, Monitor ~49, SendMessage ~43).
   - Monitor (7,658 B) and SendMessage (6,261 B) are full definitions in B's and A's tools today only because each pane
     loaded them by ToolSearch earlier in its session.
   - A's census figures for them (~2,560 / ~2,090) are the loaded case.
   - Leaving them out saves their line, plus the load in a lap that would have used them.
3. **Use in the last 7 days** (`uses.js`, `uses.txt`): 41 builder laps (A 22, B 19). Laps that called each:
   - Artifact 0, Skill 0, Agent 0;
   - Monitor 1, SendMessage 1.

   Over all time, Skill was called 0 times. Agent was called on 09-27, 09-28, 11-12 and 11-13, and the room-reader agent
   is part of the plan. So Monitor, SendMessage and Agent stay (each is used), and Artifact and Skill are the candidates.
4. **THE SURPRISE: removing the Skill tool or the skills makes the Workflow tool's description grow.**
   - `--disallowedTools Skill` removes the Skill tool (1,840 B) and the skills listing (17,225 B, ~5,840 tokens).
   - In the same request, Workflow's definition goes from 5,745 B to 22,976 B.
   - The same growth shows in the `disableBundledSkills: true` arm and the `--disable-slash-commands` arm, but not in
     `--disallowedTools Artifact|Agent|Monitor SendMessage` or `skillListingBudgetFraction: 0`.
   - **Net saving of `--disallowedTools Skill`: about 1,830 B, ~620 tokens, not ~6,400.** This is from `probe2_out.txt`
     (opus 5.5, one run per arm); its arm1 is against arm0.
   - **Inferred:** Workflow takes over the skill list when the Skill tool is gone. To be checked by reading the two
     Workflow descriptions side by side (they are in the arms' transcripts).
5. **`skillListingBudgetFraction: 0`** (haiku arm 4) cut the listing from 16,760 B to 7,233 B. The Skill tool and
   Workflow were unchanged, so it saves ~3,200 tokens. **That makes it the best lever found so far.** It is not yet run on
   opus, not yet combined with `--disallowedTools Artifact`, and what the remaining 7,233 B is was not read.
6. **`--disable-slash-commands`** removes Skill and the listing, but grows Workflow, and may stop `/compact`, which L212 and
   L218 send. **Not to be used** unless `/compact` is shown to still run (`bin/compact_probe`).
7. **`--disallowedTools Agent`** removes the Agent tool (5,299 B) and the agent listing (3,955 B). Agent is used, so it
   stays.

**R2's table, as far as it goes:**

| piece | in a builder request | can be left out by | saves (tokens) | laps of 41 using it |
|---|---|---|---|---|
| Artifact | seen, deferred line 215 B | `--disallowedTools Artifact` (seen absent: haiku arm 1 deferred listing 1,546 → 408 B) | ~73 | 0 |
| Monitor | seen; line 145 B, loaded 7,658 B once used | `--disallowedTools Monitor` | ~49 (+2,600 once loaded) | 1 (stays) |
| SendMessage | seen; line 127 B, loaded 6,261 B | `--disallowedTools SendMessage` | ~43 (+2,120) | 1 (stays) |
| skills listing | seen 17,721 B | Skill disallowed (net ~620, Workflow grows); `skillListingBudgetFraction: 0` (~3,200, haiku only) | see left | Skill 0 |
| agent listing | seen 5,026 B | `--disallowedTools Agent` | ~1,700 | Agent in 4 days; stays |

## Half A: BUILT (checked by rows; see the section below the probe) — first the design as read


Read and decided, not written:
- **Where the builder decision lives.** `assemble_intake_for` has no cwd. Its live callers are `prepare_sibling_dir`
  (always a `sibling-` folder) and `intake_with_map(pane, cwd)` (`is_builder_dir_name(cwd)` is there).
- **The budget trap, and it is the main design point.**
  - Leaving out the three pieces shrinks `core_len`. Then `optional_budget` would seat more cards, which changes the
    deck, and the deck is "not in this lap".
  - It also lets `map_allowance(brief.len())` give the own map more, which changes the own map's carry, also not in the
    lap. Either way, the saving would be re-spent.
  - **The fix:** compute the budget from the full core's length, and the own-map allowance from the full brief's
    length, then emit the three trigger lines in place of the pieces. That keeps the deck and the map byte-identical, as
    `LIGHT_OPTIONAL_CAP` and `map_allowance_mode` did for D277.
- **The switch:** `"builder_floor": false` in `~/.consonance.json`, read like `intake_light()`, with a test-only
  thread_local. The same key would restore Half B's flags.

## Next command

At the next lap, first on opus, then build Half A as above:
```
node exo_memory/handback/p-q2-builder-floor-B_2026-11-21_evidence/probe2.js "$USERPROFILE/Downloads/q2probe3" claude-opus-5-5
```
Edit its ARMS to: base; `skillListingBudgetFraction 0`; that plus `--disallowedTools Artifact`. Then run `analyze.js` on
the folder. R3 and R4 are not started.

## Could be wrong

- Each arm ran once. The Workflow growth is tied to the skill arms in ~~5 of 5~~ **4 of 4** cases, but its cause is inferred.
  - *Struck 2026-11-25 (L225 B2): "5 of 5" was never counted.*
  - The recount: Workflow is 22,976 B in the four arms that touch the skills (probe 1 arms 5 and 6, probe 2 arms 1 and 2) and 5,745 B in the other five.
  - It is read from `analyze_q2probe.json` and `analyze_q2probe2.json` in the evidence folder, each arm's `workflowBytes`. Redo it with `node -e "for(const f of ['analyze_q2probe','analyze_q2probe2'])for(const[k,v] of Object.entries(require('./'+f+'.json')))console.log(f,k,v.workflowBytes)"` in that folder. Which flags each arm used is in `probe_out.txt` and `probe2.js`.
- The haiku arms' listing sizes differ slightly from opus (17,225 vs 16,760 B).

## Half A, as built (added ~13:45Z, after the chair's correction at 13:36:47Z withdrew the stop)

- **What it does.** `builder_floor_for(cwd, brief)` (main.rs, beside `is_builder_dir_name`) is called by the two writers of
  a builder's `CLAUDE.md`: `intake_with_map` (after the own map is seated) and `prepare_sibling_dir`.
  - For a `sibling-` folder with the switch on, `builder_floor_text` cuts each piece from its header to the next
    `---\n\n# ` section:
    - the memory (topic map and live edge);
    - NOT CARRIED;
    - the long-form references.
  - Each is put back as ONE line from `floor_lines`:
    - the memory: "When a packet or a ring cites a memory topic or a board claim you do not hold, open that topic in
      `<topics>`";
    - NOT CARRIED: "When you reach for an instrument that is not in THE DECK above, open its card in `<cards>`";
    - the references: "When a synthesis feels too good to look straight at, or you need the case behind a card, open
      `<data>`".

    No line says "always".
- **The budget is held.** The brief is built WHOLE first, as today, so the deck, the committee brief and the own map's
  allowance are computed exactly as before; only the three pieces leave afterwards.
- **Not touched.** The chair, the librarian and the Third Place never pass through it (their folders are not
  `sibling-`). No piece's words changed; the files are untouched.
- **The switch.** `"builder_floor": false` in `~/.consonance.json` restores all three at the next intake, with no rebuild
  (`builder_floor_on_from`; absent, unreadable or anything else is on).
- **R1, red first (checked).** 8 rows in `builder_floor_tests`; red against stubs: 5 failed, 3 passed (the unchanged
  cases).
  - None of the pieces remains, and the three lines are there.
  - The rest is kept.
  - No line says "always".
  - A brief without the pieces is unchanged.
  - The switch off restores them; an absent config means on.
  - A housed folder, and the switch off, are byte-identical.
  - With the switch on, a builder folder gets the floor and a housed one does not.
  - Wiring: both writers pass through, and the floor comes after the map is seated.
- **R4, the suite (checked, under heavy-run).** Base, L221 branch: 1,286/1/7. Q2 first full run: **1,265 passed, 2 failed, 7 ignored**.
  - The intake row, `light_the_librarian_worst_case_intake_is_under_145_000`, fails on main without this change.
  - **The other failure was a real bug, caught by `r1_a_builder_brief_holds_the_three_trigger_lines_and_keeps_the_rest`.** The cuts ran one after another on the edited text, and a line put in first is not a header. So the references cut ran on through the memory's new line and ate it.
  - **Fixed:** every range is taken from the original brief and replaced from the back. The builder_floor rows were rerun on the fix: 8 of 8.
  - **Not rerun:** the full suite on the fix (the clock). The fix touches only `builder_floor_text`, which nothing else calls but `builder_floor_for`.
- **R3 is owed** after his next restart, with a builder pane's first call after a cut, against 100,183 (`node exo_memory/loop/seat_context_2026-11-14.js --seat <name> --since <the cut>`).
- **Inferred, not measured: the size of the cut.** It removes about 7,600 tokens of A's census (memory 5,860, not-carried
  1,589 or 2,035 for B, references 744) and adds three lines of about 100 tokens each.
- **Half B not built.** The probe's one clean candidate is Artifact (~73 tokens, 0 laps). Skill nets ~620 because of the
  Workflow growth. `skillListingBudgetFraction: 0` (~3,200) is not yet run on opus.

NEXT: librarian route pane A to read git diff 0663ea74..q2-builder-floor when the next lap opens; plan default after it: B finishes the probe on opus, then lands Q2 with one release build
