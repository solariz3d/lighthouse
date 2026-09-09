# P-BOARD-COMPACT (L052) — hand-back. B, 2026-09-09 ~03:50.

**Packet:** `exo_memory/loop/packet_board_compact_2026-09-09.md` (95d55b6) · plan §1 and §4 of
`exo_memory/loop/two_machines_lap_plan_2026-09-09.md`.

**Built:** `consonance/tools/board-compact.js` (that name), `consonance/tools/board-compact.test.js`.
22/0. Six mutants, all killed, source sha256-identical after. Nothing committed, nothing staged.

**Done:** the live board is compacted and the original is in the attic. `322.9 MB → 44.8 MB`,
`268,775 rows → 29,704`, verified by a second independent pass.

---

## THE NUMBER, first, because three packets are sized against it

    node consonance/tools/state-manifest.js            # 2026-09-09 09:44:27Z, after the compaction

    TRAVELS = 60,267,635 bytes (57.5 MB)   [GitHub per-file hard limit is 100 MB]
    STAYS   = 885.1 MB     REGENERATES = 0.0 MB     UNDECIDED = 0.3 MB (not counted)

**A's projection was 52.8 MB. The measured number is 57.5 MB — 4.7 MB and 8.9% above it.** Saying
it here rather than in a footnote, per the packet.

**The projection did not miscount; it priced a different rule.** Measured on the same original at
the same instant: under the rule the plan named (drop every row behind the running ts maximum) the
board would be **40,007,067 bytes** and TRAVELS would be **53,343,581 bytes (50.9 MB)** — within
2 MB of A's figure. The rule that shipped keeps **6,924,054 bytes (6.6 MB)** more. **That 6.6 MB
is the 4,339 rows of record I refused to delete, and it is the whole overage.** A's arithmetic was
right about the rule it was given.

Re-run stability: a second run five minutes later returned 60,286,981 bytes — still 57.5 MB, the
delta being live turns. `consonance/state-manifest.json` was being edited by A concurrently
(`git diff --stat`: 5 insertions on top of `022f268`); both runs exited 0 with no unclassified
path, and the new `attic/board.jsonl.2026-09-09` is classified **STAYS** by the manifest as it
stands.

**The falsifier (TRAVELS over 100 MB) did not fire. The repo transport stands on this number.**

---

## 1 · THE RULE THE PLAN NAMED IS REFUSED, AND THE REFUSAL IS A MEASUREMENT

The plan (§1) named the rule as *"the audit's own rule — rows behind the running ts maximum"*.
`board-audit.js` calls that quantity **the replay TELL**, and its own header is right: it is a
tell, not a definition. The board is written by seven concurrent panes carrying **transcript**
timestamps, so a row lands behind the running maximum whenever one pane's turn began before
another pane's turn ended. That is ordinary committee traffic.

Measured on the live board **before anything was written** (`scratchpad/measure2.js`, one pass,
268,757 lines):

    behind the running ts maximum                       243,406
      ... byte-identical to an earlier line             239,033   replay
      ... same (pane,role,text), different ts             1,620   ambiguous — could be a real turn
      ... content NEVER SEEN BEFORE in the file           2,753   REAL ROWS, HELD NOWHERE ELSE

A sample of the 2,753, straight out of the run: `[chair:MAIN] Cycle 8 — the convergence session…`,
`[chair:MAIN] The reflog anomaly is RESOLVED — push e81842f…`, `[chair:MAIN] CYCLE 9 ARM A —
EXECUTE, keeper's call. You are the PLANTER…`, and the chair's own replies to them. **Chair
dispatches and pane hand-backs, behind the maximum because the chair's turn opened before the pane
it was answering closed.**

**So the rule is: drop a line only when a BYTE-IDENTICAL line appeared earlier in the file.** First
copy kept, file order preserved, unparseable lines carried verbatim. This is lossless by
construction — the output *is* the original's distinct lines in first-occurrence order — which is
why the verifier below can re-derive it and say no.

**The two candidate keys were measured against each other and agree.** De-duplicating on the whole
line and de-duplicating on `(pane, role, text, ts)` both leave **29,684 rows / 44.7 MB**: no two
lines on this board share a tuple while differing in bytes. The whole line is the stricter of the
two and is what shipped — a rule that cannot lose a field it did not think to look at.

