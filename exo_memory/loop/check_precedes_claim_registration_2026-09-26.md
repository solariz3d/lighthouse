# CHECK-PRECEDES-CLAIM — a mechanical instrument from transcripts, REGISTERED before any row runs (pane E, D159, 2026-09-26)

**Why it exists.**
- **The trigger:** C's census (`loop/retrieval_split_census_2026-09-26.md`, D158, `703dc74`) fired the retrieval plan's
  sealed falsifier: landed REACH 56 against COMPOSITION 31.
- **The ruling** (`1c2ce19`) re-aims reach at **KNOWN-UNOPENED**, C's reading of 48 of the 56: *"the source was known, in
  the seat's own record, or 'one grep away', and no check preceded the claim."*
- **The proxy:** BOOT already names it, *"did a check precede the claim?"* This file makes that proxy mechanical and
  fixes, before any row runs, how it will be validated.

**Registration only. No instrument row was run.**
- **What was run** (read-only, below): a locator that decides whether each census row's claim can be **found** in a
  transcript at all. That is a precondition count the packet asked for. It reads no "before".
- **One exception, declared:** to test whether "before" can be read at all, I printed **one** located turn (W105) in full.
  I have therefore seen its outcome, and **W105 is excluded from the scored set** (§3).
- C is barred as a reader here, and nothing is routed through C.

## 1 · WHAT COUNTS AS A CLAIM

**Claim-bearing text:**
1. every assistant `text` block;
2. the text a seat **writes** through a tool: `Write.content`, `Edit.new_string`, `MultiEdit.edits[].new_string`, and
   the body of a Bash heredoc (`<<'X' … X` or `<<X … X`) or an `echo …`/`printf …` redirected with `>`/`>>`.

The second is required, not optional. W105's wrong claim ("my transcript has 3 server-error rows …") exists **only**
inside a `cat >> exo_memory/librarian/…` heredoc (transcript `0c0c0c0b…jsonl`, line 1171).

**The extracted claims**, each (row, token), with their type:

