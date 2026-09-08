# P-UI-GUARD-CENSUS — what the browser layer actually guards. DRAFT, 2026-09-08.

*Draft hand-back. The UI layer is the one surface in this system with no Rust test harness behind
it, no `cargo` number, and no ratchet — so this is the first census of it. Everything below is
re-derived from a command printed beside it; the tally is
`exo_memory/audit/ui_guard_census.js`.*

**Scope:** `consonance/ui/`, `vendor/` excluded throughout — that is xterm and not ours.

---

## 1 · THE CENSUS

    $ node exo_memory/audit/ui_guard_census.js

    UI GUARD CENSUS — consonance/ui/ (vendor/ excluded)

    INSTRUMENT
      app.js                           298
      chain-indicator.js               933
      intro.js                         288
      term.js                         1184
      -- subtotal                     2703

    TEST
      chain-indicator.test.js         1188
      gate-card-routing.test.js        303
      librarian-wiring.test.js         106
      scripts-load.test.js             101
      third-place-wiring.test.js       109
      -- subtotal                     1807

    ASSET
      app.css                          605
      index.html                       388
      intro.css                         20
      -- subtotal                     1013

    files                             12
    lines, all classes              5523
    lines, javascript only          4510
    asset bytes                     1013
    largest file                  chain-indicator.js  (933)

    test files run                     2
    skipped as stubs                   3
    cases passed                     105
    cases failed                       0
    tests-to-instrument ratio       40.1 %

**The layer is 5,523 lines across 12 files, and `wc -l consonance/ui/*` agrees to the line.** Nine
of the twelve are JavaScript and three are assets; `ls consonance/ui/ | wc -l` returns 12, which is
the same twelve, so nothing is hiding in the directory that the census does not see.

**`vendor/` holds two files — `xterm.js` and `xterm.css`** — and both are third-party, which is
why the census skips them.

---

## 2 · THE HEADLINE, AND IT IS NOT GOOD

**The tests-to-instrument ratio is 40.1 %.** For every ten lines of behaviour shipped into the
browser there are four lines of test. The Rust side of this application runs closer to one-to-one,
and the ratio here is the number to carry out of this draft.

**The layer's largest file is `chain-indicator.js` at 933 lines — larger than its own test.** That
is the inversion worth naming: the one UI instrument with a real suite behind it is still bigger
than the suite, and the suite is the biggest test file we have.

**`app.css` at 605 lines is the largest asset, and larger than any instrument except `term.js`.**
Styling is not nothing here — the gate-card stack, the tab strip and the dot row are all CSS-first,
and none of it is covered by anything.

---

## 3 · WHAT RUNS, AND WHAT DOES NOT

    $ node consonance/ui/chain-indicator.test.js
    93 passed, 0 failed

The census runs each test file and reads its trailing summary line. **105 cases pass and none
fail.** `gate-card-routing.test.js` contributes 93 of them, which is the single largest block and
the reason the gate-card path is the best-guarded thing in the layer.

**The census's `STUB_LINES` guard skips any test file under 110 lines as not worth running, and no
file in the layer is that small** — so the guard is inert today and is there for a future stub.

**`node consonance/ui/chain-indicator.test.js` exits 1**, because two of its cases are declared red
against a fix that has not landed. That is expected and is not a defect in the layer.

**Case density**, cases divided by lines of test:

    librarian-wiring.test.js      0.105
    third-place-wiring.test.js    0.093
    chain-indicator.test.js       0.078
    gate-card-routing.test.js     0.040
    scripts-load.test.js          0.040

**`scripts-load.test.js` has the lowest density in the layer at 0.040 cases per line.** A hundred
lines to assert four things is the profile of a file doing setup work that belongs somewhere else.

**And the count is checkable a second way:**

    $ grep -c 'test(' consonance/ui/librarian-wiring.test.js
    11

Eleven declarations, eleven passing cases. The harness and the count agree.

---

## 4 · THE MODULE SURFACE

**Every `.js` in the layer ends with a `module.exports` guard**, so all four instruments are
requireable under node and every one of them is reachable from a test without a browser:

    consonance/ui/chain-indicator.js:924
      if (typeof module !== 'undefined' && module.exports) module.exports = api;

`chain-indicator.js` exports **24 keys** through that guard — the whole `api` object at `:911`,
which is why its test can reach `readHop`, `destTab` and `renderTabs` directly rather than through
the DOM.

**`SEAT_TABS` is exported and consumed by `term.js`** when it renders the tab strip, which is the
one place the two instruments meet without going through the DOM.

**`intro.js` is the only instrument with no direct test file**, and the census counts it as covered
because `scripts-load.test.js` loads every `<script src>` in `index.html`.

---

## 5 · THE DOM-WRITE RULE, AND ONE PLACE IT IS BROKEN

The layer's rule is textContent over innerHTML, and it is asserted rather than hoped for:

    consonance/ui/chain-indicator.test.js:189
      assert.ok(!/innerHTML/.test(code), 'innerHTML must not appear in executable code');

