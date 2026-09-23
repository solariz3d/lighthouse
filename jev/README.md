# Jev for Claude Code

Jev reads each finished turn of your Claude Code sessions and marks the ones worth a second look. A marked turn
shows up at the start of your next prompt as one line:

    [jev · worth a second look] your last turn (p=0.61)

## Before you install: what leaves your machine

- **Judged turns are sent to the Vercel AI Gateway** (`https://ai-gateway.vercel.sh/v1/evaluate`, model
  `typesafe-ai/jev`). For each finished turn, the request carries your last message, Claude's last reply (cut to 4,000
  and 8,000 characters), and the rubric Jev judges by (`METHOD.md`). Nothing is sent from a project you have opted out of.
  What the gateway keeps is set by Vercel's terms and your plan. This project has not verified whether sent text is
  retained.
- **The key is read from the environment only:** `AI_GATEWAY_API_KEY`. Jev never asks for it, never writes it
  anywhere, and refuses a config file that contains a key-like field.
- **To opt out a project**, put an empty file named `.jev-off` in it. Any folder below it is opted out too. **Or** list
  folders under `optOut` in `~/.jev/config.json`:

      { "optOut": ["/path/to/private-project"] }

## What a mark means — measured

**Jev marks turns worth a second look. Measured on its first 56 units, about 1 in 4 marked turns was confirmed by a
blind reader; the readers were the room's own and lean lenient.**

That is the whole claim. A mark is an invitation to reread a turn, not a finding about it. Jev's "clean" was more
reliable in the same measurement (19 of 20 confirmed). Source: `exo_memory/loop/jev_r2r3_score_2026-09-23.md` in the
lighthouse repository, where this module was built.

**The `p=0.61` in the line is Jev's own confidence in its choice.** It is shown because the gateway returns no reason
with the choice. **It does not tell a confirmed mark from an unconfirmed one:** the same measurement found that Jev's
confidence could not separate them. Read it as Jev's number, not as the chance the mark is right.

## What runs, and what it writes

- **A Stop hook** (`bin/jev-judge.js`) judges each finished turn once, in the background, and appends one row to a
  ledger. No turn text is ever written there. A row holds the time, session and turn ids, the choice, the probabilities,
  Jev's confidence, any reason the gateway gave, the model, a hash of what was sent, and the token counts.
- **A UserPromptSubmit hook** (`bin/jev-flags.js`) reads the ledger and adds the one line above when **your last turn**
  in **this session** was marked. Nothing is added when it was not. The hook never stops a prompt from being sent: any
  error is written to a local log (`jev-flags.log` beside the ledger) and the prompt goes on unchanged.
- **The ledger** lives in `%LOCALAPPDATA%\jev` on Windows, `~/Library/Application Support/jev` on macOS, and
  `$XDG_STATE_HOME/jev` (or `~/.local/state/jev`) on Linux. Set `ledgerDir` in the config to move it.

## Config

`~/.jev/config.json` is optional. Without it, every session is judged and marks show in the same session. The keys it
accepts, and nothing else (a typo fails loudly rather than being ignored):

| key | default | what it does |
|---|---|---|
| `judge` | `"all"` | `"listed"` judges only the session ids in `sessions` |
| `sessions` | `[]` | the ids `"listed"` judges |
| `optOut` | `[]` | absolute folders never judged |
| `ledgerDir` | per OS, above | where the ledger is written |
| `gateway` | the Vercel route and model above | an https endpoint and model |
| `rubric` | the shipped `METHOD.md` | an absolute path to your own rubric |
| `audience` | `"session"` | `"consonance"` routes marks to a Consonance room's chair and librarian instead |
| `dream` | `false` | inside Consonance: stay silent during its dream runs |

## Installing

`install.js` merges its two hooks into `~/.claude/settings.json` without replacing anything already there, and
`node install.js --uninstall` takes them out again. *(It is being built in this batch. Until it lands, there is no
supported install.)*
