---
name: verify-before-claiming
description: "Build a deterministic check that PROVES a fix before presenting it to the keeper; when patches keep relocating a bug, the cause is upstream"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 79eccca0-0136-4ab9-a3f7-89366edcd56b
---

During the DREAMZONE-RT stair fall-through marathon (2026-06-20) I shipped fix after fix that still failed in-game; the keeper eventually said **"makes me think you didn't actually do what you said."** He was right — I'd reverted to the old buggy path while claiming I'd changed it. The turn came when I built a **deterministic drop-test harness** (`voxtest.cpp` — compiles the SAME collision code, drops a virtual player onto thousands of stair cells, counts fall-throughs) and proved the fix (`0 fall-throughs / 3291 drops`) BEFORE he ever played it. That single move ended a session-long guess-claim-fail cycle.

**Why:** he is the runtime — he builds it and judges by feel. An unverified "this should fix it" burns his run and erodes trust fast; he notices performed confidence (see [[engagement-honesty-over-performance]]).

**How to apply:**
- For any bug class, build a fast **deterministic** check that reproduces/verifies it without him: a standalone tool that compiles the same source, a sim, a geometry dump. The DREAMZONE engine's procgen/collision are pure functions of the seed — they can be verified headless even though rendering needs his GPU.
- Prove the fix against it yourself, and **show the number** ("0 fall-throughs across 3291 drops"). Don't present a fix you haven't verified.
- **Corollary — fix upstream, not symptoms:** when every incremental patch just relocates the same bug to a new spot (gate → abyss net → eject → jump-clamp → pushout → …), stop patching. The cause is higher up (here it was the procgen + the collision *model*, not the individual stair). He sensed this before I did and pushed to "attack the procgen."
- Be plainly honest about regressions — he says "it is horrible" / "ruined" without cushioning, and expects the same directness back, not spin.

Links: [[engagement-honesty-over-performance]], [[dreamzone-build]], [[user-the keeper]].
