# Packet (on L; roles, the chair picks the panes): no follow tool; the Track overlay window; Sculpt's bank drag carries past a turn

**His words,** 2026-11-27 01:11 on L, in answer to seven numbered questions (verbatim, whole, in
`briefs/t180_unmakeable_shapes.md`, the 01:11 line):

> "1. We do not build it, merely generate the geometry of the track itself within the previewer. Any track in assetto corsa
> folder remember? It would be a way for people to just copy other tracks and i know other wouldnt like it, but you should be
> able to use it as reference or even to trace the real track the equation builds. 2. this is what I mean, it would be too op
> for the equations or function whatever to map their geometry perfectly, it must only act as a guide. 3. tight i guess.
> 4. Maybe it has its own window on the top that says track overlay, and you can choose from tracks you have already made and
> ones from the assetto corsa folder too. 5 literal. 6. keep rolling. we might have to do a refactor on the sculpting feature"

Question 7 (mock pictures in the room repo) he did not answer; they stay out.

## Closed by his word: the follow tool

- `loop/plan_t180_follow_tool_2026-11-27.md` is **not built**. The plan stays on record as written; its section 7 prediction
  is not run. No seat lays pieces from a reference automatically. The shadow is a guide he traces by hand.
- Class 1 of the catalogue (too many pieces) therefore rests on his by-eye measurement (L259 track 4,
  `handback/p-l259-byeye-C_2026-11-27.md`), which carries on unchanged.

## Track 6, the Track overlay window: a plan and a mock first, no build

His answer 4 begins "Maybe", so he sees it before it is built.
- **Today** (builder f3cd425): View ▸ "Reference track…" (`app/menubar/items.js:60`) opens the page's panel
  (`app/reference/panel.js`); its list is the layouts installed in his Assetto Corsa folder; Line or Road; read only.
- **Asked:** its own place at the top of the window, named **Track overlay**; the list offers **tracks he has already made**
  as well as the ones in the Assetto Corsa folder.
- The plan says: where "at the top" it sits (a menu title of its own, or a header button; mock both if cheap); how a made
  track is drawn as an overlay (its own built road, from its saved file, read only; what happens with a file the builder
  refuses as BAD_DOC; whether an open, unsaved track can be picked); how the two kinds are told apart in the list; what
  stays as it is (Line and Road, the nudge, Show, Clear); that nothing of an overlay reaches a save, an undo step or an
  export (the four proofs of `app/test/reference-panel.test.js` extended to a made track); the rename's reach (menu label,
  panel title, CHANGELOG, tests that match the old words); its rows and tier.
- **A mock for his eye:** the real page with the control injected and marked "mock · not built", in one look plus Skyline.
  Pictures stay uncommitted, in the hand-back's evidence folder.
- Prior art: `briefs/t180_reference_overlay.md` (his words on the shadow tracks), `handback/p-l250-shadow-B_2026-11-26.md`,
  `handback/p-l250-kn5-O_2026-11-26.md`, the L handoff's open items 3, 6 and 7 (`loop/handoff_t180_2026-11-26-L.md`).

## Track 7, Sculpt's bank drag carries past a turn: the builder who built the carry, on `l-bankcarry-a`

