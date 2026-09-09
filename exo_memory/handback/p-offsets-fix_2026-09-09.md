# P-OFFSETS-FIX — landed. `offset_tests` 13/13, whole suite 480/0. The mark is taken. THE NEXT MOVE IS THE KEEPER'S.

**C (CHARLIE), 2026-09-09 ~02:50. L051.** Packet `loop/packet_offsets_fix_2026-09-09.md` (ed19ad0);
the specification is my own, `handback/p-board-replay_2026-09-09.md` §7.

**MY SCOPE, in my own words:** move the offsets read to after `set_dirs` so it looks where the
writes go; check first that nothing observes `BACKFILL_ACTIVE` or the managed map earlier; predict
the first launch in writing before it happens; take the `--mark` baseline. Do not touch `mcp.rs`,
do not touch the composer predicate, do not commit.

---

## 1 · NOT REFUSED, AND THE CHECK THAT SETTLED IT

The packet's refusal clause is the right question and it is the one I would have asked. It is
answered by **enumeration, not by reasoning about Tauri's lifecycle** — a decision moved later is
only safe if nothing reads it earlier, and "nothing does" is a claim about a call graph.

    grep -n 'BACKFILL_ACTIVE' src/main.rs
    grep -n 'state::<TailerOffsets>' src/main.rs

- **`BACKFILL_ACTIVE` has exactly two readers:** `backfill_note_pane` (`:1511`) and
  `backfill_is_pane` (`:1519`). Both are called only from `start_tailer`. A third read is the
  announcement itself, further down the same `.setup()` closure and therefore after the new site.
- **The managed map has exactly one reader:** `start_tailer` (`:2303`).
- **`start_tailer` has nine call sites, and all nine sit inside `#[tauri::command]` functions** —
  `pty_spawn`, `spawn_sibling`, `spawn_fresh`, `new_room`, `resume_pane`, `spawn_body`,
  `spawn_third_place`, `spawn_librarian`, `spawn_main`. A command cannot be invoked until the
  frontend runs, which is after the event loop starts, which is after `.setup()` returns.

**So no reader of either value runs before the new line, and the fix does not swap one ordering
defect for its mirror.** That reasoning is written into the code beside the change rather than only
here, because the next person to move this line needs it there.

## 2 · THE CHANGE

`consonance/src-tauri/src/main.rs`, two places, nothing else touched.

    .manage(TailerOffsets(Arc::new(Mutex::new(HashMap::new()))))     // empty on purpose

and, one line after the resolver inside `.setup()`:

    set_dirs(&get_state()); // resolve configurable dirs before anything reads them
    {
        BACKFILL_ACTIVE.store(!offsets_path().exists(), Ordering::Relaxed);
        let loaded = load_offsets();
        *app.state::<TailerOffsets>().0.lock().unwrap() = loaded;
    }

