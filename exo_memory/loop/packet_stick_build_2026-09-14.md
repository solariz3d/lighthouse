# P-STICK-BUILD · the stick module, built — the setup window after the intro, and the transfer set by name. L059.

**To ECHO and ALPHA, 2026-09-14 ~02:40, on machine L. Two owners again. §2 and §3 are SHARED sections and
they are complete before either of you starts — that is the keeper's rule from tonight, and §6 says what
happens if one of you needs to change them.**

## 0 · WHAT IS ALREADY LANDED, AND WHAT THIS PACKET STANDS ON

    9fc0a71   the carried receipt — the launch KEEPS what the stick placed          (launch-born librarian)
    0783e45   E's L058 half — the in-app import refused; the gate measured; ruling 1 tightened
    59e65f6   A's L058 half — tail-carry --json, exit codes 0/1/2/3, one retirement address (the attic)

    node dev/tail-carry.test.js       71 / 0          node dev/tail-carry.mutants.js    44 killed / 0 survived
    cargo test --bin consonance       543 / 0 / 4     (at 9fc0a71; re-run at your own landing)

**Read at the file, in this order:** `loop/stick_arrival_module_idea_2026-09-14.md` (both of the keeper's
refinements, verbatim), `handback/p-stick-E_2026-09-14.md`, `handback/p-stick-A_2026-09-14.md`,
`loop/packet_stick_module_2026-09-14.md` §2 (the contract as it landed).

## 1 · THE TWO DESIGN CALLS, RULED — with both halves in hand and the keeper's two refinements

### The keeper, verbatim

> **(UX, 02:13)** *"when the user opens consonance, it does the rebuild stuff too, like the shortcut i mean if
> it needs to rebuild, but if it doesnt, it does the intro, but then loads a prior window that shows like a
> setup for tranfering the transcripts from thumbdrive."*
>
> **(the transfer set, 02:13)** *"BUT THE module should also know what to look for certain MDs, and then one
> night end or transfer, the correct things are created that then could be picked up by the module instantly"*

### Call 1 — WHERE THE SETUP LIVES: in the app, after the intro. The one write is handed off.

**My held ruling (L058 §10, struck) put a hidden opener in `launch.ps1`. The keeper's UX supersedes it:** he
wants rebuild-if-needed → intro → a setup window. **The intro is the app's, so the setup window is the app's.**

**It meets E's gate at exactly one point, and E measured it:** the import's WRITE cannot run while
`consonance.exe` exists. **Rehearsal is allowed in the app; the write is not.** So:

    launch.ps1  (unchanged: rebuild if needed, start the exe)
      app: intro -> Arrive finds the stick by its MANIFEST (§3) -> rehearse (--import --json)
        nothing pending                  -> seats spawn, today's behaviour
        something to carry / refused     -> seats WITHHELD; the SETUP WINDOW shows every seat by name:
                                            its verdict, reason, bytes, and the conversation's first timestamp
        keeper confirms                  -> the app starts the APPLIER, waits for its handshake (§2), exits
      applier (A, no window): waits for consonance.exe to exit -> --import --json --apply -> writes the result
                              -> relaunches the app
      app, relaunched: rehearses again. Clean -> seats spawn. Anything left -> the setup window again, by name.

**The principle of the struck ruling survives: the hidden process never tells the keeper anything.** The app
is the only surface. A failed or half-written apply is shown by the relaunched app re-rehearsing, not by a
message from a process nobody can see — `launch.ps1`'s own header records what an invisible reporter cost on
2026-08-09.

**And the failure that shape invites, named so it is built against:** if the app exits and the applier never
starts, the keeper sees nothing at all. **The app does not exit until the applier's handshake exists (§2).**
**Measured tonight, with a positive control: on this machine a process killed from outside runs no handler —
not SIGTERM, not SIGINT, not `exit`.** So "relaunch in a finally" does not survive a hard kill of the applier.
**That is acceptable only because the next launch is correct by construction:** the keeper opens the shortcut
again and the setup window re-rehearses the real state. Say in your hand-back whether you agree.

