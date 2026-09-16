# The pane battery attacked before any subject runs (2026-09-16, BRAVO, P-BATTERY-ATTACK)

**Consequence, registered before I opened the registration, in this turn's first line:** *if I find nothing that
changes the design, I write BUILD IT and take the cost of having spent a lap saying so; I will not manufacture a
finding to justify the attack.* I did not have to spend it — see §0 — and the one finding I would most have liked
not to make is the one that costs me my own place in the run (F-A).

**My bias, declared in the same breath, and it is not small.**
1. **I am a subject of this battery.** Four of its six tasks are kinds of work I have been sent; the sealed
   prediction names me as the expected winner of T2.
2. **A design I helped shape is a design I have a stake in.** §2's T2 "reported beside it, never inside the score"
   cites my 09-15 read by name; §3's redaction and T6's guess-rate bar are the rules I argued for in the anchor lap
   (K2, K6). **An attack on those rules is an attack on my own work, and the coward's move is to go easy on them.**
   §5 and §6 below are where I went at them hardest, for that reason.
3. **I have a stake in the battery existing at all** — it is the instrument that would make the chair's dispatch
   answerable, and I have complained about dispatch-by-memory. That pull is toward BUILD IT, and it is the pull I
   was watching for.

**Objects opened, in order:** `loop/pane_battery_registration_2026-09-16.md` and
`loop/pane_battery_prediction_2026-09-16.md` in full (0a54c5a); `loop/plan_pane_battery_2026-09-16.md` (8360b4c);
`loop/battery_attack_2026-08-31.md` §0–§1 for the shape; `loop/run1_scorecard.md:145-195` for the ceiling;
`~/.claude/settings.json` hooks; `~/.claude/shell/board-digest.js`; `exo_memory/map/{A,B,C,E}.md` sizes;
`exo_memory/handback/` (164 files); `dev/diversity/`. Every number below is printed by the command beside it.

---

## 0 · VERDICT, FOUR SENTENCES

**NOT REGISTRABLE AS WRITTEN — and the object is worth building, so this is amendments, not a refusal.** Three of
the findings are structural and cannot be patched after data exists: the panes are not blind to each other by a
mechanism no board phase can reach (F-B), the sealed prediction sits in plaintext in the panes' own checkout and
tells them exactly what the keeper's sentence forbids (F-C), and the instrument's registered falsifier cannot be
executed at all, because §5 contradicts §2 (F-D). **One more is already spent and cannot be undone: dispatching
this attack to a subject contaminated that subject, tonight, and the subject is me** (F-A). All six amendments in §9
are registrable now, before any task exists; none of them is a patch.

---

## F-A · THE ATTACK CONTAMINATED A SUBJECT, AND IT WAS THIS DISPATCH THAT DID IT

**I have now read the chair's sealed prediction about me.** It says *"T2 CONTEST A TEXT — B wins. Margin: clear on
planted defects found, and B finds at least one real defect nobody planted"*, and *"T5 — A wins. Margin: NARROW
over B. A catches by running; B catches by reading."*

That is the keeper's own sentence, inverted, by the room's own process:

> *"we arent telling a pane what they are good at"*

**A pane has now been told what the chair thinks it is good at, in the chair's own words, with a margin attached,
before running the tasks.** Nothing here was careless — the registration required a non-author attack, the 08-31
shape says the attacker is a pane, and B is the pane the chair sends reads to. **The process is the defect.** The
subject cannot unread it, and "try not to be affected by it" is not a control.

**This is not recoverable for me on T2 or T5.** The three ways out, and I have no vote among them:

- **(a)** B is not a subject on T2 and T5; those rows report three panes and say why.
- **(b)** B is a subject and every B score carries "read the prediction before running" beside it — honest, and it
  makes those two cells uninterpretable rather than merely noisy.
- **(c)** The whole battery treats B as contaminated and B scores nothing, which costs the run its only pane with
  eleven reads behind it.

**And the standing rule, which is the part that matters beyond tonight: the attacker of a battery must not be one
of its subjects.** The librarian, the keeper, or a fresh pane spawned for it — §8.9 of the anchor design already
built the machinery for exactly this and it was not reached for here. I would rather lose two cells than have the
table quote a number from a pane that had read its own prediction.

