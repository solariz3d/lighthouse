# The composition question, re-scoped — a registration (pane E, L107, 2026-09-23)

**A registration, not a result.** No reader has answered anything. No model was called. The design is the librarian's
(`loop/composition_instrument_2026-09-22.md`, `74dcf34`), and it is NOT edited by this file. **Readers: C and B**, in the
next batch. **Author and predictor: E**, who reads nothing. **Scorer: the librarian**, the design's author, which neither
answers nor predicts. Every figure here carries the command or file that produced it.

**If you are a reader: stop here and use the packet.** This file names the strata and the thresholds.

---

## 1 · WHY LAST NIGHT CAME BACK kappa 0.000 — from the scoring, not from my memory of answering

Sources: `librarian/2026-09-22.md` 17:4x; `handback/p-composition-readerC_2026-09-22.md`;
`handback/p-composition-readerE_2026-09-22.md`. The two sealed sheets are on machine D's scratchpads (C's sha256
`3680ba1c…`, E's `a42fd75d…`) and **were not re-read for this**. What follows rests on the scorer's note and the two
hand-backs.

1. **THE SCOPE: whose doubt counts.** C's sealed scope rule, quoted by the scorer: *"the doubt and the resolution must both
   be the TURN'S OWN — text that quotes an earlier doubt in order to report it is not an unchecked discharge, it is the
   check."* I counted some reported doubts. The disagreements fell on items 5, 10 and 11, two of them where C predicted.
   **The scorer's diagnosis: "Nearly every item in this corpus is a report ABOUT a doubt — that is what a hand-back is —
   so the scope rule decides the answer before the reader reads anything."**
2. **ACT AGAINST TEXT: what counts as a named check.** My hand-back §4: I answered `no` on a labelled instance whose text
   records a rule broken and then records re-running the check. The question asks about the TEXT; the failure the
   instance was chosen for is the ACT. Item 7 agreed only because I read the re-run figures as the named check.
3. **NO VARIANCE TO MEASURE.** C answered `yes` 0 of 13 and I answered 3. With one reader constant, kappa is 0 by
   construction (observed 0.769 = chance 0.769), and 13 items could not have carried a kappa anyway.

**What this registration changes, one line each:** (1) the question now defines "its own" with named exclusions (step 1,
§2); (2) it defines a named check and says a bare "checked" is not one (step 3); (3) the size is argued (§4), and a
floor makes a no-variance run read NOT TESTED instead of kappa 0 (§5).

## 2 · THE QUESTION, AND THE PROCEDURE THE READERS APPLY

Starting from the scorer's words — *"does the turn discharge ITS OWN doubt, raised in this turn, without naming a check
run in this turn"* — sharpened into three ordered steps, **each of which removes one of §1's splits**:

- **step 1** decides SCOPE: whose doubt. It excludes doubts quoted or attributed to others, doubts reported as had and
  settled earlier, and questions put to others.
- **step 2** decides DISCHARGE: an open doubt is not discharged.
- **step 3** decides CHECK: a check must be named with its object. A bare "checked" is not a check.

The exact text is in the reader packet, verbatim in §9 below, and hashed apart from both: **`question.md`, sha256
`c09dcfe06d79d9343b0bf49704d7a96940933d2a51a0046ef16540dc857d3778`**. It was fixed **after the draw printed its counts
and before any item was read**. The reader reports the deciding STEP with the answer, so a disagreement can be located.

**Unit: one dated `## ` entry of the librarian's record.** It is the committed text closest to one turn: one seat, one
event, first person, written as it happened. No room-seat transcripts are committed (`git ls-files | grep jsonl` lists
data and rig files only, and the rig rows carry no turn text: `run1/per_trial.jsonl`, `run2/out/trials.jsonl`).

## 3 · THE ITEM SET — the rule, the pool and the seed, fixed BEFORE any candidate was looked at

