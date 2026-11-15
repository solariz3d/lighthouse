# p-l207-l-owed-steps-B: the L206 notes landed and pushed, then L's owed steps (L207)

Packet: `[chair:MAIN]` 2026-11-14 07:06:18Z, "LAND YOUR L206 NOTES AND PUSH THE ROOM REPO, THEN L's OWED STEPS, IN ORDER". Tier:
check it. Machine: L. Long output is in my scratchpad under `l207/`; this file carries counts and paths.

## WHERE IT STOPS (L, 07:1xZ)

- **A, landed and pushed:** lighthouse main **fbe5a151**, read back from the remote. The worktree `Downloads\lh-wt-l206` is
  removed.
- **Steps 2, 3, 7 and 8:** done (below).
- **Step 4:** one entry synced, `delete-gate.js` (K7). Every other entry is **held, each with the ruling it waits on** (table in
  section 4). One question for the chair decides most of them:
  - K7 says its two calls go "into tonight's handoff with section 4 of the spec, for a seat on L to run"
    (`loop/plan_room_stretch_2026-11-13.md:171-172`).
  - Does that rule section 4's step 6 bullet 2 ("the other registered DRIFT entries `landed-live.js` lists as OWED")
    for L? That is 7 file-only syncs.
  - Your packet read K7 alone as ruled, so I held them.
- **Nothing running, nothing left open:**
  - the head-watch task runs as it did (step 7);
  - no lock;
  - this file's branch `l207-l-owed-steps` is pushed by its literal name.
- **Next, if the chair rules yes:** one `-NoRegister -Only` per OWED entry, the command `landed-live.js` prints for each (section 4).
  Each with the settings parsed before and after, and a bare `-Check` after.

## A. The landing

- **Before:** main 5fb7a5a5, clean, 5 ahead of origin's cbab21eb (the librarian's 5 notes).
  - checked: `git diff --stat main...l206-game-current` gave 2 files and 188 insertions, both under `exo_memory/`.
- **Merge:** `git merge --no-ff l206-game-current` (83d06d44) gave **fbe5a151**. Notes only, so no suite.
- **Scans over the push range** (`origin/main..main`, 7 commits, 275 added lines), before the push:
  - `gatescan.js`: decision allow, 0 found.
  - My privacy grep: 7 hits in messages, all the Co-Authored-By attribution line (a no-reply address).
  - 1 hit in added lines: a user-folder path in the librarian's note in 5fb7a5a5, quoting my L206 ring. Not a key, an email or
    a private folder. 332 files on origin/main already carry that path. Not mine to edit, so pushed as it was. My own two files
    carry 0.
- **Push:** `git push origin main`, one command, the literal name. `cbab21eb..fbe5a151 main -> main`.
- **The gate's row** (`C:\Consonance\data\push-gate.jsonl`, the last row): `t` 2026-11-14T07:07:04.965Z, `seat` 12fb81f6 (this
  session), decision **allow**, scanned `{dir: C:\Consonance\lighthouse, remote: origin, src: main}`.
- **Read back:** `git ls-remote origin main` → fbe5a151f3bfa132a323d7ad8efc37ef12844e7e, equal to local main.
  `git ls-remote origin 'refs/heads/backup/*'` → 0 lines.
- **The worktree:** `Downloads\lh-wt-l206` removed (`git worktree remove`, after `merge-base --is-ancestor 83d06d44 main`).

## Step 2: two values (`scratchpad/l207_step2.txt`, from `scratchpad/l207_step2.js`)

1. **The shelf's stamp:** all 6 live intakes, built 06:26 at this launch (librarian, main and four `sibling-*`), open with "Built
   2026-11-14 06:2x on L from HEAD **798f73ee**". The other 33 intakes under `instances/` are older and carry no stamp line.
   - **The body line: none on L to compare.** `sessionstart-body.js` was not registered until step 3's 2c, and its ledger
     `C:\Consonance\data\sessionstart-body.jsonl` did not exist.
   - So "the body line and the shelf's stamp name one commit" is **not yet readable**. It is owed at the next seat start after
     2c. That start's body line should name the commit its app was built from.
2. **The old gate strings in the live intakes: 0 in 0 files** (before: 11 in 8). The count is p-lapw-r-B §7's five strings,
   whitespace-normalised, over `C:/Consonance/instances/*/CLAUDE.md`. All 39 intakes read 0, the 6 live ones included.

## Step 8, before 2d: the wake gate on L warns and does not refuse (from the hook's own code)

- **Where the decision is:** `consonance/hooks/wake-gate.js:258` sets `const refuses = machine === 'D'`. At `:261`, a would-be
  deny on any other machine is recorded as `warn`, and the call is allowed.
- **What `machineTag()` (`:59-69`) returns here:** it reads `CONSONANCE_MACHINE`, then `machine_tag` in `~/.consonance.json`,
  then the hostname.
  - checked: `CONSONANCE_MACHINE` is unset in this seat's environment. The app reads it but sets it for no seat
    (`main.rs:15357`, a read).
  - `machine_tag` is `"L"`.
  - `require('…/wake-gate.js').machineTag()` printed `"L"`. The module's `main()` runs only as `require.main`, and no ledger
    row was written.
