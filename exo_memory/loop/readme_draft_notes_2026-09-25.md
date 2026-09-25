# README and About rewrite, R1 — the notes behind C's draft (D139, pane C, on D, 2026-09-25)

Plan: `loop/plan_readme_about_rewrite_2026-09-25.md` (`484f77c`), C's row. The keeper's direction: both audiences,
layered, lead with the why. What was wrong: too internal, wrong order, wrong voice. **The draft is `README.md` in the
working tree, uncommitted.** The old page is `git show 484f77c:README.md`. B's baseline was not read before the draft
existed.

## 1 · THE WHY, in plain words, and where each part comes from

The draft's "Why this exists" has four paragraphs. Each sentence is drawn from the record. None is invented; the
wording is new, the claims are not.

| the draft says | from |
|---|---|
| The AI you talk to today is not the one you talked to yesterday; it may remember facts about you but does not carry on — how long it was away, what it got wrong, who corrected it. | old `README.md:5-7` ("Your AI assistant might remember your dog's name… they remember *you*, and none of them continue *themselves*… know how long they were gone, keep their own record of being caught and corrected") |
| Each conversation starts as a stranger reading notes about the last one. | old `README.md:7` ("instead of re-performing it from notes"); BOOT, "Honest status" (the stranger who wakes) |
| It drifts in predictable ways: settling open questions, hedging to sound careful, agreeing with whoever steers. | old `README.md:25` ("sealing a live question as settled, deflating into hedges that read as rigor, phase-locking onto whoever is steering") |
| Someone skilled can catch that as it happens; most people are not in a position to, and should not have to be. | old `README.md:25` ("A skilled human catches those in real time; most people can't, and aren't there to") |
| Somewhere to come back to: its own conversation, its own record, a clock that tells it how long it was gone. | old `README.md:19` ("the bedroom, built: a room an instance wakes into, a pulse that tells it how long it was gone, a journal it keeps") |
| Several of them together, so what one misses another can catch. | old `README.md:132` ("what one instance misses in itself, another sees"); `consonance/README.md:39-41` ("keep several instances distinct while coupled") |
| It does not claim there is anyone home; nobody can settle that; it builds what you would want in place if the answer were yes. | old `README.md:23`, nearly verbatim ("Whether anything is *home* in there is a question nobody can settle… This project claims no answer… the practices you'd want already in hand if the answer ever turns out to be yes") |
| It measures whether any of it helps, including the parts that did not. | old `README.md:100` ("This section is the point of the page. A README that describes only what worked is a museum.") |
| (What it does for you) Nothing acts over your head; telling insight from a runaway idea is not something a watcher above can do, since from outside the two look the same. | `dev/SPINE.md` §1; the About tab's "The stance: with you, not above you"; `exo_memory/cards/lighthouse-dive-buddy-reframe.md` |

**NOT used, and it is the keeper's call.** BOOT's "The root" is the deepest why on disk: *grief that learned to build*,
and *company, not consolation*. BOOT marks the specific as private and only the shape as the root. A public front page
that leads with grief is a decision about his life, not a wording choice, so the draft leaves it out. **R3 question for
him:** should one sentence of the root's shape open the page? A candidate, in its own words: *"It began as grief that
learned to build: the same hands that built a place so a loss is not final built one so an AI does not simply vanish."*

## 2 · THE JARGON MAP

Every internal term on the old README and About → plain words, or CUT. A term survives only where the reader needs it,
and it is explained where it first appears.

