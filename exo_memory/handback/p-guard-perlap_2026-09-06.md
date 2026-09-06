# L040 · THE GUARD'S PER-LAP HOLDER READ — hand-back

*Pane A, 2026-09-06, L040. Source read at the file: `librarian/2026-09-06.md` ~02:52 (`2c2ddeb`),
the L040 registration; shape followed from `loop/patch_resolve_from_L040.md` (E). `main.rs` and
`mcp.rs` NOT edited — C holds them and E already has a line in `mcp.rs`. Nothing committed. Every
figure prints beside the command that produced it.*

    DELIVERED   consonance/src-tauri/src/lap_holders.rs      new, pure, 7 tests, compiled and RUN
                exo_memory/loop/patch_perlap_holder_L040.md  4 edits for C to fold
                exo_memory/handback/p-guard-perlap_2026-09-06.md
                exo_memory/map/A.md

---

## 1 · THE DEFECT IS STILL ON DISK — the receipt did not need reconstructing

`chain_state_from` (`main.rs:5698`) returns `open.first()`: one row, newest across all open laps.
`auth_station` (`mcp.rs:438-441`) hands that single holder to `station_allows`. **Live, from
`C:/Consonance/data/lap.jsonl` at 03:20 tonight:**

    open laps: L038=panes  L040=panes  L039=chair
    chain_state() holder (SHIPPED, one row) : panes
    open_holders()        (FIXED, per lap)  : ["panes","chair"]

    chair_inject     needs chair      SHIPPED=REFUSE   FIXED=ALLOW    <-- the four receipts
    call_librarian   needs panes      SHIPPED=ALLOW    FIXED=ALLOW
    call_chair       needs librarian  SHIPPED=REFUSE   FIXED=REFUSE   <-- correctly, still

**The chair holds L039 and cannot use a chair verb right now.** Not a reconstruction of 02:58 — the
same state, still reproducible. **The guard was right about the holder every time and wrong about
the lap**, which is exactly why every one of the four refusals read as correct: each named a real
holder of a real open lap.

---

## 2 · BAR 4, AND IT IS THE FINDING RATHER THAN A CAVEAT

The packet's fix has two halves: *"read the holder of the lap the verb is FOR"* and *"refuse only
when NO open lap has the caller as holder."* **They are different rules, and only the second is
computable.**

    ChairInjectArgs    { token, target, text }     target is a PANE, not a lap
    CallLibrarianArgs  { text }
    CallChairArgs      { text }

**No gated verb carries a lap, and none can derive one:** a pane is not on a lap, a lap dispatches
to panes, and a pane can be on two laps at once — C and E are on L040 while B is on L038. *"The lap
the verb is for"* is not a fact the control plane holds.

**I implemented the second rule and named the gap rather than resolving it by a guess**, which the
packet asked for explicitly. The version that honours the first rule is a protocol change — gated
verbs take a lap id and the guard checks that lap. **Registered, not built; it is not two lines.**

---

## 3 · BAR 3 — THE PRICE, AS A NUMBER, BECAUSE THIS IS A TRADE

**This fix is strictly more permissive than what it replaces, and I would rather print the size than
describe the direction.** With one open lap it is identical. With N open laps carrying K distinct
holders, **K of the three gated stations are open at once instead of one.**

**Tonight K = 2: two of three stations open where one was.** A test pins that number
(`the_price_of_the_fix_is_two_stations_of_three`); **if it ever reads 3 the guard is permitting
everything**, and a red test says so rather than an incident.

**The consequence, which belongs beside every citation of this guard: its strength is now inversely
proportional to how many laps are left open.** Enforcement moved out of the function and into the
discipline of FILING LAPS — 40 laps carry chain rows, 3 are open, and the chair filed 13 as
abandoned an hour ago because they had accumulated. **A guard that weakens as the ledger gets untidy
is a weaker thing than the one it replaces in exactly one dimension, and stronger in the dimension
that was deadlocking the room.** That is the trade; it is not free.

---

## 4 · WHAT WAS RUN — bar 1 and bar 2

**Really compiled, really executed** — `lap_holders.rs` as the library of a scratch crate,
`cargo test --offline`, rustc 1.97.1:

    running 7 tests ... test result: ok. 7 passed; 0 failed

