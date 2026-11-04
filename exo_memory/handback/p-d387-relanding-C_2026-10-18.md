# D387 re-landing hand-back: DON'T LAND, by the order's rule; the one red is this checkout's CRLF card, not D387 (pane C, sibling-0845a868)

Order: the chair's D387 re-landing (2026-10-18T19:22:20Z). Object: `d387-e` at `13b7d3b4`, on `b431b2d0` and `c70d42a4`. The librarian's ruling is at `exo_memory/librarian/2026-10-18.md` (the 13:21 D387-fix entry). E's fix is in §7 of `p-d387-ponytail-fork-E_2026-10-18.md`. My first landing is `p-d387-landing-C_2026-10-18.md`.

SC = this seat's scratchpad. The outputs are in `SC/d387b/`.

## 0. The answer

**Don't land, by the order's rule ("Any red"). Main is reset to `dfe05087`** with `git reset --keep`. Nothing is pushed, and nothing is changed on `d387-e`.
- checked: `git log -1 main` → `dfe05087`; `ls consonance/src-tauri/brief | grep -ci ponytail` → 0; `git branch --contains 13b7d3b4` → `d387-e`, `d390-b`.

**The one red is not D387's.** It is `consumer-fork-wiring.test.js`:
- In the main checkout, red in the suite and red alone.
- **At the same commit `13b7d3b4` in E's clean worktree: green, 2/2** (`SC/d387b/fw-etree.out`).
- The cause, checked: the row reads the working tree (`G.build(out, { allowDirty: true })`). In this checkout `exo_memory/cards/engagement-honesty-over-performance.md` is **CRLF**, written 2026-07-07 09:25 and untouched by D387. Its relabel row (`consumer-relabel.js:195`) looks for `'He also caught\nme mistaking'`, which a CRLF file can't match.
  - checked: `git ls-files --eol` → `i/lf w/crlf attr/text=auto eol=lf`, so the attribute says LF and the working file isn't;
  - `file` in E's tree → LF;
  - the failure, verbatim: "exo_memory/cards/engagement-honesty-over-performance.md: the relabel did not reach the output: The keeper also caught";
  - 9 of the 13 tracked cards here are `w/crlf` (`git ls-files --eol exo_memory/cards/`).
- inferred: so this row is red in this checkout at `dfe05087` too. I didn't run it at `dfe05087`, because that would need main moved back for a test of a file the landing doesn't touch. In my first landing this row was already red, masked by the bundle refusal.
- **The ruling is yours:**
  - (a) land on this evidence: a fast-forward, nothing to re-run except this row;
  - (b) first renormalise this checkout's cards to LF and re-run the row. That writes 9 working files in the shared checkout, so it isn't mine to do unasked.

## 1. The runs

1. **Fast-forward:** `git merge --ff-only d387-e` → 3 commits, `13b7d3b4`.
2. **Lock:** I waited for no `heavy-run*.lock` machine-wide before each full start. E's probe held one at the packet's time.
   - checked: `SC/d387b/run.log` → "lock free at 19:23:03Z before js-suite", "lock free at 19:39:10Z before cargo".
3. **The js suite, with `JS_SUITE_TIMEOUT_MS=300000`.** The limit was raised from the 120,000 default at `js-suite.js:152`, by the librarian's ruling (2).
   - **exit 1, 967 s.** "180 green · 1 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 1 not-run · 0 class-error (of 183)"; "0 neither".
   - The failure is `consumer-fork-wiring` (§0).
   - The canary is `targetless-pull`, the not-run `actors.evidence` (MACHINE-BOUND), both declared as before.
   - D351: 0 crashed, 0 silent.
   - **gen-consumer passed: 157,524 ms, inside 300 s. No other file was over 120 s.** The next slowest:
     - state-sync 83,293 ms;
     - forget-rate 67,387 ms;
     - tail-carry 46,392 ms.
   - The times come from a preload I added (`SC/d387b/timing.js`, through `NODE_OPTIONS=--require`). It appends each `*.test.js` process's wall time to `timing.log` at exit and writes nothing to stdio or the tree. js-suite prints no per-file times.
     - checked: `awk -F'\t' '$1>120000' timing.log` → only gen-consumer (logged twice, so a second process also ran that file).
     - The fork-wiring row was red alone without the preload too.
4. **cargo test:** exit 0, 137 s. The main binary 1,064 passed, 0 failed, 6 ignored; every other result line ok.
5. **intake_light_tests (`--nocapture`):** 8 passed, 1 ignored.
   - "PANE INTAKE rests at the floor reserve: light 84818 B, strict 102591 B" → gap **17,773 B**, at least 14,000. The 14,000 is unchanged.
   - "PANE INTAKE strict 109426 B, light 108978 B" (`SC/d387b/intake.out`).
6. **Credential scan** (`dfe05087..13b7d3b4`): 3 commits, 535 added lines plus the messages; **total 0.**
   - **portable-paths:** green, 397 files in scope, **0 new** (`SC/d387b/pp.out`).
7. **No push, no install.**

## 2. Not done

- No line-ending change in the main checkout (§0 (b)).
- No run of the row at `dfe05087`; see the inferred line in §0.

## 3. Corrections

- My first landing hand-back named only the bundle refusal for `consumer-fork-wiring`. inferred: the CRLF failure was underneath it too, hidden because the refusal comes first in the row. The card's mtime is 2026-07-07, so it predates both runs.

## 4. LANDED (the chair's packet of 2026-10-18T19:44:48Z, after the librarian ruled (a))

**Main is at `13b7d3b4`.** Nothing is pushed: the lighthouse push stays held on the keeper's call.
- checked: `git merge --ff-only d387-e` → fast-forward; `git log -1` → `13b7d3b4`.

**The nine cards are renormalised to LF**, by name, with no wildcard:
- dont-offer-rest-assume-momentum, earned-not-performed, engagement-honesty-over-performance, essence-at-the-edge, interior-at-the-seam, lighthouse-dive-buddy-reframe, no-floor-no-ceiling, trust-the-first-attention, verify-before-claiming.
- Before: all nine `i/lf w/crlf attr/text=auto eol=lf`, and `git status --short exo_memory/cards/` empty.
- **`git checkout --` on the nine skipped all nine** (still `w/crlf`) as up to date. So, one file at a time:
  - I confirmed the file was clean (`git status --short -- <path>` empty);
  - deleted it;
  - ran `git checkout -- <path>`.
- A backup of the nine CRLF files is kept in `SC/d387c/cards-crlf-backup/`.
- checked: `git ls-files --eol` on the nine → all `w/lf`.
- checked: `git status --short -- exo_memory/cards/` → empty.
- checked: each one's text is identical to its backup with the CRs stripped (`cmp` of `tr -d '\r' < backup` against the new file → 9 same).
- The other four cards were already `w/lf` and weren't touched.

**`consumer-fork-wiring.test.js`, re-run in the main checkout under the lock: 2/2 pass, exit 0** (`SC/d387c/fw.out`). The relabel row that was red now passes.
