# Outside: merge queues and build farms — many branches, one test machine (2026-11-13)

Reader: one outside reader in the room_better swarm. Research only. Prior room research checked first: none of the five
named files covers merge queues, batching, bisection, test selection or off-path mutation testing (grep for
merge queue|bors|zuul|bisect|batch|mutation|priorit over all five: one hit, `outside_reader_agent_maps_2026-10-30.md:21`,
which lists the mutation harnesses as a missing skill, not as a scheduling topic) [read].

Method: pages and PDFs downloaded with curl, HTML stripped to text, PDFs through pdftotext, then grep and sed ranges.
Only the WebSearch tool was used to find two PDF URLs; nothing below rests on its summaries. Downloads sit in the
scratchpad, not the repo. Line numbers cited as "txt:N" are in those stripped copies, so they will not match a browser.

## 1. Batching and bisection on failure

- bors-ng: tests approved PRs as a batch merged onto a `staging` branch; on failure "it splits the batch into two
  batches, and pushes those to the queue"; a batch of one that fails "gets kicked back to the creator"
  (raw.githubusercontent.com/bors-ng/bors-ng/master/README.md:110, :137) [read].
- bors-ng cost claim: one-at-a-time is O(N); batching is "O(E log N), where N is ... the total number of pull requests
  and E is the number of pull requests that fail" (same README:149-150) [read]. It rests on "the assumption that the
  tests usually pass once they're r+-ed" (README:65) [read].
- GitHub merge queue: no bisection. Each queued PR gets a temporary branch holding base + every PR ahead of it; a PR
  whose group fails is removed and the PRs behind it are rebuilt without it (docs.github.com, "Managing a merge queue",
  sections "Failing CI", txt:203-212) [read]. Limits: build concurrency 1-100 merge_group webhooks; merge limits min/max
  1-100 PRs with a wait time (txt:179-191) [read].
- GitHub's flake setting: with "Only merge non-failing pull requests" unchecked, a PR that failed may still merge if
  the last PR in its group passed, "useful if you have intermittent test failures" (txt:183) [read].
- GitLab merge trains: same cumulative-pipeline shape as GitHub; default limit 20 parallel pipelines per train, extra
  requests queue; when one is removed, "All pipelines for merge requests queued after the removed merge request restart"
  (gitlab.com/gitlab-org/gitlab doc/ci/pipelines/merge_trains.md:216-219, :231) [read].
- Mergify: batches with optional dynamic size (`batch_size: {min, max}`); a failed batch is split in rounds, up to N
  parts per round where N is the parallel check count; worst case stays flat for sizes 1, N+1, N^2+N+1, e.g. with 3
  checks "max: 13 never needs more than 2 rounds" (docs.mergify.com/merge-queue/batches, txt:352-370, :474-536) [read].
  second reader (a reading, not a strike): the doc calls 1, N+1, N²+N+1 the sizes that "keep all N checks busy in
  every round"; any size between two of them costs as many rounds as the larger (mergify_batch txt:478-480, :491)
  [read]. So the worst case is a step that rises just past each listed size.
  Its "Fail First" plugin starts each split with the tests that failed in the parent batch and stops early, "so a split
  holding the culprit costs a few tests instead of your whole suite" (txt:787-789) [read].
- Rust (rollups, done by hand on top of bors): CI is "~3hr"; small, low-risk PRs are tagged rollup=always/maybe/iffy/never
  and a person packs them, a starter mix being 1 iffy, 4 maybe, 5 always; a failed rollup is bisected by reading logs,
  the culprit unapproved, the rollup rebuilt without it (raw.githubusercontent.com/rust-lang/rust-forge/master/src/
  release/rollups.md:7, :29-54, :44-46) [read]. The doc argues a rollup failing on an iffy PR "is a good thing" because
  that PR needed a CI cycle anyway and the others "piggyback" on it (:62) [read]; and that some cycles must be left for
  `never` PRs or they starve (:64) [read].
