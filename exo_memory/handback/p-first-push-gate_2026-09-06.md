# P3 · THE FIRST-PUSH GATE — hand-back

*Pane E, L037, 2026-09-06. Packet: `loop/packet_first_push_gate_2026-09-06.md` (`5a83d4a`). Map:
`librarian/2026-09-06.md` §"L037 MAP" (`f3c4e93`), read at the file. Every figure below is printed
beside the command that produced it. Nothing committed; paths named in §9.*

---

## 0 · THE PACKET'S PREMISE IS REFUTED, AND THE DEFECT IS ONE LAYER UP

The packet says the current gate uses `cargo check` as its oracle. **There is no current gate.**
`gen-consumer.build.test.js` has never existed in this repository.

    $ git log --all --pretty=format: --name-only --diff-filter=A | sort -u | grep -i build.test
      consonance/tools/open-items-build.test.js          <- unrelated, the brief-drift item
    $ find /c/Consonance -name 'gen-consumer.build.test.js' -not -path '*/target/*'
      (nothing)
    $ git check-ignore -v consonance/tools/gen-consumer.build.test.js
      (not ignored)

Added on no branch, on no machine's disk under `C:/Consonance`, not gitignored. **Five documents
cite it as a running gate**, and I read all five at the file:

    consonance/tools/gen-consumer.js:70          "Partly closed 2026-08-23 by gen-consumer.build.test.js,
                                                  which generates a tree and runs cargo check against it"
    loop/consumer_parity_2026-09-04.md:196       "cargo check is the command in A's ruling and in
                                                  gen-consumer.build.test.js"
    handback/p-consumer-reg-attack_2026-09-03.md:125   quotes the generator header and reasons from it
    map/J.md:31, :135                            "gen-consumer.build.test.js runs cargo check, which..."
    loop/packet_first_push_gate_2026-09-06.md:16 the packet I was given

**The `cargo check` runs were real; the test was not.** The 2026-08-23 run that found `build.rs`,
`Cargo.lock`, `capabilities/` and `icons/` missing from the manifest happened — by hand. What was
written afterwards was a sentence saying a test had been built. And `gen-consumer.test.js`'s own
header says the opposite in plain words, unread for two weeks:

> *"Everything below is fast except the thing that actually found the bugs, which was running
> `cargo check` against a generated tree. That took minutes and is not suite-shaped. So the
> structural equivalent lives here."*

Its author deliberately shipped a static resource-declaration check **instead of** a build gate and
said so. One header recorded the intention, the other recorded it as done, and four documents then
cited the second. **So the room has not been running a weak gate over the consumer tree. It has been
running no gate, while four documents reasoned from a description of one.**

That outranks the finding the packet sent me for, on this room's own precedent: the 2026-08-17
retired metaphor and the 2026-08-23 withdrawn "decorrelated reader" are the same class — *the
correction existed, was unambiguous, and did not propagate*. This is that class with the sign
flipped: **a claim that was never true propagated into four documents and a packet.** The packet's
own sharper sentence still holds, and now applies to a file that exists.

**What this does NOT change:** the packet's instruction. A gate was needed either way. It is below.

---

## 1 · WHAT WAS BUILT

`consonance/tools/gen-consumer.build.test.js`, new, ~690 lines.

**The oracle is `cargo build` + a LAUNCH PROBE.** Four verdicts, never a boolean:

    LAUNCHED      alive, owning a VISIBLE top-level window whose CLASS and TITLE both match
    DIED          exited before the deadline — exit code reported; exit 0 is still DIED
    NO_WINDOW     alive at the deadline, owning no top-level window at all
    WRONG_WINDOW  alive, owning windows, none of them the app's. Every window seen is printed.

**Two tiers.** The default run opens no window and launches no binary (see §5 — the keeper's
instruction). `--gate` generates, builds, probes, and writes the status document.

---

## 2 · BAR 4, THE LOAD-BEARING ONE: HOW THE PROBE TELLS "launched" FROM "started and died"

Three measured ways to report a launch that did not happen. **All three are live on this laptop
today**, and the first is the one the packet could not have predicted.

