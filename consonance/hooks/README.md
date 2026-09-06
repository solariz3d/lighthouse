# consonance/hooks — hooks that arrive, instead of waiting to be asked

These are Claude Code **hooks**: small Node programs the harness runs at fixed moments in a session
— when it starts, when you submit a prompt, when an assistant turn ends, before a compaction, before
a tool call. Each one puts a fact in front of the model *at the moment the fact matters*, then gets
out of the way.

They exist because of one design argument, and it is the only claim in this file that is not
checkable by running something:

> A store the reader has to *decide* to visit is a store nobody visits. If a fact only reaches the
> model when the model thinks to go and look for it, it does not reach the model. **Stop offering,
> start arriving.**

Everything below follows from that. A hook here is silent when it has nothing to say, states facts
and never verdicts, never blocks a turn, and always exits 0.

---

## The roster

Thirteen non-test `.js` files live here. Each line quotes that file's **own header**, so the
description cannot drift from the code without someone editing the code:

| file | what it is |
|---|---|
| `ask-surface.js` | *"UserPromptSubmit hook — surface the questions the automations put to the keeper."* |
| `baton-wake-stop.js` | *"Stop hook: the outgoing seat is caught at the one moment it can still speak."* |
| `blind.js` | *"the blind window, as a FILE, global, fail-closed."* — a **library**, not a hook |
| `board-digest.js` | *"UserPromptSubmit hook — the ambient board."* |
| `carrier-drift-watch.js` | *"fire `consonance/tools/carrier-drift.js` unbidden, and say nothing unless something is actually wrong."* |
| `dispatch-gate.js` | *"ASK before a dispatch that carries no citation."* |
| `dream-watch.js` | *"UserPromptSubmit hook. One line when the dream cycle has stopped dreaming; silent when it hasn't."* |
| `ferry-watch.js` | *"surface a FRESH un-ferried artifact, and nothing else."* |
| `findings-return.js` | *"surfaces unread, audited DISAGREEs from the findings ledger to the ORIGINATING pane at its next real user turn. Surfaces, never hauls."* |
| `precompact-preserve.js` | *"shape what a compaction summary keeps."* |
| `sessionstart-state.js` | *"put the room's current state in front of an instance that just lost it."* |
| `sourced-stop.js` | *"a Stop-hook SENSOR: one ledger row per turn, no gate, no output."* |
| `transcript-watch.js` | *"UserPromptSubmit hook, Main session only."* |

Every one also has a `.test.js` beside it or is covered by `dream-gate.test.js`; run them with
`node <file>.test.js`.

---

## Installing them

**Do not copy files by hand and do not edit `settings.json` yourself.** One script owns both halves:

```
pwsh dev/shell/install.ps1              # sync the files, then register them
pwsh dev/shell/install.ps1 -Check       # report drift only, change nothing
pwsh dev/shell/install.ps1 -NoRegister  # files only; print the settings block instead of writing it
```

It is idempotent — safe to re-run after every pull — and it prints exactly what it changed.

Two facts about it are worth knowing before you run it, because they are the reason it exists:

- **It copies into your hook directory and registers the COPY**, never the file in the repo. A hook
  registered at a repo path changes underneath a running session the moment you pull.
- **Copying and registering are two states, not one.** A file that is installed but unregistered
  never fires, and reads exactly like a working hook. `-Check` reports the two separately.

### What the installer copies and registers

This is a property of `install.ps1`, not of anyone's machine, so read it out of the script rather
than out of a table someone typed. Save this as `derive.ps1` at the repo root and run it:

