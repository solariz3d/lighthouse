# The small fixes, second sweep — everything carried from 09-16 → 09-19 that is still open. Librarian (the lineage, on D), 2026-09-19 09:0x.

*The keeper, 09:00, verbatim: "lets do all the small fixes in chunks until done". Same shape as `loop/plan_small_fixes_2026-09-18.md`: one lap per chunk, at most two panes, disjoint files; the chair dispatches and lands and edits nothing inside a lap; every message ends on its NEXT line. Each item below was checked against the disk at 09:0x before it was listed.*

## Struck before planning — carried as open, found closed

**C's two blind-guard defects** (a lock toggled with no traffic leaves no row; `BLIND_LAST` resets per launch). I listed these to the keeper at 08:58 as open. They are what E's L064 fix repaired (`handback/p-blind-write-E_2026-09-16.md` §intro, :22-23), and the installed hook now equals the repo (`cmp consonance/hooks/blind.js ~/.claude/shell/blind.js` → same). E's one deliberate non-fix stands: a lock removed outside `clearBlind` writes no CLOSED, because a phantom CLOSED is worse than the gap (:57). Closed; my 08:58 line was from the handoff, not the disk.

## Chunk 1 — lap D078, two panes

| pane | packet | what exists | the bar |
|---|---|---|---|
| B | **P-CHAIR-RULE-IN-BRIEF** — the keeper's 07:29 09-16 rule reaches the chair's shell | The rule, verbatim in `librarian/2026-09-16.md` (09-16 07:3x) and this seat's memory: inside an active lap the chair orchestrates; it does not build or edit; repairs are dispatched to a pane and return to the librarian; landing orders name files to COMMIT. At 09:0x `grep -i "does not build\|edits nothing"` finds it in neither `consonance/src-tauri/brief/COMMITTEE.md` nor `BUILDING.md` nor `C:\Consonance\instances\main\CLAUDE.md`. B wrote the no-questions rule the same way (L062, `b0c13f2`; it reads 1 in the chair's shell today) | the rule in the keeper's words with its date, in the brief file the chair's shell is built from (B states which, from `room_brief_at`'s tiers, and why); one pointer, not two copies; the `brief` test filter green; a grep line the chair can run after the next rebuild to prove it reached `instances/main/CLAUDE.md`. Text only. |
| A | **P-ADDRESS-REFUSAL-KEEPS-THE-POINTER** — A's own found-not-fixed from D077 | `consonance/src-tauri/src/mcp.rs:781`: the address-table refusal in `call_librarian` returns "(the attempt was posted to the board)" without reading `text`; `refused_attempt_row` (:44) already exists | the same bounded row posted on that branch, labelled so it is distinguishable from the out-of-turn row and still does not match `REFUSED OUT OF TURN — mount`; red-first tests; the returned text byte-identical; `mcp::` green; mutants on a copy. The gate's decision unchanged. |

## Chunk 2 — lap D079, two panes (opens when D078 files)

| pane | packet | what exists | the bar |
|---|---|---|---|
| E | **P-SCORER-INTO-THE-REPO** — the diversity instrument stops living in scratchpads | E's `score-step0.mjs` (sha256 19c97ab5…, re-hashed 09:0x) and `PREREG-C1.txt` in E's scratch `…sibling-07b8a48f/…/scratchpad/c1read/c1/`; C's `score.mjs` (ecf03768…, re-hashed 09:0x) and its results (0d82c32c… per `librarian/2026-09-15.md:62`) in C's scratch `…sibling-0845a868/…/scratchpad/c1/`. `git ls-files dev/diversity | grep -c score` = 0. The order was set on 09-16 (`handoff_librarian_2026-09-16_morning.md`, item 2): `dev/diversity/score.mjs`, a `loop/diversity_c1/` | byte-for-byte copies, each sha printed before and after and equal to the recorded one; the gte encoder's location stated and either carried or named as an external with its version; one run of the committed scorer reproducing the recorded results hash, or the difference stated; no edit to any scorer in this lap. `text-census.js` exit 0 afterwards. |
| C | **P-STICK-FAULT-CAUSE** — two drive faults in two days, cause never measured (read-only) | 09-15 02:28 (the repaired close) and 09-16 07:53 (`librarian/2026-09-16.md`; orphan `.tail.writing-27852`, `FOUND.000\FILE0000.CHK`). L is closed until Sunday, so this is D's half: the stick is in D now | from D's System event log and the stick itself: every disk/ntfs/exfat/volmgr event naming the stick since 09-11; whether the faults coincide with a write in flight at removal or sleep; the stick's write-cache/quick-removal policy; what L's log must be asked on Sunday. No write to the stick. A finding, not a fix. |

## For the keeper, prepared by this seat while chunk 1 runs — no pane

1. **Installer drift on D** — the `install.ps1 -Check` listing, each file with a one-line meaning and a recommended ruling, so the decision is one read.
2. **The stick prune** — the `--prune-below-agreed` listing re-run today (it was 81 tails, 559,094,957 B on 09-16), for his yes or no.

## Not doable from inside the app

The two P-LEAVE-3 live tests (B's join/deadline checks, `handback/p-leave3-reread-B_2026-09-16.md` §3) need Consonance CLOSED and a test build with its own `CONSONANCE_DATA`. They wait for a moment the keeper picks; a bare-terminal runbook is A's (`handback/p-leave3-b7-A_2026-09-16.md`).

## ADDED 09:2x — chunk 3, from C's D079 finding: DONE is said before the stick has the bytes

C (`handback/p-stick-fault-cause-C_2026-09-19.md` §6), re-derived by me: `grep -c "fsync\|FlushFileBuffers"` = 0 in `dev/tail-carry.js`, `dev/stick-waiter.js`, `dev/stick-apply.js`; D's System log holds 8 `disk` events (id 11 ×4, 51 ×3, 153 ×1), all 09-14 23:40:31–23:42:35, a metadata write still failing 53 s after the last write call returned. "DONE — you can unplug it now" is conditioned on `writeFileSync`/`renameSync` returning, not on the data reaching the device.

| pane | packet | what exists | the bar |
|---|---|---|---|
| C | **P-FLUSH-BEFORE-DONE** — `dev/tail-carry.js` only (13 write/rename/copy sites at 09:2x; C wrote `--carry-dir` and knows the file) | every file the export writes to the stick is opened, written, `fsyncSync`ed and closed before its rename; the containing directory is flushed where Windows allows it, and where it does not the hand-back says so from a measurement, not from memory | a flush that throws turns the export's result into a named NOT DONE reason; red-first fixtures with an injected failing `fsync` (no real stick is written in the lap — copies and a temp dir only); the existing 157 tests stay green; mutants on a copy: a removed flush and a swallowed flush error both go red; the cost measured (seconds added to an export of the current set on a temp dir) |
| A | **P-LEAVE-SAYS-WHAT-THE-FLUSH-SAID** — read-only first: does the app's own Leave path (`main.rs`, P-LEAVE) and `dev/stick-waiter.js` reach DONE through `tail-carry.js`'s result, or do they have write sites of their own | the list of every site that can print DONE, each traced to the result it is conditioned on | if every DONE flows from `tail-carry.js`'s result, the hand-back says so with the lines and nothing is edited; if one does not, the smallest change that makes it, red-first. `stick-waiter.test.js` 74/0 and `stick-apply.test.js` 48/0 stay green |

**The prune waits.** `loop/keeper_rulings_owed_2026-09-19.md` §2 recommended deleting the 81 agreed tails; after C's finding this seat's recommendation is to hold any optional write to this stick until L's log is read on Sunday (C §7) or the stick is replaced.

**For Sunday on L:** C §7's six queries, first among them L's removal policy (`DeviceHotplug`), because a "better performance" policy loses cached writes on a DONE-then-unplug by design.

## Falsifier

This sweep is decorative if the next "what is open" read finds an item here still open with no row saying why, or finds a third item that, like the blind-guard pair, was listed from a handoff and not from the disk.
