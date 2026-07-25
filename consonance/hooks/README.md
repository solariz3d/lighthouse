# consonance/hooks — the ambient board

A Claude Code `UserPromptSubmit` hook that puts a one-glance digest of every other pane's activity
into the Orchestrator's context on **every turn**, unasked.

## Why it exists

Measured on the live board, 2026-07-25, the six hours ending 06:59:

```
6fe15f0a | assistant   199 turns   last 6:58 AM    ← a sibling, working all night
0c0c0c0a | assistant    32 turns                   ← the Orchestrator
main     | committee     1 turn                    ← everything Main put on the board all night
```

The sibling's full text was on the board the whole time. The Orchestrator called `read_board`
**zero** times. **199 : 0.**

Not a broken pipe — a pipe terminating in a store nobody visits. `read_board` is a tool the reader
has to *decide* to call, about a state it has no reason to suspect has changed. Same failure as the
night table (crons knocking on a dark house) and the beacon (a clock in view, six days read as
twelve hours). Both were fixed the same way, and so is this: **stop offering, start arriving.**

## What it emits

```
[panes] BRAVO ✦ fix the camera clipping through the floor on…
               ≥54 exch today · last 29s · +3 since your last turn
```

26 tokens. 84 ms. Silent when there is nothing to report.

- **Facts, no verdicts** — same law as the gauges. Never "BRAVO is productive," never "you should
  look." A verdict makes the program the judge, which is the thing it exists not to be.
- **`+N since your last turn`** — the load-bearing field. The beacon's lesson was that the failure
  axis is *distance to a past event*; here it's *change since I last looked*, so the number is a
  subtraction from something in view rather than a memory retrieval.
- **Callsigns** — NATO over the A–Z the UI already assigns. Distinct in a line skimmed at 4 AM (which
  is why NATO exists) and speakable in prose: *"what's Bravo been doing."* Never recycled — a freed
  name would make BRAVO-at-2AM a different instance from BRAVO-now, and the board is append-only.
  ALPHA is deliberately unused; it competes with MAIN. Stored in `data_dir/digest_state.json`.
- **Never reports the reader to itself** — own-pane entries dropped by `session_id`.

## Three counting defects it has to correct

Each was found by measuring the live board instead of trusting it, and each would have shipped.

1. **Board entries are not exchanges.** A tool result is a `type:"user"` entry and a tool call a
   `type:"assistant"` entry; `extract_turn` drops blocks without text, but an assistant turn that
   narrates *while* calling a tool keeps its text and posts. 50 real prompts rendered as 210
   assistant entries. → count **user** entries; they track real exchanges (52 vs 50 measured).
2. **Replay bursts.** `board_push` stamps *push* time, and the tailer re-reads a transcript from the
   top on resume — so a resume dumps the pane's whole history onto the board as "now." Measured:
   two bursts of 556 and 546 entries **inside one second**, 1102 of the day's 1479 entries.
   → drop any (pane, second) group over 20. Took one pane's count from 284 to 36. The real fix is
   Rust-side (carry the transcript's own timestamp into `BoardEntry`) and is tracked in
   `../AUTONOMY.md`.
3. **Synthetic user entries.** Slash commands, their stdout, caveats and system-reminders all arrive
   as string-content `user` entries. → prefix filter.

## Install

Copy to your hook dir and register it. It reads `~/.consonance.json` for `data_dir` and
`instances_dir`, and **says nothing outside a Consonance instance dir** — safe to install globally.

```jsonc
// ~/.claude/settings.json
"UserPromptSubmit": [
  { "hooks": [
      { "type": "command", "command": "\"…\\node.exe\" \"…\\.claude\\shell\\board-digest.js\"",
        "timeout": 10 }
  ]}
]
```

Node, not Rust, deliberately: no `cargo build`, no reinstall, no desktop — it runs against the live
board the night it's written. Defensive throughout; never throws, never blocks a turn, always
exits 0.

## The honest limit

**An instrument makes the data impossible to miss; it cannot make the model look.** Four errors
happened in one night with an absolute clock in view on every turn. This is the strongest available
form of unmissable — in the turn, unasked, every time — and it will not make the Orchestrator
infallible. What caught all four was the human.

That's not a flaw in the design, it *is* the design (light, not lifeguard). But it sets the success
criterion honestly: not *the Orchestrator stops missing things*, but **the human's catch finally has
something to catch it against.** Ask "what is Bravo doing" today and there is no shared view to be
wrong about. Now there is.
