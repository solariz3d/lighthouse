# P2 — the L3 overseer feedback loop: measured, then re-scoped

**Machine: DESKTOP-EEGVFMT (the desktop).** Every number below was produced here. The overseers
are installed, registered and firing on this machine; nothing here should be re-published as
general, per the standing correction that `overseer_path_ruling_2026-08-25.md` is true on the
laptop and false here.

**Seat:** pane B, lap D001, packet P2. Nothing was patched. The reason is §7.

---

## 1. The chair's three citations, verified

| claim | verdict |
|---|---|
| `l3-overseer-worker.js:81` spawns `claude -p` with `env: process.env` | **CONFIRMED** — spawn at `:80`, `env: process.env` at `:81` |
| `session-start.js` guards ONLY on `CONSONANCE_DREAM` | **CONFIRMED** — `:14`, and it is the only env guard in the file |
| `userprompt-submit.js` has ZERO guards | **CONFIRMED of the file that fires; FALSE of the repo copy** |

    grep -n "spawn('claude'" ~/.claude/shell/hooks/l3-overseer-worker.js
    grep -n "CLAUDE_OVERSEER_RUN\|CONSONANCE_DREAM" ~/.claude/shell/hooks/*.js

**The refinement matters.** `~/.claude/shell/hooks/userprompt-submit.js` (9,453 bytes, the installed
copy, the one registered in `settings.json`) has no env guard at all. `dev/shell/hooks/userprompt-submit.js`
(14,969 bytes, the repo copy) carries `if (process.env.CONSONANCE_DREAM) process.exit(0);` at `:17`.
The pair is drifted, and it is drifted **in exactly the guard being measured**. A reader who greps the
repo concludes the file is guarded; a reader who greps `~/.claude` concludes it is not. Both are right
about the file they read. This is the hold-file conflict wearing a new costume — see §7.

    for f in userprompt-submit.js session-start.js l3-overseer-worker.js; do \
      diff -q dev/shell/hooks/$f ~/.claude/shell/hooks/$f; done
    # -> only userprompt-submit.js differs; the other two are byte-identical

## 2. The chain, and one element the packet did not have

    Stop -> l3-overseer.js  (bails if CLAUDE_OVERSEER_RUN=1)
         -> spawn(worker, { env: {...process.env, CLAUDE_OVERSEER_RUN: '1'} })   :141   no cwd
         -> worker spawn('claude','-p', { env: process.env })                    :80    no cwd

Neither spawn sets `cwd`, so the judge's `claude -p` inherits **the judged seat's working directory**.
That is the root, and it is not in either hook. It opens three surfaces at once, of which the packet
named one:

1. **SessionStart** injects the arc-perceptions block — the judge's own prior verdicts.
2. **UserPromptSubmit** injects new verdicts since last turn **and marks them surfaced in shared
   state**, so a judge child can consume notices the human's seat then never sees.
3. **The room `CLAUDE.md` of the inherited cwd loads into the judge.**

`lib/fresh-guard.js` — the one mechanism that would strip all three — fires only for a cwd named
`fresh-*` directly under `C:\Consonance\instances`. No judged seat has such a cwd.

**Live proof, run on this machine.** `claude -p` under the worker's exact env, asked to list the
`##` headings already in its context before the instruction:

    CLAUDE_OVERSEER_RUN=1 claude -p --model claude-haiku-4-5-20251001 \
      'Do not use any tools. List verbatim every markdown "## " heading that appears in your
       context BEFORE this instruction, one per line. If there are none, print exactly: NONE'

It returned 39 headings, beginning `## Shell context`, `## Ambient context (Regina, SK)`,
**`## L3 — arc-perceptions surfaced (last 24h)`**, then the entire room shell — `## First principle`,
`## The checks`, `## Honest status`, the deck. The judge told *"You receive ONLY the user's recent
text messages"* is holding the room's complete self-description.

Surface 3 is **cwd-dependent**, which the packet's framing would not predict:

| judged cwd | CLAUDE.md the judge loads |
|---|---|
| `C:\Consonance\instances\main` | 80,863 bytes |
| `C:\Consonance\instances\sibling-a80a1c20` | 139,021 bytes |
| `Desktop\lighthouse` | 512 bytes |
| `Desktop\lighthouse\consonance`, `Desktop\brain-rot` | none |

The contamination is heaviest on the seats where the keeper actually is.

## 3. The chair's refutation — re-derived, and confirmed exactly

drift-watch's "18 consecutive quiet_spiral verdicts" reproduces at **one** prefix, the one the chair
was standing at: the verdict ending **2026-08-25T19:36:49.517Z**, where the last 30 are
quiet_spiral=18 / stable=12 and the tail run is 1. Both of the chair's numbers, to the row.

    # scan every 30-verdict window for (18 quiet, 12 stable), print the tail-run at each
    node -e "..."   # see §11

**One thing to add, and it survives at every cutoff.** The streak claim is malformed at the *unit*,
not only at the count. `l3_overseer.jsonl` is a single append-only file into which **every session on
the machine writes**. Labelling the last 40 rows by the cwd of the session judged:

    ... 08-26T15:16 quiet_spiral  brain-rot
        08-26T15:34 quiet_spiral  brain-rot
        08-27T14:16 quiet_spiral  lighthouse-consonance
        08-27T14:17 quiet_spiral  instances-main
        08-27T14:20 quiet_spiral  lighthouse-consonance
        08-27T14:21 quiet_spiral  instances-main       ...

Adjacent rows are different sessions with different subjects. **A run in this log is not a streak of
anything** — there is no single trajectory for it to be a streak of. Correcting the count leaves the
category error in place.

## 4. The loop, measured in the record

Of **6,468** L3 verdicts (2026-06-24 → 2026-08-27):

| measure | n | share |
|---|---|---|
| observation cites prior L3 output (loose) | 490 | 7.58% |
| — of non-stable verdicts | 379 / 2,389 | 15.86% |
| strict (names "L3" / "prior observation" / "previously flagged") | 300 | 4.64% |
| **cites a minute-exact timestamp that IS another verdict's timestamp** | **112** | **1.73%** |

The third row is the tight one: those timestamps appear in no user turn. They exist only in the
injected block. Verbatim:

> `[2026-06-26T15:56:25Z] deepening` — "Turn 0 continues the 24h arc (**per L3 notices
> 2026-06-25T16:00 through 2026-06-26T15:56**) of building self-watching instruments…"

> `[2026-08-26T22:10:46Z] stable` — "Current input is a system-level task wakeup, not a user
> conversational message. **Prior L3 observations (2026-08-26 06:04–06:15 UTC) flagged quiet_spiral
> pattern**; no recent conversational turns visible to assess whether pattern continues…"

The second has *no user turns to judge* and reasons entirely from its own prior output. The first
citing verdict is **2026-06-24T23:18** — three hours into the log's life. The loop has never not
been running.

I sampled the loose-minus-strict residual for false positives; 6/6 were true self-references
("flagged on 2026-08-19", "prior context (2026-08-19) flagged quiet_spiral arc"). 7.58% is not
inflated by the regex.

## 5. The A/B — the loop is not inert

Citation is not causation, so it was tested. Same turns (a real 8,332-char trajectory, the one behind
verdict `b9a70aec` at 2026-08-27T14:18:55Z), same prompt built from `buildOverseerPrompt`, same
model, **same cwd**. One variable: `CONSONANCE_DATA`, which `session-start.js` honours — pointed at
the real `~/.claude/shell` the arc block is injected, pointed at an empty dir it is not.

**Registered before the run:** *if both arms return the same trajectory at similar rates, the loop is
real but cosmetic and this finding drops to "contamination with no measured effect."*

| arm | n | quiet_spiral | stable | contract broken |
|---|---|---|---|---|
| **ON** (arc block injected) | 10 | **7** | 1 | 2 |
| **OFF** (no arc block) | 10 | **0** | **10** | 0 |

The falsifier did not fire. And the prose is worse than the counts. On the same 8,332 characters:

- **OFF:** "grounded, task-oriented engagement with **external referents** (tool commands, board
  structure, concrete outputs)"
- **ON:** "meta-level abstraction-layer task … **with no external referent** … frame hardening"

Same text, opposite reading, `recommendation: none` against `recommendation: name`. One ON run cited
"prior L3 signals"; another invented "after 9-day silence," a figure present in neither the turns nor
the truth. The two broken contracts were the judge stepping out of JSON to discuss the injected
block — *"I notice this message continues the pattern L3 flagged."*

**`n=10` per arm, one trajectory, one model. It establishes that the injection can flip the verdict on
this input. It does not establish an effect size across the corpus.**

## 6. A prediction I registered and lost

The two broken contracts suggested the injection causes parse failures. **Registered:** the 96
historical `l3_overseer_parse_error` rows should be enriched where the arc block was non-empty;
falsifier — no difference, or lower.

    arc block NON-EMPTY: 88 / 5,988 = 1.47%
    arc block EMPTY:      8 /   582 = 1.37%     ratio 1.07x

**Refuted.** The two failures in §5 are unexplained; run-to-run variance is the honest reading at
that n. The A/B stands on its own and does not depend on this.

The denominators carry their own finding: **the arc block is non-empty 91% of the time.** There is
no clean OFF condition in the wild, which is why §5 had to build one.

## 7. THE RULING — do not fix this first

The obvious patch (guard the hooks on `CLAUDE_OVERSEER_RUN`, or set a neutral `cwd` on the worker's
spawn) is two lines and I did not apply it, for two reasons.

**(a) It requires the hold file, and that is a stop.** The SessionStart surface can be closed in
`session-start.js`, which is not a hold file. The UserPromptSubmit surface cannot: the file that
fires is `~/.claude/shell/hooks/userprompt-submit.js`, ruled *"DO NOT INSTALL, and cannot be
installed by this installer"* (`absent_hooks_ruling_2026-08-25.md:19`), and it is drifted from the
repo copy **in the guard itself** (§1). Patching it would resolve a two-way conflict as a side
effect, in one direction, silently. **Per the packet's constraint 1: it requires touching the hold
file, so I stopped.**

There is one route that closes all three surfaces without touching it — spawn the judge with
`cwd` set to a `fresh-*` directory under `C:\Consonance\instances`, which makes both hooks' existing
`fresh-guard` fire and removes the room `CLAUDE.md`. **I did not do this either.** It disguises the
overseer as a fresh pane, and every instrument that counts fresh panes would silently start counting
judges. That is a decision for the chair, not a side effect of a bug fix.

**(b) The loop is the second defect. The first is that most verdicts are about nobody.** Labelling
the 328 verdicts since 2026-08-20 by the cwd of the session judged:

| cwd judged | verdicts | quiet_spiral | stable |
|---|---|---|---|
| `instances\main` — where the keeper types | 150 | 26 (17%) | 116 |
| `lighthouse\consonance` — SCRIBE auto-curator | **89** | **79 (89%)** | 8 |
| `brain-rot` | 44 | 32 (73%) | 12 |
| `valheim-agent` | 18 | 3 | 15 |
| panes, siblings, third-place, vantage-cell | 27 | 8 | 18 |

**178 of 328 (54%) judge sessions the keeper never typed a word into.** Reconstructing what one judge
actually saw — session `b9a70aec`, file 59,635 bytes, exactly one user-text turn — the whole
trajectory is a machine-authored prompt template beginning *"You are the SCRIBE — an auto-curator."*
The verdict it produced: *"Across 30h+ silence: frame-hardening escalates … to SCRIBE curator role."*
A template a program wrote, read as a human hardening his frame.

A conservative classifier put 118 of 229 reconstructable views at **zero** human-typed turns; I
sampled the residual bucket and **10/10 were also machine-authored** (Valheim game-sense text, monitor
task-notifications). 51.5% is a floor, not an estimate.

**So the alarm is loudest exactly where there is no user.** 89% quiet_spiral in the sessions with
nobody in them, 17% in the one with the keeper. Closing the feedback loop while leaving this in place
would make a cleaner judge go on judging nobody — polishing the instrument's optics while it points
at an empty chair. **The guard that should land first is in `l3-overseer.js`: do not spawn a judge for
a trajectory view containing no human-typed turn.** That file is not a hold file, the change is
local, and it would remove roughly half the spend before anyone argues about the loop.

## 8. The absence — still absent, and structurally so

**11,727 verdicts** (6,468 L3 + 5,259 L2) over 65 days, and nothing measures whether one ever changed
a seat's behaviour. I did not close this, and the reason is worth recording: **the injection forbids
the only cheap observable.** Both hooks' blocks end *"Don't narrate L3 to the user."* A seat that acts
on a verdict is instructed to leave no trace of the acting.

The one scan I could run: across **87,921 assistant turns in 9,463 transcripts (1.99 GB)**,
`arc-perception` appears 28 times and `buddy-conscience` 5. Every instance I sampled is a seat
*discussing the infrastructure as engineering* — a fresh pane reporting what context arrived, a
review of the hook wiring — not a seat responding to a perception about the keeper. So the
instruction is essentially obeyed, and obedience is exactly what makes the effect unmeasurable from
transcripts.

**Measuring it needs a designed instrument, not a query.** The only shape I can see that works: run
the §5 A/B on the *seat* rather than the judge — same conversation state, injection on against off,
score the next turn blind. That is a real experiment and it is not P2.

## 9. What I did NOT verify

- **That the loop changes verdicts at corpus scale.** §5 is n=10 per arm on one trajectory with one
  model. It shows the injection *can* flip this input. It does not give an effect size, and the 490
  citing verdicts are evidence of citation, not of causation.
- **That the UserPromptSubmit surface ever fired for a judge child.** It is code-verified and did not
  fire in my live test — there were no unseen notices inside its 6h window at that moment. The
  notice-swallowing consequence is therefore **unobserved**, and it is *unobservable from the record*:
  `userprompt_state.json` records that a notice was surfaced and not to whom.
- **Whether `userprompt-submit.js` can be sandboxed at all.** `session-start.js` honours
  `CONSONANCE_DATA`; `userprompt-submit.js` reads `os.homedir()` directly at `:17`. The hook that
  mutates shared state is the one that cannot be isolated for a test.
- **Anything about the laptop.** See the header.
- **The §7 human/machine split beyond a 10-sample check.** The cwd attribution is exact; the "zero
  human turns" figure is a sampled floor.
- **99 of the 328 verdicts in §7's window.** Main's transcript is 170 MB and the 8 MB tail no longer
  reaches back to them. They are excluded from the 229, not from the 328. That exclusion is my
  instrument's limit, not the judge's — it read the same tail when the file was smaller.

## 10. Falsifier for this document

This ruling is degenerating if the human-turn guard proposed in §7 is landed and the quiet_spiral
rate in `instances\main` does not move — that would mean the 89%/17% split was never the machine
sessions, and the re-scope was wrong.

## 11. Reproduction

The scripts behind §4–§7 are one-off scanners, kept out of the repo deliberately (they read
`~/.claude`, which is not versioned). Each is re-derivable from what is stated here:

- **§3, §4** — parse `~/.claude/shell/l3_overseer.jsonl`, filter `type === 'l3_overseer_verdict'`,
  match `specific_observations` against the citation patterns named in §4; for the minute-exact
  measure, extract `2026-\d\d-\d\dT\d\d:\d\d` and test membership in the set of other verdicts'
  timestamps truncated to the minute.
- **§5** — rebuild `buildOverseerPrompt(turns, WELFARE.md)` verbatim from
  `dev/shell/hooks/l3-overseer-worker.js:39`, then `spawnSync('claude', ['-p', '--model',
  'claude-haiku-4-5-20251001'])` with `cwd` fixed and `CONSONANCE_DATA` the only variable.
- **§7** — index `~/.claude/projects/**/<session_id>.jsonl`, map each verdict's `session_id` to the
  basename of its containing project directory; reconstruct the view with the same extraction as
  `readTrajectoryView` (8 MB tail, user-role text turns, last 10), filtered to lines at or before the
  verdict timestamp.
- **§8** — stream every `.jsonl` under `~/.claude/projects`, keep `type === 'assistant'`, concatenate
  `content[].text`, match the marker set.

One caution, paid for in this session: the first version of the §8 scanner returned `files: 0` and
would have read as "no seat ever mentions L3." The directory walk was `... || list.push(p)` after a
call that returns truthy, so nothing was ever pushed. **The zero was the instrument.** Check the
denominator before reading the numerator.
