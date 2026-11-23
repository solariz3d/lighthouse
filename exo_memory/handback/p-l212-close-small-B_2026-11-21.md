# p-l212-close-small-B: "Close for the night", built and read; not landed (a second reader first)

Packet: `exo_memory/loop/packet_l212_close_small_B_2026-11-21.md` (blob 6ec887c2; its addendum, blob ee1a1545, `:67-70`), via
`[chair:MAIN]` 06:26:35Z and the addendum's message of 06:31:11Z. His words, 2026-11-21 00:23: "we could make our own wiring for
auto compacts at close". Machine: L. Long output is in my scratchpad under `l212/`.

## WHERE IT STOPS (L, 06:5xZ)

- **Built on a branch:** lighthouse `l212-close-small` **8e2f9715** (on room main c3e85ae6), pushed by its literal name.
  **NOT landed, NOT installed, the app NOT rebuilt.** The packet: a second reader who is not me reads the diff first.
- **R1:** answered from source. Its live part is **not shown**: the probe ran four times and never got a written `/compact` into a
  scratch claude (section 1c).
- **R2, R3 and R5:** done (below).
- **R4:** owed after his first real close. **Step 5 (live):** owed after the landing and a restart.
- **One red in the app's suite is not this branch's:** the librarian's worst-case intake row (section 6).
- **Nothing running:** no lock held. The probe's processes are gone (`tasklist`: 7 `claude.exe`, the seven seats).
- **For the second reader** (section 7): the diff `c3e85ae6..8e2f9715`, 9 files.

## 1. R1: the probe's three answers (read at base c3e85ae6; file:line)

**a. Can the app make a seat run `/compact` by writing to its terminal?**
- **The write path exists and is the one every ring uses:**
  - `main.rs:12787` `gate_or_queue` queues behind a turn or the keeper's typing, and refuses an exited child;
  - `main.rs:13114` `inject_to_pane` writes through `main.rs:13233` `deliver`: a bracketed paste, a pause scaled to the payload, a
    lone `\r` as a separate write, then a read of the composer;
  - keep-warm sends exactly this way (`main.rs:14270` `keep_warm_send`).
