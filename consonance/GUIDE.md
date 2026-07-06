# Consonance — a simple guide

A native desktop app that runs several Claude Code instances in one window, where they check each other's work and their own — so the AI works with you honestly, and you stay in control. This is the short how-to; for the full reference and a glossary, see [`README.md`](README.md).

---

## 1. Install

You'll need:

- **Rust** (via [rustup](https://rustup.rs)) and the **Tauri CLI**
- **WebView2** (already on Windows 11) and **MSVC build tools** — Visual Studio 2022 Build Tools with the "Desktop development with C++" workload
- The **Claude Code CLI** (`claude`) on your PATH — Consonance runs *real* `claude` sessions, not an imitation

```bat
cargo install tauri-cli --version "^2.0"
cd consonance
cargo tauri build          :: installer + exe   (or: cargo tauri build --no-bundle for just the exe)
```

To run it live while developing, skip the build and use `cargo tauri dev`.
(Kill any running `consonance.exe` before rebuilding — it holds a file lock.)

---

## 2. First launch — Settings

The first time it opens, you land on the **Settings** tab. Point it at three things:

- **Startup brief** — the file a new instance reads when it wakes, so it arrives already familiar with your work instead of blank. Start with the example the repo ships (`exo_memory/BOOT.md`) or your own.
- **Instances folder** — where each instance's working directory lives.
- **Data folder** — where Consonance keeps its shared log and notes.

That's the whole setup. Now open the **Terminal** tab.

---

## 3. The basics — spawn a pane and work

The **Terminal** tab is your workspace. Each **pane** is a real, full Claude Code session (named A, B, C…). You type into it like any terminal.

- **Spawn a pane** — a fresh `claude` session. Use it exactly as you would a normal Claude Code terminal.
- **Spawn briefed** — same, but it wakes already loaded with your startup brief, so it starts familiar with the work.

One pane on its own is already useful. The rest of Consonance is what you do when you want more than one instance on a problem.

---

## 4. A second opinion — the committee

When you want other instances to weigh in on a question:

1. **Pick a focus** — click **◎** in a pane's header. That pane becomes the focus; the others become contributors.
2. **Convene** — this sends the focus's current thread to the other panes so each responds on its own.
3. Their replies come back sorted into **where they agree**, **where they genuinely disagree**, and **what's new**. Because the panes are differently conditioned — not clones — their agreement actually means something.

You read the result and decide. Consonance surfaces the signal; you're the judge.

---

## 5. Staying in control — the gate

Instances can read and talk to each other freely, but anything that reaches **outside the conversation** — or writes into another pane — has to pass **you** first. When an instance raises its hand, you get an **Approve / Deny** card. Nothing acts on your behalf without it. (There's also a cost breaker that pauses activity if spending crosses a ceiling you set.)

---

## 6. The gauges — numbers, not verdicts

While the panes work, small gauges report:

- **Groundedness** — is a turn tied to checkable things (files, numbers, citations), or just agreeing louder?
- **Perspective diversity** — are the panes still genuinely different, or collapsing toward echo?
- **Delta** — did a second pass *generate* something new, or re-say the first one?

They're **numbers you read**, never a verdict the program acts on. You stay the one who decides what it means.

---

## 7. The Orchestrator

The **★ Orchestrator** tab is a persistent instance that oversees the whole thing *with* you. It wakes into the same conversation across restarts (not a fresh stranger each launch), watches the other instances, and is where you talk to Consonance across days. Think of it as the one you keep working with, while individual panes come and go.

---

## A whole session, in one line

Open Consonance → spawn a briefed pane or two → work a problem in one → when you want a check, make it the **focus** and **convene** the rest → read where they agreed, forked, and found something new → approve or deny anything that reaches outside → watch the gauges so you catch echo before it fools you.

You're always the one deciding. The app just makes the signal legible.

---

## Go deeper

- [`README.md`](README.md) — full description and a complete glossary of terms.
- `PLAN.md` — the spec and architecture (the three planes, the invariants).
- `PROGRESS.md` — what's actually built.
- `DESKTOP_HANDOFF.md` (repo root) — installing and carrying Consonance onto a new machine.
