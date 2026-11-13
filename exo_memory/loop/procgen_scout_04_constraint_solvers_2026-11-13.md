# Procgen scout 04: constraint solvers and global guarantees (2026-11-13)

Game repo read at commit 04f3882. Marks: [read] opened and read; [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal. His words: [his N] in briefs/dreamzone2_the_game.md. Nothing was built or run.

## 1. What the sources do

| source | what it says | mark |
|---|---|---|
| Gumin, WaveFunctionCollapse README, github.com/mxgmn/WaveFunctionCollapse (licence not on the page) | Every cell holds a set of allowed patterns. Observe the lowest-entropy cell, collapse it, propagate bans to neighbours. On a contradiction the run stops without returning anything; no backtracking. It "supports constraints", such as autocompleting a human-started level. Weakness stated: in easy tilesets "correlations of tiles ... quickly fall off with a distance". | [read] |
| Merrell, "Comparing Model Synthesis and Wave Function Collapse", 2021 (paulmerrell.org/wp-content/uploads/2021/07/comparison.pdf; no licence shown) | Same algorithm as WFC with two differences: scanline cell order, and "modifying in blocks". For some inputs, solving whole is NP-hard (he cites his thesis, Theorem 3.3.4) and success falls fast with output size; blocks fix that. Model synthesis "can generate in a few seconds what WFC fails to generate in over 20 minutes", and is slower than WFC on small outputs. Cell order matters more than blocks on his large textures. | [read] (thesis not read) |
| Boris the Brave, "Model Synthesis and Modifying in Blocks", boristhebrave.com/2021/10/26/ | Overlapping blocks solved one at a time; a block that fails restarts alone. Each block pins its open borders to a "known good" tile set, with fallback to it. Made a 30x30x10 output that plain restarts could not. Costs: redundant work, "a large number of tuning parameters", a pre-specified known-good arrangement, order sensitivity. | [read] |
| Boris the Brave, "WFC tips and tricks", "Constraint-based tile generators", "Driven WFC" | WFC "doesn't have any global structure" and gets "samey" on large maps. His Path constraint "looks globally" and forces annotated tiles into one connected component; without it WFC "will often generate a bunch of disconnected rooms". Pin the endpoints and the constraint fills the route between. Large-scale structure comes from a driver (a heightmap, a user's drawing) turned into constraints, or from subdividing the map (Caves of Qud, as he reports it). Contradictions: restart, backtrack, blocks, clause learning. | [read] (Caves of Qud talk not read) |
| DeBroglie constraints page, boristhebrave.github.io/DeBroglie/api/DeBroglie.Constraints.html (no licence visible) | The catalogue of global constraints: Connected, Acyclic, Loop ("any two connected points have at least two routes"), Count, MaxConsecutive, Separation, PairSeparation, Border, FixedTile, Symmetry. | [read] |
| Nelson and Smith, PCG book ch. 8, "ASP with applications to mazes and levels" (pcgbook.com/chapter08.pdf) | A level is a set of facts; rules and integrity constraints reject every invalid world. Reachability is one recursive rule (`linked(X,Y) :- parent(X,Y,DX,DY), linked(X+DX,Y+DY)`) plus a constraint rejecting any unlinked tile. Soft goals by `#minimize`. A playability simulation inside the program gives "guaranteed-playable" dungeons. They call the search "extremely high-complexity" yet often fast enough for tools. | [read] |
| Smith, Andersen, Mateas, Popovic, "A Case Study of Expressively Constrainable Level Design Automation Tools" (homes.cs.washington.edu/~zoran/answer-set-level-design.pdf) | Graph first, then embed: a feed-forward "mission" DAG, then a grid embedder. A hand-written randomized DFS embedder gained "up to four orders of magnitude" from a geometric restart policy. The ASP version solved one task in 350 ms search plus 340 ms grounding where the DFS found nothing in 1 hour; grounding is cubic in piece count and acceptable only because the game is "constant-bounded". | [read] |
| Smith, Butler, Popovic, "Quantifying over Play" (grail.cs.washington.edu/wp-content/uploads/2015/08/smith2013qop.pdf) | Generating content with no "shortcut solution" (any play the designer finds undesirable) is NP^NP-complete; they extend ASP to pose it and "guarantee properties over their entire combinatorial space of play". Shortcuts are defined against a model of the player. | [read] |

Findings that cut against the lead list: WFC alone does not cure sameness. It copies local statistics, and the sources call it "samey" at scale. The solver's value is the guarantee, not the variety. Sturgeon was a lead; not found or read (section 6).

## 2. What it would give a run in this game

His complaint is stationarity: "way too repetitive" [his 91, 179], and he asked for "cool pathways with intent mixed into the randomness" [his 179]. Our own measure of his 450 s run: 94% corridor, median straight 49 cells, no repeated layout [read exo_memory/handback/p-d665-gen-data-B_2026-11-11.md:34-41]. The fault is a stream of independent draws. A solver gives four things, none of them taste:

1. **Run-length and spacing guarantees.** "No straight longer than N cells", "a room within M cells of any point", "a vertical event every K storeys": Count, MaxConsecutive and Separation in the DeBroglie list. This attacks the 49-cell median directly. Lever 1 cut straights by dial and rooms still fell from 10% to 7% [read exo_memory/handback/p-d665-straights-B_2026-11-11.md:29-41]; a constraint can hold both at once.
2. **An intent line that is guaranteed to exist.** Graph first (start, landmark, Park, chute, exit as a DAG), then an embedder places it on the lanes (Smith's mission then embed). The line is walkable by construction, so intent mixed with randomness cannot strand a run.
3. **Loops and escape alternatives on purpose.** A Loop constraint (two routes between any two connected points) is what a chase needs; today loops are a hash rate (loop_density, layout.cpp:214-236).
4. **A shortcut-free proof of intent.** Quantifying over Play is the formal form of what graph.cpp:77 and the drop harness already do: reject a world where an unintended route beats the intended one.

Not given: new rooms, props, movement verbs. Those need pieces [ours].

## 3. Where it attaches in our generator

Hard fact first: the world is unbounded and every function is pure in (seed, coordinates), memoised in direct-mapped tables that evict and recompute [code gen/src/gen_impl.h:59-89; gen.h:9-10]. WFC and model synthesis make one finite output in a sequence. So a solver can only run as a pure per-block function whose borders are pinned by hash. That is the model-synthesis block idea with our hashes as the "known good" [inferred; Boris and Merrell describe blocks of finite outputs, not infinite worlds].

| need | attach point [code] | what changes |
|---|---|---|
| Lane run guarantees | layout.cpp:176 col_off(), :189 row_off() | Replace `hash3(...) % n` per segment (:186, :192) with a block-solved offset sequence. The junction pin (:179-183) becomes a fixed-tile constraint. |
| Cuts, loops, spacing | layout.cpp:214 row_site(), :231 col_cut() | Replace the independent `loop_density` draws (:218, :234) with a Count or Loop target per block. |
| Intent line | layout.cpp:240 pre() | A layer above lanes in the claim order that flags the line's cells; lanes read it as they read junctions. |
| Embedder inputs | layout.cpp:70 junction() | Junctions and Chute sites are the line's fixed nodes. The Chute branch is on origin/d665-variety-b 151aead, unmerged, 7 files conflict [read procgen_scout_00:99-103]. |
| Keep or reject | graph.cpp:77 detour_seconds(), :122 duct_site() | The existing measure-then-keep is the "test" half; reuse it for any line property. |
| Proof | graph_walk.h:55 edges_from(), walk_proof.cpp:266 | Check the line edge by edge. A multi-edge line at speed is not proved today [read procgen_scout_00:65]. |

New salts go last in the Salt enum (gen_impl.h:13-38), as D656 and L162 did. Memo keys hold 21 bits per axis (:41-45), so a block key is in range.

## 4. The smallest first build step

Deliberately one-dimensional, to prove the scheme before any real solving. [ours]

**Step:** one new dial, `lane_max_run` (segments), in LayoutRules (gen.h:152 area). A block is K lane segments of one (band, storey) lane. Its first and last segment offsets are today's hash values (the known good). Interior segments are chosen by a scan with an RNG seeded from `hash3(seed, kSaltLaneSolve, band, y, block)`, forbidding a run longer than `lane_max_run` and honouring the junction pin. On a contradiction, use the known good. Memoise by block key (a Memo like pre_memo). Files: gen/src/layout.cpp, gen/src/gen.h, gen/src/gen_impl.h (salt), gen/src/biome.cpp (the dial value), gen/tests/layout_tests.cpp.

**Red first:** a new test in layout_tests.cpp, `a_lane_never_runs_straight_longer_than_the_dial`: 200 seeds, apartment, bands 0..3, storeys 0..2, z over a few hundred cells; assert the longest run of equal `col_off` is at most `lane_max_run` segments. Red today: with 3 offsets a segment repeats the last with chance 1/3 and runs are unbounded; about 79,000 starts times (1/3)^4 is hundreds of 5-segment runs [inferred arithmetic, not run]. Green after.

**Must stay green:** a chunk equals itself in any order and on two threads (layout_tests.cpp:52, :100), face agreement (:115), the controller walk of every edge (walk_tests.cpp:59-159), the per-seed bands (dial_tests.cpp:75; the hotel loops band 18-36 may move and would be amended by name, as D665 did), and the drop harness on origin/l189-drops 260553b.

**Honest limit:** a one-dimensional run limit does not need a solver; a plain sampler gives it. It goes first because it proves the hard part here, which is determinism with pinned borders. The solver earns its place at step 2: coupled constraints (lane runs, cuts and rooms together), then the intent line.

## 5. Costs, risks, and conflicts

- **Every seed's world changes** (gen.h:136-137 says so of any generator change). Not verified: whether any test pins a seed's exact layout.
- **Block seams.** A block's interior must agree with the known good at both borders and with the junction pin; a window too short to satisfy the run limit forces the fallback, and the fallback is then a visible repeat [inferred].
- **Cost per call.** col_off() is called per cell; a solve per block without a memo would be slow, and the memo evicts, so the solve must be repeatable [inferred]. Smith's ASP grounding (340 to 630 ms) is far too slow for chunk streaming, so the runtime route is hand-written C++ DFS with geometric restarts. Clingo or Z3 would be a new dependency and needs the keeper's yes. ASP is useful offline as a checker [ours].
- **Search can stall.** Backtracking can fall into "rabbit holes" (Boris); per-block restarts bound it [read].
- **Intent is not automatic.** Reachability proves a route exists, not that it is fun; the path constraint gives "a route", not the simplest one [read]. Fun still needs designed pieces and measure-then-keep.
- **Shortcut exclusion is NP^NP-complete** [read]. Run it as a sampled test over seeds, never inside the generator.
- **Conflicts.** Field-noise and route-driven lane offsets (other scouts) attach at the same col_off()/row_off(): pick one owner. Room grammars attach at block() (layout.cpp:318), a different place, so they compose. A WFC filler for room interiors fits where outputs are small (WFC and model synthesis match there [read]) and does not touch lanes.
- **Branch drift.** d665-variety-b (Chute, hunter model) conflicts with emit.cpp on a dry merge; build the solver after it lands, or on top of it [read procgen_scout_00:99-103].

## 6. Not read

- Karth and Smith, "WaveFunctionCollapse is constraint solving in the wild" (FDG 2017): the PDF download came back empty; only a search snippet seen. Not cited as read.
- Merrell 2007 paper and 2009 thesis: not opened (Theorem 3.3.4 is quoted via his 2021 note).
- Gumin's LICENSE file and MarkovJunior (the README names a path method there): not opened.
- Smith and Mateas 2011 (ASP as a design space), Sturgeon, Tessera's Path constraint pages (a search snippet said Pro-only; not verified), the CEUR Markov-WFC paper, Wikipedia: not opened.

## Verification (second reader, 2026-11-13)

- [his 91] "way too repetitive": ok, found at briefs/dreamzone2_the_game.md:748 under item 91 ("the proc gen does get way too repetitive over time").
- [his 179] "way too repetitive" and "cool pathways with intent mixed into the randomness": ok, both verbatim at briefs line 1203 under item 179.
- Game repo commit 04f3882: ok (git log -1 gives 04f3882).
- [read] p-d665-gen-data-B:34-41 (median 49 cells, quartiles, no exact repeats): ok. The "94% corridor" is stated at :64 of that file, not :34-41, and the "corridor 79 + cross-corridor 6 of 90" at :34-41 gives 94%: ok in substance, citation range slightly off.
- [read] p-d665-straights-B:29-41 (rooms 10% to 7%, V1 failed): ok.
- [read] procgen_scout_00:99-103 and :65 (branch conflicts, multi-edge line not proved): ok, text present.
- [code] layout.cpp:176 col_off, :179-183 junction pin, :186 hash3 offset, :189 row_off, :192: ok.
- [code] layout.cpp:214 row_site, :218 and :234 loop_density draws, :231 col_cut, :240 pre, :70 junction, :318 block: ok.
- [code] graph.cpp:77 detour_seconds, :122 duct_site; graph_walk.h:55 edges_from; walk_proof.cpp:266 prove_block: ok.
- [code] gen.h:136-137 "changing it changes every seed's world": ok. gen.h:152-153 lane_segment, lane_offsets: ok (struct LayoutRules begins :151).
- [code] gen_impl.h:59-89 direct-mapped evicting memo: ok (comment at :56-58). But the section also cites gen.h:9-10 for "pure in (seed, coordinates) ... memoised"; gen.h:9-10 is only the layer-order comment. Weak citation, not false.
- [code] "Memo keys hold 21 bits per axis (:41-45)": WRONG location. key3 with 0x1fffff masks and << 21 is at gen_impl.h:50-53; :41-45 is the end of the Salt enum and fdiv/imod.
- [code] "New salts go last in the Salt enum (gen_impl.h:13-38)": range slightly wrong; the enum runs :13-41 (kSaltFalseDoor, D656, is last at :40). Claim itself ok.
- [code] tests: layout_tests.cpp:52, :100, :115 names match the claims; walk_tests.cpp:59-159 controller walk tests: ok; dial_tests.cpp:75 per-seed bands and the hotel loops 18-32 to 18-36 amendment (dial_tests.cpp:32): ok.
- Branches 151aead (origin/d665-variety-b), 868c6e1, 260553b (origin/l189-drops): ok, all exist as commits.
- [read] Gumin README: contradiction returns nothing, "supports constraints", level autocomplete, "correlations of tiles in easy tilesets quickly fall off with a distance": ok. "no backtracking" is NOT stated on the page (the algorithm simply has no such step): should be [inferred], not [read]. Licence: page names none beyond a LICENSE link: ok as stated.
- [read] Boris, Model Synthesis and Modifying in Blocks: 30x30x10, known-good border with fallback, tuning parameters, redundant work, order sensitivity: ok.
- [read] Boris, WFC tips and tricks: "doesn't have any global structure", "samey", disconnected rooms, Path constraint: ok. "Driven WFC", "Constraint-based tile generators" and the Caves of Qud claim: could not check (not re-opened; the Qud talk is already listed Not read).
- [read] DeBroglie Constraints page: constraint list and Loop "at least two routes between any two connected points": ok (page also lists Parity and Mirror constraints, which the doc omits; "no licence visible": ok).
- [read] Nelson and Smith ch. 8: linked(X,Y) rule, rejecting constraint, #minimize, "guaranteed-playable", "extremely high-complexity": ok (the "extremely high-complexity" phrase refers to universally quantified generation, not all ASP; the doc's framing is close enough).
- [read] Smith et al. case study: "up to four orders of magnitude", ASP 350 ms search + 340 ms grounding vs DFS no solution in 1 hour, "constant-bounded", mission DAG: ok. Grounding "340 to 630 ms": ok on re-check (340 puzzle, 530 mission, 630 grid embedding, in the paper results list).
- [read] Merrell 2021 comparison PDF (20-minute claim, Theorem 3.3.4, scanline order): could not check (PDF over 10 MB limit for the fetch tool).
- [read] Smith, Butler, Popovic "Quantifying over Play" (NP^NP-complete, shortcut solution): could not check (not re-opened, time).
- [read] Section 5 "rabbit holes" attributed to Boris, and "a path constraint gives a route, not the simplest one": could not check (not re-opened).
- Marking audit: nothing marked [read] lacks a URL or path. The one over-mark is "no backtracking" for Gumin (above).

Totals: 30 checks, 24 ok (two with a citation-range note), 2 WRONG (memo key line range gen_impl.h:50-53 not :41-45; Gumin "no backtracking" marked [read] but not on the page), 4 could not check.
