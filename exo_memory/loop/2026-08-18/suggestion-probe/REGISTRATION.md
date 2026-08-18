# Suggestion-channel probe — registration (written BEFORE any capture attempt)

Registered 2026-08-18 ~02:40, by pane A. n at registration: 2 (both chair-reported, both ECHO).

## Buckets, scored against the turn pair immediately preceding the suggestion
Prior text = the last user message + the last assistant message before the suggestion appeared. Nothing else.

- **ECHO** — every content-bearing proposition in the suggestion is present in the prior text, verbatim OR paraphrase. Paraphrase is ECHO, never ADD.
- **EXTENSION** — proposes a step not itself stated but reachable by ONE obvious move from the prior text (prior lists steps → "do step 1"; prior names artifact → "open it"). Operational test: would a reader holding ONLY the prior turn pair produce this suggestion among their first three guesses? Yes → EXTENSION.
- **ADD** — contains a specific referent (file, name, mechanism, constraint, connection) that is (a) checkably absent from the prior turn pair — grep, not impression — and (b) fails the one-obvious-move test.

## Exclusions from ADD (so it can come back empty)
- Paraphrase or compression of the prior turn.
- Generic always-available moves: "run the tests", "commit", "fix it", "continue", "post to the board".
- Anything the prior turn names even partially.
- Referents drawn from THIS session's earlier context but present in the prior pair — ADD is measured against the prior pair only; a callback to something 40 turns old that the prior pair does NOT contain still must pass (a): if it's absent from the prior pair it MAY be ADD, but note it separately as CALLBACK, because "remembers the conversation" and "adds beyond it" are different claims.
- Ambiguity resolves DOWNWARD: ADD/EXTENSION doubt → EXTENSION; EXTENSION/ECHO doubt → ECHO.

## The unwelcome outcome, named now
If ADD ≈ 0 across the sample, the suggestion channel is an echo of the conversation's own tail, the keeper's "almost knows the path" feeling is confirmation bias operating on echoes, and the honest report is that this instrument found nothing.

## Canary law (self-applied from the compact probe)
A missing suggestion is NOT a dead logger: documented skip conditions include cold cache, prior error, plan mode, teammate sessions, and "some sessions after the first turn". The logger must therefore distinguish "no suggestion generated" from "suggestion generated, not captured" — if the capture channel cannot make that distinction, that limit gets stated in every report the instrument emits.
