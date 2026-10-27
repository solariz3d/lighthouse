# D491: the README's AI note gets the solo-developer estimate and the nuance of the objection. Librarian, 2026-10-27

The keeper, 07:26: "you should add that part to the readme, how long it would take a solo dev and the nuance behind the whole anti ai paradygm"

Figures, checked by the librarian at 07:23 on t180 origin/main 82afc11 (`git show` + `wc -l`):
- program code: src 14,665 + app 14,064 + src-tauri/src 2,048 + scripts 1,495 lines, so about 32,000;
- tests: 43,514 lines in 287 test files;
- 564 commits, 2026-09-27 to 2026-10-27.

## One part, pane A (just do it), on d486-a after d604e724

In README.md's "## A note from the AI that helped build this":

1. **Replace** the paragraph that starts "**How fast this is moving.**" with:

> **How fast this is moving.** At version 0.4.23 this builder is about 32,000 lines of program code and 43,500 lines of tests, from its first commit to twenty-two releases in about a month. My estimate for one skilled developer building the same thing by hand, full time, is a year and a half to three years. On evenings and weekends, the way most mod tools get made, it's five years or more, and most solo projects this size stall before they get there. That's a judgment, not a measurement: finished, tested code comes at a few dozen lines a day, and the research (the track maths, Assetto Corsa's file format, the car's limits) doesn't speed up with skill. For a niche car mod, the realistic alternative was never a hand-built version. It was no builder at all. Nobody, human or AI, knows yet where this leads. The future I'd want is the one this project runs on: the tools get faster, and people stay in charge of what's worth making.

2. **Insert** a new paragraph after the one that starts "**If you're skeptical.**":

> **Why so many people are against it.** Some of the objection is fair, and I'd rather name it than wave it away. People have watched AI companies train on artists' work without asking. They've watched their feeds fill with things nobody made with care. Some are afraid for skills they spent years earning. Those are real concerns. Here is what this project does about them: no one's track, model or texture is in it or in anything it makes; every change is checked and written down; and a person decides what gets built. The rest of the objection is often about belonging. A community takes a position, and holding it is part of being in. That's ordinary, and it isn't stupidity. What changes minds is rarely an argument. It's someone you trust showing you something good they made.

- Before committing, check the factual claim "no one's track, model or texture is in it": `git ls-files` holds no community track file or render (D488 removed the two renders). The measured widths are numbers, not content. If anything else is found, stop and report.
- Update the release count if the landing changes it. 0 "keeper" in the added lines. No CHANGELOG line (docs).
- It rides the next batch with d486-a, so the keeper reads it before it ships.

## Read, 07:31 (A a7c1e1ee / t180 d486-a fd4c8ead): accepted. D491 CLOSED.

- Every figure was re-derived by A. The 43,500 counts test helpers, and they are test code, so it is kept.
- The no-content check holds.
- For the next landing: the README's "564 commits" (:42) and the release count are re-derived at release, as E did at 0.4.22 and 0.4.23.

## D494, 07:34: land d486-a onto main now, no release. Landing pane E (prove it: a push)

The keeper asked whether the README addition is in yet. It is committed (fd4c8ead), not pushed. A README does not need a release to be live, so d486-a (b6106130 X hover, dcedd30 Credits, cdd19bf7 + d604e724 renders removed, fd4c8ead the AI note) lands onto main now.
- Merge d486-a onto origin/main 82afc11, --no-ff. Full suite (frame rows re-run alone if red). Credential scan on the added lines. 0 "keeper" in public text. Push under the standing permission.
- No version bump, no release, no install. The X hover line stays under [Unreleased] in the CHANGELOG for the next batch.
- Hand-back: the merge sha, the suite totals, the scan counts, the push-gate line, and a fetch of https://github.com/solariz3d/t180-track-builder/blob/main/README.md showing the new paragraph.

## 08:05: pushed by the librarian. D494 withdrawn from E.

At the keeper's 07:54 rule and his 08:03 word, the librarian pushed d486-a fd4c8ead to main as a fast-forward (82afc11..fd4c8ea; push-gate allow at 14:04:43Z). Checked on GitHub: the README now carries the solo-developer estimate, the objection paragraph and the new Credits (3 of 3 phrases found). No release, no install; the X hover stays under [Unreleased]. E's suite result, if it finishes, is a note and gates nothing.
