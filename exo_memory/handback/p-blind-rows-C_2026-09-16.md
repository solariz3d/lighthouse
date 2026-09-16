# P-BLIND-ROWS · CHARLIE — why the blind guard has zero input rows on this machine

Lap L061, 2026-09-16 ~05:25–05:5x, machine **L** (ZachsLEGION, `hostname`), seat C (Around).
Packet: `exo_memory/loop/plan_L061_boundary_check_and_harness_2026-09-16.md` (818063d), the
**P-BLIND-ROWS → C** paragraph, read at its file.

**Measurement only. Nothing edited, nothing installed, nothing built.** One copy of
`boundary-check.js` was run in my scratchpad against synthetic ledgers (§5). The repository was read,
never written.

---

## 0 · THE VERDICT

**Cause (2), machine locality — and cause (1) is not merely unsupported, it is REFUTED at source.**

The mirror-gap hypothesis says blind rows exist but never reach the guard's input on L. They do reach
it: **`board_push` writes each blind transition row to `board.jsonl` directly**, in both branches,
before any dedup and before the ordinary append (`main.rs:2058-2062`, `:2072-2076`). There is no
ring-only path for them. If a blind window had opened on L while the app was pushing, the row would
be on disk.

**And the plan's cited line does not say what the hypothesis needs it to say.** `main.rs:1577` —
*"(board.jsonl is a write-only mirror, never reloaded)"* — is a comment on `BOARD_PUSHED`, the
distill watermark. *Write-only* means writes go out and nothing is ever read back **in**; it is a
statement about ingestion, not about whether rows are written. Read as "blind rows never reach the
file" it is exactly backwards.

**What the evidence supports instead:** no blind window has ever been opened on this machine. Not
that the rows were lost — that they were never generated here.

**The one half I did NOT verify, stated plainly:** that the rows are *on D*. I cannot see D's board
from L. "The 2026-06-30 → 2026-08-01 window ran on D and swallowed 2,473 entries" is taken from the
08-28 registration, which was written on D and says so in its own first line. **I confirmed the
absence here; I did not observe the presence there.** Anyone wanting the full claim has to run this
on D.

---

## 1 · THE NUMBER, AND THE UNIVERSE PRINTED

**Zero. Across 463,978 rows in four board files, not one.**

My first pass printed a universe of one file, which was wrong — this machine holds four boards, and a
zero from the live file alone could not rule out rows having been removed by a compaction. Corrected
before the verdict:

| file | lines | size | mtime | `"pane":"blind"` |
|---|---|---|---|---|
| `C:\Consonance\data\board.jsonl` (live) | 30,758 | 47,862,898 | 2026-09-16 05:28 | **0** |
| `C:\Consonance\data\attic\board.jsonl.2026-09-09` (**pre-compaction original**) | 269,032 | 338,580,475 | 2026-09-09 03:43 | **0** |
| `C:\Consonance\backups\board.jsonl.pre-thirdplace-purge-2026-08-29` | 133,999 | 185,202,081 | 2026-08-29 01:42 | **0** |
| `C:\Consonance\state\data\board.jsonl` (state repo) | 30,160 | 47,398,241 | 2026-09-11 00:27 | **0** |
| **total** | **463,978** | | | **0** |

    for f in <the four paths>; do grep -c '"pane":"blind"' "$f"; done      -> 0 0 0 0
    find /c/Consonance -maxdepth 3 -iname "board.jsonl*"                   -> the four above

All four share the same first row — `{"pane":"0c0c0c0a-…","role":"user","text":"Hello","ts":1782806732817}`
— so they are one lineage, this machine's board at four points in its life, not four different boards.

**The pre-compaction original is the load-bearing row of that table.** `board-compact.js:3` says it
removes launch replays *"keeping the original whole"*, and the live board went 269,032 → 30,758 lines
at the 09-09 compaction. Had blind rows been dropped by it, they would still be in the attic copy.
They are not. **Compaction did not eat them; they were never written.**

### 1.1 · The zero is not a parse artifact either

    node … parse every line of the live board
      parseable rows            30,501
      unparseable (torn) rows      257
      distinct `pane` values        42     — none of them "blind"

