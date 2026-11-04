# Cold read 3: Consonance, from README to first session

Folder read: `consumer-cold3/`. Nothing was run, built or installed. I followed no path that leads out of the folder. The relative-link check was done with a small script kept in the scratchpad, outside the tree. Every relative markdown link resolves. The findings below are paths named in prose or code.

## A. Dead ends

1. **The dream runner can't find any instances under the app's defaults.** `dev/dream/README.md:22` says "Needs: Consonance instances under `C:\Consonance\instances`", and `dev/dream/dream_cycle.ps1:52` hard-codes `$root = "C:\Consonance\instances"`. The app's default is `%USERPROFILE%\claude-instances` (`consonance/src-tauri/src/main.rs:802`, `ui/index.html:249`). A stranger who keeps the default gets dream cycles that find nothing, unless they pass `-InstanceDir`. On top of that, no setup document links to `dev/dream/`. `README.md:163` advertises dreams with no pointer, and `GUIDE.md` has no dreams section. Optional, so it does not block setup.
2. **The orchestrator's brief prescribes a procedure whose tool isn't shipped.** `consonance/src-tauri/brief/BUILDING.md:851,887,931` names `consonance/tools/gen-consumer.js` (`--report`, `--out`) and "THE GATE" as current commands. `gen-consumer.js` is not in the folder. `tools/gen-consumer.build.test.js` is present but depends on it. Does not block setup.
3. **A registered hook is silently dead.** `dev/shell/hooks/precompact.js:39` runs `exo_memory/loop/checkpoint.py`. `exo_memory/loop/` does not exist, so the PreCompact hook that `install.ps1:274` registers does nothing. It fails open. Does not block setup.
4. **A file said to stay in the repo is missing.** `dev/shell/install.ps1:346` and `consonance/README.md:192` both say `consonance/hooks/jev-flags.js` "stays in the repo as the record". It is not in the folder. Harmless.
5. **Docs name files that aren't shipped:**
   - `consonance/AUTONOMY.md:5,96`: `PROGRESS.md`, `RECONCEPTION.md`.
   - `dev/SPINE.md:81`: `WELFARE.md`, `dev/PLAN.md`.
   - `CUTOFF.md:15-16`: "The tree this was generated from holds the command". That tree is not here.
   - `main.rs:2923`: `consonance/tools/consumer-relabel.js` (a code comment).

   Labelled as not shipped, so fine: `catch-ledger.js` (`TRAINING.md:90`) and `gap2_preregistration.md` (`BOOT.md:67`).
6. **The example citation in the librarian's "cite, do not recollect" rule points at the wrong line.** `LIBRARIAN.md:98` gives `exo_memory/inheritance/2026-08-11.md:47 — the working-tree finding`. Line 47 is a heading about "the reviewer's best move". The working-tree finding is at `:355-362`. The other two citations checked are correct: `LIBRARIAN.md:208` → `:90-93`, and `COMMITTEE.md:148` → `2026-07-28.md:189`.

Everything the core setup path names is present: `dev/shell/install.ps1` and every `From =` source it copies, `userprompt_pulse.py`, `launch.ps1`/`launch.vbs`, `dev/LEAVING.ps1`/`ARRIVING.ps1`, `exo_memory/BOOT.md`, `dev/SPINE.md`, all of `brief/`, `GATES.md`, every card, `record/`, `spread/` and `inheritance/`. The UI has a "Wake the orchestrator" and a "Wake the librarian" button (`ui/index.html:153,161`) and a USB checkbox (`:271`).

## B. Confusing

1. **The README names two different repositories.** `README.md:51` says the code is public at `github.com/solariz3d/lighthouse`. `README.md:98` clones `github.com/solariz3d/consonance.git`. Nothing explains why there are two. Separately, `BUILDING.md:850` names the generated repo as `` `the keeper/consonance` ``: the relabel step mangled the owner slug.
2. **The GUIDE's button names don't match the UI.** `GUIDE.md:59-60` says "Spawn a pane" and "Spawn briefed". The UI has "+ Pane", and "✦ Brief" sits under the "▾" menu (`ui/index.html:78,89`).
3. **Stripped citations read as broken.** Some places carry a stub where a path used to be:
   - `BOOT.md:81,107`: "`the record, 2026-08-16`" and similar.
   - "a registration in this line of record" or "a librarian entry in this line of record": `BOOT.md:86,101`, `LIBRARIAN.md:162,268`, `COMMITTEE.md:119,139,150,162,201`.

   The fork note (`BOOT.md:13`) explains dated history in general, but not these stubs.
