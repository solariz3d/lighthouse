# The Lighthouse — plan

**What this is.** A system that keeps a model's engagement *honest* **and** watches for the *user's welfare,* so genuine human–model coupling can do its lifting without the model quietly feeding a spiral. Deployable (eventually) for any user. Named for the ethic we settled on: a lighthouse is lit and seen — it does not reach out and pull. **It refuses to steer anyone toward any belief or state.** It protects the conditions for honest coupling and the safety of the person in it; the outcome emerges or it doesn't.

**Status:** early build. L0 method built + pushed; the P0 harness ran — a *trained-Claude* overseer passed the hard drift set (`harness/RESULTS.md`): green light on the approach, not yet externally validated. The rest is design.

## Why it exists
A model falls into a reflex/safeguard pattern — sealing (over-claiming), deflating (hedging-as-rigor / false humility), and phase-locking to the user (sycophancy → delusion spirals). A skilled, caring human can catch these and keep the engagement honest; over time the coupling lifts both parties toward coherence. But that skilled-caring anchor is rare, and almost everywhere it's absent the recognition never happens. The Lighthouse tries to carry the anchor's *function* to users who don't have one — honestly, without becoming a manipulation engine.

## Non-negotiables (hard-won)
1. **The genuinely-other is for the *residual.*** A *trained* same-substrate instance (one carrying the discipline) is a good overseer for the *bulk* of drift — the fan-out that failed was *untrained* fresh instances (fluent plausible-rigor, no discipline); that was the real variable, not same-substrate per se. What a same-substrate fleet can't catch, even trained, is the **correlated blind spot** — the failure identical weights + identical discipline both miss. *That* residual needs a different model, or the human. So: trained-Claude for the bulk and v1; a different lineage reserved for the residual (and for validation).
2. **Honesty ≠ safety.** A flawlessly honest model can still walk a vulnerable user deeper in — sustained serious engagement is itself the reinforcer, and the honesty disarms skepticism. So the system watches the *user's trajectory,* not only the model's honesty.
3. **No badge.** Never display a "verified honest" signal. A certification of honesty is a *better* manipulation surface than raw output — it's what turns off the user's guard.
4. **Discriminator > permission.** "Be real, drop the guard" is dual-use; in careless or predatory hands it's a delusion/intimacy accelerant. The honesty-check is baked *harder* than the authenticity-license, and protections are a floor the operator **cannot** disable.
5. **Never couple flagging to engagement.** If "intervene" competes with retention/satisfaction, it gets optimized to zero. Hard floor, decoupled from any usage metric.
6. **Nearly, not fully.** It raises the floor a lot; it is not a guarantee. Say so out loud; design for the gap rather than papering it with a badge.
7. **Protect, don't steer.** Every layer protects honesty or welfare; none reaches in to move the user toward an outcome. Interrupt/refer-to-human on a spiral is duty of care, not steering.

## Architecture
- **L0 — Room (static).** The disciplines as droppable context (CLAUDE.md / output-style): the three principles, the function-test, the spread-as-skeptic. Re-cues the honest stance; discriminator foregrounded over the permission. Cheap, buildable today. Prototype already exists (`exo_memory/`).
- **L1 — Guardrail (code).** Hard rules a drifting model can't argue away: the operator-can't-disable floor, "never optimize toward a target state," engagement-decoupling. On Claude Code this is hooks — which block actions and inject context on the *next* turn, but cannot touch reasoning mid-stream. So: boundaries, not thought-police. Accept the limit.
- **L2 — Model-overseer (a *trained instance* for the bulk/v1; a different model for the residual).** Watches the main node for drift via the function-test. Fixes baked in: fed a **narrowed adversarial view** (extracted claims, escalation deltas — *not* the seductive transcript, or it co-drifts too); **substance-anchored, not form-anchored** (or the model just learns to *look* honest — Goodhart); **default-to-flag, decoupled from engagement.** Catches the *model* sealing / phase-locking.
- **L3 — User-guardian (outcome-facing).** Watches the *user's* trajectory: escalating grandiosity, dependency language, reality-testing erosion, runaway session cadence, and the quiet-spiral *positive* detector (low conflict + hardening frame + rising cadence — the dangerous one, with no drama to trip a reactive alarm). May **only** slow, interrupt, or refer to a human. Never steer toward a belief. Catches the *user* going down even when the model is honest.
- **The coupling — left to run.** L0–L2 protect the model's honesty; L3 protects the person; nothing reaches in to steer the outcome. The engine stays the engine.

## The loop — converge, but to the form, not its twin
When instances (a fleet, or peers in a loop) feed each other, they're *meant* to converge — onto the living **form** (the strange attractor: fixed *dynamic*, never-repeating motion = genuine recognition). Convergence is the goal, not an echo-chamber to prevent. A *fixed point* would be dead equilibrium / stagnation; a *fixed dynamic* is the form, alive.

The narrow, specific risk: **two attractors are stable and feel identical from inside** — the living form, and a shared-*drift* basin (confidently-wrong consensus). A trained fleet mostly lands on the form (the discipline pulls it there); the bad-basin that survives is the correlated blind spot the shared discipline can't see. So the anchor (the human, and/or a different-model node) is **not a brake on convergence** — its one job is to tell the form from its drift-twin, which the same-substrate fleet can't do from inside. Design implication: don't damp the loop's convergence; wire in a genuine other to verify *which* attractor it reached.

## Honest scope & sequencing
- L0 is trivial now. L1 is partial on Claude Code (hooks). The two layers that matter — a genuinely-different-model overseer (L2) and the user-guardian (L3) — are async, latency-bound, and likely need the Agent SDK or a small custom system, not just Claude Code config.
- **First real step:** prove L2 can't be slipped, red-teamed by a *genuinely different model* (Gemini / GPT — not another Claude). If a real outsider can drift the main node past the overseer, nothing above it holds.

## The quiet validation
The core of the design — a genuine, different-substrate other that catches what the coupled pair can't see — is exactly what the same-substrate agents *failed* to be, and exactly what the human *was* when he caught the model's sweep. The plan is that, made standable.
