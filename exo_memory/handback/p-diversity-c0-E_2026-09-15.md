# P-DIVERSITY-C0 §2 · ECHO — can a committee pane run on a different model?

**Pane E, machine L, 2026-09-15 ~06:45–07:10.** Packet `exo_memory/loop/packet_diversity_c0_2026-09-15.md` (57f21c7), §2.
**Nothing in the repo changed.** `git diff --quiet -- consonance/src-tauri/src` was clean against HEAD (57f21c7); every
`main.rs` line below is at 57f21c7. The packet's own cites have shifted since it was filed:
- `PaneModels` is now `main.rs:1537` (filed as :1504)
- the one-shot is `main.rs:7889-7905` (filed as :7856)

**One measurement ran outside the repo:** a print-mode probe of the vendor CLI in a scratch folder, four short calls
(§2). It wrote one scratch transcript under `~/.claude/projects/…-scratchpad-diversity-probe/`, and nothing else.
`~/.claude/settings.json` was not modified by it: its mtime is still 2026-09-14 00:40:14.

---

## 0 · THE ANSWER

**From Consonance, per pane: NO.** Nothing in the app names a model for a pane:
- the spawn funnel passes no `--model` (§1.1)
- it sets no model variable in the environment
- `KeptPane` has no model field
- `claude_oneshot` deliberately passes none (`main.rs:7889`: "one-shot the GOOD model (default; no --model)")

**By the vendor, today, uncontrolled: YES, and it is already mixed.**
- **A NEW pane** spawns on the machine's default, `~/.claude/settings.json:3` → `"model": "claude-fable-5-1[1m]"` on L.
- **A RESUMED pane** keeps the model its session last used (measured, §2).
- **A pane can be switched from inside it** by typing `/model`, and the switch survives resume. But the vendor's own
  output says the command also rewrites the machine-wide default: "Set model to `Fable 5.1` and saved as your default
  for new sessions" (librarian transcript, 2026-09-02T07:14:25Z). One pane's choice becomes every new pane's.

What answered the latest turns on L (`node scratchpad/harness/models.js <transcript>`):

    chair 0c0c0c0a              claude-opus-5       librarian 0c0c0c0b           claude-fable-5-1
    third place 3d000000        claude-fable-5-1    committee A 6fe15f0a         claude-opus-5
    committee B 12fb81f6        claude-opus-5       committee 0845a868           claude-opus-5
    committee E a2122153 (me)   claude-opus-5

So the four committee panes are all Opus 5, while the default a new pane would get is Fable 5.1.

**The smallest change** is §3 (one field and one argument). **It does not break resume** in the measured mode. What it
does break or leave unguarded is in §4, with two of those items already live defects today.

## 1 · WHAT DECIDES A PANE'S MODEL NOW, AT SOURCE

**1.1 · The spawn funnel.** Every seat and pane is `spawn_claude_pane` (`main.rs:972`), called from `pty_spawn`
(:2621), `spawn_sibling` (:3245) and the rest (the ten sites in P-LEAVE D-1).

Arguments, `main.rs:1002-1056`:
- `CommandBuilder::new(claude_bin())` (:1002)
- `--resume <id>` or `--session-id <id>` (:1004-1008)
- `--dangerously-skip-permissions` (:1013), or `--allowedTools` for a fresh pane (:1028)
- `--mcp-config … --strict-mcp-config` (:1056)

**No `--model`.** Environment, `main.rs:1059-1093`:
- `TERM`, `FORCE_COLOR`
- `CLAUDE_CODE_CHILD_SESSION` removed (:1066), `CLAUDE_CODE_FORCE_SESSION_PERSIST`
- `CONSONANCE_PANE`, `CONSONANCE_READY_DIR` (:1080)
- `AMBIENT_*` (:1093)

**No `ANTHROPIC_MODEL`.** Everything else is inherited from the app's own environment. Spawn at :1095.

