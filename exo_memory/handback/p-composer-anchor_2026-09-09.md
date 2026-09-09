# P-COMPOSER-ANCHOR — hand-back. C, 2026-09-09.

**Packet: `exo_memory/loop/packet_composer_anchor_2026-09-09.md` (e3805f0). Nothing committed.**

---

## 0 · THE ONE LINE THE CHAIR NEEDS FIRST — §3, AND IT IS A HARD CONSTRAINT

**`main.rs` IS CHANGED. This must NOT be merged into the desktop's first build unless a
rebuild-and-launch happens on this machine first.** The composer path is exercised only by a
running app: the tests prove the predicate, not the wiring, and the wiring is the half that has
burned this room twice. **The choice is the keeper's and I am not making it in this packet.** As
of 08:20 the code is landed dirty and no rebuild has been run here.

**And a second, sharper reason to rebuild here rather than let the desktop take it:** this packet
FOUND A LIVE SPLICE PATH that it did not fix (§5). It is pre-existing — the shipped code has it
too — so shipping the anchor does not make it worse. But nobody should learn about it from a
desktop with nobody watching.

## 1 · BARS

    cargo test --bin consonance -- --test-threads=1
    513 passed / 0 failed / 4 ignored          (baseline at HEAD: 508 / 0 / 4)
    cargo build --bin consonance               clean, no new warnings

+5 passing. One of those five is the packet's ignored acceptance test, un-ignored; three are new
frames for the anchor; one is the new defect in §5. The 4 ignored are the 3 that were already
ignored plus one NEW `#[ignore]`d acceptance test written red for the defect in §5.

**RED FIRST, and reproducible.** At HEAD, with the `#[ignore]` lifted and no fix present:

    git checkout -- consonance/src-tauri/src/main.rs
    # remove the #[ignore] on an_empty_composer_must_read_empty_whatever_colour_the_marker_is_drawn_in
    cargo test --bin consonance -- --test-threads=1 an_empty_composer_must_read_empty

    test result: FAILED. 0 passed; 1 failed; 511 filtered out
    panicked: a ready pane with an empty composer must be delivered to, not held for 240 s

Green after, on the same 512 KB real captured screen. I ran that sequence rather than asserting it.

## 2 · WHAT WAS BUILT — and it is not exactly what the packet specified

The anchor is there and it is structural. **But the packet's version was half the fix**, and the
other half is why the L050 shortcut did not have to be traded for:

    composer_row(rendered)      LOCATE the composer   -- on the DRAWN grid
    input_box_empty(r, typed)   ask if it is EMPTY    -- on the REDUCED grid

`is_separator_rule` — a row that is `─` edge to edge and nothing else. **It reads no colour and no
width constant.** The rule is Rgb(136,136,136) and I did not key on it: three predicates in this
file have keyed on an appearance and all three appearances moved. Width-independence is by
construction, which is what answers "a narrow window" in §6 without a live test.

`composer_row` — the bottom-most `❯` row, **and** the row above it must be that rule. **Two
structural facts that must agree; disagreement HOLDS.** Either alone is defeatable — scrollback
satisfies the rule test, an overlay satisfies the bottom-most test — and requiring both costs
single-digit frames per log.

**The move the packet did not name, and the reason no shortcut was needed:** L050 refused "keep the
marker at any colour" because it makes finding the composer a colour question again. The answer was
not to keep the marker — it was to stop asking the reduced grid *where* anything is. `typed_only`
stays a pure colour reduction and never has to preserve chrome it exists to remove.

## 3 · THE MEASUREMENT — a probe, not an argument

New untracked instrument: **`consonance/src-tauri/src/bin/composer_probe.rs`**. It replays real
capture bytes through the production emulator and scores three verdicts per frame — the truth
(the rendered composer row), the SHIPPED rule, and the ANCHOR — all read at the row `composer_row`
picks.

    cargo run --release --bin composer_probe -- --tail 20000000 \
        fixtures/screens/composer_empty_reads_busy_2026-09-09.bin \
        C:/Consonance/data/captures/0c0c0c0a-...-000000000a01.log \
        C:/Consonance/data/captures/0c0c0c0b-...-00000000115b.log
    PROBE_ROWS=21 PROBE_COLS=98 cargo run --release --bin composer_probe -- \
        --tail 20000000 C:/Consonance/data/captures/6fe15f0a-...-8bd96b6b5a4f.log

