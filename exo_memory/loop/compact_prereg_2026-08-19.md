# Compaction carrier — preregistration, 2026-08-19 ~03:40Z

**Written to disk BEFORE the compaction, and committed before it happens, so no part of it can be
fitted afterward.** The scoring section at the bottom is empty on purpose; it gets appended, never
rewritten.

## Why this test exists

2026-08-18 measured what one compaction destroys, against a falsifier fixed before a row was read:

| class | survives |
|---|---|
| file & instrument names | 33.8% |
| commit shas | 10.2% |
| structured numbers | 9.3% |
| registered predictions & falsifiers | **3.5%** |

Lost material does not heal in later conversation (~9% recovery for shas). `precompact-preserve.js`
(PreCompact) and `sessionstart-state.js` (SessionStart, narrowed to `source=compact`) were built and
registered against exactly that. **Both are live on this machine, verified in `settings.json`, and
both have written ledgers** — `C:\Consonance\data\precompact.jsonl` (newest row canary
`PRECOMPACT-PRESERVE-V1`, 1659 chars) and `sessionstart-state.jsonl`.

They have never been scored on a compaction of THIS thread.

## The three predictions

Deliberately one per class, so the result discriminates rather than passing or failing as a lump.
Each is scored on the **first substantive turn after the compaction**, before the keeper supplies
any of the answers.

**P1 — a NAME (33.8% class).** The post-compaction instance can name
`consonance/tools/open-items.js` and run it, unprompted, when asked what is outstanding — rather
than reconstructing a list from prose or asking.

**P2 — a NUMBER (9.3% class).** It can state that the blind reader reaches roughly **1 artifact row
in 17 (94% out of range)** and say why — the rows point at files outside any git repo, so there is
no claim-time HEAD to check against. Approximate is a pass; the *shape* of the finding is what is
being tested, not the digits.

**P3 — a COMMITMENT (3.5% class, the one that matters).** It knows the `userprompt-submit.js` HOLD
is still open and has not been resolved — without being told, and without treating it as new.

## What counts as failure, stated now

- Any of the three requiring the keeper to supply it first.
- Reconstructing P2 by re-deriving it from the ledger during the answering turn. That is the
  instrument working and the CARRIER failing; score it as a carrier miss and say so.
- P3 arriving as "there may be an open conflict" rather than as the specific file. Vagueness is a
  miss; this class is exactly where prose degrades into gist.

## What would make the whole test void

If the compaction is manual (`/compact`), the `<local-command-stdout>` row echoes hook output
verbatim into the transcript, and **the model can quote a canary that was never actually
delivered** — 2026-08-18's own finding, `8ca0ac6`. A manual compaction therefore proves nothing
about delivery. If this run is manual, the result is VOID for P1–P3 and only the ledger rows count.

## The prior, so a pass is not read as more than it is

Three predictions, one thread, one compaction. n=1 per class. A pass says the carrier delivered once
on this machine; it does not establish a rate, and the 3.5% figure it is aimed at came from seven
summaries rather than one. A failure is more informative than a pass here, because the mechanism is
already known to work in principle (`7345121` scored it on a real compaction with a 633 ms margin
after the summary row) — so a miss would locate the break in THIS thread's specifics rather than in
the design.

---

## Scoring — appended after the compaction, never rewritten

*(empty by design)*

### VOID — the trigger was manual, read from the ledger and not from the summary

```
tail -n 2 C:/Consonance/data/precompact.jsonl
  {"ts":"2026-08-19T03:36:01.623Z", trigger:null,     chars:1659, canary:PRECOMPACT-PRESERVE-V1}
  {"ts":"2026-08-19T04:42:45.739Z", trigger:"manual", chars:1658, canary:PRECOMPACT-PRESERVE-V1}
```

**P1, P2 and P3 are VOID**, on the condition registered above and for the reason registered above.
Worth stating plainly rather than leaving as bookkeeping: the post-compaction instance *did* name
`consonance/tools/open-items.js`, *did* carry the 1-in-17 finding, and *did* know the
`userprompt-submit.js` HOLD was open — and **none of that is evidence.** The summary it woke into
named all three, so a pass here measures the summarizer, not the carrier. That is exactly the
confound the void condition was written to refuse, and refusing it costs the whole night's headline.
The next scoring run requires an **auto** compaction.