| type | extraction rule | examples | known misses and false extractions |
|---|---|---|---|
| **PATH** | `[\w./\\-]+\.(md\|js\|rs\|json\|jsonl\|ps1\|py\|txt\|toml\|html\|css\|cjs\|mjs\|sh\|ini)` optionally followed by `:<n>` or `:<n>-<m>`; and Windows paths `[A-Z]:\\[^\s"'`]+` | `main.rs:4857-4870`, `exo_memory/librarian/2026-09-01.md`, `C:\Consonance\data\persist.log` | a path named without an extension (`exo_memory/handback/`), a file named only in prose ("the manifest") |
| **NUMBER** | a numeral with **≥ 2 significant digits** (`\b\d{2,}(\.\d+)?%?\b`, thousands separators removed), **excluding** dates, clock times, years, lap/packet ids (`D152`, `L113`, `W105`), hex shas (≥ 7 hex characters), version strings, section and line references already inside a PATH, and ordinal list markers | "518 paths", "56 vs 31", "94.7%", "144529 bytes" | **single-digit numbers are excluded** (they match almost any tool output, so "checked" would be meaningless); written numbers ("twenty laps"); paraphrased or rounded figures ("about 20") |
| **SOURCE** | a backticked command, script or tool name: `` `node consonance/tools/<x>.js …` ``, `` `git <verb> …` ``, `` `<script>.ps1` `` | `` `node consonance/tools/whats-live.js` ``, `` `git log --since=…` `` | a source named in prose ("the log", "the handoff") |

## 2 · WHAT COUNTS AS A CHECK, and how "before" is read

**The turn** is every row of one transcript from a real user prompt (a `user` row whose content is a string, or text
blocks with no `tool_result`) up to the next one. Rows are read **in file order**, which is chronological within a
transcript.
- **Verified on one turn:** W105's turn, lines 1151–1182: prompt → text → tool_use → tool_result → … → the claim row →
  its tool_result. Each tool call's row precedes its result and the text after it.
- A resumed or carried session can hold the same row twice. **The first occurrence is used.**

**A claim is CHECKED iff**, in the **same turn** and at a **smaller line index** than the row carrying the claim, one of
these holds:

| claim type | a check is | "touching" is matched as |
|---|---|---|
| PATH | a `tool_use` whose string inputs mention the path | the path's **basename plus at least one parent directory**, case-insensitive, slashes normalised (`\`=`/`), line suffix dropped. `Read.file_path`, `Grep.path`, `Glob.pattern`/`path`, and any substring of a `Bash.command` all count. A bare basename match (`main.rs` alone) is **weak** and counted separately |
| NUMBER | a `tool_result` whose text contains the number as a whole token (separators removed, the same rounding as written) | exact token match, and only for numbers passing §1's ≥ 2-digit rule |
| SOURCE | a `tool_use` whose `Bash.command` (or the named tool) contains the command's program and first argument | substring, normalised whitespace |

**Same-row case.** If a single Bash command both checks and writes the claim (`grep … && cat >> notes <<X … X`), it
counts as CHECKED only if the checking part precedes the claim text **by character position** within that command.

**The output per claim:** CHECKED, or UNCHECKED-IN-TURN (**flagged**). **Per turn:** flagged iff **any** of its
extracted claims is flagged. For a validation row, only the claim token(s) the census names are scored (§3).

**A secondary mode, reported beside the primary and never replacing it:** LOOK-BACK counts a check in the **same
session** up to **3 prior turns** back. It exists for §6's first limit.

## 3 · THE VALIDATION SET, fixed from the census

**The locate step. The count is the one the packet asked for, run read-only.**
- The locator (`locate.js`, verbatim in §8, sha256 `37fdd21f…130c`) takes anchors from each row's own record: quoted
  spans of ≥ 12 characters in the census's "wrong claim" cell, and the text of the "wrong sentence" line when it is a
  `path:line`.
- It searches that seat's transcripts on D within [date − 1 day, date + 2 days), in assistant text and in tool inputs.
- It takes the **earliest** match, because the later WRONG entry that records the error quotes the claim.

Over the **48 landed KNOWN-UNOPENED rows** (`ku.json` sha256 `b806fcaf…52f7`; result `ku_located.json` `eab8f538…517d`):

| outcome | rows |
|---|---|
| **LOCATED** | **10**: W081 (ambiguity 4), W101 (1), W105 (1), W123 (2), W124 (2), W126 (13), W136 (1), W140 (2), W148 (2), W322 (7). Ambiguity = distinct turns matching |
| **NOT-FOUND**: anchors exist, no match in D's transcripts | **16** |
| **NO-ANCHOR**: no quoted span, and no `path:line` for the wrong sentence | **22** |

- **By seat:** librarian 9 located / 13 not found / 16 no anchor; B 1 / 1 / 5; A 0 / 1 / 1; chair 0 / 1 / 0.
- **The 9 rows dated before 08-31 all fail to locate.** D's librarian transcripts begin about 08-27, and the late-August
  claims were largely made on L.

**The manual locate, for the 38 not located mechanically. Fixed now, blind by construction.**
- **Who:** a non-author reader, not C and not E: the librarian, or A.
- **What the reader sees:** a **text-only extract** of the seat's turns in the row's date window. That is assistant text
  plus written-file text, **with every tool call and tool result stripped**, so whether a check preceded is invisible
  while locating.
- **The rule:** the reader picks the turn whose claim text states the census row's specific content (its path, number
  or named source), or declares NOT LOCATABLE.
- **Only then** does the instrument run on the chosen turn.
- Each row is recorded LOCATED-MECH, LOCATED-MANUAL or NOT LOCATABLE.

**Ambiguity.** A mechanically located row with ambiguity > 3 (W126 at 13, W322 at 7, W081 at 4) is **re-located
manually** the same blind way, because its anchor ("YOUR OWN MAP", "roughly twenty laps") is too common to trust the
earliest match.

**The KU set that is scored:**
- located (MECH or MANUAL);
- **minus W105** (outcome seen while testing "before");
- **∩ the rows B's independent re-read also calls KNOWN-UNOPENED.**

**A row B calls UNSEARCHED, or any other class, leaves the set**, and every such disagreement is printed. If B's read is
not scored before the run, the run **waits** for it; it does not run on C's labels alone.

**The CORRECT set, matched so it cannot be cherry-picked.** For every scored KU row, **two** claims:
1. **Same seat, same transcript, same UTC day, same claim type** (PATH, NUMBER or SOURCE) as the KU row's scored token.
2. **Taken mechanically:** starting 3 turns after the KU claim's turn, walk forward in file order. The first 2 turns that
   carry a claim of that type, and whose turn is **not** cited by any census row, are the candidates. If the day runs
   out, walk backward from 3 turns before.
3. **Verified CORRECT before the instrument runs, blind to it.** The same non-author checks each candidate against its
   source, working from the text-only extract: the path exists at the commit of that day (`git cat-file -e <commit>:<path>`),
   the number re-derives by a named command, or the command exists and does what the claim says.
   - A candidate that cannot be verified correct is **discarded and the next one taken**, never guessed.
   - A candidate found **wrong** is recorded as a found error and discarded.

**Minimum size: 8 scored KU rows.** Below 8, the validation is reported **NOT TESTED** and nothing is scored. Today's
mechanical count is 9 before B's intersection (10 minus W105), so NOT TESTED is a live outcome.

## 4 · THE PREDICTIONS AND THE PASS RULE — sealed now

**Flag rate** = flagged / scored, primary mode (same turn).

| | threshold for PASS | my prediction (E) |
|---|---|---|
| KU set: flag rate | **≥ 0.70** | **~0.75** |
| CORRECT set: false-flag rate | **≤ 0.40** | **~0.45**, i.e. just over the bar |
| difference, KU − CORRECT | **≥ 0.30** | ~0.30 |

**PASS requires all three.** Each rate is printed with its count and an exact (Clopper–Pearson) 95% interval. With
n ≈ 8–20, **no threshold is read from the interval's edge.** The point estimates decide, and the intervals are printed so
nobody over-reads a pass.

**Why I predict it narrowly FAILS on the correct set.** In the transcripts I read for this lap, seats cite paths and
figures from memory, their own notes, or an earlier turn as a matter of course. So **correct** claims should often lack
a same-turn check too. If that is right, same-turn check-precedence cannot separate wrong from right, and the
proxy is weaker than BOOT's sentence suggests. **I would rather register that than a comfortable prediction.**

## 5 · DEGENERATE — stated before the run

The instrument is **degenerate**, reported as such and never tuned afterwards, if **any** of these holds:
- **D1:** CORRECT-set flag rate **≥ 0.70**. It flags nearly every claim.
- **D2:** KU − CORRECT difference **< 0.20**. A correct claim flags about as often as a wrong one.
- **D3:** KU flag rate **≤ 0.30**. The touching rule is so loose that checks "precede" almost everything, e.g. numbers
  matching by coincidence in large tool outputs.
- **D4:** more than 25% of the scored rows' claim tokens cannot be extracted by §1. It cannot read the claims it is
  meant to test.

**Not degenerate, but NOT TESTED:** fewer than 8 scored KU rows (§3).

**The abuse condition, the room's own:** a threshold, the touching rule, the ≥ 2-digit rule or the look-back window
changed **after** any flag is seen is degeneration, not refinement. It voids this registration and needs a new one.

## 6 · LIMITS, named now

1. **Checks in an EARLIER turn.** The primary mode calls a claim unchecked even when the seat read the source one turn
   ago, which is often legitimate. LOOK-BACK (3 turns) is reported beside it; neither one alone is "the" answer.
2. **Sources that are not files:** a probe, the seat's own tool list, the keeper's words, a running process. SOURCE
   covers named commands. It does **not** cover "my own tool list" (W002-style), a UI state or a spoken ruling, and those
   rows cannot be scored.
3. **Paraphrased or rounded numbers.** "About 20" against a tool output of 19 is not a token match, so it reads as
   unchecked, which is the correct reading of a paraphrase but not of a rounding. Written numbers ("twenty") are not
   extracted at all.
4. **Subagent reads.** A read done inside an `Agent` call lives in the subagent's transcript. The main turn shows only the
   Agent call and its result, so only a number carried into that result counts.
5. **Coincidental number matches.** A large tool output can contain any two-digit number, so CHECKED can be a false
   negative. D3 and the CORRECT set are where that shows.
6. **A check is not a correct check.** The instrument reads **precedence**, not whether the right thing was read or
   understood. W105 is exactly this case: a transcript scan preceded a wrong count. It says nothing about whether a
   preceded claim is right.
7. **Machine coverage.** D's transcripts carry L's rows only for conversations carried here. The late-August rows are
   largely unreachable from D.
8. **File-level touching is coarse.** Reading `main.rs` anywhere counts as touching `main.rs:4857`. A line-range variant
   (Read offset/limit overlap) is reported as secondary, not primary.

## 7 · WHO DOES WHAT

| step | who | why |
|---|---|---|
| mechanical locate, extraction, flagging | a script, any seat may run it | mechanical |
| manual locate, CORRECT-set sampling and verification | the librarian or A, **not C, not E** | C is barred; E wrote this and holds the predictions |
| B's KU re-read | B, in parallel, independently of C | the set is the intersection |
| applying §4 and §5 to the counts | the librarian | no seat scores its own instrument |

## 8 · THE LOCATOR, VERBATIM (sha256 `37fdd21fe2db51d7fbe16701ead35385a68d7eae2a655f0a0c9b580f369d130c`)

````js
'use strict';
// D159 (pane E), READ-ONLY: can each census row's CLAIM be located in a transcript? This sizes the validation set; it does
// NOT run the check-precedes-claim instrument (no "before" is read here).
//
//   node locate.js <repo> <rowsFilter: KU|CORRECT-sample file> <out.json>
//
// ANCHORS per row (the registration §3.1 rule):
//   A1  every quoted span in the census's "the wrong claim" cell: '…', "…", `…`, “…”, of >= 12 characters
//   A2  if "wrong sentence" is <path>:<line> in the repo: the line's text, markdown stripped, whitespace collapsed; the
//       anchor is its longest run of >= 40 characters without a backtick (a raw 40..80-char window)
// SEARCH: the seat's transcript dirs (map below), rows whose timestamp is within [date-1d, date+2d) UTC; text of assistant
//   `text` blocks AND the string inputs of tool_use blocks (a seat writes its record through Write/Edit). Whitespace and
//   markdown asterisks are normalised on both sides.
// LOCATED = at least one match; the EARLIEST match (by timestamp) is taken as the claim, because a later WRONG entry that
//   records the error quotes the claim. The number of distinct turns matching is kept as `ambiguity`.
const fs = require('fs'), path = require('path'), os = require('os'), readline = require('readline');
const [repo, rowsFile, out] = process.argv.slice(2);
const PROJ = path.join(os.homedir(), '.claude', 'projects');
const SEATDIRS = {
  librarian: ['C--Consonance-instances-librarian'],
  chair: ['C--Consonance-instances-main'],
  A: ['C--Consonance-instances-sibling-3d57124e'],
  B: ['C--Consonance-instances-sibling-5bf9d657'],
  C: ['C--Consonance-instances-sibling-0845a868'],
  E: ['C--Consonance-instances-sibling-07b8a48f'],
};
const norm = (s) => String(s).replace(/\*\*/g, '').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();

const rows = JSON.parse(fs.readFileSync(rowsFile, 'utf8'));
for (const r of rows) {
  const anchors = new Set();
  for (const m of r.claim.matchAll(/'([^']{12,})'|"([^"]{12,})"|`([^`]{12,})`|“([^”]{12,})”/g)) anchors.add(norm(m[1] || m[2] || m[3] || m[4]));
  const ws = /^([\w./-]+\.md):(\d+)$/.exec((r.sentence || '').trim());
  if (ws) {
    const p = path.join(repo, ws[1].startsWith('exo_memory') ? ws[1] : 'exo_memory/' + ws[1]);
    try {
      const line = norm(fs.readFileSync(p, 'utf8').split('\n')[+ws[2] - 1] || '').replace(/`/g, '');
      if (line.length >= 40) anchors.add(line.slice(0, 80));
    } catch (_) { /* unreadable path: no A2 anchor */ }
  }
  r.anchors = [...anchors];
}

async function scan(file, lo, hi, want) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, 'utf8'), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes('"assistant"')) continue;
    const t = /"timestamp":"([^"]+)"/.exec(line);
    if (!t) continue;
    const ts = Date.parse(t[1]);
    if (!(ts >= lo && ts < hi)) continue;
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content)) continue;
    const parts = [];
    for (const c of o.message.content) {
      if (c.type === 'text') parts.push(c.text);
      else if (c.type === 'tool_use' && c.input) for (const v of Object.values(c.input)) if (typeof v === 'string') parts.push(v);
    }
    const text = norm(parts.join(' \n '));
    for (const w of want) for (const a of w.r.anchors) if (text.includes(a)) w.hits.push({ file: path.basename(file), ts: t[1], uuid: o.uuid, anchor: a.slice(0, 50) });
  }
}

(async () => {
  const bySeat = {};
  for (const r of rows) (bySeat[r.seat] = bySeat[r.seat] || []).push({ r, hits: [] });
  for (const [seat, ws] of Object.entries(bySeat)) {
    const dirs = SEATDIRS[seat];
    if (!dirs) { for (const w of ws) w.r.locate = 'NO-SEAT-DIR'; continue; }
    const days = ws.map((w) => Date.parse(w.r.date + 'T00:00:00Z'));
    const lo = Math.min(...days) - 86400e3, hi = Math.max(...days) + 2 * 86400e3;
    for (const d of dirs) {
      let files = [];
      try { files = fs.readdirSync(path.join(PROJ, d)).filter((f) => /\.jsonl(\.orphaned)?$/.test(f)); } catch (_) { continue; }
      for (const f of files) {
        const want = ws.filter((w) => w.r.anchors.length);
        if (want.length) await scan(path.join(PROJ, d, f), lo, hi, want);
      }
    }
    for (const w of ws) {
      const day = Date.parse(w.r.date + 'T00:00:00Z');
      const inWin = w.hits.filter((h) => { const t = Date.parse(h.ts); return t >= day - 86400e3 && t < day + 2 * 86400e3; }).sort((a, b) => a.ts.localeCompare(b.ts));
      w.r.anchorCount = w.r.anchors.length;
      w.r.locate = !w.r.anchors.length ? 'NO-ANCHOR' : inWin.length ? 'LOCATED' : 'NOT-FOUND';
      w.r.first = inWin[0] || null;
      w.r.ambiguity = new Set(inWin.map((h) => h.uuid)).size;
      delete w.r.anchors;
    }
  }
  fs.writeFileSync(out, JSON.stringify(rows, null, 1));
  const c = {};
  for (const r of rows) c[r.locate] = (c[r.locate] || 0) + 1;
  console.log(JSON.stringify(c));
})();
````

Run as: `node locate.js <repo> ku.json ku_located.json` (ku.json is the 48 landed KNOWN-UNOPENED rows of the census, extracted by column; sha256 `b806fcaf…52f7`).

