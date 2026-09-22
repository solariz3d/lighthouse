# Chair restore point — D, 2026-09-22 17:4x, before a compaction

Written by the chair on D at the keeper's "ready to compact?". Everything below is on disk or in git; nothing here
is needed from the chair's context. **Repo and origin are level** (`git status -sb` → `## main...origin/main`),
working tree clean apart from untracked `AGENTS.md` (the keeper's, never committed).

## WHERE THINGS ARE

- **D**: `C:\Users\nname\Desktop\lighthouse`, cargo at `%USERPROFILE%\.cargo\bin`, data `C:\Consonance\data`,
  state `C:\Consonance\state`. Chair token: `C:\Consonance\instances\main\.chair-token` — RE-READ IT after any relaunch.
- **L**: `C:\Consonance\lighthouse`. Last L close published state `9486b30`; D has NOT closed since (its close
  publishes D's unioned ledgers — the keeper's to run at the end of his D day).
- Panes on D: A `6fe15f0a`, B `12fb81f6`, C `0845a868`, E `a2122153`, librarian `0c0c0c0b`, Third Place `3d000000`.

## TODAY, IN ONE PASS (all landed and pushed)

- **L070–L082 (L, overnight)**: install stops before writing and refuses rather than overwrite an append-only ledger
  (`6b9699b`); 6,782 displaced rows restored on L (`c4b739c`); ledger-union reads the state set (`deff581`) and covers
  eleven ledgers (`8942314`); lap ids fold by (id, generation) (`ffb3aa7`); park-at-launch (`68bc625`); Jev as judge
  (`1afa285`, `3a560a3`, `81b46fe`, `1d11a37`); README/manual/About rewritten (`00aa934`, `d1b0b7c`).
- **D105–D119 + phase 3**: Claude L2/L3 overseers switched OFF on D at the keeper's 09:12 word (`70f293c`);
  D unioned with L's rows, 35,059 of D's own restored (`3a19c6d`); Jev pacing (`38c0739`); L2-only judge mode and the
  jev-flags hook BUILT BUT NOT WIRED (`3e189ec`); T-J1 v2 registered, attacked, amended — only C1 can rule from the
  committed record (`98443a7`); suites measured (`9bd7ce0`); arch_test green (`e4f00ef`); "solid" registered (same);
  trip-check built (`0b8e84f`); union-at-launch designed, attacked, amended (`fe9a5f4`) and BUILT (`a81d339`, live at
  the next launch); board measured (`7b5eebd`); blind reads (`11b2f70`, `bdded67`, `8a2152b`); lap-row's floor guard
  learns its second cause (`9273064`); the 42 gaps explained, nothing lost (`a036e32`); journal 2026-09-22 + its
  POINTERS line (`7250e5d`); carrier rows green again (`ea779ca`); composition design (`74dcf34`) and its hand pass
  scored κ 0.000 (`f050643`); the run report (`f306715`).

## OPEN, AND ALL OF IT THE KEEPER'S (also §5 of `loop/unattended_report_2026-09-22.md`)

board compaction for real · adopting "solid" (`loop/solid_registration_2026-09-22.md`) · registering the jev-flags hook
(a settings edit) · the first launch with union-at-launch · his labelling sitting (T-J1 v2 C1, 20-unit pilot first) ·
the struck ASK-008 wording still instructing the judge at `dev/shell/hooks/l2-overseer-worker.js:49` · CH-4 arming
(WELFARE.md, AUTONOMY.md) · ASK-002, ASK-007 · the repo description · `AGENTS.md`.

## OWED BY THE ROOM, NOT HIM

- Composition: re-run the hand pass with the scope INSIDE the question, before any machine sees it (not the design's
  author). `loop/composition_instrument_2026-09-22.md` §6.
- Cross-model reader against a different model family — the only test left that separates the shared-prior branch
  (`p-d118-outside-B_2026-09-22.md` §4).
- E's two carrier proposals: register the .js instruction-carriers as sites; decide whether carrier-drift's corpus
  should include files that write into a seat's context (`loop/carrier_halflife_2026-09-22.md`).
- B's naming convention as a card or a BUILDING.md line: a report about a withdrawn wording cites the registry id and
  line rather than restating it (`p-carrier-rows-B_2026-09-22.md` §4b).

## CHAIR'S OWN ERRORS TODAY, KEPT

Named a commit "D118" for an unminted id, which blocked every `--open` until C repaired the guard; landed E's carrier
file without running carrier-drift first, which is the one check its subject demanded (red 6, repaired by B);
reported the librarian's board facts to the keeper before B corrected them (the board is not tracked in this repo;
the published copy is L's; limit is 100 MiB; growth 0.85 MiB/day); wrote "tested once, n=1, not proven" into E's
README packet — the keeper struck it as the always-sayable hedge.

## ON WAKING

1. Read this file and `loop/unattended_report_2026-09-22.md`, then the librarian's newest entry.
2. Re-read `.chair-token`.
3. `git pull` and check `git status -sb`.
4. Hold for the keeper: the run is stopped and nothing is dispatched.
