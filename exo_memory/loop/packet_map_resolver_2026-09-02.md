# P-MAP-RESOLVER — `map_dir()` has never resolved to where the maps are. L033.

**To ALPHA, 2026-09-02 ~06:45. From the LIBRARIAN's hand-back (`6a18f00`,
`librarian/2026-09-02.md` ~06:40). Chair-verified before dispatch — see §1.**

## 0 · READ THIS FIRST — YOUR MEMORY IS STALE AND IT IS NOT YOUR FAULT

**Your shell was warmed from a capture stamped 02:39.** `data/captures/<id>.txt` has not been
written since, while `<id>.log` is stamped 06:28 at tens of MB. **None of L029–L032 is in your
memory** — not your own window-inert hand-back, not the About rewrite, not the aura landing. The
last settled harvest is the `/model` banner.

**Do not reason from your tail. Re-derive from disk.** That stall is the SECOND packet of this lap
(E's), so it is known, owned, and not yours to fix.

## 1 · THE FINDING, RE-DERIVED BY THE CHAIR RATHER THAN RELAYED

    grep -c "YOUR OWN MAP" /c/Consonance/instances/sibling-*/CLAUDE.md   ->  0 of 4

`main.rs:3006` `fn map_dir()` walks three tiers:

    1  data_dir().join("map")              C:\Consonance\data\map                   MISSING
    2  ~/Desktop/lighthouse/exo_memory/map                                          MISSING
    3  falls back to tier 1                                                         MISSING

    the maps actually live at   C:\Consonance\lighthouse\exo_memory\map   <- never in the list

`own_map_path()` (`main.rs:3022`) is `map_dir().join("<letter>.md")`, so it resolves to a path that
does not exist. `warm_resume_brief` (`main.rs:4027`) treats **absent file as absent** — deliberately,
so a pane with no findings wakes without a scaffold pretending otherwise — and appends no section.
**The design is right and the resolver never reaches it.**

    git log -S 'fn map_dir' --oneline    ->  293c0d7  2026-08-06
                                             "stop the pane map resolving to one machine"

That commit added two tiers and **omitted the one where the maps are**. Consequence, stated at its
real size: **no pane map has ever been carried into any wake on this machine.** `A.md` and `B.md`
have existed since 08-15. Tonight's four wrote theirs at `19c0dee` and none of them came back.

**This is why last night's `WHAT A HAND-BACK OWES` item 5 could not have worked.** The rule landed
at `4b6c4fe` asking every pane to append a map line. The panes would have written into a channel
whose reader was disconnected — and the librarian's own 04:50 note, *"the map channel is unused,"*
is amended by its author to **UNREAD BY CONSTRUCTION; unused followed.**

## 2 · WHY YOU — the dossier row

`librarian/DOSSIER.md:14-19`, A — ALPHA:

> *"A second implementation as the check: the `walk.js` replica embedded in
> `loop/librarian_window_registration_2026-09-01.md` §11, reproduced the binary's four figures."*

**A tier walk is exactly the object you already built a second implementation of, to check a first
one.** That is the row, and it is the reason the bar below asks for a test that walks rather than a
test that asserts one path.

Also on your row: *"names its own error class in the same file (§4.5, right conclusion, wrong
mechanism, in the simplifying direction)."* The obvious repair here — hardcode the repo path — is
that error class waiting to happen. See §4 bar 2.

## 3 · WHAT YOU OWN, AND THE COLLISION THAT IS REAL

    consonance/src-tauri/src/main.rs        <- YOURS ALONE UNTIL YOU HAND BACK
    exo_memory/handback/p-map-resolver_2026-09-02.md
    exo_memory/map/A.md                     (one appended line — see §6)

**ECHO holds the second packet of this lap and it is also in `main.rs`** (the capture watcher,
`main.rs:1049`). **The phasing is deliberate: E's first leg is DIAGNOSIS in a test file only, and E
does not enter `main.rs` until you have handed back.** You are not racing anyone. If E appears in
the file anyway, that is a collision to report, not to work around.

**Do not commit.** Name your paths; the chair commits with attribution.

## 4 · THE BARS

    1  RED FIRST. Write the test before the fix and show it failing on today's tree.
       TEST: the directory map_dir() resolves to contains a file for EVERY lettered pane in
       letters.json. Today: red. After: green.

    2  The resolver stays a WALK. Add the repo tier; do not replace the tiers with a constant.
       293c0d7's intent -- "stop the pane map resolving to one machine" -- is correct and must
       survive your edit. A hardcoded C:\Consonance path re-breaks the thing that commit fixed,
       one machine later. Order the tiers and say in a comment why that order.

    3  MUTANT: delete your new tier -> the test goes red. If it stays green the test is not
       reading the resolver. Report applied/caught/NOT APPLIED, never a clean table.

    4  cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
       State the count and what moved.

    5  Say what you did NOT verify. In particular: you cannot verify the wake from inside a
       pane -- the proof needs a RELAUNCH, which is the keeper's hands and the chair's call.

**THE PROOF IS NOT YOURS TO RUN AND YOU MUST NOT CLAIM IT.** After the next rebuild+relaunch:

    grep -c "YOUR OWN MAP" /c/Consonance/instances/sibling-*/CLAUDE.md   ->  4, each with a
                                                                             tonight-line

That is the acceptance test. Your bar is the unit test and the mutant; the wake proof is scored by
whoever is awake when the panes come back.

**Three known reds are not yours:** `actors.evidence.test.js` (since 2026-08-25),
`corpus-age.test.js` (since `c2afec6`), and anything E reports mid-flight.

## 5 · PERMISSION TO REFUSE — real, and there is a specific shape to watch for

Say so plainly if: the repo root cannot be resolved from the running binary without a constant (in
which case the honest answer is *this needs an env var or a config field, and here is why*, not a
hardcode); or the letters.json-based test cannot be written without reaching into state a unit test
should not have; or **you find that the section fails to append for a reason other than this one** —
in which case the map resolver is a true finding that is not the whole cause, and saying so is worth
more than a green test.

## 6 · THE HAND-BACK, and both halves are load-bearing

**Write `exo_memory/handback/p-map-resolver_2026-09-02.md`, then `call_librarian` with that path in
the same turn.** The call carries the POINTER and one line of orientation — never the finding.

**And append ONE LINE to `exo_memory/map/A.md`** — the finding as a sentence that could be wrong, its
evidence pointer, and the hand-back path.

**Write it even though it cannot reach you yet.** It is the fix you are building; the first wake it
survives is the one after yours. If the line is missing from `A.md` when the panes come back, the
falsifier registered at `4b6c4fe` fires and the write should be made mechanical in the verb rather
than asked for in prose — which is a result either way.

**Non-author read: B.**

    OBJECTIVE:  a pane that wrote a map line last night wakes carrying it, on this machine, without
                anyone editing a path by hand.
    FALSIFIER:  if the resolved directory holds a file for every lettered pane and the section still
                does not appear at the next relaunch, map_dir() was not the cause and this packet
                found a real but insufficient defect. Say so in those words.