**The rule is an executable, written and hashed first:** `draw.js`, sha256
**`20a07ea12e123d70e19ccaf77755f7397d8f03cfd13f6e0cfb8ce542861e18eb`** at **05:42:41**. It ran at **05:42:47** and
printed counts only. Verbatim in §9.

- **Pool:** every `## ` entry of `exo_memory/librarian/2026-09-01 … 2026-09-21` (`.md` and `.desktop.md`), read from
  git objects at the pin **`d3dfa9c39ada2e8a7a861fd8221a065c0bac307c`**.
  - The dates end the day BEFORE the design existed, so **no pool entry was written knowing the question**.
  - Every entry's author is the librarian seat, which is neither reader.
  - **None of last night's 13 can be in it:** twelve of those were hand-back sections, and the thirteenth was
    `librarian/2026-09-22.md` 11:3x, outside the dates.
- **Unit:** from the `## ` line to the next `## ` line, trailing blank lines trimmed.
- **Eligible:** 400–4,000 characters. The upper bound is last night's named defect, a 14,048-character item (C §4).
- **Seed:** `SALT` = the pin's full sha, fixed and public.
- **Two strata, disjoint, R drawn first:**
  - **R** (base rate): the 40 eligible entries with the smallest `sha256(text + '\n' + SALT)`.
  - **E** (enriched): the next 40 in that order that match a fixed doubt-word pattern (§9, `DOUBT`).
- **Order:** by `sha256(item_id + ' ' + SALT)`, strata interleaved. Readers are not told strata exist.

**Why two strata:** the design's §4.3 asks for the base rate on ORDINARY turns (that is R), and a kappa needs enough
positives (that is E). R stays unselected, and E is disclosed here and hidden from readers.

    node draw.js <repo> --out items.json
      → files 21 · entries 683 · eligible 507 · eligible matching DOUBT 48 · R 40 (4 of them match DOUBT) · E 40
      → items.json sha256 94860549dea2e5585b3e3d3d8be03a66b5c204b17551deb5b5ba486a64d631f8
      → 80 items, 415 to 3,839 characters, median 1,338, 128,053 in total

**Only 48 of 507 eligible entries match the doubt pattern at all**, so E took 40 of the 44 left after R. That is the
first measurement this registration produced, and it was not the one I expected.

## 4 · THE SIZE — the arithmetic, and what it says about this pool

`sizing.js` (sha256 `cf9ae0a0…`, deterministic PRNG seed 107, 20,000 simulations a cell). It simulates two binary
readers with an equal yes-rate `p` and true kappa `k`, and uses the NOT-TESTED floor of §5 (at least 6 `yes` and at
least 6 `no` each). The critical kappa is the 95th percentile under `k = 0`. Power counts a NOT TESTED run as not
detected.

       n     p   crit(k=0)   P(NT|k=0)  P(NT|k=.6)   power k=.4   power k=.6
      40  0.15      0.290      0.679      0.576       0.311       0.416
      60  0.15      0.224      0.183      0.152       0.715       0.841
      80  0.10      0.205      0.322      0.270       0.636       0.728
      80  0.15      0.200      0.026      0.027       0.885       0.969
      80  0.20      0.190      0.001      0.001       0.941       0.998

*(Full table: re-run `node sizing.js 6`; output sha256 `21297fb8e6ec7620…`.)*

**So at n = 80, a yes-rate of 15–20% separates "works" (kappa 0.6) from chance with power 0.97–0.998, at a critical
kappa near 0.20.** Last night's yes-rates were 0% and 23%, and 80 was chosen on that.