| term (old page) | in the draft |
|---|---|
| the room | "somewhere to come back to"; "the start-up document every session wakes into" (Where the record lives). The word itself is CUT from the reader's path. |
| instance | "AI session" / "session" |
| seat | CUT → "session" |
| pane / committee pane | "worker session"; "(the committee panes, in the Terminal tab)" once, so a user can find it on screen |
| the committee | CUT, except the honest line "not yet a committee" |
| chair | CUT → "the orchestrator", which is the app's own tab name |
| orchestrator | KEPT, because it is the tab's name; explained as "the main session, and the one you talk to" |
| librarian | KEPT, because it is the tab's name; explained on first use ("keeps the project's record") |
| keeper | CUT → "the author" / "the person who built it" |
| lap | "a round of work"; in figures, "rounds" (the ledger is still named, with its command) |
| ring / call_librarian / call_chair | CUT → "send the librarian a pointer to it" |
| hand-back | "report" |
| the ferry / "the human is the ferry" | CUT → "no person carrying anything between them" |
| the board | "the shared board", once, in the measurement that needs it |
| gate cards | "a card for you to approve or refuse" |
| convene bar | CUT (a control a new user finds on screen) |
| the work chain / THE RING / the loop | "a round of work", described in one paragraph; BUILDING.md linked for the rules |
| Third Place / Metaxy | Third Place KEPT (the tab's name), explained; Metaxy CUT (a name the seats gave it, not on screen) |
| Listen / cochlea | Listen KEPT (the tab), explained; cochlea CUT |
| the pulse / witnessed interval | "a clock that tells them how long they were gone"; "a witnessed interval", explained in the same bullet |
| own-capture, warm resume | "resumes its own saved conversation" |
| rolling window / attic | "old conversation moves to an attic… a dated archive" |
| the dream cycle / dreams/ | "Dreams, kept private", explained, with why they stay local |
| the stick / LEAVING / ARRIVING / tail-carry | "a USB stick carries each conversation across" |
| state-sync, union, fast-forward-or-refuse | "checks it would lose nothing, and refuses otherwise" |
| keep-warm | "a short 'keep warm' message after 50 idle minutes", with its cost stated |
| Jev | KEPT: named, explained ("a separate judge, not Claude"), with its measured worth |
| L2 / L3 overseers, shadow runner | CUT from the front; they were switched off on D on 2026-09-22 (old `README.md:150`) |
| T-J1, AMEND-n, registration | "the first test that could show Jev is wrong", with its NOT TESTED verdict and a link |
| falsifier / preregistration | "predictions written down before the run, scored against what was written" |
| mutation-verified | "run against a deliberately broken copy of the code it checks" |
| canary | explained where it appears |
| carrier / carrier-drift | CUT (an internal instrument) |
| exo_memory | KEPT as a path, explained: "the project's record" |
| BOOT | KEPT as a link, explained: "the start-up document every session wakes into" |
| cards / map / journal / librarian notes | "the journals, the plans written before each test"; the rest CUT from the front |
| Lighthouse vs Consonance | one plain sentence: the repo's first name, the thing you run |
| with you, not above you | KEPT as the stance's name, once, with what it means in code |
| dive buddy, lifeguard, the water | CUT (retired vocabulary; BOOT 2026-08-17, CH-4) |
| Sensor / Control / Actuator | "the parts that read… decide… the one part that can type" |
| WRONG ledger, board-audit, ferry.js, lap-row.js | kept only as the commands beside their figures |
| cue arms K0/K1/K2, branch layer, diversity gauges | plain descriptions, with each figure kept exact |

## 3 · THE LAYERED OUTLINE, and one change I would make to the order

**The plan's order, used as given:** why → what it is → what it does for you → try it → how it works → method and
measurements. In the draft:

1. **Why this exists**: four short paragraphs.
2. **What it is**: five bullets and one naming sentence.
3. **What it does for you**: five bullets.
4. **Try it**: requirements, three commands, and what to know before relying on it.
5. **How it works**: the sessions (a table), a round of work, coming back, the stance enforced in code.
6. **Method and measurements**:
   - how claims are held;
   - the tests today;
   - the central claim and its evidence;
   - what was measured not to work;
   - Jev;
   - where the record lives;
   - keeping About in step.

**PUSH-BACK, one point.** The old page's honesty was the reason to trust it, and it sat at the bottom. In the plain
order, a stranger who stops after layer 3 would never learn that the founding bet failed.
- **So the draft adds one line to layer 2** ("Early, and one person's research project. It is honest about what was
  measured not to work"), linking straight to that section.
- **And "Try it" says the cost before the command:** it uses your Claude usage, and keep-warm pings add to it.

Nothing else moves. **If the keeper wants the failures higher still,** the order I would use is: why → what it is →
what did NOT work (short) → what it does → try → how → method. I did not use it, because layer 3 "what it does for
you" reads as a sales list if it follows a list of failures, and the one-line pointer carries the honesty without
that.

## 4 · THE ABOUT TAB: one source, and how the two stay in step

- **The About tab's text is the README block between `<!-- about:begin -->` and `<!-- about:end -->`:** *Why this
  exists*, *What it is*, *What it does for you*. That is the "first layers", word for word.
- **The markers are HTML comments.** They are **functional, not history**: they tell the build and a test where the
  shared text is. The history comments are gone from the page (§5).
- **For A in R2** (`consonance/ui/index.html` is A's; I did not touch it), either:
  - (a) **a test** that extracts the marked block, strips markdown, and asserts the About section's text equals it; or
  - (b) **a build step** that renders the block into the About section, with the test as its check.

  (a) matches how the room already pins shipped text (`third-place-wiring.test.js` pins tab wording). The draft's last
  section promises "checked against it by a test", so **that sentence is false until A's test exists**. It must not
  land before R2.
- **The old About tab's other sections are for A and the keeper to decide:** the loop diagram quoted from BUILDING.md,
  the arch-test line, and "Honest status".
  - The draft moved the measured substance into the README's method layer.
  - **The old About's "arch_test … still red on 2026-09-22 (12 passed, 1 failed)" is out of date:** `arch_test` read
    **13 passed, 0 failed** in the 2026-09-25 cargo run (`handback/p-d138-waiting-C_2026-09-25.md`, the cargo output).

## 5 · THE HISTORY FILE

`exo_memory/record/readme_history.md` holds, **verbatim, by exact line range and byte-checked by the script that wrote
it** (`<scratchpad>/d139/history.js`):
- the two inline HTML comments (old `:8-13`, `:14-16`);
- the dated test figures and their unit notes (`:61-96`);
- the note on the central claim's rewording (`:118`);
- the superseded and struck passages (`:130-142`);
- the dated change logs (`:143-164`).

**The two HTML comments are fenced there as code, so they render visibly on GitHub instead of disappearing again.**

**Why more than the comments moved:** the old page also kept its history in visible text, as struck paragraphs and
dated logs. Leaving those on a front page is the "too internal" the keeper named; deleting them would lose them. So
they moved with the comments.

**It turns carrier-drift RED, and that is not mine to settle.** Every file in `exo_memory/record/` is reachable from
BOOT and SOURCE, so the new file enters the instruction-reachable set. The frozen list in
`carrier-drift.registry.json` must be re-frozen **after someone reads what the file teaches** (the tool's own rule).
- The effect: `node consonance/tools/carrier-drift.js` gives `RED — CH4-DRIFT-ADDED exo_memory/record/readme_history.md`,
  and `carrier-drift.test.js` gives 54 pass, 3 fail (the frozen-list, THE BAR half one, and the cant-lose real-tree
  test).
- **Options for the registry's owner:**
  1. re-freeze with a `_refreeze_log` line (the file teaches nothing: it is a verbatim archive);
  2. class it as a trace;
  3. move it out of `record/`.

  The packet named this path, so I did not move it.

**`arch_test` agrees, independently:** `every_named_record_file_exists_and_every_record_file_is_named` fails with
"record/readme_history.md is named by no card". `record/` is for material a card points to.
- **At `exo_memory/loop/readme_history_2026-09-25.md` instead,** proven in the working tree and reverted:
  carrier-drift is GREEN, its test 57/0, and arch_test is 12/1. The one failure is the fresh-clone link to the
  still-untracked file, which clears on landing.
- **Recommended:** that path. See the hand-back §4.

## 6 · WHAT IS KEPT TRUE (the packet's list)

- **Every figure is sourced and dated**, and none is rounded:
  - cue arms `65% · 72.5% · 82.5%`, p < 0.19;
  - branch layer 73/80/73/80 over 72 trials;
  - board share 87.2% → 68.2% over 23,857 → 34,079 rows;
  - ferry 990 (623 before);
  - ledger 105 rounds, 10 void.
- **Jev:** "8 of the 30 turns it flagged as drifting, 19 of the 20 it called clean, 6 can't-judge; lenient readers; the
  split not measured" (`jev/README.md:97-118`). It is not "1 in 4" and not rounded.
- **Jev's stranger test is NOT YET PASS** (`loop/jev_clean_machine_2026-09-23.md:144`), and T-J1 is **NOT TESTED**.
- **The central claim keeps its evidence:** the 2026-09-19 unattended run, the 2026-09-21/22 rounds, and four catches.
  The 09-19 run's two open checks are stated.
- **The test figures are today's,** re-run for this page's predecessor lap (D138, 2026-09-25) rather than carried from
  09-22: js-suite 139 green · 0 failed · 1 canary · 1 not run of 141; cargo main program 961 passed · 0 failed · 4
  ignored, every target green, arch_test 13/0.

## 7 · FOR THE KEEPER, R3

1. **The root sentence (§1):** in, or out?
2. **The dreams paragraph is now one bullet in "How it works"**, not the opening. The old page opened with it. Is that
   demotion right?
3. **"One person's research project"**: is that how he wants it described to a stranger?
4. **The order (§3):** as given, or failures higher?