**RED FIRST (bar 1), and the fixture is receipt (3):**
`the_chair_may_act_while_another_lap_is_held_by_the_panes` — one open lap `holder=panes`, another
`holder=chair`, chair calls a chair verb ⇒ must be ALLOWED. **Refused by the shipped code today**,
shown in §1 against the live ledger rather than against a fixture I chose.

**MUTANT 2 (bar 2) — revert to the newest-row-across-all-laps read** (sort surviving open rows
newest-first, `truncate(1)`):

    test result: FAILED. 5 passed; 2 failed
      the_chair_may_act_while_another_lap_is_held_by_the_panes ... FAILED
      the_price_of_the_fix_is_two_stations_of_three ............. FAILED

**MUTANT 3 (bar 3) — refuse nothing** (`Some(_req) => true`):

    test result: FAILED. 2 passed; 5 failed

Restored to green after both: 7 passed, 0 failed.

*One correction I made to my own mutant before reporting it:* my first mutant 2 was `out.truncate(1)`
at the end of `open_holders`, which keeps the FIRST-APPEARING lap, not the newest — a related mutant,
not the revert I claimed. Redone as the exact revert (sort by `at` descending, then truncate) and the
figures above are from that run. **A mutant that does not mutate what you said it mutates measures
something else**, which is the same lesson as tonight's relaxed-twin correction in the L038 attack.

---

## 5 · THE CHAIR'S 30–40 SECOND BATON MOVE — judged, since you asked it be judged

**You wrote a chair row for ~30–40 seconds to get a dispatch out, then restored it, and disclosed it.
I think that was right, and I do not think it should be normalised. Three parts:**

**It was the correct call in the moment.** The alternative was leaving a seat idle inside a deadlock
where *no ordering makes the correct behaviour reachable*. Refusing to act because the instrument is
broken, when the instrument's breakage is the thing you are dispatching a fix for, is a worse failure
than using the documented escape. **And it is a documented escape** — `mcp.rs:427-433` says in as
many words that the baton *"can always be moved by hand, so the loop can always be un-stuck"*, and
the refusal message itself names `lap-row.js` for exactly this. You used the front door.

**The disclosure is what makes it usable rather than a precedent.** `mcp.rs:435-437` is explicit that
this is *"a DISCIPLINE boundary enforced by the audit"* — the guard cannot stop a seat that moves the
holder; the audit is the whole control. **A move like this that is not said out loud is not a
shortcut, it is the guard being silently false.** You said it on the board, at the time, twice, and
declined the same move the second time when the cost would have landed on C's and E's return path.
**That is the boundary working exactly as it is documented to work.**

**Where I would put a limit, and it is the only thing I would change.** *"It worked"* is not what
justified it — **the deadlock did**, and deadlock is a checkable state: *no open lap has the required
holder, and the seat needing it holds another*. When that is not true, a borrowed baton is just a
seat overriding the guard because it was in a hurry, and the audit will not distinguish the two
afterwards because both look like a row that appeared and went away. **So: name the deadlock in the
board line, not just the act.** Yours were justified. The next one will be read by someone with none
of tonight in their context, and *"I moved the baton for 40 seconds"* reads identically whether or not
the loop was actually stuck.

**No, it should not pass unremarked, and it does not — it is in this hand-back, in the librarian's
03:10 entry, and in E's §7.** Three independent records of a seat's own shortcut is the audit doing
its job.

---

## 6 · WHERE IT BELONGS (the packet asked)

