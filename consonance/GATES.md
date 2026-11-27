# The gates — what refuses you, why, and how to answer

Consonance runs **eight gates**: five on what its seats send each other, one on what the chair dispatches, and two on your machine's
history and files. They are on in every room. They **refuse; they don't remind**, because a rule written in a brief is followed
about half the time and a rule that refuses at the moment of sending is followed almost always. That was measured, not assumed. In
a census of the rules this program was built with (the D210 rule census, [`exo_memory/loop/rule_census_score_2026-10-02.md`](https://github.com/solariz3d/lighthouse/blob/main/exo_memory/loop/rule_census_score_2026-10-02.md)
in the public lighthouse repository):

- the **6 gated rules** were followed 94–100% of the time (median **0.979**);
- the **23 ungated "fill this slot" rules** had a median of **0.527**, anywhere from 0 to 0.979;
- the **5 ungated rules that had to fire mid-sentence** — like "give the source of every number" — had a median of **0.276**, and
  the two about numbers sat at **0.010** and **0.041**.

**Where they apply.** The six hook gates are Claude Code hooks registered in `%USERPROFILE%\.claude\settings.json`, which every Claude Code
session on your machine reads, inside Consonance or not. The SOURCES gate, the reply slot, the dispatch gate and the wake gate only ever act on Consonance's own
verbs and seats, so outside Consonance they do nothing. **The push gate and the delete gate are machine-wide:** they check every `git push` and every
recursive delete that any Claude Code session runs, in any project.

Every gate **fails open on its own error** (a broken hook never traps a seat), except two: the map gate in strict mode, which refuses
rather than pass a hand-back it could not check (section 7); and the **push gate, which FAILS CLOSED on a push** (D677, 2026-11-15:
it once let a push through unscanned on "not a git repo"). A push it cannot scan, an error or a hang in the scan, is refused with the
reason; what is not a push still passes. And no gate reads or logs a secret. The SOURCES gate and
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

**And files over 10 MB (Lap W, ruling 6, 2026-11-13).** The same gate refuses a push that would send any single file over 10 MB
(10,000,000 bytes): every file the remote does not have yet, so a large file added and deleted again before the push still counts.
The refusal names each file and its size: `push refused (Lap W ruling 6, no file over 10 MB): …`. Answer it by taking the file out
of every unpushed commit that carries it, and keep large records in the private repository that holds the key. Why: one 85 MB
encrypted transcript (commit `3de92e53`) made a morning's catch-up 90.5 MB on both machines; it stays where it is, by ruling, and the
next one is refused before it leaves.

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

## 7. The map gate — a hand-back that added or removed source files

**What.** When a seat hands back to the librarian (`call_librarian`), its ring names each repository the work changed on a line
above `SOURCES:`:

    BASE: <checkout path> <base sha>

the folder the seat worked in and the commit its packet named as the base. For each such line the gate runs
`git diff --no-renames --name-status <base> HEAD` in that folder, so a renamed or split file counts as one deleted and one created.
When a file under `src/`, `app/`, `consonance/src-tauri/src/` or `consonance/tools/` was **created or deleted**, and no file named
`MAP.md` is in the same diff, the map has fallen behind the code. A file changed in place is not checked: whether its entry still
reads true is a judgment, and the gate checks only what is mechanical. Only committed work is seen.

**Why.** Everyone writes up what they built; nobody checks that the code map heard about it. A map that a rule asks people to keep
goes stale the way the room's other remember-to rules did (the census above), and a reader who trusts a stale map is worse off than
one with no map.

**Warn or refuse.** It follows the `gates_mode` switch in `%USERPROFILE%\.consonance.json`, which the SOURCES gate also reads:
- **light**: the hand-back is delivered with a line naming the files, `[MAP NOT UPDATED — <folder> <base>..<head>: N source file(s)
  created or deleted and no MAP.md in the diff: A src/…, D app/… ; gates_mode light, strict would refuse]`, and the line is posted to
  the board.
- **strict** (the default): `refused by the map gate: …`, naming the files and how to recover; the hand-back is not delivered, and
  the attempt is posted to the board so its pointer is not lost.

**When the gate cannot run.** A `BASE:` line with no commit, a commit that is not a sha (a branch name moves, so it is refused), a
folder git cannot open, a base that is not a commit there, or a git that fails: never a silent pass. In light mode the hand-back is
delivered with `[MAP GATE COULD NOT RUN — <folder> <base>: <why>; gates_mode light, strict would refuse]` and the line is posted; in
strict mode it is refused like the case above. A ring with **no** `BASE:` line is delivered in both modes, marked
`[NO map check — this ring names no BASE: line …]`, and counted on the board, because work that changed no repository has
nothing to name. Every line the gate posts is under the board name `map-gate`.

**How to answer it:** add, change or remove each named file's entry in that repository's `MAP.md` and commit it there, or correct
the `BASE:` line; then ring again.

**To turn it off:** this one is not a hook. It is part of the app (`consonance/src-tauri/src/mcp.rs`, `fn map_gate`): light mode
makes it warn instead of refuse; turning it off means removing its call from `call_librarian` and rebuilding Consonance.

## 8. The wake gate — the librarian's first ring after a wake

**What.** When the librarian wakes (a resume, a fresh start or a compaction), its **first** `call_chair` is refused until it has
opened, **whole**, since that wake:
- its newest dated note, `exo_memory/librarian/<date>.md` (picked by the date in the name, no more than a day ahead of today);
- every handoff the other machine wrote on its newest date, `exo_memory/loop/handoff_*_<date>-<L or D>.md` (the other machine is
  read from `machine_tag` in `%USERPROFILE%\.consonance.json`).

"Whole" means one `Read` with no offset and no limit (`allow_large` is fine), or a shell command whose stage is only `cat`, `type`,
`Get-Content` or `gc` naming the file, with no pipe after it, no redirect and no `-TotalCount`/`-Head`/`-Tail`. A result Claude Code
saved aside as a preview (`<persisted-output>`) is not whole. On a **resume** wake, a whole open made since the last compaction still
counts while the file has not changed since; on a **compaction** wake, nothing from before it counts, because the summary dropped it.
Only the librarian is gated (`hooks\wake-gate.js`, matcher `mcp__consonance__call_chair`); every other seat is never gated. A
subagent's `call_chair` is refused. The second and later rings after a wake are not gated.

**Why.** At its 14:42:47Z wake on 2026-11-13 the librarian rang the chair after grepping its own note and cutting a handoff; nothing
it rang about came from reading either. The room's warnings on the same ring reached no seat. A note opened whole is in the window;
a grep of it is not. Ruled for the librarian only, refusing, on D (`exo_memory/loop/plan_room_stretch_2026-11-13.md:96`, ruling 2).

**Warn or refuse.** It refuses on the machine tagged `D` and only warns and records elsewhere (not ruled for L). It does not read
`gates_mode`.

**A refusal looks like:** `wake gate (W4, the librarian's first call_chair after a wake): since your resume wake at …, these were not
opened whole: exo_memory/librarian/2026-11-13.md …`.

**How to answer it:** open each named file with one `Read`, no offset or limit, `allow_large: true`; then ring again in a **later**
message (a ring in the same message as the Read is decided before the Read's result is on disk). A stop or hold that cannot wait one
read: put `[interrupt]` in the ring's text; it passes and is recorded.

**What it records.** `wake-gate.jsonl` in the data folder: every decision, the files missing and satisfied, and the kind
(`missing`, `own-append` when the seat's own append outdated an earlier whole open, `not-first`, `interrupt`, `subagent`,
`nothing-required` with its skips `no-note`, `no-handoff`, `no-machine`). The row is written before a refusal; a refusal that cannot be
recorded is not given. `node wake-gate.js --replay <transcript.jsonl>` counts how every ring in a transcript would have been decided.

**To turn it off:** remove the `wake-gate.js` entry from `%USERPROFILE%\.claude\settings.json` (under `hooks` → `PreToolUse`).

## Shipped, and off since 2026-11-25: the second reader

This one is not a gate: it never refuses, delays or changes anything. But it runs on **your Claude account**, so you should know it is there.

**What.** Every time a seat rings (`call_librarian` or `call_chair`), the `second-reader.js` hook hands the ring to a background worker. The worker
runs `claude -p --model claude-sonnet-5-5`, the same Claude Code CLI and the same sign-in as your sessions. It sends the turn that produced the ring,
up to 60,000 characters of it, and asks one narrow question: for each sentence that states a file, count, commit or result as fact, did the turn read or run its source? It writes one row to
`second-reader.jsonl` in your Data folder. That row holds the answer and a hash of the message, never the message text. Nothing reads those
rows back into a seat; they are a record for you. One worker runs at a time, and a ring that arrives while one is running is skipped, not queued.

**What it costs.** One extra Sonnet call per ring. Measured on the machine this was built on, over 630 calls from 2026-10-01 to 2026-10-09:
the CLI reported a median of **$0.019** per call (90% under $0.048), about **$16** in all, at 9 to 133 rings a day. On a Claude subscription that is usage
counted against your limits rather than a bill. The figures are the CLI's own `total_cost_usd`, as recorded in that file.

**Why it is off.** It was the room's measurement of how often a ring claims more than its turn checked. On 2026-11-25, 9 of its newest 20 flags
were right when checked against the turn, and the one seat it reads did not want its note, so `install.ps1` marks it and its same-turn note
(`second-reader-note.js`) `Excluded`: no run registers them. Their files are still copied.

**To turn it off:** on a machine that registered it before, remove the `second-reader.js` entry from `%USERPROFILE%\.claude\settings.json` (under
`hooks` → `PreToolUse`, matcher `mcp__consonance__call_librarian|mcp__consonance__call_chair`) and the `second-reader-note.js` entry (under
`PostToolUse`, matcher `mcp__consonance__call_chair`). `install.ps1` never removes a registration; its `-Check` names a live one EXCLUDED BUT LIVE.
**To turn it back on:** delete `Excluded = '...'` from both lines in `$register` and run
`install.ps1 -Only second-reader.js,second-reader-worker.js,second-reader-note.js`. When `~/.consonance.json` sets no `data_dir`, it uses the
default Data folder, `%USERPROFILE%\.consonance`, as the app does.

## Built and not installed: the claim check

This one is not counted among the six because it does not run in a new room. Its refusal points here, so here is what it is.

**What.** `consonance/hooks/claim-check.js` reads what a seat is about to send (a reply to you, a ring or dispatch, a write into
`exo_memory/`) and refuses a claim about state or a figure when nothing in the same turn could have shown it wrong. It asks only
whether the turn *could* have known, never whether the claim is true.

**Where it stands.** `install.ps1` neither copies nor registers it: it is on that script's list of hooks declared unmanaged
("installable, deliberately not installed"), so it never fires until someone installs and wires it. Even then
it acts only when `%USERPROFILE%\.consonance.json` sets `"claim_check": true` (refuses) or `"shadow"` (logs what it would refuse,
refuses nothing); anything else, or no key, is off.

**A refusal looks like:** `CLAIM CHECK: 1 claim(s) in this message have nothing in THIS turn that could have shown them wrong. …`.
It refuses once per turn and place; a second send goes through.

**How to answer it:** run or open the thing that shows the claim, in a message before this one; or drop the claim; or put it on a
line starting `inferred:` and name where it would be checked.

## The heavy-run lock

Not a hook either: the suite runner and the mutant harnesses take it themselves, and so can any run you wrap in
`require('./consonance/tools/heavy-run.js').hold({ cmd })`.

**What.** One heavy run per checkout at a time, and by default two at once on the machine (`CONSONANCE_HEAVY_SLOTS`, 1 to 8). A second
heavy run in the same checkout **waits**, says whom it waits on (`heavy-run: waiting on <seat> pid <pid> (<cmd>, since <t>)`), and
after 30 minutes **stops** with the holder's details (exit 3). A heavy run also **refuses to start** when a drive it writes to has
under 20 GB free (exit 4).

**Why.** Two suites in one checkout read each other's half-written files, so neither result means anything; and a full disk fails
every seat's writes, not only the run's.

**A refusal looks like:** `heavy-run: refusing to start: <drive> has 12.3 GB free, under the 20 GB floor; …`.

**How to answer it:** free space on that drive (`node consonance/tools/janitor.js` lists what it would remove, and removes nothing
without `--apply`), or, for a wait, let the holder finish or ask that seat.

**To change it:** `CONSONANCE_HEAVY_WAIT_MS` sets the wait. The disk floor is `DISK_REFUSE_BYTES` in `consonance/tools/heavy-run.js`;
there is no switch for it.

### The exclusive hold (D663)

**What.** A run that needs the machine quiet takes the **exclusive hold**: `hold({ cmd, exclusive: true })`, or from a shell:

    node consonance/tools/heavy-run.js --run --exclusive --cmd "<what>" -- <program> [args...]

- **The hold file.** It writes `<data>/heavy-run.hold`.
- **It waits for the machine to empty.** Until every slot is free of other runs, in any checkout and from any seat.
- **Then it runs.** Every other heavy run waits for as long as the hold stands, and says once:
  `heavy-run: waiting on an exclusive hold by <seat> pid <pid> (<cmd>, since <t>)`. The 30-minute wait and its exit 3 apply as for
  the lock.
- **Its own children pass.** They carry its token.
- **A dead holder's hold is taken over** by the lock's own rules.
- **A hold older than 90 minutes is ignored,** with a loud `heavy-run: IGNORING the exclusive hold by …` line, so a forgotten hold
  never parks the room.

**Why.** A hold relayed in words cannot bind: it waits in a busy pane's inbox. On 2026-11-11, C's slot-2 work ran in P's quiet
landing window 14 minutes before the word reached it. A file every runner reads binds at once.

**The rule that goes with it:**
- **Take the exclusive hold for** a timing session and a landing's quiet window, and mark a timing session with `--timing` as well
  (D678 N1, below).
- **Run these through heavy-run too:** Blender bakes and any game run over 10 seconds (the ordinary lock, `--run` without
  `--exclusive`, or `hold({ cmd })` in a node wrapper). A run that never takes heavy-run is not stopped by the hold; A's Blender runs
  and the short `dz-world` runs did not, which is how unlocked load reached P's window.
- **Not in scope:** a process watcher.

### Who holds what: `--status` (D675)

**What.** `node consonance/tools/heavy-run.js --status` prints the holder of the exclusive hold and of each slot (seat, pid, command,
since), judged by the same rules `--run` applies: a dead holder, a young lock's second witness, a reused pid, a hold past 90 minutes,
the caller's own hold. It reads only: it takes no slot, moves or writes no file and posts nothing. **It exits 1 while an exclusive
hold stands, or while a live slot of another run is marked a timing session,** and prints a `GATE: exit 1 — …` line saying which; 0
otherwise (slots may still be held); 2 when it cannot read the data dir.

**A timing session says it is one (D678 N1, pane O, 2026-11-27).** `--run --timing`, or `hold({ cmd, timing: true })` from node,
writes `"timing": true` into the run's slot lock, and `--status` shows it on that slot's line (`— a timing session (--timing)`). The
`--cmd` label is **never read** for this, whatever it says. Until 11-27 the label was read: "timing" counted unless it followed "not a",
and "(read, not timing)" closed this gate on every seat for six minutes (`exo_memory/handback/p-d678-ripple-read-E_2026-11-27.md` §9). A
phrase rule's list of negations is always one behind, so the label is now prose only. A run whose label mentions timing without
`--timing` is told so on stderr when it starts. A timing session also takes `--exclusive`; the two are separate flags. The rule and what
broke under it: `exo_memory/handback/p-d678-heavyrun-stalls-O_2026-11-27.md`.

**Run it before any run, light or heavy, and run nothing while it exits 1:**

    node consonance/tools/heavy-run.js --status && <your run>

**Why.** On 2026-11-13 and 11-14 five runs went beside another seat's exclusive hold, each after the three files were read by hand
and one was missed. The case a by-hand read misses is a hold file with no lock file; it is the status's first row.

**To change it:** `HOLD_MAX_MS` in `consonance/tools/heavy-run.js`. A hold whose run is over can be removed by hand; the IGNORING line and
the wait's exit-3 message name its file.

### Running a script under the lock (D675)

**What.** `--run` starts a `.cmd` or `.bat` itself: `cmd.exe` from an argument list, `/d /s /c ""<path>" <args>"`, with no shell between.
`--priority belownormal` (or `idle`) is set on heavy-run's own process before anything starts, so everything the script starts inherits
it; any other value is refused with exit 2, because a child keeps only those two classes of its creator (CreateProcessW,
`dwCreationFlags`). An argument or a script path carrying a cmd metacharacter (`& | < > ^ % "`) is refused with exit 2 and never
quoted around. The script's own exit code is the run's.

**The one line to run a script under the lock:**

    node consonance/tools/heavy-run.js --run --priority belownormal --cmd "<what>" -- <file.cmd> [args]

Add `--exclusive` for a landing's quiet window, and `--exclusive --timing` for a timing session.

**`cmd C:/` is refused (D678 N1).** Typed from Git Bash, `-- cmd /c <file>` reaches node as `cmd C:/ <file>`: cmd.exe with no `/c`, an
interactive shell that waits on its input and holds the slot until someone stops it (three times,
`exo_memory/loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`). `--run` refuses cmd or cmd.exe given a bare drive (`C:/`, `C:\`,
`C:`) before its first `/c` or `/k`, with exit 2, before any slot is waited on, and says what to type instead: the script given to
`--run` itself, `cmd //c …`, or `MSYS_NO_PATHCONV=1`. A drive after the switch is the command's own argument and passes.

**What it cannot remove.** Git Bash rewrites an argument that begins with a slash into a path before node sees it, so a script's own
switches go as words or with a dash, never `/x`. And a broken `start` or `cmd /c` line *inside* a script is not caught here; the guard
(the IDLE HOLDER line) stays the net.

**Why.** Three times (11-12 B, 6 minutes; 11-13 E, 40 minutes; 11-14 E, 50 minutes) a hand-made launch line left an idle shell holding
the lock (`exo_memory/loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`).

### A pause, held as the exclusive hold (D675)

**What.** `node consonance/tools/heavy-run.js --pause --cmd "<why>" [--minutes N]` starts a detached, hidden holder that takes the
exclusive hold by the lock's own path and holds no slot: runs already in a slot finish, and every new run waits. The hold record carries
`pause: true` and `max_ms`, honoured instead of the 90-minute maximum (default 180 minutes, at most 720). `--status` exits 1 and says
when the pause ends. `node consonance/tools/heavy-run.js --resume` removes a pause and nothing else (a timing session's or a landing's
hold is refused, exit 2), and its holder exits. A dead pause holder is stale like any holder, so a pause never outlives it.

**Why.** On 2026-11-14 a pause sent by message at 13:22 sat queued across a pane's compaction, and that pane built and ran a test at 13:27
while he played. It had asked the lock first; a pause written as the hold would have stopped it there.

### Waiting for his game (D675)

**What.** `node consonance/tools/heavy-run.js --wait-game [--max-minutes N]` reads the process list every 30 s and waits while a game of
his runs; it exits 0 when none runs, 3 at its maximum (default 240 minutes), and 2 when the list cannot be read. It only reads and never
closes anything. A game of his: `StarCitizen` and `acs` whatever their window; `dz-world`, `dz-gym` and `dz-view` only with a visible
window (the panes' offscreen runs have none); anything under `steamapps\common` with a visible window; and the names in the heavy
profile's `games` field (`~/.consonance.json`, or `CONSONANCE_HEAVY_GAMES`). The RSI Launcher and Steam itself match none of these.

**The line before any run, light or heavy:**

    node consonance/tools/heavy-run.js --wait-game && node consonance/tools/heavy-run.js --status && <your run>

**Why.** On 2026-11-14 three panes each wrote their own wait, and none saw Star Citizen.

## The app's delivery refusal

**What.** When a message is sent to a seat whose terminal has exited and is not being reopened, the app writes it nowhere. It sends
the sender a note that begins `[delivery, from the app — not the keeper] REFUSED: your message to … was not delivered.`, names the
exit, and quotes the message, and the board gets a `REFUSED NOT DELIVERED` row.

**The label.** A line that begins `[… — not the keeper]` (this note, or the chair's keep-warm pings) was written by the program or a
seat, not typed by the person at the keyboard. In these labels "the keeper" is the program's fixed word for that person.

**How to answer it:** reopen the seat (↻ on its pane) and send the message again. A running seat is never refused this way.

**To turn it off:** there is nothing to turn off; it is part of the app (`consonance/src-tauri/src/pane_exit.rs`).

## Rules that are not gates

These are written rules. Nothing refuses you for breaking them, and the census above says how often that kind of rule is followed.
They live in the seats' briefs:

- **How much checking a change gets**: the three tiers, *just do it*, *check it* and *prove it*, are in `COMMITTEE.md`, "Run what
  your packet's tier asks".
- **The machine is the person's**: in `BUILDING.md`, "Leave the machine as you found it". Heavy runs at BelowNormal priority, and
  disk-heavy ones at low I/O priority too. Headless browsers run muted, never take focus, and are titled `zz-headless-test`. Runs end
  what they start. The landing hand-back carries the output of `node consonance/tools/leftovers.js`, and a proxy count it cannot
  vouch for reads UNCALIBRATED, never 0.

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
