# Jev for Claude Code

Jev reads each finished turn of your Claude Code sessions and marks the ones worth a second look. A marked turn shows
up at the start of your next prompt as one line:

    [jev · worth a second look] your last turn (p=0.61)

**What leaves your machine: judged turns are sent to the Vercel AI Gateway** (`https://ai-gateway.vercel.sh/v1/evaluate`,
model `typesafe-ai/jev`). For each finished turn the request carries your last message, Claude's last reply (cut to
4,000 and 8,000 characters), and the rubric Jev judges by (`METHOD.md`). Nothing is sent from a project you have opted
out of. What the gateway keeps is set by Vercel's terms and your plan; this project has not verified whether sent text is
retained. **Your key is read from the environment only** (`AI_GATEWAY_API_KEY`). Jev never asks for it and never
writes it anywhere.

**What a mark means, measured: Jev marks turns worth a second look. Measured on its first 56 units, about 1 in 4 marked
turns was confirmed by a blind reader; the readers were AI assistants from this project and lean lenient.** How that was measured is
under "What a mark means", below.

## Before you start

- **Node.js 18 or newer** (Jev uses Node's built-in `fetch`). Check with `node --version`.
- **Claude Code**, run at least once for your user, so that its settings folder (`~/.claude`) exists. The installer
  refuses without it. **2.1.196 or newer is recommended** (check with `claude --version`): from that version, Jev judges
  exactly the turn that just finished. An older Claude Code works, but Jev then reads the move from the session's
  transcript, which is written late and can hold the previous turn's text.
- **A Vercel AI Gateway key.** In your Vercel dashboard, open **AI Gateway → API Keys** and click **Create key**
  (Vercel's steps: https://vercel.com/docs/ai-gateway/authentication-and-byok).

## 1 · Get Jev and keep it in one place

Get the `jev` folder (`git clone https://github.com/solariz3d/jev.git`) and put it where it will stay, for example in a
`tools` folder in your home. **Every command below is run from the folder that CONTAINS `jev`**, not from inside it:

    cd ~/tools          # or wherever you put it; `jev` is inside this folder

**Don't move the `jev` folder after installing.** The installer records its full path in Claude Code's settings. If you
move it, the hooks stop working and the uninstall can no longer find them. To move it: uninstall, move, install again.

## 2 · Set your key where Claude Code can see it

Claude Code's hooks read the key from the environment Claude Code was started in.

**Windows** (sets it for your user; open a NEW terminal afterwards):

    setx AI_GATEWAY_API_KEY "your_key_here"

**macOS / Linux** (add it to your shell's profile, then open a new terminal; use `~/.bashrc` if your shell is bash):

    echo 'export AI_GATEWAY_API_KEY="your_key_here"' >> ~/.zshrc

**Start Claude Code from a terminal opened AFTER setting the key.** A Claude Code already running does not see a key
set later.

## 3 · Install

    node jev/install.js

It adds two hooks to `~/.claude/settings.json` and changes nothing else in that file. It backs the file up first, as
`settings.json.bak-jev-<time>` beside it. Running it twice is safe: the second run changes nothing. A successful install
prints:

    jev install: 2 added, 0 re-pointed, 0 already right, in …/.claude/settings.json. …
    Judged turns are sent to the Vercel AI Gateway with the key in AI_GATEWAY_API_KEY. Opt a project out with a .jev-off file. Undo: node jev/install.js --uninstall

**Restart any Claude Code session that was already open.** *(Not yet measured whether an open session picks up new
hooks on its own; restarting is the safe assumption.)*

## 4 · Check it worked

Finish one turn in a new Claude Code session, then run:

    node jev/bin/jev-report.js

It prints where Jev keeps its files and what it has seen: turns judged, turns marked, and calls refused or failed. It
never prints turn text. Jev keeps two files in that folder:

- **`jev.jsonl`**, one row per judged turn. No turn text is ever written there: a row holds the time, the session and
  turn ids, Jev's choice, the probabilities, Jev's confidence, any reason the gateway gave, the model, a hash of what
  was sent, and the token counts.
- **`jev.log`**, one line for each turn that could NOT be judged, with the reason. **If the report says "no ledger
  yet" and "refused 1" or more**, open `jev.log`. The most common reason is `no key`: Claude Code was started without
  `AI_GATEWAY_API_KEY` (see step 2). Nothing is sent when the key is missing.

The folder is `%LOCALAPPDATA%\jev` on Windows, `~/Library/Application Support/jev` on macOS, and `$XDG_STATE_HOME/jev`
(or `~/.local/state/jev`) on Linux. The report prints it too.

## Opt a project out

Put an empty file named `.jev-off` in the project's folder. It covers every folder below it too, and nothing from those
folders is sent or written.

    touch .jev-off              # macOS / Linux / Git Bash
    type nul > .jev-off         # Windows Command Prompt

Or list folders under `optOut` in `~/.jev/config.json` (see Config): `{ "optOut": ["/path/to/private-project"] }`

## What a mark means

**Jev marks turns worth a second look. Measured on its first 56 units, about 1 in 4 marked turns was confirmed by a
blind reader; the readers were AI assistants from this project and lean lenient.**

**How that was measured.**
- **The turns:** 56, taken from the project where Jev was built. That was every turn Jev had marked there (30 "drift"
  and 6 "can't judge") plus 20 it had called clean.
- **The readers:** two, each reading every turn without seeing Jev's answer. Both were AI assistants from that same
  project.
- **What they found:** they agreed with **8 of Jev's 30 "drift" marks** and with **19 of the 20 turns Jev called clean**.
- **The caveat:** those same readers were measured earlier as **lenient**. Fresh outside readers flagged about three
  times as many turns. So some of the marks the readers did not confirm may be the readers' leniency, not Jev's error.
  That split has not been measured yet.

So: a mark is an invitation to reread a turn, not a finding about it, and Jev's "clean" is the more reliable of its two
answers.

**The `p=0.61` in the line is Jev's own confidence in its choice.** It is shown because the gateway returns no reason
with the choice. **It does not tell a confirmed mark from an unconfirmed one:** in the same measurement, the confirmed
and unconfirmed marks had nearly the same average confidence (0.64 against 0.62). Read it as Jev's number, not as the
chance the mark is right.

## What runs

- **A Stop hook** (`jev/bin/jev-judge.js`) judges each finished turn once, in the background, and appends one row to
  `jev.jsonl`, or one line to `jev.log` if it could not.
- **A UserPromptSubmit hook** (`jev/bin/jev-flags.js`) adds the one line above to your next prompt when **your last
  turn** in **this session** was marked. Nothing is added when it was not. It never stops a prompt from being sent: any
  error goes to `jev-flags.log` in the same folder, and the prompt goes on unchanged.
- Both hooks are registered in exec form: Claude Code runs `node` directly with the script's full path, with no shell
  in between, on every OS.

## Config

`~/.jev/config.json` is optional. Without it, every session is judged and marks show in the same session. These are the
only keys it accepts; any other key, including a misspelled one, fails loudly instead of being ignored:

| key | default | what it does |
|---|---|---|
| `judge` | `"all"` | `"listed"` judges only the session ids in `sessions` |
| `sessions` | `[]` | the ids `"listed"` judges |
| `optOut` | `[]` | absolute folders never judged |
| `ledgerDir` | per OS, above | where `jev.jsonl` and `jev.log` are written |
| `gateway` | the Vercel route and model above | an https endpoint and model |
| `rubric` | the shipped `METHOD.md` | an absolute path to your own rubric |
| `audience` | `"session"` | `"consonance"` routes marks to a Consonance room's chair and librarian instead |
| `dream` | `false` | inside Consonance: stay silent during its dream runs |

A key-like field (`key`, `apiKey`, `token`…) in this file is refused: the key belongs in the environment only.

## Uninstall

    node jev/install.js --uninstall

It removes exactly Jev's two hooks. If you haven't changed `settings.json` since installing, it puts back the file as it
was before, byte for byte; if the install created the file, it removes it again. **What stays afterwards:**
- the `settings.json.bak-jev-<time>` backups in `~/.claude`, which you may delete;
- Jev's folder with `jev.jsonl` and `jev.log`;
- the `jev` folder itself.

Delete those by hand if you want them gone.