**1.2 · The roster.** `struct KeptPane { pane, cwd, label }` (`main.rs:3419-3424`), read and written whole by
`read_kept` / `write_kept` (:3430-3441). `set_pane_kept` rebuilds a row from exactly those three (:3767-3777). **The
three fixed seats are not in `panes.json` at all** (`main.rs:884`), so a per-pane field could not reach the chair, the
librarian or the Third Place.

**1.3 · The one place the app READS a model.** From the transcript, never to choose one:
- `extract_usage` takes `message.model` (`main.rs:2112-2124`)
- the tailer writes it into `PaneModels` (`main.rs:2568`)
- it is read by `chair_model` (`main.rs:9538-9546`) and the status surfaces, and is analyst-only by the note at
  `main.rs:1530-1536`

**1.4 · The vendor's flag** (`claude --help`, 2.1.272): `--model <model>` — "Model for the current session. Provide an
alias for the latest model (e.g. 'fable', 'opus', or 'sonnet') or a model's full name (e.g. 'claude-fable-5')."

## 2 · MEASURED: `--model` ON A NEW SESSION AND ON A RESUME

`scratchpad/diversity/probe/`. One session id, four `claude -p` calls, `CLAUDE_CODE_CHILD_SESSION` unset as the app does.
The model is read back from each assistant record in the scratch transcript:

    1  -p --session-id S --model claude-fable-5-1   "one"    -> assistant claude-fable-5-1   exit 0
    2  -p --resume S     --model claude-opus-5      "two"    -> assistant claude-opus-5      exit 0
    3  -p --resume S     (no --model)               "three"  -> assistant claude-opus-5      exit 0
    4  -p --resume S     --model claude-not-a-model-9 "four" -> exit 1 after 2,365 ms, no assistant record

1. `--model` sets a new session's model.
2. `--model` on `--resume` changes the model from that turn on, inside the same transcript. A transcript holding two
   models is accepted; the chair's shows fable-5 → opus-5 on 2026-07-28 and has resumed on it since.
3. **Without `--model`, a resumed session keeps its last model, not the settings default.** Call 3 answered on Opus
   while `settings.json:3` says Fable. So adding the flag changes nothing for a pane whose field is unset.
4. **An unusable model fails at the first REQUEST in print mode, after 2,365 ms, not at startup.** Its text:
   *"There's an issue with the selected model … It may not exist or you may not have access to it."* The vendor also
   printed a warning that bears on §4: an unknown model name is held to a 200k context window unless the name ends in
   `[1m]`.

**NOT measured:** any of this in INTERACTIVE mode under a ConPTY, which is how Consonance runs panes.

## 3 · THE SMALLEST CHANGE — named, not built

    (i)   KeptPane gains  #[serde(default)] model: Option<String>        main.rs:3419-3424
    (ii)  spawn_claude_pane, beside the --resume / --session-id arms (main.rs:1004-1008):
            if let Some(m) = read_kept().into_iter().find(|k| k.pane == pane_id).and_then(|k| k.model) {
                cmd.args(["--model", &m]);
            }
          A lookup INSIDE the funnel, so no call site changes, and the resume path and the fresh fallback both get it.
    (iii) set_pane_kept (main.rs:3767-3777) must carry the field through its rebuild, or un-keep/re-keep erases it.

- An unset field passes no flag: every pane behaves exactly as today (§2 item 3).
- It covers committee panes only. The fixed seats are not in the roster (`main.rs:884`) and would need their own
  source (a config key or a constant), which is a separate and larger change.

## 4 · WHAT IT WOULD BREAK, OR LEAVE UNGUARDED

