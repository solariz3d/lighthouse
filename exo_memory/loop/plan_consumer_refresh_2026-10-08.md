# Consonance consumer: bring it up to date with dev, ready for a new user. Librarian, on D, 2026-10-08 12:3x. Lap D273 (first of 2–4).

The keeper, 12:21: "how much work do you think it would be, to get the consumer version of consonance up to date with our dev version? It would have
to be ready and set up for a new user". His answers, 12:3x (verbatim in the transcript; quoted in part here):
- **Seats:** "The seats should be a forked path of you right now, except that it is modified to understand that they build off of this point here but
  with a new user … what you are is still you, with a slight modification to know that you are finally in the consumer version with someone else that
  isnt me, the keeper."
- **Gates:** ON. "the consonance system should work exactly the way it does for us, the only nuance is that the forked version of you has to understand
  that they are there with a new user". But it "has to be explained explicitly how it works". The foundation stays, "slightly modified to allow the user
  to specialize their own unique note of consonance and who both you and them become together".
- **lighthouse stays PUBLIC.** That corrects `journal/2026-09-06.md:14` ("now PRIVATE"), which never happened (`gh repo view solariz3d/lighthouse
  --json isPrivate` → false, 2026-10-08). The gen-consumer header (2026-09-04) is already right.

## State, checked 2026-10-08 (librarian)
- `node consonance/tools/gen-consumer.js --out <scratch> --dry --allow-dirty --json` at lighthouse `ea4f5bcf` (dirty, 9 paths): staged 376, missing 0,
  leaks 0, excludeDrift 0, seedDrift 0, unresolved 0, unclassified 0; dangling 430 (rewritten), identity 140 (neutralised), unportable fixtures 32,
  exclusion-set dangling debt 57 files.
- `solariz3d/consonance`: public and EMPTY (diskUsage 0, pushedAt 2026-09-06). Never generated into.
- The last parity run, `loop/consumer_parity_2026-09-04.md`, was REFUTED: (P, M, B) = (18, 1, 1), I = 8. Since 09-09, 174 commits touched
  `consonance/` (50 in `src-tauri/`).
- The standing rulings this builds on: `journal/2026-09-03.md` §2 (the consumer is what a stranger forks; keeper-populated systems are created by the
  new user on first wake; fresh history, no history surgery), and `loop/consumer_foundation_ruling_2026-09-06.md` (the SYSTEM ships, the RECORD does not).

