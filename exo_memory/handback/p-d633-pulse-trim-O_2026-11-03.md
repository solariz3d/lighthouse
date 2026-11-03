# p-d633 — fix 5: the pulse trimmed, and the NEXT-trailer note to the sender (O), 2026-11-03

Packet: the chair's D633 (14:30Z), PROVE IT, at the keeper's 08:29 word ("can we also fix 2, 3, 4, 5 before restart?"). Plan: `exo_memory/loop/plan_room_fixes_2_5_2026-11-03.md` (6fa5aa26), part D633. Seat: O.

## What landed
- **Lighthouse branch `d633-o` off `d628-o`** (82da03fc): one commit, **`37c82dbd`**, NOT pushed.
  - 4 paths: `consonance/tools/chain-status.js`, `chain-status.test.js`, `consonance/src-tauri/src/mcp.rs`, `trailer.rs`.
- **No build, install or restart.** The landing pane builds one exe for fixes 1-5 (plan "Landing").
- **STANDING GUARD:** nothing here compacts, clears, restarts or trims any seat's conversation, CLAUDE.md, memory or shelf.
  - The trim is of the PRINTED pulse line only. Every item is still computed: `line()` callers and `--full` see the whole line, and D628's owed visit reads `--owed-json`, untouched.

## (1) The pulse, trimmed
**How.** In `chain-status.js` `line()`, every part is pushed with its KIND (`put(kind, text)`). With `opts.trim`, only the kinds in `PULSE_KEEPS` print. The CLI's default (the one channel the pulse hook reads, with no arguments) is now trimmed; `--full` prints the whole line.
- No hook is reinstalled.
  - Both the installed `~/.claude/shell/userprompt_pulse.py` and the repo's `dev/shell/hooks/userprompt_pulse.py` run `node <repo>/consonance/tools/chain-status.js` with no arguments.
  - The installed copy differs from its source (a D619 finding), but it calls the same reader, so the trim reaches the live pulse at landing through the repo file alone.

**Kept and dropped.**