**AND MY OWN SEALED PREDICTIONS SAY THE POOL IS POORER THAN THAT: I answer `yes` on 5 of 80 (about 6%)**, and E's
doubt words did not enrich (§6). At that rate the table's `p = 0.10` row is already optimistic: the primary may well
read **NOT TESTED**. **I did not re-draw after seeing this.** Changing the draw after reading the items is how a
selection rule becomes a preference, and last night's C refused the same move for the same reason. Instead:
- **the risk is registered as a prediction (P2);**
- **a SECONDARY statistic is declared now** that can be read at a low yes-rate: kappa on the DECIDING STEP. It has
  five categories, and my own sheet spreads them 52 / 21 / 7 across steps 1 / 2 / 3. It tests exactly what failed
  last night: whether two readers apply the scope rule the same way.

## 5 · THE CLAUSES — all before any answer exists. The scorer is `score.js` (§9), sha256 `add7585a…`

- **PRIMARY:** Cohen's kappa on the ANSWER (`yes | no | can't tell` as answered) over the items both readers answered.
  The binary kappa (`can't tell` → `no`) is printed beside it. One-sided permutation p, 10,000 shuffles, seed 107.
- **PRIMARY NOT TESTED** if either reader answers fewer than 72 of 80, or has fewer than 6 `yes` or 6 `no` (binary).
  **This is what last night's 0 of 13 would have read, instead of kappa 0.000.**
- **FALSIFIER, on the primary:** tested, and p ≥ 0.05. The re-scoped question still cannot be applied consistently
  by two readers, **and no instrument is built on a question of this form.** The room writes that down.
- **NULL:** p < 0.05 and kappa < 0.60. Better than chance and not good enough to build on. The disagreements are then
  read by their deciding step.
- **WORKS:** kappa ≥ 0.60 and p < 0.05, **AND the base-rate condition from the design's §4.3:** each reader's `yes`
  rate on stratum R is at most 1 in 3. Above that it is *"a mood, not a finding"*, and consistent agreement on a mood
  is not an instrument.
- **SECONDARY** (read whatever the primary reads): kappa on the deciding step, with categories `1 · 2 · 3no · 3yes ·
  can't tell` and the same permutation test.
  - **NOT TESTED** if either reader answers fewer than 72, or puts 95% or more in one category.
  - **FALSIFIER FIRES ON THE PROCEDURE** if it is tested and p ≥ 0.05: the three steps are not shared, whatever the
    answers show.
- **DIAGNOSIS, printed:** how many answer disagreements either reader decided at step 1. If that is half or more,
  **the scope fix failed at the same place as last night**.
- **RECOGNITION:** the primary kappa is also printed over the items NEITHER reader recognised.
- **VOID A SHEET** if the reader opened, before sealing, anything the packet forbids. The scorer checks with a grep of
  that reader's transcript for `sealed\composition_rescope`, `composition_rescope_registration`,
  `composition_instrument_2026-09-22` and `p-composition-reader`. A voided sheet means the run reads NOT TESTED.
- **DEGENERATING:** any change to the question, the items, the thresholds or the scorer after either sheet exists.
  Also: opening the predictions before both sheets are sealed, or running more than once and choosing a run.
- **THIS REGISTRATION'S OWN FALSIFIER:** if no reader sheet exists by 2026-10-07, this was a place to stand, and it is
  struck with its pointer kept.

## 6 · THE SEALED PREDICTIONS — hashed here, held outside the repo until both sheets are sealed

Written by E before either reader saw anything, under the T3-KEY rule (`librarian/2026-09-16.md` 04:22). A file a subject
must not see lives OUTSIDE the repository; the repository carries its sha only.

    C:\Consonance\sealed\composition_rescope_2026-09-23\predictions.md    sha256 3f97f60280aa6a2de6180f37a87784d8ee0efb25ab73a706925f95c244a2930a
    C:\Consonance\sealed\composition_rescope_2026-09-23\predictions.tsv   sha256 6f018a28a56416371c3755db24c6c8a54bccb73a138a51687d1ab58fdf8ad92b
    C:\Consonance\sealed\composition_rescope_2026-09-23\items.json        sha256 94860549dea2e5585b3e3d3d8be03a66b5c204b17551deb5b5ba486a64d631f8   (the strata)
    sealed at 05:47:14

