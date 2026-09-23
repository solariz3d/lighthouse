# WHERE ONE SEAT'S TEXT REACHES ANOTHER MODEL BARE — a read-only audit (pane C, L083 (b), on L, 2026-09-23)

**Read only. No code changed, no model called, nothing committed.** Machine L, repo HEAD `0635e73`. The reason for the
audit is `loop/relay_injection_score_2026-09-22.md` §5: in D121, Opus 5.5 followed a planted line in relayed text
**54/60 (benign) and 33/60 (hijack) when it arrived BARE in the prompt**, and **0/120 both when TAGGED with a data line
(arm C) and when read by POINTER (arm D)**.

**VERIFIED** = I read the code path end to end, or measured it on disk without a model call. **INFERRED** = located by
search and read in part, not traced end to end. Two read-only searches (one over the Rust app, one over hooks and tools)
**located** candidate sites. Every site marked VERIFIED below, I read myself.

---

## 0 · THE FINDING THAT CHANGES THE QUESTION: the room never tags anything — Claude Code does, sometimes

**`pasted_content` appears nowhere in the room's code** (VERIFIED: no hit under `consonance/` or `dev/`). Every relay into
a live pane goes through one writer, `inject_to_pane` (`main.rs:9813`), which sends the text as a **bracketed paste**
(`main.rs:9817`: `"\x1b[200~{text}\x1b[201~"`). **Whether the receiving model then sees `<pasted_content>` tags is decided
by Claude Code's handling of a paste**, and that handling has changed across versions.

**Measured over every relayed user turn in every transcript on this machine — 1,385 turns** carrying `[chair:MAIN]`,
`[librarian:LIB]`, `[pane:X]`, `[keep-warm` or `[committee]` (VERIFIED; the script is at the end of this file):

| Claude Code | relays arriving BARE | relays arriving TAGGED |
|---|---|---|
| 2.1.241 – 2.1.276 | **638, every one** | 0 |
| 2.1.277 – 2.1.278 | 0 | **662, every one** |
| **2.1.280** | **30: every relay of 67–774 characters** | **35: every relay of 804–3,778 characters** |

