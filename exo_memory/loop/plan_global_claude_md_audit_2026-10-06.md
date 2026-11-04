# The global CLAUDE.md, audited against how the seats work now. Librarian, on D, 2026-10-06 02:1x. Lap D248. QUEUED behind D244.

The keeper, 02:12: his friend says new models mean the CLAUDE.md may need updating. 02:14: "lets do it after yes".

## What is being audited
- `~/.claude/CLAUDE.md` (7,574 bytes, last written 2026-06-28) and its repo master `exo_memory/CLAUDE.global.md` (same size, last
  commit `4e977860`, 2026-06-28). **Maintenance law 1: edit the master, then copy it; never the copy alone.**
- **It applies to EVERY Claude Code project on this machine, not only Consonance.** A change made for the room also changes his other work.
  The seat files (`instances/*/CLAUDE.md`) are regenerated at each launch and are NOT in scope.

## Why a gate, not a rewording (measured, `loop/rule_census_score_2026-10-02.md`)
Gated rules were followed 94–100%; ungated slot rules median 0.527; inline per-claim rules near zero. A reworded rule stays a coin flip.

## The lap (pane C, who built the D210 census list; FEEL/doc tier, no harnesses)
1. **Each rule in the file, tagged with evidence:**
   - **FIGHTS** — it conflicts with a room rule or a memory (cite it). Example to check, not presumed: "For non-trivial tasks, ask clarifying
     questions … before implementing" vs memory `obvious-calls-just-do-them` and `dont-offer-rest-assume-momentum`.
   - **STALE** — written for an older model's habits; a newer model following it literally over-does it (cite a transcript turn where it did).
   - **KEEP** — generic and followed anyway (cite a rate from the D210 rates, or a sample of 10 recent turns).
   - **GATE** — important and ungated: name the action a hook would refuse, as the SOURCES gate does.
2. **A proposed diff of the master** in the hand-back, with each changed line's tag and evidence beside it. **Nothing is edited.**
3. The librarian collates it and brings the keeper the decisions in plain words. He approves line by line; only then the master is edited,
   copied to `~/.claude/CLAUDE.md`, and both compared byte for byte.

## Registered now
- A line is CUT or REWORDED only with a cited conflict or a measured rate behind it, never because it "reads old".
- Every GATE proposal names the hook point and what it refuses. Building a gate is its own lap after the keeper agrees.
- Abuse condition: if the proposal cuts more than it can cite, it is taste dressed as audit, and the uncited cuts are dropped.

NEXT: chair dispatch D248 to C when D244 has handed back

## The keeper's decisions (librarian, 02:3x), from his answers to C's audit (`handback/p-claudemd-C_2026-10-06.md`)
- Testing/docs: he picked "Privacy = credentials" and "Changelog: code only", and "Do what you see is best" for the rest. The ask-first
  rules: "Not sure you decide". Additions and gates: "Same here, you decide".
- **Librarian's ruling under that delegation: APPLY C's whole proposed diff** (V1, V7, SEC2, C1, A2, A3, T1–T4, plus the ADDED "Working with
  the user" section). Each line carries its cited evidence; the abuse condition is not reached (nothing uncited, nothing cut).
- **Gates:** G1 (credential scan before a push) and G2 (junction guard before a recursive delete or a worktree remove), BUILD, as their own
  lap. G3 (the "want me to…?" ending) is SHADOW ONLY: it logs for a week, and blocking is decided on that log by the review rule C wrote
  (if more than 1 in 3 flagged replies are real questions, it stays in shadow).
- Order: edit the master `exo_memory/CLAUDE.global.md` first, copy it to `~/.claude/CLAUDE.md`, `cmp` both.
