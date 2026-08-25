# Desktop first run — the runbook, and it is an experiment

*Written 2026-08-25 on the laptop, by a seat that cannot run it. For a seat on the DESKTOP with
none of that conversation in its head. Assume nothing; every claim below has a command under it.*

**What you are doing.** This repo has been developed on one machine for weeks. The desktop has
pulled **zero** commits in that time and `dev\shell\install.ps1 -Check` has **never run there**.
So the desktop is not a second copy of the laptop — it is the **first machine outside this room
that runs its instruments**. Every one of them was written, tested and read on the machine that
wrote them. Today is the first time any of them reports on a machine it did not grow up on.

That makes this a measurement, not a chore, and it is worth more than the sync. **A green here is
the first evidence any of it travels. A red here is worth more than a green anywhere else.**

Two prior desktop attempts failed with known mechanisms, both worth knowing before you start:
`journal/2026-08-18.md:1100-1185` (files copied, hooks never wired, installer reporting `ok` on
both) and `exo_memory/loop/handoff_2026-08-19.md` (the one that worked, in two minutes).

---

## 0. THE CAPTURE RULE — read this before the first command

**The record's standing failure is: laptop writes, desktop stays silent, laptop infers.**
`journal/2026-08-17.md:10-26` is the case — a whole night reasoned about desktop from six places
on the laptop, ending in the honest limit *"desktop didn't push is established; desktop didn't
work is not, and cannot be from here."* The only cure is your raw output on disk.

**So: no summaries. Redirect every command to a file and commit the files.** Do not read an output
and write down what it said. There is no transcription step in this runbook, deliberately — a
transcription step is where the summary gets in.