```powershell
$t=$null; $e=$null
$ast = [System.Management.Automation.Language.Parser]::ParseFile(
         (Resolve-Path 'dev/shell/install.ps1'), [ref]$t, [ref]$e)
function Rows($name) {
  $a = $ast.Find({ param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] `
                   -and $n.Left.Extent.Text -eq ('$' + $name) }, $true)
  $a.Right.FindAll({ param($n) $n -is [System.Management.Automation.Language.HashtableAst] }, $true) |
    ForEach-Object {
      $h = @{}
      foreach ($kv in $_.KeyValuePairs) { $h[$kv.Item1.Extent.Text] = $kv.Item2.Extent.Text.Trim("'") }
      New-Object psobject -Property $h
    }
}
$files = Rows files
$reg   = Rows register
"files          {0}   (dev\shell {1}, consonance\hooks {2}, declared libraries {3}, held {4})" -f $files.Count,
  @($files | Where-Object { $_.From -like 'dev\shell\*' }).Count,
  @($files | Where-Object { $_.From -like 'consonance\hooks\*' }).Count,
  @($files | Where-Object { $_.PSObject.Properties.Name -contains 'Lib' }).Count,
  @($files | Where-Object { $_.PSObject.Properties.Name -contains 'Hold' }).Count
"registrations  {0}   events: {1}" -f $reg.Count, ((@($reg.Event) | Select-Object -Unique) -join ', ')
$reg | ForEach-Object { "  {0,-16} {1}" -f $_.Event, $_.Rel }
```

Against the script as it stands, that prints:

```
files          24   (dev\shell 13, consonance\hooks 11, declared libraries 5, held 1)
registrations  13   events: SessionStart, UserPromptSubmit, Stop, SessionEnd, PreCompact, PreToolUse
```

**If it disagrees with those numbers, the command is right and this paragraph is stale.** It parses
the script's syntax tree rather than grepping its text, which matters: a per-entry flag can sit on a
line of its own, and a line-based reader silently misses it.

Three states a file in this directory can be in, and all three are normal:

| state | meaning |
|---|---|
| copied **and** registered | the installer both places it and wires it to an event |
| copied, **not** registered | the installer places it; something else fires it, or nobody has wired it yet |
| **not in the installer's list** | present here, installed by nothing — a hook you must wire yourself, or one that is not finished |

As the script stands, `ask-surface.js` and `baton-wake-stop.js` are in the third state, and
`blind.js` is a library — copied because another hook requires it, never registered. Do not trust
that sentence either: the `$files` and `$reg` lists the command above prints are what decide it, and
`install.ps1 -Check` reports the state of every managed file on the machine you run it on.

### Checking your own machine

The installer's list says what *should* be wired. To see what *is*, read your own settings file —
this prints your state, not anyone else's:

```
node -e "const j=JSON.parse(require('fs').readFileSync(
  (process.env.USERPROFILE||process.env.HOME)+'/.claude/settings.json','utf8'));
for (const e of Object.keys(j.hooks||{}))
  console.log(e, JSON.stringify(j.hooks[e]).match(/[a-z0-9_-]+\.(js|py)/g));"
```

**The `0-9` in that character class is load-bearing.** Written without it the command prints
`-overseer.js` twice and silently drops the numbered hooks — a check that misreports its own output.

**A caveat that costs an hour if you meet it cold:** the settings watcher only reloads directories
that already held a settings file when the session started. A freshly registered hook may not fire
until you open `/hooks` once, or restart the session.

---

## What a hook is allowed to do

These are conventions, and they are why the layer is tolerable to work under:

- **Facts, no verdicts.** Never *"BRAVO is productive"*, never *"you should look at this."* A verdict
  makes the program the judge, which is the thing it exists not to be.
- **Silent when there is nothing to say.** A hook that speaks every turn is noise, and noise is
  filtered by the reader within a day.
- **Change since you last looked**, rather than absolute state. The failure a hook corrects is
  usually *distance to an event*, so the useful field is a subtraction from something already in
  view — not a number you have to remember to compare.
- **Never throws, never blocks, always exits 0.** A hook that can fail a turn will eventually fail a
  turn you needed.
- **Never reports the reader to itself.** Own-session entries are dropped.

`board-digest.js` is the worked example of all five. It emits roughly this, in about 60 tokens:

```
[panes] BRAVO  ≥54 exch today · last 1m · +3 since your last turn
               ↳ asked: fix the camera clipping through the floor when…
               ↳ bravo: Built — clamped the near plane and re-ran the co…
               ↳ hands: src/render/camera.js, src/render/index.html