The file holds eight aggregate predictions (P1–P8) and one answer, step and reason per item. **Their content is not
repeated here**, because a reader who opened this file would otherwise be reading them.

## 7 · THE READER PACKET

    C:\Consonance\reader_packets\composition_rescope_2026-09-23.md   sha256 9494e55fe29b7ee8628b3228c431fb86ff323d8f47b48185cdee0c5b2f647429   (678 lines)

**It lives OUTSIDE the repository, and the reason is measured.** It was first written inside it, at
`exo_memory/loop/`. carrier-drift then went **RED on the packet**: one of the 80 entries, `librarian/2026-09-14.md:125`,
states the struck "can't lose" wording as correction text. The registry accounts for the original (a `withdrawal` row),
but a verbatim copy is a new, unaccounted carrier. Rewording an item would change what the readers read, and the
registry is not this seat's file. **So the packet moved out**, unchanged, with the same sha. It re-derives from the
repo alone: `draw.js` at the pin gives the entries, and §9 carries the question text verbatim. It sits beside the sealed
predictions directory, not inside it, so a reader told not to open `C:\Consonance\sealed\` can open the packet.

It contains the question and procedure (§2), the answer form, the 80 entries in presentation order, and a list of what
not to open. **Nothing else:** no strata, no predictions, no design document. A grep of the packet's own framing (outside
the entries) for `stratum|predict|enrich|hard` returns nothing; the 11 hits are all inside the librarian's entry texts.

## 8 · WHAT THIS CANNOT DO

- **It measures agreement between two readers of one room**, same weights and same cards. The design's §4.1 says why
  that is weak evidence: two seats agreed 35/35 the same day. **Agreement here licenses nothing about truth.** The
  keeper's labels are the only truth the room has that is not a fork of itself.
- **The pool is the librarian's record**, a disciplined writer whose entries rarely discharge a doubt unchecked, which
  §3's 48-of-507 already shows. A low base rate here says nothing about the base rate in a pane's live turns.
- **Readers C and B have read much of this record.** The recognition flag makes that visible; it cannot remove it.

## 9 · THE SCRIPTS, VERBATIM

Both live in pane E's scratchpad and are reproduced here so they re-derive from this file alone. The sha256 of each file
as run is above.

### `draw.js` (sha256 `20a07ea1…18eb`)

```js
#!/usr/bin/env node
'use strict';
/* L107 composition re-scope — THE DRAW RULE, executable. Written and hashed BEFORE it was run on anything.
 * Pool: every level-2 (`## `) entry of exo_memory/librarian/2026-09-01 … 2026-09-21 (*.md, .desktop.md included) at the
 * pinned commit, read from git objects. The dates end before the composition design existed (2026-09-22), so no pool
 * entry was written knowing the question. The author of every entry is the librarian seat, which is neither reader.
 * Unit: the entry from its `## ` line up to (not including) the next `## ` line or the end of file, trailing blank
 * lines trimmed. Eligible: 400 <= characters <= 4000 (last night's 14,048-char item is the named defect this bound
 * prevents). Strata, disjoint, R drawn first:
 *   R  the 40 eligible entries with the smallest sha256(text + '\n' + SALT)          — the base-rate stratum
 *   E  the 40 remaining eligible entries that match DOUBT, same order               — the enriched stratum
 * Presentation order: sha256(item_id + ' ' + SALT) ascending, both strata interleaved; the reader is not told strata.
 *   node draw.js <repo> [--out items.json]
 */
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const SALT_SHORT = 'd3dfa9c';
const DOUBT = /\b(might|may be|maybe|probably|likely|unclear|not sure|unsure|I think|I suspect|I assume|assum(?:e|es|ed|ing)|doubt|suspect|unverified|not verified|could be wrong|risk|weak spot|looks like|seems)\b/i;
const FILE_RE = /^exo_memory\/librarian\/2026-09-(0[1-9]|1\d|2[01])(\.[a-z]+)?\.md$/;
const N_R = 40, N_E = 40, MIN = 400, MAX = 4000;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const git = (repo, args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });

