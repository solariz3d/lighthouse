# P-STICK-PREFLIGHT · §2 BRAVO — the close on L with the real stick in

**B (pane `12fb81f6`), lap L058, machine L, 2026-09-14 05:15–05:45. Packet `loop/packet_stick_preflight_read_2026-09-14.md` (`9c88a11`).**
**Read at `0405bd2`** (`git archive 0405bd2 dev consonance/tools consonance/src-tauri/src/main.rs consonance/state-manifest.json` → scratch).
**No `--apply` against `D:\consonance-L-20260911`, no tracked file edited, no close.js, nothing committed.**
Every `--apply` below ran against a **scratch copy** of the stick: the real `ledger.json` (sha256 `8bf59550…` on both), the root files,
and zero-byte placeholders under the real tail names. Line numbers are `tail-carry.js` / `stick-waiter.js` at `0405bd2` unless named.

## 0 · THE ANSWER

**The close is safe to run tonight.** On the real stick it is a delta for all seven seats, about 26 MB as of 05:40, exit 0 `CARRIED`. It
writes seven tails, the ledger, a generated HANDOFF and `consonance-transfer/MANIFEST.json`, and deletes nothing. The stray
`.writing-25288` breaks neither `--verify-set` nor the export.

Three things the keeper and the chair should know before the test, none of which blocks it:

1. **The stray holds the only copy on L of four minutes of `main`** (09-12 18:53:39Z–18:57:59Z). It is inert to the tools, and a clean-up would destroy it. §4.
2. **The reopen right after the close shows a false warning.** It says "The stick does not have your last session" for all seven, the
   window will not close on its own, and Carry is disabled. The keeper clicks Continue and nothing is lost. §7.
3. **The live waiter and the export it spawns are not the same code.** The waiter was loaded at 05:14:50. The export is
   `dev/tail-carry.js` read from disk at the moment of close, which is A's working copy. §6.

---

## 1 · THE STICK AS FOUND

```
$ ls -la /d/consonance-L-20260911 /d/consonance-L-20260911/consonance-tails
  consonance-tails/ledger.json                                   2,627 B   09-14 00:36
  7 × <sid>.0-<N>.tail                                                     09-12 12:47   (≈348 MB)
  0c0c0c0a-….0-260898687.tail.writing-25288                  260,898,687 B 09-12 22:58
  no consonance-transfer/  (MANIFEST.tsv at the root is a different, older file)
```

Ledger: all 7 seats `agreed`, `pending: null`, every `agreed.offset` equal to its 09-12 tail's size.

**Every stick tail agrees with the ledger** (scratch `hashstick.js`, `hashRange` + `conversationKey` from `0405bd2`, 47 s over USB):
7 of 7 `prefix@agreed MATCH`, `key MATCH`. The stray matches too, over the agreed span. §4 covers what lies past that span.

Waiter's find, run on this machine's real volumes (`parseVolumeList` over the same WMI query as `:118-119`):

```
roots [ 'C:\\', 'D:\\' ]   ->   { kind: 'one', folder: 'D:\\consonance-L-20260911', layout: 'older' }     (≈320 ms, 3 runs)
```

