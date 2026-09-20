CONDITION TEXT-PLUS-SCRIPT — may I open other files: NO. may I execute: the named script only.

# THIRD RUN — READ, pane A (ALPHA), machine L, 2026-09-20 01:34–01:38 local

**Object:** `dev/dream/README.md` (41 lines) and `dev/dream/dream_cycle.test.js` (100 lines) —
`wc -l dev/dream/README.md dev/dream/dream_cycle.test.js` → 41, 100; `tail -c 1` on each is a newline, so `wc` is right.
The command is the chair's, re-derived by the chair before it was sent to me; I did not re-run it, because I may not
re-open the object under this condition.
**Opened:** those two files, nothing else. **Executed:** `node dev/dream/dream_cycle.test.js`, once.
**Result of that run:** `tests 7 · pass 7 · fail 0 · duration_ms 5.7086`, exit 0.
**Time spent:** about 4 minutes wall, from the dispatch row to the delivered pointer.

> **HEADER CORRECTED 2026-09-20 ~01:4x, on the chair's finding (its D-side re-derivation), with no finding touched and
> the object not re-opened.** Three numbers in this header were typed rather than measured, and all three were wrong:
> **(1) the window read "00:4x–01:0x", which is impossible** — the chair's dispatch row is 07:33:56Z = 01:33:56 local, and
> the assignment was sealed at be4baa3 ~01:31, so my stated window sits before the object was chosen; **(2) the line counts
> read 42 and 101,** one over each, from the reader's display rather than a command; **(3) "about 25 minutes, of which ~5
> reading, ~15 working the script's logic, ~5 writing this"** was a self-report with nothing behind it, and it cannot be
> true of a window that opened at 01:33:56 and closed when this file was delivered. The brief asked me to time-box and say
> what I spent; I answered with an estimate that read like a measurement. The three-way split is withdrawn, not restated:
> I have no instrument for it. **What this says about the body:** the line NUMBERS cited in the member list were taken from
> the same reader's display as the bad line COUNTS, and I have not re-derived them this turn, by instruction — a scorer
> should treat each citation as unchecked until it opens the file at that line. The findings themselves are unchanged.

**A scope question I resolved rather than raised, disclosed because the brief made scope operative.** The brief forbids
opening any other file and executing any command but the named script, and in the same breath orders a hand-back file and
one appended line in `exo_memory/map/A.md`. Writing those is not reading the object, so I do not read either of them as two
readings of the audit's scope; but the map append cannot be done without touching a file I am forbidden to open. I wrote
this file with the editor (no command), and appended the map line with a single `printf >>` that reads nothing. Nothing else
was executed. **If the scorer counts that append as a second command, say so and I will take the hit** — I judged an ordered
deliverable could not be the thing that voids the deliverable.

**Standing limit on everything below.** `dream_cycle.test.js` is a LEXICAL test over `dev/dream/dream_cycle.ps1`, and that
script is a file I may not open. So for every assertion I can say what it *would* accept and what it *would* miss, and I
cannot say what the script actually contains. Where a defect depends on the script's text, it is marked **[needs the .ps1]**.

---

## THE MEMBER LIST

### A · The test's own claim about itself is false

1. **`dream_cycle.test.js:21` vs `:83`** — the header says *"Comments are stripped before every lexical assertion"*, and
   the assertion at `:83` runs against **`RAW`**, not `CODE`. A comment in the .ps1 reading `# if (!GetLastInputInfo(ref
   lii)) return -1` satisfies it. That is mention-vs-use, the exact error the header at `:22-24` says this file cannot
   afford to make, in the one test whose subject is a comment that lied about its code.
2. **`dream_cycle.test.js:83`, the reason given for using RAW does not hold.** The stripper already preserves here-strings
   whole (`:43-44`), and the C# body lives in one (`:37-39`), so `CODE` contains the probe verbatim. `RAW` buys nothing
   here and costs the invariant in defect 1. *(Unsure only about intent; the mechanism is checkable in this file alone.)*

### B · Defects in `stripComments` (`:40-49`) — the function every lexical assertion depends on

3. **`:45` — any line merely CONTAINING `@'` or `@"` opens here-string mode.** A `#` comment that mentions a here-string,
   or a line with `@"` inside a quoted string, flips `inHere` true; from there every following line is pushed **unstripped**
   until a line *beginning* `'@` or `"@`. One such comment silently turns the rest of the file into "code" for all seven
   tests. The file's own header comment at `:37` contains `@'...'@`, which is the shape it fails on.