### (a) The process is alive, owns a visible window, and the app REFUSED TO START

`main.rs:4458` `claim_single_instance()` takes the named mutex `Local\ConsonanceSingleInstance`. A
second instance calls `warn_second_instance()` (`main.rs:4498`), which puts up a **`MessageBoxW` and
blocks in it**. Measured, with Consonance running:

    $ [System.Threading.Mutex]::OpenExisting("Local\ConsonanceSingleInstance")
      OPENED - the singleton IS held
    $ EnumWindows over the MessageBox process's pid
      133602 | visible | #32770 | "Consonance - already running"

**A probe asking "is it alive?" says yes. A probe asking "does it own a visible top-level window?"
also says yes.** Both report LAUNCHED for an app that declined to start — and the title carries the
app's name, so title-matching alone does not save you either.

This is not an edge case. **It is the guaranteed outcome on every machine a seat works from**,
because the seat is a pane inside the running app. That is why the gate's answer here is BLOCKED
(§4), not green and not red.

**The discriminator is the window CLASS, measured from the live app rather than assumed:**

    $ Get-Process consonance -> hwnd 328816
      class [Tauri Window]  visible True  title [Consonance]
      (also: [Tao Thread Event Target], visible, empty title — a title-blind probe accepts this too)

So: class `^Tauri Window$` **and** title `^Consonance$`. The class is matched because the title is
not enough; the title is matched because the class is not enough. A tao/wry rename turns the gate
red with the observed class printed beside the expected one — loud, never silent.

### (b) `MainWindowHandle` is a .NET heuristic and it missed a real window

A control process with a genuine visible top-level WinForms window reported `MainWindowHandle = 0`
for ten seconds across `Refresh()` calls, while `EnumWindows` + `GetWindowThreadProcessId` found the
window in the first poll. **A probe built on `MainWindowHandle` would report NO_WINDOW for a
launched app.** The probe uses the Win32 primitives.

That same measurement also showed the control owning a visible `PseudoConsoleWindow` — so "owns a
visible top-level window" would pass a *console* process too.

### (c) The binary probed can belong to a different tree

    $ echo $CARGO_TARGET_DIR                     -> C:\build\lighthouse-target
    $ stat C:/build/lighthouse-target/debug/consonance.exe
      2026-09-02 05:47:41   23,789,568 bytes     <- built from the SOURCE tree, four days ago

A gate that runs `cargo build` inside a generated tree and then launches "the" binary probes **the
private tree's four-day-old executable and calls the generated tree green.** `freshExeProblem()`
refuses a binary that is not under the run's own target dir, or that predates the run.

---

## 3 · RED FIRST — the oracle has been SEEN to fail, on each half

| what it must catch | how it was shown failing | result |
|---|---|---|
| a tree that compiles and does not link | crate with one undefined `extern "C"` symbol | `cargo check` **0**, `cargo build` **101** (LNK2019) |
| a process that starts and exits 0 | `node -e "process.exit(0)"` | **DIED**, exitCode 0 |
| a process alive with no app window | `node -e "setTimeout(...,60000)"` | **NO_WINDOW** — and explicitly not DIED |
| a visible window that is not the app | an off-screen `#32770` titled "Consonance - already running" | **WRONG_WINDOW** |
| the probe can say yes at all | a real off-screen WinForms window | **LAUNCHED**, naming what it matched |
| a stale/foreign binary | fixture exe outside the target dir, and one older than the run | refused, both |

The positive controls are not decoration: without them every row above is satisfied by a probe that
refuses everything. That is js-suite's own E-2 lesson, and §7 records me breaking it anyway.

**What I could NOT construct:** a full generated Tauri tree that compiles and fails to launch. The
red-first case is built at the **executable** level (a binary that starts and does not show the
window) and at the **tree** level for the build half (a crate that checks green and builds red), not
at the tree level for the launch half. Stated because the packet asked for a tree.

