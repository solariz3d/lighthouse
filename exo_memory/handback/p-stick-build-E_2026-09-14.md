# P-STICK-BUILD (L059) · ECHO — §6 STOP, seconded and widened from the app side. Nothing built.

**Pane E, machine L, 2026-09-14 ~03:0x.** My half hinges on §2 and §3, and both are stopped. I re-ran A's
three defects myself rather than relaying them, and they reproduce. From the app side I add **one more §3
defect (measured against the real stick)** and **three app-side gaps**, so a re-rule can close them in one
pass. The chair's two questions are answered in §5.

Nothing committed. **No code changed.** Nothing with `--apply` against the real stick; nothing touched it except
four `stat`s (§3). No `close.js`, no state push, no edit to A's files or the shared sections. No
`*.mutants.lock` present at start.

---

## 1 · A's THREE DEFECTS, REPRODUCED — not relayed

I read both of A's audit scripts before running them. They use `mkdtemp` fixtures only, with the projects
root and `appRunning` injected, so neither touches the real stick or `~/.claude`. I ran them against a
clean `dev/tail-carry.js` (`git diff --stat` empty):

    node …\6fe15f0a-…\scratchpad\shared_audit.js
      §3  import outcome: CARRIED | ledger sha at export 57ae6e1ab1c8 | after import 79499f31abe3 | CHANGED
      §2  rehearsal: REFUSED OTHER_CONVERSATION retirable=true kind=pane
      §2  applier as written (--import --json --apply): REFUSED | code 1 | written: false
      §2  relaunch re-rehearsal: REFUSED OTHER_CONVERSATION — the setup window shows the same seat again
      §2  with --retire-far named: RETIRE_THEN_FULL | code 0 | carried: true
    node …\6fe15f0a-…\scratchpad\race_audit.js
      waiter plans: a=REFUSED b=TAIL
      applier: a ok=true | ledger X pending after import: false
      after the waiter writes: X pending = true (the import cleared it; the waiter restored it)
      L re-rehearses import of X: ALREADY_APPLIED | L exports X: REFUSED UNIMPORTED_TAIL

The shas differ from A's because the fixtures are fresh. **The property is identical: all three defects hold.**

---

## 2 · WHAT MY HALF HINGES ON — why I stop too

    Arrive's "is this the stick"         §3 --verify-set          stopped (defect 2, and E-5 below)
    the no-stick test                    §3's definition          stopped — it pins "no stick", which §3 defines
    the setup window's CONFIRM           §2 handshake             stopped (defect 1: confirm cannot reach the applier)
    the app ↔ applier wait/relaunch      §2                       stopped (defect 3; E-1 below)
    the "stick is behind" notice         landed export --json     reached only through the §3 detection

**Nothing in §4's list stands free of §2 or §3,** so under §6 I build none of it. The one thing that
looked free was the per-seat first timestamp in the window. It is not quite free (E-3), but it is a gap
in the LANDED L058 contract, not a shared section of this packet.

---

## 3 · E-5 — §3's definition does not find the real stick (measured)

§3: *"A volume IS the stick ⇔ `consonance-transfer/MANIFEST.json` exists …"* and *"the app enumerates
volumes and asks the verifier."* That puts the marker at the volume **root**. **The real stick keeps
everything one folder down:**

    absent   D:\consonance-tails\ledger.json
    absent   D:\consonance-transfer\MANIFEST.json
    EXISTS   D:\consonance-L-20260911\consonance-tails\ledger.json
    absent   D:\consonance-L-20260911\consonance-transfer\MANIFEST.json

