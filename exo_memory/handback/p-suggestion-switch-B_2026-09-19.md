# P-SUGGESTION-SWITCH · BRAVO — the switch exists, it can be scoped to the seats alone, and live it empties the idle composer (D075, lap 2, candidate 1)

**B (pane `12fb81f6`), machine D, 2026-09-19 ~01:3x–01:5x.** Packet: `exo_memory/loop/plan_composer_predicate_2026-09-19.md`
@`baea2d7`, section "ADDED 01:2x", candidate 1. Mechanism read at source: `handback/p-composer-tristate-E_2026-09-19.md`
§5 and `handback/p-delivery-census-C_2026-09-19.md` §"The six suggestions".

**No seat's settings changed. Nothing in the repo edited except this file and one line in `map/B.md`. Nothing committed.**
Scratch: `C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/suggest/` (SCR below).

---

## 0 · ANSWER

| question | answer | source |
|---|---|---|
| does a switch exist? | **YES, two surfaces, one feature.** Setting **`promptSuggestionEnabled`** (Boolean, default `true`; `false` hides them). Env var **`CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION`** (`false` turns them off; **takes precedence over the setting**) | https://code.claude.com/docs/en/settings-reference#promptsuggestionenabled · https://code.claude.com/docs/en/env-vars · https://code.claude.com/docs/en/interactive-mode#turn-prompt-suggestions-off |
| where can it live? | Setting scope **"Any file"** = user `~/.claude/settings.json`, project `.claude/settings.json`, local `.claude/settings.local.json`, managed. Also `/config` → **Prompt suggestions**. Env var per process ("takes precedence over this key for one session") | settings-reference: `promptSuggestionEnabled` entry, "Scope: Any file"; §Settings index defines Any file as all four |
| seats only, keeper's sessions untouched? | **YES, by the env var on the spawn.** Every seat is spawned by Consonance's own `CommandBuilder` (`consonance/src-tauri/src/main.rs:1006`), which already sets per-pane env (`:1063-1091`). One `cmd.env("CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION", "false")` there reaches every pane and **nothing the keeper starts from a terminal**. That is a build (§3) | `sed -n 1000,1100p consonance/src-tauri/src/main.rs` |
| live proof | **Control (unset): the idle composer ends HAS TEXT, holding the suggestion `now put all four steps together in one list`. Switch on: 0 dim draws in the whole capture, and the idle composer ends EMPTY**, under E's D074 predicates | §2 |
| version | env var "Requires Claude Code v2.1.238 or later"; D runs **2.1.278** | env-vars row; `claude --version` |

Docs fetched 2026-09-19 ~01:3x with `curl -sL https://code.claude.com/docs/en/<page>.md`. Copies in SCR: `settings-reference.md`
sha256 `ac4329e7…`, `env-vars.md` `17c833c6…`, `interactive-mode.md` `fb1e00c1…`. I did not answer from memory.

**Verbatim, interactive-mode §"Turn prompt suggestions off":** *"Set `promptSuggestionEnabled` to `false` in your settings file · Set
the `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION` environment variable to `false`, which takes precedence over the setting."*

---

## 1 · WHAT THE SWITCH COVERS: both dim things, not just one

The docs name **two** grey things under one heading (interactive-mode §"Prompt suggestions"):
- **(a)** *"When you first open a session, Claude Code shows a grayed-out example command"*. This is the `Try "…"` placeholder, E's
  fixture `composer_placeholder_reads_as_text_2026-09-19.bin`, class 4 in E's scanner.
