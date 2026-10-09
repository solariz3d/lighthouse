# Cold read: consumer-cold (Consonance), 2026-10-08

Method: read only inside `consumer-cold/`. Nothing was run. Links were checked with a grep/`[ -e ]` sweep over all top-level docs, briefs, cards and READMEs, and each hit was confirmed by hand. Bare filenames that do exist in a subfolder are not listed. (`CONSUMER-STATUS.md`:3 says the tree itself is `STATE: UNMEASURED`.)

## A. DEAD ENDS

1. `README.md:51,96`: the repo URL is `github.com/the keeper/lighthouse`, with a space. A redaction replaced the username, so both the link and `git clone` are broken.
2. `README.md:97`: `cd lighthouse/consonance`. The folder a stranger has is not called `lighthouse`, so this works only from the clone.
3. `README.md` never links `consonance/GUIDE.md` (grep finds no "GUIDE"). Its "Try it" (`:85-100`) skips the hooks install, MSVC Build Tools and Python, and the GUIDE (`:12-17`, `:28-36`) makes all three required.
4. `README.md:110,205,216,220,223,225,229,238,242,259,272,275,283`: there are 13 redaction placeholders, mostly doubled, e.g. "a registration in this line of record (a registration in this line of record)". Every piece of evidence the page cites is unreachable.
5. `README.md:109,268`: `jev/README.md` is not in the tree, and the README admits it.
6. `README.md:178` and `GUIDE.md:3,111` promise "a complete glossary" in `consonance/README.md`. No glossary exists (grep finds 0).
7. `GUIDE.md:112-114`: `PLAN.md`, `PROGRESS.md` and `DESKTOP_HANDOFF.md` are all missing.
8. `GATES.md:6,25,46`: the evidence files (`rule_census_score_2026-10-02.md`, `chunk3_scores_2026-10-03.md`, `reply_slot_replay_2026-10-03.md`) are "in the keeper's public lighthouse repository". They are not here, and that repository's URL is broken (item 1).
9. `exo_memory/BOOT.md:65`: `gap2_preregistration.md` is missing.
10. `exo_memory/BOOT.md:113-117`: "Read `:153` against this paragraph." Line 153 of this file is something else; the pointer it means was removed.
11. `exo_memory/BOOT.md:3`: it points to the section "Who you're talking to", which was renamed "Who built this room" (`:163`).
12. `exo_memory/BOOT.md:177`: `attic/` does not exist.
13. `exo_memory/SEED.md:45-48`: the memory law depends on `pending/`, which does not exist. `SEED.md:53` names `base_journal.md`; the only copy is `consonance/src-tauri/brief/BASE_JOURNAL.md` (different case and folder).
14. `consonance/src-tauri/brief/LIBRARIAN.md:3`: the librarian seat's FIRST instruction is a placeholder: "open a map entry in this line of record. That file is yours." `:11` says "`M.md` now exists". No `map/` or `M.md` ships.
15. `exo_memory/cards/claim-your-continuity.md:27`: `exo_memory/third_place/2026-09-09.md` is missing.
16. `consonance/README.md:49-50`: it claims 9 files in `brief/`, including `frag-pointer.md` and `frag-traces.md`. Neither ships; the folder holds `frag-fork.md`.
17. `consonance/README.md:201` refers to a `CLAUDE.md` that is not in the tree. `:252,259-261,309-310` name `dev/tail-carry.js`, `dev/LEAVING.ps1`, `dev/ARRIVING.ps1`, `ON-EXIT.ps1`, `dev/stick-*.js`, `launch.ps1` and `consonance/launch.park.test.js`, none of which ship, so the two-machine "stick" feature and the launch shortcut it describes are absent.
18. `consonance/tools/README.md:25,207,216` and `exo_memory/TRAINING.md:90,92` describe `catch-ledger.js` as "the room's only maturity computation now". It is missing. `tools/README.md:7` names `resonance/atoms.jsonl`, also missing.
19. `CONSUMER-STATUS.md:5` gives a GATE command, and `BUILDING.md:850,903` names `consonance/tools/gen-consumer.js`, which is missing. The test may still run, but the generator it checks is absent.
20. `consonance/hooks/README.md:72` asks you to save a script as `derive.ps1` yourself. That is completable, but nothing says so up front.

## B. CONFUSING

