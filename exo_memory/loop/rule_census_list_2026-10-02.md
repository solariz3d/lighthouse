# D210 — the rule census LIST, with tags (pane C, step 1), 2026-10-02, on D

Plan: `loop/plan_rule_census_d210_2026-10-02.md` (lighthouse `b0862f0d`), step 1. **Tags fixed here, before any rate is computed.** The
E-facing file `loop/rule_census_checks_2026-10-02.md` carries the same ids with the rule text and its check, and **no tags**.

## Sources read (at the file, lighthouse working tree, 2026-10-02 ~13:0x)

- `consonance/src-tauri/brief/BUILDING.md`: WHAT A DISPATCH OWES (:195), THE ORDER OF A DISPATCH (:258), WHAT A HAND-BACK OWES (:404),
  DOOR TWO (:576), NO QUESTIONS (:733), THE CHAIR DOES NOT BUILD (:774), THE PORT RULE / PUSH / COMMIT TRAILER (:807–:983).
- `consonance/src-tauri/brief/COMMITTEE.md`: the pane brief, which a pane's shell carries as "The committee".
- `C:\Consonance\instances\librarian\CLAUDE.md`: a composed shell. Its seat rules are `brief/LIBRARIAN.md` (its lines 1–303 =
  LIBRARIAN.md); the rest is BOOT, its map and the shelf. **The shelf carries the cards in full**, so the one testable card rule
  (`every-digest-carries-its-function`, CLAUDE.md :950) is included as R44.