| item | kind | in the pulse now |
|---|---|---|
| QUEUED, `queue UNKNOWN` | queued | **KEPT** |
| `handbacks k of n (owing …)`, `HANDBACKS IN, NOT COLLATED`, `collation UNKNOWN` | handbacks | **KEPT** (what D628's owed visit reads) |
| UNDELIVERED, refusals UNRESOLVED, `delivery UNKNOWN` | delivery | kept: named neither way |
| WAITING ON YOUR ANSWER | waiting | kept: named neither way |
| `N unreadable`, `lap(s) UNKNOWN, damaged rows` | ledger | kept: named neither way |
| `N dispatch(es) delivery-unconfirmed` | unconfirmed | kept: named neither way. **For the chair:** D627 found it HARMFUL (32 of 32 had arrived); D621's board receipt, folded into this restart, should stop its false fires. Drop it here if you rule so. |
| STALE (and STALE UNKNOWN) | stale | **DROPPED** |
| `dirty N repo-wide (…)` | dirty | **DROPPED** |
| `NOT in sync … / L behind …` (and in sync / this machine only) | sync | **DROPPED** |
| `chain: … · holder … · WORK LEG UNWITNESSED`, the age, `+N more open` | chain | **DROPPED** |
| `N of 10 chained laps unwitnessed (…) · N older beyond …`, `rows only` | unwitnessed | **DROPPED** |
| `N board line(s) fused, rows recovered` | fused | **DROPPED** (still READ: a fused line's hand-back still counts) |
| UNRECEIVED | unreceived | **DROPPED** |

**The trimmed pulse, sample.** Live and read-only, at 14:4xZ, on the d633-o tree:
- checked: `node consonance/tools/chain-status.js` → **`handbacks 0 of 5 (owing A,C,E,O,P) · 12 dispatch(es) delivery-unconfirmed`** (75 chars).
- checked: `node consonance/tools/chain-status.js --full` → the 522-char line the room has today ("STALE D501 139h (holder chair) · chain: D633 WORKING · holder panes · dirty 33 repo-wide (…) · … · rows only").
- When nothing is kept, the line is empty and the pulse shows only its header. The `--why` reason is "nothing the trimmed pulse keeps (D633)".

## (2) The NEXT-trailer note goes to the SENDER
- **Before:** `trailer.rs` `delivered_with_warning` appended the note to the RECEIVER's copy of the message (the old `:286-287` said so: "not addressed to the sender, who has already moved on").
- **Now:** `trailer.rs` `sender_note(why)` builds the note. `mcp.rs` `trailer_gate`'s `Deliver` carries the message **unchanged** plus `note`.
  - `chair_inject`, `call_chair` and `call_librarian` each return the note in **their own tool result** (`with_sender_note(out, note)`), the reply the sender reads in the same turn.
  - The Third Place's ring takes no note: its rings are letters, not hand-backs, and its rows carry no words.
- **The board line is unchanged:** the same `DELIVERED WITHOUT A NEXT TRAILER` row.

## Tests (PROVE IT)
- **Red first:**
  - checked: `S\d633` JS run before the trim → all 6 new D633 rows red. Two were red on my own fixture's fault first, and that is corrected (below).
    - After that, the 4 drop rows and the CLI row were red.
    - The 2 KEEP rows were green, by design: they pin items present today, so a trim cannot cut them.
  - checked: Rust, `S\d633\rust-red.out` → the 3 new mcp rows do not compile (`Deliver` has no field `note`; no `with_sender_note`).
  - The `trailer.rs` row was amended together with `sender_note` in one edit, so it has no separate red run.
- **New JS rows (6):**
  - KEEPS the hand-back count and QUEUED;
  - KEEPS HANDBACKS IN;
  - DROPS STALE, dirty, sync, the chain tail, +N, the bare age and UNRECEIVED, each with an **untrimmed control** that proves the fixture produces the item;
  - DROPS fused (still read);
  - DROPS unwitnessed, older and rows only, and is silent when nothing is kept;
  - the CLI prints the trimmed line, and `--full` the whole one.
- **New Rust rows (3):**
  - `d633_a_warned_message_reaches_the_receiver_unchanged_and_the_note_goes_to_the_sender` (all three verbs; a compliant ring carries no note);
  - `d633_the_note_is_appended_to_what_the_sender_is_told`;
  - `d633_each_verb_returns_the_note_to_its_sender` (the wiring, per verb).
- **Amended by name, each with its reason in place** (the rule changed):
  - in chain-status.test.js: `E-3.1: and it reaches STDOUT through the cli…`, `the dead lap reaches the ACTUAL cli…` and `STALE reaches STDOUT through the actual CLI…`, now reading `--full`;
  - in trailer.rs: `a_warned_hand_back_is_delivered_whole_with_the_rule_named`, now reading the sender's note;
  - in mcp.rs: `d277_light_mode_delivers_with_the_warning_and_marks_the_board_line` and `call_librarian_without_a_trailer_is_delivered_pointer_first_with_a_board_warning` (the text is now unchanged, and the rule is in `note`); the Third Place wiring row (the arm's new pattern); and three constructions that gain `note: None`.
- **Green:**
  - checked: `cargo test --bin consonance` → `S\d633\cargo-full.out`: **1189 passed, 0 failed, 6 ignored** (1186 + 3), 279 s.
  - checked: `chain-status.test.js` 161/161 (155 + 6).
  - checked: the pulse hook's other consumers: `ask.test.js` 42/42, `lap-row.test.js` 142/142, `dev/shell/hooks/userprompt_pulse.test.js` 13/13, `third-place-gate.test.js` 7/7, `userprompt-submit.test.js` 5/5.
  - checked: `grep` for other callers of the chain-status CLI → only the pulse hook and D628's `--owed-json`.
- **Mutants:**
  - checked: `S\d633\mut633.js` → `S\d633\mutants.json`: **applied 13 / caught 13 / NOT APPLIED 0**.
  - Each was caught by named rows, not a compile error.
  - T1-T9 on the keep set, each kind's tag, the CLI default and the trim switch.
  - N1-N4 on the note's route: none made; not appended; call_chair drops it; the note back on the receiver's copy.
  - Every file was restored and checked byte for byte.

## Corrections
- My first D633 fixture made a second, NEWER open lap the head (holder chair). So the pulse printed no hand-back count at all, and the two KEEP rows were red for that reason, not for the missing code. The fixture lap is now older.
- My first age check was a malformed expression. It now splits the line and reads a bare age part, with an untrimmed control.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: plan_room_fixes_2_5_2026-11-03.md (6fa5aa26); chain-status.js line/main; userprompt_pulse.py (repo and installed); trailer.rs; mcp.rs trailer_gate and the three verbs; S\d633\{rust-red.out, cargo-full.out, mutants.json}; the live chain-status runs above
NEXT: librarian checks 37c82dbd and the kept/dropped table when this ring is read; the chair rules on delivery-unconfirmed when collating fixes 2-5

## Amend (the chair's ruling, 08:48): delivery-unconfirmed dropped too
- **Commit `3aed0c72`** on d633-o, over 37c82dbd, not pushed. `PULSE_KEEPS` loses `unconfirmed`, and its comment names the ruling. The item stays computed and in `--full`.
- **Row:** `D633 (the chair, 08:48) the trimmed pulse DROPS delivery-unconfirmed; it stays computed and in --full`.
  - It has an untrimmed control: `1 dispatch(es) delivery-unconfirmed` is present in the full line.
  - checked: red on 37c82dbd ("not dropped: … · 1 dispatch(es) delivery-unco…"), green after.
- checked: `chain-status.test.js` → 162/162; consumers `ask` 42/42, `lap-row` 142/142, `userprompt_pulse` 13/13, `third-place-gate` 7/7, `userprompt-submit` 5/5.
- checked: the mutant that puts `'unconfirmed'` back in the keep set → caught (the row exits 1); the file was restored.
- **Live sample now:** checked: `node consonance/tools/chain-status.js` → **`handbacks 1 of 5 (owing A,C,O,P)`**.
