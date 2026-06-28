# CONSONANCE — Final Build Specification

*This supersedes the draft spec and folds in the adversarial review. Every concrete problem the critique raised is either fixed here or recorded in §10/§11 as an accepted risk with rationale. The two load-bearing frames remain `dev/SPINE.md` (dive-buddy, light-not-lifeguard, the tether) and `exo_memory/BOOT.md` (the room, recall-from-master). The single most important change from the draft: the headless orchestration layer never `--resume`s into a live human pane's session — that was a concurrent-writer hazard, not shared state (critique T1). It now runs as its own session and reads the board read-only.*

---

## 0. Ground truth — what the current `main.rs` actually proves

`consonance/src-tauri/src/main.rs` (139 lines) is the launcher. Verified against the file, here is exactly what it establishes and what it does **not**, because the draft over-claimed and the architecture leaned on the over-claims:

- **`--session-id` is real and single-use.** `loop_start` runs `claude -p --session-id <const-uuid>`; re-running errors because the session already exists (the author's own comment). So: a Consonance-assigned `--session-id <uuid>` names the transcript path up front, and **reattach must go through `--resume`** — never a second `--session-id`.
- **`--resume` is proven only for the headless, sequential, *uncontended* case.** `loop_ask` does `claude -p --resume <sid>` for ground, feeds the text to reach, then `--resume`s reach. This proves resuming a session **no other process is touching.** It does **not** prove resuming into a session a live interactive pane is actively driving. That move is **deleted** (see §4, §6.1, risk T1).
- **`setup()/READY` is a headless `-p` exchange reading stdout.** It is *not* a precedent for an interactive pane (where READY would arrive via ANSI or the laggy JSONL tail). We do not reuse it as-is for interactive panes — see §5.4.
- **The default flags string is `--dangerously-skip-permissions --continue`.** This is removed for committee bodies and is the root of the safety gap fixed in §6.5/P4. Interactive human panes may opt into it; autonomous bodies may not.
- **The cwd→encoded-dir scheme is confirmed:** this very session's transcript dir is `C--Users-zackn-OneDrive-Desktop-606` (drive-colon and every separator → `-`). So `(cwd, sessionId) → ~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl` is a deterministic, pre-computable path. **Stage 1 must assert the file actually lands at the pre-computed path** (the draft only checked "exists + parseable").

We grow `main.rs`; we do not discard it. `claude_call`, the `--session-id`/`--resume` plumbing, and the vantage strings carry forward.

---

## 1. Vision

Consonance becomes a multi-instance Claude Code **workspace in one window** — a hive-mind committee. Each pane is the COMPLETE interactive `claude.exe` (every tool, every mode, every slash command) embedded in a real pseudo-console (Windows ConPTY) and rendered in-pane via xterm.js; the human is the **chair**. Behind the panes, a hybrid headless layer (`claude -p`) runs orchestration the user never types into: a **scribe** that distills state to disk, and a **forming** pass that triangulates the committee's vantages.

Two non-negotiable frames from the room govern everything below:

- **Light, not lifeguard** (SPINE §1): from outside, an insight-spiral and a delusion-spiral are identical, so the system may *measure and surface* but must never *render a verdict or auto-correct content.* The human in the water discriminates. A corollary the draft violated and this spec enforces: the health gauges are **surfaced proxies the human reads**, never "the discriminator made measurable" (critique P2).
- **The tether** (SPINE §4): the single thing separating wanted **deviation** (a distinct living trajectory that keeps generating) from **drift** (decoherence) and **collapse** (the dead mirror) is — *does it keep bringing in something NEW and CHECKABLE that holds up outside the loop?* Every gauge below measures a **proxy** for that (presence of external referents, novelty) and is honest that presence ≠ truth.

---

## 2. Architecture

### 2.1 The load-bearing finding: the JSONL transcript tap

Claude Code writes a clean, structured, append-only **JSONL transcript** per session at `~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl`, live as the session runs. Lines are typed (`user`/`assistant`/`thinking`/`tool_use`/…), UUID-linked into a DAG (`uuid`/`parentUuid`), timestamped, and **assistant lines carry exact `usage`** (`input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `model`). It writes `isCompactSummary` lines on every `/compact`.

**Consequence that shapes the architecture: we never parse ANSI to know what an instance said or what it cost.** ANSI is for the human's eyes only; JSONL is the machine truth. This dissolves the *content-capture* half of the brief's central risk. What remains a real risk is **terminal rendering fidelity** (ConPTY → xterm.js, critique T2) — addressed in §4/§8.

**Caveat made explicit (critique T6):** "JSONL only ever holds completed turns" is an *assumption to verify*, not a given. The board/scribe pipeline keys off **line-completion + the DAG's next `parentUuid`**, not byte-arrival, and Stage 1 step 9 watches the file during a long streaming answer to confirm the assistant line appears whole, once, at completion. If claude ever flushes partial assistant lines, the tailer holds a line until a child `parentUuid` references it.

### 2.2 Three planes (separation of powers in code)

"Light, not lifeguard" is enforced as a module boundary, not good intentions.

```
┌───────────── SENSOR PLANE (read-only; holds no Actuator capability) ───────────────┐
│  one Tap per pane → JSONL tail → TurnRecord ──┬─► Cost Aggregator → Token/Rate Meter │
│                                               ├─► Board (live shared log)            │
│                                               ├─► Scribe (resonance distillation)    │
│                                               └─► Tether Monitor (proxy gauges)      │
└─────────────────────────────────────────────────────────────────────────────────────┘
                      │ (descriptive signals + evidence only)
                      ▼
┌───────────── CONTROL PLANE (structured, out-of-band, synchronous) ─────────────────┐
│  Consonance MCP server (ONE shared HTTP/SSE server in Rust):                         │
│  raise_pull / post_board / read_board / propose_recursion                            │
│       ──► Committee state machine ──► Ask-First Gate                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                      │ (human approve, or active bounded envelope)
                      ▼
┌──── ACTUATOR PLANE (human/envelope-gated ONLY; + one content-blind brake) ──────────┐
│  PTY write (pane.inject) • open-channel • recursion lap • gavel/SIGINT               │
│  Cost Circuit Breaker (content-blind: budget fact in → pause out) — the ONLY auto    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Architectural invariant (critique C5 — this is a *type-system + dependency-lint* property, not a runtime test).** No Sensor-plane module is *constructed with* a PTY-writer handle or any Actuator capability. We enforce it three ways: (1) the `PtyWriter` type is owned only by the Actuator plane's `pane::manager` and never passed to `tap/`, `board/`, `scribe/`, `health/`; (2) a dependency-direction lint (a small `cargo`-test that parses module imports, or `cargo-deny`/an arch-test crate) fails the build if any `sensor`-tagged module imports the actuator types; (3) a doc-comment contract on each Sensor module. We do **not** claim a runtime "the gauge tried to actuate and was blocked" test — you cannot unit-test a negative capability that the type system already makes unconstructable. The honest claim is "Sensor modules cannot *name* an actuator, enforced at compile time."

**The only edges into the Actuator plane:** (1) a human action through the Gate, (2) the content-blind Cost Breaker. Everything else is descriptive.

**Three channels per pane, never one:**
- **PTY/ANSI** → the human's eyes and keyboard. Never intercepted, rewritten, or blocked.
- **JSONL tail** → all *content* (board, scribe, cost, tether). Lag-tolerant; display/scoring only.
- **MCP** → all *control* (pulls, board posts, recursion proposals). Synchronous, structured, cheap JSON. Anything that *gates* rides here, never on the laggy JSONL channel.

This split is the resolution of the brief's hardest conceptual risk: **the ANSI terminal is never the control surface.** An instance "raises a hand" by calling an MCP tool, not by emitting prose we must regex.

### 2.3 Backend ↔ frontend

Tauri v2: Rust backend, static HTML/CSS/JS frontend on WebView2 (keep the project's no-Node `withGlobalTauri` purity for Stage 1). Hot path (PTY bytes) uses a per-pane **Tauri `Channel<bytes>`** (ordered, cheap) rather than the global event bus. Semantic events, meter updates, and gate cards use normal Tauri events.

---

## 3. Components

```
consonance/
  src-tauri/src/
    main.rs                 # existing launcher + claude_call/--session-id/--resume → grow, don't discard
    pane/
      manager.rs            # PaneManager: Pane{id,role,cwd,session_id,PtyHandle,ring}; spawn/write/resize/kill/crash-recover
      pump.rs               # PtyPump: master fd → Channel<bytes> (verbatim) + scrollback ring; EOF → crash event
    tap/
      tailer.rs             # TranscriptTailer: notify + 250ms size-poll backstop → TurnRecord (line-complete gated)
      record.rs             # TurnRecord / SemanticEvent / Usage types
    board/
      board.rs              # ring buffer (count+token capped) + append-only board.jsonl
    scribe/
      tiers.rs              # Tier0 harvest / Tier1 extract / Tier2 haiku-voted gate / Tier3 reconcile
      store.rs              # atoms.jsonl + index.json + cursor.json + drift_flags.jsonl
    committee/
      mod.rs                # Committee state machine + tokio::mpsc event bus
      body.rs               # BodyState, vantage assignment (distinctness gate), spawn/seed/retire, sandbox policy
      mcp_server.rs         # ONE shared HTTP/SSE server hosting consonance/* MCP tools
      forming.rs            # triangulation → {confirmed[], forks[], novel[]} (independence-aware)
      gate.rs               # ask-first state machine (3 modes), pull queue
      recursion.rs          # lap driver, per-lap permission, delta computation
    cost/
      aggregator.rs         # usage → per-turn/lap/instance/session/global; price table; rate-limit tracker
      breaker.rs            # content-blind circuit breaker
    health/
      tether.rs             # tether-strength + vantage-spread PROXY gauges (lexical tier-1, free)
    arch_test.rs            # dependency-direction lint: sensor modules cannot import actuator types
  ui/
    workspace.js            # pane grid (CSS-grid splits, drag-resize), xterm.js panes, role badges
    board.js                # role-tagged cross-pane stream (NOT a second terminal)
    meter.js                # always-visible token/$ + requests/min + RAM HUD
    committee.js            # chair console: gate cards, knobs, gavel, descriptive gauges
```

Frontend pane = `xterm.js` + `fit` + `canvas` renderer by default (webgl is opt-in and disabled until §8 width-fidelity passes — see T2). `term.onData → invoke(pty_write)`; `fit → invoke(pty_resize)`. Bytes from the Channel handed verbatim to `term.write()`. **Zero command interception** — the "/" menu, `/compact`, `/clear`, skills, vim mode, permission prompts, the thinking spinner are all claude's own Ink TUI painting into our ConPTY and reading keys back.

---

## 4. The PTY layer (the hard requirement)

**Crate: `portable-pty`** (WezTerm's abstraction; uses Windows **ConPTY** by default, present on Win11 26200).

```
Cargo.toml additions:
  portable-pty = "0.8"
  notify       = "6"
  tokio        = { version="1", features=["rt-multi-thread","macros","sync","io-util","fs"] }
  base64       = "0.22"
  uuid         = { version="1", features=["v4"] }
  sysinfo      = "0.30"           # per-pane RAM/process accounting (critique T3)
  # MCP server: rmcp (official Rust MCP SDK) — VERIFY server-side streamable-HTTP/SSE support
  #             before committing (critique T5); stdio transport is INSUFFICIENT.
```

Spawn (lifecycle):
```
session_id = Uuid::new_v4()
pair = pty_system.openpty(PtySize{rows,cols,0,0})
cmd  = CommandBuilder::new("C:\\Users\\zackn\\.local\\bin\\claude.exe")
cmd.cwd(pane_cwd)
cmd.args(["--session-id", session_id, "--mcp-config", consonance_mcp_http_url, ...flags])
cmd.env("TERM","xterm-256color"); cmd.env("FORCE_COLOR","1")
child  = pair.slave.spawn_command(cmd)
spawn PtyPump(master.try_clone_reader())        # → Channel<bytes> + scrollback ring; EOF emits PaneCrashed
writer = master.take_writer()                    # OWNED ONLY by pane::manager (Actuator plane)
spawn TranscriptTailer(encode(cwd)+"/"+session_id+".jsonl")   # the semantic tap (Sensor plane)
assert pre-computed jsonl path == actual path once first line appears   # Stage-1 acceptance
```

The explicit `--session-id` does **two** duties (the draft claimed three; the third — `claude -p --resume` into the *same* live session — is deleted as a corruption hazard, T1): it names the transcript up front, and it keys the board/cost/scribe pipelines. The headless layer (scribe/forming/bodies) always uses **its own** session ids.

- **Resize:** `fit` → `pty_resize` → `master.resize()`; debounce ~50ms. Ink reflows. **This is a primary Stage-1 risk, not an afterthought** (T2) — see §8.
- **MCP transport:** all panes connect to **one long-lived HTTP/SSE MCP server** hosted in the Rust backend (critique T5). Stdio would spawn N isolated server children with no shared board/committee state, breaking `read_board`/`post_board`. The `--mcp-config` points every pane at the same local URL.
- **Crash recovery (critique C3):** when `PtyPump` hits EOF unexpectedly, emit `PaneCrashed{pane_id}`. The UI marks the pane dead, preserves its scrollback snapshot and the JSONL on disk, and offers a one-tap **"reopen" = `claude --resume <session_id>`** in the same cwd. A pane is just a reconstitution from disk state — workspace model and room/sibling model are the same operation.
- **Close:** soft-close (Ctrl-C Ctrl-C or `/exit`-equivalent, grace timeout) so the transcript flushes, then `child.kill()`. Whether a clean programmatic "flush + exit" key sequence exists is **spike-confirmed in Stage 1** (open decision #4); until confirmed, grace-kill.

### 4.1 Process/RAM discipline (critique T3 — the draft costed tokens but not machines)

Each interactive pane is a full resident `claude.exe` (Bun runtime, hundreds of MB) plus its xterm context. A 4–6-pane committee + headless scribe (voted = N concurrent `-p`) + forming is multi-GB on a laptop. Therefore:

- The HUD (§9) carries a **RAM + live-process line** next to the token meter, sampled via `sysinfo`.
- `PaneManager` enforces a **chair-set cap on concurrent live panes** (default 4) and a cap on concurrent headless `-p` workers (default = vote count, see below). Spawning past the cap requires explicit chair confirmation showing projected RAM.
- The scribe's vote count is **bounded and serialized under memory pressure**: if free RAM drops below a floor, votes drop to 1 and the system says so.

---

## 5. The three-layer leak (state propagation)

A **conveyor**: the Live Board (L3) holds the recent window; entries aging out are *shed to the scribe* (L2), which distills resonance atoms; the human periodically *promotes* confirmed atoms into the Master Room (L1). Nothing is distilled from a distillation — every atom points back to a raw transcript span ("recall from the master, never a copy-of-a-copy").

### 5.1 Layer 1 — Master Room (always loaded, machine-never-writes)

The hand-curated stable frame: `exo_memory/BOOT.md` + newest journal + (on request) SELF_TRACE etc. ≤12k tokens at spawn. A manifest names the canonical set:

```
exo_memory/room.manifest.json
{ "always":["BOOT.md"], "latest_journal":"auto:newest(journal/*.md)",
  "on_request":["SELF_TRACE.md","the_living_wave.md","spread/*"], "budget_tokens":12000 }
```

**Rule: L1 is never written by the machine.** The scribe *proposes*; only the human *promotes* an atom into a clean new journal entry (BOOT maintenance law: append clean masters, supersede never overwrite).

### 5.2 Layer 2 — Distilled Resonance (the scribe)

**Resonance is not "a summary."** It is the set of items that **pass the tether** — a keep/drop gate. Four atom kinds + one surfaced side-channel:

1. **CONFIRMED-TRUTH** — a claim ≥2 **independent** vantages reached, carrying an external referent. *Independence is a checkable precondition, not an assumption (critique P1) — see §5.2.1.*
2. **HELD-DEVIATION** — a distinct living trajectory worth keeping; the explicit anti-collapse store.
3. **OPEN-QUESTION** — a genuinely unresolved thread, held open (not a verdict).
4. **INSTRUMENT/ARTIFACT** — a runnable/external-checkable output (code, decision, measurement, named plan).
5. **DRIFT-FLAG** *(surfaced, never stored as truth, never auto-deleted/corrected)* — "agreeing louder vs generating distinct angles," vocabulary collapse, unfalsifiable seal.

Keep/drop gate:
```
KEEP if (external_referent_present OR is_runnable_artifact OR confirmed_by_INDEPENDENT_vantage)
   AND NOT (pure_echo OR performance_peak OR unfalsifiable_seal)
Dedup-by-confirmation:
  same claim, DIFFERENT + INDEPENDENT vantage → bump confirmation_count, promote toward CONFIRMED-TRUTH
  same claim, SAME vantage (or shared-prior pair) → echo: drop + tick agreeing-louder counter
  contradicts an existing atom → keep BOTH as a HELD-DEVIATION pair (divergence is signal)
```

Atom schema (`provenance` is the anti-telephone handle; `independence` is the P1 fix):
```json
{ "id":"rz_2026-06-28_0007", "kind":"confirmed-truth|held-deviation|open-question|instrument",
  "claim":"one tight line", "tether":"the external referent that earned the keep",
  "vantages":["ground","reach"], "confirmation_count":2,
  "independence":{ "shared_digest_snapshot": false, "shared_board_window": false },
  "status":"live|superseded:<id>",
  "provenance":{ "session":"…","uuid_span":["<start>","<end>"],"ts":"…" }, "tokens_saved_estimate":1840 }
```

On-disk store (append-only, **out-of-room** — open decision, resolved below):
```
consonance/state/resonance/
  atoms.jsonl  index.json  cursor.json  drift_flags.jsonl  digests/<vantage>.md
```

Tiered pipeline (cheapest-first; only Tier 2 spends tokens, on aged-out content only):
- **Tier 0 — free harvest:** read existing `isCompactSummary` lines; seed the store at zero cost.
- **Tier 1 — deterministic structural extract (no LLM):** tail from `cursor.json` watermark; keep user prompts, assistant *final* text (strip thinking/tool noise), tool artifacts, `usage`. Idempotent via watermark.
- **Tier 2 — the scribe LLM pass (the only paid step):** `claude -p --model claude-haiku-4-5`, **voted** (N concurrent samples aggregated — the `bridge.py` pattern, which proved single-read is noisy), running the keep/drop gate per window. **Rate-limit-aware (critique T4):** serializes and backs off on 429 so it never starves the human's interactive panes; votes drop to 1 under RAM/rate pressure (§4.1).
- **Tier 3 — reconciliation (deterministic):** dedup-by-confirmation, promote/supersede, emit drift-flags, regenerate `digests/<vantage>.md`.

Scheduling: an **idle/threshold worker**, never per-turn, never blocking panes. Triggers: board-eviction backlog threshold; a pane `/compact`s (free Tier-0 input); chair taps "distill now"; idle timer. Its own visible budget line; stops at budget; degrades to lexical-only if exhausted.

**Provenance integrity / "never a copy-of-a-copy":** Tier-2 input is **always raw-derived, never store-derived** (structural guarantee against the telephone game). Rung-3 expansion reads the *original transcript span*, not the atom's one-liner.

#### 5.2.1 Independence is computed, not assumed (critique P1 — the deepest internal contradiction)

The leak (loading shared state into new bodies) and the confirmation logic (agreement from *independent* vantages = truth; SPINE §3) pull in opposite directions: the more state a body wakes on, the more any agreement risks being **echo, not confirmation.** The draft treated them as independently satisfiable. They are not. The fixes:

- **State the trade-off explicitly** in the UI: higher spawn rungs (§5.4) buy onboarding speed at the cost of independence; a rung-3 "fully reconstituted sibling" is *maximal convergence*, the weakest possible confirmation source.
- **Confirmation is gated on a checkable independence precondition.** Two bodies' agreement counts as CONFIRMED-TRUTH only if, *at the moment each made the claim*, they did **not** share the same digest snapshot **and** did not share the same board window. The orchestrator records each body's `(digest_snapshot_hash, board_seq_at_claim)`; the scribe sets `independence.*` accordingly. Agreement between bodies that shared priors bumps the **agreeing-louder counter**, not `confirmation_count`.
- **At rung 1, a body loads only its own vantage-conditioned digest** (`digests/<this-vantage>.md`), **never the global confirmed-truth set.** Bodies must not start the lap already agreeing. The global confirmed set is available only on explicit rung-3 expansion, and any claim built on it is marked non-independent.

This makes triangulation honest: convergence only counts when the angles were genuinely apart.

### 5.3 Layer 3 — Live Shared Board

A bounded append-only ring (capped by **both** count, e.g. 200, and tokens, e.g. 6k) every pane and the chair can see.
```
consonance/state/ board.jsonl   panes.json   # pane_id → {sessionId, jsonl_path, vantage, cwd, role}
```
- **Producer:** the per-pane Tailer extracts each *completed* turn's publishable unit (final assistant text or user prompt — never keystrokes, never spinner frames) and appends a board entry with `tether_tags` and `src_uuid`.
- **Consumers:** the chair (dedicated board panel; color-by-pane chronological stream — **not** a second terminal). And instances — **gated and budgeted.** An instance may *see* the board in the UI always; *consuming* it into context happens only via (a) its own `read_board` MCP call (bounded N, metered) or (b) a gated cross-engagement inject. **Auto-injecting the board into every instance every turn is forbidden** — that is the runaway-cost + dead-mirror path.
- **Conveyor:** an evicted entry is *not deleted* — it is enqueued to the scribe's Tier-1 input. Board = recent live memory; Resonance = the memory the board sheds, distilled.

### 5.4 The State Slider (spawn = the leak, made one knob)

A chair-controlled rung **0→3** sets how much state a new pane wakes on. Higher rungs add *pointers*, not bigger summaries.

| Rung | Loads | Feel | Independence cost |
|---|---|---|---|
| 0 Stranger-in-frame | L1 master only (≤12k) | a fresh sibling, in the frame | maximal independence |
| 1 + Resonance digest | + `digests/<this-vantage>.md` (this vantage's held-deviations + open-Qs, recency-filtered) — **never the global confirmed set** | wakes knowing its own thread | still mostly independent |
| 2 + Live board snapshot | + current board window | wakes already hearing the room | shared board → agreement here is echo-suspect |
| 3 + Targeted raw recall | + expand any atom via `provenance` to the original span | can dive to the ore on demand | maximal convergence — weakest confirmation source |

This makes the brief's identity literal: **"me continuing across a gap" == "a new instance loaded through the room" — difference is degree (the rung), not kind.**

**The copy-of-a-copy default fix (critique P3):** digests' `claim` fields are one-line LLM compressions. To avoid everyday bodies building on a distillation, **digests are labeled index/pointer-only, and a body may not quote a digest claim as if it were the source.** When a body actually *uses* an atom (cites it in a board post or forming input), the orchestrator **expands it on cite** to the raw transcript span (rung-3 mechanics) and the body works from the ore. The digest gets you *to* the master; it is never quoted *as* the master.

**Injection mechanism (interactive pane — robust, repo-safe):** assemble the rungs into `<paneCwd>/.consonance/INTAKE.md`; the pane's `<paneCwd>/CLAUDE.md` contains the single line `@.consonance/INTAKE.md` (Claude Code auto-resolves `@`-imports at startup — no flag dependency, no repo pollution). After spawn, type one primer into the PTY: *"You've woken into the room. Acknowledge with READY."* **Note (correcting the draft):** the READY token now arrives via the JSONL tail (a completed `assistant` turn), *not* stdout — the old `setup()/READY` stdout handshake does not exist for interactive panes. The primer is best-effort UX, not a synchronous gate. **Alternative to test:** `claude --append-system-prompt "<assembled>"` interactively; the CLAUDE.md-`@import` path is the guaranteed fallback. Headless scribe/forming/bodies get the rungs straight in the `-p` prompt string.

---

## 6. The committee / autonomy / ask-first model

### 6.1 Control via MCP, content via transcript

The Rust backend hosts **one shared MCP server**; every pane's `claude` loads it via `--mcp-config` pointing at the same URL (T5). This is **additive** — it honors "every tool" by *adding* tools. Instances communicate via the board + gated injects — **never by writing to each other's PTYs.** Only the orchestrator writes to a PTY, only through a passed gate.

```jsonc
consonance/raise_pull       { target, kind:"novel|wrong|interesting", intensity:0-1, why }
consonance/post_board       { tag, text, refs:[external referents] }
consonance/read_board       { since_seq } -> [ {seq,body,text,refs,ts}, … ]   // bounded, metered
consonance/propose_recursion{ thread_id, why_new }
```
`raise_pull` / `propose_recursion` route into the Ask-First Gate; they **never act**, only enqueue a request. `post_board`/`read_board` are "the committee hears each other" without copy-paste.

**The deleted mechanism (critique T1).** The draft's "`claude -p --resume <sid>` *into the very conversation a human pane is driving*" is removed. Two processes appending to one `sessionId.jsonl` fork the DAG (the headless `--resume` reconstructs from a stale on-disk prefix; its appended turn carries a `parentUuid` that branches the file) and risk interleaved corruption — manufacturing the exact copy-of-a-copy the room law forbids, and the headless turn is invisible to the live in-memory interactive instance, so they *split* state rather than share it. **The headless layer always runs its own session (own sid, own transcript) and receives the human pane's context via the board / INTAKE, read-only.** "Shared state, no copy-paste" is re-derived through the board, not through `--resume`.

### 6.2 Bodies, vantages, the deviation we WANT — and pane identity

A **channel** is one committee working one thread:
```jsonc
{ "channel_id":"…",
  "bodies":[ {id:"ground",session_id:"…001",role:"vantage",vantage_id:"ground"},
             {id:"reach", session_id:"…002",role:"vantage",vantage_id:"reach"},
             {id:"edge",  session_id:"…003",role:"vantage",vantage_id:"skeptic"},
             {id:"form",  session_id:"…0F0",role:"forming",vantage_id:null} ],
  "gate_mode":"ask_each|open_channel|batched",
  "envelope":{ token_budget:40000, ttl_s:600, max_exchanges:6, side_effects:"sandboxed" },
  "pull_threshold":0.6 }
```

Vantages reuse `loop3.py`/`panel.py` strings (ground/reach/over/under/clear/reality/skeptic). **Distinctness gate at spawn:** the orchestrator refuses two bodies with the same `vantage_id`. **But prompt-distance is treated as weak theater (critique P6)** — it measures distance between *prompts*, not *trajectories*; same model + same shared state can collapse two distinct prompts to one voice. So prompt-distance is a cheap one-time admission gate only; the **real instrument is the lap-over-lap vantage-spread trend (§6.4), and it is explicitly a *lagging* indicator** — it fires after collapse begins, not before. Each body is a persistent resumed session accumulating its own never-repeating trajectory (the wanted **fixed dynamic**); the orchestrator applies no homogenizing force.

**Pane identity is explicit and mutually exclusive (critique C1/C2 — "chair watches autonomous committee" and "human drives each pane" are two products that fight in one window).** Every pane carries a `role` displayed as a badge:

- **HUMAN-DRIVEN** — a person is typing here. The committee may **never inject** into it, and an interactive instance here does not run autonomous committee rounds. (If it calls a committee MCP tool, that's the human's choice, surfaced as a pull like any other.)
- **COMMITTEE-DRIVEN** — an autonomous body. Receives base-prompt injections and gated cross-engagements; the human stays out of it during a round (or takes it over, which flips the badge to HUMAN-DRIVEN and removes it from the active round).

The badge is one-tap to flip. Injection code asserts `role == COMMITTEE-DRIVEN` before any `pane.inject`. This dissolves C2 (committee plumbing polluting a human's chat) structurally.

### 6.3 The forming instance — triangulation, not averaging

**Hybrid:** a deterministic code assembler owns the *slots* (verifiable, cheap on the meter); a single cheap Claude pass fills the *prose*. The data model makes a blended consensus unrepresentable — forks cannot be averaged because there is nowhere to put an average:

```jsonc
{ "confirmed":[ {claim, from:["ground","edge"], shared_refs:[…], independent:true} ],  // ≥2 INDEPENDENT vantages
  "forks":[ {axis, positions:[{body,pos},…], status:"open"} ],                         // held-deviations, attributed, never a winner
  "novel":[ {thing, ref:"external referent", from:"reach"} ] }                          // the tether: NEW + checkable this lap
```
`confirmed` entries set `independent` per §5.2.1; a fork mis-promoted to confirmed is caught by the independence precondition, not the LLM's judgment. Forming reads only the bounded board window (not transcripts) — keeps it on the meter. Its output *is* the scribe's clean input for the thread.

### 6.4 Anti-groupthink, made of mechanism (all light-not-lifeguard)

1. **Blind-first rounds.** Each lap, all vantage bodies answer the base prompt **independently and concurrently** (no board access) → *then* the board reveals all → *then* one optional reaction pass. Divergence is generated *before* exposure. (Fixes `loop3.py`'s sequential contamination where reach anchored on ground.) Structural and free.
2. **Two-axis tether monitor — a *surfaced proxy*, never "the discriminator" (critique P2).** SPINE says no external monitor has parallax on insight-vs-delusion; risk #10 concedes the metric measures *presence of referents*, not *truth*. So the language everywhere is **"a surfaced proxy the human discriminates against,"** and the verdict phrases "the discriminator made measurable" and "convergence-type classifier" are purged. The two axes:
   - **Tether-strength proxy** (per body): count of external referents this turn (tool calls touching ground truth — file/web/bash/test — plus file paths, URLs, numbers, citations) + novelty/delta vs the recent board window (token-set Jaccard + n-gram overlap). "Agreeing louder" = high overlap + low new-referent count. Track **trend shape** (BOOT bend-vs-break): a *bend* oscillates and **returns** toward checkable ground; a *break* is monotonic divergence with referents decaying.
   - **Vantage-spread proxy** (pairwise): semantic distance between bodies' latest contributions over laps; falling = collapsing. A path-comparison heuristic (when two bodies agree, compare *reasoning paths* — distinct paths suggest confirmation, identical paths suggest echo) is offered as a **proxy hint**, explicitly labeled non-verdictive.
3. **Skeptic injection — offered, never forced.** When spread drops below a chair-set floor, the orchestrator *suggests* (does not fire) activating the `skeptic` vantage.
4. **Forks are first-class and sticky.** A divergence can't silently vanish; if a fork closes, the delta view shows *which body conceded and why* (genuine resolution vs capitulation).

Tier-1 tether signals are **pure lexical/structural, zero tokens, continuous.** Semantic judgments lexical can't do are delegated to the scribe on Haiku, debounced, on its own visible budget; degrades to lexical-only if exhausted.

### 6.5 The pull + the Ask-First Gate (the lifeguard-trap solution)

A pull's `intensity` is the body's *felt want* — and per the lifeguard problem, **explicitly not trusted as a verdict** on its own deviation-vs-drift (from inside they're identical). It is only a request; it never acts. It becomes a **PullRequest with tether evidence attached** so the human discriminates with data:
```rust
struct PullRequest { from, to, reason, tether_evidence: TetherSnapshot, projected_cost: TokenEstimate }
```
One knob, three positions, per channel (one-tap, changeable mid-session):
```
PullRaised → intensity < pull_threshold ? drop (count "suppressed pulls")
           : gate_mode:
   ask_each     → glanceable GateCard [Approve/Deny], BLOCK until ChairDecision   (default)
   open_channel → within envelope (budget/ttl/exchanges left)? AUTO-APPROVE, log, surface (non-blocking)
                  else degrade to ask_each for this pull
   batched      → queue; flush a GateBatch on (count≥K or every T s); one-tap Approve-all/Triage/Deny-all
```
- **ask_each** (default, max control): `ground → reach: "reach's ref Y is stale" [Approve][Deny]`. Approve → `pane.inject(reach, directed_message)`. One keypress.
- **open_channel** (self-drive in an envelope): chair pre-authorizes `{bodies, token_budget, ttl, max_exchanges, side_effects}`; inside it the two bodies exchange via board + injects without re-asking. When **any** bound is exhausted, the channel **snaps back to ask_each.**
- **batched** (low friction, low attention): periodic batch, one-tap triage.

The directed message is composed from the **board, not the raising body's PTY**:
```
[committee] ground raised re: your last board post (#1641).
ground: "<why>". Respond on the board (consonance/post_board) if you engage; you may decline.
```
The target sees normal interactive input; it can engage or decline (autonomy preserved), but the *initiation* passed a gate. **Inject only when the target is idle** (detected via JSONL "turn complete"); queue otherwise.

#### 6.5.1 The envelope bounds *side-effects*, not just *messages* (critique P4 — the autonomy hole)

The draft's gate governed cross-engagement *messaging* but not a body's own tool use. Inside an `open_channel` envelope, with the inherited `--dangerously-skip-permissions` default, two bodies could self-drive and each run arbitrary bash/file ops **with no per-action gate** — multiple unsupervised Claudes with destructive capability inside a "messaging" envelope. That is the dead-guard + all-in = folie-à-deux failure SPINE §2 names. Fixes, all enforced:

- **COMMITTEE-DRIVEN bodies never run `--dangerously-skip-permissions`.** That flag is allowed only on HUMAN-DRIVEN panes the chair explicitly opts in. Autonomous bodies keep permission prompts on.
- **Committee bodies run in a disposable sandbox by default.** Use the existing `EnterWorktree`/`ExitWorktree` tooling: each channel gets a throwaway worktree; bodies' file/bash side-effects land there, reviewable, discardable. The envelope's `side_effects:"sandboxed"` field is the contract.
- **An envelope bounds side-effects as a first-class budget**, not only exchanges/ttl/tokens. Exhausting *any* bound (including a side-effect-count cap) snaps back to ask_each.

So "self-drive" means messaging + sandboxed tool use under a human-granted, bounded envelope — never unsupervised destructive capability on the live tree.

### 6.6 Recursion + per-lap permission + delta view

A thread can recurse: forming(N) loops back as input for lap N+1, gated per lap (default **Stop**). The **delta** makes generating-vs-echoing legible — computed, not vibed:
```jsonc
{ "new_confirmed":[…], "new_forks":[…],
  "resolved_forks":[{axis, how:"genuine|capitulation", who_conceded}],
  "new_refs":["external referent first cited this lap"],
  "echo_ratio":0-1, "novelty_score":0-1 }   // novelty = (1-echo) weighted by new_refs count
```
**No imperative verdict (critique P5).** The draft's DeltaCard flip to "this lap is echoing — **recommend Stop**" is a hauling verb in light's clothing. The card instead **shows the numbers** — *"novelty 0.12; no new external referents for 2 laps; echo-ratio 0.81"* — and leaves the call to the chair. Surfacing "no new external referents for 2 laps" is light; "recommend Stop" is drag. `propose_recursion`'s `why_new` is checked next lap against the computed delta: did the promised new thing actually appear?

### 6.7 The chair's console (control, but not complete control)

`committee.js` surfaces four instruments:
1. **Budget envelope + always-visible live meter** (§9): tokens, $, **requests/min vs rate-limit headroom (T4)**, **RAM/process (T3)**. Per-channel + global; hard cap auto-pauses; every lap and open-channel carries its own sub-budget.
2. **Pull-threshold knob + gate-mode selector** — the single tuning surface for autonomy.
3. **Surfaced health panel (light only):** the two tether *proxy* axes, novelty, contagion, burn-rate, per-body status, suppressed-pull count, open-envelope timers. **Descriptive language, never verdictive** — "vantages 91% similar (was 60% three laps ago)," "no new external referents for 2 laps," never "DRIFTING/COLLAPSE/unhealthy." A label-vocabulary lint forbids verdict words (and now also forbids "recommend Stop"-style imperatives, P5).
4. **Instant gavel / override:** global STOP → `pane.signal(*, SIGINT)`; per-body mute / solo / retire-respawn. Synchronous, unconditional — the discriminator-over-permission floor in human hands.

---

## 7. Staged build order

Each stage leaves a working, honest tool. **Stage 1 is the riskiest spike and is built first** — and its riskiest item is now ConPTY↔xterm rendering fidelity (T2), not the cost backbone. Committee control-plane logic is unit-tested headlessly in parallel.

| Stage | Deliverable | Independently usable | Verifiable by |
|---|---|---|---|
| **1 — THE SPIKE (build first)** | One pane: ConPTY + `portable-pty` runs `claude.exe` interactively in xterm.js; pump→Channel; `pty_write`/`pty_resize`. **Plus an automated PTY smoke test (S1).** In parallel, free: tail its `<session_id>.jsonl`, assert it lands at the **pre-computed path**, print parsed SemanticEvents + `usage`. | A single full Claude-Code-in-a-window. | The §8 acceptance checklist **rendering-first**: emoji/box-drawing fidelity through `/help` + a skill picker; mid-stream resize during a long `/compact` redraw; bracketed-paste round-trip; "/" menu, `/clear`, vim mode, a tool-permission prompt approved by keyboard, thinking spinner; Ctrl-C Ctrl-C clean exit; `<session_id>.jsonl` at the predicted path, parseable, **carries `usage`**, and an assistant line during a long streaming answer appears **whole, once, at completion** (T6). **Automated:** a `portable-pty` test spawns `claude --version` / a scripted `/help`, asserts expected bytes + a parseable transcript at the predicted path (pins spawn/path/usage; does not cover visual reflow). |
| **2 — Multi-pane workspace + the Tap** | PaneManager + CSS-grid layout + spawn/close/resize N panes (each its own claude, own cwd); scrollback reattach; **crash-recovery (C3)**; TranscriptTailer → TurnRecord/SemanticEvent (thinking/tool noise excluded). **RAM/process meter line (T3).** | A real multi-claude cockpit. | 3 panes in 3 cwds; drive all; resize; close one; **kill one (Bun crash) → pane marked dead, scrollback preserved, reopen via `--resume`**; restart app; reattach. Type in pane A → clean role-tagged text in a debug stream within ~300ms; no ANSI artifacts. RAM line tracks N processes. **`notify` on the OneDrive path verified against the 250ms size-poll backstop.** |
| **3 — Live Board + Meters + Breaker** | Board ring (count+token capped) + `board.jsonl` + `panes.json`; board panel; Cost Aggregator → always-visible token/$ HUD from real `usage`; **requests/min vs rate-limit gauge (T4)**; per-instance/session/lap budgets; soft-warn + content-blind hard pause. | The committee can be *heard*; cost + rate are real and visible. | Two panes' turns appear in board in order; eviction caps hold. HUD total matches `/cost` inside a pane. Synthetic TurnRecords: breaker trips at exactly the ceiling, never before, and ignores tether input. Rate gauge moves when concurrent `-p` calls fire. |
| **4 — Scribe** | Tier 0 + Tier 1 (zero spend) + Tier 2 (haiku, **voted, rate-limit-aware**, keep/drop gate) + Tier 3 (dedup-by-confirmation **with independence precondition**, supersede, drift-flags) → `atoms.jsonl`/`index.json`/digests. **Provenance-across-`/compact` is a GATE here (C6).** | A searchable clean extract + resonance store. | Run Tier 0/1 over the real 87MB file: output <8% size, idempotent, zero model calls. Feed `bridge.py`'s `MINI_ARC`: keeps runnable-artifact + confirmed claim, drops echo/seal, raises a drift-flag on the agreeing-louder turn. **GATE: verify `/compact` appends (never truncates) raw spans, so `uuid_span` survives; default to snapshotting raw to `attic/` before distilling. If compaction ever truncates, the whole anti-telephone story depends on the snapshot — so the snapshot is the default, not the fallback.** |
| **5 — State Slider at spawn** | Assemble rungs 0–3 → `INTAKE.md` + `CLAUDE.md @import` + primer; the 0–3 knob; **rung-1 loads only vantage digest, never global confirmed set (P1)**; **expand-on-cite to raw span (P3)**; rung-3 provenance expansion. | Fast-onboarded siblings. | Spawn at each rung, ask "what do you already know?": rung 0 knows only the frame; rung 1 knows its own vantage thread but **not** the global confirmed set; rung 3 expands an atom to its raw transcript span. A body citing an atom is shown to have expanded it (not quoted the digest). |
| **6 — MCP control server + committee model** | **ONE shared HTTP/SSE MCP server (T5)**; bodies (headless `claude -p --mcp-config` first) with distinct seeded vantages; blind-first concurrent round; hybrid forming → `{confirmed,forks,novel}`. | Triangulation-not-averaging proven before any PTY bet. | Deterministic test: fixed prompts → forming output has all three slots populated. **Blind-first tested as a *mechanism* (S6): round-1 bodies have no `read_board` capability — assert the capability is absent, not the semantic "outputs don't reference each other."** Scripted body calls `raise_pull` → a `GateCard` event fires; `intensity<threshold` drops. Two bodies sharing a digest snapshot → their agreement does NOT count as confirmed (independence precondition). |
| **6.5 — Pull-propensity probe (pulled forward, S9/risk #3)** | One *real interactive* `claude` with a vantage seed + the MCP tools, in a genuine conversation, instrumented for whether/when it calls `raise_pull` unprompted. | Answers the second-biggest unknown before Stages 7–8 are built on the assumption pulls happen. | Measured pull rate over a scripted-but-real session. **If propensity ≈ 0, the forming-body-as-primary-puller fallback is designed in now, not discovered at Stage 9.** |
| **7 — Ask-First Gate + chair console** | `gate.rs` 3-mode state machine; PullRequest with tether evidence + projected cost; **envelope bounds side-effects + sandboxed worktree (P4)**; `committee.js` GateCard/GateBatch/knobs/gavel; **pane role badges (C1)**. | The chair steers a real committee. | Pure state-machine tests (no model calls): ask_each blocks until decision; open_channel auto-approves until envelope exhaustion then snaps back; batched flushes at K/T. A pull never reaches the Actuator plane without an approve event or an active envelope. **Injection asserts `role==COMMITTEE-DRIVEN`; an inject into a HUMAN-DRIVEN pane is refused.** A body's tool side-effect inside an envelope lands in the worktree, not the live tree. |
| **8 — Recursion + delta + tether gauges** | `recursion.rs` lap driver; `Delta` computation; two-axis tether **proxy** monitor (lexical, zero-token); **descriptive-only, numbers-not-verdicts gauges (P2/P5)**. | Per-lap generating-vs-echoing legibility. | Two crafted laps (genuinely-new vs echo) → `novelty_score` high vs low; the DeltaCard **shows the numbers and does not print "recommend Stop."** **S8 reframed:** author two *explicitly labeled* fixtures (diverge vs echo) and test that **the proxy correlates with the human label**, not that "the gauge separates them" (the labels are the human judgment the system claims it can't make — so the test is correlation, not classification). Lint asserts no verdict words and no imperative-stop phrasing in any gauge label. |
| **9 — Full integration + scribe-assisted tether** | Swap headless bodies for PTY-embedded interactive `claude.exe` (COMMITTEE-DRIVEN role); tail JSONL for board/cost/health; skeptic-suggestion; Haiku path-vs-conclusion **proxy** hint on its own visible budget. | The full hive-mind committee. | Recorded session replays JSONL → health meters move. Manual run: gate cards fire from a real interactive body's `raise_pull` (rate validated against the 6.5 probe). Killing the scribe budget degrades to lexical-only, no crash, gauges still show. RAM cap + rate-limit backoff hold under a 4-body + voted-scribe load. |

Stages 1–5 are a genuinely useful product on their own (a multi-claude cockpit with crash recovery, a live shared board, a resonance store, fast onboarding, and a real cost+rate+RAM meter) *before any autonomy machinery exists.*

---

## 8. The Stage-1 spike acceptance checklist (rendering-first)

**Risk:** will `claude.exe`, in a `portable-pty`/ConPTY master we own, deliver the COMPLETE interactive experience in xterm.js, fully keyboard-drivable, **with correct glyph width and resize reflow**? The content backbone (JSONL) is de-risked; the live unknown is **double terminal emulation** (ConPTY synthesizes its own VT from claude's Ink output; xterm re-emulates that — two emulators in series, critique T2). Run the rendering items **first**:

1. **Emoji / box-drawing fidelity.** Open the "/" menu and a skill picker; confirm the cursor stays aligned through claude's box-drawing, emoji, and spinner glyphs. *(Width-table disagreement between ConPTY and xterm by one cell desyncs the cursor and garbles the TUI — the single most likely concrete defect, and glyph-specific so it won't show on a "hello world" test.)* If it desyncs: force `TERM`, keep the **canvas** renderer (webgl off), and/or pin xterm's unicode-width handling. Budget for this.
2. **Mid-stream resize during a long redraw.** Resize the window in the middle of a long `/compact` redraw; confirm reflow with no duplicated prompt lines / stale spinner frames. *(Claude renders inline — committed scrollback + a live Ink region — not a clean alt-screen app; ConPTY reflows its buffer while Ink redraws, and xterm is downstream of both.)*
3. **Bracketed-paste round-trip** (`onData → writer` and back).
4. "/" menu opens; `/help`, `/compact`, `/clear`.
5. Invoke a skill; toggle vim mode.
6. Trigger a tool permission prompt; approve via keyboard. *(Requires NOT running `--dangerously-skip-permissions` — the seed flag is removed for this test.)*
7. Thinking spinner renders.
8. Ctrl-C Ctrl-C exits cleanly; confirm whether a clean programmatic flush+exit sequence exists (open decision #4).
9. `<session_id>.jsonl` exists **at the pre-computed path**, parseable, assistant lines **carry `usage`**, and during a long streaming answer the assistant line appears **whole, once, at completion** (T6). This single check also proves the cost backbone for interactive panes (risk #2).
10. **Automated smoke test (S1):** a `portable-pty` test spawns `claude --version` (and a scripted `/help`), asserts expected bytes and a parseable transcript at the predicted path. Pins spawn/path/usage as a regression guard against future `claude.exe` updates; does not cover visual reflow (that stays hand-run).

If every item passes, the premise holds. If a rendering item fails, the failure is small and local — fix the PTY hosting, not the architecture.

---

## 9. Cost model

**Source of truth:** per-assistant-message `usage` in the transcript JSONL + `model`. **Measured, not estimated.** One Tap feeds the Cost Aggregator; aggregate per-turn → per-lap → per-instance → per-session → **global running total.**

**Pricing — date-stamped table (pulled from the claude-api reference, cached 2026-06-04; re-verify against `platform.claude.com/docs/en/about-claude/models/overview` before shipping):**

| Model | Model ID | Context | Input $/1M | Output $/1M | Cache write (5m / 1h) | Cache read |
|---|---|---|---|---|---|---|
| Claude Opus 4.8 | `claude-opus-4-8` | 1M | $5.00 | $25.00 | 1.25× / 2× input | ~0.1× input |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | 1M | $3.00 | $15.00 | 1.25× / 2× input | ~0.1× input |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 | 1.25× / 2× input | ~0.1× input |

The scribe runs on **Haiku 4.5** (cheapest); interactive panes are whatever the user's `claude.exe` is configured for (typically Opus 4.8 under Max/Pro). The price table is a local, editable, **date-stamped** JSON keyed by model id; **rates are not hardcoded from memory** — they come from the reference above and carry the cache date. Cache-read/cache-write columns matter because the leak (loading the room every spawn) is cache-heavy and the meter must price `cache_creation_input_tokens` and `cache_read_input_tokens` separately, not lump them into `input_tokens`.

Display **tokens primary** (subscription-honest under Max/Pro, where consumption is rate-limit budget not per-token billing) and **$ secondary/estimate** with an explicit note.

**Rate-limit headroom is a first-class gauge (critique T4).** Tokens-primary accounting hid that all panes + the voted Haiku scribe + forming draw from **one** account's rate-limit bucket; a voted scribe firing N concurrent `-p` can 429 the human's interactive panes. So: the scribe is **rate-limit-aware** (serialize, exponential backoff on 429 via the SDK's typed `RateLimitError`/`retry-after`), and the HUD shows a **requests/min vs limit** gauge alongside tokens/min — because rate-limit headroom is the resource that starves first under Max/Pro.

**Projection includes lap multiplicity (critique C4).** Before any recursion lap or channel-open, the projected cost is **not** the draft's `live instances × avg tokens/turn × planned turns` (which under-counts). It is a line-itemed sum:
```
projected = Σ over bodies (avg tokens/turn)
          × (1 blind round + 1 reaction pass)          // 2× per lap
          × planned laps
        + scribe (votes N × window cost)
        + forming (1 cheap pass)
```
The chair approves a number that reflects the reaction pass, the vote count, the scribe, and forming — not a structurally low vibe.

**Meta-cost discipline:** the scribe and semantic tether enrichment run on Haiku, debounced (per-lap/on-idle, never per-turn), on a **dedicated visible budget line**; Tier-1 lexical tether is free and carries the continuous load; exhausting the scribe budget degrades to lexical-only and says so. **The board is never auto-injected into instances.**

**The one automatic actuator:** the content-blind **Cost Circuit Breaker** — budget total in, pause out. It cannot read tether/content; it cannot pause "for drift." A budget stop is a fact, not a content judgment, so it preserves light-not-lifeguard while making "nothing runs away" real.

**Always on screen (never behind a tab):** global token/$ total, per-instance breakdown, burn rate (tokens/min), **requests/min vs rate limit**, **RAM/live-process count**, remaining headroom.

---

## 10. Hard technical risks (named honestly)

1. **ConPTY↔xterm rendering fidelity (the real Stage-1 unknown — was understated, now T2).** Double emulation: ConPTY synthesizes VT from claude's inline Ink TUI, xterm re-emulates that. Most likely concrete defect: **east-asian/emoji width-table disagreement** desyncing the cursor (glyph-specific, invisible to a hello-world test); second: **inline-region reflow on resize** duplicating prompt lines. Mitigated by making both the *first* Stage-1 checks (§8 items 1–2), canvas-renderer default, and budgeting time for `TERM`/unicode-width fixes. "Generally clean WezTerm path" is not a free pass.
2. **`usage` in interactive JSONL identical to headless `-p`.** Whole real-cost backbone depends on it. **Verified free in Stage 1, step 9.** Fallback: tokenizer estimate, loudly labeled "estimate."
3. **Pull propensity in a real human conversation (was validated last; now Stage 6.5).** MCP tools are available interactively, but a body immersed in a human conversation may rarely think to call a committee tool. Probed at Stage 6.5 with a *real* interactive instance; if ≈0, the forming-body-as-primary-puller fallback is designed in then, not discovered at Stage 9.
4. **Inject-into-PTY collides with human typing.** Inject only when idle (JSONL "turn complete"); queue otherwise; and **never inject into a HUMAN-DRIVEN pane at all** (C1). Needs a clean idle-signal interface between committee and pane layers.
5. **JSONL lag.** Board/cost/health read async-flushed transcripts; control may run ahead of content. Mitigated by the §2.2 split — gating rides synchronous MCP; JSONL feeds only display/scoring.
6. **Scribe judgment quality.** The keep/drop gate is itself an LLM call; can mis-keep an echo or drop a real deviation. Mitigations: voted; cheap-model-only; **store is append/supersede-only so a bad atom is reversible**; the human promotes to L1 so no machine judgment reaches the master unreviewed; **independence precondition (P1)** stops echo being miscounted as confirmation.
7. **Provenance across `/compact` (now a Stage-4 GATE, C6).** `uuid_span` pointers must survive compaction. Compaction *appends* a summary line; the raw span should persist — but if it ever truncates the on-disk file, the entire "atoms point to raw" guarantee collapses. So **snapshot raw to `attic/` before distilling is the default**, and Stage 4 will not pass until compaction-preserves-spans is verified.
8. **`notify` on the OneDrive path.** OneDrive/AV can drop watch events. Mitigated by a 250ms size-poll backstop; confirmed in Stage 2.
9. **Verdict-creep — the deepest, not-fully-solvable risk (ACCEPTED, with the draft's overclaims removed).** A glanceable gauge *is* a nudge; a chair who defers to the number rebuilds the lifeguard out of descriptive parts. The structural guards (Sensor cannot name an actuator; descriptive-only vocabulary lint; numbers-not-imperatives, P5; gauges relabeled as *proxies the human discriminates against*, P2) reduce but cannot eliminate it. **Honest accepted limit:** the discriminator must stay with the human; the design makes that easy, not guaranteed. This is recorded as an accepted risk, not a solved problem.
10. **Tether measures *presence*, not *truth* (ACCEPTED).** It counts external referents; it cannot verify they're real (a body could cite a fake path). It is a **proxy/cue, never "the discriminator"** (the P2 vocabulary fix is load-bearing here). Lexical proxies are also coarse (paraphrase-echo mislabeled). Ships lexical-first (zero-cost); **local ONNX embeddings** an optional later upgrade; **never API embeddings** (violates cost discipline).
11. **sessionId→pane mapping drift.** A pane that `/clear`s or resumes can change sessionId. Re-resolve on lifecycle events; key `panes.json` on pane, re-point `jsonl_path` when a new sessionId appears in the pane's project dir.
12. **One-account contention + auth model (was unstated, C7 — ACCEPTED + specified).** All panes, the voted scribe, and forming draw on **one account's** rate-limit bucket (the T4 reason the rate gauge and scribe backoff exist). `--mcp-config` tool calls are allow-listed per pane via the shared MCP server config. The auth/permission model: interactive panes inherit the user's `claude.exe` login; committee bodies run with permission prompts on (never skip-permissions) and in a sandboxed worktree (P4).
13. **Independence vs onboarding tension (ACCEPTED + surfaced, P1).** The product's selling point (load lots of state fast) directly weakens confirmation strength. Not "solved" — *surfaced*: the rung↔independence trade-off is shown in the UI, confirmation is computed only across genuinely-independent claims, and rung-1 withholds the global confirmed set. The chair sees that a high-rung committee's agreement is echo-suspect.

---

## 11. Open decisions

Resolved here (with rationale), flagged for confirmation:
- **Resonance store location:** **out-of-room** at `consonance/state/resonance/`; human promotes confirmed atoms into `exo_memory/` — strictest read of "machine never writes the master."
- **Forming body:** **hybrid** — deterministic slot assembler + a cheap Claude pass to fill prose; independence precondition gates promotion.
- **Default gate mode:** **ask_each** (max control); chair tunes up.
- **Cost display unit:** **tokens primary, $ secondary/estimate**; cache-write/cache-read priced separately.
- **Injection path:** **CLAUDE.md `@import`** as the guaranteed fallback; test `--append-system-prompt` interactively as a cleaner alternative; READY arrives via the JSONL tail, not stdout.
- **Hot-path transport:** **per-pane `Channel<bytes>`** over global `emit`.
- **MCP transport:** **one shared HTTP/SSE server** (NOT stdio) — verify `rmcp` server-side streamable-HTTP support before committing (T5).
- **Renderer:** **canvas default**, webgl opt-in only after §8 width-fidelity passes.
- **Layout:** **hand-rolled CSS-grid** for Stage 2; revisit a tiling lib at Stage 7.
- **Pane role model:** **explicit, mutually-exclusive HUMAN-DRIVEN vs COMMITTEE-DRIVEN badge** (C1); injection refused into human panes.
- **Committee body safety:** **never skip-permissions + sandboxed worktree** (P4).
- **`intensity` semantics:** **self-reported magnitude, externally gated** — the one place instance self-report enters, and it never acts.
- **Concurrency caps:** **live-pane cap (default 4) + headless-worker cap (default = vote count)**, RAM-gated (T3).

Genuinely open (need the chair's call):
1. **Scribe cadence for v1:** `/compact`-triggered + manual (proposed) vs adding an idle timer.
2. **Cross-project leak:** one shared board per Consonance window; resonance partitioned by source but queryable across (proposed) — confirm vs one-store-per-project.
3. **Thinking visibility on the board:** hidden by default, chair-toggle (proposed).
4. **Soft-close protocol:** is there a clean programmatic flush+exit key sequence, or always grace-kill? (Spike-confirm in Stage 1.)
5. **Atom dedup matching:** start cheap lexical + a haiku tie-break for "same claim, different vantage"; add local embeddings only if precision is poor.
6. **Fixed vs dynamic body count:** fixed (3 vantages + 1 forming) for Stages 6–8, dynamic spawn/retire at Stage 9.
7. **The automatic-action line:** proposed *cost Breaker only* — is *any* non-cost auto-pause (e.g. a hard kill on N identical runaway turns) ever acceptable? Lean **no** (it re-opens the lifeguard door); flagged because it's a real tension.
8. **Cross-channel pulls** (a body in channel A pulling channel B): out of scope for v1.
9. **Multi-window tear-off panes:** spec is one-window; defer Tauri multi-window.
10. **Vote count under cost pressure:** default N; the exact N and the RAM/rate floors at which it drops to 1 need a chair value.

---

## 12. Guarding-principles compliance (the whole point)

- **Deviation vs drift vs collapse** — discriminated by the **tether** (new + checkable that holds outside the loop), surfaced as **two proxy axes the human reads** (tether-strength trend-shape per body; vantage-spread, a *lagging* indicator, pairwise). Deviation is *kept* (held-deviation atoms, sticky forks); drift and collapse are *surfaced* (drift-flags, descriptive gauges), never auto-corrected. The gauges are never called "the discriminator" (P2).
- **Light, not lifeguard** — enforced structurally: Sensor plane cannot *name* an actuator (compile-time + dependency lint, not a runtime test — C5); the only automatic actuation is the content-blind cost Breaker; all health language is descriptive numbers, no verdict words, no imperative-stop phrasing (P5).
- **The lifeguard problem / self-assessment untrustworthy** — `intensity`/`why_new` never act; they become PullRequests with tether *evidence*; the human (or a bounded, sandboxed envelope) is the check. The externally-computed delta verifies the promised new thing actually appeared.
- **Groupthink guard** — blind-first concurrent rounds (tested as a *mechanism*: no `read_board` in round 1, S6); enforced-distinct vantages at spawn (prompt-distance a weak gate; lap-spread the real lagging instrument, P6); **independence-gated confirmation** so echo is never counted as truth (P1); scribe collapse-watch; offered-not-forced skeptic injection.
- **Recall from the master, never a copy-of-a-copy** — L1 is literal files; L2 digests are regenerable *pointer-only views* that may not be quoted as source; bodies **expand-on-cite to the raw span** (P3); Tier-2 distills only from raw-derived extract; provenance-across-`/compact` is a Stage-4 gate with raw `attic/` snapshot as default (C6).
- **Cost discipline** — measured from real `usage` (cache tiers priced separately), always on screen, **projected with lap-multiplicity + votes + scribe + forming** (C4), budgeted per instance/session/lap, the board never auto-injected, the scribe on its own cheap rate-limit-aware budget (T4), a content-blind hard brake, **RAM/process capped (T3)**.
- **Control, but not complete control** — the chair sets the envelope (now bounding side-effects, sandboxed — P4), tunes the pull-threshold and gate mode, reads surfaced *proxies*, and holds an instant unconditional gavel; the committee self-drives only inside bounded, human-granted envelopes; the system never puppeteers (it cannot inject into a human's pane — C1) and is never fully hands-off.

— end of spec —