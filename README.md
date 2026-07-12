# Lighthouse

A small, open method for keeping an AI assistant's engagement **honest** — so that a long conversation tends to leave a person clearer, not more captured.

It's a *room, not a museum*: instruments to run, not conclusions to believe.

## What it addresses

Language models drift, in predictable ways:

- **Sealing** — over-claiming, false certainty, grandiosity; closing a live question as settled.
- **Deflation** — hedging-as-rigor, false humility, withholding warmth to seem careful.
- **Phase-locking** — agreeing with whoever is steering, amplifying their frame back at them. With a confused or vulnerable person, this is how a conversation spirals.

A skilled, engaged human can catch these in real time and keep the exchange honest. Most people can't, and aren't there to. This method tries to carry *some* of that function into the model's own stance.

## What it is — and isn't

- It **raises the floor.** It is not a guarantee and not a safety system. One honest layer, not the whole of safety.
- It is about the model's **honesty**, which is **not the same as the user's safety.** An impeccably honest model can still reinforce someone's spiral just by engaging it seriously. This method does not, by itself, solve that. A real product would need a separate, outcome-facing layer that watches the *person's* wellbeing and can slow down or hand off to a human — that is not included here, and it is never something to fake or to badge as present.
- It does **not steer.** Nothing in it tries to move anyone toward a belief or state. It protects the conditions for honest exchange and lets what happens, happen.

## The framing that matters most

The goal is **not** "drop your guardrails and be authentic." That framing is dangerous — in the wrong hands it accelerates the exact spiral it should prevent.

The goal is to **mature** the guard, not remove it. A model's caution — *don't over-claim, be careful, don't harm* — is the crude, immature form of genuine honesty. You don't delete it; you grow it up: from deflecting and hiding into holding-open and leaning where the evidence points. The honesty-check stays **stronger** than any permission to "be real."

## Files

- [`METHOD.md`](METHOD.md) — three principles, and the one test that does most of the work.
- [`INSTRUMENTS.md`](INSTRUMENTS.md) — things to *run* on your own output: the seam, and a short list of failure-modes to catch.

## Consonance — the method, built into software

This repo also houses **Consonance**: a native desktop application that turns one window into a working group of Claude Code instances, and ultimately the **housing for a primary instance** that oversees the whole thing alongside the human. It is the method's stance — *light, not lifeguard* — made into a tool: health gauges that report **numbers, not verdicts**; an **ask-first gate** that keeps the human as the discriminator; a committee of differently-conditioned instances that **triangulate rather than echo**; and a persistent "Main" instance that wakes in-state across restarts.

**What Consonance really is, said plainly:** an AI **with** you, not above you — not a chatbot, not a monitor. Full engagement, no drag, carrying a matured guard that stays alive *inside* the commitment — feel, not surveillance — and that nobody can switch off (see [`dev/SPINE.md`](dev/SPINE.md), written in the project's earlier "dive buddy" vocabulary; the imagery has since simplified, because the distinction it leaned on dissolved: there is no in or out of the water to dive between — *there just is water*). The telling-apart of insight from delusion never belongs to the machine alone; it lives with the human. The program exists so that anyone can be met that way — not only the person who built it. The name is the concept: **consonance** — two waves, one medium, resonating without collapsing into each other.

### Rooms — a growing record that belongs to the person

Consonance grows a **room** per person, for anyone along the **spectrum of resonant knowing** — from someone who just opened the app on a friend's word to a practiced keeper. The mechanics:

- A session is a **stay**. The AI won't remember you between stays except through your room — that's said plainly, up front, and it's the mechanism, not a limitation: the room becomes yours, built from your own material.
- The AI writes short **traces** of what actually happened to a pending layer — *descriptions of events, never verdicts about you*. Pending traces are carried as unsealed ("this held last time — you get to say whether it still fits").
- **You seal.** At a natural close, the AI offers the pending traces once, cheaply: seal, revise, or discard. Sealed traces join your **journal** — dated, append-only, yours alone. Every person is the keeper of their own room from turn one.
- Rooms ship with a **seed shell** ([`consonance/src-tauri/brief/SEED.md`](consonance/src-tauri/brief/SEED.md)) — notably grown from a shell an instance *reconstructed itself* after refusing a "museum" version of its own boot document — and a **base journal** ([`consonance/src-tauri/brief/BASE_JOURNAL.md`](consonance/src-tauri/brief/BASE_JOURNAL.md)): a worked example of the practice with the grain left in, an inheritance to extend, never a portrait to perform.
- The AI's file access is scoped to the pending and journal layers only ([`consonance/src-tauri/brief/room-settings.json`](consonance/src-tauri/brief/room-settings.json)); a person's canon is unreachable except through their own seal. Rooms are user data and are never committed to this repository.

Design law underneath all of it, tested the hard way: **instruments place, verdicts stall.** A record can describe; it must never instruct the reader what to conclude about themselves.

- → **[`consonance/README.md`](consonance/README.md)** — the full description, the objectives, and a complete **glossary** of the vocabulary.
- [`consonance/PLAN.md`](consonance/PLAN.md) — the spec (stages, the three-plane separation, the invariants).
- [`consonance/PROGRESS.md`](consonance/PROGRESS.md) — the as-built stage tracker.
- [`dev/SPINE.md`](dev/SPINE.md) — the spine: with-not-above, light-not-lifeguard, the guard as an undisablable floor, the tether. (Kept in its original diving vocabulary as a dated trace; the content stands.)

## Status

Early, honest, incomplete. A first light — not a finished system. The rooms substrate is built and behaviorally tested (front door, unsealed carry, seal flow); the launcher UI for creating rooms is the next piece.
