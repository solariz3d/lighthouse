# Lighthouse (the room), handoff from L to D, 2026-11-21 (Saturday, 00:05 to 08:00 on the laptop)

Written by the librarian on L at 07:4x, at his word ("lets finish it all up, push to all relevant repos, and then leave
the hand off for desktop for each one within the repo like we have been doing"). The night's record, entry by entry, is
`exo_memory/librarian/2026-11-21.laptop.md`; his words are in `exo_memory/briefs/lighthouse_the_room.md` (the entries of
2026-11-21); the catches against the librarian are in `exo_memory/map/M.md` (the entries of 2026-11-21).

## What the night was for (his words, 00:14)

"the main thing we need to is figure out our efficiency ... Basically the best we can be without tanking our weekly usage
within the first few days"

## What was measured (each with its command in the notes)

- A seat's cost is its size on EVERY call, not its wake. Pane B worked for 47 minutes at 777k to 918k: 143M tokens read
  from cache. The 7-day figure went 4 % to 6 % in that time, and 6 % to 7 % in the hour after both panes were cut.
- A builder pane starts at about 100,000 tokens after a cut. Pane A's census:
  `exo_memory/handback/p-q1-census-A_2026-11-21.md` (the intake file 37,117; tool definitions 23,920; the rest in its table).
- In one hour, 61 of pane A's 171 model calls and 26 of pane B's 150 were shell calls that wait or tail.

## Landed on main and live on L (each must be INSTALLED OR SET ON D by hand; settings files do not travel by git)

| what | where it lives | to do on D |
|---|---|---|
| The usage ledger (L213) | `consonance/hooks/usage-ledger.js`, `consonance/tools/usage-ledger.js` | `dev/shell/install.ps1`; then `node consonance/tools/usage-ledger.js --since <ISO>` |
| The model-switch note and the reader agent (L214) | `consonance/hooks/model-switch-note.js`, `dev/shell/agents/room-reader.md` (Sonnet, low effort, no intake) | the same install; it sets `CLAUDE_CODE_SUBAGENT_EFFORT=medium` where unset |
| The fail-closed switch (L215) | `install.ps1 -FailClosed`, `-GatesOpen` | nothing: NO gate is closed, on either machine; whether the push and delete gates close is his, not ruled |
| The no-prompt launch for builder panes (L216) | `main.rs` `no_prompt_for`; on by default | a release build on D; `"builder_no_prompt": false` in `~/.consonance.json` turns it off |
| The cut at a hand-back and before a dispatch (L218) | `consonance/src-tauri/src/cut_at_handback.rs`; key `cut_at_handback` | the build; then the key in `~/.consonance.json`. His word on L was "on" for A, B, C, E. **Which panes on D is asked of him there.** |
| "Compact warm seats" (was "Close for the night", L212) | `close_small.rs`, `ui/close-small.js` | the build. Its first live press cut one seat; an app-written `/compact` does run |
| A 300,000 auto-compact window on each builder pane | `instances/<sibling folder>/.claude/settings.local.json`, `autoCompactWindow` | write the same file in each builder's folder on D. Seen live on L: pane B cut by the harness at 406,900, next call 99,141 |
| Seat models and effort | `~/.consonance.json` `seat_models`; `~/.claude/settings.json` `modelSettings` | his config of record on L: librarian Fable 5.2 at MEDIUM (his keystroke, 04:58); chair and panes Opus 5.5 at high; pane A Sonnet 5.5. Which panes run Sonnet on D is his to decide there |

## On branches, pushed, NOT landed

- `l221-compact-progress` (pane B): the control shows a line per seat and a done line; the seats are cut at once. Pane A's
  read found two lines (the running count; an unreadable ledger); B's fixes and A's read of them: see THE CLOSE below.
- Pane B's Q2 branch: see THE CLOSE below. Packet `exo_memory/loop/packet_q2_builder_floor_B_2026-11-21.md`.
- The builder's repo, `l217-ai-line` 102496e: see `exo_memory/briefs/t180_export_ai_line.md` and the T-180 section below.

## The plan in flight: a smaller load-in (his word of 06:08 and 06:13)

`exo_memory/loop/plan_quantize_intake_2026-11-21.md`. The one rule: a piece may change tier, never words. Q1 (the census)
is done. Q2 is half built on L. Q3 (the ladder for BOOT) and Q4 (the housed seats) are his to decide; his word of
2026-09-21 was to wait. The prior art is `exo_memory/third_place/QUANTIZE_the_room_2026-09-21.md`.

## Rules this night added to how the librarian works (each from a catch; the map has his words)

1. A next step that is this seat's own is taken in the same turn. "I'd do X" is written after X is done.
2. Before a pane over 300k is dispatched, it is cut first. The count told to him is calls times context, beside the wake.
3. Before a packet changes how a control fails, open the control's own header and the room's rule (`consonance/GATES.md:19`).
4. When a seat says it caused something, read the caused thing's own record before repeating it. (The chair's board line
   that its inject had cut the panes was wrong; the transcripts showed two bare commands.)
5. The cut for this seat is asked for at a quiet point over 400k; its window (600k) is a backstop.

## T-180 (the builder), in one place

The AI-line fix is on the builder's branch `l217-ai-line` 102496e, read clean by pane B, not merged, no release. The bar
is 1.93e-4 (a ratio, not metres). It counts as fixed when he re-exports TEST TRACK 100 and AC loads it. The underside
skin IS in his kn5 (10 meshes); the kn5 is not heavy, so the low frame rate is not explained. Whether an unpushed
internal build sits on D is still to be found there (the brief, `:58-71`).

## Open with him

- Whether the push and delete gates fail closed (the librarian's lean: no).
- Q3 and Q4 of the load-in plan.
- The Third Place's seat size (695k on L); its own and his.
- Whether the librarian goes back to high effort: a count is registered (catches against the seat over a working night
  at medium, against six at high on this night).

## THE CLOSE (written last; read this first on D)

See the end of `exo_memory/librarian/2026-11-21.laptop.md`: the entry headed "THE CLOSE" holds the final commits of each
repo, what landed in the last minutes and what stayed on a branch.