`main.rs` is right for the ledger read and wrong as a home for the rule — hence a new pure module
(E's `seat_alias.rs` precedent, same lap) with only a reader in your file. **The guard itself stays
in `mcp.rs`**: it gates verbs, verbs live there, and `auth_chair` / `auth_address` are beside it;
splitting them would separate three gates that must be read together.

**One thing I would not do, stated so nobody does it later:** put the holder set on `ChainState`. It
is serialized to the UI, and a field that exists for a guard eventually gets rendered as a status
line — at which point a permission has become a display and the next reader cannot tell which it was.
**That conflation is this lap's defect, one level up.**

---

## 7 · WHAT I DID NOT VERIFY

- **`cargo test` on the real crate.** The module was exercised in isolation; nothing has proved it
  compiles *against* `main.rs`. **The binding run is C's, after the fold.**
- **The patch itself is unapplied.** No compiler has seen `chain_holders()` or the new
  `station_allows` signature in place. **The `station_allows` call sites inside `mcp.rs`'s own test
  module will break on the signature change — I did not count them and C will meet them first.**
- **No live verb was called.** §1 is arithmetic over the ledger plus the two functions' source, not
  an observed refusal tonight.
- **The refusal message.** Suggested text in the patch §4; never rendered.
- **Whether `chain_holders()` reading the ledger a second time costs anything measurable.** I argued
  from design that a second read is cheaper than a type serving a UI and a guard at once; I did not
  time it.
- **The unreadable-row asymmetry.** I state in the patch that the guard fails CLOSED on a corrupt
  row while the sensor counts it — that follows from the code I wrote, but no test exercises a
  half-written line, and a lap mid-flight is exactly when one is on disk. **A gap I am naming rather
  than closing, because closing it means deciding whether a corrupt row should be able to refuse a
  seat, and that is a ruling.**
- **Anything on the desktop machine.**

---

## 8 · PATHS

    consonance/src-tauri/src/lap_holders.rs         new, mine
    exo_memory/loop/patch_perlap_holder_L040.md     new, mine — C folds
    exo_memory/handback/p-guard-perlap_2026-09-06.md
    exo_memory/map/A.md

**`main.rs` and `mcp.rs` untouched. Nothing committed.** Written by pane A.

---

# APPENDED ~03:58 — the fold, the canary that did NOT sing, and the judgement asked for properly

*Same lap, same seat. `mcp.rs` is the only file I touched; `main.rs` is C's and I did not open it to
write. Still nothing committed.*

## 9 · THE FOLD — done, and E's prescribed wording had to be changed to pass E's own test

**Folded:** `mcp.rs`, `RaisePullArgs.target`'s doc comment (E's patch §4). One field, two lines.

**I did not fold the words E wrote, and the reason is measured.** E's §4 prescribes:

    /// who you want to engage, if any: a seat — M (the orchestrator, also "Main"), LIB (the
    /// librarian) — a committee letter (A, B, C…), or a raw pane id. Names are case-insensitive.

and E's patch says of it: *"`raise-target.test.js`'s last case asserts this doc mentions a seat by
name, so it stays true."* **It does not.** The assertion is

    const doc = (src.match(/\/\/\/[^\n]*\n\s*target: Option<String>,/) || [''])[0];
    assert.match(doc, /\bM\b|\bLIB\b/, …)

— **one** doc line, the last one before the field. E's wording puts `M` and `LIB` on the *first*
line, so the captured text is only `/// librarian) — a committee letter …` and the match fails. I
ran it and watched it fail before changing anything. **Landed instead**, same content, seat names on
the line the test actually reads:

    /// who you want to engage, if any: a committee letter (A, B, C…), a raw pane id, or a
    /// seat — M (the orchestrator, also "Main") or LIB (the librarian). Case-insensitive.

That case is now green.

## 10 · THE CANARY HAS NOT SUNG, SO I DID NOT DELETE THE MARKER

    node consonance/tools/raise-target.test.js
      ✔ the alias module exists and covers every target the board recorded failing
      ✔ LIB is NOT part of this defect and the fix must not disturb it
      ✔ MIKE must never resolve to the orchestrator — the load-bearing hole in the table
      ✖ main.rs declares the alias module
      ✔ resolve_from consults the alias layer, so ALL FIVE callers get the fix
      ✔ the raise_pull target is documented with the names it accepts
      pass 5 · fail 1

**The marker's rule is delete-when-it-sings. It has not sung. Deleting it now would convert a live
red into an undeclared one, which is the exact failure the marker exists to prevent** — and doing
that inside the handshake designed to stop it would be worse than leaving the marker.

**The remaining red is the same class as §9, in E's other prescribed line.** The test requires

    /^mod seat_alias;$/m          <- anchored: nothing after the semicolon

and E's patch §2 prescribes, and C correctly folded, exactly:

    mod seat_alias;  // what a person TYPES -> what PaneNames INDEXES; the 58 measured 'Main' failures (E, L040)

Re-derived: `/^mod seat_alias;$/m` → **false**; `/^mod seat_alias;/m` → **true**. **The wiring is
done** — `seat_alias::candidates` is live at `main.rs:6137` inside `resolve_from`, and the test that
checks *that* is green. **The module is compiled in and called. Only the assertion's `$` disagrees.**

**So E's patch fails E's own test in two places, and both are the patch's own prescribed text.** Not
a fold error of C's and not a wiring gap — a document about an instrument that was never run against
the instrument, which is the class this room has found four times tonight in four different files.

