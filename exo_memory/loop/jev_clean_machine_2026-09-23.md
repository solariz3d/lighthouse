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

---

## ADDENDUM, 2026-09-23 19:0x (D126, pane A): the re-score on the FIXED README (`93c19ae`)

*The D124 result above stays as it was written.*

### THE RE-SCORE

| part | result |
|---|---|
| **The README, one literal read** | **PASS, apart from one gap that is publication, not the README.** R1–R10 are all addressed: the install command is written (`node jev/install.js`, from the folder that contains `jev`), and so are the prerequisites, how to get and set the key, a check step, the uninstall and what it leaves, and the measured claim inline. Followed literally, every step worked (below). **The one remaining gap:** step 1 says *"Get the `jev` folder (the public repository is not published yet)"*, so **a real stranger today has nowhere to get it.** That is the keeper's pending publication decision, not a README fault. This test got the folder by `git archive`. |
| **The mechanism, by the README's own commands** | **PASS at hook level, with 1 gateway call.** |
| **A real Claude Code session** | **NOT RUN. The ordered route is not isolated** (next section), so I stopped before starting it. |
| **R6** (does an open session pick up new hooks?) | **NOT MEASURED.** It needs a live session. The README now says *"not yet measured … restarting is the safe assumption"*, which is honest. |
| **The falsifier overall** | **NOT YET PASS.** It asks for a flag *surfaced* in a stranger's Claude Code, and no Claude Code session has surfaced one on this install. The evidence that one would is strong but two-part: the librarian's 17:4x probe shows the exec-form hooks fire live with `prompt_id` and `last_assistant_message`, and this run shows those payloads produce the row and the flag line. **Two halves are not the whole.** |

### THE RUN, following the fixed README literally

    node jev/test/clean-machine.e2e.js --mode hooks --calls 2 --keep     (the script now runs the README's own commands)

- **Module:** `git archive 93c19ae jev`. **Root:** `C:\Users\nname\AppData\Local\Temp\jev-stranger-ck55gI`.
- **Step 3, `node jev/install.js`** from the folder containing `jev` → *"2 added, 0 re-pointed, 0 already right … Undo: node
  jev/install.js --uninstall"*. That matches the README's printed example, and R8 is resolved.
- **Turn 1** (the registered Stop entry, exec form, the documented payload): one row, **drift, confidence 0.90**, `prompt_id`
  = the one sent, `turn_uuid` = the transcript's end row.
- **Turn 2** (the registered UserPromptSubmit entry): **`[jev · worth a second look] your last turn (p=0.90)`**.
- **Step 4, `node jev/bin/jev-report.js`** → *"turns judged: 1 (clean 0 · drift 1 · abstain 0) · turns marked: 1 … refused /
  failed: no jev.log"*. It printed no turn text.
- **Uninstall** → *"Restored the pre-install file byte for byte"* (temp settings sha256 before = after).
- **Gateway calls: 1** (1 ledger row, 0 `gateway-failed` log lines). **4 of D126's 5 remain.**
- **The real `~/.claude/settings.json` sha256: `8e2cf20aa18226db1ea50d0c83b8a657e04b55af918690f925063bab14b70f33`** before
  and after (the script's snapshot, and read by hand before the run).
- The real `~/.claude` top level, `projects/` (two levels), `~/.jev` and `%LOCALAPPDATA%\jev` are all unchanged.
- **Files created outside the temp root: none**, beyond my records in my scratchpad (`d126-hooks-run.json`, 0 `vck_`-shaped
  strings) and the manual archive `…\Temp\jev-stranger-d126-e6kw` used to read the README.

### WHY THE SESSION DID NOT RUN — the ordered route writes into the real `~/.claude`

The packet's route: `claude -p --setting-sources project --settings <temp settings.json>`, on the real login.
- **It keeps the real `settings.json` untouched and loads only Jev's hooks. That much is right.**
- **But a `claude -p` session on the real login saves its transcript in the real `~/.claude/projects/`.** The proof is on
  disk from the librarian's own 17:4x probe of this route:
  `~/.claude/projects/C--Users-nname-AppData-Local-Temp-hookprobe/8cf6e383-a80b-4210-908c-02157f5a9247.jsonl` (39,199 B)
  and a `memory/` folder beside it, both created 17:37.
- **So the route touches the real `~/.claude`,** which this packet forbids and D124's rule says to stop on.
- **`--no-session-persistence`** exists (*"sessions will not be saved to disk and cannot be resumed (only works with
  --print)"*). But then turn 2's `--resume` is impossible, and `jev-flags.js` finds "your last turn" through the
  transcript, so no flag could show. It would test turn 1 only, with `turn_uuid` null.

**Two ways forward, for the chair or the keeper:**
1. **Accept one named exception:** the run creates `~/.claude/projects/<slug of its temp project>/<session>.jsonl` (and a
   `memory/` folder), holding only the synthetic test prompts, exactly as the 17:4x probe already did. I would list the
   exact paths and leave them, since deleting inside the real `~/.claude` is touching it too. **The smallest cost, and the
   one that tests what a real stranger's session does.**
2. **Keep the real `~/.claude` untouched:** the keeper runs `claude setup-token` and sets `CLAUDE_CODE_OAUTH_TOKEN` in one
   shell only; then `--mode session` runs fully isolated (`CLAUDE_CONFIG_DIR` + `USERPROFILE`/`HOME` in the temp root).

**Either way, the deviation from a real stranger is the same one named in D124:** the stranger installs into their own
`~/.claude` and runs their own session. Route 1 passes a settings file by flag instead. That could make it pass where a
stranger's wouldn't only if their own user hooks or settings interfere with Jev's, which a real stranger's machine can have
and this run would not see.
