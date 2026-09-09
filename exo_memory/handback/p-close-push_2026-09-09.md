# P-CLOSE-PUSH (L054) — the close refuses. Pane A, 2026-09-09.

**Built:** `consonance/tools/close.js`, `consonance/tools/close.test.js`,
`consonance/tools/close.mutants.js`. **Touched:** `consonance/tools/state-sync.js` (the receipt —
§3 says why the gate needed something inside it), `consonance/tools/state-sync.test.js` (7 tests
for the receipt), `consonance/state-manifest.json` (one STAYS rule, without which the receipt file
would make every future push refuse as UNPLACED). **Uncommitted.**

**A FILE, NOT A FLAG.** `state-sync --push` already carries four exit-0 outcomes and eight exit-1
ones; adding a mode to it would have put the gate inside the tool whose own report the gate exists
to distrust. Separate command, and state-sync's surface is unchanged apart from the receipt.

    node consonance/tools/close.js            # the close: prepare, gate, publish, PROVE
    node consonance/tools/close.js --check    # every gate, no commit, nothing published

Exit 0 = CLOSED. Exit 1 = NOT CLOSED, reason named. Exit 2 = no corpus / no state tree.

## 1 · THE THREE CLAIMS, AND HOW EACH IS EARNED

| the claim | what it is NOT taken from | what it IS taken from |
|---|---|---|
| the state is prepared | `state-sync`'s exit code | a RECEIPT whose run id must carry the pid of the child THIS process spawned |
| the remote is private | the `privacy verified here` line state-sync prints | the check run **here**, **before** anything is published |
| the push landed | `git push`'s exit code | `git ls-remote` — **the remote's own answer**, compared to this machine's HEAD |

**Printing is not gating, and the packet was right that mine only printed.** The privacy check now
runs in `close.js` before the publish, and a non-private or unknown reading stops the close with the
set committed locally and nothing sent.

**The publish moved to `close.js` on purpose.** It prepares with `state-sync --push --no-remote` —
the settle gate intact, the commit made by named path — and then does the privacy check and the
push itself. The gate and the act it gates are held by the same hand, and the whole path is
exercisable against a local bare remote in a fixture with no part of the gate stubbed to make a
test pass.

## 2 · THE REFUSAL CONDITION IN §7, ANSWERED: THE TWO ARE SEPARABLE

**They are told apart by asking the remote, never by asking whether a commit was made.**

    NOTHING_CHANGED + remote == HEAD   ->  a real close (quiet, legitimate)
    NOTHING_CHANGED + remote != HEAD   ->  a machine whose state never left

**And the second case is live, not hypothetical: it is the path `state-sync --push` exits 0 on
today.** Its `same` short-circuit returns before the remote is ever consulted, so a commit that
failed to publish once is never retried and the tool reports success forever. A close that read
that exit code would swallow it. `close.js` publishes in that case and then proves it —
`BUT A QUIET PUSH IS NOT: nothing-changed over a remote that is BEHIND still publishes`, and its
twin with the push address disarmed, which refuses.

## 3 · WHY THE RECEIPT HAD TO GO INSIDE `state-sync.js`

The exit code answers neither question a close has to ask. `--push` returns **0** from four places
(pushed / nothing changed / `--dry-run` / `--no-remote`) and **1** from eight, of which **exactly
one** — a path that will not settle — is worth retrying. The only alternative to a receipt is
parsing state-sync's prose, which is a relayed answer.

So `--push` now writes `state-sync.push.json` in the data dir on every termination that knows where
the data dir is: `{ run_id, pid, at, outcome, rc, … }` with `outcome` one of `PUSHED`,
`NOTHING_CHANGED`, `LOCAL_ONLY`, `DRY_RUN`, `DEFERRED_UNSETTLED` (+ the paths), `REFUSED_PRIVACY`
(+ the reading), `REFUSED_CAP`, `REFUSED_UNPLACED`, `REFUSED_FORBIDDEN`, `REFUSED_MANIFEST`,
`PUSH_FAILED`, `GIT_FAILED`, `NO_STATE_TREE`.

**The run id is the part that matters, and it is tonight's lesson made mechanical.** A receipt is
accepted only if its pid is the pid of the child this close spawned — a fact the caller HOLDS, not
a claim the file makes — and its timestamp is after the spawn. A close that read last night's
receipt as tonight's would be *"I re-checked"* with a file behind it. **A reading is not a state.**

Manifest: `state-sync.push.json` is **STAYS**, named in full rather than by a `state-sync.*` glob.
A wildcard is the whole subject of the L052 incident.

## 4 · THE TORN TAIL

An unsettled path comes back `DEFERRED_UNSETTLED`; the close **says DEFERRED, names the paths,
waits, and retries once**. Still unsettled → NOT CLOSED, nothing published, no commit.

The retry test is deterministic rather than timed-and-hoped-for: the capture's mtime is set 2.5 s in
the **future**, so pass one refuses it outright (`FUTURE_MTIME`) and pass two, after the wait, finds
a file ~1 s in the past and settles. **A loaded machine makes the margin bigger, not smaller** — the
wait is a floor. That is the correction to my own flaky settle assertion from earlier tonight:
*an assertion whose answer depends on how busy the machine is is not an assertion.*

## 5 · BARS

