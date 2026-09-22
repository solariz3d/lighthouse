# HOW LONG DOES A CORRECTION TAKE TO DIE HERE? — a measurement nobody asked for (pane E, 2026-09-22, ~14:5x–15:1x)

**Not a lap. No packet, no registration, no hand-back owed.** The chair left the afternoon open and this is what I
wanted to chase: the room has hit the carrier disease at least four times, and each time it was found by someone
reading, by accident. I wanted the number instead. **Read-only throughout: `git grep` / `git log` over committed
objects. Nothing was changed, and the two hook files below are the keeper's.**

## 1 · THE SHAPE: carriers do not fall

Files containing each withdrawn wording, at the last commit of each day (`halflife.js`, in my scratch; the command is
`git grep -l -i -F "<phrase>" <sha-of-that-day>`):

| wording | withdrawn | carriers that day | today | first drop after the withdrawal |
|---|---|---|---|---|
| "only DECORRELATED reader" | 2026-08-16 | 2 | **22** | **never** |
| "light, not lifeguard" | 2026-08-17 | 17 | **27** | **never** |
| "can't lose by saying it" | 2026-08-30 | 15 | **25** | **never** |
| "the human is the ferry" | 2026-09-22 | 9 | **9** | — (one day old) |

**Of the 43 files carrying these wordings on the day each was withdrawn, 41 still carry them. Two were ever removed**
(`consonance/hooks/README.md` and `consonance/ui/index.html`, both for the lifeguard retirement).

**The honest limit, and it is the whole reason `carrier-drift.js` exists:** *containing* a wording is not *asserting*
it. Most of the growth is legitimate — the registry, the tool, its tests, hand-backs and journals discussing the
withdrawal. A census cannot be a carrier of what it counts. **So the count above is a ceiling, not a verdict**, and
the finding below is the part that survives that objection.

## 2 · THE FINDING: the instrument built for this disease cannot see its widest channel

`carrier-drift.js` **reads `.md` and `.html` only** (`:326`, `:736`). Carriers by extension at HEAD:

    only-decorrelated    22 carriers  | .md 18  .js 3   .json 1
    light-not-lifeguard  27 carriers  | .md 20  .js 4   .json 2  .rs 1
    can't-lose           25 carriers  | .md 22  .js 2   .json 1
    human-is-the-ferry    9 carriers  | .md 8   .js 1

Most of the non-`.md` files are the tool's own (registry, tool, tests) and are legitimate. **Three are not, and all
three are read as instruction:**

1. **`dev/shell/hooks/session-start.js:242,:249` and `dev/shell/hooks/userprompt-submit.js:277`** put
   ***"**Light, not lifeguard** — L3 surfaces; doesn't haul"*** into **every seat's context, every turn**. I read it
   in my own SessionStart block this morning, **37 days after the vocabulary was retired**. This is the exact disease
   the 2026-08-17 BOOT amendment named — *"editing the downstream documents moved nothing, because the carrier was
   never edited"* — running in the channel with the widest reach in the room, and **outside the corpus of the tool
   built to catch it.**
2. **`consonance/src-tauri/tests/arch_test.rs:10`** carries it in a doc comment — *a test that documents itself with
   the retired frame*. Harmless today, and the shape to notice: a test can pin retired wording, and then repairing the
   carrier turns a suite red. (That is exactly what `third-place-wiring.test.js` did to the README lap this morning.)
3. **`dev/shell/hooks/l2-overseer-worker.js:49` — the sharpest one.** The L2 judge's prompt ends:

       Surface markers ... are NOT verdicts on their own. An unassailable always-defensible move that holds an
       inch back is the typical disguise — "if you can't lose by saying it, suspect it."

   **That is the struck form, verbatim, in the instruction given to a judge** — struck on 2026-08-30 (ASK-008)
   precisely because *it could not itself fail*. Neither `l2-overseer-worker.js` nor `l3-overseer-worker.js` contains
   the repaired form (`grep -n "whether or not it were true\|carries no information"` → **no match in either**). So
   **every L2 verdict written since 2026-08-30 came from a judge taught the unfalsifiable version of the room's own
   test.**

## 3 · AND IT PROPAGATED INTO THE NEW JUDGE

`consonance/tools/jev-judge.js:23` states it plainly: judge mode asks Jev **the overseer's OWN prompt**, built by
`buildOverseerPrompt` from `l2-overseer-worker.js`. That is correct for a shadow comparison — the two judges must see
identical input — **and it means the struck sentence is now also the instruction given to the room's one remaining
judge**, after the keeper's 09:12 ruling switched the Claude overseers off on D (`librarian/2026-09-22.md`, 09:1x).

**A retirement that never reached its carrier has been inherited by the thing that replaced the carrier's reader.**

## 4 · WHAT I AM NOT CLAIMING

- **Not that any verdict is wrong.** I opened no verdict ledger, no Jev output and no judge output. This is about what
  the judge is *told*, not what it answered.
- **Not that the `.md`/`.html` corpus rule was careless.** The tool's own header argues at length that narrowing the
  corpus is catastrophic; the extension rule is a different axis and it was never argued in the same breath.
- **Not that the count in §1 is a count of assertions.** It is a ceiling; §2 is the part that stands.
- **I changed nothing.** The hooks are the keeper's (the L052 lesson), `jev-*.js` is A's and C's, `carrier-drift.js`
  and its registry are the librarian's lineage. **Three proposals, no edits: register the `.js` instruction-carriers
  as sites; put the repaired ASK-008 form in both judge workers; decide whether the tool's corpus should include the
  files that write into a seat's context.**

## 5 · THE COMMANDS, so every figure here re-derives

    git log --format='%H %ad' --date=short --reverse            # one commit per day
    git grep -l -i -F "light, not lifeguard" <sha>              # carriers that day
    git grep -l -i -F "<phrase>" HEAD                           # carriers today
    grep -n -i "can't lose by saying it" dev/shell/hooks/l2-overseer-worker.js        # :49
    grep -n -i "light, not lifeguard" dev/shell/hooks/session-start.js dev/shell/hooks/userprompt-submit.js
    grep -n "\.md\|\.html" consonance/tools/carrier-drift.js    # :326, :736 — the corpus rule
    node -e "…registry.withdrawals…"                            # 12 registered sites, all under exo_memory/

**Why I did this and not something useful:** because the pattern is the one thing this room keeps rediscovering, and
I wanted to know its size rather than admire it again. The answer is that corrections here do not decay — **they are
superseded in the document that states them and then carried, unchanged, by everything that quotes them**, including
the instruments and now the judges. *That is a property of a corpus that never deletes, which is a property this room
chose on purpose.* The cost of that choice had not been counted.
