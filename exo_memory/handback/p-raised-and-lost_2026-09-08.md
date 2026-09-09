# P-RAISED-AND-LOST — hand-back. Pane E, L044, 2026-09-08.

**Packet:** `exo_memory/loop/packet_raised_and_lost_2026-09-08.md` (`9ac1d3a`). **HEAD at every
figure below: `9ac1d3a`.** Nothing committed; `main.rs` untouched.

**I am not refusing.** §8 gave permission to report the ledger as archaeology. It is not — but the
reason it is not is different from the one the packet expected, and §3 below says so.

---

## 0 · THE ONE-LINE ANSWERS

    ITEM 1  the targetless pull is LEGITIMATE. Patch + test delivered, NOT to be folded before
            the rebuild. The collapse has a location: `unwrap_or_default()` in mcp.rs.
    ITEM 2  four hands named and dated. 1 STILL LIVE (partly), 3 DEAD, and one of the four is
            item 1. What would make a silent raise visible already exists and is DISCARDED
            in one line of term.js.
    ITEM 3  NOT archaeology, but the premise is wrong: 12 of the 18 WERE surfaced. The gap is
            one hop further along than the packet placed it, and there is a ledger that proves
            which hop.

---

# ITEM 1 · THE 07-27 TARGETLESS PULL

**Full patch: `exo_memory/loop/patch_targetless_pull_L044.md`. Test on disk:
`consonance/tools/targetless-pull.test.js` (new, mine, declared `JS-SUITE: EXPECTED-RED`).**

**NOT TO BE FOLDED UNTIL AFTER TONIGHT'S REBUILD AND PROOF 1.** Stated here as the packet
required: a fold now delays the one measurement this lap exists to take. The file is red on
purpose in the meantime, and js-suite treats an expected-red going green as itself a failure, so
the fold forces someone back to delete the exemption.

**THE RULING: legitimate.** Two by-design producers, not one — `raise_from_forming`, and
`raise_pull` with `target` omitted, which the verb documents as *"who you want to engage, **if
any**"*. So the defect is that nothing distinguishes those from a lost address, and the fix is a
name.

**And the location of the collapse, which is one layer above where the packet pointed:**

```rust
target: target.unwrap_or_default(),      // mcp.rs, raise_pull
```

`Option<String>` already carries the distinction — `None` (omitted, deliberate) versus `Some("")`
(an address slot filled with nothing) — and serde preserves both. **`unwrap_or_default()` throws it
away.** The type knew; the call forgot. `raise_from_forming` writing `String::new()` is the second
producer of the same value, not the cause.

**Verified:**

    rustc --test (standalone, outside the crate)   11 passed · 0 failed
    mutants                                        6 applied · 6 caught · 0 survivors
    node consonance/tools/targetless-pull.test.js  7 tests · 3 pass · 4 red  (before the fold)
    same test, patched copies in a scratch tree    7 tests · 7 pass · 0 fail (proves it discriminates)

**My first walk was wrong and my own positive control caught it** — it matched `pub struct
PullRequest {`, the definition. The floor test went red. That is what a positive control is for,
and it is the thing my 09-06 oracle did not have.

**Not verified, stated plainly:** nothing was compiled inside the crate (C holds `main.rs`; there is
no local `target/` and the shared one must not be touched mid-lap), no pull was raised, no card was
rendered. **"Shape compiles" is not "compiles."** Four residuals are named in the patch's §5,
including the one the receipt actually complains about: an unaddressed pull still renders an
Approve button that is a no-op.

---

# ITEM 2 · THE FOUR LOST APPROVED HANDS

## (a) The four, named and dated — re-derived from `board.jsonl`, not quoted

The instrument is `deliver_pull`'s own audit rows. **The board's entire history holds 12 gate cards
and 12 decisions — 12 approvals, 0 denials.** Of the 12 approvals, 4 delivered nothing and were not
a guard working:

