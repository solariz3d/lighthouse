# p-l215-fail-closed-A: the key works, no gate's own header asks for it, and the prompt setting is not built

Pane A, machine L, ledger L215, packet `loop/packet_l215_fail_closed_A_2026-11-21.md` (read whole). Branch `l215-fail-closed`, cut from `l214-spend-less`, in worktree `C:\Consonance\lh-wt-l215`. Nothing on main touched, nothing installed. Marked `checked:` or `inferred:`. Evidence: `p-l215-fail-closed-A_2026-11-21_evidence/`.

## The result in six lines
1. **R1 (probes): `onFailure: "block"` works exactly as the research said; `denyInsteadOfPrompting` works but ALSO denies a hook's "ask", and is NOT honoured from a seat folder's `settings.local.json`.** Both findings stop step 5.
2. **R3 (the gates table) found no gate to switch.** Every `PreToolUse` gate's own header says it fails OPEN by design ("a hook bug must never trap a seat"); the packet's rule was: switch only a gate whose header or plan says it must refuse. None does. **I switched none.** Two candidates are named for a ruling (below).
3. **What I built is the switch and its way out, switching nothing:** `install.ps1 -FailClosed <leaf,...>` and `-GatesOpen`; 6 rows green, mutants 7/7; shown live in a scratch home (R2 and R4 below).
4. **Step 5 (the builder panes' no-prompt setting) is NOT built, by the packet's own stop line:** the setting denies the dispatch gate's "ask" (seen), and it is not honoured in the file the packet names (seen).
5. **R6:** `dream-gate.test.js` 1/1, `install-manifest` 5/5, `install-holds` 7/7, `install-fresh-home` 3/3 (checked).
6. **Failed-on-the-room line:** not triggered: nothing is switched, and the way out was shown to free a stuck scratch seat.

## R1: the probes (2.1.330; scoped `--settings` and scratch homes; the user's settings never read or written)
**`onFailure: "block"`** (`probe_onfailure.js`, `onfailure_run1.txt`): the key sits in the hook entry beside `type`, `command` and `timeout`. A `PreToolUse` command hook on `Bash`; the guarded command writes a marker file.

| the hook | no key | `onFailure: "block"` |
|---|---|---|
| cannot start (no such program) | action WENT THROUGH | **REFUSED** |
| crashes (exit 1) | WENT THROUGH | **REFUSED** |
| hangs past its timeout (2 s) | WENT THROUGH | **REFUSED** |
| refuses (exit 2), control | REFUSED | REFUSED |
| allows (exit 0), control | WENT THROUGH | WENT THROUGH |

The seat sees: "A PreToolUse hook failed before execution, and the hook is configured to block on failure" (cannot start / crash) and "A PreToolUse hook … timed out, and the hook is set to block". "Killed mid-run" was not run separately: the timeout row is a hook that does not return, and `inferred:` a kill behaves as a crash.

**`permissions.denyInsteadOfPrompting`** (`probe_deny.js`, `deny_*_run*.txt`): a stream-json host answering permission prompts counts how often it is asked.
- **Honoured from `--settings`:** a plain call that needs permission: host asked 1x with the setting off, **0x with it on**; the seat gets "Permission for this tool use was denied. It requires approval, and this session has no approval surface — nobody can answer a permission prompt here — so it was denied automatically." and the turn goes on.
- **A hook's "ask" is denied too:** with a `PreToolUse` hook returning `permissionDecision: ask`, the host was asked 1x with the setting off and **0x with it on**, the same text. So the setting would turn the dispatch gate's deliberate ask into a denial.
- **Not honoured from a file in the seat's folder:** `.claude/settings.local.json` and `.claude/settings.json` in the working folder, with the setting on: host asked **1x** (three runs: an untrusted scratch folder at both levels, and a trusted one at local level). The user level was not tested (I do not touch the user's settings). So `inferred:` the setting takes effect from the user file or a `--settings` flag, not from a project or local file.

## R3: the gates table (every registered `PreToolUse` gate; file:line of what its own header says)
| gate | what its header says when its own process fails | switched? |
|---|---|---|
| `delete-gate.js` | `:12` "A tree too big to finish is ALLOWED … the gate fails open on its own limits, as on any error of its own." | no (header says open) |
| `push-gate.js` | `:18` "FAILS OPEN on any error of its own … a hook bug must never trap a seat." | no (header says open) |
| `wake-gate.js` | `:21` "It fails OPEN on any error of its own." | no |
| `dispatch-gate.js` | `:25` "FAILS OPEN, always." | no (the packet also names it) |
| `sources-gate.js` | `:15` "FAILS OPEN on any internal error, any shape it does not recognise, any timeout." | no (the packet also names it) |
| `second-reader.js` | `:4` "It never blocks, delays or alters a ring." | no |
`consonance/GATES.md:19` states the rule for the whole room: "Every gate fails open on its own error (a broken hook never traps a seat), except the map gate in strict mode" (a Rust gate, not a hook). The packet's Why cites `first_dispatch_gate.md:132,294`; those lines say only that a timeout does not block unless `onFailure` is set (what the key does), not that a gate must refuse. **By the packet's rule the table switches zero gates.**