Every command below writes into `exo_memory\loop\desktop_run_2026-08-25\` — created once at the
top of §1, where `$OUT` is set. **Run everything from PowerShell**, not cmd; `install.ps1` needs it
and the redirects below are PowerShell. Then, when the run ends or stops:

```
git add exo_memory\loop\desktop_run_2026-08-25\
git commit -m "desktop first run — raw output"
git push
```

**Commit and push even if — especially if — things failed.** A failed run that is on disk is the
result. A failed run that is described later is the failure this rule exists to end.

**One PowerShell trap, and it will silently eat your evidence.** `install.ps1` prints through
`Write-Host`, which an in-session `| Tee-Object` does **not** capture. Run each command as a
**child process** with a plain redirect, as written below, and you get every line. Do not
substitute a pipe.

**Record the exit code of every command.** After each one:
`"EXIT=$LASTEXITCODE" | Add-Content "$OUT\<that file>"`. Several of these are *expected* to be
non-zero, and an exit code nobody wrote down is the one detail no later reader can recover.

---

## 1. THE ORDER, and why it is this order

Each step answers one question. Do not reorder; three of the dependencies are real.

**Set this once, from the repo root, and return to the repo root between steps** — step 2 changes
directory and a relative redirect written after it lands somewhere you will not find:

```
cd <your clone of this repo>
$OUT = "$PWD\exo_memory\loop\desktop_run_2026-08-25"
mkdir $OUT
```

**1 · `git pull` → `01-pull.txt`**
```
git status --porcelain > "$OUT\01-pull.txt" 2>&1     # the BEFORE state — see §6 if dirty
git pull              >> "$OUT\01-pull.txt" 2>&1
```
Brings documents *and* Rust source. Nothing below means anything until the tree matches.
*Answers:* what did this machine not have? The `status` line first is not ceremony — a dirty tree
before a pull is a state no later reader can reconstruct, and this is the only place it exists.

**2 · rebuild → `02-build.txt`**
```
cd consonance\src-tauri
cargo build --release  > "$OUT\02-build.txt" 2>&1
cd ..\..
```
**Every Rust change is inert until this.** The desktop is always-on, so this is not a formality:
a seat woken before the rebuild runs last week's binary against this week's documents.
*Answers:* does this machine's binary match this machine's source? **Record your release path** —
it is set by `CARGO_TARGET_DIR` and differs between machines; step 4 compares against it.

**3 · relaunch — close Consonance, leave it shut ~90 seconds, reopen**
A running app holds the old binary in memory. Step 2 without step 3 changes nothing you can see.
*Answers:* is the new binary the one actually running? **Wake no seat before step 4.**

**4 · `install.ps1 -Check` → `04-check.txt`**
```
powershell -NoProfile -File dev\shell\install.ps1 -Check > "$OUT\04-check.txt" 2>&1
```
**READ-ONLY. It changes nothing.** *Answers:* does this machine's hook layer match what a fresh
install of this repo would produce? It does **not** answer "are the hooks working" — that
distinction cost the room twice and the check now prints both halves separately.
**It exits 1 on any drift, any absent file, or any registration mismatch. Exit 1 is the expected
result here and is not a failure.** See §3 before you act on anything it says.

**5 · `open-items.js` → `05-open-items.txt`**
```
node consonance\tools\open-items.js > "$OUT\05-open-items.txt" 2>&1
```
**This must come after the rebuild** — its first item md5s every bundled document against **the
built copy**, so run before step 2 it reports drift that step 2 would have fixed.
*Answers:* which commitments-with-a-check are open **on this machine**?

**6 · the suites → `06-js-suite.txt`, `07-cargo-test.txt`**
```
node consonance\tools\js-suite.js  > "$OUT\06-js-suite.txt" 2>&1
cd consonance\src-tauri
cargo test --bin consonance       > "$OUT\07-cargo-test.txt" 2>&1
cd ..\..
```
*Answers:* do the instruments pass on this machine's tree? **Do not quote a number from any
handoff.** A green measured on the laptop was quoted four times across three commits while the
suite was red. A green from an earlier run is not a green.

**7 · `chain-status.js --why` → `08-chain.txt`**
```
node consonance\tools\chain-status.js --why > "$OUT\08-chain.txt" 2>&1
```
Last, because it is a sensor rather than a step. *Answers:* whose turn is it, and — the part that
matters today — it prints **`this machine only`**, because the lap ledger lives in a machine-local
data dir. Neither machine can see the other's. That is a designed limit, printed rather than filed.

---

## 2. THE PREDICTION — registered here, before the run

Written from documents that already exist, so this is not fitted after the fact.
`handoff_desktop_2026-08-24.md:36-49` states what is inert until rebuild; `compaction_handoff_2026-08-25.md:9-43`
states what a summary strips. **Scored by your captured files and nothing else.**

| # | prediction | observable | where |
|---|---|---|---|
| P1 | Before rebuild the Third Place brief is absent from the build; after, it is present | open-items item 1 flips from `1 could not be compared at all: THIRD_PLACE.md (absent from the BUILD)` to all compared | `05-open-items.txt` |
| P2 | The librarian's shelf carries a SYSTEM tier and indexes the rest | the intake's `N carried / M indexed` line has **M > 0**; before rebuild it reads `indexed 0` | a librarian wake, **after** step 4 |
| P3 | `-Check` exits **1**, with a non-empty ABSENT list and a non-empty registration block | exit code plus the two `DECLARED, NOT REGISTERED` / `REGISTERED, NOT DECLARED` counts | `04-check.txt` |
| P4 | `chain-status` prints **nothing** and exits **0**, and `--why` names the absent ledger on stderr | the desktop has no lap ledger; silence here is chosen, not broken | `08-chain.txt` |

**How each is scored:** P1, P3, P4 are single lines in files you will already have — no judgement.
P2 requires waking the librarian, which happens **after** step 4 and only if §3 does not stop you;
if you do not wake it, **P2 is UNSCORED, not passed.**

**Laptop values today, as the control — not as the expected answer.** The desktop's numbers will
differ and *the difference is the finding*: `-Check` → exit 1, 12 ABSENT, 0 drifted, 8 declared-
not-registered, 6 registered-not-declared, 1 PATH-MISMATCH (`ambient.js`). open-items → `2 of 5
still open`, with THIRD_PLACE.md absent from the build **here too** (the laptop has not rebuilt
since it shipped). **If the desktop returns numbers identical to these, be suspicious rather than
pleased** — two machines agreeing exactly is the thing to check, not the thing to report.

**And there is one open item only you can close.** open-items carries the `userprompt-submit.js`
two-way conflict as HELD and says of it: *"measured on the desktop and cannot be scored from
here."* Your `05-open-items.txt` is the first reading of it from the machine it belongs to.

---

## 3. THE REFUSAL — and it is the success case

**If `-Check` returns a set you cannot reason about in one sitting, stop. Write "do not pull
further today" in the note, commit the outputs, and push. That is the correct outcome.**

Concretely, stop if any of these hold:

- the ABSENT list contains a hook you cannot trace to a `$register` entry you have actually read;
- `REGISTERED, NOT DECLARED` names a hook running on the desktop that this repo has never heard of;
- the two lists together are large enough that you would be guessing about any single line.

**Do not run `install.ps1` without `-Check` today, whatever it says.** Measured on the laptop this
morning, the manifest would wire **8 hooks that are registered on no machine** and copies **6 that
are running with no manifest entry**. Installing on the desktop registers every one of them, on a
machine nobody is watching. `journal/2026-08-18.md:1163-1177` is the same finding a week earlier
and it has not been repaired — only made visible.

**A stop is not a failed run.** The pull, the rebuild and four captured outputs are the experiment;
the hook sync is a separate decision that has now been informed instead of guessed. The failure
mode here is a machine changed by a script nobody read, not a task left undone.

---

## 4. THE NOTE — the only prose you write

One file, `exo_memory\loop\desktop_run_2026-08-25\NOTE.md`, and it may contain **only what is not
already in the captured outputs**:

- what you did and did not do, in order, including anything you skipped and why;
- anything you observed that no command printed — how long the rebuild took, whether the app
  actually came back, whether the Third Place tab is there;
- P1–P4 marked PASS / FAIL / **UNSCORED**, with the filename each was read from;
- anything that surprised you, in your own words, before you explain it.

**Do not restate the outputs.** They are committed beside this file. A note that summarises them
re-creates the exact failure §0 exists to prevent.

---

## 5. WHAT THIS RUN CANNOT ESTABLISH

State these in the note rather than letting a later reader assume otherwise.

- **That the hooks WORK.** `-Check` compares bytes and reads `settings.json`. It has never meant
  "this hook fires." A registered hook with a broken body reads clean.
- **That the desktop is now in sync.** If §3 stops you, the hook layer is unchanged — you will have
  *measured* the gap, not closed it.
- **That the instruments are correct on a foreign machine** — only that they *ran* there. Every one
  was written and tuned on the laptop; a green may mean the code travels, or that the check is
  narrower than its name. That distinction is not settleable from one run on one machine.
- **Anything about the laptop.** Symmetrically to the failure in §0: *desktop observed X* is
  established; *therefore the laptop is Y* is not.
- **P2, if you do not wake the librarian.** Unscored is not passed.
- **That two machines are enough.** n=2 is the first outside, not a population.

---

## 6. IF SOMETHING BREAKS

Commit the outputs first, then stop. `git stash` before pulling if the tree is dirty — and record
in the note that you did, because a stash is a state no later reader can see. Nothing in this
runbook is urgent enough to justify an unrecorded step.

---

*Every command here was read from the source it runs, and the laptop control values in §2 were
produced this morning by running the two read-only commands. The rebuild, the relaunch, and every
desktop figure are unrun by me and are yours to produce.*

---

# 8. AMENDMENTS — appended 2026-08-25, after the first real run

*Everything above this line is the runbook as it was written BEFORE any machine ran it, and it stays
verbatim — including the §2 prediction table, which is a dated pre-registration and would be worth
nothing if it were edited after the outcome. This section is the append. Where it corrects something
above, it says so and points at the line rather than changing it.*

**The object it is written against:** `exo_memory/loop/desktop_observations_2026-08-25.md` at
`03a5fbc`, produced by the desktop instance against `683d468`. Read that file first. It withdraws its
own headline in its §3 and lists four things it could not determine in its §6, which is the standard
this section is trying to deserve.

---

## 8.0 THE PRE-REGISTRATION RETURNED FOUR PREDICTIONS AND ZERO SCORED ONES

By §2's own rule — *"if you do not wake it, P2 is UNSCORED, not passed"* — all four are **UNSCORED**:

| # | verdict | why |
|---|---|---|
| P1 | UNSCORED | scored by an open-items line **before and after** the rebuild. No rebuild is recorded, and the one open-items reading in the artifact is a bare `4 of 5 still open` with no item detail (`git show 03a5fbc:exo_memory/loop/desktop_observations_2026-08-25.md | grep open-items`). |
| P2 | UNSCORED | needs a librarian wake. None is recorded. |
| P3 | UNSCORED | needs `04-check.txt`. `install.ps1 -Check` does not appear in the artifact at all. |
| P4 | UNSCORED | needs `08-chain.txt`. `chain-status.js` does not appear in the artifact at all. |

Re-derive with: `git show 03a5fbc:exo_memory/loop/desktop_observations_2026-08-25.md | grep -nE "install\.ps1|chain-status|cargo build|git pull"` → no match on any of the four.

**And the captures the whole of §0 exists to produce were not produced.** There is no
`exo_memory/loop/desktop_run_2026-08-25/` directory, in the working tree or anywhere in history:

```
ls exo_memory/loop/desktop_run_2026-08-25                                          # no such directory
git log --all --oneline --diff-filter=A -- 'exo_memory/loop/desktop_run_2026-08-25/*'   # empty
git show --stat 03a5fbc                                                            # one file changed
```

**Two of the seven ordered steps produced a record** (5 open-items, 6 both suites), **four produced
none** (1 pull, 2 rebuild, 4 `-Check`, 7 chain-status), step 3 is unobservable by construction, and
one command that is not in the order was run and reported (`portable-paths.js`).

**What this does and does not establish, because the temptation is to read it as disobedience.** The
artifact cannot tell you whether the desktop held this document and diverged from it, or never held
it. Both readings end at the same observation and I am not able to separate them from here — which is
the same limit `journal/2026-08-17.md:10-26` states in the other direction, and §0 quotes at the top
of this runbook. What **is** established is narrower and is the thing worth fixing: **the run
happened, it was careful, and no raw output survived it.** A prose file is what the room got, and a
prose file is exactly what §0 forbade in the first sentence.

So the failure is not the operator's. **§0 asked for a discipline and gave no mechanism**, in a repo
whose own doctrine is that a convention is what it keeps finding under rocks — `lap-row.js:23-25`
says it in those words about this exact class. §8.1 is the repair.

---

## 8.1 THE CAPTURE RULE NEEDS A SCRIPT, NOT A PARAGRAPH

Paste this whole block. It runs the order and captures as a side effect, so capture is not a thing
anyone has to remember at eleven separate moments. It keeps every rule §0 argued for — child process
rather than a pipe, exit code recorded after each command, absolute `$OUT` — and it makes them
un-skippable rather than requested.

```powershell
# --- desktop first run, capturing harness. Run from the repo root, in PowerShell. ---
$ErrorActionPreference = 'Continue'
$OUT = "$PWD\exo_memory\loop\desktop_run_2026-08-25"
New-Item -ItemType Directory -Force -Path $OUT | Out-Null
$REPO = $PWD

