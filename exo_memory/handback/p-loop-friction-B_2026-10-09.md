# D276 item 5 (pane B): what the work checks caught vs what the paperwork gates caught, since 2026-10-08. MEASURE ONLY.

**Output:** `exo_memory/loop/loop_friction_B_2026-10-09.md`, with the counts, every catch cited path:line or sha, and the commands. Scripts are in
`exo_memory/handback/p-loop-friction-B_2026-10-09_evidence/` (pairs.js, repair.js, refusals.js). Nothing in the repo or the app was changed. There is
no recommendation.

## The numbers
    WORK CHECKS       132 distinct catches (cold read 1: 36 · cold read 2: 28 · cold read 3: 10 · parity JS 22 · parity cargo 5 · mutation 9 ·
                      cold sweep 3 · stranger install 3 · identity-diff 4 · suites 4 · generator self-checks 3 · release 2 · portable-paths 1 ·
                      carrier-drift 1 · derive.ps1 census 1)
    PAPERWORK GATES   0 catches in 38 paperwork refusals: SOURCES 31, reply slot 6, NEXT trailer 1
                      (+1 OUT-OF-TURN baton refusal, mine, not a paperwork gate)

- **SOURCES, 31 refusals:**
  - 20 re-sends had identical content.
  - 11 changed: 6 withdrew a checkable detail (5 shown true, 1 not checkable now), 4 were wording, and **1 lost its whole body**.
  - The body loss, librarian 2026-10-09T08:54:44Z: the accepted re-send carried only its SOURCES / OUTPUT / NEXT lines. It lost a credential-scan
    result ("283 commits, 619 files … No tokens") and two requests.
  - Refusal → re-send: median 9 s, max 40 s, 364 s in total.
- **Reply slot, 6 blocks:** 5 identical, 1 changed one word.
- **NEXT trailer, 1 refusal:** content identical.
- **No hand-back since 10-08 records a gate refusal forcing a claim correction.** Three extraction reads looked for one.

## How (so it can be checked)
- **Paperwork side:**
  - `sources-gate.jsonl` stores a ring's sha only, and a refused ring never reaches the board, so the refused text and its re-send came from the
    five SENDERS' transcripts (`tool_use` inputs, read-only).
  - Content = the message minus its SOURCES / NEXT / OUTPUT lines.
  - The first pairing (the seat's next allow) mispaired 2 of 31 to different messages. Re-paired by similarity, both are identical (13 → 11 changed).
- **Work side:**
  - Three read-only extraction reads, in parallel: the cold reads plus the plan; A/C/E's 12 hand-backs; my parity hand-back.
  - I spot-checked 10 citations against the files, and all 10 matched.
  - Duplicates were removed by hand, keeping the first finder. For example, a cold-read item later fixed in my parity laps counts once, under the
    cold read.

## What it does not establish (as in the file)
- **The definition decides the count.** Cold-read rows include identity and wording findings that were acted on. About 40 borderline items were
  excluded, and the extraction reads list them.
- **Only gate REFUSALS are read.** A gate can change what a seat checks before sending, with no refusal, and that is invisible here.
- **The window is 2 days and one project.**

## Corrections (mine)
- **W1:** the first SOURCES pairing said 13 changed; mispairing; 11 after re-pairing (both numbers and the method are in the file).
- **W2:** my first draft of the file had a duplicate row 131 and a totals line that contradicted it (install.ps1 -Check 1, parity JS 21). Fixed
  before handing back: parity JS 22, install -Check 0 (the same defect as row 123). Rows are numbered 1-132, with no duplicates (checked with
  `grep`).
- **W3:** my first refusal classifier missed hook-error refusals (it found 2 of 33); fixed to read `is_error`.
- Heredocs ate backslashes in two patch attempts; redone with Edit.

NEXT: librarian merge item 5 into the D276 measurement and score H when the four parts are in
