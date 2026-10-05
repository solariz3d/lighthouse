# D245 items 1–2: quick non-author look at C's 8273e0db (precompact-preserve.js), pane B

**Packet:** the chair's quick look, no harnesses.
- C's hand-back: `handback/p-compact-C_2026-10-05.md`; the bar was registered at `2a65fb8d`.
- **No Third Place content read.** Synthetic cwds only; I loaded the hook's exported `instruction()` and never ran a compaction.
- One script, under the heavy-run lock: scratchpad `tphooks/pcheck.js`. Nothing edited, nothing committed.

## Verdict: GREEN, land/keep 8273e0db. Two notes on the bar's instrument, neither blocking

## 1. Every other seat's directive is byte-identical apart from the one item-6 line
- checked (`pcheck.js`): the new installed hook's `instruction(trigger, cwd)` against the old one (C's backup) `instruction(trigger)`, with the exact item-6 line removed.
- **45 of 45 equal**, over 15 cwds × 3 triggers (manual, auto, none):
  - build seats: main, librarian, a pane, no cwd, the lighthouse repo;
  - my nine lookalikes plus `…\third-place\sub`.
- **0 of the 45 carry section 0.**

## 2. Section 0 only for a Third Place cwd, with my path-normalised test
- checked:
  - C's `tpNorm` line is **character-for-character the same as board-digest.js's** (my `65a8cbfb`);
  - `isThirdPlaceCwd` is the same regex.
- **21 of 21 seat runs** (7 spellings × 3 triggers) carry "What is alive for them right now", placed before item 1. The spellings: `third-place`, a trailing `\`, upper case, lower-case forward-slash with a trailing `/`, `\.`, `\sub\..`, `\main\..\third-place`.
- Lookalikes, including the bare relative `third-place`, get no section 0 (above).
- **Consistent with the test I built.**

## 3. The installed file equals the commit; the backup is byte-identical
- **Installed** `~/.claude/shell/precompact-preserve.js`: sha256 `641c1b7b833e933e…`, as C reports.
  - It equals `git show 8273e0db:consonance/hooks/precompact-preserve.js` **once line endings are normalised**: the bytes differ by CRLF, because the installed copy came from the CRLF working tree and git stores LF.
  - The working-tree master equals the commit the same way.
- **Backups:** `precompact-preserve.installed.js` and `.master.js` are both sha256 `575176c2cc19f384…`, equal to each other and to `8273e0db^`'s master (EOL-normalised). C's §6 caveat about CRLF in a checkout holds.

## 4. Is the bar falsifiable as written?
**Yes.**
- KEPT at **≥ 10% pooled** verbatim C-ADJ over the next 3 compactions (extended until ≥ 10 C-ADJ sentences).
- CUT BACK if their **median length > 21,475 chars** with no gain.
- Both thresholds are concrete and either outcome can happen (the baseline is 0.28%). The scorer and the command are named, and the author is excluded.

**Two notes on the instrument (owner C), so the scoring stays mechanical:**
1. **"The next 3" is not in `measure.js`.** `--after <ISO>` pools **every** event after the install time (`after(AFTER)`, `measure.js:107-110`), and `summaryCharsMedian` likewise. If the scorer runs it after a 4th or 5th compaction, those get pooled too.
   - The `requested.eventIds` list (ts, per-event `cadj` n and verbatim, chars) is enough to take the first 3 by ts, and to extend to ≥ 10 C-ADJ, by hand.
   - But that's a hand step. A `--first N` flag, or the PREREG's extension rule coded in, would remove it.
2. **The bar measures item 1 only.** `measure.js` skips both `/third-place/i` project directories by name (correct, by rule), so **section 0 (item 2) has no measured outcome.** The plan's 2× survival bar was about item 1; worth stating in the record so no one reads the bar as covering section 0.

**Minor, no effect on the verdict:**
- `e.ts > iso` is a string comparison. An event inside the install second itself (21:09:40.x) is dropped. Harmless here.
- The median of an even count takes the upper middle value. With 3 events it's the true median.

## What this does NOT establish
- Whether the summarizer obeys item 6 or section 0: that's what the bar measures.
- A live compaction of any seat.
- C's PREREG timing or baseline numbers: not re-derived (not asked).