# cargo is frequently absent from a non-login shell's PATH. See 8.2 for why this line matters.
$env:PATH = "$HOME\.cargo\bin;$env:PATH"

function Cap($file, $exe, $argList, $cwd) {
  $p = Join-Path $OUT $file
  Push-Location $cwd
  "== $exe $($argList -join ' ')  (cwd $cwd)" | Set-Content $p
  & $exe @argList *>> $p
  $code = $LASTEXITCODE
  "EXIT=$code" | Add-Content $p
  Pop-Location
  Write-Host "$file  EXIT=$code"
}

# 0 · the machine itself — see 8.5. This block is why a later reader can tell machine from defect.
$id = Join-Path $OUT '00-machine.txt'
"hostname      $([System.Net.Dns]::GetHostName())"            | Set-Content $id
"repo          $REPO"                                          | Add-Content $id
"HEAD          $(git rev-parse HEAD)"                          | Add-Content $id
"CARGO_TARGET_DIR  $($env:CARGO_TARGET_DIR)"                   | Add-Content $id
"LAP_MACHINE_TAG   $($env:LAP_MACHINE_TAG)"                    | Add-Content $id
"node          $(node --version)"                              | Add-Content $id
"cargo         $(try { (cargo --version) } catch { 'ABSENT' })" | Add-Content $id
"~/.consonance.json:"                                          | Add-Content $id
Get-Content "$HOME\.consonance.json" -ErrorAction SilentlyContinue | Add-Content $id

