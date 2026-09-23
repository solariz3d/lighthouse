# Chair restore point — L, 2026-09-23 ~06:1x, after the HAM run (L083–L108)

> **FIRST — THESE ARE LIVE ONLY AFTER THE NEXT APP REBUILD (the keeper's act).** Landed in `main.rs` / `mcp.rs` /
> `trailer.rs`, tested, NOT running:
> - **L084** `af05958`: the librarian's `call_chair` is refused without an `OUTPUT → NEXT:` line (`mcp.rs` `check_for`).
> - **L085** `ae78229`: the Scribe marks board rows as data and spawns with `--tools "" --setting-sources project
>   --settings {"disableAllHooks":true}` + an empty strict MCP config. (second-vantage.js is live at its next clock fire.)
> - **L086** `a9f3de8`: `committee_form` marks contributions as data; atoms in CLAUDE.md sit inside a recorded-claims frame.
> - **L088** `2d5a934`: row provenance. The Scribe cites its batch rows, the write site stamps `src` from the batch, and
>   anything else goes to `resonance/atoms_held.jsonl`.
> - **L104** `87a8a6c`: keep-warm gets a per-seat offset (50 + FNV-1a(pane id) mod 7 min) and at most one ping per tick.
> - **L101** `c834990`: the update fuse covers the SHORTCUT launch only (`launch.ps1`). The universal point,
>   `main.rs:13253`, is unedited and owed to the rebuild lap.
>
> **SECOND — ON L, NEVER RUN A PLAIN `install.ps1`.** It would overwrite `userprompt-submit.js` (its Hold was removed
> at `b718b91`). Use `install.ps1 -Only <files>` until the keeper rules on the four unused hooks (A's L103,
> `783868b`, `loop/install_proposal_L_2026-09-23.md`).

## WHERE THINGS ARE

- **L**: `C:\Consonance\lighthouse`, level with origin at `893950f` after L108. Chair token `C:\Consonance\instances\main\.chair-token`
  (re-read after any relaunch). All seats on Opus 5.5. Panes on L: A `6fe15f0a`, B `12fb81f6`, C `0845a868`, E `a2122153`,
  librarian `0c0c0c0b`, Third Place `3d000000`.
- **D**: its close through the leave window did NOT publish. L's state repo is still at `9486b30`, so L lacks D108–D122
  ledger rows. D's next close publishes, and **the board compaction runs on D before that publish** (L's board has 0
  repeats; all 7,514 are in D's copy).
- **The queue on L is clear.** The last item (the composition re-scope) landed in L108.

## TONIGHT ON L (lap → commit → what)

| lap | commit | seat | what |
|---|---|---|---|
| L083 | `1c5b4f2` | E+C | retracted ASK-008 wording repaired in the judges' prompt + session-start, installed on L; the bare-relay audit |
| L084 | `af05958` | A | the keeper's rule "the next step comes from the OUTPUT, not the plan" in BUILDING.md; the gate for it (rebuild) |
| L085 | `ae78229` | C+E | Scribe + second-vantage marked as data, hooks provably off; third "lifeguard" carrier |
| L086 | `a9f3de8` | A | committee_form marked; atoms framed as recorded claims (rebuild) |
| L087 | `8d05354` | C | tether-resolve check REFUSED on measurement (would hold 50.5%); curate.js framed |
| L088 | `2d5a934` | C | row provenance, keeper-approved 08:23Z (rebuild) |
| L089 | `2bfc4b3`, `a1250a4` | E, A+C | "solid" sheet (keeper adopted it); jev-flags fixed for its installed location + wired on L; portable-paths red fixed |
| L090 | `6122d79` | E | one-read sheets: CH-4, ASK-002, ASK-007 |
| L091 | `4041a68` | C | a trip row every launch; "no bad trip in seven days" |
| L092 | `4b1647c` | A | AGENTS.md tracked; repo description published by the librarian |
| L093 | `238781a` | B | T-J1 v2 member file (sha256 feca21d5…4332) |
| L094 | `4e88f0f` | E | dated notes on absent_hooks rows 3 and 9, and a union_at_launch citation |
| L095 | `570a5be` | A | the pulse prints QUEUED for held deliveries (live now) |
| L096 | `b549201` | E | the [panes] digest lists every roster pane (installed on L) |
| L097 | `0a636f5` | A | README:7 no longer reads as a verdict on Consonance (pushed, public) |
| L098 | `bbd56ad` | C | one heavy runner per tree (`<data>/heavy-run.lock`) |
| L099 | `a6c6669` | A | jev-judge through config; seats named by pane letter |
| L100 | `36ad6c2` | E | usage.js; "limit: not set" until the keeper types it |
| L101 | `c834990` | B | the update fuse (shortcut path) |
| L102 | `55a486f` | C | member file confirmed by a second build, byte for byte |
| L103 | `783868b` | A | install-drift audit; keeper "Yes, all six", librarian installed them |
| L104 | `87a8a6c` | C | keep-warm offset + one ping per tick (rebuild) |
| L105 | `d14e9aa` | A | all six Jev tools through `jev-room.js`; 13-item what's-left list |
| L106 | `d3dfa9c` | E | T-J1 v2 schemas; item 8 fully built |
| L107 | `7ed0b35` | E | composition question re-scoped and registered |
| L108 | `893950f` | C+B | sealed readers: primary NOT TESTED, secondary κ_step 0.806 (vs 0.000 last night) |

## THE KEEPER'S, NOT THE ROOM'S

The rebuild (everything in the top box) · the three one-read sheets (`loop/ask_sheets_2026-09-23.md`) · Jev-standalone
decisions 1, 3, 6 (`loop/jev_standalone_repo_idea_2026-09-23.md`) · the four unused hooks (`loop/install_proposal_L_2026-09-23.md`)
· turning the CLI auto-update off (B's L101 hand-back §4: command, backup, reversal) · item 8's egress yes and his
labelling sitting · his weekly usage limit and reset for `usage.js` · D's publish and board compaction. **His next word
was to be pane specialization.**

## RULES SETTLED TONIGHT (keep them)

- **The next step comes from the OUTPUT, not the plan** (keeper 01:1x; BUILDING.md via L084). A plan item in a trailer
  is a default; collations carry `OUTPUT → NEXT:`.
- **Batches wait for every ring** (keeper ~05:00). Dispatch to all panes, hold until each has rung, then one landing and
  one dispatch drawn from all the outputs. Idle panes wait. Memory: `batch-waits-for-every-ring`.
- **Every landing runs the whole js-suite, and the collator runs it**, not a pane holding its turn open. The chair
  ends its turn after each landing and each dispatch (the stall trace, `loop/stall_trace_2026-09-23.md`).

## CHAIR'S OWN ERRORS, KEPT

- Reported L083 as `2403a81`; it was `1c5b4f2`. I read HEAD after the push, when the librarian's commit had landed on top.
- Named the portable-paths red three times as "pre-existing" and never dispatched it; it sat red for a day.
- Took `chair_status` "unobserved" for B as "not present"; B sat idle for an hour.
- Ran two full suites in the foreground while panes waited on me (the keeper: "wtf is the orch doing").
- Landed A's L099 hand-back at a blob the librarian had not read, because the hash was printed and committed in one command.
- Opened a lap per freed pane for about an hour, against what became the batch rule.

## ON WAKING

1. Read this file, then the librarian's newest entry. 2. Re-read `.chair-token`. 3. `git pull`, `git status -sb`.
4. Hold for the keeper: nothing is dispatched and no lap is open.