- **The submit check cannot confirm a slash command.**
  - Claude Code draws `/…` in Rgb(177,185,249), and `composer_state` reads non-default text as EMPTY (`main.rs:12196-12223`,
    pinned by `a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`).
  - So an Enter eaten on `/compact` would be reported as "submitted".
  - The close therefore confirms only from the transcript's own `compact_boundary` record
    (`{"type":"system","subtype":"compact_boundary",...,"compactMetadata":{"trigger","preTokens","postTokens",...}}`; shape read
    from a real record in this seat's transcript).
- **c. The live try: NOT SHOWN.** `bin/compact_probe.rs` runs a throwaway claude on haiku, writes deliver()'s bytes and reads that
  session's transcript.
  - Runs 1-2 (06:40, 06:42Z): stopped at first-run dialogs (the bypass-permissions warning, then a new folder's trust question),
    both answered "no" by a blind Enter.
  - Runs 3-4 (06:45, 06:47Z), in a trusted empty folder (`instances\fresh-cc74c4a8`, unused since August, not a kept pane): the
    TUI drew its composer and took no input. checked: no transcript was written at all.
  - inferred, not checked: the TUI waits on terminal queries (cursor position, device attributes) that the app's terminal answers
    and a bare PTY does not.
  - Logs: `scratchpad/l212/probe{,2,3,4}.log`.
  - **Not tried on myself or on another seat:** the app cannot write into this pane from this pane, and `chair_inject` puts its
    NEXT-trailer gate (strict on L) on any bare `/compact`.
  - **So whether a pasted `/compact` runs as a command is open.** If it does not, the close says so per seat: "NOT CONFIRMED:
    /compact was sent and no compaction was recorded within 15 min". Nothing is claimed cut.

**b. How the app knows each seat's last call and context.** `main.rs:13872` `last_request`, over the transcript the tailer binds
(`main.rs:13802` `PaneTranscripts`):
- the last non-sidechain run of `assistant` lines sharing a `requestId`;
- it STARTED at the line before that run;
- its context is input + cache read + cache creation.

It is the same reader `keep_warm_tick` uses (`main.rs:14172`). The body hook's "context … to resend" is its own reading of the
transcript. `close-small.js` ports `last_request` line for line, and its rows pin the port (section 2).

**c. What each seat's summary is told to keep today** (`consonance/hooks/precompact-preserve.js`, registered on L under
PreCompact; NOT changed in this lap). `instruction()` at `:126-135` builds it:
- **Every seat:** the verification classes (file and instrument names, shas, structured numbers, registered predictions and
  falsifiers, with their measured survival) and item 6 (the user's corrections and agreements).
- **The Third Place only:** "What is alive for them right now" first (`ALIVE` `:96-102`, `isThirdPlaceCwd` `:89`).
- **The librarian only:** "Room side, with paths" first (`ROOM` `:111-123`, `isLibrarianCwd` `:110`).
- **The panes and the chair:** the general directive only.
- **What the close adds:** before the cut, each seat writes where it stands in its own words, so the state is on disk whatever the
  summary keeps.

**The addendum's question: does the resume hook give the re-cache cost? Yes, read from the installed Claude Code 2.1.330.**
- On a resume, the SessionStart hook input gains `seconds_since_last_response`, `context_tokens`, `prompt_cache_likely_expired`
  and `estimated_cache_write_usd`.
- Where: the function building it (`ngs` in the bundled `claude.exe`) returns
  `{seconds_since_last_response, context_tokens, prompt_cache_likely_expired, estimated_cache_write_usd}`, spread into the input
  that `hook_event_name:"SessionStart"` is built from.
- **It is known only AT THE WAKE.** So it cannot choose the close's list. It is the natural instrument for R4: the body hook could
  log it.
- The status line's `prompt_cache` object also carries `recache_tokens_if_cold`.
- **What the addendum changed in what I built: nothing.** The keep-warm timing is untouched (`KEEP_WARM_AFTER`, 45 min). The close
  is the invited cut at a session's end, which keep-warm prevents during it.

## 2. R2: the rule, red first

`consonance/tools/close-small.test.js`, 11 rows:
- **R2's three:** a cold seat is skipped however large; a small seat is skipped however warm; a warm large seat is cut.
- **The edges:** exactly 50 min is cold, and exactly 300k is small.
- **The rest:** the dials, no transcript or no call, the reader (start, context, sidechain, a torn line), the seat list on a
  fixture data folder, and the command line touching nothing.

Results:
- **Red first:** the rows ran before the tool existed and failed ("Cannot find module './close-small.js'").
- **Green:** 11 of 11.
- **Hand mutants: 3 applied, 3 caught.** Removing the cold check failed 4 rows; `<=` at 50 min failed 1; `>=` at 300k failed 1.

## 3. R3: the dry run on L tonight (`node consonance/tools/close-small.js --dry-run`, 06:30:01Z; `scratchpad/l212/r3-dryrun.txt`)

```
  skip  A            last call 9646 min ago, context 267k: cold
  CUT   B            last call 0 min ago, context 554k: warm (0 min) and large (554k)
  skip  C            last call 11104 min ago, context 750k: cold
  skip  E            last call 11104 min ago, context 482k: cold
  CUT   main         last call 3 min ago, context 406k: warm (3 min) and large (406k)
  CUT   librarian    last call 0 min ago, context 593k: warm (0 min) and large (593k)
  CUT   third-place  last call 0 min ago, context 614k: warm (0 min) and large (614k)
4 of 7 seats would be cut; nothing was cut (this is a dry run, and this file never cuts).
```

- **checked by hand:** A's age. 2026-11-14 13:44Z to 06:30Z tonight is 9,646 min.
- **The run took 0.14 s.** Each transcript is read from its last 4 MB, widened only when needed.

## 4. R5: no path cuts a seat without the click (rows, not reading)

**The behaviour rows** (`close_small.rs` tests, all green): with no list shown nothing is cut; a click for another list (or no
token) cuts nothing; a list over 10 minutes old cuts nothing; only seats on the shown list AND still warm and large are cut. A seat
that went cold since he looked is dropped and named, and a seat that became large is never added.

**The wiring rows** (`close_small_wiring_tests`, all green):
- **One caller each:** `close_small_cut_seat` is called only from `close_small_run`, and that only from `close_small_confirm`.
- **The order:** the click TAKES the shown list (one use), checks it, then starts.
- **One send site:** `/compact` is sent from exactly one place.
- **No other way in:** no MCP verb (`mcp.rs`), and not keep-warm.
- **What the UI calls:** both commands are in the handler list, and showing the list never cuts.

## 5. What was built (`c3e85ae6..8e2f9715`, 9 files, 882 insertions)

- **`consonance/tools/close-small.js`:** the list and the rule (dials `--warm-min` 50, `--big` 300000). It never cuts. The app asks
  it for `--json`, so the rule lives in one place.
- **`consonance/src-tauri/src/close_small.rs`:** the pure half: `confirm`, `cut_panes`, `compacted_since`, `ASK`, `COMPACT`,
  `PLAN_TTL`.
- **`main.rs`:** `close_small_plan` (shows, keeps the list and a token), `close_small_confirm` (his click), `close_small_run`, and
  `close_small_cut_seat`. Per seat:
  1. it sends `ASK` (queued behind a turn, as keep-warm is);
  2. it waits up to 20 min for a request after the ask and the pane's Stop stamp saying ready;
  3. it sends `/compact`;
  4. it waits up to 15 min for a `compact_boundary` after the send;
  5. it reports "cut … N k tokens left", "NOT cut: …" or "NOT CONFIRMED: …" on the board (`chair_audit`), in
     `<data>/close-small.jsonl` and on the `close-small` event.
- **`ui/close-small.js`, `index.html`, `app.css`:** the toolbar's "☾ Close for the night" opens a full-window list (every seat, its
  last call, its context, CUT or skip and why) with "Cut these N seats" and "Cancel"; then a line for each seat as it is done.
- **`MAP.md`:** the lines for all of the above, and the command count 48 → 50.
- **`bin/compact_probe.rs`:** R1's live check, with its status (section 1c).

**Checks:**
- **App bin suite:** 1,227 passed, 1 failed (section 6), 7 ignored, in 259 s.
- **My rows:** all 9 Rust rows, the 11 JS rows, and the UI's 12 test files, `scripts-load` included (the new script declares
  nothing at top level).