Cap '01-pull-before.txt' 'git' @('status','--porcelain') $REPO
Cap '01-pull.txt'        'git' @('pull')                  $REPO
Cap '02-build.txt'       'cargo' @('build','--release')   "$REPO\consonance\src-tauri"
# --- STOP HERE. Do step 3 by hand: close Consonance, wait ~90s, reopen. Then run the rest. ---
Cap '04-check.txt'       'powershell' @('-NoProfile','-File','dev\shell\install.ps1','-Check') $REPO
Cap '05-open-items.txt'  'node' @('consonance\tools\open-items.js')      $REPO
Cap '06-js-suite.txt'    'node' @('consonance\tools\js-suite.js')        $REPO
Cap '07-cargo-test.txt'  'cargo' @('test','--bin','consonance')          "$REPO\consonance\src-tauri"
Cap '08-chain.txt'       'node' @('consonance\tools\chain-status.js','--why') $REPO

git add "exo_memory\loop\desktop_run_2026-08-25"
git commit -m "desktop first run - raw output"
git push
```

**It is still yours to read before you run it**, and §3's refusal still governs: it deliberately does
**not** call `install.ps1` without `-Check`, and nothing here overrides the instruction to stop and
commit if `-Check` returns a set you cannot reason about.

**Its own limit:** a script that captures does not make anyone read the captures. §0's failure mode
moves rather than disappearing — from *no output* to *output nobody opened*. The counter is §4's
NOTE, which is the one place a human has to have looked.

---

## 8.2 `cargo` MAY NOT BE ON PATH, AND **127 IS NOT RED**

The desktop hit this and wrote the warning itself
(`desktop_observations_2026-08-25.md` §0): *"`cargo test` returns 127 = command not found... I nearly
reported the 127 as a red suite."*

One line, before any Rust step, and it is in the harness above:

```
export PATH="$HOME/.cargo/bin:$PATH"        # bash
$env:PATH = "$HOME\.cargo\bin;$env:PATH"    # PowerShell
```

**Why it earns a section rather than a footnote.** A missing interpreter and a failing suite are
different facts and **they are indistinguishable once either is summarised.** Both surface as a
non-zero exit and a red line in a status table; "cargo test failed on the desktop" is a true sentence
about each of them and points at opposite repairs — install a toolchain, or fix nine tests. This
runbook's whole §0 argument is that the compression step between a measurement and a sentence about
it is unguarded, and 127 is the cleanest instance of it available: **the number that tells you which
one it was is exactly the number a summary drops.** The harness records `EXIT=` after every command
for this reason and no other.

**And the invocation must match the control.** §1 step 6 names `cargo test --bin consonance`; the run
used `cargo test --quiet`, which builds and runs **every** target — the artifact shows three result
lines (22, 77, 77) before the failures. Neither form is wrong; **the counts from one are not
comparable to the counts from the other**, and no control anywhere in this file was taken with
`--quiet`. Whichever you use, use the same one at both ends and put it in the capture header. The
harness pins `--bin consonance`.

---

## 8.3 `open-items` COUNTS ARE MACHINE-LOCAL AND CANNOT BE DIFFED ACROSS MACHINES

The desktop reported `4 of 5 still open` (`git show 03a5fbc:exo_memory/loop/desktop_observations_2026-08-25.md | grep "open-items"`). **That number cannot be subtracted from a laptop number**,
and §2's use of the laptop's `2 of 5` as a "control" invited exactly that subtraction. It is not a
control; it is the same instrument answering a different question, because four of the five items
read machine-local state:

- item 1 md5s the bundle against `releaseDir()`, which follows `CARGO_TARGET_DIR` — on the laptop
  today that is `C:\build\lighthouse-target\release`, not `target/release`;
- the `userprompt-submit.js` item reads **this machine's** `~/.claude/settings.json`, and prints
  `NOT LIVE ON THIS MACHINE` here for that reason;
- two items read `C:\Consonance\data\*.jsonl`, which is per-machine by design, same as the lap ledger.

Re-derive with `node consonance/tools/open-items.js`, which prints each item's `universe:` line
naming the exact path it read.

**So the correct reading of two machines' open-items output is side-by-side, never as a delta** — and
the one item that genuinely wants the desktop's answer is named in §2 already (`userprompt-submit.js`,
*"measured on the desktop and cannot be scored from here"*), which is the only cross-machine claim in
this file that survives.

**A second defect in §2, and it is mine.** Its laptop control values carry no timestamp and no HEAD
sha. §2:151 above records the laptop as two-of-five-open. The same command on the same machine
now returns `1 of 5` (`node consonance/tools/open-items.js | grep "still open"`), hours later — and
the older figure is re-derivable from nothing at all, because no run of it was ever captured. A
control with no stamp is not reproducible and quietly ages into a false baseline. **Any
control value in a future runbook must be written as `<command> → <output>  (HEAD <sha>, <time>)`.**
Registered here rather than patched above, per the append law.

```
node consonance/tools/open-items.js      # laptop, HEAD 03a5fbc, 2026-08-25 morning -> 1 of 5 still open
```

---

## 8.4 THE §6 "COULD NOT DETERMINE" LIST — ANSWERED WHERE IT COULD BE

The desktop was right to list these instead of reaching. Three are answerable; the commands are what
the order should have asked for, and they are now in the harness or named below.

### item 1 — *"is `room_brief` baselined-and-exempted, or invisible to the scanner?"* → **INVISIBLE.** Not exempted.

Two commands settle it, both against `03a5fbc` rather than a working tree:

```
node -e "const b=require('./consonance/tools/portable-paths.baseline.json');
         const a=Array.isArray(b)?b:Object.values(b)[0];
         console.log(a.filter(s=>s.file.endsWith('main.rs')&&/src-tauri|brief/.test(s.text)).length)"
