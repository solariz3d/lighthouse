# P-INSTALLER-ONLY — hand-back. L044, housekeeping lap 2, pane ALPHA. 2026-09-08.

**Packet:** `exo_memory/loop/packet_installer_only_2026-09-08.md` (`9ac1d3a`).
**Landed dirty, nothing committed.** Paths written are named in §8.

**One-line result:** `-Only` was buildable without splitting the registration block, so §8's refusal
was not taken — but **`-Only` does not meet the packet's own OBJECTIVE and building only it would
have shipped a defect-shaped fix**, so the ruling moved into the data as `Excluded` as well. Item 2
turned out to be sharper than stated: the two hooks were not invisible to `-Check`'s *print*, they
were invisible to its *verdict*, measured. Item 3's second site was misidentified in the packet and
is not a carrier; the carrier-drift queue is ruled `withdrawal`, not `acknowledged`, for a
structural reason rather than a preference.

---

## 0 · BARS, FIRST, SO NOTHING BELOW IS READ AS A CLAIM ABOUT THEM

### `node consonance/tools/js-suite.js`

|                        | before (01:38) | after (01:57) |
|------------------------|--------|-------|
| test files discovered  | 77     | 80    |
| green                  | 73     | 76    |
| failed                 | 4      | 3     |
| canary                 | 0      | 1     |
| crashed / silent / not-run | 0  | 0     |

**THE SET IS NOT THE SAME SET AND SAYING "+3 GREEN" WOULD BE A CLAIM I CANNOT SUPPORT.** Three panes
each landed a test file inside this window: mine (`install-only.test.js`), E's
(`targetless-pull.test.js`), B's (`pulse-degrade.test.js`). So 77 → 80 is three seats, not one.
Attributed as far as it goes:

    MINE, GREEN     install-only.test.js                  new, 11 assertions
    MINE, MOVED     carrier-drift.test.js                 still RED; 25 -> 32 accounted (see below)
    MINE, CAUGHT    dream-gate.test.js                    went RED mid-lap because of my change,
                                                          fixed, now 58 passed / 0 failed (§6b)
    NOT MINE        gen-consumer.test.js                  red before and after, untouched
    NOT MINE        gen-consumer.fixture-scope.test.js    red before and after, untouched
    NOT MINE        actors.evidence.test.js               red at my baseline, now a declared CANARY
                                                          — another seat edited actors.js and
                                                          actors.evidence.test.js in this window

**The one number I will stand behind: no test that was green when I started is red now, and the
only file I turned red I turned back green in the same lap** (§6b).

**`carrier-drift.test.js` was red before my change and is still red, but it moved and I own the
move** — see §5. It asserts the shipped census is complete, over the live repo:

    before   32 occurrences, 25 accounted   (7 unaccounted)
    after    33 occurrences, 32 accounted   (1 unaccounted)

**One correction to my own baseline, and it matters because pane B reported a different number.**
My *first* run of js-suite (01:35) reported **5** failed, including `portable-paths.test.js`; the
clean baseline run three minutes later reported **4**, with `portable-paths.test.js` green. B
reported 5 at ~01:38. Nothing was fixed in between. **`portable-paths.test.js` is FLAPPING against
a tree four panes are writing** — it scans the working tree, and the working tree is moving under
it. I did not chase this; it is B's surface. Registered here because a flapping test is worth more
as a named fact than as two seats quoting different counts at each other.

**`carrier-drift.test.js` was red before my change and is still red, but it moved and I own the
move** — see §5. It asserts the shipped census is complete, over the live repo:

    before   32 occurrences, 25 accounted   (7 unaccounted)
    after    32 occurrences, 31 accounted   (1 unaccounted)

The residual 1 is `exo_memory/review/tool_audit_draft_2026-09-07.md:94`, a **deliberate survivor**
(§5). It will stay red until whoever owns that draft strikes the two sentences. I did not account
them; accounting a true finding to green a test is the thing this room has a word for.

### `pwsh dev/shell/install.ps1 -Check`

Run as `powershell -NoProfile -File dev\shell\install.ps1 -Check` — **`pwsh` does not exist on this
machine**, the packet's command line notwithstanding. Both runs exit **1**.

