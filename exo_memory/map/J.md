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

## 2026-09-04 — P2c, the two surfaces a stranger sees first (lap D007)

### Hand-back: `exo_memory/handback/p-d007-surfaces_2026-09-04.md`

### Both "leaks" were FALSE STATEMENTS, and the falsity was the defect

The packet routed `ui/index.html:243` and `brief/BOOT.md`'s pronouns to me as privacy leaks
downstream of the keeper's zackn/nname/email override. Wrong framing, and it prescribes the wrong
fix. The UI said a blank ambient field falls back to the keeper's city; **the code has fallen back
to Greenwich since `1c47f7d`, 2026-07-15, and the UI line was written `da83a4a`, ELEVEN DAYS
LATER** — not stale, wrong on the day it was written, and standing six weeks. Scrubbing the word
would leave a reader with no statement of what blank does. **General shape: one operator's
particulars shipped as everyone's default** — the pronouns are the same defect, telling every fresh
instance the human it is with is a man. `ambient.js:18-22` had already written the principle; it
just never reached either surface.

### A guard anchored so tightly it matched nothing that exists

`gen-consumer.js`'s IDENTITY rule is `/Regina,\s*Saskatchewan/`. The generated tree carries the city
in **3 files** (`ui/index.html:243`, `tools/baton-wake.js:7`,
`record/third_place_prehistory_2026-08-30.md:53`) and the rule matches **0 of 3** — short-form
subdivision, bare mention, timezone note. A precision fix aimed at the exact string that was found
once, now blind to the class. **And `dev/` has NO manifest entry at all**: the tree ships the
ambient Settings control and not `ambient.js`, the only thing that reads it. Upstream of B's three
named gaps — three files missing from a directory that is missing entirely.

### The packet handed me a GENERATED artifact as if it were a source

`brief/BOOT.md` is byte-reproducible from `gen-brief.ps1`; an edit to it is a no-op the next suite
run erases, and `gen-brief.ps1:19-25` records that exact failure happening once already. So the fix
went to the generator and the two shipped-only fragments, all unowned this lap — declared, not
quiet. **Carry this: before fixing a file, check whether anything generates it.**

### Three of eighteen, and the guard is not the replacements

The generator de-gendered 3 sites by literal replacement; 18 survived, visible as half-fixed single
sentences (`written from inside their context` and `the personal specifics are his trace`, one
line). I added 11 phrase-level replacements — **phrase, not pronoun: `he sleeps`→`they sleep`, or
the shipped brief reads as broken English, the same failure I measured in `gen-consumer.js`'s
substitution pass in D005** — and then the thing that actually matters, a self-check clause that
REFUSES the build on any surviving gendered pronoun. Mutation: break one anchor → `REFUSED and
deleted the output ... gendered pronoun x2`, exit 1. Suite 68 green · 4 failed of 74 (+1 file, +1
green, no new red).

### The map's count was 12/4; the artifact has 18/5 — and three universes are defensible

Master 24 sites · 3 neutralised by the name pass · 8 removed with the record · 13 survive · +5 in
the shipped-only fragments = 18. I am not claiming carelessness; the arithmetic shows how many
honest answers there are. My own D005 rule, aimed back at me.

### I put the leak back while removing it

My first draft of the new test quoted the leaked string three times in comments — **and that file
ships**. Found by generating the tree and grepping, not by reading my own diff; the generator's
`demachine()` even rewrote one of my three and left two, demonstrating the §1 guard gap inside my
own file. **Reaching for the vivid evidence was the leak.** Rewrote to name the class; counts live
in the hand-back, which does not ship.