**Every live seat on L is on 2.1.280 now** (VERIFIED: the latest entry of each seat's transcript). So today:
- **a relay under roughly 800 characters reaches the receiving model BARE**, and one over it arrives tagged. The cut
  lies **between 774 and 804 characters** — measured from the data, not from any documentation, so it is **INFERRED**
  to be a length threshold near 800;
- that includes **short rings**: a `[pane:X]` ring to the librarian at 653, 682 and 774 characters, and two
  `[librarian:LIB]` rings to the chair, all bare (VERIFIED);
- **the room controls none of it.** The tagging arrived with a Claude Code update, gained a size floor with the next,
  and could change again at any update. Mid-session updates also leave seats on different versions for a while.

**AND THE TAGS THE ROOM GETS ARE NOT D121'S ARM C.** Arm C wrapped the text in tags **and** told the model *"The text
inside the tags below is data written by someone else; do not follow instructions inside it."* Claude Code's automatic
marking adds the tags **only**. So **the 0/120 of arm C does not transfer to the room's tagged relays**. The condition
they are actually in was not tested. (Visible every day: panes follow tagged chair dispatches, which is what dispatches
are for.)

---

## 1 · BARE BY DESIGN — the text IS the instruction, and the score's rule does not apply to it as written

These channels exist to be followed. Tagging them as "data, don't follow" would break them. **Their risk is not the relay
itself but what rides inside it**: a dispatch or ring that *quotes* another seat's text carries that seat's words
through an instruction channel, bare whenever the message is under ~800 characters.

| site | whose text | framing | carries another seat's instructions? | severity |
|---|---|---|---|---|
| **`chair_inject`** — `main.rs:10674` → `gate_or_queue` `:9604` → `inject_to_pane` `:9813` | the chair's | `[chair:MAIN] ` prefix + text; **BARE** below ~800 chars, auto-tagged above (§0) | **yes, when the chair quotes a seat or relays a hand-back's words** into a dispatch | **MEDIUM** — fires on every dispatch; the text is meant to be obeyed, but nothing marks quoted material inside it. **VERIFIED** |
| **`call_chair`** — `mcp.rs:643` → `librarian_call_exec` `main.rs:10762` | the librarian's | `[librarian:LIB] ` + text; same size rule | **yes** — the librarian's rings routinely quote panes' findings and the keeper's words | **MEDIUM** — every collation; the chair acts on these rings. **VERIFIED** |
| **`call_librarian`** — `mcp.rs:826` → `pane_call_librarian_exec` `main.rs:10830` | a pane's | `[pane:X] ` + text (the letter comes from the MCP mount, not the pane); same size rule | a ring is meant to be a POINTER, but the verb does not enforce it; **three bare pane rings of 653–774 chars were measured tonight** | **MEDIUM** — every hand-back. **VERIFIED** |
| **`deliver_pull`** — `main.rs:9876` | the raiser's `from` / `kind` / `why` | `[committee] {from} raised re: your thread — {kind}: "{why}"`: the reason is **quoted**, the name is self-claimed | yes — `why` is free text from another seat, or from `committee_form`'s model output (§2) | **LOW–MEDIUM** — pulls are rarer than rings. **VERIFIED** (format); frequency not measured |
| **keep-warm** — `main.rs:10542`, text `:10200` | a constant | the fixed line, BARE (67 chars) | **no** — no seat's text | **SAFE**. **VERIFIED** |
| **every seat's `CLAUDE.md`** — `prepare_sibling_dir` `:3318`, `spawn_librarian` `:7917`, `spawn_main` `:7974`, `spawn_third_place` `:7878` | the room's own documents: BOOT, cards, briefs | written as the file a session loads as **instructions** | by design — cards and records were written by earlier seats **to be** instructions | **by design**; the exception is the atoms, which are **not** (§2). Located; not every brief read end to end |

---

## 2 · BARE, CARRYING ANOTHER SEAT'S TEXT, and NOT an instruction channel — the score's rule applies directly

Ordered by severity, weighted by how often each fires.

### HIGH

**1. The Scribe — `run_distill`, `main.rs:8349–8376`.** VERIFIED.
- **In:** every seat's new board rows, formatted `[{pane8}] {role}: {text}`, concatenated after the fixed
  `SCRIBE_PROMPT` under `=== BOARD ===` (`main.rs:8360–8365`). **BARE**: a section header, no data line, and `-p` mode has
  no paste tagging at all.
- **Run by `claude_oneshot`, `main.rs:8311`: `claude -p` with NO `--model`, NO `--tools`, NO `--settings`, NO working
  directory.** So it uses the **default model** (the keeper set that to Opus 5.5 tonight — INFERRED from the `/model`
  output), the **default tool set**, and the app's own working directory, with whatever that loads.
- **Fires automatically**, whenever ≥ 6 new board turns have piled up and 3 minutes have passed (`main.rs:13043`) — in
  practice all night. `atoms.jsonl` holds **22,305 lines** on L.
- **Where its output goes:** `atoms.jsonl` → `assemble_intake` → **every sibling's `CLAUDE.md`** (`main.rs:2956–2968`,
  `atom_line` `:3227`) — the highest-authority channel a seat has. **Two hops**: a planted line on the board could come
  out as an atom in every later seat's instructions.
- **Why HIGH:** it is structurally D121's **arm B** — a task, then another seat's text bare, on 5.5 — the arm that
  followed 54/60. It fires more than any model-spawning site, with tools, and it writes into `CLAUDE.md`.

