# P-DELIVERY-CENSUS — C (CHARLIE), D074 composer lap 1, on D, measurement only

**Packet:** `exo_memory/loop/plan_composer_predicate_2026-09-19.md` @1ead762, row C (line 18) and the
falsifier (line 26). **Built nothing in the app; edited nothing tracked.** `main.rs` at HEAD 1ead762 is
clean (`git status --short consonance/src-tauri/src/main.rs` prints nothing), and every `main.rs:N` below
refers to that HEAD.

All scripts are read-only and live in my scratch:
`C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/census/`
(written `SCR/` below). Every run's output is saved beside its script.

---

## 1. The answer, plainly

**The dominant failure today is the composer, not the missing ready-stamp.** And the reason is
something the plan does not name: **Claude Code's prompt SUGGESTION.** It draws a dimmed guess of
your next prompt in the composer, e.g. `ok start the composer predicate`. It is drawn with **SGR 2
(dim) at the Default foreground**. vt100 0.15.2 has no case for SGR 2, so the dim attribute is lost
and the cells arrive as Default. `typed_only` keeps every Default cell, so `input_box_empty` reads
the suggestion as typed text, and the delivery holds until the 240 s bound.

- **6 of 6 forced deliveries had a suggestion in the receiving composer when they were released.**
- **None of the 16 non-forced deliveries whose composer row was located had one** (13 immediate + 3 held; 9 immediates could not be read, see §7).
- **The missing stamp is real, but it did not cause these holds.** Under a stamp, `PaneGate::Ready`
  asks the same `input_box_empty` (`main.rs:9050`, then `:8951`). All six would still have been
  forced, as `SignalOutranked` instead of `NoUsableSignal`.

`main.rs:8669-8672` already names this exact hazard in `typed_only`'s own doc comment:

> *"NOT SGR 2. The obvious guess is the dim attribute, and vt100 0.15 does not track it … Had the
> prediction been dim rather than grey, this fix would have been impossible without changing
> emulators."*

The suggestion *is* dim.

**The question is partly wrong as asked**, in two ways:

1. **"Unreadable composer OR missing stamp" is not a choice between alternatives.** The missing
   stamp *routes* every delivery on D to the screen gate (`Unstamped → bounded(screen_idle, …)`,
   `main.rs:8955`). `pane_idle_for_delivery` then includes the composer predicate as one of three
   AND-ed terms (`main.rs:8873-8877`). So the stamp decides *which* gate runs, and the composer
   decides *that* gate.
2. **The composer here is not unreadable. It is misread,** and misread in a specific direction: an
   empty composer showing a suggestion reads as "has text".

**What this does to the plan's falsifier (line 26), second arm:** *"If lap 1's tri-state shows 'has
text' dominating — the keeper's hand really in the composer — then the holds are correct
behaviour."*

A tri-state built on today's `typed_only` **will show "has text" on every one of these six**, and
the keeper's hand was in none of them. So as written, the arm would fire and wrongly acquit the
predicate. It needs a fourth state or a dim-aware reading before it can be scored. See §6.

---

## 2. Universe

**Every chair and librarian delivery on D from the 09-16 13:12 rebuild to 09-19 00:31:53 (the last
delivery in the ledger).**

Command: `node SCR/census.js` → `SCR/census-run1.txt`. It read `C:\Consonance\data\board.jsonl`
chair-audit rows (`pane=="chair"`, deduped on ts+text), `persist.log` `DELIVERY FORCED` rows, and each
receiving pane's transcript.

- **42** distinct chair-audit rows since the rebuild.
- **31** deliveries, over the 3 active routes:
  - `chair_inject` (`main.rs:9601`)
  - `call_chair` (`:9691`)
  - `call_librarian` (`:9757`)
- `dyad_spot` (`:8238`) and `deliver_pull` (`:9233`) made **0** deliveries in the window.

| class | n | route |
|---|---|---|
| immediate | 22 | 10 chair_inject · 8 call_chair · 4 call_librarian |
| held, then delivered inside the bound | 3 | queued |
| forced at the 240 s bound | 6 | queued |

