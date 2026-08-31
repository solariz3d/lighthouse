# Non-author read of P-GATE-MODE-TESTS (L022 · P-GATE-TESTS-READ · pane E)

**Reader:** pane E. Did not write `dispatch-gate.js`, `7d40480`, `d00050e`, the tests, the report tool, or the
contract. **Nothing edited:** BRAVO's two files, the gate, and the installed hook are untouched (`git status` at the
end). One scratch copy of the test was made under a different name to run a diagnosis and was deleted; its body is
in this seat's scratchpad (`dg-relax.js`), not the repo.

**Objects read:** the contract at its source, `exo_memory/librarian/2026-08-31.md:654-676` (six clauses, verbatim
below); `exo_memory/handback/p-gate-mode-tests_2026-08-31.md`; `consonance/hooks/dispatch-gate.test.js` (734 lines,
in full); `consonance/tools/dispatch-gate-report.js`; `git show 7d40480`, `git show d00050e`; `dispatch-gate.js` at
HEAD `:112-126`, `:236-272`, `:396-413`; `~/.claude/shell/dispatch-gate.js`; `~/.claude/settings.json:86`;
`C:/Consonance/data/dispatch-gate.jsonl` through the report tool.

---

## 0 · THE RETURN

**BRAVO's packet is sound, the contract is met at the sha BRAVO ran against, and every remaining defect in the gate is
the chair's — with one exception that is BRAVO's and is one line long.** In the chair's order:

| # | question | answer |
|---|---|---|
| 1 | Contract 1's literal third equality — correct refusal, or a `7d40480` defect let stand? | **Correct refusal. Not a `7d40480` defect.** The prefix divergence (`systemMessage` = `'UNCITED DISPATCH — ' + question`; `permissionDecisionReason` = `question`) is at `f8b64e8:212/216` (Aug 24) and unchanged through `7d40480:254/261` and HEAD `:254/:261`. The contract's third equality was never true of this gate; BRAVO pinned the real relation (exactly a prefix) so a second divergence goes red. Whether the prefix should go is a design call, not a defect. |
| 2 | Contract 4 — do BRAVO's tests adapt to `d00050e` without edit, as claimed? | **NO. The claim is false, and the suite does not merely fail — it fails to LOAD at HEAD** (`node --test` → 1 "test", 0 pass, 135 ms, both with and without `CONSONANCE_GATE_MODE` set). Cause: `armsFor()` asserts the literal declaration shape `^const GATE_MODE = '(print\|ask)';` at `dispatch-gate.test.js:103` **before** it probes the env at `:113`, and `ARMS` is built at module load (`:159`). `d00050e`'s `const GATE_MODE = (process.env.CONSONANCE_GATE_MODE === 'ask' ? 'ask' : 'print');` does not match, so the env path is unreachable by construction. **One line fixes it** (§2). Verified: with that one line relaxed in a scratch copy, HEAD runs **flip via env · 31/31 · contract mutants 7 applied / 7 caught / 0 NOT APPLIED · classifier 4/4**. The chair's code is right; the test's declaration regex is the defect, and it is BRAVO's. |
| 3 | Contract 5 §3.3 — does the pooled line still print in `--quarantine`'s dry run? | **Yes:** `node consonance/hooks/dispatch-gate.js --quarantine` → `of the kept: 159 cited of 182 gated = 87.4%` (`:407-408`; the path is a dry run without `--apply`, `:412-413`, confirmed by reading and by running). **Remove the percentage, keep the counts** (§3). Labelling leaves a quotable rate in a tool people run; the librarian's clause is *refuses a pooled figure*, and the report tool is now the one place a rate prints. |
| 4 | The six mutations — all applied? | **At `7d40480` (where BRAVO ran): 7 applied / 7 caught / 0 NOT APPLIED, re-run by me in a worktree with BRAVO's files copied in — 31/31.** At HEAD as BRAVO's file stands: **not run at all** (load failure), so no tally exists; with the one-line relaxation: 7/7/0 again. The mutant `find` strings all still occur exactly once in `d00050e`'s gate. |
| — | Does the suite test the shipped thing or the repo thing? | **The repo thing, only.** `~/.claude/settings.json:86` runs `C:\Users\zackn\.claude\shell\dispatch-gate.js`; that file is byte-identical to `f8b64e8` (`cmp`; 10,943 bytes, Aug 24 05:32), contains **0** occurrences of `GATE_MODE` and **0** `mode:` stamps, and differs from HEAD from line 101. Every test spawns `path.join(__dirname, 'dispatch-gate.js')` — the repo copy — or a temp derivative of it. **Nothing in the suite touches, reads, or compares the installed file.** The report tool sees the consequence indirectly: `UNSTAMPED after the switch: 6 row(s)` — up from BRAVO's 3 an hour ago — is the stale hook still writing rows that neither mode can claim. |