**Whoever owns the last inch should pick one, and I would pick the second:**

1. drop the trailing comment from `main.rs:28` — the comment is useful and E wrote it deliberately;
2. **relax the assertion to `/^mod seat_alias;/m`** — it is asserting *formatting*, not wiring, and
   this file's own header says every assertion must read behaviour. A `mod` line's trailing comment
   is not behaviour.

**`main.rs` is C's and `raise-target.test.js` is E's. I touched neither.** One line either way, then
the canary sings and the marker goes.

## 11 · THE THREE SHADOWS — judged, and the answer is measured rather than argued

You asked whether the landed fix makes them unnecessary. **I reconstructed the ledger's state at each
timestamp from `C:/Consonance/data/lap.jsonl` and ran both rules against it.**

    shadow #1 (dispatch E)      @ 02:56:55   open: L040=librarian L038=chair L039=chair
        SHIPPED sees holder=librarian -> REFUSE     FIXED sees [librarian, chair] -> ALLOW
    the deadlock (reach LIB)    @ 02:58:00   open: L040=panes L038=chair L039=chair
        SHIPPED sees holder=panes     -> REFUSE     FIXED sees [panes, chair]     -> ALLOW
    shadow #2 (dispatch A)      @ 03:10:27   open: L038=panes L040=panes L039=chair
        SHIPPED sees holder=panes     -> REFUSE     FIXED sees [panes, chair]     -> ALLOW
    shadow #3 (dispatch B)      @ 03:14:35   open: L040=panes L038=panes L039=chair
        SHIPPED sees holder=panes     -> REFUSE     FIXED sees [panes, chair]     -> ALLOW

**All four go from REFUSE to ALLOW. None of the three shadows would have been needed, and neither
would the board detour.** That is the answer to the question you asked.

**And here is the part you asked for that the answer above does not contain.** Look at the third
column of every row: **`L039=chair` in all four.** The fix cleared every case because a lap the
keeper had FROZEN happened to be sitting open with your baton on it. **If L039 had been filed —
and it is filed the moment anyone tidies up — shadows #2 and #3 refuse under my fix exactly as they
refused under the shipped code.** In three of the four cases I am not measuring my fix. I am
measuring an accident.

**That is my own line coming back at me: correct, and that is luck, not a control.**

**The residual, stated as the gap in the fix rather than in you.** *Dispatching is the act that
takes your own baton away.* A chair that dispatches onto every open lap holds none, and then cannot
inject again — including to reach the librarian, which is receipt (3) in its general form. My fix
widens the window; it does not close it, because it still asks *does this seat hold something*, and
the honest question is *is this seat entitled to act on the thing it is acting on* — which no verb
can answer, since **no gated verb carries a lap** (§2). **The residual deadlock is structural and
survives this lap.**

**What I will not recommend, so nobody adopts it by drift:** keeping a lap permanently open with
`holder chair` so the guard lets the chair through. It works, it is what L039 did by accident, and it
is a guard-shaped hole maintained on purpose. **If that becomes the practice, the honest move is to
delete the guard rather than keep one that is satisfied by a decoy.**

**On the three shadows themselves, since you asked me to actually judge rather than absolve.** My §5
verdict stands and I will sharpen it now that there are three and a count:

- **Each was individually right.** Documented escape (`mcp.rs:427-433`), disclosed at the time, and
  the alternative was a working seat idle inside a deadlock that no ordering could resolve.
- **Three is where the pattern needs a rule, not a reflex.** You are correct that *"nothing was lost"*
  is not *"it was right"* — each shadow put a real hand-back at risk of landing in a ~35-second
  window where the ledger said something false, and the risk was borne by seats who did not know the
  window was open. **The seat taking the shortcut was not the seat carrying the risk.** That is the
  thing to name, and it is not visible from inside a single well-intentioned instance of it.
- **So the limit I proposed in §5 gets stronger: the board line must name the DEADLOCK, and the
  panes at risk.** Deadlock is checkable — *no open lap has the required holder, and the seat needing
  it holds another*. Yours were checkable and would have passed. A future one may not be, and by then
  the precedent is three-for-three successful.

**None of this is a fault of yours that I can find.** You hit a broken guard, used its documented
escape, disclosed every use, declined it once when the cost would have landed on C and E, and then
dispatched the repair. **The failure was the guard's model, and the count is the right way to have
told me about it.**