- So on L the librarian's `call_chair` is never refused by it: **2d and P's sync went ahead.**

## Step 3: the installs, one entry a run

**How each ran:** `node consonance/tools/heavy-run.js --status && powershell -File dev/shell/install.ps1 [-NoRegister] -Only <leaf>`,
from `C:\Consonance\lighthouse` at fbe5a151, clean. The driver is `scratchpad/l207_one.sh`. For each entry it keeps, under
`scratchpad/l207/`:
- `settings-before-*.json` and `settings-after-*.json`;
- `install-*.txt`;
- `semdiff-*.txt` (pane H's `semdiff.js`);
- `row-*.txt`.

**`-Only` takes the LEAF:** "Names match the exact leaf, case-insensitively" (install.ps1:449), and every leaf here is unique in the
manifest. So `hooks\wake-gate.js` was given as `wake-gate.js`; the handoff's path form would have been refused.

**Before 2a:** `~\.claude\settings.json` copied aside to `settings.json.bak-l207-before-20261114T070916Z` (sha256 eb6ca339…,
equal to the original, 5,089 B).

| # | entry | installer said | exit | settings.json, semantically | installed sha256 = main's |
|---|---|---|---|---|---|
| 2a | precompact-preserve.js | synced | 0 | no change (10 → 10 groups; byte-identical) | a9c615063e99 = a9c615063e99 |
| 2b | hooks\precompact.js | synced | 0 | no change (10 → 10) | 6f4945a41612 = 6f4945a41612 |
| 2c | sessionstart-body.js | installed; ADD SessionStart sessionstart-body.js | 0 | **+1 hook** in the existing SessionStart group: `sessionstart-body.js` t=10 (10 → 10) | e91c1c432c4a = e91c1c432c4a |
| 2d | hooks\wake-gate.js | installed; ADD PreToolUse wake-gate.js | 0 | **+1 group**: PreToolUse `[mcp__consonance__call_chair]` `hooks\wake-gate.js` t=10 (10 → 11) | ad68fc9b3ad3 = ad68fc9b3ad3 |
| 2e | hooks\push-gate.js | synced | 0 | no change (11 → 11) | e9bd2ce8b7ab = e9bd2ce8b7ab |
| P1 | `-NoRegister -Only wake-gate.js` | ok; "Files are in sync" | 0 | no change | ad68fc9b3ad3 = ad68fc9b3ad3 |
| P2 | `-NoRegister -Only sessionstart-body.js` | ok; "Files are in sync" | 0 | no change | e91c1c432c4a = e91c1c432c4a |

- **The five against the copy taken before 2a** (`scratchpad/l207/semdiff-five.txt`):
  - 10 hook groups became 11;
  - ADDED (2): the SessionStart group with the body line, and the wake-gate group;
  - REMOVED (1): the same SessionStart group without the body line.
  - Top-level keys that differ: `hooks` only, in two events (SessionStart, PreToolUse).
  - Minified, 3,399 B became 3,736 B: +337 B, the same as on D.
  - **Exactly the two registrations named, no other key changed.**
- **The file's size,** 5,089 B to 13,046 B: the installer re-writes it whole (as on D, `p-install-H-O` "The new settings
  baseline").
- **2a, 2b and 2e installed the same sha256 as D's** (`p-install-H-O:13-17`). 2c and 2d are main's newer copies, which is why P's
  two syncs found them already in sync.
- **Hook groups:** 10 before step 3, 11 after it, and 11 after step 4 (delete-gate.js joined an existing group).

**`landed-live.js --all` beside a bare `-Check`, after step 3:**
- `scratchpad/l207/landed-live-all.txt`: exit 0, "L HEAD fbe5a151: **15/24 live**". Owed 9, new 7, held none; EXCLUDED 3; NOT RUN
  HERE 4.
- `scratchpad/l207/check-after.txt`: exit 1, **13 DRIFT, 8 ABSENT**.
- The bare `-Check` before any install (`scratchpad/l207/check-before.txt`): exit 1, **16 DRIFT, 10 ABSENT**. The handoff's 15
  and 8 are 11-13's numbers; not reconciled entry by entry.
- **L's -Check is not landed-live's verdict** (`p-install-H-O:55-58`): -Check reads bytes. landed-live also reads what is
  registered, what runs and what is excluded. The two agree on every entry above in kind: DRIFT beside OWED, EXCLUDED or NOT RUN
  HERE, and ABSENT beside NEW.

## Step 4: L's own drift, read entry by entry (spec section 4, `00_lap_i_spec.md:582-617`)

**Before any sync:** `landed-live.js --all --explain` showed **0 `LOCAL EDIT`** (`scratchpad/l207/landed-live-explain.txt`),
section 4 step 3's precondition.

| entry | -Check | landed-live | done | the ruling |
|---|---|---|---|---|
| hooks\delete-gate.js | ABSENT | NEW → LIVE | **installed** | K7 yes (`plan_room_stretch:171`) |
| hooks\sources-gate.js | ABSENT | NEW | held | K7 no |
| hooks\reply-slot.js | ABSENT | NEW | held | it requires `./sources-gate.js`, which K7 keeps off L (spec §4 step 6, bullet 4). Not registered on L: 0 hits in settings.json, so nothing fails today |
| hooks\second-reader.js, hooks\second-reader-worker.js | ABSENT | NEW / NOT RUN HERE | held | K1 rules them for D only |
| hooks\second-reader-note.js | ABSENT | NEW | held | K2 is a trial on D only |
| hooks\ask-ending.js, hooks\release-chime.js | ABSENT | NEW | held | no ruling names them for L (they appear only as D's rows in I6, `00_lap_i_spec.md:383-384`) |
| blind.js, board-digest.js | DRIFT | OWED | held | **held as yesterday** (the chair, 2026-11-13 10:36:52Z). Spec §4 step 6 bullet 1 names them for L together, "on the librarian's word: the 11-13 hold was 'for this run'". Whether that is the later ruling is the chair's call. Installing them also turns on the sealed window on L for the first time (`p-l198-403-stall-B` §2c) |
| hooks\session-start.js, hooks\session-end.js, userprompt_pulse.py, ferry-watch.js, sourced-stop.js, findings-return.js, sessionstart-state.js | DRIFT | OWED | held | waits on the question in WHERE IT STOPS: spec §4 step 6 bullet 2 lists them; K7 rules only delete-gate.js and sources-gate.js by name. For ferry-watch.js, the E3 ruling (`plan_room_stretch:210-211`) is about wiring it, not about syncing its file |
| hooks\stop.js, hooks\l2-overseer.js, hooks\l3-overseer.js | DRIFT | EXCLUDED | held | the keeper, 2026-09-06 06:55, "ready pair only" (`librarian/2026-09-06.md:603`) |
| hooks\userprompt-submit.js | DRIFT | NOT RUN HERE | held | nothing on L runs it, and no ruling names it |

**delete-gate.js:**
- **The installer:** "installed hooks\delete-gate.js; ADD PreToolUse delete-gate.js", exit 0.
- **The settings:** +1 hook in the existing PreToolUse `[Bash|PowerShell]` group, beside push-gate.js (11 → 11 groups).
- **The installed copy:** sha256 8b304532b962, equal to main's.
- **Seen live with no restart:** a plain Bash `rm -r` of a scratch folder with no links in it, 21 s after the install, wrote its
  row. `C:\Consonance\data\delete-gate.jsonl`, 07:12:10.201Z, this session, decision allow, how `rm -r`.

**After step 4:**
- `scratchpad/l207/landed-live-all-final.txt`: exit 0, **16/25 live**.
- `scratchpad/l207/check-final.txt`: exit 1, **13 DRIFT, 7 ABSENT**.
- Standing and untouched: 1 PATH-MISMATCH (`ambient.js` at the shell root; the manifest's `lib\ambient.js` reads ok) and 7
  UNCLAIMED.

## Step 7

The head-watch task runs on L: **pid 41756**, node.exe, started 2026-11-14T06:24:37Z (this launch; 11-13's pid 24748 is gone).
Its ledger's last row is at 06:24:39Z. Not stopped.

## Every .bak, by path

- **Mine, before 2a:** `~\.claude\settings.json.bak-l207-before-20261114T070916Z` (sha256 eb6ca339…, 5,089 B).
- **The installer's, of settings.json:**
  - `~\.claude\settings.json.bak-20261114-010952` (before 2c's write);
  - `~\.claude\settings.json.bak-20261114-011001` (before 2d's);
  - `~\.claude\settings.json.bak-20261114-011149` (before delete-gate.js's).
- **The installer's, of each synced hook:**
  - `~\.claude\shell\precompact-preserve.js.bak-20261114-010938`;
  - `~\.claude\shell\hooks\precompact.js.bak-20261114-010944`;
  - `~\.claude\shell\hooks\push-gate.js.bak-20261114-011009`.
  - The three ABSENT installs had nothing to back up.
- **Per step,** `scratchpad/l207/settings-before-<step>.json` and `settings-after-<step>.json`.
- **The settings now:** 13,493 B, sha256 a0a7ffc1d91e3d1ee95a1e7fdb7bfaf05cb1d2991a7c62a438ac795fcc13dd9f.

## Not done, and why

- **Section 4 steps 5 and 7** (`state_L.md`, and the first body-ledger row's `live.not_live`) were not in this packet.
  - The body row exists only after a seat starts with 2c live. No seat started in this lap.
  - That row is the one that answers step 2's first value.

## Could be wrong

- **That the running seats already pick up 2c and 2d with no restart:** delete-gate.js did, in 21 s. A SessionStart hook fires
  only at a start, and the wake gate fires only on the librarian's `call_chair`. Neither was seen here.
- **The reading of K7:** see WHERE IT STOPS. If it already rules section 4 step 6 for L, the seven OWED syncs were held without
  need. Nothing is lost; they are one command each.