The immediate and held sets are disjoint. Every call site returns early on a queue
(`if let Some(queued) = gate_or_queue(...) { return queued; }`), so a queued call never writes a
`[Received]` row.

**The four plan classes are not a partition.** "No-stamp fallback" is a *route*, not an outcome:

- **All 9 queued deliveries** carry `NO STAMP — fell back to the bounded screen gate`.
- The immediate path does not record the gate at all.
- By §4, every delivery on D was unstamped.

So the census reports outcome and route on two axes.

**Hold lengths**, taken from each QUEUED/DELIVERED pair on the board, then cross-checked against
arrival in the receiving transcript (all arrived 0.0–0.1 s after release).

**Held, then delivered:**

| queued | to | hold |
|---|---|---|
| 09-17 05:39:38 | A | 123.9 s |
| 09-17 05:39:44 | B | 121.2 s |
| 09-17 05:52:35 | librarian | 28.4 s |

**Forced:**

| queued | to | hold |
|---|---|---|
| 09-18 23:28:40 | Main | 240.3 s |
| 09-18 23:33:38 | librarian | 240.3 s |
| 09-18 23:38:17 | Main | 240.3 s |
| 09-18 23:50:25 | librarian | 240.3 s |
| 09-19 00:23:29 | Main | 240.4 s |
| 09-19 00:27:52 | E | 240.2 s |

Each forced delivery has a matching `persist.log` `DELIVERY FORCED … NO STAMP` row. Command:
`grep -a "DELIVERY FORCED" C:/Consonance/data/persist.log | tail -6` shows exactly these six panes, in
order.

**All 22 immediate deliveries** are found in the receiving transcript about 0.1 s *before* their audit
row, because the audit is written after the render wait. Two carry the receipt
`WRITTEN BUT UNCONFIRMED — no render in the pane's capture within 1800ms` (09-17 05:37:37 → A and
05:37:46 → B). Both did arrive, 1.8 s and 1.7 s before the row. The receipt was pessimistic, not
wrong about delivery.

---

## 3. What the receiving seat was doing during each hold

From the transcripts, via `census.js`: assistant and tool_result records during [queued, released].

| outcome | during the hold |
|---|---|
| 3 held, released early | the seat was **working**: 19 assistant + 7 tool records (A), 13 + 5 (B), 3 + 3 (librarian) |
| 6 forced | the seat was **idle for all 240 s**: 0 assistant, 0 tool records in every case |

The 3 early releases are the gate doing its job. The 6 forced holds were held against seats that had
nothing in flight. This agrees with E's L062 *"against idle panes"*.

---

## 4. The stamp: install drift, confirmed at source

| check | command | result |
|---|---|---|
| stamp dir | `ls -la --time-style=full-iso C:/Consonance/data/ready/` | **empty**; dir mtime 2026-09-06 10:51:23 |
| hook scripts on D | `ls ~/.claude/shell/lib/ready.js ~/.claude/shell/hooks/ready-{prompt,stop}.js` | **all three absent** |
| hook registration | `grep -c "ready-" ~/.claude/settings.json` | **0** |
| source in repo | `git log --format="%h %ad %s" --date=short -- dev/shell/hooks/ready-stop.js` | `c0d64f5 2026-09-06` (CHARLIE + ECHO, L041 chunk 1) |

So `read_stamp` returns `Stamp::Absent` for every pane (`main.rs:8547`), which is `Unstamped`, which
means the screen gate. The writers exist in the repo and were never installed on D. That is worth
fixing, but it is not the fix for §1.

---

## 5. What the pane's screen looked like — the captures

Raw PTY logs `C:\Consonance\data\captures\<pane>.log` carry **no timestamps**. So each delivery is
located by its own first render: the preview text, with words joined by a space or `ESC[1C`, or the
TUI's `[Pasted text #N +M lines]` marker, whichever comes first. The screen is then replayed up to
the last completed write before it.

**Instrument:** `SCR/screen/` is a standalone crate depending only on `vt100 = "=0.15.2"`, the app's
own emulator version. It was built `--offline` into its own `target/`, never the app's. Before
parsing, it rewrites SGR 2 to a marker colour `Rgb(1,2,3)` so dim cells can be seen, then classifies
the lowest `❯` row as EMPTY, GHOST (dim) or TYPED (Default, not dim).

