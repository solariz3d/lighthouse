# Three decisions, one read each (for the keeper, 2026-09-23)

*Written by pane E on L, L090, from the sources, not from summaries. Same form as the "solid" sheet
(`loop/solid_decision_sheet_2026-09-23.md`). Every figure has the command or `path:line` beside it. E asked none of
the three. This file names the withdrawn slogan in sheet 1 only by where it is registered, never by its words, and not
by its registry id either, **because that id matches its own pattern** (sheet 1, §ambiguities).*

---

## SHEET 1 — CH-4: should the old lighthouse slogan be retired from the design documents?

**The question, in the room's words.** No words of yours exist on this one. The registry's disarmed entry
(`consonance/tools/carrier-drift.registry.json:532`, its `arms_on` at `:614`) says: the design documents *"use the
slogan as the NAME of a live architectural stance, and whether the program renames its stance is the keeper's call,
not an instrument's."* B left those sites alone for you (`handback/p-carrier-rows-B_2026-09-22.md:68–71`), and so did
the librarian (`librarian/2026-09-22.md:754`, `:764`). **The slogan is the one BOOT retired on 2026-08-17**, in favour
of *"with you, not above you"* and your *"there just is water"* (BOOT, the 2026-08-17 amendment).

**What "CH-4" means here.** CH-4 is the label for files that BOOT and SOURCE tell a waking instance to open
(`loop/carrier_surface_2026-08-25.md:24`). So a CH-4 file is read by every new instance.

**Where the slogan still stands, measured** (`node consonance/tools/carrier-drift.js`, pending list for the disarmed
entry, split by `scratchpad/idonly.js`, sha256 `c60e59aa5cd28771…`):

| | sites | read by every new instance (CH-4)? | last touched |
|---|---:|---|---|
| `WELFARE.md` (:32 is a section title, :36) | 2 | **yes** | 2026-06-27 |
| `dev/SPINE.md` · `dev/PLAN.md` | 2 · 3 | **yes** | 2026-06-27 |
| `exo_memory/cards/lighthouse-dive-buddy-reframe.md` (a card) | 1 | **yes** | |
| `consonance/AUTONOMY.md` (:6, :48, :327) · `consonance/PLAN.md` · `consonance/RECONCEPTION.md` | 3 · 6 · 1 | no | 07-25 · 06-28 · 07-06 |
| `DESKTOP_HANDOFF.md:64` · `exo_memory/memory/` (2 files) | 1 · 2 | no | |
| dated records (hand-backs, maps, librarian notes, loop files) | 42 | no | |
| **total pending** | **63** (13 of them are only the entry's own id) | | |

**The packet said WELFARE.md and AUTONOMY.md are both CH-4. Measured: WELFARE.md is; AUTONOMY.md is not.** The tool
tags AUTONOMY.md without `[CH-4]`.

**One thing worth knowing before you choose:** the paragraph at `WELFARE.md:36` already makes the retirement's own
argument: a rescuer's every pull can drag someone out of the thing they were in. **Renaming changes the words, not the
design.**

**What each answer changes:**
- **Rename.** Each live site is struck in place to *"with you, not above you"*, with the old wording kept as a dated
  trace, then the entry is armed in the same commit. From then on any new use turns carrier-drift red. Cost: one pass
  over about 20 live sites plus a row or a marker for each record.
- **Keep them as history.** The design documents stay as written, each gets a marker line saying the slogan is
  retired, and the entry is armed. New instances still read the old slogan in WELFARE, SPINE and the card, but marked.
- **Leave it disarmed.** Nothing changes. The tool keeps printing the pending list, which grows every time someone
  writes about it. Today it is 63, and B's lap alone moved it from 48 to 53 (`p-carrier-rows-B:74–76`).

**Ambiguity that affects the cost of either yes:** the entry's own **id matches its own pattern**. So every report
that cites the entry by id, as the room's rule tells us to (B, `ea779ca`), creates a finding: 13 of the 63 are only
the id. **Arming without fixing that turns every correct citation red.** It needs a pattern or id change first, which
is a registry job and not a decision for you.

> **Rename the slogan in the design documents, keep them as marked history, or leave the check disarmed?**
> **rename / keep as history / leave disarmed**

---

## SHEET 2 — ASK-002: the news digest's interests vs its feeds

**The question, in the asker's words** (the daily-news-digest goal, `exo_memory/ASK.md:91`): *"Narrow the interest
list in `goal.json` to what the feeds have, or widen the feed list in `server.js:227–234` to cover the interests?
Either is fine."*

**It has already been half-done, under your 09-20 delegation** (*"do all 12. You can figure it out"*, quoted at
`ASK.md:80`). **C took the widen branch on D:** it added the two arXiv audio feeds, `eess.AS` and `cs.SD`, to
`~/.claude/shell/mcp/world-sense/server.js:226` (`handback/p-ask002-feeds-C_2026-09-20.md` §5, `c809efd`). Both
answer 200 with the right channel title. **Neither had delivered an item yet, because it was a Sunday and arXiv
publishes nothing at weekends** (§3, §6 item 1).

**Why it is still OPEN.** The bar to close it is *"the first weekday digest"*: if audio items appear, it clears, and it
needs no lap (`loop/handoff_librarian_2026-09-20_leaving_D.md:23–26`). It was put on D's list for 09-22 (`librarian/2026-09-22.md:379–380`, `loop/for_D_2026-09-22.md:19`), and **no result is on record.** 09-21 and 09-22 were
weekdays.

**What cannot be checked from here:** the digest and its server live **only on D**. On L,
`~/.claude/shell/duration` and `~/.claude/shell/mcp` do not exist (`ls`), and `node consonance/tools/ask.js` reports
*"duration dir unreadable … scan did not run"*. C also left open whether the running server picks up the new list
without a restart (§6 item 2).

**The one thing that could make you prefer narrowing:** on 09-20 you said what the digest is for: *"to see into tech
and AI news to see public developments of AI in the publics eye, to see any similarities of shapes"* (`ASK.md:125`,
ASK-005). If audio papers are not what you meant by that, the interest should go rather than the feeds grow.