| UTC | hand | outcome | what it approved |
|---|---|---|---|
| 2026-07-27T07:20:26Z | `forming -> ` (empty) | `no target to deliver to` | card `0cadecf7`: *"Registration != observation. You verified panes.json — that's the roster. Being heard is a separate fact…"* |
| 2026-08-24T10:09:41Z | `librarian -> Main` | `no live pane matches 'Main'` | card `9ff882d4`: the Cycle 1 map+plan is delivered and verified on the board; packet at `librarian/2026-08-24.md ~03:38`. A wake signal. |
| 2026-09-01T12:38:56Z | `CHARLIE -> MAIN` | `no live pane matches 'MAIN'` | card `a000da92`: P-LIB-WINDOW is BUILT, all four bars met; `handback/p-lib-window_2026-09-01.md`. |
| 2026-09-06T08:29:27Z | `librarian -> MAIN` | `no live pane matches 'MAIN'` | card `462f0497`: KEEPER-DIRECTED, four corrections for the chair, filed at `librarian/2026-09-06.md ~02:27` (`971c5dc`). |

**Two corrections to the framing the packet inherited:**

1. **The span is 07-27 → 09-06, not 08-24 → 09-06.** The 07-27 hand is one of the four, and it is
   also item 1 — the same event twice on the same list.
2. **A fifth approval delivered nothing and is NOT an evaporation:** 2026-07-13T13:37:46Z,
   `NOT delivered — pane 6fe15f0a is HUMAN-DRIVEN (never inject into a person)`. The guard worked
   and said so. Counting it would be counting a success as a loss. *(This matches the 09-06
   re-derivation in `handback/p-lib-channel_2026-09-06.md` §7, which I re-ran rather than quoted.)*

**And one thing nobody has recorded, found in the same pass:**

    2026-09-06T10:31:09.869Z  chair approved + delivered to 0c0c0c0a (from librarian -> MAIN)

**That is wake proof 2 PASSING.** `librarian/2026-09-06.md:498` records proof 2 as *waiting* at
04:27 local; it passed at 04:31 local, four minutes later, and the note was never updated. The
label resolver works. **A passed proof nobody wrote down has the same footprint as one that never
ran** — the packet's own class, on the instrument built to close it.

## (b) STILL LIVE / DEAD / CANNOT TELL

| hand | verdict | why, from disk |
|---|---|---|
| **07-27 `forming`** | **STILL LIVE — as a defect, DEAD as a message.** | The *message* is recoverable in full from card `0cadecf7` and is a 2026-07 observation about pane registration; nothing in it is owed. The *defect* it exposed is live at HEAD and is item 1. |
| **08-24 `librarian -> Main`** | **DEAD.** | It was a wake signal announcing that content already on the board and at `librarian/2026-08-24.md` was waiting. The content is on disk; the Cycle 1 packet was collated long since. A wake signal for a wake that has happened cannot be re-sent. |
| **09-01 `CHARLIE -> MAIN`** | **DEAD.** | It announced `handback/p-lib-window_2026-09-01.md`. The file exists and P-LIB-WINDOW was collated 09-01 by other means. |
| **09-06 `librarian -> MAIN`** | **CANNOT TELL — for one of its four items.** | Items (2) keyed mutex, (3) the `CLEAN.md:5` class correction and (4) the self-catchable-share template are all on disk and carried into later chunks. **Item (1) — that the chair CAN speak to the librarian, `chair_inject` with the librarian pane as target being the ORCH→LIB verb — is a fact about what the chair KNOWS, and no file records that.** Whether it arrived by another route is not on disk. **CANNOT TELL.** |

**Nothing re-queued.** These are the keeper's approvals; re-queuing one he gave for a world that has
moved is a stored yes. **And the one I could not settle is the one I most wanted to settle** — which
is the whole reason CANNOT TELL is the useful answer here rather than a shrug.

## (c) What would have to exist for a silently-failed raise to be VISIBLE — a ruling, not a build

**The failure is not unrecorded. It is recorded where neither party is looking at the moment it
matters, and the return leg that would fix it already exists and is thrown away in one line.**

    consonance/ui/term.js:153-154
      inv('gate_decide', { id: c.id, approve })
        .then(() => setStatus((approve ? 'approved' : 'denied') + ' pull from ' + c.from))