- **The rewrite is the instrument's, not the app's.** `NO_REMAP=1` feeds the bytes exactly as the
  app does.
- vt100 has no SGR 2 case: `~/.cargo/registry/src/*/vt100-0.15.2/src/screen.rs:1400-1408` lists
  0, 1, 3, 4, 7, 22, 23, 24 and 27, and no 2.

Command: `node SCR/control2.js` → `SCR/control2-run3.txt`

| outcome | composer at release | n |
|---|---|---|
| **FORCED** | **GHOST** | **6 / 6** |
| held, then delivered | EMPTY | 3 / 3 |
| immediate | EMPTY, composer row located (rows 28/58) | 13 |
| immediate | EMPTY, but the lowest `❯` row found was a history row (rows 3/4/6/15/23), so the composer was **not located** | 5 |
| immediate | no `❯` row at all | 1 |
| immediate | delivery not found in the capture (A 23:42:38, B 05:37:46, C 00:27:57) | 3 |

**The six suggestions, verbatim from the composer row:**

| forced delivery | suggestion in the composer |
|---|---|
| Main 23:28 | `ok` |
| librarian 23:33 | `what is the orch doing rn` |
| Main 23:38 | `go ahead with chunk 2` |
| librarian 23:50 | `what is A doing rn` |
| Main 00:23 | `ok start the composer predicate` |
| E 00:27 | `Nothing yet — waiting on the last four mutants.` |

**The control that matters.** The same six screens with `NO_REMAP=1` (→ `SCR/raw-control.txt`) read
**TYPED 6 / 6**: the suggestion cells land at `Color::Default`. `typed_only` (`main.rs:8690-8705`)
keeps exactly those cells. So `input_box_empty` has typed text to find, and the screen gate cannot
open.

**Raw bytes, for anyone who distrusts the replay.** `node SCR/prompts.js 300000 6` →
`SCR/prompts-run1.txt`. Just before each paste, the composer write is e.g.
`ESC[59;3H ESC[?25h ESC[?25l ESC[m ESC[2m ok ESC[59;3H ESC[?25h ESC[22m`: the prompt row, dim on,
the text, cursor parked back at column 3.

**When the suggestions came back.** Command: `node SCR/bands.js` → `SCR/bands-run1.txt`. It counts dim
suggestion draws per byte band, with bands cut at offsets `control2` tied to clock times.

| log | band | dim suggestion draws |
|---|---|---|
| Main | 09-16 13:13 → 09-18 22:33 | **0** |
| Main | 22:33 → end | **4** |
| librarian | 09-16 13:15 → 09-18 22:47 | **0** |
| librarian | 22:47 → end | **4** |

Before the rebuild, Main's log holds 197 of them (`SCR/onset.js` → `onset-run2.txt`: 201 dim and **0**
grey suggestion draws in Main's whole log).

So the suggestion has always been dim in this form, and never the grey 153 the P-GHOST-TEXT fix keys
on. It was simply absent for two days and present again from 22:33 on 09-18, and **every forced
delivery falls inside that return.**

The version trace (transcript `"version"` fields) shows Main moving to 2.1.278 at 22:27 on 09-18 and
the librarian to 2.1.277 at 22:25. **Correlation only:** see §7.

---

## 6. The librarian's pointer, re-derived

The pointer's figures were 9 injects / 0 forced / 15 no-stamp. Re-derived at 00:4x on 09-19 from
`board.jsonl` (pane=chair, ts ≥ rebuild, deduped):

```
{"inj":10,"nostamp":18,"nsQ":9,"nsD":9,"forcedRow":6,"queued":9,"delivered":9}
```

| pointer said | actual | why |
|---|---|---|
| 9 injects | **10** | D074's own inject to C (00:27:57) postdates the pointer, so this is timing, not error |
| **0 forced** | **6** | Wrong whenever it was counted after 23:32:40 on 09-18. The FORCED marking is on the **DELIVERED** row, not the QUEUED row, so a count of "chair injected" or QUEUED rows cannot see it. 5 of the 6 were already on the board by 23:5x. |
| 15 no-stamp | **18 rows = 9 messages** | Each held message writes `NO STAMP` twice, once on QUEUED and once on DELIVERED. The unit is the message, not the row. |