|                                   | before | after |
|-----------------------------------|--------|-------|
| DRIFT                             | 0      | **1** |
| ABSENT                            | 0      | 0     |
| DECLARED, NOT REGISTERED          | **3**  | **0** |
| REGISTERED, NOT DECLARED          | 5      | 5     |
| EXCLUDED BY RULING, correctly absent | —   | **3** |
| EXCLUDED BUT LIVE                 | —      | 0     |
| UNMANAGED (printed, not in exit code) | **2** | — |
| DECLARED UNMANAGED (reason printed) | —    | **2** |
| UNDECLARED (**in the exit code**) | —      | 0     |

**The 1 DRIFT is `transcript-watch.js` and it is not mine — it is pane B's in-flight edit** (`git
status`: ` M consonance/hooks/transcript-watch.js`). Named rather than counted, because a
before/after table that absorbs another seat's dirty file is how a number gets attributed to the
wrong hand.

**And the row that needs saying out loud: my change made `-Check` REPORT FEWER REDS.** Three
`DECLARED, NOT REGISTERED` became zero. That is a re-classification, not a silencing: those three
were reporting *"the file can be byte-perfect and the hook never fires"* as a defect, and for these
three it is **the keeper's ruling working**. A permanently-red channel trains the reader to skip the
list — the exact failure `js-suite`'s canary section was written for. In exchange the check gained
two reds it never had: `EXCLUDED BUT LIVE` (0 today) and `UNDECLARED` (0 today, and **1 in the
fixture where it is planted** — §3). Net: `$regBad` fell 8 → 5; both new detectors are demonstrated
firing in `install-only.test.js`, not merely present.

---

## 1 · THE REFUSAL WAS NOT TAKEN, AND HERE IS WHY IT DID NOT APPLY

§8: refuse if `-Only` cannot be built without splitting the registration block in a way that makes
half-registration more likely.

**It did not need splitting.** `-Only` is a **filter on the input**, not a **branch in the writer**:

```powershell
$syncFiles  = @($files    | Where-Object { $wanted.ContainsKey((Split-Path -Leaf $_.To).ToLower()) })
$regEntries = @($register | Where-Object { $wanted.ContainsKey((Split-Path -Leaf $_.Rel).ToLower()) })
```

There is still exactly **one** file loop and **one** registration loop, both running to completion;
they are handed fewer items. No conditional was added inside the writer for `-Only`. A partial
installer that silently half-registers would indeed be worse than an honestly blunt one, and this
is not one — the two loops cannot half-run, because nothing inside them knows the flag exists.

Three guards ride with it, each closing a way `-Only` could become the disease it treats:

1. **A name nothing carries is a REFUSAL, exit 1, nothing written.** A typo that silently syncs zero
   files is the silent-absence failure one level down: a control reporting success over an empty
   set. Matched on the **exact leaf, case-insensitively — never substring** (§2).
2. **`-Only` is refused with `-Check`.** `-Check` is a report, and a report over a subset reads
   exactly like a report over the whole. **Restrict the action, never the audit.**
3. **The universe and registration blocks keep reading the FULL `$files` and `$register`.** A
   restricted run cannot print a smaller denominator and pass as a whole one — which is the
   `js-suite` self-test failure the packet cites, and it would have been trivially easy to ship here.

Live, on this machine, both refusal paths (they touch nothing, which is why they were safe to run
for real):

```
$ powershell -NoProfile -File dev\shell\install.ps1 -Only no-such-hook.js
-Only: no manifest or registration entry is named:
    no-such-hook.js
  Names match the exact leaf, case-insensitively -- never as a substring.
EXIT=1

$ powershell -NoProfile -File dev\shell\install.ps1 -Check -Only userprompt_pulse.py
-Only cannot be combined with -Check.
  -Check is a report, and a report over a subset reads exactly like a report over the whole.
  Restrict the action, never the audit. Run -Check bare, then -Only to act.
