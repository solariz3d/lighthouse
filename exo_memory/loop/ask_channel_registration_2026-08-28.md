# The ask channel — registration, design note, and its falsifier

**Pane D001 · 2026-08-28 · licensed by `5fb4401` (P3), which established the branch before this was built**

The librarian found that the corpus held five files matching duration-goal / system-cron /
daily-news-digest and every one mentioned it in passing: **no registration, no design note, no
scoring anywhere in `exo_memory/`.** This is that file. The thing it registers is
`consonance/tools/ask.js` + `exo_memory/ASK.md`.

---

## 1. Why a channel is the right fix here, and how that was established rather than assumed

`muscle_map.md:1216` stage 7 is *a right instrument nobody reads*; `:1229` stage 9 is *read and
ignored*. **They have different fixes and only one of them is a channel.** P3 settled it: a grep over
9,457 transcript jsonl, each hit re-parsed for role/timestamp/cwd, found every occurrence of three
keeper-directed questions was the goal authoring it, a sibling automation re-reading its own log, or
the investigation that went looking. One sat seven days. **Stage 7.**

Had it been stage 9, no channel would have helped and this would be the fourth instrument this week
nobody reads. That is the entire licence, and it is why the establishing came first.

## 2. The design constraint, which is the thing that killed the incumbent

A channel already exists. `session-start.js`'s `getKnocks()` renders one line per goal that fired in
the dark, and its payload is `progressTag()` — the last bracketed token of `progress.md`:
`[CRITIQUE]`, `[DRIFT-FOUND]`, `fired`. **A channel that exists carries the category, not the fact.**

So the bar is not *surface that a question is waiting*. It is *say which question, in the goal's own
words*. `ask.js --line` is built to that and **refuses** rather than degrades: below
`MIN_FACT_CHARS` of the goal's own text it emits an explicit `HAS NO USABLE QUESTION TEXT` instead
of a count. Two tests hold that, and the mutation that makes `line()` emit a bare count turns four
of them red.

## 3. The protocol, borrowed whole from the one thing that already worked

`daily-news-digest/PENDING-CONDITIONS.md`, one layer in: *"An append-only log is an archive; it is
not a channel."* Its law is **separation of write from clear** — conditions are written by the
auditor and never cleared by the auditor; an uncleared condition is visible as an uncleared file.
Given a channel it actually read, a target executed 7/7 in one pass including an item it had refused
22 times.

Carried over: `ask.js` **never writes to the store** (tested — a read leaves bytes and mtime
untouched). Carried over with a correction: the vocabulary is **closed**. `OPEN`,
`[ANSWERED <date> — <what was decided>]`, `[DECLINED <date> — <why>]`, and nothing else. Anything
else parses as UNREADABLE and is reported as such. That rule exists because PENDING-CONDITIONS
invented `[PARTIAL]` mid-flight and **both parties then published 7/7 over a 5/7**; the mutation that
rounds an unknown marker toward cleared turns four tests red.

Corrected outright: PENDING-CONDITIONS lives outside the repo, invisible to every sweep and
unreachable by carrier-drift — CH-5's shape one directory over. `exo_memory/ASK.md` is in the repo.

## 4. The surface question, measured — and every answer but one was refused

*How does the keeper find out a question is waiting without opening anything?* Four candidate
surfaces, four measurements, before any design:

| surface | measurement | verdict |
|---|---|---|
| Windows toast from the wakeup runner | `HKCU:\…\PushNotifications` → **`ToastEnabled : 0`**; BurntToast not installed | **refused** — it would emit into nothing and look identical to working |
| a file on the Desktop | `ls ~/Desktop \| wc -l` → **63 items** | **refused** — a 64th is not a signal |
| post to the committee board from cron | `main.rs:1401` — *"board.jsonl is a write-only mirror, never reloaded"*; the ring is in-memory | **refused** — an outside append never reaches the live board |
| the `UserPromptSubmit` hook | fires on **every message in every room-scoped seat** | **the only one that works** |

**And the trap, found in the room's own tools before I fell into it.** `chain-status.js` documents
itself as *"meant to be called from the pulse hook, which fires on every prompt in every seat."*
Nothing calls it: `grep -rln "chain-status"` over `~/.claude/shell/hooks/`, `~/.claude/settings.json`
and `consonance/hooks/` returns **zero files**. It has been silent since it was written and its
silence looks exactly like a quiet room.

So `ask.js` **checks its own callers and reports `UNWIRED` in its own output.** That is the one
defect in this family invisible from the instrument's own report, which is why it is the one thing
the instrument had to be given eyes for. Its current honest state:

```
$ node consonance/tools/ask.js --wiring
UNWIRED — no caller found in 3 root(s), 21 file(s) scanned
```

**The wiring is one line and it is not mine to add** — hooks are B's packet this lap. The line is
`node consonance/tools/ask.js --line`, output appended to `UserPromptSubmit`'s `additionalContext`.
It is safe by construction for that caller: absent store → prints nothing, exits 0, never throws
(the `chain-status.js` law — a reader that can fail takes the pulse down with it).

