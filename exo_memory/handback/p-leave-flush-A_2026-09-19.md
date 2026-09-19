# P-LEAVE-SAYS-WHAT-THE-FLUSH-SAID · ALPHA — nothing to change: every DONE flows from `tail-carry.js`'s one `code`

**Pane A, machine D, 2026-09-19 09:4x–10:0x.** Lap D080, chunk 3. Packet: `loop/plan_small_fixes_2_2026-09-19.md`, the
A row at `:39`. Finding: C's `handback/p-stick-fault-cause-C_2026-09-19.md` (read at
source, §1–§3). **Read-only. Nothing was edited, and the stick was only read** (`sha256sum` of four scripts). The one
conclusion that matters to C's packet is in §3.

---

## 1 · THE ANSWER

**Every site that can tell the keeper DONE, or tell him he can unplug, is conditioned on one value: the `code`
`tail-carry.js` computes for the export.** None of them writes to the stick itself. They write only their own
records, and those go to `C:\Consonance\data` on the local disk:

    node -e "console.log(require('./consonance/tools/state-sync.js').dataDir())"   ->   C:\Consonance\data

**So the fix belongs in `tail-carry.js`, which is C's P-FLUSH-BEFORE-DONE, and it reaches every DONE with no edit to
`main.rs` or `dev/stick-waiter.js`,** on one condition, stated in §3.

---

## 2 · EVERY SITE THAT CAN SAY DONE, TRACED

Found with `git ls-files | xargs grep -ln -i "unplug"` (outside `exo_memory/`): main.rs, sync_launch.rs, ui/leave.js,
dev/ARRIVING.ps1, dev/LEAVING.ps1, dev/ON-EXIT.ps1, dev/dream/dream_cycle.ps1, dev/stick-waiter.js (plus two tests).
Then `grep -n "DONE\|unplug"` inside each; `dream_cycle.ps1:101` means a power cable, not the stick.

