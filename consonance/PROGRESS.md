# Consonance — build progress

Spec: `consonance/PLAN.md` (9 stages, adversarially reviewed). Build straight through, in order, no side-quests.

- [x] **Stage 1 — the spike.** One real `claude.exe` in a ConPTY + xterm.js pane, drivable; JSONL tap (transcript at the predicted path, carries `usage`/cost). Signed off: render + input confirmed by hand; tap verified against this session's 88.8 MB transcript (15,902 lines, all 5,305 assistant turns carry usage, cache tiers separable, 9 compacts).
- [x] **Stage 2 — multi-pane workspace + the Tap.** (machine side complete; reopen/RAM pending a hand-check)
  - [x] 2.1 PaneManager: 1→N panes, keyed by UUID (also the `--session-id`, so the tap can find each transcript). `pty_spawn`→id, `pty_write`/`pty_resize`/`pty_kill`/output all per-pane.
  - [x] 2.2 Multi-pane grid UI: N xterm panes, CSS-grid, add/close, output routed by id.
  - [x] 2.3 Crash-recovery: pane EOF → marked dead + scrollback preserved + a ↻ reopen button that resumes the same session (`--resume <uuid>`, same transcript, tailer keeps catching).
  - [x] 2.4 Live TranscriptTailer (250ms poll + watermark) → role-tagged TurnRecords (thinking/tool noise excluded) → a "tap" debug stream under the panes. (v1: tailer thread doesn't stop on pane close — harmless sleeping loop.)
  - [x] 2.5 RAM/process meter (sysinfo, 2s sample) → always-visible HUD: panes · claude procs + MB · system RAM used/total (amber >90%).
- [~] **Stage 3 — Live Board + meters + content-blind cost breaker.**
  - [x] 3.1 Cost aggregator: real per-turn `usage` from the tap, priced per model, running totals → footer cost meter (output tokens + $ estimate, secondary under Max).
  - [x] 3.1b Per-instance context meter: each pane header shows live context-window fill (% + tokens, amber >80%) from the turn's input+cache+output vs model window — no `/context` needed. (Subscription-honest meters per user.)
  - [ ] 3.4 Account-wide rolling **5-hour usage** gauge (the Max window). Cap is opaque (not in transcript/.claude), so it shows real consumption in the window, not %-of-cap. NEXT.
  - [ ] 3.2 Live Board: persist turns to `board.jsonl`, capped by count + tokens, the canonical cross-pane shared log.
  - [ ] 3.3 Cost breaker + budget: chair-set ceiling, soft-warn + content-blind hard pause.
- [ ] Stage 4 — Scribe (tiered resonance distillation, independence-gated).
- [ ] Stage 5 — State slider (the leak / room-loading; rungs 0–3).
- [ ] Stage 6 — Shared MCP control server + committee model (blind-first, triangulated forming).
- [ ] Stage 6.5 — pull-propensity probe.
- [ ] Stage 7 — Ask-First gate + chair console (envelope bounds side-effects, sandboxed).
- [ ] Stage 8 — recursion + delta + tether proxy gauges (numbers, not verdicts).
- [ ] Stage 9 — full integration.

Spike bins kept as Stage-1 regression artifacts: `src/bin/pty_spike.rs`, `src/bin/jsonl_tap.rs`.
Build/run: `cd consonance && cargo tauri build --no-bundle` (needs Rust + tauri-cli; no Node — static frontend, `withGlobalTauri`). Desktop shortcut → the release exe.