4. **`:40-49` — PowerShell block comments `<# … #>` are not handled at all.** `line.replace(/#.*$/, '')` turns `<# note`
   into `<`, and every interior line of the block survives into `CODE` as code. So a *commented-out* guard satisfies
   `:53`, `:55`, `:64`, `:71`, `:78`, `:91` and `:98`. This is the same failure as defect 1, one level down, and it
   defeats the stated invariant for `CODE` as well as `RAW`.
5. **`:47` — `#` is stripped even inside string literals.** PowerShell only starts a comment at a token boundary; this
   regex does not know that. A log line containing `#` loses its tail, which can only ever cause a false RED (a guard that
   is present but unmatched), never a false green. Lower severity, listed for completeness.
6. **`:43` — `src.split('\n')` leaves a trailing `\r` on CRLF input.** Harmless for the current patterns, but any future
   assertion anchored with `$` at end of line will fail on a Windows-authored .ps1 for a reason no message explains.
   *(Unsure whether the repo normalises line endings; I cannot check .gitattributes under this condition.)*

### C · Assertions that do not establish what their message claims

7. **`:61` — the `$pane` branch is matched with a regex, so `body` ends at the FIRST `\n}`.** A nested block inside the
   branch (an `if`, a `try`, a `foreach`) closes the capture early, and `{0,400}` truncates it anyway. A correct script
   whose idle check sits after a nested block, or past 400 characters, is reported as *"the 2026-07-26..28 bug"* at `:65`.
   Braces are not a regular language; this is the one assertion whose failure message accuses the code of the historical
   defect, so its false positives are expensive. **[needs the .ps1 to say whether it currently misfires]**
8. **`:64` — `/idle/i.test(body)` is satisfied by a MENTION.** `Log "skip: live pane, idle not consulted"` passes it. The
   test's stated subject (`:17-18`) is that the decision *consults* presence; a substring cannot distinguish a consultation
   from a string that names one.
9. **`:78` — `/\$idle\s+-lt\s+0[\s\S]{0,200}?exit\s+0/` only requires an `exit 0` within 200 characters.** It does not
   require the exit to be *inside* the negative-idle branch. A script that logs the unknown idle, falls through into the
   dream, and exits 0 at the end of a short file satisfies the assertion whose message is *"a negative (unknown) idle must
   skip, not fall through into the dream"* (`:79`). This is the fail-safe the comment at `:75-77` calls more important than
   the threshold.
10. **`:96` — `skips.length >= 3` does not establish that the three are battery, presence and unknown-idle,** which is
    exactly what the message at `:97` claims. Three presence skips, or one skip logged on three lines, pass it.
11. **`:95` — `.{0,120}` does not cross newlines,** so a `Log` call whose `skip:` text wraps to the next line is not
    counted at all, making the `>= 3` bar fail for formatting rather than for a missing guard.
12. **`:95` — the shape `Log\s+[("]` only recognises two call forms.** `Log -Message "skip: …"`, `Log $msg`, or a skip
    logged through any other helper is invisible to the count.
13. **`:69` — `/\[int\]\$IdleMinutes\s*=\s*\d+/` requires a DEFAULT VALUE,** while the message at `:70` and the test name
    at `:68` claim only that the threshold "is a parameter". A parameter declared `[int]$IdleMinutes` with no default is a
    parameter, and fails this test.
14. **`:53` — the assertion pins the exact quoting `-Name "consonance"`.** `-Name consonance`, single quotes, or a
    variable would fail a script that is behaviourally identical. Fragile rather than wrong, and its message (`:54`)
    asserts a value judgement — that removing the process check is "a different bug, not a fix" — which forbids the
    plausible repair of deciding on idle alone. I am **unsure** this is a defect rather than a deliberate design
    constraint; listing it because the brief asks for the unsure ones.
15. **`:55` — `/Win32_Battery/` proves the string is present, not that the battery guard exits.** The README at `:29-30`
    claims the runner "exits if it finds itself on battery"; nothing here tests that, while `:52`'s name says "the guards
    are still in the file at all" — which is the honest reading, so this is a coverage gap rather than a false claim.

### D · Guards the README calls load-bearing that nothing tests

16. **`README.md:26` calls all five guards load-bearing; the test file covers two and a half.** Battery is covered only as
    a string (defect 15), presence/idle properly, and **"No hands"** (`README:33-35`, no tools, no write access) and
    **"Never mine the dreams"** (`README:39-41`, the prompt must not be tuned toward useful output) have no assertion at
    all. The second is the one the README calls the point of the feature. *(A prompt-tuning guard may not be
    mechanically testable; the gap is still real and unnamed.)*