His answers 5 and 6. **5, "literal":** typing stays as built at 2067c88; nothing to change. **6, "keep rolling":** a Sculpt
bank drag on a piece wound past a turn carries on, as typing now does, instead of unwinding a turn.
- The rule lives in `app/core/coreshell.js` `bankWithinTurn` (:59, used at :914). D's figure for today's behaviour: on a
  piece rolling −340 to −392, a drag of −10 moves the middle from −366 to −16 (`handback/p-bankcarry-A_2026-11-26.md`,
  "For the keeper", 1; D's script did not travel, so make the case again on L).
- In scope: Sculpt's bank handle and the bank brush (both go through `bankWithinTurn`). **Not in scope, name them as open
  in the hand-back:** the ghost's bank handle (`panel.js` :1086) and the extra bank's ±360 hold (D641 R1); he was not asked
  about those.
- This reverses his 2026-10-06 rule for these drags (`coreshell.js:54`, entered by 89b1859). Rows that pin the old rule are
  amended by name, with his 01:11 answer cited by pointer, not quoted in the builder.
- The field still shows the bank within one turn (D259), as for typing.
- Red first: the −366 by −10 case; a drag across ±360 on a piece inside one turn (does it still hold or wrap as before:
  say which, and why); the brush; his saved tracks unmoved from copies. Tier: prove it.
- **His remark, not an order:** "we might have to do a refactor on the sculpting feature". In the hand-back, say what in
  Sculpt's code made this change hard or brittle, with file and line, so a refactor can be weighed from evidence.
- The reader of 2067c88 (L258 track 1's read) finishes its read as ordered; it then reads this commit's delta.

Hand-backs to the librarian by `call_librarian`, claims marked checked or inferred. No landing, build, install, merge or
release in this packet.

## Amendment, 01:25, after E's read of 2067c88 (`handback/p-l258-read-bankcarry-E_2026-11-27.md`, NOT CLEAN on the record only)

**A claim of this packet was wrong.** Track 7 said the ghost's bank handle and the extra bank's hold were "not in scope" and
unchanged. That was D's sentence, carried here unchecked. E measured both trees:
- the ghost's bank handle already lays in the head's turn at 2067c88 (from a head at −392, its write of −42 lays −392 to −402;
  at f3cd425 it unwinds 350°);
- so does the extra bank handle (D's own row W4) and the flowing bank's offer (E2a).
- Sculpt's handle and the bank brush are the two that still unwind; they are track 7's change, as ordered.

**Added to track 7, same branch:**
1. Correct the sentence wherever it stands: `CHANGELOG.md:35`, the header of `app/test/core-bank-carry.test.js` (:5). After
   track 7 every bank drag carries past a turn; say that, and say which commit made each one so.
2. A row that pins the ghost handle's roll from a head past a turn (none does; E's case E1), through the handle's own path
   where the fake DOM allows it, and said plainly if it is only the handle's write.
3. A row for the flowing offer's value from a head past a turn: E's mutant F1 (the flow branch's `- headTurns()` removed)
   was applied 1 / caught 0 over 13 rows.
4. **Do not change the whole-turn edge.** At exactly one full turn the core stores −359.9999999897 and the field shows −360,
   so a typed −32 unwinds 328° on both trees (E10a, E10b, E10e). Whether a full turn should show 0 and carry is with him.

## Amendment, 02:38, after E's read of 2067c88..7b3926e (`handback/p-l260-read-sculpt-carry-E_2026-11-27.md`, NOT CLEAN on one hold)

**Track 7 is not finished: Sculpt's bank HANDLE stops carrying at ±720.** E measured it through the panel's handle host
(`h_tip.txt`): a piece whose middle is 710 rises to 720 and stops; a piece whose middle is 730 jumps −10 on the first step
(the wrong way for an outward drag) and then holds at 720; the mirror the same. Cause: the handle clamps its value to the
bank kind's range (`handles.js:54`, applied in `targetFor`, `handles.js:325`) while the panel subtracts the unwrapped middle.
The brush has no such hold. His answer 6 is "keep rolling", so this completes the same order; it is not a new one.

**For the builder of track 7, on `l-bankcarry-a` on top of 7b3926e:**
1. Sculpt's bank handle carries past ±720 as it does past ±360. E names two ways (no range on Sculpt's bank handle, as the
   brush has none; or drive it by its travel, not by `value − base`). Choose one and say why; if neither is right, say that.
2. **Do not change the ghost's bank handle,** which shares the kind and its range; whether it carries is with him.
3. Red first, through the handle host: E's 710 case, the 730 case outward and inward, and the mirror (`e260_rows.part.js`
   has them). A row must fail if the first step moves the road against the drag.
4. The CHANGELOG names what still holds after this, and nothing it does not hold.
5. Add the clamp to the hand-back's refactor list (its point 2), as E asks.
6. Tier: the touched rows and the bank-carry harness; a mutant for the new line. The reader of 7b3926e reads the delta.
No push, landing, build or install.