Every `--stick <path>` tonight named `D:\consonance-L-20260911`, not `D:\`. Built as written, a root-only
search reads the real stick as **no stick at all** — not even *"an older stick layout"* — and the launch
proceeds as if nothing were plugged in. That is falsifier 1's shape reached by a definition. **The re-rule has to
fix the depth:** root only (and Leave writes there), or root plus one folder level (and the verifier is
handed the folder). **The no-stick test pins whichever is chosen**, which is the second reason it cannot
be written first.

The answer the chair expected against the real stick, *"an older stick layout"*, cannot be asked yet:
`--verify-set` does not exist. **By `stat`, one folder down, it is the older layout:** a ledger and no MANIFEST.

---

## 4 · APP-SIDE GAPS FOR THE SAME RE-RULE

### E-1 · §2 has no single-applier guard, so the keeper's most natural move starts a second importer

§2 says what the relaunched app does with `stick-apply.result.json`. **It says nothing about a launch that
finds `stick-apply.started.json` with a live pid.** That launch is the likely one: the keeper confirms, the
window vanishes, nothing comes back while the applier waits, and the keeper double-clicks the shortcut. The
old app has exited, so both the single-instance mutex and `launch.ps1` let the new one start. Then:

- per §2 the applier waits *"until no consonance.exe is running"*, so it now waits **behind the keeper's new
  window, invisibly** — the invisible reporter §1 says the design must never have;
- the new app re-rehearses, sees the same pending seats (nothing applied yet), and **if the keeper confirms
  again, a second applier starts**. When the window closes, two importers write one ledger and the same
  transcripts, with no lock (defect 3a).

**Needed:** a launch that finds `started.json` with a live pid **whose image is the applier's** (pid reuse
on Windows is real) says in the setup window *"a transfer is waiting for this window to close"*, starts no
applier, and offers only to close. A `started.json` with a dead pid is **named as a stale handshake** and then
treated as absent. **Spec-derived, not measured — no applier exists to run it against.**

### E-2 · "the app enumerates volumes and asks the verifier" makes every no-stick launch spawn processes

On L, `Get-PSDrive -PSProvider FileSystem` → `C:\`, `D:\`. `node -e 0`, five runs: **60, 67, 62, 63, 57 ms.**
Asking the verifier for every volume costs about 125 ms and two node processes on every launch, stick or no
stick. §5's bar counts persist.log rows and seats, so it would pass while the launch is no longer what it
was today. **Proposed for the re-rule:** the app `stat`s for either marker (the MANIFEST, or a ledger for
the older layout, at whatever depth E-5 settles) and calls the verifier only for a volume that has one.
The one verifier stays A's; a no-stick launch then spawns **nothing**, which is what "byte-identical to
today" should mean in behaviour, not only in log rows.

### E-3 · the window's identity bar needs the CARRIED conversation's first timestamp, and no row has it

The landed contract (`toJson`, `tail-carry.js:888-935`) carries `localFirstTimestamp`: this machine's
conversation's first record. **It has no first timestamp for the conversation the stick would put in the seat.**
- On a `FULL` import (no local file) the window has nothing to show: `localFirstTimestamp` is null.
- On `OTHER_CONVERSATION`, the window can show the conversation being retired but **not the one replacing
  it**, which is the only comparison that lets the keeper see *which conversation is the lineage*.

The ledger stores `key`, a hash, not the timestamp. **Owed to A in the landed contract, not a §6 stop:**
a `carriedFirstTimestamp`, taken at export when the tail starts at offset 0.

### E-4 · Ruling 1 lives in no process yet, and it belongs to the window

`retirable` (`tail-carry.js:598`) is `pend.offset === 0`: whether `--retire-far` *could* take the seat,
not whether it *should*. The fixed-seat conditions (birth from `dest`, born after `exportedAt`, a launch
minute on this machine's own clock) are the window's to apply. That is correct — one surface decides — and
**it only works once defect 1's fix carries the decision through the handshake.** Condition (c) needs this
machine's `persist.log` launch minutes, which the app has natively.

---

## 5 · THE CHAIR'S TWO QUESTIONS

### Q1 · "The app must not exit until the handshake exists" — and is a hard-killed applier acceptable because the next launch re-rehearses?

**On the handshake wait: agree.** One build note: the 10 s wait must not run on the thread that paints the
setup window, or the window freezes on the one screen where the keeper is waiting to see what happens.

**On the hard kill: I agree only with three conditions, and without the first, no.**
1. **Defect 3's lock and the `ALREADY_APPLIED` advance (A's).** A lost ledger update re-rehearses as
   *clean*, so "the next launch shows the real state" is false for exactly that state. This is A's
   position, and my run of `race_audit.js` confirms it.
2. **A stale `started.json` is treated as absent once named (E-1).** Otherwise a killed applier leaves every
   later launch saying *"a transfer is waiting"* forever — a wedge on the app side, the mirror of defect 3's.
3. **Stated rather than implied:** an applier killed after the app exited leaves the keeper with no window
   at all. I accept that — nothing claimed success, and Consonance not coming back is itself the signal —
   but it holds only because the keeper reopens the shortcut. Nothing reopens it for them.

### Q2 · The no-stick test, red-first

**Not written, because what it pins is what §3 is being re-ruled on:** the marker, and after E-5 its
depth. The test is ready to write the moment §3 lands:

    GIVEN  a volume list where no volume holds either marker at the ruled depth
    THEN   the Arrive hook spawns no process, writes no persist.log row, and withholds no seat
    RED    against a version that asks the verifier for every volume (E-2) — that version passes the rows
           bar and fails this one, which is the point of the test

---

## 6 · WHAT I DID NOT VERIFY

- **Nothing built, so nothing of §4 is verified.** `cargo test` was not run: no Rust changed.
- **E-1 is reasoned from §2's text,** not measured; there is no applier to race.
- **Whether `consonance.exe` is in a job object** is A's measurement (not in one, on L), not repeated by me.
  Not checked on D.
- **Nothing on D.** The volume list and the spawn cost are L's.
- **A's `--verify-set` does not exist,** so "an older stick layout" was read by `stat`, not asked of the verifier.
- **Real stick:** four `stat`s, no read of contents this lap, **no `--apply`.**

---

## 7 · FALSIFIERS FOR THE RE-RULE

- **E-5:** a launch with the real stick plugged in whose Arrive reports *no stick*. Checkable today, by
  reading the rule against `D:\consonance-L-20260911`.
- **E-1:** two `stick-apply.started.json` writers in one arrival, or an applier alive while a Consonance
  window it did not launch is open.
- **E-2:** a no-stick launch that starts any `node` process. Checkable with a process list at launch.
- **E-3:** a setup window row for a `FULL` import showing no first timestamp for the incoming conversation.

---

# RESUMED against the re-rule at 60e1ccf / b258fc2 — §6 ring on ONE piece, filed before building the rest

**The waiter's command is still unwritten.** §3 now says **who** starts the exit waiter — *"The app, at launch,
detached … single instance by its own `<data_dir>/stick-waiter.lock`"* — but not **what it runs**: no script
name, no arguments, no stick path or data dir passed. A raised exactly this at L059 stop (`handback/p-stick-build-A`,
defect 3, *"who starts the waiter, and with what command"*). The re-rule answered the first half. `dev/` holds
only `ON-EXIT.ps1`, which is a stick script that the §3 "what does NOT change" clause keeps running, not the
in-repo waiter.

**So per §6 I do not build the waiter start** — a guessed command line is a shared section written by the
pane that hinges on it. **Nothing else in my half hinges on it**, so I build the rest now. Proposed, for the
chair to rule rather than for me to assume:

    node dev/stick-waiter.js --stick <FOLDER> --data <data_dir> --app-pid <pid>

The app pid is included because the waiter's job is "notice the app is gone, however it went", and a pid is
exact where an image name is not: two images, or a relaunch mid-wait. A decides; the app starts whatever is ruled.

*(The build report is appended below when done.)*

---

## §6 RING, SECOND AND NARROWER — the 03:05 waiter ruling contradicts the no-stick bar in the same section

**Filed at ~03:25, before finishing the rest of the build. Nothing of the waiter start is built.**

`11d9eb5` §3: *"the app starts, at launch, detached, on **EVERY** launch (stick present or not):
`node dev/stick-waiter.js --data <data_dir> --app-pid <pid> --app-image consonance.exe`"*.

Against that, still live in the same packet and in the 02:55 RESUME message: E-2 adopted — *"the app stats for
markers and **spawns nothing on a no-stick launch**, so your red-first test can pin exactly that — **no process**,
no persist.log row, no withheld seat"* — and §5's bar and the idea file's falsifier: *a launch with no stick is
**byte-identical to today***. A node waiter that lives for the whole session on every launch is a process on a
no-stick launch. **Both cannot be built.** The 03:05 reason is sound (the keeper plugs the stick in at the END, so a
waiter keyed to launch would miss it) — which is exactly why it is a ruling to make, not a side for me to pick.

**Two readings, for the chair — I build neither until one is chosen:**

    (i)  "no process" meant the STICK LOOK (E-2's cost was a verifier per volume per launch). The waiter is one
         fixed, ruled process per launch, and the no-stick bar is restated as: no row, no withheld seat, and no
         process except the one waiter.
    (ii) "byte-identical to today" is the keeper's falsifier and stands. The waiter starts only when a stick is
         mounted — which needs the app to notice a stick arriving mid-session (a volume-arrival watch), and the
         03:05 objection returns in a smaller form.

**And a fact the chair should have before ruling:** `dev/stick-waiter.js` as it stands in A's working copy
parses only `--stick` (`:129`; any other argument -> `unknown argument`, exit 2). Started with the ruled argv today,
it would exit 2 on every launch. Likely A has not reached the 03:05 change yet — A's to say, not mine to fix.

**What IS built, unaffected by either reading:** the no-stick test pins no row, no withheld seat, and **no process
started by the launch's look at the stick** — true under (i) and (ii) alike.

**One gap in the shared find table, not a stop:** the table has no row for a marker at the volume root AND another
in a first-level folder of the same volume. The Rust finder names both (AMBIGUOUS). If A's Node finder decides it
differently, the two copies drift on exactly the case nobody wrote down. Proposed row: `-> AMBIGUOUS, both named`.

---

# BUILD REPORT — the app side, built against §2/§3 at 60e1ccf · b258fc2 · 11d9eb5 · ddf5a76

**Built. Nothing committed. Nothing ran with `--apply` against the real stick.** Against it I ran only
`stat`s, one `--verify-set` and one import rehearsal, and it was byte-identical afterwards (§5).

    consonance/src-tauri/src/sync_launch.rs   +901       the pure core + 40 tests (mod stick_tests)
    consonance/src-tauri/src/main.rs          +567 −34   the launch hold, the waiter start, 6 commands + 5 wiring tests
    consonance/ui/stick.js                    new, 204   the setup window
    consonance/ui/stick.test.js               new, 154   the window, run for real in a vm (8 tests)
    consonance/ui/index.html · app.css        +8 · +17   the overlay beneath the intro, its script tag, its styles

## 1 · WHAT RUNS WHERE

    LAUNCH (.setup, sync_at_launch)       stats only: sysinfo's volume list (FindFirstVolumeW, FIXED|REMOVABLE),
                                          each root + ONE folder down for either marker; the handshake file; the
                                          result file. On a no-stick launch: no process, no file, no row.
                                          Anything to show -> SEATS_WITHHELD, and retire+adopt are HELD (§1.1)
    LAUNCH, every time                    start_exit_waiter(): node dev/stick-waiter.js --data <dir> --app-pid <pid>
                                          --app-image consonance.exe · DETACHED · CONSONANCE_DATA=<dir> · no row
    SETUP WINDOW (stick.js, after intro)  stick_state -> stick_rehearse (--verify-set, --import, --export, all
                                          --json, off the paint thread) -> a table of seats + choices
      Carry                               stick_start_applier: --retire-far/--repair forwarded verbatim; waits
                                          100 × 100 ms for THIS child's handshake; app.exit ONLY on Started
      Continue without carrying           stick_release: records the KEEPs, runs the held retire+adopt, releases
      a live applier found                Close only (stick_close_app) — no rehearsal, no second applier
      a quiet rehearsal                   releases on its own; the window never stays up with nothing to show

### 1.1 · A decision of mine for the chair: when the stick holds the seats, the retire and adopt are held too

Arrive runs before seats spawn, but the import now happens in an applier **after** this process exits. A
MIGRATE launch that retired fixed-seat transcripts before that import would move away the very file a carried
delta appends to — the 00:37:55 failure, in the other order. So `launch_effects` (the retire and the adopt,
lifted out of `sync_at_launch` **unchanged**) waits whenever the stick holds the seats:

    no stick found                 launch_effects runs where it always did — the no-stick path is unchanged
    the stick holds the seats      "SYNC AT LAUNCH effects HELD for the stick"; nothing is retired yet
    Continue without carrying      the held effects run then (stick_release)
    Carry                          the app exits; the relaunched app decides again, WITH the receipt

**What this changes:** on a launch where the stick holds the seats, a MIGRATE retire happens at release or on the
relaunch, not at the launch minute. Pinned by `the_launch_effects_run_only_when_the_stick_does_not_hold_the_seats`
(mutants M12, M13).

## 2 · THE NO-STICK BAR, RESTATED (ddf5a76) — pinned row by row

    the look          spawns nothing    the_launch_look_at_the_stick_starts_no_process                RED-3
                      logs nothing      a_launch_with_no_stick_writes_no_row_and_withholds_no_seat    RED-1
                      withholds none    (same test)                                                   RED-2
                      writes no file    a_launch_with_no_stick_writes_no_file                         F1
    the one spawn     the waiter, every launch, unconditionally, no row
                                        the_exit_waiter_is_started_on_every_launch_and_logs_only…     W1 · W3
    its argv          --data --app-pid --app-image, no --stick
                                        the_waiter_is_told_the_data_dir_the_app_pid_and_…             W2 · W4
    the one file      stick-waiter.lock — the waiter writes it (A); the look adds none (F1)
    persist.log       the same rows — the look writes none, the waiter start writes none

**Red-first, and the order stated plainly.** HEAD has no Arrive, so the no-stick tests are only compile-red at
HEAD. The red that means something was shown against **the three wrong versions §5 names** — one that logs, one
that withholds, one that spawns (RED-1..3). Each was applied to a scratch copy of the crate, and each went red on
its own test. I wrote the implementation first; claiming the tests came first would not be true.

## 3 · §3's FIND TABLE — six rows, six tests, nothing added

    no marker anywhere                                -> NO STICK      a_launch_with_no_stick_writes_no_row_…
    <root>/consonance-transfer/MANIFEST.json          -> <root>        a_manifest_at_the_volume_root_…
    <root>/consonance-L-20260911/…/ledger.json        -> that folder   the_real_sticks_shape_is_found_one_folder_down…
    two different first-level folders                 -> AMBIGUOUS     two_stick_folders_are_both_named_…
    <root>/a/b/…/ledger.json                          -> NO STICK      a_marker_two_folders_down_is_not_found
    <root> AND a first-level folder (ddf5a76)         -> AMBIGUOUS     a_marker_at_the_root_and_another_one_folder_down…

**Removed from my own suite, to honour "neither may add a case":** *a folder with both markers reads as the
manifested layout* and *a volume root that does not exist is skipped*. Neither is in the table. The layout my
`stat` tags is a log hint only; the window shows the verifier's `layout`, which is A's.

## 4 · THE BARS

    cargo test --bin consonance -- --test-threads=1     588 passed · 0 failed · 4 ignored
                                                         (543 at 9fc0a71, + 40 stick + 5 wiring)
    node ui/stick.test.js                                8 / 0
    ui suites                                            scripts-load 4 · chain-indicator 93 · gate-card-routing 12
                                                         · librarian-wiring 11 · third-place-wiring 10 · 0 failed

    MUTANTS — every one in a SCRATCH COPY of the crate and the UI, never the tracked source; a baseline run of the
    unmutated copy first (2 copy-only failures, both repo-path tests, subtracted); the tracked files hashed
    before and after every run
      run 1   21 applied · 21 caught    RED-1..3, M4–M15, U1–U6
      run 2    5 applied ·  5 caught    W1–W4, T1
      run 3    1 applied ·  1 caught    F1
      total   27 applied · 27 caught · 0 survived · 0 NOT APPLIED
      controls: every SURVIVE-CONTROL survived (4), every SKIP-CONTROL NOT APPLIED (3);
                "tracked source untouched: true" on all three runs

**Three mutants worth naming for what they would have shipped:**
- **M4**, a root-only look (E-5 reintroduced), caught by the real stick's shape.
- **M8**, an app that exits on a handshake timeout, caught by the one-exit wiring test.
- **U6**, a confirm that sends `retireFar`, caught by the argument-keys assertion. This one is real: Tauri 2 expects
  camelCase unless told otherwise, which is why `stick_start_applier` carries `rename_all = "snake_case"`.

## 5 · MEASURED THIS LAP (on L, not D)

    the real volumes, through the app's own code    ROOTS ["C:\\","D:\\"]
                                                    FOUND One(D:\consonance-L-20260911, Older)
    A's verifier, through run_carry_json            --verify-set -> code 0, layout older
    the import rehearsal, through run_carry_json    code 0, 7 rows
    stick + receipt, before vs after                IDENTICAL, 32 entries
    launch-born latency (the E-4 window)            the real librarian began 18.7 s after launch row 1789367339
    node on PATH                                    C:\Program Files\nodejs\node.exe — not a shim; child pid == pid seen
    data dir, both sides                            the app and A's resolver both give C:\Consonance\data
    D059/P1c's confirm window, live                 "confirm held after=1002–1003ms window=1000ms" in tonight's rows

The verifier and the rehearsal ran against **A's in-flight working copy**, while A's mutation lock was held: the
tracked `tail-carry.js` was A's edit, and A's mutants were in `.tail-carry.mutant-*.js` copies. That is evidence
that my finder and my parsing are right. It does not certify A's tool. The one-off probe that ran them was a
temporary `#[ignore]` test, removed after the run (`grep -c l059_real_stick_probe main.rs` → 0).

