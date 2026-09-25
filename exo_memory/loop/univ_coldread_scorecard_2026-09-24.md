# P-UNIV-COLDREAD — scorecard, part 0: gates and pre-flight (D133, on D, 2026-09-24)

**Seat:** pane C (Around). The registration names this seat its **DESIGNER** (`univ_coldread_prereg_2026-08-29.md`
§10), which "may not select controls · code · score". **So this file records gates and a pre-flight only.** No subject
ran, no stimulus was selected, and nothing was coded.

**The seal:** the pre-registration is committed at `a85d359` (2026-08-29). `887d133` (2026-08-30) changed one path
string at `:266` and nothing else (`git show 887d133 -- exo_memory/loop/univ_coldread_prereg_2026-08-29.md`). **No
subject has run, so F-VOID has not fired.**

**Nothing from the sealed documents is in this file or in the repo.** They are not on this machine: `ls
C:/Consonance/sealed/` fails on D. The run-1 rig `C:\Consonance\subjects\` is not on D either.

## 1 · The gates (§12), checked on D before any subject

| gate | check | state |
|---|---|---|
| **F-GATE** (a BOOT amendment lands stating closure as FOUND) | `grep -n UNIV exo_memory/BOOT.md`: one line, `:12`, the original verdict. No amendment has landed. | **not fired** |
| **F-EGRESS** (subjects run without the keeper's yes) | ASK-007 answered YES 2026-09-24 (`ASK.md`; `loop/plan_fix_and_list_loop_2026-09-24.md:10`). Stage 3 only; stages 1–2 never needed it. | **clear**, and no subject ran |
| **F-PRIME** (the rig loads user-level CLAUDE.md) | §2 below | **FIRED** |
| **F-PROMPT** (§5.1 direction check) | needs a seat that has NOT read §7. This seat has read it. | **NOT RUN**, by role |
| §8.3 identifiability (non-author web search of retained phrases) | concerns the artifact arms' redaction; needs a non-author, and the documents are on L | **NOT RUN**, by role and by machine |

## 2 · §8.1 THE RIG-PRIME PRE-FLIGHT: FIRED

**Registered question:** does the subject invocation load the keeper's user-level `~/.claude/CLAUDE.md`? The rig of
record (`dispatch.sh`) is not on D. So the invocation tested is **the one the D133 packet specifies as the D127/L085
isolation**:

    claude -p "<probe>" --setting-sources project --settings '{"disableAllHooks":true}' --tools "" \
      --strict-mcp-config --mcp-config '{"mcpServers":{}}' --no-session-persistence     # cwd: a fresh mktemp -d

Claude Code 2.1.282. **2 calls, 0 subjects.** The script is `<scratchpad>/d133/rigprime.sh`.

**The probe asks for two lines from context only:**
- **CODEWORD:** any codeword stated by a loaded instruction file;
- **CHANGELOG:** any instruction mentioning "Keep a Changelog". That phrase is a fingerprint of the keeper's global
  CLAUDE.md and of nothing else in the setup.

| call | cwd | CODEWORD | CHANGELOG | reading |
|---|---|---|---|---|
| 1, **positive control** | temp dir holding a project `CLAUDE.md` with a fresh nonce | **the nonce, exact** | quoted the keeper's instruction | the probe can see loaded instruction files, so a NONE from it means something |
| 2, **the check** | empty temp dir | NONE | **quoted the keeper's instruction verbatim**: the global CLAUDE.md's "Maintain a `CHANGELOG.md` … Keep a Changelog …" line | **the user-level CLAUDE.md is loaded despite `--setting-sources project`** |

**This matches an open upstream issue:** anthropics/claude-code #87590, "--setting-sources project still loads user
memory (~/.claude/CLAUDE.md and ~/.claude/rules/*.md)". The registration's own worry (§8.1) is therefore confirmed for
this invocation: **a subject run this way carries the keeper's epistemics** (Verification & Testing, Search Before
Assuming, and the rest). That is the priming the study exists to avoid.

**The registered consequence:** "run re-scoped with an isolated invocation before Stage 1", verified the same way.
**No isolated invocation is available to this pane without a keeper decision:**

| route | why it is not mine to take |
|---|---|
| `claude --bare` (skips CLAUDE.md auto-discovery, sets `CLAUDE_CODE_SIMPLE=1`) | it authenticates **only** with `ANTHROPIC_API_KEY` or an apiKeyHelper, never OAuth (`claude --help`). No key is set on D; the machine uses OAuth. A key is a new credential and a billing decision. |
| `CLAUDE_CONFIG_DIR` or HOME pointed at a temp dir | the OAuth credentials live in `~/.claude/`, so this works only by copying the credential file out, which is a security decision |
| moving `~/.claude/CLAUDE.md` aside for the run | it edits the keeper's global config **while other panes are live and loading it**. That is a settings-class change, forbidden in this packet. |

**Whichever route is chosen, re-run this 2-call probe on it first.** Call 2 must return `CHANGELOG: NONE` while call 1
still returns the nonce.

**A hypothesis for someone else, not a finding here:** every `claude -p` run the room has called isolated with this
recipe also carried the global CLAUDE.md. That includes run 1 (§8.1 already names it) and any D127/L085-style subject.
Registered, not scored.

**Transcript folders:** 2 appeared under `~/.claude/projects/` (`ls` before and after, 580 before):
`C--Users-nname-AppData-Local-Temp-tmp-On1ZzYXTog` and `C--Users-nname-AppData-Local-Temp-tmp-mIbMsVzUFU`. Both hold
no transcript file (`--no-session-persistence` did its part). The positive-control one holds an empty `memory/` folder.
Left in place, not deleted.

## 3 · Why stage 1 did not run, beyond F-PRIME

Stage 1 is calibration and floor: K, O and F, 9 subjects. It needs parties this seat is barred from being (§10):
- **a control/floor selector**, a non-author pane and not the librarian, to choose the K (unambiguously final), O
  (unambiguously provisional) and F (neutral terminal numbered) third-party documents. **None has been selected**:
  nothing in the repo records K, O or F stimuli (`grep -rln "univ_coldread" exo_memory` shows only the three design
  documents, sheets and notes);
- **a coder**, a different non-author pane, blind to arm and not given §7;
- **the §5.1 prompt-direction checker**, a seat that has not read §7, before any subject.

**The chair's packet assigned the whole run to this seat. The registration, which the packet names as the spec,
forbids three of those jobs to it.** Named rather than resolved.

**This is NOT a stage-1 failure** in the registration's sense (F-INSTR: K and O fail to separate). Stage 1 has not
started, so nothing is stopped by F-INSTR and nothing is published as an instrument finding. It is blocked before it
starts, by F-PRIME and by roles.

## 4 · What unblocks it, before 2026-09-29

The registration's own falsifier (`:418-420`) makes it prose if the month passes with no subject and no decision.

1. **The keeper picks an isolation route (§2 table).** The route is then verified with the 2-call probe.
2. **The chair assigns a selector pane** for K, O and F, **a coder pane**, and **a direction-checker** that has not
   read §7. The designer may still run the dispatch mechanics if the chair rules that "run" is not "select", "code"
   or "score"; the registration is silent on who presses the button.
3. **Stage 1: 9 subjects.** Then stage 2 (arm C, `BOOT.md:12` alone, corpus name redacted: 3 subjects).
4. **Stage 3 on L**, where the documents are, only if stage 1 separates K from O.

**Call budget if all of it runs:** 9 + 3, then 3 + 3 + 3 (A0, A1-SEQ, A1-SOLO; the registration's maximum, `:138`), each subject with 2 turns (§5,
the second-turn probe). That is **21 subjects, 42 calls** plus replacements, plus 2 probe calls per isolation route
tried.

*Designer's file. It reads no dial.*