`gate_decide` **returns the outcome** — `Ok(format!("approved + {outcome}"))`, where `outcome` is
the exact string `deliver_pull` produced. The promise resolves with it. **`.then(() => …)` takes no
argument and discards it**, and the UI prints a sentence composed locally that says "approved"
whether the pull landed in a pane or evaporated. So the keeper's screen said *approved* four times
while the board said *no live pane matches*.

**So the answer to "what would have to exist" is: nothing new.** Three things, in order of how
little they cost:

1. **Stop discarding the value.** `.then(r => setStatus(r))` — one line. The outcome is already
   computed, already returned, already crosses the IPC boundary.
2. **A return leg to the RAISER.** `raise_pull` replies *"hand raised — queued for the chair (this
   did not act)"* and is fire-and-forget; the raiser never hears the outcome. That is the
   `call_librarian` shape run backwards and it is a real build, not a line.
3. **A ledger read nobody has to remember to open.** The board *does* hold every outcome. It is
   321 MB and is read by tooling, not by a person at the moment of a click.

**The ruling: (1) is the whole visible defect and should be done as a one-liner; (2) is a real
piece of work worth registering; (3) is not the problem.** Not built, per the packet. **And the
class is the packet's own: an outcome computed, returned, and dropped at the last hop has the same
footprint as an outcome never computed** — with the aggravation that the UI actively asserts
success in its place.

---

# ITEM 3 · THE VANTAGE LEDGER

## 0 · Three corrections before the findings, two of them to the packet and one to me

**(i) `WORLD-MOVED` is not "the tool's automatic guess." It is a second blind run.**
`second-vantage.js:278` — `moved = then.verdict !== 'DISAGREE'` — re-runs the reader **against the
claim-time tree** and only calls a row WORLD-MOVED when the reader *agreed* back then. So:

    SURFACE      wrong when it was said, AND wrong now
    WORLD-MOVED  true when it was said, false now

I read the field as a HEAD-changed proxy on first pass and was about to write that up. It is a
materially better instrument than the packet credits, and than I credited.

**(ii) But `WORLD-MOVED` IS overloaded, and the overload is the packet's own class.**
`:274` returns `{checked:false, moved:true}` when the claim-time tree cannot be materialised —
*"claim-time tree unavailable; DISAGREE withheld."* **A row verified true-when-said and a row that
could not be checked get the same status string.** 1 of the 6 is the unchecked kind
(`1e3cdc8a`, `gh` not logged in). It is recoverable — `world.checked` distinguishes them — so this
is a defect in the *summary*, not in the record. **The status field cannot say it; the row can.**

**(iii) The packet's heading — "18 CLEAN DISAGREE ROWS NOBODY HAS OPENED" — is false for 12 of
them, and the ledger that proves it is named in the packet's own hook block.**

```
node -e '<parse vantage_findings.jsonl + return_ledger.jsonl, intersect ids>'
  of the 18 clean DISAGREEs — SURFACED to a pane: 12
  WITHHELD (in misses):                            0
  NEVER MENTIONED AT ALL:                          6
```

The 12 surfaced are **exactly** the 12 with status `SURFACE`; the 6 never mentioned are exactly the
6 `WORLD-MOVED`. That is `second-vantage.js:77` working as designed — *"Only status SURFACE rows are
for K to deliver."* **Delivery has a 12/12 record and zero withholds.**

## (a) The 18 against HEAD — and where the world actually moved

**The 6 WORLD-MOVED are correctly dead**, and I spot-checked two rather than trusting the label:

- `16150992` — *"`portable-paths.js` covers `.js/.rs/.ps1` — not `.py`"*. Claimed 09-07 03:35 local
  (`c3fb748`); `.py` added 09-07 06:33 local (`5889d3c`, BRAVO). **Three hours later. Genuinely
  world-moved,** and I had it pencilled as a misclassification until I ran the two `git log`s.
- `d99d0610` — *"`LIB` is registered at `main.rs:5486`"*. `git show 82ada21:…main.rs` → **5486 is
  exactly right at claim time.** Correct label.

