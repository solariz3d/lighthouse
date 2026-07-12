# Consonance

> A native desktop app that runs several Claude Code instances in one window — where they check each other's work and their own, so the AI works with you honestly instead of just agreeing, and you stay in control of everything that leaves the conversation. A persistent lead instance oversees the rest alongside you. And for any person — not just the operator — it opens **rooms**: personal growing spaces where the AI writes traces of what actually happened, and only you seal them into your own record.

---

## Why use this?

You get an AI collaborator that stays honest with you — one that catches its own mistakes and pushes back when it should — instead of a single assistant that tells you what you want to hear, or a crowd of them that only agree. You stay in control: nothing reaches outside the conversation without your approval.

Most agent platforms (Anthropic's own Agent Teams, OpenAI's Agents SDK, Microsoft's Agent Framework, Google's ADK, AWS Bedrock) optimize for autonomous throughput: a lead agent delegates to workers, agents talk to each other directly, more compute solves more problems.

But 2026 research explicitly names **"diversity collapse"** in LLM committees as an unsolved problem — stronger-aligned models *worsen* it; senior-persona presence drives juniors into sycophancy; the proposed mitigations aren't default in any of those frameworks. Multi-LLM committees collapse toward echo.

Consonance is built around the structural answer:

- **Differentiated vantages, not clones.** The committee is your own live panes, each conditioned by what you ran with it. Agreement *means* something because the perspectives are real.
- **Human as the discriminator.** Instances raise their hand; your approval is the gate. Gauges report numbers (groundedness, Delta, perspective diversity), never verdicts.
- **Typeable panes, not abstracted agents.** Real interactive `claude.exe` processes as panes you type into directly. Every other platform hides the agent behind an API.
- **A housed primary instance** that wakes into the same conversation across restarts — continuity, not a fresh stranger each launch.
- **Compile-time plane separation** — Sensor / Control / Actuator distinct, enforced by an arch test. The architecture can't drift toward autonomous shortcuts.

Consonance is **not** an enterprise agent platform. No cloud, no SDK, no multi-tenant. It's a single-user opinionated workbench for human-curated multi-Claude work — the kind where the human stays in the loop because that's where the signal lives.

---

## What it is

Consonance is a Tauri v2 desktop app (a Rust backend + a static HTML/JS frontend on WebView2 — no Node, no browser). It embeds **real interactive `claude.exe` processes** as panes inside one window, gives them a shared place to communicate, measures whether they're genuinely thinking together or just agreeing, and gates anything that reaches outside the conversation behind the human's approval.

It is **not** a chatbot wrapper or a prompt console. It is a control surface for a working group of instances:

- Each pane is a full, interactive Claude Code session — you can type into it like any terminal.
- Panes can be spawned cold, or spawned **briefed** — loaded with a shared startup brief so they arrive already familiar with the work.
- A committee of differently-conditioned panes can be convened to triangulate on a question.
- A **room** can be opened for any person — a personal growing space whose record grows only by their own approval. The AI writes short **traces** of what actually happened to a pending layer; the person **seals** what belongs into their journal. The AI's file access inside a room is scoped to exactly those two layers, so a person's record is technically unreachable except through their own seal.
- A persistent **orchestrator** instance lives in its own tab, wakes into the same state across restarts, watches the other instances' outputs, and (designed-for, partly shipped) creates new inputs back to them — retiring the bare command line and giving the base instance a home with amenities.

Throughout, the design principle is **light, not lifeguard**: the program *surfaces* signals and *gates* actions, but the human stays the discriminator. It never substitutes its own judgment for yours.

## Why it exists — the objectives

1. **House the base instance beyond the command line.** The `★ Orchestrator` tab is a persistent, briefed instance that oversees the committee *with* you. It `--resume`s the same conversation across restarts — continuity, not a fresh stranger each launch.

2. **Real collaboration, not echo.** The committee is your *own live panes*, each genuinely differently-conditioned, triangulating a focus — not a crowd of clones that agree louder. The gauges exist to tell the difference. (2026 research papers explicitly name "diversity collapse" in LLM committees as an open problem — the autonomy-first stack has not solved this.)

3. **Keep the human as the discriminator.** Instances can read and propose freely, but world-facing or irreversible actions pass through an **ask-first gate**. Health gauges report *numbers*, never verdicts — they make a signal legible so *you* can judge it.