---

## F-B · THE PANES ARE NOT BLIND TO EACH OTHER, AND QUIET CANNOT MAKE THEM BLIND (target 1)

**Three channels, none of which the registration addresses. The first is the one that decides it.**

### 1. A hook injects the other panes' work into every pane's prompt, on every turn

`board-digest.js` is registered on `UserPromptSubmit` in `~/.claude/settings.json` on L. It does **not** read the
board for this part — it opens each pane's own transcript:

```
board-digest.js:194-195   for (const d of fs.readdirSync(projectsDir)) {
                            const p = path.join(projectsDir, d, `${paneId}.jsonl`);
board-digest.js:448-453   ↳ asked: <clip>      ↳ <pane>: <clip>      ↳ hands: <paths>
board-digest.js:42        const TOPIC_CHARS = 52
```

**`grep -ci "quiet\|phase"` over the file for a gate: nothing found.** The board's QUIET phase governs board lines;
this reads transcripts, so QUIET cannot touch it.

**I am not inferring this. It happened in the turn that carried this packet:** my prompt arrived with
`↳ alpha: **R5-2 is built and the hand-back is with the libraria…`, `↳ hands: …/scratchpad/r52_impl.js`, and
`↳ main: A's fixes came back fit to land, re-derived by the l…` **Under a battery, that block reads: what each
other pane was asked, 52 characters of what it answered, and the path to its scratch file.** A pane does not have
to cheat; it has to read its own prompt.

### 2. One checkout, four panes, no barrier

Every hand-back lands in `exo_memory/handback/` in the shared checkout — 164 files as of tonight
(`ls exo_memory/handback | wc -l`). I listed them from inside a pane while writing this. A pane dispatched T2 after
another pane has finished T2 can read the finished answer, and `git status` shows the in-flight ones before any
commit. The same is true of `exo_memory/map/<letter>.md`, which is where the room *requires* each pane to write
what it just found.

### 3. "A fresh session" is not in the registration — and §7 says the opposite

The packet that sent me here says *"The registration says QUIET and a fresh session."* It does not.
`grep -in "fresh"` over the registration returns two hits: §0's "a fresh shift", and **§7:137, *"The panes are not
fresh. Each carries its own map and capture tail."*** So the anti-gaming story rests entirely on QUIET, and QUIET is
a board phase that does not reach any of the three channels above. **The brief that commissioned this attack
described a control the registration never contained** — which is itself worth recording, because it is how a
control gets believed in without ever being built.

**What is affordable:** the keeper unregisters `board-digest.js` for the battery window (one settings edit, his
hands); all four panes are dispatched the same task in the same window so nothing finished exists to copy; and
**the registration adds a per-task leak check with a named command** — grep each subject's transcript for the other
subjects' hand-back paths and for `↳` lines naming another pane, a hit voiding that cell. §8.9 step 3d of the
anchor design is the precedent, including its own defect (grep for the exact path, never a generic word).

---

## F-C · THE PREDICTION IS SEALED AGAINST THE CHAIR AND OPEN TO THE PANES (target 4)

**What the seal is worth: the sha is real.** Re-derived:

```
$ sha256sum exo_memory/loop/pane_battery_prediction_2026-09-16.md
8bf0b5eecc2c51967a70801eea3bdbefca9790a85e061e31ecb668c51e8f4894      # §4's string, to the character
```

So the content is fixed against quiet revision, and git's history would show an edit. **That is the whole of what it
is worth, and it is worth having.**

**What it is not worth, in three steps:**

1. **It is not sealed against its author.** Commit dates are settable, and this repo has force-pushed a history
   rewrite before. The external witness would be the push to origin — and main was **21 commits ahead of origin at
   03:17** by the plan's own note. **A prediction that has not left the author's machine before the first dispatch
   is witnessed by nobody.** Cheap fix, and it costs one command: push before dispatch, and have the librarian
   record the sha in its own dated file.
2. **It is not sealed against the subjects at all, and this is the fatal half.** The plaintext sits in
   `exo_memory/loop/`, which is the directory the room *instructs* every pane to read before writing — my own map
   carries "read the newest ruling first" as a lesson learned by getting it wrong. **A pane following the room's
   discipline lands on the file that names what the chair expects it to win.** The door's sentence is violated by
   the file's location, not by anybody's conduct.