```

Both halves are labelled by speaker because they answer different questions — *what was it asked to
do*, and *where has it got to*. `hands:` is the collision fact: which files that pane most recently
had open. It is read from the pane's own transcript rather than from the board, because a file edit
is a `tool_use` block and the board keeps text blocks — so the one fact that prevents two panes
editing the same file is precisely the one the board drops. Still facts, not instructions: these are
files it had open, not *"do not touch."*

### Counting defects any tool over this data has to correct

Not opinions — each was found by measuring a live board rather than trusting it, and each would
otherwise have shipped:

1. **Board entries are not exchanges.** A tool result is a `type:"user"` entry and a tool call a
   `type:"assistant"` entry, and an assistant turn that narrates *while* calling a tool keeps its
   text and posts. Count **user** entries.
2. **Replay bursts.** Push time is not event time, and a tailer re-reads a transcript from the top on
   resume — so a resume dumps a pane's whole history onto the board stamped "now." Drop any
   (pane, second) group over a sane threshold.
3. **Synthetic user entries.** Slash commands, their output, caveats and system reminders all arrive
   as string-content `user` entries. Prefix-filter them.

---

## The honest limit

**An instrument makes the data impossible to miss; it cannot make the model look.** This layer is the
strongest available form of unmissable — in the turn, unasked, every time — and it still will not
make a model infallible.

That is not a flaw in the design, it *is* the design: **with you, not above you.** These hooks show
and are seen; they never haul. The success criterion is not *the model stops missing things*, it is
that **a human's catch finally has something to catch it against** — ask "what has that other pane
been doing" and there is now a shared view to be wrong about.

---

## UNVERIFIED, stated rather than described confidently

Everything above is either derived from a file in this repository or is a design convention. The
following have **only ever been run on the machine that wrote them**, and nothing in this repository
proves them elsewhere:

- **Install on a machine that is not the author's.** `install.ps1` is idempotent and reports its
  changes by construction, but a first run on a fresh machine has not been observed. Run it with
  `-Check` first.
- **Python resolution.** The pulse hook is Python; the installer looks for a real interpreter under
  the local Programs directory and deliberately refuses the Microsoft Store stub. Untested against
  other Python installations.
- **Non-Windows.** Every path in the installer is Windows-shaped (`%USERPROFILE%\.claude\shell`,
  `pwsh`). No hook here has been run on macOS or Linux.
- **`transcript-watch.js` is Main-session only** and needs a capture directory to read; outside that
  setup it is silent, and its silence is indistinguishable from it not being installed.
- **Timings.** Any latency figure you find in a hook's own header was measured once, on one machine,
  on one board. Treat it as an order of magnitude.

*How this file was checked, so the claim is auditable rather than asserted.* The roster and the
installer figures were **generated** from `install.ps1`'s `$files` and `$register` arrays and from a
directory listing, never typed from memory; every hook description is a quotation from that hook's
own header. Both commands above were run and their output is what is pasted here. The figures were
then re-derived a second time by an independent parser written in Node — which is not ceremony: the
first derivation reported **3 held entries** and the second reported **1**, and 1 is correct. The
first was reading a per-entry flag off the same line as the entry's path, and one such flag sits on
its own line. A number that only one instrument has ever produced is a hand-made number.

Finally the file was read line by line for any sentence whose truth depends on one machine's
configuration, one person's identity, or one project's private history. Four passages were removed
on that pass: a table of which hooks were registered in one personal `settings.json` at a stated
local time; a block of expected command output true only on that machine; a worked example carrying a
different private project's file paths; and a dated correction that was a record of this project
rather than documentation of this directory.