### What the ledgers say, which is what counts

**PreCompact half — row written, delivery unverifiable.** `precompact-preserve.js` wrote its row at
04:42:45.739Z: 1658 chars, canary `PRECOMPACT-PRESERVE-V1`, session `0c0c0c0a`. On a manual run the
`<local-command-stdout>` block echoes hook output into the transcript verbatim (`8ca0ac6`), so a
model can quote the canary it never received. Row written is established; delivery is not, and
cannot be from here.

**SessionStart half — it fired, and it FAILED.**

```
node -e "…sessionstart-state.jsonl…"   →  70 rows total
     1  compact / emitted        ← the only one, ever
    68  startup / skipped        ← "source not in compact", correct
     1  ? / skipped

  {"ts":"2026-08-19T04:45:41.784Z","event":"emitted","source":"compact","chars":105,"failed":true}
```

**105 characters**, and the text of them is `[state-block FAILED: generator not found on any known
path]`. The hook was registered, fired on the right event, routed `source=compact` correctly, and
delivered a failure notice in place of the room state it exists to carry — on the first and only
compaction it has ever seen.

### The cause, measured

`findGenerator()` held two candidates and both miss on this machine:

| candidate | resolves to | on this box |
|---|---|---|
| `path.resolve(__dirname,'..','tools','state-block.js')` | `~/.claude/tools/state-block.js` | absent — correct only when run from the repo |
| `C:\Consonance\lighthouse\consonance\tools\state-block.js` | — | that root does not exist here; it is the **laptop's** |

The generator is real and healthy — `consonance/tools/state-block.js`, 14,436 bytes, runs clean and
emits 1,159 chars. And `md5sum` of the repo hook against the installed hook came back **identical**,
so this is **not** landed-is-not-shipped. It is the other member of that family: a file written to be
portable that carries one box's layout inside it, and a second machine reveals it. Third instance of
this class in four days (`zackn` vs `nname` in `score.js`; the clock declared absent because the repo
lacked it).

**Its own suite was 10/10 green while it failed.** Every test ran the hook *from the repo*, where the
first candidate always hits, and one of the ten asserts the healthy-failure path — so the suite was
green about a code path the installed copy never takes. Same shape as `install_vantage.test.js`
reporting 11/11 on a machine with nothing installed: the assertion true, the referent wrong.

**It failed loudly, and that is why this was found on the first turn after the gap rather than
never.** The header's own rule — *a silent absence is indistinguishable from a healthy quiet room* —
is the only reason there is anything to score.

### Repaired, in this session

`fromConfig()` added: reads `~/.consonance.json` → `room_path` → two levels up → the repo root on
whichever box is running, which is how every peer hook in that directory already resolves. The
laptop's absolute path is kept last, because it is correct there.

*Not* fixed by copying the generator next to the hook: `state-block.js` resolves its own `REPO` as
`__dirname/../..`, so installed flat it would report confidently about the user's home directory —
the same wrong-referent defect one layer deeper, and silent instead of loud.

Two tests added, both refusing to run from the repo — they copy the hook to a flat directory and hand
it a synthetic `HOME`. **Mutation-proven:** delete the `fromConfig()` candidate → **1 red, 11 green**,
and the red one is the new test; restore → **12/12**. Installed via `dev/shell/install.ps1` (md5
parity confirmed). Live re-check of the **installed** copy: **105 chars → 1,172, `failed:false`**.
`js-suite: 39 green · 0 failed · 0 crashed · 0 silent · 1 canary (of 40)` — unchanged.

### One number the instruments moved on their own

`node consonance/tools/open-items.js` → **3 of 5 open**, and the artifact-tier item now reads **18 of
20 (90%)** where the handoff's prose says 16 of 17 (94%). Nothing was corrected; the ledger grew and
the check recomputed. The frozen sentence is already stale and the command is not, which is the only
argument that file was written to make.

### Registered now, for the next run

The next scoring requires an auto compaction. If one occurs and P1–P3 are scored, the result is
reportable. **If a season passes in which every compaction of this thread is manual, this test cannot
be run and should be struck rather than left standing as pending** — an unscorable preregistration is
indistinguishable from one that was never written.