**This is the packet's tempting version, declined.** The smaller number was available, it was the
number the plan asked for, and it was the number A had projected against. It costs 6.6 MB of a
100 MB budget — **6.6% of the bound for 4,339 rows** — and the packet's own falsifier is *any
reader that changes its answer for a row that was not a replay*. The behind-the-maximum rule fires
that falsifier by construction, not by accident.

---

## 2 · RED FIRST, AND THE HONEST ORDER

The test file was written and run **before** `board-compact.js` existed. Its first run was a
`MODULE_NOT_FOUND` — a load failure, not 22 assertion reds. **So red-first here bought the fixture
and the expected output; it did not buy a per-assertion score.** That is stated in the test
header rather than left implied.

The fixture is planted line by line — 14 rows written longhand, each carrying `KEEP` or `DROP` as
a comment, with `KEPT_INDEXES` and `DROPPED_INDEXES` declared as constants. **The expected output
is a literal in the file, not a thing read back off the tool.** It carries all four live classes:
a byte-identical replay burst, a behind-the-maximum row with new content, a same-content
different-ts pair, and a torn `}{` line.

The per-assertion score is the mutation run (`scratchpad/mutate.js`; source sha256 checked
identical after every one, and it was):

    KILLED  6  M1  accept() also drops rows behind the running ts max
    KILLED  5  M2  dedup keyed on (pane,role,text), ts ignored
    KILLED  6  M3  keep the LAST copy instead of the first
    KILLED  5  M4  verifyPair() returns ok unconditionally
    KILLED  1  M5  catchUp() ignores bytes appended after the read
    KILLED  1  M6  splitComplete() returns the torn tail as a whole line

**M5 and M6 are each killed by one test, which is thinner than it looks.** Both are the
live-writer half, and on a board with five panes writing into it the live writer is the only thing
standing between a compaction and a lost row. Named here rather than left for a reader to find.

---

## 3 · THE READER DIFF — 17 readers, three runs each

Every tool and hook in the repo that opens `board.jsonl` was run **three** times against a frozen
copy: **before, before again, after**. The second before-run is the control — it says which
readers are non-deterministic on their own clock, so an after-difference can be attributed to the
compaction instead of guessed at. Harness: `scratchpad/readerdiff.js`; outputs kept per reader.

    reader                          self-stable  before==after
    board-audit.js                       yes       DIFFERS
    chain-status.js                      yes       DIFFERS
    board-digest.js (repo)               NO        IDENTICAL
    board-digest.js (installed)          yes       IDENTICAL
    userprompt_pulse.py (installed)      NO        DIFFERS
    replay-check.js --score              NO        DIFFERS (exit 0 -> 3)
    tell-index.js                        yes       DIFFERS
    residue.js                           yes       IDENTICAL
    actors.js                            yes       DIFFERS
    agreement-spread.js                  yes       DIFFERS
    balance-check.js                     yes       DIFFERS
    baton-wake.js                        yes       IDENTICAL
    lap-row.js --status                  yes       IDENTICAL
    whats-live.js                        yes       DIFFERS
    catch-ledger.js                      yes       IDENTICAL
    boundary-check.js                    yes       DIFFERS
    ferry.js --due                       yes       IDENTICAL

**The row-level claim is settled at the file, not reader by reader.** `--verify` re-derives, in a
separate process reading both files, that the compacted board **is** the attic'd original's
distinct lines in first-occurrence order — nothing missing, nothing invented, nothing moved,
nothing repeated. So no row that was not a byte-identical repeat was dropped, and every reader
difference below is a *duplicate-count* effect. Each is named anyway.

**board-audit.js** — `268,509 rows of 268,766 lines → 29,438 of 29,705`; repeats 86.8% → 3.3%
(exact-0ms 231,957 → **0**); behind-max 90.7% → 14.9%. Main's clean share at line 24,845 reads
92.9% → 87.2% because the clean corpus at that *line* is now a different slice of history. **The
raw-vs-clean snapshot points (24845, 42309) are line numbers into the replayed file and no longer
mean what they meant** — the 08-15 journal match that made the clean/raw comparison fair is now
unreproducible from the live board. It is reproducible from the attic file, forever.

