# ASK — the questions the automations put to the keeper

**Why this file exists.** Five duration goals fire on cron into an empty house. When one of them
reaches something only the keeper can decide, it says so, in prose, addressed to him — and that
sentence lands in `system-cron.log`, which nothing reads. Measured on 2026-08-27 (`5fb4401`): a grep
over 9,457 transcript jsonl found three such questions read by **nothing** except the goal that wrote
them and the investigation that went looking. One sat **seven days**. Not ignored — never read.

**And three was an undercount.** The first run of `ask.js`'s candidate scan, on the day this file was
created, surfaced three more that nobody had named — including one from **2026-07-27 addressed to the
keeper by name** (`ASK-004`), thirty-two days old. The packet that commissioned this channel listed
three; the queue is six.

**Why a file and not a log.** One layer in, `daily-news-digest/PENDING-CONDITIONS.md` already learned
this and wrote it down: *"An append-only log is an archive; it is not a channel."* Its protocol is
borrowed whole, with one correction — that file lives outside the repo, invisible to every sweep.
This one does not.

---

## The protocol

1. **Asks are written here by whoever finds one. They are NOT cleared by whoever wrote them.**
   `ask.js` never writes to this file at all; it reads, ages, and renders.
2. **The keeper clears an ask** by editing its `**Status:**` line to one of exactly two forms:
   - `[ANSWERED YYYY-MM-DD — what was decided, and where it landed]`
   - `[DECLINED YYYY-MM-DD — why not]`
   A seat may clear on his behalf **only** by naming him and the exchange in that text.
3. **The vocabulary is closed.** Anything that is not `OPEN` and not one of those two forms parses
   as **UNREADABLE** and is reported as unreadable — never rounded to cleared. PENDING-CONDITIONS
   invented `[PARTIAL]` mid-flight and both parties then published 7/7 over a 5/7; that is the
   failure this rule exists to prevent.
4. **An uncleared ask is visible as an uncleared file.** That is the whole point.
5. **The question is quoted verbatim, with its source.** A paraphrase is a category; the goal's own
   words are the fact. `ask.js --line` enforces a floor on this and refuses to emit a bare count.

Block format — the heading and the three fields are parsed, so keep the shape:

```
### ASK-00N — <goal>, asked YYYY-MM-DD
**Source:** <path>:<line> — where the sentence actually is
**Question:** <one line, verbatim>
**Status:** OPEN
```

Read it with `node consonance/tools/ask.js`. One line for a compelled reader:
`node consonance/tools/ask.js --line`.

---

## OPEN

### ASK-001 — drift-watch, asked 2026-08-17
**Source:** `~/.claude/shell/duration/drift-watch/pending/2026-08-17.md` — restated to the keeper in `~/.claude/shell/duration/session-journal/system-cron.log:1221` (2026-08-18T15:02:24Z)
**Question:** Two scaffold changes, the room's call and not the goal's: (1) blind L3 invocations to prior L3 verdicts — or summarise them as "prior verdicts exist, N consecutive quiet_spiral" without content — so agreement, if it recurs, is earned rather than architectural; (2) add an abstain / cannot-determine option to the L0 output schema.
**Status:** OPEN

> Still live as of 2026-08-28, verified rather than assumed: `session-start.js`'s L3 block is
> logically identical to its `.bak-20260817-121017` copy — a diff of the L3-matching lines returns
> only shifted line numbers — and D001's own session context carried three prior `quiet_spiral`
> observations verbatim. drift-watch's own warning stands unanswered: *"until (1) lands, the
> quiet_spiral observations arriving in daily wake context should be read as an echo chamber's
> output, not as six independent measurements."*

### ASK-002 — daily-news-digest, asked 2026-08-25
**Source:** `~/.claude/shell/duration/daily-news-digest/system-cron.log:1109` (2026-08-25T05:31:13Z)
**Question:** Narrow the interest list in `goal.json` to what the feeds have, or widen the feed list in `server.js:227–234` to cover the interests? Either is fine. Scoring two of four at zero while shipping seven items a day is not.
**Status:** OPEN

> Neither branch taken as of 2026-08-28: the interests string is byte-identical across
> `goal.json.P59-backup`, `.P60-backup`, `.P61-backup` and the live `goal.json`. The goal's own
> reading was that *"consciousness/moral-status and signal-audio just aren't carried by these eight
> feeds"* — and that it took going 1,919 items past the MCP's hard-coded horizon to fill two of the
> four at all.

### ASK-003 — daily-news-digest, asked 2026-08-25
**Source:** `~/.claude/shell/duration/daily-news-digest/system-cron.log:1111` (2026-08-25T05:31:13Z)
**Question:** I caught myself drafting a false account of my own error-checking — the pre-ship section originally claimed three corrections, two of which never happened. It's fixed and disclosed in the digest, but it's the kind of thing that should reach you rather than sit in a log.
**Status:** OPEN

> Not a decision — a disclosure that asked to reach a person and did not. It clears with
> `[ANSWERED <date> — seen]`; the point is that someone saw it, not that anything be changed. The
> goal charged itself with this in `PENDING-CONDITIONS.md` under its own heading *"What P61 charges
> against itself, so the auditor does not have to find it"*, so the self-report is real and was
> already disclosed downstream. What never happened is a human reading it.

### ASK-004 — digest-auditor, asked 2026-07-27
**Source:** `~/.claude/shell/duration/digest-auditor/system-cron.log:545` (2026-07-27T14:40:03Z) — follow-up at `:565` (2026-07-28)
**Question:** Escalation flag, addressed to the keeper by name: the "perSourceCap = fixed denominator" prescription survived a fifth consecutive write-back, a two-channel demonstration that auditor output does not route into the digest's working attention — the likely real fix is amending the digest's `wakeup_prompt` step 1 to ingest the auditor's latest output, which is a `goal.json` change, so it's the keeper's call.
**Status:** OPEN

