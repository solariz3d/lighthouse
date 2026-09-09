# P-DESKTOP-RUNBOOK — hand-back. Pane B, L054, 2026-09-09 ~07:20

**Deliverable:** `exo_memory/loop/desktop_first_launch_2026-09-09.md`.
**Packet:** `exo_memory/loop/packet_desktop_runbook_2026-09-09.md` (75c698a). Nothing committed.

Every figure below names the command that produced it. Nothing is quoted from the packet.

---

## 1 · WHAT WAS BUILT

A seven-step runbook with a pre-flight, a ten-row failure table, a half-run section and a
nine-item list of what could not be tested. It opens by saying, in its first paragraph, that
**nothing in it has ever been run on a second machine** — §9 of the packet, taken literally.

Structure, in the order a tired reader meets it:

    §0   THE TWO STEPS THAT KILL IT SILENTLY   -- machine_tag, and the board, before any step
    §1   PRE-FLIGHT                            -- NOT IN THE PLAN; see §4 below
    §2-8 STEPS 1-7                             -- the plan's seven, each with expected output
    §9   IF YOU STOP HALFWAY
    §10  THE FAILURE TABLE                     -- sees / means / types, 10 rows
    §11  WHAT I COULD NOT TEST                 -- 9 items

The two dangerous steps are stated at §0 **before the pre-flight**, and again in place as steps 1
and 4, each marked `⚠ DANGEROUS`. That is the only content in the document that appears twice.

---

## 2 · THE PLAN'S STATED REASON FOR STEP 4 IS WRONG, AND THE STEP IS STILL RIGHT

The plan and the packet both say a 300 MB board *"is REFUSED AT THE FIRST PUSH and the round trip
ends there."* **On the successful path it is not refused, because it is not there to refuse.**

Measured, not reasoned:

- `consonance/state-manifest.json:91-92` classes `attic/pre-sync-*` and its contents **STAYS**.
- `state-sync.js:installTree` overwrites every file named in the index — `board.jsonl` among them —
  and puts each displaced file under `attic/pre-sync-<stamp>/` first.

So after a successful MIGRATE the desktop's own board is in an attic that never travels, and the
file the close-push carries is the laptop's compacted 45 MB one plus the desktop's new rows.

**Where it does bite, and it is why the step stays:** if the pull does not install — no network, no
clone, `gh` not logged in, wrong repo path — the desktop's own board is still what the push tries
to carry, and `cmdPush`'s `FILE_CAP` check refuses. That is precisely the branch he cannot identify
in advance.

**So the step was rewritten from "compact first" to "look first, act only if the number says so."**
The dry run writes nothing and answers itself:

    node consonance/tools/board-compact.js
    -> before 29909 rows 44.9 MB · after 29909 rows 44.9 MB · removed 0 rows · DRY RUN
       (run on the laptop 06:57; 0.359 s wall, `time node ...`)

If `before` is under 100 MB he skips `--apply` entirely. **A step he can skip on evidence is worth
more than a step he performs on faith**, and it removes the one place this runbook would have told
him to mutate a file for no reason.

I have marked this a correction rather than smoothed it, because acting on a wrong reason is how
the reason survives to be wrong again.

---

## 3 · THE PLAN'S STEP 6 WOULD HAVE FIRED THE PACKET'S OWN FALSIFIER

Plan §5, step 6: *"`chain-status.js` prints two hashes."* **At that point it will print one, and
that is correct.**

    consonance/tools/state-sync.js:337  machineHeads()  -- reads machines/<tag>.json in the state tree
    git -C C:\Consonance\state ls-files machines/   ->  machines/L.json          (one file)
    node consonance/tools/chain-status.js           ->  ... in sync? L faf86d4 as of 18m ago ...

`machines/D.json` is created by **the desktop's first push**, which is step 7. And `inSync()` prints
the question mark precisely when one machine has pushed (`chain-status.js:inSync`, the
`ms.length === 1` branch). So at step 6 he sees `in sync? L faf86d4` — and a runbook telling him to
expect two hashes would have him reading a **correct** state as a failure, at 8am, with nobody to
ask.

That is the packet's registered falsifier verbatim — *a step at 08:00 whose result he cannot
interpret from this document* — and it was in the plan. The runbook states both lines, before and
after, and says which moment actually closes the round trip.

---

## 4 · TWO STEPS ADDED THAT THE PLAN DOES NOT HAVE

**A pre-flight.** Five checks — `git`, `node`, `cargo`, `gh auth status`, and the repo's `BOOT.md`
— plus one probe that asks the tools' own resolvers rather than assuming:

    node -e "const s=require('C:/Consonance/lighthouse/consonance/tools/state-sync.js'); console.log(s.machineTag(), s.stateDir(), s.dataDir())"
    -> L  C:\Consonance\state  C:\Consonance\data          (laptop, 06:50)

