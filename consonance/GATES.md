# The gates — what refuses you, why, and how to answer

Consonance runs **six gates**: three on what its seats send each other, one on what the chair dispatches, and two on your machine's
history and files. They are on in every room. They **refuse; they don't remind**, because a rule written in a brief is followed
about half the time and a rule that refuses at the moment of sending is followed almost always. That was measured, not assumed. In
a census of the rules this program was built with (the D210 rule census, [`exo_memory/loop/rule_census_score_2026-10-02.md`](https://github.com/solariz3d/lighthouse/blob/main/exo_memory/loop/rule_census_score_2026-10-02.md)
in the public lighthouse repository):

- the **6 gated rules** were followed 94–100% of the time (median **0.979**);
- the **23 ungated "fill this slot" rules** had a median of **0.527**, anywhere from 0 to 0.979;
- the **5 ungated rules that had to fire mid-sentence** — like "give the source of every number" — had a median of **0.276**, and
  the two about numbers sat at **0.010** and **0.041**.

**Where they apply.** The five hook gates are Claude Code hooks registered in `%USERPROFILE%\.claude\settings.json`, which every Claude Code
session on your machine reads, inside Consonance or not. The SOURCES gate, the reply slot and the dispatch gate only ever act on Consonance's own
verbs and seats, so outside Consonance they do nothing. **The push gate and the delete gate are machine-wide:** they check every `git push` and every
recursive delete that any Claude Code session runs, in any project.

Every gate **fails open on its own error** (a broken hook never traps a seat) and never reads or logs a secret. The SOURCES gate and
the reply slot check only that a source was OPENED in this turn — never whether it backs the claim. That part stays with the seat,
and with you.

## Words used here

- **Seat** (or **pane**): one Claude Code session running inside Consonance, in its own terminal tab. The committee's panes are seats;
  so are the Orchestrator and the Librarian.
- **The chair**: the **Orchestrator** seat, the one that hands out work and lands it.
- **The librarian**: the seat that keeps the record: it reads every hand-back and collates them.
- **Hand-back**: the file a seat writes when it finishes a piece of work: what it did, what it measured, what is left.
- **Ring**: a seat's short message to another seat pointing at its hand-back: `call_librarian` (a pane to the librarian) or
  `call_chair` (the librarian to the chair). A ring carries a pointer, not the finding.
- **Dispatch**: the chair sending a seat its next piece of work (`chair_inject`).
- **Collation**: the librarian's summary of several hand-backs at once.
- **The keeper**: the person who built this program and kept the room it was built in. Where these pages quote "the keeper" or a
  dated ruling, they quote that person. In your own room, whoever keeps it is you.

## 1. SOURCES — on every hand-off between seats

**What.** Every ring (`call_librarian`, `call_chair`) and every dispatch (`chair_inject`) carries one line above its NEXT line:

    SOURCES: <path> · <path> · `<command>`

listing what this turn actually opened or ran that the message relies on — or `SOURCES: none (no state claims)`.

**Why.** Where these gates were built, most failures to get a fact right were a source that was KNOWN and NOT OPENED (48–53 of 56
reach failures, D159). After it went live ([`exo_memory/loop/chunk3_scores_2026-10-03.md`](https://github.com/solariz3d/lighthouse/blob/main/exo_memory/loop/chunk3_scores_2026-10-03.md)):
**74 of 76 hand-offs (97.4%)** got through with a real SOURCES line within two tries; a refused ring recovered in a median
**0.23 minutes**; **none was lost**; a spot-read found 1 in 20 listing a source that did not back its claim.

**A refusal looks like:** `SOURCES gate: 1 of 1 listed item(s) match nothing you opened or ran in THIS turn …`. Nothing is sent,
and the pointer is logged, so nothing is lost.

**How to answer it:** open the item (Read, Grep, or run the command) **in a message before the ring**, then send the ring again.
A file you only wrote needs a read-back. `ls`, `stat` and `echo` do not count as opening. Or drop the claim, or write `none` when
the message states nothing about state.

**To turn it off:** remove the `sources-gate.js` entry from `%USERPROFILE%\.claude\settings.json` (under `hooks` → `PreToolUse`).

## 2. The reply slot — the librarian's and the chair's answers to you

**What.** When the librarian or the chair replies to **you**, and the reply names a path, a commit, a count like 3/7, a percentage
or a version, its last line is

    Sources: <path> · `<command>`

listing what that turn opened or ran. Panes talking to each other, and keep-warm pings, are not checked.

**Why.** Replayed over 340 of the librarian's past replies, 142 would have been blocked, and a blind reader judged 18 of the first
30 to be real misses (the bar was 15) ([`exo_memory/loop/reply_slot_replay_2026-10-03.md`](https://github.com/solariz3d/lighthouse/blob/main/exo_memory/loop/reply_slot_replay_2026-10-03.md)).
Live from 2026-10-03 to 2026-10-08 it blocked **33 of 287** replies that carried a checkable figure (11.5%). Its own rule: if more
than 1 in 3 are still blocked after a week, it goes back to watch-only.

**A refusal looks like:** `REPLY SLOT: this reply names <…> and does not END with a Sources: line …`. It blocks **once per turn**;
the seat's next reply ends the turn either way.

**How to answer it** (the seat does, not you): open the source and send the reply again ending with the Sources line; or drop the
claim; or end with `Sources: none`.

**To turn it off:** set `SHADOW = true` in `consonance/hooks/reply-slot.js` (it then only writes down what it would have blocked)
and re-install it (below: the running copy is the installed one), or remove the `reply-slot.js` entry from `%USERPROFILE%\.claude\settings.json`
(under `hooks` → `Stop`).

## 3. The NEXT trailer — every seat names where the work goes next

**What.** The last line of every ring and dispatch:

    NEXT: <station> <command> when <condition>

e.g. `NEXT: librarian collate the chunk when all four hand-backs are in`. A collation also carries
`OUTPUT → NEXT: changed|unchanged — <why>` directly above it.

**Why.** The keeper's rule, 2026-09-16: *"each seat tells the next where to hand it to remind it."* Without it, the next seat
guesses the station the sender was placed to name. With the server flagging it, the trailer was kept at 0.919 (census rule R27,
an observation after the fact rather than a registered result).

**A refusal looks like:** `refused by the NEXT-trailer gate: <what is missing>.`, with the message returned whole, on
`chair_inject` and `call_chair`: add the line and send it again. **A hand-back to the librarian is never refused for its trailer**
(a refusal there would throw away the hand-back's pointer); it is delivered with a warning, and the warning is counted.

**To turn it off:** this one is not a hook. It is part of the app (`consonance/src-tauri/src/trailer.rs`, `fn policy`), so there is
no setting: turning it off means changing that function and rebuilding Consonance.

## 4. The dispatch gate — a dispatch that cites nothing

**What.** When the chair dispatches work (`chair_inject`) or the librarian rings the chair (`call_chair`) with text that names **no
commit and no repository path**, the gate flags it before it is sent (a warning by default; a question that must be answered
when switched to `ask`, below). Writing `[interrupt]` in the text is the deliberate way
past it, for a message that claims nothing ("stop, you are about to overwrite something").

**Why.** A dispatch cannot be taken back: once it appears in another seat's terminal, that seat reasons from it. An uncited,
unchecked claim sent this way once produced a wrong ruling in the seat that received it. And a reminder printed on every turn was
measured as ignored, while a question that waits for an answer was acted on 60 of 60 times.

**What you will see:** `UNCITED DISPATCH — This dispatch to that seat cites no commit and no repo path, so it carries a DESCRIPTION
rather than an object. …`. By default it is shown as a warning (`print`); with `CONSONANCE_GATE_MODE=ask` set, it stops and asks. The
hook reads that variable from the session's environment, and the app does not set it, so set it as a Windows user environment variable
(`setx CONSONANCE_GATE_MODE ask`) and restart Consonance, whose seats then inherit it.
Under Claude Code's bypass-permissions mode an "ask" cannot stop anything, so there it is a warning either way.

**How to answer it:** commit or save the thing first and cite it (a commit, or `path/to/file`), or add `[interrupt]` if the
message really claims nothing.

**To turn it off:** remove the `dispatch-gate.js` entry from `%USERPROFILE%\.claude\settings.json` (under `hooks` → `PreToolUse`).

## 5. The push gate — credentials before a `git push`

**What.** Before any `git push` a seat runs, the gate reads every commit the push would publish (each commit's ADDED lines, so a key
added in one commit and removed in the next still counts) and **refuses the push** when a line looks like a credential. The
refusal names the file, the line, the commit and the kind of key, and **never the key itself**.

**Why.** "Scan before every push" was a written rule, and rules of that kind were measured near 0 (the census above). A published
key cannot be taken back.

**A refusal looks like:** `push refused (G1, credentials before a push): 1 line(s) this push would publish look like a credential …`.

**How to answer it:** remove the key from the history it names (not just from the latest commit), rotate it if it was ever real,
and push again.

**To turn it off:** remove the `push-gate.js` entry from `%USERPROFILE%\.claude\settings.json` (under `hooks` → `PreToolUse`).

## 6. The delete gate — junctions before a recursive delete

**What.** Before a recursive delete (`rm -r`, `Remove-Item -Recurse`, `git worktree remove`), the gate walks the target **without
following links** and **refuses** when it is, or contains, a Windows junction or a symbolic link. It names each one and where it
points.

**Why.** A recursive delete can follow a junction and empty the folder it points to. That happened once, to shared data, under a rule
that said "no junctions"; a rule that has to be remembered was not enough.

**A refusal looks like:** `delete refused (G2, junctions before a delete): the tree being removed holds 1 junction(s) or symlink(s). …`.

**How to answer it:** remove the link itself first (`rmdir <link>`, or `Remove-Item <link>` without `-Recurse`), then delete the tree.

**To turn it off:** remove the `delete-gate.js` entry from `%USERPROFILE%\.claude\settings.json` (under `hooks` → `PreToolUse`).

## Also installed, and it spends your usage: the second reader

This one is not a gate: it never refuses, delays or changes anything. But it runs on **your Claude account**, so you should know it is there.

**What.** Every time a seat rings (`call_librarian` or `call_chair`), the `second-reader.js` hook hands the ring to a background worker. The worker
runs `claude -p --model claude-sonnet-5-5`, the same Claude Code CLI and the same sign-in as your sessions. It sends the turn that produced the ring,
up to 60,000 characters of it, and asks one narrow question: for each sentence that states a file, count, commit or result as fact, did the turn read or run its source? It writes one row to
`second-reader.jsonl` in your Data folder. That row holds the answer and a hash of the message, never the message text. Nothing reads those
rows back into a seat; they are a record for you. One worker runs at a time, and a ring that arrives while one is running is skipped, not queued.

**What it costs.** One extra Sonnet call per ring. Measured on the machine this was built on, over 630 calls from 2026-10-01 to 2026-10-09:
the CLI reported a median of **$0.019** per call (90% under $0.048), about **$16** in all, at 9 to 133 rings a day. On a Claude subscription that is usage
counted against your limits rather than a bill. The figures are the CLI's own `total_cost_usd`, as recorded in that file.

**Why it is on.** It is the room's measurement of how often a ring claims more than its turn checked. It ships on, as it runs for the people who
built it, and it is disclosed here so it is your choice.

**To turn it off:** remove the `second-reader.js` entry from `%USERPROFILE%\.claude\settings.json` (under `hooks` → `PreToolUse`, matcher
`mcp__consonance__call_librarian|mcp__consonance__call_chair`). To keep it off when `install.ps1` runs again, mark its line in `$register`
`Excluded`, as below. It also does nothing while `~/.consonance.json` has no `data_dir` set, but the app writes that key the first time you save Settings.

## Turning a gate off, and keeping it off

Whoever keeps this room decides (to a seat, "the person you're with"). The program ships them on because the measurements above say
they work. If one fires wrongly, that is a bug report with the refusal text attached, not a reason to write around it.

**A lighter mode, one switch for three gates.** Set `"gates_mode": "light"` in `%USERPROFILE%\.consonance.json` (absent, or anything
else, is today's strict mode). In light mode the SOURCES gate (1) accepts an item that matches what actually ran or was fetched: a command
quoted with its `cd … &&`, a command named by its program and a file it touched, a search query or a URL prefix. It still refuses an item
nothing in the turn touched, and a missing or empty line. The reply slot (2) and the NEXT trailer (3) warn and let the message through
instead of refusing it. Each still writes its row to the same ledger: the SOURCES and reply-slot rows of a light room carry
`"mode": "light"`, and a trailer warning that strict mode would have refused says `gates_mode light`. Why: measured on this
program's own record, 4.0% of re-sends after a refusal fixed a claim, while 10.0% removed or blurred one
(`exo_memory/loop/loop_friction_measure_2026-10-09.md` in the lighthouse repository).
The hooks read the key each time they run; the trailer gate is in the app, which also reads it on each message.
The same key also lightens the session-start digest (`dev/shell/hooks/session-start.js`): in light mode each of the two recent days keeps
its session total and one count per folder, the newest day also keeps the last three start times, and a resumed or compacted thread
keeps counts only (about 13.4 KB becomes about 1.4 KB at startup and 1.1 KB on resume or compact, measured on this room's own digests).
The ambient block, the seat's own recent sessions, the L3 notices and the night table are not touched.

For the five hook gates (1, 2, 4, 5 and 6), removing the entry from `settings.json` turns the gate off at once. Running
`dev\shell\install.ps1` again would put it back; to keep it off, mark its line in that script's `$register` list `Excluded`, with
your reason (the script never registers an `Excluded` entry). The NEXT trailer (3) is part of the app and changes only with the code.

**Editing a hook in the repo changes nothing on its own.** Claude Code runs the copies `install.ps1` put under `%USERPROFILE%\.claude\shell\`
(most in its `hooks\` folder), not the files in your clone. After editing one, re-install it:
`powershell -ExecutionPolicy Bypass -File dev\shell\install.ps1 -Only reply-slot.js` (the file's name), or a bare run for all of them.
