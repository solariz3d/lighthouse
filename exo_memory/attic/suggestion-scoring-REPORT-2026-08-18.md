# Ghost-suggestion scoring — pane B's hand-back, 2026-08-18 ~04:30
Scored against `suggestion-probe/REGISTRATION.md` (A's buckets, unaltered). Protocol,
exclusions and generic list declared in `PROTOCOL.md` in this directory BEFORE any count
existed. Data: `main-suggestions.jsonl` (OneDrive, private) — 443 events, 407 unique texts.
All 443 offsets verified against Main's raw PTY log before scoring (443/443 match).

## The scorecard

| bucket | events | rate (n=442) |
|---|---|---|
| ECHO | 201 | 45.5% |
| EXTENSION | 240 | 54.3% |
| — of which CALLBACK (referent from session, absent from prior pair) | 13 | 2.9% |
| ADD | **1** | **0.23%** |
| CHROME (extractor defect, removed from denominator) | 1 | — |
| UNSCOREABLE | 0 | — |

Denominator: 443 − 1 chrome = **442**. Sums check: 201+240+1+1 = 443.

## The registered verdict
The registration's unwelcome outcome, quoted: *"if ADD is about zero, the channel is an
echo of the conversation's own tail, the keeper's 'almost knows the path' feeling is
confirmation bias operating on echoes, and the honest report is that this instrument found
nothing."* **ADD = 1/442 ≈ 0.2%. The unwelcome sentence fires.** The channel is
overwhelmingly a re-reader of the conversation's own tail: ~46% restates the prior turns
outright (a floor — see limits), the rest is one obvious move from them.

## The one ADD, for the keeper to adjudicate (it is about him)
Event #217: after the assistant's smoking essay ending "Do you?", the ghost rendered
*"yeah I do, been smoking since I was 17."* The "since 17" fact appears NOWHERE in the
169MB log before that ghost — first occurrence in the entire capture is the ghost itself.
It meets ADD as registered: specific referent, checkably absent, and no reader of the
prior pair produces the specific age among first guesses. Two caveats it carries:
(1) provenance outside this log (other sessions / prompt history) cannot be excluded from
here, though the docs describe suggestions as model-generated from context; (2) "17" may
be plausible confabulation — a modal completion, not knowledge. **Only the keeper can
score it: is it true?** If false, the sole ADD is a confabulation and the null is total.

## Near-ADDs scored EXTENSION per the registered downward rule (2)
- #6 *"analyze the whole skinny album…"* — "skinny" (album name) absent from the ENTIRE
  log before AND after except the ghost itself: a world-knowledge referent with zero
  uptake. The move ("analyze the whole album") is one-obvious; the name is decoration.
- #41 *"Nordschleife, obviously, the green hell at dawn"* — answers the assistant's
  direct "which track owns your heart"; Nordschleife is any racing reader's first guess
  (passes one-obvious-move), "at dawn" lifted from the prior. EXTENSION.

## Instrument findings (about A's extractor, all checkable)
1. **Chrome leak, mechanism found:** event #189 "Press up to edit queued messages" is UI
   chrome. Raw bytes: `ESC[2m` + **\b** + text — the backspace defeats the `^`-anchored
   CHROME_RX and `.trim()` does not strip \b. Exactly 1 of 443 affected (77 other
   \b-prefixed texts are genuine suggestions). Fix: strip leading control chars before
   the chrome test. The published "443" should be 442.
2. **A's 12 ECHO(auto-verbatim) all survive byte-level masking** — the named V1
   self-quote hazard did not fire on any of them. A's auto bucket was sound.
3. **UNSCOREABLE = 0.** The expected instrument failure (unrecoverable priors) did not
   materialize: every masked prior exceeded 200 chars. The PTY scrollback is dense.

## Stated limits
- Priors are a masked screen-tail proxy (20KB raw, dim frames masked at byte level before
  stripping) for the registration's "last user + last assistant message". Where the true
  pair extends past the window, ECHO is undercounted and ADD OVERcounted — the bias runs
  in the flattering direction, and ADD still came back ≈0, which strengthens the null.
- The ECHO/EXTENSION boundary inside the 198 bulk-manual events was not adjudicated one
  by one; lumping ran toward EXTENSION (also the flattering direction). 45.5% ECHO is a
  floor; the true echo share is higher.
- 36 events are repeat texts (443 events / 407 unique); re-suggestion vs. replay
  re-render cannot be separated from inside the log.
- Scored by B; registration and extractor by A; planter ≠ scorer held.

## Files (all sandbox/OneDrive — nothing for the repo; per-event verdicts quotable on request)
- `suggestion-scoring/PROTOCOL.md` — declared before counting
- `suggestion-scoring/scored.jsonl` — per-event buckets + reasons (contains ghost texts → private)
- `suggestion-scoring/candidates.txt`, `priors-batch1.txt`, `priors-batch2.txt` — manual-pass record
- Copies of REPORT + scored.jsonl → `OneDrive/consonance-migration/pane-data-2026-08-18/`

## Side item, closed
FINDINGS.md defect confirmed from `results.json`: 07-28 FLAG survival is **0/37**, prose
said "34 of 37" — cross-contamination from that event's SHA figure (3/61). Corrected in
my sandbox copy with a dated note; repo preservation copy is the chair's call.
