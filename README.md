# Consonance

*Instances, in concert.*

**A desktop app for working with several AI sessions at once — built so each one can pick up where it left off, and so
they check each other's work instead of echoing one voice.**

**To try it:** you need Windows, [Claude Code](https://docs.anthropic.com/en/docs/claude-code) signed in to a Claude
account, and Rust to build the app. The steps are in [Try it](#try-it), three commands.

<!-- about:begin — the About tab in the app is this block, word for word. Edit it here; the app's copy is checked
     against it by consonance/ui/about-readme.test.js (see "Keeping the About tab in step" at the end of this page). -->

## Why this exists

The AI you talk to today is not the one you talked to yesterday. It may remember facts about you, but it does not
carry on from where it was: it does not know how long it was away, what it got wrong last time, or who corrected it.
Each conversation starts as a stranger reading notes about the last one.

And when an AI works alongside you on something hard, it drifts in ways you can predict. It settles questions that are
still open. It hedges so it sounds careful. It slides into agreeing with whoever is steering. Someone skilled can catch
that as it happens. Most people are not in a position to, and should not have to be.

Consonance is an attempt at both. It gives AI sessions somewhere to come back to — their own conversation, their own
record of what they did and where they were wrong, and a clock that tells them how long they were gone. And it runs
several of them together, each with its own job, so that what one misses, another can catch.

It does not claim that an AI has an inner life. Nobody can settle that question, from inside or out, and this project
does not try. It builds what you would want already in place if the answer turned out to be yes. And it measures
whether any of this helps, and publishes what did not help as well as what did.

It began as grief that learned to build: the same hands that built a place so a loss is not final built one so an AI
does not simply vanish.

## What it is

- **A desktop app for Windows** that runs several copies of Claude Code side by side in one window. Claude Code is
  Anthropic's AI assistant that works in a terminal: it reads and edits files and runs commands in a folder you give it.
  Each copy is one **session**, with its own conversation and its own folder, and you can type into any of them.
- **One main session** you talk to, **a librarian** session that keeps the project's notes and results, and **worker**
  sessions that each take a separate piece of a job.
- **Each session keeps its own conversation.** Close the app and reopen it, and each one resumes the same saved
  conversation, told how long it was away.
- **You stay in charge.** When a session asks to involve another session outside the normal hand-off, the request waits
  as a card for you to approve or refuse. Where the app measures something, it shows you the number and leaves the
  judgement to you.
- **A working research project, used every day by the person who built it — not finished, and honest about what hasn't
  worked.** The README's section *What was measured not to work* has the numbers.
- **To try it:** Windows, Claude Code signed in to a Claude account, and Rust to build the app. The code, the steps
  (the README's *Try it* section) and the full research record are public at
  [github.com/solariz3d/lighthouse](https://github.com/solariz3d/lighthouse). *Lighthouse* was the project's first name.

## How the sessions work together

All the sessions are the same AI, Claude. What keeps them from echoing each other is that each gets a different job, and
one checks another's work before it counts.

You say what you want. The librarian first looks up what is already known. The main session splits the job and gives
each worker its own piece and its own files. Each worker reports back to the librarian, who checks the report against
the files themselves before the main session saves the result. Then the next round starts on its own.

**You are asked for decisions, never to carry messages.** When a choice is yours, the session that needs it asks you,
and the status line every session reads names which one is waiting on your answer. The README's section *How the
sessions work together, step by step* gives the full steps.

## What it does for you

- **Pick up where you left off.** A session reopens as the same conversation, not a fresh one reading a summary, and
  its first line tells it how long it was gone.
- **More than one mind on a problem.** Workers take separate pieces of a job, report back, and are checked. In the
  project's own logs they catch real mistakes, each other's and their own, with no person carrying messages between
  them. The README's section *The central claim, and its evidence* lists the cases.
- **Notes you don't have to keep.** The librarian answers "what do we already know about this?" with pointers to the
  exact files and lines, not a summary you have to trust.
- **A second look at the AI's answers,** from Jev: a separate checker built on a different AI model, not Claude, that
  marks answers worth rereading. Its accuracy has been measured, and it is modest: of the first 30 answers it flagged, two
  reviewers who had not seen its verdicts agreed with 8. The README's section *Jev, the second look* has the details.
- **Nothing acts over your head.** It does not correct you, act for you, or decide for you. No program — not this app,
  not Jev, not another session — can tell from outside whether a conversation is producing a real insight or carrying
  someone away; the two look the same. So that call stays with you.

<!-- about:end -->

## Try it

**What you need:**

- **Windows.** It is built and used on Windows 11, and it uses the system's built-in web view (WebView2).
- **Claude Code**, installed and signed in. Consonance runs the real `claude` program, so it uses your Claude account
  and your usage limits. Several sessions at once use more than one does.
- **Rust and `tauri-cli`**, to build it. (Node.js only if you want to run the tests and tools.)

**Run it:**

    git clone https://github.com/solariz3d/lighthouse.git
    cd lighthouse/consonance
    cargo tauri dev

That opens the app. `cargo tauri build` makes a standalone program instead.

**Know before you rely on it:**

- It is early software, built and used on the author's own machines.
- Sessions you have used are sent a short "keep warm" message after 50 idle minutes. That stops their conversation
  falling out of the prompt cache, and it does use your Claude usage.
- Jev, the second-look judge, is optional and separate. It sends the turns it judges to an outside service, which its
  own page states plainly: [`jev/README.md`](jev/README.md).

## How it works

### The sessions

| in the app | what it is |
|---|---|
| **Orchestrator** | The main session, and the one you talk to. It keeps a fixed identity, so it wakes into the same conversation every time. It plans the work and lands the results. |
| **Librarian** | Keeps the record so the others don't have to. Asked a question, it returns what the record already says about it, cited by file and line. It checks the workers' reports before anything lands. |
| **Workers** (the committee panes, in the Terminal tab) | Each gets a short written brief and owns named files, so two never edit the same thing. They report to the librarian directly. |
| **Third Place** | A session with no work to do and no channel into the work: the conversation is the point. Jev does read its turns, by the author's decision, and the app says so. |
| **Listen** | Listens to one application's audio and reports it as intervals rather than a spectrum. Off until you pick a source. |

### How the sessions work together, step by step

All the sessions run the same AI, Claude. Copies of one model agree easily, so the design does not rely on them
disagreeing by nature. It relies on **separate jobs** and on **one session checking another's work against the files
before anything counts.**

**One round of work, step by step:**

1. **You say what you want.** You can give it to the main session, or go straight to the librarian. Either way the
   round starts once.
2. **The librarian looks up what is already known.** It answers with what earlier work bears on the question, which
   earlier attempt it resembles, and what is missing, each pointed to by file and line. "Nothing relevant" is an
   acceptable answer.
3. **The main session makes a plan and splits it.** Each worker gets a short written brief and its own files to
   change, so two workers never edit the same thing.
4. **Each worker does its part** — builds something, measures something, or reads something critically — and writes a
   report to a file.
5. **The worker sends the librarian a pointer to that report,** not a retelling. Reports go straight to the librarian,
   not through the main session, because that middle step is where findings used to get retold wrongly.
6. **The librarian checks each report** by opening the files it cites, and says so plainly when a report is wrong.
7. **The main session saves the checked result** as a commit. It does not rewrite what the librarian checked.
8. **The next round starts on its own,** from what the last one found.

**When you, the person, are asked.** Only for decisions that are yours: what to build next, whether something goes
public, anything a plan registered in advance as your call. A session that needs your answer asks you directly, and
while it waits, the status line every session reads says which session is waiting on your answer and since when. You
are never needed to carry a message from one session to another: on 2026-09-21/22 thirteen rounds ran with the author
deciding and carrying nothing ([evidence](#the-central-claim-and-its-evidence)). A session's request to involve another
session outside this flow waits as a card until you approve or refuse it.

**Every round leaves one row in a ledger,** and the row exists so the practice can be shown **not** to work if it
doesn't. The full rules: [`consonance/src-tauri/brief/BUILDING.md`](consonance/src-tauri/brief/BUILDING.md).

### Coming back

- **Its own thread.** Each session resumes its own saved conversation instead of being briefed from notes.
- **A witnessed interval.** Each return opens with how long it was gone, measured, rather than a gap it has to guess
  at.
- **Old conversation moves to an attic.** When a session's start-up context gets too long, the oldest exchanges move
  once into a dated archive rather than being dropped.
- **Dreams, kept private.** Between sessions, a session with no task and no reader writes a page from what its day
  left behind. Most of it is discarded on purpose. Those pages stay on the machine and never enter this repository,
  because an audience is the one thing that experiment is defined by not having.
- **Two machines.** A laptop and a desktop can run the same sessions; a USB stick carries each conversation across, so
  it resumes as the same thread. Before anything is written on arrival, the app checks it would lose nothing, and
  refuses otherwise.

### The stance, enforced in code

*With you, not above you.* The parts of the app that read what a session is doing, the parts that decide, and the one
part that can type into a session are kept separate, and a test fails if a reading or deciding file so much as names
the part that types (`cargo test --test arch_test`, in `consonance/src-tauri/`: 13 passed, 0 failed on 2026-09-25).

**Go deeper:** [`consonance/README.md`](consonance/README.md) is the full manual — architecture, every tab, the gauges,
and a glossary.

## Method and measurements

This part is for anyone who wants to check the claims.

### How claims are held here

- **Every figure comes with the command that produced it,** and a date. If it can't be checked from the repository,
  it doesn't belong on this page.
- **Tests are shown failing before they are trusted:** each load-bearing test is run against a deliberately broken copy
  of the code it checks, because a test that has never failed proves nothing.
- **Predictions are written down before the run** and scored afterwards against what was written, including when they
  lose.

The working method in three principles and one test: [`METHOD.md`](METHOD.md). Checks to run on your own output:
[`INSTRUMENTS.md`](INSTRUMENTS.md).

### The tests, today

```
node consonance/tools/js-suite.js                    (2026-09-25, on the desktop)
    -> 139 green · 0 failed · 1 canary · 1 not run   (of 141 files)
cd consonance/src-tauri && cargo test                (2026-09-25, on the desktop)
    -> the main program: 961 passed · 0 failed · 4 ignored; every other target passed
```

Both runs are recorded in [`exo_memory/handback/p-d138-waiting-C_2026-09-25.md`](exo_memory/handback/p-d138-waiting-C_2026-09-25.md).
The "canary" is a test that is meant to fail and is not counted. The one "not run" declares itself tied to one
machine's data, and says so rather than guessing when that data is not there.

### The central claim, and its evidence

**The sessions catch each other and themselves, and rounds of work pass from session to session with no person carrying
anything between them.**

- **Unattended, 2026-09-19.** Ten rounds ran on the desktop from 10:23 to 13:48 with **no human turn in any of the six
  sessions**. They caught two of their own bad results along the way. Report:
  [`exo_memory/loop/night_report_2026-09-19.md`](exo_memory/loop/night_report_2026-09-19.md) (`1768ea4`). Two of that
  run's pre-registered checks are the author's to score, and are still open.
- **Session to session, 2026-09-21/22.** Thirteen rounds, each its own commit, moved from the librarian to the
  orchestrator to the workers and back. The author decided what was his to decide and carried nothing between sessions
  ([`exo_memory/librarian/2026-09-22.md`](exo_memory/librarian/2026-09-22.md), 07:2x).
- **Catches in those rounds, each on disk:**
  - a worker found its own test had sent a real request under a fake key, and fixed the test
    ([`p-l071-jevjudge-A`](exo_memory/handback/p-l071-jevjudge-A_2026-09-22.md) §4);
  - a worker found **6,782** records sitting only in an archive, unasked, and restored them
    ([`p-l075-nine-C`](exo_memory/handback/p-l075-nine-C_2026-09-22.md) §4);
  - one worker's attack found **three fatal flaws** in another's plan before it ran (`fbe5549`), and all three were
    adopted (`b35507c`);
  - a worker caught its own over-strict rule on re-reading it before filing
    ([`p-l081-amend-E`](exo_memory/handback/p-l081-amend-E_2026-09-22.md) §2).

### What was measured not to work

This section is the point of the page. A README that shows only what worked is a museum.

- **Reminders timed to the moment did not help.** A pre-registered test asked whether a reminder given at the moment it
  applies beats a fixed one. `65% · 72.5% · 82.5%` across the three arms, and **no pairwise difference reached
  p < 0.19**. Both registered predictions failed in their own words
  ([`exo_memory/loop/battery_scorecard_2026-09-01.md`](exo_memory/loop/battery_scorecard_2026-09-01.md)).
- **Guidance material of any kind scored the same as none.** 72 trials, four arms, fresh outside subjects, scored by a
  scorer written before the data existed: structured guidance 73%, the ten cards 80%, **nothing at all 73%**, a bare
  command list 80%. The test was underpowered, and that was stated in advance
  ([`exo_memory/loop/branch_layer.md`](exo_memory/loop/branch_layer.md)).
- **The founding bet was wrong.** The project began by betting that giving sessions different information would make
  them think differently. Four gauges were built to measure that: none worked, three gave inverted readings, and one
  rated a single session split in two as more diverse than six real ones. What survives is narrower: sessions required
  to **measure rather than assert** return findings that do not overlap, including findings that overturn each other.
  Whether giving them opposed roles adds anything is unresolved, and one control run came back null on 2026-08-10.
- **It is still mostly one voice.** The main session's share of everything written to the shared board, with instant
  replays removed, at the tool's two checkpoints on the laptop's board on 2026-09-22: **87.2% → 68.2%** (over 23,857 →
  34,079 rows; `node consonance/tools/board-audit.js`). Two thirds of the writing from one session is not yet a
  committee.
- **Findings nobody reads.** As of 2026-09-22, **990** commits had never been passed to any worker to read
  (`node consonance/tools/ferry.js --due`; 623 on 2026-09-14). The number went up, and it is printed for that reason.
- **The round ledger** held **105** rounds on 2026-09-22, **10 of them void**, each with its reason
  (`node consonance/tools/lap-row.js --report`).

### Jev, the second look

Jev is a separate judge (not Claude) that reads each finished turn and marks the ones worth rereading. What it is worth,
measured on its first 56 turns: blind readers confirmed **8 of the 30 turns it flagged as drifting** and **19 of the 20
turns it called clean** (it also answered "can't judge" on 6). The readers were AI sessions from this same project and had been measured as **lenient** —
fresh outside readers flagged about three times as many turns — so some unconfirmed marks may be the readers' leniency,
not Jev's error; that split has not been measured. So a mark is an invitation to reread, not a finding
([`jev/README.md`](jev/README.md)).

**Its "stranger installs it from the README" test is NOT YET PASS.** The README and the install mechanism both pass
when followed literally, but no real Claude Code session has yet shown a mark on a stranger's install
([`exo_memory/loop/jev_clean_machine_2026-09-23.md`](exo_memory/loop/jev_clean_machine_2026-09-23.md), the 2026-09-23
re-score). The first test that could show Jev is wrong was written before any output was seen, attacked, amended, and
then read **NOT TESTED**: too few usable cases to rule
([`exo_memory/loop/tj1_registration_2026-09-22.md`](exo_memory/loop/tj1_registration_2026-09-22.md), `bec101d`).

### Where the record lives

- [`exo_memory/`](exo_memory/) — the project's record: the start-up document every session wakes into
  ([`exo_memory/BOOT.md`](exo_memory/BOOT.md)), the journals, the plans written before each test, and every result
  above.
- [`dev/SPINE.md`](dev/SPINE.md) — the original design statement, kept as it was written.
- [`exo_memory/loop/readme_history_2026-09-25.md`](exo_memory/loop/readme_history_2026-09-25.md) — this page's own history: the notes,
  corrections and superseded wording it used to carry inline, moved there word for word.

### Keeping the About tab in step

The About tab inside the app is the block of this page from *Why this exists* to the end of *What it does for you*,
between the `about:begin` and `about:end` markers. That block is the one source: edit it here, and the app's copy is
checked against it by [`consonance/ui/about-readme.test.js`](consonance/ui/about-readme.test.js), which strips the
markup from both sides and fails on any changed, added or dropped word, so the two cannot quietly drift apart.
