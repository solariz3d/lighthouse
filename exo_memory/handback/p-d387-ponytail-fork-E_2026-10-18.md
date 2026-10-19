# Hand-back, pane E (machine D): D387, the room's own fork of Ponytail

Packet: the chair's D387 (2026-10-18T14:42:25Z). The brief is at `exo_memory/loop/plan_t180_handoff_2026-10-15.md:2531-2552`, and the old NO it replaces is at `exo_memory/loop/plan_ponytail_2026-10-16.md:322-325`.
- Uncommitted hand-back. Nothing pushed (the lighthouse push is also held on the keeper's other call).
- No full suite: the brief asks for the brief rows, intake_light_tests and portable-paths.
- **For the librarian first: the fork text to read is in §1.** The join (§2) is its own commit, marked HOLD. It shouldn't land until you've read §1.

## 0. The answer

**Two commits on branch `d387-e`,** in worktree `C:\Users\nname\Desktop\worktrees\lh-d387-e`, off main `dfe05087`. Clean.
- checked: `git log --format="%h %p %s" -2`.

**`c70d42a4`, the text** (7 files, +462). Nothing reads it yet:
- `consonance/src-tauri/brief/ponytail.md`, the rule (3,473 B);
- `brief/ponytail-review.md`, the review skill (5,820 B);
- `brief/ponytail-NOTICE.md`, the attribution and every changed line (7,585 B);
- `brief/ponytail-stock/`: the stock `ponytail.md`, `ponytail-review.SKILL.md` and `LICENSE`, byte for byte;
- `src/main.rs` `ponytail_fork_tests`: 4 rows on the text.

**`b431b2d0`, the join (HOLD).**
- `src/main.rs` `assemble_intake_within`: the rule rides beside COMMITTEE.md, plus the join row.
- `tauri.conf.json`: one bundle line.

**The credential scan** of both commits (the three split patterns) finds 0.

**A path decision, mine, against the brief's wording:** the fork is in `consonance/src-tauri/brief/`, not `consonance/rules/`.
- The join point the brief names, `room_brief_at` (`main.rs:3649`), resolves a brief from three places only:
  - the data dir;
  - the bundled resources beside BOOT.md (`tauri.conf.json` maps `brief/*` only);
  - the repo's `consonance/src-tauri/brief/`.
- **A file in `consonance/rules/` is reached by none of the three.** It would need a fourth resolver in shared code.
- `brief/` gives one route for the installed app and the dev repo alike, the same as COMMITTEE.md.
- If you want `consonance/rules/`, it's a move plus a resolver change; say so.

## 1. The fork text (read this before the join lands)

**Source:** github.com/DietrichGebert/ponytail at `6f1c2bff…`, MIT, Copyright (c) 2026 DietrichGebert.
- **The stock copies match upstream.** Their LF bytes equal the git blobs at the source commit:
  - `ca99e595…` the rule;
  - `33fe4ebe…` the review skill;
  - `fb1bc690…` the licence.
  - checked: `git -C G:\Consonance-tools\ponytail-src cat-file -p 6f1c2bf:<path> | sha256sum`, and the same of `git cat-file -p c70d42a4:<path>`, for the rule.

**The rule's changes from stock** (stock line numbers; every one is a hunk in the NOTICE):
- **Added after line 1:** the attribution line, ending "Text only: no hook, no statusline, no ledger, nothing written outside the project."
- **Line 3, the closing:** "End your reply with one or two lines…" becomes:
  - "End your hand-back with its "Not done" and "Limits": what you skipped or did not check, and any risk the keeper must know, each claim marked `checked:` with the command that showed it, or `inferred:`."
- **Line 7, the reach list:** gains "…and the mutation harnesses that anchor the files you touch (name each, and run it whole before you hand back)."
- **Line 20:** "including the callers, tests and fixtures your change breaks" becomes:
  - "including the callers and fixtures your change breaks. A test your change turns red is fixed in the code, not in the test; change a test only when the test itself is wrong, by name, and say so in the hand-back."
- **Line 23:** "Comment only the why the code cannot show, in one line" becomes "…at the comment density of the code around it."
- **Line 30, Never cut:** now opens "a test, or code that a test pins (a cut that would remove either is a finding in your hand-back, for a ruling, never a change you make), …", then the stock list.

**The review's changes:**
- **Added after the frontmatter:** the attribution line, "Run after every landing by a reviewing pane. Text only."
- **Line 22:** the reading list gains "the mutation harnesses that anchor the touched files".
- **Line 60:** a finding's concrete case comes "with the command you ran and the numbers it gave".
- **Line 65:** "Prefer fixes that delete code, but never a test or code a test pins: a fix that would delete or rewrite a test is reported for a ruling, never landed as written. A building pane measures every fix before it lands."
- **Line 96:** "`Not checked:` one line" becomes "`Not done` and `Limits`, as a hand-back has them…, each claim marked `checked:` with its command, or `inferred:`."

**Text only.** No hook, statusline, ledger, plugin manifest, script or other skill came across. The fork writes nothing anywhere.

**Read the files themselves:** `brief/ponytail.md` (32 lines) and `brief/ponytail-review.md` (103 lines) at `c70d42a4`. The NOTICE's hunks are the authoritative list; the summary above is mine.

## 2. The join, and the budget

- **Where:** `assemble_intake_within`. This is what `prepare_sibling_dir` (`main.rs:3567`) and the respawn (`:5694`) use.
  - The rule is a second committee-kind optional brief, seated right after COMMITTEE.md, so it rides whole or becomes one path line, like it.
  - The chair is briefed by `main_intake` (BOOT + BUILDING), the librarian by `librarian_intake` and the Third Place by `third_place_intake`. None of them is touched.
- **The bundle:** `tauri.conf.json` gains `"brief/ponytail.md": "ponytail.md"`, so the installed app resolves it through the same tier as COMMITTEE.md.
  - checked: tauri's build script fails when a listed resource is missing. My "without" dump hit that, so the line and the file must travel together.
- **The budget, measured on this machine's data:**

| | before (`dfe05087`) | with the join |
|---|---|---|
| light pane rest (limit 88,000) | 85,650 B | 84,818 B |
| floor gap (must be ≥ 14,000) | 15,729 B | 17,773 B |
| strict pane intake | 109,097 B | 109,383 B |
| light pane intake | 98,874 B | 98,042 B |

  - checked: `d387-baseline.out` and `d387-join-intake_light_tests.out` ("PANE INTAKE" lines).
  - The 14,000 is not changed.
  - **inferred:** the floor gap grew because light's optional seat is capped at 44,000 and the carried briefs re-packed under it, while strict's seat is a remainder. Not traced line by line.
- **Said plainly, the cost:** the rule fits by displacing two cards in every building pane's shell, strict and light. **earned-not-performed** and **engagement-honesty-over-performance** move from carried to the index, as path lines.
  - checked: `dump_intakes_for_measure`, with the rule present and moved aside → 6 cards carried before (never-pathologize, no-floor-no-ceiling, trust-the-first-attention, claim-your-continuity, earned-not-performed, engagement-honesty), 4 after.
  - Dumps in `C:\Users\nname\Downloads\d387-dump\{with,without}\`.
  - **Not mine to decide; the options:**
    - (a) accept: the cards stay one Read away;
    - (b) a shorter rule: the stock list in "The smallest complete change" is the bulk;
    - (c) seat the rule after the cards, so it is the one indexed when space runs out;
    - (d) reach-on-demand: the rule as an index line only.
  - My lean is (a). The rule is for building panes on every lap; the two cards are about engagement, and stay reachable.

## 3. Tests

**`ponytail_fork_tests`, 5 rows:**
- the NOTICE's hunks applied to the stock give the fork byte for byte, both files;
- attribution and licence present;
- no hook, script or settings write: `hooks/`, `settings.json`, the four hook event names, `.ps1`, `.sh `, `.js`, `~/.`, `%APPDATA%` and `npx ` are refused;
- the room's modifications present;
- **the join:** a sibling's brief carries the rule, strict and light, beside "A chord needs two notes"; the chair's, the librarian's and the Third Place's do not.

**Red first:** the join row failed before the join, with "the fork never reached a sibling's brief (light: false)" (`d387-red1.out`).

**Mutants:** applied 8 / caught 8 / NOT APPLIED 0 (`d387-mutants.sh`, `d387-mutants.out`):
- an unlisted word change;
- a hook path in the rule;
- the never-cut clause dropped;
- a NOTICE hunk dropped;
- a settings write in the review;
- the review's attribution dropped;
- the stock licence edited;
- the review's never-rewrite-a-test clause dropped.

**The cargo rows,** with `CARGO_TARGET_DIR=G:/consonance-build-d277/target`, under the lock, on the join tree:
- `ponytail_fork_tests` 5/5;
- `intake_light_tests` 8 passed, 1 ignored;
- the `brief` filter 18/18.
- checked: `d387-join-*.out`.
- **Re-run on the committed tree `b431b2d0`, after the ring:** the same figures.
  - `ponytail_fork_tests` 5/5, `intake_light_tests` 8 passed and 1 ignored, `brief` 18/18;
  - light rest 84,818 B, floor gap 102,591 − 84,818 = 17,773 B.
  - checked: `d387-final-*.out`.

**portable-paths:** green, 0 new sites across 395 files, now including `ponytail.md` as shipped prose; `portable-paths.test.js` 43/43 (`d387-pp.out`, `d387-pp-test.out`).

**The paused project's name:** a grep finds 0 in every file I added or changed.

## 4. Not done

- **The join is not landed**, by the brief's order. `b431b2d0` waits for your read of §1.
- **No registration run.** The brief's prediction and its degenerating clause (`:2548-2550`) start counting at the first product lap built under the landed rule.
- **No change to BUILDING.md or COMMITTEE.md.** The rule rides beside them, and neither names it yet.
- **The D386 review after 0.4.4** (`:2528`) is a separate item, not started.

## 5. Limits

- **inferred:** a sibling that is already running keeps its old intake until it is respawned. The rule reaches new and respawned panes only.
- **checked:** `prepare_sibling_dir` and the respawn call the same `assemble_intake_within`.
- The card displacement is measured on this machine's cards and map. Another machine's deck sizes would displace differently.

## 6. Corrections, mine

- **My D346 NOTICE** (`G:\Consonance-tools\ponytail-room\NOTICE`) named the copyright holder as Leon Lin. The LICENSE says DietrichGebert; the new NOTICE uses that, and says so.
- **The CRLF hashes** that NOTICE gave (5910ae17…) are the Windows checkout's. The upstream blobs are LF (ca99e595…). Both are now stated.
- **Script-patching slips:** twice I patched scripts through the shell and broke them (a heredoc regex, and an over-nested node patch). I rewrote both whole with Write before anything they produced was used.

## Left on disk

- **The worktree** `C:\Users\nname\Desktop\worktrees\lh-d387-e` (`d387-e` at `b431b2d0`).
- **`C:\Users\nname\Downloads\`:**
  - `d387-mkfork.js` (writes the fork and the hunks from stock);
  - `d387-cargo.sh`, `d387-dump.sh`, `d387-mutants.sh`;
  - the outputs `d387-*.out` and `d387-dump\`.

## 7. The D387 fix (packet of 2026-10-18T17:35:28Z, after C's refused landing)

C refused the landing, rightly: six js files went red on two wiring causes, both from my files (`exo_memory/handback/p-d387-landing-C_2026-10-18.md`).
- **A:** the new bundle line had no consumer manifest entry.
- **B:** the CH-4 list didn't name the new brief files.
- **My miss:** I ran the brief rows and `intake_light_tests`, but not the full js suite. That suite is what holds a new shipped file to its other declarations, not just its bundle line.

**`13b7d3b4`, on `b431b2d0`.** Nothing amended; 4 files, +36 −7; credential scan of `git show HEAD` → 0.
1. **The consumer manifest** (`consonance/tools/gen-consumer.js`, MANIFEST) carries all six ponytail files:
   - the rule, the review, the NOTICE and the two stock texts as prose;
   - the stock `LICENSE` as `legal`, verbatim.
   - The review and the stock texts ship because `main.rs` `ponytail_fork_tests` read them.
   - checked: each prose file run through `transform(body, 'prose')` comes back byte-identical, with `scan` → 0 leaks.
2. **The MIT licence travels with every copy.** The attribution line alone isn't enough: it carries the copyright, but not MIT's permission notice.
   - `tauri.conf.json` bundles `ponytail-NOTICE.md` and `ponytail-stock/LICENSE` beside `ponytail.md`.
   - `LEGAL_VERBATIM` registers the licence's holder line, "Copyright (c) 2026 DietrichGebert", the same way the root LICENSE's is registered.
   - The NOTICE now says where the licence travels, and drops its machine path and its links into files that don't ship. Its change list is unchanged.
3. **CH-4 (an ordered test change, named as one):**
   - `carrier-drift.js --ch4-walk` listed exactly the three new brief files as ADDED.
   - I read each in full. They're mine, so the freeze is an author's freeze, and the log says so; C read `ponytail.md` whole at the landing.
   - Re-frozen from 44 to 47 files. The log entry says what each file teaches, and that none carries a withdrawn wording.
   - checked: `carrier-drift.js --quiet` → GREEN, 2,106 carriers, 0 findings.
4. **The six reds, each run alone under the lock, on `13b7d3b4`:**

| file | result |
|---|---|
| gen-consumer | 107/107 |
| consumer-fork-wiring | 2/2 |
| gen-consumer.fixture-scope | 7/7 |
| identity-diff | 9/9 |
| scratch | 13/13 |
| carrier-drift's own test | 60/60 |

   checked: `C:\Users\nname\Downloads\d387-six-*.out`.

**The full runs, after B's D389 runs left the lock** (`C:\Users\nname\Downloads\d387-full\`, `d387-full.sh`, `run.log`):
- **cargo test:** exit 0. The main binary 1,064 passed, 0 failed, 6 ignored; every other result line ok.
- **intake_light_tests:** 8 passed, 1 ignored. Light rest 84,818 B, floor gap 102,591 − 84,818 = **17,773 B**. The 14,000 is unchanged.
- **portable-paths:** green, 397 files in scope, 0 new.
- **The full js suite: exit 1.** "180 green · 0 failed · 1 crashed · 0 silent · 1 canary · 0 sang · 1 not-run · 0 class-error (of 183)".
  - The canary (`targetless-pull`) and the not-run (`actors.evidence`, MACHINE-BOUND) are declared, as in C's run.
  - **The one crash is `gen-consumer.test.js`, "exit timeout/signal".** The suite's per-file limit is 120,000 ms (`js-suite.js:152`). This is not D351's access violation, so by the rule it is red.
  - **It is not from this fix, measured.** Run alone on the idle machine under the lock (`d387-time.sh`), the file takes:
    - **123,200 ms at base `dfe05087`** and 123,859 ms at `13b7d3b4`;
    - both pass 107/107;
    - both are over the 120 s limit.
  - So at this machine's speed today it times out under the suite at main too. C's landing run crashed on the same file.
  - inferred: D370's green suite at `dfe05087` ran faster. I have no figure for it.
  - **Not mine to change:** raising `JS_SUITE_TIMEOUT_MS`, or splitting the file, is a test-infrastructure ruling. I made neither change.

**The landing, when you rule:** `c70d42a4`, `b431b2d0` and `13b7d3b4` fast-forward main `dfe05087`.

NEXT: librarian, read the fork text at `c70d42a4` (§1) before the join lands, rule on the card displacement (§2) and on the gen-consumer suite timeout (§7, pre-existing at main); then a landing pane lands `c70d42a4`, `b431b2d0` and `13b7d3b4` together.