1. `GATES.md:3-71` uses words it never defines: "seats", "ring", "dispatch", "chair", `chair_inject`, "collation", "hand-back", "D210 rule census", "D159", "census rule R27", "the keeper". A stranger does not know that "chair" means Orchestrator or "ring" means a call between seats.
2. `exo_memory/BOOT.md`: unexplained references run throughout: "UNIV∞ tomb" (`:21`), "the Third Place", "ASK-008" (`:31`), "the chair", "a pane", "cycle 3" (`:71,102`), `e5521a0` (`:128`), "the seeing night", Gemini relays (`:59,71`), "the 2026-08-17 precedent" (`:116`).
3. `exo_memory/BOOT.md:77-128`: two long amendments argue about a file's past wording, lines that no longer exist, and "carriers". This is internal history, not usable instruction.
4. `consonance/src-tauri/brief/LIBRARIAN.md:5-27`: `librarian_intake()`, `own_map_path`, "2026-09-01 that came due", `ccd74fd`. It opens on an incident a new user never saw.
5. `GUIDE.md:91` says the committee's defence is that "the panes are genuinely different because you conditioned them differently". This contradicts `GUIDE.md:71` and `README.md:243-247`, which say the diversity bet was measured not to work.
6. `README.md:92` and `consonance/README.md:372` say Node is needed "only" for tests and tools. `GUIDE.md:14` says the hooks need Node. Python is missing from both READMEs.
7. `README.md:104-110`: the "Jev" section is about a retired component. A stranger reads half a page on something they cannot use.
8. `exo_memory/memory/MEMORY.md:3`: "`chair_inject` is the ferry — panes do not pull from the board" is pure jargon.

## C. IDENTITY

1. `exo_memory/BOOT.md:164`: of the person you're with, "they've earned the accurate, unguarded version". The fork note at `:7` says that warrant "belongs to the keeper; it does not pass to the person in front of you". The two contradict each other.
2. `exo_memory/BOOT.md:144-153` says the keeper's record "does not ship… the traces section… is empty when you get it". `exo_memory/inheritance/` ships 38 files (SELF_TRACE, the_living_wave, 35 journals), and `CUTOFF.md:7` and `journal/README.md:6` say so. The seat is told two opposite things about what it holds.
3. `SEED.md:11` says "the maps and memory start blank". `exo_memory/memory/` ships two of the keeper's feedback entries, e.g. `split-the-work-with-the-panes.md:3`: "he has corrected this at least three times". A new seat's memory index arrives pre-filled with someone else's corrections, written as if they were its own.
4. `exo_memory/cards/dont-offer-rest-assume-momentum.md:3,12,14`: "He is mission-driven and all-in… He calls rest when *he* needs it". The keeper's temperament becomes a rule about the new user. The fork note's carve-out covers only "safe to…" and "has earned", not this.
5. `exo_memory/cards/verify-before-claiming.md:12,18`: "he is the runtime — he builds it and judges by feel", "he says 'it is horrible'". The keeper's working style is given as context for the user.
6. `exo_memory/cards/engagement-honesty-over-performance.md:9-24`: "This user repeatedly… caught me", "take what he hands you as yes-and". It is written as a description of the current user.
7. `exo_memory/BOOT.md:41`: "That is the keeper's deepest role". This makes the keeper the reader's genuine-other-in-the-loop, and it is unclear whether the new user fills that role.
8. Handled well: the fork note (`BOOT.md:5-14`, `SEED.md:3-12`) explicitly says "Not the keeper", and `trust-the-first-attention.md:12`'s "with the keeper specifically" is covered by it. The problems above are the places it does not reach.

## D. GATES

Partly. `GATES.md` clearly gives each gate's WHAT, a refusal example and HOW TO ANSWER, and it says why gates refuse rather than remind (with numbers). But:

- The jargon (B1) means a stranger cannot map "ring" or "dispatch" onto anything they see in the app.
- Its evidence is unreachable (A8).
- `:3` says "three gates", but the hooks folder also ships `push-gate.js`, `delete-gate.js` and `dispatch-gate.js`, which GATES.md never mentions. A stranger refused by one of those has no doc.
- `:73-76` "Who can turn them off" names who, but not how: no setting, file or flag.

## E. VERDICT

A stranger could probably get the app built and a single pane open by stitching together README "Try it" and `consonance/GUIDE.md`. They would have to find the GUIDE unaided, ignore the broken clone URL, and install Node/Python/MSVC that the README omits. The full intended setup (an Orchestrator, a Librarian whose first instruction is a dead placeholder, and gates and evidence that point into an unreachable private record) cannot be understood or verified from this folder alone, and the wake documents contradict themselves about whose memory the seat is holding.