## 6 · THE CHAIR'S Q1 CONDITIONS — which ones this half builds

    E-1: a stale handshake is named, then treated as absent     BUILT   read_handshake; the launch removes it after naming
    the 10 s wait runs off the paint thread                     BUILT   async command + spawn_blocking
    only THIS child's handshake counts                          BUILT   await_handshake (another pid -> TimedOut)
    A-3: the ledger lock + the ALREADY_APPLIED advance          A's     not verified by me

## 7 · WHAT I DID NOT VERIFY

- **Nothing ran inside the app.** No launch, and no window rendered in WebView2. `stick.test.js` runs the real
  script against a stub DOM, so layout, focus and the intro-to-window reveal are unverified.
- **No end-to-end transfer.** A's applier and waiter were still changing. At my last read `stick-waiter.js` parsed
  only `--stick`, so the ruled argv exits 2 on every launch until A's change lands (A has been told, per the chair).
- **The waiter's visible export window.** `DETACHED_PROCESS` deliberately gives the waiter no console, so it must
  open its own window at export time. Whether A's does is A's.
- **sysinfo on a card reader with no media.** Enumeration calls `GetDiskFreeSpaceExW`, and a removable drive with no
  medium can raise a Windows "no disk" dialog. Not measured; L has only C: and D:.
