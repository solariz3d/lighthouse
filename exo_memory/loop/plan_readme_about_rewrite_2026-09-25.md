# The README and the About tab — a whole rewrite, not a tweak. Librarian, on D, 2026-09-25 02:5x.

The keeper, verbatim: *"a comprehensive refactor of the readme on the repo and about within the app. Not tweaked but a
whole change to how its explained. I do not like the current format."*

## HIS DIRECTION (AskUserQuestion, 02:5x)
- **Audience: BOTH, LAYERED.** A short front for the curious stranger, and depth further down for the builder who will
  run it.
- **What is wrong now: TOO INTERNAL** (room jargon: laps, seats, rings, the keeper, the chair…), **WRONG ORDER**
  (mechanism before purpose), **WRONG VOICE**.
- **Lead with THE WHY:** the problem it answers, before any how.

## THE SOURCES (open, do not restate)
- `README.md` (165 lines, at the repo root; it carries inline `<!-- -->` history comments).
- `consonance/ui/index.html` `<section id="about">` (from `:273`); it ships inside the app bundle.
- The why, in the room's own words: BOOT's "The root", `dev/SPINE.md`, `cards/lighthouse-dive-buddy-reframe.md` (the
  stance, "with you, not above you").

## THE LAPS (strict wait-for-all)
1. **R1, diagnosis and a draft.**
   - **B (reads against):** a COLD STRANGER READ of the current README's first screen and the About tab, through an
     isolated `claude -p` with no room context. Ask: "what is this, who is it for, why would I care, what would I do
     next?" Record its answers verbatim, plus every term it could not parse. That is the baseline the rewrite must
     beat.
   - **C (research and writing):**
     1. The WHY, found in the sources above and said in plain words, with no room jargon.
     2. A jargon map: each internal term → plain words, or cut.
     3. A layered outline: why → what it is → what it does for you → try it → how it works → the method and the
        measurements (the builder layer).
     4. A FULL DRAFT README in that order.
     5. The About tab's text as that README's first layers, the same wording and a single source.
   - The inline history comments leave the README. They move VERBATIM to `exo_memory/record/readme_history.md` (the
     traces kept, not in the reader's way).
2. **R2, verify and build.**
   - **B:** the same cold stranger read on C's draft. The rewrite passes only if the stranger can say what it is, why,
     and what to do next, with fewer unparsed terms than the baseline.
   - **A (builds):** the About tab from the approved text, with a test that the About text and the README's front layers
     cannot drift apart.
3. **R3, the keeper reads the draft BEFORE it lands.** The repo is public, so the wording is his call. Nothing is pushed
   until he says so.

**Registered falsifier:** if the cold stranger, reading the new first screen, still cannot say in one sentence what
Consonance is and why it exists, the rewrite has failed on its own terms. We redraft; nothing ships.

## 2026-09-25 03:5x — R2 scored, and the keeper's R3 answers
- **B (R2, `loop/readme_about_r2_read_2026-09-25.md`):** unparsed items fell from 19/16 to **5/4** on the README first
  screen and from 46/52 to **15/14** on the About block. **Both FAIL on "what next".** No step is reachable: `## Try it`
  is at :60, below the About block.
- **A (R2):** the About tab is built from the block, word for word, with `consonance/ui/about-readme.test.js`. The history
  file moved to `loop/`. Owed: `README.md:228`'s link target, and three in-block links that point "below", which the app
  cannot reach.
- **THE KEEPER'S ANSWERS (AskUserQuestion, 03:4x–03:5x):**
  - **Root line: KEEP.**
  - **Dreams: one bullet**, as drafted.
  - **Failures section: where it is.**
  - **"Early": NO.** His words: *"I think we are more than early, maybe not finished, but we are getting there."* The
    librarian's proposed wording, pending his edit: *"A working research project, used every day by the person who built
    it — not finished, and honest about what hasn't worked."*
  - **The loop: "There should be a dedicated section explaining it, not with stupid line drawings too."** So it is a
    plain-words section on how the sessions hand work on and check it, in the README's how-it-works layer AND inside the
    About block. The ASCII diagram leaves the About, and the `lap-row.test.js:1055` pin goes with it (that test's own
    message says to).
  - **Tagline: BOTH.** "Instances, in concert." as the header, and the plain lead line right under it.
- **Next, SEQUENTIAL** (A and B work from C's text):
  - **R2b-1, C:** the revision.
  - **R2b-2, A and B:** A re-renders the About, sets the header, and drops the diagram and its test. B re-reads.