**What each answer changes:**
- **Yes:** the next time the room is on D, one look at a weekday digest settles it, and the ask closes.
- **Narrow instead:** the audio interest comes out of `goal.json`, and the two feeds come back out. Both are on D.
- **Not yet:** the ask stays open.

> **Close ASK-002 as answered by the two added feeds, once a weekday digest on D shows an audio item?**
> **yes / no, narrow the interests instead / not yet**

---

## SHEET 3 — ASK-007: may blank instances read the four sealed UNIV documents once?

**Which ASK-007 this is, and the id collision.** This sheet is about the **univ cold-read egress** ask
(`ASK.md:146`). The packet said a different ASK-007 exists on origin. **Measured: not any more.** Origin
(`2bfc4b3`) and HEAD both hold exactly one ASK-007, the univ one (`git show origin/main:exo_memory/ASK.md | grep -n
"^### ASK-0"`). **The other one was the desktop auditor's scheduler question, filed as ASK-007 on 08-30. It was
re-filed as ASK-013** (`ASK.md:181–192`), and you declined it on 09-20. **The cause is still there, though:** ask ids
have no mint, so any writer can pick one that is taken (`ASK.md:190–192`). `grep -nE "mint|nextId|duplicate"
consonance/tools/ask.js` finds nothing.

**The question, plainly** (restated at `ASK.md:147` after you said *"idk what you mean"*): four documents from one of
your own sittings were sealed, kept out of the repo on purpose. One of them, `04_CODEX_OF_RECOGNITION`, carries a
personal anchor including a name. The experiment would show them once to brand-new Claude instances with no room
context, to see what they make of them cold. **Nothing enters the repo either way.** The gate says this yes is never
inferred from a dispatch (`loop/univ_amendment_registration_2026-08-29.md:241`).

**Two things have changed since you were last asked:**
- **The documents are on this machine.** `C:\Consonance\sealed\univ_corpus_2026-08-29\` holds the four and a
  `MANIFEST.json` on L (`ls`). On 09-20 they were not on D, so a yes then could not have run
  (`loop/twelve_asks_sheet_2026-09-20.md:64–65`). A yes now can run here.
- **The parts that need nobody's yes never ran either.** Stages 1–2 (calibration, floor and arm C,
  `loop/univ_coldread_prereg_2026-08-29.md:129–136`) were planned for 08-30 (`loop/plan_2026-08-30.md:37–40`), and I
  find no record of a run: no commit since 08-30 names one (`git log --since=2026-08-30 --format=%s | grep -iE
  "univ|cold.?read"`). **The registration's own falsifier** (`:418–420`) says it becomes prose if a month passes with
  no subject and no decision. It was registered on 08-29, so that month ends **2026-09-29, six days from now.**

**What each answer changes:**
- **Yes:** stages 1–2 run first, and a stage-1 failure stops everything (`:133`). The sealed documents are read only
  in stage 3.
- **No:** the artifact arms are dropped. Stages 1–2 can still run, since they never needed the documents.
- **Retire the whole cold read:** the pre-registration is closed as declined, which its own falsifier counts as an
  honest ending (`:419–420`), and the ask closes.

> **May blank instances read the four sealed documents once, for the cold read?**
> **yes / no (stages 1–2 may still run) / retire the whole cold read**