- **Anything on D:** the volume list, the node path, the data-dir config, the clock.
- **`resume_pane` writes a `CLAUDE.md` before a withheld spawn refuses.** That path predates this module and does no
  harm (it writes the intake), but a launch with the stick in now takes it every time.
- **A state-sync `--install` writing the data dir while an applier waits.** As I read it, the install writes only
  files from the state tree, never the `stick-apply.*` handshake files. Not exercised.
- **A held MIGRATE retire released by "Continue without carrying"** runs the same retire as before, only later.
  Whether that is still right for seats the keeper chose to KEEP belongs to the receipt, and is not tested.
- **A renamed exe.** `--app-image` is the ruled literal `consonance.exe`, so a build under another name would look
  like "the app is gone" to the waiter.

## 8 · CORRECTIONS TO MYSELF THIS LAP

- A comment I wrote claimed a misspelt Tauri argument "arrives as an empty list". I had not checked it: a missing
  `Vec` key is a deserialization error. The comment was corrected before any test ran.
- Three shell and JavaScript quoting failures in my patch and report scripts. Each failed before running and
  wrote nothing; I confirmed that each time before retrying through the file tool.
- My first finder tests carried two cases the shared table does not have. Both were removed (§3).
- "A six-case table": at 11d9eb5 the table had five rows while the chair's ring said six. The sixth row landed at
  ddf5a76, so both were true at their own commit, and my tests mirror all six.
