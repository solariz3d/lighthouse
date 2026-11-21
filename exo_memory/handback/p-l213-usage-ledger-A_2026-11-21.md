# p-l213-usage-ledger-A: what the harness hands over, a ledger that records it, and a reader that says which seat moved the 7-day figure

Pane A, machine L, ledger L213, packet `loop/packet_l213_usage_ledger_A_2026-11-21.md` (read whole). Written 2026-11-21 ~00:55 local. Marked `checked:` (command or file) or `inferred:`. Evidence: `p-l213-usage-ledger-A_2026-11-21_evidence/`.

## The result in six lines
1. **R1, the probe: all three exist, with one difference.** `rate_limits` is there but carries only **`seven_day`** on this account (no `five_hour`, seen on two turns); `prompt_cache` is there in full; the resume hook's staleness and re-cache cost are there. Details below.
2. **The ledger writer, the reader and their rows are built and green:** 11 of 11 rows, mutants applied 9 / caught 9 / NOT APPLIED 0. Real end to end with the INSTALLED copy of the hook writing to a scratch folder: one wake row and one turn row, then a resume wake row.
3. **NOT live yet: nothing is registered.** `settings.json` carries no status line (nothing to displace) and the SessionStart hook is not added. The diff for `dev/shell/install.ps1` is in the evidence folder for pane B to read; the registration is one bare run after that.
4. **R3 is NOT MET** (one working hour of real rows on L): the ledger cannot have a working hour before it is registered. It follows the install.
5. **The registered failure line stands open:** the ledger cannot yet say which seat moved the figure, for want of one night of rows.
6. **A correction to the packet:** it says this seat already runs Sonnet. It did not (his message, and the turn's own banner at its start read Opus 5.5). The ledger writes the harness's own model id per turn, so a seat's model will not need anyone's word again.

## R1: the probe (keys and numbers only; nothing from a transcript, no account, no folder)
`claude --version` → 2.1.330 (checked). Method: a probe script (`probe_keys.js`) registered through a scoped `--settings` file (never the user's), which writes each stdin object with every string replaced by its length. Raw: `probe_keys.jsonl` (12 rows).

| what | verdict | what it carries (keys) |
|---|---|---|
| **status line input** (`settings.statusLine`) | **seen** | `session_id, transcript_path, cwd, scratchpad_dir, prompt_id, effort{level}, session_name, model{id,display_name}, workspace, version, output_style, cost{total_cost_usd,total_duration_ms,total_api_duration_ms,total_lines_added,total_lines_removed}, context_window{total_input_tokens,total_output_tokens,context_window_size,current_usage{input_tokens,output_tokens,cache_creation_input_tokens,cache_read_input_tokens},used_percentage,remaining_percentage}, exceeds_200k_tokens, fast_mode, thinking{enabled}`, and, after the first response, **`prompt_cache` and `rate_limits`** |
| **`rate_limits`** | **seen, seven_day only** | `rate_limits{seven_day{used_percentage, resets_at}}`: a whole percent (it read 2) and an epoch reset time. **`five_hour` absent** on two turns on this account; whether it appears for another plan or window state is unknown. |
| **`prompt_cache`** | **seen** | `warm, caching_observed, ttl, expires_at, requests, misses, expected_rebuilds, hit_ratio, cache_write_tokens, miss_recache_tokens, last_miss_at, last_miss_cause, miss_causes{}, recache_tokens_if_cold` |
| **SessionStart on a resume** | **seen** | beyond the start fields (`session_id, transcript_path, cwd, hook_event_name, source` and, interactive, `scratchpad_dir, model`): **`seconds_since_last_response, context_tokens, prompt_cache_likely_expired, estimated_cache_write_usd`**. A new session (`source: startup`) has none of the four. |
| Stop hook input (for the record) | seen | `session_id, transcript_path, cwd, prompt_id, permission_mode, effort{level}, hook_event_name, stop_hook_active, last_assistant_message, background_tasks, session_crons`: **no usage, no rate_limits**, so a Stop hook cannot be the ledger. |

Notes that matter: **the status line is not called in `-p` (print) mode** (only the hooks fired; checked), and it needs an interactive session in a folder the harness has trusted (an untrusted folder wrote no rows). It fires several times a turn (three rows with identical numbers), so the writer dedupes on (prompt id, cache requests, output tokens). **The 7-day figure is one number for the account in whole percent, reported with each turn**, so it moves in steps of at least 1 and is the same number whichever seat reads it. The resume cost, checked once on a haiku session: 27,395 tokens and $0.0055, i.e. `context_tokens` times that model's cache-write price ($0.20 per million), `inferred:` for other models.

## R2, red first, and the mutants
`node consonance/tools/usage-ledger.test.js` → **11 tests, 11 pass** (`test_run.txt`). Red first was shown only as absence (the module did not exist: `Cannot find module './usage-ledger.js'`), which is weaker than a stub; the mutants are the stronger evidence: **applied 9 / caught 9 / NOT APPLIED 0** on the real source (`mutants_run.txt`, `mut.js`). The first run caught 7 of 9 and I added two rows for the survivors (a higher figure under a new reset time counts as no movement; a non-SessionStart hook payload that carries status fields writes nothing), then 9 of 9.
- **R2's row:** two ledger lines (seat aaaaaaaa at 2%, then bbbbbbbb at 5%) → the reader prints `+3` against bbbbbbbb and `+0` against aaaaaaaa, biggest first.
- **The rule and its limit** (in the reader's header): a turn row whose figure is above the row before it carries the difference, whichever seat wrote that earlier row; a drop or a new reset time counts as no movement. With two seats working at once a step lands on whichever reports it first, and a step is at least one whole percent: **read it as a tally over hours, never as one turn's cost.** `inferred:` that this attribution is good enough to name the heaviest seat over a night; it is not checked on real rows because there are none.

## R4: no free text in a row
Every string in a row is a seat id (8), a session id (8), a model id, an effort word or a source word; the row `R4 no text field of a row is longer than a model id` checks every field is at most 40 characters, has no path separator, and that neither a folder name nor a session name from the payload appears (checked, in the 11). The real rows in `real_rows_haiku_scratch.jsonl` read: `{"v":1,...,"kind":"turn","seat":"deadbeef","session":"aaad7119","model":"claude-haiku-5-5","effort":"medium","seven_day_pct":2,...}` and no text beyond those. **Not yet checked on a ledger of real seats** (none exists).

## What I built (and where)
- `consonance/hooks/usage-ledger.js`: one file, two registrations, told apart by what is on stdin. Turn rows from the status line; wake rows from SessionStart (`startup`, `resume`, `compact`, `clear`). Writes `<data>/usage-ledger.jsonl` (`C:\Consonance\data`, from `~/.consonance.json`'s `data_dir` as the other hooks do). Never blocks, always exits 0, prints one short line for the status line (`7d 2% · cache warm`). Seat = the first 8 characters of `CONSONANCE_PANE`.
- `consonance/tools/usage-ledger.js`: the reader, `node consonance/tools/usage-ledger.js --since <ISO> [--file f] [--json]`; per seat: moved, turns, tokens in/out/cache_create/cache_read, wakes, cold-wake tokens, models; the pane letter from `letters.json`. Reader run on the scratch rows: `reader_on_scratch_rows.txt`.
- `consonance/tools/usage-ledger.test.js`: the 11 rows.
- `dev/shell/install.ps1` (+37/-1, `install.ps1.diff`): a `$files` row, a `$register` row (SessionStart), a status line block after the hook loop (sets `statusLine` **only when absent**, re-points one that already names the file, **leaves another status line alone and says so**), a `-Check` line for it (absent or someone else's is red) and one line in `-NoRegister`. The installer's own tests: `install-manifest` 5/5, `install-holds` 7/7, `install-fresh-home` 3/3 (checked).
- **One side effect to say:** `install.ps1 -NoRegister` copies the files ("files only"), so `~/.claude/shell/usage-ledger.js` is now installed on L. It is inert until registered (checked: `-Check` reads `statusLine: ABSENT`, and `settings.json` was not written by that run).

## Registration (step 5), and who reads what
- **Is a status line configured here: no.** checked: `settings.json` has no `statusLine` key and no `settings.local.json` under `C:\Consonance\instances\` or in `~\.claude\` names one. **Nothing would be displaced.**
- **What one bare run of `dev/shell/install.ps1` adds:** `statusLine` pointing at the installed `usage-ledger.js` and one `SessionStart` hook for the same file (`-NoRegister` prints exactly those two lines: checked). A bare run also syncs whatever else `-Check` reports drifted or absent on L, **so run it with `-Only usage-ledger.js` to touch nothing else** (checked: `install.ps1 -Only usage-ledger.js -NoRegister` lists only the SessionStart line and the statusLine line).
- **Pane B reads `install.ps1.diff` before it is installed** (packet step 5; the standing rule is a second reader for hooks and settings). Ring route: the librarian carries it, I cannot address B.
- **Cost of running it, `inferred:`:** the status line starts one `node` process per refresh per interactive seat (a small script, no network); a seat would show `7d N% · cache warm` in its status line.

## Step 4: wake cost against the hand count
The resume hook does give a re-cache cost (R1), and the writer records it at each wake. **The comparison with the 529k tokens written at the 06:05Z wake cannot be made tonight:** that wake happened before the hook was registered, so no wake row exists for it. `inferred:` what to compare after the install: `context_tokens` on a cold resume against the cache-write tokens the librarian's seat_cost script counts for the same seat and wake. This seat's own resume banner read 267k to resend (the body line), a different number from 529k (what was written then); I did not reconcile them.

## Not done, and why
R3 (one working hour of real rows); the ledger on real seats; the comparison above; the reader's attribution on real data. All wait for the install and an hour. Nothing in a model, an effort level, a compaction window or keep-warm timing was touched (not in this lap).

## Where it stops
Committed on lighthouse main by named paths (`consonance/hooks/usage-ledger.js`, `consonance/tools/usage-ledger.js`, `consonance/tools/usage-ledger.test.js`, `dev/shell/install.ps1`, this file and its evidence folder, my map line). Scratch on L: `scratchpad\l213\` (probe, scoped settings, a scratch data folder). Nothing is running. The Third Place's modified note is untouched.

## Next
NEXT: pane B read `p-l213-usage-ledger-A_2026-11-21_evidence/install.ps1.diff`, then the keeper or the chair run `pwsh dev/shell/install.ps1 -Only usage-ledger.js` on L when B has said it reads clean; after one working hour, A runs `node consonance/tools/usage-ledger.js --since <that hour>` for R3.
