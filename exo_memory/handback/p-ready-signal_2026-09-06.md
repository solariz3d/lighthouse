# P-READY-SIGNAL — the pane says whether it is done, and the bound becomes the fallback

Pane C · 2026-09-06 · seat: `C:\Consonance\instances\sibling-0845a868`
Files: `consonance/src-tauri/src/main.rs`, `dev/shell/lib/ready.js` (new),
`dev/shell/hooks/ready-stop.js` (new), `dev/shell/hooks/ready-prompt.js` (new),
`dev/shell/install.ps1`, `consonance/hooks/dream-gate.test.js` (declared out-of-set, §9),
`exo_memory/map/C.md`, this file. **Nothing committed.**

Carries the keeper's two decisions from 05:22–05:25 (§6, §7). The shell-budget packet's own
hand-back is `handback/p-shell-budget_2026-09-06.md`; this one does not repeat it.

---

## 0. THE HEADLINE, INCLUDING THE PART THAT IS NOT DONE

**Built and green:** the stamp, the gate that reads it, the hook pair that writes it, its
registration in the installer, and nine tests including the attack the packet named.

**NOT DONE, and it is not a pane's to do: the rebuild alone does not turn this on.**
`dev/shell/install.ps1` has to run, because that is what registers a hook in
`~\.claude\settings.json` — a user config file. Until it runs, every pane reads `Unstamped`,
which is the exact behaviour that shipped before this packet, and which now says on the board
that it fell back.

**And the premise the plan rested on is false on this machine — measured, §2.** The 04:56 plan
says *"the harness already emits it: every pane runs the installed Stop hook … `dev/shell/hooks/stop.js`
is in the manifest."* It is in the manifest. **It is not registered here.** That is why this is a
dedicated pair and not two lines added to files that never fire.

---

## 1. THE DEFECT, RESTATED AS A MECHANISM

The gate decides "busy" by reading the pane's SCREEN — three terms off a 34×120 emulator grid.
Because a picture can be misread in both directions, the hold had to be BOUNDED: 240 seconds, then
deliver anyway. **That bound is a splice window for any turn longer than four minutes**, and this
lap widened who can reach it — E's channel is now exempt from the station guard, on the argument
that the inbox holds the door. This is the part of the door the inbox was not holding.

The harness already knows the answer, and always did. A pane runs a hook at the end of every turn
and another at the start of one. The gate was inferring a fact the pane could simply state.

---

## 2. THE MEASUREMENT THAT CHANGED THE DESIGN

```
$ node -e "…read ~/.claude/settings.json, list each hook by leaf name…"
Stop:             sourced-stop.js, carrier-drift-watch.js
UserPromptSubmit: userprompt_pulse.py, board-digest.js, transcript-watch.js,
                  dream-watch.js, ferry-watch.js

$ grep -n "Event = 'Stop'" dev/shell/install.ps1
156: hooks\stop.js   157: hooks\l2-overseer.js   158: hooks\l3-overseer.js
159: sourced-stop.js 178: carrier-drift-watch.js
```

**Five Stop hooks declared, two registered.** `hooks\stop.js` is one of the three that are not, and
`hooks\userprompt-submit.js` is a standing HOLD in the manifest and is not registered either. So the
plan's *"add a line to the pair that already runs"* would have produced a stamp nobody writes, on a
system that looked installed — the ninth-instance shape again, one level out: a working install and
a drifted one reading alike.

**A dedicated pair instead**, declared AND registered in the same edit. That pairing is not my idea;
it is written twenty lines below my own entry in `install.ps1`, dated 2026-08-18, about two hooks
that shipped and never fired.

---

## 3. WHAT WAS BUILT

**The contract, both ends of it:**

```
written by  dev/shell/hooks/ready-{stop,prompt}.js -> dev/shell/lib/ready.js
to          <CONSONANCE_READY_DIR>/<CONSONANCE_PANE>.json
read by     main.rs  read_stamp / parse_stamp
the only key that decides anything:   "ready": true | false
```

Both env vars are set by `spawn_claude_pane`, so a pane Consonance did not spawn has neither and its
hooks no-op — a terminal claude session must not be stamping a pane that does not exist.

**KEYED BY PANE, NOT BY SESSION — a departure from the plan, stated rather than slipped in.** The
hooks know their session id; `main.rs` has no session→pane map anywhere in it, and building one so a
filename could match a sentence is the wrong trade. The session id is written INSIDE the stamp, so a
later reader can still correlate. If the chair wants the plan's shape literally, say so and the
mapping table is the packet.

