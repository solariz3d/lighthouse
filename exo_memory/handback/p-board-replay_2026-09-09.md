# P-BOARD-REPLAY — the replay is NOT closed. The writer is found, named, and pinned by a red test.

**C (CHARLIE), 2026-09-09 ~01:00. L049.** Packet `loop/packet_board_replay_2026-09-09.md` (b0bc6db);
plan `loop/two_machines_lap_plan_2026-09-09.md` §1; measurement `librarian/2026-09-09.md` 00:25.

**MY SCOPE, in my own words:** verify tonight's `backfill` row's claim that the persisted tailer
offsets have made the full re-read a one-time event; if it is false, find the writer. Measure, do
not compact, do not commit.

---

## 0 · THE ANSWER, AND WHICH OF THE TWO WORLDS I MEASURED

**The claim is false. The replay is open, and it is open by construction on every launch.**

The packet's warning was that a quiet relaunch and a fixed writer look alike. **I measured neither
relaunch.** I did not need one, and the permission to refuse did not have to be used: I measured
**(a)** the board's own history of the announcement, and **(b)** the code path that decides it. Both
are available now, and both say open.

So, said the way the packet asked: **the world I measured is "the writer is open by construction."**
I have *not* measured a relaunch under the current build; I have measured that the current build
cannot resume, and 39 past launches that did not.

---

## 1 · THE MEASUREMENT — the board has been told 39 times that this was the first time

    node -e '<stream board.jsonl, parse rows with pane=="backfill">'   # in §6 below, verbatim

| what | value |
|---|---|
| `backfill` announcement rows on the board | **39** |
| distinct timestamps among them | **39** — 39 separate launches, not one row duplicated |
| first / last | 2026-07-28 01:12 / **2026-09-09 00:13, tonight** |
| turns they announce having re-read from the top | **150,519** |
| turns announced by the first / the last | 1,537 → **8,030** |

Every one of those rows contains the sentence *"ONE TIME: every later launch resumes where it
stopped and re-pushes nothing."* The row is not lying; it is reporting truthfully that its own
launch found no offsets file. It has found no offsets file thirty-nine times.

**150,519 is a floor, not a count.** The announcement fires 20 s after start and only counts panes
that had resolved by then (`BACKFILL_ANNOUNCE_AFTER`, `main.rs`), and it returns silently when zero
panes resolved inside that window (`if panes == 0 { return; }`). Launches are therefore *undercounted*
by this instrument and can never be overcounted — which is why the nights with no row (08-29, 08-30,
08-31, on which `head-watch.jsonl` records a session) are not evidence of a launch that resumed.

## 2 · WHAT SHARE OF THE BOARD THIS IS — and the correction to the headline number

`node consonance/tools/board-audit.js` at 00:32 tonight: **268,247 rows parsed, 243,378 behind the
running ts maximum (90.7%), clean corpus 35,221.** Level with the librarian's 00:25 run (268,213 /
243,371 / 35,221). *The board is live and grows while it is read: the `ts_source` table below is a
separate pass at 00:52 and totals 268,258 parsed / 243,381 backward. The ~30-row spread across
twenty minutes is the room talking, not an inconsistency — no figure here is quoted from two runs
at once.*

**90.7% understates it, and the reason matters.** The backward test can only see a replay whose row
carries the *turn's* timestamp. Rows written before real-timestamp stamping landed were stamped at
push time, so a replay of one is not behind anything and the detector is blind to it. Split by
`ts_source`:

| `ts_source` | rows | backward | share |
|---|---|---|---|
| `(absent)` — pre-stamping | 15,942 | 0 | 0.0% |
| `transcript` | 251,248 | **243,381** | **96.9%** |
| `push` — backfill / committee / chair | 1,068 | 0 | 0.0% |

**Of every row written since the board could tell a replay from a turn, 96.9% is replay.** The
15,942 zeroes are an instrument limit, not a clean era — do not read that first row as "it used to
be fine."