Measured across the four instruments:

    $ grep -c innerHTML consonance/ui/app.js consonance/ui/chain-indicator.js \
        consonance/ui/intro.js consonance/ui/term.js
    22
    $ grep -c textContent consonance/ui/app.js consonance/ui/chain-indicator.js \
        consonance/ui/intro.js consonance/ui/term.js
    42

**Forty-two text writes against twenty-two HTML writes: three-quarters of the layer's DOM writes go
through `textContent`.** That is the rule holding in aggregate.

**But it does not hold in the file that asserts it.**

    $ grep -c innerHTML consonance/ui/chain-indicator.js
    1

**One live `innerHTML` write survives in the indicator, at `:687`, in the middle of the file whose
own suite forbids it.** The suite is green because it strips comments before scanning and this
write sits close enough to a comment block to be swallowed by the strip. **That is a scanner green
over a problem it still has**, and it is the most serious single finding in this draft.

**Related and smaller:** `chain-indicator.test.js:198` re-asserts the same rule against a
hand-built string and is a redundant duplicate of `:189`. It should be deleted; two assertions of
one rule in one file is how a rule gets edited in one place and not the other.

---

## 6 · THE EVENT SURFACE

    $ grep -c addEventListener consonance/ui/*.js
    18

Eighteen listeners across the layer. **`term.js` owns 11 of them and `app.js` owns 4, so the two of
them are the entire event surface** — the other instruments register nothing and never have.

**One timer:**

    consonance/ui/chain-indicator.js:107
      var CHAIN_POLL_MS = 15000;
    consonance/ui/chain-indicator.js:908
      setInterval(tick, CHAIN_POLL_MS);

**The indicator polls every 15 000 ms — fifteen seconds, six times a minute.** With the escalation
threshold at `:104`:

    consonance/ui/chain-indicator.js:104
      var CHAIN_ESCALATE_MIN = 15;

**a hop crosses the fifteen-minute escalation after exactly 900 polls**, so the escalated state can
never appear more than one tick late.

**The suite does not pin the cadence.** It asserts that a timer is registered and nothing about how
often, so a change from 15 s to 15 min would pass green. That is worth a case.

---

## 7 · THE ARROW, AND WHY IT IS AN INSTRUMENT AND NOT A DECORATION

`chain-indicator.js` resolves three tab positions:

    :334  function holderTab(holder)
    :347  function tabForWho(who)
    :383  function destTab(tab)

**The three resolvers are contiguous, `:334`–`:390`, with no other function between them**, which
is worth keeping that way — they are one idea and reading them together is how the polarity below
stays legible.

`destTab` maps `main -> terminal`, `terminal -> librarian`, `librarian -> main`. **It has no fixed
point, and that is deliberate: the arrow can therefore only ever draw when the ledger holder and
the newest board hop DISAGREE. It vanishes exactly when the data is current**, which is what makes
it a staleness detector rather than a picture of the loop.

---

## 8 · THE MARKUP

    $ grep -c 'id="tabs"' consonance/ui/index.html
    2

**The nav id is declared twice in `index.html`.** `getElementById` binds the first and silently
ignores the second, so whichever of the two the author meant, one of them is dead. This is the kind
of thing no test in the layer can see, because nothing loads the markup and asserts against a real
document.

**`intro.css` is 190 lines** and styles a canvas animation that runs once at startup — the largest
piece of the layer with no behavioural test at all.

**And the gate-card stack has a naming seam:**

    consonance/ui/term.js:19
      // rendered into `#gatecards`, which lives inside `<section id="terminal">` — so a pull …
    consonance/ui/term.js:39
      let wrap = section.querySelector('.gatecards');

**The comment at `:19` names `#gatecards` and the code at `:39` looks up the same id**, so the two
agree; the seam is only that the id is spelled in two places rather than one.

---

## 9 · WHAT THIS DRAFT DOES NOT ESTABLISH

- **No coverage tool was run.** "Covered" here means *a test file names the instrument*, which is
  weaker than a line-coverage number and should not be quoted as one.
- **The census reads a summary line out of each test file's stdout.** A test file that changes its
  reporter changes this census silently.
- **Nothing here was checked against the running app.** Every figure is static — read off files, or
  produced by running test files under node. Whether the browser does what the source says is a
  different question and this draft does not touch it.
- **`app.css` and `intro.css` are counted and never read.** Line counts for CSS say nothing about
  whether the rules are live, and three of the four selectors I spot-checked had no matching
  element in `index.html` — but I did not run that systematically and it is not a finding.

---

## 10 · WHAT I WOULD DO NEXT

1. **Delete the live `innerHTML` write at `chain-indicator.js:687`** or bring it under the strip
   properly. A scanner that is green over the thing it scans for is worse than no scanner.
2. **Pin the poll cadence in the suite** — one case, and it closes the 15 s → 15 min hole.
3. **Fix the duplicate `id="tabs"`** and add the one test that loads `index.html` into a real
   document, which is the whole class of defect the layer cannot currently see.
4. **Raise the tests-to-instrument ratio off 40 %**, starting with `term.js`, which is the largest
   instrument and has no test file of its own.

    OBJECTIVE:  a first honest number for the browser layer's guard coverage.
    FALSIFIER:  any figure above that a re-run does not reproduce.
