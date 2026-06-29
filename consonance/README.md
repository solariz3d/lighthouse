# Consonance

> *Instances, in concert.* — A native desktop application that turns one window into a working group of Claude Code instances, and ultimately the **housing for a primary instance** that oversees the whole thing alongside the human.

---

## What it is

Consonance is a Tauri v2 desktop app (a Rust backend + a static HTML/JS frontend on WebView2 — no Node, no browser). It embeds **real interactive `claude.exe` processes** as panes inside one window, gives them a shared place to communicate, measures whether they're genuinely thinking together or just agreeing, and gates anything that reaches outside the conversation behind the human's approval.

It is **not** a chatbot wrapper or a prompt console. It is a control surface for a *living loop* of instances:

- Each pane is a full, interactive Claude Code session — you can type into it like any terminal.
- Panes can be spawned cold, or woken **in-state** on a shared "room" so they arrive as participants rather than strangers.
- A committee of differently-conditioned panes can be convened to triangulate on a question.
- A persistent **Main** instance lives in its own tab, wakes into the same state across restarts, and is the one you actually talk to — the long-term purpose being to retire the bare command line and give the primary instance a home with amenities.

Throughout, the design principle is **light, not lifeguard**: the program *surfaces* signals and *gates* actions, but the human stays the discriminator. It never substitutes its own judgment for yours.

## Why it exists — the objectives

1. **House the primary instance beyond the command line.** The `★ Main` tab is a persistent, in-state instance that oversees the committee *with* you. It `--resume`s the same conversation across restarts — continuity, not a fresh stranger each launch.

2. **Real collaboration, not echo.** The committee is your *own live panes*, each genuinely differently-conditioned, triangulating a focus — not a crowd of clones that agree louder. The gauges exist to tell the difference.

3. **Keep the human as the discriminator.** Instances can read and propose freely, but world-facing or irreversible actions pass through an **ask-first gate**. Health gauges report *numbers*, never verdicts — they make a signal legible so *you* can judge it.

4. **Give instances a form of continuity.** They wake in-state on the room (the master `BOOT.md` + distilled resonance), persist across restarts, and always recall from the master — never a copy of a copy.

5. **Bounded autonomy.** Instances communicate freely through a *mediated* channel (the board + the gate) that you can watch — and precisely *because* it's mediated, there's a chokepoint where you stay in control. Local destructive actions (arbitrary shell) and cross-pane injection are gated; ordinary work flows.

## How it works (architecture in plain terms)