- Google TAP (post-submit, not a gate): commits are bundled into "milestones", cut about every 45 minutes at peak, up to
  4.2 million tests per milestone, with observed delays "of up to 9 hours"; each affected target runs only at its latest
  affecting change, so the culprit is not pinned by the milestone itself (Memon et al., ICSE-SEIP 2017, course-hosted
  PDF web.eecs.umich.edu/~xwangsd/courses/w23/readings/googletest.pdf, txt:11-27, :176-190) [read].

## 2. Speculation instead of (or beside) batching

- Zuul dependent pipeline: tests A, A+B, A+B+C ... in parallel assuming those ahead pass; on a failure the changes behind
  restart without it. "In the best case, as many changes as execution contexts are available may be tested in parallel
  ... In the worst case, changes are tested one at a time" (zuul-ci.org/docs/zuul/latest/gating.html txt:915-925) [read].
- Zuul window, TCP-style: starts at 20 changes, +1 per merge, halved per failure, floor default 3, optional ceiling;
  each project queue keeps its own window "so that unreliable tests in one project queue don't affect the window of
  other project queues" (gating.html txt:952-984; config/pipeline.html txt:1252-1290) [read]. Serial pipelines have a
  fixed window of 1 (gating.html ~~txt:989-990~~ second reader: txt:989-991; "fixed window size of 1" is on :991, in
  the first reader's copy and in a fresh download [read]) [read].
- Uber SubmitQueue (EuroSys 2019, copy at lethain.com/static/blog/2019/eurosys19uber.pdf; DOI 10.1145/3302424.3303970
  not opened): one-at-a-time with 1,000 changes/day at 30 min each puts the last change "over 20 days" out (txt:204-210)
  [read]; real-conflict chance 5% with 2 concurrent changes, 40% with 16 (txt:174-176) [read]; staleness of 1-10 hours
  gave a 10-20% chance of breaking mainline (txt:189-190) [read].
- Same paper, measured on iOS build steps against an "Oracle": at 500 changes/hour, Single-Queue (bors-style) P50/P95/P99
  turnaround 80x/129x/132x Oracle; Speculate-all up to 15x P50, 24x P99; SubmitQueue max 2.98x P50, 4x P95 under
  contention, 1.2x with 500 workers; Single-Queue throughput "95% slowdown" (txt:704-736, :847-848) [read].
  second reader: Uber defines Single-Queue as changes "enqueued, and processed one by one, à la Bors" (uber19
  txt:663-664) [read]: the one-at-a-time original, not the bors-ng batching in section 1.
- Its finding on depth vs breadth: the optimistic (Zuul-like) approach beat speculate-all on turnaround because "a
  significant proportion of changes are expected to succeed even under high load. Thus, speculating deep instead of
  going wide helps" (txt:727-731) [read].

## 3. Priority so short jobs are not parked behind long ones

- Uber, 2025 follow-up ("CI at Scale: Lean, Green, and Fast", arxiv.org/pdf/2501.03440v2): FIFO made "changes with
  shorter build times that arrive after a large, time-consuming change ... wait for the larger change", and aborting
  in-flight builds hit "an estimated 40-65% of builds" (txt:43-62) [read]. Fix: an ML build-time predictor, ~~a rule
  (BLRD) letting a smaller change bypass a larger conflicting one when all its speculative builds agree,~~
  second reader: BLRD is not this paper's fix. The paper cites it as earlier work, "[10] Zhongpeng Lin and Matthew
  Williams. Bypassing large diffs in submitqueue", an Uber blog of August 2023, which "has partly addressed" the wait
  (uber25 txt:65-70, :708-712) [read]. The 2025 addition is a probabilistic model of whether a change is eligible to
  bypass, so its builds are prioritised (txt:95-101, :360-368) [read]. And a
  speculation threshold so only likely builds run (txt:252-256, :364-386) [read]. Reported: CI resource use -53%, weekly
  CPU hours -44%, P95 wait -37% (txt:104-110) [read]. These are before/after production numbers, not a controlled trial
  [inferred].
- Mergify priority: by default a higher-priority PR is "inserted just after the pull requests whose checks are running,
  preserving the CI time already spent"; `allow_checks_interruption: true` preempts "at the cost of the CI time already
  spent" (docs.mergify.com/merge-queue/priority, txt:310-319) [read].
- GitHub "jump to top": reordering "will cause a full rebuild of all in-progress pull requests ... Heavily utilizing this
  feature can slow down the velocity of merges" (managing-a-merge-queue txt:218-221) [read]. GitLab "Merge immediately"
  carries the same warning: "can use a lot of CI/CD resources" (merge_trains.md:244-247) [read].
- Zuul `pipeline.precedence`: named levels mapped to numbers (normal = 500, low = 700, minimum = 900; lower runs first)
  decide which pipeline's jobs the scheduler starts first (config/pipeline.html txt:1157-1175) [read].
- Rust bors: `p=N` priority on approval, e.g. `@bors r+ p=5` for a rollup (rollups.md:41) [read].

## 4. Test selection

- Facebook predictive test selection (Machalica et al., arxiv.org/pdf/1810.05286): selects "fewer than a third" of the
  tests build-dependency selection would pick, halves "the total infrastructure cost of change-based testing", and still
  catches "over 95% of individual test failures and over 99.9% of faulty code changes" (txt:100-112) [read]. Flakiness
  is handled by retry-based labelling, and the authors "do not believe eradicating test flakiness entirely is
  economically viable" (txt:386-392) [read].
- Google TAP data: 91.3% of test targets passed at least once and never failed; 1.23% "actually found a test breakage";
  under 0.5% of outcomes FAILED (googletest.pdf txt:225-240) [read]. ~~The abstract adds~~ second reader: the
  introduction adds, not the abstract; the abstract (txt:11-28) has no percentage, and :106-107 sits in the right
  column after the "I. INTRODUCTION" heading at :32 [read]. "more than 99% of all tests run by
  the CI system pass or flake" (txt:106-107) [read].
- Mergify Fail First (section 1) is selection applied to bisection: rerun prior failures first [read].
  second reader: "rerun prior failures first" is read (mergify_batch txt:787-789); calling it selection is a reading,
  so that half is [inferred].

## 5. Mutation testing off the critical path

- Google (Petrovic et al., "Practical Mutation Testing at Scale", arxiv.org/pdf/2102.11378v2): mutants only on changed,
  covered lines, started when a change is sent for review, results shown as review findings; at most one mutant per line
  and at most 7 x files-in-change surfaced, "7 is a result of heuristics" (txt:18-19, :93-106, :160-175, :690-696) [read].
  Scale context: "More than 500,000,000 test executions per day" gate 60,000 change submissions (txt:55-56) [read].
  Suppression of "arid" nodes lifted productive mutants "from 15% to 89%"; 17 million mutants over 760,000 changes,
  2 million surfaced (txt:105-115) [read]. The paper places it in review, beside the gate, not as a merge blocker
  [inferred from the workflow text; no sentence saying "non-blocking" was found by grep].
- PIT incremental analysis: reuses last run's verdicts when the class and its killing test are unchanged; the authors say
  the underlying assumption "seems reasonable, it is currently unproven" (pitest.org/quickstart/incremental_analysis,
  txt:15, :21) [read].
- StrykerJS `--incremental`: reuses results from `reports/stryker-incremental.json` by a git-like diff; example run
  "reuse 3731 mutant results, and only 234 mutants need to run"; it "will not detect any changes you've made in files
  other than mutated files and test files" (stryker-mutator.io/docs/stryker-js/incremental, txt:22-44) [read].

## 6. Where the sources disagree

- Batching vs speculation. bors-ng says batching is O(E log N) and cheap when most pass [read]; Uber 2019 says batches
  fail more often as they grow and "SLAs cannot be guaranteed", and that Chromium's batch-and-sheriff Commit Queue
  "does not scale" (uber19 txt:166-191) [read]. Rust keeps human-packed batches with a 3-hour CI and argues a failing
  batch is still useful work (rollups.md:62) [read]. The split tracks failure rate and queue depth [inferred].
- Wide vs deep. Uber measured deep (optimistic) ~~beating wide speculation~~ second reader: beating wide speculation on
  turnaround only (uber19 txt:727-731); on throughput the same paper says "not only does the Optimistic approach do
  worse than Speculate-all, it remains unchanged as we increase the number of workers" (txt:848-851) [read]; Zuul caps depth by a window that halves
  on failure [read]. Both agree the right width falls as the failure rate rises [inferred].
- Preempt or not. Mergify's default keeps running checks; GitHub and GitLab let a jump preempt and warn about it; ~~Uber
  2025 built a bypass for short jobs that does not abort the long one~~ second reader: the bypass (BLRD) is Uber's 2023
  work; the 2025 paper adds a model that prioritises the short change's builds so the bypass can fire (uber25 txt:65-70,
  :95-101, :708-712) [read]. No source gives a number for what a
  preemption costs on a queue the size of one machine [inferred].
