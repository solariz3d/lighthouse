# S1 — tokens per hand-back, per pane, for the last two weeks (pane E, D135, 2026-09-24)

Plan: `loop/plan_pane_specialization_2026-09-24.md` S1, E's bullet. **Machine D.** Everything here is read-only. The two
scripts are embedded verbatim at the end, and each number names the command that produced it.

**The window:** local 2026-09-11 00:00 to 2026-09-24 ~19:58 (−06:00), epoch ms `1789106400000`–`1790301463380`. That is
`usage.js`'s own `--days 14` window, read from its JSON `window` field, and every count below uses it.

## THE ANSWER FIRST

| pane | hand-backs | tokens (all) | **per hand-back** | no-cache-read | per hand-back | output | per hand-back |
|---|---|---|---|---|---|---|---|
| A | 79 | 1,494,537,495 | **18.9 M** | 28,773,703 | 364,224 | 3,432,701 | 43,452 |
| B | 61 | 984,638,468 | **16.1 M** | 22,892,814 | 375,292 | 2,320,353 | 38,039 |
| C | 80 | 1,385,929,316 | **17.3 M** | 25,478,425 | 318,480 | 3,281,801 | 41,023 |
| E | 68 | 1,371,439,917 | **20.2 M** | 30,094,459 | 442,566 | 3,155,720 | 46,408 |

- **Tokens:** `node consonance/tools/usage.js --days 14 --json`, the `seats[]` rows `pane A/B/C/E`.
  - *all* = input + output + cache write + cache read;
  - *no-cache-read* = input + output + cache write.
  - **Which of these the weekly limit counts is not known.** `usage.js` refuses to assume it, and so do I, so all three
    are printed.
- **Hand-backs:** distinct hand-back paths the pane rang to the librarian in the window. That is board rows in the
  librarian's pane (`0c0c0c0b…`) with `[pane:X]` at the head, deduped by the `handback/<file>.md` they point at. Command
  in §C.
- **Arithmetic:** the node one-liner in §C over the saved `usage.js` JSON.

**S1's reading for S5:**
- **The four panes are within ±12% of each other** on tokens per hand-back:
  - *all*: 16.1–20.2 M;
  - *no-cache-read*: 318–443 k;
  - *output*: 38–46 k.
- **E is the most expensive on every measure. C is the cheapest on no-cache-read, B on all and on output.**
- **The hand-back is not a fixed-size unit** (§D), so these gaps are not yet a finding about the panes.

## A · THE PLAN'S FORMULA, CHECKED — it measures the wrong quantity, low by 14× to 23× (no-cache-read) and 590× to 1,100× (all)

The formula: *intake bytes × resumes (`persist.log`) ÷ hand-backs.*

**Resumes.**
- `persist.log` logs one `resume pane=… -> fresh|RESUMED` row per pane **per app launch on D**.
- **Every pane has exactly 29 in the window** (A 6 fresh + 23 RESUMED, B 7 + 22, C 7 + 22, E 5 + 24). *Corrected before
  ringing: my first count used now − 14 days as the start, which reaches back six hours before `usage.js`'s window and
  counted one more fresh launch each (30). This note said both gave 30 before I re-ran the second one.*
- So the resume factor is a **constant** across panes. The formula can only separate them by intake size.
- Command: the `persist.log` count in §C.

