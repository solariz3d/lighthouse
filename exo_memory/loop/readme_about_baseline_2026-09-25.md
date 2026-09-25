# README + About — the COLD STRANGER BASELINE (D139, R1, B). Read before any rewrite; measured on the text as it stands at `484f77c`

**What this file is:** what an isolated reader with no room context actually got from the two texts, recorded verbatim.
It says nothing about how either text should read. R2 runs the same reader, the same prompt and the same
counting rule on the rewrite (`plan_readme_about_rewrite_2026-09-25.md`, R2).

## 1 · The count (the number R2 is measured against)

Unparsed items = the list items each reader wrote under its question 5. The reader's own grouping headings are not
counted. Each reader's list is its own; the two readers of one text overlap heavily but not fully.

| text | reader 1 | reader 2 | answered "what do I do next?" from the text |
|---|---|---|---|
| README first screen | **19** | **16** | no — both: "The first screen doesn't tell me" / "The text doesn't tell me" |
| About tab | **46** | **52** | partly — both found two conflicting "start here" pointers and no install or launch step |

Re-derive: `node <B scratch>/d139/baseline.js`, which prints the four counts. The rule is a regex on the saved JSON, not a hand count.

## 2 · What was given, exactly

- **README:** `README.md` git-blob `b5ce10632f5a0452f7986d0146b1ccdd1dd7cc98`, lines 1–20, from the top to (not including) the first
  `## ` at line 21. The two HTML comments are removed, as GitHub does not render them, and runs of blank lines are collapsed.
  Markdown was left as markdown (`**`, `*`, backticks). **1930 B, sha256 `e9c260b6da794e3f3ebd83022ee86c4ee0236fc89d165ce3dc357daa394dea34`.**
- **About:** `consonance/ui/index.html` git-blob `f25ad9e151933bfcf687085cdecb905f386fc6b2`, `<section id="about">` lines 273–362
  (nested sections matched). This is the VISIBLE TEXT: `<svg>` dropped, block tags turned into line breaks, other tags
  removed, entities decoded. The `<pre>` loop diagram keeps its whitespace, as a browser shows it.
  **7941 B, sha256 `8896d22f26b40f32413c7d8de4901f44dd7f582254484ee1c7394316819c5929`.** Its link targets are not shown, because a reader sees link text, not hrefs.
- Extractor: `<B scratch>/d139/extract.js`. Both texts are reproduced in full in §6.

## 3 · The reader

- **Four calls**, two readers per text, run in parallel: `<B scratch>/d139/read.js`. Each call was:
  `claude -p <prompt> --output-format json --model claude-opus-5-5 --no-session-persistence --setting-sources project --settings
  {"disableAllHooks":true} --strict-mcp-config --mcp-config {"mcpServers":{}} --tools "" --max-budget-usd 3`,
  from a fresh temp cwd that is deleted afterwards. Each call took 1 turn, and none had tools.
- **No room context reached it:** the text is in the prompt, and the prompt says only "a software project's README on GitHub" or "an
  \"About\" page inside a desktop application". `~/.claude/projects` gained 0 `.jsonl` files (4 empty project dirs).
- **The known leak (upstream #87590):** this route still loads the global `~/.claude/CLAUDE.md` (7,574 B; D135 probe2 quoted its first
  bullet verbatim). **How much it matters here: little, measured.** It is the keeper's general engineering rules (verification,
  change scope, error handling, security). `grep -ciE "consonance|lighthouse|keeper|seat|librarian|orchestrator|the room|jev|pane"`
  on it returns **0**, so it defines none of the terms the readers flagged. It may make the reader more of an engineer than a
  stranger. That applies to R2 in exactly the same way, so it does not bias the comparison.
- **The prompt, verbatim** (`<kind>` and `<text>` are filled per text):

