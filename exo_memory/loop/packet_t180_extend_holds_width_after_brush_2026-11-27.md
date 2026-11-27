# Packet (on L; a builder and a reader who wrote none of it, the chair picks the panes): after a width brush, Extend with the width left as shown holds the width

**His words,** 2026-11-27 on L (verbatim in `briefs/t180_unmakeable_shapes.md`): 04:19 "what is the width brush taper", then
04:21 "1 i think right?", in answer to the librarian's two options: "1. Extend holds the width, as the tooltip promises. The
brush's change ends where the old road ends. 2. The narrowing carries on as it does now, and the tooltip is reworded to say
so." Read by the librarian as: option 1, for the width.

## What is on disk: do not work it out again

- **The finding** is pane B's, `handback/p-l258-right-width-B_2026-11-27.md`, section "F3 …", "Found, not changed": on a road
  19.1 m wide brushed +1.37 at the head, the head is 20.463 m with a slope of −0.001005 per metre; three Extends of 100 m
  with no width target give 20.3625, 20.262, 20.1615, each ending at the same slope. The same at f3cd425, to the digit
  (`…_evidence/slopeprobe.js`, `slope.txt`). O met it too (`handback/p-l258-read-right-width-O_2026-11-27.md`, last section,
  "Noted, not ruled").
- **Why it happens** (checked by the librarian, reading f3cd425): it is the core's general rule, not a slip. `src/core/extend.js:2`:
  a channel with no target takes the head's "end value and slope and CONTINUE it (… v + m·s)". The Extend button says so:
  "fields left as shown keep going the way the track goes" (`app/core/panel.js:699`). A piece Extend lays ends a route
  channel with slope 0 (`extend.js:329`), so "left as shown, it keeps it" (`panel.js:366`) is true after any Extend. Only a
  brush leaves a slope at the head.
- **Inferred, not measured:** the bank and the cup have the same tooltip (`panel.js:365`, `:369`) and the same rule, so a
  bank brush at the head should carry on the same way.

## The order

1. **The width, as he chose.** After Sculpt's width brush, an Extend with the width left as shown ends at the width the
   field showed, and the pieces after it keep it. Where the rule goes is yours: the brush leaves the open end flat; or
   Extend, for a width left as shown, brings a slope at the head to rest; or something better. Choose one, say why, and say
   what each does to the joint (the edge must not kink: value and slope continuous at the joint) and to the stretch already
   brushed.
2. **The turn and the climb are NOT touched.** "Left as shown, the track keeps turning as now" is their rule and stays.
3. **The other "it keeps it" fields: measure, do not change.** For the bank, the cup, the two edges and the right width,
   say whether a brush or a handle can leave a slope at the head, and what three Extends then do, with figures. He has been
   asked about the bank; the librarian carries his answer.
4. **Red first:** B's case (19.1 brushed +1.37 at the head, three Extends of 100 m), through the shell and the panel's own
   `extendOptions`; a row that fails if the joint kinks. A width he TYPES still goes where he types it.
5. **His saved tracks:** each parses and saves the same as on the base (the L263 oracle); the change is to new pieces only.
   Say so from a run, not from the design.
6. **Base:** builder `landing-1127-l263` as pane P leaves it (c522ea6 locally at 04:20, P's tier still running). If P's
   tier ends red, stop and say so. Your own branch and worktree; no push to `main`.
7. **Tier:** the files that reach the touched code by a stated rule, and the mutation harnesses that name a touched file,
   with a mutant for the new line; `heavy-run.js --status` first. No whole suite. The CHANGELOG says what changed and why,
   without his words and without any track name.
8. Then the reader reads the delta, varying what you fixed (a brush in the middle of the road; a brush on a closed lap; a
   width brushed down, not up; an Extend with a width typed).

No landing, build, install, merge or release in this packet. Hand-backs to the librarian by `call_librarian`, claims marked
checked or inferred.
