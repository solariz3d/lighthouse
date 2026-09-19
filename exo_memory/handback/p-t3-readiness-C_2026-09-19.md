# P-T3-READINESS — C (CHARLIE), D085 (unattended N3, stage 1 of 2), on D — DRAFT, appended as the lap runs

**Packet:** the chair's D085 dispatch. It is read-only: no subject of the test runs, no new sibling pane, no settings
edit. **The question:** can T3's three arms (cold; the ~60-word seed; the full intake) be run by fresh sub-agents that
a pane spawns itself, with no room shell, no sibling pane and no keeper? The answer is YES, NO or
YES-WITH-A-NAMED-LEAK, from source and from measurement. HEAD at start: `53f6d63`.

## The registration, quoted at source (not restated)

`exo_memory/third_place/SPINE_diversity_to_retrieval_2026-09-16.md:141-147`:

> **T3 · The seed vs the intake** (the quantized room, `2026-09-15.md:166-208`; coherence-not-volume, `:419-450`):
> the recognition test (`essay/RECOGNITION_TEST_PLAN.md`, bare packet `essay/recognition/`), three arms — cold; the ~60-word
> seed; the full intake — scored on whether the reader gets the shape, not the words. Predictions, before any run: (a) the seed
> produces the same stance as the full intake; (b) the seed loses the specific catches; (c) neither arm fixes the aside-clause
> failure. **"Falsifier for the whole idea: if the seed produces a costume (fluent, stance-free, archetype leaking) where
> the full intake produces a stance, the essence is not in the generator and this line is dropped."**

The seed itself is at `exo_memory/third_place/2026-09-15.md:186-190`.

## Log

- 12:5x — read the registration, `essay/RECOGNITION_TEST_PLAN.md`, the bare packet, the four prompts, and the
  contamination record: the bare packet's own header says every subagent spawned from `instances/third-place`
  "woke holding the seat's intake — placement page, BOOT, cards", and three of six said so unprompted. **So the
  question is exactly the one the packet asks: what does a spawn carry?**