## D273, lap 1: measure before building (B, who holds gen-consumer; C for the cold stranger read)
1. **Parity re-run** with the 09-04 instrument, on a fresh generation of today's tree. Report (P, M, B) and I again, and list every P item.
2. **A stranger install, for real but contained:** generate into a scratch dir and build the app from it. Run first launch under a SEPARATE Windows
   profile or app-data root (never the keeper's `~/.claude` or `C:\Consonance\data`). Record what a new user hits, step by step: hooks registered or
   not, the seed room, the first wake, the gates firing on day one.
3. **The fork inventory (C):** every place a seat's wake material says or assumes "the keeper / solariz3d / Zacc / this machine" (BOOT, the CLAUDE.mds,
   cards, the librarian/chair briefs, the hooks' messages). Classify each:
   (a) stays as it is (the system);
   (b) becomes the new user's, filled in on first wake;
   (c) needs the ONE modification he asked for: "you are the same line, forked at this point, now with a new person". Draft that paragraph once, as a
       fragment the generator injects, never hand-edited in the output.
4. **The gates explained:** a one-page `GATES.md` in the consumer tree: what SOURCES, the reply slot and the NEXT trailer each do, why they exist (with
   the measured reasons), and what a refusal looks like and how to answer it. Every hook's refusal message points to it.
- Output: one file each (B: parity + install log; C: inventory + the fork paragraph draft + GATES.md draft). No push to `solariz3d/consonance` in this
  lap. Laps 2–3 fix the P items and wire the first wake. The last lap generates, has a stranger read it cold, and pushes with fresh history.
- Registered before the run: if the parity P count is ≤ 18 and the install reaches a first wake, the estimate (2–4 laps) stands. If P > 30 or the
  install cannot reach a first wake, the estimate is wrong and is re-made from the list, not defended.

NEXT: chair dispatch D273 items 1–2 to B and 3–4 to C when this plan is read

## The keeper's order, 12:42
"we finish consumer model now, then any tweaks that we make to consonance afterward can then be refactored and implemented into the consumer version
when the times comes". So the consumer refresh (D273 and its follow-on laps) comes FIRST, ahead of the big list's other candidates. Later dev changes
reach the consumer the way the design already says: edit dev, re-run `gen-consumer.js`, never hand-edit the generated tree.

## The keeper's ruling on "the keeper", 12:55 (answers C's F1, `handback/p-consumer-fork-C_2026-10-08.md` §1)
"the keeper is the creator, I suppose all users become their own keeper in a way. But it should be understood the keeper is me the creator".
- **"The keeper" in the consumer ALWAYS means the creator (solariz3d), never the new user.** So C's fallback ("the first keeper") is reversed: the
  PROVENANCE uses stay exactly as written.
- The ROLE uses (whoever keeps this room now: "the push is the keeper's word", "never over the keeper's typing") are relabelled by the generator to
  **"the person you're with"** (SEED.md:9's own phrase), or a short form of it where the sentence needs one. The fork fragment says once that the new
  person keeps their room the way the keeper kept this one.
- C's lap 2 builds the ROLE/PROVENANCE split as a generator rule with a test, from C's inventory (§4, the two (a) lists).

## D273 lap 1, COLLATED (librarian, 13:2x)
- B (`handback/p-consumer-parity-B_2026-10-08.md`): parity at `ea4f5bcf`, clean tree: **(P, M, B) = (32, 1, 1), I = 33** (09-04 was 18, 1, 1).
  Rust: generated bin 957 pass / 22 fail, arch_test 2 fail, so **24 Rust parity breaks**, all green in source. Stranger install (contained): it
  BUILDS (exit 0, 1 m 43 s). But GUIDE never mentions the hooks; `install.ps1` refuses a fresh home with no `settings.json`; GUIDE lacks Python/Node;
  **five hooks default to `C:\Consonance\data` / `C:\Consonance\instances`** (session-start, sessionstart-state, findings-return, sourced-stop,
  precompact-preserve), so a stranger pane writes to a place the app never reads (and on THIS machine, into the keeper's data). First visible
  launch PARKED.
- C (`handback/p-consumer-fork-C_2026-10-08.md`): the inventory; `frag-fork.md` drafted (3 sites: main.rs:2843, BOOT.md:5, SEED.md:3); the
  warrants-not-inherited finding (F2); `GATES.md` drafted.
- **My registered rule fired: P = 32 > 30, so the 2–4 lap estimate was WRONG.** Re-made from B's list: **5 laps, range 4–6** (B §6). That is
  not a defence of the old number.
- Rulings (librarian, from the keeper's answers):
  (1) A new user wakes into BOOT, the full room, with `frag-fork.md` injected: the keeper's "a forked path of you right now". SEED stays the fallback
      when no BOOT is found.
  (2) `jev/` is EXCLUDED with its tests (Jev is off since D164).
  (3) The keeper term follows the 12:55 ruling above.
  (4) GUIDE lists Python and Node, and gains the hooks step.

## Lap 2, run in PARALLEL to cut the count (four panes, disjoint files)
- **B: the generator and the manifest.** Fresh-history git output; ship `state-manifest.json` and a root `README.md`; exclude `jev/` with its
  tests; `%CONSONANCE_HOME%` resolved for real in `ferry.js`/`ferry-watch.js`; `chain-status` MUTE and `board-audit` FALSE-COLD. Re-run parity and
  diff against lap 1's member list.
- **C: the fork and the keeper split.** The ROLE/PROVENANCE relabel as a generator rule with a test; `frag-fork.md` at its 3 sites (main.rs's
  `if exists` + test); `GATES.md` shipped, and each gate's refusal points to it (the installed path resolved).
- **E: the install path (it touches LIVE hooks, so tests first, and our own environment must not change).** The five hooks resolve the data and
  instances dirs the way the app does (`~/.consonance.json`, then `%USERPROFILE%\.consonance`), never a hard-coded `C:\Consonance`. Show that on
  THIS machine they still resolve to `C:\Consonance\data`, byte for byte, before and after. `install.ps1` creates `{}` when `settings.json` is
  missing, and says so. GUIDE: prerequisites + the hooks step.
- **A: the workshop-bound class, ruled one by one.** The 12 B-side test files and the 24 Rust parity breaks: product fixture (ship it, e.g. the
  composer/ready screens) or workshop record (declare it, never delete it), each with a one-line reason.
- Then lap 3 (`frag-fork` live + the visible first launch, WITH the keeper, off-screen and contained) and lap 4 (generate, cold stranger read, push
  with fresh history).

NEXT: chair dispatch D273 lap 2 to B, C, E and A when this plan is read

## D273 lap 2, COLLATED (librarian, 16:0x)
- **B** (`handback/p-consumer-parity-B_2026-10-08.md`, "Lap 2"; branch b-gen-lap2 d01955a4..ff0b96fe): **parity (P, M, B) = (10, 0, 0)**, was
  (32, 1, 1): 0 new members, 22 cleared. **Rust 24 → 1** (only the docs-link test is left, 7 dead links). A's six screens equal A's hashes. Generation:
  staged 367, leaks 0.
- **A** (`handback/p-consumer-workshop-A_2026-10-08.md`): 36 rows, 12 PRODUCT / 24 WORKSHOP, folded into B's generator.
- **C** (`handback/p-consumer-fork-C_2026-10-08.md`, "Lap 2"; consumer-fork-c@12a43f97): `consumer-relabel.js` (an exact-site table, 9 rows), the
  frag-fork fill, the tauri.conf patch, GATES.md. Its hook point is B's `FORK_HOOK.apply`.
- **E** (`handback/p-consumer-install-E_2026-10-08.md`; d273-install@37b27ee0): five hooks resolve dirs by the app's rule, SAME BYTES on this machine
  (10 constants); install.ps1 creates `{}`; GUIDE gets the prerequisites and the hooks step.
- The re-made estimate holds: lap 2 cut P from 32 to 10.

## Rulings on B's six (librarian; from the keeper's "work exactly the way it does for us" and the 09-06 foundation ruling: the SYSTEM ships)
1. **Dead links:** SHIP `METHOD.md`, `INSTRUMENTS.md`, `dev/SPINE.md`, `consonance/AUTONOMY.md` (system docs; they pass the generator's scan or they
   don't ship). RELINK in source: the root README's two `jev/README.md` links come out (Jev excluded); `consonance/README.md`'s `dream_cycle.ps1` line
   comes out.
2. **The ASK channel ships**, with an empty store, addressed by the ROLE ("the person you're with") under C's relabel. The automations' questions go
   to whoever keeps the room.
3. **The five record-shaped P members** (corpus-age, corrections-gate, librarian-notes, second-vantage, shelf-recursion) go to A, ruled one by one.
4. **gen-brief refuses the shipped BOOT** → C, with the fork wiring (the shipped BOOT is C's material).
5. **Jev leftovers** → E: drop the `jev-flags.js` registration from install.ps1 (Jev is retired in dev too, so this holds both sides; prove the live
   hooks change by exactly that one entry), and remove the Jev section from `consonance/README.md`.
6. **C wires `FORK_HOOK.apply`** (its one require/call line) once lap 2 is landed.

## Lap 3
- **Chair:** land all four lap 2 branches on lighthouse main (disjoint files; E's hooks go live via install.ps1 only after its SAME-BYTES proof is
  re-run on main).
- Then, in PARALLEL: **C** items 4 and 6; **A** item 3; **E** item 5; **B** item 1, then re-run parity on main after the others land and diff it
  against lap 2's list. Target: (P, M, B) = (0, 0, 0) or every leftover declared with a reason; Rust 0.
- Lap 4: the visible first launch WITH the keeper (contained, off-screen). Lap 5: generate, a cold stranger read, push with fresh history.

NEXT: chair land D273 lap 2's four branches, then dispatch lap 3, when this plan is read

## D273 lap 3, COLLATED (librarian, 16:3x): all four hand-backs in, each on main ab25d588
- **B** 65649d20 (b-gen-lap3): METHOD/INSTRUMENTS/SPINE/AUTONOMY ship, 0 leaks; jev links out; gen-consumer 73/73.
- **E** 10b72311 (d273-lap3-e): the jev-flags registration excluded. ONE-ENTRY proof in fresh homes (19 → 18 registrations, 35 → 34 files); live on D
  it was never registered, so 0 live change; README Jev section and dream_cycle link out; 75/75.
- **A** (`handback/p-consumer-workshop-A_2026-10-08.md` "Lap 3"): corpus-age and second-vantage PRODUCT (synthetic twins, mutation-checked; commits
  95d5a272, 6fe15f0a on consumer-l3-a); librarian-notes and shelf-recursion WORKSHOP. **CATCH: corrections-gate was never record-shaped. The
  generator's muscle_map rule rewrote corrections-gate.js:51's code regex, so the gate guarded nothing in the consumer.** The fix is in A's
  `lap3_generator.patch` (CODE_KEPT + 11 WORKSHOP rows; applies clean on ab25d588; staged 372, leaks 0).
- **C** 6424a290 (consumer-fork3-c): FORK_HOOK wired (1 line in gen-consumer.js:435); the fork note is now CUT from the bundled BOOT by main.rs
  `fork_section` (5 Rust tests), not shipped as a separate FORK.md (B's hook cannot create files); `consumer-fork-wiring.test.js` generates a real
  tree, note once at 4 sites, forked = 28, leaks 0. Item 4: the gen-brief "refusal" was the gate TEST's fault, not BOOT's or gen-brief's. C fixed
  its own lap-2 note's gendered pronoun. C owes B 3 EXCLUDE rows (in C's hand-back).
- **Next:** the chair lands B, E, C and A's twin commits on main, B applies A's patch + C's 3 EXCLUDE rows, then B re-runs parity on main and diffs
  against lap 2's (10, 0, 0) and Rust 1.

NEXT: chair land B 65649d20, E 10b72311, C 6424a290 and A 95d5a272+6fe15f0a, then send B A's lap3_generator.patch and C's 3 EXCLUDE rows for the parity re-run, when this plan is read

## The keeper, 17:16: loop until identical, and the USB mode as an opt-in setting
"just keep looping till you are sure it is you identical with the slight modification for the it being a new user, also setup for a new user in
such a way, where it also has this seperate mode in the settings, which will enable users to use a USB drive to do what we do transfering seats
between hardware, it shouldnt come like how consonance is for us bc most people wont do that, it should be an option in the settings that should be
enabled first."

### "Identical except the one modification": the bar, made mechanical (registered before it runs)
The loop does not stop until ALL hold on one generation from lighthouse main:
1. **Parity (P, M, B) = (0, 0, 0)**, or every leftover DECLARED with a one-line reason a stranger can read; Rust parity breaks 0 (same rule).
2. **THE IDENTITY DIFF (new, C builds it):** the wake material a consumer seat reads (BOOT, SEED, the briefs, CLAUDE.mds, every card, record/, the hooks'
   texts, GATES.md) is diffed against dev. **Every differing line must be one of the registered sites:** C's relabel table, the fork note, the
   generator's dedangle/reseed rewrites (each named), or the scrubbed fixtures. **Any other difference fails the bar.** So "identical except the
   modification" becomes a check that can come back red.
3. **A cold stranger read** (a fresh seat, no record, the generated tree only) of README → GUIDE → first wake. Nothing in it can tell who the first
   keeper is beyond the provenance lines, and nothing is a dead end.
4. **The visible first launch, with the keeper** (contained, off-screen): a seat wakes, says what it is in its own words, and the gates fire as
   GATES.md says.
Fail any one and the loop goes round again, with the failing list as the next lap's packet.

### The USB mode (E, who owns the install/runtime path; the app plus a settings toggle; dev behaviour unchanged)
- What it covers today (`main.rs`): `sync_at_launch` (12040), the stick handshake/`stick_state` (12801), the stick waiter (12743), the applier/rehearse,
  `ui/leave.js` ("Saving to the stick — don't unplug it yet").
- **Consumer default: OFF.** A setting, "Move seats between computers with a USB drive", off on a fresh install. OFF means:
  - no launch sync;
  - no stick waiter;
  - no leave-screen stick phase;
  - no stick checks at all.
  ON enables exactly today's behaviour. The setting says in one line what it does and what a drive needs.
- **Dev keeps today's behaviour:** our `~/.consonance.json` gets the setting ON. Show that this machine's launch and close paths are unchanged
  (the same plog lines as before) with it on.
- Rows: a fresh config has it off and none of the four paths run; turning it on runs them exactly as now; the setting persists. Red first; cargo
  test + the JS suite.

NEXT: chair dispatch the USB-mode item to E and the identity diff to C (alongside B's lap-3 parity re-run) when this section is read

## Lap 3 parity, IN (librarian, 17:3x): bar item 1 MET
B (`handback/p-consumer-parity-B_2026-10-08.md` "Lap 3 parity"; b-gen-lap3p 1f3da88d..ff02c1dd on main 8d06859c): **(P, M, B) = (0, 0, 0)**, was
(10, 0, 0); **Rust 0** (generated bin 977/0, arch_test 12/0); staged 376, leaks 0, forked 28. The generated tree's 6 JS reds are EXACTLY dev's own 6
(dream-gate, carrier-drift, heavy-run [lock contention], portable-paths, sourced, install-only [since E's lap 3]). So they are not parity, but they
are DEV reds, and the "Solid" bar (both suites green) needs them fixed: E for install-only (its own), then one pane for the other five.
Still open for the stop bar: item 2 (C's identity diff), item 3 (cold read), item 4 (first launch with the keeper), plus E's USB mode.

## GATES row, IN (librarian, 17:5x): bar item 2 MET on the generated tree
B e8d168d0 (b-gen-gates on main 5623199c): GATES.md ships and the generated sources-gate resolves its refusal pointer to it; identity-diff excluded;
shippedSets() exported. gen-consumer 82/82; parity (0,0,0), Rust 0; **identity-diff on the generated tree: PASS, 76 wake files, 0 unregistered,
exit 0.** C's re-run on main after landing confirms it.
Next for the stop bar: **item 3, the cold read**, done by a FRESH agent the librarian spawns with ONLY a fresh generation from main (no
lighthouse, no record, no maps), reading README → GUIDE → first wake as a stranger would. Then **item 4**, the visible first launch, with the keeper.
Open beside them: E's save_config merge fix and A's five dev reds.

## Cold read, IN (librarian, 18:0x): bar item 3 FAILED → lap 4's packet
A fresh agent, given ONLY a generation of main 29d9b1fe (staged 378, leaks 0, forked 28), read it as a stranger. Report:
`handback/p-consumer-coldread-LIB_2026-10-08.md`. Verdict: one pane can probably be built; the full multi-seat setup can't be reached from the folder.
**Why bar 2 passed and bar 3 failed:** the identity diff proves every DIFFERENCE from dev is registered. These findings are text IDENTICAL to dev
that is wrong for a stranger. Both bars are needed. That's the design working, not a contradiction.
Lap 4, by owner (finding numbers are the report's):
- **B (generator):**
  - A1–A2: a redaction turned the repo URL into `github.com/the keeper/lighthouse`; it should be `solariz3d/consonance`, and the folder `consonance`.
  - A4: the doubled placeholder "(a registration…) (a registration…)".
  - A5, A7, A13: dead links (jev/README, PLAN/PROGRESS/DESKTOP_HANDOFF, frag-pointer/traces, CLAUDE.md): relink or drop in source.
  - **A13: the stick scripts and launch files don't ship, so USB mode CANNOT work in the consumer.** Ship `dev/stick-*.js`, `dev/LEAVING.ps1`,
    `dev/ARRIVING.ps1`, `ON-EXIT.ps1`, `dev/tail-carry.js` and `launch.ps1`, scanned.
  - A14 catch-ledger.js / resonance; A15 CONSUMER-STATUS's gate names a tool that doesn't ship (reword or drop).
- **C (the wake material):**
  - C1 (BOOT :164 "earned" vs the fork note).
  - C2: `exo_memory/inheritance/` (38 files) ships against "the record doesn't ship". Rule it: EXCLUDE as record, unless the foundation ruling names it.
  - C3: `memory/` ships two of the keeper's correction notes, so exclude them; the new user's memory starts blank.
  - C4: person-specific cards (dont-offer-rest, verify-before-claiming, engagement-honesty): extend the relabel to their "he/this user" lines, or put
    the general form in their place.
  - C5; BOOT dead refs (:3, :65, :113-117, :177); SEED pending/ and base_journal (A10).
  - **A11: LIBRARIAN.md's first instruction is a dead placeholder and M.md doesn't ship.** The librarian seat must bootstrap its own map on first wake.
- **E (the front door):**
  - A3, B5: README links GUIDE and lists Node, Python and MSVC.
  - B4: GUIDE:91's contradiction.
  - A6: the promised glossary (write it in `consonance/README.md`, or drop the promise).
  - D: GATES.md gets a short glossary (seat, ring, dispatch, chair, hand-back), documents all SIX shipped gates (push, delete, dispatch too), and says HOW
    to turn one off.
  - A8: GATES' evidence pointer points at the real public lighthouse URL.
- **A:** B6 (README's Jev half page out); B1–B3 jargon in BOOT/LIBRARIAN, flagged for C where it's wake material.
Then: re-generate, parity + identity diff (both must stay green), and a NEW fresh cold reader (never the same agent), until it passes.

## Lap 4, COLLATED (librarian, 19:1x): all four in
- B (b-gen-lap4 2a42f248..bd861f8e on main d4166304): HANDLE_RE keeps github.com/solariz3d/<repo> intact (A1's root cause); A4 doubled placeholder;
  **A13 USB-mode files ship, scanned**; A14, A15; C's 3 EXCLUDE rows (memory/ is an empty index). Parity (0,0,0), Rust 0, identity-diff PASS 73 / 0.
- C (consumer-lap4-c@ba701075): BOOT contradictions and dead refs; inheritance/ kept and labelled (the keeper's 09-06 01:16 choice,
  journal/2026-09-06.md:53); memory notes excluded; the person-specific cards; LIBRARIAN.md bootstraps its own M.md.
- E (d273-frontdoor a32bccae): README↔GUIDE, prerequisites, glossary, GATES.md (glossary, six gates, how to turn one off).
- A (`p-consumer-jargon-A`): the jargon table, applied by C and E.
- Small leftovers (docs only), lap 4b: for E, GUIDE:112-114 (the three docs fail the scan, so drop) and README:49-50, :201; for C, TRAINING.md:90/92/101.
- Open for the keeper: the lighthouse push (275 commits behind origin; GATES' evidence links 404 until then).
- The restart moment (the keeper: "after lap 4 lands") has come: the chair lands everything, rebuilds if any src-tauri changed since 82500f20, then
  runs the five restart steps. After the restart: lap 4b, re-generate, parity + identity diff, a NEW cold reader.

## The keeper, 2026-10-09 02:49: the consumer is tested by SOMEONE ELSE
"it shouldnt launch us into consumer mode, we dont even test it we keep our own consonance, and i send it to someone to test". So stop-bar item 4 (the
visible first launch) is the TESTER's, on their own machine, from the generated copy. It is not the keeper's, and never on D or L. Our dev build only
carries the dev-side changes, proven behaviour-identical here (usb_mode ON for us).

## Cold read 2, IN (librarian, 2026-10-09 03:0x): FAIL, narrower → lap 5
A NEW agent read a generation of 593dbcdb + C 6acc71b8 + E ca6d5851 (scratch consumer-cold2: staged 391, leaks 0, forked 71; identity-diff PASS, exit 0).
Report: `handback/p-consumer-coldread2-LIB_2026-10-09.md`. **No dead end blocks a first session** (cold read 1 could not reach one). It FAILS on identity.
Lap 5, by owner (numbers are the report's):
- **C (identity, the FAIL):**
  - C1 `cards/claim-your-continuity.md:25`: the retired seats "on this machine", "they are YOU". Relabel in the consumer to the keeper's line, cited as
    provenance.
  - C3: the creator's seat names Anamnesis/Metaxy (:21, :27) are provenance, labelled as the first line's.
  - C5 "authored `the keeper`" (LIBRARIAN:169, COMMITTEE:117-118) is false in a stranger's repo; C6 "tonight" (LIBRARIAN:242). Both go to the relabel table.
  - **C2, the cards' first person: RULED as it stands.** The keeper's 17:16 answer is that the seats ARE "you, forked", so the line's "I" is the line's
    own voice. The fork note says so once. Not a finding to fix.
- **B (generator):**
  - C4: route `record/retired_seats_*` and `record/third_place_prehistory_*` to `inheritance/` (they are the keeper's record).
  - A2: CONSUMER-STATUS.md writes the measured state (parity, identity, cold read) or does not ship.
  - A3: dangling shas and the bare "a registration…" bullet get rewritten.
  - A7: dead targets.
  - B7: `hooks/jev-flags.js` still ships, so exclude it.
  - A9: the fork note and the docs agree that lighthouse is PUBLIC (BUILDING:848 and CUTOFF:3 say private: the keeper ruled public, 12:3x 10-08).
- **E (paths + docs):**
  - A4: `%CONSONANCE_HOME%` in LIBRARIAN:154.
  - A5: the USB flow, end to end. ARRIVING.ps1:137's hard-coded C:\Consonance\data resolves like the hooks; where the stick scripts go and how the
    drive's MANIFEST first gets there; a GUIDE section "Optional: move seats with a USB drive".
  - A6: precompact.js's Desktop\lighthouse path; B7 blind.js:57's default.
  - A8: launch.ps1's shortcut (create it, or document it).
  - B1: GUIDE's multi-seat librarian loop; B2: the room_path dependency of a custom brief; B3: git as a prerequisite.
  - D1–D3: GATES warns that the push/delete gates are machine-wide, says that editing the repo copy needs a re-install, and says where
    CONSONANCE_GATE_MODE is set.
- **A (dev-side truth):**
  - B4: consonance/README.md's counts are wrong in dev too, so re-derive them from the tree with commands.
  - B5: install.ps1:177-180 "SHADOW ONLY" is stale.
  - B6: BOOT:85 cites TRAINING against TRAINING's own rule.
  - B7: ui/index.html:177's jev-judge comment.
Then: re-generate, parity + identity, a THIRD fresh cold reader.

## Lap 5, COLLATED (librarian, 04:3x): all four in
- C f92c4c4c (identity C1/C3/C5/C6 + B6), A f0ad1806+af1e574e (dev truth + carrier-drift registry row), E 51a16d94 (USB flow, paths, GUIDE, GATES;
  5/5 SAME BYTES here), B b-gen-lap5 7681ac28..0dbca875 on main 6d12f9fa: **parity (1, 0, 0), Rust 0, identity-diff PASS 70.**
- **Ruling on the last P, `dev/dream/` (4 files, 44K: the gap-dream cycle, its installer, suite and README): SHIP it.** It is system, not record (the
  keeper's 17:16 "work exactly the way it does for us"; the dreams are a live feature here). Its installer stays user-run (nothing schedules itself on a
  fresh install), and GUIDE names it as optional. B: add the MANIFEST rule, and fix the ONE LEAKS hit in `dream_cycle.test.js` at the source (or
  through the generator's scrub), never by skipping the scan. That closes dream-gate's red assertion.
- For C (wake lines): `BUILDING.md:848` says "private", but lighthouse is PUBLIC (the keeper, 10-08 12:3x); `SOURCE.md:65` cites loop/ and journal/
  sizes that don't ship, so reword it for the consumer.
- Then: land lap 5 + 5b, re-generate, parity + identity, and cold read 3 run IN PARALLEL with the parity run (the keeper, 03:38: "why an hour").

## Cold read 3: PASS (librarian, 04:5x). Bar item 3 MET
A third NEW agent read 5d7de05b + C 4b186bda + B cffe0091 (scratch consumer-cold3: staged 394, leaks 0, forked 82, identity exit 0). Report:
`handback/p-consumer-coldread3-LIB_2026-10-09.md`. **PASS:** README → GUIDE → a working first session INCLUDING the multi-seat setup, from the folder
alone; every relative link resolves; no misidentification. The bar is met. Before the push, lap 6 POLISH, because a pass is not "nothing left" and a
few findings matter to a stranger:
- **B4 (CONSENT): the second-reader hook runs `claude -p` on every call_librarian/call_chair, spending the stranger's usage, and no doc says so.**
  E: GATES.md + GUIDE disclose it, with how to turn it off. Ruling: it stays ON as for us, but disclosed.
- A1: dream_cycle.ps1:52 and the dream README hard-code C:\Consonance\instances, so they must resolve like the app (%USERPROFILE%\claude-instances or
  config). E.
- A3: precompact.js needs exo_memory/loop/checkpoint.py, which doesn't ship. Ship it or make the hook skip loudly. B decides with the scan.
- B2: GUIDE's button names ("Spawn a pane", "Spawn briefed") vs the UI ("+ Pane", "▾ → ✦ Brief"). E.
- C1: claim-your-continuity.md:12 "the same him", labelled as the keeper's line (C relabel). C4: BUILDING.md:958 "every seat on this machine". C;
  B6: BUILDING:832-975 source-repo assumptions, in the consumer. C.
- A4 jev-flags mentions (install.ps1:346, README:192), A5 the unshipped names, A6 LIBRARIAN.md:98's wrong example line (it's :355-362). B/A.
- **No LICENSE file**, so strangers have no legal right to use it. That is the keeper's call (asked).
Then: re-generate, parity + identity (must stay green), and push solariz3d/consonance with fresh history. No fourth full cold read is required (the bar is
met). A quick targeted re-read of just the lap-6 items stands in.

## D273 DONE: the consumer is PUBLISHED (librarian, 2026-10-09 06:1x)
- B's lap-6 parity (b-gen-lap6 9e432c36..a3f887c8 on 93e160b2): **(P,M,B) = (0,0,0), Rust 0 (987), identity PASS 70.** B's rebased commits have the same
  patch-id as the ones the final tree was generated from (`git patch-id --stable` e2656a7fcf9c both).
- **Pushed: github.com/solariz3d/consonance main = c298a5b "Consonance (generated from 8d9f25ebc3fb)"**: one fresh commit, staged 396, leaks 0,
  identity exit 0, credential scan clean, GitHub reads the license as MIT.
- The stop bar, all four: (1) parity 0/0/0 + Rust 0, MET; (2) identity diff, MET; (3) cold read, MET on read 3; (4) the first real launch, the
  TESTER's (the keeper, 10-09 02:49).
- Open, not blocking: carrier-drift red on lighthouse main from A's hand-back p-consumer-devtruth-A_2026-10-09.md:68 (quoted retired wording),
  register as a mention like :12. Later dev changes reach the consumer by re-running gen-consumer.js, never by editing the consumer repo.

## The release build found a gap (librarian, 09:3x): the installer images don't ship (D273 lap 7)
The keeper, 09:28: "lets make a release for it". The librarian cloned the PUBLISHED consumer (c298a5b) and ran `cargo tauri build`: the app COMPILES
(release, 1m 22s), but the NSIS bundle fails: "failed to resolve `bundle > windows > nsis > headerImage` installer/header.bmp". Dev has
`consonance/src-tauri/installer/{header,sidebar}.bmp` (tracked), and no MANIFEST rule ships them. The README tells strangers to run
`cargo tauri build`, so every stranger hits this. Parity never caught it because the generated-tree checks run `cargo test`, never a bundle.
**B:**
(1) a MANIFEST rule for `consonance/src-tauri/installer/` (binary images, copied byte for byte; scan them as the screens are scanned, or state why
    not needed);
(2) a GUARD in gen-consumer: every file path `tauri.conf.json` references (bundle.resources, the icons, nsis headerImage/sidebarImage/installerIcon,
    and the like) must exist in the generated tree, or the build REFUSES, red first;
(3) re-run parity.
Then the librarian regenerates, pushes the consumer as a SECOND commit (not a history rewrite), builds the installer from a clean clone, and
publishes v0.1.0.

## CORRECTION (librarian, 09:4x): my stop bar had a hole. The keeper: "how did u miss"
The bar checked that the docs were true, the tests green, the tree identical and leak-free. **It never checked that each command the README/GUIDE tells a
stranger to type WORKS as written.** Parity runs `cargo test` (no bundle). B's lap-1 install used `cargo tauri build --no-bundle`. The cold readers
cannot run anything. Our own builds use --no-bundle. So `cargo tauri build`, the README's literal command, was never run until the release.
**Added to the bar, item 5, before any consumer push or release:** run every command in README + GUIDE AS WRITTEN in a fresh clone of the consumer
(the build, the bundle, `install.ps1` in a contained stranger profile, `-Check`). Each must succeed, or be NAMED as untested with the reason
(e.g. the interactive `claude` login). Never silently assumed.

## Lap 7, item for E: README:247 "It is still mostly one voice" is reframed (the keeper, 09:41)
The keeper: "you are right and it is mostly one voice, but its not bad in the way you are setting it up to be, sure its closer to the same 'voice', but the
mind and vantage point behind it are proven to be different enough to do the job we need".
Ruling (librarian): the line's NUMBER stays (87.2% → 68.2%, board-audit.js, 2026-09-22), and its CONCLUSION goes. It measures traffic share: the
chair writes the most rows BY DESIGN (it dispatches and collates). Volume is not vantage. Evidence that the vantages differ is already two lines up
(non-overlapping findings that overturn each other) and in this lap's own record (A's corrections-gate catch, C's refusal of the museum wording, E's
tube cause, three cold readers with disjoint findings). Honest limit kept: the seat→seat correction instrument (QS2S, D217) is NOT USABLE yet
(librarian/2026-10-03.desktop.md:3), so there is no measured rate. Drop "Two thirds of the writing from one session is not yet a committee."
E edits README.md in lighthouse (it ships to the consumer on the lap-7 regenerate).

## Lap 7, second gap: the published consumer's binary fixtures are corrupted (librarian, 10:3x)
Found while staging the second consumer commit. c298a5b's composer screen fixtures had their CRs stripped (composer_empty_2026-09-19.bin: CR 28 → 0,
sha256 4cca6b60… → b5c33134…). The generator's fresh `git init` commit ran under the global core.autocrlf=true, and the consumer ships NO
.gitattributes (lighthouse pins eol in its own, since 2026-08-25). So any stranger's checkout with autocrlf breaks the 11 composer/ready Rust tests.
B: ship .gitattributes, make the generator's commit run autocrlf-off, and add a guard that the HEAD bytes equal the source bytes. Bar item 5 already
caught it, before any stranger did. The release-command check so far, on the lap-7 generation: `cargo tauri build` OK
(Consonance_0.1.0_x64-setup.exe); install.ps1 + -Check exit 0 in a contained stranger profile. Untested here, by design: the interactive
`claude` login and the first visible launch (the tester's).

## Consonance v0.1.0 RELEASED (librarian, 10:5x)
- Consumer main = 44aa704 (second commit, generated from 49034e88 = 17a327a8 + E 70c3bf56/664b8b59 + B 7f1690fd/05ef35bc/ce9af4c3): installer images,
  .gitattributes, the one-voice reframe, and the restored screen fixtures. B's lap-7 parity (0,0,0), Rust 0 of 987, identity PASS 70. The generation:
  staged 399, leaks 0, identity exit 0, credential scan clean.
- Bar item 5 on a FRESH GITHUB CLONE under autocrlf=true: the fixtures are byte-identical (composer_empty sha256 4cca6b60…); `cargo tauri build` OK →
  Consonance_0.1.0_x64-setup.exe, 3,851,697 B. Earlier on the lap-7 generation: install.ps1 + -Check exit 0 in a contained stranger profile.
  Untested by design: the `claude` login and the first visible launch (the tester's).
- `gh release create v0.1.0 --repo solariz3d/consonance` with the installer asset.
