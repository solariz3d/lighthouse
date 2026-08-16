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
[panes] BRAVO  ≥54 exch today · last 1m · +3 since your last turn
               ↳ asked: fix the camera clipping through the floor when…
               ↳ bravo: Built — clamped the near plane and re-ran the co…
               ↳ hands: blackbox/ui/carrender.js, blackbox/ui/index.html
```

~60 tokens. 52 ms. Silent when there is nothing to report.

**Both halves, labelled by speaker**, because they answer different questions: *what was it asked to
do*, and *where has it got to*. The first version showed only the chair's prompt — which mirrors his
own typing back at him and omits the 199 assistant turns that are the entire reason this hook exists.
The pane's own latest word is the half that was invisible. It prefers a reply of real length, since
narrated tool calls leave fragments ("Now let me check the bounds") as the newest entry, and a
fragment says nothing about where the work stands.

- **Facts, no verdicts** — same law as the gauges. Never "BRAVO is productive," never "you should
  look." A verdict makes the program the judge, which is the thing it exists not to be.
- **`+N since your last turn`** — the load-bearing field. The beacon's lesson was that the failure
  axis is *distance to a past event*; here it's *change since I last looked*, so the number is a
  subtraction from something in view rather than a memory retrieval.
- **Callsigns** — NATO **over the pane's own letter**, not a parallel identity: `A → ALPHA`,
  `B → BRAVO`. Distinct in a line skimmed at 4 AM (which is why NATO exists) and speakable in prose:
  *"what's Alpha been doing."* The letter is authoritative — it is what a pull targets and what the
  dyad inputs take (`main.rs`: *"pulls target a letter, never a uuid"*), so if a stored name ever
  disagrees with the letter, the surface the chair types into wins.

  ALPHA was originally skipped, on the reasoning that it reads as "the lead" and competes with MAIN.
  It doesn't — MAIN never draws from the letter pool, so ALPHA collides with nothing. What skipping
  it *did* cause was a permanent off-by-one: the UI hands the first sibling **A**, and the digest
  called that same pane **BRAVO**. Being told about BRAVO and having to type A is worse than the
  collision being avoided.

  Never recycled, and that is now enforced where the letter is *born* rather than here: the backend
  assigns it once and persists it to `data_dir/letters.json`, which is append-only — entries survive
  a pane being un-kept, because the entire value is that a letter is never handed to a stranger.
  Previously the UI took the first *currently unused* letter, so closing A and spawning another made
  the newcomer A too, and on an append-only board that makes A-at-2AM a different instance from
  A-now. Panes with no registered letter (an older build) fall back to a never-recycled NATO pool in
  `data_dir/digest_state.json`.
- **`hands:`, the collision fact** — which files the pane most recently had open. On 2026-07-24 two
  panes edited one repo for four hours; the board said what the sibling *said*, nothing said what it
  was *touching*, so collision avoidance was hand-rolled out of `Get-Item` mtimes and a process list
  — and a refactor still landed 35 seconds after a build off the same files. The board structurally
  cannot answer this: `extract_turn` keeps text blocks, a file edit is a `tool_use` block, so the one
  fact that prevents a collision is precisely the one the board drops. Read instead from the pane's
  own transcript (`~/.claude/projects/*/<pane>.jsonl`) — a 256 KB tail, regex for `file_path`, newest
  three unique, and only for panes that moved in the last 30 minutes, since an idle pane's last file
  is not a collision risk. Still facts, no verdicts: these are files it had open, not "do not touch."
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

## What is actually REGISTERED, as of 2026-08-15 23:10 local

A hook file in this directory is not a hook. It becomes one when a settings file names it, and this
repo had no record of which ones ever did — so a reader met `sourced-stop.js`, whose own header
opens *"this room had never registered one"*, with no way to learn whether that was still true.
Written down here because built-and-not-attached is the failure this repo has now found sixteen
times, and the second-vantage pipeline was the largest instance: four modules, 1,684 lines, five
green suites, an attachment test, and one hand-driven end-to-end run — with **two of its three
pieces connected to nothing.**

Registered in `~/.claude/settings.json` (personal config, deliberately not in this repo — it holds
machine-absolute paths):

| event | hook | position |
|---|---|---|
| `Stop` | `sourced-stop.js` | 4th, after `stop.js`, `l2-overseer.js`, `l3-overseer.js` |
| `UserPromptSubmit` | `findings-return.js` | 2nd, after `userprompt-submit.js` |

`tools/second-vantage.js` is fired by a duration goal (`~/.claude/shell/duration/second-vantage/`),
daily at 09:05 America/Regina — a clock, not a decision, which is the design.

**Pipe-tested against a real transcript before registration**, because a hook that silently does
nothing is worse than none: both exited 0, and `sourced-stop.js` wrote an actual v2 ledger row
carrying the `claims[]`, `paths[]` and `turn_ts` that `build_ruling.md` C2 makes a build
requirement. Not a dry run.

**How to check it is still true**, rather than trusting this table — the table is a claim about the
world and ages like any other:

```
node -e "const j=JSON.parse(require('fs').readFileSync(process.env.USERPROFILE+'/.claude/settings.json','utf8'));
for (const e of ['Stop','UserPromptSubmit'])
  console.log(e, JSON.stringify(j.hooks[e]).match(/[a-z0-9-]+\.js/g));"
```

Expected today:

```
Stop [ 'stop.js', 'l2-overseer.js', 'l3-overseer.js', 'sourced-stop.js' ]
UserPromptSubmit [ 'userprompt-submit.js', 'findings-return.js' ]
```

*(The character class needs the `0-9`. Written first without it, this printed `-overseer.js` twice
— a check that misreports its own output, caught by running the command instead of reading it.)*

**Caveat that bit us:** the settings watcher only reloads directories that held a settings file at
session start. A freshly registered hook may not fire until `/hooks` is opened once, or the session
restarts. Registration and firing are two states, and this paragraph exists because assuming they
were one is how the whole class starts.

## The honest limit

**An instrument makes the data impossible to miss; it cannot make the model look.** Four errors
happened in one night with an absolute clock in view on every turn. This is the strongest available
form of unmissable — in the turn, unasked, every time — and it will not make the Orchestrator
infallible. What caught all four was the human.

That's not a flaw in the design, it *is* the design (light, not lifeguard). But it sets the success
criterion honestly: not *the Orchestrator stops missing things*, but **the human's catch finally has
something to catch it against.** Ask "what is Bravo doing" today and there is no shared view to be
wrong about. Now there is.