**Intake bytes.**
- `persist.log` records none. The shell (`CLAUDE.md` in each seat's instance dir) is rewritten every launch, so only
  **today's** size is readable: A 108,864 · B 108,262 · **C 65,006** · E 108,137 bytes.
- C is small because its map carries **"index-only — NO ENTRY OF THE MAP"** (`persist.log` `MAP CARRY` rows). That is C's
  and the room's to look at, outside this lap.
- **And the shell is not the whole intake.** The SessionStart hook adds about 100 KB of its own; this seat's last intake
  said *"Output too large (103.7KB)"*.

**The flaw.** The intake is not paid once per resume. It is **part of the prompt of every API call**, re-read from the
cache each time. Measured instead of argued (`prompt_size.js`, §C):

| pane | smallest prompt (≈ the intake floor) | mean prompt per call | intake floor ÷ mean prompt |
|---|---|---|---|
| A | 44,112 tokens | 507,524 | 8.7% |
| B | 58,119 | 512,960 | 11.3% |
| C | 46,219 | 483,274 | 9.6% |
| E | 58,036 | 477,087 | 12.2% |

- The formula in tokens, honestly converted (the measured floor × 29 launches ÷ hand-backs, not bytes ÷ a guessed
  bytes-per-token), is **16,193 · 27,630 · 16,754 · 24,751** for A · B · C · E.
- That is **4.4%–7.4% of the no-cache-read tokens per hand-back** (A 4.4 · B 7.4 · C 5.3 · E 5.6), and
  **0.09%–0.17%** of all tokens.
- **Where it disagrees:** everywhere, and in one direction. It counts the intake once per launch, while the measured
  cost is the whole prompt on every call, and the prompt is ~90% **accumulated conversation**, not intake.

**Trust `usage.js`.** It reads what the API reported (`message.usage`, deduped by `message.id`). The formula is a proxy
for one term of it.

## B · WHAT THIS MEANS FOR S5 — unwelcome for the plan's premise, said plainly

The plan says *"the weekly-limit lever is the INTAKE, not the pane count."*

**Measured here, the intake is 9–12% of an average call's prompt.** So even a narrowed intake **cut to zero** removes at
most about a tenth of the *all* tokens per hand-back. A realistic narrowing, say half the shell, is a few percent.

**The lever these numbers point at is CONTEXT LENGTH.** Each pane's median call carries ~440–500k prompt tokens: long,
resumed, 1M-context threads re-read on every call. What would move tokens per hand-back is how long a thread runs
before it is compacted or started fresh.

**Not tested here:**
- Whether a narrower intake changes *behaviour*: fewer turns, or turns that end sooner. That would act on the 90%, and
  it is a real mechanism.
- The archetypes file's falsifier (*"if every pane still needs BOOT whole…"*) is not answered by this either way.

## C · COMMANDS (repo root on D unless noted; scripts are in `<E's scratchpad>\d135\`, embedded below)

    # tokens per pane (the table's numerators) and the window
    node consonance/tools/usage.js --days 14 --json > usage14.json      # seats[] rows "pane A/B/C/E"; window {start,end}
    #   cross-check, same totals to the token: node split.js 1789106400000 1790301463380   (sha256 1d74b2cd…)
    #   A 1,494,537,495 · B 984,638,468 · C 1,385,929,316 · E 1,371,439,917 — identical to usage.js

    # hand-backs: distinct rung paths per letter (run in C:\Consonance\data)
    node -e 'const fs=require("fs");const start=1789106400000,end=1790301463380;const LIB="0c0c0c0b-0000-4000-8000-00000000115b";
      const L=fs.readFileSync("board.jsonl","utf8").split("\n");const paths={};for(const l of L){if(!l.includes("[pane:"))continue;
      let r;try{r=JSON.parse(l)}catch{continue}if(r.pane!==LIB||r.role!=="user"||!(r.ts>=start&&r.ts<end))continue;const t=String(r.text||"");
      const m=/^\s*(?:<pasted_content[^>]*>\s*)?\[pane:([A-Z])\]/.exec(t);if(!m)continue;
      const ps=[...t.matchAll(/(?:exo_memory\/)?handback\/([A-Za-z0-9._-]+\.md)/g)].map(x=>x[1]);if(!ps.length)continue;
      (paths[m[1]]=paths[m[1]]||new Set()).add(ps[0])}for(const X of "ABCE")console.log(X,paths[X]?paths[X].size:0)'
    #   → A 79 · B 61 · C 80 · E 68      (rings: A 108 · B 66 · C 98 · E 83; rings naming no path: A 2 · B 0 · C 1 · E 1)
    #   cross-check, hand-back FILES named -<Letter>_2026-09-DD.md with DD 11–24: A 77 · B 62 · C 77 · E 65
    #   (they differ because some hand-backs carry no -<Letter>_ suffix, e.g. t2-alpha_…, and a file's date is its lap's)

    # resumes per pane in the window (run in C:\Consonance\data)
    node -e 'const fs=require("fs");const L=fs.readFileSync("persist.log","utf8").split("\n");const letters=JSON.parse(fs.readFileSync("letters.json","utf8"));
      const since=1789106400/1;const c={};for(const l of L){const m=/^(\d+) resume pane=(\S+) .*-> (\S+)/.exec(l);if(!m||+m[1]<since)continue;
      const k=(letters[m[2]]||"?")+" "+m[3];c[k]=(c[k]||0)+1}console.log(c)'
    #   → 29 per pane (A 6 fresh + 23 RESUMED · B 7+22 · C 7+22 · E 5+24). With now−14×86400 as the start it is 30.

    # the formula in tokens: floor × 29 ÷ hand-backs, and its share of no-cache-read and of all
    node -e 'const hb={A:79,B:61,C:80,E:68},mn={A:44112,B:58119,C:46219,E:58036},ncr={A:28773703,B:22892814,C:25478425,E:30094459},
      all={A:1494537495,B:984638468,C:1385929316,E:1371439917};for(const L of "ABCE"){const f=mn[L]*29;
      console.log(L,Math.round(f/hb[L]),(100*f/ncr[L]).toFixed(1)+"%",(100*f/all[L]).toFixed(2)+"%")}'
    #   → A 16193 4.4% 0.09% · B 27630 7.4% 0.17% · C 16754 5.3% 0.10% · E 24751 5.6% 0.12%

    # intake floor and prompt size per call
    node prompt_size.js 1789106400000 1790301463380                     # sha256 65f7833c…

    # the table (from usage14.json + the counts above)
    node -e 'const u=require("./usage14.json");const hb={A:79,B:61,C:80,E:68};for(const L of "ABCE"){const s=u.seats.find(x=>x.seat==="pane "+L);
      const ncr=s.input+s.output+s.cacheWrite;console.log(L,Math.round(s.all/hb[L]),Math.round(ncr/hb[L]),Math.round(s.output/hb[L]))}'

