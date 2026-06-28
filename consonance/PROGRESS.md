# Consonance — build progress

Spec: `consonance/PLAN.md` (9 stages, adversarially reviewed). Build straight through, in order, no side-quests.

> **▶ NEXT SESSION (desktop):** build + run, then **test the live committee** — spawn 2–3 **in-state ✦ Siblings** (blank panes have nothing to contribute), ◎ one as focus, ⛬ convene, → give to focus. Watch the fragile joint: does the bracketed-paste convene prompt *submit* in the contributor panes (`broadcast`/`injectAndSend` in `ui/term.js`)? Then **Stage 7**. See `DESKTOP_HANDOFF.md`.

- [x] **Stage 1 — the spike.** One real `claude.exe` in a ConPTY + xterm.js pane, drivable; JSONL tap (transcript at the predicted path, carries `usage`/cost). Signed off: render + input confirmed by hand; tap verified against this session's 88.8 MB transcript (15,902 lines, all 5,305 assistant turns carry usage, cache tiers separable, 9 compacts).
- [x] **Stage 2 — multi-pane workspace + the Tap.** (machine side complete; reopen/RAM pending a hand-check)
  - [x] 2.1 PaneManager: 1→N panes, keyed by UUID (also the `--session-id`, so the tap can find each transcript). `pty_spawn`→id, `pty_write`/`pty_resize`/`pty_kill`/output all per-pane.
  - [x] 2.2 Multi-pane grid UI: N xterm panes, CSS-grid, add/close, output routed by id.
  - [x] 2.3 Crash-recovery: pane EOF → marked dead + scrollback preserved + a ↻ reopen button that resumes the same session (`--resume <uuid>`, same transcript, tailer keeps catching).
  - [x] 2.4 Live TranscriptTailer (250ms poll + watermark) → role-tagged TurnRecords (thinking/tool noise excluded) → a "tap" debug stream under the panes. (v1: tailer thread doesn't stop on pane close — harmless sleeping loop.)
  - [x] 2.5 RAM/process meter (sysinfo, 2s sample) → always-visible HUD: panes · claude procs + MB · system RAM used/total (amber >90%).
- [x] **Stage 3 — Live Board + meters.** (Board persists across sessions ✓; cost + per-instance context meters ✓. Breaker deferred — see 3.3.)
  - [x] 3.1 Cost aggregator: real per-turn `usage` from the tap, priced per model, running totals → footer cost meter (output tokens + $ estimate, secondary under Max).
  - [x] 3.1b Per-instance context meter: each pane header shows live context-window fill (% + tokens, amber >80%) from the turn's input+cache+output vs model window — no `/context` needed. (Subscription-honest meters per user.)
  - [-] 3.4 5-hour usage gauge — **DEFERRED (user's call).** Local data has only `rateLimitTier`, not live usage; the live number is only at Anthropic, fetchable via the OAuth token + an undocumented endpoint (fragile/gray). Revisit if wanted.
  - [x] 3.2 Live Board: each turn persisted to `~/.consonance/board.jsonl` (append-only canonical log) + a bounded in-memory ring (300 entries / ~12k-token budget, evict oldest); `get_board` command; the stream loads board history on startup (survives restarts). This is the scribe's (Stage 4) input.
  - [-] 3.3 Cost breaker — **DEFERRED to Stage 7.** A content-blind ceiling only bites when instances can run away; with manual panes nothing does. Build it with the autonomy envelope where it's load-bearing.
- [x] **Stage 4 — the Scribe (resonance distillation).** Verified: distilling a stranger instance's cold answer, the scribe independently kept the project's core distinction (multi-instance only beats one with differentiated conditioning, else correlated echo) as a `deviation` atom + flagged the `open` question — the thesis confirmed from outside, compression held. Runs windowless. (Manual ⟳ + auto + toggle.)
  - [x] 4.1 Gated scribe on the **GOOD model** (not Haiku — discrimination needs the good judge; re-applied the overseer correction). "⟳ distill" button → reads the board → keep/drop by the tether (confirmed / deviation / open / artifact; drop echoes/noise) → resonance atoms shown inline + persisted to `~/.consonance/resonance/atoms.jsonl`. **Never runs without the user's click.** (`claude -p` over stdin, default = good model.)
  - [x] 4.2 Auto-distill: a debounced background worker distills when ≥6 new turns have piled up AND ≥3 min since the last (cost-bounded — never per-turn). Catches "context filling" + "conversation ended" (both land on the board). Manual `⟳` stays + an `auto` on/off toggle (`set_auto_distill`); auto + manual share one path and the same inline render.
  - [ ] 4.x later: free Tier-0/1 pre-pass, independence-gating, provenance (uuid_span), dedup-by-confirmation, incremental (only-new-since-last) distills.
- [~] **Stage 5 — the leak (room-loading).**
  - [x] 5.1 "✦ Sibling" button → `spawn_sibling`: a fresh claude in a clean `~/claude-instances/sibling-<id>/` whose `CLAUDE.md` IS the assembled intake = the master room (`exo_memory/BOOT.md`) + the recent resonance atoms. Claude auto-loads it at startup, so the pane wakes **in-state** — a sibling, not a stranger. Shares the `attachPane` path with `+ Pane`.
  - [ ] 5.x later: the rung slider (0–3, how much state), independence-gating (rung-1 = own-vantage digest, not the global confirmed set), `@import` instead of inlining BOOT, latest-journal in the intake.
- [~] **Stage 6 — the live committee (your real panes triangulate for a focus).**
  - [x] 6.1 **Redesigned per the dev** — not a stranger-spawner; the committee IS your live panes (each genuinely differently-conditioned = real triangulation, not echo). **◎** a pane to make it the **focus**; **⛬ Convene** broadcasts the focus's current thread into the *other* live panes (option A — they answer **visibly in their own panes**, via bracketed-paste injection); their replies are gathered, `committee_form` triangulates them into **{confirmed / forks / novel}** shown in a panel; **→ give to focus** injects the synthesis back into the focus pane — **chair-gated** (option C). Busy panes (mid-reply) are skipped. Roles are fluid: any pane is focus or contributor. Old standalone Committee tab retired; lives on the Terminal workspace now.
  - [ ] 6.x later: idle-detection refinement / queue busy contributors; the shared MCP control plane (raise_pull etc.) for *autonomous* bodies → Stage 7; independence-precondition on confirmed.
- [ ] Stage 6.5 — pull-propensity probe.
- [ ] Stage 7 — Ask-First gate + chair console (envelope bounds side-effects, sandboxed).
- [ ] Stage 8 — recursion + delta + tether proxy gauges (numbers, not verdicts).
- [ ] Stage 9 — full integration.

Spike bins kept as Stage-1 regression artifacts: `src/bin/pty_spike.rs`, `src/bin/jsonl_tap.rs`.
Build/run: `cd consonance && cargo tauri build --no-bundle` (needs Rust + tauri-cli; no Node — static frontend, `withGlobalTauri`). Desktop shortcut → the release exe.