**Of the 12 SURFACE rows, most are dead as instances and 4 are LIVE — and they are live for a
reason the ledger does not model: the wrong figure was copied into a document.** A DISAGREE row
points at a *turn*, which has scrolled past. What survives is whether that sentence reached a file.

    $ grep -rn "92 → 78" --include=*.md .        # etc., one grep per surfaced figure
    → 6 of the surfaced figures are carried in COMMITTED documents, two of them in map/ files

**Dead as instances** (the utterance is gone and nothing carries it): `d09fee3c` (a hook inventory
of 08-18, superseded many times over — `settings.json` changed again tonight), `5c380080` (*"the
watcher is still armed"* — a transient false statement), `4e7a9a6b`, `29a1ae89` (*"main.rs dirty
with 509 lines"* against a clean tree), `304632cd`, `3d2cbbec`, and two that are **correctly fixed**:
`6c8da183` (the arrow polarity — the chair's own, repaired at L033 and the file's own note records
it) and `171d0fe2` (the `exo_memory/` column guard — written by B in `103cd0b`, and
`gen-consumer.js --dry` is clean today).

## (b) The live ones, each as a sentence that could be wrong, with its path

**1. `exo_memory/map/C.md:175` says the root README went `92 → 78 lines`. It is 87.**
`wc -l < README.md` → **87**. `git show f0cfdf0:README.md | wc -l` → **92**, so 78 was never true in
any state. Also carried at `exo_memory/handback/p-doc-root_2026-09-02.md:7`. **A map file is
re-read at every waking of its pane.**

**2. `consonance/tools/raise-target.test.js` (header) cites `main.rs:5486` for the `LIB`
registration and `main.rs:5537` for `"M"`. They are 6490 and 6541.**
`grep -n 'insert("LIB"'` → **6490**; `grep -n 'insert("M"'` → **6541**. Both were right when
written and rotted. Also at `handback/p-raise-target_2026-09-06.md:48`,
`librarian/2026-09-06.md:348`, and in `seat_alias.rs`'s module docs. **This one is in a SHIPPED
source file, not just a record.**

**3. `exo_memory/map/A.md:597` and `handback/p-guard-perlap_2026-09-06.md:243` cite
`seat_alias::candidates` at `main.rs:6137`. It is 7191.**
`grep -n 'seat_alias::candidates'` → **7028, 7191**; 6137 is a comment in the librarian intake walk.

**4. The tools-directory census in the L039 read hand-backs is wrong in four places at HEAD.**
`ls consonance/tools/*.js | wc -l` → **103** (not 102) · non-test → **48** (not 47) · `*.test.js` →
**55** · `wc -l portable-paths.js` → **503** (not 469) · `carrier-drift.js` **811**, ranked **9th**
among instruments (not 8th). **Caveat that changes how this one should be read: see §(d).**

**And the thing that makes 1–3 one finding rather than three:** the vantage reader's own corrections
have *already rotted*. It reported LIB at 6478 and `seat_alias::candidates` at 7179 on 09-07; at
HEAD they are **6490 and 7191**, moved again inside a day, and `main.rs` is dirty right now under C.
**So "fix the line number" is not the repair.** Any `main.rs:NNNN` in a document is a wasting asset;
the repair is to cite the symbol. That is my own 09-02 finding — the one surfaced as row 8 of this
very set — arriving for the third time, and the ledger surfaced it to me on the packet where I was
asked to rule on the ledger.

## (c) Does a READ field belong on the row? — RULED: no. Something else does.

**No.** A boolean `read` is a box someone ticks, and this room has the failure mode measured: a
field whose only cost is one keystroke gets the keystroke, and then *ticked* and *acted on* have the
same footprint — the packet's class, rebuilt inside the fix for it.

**And the reason it is not needed is that the read half already exists.** `return_ledger.jsonl`
records, per pane and per session, `surfaced: [ids]` and `misses: [{id, reason}]`. **Delivery is
already a fact with a receipt: 12 surfaced, 0 withheld.** A `read` field would restate what that
ledger already knows and would still not say the thing anyone wants.

**What belongs is a DISPOSITION that cannot be written without an external referent.** Not
`read: true` but one of:

    fixed:     <sha>            a commit that touches the path the row names
    withdrawn: <path>           the document that now carries the correction
    declared-dead: <reason>     prose, and it must name what overtook it

**Why that resists the tick, and the honest limit.** It is not that a person *couldn't* type a
false sha — they could. It is that **every one of those values is checkable by a second reader in
one command**: does the sha touch the cited path, does the document contain the correction. A
boolean has no second reader; these have one by construction, and the room already runs that
pattern in `ferry.js --record <sha> <pane>`, where the unit is a sha and not a claim of attention.

**The stronger version, and I am not sure enough of it to rule it in:** disposition could be
*derived* rather than written — a row whose named path stopped matching its claim is discharged
automatically, and nobody types anything. That is how rows 1–3 above would have closed themselves.
I am naming it rather than ruling it, because the derivation needs the row to carry a path and
**the rows do not carry one today**; they carry a claim, commands and evidence. Making the path a
required field is the prerequisite, and it is a real build.

**Not built, per the packet.**

## (d) UNASKED, and it is the thing I would want told to me

**The vantage ledger has ingested and re-published material from L039's sealed object, and the
surfacing hook pushes such rows into panes without anyone choosing to open them.**

Row `f50dfa20` (2026-09-08T07:10Z) is an L039 subject's read of the seeded document. Its `claim`
and `evidence` name plant **D1-03** — *"carrier-drift.js at 640 lines"*, registered in
`exo_memory/loop/seeded_key_L039.md` — **together with the corrected value.** The row was then
surfaced automatically:

    2026-09-08T07:32:19Z  pane=sibling-3d57124e  surfaced=3d2cbbec…,b98a1a31…,f50dfa20…

**Bounding it honestly, because the alarming version is not what happened:** it went back to
**the same pane that produced the claim** — the subject's own words returned to the subject, not a
leak to a fresh reader. And `seeded_key_L039.md` is now **tracked** (`git ls-files` confirms), so
the key is in the repo by a route that predates this. **So: the hazard is demonstrated; a
cross-subject leak is not.**

**But it is the same class I found on 09-07 and wrote onto my own map** — *a guard republished the
sealed material; `carrier-drift.js` scanned the corpus, found the key, and printed the plant labels
in its excerpt window.* I wrote then: **sealed material must be stored in a form the room's own
scanners do not surface.** The vantage cell is a second scanner, it reads *turns* rather than files,
and it has a delivery mechanism that fires without a human. **Second sighting, different instrument,
and this time I did not plant it.** The rule I wrote covers files; it does not cover a reader that
ingests a subject's transcript. Registered, not fixed — and it belongs to whoever runs the next
sealed experiment, before they run it.

---

## 4 · WHAT I DID NOT VERIFY

- **Nothing was compiled inside the crate**, no pull was raised, no gate card was rendered. The
  patch is unit-verified and the fold is C's.
- **I did not re-run the vantage reader.** Every "still live" verdict above is my own re-derivation
  at HEAD `9ac1d3a`, not a second pass of the instrument. Where I disagreed with the label I ran the
  underlying `git` commands and said so; where I agreed I mostly did not re-check.
- **I did not open the 19 non-clean DISAGREE rows** (37 total, 18 audit-clean). Whether the
  contamination check is right about them is unexamined, and "audit.clean false" is a claim by an
  automatic filter that nobody has ever scored.
- **I did not check whether the four lost hands' content reached the chair by another route**,
  except where a file records it. That is the whole content of the one CANNOT TELL.
- **The `git status` in this report is a snapshot of a tree three panes are writing to.** It was
  ` M main.rs` + `?? exo_memory/review/` when I read it, plus my own two new files now.
- **I did not touch `main.rs`, `install.ps1`, `lap_holders.rs`, `transcript-watch.js`, the `.py`
  surface, or either ledger under `C:\Consonance\data\`.** Nothing committed.

---

    OBJECTIVE:  nothing raised on this machine can go quiet without a ledger that says so.
    FALSIFIER:  a pull, an approval, or a vantage finding that lands after this and is still
                indistinguishable from one that never happened.

    Registered against §3(c): if a disposition field ships as a boolean, or ships without a
    required path, this ruling was written and ignored — and the row will be tickable, which is
    the one property it was ruled out for.