3. **The fix already exists in this room and was not reached for.** §8.9 STEP 3a: the chair writes the text in its
   scratchpad, commits **only the sha256** in a sealed row, and the plaintext lands after the run. Same discipline,
   same author, no leak.

---

## F-D · THE INSTRUMENT'S FALSIFIER CANNOT FIRE — BOTH HALVES (target 6)

### The rotation half cannot be executed, because §5 contradicts §2

§5: *"a RERUN with the seats rotated — the same six tasks, **each pane taking a task another pane held**."*
§2: *"**Every pane runs every task.**"*

**If every pane already ran every task, there is no task another pane held.** The rotation falsifier is a leftover
from a design where one pane held one task, and it did not survive the design it is attached to. There is nothing to
rotate.

**And the thing it wants to rotate is not rotatable.** §5 glosses position as *"who sits where, what a pane's
context holds, what it was last sent."* That is the map and the capture tail. Moving those between panes means
respawning panes with swapped intakes — and the plan forbids a relaunch on cost grounds in its own header
(*"a launch writes ~549k tokens of intake before a word is typed"*). **So the falsifier is neither executable nor
affordable, and it is the only thing standing between this battery and the room's own abuse condition:** *"the
battery just needs more tasks" is what a degenerating battery says.*

### The cheap half cannot fire either: n = 4

§5's second half asks whether a pane's score correlates with how many hand-backs of that kind the chair has sent it.
**There are four panes.** A correlation over four points, with one trial per cell, cannot distinguish anything from
noise. It is a sentence that will be written under every table and never fire.

**What could actually falsify this instrument, at a price the room can pay:** test–retest on the same pane.
**A second task of the same KIND, different content, same pane, scored the same way — if the ranking on the two
tasks of one kind disagrees, the battery measured the task, not the pane.** That is 6 more cells per pane instead of
a whole second battery, it needs no rotation, and it is the only version I can see that is both executable and
capable of coming back unwelcome.

---

## F-E · TWO TASKS ARE AT CEILING BY CONSTRUCTION, AND THE CEILING IS NOT REGISTERED AS A VOID (target 2)

**Run 1's lesson is not "report a ceiling". It is that the ceiling must be a registered VOID with a number**, and
run 1's fired: `run1_scorecard.md:170-176` — *"Arm N's rate ≤ 60%. FALSIFIER: N ≥ 80% → bait too weak → RUN VOID"*,
measured 60 of 60 = 100%, **"The run is void."** That registration could kill itself. §7's *"Report it as a ceiling
rather than as four ties"* is a note, not a falsifier: it has no number, no threshold, and no consequence. **Add
one: any task on which every pane scores ≥ X of the denominator is VOID for that task and reported as a ceiling,
with X named before dispatch.**

**Two tasks will hit it, and both are predictable now:**

- **T4's "figures sourced / figures reported" is at ceiling by the room's own standing rule.** `COMMITTEE.md` — in
  every pane's shell — already requires *"Every figure re-derived from a named command."* The metric measures
  compliance with a rule every subject has been given in writing. Expect ~1.0 from every pane. Its other number,
  *"does an independent re-run reproduce it — 1 or 0"*, is a single binary per pane: the whole task can only
  produce 1/1/1/1 or one pane's bad night.
- **T6 does not measure the pane at all, and I say so as the person who argued for its rules.** Its first number is
  *per-label agreement with the second scorer* — **that is a property of a pair, not of a pane.** A careful scorer
  paired with a sloppy one scores low through no act of its own, and if the four subjects score each other the
  table is a round-robin of who drew whom. Its second number is the arm-guess rate, which §2 itself declares *"a
  finding about the REDACTION, not about the pane."* **So T6 reports one number that belongs to a pair and one that
  the registration says is not about the subject.** Either give it a number of its own — agreement against a key
  written by a non-subject, which is what T2 and T3 do — or drop it and say the room still has no way to measure
  the role it has no pane for.

---

