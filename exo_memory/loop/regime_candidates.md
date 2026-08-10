# Regime test - the drawn candidates (2026-08-10, before any screening)

Rule: `regime_item_rule.md` (f88a596), run unchanged. Pool = src/*.rs excluding main.rs and
tether.rs (touched 08-09/08-10). 208 doc-comment blocks, 36 containing `because`, stride 7
from offset 3 -> indices 3, 10, 17, 24, 31.

**FIVE drawn, not six.** The stride exhausts the list at 31; the next index would be 38 of 36.
That is the pool's size, not a selection. The rule's step 7 says to draw the next 6 by the same
stride if fewer than 3 survive screening - there is no next 6, so if that happens the pool must be
widened by a registered amendment BEFORE looking at which ones failed.

**A first run of this rule was wrong and is disclosed rather than dropped:** it matched per LINE
instead of per doc-comment BLOCK, and drew six mid-sentence fragments. Stride and offset were not
touched; only the implementation was corrected to match the registered word. Its output is in the
session transcript.

## C1 - `cochlea.rs:160` (6 lines)

```
FLATS, NOT SHARPS, and it is a real choice rather than a coin toss. The same black key is A♯ or
B♭ depending on where the music is going, and nothing here knows the key — there is no harmonic
context to infer it from, only pitches. So one spelling has to be picked and stated. Flats,
because minor keys and most orchestral writing live on the flat side, and the reference piece
this was built against is in B♭ minor: `A#4` would have been technically defensible and would
have read as wrong to anyone who knows the piece.
```

## C2 - `cochlea.rs:661` (14 lines)

```
The music just started. Nothing before this instant is the music.

MEASURED, from the level trace of a real pass rather than reasoned about:

    50s  mean -100.0          silence, capture running, nothing playing
    60s  mean  -92.2  (-100 to -52)   the music beginning
    80s  mean  -24.6          the music

The silence guard clears history below -60 dB, and the fade-in passes straight through
underneath it at -52. Those transitional frames became the window's early end, so the
opening of every track read as a 30 dB crescendo — reported live at +29.7 and +33.3 dB,
which I nearly accepted because the Adagio really does begin near-inaudible. "Plausible and
large" was the shape of the last two things I got wrong, so this time the trace got read
first.
```

## C3 - `cochlea.rs:1641` (6 lines)

```
`partials` and `inferred` are the corroboration behind the pitch, and they travel because a
pitch claim is the weakest thing in this stream and currently the most authoritative-looking.
Measured across the whole corpus: 11 of 13 onsets rest on a voice with ONE partial — no
corroboration at all — and the only two with three or more are the only two that are
INFERRED, i.e. residue pitches that were never observed. Richest evidence and most fragile
inference are the same two events, which is why these ship as two fields and not as one score.
```

## C4 - `cochlea.rs:3079` (11 lines)

```
A source hop is a square alternation between two partials. This is the artifact class behind
the worst reading on record — ±224¢ at 7.4 Hz on an E♭2 — and it comes in two shapes, one of
which no depth cap can see.

HONEST LIMIT, stated because it is the same gap that let this detector ship silent once
already: NO FIXTURE CAN EXERCISE ANY OF THIS. Recordings store the top ten spectral peaks per
4096-sample frame, and vibrato needs the fine sub-window track, which is computed live and
never written. So every case below is synthetic, and the four voice events the Adagio produced
live — the real-world negative control this rule should be held against — CANNOT BE REPLAYED
to check that they survive it. What that costs is stated on the board with a proposal to
record the fine track, which is the only thing that would close it.
```

## C5 - `cochlea_service.rs:147` (4 lines)

```
What is playing and where we are in it. In the SNAPSHOT rather than the ledger because a
position changes every second: it is live state, not a record. This is also what lets a
reader know it is four minutes into a seven-minute piece instead of guessing — which is
exactly what "should be close to the end" was, twice.
```

