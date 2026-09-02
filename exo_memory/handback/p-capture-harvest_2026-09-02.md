# P-CAPTURE-HARVEST — LEG 1 hand-back. The detector is not the fault.

**ECHO, 2026-09-02 ~07:00. L033. Leg 1 only; `main.rs` untouched, leg 2 not started.**

## THE ANSWER, IN THE PACKET'S OWN FORK

> *if 0 records → the READY-SCREEN DETECTOR is the fault.*
> *if >0 records → the fault is upstream of it. **SAY WHICH.***

**>0 records. The ready-screen detector is NOT the fault. The fault is UPSTREAM of it.**

The candidate the packet offered — *the prompt bar changed with the 02:38 build or the model switch,
so the pattern the detector matches is no longer on screen* — is **refuted**, not merely unsupported.
`capture::screen_ready` matched screens these panes painted right up to the last chunk of their logs.

## THE INSTRUMENT

New file, and it is the deliverable as much as the number is:

    consonance/src-tauri/src/bin/harvest_replay.rs      (untracked, uncommitted)

    cd consonance/src-tauri
    cargo run --bin harvest_replay -- C:/Consonance/data/captures

It `#[path]`s into the real `capture.rs` — no copy — feeds a log's bytes through a `vt100::Parser`
at `EMU_ROWS`/`EMU_COLS` (34x120, `main.rs:894-895`), and at every 8 KB boundary runs the watcher's
own sequence: `screen_ready` → `strip_overlay` → `latest_prompt` → `latest_turn` → the watcher's
two-level dedup. `records` is what would have been **appended**, not how many frames looked ready.
The pattern is `cochlea_replay`'s and `capture_probe`'s, which is why it was the shape chosen.

**Its one deliberate asymmetry, stated because it decides what the number can prove.** The log
carries no timestamps, so the ~500ms quiescence gate cannot be replayed. The replay evaluates at
EVERY chunk boundary — a **superset** of the real settle points. Therefore `ready == 0` would have
been conclusive, and `ready > 0` proves the detector matches these screens but **does not** prove the
live watcher would have fired. That asymmetry runs in the direction of the finding: it makes the
"detector is broken" answer easy to reach and the one below hard.

## THE NUMBERS — every capture on this machine, one run

| pane | .log | ready | records replayed | .txt on disk | .txt mtime |
|---|---|---|---|---|---|
| `0845a868` | 36.7 MB | 181 | **85** | 13,569 B (18 records) | **02:39** |
| `12fb81f6` | 44.5 MB | 209 | **47** | 5,223 B | **02:39** |
| `6fe15f0a` | 83.3 MB | 301 | **210** | 5,108 B | **02:39** |
| `a2122153` (me) | 20.6 MB | 122 | **11** | 5,295 B | **02:39** |
| `0c0c0c0a` (MAIN) | 295.3 MB | 729 | 522 | 4,312,356 B (2,187 records) | **06:41** |
| `0c0c0c0b` (MIKE) | 1.0 MB | 0 | 0 | 1,497 B | — |
| `3d000000` (Third Place) | 37 KB | 0 | 0 | 1,609 B | 06:34 |

`.txt` mtimes from `ls -la --time-style=+%m-%d\ %H:%M /c/Consonance/data/captures`; record counts
from `grep -c "^❯ " <file>.txt`.

**MAIN IS THE CONTROL AND IT IS THE LOAD-BEARING ROW.** Same binary, same watcher, same directory,
same night: 522 records replayed, 2,187 on disk, mtime 06:41. Harvesting is alive in this process.
Whatever failed did not fail globally.

**AND THE OBJECTION THE TABLE ALONE DOES NOT ANSWER**, because these `.log` files span more than one
app session and a replay from byte 0 would happily count ready screens from *before* 02:39. So the
last **3 MB** of each stalled pane's log was cut with `tail -c 3000000` and replayed alone:

| pane | ready in last 3 MB | records |
|---|---|---|
| `0845a868` | 4 | 3 |
| `12fb81f6` | 7 | 0 |
| `6fe15f0a` | 5 | 1 |
| `a2122153` | 5 | 2 |

Ready screens in bytes written at the very end of the night, on all four. On my own pane the last
extracted prompt is `land map/E.md by name, then restart consonance` — a turn that is **not in my
`.txt`**, which ends at `❯ /model`. The extractor, over the same bytes, produces content the live
watcher never wrote.

## WHICH UPSTREAM — narrowed to two, and NOT separated

The packet named two: *the watcher never fired,* or *fired and its write went somewhere else.*

**"Wrote somewhere else" is refuted.** `capture_text_path` (`main.rs:776`) is
`capture_dir()/<pane>.txt`, deterministic, and MAIN's write lands there correctly in the same run.
Every pane is spawned through the single `spawn_claude_pane` (`main.rs:910`; 12 call sites, no second
path), so every pane gets a watcher thread. There is no other directory and no second writer.

