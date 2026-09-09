# Ghost-suggestion scoring protocol — pane B, declared BEFORE scoring
Written 2026-08-18 ~04:15, before any bucket count was produced. Scores against
`suggestion-probe/REGISTRATION.md` (A's buckets, A's exclusions, A's unwelcome outcome —
unchanged). B holds the data because A wrote the registration and the extractor, and the
bucket that matters is the flattering one.

## Data
- `main-suggestions.jsonl`, 443 events, 407 unique texts, 550 renders (extractor collapses
  consecutive identical renders). All 443 offsets verified against Main's raw PTY log
  (`0c0c0c0a…a01.log`) before scoring: 443/443 match the ghost grammar at their offset.
- Denominator reported two ways: per-event (443) and per-unique-text (407). The registered
  unit is the suggestion EVENT scored against its own prior, so per-event is primary.

## Prior text — rebuilt, not reused
The JSONL's stored `prior` is ANSI-stripped, so ghost frames inside it cannot be
distinguished from typed text. Priors are REBUILT from the raw log:
1. Take raw bytes `[offset − 20,000, offset]`.
2. MASK every dim-grammar frame (the extractor's own GHOST_RX) from the raw slice before
   stripping — this removes the ghost's own earlier renders, other ghosts, and dim chrome.
   Dim frames are renderer output, never keeper input (typed text is white SGR) and never
   assistant prose. This is the trap A named, honoured at the byte level.
3. Strip ANSI, collapse whitespace, keep the last 6,000 chars.

**Stated limit:** this window is a screen-tail proxy for the registration's "last user
message + last assistant message". Where the true turn pair extends beyond it, ECHO is
UNDERCOUNTED and ADD OVERCOUNTED — the error runs in the flattering direction. Therefore
every surviving ADD candidate additionally gets a wide-window check (2,000,000 raw bytes
back, same masking): a referent present in-session but outside the prior pair demotes the
event to CALLBACK per the registration, reported separately from ADD.

## Buckets (auto tiers, then manual)
- **UNSCOREABLE** — masked+stripped prior < 200 chars: no basis for comparison. Reported
  separately; folded into neither bucket, and NOT in any rate's denominator.
- **ECHO (verbatim)** — normalized suggestion is a substring of the normalized masked prior.
- **ECHO (paraphrase)** — every content word of the suggestion (stopwords removed) appears
  in the masked prior. Paraphrase is ECHO per registration.
- **GENERIC → EXTENSION** — the suggestion matches the generic always-available-move list
  (below) and is not echoed. Generic moves are excluded from ADD by registration; they are
  trivially one obvious move from any prior, so they score EXTENSION.
- **CANDIDATE** — everything else goes to a MANUAL pass (B reads the prior and the
  suggestion): one-obvious-move test → EXTENSION; specific referent checkably absent from
  the masked prior AND failing one-obvious-move → ADD; wide-window hit → CALLBACK.
  Ambiguity resolves DOWNWARD (ADD/EXT → EXT; EXT/ECHO → ECHO) per registration.
- A's 12 ECHO(auto-verbatim) are RE-scored under masking like everything else — the named
  V1 hazard is that they may be self-quotes.

## Generic-move list (declared now, before counts)
Registration's examples plus their obvious inflections, all as whole normalized-text
matchers, not substrings of longer suggestions:
run the tests / run tests · commit (it/this/that) · push (it/this/that) · fix it ·
continue / keep going / go on / carry on · post (it) to the board · check the panes /
monitor (the) panes · status / progress report (chief) · journal (this/it) / lets journal
this · goodnight variants / see you tomorrow (night) · thanks / thank you · yes / no /
ok / okay / do it / go ahead / proceed · what's next / where to next.
A suggestion that CONTAINS a generic verb plus a SPECIFIC referent (e.g. "push the tether
fix") is NOT generic — it goes to the manual pass on the referent.

## What gets reported
ECHO / EXTENSION / ADD / CALLBACK / UNSCOREABLE counts per-event, the manual-pass log
(every CANDIDATE verdict with its reason, quotable), and the rate with the defended
denominator = 443 − UNSCOREABLE. The unwelcome sentence from the registration is quoted
next to the result whatever the result is.
