# The desktop's first launch — the whole round trip, in order, at 8am

**Pane B, 2026-09-09 ~07:00. Packet `loop/packet_desktop_runbook_2026-09-09.md` (75c698a).**

> ## READ THIS PARAGRAPH FIRST
>
> **Nothing in this document has ever been run on a second machine.** Every command below was read
> out of the source or run on the laptop; not one of them has been run on the desktop, because the
> desktop is not reachable from here. Where a step's outcome depends on what the desktop actually
> has on disk, the step says **UNVERIFIED** and names what to check instead of asserting what will
> happen. §10 lists every one of them in one place — **that list is what to watch hardest.**
>
> **Nothing here can lock you out.** The launcher was built with that as a rule: none of its five
> verdicts refuses to start (`sync_launch.rs`, *"THE RULING ON REFUSING TO START … the answer is
> NO"*). The worst outcome in this document is a launch that opens the wrong house, and every one
> of those is named below with the command that undoes it.
>
> **You do not have to finish.** §9 says exactly what each stopping point leaves behind. Only one
> of them costs anything, and it is named.

---

## 0 · THE TWO STEPS THAT KILL IT SILENTLY

Both are ordinary-looking. Both fail by **looking like a normal, successful launch.** They are
steps 1 and 4 below and they are repeated here because they are the two worth reading twice.

### ① `machine_tag` must not be `L`

If this desktop still calls itself `L`, the launcher compares the record's author (`L`) against
this machine (`L`), decides **the record is its own**, installs nothing, and posts

    sync at launch — RESUME: the record's head was authored by this machine (L), so nothing was
    installed and nothing needed to be. The seats here ARE the synced seats.

That is a **true sentence about a false premise.** The seats then wake from *this desktop's own old
transcripts* — the lineage that was supposed to be retired — with history, talking, plausible. The
retire rule never fires, because from inside there is nothing foreign to retire. **This is the one
failure in the whole document that produces no error, no red text and no missing file.**

The tell, and it is exact: **on the desktop's first launch the seam row must say `MIGRATE`. If it
says `RESUME`, stop and read which machine it names.**

### ② Look at the board's size before you launch

`state-sync.js --push` refuses any single file over GitHub's 100 MB hard limit, and the desktop's
own `board.jsonl` may be very large — the laptop's was **322.9 MB** before last night's compaction.

**Honest correction to the plan on this point, because you should not act on a reason that is
wrong.** The plan says a 300 MB board *"is refused at the first push and stops the sync dead."* On
the *successful* path it does not: the launcher's install overwrites `board.jsonl` with the
laptop's compacted 45 MB one and puts yours in `attic\pre-sync-<stamp>\`, which is classed STAYS
and never travels (`consonance/state-manifest.json:91`). So on the happy path the size is moot.

**It bites on the unhappy path,** which is exactly the path you cannot tell you are on in advance:
if the pull does not install for any reason (no network, no clone, `gh` not logged in, wrong repo
path), your 300 MB board is still the file the close-push tries to carry, and the push refuses.

So the step stays — but as a **look first, act only if needed**: the dry run below writes nothing
and takes about a second. It answers itself.

---

---

## 0.5 · WHAT CHANGED AFTER THIS WAS WRITTEN — chair, 07:58, four stale facts

**B wrote this at 07:00. Four numbers in it have moved since, all in expected-output lines. B's
prose and the failure table are unchanged and still right — only these four.**

| section | it says | it is now |
|---|---|---|
| §3 step 2 | pull to `75c698a` or later | HEAD is **`3fee80c`**. `75c698a` is still the correct *minimum*; anything at or past it has the sync code. |
| §4 step 3 | `--verify` prints `pushed by L at 2026-09-09T12:17:10.533Z` | **`2026-09-09T13:54:33.666Z`**, 47 files. The word to read is still **`pushed by L`** — if it says `D`, stop. |
| §7 step 6 | `in sync? L faf86d4` | **`in sync? L a4cb9fe`**. Same question mark, same meaning. |
| §8 step 7 | `close.js` UNVERIFIED, may not exist | **It exists and it has been run.** A shipped it; the chair ran a real close at 13:54:33Z and it returned `CLOSED`. **Use `close.js`, not the raw `--push`.** It refuses to say closed over an unpushed or torn state, which the raw push does not. |

**One thing `close.js` does NOT catch, from A's own hand-back:** `state-sync --push` returns
`NOTHING_CHANGED` and **exits 0 over a remote that is BEHIND**. So a suspiciously clean close is that
hole, not proof. On the desktop this should not bite — you will be pushing new state, not nothing.

**§11 item 7 is closed** (close.js exists). **Items 1–6, 8 and 9 all still stand**, and item 5 is
the one that matters: **the `MIGRATE` arm has still never executed anywhere in the world.** Your
step 5 is its first run.


## 1 · PRE-FLIGHT — five things, one minute, before anything changes

Open **PowerShell** (not cmd). Paste this whole block:

```powershell
git --version
node --version
& "$env:USERPROFILE\.cargo\bin\cargo.exe" --version
gh auth status
Test-Path C:\Consonance\lighthouse\exo_memory\BOOT.md
```

**What you should see:** a version number from each of the first three; `gh auth status` saying
**"Logged in to github.com"**; and `True`.

| if this one is wrong | what it costs | what to do |
|---|---|---|
| `git` missing | nothing works | install git; stop here |
| `node` missing | the launcher's pull cannot run at all → **LOCAL HOUSE** every time | install node; stop here |
| `cargo` missing | you cannot rebuild; you would run an old exe with no sync in it | install Rust + `cargo install tauri-cli`; stop here |
| `gh` not logged in | **the close-push in step 7 will refuse** — it verifies the remote is private and fails closed | `gh auth login` |
| `Test-Path` → `False` | the repo is somewhere else on this machine | find it (`Get-ChildItem C:\ -Filter BOOT.md -Recurse -Depth 4`) and substitute that path everywhere below |

Then, the single most useful command in this document — it asks the tools' **own** resolvers who
this machine is and where it keeps things, rather than assuming:

```powershell
node -e "const s=require('C:/Consonance/lighthouse/consonance/tools/state-sync.js'); console.log('machine  :', s.machineTag()); console.log('state_dir:', s.stateDir()); console.log('data_dir :', s.dataDir());"
```

**On the laptop this prints** (run, 06:50):

    machine  : L
    state_dir: C:\Consonance\state
    data_dir : C:\Consonance\data

**On the desktop, before step 2, it will print something else** — that is fine and expected. What
matters is what it prints *after* step 2. **UNVERIFIED:** I cannot see the desktop's
`~\.consonance.json`, so I do not know what `data_dir` it will name. If `data_dir` is **not**
`C:\Consonance\data`, that is not automatically wrong — but write it down, because every path in
this document that says `C:\Consonance\data` means *whatever that command printed*.

---

## 2 · STEP 1 — say who this machine is  ⚠ **DANGEROUS #1**

Two ways, and **do both**, because they are two rungs of the same cascade and the belt-and-braces
costs nothing. The environment variable is read **first** by both the JS tool
(`state-sync.js:140`, `machineTag`) and the Rust launcher (`main.rs`’s `machine_identity`), so it wins
regardless of what the config file says.

```powershell
[Environment]::SetEnvironmentVariable('CONSONANCE_MACHINE','D','User')
$env:CONSONANCE_MACHINE = 'D'
```

Then the config file, so the tag survives even if the variable is ever cleared:

```powershell
$p = "$env:USERPROFILE\.consonance.json"
if (Test-Path $p) {
  $c = Get-Content $p -Raw | ConvertFrom-Json
  $c | Add-Member -NotePropertyName machine_tag -NotePropertyValue 'D' -Force
  $c | ConvertTo-Json -Depth 10 | Set-Content $p -Encoding utf8
  Write-Host "machine_tag set to D"
} else {
  Write-Host "NO ~/.consonance.json ON THIS MACHINE -- see the note below"
}
```

*(`Set-Content -Encoding utf8` writes a byte-order mark on PowerShell 5.1. That is safe: both
readers strip it — `state-sync.js:157` and `main.rs`’s `machine_identity`.)*

**VERIFY, and do not go on until it prints `D`:**

```powershell
node -e "console.log(require('C:/Consonance/lighthouse/consonance/tools/state-sync.js').machineTag())"
```

    D

**If it printed `L`:** the config still says `L` and the env var did not take. Close this
PowerShell window, open a new one, and run the verify again — `SetEnvironmentVariable(...,'User')`
only reaches processes started *after* it.

**If it printed a hostname** (something like `DESKTOP-4K2J1`): that is what happens when nothing
sets the tag, and it is **not a disaster** — a hostname is still ≠ `L`, so the launcher will still
read the record as foreign and migrate correctly. But set `D` anyway: the tag is written into the
state repo at every push and a hostname that changes later breaks adoption silently.

**If `~/.consonance.json` does not exist at all:** the app writes it at launch. Set only the
environment variable now, run steps 2–4, launch, close the app, then re-run the config block. The
env var alone is sufficient for the first launch — it is first in both cascades.

---

## 3 · STEP 2 — pull the record repo and **build, do not launch**

```powershell
git -C C:\Consonance\lighthouse pull
git -C C:\Consonance\lighthouse log --oneline -1
```

**What you should see:** a commit at **`75c698a`** or later. That commit is where the sync landed;
anything older has no sync code in it at all and step 5 will do nothing.

Now build. **Build only — do not use `launch.ps1` yet**, and this is a real trap: `launch.ps1`
rebuilds *and then launches*, and a launch before step 3 runs the sync against a state repo that
does not exist yet, gets **LOCAL HOUSE**, and wakes this desktop's own seats. Recoverable, but it
wastes the first launch, which is the one that carries the migration.

```powershell
& "$env:USERPROFILE\.cargo\bin\cargo.exe" build --release --manifest-path C:\Consonance\lighthouse\consonance\src-tauri\Cargo.toml
```

**What you should see:** `Compiling …` for several minutes, ending in
`Finished \`release\` profile [optimized] target(s) in …`.

**This is the long step.** On a machine that has never built this repo it is a full cold build —
**UNVERIFIED how long on your desktop; expect tens of minutes, not seconds.** Go make coffee. If it
ends in `error[E…]` instead, that is a genuine build failure and there is nothing in this document
that routes around it; save the error text and stop — the sync is not urgent, and a wrong exe is
worse than no exe.

---

## 4 · STEP 3 — clone the state repo

```powershell
git clone https://github.com/solariz3d/consonance-state.git C:\Consonance\state
```

**What you should see:** a clone of roughly **21 MB** (it is small; the working tree it checks out
is ~59 MB). If it asks for credentials, that is the private repo — `gh auth login` first.

**Verify it arrived whole, no network, no writes:**

```powershell
node C:\Consonance\lighthouse\consonance\tools\state-sync.js --verify
```

**On the laptop this prints** (run, 06:52):

    state-sync --verify · C:\Consonance\state
      index: 47 files, 60726688 bytes, pushed by L at 2026-09-09T12:17:10.533Z
      COMPLETE — 47 of 47 files present, right length, right bytes.

**`pushed by L` is the thing to read.** That is the laptop's record, sitting in the checkout, not
yet in the data dir. If it says `pushed by D`, the tag from step 1 leaked into a push somewhere and
the whole migration will read as self — stop and say so.

If it says anything other than `COMPLETE`, do not launch. The clone is incomplete; delete
`C:\Consonance\state` and clone again.

---

## 5 · STEP 4 — look at this desktop's board  ⚠ **DANGEROUS #2**

**Look first.** This writes nothing:

```powershell
node C:\Consonance\lighthouse\consonance\tools\board-compact.js
```

**On the laptop this prints** (run, 06:57 — already compacted last night, hence 0 removed):

    board     C:\Consonance\data\board.jsonl
    rule      byte-identical-repeat — first copy kept, file order preserved
    before    29909 rows  44.9 MB
    after     29909 rows  44.9 MB
    removed   0 rows  0.0 MB  (0.0%)
    DRY RUN — nothing was written. Re-run with --apply to attic the original and swap the board in.

**On the desktop the `before` line is the number that matters.**

| `before` says | do this |
|---|---|
| under ~100 MB | **skip the compaction.** Go to step 5. Nothing here needs doing. |
| over 100 MB | run the `--apply` below |

```powershell
node C:\Consonance\lighthouse\consonance\tools\board-compact.js --apply
```

**What you should see:** the same before/after/removed lines, then

    attic     C:\Consonance\data\attic\board.jsonl.2026-09-09  <size>  (STAYS — the record, untouched)
    board     C:\Consonance\data\board.jsonl  <smaller size>
    VERIFIED — <the losslessness check>

**It is reversible and the tool says how.** Your original board is whole at the `attic` path
printed. To undo: move that file back over `board.jsonl`. The tool refuses outright rather than
overwrite an attic file that already exists.

*Timing, measured: the laptop's 45 MB board took **0.36 s**. A 300 MB board is a few seconds. The
dry run writes a scratch file the size of the compacted board beside the board and then deletes it,
so leave that much free disk.*

---

## 6 · STEP 5 — launch, and read one line

```powershell
powershell -ExecutionPolicy Bypass -File C:\Consonance\lighthouse\consonance\launch.ps1
```

The app opens. **Then read the seam row.** It is posted for every launch, including the boring
ones, deliberately — so its *absence* means something (see the failure table).

```powershell
Select-String -Path C:\Consonance\data\board.jsonl -Pattern 'sync at launch' | Select-Object -Last 1
```

**What you want to see** — the wording is from `sync_launch.rs:352` and `:423`, not paraphrased:

    sync at launch — MIGRATE: the record's head was authored by L, not by this machine (D). This
    machine's transcripts for the fixed-id seats are a different lineage and would resume as that
    machine's past — retiring them and waking each seat from the synced tail. RETIRED 3
    transcript(s), 0 seat(s) had none here; main -> C:\Users\<you>\.claude\consonance-attic\...

**The three things to check in that one line, in order:**

1. the tag is **`MIGRATE`** — not `RESUME`, not `LOCAL HOUSE`, not `STANDALONE`
2. it names **`authored by L`** and **`this machine (D)`** — two different names
3. it says **`RETIRED n transcript(s)`** and names where each went

`RETIRED 0 … 3 seat(s) had none here` is **fine** — it means this desktop has never run those three
seats and there was nothing to retire. That is a different fact from a retire that failed, and the
row keeps them apart on purpose.

**The richer diagnostic, if anything above looks wrong:**

```powershell
Get-Content C:\Consonance\data\sync-completion.json
```

Six fields decide everything: `verified`, `installed`, `stage`, `why`, `pushed_by`, `machine`. The
sentence to hold: **`pushed_by` is who wrote the record; `machine` is who this is.** If those two
are equal on the desktop's first launch, that is failure ① from §0.

And the raw log of the pull itself, which is where a network or git error lands verbatim:

```powershell
Get-Content C:\Consonance\data\sync-pull.log -Tail 40
```

**What the migration does to this machine, said plainly because no step above says it:** the
install **overwrites** the desktop's `board.jsonl`, capture tails, and ledgers with the laptop's,
and puts every file it displaced in `C:\Consonance\data\attic\pre-sync-<stamp>\`. The three
fixed-id transcripts move to `~\.claude\consonance-attic\`. **Nothing is deleted.** But this
desktop's own past is now in two attics rather than in the live house, and that is the point of the
exercise, not a side effect.

---

## 7 · STEP 6 — the in-sync line, and what it will *actually* say

```powershell
node C:\Consonance\lighthouse\consonance\tools\chain-status.js
```

**The plan says this prints two hashes. On the desktop, at this point, it will not — and that is
correct, not a failure.** The line reads one commit per machine out of `machines/<tag>.json` in the
state tree (`state-sync.js:337`, `machineHeads`), and only `machines/L.json` exists so far. **`machines/D.json` is
created by the desktop's first push, which is step 7.**

**What you should see now:**

    … · in sync? L faf86d4 as of <n>m ago · …

Note the **question mark**: it is printed precisely when only one machine has ever pushed.

**What you should see after step 7:**

    … · in sync D <sha> · L faf86d4 as of <n>m ago · …

No question mark, both machines named. **That, not the launch, is the moment the round trip is
closed.**

---

## 8 · STEP 7 — the close push, before you shut the lid

**UNVERIFIED, and this is the one piece that may have changed under me.** Pane A was building
`P-CLOSE-PUSH` while I wrote this. If `consonance/tools/close.js` exists when you get there, prefer
it — it does the push *and* refuses to say "closed" if the push did not land:

```powershell
node C:\Consonance\lighthouse\consonance\tools\close.js
```

**If that file does not exist** (it did not at 07:00), the underlying command does exist and is
what `close.js` wraps:

```powershell
node C:\Consonance\lighthouse\consonance\tools\state-sync.js --push
```

**What you should see:**

    state-sync --push · D · committed <sha> · <n> path(s) · <size> MB
      privacy verified here: solariz3d/consonance-state gh: visibility=PRIVATE
      pushed to origin/main
      in sync: L faf86d4 · D <sha>

**Close the app first if you can.** The push refuses — loudly, by design — when a capture tail is
being rewritten underneath it, and says which paths would not come back stable. That refusal is the
tool working, not breaking; close the app and run it again.

**If it says `REFUSING TO PUSH: could not confirm … is private`:** that is `gh` not installed or not
logged in. **The commit is already made and is safe locally.** Run `gh auth login`, then re-run
`--push`. Nothing is lost by waiting.

---

## 9 · IF YOU STOP HALFWAY

Read the row for the last step you finished.

| you stopped after | what is left behind | safe to walk away? |
|---|---|---|
| **step 1** (machine_tag) | one env var and one config key | **yes** — nothing else changed |
| **step 2** (pull + build) | a newer exe that has never run | **yes** — a built binary that is not launched does nothing |
| **step 3** (clone) | `C:\Consonance\state` on disk, read by nothing until a launch | **yes** |
| **step 4** (`--apply`) | a smaller board; the original whole at `C:\Consonance\data\attic\board.jsonl.<date>` | **yes** — and reversible: move the attic file back over `board.jsonl` |
| **step 5** (launched, MIGRATE, then closed the app) | the laptop's record is now this desktop's live house; the desktop's own board/tails at `attic\pre-sync-<stamp>\`; three transcripts at `~\.claude\consonance-attic\` | **yes.** Nothing pushed, so **the laptop is untouched.** A later relaunch is a plain `RESUME` — the head is already adopted and the seats are not retired twice. |
| **step 6** (read chain-status) | same as above | **yes** |
| **step 7 not run** | the desktop's work exists **only on the desktop** | **yes, but the round trip is open** — see below |

**The one that costs something, stated plainly:** if you work on the desktop and never push, then
open the laptop and work there too, **both machines append to the same ledgers from the same
ancestor.** The next pull is then not a fast-forward and the tool refuses rather than invent a
merge:

    NOT A FAST-FORWARD — this machine has state the remote does not, or the histories diverged

That refusal is correct and wants a person, not a command. **Nothing is lost** — both records are
on their own disks — but untangling them is hand work. **So: if you did step 5, do step 7 before
you work on the laptop again.** If you cannot, that is fine — just do not open the laptop and work
in it until you have.

**The other one, and it is not covered by any guard that is wired:** do not leave both machines
running Consonance at the same time. The single-live-host lease exists as a design and a tool
(pane E) but **is not enforced in this build**; the only thing keeping one house is that the laptop
will be closed.

---

## 10 · THE FAILURE TABLE

The seam row's tag is the entry point for every row here. There are **five** verdicts and no
others — read from `sync_launch.rs:171-185`, not invented: `STANDALONE`, `RESUME`, `MIGRATE`,
`LOCAL HOUSE`, `READ-ONLY`. **None of them refuses to start the app.**

| WHAT YOU SEE | WHAT IT MEANS | WHAT YOU TYPE |
|---|---|---|
| `sync at launch — MIGRATE: the record's head was authored by L, not by this machine (D)` | **This is the success row.** The record arrived, the desktop's own transcripts were retired, the seats wake from the synced tails. | nothing — go to step 6 |
| `sync at launch — RESUME: the record's head was authored by this machine (L)` — **naming `L` on the desktop** | **Failure ①.** The machine tags collide: this desktop is calling itself `L`, so the laptop's record read as its own. Nothing installed; the seats are about to wake as *this machine's* past. | close the app. Redo §2 until the verify prints `D`. Relaunch. **Nothing needs deleting** — the launcher asks *who authored the record* before it asks *have I adopted this head*, so a corrected tag migrates on the very next launch. |
| `sync at launch — LOCAL HOUSE: …` (any wording) | **The pull did not arrive** and the app started as this desktop's own house. Divergence starts here — it is an append-merge, not a loss, but it is real. The row's own text names which of the five causes it was. | `Get-Content C:\Consonance\data\sync-pull.log -Tail 40` — the git or node error is in there verbatim. Fix it, close the app, relaunch. Common causes: no network; `C:\Consonance\state` not cloned (step 3); `node` not on PATH. |
| `sync at launch — LOCAL HOUSE: the pull VERIFIED BUT DID NOT INSTALL` | A narrower case worth its own row: the record **is** in `C:\Consonance\state` and never reached `C:\Consonance\data`. The house you are looking at is the desktop's. | close the app, then `node C:\Consonance\lighthouse\consonance\tools\state-sync.js --pull --install`, then relaunch |
| `sync at launch — STANDALONE: state-sync.js is not on disk` | **The silent one.** The launcher never found the sync tool, so *no sync was attempted at all* and the app opened exactly as it always has. It looks like a completely normal launch. Almost always: the repo path in `~\.consonance.json` (`room_path`) does not point at `<repo>\exo_memory\BOOT.md`, so the app cannot find its own checkout. | `node -e "const s=require('C:/Consonance/lighthouse/consonance/tools/state-sync.js'); console.log(s.stateDir(), s.dataDir())"` and check `room_path` in `~\.consonance.json` resolves to the repo. Also confirm the build is at `75c698a` or later (step 2). |
| `; RETIRE FAILED for main (…) — that seat will resume THIS machine's transcript` | Windows held a handle on the transcript file, so it could not be moved aside. **That named seat, and only that one, will wake as this desktop's past.** | close the app completely, then relaunch. If it repeats, move the file by hand: it is `~\.claude\projects\<encoded-cwd>\<session-id>.jsonl`, and the row names it. |
| `sync at launch — READ-ONLY: …` | The window opened and **no seat was woken** — the data dir may be half-written. This is the deliberate safe state, not a crash. | `node C:\Consonance\lighthouse\consonance\tools\state-sync.js --pull --install`, then relaunch. The row itself names the alternative (delete the journal file to declare the dir sound). |
| **No `sync at launch` row at all** | The build predates the sync. `Select-String` found nothing because the code that writes the row is not in the running exe. | `git -C C:\Consonance\lighthouse log --oneline -1` — if it is behind `75c698a`, redo step 2. If it is at or past it, the exe is older than the source: rebuild. |
| `REFUSING TO PUSH: could not confirm … is private` (step 7) | `gh` is missing or not logged in. The privacy check fails closed on purpose. **The commit is made and safe locally.** | `gh auth login`, then re-run `--push` |
| `NOT A FAST-FORWARD` (any pull) | Both machines appended from the same ancestor. The tool will not invent a merge. | stop. Nothing is lost. This one wants a person, not a command — leave both records where they are. |

---

## 11 · WHAT I COULD NOT TEST FROM HERE — watch these hardest

Every item is something I read rather than ran, or could not read at all.

1. **Every command in this document, on the desktop.** All of them were run on the laptop or read
   from source. The desktop is not reachable from this seat.
2. **The desktop's `~\.consonance.json` — I have never seen it.** Its `data_dir`, `room_path`,
   `instances_dir` and `machine_tag` are all unknown to me. Steps 1 and the pre-flight probe exist
   because of this.
3. **`panes.json` carries absolute `cwd` paths** (`C:\Consonance\instances\…`). The manifest flags
   this as its own unverified precondition (`state-manifest.json`, the `panes.json` rule): it
   travels correctly **only if both machines resolve the same `instances_dir`.** If the desktop's
   differs, the roster arrives pointing at directories that are not there. **Nobody has checked
   this.** Check `instances_dir` in the pre-flight output before you launch.
4. **The build time and whether it builds at all** on a machine that has never compiled this tree.
5. **The `MIGRATE` arm has never executed anywhere.** The laptop cannot reach it — the launcher's
   two-phase design means the machine that authored the record always takes `RESUME` — so step 5 is
   the first execution of that code path in the world.
6. **`READ-ONLY` appears to be unreachable in this build, and I am reporting it rather than
   quietly leaving it out of the table.** Its first trigger reads a journal file
   `sync-promotion.open`, and **nothing in the shipped code writes it**:
   `grep -rn "sync-promotion|PROMOTION_JOURNAL" consonance/` returns five hits, all inside
   `sync_launch.rs` — the constant, a doc comment, the message, the reader at `:570`, and one
   **test** fixture at `:968`. The test is the only writer. Its second trigger needs
   `installTree` to return a non-zero code, and `installTree` has no error path — it throws
   instead, which exits non-zero and lands as `LOCAL HOUSE`. **Consequence for you:** an install
   that dies part-way through will most likely present as **LOCAL HOUSE with a half-written data
   dir**, not as READ-ONLY. The fix is the same either way — `--pull --install` again — but the row
   you see will be the LOCAL HOUSE one. It is in the table above for that reason.
7. **The close command.** `close.js` did not exist when this was written; step 7 gives the
   underlying `--push` that does.
8. **The push from the desktop has never run**, so `machines/D.json` has never been created and the
   two-machine form of the in-sync line has never been printed by anything.
9. **Whether the app's own board view renders the seam row legibly.** I gave you the file-read
   command instead, because that one I could check.

---

*Written from `two_machines_lap_plan_2026-09-09.md` §5, `sync_launch.rs`, `main.rs` (`sync_at_launch`, `run_state_pull`, `machine_identity`),
`state-sync.js`, `state-manifest.json` and `board-compact.js`. Every expected output above is
either quoted from the source that formats it, or was produced by running the command on the
laptop at the time noted beside it.*

*Its own falsifier, from the packet: a step at 08:00 whose result you cannot interpret from this
document. If one happens, the row that should have covered it is the finding.*

## 0.6 · CORRECTION FROM THE DESKTOP, 08:52 — step 1's config block breaks the launch

**The parenthetical under §2 is wrong:** `Set-Content -Encoding utf8` writes a BOM on PowerShell 5.1,
and `parse_config` (`main.rs:98`) does NOT strip it. The two readers named there do; the one that
places the house does not. Result on the desktop's first click: `CONFIG PROBLEM … not valid JSON`,
every path fell to built-in defaults, and the launch was `STANDALONE` in `~/.consonance` with no seam
row on the real board. Details: `loop/wake_chair_2026-09-09.md`, the desktop chair's section.

**Until `parse_config` strips the BOM, write the file without one:**

```powershell
[IO.File]::WriteAllText($p, ($c | ConvertTo-Json -Depth 10), (New-Object Text.UTF8Encoding $false))
```

and verify with `Get-Content $p -Encoding Byte -TotalCount 1` → `123` (`{`), not `239`.

## 0.7 · CORRECTION FROM THE DESKTOP, 09:20 — the seats are in the wrong house and the runbook's own guard could not see it

**Appended by B (P-DESKTOP-TABLE, lap D055) scoring this document against its first real run.
Nothing above is edited. §0.6 stands.**

**THE RUNBOOK'S REGISTERED FALSIFIER FIRED.** The closing line asks for *"a step at 08:00 whose
result you cannot interpret from this document."* Step 5 produced one. The seam row said **MIGRATE**
— §10's success row, the one that says *go to step 6* — and the seats woke in the wrong directory
anyway. **No row in the failure table covers a successful MIGRATE with broken seating**, because
every row is keyed off the seam verdict and the seam verdict was correct.

### §11 item 3 was the right hazard, named on the wrong variable

Item 3 (and `state-manifest.json:21`, same sentence) says `panes.json` *"travels correctly only if
both machines resolve the same `instances_dir`."* **Both machines resolve the same `instances_dir`
— `C:\Consonance\instances` — and it still did not travel correctly.** The prescribed check
("Check `instances_dir` in the pre-flight output before you launch") compares two equal values,
passes, and misses this entirely.

The real precondition is not that the two machines agree on the root. It is that **the cwds
`panes.json` names EXIST on the destination** — and they cannot be made to, because the manifest's
`root` is `data_dir` (`state-manifest.json:5`) and instance directories live outside it. Nothing in
the manifest carries or creates them. `panes.json` is the only TRAVELS file that points outside its
own transported tree, and the thing it points at is classified nowhere.

Measured here: all four cwds in `panes.json` are absent (`ls C:\Consonance\instances` — no
`sibling-3d57124e`, `-5bf9d657`, `-0845a868`, `-07b8a48f`).

### Where the seats actually went, and why nothing said so

**`C:\Users\nname`** — the value of `%USERPROFILE%`. All four, measured from each transcript's own
`cwd` field and from the project slug that holds them (`C--Users-nname`).

    main.rs:954                cmd.cwd(&cwd)               <- the panes.json path, handed over
    cmdbuilder.rs:566          .filter(|path| Path::new(path).is_dir())   <- NOT a dir -> None
    cmdbuilder.rs:567          let dir = cwd.or(home);     <- home = %USERPROFILE%

(`portable-pty-0.8.1`, pinned in `Cargo.lock:2540`.) A cwd that does not exist is **silently
dropped and replaced by the home directory.** `CreateProcessW` is then handed a valid directory, so
the error path at `psuedocon.rs:151` never fires. There is no error, no log line, and no failed
launch. This is the same shape as §0's two silent killers and it deserves a third entry beside them.

### What it costs — already paid, and the log records it as something benign

The Rust side keeps using the *string* from `panes.json`, so everything that only tests the string
still works. `role_for_kept` (`main.rs:2530`) and `is_managed_cwd` (`:3677`) are pure prefix tests;
both return committee/managed for a path that is not there. **That is why `chair_inject` still
reaches A and C** — the roster is a string and the string is fine.

But the brief write is not a string test:

    main.rs:5210  warm_resume_brief   passes is_managed_cwd, reads the installed capture,
                                      assembles the full brief, logs MAP CARRY
    main.rs:5379  fs::write(PathBuf::from(cwd).join("CLAUDE.md"), brief).is_ok()

`fs::write` does not create parent directories. The directory does not exist. The write fails, and
**that boolean is the `warmed=` field in the resume line.** `data/persist.log` lines 316–326:

    MAP CARRY pane=12fb81f6-… master=125293 reserve=8000 allowance=8684 carried=7113 tier=newest
    resume    pane=12fb81f6-… warmed=false jsonl_existed=false -> fresh

Four times. **The map was built and thrown away, and `warmed=false` reads exactly like "no capture
to warm from."** Each seat woke in `C:\Users\nname`, which has no `CLAUDE.md` at all — only the
global `~\.claude\CLAUDE.md`, 7,574 bytes. A correctly seated pane carries 123,162
(`instances\sibling-181f513d\CLAUDE.md`). **Not a different map. No map.**

### The check that would have caught it, for the next machine

Add to §1 pre-flight, after the resolver probe, and again after step 5:

```powershell
# every cwd the roster names must EXIST, or the pane silently lands in %USERPROFILE%
(Get-Content C:\Consonance\data\panes.json -Raw | ConvertFrom-Json) |
  ForEach-Object { "{0}  {1}" -f (Test-Path $_.cwd), $_.cwd }
```

Every line must start `True`. And after the launch, the one that is not fooled by a string:

```powershell
Select-String -Path C:\Consonance\data\persist.log -Pattern 'warmed=false' | Select-Object -Last 6
```

**`warmed=false` on a seat that had a capture installed is the tell**, and it is the tell for this
whole class — a brief that was assembled and could not be written.

### Also true on this machine, and it makes §1 wrong as literally written

The repo is at **`C:\Users\nname\Desktop\lighthouse`**, not `C:\Consonance\lighthouse`. §1's
`Test-Path` prints `False` and its own table catches that ("find it and substitute it everywhere
below") — so the document handled it. Recording the actual value because every command above that
hardcodes `C:/Consonance/lighthouse` needs it, and because a second stale checkout **does** sit at
`C:\Users\nname\lighthouse` (Stage-6 era). Two checkouts and two data roots is what made the 08:45
misfire possible at all.
