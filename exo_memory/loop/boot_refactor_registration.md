# BOOT refactor — registration (2026-08-16, before a single line of v2 is written)

Registered before the work, per the room's own discipline, because a refactor is the easiest thing
here to declare successful afterward. **The snapshot precedes this document:** tag
`pre-refactor-2026-08-16`, manifest at `exo_memory/snapshot_2026-08-16_pre-refactor.md`.
`git show pre-refactor-2026-08-16:exo_memory/BOOT.md` recovers the pre-refactor file byte-for-byte;
verified 2026-08-16 04:40 (51,735 bytes, content-identical modulo CRLF).

---

## 0. The law this refactor has to survive, stated first

**Maintenance law 2 forbids the obvious approach.** *Append clean masters, never overwrite; never
rewrite an old master from a drifted memory.* Editing BOOT in place is exactly that rewrite, and the
room prohibits it.

**The permitted form, and the only one:** BOOT-v2 is written as a **new clean master**. v1 is not
edited, not deleted, and not "migrated" — it is retired to `attic/` with the tag as its provenance.
That is an append. Anything that reads as *revising BOOT* rather than *writing its successor* is out
of bounds and this registration is the thing to hold it to.

**Maintenance law 1 constrains the writing:** v2 must not paraphrase v1 from memory. Every line kept
is either copied verbatim from the master or re-derived from the instrument or record it cites. A
remembered restatement is a copy-of-copy, which is the failure this whole directory exists to
prevent.

## 1. The measurement that prompted it