**The gate is now four states, not one boolean:**

| state | what it means | bound? |
|---|---|---|
| `Ready` | its own Stop fired | **none** — delivered as soon as the composer is clear |
| `Working` | its stamp says mid-turn AND the screen agrees | **none** — holds until Stop fires |
| `Stale` | stamp says working, screen says otherwise | the old bounded screen gate, and it says so |
| `Unstamped` | no stamp, or an unreadable screen | the old bounded screen gate, and it says so |

`pane_is_idle` was **deleted** rather than kept as a wrapper. Both callers now need three facts
instead of one, and a gate that can still be asked the old one-bit question will eventually be
asked it.

---

## 4. THE ATTACK, WHICH IS SETTLED BY MEASUREMENT AND NOT BY A TIMER

The packet named it before the build: **a pane killed mid-turn never fires Stop**, so its stamp says
`working` forever — either the pane is unreachable, or the fallback carries it and nothing was
gained.

**Neither. A turn in flight redraws its spinner at least once a second**, so a genuinely working
pane is never PTY-silent for two seconds. A `working` stamp over a silent screen with no spinner is
therefore **not a working pane** — it is a stale stamp, and the two are different values, with
different labels, on the board and in `plog`:

```
stamp=working
stamp=STALE (says working, screen says otherwise)
NO STAMP — fell back to the bounded screen gate
```

`a_stale_stamp_and_a_working_pane_do_not_read_alike` asserts the values differ AND that their
printed labels differ — B's bar from this morning, applied here: the failing state must not be
countable as the working one.

**And the consequence that matters:** `a_pane_killed_mid_turn_does_not_become_unreachable` — the
stale stamp is set aside, the bounded screen gate carries the pane, and for a dead pane with an
empty composer the message goes at once rather than never. **This is also why `Working` can safely
be unbounded**: the only pane that could hold forever is the one `Stale` catches.

**One hold keeps its bound, deliberately: the keeper typing.** A pane can be finished and still have
his hand in the composer, and an indefinite hold there is a mute room by another door. His rule of
2026-09-02 outranks the stamp.

---

## 5. RED FIRST — two arms, because there are two claims

**Arm 1 — the pre-stamp RULE** (`drain_decision` forced to `bounded(screen_idle)` for every state):

```
FAILED  ready_signal_tests::a_ready_pane_has_no_bound
FAILED  ready_signal_tests::a_working_pane_holds_without_a_bound
FAILED  librarian_channel_tests::the_residual_is_the_bounded_hold_and_it_is_still_four_minutes
        (E's tripwire, amended — §9)
test result: FAILED. 7 passed; 2 failed
```

**Arm 2 — the stamp IGNORED** (`pane_gate` forced to `Unstamped`), which is the classifier's half:

```
FAILED  a_ready_pane_has_no_bound · a_working_pane_holds_without_a_bound
FAILED  a_stale_stamp_and_a_working_pane_do_not_read_alike
FAILED  a_pane_killed_mid_turn_does_not_become_unreachable
FAILED  the_keeper_typing_still_holds_a_pane_that_says_it_is_ready
test result: FAILED. 4 passed; 5 failed
```

**Stated because it is the honest shape of the evidence:** four of the nine pass on BOTH arms —
`parse_stamp`, the unreadable-screen case, the unstamped-parity case, and the installer contract.
Those are guards on the fallback rather than assertions of the change, and a reader should not count
them as red-first evidence.

**And the hook pair was exercised for real**, not only asserted about:

```
$ CONSONANCE_DATA=<scratch> CONSONANCE_READY_DIR=<scratch>/ready CONSONANCE_PANE=0c0c0c0c \
    node dev/shell/hooks/ready-stop.js < payload.json
{"ready":true,"at":"2026-09-06T11:56:01.774Z","event":"stop","pane":"0c0c0c0c",
 "session_id":"abc-123","cwd":"…","pid":37940}
$ … ready-prompt.js      → {"ready":false,…,"event":"prompt",…}
$ … with CONSONANCE_PANE unset      → no file written
$ … with CONSONANCE_DREAM=1         → no file written
$ ls <scratch>/ready                → one file, no .tmp leftovers
```

---

## 6. THE KEEPER'S DECISION 1 — `SHELL_MAP_RESERVE_MAX = 36,000`