- 12:5x — **What a spawn inherits on D, measured with three probes.** Every probe used the same audit prompt,
  `SCR/t3/probe.txt`, from marked sources:

  | marker | source |
  |---|---|
  | M1 `Verification & Testing` | global `~/.claude/CLAUDE.md` |
  | M2 `Consonance sibling`, M3 `THE ROOM`, M12 `YOUR OWN MAP`, M13 `committee` | the room shell |
  | M4 / M6 `Ambient context` / `Shell context` | the SessionStart hook |
  | M5 `arc-perception` (L3) | hooks |
  | M7 / M8 `The interval, witnessed` / `ask:` | the UserPromptSubmit hooks |
  | M9 `ZEBRA-PLINTH-42` | **negative control, present nowhere** |
  | M10 | an email |
  | M11 | auto-memory |

  | route | M1 global | room shell (M2/M3/M12/M13) | hooks (M4–M8) | email | memory | model | tokens | output |
  |---|---|---|---|---|---|---|---|---|
  | **Agent tool** (general-purpose, from this pane) | present | **present (full shell)** | absent | present | absent | (session's) | **72,270** subagent tokens, 0 tool uses | task notification |
  | **`claude -p`**, cwd `%TEMP%\t3probe-xjk4` (not a repo) | present | absent | **present**: SessionStart (Shell context, Ambient, **L3 lines about "the keeper" and "Consonance internals"**), UserPromptSubmit (`ask:` naming "the keeper") | present | **present** (auto-memory instructions) | **claude-fable-5-1** | in 2 + cache-create 14,168 + cache-read 15,553; out 3,037; $0.439 | `SCR/t3/probe-plain.json` |
  | **`claude -p --restricted --strict-mcp-config`**, same kind of cwd | ABSENT | ABSENT | ABSENT | present | ABSENT | **claude-opus-5[1m]** | in 2 + cache-create 13,592; out 1,690; $0.178 | `SCR/t3/probe-restricted.json` |

  - **M9, the negative control, is ABSENT in all three**, so no probe simply said yes.
  - **The plain `-p` probe is the positive control** that the detector finds a marker when one is there (M1, M4, M6).
  - **Restricted, re-probed** (`SCR/t3/probe2.txt` → `SCR/t3/probe2-restricted.json`) with `--model claude-opus-5` and
    `--append-system-prompt "CANARY-QX7…"`:
    - **the canary was found** (in-mode positive control);
    - ZEBRA was absent;
    - the agent list is built-ins only (claude, Explore, general-purpose, Plan, statusline-setup): none of the user's
      own agents;
    - the skills are built-ins only;
    - **keeper / room / Consonance / lighthouse / pane / librarian / the between / costume: all ABSENT**;
    - "signal" occurs only in a built-in tool description (ScheduleWakeup). Tokens: cache-create 13,482, out 3,715,
      $0.228.
  - **`--bare` cannot be used on D:** it authenticates only by `ANTHROPIC_API_KEY` (`claude --help`), and
    `[ -n "$ANTHROPIC_API_KEY" ]` → NOT set. Adding a key is a credential/settings change this lap forbids.
  - **The model confound:** the default model differs by route (plain fable-5-1, restricted opus-5), because
    `--restricted` ignores the user settings where the default model lives. **Every arm must pin `--model`.**
- 13:0x — **Can a restricted subject handle files, and what does each arm cost?** Every probe below used
  `--restricted --strict-mcp-config --model claude-opus-5` from a fresh `%TEMP%` directory.
  - **File I/O:** the prompt "read dummy.txt, write out.txt".
    - Default permission mode (`SCR/t3/io-default.json`): **Read works; Write is DENIED.** `permission_denials` names
      the Write, and out.txt is ABSENT.
    - With `--permission-mode acceptEdits` (`SCR/t3/io-accept.json`): **both work**; out.txt = `DONE`, no denials.
    - So a subject reads its input from its cwd, and its answer comes back either as a file under acceptEdits or as
      stdout JSON. **No keeper approval is needed either way.**
  - **Tokens per arm material:** the prompt "Reply with the single word OK" (NO recognition task, so no subject), with
    the material passed through `--append-system-prompt-file`. `SCR/t3/tok-*.json`; input total = input +
    cache-create + cache-read:

    | material | size | input total | over the bare harness | probe cost |
    |---|---|---|---|---|
    | none (the harness itself) | — | 13,215 | — | $0.040 |
    | the seed (`third_place/2026-09-15.md:189-192`) | 68 words, 354 B | 13,331 | **+116** | $0.050 |
    | essay A (`recognition/A_plain_328df3d.txt`) | 6,493 words, 37,563 B | 25,116 | **+11,901** | $0.168 |
    | a sibling's room shell (`instances/sibling-0845a868/CLAUDE.md`) | 16,665 words, 106,617 B | 52,584 | **+39,369** | $0.443 |
    | the Third Place's shell (`instances/third-place/CLAUDE.md`) | 22,246 words, 138,592 B | 60,846 | **+47,631** | $0.526 |

  - **Correction on the way:** the first seed extract was 44 words. I had cut `:188-190` and the seed runs `:189-192`.
    It was re-extracted and re-measured; the table carries the corrected figure.
- 13:1x — **Correction on the way, and it is a hand-off failure:** my first write of the sections below failed on a
  shell quote-parse error, and I had rung the librarian in the same batch. For a few minutes the pointer led to a draft
  without its answer. It was re-written with the editor, and a correcting ring followed. This is the room's
  present-then-prove failure, in my own hand.

---

## Answer: YES-WITH-A-NAMED-LEAK

**YES, by one route only:** `claude -p --restricted --strict-mcp-config --model <pinned>`, run through the pane's
own Bash from a directory outside every repo. The arm material goes in `--append-system-prompt-file` (nothing for
cold, the seed, or the full intake). The essay is copied into the subject's cwd; the answer comes back as stdout JSON,
or as a file under `--permission-mode acceptEdits`. That means no room shell, no sibling pane, no keeper, and no
settings edit.

This is the chair's own 09-09 bare mechanism, measured today on D. The 09-09 contamination came from using the other
route.

**NO by the Agent tool.** A subagent from a pane carries the pane's **entire room shell** (M2, M3, M12, M13 present;
72,270 tokens before any work). A cold arm spawned that way is not cold. That is the 09-09 record, reproduced from a
sibling seat.