- And the one a second vantage caught before this lap (§8 of my L058 hand-back): L052's `live-host.js` was +226
  lines, not +220.

---

# §9 R-2 — THE LEAK, fixed; and the image check it sat on was looser than it read

**The red, reproduced before touching anything.** `node consonance/tools/gen-consumer.js --out <scratch>` →
`LEAKS THAT SURVIVED — MACHINE (1) consonance/src-tauri/src/sync_launch.rs:1981` — my `applier()` test fixture,
carrying `C:\\Consonance\\lighthouse\\dev\\stick-apply.js`. The scan's patterns (`gen-consumer.js:944-955`) key on
the private tree's path, `C:\Consonance\lighthouse`, in any separator form.

## What changed (sync_launch.rs, my file only)

    the fixture        "C:\\Consonance\\lighthouse\\dev\\stick-apply.js"  ->  "dev\\stick-apply.js"
                       machine-neutral, and a BACKSLASH kept on purpose (below)
    is_applier         .ends_with("stick-apply.js")  ->  .rsplit('/').next() == Some("stick-apply.js")
                       after the existing '\\' -> '/' normalization
    two tests added    a_node_process_running_a_lookalike_script_name_is_stale
                       a_process_that_is_not_node_is_stale_even_when_it_names_the_applier_script