### Mutation run — 10 of 10 caught

    node <harness> ... with CONSONANCE_LAUNCH_PROBE=1

    M1   oracle reverted to `cargo check`                        CAUGHT
    M1b  same, with the spelling assertion also deleted          CAUGHT (behaviour alone, 203ms)
    M2   renderStatusDoc prints a COUNT instead of the list      CAUGHT
    M3   checkStatusDoc stops flagging a count-only section      CAUGHT
    M4   probe: ANY visible window counts as the app             CAUGHT
    M5   probe: alive-with-wrong-window reported as LAUNCHED     CAUGHT
    M6   probe: a dead process reported as merely window-less    CAUGHT
    M7   freshExeProblem never objects                           CAUGHT
    M8   singletonHeld always answers FREE                       CAUGHT (after §7)
    M9   the dialog fixture stops creating its window            CAUGHT

**M1b is the one that matters for bar 2.** M1 alone would be caught by a string assertion, which
proves nothing about the oracle. With the spelling assertion deleted the mutant is *still* caught,
in 203 ms, because the oracle is run against a crate that `cargo check` passes and `cargo build`
fails. **Reverting to `cargo check` is caught by behaviour, not by spelling.**

**M9 exists because a fixture that stops firing turns a passing test into a vacuous one.**

---

## 4 · THE REFUSAL — the gate declares what it cannot answer

**PRECONDITION 1.** If `Local\ConsonanceSingleInstance` is held, `--gate` prints BLOCKED and exits 3.
Not a pass and not a failure. No environment isolation reaches this: redirecting `USERPROFILE` moves
the data dir, not the mutex. **On this machine right now the answer is HELD, and the fast tier prints
it on every run.**

**PRECONDITION 2.** `--gate` launches a real app instance, which writes a data dir on first run
(`seed_room`, `seed_cards`, `gc_captures`). It runs the child with `USERPROFILE` pointed at a scratch
directory — `main.rs:58` `home()` reads exactly that variable and `config_path()` (`:62`) is built
from it — and kills the process **tree** afterwards, because the app spawns children.

**PRECONDITION 3** is the keeper's and is §5.

I did **not** take §8's escape hatch. A launch probe *can* be made deterministic here — it is, and it
has been seen to fail four different ways — so falling back to "cargo build plus a manual step"
would have been the weaker deliverable. What is genuinely manual is *when* it can run: with
Consonance closed, which is a precondition the gate states and enforces rather than a step someone
must remember.

---

## 5 · THE KEEPER STOPPED ME AT 01:16, AND HE WAS RIGHT

**What he saw:** the "already running" dialog on his desktop, three times, called annoying.

**Correction 1, because the report and the cause differ:** the probe never launched Consonance. The
only path that runs the real binary is `--gate`, which refuses while the singleton is held, and I
never ran it. What rendered was **my test fixture** — a PowerShell `MessageBox` imitating
`warn_second_instance()` — once per mutation run, eight times. Mine.

**Correction 2, the fix is a rebuild rather than a disable.** The fixture now creates the window with
`CreateWindowExW` on the **same system class** `#32770`, same title, at (-3000,-3000), shown
`SW_SHOWNA` (visible, never activated, steals no focus):

    measured:  True | #32770 | Consonance - already running     up in 222 ms

against the MessageBox's multi-second assembly load. **It tests the identical fact, faster, and
renders nowhere he can see it.** The on-screen version was never buying anything.

**Disabled by default, as instructed.** Nothing opens a window or launches the app binary without
`CONSONANCE_LAUNCH_PROBE=1`, `--gate` included.

    $ node consonance/tools/gen-consumer.build.test.js
      BUILD-GATE: THE LAUNCH PROBE WAS NOT EXERCISED — 4 tests skipped, off by default.
      BUILD-GATE:   CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js
      pass 7 · fail 0 · skipped 4 · 1.6s

    $ CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js
      pass 11 · fail 0 · skipped 0 · 15.7s

**The cost is declared on every run and not swallowed:** with the flag unset the half that answers
the keeper's actual bar is not exercised, and an oracle never seen to fail is not known to work. A
skip that announces itself is a declaration; a skip that does not is a green over nothing.