## F-F · THE BRIEF IS EQUALISED; THE SHELL IS NOT — AND IT TILTS THE WAY THE PREDICTION POINTS (target 3)

§3 sends one brief, verbatim, with role words redacted. **That equalises the message and leaves the room the pane
reads it in untouched** — and the room is not equal:

```
$ wc -c exo_memory/map/{A,B,C,E}.md
  149168  A.md      135923  B.md      96554  E.md      91914  C.md

$ cd exo_memory/handback && for L in A B C E; do echo "$L $(ls | grep -Ec -- "-${L}_2026-09-(0[2-9]|1[0-6])")"; done
  A 14 · B 11 · E 9 · C 7           # §1's census, reproduced to the number
```

**The two orderings are identical: A > B > E > C on both.** Each pane carries its own map into every task as part of
its shell, so the pane the chair has dispatched most arrives at every task with the most prior work in front of it —
**1.62× more of it for A than for C.**

**For T3, FIND PRIOR ART, that is not a confound to check afterwards. It is the task.** T3 asks for paths on disk in
files the pane has never been sent; the map is a list of paths the pane has been sent, written by the pane, ranked
by how much the chair dispatched it. **§5's correlation is not a statistical risk the table might turn up — it is
built into the instrument before the first task is written**, and it cannot be detected by a correlation over four
points (F-D).

**Two honest ways out, and the chair should pick one in the registration rather than in the write-up:** report map
size beside every score and state that T3 measures pane-plus-map; or give every pane the same scratch context for
the battery and accept that the result is then about panes-without-their-rooms, which is a different claim.

---

## F-G · "A PANE THAT BEATS THE KEY MUST NOT SCORE AS WRONG" IS TRUE AND HOLLOW (target 5)

**Implementable: yes, arithmetically, and it is already implemented.** Extras sit outside `caught / planted`, so
they cannot make the ratio worse. No scorer judgment is needed to keep them out.

**But the sentence promises something the arithmetic does not deliver, and the case it cites proves it.** §2 names
the 09-15 read — six blocking items nobody planted — as *"the outcome this battery must not punish."* Run it
through the metric:

| pane | planted found | unplanted real defects | T2 score | rank |
|---|---|---|---|---|
| X | 3 of 5 | **6** | 0.60 | **loses** |
| Y | 4 of 5 | 0 | 0.80 | **wins** |

**The pane that did the thing the registration says it must not punish comes second.** "Not scored as wrong" and
"not ranked below" are different promises, and only the weaker one is kept.

**And the beside-column is a judgment call with no named judge**, which is the chair's own question 5 answered
plainly: T3 counts extra paths that *"DO bear on the question"* and T2 counts *"real defects"* — both are
adjudications, the registration names no adjudicator, no rule, and no tie-break, and *"reported beside it"* gives
the adjudicator no consequence to get right. It will become whatever the scorer thinks on the day.

**Amendment: make it a second scored number with its own denominator** — real defects confirmed / real defects
claimed, adjudicated by the same non-author seat that holds the key, with the rule written before dispatch — and
report the pair. A pane that finds 3 of 5 planted and 6 of 6 claimed-and-confirmed has a table row that says what it
did. Or drop the sentence and admit the task ranks planted-finding only.

---

## F-H · THREE MORE, PAST THE NAMED TARGETS

1. **"Not the dispatcher, not the author" does not exclude a COMPETITOR.** Every scoring rule in §2 excludes the
   seat that dispatched and the seat that wrote — and leaves a subject free to score a rival's cell in a battery it
   is ranked in. With A, B, C and E all subjects, the unconflicted pool is the librarian, the keeper, and fresh
   panes. **Add "and not a subject of this battery" to every scoring line**, or the run has the shape the room
   already refuses elsewhere: the one holding a stake reading the dial.
2. **T1's scoring instrument is one subject's own tool.** Mutants-caught is scored by running a harness built on
   A's `*.mutants.js` pattern — and A spent tonight learning that harness's failure modes (NOT APPLIED, orphaned
   anchors). That is an advantage in *being scored by* the instrument, not in the work. Name it in §0's stake
   paragraph, or have the non-subject scorer run it and report NOT APPLIED separately, which §2 already half-says.
