# Running only the tests a change needs: three reports and two measures, 2026-11-25

Gathered by the librarian on L at his offer of 00:47 ("a small research gathering of agents here to helps us unravel how
this might be able to work"). Three agents of this seat, read-only. The two outside agents (Sonnet) searched with
generic terms only. **Every source is marked READ (the agent fetched and read it; several were abstracts or HTML
copies) or NOT READ (a search snippet only). A NOT READ line is a lead, not a finding.** The agents' own files were
empty when I went to copy them, so this is my transcription of their final messages: every figure, URL and mark is
kept; their wording is shortened. Nothing here was re-fetched by me.

## Report 1 (outside): how teams run only the tests a change can affect

**Dependency-based selection**
- Ekstazi (Java): records the files each test touches, reruns tests whose files changed. "reduced the end-to-end
  testing time 32% on average, and 54% for longer-running test suites", on 615 revisions of 32 projects, about 5M
  lines. Miss rate: no measured figure; safety is argued formally. READ (abstract only).
  https://users.ece.utexas.edu/~gligoric/papers/abstracts/GligoricETAL15Ekstazi.txt
- Static class-level selection, 985 revisions of 22 projects: "comparable to Ekstazi, with similar performance
  benefits" but "at the risk of being unsafe sometimes"; the method-level variant "performs rather poorly". No unsafe
  percentage readable. READ (abstract page) https://archive.cps-vo.org/node/35355 ; paper NOT READ.
- Bazel caches tests by input hash; no saving or miss figure found. READ (first line only)
  https://bazel.build/reference/command-line-reference
- Google presubmit selects by the build dependency graph; "limited to avoid excessive resource consumption and
  delays"; no presubmit numbers. READ https://hackthology.com/speculative-testing-at-google-with-transition-prediction.html .
  A 2017 paper: "very few of our tests ever fail". READ (abstract) https://research.google/pubs/pub45861/

**Coverage-based**
- Microsoft Test Impact Analysis builds a test-to-file map at run time; its selection also includes previously
  failing and newly added tests. No figures. READ
  https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis

**Predictive**
- Meta, "Predictive Test Selection", measured against running every test that depends on a changed file: keeps
  "over 95% of individual test failures"; faulty-change recall above 99.9 %; runs under a third of the
  dependency-selected tests; test executions fall by a factor of three, infrastructure cost by two; retrained weekly on
  three months of outcomes. READ https://ar5iv.arxiv.org/html/1810.05286 and
  https://engineering.fb.com/2018/11/21/developer-tools/predictive-test-selection/
- Google "speculative cycles" (post-merge): at a 25 % budget, recall 85 % (random 56 %); median detection 107 to 37
  minutes. READ, the hackthology page above. Google's simulation of five heuristics: "the test selection problem
  remains largely open". READ (abstract) https://research.google/pubs/pub48335/
- Develocity (vendor): "more than 99%" of failures, 35 % to 70 % (elsewhere "up to 90%") time saved. Vendor claims,
  no independent evaluation found. NOT READ.

**The safety net: every system read keeps a full run**
- Meta runs all tests on the latest master "once every few hours". READ (ar5iv above).
- Microsoft falls back to all tests for commits it cannot analyse and recommends "run all tests at a configured
  periodicity"; it suggests validating by running selected then all and comparing failures. READ (above).
- Google's postsubmit schedules all tests affected since the last run. NOT READ.
- cargo-affected's own README says CI should still run the full suite. READ
  https://docs.rs/crate/cargo-affected/0.3.0/source/README.md

**Tools**
- `node --test` has no changed-file selection. `--watch` (experimental) reruns tests affected by changed files "and
  their dependencies"; `--test-rerun-failures <state-file>` reruns what has not yet passed. Selection needs one's own
  script (the agent's inference). READ (first 100,000 characters) https://nodejs.org/api/test.html
- Jest has `--onlyChanged`, `--changedSince`, `--findRelatedTests`; "requires a static dependency graph (ie. no
  dynamic requires)". READ https://jestjs.io/docs/cli . No plain-CommonJS tool for `node --test` was found.
- Rust: cargo-nextest does not select by changed files. READ https://nexte.st/book/running . cargo-difftests selects by
  LLVM coverage, needs nightly. READ https://github.com/dnbln/cargo-difftests . cargo-affected: "extremely early", "no
  support promise", "trades correctness for speed". READ (above). cargo-test-changed, testtrim: NOT READ.

**What selection cannot see**
- Dynamic requires (Jest, READ). Reflection (static selection; cause from an unverified snippet).
- Non-code files: `include_str!` targets, SQL, snapshots, templates; build inputs outside the cache key
  (`build.rs`, the toolchain file, `.cargo/config.toml`); environment, filesystem and network state (cargo-affected, READ).
- Unknown file types and cross-language boundaries: Microsoft falls back to all tests on HTML or CSS changes and
  needs a hand-written map for JavaScript or C++ dependencies. READ.
- Generated code: no source found.

**The agent's own summary.** Well established: dependency selection saves time (32 % and 54 %); Meta's figures;
every system keeps a full-run backstop; `node --test` and nextest do no selection. Contested: how unsafe static
selection is; vendor claims; whether cheap heuristics work. Not found: any measured miss rate for Bazel, Jest,
cargo-difftests or cargo-affected; any selection tool for `node --test`.

## Report 2 (outside): which tests are worth keeping and running often

**How often tests fail**
- Meta: about 99.9 % of dependency-selected test targets pass. Failed tests retried up to 10 times; flaked failures
  outnumbered real ones by about 4 to 1 (a lower bound). Removing flakes dropped the model's test recall from about
  0.9 to about 0.7 at a 0.15 selection rate. READ https://ar5iv.arxiv.org/html/1810.05286
- Google: "about 1.5% of all test runs" flaky; "almost 16%" of tests have some flakiness (NOT READ, snippet);
  84 % of fail-to-pass transitions caused by flaky tests (NOT READ). Software Engineering at Google, ch. 11: flaky
  rate about 0.15 %; "As you approach 1% flakiness, the tests begin to lose value." READ
  https://abseil.io/resources/swe-book/html/ch11.html
- Chromium: ignoring all flaky failures would have missed 76 % of true regressions. NOT READ.
- The share of tests that ever fail, and how concentrated failures are: **no figure found.**

**Suite reduction**
- Shi et al., FSE 2014, 18 projects, 261,235 tests, 3,590 commits: a size / coverage / fault-detection trade-off.
  READ (abstract only). Figures: not found.
- The caution (all NOT READ): older studies disagree on the loss; reduction can lose much fault detection against
  later changes where safe selection loses none; coverage correlates only low to moderately with a suite's
  effectiveness once size is controlled.

**Mutation testing**
- Google, "Practical Mutation Testing at Scale", 776,740 changelists, 16,935,148 mutants: 87.5 % killed by existing
  tests. Cost limits: only changed, covered lines are mutated; median mutants per change 820 with no suppression, 77
  at one per line, 7 with suppression; reported mutants capped at 7 per file changed; median live mutants per change 2.
  READ (first 100,000 of about 131,000 characters) https://ar5iv.labs.arxiv.org/html/2102.11378 . The agent's
  productivity figures conflict as summarised (85 % unproductive at first; 82 % then 89 % productive): check the paper.
- "A test that kills no mutant cannot fail" is the agent's inference; no source measures tests with zero kills.

**Tiering**
- Chromium's commit queue runs a "curated set of test suites"; some run only post-submit "because the tests are too
  slow or too expensive"; a builder must "catch enough failures to be worth adding"; median cycle "under 40 minutes";
  a footer pulls post-submit tests in on demand. READ
  https://chromium.googlesource.com/chromium/src/+/main/docs/infra/cq.md
- Google sizes tests small / medium / large; teams "frequently isolate their large tests" to build and release. READ (abseil).

**Tests written by AI agents**
- TestSuiteBench (165 applications): agent-written suites reach mutation scores "below 60%" while 88 % of their
  tests pass on the reference. READ (abstract only) https://arxiv.org/abs/2610.13065
- 204,673 test files: strong assertions 88.1 % human, 85.37 % agent; flakiness-candidate rate 0.41 agent, 0.30
  human. READ (abstract only; a snippet gave different numbers) https://arxiv.org/abs/2607.12068
- Over-production or tautological tests by agents: **no figure found.**

## Report 3 (inside, the room-reader): where the room orders a suite run

- The tier rule already exists: `consonance/src-tauri/brief/COMMITTEE.md:83-97` ("just do it": "No new test, no test
  run"; "check it": "run the existing tests for the touched files"; "prove it": test first and the mutation harnesses
  that name the file; "The landing pane runs the full suite plus TAP at a release"); `:244-246`;
  `BUILDING.md:52`, `:157-158`, `:531-534`; `exo_memory/CLAUDE.global.md:7` and `:145`.
- The vaguest line is his global file, `~/.claude/CLAUDE.md:3`: "Run the relevant test suite after making changes and
  before reporting success".
- Of 37 packets this month (by grep, a floor): about 10 ask for a whole or fast suite; about 10 name rows; none gives
  an exact list of rows for a suite run. Two asked for a suite with no code changed:
  `packet_l224_flow_build_A_2026-11-25.md:13` and `packet_g1_pull_build_A_2026-11-21.md:21`.
- `consonance/tools/landing-train.js` runs whatever its config's `check` names (line 219) on every batch; no
  selection in code.
- Nothing in `consonance/tools/`, `consonance/hooks/`, `exo_memory/loop/` or `exo_memory/research/` computes the tests
  for the touched files (the search stopped at 60 hits, so one cannot be ruled out).

## The librarian's two measures of the builder's suite (tip 27e2084, the fast suite, 330 files)

By scratchpad `testmap.js`, from pane A's saved run of L224 and the builder's worktree.
- Time, top-level test lines: 3,604 lines, 4,121 s of test time (1,114 s on the clock, four at a time). Slowest 10:
  22 %; slowest 20: 34 %; slowest 50: 50 %; slowest 100: 63 %. 79 lines over 10 s; 1,677 under 10 ms.
- Following require() from each test file: a change to one source module selects a median of 48 of 330 files; the
  widest (`src/geom/profile.js`) 250; `app/core/panel.js` 43; `src/export/ailine.js` 46; `src/core/adapter.js` 180.
  26 of 198 modules select over half the files.
- What require() cannot see: 43 test files reach no source module; 45 mention a browser; 52 read source as text or
  require by a variable (the three counts overlap by an unknown amount).
- Not measured: time per test FILE. So a share of the files is not yet a share of the time.
