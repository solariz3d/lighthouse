# D245 item 3: non-author look at A's e5c55866 (the Third Place hook gates), pane B

**Packet:** the chair's D245 item 3 (items 1–4), stopped at 13:43 for the BIOS restart and resumed at 14:4x.
- **No Third Place content was read.** I worked from the hooks' code and synthetic payloads in A's isolated fake install only.
- Installed hooks not edited. Nothing committed, nothing pushed.
- Every node run was under the heavy-run lock (one exception, under Corrections).
- Scratchpad `tphooks/`:
  - pinned copies of A's `harness.js` (sha256 `8b8079cf316674d7…`) and `gate_mut.js` (`4a5d1fcf346949dc…`);
  - mine: `bharness.js`, `steps.json`, `run.out`, `b_before.json`, `b_after.json`, `gate_mut.txt`.

## Verdict: GREEN, the gates do what A says. One minor finding (owner A), and A's drift note stands

## 1. The installed copies against e5c55866, and each against its backup
checked (`git show e5c55866:<master>` vs the installed file; the installed sha256 re-checked at resume, unchanged: `53c55388`, `bb8d5d05`, `00c3a814`, `1ac01a99`):
- `hooks/userprompt-submit.js` and `hooks/precompact.js` are **byte-identical** to the commit.
- `sessionstart-state.js` is **identical once CR is stripped. It differs by line endings only** (A wrote "byte-identical (cmp)").
- `ask-surface.js` is wired from the lighthouse working tree (`~/.claude/settings.json:34`), not `~/.claude/shell`. The working file **equals** the commit.
- `hooks/session-start.js` differs from the commit **only by A's named pre-existing drift**: the 2026-09-23 "Light, not lifeguard" → "With you, not above you" repair and its comment block never reached the installed copy.

**Against A's backups** (CR stripped): **only the gate and its comments**, in every file.
- session-start: the digests;
- userprompt-submit: `buildBeacon(state, noChain)` and `!noChain`;
- precompact: an early `exit(0)`;
- sessionstart-state: a ledger row, then return;
- ask-surface: a stdin payload read plus `done(null)`, which calls `process.exit(0)`.

The backups equal `e5c55866^`'s masters (EOL-normalised) for 4 of 5. session-start doesn't, which is the same drift.

## 2. Any other cwd: byte-identical before and after (re-run, plus 12 cwds of mine)
checked (`bharness.js`: A's harness, a pinned copy, with my cwds added to its table; before = A's backups, after = the live files):
- **390 runs: 341 identical, 35 changed, all 35 for A's five Third Place spellings** (the same 35 A reports).
- **0 changed for my 9 lookalikes:** `third-placement`, `third_place_old`, `third_place`, `third-place.bak`, `third-place2`, `my third-place`, `x-third-place`, `third-place\..\main`, and the bare relative `third-place`.
- **0 changed for any other cwd.**

Two extra spellings OF the seat are gated, as intended: lower-case forward-slash `c:/consonance/instances/third-place/` and mixed separators.

## 3. The Third Place cwd: what it gets and loses
checked (`b_before.json` vs `b_after.json`, A's seat cwd `C:\Consonance\instances\third-place`):
- **It loses:**
  - the session digests (session-start, startup and compact);
  - the state block (sessionstart-state compact; startup was already silent);
  - the chain line (userprompt-submit);
  - the asks (ask-surface);
  - the checkpoint (precompact, manual and auto, with nothing printed).
- **It keeps:**
  - the ambient block (time, sun, moon);
  - the `[pulse] <date>` line, verbatim.
- **Every other seat is unchanged**, e.g. main's prompt line still carries its chain line.
- **Not exercised by this harness: the interval line.** The harness deletes the prompt state before each run, so there's never a gap to report. A's committed test asserts the interval is kept (and passed; item 4).

## 4. The mutants and the gate test
- `gate_mut.js` (A's, my pinned copy; it takes the lock itself): control 5 of 5, then **12 of 12 caught**. This includes **G9**, the strip of two or more trailing separators, which A's double-backslash cwd catches.
- `node --test dev/shell/hooks/third-place-gate.test.js`: **5 of 5 pass**.
- Both came from my first run. Run 2 repeated them (`run.out`, `gate_mut.txt`).

## FINDING (owner A, minor): the spelling `…\third-place\.` passes every gate
- checked: with cwd `C:\Consonance\instances\third-place\.` (the seat's own directory), the build's state reaches the seat in all 7 gated places: session-start startup and compact, sessionstart-state compact, userprompt-submit, ask-surface, precompact manual and auto. The strip removes trailing separators but not a trailing `\.`.
- Claude Code passes a resolved absolute cwd, so this is unlikely in practice. A `path.resolve` (or `path.normalize` plus the strip) before the test would close it in all five copies.
- **The same applies to `board-digest.js:302`, which the five copies mirror.**

## What this does NOT establish
- A live Third Place session (not observed, by rule).
- What the real chain-status, state-block, ask and checkpoint tools emit: the harness uses stubs, as A's does.
- The laptop's `userprompt_pulse.py`, which isn't gated (A flagged it).

## Corrections to myself
- **My first harness run died on a `SyntaxError`.** My cwd strings arrived with single backslashes, so `'C:\x\…'` was an invalid escape. Worse, every `\t` in `…\third…` would have become a TAB silently. Fixed with `String.raw`, then re-run.
- A's mutants and the gate test ran in that first run anyway: all.js continues after a failed step.
- One `node --check` of that file ran outside the lock (a parse only).
- I removed `run.out` while run 1 was still writing, so run 1's final `EXIT 1` (from the harness failure) landed at the head of run 2's file. I read each run's results by their own markers.
