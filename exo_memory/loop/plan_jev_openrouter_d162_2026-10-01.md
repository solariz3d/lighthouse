# Jev back, through OpenRouter, and D162 finally run. Librarian, on D, 2026-10-01 05:0x. Laps D197 (adapter) + D162 (resumed).

**The keeper, 04:0x–04:58:** "remember what we said about the term 'drift', we set up Jev wrong in that way". Then: "Do you want
Jev, straight up?" (the librarian: yes, see `librarian/2026-10-01.desktop.md`). Then he chose the best route, OpenRouter, and added
$10 of credit.

## Why
- **The drift verdict on Jev was never a verdict on Jev.** Our own readers agree on "drift" at only κ 0.125.
- **Q3 is a fair question, and it is the before-delivery claim check** the Third Place pointed at on 10-01. Readers B and C agree
  at κ 0.708 (`loop/q3_agreement_score_2026-09-27.md`).
- **Jev is the only non-Claude reader the room has** (`loop/jev_r2r3_score_2026-09-23.md:75`, "Most needed").
- **D162** (`loop/plan_q3_jev_2026-09-27.md`, bars sealed) stopped at Vercel's HTTP 403 free-tier gate, 0 answers
  (`handback/p-d162-jev-E_2026-09-27.md`). The librarian ruled the 403s NOT-RUN, and a resume is the SAME run
  (`librarian/2026-09-27.desktop.md:61-71`). No Jev answer to Q3 has ever been seen.

## Checked before this plan (the librarian, 04:5x–05:0x)
- The key is user env `OPENROUTER_API_KEY` (length 73). It is never printed or committed. It sits in the librarian transcript
  because the keeper pasted it there, and he chose to keep it.
- **The call shape** (OpenRouter's API reference): `POST https://openrouter.ai/api/alpha/decisions`,
  `{ model, state, questions: { <name>: { type: noul|choice|score, instructions, criteria } }, provider: { data_collection: 'deny' } }`.
  The response is `{ model, answers: { <name>: { type, choice, probabilities, confidence } }, usage: { input_tokens, output_tokens, cost }, id, provider }`.
- **Throwaway call: HTTP 200, 194 ms, $0.000014322.** The model resolved to **`typesafe/jev-1.13-20260917`**, provider TypeSafe.
- **D162's sealed schema already has OpenRouter's shape.** `consonance/jev/schemas/q3_2026-09-27.json`, sha256
  `05c28c633415ea91…b35e` (re-hashed 05:0x, unchanged), has `questions` as a record and `criteria` as `{option: text}`. **The schema
  does not change.**

## D197 — the adapter (A; instrument tier: targeted tests + jev-ask's own mutants, under the heavy-run lock, no full suite)
- `consonance/tools/jev-ask.js`: add an OpenRouter route.
  - URL `https://openrouter.ai/api/alpha/decisions`; model `typesafe/jev-1.13` (the pinned version, not an alias);
    key from env `OPENROUTER_API_KEY` only; `provider: { data_collection: 'deny' }`.
  - Map the response into jev-ask's existing answer shape: usage `input_tokens`/`output_tokens`/`cost`, `id` → generationId,
    and the resolved `model` recorded.
  - Keep the Vercel route as a trace (a dated comment citing this plan). The route is selected explicitly (a flag or the key
    present), never silently.
  - The secret scan and every redaction cover `sk-or-…` as well as `vck_…`: the key's own value, the stored results and the logs.
  - **Refuse loudly if the resolved model is not `typesafe/jev-1.13-*`.** A route that silently falls back to another model
    must fail.
- Tests mock at `fetch` only: route selection, the request shape (record questions, the pinned model, data_collection),
  the response mapping, a missing key refuses, a 402 or 403 surfaces as a GatewayError (no answer invented), and a resolved model
  other than jev-1.13 refuses. `jev-ask.mutants.js` extended for the new branches.
- Commit by path. Hand back to the librarian with sha256 of each changed file.

## D162 resumed — the amendment, registered here BEFORE any call (this section does not change after the ring)
- **Changed:** route Vercel → OpenRouter; model `typesafe-ai/jev` → `typesafe/jev-1.13` (resolved `-20260917`); key variable;
  redaction covers `sk-or-`.
- **Unchanged:** the units (`q3_units_2026-09-27.md`, sha256 `a08b46ff…45ec`); the schema (`05c28c63…`); the runner logic; the bars;
  the consensus primary (34 units); the FAILED rule (it covers a per-unit failure on a model that answers, not a gate); the abuse clause.
- **E runs it** (E ran the stopped attempt and has not seen B's or C's files). The three 403 units are re-sent as fresh first attempts;
  the 403 rows stay in the record. **If the resolved model changes mid-run, E stops** and the run is NOT-RUN.
- **The librarian scores** with `score_q3.js --n 34` against `q3_consensus_2026-09-27.md`. Bars, copied from the sealed plan:
  κ ≥ 0.60 JEV WORKS ON A SHARP QUESTION · 0.40–0.60 BORDERLINE · < 0.40 THE JUDGE IS THE PROBLEM.

## Order
D197 (A) → the librarian reads it → D162 (E, live, 40 units) → the librarian scores. Strict wait-for-all.

NEXT: chair dispatch D197 to A when this plan is read