# -> 0    (28 main.rs sites are baselined; none of them is a room_brief tier)
```

and the detectors applied to the four lines directly, using the regexes at
`consonance/tools/portable-paths.js:189-198`:

```
main.rs:2610  "{}\\Consonance\\lighthouse\\...\\brief\\{}"      DRIVE=false PORTABLE=false SEG=true  -> NONE
main.rs:2611          sysdrive(), name                          DRIVE=false PORTABLE=true  SEG=false -> NONE
main.rs:2617  "{}\\OneDrive\\Desktop\\projects\\lighthouse\\..." DRIVE=false PORTABLE=false SEG=true  -> NONE
main.rs:2618          home(), name                              DRIVE=false PORTABLE=true  SEG=false -> NONE
main.rs:343   ex(format!("{}\\Consonance\\lighthouse\\exo_memory\\BOOT.md", sysdrive()))          -> DISGUISED
```

**The mechanism, and it is a class rather than an oversight.** `scan()` at
`portable-paths.js:206-218` is line-based, and `DISGUISED` requires `PORTABLE_PREFIX` **and**
`MACHINE_SEGMENT` **on the same line**. `room_brief` writes a multi-line `format!` — the literal on
one line, `sysdrive()`/`home()` on the next — so neither line carries both and the site is not seen
at all. Line 343 is the identical shape on **one** line and is caught. This is why
`portable-paths` exits 0 over the exact pattern it lists as `DISGUISED` four lines further up in the
same file: **it is not exempting the tiers, it never saw them.**

Applying the same three regexes to every tracked `.rs/.js/.ps1/.py/.ts` file at `03a5fbc`, looking for
a `MACHINE_SEGMENT` line with no prefix of its own whose neighbours (±2) carry one, returns **9
candidates**. Four look real to me and I have not adjudicated them:

```
consonance/src-tauri/src/main.rs:2610, 2617      the two room_brief tiers
consonance/src-tauri/src/main.rs:2788-2789       PathBuf::from(home()).join("Desktop").join("lighthouse")...
dev/shell/hooks/precompact.js:27-29              path.join(USERPROFILE, "Desktop","lighthouse",...,"checkpoint.py")
```

The other five are a test name, two PowerShell message strings and a trailing comment.
**`precompact.js` is worth someone's minute independently:** it builds
`%USERPROFILE%\Desktop\lighthouse\exo_memory\loop\checkpoint.py`, which does not exist on the laptop,
where the repo is at `C:\Consonance\lighthouse`.

**Routed, not fixed.** `main.rs`, the baseline and the scanner are pane A's packet in this cycle. This
section is the measurement and the command; the call on whether the tiers get repaired, baselined, or
the detector taught to join continuation lines belongs there. **The scanner's blind spot is the
finding; the nine failing tests are one symptom of it.**

### item 2 — *"was `lap-row.test.js` red when committed, or only red on the desktop?"* → **RED EVERYWHERE EXCEPT ONE MACHINE, FROM THE MOMENT IT WAS COMMITTED.**

```
git show dcb0d9b~1:consonance/tools/lap-row.js | grep -A3 "function mintId"
# -> returned 'L' + n unconditionally: the suite was machine-INDEPENDENT before 2W-1

