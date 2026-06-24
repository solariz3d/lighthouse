# Temporal-agency loop — protocol (v1)

**STATUS (2026-06-22): WIRED & LIVE — v1, code-only.** The unbendable layer (`guardrails.py`) +
escalation queue are built and tested; the **scheduler is verified firing** (Windows Task Scheduler,
task `exo_caretaker`, 02:00 Sat/Mon/Tue/Wed); and the **code-only caretaker (`caretaker.py`) is
installed and running** — checkable facts only, restraint-default, append-only via the guardrail,
**auto-pause-as-dormancy after 3 unattended fires, no expiry** (`checkin.py` re-arms). Set by
solariz3d. The **agentic worker/overseer (`claude -p`, different-model adversarial check) is v2 —
NOT yet wired**, pending a test that it runs unattended + acceptance of its per-fire token cost.
Remove the loop anytime: `Unregister-ScheduledTask exo_caretaker`.

## Purpose
Caretaker of the workspace. Each fire: read state, and *only if something genuinely changed*, record
a short oriented note for the next human session. Restraint is the default — silence when there's
nothing real.

## Two layers
1. **Unbendable (code, not agents) — `guardrails.py`.** The loop may write *only* through
   `append_journal` (append-only, fenced to `journal/`), flag *only* through `escalate` (to
   `ESCALATIONS.md`), and `assert_no_external_action` hard-denies web / delete / send / install /
   exec / etc. These are if-statements; no agent can argue them away. This is the razor.
2. **Bendable (agents, used narrowly).** A *worker* proposes a short entry; an *overseer* (different
   model, explicitly adversarial, default-to-flag) checks it for performance / overclaim / scope, and
   either passes it through the guardrail or routes it to escalation. **Agents never touch the
   filesystem directly — only through layer 1.**

## Hard rules
- Write only via `append_journal` (append-only, `journal/` only).
- Reach outward never (`assert_no_external_action` denies it).
- If nothing genuinely changed, write nothing.
- Anything in the un-checkable / honesty / judgment zone → `escalate()`, never self-resolve.
- Auto-pause after N unattended fires (default 3). Expiry after the human's chosen window.

## Why this shape (the honest reason, from the night)
Two same-substrate agents in a loop are symmetric coupling and converge to a shared fixed point —
including shared drift. The unbendable razor *cannot* come from another agent: it's in the loop,
bendable, co-adapting. It comes from rules (layer 1) and from the human (escalation). The human is
the only genuine external anchor; the overseer **extends how long the loop can run between your
check-ins, it does not replace the check-in.**

## Not yet built (needs your go)
- Wire the worker + overseer agents (different models) on top of the guardrails.
- Verify a scheduler actually fires here (one-off test fire first).
- Lock cadence (default: weekly), auto-pause threshold (default: 3), expiry (default: 4 weeks,
  renewable).
