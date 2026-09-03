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