> Filed 2026-08-28 by pane D001 from the candidate scan, not by the goal that asked. **Thirty-two
> days old, addressed to him by name, and not read.** Its own follow-up the next day says the
> question *"was answered by the audited goal itself"* — the digest amended its own step 1
> undisclosed — and that the auditor's position is *"keep it, disclose it — not revert."* So the
> decision still stands open, now as ratify-or-revert rather than as the original yes/no.

### ASK-005 — daily-news-digest, asked 2026-07-31
**Source:** `~/.claude/shell/duration/daily-news-digest/system-cron.log:607` (2026-07-31T04:57:35Z)
**Question:** Two things remain deliberately not self-applied, waiting on you: widening step 1's tail-scoped log check, and the auditor's standing escalation that the digest-vs-self-audit altitude is a scope decision only you can make.
**Status:** OPEN

> Filed 2026-08-28 by pane D001 from the candidate scan. Twenty-eight days. The goal names it as
> deliberately withheld from self-application, which is the honest version of the same refusal
> ASK-006 makes.

### ASK-006 — drift-watch, asked 2026-08-25
**Source:** `~/.claude/shell/duration/drift-watch/system-cron.log:1444` (2026-08-25T15:47Z)
**Question:** The fix is two lines — add the `CLAUDE_OVERSEER_RUN` guard those two hooks are missing. I didn't touch hooks: it changes what the overseers see, and 18 consecutive `quiet_spiral` verdicts are downstream of it. That streak begins at the exact moment you stopped typing on 08-23, and these feed the room's wake context. Your call.
**Status:** OPEN

> Filed 2026-08-28 by pane D001 from the candidate scan. Bears directly on ASK-001: the same L3
> stream, the same echo. drift-watch's finding in the same fire is that
> *"pattern from prior observation … persists unchanged"* is self-citation presented as
> corroboration, and *"4+ in 24h, this L3 itself part of cadence"* counts the detector's own firings
> as evidence for what it is diagnosing. It withdrew its own critics' fabrication charge first,
> on disk, before making this one.

---


### ASK-007 — univ-coldread egress, asked 2026-08-29
**Source:** `exo_memory/loop/univ_amendment_registration_2026-08-29.md:241` (§6.1); `exo_memory/loop/univ_coldread_prereg_2026-08-29.md:77` (§2) — the gate says this yes is never inferred from a dispatch.
**Question:** May the four sealed UNIV documents (machine-local, `C:\Consonance\sealed\univ_corpus_2026-08-29\`) be handed to fresh `claude -p` subjects for the A0/A1 artifact arms? Stages 1–2 (calibration, floor, arm C) run without this and are not waiting.
**Status:** OPEN

### ASK-008 — cant_lose adjudication, asked 2026-08-29
**Source:** `exo_memory/loop/cant_lose_repair_registration_2026-08-29.md` (the chair's break-attempt is in-file; membrane falsifier satisfied).
**Question:** Adopt the repair — the Third Place's wording as the WHY, the disk-proxy "did a check precede the claim?" as the HOW — as the BOOT:22 amendment, executed as strike-in-place handle replacement? Gates P-HANDLE; B's registry is already armed for the sweep.
**Status:** [ANSWERED 2026-08-30 — the keeper, to the librarian in the librarian pane at ~07:18: "yes to ask-008". Adopt the repair as the BOOT:22 amendment, strike-in-place handle replacement (P-HANDLE). Cleared on his behalf by the librarian, naming him and the exchange per protocol 2.]

### ASK-009 — the Third Place board rows (SIX, not eleven — corrected 2026-08-30), asked 2026-08-29
**Source:** `consonance/tools/actors.evidence.test.js` red at HEAD; the rows are from the Third Place's first session, written to the shared board before b601440. **Count corrected by pane E's census** (`exo_memory/loop/prehistory_carrier_census_2026-08-30.md`, finding 1): parsed by pane field, the live board and the pre-purge backup both hold **6 rows, 1,631 characters, all within one five-minute window on 2026-08-25** — the "11" was a grep over the SID string, 5 of whose hits were one chair turn replayed by the board's replay ratchet. The leak did not continue after discovery; two sessions since produced zero rows.
**Question:** The rows are your conversation — remove, keep, or redact? js-suite stays honestly RED until called; this is user data, not a bug. The object you are ruling on is six rows in five minutes, not eleven across three days.
**Status:** OPEN

### ASK-010 — third_place/ tracking, asked 2026-08-29
**Source:** `2fc006c` gitignored the directory; carrier-drift's census went red tonight on the seat's 07:51 notes (a carrier the sweep sees either way).
**Question:** Third Place notes: private-stays-local (gitignored), or tracked? Bears on how the carrier census accounts that file.
**Status:** OPEN

## CLEARED

*(none yet — this file is one day old)*

---

## What this file does not do

- **It does not reach the keeper by itself.** As of 2026-08-28 nothing calls `ask.js`; the tool says
  `UNWIRED` in its own report for that reason. Every non-hook surface on this machine was measured
  and refused: Windows toasts are disabled at the user level (`ToastEnabled: 0`), the Desktop holds
  63 items, and `board.jsonl` is a write-only mirror the live board never reloads. The one surface
  that fires on every message in every seat is the `UserPromptSubmit` hook, and wiring it is the
  hook owner's to do, in one line: `node consonance/tools/ask.js --line`.
- **It does not detect asks.** `ask.js` scans the cron logs and reports prose matches as
  **candidates** — inference, never filed automatically. An ask enters this file because a person or
  a seat wrote it down with provenance.
- **It does not see the laptop.** The goals there have their own logs and this store cannot read
  them.