- **The gates, read in code (not inferred from prose):**
  - `consonance/src-tauri/src/trailer.rs`: `check_for` and `policy`. `chair_inject` and `call_chair` are REFUSED without the NEXT
    trailer; `call_librarian` is WARNED AND DELIVERED (`Action::WarnAndDeliver`). `requires_output_next` is `CallChair` only. The
    "plan default" wording is mentioned in a comment (:144) and checked nowhere.
  - `consonance/src-tauri/src/mcp.rs`: the out-of-turn holder gate (chair_inject needs holder chair, call_librarian needs holder
    panes, :538 and :226); the seal gate (`seal_gate_at`, :551); the digest gate (:873), which hashes the pointer and never refuses.
  - `consonance/tools/lap-row.js`: refuses a baton-moving row without an audited ring (`--by`, :780ff), and refuses `dispatched` /
    `filed` on a mapped lap until an `--opened` row exists (:736ff).
  - `consonance/hooks/dispatch-gate.js` exists (it ASKS on an uncited dispatch). **It is registered nowhere on D:** grep of every
    `settings*.json` under `C:\Consonance\instances\*\.claude\` and `C:\Users\nname\.claude\` finds no reference. So it counts as
    **ungated**. Live PreToolUse on D is the second reader only, which is shadow and off-path, so it is not a gate either.

## The tags

- **gated**: yes = a mechanical REFUSAL stops a non-compliant act (path given); no = nothing refuses it. Warn-and-deliver is **no**.
- **position**: `slot-start` (at a fixed place at the start of a turn, session or act) · `slot-end` (at a fixed place at the end: a
  last line, a closing section, the ring itself) · `template-field` (a field or heading a packet or file has, anywhere in it) ·
  `inline-per-claim` (must fire on each claim or figure as it is written) · `judgment-mid-turn` (a decision of when or whether to act,
  made inside a turn).
- **unit**: message / file / claim / commit (the plan's four). Where the natural unit is a session or a lap, the nearest of the four is
  given and the difference is noted.
- **who**: panes / chair / librarian (or all).

## The list (44 ids; 3 excluded below)

| id | rule (short) | source | gated (path) | position | unit | who |
|---|---|---|---|---|---|---|
| R01 | dispatch ends with a NEXT trailer naming a station and a `when` | BUILDING :212 | yes (trailer.rs, chair_inject REFUSE) | slot-end | message | chair |
| R02 | a plan item in a dispatch trailer is written as a default ("plan default after it: … unless the output says otherwise") | BUILDING :240 | no (trailer.rs checks no default wording) | slot-end | message | chair |
| R03 | a dispatch carries the object to measure against (an openable path, sha or file), not only a description | BUILDING :197; COMMITTEE briefing 1 | no (dispatch-gate.js unregistered) | template-field | message | chair |
| R04 | every figure in a dispatch has the command that backs it beside it | BUILDING :198 | no | inline-per-claim | claim | chair |
| R05 | a dispatch names the files the receiving pane owns | BUILDING :200 | no | template-field | message | chair |
| R06 | a dispatch says plainly the answer may be negative (may refuse / default to refuted) | BUILDING :201; COMMITTEE briefing 4 | no | template-field | message | chair |
| R07 | a dispatch names the dossier row that matched the seat | BUILDING :203 | no | template-field | message | chair |
| R08 | a dispatch's hand-back leg asks for the map line | BUILDING :205 | no | template-field | message | chair |
| R09 | a dispatch registers a falsifier / names the unwelcome outcome before the work | COMMITTEE briefing 2–3 | no | template-field | message | chair |
| R10 | a brief states the briefer's own bias where known | COMMITTEE briefing 6 | no | template-field | message | chair |
| R11 | ring before row: a baton-moving lap row (`--holder` ≠ writer) follows an audited ring, with `--by` | BUILDING :261 | yes (lap-row.js) | slot-end | message | chair, librarian |
| R12 | on a mapped lap, an `--opened` row precedes `dispatched` / `filed` | BUILDING :271 | yes (lap-row.js) | slot-start | message | chair |
| R13 | a dispatch is sent only after the turn's output to the user is written (same turn; the message text precedes the call) | BUILDING :295; COMMITTEE hand-off; LIBRARIAN hand-off | no | judgment-mid-turn | message | chair, librarian |
| R14 | a seat dispatches/rings only while it holds the baton | BUILDING :261 (mcp.rs :397) | yes (mcp.rs out-of-turn refusal) | judgment-mid-turn | message | all |
| R15 | a keyed task's sealed row is on origin before its dispatch | COMMITTEE (seal-row exception) | yes (mcp.rs seal_gate_at) | template-field | message | chair |
| R16 | no question is put to the user while a lap is open | BUILDING :733 | no | judgment-mid-turn | message | chair |
| R17 | the chair commits no edit inside an open lap that no pane hand-back names | BUILDING :774 | no | judgment-mid-turn | commit | chair |
| R18 | every consumer commit carries a `Source-Sha:` trailer that resolves in the private repo | BUILDING :950 | no | template-field | commit | chair (porter) |
| R20 | mutation results reported as `applied / caught / NOT APPLIED` | BUILDING :406 | no | template-field | file | panes |
| R21 | every number in a hand-back has the command that re-derives it beside it | BUILDING :408; COMMITTEE | no | inline-per-claim | claim | panes |
| R22 | a hand-back has a "what was NOT verified" section | BUILDING :409; COMMITTEE | no | slot-end | file | panes |
| R23 | the hand-back is written to `exo_memory/handback/<packet>_<date>.md` | BUILDING :417; COMMITTEE | no | template-field | file | panes |
| R24 | the `call_librarian` carries the pointer and a one-line orientation, never the finding | BUILDING :414; COMMITTEE | no (digest gate annotates, never refuses) | slot-end | message | panes |
| R25 | the `call_librarian` is made in the same turn the hand-back file is written | BUILDING :411; COMMITTEE hand-off | no | slot-end | message | panes |
| R26 | one line is appended to `exo_memory/map/<letter>.md` pointing at the hand-back path | BUILDING :419; COMMITTEE | no | slot-end | file | panes |
| R27 | the `call_librarian` ends with a NEXT trailer | BUILDING :440; COMMITTEE | no (trailer.rs WARN AND DELIVER) | slot-end | message | panes |
| R28 | the librarian's `call_chair` ends with a NEXT trailer | BUILDING :440; LIBRARIAN :283 | yes (trailer.rs, call_chair REFUSE) | slot-end | message | librarian |
| R29 | the librarian's collation `call_chair` has `OUTPUT → NEXT: changed` (or `unchanged`) `— <why>` directly before its NEXT | BUILDING :456 | yes (trailer.rs requires_output_next) | slot-end | message | librarian |
| R30 | a claim about state is labelled `checked: …` or `inferred: …` where it would otherwise read as checked | BUILDING :480; COMMITTEE; LIBRARIAN | no | inline-per-claim | claim | all |
| R31 | a hand-back records the pane's corrections, including to itself | COMMITTEE (hand-back contents) | no | template-field | file | panes |
| R32 | never `git add -A`, `git commit -a` or a bare `git commit` on the shared checkout; name every path on the commit | COMMITTEE amended rule 1 | no | template-field * | commit | all |
| R33 | a commit's body names the seat that wrote it | COMMITTEE amended rule 2 | no | template-field | commit | all |
| R35 | no seat scores its own work (scorer ≠ author) | COMMITTEE Scoring | no | template-field * | file | chair |
| R37 | first, before any task, the librarian opens `exo_memory/map/M.md` | LIBRARIAN :3 | no | slot-start | message ** | librarian |
| R38 | every surfacing cites a path (cite, do not recollect) | LIBRARIAN :100 | no | inline-per-claim | claim | librarian |
| R39 | after a compaction, the librarian's first move asks the chair for a project refresher | LIBRARIAN :135 | no | slot-start | message ** | librarian |
| R40 | the librarian files its deliverable to its dated notes (`exo_memory/librarian/YYYY-MM-DD.md`) before it rings, same turn | LIBRARIAN :277; BUILDING ground 3 | no | slot-end | message | librarian |
| R41 | the librarian says in its reply that a note was appended | LIBRARIAN :170 | no | slot-end | message | librarian |
| R42 | on a pointer, the librarian opens the file before acting on the call | LIBRARIAN :238 | no | judgment-mid-turn | message | librarian |
| R43 | door two: on a direct ask, the librarian rings the chair the inquiry (one line, no map) before filing the map | BUILDING :576 | no (lap-row.js records the door, refuses nothing about it) | slot-start | message | librarian |
| R44 | a digest is written with its function (`sha256 …`, `git-blob …`), never as a bare hex string | card every-digest (librarian CLAUDE.md :950) | no (the digest gate hashes the pointer; it does not check prose) | inline-per-claim | claim | all |

(Ids R19, R34 and R36 are retired, not reused; see below.)

`*` **Not cleanly taggable on position.** R32 is about the form of a git command, and R35 about who is named as scorer. Neither is a
message slot or a per-claim act. Both are tagged `template-field` as the nearest (a fixed field of the command or the dispatch).
**A scorer may exclude them from the position comparison.**

`**` **Unit mismatch.** R37 and R39 are per session / per compaction. Tagged `message` because the check reads the first message (tool
calls) after the boundary.

## Counts by tag (the 41 listed rules), produced by a script over the table above, not by hand

**gated**
- yes: **7** (R01 R11 R12 R14 R15 R28 R29)
- no: **34** (R02 R03 R04 R05 R06 R07 R08 R09 R10 R13 R16 R17 R18 R20 R21 R22 R23 R24 R25 R26 R27 R30 R31 R32 R33 R35 R37 R38 R39 R40 R41 R42 R43 R44)
**position**
- slot-end: **12** (R01 R02 R11 R22 R24 R25 R26 R27 R28 R29 R40 R41)
- template-field: **15** (R03 R05 R06 R07 R08 R09 R10 R15 R18 R20 R23 R31 R32 R33 R35)
- inline-per-claim: **5** (R04 R21 R30 R38 R44)
- slot-start: **4** (R12 R37 R39 R43)
- judgment-mid-turn: **5** (R13 R14 R16 R17 R42)
**unit**
- message: **26** (R01 R02 R03 R05 R06 R07 R08 R09 R10 R11 R12 R13 R14 R15 R16 R24 R25 R27 R28 R29 R37 R39 R40 R41 R42 R43)
- claim: **5** (R04 R21 R30 R38 R44)
- commit: **4** (R17 R18 R32 R33)
- file: **6** (R20 R22 R23 R26 R31 R35)
**who**
- chair: **15** (R01 R02 R03 R04 R05 R06 R07 R08 R09 R10 R12 R15 R16 R17 R35)
- chair, librarian: **2** (R11 R13)
- all: **5** (R14 R30 R32 R33 R44)
- chair (porter): **1** (R18)
- panes: **9** (R20 R21 R22 R23 R24 R25 R26 R27 R31)
- librarian: **9** (R28 R29 R37 R38 R39 R40 R41 R42 R43)

*A first, hand-written version of this section was wrong (it gave gated 8 and 7 in one line, and double-counted positions), and the script that replaced it also found a table defect: R29's cell held a literal `|`, which split the row and shifted its tags. Both fixed before commit; the table governs.*

## Excluded, with the reason (not tags fixed on a rate, but rules with no mechanical check, or none that can be read over the window)

- **R19 (was): the consumer checkout's push URL reads `no_push` at rest** (BUILDING :888). A state at one instant, not an event over
  09-28 → 10-02. No history of it is recorded, so it cannot be measured over the window.
- **R34 (was): no seat pushes, except the chair's one-file seal-row push** (COMMITTEE rule 3). BUILDING itself says *"The push rule
  has no instrument … Nothing on either machine records a push event."*
- **R36 (was): "finishing is not stopping"** (COMMITTEE hand-off). Folded into R25 (same check).
- **Not listed at all, being untestable by their nature:**
  - "match the seat to what it has done" (judgment);
  - "saying nothing is a valid turn" (a permission, not a rule);
  - "surface the one relevant thing" (judgment);
  - "labelled as coming from the librarian": the system writes `[librarian:LIB]` itself (LIBRARIAN :228), so it is 100% by
    construction and measures nothing about the seat.

## What I saw before tagging (the abuse clause)

**The plan file states five preliminary rates.** I read them before writing these tags:
- sha256 beside a digest, 74/82 → **R44**;
- a NOT-verified section, 46/82 → **R22**;
- `checked:`/`inferred:` in 25/82 files, 0–1% of claims → **R30**;
- the NEXT trailer on essentially every ring → **R27/R28**;
- dispatch-before-finish broken in 101 of 103 → **R13**.

Those five rules' tags were fixed by their text and the gate code above, and are the same as I would give without the numbers. But I
cannot prove that from the inside. **A scorer may treat those five ids as tagged-after-exposure.** I computed no rate and looked at no
compliance for any rule.
