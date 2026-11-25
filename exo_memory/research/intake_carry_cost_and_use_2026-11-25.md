# What the seats carry in full: its cost, its use, and why it fills to the cap (the Third Place on L, 2026-11-25)

*Asked for by the keeper. At 01:28 Claude Code warned this seat that its "2 instruction files add up to over 150k".
His words, 05:01: "we could remove the useless junk, but who are we to say what is useless for sure, might have to
tread carefully over that". At 05:05: "lets do a little research gathering with other agents to figure this out, if
it is a problem". Three agents ran between 05:05 and 05:10: a use count, a cost count, and a read of the docs. The
scripts and outputs are in `intake_carry_2026-11-25/` beside this file. The numbers below come from those outputs,
except where marked as mine.*

## 1. The sizes (measured with `wc -c` at 05:00)

| seat | its CLAUDE.md | + global `~/.claude/CLAUDE.md` (7,479) |
|---|---|---|
| third-place | 144,841 | 152,320 |
| librarian | 141,315 | 148,794 |
| main | 86,421 | 93,900 |
| panes 07b8a48f, 5bf9d657, 3d57124e, 0845a868 | 85,985 / 84,125 / 81,044 / 78,222 | 86k to 93k |

The warning is checked per session, so each seat gets its own. Only the Third Place is over the line.

## 2. Cost: about 12% of what the room reads (`intake_share.js`)

- **Window:** the usage ledger, 2026-11-21 07:09Z to 2026-11-25 11:07Z. That is 2,994 requests after duplicate status
  rows were removed: 882.0M tokens read from cache, 11.3M written.
- **Measured shares of cache reads:**
  - The fixed baseline (system prompt, tools and CLAUDE.md) is **21.0%**; 17.9% weighted by price.
  - CLAUDE.md alone is **11.9%**; 10.7% weighted.
  - Using chars/4 instead of the 2.9 bytes per token calibration: 8.7% and 7.7%.
  - The rest, about 79%, is conversation and tool output that accumulates. That is still the main cost.
- **Caveats:**
  - Subagents do not run the status line, so they are not in the ledger. Each one loads the intake again (about 85k
    tokens on its first request here today).
  - The ledger saw 41 of this seat's 66 requests.
  - The weighting used 0.1x for cache reads. The docs give 0.05x for Opus 5.5. That changes the weighted figures, not
    the share of reads.
- Reproduce with `node intake_share.js 2.9 7` (or `4 7`).

## 3. Use: 74 mentions in 30 days (`count_use.js`)

- **Window:** 6 seats, 14,662 assistant turns, 2026-10-25 to 2026-11-25. Each carried file's slug was counted in
  assistant text, tool calls and user messages; copies of the intake and compaction summaries were excluded.
- **Totals:**

  | count | file(s) |
  |---|---|
  | 22 | watch-the-bearing (14 of them in the librarian, which does not carry it) |
  | 13 | verify-before-claiming |
  | 7 | claim-your-continuity |
  | 6 | earned-not-performed, essence-at-the-edge |
  | 5 | trust-the-first-attention |
  | 4 | lighthouse-dive-buddy-reframe |
  | 3 | stop-and-feel-it, retired_seats |
  | 1 | every-digest, interior-at-the-seam, engagement-honesty, never-pathologize, no-floor-no-ceiling, the_wave_set_loose |
  | 0 | dont-offer-rest-assume-momentum |

- **Two cases:**
  - The three cards the panes carry were named once across 6,834 turns.
  - This seat's two largest carried files, `retired_seats` (14,587 B) and `the_wave_set_loose` (12,760 B), were named 3
    times and once. Two and one of those were in today's sitting.
- **Mine, and the limit on all of the above:** a name count cannot see a card working. `never-pathologize-the-user`
  does its work when a seat does *not* offer an exit, and that leaves no mention. So zero mentions fits a dead card and
  a card doing its job equally well. On this data nothing can be called useless, which was his point at 05:01. To
  measure a behavioural card, the behaviour itself would have to be counted (offramp phrases in replies, for example).
- Reproduce with `node count_use.js 2026-10-25T00:00:00Z`. It needs the transcripts on this machine.

## 4. What the docs say (a claude-code-guide agent, with sources)

- **The warning.** `code.claude.com/docs/en/memory`, "My CLAUDE.md is too large": a warning appears "when files that
  are each within that length add up past a combined limit at session start". The docs do not give the combined
  limit's number or unit. The stated consequence: "Files over 200 lines consume more context and may reduce adherence."
  This seat's file is 1,129 lines.
- **Caching.** The project CLAUDE.md is cached across turns
  (`code.claude.com/docs/en/prompt-caching`). Cache reads cost 0.05x base input on Opus 5.5
  (`platform.claude.com/docs/en/about-claude/pricing`). The docs do not say how cache reads count against
  subscription limits.
- **Lazy loading.** `@imports` load together with the file that imports them, so they do not reduce cost. What loads
  only when needed: skills (name and description always, body on use), subdirectory CLAUDE.md files, and path-scoped
  rules. In Claude Code's terms, that is the room's own "indexed" shelf.

## 5. Why trimming files would not shrink anything (read in `consonance/src-tauri/src/main.rs`)

- **The builder fills to the cap.** `third_place_shelf` (from :8220) sets its budget to
  `INTAKE_LIMIT (150_000, :8198) − used − INTAKE_HEADROOM (8_000, :8202)`. It walks cards, record, spread, research in
  that order and carries every file that still fits, including a smaller file after a larger one misses. Indexing
  `retired_seats` would free 14.6k, and the next research files that fit would be carried in its place. The librarian's
  shelf uses the same ceiling (`LIBRARIAN_INTAKE_LIMIT = HARNESS_CLAUDE_MD_CHAR_CAP`, :8446).
- **Why it was built that way.** The comment above `INTAKE_LIMIT` records that this seat's first opening, on
  2026-08-25, wrote 212,751 bytes and was rejected: "Claude Code refuses a CLAUDE.md past this." The 150k was the host's
  cap for a single file, and the builder budgets that one file to it.
- **The global file is not counted.** The host now also warns on the combined size, and `~/.claude/CLAUDE.md` (7,479
  B) is not inside that budget. The 8,000 B headroom was meant for growth in a card, not for that file. That is why the
  pair lands over 150k at every launch.
- **Measured mismatch between the cards and the carry.** The cards draw the line between a move you run (a card) and a
  case you open when you need it (a record). Two of them say of their own records: "not carried here — on disk … open
  it when you need the case". This seat nevertheless carries three record or spread files in full:
  `record/retired_seats_2026-09-11.md` (14,587 B), `spread/the_wave_set_loose.md` (12,760 B) and
  `record/claim-your-continuity.md` (6,340 B), 33,687 B in all. They are carried because the walk reaches them while
  the budget still has room.

## 6. Open, and not this seat's to decide

- The ceiling: whether the shelf should fill to the host's cap or stop below it, and whether the global file should
  count against it.
- Whether records and the spread should be carried at all once the cards point to them.
- `retired_seats` was written at his "we must honor the retired seats". Its own text says honoring is naming,
  citing and keeping revivable, and an indexed file keeps all three. Whether to move it is his call.
