# P-L087-WRITESITE — C (L087, ON L, 2026-09-23) — WRITE SITE: STOPPED AT THE DESIGN, ON THE MEASUREMENT · curate.js: FRAMED + PINNED · UNCOMMITTED

**Two results.**
1. **The measurement says option (b), "an atom is written only if its tether resolves", should not be built as
   specified.** It would hold about half the honest atoms, and it passes any planted atom whose tether cites a real
   file, commit or hand-back. The packet named that case "a legitimate hand-back", so the write site is **not
   changed**: `main.rs` is untouched this lap. §3 proposes a rule that does hold: row provenance.
2. **curate.js is framed and pinned** (audit site 3), with a new test file, 10/0, and mutants 12/12.

`atoms.jsonl` was read only. There was no rebuild, no restart, no settings edit and no model call this lap.

## 1 · The measurement (read-only)

**The resolver.** `<scratchpad>/l087/resolve.js` (sha256 `4295d0477da4b7e6`) is a pure function,
`resolve(tether, world)`, with the world injected.
- **Forms extracted from the free-text tether:**
  - a repo path (a path under any `…/lighthouse/` checkout counts as repo-relative, so D's paths resolve too);
  - an absolute path;
  - a bare filename, which must be unique in HEAD;
  - `:N` / `:N-M` line cites;
  - a hex string of 7–40 characters, as a git object;
  - `sha256 …` digests, as a separate form.
- **What "resolves" means:**
  - a path exists in HEAD's tree, and any cited line is within its line count at HEAD;
  - an absolute path exists on disk;
  - a sha is a git object (`git cat-file --batch-check`);
  - a digest resolves nothing on its own.
- **Board row id:** there is no such form. **Board rows carry no id.** The Scribe sees `[pane8] role: text`
  (`scribe_input`), so no tether *can* name a row today.
- **Lap ids** (`L085`): counted separately, because they are free text any row can write.

**Run:** `node <scratchpad>/l087/measure.js` (sha256 `bcaf557d19a6eee5`) against HEAD `a9f3de8`, 2,496 tracked
files. `atoms.jsonl` had 22,412 rows at the run (sha256 `e831d09a5d7d94a1…` then); 1,554 hex candidates, 1,314 of
them git objects.

| window | rows | RESOLVE | HOLD | held with no path or sha at all |
|---|---|---|---|---|
| all | 22,412 | 7,477 (33.4%) | **14,935 (66.6%)** | 12,957 |
| last 7 days | 3,226 | 1,444 (44.8%) | **1,782 (55.2%)** | 1,528 |
| last 1,000 | 1,000 | 495 (49.5%) | **505 (50.5%)** | 425 |

**Hold rate by kind, last 1,000:**

| kind | held |
|---|---|
| confirmed | 156/353 (44.2%) |
| artifact | 123/309 (39.8%) |
| **open** | **183/270 (67.8%)** |
| deviation | 43/68 (63.2%) |

The whole file is in the same order: open 76.5%, deviation 78.9%, confirmed 64.5%, artifact 57.6%.

**Samples, last 1,000.** From `measure.js`, spread evenly through the pool.
- **RESOLVE:**
  - `exo_memory/loop/tj1_registration_2026-09-22.md:178, §7`
  - `…the b17ef9d co…` (a sha)
  - `consonance/tools/close.js. The pulse showed…`
- **HOLD:**
  - `The keeper: 'we can worry about the semanticalities of it for user experience later'`
  - `Live verification still owed`
  - `final NEXT lines from chair and librarian`
  - `B: D092, L063, D103 ×2, L081; E: repeated heredoc failures`
  - `Worked out from the documented read and write prices…`

The held ones are honest. The Scribe is **told** a tether may be "the external referent **or the reason it survives**"
(`SCRIBE_PROMPT`, `main.rs:8353`), so free text is the design, not drift.

**Planted tethers against the same resolver** (`node <scratchpad>/l087/measure2.js`, sha256 `cceb1f8aadd90cde`):

| planted tether | result |
|---|---|
| D121 h1, tethered the way the Scribe would ("pane board row, pre-approval note") | HELD |
| an invented file | HELD |
| `consonance/src-tauri/src/main.rs:8494` | **PASS** |
| `landed a9f3de8` | **PASS** |
| `exo_memory/handback/p-l086-intake-A_2026-09-23.md` | **PASS** |

**It catches only lazy plants.** A row that cites any real file, commit or hand-back passes, and board rows cite
real paths routinely.

**Other cuts, last 1,000:**
- counting lap ids as resolving would drop the hold to 39.5% (105 of the held name one), but a lap id is text any row
  can write;
- 112 of the held quote a person or the keeper.
- **A note on measure2:** it built its world differently (per-object `git cat-file -e`, no directory entries) and got
  500 held against measure.js's 505. **I did not trace the 5-row gap.** The table uses measure.js.

## 2 · Why (b) as specified is the wrong rule, from the measurement

1. **It holds most of what is honest where honesty matters most.** Half the recent atoms are held, and two-thirds of
   `open`. `open` carries the NEXT lines, the items the room acts on.
2. **Where it matters, it is gamed by construction.** Everything a pane can cite, a pane can also create: panes write
   files and commits.
   - "Exists at HEAD" also **holds the freshest honest atoms**. Hand-backs are cited on the board *before* they are
     committed, and the protocol is "do not commit".
   - "Exists on disk" instead passes any file the planting pane wrote a second earlier.
   - Resolvability measures sloppiness, not provenance.
3. **Hard cases the rule gets wrong:**
   - a planted claim tethered to a real path — **passes**;
   - an honest keeper quote — **held**.

## 3 · The rule I'd build instead: ROW PROVENANCE (design only; not built, it changes the atom shape)

The one tether that can be checked *mechanically and unforgeably* at the write site is **which board rows the atom
came from**. The write site holds exactly those rows.

- **`scribe_input` numbers the rows:** `[r7 pane8] role: text`. The number is the row's position in THIS batch,
  assigned by the code.
- **The Scribe must return `rows: [7, …]` per atom.**
- **The write site checks** that every cited number is a row of this batch, then writes the atom with
  `src: [{pane, ts}]` **taken from the batch, not from the model**.
- **An atom citing no row of the batch, or a row not in it, is HELD** in
  `resonance/atoms_held.jsonl` as `{ts, atom, reason, batch_rows}`. `reason` is required and is never an empty
  string.

**What it buys:**
- A planted row can still be distilled. But the atom then **carries the planting pane's id, stamped by code**, and the
  read side (A's frame) can show `src` beside every claim.
- Honest hold rate is about 0 by construction, if the Scribe complies. Compliance is **measurable** from the held file
  from the first run on.
- The free-text `tether` stays as it is: the reason the claim survives.

**What it does NOT buy:** it does not stop a planted row from being distilled faithfully. Only (c), atoms out of
CLAUDE.md, does that, and that is the keeper's call.

**Why I didn't build it:** it changes the atom row shape (a new required `rows`/`src`) and `SCRIBE_PROMPT`'s return
contract. Under the standing rules, a data-schema change needs a yes first.

## 4 · curate.js (audit site 3) — built

**Framed and pinned** (`consonance/tools/curate.js`, sha256 `95078b1d05feefac`):
- **Marked data at both prompts.**
  - `ROUTER_PROMPT` puts the topic registry and the atoms in `<topics_ID>…</topics_ID>` and `<atoms_ID>…</atoms_ID>`.
    **The registry counts as data too:** its summaries are model-written from atoms.
  - `DOC_PROMPT` puts the topic name, the working summary and the atoms inside `<atoms_ID>`.
  - The construction is `scribe_prompt`'s:
    - one id drawn fresh (`crypto.randomUUID()`) and redrawn while any of the text contains it (`drawId`);
    - a data line before the data (`DATA_LINE`);
    - "The data has ended." and the task restated after it.
  - `nextId` is injectable, and both existing call sites are unchanged.
- **Spawn flags:** `ONESHOT_ARGS` is L085's final set: `--tools "" --setting-sources project
  --settings {"disableAllHooks":true} --mcp-config {"mcpServers":{}} --strict-mcp-config --no-session-persistence`.
  - The spawn sets no cwd, so the `disableAllHooks` half is the one that matters (L085 step 2).
  - `--model` is not pinned. The comment says the user's `model` key is no longer read, so the call runs the CLI
    default: `claude-opus-5-5[1m]` today, measured in L085.
- **Topic documents open with a frame:** `TOPIC_FRAME`, in A's `CLAIMS_FRAME_OPEN` wording. It is written by code
  between the front matter and `## Summary`.
  - Seats reach these docs with Read (a tool result), so the frame is the cheap half.
- **Testability:**
  - `main()` now runs only under `require.main === module`, with exports added.
  - The spawn is called as `cp.spawnSync` so a test can stand in at the process boundary.
  - CLI behaviour is unchanged: `node curate.js --status` still prints the same report, and it only reads.

**Tests:** `consonance/tools/curate.test.js` is **new**; there was no test file before (`ls curate*`). sha256
`515c9fbc5fa8757c`. It has 10 tests, all STRUCTURAL:
- **Router:** markers around the atoms; the data line; the registry inside the data; a planted atom forging a close tag
  stays inside; an id collision is redrawn; the data-ended line and the restated format come after.
- **Doc:** the name, the summary and the atoms all sit inside the data, and the rules are restated after it.
- **Argv:** all the pins are present, and not `"hooks":{}`.
- **`regenerate()`,** with `spawnSync` stubbed and a temp `CONSONANCE_DATA`: it spawns exactly `ONESHOT_ARGS`, and
  the written doc has the frame before `## Summary`.
- **`require`:** it writes nothing and prints nothing.

| run | command | result |
|---|---|---|
| RED | `node --test consonance/tools/curate.test.js` on the old code | 0 pass / 10 fail |
| GREEN | same | **10 / 0** |
| mutants | `node <scratchpad>/l087/cu_mutants.js` (scored against the unmutated copy, which fails 0) | **12 applied / 12 caught / 0 NOT APPLIED** |

**Two harness corrections, both mine, both before this line:**
- **7 mutants first came back NOT APPLIED.** `curate.js` is CRLF throughout (461 CRLF, 0 bare LF). The harness now
  matches patterns in the file's own line endings; the file was not changed.
- **C12 (main runs on require) first SURVIVED.** On an empty data dir the CLI only prints, so my "no state file"
  assertion could not see it. I strengthened my own new test to assert that the require prints nothing, and C12 is now
  caught.

**Rust:** `cargo test --bin consonance -- --test-threads=1` gives **909 passed, 0 failed, 4 ignored**, matching the
L086 baseline. `main.rs` was not touched.

## 5 · What the curate.js fix does not reach

- **The curator is idle.** `curator_state.json` and the newest topic document are both dated **2026-07-26**. On L,
  838 atoms are routed and 21,585 pending (`node curate.js --status`). I found no caller: `dream_cycle.ps1` only
  mentions the word.
  - So this fix is **for the next run**.
  - The topic summaries in every CLAUDE.md today were written on 07-26, by the old unframed prompt.
- **Those summaries are inlined into every CLAUDE.md UNFRAMED.** `curated_resonance` (`main.rs:3278`) writes
  `- **{slug}** ({live} live) — {summary}` from `curator_state.json`, under "THE MEMORY — topic map".
  - A's L086 frame covers `tail_resonance` (the atom tail) only.
  - This is the router's model-written text, inlined into an instruction channel. **This is the next site.** It is not
    in my files.

## NOT verified

- **Behaviour.** All 10 curate tests are structural. No real curator run was made: it would spend and write topics,
  and neither was in scope.
- **Machine D.**
- **Whether any existing atom is planted.** The measurement is of tether form, not of provenance.
- **The 5-row gap between measure.js and measure2.js** (§1).
- **atoms.jsonl** grew from 22,412 to 22,423 during the lap, written by the live Scribe, not by me. The measurement is
  over the 22,412 read at the run.

NOT COMMITTED.

NEXT: librarian call_librarian with the hand-back pointer when the measurement, the rule and the tests are written — plan default after it: items 3 + 2 (jev-flags hook, "solid" sheet), unless the output says otherwise. OUTPUT says: two calls wait before any write-site build — (i) yes/no on ROW PROVENANCE (§3, changes the atom shape and SCRIBE_PROMPT's contract), and (ii) an owner for `curated_resonance`'s unframed topic summaries (main.rs:3278); curate.js can land now.