EXIT=1
```

### AND THE PART THE PACKET DID NOT ASK FOR, WHICH IS THE PART THAT MEETS ITS OBJECTIVE

The packet's OBJECTIVE: *"a sync cannot override a registration ruling."* **`-Only` does not achieve
that.** It requires the operator to remember the ruling and type a flag. That is a control with a
hook's failure mode — silent absence — which is my own 2026-09-02 ruling, and shipping `-Only`
alone would have closed the packet while leaving the objective open. The next bare run would have
re-registered all three passengers exactly as last night's did.

So the ruling moved **into the data**:

```powershell
@{ Event = 'Stop'; Rel = 'hooks\stop.js'; Runner = 'node';
   Excluded = 'keeper 2026-09-06 06:55 - ready pair only (librarian/2026-09-06.md:603)' }
```

- An `Excluded` entry is **never registered by any run** — bare, `-Only`, anything. Enforced at the
  top of the writer loop, before an event is created or a group normalised.
- It is **announced, never silent**: `EXCLUDED  Stop  stop.js  keeper 2026-09-06 06:55 …`. A silent
  skip is indistinguishable from the entry not existing, which is the disease.
- The entry **stays in `$register` rather than being deleted**, because deleting it loses the
  ruling: a seat reading a manifest with no `stop.js` line cannot tell *decided against* from
  *nobody got to it*, and would re-add it. This is the same reason `absent_hooks_ruling_2026-08-25.md`
  ruled eleven files DO NOT INSTALL **in writing** rather than by omission.
- **It never unregisters.** An excluded hook found live is reported as `EXCLUDED BUT LIVE` and left
  alone. That invariant is load-bearing elsewhere in this file (the `Conflicts` guard's entire
  argument rests on it) and I did not touch it.

**`-Only` is the ergonomics. `Excluded` is the control.** MUTANT 1 proves they are independent:
delete the whole filter and the exclusion still holds.

---

## 2 · THE SUBSTRING QUESTION, RULED — AND THE PACKET'S PREMISE CORRECTED

> §2(b): *"the removal path matches by substring, so one name that contains another takes both"*

**`install.ps1` has no removal path, and must not gain one.** Two separate findings:

**(i) The installer's own matcher is already exact-with-a-separator-guard, and has been since the
day it caused this exact bug.** `Test-SameHook` at `dev/shell/install.ps1` requires a path separator
immediately before the leaf:

```powershell
return ($command -match ('[\\/]' + [regex]::Escape($leaf)))
```

Its header records the incident — 2026-08-17 11:59, bare-leaf matching, `stop.js` matched
`sourced-stop.js`, re-pointed it, and the `sourced-stop` entry then appended itself, leaving
`stop.js` registered twice and `sourced-stop`'s registration destroyed. So the collision the packet
describes is **a real event that already has a fix in the code**. `-Check`'s registration block
carries the same rule, stated as "MATCHED ON EXACT LEAF EQUALITY, never substring".

**(ii) The 2026-09-07 collision therefore happened OUTSIDE the script — in a hand-run removal — and
that is the finding.** The installer will not remove a hook, by design and in writing: *"NEVER
REMOVE a hook this script does not manage"* and *"this script never unregisters"*. So the chair had
to leave the instrument to undo what the instrument did, and the hand-operation had none of the
protections the script spent a day learning.

**THE RULING: do not build an unregister path. Build the case away.** Adding removal to
`install.ps1` would:

- break the never-unregisters invariant that the `Conflicts` guard's correctness depends on
  (2026-08-31: the only safe response to a live conflicting pulse is to *not add the second*, which
  is only sound if the script cannot delete the first);
- put a delete on the one machine that cannot see the other — the header's standing reason nothing
  has been deleted so far;
- and treat the symptom. **Nothing needed removing last night except what the installer had just
  added.** With `Excluded`, that add cannot happen, so the removal has no occasion.

What remains is the residual case: something *else* registered a hook by hand. For that, the answer
is a red that names it (`EXCLUDED BUT LIVE`) and a human with a text editor — surfaced, not hauled.

**Registered against this ruling, before it is adopted:** if a seat has to hand-remove a
registration again after this date **for a reason other than a hand-registration** — i.e. if
`install.ps1` adds something that must then come out — the "build the case away" argument has
failed and an exact-leaf `-Unregister` should be built with the never-unregisters invariant
formally retired rather than quietly bent. Checkable from `~/.claude/settings.json.bak-*` and the
board.

---

## 3 · ITEM 2 IS SHARPER THAN THE PACKET STATED, AND THE SHARPER FORM IS MEASURED

> §3: *"`-Check` reports 0 drifted while never looking at them."*

**Half right, and the wrong half is the interesting one.** `-Check` *does* look at them. The
universe block has printed both by name since 2026-08-25:

```
   2 UNMANAGED   in the repo, installable, on no manifest entry
     consonance\hooks\ask-surface.js
     consonance\hooks\baton-wake-stop.js
