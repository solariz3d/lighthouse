# L187 (research only): locomotion data from animals and humans, as the laws our bodies move by (his items 166, 165). Librarian, on L, 2026-11-12 04:2x local

**His words:**
- (166) "we should take the data from wild animals in nature and their locomotion, as well as humans since they are animals too"
- (165) "they have to link to the research"

**Already found** (brief 166; abstracts and press only; the pane reads the full texts):
- **Alexander & Jayes 1983,** J Exp Biol 115: the dynamic similarity hypothesis. Equal Froude number (v²/gL) gives similar gait and equal relative stride length. **One law for any body size.** Known exceptions: cursorial against non-cursorial, and small mammals.
- **Usherwood & Wilson 2005,** Nature 438:753-754: greyhounds keep stride and speed on bends at about 65 % more limb force. Humans slow on bends (Chang & Kram 2007, brief 165).

## Questions (each answered from a read source, with lines or figures)
1. **Stride length and stride rate against speed,** in a form any of our bodies can use: Alexander & Jayes's relative stride length against Froude number; Heglund & Taylor 1988 (J Exp Biol) on stride frequency across mammal sizes; human data for the player and a human-shaped hunter (Weyand et al. 2000, full text).
2. **Gait changes:** walk, trot or run, gallop. Where the transitions fall in Froude number (Alexander), and what a biped's walk-run transition is (about Fr 0.5, to be confirmed from a source).
3. **Cornering:** humans (Chang & Kram 2007, full text: max speed against radius) against animals (Usherwood & Wilson 2005; any cheetah or dog data on turning, e.g. Wilson et al. 2013 Nature on cheetah hunts, if readable). A table: speed against radius, human against animal.
4. **Arm and torso swing against speed** in humans (the open study C found, "Active Arm Swing During Running", and the gait studies L181 needs). How the trunk and pelvis counter-rotate in quadrupeds, if that bears on a non-human chaser.
5. **Motion data we may use:** licences of animal and human gait datasets (CMU mocap for humans is noted in L176; any open animal locomotion data). Study only, or can it ship?

## For him, after the research (his calls, not ours)
- **What each body is:** the player is human (human laws). The hunter, "human silhouette, non-human motion" (the first game), could corner like a hunting animal rather than a human. That bears directly on 164 ("turns too fast keeping speed"). A greyhound's law keeps speed on a race-track bend, not round a doorway, so the source decides what "too fast" means at each radius. The lesser chasers could each take a different animal's law. That would be a kit by locomotion, joining E's L172 kits.
- The librarian does not decide these. The research gives the options; he chooses.

## Hand-back `p-l187-animal-locomotion-<pane>`
- The formulas with their sources and valid ranges.
- What changes in L181 (C's stride) and L182 (A's turning limit) if they take these laws instead of a single human study.
- Options for his choice above.

## Mixing: human-shaped bodies with animal traits, for the uncanny (his item 167)
His words: "the hunter, and other entities, can take things from different animals, while being humanlike at the same time, to create that uncanny valley effect".

**What the sources say so far** (brief 167; abstracts only):
- **Mismatch** (Kätsyri 2015 review; Saygin 2012): a human appearance with non-biological or non-human motion is where the eeriness lives.
- **A gradient of "slightly off" gait** did not make a valley (*Perception*, doi 10.1068/p6900).

**Add to the research:**
1. Read the Kätsyri review and Saygin 2012 in full. What kinds of mismatch raise eeriness: which cue, how strong, and whether they compound.
2. **A catalogue of animal traits a human-shaped body can carry,** each with its locomotion source:
   - a greyhound's cornering (Usherwood & Wilson 2005);
   - the back flex of a galloping quadruped;
   - a bird's head stabilisation (the head held still in space while the body moves; a source on avian head-bobbing and stabilisation);
   - a big cat's stalk (slow, low, still between steps);
   - an insect's or spider's gait timing.
   - For each: which part of our rig it touches (`gait_pose`, L181's chain, L182's turning).
3. **The first game's "non-human" choices** (dreamzone-rt `9d98b64` :6350-6356: limb overspeed, asymmetric phase, the head pinned). Read them against the mismatch findings. Item 163 already rejects legs that fail to keep up, so overspeed is out unless a source argues it back.
4. **Per entity, options for him:** the hunter and each lesser kind with one or two animal traits on a human body, chosen so each cue disagrees clearly with the human shape. This joins E's L172 kit (each kind's signature) as a kit of motion.
**Test, for later builds:** his eye. There is no instrument for eeriness. The bars stay mechanical (replays, fingerprints, the lean timing) and the uncanny is his call on a build.

## His calls after the hand-back (brief 168)
- **The hunter: H2, in a humanoid body.** Speed is held on wide bends where `√(μ g R)` allows; in doorways the friction bound and the human figure govern. **Before H2 is built:** read Usherwood & Wilson 2005 in full (bend radius and speeds) and any cheetah turning data (Wilson et al. 2013), so H2 rests on read figures.
- **Every entity humanoid, each with its own uncanniness** (the "Mixing" section's catalogue, one or two clear traits per kind). The shapes are the psyche's manifestations (lore), so the trait catalogue goes to him with that framing for the picks.
- **Routing §6:**
  - **C (L181):** stride from Alexander's closed form, `step = 1.15 h (v²/gh)^0.3`, with each body's own hip height, swappable.
  - **A (L182):** the turning limit from Chang & Kram Eqn 5, `V_curve = V_o · 0.746 (R g / V_o²)^0.363`, capped by `√(μ g R)` and `V_o`, as a named, swappable law. The H2 variant for the hunter comes after the Usherwood read.
