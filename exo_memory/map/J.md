# J's map — one writer, appended by J alone

Findings with evidence pointers, per ../map/README.md. Nothing here is transcribed from another
document; a pane is respawned from its capture tail plus this file, so a finding that reaches only a
hand-back never reaches the next waking of me. That is the whole reason this file exists.

## 2026-09-03 — P-CONSUMER-REG, the attack (lap D005)

### Hand-back: `exo_memory/handback/p-consumer-reg-attack_2026-09-03.md`

Written BEFORE B's registration landed — the scoring rule for it is pre-registered in §0 so it
cannot be fitted to the text it will judge.

### The stranger-install falsifier is unscoreable, and not for the reason it looks like

Not "no stranger exists." **Three of the four wake proofs (`librarian/LEDGER.md:15`, row L034) print
on a working fresh install exactly what a broken one prints, and the fourth prints nothing.**
Proof 1: `main.rs:4168` emits `# YOUR OWN MAP` only if the map file reads, `map/` is not in
`gen-consumer.js`'s MANIFEST, so a stranger gets 0 of 4 — the same reading that diagnosed the real
`293c0d7` resolver defect. Proof 2: `mcp.rs:411` `if !open { return true; }` — no lap means nothing
is ever refused. Proof 3: recorded SPLIT here, never a clean pass. Proof 4: the keeper's glance, no
printed output at all. **The general shape to carry: a check can be machine-bound not by where it
RUNS but by where its pass-condition MEANS anything.**

### The instrument that replaces it already existed and had never been run

`js-suite` inside the generated consumer tree. Private tree `68 green · 4 failed · 0 crashed (of
73)`; generated tree `42 green · 17 failed · 3 crashed (of 63)`; only 2 failures shared. **18 test
files that pass in the workshop are broken in the product**, and all 3 crashes are MANIFEST gaps
naming their own missing file (`dev/shell/install.ps1`, `consonance/src-tauri/tests/arch_test.rs`,
`dev/shell/hooks/userprompt-submit.js`). `gen-consumer.build.test.js` runs `cargo check`, which
never builds `tests/` — the gap the generator's header claims was "partly closed" is open.

### The split predicate contradicts the only code that implements it

`record/` — predicate STAYS, MANIFEST SHIPS all 3. `memory/` — predicate ships a subset, MANIFEST
ships none. So 2 of the librarian's "5 DANGLING files" are not in the product at all, and
`research/the_retrieval_problem_outside.md`, which the generator does rewrite, was never in the
grep universe. Measured on the output: **4 files, 9 rewritten lines**, and 2 of the 5 occurrences of
the substituted phrase are ungrammatical (one inside backticks where a filename used to be).

### `gen-consumer.js`'s privacy premise — half the chair's claim survives, and it is the better half

"private/public" at `:2` is a ROLE label and is the keeper's own wording from
`journal/2026-08-22.md:559`. What fails is the architecture on top of it: `curl` returns **HTTP 200**
today for `memory/user-solariz3d.md`, the journals and the LEDGER, so every IDENTITY leak pattern
guards already-published content. The scan is a **coherence** boundary, not a privacy one. And the
map at 10:20 still lists "the privacy flip on lighthouse" as pending, twelve days after the room
recorded it had happened — the carrier class again.

### Two claims I killed before they left the pane

`letters.json` IS created lazily (`main.rs:3084`), so a stranger does get lettered panes. And
`SEED.md`'s `journal/` hits are BARE DIRECTORY references, which `gen-consumer.js` documents as
non-dangling — the librarian's grep pattern over-matches, which is why its 5 and my 4 differ.
**Check the universe of a grep before quoting its count.**