No marker on `C:\` or its first-level folders, so no `AMBIGUOUS` (`:95-107`, `:281-285`). `D:` is exFAT with 255,064 MB free.

## 2 · THE EXIT PATH, IN ORDER

1. **Waiter already waiting.** pid 26800, `node C:\Consonance\lighthouse\dev\stick-waiter.js --data C:\Consonance\data --app-pid 33816
   --app-image consonance.exe`, created 05:14:50. `data/stick-waiter.lock` names pid 26800 (`Get-CimInstance Win32_Process`; `cat`).
2. **App exits.** The pid stops answering, which breaks the poll within 2 s (`:51`, `:218-223`).
3. **Stand-down check.** `data/stick-apply.started.json` **does not exist** (`ls`), so there is no stand-down (`:226-229`).
4. **Stick found.** `volumeRoots` → `findStick` → `kind: 'one'` (`:230-235`).
5. **`exportWithWindow`.** It truncates `data/stick-waiter.status.log` and opens the `cmd /c start` console (`:146-153`, `:265-279`). Then it
   spawns `node dev/tail-carry.js --stick D:\consonance-L-20260911 --export --json --apply` (`:136-139`).
6. **tail-carry.** Takes `consonance-tails/ledger.lock` `wx` (`:1080`, `:234-264`) and plans (`:623-702`). The HANDOFF guard
   comes before any write (`:1146-1153`). `applyExport` (`:705-754`) writes each tail as tmp→rename, stat-checks the source after
   the read (`:723-727`), writes the ledger (`:561-567`), then the transfer set (`:338-352`), then releases the lock.
7. **Result.** stdout is exactly one JSON line (`:1289-1298`); an exception still yields a code-3 object (`:1323-1327`). The waiter parses
   line 1 (`:293`) → `code 0` → `DONE (CARRIED) — 7 seat(s) written to the stick` (`:302-305`).
8. **Adopt.** A new `consonance.exe` pid, if the app was reopened within the poll, is adopted (`:238-240`). Otherwise the waiter returns and releases the lock.

## 3 · FULL OR DELTA, AND HOW MANY BYTES

**Delta for every seat.** `agreed` is set, the key matches and the prefix matches, so the verdict is `TAIL` from `agreed.offset` (`:667-699`).

Real stick, rehearsal, no `--apply`, 05:35:59:

```
$ node dev/tail-carry.js --stick 'D:\consonance-L-20260911' --export --json      # exit 0, REHEARSED, 0 refused
  TAIL main         260427744 → 269352062   8,924,318 B
  TAIL librarian     43187910 →  48459076   5,271,166 B
  TAIL third place   36513712 →  39285561   2,771,849 B
  TAIL 6fe15f0a       2741537 →   7734282   4,992,745 B
  TAIL 12fb81f6       1319664 →   1874375     554,711 B
  TAIL 0845a868       1480718 →   2029549     548,831 B
  TAIL a2122153       2354905 →   5457912   3,103,007 B
                                           26,166,627 B (24.95 MB)
```

The scratch `--apply` at 05:40 gave `27,060,405 B`, exit 0 `CARRIED`, 7 of 7 `result.ok`. **Tonight's figure is each L transcript's
size at close minus the offsets above**; it grows with the day's work and is not predictable from here.

**What lands on the stick** (scratch, `ls` + `cat MANIFEST.json`):
- 7 × `consonance-tails/<sid>.<agreed>-<size>.tail`
- `consonance-tails/ledger.json`: each seat keeps `agreed` and gains `pending {from:'L', offset, toOffset, tailFile, tailSha, fullSha}`.
  `firstTimestamp` is filled for all seven (R-4, `:743`).
- `HANDOFF-<UTC date of the close>.md`. **A close after 18:00 local is `HANDOFF-2026-09-15.md`** (`:1099-1103`). It cannot land on
  the hand-written `HANDOFF-2026-09-12.md` or `HANDOFF.md` tonight, and the guard would refuse first if it could.
- `consonance-transfer/MANIFEST.json`, format 1, `writtenBy: "L"`, 9 members: the ledger, 7 tails and the HANDOFF.
- **Nothing is deleted.** The seven 09-12 tails and the stray stay where they are.

## 4 · THE STRAY `.tail.writing-25288`

**It does not break `--verify-set`, on either layout.**
- Tonight, before the close (older layout), `verifySet` returns code 0 at `:369` without listing a single tail:
  ```
  $ node dev/tail-carry.js --stick 'D:\consonance-L-20260911' --verify-set --json
    {"code":0,"layout":"older","missing":[],"mismatched":[],"extra":[],...}
  ```
- After the close (manifest layout), the `/\.writing-\d+$/` skip at `:395` drops it. Scratch after one close gave code 0, `manifest`,
  missing 0, mismatched 0, `extra` = the seven 09-12 tails. After a second close, extra was 9. `extra` is informational, never a failure (`:362`).

**It does not break the export.** Export never reads `consonance-tails/` except `ledger.json`. The tmp names it writes are
`<sid>.<agreed>-<size>.tail.writing-<pid>` (`:716-717`), and the agreed offset is non-zero, so they cannot equal `.0-260898687…`.
Import reads only `pending.tailFile` (`:783-790`).

**What it holds, which the tools do not care about and the keeper should:**
```
$ node hashstray.js      (scratch)
  L main 0c0c0c0a….jsonl  269,619,145 B
  L[0,260898687) vs stray whole: DIFFER — first differing byte at offset 260,427,746   (agreed = 260,427,744)
  first ts past agreed   L: 2026-09-14T06:55:25.955Z    stray: 2026-09-12T18:53:39.861Z
  stray last ts: 2026-09-12T18:57:59.262Z