Of the 257 torn rows, 13 contain the string `blind` — all of them the word inside a chair message's
`text`, none in a `pane` field. Raw-byte checks agree:

    grep -c '"pane":"blind"' board.jsonl                        0
    grep -cE '"pane"[[:space:]]*:[[:space:]]*"blind"' board.jsonl  0

**And the schema is not the obstacle.** The 42 distinct `pane` values include synthetic markers —
`chair` (1,123), `backfill` (39), `gate` (24), `main` (16), `sync` (4), `resume` (4). A row whose
`pane` is a word rather than a uuid is ordinary on this board. A `blind` row would be the same class.

---

## 2 · THE WRITE PATH, READ AT SOURCE — WHY (1) IS REFUTED

`board_push` (`main.rs:2046`) is the single funnel every board writer passes through. The blind gate
sits at the top of it, **before** dedup and **before** the ordinary file append:

- `:2050` `let locked = blind_lock().is_some();`
- `:2051` `let prev = BLIND_LAST.swap(if locked { 2 } else { 1 }, Ordering::Relaxed);`
- `:2052-2064` on the OPEN edge: builds a `BoardEntry { pane: "blind", … }`, **serialises it and
  appends it to `board_path()`**, then pushes it to the ring.
- `:2065-2077` on the CLOSE edge: the same, with the muted count.
- `:2078-2081` only then, if still locked, `BLIND_MUTED.fetch_add(1)` and `return` — the mute.

Both transition rows go to the **file and** the ring. Nothing in that path is ring-only.
`blind_lock()` (`:2023-2035`) reads `data_dir().join("blind.lock")`, and fails **closed**: an
unreadable lock mutes.

**The producer of the lock agrees on the path.** `~/.claude/shell/blind.js:57-58` —
`const DATA = process.env.CONSONANCE_DATA || 'C:\\Consonance\\data'; const LOCK = path.join(DATA, 'blind.lock')`
— the same file `blind_lock()` reads. **There is no path mismatch to explain a zero.**

---

## 3 · THE LOCALITY EVIDENCE

**L was pushing normally throughout the window the registration calls blind.** The 08-28 registration
(`loop/boundary_falsifier_2026-08-28.md:23-25`) names one window, 2026-06-30 → 2026-08-01. L's board
spans **2026-06-30T08:05:32.435Z → 2026-09-16T11:26:40.890Z**, 40 distinct days — and inside that
window it carries:

    19,731 rows across 18 distinct days
      2026-06-30    23        2026-07-20   858
      2026-07-04   136        2026-07-21  2622
      …                       2026-07-27  6171
                              2026-07-28   717

A blind window mutes every push for its duration. **L pushed 19,731 times during it.** Whatever was
muted over those 33 days, it was not this machine.

**No lock has ever been left behind here.**

    ls C:\Consonance\data\blind.lock                      No such file
    find /c/Consonance -maxdepth 3 -iname "blind*"        (nothing)
    grep -c -i blind ~/.claude/shell/event_log.jsonl      0   (280 rows)

`blind.js` only prints to stdout — `:139`, `:141`, `:144-145` — and writes no ledger, so **there is no
positive record of it ever having been invoked on L, and equally none of it never having been.** That
asymmetry is the honest floor under this section: I can show no lock survives and no row was written,
not that the command was never typed.

---

## 4 · WHAT A ZERO MEANS FOR THE GUARD — SAID PLAINLY

**A guard with no input is indistinguishable, from its own output, from a guard working perfectly.**
On L the blind arm of `boundary-check.js` has never once had anything to refuse on. Every `HOLDS` it
has ever printed carried an unfired blind check, and the line that would have warned about a muted
stretch has never executed. The two states — *"no window ever happened"* and *"the detector is
broken"* — produce byte-identical output, which is the silent-absence class: **the same shape as
`append_synced_tail`'s missing-file arm returning in silence (my D055), and as `guard-census.test.js`
dying ENOENT while the suite read the silence as green.**

This measurement separates the two states **only because the input was supplied artificially** (§5).
Nothing in the tool's own output could have done it, and nothing will, on any future run, until a
window actually occurs.

