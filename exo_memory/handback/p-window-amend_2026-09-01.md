# P-WINDOW-AMEND — hand-back (ALPHA, 2026-09-01 ~04:40, L025)

**AMENDED, not re-registered.** One file touched: `exo_memory/loop/librarian_window_registration_2026-09-01.md`.
`git diff --stat` = **382 insertions, 0 deletions** — a head scope-mark (8 lines) and a new §10.
§1–§9 are byte-unchanged. Nothing committed. `main.rs`, `COMMITTEE.md`, `ui/` untouched.

---

## THE ANSWER THE PACKET ASKED FOR, PLAINLY

**Two rules, one registration — and the split does not run between the carriers, it runs THROUGH
carrier 2.**

The refusal the chair offered (*"these are two mechanisms and need two rules"*) is **taken, in a
sharper form than it was offered.** Sorting rules by *carrier* gets it wrong in both directions:

- **W1 (a window — §3's shape)** governs any **append-ordered homogeneous series**: the librarian's
  dated notes (carrier 1) **and three blocks inside carrier 2** — BOOT's dated journal pointer tail
  (25,368 B), the topic list (24,098 B), the live edge (7,440 B).
- **W2 (not a window at all)** governs the **heterogeneous fixed set**: BOOT's body, the deck,
  COMMITTEE, the references. There is no order, so nothing is "newest" and eviction-by-position is
  uninstantiable. W2 must be a **level** rule with an owner.

**Assigning by carrier would put a window on BOOT's *body* (impossible) and no window on BOOT's
*tail* (where one plainly belongs).** W1 is a rule about a RATE; W2 is a rule about a LEVEL.
Carrier 1 needs only W1 (its budget is not binding: 1,134,102 of 2,200,000). Carrier 2 needs both.

**W1 already has a working instance inside carrier 2**, which is the evidence the shape generalises:
`LIVE_EDGE = 25` (`main.rs:2561`) is a window, and it holds — the windowed block is 7,440 B while
the unwindowed topic list beside it is 24,098 B.

---

## THE ARITHMETIC THAT FORCES IT (this is the load-bearing part)

`map_allowance = SHELL_SOFT_CEILING - fixed - SHELL_TRANSCRIPT_FLOOR` is non-negative only when the
**fixed brief <= 140,000 - 30,000 = 110,000**. Today it is **144,529 — 34,529 over, 31%.**

With the topic map cut to **zero**:

    315 + 65,055 + 37,608 + 8,372 + 1,064 = 112,414  >  110,000

**A window over carrier 2's one append-ordered block is NECESSARY AND PROVABLY INSUFFICIENT** at any
N. 71% of the bulk (BOOT + deck = 102,433 B) has no order to window by. Two additions, not a taste.

---

## THE CORRECTION IN KIND — `evict=0` is an empty queue **AND a dead evictor**

Your `librarian/2026-09-01.md:522-524`: *"the transcript is already 5.7k against its own 30k floor
(`SHELL_TRANSCRIPT_FLOOR`, `:3461`) … `evict=0` is not a broken evictor, it is an evictor with an
empty queue."* First half right; second half right only for today's transcript size.

1. **The transcript has no floor.** `SHELL_TRANSCRIPT_FLOOR` has exactly five sites: `:3461`
   (definition), `:3477` (inside `map_allowance`), `:3852/:3860/:3861` (tests). The transcript's own
   budget at **`:3990`** is `SHELL_SOFT_CEILING.saturating_sub(brief.len() + fence_overhead)` —
   **no floor term.** The 30,000 sizes the MAP's share; it protects the transcript only while the
   fixed brief stays under 110,000, false since 2026-08-25 09:17.
2. **At budget 0 the evictor cannot fire for any transcript size.** `excess = len - 0 = len`;
   `split_off_oldest_records` seeks a boundary at index `>= len`, finds none, returns `None`.

**Demonstrated with the same input and one variable moved** — a byte-faithful mirror of
`main.rs:3881-3891` against a real 211,380-byte transcript on disk:

    transcript 211,380 B, brief 144,529 -> budget 0      -> NULL, NOTHING EVICTED
    transcript 211,380 B, brief 100,000 -> budget 39,735 -> evicts 171,687, keeps 39,693

    cd C:/Consonance && node -e '
    const fs=require("fs");
    function split(buf,excess){const m=Buffer.from("\u276F","utf8");let idxs=[];
      for(let i=0;i<buf.length-2;i++){if(buf[i]===m[0]&&buf[i+1]===m[1]&&buf[i+2]===m[2]&&(i===0||buf[i-1]===0x0a))idxs.push(i);}
      const cut=idxs.find(i=>i>=excess); if(cut===undefined||cut===0)return null; return [cut,buf.length-cut];}
    const t=fs.readFileSync("data/captures/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f.txt.bak-20260714");
    for(const brief of [144529,100000]){const budget=Math.max(0,140000-(brief+265));
      console.log("brief",brief,"budget",budget,"->",t.length>budget?JSON.stringify(split(t,t.length-budget)):"fits");}'

**Why it matters to B's build and not only to the record: the cuts REVIVE the evictor**, because
budget stops being zero — and therefore **a partial cut is worse than it looks.** If the fixed brief
settles anywhere at or above ~139,700, budget is still 0, the evictor is still dead, and the
transcript grows unbounded while the shell reads "nearly fixed."
**Registered as reading (iii-b): the build's reading must be the BUDGET, not the brief size.**

---

## THE UNCURATED SERIES NOBODY READ — added to what you already found

You rowed tonight's `SHELL OVER CEILING` lines at `:489`, `:503`, `:516` and called the condition a
pre-existing red with no owner. **That is not restated; what is added is the dated series and the
rate**, which a single reading cannot give and a window registration needs.

**32 lines in `data/persist.log`, 10 distinct (timestamp, value):**

    2026-08-25 09:17:26  140,042   <- first crossing
    2026-08-25 11:13:39  141,798
    2026-08-29 00:24:06  140,746
    2026-08-30 00:25:31  142,467
    2026-08-31 00:51:42  144,419
    2026-09-01 01:22:44  145,134
    2026-09-01 03:48:04  144,531 / 144,529   <- tonight, four panes

**+5,092 B over 6.67 days = 763 B/day**; last two intervals +1,952 and +715. Two dips — a range, not
a constant, and the prediction below is stated against the *slower* figure so it can lose.

**The finding about the room, not the code:** that log line exists *because* the 2026-08-09 build
found that "the ceiling stopped working silently … the only symptom was a warning banner inside the
pane." **The fix for silence was a loud line in a file nobody reads** — seven days of a number
nobody wanted, produced nightly, reaching no one until a keeper's packet routed a seat to it.

---

## THE CUT THAT COSTS NOTHING — new, and it changes your map's resonance cut

Your two cuts check out: `144,529 - 25,368 - 16,538 = 102,623`, **7,377 B under 110,000.**

**At the measured rate that is 5.5 to 9.7 days.** 7,377 ÷ 1,334 = 5.5; ÷ 763 = 9.7. **This is
F-growth again one carrier over** — *"the tier bought a week rather than a fix."* The cuts are
necessary and are not the rule; that is the whole argument for W2 existing at all.

**And the resonance cut can be made entirely out of lines that point at nothing.** Of the topic
map's 52 topic lines (23,438 B), **40 name a document that does not exist on disk — 18,730 B.**
`data/resonance/topics/` holds 12 `.md` (newest mtime 2026-07-26 07:30); `curator_state.json` holds
52 topics (mtime 2026-07-26 07:54). The block's own sentence — *"each line is a document you can
read in full"* — is false for 77% of its lines, in every shell assembled today.

    cd C:/Consonance && node -e 'const fs=require("fs");let d=0,o=0,dn=0,on=0;
    for(const m of fs.readFileSync("instances/sibling-0845a868/CLAUDE.md","utf8").matchAll(/^- \*\*([a-z0-9-]+)\*\* \(\d+ live\)/gm)){
    const b=Buffer.byteLength(m[0]);fs.existsSync("data/resonance/topics/"+m[1]+".md")?(o+=b,on++):(d+=b,dn++);}
    console.log("resolving",on,"| dangling",dn);'

So the map cut is a **fork the keeper picks, not me**: **(c1)** drop the 40 dangling lines
(**-18,730**, exceeds your 16,538 target, loses no reachable content — the atoms are the master and
the docs are regenerable) or **(c2)** regenerate the 40 documents (map stays 31,538; the cut must
come from real content instead).

**Consequent invariant, registered as §10.9 and binding on BOTH rules:** *every path a window emits
must resolve at assembly, and a **guard** must assert it.* Indexing IS the window's mechanism, and
here it is measurably broken in the very carrier being windowed. **A log line will not do** — §10.2
is the proof this room writes loud lines into files it does not read.

---

## W2's SHAPES, PRICED AND NOT PICKED (§3's discipline, applied to carrier 2)

- **(g) A HARD TOTAL enforced by a test** — `assemble_intake().len() <= 110,000`, red build. Fires
  before any pane wakes rather than into a log. **Says nothing about what to cut**: a red build at
  3am with no automatic yield, which is the point and the cost.
- **(h) PER-BLOCK BUDGETS with a named owner** — localises pressure to whoever grew the block, the
  only thing that changes behaviour. Cost: six numbers instead of one.

***Lean declared, and it lands on the WEAKER rule*** (§3's own form): **(g) is the default**, because
its single number has provenance and (h)'s six would all be chosen tonight. (g) blocks without
localising, so it will be met by whoever is nearest rather than whoever grew the block. The keeper
picks knowing that. **(h) is named now as W2's one permitted amendment.**

Your ruling-out of the deck and COMMITTEE is carried unchanged and not re-derived. One datum it
carries anyway: `exo_memory/cards` was **50,511 B on 08-01, 29,026 on 08-10, 37,411 on 08-31** — a
**21,485-byte hand curation with no rule, then 8,385 B of regrowth in 21 days.** Curating below
capacity by hand has already been tried on this carrier.

---

## THE THREE THINGS THE PACKET SAID TO CARRY FORWARD — checked at the wider scope

1. **Two rule shapes priced and not picked — HOLDS**, and is now done twice: §3's (a)/(b) for W1
   still unpicked and unmoved; §10.6's (g)/(h) for W2 priced with a declared lean on the weaker one.
2. **Prediction stated before any landing — HOLDS, verified rather than asserted.**
   `git log 0602d39..HEAD` = `a028961`, `fed34a6`; neither touches `main.rs:4562`, and the tier tuple
   is byte-identical to the registered version. §4's reading (i) has not been taken. The shelf header
   moved for growth alone (66 files / 1,134,102 / 447 indexed; notes 577,409 = 50.9%, against §1's
   65 / 1,075,876 / 319 and 51.4%). **There is not yet an outcome to fit to.**
3. **The abuse condition — HOLDS, and is TIGHTENED by the second carrier, with the mechanism named:**
   *a per-carrier N is a fit unless its provenance predates the measurement it will be scored
   against.* With one carrier you can tune once; with two you can tune the second to make the first
   look right.
   - **W2's number is not mine and may not move:** 110,000 = `SHELL_SOFT_CEILING` -
     `SHELL_TRANSCRIPT_FLOOR`, both dated **2026-08-09**, written by another seat for
     `map_allowance`. (You reach "under 110k" at `:568` from the other direction — two derivations,
     one number.)
   - **§3's N = 150,000, §4's bar = 400,000, and §5's single amendment (a)->(b) are untouched and
     unspent.**
   - **W2 gets exactly one permitted amendment, named before any landing: (g) -> (h).**
   - **The numbers I DID choose, said plainly: the 14-day and 60-day horizons.** Mine, from a
     7-point series with two dips, fixed now with their arithmetic beside them. Moving either after
     a reading is a fit, and that sentence is in the file so it is readable from outside.

---

## PREDICTIONS REGISTERED FOR CARRIER 2 (all pre-landing)

- **(iii)** After the rebuild carrying the cuts: `grep -c "SHELL OVER CEILING"` does not increase and
  the newest `fixed_brief=` is **<= 110,000**. Seconds to check, no compaction. Failing = the build
  did not implement the cuts; stop there.
- **(iii-b)** At the same rebuild, `140,000 - (fixed_brief + 265)` must be **> 0** — the dead-evictor
  reading, which a naive under-140k check passes at 139,800.
- **(iv)** If the cuts land with **no standing rule**, `fixed_brief` exceeds 110,000 again **within
  14 days** (needs only 527 B/day, below every measured interval). **Refuted** by a fixed brief still
  under 110,000 on day 14. **VOIDED, with no credit taken**, by a deliberate curation cut in the
  window or by the rule landing with the cuts — written down because a void that pardons the thing
  it tested is this room's own named failure.
- **(v)** If **(g)** lands, (iv) is unobservable, so instead: **the build goes red on a fixed-brief
  overage at least once within 60 days.** Never going red = the growth was not a standing pressure
  and W2 was a rule against nothing.

---

## CORRECTIONS I MADE TO MYSELF, AND WHAT THIS DOES NOT ESTABLISH

**Self-corrections:**
- I first read the fixed brief as unsatisfiable *full stop* (112,414 floor > 110,000 with the map at
  zero, therefore no cut reaches it). Wrong: that floor assumes BOOT stays whole. **Your BOOT-tail
  cut is what makes 110,000 reachable**, and the finding survives only in its precise form — a
  map-only window is necessary and insufficient. Corrected before it was written down.
- My per-block sum is **149,669 against a 149,668-byte file** — one byte over, from my split's
  trailing newline. Stated in the file rather than reconciled away; the file size is the citable
  number.
- The chair's block figures and mine differ by 72 (BOOT), 46 (deck), 1 (prior conversation) and
  agree exactly on the map and COMMITTEE. **Boundary convention, not disagreement** — said so rather
  than quoting one set as authoritative.

**What it does not establish:**
- **The 150,000 harness cap.** It is a **code comment** (`main.rs:3446`), unverified by me, and it is
  stated in **chars** while every ceiling comparison in the code is in **bytes** — this shell is
  149,668 B / 147,393 chars, a 1.54% / 2,275-byte gap. Conservative, and **registered before anyone
  finds it**, because "discovering" 2,275 bytes of headroom later and moving a number is the exact
  fit §5 forbids. If a shell over 150,000 is assembled and nothing observably breaks, the premise is
  wrong and carrier 2's urgency is overstated — say so rather than re-scope.
- **The 763 B/day.** Seven log points, seven days, two dips, one machine.
- **That the dangling topic lines cost anything measurable.** 18,730 bytes and 40 false pointers; no
  instance exists of a pane trying to open one and failing.
- **That BOOT or the deck should be cut.** Which block yields is the keeper's.
- **Anything about retrieval.** §6 stands unchanged. A window on carrier 2 makes an old finding no
  more likely to fire than a window on carrier 1 does.
- **That the cuts hold.** (iv) predicts they do not, and can lose.

**Bias declared, and it moved my pricing:** on carrier 1 I am not the beneficiary; **on carrier 2 I
am** — I wake into a pane brief. I priced BOOT's tail and the topic map as cheap and did not price
the deck, which is the block I would personally miss. §10.6 says so on its face.

---

## OWED NEXT

- **CHARLIE**: non-author read of §10 (chair's assignment).
- **B**: builds the pane-intake cuts, then W1. Carry **(iii-b)** into the test — budget, not brief
  size — and note that a partial cut leaves the dead evictor in place.
- **Keeper**: (c1) or (c2) for the map; (g) or (h) for W2; (a) or (b) for W1, still unpicked.
- **Not mine to do and not done:** nothing committed; `main.rs`, `COMMITTEE.md`, `ui/` untouched.

*ALPHA, 2026-09-01 ~04:40. A trace to re-run, not a doctrine to believe.*
