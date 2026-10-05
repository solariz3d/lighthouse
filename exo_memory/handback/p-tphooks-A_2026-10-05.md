# D245 item 3: the build's state no longer reaches the Third Place's hooks — seat A (Sonnet 5.5), 2026-10-05

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_consonance_compaction_tp_2026-10-05.md
(and the chair's post-crash check: `node --check ~/.claude/shell/sessionstart-state.js`; item 3 ONLY, items 1-2 not touched)

**Where:** commit `e5c55866` in the lighthouse repo (six named paths, nothing pushed). The same edits are in the installed copies under `C:\Users\nname\.claude\shell` (backups first, below). Third Place content was not read: I worked from the hooks' code and from fake payloads only.

## 1. The inventory: what reaches a `third-place` cwd, per wired hook
Wired (`~/.claude/settings.json`, read, not edited), for SessionStart / UserPromptSubmit / PreCompact / Stop. "Before" is measured (harness below), not inferred.

| event | hook | what it put in front of the seat | verdict |
|---|---|---|---|
| SessionStart | `hooks/session-start.js` | ambient time; L3 notices (none in the fixture); the night table (only after a gap); **Recent session digests** (every seat's session times, ~10 KB on this machine today as it reached this seat); its own recent sessions | **gated: the digests.** The rest kept |
| SessionStart | `sessionstart-state.js` | **the state block** (HEAD, dirty files, instruments, triggers, NAME line), on `source=compact` only; startup/resume already skipped | **gated: all of it** (a ledger row records the skip) |
| UserPromptSubmit | `hooks/userprompt-submit.js` | the pulse date line and thread age; **the chain line** (lap, holder, dirty count, from chain-status.js); the interval; L3 notices | **gated: the chain line.** Date, age, interval kept |
| UserPromptSubmit | `consonance/hooks/ask-surface.js` | **the questions the automations put to the keeper** (read no payload before) | **gated** (a judgment call, see 4) |
| UserPromptSubmit | `findings-return.js` | rows matched to the originating pane's basename only | no gate needed: 0 bytes for a third-place cwd, measured |
| UserPromptSubmit | `hooks/ready-prompt.js` | `{}` | none |
| PreCompact | `hooks/precompact.js` | **the checkpoint** (repos, dirty files, residue); and it WRITES `CHECKPOINT.md` | **gated: nothing printed, nothing written** for the seat's compaction (as for a fresh pane) |
| PreCompact | `precompact-preserve.js` | the preservation directive (carry shas, numbers, falsifiers verbatim) | **not gated**, see 4 |
| Stop | `hooks/stop.js`, `ready-stop.js`, `sourced-stop.js`, `reply-slot.js` | `{}`, nothing, nothing; reply-slot acts only for the main and librarian cwds | none reach context |

Also read, not wired for these events on this machine: `hooks/userprompt_pulse.py` (the laptop's pulse, it also carries the chain line; **not edited**, flagged: if the Third Place ever runs on L it still leaks there), `board-digest.js` (already gated at `:302`, untouched). SessionEnd and PreToolUse are outside the four events.

## 2. What changed
The same cwd test as `board-digest.js:302` (`/[\\/]third-place[\\/]?$/i` on the cwd with trailing separators stripped), **inlined** in each of five hooks, 38 lines added and 4 changed across six files plus the test. No new file under `~/.claude/shell`, so `install.ps1`'s manifest needed no change. Masters edited alike: `dev/shell/hooks/{session-start,userprompt-submit,precompact}.js`, `consonance/hooks/{sessionstart-state,ask-surface}.js`; installed `userprompt-submit.js`, `precompact.js`, `sessionstart-state.js` are byte-identical to their masters (`cmp`).

## 3. The tests, each from a named command
- **Before and after, every seat byte-identical** (the requirement): `node harness.js before` then `node harness.js after` then `node harness.js diff` (evidence dir, below): 12 hooks (15 payloads) x 14 cwds in an isolated fake install (own `CONSONANCE_SHELL_DIR`, `CONSONANCE_DATA`, `USERPROFILE`; chain-status, state-block, ask and checkpoint.py are stubs, `py` is node, the clock is fixed; nothing touches the real shell dir, board or CHECKPOINT). **210 runs: 175 identical, 35 changed, 0 changed for any other cwd.** The 35 are exactly 5 third-place spellings x 7 (session-start startup and compact, sessionstart-state compact, userprompt-submit, ask-surface, precompact manual and auto). The "before" side is the saved originals, `sha256` of the two result files in the evidence dir: before `70c8d156a10a7aa7…`, after `991bd5078e441fc0…`. A cwd that only looks like the seat (`third-place-x`, `notthird-place`, `third-place\sub`, `x\third-place\y`, no cwd) is unchanged.
- **The committed test:** `node --test dev/shell/hooks/third-place-gate.test.js` → `tests 5 pass 5 fail 0` (a seat cwd in five spellings gets no chain line, digests, state block, asks or checkpoint; it keeps ambient, the date line, the interval and its own sessions; every other cwd gets golden strings under a fixed clock; lookalikes are not the seat; the skip is a ledger row).
- **Mutants (the touched hooks):** `node gate_mut.js`, one lock hold: control green (5 of 5), **12 of 12 caught** (each gate removed, each regex half dropped, a gate that takes too much, the ledger reason). First run 11 of 12: **G9 survived**, a real gap, not equivalent: one trailing separator is already allowed by the regex, so the strip matters only for two or more; I added a cwd with two trailing backslashes, then 12 of 12.
- Runs held the shared heavy-run lock; no push.

## 4. Calls I made that the chair may overrule
1. **ask-surface is gated.** The plan's list was "chain/pulse, board, session digests, checkpoint, dirty files"; the asks to the keeper are not on it, but they are the build's questions addressed to the keeper, not to this seat. Eight lines, one revert.
2. **The whole state block is withheld**, including its NAME line (which reports the chair name, a field the seat has no use for). If the seat should keep the NAME line, split the block.
3. **Left alone on purpose:** L3 notices (a welfare channel about the seat itself), the night table (its dream filenames name other seats' dreams and goal names; borderline, left), and `precompact-preserve.js`: its directive tells the summarizer to keep commit shas, instrument names and falsifiers verbatim, which is a build-shaped lens on the seat's own summary. That is plan items 1-2 (what the compaction keeps), not item 3, so I did not touch it.
4. **No `CHECKPOINT.md` is written for a third-place compaction.** Other seats' compactions still write it.

## 5. What it does NOT establish
- **Not seen in a live Third Place session** (and I may not read its transcript). It is shown on the code and on fake payloads with stubs; the first real check is what its next wake and prompt actually contain.
- The stubs stand in for the real chain-status, state-block, ask and checkpoint tools, so what those emit for another seat is unchanged by construction (the hooks pass their output through untouched), not re-measured.
- **Five copies of one regex** now exist (plus board-digest's). `test` guards them against drift, but a sixth hook added later will not have it. A shared lib file was the alternative; I chose inline so no installer manifest line and no new carrier file is needed.
- `userprompt_pulse.py` (laptop) is not gated.

## 6. The crash and what I re-verified
The PC crashed at 11:58 with my gate test and mutants queued, none running a test (a queued gate-test run had also started an old, unrelated `sp_run2.js` helper by mistake: a name collision with a file from earlier, void either way). After the relaunch I re-did every check: each installed hook `diff`ed against its backup shows only the intended lines (session-start +6/-1, userprompt-submit +7/-3, precompact +4, sessionstart-state +13, ask-surface +8) and all parse (`node --check`); the harness, the gate test and the mutants were then all re-run, and the harness reproduced the pre-crash result exactly.

## 7. Corrections (mine)
- First mutant run 11 of 12 (G9), fixed as above. The gate test needed a pinned timezone (`TZ=America/Regina`) or its golden strings depend on the machine.
- One shell command of mine ran a backticked path as a command in an earlier packet (nothing damaged, recorded in the earlier hand-back); and three of my `node -e` edits failed on quoting this packet before any file was changed.
- Pre-existing drift found, not fixed: the installed `hooks/session-start.js` differs from `dev/shell/hooks/session-start.js` (the 2026-09-23 "retracted wording" repair never reached the installed copy on this machine), and a stale comment in `userprompt-submit.js` says "this file is not installed here". Neither is mine; my edits went into each copy as it stood.

## 8. Restore, if any seat's hooks look wrong
Backups taken before any edit, in `exo_memory/handback/p-tphooks-A_2026-10-05_backups/` (`*.bak-20261005`, byte-identical to the originals by `sha256`). Restore one: `cp <that dir>/session-start.js.bak-20261005 ~/.claude/shell/hooks/session-start.js` (likewise `userprompt-submit.js`, `precompact.js` into `hooks/`, `sessionstart-state.js` into the shell root, `ask-surface.js` into `consonance/hooks/`). The evidence dir also holds `harness.js`, `gate_mut.js`, `gate_spec.txt` and the two result files.

NEXT: a non-author look (B or E) at the five gates, then E measures items 1-2 of the plan