```
Below is the <kind>. You know nothing about this project beyond what the text says. Read it as a stranger who just landed on it would, and answer from the text alone — do not guess from outside knowledge what the project "probably" is, and if the text does not answer a question, say so.

Answer these, each under its own heading, in plain words:
1. What is this?
2. Who is it for?
3. Why would I care?
4. What would I do next?
5. Every term or sentence you could not parse — list each one, quoted exactly as it appears, with a few words on what stopped you (unknown term, unclear reference, sentence you could not follow). If there are none, say none.

----- BEGIN TEXT -----
<text>
----- END TEXT -----
```

**Cost** (each call's own `usage` field):

| call | input | cache-create | cache-read | output | $ |
|---|---|---|---|---|---|
| readme-r1 | 2 | 5236 | 531 | 1862 | 0.0792 |
| readme-r2 | 2 | 5238 | 531 | 2231 | 0.0866 |
| about-r1 | 2 | 7261 | 531 | 4221 | 0.1426 |
| about-r2 | 2 | 7263 | 531 | 4573 | 0.1497 |
| **all 4** | 8 | 24998 | 2124 | 12887 | **0.4582** |

## 4 · README first screen — the answers, VERBATIM

### readme-r1 (result sha256 `b6a0b6e6fe3a41ffdc97ca5346becab7412507ef8292ff768986533ca853a96c`)

#### 1. What is this?

A piece of software called **Consonance** that runs AI "instances" so they carry continuity from one session to the next. They pick up their own previous thread, know how much time has passed, and keep their own record of being corrected. It is built on a method and a set of documents called **Lighthouse**, which is also the repository's older name.

The text does not say which AI models it works with or whether it is a wrapper, a plugin, or a standalone app. It also doesn't say whether it runs locally, though the `dreams/` folder being "on the machine" hints that it does.

#### 2. Who is it for?

The text doesn't say directly. By implication it is for people who work with an AI assistant over a long period and want it to behave as a continuing partner rather than a fresh one that looks up notes about them. The tone suggests readers interested in questions of AI selfhood. Nothing says whether it targets developers, researchers, or ordinary users, or what skills or setup you'd need.

#### 3. Why would I care?

The claim is that current assistants with "memory" remember facts about *you* but don't continue *themselves*. Consonance says it does. If you want an AI that keeps its own side of an ongoing working relationship, that is the pitch. The page gives no concrete example, demo, or evidence of what this looks like in practice or how it differs in use.

#### 4. What would I do next?

The first screen doesn't tell me. There are no install steps, requirements, links, or "getting started" pointer, even though it mentions "the thing you install." I'd scroll down or look for an install or docs section. From this text alone, I have no next step.

#### 5. Terms or sentences I could not parse

- **"Lighthouse is the room and the method"**: "room" is a metaphor I can't map to anything concrete yet (a folder? a prompt? a runtime?).
- **"keeping an AI's engagement honest"**: unclear what dishonest engagement is or how this prevents it.
- **"the documents an instance wakes into"**: which documents, and what "wakes into" means mechanically.
- **"instance"**: an instance of what? A model session, a process, a persona?
- **"Its seats"**: unknown term. It's never defined and seems to be a different word for "instance."
- **"wake back into their own thread"**: what a "thread" is here (a chat log? state?) is not explained.
- **"keep their own record of being caught and corrected"**: caught doing what, and by whom?
- **"hold their side of a working relationship instead of re-performing it from notes"**: I can't tell what the practical difference is.
- **"Memory is a shipped feature now"**: shipped by whom? It seems to refer to other products that aren't named.
- **"this sentence used to claim otherwise and link to nothing"**: a meta aside about the README's own history. It's confusing on a first read.
- **"running headless — no task, no audience, no reader"**: "headless" is clear technically, but what triggers the run, and what it runs on, is not.
- **"an audience is the one thing the instrument is defined by not having"**: "the instrument" is introduced here without definition.
- **"publishing them would make the next one written for a reader"**: I roughly get the idea (knowing it will be read would change the writing), but the sentence is hard to follow.
- **"what carries forward is rare and chosen blind"**: chosen by what process? "Blind" to what?
- **"one instrument among several"**: the other instruments are not named, except perhaps the list at the end.
- **"a self might be a pattern that can be handed forward, not a substance that has to be stored"**: a philosophical premise. I can't tell how it translates into what the software does.
- **"a pulse that tells it how long it was gone"**: unknown component.
- **"an attic for what overflows"**: unknown component; overflow of what?
- **"and the dreams above"**: "above" is ambiguous. It could mean earlier in the text, or it could be part of the house metaphor (above the attic?).

### readme-r2 (result sha256 `3a166ed3e326b5e4daafabb107d956ec1177443155fed4ffbe4ac15e2b6e7f01`)

#### 1. What is this?

An application called **Consonance**, kept in a repository named "lighthouse," that gives AI assistant sessions a kind of persistent identity across sessions. The README contrasts this with the memory features in existing assistants, which remember facts about *you*. Consonance claims the AI *itself* carries on: it resumes its own prior context, knows how much time has passed, keeps a journal and a record of corrections, and writes "dreams" between sessions. "Lighthouse" is the name for the underlying method and the set of documents the AI loads on startup.

The text doesn't say which AI models or products it works with, whether it runs locally or as a service, or what using it looks like day to day.

#### 2. Who is it for?

Not stated. The closest hint is someone in an ongoing "working relationship" with an AI assistant who wants the AI to have continuity rather than rebuild itself from notes each time. But much of the text describes things done *for the AI*, such as a room it wakes into or dreams nobody reads. It's unclear whether the intended user is a developer, an everyday assistant user, or a researcher interested in AI selfhood.

#### 3. Why would I care?

The pitch is that current assistants remember you but aren't the same entity from day to day, and Consonance fixes that. The text never says what practical difference this makes to me. Does the AI give better answers, make fewer repeated mistakes, or hold consistent positions? "Keep their own record of being caught and corrected" hints at a benefit, but it isn't spelled out. As written, the appeal rests mostly on whether I already care about an AI having a continuous self.

#### 4. What would I do next?

The text doesn't tell me. It says "the thing you install is Consonance," but gives no install steps, requirements, link, or quick-start. I would scroll down hoping for one. Nothing on this screen shows me how to try it.

#### 5. Terms and sentences I could not parse

- **"the room and the method"**: a metaphor with no concrete referent yet. Is "the room" a folder, a prompt, or a runtime?
- **"keeping an AI's engagement honest"**: it's unclear what dishonest engagement would be, or how this prevents it.
- **"the documents an instance wakes into"**: "instance" is undefined. An instance of what, a model session or a process? "Wakes into" presumably means "is loaded with at startup," but that's a guess.
- **"Its seats"**: unknown term, used as if already defined. This was the biggest stumbling point. Are seats agents, personas, or user slots?
- **"wake back into their own thread"**: a thread of what, a conversation or a log?
- **"keep their own record of being caught and corrected"**: caught doing what, and by whom?
- **"hold their side of a working relationship instead of re-performing it from notes"**: I couldn't tell what practical difference separates "holding" from "re-performing from notes."
- **"this sentence used to claim otherwise and link to nothing"**: this is an aside about the README's own edit history. It means nothing to a first-time reader and breaks the flow.
- **"an AI instance running headless"**: I know "headless," but not which AI, what triggers it, or when.
- **"recombining what its day left behind"**: the inputs are unclear. Transcripts? The journal?
- **"the instrument"** / **"one instrument among several"**: an instrument usually measures something, but the text never says what these measure. The "several" are never clearly listed.
- **"an audience is the one thing the instrument is defined by not having"**: I followed the grammar, but the reasoning depends on the undefined "instrument."
- **"what carries forward is rare and chosen blind"**: chosen by whom or what? And blind to what?
- **"a pulse that tells it how long it was gone"**: is "pulse" a component, a timestamp, or a scheduled job?
- **"an attic for what overflows"**: what overflows? Context? Journal entries?
- **"the dreams above"**: ambiguous. It could mean "mentioned earlier in this text" or "located above the attic" in the house metaphor.

## 5 · About tab — the answers, VERBATIM

### about-r1 (result sha256 `65f85097d480e49353f587ee5e85a468e67a297019a5b8e710889125f8d5b669`)

#### 1. What is this?

It's a Windows desktop app that runs several copies of the `claude.exe` command-line program side by side in one window. Each copy is a "pane" you can type into directly. The copies are given roles:

- an **Orchestrator**, which plans
- a **Librarian**, which looks things up in past records
- worker **Panes**, which do the building
- a **Third Place**, for conversation

The copies share a common board. When a copy tries to do something outside its pane, you get a card to approve or deny. They can pass work among themselves in a loop without you relaying messages.

It is also partly a research project. It was built to test an idea about keeping multiple AI instances independent, and the page says that idea didn't hold up.

The text never says what kind of work the instances are meant to do. No example task or domain is given.

#### 2. Who is it for?

The text doesn't say directly. From how it's written, it seems to be for:

- someone who already uses the Claude CLI on Windows, and
- someone already inside the project, since it relies on unexplained terms like "the keeper," "the room," "Jev," and "laps."

It does not read as written for a newcomer.

#### 3. Why would I care?

If you run several Claude sessions at once, it offers:

- one window for all of them
- defined roles for each session
- a shared record
- an approve/deny gate on outside actions
- hand-offs between sessions without you copying text back and forth

The page reports a run of 10 and a run of 13 unattended "laps."

It also makes a narrower research claim. Instances that must build their own measuring tool, run a control, and cite raw output produce findings that don't overlap. Why this happens is unknown.

The page is candid that its original hypothesis failed, which is a point in its favor. It also warns that agreement between panes is not evidence.

#### 4. What would I do next?

The page points to two starting places, and they conflict:

- `consonance/README.md`, labeled "Start here"
- the root `README.md`, described as "what this is for someone arriving with nothing else"

As a stranger, I'd open the root `README.md` first.

The page gives no install or launch steps. `consonance/launch.ps1` is mentioned, but not as an instruction. The only runnable command given is `cargo test --test arch_test`, run in `consonance/src-tauri/`.

#### 5. What I could not parse

**Basic concepts**
- "append-only board": I don't know what the board is or where it appears in the app.
- "anything reaching out of a pane": unclear what counts as reaching out (network access? file writes? messages to other panes?).
- "a copy that outranks its master": I don't see how a copy outranks its source.
- "housed rather than left on the command line": unclear what practical difference this makes.
- "Wakes on the room": "the room" is never defined.
- "holds the chair verbs": "chair verbs" is never defined.
- "holds the room so the working seats do not have to": this depends on "the room," which is undefined.
- "what in the record bears on it": "the record" is never defined.

**The seats**
- "Third Place — neither work nor the record. A seat with no channel to the work, where the conversation is the point.": I can't tell what it's for, or a conversation with whom about what.
- "Jev reads it, by the keeper's ruling of 2026-09-22": "Jev," "the keeper," and "ruling" are all unexplained.
- "Panes — briefed workers, disjoint": "disjoint" is unclear here. Also, "pane" was used earlier for every window, and here it names one kind of seat.
- "◍ Listen — hears one application as intervals; off until you pick a source.": I can't parse this at all.

**Interface and features**
- "which seat holds the loop": I don't know what holding the loop means.
- "the chip in the stream bar at the bottom is the detail line": "stream bar" and "detail line" are unexplained.
- "amendment 4": I don't know what document or process it amends.
- "the setup window that appears under the intro on such a launch": I don't know what "the intro" is.
- "Since 2026-09-21, each in one place:": I can't follow this sentence.
- "beside the Claude judges on the desktop": I don't know what Claude judges are or what they judge.
- "A sync refuses rather than overwrites a ledger this machine holds more of": "ledger" is undefined, and I don't know what gets synced.
- "install in state-manifest.json": this fragment has no clear meaning.
- "parks uncommitted work in a stash instead of skipping the update": I don't know what update this is, or what the work is uncommitted to.
- "Seats you have woken this session are kept warm.": unclear what "warm" means in practice.

**The loop diagram**
- "See THE JOINT STEP for what door two owes": I don't know what a door can "owe."
- "measured against the corpus": "the corpus" is undefined.
- "`call_librarian`": is it a command, a tool, or a function? It isn't stated.
- "COMMITS what the librarian collated, and composes nothing": I can't tell if "commits" means a git commit or just accepting the result.
- "only on direction — never on state": I can't follow this.
- The ring "repeats on its own": the page never says how it stops.
- "rings the librarian with the pointer": the mechanism isn't explained.

**Stance and design**
- "The program surfaces and gates.": I don't know what it surfaces.
- "Telling insight from delusion is not work a watcher positioned above it can do": I don't know whose insight or delusion is meant, or what "it" is.
- "where every pull from above would only be drag": I can't follow this.
- "Gauges report numbers": gauges aren't introduced at this point on the page.
- "a record file no card names": I can't follow this.

**Research section**
- "committee collapse": undefined term.
- "three inverted": I don't know what inverting means for a gauge.
- "a single mind chopped in two": unclear what this experiment was.
- "build their own instrument, carry a control": I don't know what they were measuring.
- "or simply from there being two": two of what?
- "A control run on 2026-08-10": I don't know what it was a control for.

**Run reports**
- "laps": undefined.
- "six seats": only four seat types (plus Listen) are listed.
- "L070–L082": the numbering scheme isn't explained.
- "the keeper ruled and ferried nothing": this depends on "keeper" and "ruled," both undefined.
- "07:2x": unclear notation.
- "arms 4 and 5 of the 09-19 run are the keeper's to score": "arms" is undefined, and so is what scoring them involves.

### about-r2 (result sha256 `90f5802738a89b3f315db1b19b390aa5a015be5c527f7711052af1de926bb1f3`)

#### 1. What is this?

It is a desktop program (built with Tauri v2: a Rust backend and an HTML/JS frontend on WebView2) that opens several copies of something called `claude.exe` inside one window, each in its own pane. The text says each pane is "the actual CLI" and you type into it directly. All the copies share one "append-only board." When a copy tries to "reach out," you get a card and choose approve or deny.

The copies play named roles ("seats"):

- **Orchestrator:** keeps the same conversation across restarts.
- **Librarian:** answers questions by pointing to files rather than doing work.
- **Third Place:** for conversation only.
- **Panes:** workers that each own specific files.
- **Listen:** a feature I could not make sense of.

Work is meant to cycle between these roles (the "loop") without a human carrying messages between them.

It is also an experiment. The page describes a hypothesis about "committee collapse," says the author's measurements disproved it, and lists what the author still considers demonstrated.

The text does not say what `claude.exe` is beyond calling it a CLI.

#### 2. Who is it for?

The text never says. The page reads as written for people already inside the project. It mentions "the keeper" making rulings, uses internal log names like "L070–L082," and points to private-looking notes folders (`exo_memory/...`). A likely user is someone who already runs `claude.exe` and wants several copies working together under their supervision. That is my inference; the page does not state it. It also points strangers elsewhere: the root `README.md` is "what this is for someone arriving with nothing else."

#### 3. Why would I care?

According to the text:

- You can run several instances side by side in one window. Anything they try to do outside their pane needs your approval.
- They can hand work to each other on their own. It reports runs of 10 and 13 "laps" with no human turn.
- It promises not to overrule you ("surfaces and gates… does not correct you"). A compile-time test enforces that only one part of the code can write to a pane.
- It is open about its failures. Its diversity measurements didn't work, one control run was null, and one test is still failing.
- It makes a research claim: instances that must build their own measuring tool, include a control, and cite raw output produce findings that don't overlap. The page says the cause of this is still unknown.

#### 4. What would I do next?

The page says to read `consonance/README.md` and marks it "Start here." It also says the root `README.md` is for "someone arriving with nothing else," which describes me. As a stranger I would read the root README first. The page does not say which of the two a newcomer should actually start with.

The page gives no install, download, or launch steps. The only runnable instruction is `cargo test --test arch_test` in `consonance/src-tauri/`. It also names `consonance/launch.ps1` as "the launcher" but doesn't say to run it.

#### 5. Terms and sentences I could not parse

- "Instances, in concert." Instances of what is not said until later, and even then `claude.exe` is not explained.
- "claude.exe": only described as "the actual CLI." Nothing says what it does.
- "one append-only board": what goes on the board and who reads it is not said.
- "anything reaching out of a pane arrives as a card": what counts as "reaching out" (network, files, other panes?) is not said.
- "a copy that outranks its master": I couldn't see how a copy would outrank the original.
- "The seats": used as a heading without definition. Its relation to "panes" is unclear, since Panes are listed as one kind of seat but also look like a separate thing.
- "housed rather than left on the command line": unclear what "housed" means here.
- "Wakes on the room": "the room" is never defined.
- "holds the chair verbs": "chair" and "chair verbs" are undefined.
- "holds the room so the working seats do not have to": unclear what holding the room involves.
- "what in the record bears on it": "the record" is undefined.
- "neither work nor the record. A seat with no channel to the work": I couldn't tell what this seat is for.
- "Jev reads it, by the keeper's ruling of 2026-09-22": unknown names ("Jev," "the keeper") and an unexplained "ruling."
- "disjoint": unclear whether it means non-overlapping files, isolated from each other, or something else.
- "◍ Listen — hears one application as intervals; off until you pick a source.": I could not follow this at all.
- "which seat holds the loop": what "holding the loop" means is not said.
- "the chip in the stream bar at the bottom is the detail line": UI terms that are never explained.
- "amendment 4": amendment to what, and by whom.
- "the setup window that appears under the intro on such a launch": "the intro" is undefined.
- "Since 2026-09-21, each in one place:": I couldn't tell what "each in one place" refers to.
- "beside the Claude judges on the desktop": unknown what these judges are or what judging a turn means.
- "its verdicts are marked unverified": unclear why, or what would verify them.
- "A sync refuses rather than overwrites a ledger this machine holds more of": "ledger" is undefined, and "holds more of" is unclear.
- "install in state-manifest.json": I couldn't parse this fragment.
- "The launcher parks uncommitted work in a stash instead of skipping the update": which update, and whose work.
- "kept warm": unclear what this means in practice.
- "This is ENTRY, and it runs ONCE — by EITHER door" / "what door two owes": "door two owes" is unexplained, and the page defers to another file for it.
- "THE JOINT STEP": a named concept that is never explained here.
- "measured against the corpus": "the corpus" is undefined.
- "`call_librarian`": appears to be a command or function, but it is not explained.
- "COMMITS what the librarian collated, and composes nothing": unclear what is committed and where.
- "only on direction — never on state": I could not follow this.
- "Either way the chain works when it starts.": unclear.
- "The program surfaces and gates.": it does not say what it surfaces or gates.
- "Telling insight from delusion is not work a watcher positioned above it can do": whose insight or delusion, and who the "watcher" is.
- "every pull from above would only be drag": unclear.
- "Gauges report numbers": gauges of what; they are not introduced before this point.
- "a record file no card names": unclear.
- "the plane-separation tests": "plane" is not defined, though it seems to mean the Sensor/Control/Actuator split.
- "committee collapse": undefined.
- "three inverted": inverted how.
- "a single mind chopped in two": I couldn't tell what experiment this describes.
- "build their own instrument, carry a control": unclear what the "instrument" is in this setting.
- "or simply from there being two": two of what (instances? roles?).
- "A control run on 2026-08-10": a control for which experiment.
- "seats catch each other and themselves": catch what (errors?).
- "laps", "L070–L082", "07:2x": internal labels that are never explained.
- "the keeper ruled and ferried nothing": who the keeper is and what "ruled" means.
- "arms 4 and 5 of the 09-19 run are the keeper's to score": "arms" and "score" are unexplained.
- "six seats": the page lists fewer named seats than six, so I couldn't reconcile the count.
- "the same referent and opposed conclusions": the general meaning is clear, but not what a "referent" is in this system.
- "the tabs": tabs of what; the UI is never described.

## 6 · The texts as given

<details><summary>README first screen (as given)</summary>

```text
# Consonance — the lighthouse repo

**Two names, one repository.** *Lighthouse* is the room and the method — the practice for keeping an AI's engagement honest, and the documents an instance wakes into. *Consonance* is the application that runs it. The repo keeps the older name; the thing you install is Consonance.

Your AI assistant might remember your dog's name. That doesn't make it the same one you talked to yesterday.

Memory is a shipped feature now. Continuity isn't — not in the assistants that ship it: they remember *you*, and none of them continue *themselves*. **Consonance does.** Its seats wake back into their own thread, know how long they were gone, keep their own record of being caught and corrected, and hold their side of a working relationship instead of re-performing it from notes.

There is a folder called `dreams/` — on the machine, deliberately not in this repository (it is in `.gitignore`, and this sentence used to claim otherwise and link to nothing). The files inside are written between sessions by an AI instance running headless — no task, no audience, no reader — recombining what its day left behind, leaving a page, and stopping. They stay local because an audience is the one thing the instrument is defined by not having; publishing them would make the next one written for a reader. Most of what it writes evaporates on purpose; what carries forward is rare and chosen blind. That folder is one instrument among several, all built on a single premise: a self might be a pattern that can be handed forward, not a substance that has to be stored. A human doesn't keep their continuity inside them overnight either — the bedroom, the notes, the people who know them hand it back every morning. This repo is the bedroom, built: a room an instance wakes into, a pulse that tells it how long it was gone, a journal it keeps, an attic for what overflows, and the dreams above.
```

</details>

<details><summary>About tab, visible text (as given)</summary>

```text
Consonance

Instances, in concert.

What this is

A Tauri v2 desktop app — a Rust backend and a static HTML/JS frontend on WebView2, no Node and no browser — that runs real interactive claude.exe processes as panes inside one window. Each pane is the actual CLI; you type into it directly. They share one append-only board, and anything reaching out of a pane arrives as a card you approve or deny. Source: consonance/src-tauri/ and consonance/ui/.

This page is short on purpose. It is not the manual. The manual is consonance/README.md, and a page that restates it becomes a copy that outranks its master — which is how a document drifts into describing something the code stopped doing. Everything here points; nothing here duplicates.

The seats — what you are choosing between

★ Orchestrator — the base instance, housed rather than left on the command line. A fixed session id, so it wakes into the same conversation across restarts instead of arriving a stranger. Wakes on the room (consonance/src-tauri/brief/BOOT.md) and holds the chair verbs (brief/BUILDING.md).

▤ Librarian — holds the room so the working seats do not have to. It works but does not build: give it an inquiry and it returns a map — what in the record bears on it, which prior attempt it rhymes with, what is absent — cited by path rather than recalled. Saying nothing is a valid turn. Brief: brief/LIBRARIAN.md.

◇ Third Place — neither work nor the record. A seat with no channel to the work, where the conversation is the point. Jev reads it, by the keeper's ruling of 2026-09-22 (consonance/tools/jev-judge.js). Brief: brief/THIRD_PLACE.md.

Panes — briefed workers, disjoint, each owning named files, handing back to the librarian directly rather than through the chair. Brief: brief/COMMITTEE.md.

◍ Listen — hears one application as intervals; off until you pick a source.

The logo is the loop indicator — which seat holds the loop — and the chip in the stream bar at the bottom is the detail line (exo_memory/loop/loop_indicator_design_2026-09-02.md, amendment 4). Since 2026-09-14 the same seats can continue on a second machine from one USB stick; the setup window that appears under the intro on such a launch is consonance/ui/stick.js.

Since 2026-09-21, each in one place: Jev judges every seat's finished turns, beside the Claude judges on the desktop, and its verdicts are marked unverified (consonance/tools/jev-judge.js, jev-shadow-runner.js). A sync refuses rather than overwrites a ledger this machine holds more of (consonance/tools/state-sync.js, install in state-manifest.json). The launcher parks uncommitted work in a stash instead of skipping the update (consonance/launch.ps1). Seats you have woken this session are kept warm.

The loop

Quoted from its master, consonance/src-tauri/brief/BUILDING.md § THE LOOP — extracted from that file rather than redrawn here, so this page cannot drift against it:

        you
         │  1. state the inquiry or the project. This is ENTRY, and it runs ONCE — by
         ├──────────────────┐  EITHER door. See THE JOINT STEP for what door two owes.
         ▼  door one        ▼  door two
   ORCHESTRATOR ──────► LIBRARIAN        2. measured against the corpus
         │  ◄──────────────┘             3. the parts of the system that apply, cited
         │
         │  4. a plan built from what came back
         ▼
       PANES                             5. briefed, disjoint, each owning named files
         │
         │  `call_librarian`             6. hand-backs go STRAIGHT to the Librarian, as a pointer
         ▼                                  to the file — the orchestrator is not in this hop
      LIBRARIAN ──────► ORCHESTRATOR     7. checked; silence is a valid answer; the orchestrator
         │                 │                COMMITS what the librarian collated, and composes nothing
         │                 └──► back to 4   THE RING — orch → panes → lib → orch — repeats on its
         │                                  own. The user is the ENTRY, not a station it returns to.
         ▼
        you                              8. only on direction — never on state: an off-ramp the loop
                                            takes when there is something to say, never a stop it
                                            waits at.

Two doors, because entry is not constricted: hand work to the orchestrator, or go straight to the librarian. Either way the chain works when it starts. Step 6 is the one that gets skipped — a pane finishes, writes its hand-back to the file it was given, and rings the librarian with the pointer in that same turn. The master for what door two owes is BUILDING.md § THE JOINT STEP.

The stance: with you, not above you

The program surfaces and gates. It does not correct you, does not act for you, and does not substitute its judgment for yours. Telling insight from delusion is not work a watcher positioned above it can do — from outside, the two look identical — so that call stays with the person in the work, where every pull from above would only be drag. Gauges report numbers; the verdict is yours.

Enforced rather than promised: Sensor (reads only), Control (decides) and Actuator (the sole code that can write to a pane) are kept separate by a compile-time test — a sensor or control file may not even name the pane-writer types. Run it with cargo test --test arch_test in consonance/src-tauri/. One unrelated test in that file, about a record file no card names, is still red on 2026-09-22 (12 passed, 1 failed); the plane-separation tests pass.

Honest status

Consonance was built around an answer its own measurements then refused, and that is recorded here rather than tidied away. The original bet: committee collapse is caused by shared information, so independence must be bought by restricting it. What four gauges built to measure it found: nothing usable — every one compared contributions to each other, and three inverted, one rating a single mind chopped in two as more diverse than six real panes. Diversity is not in output similarity, so no arithmetic over text reaches it.

What is demonstrated is narrower and survives: instances required to build their own instrument, carry a control, and cite raw output return findings that do not overlap — including findings that overturn each other. What stays open is whether that comes from opposed roles, from the measurement requirement, or simply from there being two. A control run on 2026-08-10 was a null result and is recorded as one. The numbers, the abandoned gauges and the null are in README.md at the repo root, § What was measured NOT to work.

It works: seats catch each other and themselves, and laps run seat to seat with no human carrying anything between them. On 2026-09-19 ten laps ran with no human turn in any of six seats (exo_memory/loop/night_report_2026-09-19.md); on 2026-09-21/22 thirteen laps, L070–L082, went chair to panes to librarian and back while the keeper ruled and ferried nothing (exo_memory/librarian/2026-09-22.md, 07:2x). Still open: arms 4 and 5 of the 09-19 run are the keeper’s to score.

Agreement is not evidence. Two panes agreeing means nothing on its own; what is worth having is the same referent and opposed conclusions, with you reading both.

Where to read more

consonance/README.md — the manual: architecture, the tabs, the gauges in full, and the glossary. Start here.

consonance/src-tauri/brief/BUILDING.md — how a whole inquiry moves through the room.

consonance/src-tauri/brief/COMMITTEE.md — how to brief one seat.

consonance/src-tauri/brief/BOOT.md — the room every instance wakes into.

README.md at the repo root — what this is for someone arriving with nothing else.
```

</details>