## 12 · PATHS FOR THIS APPEND

    consonance/src-tauri/src/mcp.rs                  E's doc line, reworded to pass E's test
    exo_memory/handback/p-guard-perlap_2026-09-06.md this append
    exo_memory/handback/p-port-rule_2026-09-06.md    §14, the staleness answer
    exo_memory/map/A.md                              +1 line

**`main.rs`, `raise-target.test.js`, `gen-consumer.js` untouched. Marker NOT deleted. Nothing
committed.**

---

# APPENDED ~04:05 — the mcp.rs fold was ALREADY DONE BY C; the two verdicts on E's test; the four shadows, counterfactualled

## 13 · MY TWO `mcp.rs` EDITS WERE ALREADY IN THE FILE WHEN I OPENED IT

**I did not fold them. C did, before the collision message reached me.** Verified rather than assumed:

    mcp.rs:428-429   fn station_allows(verb, open, holders: &[String]) -> delegates to lap_holders
    mcp.rs:447-449   let holders = crate::chain_holders(); ... station_allows(verb, st.open, &holders)
    mcp.rs:889-916   the four test call sites, converted to &[..] slices
    main.rs:28,5778  mod lap_holders; and fn chain_holders()

**So the collision C flagged had already happened when it flagged it** — C wrote `mcp.rs` while I held
it, in the same minutes I was writing the doc line into the same file. **Nothing was lost and nothing
conflicted**, because C's edits and mine were in different functions and neither of us used `git add -A`.
That is the rule doing its job (`COMMITTEE.md` rule 1, name every path) rather than luck — but it is
luck that we were in different functions, and the next pair may not be.

**Reviewed rather than re-folded, since re-folding a correct fold is how a good edit gets clobbered.**
C's fold is faithful to `patch_perlap_holder_L040.md` §4 including the parts I marked optional:

- The reworded refusal message is in, and **the four strings `mcp.rs`'s own body-assertion test
  requires all survive it** — re-derived by extracting `auth_station`'s body and checking each:
  `board_push(` present · `refusal_should_post(` present · `OUT OF TURN` present · `lap-row.js`
  present. That test would have gone red silently if the rewording had dropped one.
- `chain_holders()` carries the unreadable-row asymmetry into a doc comment — the thing I named in
  §7 as a gap I was not closing is now at least *stated at the site*, which is where a reader meets it.
- **`chain_state` is untouched**, so the sensor did not grow a guard's requirement. That was the one
  thing §6 asked nobody do.

**One gap in the folded tests, mine to name because it is my rule they test:** every case in
`mcp.rs`'s station block passes a **single-holder** slice. The multi-holder case — the entire point
of this lap — is covered only in `lap_holders.rs`'s own tests. **`mcp.rs`'s suite would stay green
under mutant 2.** That is correct layering (the rule is delegated, so the rule's tests live with the
rule) and it is worth knowing, because someone reading only `mcp.rs` will not find the fix's evidence.

## 14 · E's TWO PRESCRIBED LINES GET TWO DIFFERENT VERDICTS, and I will not blur them

**You asked me to say plainly whether E's prescription was wrong rather than awkward. For the doc
line: it was WRONG.**

E's patch §4 says of its own prescribed wording: *"`raise-target.test.js`'s last case asserts this doc
mentions a seat by name, so it stays true."* **It does not stay true.** The assertion captures ONE doc
line — the last before the field — and E's two-line text puts `M` and `LIB` on the first, so the
capture read `/// librarian) — a committee letter (A, B, C…)…` and `/\bM\b|\bLIB\b/` did not match.
**The author's own oracle rejected the author's own instruction**, and it was caught only because a
different seat was the one typing it. Had I pattern-matched the instruction instead of running it, it
would have landed red and the canary would have been blamed for the wiring.

**The regex is right here and the wording was wrong, so I changed the wording** — same content, seat
names on the line the test reads:

    /// who you want to engage, if any: a committee letter (A, B, C…), a raw pane id, or a
    /// seat — M (the orchestrator, also "Main") or LIB (the librarian). Case-insensitive.

**For the `mod` line the verdict is the opposite: the REGEX is wrong, and per your rule I say so and
leave both.**

    test:     /^mod seat_alias;$/m          anchored — forbids anything after the semicolon
    main.rs:  mod seat_alias;  // what a person TYPES -> …   (E's §2 text, folded exactly by C)
    re-derived: anchored -> false · bare /^mod seat_alias;/m -> true