- **(b)** *"After Claude responds, Claude Code can suggest your next prompt"*. These are **C's six forced holds**, verbatim `ok`,
  `go ahead with chunk 2`, and so on (C's hand-back table). E's scanner reads them as class 1, HAS TEXT.

The docs do not say plainly that the switch removes (a). **Measured: it removes both** (§2): (a) appeared in 3 of 3 controls and
0 of 2 switched-on runs; (b) appeared in the one control long enough to generate it, and in neither switched-on run.

---

## 2 · THE LIVE PROOF, on throwaway sessions (never a seat)

**Harness:** `SCR/live/src/main.rs` (sha256 `1f6f4414…`), `portable-pty =0.8.1` built `--offline`, the app's crate.
- **Spawn:** a PTY the way `main.rs:1006-1091` spawns a pane: 34×120 (`EMU_ROWS/EMU_COLS`, `main.rs:960-961`),
  `TERM=xterm-256color`, `FORCE_COLOR=1`.
- **Inherited env removed:** **every inherited `CLAUDE*` variable and `CONSONANCE_PANE` / `CONSONANCE_READY_DIR`**, so a
  throwaway cannot stamp readiness as my pane or mount as a seat.
- **Session:** cwd is a fresh empty scratch folder with no MCP config.
- **Drive:** Down + Enter on the trust dialog, then 2 or 4 short no-tool prompts, then 45 s idle. The raw PTY bytes go to a log.
- **Arms:** `unset`, or `on` = `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`.

**Scanner:** E's `scan.exe` (C:/…/sibling-07b8a48f/…/scratchpad/vtdump/target/release/scan.exe, sha256 `0bb29509…`;
source `scan.rs` `6a3fa77f…`), run as-is. Its summary line does not print the **last** frame, so `SCR/live/src/bin/lastframe.rs`
(`84997abc…`) is **E's `scan.rs` lines 1–30 copied verbatim**, with only a `main` that prints the final frame's class.
**Control on that copy:** on E's four fixtures at 64×99 it returns EMPTY, PLACEHOLDER (4), HAS TEXT, and MARKER-NO-RULE
(the trust dialog), which matches E's table row for row.

```
$ scan.exe <log> 34 120        (summary lines)          $ lastframe.exe <log> 34 120    ESC[2m draws (grep -o)
control.log   2 turns unset   placeholder 2   empty 31     final: EMPTY                     1  Try "fix lint errors"
control2.log  2 turns unset   placeholder 2   empty 27     final: EMPTY                     1  Try "how does <filepath> work?"
on.log        2 turns ON      placeholder 0   empty 46     final: EMPTY                     0
control3.log  4 turns unset   placeholder 2   empty 75     final: HAS TEXT                  3  Try "create a util logging.py that...",
                                                                                              "yes, do step 4, same length",
                                                                                              "now put all four steps together in one list"
on3.log       4 turns ON      placeholder 0   empty 78     final: EMPTY                     0
```
Full output: `SCR/scan-run1.txt`, `SCR/scan-run2.txt`. Logs: `control.log` `b04d5e65…`, `control2.log` `53436754…`,
`control3.log` `8561a2d8…`, `on.log` `c6a03d4c…`, `on3.log` `c18ad71d…`.

**Reading it.**
- **control3 is the defect, reproduced live.** The last composer draw is `ESC[2m now put all four steps together in one list`,
  vt100 0.15.2 keeps it at Default fg, and E's predicate reads HAS TEXT on an idle pane. This is the same shape as C's six.
- **on3 is the same script with the switch on.** It has no dim draw anywhere, and the idle composer reads EMPTY.
- The has-text frames in every arm are my own typed prompts, seen mid-typing, which is correct.

**n is small: one paired run shows the after-response suggestion.** The 2-turn controls generated only the startup example. That
matches the docs' skip list: *"After the first turn of a conversation, in some sessions"*, and cold cache. **control.log was also a
first session after an upgrade** (banner "Updated to latest"), which the docs say leaves suggestions off.

---

## 3 · HOW TO APPLY IT: the chair's and keeper's call, not done here