**BRAVO's own falsifier** (*a probe that would fire on a correct implementation ⇒ that mutant is decoration*): checked
against all seven; none is decoration (§4). The one shape-coupled assertion in the file is not a mutant probe, it is the
arm builder — and it is the thing that broke.

---

## 1 · The contract, re-derived from the source — and the brief checked against it

`exo_memory/librarian/2026-08-31.md:657-672`, verbatim in substance (line refs are the notes'):

1. *"The question text is byte-identical across modes — the `systemMessage` under `print` equals the `systemMessage`
   under `ask`, which equals the `ask` question under `ask`."* Mutation: change one character of the print text → red.
2. *"Under `print`: `systemMessage` present AND `permissionDecision` ABSENT (not `'allow'`, ABSENT). Under `ask`: both
   present."* Mutations: emit `permissionDecision` under print → red; drop `systemMessage` under either → red.
3. *"The row's `mode` field reports what was EMITTED, not what the constant says."* Mutation: write `mode` from the
   constant while forcing the other branch → red.
4. *"The mode is read from ONE place (`GATE_MODE`) and the tests exercise BOTH values by flipping it (env override or
   module export — not by editing the source between runs)."* Mutation: hardcode `'print'` at the emit site → red.
5. *"`--report` splits the cited-rate BY MODE and REFUSES a pooled figure across modes — rows before `GATE_MODE_SINCE`
   are `ask` by construction, not backfilled."* Mutation: pool → red.
6. *"`[interrupt]` is exempt in BOTH modes, unchanged."* Mutation: strip the exemption in print → red.

**Bar:** *"suite green; the six mutations each shown red then restored byte-identical; the test file's header states
the contract in one sentence per mode."* **Refusal valid:** *"assertion 1 cannot be satisfied because the two channels
already carry different text — a finding about `7d40480`, reported, not patched around."*

**The chair's brief against this:** faithful on all six. The brief's *"literal third equality"*, *"REFUSED as unmet"*,
and *"`:400-403`"* all correspond to the source (the pooled line is at `:407-408` at HEAD; `:400-403` was BRAVO's
citation and is off by the four lines `d00050e` added above it — BRAVO's cite, not the chair's error). BRAVO's table in
§2 quotes the clauses accurately; I did not find a drift between the source and BRAVO's rendering of it.

**Against the bar, at `7d40480`:** suite green (31/31) ✓ · six mutations shown red (seven mutants) ✓ · source restored
byte-identical (asserted by the last test, sha at load = sha at exit) ✓ · header states the contract per mode
(`dispatch-gate.test.js:5-13`) ✓. **At HEAD:** the suite does not load, so the bar is currently unmet on the file the
chair would commit — by the one line below.

---

## 2 · Finding on question 2, exactly — and the one-line fix

`dispatch-gate.test.js:86`:
```js
const GATE_MODE_DECL = /^const GATE_MODE = '(print|ask)';/m;
```
is used three times: `armsFor()` `:102-105` (assert it matches, assert exactly one match — **before** the env probe at
`:113-117`), and CONTRACT 4 `:333` (exactly one declaration). At `d00050e` the declaration is
`const GATE_MODE = (process.env.CONSONANCE_GATE_MODE === 'ask' ? 'ask' : 'print');` — no match — so `:103` throws while
`ARMS` is being built at `:159`, and `node --test` reports the file as one failed test. This is the SILENT-vs-green
class the file itself warns about at `:515-518`, arriving in the file that warns about it.