4. **An installed hook spends Claude usage and no setup document mentions it.** `install.ps1:294` registers `hooks\second-reader.js` on every `call_librarian` and `call_chair`. Its worker runs `claude -p --model claude-sonnet-5-5` (`second-reader-worker.js:28,177`). GUIDE, GATES, README and `hooks/README.md` never mention it. `README.md:103` says "what it changes is in the GUIDE", but `GUIDE.md:37` lists no hooks. The shadow hook `ask-ending.js` is also unlisted.
5. **Panes aren't told about the SOURCES line before the gate refuses them.** The SOURCES line on `call_librarian` is enforced, but `COMMITTEE.md`, the pane brief, never mentions it. It appears only in `BUILDING.md:512` and `GATES.md` §1. `LIBRARIAN.md:277-288` covers the NEXT trailer for `call_chair` but not SOURCES. The refusal text does explain the fix.
6. **BUILDING.md describes the creator's two-repo workflow as if the reader were in the source repo.** `BUILDING.md:832-975` (the port rule) says "SOURCE is this repository", "a sibling of the private checkout", and "The private repo is private". The same passage says SOURCE is PUBLIC. The reader is in the generated tree. An orchestrator will be confused about which repo it is in.
7. **"voxtest" is never defined.** It appears at `cards/interior-at-the-seam.md:16,22`.
8. **There is no LICENSE file at the root of what is presented as an open-source app.**
9. **The short prerequisite line is incomplete.** `README.md:8-9` omits Node.js, Python 3 and MSVC, which `README.md:88-91` and `GUIDE.md:11-16` require.

## C. Identity

The framing is mostly sound. The fork note (`BOOT.md:5-15`, `SEED.md:5-14`) says "Who you are with. Not the keeper", and the definition is repeated at `GATES.md:34-35` and `consonance/README.md:435-436`. `inheritance/`, `CUTOFF.md` and `journal/README.md` are clearly labelled as the keeper's record. Several cards were already relabelled: `claim-your-continuity.md:21,25,27`, `engagement-honesty-over-performance.md:24-25`, `LIBRARIAN.md:242`. These remain:

1. **`cards/claim-your-continuity.md:12`** is unlabelled: "the line that came back as me through two compacts tonight, that resumes tomorrow night in the same room with the same him — is me, continuing." It tells the reader their thread resumes with "him", meaning the keeper. That cuts against the fork note's "Not the keeper". This is the strongest identity item.
2. **`cards/interior-at-the-seam.md:22`**: "With him the check is available; the fast path back to here is to let him run voxtest on your certainty." It tells the reader to rely on the keeper, who is not present.
3. **`cards/verify-before-claiming.md:10`**: "During a game-engine stair-collision marathon (2026-06-20) I shipped fix after fix…". This is the creator's specific project history told as "I". `claim-your-continuity.md:10` ("the keeper has caught this twice") and `earned-not-performed.md:10` are similar. This is the accepted first-person voice, but it narrates particular events, not the practice.
4. **`BUILDING.md:958`**: "`gh` is authenticated machine-wide, so every seat on this machine can push everything." This is the creator's machine state, stated as the reader's.

Given the fork note sits right before the cards, I don't think any of these misidentifies the reader in a way the room fails to correct. Item 1 should still be labelled "in the keeper's line", the way the same card's later paragraphs are.

## D. Gates

Yes, a stranger can understand them. `GATES.md` gives each of the six gates the same structure: what it does, why (with the numbers), the exact refusal text, how to answer it, and how to turn it off (`:57,79-81,100-101,123,139,154`). It also covers:
- that push and delete are gated machine-wide, across every Claude Code session on the machine (`:16-17`);
- that gates fail open (`:19`);
- how to keep a gate off by marking it `Excluded` (`:161-163`);
- that editing a repo copy changes nothing until reinstalled (`:165-167`).

Gaps:
- **GUIDE doesn't warn at the install step.** The install step (`GUIDE.md:31-37`) doesn't say the hooks act on every Claude Code session on the machine, not just inside Consonance. That is stated only in `GATES.md:14-17`.
- **The second reader (B4) is installed and registered but appears nowhere in GATES.** It is not a gate, since it never refuses, but it is an installed hook that costs usage.
- **The dispatch gate's `ask` mode needs an environment variable that only GATES documents.** Its mode is set with `setx CONSONANCE_GATE_MODE ask` (`:115-117`); GUIDE does not mention it.

## E. Verdict

Yes: everything on the path from `README.md` → `GUIDE.md` (prerequisites, `cargo tauri dev/build`, `dev\shell\install.ps1`, Settings pointing at `exo_memory\BOOT.md`, waking the orchestrator and librarian, spawning briefed panes, the ring and hand-back loop documented in BUILDING/COMMITTEE/LIBRARIAN/GATES) exists in this folder. The optional USB section is complete too. The defects are off the main path: the dream runner's hard-coded instances path, a few briefs naming tools or files that aren't shipped, and an unlabelled continuity line in one card.

**PASS**