### Two facts about the write path that bear on this, found while reading, offered as findings not design

1. **A transition row exists only if `board_push` is CALLED.** The edge is detected inside the funnel,
   so a lock created and removed while the app is down, or while nothing pushes, produces **no row at
   all** and the guard never learns the window happened. The mute is a property of the lock; the
   *record* of it is a property of traffic.
2. **`BLIND_LAST` is a process-global starting at 0** (`:2018`), reset every launch. Opening with the
   lock already present is handled — the first push sees `prev = 0 ≠ 2` and writes OPEN. But if the
   lock is removed **while the app is down**, the next launch starts at `prev = 0`, so
   `!locked && prev == 2` is false and **no CLOSED row is ever written**. `boundary-check.js`'s
   `blindOverlaps` pushes `[open, Infinity]` for an unclosed OPEN (`:175`), so the tool would report
   **UNMEASURED forever**, on every window, until someone hand-edits the board.

Neither is the cause of today's zero. Both are reachable, and both are the same species as the thing
being measured.

---

## 5 · THE POSITIVE CONTROL — the reader is live; the input is absent

Per P-UNIVERSE clause 2, a green from an instrument is not believable until it has been shown to go
red on a known positive. Run on a **copy** of `boundary-check.js` in my scratchpad, against two
ledgers identical but for two rows:

    BOARD_LEDGER=board_noblind.jsonl  node boundary-check.js --since 2026-01-01T00:00:00Z
      HOLDS - 0 of 1 dispatch(es) rendered without a sealed lap open.        exit=0

    BOARD_LEDGER=board_blind.jsonl    node boundary-check.js --since 2026-01-01T00:00:00Z
      UNMEASURED - the window overlaps 1 blind window(s).
        2026-08-29T10:40:50.000Z -> 2026-08-29T10:43:20.000Z
      Re-run with --since after the window closed.                          exit=2

**The consumer flips `HOLDS`/0 → `UNMEASURED`/2 the moment blind rows exist.** The detector works. The
absence is entirely input-side, which is the distinction the packet asked to be settled and the one
the guard's own output cannot make.

Files: `<scratchpad>/blindrows/` — `boundary-check.js` (copy), `board_noblind.jsonl`,
`board_blind.jsonl`, `lap.jsonl`.

---

## 6 · WHAT THIS DOES NOT ESTABLISH

- **Nothing about D.** The 2,473-entry figure and the two rows that would carry it are on D's board,
  which is not on this disk. The registration's own first line says every number in it is the
  desktop's. **The "the rows are genuinely on D" half of cause (2) is quoted, not measured.** D's
  board had 120,672 rows on 08-28; no file here has that count (133,999 / 269,032 / 30,758 / 30,160),
  so the boards are distinct lineages and L cannot answer for D's.
- **I did not run the Rust positive control.** `main.rs:12835`
  `a_blind_window_swallows_a_line_that_would_otherwise_reach_the_board` already asserts
  `during.contains("blind window OPEN")` — the room has a test proving the write path fires. Running
  it needs `cargo test --bin consonance`, which builds into the live app's `target/` while the app is
  running, and the standing rule from D055/D056 forbids that. **So the write path is established by
  reading plus an existing test I did not execute.**
- **`blind.js` writes no ledger**, so "no window was ever opened on L" rests on the absence of any
  lock file and of any row, not on a positive record of non-invocation (§3).
- **The 257 torn rows** are unparseable by construction; I checked them for the string `blind` and
  found only prose, but a row torn *through* its own `pane` field would not be recoverable by any
  check I ran.
- **This is one machine at one moment.** A window opened after 05:28 today is not in these counts.

---

## 7 · WHAT THE ANSWER DECIDES, WITHOUT DESIGNING IT

The packet says this measurement decides "whether the guard needs a code fix or a sentence in the
tool's output". **On the evidence: the write path needs no fix for this zero.** The rows are absent
because no window occurred here, not because the plumbing drops them.

The decision about what the tool should *print* when its blind input is empty — and what, if
anything, to do about the two reachable cases in §4.1 and §4.2 — is not mine to make in a
measurement packet, and it belongs to a seat that did not produce the number.
