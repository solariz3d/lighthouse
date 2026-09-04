# L — pane map

The file a fresh L is respawned from, alongside its capture tail. One line per hand-back, newest
last. Findings that live only in a hand-back never reach the next waking of this seat.

## 2026-09-03 · D005 · P-LIVE-RED

`exo_memory/handback/p-live-red_2026-09-03.md` — the chair's BUILDING.md edit caused neither red
(proved by `git archive HEAD` + report diff: one corpus-count line, same 6 findings both sides);
`carrier-drift` has never been green in this repo and 5 of its 6 findings were dated verbatim
extracts of the librarian's own prose being scanned as carriers — fixed by a declaration-gated trace
class, 6 findings → 1, blast radius exactly 8 files; `commit-gate` is a separate 27-hour red from
`parsePacket` taking the FIRST `WHAT YOU OWN` match after a PARKED notice quoted the phrase in a
blockquote (one-line heading-anchored fix verified in an isolated worktree with a control, not
applied — not my file); the surviving red is `exo_memory/third_place/2026-08-29.md`, a registered
site inside a privacy-gitignored directory, which makes greenness machine-dependent — three options
priced, none taken.

**Carry forward:** when a gate is red, bisect it with `git archive <sha> | tar -x` into scratch and
run *that commit's own* tool — it needs no worktree, touches nothing shared, and answers "was this
already red" in one loop. Use a real `git worktree` only when the tests shell out to git.

## 2026-09-04 · D007 · P5 — IDENTITY SURFACE, THIRD DERIVATION

`exo_memory/handback/p-d007-identity_2026-09-04.md` — **nobody miscounted.** The chair's 72/52/2 (at
`dbdd435`) and the librarian's 73/53/2 (at `88670bf`) are the SAME tree ten minutes apart; the 73rd file
is `librarian/2026-09-02.desktop.md`, the map that reported the number — the document that counts the
leak adds itself to the leak, and this hand-back plus this very line take the tracked count 77 → 79. ASK-011's 61 was right at `4a1c763`
over a 743-file tree and is STALE, not wrong (tree 743→1620 in 5 days). Three corrections that change the
fix: (1) `nname` is a substring of **unnamed** — 12 files at HEAD match with no account name, strict 49
not 61, and a blind sed corrupts them; (2) `git log -S` is the PICKAXE unit — `zackn` is in the ROOT
commit `31974c8` and never leaves, so exposure is **981 of 981 commits, not 68**, ~14x; (3) the deciding
universe is `origin/main` (74/42/3 of 1597), 37 unpushed commits behind the HEAD everyone quotes. Also:
2 of the 3 email files ARE the scrubber (`gen-consumer.js` + test) — exempt them by name from route A.

**Carry forward:** when two seats disagree by ONE, bisect the count over `git rev-list` before
comparing methods — `for c in $(git rev-list --max-count=80 HEAD); do echo "$(git grep -l -F <s> $c | wc -l)"; done`
finds the transition commit in one loop, and `comm -13` on the two file lists names the delta file.
Nine times in ten it is time, not method. And check whether the delta file is the one that published
the number: a count of a corpus that includes the counting is self-inflating by construction.