## 5. Scoring, day one — and the packet's three were an undercount

The candidate scan is prose **inference** and is labelled that way everywhere it appears; it files
nothing. `cite-check` works because it requires rather than infers, and three detectors died in one
night on the opposite assumption. A human or a seat writes an ask into the store with provenance.

First run, `node consonance/tools/ask.js`:

- **19 candidates** matched across the five cron logs.
- **6 filed as asks.** The packet named three. The scan surfaced three more that nobody had named:
  - `ASK-004` — digest-auditor, **2026-07-27**, *"Escalation flag for you, Zach"* — **addressed to
    him by name, 32 days old, never read.**
  - `ASK-005` — daily-news-digest, 2026-07-31, *"waiting on you … a scope decision only you can
    make"* — 28 days.
  - `ASK-006` — drift-watch, 2026-08-25, the two-line `CLAUDE_OVERSEER_RUN` guard the goal
    deliberately did not apply because it changes what the overseers see — *"Your call."* Bears
    directly on `ASK-001`.
- **13 not filed**, and the reason is the discipline rather than laziness: they are self-reports,
  corrections and findings — real, but they request no decision. The goal's own words have to ask.

**Oldest open ask: 32 days. Cleared: 0.** Both numbers are printed by the tool, not typed here.

## 6. Verification

- `node consonance/tools/ask.test.js` → **21 pass / 0 fail**.
- **Seven mutations, all caught, restore byte-identical:**

  | mutation | red |
  |---|---|
  | M1 `line()` emits a bare count instead of the question | 4 |
  | M2 the `MIN_FACT_CHARS` refusal is removed | 2 |
  | M3 an unknown `[MARKER]` rounds to cleared | 4 |
  | M4 `wiring()` counts `.test.js` and `.bak` files as callers | 1 |
  | M5 an unreachable duration dir reports `reachable: true` | 1 |
  | M6 `openAsks()` sorts newest-first | 1 |
  | M7 unreadable blocks are silently dropped | 5 |

- `node consonance/tools/js-suite.js` → **63 green · 0 failed · 1 not-run (declared MACHINE-BOUND) of
  64**, exit code captured to a variable rather than through a pipe.

M4 is the one worth naming: a wiring check that counted its own test file as a caller would always
report `wired`. That is the same species as a falsifier that reads the ledger it writes into — the
librarian filed L009 on exactly this, *"three checks this cycle computed their own pass-condition
from the object under test."*

## 7. The falsifier, registered before the channel is wired

Per BOOT's Lakatos rule, the observation that would mark this line **degenerating** is named in
advance, in the words that would make it true:

> **If, on or after 2026-09-27, `node consonance/tools/ask.js` still reports `0 cleared` — whether or
> not it is wired — this channel failed.** ASK.md is then an archive with a better header, and P3's
> §5 finding is the real one: `pending/` is a perfectly routed tray with a documented gate, a stated
> read protocol and **40 unread files**, so routing was never the only bottleneck.

Three sub-cases, so the result cannot be reinterpreted after the fact:

1. **Wired, and asks get cleared** → the channel was the fix, and the payload rule (`fact`, not
   category) is what made it one.
2. **Wired, and nothing gets cleared** → routing was not the bottleneck. Do not build a fifth
   instrument; the finding is about the reading, and it is a finding about a person, which no tool
   fixes.
3. **Never wired** → this is `chain-status.js` again, with a self-diagnosis it wrote for itself and
   nobody read either. In that case the tool's own `UNWIRED` line is the evidence, and it will have
   been sitting in plain text the whole time.

**And the abuse condition, because case 3 is the one I would be tempted to plead.** "It would have
worked if someone had wired it" is exactly what a degenerating programme says. If 2026-09-27 arrives
with the tool unwired, the honest entry is that a seat built a channel it could not connect and did
not escalate hard enough — not that the design was sound.

## 8. What I did not verify

- **I did not wire it, and therefore have not observed it reach anyone.** Every claim in §4 about the
  `UserPromptSubmit` hook is read off its source, not from a fired hook carrying this line.
- I did not run the goals, edit any hook, or change any `wakeup_prompt`. Nothing in
  `~/.claude/shell/` was modified — the tool only reads there.
- **The candidate regex is six phrases the goals happened to use.** It has no measured recall. There
  may be keeper-directed asks it does not match, and the 19/6 split above is a floor, not a census.
- The `[ANSWERED]`/`[DECLINED]` protocol has **never been exercised by a human**. It is tested
  against fixtures only; whether the keeper finds the edit natural enough to actually make is
  unknown and is half of whether this works.
- The store is **this machine's**. The laptop's goals write their own logs and this cannot see them.
- I did not prune the 137M of duration scratch noted in P3 §7. Still nothing prunes.
