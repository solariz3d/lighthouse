# The outside reader's review of the track builder: checked, triaged, laps. Librarian, 2026-10-30 23:1x

Source: `C:\Users\nname\Downloads\t180-track-builder-review.md` (11,199 B, written 2026-10-30 16:38 by the same outside reader's own Claude, at public main 82db6c3, on Linux, the app never launched). Measured before answering, per the BUILDING.md rule landed today (d562-a).

## His countable claims, checked on land-0431 a6af8cf

| claim | checked |
|---|---|
| no licence | true: no LICENSE or COPYING |
| ~2,500 decision numbers (D421 etc.) in src/ and app/ | true: 2,462 lines |
| 61 JS/Rust files mention exo_memory/ | 31 files in src/, app/, src-tauri/ (his count likely includes tools/ and tests); true in kind |
| comments cite docs/research/, no docs/ folder | true: 5 files |
| a test reads ~/.consonance.json | true: app/test/sculpt-frame.test.js |
| "csp": null | true: src-tauri/tauri.conf.json |
| stale descriptions ("in words, fonts and tempo", "from words") | true: Cargo.toml and tauri.conf.json shortDescription |
| a screenshot placeholder at the top of the README | true: README.md:12 is an HTML comment placeholder |
| 12 % of lines over 160 characters in src/ + app/core/ | 2,560 of 21,431 (11.9 %) |
| no CI | true |
| five tooling test failures on Linux | not reproduced here (the project targets Windows; the suite is green on Windows at 0.4.31 bar timing rows) |

Every claim he could count holds. The review is a careful read of a codebase from outside, not a guess.

## Triage

**The keeper's calls (named trades, his word on each):**
1. **A licence.** Without one nobody may legally fork or redistribute. Recommendation: MIT for the builder's own code, with the ported actools files keeping their Ms-PL text as now. His call because it is permanent once published.
2. **The README essay** ("A note from the AI that helped build this"), which he chose to keep on 10-28. The reader says it will put off experienced track builders. Recommendation: keep a short factual note on how it was built, move the long essay to a separate file linked from the README. His call; it was his decision to keep it.
3. **"Say which reference tracks the width, grip and corpus data came from."** This conflicts with his rule that no other creator's track or name appears in the public repo. Recommendation: do NOT name them; reword the claim instead so it says measurements (numbers only) were taken from existing community tracks. That answers the honesty point without the names.

**Just do it / check it, inside his existing rules (the repo is the product):**
4. Stale descriptions in Cargo.toml and tauri.conf.json: "Build Assetto Corsa tracks for the T-180 cars". Just do it.
5. A real screenshot at the top of the README: one 1920x1080 headless render of the builder with a track and the Extend ghost, in sigil (the default look), replacing the placeholder. Just do it.
6. Remove the ~/.consonance.json read from app/test/sculpt-frame.test.js: the room's config leaking into the product's tests. Check it.
7. A content security policy in tauri.conf.json instead of null: a real second line of defence (CLAUDE.md: keep security features on). The module loader uses `new Function` on the app's own files, so the policy needs `script-src 'self' 'unsafe-eval'`; everything else 'self'. Check it: every app test green and a headless launch of every page. Rides the next release.

**Larger, after the weekly reset (usage):**
8. **Comments that stand alone.** 2,462 decision-number references, 31 files citing exo_memory/, 5 citing docs/research/, ~141 files with pane or plan talk. The reasoning in those comments is good; the pointers are useless to anyone outside the room. A sweep in passes by directory: strip the D-numbers, the exo_memory and docs/research paths and the seat names, keep the reasoning as plain sentences, change no code (tests and fixtures 0 of 9 as the proof). This also completes his own 10-29 rule (no lap ids in the public repo) for the code itself, which until now covered only commits and docs. Several panes, several laps; the biggest maintainability item in the review and the reader's own first concern after the licence.
9. **CI.** A GitHub Actions workflow on windows-latest running a fast subset (the core and export tests, minus mutation and frame-timing) on every push, the mutation harnesses weekly. It publishes nothing; it makes "3,000 tests" verifiable by anyone. Check it.
10. Long lines and big files (coreshell.js 1,619 lines): no lap; follows from 8 where the paragraph comments become wrapped sentences.

**Not acting on:** the "dependence on one person" and "narrow scope" points (true, disclosed, not fixable by code); "See it in Assetto" shipping untried (disclosed and off by default; the reader's advice to users is already the README's).

surfaced: the review file; land-0431 greps above; memory t180-repo-is-just-the-product and named-trade-needs-named-yes; BUILDING.md (d562-a) critique rule; CLAUDE.md security section.