| pane | geometry | anchored frames | ANCHOR right | SHIPPED right | SHIPPED held an empty composer |
|---|---|---|---|---|---|
| fixture | 43x201 | 1,739 | 1,739 | 26 | 1,713 |
| 0c0c0c0a | 43x201 | 76,604 | 76,604 | 17,234 | 59,370 |
| 0c0c0c0b | 43x201 | 3,622 | 3,622 | 930 | 2,692 |
| 6fe15f0a | 21x98 | 75,981 | 75,951 | 969 | 74,983 |
| **total** | | **157,946** | **157,916** | **19,159** | **138,758** |

**The shipped gate holds a ready pane with an empty composer on 88% of the frames it can read.**
That is the 240 s bound firing on panes that were never busy, and it is the reason a stop signal
cannot outrun the thing it is stopping.

**The row above the composer was the full-width rule on 157,946 of 157,946 anchored frames** —
including on a **98-column, 21-row** pane, which is the narrow-window evidence §6 asks for, taken
from real bytes rather than from reasoning about resize.

**A correction I had to make to my own instrument, and it cost the first two runs.** The probe
originally read TRUTH at a row its own upward scan found and the VERDICT at the row `composer_row`
picks. On heavily clamped screens those differ, and it manufactured **1,763 splices that do not
exist**. Fixed by reading all three verdicts at one index — the shipping one. **The first number
was 1,763 and the real one is 30, in the direction that cost me the headline.**

**And a second correction, in the same place:** replaying that fourth log at 43x201 instead of its
real 21x98 also manufactured 2,271 splices, because the app's own line wrapping lands in different
rows at a different width. **Geometry now comes from the max cursor address in the raw log**
(`grep -aoE $'\x1b\\[[0-9]+;[0-9]+H'`), never from the constants.

## 4 · MUTANTS — applied, and what caught them

**A — the shortcut L050 refused.** `typed_only` keeps `❯` at any colour; `input_box_empty` reverts
to the shipped rposition-on-reduced rule. **APPLIED. CAUGHT — 3 failures**, 509 passed / 3 failed:
`a_prompt_row_with_no_rule_above_it_is_not_the_composer`,
`the_composer_is_found_on_the_drawn_grid_though_the_reduction_deleted_its_marker`,
`a_real_empty_composer_reads_busy_because_the_marker_is_not_default`.

