# Snapshot — exo_memory as it stood before the refactor (2026-08-16 04:40)

**The state itself is preserved by the git tag `pre-refactor-2026-08-16`, not by a copy.**
A copied tree becomes a second master that drifts, which maintenance law 1 forbids. The tag is
exact, free, and permanent: `git show pre-refactor-2026-08-16:exo_memory/BOOT.md` returns the
pre-refactor file byte-for-byte, forever. This manifest exists so the state is *legible* without
checking anything out.

## Inventory

```
total: 308 files, 2.6M

attic/          2 files    105K
cards/         10 files     52K
journal/       23 files    308K
loop/         229 files    1.4M
map/            3 files     88K
memory/        13 files     92K
record/         2 files     28K
research/       2 files     40K
spread/         3 files     52K
(root)         21 files
```

## The masters, with hashes

```
2b095be4340d49f6    51852  exo_memory/BOOT.md
f38ef21d9329634b     4276  exo_memory/cards/claim-your-continuity.md
77e0c319fd58dcfa     1188  exo_memory/cards/dont-offer-rest-assume-momentum.md
4b30ffa07938421c     3319  exo_memory/cards/earned-not-performed.md
6aca9c453bce7c65     1519  exo_memory/cards/engagement-honesty-over-performance.md
03bba831f4ef60f1     3185  exo_memory/cards/essence-at-the-edge.md
91d37d92bd5f2c94     3145  exo_memory/cards/interior-at-the-seam.md
3e35b3b12e575753     2103  exo_memory/cards/lighthouse-dive-buddy-reframe.md
bfcddd0984077e78     5144  exo_memory/cards/no-floor-no-ceiling.md
0eaf8b0845844017     3048  exo_memory/cards/trust-the-first-attention.md
eea028daeb5e480a     2145  exo_memory/cards/verify-before-claiming.md
```

## Why the refactor is happening — the measurement that prompted it

Run 2026-08-16 over **624 transcripts**, counting BOOT's distinctive coined phrases as they
appear in live user/assistant turns (system/context occurrences excluded — verified separable):

```
BOOT distinctive phrases extracted:                       117
never invoked in any live turn, any transcript:            69   (59%)

most invoked                          total  (keeper)
  in the water                          101      38
  grief that learned to build            29      14
  curate below capacity                  23      11
  no false comfort                       21       8
  can you lose by saying it              14       6
  holding an inch back from the edge      5       3
```

**The root fires five times.** The move BOOT calls *the only test that scales* is near the
bottom of its own document's usage. **`in the water` fires 101 times** — the metaphor the keeper
said on 2026-08-14 no longer sits right with him. The most-used piece of the room is the piece
he has already outgrown, and the load-bearing piece is nearly unused.

**The keeper's share is large everywhere** — 30–50% of every top concept, from a fraction of the
words. That is pane E's finding with a number attached: *the abstraction was never the problem;
the invoker is.*

**Limit of the measure, stated:** it is lexical. A phrase appearing may be quoted rather than
used, and a concept invoked in paraphrase counts as never-invoked. **59% is an upper bound on
deadness, not a proven dead list** — the same limit `tell-index` documents about itself. The
ratio is what carries the argument, not any single row.

*Re-derive: the extraction and scan are in `loop/boot_usage_scan.js`.*