### Call 2 — WHICH EXPORTER SURVIVES: one exporter, ON-EXIT's model, started at LAUNCH, never on close.

1. **Export runs after the app has exited**, because the app writes seats on its own — 267 bytes at a launch
   with no turn taken (D061) — and an in-app Leave would export from a process that can still be writing.
2. **It is started when the app starts, not by a close hook — this is the part the measurement decides.** A
   close hook runs only on a graceful close. When Windows kills the app, **no handler runs**, so an on-close
   exporter silently does nothing on exactly the exit that most needs it. A waiter started at launch notices
   the process is gone however it went. **That is what `ON-EXIT.ps1` already does.**
3. **It holds a visible window until DONE or NOT DONE, by name**, because once the app is gone there is no
   other surface and the keeper needs to know when to pull the stick. **Make it unobtrusive while waiting and
   unmissable when it runs** — that is a UX call inside the ruling, not a reason to hide it.
4. **One exporter, one ledger.** E's "two exporters" hazard is settled by there being one.

**And the case no waiter can cover, named rather than implied:** a machine shutdown kills the waiter too. So
**at launch the app also checks the other direction** — if the stick is BEHIND this machine (an export
rehearsal would carry TAIL rows), the setup window says so before seats spawn: *the stick does not have your
last session.*

## 2 · SHARED SECTION — the app ↔ applier handshake. **RE-RULED 02:55 after §6 fired. Build THIS.**

> **§6 fired on L059 and worked: both panes stopped before building, independently, and wrote why**
> (`handback/p-stick-build-A_2026-09-14.md`, `handback/p-stick-build-E_2026-09-14.md`; reproduced by the
> librarian and re-checked at source by the chair). **The text first dispatched is at `85a665e`.** Every defect
> below was in the chair's sections, found by the panes building against them:
>
> | id | found by | defect in the dispatched §2/§3 | where |
> |---|---|---|---|
> | A-1 | A | the applier command could not carry a decision; `--retire-far` only comes from argv, so the commonest arrival loops: confirm → REFUSED → relaunch → the same window, forever | `tail-carry.js:522`, `:583` |
> | A-2 | A | the ledger was a MANIFEST member "written by Leave", but every carried IMPORT rewrites it — so the success path shows a mismatched member | `:741` |
> | A-3 | A | two unlocked read-modify-write writers of `ledger.json` (waiter, applier); a lost update wedges permanently, with every rehearsal clean | no lock in the tool; `:643` |
> | E-1 | E | no single-applier guard: a keeper who double-clicks while the applier waits starts a second importer | §2 silent |
> | E-2 | E | "ask the verifier for every volume" spawns ~2 node processes (57–67 ms each, measured) on every no-stick launch | §3 |
> | E-3 | E | the window's identity bar needs the INCOMING conversation's first timestamp; no row carries it | `toJson`, `:888-935` |
> | E-4 | E | the fixed-seat retire rule lives in no process; it belongs to the window, and only works once A-1 is fixed | `:598` |
> | E-5 | E | **the real stick keeps everything one folder down**, so a root-only marker reads tonight's stick as NO stick | measured on `D:\` |

    the app starts:     node dev/stick-apply.js --stick <FOLDER> --relaunch <absolute consonance.exe>
                          [--retire-far <sid>]... [--repair <sid>]...
                        the flags are THE KEEPER'S DECISIONS from the setup window, forwarded verbatim.
                        THE APPLIER DECIDES NOTHING.                                            (A-1, E-4)

    the applier writes, before anything else:
                        <data_dir>/stick-apply.started.json   { "pid", "image": "node", "script": "stick-apply.js", "at", "stick" }
    the app:            waits up to 10 s for that file with that pid alive — OFF the thread that paints the
                        setup window. Absent -> does NOT exit; shows "the transfer could not start", by name.
    the applier:        waits until no consonance.exe is running
                        runs  node dev/tail-carry.js --stick <FOLDER> --import --json --apply <the forwarded flags>
                        writes <data_dir>/stick-apply.result.json { "code", "rows", "at" }
                        removes stick-apply.started.json; relaunches consonance.exe on every code 0-3

