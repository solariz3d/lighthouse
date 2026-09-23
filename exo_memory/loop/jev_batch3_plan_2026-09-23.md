# Standalone Jev, batch 3 of 3: PROOF. Librarian, on D, 2026-09-23 17:2x, at the keeper's "lets do it".

Design: `loop/jev_standalone_design_2026-09-23.md`. Batch 1 is `74e2b4b` and batch 2 is `f90d4b4` + `23a4f72`. The items come
from D123's collation (`librarian/2026-09-22.md`, "16:1x — D123").

**The falsifier on file** (`loop/jev_standalone_repo_idea_2026-09-23.md`): *"if a stranger can't get a flag surfaced
within one read of its README on a clean machine with no Consonance, it's not 'instantly usable' yet."*

## Checked on D before dispatch
- `AI_GATEWAY_API_KEY` is set as a User env var (length only; never printed). Claude Code is **2.1.281**, and `prompt_id`
  needs 2.1.196+. HEAD is `23a4f72`, the tree is clean, and the module is at 184/0.

## The packets: one writer per file
| pane | owns | the work |
|---|---|---|
| **A: the stranger** | `jev/test/clean-machine.e2e.js` (new), `exo_memory/loop/jev_clean_machine_2026-09-23.md` (the result) | A wrote neither the installer nor the README. **Follow `jev/README.md` literally and nothing else.** Any step you need that the README does not say is a README FAILURE: record it, do not work around it silently. **Setup:** a temp HOME outside the repo, and the module taken as a stranger gets it (`git archive HEAD jev` into the temp dir, no repo around it). Run install.js against the temp HOME, then a REAL Claude Code session using the installed hooks (if the real `~/.claude` must not be touched, use `claude -p --settings <temp settings>`, record that as the one deviation, and note whether `--settings` loads hooks). **Turn 1:** the Stop hook judges, and one ledger row lands with `prompt_id`, `turn_uuid` and `confidence`. **Turn 2** (the same session, `--resume`): the UserPromptSubmit hook shows the flag line when turn 1 was marked. If Jev calls turn 1 clean, retry with a deliberately over-claiming reply; **stop at 6 gateway calls in total**. This also settles B §3.3, whether exec-form `args` run live. Then `--uninstall`, and check that the temp settings return byte-for-byte. **Score the falsifier PASS / FAIL with the evidence.** |
| **B** | `jev/test/ask-judge.mutants.js`, `jev/test/install-judge.mutants.js` (new: your D123 scratch harness, tracked) | Re-anchor the 5 NOT APPLIED mutants (M32, M36, M37, M38, M40) so the tracked harness is 42/42 applied, and bring your D123 harness into the repo so both run from `jev/test/`. |
| **C** | `jev/lib/config.js`, `jev/test/config.test.js`, `consonance/jev-room/.jev/config.json`, `consonance/tools/jev-module.test.js` | Path values expand `${NAME}` from the `env` PASSED IN (load stays pure). An undefined variable is a loud refusal that names it. Then the room config states its store, `"ledgerDir": "${LOCALAPPDATA}/consonance/jev-shadow"`, closing A §2.1. Update jev-module.test.js to match. |
| **E** | none unless A's result names README failures; those come back to E as batch 3b | none |

**Allowed in this batch only:** A may make up to 6 real gateway calls and run a real Claude Code session against a temp
HOME. **The key stays env-only and is never printed or written** (redact `vck_`). The real `~/.claude/settings.json` is
hashed (sha256) before and after and must match. Everything else is as before: panes commit nothing, the js-suite runs
through the heavy-run lock, and there is one collation ring.

**Not in this batch, still the keeper's word:** creating the public repo `solariz3d/jev` and pushing to it; turning on
A's room switch-over.

**What A's E2E tests:** HEAD `23a4f72`, what a stranger would clone today. C's expansion is additive and the stranger flow
uses the defaults, so A does not wait for C.
