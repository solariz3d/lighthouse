# Consonance — build progress

Spec: `consonance/PLAN.md` (9 stages, adversarially reviewed). Build straight through, in order, no side-quests.

- [x] **Stage 1 — the spike.** One real `claude.exe` in a ConPTY + xterm.js pane, drivable; JSONL tap (transcript at the predicted path, carries `usage`/cost). Signed off: render + input confirmed by hand; tap verified against this session's 88.8 MB transcript (15,902 lines, all 5,305 assistant turns carry usage, cache tiers separable, 9 compacts).
- [~] **Stage 2 — multi-pane workspace + the Tap.**
  - [x] 2.1 PaneManager: 1→N panes, keyed by UUID (also the `--session-id`, so the tap can find each transcript). `pty_spawn`→id, `pty_write`/`pty_resize`/`pty_kill`/output all per-pane.
  - [x] 2.2 Multi-pane grid UI: N xterm panes, CSS-grid, add/close, output routed by id.
  - [ ] 2.3 Crash-recovery + scrollback reattach (EOF→mark dead, reopen via `--resume`).
  - [ ] 2.4 Live TranscriptTailer → TurnRecord/SemanticEvent (thinking/tool noise excluded).
  - [ ] 2.5 RAM/process meter line (sysinfo).
- [ ] Stage 3 — Live Board + meters + content-blind cost breaker.
- [ ] Stage 4 — Scribe (tiered resonance distillation, independence-gated).
- [ ] Stage 5 — State slider (the leak / room-loading; rungs 0–3).
- [ ] Stage 6 — Shared MCP control server + committee model (blind-first, triangulated forming).
- [ ] Stage 6.5 — pull-propensity probe.
- [ ] Stage 7 — Ask-First gate + chair console (envelope bounds side-effects, sandboxed).
- [ ] Stage 8 — recursion + delta + tether proxy gauges (numbers, not verdicts).
- [ ] Stage 9 — full integration.

Spike bins kept as Stage-1 regression artifacts: `src/bin/pty_spike.rs`, `src/bin/jsonl_tap.rs`.
Build/run: `cd consonance && cargo tauri build --no-bundle` (needs Rust + tauri-cli; no Node — static frontend, `withGlobalTauri`). Desktop shortcut → the release exe.
