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