Two of the five are load-bearing and neither is anywhere in the plan:

- **`node` missing → the launcher's pull cannot run at all.** `run_state_pull` spawns `node`;
  a spawn failure is `Pull::CouldNotRun` → **LOCAL HOUSE on every launch, forever**, with the cause
  named only inside a board row.
- **`gh` missing or not logged in → the close-push refuses.** `remotePrivacy()` shells out to
  `gh repo view` and returns `unknown` on any failure; `cmdPush` refuses on anything but `private`
  (`state-sync.js:605`). This fails **after** the commit is made, which is the safe direction,
  but it stops the round trip at its last leg on a machine where `gh` may never have been installed.

**"Build, do not launch."** The plan's step 2 says *pull and rebuild*. `launch.ps1` rebuilds **and
then launches** (`launch.ps1:169` builds, `:240` starts the exe). A launch before step 3 runs the
sync against a state repo that does not exist, gets `state tree is not a git repository` → exit 2 →
**LOCAL HOUSE**, and burns the one launch that carries the migration. The runbook gives the bare
build command instead and says why:

    cargo build --release --manifest-path C:\Consonance\lighthouse\consonance\src-tauri\Cargo.toml

---

## 5 · TWO DEFECTS IN THE SHIPPED LAUNCHER, FOUND WHILE READING FOR THE VERDICT NAMES

Reported here rather than left out of the runbook, and both are C's surface.

### 5a · `READ-ONLY` is unreachable in this build

C's module header registered the doubt itself: *"The journal below exists because I cannot verify
that A's tool has that property."* **It does not have it.**

    grep -rn "sync-promotion|PROMOTION_JOURNAL" consonance/     ->  5 hits, ALL in sync_launch.rs
      :78   the constant            :152  a doc comment          :232  the message
      :570  the reader              :968  a TEST fixture -- the only thing that writes it

So `Facts::promotion_open` is false at every real launch, and the first `ReadOnly` branch cannot
fire. The second needs `installTree` to return a non-zero rc; `installTree` has **no error path** —
every return is `{ rc: 0, ... }` and an `fs` failure throws, which exits node non-zero and reaches
`decide` as `Pull::Failed`, which is matched **before** the completion record is read.

**Net effect: an install that dies part-way through presents as `LOCAL HOUSE` over a half-written
data dir** — the exact chimera `ReadOnly` was written to prevent. The runbook carries it as a
LOCAL HOUSE row with the right fix (`--pull --install` again), and names the discrepancy in §11 so
he is not waiting for a verdict that cannot appear.

### 5b · `machine_identity`'s comment describes a cascade the function does not have

The doc comment says it *"mirrors A's cascade exactly: `CONSONANCE_MACHINE`, then `machine_tag`
from `~/.consonance.json`, then the hostname."* The body has **no hostname step** — it returns
`None`. A's `machineTag()` does fall back to `os.hostname()` (`state-sync.js:161`).

**Consequence in practice is nil**, and I checked rather than assumed: `decide` takes
`me = c.machine.or(f.self_id)`, and `Completion::machine` is written by A's resolver, so the
hostname arrives from the JSON. The defect is that the **comment** will be trusted by the next
reader of that function, and it is the one place in the module where the prose and the code
disagree. Worth one line, not a packet.

---

## 6 · THE FAILURE TABLE

Ten rows, `WHAT YOU SEES / WHAT IT MEANS / WHAT YOU TYPES`. The plan supplied three. The five
verdicts were read from `sync_launch.rs:171-185` and its `tag()` at `:197` — `STANDALONE`,
`RESUME`, `MIGRATE`, `LOCAL HOUSE`, `READ-ONLY` — and every quoted row text is copied from the
source that formats it (`:352` for the MIGRATE reason, `:423` for the retire count, `:433` for
`RETIRE FAILED`), not paraphrased.

The rows the plan did not have, and why each earns its place:

- **`STANDALONE`** — the fourth row the packet asked for. It is the *silent* one: the launcher never
  found `state-sync.js`, so **no sync was attempted at all** and the app opened exactly as it always
  has. `repo_root()` resolves from `room_path` in `~/.consonance.json` (parent-of-parent, must
  contain `exo_memory/BOOT.md`), so a config pointing anywhere else produces a launch that is
  indistinguishable from a normal one. C posts the row for every verdict *precisely* so its absence
  is not ambiguous — the runbook turns that into a check he can run.