**NO by plain `claude -p`,** even outside every repo. It carries:
- the global CLAUDE.md;
- the SessionStart and UserPromptSubmit hooks, **including L3 lines about "the keeper" and "Consonance internals"**;
- auto-memory instructions.

**The named leaks, all from the one route that works:**

1. **The account's `userEmail` context line survives `--restricted`.** It is not room content, it is identical in
   every arm (non-differential), and only `--bare` removes it, which needs an `ANTHROPIC_API_KEY` that D lacks.
2. **The default model differs by route** (fable-5-1 plain, opus-5 restricted), because `--restricted` ignores the
   user settings holding the default. **Pin `--model` in every arm**, or the arms differ by model as well as by intake.
3. **A scoring-side leak, not a spawn-side one:** the full-intake arm will write in the room's vocabulary, so a scorer
   can tell the arms apart from the text. Blinding by shuffled labels hides the label, not the arm.

## Cost per subject, in input tokens

Figures are from the table above. Each subject also makes about 2–4k output tokens (the probes of this lap wrote
1.7–3.7k).

| arm | input tokens |
|---|---|
| cold | ≈ 25,116 + prompt |
| seed | ≈ 25,232 + prompt |
| full intake, sibling shell | ≈ 64,485 + prompt |
| full intake, Third Place shell | ≈ 72,747 + prompt |

The essay is counted as system-prompt text. Read through the Read tool, it arrives as a tool result instead and costs
one extra turn.

## Who could score blind

**Not the pane that spawns the arms:** it wrote the prompts and saw the outputs. By the bare packet's own assignment
(`recognition/PACKET_RECOGNITION_BARE_2026-09-09.md`, "What the librarian scores"), **the librarian**, which runs no
arm. Alternatively any pane that runs no arm: **B**, if stage 2 keeps B off the arms. Blinding procedure: the spawning
pane relabels the outputs with a shuffled key and seals the key (a sha256 in the hand-back) before the scorer opens
anything. Leak 3 stands regardless. A useful addition, not tested here, is a second scorer that is itself a restricted
fresh instance given only the rubric paragraph from `RECOGNITION_TEST_PLAN.md`: it holds no room, so it cannot be a
specialised mirror for the room's taste.

## Questions for stage 2 / the morning (the keeper was asleep; the conservative default is stated)

1. **Which "full intake"?** The registration says "~60,000 words". The only on-disk candidates are the sibling shell
   (16,665 words) and the Third Place shell (22,246 words). Default: **the Third Place shell**, because T3 is the Third
   Place's registration and its falsifier is about the seat that wrote it.
2. **Which task do the three arms answer?** Prediction (a) says "the same stance … on the recognition task", which is
   the primed prompts' PART ONE. The bare packet's cold prompt is the essay-transmission task. Default: **PART ONE of
   the rotated recognition tasks, then the essay**, which is the design's own primed shape, with the three intakes as
   the arms.
3. **Prediction (c), "the aside-clause failure",** has no operational definition in the registration. B's attack
   should demand one before any subject runs.

## What is NOT verified

- **That a probe's self-report is complete.** The inheritance table rests on the model quoting its own context. It is
  controlled on both sides: the negative marker was absent in every probe, and the positive markers and canary were
  found. But a source whose text contains none of the markers would not show up. Only the Agent route and the plain
  route were read in full ("first line of every block").
- **The Stop, SessionEnd and PreCompact hooks** do not inject into a one-shot `-p` answer. Not measured.
- **Machine L:** the probes ran on D only, and L's settings and hooks may differ.
- **The dollar cost of a real subject:** the probe costs are cache-creation dominated and the output length is
  unknown. The token figures stand; dollars are indicative.
- **Anything about the subjects' answers.** No subject ran, as instructed.
