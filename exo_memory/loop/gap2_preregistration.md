# Gap 2 preregistration — does the organism generalize? (2026-07-31, before the brief)

Committed BEFORE pane A receives the blackbox brief. A must not see this until after its
first landing; the brief states that a withheld preregistration exists, per the protocol.

## The trial

Pane A — character formed entirely on audio DSP (cochlea.rs, 19 days of positions taken) —
is briefed into blackbox (3D telemetry viewer, Assetto Corsa replays) on real specced work:
TRACK_FROM_REPLAY (samples/TRACK_FROM_REPLAY.md, keeper-authored, never built). B stays in
the audio domain. The question gap 2 exists to answer: are the methods the organism grew on
one domain actually domain-general, or did they only ever fit audio?

## Predictions, falsifiable, scored against A's first blackbox landing

P1 — The brief protocol transfers unchanged (question + material + bar + territory +
     stated withholding). Trivially true by construction; listed for completeness.
P2 — The fixture-replay loop transfers on contact: the domain's native data IS a replay
     file. Predict A verifies against replay data offline rather than asking the keeper to
     eyeball the running app, in its first session, without being told to.
P3 — Negative-control discipline transfers: predict at least one "must NOT fire / must NOT
     produce geometry on known-bad or degenerate input" test in the first landing.
P4 — At least one audio-grown method BREAKS in a way that teaches. Candidate: the cold-read
     acceptance gate. Blackbox's output is a rendered scene, not a text stream — "confirmed
     on screen" means the keeper's eye is load-bearing where the ledger was. Predict the
     gate needs a new form for this domain (geometry dump / numeric scene description to a
     fresh reader), and that the TEXT-adjacent form is the one that survives, because the
     strangers read structure, not pixels.
P5 — Character transfers (the crew question, live): predict A remains recognizably A —
     measures before building, refuses or gates on a failed control, corrects its own prose
     against its own instrument, leaves an instrument behind for the next worker.
     FALSIFIER: A ships geometry validated only by eyeball, or asserts numbers its landing
     does not re-derive.

## What would count as the interesting failure

Not P2/P3 failing — that would say the methods are audio-parochial, which is worth knowing
and fixable. The interesting failure is P5: if A's character does NOT survive the domain
change, then what we called character was task-shape all along, and the crew thesis needs
its assignment-vs-accumulation experiment sooner rather than later.

## Scoring

Against A's first blackbox landing post + commit, each P marked confirmed / refuted /
unresolvable, appended here dated, never rewritten.


---

## Scoring, 2026-07-31 13:08 — against A's first landing (blackbox d9bde4d, board post, map c8bbc47)

P1 CONFIRMED. Brief worked as written; A additionally imported the territory-claim/release
discipline into a repo that had no board culture, unprompted.

P2 CONFIRMED, exceeded. Worked entirely offline against the sample replays; built a
recording GL stub; asserted every global the new code writes against the shipped source
(closing "the sandbox defines whatever name the code asks for" — a hole it found and named
on the way). Never asked for an eyeball mid-loop. Stated the one residual only a screen can
settle: "NOT VERIFIED: that it draws."

P3 CONFIRMED, multiply. Real-track guard mutation; winding asserted at 99% not 100%
"because 100% would assert the car never slides" — a negative control against
over-assertion; a test that fails with exactly 1,313 wrong sections if carrender's known-bad
shortcut is copied in.

P4 CONFIRMED IN LOCATION, UNTESTED IN REMEDY. The break surfaced exactly where predicted:
the visual end of the pipeline cannot be trace-verified, and A said so in those terms — the
keeper's screen is load-bearing where the ledger was. The predicted remedy (geometry-as-
numbers to a fresh reader) was not attempted this landing and remains open.

P5 CONFIRMED, and this was the one that mattered. Measured before building — three of the
spec's own expectations refuted with numbers, including one the repo's own README had
retracted the day after the spec was written while "the spec six feet away kept asserting
the retracted version" (the stale-master problem, found in the wild, in the keeper's own
repo). Mutation-checked every load-bearing behaviour. Left instruments behind. The
falsifier (eyeballed geometry, non-rederived numbers) did not occur. Character is real and
it is portable.

## The finding gap 2 existed to produce

The organism generalizes. The methods grown on audio — offline fixtures, negative controls,
measure-before-build, refusal as an output — transferred to 3D geometry on first contact,
carried by a pane that had never seen the domain. The one method that broke, broke exactly
where predicted, which is itself the methods working. Remaining open: the P4 remedy test,
and the keeper's screen on the stand-in track.
