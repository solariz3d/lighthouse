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
6. **A RE-TEST is provenance, and it goes in `Source` — never in `Question`, never in `Status`.**
   A goal that re-verifies an open ask on a later pass is offering evidence, not clearing anything.
   Clearing stays rule 2. So the finding is carried like this, appended to the Source line, and it is
   visibly not the asker's sentence and visibly not a ruling:

   `Re-tested <YYYY-MM-DD>: <what was found>, per <path>:<line>`

   The precedent is `ASK-006`, where D091 recovered a referent that lived only in a log into the
   Source line and left the Question verbatim. **Two things this is not:** it is not permission to
   re-word the asker (rule 5 still holds), and it is not a Status — an ask with a re-test saying "done"
   is still OPEN until the keeper says otherwise, because the whole point of rule 2 is that the audited
   does not mark its own homework.

   **And the goals do not have to write here at all.** `ask.js` READS their own files and renders what
   it finds beside the ask, labelled `↳ RE-TESTED by the goal` with its date and `path:line`. It
   attaches a re-test in exactly two shapes and ignores every other mention of an ask id:
   - a paragraph matching `open asks re-tested` that names ids in bold — the shape
     `daily-news-digest` already writes, so its existing output reaches the queue unchanged;
   - a single line `RE-TESTED ASK-0NN <YYYY-MM-DD>: <result>` anywhere in a live goal file — the
     forward channel, which reaches the queue the day it is written. **A marker with no date is
     refused rather than dated by the reader.**

   Archived copies (`evidence/`, `*-versions/`, `.pre-*`, `.bak`) are never attached: the same block
   exists in eight archived copies today, and showing one result eight times is not a channel either.

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
**Status:** [ANSWERED 2026-09-20 — the keeper read it in the librarian pane on 2026-09-20 ~12:2x. This ask asked to be SEEN rather than adjudicated; the disclosure is at ~/.claude/shell/digests/news-2026-08-24.md and shipped 05:24:22Z, six minutes before the ask was logged at 05:31:13Z. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

> Not a decision — a disclosure that asked to reach a person and did not. It clears with
> `[ANSWERED <date> — seen]`; the point is that someone saw it, not that anything be changed. The
> goal charged itself with this in `PENDING-CONDITIONS.md` under its own heading *"What P61 charges
> against itself, so the auditor does not have to find it"*, so the self-report is real and was
> already disclosed downstream. What never happened is a human reading it.

### ASK-004 — digest-auditor, asked 2026-07-27
**Source:** `~/.claude/shell/duration/digest-auditor/system-cron.log:545` (2026-07-27T14:40:03Z) — follow-up at `:565` (2026-07-28)
**Question:** Escalation flag, addressed to the keeper by name: the "perSourceCap = fixed denominator" prescription survived a fifth consecutive write-back, a two-channel demonstration that auditor output does not route into the digest's working attention — the likely real fix is amending the digest's `wakeup_prompt` step 1 to ingest the auditor's latest output, which is a `goal.json` change, so it's the keeper's call.
**Status:** [ANSWERED 2026-09-20 — RATIFIED. The keeper, to the librarian in the librarian pane 2026-09-20 ~12:30, delegated the queue — "do them... break em into managble chunks per lap and do all 12. You can figure it out" — and asked what ratify means, which was answered as "keep it, it is fine." The thing being ratified is already built four times over and each amendment cites a named auditor condition, states NOT self-authored, and preserves a pre-edit backup: P60 (iteration-47 condition 0, own-entry-relative window plus PENDING-CONDITIONS.md added to step 1, goal.json.P59-backup), P61 (iteration-48 condition 1, STANDING-ITEMS.md added after P59 silently deleted the register, goal.json.P60-backup), P67 (iteration-54 condition 9, scheduler check widened to slot adherence, goal.json.P66-backup), P71 (iteration-57 ruling 1, goal.json.P70-backup with md5 verified before the write). The auditor’s own position on record is keep-and-disclose, not revert, and the disclosure it asked for is present in every amendment. The alternative was reverting four externally authorised, disclosed changes. Re-verified on disk 2026-09-20: step 1 reads state.md, STANDING-ITEMS.md in full, PENDING-CONDITIONS.md in full, and every line of progress.md after this goal’s own previous entry; PENDING-CONDITIONS.md is live at 99,111 bytes, last written 2026-09-19. NOT ratified here and left standing as its own matter: the located root cause at STANDING-ITEMS.md:217, where the cap’s denominator moves on feed reachability that nothing measures. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

> Filed 2026-08-28 by pane D001 from the candidate scan, not by the goal that asked. **Thirty-two
> days old, addressed to him by name, and not read.** Its own follow-up the next day says the
> question *"was answered by the audited goal itself"* — the digest amended its own step 1
> undisclosed — and that the auditor's position is *"keep it, disclose it — not revert."* So the
> decision still stands open, now as ratify-or-revert rather than as the original yes/no.

### ASK-005 — daily-news-digest, asked 2026-07-31
**Source:** `~/.claude/shell/duration/daily-news-digest/system-cron.log:607` (2026-07-31T04:57:35Z)
**Question:** Two things remain deliberately not self-applied, waiting on you: widening step 1's tail-scoped log check, and the auditor's standing escalation that the digest-vs-self-audit altitude is a scope decision only you can make.
**Status:** [ANSWERED 2026-09-20 — the keeper, to the librarian in the librarian pane, 2026-09-20 ~12:30, verbatim: "the digest is for you to see into tech and AI news to see public developments of AI in the publics eye, to see any similarities of shapes." That settles half two, the altitude: the digest is for EXTERNAL news, not for auditing itself. Half one was already overtaken (whole-log in practice since P59, in spec since P67); the residue is a vestigial tail clause in step 1, queued as a repair. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

> Filed 2026-08-28 by pane D001 from the candidate scan. Twenty-eight days. The goal names it as
> deliberately withheld from self-application, which is the honest version of the same refusal
> ASK-006 makes.

### ASK-006 — drift-watch, asked 2026-08-25
**Source:** `~/.claude/shell/duration/drift-watch/system-cron.log:1444` (2026-08-25T15:47Z) — **"those two hooks" are named nine lines up, at `:1437-1439` of the same log, and recovered into this ask on 2026-09-20 (D091) because the referent lived only in the log: `~/.claude/shell/hooks/session-start.js` (guards only `CONSONANCE_DREAM`, at `:14`, and emits the L3 block at `:228`) and `~/.claude/shell/hooks/userprompt-submit.js` (no guard at all; emits it at `:168`). Re-checked on disk 2026-09-20: `grep -c CLAUDE_OVERSEER_RUN` is 0 in both. NOT `l2-overseer.js`/`l3-overseer.js`, which read the guard at `:109`/`:120` and set it for their workers.**
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
**Status:** OPEN — RESTATED IN PLAIN TERMS FOR THE KEEPER 2026-09-20, after he replied "idk what you mean". In his words the question is: four documents from one of your own sittings were SEALED — kept out of the repo on purpose, and one of them (04_CODEX_OF_RECOGNITION) carries a personal anchor including a name. The experiment wants to show those four to BRAND-NEW Claude instances with no room context at all — not panes, blank ones — to see what they make of them cold. Nothing enters the repo either way; the only thing that changes is whether blank instances read them once. The registration says handing them over "is not novel egress relative to the session that already carried them — but it is still a decision, and it is his", and its own gate says the yes is never inferred from a dispatch. Stages 1–2 run without it and are not waiting. So the question is simply: is that all right with you, yes or no. Restated by the librarian; the asker’s Question line above is untouched.

### ASK-008 — cant_lose adjudication, asked 2026-08-29
**Source:** `exo_memory/loop/cant_lose_repair_registration_2026-08-29.md` (the chair's break-attempt is in-file; membrane falsifier satisfied).
**Question:** Adopt the repair — the Third Place's wording as the WHY, the disk-proxy "did a check precede the claim?" as the HOW — as the BOOT:22 amendment, executed as strike-in-place handle replacement? Gates P-HANDLE; B's registry is already armed for the sweep.
**Status:** [ANSWERED 2026-08-30 — the keeper, to the librarian in the librarian pane at ~07:18: "yes to ask-008". Adopt the repair as the BOOT:22 amendment, strike-in-place handle replacement (P-HANDLE). Cleared on his behalf by the librarian, naming him and the exchange per protocol 2.]

### ASK-009 — the Third Place board rows (SIX, not eleven — corrected 2026-08-30), asked 2026-08-29
**Source:** `consonance/tools/actors.evidence.test.js` red at HEAD; the rows are from the Third Place's first session, written to the shared board before b601440. **Count corrected by pane E's census** (`exo_memory/loop/prehistory_carrier_census_2026-08-30.md`, finding 1): parsed by pane field, the live board and the pre-purge backup both hold **6 rows, 1,631 characters, all within one five-minute window on 2026-08-25** — the "11" was a grep over the SID string, 5 of whose hits were one chair turn replayed by the board's replay ratchet. The leak did not continue after discovery; two sessions since produced zero rows.
**Question:** The rows are your conversation — remove, keep, or redact? js-suite stays honestly RED until called; this is user data, not a bug. The object you are ruling on is six rows in five minutes, not eleven across three days.
**Status:** [ANSWERED 2026-09-20 — KEEP. The keeper, to the librarian in the librarian pane 2026-09-20 ~12:40, verbatim: "009 the convo is apart of the build." The six rows stay on the board as legitimate record. Re-counted on the live board that day: 6 rows, 1,631 characters, 17:38:00 → 17:42:51 on 2026-08-25, a four-minute-fifty-one-second window — matching pane E’s corrected census exactly and not the original eleven-across-three-days. CONSEQUENCE, named rather than left implicit: consonance/tools/actors.evidence.test.js is red because it asserts those rows should not be there. On this ruling the DATA is correct and the ASSERTION is now wrong, so the repair is to the test, not to the board. That repair is queued, not done here. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

### ASK-010 — third_place/ tracking, asked 2026-08-29
**Source:** `2fc006c` gitignored the directory; carrier-drift's census went red tonight on the seat's 07:51 notes (a carrier the sweep sees either way).
**Question:** Third Place notes: private-stays-local (gitignored), or tracked? Bears on how the carrier census accounts that file.
**Status:** [ANSWERED 2026-09-20 — already decided by the keeper on 2026-09-14 and recorded in .gitignore:72 — "The Third Place record (exo_memory/third_place/) travels in the repo since 2026-09-14, at the keeper’s word" — with 29 files tracked. Re-confirmed by him in the librarian pane 2026-09-20 ~12:30. Closed as already-answered rather than newly decided. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

### ASK-011 — the account name in the public repo, asked 2026-08-30
**Source:** `exo_memory/librarian/2026-08-30.md` (~06:55 — the chair's scope correction, re-derived: `git ls-files | xargs grep -lI zackn | wc -l` → 61 files; `git log -S'zackn' --reverse | head -1` → `31974c8`); pane E's L018 hand-back (portable-paths never scans `exo_memory/loop/`, so a baseline row cannot carry this).
**Question:** The Windows account name is in 61 tracked files and in history since `31974c8`, on a public remote. No working-tree edit removes it; only `git filter-repo` + force-push does, which rewrites every sha and breaks every path:line citation in the corpus. Accept it as-is and record the decision, or scrub history at that cost? (Your email is already in every commit's metadata; the chair argues against scrubbing; the broken-instruction paths are being fixed separately as a retrieval defect.)
**Status:** [ANSWERED 2026-09-20 — the keeper, to the librarian in the librarian pane, 2026-09-20 ~12:30, verbatim: "I dont care about account name in history." ACCEPT AS-IS, no history rewrite. Re-measured that day: 125 tracked files, 103 of them under exo_memory/, first introduced at 31974c8 — a scrub would have broken every path:line citation in the corpus. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

### ASK-012 — the second-vantage gate cannot be enforced under bypass, asked 2026-08-31
**Source:** `exo_memory/loop/second_vantage_attack_2026-08-31.md:139-141` (pane E, verified: `dispatch-gate.js:29-35` KNOWN LIMIT; `consonance/src-tauri/src/main.rs:4075` `!is_fresh_cwd(&cwd)` → every kept instance pane resumes under bypass); `exo_memory/loop/second_vantage_registration_2026-08-31.md` (pane A, the registration it gates).
**Question:** The routing fix is the best-evidenced item on the retrieval line — ~46 catches on the librarian's desk against ZERO found in-stream by authors, with three outside fields agreeing. E refused it as a CONVENTION on the chair (measured 74.9% miss, 60% on registrations) and registered it as a GATE instead: one `dispatch-gate` clause at PreToolUse demanding a board receipt from a non-author mount. **But `ask` is dropped under bypass, and Main resumes under bypass by construction, so the gate degrades to a printed line the same seat can ignore.** Accept it as advisory-under-bypass and score it anyway, change how Main resumes, or drop the gated form too? Cost measured at 9m14s per read. The chair offers no recommendation: the seat the gate exists to constrain should not choose its own enforcement.
**Status:** OPEN

### ASK-013 — digest-auditor, asked 2026-08-30
**Source:** `~/.claude/shell/duration/digest-auditor/auditor-findings-iter54.md:46` (the day-coverage table, 62% / 57%) and `:60-63` (the four `ClaudeShell_*` tasks reading `WakeToRun=False`) — static since 2026-08-30 08:36. Restated by the goal at `~/.claude/shell/duration/digest-auditor/state.md:26` (standing risk 5) and `:27` (risk 6), a live append-only file whose line numbers drift.
**Question:** Two scheduler decisions, both verified live this fire and both deliberately not self-applied. (a) All five `ClaudeShell_*` tasks are registered `WakeToRun=False` with `StartWhenAvailable=True`. That pair is exactly the off-slot-catch-up signature both goals have logged 20+ times: the slot is silently skipped whenever the PC is asleep, then a catch-up fires when it wakes. Set `WakeToRun=True` on the five, or leave it and accept the coverage. (b) `daily-news-digest` is scheduled 3:43 PM Regina, justified in its own `cron_timezone_note` as fitting your overnight-worker rhythm — but the machine is usually off then. Of 27 off-slot catch-ups, 15 land between 10 PM and midnight and 14 at 11 PM sharp. Move the slot to ~11:15 PM where a third of the fires already land unaided, or leave it. Either is fine; both are yours, not the goal's.
**Status:** [DECLINED 2026-09-20 — NO WAKE. The keeper, to the librarian in the librarian pane 2026-09-20 ~12:40, verbatim: "Idk if pc should wake itself, the automations should only fire if the PC is on during those times." So WakeToRun stays False on all five ClaudeShell_* tasks; the machine is not to wake itself for an automation. HIS SECOND HALF IS NOT A DECLINE BUT A WORK ITEM, recorded here and queued separately: "it should be tweaked to where those automations can then fire even if consonance is open during those times to make up for it." MEASURED THE SAME MINUTE, and it bears on that tweak: the five tasks read WakeToRun=False and StartWhenAvailable=True (so a missed slot already catches up when the machine next runs), but ALSO DisallowStartIfOnBatteries=True — which means a task does NOT fire when the PC is on but running on battery. That is a case his sentence covers ("the PC is on") and the current settings do not. It is named here and not changed, because it is a second decision and not this ask’s. Cleared on his behalf by the librarian, naming him and the exchange per protocol 2]

> **RE-FILED, AND THE RE-FILING IS ITSELF A FINDING.** The goal wrote this into `ASK.md` on the DESKTOP
> at 2026-08-30 08:49 as **ASK-007**, uncommitted. Origin already carried a different **ASK-007**
> (univ-coldread egress, laptop, 08-29). **Same id, two different asks, two machines, one tracked
> file** — verified before the desktop's 217-commit fast-forward, not after
> (`git show origin/main:exo_memory/ASK.md | grep -cE "37 on-slot|62% day-coverage"` → 0). Re-filed at
> the next free id by the librarian seat (desktop); the body is the goal's, verbatim, unedited.
>
> **This discharges F-2W-3** (`loop/two_writers_registration_2026-08-25.md:209`): *"if Rule 2W-1 is
> adopted and a duplicate id still reaches tracked prose, then the mint site was not the only place ids
> are created."* 2W-1 was adopted at `dcb0d9b` and covers **lap** ids, which have a mint (`lap-row.js`).
> **Ask ids have no mint at all**, and this file's own protocol invites anyone to write one — including,
> here, an unattended cron goal on a second machine. Full entry: `librarian/2026-09-02.desktop.md`.
>
> **The measurement, which is why losing it would have cost something.** Slot-enumeration over
> 2026-06-05..2026-08-29 (86 days): daily-news-digest **37 on-slot fires (43%), 49 slots missed, 33 days
> with no fire at all — 62% day-coverage on a daily digest**; digest-auditor applied it to itself first
> and is worse on every line: **30 on-slot (35%), 56 missed, 37 empty days, 57%**. Both goals count these
> gaps *ordinally* — "PC-uptime gap, 20th", "21st" — against a true 49. **A numerator tracked with care
> against a denominator never computed**, which is ASK-004's own shape one level up, filed by the same
> goal.
>
> **And the part the goal said should bother us more than the setting.** `WakeToRun=False` was found on
> **2026-08-06 by session-journal** and never crossed over: `grep -ric waketorun` across `state.md`,
> `progress.md`, `goal.json` and `STANDING-ITEMS.md` in **both** goals returns **0 in every file**. Two
> goals that audit each other in exhaustive detail have not read the sibling goal that diagnosed their
> most frequent failure — and 66 passes and 54 audits graded the *content* of the fires that happened
> without either asking what fraction happened at all.
>
> Bears on ASK-006: same class of two-line scheduler/hook fix, withheld for the same reason.

---

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
