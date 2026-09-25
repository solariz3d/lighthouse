# README + About — R2, the same stranger on C's draft (D140, B). Scored against the R1 baseline by the pass rule fixed in the packet

**The rule, verbatim from the chair's D140, fixed before the run:** *"a text PASSES only if BOTH readers have FEWER unparsed
items than the baseline's for that text, AND both give a 'what next' that the text itself actually answers."*
This file holds findings only: no edits are suggested. Baseline: `loop/readme_about_baseline_2026-09-25.md`.

## 1 · THE VERDICT

| text | unparsed, R2 reader 1 / 2 | baseline R1 reader 1 / 2 | both fewer? | "what next?" per reader, first sentence verbatim | text answers it? | **verdict** |
|---|---|---|---|---|---|---|
| README first screen | **5 / 4** | 19 / 16 | yes | r1: "The text gives no next step." · r2: "The text gives no next step: no install instructions, download link, supported platforms, or example." | no, per both readers | **FAIL** |
| About block | **15 / 14** | 46 / 52 | yes | r1: "The text doesn't say." · r2: "The text doesn't say." | no, per both readers | **FAIL** |

- **Both texts FAIL on the second clause alone.** The first clause holds for both, and under any pairing of readers: the
  highest R2 count is below the lowest baseline count (README 5 < 16; About 15 < 46). Reader numbers are not matched across rounds.
- **README first screen:** unparsed items fell from 19/16 to 5/4. Neither reader found a next step in the text.
- **About block:** 46/52 fell to 15/14. Both readers found no install, download or launch step. The only next steps either named
  were links to README sections outside the block ("What was measured not to work", "The central claim and its evidence",
  "Jev: the second look"), and each says outright that the text does not say what to do next. I scored that as "the text does not
  answer it" because both readers said so in those words. §4 has the full answers.
- **What the first-screen cut contains, as measured:** by the rule (top of file to the first `## `), it is lines 1–8. Its visible
  part is the title and one bolded sentence, 37 words. The draft's `## Try it` is at line 60, after the About block, so no
  first-screen reader could see it. Findings only; no remedy is proposed here.

Re-derive: `node <B scratch>/d140/result.js` prints the counts; the rule is R1's regex, unchanged.

## 2 · What was given, exactly