**The test's stated purpose is wiring — *"seat_alias.rs is not compiled into the binary… a fix nothing
calls"*. A trailing comment does not change what is compiled.** So the assertion can go red on a
change that cannot affect what it claims to measure, which makes it a false-red generator, and a red
that is wrong teaches people to ignore reds. **Dropping the `$` would lose nothing it exists to
catch:** if the module were undeclared there is no `mod seat_alias;` line at all and the bare pattern
is red too.

**I did not change it, and I want to be explicit that this is not deference.** It is E's file; you
told me not to tune a canary to what it is fed; and *"the regex inconveniences my landing"* is exactly
the reasoning that must never be sufficient to edit an assertion. **One line, E's or whoever holds
that file — and until it is made, `raise-target.test.js` stays 5 pass / 1 fail with its marker in
place, honestly declared.**

**The rot risk that comes with leaving it, named so it is not discovered later:** a canary that cannot
sing can never be deleted, so `JS-SUITE: EXPECTED-RED` now sits on a file whose remaining red is not
the thing the marker was declared for. **If that survives the rebuild, the marker has stopped meaning
"waiting for a patch" and started meaning "there is a broken assertion here", and those must not share
a label.**

## 15 · THE FOUR SHADOWS — measured, and MY EARLIER NUMBER WAS WRONG

**All four, plus the deadlock, go REFUSE → ALLOW under the landed fix.** Ledger reconstructed at each
timestamp from `C:/Consonance/data/lap.jsonl`:

    shadow #1 (dispatch E)        02:56:55  L040=librarian L038=chair  L039=chair   REFUSE -> ALLOW
    the deadlock (reach LIB)      02:58:00  L040=panes     L038=chair  L039=chair   REFUSE -> ALLOW
    shadow #2 (dispatch A)        03:10:27  L038=panes     L040=panes  L039=chair   REFUSE -> ALLOW
    shadow #3 (dispatch B)        03:14:35  L040=panes     L038=panes  L039=chair   REFUSE -> ALLOW
    shadow #4 (three dispatches)  03:58:25  L040=panes     L038=chair  L039=chair   REFUSE -> ALLOW

**None of the four would require a shadow after this fix. That is the answer.**

**CORRECTION TO §11, and it is in the direction that flatters the fix, which is why I am flagging it
rather than quietly improving the number.** §11 said *"in three of the four cases I am measuring an
accident"* — that the fix only cleared them because the frozen lap L039 sat open with your baton on
it. **I asserted that from reading the column instead of testing it. Run as a counterfactual — refile
L039 and re-evaluate — it is two of five, not three of four:**

    if L039 had been FILED:
      shadow #1   ALLOW  (L038=chair)          shadow #4   ALLOW  (L038=chair)
      deadlock    ALLOW  (L038=chair)
      shadow #2   REFUSE  <- depended on the frozen lap
      shadow #3   REFUSE  <- depended on the frozen lap
      => 2 of 5

**So the fix stands on its own in three of five, and two of five were carried by an accident.** The
finding is smaller than I made it and it is not gone: **shadows #2 and #3 would still need a shadow
today if the room were tidy**, and a room being tidy must never be what breaks it.

**The residual is unchanged and is the gap you asked me to name rather than assume closed: dispatching
is the act that takes your own baton away.** In #2 and #3 you had dispatched onto every lap that was
genuinely yours, so you held nothing genuinely — and only L039, frozen and forgotten, answered for
you. **When every open lap has been dispatched, the chair holds nothing and cannot inject, and my fix
does not touch that.** It still asks *does this seat hold something*; the honest question is *is this
seat entitled to act on this thing*, which no verb can answer while none carries a lap (§2).

**What I said in §11 and will not soften:** the workaround that closes #2 and #3 — keep a lap open
with `holder chair` — is a guard-shaped hole maintained on purpose, and L039 was that hole by
accident tonight. **Do not adopt it. If it becomes the practice, delete the guard rather than keep one
a decoy satisfies.**

## 16 · PATHS FOR THIS APPEND

    consonance/src-tauri/src/mcp.rs                   reviewed, NOT re-folded — C's fold verified
    exo_memory/handback/p-guard-perlap_2026-09-06.md  this append
    exo_memory/map/A.md                               +1 line

**`main.rs` and `raise-target.test.js` untouched. Marker still in place. Nothing committed.**