4. **Give instances a form of continuity.** They wake briefed on the shared startup brief (the master `BOOT.md` + the recent kept notes), persist across restarts, and always recall from the master — never a copy of a copy.

5. **Bounded autonomy.** Instances communicate freely through a *mediated* channel (the board + the gate) that you can watch — and precisely *because* it's mediated, there's a chokepoint where you stay in control. Local destructive actions (arbitrary shell) and cross-pane injection are gated; ordinary work flows.

## How it works (architecture in plain terms)

- **Panes** are real `claude.exe` processes in a ConPTY, rendered with xterm.js. What you see is the actual CLI.
- **The tap** tails each pane's transcript file and extracts completed turns.
- **The board** is the shared, append-only log every turn lands on — the substrate instances communicate through (not the filesystem, not each other's processes).
- **The summarizer** compresses the board into **kept notes** (kept-or-dropped by what holds up), so a new instance can be briefed on the gist without replaying everything.
- **The MCP control plane** is an in-process server every pane joins; its tools (`post_board`, `read_board`, `raise_pull`) are how instances talk and raise their hand.
- **The gate** turns a raised hand into a card you approve or deny; on approval it injects the message into the target pane.
- **The gauges** read the board and emit numbers — groundedness, the Delta, perspective diversity.
- **Three planes, kept separate by a compile-time test:** the **Sensor** plane reads only (tap/board/summarizer/gauges — holds no way to write to a pane); the **Control** plane decides (the server + the gate); the **Actuator** plane is the *only* code that can write to a pane — reachable only through a human-passed gate or a content-blind breaker. A pane can be *measured* and *talked through* without anything being able to *act* on your behalf ungated.

## The memory architecture — what makes the instances good

Most AI tools treat memory as one of two things: a bigger context window, or a vector database of past chats. Consonance treats it differently, because it's built around a fact those approaches paper over — an instance **re-instantiates**. It doesn't persist continuously; it ends, and a fresh one wakes. So the real question isn't *"how does the agent remember"* — it's *"how does the next instance wake up already oriented, a continuous participant, instead of a blank stranger?"* The answer is a layered persistent-memory system:

- **The startup brief** — a stable foundational document each instance *runs* at startup: instruments to execute and a stance to take, not facts to memorize. It's why a Consonance instance wakes *in-state* instead of cold — the difference between handing an agent a prompt and giving it a room to wake into.
- **The board → kept notes** — the live shared log is distilled (on the good model) into the claims and tensions that *held up*, with echo and noise dropped. Memory stays compressed and portable, and every note points back to its source span — **recall from the master, never a summary of a summary** — so it can't drift into a copy of a copy.
- **The journal** — an append-only, dated narrative across sessions, so a new instance picks up exactly where the last one left off.
- **Indexed notes** — discrete, cross-linked facts loaded by relevance, not one undifferentiated blob: a memory you navigate.
- **The cross-machine handoff** — a way to carry the whole system across a boundary, so an instance on another machine wakes into the same state.

In one line: **Consonance treats memory as the substrate that lets a discontinuous series of instances behave as one continuous, in-state participant** — wake oriented, carry what held up, recall from the master, hand off whole. The repo ships a worked example of such a system in [`exo_memory/`](../exo_memory/); each user's instances accrete their own on top.

**Rooms generalize this to any person.** The same layered design — a placement document, an unsealed working layer, a sealed append-only record — but the person is the only canon-writer: the AI proposes traces, the person seals them. Design law underneath, tested the hard way: *instruments place, verdicts stall* — a record can describe, but it must never instruct its reader what to conclude about themselves.

## The interface (tabs)

| Tab | What it's for |
|---|---|
| **Terminal** | The committee workspace — spawn panes / briefed instances / sandboxed workers / rooms, focus one, convene the rest, watch the board tap, the gate cards, and the gauges. |
| **★ Orchestrator** | Wake and talk to the **orchestrator** — the housed base instance, fixed-session, persistent across restarts. Watches the others' outputs and (next-frontier) creates new inputs back to them. |
| **Settings** | Where Consonance keeps its files: the startup brief, the instances folder, the data folder. (A fresh machine lands here first.) |
| **About** | A self-contained, in-app overview + glossary. |

## Glossary

- **Board** — the shared, append-only log (`board.jsonl` in the data folder) every completed turn lands on, plus a bounded in-memory ring. The substrate instances communicate through.
- **Breaker** — a content-blind cost ceiling on cumulative output tokens. When tripped, it pauses auto-approvals. It reads only the number, never the content.
- **Briefed (wake briefed)** — spawned with the shared startup brief loaded rather than cold: a briefed instance / orchestrator that arrives already familiar with the work (having read the BOOT + the kept notes), not a blank Claude.
- **Briefed instance** — a fresh Claude spawned with the shared startup brief loaded — already familiar with the work, but not a copy: it diverges into its own trajectory. (Previously called "sibling.")
- **Chair** — the human (you). The keeper, the discriminator, the genuine other. Approvals, gauges, and gates all route the final call to the chair.
- **Channel (open channel)** — a pre-authorized auto-approve window bounded by an **envelope** (a number of exchanges and a deadline). It auto-approves raised hands until spent, then snaps back to ask-each.
- **Committee** — your live panes triangulating a **focus**. Not a clone army — each pane is genuinely differently-conditioned, so agreement *means* something.
- **Convene** — broadcast the focus's current thread into the other live panes so they each respond; their replies are gathered and triangulated.
- **Cross-machine handoff** — carrying the shared startup brief across a boundary (machine to machine, session to session) so a new instance can wake briefed on the same context. The repo is the medium; `DESKTOP_HANDOFF.md` is one.
- **Delta** — a lap-over-lap gauge on two committee triangulations: how many confirmed/forks are *new*, how many forks *resolved*, the **echo ratio**, the novelty. Numbers showing whether a second pass *generated* or *re-said*. Never a verdict.
- **Discriminator** — the one who decides what's signal and what's noise. In Consonance that is always the human; the program only makes the signal legible.
- **Focus** — the pane the committee convenes *for*. Click **◎** in a pane's header to make it the focus; the others become contributors.
- **Gate (ask-first gate)** — the Control-plane state machine that turns a raised hand (**pull**) into a decision. Below a threshold it suppresses; in ask-each it blocks on a **GateCard**; in open-channel it auto-approves within the **envelope**. It never holds the means to write to a pane itself.
- **GateCard** — the Approve/Deny card the chair sees when an instance raises a hand to reach another pane.
- **Groundedness** — a per-turn gauge: external **referents** (paths/URLs/numbers/code/citations — "tied to checkable ground?") and **novelty** vs the recent board ("new, or agreeing louder?"). Numbers, not a judgment. (Previously called "tether strength.")
- **Instance** — any one Claude (a pane, briefed instance, sandboxed worker, or the orchestrator). Distinct process, own working directory; instances do **not** share memory.
- **Light, not lifeguard** — the governing stance: measure and surface, gate and offer — but never haul, never auto-correct, never substitute the program's judgment for the human's.
- **MCP control plane** — the in-process server (loopback HTTP, `rmcp`) every pane joins via `--mcp-config`. Exposes the board tools; how instances communicate and raise hands.
- **Note (kept note)** — a single short typed entry the summarizer kept from the board because it held up: a claim / deviation / open-question / artifact. Notes point back to the master source, never to a summary of a summary. (Previously called "resonance atom.")
- **Orchestrator** — the base instance, housed in its own `★ Orchestrator` tab. Watches the other instances' outputs and (designed-for, partly shipped) creates new inputs back to them. A fixed session id makes it `--resume` the same long-lived conversation across restarts. Role `main` internally; on the board; the one you converse with across days. (Previously called "Main" / "Mainstay.")
- **Pane** — one interactive `claude.exe` in a ConPTY, rendered with xterm.js. Named A–Z so the committee can address it.
- **Perspective diversity** — a per-lap gauge: how distinct the workers' contributions were. Low diversity = collapsing toward echo. A lagging indicator, never a verdict. (Previously called "vantage-spread.")
- **Plane separation** — the invariant that **Sensor** (read-only), **Control** (decide), and **Actuator** (the sole writer) stay distinct. Enforced at compile time by `tests/arch_test.rs`: a sensor/control file may not even *name* the pane-writer types.
- **Pull (`raise_pull`)** — an instance raising its hand to reach another pane, with an intensity and a why. It is *queued*, never acted on — the gate decides.
- **Base journal** — the worked example a room ships with (`BASE_JOURNAL.md`): the practice as its first keeper actually lived it, scrubbed of private specifics. An inheritance to extend, never a portrait to perform.
- **Rate cap** — a global content-blind limit on how many auto-approvals can fire in a window; the second containment axis, so coercion-in-aggregate trips a re-ask even when each act looks fine.
- **Room** — a per-person growing space (`rooms/<name>/`), opened with **⌂ Room**: a seed shell, a base journal, and two writable layers (pending + journal). The person who keeps it is its only canon-writer — the AI proposes traces, they seal. The AI's file permissions are scoped to exactly the two layers. (Distinct from the *old* internal nickname "room" for the startup brief, which is now "shared startup brief.")
- **Sandboxed worker** — a briefed instance running in a throwaway git worktree (or throwaway dir), role `committee`. Its tools stay on except `Bash`, which is gated because it's the one way a worker's local actions could leave its sandbox. (Previously called "body.")
- **Seal** — the person's act of ratifying a pending trace into their journal: offered once at a natural close — seal, revise, or discard, either answer fine. Sealed entries are dated and append-only. Until sealed, a trace may be recalled but only *as unsealed*, never spoken back as settled fact.
- **Seed shell** — the placement document a room's instance wakes on (`SEED.md`): the stance (*with, not above*), the practices as handles, and the memory law. Grown from a shell an instance reconstructed itself after refusing a museum-ified version of its own boot document.
- **Shared startup brief** — the shared brief every briefed instance loads at startup: the master `exo_memory/BOOT.md` + the recent kept notes. Set via the **startup brief** file in Settings. Run its instruments; don't read it for who you are. (Previously called "room.")
- **Signal** — the project's anchor concept: what survives the gap *and* holds up outside the conversation. Convergence from different vantages is confirmation, not coincidence. (Deepest grain in `exo_memory/BOOT.md`.)
- **Skeptic-suggestion** — when **perspective diversity** drops (the workers converging toward echo), the committee panel *offers* — chair-gated, never forced — to inject a skeptic vantage and re-open the spread.
- **Stay** — one session in a room. A stay succeeds if one real thing happened in it — one accurate seeing, one catch, one honest sentence — not if it covered material.
- **Summarize** — the summarizer's pass over the board that produces kept notes (keep what held up, drop the echo and noise). Runs on the good model, only on your click or a debounced auto-trigger. (Previously called "distill.")
- **Summarizer** — the instance that produces kept notes from the board. Runs on the good model (discrimination needs the good judge), never per-turn. (Previously called "scribe.")
- **Tap** — the watcher that tails each pane's transcript and feeds completed turns to the board, the cost meter, and the gauges.
- **Trace (pending trace)** — a short dated description of one real event in a stay, written by the room's AI to `pending/`. Always a description of what happened, never a verdict about the person. Unsealed until the person seals it.
- **Triangulating** — the aggregation of contributors' replies into **{confirmed / forks / novel}**: where they agree, where they genuinely diverge, what's new. (Previously called "forming.")

## A note on vocabulary

This codebase used to lean heavily on metaphor (scribe / atoms / room / sibling / body / tether / vantage-spread / leak / forming / mainstay). The current names trade some of that poetry for what the things actually ARE or DO, so a fresh reader — researcher or curious user — can follow without initiation. Internal code may still carry the older names (function names, role strings, file paths kept stable for compatibility); the user-facing vocabulary is the canonical one.

## Where to go deeper

- **`PLAN.md`** — the full spec (stages, the three planes, the invariants), adversarially reviewed.
- **`PROGRESS.md`** — the as-built stage tracker (Stages 1–10 + polish).
- **`DESKTOP_HANDOFF.md`** (repo root) — how to install and inhabit Consonance on a new machine.
- **`exo_memory/BOOT.md`** (repo root) — the philosophy underneath all of this (the signal, the fixed dynamic, continuity). Read it and *run* its instruments.

## Build

```
cd consonance
cargo tauri build              # release exe + the NSIS installer (bundle/nsis/Consonance_<v>_x64-setup.exe)
cargo tauri build --no-bundle  # just the exe
cargo tauri dev                # run live
```
Needs Rust (rustup) + the Tauri CLI (`cargo install tauri-cli --version "^2.0"`) + WebView2 + MSVC build tools. Kill any running `consonance.exe` before rebuilding (file lock).