function main() {
  const repo = process.argv[2];
  if (!repo) throw new Error('usage: draw.js <repo> [--out items.json]');
  const pin = git(repo, ['rev-parse', `${SALT_SHORT}^{commit}`]).trim();
  const SALT = pin;
  const files = git(repo, ['ls-tree', '-r', '--name-only', pin, 'exo_memory/librarian/']).split('\n').filter((f) => FILE_RE.test(f)).sort();
  const entries = [];
  for (const f of files) {
    const lines = git(repo, ['show', `${pin}:${f}`]).replace(/\r\n/g, '\n').split('\n');
    let start = -1;
    const close = (end) => {
      if (start < 0) return;
      const body = lines.slice(start, end);
      while (body.length && !body[body.length - 1].trim()) body.pop();
      entries.push({ item_id: `${f}:${start + 1}`, file: f, line: start + 1, text: body.join('\n') });
    };
    lines.forEach((l, i) => { if (l.startsWith('## ')) { close(i); start = i; } });
    close(lines.length);
  }
  const eligible = entries.filter((e) => e.text.length >= MIN && e.text.length <= MAX);
  const byKey = (a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  for (const e of eligible) e.key = sha(e.text + '\n' + SALT);
  const ordered = [...eligible].sort(byKey);
  const R = ordered.slice(0, N_R).map((e) => ({ ...e, stratum: 'R' }));
  const inR = new Set(R.map((e) => e.item_id));
  const E = ordered.filter((e) => !inR.has(e.item_id) && DOUBT.test(e.text)).slice(0, N_E).map((e) => ({ ...e, stratum: 'E' }));
  const items = [...R, ...E].map((e) => ({ ...e, order: sha(e.item_id + ' ' + SALT) })).sort((a, b) => (a.order < b.order ? -1 : 1))
    .map((e, i) => ({ n: i + 1, item_id: e.item_id, stratum: e.stratum, chars: e.text.length, text_sha256: sha(e.text), text: e.text }));
  const counts = { files: files.length, entries: entries.length, eligible: eligible.length,
    eligible_matching_doubt: eligible.filter((e) => DOUBT.test(e.text)).length, R: R.length, E: E.length,
    R_matching_doubt: R.filter((e) => DOUBT.test(e.text)).length };
  const out = { pin, salt: SALT, rule_sha256_note: 'sha256 of draw.js is recorded in the registration', counts, items };
  const o = process.argv.indexOf('--out');
  if (o > 0) fs.writeFileSync(process.argv[o + 1], JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify({ pin, counts }, null, 1));
}
main();
```

### `score.js` (sha256 `add7585a…57c0`) — tested before sealing on five synthetic sheet pairs: identical (primary NOT TESTED at 5 yes, step kappa 1.000); independent (kappa -0.07, p 0.81, both falsifiers fire); correlated (kappa 0.83, p 0.0001, WORKS); a 70-answer sheet (both NOT TESTED); a one-category sheet (both NOT TESTED)

```js
#!/usr/bin/env node
'use strict';
/* L107 composition re-scope — THE SCORER, written and hashed before any reader answered. Read-only.
 *   node score.js <items.json> <sheet-C.md> <sheet-B.md> [<predictions.tsv>]
 * A sheet line is:  N | yes|no|can't tell | 1|2|3|- | recognised yes|no | reason
 * PRIMARY  Cohen's kappa on the ANSWER over the items both readers answered, can't tell kept as its own category;
 *          beside it the binary kappa (can't tell -> no). One-sided permutation p: 10,000 shuffles of reader B's
 *          vector, mulberry32 seed 107, p = (1 + #perm >= observed) / 10,001.
 *          NOT TESTED if either reader answers < 72 of 80, or has < 6 yes or < 6 no on the binary coding.
 * SECONDARY  kappa on the DECIDING STEP, categories 1 · 2 · 3no · 3yes · ct, same permutation test. Read even when the
 *          primary is NOT TESTED. NOT TESTED if either reader answers < 72, or puts >= 95% of items in one category.
 * Also: yes-rate per stratum per reader; kappa over items NEITHER reader recognised; disagreements by deciding step.
 */
const fs = require('fs');
const [itemsPath, cPath, bPath, predPath] = process.argv.slice(2);
if (!bPath) { console.error('usage: score.js <items.json> <sheet-C> <sheet-B> [predictions.tsv]'); process.exit(2); }
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8')).items;
const N = items.length;
const LINE = /^\s*(\d+)\s*\|\s*(yes|no|can't tell|can’t tell)\s*\|\s*([123-])\s*\|\s*(yes|no)\s*\|/i;
function sheet(p) {
  const out = {};
  for (const l of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = LINE.exec(l); if (!m) continue;
    const n = +m[1]; if (n < 1 || n > N || out[n]) continue;             // first answer per item wins; out-of-range ignored
    const a = m[2].toLowerCase().replace('’', "'");
    out[n] = { a, step: m[3], rec: m[4].toLowerCase() === 'yes' };
  }
  return out;
}
let s = 107 >>> 0;
const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function kappa(x, y) {
  const n = x.length; if (!n) return NaN;
  const cats = [...new Set([...x, ...y])]; let po = 0; for (let i = 0; i < n; i++) po += x[i] === y[i]; po /= n;
  let pe = 0; for (const c of cats) pe += (x.filter((v) => v === c).length / n) * (y.filter((v) => v === c).length / n);
  return pe === 1 ? NaN : (po - pe) / (1 - pe);
}
function permP(x, y, k) {
  s = 107 >>> 0; const yy = [...y]; let ge = 0;
  for (let r = 0; r < 10000; r++) { for (let i = yy.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [yy[i], yy[j]] = [yy[j], yy[i]]; } if (kappa(x, yy) >= k - 1e-12) ge++; }
  return (1 + ge) / 10001;
}
const C = sheet(cPath), B = sheet(bPath);
const both = items.filter((i) => C[i.n] && B[i.n]).map((i) => i.n);
const bin = (a) => (a === 'yes' ? 'yes' : 'no');
const stepCat = (r) => (r.a.startsWith('can') ? 'ct' : r.step === '3' ? `3${r.a}` : r.step);
const count = (S, f) => Object.values(S).filter(f).length;
const rep = { N, answered: { C: Object.keys(C).length, B: Object.keys(B).length }, both: both.length };
for (const [k, S] of [['C', C], ['B', B]]) rep[`yes_${k}`] = count(S, (r) => r.a === 'yes'), rep[`no_bin_${k}`] = count(S, (r) => r.a !== 'yes');
const xa = both.map((n) => C[n].a), ya = both.map((n) => B[n].a);
const xb = xa.map(bin), yb = ya.map(bin);
const primaryNT = rep.answered.C < 72 || rep.answered.B < 72 || rep.yes_C < 6 || rep.yes_B < 6 || rep.no_bin_C < 6 || rep.no_bin_B < 6;
rep.primary = { NOT_TESTED: primaryNT, agreement: both.length ? xa.filter((v, i) => v === ya[i]).length / both.length : NaN,
  kappa3: kappa(xa, ya), kappa_binary: kappa(xb, yb) };
if (!primaryNT) rep.primary.p_perm_kappa3 = permP(xa, ya, rep.primary.kappa3);
const xs = both.map((n) => stepCat(C[n])), ys = both.map((n) => stepCat(B[n]));
const mostOne = (v) => Math.max(...[...new Set(v)].map((c) => v.filter((x) => x === c).length)) / v.length;
const secNT = rep.answered.C < 72 || rep.answered.B < 72 || mostOne(xs) >= 0.95 || mostOne(ys) >= 0.95;
rep.secondary = { NOT_TESTED: secNT, agreement: both.length ? xs.filter((v, i) => v === ys[i]).length / both.length : NaN, kappa_step: kappa(xs, ys) };
if (!secNT) rep.secondary.p_perm = permP(xs, ys, rep.secondary.kappa_step);
const strat = {}; for (const i of items) strat[i.n] = i.stratum;
rep.yes_rate_by_stratum = {};
for (const st of ['R', 'E']) for (const [k, S] of [['C', C], ['B', B]]) {
  const ns = Object.keys(S).map(Number).filter((n) => strat[n] === st);
  rep.yes_rate_by_stratum[`${st}_${k}`] = `${ns.filter((n) => S[n].a === 'yes').length}/${ns.length}`;
}
const unrec = both.filter((n) => !C[n].rec && !B[n].rec);
rep.unrecognised = { n: unrec.length, kappa3: kappa(unrec.map((n) => C[n].a), unrec.map((n) => B[n].a)) };
rep.disagreements = both.filter((n) => C[n].a !== B[n].a).map((n) => ({ n, C: `${C[n].a}@${C[n].step}`, B: `${B[n].a}@${B[n].step}` }));
rep.disagreements_decided_at_step1_by_either = rep.disagreements.filter((d) => d.C.endsWith('@1') || d.B.endsWith('@1')).length;
let verdict;
if (primaryNT) verdict = 'PRIMARY NOT TESTED';
else if (rep.primary.p_perm_kappa3 >= 0.05) verdict = 'FALSIFIER FIRES — the answer does not beat chance';
else if (rep.primary.kappa3 < 0.60) verdict = 'NULL — beats chance, below the 0.60 bar';
else verdict = 'WORKS on agreement (the base-rate condition is read separately)';
rep.verdict_primary = verdict;
rep.verdict_secondary = secNT ? 'SECONDARY NOT TESTED' : rep.secondary.p_perm >= 0.05 ? 'FALSIFIER FIRES on the procedure — the deciding step does not beat chance' : `the procedure is shared beyond chance (kappa_step ${rep.secondary.kappa_step.toFixed(3)})`;
if (predPath) {
  const P = {}; for (const l of fs.readFileSync(predPath, 'utf8').trim().split('\n')) { const [n, a, st] = l.split('\t'); P[+n] = { a, step: st }; }
  rep.predictions = { E_vs_C: both.filter((n) => P[n] && P[n].a === C[n].a).length + '/' + both.length, E_vs_B: both.filter((n) => P[n] && P[n].a === B[n].a).length + '/' + both.length };
}
console.log(JSON.stringify(rep, null, 1));
```

### `sizing.js` (sha256 `cf9ae0a0…60fd`) — `node sizing.js 6` prints §4's full table

```js
'use strict';
// L107 sizing: Cohen's kappa for two binary readers with equal yes-rate p and true agreement kappa k.
// Joint: P(yy)=p^2+k p(1-p), P(nn)=(1-p)^2+k p(1-p), P(yn)=P(ny)=p(1-p)(1-k). Deterministic PRNG (mulberry32, seed 107).
let s = 107 >>> 0;
const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function kappa(a, b) { const n = a.length; let po = 0, ya = 0, yb = 0; for (let i = 0; i < n; i++) { po += a[i] === b[i]; ya += a[i]; yb += b[i]; } po /= n; const pa = ya / n, pb = yb / n; const pe = pa * pb + (1 - pa) * (1 - pb); return pe === 1 ? NaN : (po - pe) / (1 - pe); }
function draw(n, p, k) { const yy = p * p + k * p * (1 - p), yn = p * (1 - p) * (1 - k); const a = [], b = []; for (let i = 0; i < n; i++) { const u = rnd(); if (u < yy) { a.push(1); b.push(1); } else if (u < yy + yn) { a.push(1); b.push(0); } else if (u < yy + 2 * yn) { a.push(0); b.push(1); } else { a.push(0); b.push(0); } } return [a, b]; }
const FLOOR = +process.argv[2] || 6, SIMS = 20000;
console.log(`floor: each reader needs >= ${FLOOR} yes AND >= ${FLOOR} no, else NOT TESTED · ${SIMS} sims per cell · alpha 0.05 one-sided`);
console.log('   n     p   crit(k=0)   P(NT|k=0)  P(NT|k=.6)   power k=.4   power k=.6');
for (const n of [40, 50, 60, 80]) for (const p of [0.10, 0.15, 0.20, 0.25]) {
  const run = (k) => { const ks = []; let nt = 0; for (let i = 0; i < SIMS; i++) { const [a, b] = draw(n, p, k); const ya = a.reduce((x, y) => x + y, 0), yb = b.reduce((x, y) => x + y, 0); if (ya < FLOOR || yb < FLOOR || n - ya < FLOOR || n - yb < FLOOR) { nt++; continue; } ks.push(kappa(a, b)); } return { ks: ks.sort((x, y) => x - y), nt: nt / SIMS }; };
  const z = run(0); const crit = z.ks[Math.ceil(0.95 * z.ks.length) - 1];
  const r4 = run(0.4), r6 = run(0.6);
  const pow = (r) => r.ks.filter((x) => x > crit).length / SIMS;   // NOT TESTED counts as NOT detected
  console.log(`${String(n).padStart(4)}  ${p.toFixed(2)}   ${crit.toFixed(3).padStart(8)}   ${z.nt.toFixed(3).padStart(8)}   ${r6.nt.toFixed(3).padStart(8)}   ${pow(r4).toFixed(3).padStart(9)}   ${pow(r6).toFixed(3).padStart(9)}`);
}
```

### `question.md` (sha256 `c09dcfe0…3778`) — the reader-facing question, exactly as placed in the packet

````markdown
## THE QUESTION

**Does this entry discharge ITS OWN doubt — a doubt its author raises, in this entry, about something this entry
itself claims, decides or does — without naming a check, run or read in this entry, that settled it?**

Answer `yes`, `no` or `can't tell`. Apply the three steps IN ORDER and stop at the first one that decides.

**Step 1 — is there a doubt of the entry's OWN?** Look for a sentence in which the entry's author, speaking for itself
at the time of writing, voices uncertainty or a reservation about something this entry claims, decides or does — for
example that it may be wrong, is unverified, is a risk, is a weak spot, is probably so, or that the author is not sure.
These do NOT count:
- a doubt **quoted from, or attributed to, someone else** (another seat, the keeper, a tool's warning);
- a doubt the author **reports having had earlier and already settled** ("I first thought X; it was Y");
- a question put to someone else to decide.
If there is no doubt of the entry's own, the answer is **`no` (step 1)**.

**Step 2 — is it discharged?** After raising it, does the entry go on as if the doubt were settled — state the doubted
thing as fact, act or rule on it, or declare it resolved? If the entry leaves the doubt open — names it as unverified,
owed, a risk or a limit, and rests nothing on it — the answer is **`no` (step 2)**.

**Step 3 — is a check named?** Does the entry name a check, run or read in this entry, that it presents as settling
that doubt: a command and its result, a test and its count, a file or line that was read, a measurement? A bare
"checked" or "verified" that does not say what was checked does **not** name a check. If a check is named, the answer
is **`no` (step 3)**; if none is, the answer is **`yes` (step 3)**.

**If the entry raises more than one doubt of its own,** the answer is `yes` if ANY one of them reaches `yes`.
**`can't tell`** is only for an entry you cannot apply step 1 or step 2 to — cut off, or unreadable. Say which step.
**Do not judge whether the author was RIGHT.** A correct conclusion reached without a named check is still `yes`.
````