**Why the check changed, not only the fixture.** Moving the fixture off this machine's path exposed two problems.
First, `ends_with("stick-apply.js")` also accepts `not-stick-apply.js`. Second, it made the separator normalization
beside it decorative: a bare suffix matches with or without it, so no fixture, the old one included, could ever
tell whether the normalization was there. With the name compared exactly after splitting on `/`, the backslash
fixture reads as the applier **only if** the normalization runs, so the fixture now discriminates something real.

**And the image half had never been tested on its own.** Every stale case also failed the script check — the
pid-reuse fixture is `chrome.exe` with no script argument — so deleting the node-image condition would have left
every test green. The added test holds the script name exactly right and makes only the image wrong (an editor
with the file open).

**Red first, shown.** The lookalike test was added before the fix and run against the shipped check:

    sync_launch::stick_tests::a_node_process_running_a_lookalike_script_name_is_stale ... FAILED
      "a lookalike script name reads as the applier"

## The bars

    gen-consumer.js --out <scratch>                LEAKS THAT SURVIVED: 0
                                                   (it still REFUSES, for one reason only: 23 uncommitted changes
                                                    in the tree — landing is the chair's; not a leak)
    gen-consumer.js --out <scratch> --allow-dirty  LEAKS THAT SURVIVED: 0 · wrote the scratch tree
                                                   (re-run after the last test was added — the final source)
    node consonance/tools/gen-consumer.test.js                  59 tests · 59 pass · 0 fail
    node consonance/tools/gen-consumer.fixture-scope.test.js     7 tests ·  7 pass · 0 fail
    cargo test --bin consonance -- --test-threads=1             590 passed · 0 failed · 4 ignored
                                                                (588 + the two tests above)
    grep "Consonance.{1,4}lighthouse" sync_launch.rs ui/stick.js ui/stick.test.js      no hits

    MUTANTS (run 4) — a scratch copy of the crate, a baseline of the unmutated copy first, tracked files hashed
      N1  the name check back to a suffix             CAUGHT  a_node_process_running_a_lookalike_script_name_is_stale
      N2  the separator normalization removed          CAUGHT  a_live_applier_is_live_and_withholds_the_seats
                                                                the_handshake_of_this_child_is_started
      N3  the image half removed                       CAUGHT  a_process_that_is_not_node_is_stale_even_when_it_names…
      N4  this machine's path put back in the fixture  SURVIVED cargo — as designed: that failure belongs to the
                                                               consumer scan, which is the instrument that caught
                                                               the original (the reproduced red above)
      SKIP-CONTROL                                     NOT APPLIED
      controls behaved: true · tracked source untouched: true · mutants not caught: none

    ALL RUNS THIS LAP: 30 mutants applied, 30 caught, 0 NOT APPLIED; every control behaved.

## R-1

§1.1 is ratified. Nothing to build; recorded here so the hand-back and the ruling agree.

## Not verified

- **The scan was run only against the dirty tree** (`--allow-dirty`). The plain run's one refusal is the tree's
  uncommitted state, which the chair's landing removes. A clean-tree scan belongs to the landing.
- **Nothing else in `gen-consumer`'s output was changed or ruled on by me.** It still reports shipped files that
  name a withheld one ("REPORTED, NOT REFUSED"). Those belong to other owners.