**chain-status.js and the pulse** — the verdict line is character-identical except one field:
`40 board line(s) fused` → `257`. Measured (`scratchpad/fused.js`): **257 torn lines in the whole
file before and 257 after — none were lost.** chain-status reads an 8 MB tail; that tail held
2.8% of the lines before and 28.4% after, so it now sees all 257 instead of the 40 nearest the
end. **The reader's window reaches further; no row changed.** Everything else on the line — lap,
holder, unwitnessed counts, `handbacks 0 of 4 (owing A,B,C,E)` — is identical.
*The pulse's self-instability is its own: the "since last msg / crosses a restart" clause is
written once to pulse state and not repeated. Its only board-attributable difference is the same
`40 → 257`.*

**replay-check.js --score — exit 0 → exit 3, and this is the tool working.** It prints
`REFUSED: the board is 291,601,992 bytes SMALLER than at the mark. It was rotated or compacted, so
this is not the same corpus and a verdict taken across that seam would mean nothing.` **Handled:**
scored on the live board immediately before compacting (`PASS: 54 transcript-sourced rows against
a bound of 1,565`, exit 0, re-derived here rather than relayed), then re-marked after —
`marked 2026-09-09T09:44:53.730Z, board 46,931,121 bytes, 1,830 transcripts, 89,827 lines`.
**The next relaunch scores against the new mark.**

**actors.js** — `268,509 → 29,438` entries. **24 canonical actors from 40 raw identifiers, before
and after**, and every non-uuid resolution count is identical (`non-pane=973 letter=179 alias=82
pre-letter=76 fixed-mount=6 uuid-prefix=4`). Only `uuid=267,189 → 28,118` moved. The actor set is
unchanged.

**boundary-check.js** — identical but for one line that vanished:
`369 raw rows deduped to 194 on (pane, text) — the board replays transcripts.` There is nothing
left for it to dedupe. Exit 1 before and after (a pre-existing state, not this).

**tell-index.js** — `scanned 268,509 → 29,438`; `13,180 dropped as replay bursts` and
`401 chair injections` identical; `3,387 → 226 synthetic user entries`. The per-day table's
counts fall to their un-replayed values.

**agreement-spread.js and balance-check.js — flagging these two loudly.** Their *scores* move:
negatives `53 → 50`, `26 below floor → 10`, `10 too few records → 29`; balance-check's median
top-source share `83.2% → 61.9%`, `>=90%: 33/74 → 7/74`. **No row they read was removed unless it
was a byte-identical duplicate — but their samples were partly built of duplicates, so laps that
had enough records now do not.** Their verdicts still hold (P3 `|rho|<0.5`: -0.198 → -0.159;
P4 `|rho|<0.25`: 0.004 → -0.039). **Consequence: any figure ever published from those two tools
is a raw-board figure and is not comparable to one taken after tonight.** This is 2026-08-17's
finding again — published shares that counted the replays — one rung further out.

**whats-live.js** — differs only in the printed *paths* and the board's mtime: an artifact of the
harness running the two passes out of two shadow directories, not of the compaction.

**board-digest.js (repo and installed) — IDENTICAL**, which is the one to notice: it reads a 2 MB
tail and the last 2 MB is the same rows either way. The installed copy and the repo copy agree.

**No reader anywhere stores a board offset or line count.** Checked by grep across `.js`, `.rs`,
`.py`; `digest_state.json` holds a name map. The Rust side never reads the board back
(`main.rs:1428` — *"board.jsonl is a write-only mirror, never reloaded"*; `mcp.rs:889` — the chair
reads the durable file from disk, `read_board` serves the in-memory ring, which is empty at every
launch). **So there was nothing to renumber.**

---

## 4 · THE ORIGINAL, AND HOW I KNOW IT IS WHOLE

    C:\Consonance\data\attic\board.jsonl.2026-09-09    338,580,475 bytes   STAYS

Not asserted — **checked against a copy taken independently before the tool ran.** A copy frozen at
03:37 (338,578,424 bytes) sha256s to `305534134f5dbcc2…d204d8b4`, and the attic file's first
338,578,424 bytes sha256 to **the same value**. It grew by 2,051 bytes, which is the live writer
appending during the run and is exactly what the catch-up is for. **The original is byte-untouched
and holds every row the board has ever carried, replays included.**

