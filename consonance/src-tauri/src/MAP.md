# A map of `consonance/src-tauri/src/`

What each file does and where to look for things. Anchors are **function names**, not line numbers (lines move every lap;
`grep -n "fn <name>"` finds them). Read from the code itself, 2026-10-30. When you add or move a module, update its line here.

**Size, so you know what you are opening** (re-count with `wc -l *.rs`): 22 `.rs` files and `bin/` (10 probes). `main.rs` is
about 24,400 lines, and **its non-test code ends with `fn main()` at about line 16,100**; everything after it, and about 46 % of
the file in all, is `#[cfg(test)]` modules. `mcp.rs` ~4,400, `cochlea.rs` ~4,100, `sync_launch.rs` ~3,500; the rest are under 800.

## Where to look for X

| you want | start at | then |
|---|---|---|
| **a message delivered into a pane** (every ring and inject ends here) | `main.rs` `gate_or_queue` (the one call every delivery site makes first: queue it or write it) | `drain_inboxes` (the drain thread, one tick per pane, each under `guarded`), `deliver_pull` / `inject_to_pane` (the one write into a pane), `deliver` (paste, then Enter, then verify it submitted; never edits the composer) |
| **is a pane ready to receive** | `main.rs` `pane_state`, `drain_decision`, `pane_idle_for_delivery` | the ready stamp (`write_harvest_stamp`, `read_stamp`, `gate_stamp`), the screen reads (`composer_state`, `input_box_empty`, `turn_in_flight`) |
| **the inbox** (queued messages waiting for a pane) | `main.rs` `struct Inbox` | `gate_or_queue`, `drain_inboxes`, `withdraw_directive` |
| **the rings** (`call_librarian`, `call_chair`, `chair_inject`) | `mcp.rs` the `#[tool]` methods of `impl ConsonanceMcp`: `call_librarian`, `call_chair`, `chair_inject` | their auth (`auth_address`, `auth_station`, `auth_chair`, `auth_librarian`), then `main.rs` `pane_call_librarian_exec`, `librarian_call_exec`, `chair_inject_exec` |
| **who may speak to whom** | `main.rs` `address_row` (None is refused, never defaulted), `chair_target_guard` | `mcp.rs` `required_station`, `station_allows` |
| **the gates on a ring** | `mcp.rs` `trailer_gate` (the NEXT line; the pure rule is `trailer.rs`), `digest_gate` (the digest at ring), `map_gate` (source files created or deleted since the ring's `BASE:` with no MAP.md change), `seal_gate` (sealed tasks), `gates_mode` | the return-leg trap: `mcp.rs` `mark_owed`, `mark_rung`, `handback_refusal_text`; the private-folder refusal `points_into_private` |
| **the ask-first gate on a raised pull** | `gate.rs` (threshold, GateCard; holds no actuator) | `main.rs` `gate_decide` (the chair's Approve or Deny), then `deliver_pull` |
| **the board** | `main.rs` `board_push` (the one funnel every writer passes; dedup and the blind window are applied there), `struct Board`, `get_board` | `board_path` (the file), the dedup belt (`dedup_key`, `note_unseen`), the blind window (`blind_lock`); the MCP side is `mcp.rs` `post_board`, `read_board` |
| **launch** (what happens when the app starts) | `main.rs` `fn main()` → `.setup(...)`: `priority::start`, `leave_cleanup_at_launch`, `sync_at_launch`, `start_exit_waiter`, `watch_session_end`, `keep_awake_thread`, the drain and keep-warm threads, `mcp::start` | `sync_launch.rs` (`decide`, `retire_plan`, `apply_retire`), `launch_effects` |
| **a seat starting** | `main.rs` `spawn_claude_pane` (the one funnel every pane spawn goes through; read-only seats are enforced here) | `spawn_main`, `spawn_librarian`, `spawn_third_place`, `spawn_sibling`, `spawn_fresh`, `new_room`, `spawn_body`, `resume_pane` |
| **what a seat reads when it wakes** (its CLAUDE.md shell) | `main.rs` `assemble_intake_for` (`assemble_intake_within` is it with no maps) | the map of what the packet will change (D585: `packet_maps_for`, `latest_packet`, `packet_repo_maps`, `repo_map_section`), `intake_light`, `fit_optional`, `optional_index`, `map_section`, `librarian_intake`, `main_intake`, `third_place_intake` |
| **what a seat is told when it starts** (the body line) | consonance/hooks/sessionstart-body.js main (one line per start; the librarian's room line from required()) | ledger <data>/sessionstart-body.jsonl |
| **the librarian's first ring after a wake** (the wake gate) | consonance/hooks/wake-gate.js decide (wakeIndex, openedWhole, required) | ledger <data>/wake-gate.jsonl; --replay <transcript> |
| **capture** (keeping a pane's own transcript) | `main.rs` `capture_path`, `gc_captures` (layer 1: the raw PTY log); `harvest_once` (one pass of the capture watcher) | `capture.rs` (layer 2: screen grid → clean turns), `harvest_guard.rs` (the watcher's recovery policy), `start_tailer` (the JSONL transcript tail that feeds the board) |
| **a pane ending by itself** | `main.rs` `on_pane_exit` | `pane_exit.rs` (the policy), `reopen_seat`, `exit_gate_for` |
| **keep-warm visits** | `main.rs` `keep_warm_tick` (its own thread), `keep_warm_send` | `keep_warm_decision`, `visit_text`, `keep_warm_harvest` |
| **compact warm seats** (named "close for the night" until L218: the list of warm, large seats, and the cut on his click) | `main.rs` `close_small_plan` (the list, from `consonance/tools/close-small.js --json`; it only reads) and `close_small_confirm` (his click, the one way in) | `close_small.rs` (`confirm`, the click's check; `compacted_since`), `close_small_run` (the seats at once, one thread each, since L221), `close_small_cut_seat` (the ask, its turn ending), `compact_and_confirm` (the one `/compact` send and the transcript's `compact_boundary`); the progress (L221): every row through `close_small_note` (ledger, then the run to the screen), read by `close_small::progress`, `close_small_progress`*, the X's question in `close_on_x` (the ledger's count and the run's own flag `CLOSE_SMALL_IN_FLIGHT`, so an unreadable ledger still asks), and `close_small_interrupted_at_launch`; ledger <data>/close-small.jsonl; UI `ui/close-small.js` |
| **a builder pane cut at its hand-back, or before its dispatch** (L218; `cut_at_handback` in ~/.consonance.json, empty by default, so it does nothing) | `cut_at_handback.rs` (the pure rule: `listing`, `at_ring`, `after_turn`, `before_dispatch`, `open_background_tasks`) | `main.rs` `cut_at_handback_after_ring` (called by `pane_call_librarian_exec` after a delivered ring), `cut_before_dispatch` (called by `chair_inject_exec` before its gate), `cut_listing`, `compact_and_confirm`; rows `cut_at_handback_wiring_tests` |
| **a builder pane is denied, not held, by a prompt nobody sees** (L216) | `main.rs` `no_prompt_for` (skip_perms AND a `sibling-` folder under the instances root; `"builder_no_prompt": false` turns it off) | `spawn_claude_pane` adds `--settings <data>/builder-no-prompt.settings.json` (`no_prompt_settings_file`, `NO_PROMPT_SETTINGS`); rows `no_prompt_tests` |
| **leaving / closing / the stick** | `main.rs` `leave_run`, `close_route`, `leave_confirmed`, `block_shutdown` | `sync_launch.rs` `run_leave`, `arrive`, `await_handshake`, `find_stick`; `main.rs` `stick_state` and the other `stick_*` commands |
| **a frontend call** (`invoke('x')` in `ui/`) | `main.rs` the 51 `#[tauri::command]` functions, listed in `.invoke_handler(tauri::generate_handler![...])` at the end of `fn main()` | |

## The files

| file | what it does |
|---|---|
| `main.rs` | The app: the Tauri commands, the pane processes, delivery, the board, intake, capture, keep-warm, launch and leave. Sections below. |
| `mcp.rs` | The one shared MCP control plane over loopback HTTP: the tools every seat's claude calls (`post_board`, `read_board`, `raise_pull`, `call_librarian`, `call_chair`, `chair_*`), their auth by token and by mount, and four gates (trailer, digest, map, seal). |
| `trailer.rs` | The pure check behind the NEXT-trailer gate: is the last non-empty line of a message a `NEXT:` hand-off, by verb policy. |
| `gate.rs` | The ask-first gate for raised pulls (control plane only; it holds no actuator, and delivering an approved pull is `main.rs`'s). |
| `lap_holders.rs` | Whose turn it is when more than one lap is open: the pure half of the baton guard. |
| `seat_alias.rs` | What a person types (`Main`, `MAIN`, a letter) mapped to what the pane-name table indexes. |
| `pane_exit.rs` | What to do when a pane's claude process ends by itself: show it, record it, reopen a fixed seat once. |
| `cut_at_handback.rs` | The pure half of L218: which panes the key lists (the chair, the librarian and the Third Place refused by name), whether a ring is a hand-back, whether the ended turn is cut (no background task open, context over 300k), and whether a cold, large pane is cut before its dispatch. |
| `close_small.rs` | The pure half of "Compact warm seats" (L212; named "Close for the night" until L218): the click may cut only the list that was shown, once and while fresh, and only seats still warm and large; the ask each seat is sent; a compaction read from the transcript (with its tokens before and after); the run's progress read from its ledger, seat by seat (L221: `progress`, `summary`, `to_go`, `interrupted_line`, `close_compacting`, `close_must_ask`). |
| `harvest_guard.rs` | The capture watcher's recovery and liveness policy, kept out of the watcher (two threads read one emulator mutex under two policies). |
| `capture.rs` | Layer 2 of capture: pure functions turning a vt100 screen grid into clean, role-tagged turns (a port of `ui/term.js`'s `latestTurn` / `isChrome`). |
| `sync_launch.rs` | Pull, verify, then start (the launch verdict, `decide`), the retire rule for a machine waking as its own past, and the stick: arrive, handshake, keep-awake, leave. |
| `priority.rs` | Keeps Consonance and its WebView2 children at High priority and out of EcoQoS (set at startup, kept). |
| `tether.rs` | A zero-token lexical proxy the chair can read: how tied to checkable ground a turn is, and how much it adds to the board. A surfaced number, never a verdict. |
| `cochlea.rs` | The listening tab's maths: audio as ratios and intervals (FFT, peaks, chords, pulse). Pure, no unsafe. |
| `cochlea_service.rs` | The listening tab's threads and ledger: capture thread, analysis thread, and what is worth saying (with a refusal to run near anti-cheat). |
| `capture_audio.rs` | WASAPI per-process loopback: the unsafe COM half that cannot be unit-tested. |
| `listen.rs` | Choosing which process to listen to (per process, never the whole desktop, so a voice call is never captured). |
| `nowplaying.rs` | What is actually playing, read from Windows' media session. |
| `test_scratch.rs` | Test-only scratch folders that remove themselves on drop. |
| `d476p4_review_c_tests.rs`, `d476p4_rr_c_tests.rs`, `d476p4_rr2_c_tests.rs` | Review tests from one lap, included into `main.rs` as `#[cfg(test)]` modules by `#[path]` at its very end. Not app code. |
| `bin/` | Standalone probes and replays, each with its run line in its header: `pty_spike` (can portable-pty drive claude), `jsonl_tap` (the transcript path and its `usage`), `capture_probe` (layer 2 on real output), `composer_probe` (is the composer's separator reliable), `flush_probe` and `resume_probe` (transcript flush and `--resume` after a hard kill), `harvest_replay` (a `.log` through the harvester), `compact_probe` (does `/compact` written with deliver()'s bytes run as the command: yes, L218 R0, once the probe answers the terminal's queries as xterm.js does), `cochlea_replay` and `conf_sweep` (the listening maths on recorded frames). |

## `main.rs`, by area

The file has `// ----` and `// ──` banners, but they mark when an area began, not everything under them: grouped here by what
the functions do. Functions marked * are `#[tauri::command]`.

- **Config.** `get_state`*, `parse_config`, `save_config`*, `save_config_at`, `config_exists`*, `merged_config_text`, `usb_mode_on`.
- **Directories and the seeded room.** `set_dirs`, `data_dir`, `instances_root`, `repo_root`, `default_room`, `seed_room`, `apply_seed`, `seed_decision`, `cards_dir`.
- **Pane processes (PTY).** `struct Panes`, `struct PaneEmus`, `spawn_claude_pane` (the funnel; a model named per seat in `~/.consonance.json` `seat_models` rides it as `--model`: `seat_model`, `seat_model_from`, shipped empty, Lap W C1; a builder pane's `--settings` for denyInsteadOfPrompting, L216: `no_prompt_for`, `is_builder_dir_name`, `no_prompt_settings_file`), `pty_spawn`*, `pty_write`*, `pty_resize`*, `pty_kill`*, `pty_reopen`*, `claude_bin`.
- **Capture, layer 1, and the transcript tail.** `capture_path`, `retire_capture`, `gc_captures`; `start_tailer`, `extract_turn`, `extract_turn_tracked`; offsets and backfill (`load_offsets`, `resume_offset`, `backfill_line`).
- **Cost.** `struct Cost`, `turn_cost_usd`, `extract_usage`, `context_window`.
- **The board.** `struct Board`, `board_push`, `board_path`, `dedup_key`, `blind_lock`, `resonance_window`; `get_board`*.
- **Intake (what a seat wakes on).** Every seat's intake opens with the stamp of what it was built from (Lap W W1: `shelf_stamp`, `shelf_stamp_line`, `shelf_built_from_at` asking origin by `ls-remote`, `launch_pull_line` reading launch.ps1's `launch-pull.json`, `launch_id` taken once and removed from the environment). `assemble_intake_for` (and its no-maps wrapper `assemble_intake_within`); the repositories the packet names and their maps, ahead of the deck (D585: `packet_maps_for`, `latest_packet`, `packet_paths`, `packet_repo_maps`, `repo_map_section`); `intake_light`, `optional_budget`, `fit_optional`, `optional_index`, `source_index`, `map_section`, `map_index`, `own_map_path`; curated resonance (`curated_resonance`, `tail_resonance`).
- **Seats.** Siblings and fresh panes (`spawn_sibling`*, `prepare_sibling_dir`, `spawn_fresh`*), rooms (`new_room`*, `room_brief`), the sandboxed body (`spawn_body`*), the housed seats (`spawn_main`*, `spawn_librarian`*, `spawn_third_place`*, `main_intake`, `librarian_intake`, `third_place_intake`, `librarian_shelf`, `librarian_shelf_light_at` with the newest entries of a note over the cap (`newest_entries`, `NEWEST_NOTE_RESERVE`, within `NOTES_WITH_TAIL_CAP` together with the window) and the pinned letter (`LIBRARIAN_PINNED`, `PINNED_CAP`), `handback_index`), the single-instance guard (`claim_single_instance`).
- **Pane identity and persistence.** Letters (`pane_letter`, `read_letters`, `seat_role_for_letter`), kept panes (`read_kept`, `write_kept`, `set_pane_kept`*, `list_kept_panes`*), names and roles (`set_pane_name`*, `set_pane_role`*), resume (`resume_pane`*, `plan_resume`, `warm_resume_brief`), scrollback (`pane_scrollback`*, `scrollback_tail`).
- **The committee and the chain.** `committee_form`*, `chain_state`*, `chain_state_from`, `chain_holders`; the dyad (`set_spot_pair`*, `dyad_spot`*, `resolve_pane`, `match_prefix`).
- **The Scribe.** `scribe_distill`*, `run_distill`, `parse_atoms`, `set_auto_distill`*.
- **Pane exits.** `on_pane_exit`, `reopen_seat`, `exit_gate_for`, `pane_exits`.
- **Delivery.** The ready stamp (`harvest_once`, `write_harvest_stamp`, `read_stamp`, `gate_stamp`, `pane_gate`), the screen reads (`composer_state`, `input_box_empty`, `turn_in_flight`, `pane_state`), the queue (`struct Inbox`, `gate_or_queue`, `drain_decision`, `drain_inboxes`, `withdraw_directive`), the write (`inject_to_pane`, `deliver`, `deliver_pull`, `delivery_receipt`, `await_render`), the pull gate (`gate_decide`*).
- **The address table and the chair's verbs.** `address_row`, `chair_target_guard`; `chair_inject_exec`, `chair_decide_exec`, `chair_scrollback_exec`, `chair_status_exec`, `librarian_call_exec`, `pane_call_librarian_exec`, `third_place_call_librarian_exec`; channels and breaker (`open_channel`*, `close_channel`*, `set_breaker_ceiling`*, `reset_breaker`*).
- **Keep-warm and the visit.** `keep_warm_tick`, `keep_warm_decision` (its threshold `keep_warm_after`, 45 min plus a 0..=6 min seat offset since Lap W, so every ping is sent before minute 54; activation `activated_by_use`, a turn a request answered, so a typed slash command is not use), `keep_warm_send`, `keep_warm_row`; `visit_text`, `visit_reply_from`, `keep_warm_harvest`.
- **Compact warm seats** (L212; named "Close for the night" until L218). `CloseSmallState`, `close_small_list`, `close_small_plan`*, `close_small_confirm`*, `close_small_run`, `close_small_send`, `close_small_tail`, `close_small_wait`, `close_small_cut_seat`, `compact_and_confirm` (the one `/compact` send, shared with L218), `close_small_ledger`, and L221's `close_small_note`, `close_small_read_progress`, `close_small_progress`*, `close_small_interrupted_at_launch`, `CLOSE_SMALL_IN_FLIGHT`; its wiring rows are `close_small_wiring_tests`.
- **The cut at a hand-back, and before a dispatch** (L218). `CUT_TURN_WAIT`, `cut_listing`, `cut_listing_refusals_at_launch`, `cut_at_handback_after_ring`, `cut_before_dispatch`; rows `cut_at_handback_wiring_tests`.
- **Launch.** `sync_at_launch`, `run_state_pull`, `machine_identity`, `launch_effects`, `start_exit_waiter`, `start_jev_shadow`, `leave_cleanup_at_launch`.
- **The stick.** `stick_state`*, `stick_rehearse`*, `stick_start_applier`*, `stick_release`*, `stick_ack_result`*, `stick_close_app`*, `checked_stick_folder`.
- **Leave and close.** `leave_close_requested`, `close_route`, `close_needs_confirm`, `leave_confirmed`*, `leave_run`, `run_publish`; the OS ending the session (`block_shutdown`, `watch_session_end`); keep-awake (`keep_awake_thread`); `leave_exit`*.
- **Audio commands** (the listening tab's front door). `audio_sources`*, `audio_status`*, `audio_start`*, `audio_snapshot`*, `audio_stop`*.
- **Clipboard.** `clipboard_read`*, `clipboard_write`*.
- **`fn main()`.** Priority, the launch steps, the threads (drain, keep-warm, the MCP server and the others), then `.invoke_handler` with the 51 commands.

## `mcp.rs`, by area

- **The server and its tools.** `struct ConsonanceMcp`, `impl ConsonanceMcp` (the `#[tool]` methods: `chair_inject`, `call_chair`, `call_librarian`, `chair_phase`, `chair_decide`, `chair_scrollback`, `chair_status`, `raise_pull`, `post_board`, `read_board`), `impl ServerHandler` (`get_info`), `start`.
- **Auth.** `auth_chair` (token), `auth_librarian` and `auth_address` (mount), `auth_station`, `required_station`, `station_allows`, `seat`.
- **Refusals.** `refused_attempt_row`, `refused_address_row`, `refusal_should_post`, `points_into_private`.
- **The return-leg trap** (a hand-back is owed before the next ring). `marks`, `mark_rung`, `mark_owed`, `mark_stands`, `owed_refusal_text`, `handback_refusal_text`, `move_baton_cmd`.
- **The seal gate.** `parse_seal_blocks`, `seal_gate`, `seal_gate_at`, `seal_refusal`, `seal_recovery_push`, `run_git_for_seal`.
- **The digest gate** (a pointer's digest is computed at ring, never trusted from the text). `pointers_in`, `strip_supplied_digests`, `digest_gate`, `digest_gate_at`.
- **The NEXT-trailer gate.** `gates_mode`, `trailer_gate` (the rule itself is `trailer.rs`).

## `sync_launch.rs`, by area

- **The launch verdict.** `decide`, `seam_line`.
- **Retiring a machine's past.** `retire_plan`, `apply_retire`, `attic_for`, `read_carried`.
- **Promotion and adoption.** `read_completion`, `promotion_open`, `read_adopted`, `write_adopted`, `read_live_host`.
- **The stick: arriving.** `layout_at`, `find_stick`, `arrive`, `await_handshake`, `offer_for`, `record_keep`, `rehearsal_is_quiet`, `keep_awake_work`, `kill_replaced`.
- **The stick: leaving.** `await_seats`, `enter_flight`, `await_flights`, `run_leave`, `write_leave_result`, `leave_cleanup`.

## `cochlea.rs`, by area

Free functions for the signal (`fft`, `hann`, `spectrum`, `peaks`), pitch and harmony (`cents`, `note_name`, `pitch_class`, `chord`,
`just_rank`, `interval`, `harmonic_of`, `voices`), level and time (`rms_db`, `trend`, `pulse_phasor`, `pulse_period`, `steadiness`,
`pulse_fold`, `pitch_track`, `modulation_energy`), and `replay`; most of the file's remaining functions are methods on its types and its tests.

## What this file cannot tell you

**Why** a thing is built the way it is. The code's comments name the lap that made it (`D143`, `L052`, `P-ADDRESS`…) and often
the hand-back, but the reasons, the rulings and the measurements behind them live in the lighthouse repo:
`exo_memory/handback/` (search the id), `exo_memory/loop/` (the plans and packets), and `consonance/src-tauri/brief/BUILDING.md`
and `COMMITTEE.md` (the rules the gates enforce). Start there when a check looks stricter than it needs to be: most of them are
the answer to a specific failure, and the comment above the function usually names it.

## Beside this folder, not part of the app

- `consonance/tools/landing-train.js` (L194): the landing train for dreamzone-3. Panes mark branches READY; it merges them in
  its own worktree, checks the batch under the exclusive hold and the memory gate, scans (credentials and privacy, failing
  closed), fast-forwards and pushes main, and promotes the checked build into his checkout when no game runs. A check that
  exits 3 with the world self-test's machine-bound summary is read again once, in the same hold, by the config's `reread`
  command, and a green second reading lands with both readings kept (D675). Its rows are
  `landing-train.test.js`, each seen red by `landing-train.mutants.js`. dreamzone-3's check and game guard are
  `landing-train-dz3-check.cmd` and `landing-train-dz3-guard.cmd`, and the config lives in the data folder
  (`landing-train.config.dreamzone-3.json`). A Node tool, not part of the app.

- `consonance/tools/t180-rebuilder/`: the T-180 Rebuilder's source (`Rebuilder.cs`, the `rebuilder.ico` it compiles with, and a
  `README.md`). It is the launcher his desktop shortcut runs on each machine. It pulls the track builder, rebuilds and reinstalls it
  when main moved, and since L147 points the shortcut back at itself after it installs. It is compiled with the .NET Framework's
  `csc` and installed to `%LOCALAPPDATA%\T-180 Rebuilder` (the README says how).

- `consonance/tools/usage-ledger.js` and `usage-ledger.test.js` (L213), with the writer `consonance/hooks/usage-ledger.js`: the usage ledger.
  The writer is one file registered twice (the status line, and a SessionStart hook): it appends one row per turn per seat of numbers only
  (the 7-day figure, cache fields, token classes) and one wake row per start to `<data>/usage-ledger.jsonl`; the reader prints, per seat,
  how far the account's 7-day figure moved on that seat's turns; with `--transcripts` (L225 A2) it also counts, per seat, the model calls from the seat's transcript and how many only wait (`isWaitCommand`, `countCalls`, `callsBySeat`; the rule is written above `isWaitCommand`). Registration is `dev/shell/install.ps1` (a `$files` row, a `$register` row
  and the status line block); a Node tool and hook, not part of the app.

- `consonance/hooks/model-switch-note.js` (L214, A): a `PreModelSwitch` hook that warns how many tokens a switch will rewrite in a warm seat
  (never blocks) and writes one numbers-only row per switch to `<data>/model-switch.jsonl`. `dev/shell/agents/room-reader.md` (L214): a
  read-only agent that does not carry the room's intake (`omitClaudeMd`, `effort: low`), installed by `install.ps1` to its second
  destination, `~/.claude/agents/` (the `$agentFiles` table, kept out of `$files`), which also sets `CLAUDE_CODE_SUBAGENT_EFFORT=medium` in the
  settings' `env` where unset; an agent's own `effort` wins over that variable. `consonance/tools/agent-first-call.js` measures an agent's
  first-call tokens with and without the intake.