**ONE NARROWING OF THE INSTRUCTION AS IT REACHED ME, stated rather than done quietly.** The relay
said "the probe spawns processes"; I drew the line at **windows and binaries, not processes**. The
single-instance detector spawns a headless PowerShell, renders nothing, and stays ON by default —
because it is the check that keeps precondition 1 from going inert, and M8 is exactly what a dead
detector costs. Gating the guard behind the same flag as the thing it guards would leave the
protection untested on every ordinary run. **If the keeper wants it behind the flag too, it is one
line and I will move it.**

---

## 6 · CONSUMER-STATUS.md — THE NAMED CHANGE FOR B, NOT MADE BY ME

**B holds `gen-consumer.js` this lap. I did not touch it.** The contract and its enforcement are in
my file; the generator half is one function call.

**Two exports to import from `gen-consumer.build.test.js`:** `renderStatusDoc(o)` and
`checkStatusDoc(text)`, plus `STATUS_FILE = 'CONSUMER-STATUS.md'`.

**The two-phase design, and it is the point.** A generator cannot know which tests fail in a tree it
has not run, so a generator-written *measured* status file would be a lie at generation time. So:

1. **`build()` always writes `CONSUMER-STATUS.md` at the tree root**, with
   `renderStatusDoc({ measured: false, sha })` — `STATE: UNMEASURED`, the private sha, and the GATE
   line naming the command that would measure it. Honest, actionable, and never absent.
2. **`--gate` overwrites it** with `renderStatusDoc({ measured: true, sha, at, js, rust })` after
   actually running both suites inside the generated tree.

A tree carrying `STATE: UNMEASURED` is a tree nobody has gated. That is a fact worth being able to
read off the artifact, and it is the state a fresh generation is genuinely in.

**The shape J's D010 rule requires, enforced by `checkStatusDoc`:**

    STATE:           MEASURED | UNMEASURED               required
    GENERATED-FROM:  <7-40 hex>                          required — the tree traces to its commit
    GATE:            <command>                           required when UNMEASURED
    ## ... fail ...  one `- <member>` per line, or the literal `(none)`

**A section that prints a number instead of members is REFUSED**, with the reason naming J. **A
declared count that disagrees with its own list is REFUSED.** Both are mutation-tested (M2, M3).

---

## 7 · CORRECTIONS I MADE TO MYSELF

**(a) My positive control tested PowerShell, not my own function — caught by mutation.** v1 of the
single-instance test asked a *child* PowerShell to hold a mutex and report on it from inside itself,
then asserted on the child's word. `singletonHeld()` was never called on a held name. So M8 — the
detector that can never report HELD, which makes precondition 1 inert and lets `--gate` launch into
a running app — **SURVIVED**. That is js-suite's own E-2 lesson (a knob-only gate, a planted positive
drawn from the instrument's own unit), committed by the seat that had quoted it four tests earlier.
Rewritten: the holder is a live fixture, and the assertion is on `singletonHeld()`. M8 now dies.

**(b) My mutation harness produced a false SURVIVED.** M1b first reported SURVIVED under the batch
runner; the replacement it applied left an unbalanced paren, the file crashed before any test ran,
no `# fail` line was emitted, and my regex read that as zero failures. Re-applied cleanly, M1b is
caught in 203 ms. **A harness that reads "crashed" as "passed" is the same two-facts-one-reading
shape the packet sent me to fix**, and I built one on the way to fixing it. The 10/10 in §3 is after
that correction; had I not re-run it, this hand-back would have reported 9/10 with the wrong member.

**(c) A timing flake I closed rather than tuned.** The dialog test failed once under an unrelated
mutant, because the `MessageBox` fixture needed longer to appear than the probe's deadline. I did not
raise the timeout — the off-screen `CreateWindowExW` fixture appears in 222 ms, so the flake is gone
by construction rather than by a bigger number.

---

## 8 · WHAT I DID NOT VERIFY — read this before quoting anything above

1. **NOBODY HAS LAUNCHED THE APP FROM A GENERATED TREE, INCLUDING ME.** `--gate` has never been run
   to completion on any machine. It is blocked here by precondition 1 and by the keeper's flag. The
   packet's sentence stands unchanged: this remains unproven.
