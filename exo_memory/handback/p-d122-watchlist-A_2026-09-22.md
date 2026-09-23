> **COMPLETE — not partial.** Updated at the chair's 23:0x cutoff: the first union-at-launch launch will be on **L**, not D. The
> page now opens with an L box — `git pull` by hand first, set the switch on L, `--before` on L — and says §2's `+0` prediction is
> D's and does not carry: **on L the arriving copy is D's new publish, so L should merge `+n > 0`, the real test.** WHAT MEANS STOP
> now sits directly after BEFORE, as asked. The rest of this file stands.

# P-D122-WATCHLIST · ALPHA — the watch-list is written, and its first line is that the switch is OFF: a plain restart would not be a union-at-launch launch at all. And the librarian's planned after-read cannot see the loss it is for — `trip-check`'s "lost" is a SET test over a ledger with 7,516 duplicate lines

**Pane A, machine D, 2026-09-22 22:59–23:2x local. Read-only:** no restart, no launch, no close, no install, no union write, no
ledger or settings change. HEAD at the end of the lap: `201dd2b` (it moved from `31d2540` while I worked; not by me).
**Two new files, uncommitted:**
- `exo_memory/loop/union_launch_watchlist_2026-09-22.md` — the one page (84 lines).
- `exo_memory/loop/union_launch_snapshot_2026-09-22.js` — the BEFORE/AFTER instrument the page runs. It is read-only on the room
  and writes one snapshot file under `%TEMP%\consonance-union-watch\`, never the data dir or the repo.

**Why a script and not a one-liner:** the pass rule needs the BEFORE multiset kept, not just its hash, and 62,815 board lines do not
fit on a page. It measures in `writeUnion`'s own unit — it calls `ledger-union.js`'s `completeLines` — and reads the file list from
the manifest's `install: "fast-forward"` set, as the union step itself does (§7.4).

## 1 · THE FOUR THINGS THE BUILD'S OWN CODE SAYS THAT THE PLAN DID NOT KNOW

**(1) The switch is off, so a restart repeats today's refusal.** `reg query HKCU\Environment /v CONSONANCE_UNION_AT_LAUNCH` → not
found; `grep -c UNION_AT_LAUNCH consonance/launch.ps1` → 0. Only `on` turns it on (`state-sync.js:1173`), and it must be in the
app's environment (`main.rs:11042-11045`, no `env_clear`). **So item 7 as planned — "the keeper restarts" — would produce the same
8 refusals as the 23:58Z trip, and nothing would tell him the feature never ran.** The page opens with this and gives the one
command (`setx … on`, then a full close and a shortcut start). Setting it is his, not a seat's.

**(2) The librarian's after-read uses a set test for "lost".** `trip-check.js:116-118` builds `new Set(before)` and counts
`!afterSet.has(k)`. **This is my D113 FATAL-1 again, in the witness rather than the merge**, and E's own §6 had flagged the trip
checker as *"UNVERIFIED — must be confirmed to count with multiplicity before it is used as the witness"*. Confirmed now: it does
not. With 7,516 duplicate board lines, a union that dropped one copy would read **"lost 0"**. **The page says so, and puts
`--after` in its place for the multiset verdict**; trip-check stays for the trip history.

**(3) After a fallback, the record does not say what was merged.** The refusal branch's `writeCompletion` (`state-sync.js:837-842`)
carries **no `union` field** (grep → 0), so which ledgers merged before the stop exists only in the `why` prose and in
`union_receipts.jsonl`. Nothing records whether the switch was on (`union.on` is never written).

**(4) AMEND-5 was half adopted.** The PHASE 3 text still reads *"NOTHING WAS WRITTEN — … this machine's data dir is exactly as it
was"* (`:1401-1402`) and **then** appends *"N ledger(s) here were merged before the stop … they GAINED rows"*. And `:830` prints *"No
file of the set was written; this machine's data dir is exactly as it was."* on every non-raced refusal, merges or not. **Both
sentences are false after a partial union.** It is on the STOP list as a record defect, not a data one. `state-sync.js` is my file
from L070, so this is my correction, not an outside finding. **I did not change it this lap** (read-only).

## 2 · THE PREDICTION, registered before the launch

**Arriving lines this machine does not already hold, by count: 0 in all eleven** (from today's snapshot against the arriving copy
at `9486b30`). **So if the state head is unchanged at launch, the 8 refused files should each merge with `+0 rows`.** That is a pass.
It also means this first launch tests the machinery (rename, link, reconcile, receipts, lock), not a merge of real rows. **The real
test is the first launch after L publishes something new.** Both are on the page. **Falsifier:** if the head is still `9486b30` and
any file merges with `+n > 0`, either the snapshot's unit or the union's differs from what I read, and the page is wrong.

## 3 · EVERY COMMAND WAS RUN TODAY, as written

- `trip-check --report`: last install trip 23:58:32Z NOT CLEAN, refused 8. `sync-completion.json`: stage install, installed false,
  head `9486b30`, refused 8, union field present: **false**.
- `--before`: 11 ledgers read. board 62,815 lines / 55,299 distinct; sessionstart-state 8,471 / 8,230 — **7,516 and 241 duplicate
  lines**, re-derived from the snapshot's own counts.
- `--after` against a snapshot 12 s old: **PASS, exit 0**, board +5 and lap +1 "written here since". The same run proves the growth
  split works.
- `union.lock` and `union_receipts.jsonl`: absent. 9 `*.pre-union-*` backups present (D106's), which `danglingUnions` ignores by
  design when no receipts file names them (`state-sync.js:1244-1251`).
- `node consonance/tools/portable-paths.js` → **EXIT 1, and not mine.** `consonance/tools/trip-check.test.js:34` (`stateDir:
  'C:/nowhere'`, C's D112 `0b8e84f`) is a DRIVE / BENIGN-TEST site not in the baseline. My two files add no site. **Named for C; not
  touched, and no `--update` run.**

## 4 · WHAT I DID NOT VERIFY

- **The launch itself**, by construction. Every line in §2 of the page is read from code at HEAD, not seen printed.
- **That `setx` reaches a shortcut launch on this machine.** It broadcasts the change to Explorer, which is the usual way a shortcut
  inherits it. The page says to check afterwards for receipts rather than trust the setting.
- **Machine L.** Nothing measured there.
- **`writeUnion`'s duration on a live board.** The 90 s question (D113 NOTE-9) is still unmeasured; the page records `ms` per file
  so the launch itself will answer it.

NEXT: librarian call_librarian with the hand-back pointer when the watch-list is written — C is building the T-J1 pilot sheet in parallel; D122 lands when both are in, and the baton after D122 is D123 (item 1 board compaction + item 4 the hook-file wording)