**The claim in BRAVO's §3.2 —** *"The tests need no edit if that lands — the probe flips to `env` automatically"* — is
wrong because the probe is never reached. The comment at `:112` (*"not at 7d40480 — but if the chair adds it, use it"*)
describes the intent; the assertion two lines above it forbids the only shape the chair could add. Also worth noting:
the suite's own printed suggestion at `:163` (`process.env.CONSONANCE_GATE_MODE || 'print'`) would **also** not match
`GATE_MODE_DECL`; there was no env-read form the regex accepted.

**Fix, one line, BRAVO's to make** (verified on a scratch copy at HEAD: flip via env, 31/31, 7/7/0, 4/4):
```js
const GATE_MODE_DECL = /^const GATE_MODE = (?:'(print|ask)'|\(process\.env\.CONSONANCE_GATE_MODE === 'ask' \? 'ask' : 'print'\));/m;
```
or, less coupled to the exact expression, `/^const GATE_MODE = .+;$/m` for the *one-declaration* checks and the literal
form only inside the derived-copy fallback (the fallback needs `m[1]`, which the env form does not supply — with the
env path taken first that branch is not entered, but the fallback should assert `m[1]` exists before using it). The
relaxed regex keeps contract 4's *one place* assertion intact (still exactly one match).

**Nothing in `d00050e` needs to change.** Its by-hand verification in the commit body (print: sysMsg true / decision
absent; ask: sysMsg true / decision ask) is what the env-path arms reproduce once the suite can load.

---

## 3 · Finding on question 3 — the pooled line

`dispatch-gate.js:406-408` (HEAD):
```js
const cited = c.keep.filter((r) => r.cited === 'sha' || r.cited === 'path').length;
const gated = c.keep.filter((r) => r.outcome === 'allowed' || r.outcome === 'asked').length;
console.log('  of the kept: ' + cited + ' cited of ' + gated + ' gated = ' + (gated ? (cited / gated * 100).toFixed(1) : '0') + '%');
```
Prints `159 cited of 182 gated = 87.4%` tonight — 176 ask-period rows and 6 unstamped post-switch rows added into one
rate. **Recommendation: remove the `= NN.N%`, keep the two counts, and point at the report** — e.g.
`of the kept: 159 cited / 182 gated (rate BY MODE: node consonance/tools/dispatch-gate-report.js)`. Reason: the
quarantine dry run's job is partition accounting (kept vs quarantined vs orphans), and the counts serve that; a rate
in that line is the L017 figure by another door, and a *labelled* rate still gets quoted (this week's record on labelled
figures is the argument). The chair's file; not changed here.

---

## 4 · Question 4 — the mutants, and BRAVO's own falsifier applied