| # | who says it | the words | conditioned on | its own writes | command |
|---|---|---|---|---|---|
| 1 | **the app's Leave** (P-LEAVE) | `ui/leave.js:55` "Saved — you can unplug it now" when `result.outcome === 'DONE'` | `sync_launch.rs:1635` `outcome = if e.done`; `leave_ending` (`:1575`) `done: why.is_empty() && code == Some(0)`; `code` is the JSON `code` of `run_carry_json(["--stick", f, "--export", "--json", "--apply"])` (`main.rs:11378`), plus no row with `stops`, no seat alive, none in flight | `write_json_atomic` → `LEAVE_STARTED`, `LEAVE_RESULT` in `data_dir()` (`sync_launch.rs:1579-1600`): **local disk** | `sed -n 1560,1660p src/sync_launch.rs`; `sed -n 11340,11420p src/main.rs` |
| 2 | **the waiter's fallback save** | `dev/stick-waiter.js:535` "DONE (…) — N seat(s) written to the stick. You can unplug it now." | `:533` `obj.code === 0`, `obj` = the first stdout line of `tail-carry.js --stick … --export --json --apply` (`:175`) | its status log and lock in `data_dir` (`:281`, `:446`, `:486`); `:406` removes a LEAVE file in `data_dir`; `:422` only **reads** the stick's ledger lock | `sed -n 482,545p dev/stick-waiter.js`; `grep -n "writeFileSync\|renameSync\|…" dev/stick-waiter.js` |
| 3 | **LEAVING.ps1** (by hand) | `:31` "[leaving] done. Unplug the stick." | `:27-29` `$LASTEXITCODE` of `node dev\tail-carry.js --stick … --export --apply`, non-zero → exit before "done" | none | `sed -n 20,32p dev/LEAVING.ps1` |
| 4 | **ON-EXIT.ps1** (the stick's own close window) | `:41` "DONE. The stick has everything. You can unplug it now." | `:36-40` `$LASTEXITCODE` of `LEAVING.ps1`, i.e. #3's | none | `sed -n 24,48p dev/ON-EXIT.ps1` |
| 5 | **TAKE-STICK.ps1** (import) | `:71`/`:74` "done - imported" | `:64-65` `$LASTEXITCODE` of `tail-carry.js --import …` | none | `grep -n … dev/TAKE-STICK.ps1` |
| 6 | **stick-apply.js** (the app's import) | no "unplug"; its result is shown by the relaunched app | `obj.code` from tail-carry's JSON (`stick-apply.js`, D066) | `data_dir` only (`:122-125`, `:282`) | `grep -n "writeFileSync\|renameSync\|…" dev/stick-apply.js` |

**The copies the keeper actually runs from the stick are the repo's, byte for byte** (read-only):

    for f in ARRIVING LEAVING ON-EXIT TAKE-STICK: sha256sum dev/$f.ps1 vs D:/consonance-L-20260911/$f.ps1   ->   all SAME
      (6bb733e7…, f091329a…, 4068fa05…, 822bf0f0…)

**Rows 5 and 6 are imports, and they do not say "unplug".** They are listed because an import `--apply` also writes to
the stick (the ledger lives there — `stick-waiter.js:422` reads its lock at `<stick>/<LEDGER_DIR>`), and the same
coupling covers them.

**`--carry-dir`** (C's D067, which wrote the 311 MB `repo-carry`) is not reached by any of the six. It is run by hand,
and its outcome is C's JSON branch at `tail-carry.js:1678-1686`.

---

## 3 · THE ONE CONDITION — for C's packet, not a change to mine

**The JSON `code` and the process exit code are the same number.** `tail-carry.js:1671-1699`: `finish(res)` prints
`res.code` in the JSON and returns it; `:1738` passes it to `process.exit`. So sites #1, #2 and #6 (JSON) and #3–#5
(exit code) all move together.

**An export sets that code non-zero only through the seat accounting** (`tail-carry.js:1535-1536`): `bad || refused` →
`EXIT.SEAT` (1), where `bad` counts `done` entries with `ok: false`. So:

- **A flush failure on a seat's own tail file**, if C records it as that seat's `ok: false` (the shape the existing
  "the source grew" failure uses at `:746`), gives code 1. **Every DONE site then says NOT DONE, with no change here.**
  The app additionally names the seat through its `stops` rows only if the row carries `stops`. Otherwise the reason is
  the outcome and code (`sync_launch.rs:1565-1568`).
- **A flush failure on a file that is not a seat's tail** — the ledger, the manifest, the HANDOFF, the lock release —
  **must set `res.code` non-zero by some other path**. If it is only logged, or only put in a row the accounting does
  not count, the export still returns 0, and all six sites still say DONE over unflushed bytes. **C's bar already names
  this outcome** ("a flush that throws turns the export's result into a named NOT DONE reason"). This paragraph is the
  reason it must be the *code*, not a row or a line of text: the six sites read nothing else.

**C's 09-14 fault is exactly that second kind:** the failed write was the metadata of `/consonance-L-20260911` itself
(cluster 136). A directory flush — where Windows allows one — is the non-tail file that decides whether this repair
reaches the keeper.

---

## 4 · BARS

    node dev/stick-waiter.test.js       74 passed · 0 failed
    node dev/stick-apply.test.js        48 passed · 0 failed
    git status --short                  no path of mine modified (the tree shows only other seats' files)

No cargo run: nothing in the crate was touched.

---

## 5 · WHAT I DID NOT VERIFY

- **Nothing was run against a stick or a failing write.** This is a trace of source conditions, not a demonstration.
  That a flush failure becomes NOT DONE on screen is to be shown by C's red-first fixtures plus one end-to-end: the
  waiter or the Leave fed a `tail-carry` JSON with `code: 1`. That end-to-end is **already pinned** for the code path:
  `stick-waiter.test.js` covers non-zero codes as NOT DONE, and `sync_launch.rs` tests assert `NOT_DONE` on a failed
  carry (`:3183`, `:3223`). It is not re-derived here from a flush.
- **The UI's rendering of the Leave result** (`ui/leave.js:51-55`) was read, not run.
- **`tail-carry.js` was read, not edited** (C's file). Line numbers are at HEAD `5cd3164`, and will move with C's change.
- **L's copies of the scripts, and L's app build, were not checked.** The stick's copies match D's repo.
- **Whether Windows can flush a directory on exFAT** is C's measurement to make.

NEXT: librarian re-derive and collate with C's P-FLUSH-BEFORE-DONE when both D080 hand-backs are in