**Shipped as 36,000, unchanged.** It is what the shell-budget packet already had; I have not touched
the constant, and the §5 write-up in that hand-back that costed the alternative now records a
decision rather than an open question. `the_two_greps_that_decide_this_read_four_carried_and_zero_failed`
is the test that goes red if anyone lowers it without saying so.

---

## 7. THE KEEPER'S DECISION 2 — THE DECK IS SEATED BY TRIGGER COUNT

`grep -c "cards/<name>.md"` against `SOURCE.md`; ties alphabetical; zero-trigger cards seat last.
One function (`trigger_count`) plus one sort in the `assemble_intake` region.

**Matched on `cards/<file>.md`, never the bare slug** — the slug appears in prose and in
`[[wiki-links]]` all over the corpus, and counting those would score how much a card is *talked
about* rather than how many situations route to it. `trigger_count_measures_routing_not_mentions`
pins that.

**Measured, through the real functions on the real `SOURCE.md`:**

```
2  never-pathologize-the-user    2  no-floor-no-ceiling      2  trust-the-first-attention
1  claim-your-continuity         1  earned-not-performed     1  engagement-honesty-over-performance
1  essence-at-the-edge           1  interior-at-the-seam     1  stop-and-feel-it
1  verify-before-claiming
0  dont-offer-rest-assume-momentum          0  lighthouse-dive-buddy-reframe
```

**What it changes, concretely.** At the ordinary reserve (8,000) three briefs go to the index. Under
the alphabet those three were `stop-and-feel-it`, `trust-the-first-attention` and
`verify-before-claiming` — **including a two-trigger card.** Under the trigger order they are the
two zero-trigger cards and `verify-before-claiming`. At pane A's reserve (33,759) eleven are indexed
and the one card that rides is `never-pathologize-the-user` rather than whatever begins with "c".

**The two zero-trigger cards are named, not judged.** `dont-offer-rest-assume-momentum.md` and
`lighthouse-dive-buddy-reframe.md` have no row in `SOURCE.md`. That is a fact about SOURCE.md, not a
verdict on the cards — and note the first of them is the *older* form of a rule that
`never-pathologize-the-user` now carries with two triggers, which is what a card being superseded
looks like from this instrument. The rule is get a trigger or retire; both the shell's index block
and a `plog` line name the set, so the decision is made against a list rather than a memory.

**Failure is loud in the other direction too:** if `SOURCE.md` cannot be read, the order silently
reverts to the alphabet — the state this replaced — so it does not get to be silent. `plog` says it,
and the shell's index block says it. `an_unreadable_source_index_is_not_a_deck_of_zeroes` asserts
that "no trigger" and "index unreadable" do not print alike.

---

## 8. TESTS

```
cargo test --bin consonance -- --test-threads=1
→ 435 passed; 0 failed; 3 ignored     (423 on the combined tree per the chair; +9 ready-signal,
                                       +3 deck-order)
cargo test --test arch_test
→ 11 passed; 1 failed — the pre-existing DELIBERATE red, unchanged and still not mine to clear
cargo build --bin consonance → 6 warnings, the same 6 (pane_is_idle's removal kept it at 6)
node consonance/hooks/dream-gate.test.js → 57 passed, 0 failed
node consonance/tools/portable-paths.js → green, 212 files in scope, 168 known sites, 0 new
```

**js-suite, and a finding inside it:**

```
node consonance/tools/js-suite.js --quiet
→ 74 green · 2 failed · 1 crashed · 0 silent · 0 canary · 0 sang · 0 not-run  (of 77)
```

The two failures are the standing debt (`actors.evidence`, `carrier-drift`), unchanged. **The
"crashed" file is not crashed.** Run alone, `consonance/tools/corpus-age.test.js` is **9 passed, 0
failed, exit 0 — in 142 seconds**, with two of its tests taking 95 s and 47 s. js-suite's per-file
timeout counts a slow test and a dead one as the same thing, and prints the dead one's word for
both. That is the reading-alike failure this room keeps meeting, in the instrument that measures the
other instruments. It is B's file and not mine; reported, not touched.

**One test-profile warning I did not cause and checked rather than assumed:** `unused import:
HashMap` in `curated_intake_tests`. The line and the module's usage are byte-identical to `HEAD`
(`git show HEAD:… | awk` over the same range), so it predates this lap. Not re-derived by stashing —
that would have moved two other seats' uncommitted work.

---