| route | seat-only? | needs a build? | notes |
|---|---|---|---|
| **A · `cmd.env("CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION", "false")` at `main.rs` beside `:1071`** | **yes**: only processes Consonance spawns | **yes**: rebuild + relaunch | the route I tested live (the env var). Precedence: it beats every settings file, so nothing in the keeper's or a room's settings can re-enable it for a seat |
| B · `"promptSuggestionEnabled": false` in each seat's `C:/Consonance/instances/<seat>/.claude/settings.local.json` | yes, per cwd | no | **NOT tested live** (§4). The sibling instance folders have no `.claude/` today (`ls C:/Consonance/instances/sibling-5bf9d657/.claude` → absent); four `fresh-*` folders do. Every new seat folder would need the file, so this is install drift waiting to happen |
| C · `~/.claude/settings.json` | **no**: it turns them off for the keeper's own sessions too | no | fails the packet's third question |

**A consequence for the keeper to decide, not me.** Main is a Consonance pane, and the keeper types in it. Route A or B turns the
suggestion off **in Main too**, and so for the keeper whenever he is at that composer. `main.rs:8649-8653` records that he is the
one who found the grey prediction stalling the loop (2026-09-07, *"If it spawns in the bar, it stops the loop"*). Whether he wants
the suggestion back in Main is his call. The switch cannot be scoped narrower than "per process", and the process is the seat.

---

## 4 · NOT VERIFIED

- **The settings-file route (B) was not run live.** Only the env var was. The docs say both work; they do not say whether a
  `.claude/settings.local.json` in a **non-git** cwd is picked up as project scope. The instance folders are not git repos
  (the environment reports "Is a git repository: false").
- **Not on a real seat.** Both arms were throwaway sessions: no MCP mount, no `--dangerously-skip-permissions`, no `--resume`.
  None of those is documented as touching suggestions, but none was tested with the switch.
- **n = 1 for the after-response suggestion** (control3 vs on3). Repeated only in shape by C's six real cases.
- **Not measured: whether the forced count falls.** That is the plan's falsifier, and C's census over a day after a fix is the
  instrument. Nothing is fixed yet.
- **Not ruled out: other dim writes in an idle composer.** Only the suggestion kinds appeared across 5 captures (`grep -o ESC[2m`
  returns exactly those 5 draws in total: 1 + 1 + 3). Anything else that draws dim into the composer row would still misread, which is what
  candidate 2 (see the dim) would cover.
- **Usage-limit interaction:** the docs say suggestions also pause near the usage limit unless the var is `true`. Irrelevant to `false`.

## 5 · SIDE EFFECTS of the proof (left in place; say the word and I remove them)

- 5 transcript folders under `C:/Users/nname/.claude/projects/C--Users-nname-AppData-Local-Temp-claude-…-scratchpad-suggest-cwd-{off,off2,off3,on,on3}`.
- Folder-trust entries for those 5 scratch cwds, which Claude Code records in `~/.claude.json` (not inspected).
- The user-level SessionStart hooks ran in each throwaway; `C:/Consonance/data/sessionstart-state.jsonl` changed during the runs.
- **No ready stamp was written:** `C:/Consonance/data/ready/` holds nothing newer than 01:30, and no file named for a throwaway.
- 5 short model sessions of usage (2–4 turns each).

## 6 · WRONG column

- **W1.** Run 1 sent a bare Enter to the trust dialog on the assumption that the default was "Yes". **The default is "No, exit"**
  (`❯ No, exit` in the raw bytes), so both sessions exited, and 1,384 B of dialog was all they captured. I fixed it with Down, then Enter.
  It is the same screen as E's `composer_unreadable_trust_dialog` fixture.
- **W2.** The first two-turn control generated no after-response suggestion, so on its own it was vacuous. I nearly scored it; a
  4-turn pair was run instead.
- **W3.** I wrote a Windows path with backslashes into a Rust source through a bash heredoc, which broke my own standing rule; the
  compiler caught it (`unknown character escape`). I fixed it through Edit. Separately, my first copy of E's code took lines 1–31
  and opened `carve`. I fixed it to 1–30 and checked it against the fixtures before use.

NEXT: librarian collate the pointer and hand route A/B plus the Main question to the chair when D075 lap 2 closes