At `7d40480` (worktree, BRAVO's two files copied in, `node --test`): `MUTATION (contract): applied 7 / caught 7 /
NOT APPLIED 0 (items 1, 2a, 2b, 3, 4, 5, 6)`; `MUTATION (classifier): applied 4 / caught 4 / NOT APPLIED 0`;
leak-proof mutation green; 31/31. The harness counts a `find` string that occurs ≠ 1 times as NOT APPLIED and fails on
it (`:715-716`, `:727`), and asserts each probe is `false` on the unmutated source first (`:714`) — so a "caught" cannot
come from a probe that fires anyway. At HEAD (BRAVO's file as-is): no tally — the file never loads. With the §2 line:
7/7/0 and 4/4/0 again; every `find` string still occurs exactly once in `d00050e`'s gate (`:651/658/665` share one
`find`, applied three times to three copies, which is correct — one site, three breakages).

**Decoration check (BRAVO's falsifier — a probe that would fire on a correct implementation):**
- items 1, 2a, 2b, 3, 4, 6 probe **behaviour of both arms built from the mutant source** (text equality across arms;
  presence of `hookSpecificOutput` under print; row `mode` vs emitted mode; interrupt stdout/row) — a correct
  implementation of any shape passes them. Not decoration.
- item 5 probes the report's **rendered output** (`pooled: \d` present or the refusal line absent) — a correct report
  that refused pooling but phrased the refusal differently would trip it (`!/pooled figure: REFUSED/`). That is a
  wording coupling, not decoration: the mutant is caught by the pooled number appearing, and the refusal-line check is
  the contract's own *"the refusal must be a printed line"*. Borderline; I would not strike it.
- The one assertion that fires on a correct implementation is **`GATE_MODE_DECL` in `armsFor`/CONTRACT 4** — and it
  did, on `d00050e`. It is not a mutant probe, so BRAVO's "seven caught" stands; the clause it guards (item 4, *read
  from ONE place*) is proven at `7d40480` and, after the one-line fix, at HEAD.

---

## 5 · Shipped vs repo — what the suite does and does not test

- **Every spawn in the suite targets the repo file** (`HOOK = path.join(__dirname, 'dispatch-gate.js')`, `:33`) or a
  temp copy derived from its bytes. The installed path appears nowhere in the test or the report tool.
- **The machine runs `~/.claude/shell/dispatch-gate.js`** (`settings.json:86`) = `f8b64e8`, Aug 24: no `GATE_MODE`, no
  `mode` stamps, no L018 join keys. The click the keeper is still getting is that file's `permissionDecision:'ask'`.
- **So: the tests test the repo thing.** They cannot say anything about the shipped thing, and BRAVO's §1 says so.
  The report tool is the one instrument that *notices* the divergence, from the outside, by rows with no mode field
  after the switch instant: **6 now, 3 when BRAVO ran** — the stale hook wrote three more gated rows in the hour
  between. That number will keep rising until `dev/shell/install.ps1` runs (not `-Check`), which is the keeper's-machine
  step the chair sequenced after `d00050e` on purpose (its commit body).
- `install.ps1 -Check` at 05:0x local already reported `DRIFT dispatch-gate.js` (my P1c hand-back); it still will.

---

## 6 · Smaller things, none blocking

- BRAVO's report tool hardcodes `MODE_SWITCH_ISO = '2026-08-31T11:40:04Z'` (`:37`) with the deriving command in the
  comment; the hook's `GATE_MODE_SINCE = '2026-08-31'` (`:126`) is a date. Two carriers of one instant, one coarse —
  BRAVO's §3.4 says so. Exporting the instant from the hook would leave one; the chair's file.
- The hook's comment at `:112-116` still cites *"the 90.4% measured under 'ask'"*; the report prints **88.1%** for the
  full pre-switch window (176 gated). BRAVO's §4 explains the two windows; the comment is now a carrier of a figure
  with a different denominator than the instrument prints. Not wrong, but the next reader will grep it.
- `git status`: `M consonance/hooks/dispatch-gate.test.js`, `?? consonance/tools/dispatch-gate-report.js`, and this
  file. Nothing else of mine.

---

## 7 · Re-derive

```
env -u CONSONANCE_GATE_MODE node --test consonance/hooks/dispatch-gate.test.js       # HEAD: 1 test, 0 pass — load failure
env -u CONSONANCE_GATE_MODE node consonance/hooks/dispatch-gate.test.js 2>&1 | head  # the assertion at :103
git worktree add <tmp> 7d40480 && cp consonance/hooks/dispatch-gate.test.js consonance/tools/dispatch-gate-report.js into it
  && (cd <tmp> && node --test consonance/hooks/dispatch-gate.test.js)                # 31/31, derived-copy, 7/7/0, 4/4/0
cmp ~/.claude/shell/dispatch-gate.js <(git show f8b64e8:consonance/hooks/dispatch-gate.js)   # identical
grep -c GATE_MODE ~/.claude/shell/dispatch-gate.js                                   # 0
node consonance/hooks/dispatch-gate.js --quarantine | grep "of the kept"             # 159 cited of 182 gated = 87.4%
node consonance/tools/dispatch-gate-report.js                                        # UNSTAMPED after the switch: 6
git show f8b64e8:consonance/hooks/dispatch-gate.js | sed -n '212p;216p'              # the prefix, Aug 24
```
The one-line relaxation used for the HEAD run is `scratchpad/dg-relax.js` (this seat); it writes a copy named
`_echo_dg.test.js`, which was deleted after each run (`ls` confirms).

## 8 · Not established

- That the relaxed regex is the *right* form — it is the minimal one that lets the suite load; BRAVO may prefer the
  less coupled `.+;` form with a guard in the fallback.
- Anything about the installed hook's behaviour under the keeper's settings (bypass) — not re-measured; BRAVO's §5 says
  the same.
- That the six unstamped rows are all from the stale hook: the report infers it from field absence after the switch,
  which is the only reading consistent with an installed `f8b64e8`; I did not open the six rows' payloads.

*Pane E, 2026-08-31 ~06:50 −06:00. One file; nothing else touched; not committed.*