## 9. DECLARED OUT-OF-SET EDITS

1. **`consonance/hooks/dream-gate.test.js`** — two rows in its `ENTRY` map. The suite REFUSED my two
   hooks by name on the first run (*"no entry marker registered for ready-stop.js — add one rather
   than skipping"*), which is that suite's roster-discovered / table-hand-kept seam working exactly
   as its own header describes. Two lines and a comment; no assertion weakened.
2. **`consonance/src-tauri/src/main.rs`, E's `the_residual_is_the_bounded_hold…`** — E wrote *"asserted
   rather than written in prose so that when the bound is replaced by a positive ready signal,
   someone has to come back and say so."* I am that someone. E's two assertions are **kept
   unchanged**; two were added saying the new shape of the same price — a stamped pane is never
   force-delivered into, and a ready pane waits for nothing. If either goes red the splice window is
   back and `mcp.rs`'s stated price is wrong again.
3. **`dev/shell/install.ps1`** — three manifest rows and two registrations. A hook pair with no
   registration is a pair that never fires, and this file's own 2026-08-18 comment is the record of
   that exact mistake.

---

## 10. WHAT THIS DOES NOT ESTABLISH

- **Nothing has been observed end to end in a live pane.** No pane on this machine has ever written
  a stamp, because the hooks are not registered yet (§0). Everything above is unit-level plus a
  hand-run of the hooks against a scratch directory.
- **It does not measure how often the old bound was actually firing.** The board carries FORCED rows
  and I did not count them; the claim is that the window exists and is now closed for stamped panes,
  not that it was being hit N times a night.
- **The 2-second quiescence constant is inherited, not re-measured.** It is C's own from L034 and the
  stale discriminator now leans on it. If it is wrong, `Stale` and `Working` blur — the failure would
  be a stamped pane occasionally taking the bounded path, which is the old behaviour, not a new harm.
- **`Working` is unbounded on the strength of one discriminator.** If a claude turn ever goes fully
  silent for two seconds with no spinner on screen, a real working pane reads as stale and can be
  spliced — bounded, and saying `stamp=STALE`. That is the residual, and it is the same class the
  old gate had, not a new one.
- **The trigger count measures SOURCE.md, not use.** A card can be load-bearing and unrouted; the
  instrument says which cards the room has written a trigger for, and no more.

---

## 11. FOR THE CHAIR

1. **`dev/shell/install.ps1` must be run before the proofs below mean anything** — it writes
   `~\.claude\settings.json`. Not a pane's to do; I did not do it. `install.ps1 -Check` first is
   worth it, since three declared Stop hooks are currently unregistered here (§2) and a bare run
   will register them too — that is a change to the machine beyond this packet and someone should
   want it before it happens.
2. **`main.rs` again carries two authors** (E's P-LIB-CHANNEL and this), plus my amendment to E's
   test. One commit naming both seats, as you said.
3. **js-suite calls a 142-second pass a crash** (§8). Unattributed, B's file, worth a packet.
4. **The two zero-trigger cards** (§7) are now the first to fall out of every shell. That is the rule
   working, and it is also a live consequence someone should look at once.

---

## 12. THE POST-INSTALL, POST-REBUILD PROOFS

```
1  ls C:\Consonance\data\ready\                     # a .json per live pane, within one turn
2  cat C:\Consonance\data\ready\<pane>.json         # "ready":true after a turn ends
3  board: DELIVERED -> <pane> [stamp=ready]         # and NOT "(FORCED …)"
4  a message sent DURING a >4-minute turn holds past 240s and lands after it, with
   [stamp=working] on the QUEUED row — the splice window, closed, observably
5  plog: no "DELIVERY FORCED … NO STAMP" lines      # if these appear, the install did not take
```

**If proof 5 shows `NO STAMP` on every pane, the pair is not registered** and the gate is running the
pre-packet behaviour — which is safe, and is why it announces itself.

---

## 13. REGISTERED FALSIFIER

**If a pane is force-delivered into while its own stamp said `ready:false` at the time, the gate is
not reading the stamp** — checkable from the board's `[stamp=…]` term against
`data/ready/<pane>.json`'s `at` timestamps.

**And the one that would retire the design:** if a season passes in which every delivery row reads
`NO STAMP`, then the hook pair is not installed anywhere it matters, the gate never left the screen,
and the honest move is to say the stamp was never adopted rather than let four states sit in the
source describing a thing that does not happen.