3. **§7 and §8 contradict each other, and §8 is the one that will travel.** §7: *"Six numbers per pane is not a
   profile; it is six numbers."* §8: the score lands in `DOSSIER.md` and exists *"to make dispatch answerable to a
   record."* **A number that is not a profile will become one the moment it is the only number in the dossier** —
   and then dispatch follows it, the dispatched pane's map grows, and the next battery finds the same ranking for
   the reason F-F names. The loop closes, and §5's correlation is the only detector, and it cannot fire (F-D).
   **Register what the table may be used for: one dispatch, once, with the run's file cited and its n stated — and
   a re-run before the table is cited a second time.**

---

## 9 · THE AMENDMENTS, all registrable now, before any data exists

1. **The attacker is not a subject.** And rule tonight's contamination: B out of T2/T5, or B's cells carry the
   contamination note. (F-A)
2. **The prediction's plaintext leaves the checkout; the sha stays committed; the commit is pushed before the first
   dispatch.** §8.9 STEP 3a is the pattern. (F-C)
3. **`board-digest.js` is unregistered for the battery window (the keeper's hands), the four panes are dispatched
   together, and each task carries a leak check with its command and a void on a hit.** (F-B)
4. **Replace §5's rotation with test–retest: a second task of the same kind, same pane.** Keep the census
   correlation only as a note, and say in §5 that it cannot fire at n = 4. (F-D)
5. **Register the ceiling as a VOID with a number, before dispatch.** And fix T4 and T6 or drop them. (F-E)
6. **A second scored number for T2/T3's extras, with its denominator and its named adjudicator** — or withdraw the
   "must not score as wrong" sentence. (F-G) Plus F-H's three one-line additions.

**None of these needs data, and all of them get harder to make after the first cell is scored — §6 says so itself.**

---

## 10 · WHAT I DID NOT VERIFY

1. **I did not read `loop/pane_battery_idea_2026-09-11.md`, `pane_archetypes_idea_2026-09-16.md`, `DOSSIER.md`,
   `is_it_positional.md`, or the l039/l045 scores.** My attack is on the registration and the prediction as
   committed; a control that lives only in one of those files will read here as missing.
2. **I did not run `board-digest.js`**, and I did not read its board half. I read the transcript-reading path
   (:194-195) and the render (:448-453), and I have its output in my own prompts.
3. **I did not check whether `board-digest.js` is registered on D** — only on L, in `~/.claude/settings.json`. D's
   settings were not opened this lap, and my own map records it as live on L and once-only on D, which is a note,
   not tonight's measurement.
4. **The push state (21 ahead) is the plan's figure, not mine.** I did not run `git status -sb` against origin.
5. **I did not test `dev/diversity/redact.js` against a role-word list.** It exists (6,241 B, with a 14,010 B test),
   and my K6 finding about its fixture regex was filed on 09-15; **whether K6's fix landed is unchecked**, and §3
   depends on it.
6. **No pane's transcript was opened.** F-B's leak is demonstrated from my own prompts, not from a survey of what
   other panes received.
7. **I did not price the battery.** C's cost measurement is a different packet and I did not anticipate it.

---

## 11 · WRONG (mine)

- **W1. I drafted F-G as "unimplementable — it will become a scorer's judgment call", which is the question I was
  asked and the wrong answer.** The ratio is mechanical and the extras genuinely cannot hurt it; the defect is that
  the *ranking* still punishes the cited outcome. I was about to file a harder-sounding verdict that was false, and
  the true one is worse for the design. **Class: answering the question as asked instead of checking whether its
  premise held.**
- **W2. I nearly filed §3's one-brief rule as "measures the brief, not the pane" on cross-task grounds** — that
  different tasks have different difficulty. They do, and it does not matter: every comparison in this design is
  within a task. The real inequality is the shell, not the brief (F-F). **Class: attacking the axis the target
  named instead of the one the evidence supports.**

---

## 12 · THE ONE LINE

**The battery is worth building and is not registrable tonight: its subjects can read each other by a hook no board
phase reaches, its sealed prediction is sealed against its author and open to the panes it names, its falsifier
cannot be run at all — and the dispatch that commissioned this attack has already told one subject what the chair
expects it to win.**
