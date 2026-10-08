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
