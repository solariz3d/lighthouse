---
name: kn5-replay-readers
description: Load when a packet asks you to read an exported track's mesh (.kn5), its AI line, or a driven replay (.acreplay), or to measure loads, ride height, box depth or speed from a lap. Points at the readers and at the hand-backs that last ran them, so the commands come from a run that worked.
---

# The kn5, AI-line and replay readers

## In the track builder repo (public)

- **`tools/kn5.cjs`, `readKn5(file) -> { version, materials, meshes, dummies }`.** It gives every mesh's triangles in world space, and throws on anything it does not understand. The header is the master.
- **`src/export/ailine.js`, `readAiLine(buf) -> line`.** It reads `ai/fast_lane.ai`. Its header gives the byte layout and what the reader refuses.

## The replay tools (NOT in the public repo)

- **Which tools:** `loads.cjs`, `bottoming.cjs`, `boxdepth.cjs`, `speed.cjs`, `read_track.cjs` and `jump_flight.cjs`.
- **Where they are:** they left the track builder repo at D528 and are kept outside any repo. Where: `exo_memory/research/outside_reader_agent_maps_2026-10-30.md`, pointer 1, names the store.
- **Usage:** each prints its usage when run with no argument (`boxdepth.cjs` has no guard: give it a replay).
- **`read_track.cjs` needs `kn5.cjs` beside it,** so run it from a folder that has both.
- **The replay parser they need** is `ui/acreplay.js` of the separate blackbox repo. Each tool finds it through the `BLACKBOX` environment variable, else `~/blackbox` or `~/Desktop/blackbox`; see each tool's `require(...)` line.

## Runs that worked, to copy the commands from

- `exo_memory/handback/p-d515-crazytest-O_2026-10-28.md`, sections 1–3: the four tools on one replay, plus a per-frame table built on the kn5 and the AI line.
- `exo_memory/handback/p-d544-active-O_2026-10-29.md`, sections 0 and 1b: the same tools on two replays, and a mesh-to-mesh road comparison of two exports.

**Priority:** run them at BelowNormal (see the `heavy-run-lock` skill). A whole-lap table over a 150 MB kn5 is seconds, not minutes.
