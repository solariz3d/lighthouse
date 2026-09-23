# Standalone Jev, batch 2 of 3: the plan. Librarian, on D, 2026-09-23 15:2x, at the keeper's "lets get the work back up and running".

Design: `loop/jev_standalone_design_2026-09-23.md`. Batch 1 landed `74e2b4b` (L114). The collation ring and its two added
items are in `librarian/2026-09-22.md` at "07:59 E rang".

## CHECKED ON D BEFORE DISPATCH
- D is at `74e2b4b`. The librarian's L-side stop note `0be31e8` did not travel; it said only that batch 2 waits for the
  keeper's word, which is now given.
- `node --test jev/test/*.test.js` on D first gave **113/2**. Both failures were PARITY tests comparing `jev/METHOD.md` with
  the room's `METHOD.md`, and D's WORKING COPY of the room file was CRLF. `core.autocrlf=true` on D, and 407 tracked files are
  `w/crlf` here. The committed bytes are identical apart from the vendor header that `readDiscipline()` drops. I re-checked
  out `METHOD.md` alone (content unchanged; `git status` is clean) and got **115/0**. **The fragility is real:** the parity
  tests read working-copy bytes, so any CRLF checkout fails them. It goes into A's packet below.

## BATCH 2: one writer per file
| pane | owns (writes only these) | the work |
|---|---|---|
| **B** | `jev/install.js`, `jev/test/install.test.js`, `jev/bin/jev-judge.js`, `jev/test/judge.test.js` | install.js MERGES `~/.claude/settings.json` (never replaces), registers the Stop and UserPromptSubmit hooks, is reversible with `--uninstall`, is idempotent, and works on any OS; tests on a temp HOME, including an existing settings file with foreign hooks left intact. **Plus, in jev-judge.js:** key the turn by the Stop payload's `prompt_id` and take the move from `last_assistant_message` when present (B's own §3.4), falling back to the transcript as today; keep `confidence` in the ledger row. |
| **E** | `jev/bin/jev-flags.js`, `jev/test/jev-flags.test.js`, `jev/README.md` | Flags line: when there is no reason, show Jev's confidence (`p=0.xx`) in place of "(Jev gave no reason…)". It reads the row B now keeps. **README:** the first screen says judged turns are sent to the Vercel AI Gateway, that the key is env-only, and how to opt out (`.jev-off`, `optOut`). It quotes the measured precision exactly as the design words it ("about 1 in 4 marked turns was confirmed…; the readers were the room's own and lean lenient"), never "Jev caught drift". It cites `loop/jev_r2r3_score_2026-09-23.md`. |
| **C** | `jev/bin/jev-report.js`, `jev/test/jev-report.test.js` | Summary over the ledger: turns judged, marked, refused/failed (from `jev.log`), and confirmed if a labels file exists. It uses C's `config.load` for `ledgerDir`. It never prints turn text. |
| **A** | `consonance/tools/jev-*.js` switch-over behind a flag, the room-side config, `jev/test/prompt.parity.test.js` | Consonance as a config consumer: a `.jev/config.json`-shaped config for the room (sessions = the seats, audience `consonance`, ledgerDir = today's store). The room's tools call the module when a flag is on and keep today's path when it is off. **Plus:** the parity tests compare with line endings normalised (CRLF→LF) on both sides, and a test pins that a CRLF room copy still passes. |

Every pane: run your own tests, then the whole `node --test jev/test/*.test.js`, then js-suite through the heavy-run lock in
the background. Commit nothing, ring the librarian, and end the ring with a NEXT line. No gateway call, no install into the real
`~/.claude`, no settings edit. **Batch 3 (the clean-machine test) and the public repo stay on the keeper's word.**