`--apply` **refuses** rather than overwriting an existing attic file of the same name, tested.

**The live-writer race, and its residual window, stated rather than waved at.** Five panes are
writing to this board. The tool reads to the current end, then loops catching whatever arrived,
then renames the original into the attic, then renames the compacted file into place — and *then*
reconciles against the frozen original by byte offset, so anything appended after the last read is
recovered by comparison rather than raced against. **The one window I have not closed is between
the two renames**: if the app re-creates `board.jsonl` in that sub-millisecond gap, the tool reads
that file and carries its rows before renaming over it, and that recovery has its own smaller
window inside it. It is not atomic and I am not claiming it is. On this run: 0 rows caught by the
catch-up loop, 0 recovered from a gap file, 0 recovered late — the swap landed in a quiet moment.

---

## 5 · WHAT THIS DOES NOT ESTABLISH

- **Nothing about the desktop.** The compaction ran on this machine's board only. The desktop has
  its own board and its own replay history, and it will need its own run and its own attic file.
- **Nothing about whether 57.5 MB actually clones.** The number is a sum of file sizes on this
  disk. Git object overhead, the second repo's own history, and push time are A's measurement.
- **The 6.6 MB ruling is a judgement about a bound, not a law.** If TRAVELS later crowds 100 MB,
  the honest move is a dated rotation of the board — the record kept in the attic and older months
  left behind — **not** re-litigating the behind-the-maximum rule, which deletes present-day rows
  to save a fraction of the budget.
- **The torn lines are carried, not repaired.** 257 of them, `}{`-glued by interleaved writes,
  unchanged by this tool. Repairing them mutates the record and belongs to whoever owns the
  writer. `chain-status` already fuses and recovers them at read time.
- **`js-suite`: 85 green · 2 failed · 1 canary of 88** (was 80 · 5 · 1 of 86 at L050). Neither red
  is mine or the board's: `forget-rate.test.js` reports a git-history deletion
  (`exo_memory/astra/SHELL.md`), and `install-only.test.js` reports
  `consonance/hooks/live-mirror-stop.js` declared-but-not-registered — **E's live-mirror hook,
  being built in this same lap.** And the same limit as L050 applies to the measurement itself: a
  suite run over a shared checkout with three panes mid-lap is not a clean reading of anything,
  mine included.

---

## 6 · FALSIFIER STATUS

    OBJECTIVE:  a board small enough to travel, with the original kept whole.
    FALSIFIER:  any reader that changes its answer on the compacted file for a row that was not
                a replay.

**Not fired.** No row that was not a byte-identical repeat left the file — re-derived by a second
independent pass over both files, not asserted. Every reader difference is accounted for above by
duplicate counts, tail reach, or the harness's own paths.

**Registered before it can be scored, so it can fire later:** if any row present in
`attic/board.jsonl.2026-09-09` is found absent from the compacted board *and* absent from every
byte-identical earlier position, this rule was wrong and the attic file is the restore. One
command checks it: `node consonance/tools/board-compact.js --verify <attic> <board>` — which is
also the recovery instruction, since the attic file moved back over `board.jsonl` restores the
pre-compaction state exactly.

---

## 7 · FOR THE PACKETS DOWNSTREAM

- **A (P-STATE-REPO):** TRAVELS is **60,267,635 bytes / 57.5 MB**, board **46,931,121 bytes**.
  Under the 100 MB cap with 42 MB of headroom. `attic/` is STAYS and must not be in the sync set —
  it is 886 MB.
- **C (P-SYNC-AT-LAUNCH):** the board is a fresh 44.8 MB file with the same name and the same
  append-only shape; nothing in `main.rs` reads it back, so the launch path needs no change for
  this. `replay-check.mark.json` was re-marked at 09:44:53Z — **do not score across an older mark.**
- **E (P-LIVE-MIRROR):** per-turn `--push` of a 45 MB board is a different proposition from a
  323 MB one; the round-trip measurement your bound needs should be taken against the compacted
  file, not the projection.
- **The keeper, at 08:00:** the desktop's board is untouched by any of this and will need its own
  `board-compact.js --apply` before its state is comparable in size.