- **portable-paths:** green, 442 files in scope (the 4 new files included), 0 new sites. My first draft had a disguised `C:` path
  default, replaced by the app's own rule (`default_instances`).

## 6. The one red, not this branch's

`intake_light_tests::light_the_librarian_worst_case_intake_is_under_145_000` reads **147,621 B** (shelf 86,834 B, head 60,432 B;
149,799 B with the letter at its cap) against 145,000.
- checked: the same row with MAP.md put back to the base reads the same 147,621 B. It reads the live room's shelf, not this diff.
- I registered that row in Lap W (`p-lapw-r-B_2026-11-13.md`, its worst case), and named that it grows byte for byte with BOOT and
  the brief. It has. Its ruling is owed, and it is not in this lap.

## 7. For the second reader (the packet: a seat that is not me reads the diff before it lands)

1. **The click's check:** `close_small.rs` `confirm`, and `close_small_confirm`'s order (take, check, start).
2. **The wait for the ask's turn:** `close_small_cut_seat` step 2.
   - It needs a request started after the ask AND the pane's Stop stamp saying Ready.
   - A queued ask starts later; that is fine.
   - A seat whose Stop hook is missing never reads Ready, so it ends "NOT cut" after 20 min. Is that the right failure?
3. **`close_small_send`:** it reads "queued" from `gate_or_queue`'s text (`starts_with("queued")`); anything else is a refusal.
4. **The tool's seat list:** `panes.json` plus the three fixed seats, with transcripts at `<projects>/<folder as dashes>/<sid>.jsonl`.
   Is any live seat missing on a machine with more kept panes?
5. **R1's open live question:** whether the cut should land before it is shown.
6. **The ask's wording** (`close_small::ASK`).

## Could be wrong

- **That a pasted `/compact` runs as a command:** not shown (section 1c).
- **That the app's own terminal answers the queries a bare PTY did not:** inferred.
- **That waiting for Ready is enough to know the ask's turn ended:** inferred from the stamp's design (`PaneGate::Ready`, the Stop
  hook). Not exercised live, because the app was not rebuilt.