> **AND THE PACKET WAS WRONG ABOUT WHY, WHICH MATTERS.** It said the mutant "must be CAUGHT by the
> greyed-prompt-row frame you already have on disk. If it is not caught, that frame is not doing
> what its name says." **There was no such frame on disk.** No fixture painted a prompt row
> non-Default with typing in it. The mutant is caught, but by PREMISE assertions ("no prompt row
> survives the reduction anywhere on this screen") — not by the splice the refusal was about. Two
> of the three catching frames are ones I added this lap.

**B — the anchor dropped.** `composer_row` returns the bottom-most `❯` row unconditionally.
**APPLIED. CAUGHT — 2 failures**, 510 passed / 2 failed:
`a_prompt_row_with_no_rule_above_it_is_not_the_composer`, `a_rule_inside_a_reply_is_not_the_separator`.

**C — the rule test loosened** (`trim()` for `trim_end()`, so an indented content rule anchors).
Not asked for; run because it is the cheapest way to splice. **APPLIED. CAUGHT — 1 failure**,
511 passed / 1 failed: `a_rule_inside_a_reply_is_not_the_separator`.

**No survivors.** All three restored from a byte-for-byte copy; the suite is green at 513/0/4 and
`grep -c MUTANT` finds only the four pre-existing uses of the word.

## 5 · THE UNWANTED NUMBER — the frame L050 refused on is REAL, and neither rule survives it

**When the keeper types a SLASH COMMAND, Claude Code draws his own text non-Default.** `/model` in
**Rgb(177,185,249)**. The reduction blanks it, and `input_box_empty` reports an EMPTY composer over
a row he is in the middle of typing. **That is precisely the splice L050 declined to trade a
four-minute hold for, and the trade was already on the books before tonight.**

    6fe15f0a at 21x98:  12,366 composer rows with content across four panes
                        30 of them drawn with NO Default cell at all
                        every one of the thirty a slash command
    SHIPPED reads 29 of those frames EMPTY.  ANCHOR reads 30.

**The anchor did not cause this and does not cure it. It is one frame worse than shipped and
119,599 frames better** on the hold side. I did not fix it in this packet: the fix is inverting
`typed_only` from an allow-list of Default to a **deny-list of the measured chrome greys**
(Rgb(153,153,153) prediction and hints, Rgb(136,136,136) rule), which flips the failure direction
of every unknown colour from splice to bounded hold. That is the right change and it is a different
blast radius — it wants a colour census across every pane before it lands, and it wants a night
that is not this one.

**It is on disk executable, so it cannot be lost between packets:**

- new fixture `fixtures/screens/composer_slash_command_reads_empty_2026-09-09.bin` (236,544 bytes,
  cut from a real log at the byte offset the probe reported). Committee routing text and shell
  lines from the librarian pane, same character as the existing fixture; **I read it before writing
  this and there is nothing private in it**, but it is a new binary in the repo and the chair should
  look before it is committed.
- `a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect` — **GREEN, and it asserts the
  DEFECT.** Whatever closes this must INVERT it, not delete it.
- `the_keeper_typing_a_slash_command_must_hold_a_delivery` — `#[ignore]`d, red-first for the next
  packet, in exactly the shape L050 left this one in.

## 6 · §6 — I DO NOT REFUSE, AND HERE IS THE BOUND ON THAT

The separator rule is reliably present, by measurement rather than by expectation: 157,946 of
157,946, across four panes, two widths, two heights, two Claude Code builds.

**Narrow window:** answered with real bytes — a 98-column, 21-row pane draws it edge to edge, and
`is_separator_rule` reads no width. **Resize:** answered structurally — no constant is consulted;
the L044 failure cannot recur here.

**A future update that stops drawing it:** the anchor then finds nothing and **fails CLOSED — a
bounded hold, which is what the shipped code already does on those frames.** So the packet's "an
anchor that is usually there is worse than the last-row heuristic" does not bite: it is not worse,
it is the same answer made legible. What it WOULD do is resurrect the stall silently, which is the
registered falsifier below.

## 7 · WHAT I DID NOT VERIFY

1. **Nothing has run inside the app.** No rebuild, no launch, no live pane. This is the L045/L049
   hole and it is the whole of §0.
2. **The quiescence argument is an argument, not a measurement.** The probe samples every 256 bytes,
   i.e. deliberately mid-repaint, which is where the unanchored frames live (1,417 of 78,125 on the
   busiest log). Production reads only after 2 s of PTY silence, so those frames should never be
   sampled — **I did not measure that**, because the capture logs carry no timestamps.
3. **The restored-scrollback hazard is NOT closed and I want it said plainly.** A restored pane's
   scrollback contains pasted rule/`❯`/rule blocks — this pane's own does. If a dialog ever covers
   the real composer, the bottom-most `❯` row is a pasted one WITH a rule above it, and the anchor
   reads it. **Identical to shipped behaviour, so not a regression, and not fixed.** I found no real
   capture of a covered composer to measure it on.
4. **The three deviations of `is_separator_rule` from a measurement** are marked in the source as
   design choices: that a content rule always carries a left margin is reasoned, not measured.
5. **The Third Place's capture log (`3d000000-…`) was deliberately not opened**, measured on, or
   cut from, and no fixture derives from it.
6. **`composer_probe` duplicates `typed_only` and the anchor** rather than importing them (main.rs
   is a binary crate root). If the two drift, the probe measures the wrong thing. There is no test
   pinning them together — a real gap, cheap to close, not closed.

## 8 · FALSIFIERS, REGISTERED BEFORE THE RESULT IS KNOWN

- **The packet's own:** a delivery held to the 240 s bound on a pane whose composer is empty, after
  this lands. Third time this predicate has been fixed; the first two were defeated by the screen
  moving. If it fires again, the answer is not a fourth predicate — it is that reading a picture of
  a screen is the wrong instrument and the pane's own stamp must carry the whole load.
- **Mine, on the anchor specifically:** if a Claude Code update ever renders a composer with no
  full-width rule above it, every delivery to every pane holds to the bound, **silently and
  everywhere at once** — the L044 failure shape exactly. `composer_probe` against a fresh capture is
  the check; there is no alarm that fires on its own.
- **On §5:** if the slash-command splice is still open a season from now with the ignored test still
  ignored, then writing the red-first was theatre and the deny-list should have gone in tonight.

## 9 · FILES

    consonance/src-tauri/src/main.rs                                       CHANGED  (see §0)
    consonance/src-tauri/src/bin/composer_probe.rs                         NEW, untracked
    consonance/src-tauri/fixtures/screens/composer_slash_command_...bin    NEW, untracked
    exo_memory/handback/p-composer-anchor_2026-09-09.md                    this file
    exo_memory/map/C.md                                                    one line appended

Nothing committed. Nothing pushed. No path outside what the packet named was touched.
