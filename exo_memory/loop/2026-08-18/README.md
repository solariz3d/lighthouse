# Pane artifacts, 2026-08-18 — the instruments, carried in before a restart

The 08-18 journal closes by naming these as *still in session-local scratchpads and not in the
repo* — the landed-is-not-shipped shape applied to the evidence for its own findings. They are
carried here because `pty_kill` removes a pane's sandbox, so a Consonance restart would have
destroyed them.

**What is here is the INSTRUMENTS. What is deliberately not here is the DATA.**

Two artifacts were held out because they contain conversation content, and the standing rule is
that private conversation material travels only through private OneDrive, never this repo:

| held out | why | where it went |
|---|---|---|
| `archaeology/results.json` | embeds quoted prose sentences sampled from Main's transcript | `OneDrive/consonance-migration/pane-data-2026-08-18/archaeology-results.json` |
| `suggestion-probe/main-suggestions.jsonl` | 443 recovered ghost suggestions, i.e. **predicted keeper prompts**, several personal | `OneDrive/consonance-migration/pane-data-2026-08-18/main-suggestions.jsonl` |

Every instrument below regenerates its own data, so the omission costs reproducibility nothing —
it costs only the convenience of not re-running.

## `archaeology/` — pane B

The compaction survival measurement. `PREREG.md` fixes the definition and the falsifier **before
any row was read**; `extract.js` produces the table; `kwcheck.js` bounds the paraphrase objection;
`spotcheck.js` is the manual verification pass. `FINDINGS.md` is B's write-up.

Re-run: `node extract.js` against Main's transcript. Re-derived independently by E, identical.

**One known defect in the prose:** `FINDINGS.md` says 07-28 lost *34 of 37* prediction sentences;
the instrument reports FLAG survival for that event as **0/37**. The journal copied the prose
figure second-hand. The instrument is right.

## `compact-probe/` — pane A

Establishes that `PreCompact` `additionalContext` reaches the summarizer **only as a root-level
field**, and that the documented-looking `hookSpecificOutput` shape is rejected non-fatally and
invisibly. `hook.js` and `settings.json` are the probe rig; `events.jsonl` is its output across
4 PreCompact fires and 3 PostCompact completions.

`events.jsonl` is kept because it carries no keeper conversation — the probe ran in disposable
sessions A created for the test. It contains the negative case, which is the part that matters:
the `hookSpecificOutput` run carries neither canary token, the root-level runs carry both.

## `suggestion-probe/` — pane A

`REGISTRATION.md` was written **before any capture attempt**: the ECHO / EXTENSION / ADD buckets,
the strict ADD exclusions, and the unwelcome outcome stated in advance — *if ADD is about zero,
the channel is an echo, the eerie feeling is confirmation bias, and this instrument found nothing.*

`ghost-extract.js` recovers ghost suggestions from Consonance's own PTY capture (`main.rs:914`),
which is the only place they persist — Claude Code itself stores none. It prints a **chrome count
beside the ghost count every run**: UI chrome renders through the same dim grammar, so
`ghosts=0 & chrome>0` means suggestions were genuinely absent, while `ghosts=0 & chrome=0` means
the extractor died. Those two states cannot be conflated.

**Standing score: n=2, ECHO 2, EXTENSION 0, ADD 0.** The unwelcome sentence is still live. 431
events remain unscored, and that manual pass is where the keeper's *"it almost knows the path"*
actually gets tested.

## `audit/` — pane E

`scan1.js`–`scan3.js` re-derive the chair's four compaction claims from the transcript rather than
from its proxies. `listen.js` builds the level envelope from `heard.jsonl` and is the instrument
that **refuted the journal's build-by-retreating claim** — troughs grow shallower across the build,
not deeper. Re-derived by the chair with a different extrema walk; both agree.