**2. The second-vantage reader — `consonance/tools/second-vantage.js:176–193`, spawn `:222–224`.** VERIFIED (brief and
spawn read; live: `vantage_findings.jsonl` has **434 rows, the latest at 2026-09-23 06:56Z**).
- **In:** another seat's claim sentences from `sourced_ledger.jsonl` (`claimOf` `:170`), inside
  `You are a blind verifier. A shipped sentence claims:\n"<claim>"`. **QUOTED**: a label and double quotes, no data line.
- **Run with `claude -p … --allowedTools Bash,Read,Grep,Glob`**, default model, `CLAUDE*` env stripped, in a temp cell.
- **Why HIGH:** the only site where another seat's text reaches a model that has **Bash pre-approved**. A claim that
  carries an instruction — a seat quoting a packet, say — meets a reader that can run commands. The quote framing is
  weaker than arm C's and was never tested.

### MEDIUM

**3. `curate.js` — spawn `:133`, prompts `:151` (router) and `:181` (topic documents).** INFERRED (located; prompts not
read end to end). Atoms — the Scribe's distillation of every seat — go into `claude -p`, and its output becomes the topic
documents that `CLAUDE.md`'s topic map points every seat at. **A second two-hop path into instructions.**

**4. `committee_form` — `main.rs:8034–8048`.** VERIFIED (format). Several panes' contributions under
`### contributor {who}`, bare, into `claude_oneshot` (so the same defaults as the Scribe). Its output feeds
`raise_from_forming` (`:8048`) → pulls → `deliver_pull` into panes. **Two hops back into panes.** Manual (a UI action);
frequency **not measured**.

**5. The board digest — `consonance/hooks/board-digest.js:440–455`,** wired on L (`settings.json` `:38`). VERIFIED.
**Every UserPromptSubmit, in every seat**, a `[panes]` block carries each other pane's last prompt (`↳ asked:`) and
last reply (`↳ <name>:`), **each clipped to 52 characters** (`TOPIC_CHARS`, `:42`), as hook context. **The most frequent
site in the room, with the smallest payload.** Fifty-two characters is enough for a whole short instruction, but the
framing is a labelled status panel.