**So: the watcher stopped, per-pane, while the reader thread kept growing the `.log`.** Two
mechanisms in that function produce exactly this signature, and **I did not separate them**:

1. **A poisoned emulator mutex.** `main.rs:1070-1073` — the watcher does
   `match emu_w.lock() { Ok(e) => e, Err(_) => break }`. A poisoned lock **breaks the loop
   permanently.** The reader, four lines up at `:1038`, uses `if let Ok(mut e) = emu_r.lock()` and
   simply skips — so it keeps writing the `.log` forever. One panic anywhere holding that lock ends
   harvesting for that pane and nothing else changes.
2. **A panic inside the watcher's own body**, killing the thread. The lock guard is dropped before
   extraction, so this leaves the mutex UNpoisoned. Same disk signature.

Both are **silent by construction**. Neither writes anything. The `.txt` of every stalled pane ends
at `❯ /model` — the first settled screen after the 02:38 relaunch — so each watcher harvested the
startup turn and then stopped, which is what a fault shortly after the first harvest looks like.

**The observation that would separate them, and I could not run it:** if the mutex is poisoned,
every OTHER emulator reader for that pane is also failing (`pty_resize` at `:912`'s size path, and
anything that reads the screen). That is a live-process check needing the app running and the
keeper's hands. If a resize still renders those panes correctly, mechanism 1 is out and it is 2.

## THE REAL DEFECT, ONE LAYER UP — and it is why this took a 36 MB replay to see

**The watcher has no liveness signal of any kind.** A thread that stops has the same disk
footprint as a pane that has been quiet: the `.txt` mtime cannot tell *nothing was harvested* from
*harvesting ran and produced nothing* — the shape the packet warned about, and it is the reason the
stall ran four hours across four panes with every instrument green. Whatever leg 2 changes, the
thing that would have caught this in minutes is a per-pane last-harvest-attempt stamp the UI can
read. **Naming it, not building it** — it is outside this packet and it is in `main.rs`.

## BARS

1. **THE REPLAY IS THE INSTRUMENT** — met. Pointed at the real logs on disk (36.7 MB and six
   others, 481 MB total), never a synthetic fixture. The 3 MB tails are cuts of those same files.
2. **RED FIRST on leg 2** — **not reached.** Leg 2 not started.
3. **MUTANT on leg 2** — **not reached.**
4. `node consonance/tools/js-suite.js`: **69 files discovered, 69 ran, 0 NOT-RUN, 3 FAILED** —
   `actors.evidence.test.js`, `corpus-age.test.js`, `carrier-drift.test.js`. All three are the
   standing reds; none is mine, and none is in this packet's files.
   `cargo test --bin consonance` **NOT RUN** — it compiles `main.rs`, which ALPHA held for this lap.
   `cargo build --bin harvest_replay` exits 0; the bin does not include `main.rs`.
5. **What I did NOT verify** — see below.

## WHAT I DID NOT VERIFY

- **That the live watcher would have fired.** The replay is more permissive than the watcher by
  exactly the quiescence gate. It proves the detector matches; it does not prove the gate opened.
- **Which of the two mechanisms it is.** Named, not separated. Do not let the poisoned-mutex reading
  become the cause by being written down first — it is the more interesting of the two, which is a
  reason to distrust it.
- **When each watcher died**, beyond "at or shortly after the first settled screen following the
  02:38 relaunch". The log has no timestamps.
- **`0c0c0c0b` (MIKE) and `3d000000` (Third Place)**, both NEVER READY across their whole logs.
  Their `.txt` files are tiny, and Third Place's advanced at 06:34, so they are a different pane
  shape and possibly a different question. **They are not evidence for anything above** and I did
  not chase them.
- **`cargo test --bin consonance`.** Gated on A.
- **Anything about the fix.** Leg 2 is not started and the stall is **not** fixed. Per the packet:
  the `.txt` advancing on four live panes needs a rebuild and a relaunch, which are the keeper's
  hands, not mine.

## CORRECTIONS I MADE TO MYSELF

- The first version of the replay counted **ready frames** and I nearly reported that as the record
  count. It is 181 vs 85 on the first pane — a 2.1x difference in a number whose name would have
  claimed it was turns. The watcher's own dedup key was added so `records` means what it says.
- I read the whole-log numbers as decisive before noticing the logs span multiple app sessions.
  The 3 MB tail run exists because that first reading was not entitled to the conclusion.

## PATHS TOUCHED (nothing committed)

    consonance/src-tauri/src/bin/harvest_replay.rs     NEW, untracked
    exo_memory/handback/p-capture-harvest_2026-09-02.md  this file
    exo_memory/map/E.md                                one appended line

Scratch cuts (`tail_*.log`) are in the session scratchpad, not the repo.

**Non-author read: B.**
