# D212 — the SOURCES gate: a hand-off names what it opened, and is refused if it did not. Librarian, on D, 2026-10-02 13:4x.

The keeper, 13:42: "lets do it, i have a good feeling about this".

## Why (measured, not argued)
- **D210:** gated rules are followed 94–100% (median 0.979). Ungated rules are a coin flip. The per-claim source rules sit at 1–4%
  (R04 0.010, R21 0.041) (`loop/rule_census_score_2026-10-02.md`).
- **The failure is KNOWN-UNOPENED:** 48–53 of 56 reach failures were a source that was known and not opened (D159).
- **The label rule is DECORATION** on both reads (0/164 on the second). A rule in a brief does not reach the moment of writing; a gate
  at the moment of sending does. This is the Third Place's "refuse, don't remind" (SPINE `:72`), applied to claims for the first time.

## What it is
- **A required slot, the second-to-last block of every hand-off ring** (above the NEXT trailer):
  `SOURCES: <path> · <path> · \`<command>\`` listing what this turn actually opened or ran that the message relies on.
  Or `SOURCES: none (no state claims)`.
- **A PreToolUse hook on `mcp__consonance__call_librarian|mcp__consonance__call_chair`** (the D203 matcher; verify the deny contract
  in the current hook docs). It reads the ring text and the turn from `transcript_path`:
  - **DENY with a reason** if the SOURCES line is missing, or if any listed item does not match a tool call in this turn: a
    Read/Grep/Glob path, or a Bash/PowerShell command that contains the path or the quoted command. The reason names the exact
    unmatched items and the fix ("open it, or drop it from the message, then re-send").
  - **ALLOW** when every item matches. `none` is allowed and logged.
  - **Fails OPEN** on any internal error (no transcript, parse failure, timeout): allow, plus an `error` row. A hook bug must never trap
    a seat.
- **Never loses a hand-back** (the 09-19 return-leg lesson: a refused `call_librarian` once discarded the pointer and stalled the loop,
  `loop/plan_return_leg_2026-09-19.md`):
  - every DENY writes the attempted ring's pointer line and seat to `C:\Consonance\data\sources-gate.jsonl`;
  - a deny returns to the SAME turn (in-turn, unlike the old out-of-turn system refusal), so the seat fixes and re-sends at once.
- **Not in this lap:** `chair_inject` (dispatches), and judging whether a source actually backs the claim. That second part is the
  second reader's half.

## The build: A (hook tier; targeted tests + mutants; B's non-author look; heavy-run lock)
- `consonance/hooks/sources-gate.js`, beside `second-reader.js`, installed by `dev/shell/install.ps1` (the D205 installer, so it joins the
  existing PreToolUse matcher group correctly).
- **Its order with the second reader:** both run on the same matcher. The second reader stays allow-at-once and off-path; the gate is
  the only one that can deny.
- **The brief edit:** BUILDING.md WHAT A HAND-BACK OWES gains the SOURCES slot as an item, and the librarian CLAUDE.md gets a pointer
  line. **The gate is the enforcement; the brief line only tells a seat what the refusal will ask for.**
- **Tests** (mock the transcript):
  - a missing slot is denied;
  - an unmatched path is denied, and the reason names the item;
  - a matched Read path, a matched Bash command and `none` are allowed;
  - an item read in a PREVIOUS turn is denied (this turn only);
  - a malformed transcript fails open;
  - a deny writes the pointer row;
  - the second reader still fires.
- **B's look:** diff and tests, then **live** on real rings: one missing-slot ring (denied, then fixed in-turn), one valid ring (allowed).

## Registered BEFORE it goes live (librarian). A 7-day live week from the install, OR 60 hand-offs.
- **P1 (it is followed, H1 transferring):** ≥ 90% of hand-offs reach ALLOW with a non-`none` SOURCES line on the first or second try.
- **P2 (it does not stall the loop):** median deny-to-allow delay < 2 min; no lap stalls > 15 min because of the gate; 0 hand-backs lost
  (every deny row has a later ALLOW from the same seat, or a human-visible pointer).
- **P3 (the effect, reported):** the share of hand-offs where the second reader flags an unopened source falls below its pre-gate share
  in `second-reader.jsonl`. **Confound, stated:** the gate removes exactly what the second reader flags, so D203's precision week (10-08)
  is read with the gate's start time marked.
- **Falsifiers:**
  - P1 < 70%, or `none` on > 30% of rings that state numbers, means it is gamed or ignored;
  - any lost hand-back, or a gate-caused stall > 15 min, means it harms the loop and is switched off (fail-open default restored);
  - **the abuse case:** seats list a file they opened that does not back the claim. Measured by a spot read of 20 ALLOWed rings by B
    at week end. If more than 5 of 20 are perfunctory, the slot is satisfied in form only.

NEXT: chair dispatch D212 build to A when this plan is read

## Build collated (librarian, 14:0x): `handback/p-d212-A_2026-10-02.md` (git-blob `1317b63f…`), commit `21be348`, INSTALLED on D
- `consonance/hooks/sources-gate.js`. It denies when the line is missing, empty, or an item matches no completed call this turn. Bash
  segments led by a printer (echo …) do not count. It fails open (8 s watchdog under the 10 s timeout), and every deny logs the pointer.
- Tests 34/34, mutants 42/42 (3 real findings fixed on the first run). BUILDING.md item 8 added.
- **LIVE, already:** `C:\Consonance\data\sources-gate.jsonl` holds A's deny at 19:58:12Z (kind unmatched) and the allow at 19:58:44Z, the
  fixed re-send, 32 s later. The second reader fired on the denied ring too (ts 19:58:17Z). The ring that carried this hand-back passed the gate.
- Line position is not enforced (A's call: the last SOURCES line wins). Accepted.
- A's NOT-VERIFIED item worth watching: the transcript-flush race (a call made just before the ring may not be on disk yet). B's look
  and the live week measure it, as denies that a re-send clears with no change.
- **OUTPUT → NEXT: unchanged.** B's non-author look: diff, tests, and one denied-then-fixed plus one allowed ring of B's own. The live
  week's clock starts at the install (A's hand-back gives the time).