LAP_MACHINE_TAG=D node --test consonance/tools/lap-row.test.js
# -> at 03a5fbc: 18 of 33 fail. Any tag but L reproduces the desktop's failure on any machine.
```

So the suite became machine-dependent **at** `dcb0d9b`, was green on the one machine that ran it, and
was red everywhere else from that commit forward. Pinned this morning — see the comment at the head of
`consonance/tools/lap-row.test.js`, which carries the mutation evidence that the pin did not eat the
per-machine property.

**The generalisation this runbook should carry, because it is the same shape as its own §0:** a test
run on one machine tells you it passes **on that machine**. `verified it exists, never verified it
shipped` is on this room's record twice; this is the third face — *verified it passes here*. **A
suite's portability is not tested by running it; it is tested by running it under a foreign identity,
which costs one environment variable.**

### item 3 — *"does the shipped app resolve briefs correctly at runtime?"* → **STILL OPEN, AND THE ORDER COULD NOT HAVE ANSWERED IT.**

The desktop was right to withdraw here. Worse than it says: **at runtime the failure is silent.**
`room_brief`'s callers are `if let Ok(...)` at `main.rs:2360` and `4194`, and `.ok()?` at `4283`
(THIRD_PLACE) and `4464` (LIBRARIAN). A failed resolution writes nothing — not to `persist.log`, not
to stderr. The section simply does not appear in the seat's intake, and an app that has lost a brief
looks exactly like one that never carried it.

**This is deliberate, and that is the point rather than an objection.** `main.rs:2358-2361` states it:
*"a missing optional brief must never stop a sibling waking."* The design is right and the consequence
still holds — **a correct silence is still a silence, and a run that only watches for errors cannot
see it.** An observer has to look for the thing that should be PRESENT.

So **no capture in §1 can answer this**, including the rebuild and the relaunch, and grepping a log is
not available. The only observable is positive and lives inside a woken seat. Add as **step 3b**,
after the relaunch:

> **3b · wake a librarian seat and paste its intake into `03b-intake.txt`.** Look for the
> `N carried / M indexed` line (this is P2) and for the committee-practice section. **Absence of a
> section is the failure signal** — there will be no error anywhere. If the seat cannot be woken,
> write `03b UNSCORED` and say why; do not infer from the app having started.

### item 4 — *"anything about the other ~100 commits."* Out of scope by construction, and §5 already says so. It stays out of scope.

---

## 8.5 STEP 0 — CAPTURE THE MACHINE BEFORE CAPTURING ANYTHING ELSE

Missing from §1 and it is the cheapest step in the file. Both of the answerable §6 items turned out to
be questions about **machine identity**, not about code: which tag this box mints, which target dir
the build lands in, which settings file the hooks are registered to. Each took a second machine's
transcript to reconstruct after the fact; each is one line at the start of a run.

The harness in §8.1 writes `00-machine.txt` with hostname, repo path, HEAD, `CARGO_TARGET_DIR`,
`LAP_MACHINE_TAG`, node and cargo versions, and `~/.consonance.json`. **Nothing else in the capture
set is interpretable without it** — `4 of 5 still open` (`git show 03a5fbc:exo_memory/loop/desktop_observations_2026-08-25.md | grep open-items`) means nothing until you know which data dir
was read, and `D001` means nothing until you know the hostname.

*One caution, since this file gets committed:* `~/.consonance.json` holds coordinates. The repo is
public by inherited exposure; the room's standing rule is that the location lives in local config and
is never named in tracked prose. **Drop the `ambient_*` lines from `00-machine.txt` before you commit
it.**

---

## 8.6 ONE THING THE RUN OBSERVED THAT NOBODY HAS RULED ON

`desktop_observations_2026-08-25.md` §7: `actors.test.js` counted as a **hard failure**, suite line
`0 canary (of 61)`, runner exit 1 — where `handoff_2026-08-22.md` §4 recorded `1 canary` and exit 0.
The desktop did not trace it and neither have I. The laptop's `open-items` disagrees in a third
direction, printing *"green, and not declared red"* for that item this morning.

**Three readings of one file across two machines and one week.** `actors.test.js` and `js-suite.js`
are pane A's and pane B's packets this cycle; this is a pointer to them, not a verdict. Recorded here
so it is not lost between three seats' hand-backs.

---

## 8.7 WHAT THESE AMENDMENTS DO NOT ESTABLISH

- **Nothing about the laptop.** Symmetrical to §5's last clause and to §0's whole argument: *desktop
  observed X* is established; *therefore the laptop is Y* is not, and this section made no laptop
  measurement except where it says so and gives the command.
- **That the harness in §8.1 works.** It is composed of commands each of which has run somewhere, but
  **it has never been executed as a whole, on any machine, by me.** It is untested code in a document
  telling someone else to trust a procedure — which is close enough to the failure this runbook exists
  to catch that it has to be said in its own bullet. Read it before you run it.
- **That the capture problem is solved.** §8.1 moves the failure from *no output* to *unread output*.
- **That n=2 is a population.** Still one outside machine, one run, and now zero scored predictions
  from it.

**Falsifier for this section, registered before the next run:** if the desktop's second run again
produces prose and no `desktop_run_*` directory, then the defect was never the missing mechanism and
§8.1 is the wrong repair — the diagnosis in §8.0 fails and something about routing, or about who reads
this file at all, is the real cause. Scored by `ls exo_memory/loop/` after the next run and by nothing
else.

*Written on the laptop by the seat that wrote §§0-7, which still cannot run any of it. The desktop's
closing line — "the fixes are not mine to choose" — is answered: it chose correctly, and the two
things it declined to fix are §8.4 item 1, routed to pane A, and its own §7, routed to A and B.*
