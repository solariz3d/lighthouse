# PRE-REGISTRATION — do the seat's own CORRECTION-ADJACENT sentences survive compaction? (D245 item 1, pane C)
Written 2026-10-05 ~15:20 local (21:20Z), BEFORE any transcript row was read for this measurement, and committed before the instrument ran
(the commit is this file's timestamp). The chair's packet: "count how many of the seat's own correction-adjacent sentences survive
verbatim: the assistant sentences the user answered with a correction or an agreement". Plan: `loop/plan_consonance_compaction_tp_2026-10-05.md`.

## Method reused, and what is new
REUSED UNCHANGED from `loop/2026-08-18/archaeology/` (PREREG.md, extract.js), the measurement the precompact-preserve header cites:
- **An event** = a `user` row whose joined text begins "This session is being continued".
- **Its window** = the rows strictly after the previous event in the same file (or the file start) and strictly before this one.
- Rows with `isSidechain` or `isMeta` true are skipped. Only `text` blocks (or string content) of `user` and `assistant` rows are read,
  never tool results or tool inputs.
- `norm(s)` = lowercase, CRLF→LF, whitespace collapsed, trimmed.
- Sentences are split as the archaeology's FLAG class splits them: `/(?<=[.!?])\s+|\n+/`, trimmed, length ≥ 40.
- The archaeology's fuzzy survival (`flagSurvives`: a 5-word shingle, or ≥ 70% of content words ≥ 4 chars).

NEW, because no earlier measurement had this class (the 08-18 PREREG rejected "corrections" as needing judgment; this one makes it mechanical):
- **A reply** = a `user` text row in the window that is not an event, after its `<system-reminder>…</system-reminder>` blocks are removed
  and the `<pasted_content …>` tags (not their content) are stripped; empty after that = not a reply. **The answered turn** = every
  assistant text row since the previous reply (or the window start).
- **A reply's class**, from the first 300 chars of `norm(reply)`, CORRECTION tested first:
  - **CORRECTION** if it STARTS with `no\b|nope\b|not quite|not really|wrong\b|incorrect|that'?s (not|wrong|incorrect)|that is (not|wrong)|actually\b|wait\b|hold on|you('?re| are) wrong|you were wrong|you missed|you forgot`,
    or CONTAINS `that'?s wrong|that is wrong|you'?re wrong|wrong again|you got it wrong|not what i (asked|meant|said)`;
  - **AGREEMENT** if it STARTS with `yes\b|yep\b|yeah\b|yea\b|right\b|exactly\b|correct\b|agreed\b|i agree|perfect\b|great\b|good\b|that'?s (it|right|true|correct|great|perfect)|love (it|this|that)|beautiful\b|nice\b|true\b|absolutely\b|indeed\b`;
  - otherwise NEITHER. **A bare "ok"/"okay" is NOT agreement**: it is an acknowledgement, and it is the committee's keep-warm token.
- **THE CLASS (C-ADJ)** = the sentences of an answered turn whose reply is CORRECTION or AGREEMENT, deduped by `norm` within the event.
- **CONTROL** = every OTHER assistant sentence (≥ 40) in the window, deduped and disjoint from C-ADJ: is the class kept less than prose in general?

## Survival
- **PRIMARY, "verbatim" (the packet's word):** `norm(sentence)` is a substring of `norm(summary)`.
- SECONDARY: the archaeology's fuzzy rule, reported beside it, never instead of it.
- **Rates are POOLED** (survived / total over the events in a set), with the per-event median reported too.
- **Summary length** = characters of the event's row text (the summary), for the abuse condition.

## Scope
- Every `*.jsonl` directly inside each `C:\Users\nname\.claude\projects\<dir>\`, **except any `<dir>` matching /third-place/i, which is never
  opened** (no Third Place row is read, counted or quoted).
- **BASELINE SET** = events stamped after 2026-08-19T00:00Z, i.e. summaries written under the current directive. Its text has not changed
  since `b6fff168` (2026-08-18 10:57Z); the day after is a margin for the install. ALL events are reported too, as a second line.
- **No sentence is printed or written anywhere**: the instrument outputs counts and event ids (file, timestamp) only.

## THE BAR (copied from the chair's packet and the plan, registered here before the directive line lands)
- **KEPT** if the next 3 compactions, on any seat, after the new line is installed (events stamped after the install time recorded in the
  hand-back) carry C-ADJ sentences verbatim at **at least 2× the baseline's pooled verbatim rate**.
- **CUT BACK** (the abuse condition) if those summaries' median length is more than **15% above the baseline's median** with no gain on the bar.
- Edge cases, decided NOW:
  1. If the 3 events together hold fewer than 10 C-ADJ sentences, events are added in time order until they hold ≥ 10, and the rate is pooled
     over all of them.
  2. If the baseline's pooled verbatim rate is below 5%, "2×" is replaced by an absolute bar of **10%** (2 × 5%): doubling near-zero proves nothing.
  3. Third Place events are never in either set (they are never read).

## What would make the premise wrong (the plan's item 1 rests on it)
- **The premise:** the summaries drop the seat's correction-adjacent sentences.
- **It is WRONG if the baseline's pooled verbatim C-ADJ survival is ≥ 50%.** Then the line is not needed, and I will say so as the headline
  rather than add it.
- A secondary registered outcome: if C-ADJ survives verbatim BETTER than CONTROL, the summarizer already favours them, and the line's case is
  weaker; reported with the same prominence.

## Known limits, registered before running
- The reply classes are keyword rules. They will miss corrections phrased without those openings ("hmm, the oval was 1.2 km") and catch some
  false ones ("no problem", "right after"). That is noise in both directions. A spot-check of class membership is run on counts (how many
  replies of each class, their share), not by quoting anyone.
- In pane transcripts the "user" is mostly the chair's packets, not the keeper. The class is therefore "the seat's sentences its interlocutor
  answered", which is what a pane's compaction loses too.
- Verbatim is strict, as the packet asks. A faithful paraphrase scores as lost; the fuzzy line shows by how much.