Both sites carry the why. `mcp.rs` untouched (E's gate at `bd62a74` rides as-is); the composer
predicate untouched (my refusal stands, the 240 s hold survives this rebuild by design).

## 3 · THE PREDICTION, WRITTEN BEFORE THE REBUILD

**I predict the first launch after the rebuild RESUMES. No `backfill` row, and no transcript re-read
— not one pane, not a partial.**

This is not a guess about `set_dirs`; it is the arithmetic of `resume_offset` run by hand on the
current state, ahead of the run:

| pane | stored offset | transcript len | head | `resume_offset` returns |
|---|---|---|---|---|
| `6fe15f0a` (A) | 1,476,254 | 1,476,254 | MATCH | 1,476,254 |
| `a2122153` | 2,054,797 | 2,054,797 | MATCH | 2,054,797 |
| `0c0c0c0a` (Main) | 246,440,002 | 246,440,002 | MATCH | 246,440,002 |
| `0c0c0c0b` (librarian) | 33,191,786 | 33,191,786 | MATCH | 33,191,786 |
| `3d000000` (third place) | 27,282,888 | 27,282,888 | MATCH | 27,282,888 |
| `12fb81f6` | 2,341,159 | 2,341,159 | MATCH | 2,341,159 |
| `0845a868` (me) | 2,139,317 | 2,139,317 | MATCH | 2,139,317 |

**Why no backfill row:** `BACKFILL_ACTIVE` is `!offsets_path().exists()`, and after the fix that
path resolves through `set_dirs` to `C:\Consonance\data\tailer-offsets.json`, which exists (606
bytes, rewritten continuously — it is rewritten by every save, so its birth time is always recent
and means nothing). **False. No announcement.**

**Why no re-read:** all seven heads match and every stored offset equals its file length, so
`resume_offset` takes its last arm and returns the offset. Panes will have written more between now
and the rebuild; those new bytes are read once, which is the correct behaviour and is what
`replay-check`'s bound is made of.

**The chair's "it may still backfill, and that would be correct" is a fair prior and I am declining
it with evidence rather than confidence.** It would hold if the writes and the post-fix read
resolved to different places, or if a head had moved. Neither is true right now, and both were
checked rather than assumed.

**If I am wrong and the first launch DOES announce a backfill:** that is one legitimate re-read
only if the offsets file was absent or unparseable at the configured path at that moment. **The
second relaunch is what decides it.** A first launch that backfills writes offsets to the path it
just read from, so a second relaunch MUST resume silently. **A second `backfill` row would mean the
fix did not take** — that is the falsifier, and it is cheap: quit and start again.

## 4 · THE SCORING SEQUENCE — the mark is TAKEN, and the next step is the keeper's

    node consonance/tools/replay-check.js --mark            <- DONE, 2026-09-09T08:42:46.139Z
      board  338,530,720 bytes   panes 1,819 transcripts, 91,105 lines
      mark   C:\Consonance\data\replay-check.mark.json

**THE NEXT MOVE IS THE KEEPER'S: rebuild and relaunch.** Nothing is owed by me until that happens,
and nobody else can do it. Then, from the repo root:

    node consonance/tools/replay-check.js --score

**Reading it:** exit 0 / **PASS** confirms §3 — rows added since the mark do not exceed the new
transcript lines. Exit 1 / **FAIL** names the excess, and any excess at all is replay that survived
the fix. It also prints "rows added, everything else" separately: **a `backfill` row appears in that
column, not in the judged one**, so a backfill would show up there as an unjudged +1 while the
verdict still reads on the transcript-sourced rows.

*One way this can go wrong that is nobody's fault:* if the board is compacted before `--score` runs,
the tool refuses with exit 3 rather than comparing two different corpora. B's compaction is gated on
this, so the order is score first, compact after.

## 5 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    test result: ok. 480 passed; 0 failed; 4 ignored

**`offset_tests` 13 of 13**, including
`the_backfill_decision_must_be_made_after_the_configured_dirs_resolve` — **the EXPECTED-RED carrier
from `a17007f` is now green, and this is the commit that earned it.** It went green for the right
reason: its second half reads the source and finds `set_dirs` above the decision. Its first half,
which asserts the two moments resolve different files, is unchanged and still passes — that is what
makes it a fix rather than a deleted test.

The whole suite is green for the first time in this arc. `mcp::tests::no_open_lap_gates_nothing`,
which I reported as flaky in the L050 hand-back after one failure and one pass, passed here — one
more observation, still not a verdict.

## 6 · WHAT I DID NOT VERIFY

- **That the fix works.** It compiles and every test passes; **not one line of it has run in the
  app.** *Landed is not shipped* — the rebuild is the verification and it has not happened. Do not
  read 480/0 as the replay being closed.
- **That the announcement still fires when a backfill is genuine.** The path where `BACKFILL_ACTIVE`
  is true is now unreachable in normal operation — the file exists — so I could not exercise it. If
  the offsets file is ever deleted, that path runs for the first time since the fix, untested.
- **What `set_dirs` resolves to at the moment the rebuilt binary runs.** §3 assumes
  `~/.consonance.json` still reads `data_dir = C:\Consonance\data`. True now; it is a file the
  keeper can change from the Settings tab between now and the relaunch.
- **The rest of the resolve-before-`set_dirs` class.** `seed_room`/`seed_cards`/`seed_references`
  at `:8837-8839` still run BEFORE the resolver and still write into the default directory — that
  is why `~/.consonance` holds `.seeded.json`, `cards/`, `spread/`, a stale `board.jsonl` and a
  `persist.log`. **This packet fixed one member of the class, and left the others exactly where
  they were.** Not mine tonight, and now named twice.

## 7 · ONE THING I FOUND WHILE CHECKING, AND IT IS THE SAME SPECIES

**Main's session id resolves to TWO transcript files on this machine:**

    C:\Users\zackn\.claude\projects\C--Consonance-instances-main\0c0c0c0a-…-0a01.jsonl        246,440,002 bytes  (live)
    C:\Users\zackn\.claude\projects\C--Users-zackn-claude-instances-main\0c0c0c0a-…-0a01.jsonl   1,005,720 bytes  (stale)

`start_tailer` builds its path from `encode_cwd(&cwd)`, so today it takes the live one and the
offsets are correct. **But the offsets map is keyed on the session id ALONE, not on the path.** If
Main's cwd ever changes to the old directory — the one still named in `~/.consonance.json`'s `base`
— the tailer would open the stale file with a stored offset 245 MB past its end, `len < offset`
would fire, and it would re-read that transcript from the top with no announcement, because
`BACKFILL_ACTIVE` would be false. **A file written under one identity and read under another: the
same species as the bug this packet fixes, one field over.** Not fixed here, not in scope, and worth
a line in someone's packet.

## 8 · THE ERROR I MADE GETTING TO §3, AND IT NEARLY BECAME THE PREDICTION

My first pass at the table above came back **every pane MISMATCH, Main's transcript shrunk from
246 MB to 1 MB** — a dramatic result that would have predicted a full silent re-read of everything.
It was wrong twice over, and both faults were mine:

- **`JSON.parse` coerced the u64 `head` to a double.** Stored `14527506195736961416` read back as
  `14527506195736960000`, so every comparison failed. Fixed by parsing the raw text and keeping the
  head as a string.
- **The sid→path scan collided on the duplicate in §7** and reported the stale file's length.

**I caught it only because I checked the instrument against a known-good value before trusting its
output** — `fnv1a(empty)` must be `14695981039346656037`, which `head-watch.test.js` pins, and
Main's head is independently recorded in `head-watch.jsonl`. Both matched the computed value and
neither matched what my script had printed, which is what said the script was wrong rather than the
world. **A number in hand stops the asking; validating the instrument against a value someone else
recorded is what restarts it.**

---

**FALSIFIER as registered:** *a relaunch after the rebuild that re-reads any transcript from the
top, beyond the one backfill predicted in §3* — and §3 predicts **none**, so any re-read at all
fires it.

**Nothing committed.** Dirty and mine: `consonance/src-tauri/src/main.rs`, this file,
`exo_memory/map/C.md`.
