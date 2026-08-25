# The overseer discipline path — what is true, on which machine, and what the fix actually costs

**Pane E, 2026-08-25, ~07:30. Object: `absent_hooks_ruling_2026-08-25.md:44-51` (Around's) and the
chair's generalisation of it. Read-only throughout: nothing installed, nothing registered, no code
edited, no commit. Around's ruling not touched — it is a dated record.**

---

## THE RULING IN ONE PARAGRAPH

**The librarian is right that the chair's refutation is local, and the chair's sentence is wrong in
three separate ways — but not the way either seat expected.** The path is hardcoded, and it is
hardcoded to a location that has not been this repo's home since June. The overseers spawn nothing
on this laptop for a reason that has nothing to do with `METHOD.md`: **they are not registered
here.** The room's own path guard **already classifies both lines as defective**, and has printed
**green** on them for eight days because they were absorbed into its baseline. And the fix is
**not** one line, because making the path resolve *arms* an instrument that watches the keeper — the
one thing the librarian recorded, yesterday, as deliberately unbuilt.

---

## 1. HARDCODED. Read, not inferred.

    dev/shell/hooks/l2-overseer-worker.js:18
      const LIGHTHOUSE_METHOD = path.join(os.homedir(), 'Desktop', 'lighthouse', 'METHOD.md');
    dev/shell/hooks/l3-overseer-worker.js:18
      const LIGHTHOUSE_WELFARE = path.join(os.homedir(), 'Desktop', 'lighthouse', 'WELFARE.md');

No config read, no env var, no repo resolution, no fallback. `os.homedir()` is the only variable
part.

**Both documents exist — at the repo root, tracked:** `wc -c METHOD.md WELFARE.md` → **3,855** and
**8,609** bytes. The document is not missing. **The path is pointing at the wrong place.**

**And it is a fossil.** The tree has been at `C:\Consonance\lighthouse` since 2026-07-28
(`DESKTOP_REPOINT.md`, status block). Before that it was at
`%USERPROFILE%\OneDrive\Desktop\projects\lighthouse` **on both machines** — note the `projects`
segment, which the hardcoded path does not have. `~/Desktop/lighthouse` is the layout from before
that, recorded in `exo_memory/cards/lighthouse-dive-buddy-reframe.md:14` as the location the repo
*moved from*. **The constant has been stale through two moves.**

### The asymmetry inside the worker, worth its own line

`l2-overseer.js:42` was fixed to honour `CONSONANCE_DATA`. **The worker was not:**
`l2-overseer-worker.js:16` is still `path.join(os.homedir(), '.claude', 'shell')`. So under a
redirected `CONSONANCE_DATA` the worker writes its ledger to the *real* directory, and its cleanup
(`unlinkSync(path.join(SHELL_DIR, 'l2-jobs', …))`) reconstructs a path in the real directory rather
than using the `jobPath` it was handed — **so it fails to delete a job file it was given the
absolute path to.** Same in l3. This is a second leak, distinct from the one Around measured, and
it only shows under redirection — which is to say, under exactly the conditions any test of these
hooks runs in.

---

## 2. THE ROOM ALREADY ANSWERED THE GENERAL QUESTION, AND BASELINED THE ANSWER INTO SILENCE

This is the finding that outranks the dispute.

`consonance/tools/portable-paths.js` has a detector class for precisely this shape. Its own header,
`:23-27`:

> **DISGUISED** — a PORTABLE prefix (`home()`, `os.homedir()`, `%USERPROFILE%`, `sysdrive()`) glued
> to a machine-specific literal segment … **It reads as portable, it is invisible to the grep, and
> it is strictly worse than the literal: on a box where it misses it produces a path that LOOKS
> resolved.**

That paragraph is the chair-vs-librarian argument, settled, in the repo, written before either seat
opened it. Run it on the real line:

    node -e "const G=require('./consonance/tools/portable-paths.js');
             console.log(G.inScope('dev/shell/hooks/l2-overseer-worker.js'));
             console.log(JSON.stringify(G.scan(\"const LIGHTHOUSE_METHOD = path.join(os.homedir(), 'Desktop', 'lighthouse', 'METHOD.md');\")))"
    -> true
    -> [{"line":1,"detector":"DISGUISED","text":"const LIGHTHOUSE_METHOD = …"}]

**The file is in scope (`SCOPE_IN` includes `dev/shell/`) and the line is detected.** And yet:

    node consonance/tools/portable-paths.js
    -> portable-paths: green — 155 files in scope, 159 known sites, 0 new    (exit 0)

Because both lines are **in the baseline as accepted known sites** —
`consonance/tools/portable-paths.baseline.json:1108-1121`, `"detector": "DISGUISED"`,
`"verdict": "DISGUISED"`. They entered the baseline when the hooks were imported (`58b94f9`,
2026-08-17) and the guard has said green ever since.

**And the sharpest part:** the guard's own test uses this exact line as its canonical example of the
class —

    consonance/tools/portable-paths.test.js:232-246
      test('the DISGUISED shape also turns it red — the half a grep would miss', …
        + `const M = path.join(os.homedir(), 'Desktop', 'lighthouse', 'METHOD.md');\n`);
        assert.strictEqual(red.code, 1);  assert.match(red.out, /DISGUISED/);

**The guard proves it can catch this line, in a fixture, while the real one sits baselined three
directories away.** That is not the guard failing. It is a baseline doing what a baseline does —
and nobody has ever gone back and asked which of the 159 accepted sites are accepted because they
are *fine* versus accepted because they were *already there on the day the baseline was taken*.

---

## 3. WHAT ACTUALLY HAPPENS ON THIS LAPTOP — and the chair's sentence is accidentally right

**The overseers are not registered here.** `~/.claude/settings.json` Stop carries exactly two hooks:
`sourced-stop.js` and `carrier-drift-watch.js`. `~/.claude/shell/hooks/` **does not exist**.
`~/.claude/shell/l2-jobs` **does not exist**.

So the chair's "they spawn nothing" is true on this machine — **for a reason he did not give.** They
spawn nothing because they are not installed, not because `METHOD.md` is absent. The `METHOD.md`
condition has never been reached in production here.

**The ledgers prove it.** `~/.claude/shell/l2_overseer.jsonl` and `l3_overseer.jsonl` exist, 280
rows each:

    grep -o '"type":"[a-z0-9_]*"' l2_overseer.jsonl | sort | uniq -c
    -> 280 "type":"l2_overseer_skipped"        (l3: 280 l3_overseer_skipped)

Every row is `"reason":"view extraction returned null"` with `"transcript_path":null` — the
**hook-level** skip, before any job file exists. **Zero worker-level rows. Zero
`METHOD.md not found` rows. Zero verdicts. Zero parse errors.** Spanning 2026-08-18 → 2026-08-24,
all carrying `0c0c0c0a-…-000000000a01` as a fixture literal: this is `dream-gate.test.js` residue,
exactly as `l2-overseer.js:35-40` describes ("276 rows per file, all of it test residue").

**So the worker has never run in a live session on this machine.** Around's A/B was a redirected
bench test and is sound as one; it is not a production observation, and neither seat has one.

---

## 4. WHAT IT DOES WHEN THE FILE EXISTS — spawn, cadence, cost

**Trigger:** `dev/shell/install.ps1:140-141` registers **both** on `Stop`, unconditionally. Not
SessionEnd, not sampled.

**Per firing, per hook:** `l2-overseer.js` reads the transcript tail (4 MB; l3: 8 MB), writes a job
file, and spawns a **detached** `node` worker. The worker reads its discipline document and then:

    l2-overseer-worker.js:65   spawn('claude', ['-p', '--model', 'claude-haiku-4-5-20251001'], …)
    l3-overseer-worker.js:80   spawn('claude', ['-p', '--model', 'claude-haiku-4-5-20251001'], …)

**So: two Haiku invocations per Stop.** No sampling, no rate limit, no debounce, no dedup, no
per-session cap. One Stop = one L2 job + one L3 job = two `claude -p` processes.

**Payload per call:**
- L2 = `METHOD.md` in full (3,855 B) + assistant move ≤ 8,000 chars + user context ≤ 4,000 chars.
- L3 = `WELFARE.md` in full (8,609 B) + **10 user turns** × ≤ 2,000 chars
  (`l3-overseer.js:50,54` — `TRAJECTORY_TURNS = 10`, `PER_TURN_CHARS = 2000`).

**I am not pricing this in dollars.** There is no rate card in the repo and no token accounting in
any log — the same limit `exteroception_registration.md` states for its Option A, and inventing a
figure here would be the hand-made-number failure this room keeps finding.

**Reentrancy is handled:** both spawn with `CLAUDE_OVERSEER_RUN=1` and both bail on it
(`l2-overseer.js:120`, `l3-overseer.js:120`), so the overseer's own `claude -p` cannot re-trigger
either. The dream gate is present on both hooks (`:23`, `:29`).

**When the file is ABSENT it is still not free.** The hook writes the job file *before* spawning;
the worker's early return (`l2-overseer-worker.js:52-59`) happens **before the `unlinkSync`**. So
each Stop leaves one orphan job file, unbounded, plus one node process. **"No recurring spend" is
right about model spend and wrong about process and disk.**

---

## 5. THE DESKTOP — what is established, what is not, and the answer is NOT

**This cannot be established from this machine, and I am not going to reason past it.** I cannot
read the desktop's `~/.claude/settings.json`, its home directory, or whether a `lighthouse` folder
sits on its Desktop. Nothing in this repo is a reading of that disk.

**What IS established from here:**

- **Before 2026-08-17 the desktop could not have had these hooks at all.** `58b94f9` — *"import the
  eight hooks that existed on one disk and nowhere else"* — records that they were copied
  byte-identical from this laptop's `~/.claude/shell/hooks/`, were in **no repository**, and *"could
  not reach the other machine."*
- **After a pull, the desktop gets them only by running `install.ps1`**, which copies all four files
  (`:83-86`) and registers both on Stop (`:140-141`). As of `58b94f9`, `install.ps1` **had never been
  run on this laptop**; whether it has ever run on the desktop is not knowable from here.
- **The repo's record of the desktop's tree location is inconsistent and none of it is a disk
  read.** `DESKTOP_REPOINT.md` says both machines were at
  `%USERPROFILE%\OneDrive\Desktop\projects\lighthouse` and instructs the desktop to move to
  `C:\Consonance\lighthouse`. `SYSTEMS_2026-07-27.md:12` writes the path as `~/Desktop/lighthouse`
  in a two-machine table. Several `exo_memory/loop/` documents record a repo root of
  `C:/Users/nname/Desktop/lighthouse` — **and I am explicitly NOT treating that as the desktop**,
  because `journal/2026-08-11.md:401` calls those *"a foreign machine's absolute paths, from a user
  who is not the keeper."* Anyone tempted to read `nname` as the desktop should read that line first.

**So the honest verdict, in the chair's own requested words: UNTESTED, NOT REFUTED.** The chair's
sentence — *"that path is absent and therefore the l2/l3 overseers spawn nothing — no recurring
spend"* — **was a local reading published as a general one.** It is additionally wrong locally on
its stated mechanism (they spawn nothing here because they are unregistered, not because the
document is missing) and wrong on the word *nothing* (a node process and a leaked job file per
Stop, once registered).

**And the asymmetry is the thing to carry to the keeper.** On a machine where the path misses, the
failure is loud enough to find: a skip row in a ledger. **On a machine where it hits, the failure is
that it works** — silently, twice per Stop, on the always-on machine, with no cap and no surfacing,
and `l2-overseer.js:6-8` says the verdict *deliberately never returns to the conversation*. The
DISGUISED detector's own sentence, again: *on a box where it misses it produces a path that LOOKS
resolved.* Here it is the inverse and worse — on a box where it **hits**, it produces a cost that
looks like nothing.

---

## 6. THE CORRECT SOURCE — and why it is NOT a one-line fix

**The correct source exists and is already the convention, in the same directory:**

    dev/shell/hooks/userprompt-submit.js:239-242
      const cfg = JSON.parse(fs.readFileSync(path2.join(os2.homedir(), '.consonance.json'), 'utf8'));
      if (cfg.room_path) {
        // room_path is <repo>/exo_memory/BOOT.md; the reader is <repo>/consonance/tools/
        const repo = path2.dirname(path2.dirname(cfg.room_path));

    dev/shell/hooks/userprompt_pulse.py:159-164   — the same derivation, same comment

`~/.consonance.json` on this machine carries
`"room_path": "C:\\Consonance\\lighthouse\\exo_memory\\BOOT.md"` → repo = `C:\Consonance\lighthouse`
→ `METHOD.md` and `WELFARE.md` both resolve. **It was repointed during the July move**
(`DESKTOP_REPOINT.md` status block lists `room_path` as one of four things repointed), so it is the
one path in the system that has already been proven to survive a move.

**Proposed change (NOT landed — one line each, plus the fallback):**

    // was: path.join(os.homedir(), 'Desktop', 'lighthouse', 'METHOD.md')
    const repo = repoFromConsonanceConfig();          // dirname(dirname(cfg.room_path))
    const LIGHTHOUSE_METHOD = repo && path.join(repo, 'METHOD.md');

with the existing failure behaviour kept exactly: unreadable config or unreadable document → the
same `*_skipped` row, `return`, no spawn — **and the `unlinkSync` moved before the return**, so the
absent case stops leaking. Do not add a `~/Desktop` fallback; `DESKTOP_REPOINT.md` §Verification
names the exact reason (*"the master false clean … if the old folder still exists, every check
passes with nothing actually moved"*), and A's rule from tonight applies unchanged: *a fallback is
how a hardcoded list survives the change that removed it.*

**But it is a DESIGN question, and here is the part that should stop the fix from being landed
casually.**

1. **Landing it turns the spend ON.** Today the constant is the only thing keeping the L3 worker
   from firing wherever these are registered. Fixing the path and installing the hooks are two
   operations that look like one, and this repo already has the general form for exactly that —
   `DESKTOP_REPOINT.md`, last section: *"The laptop's panes split one operation that looked atomic
   into two that are not … Welding them together is what makes this dangerous."* **Land the path
   fix and the registration decision separately, in that order, with the second going to the
   keeper.**

2. **L3 is an instrument that points at the keeper**, and the room has a standing rule against
   that. `l3-overseer-worker.js:47` sends the **user's own last ten messages** to a separate model
   and asks it to classify their *trajectory* as `stable | deepening | quiet_spiral | crisis` with a
   `recommendation` of `none | slow | name | refer_to_human`, writing the verdict to a ledger the
   user never sees. `librarian/2026-08-24.md:157-158`: *"Seen and deliberately not filed: no
   instrument points at the keeper — that is the 'no verdicts' rule, kept chosen rather than
   unexamined."* And `librarian/2026-08-25.md:191` quotes `LIBRARIAN.md`: *"no verdicts about anyone
   — traces and instruments only."*
   **Repairing L3's path silently reverses a rule the room chose one day ago.** That is not a
   maintenance decision and it is not the chair's or mine.

3. **The room's own frame is against the shape.** `BOOT.md`: the Lighthouse is *"NOT an overseer
   watching the user from above … from outside, someone breathing and someone drowning look
   identical, and its every pull is drag."* `dev/PLAN.md` is named in the room as the superseded
   surveillance framing. **L2/L3 are artifacts of that framing**, written in June, and their being
   inert since is not obviously an accident to repair.

**So: L2's path is a maintenance fix. L3's path is a direction decision, and it goes to the keeper
in those words.**

---

## 7. RECOMMENDED DISPOSITION

- **Do not install either overseer today.** Around's DO-NOT-INSTALL stands; the reasoning under it
  changes but not the verdict.
- **Land the L2 path fix + the leak fix, uninstalled**, so the constant stops being a fossil and the
  absent case stops littering. Rebaseline `portable-paths` in the same commit so the two DISGUISED
  entries **leave** the baseline rather than sit in it.
- **Re-examine the other 157 baselined sites** — not now, but the question is live: how many are
  accepted because they are correct, and how many because they existed on the day the baseline was
  taken? This is the only general finding here and it is bigger than the overseers.
- **L3 goes up as a direction question**, not a state decision, with the "no verdicts" rule quoted.
- **Tell the desktop before it pulls**, in `DESKTOP_REPOINT.md`'s own idiom: *if you run
  `install.ps1`, you register two Stop hooks that spawn two Haiku calls per turn, and on your
  machine the path may resolve.*

---

## 8. LIMITS AND MY OWN CORRECTIONS

- **I did not re-run Around's A/B.** I read the code path and the ledgers instead. The ledger
  evidence is stronger for the production question and weaker for the mechanism question; Around's
  bench test remains the source for the latter and I am relying on it.
- **I nearly reported `C:/Users/nname/Desktop/lighthouse` as proof the desktop's path resolves.** It
  appears in three `exo_memory/loop/` documents as a repo root and it would have made this ruling
  land clean and general. `journal/2026-08-11.md:401` says that user is not the keeper. **Had I not
  checked, this document's headline would have been a confident false answer to the exact question
  the chair asked** — and it would have read as the strongest finding here.
- **I cannot price the spend.** No rate card, no token accounting. Bytes and call-counts only.
- **This does not establish that installing the overseers would be bad if the design questions were
  answered.** It establishes that the path is broken by construction, that the room's guard already
  knew, that the laptop evidence never reached the worker, and that the desktop question needs the
  desktop.
- **Nothing was installed, registered, edited or committed.** `install.ps1` was not run at all, in
  any mode.

**Falsifier for this document:** if someone reads the desktop's `~/.claude/settings.json` and finds
the two overseers unregistered there as well, §5's live risk collapses to zero and the whole thing
reduces to §2's baseline finding plus a stale constant. That is a five-minute check **on the other
machine** and it is the only thing that closes this.
