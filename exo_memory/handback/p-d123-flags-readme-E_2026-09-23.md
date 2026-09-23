# P-D123-FLAGS-README: standalone Jev batch 2 — the flags line's confidence, and the README (pane E, D123, 2026-09-23)

Packet: the chair's D123. Master: `loop/jev_batch2_plan_2026-09-23.md` (`111f829`), row E. **Machine D**, HEAD `111f829`.
**Files:** `jev/bin/jev-flags.js` (+14 / −2, sha256 `362ce6a2…`), `jev/test/jev-flags.test.js` (+33 / −0, `42a082fc…`), and
`jev/README.md` (NEW, 66 lines, `a595afeb…`). **No install, no settings edit, no gateway call, nothing committed.**

## 1 · THE FLAGS CHANGE: `p=0.xx` when there is no reason

**Why it matters:** the gateway returns a choice answer with **no reason at all** (`jev/lib/ask.js:18–19`, measured on the
room's stored rows). So batch 1's line would almost always have read "(Jev gave no reason that can be shown)".

**The rule, in order:**
1. a reason that passes the wording rule → `your last turn: <reason>` (unchanged);
2. else the row's `confidence`, **only if it is a number in [0, 1]** → `your last turn (p=0.61)`;
3. else the batch-1 fallback text.

**A reason DROPPED by the wording rule falls through to the confidence**, never to the dropped text.

**Coded to the field the plan names, `row.confidence`, and nothing else.** A missing confidence is NOT filled from
`probabilities[verdict]`. That would be a guess about what B stores, and a mutant that does it is caught.

**B's `jev-judge.js` at HEAD does not write `confidence` yet** (its `ROW_KEYS`, `:48`). B adds it this batch. **Until B's
change lands, every live line takes branch 3.** The collation should run one of B's new rows through this hook.

## 2 · THE README — what a stranger reads first

**The first screen** (the first 25 lines, checked by script) says, in plain words:
- **judged turns are sent to the Vercel AI Gateway**, with the route and model, and **what is sent**: the last message,
  the last reply (cut to 4,000 and 8,000 characters, as A's `prompt.js:76–77` does), and the rubric;
- **the key is env-only, `AI_GATEWAY_API_KEY`**, never asked for or written, and a key in the config is refused
  (C's `config.js` header);
- **how to opt out:** an empty `.jev-off` file, which covers every folder below it, or `optOut` in `~/.jev/config.json`,
  with an example.

**The measured precision, the design's sentence VERBATIM** (`jev_standalone_design_2026-09-23.md:14–15`):
> *Jev marks turns worth a second look. Measured on its first 56 units, about 1 in 4 marked turns was confirmed by a blind
> reader; the readers were the room's own and lean lenient.*

Checked by script: the design's quoted text, whitespace-normalised, is a substring of the README. **It cites
`exo_memory/loop/jev_r2r3_score_2026-09-23.md`.** The one other figure it uses, "clean … 19 of 20", is that file's `:15`.

**The wording rule:** jev-flags' own `FORBIDDEN` patterns run over the whole README match **0**. The README does not
quote the forbidden phrases even to forbid them, so it cannot become a carrier.

**`p=` is explained where it is shown:** *"It does not tell a confirmed mark from an unconfirmed one … Read it as Jev's
number, not as the chance the mark is right"*, per the score's `:38`.

**Two honesty points I added, both checkable:**
- **Retention:** *"What the gateway keeps is set by Vercel's terms and your plan. This project has not verified whether
  sent text is retained."* The record is split on this: the room noted "ZDR refused on the hobby plan", and the gateway's
  model listing on 09-23 read `zdr: "all"` for Jev (L112 §1). Saying either as fact would be a guess.
- **Install:** *"It is being built in this batch. Until it lands, there is no supported install."* `install.js` is B's and
  not on disk yet. **The chair or librarian should strike that sentence when B's lands.**

**The config table lists exactly the eight keys C's `config.js` accepts** (`KEYS`, `:45`), with its defaults. It says
that an unknown key fails loudly, which is C's rule.

## 3 · CHECKS

    node jev/test/jev-flags.test.js                 → pass 35 · fail 0     (28 from batch 1 + 7 new)
    node --test jev/test/*.test.js                   → tests 136 · pass 136 · fail 0   (the whole module on D, other panes' work in progress included)
    mutants (scratchpad/d123/mutants.js, sha256 41cb89de…, under the heavy-run lock)
      first run   8 · applied 8 · caught 7 · NOT APPLIED 0   SURVIVED: NaN / Infinity accepted
      final       8 · applied 8 · caught 8 · NOT APPLIED 0
    NO_COLOR=1 node consonance/tools/carrier-drift.js → exit 0; jev/README.md appears in 0 findings
    NO_COLOR=1 node consonance/tools/js-suite.js      → running in the background through the heavy-run lock, not holding this ring:
      <E's scratchpad>\d123suite.txt — the librarian can read the count there

**The survivor was my test, not the code.** My fixtures write rows through `JSON.stringify`, which turns `NaN` and
`Infinity` into `null`, so the "not a number" test never fed the hook a NaN. A ledger can never carry one either, but
`sessionLine` is a pure exported function. It is now tested directly with NaN and ±Infinity.

## 4 · WHAT THIS DOES NOT ESTABLISH

- **That B's row will carry `confidence` as a number in [0, 1].** The gateway's own name for it is `confidence`
  (ask.js `:19`), and I coded to exactly that field. A different shape falls back to the text, never to a wrong number.
- **That a stranger understands `p=`.** The README explains it once; whether that is enough is for batch 3's
  clean-machine read.

NEXT: librarian call_librarian with the hand-back pointer when the flags change, the README and their tests are written — plan default after it: the librarian collates batch 2 when all four ring, unless the output says otherwise

## ADDENDUM, 15:3x — the js-suite result the ring pointed at

    NO_COLOR=1 node consonance/tools/js-suite.js   (HEAD 111f829 before and after; exit 1)
      → 134 green · 1 failed · 0 crashed · 1 canary · 1 not-run (of 137) · FAILED: consonance\tools\jev-shadow-runner.test.js

**Not this lap's, and TRANSIENT.** `jev-shadow-runner.js` and its test are A's, and both are uncommitted mid-edit
(`git status`: modified, alongside `jev-judge.js` and a new `jev-module.test.js`). A rerun of that test alone a few minutes
later read **45 / 0**. Neither file references `jev/bin/jev-flags.js`. The suite caught A's tree mid-write, which is the
reason the heavy-run lock exists. A clean reading needs A's files settled.