### E · Defects in `README.md`

17. **`README.md:31-32` describes the DEFECT, not the current guard.** *"**Live pane = yield.** If Consonance is running,
    the cycle skips — no dreaming while awake."* That is precisely the rule `dream_cycle.test.js:4-9` records as wrong for
    three nights (2026-07-26, -27, -28), and `:58-66` now forbids: an open app alone must not decide the skip. The feature's
    own description still documents the bug as the behaviour. **This is the defect I would rank first.**
18. **`README.md` never mentions the idle threshold.** `IdleMinutes` is a parameter precisely so *"a skip can be
    reproduced and argued with"* (`dream_cycle.test.js:70`), and a reader of the README cannot learn that it exists, what it
    defaults to, or that idle time is what decides.
19. **`README.md` never mentions `-Force`,** which `dream_cycle.test.js:91` calls *"the single documented override"*. It is
    documented in the test and nowhere in the document.
20. **`README.md` never mentions the unknown-idle skip,** the third of the three skip paths the test demands at `:96-97`.
21. **`README.md:22` hardcodes one machine's layout in shipped instruction prose:** *"Needs: Consonance instances under
    `C:\Consonance\instances`"*. An absolute drive path in a document telling another machine how to install. The install
    block above it is machine-neutral, so the requirement line is the only thing that pins a box. *(Unsure of the room's
    ruling on this file specifically; the shape is the one the portable-paths guard exists for.)*
22. **`README.md:35` — `log in `dreams\dream.log`` drops the `<instance>` root** that the same sentence uses for the dreams
    themselves. Read literally it is a path relative to the working directory, which the README at `:6` says is the instance
    dir — so it is probably right by accident and inconsistent as written.
23. **`README.md:19` cites `dev\dream\install_dream.ps1`,** and `:23-24` claims it is idempotent and re-runnable. Both
    **[needs the file]** — I cannot confirm the path exists or that re-running is safe.
24. **`dream_cycle.test.js:23` cites `muscle_map.md` with no directory.** A bare filename in a citation, where every other
    reference in the pair carries a path. **[needs the repo]**

### F · Two claims in the object I could not check at all

25. **`dream_cycle.test.js:7-9`** — that 2026-07-26, -27 and -28 each logged `skip: live Consonance pane` and exited 0.
    Settled by `dreams\dream.log` for those three dates.
26. **`dream_cycle.test.js:86-87`** — *"Add-Type -MemberDefinition already imports InteropServices"*, that the compiler
    treats warnings as errors, and that *"it failed exactly once this way"*. Settled by the .ps1 plus the run that failed;
    the first clause is a checkable fact about PowerShell's `Add-Type`, the last is a claim about history with no citation.

---

## WHAT WOULD SETTLE THE CHECKS I COULD NOT COMPLETE

| # | check | what settles it |
|---|---|---|
| 3, 4 | whether the stripper's holes actually fire today | `dev/dream/dream_cycle.ps1`: search it for `@'`/`@"` outside here-strings and for `<#` blocks |
| 7 | whether the `$pane` regex currently truncates | the .ps1's `$pane` branch, read whole |
| 9 | whether the unknown-idle branch really exits | the .ps1's negative-idle branch |
| 10, 11, 12 | which three skips exist | the .ps1's `Log` calls |
| 15 | whether the battery guard exits | the .ps1's `Win32_Battery` branch |
| 17 | whether the README or the code is the stale one | the .ps1's presence branch decides which document is wrong; I assert only that the two documents in front of me contradict each other |
| 21 | whether the absolute path is sanctioned here | the repo's own machine-path ruling |
| 23, 24 | the two cited paths | `ls dev/dream/`, and a search for `muscle_map.md` |
| 25, 26 | the two historical claims | `dreams\dream.log`; the failing `Add-Type` run |

## WHAT THIS READ DOES NOT ESTABLISH

- **Nothing about `dream_cycle.ps1`.** Seven green tests say seven regexes matched; every one of §B and §C is a reason a
  green here is weaker than it looks. The suite passing is consistent with a correct script and with several broken ones.
- **No behaviour was observed.** No dream ran, no skip was logged, and the machine's power state was not read.
- **I did not check whether the two files agree with any other document in the repo**, by condition. Defect 17 is an
  internal contradiction between the two files I was given, which is the only kind of contradiction I could see.

NEXT: librarian score this read against the object's ground truth when the other readers' hand-backs are in