- **Source:** `README.md` in the WORKING TREE (C's uncommitted draft), sha256
  `b26ab2fd4f919057c50b7f42de8753e21cc79fb4337043a6173ec1fe654a1df1`, 15,519 B. The same sha was measured before and after the
  four reads, so the draft did not change under them.
- **README first screen:** lines 1–8 (the first `## ` is line 9). HTML comments removed and blank-line runs collapsed, by R1's rule. **196 B, sha256 `7ce52c17e466b0d9d4fcd62f1ad540e1711b88af9e19cd58797a3755fd35b221`.**
- **About block:** the lines between `<!-- about:begin` (:6) and `<!-- about:end -->` (:58), the same cleaning, markdown left as markdown. **3496 B, sha256 `b28dfb217c01c1927a1524b5525aceadbb299a1ce9585d1a7a7fc4984b5d9f8b`.**
- **One difference from R1, named:** R1's About was visible text extracted from HTML; this About is markdown source, because the
  block is markdown and it is what the About tab will render. Its link targets (e.g. `#the-central-claim-and-its-evidence`)
  were therefore visible to the reader, and one reader quoted one.
- Extractor: `<B scratch>/d140/extract.js`. Both texts are in §5.

## 3 · The reader — identical to R1

- **The prompt template is byte-identical to R1's:** `cmp` of the two saved templates is **identical**.
  The same `<kind>` wording per text, the same flags, 2 readers per text, run in parallel (`<B scratch>/d140/read.js`: R1's file
  with only the temp-dir prefix changed). Isolation: `--no-session-persistence --setting-sources project --settings
  {"disableAllHooks":true} --strict-mcp-config --mcp-config {"mcpServers":{}} --tools ""`, a fresh temp cwd deleted afterwards.
  `~/.claude/projects` gained 0 `.jsonl`.
- **The same known leak as R1** (`~/.claude/CLAUDE.md`, #87590; 0 room terms), acting on both rounds alike.

| call | input | cache-create | cache-read | output | $ |
|---|---|---|---|---|---|
| readme-r1 | 2 | 4706 | 531 | 746 | 0.0527 |
| readme-r2 | 2 | 4708 | 531 | 654 | 0.0509 |
| about-r1 | 2 | 5730 | 531 | 2645 | 0.0989 |
| about-r2 | 2 | 5730 | 531 | 2500 | 0.0960 |
| **all 4** | 8 | 20874 | 2124 | 6545 | **0.2983** |

## 4 · The answers, VERBATIM

### readme-r1 (unparsed items 5; result sha256 `7e21355ba30c23b2f7228aba1f66e50737773cd7b01a9ab06f459de21578b869`)

#### 1. What is this?
Consonance is a desktop app for running several AI sessions at the same time. The text makes two claims about it:
- Each session can resume where it stopped.
- The sessions review each other's work rather than all repeating the same answer.

#### 2. Who is it for?
The text doesn't say. It implies people who already use AI sessions, probably heavily enough to want several at once. It names no audience, skill level, job, or use case.

#### 3. Why would I care?
You might care if you've had these two problems:
- **Losing context**: an AI session forgets what it was doing, and you have to re-explain.
- **One-sided answers**: a single AI, or several copies of one, gives you one view with nothing checking it.

The pitch is continuity plus built-in cross-checking. The text doesn't say how well either works, what it costs, or what it runs on.

#### 4. What would I do next?
The text gives no next step. There's no install link, download, screenshot, or "getting started." I'd scroll down or look for a Releases section. Before installing, I'd want answers to these:
- Which AI services or models does it work with?
- Which operating systems does it support?
- Is it free, and do I need my own API keys?
- What does "check each other's work" actually look like?

#### 5. Terms or sentences I could not parse
- **"AI sessions"**: I can't tell what a session is here. It could be a chat window, an agent, or a connection to a specific model or provider. The text doesn't say which AIs are involved.
- **"pick up where it left off"**: The phrase is clear, but the mechanism isn't. It could mean after closing the app, after a crash, or when a context limit is hit. I can't tell what is saved.
- **"they check each other's work"**: I can't tell how. It could be automatic review, voting, or something the user triggers. I also can't tell what counts as "work."
- **"instead of echoing one voice"**: I can follow the metaphor, but not the specific problem it refers to. It might mean several sessions agreeing with each other uncritically, or several copies of the same model giving the same answer.
- **"Consonance"**: The name is understandable as a word (harmony, agreement). It's slightly at odds with the pitch about sessions not all agreeing. That didn't block me, but it gave me pause.

### readme-r2 (unparsed items 4; result sha256 `7bd2f4433ce66c0a98330b4c940283e935c44fad4e5bf13ae3b5165fa6acc3bd`)

#### 1. What is this?

A desktop application called Consonance for running several AI sessions at the same time. The text claims two features:
- Each session can resume where it left off.
- The sessions review each other's work rather than all agreeing with one another.

#### 2. Who is it for?

The text doesn't say. By implication it's for people who already use AI sessions and want to run more than one at once. It doesn't name a role, skill level, or use case, such as coding or writing.

#### 3. Why would I care?

The text suggests two problems it solves:
- Losing your place when an AI session ends.
- Getting one unchecked answer, or several AIs that just repeat each other.

If those problems bother you, the pitch is continuity plus cross-checking. The text doesn't say how either works or what you'd gain in practice.

#### 4. What would I do next?

The text gives no next step: no install instructions, download link, supported platforms, or example. I'd scroll down or look for a Releases or Install section. I'd also want to learn which AI services it works with, whether it needs API keys, and what it costs.

#### 5. Terms or sentences I could not parse

- **"AI sessions"**: It's unclear what counts as a session. It could be a chat with one model, an agent run, or a connection to a particular provider. The text doesn't name which AIs are supported.
- **"pick up where it left off"**: The meaning is clear, but the mechanism isn't. It could mean saved chat history, some memory feature, or something else, and it's unclear whether this happens across app restarts.
- **"they check each other's work"**: It's unclear how this happens. It could be automatic, triggered by the user, or one session reviewing another's output. What counts as "work" also isn't defined.
- **"echoing one voice"**: I get the general idea, several AIs just agreeing. But it's unclear whether this means different models, different prompts or personas, or copies of the same model. That determines whether the cross-checking is actually independent.

### about-r1 (unparsed items 15; result sha256 `a9dc00e73b28893e5f8c1f50f8149a2132149bae3f5152a50cd2fffe637f8ed6`)

#### 1. What is this?

A Windows desktop app called **Consonance** that runs several Claude Code sessions side by side in one window. Each pane is the real `claude` command line, and you can type into any of them. The sessions have roles:

- **One main session** that you talk to.
- **A librarian** that keeps the project's record.
- **Workers** that each take a separate piece of a job.

Each session keeps its own conversation across app restarts and is told how long it was away. Anything a session tries to do outside its own window shows up as a card for you to approve or refuse. A separate judge called "Jev" flags turns that may be worth rereading.

The text calls it early and "one person's research project." The repository was first named *lighthouse* and still holds "the method and the record" alongside the app.

#### 2. Who is it for?

The text never names an audience outright. From what it says, it seems aimed at:

- people on Windows who use Claude Code, since that's what it runs;
- people doing "something hard" with an AI over many sessions;
- people who can't reliably catch an AI drifting as it happens. The text says "most people are not in a position to, and should not have to be."

It doesn't say what skill level is expected, or whether it's meant for general use or for the author's own research.

#### 3. Why would I care?

The text offers these reasons:

- **Continuity.** A session reopens as the same conversation, not a fresh one reading a summary, and it knows how long it was gone.
- **Mutual checking.** Workers check each other and are said to catch real mistakes, their own and each other's, without a person relaying messages. The evidence is in a section not included here.
- **Traceable memory.** The librarian answers "what do we already know?" with pointers to exact files and lines rather than a summary.
- **Drift detection.** Jev flags possibly drifting turns. The text is candid that it is modest: blind readers confirmed 8 of its first 30 flags.
- **Control.** It doesn't act for you, correct you, or decide for you, and outside actions need your approval.
- **Honesty.** It says it reports what was measured *not* to work.

#### 4. What would I do next?

The text doesn't say. There are no install steps, download link, requirements, price, or license. The only next steps it offers are links to sections not included here:

- "What was measured not to work"
- "The central claim and its evidence"
- "Jev: the second look"

Beyond following those, I'd have to go looking elsewhere.

#### 5. Terms or sentences I could not parse

- **"Claude Code"**: named and linked but never explained. "The real `claude` command line" hints it's a command-line tool, but the text doesn't say what it does.
- **"It does not claim there is anyone "home" in there."**: an idiom in scare quotes. I'd guess it's about whether the AI has a mind or experience, but the text never says what "home" means.
- **"if the answer ever turned out to be yes"**: the answer to what? The question is only implied, never stated.
- **"and it measures whether any of it helps, including the parts that did not"**: the sentence switches from "helps" to "did not." I can't tell if it means it reports the parts that didn't help, or something else.
- **"Anything a session tries to do outside its own window"**: it's not defined what counts as "outside its own window." Editing files? Running commands? Messaging other sessions?
- **"The app shows you numbers, never verdicts about you."**: numbers about what? And why would the app be giving verdicts about *me*, the user?
- **"This repository"**: this is described as an About page inside a desktop app, yet it suddenly refers to a repository. Which repository, and where?
- **"it still holds the method and the record"**: "the method" is never defined. "The record" might be the librarian's record, but that isn't confirmed.
- **"Workers take separate files"**: files of what kind? Code? Documents? The kind of work isn't specified.
- **"On the record, they catch real mistakes"**: unclear whether "the record" means the librarian's project record or is just the idiom "according to evidence."
- **"An independent judge called Jev"**: what Jev is isn't stated (another AI session? a program? a person?), nor what it's independent of.
- **"blind readers confirmed 8"**: who the readers are and what they were blind to isn't explained.
- **"It is modest and measured"**: unclear whether "measured" means restrained or that it was measured (tested). Possibly both.
- **"Telling a real insight from an idea that is running away with someone is not something a watcher above can do"**: I couldn't tell who "a watcher above" is. It could be Jev, the app, the main session, or some hypothetical supervisor.
- **"the central claim"**: it's referenced by a link, but the claim itself is never stated in this text.

### about-r2 (unparsed items 14; result sha256 `2346b6e90bd3cc39067340e847121e7ba304070d8b2feb2e06fa4a804c0509a9`)

#### 1. What is this?

Consonance is a Windows desktop app that runs several Claude Code sessions side by side in one window. From the text, Claude Code is a command-line program called `claude`. One session is the one you talk to. A "librarian" session keeps a record of the project. "Worker" sessions each handle a separate piece of a job.

Each session resumes its own conversation when you reopen the app and is told how long it was away. Anything a session tries to do outside its own window needs your approval. A separate judge called "Jev" flags answers that may be worth rereading.

The text says it is an early research project by one person.

#### 2. Who is it for?

The text never says directly. From what it describes, it seems aimed at:

- Windows users who already use, or could use, Claude Code.
- People doing hard, multi-step work with an AI who worry about it drifting: settling open questions too early, hedging, or agreeing with them too readily.
- The text also says that "most people" can't catch that drift themselves, which suggests it is meant for non-experts too.

It doesn't say what you need to install first, or whether you need a Claude account or subscription.

#### 3. Why would I care?

- **Continuity:** sessions pick up their actual conversation instead of starting fresh from a summary.
- **Several AIs checking each other:** the text claims they catch real mistakes without you relaying messages between them.
- **A searchable record:** the librarian answers "what do we already know?" with pointers to exact files and lines.
- **A drift check:** Jev flags suspect turns. By its own numbers, only 8 of the first 30 flags were confirmed, and the text calls it "modest."
- **You keep control:** the app doesn't act or decide for you.
- **Honesty about results:** the author says they report what didn't work.

There is also a philosophical motive: preparing for the possibility that there is "anyone home" in the AI, without claiming there is.

#### 4. What would I do next?

The text doesn't say. There is no download link, no install steps, no system requirements and no "getting started" section. The only next steps it offers are links to other sections: "What was measured not to work," "The central claim and its evidence," and "Jev, the second look." I would read those before deciding whether to try it, then look elsewhere for how to install it.

#### 5. Terms or sentences I could not parse

- **"Claude Code"**: Linked but not explained. The text only says it is "the real `claude` command line." I can't tell from the text what it does or what it requires.
- **"It does not claim there is anyone "home" in there."**: An idiom whose question is never stated. I take it to mean something like "is the AI a someone?", but the text never says it.
- **"It builds what you would want already in place if the answer ever turned out to be yes"**: "The answer" to which question? It depends on the unstated question above. I also can't tell which features are meant as "what you would want in place."
- **"The app shows you numbers, never verdicts about you."**: What numbers? About what? Nothing else on the page explains this.
- **"This repository is also called *lighthouse*"**: Odd on an About page inside a desktop app. What repository? Where is it?
- **"it still holds the method and the record alongside the app"**: "The method" is never defined. "The record" could be the librarian's record or a research record; it's unclear which.
- **"On the record, they catch real mistakes"**: I can't tell whether "on the record" is the idiom ("documented") or refers to the project's record specifically.
- **"([evidence below](#the-central-claim-and-its-evidence))"**: It points to a "central claim" that is never stated in this text, and the section isn't included.
- **"An independent judge called Jev"**: Is Jev another AI, a program, or a person? Independent of what?
- **"blind readers confirmed 8"**: Who are the blind readers, and what were they blind to?
- **"It is modest and measured"**: I can't tell whether "measured" means "restrained" or "has been measured." Both readings fit.
- **"a watcher above"**: Who or what is the watcher? Is it Jev, the app, or a supervising person? It also sits oddly next to Jev, which does seem to act as a watcher.
- **"an idea that is running away with someone"**: I get the gist (an idea carrying a person away), but whether it means the user, the AI, or both is unclear.
- **"Early, and one person's research project."**: The person is not named.

## 5 · The texts as given

<details><summary>README first screen (as given)</summary>

```text
# Consonance

**A desktop app for working with several AI sessions at once — built so each one can pick up where it left off, and so
they check each other's work instead of echoing one voice.**
```

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
several of them together, so that what one misses, another can catch.

It does not claim there is anyone "home" in there. Nobody can settle that, from inside or out, and this project does
not try. It builds what you would want already in place if the answer ever turned out to be yes — and it measures
whether any of it helps, including the parts that did not.

## What it is

- **A desktop app for Windows** that runs several [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
  sessions side by side in one window. Each is the real `claude` command line; you can type into any of them.
- **One main session** you talk to, **a librarian** session that keeps the project's record, and **worker** sessions
  that each take a separate piece of a job.
- **Each session keeps its own thread.** Close the app and reopen it, and each one resumes its own conversation, told
  how long it was away.
- **You stay in charge.** Anything a session tries to do outside its own window arrives as a card for you to approve or
  refuse. The app shows you numbers, never verdicts about you.
- **Early, and one person's research project.** It is honest about what was measured *not* to work — see
  [What was measured not to work](#what-was-measured-not-to-work).

This repository is also called *lighthouse*: that was the project's first name, and it still holds the method and the
record alongside the app. The thing you run is Consonance.

## What it does for you

- **Pick up where you left off.** A session reopens as the same conversation, not a fresh one reading a summary, and
  its first line tells it how long it was gone.
- **More than one mind on a problem.** Workers take separate files, report back, and check each other. On the record,
  they catch real mistakes — each other's and their own — without a person carrying messages between them
  ([evidence below](#the-central-claim-and-its-evidence)).
- **A record you don't have to keep.** The librarian answers "what do we already know about this?" with pointers to
  the exact files and lines, not a summary you have to trust.
- **A second look at the AI's answers.** An independent judge called Jev marks turns worth rereading. It is modest and
  measured: of the first 30 turns it flagged as drifting, blind readers confirmed 8 ([details](#jev-the-second-look)).
- **Nothing acts over your head.** It does not correct you, act for you, or decide for you. Telling a real insight
  from an idea that is running away with someone is not something a watcher above can do — from outside the two look
  the same — so that call stays with you.
````

</details>