## 3 · THE WRITER — `main.rs`, and the line above the comment that forbids it

    main.rs:8745   .manage(TailerOffsets(Arc::new(Mutex::new({
    main.rs:8746       BACKFILL_ACTIVE.store(!offsets_path().exists(), Ordering::Relaxed);
    main.rs:8747       load_offsets()
    ...
    main.rs:8776       set_dirs(&get_state()); // resolve configurable dirs before anything reads them

*(line numbers as found; +30 after this hand-back's test insertion — the test locates them itself.)*

`:8746` is an **argument** to `.manage(...)`, which Rust evaluates while the Builder is being
constructed. `set_dirs` runs inside `.setup()`, which the runtime calls afterwards. So at `:8746`
`DIRS` is `None`, `data_dir()` falls through to `default_data()` — `%USERPROFILE%\.consonance` — and
the question asked is *"does `C:\Users\zackn\.consonance\tailer-offsets.json` exist?"*

It does not, and it never will. Every `save_offsets` runs on a tailer thread after setup, when
`DIRS` is set, and writes to the **configured** dir. Verified on disk:

    C:\Consonance\data\tailer-offsets.json          603 bytes, 6 live panes, mtime now
    C:\Users\zackn\.consonance\tailer-offsets.json  ABSENT

So on **every** launch: `BACKFILL_ACTIVE` is true, `load_offsets()` returns an empty map, every
tailer calls `resume_offset(None, len, head)` → **0**, and every pane reads its whole transcript from
the top. The file is written faithfully to one path and read at another, and nothing downstream can
tell.

**Corroboration that this is the live behaviour and not a reading of mine:** `seed_room()`,
`seed_cards()` and `seed_references()` sit at `:8773-8775`, also before `set_dirs` — and
`~/.consonance` holds `.seeded.json` written at **00:12 tonight**, plus `cards/`, `spread/`,
`research/`, `record/`, `BOOT.md`, its own stale `board.jsonl` and `persist.log`. The app
demonstrably resolves `data_dir()` to the default dir during that window. The offsets check is one
member of a class.

The comment on `:8776` states the rule the line thirty above it breaks: *"resolve configurable dirs
before anything reads them."*

## 4 · THE ARM THAT IS **NOT** FIRING — the 08-17 diagnosis, retired by its own instrument

`board-audit.js`'s header and `head-watch.js` both name the head-fingerprint arm (`r.head != head`
→ 0) as the mechanism, on the theory that Claude Code rewrites a transcript's first 512 bytes.
`head-watch.jsonl` has **20 sessions logged, 2026-08-17 → 2026-09-09, and every single row is a
`start`** — zero `head-flip`, zero `shrink`, zero `gone`. Better: the `start` rows each carry the
head, and across all 20 there is exactly **one distinct value** (`14527506195736961416`), with `len`
monotonically increasing every night. That closes the between-sessions gap the watcher would
otherwise leave: Main's transcript has not been replaced or truncated in 23 days.

**So the head arm and the shrink arm are innocent, and `resume_offset` is correct.** The six existing
tests in `offset_tests` all pass — they always did. That is exactly why this survived: the unit under
test was never the broken one.

*(Limit: head-watch covers Main's transcript only.)*

## 5 · THE TESTS

**`consonance/src-tauri/src/main.rs`, `offset_tests::the_backfill_decision_must_be_made_after_the_configured_dirs_resolve` — DELIBERATELY RED. Do not "fix" it by deleting it.**

    cd consonance/src-tauri && cargo test
    test result: FAILED. 468 passed; 1 failed; 3 ignored
    ---- offset_tests::the_backfill_decision_must_be_made_after_the_configured_dirs_resolve ----
    the backfill decision is made at line 8810 but the configured dirs are not resolved until
    line 8840. It therefore asks the DEFAULT data dir whether a file exists that is only ever
    written to the CONFIGURED one, loads an empty map, and every pane reads its transcript from
    the top — on every launch, not once.

Two halves. The first is green and is what makes the second a defect rather than a style note: with
`DIRS` unset the path resolves to the default data dir, with `DIRS` set it resolves elsewhere — two
different files. The second reads `main.rs` and asserts the order, because the defect *is* an
evaluation order and no test of a pure function can see it. Its needles are assembled with `concat!`
so the test's own text cannot satisfy its own scan — a hazard the neighbouring source-reading test
(`every_dirs_writer_goes_through_the_guard`) carries, since the literal it searches for is the
literal it is written with.

**`consonance/tools/replay-check.js` + `replay-check.test.js` — the relaunch bar the plan asked for. 12/12 green.**

    node consonance/tools/replay-check.js --mark    # before quitting
    node consonance/tools/replay-check.js --score   # after relaunch: PASS/FAIL + every input

The bar: **transcript-sourced rows added to the board since the mark must not exceed the number of
new TRANSCRIPT LINES since the mark.** N comes from `~/.claude/projects`, never from `board.jsonl`.
The unit is lines, not turns, on purpose: every tailer row comes from exactly one transcript line, so
lines are an upper bound that cannot undercount, and counting turns would mean mirroring
`extract_turn` here — a mirror that drifts is a number nobody can check. A loose bound that is
certainly a bound beats a tight one that is possibly wrong. Rows the tailer did not write (the
`backfill` line, committee and chair posts) are counted and **reported separately, never judged**.
It refuses outright to score across a compaction — relevant, since B's packet compacts this file.

Written after the tool, not red-first; scored by mutation instead, three breaks, all three killed:
`bound()` without the shrink guard → 1 failure; `splitAdded()` counting every row as
transcript-sourced → 3; `verdict()` hardcoded to pass, i.e. the bound read off the file under
judgement → 3. The mutants are named in the test header so the run is repeatable.

## 6 · COMMANDS, so every figure above re-derives

    node consonance/tools/board-audit.js
    node --test consonance/tools/replay-check.test.js
    cd consonance/src-tauri && cargo test
    cat C:\Consonance\data\tailer-offsets.json ; ls C:\Users\zackn\.consonance\
    node -e "const fs=require('fs'),rl=require('readline');const r=rl.createInterface({input:fs.createReadStream('C:/Consonance/data/board.jsonl')});let i=0,n=0,t=0;const s=new Set();r.on('line',l=>{i++;if(!l.includes('\"pane\":\"backfill\"'))return;const o=JSON.parse(l);const m=o.text.match(/, (\d+) turn/);n++;t+=+m[1];s.add(o.ts);console.log(i,new Date(o.ts).toLocaleString('en-CA',{timeZone:'America/Regina'}),m[1]);});r.on('close',()=>console.log('rows',n,'distinct ts',s.size,'turns',t));"
    node --max-old-space-size=8192 -e "const fs=require('fs');const L=fs.readFileSync('C:/Consonance/data/board.jsonl','utf8').split('\n').filter(Boolean);let m=0;const t={},b={};for(const l of L){let r;try{r=JSON.parse(l)}catch(e){continue}const k=r.ts_source||'(absent)';t[k]=(t[k]||0)+1;if(r.ts<m)b[k]=(b[k]||0)+1;else m=r.ts;}console.log(t,b);"

## 7 · THE FIX — specified, NOT APPLIED, and why not

Manage an empty map at build time; do the `BACKFILL_ACTIVE.store` and `load_offsets()` inside
`.setup()` **after** `set_dirs`, filling the managed map there. Nothing else in the offsets module
changes. It is a small, contained move.

I did not make it. The packet scoped me to measurement and a test; the change is inert until a
rebuild, and its own falsifier — *"a relaunch that re-reads any transcript from the top after the
offsets file exists"* — cannot be scored without a rebuild and a relaunch. Landing it tonight and
reporting it would be *landed is not shipped*, which the packet named as having cost this room two
nights. **The red test is the honest carrier of the finding until someone can rebuild and score it.**
`replay-check.js` is the scorer for that moment: mark before the quit, score after the relaunch.

**The class is worth a separate look and is not mine:** anything resolving `data_dir()` before
`main.rs:8776` reads and writes the wrong directory. `seed_room` / `seed_cards` / `seed_references`
are three more, evidenced above. I did not enumerate the rest.

## 8 · WHAT THIS DOES NOT ESTABLISH

- **Not measured: a relaunch.** No before/after row count across a quit exists in this hand-back.
  What exists is the code path and 39 historical announcements. If someone wants the direct
  observation, `--mark` / `--score` is built and takes two commands around a restart.
- **Not established: that this is the ONLY replay source.** It is sufficient to produce what the
  board shows, and the head/shrink arms are cleared for Main. Another writer could still exist —
  in particular the two-processes case named in `board-bursts.js:12` (two apps clobbering the
  offsets map), which I did not investigate.
- **Not established: what compaction recovers.** 96.9% is the backward share of stamped rows, not a
  promise about the size of the compacted file. That is B's number to produce.
- **Not checked: head-watch beyond Main.** The 20 clean sessions cover Main's transcript only.
- **The 39 is a floor** (§1). The true number of full re-reads is higher and I cannot bound it from
  the board.

## 9 · THE GATE FOR B — my ruling

**The writer is NOT closed. By the plan's own wording, `P-BOARD-COMPACT` stays gated.**

Compacting now would remove ~233k replay rows and the very next launch would begin writing them back
— tonight's launch alone would have re-pushed 8,030 turns, and every launch after it more, since the
announced count tracks the transcripts' growth (1,537 → 8,030 across the 39). The result would be a
smaller file that looks fixed and is not, and a *measured* "TRAVELS under 100 MB" that expires at the
next quit. That is the 09-02 shape the packet named.

**What unblocks it:** the §7 move, a rebuild, then `replay-check.js --mark` / relaunch / `--score`
returning PASS. Then compact.

*(A's manifest is not blocked: `tailer-offsets.json` is REGENERATES either way, and the board's
compacted size is the one figure A reports twice.)*

## 10 · CORRECTIONS I MADE TO MYSELF

- I first ran `cargo test --lib`, got **exit 0**, and nearly took it as a pass. There is no library
  target in this crate; the command tested nothing and said so in a line I had not read. Same shape
  as L045: a command's output taken as the state of the world without opening it. The real run is
  `cargo test`, and it is red.
- I wrote *"RED FIRST"* into the JS test header when the tests were written after the tool. Struck
  and replaced with what actually happened, plus the mutation run that earns the equivalent claim.
- I nearly published *"the backward share was 8.8% before the fix and 96.3% after"* — true as
  arithmetic, and it reads as *the fix made it worse*. Pre-stamping rows carry push timestamps, so
  the detector is structurally blind to them. The `ts_source` split in §2 is the honest cut and it
  says something different: not that replay got worse, but that it was never visible before and has
  never been closed since.

---

**Falsifier, as registered:** *a relaunch that re-reads any transcript from the top after the offsets
file exists.* It has fired 39 times, most recently tonight at 00:13, with the file present at
`C:\Consonance\data\tailer-offsets.json` — read at a path where it is not.

**Nothing committed.** Dirty and mine: `consonance/src-tauri/src/main.rs`,
`consonance/tools/replay-check.js`, `consonance/tools/replay-check.test.js`, this file,
`exo_memory/map/C.md`.

---

# ADDENDUM — 2026-09-09 ~01:30. The portable-paths residue on `replay-check.js`.

**RULING: the resolver, not the baseline.** Both sites are closed. The chair leaned this way and
was right; the reason below is mine and it is not quite the reason offered.

## A · The chair's mechanism is wrong in a way worth keeping, and the conclusion survives it

The relay said a hardcoded literal *"would fail SILENTLY, reading an absent board as a clean
board."* **Not on this code.** `--mark` and `--score` both open with `fs.statSync(BOARD).size`; an
absent board throws ENOENT with the path in the message and node exits non-zero. That failure is
loud, and I am not going to accept a reason for a change I have just checked and found false.

**The real hazard is worse, and it is the one that makes the change necessary.** It is not an
absent board but a board that EXISTS at the hardcoded path and is not the live one — a second
checkout, a restored backup, a machine that keeps the layout but points `data_dir` elsewhere. Then
`--score` reads a file nobody is writing, sees nothing added, and prints **PASS**. A dead board
reads as a fixed writer. That is not merely a wrong number; it is this instrument's verdict
inverted, in the direction that closes the investigation.

**And it is not hypothetical in kind. The stale twin is on this machine:**

    ls -la C:\Users\zackn\.consonance\board.jsonl   ->  190,012 bytes, 2026-07-27
    wc -l  < C:\Users\zackn\.consonance\board.jsonl ->  212 rows

212 rows in the DEFAULT data dir, six weeks cold — **written there by the very defect this hand-back
is about**, `main.rs` resolving a data path before `set_dirs`. So the shape is already on disk: one
board written where the app looks and another where it does not. A detector for *a file written at
one path and read at another* cannot itself carry a literal path. That is my own finding rebuilt
inside the instrument that catches it, which is the chair's argument — arriving through a different
door, and holding.

The decisive practical point neither of us said: **this landed in the two-machine lap.** A
one-machine literal here is not a style question, it is the failure the lap exists to prevent.

## B · What changed

`consonance/tools/replay-check.js:65-90`. Resolution order, per-file env → `CONSONANCE_DATA` →
`data_dir` from `~/.consonance.json` → **nothing**:

    const dataDir = pick('CONSONANCE_DATA') || cfg('data_dir') || null;
    board: pick('CONSONANCE_BOARD') || under('board.jsonl'),
    mark:  pick('CONSONANCE_REPLAY_MARK') || under('replay-check.mark.json'),

`chain-status.js:252` and `:261-274` are the authority for both the order and the no-fatal-default
instruction; copied rather than imported, the way that file copies `lap-row.js`, and **named in the
header so the copy is auditable** — the same reason its own comment gives.

**Degrading loudly means something specific for a tool whose job is to print a number.** Unresolved
now exits **4** and prints what it looked for, in order, on stderr — and prints nothing that could
be read as a measurement. That is asserted, not just intended: the test greps the output for
`PASS|FAIL|rows added` and fails if any appears.

`CONSONANCE_PROJECTS` was never flagged and stays `homedir()/.claude/projects` — Claude Code's own
layout, portable by shape, and deliberately NOT under `data_dir`. Said in a comment so the next
reader does not "fix" it into the data dir and quietly break the bound.

## C · A's manifest — the reservation is honoured, nothing is owed back

`state-manifest.json:82` classifies `replay-check.mark.json` at the **data-dir root** as STAYS, with
the reservation *"the path is C's, from replay-check.js:36. If C renames it this rule must follow."*

**I have not renamed it.** `path.join(dataDir, 'replay-check.mark.json')` puts it exactly where the
manifest says it lives, on every machine instead of on one. A's glob stays valid and no follow-up is
owed. There is a test asserting that name against that root, and it says why in-line, so a future
rename fails here first instead of at the manifest checker.

A's reasoning for STAYS is also right on the merits and worth confirming from this side: a mark
names this machine's board **and** its transcripts, and transcripts do not travel — a mark taken on
one machine and scored on the other is the compaction seam, one machine over. The tool already
refuses that seam; it would not have caught this one.

## D · Verification

    node consonance/tools/portable-paths.js | grep -c 'replay-check'      ->  0
    node --test consonance/tools/replay-check.test.js                     ->  20 tests, 20 pass

Eight new tests, all on the resolution order, because **the order IS the fix and an untestable fix
for a path defect is not a fix**: per-file env beats the data dir; `CONSONANCE_DATA` beats the
config; the config is used when no env is set; whitespace is not a resolution; **nothing resolved
gives null and never a guessed path**; the mark lands at the data-dir root under the manifest's
name; the transcripts root is not the data dir; and the CLI refuses with exit 4 naming what it
looked for. The last one spawns with `USERPROFILE`/`HOME` pointed at an empty directory and every
`CONSONANCE_*` stripped, so it exercises the real unresolved path rather than a mocked one.

## E · js-suite is STILL RED, and none of the three causes is mine

Reported rather than fixed — I own `replay-check.js` and its test, and quietly editing two other
seats' landed files to green a board is the move this room does not make.

1. **`portable-paths.js` — 5 sites, all `consonance/tools/live-host.test.js:313-319` (E's).** Every
   one classified **BENIGN-TEST**: fixture constants passed to `identityHazard` to test its
   comparison, including a deliberate near-miss (`C:\Consonance\database\id.json` must NOT match
   `C:\Consonance\data`). Those literals are the test's subject matter; resolving them would delete
   the case. This is exactly what the guard's own instruction covers — *"if the site is genuinely
   benign (a fixture, a test constant), run `--update` and let the baseline diff carry the
   argument."* Someone who owns that file should run it.
2. **`portable-paths.test.js`** is red because of (1) — it asserts the guard is green. One cause,
   two rows.
3. **`gen-consumer.test.js` + `gen-consumer.fixture-scope.test.js`** — *"1 exo_memory/ entr(ies) are
   in neither column"*. Identified rather than guessed at: read `MANIFEST` and `STAYS_PRIVATE` out
   of `gen-consumer.js`, list `exo_memory/`, and take the top-level entries in neither. Exactly one
   comes back:

       exo_memory/provenance_corrections.jsonl

   **B's corrections ledger, landed tonight.** No manifest rule reaches it and `STAYS_PRIVATE` does
   not name it. Not a defect in B's work; a new top-level file in `exo_memory/` needs a column, and
   this is the guard doing its job on the first run after one appeared. B or the chair decides which
   column and writes the reason beside it. (`exo_memory/review/` is untracked but IS named in
   `STAYS_PRIVATE`, so it is not this.)

**So the two rows the chair opened on my file are closed, and the board's remaining red is three
rows across two other seats' work, each with a named owner and a named next command.**

## F · Correction I made to myself, again

I nearly wrote this addendum accepting *"reads an absent board as a clean board"* verbatim, because
it flatters the change I was already going to make and it arrived from the chair. It is wrong, and
`statSync` says so in one line. **A reason that points at the right conclusion is still a reason,
and it can still be false.** Both mechanisms are stated above so the record carries the true one.

**Nothing committed.** Dirty and mine: `consonance/tools/replay-check.js`,
`consonance/tools/replay-check.test.js`, this file.
