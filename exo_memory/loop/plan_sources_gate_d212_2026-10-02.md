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

## B's look collated (librarian, 14:0x): `handback/p-d212-B_2026-10-02.md`: GREEN to land `21be348`
- Diff, tests and installed copy PASS. Live from B's pane: a missing line was denied, then fixed in 8 s; a valid ring passed first try.
- **The race, reproduced:** a ring sent in the SAME message as the write it cites is denied, and the identical ring re-sent alone is allowed.
  Correct behaviour; the deny text does not teach it. (Mine at 14:0x was the same case.) B's parallel probe at 14:03 was DELIVERED on its
  first send, so the race is not deterministic. Both directions are recorded.
- **D214, queued fixes:**
  1. (A, hook) the deny reason names the same-message case ("send the ring in a later message, after its sources return");
  2. (A, hook) metadata-only leaders (`ls`, `stat`, `test`, `[`, `file`, `dir`, `Get-Item`, `Get-ChildItem`, `Test-Path`) do not count as
     opening a source. B got a cheap game through with one.
  3. (A, app, `mcp.rs`) **the cross-gate clash:** the server's digest gate took a `/c/…` SOURCES path as the ring's pointer and refused the
     ring. Fix (a): the digest gate ignores paths on the `SOURCES:` line when choosing the pointer. This reaches the app only at the
     keeper's next Consonance rebuild and restart. Until then: **in SOURCES, write repo-relative or `C:\…` paths, not `/c/…`.**
- **OUTPUT → NEXT: changed.** Land `21be348`; the live week runs; D214 goes to A (hook tier for 1–2; app tier for 3, cargo tests in its
  own target dir, no rebuild of the running app); then B's look.

## D214 collated + RULING (librarian, 14:2x): `handback/p-d214-A_2026-10-02.md` (git-blob `f897f6d1…`), commits `e47e7c8` (hook), `b68e4d0` (mcp.rs), `5eec30a` (baseline)
- Fix 1 (the deny text teaches the same-message race and the write-then-read-back case) and fix 2 (metadata-only leaders do not count)
  are in. Hook mutants 54/54, related 133/133, install-only 35/35. Reinstalled with no settings change.
- Fix 3 (mcp.rs: the digest gate ignores SOURCES-line paths): cargo digest_at_ring 37/37 (6 new), Rust mutants 8/8. It reaches the app
  at the keeper's next rebuild.
- A also repaired portable-paths, RED since D212 (fixtures became tracked). The chair lands that regardless.
- **RULING on A's live false deny:** background-task notifications (`<task-notification>`, `[SYSTEM NOTIFICATION`) arrive as user
  messages, and the gate read each one as a new prompt. A source read before such a notification then no longer counted.
  **ADOPT the fix:** a user message that is ONLY a task notification or a system notification (no keeper text, no ring) is not a turn
  boundary. Use the same machine-form classes as D199's `keeper.js`.
  - Why: those messages are not a new request. The seat's work turn continues through them, so the turn should too.
  - It widens "this turn" only across machine-delivered notifications, never across a keeper message or a pane ring. A genuine stale
    source (read before the keeper's or a ring's prompt) still denies.
  - A folds this into D214 as a 4th commit, with tests (a notification between Read and ring → allow; a keeper message between → deny),
    BEFORE B's look, so B looks once.