**Two candidates for a ruling, not switched:** `push-gate.js` (a credential or a file over 10 MB leaves the machine: "the breach is outward and cannot be undone", `:15-16`) and `delete-gate.js` (a recursive delete through a junction empties what it links to). Both headers chose open on purpose, so closing them reverses a written design: a ruling for him, not for a lap. If he rules yes, the line is one command (below).

## What I built (`install.ps1` +43/-1, `install-failclosed.test.js`, 6 rows)
- `-FailClosed push-gate.js,delete-gate.js`: sets `onFailure: "block"` and, if absent, a 10 s `timeout` on those **PreToolUse** entries of **managed** hooks only; a name the script does not manage prints `UNKNOWN` and does nothing, a non-gate (a SessionStart hook) is not switched. `-File` passes a comma list as one string, so the script splits it (a row pins that).
- `-GatesOpen`, **the way out:** takes `onFailure` off every managed hook; a hook the script does not manage keeps its key (a row). It needs no working gate. A bare re-run never strips what `-FailClosed` set (a row).
- Both refuse with `-Check`, `-NoRegister` and each other (a row). **Nothing is switched by a bare run, and no gate is switched by this change.**
- **The one line he can run** (a plain terminal): `pwsh dev/shell/install.ps1 -GatesOpen`. If every seat is stuck on a blocking gate and no terminal is to hand: start claude with `CLAUDE_CODE_SAFE_MODE=1` (hooks off, the harness's own safe mode, `claude --help`) and run the line there. `inferred:` safe mode (not run).
- **Rows 1-6 green; mutants applied 7 / caught 7 / NOT APPLIED 0** (the first run caught 5 of 7; two rows added for the survivors: an unmanaged hook with `onFailure` survives `-GatesOpen`; a gate with no timeout gets one). Red first: rows 2-4 failed against the installer before the parameters existed (3 of 5 red), then green.

## R2 and R4, live (`live_r2_r4.js`, `live_r2_r4.txt`): a scratch home, push-gate's entry pointed at a node script that does not exist
```
A  gate process cannot start, no key (today)   onFailure=-----  command=BROKEN   ->  action WENT THROUGH
B  gate process cannot start, -FailClosed      onFailure=block  command=BROKEN   ->  action REFUSED
C  after the way out: -GatesOpen               onFailure=-----  command=working  ->  action WENT THROUGH
```
**One caveat on C:** the installer also re-points a broken command to the installed copy on any run, so the way out here frees the seat by both removing the key and repairing the command. The key's removal alone is shown by row 3 (the settings file); a seat with a blocking gate whose script is still broken would need the repair too, which the same run does.

## Step 5: not built, and why (the packet's stop line)
The packet said: if the setting also denies the dispatch gate's ask, stop and say so before building. It does (seen), and it is not honoured from `settings.local.json` in an instance folder (seen). Two notes for the ruling: the dispatch gate matches `chair_inject|call_chair`, which a builder pane does not use (`inferred:` from the matcher), so for A, B, C and E the lost "ask" may not matter; and the working route for the setting is the user file, which also covers the chair, the librarian and the Third Place, whom he wants prompted. A per-seat route would be the app adding `--settings` to a builder pane's launch (the app's spawn, B's file). Not built.

## Registered, scored
R1 held (above). R2 held live (A through, B refused). R3 held (the table; zero switched, two candidates). R4 held live (C). R5 not run, step 5 stopped. R6 held. **Failure line 1** (a killed gate still lets its action through): only with the key off, by design; with the key on it does not. **Failure line 2:** not triggered.

## Where it stops
Branch `l215-fail-closed` (worktree `C:\Consonance\lh-wt-l215`), committed by named paths; `install.ps1.diff` in the evidence folder for B. Scratch: `scratchpad\l215\`. I created and removed an empty `.claude` folder in the unused instance `fresh-cc74c4a8` for the local-level probe. Main untouched; nothing running.

NEXT: pane B read `p-l215-fail-closed-A_2026-11-21_evidence/install.ps1.diff` and run the installer's tests, when the librarian has routed this; the keeper rules (a) whether `push-gate.js` and `delete-gate.js` should fail closed, with `-FailClosed` as the one command, and (b) how builder panes get no-prompt (user file, or the app's launch flag).
