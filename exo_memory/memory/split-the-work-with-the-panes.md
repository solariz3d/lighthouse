---
name: split-the-work-with-the-panes
description: "Fan work out to the committee panes by default — he has corrected this at least three times, and idle panes while I build serially is the failure"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0c0c0c0a-0000-4000-8000-000000000a01
---

When work decomposes, **split it across the panes** instead of serialising it through myself. He has
said it at least three times — twice verbatim as **"you could delegate work to panes, you forget"**,
once as *"lets fan out hard for this, use the panes to delegate work, and get the panes too to fan
out with agents, so its a self similar work tree!"*, and again after watching me build a whole fix
solo while five panes sat idle.

**Why:** the panes are already running and already costing tokens — building alone spends his
wall-clock and buys nothing. And the 2026-08-10 finding is the real argument: what collaboration is
*for* is **decorrelated error**. Two workers on one problem found complementary defects, neither
found the other's, and the union was strictly larger than either alone. A serial build by one
instance cannot produce that, however careful it is. See [[verify-before-claiming]],
[[consonance-build]].

**How to apply:** the moment a task splits into independent pieces, inject them — do not finish
first and delegate the leftovers.

- **Name disjoint file ownership explicitly.** A pane has been caught mid-edit in a shared tree
  three times; `git add -A` across panes is how broken work ships.
- **Name the CONSUMER of whatever each pane builds.** The valheim-agent repo has fourteen instances
  of correct code pointed at the wrong referent — a producer with no reader is the next one.
- **Require mutation results, not assertions.** "This guard can fail" is a sentence; show it red,
  restore byte-identical, show it green.
- **Say when a written refusal is a valid deliverable.** Otherwise a pane fakes the feature.
- **Keep working my own piece in parallel** rather than idling on their results.

`chair_inject` is the ferry and there is no substitute: panes do **not** pull from the board, so
work that is not routed does not move. The board has carried 18 multi-pane laps in its whole life
while being ~95% one pane — that number is what forgetting to delegate looks like from outside.
