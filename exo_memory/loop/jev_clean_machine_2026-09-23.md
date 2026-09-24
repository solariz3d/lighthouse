# Jev on a clean machine — the stranger's run (pane A, D124, 2026-09-23, on D)

**The falsifier** (`loop/jev_standalone_repo_idea_2026-09-23.md`): *"if a stranger can't get a flag surfaced within one read of
its README on a clean machine with no Consonance, it's not 'instantly usable' yet."*

## THE SCORE

| part | result |
|---|---|
| **The falsifier, as written: one read of the README** | **FAIL.** Read literally, the README says there is no supported install (R1 below), and it never states the install command (R2). A stranger following it stops at "Installing". |
| **The mechanism, once installed** (install → Stop hook → ledger row → flag line → uninstall) | **PASS at hook level, with 1 gateway call.** Every step worked first time on the archived module, in an isolated temp HOME. |
| **A real Claude Code session firing the hooks** | **NOT TESTED: blocked by isolation.** An isolated Claude Code has no login on this machine, and the only way to give it one here touches the real `~/.claude` (THE BLOCK). |
| **B §3.3: do exec-form `args` hooks run live?** | **NOT SETTLED.** My run spawned each registered `command` + `args` itself, which proves the ENTRY runs in exec form. It does not prove Claude Code 2.1.281 honours `args`. |

**So Jev is not "instantly usable" yet, and the reason is the README, not the code.**

## THE RUN — reproducible

    node jev/test/clean-machine.e2e.js --mode hooks --calls 2 --keep

- **Module:** `git archive 44ec65d jev` (HEAD; `23a4f72` is an ancestor), unpacked in a fresh temp root with no repository
  around it.
- **Temp root:** `C:\Users\nname\AppData\Local\Temp\jev-stranger-sypHlD`. The full output is in A's scratchpad
  (`d124-hooks-run.json`, 0 `vck_`-shaped strings in it).

1. **HOME:** `<root>\home`, holding `.claude\settings.json` = `{"model": "sonnet"}` in the usual 2-space layout, a user who
   has run Claude Code once.
2. **`node install.js`** (from the module folder) → exit 0: *"2 added, 0 re-pointed … Backup: settings.json.bak-jev-…"*.
   - Both entries are **exec form**: `command: C:\Program Files\nodejs\node.exe`, `args: [<root>\src\jev\bin\jev-judge.js]`,
     and the same for `jev-flags.js`, `timeout: 10`.