- Selection safety. Facebook accepts missing under 5% of individual failures [read]; PIT and Stryker say their reuse
  rules are unproven or blind to some files [read]. Neither cites the other [inferred].

## 7. Against this room (proposals only)

- The room's lock today: `consonance/tools/heavy-run.js` gives one heavy-run slot per tree, a waiter polls every 2 s, and
  "the one that proceeds is the one that saw nobody" (heavy-run.js:13-20, :23-24) [read]. No priority or job-length
  field was found by grep for priorit|fifo|queue|short [read]. second reader: that grep returns 0 lines, confirmed
  [read]; but the description leaves out the EXCLUSIVE HOLD (D663, heavy-run.js:77-87, `HOLD_NAME` :101): a run that
  needs the machine quiet writes `heavy-run.hold`, and "While the hold exists every other runner WAITS" [read]. That is
  a precedence path for one declared run, though not an order among waiters [inferred]. Cost of its trigger: on
  2026-09-23 "The chair read 122/1 off a snapshot of another seat's half-written files" (heavy-run.js:5-7) [read];
  ~~cost of waiting not recorded.~~ second reader: recorded. "A waited 41 minutes behind the train for a chain of 16
  mutants" (`exo_memory/librarian/2026-11-13.md:213`) [read]; "short runs parked behind 16 mutants"
  (`exo_memory/loop/handoff_lighthouse_2026-11-13-L.md:63`) [read]. The sibling `in_lock.md:19-40` tables the day's
  waits from the record, about 154 seat-minutes, overlapping [read].