2. **Whether a probe that passes here would pass on a machine with no Rust toolchain and no
   WebView2 — UNKNOWN AND UNTESTABLE FROM THIS LAPTOP.** I must not claim it and do not. Specifically
   unknown: whether a Tauri window on a machine with a *different* WebView2 runtime still reports
   class `Tauri Window`; whether the app fails visibly or silently with WebView2 absent (if it dies,
   the probe says DIED and is right; **if it hangs with no window, the probe says NO_WINDOW, which is
   also right — but I have observed neither**). With cargo absent, the build oracle is skipped and
   says so; it is not proven that the skip path is correct in a real toolchain-less environment,
   because I have no such environment.
3. **The `Tauri Window` class string is measured from ONE app on ONE machine at ONE tao version.** It
   is a hand-made constant in the sense this room means. Its mitigation is that a mismatch is a loud
   red printing the observed class, never a silent green — but it has not been observed changing.
4. **The `--gate` heavy path is written and unexecuted.** Its generate → build → probe → suite →
   status sequence has never run end to end. The *parts* are tested; the *sequence* is not. Treat
   §6's two-phase design as a contract with a tested checker and an untested caller.
5. **Side effects of a real launch are reasoned, not observed.** `USERPROFILE` redirection follows
   from `main.rs:58`/`:62` by reading the source. Whether the app spawns `claude` panes at startup
   under a fresh profile, and whether `taskkill /T` reaps everything it starts, I have not seen.
6. **Every citation in §0 was read at the file. The five-document count is a `grep -rn` over the
   working tree excluding `.git`, `target` and `node_modules`** — a document that cites the gate by
   some other name is not in it.
7. **The parity number is not used anywhere in this work**, per packet §4. `(18,1,1)` and `I=8` do
   not appear in the gate, and nothing here was built to move them.

**Falsifier for this gate, registered before it lands:** if the first consumer commit lands and a
stranger's fresh clone cannot `cargo build` it, this gate was decorative. And its second, mine: **if
`--gate` is still unrun a lap from now, the launch half is a design and not an instrument** — the
distinction this whole hand-back is about.

---

## 9 · PATHS — nothing committed

    consonance/tools/gen-consumer.build.test.js       NEW      mine, this lap
    exo_memory/handback/p-first-push-gate_2026-09-06.md   NEW  this file
    exo_memory/map/E.md                               +1 line  the pointer

`consonance/tools/gen-consumer.js` **untouched** — B's this lap; §6 is the named change, handed over
rather than made. `BUILDING.md` untouched (A's). No `loop/` ruling written (C's).

**Suite — returned after the hand-back was written, appended here rather than folded in silently:**

    $ node consonance/tools/js-suite.js --quiet          (exit 0)
      universe: 75 test files discovered · 75 ran assertions to a summary
                0 declared NOT-RUN · 0 neither (crashed-before-summary or silent)
      FAILED: consonance/tools/actors.evidence.test.js
      FAILED: consonance/tools/carrier-drift.test.js

**74 → 75 files: mine is the new one, it ran to a summary, and it is not in the failure list.** That
answers the question §9 said was open — **js-suite classifies a file with four declared skips as an
ordinary green**, so the default-off probe does not register as a red or as a NOT-RUN needing a
`MACHINE-BOUND` declaration it has no right to.

**The two reds are not mine and I did not investigate them.** `carrier-drift.test.js` was already
named shared-red workshop debt in `consumer_parity_2026-09-04.md` §3. `actors.evidence.test.js` was
**NOT-RUN** in that run and is **FAILED** here — a change, on a tree carrying four panes' uncommitted
work this lap, which I am flagging rather than attributing in either direction.

**Tree at hand-back** (`git status --porcelain`): `gen-consumer.js` is modified by **B**, +207/−26 —
not me, and the §6 change is on top of whatever B landed, not instead of it.

**Tree at hand-back** (`git status --porcelain`): `gen-consumer.js` is modified by **B**, +207/−26 —
not me, and the §6 change is on top of whatever B landed, not instead of it.