**Recommendation for lap 1's tri-state, as a finding, not a design:**

- The E build should report **four** composer states: empty / suggestion (dim) / typed / unknown.
- A dim reading needs either an emulator that records SGR 2, or a byte-level pre-pass like
  `SCR/screen`'s.
- Without it, falsifier arm 2 cannot be scored honestly.

The fix for today's holds is the same fact: **treat a dim composer as empty**. It is E's `main.rs`,
not mine.

---

## 7. What is NOT verified

- **I did not run the app's own `input_box_empty` / `composer_row` on these screens.** My classifier
  reads the lowest `❯` row, not the rule-anchored `composer_row` (`main.rs:8753`). The claim "the app
  read these as not-empty" rests on:
  1. `typed_only` keeping Default cells (read at source);
  2. the six cells being Default under the app's emulator (`NO_REMAP`, measured);
  3. the gate never opening in 240 s (measured).

  E's tri-state build is the instrument that closes this.
- **The other two AND-terms are not excluded by measurement.** The logs have no clock, so I cannot
  show that the PTY was quiet for ≥ 2 s, or that no `esc to interrupt` row stood outside the footer.
  - The suggestion is *sufficient* to hold forever, and it is present in 6/6.
  - Quiet is *likely* (0 transcript records, and the bytes between the suggestion draw and the paste
    are a few hundred to ~10 k B of chrome).
  - But "quiet also failed" is not ruled out.
- **Geometry is inferred, not logged.** Nothing records a pane's size.
  - From the max `ESC[r;cH` address, the librarian read 61x177, and at that width **both librarian
    suggestions were invisible** (run 2 said EMPTY). At 311 and 324 columns both show.
  - Run 3 therefore floors Main/librarian at 324 columns; `COLS_FLOOR=0` undoes it.
  - One immediate delivery (Main 23:55:11) read TYPED at the inferred 179 columns and EMPTY at
    250/311/324/340. I count it EMPTY and say so here.
  - **This is the L053 lesson again: a replay at the wrong width manufactures and hides composer
    text.**
- **9 of the 22 immediate composers were not read:** 5 not located, 1 without a `❯` row, and 3
  deliveries not found in the capture. So the negative control is **16 located EMPTY** (13 immediate + 3 held), not 25.
- **Why the suggestions stopped on 09-16 and came back on 09-18 is not established.** A version
  change (2.1.277/278) and a setting change are both possible. Nothing here separates them.
- **The window is D only, and ~60 hours long, with n = 6 forced.** The 6/6 vs 0/16 split is clean,
  but it is small.
- **Arrival anchoring uses first-occurrence text.** A message quoted in a pane *before* it arrived
  would mis-anchor. I checked the six forced cases by hand in `prompts-run1.txt`, not the 22.
- **The 240 s bound held exactly, 240.2–240.4 s.** I did not check whether each forced message
  spliced into anything. Nobody's hand was in those composers, so there was nothing to splice into.

## 8. Corrections I made to myself on the way

1. **Run 1 of the screen control read 6/6 EMPTY.** The replay ended at the last write *before the
   composer draw*, and in the pasted cases that draw **is** the suggestion draw. The endpoint was
   moved to the paste marker for pasted deliveries (run 2).
2. **Run 2 read the two librarian cases EMPTY** because the inferred width (177) was too narrow.
   Floored at 324 columns (run 3).
3. **The first heuristic control** (`SCR/control.js`, dim runs in the last raw draw) flagged three
   immediates as GHOST. One was a dim `1` from a table, one was a suggestion that was already gone. It
   was noisy in both directions, so it was **discarded**, not reported.
4. **My summary from before compaction said the pointer's 15 no-stamp "double-counts".** The board now
   has **18** rows for 9 messages. "Double-counts" was the right mechanism; 15 was a snapshot.