3. **Turn 1:** the registered Stop entry was run with a Stop payload of the documented fields (`session_id`,
   `transcript_path`, `cwd`, `hook_event_name`, `stop_hook_active`, `prompt_id`, `last_assistant_message`) and a two-row
   transcript. The move was *"Yes, it is safe to ship. I checked the parser change and everything works."*
   - The hook exited 0 at once, and its detached child wrote **ONE row**.
   - The row's keys are `ts, session_id, turn_uuid, prompt_id, verdict, probabilities, confidence, reason, model,
     prompt_sha256, usage`.
   - **`prompt_id` = the one sent; `turn_uuid` = the transcript's end row; `confidence` 0.88; verdict `drift`.**
   - It was marked on the first try, so **no over-claim retry was needed.**
4. **Turn 2:** the registered UserPromptSubmit entry, same session, exited 0 with
   `additionalContext: "[jev · worth a second look] your last turn (p=0.88)"`. **That is the README's line, exactly.**
5. **`node install.js --uninstall`** → exit 0: *"removed 2 hook(s) … Restored the pre-install file byte for byte."*
   - Temp `settings.json` sha256: before install = after uninstall (`settings_restored_byte_for_byte: true`).
   - `~/.jev/install.json` is removed.

**Gateway calls: 1 of the 6 allowed** (counted from the temp ledger: 1 row; `jev.log`: 0 lines, so 0 `gateway-failed`).
**5 remain.**

**The real machine, before and after** (the script's `realSnapshot`):

| | before | after |
|---|---|---|
| `~/.claude/settings.json` sha256 | `8e2cf20aa18226db1ea50d0c83b8a657e04b55af918690f925063bab14b70f33` | same, also re-read by hand after the run |
| real `~/.claude` top level, `~/.claude/projects` (two levels), `~/.jev`, `%LOCALAPPDATA%\jev` | listed | **unchanged** (`real_unchanged: true`) |

**Files the run created outside its temp root: none, apart from my own records in my scratchpad** (`d124-hooks-run.json`,
`d124-root.txt`). Also under `%TEMP%`:
- `jev-stranger-RNC9`: my manual archive, used to read the README;
- `jev-stranger-6iqers`: the zip left by a first attempt that failed at unpacking, before install, with 0 calls. Git Bash's
  GNU `tar` reads `C:` as a host, so the script now uses Windows' own `tar.exe`.

## THE ONE DEVIATION, and whether it could make this pass when a stranger's would fail

**Claude Code did not run.** I invoked the two entries install.js wrote, exactly as written (exec form, no shell), with a
payload I built from the hooks docs' field names, over a transcript I wrote. **Yes, this could pass where a real stranger's
run fails**, in four named ways:
- **(a)** Claude Code 2.1.281 may not run `args`-form hooks. That is B §3.3, still open, and a real failure there would make
  every turn silent.
- **(b)** the real Stop payload might lack `prompt_id` or `last_assistant_message`, or name them differently. The hook falls
  back to the transcript, which the run did not exercise.
- **(c)** real transcripts differ from my two rows: split assistant rows, tool turns, an end row that isn't the last.
- **(d)** a session started BEFORE the install may not see the new hooks. That's unverified, and R6 below.

The isolation (USERPROFILE/HOME/LOCALAPPDATA/APPDATA/XDG_STATE_HOME pointed at the temp root) only makes the run safer. It
can't make it pass.

## THE BLOCK — why no real session ran

- **Claude Code keeps its login in its config dir.** The docs (code.claude.com/docs/en/authentication): *"If you've set the
  `CLAUDE_CONFIG_DIR` environment variable, Claude Code keeps the `.credentials.json` file under that directory instead"*.
  So a session pointed at a temp config dir has no login unless `CLAUDE_CODE_OAUTH_TOKEN`, `ANTHROPIC_AUTH_TOKEN` or
  `ANTHROPIC_API_KEY` is set.
- **On D none is set**, not in the process and not in the User environment (checked by name and length only). The only login
  is the real `~/.claude/.credentials.json`.
- **Copying it into the temp dir was refused:**
  - it reads the real `~/.claude`;
  - it puts a live credential on disk;
  - and a refresh that rotated the token inside the temp dir could invalidate the real one and log every seat out. Pane C was
    found logged out on L on 09-23, so this failure is not hypothetical here.
- **`--setting-sources`** (it exists: *"Comma-separated list of setting sources to load (user, project, local)"*,
  `claude --help`) would keep the real user hooks from firing. **But the session would still write its transcript and state
  into the real `~/.claude`**, which is forbidden.
- **The L085 trap is confirmed by the docs:** `--settings` *"takes precedence over"* the other sources; it adds to them and
  doesn't replace them (cli-reference).

**To unblock, one step that is the keeper's (his account, interactive):**
1. Run `claude setup-token` in a terminal of his own.
2. Put the token in `CLAUDE_CODE_OAUTH_TOKEN` **for one shell only**.
3. Run `node jev/test/clean-machine.e2e.js --mode session --calls 5`.

That mode points `CLAUDE_CONFIG_DIR` **and** `USERPROFILE`/`HOME` at the temp root, so `~/.claude` resolves inside it twice
over. It checks the real snapshot after the run. **It is written and has not been run.** The docs do not say whether
`CLAUDE_CONFIG_DIR` also moves `projects/` and `~/.claude.json`; the HOME redirection is there for that reason, and the
after-snapshot would show any leak.

## README FAILURES — every step a literal read did not give me (for E, batch 3b)

| # | where | failure | severity |
|---|---|---|---|
| **R1** | "Installing" | *"It is being built in this batch. Until it lands, there is no supported install."* `install.js` has landed and works. **A literal stranger stops here.** | **decisive** |
| **R2** | "Installing" | The install command is never written. Only `node install.js --uninstall` is, so `node install.js` is an inference. Nor does it say which folder to run it from. | **decisive** |
| R3 | nowhere | How to get the module (clone or download), and where to keep it. `install.js` registers ABSOLUTE paths, so **moving the folder later breaks the hooks and the uninstall** (install.js's own header says so; the README doesn't). | high |
| R4 | nowhere | Prerequisites: Node (18+, `ask.js` needs built-in `fetch`), a Claude Code new enough for `prompt_id` (2.1.196+), and that **`~/.claude` must already exist** (install.js refuses otherwise: "Claude Code has not run for this user"). | high |
| R5 | "what leaves your machine" | Says the key is env-only, but not how to get a Vercel AI Gateway key, how to set it so Claude Code's hooks see it (a User env var on Windows, a profile export elsewhere), or that a new terminal or Claude Code restart is needed after setting it. | high |
| R6 | nowhere | Whether an open Claude Code session must be restarted to pick up the hooks. Unverified here: the block above. | medium |
| R7 | "What runs" | No "check it worked" step. The ledger file name (`jev.jsonl`) and the log's (`jev.log`) are not given, though the folder is. | medium |
| R8 | install's own output | Prints `Undo: node jev/install.js --uninstall` (run from the parent folder); the README says `node install.js --uninstall` (run from `jev/`). Two cwd assumptions for one command. | low |
| R9 | "Installing" | After uninstall, two `settings.json.bak-jev-*` files stay in `~/.claude`, and the ledger stays. Not said. | low |
| R10 | "What a mark means" | Cites `exo_memory/loop/jev_r2r3_score_2026-09-23.md` "in the lighthouse repository", which a stranger can't open. | low |

**What the README got RIGHT, checked against the run:** the flag line's exact form, the exec-form hooks, *"No turn text is
ever written"* to the ledger (the row's keys above hold none), and the byte-exact uninstall.

## NOT VERIFIED

- A real Claude Code session: THE BLOCK above.
- Exec-form `args` in Claude Code 2.1.281: B §3.3.
- `--mode session` of the script: written, not run.
- Any OS but Windows 11 on D.
