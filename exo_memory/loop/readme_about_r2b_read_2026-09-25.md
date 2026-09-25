# README + About — R2b, the stranger read again on C's revised draft (D142, B). Scored against the R1 baseline; R2 shown for direction

**The rule, unchanged from R2 (the chair's D140/D142):** a text PASSES only if BOTH readers have FEWER unparsed items than the R1
baseline for that text, AND both give a "what next" that the text itself answers. Findings only; no edits suggested.
Baseline: `loop/readme_about_baseline_2026-09-25.md`. R2: `loop/readme_about_r2_read_2026-09-25.md`.

## 1 · THE VERDICT

| text | R2b unparsed r1 / r2 | R2 (previous draft) | R1 baseline | both fewer than R1, any pairing | "what next?" answered from the text | **verdict** |
|---|---|---|---|---|---|---|
| README first screen | **6 / 6** | 5 / 4 | 19 / 16 | yes | yes, both (§1.1) | **PASS** |
| About block | **14 / 11** | 15 / 14 | 46 / 52 | yes | yes, both (§1.1) | **PASS** |

**The direction, as measured:**
- README: R1 19/16 → R2 5/4 → R2b **6/6**. That is up by 1 and 2 against R2, because the first screen grew from 37 to 68 words; still under a third of R1.
- About: R1 46/52 → R2 15/14 → R2b **14/11**. That is down against R2.
- Items that appear in BOTH About readers' lists (§4), quoted by the readers:
  - the "grief that learned to build … a place so a loss is not final" sentence;
  - "what you would want already in place";
  - "outside the normal hand-off";
  - "the status line every session reads";
  - "the next round starts on its own";
  - the Jev "agreed with 8" figure.

### 1.1 · "What next?" — each reader's answer, verbatim (from §4)

- **readme-r1:** 1. Confirm I'm on Windows, have Claude Code installed and signed in, and have Rust installed. 2. Jump to the "Try it" section for the three commands. Before investing time, I'd also look further down for how the cross-ch …
- **readme-r2:** Jump to the "Try it" section for the three commands. Before that, make sure you have Windows, Claude Code installed and signed in, and a Rust toolchain. If you want to know how it works before building it, you'd need to  …
- **about-r1:** Go to github.com/solariz3d/lighthouse and read the README sections the page points to: - *Try it*, for setup - *What was measured not to work* - *The central claim, and its evidence* - *Jev, the second look* Then check t …
- **about-r2:** Go to github.com/solariz3d/lighthouse. Read the README's *Try it* section for setup, and *What was measured not to work* to judge whether the claims hold up. If you care about the evidence, also read *The central claim,  …

Why each counts as answered by the text itself:
- **README readers:** both name the prerequisites and the "Try it" section. The first screen now states both, in its "To try it"
  line (Windows, Claude Code signed in, Rust; "The steps are in Try it, three commands").
- **About readers:** both name the repository and its "Try it" section. The block names both itself.
- **The one judgment:** those About steps lead OUT of the block to the README. I counted that as answered, because the
  readers' steps come from the block's own words, not from guessing. In R2 they said "The text doesn't say"; here
  neither does.

Re-derive: `node <B scratch>/d142/result.js` (R1's count regex, unchanged).

## 2 · What was given, exactly

- **Source:** `README.md` in the WORKING TREE (C's revised, uncommitted draft), sha256
  `043a9f0e7fe5ca905ca9527fb41174701e84a605ae1954b1ede78ae5abb8ac38`, 19,415 B. The same sha was measured after the four reads.
- **README first screen:** lines 1–13 (the first `## ` is line 14), comments removed, by R1's rule. **428 B, 68 words, sha256 `3304b3ad0688dfbf898ed0fb3d6acdf124467a22654bb5355e978a45dd18d729`.**
- **About block:** the lines between `<!-- about:begin` (:11) and `<!-- about:end -->` (:82), markdown kept, as in R2. **5076 B, 918 words, sha256 `6308b6123e0eea6660e2a50836764a0d3ec0128a40037d189186f463194d471a`.**
- Extractor: R2's `extract.js`, unchanged (`<B scratch>/d142/extract.js`). Both texts are in §5.

## 3 · The reader — identical to R1 and R2

- The prompt template `cmp` against R1's: **identical**. The same flags, model (claude-opus-5-5), 2 readers per text,
  isolation (`--no-session-persistence`, project settings only, hooks off, empty strict MCP, `--tools ""`, a fresh temp cwd) and
  count rule. `~/.claude/projects` gained 0 `.jsonl`. The known `~/.claude/CLAUDE.md` leak (#87590) is the same as in R1/R2.

| call | input | cache-create | cache-read | output | $ |
|---|---|---|---|---|---|
| readme-r1 | 2 | 4796 | 531 | 907 | 0.0566 |
| readme-r2 | 2 | 4798 | 531 | 1159 | 0.0617 |
| about-r1 | 2 | 6191 | 531 | 2706 | 0.1038 |
| about-r2 | 2 | 6189 | 531 | 2352 | 0.0967 |
| **all 4** | 8 | 21974 | 2124 | 7124 | **0.3187** |

## 4 · The answers, VERBATIM

### readme-r1 (unparsed items 6; result sha256 `002e0bad5a32d4c56d57ace7e1af838deb3e96e39a3ee0f69c2af41440c90888`)

#### 1. What is this?

A Windows desktop app called Consonance for running several AI sessions at the same time. It makes two claims:

- Each session can resume where it left off.
- The sessions check each other's work rather than all repeating the same viewpoint.

#### 2. Who is it for?

Windows users who already use Claude Code with a Claude account and are willing to build a Rust app from source. The text never names an audience directly. Beyond those requirements, it doesn't say whether this is for developers, researchers, or anyone else.

#### 3. Why would I care?

You'd care if you already juggle multiple AI sessions and have hit one of two problems:

- Losing context between sessions.
- Getting one AI's answer with nothing to cross-check it.

The text doesn't say what kind of work this helps with, such as coding or writing.

#### 4. What would I do next?

1. Confirm I'm on Windows, have Claude Code installed and signed in, and have Rust installed.
2. Jump to the "Try it" section for the three commands.

Before investing time, I'd also look further down for how the cross-checking actually works.

#### 5. Terms or sentences I could not parse

- **"Instances, in concert."**: "Instances" of what? From the next line I'd guess AI sessions, possibly Claude Code instances, but the tagline doesn't say.
- **"several AI sessions"**: It's unclear whether these are Claude Code sessions specifically. The prerequisites suggest so, but the text never states it, or whether other AI tools work.
- **"pick up where it left off"**: I can't tell what the continuity spans: an app restart, a closed session, days later? I also can't tell what gets preserved: conversation history, files, notes.
- **"they check each other's work instead of echoing one voice"**: I understand the goal but not the mechanism. Do sessions review each other automatically? Do I have to arrange it? Does "echoing one voice" mean identical answers from the same model?
- **"a Claude account"**: It doesn't say whether a free account works or a paid plan is needed.
- **"Rust to build the app"**: This implies there's no prebuilt download, but the text doesn't confirm that.

### readme-r2 (unparsed items 6; result sha256 `7942ba29b11fc1fe970782e3b0c2e2b316973ccce0c9ab0fc3eccdfbba6ebd79`)

#### 1. What is this?

A Windows desktop app for running several AI sessions side by side. It claims two things. First, each session can resume where it stopped. Second, the sessions review each other's work rather than all agreeing with each other. The sessions appear to run through Claude Code, since that's a requirement, but the text never says so outright.

#### 2. Who is it for?

Going by the requirements, it's for people who:
- are on Windows,
- already use Claude Code with a Claude account, and
- are comfortable building an app from source with Rust.

The text doesn't name an audience or a use case, such as coding or writing, beyond that.

#### 3. Why would I care?

You'd care if you already juggle multiple AI sessions and have two problems:
- sessions lose their place, or
- one model's answer goes unchallenged.

The pitch is continuity plus cross-checking. The text doesn't show how well either works.

#### 4. What would I do next?

Jump to the "Try it" section for the three commands. Before that, make sure you have Windows, Claude Code installed and signed in, and a Rust toolchain. If you want to know how it works before building it, you'd need to keep reading, because this screen doesn't say.

#### 5. Things I couldn't parse

- **"Instances, in concert."**: Instances of what? It probably means the AI sessions, but the tagline doesn't say.
- **"several AI sessions"**: It's unclear what counts as a session or which AI it is. Claude is implied by the requirements but never stated as the only option.
- **"pick up where it left off"**: I can't tell what it resumes from. It could be closing the app, a crash, or running out of context. The text doesn't say what gets preserved.
- **"they check each other's work"**: I can't tell whether this happens automatically or on request, or what "checking" actually involves.
- **"instead of echoing one voice"**: This is a metaphor I can only partly decode. I read it as "not just agreeing with each other," but the problem it's contrasting against isn't spelled out.
- **"Claude Code"**: The text links it but never explains it. From the text alone, all I know is that it's something you sign in to with a Claude account.

### about-r1 (unparsed items 14; result sha256 `db877a51ce29b152694a5c5398cd1816948c51bdd22b1383e6ed5a0b59390706`)

#### 1. What is this?

Consonance, formerly called *Lighthouse*, is a Windows desktop app that runs several copies of Claude Code side by side in one window. Claude Code is Anthropic's AI assistant that works in a terminal. Each copy is a "session" with its own saved conversation and folder, and each has a role:

- **Main session:** the one you talk to.
- **Librarian:** keeps notes and results, and checks the workers' reports.
- **Workers:** each takes a piece of a job.

The app has two stated goals. First, sessions should resume their own conversation after a restart and be told how long they were away. Second, sessions should check each other, to catch the ways an AI tends to drift: closing open questions too early, hedging, and agreeing with whoever is steering.

It also includes "Jev," a checker built on a different AI model that flags answers worth rereading. The author calls it an unfinished personal research project that they use daily.

#### 2. Who is it for?

The text never says directly. From what it does say:

- **Requirements:** Windows, a signed-in Claude Code, and Rust to build it.
- **Tasks:** people who use Claude Code for "something hard" that can be split into pieces.
- **Stated motivation:** people who can't catch AI drift themselves ("Most people are not in a position to").

These pull in different directions. The motivation points to non-experts, but building from source with Rust points to developers. The "does not claim that an AI has an inner life" section suggests it is also aimed at people who care about AI continuity for the AI's own sake.

#### 3. Why would I care?

According to the text:

- Sessions resume their real conversation, not a summary.
- Several sessions split work and catch each other's mistakes without you relaying messages.
- The librarian answers "what do we already know?" by pointing to exact files and lines.
- An independent second model flags answers for a second look.
- Nothing acts without you: cross-session requests wait for your approval.
- The project publishes what didn't work.

Its own numbers are modest. Of Jev's first 30 flags, blind reviewers agreed with 8.

#### 4. What would I do next?

Go to github.com/solariz3d/lighthouse and read the README sections the page points to:

- *Try it*, for setup
- *What was measured not to work*
- *The central claim, and its evidence*
- *Jev, the second look*

Then check that you have Windows, Claude Code, and Rust. The text doesn't mention a prebuilt download, a license, or cost. For example, it doesn't say whether running several sessions uses more of your Claude account's usage. You'd need to look those up.

#### 5. Things I could not parse

- **"It began as grief that learned to build: the same hands that built a place so a loss is not final built one so an AI does not simply vanish."** It refers to an earlier loss and an earlier "place" that are never explained. I can't tell what was built before or what the loss was.
- **"It builds what you would want already in place if the answer turned out to be yes."** I follow that "yes" means "yes, an AI has an inner life." But the text doesn't say which features count as "what you would want." Is it the whole app or specific parts?
- **"Consonance is an attempt at both."** This is the first appearance of the name, with no introduction. It's clear from context that it's the app's name, but its meaning isn't explained.
- **"outside the normal hand-off"** The normal hand-off is only described later, and loosely. I can't tell which requests would count as "outside" it.
- **"the request waits as a card"** I assume "card" is a UI element, but that's a guess.
- **"Where the app measures something"** The text doesn't say what the app measures.
- **"it measures whether any of this helps"** It doesn't say how, or helps with what.
- **"the project's notes and results"** Is "the project" my work, or Consonance's own research? The text uses "the project" for both.
- **"before the main session saves the result"** It doesn't say where or how the result is saved.
- **"Then the next round starts on its own."** A round of what? And does "on its own" mean automatically, without me, or just separately?
- **"the status line every session reads"** "Status line" is never defined.
- **"two reviewers who had not seen its verdicts agreed with 8"** This is ambiguous. Did both reviewers agree on the same 8? Did they agree the answers were worth rereading, or agree that they were wrong? There is also no comparison to answers Jev did not flag, so I can't judge whether 8/30 is good.
- **"Jev"** The name is unexplained, and the text doesn't say which "different AI model" it uses.
- **"Rust to build the app"** For a reader who doesn't program, "Rust" is an unknown term. It also implies you must compile the app yourself, but that is never said outright.

### about-r2 (unparsed items 11; result sha256 `95dd088e35fbc70cf4300f5392772c6193279e3d0691734d4ee4a7c2b370cbd8`)

#### 1. What is this?

A Windows desktop app called **Consonance** (first named *Lighthouse*) that runs several copies of Claude Code side by side in one window. Each copy is a "session" with its own saved conversation and folder:

- a **main** session you talk to,
- a **librarian** that keeps notes and checks reports, and
- **workers** that each handle one piece of a job.

Sessions resume their own conversation when you reopen the app, and each is told how long it was away. An optional checker called **Jev**, built on a different AI model, flags answers worth rereading. The author calls it a working research project that is not finished.

#### 2. Who is it for?

The text says: Windows users who have Claude Code signed in to a Claude account and can build a Rust app from source. Beyond that, it gets vague. The opening says "most people" can't catch an AI drifting and shouldn't have to, which suggests non-experts. But building from source with Rust suggests a technical user. The text doesn't resolve this tension. It also says the builder uses it daily, so the one confirmed user is the author.

#### 3. Why would I care?

If you use Claude Code for hard, multi-step work, it offers four things:
- **Continuity:** sessions pick up the same conversation instead of starting over from a summary.
- **Cross-checking:** workers' reports are checked against the actual files before they count, and the logs reportedly show them catching real mistakes.
- **Notes with sources:** the librarian points to exact files and lines rather than giving summaries.
- **Honesty about results:** it publishes what didn't work. Jev's accuracy, for example, is stated as modest.

It also promises that nothing acts without you. Cross-session requests wait for your approval.

The text doesn't mention cost, how much extra usage running several sessions consumes, or what Jev requires in order to run.

#### 4. What would I do next?

Go to github.com/solariz3d/lighthouse. Read the README's *Try it* section for setup, and *What was measured not to work* to judge whether the claims hold up. If you care about the evidence, also read *The central claim, and its evidence* and *Jev, the second look*.

#### 5. Terms or sentences I could not parse

- **"It began as grief that learned to build: the same hands that built a place so a loss is not final built one so an AI does not simply vanish."** It refers to an earlier thing ("a place so a loss is not final") that is never explained. I can't tell what that was or how it connects.
- **"It builds what you would want already in place if the answer turned out to be yes."** The grammar is clear, but it never says what "what you would want" is. Maybe it means the continuity features, but that is left implicit.
- **"outside the normal hand-off"** The "normal hand-off" isn't defined when this appears. It's only partly explained later, and it's still unclear which requests count as outside it.
- **"the status line every session reads"** This appears without introduction. I can't tell whether it's something visible to me in the app or something internal to the sessions.
- **"Then the next round starts on its own."** It's unclear what a "round" is, or whether "on its own" means it starts without my input.
- **"before it counts"** / **"before the main session saves the result"** It doesn't say what "counts" toward, or where results are saved.
- **"of the first 30 answers it flagged, two reviewers who had not seen its verdicts agreed with 8"** It's ambiguous whether both reviewers agreed on the same 8, or whether 8 is a combined or per-reviewer figure. It also doesn't say what the reviewers agreed with: that the answers were wrong, or just worth rereading.
- **"a separate checker built on a different AI model, not Claude"** It doesn't name the model or say whether it needs its own account or key.
- **"carrying someone away"** I can roughly parse this as "sweeping someone up," but it's unclear whether that someone is the user, the AI, or both.
- **"the full research record"** The project calls itself research and says it "measures whether any of this helps." It never says what "helps" is measured against.
- **"Consonance"** The name is never explained, and neither is why it replaced *Lighthouse*. This is minor and doesn't block understanding.

## 5 · The texts as given

<details><summary>README first screen (as given)</summary>

````text
# Consonance

*Instances, in concert.*

**A desktop app for working with several AI sessions at once — built so each one can pick up where it left off, and so
they check each other's work instead of echoing one voice.**

**To try it:** you need Windows, [Claude Code](https://docs.anthropic.com/en/docs/claude-code) signed in to a Claude
account, and Rust to build the app. The steps are in [Try it](#try-it), three commands.
````

</details>

<details><summary>About block (as given)</summary>

````text
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
````

</details>