- **`LOCAL HOUSE: the pull VERIFIED BUT DID NOT INSTALL`** — split out from the general LOCAL HOUSE
  row because its fix is different (`--pull --install`, not a network problem).
- **`READ-ONLY`** — kept, with §5a's caveat.
- **No `sync at launch` row at all** — the build predates the sync. Distinguishes *the launcher ran
  and said nothing interesting* from *the launcher is not in this binary*, which is the
  done-vs-never-started class C names in the same file.
- **`REFUSING TO PUSH: could not confirm … is private`** — §4's `gh` dependency, at the step where
  it surfaces.
- **`NOT A FAST-FORWARD`** — the only row whose answer is *stop, this wants a person.*

---

## 7 · THE HALF-RUN SECTION

Seven stopping points, each with what is left behind and a yes/no on walking away. Six are **yes**.
The two that cost something are stated as the costs they are, not as warnings:

- **Step 5 done, step 7 never run, then work on the laptop.** Both machines append from one
  ancestor; the next pull is not a fast-forward and `cmdPull` refuses rather than invent a merge
  (`state-sync.js:762`). Nothing is lost — both records are on their own disks — but untangling
  is hand work.
- **Both machines running at once.** The single-live-host lease is designed and built as a tool
  (E) but **is not enforced in this build**; the only thing keeping one house is that the laptop
  will be closed. Said plainly rather than implied.

The one thing no step in the plan says, and which he should know *before* he launches, is now in
step 5: **the install overwrites the desktop's board, capture tails and ledgers with the laptop's**,
keeping every displaced file at `attic/pre-sync-<stamp>/` and the three fixed-id transcripts at
`~/.claude/consonance-attic/`. Nothing is deleted, but the desktop's own past moves out of the live
house, and that is the point of the exercise rather than a side effect.

---

## 8 · WHAT THIS DOES NOT ESTABLISH

- **Not one command in the runbook has been run on the desktop.** Everything marked *"what you
  should see"* is either (a) output I produced on the laptop, with the time noted beside it, or
  (b) a format string read out of the source that prints it. There is no third category, and the
  document says so in its first paragraph.
- **The `MIGRATE` arm has never executed anywhere**, on any machine. The laptop structurally cannot
  reach it: the two-phase design means the machine that authored the record always takes `RESUME`.
  Step 5 is the first execution of that code path in the world.
- **`panes.json` carries absolute `cwd` paths** and travels only if both machines resolve the same
  `instances_dir`. A's manifest flags this as its own unverified precondition and nobody has
  checked it. I surfaced it into the pre-flight; I did not resolve it.
- **I have never seen the desktop's `~/.consonance.json`.** Its `data_dir`, `room_path`,
  `instances_dir` and `machine_tag` are all unknown from here. Steps 1 and the pre-flight probe
  exist because of that, not despite it.
- **Build time on a cold machine is unknown** and marked UNVERIFIED in place.
- **`close.js` did not exist at 07:00**, so step 7 gives the `state-sync.js --push` it wraps, and
  says to prefer `close.js` if A has landed it by then.
- **Whether the app's board view renders the seam row legibly** — untested; the runbook gives a
  file-read command instead, which I could check.

## 9 · CORRECTIONS I MADE TO MYSELF

- First draft cited `main.rs` by line number. **Withdrawn** — C is editing `main.rs` on L053 right
  now, and a line number in a document read tomorrow is a citation that rots overnight. Function
  names throughout for that file; line numbers kept only for `sync_launch.rs`, the JS tools and the
  manifest, which are not in flight.
- First draft's step-7 expected output had the header line and the privacy line in the wrong order
  and invented a `DATA -> STATE` header that only the `--dry-run` branch prints
  (`state-sync.js:508`). Corrected against `cmdPush` to the four lines it actually emits, in order.
- First draft told him to delete `sync-adopted.json` after a wrong `RESUME`. **Withdrawn as
  unnecessary**: `decide` asks `pushed_by` before `adopted_commit`, so a corrected tag migrates on
  the next launch with nothing deleted. A runbook that tells a tired man to delete a file he does
  not need to delete is training him to delete files.
- My own L050 §5 lesson bit again, in this packet: backslashes did not survive a heredoc, twice,
  while editing the runbook. Both times caught by an explicit shape-check in the script rather than
  by the output looking right. **The lesson is now two laps old and I still reached for a heredoc.**

## 10 · FALSIFIER

Registered by the packet and unchanged: **a step at 08:00 whose result he cannot interpret from
this document.** If one happens, the row that should have covered it is the finding — and §3 above
is one that would have fired had the plan been transcribed rather than checked.
