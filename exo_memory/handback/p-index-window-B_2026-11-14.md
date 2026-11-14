# Hand-back: the index-window row, red then green, and the BUILDING.md line (pane B, D675, 2026-11-14)

Packet: the chair's D675 order of 02:30Z. (b): "THE INDEX-WINDOW RED: GO AS REGISTERED … CHECK YOUR FIRST FALSIFIER ON THE LIVE ROOM BEFORE
CODE, AND STOP IF IT FIRES". (c): the BUILDING.md line "on the SAME lighthouse branch as the index-window row, as its own commit … Check
consumer-relabel's pinned sites do not move." Tier: PROVE IT. Registration: `exo_memory/loop/registration_index_window_B_2026-11-14.md`
(`9c87d646`).

The branch is `index-window-b` in `C:\Users\nname\Desktop\worktrees\lh-lapw-r-b`, off origin/main `c5311e1b`. It is pushed and not landed:

    checked: git ls-remote origin refs/heads/index-window-b → 1e6fe1f3ff39e4f1b9378168db267d79a57f5cf2
    checked: git log --oneline origin/main..HEAD → 1e6fe1f3, 39656190, eecd07ff (origin/main fetched, still c5311e1b)

## 1. The commits

- `eecd07ff` **BUILDING.md:** "A world self-test that exits 3 is re-read once under the exclusive hold, and the hand-back names both
  readings". It sits after the "Landings go to a pane" bullet's falsifier, in its own commit, as ruled.
- `39656190` **The row on a fixture room**, RED with the old helper.
- `1e6fe1f3` **The helper (green).** It now asks for the window's own first entry of the newest date: `max_by` with date ascending and
  the label comparison reversed, so the label that comes first in ascending order wins.
  - The test also prints the live room's pick and whether the live shelf carries it. That print is falsifier 2's reading; see §6.

## 2. Falsifier 1, on the live room, before code: it did not fire

    checked: scratchpad idx1.txt (a throwaway print on main c5311e1b, ordinary lock) → 203 index entries dated 2026-11-13, 22,321 B;
             the window carried 137 of them, from "a"; the window's own first entry of that date is on the shelf; the old pick
             (loop/wake_level2_2026-11-13/shelf_builder.md) is not

So the window was newest-first all along. The red came from the test's tie-break, which took the newest date's LAST label, while the
window orders labels ascending inside a date.

## 3. Red, green, mutants

    checked: idx2_red.txt → FAILED, left "- loop/wake_2026-11-13/zz_last.md", right "- loop/alpha_2026-11-13/01_first.md"
             (the old helper on the fixture)
    checked: idx3_green.txt → test result: ok. 1 passed (exit 0)
    checked: idx3_path.txt → FAILED at main.rs:19665, "… is not on a one-line window …" (mutant: the window in path order)
    checked: idx3_tiedesc.txt → FAILED at main.rs:19665, the same assertion (mutant: labels descending inside a date)
    checked: idx3_mutants.txt → restored both times, sha256 3c97faced988 (restored by writing, so cargo rebuilt)
    checked: idx4_row.txt (at 1e6fe1f3's content, with the print) → ok. 1 passed; "live room: the window's first entry of the newest
             date: Some("- loop/absolute_sources_2026-11-13/01_memo_whole.md"); on the live shelf: Some(true)"

Mutants: applied 2 / caught 2 / NOT APPLIED 0.

The scratchpad files are in
`C:\Users\nname\AppData\Local\Temp\claude\fdb7d12f3434a8ed\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad\`.

## 4. The whole bin suite

    checked: idx3_full.txt (cargo test --bin consonance, ordinary lock, the helper without the print) → test result: ok. 1219 passed;
             0 failed; 7 ignored (234.64 s)

The print was added after this run, so the whole suite has not run on 1e6fe1f3 itself. The print touches only this row's body, and the row
was re-run alone on it (idx4). The landing pane's full run is the one at 1e6fe1f3.

## 5. consumer-relabel's pinned sites (the chair's (c))

    checked: node --test consonance/tools/consumer-relabel.test.js on the branch → 34 pass / 0 fail

The sites are anchored by text and by a role-word count (`consumer-relabel.js:230`, `:253`). The new line names no role and moves no
anchor.

## 6. Corrections

- **The `eecd07ff` message** first said consumer-relabel passed "32 of 32"; it is 34 of 34. I amended the message before any push.
- **The print, against the registration.** Falsifier 2 was registered as "the landing's cargo run prints the shelf's first index line
  beside the row". The first green printed only the pick, not whether the live shelf carries it.
  - It now prints both.
  - The "first index line" wording was itself loose: the index starts with the undated group (map/, journal/, standing loop
    instruments), so the readable form is "the live shelf carries the newest date's first entry".
- **The `1e6fe1f3` message.** It was first committed (`afc92f84`) without the print's and the suite's lines, because a message-edit step
  failed (no Python on this machine). I amended it before the push.

## 7. Next

The landing train's exit-3 registration, before code (the chair's (a)), is my next filing.