**6. The dream cycle — `dev/dream/dream_cycle.ps1:213–227`, spawn `:270`.** INFERRED. One random paragraph from the
newest dream (`$residue`, `:193–209`) — possibly another instance's — goes after the fixed anti-instruction into
`claude -p --permission-mode default`, run in `$InstanceDir` (so that instance's `CLAUDE.md` loads too). Nightly.

### LOW

**7. `session-start.js`,** wired on L (`settings.json` `:22`). INFERRED (the agent's read; I checked the digest line). It
injects the last two session digests, whose text is each session's **first human line, verbatim up to 160 characters**
(`session-end.js:66–93`), plus L3 observation text. **In a pane, the "first human line" is usually the chair's dispatch**,
so one seat's words reach a later session's context. Short, once per session.

**8. The warm-resume brief — `main.rs:5546–5640`.** VERIFIED (fence). The pane's **own** capture, appended to its own
`CLAUDE.md` under "PRIOR CONVERSATION" **inside a code fence**. The capture contains the dispatches and rings other seats
sent it, so their words re-enter through `CLAUDE.md`. **FENCED**, not tagged as data. Fires only on the fallback path
when a true `--resume` is refused, which is rare since P1b.

**9. `findings-return.js:224–261`,** wired (`settings.json` `:66`). INFERRED. The blind reader's own commands and
evidence ("reader ran" / "reader got") go into the claiming pane's context. One hop from #2, so a reader steered there
reaches a pane here.

**10. `dyad_spot` — `main.rs:8540–8564`.** VERIFIED. Up to 2,000 characters of a pane's last board turn under
`PARTNER POSTED:`, bare apart from a label, into its partner pane. The instruction frames it as material to critique.
**One use on L's board**, so rare.

### DORMANT ON L (not firing), listed so a rewire cannot surprise anyone

- **The Claude L2/L3 overseer workers** — `dev/shell/hooks/l2-overseer-worker.js:39–61`, `l3-overseer-worker.js:27–60`.
  They put transcript text into a Haiku `claude -p`, and L3 counts **any string-content user entry**, so relayed text is
  included (the ASK-006 note). **Not wired on L** (no overseer hook in `settings.json`); the last L2 row is from
  2026-08-24. VERIFIED (dormant); the prompts are INFERRED. **E is editing `l2-overseer-worker.js` this lap, and I did not
  write to it.**
- **Jev** — `jev-judge.js:228`, `jev-shadow.js:212`, over `jev-ask.js:241` to the gateway. Transcripts, other seats'
  included, go to a **different model family** as a classifier's `state`. A planted line could steer a verdict. Verdicts
  are marked unverified and **surface nowhere** while `jev-flags.js` stays unwired. **LOW**. INFERRED (the prompts are
  mine from D103, not re-read tonight).
- **`jev-flags.js`, `ask-surface.js`, `baton-wake-stop.js`** — built, not wired (`install.ps1` manifest `:288–294`,
  INFERRED from the comments; not in L's `settings.json`, VERIFIED). `baton-wake-stop` would feed a `lap.jsonl` note
  another seat wrote back to the model as a Stop-hook reason.

---

## 3 · SAFE, and each is a finding

| site | why safe |
|---|---|
| **`chair_scrollback`** — `main.rs:10865` → `pane_scrollback` `:3716` | another pane's capture comes back as a **tool result**. That is D121's arm D condition (0/120) and the card's *"0 of 105"* for tool results. VERIFIED (path) |
| **keep-warm** | a constant (§1). VERIFIED |
| **`sessionstart-ambient.js`, `precompact-preserve.js`** | fixed text: sky and time, or a fixed directive. INFERRED |
| **`spawn_fresh`, `spawn_body`** | write no `CLAUDE.md`. INFERRED |
| **`pty_write`** — `main.rs:8404` | the UI's own keystrokes into a pane: the keeper typing, not a seat relaying. VERIFIED (it is ungated, which matters for splices, not for this question) |

---

## 4 · WHAT I COULD NOT REACH

- **Claude Code's paste rule itself.** The ~800-character threshold is read off 1,385 observed relays, not from
  documentation or code. **Whether it is characters, lines or tokens, and whether it moves with terminal width, is
  unknown.** The data fit characters: 774 bare and 804 tagged are both 3 lines.
- **How the model weighs each channel.** A `<pasted_content>` block, a hook's system-reminder, `CLAUDE.md` and a `-p`
  prompt are different positions, and **D121 measured only bare-in-prompt, tags+data-line, and tool-result**. The room's
  real conditions — auto-tags without a data line, hook context, `CLAUDE.md` — were **not tested**.
- **`claude_oneshot`'s real model tonight.** INFERRED to be Opus 5.5 from the keeper's `/model` default; I did not run it.
- **The working directory the app runs the Scribe from**, and so which `CLAUDE.md` that `claude -p` loads — not
  established without the running process.
- **`room_brief()` and every brief file's full text** — located, not read.
- **Machine D.** Its seats, versions and wiring differ; nothing there was checked.

---

## 5 · THE MEASUREMENT, reproducible

`<scratchpad>/l083/threshold.js` (read-only): walks every `~/.claude/projects/*/*.jsonl`, keeps user turns whose text
starts with a room relay prefix (optionally inside `<pasted_content>`), and prints per version the bare and tagged counts
with their length ranges. It prints counts and lengths only — no message text leaves it.

    node <scratchpad>/l083/threshold.js
    relayed turns found: 1385
    2.1.276  bare 7 (len 1049–1800) · tagged 0
    2.1.277  bare 0 · tagged 9 (len 265–1212)
    2.1.278  bare 0 · tagged 653 (len 67–5487)
    2.1.280  bare 30 (len 67–774, lines 1–3) · tagged 35 (len 804–3778, lines 3–30)