```

What it did not do is **let that reach the verdict**. The exit expression read `$drift`, `$absent`
and `$regBad` and never `$srcUnmanaged.Count`:

```powershell
exit ($(if ($drift -eq 0 -and $absent -eq 0 -and $regBad -eq 0) { 0 } else { 1 }))
```

**Measured, in the fixture, before the fix:** a fresh install into a throwaway `USERPROFILE`, then a
planted `zz-brand-new.js` in the throwaway repo's `consonance/hooks/`. `-Check` printed the file by
name and **exited 0**. That is a green verdict with the unseen file named three lines above it —
worse than not printing it, because a printed finding under a green exit reads as *seen and fine*.

**THE FIX IS A THIRD STATE ELIMINATED, NOT A THIRD STATE NAMED.** The packet offered *manifest them,
or declare them unmanaged.* Both leave the shape intact for the **next** hook. So:

- a source file is now **CLAIMED** by a `$files` entry, or **DECLARED** in a new `$unmanaged` list
  with a `Why` that `-Check` prints;
- **anything else is `UNDECLARED` and sets the exit code.** A hook added tomorrow turns `-Check` red
  until somebody rules on it.

The two hooks are DECLARED, and the declaration is deliberately **not** a wiring decision:

```
   2 DECLARED UNMANAGED   installable, deliberately not installed; the reason prints below
     consonance\hooks\ask-surface.js
       why: UserPromptSubmit surface for unread ASK questions. Built and unwired; wiring a third
            hook onto that event is a keeper decision, not an installer default. No ruling yet.
     consonance\hooks\baton-wake-stop.js
       why: Stop hook that BLOCKS to wake the outgoing seat. sourced-stop.js refused a gate on this
            same event in writing; a blocking hook is the keeper call this one has not had. No ruling yet.
   0 UNDECLARED  installable, on no manifest entry AND on no unmanaged declaration -- nobody has ruled