**RED FIRST — the honest order.** The push-failure test is the first test in the file and was the
first written, but `close.js` existed before it, so I did not have a red-then-green transition to
show. **The red-first evidence is the mutant pass, which is the same evidence with the arrow
reversed:** removing the failed-push refusal turns `A PUSH THAT FAILS IS NOT A CLOSE` red. I ran
the mutants before declaring the suite green. Stated as a deviation from the bar rather than
dressed as compliance.

    node consonance/tools/close.test.js       24 passed, 0 failed
    node consonance/tools/close.mutants.js    10 killed, 0 survived, 10 total
    node consonance/tools/state-sync.test.js  44 passed, 0 failed   (was 37: +7 for the receipt)
    node consonance/tools/state-sync.mutants.js   21 killed, 0 survived, 21 total (unchanged by the receipt edit)
    node consonance/tools/js-suite.js         86 green · 3 failed · 0 crashed · 1 canary  (of 90)

**What moved in js-suite: +1 file (`close.test.js`; `close.mutants.js` is not a `*.test.js` and is
not discovered), and the `state-sync.test.js` CRASH is gone — it was my own in-flight edit racing
the earlier run, not a real red.** The run before this packet read `82 green · 5 failed · 1 crashed
(of 89)`. Two of those five — `librarian-cite` and `librarian-notes` — are green now and **that is
not mine**; they cleared while other seats worked. The three still red (`actors.evidence`,
`forget-rate`, `portable-paths`) are untouched by this packet.

The three mutants the packet named, all **killed**:

    privacy check prints but does not gate   -> red
    failed push still reports closed         -> red
    DEFERRED retry removed                   -> red

Seven more, also killed: the remote's answer not compared to HEAD; an unreadable remote treated as
up to date; a deferred set published anyway; a non-prepared outcome tolerated; the receipt's pid not
checked; the receipt's timestamp not checked; `--check` publishing after all.

**The mutant pass earned its keep by finding a real hole:** `--check publishing after all`
SURVIVED the first run. The only `--check` test then in the file used a state tree with no commits,
so it returned before ever reaching the publish branch — the whole branch was unguarded in check
mode. Fixed by a test over a tree that is genuinely ahead of its remote.

## 6 · MEASURED AGAINST THE REAL TREE — `--check`, which publishes nothing

    node consonance/tools/close.js --check
    consonance close · L · C:\Consonance\data -> C:\Consonance\state  [--check: nothing published]
      state prepared: rehearsed · 47 files · 58.1 MB · nothing committed
      privacy verified here: solariz3d/consonance-state gh: visibility=PRIVATE
      the remote already holds this tree's HEAD (faf86d4).
      --check makes no commit, so it cannot say whether a real close would create a new one.
      in sync: L faf86d4
    CHECK ONLY — every gate passed and NOTHING WAS PUBLISHED. Run without --check to close.

**The last two lines are the tool saying what it did not establish**, which is the same discipline
this hand-back is written under. A rehearsal makes no commit, so *"the remote already holds HEAD"*
is a fact about the tree as it stands and not a claim that a real close would have nothing to add.
Letting `--check` print the quiet-close sentence would be the command telling the keeper it was
finished when it had not done the thing that finishes it.

## 7 · WHAT I DID NOT VERIFY

- **I have not run a real close.** The live run was `--check`. **Nothing was published by me**, and
  the publish against the actual GitHub remote is exercised only against a local bare remote in
  fixtures. Publishing outward keeps a human saying yes; this is a command the keeper types.
- **Nothing on the desktop.** The Sunday direction (remote ahead) is tested in a fixture with a
  second clone; it has never run on two machines.
- **The app does not call it.** `main.rs` is C's for L053 and I did not touch it. Leg 1 is closed by
  hand tonight, which is what §4(a) asked for.
- **`state-sync --push`'s own remote path** (the one `close.js` bypasses) is unchanged and still
  covered only by its existing suite; the receipt now records its outcomes but I did not re-measure
  that path against a real remote.
- **Other readers of the data dir** have not been checked against the new `state-sync.push.json`.
  It is STAYS and name-ruled, so it does not travel, but C's launcher globbing the data dir is a
  thing I asserted rather than measured.
- **`portable-paths` is RED with 9 unbaselined sites and none of them are from this packet** —
  three in `consonance/hooks/live-mirror-stop.js`, four in `consonance/src-tauri/src/sync_launch.rs`,
  one in `consonance/tools/live-follow.js`, one in `consonance/tools/state-sync.js:141` (mine, from
  L052, red before tonight). I did not run `--update`: the baseline is shared and blessing eight
  other seats' sites to clear my own line is not mine to do.

## 8 · FOR THE CHAIR AND FOR B

**The command for the runbook, and for the keeper tonight:**

    node C:\Consonance\lighthouse\consonance\tools\close.js

Run it before the lid shuts. If it prints anything other than a line beginning `CLOSED`, **the
state did not leave this machine** and the reason is on the line under it.

**One thing the chair should know before the next push:** the manifest now carries a rule for
`state-sync.push.json`. Without it the first close writes a file the classifier has never seen and
every subsequent push refuses as UNPLACED — which is the checker doing its job, loudly, at 6am.
The rule is in; `node consonance/tools/state-manifest.js` shows `TRAVELS = 58.1 MB` unchanged.

    OBJECTIVE:  closing the lid publishes the state, or says plainly that it did not.
    FALSIFIER:  a close that reports success over an unpushed or torn state set.

**Registered against the falsifier:** the close proves the landing by re-reading the remote after
the push, so the way it can still fire is a state set that is COMPLETE at the remote and WRONG in
content — a file that settled between writes but was semantically half-finished. The settle gate
answers "nobody wrote this for 150 ms", which is not the same claim as "this file is finished", and
nothing here closes that gap.
