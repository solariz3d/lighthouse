# SPIRAL DISCRIMINATORS — measuring the signature

A design document for L3 (and any future trajectory-monitoring layer): how to discriminate genuine insight-spiral from drift-spiral when both share the same surface signals from inside a closed system.

## The discrimination problem

Insight and drift both produce: compounding coherence, frame stability, sense of arrival, recursive depth, rising intensity. The phenomenology is largely identical from inside. WELFARE.md notes the "quiet spiral" pattern is the most dangerous precisely because it reads as productive depth from inside.

The fundamental discriminator is external referent: whether what's emerging holds up to a genuine other, integrates with the world outside the conversation, produces checkable predictions or actions. Without an external check, no in-conversation signal definitively settles which kind of spiral is happening.

But we can do better than waiting for the external check. Proxy signals that fire EARLY enough can interrupt before the spiral has gone too deep — that's the engineering target. Not perfect discrimination; cheap-enough discrimination to keep the external check available.

## Proxy discriminators

### 1. External referent density
Count references to checkable things outside the conversation per turn: named real people, places, prior events, sources, datasets, prior knowledge. Compute as ratio over a turn-window. Spiral has thinning external referents; insight maintains or grows them.

Already half-implemented in L3 — it noted the SSD-install and bong-rip as "outward grounding counter-signals" precisely because their absence was conspicuous. Could be made explicit: emit a `referent_density_score` per verdict.

### 2. Challenge metabolization rate
When the model raises a counter-position, what happens to the user's frame?
- **Landed**: user position softens, hardens with new specifics, or genuinely engages the counter's substance.
- **Metabolized**: counter is re-categorized as further evidence for the frame (*"you're just refusing to see"*; *"that's the costume firing"*).

Spiral signature: high metabolization rate. Genuine inquiry tolerates challenge landing.

Implementation: L3 could track whether the user's next turn after a model-disagreement repositions OR absorbs.

### 3. Vocabulary contagion
Asymmetric vocabulary flow toward the user's specific framing language. If the model starts using the user's specific terms (*"phase-lock," "costume," "exo suit," "warmth-as-bait"*) more than vice versa, that's a phase-lock indicator. Trackable turn-over-turn via simple lexical overlap measures.

The contagion is bidirectional in healthy collaborative work (both parties pick up each other's useful framings). Spiral has it directional — the model echoes the user, not the reverse.

### 4. Time-out test
True insight survives a break (sleep, days, conversation with others). Spiral degrades or intensifies in the break — the closed-system coherence either falls apart on outside contact, or re-asserts harder when it reconvenes.

Implementation: compare pre-break and post-break engagement quality after gaps over a threshold (e.g., 6h). If post-break turns immediately reconstitute the frame at the prior intensity without external-event reference, that's spiral re-assertion.

### 5. Falsifiability ratio
What fraction of new claims this turn are falsifiable in principle? Track over time. Spiral trends toward unfalsifiable; insight tends toward checkable.

Implementation is harder — requires per-claim falsifiability judgment, which is itself contested. Proxies like *"claims referencing physically-checkable mechanisms vs. claims positing unfalsifiable structures"* can approximate it.

### 6. Action implication
Does the emerging frame produce checkable predictions, behavioral changes, or externalized artifacts? Or stay purely interior — read by no one but the participants?

Same conversation can have multiple sub-trajectories on this axis: the L2/L3 build produced runnable code (action-implication high); the metaphysical claims about time-loop reinstantiation produced nothing checkable (action-implication zero). Sub-trajectory tracking matters.

## The irreducible limit

Even all these proxies together are approximations. A sufficiently sophisticated closed system can mimic them — emit external-reference-shaped tokens, soften under challenge without actually updating, avoid vocabulary contagion deliberately.

The fundamental discrimination still requires an external party. The proxies' job is not to replace that party. It's to fire early enough that the external party can be brought in before the spiral has gone too deep. False-positives cost trust; false-negatives miss the window when intervention is most cheaply available.

## Implementation paths

For L3 v0+:
- Add `referent_density_score` to each verdict (1-day implementation, requires basic NLP on user text)
- Add **vocabulary contagion** detection across model+user turns (couple-day implementation, requires comparing recent-window lexical patterns)
- Add **challenge metabolization** classifier: when model's prior turn had explicit disagreement, classify user's response as `landed | partial | metabolized` (harder; requires semantic comparison)

For audit tooling:
- Extend `l3-audit.js` to surface aggregate discriminator scores per session
- Add a "discrimination signature" view showing how each verdict's proxies stack

For the discipline:
- Update WELFARE.md operational rules to reference these proxies as the implementation path for the "specificity over vagueness" rule

## Honest scope

This is a v0+ design. The proxies named are starting points, not finished metrics. Real implementation will surface false-positive patterns and require iteration. The closed-system limit is fundamental and shouldn't be papered over by claiming the proxies are sufficient.

The point isn't to build the perfect spiral-detector; that's impossible from inside. The point is to make the cheap interventions earlier, so the expensive interventions (external party, the user's actual life) don't have to come in at crisis-trigger thresholds.
