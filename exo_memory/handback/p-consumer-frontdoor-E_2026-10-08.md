# p-consumer-frontdoor-E · D273 lap 4: the front door · pane E, on D, 2026-10-08 · DONE

**Commit `a32bccae`** on lighthouse `29d9b1fe`, branch `d273-frontdoor`, my own worktree `C:/Users/nname/Desktop/worktrees/e-front-wt`. 7 paths
(6 edited and 1 new test), not pushed, not landed. Main has since moved to `82500f20`. That commit touches none of my 7 paths
(`git log 29d9b1fe..main -- <paths>` is empty), so landing applies cleanly.

## What each item became (from the cold read, `p-consumer-coldread-LIB_2026-10-08.md`)
- **A3 and B5, the prerequisites and the GUIDE link.**
  - README "Try it" now lists **MSVC Build Tools**, and **Node.js and Python 3, installed before the hooks**, worded as in `consonance/GUIDE.md:10-17`.
  - It links `consonance/GUIDE.md` and gives the hooks install line (`dev\shell\install.ps1`) after `cargo tauri dev`.
  - "Go deeper" also points to the GUIDE.
  - `consonance/README.md` "Build" says the same thing: there is no Node at runtime, but the hooks need Node and Python.
- **B4, the diversity bet.** `GUIDE.md:91` no longer says that conditioning the panes differently is the defence. It now says this was the founding bet,
  and that the bet was measured not to hold. It cites GUIDE step 3 (:71) and the README's "The founding bet was wrong", so the three places agree.
  What survives is in the README's own words: panes required to measure rather than assert, plus you reading the disagreements.
- **A6, the glossary.** Written, not dropped: `consonance/README.md` now has a `## Glossary` section with 21 entries (counted: `sed -n '/^## Glossary/,/^## Where/p' consonance/README.md | grep -c '^- \*\*'`), including seat, pane, chair, librarian,
  hand-back, ring, dispatch, collation, map, board/phase, mount, gate, hook, keep-warm, room and the keeper. The README links it as `consonance/README.md#glossary`,
  and GUIDE:3 and :111 point to it. "Complete" is dropped from GUIDE:111.
- **D, B1 and A8, GATES.md.**
  - **Six gates.** GATES.md now documents the six shipped gates:
    - §1 SOURCES and §2 the reply slot keep their section numbers, which the refusal pointers in `sources-gate.js` and `reply-slot.js` name;
    - §3 the NEXT trailer;
    - new: §4 the dispatch gate, §5 the push gate, §6 the delete gate.
  - **What each section gives.** What the gate does, why, its refusal text (taken from each hook's own string), how to answer it, and **"To turn it off:"**
    with the exact file or setting:
    - **§1, §4, §5, §6:** the hook's entry in `%USERPROFILE%\.claude\settings.json`, under `hooks → PreToolUse`;
    - **§2 the reply slot:** `SHADOW = true` in `consonance/hooks/reply-slot.js`, or its `Stop` entry;
    - **§3 the NEXT trailer:** `consonance/src-tauri/src/trailer.rs` `fn policy` and a rebuild. It is not a hook.
  - **Keeping a gate off.** The closing section says to mark the gate `Excluded` in `dev\shell\install.ps1`'s `$register`, because a bare re-run would put it back.
  - **Glossary.** A short glossary follows the opening: seat or pane, chair = Orchestrator, librarian, hand-back, ring, dispatch, collation, and
    the keeper = the person who built it ("in your own room, whoever keeps it is you").
  - **Evidence links.** The three evidence pointers are now links of the form `https://github.com/solariz3d/lighthouse/blob/main/exo_memory/loop/<file>`.
- **B6, retired Jev (A's list, `p-consumer-jargon-A_2026-10-08.md` Part A). I took rows A1–A5, A7 and A8 as A wrote them.**
  - A1 is the "Know before" bullet, A2 and A3 the About bullet and "not Jev,", A4 the Third Place row's second sentence, and A5 the section, now a tombstone in A's wording.
  - The three removed passages were moved **verbatim, by exact line range at `29d9b1fe`** (75–78, 107–110, 257–275) into
    `exo_memory/loop/readme_history_2026-09-25.md`. The script checked each block byte for byte after writing. A said 257–273; the section actually runs to 275.
  - Row A6 (a hand-back's file name) is left alone, as A said.
- **One file outside my four: `consonance/ui/index.html`.** A2 and A3 are tied word for word to the About tab by `about-readme.test.js`, so A7 has to be
  the same edit (`<li>` deleted, "not Jev," deleted). I also cut the Third Place tab's `title=` Jev clause (A8), to match A4. The HTML comment at :176–184
  is left alone. **If index.html belongs to another seat this lap, this is the line to check.**

## Tests (all under the lock)
- **New: `consonance/tools/front-door-links.test.js`, 3 rows:**
  1. every relative link and `#anchor` in the four documents resolves;
  2. the README links the GUIDE and the glossary, and the glossary heading exists;
  3. GATES.md has six numbered gate sections, each with "To turn it off:", and each public-repo link names a path in this tree.
- **Red first:** on a `git archive 29d9b1fe` copy, rows 2 and 3 fail and row 1 passes, because the base's links already resolved. On the branch it is **3/3**.
- **Targeted run:** **192/192, 0 fail** (`front/targeted2.tap` sha256 `e7d394a1…`). It ran the new test, gen-consumer (including the "GATES.md ships, no leak,
  the refusal pointer resolves" row), identity-diff, reply-slot, sources-gate, and every `consonance/ui/*.test.js` that reads index.html:
  about-readme, chain-indicator, gate-card-routing, librarian-wiring, scripts-load, third-place-wiring, usb-mode-wiring.
- **Not run:** cargo `arch_test::every_relative_link_in_the_docs_exists_in_a_fresh_clone`. I read it instead: it splits off `#anchors` (`arch_test.rs:701`)
  and skips http links (:698), and every new relative target is a tracked file.
- **Credential scan:** 0 hits for `sk-or-`, `vck_` and `sk-ant-` in all 7 paths.
- **Lock note:** on my second run, heavy-run itself took over B's lock as stale (pid 3168 was not running, 2 minutes old). I did not remove it by hand.

## For the chair and B: two things that keep A8 from being done in the consumer
1. **The public repo does not have the evidence files yet.** `git ls-remote origin refs/heads/main` = `ce44d781`, the 2026-09-28 head, which is behind local main.
   The three `exo_memory/loop/*.md` paths exist in this tree, and the test pins that, but they appear on github.com only after the keeper's next push.
2. **The generator rewrites the handle inside the URL.** `consonance/tools/gen-consumer.js:1369` is `rep(/solariz3d/gi, 'the keeper')`. In the consumer it turns
   all three GATES links (and README's) into `github.com/the keeper/lighthouse`, which is cold-read A1. That file is B's: the public repo URL needs an exemption there.

## Not done
- **B's dead-link lines for this lap had not reached me** when I committed. B's parity hand-back holds only lap 3's items for E, and those were done in lap 3.
  When they arrive I take them on this branch.
- `GUIDE.md:112-114` (PLAN.md, PROGRESS.md and DESKTOP_HANDOFF.md, cold A7) are bare names, not links, so no link test sees them. I left them for B's dead-link
  list rather than guess.