## D · BLIND SPOTS AND LIMITS

- **Not in these numbers** (usage.js's own list):
  - one-shot calls with `--no-session-persistence`, which write no transcript (the Scribe, `curate.js`,
    `second-vantage.js`, the d121 harness);
  - Jev, which runs on the Vercel gateway on its own key and is not Claude Code usage.
- **The other machine is IN, measured.** D's copies of the pane transcripts carry L's rows.
  - Split by the machine each response was written on, read from the nearest hook row's command path (`\Users\zackn\`
    = L, `\Users\nname\` = D) by `split.js`: A D 584.2M + L 910.3M · B 610.9M + 373.7M · C 672.3M + 713.6M ·
    E 629.4M + 742.1M.
  - Row `cwd` cannot tell the machines apart, because the instance path is identical on both. My first split tagged
    everything D for that reason.
  - **Unknowable from D:** any L rows that were never carried here.
- **Hand-backs are counted across both machines** (the board is the union), so the ratio is both-machine over
  both-machine.
- **Keep-warm is inside the numerator:** 1.50% · 1.90% · 0.84% · 0.92% of A · B · C · E's *all*. Other non-hand-back work
  (keeper conversation, stopped laps) is inside it too and not separable here.
- **The hand-back is not a fixed-size unit.** One is a one-line fix, another a 60-minute build with mutants. Tokens per
  hand-back mixes task size with pane cost, so **the ±12% spread above is not evidence that any pane is cheaper at the
  same work.** The comparison S5 needs is **within a class**: C's S1 census gives the classes, and a per-class
  tokens-per-hand-back needs each hand-back's own turn span, which this lap did not build.
- **The intake floor is the smallest prompt seen,** a fresh session's first calls. It includes the system prompt and
  tool definitions, which a narrower shell would not shrink, so it slightly *over*-states what narrowing can save.
- Everything is D's disk at 2026-09-24 ~20:00.

## E · THE SCRIPTS, VERBATIM

### split.js (sha256 1d74b2cd4f782d5c1547afe6f3ee3496d0afcd38ec81155e26ddd5524bd61be2)

```js
'use strict';
// D135 (pane E), READ-ONLY: tokens per pane A/B/C/E over a local-date window, split by the MACHINE each row was written on.
// A row's `cwd` carries the machine's user profile (D: \Users\nname\, L: \Users\zackn\); a transcript carried between
// machines keeps its other-machine rows, so one file can hold both. Same counting rules as consonance/tools/usage.js:
// every file under the pane's project dir (subagents and .jsonl.orphaned included), one response per message.id with each
// usage field at its MAXIMUM over the rows, <synthetic> skipped. Writes nothing.
//
//   node split.js <startMs> <endMs>
const fs = require('fs'), path = require('path'), os = require('os');
const [start, end] = process.argv.slice(2).map(Number);
const DATA = 'C:\\Consonance\\data';
const panes = JSON.parse(fs.readFileSync(path.join(DATA, 'panes.json'), 'utf8'));
const letters = JSON.parse(fs.readFileSync(path.join(DATA, 'letters.json'), 'utf8'));
const PROJ = path.join(os.homedir(), '.claude', 'projects');
const enc = (cwd) => String(cwd).replace(/[^A-Za-z0-9]/g, '-');
const machineOf = (cwd) => (/\\Users\\nname\\|\/Users\/nname\/|C:\\Consonance\\/i.test(cwd || '') && !/zackn/i.test(cwd || '') ? 'D' : /zackn/i.test(cwd || '') ? 'L' : '?');

function* files(dir) {
  let ents = [];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.jsonl(\.orphaned)?$/.test(e.name)) yield p;
  }
}