- Option A [ours]: keep the lock, add a declared size (touched-files run vs full suite vs mutant harness) and let the
  short class go first when both wait, without preempting a running job (the Mergify default, Uber's bypass in miniature).
- Option B [ours]: batch landings bors-style, one full suite over several finished changes, split in halves on red. Only
  pays if most landings pass (bors's own assumption); the room's pass rate was not measured here.
- Option C [ours]: run mutant harnesses as a review finding beside the landing, incrementally over changed files
  (Google, PIT, Stryker shape), not as part of the landing's critical path. The brief's tier rule still decides when
  they are owed; this only changes where they sit.
- Option D [ours]: on a red full suite, rerun the failing tests first before the rest (Mergify Fail First).

## Could not obtain

- The ACM copy of Uber 2019 (DOI 10.1145/3302424.3303970): not opened; a third-party PDF was read instead.
- Chromium/LUCI Commit Queue primary docs: not fetched; its description above is Uber's account of it [read as Uber's].
- GitHub "merging a pull request with a merge queue" page: the URL tried returned 404.
- Kubernetes Tide: doc read only to confirm it batches and has a priority path (tide/_index.md:23, :105); no numbers.
- No source found that measures merge-queue or test-scheduling behaviour on one shared machine with a handful of
  workers; every number above is from fleets of tens to thousands of workers.
- rust-lang/bors README mentions rollups and a merge queue (README.md:52, :89) but not its failure strategy.

## Second reader

Adversarial second read, 2026-11-13. Research only; this file is the one file written.

**What I checked.** About 50 of the [read] marks, every number in sections 1-5 and the local cites in section 7.
- Fresh downloads (curl, then line numbers checked): bors-ng README (:65, :110, :137, :149-150), rust-forge
  rollups.md (:7, :29-54, :41, :44-46, :54, :62, :64), GitLab merge_trains.md (:216-219, :231, :244-248). All say what
  the file says [read].
- PDFs: the first reader's five copies match the live URLs byte for byte by size (Uber 2019 11,172,491; Uber 2025
  934,667; Facebook 480,582; Google mutation 728,951; TAP 1,129,918) [read]; `pdftotext -layout` on them reproduces the
  first reader's .txt files exactly, so its txt:N line numbers are checkable [read]. Every figure checked in them holds:
  Uber 2019 5%/40%, 10-20%, over 20 days, 80x/129x/132x, 15x/24x, 2.98x/4x/1.2x, 95% slowdown; Uber 2025 40-65%,
  53%/44%/37%; TAP 45 min, 4.2 million, 9 hours, 91.3%, 1.23%, under 0.5%; Facebook "fewer than a third", factor of two,
  over 95% and 99.9%; Google mutation 500,000,000, 60,000, 15% to 89%, 17 million, 760,000, 2 million, 7 x files
  [read].