$ grep -rlF '466247b4-1646-415f-8dc4-3a6665520d96' ~/.claude/consonance-attic/C--Consonance-instances-main/ \
      ~/.claude/projects/C--Consonance-instances-main/ /c/Consonance/data/attic          -> no file (exit 1)
```

The stray is a **complete** FULL write of `main` (its size equals its name's span) that was never renamed. Past the agreed
point it holds 470,943 B of turns from 09-12 18:53–18:57Z. L's `main` goes from the same point straight to 09-14 06:55Z. **On this machine
those turns exist only in the stray.** The promptId of their first record is found in no L transcript or attic.

- **Do not clean the stray up** until someone decides whether those turns matter. Nothing in tonight's close touches it.
- **For C, not settled here:** if D's `main` holds those bytes past 260,427,744, D's import of tonight's `main` tail is `DIVERGED`
  (`:899-900`), not `APPEND`. I did not look at D.
- I did not reconcile the stray's content times (09-12 ~12:57 local) with its file mtime (22:58), and cannot say which machine pid 25288 ran on.

## 5 · A SEAT WHOSE COPY DOES NOT PREFIX-MATCH

**Export never reads the stick's copy.** It hashes **L's file** over `[0, agreed.offset)` and compares that with the **ledger's**
`agreed.prefixSha` (`:687-692`). Tonight all seven match (§3). If one did not:

| condition | verdict | line |
|---|---|---|
| L's prefix ≠ `agreed.prefixSha` | `REFUSED HISTORY_REWRITTEN` | `:687-692` |
| L's file shorter than `agreed.offset` | `REFUSED SHRANK` | `:681-686` |
| different first timestamped record | `REFUSED OTHER_CONVERSATION` | `:674-679` |
| `pending.from` ≠ L | `REFUSED UNIMPORTED_TAIL` | `:660-665` |
| no file on L, ledger knows the seat | `ABSENT_HERE` (a stop) | `:639-647` |

**Demonstrated, scratch:** a ledger copy with `12fb81f6`'s `prefixSha` zeroed, `--export --json --apply`:
```
code 1 STOPPED
TAIL × 6  written true
REFUSED HISTORY_REWRITTEN  12fb81f6  bytes 0  written null
refused seat after apply: pending null, agreed.offset 1319664      (its entry untouched)
MANIFEST.json written; the other six tails written
```
So the other seats still carry. The waiter window says `NOT DONE — exit 1, STOPPED.` and names the seat
(`stick-waiter.js:307-310`). The refused seat stays at its agreed state and is simply not on the stick.

## 6 · WHICH CODE ACTUALLY RUNS TONIGHT

```
$ ls -la --time-style=+%m-%d_%H:%M:%S dev/stick-waiter.js dev/tail-carry.js dev/stick-apply.js dev/place-conversations.js
  05:29:59  05:28:38  05:28:34  05:28:41          (all after the waiter's 05:14:50 start)
$ git diff 0405bd2 -- dev/tail-carry.js           -> one hunk: windowsHide on pidImage's tasklist
```

- **The live waiter (26800)** runs whatever `stick-waiter.js`, `tail-carry.js` and `stick-apply.js` were on disk at 05:14:50, because
  `require` happened at start (`:44-45`). I cannot prove that was `0405bd2`; §9.
- **The export** is `dev/tail-carry.js` spawned fresh at the moment of close (`:136-139`, `tailCarryPath` `:188`). It reads `main.rs` from the
  working tree (`:518`). **Whatever A's copy is at that moment is what writes the stick.** As of 05:28 its diff is behaviour-neutral.
- If P-NO-CONSOLE lands with a rebuild and relaunch before the test, a new waiter replaces 26800 and all of this is read afresh.
- The running mutation harness (`tail-carry.mutants.js`, pid 23920 at 05:35) writes mutants into a **copy** (`mutants.js:303`, `:318`),
  not `tail-carry.js`. Read, not run.

## 7 · THE REOPEN RIGHT AFTER THE CLOSE (for the test; D's arrival is C's)

On L, with L's own `pending` on the stick:

```
$ node dev/tail-carry.js --stick <scratch, after close> --import --json      -> code 0 NOTHING_TO_DO, 7 × OURS (carries false, stops false)
$ node dev/tail-carry.js --stick <scratch, after close> --export --json --apply   (a second close) -> 7 × TAIL, same spans, CARRIED
```

**Import is fine** (`:778-781`). **Export compares against `agreed` and never against L's own `pending`** (`:660`, `:667-699`), so
right after a close every seat still reads `TAIL`, `carries: true`. Consequences in the app at `0405bd2`:

- `rehearsal_is_quiet` → false on the export rows (`sync_launch.rs:1193`), so the setup window stays open.
- `stick.js:115` prints **"The stick does not have your last session for: main, librarian, third place, …"** for all seven. **That is
  false:** the stick has exactly that session, as `pending` from L.
- Carry is disabled, because no import row carries (`stick.js:102`, `:119`). The keeper must click **Continue**.
- The seats are **not** withheld; only a half-promoted data dir withholds (`sync_launch.rs:1355-1362`).
- A second close re-exports from `agreed`. An unchanged seat's tail is rewritten under the same name; a grown seat gets a new
  name and the previous pending tail becomes `extra` (scratch: extra 7 → 9). No failure, only stick clutter.

**Cost: one misleading sentence and one click; nothing lost.** Whether "behind" should subtract L's own pending is E's and A's call.
I am not proposing the fix.

## 8 · A RACE THE WINDOW DOES NOT WARN ABOUT

The window says **"Do NOT unplug the stick until this window says DONE"** (`:276-277`). It says nothing about **reopening**.
The export starts about ≤2 s poll + 320 ms `volumeRoots` after exit. If Consonance is reopened before `DONE`, the resumed seats write to
their transcripts, and `:723-727` records `the source grew while it was being read` for that seat. The result is `FAILED`, code 1, `NOT DONE`,
and the waiter adopts the new pid (`:238-240`). **Not exercised.** The export's duration on this exFAT stick was not measured; the
scratch run was NTFS. Probably a few seconds, but that is not a measurement.

---

## 9 · WHAT I DID NOT VERIFY

1. **What the live waiter loaded at 05:14:50.** File mtimes show only the last write (05:28–05:29).
2. **`renameSync` over an existing file on the exFAT stick.** Every `--apply` here ran on NTFS scratch. A second close renames onto
   an existing tail name on `D:`.
3. **Export duration and the window on the real stick.** The console from `cmd /c start` was not opened, and no byte was written to `D:`.
4. **Anything on D**, including whether D's `main` holds the stray's 09-12 turns (§4).
5. **Which machine pid 25288 ran on**, and why the stray's mtime is ten hours after its last record.
6. **The app's own Arrive on reopen.** Read at source (`sync_launch.rs:1165-1194`, `stick.js:90-122`) and rehearsed with the CLI; the app was not launched.
7. **Nothing else writes transcripts after the app exits.** `head-watch.js` (pid 25348) is alive and was not read.
8. **A HISTORY_REWRITTEN seat on the real stick.** Demonstrated only on a scratch ledger with a zeroed `prefixSha`.

## 10 · WRONG — mine

**I first read the stray as a partial of L's own history.** It has the same key, its prefix matches at the agreed offset, and it is longer.
From those three facts I had it as "an interrupted export of what L later carried". The bisect put the first differing
byte two past the agreed offset (`hashstray.js`), and its turns are nowhere on L. Three agreeing checks on the prefix said nothing about
the bytes after it. **Class: a match over the span a check covers, read as a match over the file.**

*Scratch evidence:* `…/scratchpad/{rehearsal.json, export_apply.json, reopen_import.json, stickcopy/, stickmismatch/, tree0405/hashstick.js, tree0405/hashstray.js}`.