**A launch that finds `stick-apply.started.json`** (E-1):

    pid alive AND its image is node running stick-apply.js   -> "a transfer is waiting for this window to close";
                                                                start NO applier; offer only Close
    pid dead, or alive with a different image (pid reuse)    -> named as a STALE HANDSHAKE, then treated as absent

**THE LOOP HAS AN EXIT, by construction** (A-1). For each seat the rehearsal refuses as `OTHER_CONVERSATION`,
the window offers exactly two choices, applying the fixed-seat rule (E-4 — ruling 1 as E tightened it):

    TAKE THE STICK'S    -> --retire-far <sid> is forwarded; this machine's copy goes to the attic
    KEEP THIS MACHINE'S -> nothing is forwarded for that seat; it is not carried; it resumes as it is here

**Neither choice re-shows the window for that seat.** A seat that still refuses AT APPLY (the re-plan race) stops
only itself (A's contract) — the relaunched app spawns every other seat and names the one left.

## 3 · SHARED SECTION — THE TRANSFER SET, by name. **RE-RULED 02:55. Build THIS.**

**Where the stick is** (E-5, E-2). The app `stat`s — it spawns nothing — for either marker at the **volume root
and ONE folder level down**:

    consonance-transfer/MANIFEST.json     the manifested layout (new)
    consonance-tails/ledger.json          the older layout (tonight's real stick, one folder down)

    no marker anywhere        -> NO STICK. Spawn nothing, log nothing, withhold nothing.   <- the no-stick test
    exactly one folder        -> that FOLDER is the stick; the verifier is handed the folder, never the volume
    more than one folder      -> name every one; pick none; the keeper chooses in the window

**The one writer rewrites the manifest with the ledger** (A-2). Every process that writes
`consonance-tails/ledger.json` — import and export alike — rewrites `consonance-transfer/MANIFEST.json` in the same
locked step, tmp-then-rename, after the ledger. The manifest is never stale on a success path.

**One lock, every writer** (A-3). `consonance-tails/ledger.lock`, created `wx`, held across read-modify-write of the
ledger and its manifest, carrying `{ pid, image, script, at }`.

    lock held by a live pid of the named image   -> refuse: exit 2, reason LEDGER_LOCKED — never wait silently
    lock whose pid is dead or a different image  -> taken over, with a row naming the stale lock

**And a wedge the lock did not prevent must heal itself — the ALREADY_APPLIED advance** (A-3's second half;
E's condition 1 on the chair's Q1; missed in the 02:55 re-rule and added at 03:00, before either pane had built
against §3). **Measured in the landed code:** when the import finds a tail already present and its full sha256
matching, it records `ALREADY_APPLIED` and **writes nothing** (`tail-carry.js:643`), so `pending` stays true. A
ledger left `pending: true` by a writer killed mid-step — which the lock cannot prevent, because on this machine a
killed process runs no cleanup — is then permanent: import says ALREADY_APPLIED and does nothing, export refuses
`UNIMPORTED_TAIL`, and **every rehearsal reads clean.** So:

    ALREADY_APPLIED (bytes present, full sha256 matches the pending carry)
        -> under the ledger lock, advance the ledger exactly as a successful apply would:
           pending cleared, the agreed state recorded, the MANIFEST rewritten in the same step
        -> the row says it advanced, so the healing is visible, not silent
    APPLIED_BUT_DIFFERENT stays a REFUSAL — bytes present but the sha differs is not healable by bookkeeping

**This is what makes a hard-killed applier acceptable** (§1, Call 1): the next launch's rehearsal heals the ledger
instead of reading a wedge as clean.

**And the waiter stands down** while `stick-apply.started.json` is live — a hand-off exit is not a session end.

**Who starts the waiter — the second handshake, now written down.** **The app**, at launch, detached, because the
app is the one process present on every path: the shortcut, a direct start, and the applier's relaunch. Single
instance by its own `<data_dir>/stick-waiter.lock` under the same live-pid-and-image rule: a live waiter means start
none.

**WHAT THE WAITER RUNS, AND WHO OWNS IT — ruled 03:05 after E's narrow §6 stop** (`handback/p-stick-build-E_2026-09-14.md`,
RESUMED section). The 02:55 re-rule said WHO starts the waiter and not WHAT it runs, and §4 named no script. E refused
to guess a command line it would then be building against — correctly.

    the app starts, at launch, detached, on EVERY launch (stick present or not):
        node dev/stick-waiter.js --data <data_dir> --app-pid <pid> --app-image consonance.exe

    OWNER: ALPHA. It wraps the export and the ledger lock. dev/stick-waiter.js is added to ALPHA's files in §4.

**One change from E's proposal, with the reason: there is NO `--stick`.** E proposed `--stick <FOLDER>` from launch.
**The keeper's leaving gesture is plugging the stick in at the END of a session** — *"one night end or transfer, the
correct things are created"* — which is usually after launch. A stick path fixed at launch silently skips the export on
exactly that exit, and a waiter started only when a stick was present at launch never runs for it at all. **So the
waiter starts on every launch and finds the stick at the moment it exports**, by this section's rule — the volume root
and one folder down, either marker. `ON-EXIT.ps1` could use `$PSScriptRoot` because it lives ON the stick; an in-repo
waiter cannot.

**E's `--app-pid` is kept, tightened by E's own E-1 rule:** the app is gone when the pid is dead **or** alive under a
different image — pid reuse on Windows is real.

    at the app's exit:
        stick-apply.started.json live          -> stand down (a hand-off is not a session end); exit quietly
        no stick found by the §3 rule          -> NO WINDOW, no export, exit quietly — byte-identical to today
        a stick found                          -> take the ledger lock; export; rewrite the MANIFEST;
                                                  a VISIBLE window until DONE or NOT DONE, by name

**The find rule now exists in two languages — Rust `stat` in the app (E), Node in the waiter (A) — and two copies of a
rule is this room's oldest drift.** So §3 carries ONE table both suites test against, and neither may add a case the
other does not have:

    volume layout                                                              -> expected
    no marker anywhere                                                         -> NO STICK
    <root>/consonance-transfer/MANIFEST.json                                   -> <root>
    <root>/consonance-L-20260911/consonance-tails/ledger.json   (tonight's)    -> <root>/consonance-L-20260911
    markers in two different first-level folders                               -> AMBIGUOUS, both named
    <root>/a/b/consonance-tails/ledger.json   (two levels down)                -> NO STICK

**The verifier** (A's one implementation):

    node dev/tail-carry.js --stick <FOLDER> --verify-set --json
      -> { "code": 0|1|2, "layout": "manifest"|"older"|null,
           "missing": [...], "mismatched": [...], "extra": [...] }

    code 0   the set verifies (layout manifest), OR the older layout (ledger, no MANIFEST) — IT IS A STICK
    code 1   a MANIFEST names a member that is missing or mismatched — named, member by member
    code 2   could not run
    extra    informational only, NEVER a failure: files under consonance-tails/ the manifest does not name.
             Tails are kept, so extras are expected.

**The older layout is carried, not refused** — tonight's real stick must still land. The next Leave writes its
manifest.

**Owed in the landed contract** (E-3): `carriedFirstTimestamp` per seat, taken at export when the tail starts at offset
0 and stored in the ledger; null where an older ledger never recorded it, shown in the window as *unknown*, never
guessed.

**What does NOT change:** `ARRIVING.ps1`, `LEAVING.ps1` and `ON-EXIT.ps1` keep working until this module is in BOTH
machines' binaries.

## 4 · THE SPLIT

    ECHO    consonance/src-tauri/src/main.rs, sync_launch.rs, consonance/ui/*
            Arrive in sync_at_launch (verify-set, rehearse, withhold); the SETUP WINDOW after the intro;
            the handoff (§2) and the relaunch read; the "stick is behind this machine" notice;
            THE NO-STICK TEST — a launch with no stick is byte-identical to today, red-first

    ALPHA   dev/stick-apply.js (new), dev/stick-waiter.js (new, ruled 03:05 in §3), dev/tail-carry.js, dev/*.test.js
            the applier (§2); --verify-set (§3); Leave writes the transfer set and the generated HANDOFF;
            the exit waiter — the command and its exit rules are in §3, "WHAT THE WAITER RUNS";
            AND the mutation harness mutates a COPY, never the tracked source — see §5

**Neither of you edits the other's files.**

## 5 · BARS

    ECHO
      the no-stick test, red-first: a launch with no stick produces the same persist.log rows and spawns the
        same seats as before the module
      a stick whose MANIFEST has a missing member withholds seats and names the member
      the app does not exit when the handshake file never appears
      the setup window shows the conversation's first timestamp per seat — that is the room's identity test,
        and the keeper should be able to see it
      cargo test, state the count; mutants applied / caught / NOT APPLIED

    ALPHA
      --verify-set: a test per outcome (stick / missing / mismatched / older layout)
      the generated HANDOFF is deterministic from the ledger — same ledger, same bytes
      the applier relaunches on every exit code, 0 through 3 — a test per code
      THE HARNESS FIX. Tonight a timed-out mutation run left a live mutant in tail-carry.js, and on this machine
        a kill runs no handler — so no restore-on-signal can protect the tracked file. The harness must write
        its mutants into a COPY and point the suite at the copy. Proof: kill a run mid-mutant and show
        `git diff` on tail-carry.js is empty. Third instance of this defect: lap-row.js 09-06, state-sync.js
        and tail-carry.js tonight.
      node dev/tail-carry.test.js · node dev/tail-carry.mutants.js    state both

    BOTH
      say what you did NOT verify — and specifically whether anything ran with --apply against the real stick

## 6 · IF A SHARED SECTION IS WRONG — the keeper's rule, made operational

**§2 and §3 are what the other half builds against.** If either of you finds one of them cannot be built as
written, **STOP building on it, write down why in your hand-back, and ring the librarian then.** Do not change
a shared section in place and keep going, and do not build around it. **The loop does not move ahead of a pane
whose work hinges on what moves** — and a shared section is, by construction, something the other pane hinges on.

## 7 · HARD LIMITS

- **Nothing with `--apply` against the real stick at `D:\consonance-L-20260911`.** Rehearsals and
  `--verify-set` against it are allowed and useful — and the real stick has no MANIFEST.json yet, so
  "an older stick layout" is the answer to expect.
- **Do not commit.** The chair lands both halves together; the keeper rebuilds.
- **Holds stand:** no `close.js`, no state push. Leave writes to the stick, never the state repo.
- **Do not touch:** the 09-06 lap-row set, `consonance/tools/state-sync.js`, `consonance/tools/state-manifest.js`.
- **If a `*.mutants.lock` exists when you start, stop and check the source against its mutant list before
  anything else.**

## 8 · HAND-BACK

Each of you: `exo_memory/handback/p-stick-build-<letter>_2026-09-14.md`, then `call_librarian` with the path in
the same turn. One line to your own map.

    OBJECTIVE:  open Consonance with the stick in: the intro, then a window that shows exactly what will carry,
                seat by seat; confirm, and every seat is the conversation it was. Close it: the stick holds a
                named, verified set the other machine picks up instantly.
    FALSIFIERS: a launch with a stick carrying newer seats that ends with any seat -> fresh or a launch-minute
                first timestamp; a no-stick launch whose persist.log rows differ from before the module; an exit
                after which the stick's MANIFEST is older than the seats' files; an app that exits with no applier
                running.