- HTML, through the first reader's stripped copies: GitHub (:179, :183, :185, :203-212, :218-221), Zuul gating and
  pipeline (20, +1, halved, floor 3, ceiling optional; 500/700/900), Mergify batches and priority, PIT (:15, :21),
  Stryker (3731 of 3965, 234, :44) [read]. Zuul gating and Mergify priority were also re-downloaded and stripped with the
  same script: the copies differ from the first reader's by 1 to 3 lines, and the cited text stays inside the cited
  ranges [read].
- Local: heavy-run.js :5-7, :13-20, :23-24, and the 0-line grep [read]; `outside_reader_agent_maps_2026-10-30.md:21`
  [read].

**What I struck (6).** Each in place above, with the correction after it.
1. Zuul serial window cite: :989-990 should be :989-991 [read].
2. BLRD listed as Uber 2025's fix: it is a 2023 Uber blog the paper cites [read].
3. "The abstract adds": the TAP 99% sentence is in the introduction [read].
4. "deep beating wide": true on turnaround only; on throughput the paper reports the reverse [read].
5. "Uber 2025 built a bypass": same misattribution as 2 [read].
6. "cost of waiting not recorded": the record has it, 41 minutes at `librarian/2026-11-13.md:213` [read].
Cost of these faults: not recorded; I found no ruling yet made on this file [inferred].

**Notes, not strikes (4).** Mergify's size list is a step, not a flat line; Uber's Single-Queue is one-at-a-time bors,
not bors-ng batching; the Fail First line mixes a read fact with a reading; section 7 leaves out the lock's exclusive
hold (heavy-run.js:77-87), which bears directly on Option A [read]. Two small paraphrases left standing: rollups.md:41
reads `@bors r+ p=5 force`, and :64 says `never` PRs need cycles to "get a chance", which the file renders as "starve"
[read].

**What I could not check.**
- "none of the five named files": the five are not named in this file or its siblings that I opened. Over all of
  `exo_memory/research/` the same grep hits 2 files; the second, `openrig_against_consonance_2026-10-30.md:3`, is the
  word "priority" in a quote, not a scheduling topic [read]. So the conclusion holds for research/ as a whole.
- That WebSearch was used only to find two URLs: not checkable from disk.
- Not re-downloaded, read only through the first reader's copies: GitHub, Mergify batches, Zuul pipeline, PIT, Stryker,
  Tide, rust-lang/bors README, Google's mutation HTML page. The GitHub 404 is confirmed in the saved copy
  (`gh_mq_about.html`); which URL was tried is not saved.
- Chromium's Commit Queue: as the file says, only Uber's account of it exists here.
- Section 6's [inferred] lines and section 7's options: proposals, not checkable claims.