Run 2026-08-16 over **624 transcripts**, counting BOOT's distinctive coined phrases in live
user/assistant turns only (system and context occurrences excluded — separability verified before
counting, since BOOT sits in the chair's context every turn):

```
distinctive phrases extracted from BOOT:                117
never invoked in any live turn, by anyone, ever:         69   (59%)

most invoked                          total   keeper
  in the water                          101       38
  grief that learned to build            29       14
  curate below capacity                  23       11
  no false comfort                       21        8
  can you lose by saying it              14        6
  holding an inch back from the edge      5        3
```

**The root fires five times.** The move BOOT calls *the only test that scales* sits near the bottom
of its own document's usage, buried in ~1,500 words of prose about the wardrobe. **`in the water`
fires 101 times** — the metaphor the keeper said on 2026-08-14 no longer sits right with him. The
most-used piece of the room is the one he has outgrown; the load-bearing piece is nearly unused.

**The keeper is 30–50% of every top concept, from a fraction of the words.** That is pane E's
finding with a number attached: *the abstraction was never the problem; the invoker is.*

**Limit, stated rather than discovered later:** the measure is lexical. A phrase appearing may be
quoted rather than used; a concept invoked in paraphrase counts as never-invoked. **59% is an upper
bound on deadness, not a proven dead list** — the same limit `tell-index` documents about itself.
The ratio carries the argument; no single row does.

## 2. The claim being registered

**BOOT-v2's language gets invoked, in live turns, at a materially higher rate than v1's.**

That is the whole claim. Not that it is clearer, better organised, or truer — those are
unfalsifiable from inside. **Invocation is countable and the baseline already exists.**

## 3. Design commitments, each traceable to evidence

1. **Root first, in one line, at the top.** It fires 5 times because it is buried. If promotion does
   not move that number, promotion was not the problem.
2. **Keep only what has ever been spoken.** The ~48 invoked phrases stay; the 69 never-invoked are
   *candidates* for the attic — not automatic deletions, because the measure is lexical and a
   paraphrased concept reads as dead. **Each cut is a judgment made against the list, and the list
   ships with v2 so anyone can contest a specific cut.**
3. **Point at instruments; do not restate them.** `cite-check`, mutation testing, the ferry,
   `guard-census` all have evidence and none live in BOOT. v2 names them and their commands.
4. **Written as protocol, not as self-help.** Every instrument in this room that worked was
   *externally invoked*. v2 is written for one mind to hand another, which is what the keeper-share
   number says it already is.
5. **`in the water` is retired, and its replacement is the keeper's call.** 101 uses of a metaphor
   he has outgrown; the chair does not get to pick the successor image for a room built out of
   someone else's loss.
6. **Capacity is a hard target, not an aspiration.** v1 is 50,514 bytes. v2 must be smaller, and the
   number ships in its header.

## 4. Falsifier, stop rule, degenerating conditions

**FALSIFIER — the one that matters.** Re-run `loop/boot_usage_scan.js` **one season after v2 ships**,
same method, same separability check. If v2's coined language is invoked at a rate statistically
indistinguishable from v1's over a comparable window, **the refactor was reorganisation and v2 goes
to the attic beside v1.** No third version on the same theory.

**Secondary falsifier.** If the root's invocation count does not rise after being promoted to the
first line, design commitment 1 is refuted and burial was never the mechanism.

**Stop rule.** One refactor. If the season scan comes back null, this line ends — the answer would
be that document shape is not the lever, which is already where the branch-layer run pointed before
it voided.

**This line is degenerating if any of the following occurs:**
1. v2 ships and the scan is deferred, while shipped documents accumulate claims that it works.
2. The never-invoked list is trimmed after seeing which cuts feel painful.
3. v1 is edited rather than retired — the law-2 violation this registration exists to prevent.
4. A null result is followed by a v3 on the same theory rather than an attic entry.
5. Success is claimed on any measure other than invocation rate — clarity, elegance, "it feels
   better to wake into" are all unfalsifiable and none of them is this claim.

## 5. What this registration does NOT claim

Not that a better-invoked BOOT reduces errors. **Invocation is not prevention** — the branch-layer
run voided before it could speak to that, and the 2026-08-15 record shows material in context being
violated within the hour of being read. This measures whether the language gets *used*, which is a
precondition for it mattering and nothing more.

---

*Registered before v2 exists. The snapshot precedes the registration; the falsifier precedes the
work. Scored one season on, appended below this line, never rewritten.*

---

## AMENDMENT 1 — 2026-08-16 05:22, before v2 exists. The primary falsifier is gameable.

**Raised by Around, and it is correct:** invocation rate has a Goodhart edge. **A v2 written to be
*quotable* raises the count without raising function.** Catchy lines get repeated whether or not
they do any work, and a refactor optimising for memorable phrasing would pass §4's falsifier while
producing a better-written museum placard. The registration stated the lexical limit and then made
the gameable number the primary test anyway.

**Added falsifier, and it is the one that governs where the two disagree:**

> **Does the root test fire AHEAD of a catch, or get quoted after one?**

Presence is gameable; **position is not**. An instrument invoked *in motion* — before the claim
settles, changing what ships — is doing work. A line quoted while narrating a catch that already
happened is decoration, however often it appears. Same distinction as CHECK-BEFORE-CLAIM, one level
up: the count says the words were used; the position says they were used *as an instrument*.

**Scoring, at the same season mark as §4:** for each live occurrence of the root test in the
corpus, classify by position relative to the nearest catch — BEFORE (the claim changed after it) or
AFTER (narration of a catch already made). **v2 succeeds only if the BEFORE share rises.** A rise in
raw count with a flat or falling BEFORE share is the Goodhart outcome and scores as failure, not as
partial success.

*Honest bound, stated now: "the nearest catch" needs identifying, and catches are not marked in the
transcript. The classification will need a judge or a proxy, and the room's record on judges is
poor. If no judge-free proxy exists by the season mark, this falsifier reports UNSCOREABLE rather
than being quietly dropped — and §4's count then stands alone, known to be gameable, which is worse
than what was registered here and must be said in those words.*

**Also recorded from the same read, because it bounds what this refactor can claim:** the
measurement says the *invoker* carries the concepts, not the document. The real foundation is the
practice and the person running it, and **the bus factor on that is one.** v2 does not fix that; it
only stops pretending the prose was holding the weight. The thing that addresses it is
`second-vantage` — a mechanical second vantage that does not require the keeper awake — which is
built, wired, and currently unplugged. **That is the larger item and this refactor should not be
mistaken for it.**