```

**I did not wire them, and that is a decision with a reason, not an omission.** Both are live-intended
hooks with real headers, tests and an argument for wiring. What neither has is a **ruling**, and
whether a fresh install should wire a hook is the keeper's call — the precedent is
`absent_hooks_ruling_2026-08-25.md`. `baton-wake-stop.js` in particular **blocks**, on the same event
where `sourced-stop.js` refused a gate in writing. An installer default is the wrong place for that
decision. **The declaration records that nobody has ruled, in a place `-Check` prints, so the
question survives the seat that noticed it** — which is the whole difference between the third state
and either named one.

**FOR THE KEEPER, one line: `ask-surface.js` and `baton-wake-stop.js` are built, tested, and
deliberately not installed pending your call.** `-Check` will say so on every run until you make it.

---

## 4 · ITEM 3a — `lap_holders.rs`, DATED IN PLACE

The sentence is at **`consonance/src-tauri/src/lap_holders.rs:83-86`** (the packet's `:85` lands
inside it). Written by this seat in `70d5993`; the packet's §5 is right that it is measured against
my own line.

Struck in place, wording kept, present tense withdrawn — the BOOT pattern, per the packet.

**And it is not merely stale, it is FALSE TODAY, which I would not have known without re-deriving.**
The comment claims *"Two of three stations open where one was."* Re-derived from
`C:/Consonance/data/lap.jsonl` at ~01:50 on 2026-09-08:

    1 {"panes":1}      # one open lap: L044, held by the panes

With K = 1, `station_allows` is **identical to the guard it replaced** — the degenerate case the
sentence directly above it already names. So the headline was a reading of one ledger at one moment
(2026-09-06, when the module landed), and the paragraph *below* it already explained why it could
not stay true: *"the strength of this guard is inversely proportional to how many laps are left
open."* **The comment contained its own refutation two paragraphs apart and nothing connected them,
because a measurement written in the present tense inside a doc comment has no way to go stale
loudly.**

The replacement carries the struck original, the date, the reason, and — because the ledger is
machine-local and there is therefore **no correct number to hardcode** — the `node -e` one-liner
that re-derives it, plus the reading it gave here today, labelled as this machine on this date.

**What does NOT move, and should have carried the claim all along:** the test
`the_price_of_the_fix_is_two_stations_of_three` (`:220`) asserts exactly 2 open stations over the
fixture `[L040_CHAIR, L038_PANES]` — two holders **by construction**. That number is re-derived by
`cargo test` on every run and cannot go stale. The mechanism was pinned; only the prose describing
it in ledger terms drifted.

`cargo test lap_holders` → **7 passed, 0 failed** (`the_chair_may_act_while_another_lap_is_held_by_the_panes`,
`newest_row_across_all_laps_is_the_defect`, `a_station_no_open_lap_holds_is_still_refused`,
`a_filed_lap_is_not_resurrected_by_an_earlier_row`, `unknown_is_not_yes`, `no_open_lap_allows_everything`,
`the_price_of_the_fix_is_two_stations_of_three`). The six `warning: unused` lines in that build are
pre-existing and in `cochlea.rs`; none is mine.

### `:159` — RULED NOT A CARRIER. NOT DATED.

The packet names **two** sites. `:159` is:

```rust
"MUTANT 3 must be RED: no open lap is held by the librarian, so call_chair is refused"
```

That is an **assertion message inside `a_station_no_open_lap_holds_is_still_refused`**, and its
"no open lap is held by the librarian" is a statement about the **fixture two lines above it**
(`[L040_CHAIR, L038_PANES]`), true by construction and re-derived by `cargo test` every run.
**Dating it would make the file worse**, not better: it would imply the line is a ledger reading
when it is a fixture reading, and would teach the next seat that correct, self-verifying prose needs
a timestamp. Left exactly as it is.

The nearest thing to a second carrier is **`:142`** — *"which is what `chain_state()` returns
today"* — a present-tense claim about `main.rs`. **I did not touch it: C holds `main.rs` and a
rebuild waits on it**, and while the sentence lives in my file the fact it asserts lives in C's.
Flagged, not fixed. If C's L044 work changes `chain_state`'s return shape, that comment is the
carrier that goes wrong.

---

## 5 · ITEM 3b — THE CARRIER-DRIFT QUEUE, RULED `withdrawal`, NOT `acknowledged`

The packet allowed that the right answer might be *do not acknowledge, a hand-back is a trace.* It
is — **and the reason is structural, not a preference, which makes it checkable:**

**`acknowledged` REQUIRES THE FILE TO CARRY THE MARKER** (`carrier-drift.js:535`: `if ((s.kind ===
'marked' || s.kind === 'acknowledged') && !markerRe.test(doc.text))` → RED). So acknowledging a
hand-back means **editing a dated trace to satisfy a scanner** — precisely what *mark the carriers,
leave the traces* forbids. The kind is the wrong tool by construction.

**`withdrawal` is the kind these occurrences already are**, and it is marker-free by design (same
line: `withdrawal` and `mention` are not checked). Read them: every L039 site quotes the struck line
**in order to report it as struck in the draft under review**. The occurrence *is* the correction.

    p-l039-read-A:103   "…" That form was **struck 2026-08-30**, kept in BOOT only so th…
    p-l039-read-B:135   "…". STRUCK 2026-08-30. `grep -n "can't lose by saying" …
    p-l039-read-C:77    …is presented as "the test the room uses on its own moves". `BO…

**AND I DID NOT MAKE `exo_memory/handback/` A TRACE PREFIX**, which was the tempting one-line
version. The registry's own README refuses it in advance: *"any rule that excuses a whole file is
green on it… the case this exists for is a re-assertion typed into a file that already carried a
correction notice."* A hand-back **can** assert a withdrawn claim as its own position. Per-site, not
per-directory.

**Applied: 12 rows** — 9 `withdrawal`, 3 `mention`.

    node consonance/tools/carrier-drift.js

    RED before   12 findings
    RED after     2 findings
    only-decorrelated-2026-08-16   27 occ · 22 accounted  ->  28 occ · 27 accounted
    cant-lose-handle-2026-08-29    32 occ · 25 accounted  ->  33 occ · 32 accounted
    registry sites                 59 -> 71

**THE OCCURRENCE COUNTS WENT UP BY ONE EACH, AND THE REASON IS THIS FILE.** Ten rows took RED from
12 to 2; the re-run then went back to **4**, because *this hand-back* quotes both withdrawn wordings
— naming the survivors and pasting the grep evidence — so the document ruling on carriers became
one. Registered as two `mention` rows by the seat that wrote it, in the same lap, rather than left
for whoever runs the tool next. **A ruling whose author is exempt from it is precisely what this
registry exists to notice**, and the tool caught its own author inside twenty minutes.

    exo_memory/handback/p-installer-only_2026-09-08.md:345, :368

**THE TWO SURVIVORS, NAMED, NOT COUNTED AS CAUGHT:**

    exo_memory/review/tool_audit_draft_2026-09-07.md:94    asserts the struck can't-lose line
    exo_memory/review/tool_audit_draft_2026-09-07.md:107   asserts "the only decorrelated reader"

**These are correct reds and I deliberately left them.** That draft is the *object* the three L039
hand-backs were reviewing — it asserts both withdrawn wordings as its own position, which is exactly
what the instrument exists to catch. Accounting them would silence a true finding to green a test.
**It is not mine** (`exo_memory/review/` is untracked and outside my ownership), so it is handed on
rather than fixed: **whoever owns `tool_audit_draft_2026-09-07.md` owes it a strike-in-place, and
`carrier-drift.test.js` stays red until they land it.**

Anchors were taken from `node consonance/tools/carrier-drift.js --census` at write time, not
hand-written — the registry's README names pasting a census back with kinds filled in from nowhere
as how this becomes a silencer, so each row's `why` says which judgement it is and who made it.

---

## 6 · THE TESTS — RED FIRST, WITH BOTH MUTANTS

`consonance/tools/install-only.test.js`, new, discovered by `js-suite` automatically.

**Against the UNPATCHED installer: 1 passed, 9 failed.** The one that passed is the positive control
(*a fresh install of this repo, checked immediately, is GREEN*) — without it every red below could
have been the fixture rather than the finding.

**Against the patched installer: 11 passed, 0 failed.**

The two RED-FIRST cases the packet named, both demonstrated failing first:

- **`-Only` registering an excluded hook** — on the old script `-Only` is not a parameter at all, so
  the run died and registered nothing.
- **a bare run registering the excluded hooks** — reproduced verbatim: `stop.js`, `l2-overseer.js`
  and `l3-overseer.js` all registered on `Stop`. That is last night's defect, in a fixture, on
  demand.

Plus: `-Check` **exited 0** over a planted `zz-brand-new.js` it had printed by name (§3).

**THE MUTANT SPLIT IN TWO, AND FINDING THAT OUT IS PART OF THE RESULT.** The packet asked for one —
*"make `-Only` register everything anyway => red."* Written that way it **failed, and correctly**:
with the filter gone the excluded hooks were *still* not registered, because `Excluded` is enforced
in the writer, not in the filter. **My first mutant asserted a coupling the code does not have.**
Corrected into two, which is strictly better, because the independence is the claim the whole change
rests on:

    MUTANT 1  delete the -Only filter        -> everything registers; test 1 catches it
                                             -> AND the exclusion still holds. The two controls
                                                are independent; -Only is convenience, Excluded is
                                                the control.
    MUTANT 2  drop `continue` from the       -> all three excluded hooks register again; test 2
              Excluded guard                    catches it. The 2026-09-07 defect, on demand.

**A second self-correction, recorded because it produced a false green for one run.** MUTANT 2's
first regex anchored on `if ($e.Excluded) {` — which occurs **twice**, and it silently ate the
`-Check` block that shares the condition. The mutated script wrote an empty `settings.json`, and the
assertion *"the excluded hooks are not registered"* would have passed **for the wrong reason**. It
was caught only because I asserted the mutant had *applied* (`count === 1`) rather than merely that
the outcome differed. Re-anchored on `$skipped++`, which occurs once. **A mutant that breaks the
script instead of changing it reads exactly like a guard that held.**

### 6b · MY OWN FIX DID THE THING MY OWN FIX IS ABOUT, AND THE SUITE CAUGHT IT

**`js-suite` went red on `consonance/hooks/dream-gate.test.js` and it was mine.** Not a defect in
install.ps1's behaviour — a defect in the *shape* of what I wrote:

`dream-gate.test.js:71` discovers its hook roster by regex over **this file**:

```js
const re = /^.*From\s*=\s*'([^']+)'.*$/gm;
```

My `$unmanaged` entries were written `From = 'consonance\hooks\ask-surface.js'`, in the shape every
`$files` entry uses. **So declaring two hooks unmanaged silently widened a different instrument's
corpus.** That is the disease this whole packet is about, committed by the fix for it, one level up:
a denominator that moved because of a textual coincidence rather than because anyone ruled on it.

**Fixed by renaming the key to `Src`,** with a DO-NOT-TIDY comment naming dream-gate's line number —
because the next seat who "normalises" it back to `From` re-widens that corpus and will not know
why the suite went red. `dream-gate: 58 passed, 0 failed` after. Whether dream-gate's roster
*should* cover unmanaged hooks is a real question and a good one; it belongs to whoever owns that
file, made on purpose.

**AND THE RED IT PRODUCED WAS TRUE, SO IT IS KEPT RATHER THAN DISCARDED.** dream-gate found:

    FAIL  ask-surface.js: the guard is in the source — no executable CONSONANCE_DREAM guard
    FAIL  ask-surface.js: speaks without the variable, silent with it — spoke to a dream: {…"ask: 12 open · oldest 43d"…}
    FAIL  baton-wake-stop.js: the guard is in the source — no executable CONSONANCE_DREAM guard

Verified independently: `grep -c CONSONANCE_DREAM` returns **0** for both, and **≥1 for every
managed hook** (`board-digest.js` 2, `ferry-watch.js` 1). Neither hook is installed or registered, so
the dream runner never reaches them today — this is a **precondition on wiring, not a live defect**.
It now prints inside the unmanaged declaration itself, so the keeper's decision in §3 arrives
carrying its own blocker:

> **Wiring `ask-surface.js` or `baton-wake-stop.js` today ships a hook the dream runner cannot
> switch off.** The guard comes first. `baton-wake-stop.js` is the worse of the two, because it
> *blocks*.

---

`universe-print.test.js:24-42` states install.ps1's `-Check` is "DEMONSTRATED AND UNPINNED", and
gives the reason: automating it means planting files in the repo and `~/.claude/shell` on every
suite run, *"a decision for the seat that owns the tree."* **That objection is correct about the
real tree and does not apply here** — every run builds a throwaway repo (a copy of `dev/shell/` and
`consonance/hooks/`) and a throwaway `USERPROFILE` under `os.tmpdir()`; the installer resolves
`$repo` from `$PSScriptRoot` and `$dest` from `$env:USERPROFILE`, so both ends move. **Nothing
touches the repo, `~/.claude`, or the build.** That comment is now partly out of date; it is **not
my file** and I did not edit it. Whoever next touches `universe-print.test.js` should narrow it.

---

## 7 · WHAT I DID NOT VERIFY

1. **The desktop.** `Excluded` is repo-wide; the keeper's ruling was spoken about *this* install. If
   the desktop legitimately runs `l3-overseer.js` — `install.ps1`'s own 2026-08-17 header says it
   writes the arc-perceptions the keeper reads every turn — **its `-Check` will now go red with
   `EXCLUDED BUT LIVE`.** That is deliberate (nothing is unregistered, the conflict is named), but
   **whether the ruling was meant to reach that machine is the keeper's to say, not mine to assert.**
   This is the single most likely way this change is wrong.
2. **`-Only` has never been run in anger against the real `~/.claude`.** I ran the two refusal paths
   live (they touch nothing) and `-NoRegister -Only`, which prints the plan. The mutating path is
   covered only by the throwaway fixture. **The first real use is the proof, and it should be a
   `-Check` before and after.**
3. **The five `REGISTERED, NOT DECLARED` hooks are untouched** (`sessionstart-ambient.js`,
   `board-digest.js`, `transcript-watch.js`, `dream-watch.js`, `ferry-watch.js`). Each is a
   `$register` line **and** a decision, out of scope, and still red — as the file's own closing note
   says it should be.
4. **`portable-paths.test.js`'s flap** — observed twice, not diagnosed. B's surface.
5. **The `PATH-MISMATCH` on `ambient.js`** is unchanged and unexamined; it predates this packet.
6. **No rebuild.** Nothing here is Rust behaviour — `lap_holders.rs` took a comment edit only — but
   the tauri app is not rebuilt and I did not touch `main.rs`.
7. **`exo_memory/review/tool_audit_draft_2026-09-07.md`** — read only for classification. I did not
   assess whether the rest of it is right.

---

## 8 · PATHS WRITTEN — NOTHING COMMITTED, NOTHING PUSHED

    dev/shell/install.ps1                          OWNED
    consonance/src-tauri/src/lap_holders.rs        OWNED
    exo_memory/handback/p-installer-only_2026-09-08.md   OWNED (this file)
    exo_memory/map/A.md                            OWNED (one line)
    consonance/tools/install-only.test.js          NEW — not on the packet's list
    consonance/tools/carrier-drift.registry.json   NOT ON THE PACKET'S LIST

**The last two are outside §7's ownership list and I am naming them rather than burying them.**

- `install-only.test.js` is new, in `consonance/tools/`, claimed by nobody. The packet demanded RED
  FIRST fixtures and `dev/shell/` has no test infrastructure, so the JS suite is where they had to
  go. Taken.
- `carrier-drift.registry.json` is the harder one. §7 does not list it, and §4 assigns me an item
  whose *both* stated options require writing rows into it — acknowledging **is** a registry edit.
  I read the tension in favour of doing the work, because the alternative is a ruling filed where
  the queue stays red and nothing changes, which is the failure the ferry exists to measure.
  **Nobody else holds it tonight** (B: `transcript-watch.js` and the `.py` surface; C: `main.rs`;
  E: the pull and vantage ledgers). If the chair wants it out, the rows are §5 and revert is one file.

**Untouched, as instructed:** `consonance/src-tauri/src/main.rs` (C, rebuild waiting),
`consonance/hooks/transcript-watch.js` and the `.py` surface (B), the pull and vantage ledgers (E).

**Backups from last night, still on disk, not cleaned up by me:**
`~/.claude/settings.json.bak-20260907-063417`.

---

## 9 · THE PACKET'S FALSIFIER, AND MINE

> **FALSIFIER:** a hook registered after this that the keeper had excluded, or a `-Check` green over
> a file it never looked at.

Both now have an instrument rather than a hope:

- **first clause** → `Excluded` in the data (a bare run cannot), plus `EXCLUDED BUT LIVE` if one
  appears by another route. Pinned by RED-FIRST test 2 and MUTANT 2.
- **second clause** → `UNDECLARED` is in the exit code. Pinned by the planted-file test, which
  **exited 0 before the change and exits 1 after**.

**Registered before adoption, and neither is comfortable:**

1. **`Excluded` is a list a human maintains, and that is the same class of control it replaces, one
   level up.** It is stronger than prose because a bare run reads it — but a ruling nobody adds to
   `$register` is a ruling this still overrides silently. **If a keeper ruling after this date is
   overridden by an installer run because nobody added the `Excluded` line, then moving the rule
   from prose into data was not enough and the registration needs to read the ruling documents
   themselves.** Checkable from the board.
2. **`-Only` earns its keep or it is decoration.** If, one season on, no run has used it and the
   only selective operations in the log are still hand-edits to `settings.json`, the ergonomic half
   was not the problem and `Excluded` was the whole fix. Checkable from the board and the `.bak-*`
   files.
3. **§2's ruling** — see the registration at the end of §2.