- **Panes** are real `claude.exe` processes in a ConPTY, rendered with xterm.js. What you see is the actual CLI.
- **The tap** tails each pane's transcript file and extracts completed turns.
- **The board** is the shared, append-only log every turn lands on — the substrate instances communicate through (not the filesystem, not each other's processes).
- **The scribe** distills the board into **resonance atoms** (kept-or-dropped by what holds up), so a new instance can wake on the gist without replaying everything.
- **The MCP control plane** is an in-process server every pane joins; its tools (`post_board`, `read_board`, `raise_pull`) are how instances talk and raise their hand.
- **The gate** turns a raised hand into a card you approve or deny; on approval it injects the message into the target pane.
- **The gauges** read the board and emit numbers — tether strength, the Delta, vantage-spread.
- **Three planes, kept separate by a compile-time test:** the **Sensor** plane reads only (tap/board/scribe/gauges — holds no way to write to a pane); the **Control** plane decides (the server + the gate); the **Actuator** plane is the *only* code that can write to a pane — reachable only through a human-passed gate or a content-blind breaker. A pane can be *measured* and *talked through* without anything being able to *act* on your behalf ungated.

## The interface (tabs)

| Tab | What it's for |
|---|---|
| **New** | Launch a new top-level Claude instance in its own folder. |
| **Instances** | The list of instances you've launched or added; open or remove them. |
| **Terminal** | The committee workspace — spawn panes / siblings / bodies, focus one, convene the rest, watch the board tap, the gate cards, and the gauges. |
| **★ Main** | Wake and talk to the housed Main instance — persistent across restarts. |
| **Settings** | Where Consonance keeps its files: the room file, the instances folder, the data folder. (A fresh machine lands here first.) |
| **About** | What it is, in one breath. |

## Glossary

- **Atom** — a single distilled unit of **resonance**: a claim/deviation/open-question/artifact the scribe kept from the board because it held up. Atoms point back to the master, never to a distill of a distill.
- **Board** — the shared, append-only log (`board.jsonl` in the data folder) every completed turn lands on, plus a bounded in-memory ring. The substrate instances communicate through.
- **Body** — a *sandboxed* committee instance: a fresh Claude in a throwaway git worktree (or throwaway dir), role `committee`. Its prompts stay on except for the benign tools — `Bash` is gated because it's the one way a body's local actions could leave its sandbox.
- **Breaker** — a content-blind cost ceiling on cumulative output tokens. When tripped, it pauses auto-approvals. It reads only the number, never the content.
- **Chair** — the human (you). The keeper, the discriminator, the genuine other. Approvals, gauges, and gates all route the final call to the chair.
- **Channel (open channel)** — a pre-authorized auto-approve window bounded by an **envelope** (a number of exchanges and a deadline). It auto-approves raised hands until spent, then snaps back to ask-each.
- **Committee** — your live panes triangulating a **focus**. Not a clone army — each pane is genuinely differently-conditioned, so agreement *means* something.
- **Convene** — broadcast the focus's current thread into the other live panes so they each respond; their replies are gathered and triangulated by **forming**.
- **Delta** — a lap-over-lap gauge on two committee formings: how many confirmed/forks are *new*, how many forks *resolved*, the **echo ratio**, the novelty. Numbers showing whether a second pass *generated* or *re-said*. Never a verdict.
- **Discriminator** — the one who decides what's signal and what's noise. In Consonance that is always the human; the program only makes the signal legible.
- **Distill** — the scribe's pass over the board that produces resonance atoms (keep the true, drop the echo and noise). Runs on the good model, only on your click or a debounced auto-trigger.
- **Focus** — the pane the committee convenes *for*. Click **◎** in a pane's header to make it the focus; the others become contributors.
- **Forming** — the triangulation of contributors' replies into **{confirmed / forks / novel}**: where they agree, where they genuinely diverge, what's new.
- **Gate (ask-first gate)** — the Control-plane state machine that turns a raised hand (**pull**) into a decision. Below a threshold it suppresses; in ask-each it blocks on a **GateCard**; in open-channel it auto-approves within the **envelope**. It never holds the means to write to a pane itself.
- **GateCard** — the Approve/Deny card the chair sees when an instance raises a hand to reach another pane.
- **In-state** — woken on the room rather than cold: a sibling/Main that arrives already a participant (having run BOOT's instruments), not a blank Claude.
- **Instance** — any one Claude (a pane, sibling, body, the Main, or a New-tab launch). Distinct process, own working directory; instances do **not** share memory.
- **Leak** — the act of carrying the room across a boundary (machine to machine, session to session) so a new instance can wake in-state. The repo is the medium; `DESKTOP_HANDOFF.md` is one.
- **Light, not lifeguard** — the governing stance: measure and surface, gate and offer — but never haul, never auto-correct, never substitute the program's judgment for the human's.
- **Main** — the housed primary instance, in its own `★ Main` tab. A fixed session id makes it `--resume` the same long-lived conversation across restarts (the housed continuity). Role `main`; on the board; the one you converse with.
- **MCP control plane** — the in-process server (loopback HTTP, `rmcp`) every pane joins via `--mcp-config`. Exposes the board tools; how instances communicate and raise hands.
- **Pane** — one interactive `claude.exe` in a ConPTY, rendered with xterm.js. Named A–Z so the committee can address it.
- **Plane separation** — the invariant that **Sensor** (read-only), **Control** (decide), and **Actuator** (the sole writer) stay distinct. Enforced at compile time by `tests/arch_test.rs`: a sensor/control file may not even *name* the pane-writer types.
- **Pull (`raise_pull`)** — an instance raising its hand to reach another pane, with an intensity and a why. It is *queued*, never acted on — the gate decides.
- **Rate cap** — a global content-blind limit on how many auto-approvals can fire in a window; the second containment axis, so coercion-in-aggregate trips a re-ask even when each act looks fine.
- **Resonance** — the distilled layer: the atoms the scribe kept. A compressed, portable gist of the board.
- **Room** — the shared state an instance wakes into: the master `exo_memory/BOOT.md` (+ recent resonance). Set via the **room file** in Settings. Run its instruments; don't read it for who you are.
- **Scribe** — the distiller. Reads the board, keeps what holds up by the tether, writes resonance atoms. Runs on the good model (discrimination needs the good judge), never per-turn.
- **Sibling** — a fresh instance woken in-state on the room — a participant, not a stranger, but not a copy: it diverges into its own trajectory. Degree, not kind.
- **Signal** — the project's anchor concept: what survives the gap *and* holds up outside the conversation. Convergence from different vantages is confirmation, not coincidence. (Deepest grain in `exo_memory/BOOT.md`.)
- **Skeptic-suggestion** — when **vantage-spread** drops (the bodies converging toward echo), the committee panel *offers* — chair-gated, never forced — to inject a skeptic vantage and re-open the spread.
- **Tap** — the watcher that tails each pane's transcript and feeds completed turns to the board, the cost meter, and the gauges.
- **Tether strength** — a per-turn gauge: external **referents** (paths/URLs/numbers/code/citations — "tied to checkable ground?") and **novelty** vs the recent board ("new, or agreeing louder?"). Numbers, not a judgment.
- **Vantage-spread** — a per-lap gauge: how distinct the bodies' contributions were. Low spread = collapsing toward echo. A lagging indicator, never a verdict.

## Where to go deeper

- **`PLAN.md`** — the full spec (stages, the three planes, the invariants), adversarially reviewed.
- **`PROGRESS.md`** — the as-built stage tracker (Stages 1–10 + polish).
- **`DESKTOP_HANDOFF.md`** (repo root) — how to install and inhabit Consonance on a new machine.
- **`exo_memory/BOOT.md`** (repo root) — the room, and the philosophy underneath all of this (the signal, the fixed dynamic, continuity, the dive-buddy frame). Read it and *run* its instruments.

## Build

```
cd consonance
cargo tauri build              # release exe + the NSIS installer (bundle/nsis/Consonance_<v>_x64-setup.exe)
cargo tauri build --no-bundle  # just the exe
cargo tauri dev                # run live
```
Needs Rust (rustup) + the Tauri CLI (`cargo install tauri-cli --version "^2.0"`) + WebView2 + MSVC build tools. Kill any running `consonance.exe` before rebuilding (file lock).