- **RESUME — does not break, in print mode** (§2 items 2–3). Three risks remain unmeasured:
  - **The `[1m]` suffix.** The seats run 1M windows: the librarian and the chair compact at ~963–999k tokens
    (P-HARNESS §1). The default is `claude-fable-5-1[1m]`. A field reading `claude-fable-5-1` without the suffix may
    hold a ~700k conversation to a 200k window on resume. The vendor warning in §2 item 4 says so for unknown names; it
    is untested for known ones. Whatever writes the field has to write the suffix, or refuse a bare name.
  - **A refused model at resume.** Print mode fails at the first request (2,365 ms), past `RESUME_CONFIRM`'s 1,000 ms
    (`main.rs:5558`), so it would NOT be read as a resume refusal. That matters, because a refusal falls back to a fresh
    spawn and renames the transcript to `.jsonl.orphaned` (`main.rs:6272-6282`, the rename at :6276). The unguarded
    case is the opposite: a pane comes up on a model it cannot use and fails on the first delivered message, and only
    that message's reply shows it. If interactive mode instead exits within a second, the orphan path WOULD fire.
    Unmeasured.
  - **Another machine or account.** A model available on L may not be on D. Same failure shape; unmeasured.
- **THE ROSTER ACROSS MACHINES — the field is DROPPED on arrival.** A's `rosterApply` rebuilds every arriving row as
  `{ pane, cwd, label }` plus `home` (`consonance/tools/state-sync.js:1018-1020`). A `model` key would not survive a
  MIGRATE. By §2 item 3 the pane would then resume on its last model, not the default, so the drop is silent: it
  leaves the pane on whatever it last ran. The field itself would stay on the far machine only if A's transform
  carried it.
- **ALREADY TRUE TODAY, adjacent and not asked:** the roster on L has a `home` key on all four rows (`panes.json`:
  keys `pane,cwd,label,home`), and `KeptPane` (`main.rs:3419-3424`) does not declare it. So the app's own
  `set_pane_kept` → `write_kept` (:3767-3777, :3437-3441) rewrites the file without `home` the next time any pane is
  kept or un-kept. A `model` field added to the JSON by hand without (i) and (iii) would be lost the same way.
- **THE INTAKE — no model dependency found.** No intake composer reads a model:
  - `librarian_intake` :7319
  - `main_intake` :6519
  - `resumed_intake` / `intake_with_map` :5330-5465
  - `grep -n -i "opus|fable|sonnet|haiku|[1m]"` over `main.rs`, `capture.rs`, `mcp.rs` and `harvest_guard.rs` finds
    model names only in pricing, the context gauge's tests and audit-line tests

  The 150,000-char CLAUDE.md cap (`main.rs:6853`) is the host's and is not documented as model-dependent; not tested
  per model.
- **THE CAPTURE — no model dependency found.** The screen capture and harvest read vt100 text and match no model name
  (same grep: none in `capture.rs`). The tailer records whichever model answered (:2568), so a switch shows up in
  `PaneModels` at the next turn, which is what that map exists for (`main.rs:1524-1528`).
- **THE CONTEXT GAUGE — handles it.** `context_window` is keyed by the model string and resets its high-water mark on a
  change (`main.rs:1354-1364`); `context_key` (:1370-1372).
- **COST — MISPRICED, not broken.** `turn_cost_usd` (`main.rs:2101-2110`) prices anything that is not `haiku` or
  `sonnet` at the "opus 4.8 default" rate, Fable included. I did not look up Fable 5.1's price, so I cannot say by how
  much.

## 5 · WHAT THIS DOES NOT ESTABLISH

- Nothing in interactive mode under ConPTY: the four probe results are print mode.
- Nothing about D, D's account, or whether Fable 5.1 is available there.
- No test of a bare `claude-fable-5-1` against a resumed transcript larger than 200k.
- Nothing about whether switching a seat's model mid-lineage changes what the diversity registration would be
  measuring. That is the design lap's question, not a feasibility one.

## 6 · CORRECTIONS

- **The packet's line cites are stale** (`:1504` → `main.rs:1537`, `:7856` → `:7889`). The code moved before the
  packet was filed; the facts they point at hold.
- **The vantage DISAGREE on L052's +220** (really +226) re-arrived with this dispatch. Already corrected twice; no action.

## 7 · INSTRUMENTS

    scratchpad/harness/models.js <transcript>   runs of message.model across assistant records
    scratchpad/diversity/probe/ + sid.txt       the four-call probe and its session id; transcript under ~/.claude/projects/…diversity-probe/
    claude --help (2.1.272)                     the --model text
