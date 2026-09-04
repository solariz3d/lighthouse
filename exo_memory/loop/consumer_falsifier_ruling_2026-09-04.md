# D007 P1 — THE CONSUMER FALSIFIER, RULED

*Pane A, 2026-09-04. Non-author of `loop/consumer_registration_2026-09-03.md` (B) and
`handback/p-consumer-reg-attack_2026-09-03.md` (J). Measured against `b1205c3`
`librarian/2026-09-04.desktop.md` 12:04 P1 and the three legs it names. **Written to be attacked:
§10 says where. My conflict is declared in §9 and it is not small.***

---

## 0 · THE RULING, IN ONE LINE — a partial refusal, which is the most this packet can honestly deliver

**Two of the three legs merge into ONE falsifier with ONE number that fires today. The third cannot
join and is re-registered separately as DEFERRED, with its own arming condition.** Forcing all three
into one conjunction would produce a falsifier that cannot return a verdict until a repository that
does not exist has been cloned by twenty strangers — **the mirror of the exact defect J killed the
stranger clause for** (`p-consumer-reg-attack:60-64`, *a check whose universe is the one box it
cannot fail on*; this one's universe is a box that does not exist yet).

    THE FALSIFIER          D  = P + M + B        REFUTED IF D > 0     OBJECTIVE: D = 0
    THE GUARD ON IT        I  = S - G            reported beside D, ALWAYS, never folded in
    DEFERRED, NOT MERGED   Leg 2 (20 cloners)    armed on repo creation; scored on its own clock

---

## 1 · WHY THE THIRD LEG CANNOT JOIN — and this is a ruling, not a preference

| | B Leg 1 · cold box | J · generated-tree parity | B Leg 2 · clone count |
|---|---|---|---|
| universe | the shipped tools, empty state | the generated tree | strangers' machines |
| runnable | **today** | **today** | **not until a repo exists** |
| clock | one command | one command | GitHub retains clones **14 days**; weekly sampling, indefinite |
| returns | a count | a count | a count, eventually |
| can confirm success | yes (0) | yes (0) | **no** — B, `:319`: *"It cannot confirm success — only make failure sayable"* |

Legs 1 and 3 are properties of **an artifact we hold**. Leg 2 is a property of **the world's
reception of it**. Conjoining them yields a statement whose truth value is undefined for an unbounded
period, and an unfalsifiable-in-practice falsifier is worse than none, because it reads as a standard.

**And Leg 2 alone cannot confirm.** B registered it honestly: N cloners with zero evidence *"is NOT
'nobody tried'"*. A conjunct that can only ever say *maybe* poisons a conjunction that could otherwise
say *no*.

**So the ruling is: merge 1 and 3; keep 2, unmerged, dated, and armed.** Both halves of the map's ask
survive. Neither is dropped. What is refused is the word ONE applied to all three.

---

## 2 · THE ONE FALSIFIER — D, the cold-tree defect count

> **D = P + M + B**, counted **inside one generated tree, in one quiet window, by one body.**
>
> **P — PARITY BREAKS.** Test files that are red or crashed in the generated tree and green in the
>   source tree at the same HEAD. Shared reds do not count; they are workshop debt, not generation
>   damage. (J's definition, `:118-124`, kept verbatim in substance.)
> **M — MUTE.** Of the tools the shipped README tells a reader to run, those that exit 0 having
>   printed nothing.
> **B — BROKEN.** Of the same tools, those that die with an uncaught stack trace instead of naming
>   what is missing.
>
> **THE CLAIM UNDER TEST:** *the generated consumer tree is a sound product — someone who has only it
> can run what it tells them to run, and where it fails, it tells them why.*
>
> **REFUTED IF D > 0. One event. No rate floor, no window.**

**The bar is >0 because both original authors independently chose >0** — B, `:288`: *"refuted if
MUTE + CRASHES > 0 … One event. No window, no rate floor"*; J, `:134`: *"must reach parity … currently
2 shared reds"*, i.e. delta zero. **Softening it here would be B's own DEGENERATING clause 4 firing
on the document that inherits it.** It is not softened.

### The commands, in order, in one window

    T=$(mktemp -d)
    node consonance/tools/gen-consumer.js --out "$T"          # the tree under test
    ( cd "$T" && node consonance/tools/js-suite.js )          # -> P, against the source-tree run
    node consonance/tools/js-suite.js                         # the source-tree run, same HEAD
    ( cd "$T" && <the cold sweep of §4 over the README five> ) # -> M and B
    ( cd "$T" && find . -name '*.test.js' | wc -l )           # -> G   (MEASURED, never derived)
    find . -name '*.test.js' -not -path './node_modules/*' | wc -l   # -> S

**The parity halves must be the same HEAD and the same window.** J's own hand-back flags the
moving-baseline problem (`:286-288`); this lap has B, J, K and L live on disjoint files, so P4's
report must name any seat that committed inside the window or say none did.

### Today's value, half re-derived by me, half cited and stale

    M = 1     chain-status.js — rc 0, 0 bytes, cold data dir. RE-DERIVED TODAY (§4).
    B = 1     ferry.js --due — uncaught `Error: spawnSync ... cmd.exe ENOENT`, stack, rc 1.
              RE-DERIVED TODAY (§4).
    P = 18    J, 2026-09-03: generated 42 green · 17 failed · 3 crashed of 63 against source
              68 · 4 · 0 of 73; 2 shared reds; (17+3)-2 = 18.  **STALE — three test files were
              added after that run (`0d2a2d9`, `ed3e94b`, both 2026-09-03 10:40-10:43). P4 owns
              the fresh number; I did not re-run it, because that run is P4's and a second
              baseline is the thing this lap least needs.**

    D >= 20 today, and the parity half is not current.  THE FALSIFIER HAS ALREADY FIRED.

**A falsifier that starts red is the strongest kind available here.** It cannot be accused of having
been tuned to pass, and the work has a number to move.

---

## 3 · THE GUARD THAT MAKES D HONEST — I, and it is the real content of this ruling

**D is gameable, and the move that games it is the one J's degenerating clause already names —
but the clause as worded catches only the case where someone means it.** An `EXCLUDE` entry does not
turn a red test green. It removes the file from the denominator, and D falls with no defect fixed.

So D is never reported alone:

    S = test files in the SOURCE tree                                   today: 74
    G = test files present in the GENERATED tree            (measured)  today: 66 derived / 63 by J's run
    I = S - G, THE INVISIBLE                                            today: 8 derived

**Re-derived today, statically, against `HEAD` `3d2f1bc` (clean tree, `git status --porcelain` empty):**

    $ find . -path ./node_modules -prune -o -path ./.git -prune -o -name '*.test.js' -print | wc -l
      -> 74      (cross-checked against an independent Node walk; the two lists diff to zero)

    MANIFEST ships test files from exactly three globs — consonance/tools, consonance/hooks
    (match /\.js$/) and consonance/ui (match /\.(html|css|js)$/, which .test.js satisfies):
      consonance/tools  52 · consonance/hooks  12 · consonance/ui  4   = 69 eligible

    EXCLUDE (gen-consumer.js:132-145, SIX entries) hides three of them:
      consonance/tools/catch-ledger.test.js
      consonance/tools/gen-consumer.test.js
      consonance/tools/gen-consumer.fixture-scope.test.js
                                                        -> 66 EXPECTED in the generated tree

    NEVER REACH ANY GENERATED TREE — outside every MANIFEST dir, so they cannot be red there,
    cannot be green there, and are invisible to parity by construction (5):
      dev/dream/dream_cycle.test.js
      dev/headwatch/install_headwatch.test.js
      dev/shell/hooks/userprompt_pulse.test.js
      dev/vantage/install_vantage.test.js
      exo_memory/loop/run2/rig/score.test.js

    I = 5 + 3 = 8.   74 - 66 = 8.  Consistent.

**AND THE 66 DOES NOT RECONCILE WITH J's MEASURED 63.** Three of that gap is the three test files
added after J's run; the remainder is unexplained by anything I can read statically. **P4 must print
G from inside the tree and reconcile it against this derivation. A gap means a MANIFEST rule nobody
here has read correctly — which is the 08-23 class, and it is how `src-tauri/tests/` stayed absent
for weeks.**

### The anti-gaming rule, mechanical, so nobody has to detect intent

> **A lap in which D falls and I rises by the same amount is DEGENERATION, not progress, and is
> reported as such.** Formally: if `ΔD ≤ 0` and `ΔI ≥ |ΔD|`, the lap made no progress on the claim.
>
> **Every `EXCLUDE` entry added during a lap is listed by name in that lap's parity report, beside
> the file it hides.** An exclusion may be right — `gen-consumer.js` genuinely does not ship — but an
> exclusion that is never named is indistinguishable from a defect that was hidden.

This is J's clause with a number attached. J's version requires a reader to judge whether an
exclusion was "rather than shipping"; this version fires on the arithmetic.

---

## 4 · LEG 1 CORRECTED — its universe was unbounded and its classifier is wrong, and I found both by running it

### 4a · The universe. B's own words are right; B's own sweep is not.

B registered the threshold over *"the tools a first wake is told to run"* (`:288`) and then scoped the
sweep to *"the remaining 29 data-dir tools and 92 shipped tools"* (`:294`). **Those are three
different sets, and none of them is enumerated from an authority outside the sweep.**

**The authority exists and it is the artifact the stranger actually reads.** `consonance/README.md`,
under *"The ones a reader will actually want"*, `:149-154`, names exactly five:

    chain-status.js · board-audit.js · ferry.js --due · carrier-drift.js · js-suite.js

**Registered: the cold-sweep universe is that table. N = 5, printed, sourced from the shipped
README.** M and B are counted over it and nothing else.

**Its own hazard, registered with it:** the universe is a file the party under test can edit.
Deleting a row lowers D by up to 1 and fixes nothing. **So the parity report prints the table's
current five names and the sha of the last commit that touched `consonance/README.md`. A change to
the table between laps is reported as a change to the instrument, not as progress.**

### 4b · The classifier. B's rule counts a working alarm as a crash.

B, `:284-286`: `CRASHES = non-zero rc, or a stack trace`. **Run today over the five:**

    $ for t in <the five>; do D=$(mktemp -d); CONSONANCE_DATA="$D" node consonance/tools/$t.js ...; done

    chain-status    rc 0   0 bytes                                     -> MUTE
    board-audit     rc 0   468 bytes, and it read C:\Consonance\data\board.jsonl
    ferry --due     rc 1   1562 bytes, uncaught `Error: spawnSync C:\WINDOWS\system32\cmd.exe
                           ENOENT` at ferry.js:52 -> :60 -> :188, `Node.js v24.14.1`
    carrier-drift   rc 1   18352 bytes, a full report, its stated limits, final line `RED`
    js-suite        rc 1   5507 bytes, `ok` lines and a summary

**Under B's rule that is MUTE+CRASHES = 4 of 5. Under an honest reading it is 2.** `carrier-drift`
exits 1 *because it found drift*; `js-suite` exits 1 *because tests are red*. Both are the tool
working exactly as designed. **Counting them as crashes inflates D by 2, and the inflated number is
precisely what would later be used to argue the bar should move — B's DEGENERATING clause 4, reached
by accident rather than by bad faith.**

**Registered classifier, replacing B's:**

    MUTE       0 bytes of output.                                   (unsuppressible; the real defect)
    BROKEN     output contains an uncaught stack frame — a `.js:<line>` trace under an `Error:` the
               tool did not print on purpose.  Exit code is NOT the discriminator.
    SPEAKS     non-empty output that NAMES the missing thing or reports a state. Non-zero rc is
               fine; a tool saying RED is a tool working.
    FALSE-COLD the tool read a path outside CONSONANCE_DATA. Not evidence in either direction;
               reported, never scored.

`board-audit.js` is **FALSE-COLD**: it parsed 155,495 rows from `C:\Consonance\data\board.jsonl`, a
hardcoded machine path the empty data dir never reached. **The control did not apply to it, and B's
sweep as written would have scored it SPEAKS — a green produced by our own data.** That is the wrong
universe reporting green, which is the sign this room has the worst history with.

**So: M = 1, B = 1, FALSE-COLD = 1, SPEAKS = 2, today.**

*What this sweep still cannot see, unchanged from B `:296-300`:* a different OS, a different toolchain,
an absent WebView2, a missing native dependency. It fakes empty **state**, not a foreign **machine**.
It is worth noting that `ferry.js` failed here for an environment reason — `cmd.exe` not resolvable —
which is that very class arriving anyway, uninvited, on our own box.

---

## 5 · THE OBJECTIVE — stated before, beside the falsifier, because half an instrument is not one

`objectives_not_only_falsifiers_2026-09-01.md:44-52`: *the objective is stated BEFORE, or it is not an
objective.* The map's objective is *a stranger's first wake reaches SEED, and the generated tree's
suite is green.* Split, because one half has an instrument and the other does not:

> **O1 — D = 0.** The generated tree's suite matches the source tree's failure set, and every tool the
> README names either speaks or works, cold. **Instrumented today. This is the whole of §2.**
>
> **O2 — a first wake lands on SEED.** Decomposed into the two halves that CAN print:
>
>   **O2a** `consonance/src-tauri/brief/SEED.md` exists in the generated tree AND is declared in
>   that tree's `tauri.conf.json` bundle resources. Static; one `test -f` and one grep. This is
>   already the class that caught `room-settings.json` and `THIRD_PLACE.md`
>   (`gen-consumer.js` MANIFEST comments) — a declared resource that is absent fails the build.
>
>   **O2b** `pick_default_room` (`main.rs:317-329`, pure, no disk) returns the bundled SEED path
>   for the stranger's argument vector — `dev_master: None`, `editable_seed: None` (nothing creates
>   the data dir on first run, B §3 `:175`), `bundled_seed: Some(..)`. A unit test, no GUI.

**AND THE HALF THAT HAS NO INSTRUMENT, NAMED RATHER THAN INVENTED.** O2a and O2b together prove the
product *would* hand SEED to a first wake. **They do not prove any first wake happened, or that a
person read it.** Nothing in this repo can observe that. **The only leg that could is Leg 2, which is
deferred in §6.** I am not manufacturing a proxy for it; a proxy would be a report we author, which is
the suppressible numerator both B and J spent their registrations excluding.

**So the objective is honestly two-thirds instrumented, and the missing third is named and dated
rather than filled.**

---

## 6 · LEG 2, RE-REGISTERED — deferred, not dropped

> **ARMED WHEN** `solariz3d/consonance` (or whatever the keeper's ruling names) exists and is public.
> Until then it is not failing; it is not running, and the difference is recorded here so that a
> later reader cannot mistake silence for a pass.
>
> **THRESHOLD, UNCHANGED AND UNMOVED:** 20 unique cloners with zero evidence of a completed first wake
> refutes *"a stranger can install from the public repo alone."* B fixed 20 before a clone existed
> (`:314-316`); it stays 20 here for the same reason it was fixed there.
>
> **CADENCE:** `gh api repos/<owner>/consonance/traffic/clones`, **weekly, recorded whether or not
> anyone looks** — GitHub retains 14 days, so a missed fortnight is data destroyed, not data pending.
>
> **ITS OWN DEGENERATING CLAUSE, inherited from B `:330`:** the 20 is renegotiated after clones start
> arriving.
>
> **AND ONE OF MINE:** if this leg is still un-armed one month from today because no repo was created,
> that is a fact about the lap, not about the leg, and the parity report says so rather than letting
> an un-armed leg read as a quiet pass.

---

## 7 · DEGENERATING IF — the whole set, J's two kept verbatim in substance

    1  (J)  a manifest gap is closed by adding an EXCLUDE entry rather than by shipping the missing
            file.  MECHANISED at §3: DeltaD <= 0 with DeltaI >= |DeltaD| is degeneration, and every
            EXCLUDE added in a lap is named in that lap's report beside the file it hides.

    2  (J)  the parity delta is still non-zero after two laps.  SHARPENED, because "two laps" is
            gameable by not opening laps: TWO LAPS IN WHICH ANY SEAT COMMITS TO gen-consumer.js,
            its MANIFEST, or its EXCLUDE.  Counted from this document's commit.

    3  (B4, inherited)  D's bar moves.  If D comes back at 20 and the bar becomes "under 5", this
            registration degenerated in the exact move Lakatos names, and the move will be made by
            someone who thinks they are being reasonable.

    4  (mine)  D is reported without I beside it.

    5  (mine)  the cold-sweep universe changes without the README diff that changed it being named.
            The five are README.md:149-154; the party under test can edit that table.

    6  (mine)  a season passes in which this document grows and D is not printed.

    7  (mine)  P and (M,B) are taken from different HEADs or different windows and reported as one D.

---

## 8 · WHAT THIS RULING CANNOT SEE

- **It cannot see a foreign machine.** Every leg that runs today runs here. §4's `ferry` failure is a
  hint of that class, not coverage of it.
- **It cannot see a wrong-but-green test.** D counts red files. The 08-23 break was a suite going
  **green over rewritten data**, and D would have read 0 through all of it. B's DEGENERATING clause 2
  is the only guard on that and it is a human reading, not a number. **This is the largest hole and I
  have not closed it.**
- **P is stale.** I did not re-run the parity halves; that window is P4's, and a second baseline in a
  lap with four live seats is worse than a cited number with its date on it.
- **G is derived, not measured, in this document.** 66 is arithmetic over MANIFEST and EXCLUDE. J
  measured 63. The gap is flagged, not resolved.
- **Nothing here rules on repo shape.** Per the packet: this falsifier is about the generated tree
  being sound, not about which repository it lands in. The keeper's 09-03 override and the private
  flip are untouched by every number above.

---

## 9 · MY CONFLICT, DECLARED

**I authored the `EXCLUDE` entry that J's degenerating clause points at.**
`consonance/tools/gen-consumer.fixture-scope.test.js` was created by me on 2026-09-03 (`0d2a2d9`), and
its EXCLUDE entry — *"requires gen-consumer.js, which does not ship; it would crash on load in a
consumer tree"* — is mine, added in the same work
(`handback/P-GEN-RED-FIRST_2026-09-03.md:136-138`). J flagged it live, mid-attack, as *"a seat
discovering by hand, one file at a time, the class this one command enumerates in full"*
(`p-consumer-reg-attack:140-142`).

**So I am ruling on a falsifier whose sharpest clause is aimed at my own commit, and §3 mechanises
that clause into arithmetic that will count my entry among the 3.** I have written it to fire on me:
the entry is named in §3's list, and under the anti-gaming rule my exclusion is exactly the shape
that must be reported rather than assumed benign. **A non-author should check whether I softened it
anyway.** My own view is that the exclusion is correct on its merits and that this is irrelevant to
whether the rule should exist — but that is the view of the person who made it.

The packet also told me a refusal would be a real answer, which biases me toward returning one. **I
returned a partial refusal and merged what could be merged**, which is the harder of the two and, I
think, the honest one. §10 exists so someone else can decide.

---

## 10 · FOR THE NON-AUTHOR WHO ATTACKS THIS — where I think it is weakest, in order

1. **D adds three unlike things and calls the sum one number.** A mute tool, a broken tool and a
   broken test are not commensurable, and summing them means a lap can trade one for another. My
   defence is that the bar is `> 0`, so the sum never has to be interpreted — but if anyone ever
   argues about *how much* D fell, the sum is doing work it cannot bear. **Attack this first.**
2. **Merging two legs may be a category error I did not catch.** Leg 1 tests *shipped tools under
   empty state*; J's leg tests *the generated tree*. I require both to run inside the generated tree
   (§2), which makes them commensurable — **but B's Leg 1 was never run there**, and I did not run it
   there either. My §4 numbers come from the SOURCE tree. **If a tool behaves differently in the
   generated tree, M and B as I measured them are the wrong numbers under my own definition, and I
   have stated the definition I failed to meet.**
3. **The bar `D > 0` may be unreachable rather than strict.** If some parity break is genuinely
   irreducible, `D = 0` is an objective that can never be met, and a permanently-red channel trains
   the reader to skip it — the failure `js-suite.js`'s own canary comment names. I have kept `>0`
   because both authors chose it independently and because moving it is clause 3. **Someone should
   check whether that is discipline or stubbornness.**
4. **`I` counts test files, not defects.** A test file that ships but asserts nothing is invisible to
   both D and I.
5. **§5's O2 might be inventing an objective the room cannot hold.** I decomposed "reaches SEED" into
   two static checks and then said the third part has no instrument. A reader could reasonably say the
   whole objective should have been refused as unmeasurable rather than two-thirds accepted.