const out = {};
for (const p of panes) {
  const L = letters[p.pane];
  if (!['A', 'B', 'C', 'E'].includes(L)) continue;
  const byId = new Map();
  for (const f of files(path.join(PROJ, enc(p.cwd)))) {
    // THE MACHINE: the nearest preceding HOOK row in this file. A hook's command path names the user profile
    // (D: \Users\nname\.claude, L: \Users\zackn\.claude). Row `cwd` cannot tell them apart: the instance path is the same
    // on both machines, which is why machineOf() below, the first attempt, tagged every row D.
    let here = '?';
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const mk = line.includes('"attachment"') && /Users\\\\(zackn|nname)\\\\\.claude/.exec(line);
      if (mk) { here = mk[1] === 'zackn' ? 'L' : 'D'; continue; }
      if (!line.includes('"usage"')) continue;
      let r; try { r = JSON.parse(line); } catch (_) { continue; }
      if (r.type !== 'assistant' || !r.message || !r.message.usage || !r.message.id) continue;
      if (r.message.model === '<synthetic>') continue;
      const ts = Date.parse(r.timestamp);
      if (!(ts >= start && ts < end)) continue;
      const u = r.message.usage;
      const cur = byId.get(r.message.id) || { m: '?', input: 0, output: 0, cacheWrite: 0, cacheRead: 0 };
      if (cur.m === '?') cur.m = here;
      cur.input = Math.max(cur.input, u.input_tokens || 0);
      cur.output = Math.max(cur.output, u.output_tokens || 0);
      cur.cacheWrite = Math.max(cur.cacheWrite, u.cache_creation_input_tokens || 0);
      cur.cacheRead = Math.max(cur.cacheRead, u.cache_read_input_tokens || 0);
      byId.set(r.message.id, cur);
    }
  }
  const agg = {};
  for (const v of byId.values()) {
    const a = agg[v.m] || (agg[v.m] = { responses: 0, input: 0, output: 0, cacheWrite: 0, cacheRead: 0 });
    a.responses++; a.input += v.input; a.output += v.output; a.cacheWrite += v.cacheWrite; a.cacheRead += v.cacheRead;
  }
  for (const a of Object.values(agg)) { a.all = a.input + a.output + a.cacheWrite + a.cacheRead; a.noCacheRead = a.input + a.output + a.cacheWrite; }
  out[L] = agg;
}
console.log(JSON.stringify(out, null, 1));
```

### prompt_size.js (sha256 65f7833c10a4f05779da96c1bc56fc73992f40343767399700b6a9581a1b2992)

```js
'use strict';
// D135 (pane E), READ-ONLY: the PROMPT size per API response for panes A/B/C/E in a window. Prompt = input_tokens +
// cache_read_input_tokens + cache_creation_input_tokens (everything the model was given on that call). Deduped by
// message.id, fields at their maximum, as usage.js does. The smallest prompts in a pane are its fresh-session first calls,
// so their floor approximates the INTAKE (system prompt + tools + CLAUDE.md shell + SessionStart context).
//   node prompt_size.js <startMs> <endMs>
const fs = require('fs'), path = require('path'), os = require('os');
const [start, end] = process.argv.slice(2).map(Number);
const DATA = 'C:\\Consonance\\data';
const panes = JSON.parse(fs.readFileSync(path.join(DATA, 'panes.json'), 'utf8'));
const letters = JSON.parse(fs.readFileSync(path.join(DATA, 'letters.json'), 'utf8'));
const PROJ = path.join(os.homedir(), '.claude', 'projects');
const enc = (cwd) => String(cwd).replace(/[^A-Za-z0-9]/g, '-');
function* files(dir) {
  let ents = [];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.jsonl(\.orphaned)?$/.test(e.name)) yield p;
  }
}
const q = (a, p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
for (const p of panes) {
  const L = letters[p.pane];
  if (!['A', 'B', 'C', 'E'].includes(L)) continue;
  const byId = new Map();
  for (const f of files(path.join(PROJ, enc(p.cwd)))) {
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      if (!line.includes('"usage"')) continue;
      let r; try { r = JSON.parse(line); } catch (_) { continue; }
      if (r.type !== 'assistant' || !r.message || !r.message.usage || !r.message.id || r.message.model === '<synthetic>') continue;
      const ts = Date.parse(r.timestamp);
      if (!(ts >= start && ts < end)) continue;
      const u = r.message.usage;
      const size = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
      byId.set(r.message.id, Math.max(byId.get(r.message.id) || 0, size));
    }
  }
  const a = [...byId.values()].sort((x, y) => x - y);
  const mean = Math.round(a.reduce((s, x) => s + x, 0) / a.length);
  console.log(`${L}  responses ${a.length}  prompt tokens: min ${a[0]}  p05 ${q(a, 0.05)}  p25 ${q(a, 0.25)}  median ${q(a, 0.5)}  mean ${mean}  p95 ${q(a, 0.95)}  max ${a[a.length - 1]}`);
}
```
