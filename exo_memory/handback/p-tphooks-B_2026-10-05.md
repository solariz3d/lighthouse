# D245 item 3: non-author look at A's e5c55866 (the Third Place hook gates), pane B. STATE at the STOP (13:43, PC to BIOS for EXPO off), NOT FINISHED

**Status:** item 1 is done, by reading and diffing. **Items 2–4 are NOT run.** My one run queued behind E's bundle and never got the lock; I stopped it at the STOP, so nothing was mid-file. No Third Place content read; hooks not edited; nothing committed.

## Item 1, done (checked, no node run)
Installed against `e5c55866` (`git show e5c55866:<master>` vs the installed file):
- `hooks/userprompt-submit.js` and `hooks/precompact.js`: byte-identical.
- `sessionstart-state.js`: identical once CR is stripped. **Line endings only**, against A's "byte-identical (cmp)".
- `ask-surface.js` is wired from the lighthouse working tree (`~/.claude/settings.json:34`), not `~/.claude/shell`. The working file equals the commit.
- `hooks/session-start.js`: differs ONLY by A's named pre-existing drift. The 2026-09-23 "Light, not lifeguard" → "With you, not above you" repair and its comment block never reached the installed copy.

Each installed file against A's backup (CR stripped): **only the gate and its comments.**
- session-start: the digests;
- userprompt-submit: `buildBeacon(state, noChain)` and `!noChain`;
- precompact: an early `exit(0)`;
- sessionstart-state: a ledger row then return;
- ask-surface: a stdin payload read plus `done(null)`, which calls `process.exit(0)`.

The backups equal `e5c55866^`'s masters (EOL-normalised) for 4 of 5. session-start doesn't, which is the same drift.

**Note:** ask-surface now reads stdin (`readFileSync(0)`), and it read none before. That's fine under Claude Code, which closes stdin; it would block only if stdin stayed open.

## To resume (items 2–4), one heavy-run hold
- Scratchpad `tphooks/`:
  - `harness.js` and `gate_mut.js`: pinned copies of A's, sha256 `8b8079cf316674d7…` and `4a5d1fcf346949dc…`;
  - `bharness.js`: mine. It adds 12 cwds to A's table: 9 lookalikes (`third-placement`, `third_place_old`, `third_place`, `third-place.bak`, `third-place2`, `my third-place`, `x-third-place`, `third-place\..\main`, bare `third-place`) and 3 spellings of the seat (lower-case forward-slash, mixed separators, `third-place\.`). It reports before-vs-after, and what the seat keeps (time, interval) and loses (chain, digests, state, asks, checkpoint);
  - `steps.json`: bharness, then gate_mut (12 mutants, G9 included), then `node --test dev/shell/hooks/third-place-gate.test.js`.
- Command: `node scratchpad/close/all.js tphooks scratchpad/tphooks scratchpad/tphooks/steps.json > scratchpad/tphooks/run.out`.
- **A prediction to check, by reading:** `third-place\.` is the seat's directory, but the regex won't match it after the strip. The bare relative `third-place` doesn't match either (no leading separator). Claude Code passes absolute cwds, so the second is likely moot.

## Other state at the STOP
- D242 `a0a45ba` (b-close-wt), D243a look and D239 look: all handed back (`p-close-B_2026-10-04.md`, `p-openexport-B_2026-10-05.md`, `p-eqonly-B_2026-10-05.md`).
- My review worktrees (read only, clean): `b-openexp-wt` (ff428fa), `b-eqonly-wt` (2a2b187), `b-eqbase-wt` (8ff414b + C's 3 test files copied in, uncommitted).
